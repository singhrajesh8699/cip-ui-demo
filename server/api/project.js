'use strict';

var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  Project = mongoose.models.Project,
	Dataset = mongoose.models.Dataset,
	Tenant = mongoose.models.Tenant,
	async = require('async'),
  bcrypt = require("bcryptjs"),
  apiResponse = require('../utils/apiResponse'),
  apiErrors = require('../utils/apiErrors'),
  config = require('../config/config');

var allProjects = function(req, res){
	Project.find({}, function(err, docs){
		if(null == docs || err){
			return apiResponse.sendError(apiErrors.APPLICATION.INTERNAL_ERROR, null, 500, req, res);
		}
		apiResponse.sendResponse(docs, 200, req, res);
	});
};

var allProjectsTenant = function(req, res){
	Project.find({"tenant._id": mongoose.Types.ObjectId(req.headers.tenantid)}, function(err, docs){
		if(null == docs || err){
			return apiResponse.sendError(apiErrors.APPLICATION.INTERNAL_ERROR, null, 500, req, res);
		}
		apiResponse.sendResponse(docs, 200, req, res);
	});
};

var getProjects = function(req, res){
	Project.findById(req.params.id, function(err, doc){
		if(null == doc || err){
			return apiResponse.sendError(apiErrors.APPLICATION.INTERNAL_ERROR, null, 500, req, res);
		}
		apiResponse.sendResponse(doc, 200, req, res);
	});
};

var addProjects = function(req, res){
	Tenant.findById(req.headers.tenantid, function(tenantErr, tenant){
		if(null == tenant || tenantErr){
			return apiResponse.sendError(apiErrors.APPLICATION.INTERNAL_ERROR, null, 500, req, res);
		}

		var projectEntry = new Project();
		projectEntry.tenantID = req.headers.tenantid;
		projectEntry.name = req.body.name;
		projectEntry.description = req.body.description;
		projectEntry.type = req.body.type;
		projectEntry.tenant = tenant;
		projectEntry.datasets = [];
		if(req.body.datasets) {
			projectEntry.datasets = [];
			async.each(req.body.datasets, function(item, callback) {
				Dataset.findById(item._id, function(err, entry) {
					if(entry) {
						projectEntry.datasets.push(entry);
					}
					callback();
				});
			}, function(err) {
				saveProject(projectEntry, req, res);
			});
		}
		else{
			saveProject(projectEntry, req, res);
		}
	});
};

var updateProject = function(req, res){
	Project.findById(req.params.id).exec().then(function(result){
    if(null == result){
      return apiResponse.sendError(apiErrors.APPLICATION.NO_RESOURCE_FOUND, null, 404, req, res);
    }

		if(typeof req.body === 'undefined'){
			return apiResponse.sendError(apiErrors.APPLICATION.INVALID_PAYLOAD, null, 400, req, res);
		}

		if(typeof req.body.name !== 'undefined'){
			result.name = req.body.name;
		}

		if(typeof req.body.type !== 'undefined'){
			result.type = req.body.type;
		}

		if(typeof req.body.description !== 'undefined'){
			result.description = req.body.description;
		}

		if(typeof req.body.datasets !== 'undefined'){
			result.datasets = req.body.datasets;
		}

	  result.save(function(err, updatedRecord){
			if(null == updatedRecord || err){
					return apiResponse.sendError(apiErrors.APPLICATION.INTERNAL_ERROR, null, 500, req, res);
			}
			apiResponse.sendResponse(updatedRecord, 200, req, res);
		});
  },
  function(err){
    apiResponse.sendError(apiErrors.APPLICATION.INTERNAL_ERROR, null, 500, req, res);
  }).catch(function(exp){
    apiResponse.sendError(apiErrors.APPLICATION.INTERNAL_ERROR, null, 500, req, res);
  });
};


var deleteProject = function(req, res) {
  Project.remove({_id: mongoose.Types.ObjectId(req.params.id)}, function(err, updated){
  if(err){
    apiResponse.sendError(apiErrors.APPLICATION.INTERNAL_ERROR, null, 500, req, res);
  }
  else{
    apiResponse.sendResponse(null, 200, req, res);
  }
  });
};

/*= End of Public methods =*/
/*=============================================<<<<<*/

/*=============================================>>>>>
= Private methods =
===============================================>>>>>*/

var saveProject = function(project, req, res) {
	project.save(function(err, doc){
		if(null == doc || err){
			return apiResponse.sendError(apiErrors.APPLICATION.INTERNAL_ERROR, null, 500, req, res);
		}
		apiResponse.sendResponse(doc, 200, req, res);
	});
}

/*= End of Private methods =*/
/*=============================================<<<<<*/

router.get('/projects', allProjects);
router.get('/projectstenant', allProjectsTenant);
router.get('/projects/:id', getProjects);

router.put('/projects/:id', updateProject);

router.post('/projects', addProjects);

router.delete('/projects/:id', deleteProject);

module.exports = router;
