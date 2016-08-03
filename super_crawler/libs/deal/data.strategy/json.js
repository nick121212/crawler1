let qs = require("qs");
let tools = require("../../../utils/tools")();

/**
 * 处理html文本策越
 */
class Strategy {
    /**
     * 构造函数
     * 注册默认的解析策略
     */
    constructor() {
        this.key = "json";
    }

    /**
     * 转换成数字类型
     * @param reseult {Any}
     * @returns {String}
     */
    doDeal(result, settings) {
        let res = result;

        try {
            if (settings.parse) {
                res = JSON.parse(res);
            }
            if (settings.func && settings.func.constructor === Function) {
                res = settings.func.call(this, res);
            }
        } catch (e) {
        }

        return res;
    }
}

module.exports = exports = new Strategy();