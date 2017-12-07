import React from 'react';
import { Link, withRouter } from 'react-router';
import { Dropdown } from 'react-bootstrap';
import { smoothlyMenu } from '../layouts/Helpers';

import SessionManager from './SessionManager';

@withRouter
class TopHeader extends React.Component {

    constructor(props) {
      super(props);
    }

    toggleNavigation(e) {
        e.preventDefault();
        $("body").toggleClass("mini-navbar");
        smoothlyMenu();
    }

    logout() {
      const sessionManager = SessionManager.instance;
      sessionManager.logout();
      this.props.router.push('/login');
    }

		switchTenant() {
			const sessionManager = SessionManager.instance;
			var user = sessionManager.getUser();
			delete user.tenant;
			sessionManager.setSession(sessionManager.getToken(), user);
			this.props.router.push('/login');
		}

    render() {
        return (
          <div className="row border-bottom">
              <nav className="navbar navbar-static-top white-bg" role="navigation" style={{marginBottom: 0}}>
                  <div className="navbar-header">
                      <a className="navbar-minimalize minimalize-styl-2 btn btn-primary " onClick={this.toggleNavigation} href="#"><i className="fa fa-bars"></i> </a>
                  </div>
                  <div className="navbar-header">
                      <img className="navbar-minimalize" style={{padding: '15px 6px'}} src='/img/logo.png' alt='DataXylo' width='120' />
                  </div>

                  <ul className="nav navbar-top-links navbar-right">
                      <li>
                          <a onClick={::this.logout}>
                              <i className="fa fa-sign-out"></i> Log out
                          </a>
                      </li>
                  </ul>
              </nav>
          </div>
        )
    }
}

export default TopHeader
