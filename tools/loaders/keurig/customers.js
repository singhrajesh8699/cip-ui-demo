
import * as Utils from '../utils.js';
import async from 'async';

var numberOfRecords = 20017;
const currentYear = 2016;

var RFV_CLUSTERS = [
    "Explorers",
    "Convenience Shoppers",
    "Least Engaged",
    "Enthusiasts",
    "VIPs"
];

function load(db)
{
  console.log('loading customers');
  var allCustomerInsertCounter = 0;
  // Load customers
  var customerReader = require('readline').createInterface({
    input: require('fs').createReadStream('tools/data/sample/keurig/Data_UI.csv')
  });

  customerReader.on('line', function (line) {
		customerReader.pause();
    var customer = {};
    var fieldArray = line.split(',');
		var currentIndividualId = fieldArray[9];
		// console.log("Processing " + currentIndividualId);
		getCustomer(db, currentIndividualId, function(err, customer) {

			if(!err && customer) {
				// console.log("Updating customer " + currentIndividualId);
				updateCustomer(db, currentIndividualId, fieldArray, function(err, updated) {
					insertTransaction(db, fieldArray, customer, function(err, newTransaction) {
						allCustomerInsertCounter += 1;
						// console.log("Done with record " + allCustomerInsertCounter);
						if(allCustomerInsertCounter === numberOfRecords) {
							updateDbWithOnlineCsv(db);
							return;
						}
						customerReader.resume();
					});
				})
			}
			else {
				// console.log("inserting customer " + currentIndividualId);
				insertCustomer(db, fieldArray, function(err, newCustomer) {
					insertTransaction(db, fieldArray, newCustomer, function(err, newTransaction) {
						allCustomerInsertCounter += 1;
						// console.log("Done with record " + allCustomerInsertCounter);
						if(allCustomerInsertCounter === numberOfRecords) {
							updateDbWithOnlineCsv(db);
							return;
						}
						customerReader.resume();
					});
				});
			}
		});

    //console.log("inserting loyalty: "+fieldArray[0]);
    // db.customers.insert(customer).then(function(doc) {
    //   customerReader.resume();
    //   allCustomerInsertCounter += 1;
    //   //console.log("Inserted loyalty: "+fieldArray[0] + "   record number " + allCustomerInsertCounter);
    //   if(allCustomerInsertCounter === numberOfRecords) {
    //     //console.log("All inserted \n Inserting Cluster data");
    //     updateDbWithClusterCsv(db);
    //   }
    // });
    // customerReader.pause();
  });

}

function getCustomer(db, individualId, callback) {
	db.customers.findOne({"INDIVIDUAL_ID": individualId}).then(function(doc) {
		callback(null, doc);
	});
}

function updateCustomer(db, individualId, fieldArray, callback) {
	console.log("updating user " + individualId);
	db.customers.findOne({'INDIVIDUAL_ID': individualId}).then(function(selectedCustomer) {
		console.log("find returned user for " + individualId);
		if(!selectedCustomer) {
			callback({}, selectedCustomer);
		}


		// Updated qurte spend values
		var quarterLabel = getQuarterLabel(fieldArray[15], fieldArray[14]);

		var newVal = parseInt(fieldArray[3]) || 0;
		var oldQurterVal = selectedCustomer[quarterLabel] || 0;
		selectedCustomer[quarterLabel] = oldQurterVal + newVal;
		selectedCustomer['Total Sales'] = selectedCustomer['Total Sales'] + newVal;


		const recordDate = new Date(fieldArray[10]).getTime();
		const firstRecordDate = new Date(selectedCustomer['first_trip']).getTime();
		const lastRecordDate = new Date(selectedCustomer['last_trip']).getTime();

		const today = new Date().getTime();

		// Udated last trip and first trip dates
		if(recordDate < firstRecordDate) {
			selectedCustomer['first_trip'] = fieldArray[10]; //TODO: format to date
		}
		else if(recordDate > lastRecordDate) {
			selectedCustomer['last_trip'] = fieldArray[10]; // TODO : format to date
		}

		// Calculate trip counts and update
		const tripCount = selectedCustomer['trip_count'] + 1;
		selectedCustomer['trip_count'] = tripCount;

		// Calculate average days between trips
		const millisecondsBetweenFirstAndLastPurchase = new Date(selectedCustomer['last_trip']) - new Date(selectedCustomer['first_trip']);
		const daysBetweenFirstAndLastPurchase = (millisecondsBetweenFirstAndLastPurchase / 1000) / (3600 * 24);

		selectedCustomer['AVG_DAYS_BETWEEN_ORDERS'] = daysBetweenFirstAndLastPurchase / tripCount;

		// Calculate days since last purchase
		var millisecondsSinceLastPurchase = today - recordDate;
		var daysSinceLastPurchase = (millisecondsSinceLastPurchase / 1000) / (3600 * 24);
		selectedCustomer['DAYS_SINCE_LAST_PURCHASE'] = parseInt(daysSinceLastPurchase);

		// Delete _id field to pass the customer object to udate query.
		delete selectedCustomer._id;

		console.log("updating user with new " + individualId);
		// Update customer with new values
		db.customers.update({"INDIVIDUAL_ID": individualId}, {'$set': selectedCustomer}).then(function(doc) {
			console.log("updated");
			callback(null, doc);
		});

	});

}

