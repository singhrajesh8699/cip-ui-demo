'use strict';

var express = require('express'),
  router = express.Router(),
	mongoose = require('mongoose'),
	XyloLog = mongoose.models.XyloLog,
  _ = require("lodash"),
	async = require('async'),
  apiResponse = require('../utils/apiResponse'),
  apiErrors = require('../utils/apiErrors'),
  config = require('../config/config');


/*=============================================>>>>>
= Public methods =
===============================================>>>>>*/

var getAllData = function(req, res) {
	var count = 10;
	if(req.query.count) {
		count = req.query.count;
	}

	XyloLog.find().sort({'createdAt': -1}).limit(10).exec(function(err, response) {
		if(err){
			console.log(err);
			return apiResponse.sendError(apiErrors.APPLICATION.INTERNAL_ERROR, null, 500, req, res);
		}
		apiResponse.sendResponse(response, 200, req, res);
	});
};

var getDataDetails = function(req, res) {
	XyloLog.findById(req.params.id, function(err, response) {
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

router.get('/xylologs', getAllData);
router.get('/xylologs/:id', getDataDetails);

module.exports = router;
