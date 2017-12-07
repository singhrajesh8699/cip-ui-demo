'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = mongoose.Types.ObjectId;

var fields = {
  customer: {}
};

var options = {timestamps: true, strict: false};

var TransactionSchema = new Schema(fields, options);

module.exports = mongoose.model('Transaction', TransactionSchema);
