module.exports = (core) => {
    return (config) => {
        config.pages.house = {
            key: "crawler.house",
            rule: {
                "regexp": /\/loupan\/canshu-\d*\.html/.toString(),
                scope: "i"
            },
            fieldKey: "name",
            test: false,
            area: {
                position: {
                    selector: ".crumb-item a",
                    dealStrategy: "jsdom",
                    data: [
                        // 省市
                        core.utils.data_builder.normal("province", [{
                            eq: [0]
                        }]),
                        // 城市
                        core.utils.data_builder.normal("city", [{
                            eq: [1]
                        }]),
                        // 城市
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
                    selector: ".can-container .can-item:eq(0) .can-border .list li",
                    dealStrategy: "jsdom",
                    data: [
                        // core.utils.data_builder.array("switchs", [], [], [
                        //     core.utils.data_builder.switchs(".name",[])
                        // ]),
                        // 小区名称
                        core.utils.data_builder.normal("name", ["li:eq(0) .des"], ["i"]),
                        // 楼盘特点标签
                        core.utils.data_builder.array("tags", ["li:eq(1) .des a"], [], [
                            core.utils.data_builder.normal("")
                        ]),
                        // 参考单价
                        core.utils.data_builder.normal("price", ["li:eq(2) .des"], [".space"]),
                        // 楼盘总价
                        core.utils.data_builder.normal("totalPrice", ["li:eq(3) .des"]),
                        // 物业类型
                        core.utils.data_builder.normal("type", ["li:eq(4) .des"]),
                        // 开发商
                        core.utils.data_builder.normal("developerName", ["li:eq(5) .des a"]),
                        // 行政区
                        core.utils.data_builder.normal("district", ["li:eq(6) .des"]),
                        // 楼盘地址
                        core.utils.data_builder.normal("address", ["li:eq(7) .des"], [".space"]),
                        // 售楼电话
                        core.utils.data_builder.normal("sellPhone", ["li:eq(8) .des"])
                    ]
                },
                sellInfo: {
                    selector: ".can-container .can-item:eq(1) .can-border .list",
                    dealStrategy: "jsdom",
                    data: [
                        // 最低首付
                        core.utils.data_builder.normal("downPayment", ["li:eq(0) .des"], [".space"]),
                        // 月供
                        core.utils.data_builder.normal("monthPayment", ["li:eq(1) .des"]),
                        // 开盘时间
                        core.utils.data_builder.normal("startTime", ["li:eq(3) .des"]),
                        // 交房时间
                        core.utils.data_builder.normal("deliveryTime", ["li:eq(4) .des"]),
                        // 售楼处地址
                        core.utils.data_builder.normal("sellAddress", ["li:eq(5) .des"])
                    ]
                },
                communityInfo: {
                    selector: ".can-container .can-item:eq(2) .can-border .list",
                    dealStrategy: "jsdom",
                    data: [
                        // 建筑类型
                        core.utils.data_builder.normal("buildingType", ["li:eq(0) .des"], [".space"]),
                        // 产权年限
                        core.utils.data_builder.normal("propertyAge", ["li:eq(1) .des"], [".space"]),
                        // 装修标准
                        core.utils.data_builder.normal("decorationStandard", ["li:eq(2) .des"], [".space"]),
                        // 容积率
                        core.utils.data_builder.normal("volumeRate", ["li:eq(3) .des"], [".space"]),
                        // 绿化率
                        core.utils.data_builder.normal("greeningRate", ["li:eq(4) .des"], [".space"]),
                        // 规划户数
                        core.utils.data_builder.normal("totalHouseholds", ["li:eq(5) .des"], [".space"]),
                        // 楼层状况
                        core.utils.data_builder.normal("floorInfo", ["li:eq(6) .des"]),
                        // 工程进度
                        core.utils.data_builder.normal("jobProgress", ["li:eq(7) .des"]),
                        // 物业费
                        core.utils.data_builder.normal("propertyFee", ["li:eq(8) .des"]),
                        // 物业公司
                        core.utils.data_builder.normal("propertyCompany", ["li:eq(9) .des"]),
                        // 车位数
                        core.utils.data_builder.normal("parkingAmount", ["li:eq(10) .des"]),
                        // 车位比
                        core.utils.data_builder.normal("parkingRate", ["li:eq(11) .des"], [".space"])
                    ]
                },
                moreInfo: {
                    selector: ".can-container .can-item:eq(3) .can-border .list",
                    dealStrategy: "jsdom",
                    data: [
                        // 最新动态
                        core.utils.data_builder.normal("latestNews", ["li:eq(1) .des"], [".space"]),
                        // 最新楼评
                        core.utils.data_builder.normal("latestComment", ["li:eq(2) .des"], [".space"]),
                        // 最新画报
                        core.utils.data_builder.normal("latestPictorial", ["li:eq(3) .des"], [".space"]),
                        // 最新导购
                        core.utils.data_builder.normal("latestDynamic", ["li:eq(4) .des"], [".space"])
                    ]
                }
            },
            ajax: {}
        };
    };
};