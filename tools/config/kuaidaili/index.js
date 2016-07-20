/**
 * Created by NICK on 16/7/1.
 */

let _ = require("lodash");

module.exports = exports = (core) => {
    let config = new core.utils.builder("kuaidaili", "www.kuaidaili.com/free/inha", ["www.kuaidaili.com"]);

    config.setBaseInfo(1000, "superagent");
    config.robotsHost = "www.kuaidaili.com";
    config.stripWWWDomain = false;
    config.ignoreRobots = true;
    config.proxySettings = {
        useProxy: false
    };
    // 白名单
    config.addWhitePath("^\/free/inha(\/*)$");
    config.addWhitePath("^\/free/inha\/\d*");

    // -----------------页面配置------------------
    core.config.kuaidaili.clistpage(config);

    return config;
};