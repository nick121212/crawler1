module.exports = (core) => {
    return (config) => {
        config.pages.community = {
            key: "ips",
            rule: {
                "regexp": /\/nn\//.toString(),
                scope: "i"
            },
            fieldKey: "",
            test: false,
            area: {
                list: {
                    selector: "#ip_list",
                    dealStrategy: "jsdom",
                    data: [
                        core.utils.data_builder.array("ips", "tr", [], [
                            core.utils.data_builder.normal("host", ["td:eq(1)"]),
                            core.utils.data_builder.normal("port", ["td:eq(2)"]),
                            core.utils.data_builder.normal("type", ["td:eq(5)"])
                        ])
                    ]
                }
            },
            ajax: {}
        };
    };
};