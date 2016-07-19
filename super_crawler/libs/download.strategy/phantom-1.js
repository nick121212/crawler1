const Horseman = require('node-horseman');
let ips = require("./ips");

class Downloader {
    constructor() {
        this.key = "phantom1";
    }

    start(uri) {
        let ip = ips.random(),
            defer = Promise.defer(),
            result = {
                urls: []
            };
        const horseman = new Horseman({
            loadImages: false,
            javascriptEnabled: false,
            ignoreSSLErrors: true
        });

        console.log(`${ip.host}:${ip.port}`);

        horseman
            .setProxy(ip.host, ip.port)
            .userAgent("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.102 Safari/537.36")
            .open(uri.toString())
            .html()
            .then((body) => {
                result.responseBody = body;
                return horseman.close();
            })
            .then(() => {
                defer.resolve(result);
            }).catch(defer.reject);

        return defer.promise;
    }
}

module.exports = exports = new Downloader();