let schedule = require("node-schedule");
let shell = require('shelljs');

let commands = [
    "poff nicv",
    "pptpsetup --create nicv --server czpptp.webok.net --user cz003 --password 111 --start &",
    "route add default gw ",
    "service nginx restart"
];

let scheduleJob = () => {
    let poff = shell.exec(commands[0], {silent: false}).stdout;
    let pptpsetup = shell.exec(commands[1], {silent: true, async: true});
    let isSuccess, localhostIp;
    let datas = [];

    pptpsetup.stdout.on("data", (data) => {
        !isSuccess && (isSuccess = /succeeded/i.test(data));
        datas.push(data);
        if (/remote/i.test(data)) {
            isSuccess && (localhostIp = datas.join("").match(/([1-9]{1,3}\.){3}[1-9]{1,3}/ig));
            console.log(localhostIp);
            if (isSuccess && localhostIp.length > 1) {
                console.log("ok");
            }
            shell.exec(commands[2] + localhostIp[0], {silent: false}).stdout;
            setTimeout(function () {
                shell.exec(commands[3], {silent: false}).stdout;
                setTimeout(()=> {
                    "use strict";
                    shell.exit(1);
                }, 2000);

            }, 1000);
        }
    });
};

schedule.scheduleJob('*/10 * * * *', scheduleJob);