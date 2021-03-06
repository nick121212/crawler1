let jsdom = require("jsdom");
let _ = require("lodash");
let fs = require("fs");
let jquery = fs.readFileSync(`${__dirname}/jquery.js`, "utf-8");

class CheerDealStrategy {
    constructor() {
        this.key = "jsdom";
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
        let $sel, result, len = 0;

        // 载入当前的cheerio根节点
        this.load(queueItem, $).then(($) => {
            // 如果存在index，则获取索引节点
            if (typeof index === "number") {
                $sel = $.eq(index);
            }
            // 查找当前的dom
            $sel = this.doFindSelector($sel || $, data.selector);
            $sel && (len = $sel.length);

            if (len && data.methodInfo) {
                $sel = this.doRemoveEle($sel, data.removeSelector);
                result = this.doCallMethod($sel, data.methodInfo);
            }

            defer.resolve({
                result: result,
                data: _.extend({}, data),
                $cur: $sel,
                $parent: $,
                len: len,
                index: index
            });
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
            if (!$sel.length) {
                return false;
            }
        });

        return $sel;
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