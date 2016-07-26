module.exports = (core) => {
    return (config) => {
        config.pages.community = {
            key: "crawler.community",
            rule: [{
                regexp: /\/sale\/a\d*.html/.toString(),
                scope: "i"
            }],
            fieldKey: "randow",
            test: false,
            area: {
                baseInfo: {
                    selector: ".inventory-info",
                    dealStrategy: "jsdom",
                    data: [
                        // 小区名称
                        core.utils.data_builder.normal("name", [".detail-item .community-name span"]),
                        // 楼盘地址
                        core.utils.data_builder.normal("address", [".address"], ["span"])
                    ]
                }
            }
        };
    };
};