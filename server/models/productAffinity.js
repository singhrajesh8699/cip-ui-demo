'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = mongoose.Types.ObjectId;

var fields = {
  department: String,
  category: String,
  product: String,
  affinity: []
};

var options = {timestamps: true};

var ProductAffinitySchema = new Schema(fields, options);

module.exports = mongoose.model('ProductAffinity', ProductAffinitySchema);
