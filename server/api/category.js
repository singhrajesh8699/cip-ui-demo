'use strict';

var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'),
    Category = mongoose.models.Category,
    bcrypt = require("bcryptjs"),
    _ = require("lodash"),
    apiResponse = require('../utils/apiResponse'),
    apiErrors = require('../utils/apiErrors'),
    config = require('../config/config');

		mongoose.set('debug', true);

/*=============================================>>>>>
= Public methods =
===============================================>>>>>*/

var getCategories = function(req, res){
	Category.find().exec().then(function(result){
		apiResponse.sendPaginatedResponse(result, null, null, null, result.length, 200, req, res);
	},
	function(err){
		apiResponse.sendError(apiErrors.APPLICATION.INTERNAL_ERROR, null, 500, req, res);
	}).catch(function(exp){
		apiResponse.sendError(apiErrors.APPLICATION.INTERNAL_ERROR, null, 500, req, res);
	});
};

var getCategoriesTenant = function(req, res){
	req.tenantID = req.headers.tenantid;

	console.log("tenant ID " + req.tenantID);
	Category.find({"tenant._id": mongoose.Types.ObjectId(req.tenantID)}).exec().then(function(result){
		apiResponse.sendPaginatedResponse(result, null, null, null, result.length, 200, req, res);
	},
	function(err){
		apiResponse.sendError(apiErrors.APPLICATION.INTERNAL_ERROR, null, 500, req, res);
	}).catch(function(exp){
		apiResponse.sendError(apiErrors.APPLICATION.INTERNAL_ERROR, null, 500, req, res);
	});
};

var getCategory = function(req, res){
	Category.findById(req.params.id).exec().then(function(result){
		if(null == result){
			return apiResponse.sendError(apiErrors.APPLICATION.NO_RESOURCE_FOUND, null, 404, req, res);
		}
		apiResponse.sendPaginatedResponse(result, null, null, null, result.length, 200, req, res);
	},
	function(err){
		apiResponse.sendError(apiErrors.APPLICATION.INTERNAL_ERROR, null, 500, req, res);
	}).catch(function(exp){
		apiResponse.sendError(apiErrors.APPLICATION.INTERNAL_ERROR, null, 500, req, res);
	});
};

var updateCategory = function(req, res) {
	var reqBody = req.body;

	Category.findById(req.params.id).exec().then(function(category){
		if(category != null){
			if(typeof reqBody.name !== 'undefined') {
				category.name = reqBody.name;
			}

			if(typeof reqBody.description !== 'undefined') {
				category.description = reqBody.description;
			}

			if(typeof reqBody.records !== 'undefined') {
				category.records = reqBody.records;
			}

			if(typeof reqBody.uniques !== 'undefined') {
				category.uniques = reqBody.uniques;
			}

			if(typeof reqBody.completeness !== 'undefined') {
				category.completeness = reqBody.completeness;
			}

			if(typeof reqBody.uniqueness !== 'undefined') {
				category.uniqueness = reqBody.uniqueness;
			}

			if(typeof reqBody.cardinality !== 'undefined') {
				category.cardinality = reqBody.cardinality;
			}

			if(typeof reqBody.density !== 'undefined') {
				category.density = reqBody.density;
			}

			if(typeof reqBody.sources !== 'undefined') {
				category.sources = reqBody.sources;
			}

			category.save().then(function(result){
				if(null == result){
					return apiResponse.sendError(apiErrors.APPLICATION.INTERNAL_ERROR, null, 500, req, res);
				}
				apiResponse.sendResponse(null, 200, req, res);
			},
			function(err){
				apiResponse.sendError(apiErrors.APPLICATION.INTERNAL_ERROR, null, 500, req, res);
			}).catch(function(exp){
				apiResponse.sendError(apiErrors.APPLICATION.INTERNAL_ERROR, null, 500, req, res);
			});
		}
		else{
			apiResponse.sendError(apiErrors.APPLICATION.NO_RESOURCE_FOUND, null, 404, req, res);
		}
	},
	function(err){
		apiResponse.sendError(apiErrors.APPLICATION.INTERNAL_ERROR, null, 500, req, res);
	}).catch(function(exp){
		apiResponse.sendError(apiErrors.APPLICATION.INTERNAL_ERROR, null, 500, req, res);
	});
};

var addCategory = function(req, res){
	var reqBody = req.body;
	var category = new Category();

	category.tenantID = req.headers.tenantID;

	if(typeof reqBody.name !== 'undefined') {
		category.name = reqBody.name;
	}

	if(typeof reqBody.description !== 'undefined') {
		category.description = reqBody.description;
	}

	if(typeof reqBody.records !== 'undefined') {
		category.records = reqBody.records;
	}

	if(typeof reqBody.uniques !== 'undefined') {
		category.uniques = reqBody.uniques;
	}

	if(typeof reqBody.completeness !== 'undefined') {
		category.completeness = reqBody.completeness;
	}

	if(typeof reqBody.uniqueness !== 'undefined') {
		category.uniqueness = reqBody.uniqueness;
	}

	if(typeof reqBody.cardinality !== 'undefined') {
		category.cardinality = reqBody.cardinality;
	}

	if(typeof reqBody.density !== 'undefined') {
		category.density = reqBody.density;
	}

	if(typeof reqBody.sources !== 'undefined') {
		category.sources = reqBody.sources;
	}

	category.save().then(function(result){
		if(null == result){
			return apiResponse.sendError(apiErrors.APPLICATION.INTERNAL_ERROR, null, 500, req, res);
		}
		apiResponse.sendResponse(null, 200, req, res);
	},
	function(err){
		apiResponse.sendError(apiErrors.APPLICATION.INTERNAL_ERROR, null, 500, req, res);
	}).catch(function(exp){
		apiResponse.sendError(apiErrors.APPLICATION.INTERNAL_ERROR, null, 500, req, res);
	});
};


var deleteCategory = function(req, res){
	Category.findByIdAndRemove(req.params.id).exec().then(function(result){
		if(null == result){
			return apiResponse.sendError(apiErrors.APPLICATION.NO_RESOURCE_FOUND, null, 404, req, res);
		}
		apiResponse.sendResponse(null, 200, req, res);
	},
	function(err){
		apiResponse.sendError(apiErrors.APPLICATION.INTERNAL_ERROR, null, 500, req, res);
	}).catch(function(exp){
		apiResponse.sendError(apiErrors.APPLICATION.INTERNAL_ERROR, null, 500, req, res);
	});
};

/*= End of Public methods =*/
/*=============================================<<<<<*/

router.get('/categories', getCategories);

router.get('/categoriestenant', getCategoriesTenant);

router.get('/categories/:id', getCategory);

router.put('/categories/:id', updateCategory);

router.delete('/categories/:id', deleteCategory);

module.exports = router;
