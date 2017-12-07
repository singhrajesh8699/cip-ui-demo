'use strict';

var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	ObjectId = mongoose.Types.ObjectId;

var fields = {
	tenant: {}
};

var options = {timestamps: true, strict: false};

var OnlineDataSchema = new Schema(fields, options);

module.exports = mongoose.model('Onlinedata', OnlineDataSchema);
