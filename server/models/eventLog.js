'use strict';

var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId;

var fields = {
	context_id: String,
	actor: String,
	actor_id: String,
	event_category: String,
	status_code: Number,
	status_message: String,
	event_info: {}
};

var EventLogSchema = new Schema(fields, {timestamps: true});

module.exports = mongoose.model('EventLog', EventLogSchema);
