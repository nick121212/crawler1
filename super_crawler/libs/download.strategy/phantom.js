let phantom = require('phantom');
let ips = require("./ips");

class Downloader {
    constructor() {
        this.key = "phantom";
    }

    start(uri) {
        let phInstance, sitepage, ip = ips.random(), result = {
                urls: []
            },
            defer = Promise.defer();

        phantom.create([
            '--local-to-remote-url-access=true',
            '--ignore-ssl-errors=yes',
            '--load-images=no'
        ]).then((instance) => {
            phInstance = instance;

            return instance.createPage();
        }).then((page) => {
            sitepage = page;

            return Promise.all([
                page.setting("resoureTimeout", 5000),
                page.setting('javascriptEnabled', false),
                page.setting('proxy', `${ip.host}:${ip.port}`),
                page.setting('proxyType', `http`),
                page.setting("userAgent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.102 Safari/537.36")
            ]);
        }).then(() => {
            return sitepage.open(uri.toString());
        }).then((status) => {
            if (status !== "success") {
                throw new Error(status);
            }
            return sitepage.property('content');
        }).then((content) => {
            result.responseBody = content;
            defer.resolve(result);
            sitepage.close();
            phInstance.exit();
        }).catch((err) => {
            defer.reject(err);
            phInstance.exit();
        });

        return defer.promise;
    }
}

module.exports = exports = new Downloader();