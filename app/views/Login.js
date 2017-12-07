import React from 'react';
import { Link, withRouter } from 'react-router';

import * as XyloFetch from '../components/common/XyloFetch';
import SessionManager from '../components/common/SessionManager';
import * as serverURLs from '../components/common/UrlConstants';
import { auth } from './Auth';

@withRouter
class Login extends React.Component {

  state = {
    uname: '',
    pswd: '',
		// uname: 'admin@dataxylo.com',
    // pswd: 'dx_admin@2016',
    loginErrorMsg: null,
    showTenantList: false,
    tenantsListArray: []
  };

  constructor(props) {
    super(props);
  }

  back(e) {
    e.preventDefault();
    e.stopPropagation();
    this.props.router.goBack();
  }

  componentWillMount(){
    document.body.classList.add('gray-bg');
		const sessionManager = SessionManager.instance;

		if(sessionManager.isUserLoggedIn()) {
			const user = sessionManager.getUser();
			if(user.sa_user && !user.tenant) {
				this.getTenants();
				this.setState({showTenantList: true});
			}
		}
  }

  componentWillUnmount(){
    document.body.classList.remove('gray-bg');
  }


  validateForm(e) {
    e.preventDefault();
		let self = this;
    XyloFetch.login(this.state.uname, this.state.pswd)
    .then( response => {
      if(response.status.statusCode === 0) {
        const sessionManager = SessionManager.instance;
        sessionManager.setSession(response.payload.token, response.payload.user);
        // this.isSuperUser(response.payload.user.sa_user);
				self.isSuperUser(response.payload.user.sa_user)
      }
      else{
        this.setState({ loginErrorMsg: 'Invalid Login credentials' });
      }
    });
  }

  login() {
    auth.login();
		const sessionManager = SessionManager.instance;
    console.log(sessionManager.getUser());
		if(sessionManager.getUser().da_user ||
      sessionManager.getUser().dx_user) {
  		this.props.router.push(`/dataprep/dq_dashboard`);
		}
		else {
	    this.props.router.push(`/dataprep/main_dashboard`);
		}
  }

  /* Function to check whether user is super admin.
  * If yes -> Make API call to get tenants list
  * If No -> Navigate to teh dashboard page.
  */
  isSuperUser(is_sa_user) {
    console.log("is user admin: "+is_sa_user);
    this.baseURL = serverURLs.BASE_URL;
    if(is_sa_user === true) {
      this.getTenants();
    } else {
      this.login();
    }
  }

  /* Function makes API call to get tenants list */
  getTenants() {
    XyloFetch.getTenants()
    .then(response => {
      this.setState({showTenantList: true, tenantsListArray: response.payload});
      console.log(response.payload);
    })
  }

  /* Function is called when tenant is selected.
  * The selected tenant is set to the user in local storage
  */
  onTenantClicked(tenant) {
    const sessionManager = SessionManager.instance;
    var user = sessionManager.getUser();
    user.tenant = tenant;
    sessionManager.setSession(sessionManager.getToken(), user);
    this.login();
  }

  /** Function to update state of username */
  updateStateUname(e) {
    this.setState({ uname: e.target.value });
  }

  /** Function to update state of username */
  updateStatePswd(e) {
    this.setState({pswd: e.target.value});
  }

  render() {
    var errorDiv;
    if (this.state.loginErrorMsg) {
      errorDiv =
        <div className="alert alert-danger">
          {this.state.loginErrorMsg}
        </div>;
    }
    return (
      <div className="middle-box text-center loginscreen animated fadeInDown">
        <div>
            <div>
                <h1 className="logo-name">ZAP</h1>
            </div>

            <h3>DataXylo</h3>
            <p>Zylo Analytics Platform</p>

						{
              (() => {
                if(this.state.showTenantList === false) {
                  return (
				            <form className="m-t" role="form" action="index.html">
				                <div className="form-group">

				                    <input type="email" className="form-control" placeholder="Username" required=""
				                        value={this.state.uname} onChange={::this.updateStateUname} />
				                </div>
				                <div className="form-group">

				                   <input type="password" className="form-control" placeholder="Password" required=""
				                        value={this.state.pswd} onChange={::this.updateStatePswd} />
				                </div>
				                <button type="submit" onClick={::this.validateForm} className="btn btn-primary block full-width m-b">Login</button>

				                {errorDiv}

				            </form>
									)
								}
								else{
									return (
										<div style={{padding: 25, paddingTop: 0, paddingBottom: 0, margin: 'auto', marginBottom: 25, marginTop: 25}}>
	                                  <div className="row">
	                                    <div className="col-sm-1"></div>
	                                    <div  className="col-xs-12 col-sm10" style={{padding: 20}}>
	                                      <h3>Login As</h3>
	                                      <table responsive striped hover bordered className="login-tenant-table">
	                                        <tbody>
	                                          {
	                                            this.state.tenantsListArray.map(function(item) {
	                                              let imgurl = serverURLs.BASE_URL + '/logos/' + item.logo;
	                                              return (
	                                                <tr key={item._id}
																											onClick={::this.onTenantClicked.bind(this, item)}
																											className="tenant-row-login"
																											style={{cursor: 'pointer'}}>
	                                                  <td className='login-tenantlist-table-td' style={{textAlign: "left", width: 80}}>
	                                                    <span className='login-tenantlist-image-span'>
	                                                      <img src={imgurl} className='login-tenantlist-image' />
	                                                    </span>
																										</td>
																										<td style={{textAlign: "left"}}>
	                                                    <span className='login-tenantlist-tenantname'>{item.name}</span>

	                                                    <span className='icon-nargela-arrow login-tenantlist-arrow'></span>
	                                                  </td>
	                                                </tr>
	                                              )
	                                            }.bind(this))
	                                          }
	                                        </tbody>
	                                      </table>
	                                    </div>
	                                  </div>
	                                </div>
									)
								}
							}
						)()
						}
            <p className="m-t"> <small>DataXylo &copy; 2015-2017</small> </p>
        </div>
      </div>
    );
  }

}

export default Login
