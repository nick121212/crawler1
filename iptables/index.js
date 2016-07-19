let core = require("../core");
let request = require("superagent");
let requestProxy = require("superagent-proxy")(request);
let _ = require("lodash");
let fs = require("fs");
let from = 0, size = 5;
let search = (from, size = 20) => {
    return core.elastic.search({
        index: "ips",
        type: "ips",
        fields: ["ips", "url"]
    }).then((results) => {
        console.log(results.hits.total, from, size);

        return results;
    });
};
let download = (ipInfo)=> {
    let defer = Promise.defer();

    let req = request.get("http://dfgjxc.fang.com/house/2426717359/housedetail.htm");
    let proxy = `http://${ipInfo.host}:${ipInfo.port}`;
    req.proxy(proxy).timeout(9000).end((err, res) => {
        if (err) {
            return defer.reject(err);
        }
        if (!res.text && res.statusCode !== 2000) {
            return defer.reject(new Error(`状态码(${res.statusCode})不正确。`));
        }

        console.log(res.headers["Server"], res.headers["server"]);

        if (res.headers["server"] !== "nginx") {
            return defer.reject(new Error(`返回数据不正确`));
        }
        fs.writeFileSync(Date.now() + ".html", res.text);
        defer.resolve(ipInfo);
    });

    return defer.promise;
};

let searchCallback = (results)=> {
    let promises = [];

    if (results.hits.total > from + size) {
        from += size;

        for (let result in results.hits.hits) {
            for (let field in results.hits.hits[result].fields["ips"]) {
                let ipInfos = JSON.parse(results.hits.hits[result].fields["ips"][field]);

                _.each(ipInfos, (ipInfo)=> {
                    if (ipInfo.type && ipInfo.type.toLowerCase() == "http") {
                        promises.push(download(ipInfo).then((result)=> {
                            if (result.host) {
                                return fs.appendFile("./ip.json", JSON.stringify(result) + ",");
                            }

                            return null;
                        }, ()=> {
                        }));
                    }
                });
            }
        }
        if (promises.length) {
            Promise.all(promises).then(()=> {
                console.log("all ok");
                search(from, size).then(searchCallback, console.error);
            });
        } else {
            search(from, size).then(searchCallback, console.error);
        }

    }
    else {
        process.exit();
    }
};

search(from, size).then(searchCallback, console.error);