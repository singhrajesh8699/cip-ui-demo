// var getUrl = window.location;
// var baseURL = getUrl .protocol + "//" + getUrl.host
import React from 'react';
import * as serverURLs from './UrlConstants';
import SessionManager from './SessionManager';
var baseURL = serverURLs.BASE_URL;

import 'whatwg-fetch';

function getCurrentTenantId() {
  var sessionManager = SessionManager.instance;
  var tenant_id = sessionManager.getUser().tenant._id;
  return tenant_id;
}

function getCategories() {
  var tenantId = getCurrentTenantId();
  return fetch(baseURL + '/dataxylo/v1/categoriestenant/',
  {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      "Content-Type": "application/json",
      api_key: 'dj123rouv13yro',
      tenantID: tenantId
    }
  }).then(function(response) {
    return response.json();
  });
}

function getAllSources() {
  var tenantId = getCurrentTenantId();
  return fetch(baseURL + '/dataxylo/v1/sourcestenant/',
  {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      "Content-Type": "application/json",
      api_key: 'dj123rouv13yro',
      tenantID: tenantId
    }
  }).then(function(response) {
    return response.json();
  });
}

function getAllProductCategories() {
  var tenantId = getCurrentTenantId();
  return fetch(baseURL + '/dataxylo/v1/productcategoriestenant/',
  {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      "Content-Type": "application/json",
      api_key: 'dj123rouv13yro',
      tenantID: tenantId
    }
  }).then(function(response) {
    return response.json();
  });
}

function getAllSegments() {
  var tenantId = getCurrentTenantId();
  return fetch(baseURL + '/dataxylo/v1/segmentstenant/',
  {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      "Content-Type": "application/json",
      api_key: 'dj123rouv13yro',
      tenantID: tenantId
    }
  }).then(function(response) {
    return response.json();
  });
}

function deleteSource(id){
  let url = baseURL + '/dataxylo/v1/sources/' + id;
  return fetch(url, {
      method: 'DELETE',
      headers: {
      'Content-Type': 'application/json',
    }
  })
    .then(function(response) {
    return response.json();
  }).catch(function(err) {
    console.log(err);
  });
}

function getAllDatasets() {
  var tenantId = getCurrentTenantId();
  return fetch(baseURL + '/dataxylo/v1/datasetstenant/',
  {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      "Content-Type": "application/json",
      api_key: 'dj123rouv13yro',
      tenantID: tenantId
    }
  }).then(function(response) {
    return response.json();
  });
}

function getAllProjects() {
  var tenantId = getCurrentTenantId();
  return fetch(baseURL + '/dataxylo/v1/projectstenant/',
  {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      "Content-Type": "application/json",
      api_key: 'dj123rouv13yro',
      tenantID: tenantId
    }
  }).then(function(response) {
    return response.json();
  });
}

function getDataset(id) {
  return fetch(baseURL + '/dataxylo/v1/datasets/' + id, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      "Content-Type": "application/json",
      api_key: 'dj123rouv13yro'
    },
  }).then(function(response) {
    return response.json();
  }).catch(function(err) {
    console.log(err);
  });
}

function postDataset(dataset){
  var tenantId = getCurrentTenantId();
  let url = baseURL + '/dataxylo/v1/datasets';
  console.log("logging dataset in fetch");
  console.log(dataset);
  var sessionManager = SessionManager.instance;
  const token = 'Bearer ' + sessionManager.getToken();
  return fetch(url,
  {
    method: 'POST',
    headers: {
    'authorization': token,
    'Content-Type': 'application/json',
    'tenantID': tenantId
    },
    body: JSON.stringify(dataset)
  })
  .then(function(response) {
    return response.json();
  }).catch(function(err) {
    console.log(err);
  });
}

function editDataset(id, dataset){
    let url = baseURL + '/dataxylo/v1/datasets/'+id;
    console.log("logging dataset in edit");
    console.log(dataset);
    return fetch(url,
    {
        method: 'PUT',
        headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dataset)})
    .then(function(response) {
    return response.json();
  }).catch(function(err) {
    console.log(err);
  });
}

function publishDataset(id){
  let url = baseURL + '/dataxylo/v1/datasets/publish/' + id;
  return fetch(url,
    {
      method: 'PUT',
      headers: {
      'Content-Type': 'application/json',
    }
  })
  .then(function(response) {
    return response.json();
  }).catch(function(err) {
    console.log(err);
  });
}


function unpublishDataset(id){
  let url = baseURL + '/dataxylo/v1/datasets/unpublish/' + id;
  return fetch(url,
    {
      method: 'PUT',
      headers: {
      'Content-Type': 'application/json',
    }
  })
  .then(function(response) {
  return response.json();
  }).catch(function(err) {
    console.log(err);
  });
}

