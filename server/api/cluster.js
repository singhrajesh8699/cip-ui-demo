'use strict';

var express = require('express'),
  router = express.Router(),
	mongoose = require('mongoose'),
	Cluster = mongoose.models.Cluster,
  _ = require("lodash"),
	async = require('async'),
	apiAuth = require('../utils/apiAuth'),
  apiResponse = require('../utils/apiResponse'),
  apiErrors = require('../utils/apiErrors'),
  config = require('../config/config'),
  schemeUtils = require('./scheme.js').utils;


/*=============================================>>>>>
= Public methods =
===============================================>>>>>*/

var getAllClusters = function(req, res) {
	Cluster.find({"tenant._id": mongoose.Types.ObjectId(req.headers.tenantid)}, function(err, response) {
		if(err){
			return apiResponse.sendError(apiErrors.APPLICATION.INTERNAL_ERROR, null, 500, req, res);
		}
		apiResponse.sendResponse(response, 200, req, res);
	});
};

var getClusterDetails = function(req, res) {
    
    var tenantId = req.headers.tenantid;

	Cluster.findById(req.params.id, function(err, response) {
		if(err){
			return apiResponse.sendError(apiErrors.APPLICATION.INTERNAL_ERROR, null, 500, req, res);
		}
		else {
			var scheme = response.scheme_name;
			postProcessResponse(scheme, tenantId, response, function(err, processedResponse) {
        if (err) {
          return apiResponse.sendError(apiErrors.APPLICATION.INTERNAL_ERROR, null, 500, req, res);
        }
        apiResponse.sendResponse(processedResponse, 200, req, res);
      });
		}
	});
};

var getClusterId = function(req, res) {
	Cluster.findOne({"tenant._id": mongoose.Types.ObjectId(req.headers.tenantid), name: req.params.name}, function(err, response) {
		if(err){
            console.log(err);
			return apiResponse.sendError(apiErrors.APPLICATION.INTERNAL_ERROR, null, 500, req, res);
		}
        console.log(response);
		apiResponse.sendResponse(response, 200, req, res);
	});
};

/*= End of Public methods =*/
/*=============================================<<<<<*/

/*=============================================>>>>>
= Private methods =
===============================================>>>>>*/

var postProcessResponse = function(scheme, tenantId, response, callback) {

    // For Cluster-Lens, the scheme is as follows:
    // If scheme=='Life Stage' then lens='RFV'
    // Else lens='Life Stage'
    var cluster_lens_scheme = 'Life Stage';
    if (scheme === 'Life Stage') cluster_lens_scheme = 'RFV';
    schemeUtils.getSchemeInfo(cluster_lens_scheme, tenantId, function(err, lensSchemeInfo) {
      if (err) callback(err, null);
      else {
      	schemeUtils.getSchemeInfo(scheme, tenantId, function(err, schemeInfo) {
      		// Cluster Lens
	      	response.cluster_details.cluster_lens.forEach(function(clens, index) {
	          if (clens._id !== null) {
	            var clusterInfo = _.find(lensSchemeInfo[0].clusters, function(cluster) {
	              return cluster.name === clens._id;
	            });
	            clens.order_num = clusterInfo.order_num;
	          }
	          else {
	            clens.order_num = -1;
	          }
	        });
					if(scheme === "RFV") {
	        // Migration
		        response.cluster_details.migration2015.forEach(function(migration, index) {
		          if (migration._id !== null) {
		            var clusterInfo = _.find(schemeInfo[0].clusters, function(cluster) {
		              return cluster.name === migration._id;
		            });
		            migration.order_num = clusterInfo.order_num;
		          }
		          else {
		            migration.order_num = -1;
		          }
		        });
					}
	        callback(null, response);
	    	});
	    }
    });

}

/*= End of Private methods =*/
/*=============================================<<<<<*/

router.get('/clusters',  getAllClusters);
router.get('/clusters/:id', getClusterDetails);
router.get('/clusters/byname/:name', getClusterId);

module.exports = router;
