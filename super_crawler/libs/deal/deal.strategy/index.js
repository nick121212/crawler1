let arrayStrategy = require("./array.js");
let normalStrategy = require("./normal.js");
let switchStrategy = require("./switch.js");
let caseStrategy = require("./case.js");
let areaStrategy = require("./area.js");
let objStrategy = require("./object.js");
let Base = require("./base");
let _ = require("lodash");

/**
 * 处理html文本策越
 */
class TypeStrategy extends Base {
    /**
     * 构造函数
     * 注册默认的解析策略
     */
    constructor() {
        super();

        // 注册默认的策略
        this.deals = {};
        this.register(arrayStrategy.key, arrayStrategy);
        this.register(normalStrategy.key, normalStrategy);
        this.register(switchStrategy.key, switchStrategy);
        this.register(areaStrategy.key, areaStrategy);
        this.register(objStrategy.key, objStrategy);
        this.register(caseStrategy.key, caseStrategy);
    }

    /**
     * 注册策略
     * @param key {string} 策略名称
     * @param dealInstance {Object} 策略实例
     */
    register(key, dealInstance) {
        if (dealInstance && key) {
            if (!this.deals.hasOwnProperty(key)) {
                this.deals[key] = dealInstance;
            }
        }
    }

    /**
     * 开始处理文本
     * @param queueItem      {Object}    数据
     * @param rule        {Object} 配置
     * @returns Any
     */
    doDeal(queueItem, rule) {
        let defer = Promise.defer();
        let promiseAll = [];
        let dataResults = {};
        let check = (results) => {
            let promises = [];
            let getPromises = (results) => {
                _.forEach(results, (result) => {
                    if (_.isArray(result)) {
                        getPromises(result);
                    } else {
                        result && result.data && result.data.data && (promises = promises.concat(this.doDealData.call(this, queueItem, result.data.data, result.result, result.$cur, result.index)));
                    }
                });
            }

            getPromises(results);

            return promises.length ? Promise.all(promises).then(check, defer.reject) : defer.resolve({
                result: dataResults,
                rule: rule
            });
        };

        // 处理area
        this.deals.area.doDeal(queueItem, rule.area).then((results) => {
            _.forEach(rule.area, (area) => {
                promiseAll = promiseAll.concat(this.doDealData.call(this, queueItem, area.data, dataResults, results[area.key] ? results[area.key].$cur : null));
            });

            return Promise.all(promiseAll).then(check);
        }, defer.reject);

        return defer.promise;
    }
}

module.exports = exports = new TypeStrategy();