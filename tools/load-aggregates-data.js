import pmongo from 'promised-mongo';
import fs from 'fs';
import pexec from 'promised-exec';
import async from 'async';
// import lineReader from 'readline';

let MONGODB_URI = 'cipui';

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
'transactions',
'segments',
'productcategories',
'keurig-customers-data',
'keurig-metrics-dashboard',
'keurig-metrics-cluster',
'products',
'filters']);


async function setup() {
	await db.filters.drop();

	async.parallel({
		sales: getSalesRange,
		purchase: getLastPurchaseRange,
		age: getAgeRange,
		email_opened: getEmailOpenedRange,
		email_clicked: getEmailReadRange,
		pincodes: getPinCodes
	}, function(err, result) {
		console.log("Error : ");
		console.log(err);
		console.log("last purchase max : " + result.age.min[0]["Age"]);

		var salesFilter = {name: "Sales",
												min: result.sales.min[0]["Annual Sales"],
												max: result.sales.max[0]["Annual Sales"],
												type: "range"};
		db.filters.insert(salesFilter);

		var lastPurchaseFilter = {name: "Last Purchase",
												min: result.purchase.min[0]["DAYS_SINCE_LAST_PURCHASE"],
												max: result.purchase.max[0]["DAYS_SINCE_LAST_PURCHASE"],
												type: "range"};
		db.filters.insert(lastPurchaseFilter);

		var ageFilter = {name: "Age",
												min: result.age.min[0]["Age"],
												max: result.age.max[0]["Age"],
												type: "range"};
		db.filters.insert(ageFilter);

		var emailOpenedFilter = {name: "Emails Opened",
												min: result.email_opened.min[0]["EMAIL_OPENS_LTD"],
												max: result.email_opened.max[0]["EMAIL_OPENS_LTD"],
												type: "range"};
    db.filters.insert(emailOpenedFilter);

		var emailClickedFilter = {name: "Emails Clicked",
												min: result.email_clicked.min[0]["EMAIL_CLICKS_LTD"],
												max: result.email_clicked.max[0]["EMAIL_CLICKS_LTD"],
 												type: "range"};
   db.filters.insert(emailClickedFilter);

		var pincodes = {name: "Pincode",
												list: result.pincodes,
												type: "list"};
	  db.filters.insert(pincodes);

	});
}


/*=============================================>>>>>
= Private functions =
===============================================>>>>>*/

function getSalesRange(mainCallback) {
	async.parallel({
		max: function(callback) {
			db.customers.find({})
							.sort({"Annual Sales" : -1})
							.limit(1)
							.toArray()
							.then(function(customers) {
								callback(null, customers);
							});
		},
		min: function(callback) {
			db.customers.find({})
							.sort({"Annual Sales" : 1})
							.limit(1)
							.toArray()
							.then(function(customers) {
								callback(null, customers);
							});
		}
	}, mainCallback);
}


function getLastPurchaseRange(mainCallback) {
	async.parallel({
		max: function(callback) {
			db.customers.find({})
							.sort({"DAYS_SINCE_LAST_PURCHASE" : -1})
							.limit(1)
							.toArray()
							.then(function(customers) {
								callback(null, customers);
							});
		},
		min: function(callback) {
			db.customers.find({})
							.sort({"DAYS_SINCE_LAST_PURCHASE" : 1})
							.limit(1)
							.toArray()
							.then(function(customers) {
								callback(null, customers);
							});
		}
	}, mainCallback);
}

function getAgeRange(mainCallback) {
	async.parallel({
		max: function(callback) {
			db.customers.find({})
							.sort({"Age" : -1})
							.limit(1)
							.toArray()
							.then(function(customers) {
								callback(null, customers);
							});
		},
		min: function(callback) {
			db.customers.find({})
							.sort({"Age" : 1})
							.limit(1)
							.toArray()
							.then(function(customers) {
								callback(null, customers);
							});
		}
	}, mainCallback);
}

function getEmailOpenedRange(mainCallback) {
	async.parallel({
		max: function(callback) {
			db.customers.find({})
							.sort({"EMAIL_OPENS_LTD" : -1})
							.limit(1)
							.toArray()
							.then(function(customers) {
								callback(null, customers);
							});
		},
		min: function(callback) {
			db.customers.find({})
							.sort({"EMAIL_OPENS_LTD" : 1})
							.limit(1)
							.toArray()
							.then(function(customers) {
								callback(null, customers);
							});
		}
	}, mainCallback);
}


function getEmailReadRange(mainCallback) {
	async.parallel({
		max: function(callback) {
			db.customers.find({})
							.sort({"EMAIL_CLICKS_LTD" : -1})
							.limit(1)
							.toArray()
							.then(function(customers) {
								callback(null, customers);
							});
		},
		min: function(callback) {
			db.customers.find({})
							.sort({"EMAIL_CLICKS_LTD" : 1})
							.limit(1)
							.toArray()
							.then(function(customers) {
								callback(null, customers);
							});
		}
	}, mainCallback);
}

// function getDepartments(mainCallback) {
// 	db.transactions.aggregate([
// 		{
// 			"$match": {}
// 		},
// 		{
// 			$group: {
// 				_id: "$BRAND",
// 				departments: {$addToSet: "$Category"},
// 			}
// 		}
// 	], mainCallback);
// }

function getPinCodes(mainCallback) {
	db.customers.distinct("STD_POSTAL_CODE_1", {}).then(function(data) {
		mainCallback(null, data);
	});
}


/*= End of Private functions =*/
/*=============================================<<<<<*/


setup();
