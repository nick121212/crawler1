let _ = require("lodash");
let htmlStrategy = require("../html.strategy");
let Base = require("./base");
let jpp = require("json-path-processor");

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
        this.key = "object";
    }

    /**
     * 数组的情况下执行
     * @returns Promise
     */
    doDeal(queueItem, data, results, $, index) {
        let promise = null;

        // results[data.key] = {};
        promise = htmlStrategy.getOne(data.htmlStrategy).doDeal(queueItem, data, $, index).then((res) => {
            let jData = jpp(results);
            let path = "";

            if (typeof res.index === "number" && _.isArray(results)) {
                path = `${res.index}`;
            }

            if (path) {
                results = jData.get(path).value();
            }
            results[data.key] = {};
            res.result = results[data.key];

            if (path) {
                res.index = null;
            }

            return res;
        });

        return promise;
    }
}

module.exports = exports = new Strategy();