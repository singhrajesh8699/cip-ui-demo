'use strict';

var express = require('express'),
  router = express.Router(),
	mongoose = require('mongoose'),
	CustomerFeedback = mongoose.models.CustomerFeedback,
  _ = require("lodash"),
	async = require('async'),
  apiResponse = require('../utils/apiResponse'),
  apiErrors = require('../utils/apiErrors'),
  config = require('../config/config');


/*=============================================>>>>>
= Public methods =
===============================================>>>>>*/

var getAllFeedbacks = function(req, res) {
	CustomerFeedback.find({}, function(err, response) {
		if(err){
			return apiResponse.sendError(apiErrors.APPLICATION.INTERNAL_ERROR, null, 500, req, res);
		}
		apiResponse.sendResponse(response, 200, req, res);
	});
};

var getFeedback = function(req, res) {
	CustomerFeedback.findById(req.params.id, function(err, response) {
		if(err){
			return apiResponse.sendError(apiErrors.APPLICATION.INTERNAL_ERROR, null, 500, req, res);
		}
		apiResponse.sendResponse(response, 200, req, res);
	});
};

var queryFeedback = function(req, res) {
	CustomerFeedback.findOne({month: parseInt(req.params.month)}, function(err, response) {
		if(err){
			return apiResponse.sendError(apiErrors.APPLICATION.INTERNAL_ERROR, null, 500, req, res);
		}
		apiResponse.sendResponse(response, 200, req, res);
	});
};


var queryFeedback = function(req, res) {
  var month = parseInt('1');
  CustomerFeedback.findOne({month: month}, function(err, response) {
		if(err){
			return apiResponse.sendError(apiErrors.APPLICATION.INTERNAL_ERROR, null, 500, req, res);
		}
		apiResponse.sendResponse(tempRandomizeResponse(response), 200, req, res);
	});
}


var tempRandomizeResponse = function(response) {
    
    response.data.sentiment_contribution.forEach(function(sentiment) {
      var sent_random = (Math.random() * 3) + 1;
      sentiment.sentiment += sent_random;
      sentiment.sentiment = parseInt(sentiment.sentiment.toFixed(1));

      var contrib_random = (Math.random() * 30) + 1;
      sentiment.contribution += contrib_random;
      sentiment.contribution = parseInt(sentiment.contribution.toFixed(1));

    });

    response.data.feedback.forEach(function(feedback) {
      var feedback_random = (Math.random() * 7) + 1;
      feedback.value += feedback_random;
      feedback.value = parseInt(feedback.value.toFixed(1));
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

router.get('/customerfeedback', getAllFeedbacks);
router.get('/customerfeedback/:id', getFeedback);

router.post('/customerfeedback/query', queryFeedback);

module.exports = router;
