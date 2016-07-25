/**
 * Created by NICK on 16/7/25.
 */
let core = require("../../core/index");
let from = 10000, size = 5000;
let fs = require("fs");
let total = 0;

let search = (from1 = 0, size = 20) => {
    return core.elastic.search({
        index: 'shjjw',
        // Set to 30 seconds because we are calling right back
        scroll: '30s',
        search_type: 'scan',
        from: from1,
        size: size
    }, function getMoreUntilDone(error, response) {
        // collect the title from each response
        response.hits.hits.forEach(function (res) {
            res = res._source;
            fs.appendFileSync("shjjw.csv", `${res.address}\t${res.name}\t${res.areaAmount}\t${res.propertyName}\t${res.propertyType}\t${res.streetCode}\t${res.areaCode}\r\n`);
        });

        total += response.hits.hits.length;

        if (response.hits.total !== total) {
            // now we can call scroll over and over
            core.elastic.scroll({
                scrollId: response._scroll_id,
                scroll: '30s'
            }, getMoreUntilDone);
        } else {
            console.log('done');
        }
    });
};

let searchCallBack = (results)=> {

    if (results.hits.total > from) {
        from += size;
    } else {
        return console.log("ok");
    }

    for (let result in results.hits.hits) {
        let res = results.hits.hits[result]._source;

        fs.appendFileSync("shjjw.csv", `${res.address}\t${res.name}\t${res.areaAmount}\t${res.propertyName}\t${res.propertyType}\t${res.streetCode}\t${res.areaCode}\r\n`);
    }

    search(from, size).then(searchCallBack);
};

search(from, size);