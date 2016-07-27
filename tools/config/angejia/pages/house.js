module.exports = (core) => {
    return (config) => {
        config.pages.house = {
            key: "crawler.loupan",
            rule: [{
                "regexp": /\/loupan\/(\d.*).html/.toString(),
                scope: "i"
            }],
            fieldKey: "randow",
            test: false,
            area: {
                none: {
                    data: [
                        // 楼盘名称
                        core.utils.data_builder.normal("name", [".inventory-title"]),
                        // 楼盘地址
                        core.utils.data_builder.normal("address", [".property-message .discount:eq(2)"], ["span"]),
                        // 图片
                        core.utils.data_builder.array("pictures", [".thumb-box-pic .slide-box li"], [], [
                            core.utils.data_builder.or([
                                core.utils.data_builder.normal("url", ["img"], [], { attr: ["data-src"] }),
                                core.utils.data_builder.normal("url", [], [], { css: ["backgroundImage"] }, [{ str: [], replace: { regexp: /^url\(|\)$/.toString(), scope: "g" } }])
                            ])
                        ])
                    ]
                }
            },
            ajax: {}
        };
    };
};