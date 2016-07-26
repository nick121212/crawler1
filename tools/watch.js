let consign = require('consign');
let core = require("../core");
let schedule = require("node-schedule");
let _ = require("lodash");

consign({ verbose: false })
    .include('utils')
    .include('config/anjuke/pages')
    .include('config/lianjia/pages')
    .include('config/angejia/pages')
    .include('config/wkzf/pages')
    .include('config/zhongyuan/pages')
    .include('config/iwjw/pages')
    .include('config/fangduoduo/pages')
    .include('config/qiongyou/pages')
    .include('config')
    .include('func')
    .into(core);

let keys = [],
    keyMap = {};

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

let scheduleJob = () => {
    let infos = {
        starting: [],
        pending: [],
        keys: keyMap
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
}

schedule.scheduleJob('*/10 * * * *', scheduleJob);

try {
    keys = process.env.KEYS.split(",");
} catch (e) {
    keys = ["anjuke", "angejia", "lianjia"];
}

_.each(keys, (key) => {
    keyMap[key] = 0;
})

console.log(`started at ${new Date()}`);

scheduleJob();