function deleteDataset(id){
  let url = baseURL + '/dataxylo/v1/datasets/' + id;
  console.log("logging dataset in delete");
  console.log(id);
  return fetch(url, {
      method: 'DELETE',
      headers: {
      'Content-Type': 'application/json',
    }
  })
    .then(function(response) {
    return response.json();
  }).catch(function(err) {
    console.log(err);
  });
}

function getProject(id) {
  return fetch(baseURL + '/dataxylo/v1/projects/' + id, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      "Content-Type": "application/json",
      api_key: 'dj123rouv13yro'
    },
  }).then(function(response) {
    return response.json();
  }).catch(function(err) {
    console.log(err);
  });
}

function postProject(project){
  var tenantId = getCurrentTenantId();
  let url = baseURL + '/dataxylo/v1/projects';
    console.log("logging project in fetch");
    console.log(project);
    return fetch(url,
      {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        tenantID: tenantId
       },
        body: JSON.stringify(project)})
    .then(function(response) {
    return response.json();
  }).catch(function(err) {
    console.log(err);
  });
}


function editProject(id, project){
     let url = baseURL + '/dataxylo/v1/projects/' + id;
    console.log("logging project in edit");
    console.log(project);
    return fetch(url,
    {
        method: 'PUT',
        headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(project)})
    .then(function(response) {
    return response.json();
  }).catch(function(err) {
    console.log(err);
  });
}

function deleteProject(id){
     let url = baseURL + '/dataxylo/v1/projects/' + id;
    console.log("logging project in delete");
    console.log(id);
    return fetch(url, {
        method: 'DELETE',
        headers: {
        'Content-Type': 'application/json',
      }
  })
    .then(function(response) {
    return response.json();
  }).catch(function(err) {
    console.log(err);
  });
}

function splitColumn(id, column){
    let url = baseURL + '/dataxylo/v1/datasets/split/' + id + '/' + column;
    var sessionManager = SessionManager.instance;
    const token = 'Bearer ' + sessionManager.getToken();
    return fetch(url,
    {
        method: 'PUT',
        headers: {
        'Content-Type': 'application/json',
            'authorization': token
      }})
    .then(function(response) {
    return response.json();
  }).catch(function(err) {
    console.log(err);
  });
}


function columnTrimSpaces(id, column){
    let url = baseURL + '/dataxylo/v1/datasets/trim/' + id + '/' + column;
    var sessionManager = SessionManager.instance;
    const token = 'Bearer ' + sessionManager.getToken();
    return fetch(url,
    {
        method: 'PUT',
        headers: {
        'Content-Type': 'application/json',
            'authorization': token
      }})
    .then(function(response) {
    return response.json();
  }).catch(function(err) {
    console.log(err);
  });
}

function mergeColumns(id, columns){
    let url = baseURL + '/dataxylo/v1/datasets/merge/' + id;
    var sessionManager = SessionManager.instance;
    const token = 'Bearer ' + sessionManager.getToken();
    console.log('setting token to ' + token);
    return fetch(url,
    {
        method: 'PUT',
        headers: {
        'Content-Type': 'application/json',
            'authorization': token
      },
      body: JSON.stringify(columns)})
    .then(function(response) {
    return response.json();
  }).catch(function(err) {
    console.log(err);
  });
}

function getAllData() {
    return fetch(baseURL + '/dataxylo/v1/alldata/',
    {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            "Content-Type": "application/json",
            api_key: 'dj123rouv13yro'
        }
    }).then(function(response) {
        return response.json();
    });
}

function getData(id) {
  return fetch(baseURL + '/dataxylo/v1/alldata/' + id, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      "Content-Type": "application/json",
      api_key: 'dj123rouv13yro'
    },
  }).then(function(response) {
    return response.json();
  }).catch(function(err) {
    console.log(err);
  });
}

function getTenants() {
  return fetch(baseURL + '/dataxylo/v1/tenants', {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      "Content-Type": "application/json",
      api_key: 'dj123rouv13yro'
    },
  }).then(function(response) {
    return response.json();
  }).catch(function(err) {
    console.log(err);
  });
}

function postTenant(data){
  let url = baseURL + '/dataxylo/v1/tenants';
    return fetch(url,
    {
        method: 'POST',
        body: data
    })
    .then(function(response) {
    return response.json();
  }).catch(function(err) {
    console.log(err);
  });
}

function editTenant(data, id){
  let url = baseURL + '/dataxylo/v1/tenants/'+id;
    return fetch(url,
    {
        method: 'PUT',
        headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)})
    .then(function(response) {
    return response.json();
  }).catch(function(err) {
    console.log(err);
  });
}

function getTenant(id) {
  return fetch(baseURL + '/dataxylo/v1/tenants/' + id, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      "Content-Type": "application/json",
      api_key: 'dj123rouv13yro'
    },
  }).then(function(response) {
    return response.json();
  }).catch(function(err) {
    console.log(err);
  });
}

