let jsdom = require("jsdom");
let _ = require("lodash");
let typeStrategy = require("../data.strategy");
let fs = require("fs");
let jquery = fs.readFileSync(`${__dirname}/jquery.js`, "utf-8");

class CheerDealStrategy {
    constructor() {
        this.key = "jsdom";
        this.root = null;
    }

    /**
     * @param queueItem {Object} 数据
     */
    load(queueItem, $) {
        let defer = Promise.defer();

        !$ && jsdom.env({
            html: queueItem.responseBody || queueItem.respnseBody,
            src: [jquery],
            done: function(err, window) {
                if (err) {
                    return defer.reject(err);
                }
                defer.resolve(window.$("body"));
            }
        });

        if ($) {
            defer.resolve($);
        }

        return defer.promise;
    }

    /**
     * @param queueItem {Object} 数据
     * @param data      {Object} 单个数据配置
     * @param $         {Cheerio} Dom节点
     * @param index     {number}  数组中，节点的索引
     * @return promise
     */
    doDeal(queueItem, data, $, index) {
        let defer = Promise.defer();
        let $sel, result;

        // 载入当前的cheerio根节点
        this.load(queueItem, $).then(($) => {
            // 如果存在index，则获取索引节点
            if (typeof index === "number") {
                $sel = $.eq(index);
            }
            // 查找当前的dom
            $sel = this.doFindSelector($sel || $, data.selector);

            if ($sel && $sel.length) {
                if (data.methodInfo) {
                    $sel = this.doRemoveEle($sel, data.removeSelector);
                    if (data.methodInfo["each"]) {
                        result = this.doCallEachMethod($sel, result);
                    } else {
                        result = this.doCallMethod($sel, data.methodInfo);
                    }
                }
                // resolve
                defer.resolve({
                    result: typeStrategy.doDeal(result, data),
                    data: data,
                    $: $sel,
                    index: index
                });
            } else {
                defer.resolve({
                    data: data,
                    $: $sel,
                    index: index
                });
            }
        }, defer.reject);

        return defer.promise;
    }

    doRemoveEle($sel, selector) {
        if (!_.isArray(selector)) {
            selector = [selector];
        }
        _.each(selector, (sel) => {
            try {
                $sel.find(sel).remove();
            } catch (e) {}
        });

        return $sel;
    }

    /**
     * 取得元素节点
     * @param $ {Object} cheerio对象
     * @param selector {Array|String} 搜索字段
     * @return cheerio对象
     */
    doFindSelector($, selector) {
        let $sel = $;

        if (!_.isArray(selector)) {
            typeof selector === "string" && (selector = [selector]);
        }

        if (!_.isArray(selector)) {
            return $sel;
        }

        _.each(selector, (sel) => {
            switch (typeof sel) {
                case "string":
                    $sel = $sel.find(sel);
                    break;
                case "object":
                    $sel = this.doCallMethod($sel, sel);
                    break;
            }
            if (!$sel.length) return false;
        });

        return $sel;
    }

    /**
     * 调用方法
     * @param $   {Object} cheerio对象
     * @param method {String} 调用的方法名称
     * @param params {Array} 调用的方法参数
     * @returns {*}
     */
    doCallEachMethod($, results) {
        results = results || [];

        $.each(() => {
            results.push({});
        });

        return results;
    }

    /**
     * 调用方法
     * @param $   {Object} cheerio对象
     * @param methodInfo {Object} 调用的方法名称
     * @returns {*}
     */
    doCallMethod($, methodInfo) {
        let $sel = null;

        _.forEach(methodInfo, (params, method) => {
            if (params && !_.isArray(params)) {
                params = [params];
            }
            $sel = $[method].apply($, params || []);
        });

        return $sel;
    }
}

module.exports = exports = new CheerDealStrategy();