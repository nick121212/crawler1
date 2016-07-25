module.exports = (core) => {
    return (config) => {
        config.pages.house = {
            key: "crawler.house",
            rule: [{
                "regexp": /\/loupan\/\d*.html/.toString(),
                scope: "i"
            }],
            fieldKey: "name",
            test: false,
            area: {
                none: {
                    data: [
                        // 楼盘名称
                        core.utils.data_builder.normal("name", [".inventory-title"]),
                        // 楼盘地址
                        core.utils.data_builder.normal("address", [".property-message .discount:eq(2)"], ["span"]),
                        // 图片
                        core.utils.data_builder.array("pictures", [".album-image-box .big-image-box .slide-box li"], [], [
                            core.utils.data_builder.normal("img", ["img"], [], {attr: ["data-src"]}),
                        ])
                    ]
                }
            },
            ajax: {}
        };
    };
};