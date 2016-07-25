/**
 * Created by NICK on 16/7/1.
 */

let consign = require('consign');
let core = require("../core");
var program = require('commander');

consign({
    verbose: false
})
    .include('utils')
    .include('config/anjuke/pages')
    .include('config/lianjia/pages')
    .include('config/angejia/pages')
    .include('config')
    .include('func')
    .include('command')
    .into(core, program);

program.version("1.0.0").parse(process.argv);