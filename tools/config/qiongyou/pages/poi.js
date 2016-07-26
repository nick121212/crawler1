module.exports = (core) => {
    return (config) => {
        config.pages.poi = {
            key: "crawler.poi",
            rule: [{
                regexp: /\/poi\/[a-z|A-Z|\d]*(\/*)$/.toString(),
                scope: "i"
            }],
            fieldKey: "name",
            test: false,
            area: {
                none: {
                    data: [
                        // 简介
                        core.utils.data_builder.normal("introduce", [".poiDet-detail"]),
                    ]
                },
                position: {
                    selector: ".qyer_head_crumb .text",
                    dealStrategy: "jsdom",
                    data: [
                        // 国家
                        core.utils.data_builder.normal("country", [{ eq: [1] }, "a"]),
                        // 城市
                        core.utils.data_builder.normal("city", [{ eq: [2] }, "a"]),
                    ]
                },
                names: {
                    selector: ".poiDet-largeTit",
                    dealStrategy: "jsdom",
                    data: [
                        // 英文名字
                        core.utils.data_builder.normal("nameEn", [".en a"]),
                        // 中文名字
                        core.utils.data_builder.normal("nameCn", [".cn a"], [])
                    ]
                },
                placeInfo: {
                    selector: ".poiDet-placeinfo",
                    dealStrategy: "jsdom",
                    data: [
                        // 评分
                        core.utils.data_builder.normal("score", [".points .number"]),
                        // 评论数量
                        core.utils.data_builder.combine(core.utils.data_builder.normal("comments", [".poiDet-stars .summery a"]), {
                            formats: [{ "str": [] }, {
                                regexp: {
                                    regexp: /\d*/.toString(),
                                    scope: "ig",
                                    index: 0
                                }
                            }]
                        }),
                        // 排名
                        core.utils.data_builder.combine(core.utils.data_builder.normal("rank", [".rank span"]), {
                            formats: [{ "str": [] }, {
                                regexp: {
                                    regexp: /\d*/.toString(),
                                    scope: "ig",
                                    index: 0
                                }
                            }]
                        })
                    ]
                },
                tips: {
                    selector: ".poiDet-tips",
                    dealStrategy: "jsdom",
                    data: [
                        // 地址
                        core.utils.data_builder.normal("address", ["li:eq(0) .content p"], ["a"]),
                        // 交通方式
                        core.utils.data_builder.normal("traffic", ["li:eq(1) .content p"])
                    ]
                },
                date: {
                    selector: ".poiDet-date",
                    dealStrategy: "jsdom",
                    data: [
                        // 更新者
                        core.utils.data_builder.array("updatedAt", ["span a"], [], [
                            core.utils.data_builder.normal("name", []),
                            core.utils.data_builder.normal("link", [], [{ attr: ["href"] }])
                        ]),
                        // 更新时间
                        core.utils.data_builder.combine(core.utils.data_builder.normal("updatedAt", ["span:eq(0)"], ["a"]), {
                            formats: [{ "str": [] }, {
                                regexp: {
                                    regexp: /\d*-\d*-\d*/.toString(),
                                    scope: "ig",
                                    index: 0
                                }
                            }]
                        })
                    ]
                }
            },
            ajax: {}
        };
    };
};