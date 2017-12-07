import async from 'async';

import * as Clusters from './clusters.js';
import * as Schemes from './schemes.js';
import * as ProductCategories from './productCategories.js';

async function load(db, tenantObj) {

  await loadClustersSchemes(db, tenantObj);

  await loadProductCategories(db, tenantObj);

}

async function loadProductCategories(db, tenantObj) {
  // load product categories
  try {
    var pcJson = await ProductCategories.get(tenantObj.name);
    for (var i = 0; i < pcJson.length; i++) {
      if (pcJson[i]._id) { delete pcJson[i]._id; }
      pcJson[i].tenant = tenantObj;
      await db.productcategories.insert(pcJson[i]);
    }
    console.log('Loaded Product Categories\n');
  }
  catch (e) {
    console.log(e);
  }
}

async function loadClustersSchemes(db, tenantObj) {
  var clusterArray = [];

  // load billing
  try {
    var clustersJson = await Clusters.get(tenantObj.name);
    for (var i = 0; i < clustersJson.length; i++) {
      if (clustersJson[i]._id) { delete clustersJson[i]._id; }
      clustersJson[i].tenant = tenantObj;
      await db.clusters.insert(clustersJson[i]).then(function(insertedCluster) {
        clusterArray.push(insertedCluster);
      });
    }
    console.log('Loaded Clusters\n');
  }
  catch (e) {
    console.log(e);
  }

  // load billing
  try {
    var schemesJson = await Schemes.get(tenantObj.name);
    for (var i = 0; i < schemesJson.length; i++) {
      if (schemesJson[i]._id) { delete schemesJson[i]._id; }
      schemesJson[i].tenant = tenantObj;

      schemesJson[i].clusters.forEach(function(cluster) {
        var temp_cluster = getClusterFromName(cluster.name, clusterArray);
        //console.log("temp cluster"); console.log(cluster.name); console.log(temp_cluster);
        if(!temp_cluster) {
          console.log("################ no cluster found " + cluster.name + "   #############");
        }
        cluster._id = temp_cluster._id;
        cluster.thumbnail = temp_cluster.thumbnail;
        // order_num is being set from the scheme.cluster.order_num
        cluster.segmentSize = temp_cluster.cluster_details.customerPercentOfCompany;
        cluster.segmentSpend = temp_cluster.cluster_details.spendPercentOfCompany;
        cluster.avgTripsPerCust = temp_cluster.cluster_details.averageTripsPerCustomer;
        cluster.avgSpendPerTrip = temp_cluster.cluster_details.averageSpendsPerTrip;
        cluster.avgAnnualSpend = temp_cluster.cluster_details.averageAnnualSpends;
        cluster.seasonality = temp_cluster.cluster_details.seasonality;

      });

      await db.schemes.insert(schemesJson[i]);
    }
    console.log('Loaded Schemes\n');
  }
  catch (e) {
    console.log(e);
  }
}

function getClusterFromName(name, clusterArray) {
    var return_cluster = null;
    clusterArray.forEach(function(cluster) {
        if(cluster.name === name) {
            return_cluster = cluster;
        }
    });
    return return_cluster;
}

export { load };
