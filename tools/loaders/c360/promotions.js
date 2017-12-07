
import * as KeurigCustomers from './customers.js';

import * as Utils from '../utils.js';

function load(db, tenantObj, cb)
{
  try {
    var tenant_name = tenantObj.name;
    var tenant_name_lc = tenant_name.toLowerCase();
    var promotions_file_path = __dirname + '/../data/' + tenant_name_lc + '/c360/Promotions.csv';

    var allPromotionsCounter = 0;
    var lineCounter = 0;
    var promotionsReader = require('readline').createInterface({
      input: require('fs').createReadStream(promotions_file_path)
    });

    promotionsReader.on('line', function (line) {
      if (allPromotionsCounter === 0) {
        promotionsReader.resume();
        allPromotionsCounter += 1;
      }
      else {
        var promotion = {};
        var fieldArray = line.split(',');
        promotion['INDIVIDUAL_ID'] = fieldArray[0];
        promotion['HOUSEHOLD_ID'] = fieldArray[1];
        promotion['FIRST_NAME'] = fieldArray[2];
        promotion['LAST_NAME'] = fieldArray[3];
        promotion['RFV Score'] = fieldArray[4];
        promotion['Age'] = fieldArray[5];
        promotion['Life Stage'] = fieldArray[6];
        promotion['RFV'] = Utils.getRFV(fieldArray[4]);

        var potentialRemainder = lineCounter % 3;
        var LifeStyleRemainder = lineCounter % 4;
        var MissionRemainder = lineCounter % 4;

        // potential scheme
        if(potentialRemainder === 0) {
          promotion['Potential'] = 'High';
        } else if(potentialRemainder === 1) {
          promotion['Potential'] = 'Medium';
        } else if(potentialRemainder === 2) {
          promotion['Potential'] = 'Low';
        }

        // Life Style scheme_name
        if(LifeStyleRemainder === 0) {
          promotion['Life Style'] = 'Brand Conscious';
        } else if(LifeStyleRemainder === 1) {
          promotion['Life Style'] = 'Value for Money';
        } else if(LifeStyleRemainder === 2) {
          promotion['Life Style'] = 'Deal Shoppers';
        } else if(LifeStyleRemainder === 3) {
          promotion['Life Style'] = 'Technology Savvy';
        }

        // Life Style scheme_name
        if(MissionRemainder === 0) {
          promotion['Missions'] = 'Lunch Time';
        } else if(MissionRemainder === 1) {
          promotion['Missions'] = 'Booze Cruise';
        } else if(MissionRemainder === 2) {
          promotion['Missions'] = 'Dinner Party';
        } else if(MissionRemainder === 3) {
          promotion['Missions'] = 'On the go';
        }

        // Fill Promos array ..
        fillPromos(promotion, fieldArray);

        promotion.tenant = tenantObj;

        db.promotions.insert(promotion).then(function(doc) {
          promotionsReader.resume();
          allPromotionsCounter += 1;
          if(allPromotionsCounter === 10000) {
            console.log("Loaded Promotions Data for " + tenantObj.name);
            cb();
          }
        });
        lineCounter++;
        promotionsReader.pause();
      }
    });
  }
  catch (e) {
    console.log(e);
  }
}

function fillPromos(promotion, fieldArray) {
  var pm_suffix = '-Promotion';
  var bf_suffix = '-Bf-Promotion';
  var af_suffix = '-Af-Promotion';

  // The number of these should be equal to what DataXylo is providing ...
  var products = [
    'D1C1',
    'D2C1',
    'D3C1'];

  var intervals = [2, 4, 6];

  var prod_index = 7;
  products.forEach(function(product) {
    intervals.forEach(function(interval) {
      promotion[product + bf_suffix + '-' + interval] =
        getPromoVal(fieldArray[prod_index], promotion);
      promotion[product + pm_suffix] =
        getPromoVal(fieldArray[prod_index + 1], promotion);
      promotion[product + af_suffix + '-' + interval] =
        getPromoVal(fieldArray[prod_index + 2], promotion);
    });
    prod_index = prod_index + products.length;
  });

  promotion['D1C1-PromotionOnlyFlag'] = fieldArray[16];
  promotion['D2C1-PromotionOnlyFlag'] = fieldArray[17];
  promotion['D3C1-PromotionOnlyFlag'] = fieldArray[18];

}


function getPromoVal(field_val, promotion) {
  // Remove $ ..
  var val = parseInt(field_val.slice(2));

  var lifeStage = promotion['Life Stage'];
  var rfv = promotion['RFV'];

  //console.log(lifeStage);
  //console.log(rfv);

  var offset = Math.round(Math.random(20, 100));
  if (lifeStage === 'Young Couple') {
    offset += 170;
  }
  else if (lifeStage === 'Young Singles') {
    offset += 217;
  }

  if (rfv === 'Explorers') {
    offset += 70;
  }
  else if (rfv === 'VIPs') {
    offset += 117;
  }

  return (Math.abs(val - offset));
}


export { load };
