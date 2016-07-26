/**
 * Created by NICK on 16/7/1.
 */

let _ = require("lodash");

module.exports = exports = (core) => {
    let config = new core.utils.builder("lianjia", "place.qyer.com", []);

    config.setBaseInfo(1000, "superagent");
    config.initDomain = "";
    config.proxySettings = {
        useProxy: false,
        charset: "utf-8",
        timeout: 5000
    };
    // 白名单
    config.addWhitePath(/^\/taipei\/sight(\/*)$/);

    // -----------------页面配置------------------
    core.config.qiongyou && _.forEach(core.config.qiongyou.pages, (page) => {
        if (typeof page === "function") {
            page(config);
        }
    });

    return config;
};