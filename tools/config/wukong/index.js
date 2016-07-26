/**
 * Created by NICK on 16/7/1.
 */

let _ = require("lodash");

module.exports = exports = (core) => {
    let config = new core.utils.builder("lianjia", "www.wkzf.com", []);

    config.setBaseInfo(1000, "superagent");
    config.initDomain = "sh.lianjia.com";
    config.proxySettings = {
        useProxy: false,
        charset: "utf-8",
        timeout: 5000
    };
    // 白名单
    config.addWhitePath("^\/shanghai\/esf");
    config.addWhitePath("^\/shanghai\/esf\/p\d*");
    config.addWhitePath("^\/shanghai\/esf\/detail\/(.*?).html");

    // -----------------页面配置------------------
    _.forEach(core.config.wukong.pages, (page) => {
        if (typeof page === "function") {
            page(config);
        }
    });

    return config;
};