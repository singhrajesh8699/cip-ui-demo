import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { withRouter } from 'react-router';
import { Route, Router, IndexRedirect, Link, browserHistory} from 'react-router';
import Moment from 'moment';

import * as _ from "lodash";

import * as serverURLs from '../../components/common/UrlConstants';
import SessionManager from '../../components/common/SessionManager';

class CustomersHeader extends Component {
  render() {
    return (
      <div className="col-lg-10">
        <div className='xylo-page-header'>
          <h2>Products</h2>
          <ol className="breadcrumb">
              <li>
                  <a href="index.html">Customers</a>
              </li>
              <li>
                  <a><b>Customer Profile</b></a>
              </li>
          </ol>
        </div>
      </div>
    );
  }
}

class CustomerBasicInfo extends Component {
  render() {
    return (
      <div>
        <table className="table table-textmiddle">
        <tbody>
          <tr>
            <td className="text-left">
              <h3><strong>John, Doe</strong></h3>
            </td>
            <td className="text-right">
              Customer Since Jun 7, 2013 (3 years)
            </td>
          </tr>
        </tbody>
        </table>
      </div>
    );
  }
}

class CustomerPersonalDetails extends Component {
  render() {
    return (
      <div>
      <table className="table table-textmiddle">
        <tbody>
          <tr>
            <td>
              <i className="fa fa-id-card-o fa-3x"></i>
            </td>
            <td>
              <i className="fa fa-circle text-navy"></i>
            </td>
            <td className="row">
              <p>
                <strong>182, Rinehart Road, Miami, FL 33128, United States</strong>
              </p>
              <p>
                Valid, Opt-out: Unknown
              </p>
            </td>
          </tr>
          <tr>
            <td>
              <i className="fa fa-envelope-o fa-3x"></i>
            </td>
            <td>
              <i className="fa fa-circle text-navy"></i>
            </td>
            <td className="row">
              <p>
                <strong>john.doe@gmail.com</strong>
              </p>
              <p>
                Valid, Opt-out: False
              </p>
            </td>
          </tr>
          <tr>
            <td>
              <i className="fa fa-phone fa-3x"></i>
            </td>
            <td>
              <i className="fa fa-circle text-danger"></i>
            </td>
            <td className="row">
              <p>
                <strong>(000) 241 - 5000</strong>
              </p>
              <p>
                Invalid, Opt-out: True
              </p>
            </td>
          </tr>
          <tr>
            <td>
              <i className="fa fa-credit-card fa-3x"></i>
            </td>
            <td>
            </td>
            <td className="row">
              <p>
                <strong>271281374</strong>
              </p>
              <p>
                Master Contact ID
              </p>
            </td>
          </tr>
        </tbody>
      </table>
      </div>
    );
  }
}

class CustomerRevenueDetails extends Component {
  render() {
    return (
      <div>
        <table className="table table-textmiddle">
        <tbody>
          <tr>
            <td>
              <div className="col-md-12">LIKELIHOOD TO BUY</div>
              <div className="col-md-12"><h3><strong>High</strong></h3></div>
            </td>
            <td>
              <div className="col-md-12">AVERAGE TRANSACTION VALUE</div>
              <div className="col-md-12"><h3><strong>$300</strong></h3></div>
            </td>
            <td>
              <div className="col-md-12">PREDICTIVE LIFETIME VALUE</div>
              <div className="col-md-12"><h3><strong>$500</strong></h3></div>
            </td>
            <td>
              <div className="col-md-12">AVERAGE DISCOUNT RATE</div>
              <div className="col-md-12"><h3><strong>5%</strong></h3></div>
            </td>
            <td>
              <div className="col-md-12">TRANSACTION FREQUENCY</div>
              <div className="col-md-12"><h3><strong>5</strong></h3></div>
              <div className="col-md-12">Per Year</div>
            </td>
          </tr>
          <tr>
            <td colSpan="2">
              <div className="col-md-12">TOTAL REVENUE</div>
              <div className="col-md-12 text-navy"><h3><strong>$4500</strong></h3></div>
              <div className="col-md-12">Total 15 Transactions</div>
            </td>
            <td colSpan="3">
              <div className="col-md-12">
                <div className="col-md-2 no-padding-lr">
                  <strong>Last 12 Months</strong>
                </div>
                <div className="col-md-2 no-padding-lr text-navy text-left">
                  <strong>$1,850</strong>
                </div>
                <div className="col-md-5 no-padding-lr">
                  <div className="progress">
                    <div className="progress-bar progress-bar-navy" role="progressbar" aria-valuenow="70" aria-valuemin="0" aria-valuemax="100" style={{width: '70%'}}>
                      <span className="sr-only">70% Complete</span>
                    </div>
                  </div>
                </div>
                <div className="col-md-3 no-padding-lr text-grey">
                  8 Transactions
                </div>
              </div>
              <div className="col-md-12">
                <div className="col-md-2 no-padding-lr">
                  <strong>12-24 Months ago</strong>
                </div>
                <div className="col-md-2 no-padding-lr text-dark-grey text-left">
                  <strong>$650</strong>
                </div>
                <div className="col-md-5 no-padding-lr">
                  <div className="progress">
                    <div className="progress-bar progress-bar-dark-grey" role="progressbar" aria-valuenow="30" aria-valuemin="0" aria-valuemax="100" style={{width: '30%'}}>
                      <span className="sr-only">30% Complete</span>
                    </div>
                  </div>
                </div>
                <div className="col-md-3 no-padding-lr text-grey">
                  3 Transactions
                </div>
              </div>
            </td>
          </tr>
          </tbody>
          </table>
      </div>
    );
  }
}

