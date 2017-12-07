'use strict';

var express = require('express'),
  router = express.Router(),
	mongoose = require('mongoose'),
	Customer = mongoose.models.Customer,
	Transaction = mongoose.models.Transaction,
	CustomerGroup = mongoose.models.CustomerGroup,
	Onlinedata = mongoose.models.Onlinedata,
  _ = require("lodash"),
	async = require('async'),
  apiResponse = require('../utils/apiResponse'),
  apiErrors = require('../utils/apiErrors'),
  config = require('../config/config');


/*=============================================>>>>>
= Public methods =
===============================================>>>>>*/

var getAllCustomerGroups = function(req, res) {
	CustomerGroup.find({}, function(err, result) {
		if(err){
			return apiResponse.sendError(apiErrors.APPLICATION.INTERNAL_ERROR, null, 500, req, res);
		}
		apiResponse.sendResponse(result, 200, req, res);
	});
};

var getCustomerGroupById = function(req, res) {
	CustomerGroup.findById(req.params.id, function(err, result) {
		if(err){
			return apiResponse.sendError(apiErrors.APPLICATION.INTERNAL_ERROR, null, 500, req, res);
		}
		apiResponse.sendResponse(result, 200, req, res);
	});
};


var getAllCustomersData = function(req, res) {
	var queryFilters = {};
	var queryFiltersTransactions = {};
	if(req.body.filters) {
		queryFilters = generateQueryFilters(req.body.filters);
		queryFiltersTransactions = generateTransactionQueryFilters(req.body.filters);
	}

	// Rajeev Debugging
	console.log(queryFilters);

	async.parallel({
		ageMedian: function(callback) {
			calculateMedianAge(queryFilters, callback);
		},
		femalePercentage: function(callback) {
			getFemaleCustomerPercentage(queryFilters, callback);
		},
		numberOfCustomers: function(callback) {
			getNumberOfCustomers(queryFilters, callback);
		},
		seasonality: function(callback) {
	  		getSalesTotals(queryFilters, callback);
		},
		groupByCount: function(callback) {
			getCountForGroupBy(queryFilters, req.body.groupByField, callback);
		},
		customerPercentOfCompany: function(callback) {
			getCustomerPercentOfCompany(queryFilters, callback);
		},
		spendPercentOfCompany: function(callback) {
			getSpendPercentOfCompany(queryFilters, callback);
		},
		significantStates: function(callback) {
			getSignificantStates(queryFilters, callback);
		},
		averageTripsPerCustomer: function(callback) {
			getAverageTripsPerCustomer(queryFilters, queryFiltersTransactions, callback);
		},
		averageSpendsPerTrip: function(callback) {
			getAverageSpendPerTrip(queryFiltersTransactions, callback);
		},
		averageAnnualSpends: function(callback) {
			getAverageAnnualSpends(queryFilters, callback);
		},
		groupByRFV: function(callback) {
			getGroupByRFVScore(queryFilters, callback);
		},
		onlineData: function(callback) {
			getOnlineData(queryFilters, callback)
		},
    childrenInHouseholdClusterAvg: function(callback) {
      getChildrenInHouse(queryFilters, callback);
    },
		migration2015: function(callback) {
			getMigrationData(queryFilters, callback);
		}
	}, function(err, result) {
		if(err){
			// Rajeev Debugging
			console.log(err);
			return apiResponse.sendError(apiErrors.APPLICATION.INTERNAL_ERROR, null, 500, req, res);
		}
		apiResponse.sendResponse(result, 200, req, res);
	});

};

