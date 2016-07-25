let _ = require("lodash");
let Base = require("./base");
let htmlStrategy = require("../html.strategy");

/**
 * 处理html文本策越
 */
class Strategy extends Base {
    /**
     * 构造函数
     * 注册默认的解析策略
     */
    constructor() {
        super();
        this.key = "switch";
    }

    /**
     * 数组类型,直接返回空数组
     * @returns Promise
     */
    doDeal(queueItem, data, results, $, index) {
        let defer = Promise.defer();

        htmlStrategy.getOne(data.htmlStrategy).doDeal(queueItem, data, $, index).then((res) => {
            let promises = [];
            for (let i = 0; i < res.len; i++) {
                promises = promises.concat(this.doDealData(queueItem, data.data.concat([]), results, res.$parent, i));
            }
            if (promises.length) {
                return Promise.all(promises).then((cases) => {
                    let rtnResults = [];
                    _.each(cases, (casee) => {
                        casee && rtnResults.push(casee);
                    });
                    defer.resolve(rtnResults);
                }).catch(defer.reject);
            }
            defer.resolve(res);
        }, defer.reject);

        return defer.promise;
    }
}

module.exports = exports = new Strategy();