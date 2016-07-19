/**
 * Created by NICK on 16/7/1.
 */

let _ = require("lodash");

module.exports = exports = (core) => {
    let config = new core.utils.builder("ips", "www.xicidaili.com/nn", ["www.xicidaili.com"]);

    config.setBaseInfo(1000, "superagent");
    config.robotsHost = "www.xicidaili.com";
    config.stripWWWDomain = false;
    config.ignoreRobots = true;
    // 白名单
    config.addWhitePath("^\/nn(\/*)$");
    config.addWhitePath("^\/nn\/\d*");

    // -----------------页面配置------------------
    core.config.ips.clistpage(config);

    return config;
};