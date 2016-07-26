module.exports = (core) => {
    return (config) => {
        config.pages.layout = {
            key: "crawler.layouts",
            rule: [{
                regexp: /\/sale\/a\d*.html/.toString(),
                scope: "i"
            }],
            fieldKey: "randow",
            test: false,
            area: {
                none: {
                    data: [
                        // 户型图片
                        core.utils.data_builder.array("pictures", ["#slide_house_type .view .slide-box li"], [], [
                            core.utils.data_builder.or([
                                core.utils.data_builder.normal("url", ["img"], [], { attr: ["data-src"] }),
                                core.utils.data_builder.normal("url", [], [], { css: ["backgroundImage"] }, [{ str: [], replace: { regexp: /^url\(|\)$/.toString(), scope: "g" } }])
                            ])
                        ])
                    ]
                },
                baseInfo: {
                    selector: ".inventory-info",
                    dealStrategy: "jsdom",
                    data: [
                        // 小区名称
                        core.utils.data_builder.normal("name", [".detail-item .community-name span"])
                    ]
                }
            }
        };
    };
};