let _ = require("lodash");
let dataStrategy = require("../data.strategy");

class Base {
    doDealData(queueItem, data, curResults, $) {
        let promises = [];
        let strategy = null;

        _.each(data, (d) => {
            strategy = this.deals[d["dealStrategy"]] || normalStrategy;
            promises.push(strategy.doDeal(queueItem, d, curResults, $));
        });

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