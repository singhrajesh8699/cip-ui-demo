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

class PercentCompany extends Component {

  constructor(props) {
    super(props);
    this.state = { 
      clusterData: null
    };

  }

  init_SpendChart(data) {
    
    var spendPercent = parseInt(data.cluster_details.spendPercentOfCompany.toFixed(2));
    var spendData = [];
    spendData.push(['Cluster Spend %', spendPercent]);
    spendData.push(['Other Spend %', 100-spendPercent]);

     var colorsData = {};
    colorsData['Cluster Spend %'] = Themes.palette1.bar_colors[0].bgColor;
    colorsData['Other Spend %'] = Themes.palette1.bar_colors[1].bgColor;
    
    c3.generate({
      bindto: '#spendPie',
      data:{
        columns: spendData,
        colors: colorsData,
        type : 'pie'
      },
      size: {
        width: 200
      }
    });
  
  }

  init_CustomersChart(data) {

    var customersPercent = parseInt(data.cluster_details.customerPercentOfCompany.toFixed(2));
    var customersData = [];
    customersData.push(['Cluster Customers %', customersPercent]);
    customersData.push(['Other Customers %', 100-customersPercent]);

    var colorsData = {};
    colorsData['Cluster Customers %'] = Themes.palette1.bar_colors[0].bgColor;
    colorsData['Other Customers %'] = Themes.palette1.bar_colors[1].bgColor;
    
    c3.generate({
      bindto: '#customersPie',
      data:{
        columns: customersData,
        colors: colorsData,
        type : 'pie'
      },
      size: {
        width: 200
      }
    });

  }


  componentDidMount() { 
    this.setState({clusterData: this.props.cluster_data});
    this.init_SpendChart(this.props.cluster_data);
    this.init_CustomersChart(this.props.cluster_data);
  }

  componentWillReceiveProps(props) {
    this.setState({clusterData: this.props.cluster_data});
    this.init_SpendChart(this.props.cluster_data);
    this.init_CustomersChart(this.props.cluster_data);
  }

