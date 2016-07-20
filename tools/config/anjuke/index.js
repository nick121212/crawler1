/**
 * Created by NICK on 16/7/1.
 */

let _ = require("lodash");

module.exports = (core) => {
    let config = new core.utils.builder("anjuke", "anjuke.com", ["sh.fang.anjuke.com"]);

    config.setBaseInfo(1000, "phantom1");
    config.robotsHost = "anjuke.com";
    config.proxySettings = {
        useProxy: false
    };
    // 白名单
    // 匹配新房列表
    config.addWhitePath(/^\/loupan\/all\/p\d*/);
    // 匹配新房主页
    config.addWhitePath(/^\/loupan\/\d*\.html/);
    // 匹配新房参数页面
    config.addWhitePath(/^\/loupan\/canshu-\d*\.html/);

    // 二手房列表
    config.addWhitePath(/^\/sale\/$/);
    config.addWhitePath(/^\/sale\/\d*\/$/);
    // 二手房详情
    config.addWhitePath(/^\/prop\/view\//);
    // 小区详情
    config.addWhitePath(/^\/community\/view\//);

    // -----------------页面配置------------------
    core.config.anjuke.community(config);
    core.config.anjuke.house(config);
    // core.config.anjuke.house_base(config);

    return config;
};