function insertCustomer(db, fieldArray, callback) {
	var customer = {};
	customer['INDIVIDUAL_ID'] = fieldArray[9];
	customer['GENDER'] = fieldArray[21];
	customer['STD_STATE_PROVINCE'] = fieldArray[26];
	customer['STD_CITY1'] = fieldArray[27];
	customer['EMAILS_SENT_LTD'] = parseInt(fieldArray[28]) || 0;
	customer['EMAIL_OPENS_LTD'] = parseInt(fieldArray[29]) || 0;
	customer['EMAIL_CLICKS_LTD'] = parseInt(fieldArray[30]) || 0;
	customer['Age'] = parseInt(fieldArray[20]) || 0;
	customer['Life Stage'] = fieldArray[19];
	customer['RFV'] = fieldArray[17];
	customer['RFV-2015'] = fieldArray[18];
	customer['children_in_household'] = parseInt(fieldArray[22]) || 0;
	customer['Potential'] = fieldArray[23];
	customer['Life Style'] = fieldArray[24];
	customer['Missions'] = fieldArray[25];

	customer['first_trip'] = fieldArray[10];
	customer['last_trip'] = fieldArray[10];
	customer['AVG_DAYS_BETWEEN_ORDERS'] = 0;

	const today = new Date();
	var millisecondsSinceLastPurchase = new Date() - new Date(fieldArray[10]);
	var daysSinceLastPurchase = (millisecondsSinceLastPurchase / 1000) / (3600 * 24);
	customer['DAYS_SINCE_LAST_PURCHASE'] = parseInt(daysSinceLastPurchase);
	customer['trip_count'] = 1;

	customer['Q1 Sales'] = 0;
	customer['Q2 Sales'] = 0;
	customer['Q3 Sales'] = 0;
	customer['Q4 Sales'] = 0;

	var quarterLabel = getQuarterLabel(fieldArray[15], fieldArray[14]);
	customer[quarterLabel] = parseInt(fieldArray[3]) || 0;
	customer['Total Sales'] = customer[quarterLabel];

	db.customers.insert(customer).then(function(doc) {
		callback(null, doc);
	});
}

function insertTransaction(db, fieldArray, customer, callback) {
	var transaction = {};
	transaction['OrderPK'] = fieldArray[0];
	transaction['ProductPK'] = fieldArray[1];
	transaction['Quantity'] = parseInt(fieldArray[2]) || 0;
	transaction['TotalPrice'] = parseFloat(fieldArray[3]) || 0;
	transaction['LoyaltyPointsUsed'] = parseInt(fieldArray[6]) || 0;
	transaction['date'] = fieldArray[10];
	transaction['BRAND'] = fieldArray[11].trim();
	transaction['BRAND_DESC'] = fieldArray[12].trim();
	transaction['Category'] = fieldArray[13].trim();
	transaction['year'] = parseInt(fieldArray[14]) || 0;
	transaction['month'] = parseInt(fieldArray[15]) || 0;
	transaction['week'] = parseInt(fieldArray[16]) || 0;
	transaction['customer'] = customer;
	db.transactions.insert(transaction).then(function(doc) {
		callback(null, doc);
	});
}


