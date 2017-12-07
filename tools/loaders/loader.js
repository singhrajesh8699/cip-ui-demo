import pmongo from 'promised-mongo';
import fs from 'fs';
import pexec from 'promised-exec';
import async from 'async';
import asyncLoop from 'node-async-loop';

import * as DataPrep from './dataprep/dataprep.js';

import * as Segmentation from './c360/segmentation.js';
import * as ZyloLens from './c360/zyloLens.js';

import * as Customers from './c360/customers.js';

import * as Tenants from './tenants.js';
import * as Uploads from './uploads.js';
import * as Users from './users.js';

import * as Utils from './utils.js';

import commandLineArgs from 'command-line-args';
var gCmdLineOptions = null;
const cmdLineOptionsDefinitions = [
    { name: 'reseedTenants', type: Boolean, defaultValue: false }
];

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
'segments',
'clusters',
'productcategories',
'pricing',
'promotions',
'products',
'transactions',
'onlinedatas',
'customerfeedbacks',
'clusterproductaffinities',
'ProductAffinitys',
'sourceintersections']);


console.log('Loading db.cipui ..');

async function main() {

  gCmdLineOptions = commandLineArgs(cmdLineOptionsDefinitions);
  console.log(gCmdLineOptions);
  //process.exit();

  await init();

  // Load Tenants First
  var tenantObjects = null;
  if (gCmdLineOptions.reseedTenants) {
    tenantObjects = await Tenants.load(db);
  }
  else {
    tenantObjects = await Tenants.getAll(db);
  }

  // Uploads
  await Uploads.setup();

  // Users
  await Users.loadAdmins(db);

  // await does not work with forEach .. but works with for()
  for (var i = 0; i < tenantObjects.length; i++) {
    await Users.loadTenant(db, tenantObjects[i]);
    await DataPrep.load(db, tenantObjects[i]);
		await Segmentation.load(db, tenantObjects[i]);
    await ZyloLens.load(db, tenantObjects[i]);
  }

  // Load these outside of the async/await mechanism .. 
  // This code is currently not designed to use the async/await pattern
  // This mechanism calls multiple layers of standard callbacks and then 
  // closes the script at the end ... 
  asyncLoop(tenantObjects, function (item, next) {

      Customers.load(db, item, function (err) {
        if (err) {
          next(err);
          return;
        }
        console.log('\n');
        next();
      });
    
    }, 

    function (err) {
      if (err) {
        console.error('Error: ' + err.message);
        return;
      }
      closeScript(db);
    }
  );

}

function closeScript(db) {
  console.log('---- ALL DONE ----');
  db.close();
  process.exit();
}

async function init() {
  try {
    await db.users.drop();
    await db.datasets.drop();
    await db.sources.drop();
    await db.reports.drop();
    await db.categories.drop();
    await db.projects.drop();
    await db.hiverecords.drop();
    await db.alldatas.drop();
    if (gCmdLineOptions.reseedTenants) {
      await db.tenants.drop();
    }
    await db.cipdatas.drop();
    await db.schemes.drop();
    await db.clusters.drop();
    await db.productaffinities.drop();

    await db.customers.drop();

    await db.products.drop();
    await db.productcategories.drop();
    await db.segments.drop();

    await db.loyalty.drop();
    await db.onlinedatas.drop();
    await db.transactions.drop();

    await db.pricings.drop();
    await db.promotions.drop();
    await db.customerfeedbacks.drop();
		await db.clusterproductaffinities.drop();
		await db.sourceintersections.drop();

    console.log('Cleared collections\n');
  }
  catch (e) {
    console.log(e);
  }
}

main();
