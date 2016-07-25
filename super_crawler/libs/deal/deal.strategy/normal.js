let _ = require("lodash");
let htmlStrategy = require("../html.strategy");
let Base = require("./base");
let jpp = require("json-path-processor");

/**
 * 处理html文本策越
 */
class Strategy extends Base {
    /**
     * 构造函数
     * 注册默认的解析策略
     */
    constructor() {
        super();
        this.key = "normal";
    }

    /**
     * 普通的情况下执行
     * @returns Promise
     */
    doDeal(queueItem, data, results, $, index) {
        let promise = null;

        promise = htmlStrategy.getOne(data.htmlStrategy).doDeal(queueItem, data, $, index).then((res) => {
            let jData = jpp(results);
            let path = "";

            if (typeof res.index === "number" && _.isArray(results)) {
                path = `${res.index}`;
            }
            if (data.key) {
                path.length && (path += ".");
                path += `${data.key}`;
            }
            jData.set(path, this.doFormatData(res.result, data.formats), true);

            return res;
        });

        return promise;
    }
}

module.exports = exports = new Strategy();