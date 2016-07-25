"use strict";

let core = require("../../core");
let _ = require("lodash");

/**
 * 数据存储在es里面
 * queue队列存储在rabbitmq里面
 * 多个程序启动时，通过读Q来爬取链接
 */
class QueueStoreOfES {
    constructor(index) {
        // es中的index
        this.es_index = `${index}-crawler-allin`;
        this.es_type_urls = "urls";
        this.es_type_rsbody = "rsbody";
        this.es_type_queue_urls = "mqurls";
    }

    /**
     * 获取id为queueItem.url的urls和queuqUrls中的详情信息
     * @param ququeItem {object} 数据
     * @returns {promise}
     */
    getUrlAndQUrlDetail(queueItem) {
        let defer = Promise.defer();

        core.elastic.mget({
            body: {
                docs: [{
                    _index: this.es_index,
                    _type: this.es_type_urls,
                    _id: queueItem.url
                }, {
                    _index: this.es_index,
                    _type: this.es_type_queue_urls,
                    _id: queueItem.url
                }]
            }
        }).then((data) => {
            defer.resolve({
                esUrl: {
                    exists: data.docs[0].found,
                    detail: data.docs[0]._source
                },
                esQueueUrl: {
                    exists: data.docs[1].found,
                    detail: data.docs[1]._source
                }
            });
        }, (err) => {
            console.log(queueItem);
            defer.reject(err);
        });

        return defer.promise;
    }

    /**
     * 根据protocol，host，post，path，depth来获取queueItem
     * @param protocol {string} 协议
     * @param host {string} 域名
     * @param port {string} 端口
     * @param path {string} 路径
     * @param depth {string} 深度
     * @returns {queueItem}
     */
    getQueueItemInfo(protocol, host, port, path, depth) {
        let url, queueItem;

        if (isNaN(port) || !port) {
            port = 80;
        }
        depth = depth || 1;
        protocol = protocol === "https" ? "https" : "http";
        url = protocol + "://" + host + (port !== 80 ? ":" + port : "") + path;
        queueItem = {
            url: url,
            protocol: protocol,
            host: host,
            port: port,
            path: path,
            depth: depth,
            fetched: false,
            status: "queued",
            createDate: Date.now(),
            stateData: {}
        };

        return queueItem;
    }

    /**
     * 添加数据到列表
     * @param protocol {string} 协议
     * @param host {string} 域名
     * @param port {string} 端口
     * @param path {string} 路径
     * @param depth {string} 深度
     * @returns {Promise}
     */
    checkUrlDetail(queueItem) {
        let defer = Promise.defer();

        this.getUrlAndQUrlDetail(queueItem).then((data) => {
            if (!data.esUrl.exists && !data.esQueueUrl.exists) {
                return defer.resolve(queueItem);
            }
            if (!data.esQueueUrl.exists && !data.esUrl.detail) {
                return defer.resolve(queueItem);
            }
            if (!data.esQueueUrl.exists && !data.esUrl.detail.fetched) {
                return defer.resolve(queueItem);
            }
            defer.resolve({
                isError: true,
                url: queueItem.url,
                err: new Error("queueItem不需要再爬取了！")
            });
        }, defer.reject);

        return defer.promise;
    }

    /**
     * 添加es中的数据
     * @param data        {object}   数据
     * @param type        {string}   类型
     * @param index       {string}   索引
     * @returns {promise}
     */
    createEsData(data, idField, type, index) {
        let defer = Promise.defer();

        core.elastic.create({
            index: index || this.es_index,
            type: type,
            id: data[idField],
            body: data
        }).then(() => {
            defer.resolve(data);
        }, () => {
            defer.resolve();
        });

        return defer.promise;
    }

    /**
     * 添加es中的数据
     * @param data        {object}   数据
     * @param type        {string}   类型
     * @param index       {string}   索引
     * @returns {promise}
     */
    indexEsData(data, idField, type, index) {
        let defer = Promise.defer();
        let config = {
            index: index || this.es_index,
            type: type,
            body: data,
            consistency: "one"
        };

        if (idField !== "randow") {
            config["id"] = data[idField];
        }

        core.elastic.index(config).then(() => {
            defer.resolve(data);
        }, (err) => {
            defer.reject(err);
        });

        return defer.promise;
    }

    /**
     * 删除es中的数据
     * @param data           {object}   数据
     * @param type           {string}   类型
     * @param index          {string}   索引
     * @returns {promise}
     */
    deleteEsData(data, idField, type, index) {
        return core.elastic.delete({
            index: index || this.es_index,
            type: type,
            id: data[idField] || null
        });
    }

