let schedule = require("node-schedule");
let shell = require('shelljs');

let commands = [
    "pptpsetup --create nicv --server czpptp.webok.net --user cz003 --password 111 --encrypt --start",
    "route add default gw ",
    "service nginx restart"
];

let scheduleJob = () => {
    let pptpsetup = shell.exec(commands[0], { silent: true }).stdout;
    let isSuccess = /succeeded/i.test(pptpsetup);
    let localhostIp = pptpsetup.match(/([1-9]{1,3}\.){3}[1-9]/ig); //local  IP address 11.1.1.14

    if (isSuccess) {

    }

    console.log(isSuccess, localhostIp);
};

// schedule.scheduleJob('*/5 * * * *', scheduleJob);


scheduleJob();