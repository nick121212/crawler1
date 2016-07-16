let consign = require("consign");
let core = require("../core");
let Download = require("./libs/crawler");

consign({
        verbose: false
    })
    .include("utils")
    .include("func")
    .into(core, Download);

console.log(`pid:${process.pid};ENV:${process.env.ENV}`);