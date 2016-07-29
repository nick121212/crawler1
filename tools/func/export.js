/**
 * Created by NICK on 16/7/1.
 */
let fs = require("fs");
let _ = require("lodash");

module.exports = exports = (core) => {
    let total = 0, setHeader = false;

    let search = (index, type = "all", key = "url", filename = `${Date.now()}.csv`, from = 0, size = 20) => {
        let defer = Promise.defer();

        core.elastic.search({
            index: index,
            type: type === "all" ? null : type,
            scroll: '30s',
            // search_type: 'scan',
            from: from,
            size: size
        }, function getMoreUntilDone(error, response) {

            if (error) {
                console.log(error);
                return defer.reject(error);
            }

            response.hits.hits.forEach(function (res) {
                let strs = [], header = [];

                res = res._source;
                _.forEach(res, (v, k) => {
                    if (k !== "url" && k !== "_id" && k !== "pictures") {
                        if (!setHeader) {
                            header.push(k);
                        }
                        if (_.isArray(v) || _.isObject(v)) {
                            strs.push(JSON.stringify(v));
                        } else {
                            strs.push(v);
                        }
                    }
                });
                if (header.length) {
                    fs.appendFileSync(filename, `${header.join("\t")}\n`);
                }
                fs.appendFileSync(filename, `${strs.join("\t")}\n`);
            });

            total += response.hits.hits.length;
            if (response.hits.total !== total) {
                core.elastic.scroll({
                    scrollId: response._scroll_id,
                    scroll: '30s'
                }, getMoreUntilDone);
            } else {
                console.log("导出总数：", total);
                defer.resolve();
            }
        });

        return defer.promise;
    };

    return (index, type, key, filename, options) => {
        console.log(index, type, filename);

        if (fs.existsSync(filename)) {
            fs.unlinkSync(filename);
        }
        fs.writeFileSync(filename, "");
        console.log("start export:");

        return search(index, type, key, filename, 0, 3000);
    };
}
;