function getQuarterLabel(month, year) {
	var month = parseInt(month) || 0;
	var year = parseInt(year) || 0;
	var quarter = "";
	if(month <= 4) {
		quarter = "Q1 Sales";
	}
	else if(month <= 7) {
		quarter = "Q2 Sales";
	}
	else if(month <= 10) {
		quarter = "Q3 Sales";
	}
	else {
		quarter = "Q4 Sales";
	}
	if(year !== currentYear) {
		quarter = quarter + "-" + year;
	}
	return quarter;
}

// function to updated customers collection with cluster csv Data
function updateDbWithClusterCsv(db) {
  var clusterInsertCounter = 0;
  let clusterReader = require('readline').createInterface({
    input: require('fs').createReadStream('tools/data/sample/keurig/C-Metrics-Cluster.csv')
  });

  //INDIVIDUAL_ID,HOUSEHOLD_ID,FIRST_NAME,LAST_NAME,RFV Score_2016,Age,Gender,MaritalStatus,Life Stage,RFV Score_2015


  clusterReader.on('line', function (line) {
    let cluster = {};
    let fieldArray = line.split(',');
    let individualId = fieldArray[0];
    cluster['RFV Score'] = fieldArray[4];
    cluster['Age'] = parseInt(fieldArray[5]) || 0;
    cluster['Life Stage'] = fieldArray[8];
    cluster['RFV'] = Utils.getRFV(fieldArray[4]);

		var rfvOld = Utils.getRFV(fieldArray[9]);
		// if(!rfvOld) {
		// 	rfvOld = RFV_CLUSTERS[Math.round(Math.random()*5)];
		// }

    cluster['RFV Score-2015'] = fieldArray[9];
    cluster['RFV-2015'] = rfvOld;
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
                console.log('Inserted all cluster records. \nInserting dashboard data');
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

function updateDbWithDashboardCsv(db) {
    var dashboardInsertCounter = 0;
		var lineCounter = 1;
  let dashboardReader = require('readline').createInterface({
    input: require('fs').createReadStream('tools/data/sample/keurig/C-Metrics-Dashboard.csv')
  });
  dashboardReader.on('line', function (line) {
    let dashboard = {};
    let fieldArray = line.split(',');
    let individualId = fieldArray[0];
    // console.log("dashboard individual id: "+ individualId);
    dashboard['Potential_Score'] = fieldArray[5];
    dashboard['Potential_Category'] = fieldArray[6];
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
    var potentialRemainder = lineCounter % 3;
    var LifeStyleRemainder = lineCounter % 4;
    var MissionRemainder = lineCounter % 4;

    // potential scheme
    if(potentialRemainder === 0) {
      dashboard['Potential'] = 'High';
    } else if(potentialRemainder === 1) {
      dashboard['Potential'] = 'Medium';
    } else if(potentialRemainder === 2) {
      dashboard['Potential'] = 'Low';
    }

    // Life Style scheme_name
    if(LifeStyleRemainder === 0) {
      dashboard['Life Style'] = 'Brand Conscious';
    } else if(LifeStyleRemainder === 1) {
      dashboard['Life Style'] = 'Value for Money';
    } else if(LifeStyleRemainder === 2) {
      dashboard['Life Style'] = 'Deal Shoppers';
    } else if(LifeStyleRemainder === 3) {
      dashboard['Life Style'] = 'Technology Savvy';
    }

    // Life Style scheme_name
    if(MissionRemainder === 0) {
      dashboard['Missions'] = 'Lunch Time';
    } else if(MissionRemainder === 1) {
      dashboard['Missions'] = 'Booze Cruise';
    } else if(MissionRemainder === 2) {
      dashboard['Missions'] = 'Dinner Party';
    } else if(MissionRemainder === 3) {
      dashboard['Missions'] = 'On the go';
    }

		// const random = Math.round(Math.random()*67);
		// if((random % 2) === 0) {
		// 	dashboard['Potential'] = 'High';
		// 	dashboard['Missions'] = 'Missions-C1';
		// }
		// else {
		// 	dashboard['Potential'] = 'Medium';
		// 	dashboard['Missions'] = 'Missions-C2';
		// }
    //
		// if((random % 3) === 0) {
		// 	dashboard['Life Style'] = 'LifeStyle-C1';
		// }
		// else {
		// 	dashboard['Life Style'] = 'LifeStyle-C2';
		// }
    //
    // if((random % 5) === 0) {
		// 	dashboard['Potential'] = 'Low';
		// }


    db.customers.findAndModify({
      query: { INDIVIDUAL_ID: individualId },
      update: { $set: dashboard }
    }).then(function(doc) {
      //console.log("inserted: "+ individualId);
      // console.log(doc);
      dashboardInsertCounter += 1;

      if(dashboardInsertCounter === 10000) {
        console.log('\nInserting Online data ...');
        updateDbWithOnlineCsv(db);
      }
      dashboardReader.resume();
    });
    //console.log("inserting: "+ individualId);
    lineCounter++;
    dashboardReader.pause();
  });

  dashboardReader.on('close', function() {
    //console.log('All Done');
    // db.close();
    // process.exit();
    });
}

  function updateDbWithOnlineCsv(db) {
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
      //console.log("building online " + fieldArray[0]);
      db.customers.find()
					.skip(lineCounter)
					.limit(1)
          .toArray().then(function(customerInstance) {
                //console.log("outside customerInstance " + JSON.stringify(customerInstance));
                if(customerInstance) {
									console.log("customer " + onlineInsertCounter + "   for online data");
									onlineReader.pause();
                  for(var property in customerInstance[0]) {
                      if (customerInstance[0].hasOwnProperty(property)) {
                        if(property != '_id')
                          online[property] = customerInstance[0][property];
                      }
                  }
                  db.onlinedatas.insert(online)
                          .then(function(savedonline) {
                            onlineInsertCounter += 1;
                            //console.log("inserting online " + onlineInsertCounter);
                            if(onlineInsertCounter === 10000) {
                              console.log('\nInserting Transactions data ...');
															closeScript(db);
                            }
                            onlineReader.resume();
                          });
                  //console.log("inserting: "+ individualId);
                  // onlineReader.pause();
                }
              });
      lineCounter += 1;
    });
    onlineReader.on('close', function() {
      //console.log('All Done');
      // db.close();
      // process.exit();
    });
}

function updateDbWithTransactionCsv(db) {
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
        //              .then(function(savedTransaction) {
        //                  transactionInsertCounter += 1;
        //                  console.log("inserting transaction " + transactionInsertCounter);
        //                  if(transactionInsertCounter === 10000) {
        //                      console.log("done inserting transaction data");
        //                      closeScript();
        //                  }
        //                  transactionReader.resume();
        //              });


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
                                                        console.log("Done inserting transactions data");
                                                        // updateClusterProductAffinity(db);
                                                        closeScript(db);
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
    //console.log('All Done');
    // db.close();
    // process.exit();
  });
}

