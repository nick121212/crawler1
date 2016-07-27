/**
 * Created by NICK on 16/7/1.
 */

let _ = require("lodash");

module.exports = exports = (core) => {
    let config = new core.utils.builder("lianjia", "www.lianjia.com", ["sh.lianjia.com"]);

    config.setBaseInfo(1000, "superagent");
    config.initDomain = "sh.lianjia.com";
    config.proxySettings = {
        useProxy: false,
        charset: "utf-8",
        timeout: 5000
    };
    // 白名单
    // config.addWhitePath(/^\/ershoufang(\/*)$/);
    // config.addWhitePath(/^\/ershoufang\/d(\d+)/);
    // config.addWhitePath(/^\/ershoufang\/(\D+)(\d+).html/);

    config.addWhitePath(/^\/xiaoqu\/(\d+).html$/);
    config.addWhitePath(/^\/(xiaoqu(\/?))$/);
    config.addWhitePath(/^\/xiaoqu\/d(\d+)/);

    // -----------------页面配置------------------
    _.forEach(core.config.lianjia.pages, (page) => {
        if (typeof page === "function") {
            page(config);
        }
    });

    return config;
};