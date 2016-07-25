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
        this.key = "match";
    }

    /**
     * 转换成数字类型
     * @param reseult {Any}
     * @returns {String}
     */
    doDeal(result, settings) {
        let regex = new RegExp(tools.replaceRegexp(settings.regexp));
        let matchs = result.match(regex);
        let res = result;

        settings.index = settings.index || 0;

        if (matchs.length > settings.index || 0) {
            res = matchs[settings.index];
        }

        return res;
    }
}

module.exports = exports = new Strategy();