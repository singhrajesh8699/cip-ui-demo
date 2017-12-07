
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

import * as ZyloLens from './zyloLens.js';

function load(db, tenantObj, cb) {
  ZyloLens.load2(db, tenantObj, function() {
    loadCustomers(db, tenantObj, function() {
      cb();
    });
  });
}

function loadCustomers(db, tenantObj, finalCallback)
{
  console.log('Loading Customers for ' + tenantObj.name);
  var allCustomerInsertCounter = 0;

  var tenant_name = tenantObj.name;
  var tenant_name_lc = tenant_name.toLowerCase();
  var customers_file_path = __dirname + '/../data/' + tenant_name_lc + '/c360/Data_UI.csv';

  // Load customers
  var customerReader = require('readline').createInterface({
    input: require('fs').createReadStream(customers_file_path)
  });

  customerReader.on('line', function (line) {
    customerReader.pause();
    var customer = {};
    var fieldArray = line.split(',');
    var currentIndividualId = fieldArray[9];
    //console.log("Processing " + currentIndividualId);
    getCustomer(db, currentIndividualId, tenantObj, function(err, customer) {
        if(!err && customer) {
          // console.log("Updating customer " + currentIndividualId);
          updateCustomer(db, currentIndividualId, fieldArray, tenantObj, function(err, updated) {
            insertTransaction(db, fieldArray, customer, tenantObj, function(err, newTransaction) {
                allCustomerInsertCounter += 1;
                processPrint(allCustomerInsertCounter, 100);
                // console.log("Done with record " + allCustomerInsertCounter);
                if(allCustomerInsertCounter === numberOfRecords) {
                  updateDbWithOnlineCsv(db, tenantObj, finalCallback);
                  return;
                }
                customerReader.resume();
            });
          })
        }
        else {
          // console.log("inserting customer " + currentIndividualId);
          insertCustomer(db, fieldArray, tenantObj, function(err, newCustomer) {
            insertTransaction(db, fieldArray, newCustomer, tenantObj, function(err, newTransaction) {
              allCustomerInsertCounter += 1;
              // console.log("Done with record " + allCustomerInsertCounter);
              processPrint(allCustomerInsertCounter, 100);
              if(allCustomerInsertCounter === numberOfRecords) {
                console.log('\nLoaded Customers for: ' + tenantObj.name);
                updateDbWithOnlineCsv(db, tenantObj, finalCallback);
                return;
              }
              customerReader.resume();
            });
          });
        }
    });
  });

}

function getCustomer(db, individualId, tenantObj, callback) {
    db.customers.findOne({"INDIVIDUAL_ID": individualId, "tenant.name": tenantObj.name}).then(function(doc) {
        callback(null, doc);
    });
}

function updateCustomer(db, individualId, fieldArray, tenantObj, callback) {
  //console.log("updating user " + individualId);
  db.customers.findOne({'INDIVIDUAL_ID': individualId, 'tenant.name': tenantObj.name}).then(function(selectedCustomer) {
      
      //console.log("find returned user for " + individualId);
      
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

      //console.log("updating user with new " + individualId);
      // Update customer with new values
      db.customers.update({"INDIVIDUAL_ID": individualId, "tenant.name": tenantObj.name}, {'$set': selectedCustomer}).then(function(doc) {
          //console.log("updated");
          callback(null, doc);
      });

  });
}

function insertCustomer(db, fieldArray, tenantObj, callback) {
  var customer = {};
  customer['INDIVIDUAL_ID'] = fieldArray[9];
  customer['GENDER'] = fieldArray[21];
  customer['STD_STATE_PROVINCE'] = fieldArray[26];
  customer['STD_CITY1'] = fieldArray[27];
  customer['EMAILS_SENT_LTD'] = parseInt(fieldArray[28]) || 0;
  customer['EMAIL_OPENS_LTD'] = parseInt(fieldArray[29]) || 0;
  customer['EMAIL_CLICKS_LTD'] = parseInt(fieldArray[30]) || 0;
  customer['Age'] = parseInt(fieldArray[20]) || 0;
  customer['Life Stage'] = mapLifeStageValue(fieldArray[19]);
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

  customer.tenant = tenantObj;

  db.customers.insert(customer).then(function(doc) {
      callback(null, doc);
  });
}

function mapLifeStageValue(orgValue) {

  if (orgValue === 'Mature') {
    return 'Matures';
  }
  else if (orgValue === 'Empty Nester') {
    return 'Empty Nesters';
  }
  else {
    return orgValue; 
  }
}

function insertTransaction(db, fieldArray, customer, tenantObj, callback) {
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
  transaction.tenant = tenantObj;
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

function processPrint(total, interval) {
  if (total % interval === 0) {
    process.stdout.write('.');
  }
}

function updateDbWithOnlineCsv(db, tenantObj, finalCallback) {

  console.log('Loading Online Data for ' + tenantObj.name);

  var tenant_name = tenantObj.name;
  var tenant_name_lc = tenant_name.toLowerCase();
  var onlinedata_file_path = __dirname + '/../data/' + tenant_name_lc + '/c360/onlineData.tsv';

  var onlineInsertCounter = 0;
  var lineCounter = 0;
  let onlineReader = require('readline').createInterface({
    input: require('fs').createReadStream(onlinedata_file_path)
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
    
    online.tenant = tenantObj;

    //console.log("building online " + fieldArray[0]);
    db.customers.find()
                  .skip(lineCounter)
                  .limit(1)
        .toArray().then(function(customerInstance) {
              //console.log("outside customerInstance " + JSON.stringify(customerInstance));
              if(customerInstance) {
                //console.log("customer " + onlineInsertCounter + "   for online data");
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
                          processPrint(onlineInsertCounter, 10);
                          if(onlineInsertCounter === 10000) {
                            console.log('\nInserted Online data for: ' + tenantObj.name);
                            finalCallback();
                          }
                          onlineReader.resume();
                        });
                //console.log("inserting: "+ individualId);
                // onlineReader.pause();
              }
            });
    lineCounter += 1;
  });

  //onlineReader.on('close', function() {
   
  //});
}

export { load };
