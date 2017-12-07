'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = mongoose.Types.ObjectId;

var fields = {
  name: String,
	description: String,
	type: String,
	datasets: [],
	tenant: {}
};

var options = {timestamps: true};

var ProjectSchema = new Schema(fields, options);

module.exports = mongoose.model('Project', ProjectSchema);
