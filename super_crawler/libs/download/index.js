let phantom = require("./phantom");
let phantom1 = require("./phantom-1");
let superagent = require("./superagent");

let errCount = 0,
    timeoutCount = 0;

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
            if (errCount > 4) {
                errCount = 0;
                timeoutCount = 0;
            }
            timeoutCount > 4 && (timeoutCount = 0);
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

            // if (!errors[uri.toString()]) {
            //     errors[uri.toString()] = 0;
            // }
            // errors[uri.toString()]++;

            // !err.timeout && errCount++;
            // err.timeout && timeoutCount++;
            // if (this.result && this.msg && (errCount > 4 || timeoutCount > 4)) {
            //     this.ipInfo = null;
            //     this.result.ch.ack(this.msg);
            //     this.msg = null;
            // }
            return err;
        });

        return promise;
    }
}

module.exports = exports = new Downloader();