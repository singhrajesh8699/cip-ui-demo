'use strict';

var express = require('express'),
  router = express.Router(),
	fs = require('fs'),
  mongoose = require('mongoose'),
  Source = mongoose.models.Source,
	SourceIntersection = mongoose.models.SourceIntersection,
	Dataset = mongoose.models.Dataset,
	Tenant = mongoose.models.Tenant,
	CipData = mongoose.models.CipData,
	HiveRecord = mongoose.models.HiveRecord,
  bcrypt = require("bcryptjs"),
	crypto = require('crypto'),
  _ = require("lodash"),
	path = require("path"),
	async = require('async'),
	multer = require('multer'),
	csv = require('csvtojson'),
  apiResponse = require('../utils/apiResponse'),
  apiErrors = require('../utils/apiErrors'),
  config = require('../config/config'),
	randomGenerator = require('../utils/randomGenerator');


var hdfsFileManager = require('../hdfs/fileOperations');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
  	cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
		// const partsArray = file.originalname.split('.');
		// const extension = partsArray[partsArray.length - 1];
		// cb(null, file.fieldname + '-' + Date.now() + '.' + extension);
		cb(null, file.originalname);
	}
});

var upload = multer({ storage: storage });

/*=============================================>>>>>
= Public methods =
===============================================>>>>>*/

var getSources = function(req, res) {
	Source.find().exec().then(function(result) {
		apiResponse.sendPaginatedResponse(result, null, null, null, result.length, 200, req, res);
	},
	function(err) {
		apiResponse.sendError(apiErrors.APPLICATION.INTERNAL_ERROR, null, 500, req, res);
	}).catch(function(exp) {
		apiResponse.sendError(apiErrors.APPLICATION.INTERNAL_ERROR, null, 500, req, res);
	});
};

var getSourceByName = function(req, res) {
	Source.findOne({"name": req.params.name}).exec().then(function(result) {
		console.log(result);
		apiResponse.sendResponse(result, 200, req, res);
	},
	function(err) {
		apiResponse.sendError(apiErrors.APPLICATION.INTERNAL_ERROR, null, 500, req, res);
	}).catch(function(exp) {
		apiResponse.sendError(apiErrors.APPLICATION.INTERNAL_ERROR, null, 500, req, res);
	});
};

var getSourcesTenant = function(req, res) {
	req.tenantID = req.headers.tenantid;
	console.log('here 1?');
	Source.find({"tenant._id": mongoose.Types.ObjectId(req.tenantID)}).exec().then(function(result) {
		console.log(result);
		apiResponse.sendPaginatedResponse(result, null, null, null, result.length, 200, req, res);
	},
	function(err) {
		apiResponse.sendError(apiErrors.APPLICATION.INTERNAL_ERROR, null, 500, req, res);
	}).catch(function(exp) {
		apiResponse.sendError(apiErrors.APPLICATION.INTERNAL_ERROR, null, 500, req, res);
	});
};

var getSource = function(req, res) {
	Source.findById(req.params.id).exec().then(function(result) {
		if(null == result) {
			return apiResponse.sendError(apiErrors.APPLICATION.NO_RESOURCE_FOUND, null, 404, req, res);
		}
		apiResponse.sendPaginatedResponse(result, null, null, null, result.length, 200, req, res);
	},
	function(err) {
		apiResponse.sendError(apiErrors.APPLICATION.INTERNAL_ERROR, null, 500, req, res);
	}).catch(function(exp) {
		apiResponse.sendError(apiErrors.APPLICATION.INTERNAL_ERROR, null, 500, req, res);
	});
};

