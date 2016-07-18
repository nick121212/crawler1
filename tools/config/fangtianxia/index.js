/**
 * Created by NICK on 16/7/1.
 */

let _ = require("lodash");

module.exports = exports = (core) => {
    let config = new core.utils.builder("fangtianxia", "fang.com", [{
        regexp: "^[a-z|A-Z|1-9]+\.fang\.com",
        scope: "i"
    }, "newhouse.sh.fang.com", "esf.sh.fang.com"]);

    config.setBaseInfo(3000, "phantom1");
    config.robotsHost = "fang.com";

    // ---白名单---
    // 匹配楼盘列表页
    config.addWhitePath(/^\/house\/s(\/*)$/);
    config.addWhitePath(/^\/house\/s\/b\d{1,}(\/*)$/);
    // 匹配楼盘户型详情
    config.addWhitePath(/^\/house\/([a-z|1-9]){1,}.htm/);
    // 匹配新房楼盘|二手房楼盘详情
    config.addWhitePath(/^\/house\/\d{1,}\/housedetail.htm/);
    // 匹配带有期数的楼盘
    config.addWhitePath(/^\/d.\/$/);

    // -----------------页面配置------------------
    core.config.fangtianxia.house(config);
    core.config.fangtianxia.house_base(config);

    return config;
};