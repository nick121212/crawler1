"use strict";

let _ = require("lodash");
let dealStrategy = require("./deal.strategy");

class DealHtml {
    constructor(settings, saveFunc) {
        this.settings = settings;
        this.pages = settings.pages;
        this.key = settings.key || "";
        this.saveFunc = saveFunc || function() {};
        _.forEach(this.pages, (page) => {
            typeof page.rule === "object" && (page.rule = new RegExp(page.rule.regexp.replace(/(^\/)|(\/$)/g, ""), page.rule.scope));
        });
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
     * 消费一条消息
     * @param queueItem {Object}
     */
    consumeQueue(queueItem) {
        let rules = this.findRule(decodeURIComponent(queueItem.url)),
            defer = Promise.defer(),
            promises = [];

        if (!rules.length) {
            defer.resolve();
        } else {
            try {
                // 遍历处理html文本
                _.each(rules, (rule) => {
                    promises.push(dealStrategy.doDeal(queueItem, rule));
                });

                // 所有的处理完后，保存结果
                Promise.all(promises).then((results) => {
                    promises.length = 0;
                    _.each(results, (result) => {
                        if (!result.rule.test) {
                            if (result.rule.fieldKey && result.result[result.rule.fieldKey]) {
                                promises.push(this.saveFunc(queueItem, result.result, this.key, result.rule.key, result.rule.fieldKey));
                            } else {
                                promises.push(this.saveFunc(queueItem, result.result, this.key, result.rule.key, "url"));
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
            } catch (err) {
                defer.reject(err);
            }
        }

        return defer.promise;
    }
}

module.exports = DealHtml;