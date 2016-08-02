/**
 * Created by NICK on 16/7/1.
 */
let schedule = require("node-schedule");
let shell = require('shelljs');

module.exports = exports = (core) => {
    let commands = [
        "poff nicv",
        "pptpsetup --create nicv --server czpptp.webok.net --user cz003 --password 111 --start",
        "route add default gw ",
        "service nginx restart",
        "service nginx stop",
        "service nginx start",
        "route",
        "route delete default gw all"
    ];
    let isRunning = false;
    let scheduleJob1 = () => {
        console.log("nginx restart at ", new Date());
        shell.exec(commands[3], {silent: false});
    };
    let scheduleJob = () => {
        let isSuccess, localhostIp, pptpsetup, datas = [];

        if (isRunning) return;
        isRunning = true;
        shell.exec(commands[4], {silent: false});
        console.log("poff restart at ", new Date());
        shell.exec(commands[0], {silent: false});

        setTimeout(function () {
            "use strict";
            console.log("pptpsetup restart at ", new Date());
            pptpsetup = shell.exec(commands[1], {silent: true, async: true});
            pptpsetup.stdout.on("data", (data) => {
                !isSuccess && (isSuccess = /succeeded/i.test(data));
                datas.push(data);

                if (/remote/i.test(datas.join(""))) {
                    isSuccess && (localhostIp = datas.join("").match(/([1-9]{1,3}\.){3}[1-9]{1,3}/ig));
                    console.log(localhostIp);
                    if (isSuccess && localhostIp.length > 1) {
                        console.log("route restart at ", new Date());
                        shell.exec(commands[2] + localhostIp[0], {silent: false});
                        let route = shell.exec(commands[6], {silent: false}).stdout;
                        console.log("ip是否在route中", route.indexOf(localhostIp[0]));
                        if (route.indexOf(localhostIp[0]) > 0) {
                            shell.exec(commands[5], {silent: false});
                            //shell.exit(1);
                            setTimeout(scheduleJob1, 5000);
                        } else {
                            setTimeout(function () {
                                scheduleJob();
                            }, 10);
                        }
                    }
                }
            });
        }, 1000);
    };
    return (options) => {
        schedule.scheduleJob(`*/${options.interval || 1} * * * *`, scheduleJob);
    };
};