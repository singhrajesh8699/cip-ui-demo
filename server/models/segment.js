'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = mongoose.Types.ObjectId;

var fields = {
    name: String,
    clusters:[],
    tenant: {}
};

var options = {timestamps: true};

var SegmentSchema = new Schema(fields, options);

module.exports = mongoose.model('Segment', SegmentSchema);