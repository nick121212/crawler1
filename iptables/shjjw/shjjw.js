// http://www.shjjw.gov.cn/fg/wygl/wyxq/s?pn=1&ps=50
let core = require("../../core");
let _ = require("lodash");
let request = require("superagent");
let fs = require("fs");
let superagent_proxy = require("superagent-proxy")(request);
let superagent_charset = require("superagent-charset")(request);
let qresult = null, page = 240, per_page = 50;

let download = () => {
    let req = request.get(`http://www.shjjw.gov.cn/fg/wygl/wyxq/s?pn=${page}&ps=${per_page}`);
    let defer = Promise.defer();

    req
        .end((err, res) => {
            if (err) {
                return defer.reject(err);
            }
            if (!res.text || res.statusCode !== 200) {
                return defer.reject(new Error(`状态码(${res.statusCode})不正确。`));
            }

            defer.resolve(res.text);
        });

    return defer.promise;
};

let getDetail = (url)=> {
    let req = request.get(url);
    let defer = Promise.defer();

    req
        .end((err, res) => {
            if (err) {
                return defer.reject(err);
            }
            if (!res.text || res.statusCode !== 200) {
                return defer.reject(new Error(`状态码(${res.statusCode})不正确。`));
            }

            let data = JSON.parse(res.text);

            if (data.flag !== 0) {
                return defer.reject(new Error(data.msg));
            }

            defer.resolve(data.data);
        });

    return defer.promise;
};

let searchCallback = (data)=> {
    let promises = [];
    data = JSON.parse(data);


    _.each(data.data.list, (d)=> {
        promises.push(getDetail(`http://www.shjjw.gov.cn/fg/wygl/xq/?id=${d.keyid}`));
        // fs.appendFileSync("./shjjw/keys.txt", `${d.keyid}\r\n`);
    });

    console.log(page);
    Promise.all(promises).then((results)=> {
        let creates = [];

        _.each(results, (res)=> {
            creates.push({
                index: {
                    _index: "shjjw",
                    _type: "community",
                    _id: res.projectname
                }
            });
            creates.push({
                address: res.concretaddr,
                name: res.projectname,
                areaAmount: res.totalbuildingarea,
                propertyName: res.companyname,
                propertyType: res.housekind,
                streetCode: res.streetname,
                areaCode: res.distname
            });
        });


        if (data.flag !== 0) {
            return console.error(data.msg);
        }

        if (data.data.total >= (page - 1) * per_page) {
            page++;
        }
        else {
            return console.log("ok");
        }

        core.elastic.bulk({
            body: creates
        }).then(()=> {
            setTimeout(()=> {
                console.log("download");
                download().then(searchCallback, console.error);
            }, 500);
        }, console.error);
    }, ()=> {
        download().then(searchCallback, console.error);
    });
};

download().then(searchCallback, console.error);