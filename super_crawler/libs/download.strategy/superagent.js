let request = require("superagent");
let requestProxy = require("superagent-proxy")(request);

let ips = require("./ips");

class Downloader {

    constructor() {
        this.key = "superagent";
    }

    start(uri) {
        let result = {};
        let defer = Promise.defer();

        try {
            let req = request.get(uri.toString())
                .end((err, res) => {
                    if (err) {
                        console.log(uri);
                        return defer.reject(err);
                    }
                    result = {
                        res: res,
                        responseBody: "",
                        urls: []
                    };
                    if (!res.text || res.statusCode !== 200) {
                        return defer.reject(new Error(`状态码(${res.statusCode})不正确。`));
                    }
                    result.responseBody = res.text;
                    defer.resolve(result);
                });
            let ip = ips.random();
            let proxy = `http://${ip.host}:${ip.port}`;

            // 5s超时，不允许跳转，加上代理
            req.proxy(proxy).timeout(5000).redirects(0);
        } catch (e) {
            defer.reject(e);
        }
        return defer.promise;
    }
}

module.exports = exports = new Downloader();