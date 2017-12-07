'use strict';

var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	ObjectId = mongoose.Types.ObjectId;

var fields = {
	name: String,
	description: String,
	filters: [],
	groupByField: String,
	result: {},
	tenant: {}
};

var options = {timestamps: true, strict: false};

var CustomerGroupSchema = new Schema(fields, options);

module.exports = mongoose.model('CustomerGroup', CustomerGroupSchema);
