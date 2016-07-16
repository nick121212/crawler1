let _ = require("lodash");

/**
 * 处理html文本策越
 */
class Strategy {
    /**
     * 构造函数
     * 注册默认的解析策略
     */
    constructor() {
        this.key = "object";
    }

    /**
     * 数组类型,直接返回空数组
     * @returns Array
     */
    doDeal(results) {
        if (!results) {
            return {};
        }
        return results;
    }
}

module.exports = exports = new Strategy();