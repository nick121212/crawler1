let str = require("./str.js");
let qs = require("./query_string.js");
let num = require("./number.js");
let regexp = require("./regexp.js");
let repl = require("./replace.js");

/**
 * 处理html文本策越
 */
class TypeStrategy {
    /**
     * 构造函数
     * 注册默认的解析策略
     */
    constructor() {
        this.formats = {};

        // 注册默认的策略
        this.register(str.key, str);
        this.register(num.key, num);
        this.register(regexp.key, regexp);
        this.register(qs.key, qs);
        this.register(repl.key, repl);
    }

    /**
     * 注册策略
     * @param key {string} 策略名称
     * @param dealInstance {Object} 策略实例
     */
    register(key, dealInstance) {
        if (dealInstance && key) {
            if (!this.formats.hasOwnProperty(key)) {
                (this.formats[key] = dealInstance);
            }
        }
    }

    /**
     * 开始处理文本
     * @param result      {Any}    数据
     * @param config      {Object} 配置
     * @returns Any
     */
    doDeal(key, result, params) {
        let strategy = this.formats[key] || str;

        try {
            return strategy.doDeal(result, params);
        } catch (e) {
            return result;
        }
    }
}

module.exports = exports = new TypeStrategy();