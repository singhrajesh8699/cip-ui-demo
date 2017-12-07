
import async from 'async';

import { product_affinity } from '../../data/sample/product_affinity';

async function load(db, tenantObj) {
  var productAffinityArray = [];
  // load product_affinity
  try {
    for (var i = 0; i < product_affinity.length; i++) {
      var ProductAffinity = product_affinity[i];
      ProductAffinity.tenant = tenantObj;
      await db.productaffinities.insert(product_affinity[i]).then(function(doc) {
        productAffinityArray.push(doc);
      });
    }
    return productAffinityArray;
    console.log('Loaded Product Affinity\n');
  }
  catch (e) {
    console.log(e);
  }
}

export { load };
