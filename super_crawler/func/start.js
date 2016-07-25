/**
 * Created by NICK on 16/7/1.
 */
let _ = require("lodash");

module.exports = exports = (core, Download) => {
    let ipInfo = core.utils.ipinfo;
    let start = (params, cb) => {
        let config = typeof params.config === "object" ? params.config : JSON.parse(params.config);

        if (core.downloadInstance) {
            return cb(`${process.pid}已经启动了！`, {
                pid: process.pid
            });
        }
        try {
            config.blackPathList = config.blackPathList.map((path) => {
                return new RegExp(core.utils.tools.replaceRegexp(path.regexp), path.scope);
            });
            config.whitePathList = config.whitePathList.map((path) => {
                return new RegExp(core.utils.tools.replaceRegexp(path.regexp), path.scope);
            });
            try {
                // 启动爬虫
                core.downloadInstance = new Download(config);
                core.downloadInstance.doStart();

                if (core.downloadInstance.isStart) {
                    cb(null, {
                        pid: process.pid
                    });
                } else {
                    cb("启动失败！");
                }
            } catch (e) {
                cb(e.message);
            }
        } catch (e) {
            cb(e.message);
        }
    };

    core.q.rpc.onBroadcast('start', start, null, {
        autoDelete: true
    });
    core.q.rpc.onBroadcast(`start.${ipInfo.hostname}`, start, null, {
        autoDelete: true
    });
    core.q.rpc.on(`start.${process.pid}`, start, null, {
        autoDelete: true
    });
};