function deleteTenant(id){
    let url = baseURL + '/dataxylo/v1/tenants/' + id;
    return fetch(url, {
        method: 'DELETE',
        headers: {
        'Content-Type': 'application/json',
      }
  })
    .then(function(response) {
    return response.json();
  }).catch(function(err) {
    console.log(err);
  });
}

function getUsers() {
  return fetch(baseURL + '/dataxylo/v1/users', {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      "Content-Type": "application/json",
      api_key: 'dj123rouv13yro'
    },
  }).then(function(response) {
    return response.json();
  }).catch(function(err) {
    console.log(err);
  });
}

function deleteUser(id){
    let url = baseURL + '/dataxylo/v1/user/' + id;
    return fetch(url, {
        method: 'DELETE',
        headers: {
        'Content-Type': 'application/json',
      }
  })
    .then(function(response) {
    return response.json();
  }).catch(function(err) {
    console.log(err);
  });
}

function addTenantUser(data, tenantid){
  let url = baseURL + '/dataxylo/v1/auth/adduser/' + tenantid;
    return fetch(url,
    {
        method: 'POST',
      body: data
    })
    .then(function(response) {
    return response.json();
  }).catch(function(err) {
    console.log(err);
  });
}

/*C-360*/
function getC360(dataset) {
  return fetch(baseURL + '/dataxylo/v1/customergroups', {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      "Content-Type": "application/json",
      api_key: 'dj123rouv13yro'
    },
    body: JSON.stringify(dataset)
  }).then(function(response) {
    return response.json();
  }).catch(function(err) {
    console.log(err);
  });
}

function postC360(dataset) {
  return fetch(baseURL + '/dataxylo/v1/customergroups', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      "Content-Type": "application/json",
      api_key: 'dj123rouv13yro'
    },
    body: JSON.stringify(dataset)
  }).then(function(response) {
    return response.json();
  }).catch(function(err) {
    console.log(err);
  });
}

function getCustomerGroups() {
  return fetch(baseURL + '/dataxylo/v1/customergroups', {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      "Content-Type": "application/json",
      api_key: 'dj123rouv13yro'
    },
  }).then(function(response) {
    return response.json();
  }).catch(function(err) {
    console.log(err);
  });
}

function queryC360(dataset) {
  return fetch(baseURL + '/dataxylo/v1/customergroups/query', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      "Content-Type": "application/json",
      api_key: 'dj123rouv13yro'
    },
    body: JSON.stringify(dataset)
  }).then(function(response) {
    return response.json();
  }).catch(function(err) {
    console.log(err);
  });
}

function login(email, pass) {
    let url = baseURL + '/dataxylo/v1/auth/login';
    return fetch(url,
    {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
      },
        body: JSON.stringify({email: email, password: pass})
    })
    .then(function(response) {
    return response.json();
  }).catch(function(err) {
    console.log(err);
  });
}

function getUser(id) {
  return fetch(baseURL + '/dataxylo/v1/user/' + id, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      "Content-Type": "application/json",
      api_key: 'dj123rouv13yro'
    },
  }).then(function(response) {
    return response.json();
  }).catch(function(err) {
    console.log(err);
  });
}

function editUser(data, id){
  let url = baseURL + '/dataxylo/v1/user/'+id;
    return fetch(url,
    {
        method: 'PUT',
        headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)})
    .then(function(response) {
    return response.json();
  }).catch(function(err) {
    console.log(err);
  });
}

function getXyloLogs(id) {
  return fetch(baseURL + '/dataxylo/v1/xylologs', {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      "Content-Type": "application/json",
    },
  }).then(function(response) {
    return response.json();
  }).catch(function(err) {
    console.log(err);
  });
}

function getSchemes() {
  return fetch(baseURL + '/dataxylo/v1/schemes', {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      "Content-Type": "application/json",
    },
  }).then(function(response) {
    return response.json();
  }).catch(function(err) {
    console.log(err);
  });
}

function getSchemeDetails(id) {
  return fetch(baseURL + '/dataxylo/v1/schemes/' + id, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      "Content-Type": "application/json",
    },
  }).then(function(response) {
    return response.json();
  }).catch(function(err) {
    console.log(err);
  });
}

export { getCategories, getAllProductCategories, getAllSegments, getAllSources, deleteSource, getAllDatasets, getAllProjects, getProject, getDataset, postDataset, editDataset, publishDataset, unpublishDataset, deleteDataset, postProject, editProject, deleteProject, splitColumn, columnTrimSpaces, mergeColumns, getAllData, getData, getTenants, postTenant, getTenant, editTenant, deleteTenant, getUsers, getUser, editUser, deleteUser, addTenantUser, getC360, postC360, getCustomerGroups, queryC360, login, getXyloLogs, getSchemes, getSchemeDetails};
