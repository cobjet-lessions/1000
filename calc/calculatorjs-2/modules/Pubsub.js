/**
 * Created by ypanyukov on 09.10.14.
 */

var Pubsub = (function () {
    var events = {};

    return {
        subscribe: function (event, callback) {
            if (!events[event])
                events[event] = { callbacks: [] }

            var index = events[event].callbacks.push(callback) - 1;

            return {
                remove: function () {
                    events.splice(index, 1);
                }
            };
        },
        publish: function (event, data) {
            var callbacks = events[event].callbacks;

            if (!events[event] || callbacks.length == 0)
                return;

            callbacks.forEach(function(callback){
                callback(data || {})
            });
        }
    };
})();