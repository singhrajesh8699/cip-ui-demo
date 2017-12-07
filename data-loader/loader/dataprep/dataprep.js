import async from 'async';

import * as Projects from './projects.js';
import * as Datasets from './datasets.js';
import * as Reports from './reports.js';
import * as Categories from './categories.js';
import * as Sources from './sources.js';
import * as CRM from './crm.js';
import * as Infra from './infrastructure.js';
import * as Billing from './billing.js';


async function load(db, tenantObj)
{
  var attributeList = [];
  var datasetList = [];

  // Dummy hive data
  // load billing
  try {
    var billing = await Billing.get(tenantObj.name);
    for (var i = 0; i < billing.length; i++) {
      if (billing[i]._id) { delete billing[i]._id; }
			billing[i].tenant = tenantObj;
      await db.hiverecords.insert(billing[i]);
    }
    console.log('Loaded HiveRecords - billing\n');
  }
  catch (e) {
    console.log(e);
  }

	// load crm
  try {
    var crm = await CRM.get(tenantObj.name);
    for (var i = 0; i < crm.length; i++) {
      if (crm[i]._id) { delete crm[i]._id; }
			crm[i].tenant = tenantObj;
      await db.hiverecords.insert(crm[i]);
    }
    console.log('Loaded HiveRecords - crm\n');
  }
  catch (e) {
    console.log(e);
  }

	// load infra
  try {
    var infra = await Infra.get(tenantObj.name);
    for (var i = 0; i < infra.length; i++) {
      if (infra[i]._id) { delete infra[i]._id; }
			infra[i].tenant = tenantObj;
      await db.hiverecords.insert(infra[i]);
    }
    console.log('Loaded HiveRecords - infra\n');
  }
  catch (e) {
    console.log(e);
  }

	// Generating intersections
	console.log("Generating intersections");
	generateIntersection(db, tenantObj);
	console.log("Generated intersections");

	console.log("Tenant obj");
	console.log(tenantObj);

  // load sources
  try {
    var sources = await Sources.get(tenantObj.name);
    for (var i = 0; i < sources.length; i++) {
      var source = sources[i];
      source.tenant = tenantObj;
      if (sources[i]._id) { delete sources[i]._id; }
      await db.sources.insert(sources[i]).then(function(doc){
      doc.attributes.forEach(function(item){
       var datasetAttr = {};
       datasetAttr.sourceID = doc._id;
       datasetAttr.sourceName = doc.name;
       datasetAttr.name = item.name;
       datasetAttr.tenant = tenantObj;
       attributeList.push(datasetAttr);
      });
    });
    }
    console.log('Loaded Sources\n');
  }
  catch (e) {
    console.log(e);
  }

  // load reports
  try {
    var reports = await Reports.get(tenantObj.name);
    for (var i = 0; i < reports.length; i++) {
      if (reports[i]._id) { delete reports[i]._id; }
      var report = reports[i];
      report.tenant = tenantObj;
      await db.reports.insert(report);
    }
    console.log('Loaded Reports\n');
  }
  catch (e) {
    console.log(e);
  }

  // load categories
  try {
    var categories = await Categories.get(tenantObj.name);
    for (var i = 0; i < categories.length; i++) {
      if (categories[i]._id) { delete categories[i]._id; }
      var category = categories[i];
      category.tenant = tenantObj;
      await db.categories.insert(category);
    }
    console.log('Loaded Categories\n');
  }
  catch (e) {
    console.log(e);
  }

  // load datasets
  try {
    var datasets = await Datasets.get(tenantObj.name);
    for (var i = 0; i < datasets.length; i++) {
      if (datasets[i]._id) { delete datasets[i]._id; }
      var datasetToInsert = datasets[i];
      datasetToInsert.attributes = buildDatasetAttributes(datasets[i], attributeList);

			var attrProjection = {};
			datasetToInsert.attributes.forEach(function(item, index) {
				attrProjection[item.name] = 1;
			});

			await db.hiverecords.find({}, attrProjection).then(function(records) {
				datasetToInsert.records = records;
			});


	    var currentTime = new Date().toISOString();
	    datasetToInsert.createdAt = currentTime;
	    datasetToInsert.updatedAt = currentTime;
	    datasetToInsert.tenant = tenantObj;
	      await db.datasets.insert(datasetToInsert).then(function(doc){
	      datasetList.push(doc);
	    });
    }
    console.log('Loaded Datasets\n');
  }
  catch (e) {
    console.log(e);
  }

  // load projects
  try {
    var projects = await Projects.get(tenantObj.name);
    for (var i = 0; i < projects.length; i++) {
      if (projects[i]._id) { delete projects[i]._id; }
      var currentProject = projects[i];
      for(var datasetCounter = 0; datasetCounter < datasets.length; ++datasetCounter){
        currentProject.datasets.push(datasets[datasetCounter]);
      }
      var currentTime = new Date().toISOString();
      currentProject.createdAt = currentTime;
      currentProject.updatedAt = currentTime;
      currentProject.tenant = tenantObj;
      await db.projects.insert(currentProject);
    }
    console.log('Loaded Projects\n');
  }
  catch (e) {
    console.log(e);
  }
}

function buildDatasetAttributes(dataset, allAttributes){
    var attrList = dataset.attributes;
    var resultList = [];
		var BreaKException = {};
    attrList.forEach(function(attr){
			try {
        allAttributes.forEach(function(currentAttr){
            if(currentAttr.name === attr.name){
                resultList.push(currentAttr);
								throw new BreaKException();
            }
        });
			} catch(e) {}
    });
    return resultList;
}

function generateIntersection(db, tenantObj) {
	var combos = [["crm.csv"], ["billing.xlsx"], ["infrastructure.json"], ["crm.csv", "billing.xlsx"], ["crm.csv", "infrastructure.json"], ["billing.xlsx", "infrastructure.json"], ["crm.csv", "billing.xlsx", "infrastructure.json"]];
	combos.forEach(function(combo) {
		var distincts = [];
		async.each(combo, function(sourceName, callback) {
			db.hiverecords.distinct("DUNS Number", {source_name: sourceName}).then(function(data) {
				distincts.push(data);
				callback();
			});
		}, function(err) {
			var result = distincts.shift().filter(function(v) {
			    return distincts.every(function(a) {
			        return a.indexOf(v) !== -1;
			    });
			});

			const intersectionSize = result.length;
			var intersectionRecord = { sources : combo,
																  result: result,
																 	count: intersectionSize,
																	tenant: tenantObj};

			db.sourceintersections.insert(intersectionRecord).then(function(doc) {
				//console.log("inserted insertion record ");
				//console.log(doc);
			});
		});
	});
	return;
}


export { load };
