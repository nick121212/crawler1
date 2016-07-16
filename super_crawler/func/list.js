/**
 * 获取爬虫的基本信息
 */
module.exports = exports = (core) => {
    let counter = 0;
    let ipInfo = core.utils.ipinfo;
    let workerStat = (params, cb) => {
        if (params && params.type == 'fullStat') {
            cb(null, {
                pid: process.pid,
                hostname: ipInfo["hostname"],
                uptime: process.uptime(),
                ip: ipInfo.ips["IPv4"] || ipInfo.ips["IPv6"],
                downloader: core.downloadInstance || {},
                counter: counter++
            });
        }
        else {
            cb(null, {counter: counter++});
        }
    };
    let name = "getWorkerStat";

    core.q.rpc.onBroadcast(name, workerStat, null, {autoDelete: true});
    core.q.rpc.onBroadcast(`${name}.${ipInfo.hostname}`, workerStat, null, {autoDelete: true});
    core.q.rpc.on(`${name}.${process.pid}`, workerStat, null, {autoDelete: true});
};