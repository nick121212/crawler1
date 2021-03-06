/**
 * Created by NICK on 16/7/1.
 */

let _ = require("lodash");

module.exports = exports = (core) => {
    let config = new core.utils.builder("zhongyuan", "sh.centanet.com", []);

    config.setBaseInfo(1000, "phantom1");
    config.initDomain = "sh.centanet.com/ershoufang";
    config.proxySettings = {
        useProxy: false,
        charset: "utf-8",
        wait: 3000,
        timeout: 5000
    };
    // 白名单
    config.addWhitePath(/^\/ershoufang(?:\/\D+|\/.+\.html|)(?:|\/g\d+)\/?$/);

    // -----------------页面配置------------------
    _.forEach(core.config.zhongyuan.pages, (page) => {
        if (typeof page === "function") {
            page(config);
        }
    });

    return config;
};