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
        this.key = "queryString";
    }

    /**
     * 数组类型,直接返回空数组
     * @returns Array
     */
    doDeal(results, data) {
        if (!results) {
            return null;
        }
        let noSparse, jData;

        if (typeof results === "string") {
            results.indexOf("?") >= 0 && (results = results.substr(results.indexOf("?") + 1));
            results.indexOf("#") >= 0 && (results = results.substr(results.indexOf("#") + 1));
        }

        noSparse = qs.parse(results);
        jData = jpp(noSparse);

        return jData.get.apply(jData, data.dataLaraParams || []).value();
    }
}

module.exports = exports = new Strategy();