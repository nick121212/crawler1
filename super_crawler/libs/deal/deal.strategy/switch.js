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
    doDeal(queueItem, data, results, $) {
        let defer = Promise.defer();

        htmlStrategy.getOne(data.htmlStrategy).doDeal(queueItem, data, results, $).then((res) => {
            if (res.result) {
                return Promise.all(queueItem, this.doDealData([data.cases[res.result]]), res.$parent).then(defer.resolve, defer.reject);
            }
            defer.resolve(res);
        }, defer.reject);

        return defer.promise;
    }
}

module.exports = exports = new Strategy();