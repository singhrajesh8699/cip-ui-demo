'use strict';

var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  Promotions = mongoose.models.Promotions,
  _ = require("lodash"),
  async = require('async'),
  apiResponse = require('../utils/apiResponse'),
  apiErrors = require('../utils/apiErrors'),
  config = require('../config/config'),
  schemeUtils = require('./scheme.js').utils;


/*=============================================>>>>>
= Public methods =
===============================================>>>>>*/

var queryPromotions = function(req, res) {
    console.log(req.body);

    var scheme = req.body.scheme_name; 
    var tenantId = req.headers.tenantid;

    // TODO: Mapping to be changed shortly
    var product_pfx = null;
    if (req.body.category_name === 'The Original Donut Shop') {
      product_pfx = "D2C1";
    }
    else if (req.body.category_name === 'Newmans Own Organic') {
       product_pfx = "D3C1";
    }
    else {
      product_pfx = "D1C1";
    }
    //else if (req.body.category_name && req.body.department_name === 'Coffee') {
    //   product_pfx = "D1C1";
    //}
    // Intervals
    var bf_interval = 2;
    var af_interval = 2;
    if (req.body.bf_interval) {
      bf_interval = req.body.bf_interval;
    }
    if (req.body.af_interval) {
      af_interval = req.body.af_interval;
    }

    if (product_pfx !== null) {
      getPromotions(scheme, product_pfx, bf_interval, af_interval, function(err, result) {
        if(err){
          return apiResponse.sendError(apiErrors.APPLICATION.INTERNAL_ERROR, null, 500, req, res);
        }
        postProcessResponse(scheme, tenantId, result, function(err, processedResult) {
          if(err){
            return apiResponse.sendError(apiErrors.APPLICATION.INTERNAL_ERROR, null, 500, req, res);
          }
          apiResponse.sendResponse(processedResult, 200, req, res);
        });
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
        response.promo.forEach(function(promo, index) {
          var clusterInfo = _.find(schemeInfo[0].clusters, function(cluster) {
            return cluster.name === promo._id.Cluster;
          });
          promo.order_num = clusterInfo.order_num;
          promo.inc_sale += tempRandomizePromo(promo);
        });
        response.cherry_picked.forEach(function(cp, index) {
          var clusterInfo = _.find(schemeInfo[0].clusters, function(cluster) {
            return cluster.name === cp._id.Cluster;
          });
          cp.order_num = clusterInfo.order_num;
          cp.count += tempRandomizeCherry(cp);
        });
        callback(null, response);
      }
    });
}

var tempRandomizeCherry = function(cp) {
    var min = 40;
    var max = 300;
    var cp_count_random = (Math.random() * (max - min)) + min; 
    return cp_count_random;
}

var tempRandomizePromo = function(promo) {
    var min = 20; 
    var max = 100;
    var inc_sale_random = (Math.random() * (max - min)) + min;
    return inc_sale_random;  
    // min = 1; max = 2;
    // var r_bool = Math.floor(Math.random() * (max - min)) + min; 
    // if (r_bool === 2) {
    //   return inc_sale_random;
    // }
    // else {
    //   return inc_sale_random * -1;
    // }
}

function getPromotions(scheme, product, bf_interval, af_interval, mainCallback) {
  var product_during_promo = '$' + product + '-Promotion';
  var product_before_promo = '$' + product + '-Bf-Promotion' + '-' + bf_interval;
  var product_after_promo = '$' + product + '-Af-Promotion' + '-' + af_interval;
  var product_promo_only = product + '-PromotionOnlyFlag'; 
  var scheme_name = '$' + scheme;

  async.parallel({
    company_average: function(callback) {

      Promotions.aggregate([
        {
          "$match": {}
        },
        {
          $group: {
            _id: null,
            "avg_inc_sale": {$avg:
              {
                $subtract: [
                  product_during_promo,
                   { $avg: [product_before_promo, product_after_promo] } 
                  ]
                }
            }
          }
        }

      ], callback);
    },
    promo: function(callback) {
      Promotions.aggregate([
        {
          "$match": {}
        },
        {
          $group: {
            _id: { "Cluster": scheme_name },
            "inc_sale": {$avg:
              {
                $subtract: [
                  product_during_promo,
                   { $avg: [product_before_promo, product_after_promo] } 
                  ]
              }
            },
            "count": {$sum: 1}
          },
        }
      ], callback);
    },
    cherry_picked: function(callback) {
      var filters = {};
      filters[product_promo_only] = '1';
      Promotions.aggregate([
        {
          "$match": filters
        },
        {
          $group: {
            _id: { "Cluster": scheme_name },
            "count": {$sum: 1}
          }
        }
      ], callback);
    }
  }, function(err, result) {
    if(err) {
      return mainCallback(err, result);
    }
    //console.log(result.promo);
    //console.log(result.cherry_picked);
    mainCallback(null, result);
  });

}


/*= End of Private methods =*/
/*=============================================<<<<<*/

router.post('/promotions/query', queryPromotions);

module.exports = router;
