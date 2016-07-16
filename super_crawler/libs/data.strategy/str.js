let _ = require("lodash");

/**
 * string值处理
 */
class Strategy {
    /**
     * 构造函数
     */
    constructor() {
        this.key = "string";
    }

    /**
     * 开始处理文本,去掉左右空格,去掉中间空格,去掉制表符
     * @param result      {String} dom节点的值
     * @returns {String}
     */
    doDeal(result) {

        if (typeof result !== "string") return result;

        result = result || "";
        result = result.replace(/\r\n/gi, '');
        result = result.replace(/\t/gi, '');
        result = result.replace(/\s+/g, '');
        result = _.trim(result);

        return result;
    }
}

module.exports = exports = new Strategy();