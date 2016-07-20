module.exports = (core) => {
    return (config) => {
        config.pages.house = {
            key: "house-1",
            rule: {
                "regexp": /[a-z|A-Z|1-9]+\.fang\.com\/house\/\d+\/housedetail\.htm$/.toString(),
                scope: "i"
            },
            fieldKey: "name",
            test: false,
            area: {
                none: {
                    data: [
                        // 省市
                        core.utils.data_builder.normal("province", [".newnav20141104 .s4Box a"]),
                        // 小区名称
                        core.utils.data_builder.normal("name", [".lpname .ts_linear"])
                    ]
                },
                position: {
                    selector: ".header_mnav p a",
                    dealStrategy: "jsdom",
                    data: [
                        // 城市
                        core.utils.data_builder.normal("city", [{
                            eq: [1]
                        }]),
                        // 地区
                        core.utils.data_builder.normal("area", [{
                            eq: [2]
                        }]),
                        // 版块
                        core.utils.data_builder.normal("plate", [{
                            eq: [3]
                        }]),
                    ]
                },
                // 基本信息
                baseInfo: {
                    selector: ".besic_inform table:eq(0)",
                    dealStrategy: "jsdom",
                    data: [
                        // 物业类型
                        core.utils.data_builder.normal("type", ["tr:eq(0) td:eq(0)"], ["strong"]),
                        // 建筑类型
                        core.utils.data_builder.normal("buildingType", ["tr:eq(1) td:eq(0)"], ["strong"]),
                        // 装修情况
                        core.utils.data_builder.normal("decorationStandard", ["tr:eq(1) td:eq(1)"], ["strong", "span"]),
                        // 环线
                        core.utils.data_builder.normal("lines", ["tr:eq(2) td:eq(0)"], ["strong"]),
                        // 容积率
                        core.utils.data_builder.normal("volumeRate", ["tr:eq(3) td:eq(0)"], ["strong", "span"]),
                        // 绿化率
                        core.utils.data_builder.normal("greeningRate", ["tr:eq(3) td:eq(1)"], ["strong", "span"]),
                        // 开盘时间
                        core.utils.data_builder.normal("startTime", ["tr:eq(4) td:eq(0)"], ["strong", "span"]),
                        // 交房时间
                        core.utils.data_builder.normal("deliveryTime", ["tr:eq(4) td:eq(1)"], ["strong", "span"]),
                        // 物业费
                        core.utils.data_builder.normal("propertyFee", ["tr:eq(5) td:eq(0)"], ["strong"]),
                        // 物业公司
                        core.utils.data_builder.normal("propertyCompany", ["tr:eq(5) td:eq(1)"], ["srong"]),
                        // 开发商
                        core.utils.data_builder.normal("developerName", ["tr:eq(6) td:eq(0) .zib a:eq(0)"]),
                        // 预售许可证
                        core.utils.data_builder.normal("licence", ["tr:eq(7) td:eq(0)"], ["strong", "span"]),
                        // 售楼处地址
                        core.utils.data_builder.normal("sellAddress", ["tr:eq(8) td:eq(0)"], ["strong"]),
                        // 物业地址
                        core.utils.data_builder.normal("propertyAddress", ["tr:eq(9) td:eq(0)"], ["strong", "span"]),
                        // 参考单价
                        core.utils.data_builder.normal("price", ["tr:eq(20) td:eq(0) .currentPrice .fontStyle_sp"])
                    ]
                },
                moreInfo: {
                    selector: ".besic_inform",
                    dealStrategy: "jsdom",
                    data: [
                        // 车位数
                        core.utils.data_builder.normal("parkingAmount", [".lineheight:eq(5)"], ["strong", "br"]),
                        // 产权年限
                        core.utils.data_builder.normal("propertyAge", [".lineheight:eq(7)", {
                            contents: []
                        }, {
                            eq: [36]
                        }]),
                        // 工程进度
                        core.utils.data_builder.normal("jobProgress", [".lineheight:eq(7)", {
                            contents: []
                        }, {
                            eq: [32]
                        }]),
                        // 占地面积
                        core.utils.data_builder.normal("floorArea", [".lineheight:eq(7)", {
                            contents: []
                        }, {
                            eq: [2]
                        }]),
                        // 建筑面积
                        core.utils.data_builder.normal("areaAmount", [".lineheight:eq(7)", {
                            contents: []
                        }, {
                            eq: [6]
                        }]),
                        // 开工时间
                        core.utils.data_builder.normal("startTime", [".lineheight:eq(7)", {
                            contents: []
                        }, {
                            eq: [10]
                        }]),
                        // 竣工时间
                        core.utils.data_builder.normal("completingTime", [".lineheight:eq(7)", {
                            contents: []
                        }, {
                            eq: [14]
                        }])
                    ]
                }
            },
            ajax: {}
        };
    };
};