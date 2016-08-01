/**
 * Created by NICK on 16/7/1.
 */

let _ = require("lodash");

module.exports = exports = (core) => {
    let config = new core.utils.builder("qiongyou", "place.qyer.com", []);

    config.setBaseInfo(1000, "superagent");
    config.initDomain = "place.qyer.com/taipei";
    config.fetchWhitelistedMimeTypesBelowMaxDepth = true;
    config.maxDepth = 3;
    config.proxySettings = {
        useProxy: true,
        charset: "utf-8",
        timeout: 10000,
        ipInfo: {
            host: "10.25.254.241",
            port: "8081"
        }
    };
    // 白名单
    config.addWhitePath(/^\/taipei\/sight(\/*)$/);
    // poi和poi的照片,评论默认1条
    config.addWhitePath(/^\/poi\/[1-9|a-z|A-Z|_]+(?:\/photo\/?(?:\/page\d+|)|)\/?$/);

    // -----------------页面配置------------------
    core.config.qiongyou && _.forEach(core.config.qiongyou.pages, (page) => {
        if (typeof page === "function") {
            page(config);
        }
    });

    return config;
};