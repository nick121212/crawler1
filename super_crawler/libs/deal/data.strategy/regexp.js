let _ = require("lodash");
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
        this.key = "regexp";
    }

    /**
     * 正则匹配数据
     * @returns {String}
     */
    doDeal(result, data) {
        let regexp = new RegExp(tools.replaceRegexp(data.regexp), data.scope || "i");
        let matchs = regexp.match(result);

        _.each(matchs, (match) => {
            console.log(match);
        });

        return result;
    }
}

module.exports = exports = new Strategy();