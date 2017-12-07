import pmongo from 'promised-mongo';
import fs from 'fs';
import pexec from 'promised-exec';
import async from 'async';
// import lineReader from 'readline';

let MONGODB_URI = 'cipui';

const allCustomers = true;

if (process.env.MONGODB_URI) MONGODB_URI = process.env.MONGODB_URI;

// !!!!! VERY IMPORTANT !!!!!
// PLEASE DO NOT FORGET TO ADD THE ENTITIES HERE
// Even when it works locally, it does not work on production
// unless one provides this authMechanism
const db = pmongo(MONGODB_URI, {
  authMechanism: 'ScramSHA1'
}, [
'users',
'datasets',
'sources',
'reports',
'categories',
'projects',
'hiverecords',
'alldatas',
'tenants',
'cipdatas',
'customers',
'segments',
'clusters',
'productcategories',
'keurig-customers-data',
'keurig-metrics-dashboard',
'keurig-metrics-cluster',
'zylolens-pricing',
'products',
'transactions',
'onlinedatas']);


import { customers } from './data/sample/customers';
import { projects } from './data/sample/projects';
import { datasets } from './data/sample/datasets';
import { hiverecords } from './data/sample/hivecustomers';
import { reports } from './data/sample/reports';
import { allData } from './data/sample/alldata';
import { categories } from './data/sample/categories';
import { sources } from './data/sample/sources';
import { tenants } from './data/sample/tenants';
import { products } from './data/sample/products';
import { productcategories } from './data/sample/productCategories';
import { segments } from './data/sample/segments';
import { schemes } from './data/sample/schemes';
import { clusters } from './data/sample/clusters';
import { RFV_SCORES } from './data/sample/rfv_scorecard';

console.log('Setup db.cipui');