  render() {
    
    return (
      <div className="col-sm-12">
        <div className="ibox float-e-margins">
          <div className="ibox-title">
              <h5>Cluster Spend and Customers</h5>
          </div>
          <div className="ibox-content">
            <div className="row">
                <div className="col-md-6">
                  <div id="spendPie"></div>
                </div>
                <div className="col-md-6">
                  <div id="customersPie"></div>
                </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

class AverageCustomerTrips extends Component {

  render() {

    var clusterAverageTripsPerCustomer = this.props.cluster_data.cluster_details.averageTripsPerCustomer.toFixed(3);
    var companyAverageTripsPerCustomer = this.props.cluster_data.company_details.averageTripsPerCustomer.toFixed(3);

    return (
      <div className="col-sm-12">
            <div className="ibox float-e-margins">
                <div className="ibox-title">
                 <div className="col-sm-1"><i className="fa fa-2x fa-shopping-cart"></i></div>
                    <div className="col-sm-11">
                      <h4>Average Trips per Customer</h4>
                    </div>
                </div>

                <div className="ibox-content">         

                    <div className="row">
                        <div className="col-md-6">
                            <h2 className="no-margins">{clusterAverageTripsPerCustomer}</h2>
                            <div className="font-bold text-navy"><small>Cluster Average</small></div>
                        </div>
                        <div className="col-md-6">
                            <h2 className="no-margins">{companyAverageTripsPerCustomer}</h2>
                            <div className="font-bold text-navy"><small>Company Average</small></div>
                        </div>
                    </div>


                </div>
            </div>
        </div>
    );
  }
}

class AverageTripSpends extends Component {

  constructor(props) {
    super(props);
    this.state = { 
      clusterData: null
    };

  }

  init_chart(data) {

    var clusterAverageSpendsPerTrip = this.props.cluster_data.cluster_details.averageSpendsPerTrip.toFixed(2)
    var companyAverageSpendsPerTrip = this.props.cluster_data.company_details.averageSpendsPerTrip.toFixed(2);
    
    var clusterTripSpend = parseInt(data.cluster_details.averageSpendsPerTrip.toFixed(2));
    var companyTripSpend = parseInt(data.company_details.averageSpendsPerTrip.toFixed(2));
    
    var chartData = [];
    chartData.push(['Cluster Average', clusterTripSpend]);
    chartData.push(['Company Average', companyTripSpend]);
    
    var colorsData = {};
    colorsData['Cluster Average'] = Themes.palette1.bar_colors[0].bgColor;
    colorsData['Company Average'] = Themes.palette1.bar_colors[1].bgColor;

    c3.generate({
      bindto: '#tripSpendBar',
      data:{
        columns: chartData,
        colors: colorsData,
        type : 'bar'
      },
      axis: {
        x: {
          tick: {
            format: function(d) {
              return '';
            }
          },
          type: 'category'
        },
        y: {
          tick: {
            format: function(d) {
              return '$'+d;
            }
          }
        }
      },
      size: {
        width: 200
      }
    });
  
  }

  componentDidMount() { 
    this.setState({clusterData: this.props.cluster_data});
    this.init_chart(this.props.cluster_data);
  }

  componentWillReceiveProps(props) {
    this.setState({clusterData: this.props.cluster_data});
    this.init_chart(this.props.cluster_data);
  }

  render() {

     return (
          <div className="col-sm-12">
            <div className="ibox float-e-margins">
              <div className="ibox-title">
                  <h5>Average Trip Spend</h5>
              </div>
              <div className="ibox-content">
                <div className="row">
                    <div className="col-md-6">
                      <div id="tripSpendBar"></div>
                    </div>
                </div>
              </div>
            </div>
          </div>
      );
  }
}

class AverageAnnualSpends extends Component {
  
  constructor(props) {
    super(props);
    this.state = { 
      clusterData: null
    };

  }

  init_chart(data) {

    var clusterAverageAnnualSpend = parseInt(data.cluster_details.averageAnnualSpends.toFixed(2));
    var companyAverageAnnualSpend = parseInt(data.company_details.averageAnnualSpends.toFixed(2));
    
    var chartData = [];
    chartData.push(['Cluster Average', clusterAverageAnnualSpend]);
    chartData.push(['Company Average', companyAverageAnnualSpend]);
    
    var colorsData = {};
    colorsData['Cluster Average'] = Themes.palette1.bar_colors[0].bgColor;
    colorsData['Company Average'] = Themes.palette1.bar_colors[1].bgColor;

    c3.generate({
      bindto: '#annualSpendBar',
      data:{
        columns: chartData,
        colors: colorsData,
        type : 'bar'
      },
      axis: {
        x: {
          tick: {
            format: function(d) {
              return '';
            }
          },
          type: 'category'
        },
        y: {
          tick: {
            format: function(d) {
              return '$'+d;
            }
          }
        }
      },
      size: {
        width: 200
      }
    });
  
  }

  componentDidMount() { 
    this.setState({clusterData: this.props.cluster_data});
    this.init_chart(this.props.cluster_data);
  }

  componentWillReceiveProps(props) {
    this.setState({clusterData: this.props.cluster_data});
    this.init_chart(this.props.cluster_data);
  }

  render() {
    
     return (
          <div className="col-sm-12">
            <div className="ibox float-e-margins">
              <div className="ibox-title">
                  <h5>Average Annual Spend</h5>
              </div>
              <div className="ibox-content">
                <div className="row">
                    <div className="col-md-6">
                      <div id="annualSpendBar"></div>
                    </div>
                </div>
              </div>
            </div>
          </div>
      );
  }

}

class Categories extends Component {

  constructor(props) {
    super(props);
    this.state = {
      clusterData: null
    };
    this.tableData = [];
  }

  init(data) {
    this.tableData = [];

    this.tableData.push({
      name: 'Departments',
      over: 'Coffee',
      under: 'Dairy'
    });

    this.tableData.push({
      name: 'Categories',
      over: 'Green Mountain Coffee Roasters, Folgers',
      under: 'Tullys'
    });
  }

  componentDidMount() {
    this.setState({clusterData: this.props.cluster_data});
    this.init(this.props.cluster_data);
  }

  componentWillReceiveProps(props) {
    this.setState({clusterData: this.props.cluster_data});
    this.init(this.props.cluster_data);
  }

  render() {

    return (
      <div className="col-sm-12">
        <div className="ibox float-e-margins">
            <div className="ibox-title">
                <div className="col-sm-1">
                  <i className="fa fa-2x fa-cubes"></i>
                </div>
                <div className="col-sm-11">
                  <h4>Departments, Categories</h4>
                </div>
              </div>
            <div className="ibox-content">
               <table className="table table-striped table-bordered table-hover">
                    <thead>
                      <tr>
                        <th></th>
                        <th>Over Represented</th>
                        <th>Under Represented</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        this.tableData.map(function(item, index) {
                           return(
                            <tr key={item.name}>
                              <td>{item.name}</td>
                              <td>{item.over}</td>
                              <td>{item.under}</td>
                            </tr>
                          )
                        }.bind(this))
                      }
                    </tbody>
                  </table>
            </div>
        </div>
      </div>
    );
  }
}

class ClusterShopping extends Component {

  render() {
    return (
      <div>
        <div className="row">
          <div className="col-sm-12">
          
            <h2 className="m-b-md" style={{textAlign: "center", paddingTop: 10}}>Shopping Metrics</h2>
          
            <div className="row" style={{paddingTop: 30}}>
             
              <div className="col-sm-8">
                <div className="row">
                  <PercentCompany cluster_data={this.props.data} />
                </div>
                <div className="row">
                  <AverageCustomerTrips cluster_data={this.props.data} />
                </div>
                <div className="row">
                  <Categories cluster_data={this.props.data} />
                </div>
              </div>

              <div className="col-sm-4">
                <div className="row">
                  <AverageTripSpends cluster_data={this.props.data} />
                </div>
                <div className="row">
                  <AverageAnnualSpends cluster_data={this.props.data} />
                </div>
              </div>

            </div>

          </div>
          
        </div>
      </div>
    )
  }
}

export default ClusterShopping;