/**
 * Created by NICK on 16/7/1.
 */

let _ = require("lodash");

module.exports = (core) => {
    let config = new core.utils.builder("anjuke", "www.anjuke.com", ["sh.fang.anjuke.com", "shanghai.anjuke.com"]);

    config.setBaseInfo(1000, "superagent");
    config.initDomain = "shanghai.anjuke.com";
    config.proxySettings = {
        useProxy: false,
        charset: "utf-8"
    };
    // 白名单
    // 匹配新房列表
    config.addWhitePath(/^\/loupan\/all\/p(\d+)/);
    // 匹配新房主页
    config.addWhitePath(/^\/loupan\/(\d+)\.html/);
    // 匹配新房参数页面
    config.addWhitePath(/^\/loupan\/canshu-(\d+)\.html/);

    // // 匹配新房户型参数页面
    // config.addWhitePath(/^\/loupan\/huxing-(\d+)\.html/);
    // // 户型分页
    // config.addWhitePath(/^\/loupan\/huxing-(\d+)\/s/);
    // // 匹配新房相册页面
    // config.addWhitePath(/^\/loupan\/xiangce-(\d+)/);
    // 小区户型图
    config.addWhitePath(/^\/community\/photos\/model\/(\d+)/);
    // 小区列表页
    config.addWhitePath(/^\/community\/(\d+)/);
    // 小区详情页
    config.addWhitePath(/^\/community\/view\/(\d+)/);
    // // 匹配经纪人列表页面
    // config.addWhitePath(/^\/tycoon\//);
    // config.addWhitePath(/^\/tycoon\/p(\d+)\//);
    // // 匹配经纪人详情
    // config.addWhitePath(/^\/gongsi-jjr-(\d+)\/(js)?/);

    _.forEach(core.config.anjuke.pages, (page) => {
        if (typeof page === "function") {
            page(config);
        }
    });

    return config;
};