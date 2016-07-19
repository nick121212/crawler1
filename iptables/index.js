let core = require("../core");
let _ = require("lodash");
let fs = require("fs");
let request = require("superagent");
let superagent_proxy = require("superagent-proxy")(request);
let superagent_charset = require("superagent-charset")(request);
let from1 = 0,
    size = 5;
let search = (from1, size = 20) => {
    return core.elastic.search({
        index: "ips",
        type: "ips",
        from: from1,
        size: size,
        fields: ["ips", "url"]
    }).then((results) => {
        console.log(results.hits.total, from1, size);
        return results;
    });
};

let download = (ipInfo) => {
    let req = request.get("http://sh.fang.com");
    let defer = Promise.defer();

    req
        .charset('utf8')
        .timeout(5000)
        .redirects(0)
        .proxy(`http://${ipInfo.host}:${ipInfo.port}`)
        .end((err, res) => {
            if (err) {
                return defer.resolve(err);
            }
            if (!res.text || res.statusCode !== 200) {
                return defer.resolve(new Error(`状态码(${res.statusCode})不正确。`));
            }

            console.log(res.headers["server"]);

            if (res.headers["server"] !== "nginx" || res.headers["X-UA-Compatible"]) {
                return defer.resolve(new Error(`状态码(${res.statusCode})不正确。`));
            }

            fs.appendFile("ip.json", JSON.stringify(ipInfo) + ",", defer.resolve);
        });

    return defer.promise;
};

let searchCallback = (results) => {
    let promises = [];

    if (results.hits.total > from1 + size) {
        from1 += size;

        for (let result in results.hits.hits) {
            console.log(results.hits.hits[result]._id);
            for (let field in results.hits.hits[result].fields["ips"]) {
                let ipInfos = JSON.parse(results.hits.hits[result].fields["ips"][field]);

                _.each(ipInfos, (ipInfo) => {
                    if (ipInfo.type && ipInfo.type.toLowerCase() === "http") {
                        promises.push(download(ipInfo));
                    }
                });
            }
        }
        if (promises.length) {
            Promise.all(promises).then(() => {
                search(from1, size).then(searchCallback, console.error);
            }, () => {
                search(from1, size).then(searchCallback, console.error);
            });
        } else {
            search(from1, size).then(searchCallback, console.error);
        }
    } else {
        console.log("completed");
        // process.exit();
    }
};
search(from1, size).then(searchCallback, console.error);