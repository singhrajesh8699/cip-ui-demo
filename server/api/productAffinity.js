'use strict';

var express = require('express'),
  router = express.Router(),
	mongoose = require('mongoose'),
	Scheme = mongoose.models.Scheme,
	Cluster = mongoose.models.Cluster,
	Transaction = mongoose.models.Transaction,
	ClusterProductAffinity = mongoose.models.ClusterProductAffinity,
	ProductAffinity = mongoose.models.ProductAffinity,
  _ = require("lodash"),
	async = require('async'),
  apiResponse = require('../utils/apiResponse'),
  apiErrors = require('../utils/apiErrors'),
  config = require('../config/config');


/*=============================================>>>>>
= Public methods =
===============================================>>>>>*/

var getAllProductAffinitys = function(req, res) {
	ProductAffinity.find({}, function(err, response) {
		if(err){
			return apiResponse.sendError(apiErrors.APPLICATION.INTERNAL_ERROR, null, 500, req, res);
		}
		apiResponse.sendResponse(response, 200, req, res);
	});
};

var getProductAffinityDetails = function(req, res) {
	ProductAffinity.findById(req.params.id, function(err, response) {
		if(err){
			return apiResponse.sendError(apiErrors.APPLICATION.INTERNAL_ERROR, null, 500, req, res);
		}
		apiResponse.sendResponse(response, 200, req, res);
	});
};

var getClusterProductAffinityDetails = function(req, res) {
	ClusterProductAffinity.findOne({"scheme._id": mongoose.Types.ObjectId(req.params.id)}, function(err, response) {
		if(err){
			return apiResponse.sendError(apiErrors.APPLICATION.INTERNAL_ERROR, null, 500, req, res);
		}
		apiResponse.sendResponse(response, 200, req, res);
	});
};

var getProductAffinityByDeptCat = function(req, res) {
  var limit = parseInt(req.params.limit);
  var filters = {};
  if(req.params.deptname && req.params.deptname !== 'null') {
    filters['department'] = req.params.deptname;
  }
  if(req.params.catname && req.params.catname !== 'null') {
    filters['category'] = req.params.catname;
  }
	ProductAffinity.find(filters, {affinity: {$slice: limit}}, function(err, response) {
		if(err){
			return apiResponse.sendError(apiErrors.APPLICATION.INTERNAL_ERROR, null, 500, req, res);
		}
		apiResponse.sendResponse(response, 200, req, res);
	});
};

var generateClusterProductAffinity = function(req, res) {
	Scheme.find({}).then(function(schemes) {

		async.each(schemes, function(scheme, mainCallback) {
			const schemeName = scheme.name;
			var clusterData = [];
			async.each(scheme.clusters, function(cluster, clusterCallback) {
				const clusterName = cluster.name;
				var filter = {};
				filter["customer." + schemeName] = clusterName;

				Transaction.aggregate(
					[
						{$match: filter},
						{$group: {
							_id: "$Category",
							count: {$sum: "$Quantity"}
						}}
					]
				, function(err, aggregates) {
					clusterData.push({cluster: cluster, data: aggregates});
					clusterCallback();
				});
			}, function(err) {
				var record = {scheme: scheme, data: clusterData};
				console.log(record);
				var clusterAffinity = new ClusterProductAffinity(record);
				clusterAffinity.save(function(err, doc) {
					mainCallback();
				});

			});
		}, function(err) {
			if(err){
				return apiResponse.sendError(apiErrors.APPLICATION.INTERNAL_ERROR, null, 500, req, res);
			}
			apiResponse.sendResponse(null, 200, req, res);
		});

	});
};


var getClusterProductAffinity = function(req, res) {
	Scheme.findById(req.params.id).then(function(scheme) {

	if(!scheme){
		return apiResponse.sendError(apiErrors.APPLICATION.INTERNAL_ERROR, null, 500, req, res);
	}

	const schemeName = scheme.name;
	var clusterData = [];
	console.log("scheme : " + schemeName + "   clusters " + scheme.clusters.length);
	async.each(scheme.clusters, function(cluster, clusterCallback) {
		const clusterName = cluster.name;

		var aggregationId = "$Category";

		var filter = {};
		filter["customer." + schemeName] = clusterName;

		if(req.params.deptname && req.params.deptname !== 'null'
			&& req.params.deptname !== 'undefined') {
			filter['Category'] = req.params.deptname;
			aggregationId = "$BRAND_DESC";
		}
		if(req.params.catname && req.params.catname !== 'null'
			&& req.params.deptname !== 'undefined') {
			filter['category'] = req.params.catname;
		}

		console.log("Aggregating with filters ");
		console.log(filter);

		Transaction.aggregate(
			[
				{$match: filter},
				{$group: {
					_id: aggregationId,
					count: {$sum: "$Quantity"}
				}}
			]
		, function(err, aggregates) {
			clusterData.push({cluster: cluster, data: aggregates});
			clusterCallback();
		});
	}, function(err) {
			var record = {scheme: scheme, data: clusterData};
			console.log(record);
			if(err){
				return apiResponse.sendError(apiErrors.APPLICATION.INTERNAL_ERROR, null, 500, req, res);
			}
			apiResponse.sendResponse(record, 200, req, res);

		});


	});
};

var queryProductAffinity = function(req, res) {
	var limit = parseInt(req.body.prodlimit);
  var filters = {};
  if(req.body.department_name) {
    filters['department'] = req.body.department_name;
  }
	if(req.body.category_name) {
    filters['category'] = req.body.category_name;
  }

	ProductAffinity.find(filters, {affinity: {$slice: limit}}, function(err, response) {
		if(err){
			return apiResponse.sendError(apiErrors.APPLICATION.INTERNAL_ERROR, null, 500, req, res);
		}
		apiResponse.sendResponse(tempRandomizeResponse(req.body, response), 200, req, res);
	});

}

var getRandom = function() {
		var offset_pos_random = (Math.random() * 300000);
    var offset_neg_random = (Math.random() * 200000);
    var isPos = (Math.random() * 2);
    if (isPos) {
      return offset_pos_random; 
    }
    else {
    	return offset_neg_random * -1;
    }
}

var tempRandomizeResponse = function(params, response) {
    
    response.forEach(function(pa) {
      pa.affinity.forEach(function(a) {
      	//console.log(a);
      	if (a.affinity_value !== 0) {
      		a.affinity_value = Math.round(a.affinity_value + getRandom());
      	}
      });
    });

    return response;
}


/*= End of Public methods =*/
/*=============================================<<<<<*/

/*=============================================>>>>>
= Private methods =
===============================================>>>>>*/



/*= End of Private methods =*/
/*=============================================<<<<<*/

router.get('/productaffinity', getAllProductAffinitys);
router.get('/generateaffinity', generateClusterProductAffinity);
router.get('/productaffinity/cluster/:id', getClusterProductAffinityDetails);
router.get('/productaffinity/cluster/:id/:deptname/:catname', getClusterProductAffinity);
router.get('/productaffinity/:id', getProductAffinityDetails);
router.get('/productaffinity/:deptname/:catname/:limit', getProductAffinityByDeptCat);

router.post('/productaffinity/query', queryProductAffinity);

module.exports = router;
