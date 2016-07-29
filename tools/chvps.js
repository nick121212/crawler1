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
    let nginx = shell.exec(commands[3], {silent: false}).stdout;
    let pptpsetup = shell.exec(commands[1], {silent: true, async: true});
    let isSuccess, localhostIp;
    let datas = [];

    console.log("restart at ", new Date());
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
                // shell.exit(1);
            }, 1000);
        }
    });
};

// console.log("start at ", new Date());
schedule.scheduleJob('*/10 * * * *', scheduleJob);
scheduleJob();