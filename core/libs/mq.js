let config = require("../config");
let connectionStr = `amqp://${config.q.user}:${config.q.password}@${config.q.host}`;
let conn_promise = require('amqplib').connect(connectionStr);
let rpc = require('amqp-rpc').factory({
    url: connectionStr
});

function getQueue(qname, q_setting) {
    let defer = Promise.defer(),
        ch = null;

    conn_promise.then(conn => {
        return conn.createChannel();
    }).then((c) => {
        ch = c;
        return ch.assertQueue(qname, q_setting);
    }).then(q => {
        defer.resolve({
            ch: ch,
            q: q
        });
    }).catch(defer.reject);

    return defer.promise;
}

module.exports = exports = {
    getQueue: getQueue,
    rpc: rpc
};