/**
 * Created by NICK on 16/7/4.
 */

let _ = require("lodash");
let os = require('os');

module.exports = exports = (core)=> {
    /**
     * 获取ip信息
     */
    let ips = {};

    _.forEach(os.networkInterfaces(), (network) => {
        _.each(network, (ipInfo) => {
            !ips[ipInfo.family] && (ips[ipInfo.family] = []);
            ips[ipInfo.family].push(ipInfo.address);
        });
    });

    return {
        ips: ips,
        hostname: os.hostname()
    };
};