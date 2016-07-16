# 1.配置文件说明
##  key {String}
    用于创建queue的router,以及存储的数据库名称。
    sample: lianjia
## host {String}
    页面的主入口。
    sample: sh.lianjia.com
##  domainWhiteList {Array}
    域名白名单。
    sample: 
    ```json
    ["sh.fang.lianjia.com"]
    ```
##  blackPathList {Array}
    链接中path部分黑名单。
    
    regexp: 正则表达式
    scope:  正则的flag
    
    sample: 
    ```json 
        [{
            regexp: "^\/list\/search",
            scope: "i"
        }, {
            regexp: "^\/list\/[a-f|h-o|q-z]{1,5}[1-9]{1,2}\/{0,1}$",
            scope: "i"
        }, {
            regexp: "^\/list\/[a-z]{1,}\/{0,1}$",
            scope: "i"
        }]
    ```
##  whitePathList {Array}
    链接中path部分白名单。
    
    regexp: 正则表达式
    scope:  正则的flag
        
    sample: 
    ```json
        [{
            regexp: "^\/ershoufang\/(.*?)(\.html)$",
            scope: "i"
        }]
    ```
##  pages {Object}
    配置爬取页面的信息。
    存储的时候,[key]为type,[field]为字段。
    
    [key] {String} 配置的key
        rule  {Object}  匹配的正则表达规则
            regexp {String} 正则表达式
            scope  {String} 正则表达式flag
        data {Object} 配置需要获取的数据字段
            [field] {String} 数据字段名称,保存时也用这个名称
                strategy {String} 解析策略。可选【cheerio】
                dataStrategy {String} 数据处理策略。可选【array,string】
                selector {String} 选择器字符串
                         {Array}  选择器数组
                          {
                             type {String} 选择器类型。可选【selector,method】
                             text:{String} 选择器字符串 ,type是selector时可用
                              method {String} 方法名称,type是method时可用
                              params {Array} 方法所需的参数,type是method时可用
                          }
                method   {String} 通过选择器解析到的dom,执行的方法来获取数据
                params    {Array}  method中用到的参数配置
                data      {Object} 同父级中的data配置

    sample: 
    ```json
    {
        // 二手房
        ershoufang: {
            // test: true,
            rule: {
                regexp: "\/ershoufang\/(.*?)(\.html)$",
                scope: "i"
            },
            data: {
                // 总价
                total: {
                    strategy: "cheerio",
                    selector: ".houseInfo .price .mainInfo",
                    method: "text",
                    dataStrategy: "string"
                },
                // 房型
                room: {
                    strategy: "cheerio",
                    selector: ".houseInfo .room .mainInfo",
                    method: "text",
                    dataStrategy: "string"
                },
                // 面积
                area: {
                    strategy: "cheerio",
                    selector: ".houseInfo .area .mainInfo",
                    method: "text",
                    dataStrategy: "string"
                },
                // 单价 .aroundInfo tr:eq(0)
                price: {
                    strategy: "cheerio",
                    selector: [{
                        type: "selector",
                        text: ".aroundInfo tr"
                    }, {
                        type: "method",
                        method: "eq",
                        params: [0]
                    }],
                    method: "text",
                    dataStrategy: "string"
                },
                // 楼层 ".aroundInfo tr:eq(1) td:eq(0)"
                floor: {
                    strategy: "cheerio",
                    selector: [{
                        type: "selector",
                        text: ".aroundInfo tr"
                    }, {
                        type: "method",
                        method: "eq",
                        params: [1]
                    }, {
                        type: "selector",
                        text: "td"
                    }, {
                        type: "method",
                        method: "eq",
                        params: [0]
                    }],
                    method: "text",
                    dataStrategy: "string"
                },
                // 建造年份 .aroundInfo tr:eq(1) td:eq(1)
                build: {
                    strategy: "cheerio",
                    selector: [{
                        type: "selector",
                        text: ".aroundInfo tr"
                    }, {
                        type: "method",
                        method: "eq",
                        params: [1]
                    }, {
                        type: "selector",
                        text: "td"
                    }, {
                        type: "method",
                        method: "eq",
                        params: [1]
                    }],
                    method: "text",
                    dataStrategy: "string"
                },
                // 小区名
                xiaoqu: {
                    strategy: "cheerio",
                    selector: [{
                        type: "selector",
                        text: ".aroundInfo tr"
                    }, {
                        type: "method",
                        method: "eq",
                        params: [4]
                    }],
                    method: "text",
                    dataStrategy: "string"
                },
                // 地址
                address: {
                    strategy: "cheerio",
                    selector: [{
                        type: "selector",
                        text: ".aroundInfo tr"
                    }, {
                        type: "method",
                        method: "eq",
                        params: [5]
                    }],
                    method: "text",
                    dataStrategy: "string"
                },
                // 房型图片
                housePic: {
                    strategy: "cheerio",
                    selector: [{
                        type: "selector",
                        text: ".housePic .container .list div"
                    }, {
                        type: "method",
                        method: "not",
                        params: [".left_fix"]
                    }],
                    data: {
                        position: {
                            strategy: "cheerio",
                            selector: ".name",
                            method: "text",
                            dataStrategy: "string"
                        },
                        imageUrl: {
                            strategy: "cheerio",
                            selector: "img",
                            method: {
                                method: "attr",
                                params: ["src"]
                            },
                            dataStrategy: "string"
                        }
                    },
                    method: "each",
                    dataStrategy: "array"
                }
            }
        },
        // 新房
        detail: {
            rule: {
                regexp: "\/detail\/(.*?)",
                scope: "i"
            },
            data: {
                title: {
                    strategy: "cheerio",
                    selector: ".name-box a",
                    method: "text",
                    dataStrategy: "string"
                }
            }
        },
        // 小区
        xiaoqu: {
            // test: true,
            rule: {
                regexp: "\/xiaoqu\/(.*?)(\.html)$",
                scope: "i"
            },
            data: {
                // 所在城市
                city: {
                    strategy: "cheerio",
                    selector: [{
                        type: "selector",
                        text: ".intro .container .fl a"
                    }, {
                        type: "method",
                        method: "eq",
                        params: [1]
                    }],
                    method: "text",
                    dataStrategy: "string"
                },
                // 小区名
                title: {
                    strategy: "cheerio",
                    selector: ".detail-block .res-top .title .t h1",
                    method: "text",
                    dataStrategy: "string"
                },
                // 小区地址
                address: {
                    strategy: "cheerio",
                    selector: ".detail-block .res-top .title .t .adr",
                    method: "text",
                    dataStrategy: "string"
                },
                total: {
                    strategy: "cheerio",
                    selector: [{
                        type: "selector",
                        text: ".res-info .col-2 ol li"
                    }, {
                        type: "method",
                        method: "eq",
                        params: [4]
                    }, {
                        type: "selector",
                        text: ".other"
                    }],
                    method: "text",
                    dataStrategy: "string"
                }
            }
        }
    }
    ```