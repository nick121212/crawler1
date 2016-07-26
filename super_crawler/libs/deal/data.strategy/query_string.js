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
        this.key = "qs";
    }

    /**
     * 处理数据，获取querystring中键值
     * @returns {String}
     */
    doDeal(result, data) {
        if (!result) {
            return null;
        }
        let noSparse, jData;

        if (typeof result === "string") {
            if (result.indexOf("?") >= 0) {
                result = result.substr(result.indexOf("?") + 1);
            }
            if (result.indexOf("#") >= 0) {
                result = result.substr(result.indexOf("#") + 1);
            }
        }

        noSparse = qs.parse(result);
        jData = jpp(noSparse);

        return jData.get.apply(jData, data.dataLaraParams || []).value();
    }
}

module.exports = exports = new Strategy();