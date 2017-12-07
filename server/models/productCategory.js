'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = mongoose.Types.ObjectId;

var fields = {
    name: String,
    categories:[],
    tenant: {}
};

var options = {timestamps: true};

var ProductCategorySchema = new Schema(fields, options);

module.exports = mongoose.model('ProductCategory', ProductCategorySchema);