'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = mongoose.Types.ObjectId;

var fields = {
  name: String,
	description: String,
    clusters: [],
	card: {},
	overview: {},
	tenant: {}
};

var options = {timestamps: true};

var SchemeSchema = new Schema(fields, options);

module.exports = mongoose.model('Scheme', SchemeSchema);
