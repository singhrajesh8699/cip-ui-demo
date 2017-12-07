'use strict';

var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	ObjectId = mongoose.Types.ObjectId;

var fields = {
    data: {}
};

var options = {timestamps: true, strict: false};

var CustomerFeedbackSchema = new Schema(fields, options);

module.exports = mongoose.model('CustomerFeedback', CustomerFeedbackSchema);
