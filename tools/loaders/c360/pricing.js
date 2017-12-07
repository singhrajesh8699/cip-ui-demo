
import * as Utils from '../utils.js';

function load(db, tenantObj, cb)
{
  var tenant_name = tenantObj.name;
  var tenant_name_lc = tenant_name.toLowerCase();
  var pricing_file_path = __dirname + '/../data/' + tenant_name_lc + '/c360/Pricing.csv';

  try {
    var allPricingCounter = 0;
    var pricingReader = require('readline').createInterface({
      input: require('fs').createReadStream(pricing_file_path)
    });

    pricingReader.on('line', function (line) {
      if (allPricingCounter === 0) {
        pricingReader.resume();
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
        pricing['RFV'] = Utils.getRFV(fieldArray[4]);

        pricing['Potential'] = getPotential();
        pricing['Life Style'] = getLifeStyle();
        pricing['Missions'] = getMission();

        pricing.tenant = tenantObj;

        db.pricings.insert(pricing).then(function(doc) {
          pricingReader.resume();
          allPricingCounter += 1;
          if(allPricingCounter === 10000) {
            console.log("Loaded Pricing Data for: " + tenantObj.name);
            cb();
          }
        });

        pricingReader.pause();
      }
    });
  }
  catch (e) {
    console.log(e);
  }
}

// http://thepenry.net/jsrandom.php

function getPotential() {
  var min = 0; var max = 2;
  var clusters = ['High', 'Medium', 'Low'];
  var c_index = Math.round(Math.random() * (max - min + 1)) + min;
  return clusters[c_index];

}

function getLifeStyle() {
  var min = 0; var max = 3;
  var clusters = ['Brand Conscious', 'Value for Money', 'Deal Shoppers', 'Technology Savvy'];
  var c_index = Math.round(Math.random() * (max - min + 1)) + min;
  return clusters[c_index];
}

function getMission() {
  var min = 0; var max = 3;
  var clusters = ['Lunch Time', 'Booze Cruise', 'Dinner Party', 'On the go'];
  var c_index = Math.round(Math.random() * (max - min + 1)) + min;
  return clusters[c_index];
}

export { load };