async function setup() {

  try {
    await db.users.drop();
    await db.datasets.drop();
    await db.sources.drop();
    await db.reports.drop();
    await db.categories.drop();
    await db.projects.drop();
  	await db.hiverecords.drop();
  	await db.alldatas.drop();
  	await db.tenants.drop();
  	await db.cipdatas.drop();
    await db.schemes.drop();
    await db.clusters.drop();

		if(allCustomers) {
			await db.customers.drop();
		}

		await db.products.drop();
    await db.productcategories.drop();
    await db.segments.drop();

		await db.loyalty.drop();
    await db.onlinedatas.drop();
		await db.transactions.drop();

    await db.zylolenspricings.drop();

		//await db.keurig-customers-data.drop();
    //await db.keurig-metrics-dashboard.drop();
    //await db.keurig-metrics-cluster.drop();

    console.log('Cleared collections\n');
  }
  catch (e) {
    console.log(e);
  }

	// Create tenant
	var tenantObj = [];
	try {
    for (var i = 0; i < tenants.length; i++) {
      await db.tenants.insert(tenants[i]).then(function(doc) {
				tenantObj.push(doc);
			});
    }
    console.log('Loaded Tenants\n');
  }
  catch (e) {
    console.log(e);
  }


	console.log("Creating uploads directory\n");

	if (!fs.existsSync('uploads/')){
	  fs.mkdirSync('uploads/');
	}

	console.log("Copying logo file for tenants\n");

	fs.createReadStream('tmp_uploads/staples.png')
		.pipe(fs.createWriteStream('uploads/staples.png'));
  fs.createReadStream('tmp_uploads/keurig.png')
    .pipe(fs.createWriteStream('uploads/keurig.png'));

  fs.createReadStream('tmp_uploads/rajeev.png')
  	.pipe(fs.createWriteStream('uploads/rajeev.png'));
  fs.createReadStream('tmp_uploads/vinod.png')
    .pipe(fs.createWriteStream('uploads/vinod.png'));

  fs.createReadStream('tmp_uploads/staples_ma.jpg')
    .pipe(fs.createWriteStream('uploads/staples_ma.jpg'));
  fs.createReadStream('tmp_uploads/staples_da.jpg')
    .pipe(fs.createWriteStream('uploads/staples_da.jpg'));

  fs.createReadStream('tmp_uploads/keurig_ma.jpg')
    .pipe(fs.createWriteStream('uploads/keurig_ma.jpg'));
  fs.createReadStream('tmp_uploads/keurig_da.jpg')
    .pipe(fs.createWriteStream('uploads/keurig_da.jpg'));

	fs.createReadStream('tmp_uploads/venn.jpg')
    .pipe(fs.createWriteStream('uploads/venn.jpg'));
	fs.createReadStream('tmp_uploads/bubble1.png')
    .pipe(fs.createWriteStream('uploads/bubble1.png'));
	fs.createReadStream('tmp_uploads/bubble2.png')
    .pipe(fs.createWriteStream('uploads/bubble2.png'));
	fs.createReadStream('tmp_uploads/empty_nesters.jpeg')
		.pipe(fs.createWriteStream('uploads/empty_nesters.jpeg'));
	fs.createReadStream('tmp_uploads/momnbaby.jpeg')
		.pipe(fs.createWriteStream('uploads/momnbaby.jpeg'));
	fs.createReadStream('tmp_uploads/young_singles.jpeg')
		.pipe(fs.createWriteStream('uploads/young_singles.jpeg'));
	fs.createReadStream('tmp_uploads/young_couples.jpeg')
		.pipe(fs.createWriteStream('uploads/young_couples.jpeg'));

  fs.createReadStream('tmp_uploads/rfv_leastval.jpg')
    .pipe(fs.createWriteStream('uploads/rfv_leastval.jpg'));
  fs.createReadStream('tmp_uploads/rfv_mostval.jpg')
    .pipe(fs.createWriteStream('uploads/rfv_mostval.jpg'));

  fs.createReadStream('tmp_uploads/scheme_lifestage_small.jpg')
    .pipe(fs.createWriteStream('uploads/scheme_lifestage_small.jpg'));
   fs.createReadStream('tmp_uploads/scheme_potential_small.jpg')
    .pipe(fs.createWriteStream('uploads/scheme_potential_small.jpg'));
  fs.createReadStream('tmp_uploads/scheme_rfv_small.png')
    .pipe(fs.createWriteStream('uploads/scheme_rfv_small.png'));
  fs.createReadStream('tmp_uploads/scheme_missions_small.png')
    .pipe(fs.createWriteStream('uploads/scheme_missions_small.png'));
  fs.createReadStream('tmp_uploads/scheme_lifestyle_small.jpg')
    .pipe(fs.createWriteStream('uploads/scheme_lifestyle_small.jpg'));
  fs.createReadStream('tmp_uploads/mombaby.jpg')
    .pipe(fs.createWriteStream('uploads/mombaby.jpg'));
  fs.createReadStream('tmp_uploads/enthusiats.jpg')
    .pipe(fs.createWriteStream('uploads/enthusiats.jpg'));
  fs.createReadStream('tmp_uploads/vip.jpg')
    .pipe(fs.createWriteStream('uploads/vip.jpg'));
  fs.createReadStream('tmp_uploads/matures.jpg')
    .pipe(fs.createWriteStream('uploads/matures.jpg'));


  // create a user
	// Insert DB user
	await db.users.insert({ "name" : "admin",
												  "password" : "$2a$10$cRnn/kyGRytacWH27edxpu2lnVb05Un2hUoEDiAURjvfj7n552HYG",
													"salt" : "$2a$10$cRnn/kyGRytacWH27edxpu",
												  "email" : "admin@dataxylo.com",
                          "thumbnail": "rajeev.png",
												  "last_login" : null,
												  "ma_user" : false,
												  "da_user" : false,
												  "dx_user" : false,
												  "sa_user" : true});

	// Insert staples user
	await db.users.insert({ "salt" : "$2a$10$noDr3sgNdjBAsUXEcItrmO",
											    "is_verified" : false,
											    "is_logged_in" : false,
											    "tenant" : tenantObj[0],
											    "name" : "Staples Admin",
                          "thumbnail": "vinod.png",
											    "password" : "$2a$10$noDr3sgNdjBAsUXEcItrmOk38v8KJqPu3A/QZz/2QukFAKGZSkkHa",
											    "email" : "admin@staples.com",
											    "last_login" : null,
											    "ma_user" : false,
											    "da_user" : false,
											    "dx_user" : true,
											    "sa_user" : false
												});
// Insert staples user
await db.users.insert({ "salt" : "$2a$10$noDr3sgNdjBAsUXEcItrmO",
										    "is_verified" : false,
										    "is_logged_in" : false,
										    "tenant" : tenantObj[1],
										    "name" : "Keurig Admin",
                        "thumbnail": "vinod.png",
										    "password" : "$2a$10$noDr3sgNdjBAsUXEcItrmOk38v8KJqPu3A/QZz/2QukFAKGZSkkHa",
										    "email" : "admin@keurig.com",
										    "last_login" : null,
										    "ma_user" : false,
										    "da_user" : false,
										    "dx_user" : true,
										    "sa_user" : false
											});

// Insert Staples DA
await db.users.insert({ "salt" : "$2a$10$F7n2B9p3NJwZTjY23FEu6u",
                        "is_verified" : false,
                        "is_logged_in" : false,
                        "tenant" : tenantObj[0],
                        "name" : "Staples DA",
                        "thumbnail": "staples_da.jpg",
                        "password" : "$2a$10$F7n2B9p3NJwZTjY23FEu6uP1K4pPGMzKEoyqlfRjswPsmm9qCII8.",
                        "email" : "da1@staples.com",
                        "last_login" : null,
                        "ma_user" : false,
                        "da_user" : true,
                        "dx_user" : false,
                        "sa_user" : false
                      });

// Insert Keurig MA
await db.users.insert({ "salt" : "$2a$10$WCiTzTwrrmCW0rLYS1jFX.",
                      "is_verified" : false,
                      "is_logged_in" : false,
                      "tenant" : tenantObj[1],
                      "name" : "Keurig MA",
                      "thumbnail": "keurig_ma.jpg",
                      "password" : "$2a$10$WCiTzTwrrmCW0rLYS1jFX..nwYE6e//MCOgFVn459bsysidJT7rca",
                      "email" : "ma1@keurig.com",
                      "last_login" : null,
                      "ma_user" : true,
                      "da_user" : false,
                      "dx_user" : false,
                      "sa_user" : false
                    });

	console.log('Loaded Users\n');

  // loadDataPrepData for Staples
  loadDataPrepData(tenantObj[0]);

  // loadDataPrepData for Keurig as well (this is a work around for a yet unknown bug)
  //loadDataPrepData(tenantObj[1]);

  // load segments
  try {
    for (var i = 0; i < segments.length; i++) {
      var segment = segments[i];
      segment.tenant = tenantObj[1];
      await db.segments.insert(segments[i]);
    }
    console.log('Loaded Segments\n');
  }
  catch (e) {
    console.log(e);
  }

  // load product categories
  try {
    for (var i = 0; i < productcategories.length; i++) {
      var productcategory = productcategories[i];
      productcategory.tenant = tenantObj[1];
      await db.productcategories.insert(productcategories[i]);
    }
    console.log('Loaded Product Categories\n');
  }
  catch (e) {
    console.log(e);
  }

	// load customers
	// try {
	// 	for (var i = 0; i < customers.length; i++) {
	// 		var customer = reports[i];
	// 		customer.tenant = tenantObj[0];
	// 		await db.customers.insert(reports[i]);
	// 	}
  //   console.log('Loaded Customers\n');
	// }
	// catch (e) {
	// 	console.log(e);
	// }

	// load customers
	try {
		for (var i = 0; i < allData.length; i++) {
			var allDataItem = allData[i];
			allDataItem.tenant = tenantObj[0];
			await db.alldatas.insert(allData[i]);
		}
    console.log('Loaded AllData - Customers\n');
	}
	catch (e) {
		console.log(e);
	}

  // load products
  try {
    for (var i = 0; i < products.length; i++) {
			var product = products[i];
			product.tenant = tenantObj[0];
      await db.products.insert(products[i]);
    }
    console.log('Loaded Products\n');
  }
  catch (e) {
    console.log(e);
  }


	var clusterArray = [];
  // load clusters
  try {
    for (var i = 0; i < clusters.length; i++) {
      var cluster = clusters[i];
      cluster.tenant = tenantObj[0];
      await db.clusters.insert(clusters[i]).then(function(doc) {
				clusterArray.push(doc);
			});
    }
    console.log('Loaded clusters\n');
  }
  catch (e) {
    console.log(e);
  }

	// Load schemes
  try {
    for (var i = 0; i < schemes.length; i++) {
			var scheme = schemes[i];
      console.log(scheme.name);
			scheme.tenant = tenantObj[0];

			scheme.clusters.forEach(function(cluster) {
        var temp_cluster = getClusterFromName(cluster.name, clusterArray);
        //console.log("temp cluster"); console.log(cluster.name); console.log(temp_cluster);
				cluster._id = temp_cluster._id;
        cluster.segmentSize = temp_cluster.cluster_details.customerPercentOfCompany;
        cluster.segmentSpend = temp_cluster.cluster_details.spendPercentOfCompany;
        cluster.avgTripsPerCust = temp_cluster.cluster_details.averageTripsPerCustomer;
        cluster.avgSpendPerTrip = temp_cluster.cluster_details.averageSpendsPerTrip;
        cluster.avgAnnualSpend = temp_cluster.cluster_details.averageAnnualSpends;
			});
      await db.schemes.insert(schemes[i]);
    }
    console.log('Loaded Schemes\n');
  }
  catch (e) {
    console.log(e);
  }

  // load keurig Pricing
  try {
    var allPricingCounter = 0;
    var zyloLensPricingReader = require('readline').createInterface({
      input: require('fs').createReadStream('tools/data/sample/keurig/ZyloLens-Pricing.csv')
    });

    zyloLensPricingReader.on('line', function (line) {
      if (allPricingCounter === 0) {
        zyloLensPricingReader.resume();
        allPricingCounter += 1;
      }
      else {
        var pricing = {};
        var fieldArray = line.split(',');
        pricing['INDIVIDUAL_ID'] = fieldArray[0];
        pricing['HOUSEHOLD_ID'] = fieldArray[1];
        pricing['FIRST_NAME'] = fieldArray[2];
        pricing['LAST_NAME'] = fieldArray[3];
        pricing['RFV Score'] = fieldArray[4];
        pricing['Age'] = fieldArray[5];
        pricing['Life Stage'] = fieldArray[6];
        pricing['Shoes-PriceTier'] = fieldArray[7];
        pricing['Home-PriceTier'] = fieldArray[8];
        pricing['Garden-PriceTier'] = fieldArray[9];
        pricing['RFV'] = getRFV(fieldArray[4]);

        db.zylolenspricings.insert(pricing).then(function(doc) {
          zyloLensPricingReader.resume();
          allPricingCounter += 1;
          if(allPricingCounter === 10000) {
            console.log("All inserted Pricing Data");
            if ( allCustomers === false ) {
              console.log('Finished creating sample datasets\n');
              closeScript();
            }
            else {
              loadCustomers();
            }
          }
        });

        zyloLensPricingReader.pause();
      }
    });
  }
  catch (e) {
    console.log(e);
  }
}

