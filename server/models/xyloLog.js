'use strict';

var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	ObjectId = mongoose.Types.ObjectId;

var fields = {
	description: {type: String},
	tag: {type: String},
	user: {}
};

var options = {timestamps: true};

var XyloLogSchema = new Schema(fields, options);

module.exports = mongoose.model('XyloLog', XyloLogSchema);
