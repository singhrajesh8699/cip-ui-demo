
import async from 'async';

import { tenants } from '../data/tenants';

async function load(db) {
    // Create tenant
    var tenantObjects = [];
    try {
    for (var i = 0; i < tenants.length; i++) {
      await db.tenants.insert(tenants[i]).then(function(doc) {
          tenantObjects.push(doc);
      });
    }
    console.log('Loaded Tenants\n');
    return tenantObjects;
  }
  catch (e) {
    console.log(e);
  }
}

async function getAll(db) {
    // Create tenant
    var tenantObjects = [];
    try {
      await db.tenants.find({}).then(function(doc) {
        doc.forEach(function(o) {
          tenantObjects.push(o);
        });
      });
      console.log('Fetched Tenants\n');
      return tenantObjects;
    }
    catch (e) {
      console.log(e);
    }
}


export { load, getAll };