class CustomersProfile extends Component {
  render() {
    return (
      <div className="ibox float-e-margins">
        <div className="ibox-title">
          <h3>PROFILE</h3>
        </div>
        <div className="ibox-content no-padding">
          <table className="table table-borderless">
            <tbody>
              <tr>
                <td>Gender</td>
                <td>Male</td>
              </tr>
              <tr>
                <td>Preferred Coffee Type</td>
                <td>Dark Roast</td>
              </tr>
              <tr>
                <td>Facebook ID</td>
                <td>1232312</td>
              </tr>
              <tr>
                <td>Loyalty ID</td>
                <td>500</td>
              </tr>
              <tr>
                <td>Loyalty Points</td>
                <td>5600</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

class CustomerAnalytics extends Component {
  render() {
    return (
      <div className="ibox float-e-margins">
        <div className="ibox-title">
          <h3>ANALYTICS</h3>
        </div>
        <div className="ibox-content no-padding">
          <table className="table table-borderless">
            <tbody>
              <tr>
                <td>Primary Store</td>
                <td>Generic Retail Store</td>
              </tr>
              <tr>
                <td>Closest Store</td>
                <td>Generic Retail Store</td>
              </tr>
              <tr>
                <td>Primary Brand</td>
                <td>Green Mountain</td>
              </tr>
              <tr>
                <td>RFV Cluster</td>
                <td>VIP</td>
              </tr>
              <tr>
                <td>Life Stage Cluster</td>
                <td>Mom & Baby</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

class CustomerEngagements extends Component {
  render() {
    return (
      <div className="ibox float-e-margins">
        <div className="ibox-title">
          <h3>ENGAGEMENTS</h3>
        </div>
        <div className="ibox-content no-padding">
          <div className="col-md-12">
            <div className="col-md-6 text-left">
              LAST 30 DAYS & PRIOR 30 DAYS
            </div>
            <div className="col-md-6 text-right">
              Segment: Enthusiast
            </div>
          </div>
          <div className="col-md-12">
            <div className="col-md-4 no-padding-lr text-navy">
              <strong>Email Sent</strong>
            </div>
            <div className="col-md-2 no-padding-lr text-navy">
              <strong>2,505</strong>
            </div>
            <div className="col-md-6 no-padding-lr">
              <div className="progress">
                <div className="progress-bar progress-bar-navy" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style={{width: '100%'}}>
                  <span className="sr-only">100% Complete</span>
                </div>
              </div>
            </div>
            <div className="col-md-offset-4 col-md-2 no-padding-lr text-grey">
              <strong>2,043</strong>
            </div>
            <div className="col-md-6 no-padding-lr">
              <div className="progress">
                <div className="progress-bar progress-bar-grey" role="progressbar" aria-valuenow="70" aria-valuemin="0" aria-valuemax="100" style={{width: '70%'}}>
                  <span className="sr-only">70% Complete</span>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-12">
            <div className="col-md-4 no-padding-lr text-danger">
              <strong>Email Opened</strong>
            </div>
            <div className="col-md-2 no-padding-lr text-danger">
              <strong>1,900</strong>
            </div>
            <div className="col-md-6 no-padding-lr">
              <div className="progress">
                <div className="progress-bar progress-bar-danger" role="progressbar" aria-valuenow="70" aria-valuemin="0" aria-valuemax="100" style={{width: '70%'}}>
                  <span className="sr-only">70% Complete</span>
                </div>
              </div>
            </div>
            <div className="col-md-offset-4 col-md-2 no-padding-lr text-grey">
              <strong>1,000</strong>
            </div>
            <div className="col-md-6 no-padding-lr">
              <div className="progress">
                <div className="progress-bar progress-bar-grey" role="progressbar" aria-valuenow="30" aria-valuemin="0" aria-valuemax="100" style={{width: '30%'}}>
                  <span className="sr-only">30% Complete</span>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-12">
            <div className="col-md-4 no-padding-lr text-purple">
              <strong>Email Clicked</strong>
            </div>
            <div className="col-md-2 no-padding-lr text-purple">
              <strong>500</strong>
            </div>
            <div className="col-md-6 no-padding-lr">
              <div className="progress">
                <div className="progress-bar progress-bar-purple" role="progressbar" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100" style={{width: '25%'}}>
                  <span className="sr-only">25% Complete</span>
                </div>
              </div>
            </div>
            <div className="col-md-offset-4 col-md-2 no-padding-lr text-grey">
              <strong>300</strong>
            </div>
            <div className="col-md-6 no-padding-lr">
              <div className="progress">
                <div className="progress-bar progress-bar-grey" role="progressbar" aria-valuenow="10" aria-valuemin="0" aria-valuemax="100" style={{width: '10%'}}>
                  <span className="sr-only">10% Complete</span>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-12">
            <div className="col-md-4 no-padding-lr text-dark-grey">
              <strong>Web Visits</strong>
            </div>
            <div className="col-md-2 no-padding-lr text-dark-grey">
              <strong>40,000</strong>
            </div>
            <div className="col-md-6 no-padding-lr">
              <div className="progress">
                <div className="progress-bar progress-bar-dark-grey" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style={{width: '100%'}}>
                  <span className="sr-only">100% Complete</span>
                </div>
              </div>
            </div>
            <div className="col-md-offset-4 col-md-2 no-padding-lr text-grey">
              <strong>20,243</strong>
            </div>
            <div className="col-md-6 no-padding-lr">
              <div className="progress">
                <div className="progress-bar progress-bar-grey" role="progressbar" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100" style={{width: '50%'}}>
                  <span className="sr-only">50% Complete</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

class CustomerJourney extends Component {
  render() {
    return (
      <div className="ibox float-e-margins">
        <div className="ibox-title">
          <h3>JOURNEY</h3>
        </div>
        <div className="ibox-content no-padding">
          <table className="table table-borderless">
            <tbody>
              <tr>
                <td><div className="row"><strong>11:15 am</strong></div></td>
                <td>
                  <div className="bs-callout bs-callout-navy">
                    Sent <strong>Catalog 15/16</strong>
                  </div>
                </td>
              </tr>
              <tr>
                <td><div className="row"><strong>Mar 9</strong></div></td>
                <td>
                  <div className="bs-callout bs-callout-danger">
                    Call <strong>Damaged package</strong>
                  </div>
                </td>
              </tr>
              <tr>
                <td><div className="row"><strong>Mar 9</strong></div></td>
                <td>
                  <div className="bs-callout bs-callout-navy">
                    Sent <strong>You left something in your cart</strong>
                  </div>
                </td>
              </tr>
              <tr>
                <td><div className="row"><strong>Dec 12</strong></div><div className="row">2015</div></td>
                <td>
                  <div className="bs-callout bs-callout-purple">
                    Generic Retail Store <strong>$150</strong>
                  </div>
                </td>
              </tr>
              <tr>
                <td><div className="row"><strong>Dec 9</strong></div><div className="row">2015</div></td>
                <td>
                  <div className="bs-callout bs-callout-warning">
                    Mobile App <strong>Classic Single Cup Brewer</strong>
                  </div>
                </td>
              </tr>
              <tr>
                <td><div className="row"><strong>Jul 25</strong></div><div className="row">2015</div></td>
                <td>
                  <div className="bs-callout bs-callout-navy">
                    Sent <strong>Catalog 15/16, 50% off</strong>
                  </div>
                </td>
              </tr>
              <tr>
                <td><div className="row"><strong>Jul 20</strong></div><div className="row">2015</div></td>
                <td>
                  <div className="bs-callout bs-callout-danger">
                    Call <strong>Warranty Expiring</strong>
                  </div>
                </td>
              </tr>
              <tr>
                <td><div className="row"><strong>Jun 19</strong></div><div className="row">2015</div></td>
                <td>
                  <div className="bs-callout bs-callout-navy">
                    Opened <strong>Abandoned Cart</strong>
                  </div>
                </td>
              </tr>
              <tr>
                <td><div className="row"><strong>Apr 29</strong></div><div className="row">2015</div></td>
                <td>
                  <div className="bs-callout bs-callout-purple">
                    Website <strong>$250</strong>
                  </div>
                </td>
              </tr>
              <tr>
                <td><div className="row"><strong>Mar 9</strong></div><div className="row">2014</div></td>
                <td>
                  <div className="bs-callout bs-callout-warning">
                    Tablet <strong>Dark Magic Extra Bold Coffee</strong>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

class CustomerTransactions extends Component {
  render() {
    return (
      <div className="ibox float-e-margins">
        <div className="ibox-title">
          <h3>TRANSACTIONS</h3>
        </div>
        <div className="ibox-content no-padding">
          <table className="table table-textmiddle">
            <tbody>
              <tr>
                <td><i className="fa fa-globe fa-3x"></i></td>
                <td>
                <div className="row">Sales Channel</div>
                <div className="row"><strong>Website</strong></div>
                </td>
                <td>
                <div className="row">Number</div>
                <div className="row"><strong>#1421525</strong></div>
                </td>
                <td>
                <div className="row">Date</div>
                <div className="row"><strong>Mar 09, 2016</strong></div>
                </td>
                <td>
                <div className="row">Revenue</div>
                <div className="row"><strong>$500</strong></div>
                </td>
                <td>
                </td>
              </tr>
              <tr>
                <td><i className="fa fa-building fa-3x"></i></td>
                <td>
                <div className="row">Sales Channel</div>
                <div className="row"><strong>Generic Retail Store</strong></div>
                </td>
                <td>
                <div className="row">Number</div>
                <div className="row"><strong>#1421528</strong></div>
                </td>
                <td>
                <div className="row">Date</div>
                <div className="row"><strong>Apr 22, 2015</strong></div>
                </td>
                <td>
                <div className="row">Revenue</div>
                <div className="row"><strong>$200</strong></div>
                </td>
                <td>
                </td>
              </tr>
              <tr>
                <td><i className="fa fa-globe fa-3x"></i></td>
                <td>
                <div className="row">Sales Channel</div>
                <div className="row"><strong>Website</strong></div>
                </td>
                <td>
                <div className="row">Number</div>
                <div className="row"><strong>#1421529</strong></div>
                </td>
                <td>
                <div className="row">Date</div>
                <div className="row"><strong>Feb 9, 2015</strong></div>
                </td>
                <td>
                <div className="row">Revenue</div>
                <div className="row"><strong>$350</strong></div>
                </td>
                <td>
                </td>
              </tr>
              <tr>
                <td><i className="fa fa-globe fa-3x"></i></td>
                <td>
                <div className="row">Sales Channel</div>
                <div className="row"><strong>Website</strong></div>
                </td>
                <td>
                <div className="row">Number</div>
                <div className="row"><strong>#142100</strong></div>
                </td>
                <td>
                <div className="row">Date</div>
                <div className="row"><strong>Jan 1, 2015</strong></div>
                </td>
                <td>
                <div className="row">Revenue</div>
                <div className="row"><strong>$100</strong></div>
                </td>
                <td>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

class CustomerRecommendations extends Component {
  render() {
    return (
      <div className="ibox float-e-margins">
        <div className="ibox-title">
          <h3>RECOMMENDATIONS</h3>
        </div>
        <div className="ibox-content no-padding">
          <div className="col-md-3">
            <img className="img-responsive" src="http://s7d4.scene7.com/is/image/keurig/dark-magic-coffee-green-mountain-coffee-k-cup_en_general?wid=272&hei=202&fmt=png-alpha&qlt=75,1&op_sharpen=0&resMode=bicub&op_usm=1,1,6,0&iccEmbed=0&printRes=72&extend=0,250,0,0" />
            <div className="col-md-12 no-padding-lr text-left">#5434353</div>
            <div className="col-md-12 no-padding-lr text-left"><strong>Dark Magic Extra Bold Coffee</strong></div>
            <div className="col-md-12 no-padding-lr text-left"><strong>$14.99</strong></div>
          </div>
          <div className="col-md-3">
            <img className="img-responsive" src="http://s7d4.scene7.com/is/image/keurig/italian-roast-coffee-barista-prima-k-cup_en_general?wid=272&hei=202&fmt=png-alpha&qlt=75,1&op_sharpen=0&resMode=bicub&op_usm=1,1,6,0&iccEmbed=0&printRes=72&extend=0,250,0,0" />
            <div className="col-md-12 no-padding-lr text-left">#5437652</div>
            <div className="col-md-12 no-padding-lr text-left"><strong>Italian Roast Coffee</strong></div>
            <div className="col-md-12 no-padding-lr text-left"><strong>$14.99</strong></div>
          </div>
          <div className="col-md-3">
            <img className="img-responsive" src="http://s7d4.scene7.com/is/image/keurig/Sumatran-Reserve-Extra-Bold-Coffee-K-Cup-GMC_en_general?wid=272&hei=202&fmt=png-alpha&qlt=75,1&op_sharpen=0&resMode=bicub&op_usm=1,1,6,0&iccEmbed=0&printRes=72&extend=0,250,0,0" />
            <div className="col-md-12 no-padding-lr text-left">#5498745</div>
            <div className="col-md-12 no-padding-lr text-left"><strong>Sumatran Reserve Extra Bold Coffee</strong></div>
            <div className="col-md-12 no-padding-lr text-left"><strong>$16.99</strong></div>
          </div>
          <div className="col-md-3">
            <img className="img-responsive" src="http://s7d4.scene7.com/is/image/keurig/water-filters-6-pk-refills_en_general?wid=272&hei=202&fmt=png-alpha&qlt=75,1&op_sharpen=0&resMode=bicub&op_usm=1,1,6,0&iccEmbed=0&printRes=72&extend=0,250,0,0" />
            <div className="col-md-12 no-padding-lr text-left">#5096734</div>
            <div className="col-md-12 no-padding-lr text-left"><strong>6-Pack Generic Retail® Water Filter Cartridge Refills</strong></div>
            <div className="col-md-12 no-padding-lr text-left"><strong>$24.95</strong></div>
          </div>
        </div>
      </div>
    );
  }
}

class CustomerIdentities extends Component {
  render() {
    return (
      <div className="ibox float-e-margins">
        <div className="ibox-title">
          <h3>IDENTITIES</h3>
        </div>
        <div className="ibox-content no-padding">
        </div>
      </div>
    );
  }
}

class CustomerHousehold extends Component {
  render() {
    return (
      <div className="ibox float-e-margins">
        <div className="ibox-title">
          <h3>HOUSEHOLD</h3>
        </div>
        <div className="ibox-content no-padding">
        </div>
      </div>
    );
  }
}

export default class CustomerProfile extends Component {

    componentWillMount() {
        const sessionManager = SessionManager.instance;
        if(!sessionManager.isUserLoggedIn()) {
            this.props.router.push('/');
        }
    }

  render() {
    return (

      <div className='xylo-products xylo-page-heading'>

         <div className="row wrapper white-bg page-heading">
            <CustomersHeader />
         </div>
         <div className="wrapper wrapper-content xylo-shift-top">
            <div className="row">
              <CustomerBasicInfo />
            </div>
            <div className="row">
              <div className="col-md-4">
                <CustomerPersonalDetails />
              </div>
              <div className="col-md-8">
                <CustomerRevenueDetails />
              </div>
            </div>
             <div className="row">
              <div className="col-md-4">
                <CustomersProfile />
              </div>
              <div className="col-md-4">
                <CustomerAnalytics />
              </div>
              <div className="col-md-4">
                <CustomerEngagements />
              </div>
            </div>
            <div className="row">
              <div className="col-md-4">
                <CustomerJourney />
              </div>
              <div className="col-md-8">
                <div className="col-md-12">
                  <CustomerTransactions />
                </div>
                <div className="col-md-12">
                  <CustomerRecommendations />
                </div>
                <div className="col-md-12">
                  <CustomerIdentities />
                </div>
                <div className="col-md-12">
                  <CustomerHousehold />
                </div>
              </div>
            </div>
          </div>

        </div>

      );
  }
}