    /**
     * 添加urls到esurls和queue
     * @param urls {Array} 链接数组
     * @returns {promise}
     */
    addUrlsToEsUrls(urls, key) {
        let queueItems = {};
        let defer = Promise.defer();
        let esMgetBody = [];

        // 检查url在es中是否存在
        _.each(urls, (url) => {
            let queueItem = this.getQueueItemInfo(url.protocol, url.host, url.port, url.path, url.depth);
            queueItems[queueItem.url] = queueItem;
        }, this);
        // mget一下数据
        _.each(queueItems, (queueItem) => {
            esMgetBody.push({
                _index: this.es_index,
                _type: this.es_type_urls,
                _id: queueItem.url,
                fields: ["fetched"]
            });
            esMgetBody.push({
                _index: this.es_index,
                _type: this.es_type_queue_urls,
                _id: queueItem.url,
                fields: ["fetched"]
            });
        });

        // 处理数据,先判断queueUrl中是否存在,存在则不添加到queue
        // 判断urls中是否存在,如果存在,则判断数据是否已经fetched,如果没有则加到queue里
        core.elastic.mget({
            body: {
                docs: esMgetBody
            }
        }).then((results) => {
            let urlRes, queueUrlRes, esBulkBody = [];

            for (let i = 0, n = results.docs.length; i < n; i += 2) {
                urlRes = results.docs[i];
                queueUrlRes = results.docs[i + 1];

                // queue数据库中是否存在
                if (queueUrlRes.found) { // && queueUrlRes.fields["fetched"].length && !queueUrlRes.fields["fetched"][0]) {
                    continue;
                }
                // url数据库中是否存在,判断fetched
                if (urlRes.found && urlRes.fields["fetched"].length && urlRes.fields["fetched"][0]) {
                    continue;
                }
                // 存储需要新建到queue里的数据数组
                if (queueItems[urlRes._id]) {
                    esBulkBody.push({
                        create: {
                            _index: this.es_index,
                            _type: this.es_type_queue_urls,
                            _id: urlRes._id
                        }
                    });
                    esBulkBody.push(queueItems[urlRes._id]);
                }
            }

            return esBulkBody;
        }, defer.reject).then((esBulkBody) => {
            let newQueueItems = [];

            if (!esBulkBody.length) return defer.resolve();

            // 新建数据,并添加到queue
            core.elastic.bulk({
                body: esBulkBody
            }).then((response) => {
                _.each(response.items, (createResult) => {
                    createResult = createResult.create;
                    (createResult.status === 201) && queueItems[createResult._id] && newQueueItems.push(queueItems[createResult._id]);
                });
                newQueueItems.length && this.addQueueItemsToQueue(newQueueItems, key).then(defer.resolve, defer.reject);
            }, defer.reject);
        });

        return defer.promise;
    }

    /**
     * 当一个url完成爬取后，把数据添加到esUrls中，删除esQueueUrls中的数据，最后把爬取下来的数据存到esReBody中
     * @param queueItem    {object}   url的详情
     * @param responseBody {string}   url的页面信息
     * @param key          {string}   key，区分不同网站
     * @returns {promise}
     */
    addCompleteQueueItem(queueItem, responseBody, key) {
        let defer = Promise.defer();

        this.checkUrlDetail(queueItem).then((data) => {
            queueItem.fetched = true;
            queueItem.updateDate = Date.now();
            queueItem.status = "downloaded";

            core.elastic.bulk({
                body: [{
                    create: {
                        _index: this.es_index,
                        _type: this.es_type_urls,
                        _id: queueItem.url
                    }
                }, queueItem, {
                    delete: {
                        _index: this.es_index,
                        _type: this.es_type_queue_urls,
                        _id: queueItem.url
                    }
                }, {
                    create: {
                        _index: this.es_index,
                        _type: this.es_type_rsbody,
                        _id: queueItem.url
                    }
                }, {
                    url: queueItem.url,
                    text: responseBody
                }]
            }).then(() => {
                return this.addCompleteQueueItemsToQueue(queueItem, responseBody, key);
            }, defer.reject).then(defer.resolve, defer.reject);
        }, defer.reject);

        return defer.promise;
    }

    /**
     * 添加URLS到Queue
     * @param queueItems {Array} queueItem列表
     * @returns {promise}
     */
    addQueueItemsToQueue(queueItems, key) {
        let defer = Promise.defer();

        core.q.getQueue(`crawler.urls.${key}`, {}).then((result) => {
            _.each(queueItems, (queueItem) => {
                result.ch.publish("amq.topic", `${result.q.queue}.urls`, new Buffer(JSON.stringify(queueItem)));
            });
            result.ch.close();
            defer.resolve(true);
        }, defer.resolve);

        return defer.promise;
    }

    /**
     * 添加下载完成的页面到Queue
     * @param queueItem {Object} queueItem数据
     * @param responseBody {string} 页面的html部分
     * @param key          {string} key
     * @returns {promise}
     */
    addCompleteQueueItemsToQueue(queueItem, responseBody, key) {
        let defer = Promise.defer();

        queueItem = _.extend({}, queueItem, {
            responseBody: responseBody
        });
        core.q.getQueue(`crawler.deals.${key}`, {}).then((result) => {
            result.ch.publish("amq.topic", `${result.q.queue}.bodys`, new Buffer(JSON.stringify(queueItem)));
            result.ch.close();
            defer.resolve(true);
        }, (err) => {
            console.log(err);
            defer.resolve();
        });

        return defer.promise;
    }

    /**
     * 数据分析完毕后存入到es中
     * @param queueItem {Object}
     * @param data      {Object}
     * @param type      {String}
     * @param index     {String}
     */
    addCompleteData(queueItem, data, type, index, keyField = "url") {
        // _.forEach(data, (d, key) => {
        //     if (_.isArray(d)) {
        //         data[key] = JSON.stringify(d);
        //     }
        // });

        if (!data[keyField] && keyField !== "randow") keyField = "url";

        return this.indexEsData(_.extend({
            url: queueItem.url,
            createdAt: Date.now(),
            updatedAt: Date.now()
        }, data), keyField, type, index);
    }

    /**
     * 返回es中,数据的总数
     * @returns {Promise}
     */
    getCount(key) {
        let promises = [];

        promises.push(core.elastic.count({
            index: this.es_index,
            type: this.es_type_rsbody
        }));
        promises.push(core.elastic.count({
            index: this.es_index,
            type: this.es_type_queue_urls
        }));
        promises.push(core.q.getQueue(`crawler.urls.${key}`));

        return Promise.all(promises);
    }
}

module.exports = QueueStoreOfES;