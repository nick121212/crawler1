let request = require("superagent");
let requestProxy = require("superagent-proxy")(request);
let superagent_charset = require("superagent-charset")(request);

class Downloader {

    constructor() {
        this.key = "superagent";
    }

    start(uri, settings = {}, ipInfo = {}) {
        let result = {};
        let defer = Promise.defer();

        try {
            let req = request.get(uri.toString());

            if (settings.useProxy && ipInfo && ipInfo.port && ipInfo.port) {
                req.proxy(`http://${ipInfo.host}:${ipInfo.port}`);
            }
            // 5s超时，不允许跳转
            req
            // .set("User-Agent", settings.ua || "Mozilla/5.0 (Window10; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.102 Safari/537.36")
                .charset(settings.charset || "gbk")
                .timeout(settings.timeout || 5000)
                // .redirects(0)
                .end((err, res) => {
                    if (err) {
                        console.log("error URI:", uri.toString());
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
        } catch (e) {
            defer.reject(e);
        }
        return defer.promise;
    }
}

module.exports = exports = new Downloader();