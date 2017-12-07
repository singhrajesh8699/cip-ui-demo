'use strict';

var express = require('express'),
  router = express.Router(),
  fs = require('fs'),
  mongoose = require('mongoose'),
  Segment = mongoose.models.Segment,
  apiResponse = require('../utils/apiResponse'),
  apiErrors = require('../utils/apiErrors');

/*=============================================>>>>>
= Public methods =
===============================================>>>>>*/

var getSegmentsTenant = function(req, res){
  req.tenantID = req.headers.tenantid;
  Segment.find().exec().then(function(result){
    console.log(result);
    apiResponse.sendPaginatedResponse(result, null, null, null, result.length, 200, req, res);
  },
  function(err){
      apiResponse.sendError(apiErrors.APPLICATION.INTERNAL_ERROR, null, 500, req, res);
  }).catch(function(exp){
      apiResponse.sendError(apiErrors.APPLICATION.INTERNAL_ERROR, null, 500, req, res);
  });
};

/*= End of Public methods =*/
/*=============================================<<<<<*/

router.get('/segmentsTenant', getSegmentsTenant);

module.exports = router;
