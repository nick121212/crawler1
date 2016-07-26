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
        this.key = "or";
    }

    /**
     * 数组类型,直接返回空数组
     * @returns Promise
     */
    doDeal(queueItem, data, results, $, index) {
        let defer = Promise.defer();
        let promises = [];

        promises = this.doDealData(queueItem, data.data.concat([]), results, $, index);
        return Promise.all(promises).then((cases) => {
            let rtnResults = [];

            _.each(cases, (casee) => {
                if (casee.result) {
                    rtnResults.push(casee);
                    return false;
                }
            });
            defer.resolve(rtnResults);
        }).catch((err) => {
            console.log(err);
            defer.reject(err);
        });
    }
}

module.exports = exports = new Strategy();