'use strict';

var express = require('express'),
  router = express.Router(),
	path = require('path'),
	mongoose = require('mongoose'),
	Tenant = mongoose.models.Tenant,
	User = mongoose.models.User,
  _ = require("lodash"),
	async = require('async'),
	multer = require("multer"),
  apiResponse = require('../utils/apiResponse'),
  apiErrors = require('../utils/apiErrors'),
  config = require('../config/config');

	var storage = multer.diskStorage({
	  destination: function (req, file, cb) {
	  	cb(null, 'uploads/')
	  },
	  filename: function (req, file, cb) {
			const partsArray = file.originalname.split('.');
			const extension = partsArray[partsArray.length - 1];
	  	cb(null, file.fieldname + '-' + Date.now() + '.' + extension);
	  }
	});

	var upload = multer({ storage: storage });

/*=============================================>>>>>
= Public methods =
===============================================>>>>>*/

var getTenant = function(req, res) {
	Tenant.find({}, function(err, response) {
		if(err){
			return apiResponse.sendError(apiErrors.APPLICATION.INTERNAL_ERROR, null, 500, req, res);
		}
		apiResponse.sendResponse(response, 200, req, res);
	});
};

var getTenantDetails = function(req, res) {
	Tenant.findById(req.params.id, function(err, response) {
		if(err){
			return apiResponse.sendError(apiErrors.APPLICATION.INTERNAL_ERROR, null, 500, req, res);
		}
		apiResponse.sendResponse(response, 200, req, res);
	});
};

var addTenant = function(req, res) {
	var tenant = new Tenant();
	tenant.name = req.body.name;
	tenant.description = req.body.description;
	tenant.logo = path.basename(req.file.path);
	tenant.save(function(err, response) {
		if(err){
			return apiResponse.sendError(apiErrors.APPLICATION.INTERNAL_ERROR, null, 500, req, res);
		}
		apiResponse.sendResponse(response, 200, req, res);
	});
};

var updateTenant = function(req, res) {
	Tenant.findById(req.params.id, function(err, tenant) {
		if(err || !tenant) {
			return apiResponse.sendError(apiErrors.APPLICATION.INTERNAL_ERROR, null, 500, req, res);
		}
		else{
			if(typeof req.body.name !== 'undefined') {
				tenant.name = req.body.name;
			}
			if(typeof req.body.description !== 'undefined') {
				tenant.description = req.body.description;
			}
			tenant.save(function(err, updated) {
				if(err) {
					return apiResponse.sendError(apiErrors.APPLICATION.INTERNAL_ERROR, null, 500, req, res);
				}
				else {
					apiResponse.sendResponse(updated, 200, req, res);

					User.update({'tenant._id': mongoose.Types.ObjectId(updated._id)},
												{$set: {tenant: updated}}, function(err, updated){});
				}
			});
		}
	});
};

var updateLogo = function(req, res) {
	Tenant.findById(req.params.id, function(err, tenant) {
		tenant.logo = path.basename(req.file.path);
		tenant.save(function(err, updated) {
			if(err) {
				return apiResponse.sendError(apiErrors.APPLICATION.INTERNAL_ERROR, null, 500, req, res);
			}
			else {
				apiResponse.sendResponse(updated, 200, req, res);
			}
		});
	});
};

var deleteTenant = function(req, res) {
	Tenant.remove({'_id': mongoose.Types.ObjectId(req.params.id)}, function(err, deleted) {
		if(err) {
			return apiResponse.sendError(apiErrors.APPLICATION.INTERNAL_ERROR, null, 500, req, res);
		}
		else {
			apiResponse.sendResponse(null, 200, req, res);
		}
	});
};


/*= End of Public methods =*/
/*=============================================<<<<<*/

/*=============================================>>>>>
= Private methods =
===============================================>>>>>*/



/*= End of Private methods =*/
/*=============================================<<<<<*/

router.get('/tenants', getTenant);
router.get('/tenants/:id', getTenantDetails);

router.put('/tenants/:id', updateTenant);

router.post('/tenants/logo/:id', upload.single('file'), updateLogo);
router.post('/tenants', upload.single('file'), addTenant);

router.delete('/tenants/:id', deleteTenant);

module.exports = router;