function getRFV(rfv_score)
{
  return RFV_SCORES[rfv_score] ? RFV_SCORES[rfv_score]['category'] : null;
}

async function loadDataPrepData(tenantObj)
{
  var attributeList = [];
  var datasetList = [];

  // Dummy hive data
  // load reports
  try {
    for (var i = 0; i < hiverecords.length; i++) {
      if (hiverecords[i]._id) { delete hiverecords[i]._id; }
      await db.hiverecords.insert(hiverecords[i]);
    }
    console.log('Loaded HiveRecords\n');
  }
  catch (e) {
    console.log(e);
  }

  // load sources
  try {
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
    for (var i = 0; i < datasets.length; i++) {
      if (datasets[i]._id) { delete datasets[i]._id; }
      var datasetToInsert = datasets[i];
      datasetToInsert.attributes = buildDatasetAttributes(datasets[i], attributeList);

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

function loadCustomers()
{
  console.log('loading customers');
  var allCustomerInsertCounter = 0;
  // Load customers
  var customerReader = require('readline').createInterface({
    input: require('fs').createReadStream('tools/data/sample/keurig/Customer-Loyalty-Data.csv')
  });

  customerReader.on('line', function (line) {
    var customer = {};
    var fieldArray = line.split(',');
    customer['INDIVIDUAL_ID'] = fieldArray[0];
    customer['HOUSEHOLD_ID'] = fieldArray[1];
    customer['FIRST_NAME'] = fieldArray[2];
    customer['MIDDLE_NAME'] = fieldArray[3];
    customer['LAST_NAME'] = fieldArray[4];
    customer['GENDER'] = fieldArray[5];
    customer['PREFIX'] = fieldArray[6];
    customer['TITLE'] = fieldArray[7];
    customer['SUFFIX'] = fieldArray[8];
    customer['STD_ADDRESS_1'] = fieldArray[9];
    customer['STD_ADDRESS_2'] = fieldArray[10];
    customer['STD_CITY'] = fieldArray[11];
    customer['STD_STATE_PROVINCE'] = fieldArray[12];
    customer['STD_POSTAL_CODE_1'] = fieldArray[13];
    customer['DATE_OF_BIRTH'] = fieldArray[14];
    customer['PRIMARY_LANGUAGE'] = fieldArray[15];
    customer['EMAIL_ADDRESS'] = fieldArray[16];
    customer['STD_ADDRESS_11'] = fieldArray[17];
    customer['STD_ADDRESS_21'] = fieldArray[18];
    customer['STD_CITY1'] = fieldArray[19];
    customer['STD_STATE_PROVINCE1'] = fieldArray[20];
    customer['STD_POSTAL_CODE_11'] = fieldArray[21];
    customer['STD_POSTAL_CODE_2'] = fieldArray[22];
    customer['PHONE_NUMBER'] = fieldArray[23];
    customer['ENTITY_TYPE'] = fieldArray[24];
    customer['BUYER_STATUS_CODE'] = fieldArray[25];
    customer['FIRST_ORDER_DATE'] = fieldArray[26];
    customer['LAST_ORDER_DATE'] = fieldArray[27];
    customer['NET_SALES_LTD'] = fieldArray[28];
    customer['NET_SALES_LAST12_MONTHS'] = fieldArray[29];
    customer['ORDER_COUNT_LTD'] = fieldArray[30];
    customer['ORDER_COUNT_LAST12_MONTHS'] = fieldArray[31];
    customer['EMAILS_SENT_LTD'] = parseInt(fieldArray[32]) || 0;
    customer['EMAILS_SENT_LAST12_MONTHS'] = fieldArray[33];
    customer['EMAIL_OPENS_LTD'] = parseInt(fieldArray[34]) || 0;;
    customer['EMAIL_OPENS_LAST12_MONTHS'] = fieldArray[35];
    customer['EMAIL_CLICKS_LTD'] = parseInt(fieldArray[36]) || 0;;
    customer['EMAIL_CLICKS_LAST12_MONTHS'] = fieldArray[37];
    customer['RFM_SCORE'] = fieldArray[38];
    customer['KEURIG_AUTO_DELIVERY_FLAG'] = fieldArray[39];
    customer['LB_SEGMENT_CODE'] = fieldArray[40];
    customer['LB_RISK_SCORE'] = fieldArray[41];
    customer['LB_CROSS_SELL_PROBABILITY_SCORE'] = fieldArray[42];
    customer['LB_UP_SELL_PROBABILITY_SCORE'] = fieldArray[43];
    customer['LB_BUY_PROBABILITY_SCORE'] = fieldArray[44];
    customer['LB_ROAST_PROFILE_CODE'] = fieldArray[45];
    customer['TOTAL_KCUP_PURCHASES'] = fieldArray[46];
    customer['TOTAL_VUECUP_PURCHASES'] = fieldArray[47];
    customer['TOTAL_RIVO_PURCHASES'] = fieldArray[48];
    customer['BAG_COFFEE_BUYER_FLAG'] = fieldArray[49];
    customer['BREWER_FLAG'] = fieldArray[50];
    customer['KBU_CREATE_DATE'] = fieldArray[51];
    customer['SCBU_CREATE_DATE'] = fieldArray[52];
    customer['DAYS_SINCE_FIRST_PURCHASE'] = parseInt(fieldArray[53]) || 0;
    customer['DAYS_SINCE_LAST_PURCHASE'] = parseInt(fieldArray[54]) || 0;
    customer['DAYS_BETWEEN_PURCHASES'] = parseInt(fieldArray[55]) || 0;
    customer['AVG_DAYS_BETWEEN_ORDERS'] = parseInt(fieldArray[56]) || 0;
    customer['AVG_ORDER_AMOUNT_BY_RECENCY_A'] = fieldArray[57];
    customer['AVG_ORDER_AMOUNT_BY_RECENCY_B'] = fieldArray[58];
    customer['AVG_ORDER_AMOUNT_BY_RECENCY_C'] = fieldArray[59];
    customer['AVG_ORDER_AMOUNT_BY_RECENCY_D'] = fieldArray[60];
    customer['SWP_FAV_BRAND'] = fieldArray[61];
    customer['SWP_AGE_RANGE'] = fieldArray[62];
    customer['SWP_REG_DATE'] = fieldArray[63];
    customer['HOH_FLAG'] = fieldArray[64];
    customer['EMPL_FLAG'] = fieldArray[65];
    customer['SUPPORT_TEAM_CODE'] = fieldArray[66];
    customer['ENGAGEMENT_STATUS'] = fieldArray[67];
    customer['POINTS_TO_PLATINUM'] = fieldArray[68];
    customer['KEURIG_STORE_VISIT_FLAG'] = fieldArray[69];
    customer['K2_FLAG'] = fieldArray[70];
    customer['BOL_FLAG'] = fieldArray[71];
    customer['LINKED_TO_BUSINESS_FLAG'] = fieldArray[72];
    customer['KEURIG_SEGMENT_ID'] = fieldArray[73];
    customer['KEURIG_SEGMENT_NAME'] = fieldArray[74];
    customer['KSUPER_FLAG_ID'] = fieldArray[75];
    customer['KEURIG_STORE_NUM_VISITS'] = fieldArray[76];
    customer['KSUPER_FLAG_NAME'] = fieldArray[77];
    customer['KEURIG_CHOICE_FLAG'] = fieldArray[78];
    customer['MPP_FLAG'] = fieldArray[79];
    customer['ENTITY_TYPE_HOT'] = fieldArray[80];
    customer['ENTITY_TYPE_KOLD'] = fieldArray[81];
    customer['LIFETIME_POINTS'] = fieldArray[82];
    customer['REDEEMED_POINTS'] = fieldArray[83];
    customer['OFFENSIVE_WORD_FLAG'] = fieldArray[84];
    customer['IsReseller'] = fieldArray[85];
    //console.log("inserting loyalty: "+fieldArray[0]);
    db.customers.insert(customer).then(function(doc) {
      customerReader.resume();
      allCustomerInsertCounter += 1;
      //console.log("Inserted loyalty: "+fieldArray[0] + "   record number " + allCustomerInsertCounter);
      if(allCustomerInsertCounter === 10000) {
        //console.log("All inserted \n Inserting Cluster data");
        updateDbWithClusterCsv();
      }
    });
    customerReader.pause();
  });

}

// function to updated customers collection with cluster csv Data
function updateDbWithClusterCsv() {
	var clusterInsertCounter = 0;
  let clusterReader = require('readline').createInterface({
    input: require('fs').createReadStream('tools/data/sample/keurig/C-Metrics-Cluster.csv')
  });
  clusterReader.on('line', function (line) {
    let cluster = {};
    let fieldArray = line.split(',');
    let individualId = fieldArray[0];
    cluster['RFV Score'] = fieldArray[4];
    cluster['Age'] = parseInt(fieldArray[5]) || 0;
    cluster['Life Stage'] = fieldArray[6];
		cluster['RFV'] = getRFV(fieldArray[4]);
    if(fieldArray[6] === 'Young Singles') {
      cluster['children_in_household'] = false;
    } else {
      var randomChildInHouse = Math.round(Math.random()*1);
      cluster['children_in_household'] = (randomChildInHouse === 0) ? false : true;
    }
    db.customers.findAndModify({
      query: { INDIVIDUAL_ID: individualId },
      update: { $set: cluster }
    }).then(function(doc) {
      clusterReader.resume();
			clusterInsertCounter += 1;
			if(clusterInsertCounter === 10000) {
				console.log('Inserted all cluster records. \n Inserting dashboard data');
				updateDbWithDashboardCsv(db);
			}
    });

    clusterReader.pause();
  });

  clusterReader.on('close', function() {
    // updateDbWithDashboardCsv(db);
		console.log('updating started .... please wait ... ');
	});

  // let dashboardReader = require('readline').createInterface({
  //   input: require('fs').createReadStream('tools/data/sample/keurig/C-Metrics-Dashboard.csv')
  // });
  // dashboardReader.on('line', function (line) {
  //   let dashboard = {};
  //   let fieldArray = line.split(',');
  //   let individualId = fieldArray[0];
  //   console.log("dashboard individual id: "+ individualId);
  //   dashboard['Potential_Score'] = fieldArray[5];
  //   dashboard['Potential'] = fieldArray[6];
  //   dashboard['Total Sales'] = fieldArray[7];
  //   dashboard['Q1 Sales'] = fieldArray[8];
  //   dashboard['Q2 Sales'] = fieldArray[9];
  //   dashboard['Q3 sales'] = fieldArray[10];
  //   dashboard['Q4 Sales'] = fieldArray[11];
  //
  //   db.customers.findAndModify({
  //     query: { INDIVIDUAL_ID: individualId },
  //     update: { $set: dashboard }
  //   }).then(function(doc) {
  //     dashboardReader.resume();
  //   });
  //
  //   dashboardReader.pause();
  // });

}

function updateDbWithDashboardCsv(database) {
	var dashboardInsertCounter = 0;
  let dashboardReader = require('readline').createInterface({
    input: require('fs').createReadStream('tools/data/sample/keurig/C-Metrics-Dashboard.csv')
  });
  dashboardReader.on('line', function (line) {
    let dashboard = {};
    let fieldArray = line.split(',');
    let individualId = fieldArray[0];
    // console.log("dashboard individual id: "+ individualId);
    dashboard['Potential_Score'] = fieldArray[5];
    dashboard['Potential'] = fieldArray[6];
    dashboard['Total Sales'] = parseInt(fieldArray[7]) || 0;
    const q1_Sales = parseInt(fieldArray[8]) || 0;
    const q2_Sales = parseInt(fieldArray[9]) || 0;
    const q3_Sales = parseInt(fieldArray[10]) || 0;
    const q4_Sales = parseInt(fieldArray[11]) || 0;

		dashboard['Q1 Sales'] = q1_Sales;
		dashboard['Q2 Sales'] = q2_Sales;
		dashboard['Q3 Sales'] = q3_Sales;
		dashboard['Q4 Sales'] = q4_Sales;

		dashboard['Annual Sales'] = q1_Sales + q2_Sales + q3_Sales + q4_Sales;

    database.customers.findAndModify({
      query: { INDIVIDUAL_ID: individualId },
      update: { $set: dashboard }
    }).then(function(doc) {
       //console.log("inserted: "+ individualId);
      // console.log(doc);
			dashboardInsertCounter += 1;

			if(dashboardInsertCounter === 10000) {
        updateDbWithOnlineCsv(database);
			}
      dashboardReader.resume();
    });
    //console.log("inserting: "+ individualId);
    dashboardReader.pause();
  });

  dashboardReader.on('close', function() {
  	console.log('All Done');
    // db.close();
    // process.exit();
	});
}

  function updateDbWithOnlineCsv(database) {
    var onlineInsertCounter = 0;
    var lineCounter = 0;
    let onlineReader = require('readline').createInterface({
      input: require('fs').createReadStream('tools/data/sample/keurig/onlineData.tsv')
    });
    onlineReader.on('line', function (line) {
      let online = {};
      let fieldArray = line.split('\t');
      let individualId = fieldArray[0];
      // console.log("online individual id: "+ individualId);
      online['BROWSER_ID'] = fieldArray[1];
      online['VISIT_TIME'] = fieldArray[2];
      online['VISIT_IP'] = fieldArray[3];
      online['PRODUCT'] = fieldArray[4];
      online['PRODUCTS_IN_CART'] = parseInt(fieldArray[5]) || 0;
      online['ProductPK'] = fieldArray[6];
      online['ACCEPT_LANGUAGE'] = fieldArray[7];
      online['PAGES_IN_VISIT'] = parseInt(fieldArray[8]) || 0;
      online['AVERAGE_DURATION_IN_MINUTES'] = parseInt(fieldArray[9]) || 0;
      online['SEARCH_USAGE'] = parseInt(fieldArray[10]) || 0;
      online['REVIEW_USAGE'] = parseInt(fieldArray[11]) || 0;
      online['CHECKOUT'] = parseInt(fieldArray[12]) || 0;
      online['BOUGHT'] = parseInt(fieldArray[13]) || 0;
      online['DOMAIN'] = fieldArray[14];
      online['USER_AGENT'] = fieldArray[15];
      online['GEO_CITY'] = fieldArray[16];
      online['GEO_COUNTRY'] = fieldArray[17];
      online['GEO_REGION'] = fieldArray[18];
      online['REFERRER'] = fieldArray[19];
      online['CART_TOTAL'] = parseInt(fieldArray[20]) || 0;
      console.log("building online " + fieldArray[0]);
      db.customers.find({"INDIVIDUAL_ID": individualId})
          .toArray().then(function(customerInstance) {
                console.log("outside customerInstance " + JSON.stringify(customerInstance));
                if(customerInstance) {
                  for(var property in customerInstance[0]) {
                      if (customerInstance[0].hasOwnProperty(property)) {
                        if(property != '_id')
                          online[property] = customerInstance[0][property];
                      }
                  }
                  db.onlinedatas.insert(online)
                          .then(function(savedonline) {
                            onlineInsertCounter += 1;
                            console.log("inserting online " + onlineInsertCounter);
                            if(onlineInsertCounter === 10000) {
                              updateDbWithTransactionCsv(database);
                            }
                            onlineReader.resume();
                          });
                  //console.log("inserting: "+ individualId);
                  onlineReader.pause();
                }
              });
      lineCounter += 1;
    });
    onlineReader.on('close', function() {
      console.log('All Done');
      // db.close();
      // process.exit();
    });
}

function updateDbWithTransactionCsv(database) {
	var transactionInsertCounter = 0;
	var lineCounter = 0;
  let transactionReader = require('readline').createInterface({
    input: require('fs').createReadStream('tools/data/sample/keurig/transactionData.csv')
  });
  transactionReader.on('line', function (line) {
    let transaction = {};
    let fieldArray = line.split(',');
    let individualId = fieldArray[0];
    // console.log("transaction individual id: "+ individualId);
    transaction['OrderPK'] = fieldArray[1];
    transaction['ProductPK'] = fieldArray[2];
    transaction['Quantity'] = parseInt(fieldArray[3]) || 0;

		transaction['TotalPrice'] = parseFloat(fieldArray[4]) || 0;
		transaction['LoyaltyPointsUsed'] = parseInt(fieldArray[5]) || 0;
		transaction['date'] = fieldArray[6];
		transaction['BRAND'] = fieldArray[7].trim();
		transaction['BRAND_DESC'] = fieldArray[8].trim();
		transaction['Category'] = fieldArray[9].trim();
		transaction['month'] = parseInt(fieldArray[3]) || 0;
		transaction['week'] = parseInt(fieldArray[3]) || 0;
		//console.log("building transaction " + fieldArray[0]);


		// db.transactions.insert(transaction)
		// 				.then(function(savedTransaction) {
		// 					transactionInsertCounter += 1;
		// 					console.log("inserting transaction " + transactionInsertCounter);
		// 					if(transactionInsertCounter === 10000) {
		// 						console.log("done inserting transaction data");
		// 						closeScript();
		// 					}
		// 					transactionReader.resume();
		// 				});


		db.customers.find({})
						.limit(1)
						.skip(lineCounter).toArray().then(function(customerInstance) {
							//console.log("outside customerInstance " + customerInstance);
							if(customerInstance) {
								transaction.customer = customerInstance[0];
								//console.log("random customerInstance " + customerInstance[0]._id);
								db.transactions.insert(transaction)
												.then(function(savedTransaction) {
													transactionInsertCounter += 1;
													//console.log("inserting transaction " + transactionInsertCounter);
													if(transactionInsertCounter === 10000) {
														console.log("done inserting transaction data");
														closeScript();
													}
										      transactionReader.resume();
										    });
						    //console.log("inserting: "+ individualId);
						    transactionReader.pause();
							}
						});

		lineCounter += 1;
  });

  transactionReader.on('close', function() {
  	console.log('All Done');
    // db.close();
    // process.exit();
	});
}

function buildDatasetAttributes(dataset, allAttributes){
	var attrList = dataset.attributes;
	var resultList = [];
	attrList.forEach(function(attr){
		allAttributes.forEach(function(currentAttr){
			if(currentAttr.name === attr.name){
				resultList.push(currentAttr);
			}
		});
	});
	return resultList;
}

function getClusterFromName(name, clusterArray) {
	var return_cluster = null;
	clusterArray.forEach(function(cluster) {
		if(cluster.name === name) {
			return_cluster = cluster;
		}
	});
	return return_cluster;
}

function closeScript() {
  console.log('ALL DONE')
	db.close();
	process.exit();
}

setup();
