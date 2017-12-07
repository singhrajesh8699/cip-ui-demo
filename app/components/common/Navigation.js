import React, { Component } from 'react';
import { Dropdown } from 'react-bootstrap';
import { Link, Location, withRouter } from 'react-router';

import * as serverURLs from './UrlConstants';
var baseURL = serverURLs.BASE_URL;
import SessionManager from './SessionManager';

@withRouter
class Navigation extends Component {

    componentDidMount() {
        const { menu } = this.refs;
        $(menu).metisMenu({toggle: false});
    }

    activeRoute(routeName) {
        return this.props.location.pathname.indexOf(routeName) > -1 ? "active" : "";
    }

    secondLevelActive(routeName) {
        return this.props.location.pathname.indexOf(routeName) > -1 ? "nav nav-second-level collapse in" : "nav nav-second-level collapse";
    }

		switchTenant() {
			const sessionManager = SessionManager.instance;
			var user = sessionManager.getUser();
			delete user.tenant;
			sessionManager.setSession(sessionManager.getToken(), user);
			this.props.router.push('/login');
		}

    render() {
			const sessionManager = SessionManager.instance;
			const currentUser = sessionManager.getUser();
			const tenantLogo = baseURL + "/logos/" + currentUser.tenant.logo;
      var tenantLogoBG = 'none';
      if (currentUser.tenant.name === 'tenant2') {
        tenantLogoBG = '#e4e4e6';
      }
      var img_url = baseURL + "/logos/" + currentUser.thumbnail;
			var userType = '';
			if(currentUser.ma_user) {
				userType = 'Marketing Admin';
			}
			else if(currentUser.da_user) {
				userType = 'Data Admin';
			}
			else if(currentUser.dx_user) {
				userType = 'Tenant Admin';
			}
			else if(currentUser.sa_user) {
				userType = 'DataXylo Admin';
			}
			const user = sessionManager.getUser();
		    return (
          <nav className="navbar-default navbar-static-side" role="navigation">
            <ul className="nav metismenu" id="side-menu" ref="menu">
              <li className="nav-header" style={{padding: '20px 30px 10px'}}>
                <div className="dropdown profile-element "> <span>
                  <img alt="image" className="img-circle" src={img_url} width='75' height='75' />
                 </span>
                    

                      { (() => {

                        if(user.sa_user) {
                          return (
                          <div>
                            <a data-toggle="dropdown" className="dropdown-toggle" href="#">
                              <span className="clear"> <span className="block m-t-xs"> <strong className="font-bold">{currentUser.name}</strong>
                               </span>
                              <span className="text-muted text-xs block">{userType}<b className="caret"></b></span> </span> 
                            </a>
                            <ul className="dropdown-menu m-t-xs">
                              <li>
                                  <a onClick={::this.switchTenant}>
                                      <i className="fa fa-random"></i> Switch Tenant
                                  </a>
                              </li>
                            </ul>
                          </div>
                          )
                        }
                        else {
                          return (
                            <div>
                            <a data-toggle="dropdown" className="dropdown-toggle" href="#">
                             <span className="clear"> <span className="block m-t-xs"> <strong className="font-bold">{currentUser.name}</strong>
                               </span>
                              <span className="text-muted text-xs block">{userType}</span></span>
                            </a>
                            </div>
                          )
                        }
                        
                      })()
                    }

                </div>
                <div className="logo-element">
                  ZAP
                </div>
              </li>

              <li className="nav-header profile-element" style={{padding: '10px 30px 10px'}}>
                <div>
                  <span>
                    <img alt="image" src={tenantLogo}  style={{backgroundColor: tenantLogoBG}} alt='DataXylo' width='160' height='60' />
                 </span>
                </div>
              </li>

               <li className="active">
                <a Link to="index.html"><i className="fa fa-dashboard"></i> <span className="nav-label">Reports</span> <span className="fa arrow"></span></a>
                <ul className="nav nav-second-level collapse">
                   { (() => {
                        if(!user.da_user) {
                          return (<li><Link to="/dataprep/main_dashboard">Business Health</Link></li>)
                        }
                      })()
                    }
                    { (() => {
                        if(!user.ma_user) {
                          return (<li><Link to="/dataprep/dq_dashboard">Data Health</Link></li>)
                        }
                      })()
                    }
                    {/*
                      <li><Link to="/reports/retentionopportunities">Retention Opportunities</Link></li>
                      <li><Link to="/reports/clusterreports">Cluster Reports</Link></li>
                      <li><Link to="/reports/propensity">Propensity</Link></li>
                      <li><Link to="/reports/myreports">My Reports</Link></li>
                    */}
                </ul>
              </li>

							{
                (() => {
									if(!user.ma_user) {
										return (<li className="active">
											<a Link to="index.html"><i className="fa fa-cogs"></i> <span className="nav-label">Data Prep</span> <span className="fa arrow"></span></a>
											<ul className="nav nav-second-level collapse">
												{/* <li><Link to="/dataprep/dq_dashboard">Data Quality</Link></li> */}
												<li><Link to="/dataprep/sources">Sources</Link></li>
												<li><Link to="/dataprep/datasets">Datasets</Link></li>
												<li><Link to="/dataprep/projects">Projects</Link></li>
												{/* <li><Link to="/dataprep/combine">Combine</Link></li> */}
											</ul>
										</li>)
									}
								})()
							}

              {
                (() => {
                  if(!user.da_user) {
                    return(
                      <li className="active">
                        <a Link to="index.html"><i className="fa fa-th-large"></i> <span className="nav-label">C-Metrics</span> <span className="fa arrow"></span></a>
                        <ul className="nav nav-second-level collapse">
                            <li><Link to="/segments/ma_dashboard">Dashboard</Link></li>
                            <li><Link to="/segments/segmentationDetails/default">Clusters</Link></li>
                            <li className="active">
                              <a href="#">Zylo Lens <span className="fa arrow"></span></a>
                              <ul className="nav nav-third-level">
                                <li><Link to="/segments/salesreports">Sales</Link></li>
                                <li><Link to="/segments/promotions">Promotions</Link></li>
                                <li><Link to="/segments/pricing">Pricing</Link></li>
        												<li><Link to="/segments/productaffinity">Product Affinity</Link></li>
                                <li><Link to="/segments/customerfeedback">Customer Feedback</Link></li>
                              </ul>
                          </li>
                        </ul>
                      </li>)
                  }
                })()
              }


              {
                (() => {
                  if(!user.da_user) {
                    return(
                      <li className="active">
                        <a Link to="index.html"><i className="fa fa-users"></i> <span className="nav-label">C-360</span> <span className="fa arrow"></span></a>
                        <ul className="nav nav-second-level collapse">
                          <li><Link to="/customers/groups">Customer Groups</Link></li>
                          <li><Link to="/customers/profile">Customer Profile</Link></li>
                        </ul>
                      </li>)
                  }
                })()
              }

              {/*
              <li>
                <Link to="/dataprep/my_dashboard"><span className="nav-label"><i className="fa fa-file-text-o"></i>My Dashboard</span></Link>
              </li>
              <li>
                <Link to="/dataprep/my_reports"><span className="nav-label"><i className="fa fa-bar-chart-o"></i>My Reports</span></Link>
              </li>
              */}

              {
                (() => {
                  if(user.sa_user) {
                    return (
                      <li className="active">
                        <a Link to="index.html"><i className="fa fa-unlock-alt"></i> <span className="nav-label">Administration</span> <span className="fa arrow"></span></a>
                        <ul className="nav nav-second-level collapse">
                          <li><Link to="/admin/users">Users</Link></li>
                          <li><Link to="/admin/tenants">Tenants</Link></li>
                        </ul>
                      </li>
                    )
                  }
                })()
              }
            </ul>
          </nav>
        )
    }
}

export default Navigation
