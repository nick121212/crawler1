let cheerio = require("cheerio");
let _ = require("lodash");
let typeStrategy = require("../data.strategy");

class CheerDealStrategy {

    constructor() {
        this.key = "cheerio";
        this.root = null;
    }

    /**
     * @param queueItem {Object} 数据
     */
    load(queueItem) {
        return cheerio.load(queueItem.responseBody || queueItem.respnseBody, {
            withDomLvl1: true
        });
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
        let $sel, result, root;

        // 载入当前的cheerio根节点
        !$ && (root = this.load(queueItem));
        $ = $ || root("body");
        // 如果存在index，则获取索引节点
        if (typeof index === "number") {
            $sel = $.eq(index);
        }
        // 查找当前的dom
        $sel = this.doFindSelector($sel || $, data.selector);

        if ($sel && $sel.length) {
            if (data.methodInfo) {
                if (data.methodInfo.method === "each") {
                    result = this.doCallEachMethod($sel, result);
                } else {
                    result = this.doCallMethod($sel, data.methodInfo.method, data.methodInfo.params);
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
            defer.resolve(null);
        }

        return defer.promise;
    }

    /**
     * 取得元素节点
     * @param $ {Object} cheerio对象
     * @param selector {Array|String} 搜索字段
     * @return cheerio对象
     */
    doFindSelector($, selector) {
        let $sel = $;

        if (_.isArray(selector)) {
            _.each(selector, (sel) => {
                switch (typeof sel) {
                    case "string":
                        $sel = $sel.find(sel);
                        break;
                    case "object":
                        $sel = this.doCallMethod($sel, sel.method, sel.params);
                        break;
                }
                if (!$sel.length) {
                    return false;
                }
            });

            return $sel;
        }

        return $;
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
     * @param method {String} 调用的方法名称
     * @param params {Array} 调用的方法参数
     * @returns {*}
     */
    doCallMethod($, method, params = []) {
        if ($[method]) {
            return $[method].apply($, params || []);
        }
        return null;
    }
}

module.exports = exports = new CheerDealStrategy();