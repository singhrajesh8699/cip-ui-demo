'use strict';

var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  Pricing = mongoose.models.Pricing,
_ = require("lodash"),
  apiResponse = require('../utils/apiResponse'),
  apiErrors = require('../utils/apiErrors'),
  config = require('../config/config'),
  schemeUtils = require('./scheme.js').utils;

/*=============================================>>>>>
= Public methods =
===============================================>>>>>*/

var queryPricing = function(req, res) {
    console.log(req.body);

    var scheme = req.body.scheme_name; 
    var tenantId = req.headers.tenantid;
   
    var product = 'D1C2';
    if (req.body.category_name === 'The Original Donut Shop') {
      product = "$Shoes-PriceTier";
    }
    else if (req.body.category_name === 'Newmans Own Organic') {
       product = "$Home-PriceTier";
    }
    else if (req.body.category_name && req.body.department_name === 'Coffee') {
       product = "D1C1";
    }

    if (product !== null) {
      Pricing.aggregate([
        { $group: {
            _id: { "Scheme": '$' + scheme, "Product": product },
            count: { "$sum": 1 }
        }},
        { $group: {
          _id: "$_id.Scheme",
          counts: { "$push": { "Scale": "$_id.Product", "count": "$count" } }
        }}
      ], function(err, result) {
        if(err){
          return apiResponse.sendError(apiErrors.APPLICATION.INTERNAL_ERROR, null, 500, req, res);
        }      
        else {
          postProcessResponse(scheme, tenantId, result, function(err, processedResult) {
            if (err) {
              return apiResponse.sendError(apiErrors.APPLICATION.INTERNAL_ERROR, null, 500, req, res);
            }
            apiResponse.sendResponse(processedResult, 200, req, res);
          });
        }
      });
    }
    else {
      return apiResponse.sendError(apiErrors.APPLICATION.INTERNAL_ERROR, null, 500, req, res);
    }
}

var postProcessResponse = function(scheme, tenantId, response, callback) {
    
    schemeUtils.getSchemeInfo(scheme, tenantId, function(err, schemeInfo) {
      if (err) callback(err, null);
      else {   
        response.forEach(function(pricing, index) {
          if (pricing._id !== null) {
            var clusterInfo = _.find(schemeInfo[0].clusters, function(cluster) {
              return cluster.name === pricing._id;
            });
            pricing.order_num = clusterInfo.order_num;
            pricing.counts.forEach(function(count) {
              pricing.counts.count += tempRandomizePricing();
            });
          }
          else {
            pricing.order_num = -1;
          }
        });
        callback(null, response);
      }
    });
}

var tempRandomizePricing = function(cp) {
    var min = 30;
    var max = 500;
    var r = (Math.random() * (max - min)) + min; 
    return r;
}


/*= End of Private methods =*/
/*=============================================<<<<<*/

router.post('/pricing/query', queryPricing);

module.exports = router;
