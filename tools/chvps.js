let schedule = require("node-schedule");
let shell = require('shelljs');

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
let scheduleJob1 = () => {
    console.log("nginx restart at ", new Date());
    shell.exec(commands[3], { silent: false });
};
let scheduleJob = () => {
    let isSuccess, localhostIp, pptpsetup, datas = [];

    shell.exec(commands[4], { silent: false });
    console.log("poff restart at ", new Date());
    shell.exec(commands[0], { silent: false });
    console.log("pptpsetup restart at ", new Date());
    pptpsetup = shell.exec(commands[1], { silent: true, async: true });
    pptpsetup.stdout.on("data", (data) => {
        !isSuccess && (isSuccess = /succeeded/i.test(data));
        datas.push(data);

        if (/remote/i.test(datas.join(""))) {
            isSuccess && (localhostIp = datas.join("").match(/([1-9]{1,3}\.){3}[1-9]{1,3}/ig));
            console.log(localhostIp);
            if (isSuccess && localhostIp.length > 1) {
                console.log("ok");
                console.log("route restart at ", new Date());

                shell.exec(commands[7], { silent: false });
                shell.exec(commands[2] + localhostIp[0], { silent: false });

                let route = shell.exec(commands[6], { silent: false }).stdout;

                console.log(route);
                console.log("ip是否在route中", route.indexOf(localhostIp[0]));

                if (route.indexOf(localhostIp[0]) > 0) {

                    shell.exec(commands[5], { silent: false });
                    shell.exit(1);
                }


            }
            // shell.exec(commands[5], {silent: false});
        }
    });
};

schedule.scheduleJob('*/2 * * * *', scheduleJob);
setTimeout(scheduleJob1, 5000);

// schedule.scheduleJob('*/3 * * * *', scheduleJob1);