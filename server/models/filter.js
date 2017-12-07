'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = mongoose.Types.ObjectId;

var fields = {
  name: String,
  type: String
};

var options = {timestamps: true, strict: false};

var FilterSchema = new Schema(fields, options);

module.exports = mongoose.model('Filter', FilterSchema);
