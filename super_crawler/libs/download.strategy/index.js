let phantom = require("./phantom");
let phantom1 = require("./phantom-1");
let superagent = require("./superagent");

class Downloader {
    constructor() {
        this.downloaders = {};

        this.register(phantom.key, phantom);
        this.register(superagent.key, superagent);
        this.register(phantom1.key, phantom1);
    }

    register(key, instance) {
        this.downloaders[key] = instance;
    }

    start(key, uri) {
        let intance = this.downloaders[key] || superagent;

        return intance.start(uri);
    }
}

module.exports = exports = new Downloader();