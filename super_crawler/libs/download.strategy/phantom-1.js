const Horseman = require('node-horseman');
let ips = require("./ips");

class Downloader {
    constructor() {
        this.key = "phantom1";
    }

    start(uri) {
        let ipInfo = ips.random(),
            horseman = new Horseman({
                timeout: 3000,
                loadImages: false,
                switchToNewTab: true,
                ignoreSSLErrors: true,
                javascriptEnabled: false,
                proxy: `http://${ipInfo.host}:${ipInfo.port}`,
                proxyType: `http`
            }),
            result = {
                urls: []
            },
            resources = [];

        return horseman
            .userAgent("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.102 Safari/537.36")
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