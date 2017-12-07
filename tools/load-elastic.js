import pmongo from 'promised-mongo';
import elasticsearch from 'elasticsearch';
import yesno from 'yesno';

let MONGODB_URI = 'cipui';

if (process.env.MONGODB_URI) MONGODB_URI = process.env.MONGODB_URI;

const db = pmongo(MONGODB_URI, {
  authMechanism: 'ScramSHA1'
}, ['users', 'datasets', 'sources', 'reports', 'categories', 'projects', 'hiverecords', 'alldatas', 'products']);

import * as serverURLs from '../app/components/common/UrlConstants';
var es_target = serverURLs.ES_URL;

//var es_target = 'localhost:9200';
//var es_target = 'http://1a8039f61622f3856a977dd043b220fe.us-east-1.aws.found.io:9200';

const es = new elasticsearch.Client({
  host: es_target,
  //log: 'trace'
});

yesno.ask('Are you sure you want to load elastic server at: ' + es_target,
    true, function(ok) {
      if (ok) {
        load();
      } 
      else {
        console.log('Aborting ...');
        db.close();
        process.exit();
      }
});

async function load() {

  console.log('Loading Elasticsearch');

  try {
    await es.indices.delete({index: 'companies'}).then(function(error, response) {
      if (error) { console.log('Error deleting index: companies'); }
      else { console.log('Successfully deleted index: companies')}
    });
    await es.indices.delete({index: 'products'}).then(function(error, response) {
      if (error) { console.log('Error deleting index: products'); }
      else { console.log('Successfully deleted index: products')}
    });
  }
  catch (e) {
    //console.log(e);
  }

  // Companies
  var companies;
  console.log('Loading Companies from DB ...');
  try {
    await db.alldatas.find().then(function(data){
      //console.log(data);
      //console.log(data.length);
      companies = data;
    });
  }
  catch (e) {
    console.log(e);
  }

  // Companies - indices create
  console.log('Creating Company Indices ...');
  try {
    await es.indices.create({  
      index: 'companies',
      type: 'company',
      body: {
        mappings: {
          company: {
            properties: {
              'City': {
                'type': 'string',
                'index': 'not_analyzed'
              },
              'Industry': {
                'type': 'string',
                'index': 'not_analyzed'
              },
              'Inkjet Printers Major Brand 1': { 
                'type': 'string',
                'index': 'not_analyzed'
              },
              'Laser Printers Major Brand 1': { 
                'type': 'string',
                'index': 'not_analyzed'
              },
              'XYLO Quadrant': { 
                'type': 'string',
                'index': 'not_analyzed'
              },
              'Life Time Value': { 
                'type': 'string',
                'index': 'not_analyzed'
              },
              'Usage Segmentation': { 
                'type': 'string',
                'index': 'not_analyzed'
              }
            }
          }
        }
      }
    }).then(function(error, response) {
        if (error) {
          console.log(error);
        }
        else {
          console.log(response);
        }
    });
  }
  catch (e) {
    console.log(e);
  }

  console.log('Creating Company documents in ES ...');
  try {
    for (var i = 0; i < companies.length; i++) {
      var company = companies[i];
      //console.log(typeof company._id);
      var index_id = JSON.stringify(company._id).replace(/\"/g, "");
      //console.log(index_id);
      delete company._id;
      await es.create({
          index: 'companies',
          type: 'company',
          id: index_id,
          body: company
        }).then(function(response) {
          //console.log(response);
      });
    }
    console.log('Loaded Companies');
  }
  catch (e) {
    console.log(e);
  }

  // Products
  var products;  
  console.log('Loading Products from DB ...');
  try {
    await db.products.find().then(function(data){
      //console.log(data);
      //console.log(data.length);
      products = data;
    }); 
  }
  catch (e) {
    console.log(e);
  }

  // Products - indices create
  console.log('Creating Product Indices ...');
  try {
    await es.indices.create({  
      index: 'products',
      type: 'product',
      body: {
        mappings: {
          product: {
            properties: {
              'MANUFACTURER_NAME': {
                'type': 'string',
                'index': 'not_analyzed'
              },
              'MANUFACTURER_NUMBER': {
                'type': 'string',
                'index': 'not_analyzed'
              },
              'PRODUCT_CATEGORY': {
                'type': 'string',
                'index': 'not_analyzed'
              }
            }
          }
        }
      }
    }).then(function(error, response) {
        if (error) {
          console.log(error);
        }
        else {
          console.log(response);
        }
    });
  }
  catch (e) {
    console.log(e);
  }

  // Products - create documents
  console.log('Creating Product documents in ES ...');
  try {
    for (var i = 0; i < products.length; i++) {
      var product = products[i];
      //console.log(typeof product._id);
      var index_id = JSON.stringify(product._id).replace(/\"/g, "");
      //console.log(index_id);
      delete product._id;
      await es.create({
          index: 'products',
          type: 'product',
          id: index_id,
          body: product
        }).then(function(response) {
          //console.log(response);
      });
    } 
    console.log('Loaded Products');
  }
  catch (e) {
    console.log(e);
  }

  console.log('Successfully finished loading elastic-search');

  db.close();
  process.exit();
}



// client.ping({
//   // ping usually has a 3000ms timeout
//   requestTimeout: Infinity,

//   // undocumented params are appended to the query string
//   hello: "elasticsearch!"
// }, function (error) {
//   if (error) {
//     console.trace('elasticsearch cluster is down!');
//   } else {
//     console.log('All is well');
//   }
// });
