module.exports = (core) => {
    return (config) => {
        // http://sh.fang.anjuke.com/loupan/huxing-246309.html
        config.pages.layout = {
            key: "crawler.community_layouts",
            rule: [{
                regexp: /\/community\/photos\/model\/\d*/.toString(),
                scope: "i"
            }],
            fieldKey: "random",
            test: false,
            area: {
                none: {
                    data: [
                        // 楼盘名称
                        core.utils.data_builder.normal("name", [".comm-title h1"]),
                        // 户型
                        core.utils.data_builder.array("layouts", [".photo-list dd"], [], [
                            core.utils.data_builder.normal("img", ["img"], [], {attr: ["src"]}),
                            core.utils.data_builder.combine(core.utils.data_builder.normal("layout", [".title"], []), {
                                formats: [{
                                    "str": [],
                                    "match": {
                                        regexp: /\d?室\d?厅\d?卫/.toString(),
                                        index: 0
                                    }
                                }]
                            }),
                            core.utils.data_builder.combine(core.utils.data_builder.normal("toward", [".title"], []), {
                                formats: [{
                                    "str": [],
                                    "match": {
                                        regexp: /(东|南|西|北)./.toString(),
                                        index: 0
                                    }
                                }]
                            }),
                            core.utils.data_builder.combine(core.utils.data_builder.normal("area", [".title"], []), {
                                formats: [{
                                    "str": [],
                                    "match": {
                                        regexp: /\d*平米/.toString(),
                                        index: 0
                                    }
                                }]
                            })
                        ])
                    ]
                }
            },
            ajax: {}
        };
    };
};