module.exports = exports = {
    elastic: {
        host: "192.168.222.218",
        port: 9200
    },
    q: {
        host: "192.168.222.218",
        user: "nick",
        password: "111111"
    },
    database: {
        name: "longyan_online_20160629_09",
        username: "admin",
        password: "dbadmin@#",
        settings: {
            host: "192.168.221.11",
            dialect: 'mysql',
            pool: {
                max: 5,
                min: 0,
                idle: 10000
            }
        }
    }
};