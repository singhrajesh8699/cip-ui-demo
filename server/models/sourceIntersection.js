'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = mongoose.Types.ObjectId;

var fields = {
  sources: [],
	result: [],
	count: Number
};

var options = {timestamps: true};

var sourceIntersection = new Schema(fields, options);

module.exports = mongoose.model('SourceIntersection', sourceIntersection);
