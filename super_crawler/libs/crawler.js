"use strict";

let EventEmitter = require("events").EventEmitter;
let uri = require("urijs");
let Discover = require("./discover");
let Queue = require("./queue");
let QueueStoreOfEs = require("./queue_store_es");
let Deal = require("./deal");
let core = require("../../core");
let downloaderStategy = require("./download.strategy");

class Crawler extends EventEmitter {
    /**
     * 构造函数
     * settings {object}
     *   initialPath       boolean 初始化连接地址
     *   initialPort       boolean 初始化端口
     *   initialProtocol   array   初始化协议
     *   host              string  初始化host
     *   cluster           boolean 是否是从
     **/
    constructor(settings) {
        super();

        this.initialPath = settings.initialPath || "/";
        this.initialPort = settings.initialPort || 80;
        this.initialProtocol = settings.initialPort || "http";
        this.host = settings.host;
        this.key = settings.key;
        this.cluster = settings.cluster || false;
        this.discover = new Discover(settings);
        this.queue = new Queue(settings, new QueueStoreOfEs(this.key));
        // setTimeout(() => {
        new Deal(settings, this.queue.queueStore);
        // }, 10);
        this.isStart = false;
        this.downloader = settings.downloader || "superagent";
        this.interval = settings.interval || 500;
        this.lastTime = Date.now();
    }

    /**
     * 爬取一个链接
     * @param queueItem
     */
    fetchQueueItem(queueItem) {
        let defer = Promise.defer();
        let URL = queueItem.protocol + "://" + queueItem.host + (queueItem.port !== 80 ? ":" + queueItem.port : "") + queueItem.path;
        let nextQueue = (res) => {
            defer.resolve(res);
        };

        try {
            this.lastTime = Date.now();
            // 开始下载页面
            downloaderStategy.start(this.downloader, uri(URL).normalize()).then((result) => {
                result.urls = this.discover.discoverResources(result.responseBody, queueItem);
                result.res && (queueItem.stateData = result.res.headers);
                // 页面查找到的链接存储到es中去
                return this.queue.queueStore.addCompleteQueueItem(queueItem, result.responseBody, this.key).then(nextQueue.bind(this, result), (err) => {
                    if (err.status === 404) {
                        err.status = 405;
                    }
                    defer.reject(err);
                });
            }).then(() => {
                // console.log("downloaded");
            }).catch(defer.reject);
        } catch (err) {
            defer.reject(err);
        }

        return defer.promise;
    }

    /**
     * 处理一条queue数据
     * @param msg
     * @param result
     */
    consumeQueue(msg, result) {
        let urls = [],
            queueItem;
        let next = (msg, reject = false) => {
            setTimeout(function() {
                reject ? result.ch.reject(msg) : result.ch.ack(msg);
            }, this.interval);
        };

        try {
            queueItem = JSON.parse(msg.content.toString());

            if (queueItem) {
                console.log(`start fetch ${queueItem.url} at ${new Date()}`);
                // 请求页面
                this.fetchQueueItem(queueItem).then((data) => {
                    data.urls.map((url) => {
                        // if (url.indexOf("housedetail") >= 0) {
                        //     console.log(url);
                        // }
                        url = this.queue.queueURL(decodeURIComponent(url), queueItem);
                        if (url) {
                            urls.push(url);
                        }
                    }, this);

                    // 把搜索到的地址存入到es
                    return this.queue.queueStore.addUrlsToEsUrls(urls, this.key);
                }).then(() => {
                    next(msg);
                }).catch((err) => {
                    console.error(err.status, err.message);
                    if (err.message == "fail" || err.status === 404 || err.status === 302 || err.status === 400) {
                        return next(msg);
                    }
                    next(msg, true);
                });
            } else {
                next(msg);
            }
        } catch (e) {
            next(msg);
        }
    }

    /**
     * 循环获取链接
     */
    doLoop() {
        let urls = [];

        // 建立请求队列
        core.q.getQueue(`crawler.urls.${this.key}`, {}).then((result) => {
            Promise.all([
                // 绑定queue到exchange
                result.ch.bindQueue(result.q.queue, "amq.topic", `${result.q.queue}.urls`),
                // 每次消费1条queue
                result.ch.prefetch(1)
            ]).then(() => {
                // 添加消费监听
                result.ch.consume(result.q.queue, (msg) => {
                    this.consumeQueue(msg, result);
                }, {
                    noAck: false
                });
            });
        });
    }

    /**
     * 开始爬取数据
     */
    doStart() {
        if (!this.host) {
            throw new Error("host不能为空！");
        }

        this.isStart = true;
        !this.cluster && this.queue.queueStore.addUrlsToEsUrls([{
            protocol: this.initialProtocol,
            host: this.host,
            port: this.initialPort,
            path: this.initialPath,
            depth: 1
        }], this.key);
        this.doLoop();
    }
}

module.exports = exports = Crawler;