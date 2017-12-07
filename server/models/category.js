'use strict';

var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	ObjectId = mongoose.Types.ObjectId;

var fields = {
	name: String,
	description: String,
	records: Number,
	uniques: Number,
	completeness: Number,
	uniqueness: Number,
	cardinality: Number,
	density: Number,
	sources: [],
	tenant: {}
};

var options = {timestamps: true};

var CategorySchema = new Schema(fields, options);

module.exports = mongoose.model('Category', CategorySchema);
