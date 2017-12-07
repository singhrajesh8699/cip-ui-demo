'use strict';

var express = require('express'),
  router = express.Router(),
	mongoose = require('mongoose'),
	Scheme = mongoose.models.Scheme,
	Transaction = mongoose.models.Transaction,
  _ = require("lodash"),
	async = require('async'),
	apiAuth = require('../utils/apiAuth'),
  apiResponse = require('../utils/apiResponse'),
  apiErrors = require('../utils/apiErrors'),
  config = require('../config/config');


/*=============================================>>>>>
= Public methods =
===============================================>>>>>*/

var getAllSchemes = function(req, res) {
	console.log(req.headers);
	// Send back in the order inserted so that it is shown in the order of importance
	Scheme.find({"tenant._id": mongoose.Types.ObjectId(req.headers.tenantid)}, null, {sort: {'order_num': 1} }, function(err, response) {
		if(err){
			return apiResponse.sendError(apiErrors.APPLICATION.INTERNAL_ERROR, null, 500, req, res);
		}
		apiResponse.sendResponse(response, 200, req, res);
	});
};

var getSchemeDetails = function(req, res) {
	Scheme.findById(req.params.id, function(err, response) {
		if(err){
			return apiResponse.sendError(apiErrors.APPLICATION.INTERNAL_ERROR, null, 500, req, res);
		}
		apiResponse.sendResponse(response, 200, req, res);
	});
};

var getSchemeDetailsByName = function(req, res) {
	Scheme.find({"tenant._id": mongoose.Types.ObjectId(req.headers.tenantid), name: req.params.name}, function(err, response) {
		if(err){
			return apiResponse.sendError(apiErrors.APPLICATION.INTERNAL_ERROR, null, 500, req, res);
		}
		apiResponse.sendResponse(response[0], 200, req, res);
	});
};


var getAllDataTenant = function(req, res) {
	Scheme.find({"tenant._id": mongoose.Types.ObjectId(req.headers.tenantid)}, function(err, response) {
		if(err){
			return apiResponse.sendError(apiErrors.APPLICATION.INTERNAL_ERROR, null, 500, req, res);
		}
		apiResponse.sendResponse(response, 200, req, res);
	});
};

var getSchemeDetailsByProduct = function(req, res) {
	var filters = {};
	// Category and Brand_Desc naming has been reversed
	if(req.params.department_name !== 'undefined') {
		filters['Category'] = req.params.department_name;
	}
	if(req.params.category_name !== 'undefined') {
		filters['BRAND_DESC'] = req.params.category_name;
	}

	Scheme.findById(req.params.id, function(err, response) {
		if(err){
			return apiResponse.sendError(apiErrors.APPLICATION.INTERNAL_ERROR, null, 500, req, res);
		}
		const schemeName = response.name;
		const schemeNameGroup = "$" + response.name;
		const schemeNameCustomerGroup = "$customer." + response.name;
		var projection = { customer: 1 };
		var projectionSchemeData = {};
		projectionSchemeData[schemeNameGroup] = schemeNameCustomerGroup;
		projection[schemeName] = projectionSchemeData;

		async.parallel({
			customerCount: function(callback) {
				Transaction.aggregate([{$match: filters},
																{$group: {_id: schemeNameCustomerGroup,
																					uniqueIds: { $addToSet: "$customer.INDIVIDUAL_ID"},
																					count: {$sum : 1}}}],
															function(err, result) {
																callback(err, result);
															});
			},
			totalSales: function(callback) {
				Transaction.aggregate([{$match: filters},
																{$group: {_id: schemeNameCustomerGroup,
																					count: {$sum : "$TotalPrice"}}}],
															function(err, result) {
																callback(err, result);
															});
			}
		}, function(err, result) {
			if(err){
				return apiResponse.sendError(apiErrors.APPLICATION.INTERNAL_ERROR, null, 500, req, res);
			}
			apiResponse.sendResponse(result, 200, req, res);
		});


	 });
}

var getSchemeInfo = function(scheme_name, tenantId, callback) {
	Scheme.find({name: scheme_name, 'tenant._id': mongoose.Types.ObjectId(tenantId)}, function(err, response) {
		if(err){
			callback(err, null);
		}
		else {
			callback(null, response);
		}
	});
}


/*= End of Public methods =*/
/*=============================================<<<<<*/

/*=============================================>>>>>
= Private methods =
===============================================>>>>>*/



/*= End of Private methods =*/
/*=============================================<<<<<*/

router.get('/schemes', getAllSchemes);
router.get('/schemes/:id', getSchemeDetails);
router.get('/schemesbyname/:name', getSchemeDetailsByName);
router.get('/schemesbyproduct/:id/:department_name/:category_name', getSchemeDetailsByProduct);

router.get('/alldatatenant', getAllDataTenant);

module.exports = router;

// Some helper functions
module.exports.utils = { getSchemeInfo: getSchemeInfo };
