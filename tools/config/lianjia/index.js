/**
 * Created by NICK on 16/7/1.
 */

let _ = require("lodash");

module.exports = exports = (core) => {
    let config = new core.utils.builder("lianjia", "www.lianjia.com", ["sh.lianjia.com"]);

    config.setBaseInfo(1000, "phantom1");
    config.initDomain = "sh.lianjia.com";
    config.proxySettings = {
        useProxy: false,
        charset: "utf-8",
        timeout: 5000
    };
    // 白名单

    // 二手房
    config.addWhitePath(/^\/ershoufang(?:\/\D+(?:\/d\d+|)|\/[a-z]{2}\d+\.html|)\/?$/);
    // 匹配小区列表，小区详情页，小区版块列表（只按照区域和版块过滤）
    // config.addWhitePath(/^\/xiaoqu(?:\/[a-z]*\/?(?:d\d+\/?|\/?)|\/?|\/\d+.html)$/);

    // -----------------页面配置------------------
    _.forEach(core.config.lianjia.pages, (page) => {
        if (typeof page === "function") {
            page(config);
        }
    });

    return config;
};