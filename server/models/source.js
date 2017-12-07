'use strict';

var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	ObjectId = mongoose.Types.ObjectId;

var fields = {
	name: String,
	description: String,
	type: String,
	status: String,
	lastSynchedOn: Date,
	numRecords: Number,
	numUniques: Number,
	completeness: Number,
	uniqueness: Number,
	cardinality: Number,
	density: Number,
	cip_ui: {type: Boolean,
						default: false},
	apiEndPointConfig: {
		url: String,
		username: String,
		password: String
	},
	ftpConfig:{
		url: String,
		username: String,
		password: String
	},
	attributes:[],
	tenant: {}
};

var options = {timestamps: true};

var SourceSchema = new Schema(fields, options);

module.exports = mongoose.model('Source', SourceSchema);
