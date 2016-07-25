let _ = require("lodash");
let dataStrategy = require("../data.strategy");

class Base {
    doDealData(queueItem, data, curResults, $, index) {
        let promises = [];
        let strategy = null;

        _.each(data, (d) => {
            strategy = this.deals[d["dealStrategy"]] || normalStrategy;
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