// function updateClusterProductAffinity(db) {
// 	db.schemes.find({}).then(function(schemes) {
//
// 		async.each(schemes, function(scheme, mainCallback) {
// 			const schemeName = scheme.name;
// 			console.log("calculating for scheme " + schemeName);
// 			var clusterData = [];
// 			async.each(scheme.clusters, function(cluster, clusterCallback) {
// 				const clusterName = cluster.name;
// 				console.log("calculating for cluster " + clusterName);
// 				var filter = {};
// 				filter["customer" + schemeName] = clusterName;
//
// 				db.transactions.aggregate([
// 					{$match: filter},
// 					{$group: {
// 						_id: "$BRAND_DESC",
// 						count: {$sum: "$Quantity"}
// 					}}
// 				], function(err, aggregates) {
// 					clusterData.push({cluster: cluster, data: aggregates});
// 					clusterCallback();
// 				});
// 			}, function(err) {
// 				var record = {scheme: scheme, data: clusterData};
// 				console.log("Inserting  affinity data " + record);
// 				db.clusterproductaffinities.insert(record);
// 				mainCallback();
// 			});
// 		}, function(err) {
// 			closeScript(db);
// 		});
//
// 	});
// }

function closeScript(db) {
  console.log('ALL DONE')
    db.close();
    process.exit();
}

export { load };
