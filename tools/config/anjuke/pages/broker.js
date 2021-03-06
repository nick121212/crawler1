module.exports = (core) => {
    return (config) => {
        config.pages.broker = {
            key: "crawler.brokers",
            extendData: {},
            rule: [{
                regexp: /\/gongsi-jjr-\d+\/js\//.toString(),
                scope: "i"
            }],
            fieldKey: "random",
            strict: true,
            strictField: "name",
            test: false,
            area: {
                none: {
                    data: [
                        // 联系电话
                        core.utils.data_builder.normal("phone1", [".phonenum"]),
                        // 照片
                        core.utils.data_builder.normal("avatar", [".portrait img"], [], { attr: ["src"] }),
                        // 公司
                        core.utils.data_builder.normal("company", [".company a:eq(0)"]),
                        // 门店
                        core.utils.data_builder.normal("store", [".company a:eq(1)"]),
                    ]
                },
                baseInfo: {
                    selector: ".section:eq(0)",
                    dealStrategy: "jsdom",
                    data: [
                        // 业务特长
                        core.utils.data_builder.array("features", [".item:eq(0) .item-content span"], [], [
                            core.utils.data_builder.normal(""),
                        ]),
                        // 详细介绍
                        core.utils.data_builder.normal("introduce", [".item:eq(1) .item-content"]),
                        // 从业经历
                        core.utils.data_builder.array("Career", [".item:eq(2) .item-content .timescale"], [], [
                            core.utils.data_builder.normal("time", [".time"]),
                            core.utils.data_builder.normal("company", [".company"]),
                            core.utils.data_builder.normal("post", [".post"])
                        ])
                    ]
                },
                personInfo: {
                    selector: ".section:eq(1)",
                    dealStrategy: "jsdom",
                    data: [
                        // 姓名
                        core.utils.data_builder.normal("name", [".item:eq(0) .float-l:eq(0)"]),
                        // 性别
                        core.utils.data_builder.normal("sax", [".item:eq(0) .float-l:eq(1)"])
                    ]
                }
            },
            ajax: {}
        };
    };
};