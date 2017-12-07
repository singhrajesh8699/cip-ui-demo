import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { withRouter, Link, Location } from 'react-router';
import { Route, Router, IndexRedirect, browserHistory} from 'react-router';
import Moment from 'moment';
// import vex from 'vex';
import ReactBubbleChart from 'react-bubble-chart';

import Chart from 'chart.js';
import c3 from '../../../../public/vendor/c3/c3.min.js';

import { Segments, SegmentClusters } from '../../../components/common/Segments';
import Datamap from "datamaps/dist/datamaps.all.min.js";

import "select2/dist/js/select2.full.min.js";
import "../../../../node_modules/select2/dist/css/select2.css";

import * as XyloFetch from '../../../components/common/XyloFetch';
import * as serverURLs from '../../../components/common/UrlConstants';
var baseURL = serverURLs.BASE_URL;

import * as Themes from '../../../components/common/Themes';


class OnlineBehavior extends Component {
  constructor(props) {
    super(props);
    this.trafficSource = [];
    this.state = {
      trafficData: {},
      clusterData: null
    };
  }

  initChart(data) {
    this.trafficSource = {};
    this.trafficSource =  data.cluster_details.onlineData;
    console.log("trafficdata"); console.log(this.trafficSource);
    this.setState({trafficData: this.trafficSource});
  }

  ratio (a, b) {
    return (b == 0) ? a : this.ratio (b, a%b);
  }

  componentWillMount() {
    this.setState({clusterData: this.props.data});
  }

  componentDidMount() {
    if(this.props.data && this.props.cluster_data.cluster_details) {
      this.setState({clusterData: this.props.cluster_data});
      this.initChart(this.props.cluster_data);
    } else {
      this.setState({clusterData: null, trafficData: {}});
    }
  }

  componentWillReceiveProps(props) {
    this.setState({clusterData: props.cluster_data});
    this.initChart(props.cluster_data);
  }

