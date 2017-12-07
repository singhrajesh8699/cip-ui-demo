'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = mongoose.Types.ObjectId;

var fields = {
  name: String,
  description: String,
  scheme_name: String,
  revenue: Number,
  avg_sales: Number,
  cluster_details:{}
};

var options = {timestamps: true};

var ClusterSchema = new Schema(fields, options);

module.exports = mongoose.model('Cluster', ClusterSchema);
