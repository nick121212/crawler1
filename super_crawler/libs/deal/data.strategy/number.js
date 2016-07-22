let qs = require("qs");

/**
 * 处理html文本策越
 */
class Strategy {
    /**
     * 构造函数
     * 注册默认的解析策略
     */
    constructor() {
        this.key = "num";
    }

    /**
     * 转换成数字类型
     * @param reseult {Any}
     * @returns {String}
     */
    doDeal(result) {
        let res = Number(result);

        // return Number.isNaN(res) || 0;

        return res;
    }
}

module.exports = exports = new Strategy();