'use strict';

var express = require('express'),
  router = express.Router(),
	mongoose = require('mongoose'),
	SourceIntersetion = mongoose.models.SourceIntersection,
  _ = require("lodash"),
	async = require('async'),
  apiResponse = require('../utils/apiResponse'),
  apiErrors = require('../utils/apiErrors'),
  config = require('../config/config');


/*=============================================>>>>>
= Public methods =
===============================================>>>>>*/

var getAllIntersections = function(req, res) {
	SourceIntersetion.find({}, 'sources count', function(err, response) {
		if(err){
			return apiResponse.sendError(apiErrors.APPLICATION.INTERNAL_ERROR, null, 500, req, res);
		}
		apiResponse.sendResponse(response, 200, req, res);
	});
};


var getTenantIntersections = function(req, res) {
	const tenantID = req.headers.tenantid;
	SourceIntersetion.find({"tenant._id": mongoose.Types.ObjectId(tenantID)}, 'sources count', function(err, response) {
		if(err){
			return apiResponse.sendError(apiErrors.APPLICATION.INTERNAL_ERROR, null, 500, req, res);
		}
		apiResponse.sendResponse(response, 200, req, res);
	});
};

var getSourceIntersectionDetails = function(req, res) {
	SourceIntersetion.findById(req.params.id, function(err, response) {
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

router.get('/sourceintersection', getAllIntersections);
router.get('/sourceintersection/tenant', getTenantIntersections);
router.get('/sourceintersection/:id', getSourceIntersectionDetails);

module.exports = router;
