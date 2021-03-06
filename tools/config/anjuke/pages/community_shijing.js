module.exports = (core) => {
    return (config) => {
        config.pages.communityLayout = {
            key: "crawler.community_layouts",
            rule: [{
                regexp: /\/community\/photos2\/b\/\d+/.toString(),
                scope: "i"
            }],
            fieldKey: "random",
            strict: true,
            strictField: "name",
            test: false,
            area: {
                none: {
                    data: [
                        // 楼盘名称
                        core.utils.data_builder.normal("name", [".comm-title h1"]),
                        // 户型
                        core.utils.data_builder.array("layouts", [".photos .photo2"], [], [
                            core.utils.data_builder.normal("url", ["img"], [], { attr: ["src"] }),
                            core.utils.data_builder.normal("title", ["img"], [], { attr: ["alt"] }),
                        ])
                    ]
                }
            },
            ajax: {}
        };
    };
};