  render() {
    return (
      <div className="row">
        <div className="col-md-12">
          {/* <select className="form-control" defaultValue={this.trafficSource[0]} onChange={::this.onTrafficSourceChange}>
             <option key="placeholder">Select Traffic Source</option>
             {
               this.trafficSource.map(function(item) {
                 return(
                   <option key={item} value={item}>{item}</option>
                 )
               }.bind(this))
             }
          </select> */}
        </div>
        <div className="col-sm-12" style={{marginTop: 20}}>
           <h2 className="m-b-md" style={{textAlign: "center", paddingTop: 10}}>Online Behavior Metrics</h2>
          <div className='row' style={{paddingTop: 30}}>
            <div className="col-lg-3">
              <div className="ibox online-data-boxes">
                <div className="ibox-title">
                  <h5 className="m-b-md">Browsed Product</h5>
                </div>
                <div className="ibox-content">
                  <h2 className="">{this.state.trafficData.customersBrowsed ? this.state.trafficData.customersBrowsed.toFixed(2) : 0}</h2>
                </div>
              </div>
            </div>

            <div className="col-lg-3">
              <div className="ibox online-data-boxes">
                <div className="ibox-title">
                  <h5 className="m-b-md">Purchased Product</h5>
                </div>
                <div className="ibox-content">
                  <h2 className="">{this.state.trafficData.customersPurchased ? this.state.trafficData.customersPurchased.toFixed(2) : 0}</h2>
                </div>
              </div>
            </div>

            <div className="col-lg-3">
              <div className="ibox online-data-boxes">
                <div className="ibox-title">
                  <h5 className="m-b-md">Ratio of purchase online to total purchase</h5>
                </div>
                <div className="ibox-content">
                  <h2 className="">{this.state.trafficData.totalSpend ? ((this.state.trafficData.totalSpend.toFixed(0) / this.ratio(this.state.trafficData.totalSpend.toFixed(0),this.state.trafficData.totalOfflineSpend.toFixed(0))) + ":" + (this.state.trafficData.totalOfflineSpend.toFixed(0) / this.ratio(this.state.trafficData.totalSpend.toFixed(0),this.state.trafficData.totalOfflineSpend.toFixed(0)))) : (0 + ":" +0) }</h2>
                </div>
              </div>
            </div>

            <div className="col-lg-3">
              <div className="ibox online-data-boxes">
                <div className="ibox-title">
                  <h5 className="m-b-md">Number of online puchases per customer</h5>
                </div>
                <div className="ibox-content">
                  <h2 className="">{this.state.trafficData.avgPurchasePerCustomer ? this.state.trafficData.avgPurchasePerCustomer.toFixed(2) : 0}</h2>
                </div>
              </div>
            </div>

            <div className="col-lg-3">
              <div className="ibox online-data-boxes">
                <div className="ibox-title">
                  <h5 className="m-b-md">Spend per purchase</h5>
                </div>
                <div className="ibox-content">
                  <h2 className="">{this.state.trafficData.avgSpendPerPurchase ? this.state.trafficData.avgSpendPerPurchase.toFixed(2) : 0}</h2>
                </div>
              </div>
            </div>

            <div className="col-lg-3">
              <div className="ibox online-data-boxes">
                <div className="ibox-title">
                  <h5 className="m-b-md">Average basket size</h5>
                </div>
                <div className="ibox-content">
                  <h2 className="">{this.state.trafficData.avgBasketSize ? this.state.trafficData.avgBasketSize.toFixed(2) : 0}</h2>
                </div>
              </div>
            </div>

            <div className="col-lg-3">
              <div className="ibox online-data-boxes">
                <div className="ibox-title">
                  <h5 className="m-b-md">Unique Visitors (Customers)</h5>
                </div>
                <div className="ibox-content">
                  <h2 className="">{this.state.trafficData.totalcustomers}</h2>
                </div>
              </div>
            </div>

            <div className="col-lg-3">
              <div className="ibox online-data-boxes">
                <div className="ibox-title">
                  <h5 className="m-b-md">Percent Non-referred</h5>
                </div>
                <div className="ibox-content">
                  <h2 className="">{this.state.trafficData.percentNonReferred ? this.state.trafficData.percentNonReferred.toFixed(2): 0}</h2>
                </div>
              </div>
            </div>

            <div className="col-lg-3">
              <div className="ibox online-data-boxes">
                <div className="ibox-title">
                  <h5 className="m-b-md">Visits per Visitor</h5>
                </div>
                <div className="ibox-content">
                  <h2 className="">{this.state.trafficData.visitsPerVisitor}</h2>
                </div>
              </div>
            </div>

            <div className="col-lg-3">
              <div className="ibox online-data-boxes">
                <div className="ibox-title">
                  <h5 className="m-b-md">Pages per Visit</h5>
                </div>
                <div className="ibox-content">
                  <h2 className="">{this.state.trafficData.pagesPerVisit ? this.state.trafficData.pagesPerVisit.toFixed(2) : 0}</h2>
                </div>
              </div>
            </div>

            <div className="col-lg-3">
              <div className="ibox online-data-boxes">
                <div className="ibox-title">
                  <h5 className="m-b-md">Average Duration (minutes)</h5>
                </div>
                <div className="ibox-content">
                  <h2 className="">{this.state.trafficData.pagesPerVisit ? this.state.trafficData.averageDuration.toFixed(2) : 0}</h2>
                </div>
              </div>
            </div>

            <div className="col-lg-3">
              <div className="ibox online-data-boxes">
                <div className="ibox-title">
                  <h5 className="m-b-md">Search Usage</h5>
                </div>
                <div className="ibox-content">
                  <h2 className="">{this.state.trafficData.pagesPerVisit ? this.state.trafficData.searchUsage.toFixed(2) : 0}</h2>
                </div>
              </div>
            </div>

            <div className="col-lg-3">
              <div className="ibox online-data-boxes">
                <div className="ibox-title">
                  <h5 className="m-b-md">Review Usage</h5>
                </div>
                <div className="ibox-content">
                  <h2 className="">{this.state.trafficData.pagesPerVisit ? this.state.trafficData.reviewUsage.toFixed(2) : 0}</h2>
                </div>
              </div>
            </div>

            <div className="col-lg-3">
              <div className="ibox online-data-boxes">
                <div className="ibox-title">
                  <h5 className="m-b-md">Transaction Conversion</h5>
                </div>
                <div className="ibox-content">
                  <h2 className="">{this.state.trafficData.pagesPerVisit ? this.state.trafficData.transactionConversion.toFixed(2) : 0}</h2>
                </div>
              </div>
            </div>

            <div className="col-lg-3">
              <div className="ibox online-data-boxes">
                <div className="ibox-title">
                  <h5 className="m-b-md">Non-Referred Conversion rate</h5>
                </div>
                <div className="ibox-content">
                  <h2 className="">{this.state.trafficData.transactionNonReferredConversion}</h2>
                </div>
              </div>
            </div>

            <div className="col-lg-3">
              <div className="ibox online-data-boxes">
                <div className="ibox-title">
                  <h5 className="m-b-md">Search Conversion Rate</h5>
                </div>
                <div className="ibox-content">
                  <h2 className="">{this.state.trafficData.pagesPerVisit ? this.state.trafficData.searchConversion.toFixed(2) : 0}</h2>
                </div>
              </div>
            </div>

            <div className="col-lg-3">
              <div className="ibox online-data-boxes">
                <div className="ibox-title">
                  <h5 className="m-b-md">Review Conversion Rate</h5>
                </div>
                <div className="ibox-content">
                  <h2 className="">{this.state.trafficData.pagesPerVisit? this.state.trafficData.reviewConversion.toFixed(2) : 0}</h2>
                </div>
              </div>
            </div>

            <div className="col-lg-3">
              <div className="ibox online-data-boxes">
                <div className="ibox-title">
                  <h5 className="m-b-md">Checkout Abandonment Rate</h5>
                </div>
                <div className="ibox-content">
                  <h2 className="">{this.state.trafficData.pagesPerVisit ? this.state.trafficData.checkoutAbandonment.toFixed(2) : 0}</h2>
                </div>
              </div>
            </div>

            {/* <div className="col-xs-12">
              <div className="well well-lg col-sm-6"><div className="col-sm-12 text-center">Browsed Product</div><div className="col-sm-12 text-center">{this.state.trafficData.customersBrowsed ? this.state.trafficData.customersBrowsed.toFixed(2) : 0}</div></div>

              <div className="well well-lg col-sm-6"><div className="col-sm-12 text-center">Purchased Product</div><div className="col-sm-12 text-center">{this.state.trafficData.customersPurchased ? this.state.trafficData.customersPurchased.toFixed(2) : 0}</div></div>

               <div className="well well-lg col-sm-6"><div className="col-sm-12 text-center">Ratio of purchase online to total purchase</div><div className="col-sm-12 text-center">{this.state.trafficData.totalSpend ? ((this.state.trafficData.totalSpend.toFixed(0) / this.ratio(this.state.trafficData.totalSpend.toFixed(0),this.state.trafficData.totalOfflineSpend.toFixed(0))) + ":" + (this.state.trafficData.totalOfflineSpend.toFixed(0) / this.ratio(this.state.trafficData.totalSpend.toFixed(0),this.state.trafficData.totalOfflineSpend.toFixed(0)))) : (0 + ":" +0) }</div></div>

              <div className="well well-lg col-sm-6"><div className="col-sm-12 text-center">Number of online puchases per customer</div><div className="col-sm-12 text-center">{this.state.trafficData.avgPurchasePerCustomer ? this.state.trafficData.avgPurchasePerCustomer.toFixed(2) : 0}</div>
              </div>

              <div className="well well-lg col-sm-6"><div className="col-sm-12 text-center">Spend per puchase</div><div className="col-sm-12 text-center">{this.state.trafficData.avgSpendPerPurchase ? this.state.trafficData.avgSpendPerPurchase.toFixed(2) : 0}</div></div>
              <div className="well well-lg col-sm-6"><div className="col-sm-12 text-center">Average basket size</div><div className="col-sm-12 text-center">{this.state.trafficData.avgBasketSize ? this.state.trafficData.avgBasketSize.toFixed(2) : 0}</div></div> */}


            {/* {
              this.state.trafficData.map(function(item, i) {
                let arrowClass = 'fa fa-play';
                let textClass = 'text-navy';
                if(item.progress_direction === 'down') {
                  arrowClass = 'fa fa-play fa-rotate-90';
                  textClass = 'text-danger';
                } else if(item.progress_direction === 'up') {
                  arrowClass = 'fa fa-play fa-rotate-270';
                  textClass = 'text-navy';
                }
                return (
                  <div key={item.value+i} className="col-lg-3">
                    <div className="ibox" style={{border: '1px solid #ccc'}}>
                      <div className="ibox-content">
                        <h5 className="m-b-md">{item.title}</h5>
                        <h2 className={textClass}>
                            <i className={arrowClass}></i> {item.value}
                        </h2>
                        <small>Last down {item.last_updated_days} days ago</small>
                      </div>
                    </div>
                  </div>
                )
              }.bind(this))
            } */}
          </div>
        </div>
      </div>
    )
  }

}

