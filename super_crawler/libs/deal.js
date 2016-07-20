"use strict";

let EventEmitter = require("events").EventEmitter;
let core = require("../../core");
let _ = require("lodash");
let strategy = require("./deal.strategy");

class DealHtml extends EventEmitter {
    /**
     * 构造函数
     * @param settings {object}
     * @param queueStore {Object}
     **/
    constructor(settings, queueStore) {
        super();
        this.pages = settings.pages;
        _.forEach(this.pages, (page) => {
            typeof page.rule === "object" && (page.rule = new RegExp(page.rule.regexp.replace(/(^\/)|(\/$)/g, ""), page.rule.scope));
        });
        this.key = settings.key || "";
        this.queueStore = queueStore;
        this.doStartQueue();
    }

    /**
     * 查找规则
     * @param url {string} 链接地址
     * @returns {Array}
     */
    findRule(url) {
        return _.filter(this.pages, (page, key) => {
            return page.rule && page.rule.test(url);
        });
    }

    /**
     * 解析文本
     * @param queueItem 链接的数据
     * @returns {Promise}
     */
    doDeal(queueItem) {
        let defer = Promise.defer();
        let rules = this.findRule(decodeURIComponent(queueItem.url)),
            rule, promises = [];

        // 没有匹配到规则，则丢回queue里面
        if (!rules.length) {
            defer.resolve();
        } else {
            // 解析html文本
            _.each(rules, (rule) => {
                promises.push(strategy.doDeal(queueItem, rule));
            });

            Promise.all(promises).then((results) => {
                promises.length = 0;
                _.each(results, (result) => {
                    if (!result.rule.test) {
                        if (result.rule.fieldKey && result.result[result.rule.fieldKey]) {
                            promises.push(this.queueStore.addCompleteData(queueItem, result.result, this.key, result.rule.key, result.rule.fieldKey));
                        } else {
                            promises.push(this.queueStore.addCompleteData(queueItem, result.result, this.key, result.rule.key, "url"));
                        }
                    } else {
                        console.log(result.result);
                    }
                });

                return Promise.all(promises);
            }).then(() => {
                console.log(`deal complete ${queueItem.url} at ${new Date()}`);
                defer.resolve();
            }).catch((err) => {
                console.error(err);
                defer.reject(err);
            });
        }

        return defer.promise;
    }

    /**
     * 消费Queue
     */
    doStartQueue() {
        let key = this.key;

        core.q.getQueue(`crawler.deals.${key}`, {}).then((result) => {
            Promise.all([
                // 绑定queue到exchange
                result.ch.bindQueue(result.q.queue, "amq.topic", `${result.q.queue}.bodys`),
                // 每次消费1条queue
                result.ch.prefetch(1)
            ]).then(() => {
                // 开始消费
                result.ch.consume(result.q.queue, (msg) => {
                    let queueItem;
                    try {
                        queueItem = JSON.parse(msg.content.toString());
                    } catch (e) {
                        result.ch.reject(msg);
                    }
                    try {
                        if (queueItem) {
                            this.doDeal(queueItem).then(() => {
                                result.ch.ack(msg);
                            }, () => {
                                result.ch.reject(msg);
                            });
                        }
                    } catch (e) {
                        console.log(e);
                        result.ch.reject(msg);
                    }
                });
            }, console.error);
        });
    }
}

module.exports = DealHtml;