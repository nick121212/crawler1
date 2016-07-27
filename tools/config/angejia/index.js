/**
 * Created by NICK on 16/7/1.
 */

let _ = require("lodash");

module.exports = (core) => {
    let config = new core.utils.builder("angejia", "www.angejia.com", ["sh.angejia.com"]);

    config.setBaseInfo(1000, "phantom1");
    config.initDomain = "sh.angejia.com";
    config.stripQuerystring = false;
    config.proxySettings = {
        useProxy: false,
        charset: "utf-8"
    };
    // 白名单
    // // 匹配新房列表
    // config.addWhitePath(/^\/loupan$/);
    // // 匹配新房主页
    // config.addWhitePath(/^\/loupan\/\d*\.html/);
    // // 匹配新房参数页面
    // config.addWhitePath(/^\/loupan\/p\d*\.html/);

    config.addWhitePath(/^\/sale\/$/);
    config.addWhitePath(/^\/sale\/[a-z](\d+).html/);

    _.forEach(core.config.angejia.pages, (page) => {
        if (typeof page === "function") {
            page(config);
        }
    });

    return config;
};