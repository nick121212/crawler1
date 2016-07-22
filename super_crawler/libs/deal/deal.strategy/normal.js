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
        this.key = "normal";
    }

    /**
     * 普通的情况下执行
     * @returns Promise
     */
    doDeal(queueItem, data, results, $) {
        let promise = null;

        results && (results[data.key] = null);
        promise = htmlStrategy.getOne(data.htmlStrategy).doDeal(queueItem, data, $).then((res) => {
            results[data.key] = this.doFormatData(res.result, data.formats);

            return res;
        });

        return promise;
    }
}

module.exports = exports = new Strategy();