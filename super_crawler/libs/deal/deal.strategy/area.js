let _ = require("lodash");
let htmlStrategy = require("../html.strategy");

/**
 * 处理html文本策越
 */
class Strategy {
    /**
     * 构造函数
     * 注册默认的解析策略
     */
    constructor() {
        this.key = "area";
    }

    /**
     * 数组类型,直接返回空数组
     * @param queueItem {Object}
     * @param areas {Object}
     * @returns Promise
     */
    doDeal(queueItem, areas) {
        let promises = [];
        let defer = Promise.defer();

        // 遍历
        _.forEach(areas, (area, key) => {
            let strategy = htmlStrategy.getOne(area.htmlStrategy);
            area.key = key;
            promises.push(strategy.doDeal(queueItem, area));
        });
        // 执行
        Promise.all(promises).then((results) => {
            defer.resolve(_.keyBy(results, (res) => {
                if (res && res.data) {
                    return res.data.key;
                }
                return Date.now();
            }));
        }).catch(defer.reject);

        return defer.promise;
    }
}

module.exports = exports = new Strategy();