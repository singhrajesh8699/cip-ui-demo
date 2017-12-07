import async from 'async';

import * as ProductAffinity from './productAffinity.js';
import * as CustomerFeedback from './customerFeedback.js';

import * as Pricing from './pricing.js';
import * as Promotions from './promotions.js';

async function load(db, tenantObj) {

  await loadProductAffinity(db, tenantObj);

  await loadCustomerFeedback(db, tenantObj);

}

async function loadProductAffinity(db, tenantObj) {
  try {
    var paJson = await ProductAffinity.get(tenantObj.name);
    for (var i = 0; i < paJson.length; i++) {
      if (paJson[i]._id) { delete paJson[i]._id; }
      paJson[i].tenant = tenantObj;
      await db.productaffinities.insert(paJson[i]);
    }
    console.log('Loaded Product Affinity\n');
  }
  catch (e) {
    console.log(e);
  }
}

async function loadCustomerFeedback(db, tenantObj) {
  try {
    var cfJson = await CustomerFeedback.get(tenantObj.name);
    for (var i = 0; i < cfJson.length; i++) {
      if (cfJson[i]._id) { delete cfJson[i]._id; }
      cfJson[i].tenant = tenantObj;
      await db.customerfeedbacks.insert(cfJson[i]);
    }
    console.log('Loaded Customer Feedback\n');
  }
  catch (e) {
    console.log(e);
  }
}

function load2(db, tenantObj, cb) {
  Pricing.load(db, tenantObj, function() {
    Promotions.load(db, tenantObj, function() {
      cb();
    });
  });
}

export { load, load2 };


