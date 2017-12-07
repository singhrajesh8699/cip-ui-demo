'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = mongoose.Types.ObjectId;

var fields = {
  scheme: {},
	data: {},
};

var options = {timestamps: true, strict: false};

var ClusterProductAffinitySchema = new Schema(fields, options);

module.exports = mongoose.model('ClusterProductAffinity', ClusterProductAffinitySchema);
