const Horseman = require('node-horseman');

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
                ignoreSSLErrors: true
            },
            result = {},
            resources = [];

        if (settings.useProxy && ipInfo && ipInfo.port && ipInfo.port) {
            horsemanSetting.proxy = `http://${ipInfo.host}:${ipInfo.port}`;
            horsemanSetting.proxyType = "http";
        }
        if (settings.useProxy && settings.ipInfo && settings.ipInfo.port && settings.ipInfo.port) {
            horsemanSetting.proxy = `http://${settings.ipInfo.host}:${settings.ipInfo.port}`;
            horsemanSetting.proxyType = "http";
        }

        horseman = new Horseman(horsemanSetting);
        horseman
            .userAgent(settings.ua || "")
            .on("resourceReceived", (res) => {
                resources[res.url] = res;
            })
            .open(uri.toString())
            .wait(settings.wait || 10)
            .html()
            .then(body => {
                result.responseBody = body;
                result.res = resources[uri.toString()] || null;
            })
            .close()
            .then(() => {
                defer.resolve(result);
            })
            .catch(err => {
                err.response = resources[uri.toString()] || null;
                defer.reject(err);
            });

        return defer.promise;
    }
}

module.exports = exports = new Downloader();