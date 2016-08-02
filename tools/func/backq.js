/**
 * Created by NICK on 16/7/1.
 */
module.exports = exports = (core) => {
    return (key, options) => {
        let search = (index, from = 0, size = 20) => {
            let defer = Promise.defer(), total = 0;

            core.q.getQueue(`crawler.urls.${key}`, {}).then((result) => {
                core.elastic.search({
                    index: index,
                    type: "mqurls",
                    scroll: '10s',
                    search_type: 'scan',
                    from: from,
                    size: size
                }, function getMoreUntilDone(error, response) {
                    if (error) {
                        console.log(error);
                        return defer.reject(error);
                    }

                    response.hits.hits.forEach(function (res) {
                        res = res._source;
                        result.ch.publish("amq.topic", `${result.q.queue}.urls`, new Buffer(JSON.stringify(res)), {
                            persistent: true
                        });
                    });
                    total += response.hits.hits.length;
                    console.log("scroll to:", total);
                    if (response.hits.total !== total) {
                        core.elastic.scroll({
                            scrollId: response._scroll_id,
                            scroll: '30s'
                        }, getMoreUntilDone);
                    } else {
                        console.log("done");
                        defer.resolve();
                    }
                });
            }, defer.resolve);

            return defer.promise;
        };

        return search(`${key}-crawler-allin`);
    };
};