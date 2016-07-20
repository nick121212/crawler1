const Horseman = require('node-horseman');
let ips = require("./ips");

class Downloader {
    constructor() {
        this.key = "phantom1";
    }

    start(uri, settings = {}, ipInfo = {}) {
        let horseman,
            defer = Promise.defer(),
            horsemanSetting = {
                timeout: settings.timeout || 5000,
                loadImages: false,
                switchToNewTab: true,
                ignoreSSLErrors: true,
                javascriptEnabled: false
            },
            result = {},
            resources = [];

        if (settings.useProxy && ipInfo && ipInfo.port && ipInfo.port) {
            horsemanSetting.proxy = `http://${ipInfo.host}:${ipInfo.port}`;
            horsemanSetting.proxyType = "http";
        }

        horseman = new Horseman(horsemanSetting);
        horseman
            .userAgent(settings.ua || "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.102 Safari/537.36")
            .on("resourceReceived", (res) => {
                resources[res.url] = res;
            })
            .open(uri.toString())
            .html()
            .then(body => {
                result.responseBody = body;
                result.res = resources[uri.toString()] || null;
            })
            .close()
            .then(() => {
                defer.resolve(result);
            }).catch(err => {
                err.res = resources[uri.toString()] || null;

                defer.reject(err);
            });

        return defer.promise;
    }
}

module.exports = exports = new Downloader();