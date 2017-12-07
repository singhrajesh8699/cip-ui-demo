'use strict';

var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
	Source = mongoose.models.Source,
  Dataset = mongoose.models.Dataset,
	Tenant = mongoose.models.Tenant,
	Project = mongoose.models.Project,
	HiveRecord = mongoose.models.HiveRecord,
	CipData = mongoose.models.CipData,
	SourceIntersection = mongoose.models.SourceIntersection,
  bcrypt = require("bcryptjs"),
	crypto = require('crypto'),
  _ = require("lodash"),
  multer = require("multer"),
  fs = require('fs'),
	path = require('path'),
	async = require('async'),
  apiResponse = require('../utils/apiResponse'),
  apiErrors = require('../utils/apiErrors'),
  config = require('../config/config'),
	auth = require('../utils/apiAuth'),
	xyloLog = require('../utils/xyloLog'),
	csv = require('csvtojson');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
  	cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
  	// cb(null, file.fieldname + '-' + Date.now())
  	cb(null, file.originalname);
  }
});

var upload = multer({ storage: storage });

/*=============================================>>>>>
= Public methods =
===============================================>>>>>*/

var getDatasets = function(req, res){
  Dataset.find({}).sort({createdAt: -1}).select({records: 0}).then(function(result) {
    apiResponse.sendResponse(result, 200, req, res);
  },
  function(err) {
    apiResponse.sendError(apiErrors.APPLICATION.INTERNAL_ERROR, null, 500, req, res);
  }).catch(function(exp){
    apiResponse.sendError(apiErrors.APPLICATION.INTERNAL_ERROR, null, 500, req, res);
  });
};

var getDatasetsTenant = function(req, res){
	req.tenantID = req.headers.tenantid;
  Dataset.find({"tenant._id": mongoose.Types.ObjectId(req.tenantID)}).sort({createdAt: -1}).select({records: 0}).then(function(result) {
    apiResponse.sendResponse(result, 200, req, res);
  },
  function(err) {
    apiResponse.sendError(apiErrors.APPLICATION.INTERNAL_ERROR, null, 500, req, res);
  }).catch(function(exp){
    apiResponse.sendError(apiErrors.APPLICATION.INTERNAL_ERROR, null, 500, req, res);
  });
};

var getDatasetsWithType = function(req, res) {
	Dataset.find({status: req.params.type}).sort({createdAt: -1}).select({records: 0}).then(function(result) {
    apiResponse.sendResponse(result, 200, req, res);
  },
  function(err) {
    apiResponse.sendError(apiErrors.APPLICATION.INTERNAL_ERROR, null, 500, req, res);
  }).catch(function(exp){
    apiResponse.sendError(apiErrors.APPLICATION.INTERNAL_ERROR, null, 500, req, res);
  });
};

var getDatasetsWithTypeTenant = function(req, res) {
	Dataset.find({status: req.params.type, "tenant._id": mongoose.Types.ObjectId(req.headers.tenantid)}).sort({createdAt: -1}).select({records: 0}).then(function(result) {
    apiResponse.sendResponse(result, 200, req, res);
  },
  function(err) {
    apiResponse.sendError(apiErrors.APPLICATION.INTERNAL_ERROR, null, 500, req, res);
  }).catch(function(exp){
    apiResponse.sendError(apiErrors.APPLICATION.INTERNAL_ERROR, null, 500, req, res);
  });
};

var getDataset = function(req, res){
  Dataset.findById(req.params.id).exec().then(function(result){
    if(null == result){
      return apiResponse.sendError(apiErrors.APPLICATION.NO_RESOURCE_FOUND, null, 404, req, res);
    }
    apiResponse.sendResponse(result, 200, req, res);
  },
  function(err){
    apiResponse.sendError(apiErrors.APPLICATION.INTERNAL_ERROR, null, 500, req, res);
  }).catch(function(exp){
    apiResponse.sendError(apiErrors.APPLICATION.INTERNAL_ERROR, null, 500, req, res);
  });
};

