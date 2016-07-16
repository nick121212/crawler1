module.exports = (core) => {
    return (config) => {
        config.pages.houseBase = {
            key: "house",
            rule: {"regexp": /\/loupan\/\d*\.html/.toString(), scope: "i"},
            fieldKey: "name",
            test: false,
            area: {
                none: {
                    data: [
                        // 名称
                        core.utils.data_builder.normal("name", [".lp-info .lp-tit h1"]),
                        // 楼盘展示图片
                        core.utils.data_builder.array("pictures", [".snav:eq(0) a"], [], [
                            core.utils.data_builder.normal("imageTitle", [".photo-tit"]),
                            core.utils.data_builder.normal("imageUrl", ["img"], [], {attr: ["src"]})
                        ])
                    ]
                },
                position: {
                    selector: ".crumb-item a",
                    dealStrategy: "jsdom",
                    data: [
                        // 省市
                        core.utils.data_builder.normal("province", [{eq: [0]}]),
                        // 城市
                        core.utils.data_builder.normal("city", [{eq: [1]}]),
                        // 城市
                        core.utils.data_builder.normal("area", [{eq: [2]}]),
                        // 版块
                        core.utils.data_builder.normal("plate", [{eq: [3]}]),
                    ]
                }
            },
            ajax: {}
        };
    };
};