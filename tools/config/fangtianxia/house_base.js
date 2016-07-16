module.exports = (core) => {
    return (config) => {
        config.pages.houseBase = {
            key: "house",
            rule: {"regexp": /[a-z|A-Z|1-9]+\.fang\.com/.toString(), scope: "i"},
            fieldKey: "name",
            test: false,
            area: {
                none: {
                    data: [
                        // 名称
                        core.utils.data_builder.normal("name", [".sftitle .ts_linear"]),
                        // 楼盘展示图片
                        core.utils.data_builder.array("pictures", [".outScroll_pic ul li"], [], [
                            core.utils.data_builder.normal("imageTitle", [".scroll_tit a"]),
                            core.utils.data_builder.normal("imageUrl", [".imgts"], [], {attr: ["src"]})
                        ])
                    ]
                }
            },
            ajax: {}
        };
    };
};