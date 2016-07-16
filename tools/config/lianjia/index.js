/**
 * Created by NICK on 16/7/1.
 */

let _ = require("lodash");

module.exports = exports = (core) => {
    let config = new core.utils.builder("lianjia", "sh.lianjia.com", ["sh.fang.lianjia.com"]);

    config.setBaseInfo(500, "superagent");
    // 黑名单
    config.addBlackPath("^\/list\/search");
    config.addBlackPath("^\/list\/[a-f|h-o|q-z]{1,5}[1-9]{1,2}\/{0,1}$");
    config.addBlackPath("^\/list\/[a-z]{1,}\/{0,1}$");
    config.addBlackPath("^\/detail\/(.*?)\/album");
    config.addBlackPath("^\/detail\/(.*?)\/dynamic");
    config.addBlackPath("^\/ershoufang\/[a-c|e-z]{1}[1-9]{1,}\/{0,1}$");
    config.addBlackPath("^\/ershoufang\/[a-z]{1,}\/{0,1}$");
    config.addBlackPath("^\/xiaoqu\/[a-c|e-z]{1}[1-9]{1,}\/{0,1}$");
    config.addBlackPath("^\/xiaoqu\/[a-z]{1,}\/{0,1}$");
    // 白名单
    config.addWhitePath("^\/ershoufang(\/*)$");
    config.addWhitePath("^\/ershoufang\/d[1-9]{1,}");
    config.addWhitePath("^\/ershoufang\/(.*?)(\.html)$");
    // config.addWhitePath("^\/detail\/");
    // config.addWhitePath("^\/detail\/d[1-9]{1,}");
    config.addWhitePath("^\/list(\/*)$");
    config.addWhitePath("^\/xiaoqu\/(.*?)(\.html)$");
    config.addWhitePath("^\/xiaoqu(\/*)$");
    config.addWhitePath("^\/xiaoqu\/d[1-9]{1,}");

    // -----------------页面配置------------------
    core.config.lianjia.community(config);
    core.config.lianjia.community_room(config);

    return config;
};