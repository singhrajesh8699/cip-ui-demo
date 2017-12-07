import React from 'react'


import Main from '../components/layouts/Main';
import Login from '../views/Login';

import RetentionOpportunities from '../views/reports/RetentionOpportunities';
import ClusterReports from '../views/reports/ClusterReports';
import Propensity from '../views/reports/Propensity';
import MyReports from '../views/reports/MyReports';

import MainDashboard from '../views/dataprep/Dashboard2';
import DQDashboard from '../views/dataprep/Dashboard';
import MADashboard from '../views/dashboard/MADashboard';

import Datasets from '../views/dataprep/Datasets';
import CreateDataset from '../views/dataprep/CreateDataset';
import EditDataset from '../views/dataprep/EditDataset';
import LoadDataset from '../views/dataprep/LoadDataset';

import Sources from '../views/dataprep/Sources';
import CreateSource from '../views/dataprep/CreateSource';

import Projects from '../views/dataprep/Projects';
import CreateProject from '../views/dataprep/CreateProject';
import EditProject from '../views/dataprep/EditProject';

import CustomerProfile from '../views/customers/CustomerProfile';
import Customers from '../views/customers/Customers';
import CustomerGroups from '../views/customers/CustomerGroups';

import Users from '../views/administration/Users';
import CreateUser from '../views/administration/CreateUser';
import EditUser from '../views/administration/EditUser';

import Tenants from '../views/administration/Tenants';
import CreateTenant from '../views/administration/CreateTenant';
import EditTenant from '../views/administration/EditTenant';

import Promotions from '../views/segments/Promotions';
import Pricing from '../views/segments/Pricing';
import Productaffinity from '../views/segments/Productaffinity';
import Overview from '../views/segments/Overview';
import SegmentationDetails from '../views/segments/SegmentationDetails1';
// import SegmentationDetails from '../views/segments/SegmentationDetails';
import SegmentDetails from '../views/segments/SegmentDetails';
import ClusterDetails from '../views/segments/ClusterProfile';
import CustomerFeedback from '../views/segments/CustomerFeedback';
import SalesReports from '../views/segments/SalesReports';

import { Auth, auth } from '../views/Auth';

import { Route, Router, IndexRedirect, IndexRoute, browserHistory} from 'react-router';

import SessionManager from '../components/common/SessionManager';

function requireAuth(nextState, replace) {
  if (!auth.loggedIn()) {
    replace({
      pathname: '/login',
      state: { nextPathname: nextState.location.pathname }
    })
  }
}

function isUserLoggedIn(nextState, replace) {
	const sessionManager = SessionManager.instance;
	if (!sessionManager.isUserLoggedIn()) {
    replace({
      pathname: '/login',
      state: { nextPathname: nextState.location.pathname }
    })
  }
	else {
		const user = sessionManager.getUser();
		if(user.sa_user && !user.tenant) {
			replace({
	      pathname: '/login',
	      state: { nextPathname: nextState.location.pathname }
	    })
		}
	}
}

function redirectToDashboardIfLoggedIn(nextState, replace) {
  console.log('here?');
	const sessionManager = SessionManager.instance;
  console.log(sessionManager.isUserLoggedIn());
	if (sessionManager.isUserLoggedIn()) {
		let user = sessionManager.getUser();
		if(user.sa_user && user.tenant) {
			replace({
	      pathname: '/dataprep/main_dashboard',
	      state: { nextPathname: nextState.location.pathname }
	    })
		}
		else if(!user.sa_user) {
      if(user.da_user || user.dx_user) {
        replace({
          pathname: '/dataprep/dq_dashboard',
          state: { nextPathname: nextState.location.pathname }
        })
      }
      else {
  	    replace({
  	      pathname: '/dataprep/main_dashboard',
  	      state: { nextPathname: nextState.location.pathname }
  	    })
      }
		}
  }
}