class ClusterConversionFunnel extends Component {
    componentDidMount(){
    }

    componentWillReceiveProps(){
    }

    render(){

      var online_data = this.props.cluster_data.OnlineData;


      var data = {awarenessFunnel: [], considerationFunnel: [], conversionFunnel: []};
        if(online_data) {
          // Todo:
          online_data.totalcustomers = 200;

          if (online.totalcustomers){


          data.awarenessFunnel = [["Unique Visitors (Customers)", online_data.totalcustomers],["Percent Non-referred", online_data.percentNonReferred]];
          data.considerationFunnel = [
            ["Visits per Visitor", online_data.visitsPerVisitor],
            ["Pages per Visit", online_data.pagesPerVisit],
            ["Average Duration (minutes)", online_data.averageDuration],
            ["Search Usage", online_data.searchUsage],
            ["Review Usage", online_data.reviewUsage]
          ];
          data.conversionFunnel = [
            ["Transaction Conversion", online_data.transactionConversion],
            ["Non-Referred Conversion rate", online_data.transactionNonReferredConversion],
            ["Search Conversion Rate", online_data.searchConversion],
            ["Review Conversion Rate", online_data.reviewConversion],
            ["Checkout Abandonment Rate", online_data.checkoutAbandonment]
          ];
        }
      }
      return (
      <div className="ibox float-e-margins">
          <div className="ibox-title">
            <h3>Cluster Conversion Funnel</h3>
          </div>
          <div className="ibox-content no-padding">
          <div className="col-sm-4" id="awarenessFunnel">
          {data.awarenessFunnel.map(function(row, i) {
            return (
                <div key={"awarenessrow" + i}>
                <div className="row text-center">{row[0]}</div>
                <div className="row text-center">{row[1].toFixed(2)}</div>
                {i != (data.awarenessFunnel.length - 1) ? <div className="row text-center"><i className="fa fa-filter fa-2x"></i></div> : <div></div>}
                </div>
              );
            })}
          </div>
          <div className="col-sm-4" id="considerationFunnel">
          {data.considerationFunnel.map(function(row, i) {
            return (
                <div key={"considerationrow" + i}>
                <div className="row text-center">{row[0]}</div>
                <div className="row text-center">{row[1].toFixed(2)}</div>
                {i != (data.considerationFunnel.length - 1) ? <div className="row text-center"><i className="fa fa-filter fa-2x"></i></div> : <div></div>}
                </div>
              );
            })}
          </div>
          <div className="col-sm-4" id="conversionFunnel">
          {data.conversionFunnel.map(function(row, i) {
              return (
                <div key={"conversionrow" + i}>
                <div className="row text-center">{row[0]}</div>
                <div className="row text-center">{row[1].toFixed(2)}</div>
                {i != (data.conversionFunnel.length - 1) ? <div className="row text-center"><i className="fa fa-filter fa-2x"></i></div> : <div></div>}
                </div>
              );
            })}
          </div>
          </div>
      </div>
      )
    }
  }



class ClusterOnline extends Component {

  render() {
    return (
      <div>
        <div className="row">
          <div className="col-sm-12">
            <h2 className="m-b-md" style={{textAlign: "center", paddingTop: 10}}>Demographics Metrics</h2>
            <div className="row" style={{paddingTop: 30}}>
              <div className="col-sm-8">
                <div className="row">
                  <OnlineBehavior cluster_data={this.props.data} />
                </div>
                <div className="row">
                  <ClusterConversionFunnel cluster_data={this.props.data} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default ClusterOnline;