var addCustomerGroup = function(req, res) {
	var queryFilters = {};
	var queryFiltersTransactions = {};
	if(req.body.filters) {
		queryFilters = generateQueryFilters(req.body.filters);
		queryFiltersTransactions = generateTransactionQueryFilters(req.body.filters);
	}

	async.parallel({
		ageMedian: function(callback) {
			calculateMedianAge(queryFilters, callback);
		},
		femalePercentage: function(callback) {
			getFemaleCustomerPercentage(queryFilters, callback);
		},
		numberOfCustomers: function(callback) {
			getNumberOfCustomers(queryFilters, callback);
		},
		seasonality: function(callback) {
	  		getSalesTotals(queryFilters, callback);
		},
		groupByCount: function(callback) {
			getCountForGroupBy(queryFilters, req.body.groupByField, callback);
		},
		customerPercentOfCompany: function(callback) {
			getCustomerPercentOfCompany(queryFilters, callback);
		},
		spendPercentOfCompany: function(callback) {
			getSpendPercentOfCompany(queryFilters, callback);
		},
		significantStates: function(callback) {
			getSignificantStates(queryFilters, callback);
		},
		averageTripsPerCustomer: function(callback) {
			getAverageTripsPerCustomer(queryFilters, queryFiltersTransactions, callback);
		},
		averageSpendsPerTrip: function(callback) {
			getAverageSpendPerTrip(queryFiltersTransactions, callback);
		},
		averageAnnualSpends: function(callback) {
			getAverageAnnualSpends(queryFilters, callback);
		},
		groupByRFV: function(callback) {
			getGroupByRFVScore(queryFilters, callback);
		},
		onlineData: function(callback) {
			getOnlineData(queryFilters, callback)
		},
    childrenInHouseholdClusterAvg: function(callback) {
      getChildrenInHouse(queryFilters, callback);
    },
		migration2015: function(callback) {
			getMigrationData(queryFilters, callback);
		}
	}, function(err, result) {
		if(err){
			// Rajeev Debugging
			console.log(err);
			return apiResponse.sendError(apiErrors.APPLICATION.INTERNAL_ERROR, null, 500, req, res);
		}
		var customerGroup = new CustomerGroup();
		customerGroup.name = req.body.name;
		customerGroup.description = req.body.description;
		customerGroup.filters = req.body.filters;
		customerGroup.result = result;
		customerGroup.save(function(err, doc) {
			if(err){
				return apiResponse.sendError(apiErrors.APPLICATION.INTERNAL_ERROR, null, 500, req, res);
			}
			apiResponse.sendResponse(doc, 200, req, res);
		});


	});
};

