let _ = require("lodash");
let cheerioStrategy = require("./cheerio");
let jsdomStrategy = require("./jsdom");
let typeStrategy = require("../data.strategy");

/**
 * 处理html文本策越
 */
class DealStrategy {
    /**
     * 构造函数
     * 注册默认的解析策略
     */
    constructor() {
        this.htmls = {};

        // 注册默认的策略
        this.register(cheerioStrategy.key, cheerioStrategy);
        this.register(jsdomStrategy.key, jsdomStrategy);
    }

    /**
     * 注册策略
     * @param key {string} 策略名称
     * @param dealInstance {Object} 策略实例
     */
    register(key, dealInstance) {
        if (dealInstance && key && !this.htmls.hasOwnProperty(key)) {
            this.htmls[key] = dealInstance;
        }
    }

    getOne(key) {
        return this.htmls[key] || jsdomStrategy;
    }
}

module.exports = exports = new DealStrategy();