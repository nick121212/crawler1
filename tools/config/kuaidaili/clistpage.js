module.exports = (core) => {
    return (config) => {
        config.pages.community = {
            key: "ips",
            rule: {
                "regexp": /\/free\/inha\//.toString(),
                scope: "i"
            },
            fieldKey: "",
            test: false,
            area: {
                list: {
                    selector: "#list table tbody",
                    dealStrategy: "jsdom",
                    data: [
                        core.utils.data_builder.array("ips", "tr", [], [
                            core.utils.data_builder.normal("host", ["td:eq(0)"]),
                            core.utils.data_builder.normal("port", ["td:eq(1)"]),
                            core.utils.data_builder.normal("type", ["td:eq(3)"])
                        ])
                    ]
                }
            },
            ajax: {}
        };
    };
};