var getOverview = function(req, res) {
	var queryFilters = {};
	var queryFiltersTransactions = {};
	if(req.body.filters) {
		queryFilters = generateQueryFilters(req.body.filters);
		queryFiltersTransactions = generateTransactionQueryFilters(req.body.filters);
	}

	generateOverview(queryFilters, function(err, result) {
		if(err){
			return apiResponse.sendError(apiErrors.APPLICATION.INTERNAL_ERROR, null, 500, req, res);
		}
		apiResponse.sendResponse(result, 200, req, res);
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

function getOnlineData(filters, mainCallback){
	async.parallel({
		totalcustomers: function(callback) {
			Onlinedata.distinct("INDIVIDUAL_ID", filters, function(err, success){
				if(err) {
					return callback(err, null);
				}
				callback(null, success.length);
			});
		},
		totalSpend: function(callback) {
			Onlinedata.aggregate([
				{
					"$match": filters
				},
				{
					$group: {
						_id: null,
						"sales": {$sum: "$CART_TOTAL"},
					}
				}
			],  function(err, success){
				if(err) {
					return callback(err, null);
				}
				callback(null, success.length > 0 ? success[0].sales : 0);
			});
		},
		totalOfflineSpend: function(callback) {
			Transaction.aggregate([
				{
					"$match": {}
				},
				{
					$group: {
						_id: null,
						"sales": {$sum: "$TotalPrice"},
					}
				}
			],  function(err, success){
				if(err) {
					return callback(err, null);
				}
				callback(null, success[0].sales);
			});
		},
		customersBrowsed: function(callback) {
			Customer.count(filters, function(err, count) {
				if(err) {
					return callback(err, null);
				}
				Onlinedata.distinct("INDIVIDUAL_ID", filters, function(err, success){
					if(err) {
						return callback(err, null);
					}
					callback(null, (success.length / count) * 100);
					});
			});
		},
		visitsPerVisitor: function(callback) {
			Onlinedata.aggregate([
				{
					"$match":  filters
				},
				{
					$group: {
						_id: "$INDIVIDUAL_ID",
						"visits": {$sum: 1},
					}
				}
			],  function(err, success){
				if(err) {
					return callback(err, null);
				}
				callback(null, success.length);
			});
		},
		pagesPerVisit: function(callback) {
			Onlinedata.aggregate([
				{
					"$match":  filters,
				},
				{
					$group: {
						_id: null,
						"visits": {$avg: "$PAGES_IN_VISIT"},
					}
				}
			],  function(err, success){
				if(err) {
					return callback(err, null);
				}
				callback(null, success.length > 0 ? success[0].visits : 0);
			});
		},
		averageDuration: function(callback) {
			Onlinedata.aggregate([
				{
					"$match":  filters,
				},
				{
					$group: {
						_id: null,
						"duration": {$avg: "$AVERAGE_DURATION_IN_MINUTES"},
					}
				}
			],  function(err, success){
				if(err) {
					return callback(err, null);
				}
				callback(null, success.length > 0 ? success[0].duration : 0);
			});
		},
		searchUsage: function(callback) {
			Onlinedata.aggregate([
				{
					"$match":  filters,
				},
				{
					$group: {
						_id: "$SEARCH_USAGE",
						"total": {$sum: 1}
					}
				}
			], function(err, success){
				if(err) {
					return callback(err, null);
				}
				var data = {Yes: 0, No: 0};
				for(var item of success){
					if(item._id == 1)
						data.Yes = item.total;
					else
						data.No = item.total;
				}
				callback(null, (data.Yes/(data.Yes+data.No))*100);
			});
		},
		reviewUsage: function(callback) {
			Onlinedata.aggregate([
				{
					"$match":  filters,
				},
				{
					$group: {
						_id: "$REVIEW_USAGE",
						"total": {$sum: 1}
					}
				}
			], function(err, success){
				if(err) {
					return callback(err, null);
				}
				var data = {Yes: 0, No: 0};
				for(var item of success){
					if(item._id == 1)
						data.Yes = item.total;
					else
						data.No = item.total;
				}
				callback(null, (data.Yes/(data.Yes+data.No))*100);
			});
		},
		searchConversion: function(callback) {
			var tempFilter = Object.assign({}, filters);
			tempFilter['SEARCH_USAGE'] = 1;
			Onlinedata.aggregate([
				{
					"$match":  tempFilter,
				},
				{
					$group: {
						_id: "$BOUGHT",
						"total": {$sum: 1}
					}
				}
			], function(err, success){
				if(err) {
					return callback(err, null);
				}
				var data = {Yes: 0, No: 0};
				for(var item of success){
					if(item._id == 1)
						data.Yes = item.total;
					else
						data.No = item.total;
				}
				callback(null, (data.Yes/(data.Yes+data.No))*100);
			});
		},
		reviewConversion: function(callback) {
			var tempFilter = Object.assign({}, filters);
			tempFilter['REVIEW_USAGE'] = 1;
			Onlinedata.aggregate([
				{
					"$match":  tempFilter,
				},
				{
					$group: {
						_id: "$BOUGHT",
						"total": {$sum: 1}
					}
				}
			], function(err, success){
				if(err) {
					return callback(err, null);
				}
				var data = {Yes: 0, No: 0};
				for(var item of success){
					if(item._id == 1)
						data.Yes = item.total;
					else
						data.No = item.total;
				}
				callback(null, (data.Yes/(data.Yes+data.No))*100);
			});
		},
		checkoutAbandonment: function(callback) {
			Onlinedata.aggregate([
				{
					"$match":  filters,
				},
				{
					$group: {
						_id: "$BOUGHT",
						"total": {$sum: 1}
					}
				}
			], function(err, success){
				if(err) {
					return callback(err, null);
				}
				var data = {Yes: 0, No: 0};
				for(var item of success){
					if(item._id == 1)
						data.Yes = item.total;
					else
						data.No = item.total;
				}
				callback(null, (data.No/(data.Yes+data.No))*100);
			});
		},
		transactionConversion: function(callback) {
			Onlinedata.aggregate([
				{
					"$match":  filters,
				},
				{
					$group: {
						_id: "$BOUGHT",
						"total": {$sum: 1}
					}
				}
			], function(err, success){
				if(err) {
					return callback(err, null);
				}
				var data = {Yes: 0, No: 0};
				for(var item of success){
					if(item._id == 1)
						data.Yes = item.total;
					else
						data.No = item.total;
				}
				callback(null, (data.Yes/(data.Yes+data.No))*100);
			});
		},
		transactionNonReferredConversion: function(callback) {
			var tempFilter = Object.assign({}, filters);
			tempFilter['REFERRER'] = {"$eq" : ""};
			tempFilter['BOUGHT'] = 1;
			Onlinedata.aggregate([
				{
					"$match":  tempFilter,
				},
				{
					$group: {
						_id: "$BOUGHT",
						"total": {$sum: 1}
					}
				}
			], function(err, success){
				if(err) {
					return callback(err, null);
				}
				var data = {Yes: 0, No: 0};
				for(var item of success){
					if(item._id == 1)
						data.Yes = item.total;
					else
						data.No = item.total;
				}
				callback(null, (data.Yes/(data.Yes+data.No))*100);
			});
		},
		percentNonReferred: function(callback) {
			Onlinedata.count(filters, function(err, count) {
				if(err) {
					return callback(err, null);
				}
				Onlinedata.distinct("INDIVIDUAL_ID", filters, function(err, success){
					if(err) {
						return callback(err, null);
					}
					callback(null, (success.length / count) * 100);
					});
			});
		},
		//Refer if computation is correct
		customersPurchased: function(callback) {
			Onlinedata.count(filters, function(err, count) {
				if(err) {
					return callback(err, null);
				}
				var tempFilter = Object.assign({}, filters);
				tempFilter['BOUGHT'] = 1;
				Onlinedata.distinct("INDIVIDUAL_ID", tempFilter, function(err, success) {
					if(err) {
						return callback(err, null);
					}
					callback(null, (success.length / count) * 100);
				});
			});
		},
		avgSpendPerPurchase: function(callback) {
			var tempFilter = Object.assign({}, filters);
			tempFilter['BOUGHT'] = 1;
			Onlinedata.aggregate([
				{
					"$match": tempFilter
				},
				{
					$group: {
										_id: null,
										"spend": {$avg: "$CART_TOTAL"},
					}
				}
			],  function(err, success){
				if(err) {
					return callback(err, null);
				}
				callback(null, success.length > 0 ? success[0].spend : 0);
			});
		},
		avgPurchasePerCustomer: function(callback) {
			var tempFilter = Object.assign({}, filters);
			tempFilter['BOUGHT'] = 1;
			Onlinedata.aggregate([
				{
					"$match": tempFilter
				},
				{
					$group: {
										_id: "$INDIVIDUAL_ID",
										"spend": {$avg: "$CART_TOTAL"},
										"count": {$sum: 1}
					}
				}
			], function(err, success) {
					var sum = 0;
					var sumCount = 0;
					if(err) {
						return callback(err, null);
					}
					success.map(function(customer, index){
				          sum += customer.count;
				          sumCount++;
				      })
					callback(null, (sum / sumCount));
				});
		},
		avgBasketSize: function(callback) {
			var tempFilter = Object.assign({}, filters);
			tempFilter['BOUGHT'] = 1;
			Onlinedata.aggregate([
				{
					"$match": tempFilter
				},
				{
					$group: {
										_id: null,
										"basket": {$avg: "$PRODUCTS_IN_CART"},
					}
				}
			], function(err, success){
				if(err) {
					return callback(err, null);
				}
				callback(null, success.length > 0 ? success[0].basket : 0);
			});
		},
	}, function(err, result) {
		if(err) {
			return mainCallback(err, null);
		}
		mainCallback(null, result);
	});
};

function calculateMedianAge(filters, callback) {
	Customer.count(filters, function(err, count) {
		console.log("Median filters");
		console.log(filters);
		if(err) {
			return callback(err, null);
		}
		var limit = (count % 2 == 0) ? 2 : 1;
		Customer.find(filters)
						.sort( {"Age": 1} )
						.skip((count +1) / 2)
						.limit(limit)
						.exec(callback);
	});
}

function getFemaleCustomerPercentage(filters, callback) {
	Customer.count(filters, function(err, count) {
		if(err) {
			return callback(err, null);
		}
		var tempFilter = Object.assign({}, filters);
		if(tempFilter['GENDER'] && tempFilter['GENDER']['$in'].length == 1 && tempFilter['GENDER']['$in'][0] != 'F')
			return callback(null, 0);
		else{
			tempFilter['GENDER'] = 'F';
			Customer.count(tempFilter, function(err, femaleCount) {
			if(err) {
				return callback(err, null);
			}
			callback(null, (femaleCount / count) * 100);
		});
		}

	});
}

function getNumberOfCustomers(filters, callback) {
	Customer.count(filters, function(err, count) {
		if(err) {
			return callback(err, null);
		}
		callback(null, count);
	});
}

function getSalesTotals(filters, mainCallback) {
	async.parallel({
		totals: function(callback) {
			Customer.aggregate([
				{
					"$match": {}
				},
				{
					$project: {
						"Q1 Sales": {$cond: {if: {$eq: ["$Q1 Sales", NaN]}, then: null, else: "$Q1 Sales"}},
						"Q2 Sales": {$cond: {if: {$eq: ["$Q2 Sales", NaN]}, then: null, else: "$Q2 Sales"}},
						"Q3 Sales": {$cond: {if: {$eq: ["$Q3 Sales", NaN]}, then: null, else: "$Q3 Sales"}},
						"Q4 Sales": {$cond: {if: {$eq: ["$Q4 Sales", NaN]}, then: null, else: "$Q4 Sales"}}
					}
				},
				{
					$group: {
										_id: null,
										"q1": {$sum: "$Q1 Sales"},
										"q2": {$sum: "$Q2 Sales"},
										"q3": {$sum: "$Q3 Sales"},
										"q4": {$sum: "$Q4 Sales"}}}

			], callback);
		},
		cluster_totals: function(callback) {
			Customer.aggregate([
				{
					"$match": filters
				},
				{
					$project: {
		        "Q1 Sales": {$cond: {if: {$eq: ["$Q1 Sales", NaN]}, then: null, else: "$Q1 Sales"}},
						"Q2 Sales": {$cond: {if: {$eq: ["$Q2 Sales", NaN]}, then: null, else: "$Q2 Sales"}},
						"Q3 Sales": {$cond: {if: {$eq: ["$Q3 Sales", NaN]}, then: null, else: "$Q3 Sales"}},
						"Q4 Sales": {$cond: {if: {$eq: ["$Q4 Sales", NaN]}, then: null, else: "$Q4 Sales"}}
		    	}
		 		},
				{
					$group: {
										_id: null,
										"q1": {$sum: "$Q1 Sales"},
										"q2": {$sum: "$Q2 Sales"},
										"q3": {$sum: "$Q3 Sales"},
										"q4": {$sum: "$Q4 Sales"}}}

			], callback);
		},
		cluster_customers: function(callback) {
			Customer.count(filters, callback);
		},
		total_customers: function(callback) {
			Customer.count({}, callback);
		}
	},function(err, result) {
		const clusterAverageQ1 = (result.cluster_totals[0].q1 / result.cluster_customers) / result.cluster_customers;
		const companyAverageQ1 = (result.totals[0].q1 / result.total_customers) / result.total_customers;

		var q1Average = (clusterAverageQ1/companyAverageQ1) * 100;


		const clusterAverageQ2 = (result.cluster_totals[0].q2 / result.cluster_customers) / result.cluster_customers;
		const companyAverageQ2 = (result.totals[0].q2 / result.total_customers) / result.total_customers;
		var q2Average = (clusterAverageQ2/companyAverageQ2) * 100;

		const clusterAverageQ3 = (result.cluster_totals[0].q3 / result.cluster_customers) / result.cluster_customers;
		const companyAverageQ3 = (result.totals[0].q3 / result.total_customers) / result.total_customers;
		var q3Average = (clusterAverageQ3/companyAverageQ3) * 100;

		const clusterAverageQ4 = (result.cluster_totals[0].q4 / result.cluster_customers) / result.cluster_customers;
		const companyAverageQ4 = (result.totals[0].q4 / result.total_customers) / result.total_customers;
		var q4Average = (clusterAverageQ1/companyAverageQ4) * 100;

		var finalData = {q1: q1Average, q2: q2Average, q3: q3Average, q4: q4Average};
		mainCallback(err, finalData);
	});

}

function getCountForGroupBy(filters, groupField, callback) {
	const field = "$" + groupField;
	Customer.aggregate([
		{
			"$match": filters
		},
		{$group: {
			_id: field,
			count: {$sum: 1}
		}}
	], callback)
}

function getAverageTripsPerCustomer(filters, transactionFilters, mainCallback) {
	async.parallel({
		customerCount: function(callback) {
			Customer.count(filters, callback);
		},
		tripCount: function(callback) {
			Transaction.count(transactionFilters, callback);
		}
	}, function(err, result) {
		if(err) {
			return mainCallback(err, null);
		}
		var average = result.tripCount / result.customerCount;
		mainCallback(null, average);
	});
}


function getAverageSpendPerTrip(transactionFilters, mainCallback) {
	async.parallel({
		tripCount: function(callback) {
			Transaction.aggregate([
				{
					"$match": transactionFilters
				},
				{
					$group: {
						_id: "OrderPK",
						totalCount: {$sum: 1}
					}
				}
			], callback);
		},
		tripSpend: function(callback) {
			Transaction.aggregate([
				{
					"$match": transactionFilters
				},
				{
					$group: {
						_id: null,
						totalSpend: {$sum: "$TotalPrice"}
					}
				}
			], callback);
		}
	}, function(err, result) {
		if(err) {
			return mainCallback(err, null);
		}
		var average = result.tripSpend.length > 0 ? (result.tripSpend[0].totalSpend / result.tripCount[0].totalCount)
																							: 0;
		mainCallback(null, average);
	});
}

function getAverageAnnualSpends(filters, mainCallback) {
	async.parallel({
		customerCount: function(callback) {
			Customer.count(filters, callback);
		},
		totalSpend: function(callback) {
			Customer.aggregate([
				{
					"$match": filters
				},
				{
					$project: {
		        "Q1 Sales": {$cond: {if: {$eq: ["$Q1 Sales", NaN]}, then: null, else: "$Q1 Sales"}},
						"Q2 Sales": {$cond: {if: {$eq: ["$Q2 Sales", NaN]}, then: null, else: "$Q2 Sales"}},
						"Q3 Sales": {$cond: {if: {$eq: ["$Q3 Sales", NaN]}, then: null, else: "$Q3 Sales"}},
						"Q4 Sales": {$cond: {if: {$eq: ["$Q4 Sales", NaN]}, then: null, else: "$Q4 Sales"}}
		    	}
		 		},
				{
					$group: {
										_id: null,
										"q1": {$sum: "$Q1 Sales"},
										"q2": {$sum: "$Q2 Sales"},
										"q3": {$sum: "$Q3 Sales"},
										"q4": {$sum: "$Q4 Sales"}}}

			], callback);
		}
	}, function(err, result) {
		if(err) {
			return mainCallback(err, null);
		}
		var totalSpend = result.totalSpend[0].q1 + result.totalSpend[0].q2 + result.totalSpend[0].q3 + result.totalSpend[0].q4;
		var average = totalSpend / result.customerCount;
		mainCallback(null, average);
	});
}

function getSignificantStates(filters, mainCallback) {
	var tempFilter = Object.assign({}, filters);
	tempFilter['STD_STATE_PROVINCE'] = { "$exists": true, "$ne": "NULL" };
	Customer.aggregate([
		{
			"$match": tempFilter
		},
		{
			$group: {
								_id: "$STD_STATE_PROVINCE",
								"sales": {$sum: "$Total Sales"}}}
	], function(err, result) {
		if(err) {
			return mainCallback(err, null);
		}
		result.sort(function(a, b) {
			if(a.sales && b.sales) {
		    return parseFloat(a.sales) - parseFloat(b.sales);
			}
			return 0;
		});
		var overState = result.splice((result.length - 6), 5).map(function(item) {
																																return item._id;
																															});
		var underState = result.splice(0, 5).map(function(item) {
																							return item._id;
																						});
		mainCallback(null, {overRepresented: overState, underRepresented: underState})
	});
}

function getCustomerPercentOfCompany(filters, mainCallback) {
	async.parallel({
		filteredCustomerCount: function(callback) {
			Customer.count(filters, callback);
		},
		totalCustomerCount: function(callback) {
			Customer.count({}, callback);
		}
	}, function(err, result) {
		if(err) {
			return mainCallback(err, null);
		}
		var companyPercent = (result.filteredCustomerCount / result.totalCustomerCount) * 100;
		mainCallback(null, companyPercent);
	});
}

function getSpendPercentOfCompany(filters, mainCallback) {
	console.log(filters);
	async.parallel({
		filteredSpend: function(callback) {
			Customer.aggregate([
				{
					"$match": filters
				},
				{
					$group: {
										_id: null,
										"sales": {$sum: "$Total Sales"},
					}}

			], callback);
		},
		totalSpend: function(callback) {
			Customer.aggregate([
				{
					"$match": {}
				},
				{
					$group: {
										_id: null,
										"sales": {$sum: "$Total Sales"},
					}
				}
			], callback);
		}
	}, function(err, result) {
		if(err) {
			return mainCallback(err, null);
		}
		console.log("sales data");
		console.log(result);
		// console.log("Get Spend Percentage: " + result.filteredSpend[0].sales + "-" + result.totalSpend[0].sales);
		var companyPercent = result.filteredSpend.length > 0 ? (result.filteredSpend[0].sales / result.totalSpend[0].sales) * 100
																													: 0;
		mainCallback(null, companyPercent);
	});
}

function getGroupByRFVScore(filters, mainCallback) {
	Customer.aggregate([
		{
			"$match": filters
		},
		{
			$group: {
								_id: "$RFV",
								count: {$sum: 1},
			}
		}
	], mainCallback);
}

function getChildrenInHouse(filters, mainCallback) {
  async.parallel({
    customer_count: function(callback) {
			Customer.count(filters, callback);
		},
    ChildrenInHouseCount: function(callback) {
      var newFilter = JSON.parse(JSON.stringify(filters));
      newFilter['children_in_household'] = {$gt: 0};
      Customer.count(newFilter, callback);
    }
  }, function(err, result) {
    if(err) {
			return mainCallback(err, result);
		}
    var percentage = (result.ChildrenInHouseCount/result.customer_count)*100;
    mainCallback(null, percentage);
  });
}

function generateOverview(filters, mainCallback) {
	async.parallel({
		customer_count: function(callback) {
			Customer.count(filters, callback);
		},
		revenue: function(callback) {
			Customer.aggregate([
				{
					"$match": filters
				},
				{
					$group: {
										_id: null,
										"revenue": {$sum: "$Total Sales"},
					}}

			], callback);
		},
		annual_sale: function(callback) {
			Customer.aggregate([
				{
					"$match": filters
				},
				{
					$group: {
										_id: null,
										"annual_sale": {$sum: "$Annual Sales"},
					}}

			], callback);
		},
	}, function(err, result) {
		if(err) {
			return mainCallback(err, result);
		}
		var finalResult = {};
		finalResult['num_of_customers'] = result.customer_count;
		finalResult['revenue'] = result.revenue[0].revenue;
		finalResult['avg_sales'] = result.revenue[0].revenue / result.customer_count;
		finalResult['annual_spend'] = result.annual_sale[0].annual_sale;
		mainCallback(null, finalResult);
	});

}

function getMigrationData(filters, mainCallback) {
	Customer.aggregate([
		{
			"$match": filters
		},
		{
			$group: {
								_id: "$RFV-2015",
								count: {$sum: 1},
			}
		}
	], mainCallback);
}

function generateQueryFilters(filters) {
	var queryFilters = {};
	filters.forEach(function(filter) {
		if(filter.field === "children_in_household") {
			queryFilters[filter.field] = filter.list.length == 2 ? {$gte: 0} : (filter.list[0] ? {$gte: 1} : {$eq: 0} );
		}
		else if(filter.type === config.CUSTOMER_FILTER_TYPE.RANGE) {
			queryFilters[filter.field] = { $gte: filter.min, $lte: filter.max};
		}
		else if(filter.type === config.CUSTOMER_FILTER_TYPE.LIST) {
			queryFilters[filter.field] = { $in: filter.list};
		}
		else if(filter.type === config.CUSTOMER_FILTER_TYPE.SPECIFIC) {
			queryFilters[filter.field] = filter.query;
		}
	});

	return queryFilters;
}

function generateTransactionQueryFilters(filters) {
	var queryFilters = {};
	filters.forEach(function(filter) {
		const filterField = "customer." + filter.field;
		if(filter.field === "children_in_household") {
			queryFilters[filterField] = filter.list.length == 2 ? {$gte: 0} : (filter.list[0] ? {$gte: 1} : {$eq: 0} );
		}
		else if(filter.type === config.CUSTOMER_FILTER_TYPE.RANGE) {
			queryFilters[filterField] = { $gte: filter.min, $lte: filter.max};
		}
		else if(filter.type === config.CUSTOMER_FILTER_TYPE.LIST) {
			queryFilters[filterField] = { $in: filter.list};
		}
		else if(filter.type === config.CUSTOMER_FILTER_TYPE.SPECIFIC) {
			queryFilters[filterField] = filter.query;
		}
	});

	return queryFilters;
}


/*= End of Private methods =*/
/*=============================================<<<<<*/

router.get('/customergroups', getAllCustomerGroups);
router.get('/customergroups/:id', getCustomerGroupById);

router.post('/customergroups', addCustomerGroup);
router.post('/customergroups/query', getAllCustomersData);
router.post('/customergroups/overview', getOverview);



module.exports = router;
