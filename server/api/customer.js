'use strict';

var express = require('express'),
  router = express.Router(),
	mongoose = require('mongoose'),
	Customer = mongoose.models.Customer,
  _ = require("lodash"),
	async = require('async'),
  apiResponse = require('../utils/apiResponse'),
  apiErrors = require('../utils/apiErrors'),
  config = require('../config/config');


/*=============================================>>>>>
= Public methods =
===============================================>>>>>*/

var getAllCustomers = function(req, res) {
	Customer.find({}, function(err, response) {
		if(err){
			return apiResponse.sendError(apiErrors.APPLICATION.INTERNAL_ERROR, null, 500, req, res);
		}
		apiResponse.sendResponse(response, 200, req, res);
	});
};

var getAllCustomersTenant = function(req, res) {
	Customer.find({"tenant._id": mongoose.Types.ObjectId(req.headers.tenantid)}, function(err, response) {
		if(err){
			return apiResponse.sendError(apiErrors.APPLICATION.INTERNAL_ERROR, null, 500, req, res);
		}
		apiResponse.sendResponse(response, 200, req, res);
	});
};

var getCustomerDetails = function(req, res) {
	Customer.findById(req.params.id, function(err, response) {
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

router.get('/customers', getAllCustomers);
router.get('/customersTenant', getAllCustomersTenant);
router.get('/customers/:id', getCustomerDetails);

module.exports = router;