var updateDataset = function(req, res){
	Dataset.findById(req.params.id).exec().then(function(result){
    if(null == result){
      return apiResponse.sendError(apiErrors.APPLICATION.NO_RESOURCE_FOUND, null, 404, req, res);
    }
		if(typeof req.body === 'undefined'){
			return apiResponse.sendError(apiErrors.APPLICATION.INVALID_PAYLOAD, null, 400, req, res);
		}

		if(typeof req.body.name !== 'undefined'){
			result.name = req.body.name;
		}

		if(typeof req.body.description !== 'undefined'){
			result.description = req.body.description;
		}

		if(typeof req.body.status !== 'undefined'){
			result.status = req.body.status;
		}

		if(typeof req.body.attributes !== 'undefined'){
			result.attributes = req.body.attributes;
		}

		if(typeof req.body.records !== 'undefined'){
			result.records = req.body.records;
		}

  	result.save(function(err, updatedRecord){
			if(null == updatedRecord || err){
				updateProjectDatasets(updatedRecord);
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

var publishDataset = function(req, res) {
	Dataset.update({_id: mongoose.Types.ObjectId(req.params.id)},
									{$set: {status: 'published'}},
									{new: true},
									function(err, updatedDoc){
										if(null == updatedDoc || err){
												return apiResponse.sendError(apiErrors.APPLICATION.INTERNAL_ERROR, null, 500, req, res);
										}
										apiResponse.sendResponse(updatedDoc, 200, req, res);
									});
};

var unpublishDataset = function(req, res) {
	Dataset.update({_id: mongoose.Types.ObjectId(req.params.id)},
									{$set: {status: 'draft'}},
									{new: true},
									function(err, updatedDoc){
										if(null == updatedDoc || err){
												return apiResponse.sendError(apiErrors.APPLICATION.INTERNAL_ERROR, null, 500, req, res);
										}
										apiResponse.sendResponse(updatedDoc, 200, req, res);
									});
}

var addDataset = function(req, res) {

	Tenant.findById(req.headers.tenantid, function(tenantErr, tenant){
		if(null == tenant || tenantErr){
			return apiResponse.sendError(apiErrors.APPLICATION.INTERNAL_ERROR, null, 500, req, res);
		}

		var datasetEntry = new Dataset();
		datasetEntry.name = req.body.name;
		datasetEntry.tenantID = req.headers.tenantid;
		datasetEntry.description = req.body.description;
		datasetEntry.status = "new";
		datasetEntry.attributes = req.body.attributes;
		datasetEntry.tenant = tenant;
	  datasetEntry.lastModifiedOn =  datasetEntry.createdOn = Date.now();

		datasetEntry.save(function(err, doc){

			if(null == doc || err){
				return apiResponse.sendError(apiErrors.APPLICATION.INTERNAL_ERROR, null, 500, req, res);
			}
			xyloLog.datasetCreated(doc.name, req.user_id);
			apiResponse.sendResponse(doc, 200, req, res);
			fetchHiveDBRecords(doc._id, doc.attributes);
		});
	});


};

var onFileUpload = function(req, res){
	if(req.file){
		fs.readFile(req.file.path, 'utf8', function (err, data) {
			if (err){
				apiResponse.sendError(apiErrors.APPLICATION.INTERNAL_ERROR, null, 500, req, res);
			}
			else{
				try{
					var data = JSON.parse(data);

					Dataset.collection.insert(data, function(err, docs){
						if(err){
							apiResponse.sendError(apiErrors.APPLICATION.INTERNAL_ERROR, null, 500, req, res);
						}
						else{
							apiResponse.sendResponse(null, 200, req, res);
						}
					});
				}
				catch(exp){
					apiResponse.sendError(apiErrors.APPLICATION.PARSE_ERROR, null, 500, req, res);
				};
			}
			fs.unlink(req.file.path);
		});
	}
	else{
		apiResponse.sendError(apiErrors.APPLICATION.INTERNAL_ERROR, null, 500, req, res);
	}
};

var onDatasetFileUpload = function(req, res){
	if(req.file){
		var extension = getFileExtension(req.file.path);
		if(extension === 'csv' || extension === "CSV") {
			var data = [];
			csv()
			.fromFile(req.file.path)
			.on('json',(jsonObj)=>{
			  data.push(jsonObj);
			})
			.on('done',(error)=>{
				Dataset.findById(req.params.id, function(err, dataset){
					if(err || dataset === null || typeof dataset === 'undefined'){
						apiResponse.sendError(apiErrors.APPLICATION.INTERNAL_ERROR, null, 500, req, res);
					}
					else{
						const sourceName = path.basename(req.file.path);
						insertNewSource(sourceName, data, dataset, function(err, newSource) {
							if(!err) {
								upsertUploadedData(newSource, dataset, data, req, res);
							}
							else{
								return apiResponse.sendError(apiErrors.APPLICATION.INTERNAL_ERROR, null, 500, req, res);
							}
						});
					}
				});
			});
		}
		else {
			fs.readFile(req.file.path, 'utf8', function (err, data) {
				if (err){
					apiResponse.sendError(apiErrors.APPLICATION.INTERNAL_ERROR, null, 500, req, res);
				}
				else{
					try{
						var data = JSON.parse(data);

						Dataset.findById(req.params.id, function(err, dataset){
							if(err || dataset === null || typeof dataset === 'undefined'){
								apiResponse.sendError(apiErrors.APPLICATION.INTERNAL_ERROR, null, 500, req, res);
							}
							else{
								const sourceName = path.basename(req.file.path);
								insertNewSource(sourceName, data, dataset, function(err, newSource) {
									if(!err) {
										upsertUploadedData(newSource, dataset, data, req, res);
									}
									else{
										return apiResponse.sendError(apiErrors.APPLICATION.INTERNAL_ERROR, null, 500, req, res);
									}
								});

							}
						});

					}
					catch(exp){
						apiResponse.sendError(apiErrors.APPLICATION.PARSE_ERROR, null, 500, req, res);
					};
				}
				fs.unlink(req.file.path);
			});
		}
	}
	else{
		apiResponse.sendError(apiErrors.APPLICATION.INTERNAL_ERROR, null, 500, req, res);
	}
};

var deleteDataset = function(req, res) {
  Dataset.remove({_id: mongoose.Types.ObjectId(req.params.id)}, function(err, updated){
  if(err){
    apiResponse.sendError(apiErrors.APPLICATION.INTERNAL_ERROR, null, 500, req, res);
  }
  else{
    apiResponse.sendResponse(null, 200, req, res);
  }
  });
};

var splitColumn = function(req, res) {
	var attributeName = req.params.column;
	var attributeName1 = req.params.column + ' 1';
	var attributeName2 = req.params.column + ' 2';
	var delimiter = req.params.delimiter;
	Dataset.findById(req.params.id, function(err, dataset) {
		if(err || !dataset){
				return apiResponse.sendError(apiErrors.APPLICATION.INTERNAL_ERROR, null, 500, req, res);
			}
			else{

				async.each(dataset.records, function(record, callback) {
					var value = record[attributeName];
					var splitValues = value.split(delimiter);
					record[attributeName1] = splitValues[0];
					if(splitValues.length > 1 && typeof splitValues[1] !== undefined) {
						record[attributeName2] = splitValues[1];
					}
					delete record[attributeName];
					callback();
				}, function(err) {
					if(err) {
						return apiResponse.sendError(apiErrors.APPLICATION.INTERNAL_ERROR, null, 500, req, res);
					}
					else{
						//Find and delete attribute
						var counter = 0;
						for(; counter < dataset.attributes.length; ++counter) {
							if(dataset.attributes[counter].name === req.params.column) {
								break;
							}
						}
						dataset.attributes.splice(counter, 1, {name: attributeName1}, {name: attributeName2});



						const newRecords = dataset.records;
						const newAttribs = dataset.attributes;
						console.log('updated attribs ' + newRecords);
						console.log('updated attribs ' + newAttribs);
						Dataset.findOneAndUpdate({_id: req.params.id},
							 												{$set: {
																				attributes: newAttribs,
																				records: newRecords
																			}},
																			{new: true},
																			function(err, newDataset) {
																				if(err) {
																					return apiResponse.sendError(apiErrors.APPLICATION.INTERNAL_ERROR, null, 500, req, res);
																				}
																				else {
																					xyloLog.attributeSplit(req.params.column, newDataset.name, req.user_id);
																					return apiResponse.sendResponse(newDataset, 200, req, res);
																				}
																		});
					}
				});
			}
	});
};

var trimColumnWhiteSpaces = function(req, res) {
	var attributeName = req.params.column;

	Dataset.findById(req.params.id, function(err, dataset) {
		if(err || !dataset){
				return apiResponse.sendError(apiErrors.APPLICATION.INTERNAL_ERROR, null, 500, req, res);
			}
			else{

				async.each(dataset.records, function(record, callback) {
					record[attributeName] = record[attributeName].trim();
					callback();
				}, function(err) {
					if(err) {
						return apiResponse.sendError(apiErrors.APPLICATION.INTERNAL_ERROR, null, 500, req, res);
					}
					else{

						const newRecords = dataset.records;
						Dataset.findOneAndUpdate({_id: req.params.id},
																			{$set: {
																				records: newRecords
																			}},
																			{new: true},
																			function(err, newDataset) {
																				if(err) {
																					return apiResponse.sendError(apiErrors.APPLICATION.INTERNAL_ERROR, null, 500, req, res);
																				}
																				else {
																					xyloLog.whiteSpaceTrimmed(attributeName, newDataset.name, req.user_id);
																					return apiResponse.sendResponse(newDataset, 200, req, res);
																				}
																		});
					}
				});
			}
	});
};

/**
 * Merge given columns in datast into single column (attribute) for records
 */
var mergeColumns = function(req, res) {
	console.log('attributes to merge');
	console.log(req.body.columns);
	var attributes = req.body.columns;
	if(typeof attributes === 'undefined' || attributes.length == 0) {
		return apiResponse.sendError(apiErrors.APPLICATION.INVALID_PAYLOAD, null, 422, req, res);
	}

	Dataset.findById(req.params.id, function(err, dataset) {
		if(err || !dataset){
				return apiResponse.sendError(apiErrors.APPLICATION.INTERNAL_ERROR, null, 500, req, res);
		}
		else{

			const attributesLength = attributes.length;

			// Generate new Column name for merged values
			let newColumnName = req.body.name;

			// Update attributes array
			updateMergedAttributes(dataset, attributes, newColumnName);

			// Merge values of each record and store in new field
			mergeAndUpdateRecordColumns(dataset, attributes, newColumnName, req, res);


		}
	});
}

/*= End of Public methods =*/
/*=============================================<<<<<*/

/*=============================================>>>>>
= Private methods =
===============================================>>>>>*/

var insertNewSource = function(sourceName, data, dataset, sourceInsertedCallback) {
	var newSource = new Source();
	newSource.name = sourceName;
	newSource.numRecords = data.length;
	newSource.tenant = dataset.tenant;

	insertRecordsAndCalculateMeta(sourceName, data, function(meta) {

		newSource.completeness = meta.completeness;
		newSource.uniqueness = meta.uniqueness;
		newSource.cardinality = meta.cardinality;

		// Type of the source file
		const partsArray = sourceName.split('.');
		const extension = partsArray[partsArray.length - 1];
		newSource.type = extension.toUpperCase();

		const attributes = [];
		const object = data[0];
		for (var property in object) {
			if (object.hasOwnProperty(property)) {
				attributes.push({
													name: property,
													"metrics": [
															{
																	"name": "numRecords",
																	"value": 4348
															},
															{
																	"name": "completeness",
																	"value": 4235
															},
															{
																	"name": "uniqueness",
																	"value": 7567
															},
															{
																	"name": "cardinality",
																	"value": 5344
															}
													]
												});
			}
		}

		newSource.attributes = attributes;
		newSource.save(function(err, savedSource) {
			sourceInsertedCallback(err, savedSource);
		});

	});
};


// Insert records for new source into collection and generate records/ values related meta
var insertRecordsAndCalculateMeta = function(sourceName, data, metaCallback) {
	let hashList = [];

	let meta = { uniqueness: 0,
							 cardinality: 0,
							 duplicates: 0,
							 completeness: 0
							};

	var nullValues = 0;
	var nonDuplicate = 0;

	const sortedPropList = buildSortedPropList(data[0]);

	const expectedValuesCount = data.length * sortedPropList.length;

	var dunsList = [];

	async.each(data, function(record, callback) {
		dunsList.push(record['DUNS Number']);
		sortedPropList.forEach(function(property) {
			if(typeof record[property] === 'undefined' || 'null' === record[property]
					|| record[property] === '') {

				nullValues += 1;
			}
		});

		const recordHash = getHash(record, sortedPropList);
		if(hashList.indexOf(recordHash) === -1) {
			hashList.push(recordHash);
			nonDuplicate += 1;
		}

		// let dbRecord = new CipData(record);
		// dbRecord.sourceName = sourceName;
		let dbRecord = new HiveRecord(record);
		dbRecord.save(function(err, savedCipData) {
			console.log('saving data record ' );
			console.log(err);
			console.log('saved');
			console.log(savedCipData);
			console.log('==============================');
			callback();
		});
	},
	function(err) {
		meta.cardinality = expectedValuesCount - nullValues;
		meta.duplicates = data.length - meta.uniqueness;
		meta.completeness = 100 - ((nullValues / expectedValuesCount) * 100);
		meta.uniqueness = (nonDuplicate / data.length) * 100;
		metaCallback(meta);
		generateIntersection(sourceName, dunsList);
	});
};


var upsertUploadedData = function(source, dataset, data, req, res){

	for(var dataCounter = 0; dataCounter < data.length; ++dataCounter){
  	updateOrInsertProperties(source, dataset, data[dataCounter])
	}

	Dataset.findOneAndUpdate({'_id': mongoose.Types.ObjectId(req.params.id)},
														{$set:{records: dataset.records, attributes: dataset.attributes}},
														{new: true},
														function(err, updatedDataset){
															if(err){
																	apiResponse.sendError(apiErrors.APPLICATION.INTERNAL_ERROR, null, 500, req, res);
																}
																else{
																	updateProjectDatasets(updateDataset);
																	xyloLog.datasetAppended(source.name, dataset.name, req.user_id);
																	apiResponse.sendResponse(updatedDataset, 200, req, res);
																}
														});
};

var updateOrInsertProperties = function(source, dataset, data){

	var matchFound = false;
	for(var recordCounter = 0; recordCounter < dataset.records.length; ++recordCounter){
		if(dataset.records[recordCounter]['Company Name'] === data['Company Name']
				&& dataset.records[recordCounter]['DUNS Number'] === data['DUNS Number']){
			matchFound = true;
			for (var property in data) {
				if (data.hasOwnProperty(property)
						&& data[property]) {
					upsertAttribute(source, dataset, property);

		    	dataset.records[recordCounter][property] = data[property];
				}
	  }
			break;
		}
	}
	if(!matchFound){
		dataset.records.push(data);
	}
};

var upsertAttribute = function(source, dataset, attribute){
	var found = false;
	for(var attribCounter = 0; attribCounter < dataset.attributes.length; ++attribCounter){
		if(dataset.attributes[attribCounter].name === attribute){
			found = true;
			dataset.attributes[attribCounter].sourceName = source.name;
			dataset.attributes[attribCounter].sourceID = source._id;
			break;
		}
	}
	if(!found){
		var newAttribute = {name: attribute};
		newAttribute.sourceName = source.name;
		newAttribute.sourceID = source._id;
		dataset.attributes.push(newAttribute);
	}
};


var fetchHiveDBRecords = function(datasetId, attributes){
	var selection = {_id: 0};


	attributes.forEach(function(item){
		selection[item.name] = 1;
	});

	HiveRecord.find({})
						.select(selection)
						.exec(function(err, docs){
							Dataset.update({_id: mongoose.Types.ObjectId(datasetId)},
															{$set: {records: docs, status: 'draft'}},
															function(err, updates){
																if(!err){
																	console.log('Updated dataset records with id ' + datasetId + ' successfully!');
																}
																else{
																	console.log('Failed to updated dataset records with id ' + datasetId + ' for error ');
																	console.log(err);
																}
															});
						});
};

var updateProjectDatasets = function(newDataset) {
	Project.update({"datasets._id": mongoose.Types.ObjectId(newDataset._id)},
									{$set: {
										name: newDataset.name,
										description: newDataset.description,
										status: newDataset.status,
										attributes: newDataset.attributes,
										createdAt: newDataset.createdAt,
										updatedAt: newDataset.updatedAt
									}});
};

var mergeAndUpdateRecordColumns = function(dataset, attribList, newColumnName, req, res) {
	const attributesLength = attribList.length;

	// Merge values of each record and store in new field
	async.each(dataset.records, function(record, callback) {

		var mergedCell = "";
		for(var attribCounter = 0; attribCounter < attributesLength; ++attribCounter) {
			const currentAttribute = attribList[attribCounter];
			if(typeof record[currentAttribute] !== 'undefined') {
				mergedCell += (attribCounter < (attributesLength - 1)) ?
														record[currentAttribute] + ', ' :
														record[currentAttribute];

				// Delete current field that is merged
				delete record[currentAttribute];
			}
		}


		record[newColumnName] = mergedCell;

		callback();
	}, function(err) {
		if(!err) {
			const newAttributes = dataset.attributes;
			const newRecords = dataset.records;
			// Update attributes and records in DB
			Dataset.findOneAndUpdate({_id: mongoose.Types.ObjectId(dataset._id)},
																{$set: {
																	attributes: newAttributes,
																	records: newRecords
																}},
																{new: true},
																function(err, newDataset) {
																	if(err) {
																		return apiResponse.sendError(apiErrors.APPLICATION.INTERNAL_ERROR, null, 500, req, res);
																	}
																	else {
																		console.log('user id in merge ' + req.user_id);
																		xyloLog.mergedColumns(attribList, dataset.name, req.user_id);
																		return apiResponse.sendResponse(newDataset, 200, req, res);
																	}
															});
		}
	});
};

var updateMergedAttributes = function(dataset, attribList, newName){
	var indicesToDelete = [];

	attribList.forEach(function(attribute) {
		console.log('\nchecking ' + attribute);
		for(var attribCounter = 0; attribCounter < dataset.attributes.length; ++attribCounter) {
			if(attribute === dataset.attributes[attribCounter].name) {
					console.log('found at index ' + attribCounter);
					dataset.attributes.splice(attribCounter, 1);
					break;
			}
		}
		console.log('after delete ');
		console.log(dataset.attributes);
	});


	dataset.attributes.push({name: newName});
};

function generateIntersection(sourceName, dunsList) {
	var intersectionRecord = new SourceIntersection();
	intersectionRecord.sources = [sourceName];
	intersectionRecord.result = dunsList;
	intersectionRecord.count = dunsList.length;

	intersectionRecord.save(function(err, doc) {
		console.log("Saved new source intersection");
	});

	SourceIntersection.find({}, function(err, intersections) {
		intersections.forEach(function(intersection) {
			var distincts = [dunsList, intersection.result];
			var result = distincts.shift().filter(function(v) {
			    return distincts.every(function(a) {
			        return a.indexOf(v) !== -1;
			    });
			});

			var combo = intersection.sources;
			combo.push(sourceName);

			const intersectionSize = result.length;
			var newRecord = new SourceIntersection({ sources : combo,
																  result: result,
																 	count: intersectionSize});

			newRecord.save(function(err, doc) {
				console.log("inserted intersection record ");
				console.log(doc);
			});
		});
	});
}


var buildSortedPropList = function(record) {
	var propList = [];
	for (var property in record) {
		if (record.hasOwnProperty(property)) {
			propList.push(property);
		}
	}

	propList.sort();
	return propList;
};



var getHash = function(data, sortedProps) {
	var concatinatedValues = "";
	sortedProps.forEach(function(property) {
		concatinatedValues += data[property];
	});

	var md5 = crypto.createHash('md5');

	return md5.update(concatinatedValues).digest('hex');
}

var getFileExtension = function(filePath) {
	var pathArray = filePath.split('.');
	return pathArray[pathArray.length - 1];
};

/*= End of Private methods =*/
/*=============================================<<<<<*/

router.get('/datasets', getDatasets);
router.get('/datasetstenant', getDatasetsTenant);
router.get('/datasets/type/:type', getDatasetsWithType);
router.get('/datasetstenant/type/:type', getDatasetsWithTypeTenant);
router.get('/datasets/:id', getDataset);

router.put('/datasets/:id', updateDataset);
router.put('/datasets/publish/:id', publishDataset);
router.put('/datasets/unpublish/:id', unpublishDataset);
router.put('/datasets/split/:id/:column/:delimiter', auth.authorizationCheck, splitColumn);
router.put('/datasets/trim/:id/:column', auth.authorizationCheck, trimColumnWhiteSpaces);
router.put('/datasets/merge/:id', auth.authorizationCheck, mergeColumns);

router.post('/datasets', auth.authorizationCheck, addDataset);
router.post('/datasets/upload', auth.authorizationCheck, upload.single('file'), onFileUpload);
router.post('/datasets/upload/:id', auth.authorizationCheck, upload.single('file'), onDatasetFileUpload);

router.delete('/datasets/:id', deleteDataset);

module.exports = router;
