/**
 * Created by NICK on 16/7/7.
 */
let servers = [{
    "host": "61.52.253.116",
    "port": "8080",
    "type": "HTTP"
}, {
    "host": "114.80.207.175",
    "port": "810",
    "type": "HTTP"
}, {
    "host": "222.161.209.167",
    "port": "8102",
    "type": "HTTP"
}, {
    "host": "222.161.209.164",
    "port": "8102",
    "type": "HTTP"
}, {
    "host": "222.211.65.72",
    "port": "8080",
    "type": "HTTP"
}, {
    "host": "134.196.214.127",
    "port": "3128",
    "type": "HTTP"
}, {
    "host": "202.75.210.45",
    "port": "7777",
    "type": "HTTP"
}, {
    "host": "60.13.74.181",
    "port": "843",
    "type": "HTTP"
}, {
    "host": "58.248.254.38",
    "port": "80",
    "type": "HTTP"
}, {
    "host": "49.76.75.227",
    "port": "8118",
    "type": "HTTP"
}, {
    "host": "123.12.146.203",
    "port": "80",
    "type": "HTTP"
}, {
    "host": "60.13.74.187",
    "port": "843",
    "type": "HTTP"
}, {
    "host": "27.13.99.18",
    "port": "8118",
    "type": "HTTP"
}, {
    "host": "183.141.159.81",
    "port": "3128",
    "type": "HTTP"
}, {
    "host": "113.73.203.73",
    "port": "8118",
    "type": "HTTP"
}, {
    "host": "117.81.52.83",
    "port": "808",
    "type": "HTTP"
}, {
    "host": "121.33.226.167",
    "port": "3128",
    "type": "HTTP"
}, {
    "host": "121.40.108.76",
    "port": "80",
    "type": "HTTP"
}, {
    "host": "60.13.74.139",
    "port": "843",
    "type": "HTTP"
}, {
    "host": "60.13.74.142",
    "port": "843",
    "type": "HTTP"
}, {
    "host": "122.96.59.102",
    "port": "83",
    "type": "HTTP"
}, {
    "host": "122.96.59.102",
    "port": "83",
    "type": "HTTP"
}, {
    "host": "221.10.159.234",
    "port": "1337",
    "type": "HTTP"
}, {
    "host": "221.226.67.202",
    "port": "8118",
    "type": "HTTP"
}, {
    "host": "124.202.223.202",
    "port": "8118",
    "type": "HTTP"
}, {
    "host": "110.73.48.21",
    "port": "8123",
    "type": "HTTP"
}, {
    "host": "27.13.99.18",
    "port": "8118",
    "type": "HTTP"
}, {
    "host": "60.13.74.187",
    "port": "843",
    "type": "HTTP"
}, {
    "host": "119.53.128.172",
    "port": "8118",
    "type": "HTTP"
}, {
    "host": "58.252.28.135",
    "port": "8118",
    "type": "HTTP"
}, {
    "host": "123.12.146.203",
    "port": "80",
    "type": "HTTP"
}, {
    "host": "202.112.237.220",
    "port": "80",
    "type": "HTTP"
}, {
    "host": "123.57.52.171",
    "port": "80",
    "type": "HTTP"
}];
let length = servers.length;

module.exports = exports = {
    random: () => {
        let index = Math.round(Math.random() * length);

        return index < length ? servers[index] : servers[0];
    }
};