export default (
  <Router history={browserHistory}>
    <Route path='/' onEnter={requireAuth}/>
    <IndexRoute component={Main} />
    <Route path='/app' component={Main}>
      <IndexRedirect to="/dataprep/main_dashboard"/>
      <Route path="/reports/retentionopportunities" component={RetentionOpportunities} onEnter={isUserLoggedIn}></Route>
      <Route path="/reports/clusterreports" component={ClusterReports} onEnter={isUserLoggedIn}></Route>
      <Route path="/reports/propensity" component={Propensity} onEnter={isUserLoggedIn}></Route>
      <Route path="/reports/myreports" component={MyReports} onEnter={isUserLoggedIn}></Route>

      <Route path="/dataprep/main_dashboard" component={MainDashboard} onEnter={isUserLoggedIn}></Route>
      <Route path="/dataprep/dq_dashboard" component={DQDashboard} onEnter={isUserLoggedIn}></Route>
			<Route path="/dataprep/sources" component={Sources} onEnter={isUserLoggedIn}></Route>
			<Route path="/dataprep/createsource" component={CreateSource} onEnter={isUserLoggedIn}></Route>

      <Route path="/dataprep/datasets" component={Datasets} onEnter={isUserLoggedIn}></Route>
      <Route path='/dataprep/datasets/:id' component={LoadDataset} onEnter={isUserLoggedIn}></Route>
      <Route path='/dataprep/createdataset' component={CreateDataset} onEnter={isUserLoggedIn}></Route>
      <Route path='/dataprep/editdataset/:id' component={EditDataset} onEnter={isUserLoggedIn}></Route>

			<Route path="/dataprep/projects" component={Projects} onEnter={isUserLoggedIn}></Route>
			<Route path='/dataprep/createproject' component={CreateProject} onEnter={isUserLoggedIn}></Route>
      <Route path='/dataprep/editproject/:id' component={EditProject} onEnter={isUserLoggedIn}></Route>

      <Route path='/customers/profile' component={CustomerProfile} onEnter={isUserLoggedIn}></Route>
      <Route path='/customers/groups' component={CustomerGroups} onEnter={isUserLoggedIn}></Route>
      <Route path='/customers/search/:id' component={Customers} onEnter={isUserLoggedIn}></Route>

			<Route path='/admin/users' component={Users} onEnter={isUserLoggedIn}></Route>
			<Route path='/admin/createuser' component={CreateUser} onEnter={isUserLoggedIn}></Route>
      <Route path='/admin/edituser/:id' component={EditUser} onEnter={isUserLoggedIn}></Route>

			<Route path='/admin/tenants' component={Tenants} onEnter={isUserLoggedIn}></Route>
			<Route path='/admin/createtenant' component={CreateTenant} onEnter={isUserLoggedIn}></Route>
      <Route path='/admin/edittenant/:id' component={EditTenant} onEnter={isUserLoggedIn}></Route>

      <Route path='/segments/ma_dashboard' component={MADashboard} onEnter={isUserLoggedIn}></Route>
      <Route path='/segments/overview' component={Overview} onEnter={isUserLoggedIn}></Route>
      <Route path='/segments/segmentationDetails/:id' component={SegmentationDetails} onEnter={isUserLoggedIn}></Route>
      <Route path='/segments/segmentdetails/:id' component={SegmentDetails} onEnter={isUserLoggedIn}></Route>
			<Route path='/segments/clusterdetails/:id' component={ClusterDetails} onEnter={isUserLoggedIn}></Route>
      <Route path='/segments/promotions' component={Promotions} onEnter={isUserLoggedIn}></Route>
      <Route path='/segments/pricing' component={Pricing} onEnter={isUserLoggedIn}></Route>
			<Route path='/segments/productaffinity' component={Productaffinity} onEnter={isUserLoggedIn}></Route>
      <Route path='/segments/customerfeedback' component={CustomerFeedback} onEnter={isUserLoggedIn}></Route>
			<Route path='/segments/salesreports' component={SalesReports} onEnter={isUserLoggedIn}></Route>
    </Route>
    <Route path='/login' component={Login} onEnter={redirectToDashboardIfLoggedIn} />
  </Router>
);
