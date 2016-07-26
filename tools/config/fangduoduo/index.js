/**
 * Created by NICK on 16/7/1.
 */

let _ = require("lodash");

module.exports = exports = (core) => {
    let config = new core.utils.builder("fangduoduo", "esf.fangdd.com", []);

    config.setBaseInfo(1000, "superagent");
    config.initDomain = "";
    config.proxySettings = {
        useProxy: false,
        charset: "utf-8",
        timeout: 5000
    };
    // 白名单
    config.addWhitePath("^\/shanghai$");
    config.addWhitePath("^\/shanghai\/list\/t上门验真");
    config.addWhitePath("^\/shanghai\/list\/t上门验真_pa\d*\/$");
    config.addWhitePath("^\/shanghai\/\d*.html");

    // -----------------页面配置------------------
    // _.forEach(core.config.wukong.pages, (page) => {
    //     if (typeof page === "function") {
    //         page(config);
    //     }
    // });

    return config;
};