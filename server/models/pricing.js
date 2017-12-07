'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = mongoose.Types.ObjectId;

var fields = {
};

var options = {timestamps: true, strict: false};

var PricingSchema = new Schema(fields, options);

module.exports = mongoose.model('Pricing', PricingSchema);