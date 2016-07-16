/**
 * Created by NICK on 16/7/1.
 */
module.exports = exports = (core, Download) => {
    core.q.rpc.on('info', function(params, cb, inf) {
        if (core.downloadInstance) {
            return core.downloadInstance.queue.queueStore.getCount(core.downloadInstance.key).then((counts) => {
                counts.length == 3 && (counts[2] = {
                    consumerCount: counts[2].q.consumerCount,
                    messageCount: counts[2].q.messageCount
                });
                cb(null, counts);
            }, (err) => {
                cb(err);
            });
        }
        cb();
    }, null, {
        autoDelete: true
    });
};