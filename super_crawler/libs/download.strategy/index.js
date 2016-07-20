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

    setQueueInfo(result, msg) {
        this.result = result;
        this.msg = msg;
        try {
            this.ipInfo = JSON.parse(msg.content.toString());
        } catch (e) {
            result.ch.ack(msg);
        }
    }

    register(key, instance) {
        this.downloaders[key] = instance;
    }

    start(key, uri, settings) {
        let intance = this.downloaders[key] || superagent;
        let promise = intance.start(uri, settings, this.ipInfo);

        promise.catch(err => {
            if (this.result && this.msg && err.res && err.res.status !== null) {
                this.result.ch.reject(this.msg);
            }
            return err;
        });

        return promise;
    }
}

module.exports = exports = new Downloader();