'use strict';

var express = require('express'),
  router = express.Router(),
	mongoose = require('mongoose'),
	AllData = mongoose.models.AllData,
  _ = require("lodash"),
	async = require('async'),
  apiResponse = require('../utils/apiResponse'),
  apiErrors = require('../utils/apiErrors'),
  config = require('../config/config');


/*=============================================>>>>>
= Public methods =
===============================================>>>>>*/

var getAllData = function(req, res) {
	AllData.find({}, function(err, response) {
		if(err){
			return apiResponse.sendError(apiErrors.APPLICATION.INTERNAL_ERROR, null, 500, req, res);
		}
		apiResponse.sendResponse(response, 200, req, res);
	});
};

var getDataDetails = function(req, res) {
	AllData.findById(req.params.id, function(err, response) {
		if(err){
			return apiResponse.sendError(apiErrors.APPLICATION.INTERNAL_ERROR, null, 500, req, res);
		}
		apiResponse.sendResponse(response, 200, req, res);
	});
};


var getAllDataTenant = function(req, res) {
	AllData.find({"tenant._id": mongoose.Types.ObjectId(req.headers.tenantid)}, function(err, response) {
		if(err){
			return apiResponse.sendError(apiErrors.APPLICATION.INTERNAL_ERROR, null, 500, req, res);
		}
		apiResponse.sendResponse(response, 200, req, res);
	});
};


/*= End of Public methods =*/
/*=============================================<<<<<*/

/*=============================================>>>>>
= Private methods =
===============================================>>>>>*/



/*= End of Private methods =*/
/*=============================================<<<<<*/

router.get('/alldata', getAllData);
router.get('/alldata/:id', getDataDetails);

router.get('/alldatatenant', getAllDataTenant);

module.exports = router;
