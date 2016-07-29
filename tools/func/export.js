/**
 * Created by NICK on 16/7/1.
 */
let fs = require("fs");
let _ = require("lodash");

module.exports = exports = (core) => {
    let total = 0;

    let search = (index, type = "all", filename = `${Date.now()}.csv`, from1 = 0, size = 20) => {
        let defer = Promise.defer();

        core.elastic.search({
            index: index,
            type: type === "all" ? null : type.split(','),
            scroll: '30s',
            search_type: 'scan',
            from: from1,
            size: size
        }, function getMoreUntilDone(error, response) {

            if (error) {
                return defer.reject(error);
            }

            console.log(response.hits.hits);

            response.hits.hits.forEach(function(res) {
                let strs = [];
                res = res._source;

                _.forEach(res, (v) => {
                    if (_.isArray(v) || _.isObject(v)) {
                        strs.push(JSON.stringify(v) + "\t");
                    } else {
                        strs.push(v + "\t");
                    }
                });
                fs.appendFileSync(filename, `${strs.join("")}\n`);
            });

            total += response.hits.hits.length;

            if (response.hits.total !== total) {
                core.elastic.scroll({
                    scrollId: response._scroll_id,
                    scroll: '30s'
                }, getMoreUntilDone);
            } else {
                console.log('done');
                defer.resolve();
            }
        });

        return defer.promise;
    };

    return (index, type, filename, options) => {
        console.log(index, type, filename);
        return search(index, type, filename, 0, 5000);
    };
};