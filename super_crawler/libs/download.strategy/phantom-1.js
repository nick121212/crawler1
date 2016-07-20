const Horseman = require('node-horseman');
let ips = require("./ips");

class Downloader {
    constructor() {
        this.key = "phantom1";
    }

    start(uri, settings = {}, ipInfo = {}) {
        let horseman,
            horsemanSetting = {
                timeout: 3000,
                loadImages: false,
                switchToNewTab: true,
                ignoreSSLErrors: true,
                javascriptEnabled: false
            },
            result = {
                urls: []
            },
            resources = [];

        if (settings.useProxy && ipInfo.port && ipInfo.port) {
            horsemanSetting.proxy = `http://${ipInfo.host}:${ipInfo.port}`;
            horsemanSetting.proxyType = "http";
        }

        horseman = new Horseman(horsemanSetting);
        return horseman
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
                return result;
            });
    }
}

module.exports = exports = new Downloader();