var updateSource = function(req, res) {
	var reqBody = req.body;
	Source.findById(req.params.id).exec().then(function(source) {
		if(null == source) {
			return apiResponse.sendError(apiErrors.APPLICATION.NO_RESOURCE_FOUND, null, 404, req, res);
		}

		console.log(reqBody);

		if(typeof reqBody.name !== 'undefined') {
			source.name = reqBody.name;
		}

		if(typeof reqBody.description !== 'undefined') {
			source.description = reqBody.description;
		}

		if(typeof reqBody.type !== 'undefined') {
			source.type = reqBody.type;
		}

		if(typeof reqBody.status !== 'undefined') {
			source.status = reqBody.status;
		}

		if(typeof reqBody.lastSynchedOn !== 'undefined') {
			source.lastSynchedOn = reqBody.lastSynchedOn;
		}

		if(typeof reqBody.numRecords !== 'undefined') {
			source.numRecords = reqBody.numRecords;
		}

		if(typeof reqBody.numUniques !== 'undefined') {
			source.numUniques = reqBody.numUniques;
		}

		if(typeof reqBody.completeness !== 'undefined') {
			source.completeness = reqBody.completeness;
		}

		if(typeof reqBody.uniqueness !== 'undefined') {
			source.uniqueness = reqBody.uniqueness;
		}

		if(typeof reqBody.cardinality !== 'undefined') {
			source.cardinality = reqBody.cardinality;
		}

		if(typeof reqBody.density !== 'undefined') {
			source.density = reqBody.density;
		}

		if(typeof reqBody.apiEndPointConfig !== 'undefined') {
			source.apiEndPointConfig = reqBody.apiEndPointConfig;
		}

		if(typeof reqBody.ftpConfig !== 'undefined') {
			source.ftpConfig = reqBody.ftpConfig;
		}

		if(typeof reqBody.attributes !== 'undefined') {
			source.attributes = reqBody.attributes;
		}

		source.save().then(function(result) {
			if(null == result) {
				return apiResponse.sendError(apiErrors.APPLICATION.INTERNAL_ERROR, null, 500, req, res);
			}
			apiResponse.sendResponse(null, 200, req, res);
		},
		function(err) {
			apiResponse.sendError(apiErrors.APPLICATION.INTERNAL_ERROR, null, 500, req, res);
		}).catch(function(exp) {
			apiResponse.sendError(apiErrors.APPLICATION.INTERNAL_ERROR, null, 500, req, res);
		});
	},
	function(err) {
		apiResponse.sendError(apiErrors.APPLICATION.INTERNAL_ERROR, null, 500, req, res);
	}).catch(function(exp) {
		apiResponse.sendError(apiErrors.APPLICATION.INTERNAL_ERROR, null, 500, req, res);
	});

};

var addSource = function(req, res) {
	var reqBody = req.body;
	var source = new Source();

	source.tenantID = req.headers.tenantid;
	if(typeof reqBody.name !== 'undefined') {
		source.name = reqBody.name;
	}

	if(typeof reqBody.description !== 'undefined') {
		source.description = reqBody.description;
	}

	if(typeof reqBody.type !== 'undefined') {
		source.type = reqBody.type;
	}

	if(typeof reqBody.status !== 'undefined') {
		source.status = reqBody.status;
	}

	if(typeof reqBody.lastSynchedOn !== 'undefined') {
		source.lastSynchedOn = reqBody.lastSynchedOn;
	}

	if(typeof reqBody.numRecords !== 'undefined') {
		source.numRecords = reqBody.numRecords;
	}

	if(typeof reqBody.numUniques !== 'undefined') {
		source.numUniques = reqBody.numUniques;
	}

	if(typeof reqBody.completeness !== 'undefined') {
		source.completeness = reqBody.completeness;
	}

	if(typeof reqBody.uniqueness !== 'undefined') {
		source.uniqueness = reqBody.uniqueness;
	}

	if(typeof reqBody.cardinality !== 'undefined') {
		source.cardinality = reqBody.cardinality;
	}

	if(typeof reqBody.density !== 'undefined') {
		source.density = reqBody.density;
	}

	if(typeof reqBody.apiEndPointConfig !== 'undefined') {
		source.apiEndPointConfig = reqBody.apiEndPointConfig;
	}

	if(typeof reqBody.ftpConfig !== 'undefined') {
		source.ftpConfig = reqBody.ftpConfig;
	}

	if(typeof reqBody.attributes !== 'undefined') {
		source.attributes = reqBody.attributes;
	}

	source.save().then(function(result) {
		if(null == result) {
			return apiResponse.sendError(apiErrors.APPLICATION.INTERNAL_ERROR, null, 500, req, res);
		}
		apiResponse.sendResponse(null, 200, req, res);
	},
	function(err) {
		apiResponse.sendError(apiErrors.APPLICATION.INTERNAL_ERROR, null, 500, req, res);
	}).catch(function(exp) {
		apiResponse.sendError(apiErrors.APPLICATION.INTERNAL_ERROR, null, 500, req, res);
	});
};


