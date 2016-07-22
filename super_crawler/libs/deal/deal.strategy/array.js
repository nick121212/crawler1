let _ = require("lodash");
let htmlStrategy = require("../html.strategy");
let Base = require("./base");

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
        this.key = "array";
    }

    /**
     * 数组的情况下执行
     * @returns Promise
     */
    doDeal(queueItem, data, results, $) {
        let promise = null;

        results[data.key] = [];
        promise = htmlStrategy.getOne(data.htmlStrategy).doDeal(queueItem, data, $).then((res) => {
            for (let i = 0; i < res.len; i++) {
                results[data.key].push({});
            };
            !res.len && (res.data = null);

            return res;
        });

        return promise;
    }
}

module.exports = exports = new Strategy();