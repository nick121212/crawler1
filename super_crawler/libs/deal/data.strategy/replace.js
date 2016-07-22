let qs = require("qs");
let jpp = require("json-path-processor");

/**
 * 处理html文本策越
 */
class Strategy {
    /**
     * 构造函数
     * 注册默认的解析策略
     */
    constructor() {
        this.key = "replace";
    }

    /**
     * 正则匹配数据
     * @returns {String}
     */
    doDeal(result, data) {
        let regexp = new RegExp(data.regexp.replace(/^\/|\/$/g, ""), data.scope || "i");

        return result.replace(regexp, data.repStr || "");
    }
}

module.exports = exports = new Strategy();