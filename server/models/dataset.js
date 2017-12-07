'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = mongoose.Types.ObjectId;

var fields = {
  name: String,
	description: String,
	status: {
		type: String,
		default: "new"
	},
	attributes: [],
	records: [],
	tenant: {},
	tenantID: String
};

var options = {timestamps: true};

var DatasetSchema = new Schema(fields, options);

module.exports = mongoose.model('Dataset', DatasetSchema);
