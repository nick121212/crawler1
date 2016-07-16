let strStrategy = require("./str.js");
let arrayStrategy = require("./array.js");
let objectStrategy = require("./object.js");
let qsStrategy = require("./query_string.js");

/**
 * 处理html文本策越
 */
class TypeStrategy {
    /**
     * 构造函数
     * 注册默认的解析策略
     */
    constructor() {
        this.types = {};

        // 注册默认的策略
        this.register(strStrategy.key, strStrategy);
        this.register(arrayStrategy.key, arrayStrategy);
        this.register(objectStrategy.key, objectStrategy);
        this.register(qsStrategy.key, qsStrategy);
    }

    /**
     * 注册策略
     * @param key {string} 策略名称
     * @param dealInstance {Object} 策略实例
     */
    register(key, dealInstance) {
        if (dealInstance && key) {
            !this.types.hasOwnProperty(key) && (this.types[key] = dealInstance);
        }
    }

    /**
     * 开始处理文本
     * @param result      {Any}    数据
     * @param config      {Object} 配置
     * @returns Any
     */
    doDeal(result, config) {
        let strategy = this.types[config.dataStrategy] || strStrategy;

        return strategy.doDeal(result, config);
    }
}

module.exports = exports = new TypeStrategy();