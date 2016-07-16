let consign = require('consign');
let core = require("../core");
let schedule = require("node-schedule");
let _ = require("lodash");

consign({
        verbose: false
    })
    .include('utils')
    .include('config')
    .include('func')
    .into(core);

let check = (infos) => {
    _.each(infos.pending, (stat) => {
        let smallestKey = "";

        _.forEach(infos.keys, (val, key) => {
            if (!smallestKey) {
                smallestKey = key;
            }
            if (infos.keys[smallestKey] > val) {
                smallestKey = key;
            }
        });


        if (smallestKey && core.config[smallestKey] && core.config[smallestKey].index) {
            infos.keys[smallestKey]++;
            core.func.start(core.config[smallestKey].index, {
                pid: stat.pid
            });
        }
    });
};

schedule.scheduleJob('*/10 * * * *', function() {
    let infos = {
        starting: [],
        pending: [],
        keys: {
            "anjuke": 0,
            "fangtianxia": 0,
            "lianjia": 0
        }
    };
    // 获得所有的进程，有可能会落下一些节点
    core.func.list({
        interval: 5000
    }).then((stats) => {
        console.log(new Date());
        _.forEach(stats, (stat) => {
            if (stat.downloader.isStart) {
                // 如果时间大于3分钟，则杀掉进程。
                if (Date.now() - stat.downloader.lastTime > 3 * 60 * 1000) {
                    core.func.kill(stat.pid, {});
                } else {
                    infos.starting.push(stat);
                    !infos.keys[stat.downloader.host] && (infos.keys[stat.downloader.host] = 0);
                    infos.keys[stat.downloader.host]++;
                }
            } else {
                infos.pending.push(stat);
            }
        });
        check(infos);
    });
});