/**
 * Created by NICK on 16/7/1.
 */

let consign = require('consign');
let core = require("../core");
var program = require('commander');

consign({verbose: false})
    .include('utils')
    .include('config/anjuke/pages')
    .include('config/lianjia/pages')
    .include('config/angejia/pages')
    .include('config/wkzf/pages')
    .include('config/zhongyuan/pages')
    .include('config/iwjw/pages')
    .include('config/fangdd/pages')
    .include('config/qiongyou/pages')
    .include('config')
    .include('func')
    .include('command')
    .into(core, program);

program.version("1.0.0").parse(process.argv);

let datas = [
    "sing interface ppp0",
    "Connect: ppp0 <--> /dev/pts/2",
    "CHAP authentication succeeded",
    "CCP terminated by peer (No compression negotiated)",
    "Compression disabled by peer.",
    "local  IP address 14.3.10.15",
    "remote IP address 15.3.1.2"
];

console.log("abba".match(/([a-z])([a-z])\2\1/ig));

console.log(datas.join("").match(/\d{1,3}.\d{1,3}.\d{1,3}.\d{1,3}/ig));
