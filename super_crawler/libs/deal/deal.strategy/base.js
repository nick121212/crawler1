let _ = require("lodash");
let dataStrategy = require("../data.strategy");

class Base {
    /**
     * 处理data数据
     * @param queueItem  {Object}
     * @param data       {Object}
     * @param curResults {Object}
     * @param $          {Object}
     * @param index      {Number}
     * @return {Promise}
     */
    doDealData(queueItem, data, curResults, $, index) {
        let promises = [];
        let strategy = null;

        _.each(data, (d) => {
            strategy = this.deals[d.dealStrategy] || this.deals.normal;
            if (_.isArray(curResults)) {
                _.each(curResults, (result, index) => {
                    promises.push(strategy.doDeal.call(this, queueItem, d, curResults, $, index));
                });
            } else {
                promises.push(strategy.doDeal.call(this, queueItem, d, curResults, $, index));
            }
        }, this);

        return promises;
    }

    /**
     * 数据的格式化函数
     * @param result  {String}
     * @param formats {Array<Object>}
     * @return {Any}   
     */
    doFormatData(result, formats) {
        let res = result;

        _.each(formats, (format) => {
            _.forEach(format, (params, key) => {
                res = dataStrategy.doDeal(key, res, params);
            });
        });

        return res;
    }
}

module.exports = exports = Base;