var deleteSource = function(req, res) {
	Source.findById(req.params.id, function(err, result) {
		if(null == result) {
			return apiResponse.sendError(apiErrors.APPLICATION.NO_RESOURCE_FOUND, null, 404, req, res);
		}
		var name = result.name;
		result.remove(function(err, data) {
			SourceIntersection.remove({sources: name}, function(err) {
				apiResponse.sendResponse(null, 200, req, res);	
			});

		});

	});
};

var onSourceFileUpload = function(req, res) {
	if(req.file) {
		hdfsFileManager.writeToFile(path.baseName(req.file.path), req.file.path, function(err, response) {
			if(null == response) {
				apiResponse.sendError(apiErrors.HDFS.HDFS_FILE_WRITE_FAILED, null, 500, req, res);
			}
			apiResponse.sendResponse(null, 200, req, res);

			fs.unlink(req.file.path);
		});
	}
	else {
		apiResponse.sendError(apiErrors.APPLICATION.INTERNAL_ERROR, null, 500, req, res);
	}
};


var onLocalSourceFileUpload = function(req, res) {
	if(req.file) {
		var extension = getFileExtension(req.file.path);
		if(extension === 'csv' || extension === "CSV") {
			var data = [];
			csv()
			.fromFile(req.file.path)
			.on('json',(jsonObj)=>{
			  data.push(jsonObj);
			})
			.on('done',(error)=>{
				const sourceName = path.basename(req.file.path);
				insertNewSource(sourceName, data, req.headers.tenantid, function(err, newSource) {
					if(!err) {
						apiResponse.sendResponse(newSource, 200, req, res);
					}
					else{
						return apiResponse.sendError(apiErrors.APPLICATION.INTERNAL_ERROR, null, 500, req, res);
					}
				});
			});
		}
		else if(extension === 'json' || extension === "JSON") {
			fs.readFile(req.file.path, 'utf8', function (err, data) {
				if (err) {
					apiResponse.sendError(apiErrors.APPLICATION.INTERNAL_ERROR, null, 500, req, res);
				}
				else {
					try {
						var data = JSON.parse(data);
						const sourceName = path.basename(req.file.path);
						insertNewSource(sourceName, data, req.headers.tenantid, function(err, newSource) {
							if(!err) {
								apiResponse.sendResponse(newSource, 200, req, res);
							}
							else {
								return apiResponse.sendError(apiErrors.APPLICATION.INTERNAL_ERROR, null, 500, req, res);
							}
						});
					}
					catch(exp) {
						console.log(exp);
						apiResponse.sendError(apiErrors.APPLICATION.PARSE_ERROR, null, 500, req, res);
					}
				}
			});
		}
		else {
			return apiResponse.sendError(apiErrors.SOURCE.SOURCE_FILE_INVALID, null, 400, req, res);
		}
	}
	else {
		apiResponse.sendError(apiErrors.APPLICATION.INTERNAL_ERROR, null, 500, req, res);
	}
};

/*= End of Public methods =*/
/*=============================================<<<<<*/

/*=============================================>>>>>
= Private methods =
===============================================>>>>>*/

// Add new source entry to the Sources collection
var insertNewSource = function(sourceName, data, tenantId, sourceInsertedCallback) {
	var newSource = new Source();
	newSource.name = sourceName;
	newSource.numRecords = data.length;

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
		Tenant.findById(tenantId, function(tenantErr, tenant) {
			if(tenantErr) {
				return sourceInsertedCallback(tenantErr, null);
			}
      newSource.tenant = tenant;
			newSource.save(function(err, savedSource) {
				sourceInsertedCallback(err, savedSource);
			});
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

router.get('/sources', getSources);
router.get('/sourcestenant', getSourcesTenant);

router.get('/sources/:id', getSource);
router.get('/sources/name/:name', getSourceByName);

router.put('/sources/:id', updateSource);

router.post('/sources', addSource);
router.post('/sources/upload', upload.single('file'), onLocalSourceFileUpload);

router.delete('/sources/:id', deleteSource);

module.exports = router;
