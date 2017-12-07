var events = require('events');
var eventEmitter = new events.EventEmitter();

var events = {
    LOGGED_IN: "user_logged_in"
};

var emitEvent = function(key, room, data) {
    eventEmitter.emit(key, room, data);
};

module.exports = {
    events : events,
    emitEvent: emitEvent
};
