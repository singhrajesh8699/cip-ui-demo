'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = mongoose.Types.ObjectId;

var fields = {
  sourceName: String
};

var options = {timestamps: true, strict: false};

var CipDataSchema = new Schema(fields, options);

module.exports = mongoose.model('CipData', CipDataSchema);
