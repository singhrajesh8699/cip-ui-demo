import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { withRouter, Link } from 'react-router';

import Chart from 'chart.js';
import c3 from '../../../public/vendor/c3/c3.min.js';
import InputRange from 'react-input-range';
import D3Funnel from 'd3-funnel';
import { Modal, ProgressBar } from 'react-bootstrap';
import {Radio, RadioGroup} from 'react-icheck';
import Datamap from "datamaps/dist/datamaps.all.min.js";

import * as Themes from '../../components/common/Themes';

import * as ServerURLs from '../../components/common/UrlConstants';
import * as XyloFetch from '../../components/common/XyloFetch';

import * as _ from "lodash";

import {
  Layout, LayoutBody, LayoutResults,
  SideBar
} from "searchkit";

import * as serverURLs from '../../components/common/UrlConstants';
import SessionManager from '../../components/common/SessionManager';

import "../../../public/vendor/searchkit/theme.css";
import "../../../public/vendor/react-input-range/react-input-range.min.css";
import "../../../public/vendor/iCheck/iCheck.css";
import "../../../node_modules/icheck/skins/all.css";

class GeographyComponent extends Component {
  constructor(props) {
    super(props);
    this.tableData = [];
    this.state = {
      clusterData: null
    }
  }

  initChart(data) {
    var self = this;
    var geo_data = {};
    this.tableData = [];
    data.overRepresented.forEach(function(item) {
      if(item && item !== "NULL")
        geo_data[item] = { fillKey: "overRepresented" };
    });
    data.underRepresented.forEach(function(item) {
      if(item && item !== "NULL")
        geo_data[item] = { fillKey: "underRepresented" };
    });
    if(this.chartRef) {
      $("#usa_customer_map").parent().append( "<div id='usa_customer_map'></div>");
      $("#usa_customer_map").remove();
    } else {
      this.chartHeight = $('.segment-detail-tab-container').width() / 1.6;
    }
    this.chartRef = new Datamap({
        element: document.getElementById("usa_customer_map"),
        responsive: true,
        scope: "usa",
        width: $('.segment-detail-tab-container').width(),
        height: self.chartHeight,
        fills: {
            defaultFill: "#83A587",
            overRepresented: "#69826c",
            underRepresented: "#E2DAD6"
        },
        geographyConfig: {
            highlightFillColor: '#2C977A',
            highlightBorderWidth: 3
        },
        data: geo_data
    });

    this.chartRef.legend({
      legendTitle : "",
      labels: {
        overRepresented: "Over Represented",
        underRepresented: "Under Represented"
      },
    });
  }

  componentWillMount() {
    this.setState({clusterData: this.props.data});
  }

  componentDidMount() {
    if(this.props.data && this.props.data.overRepresented && this.props.data.underRepresented) {
      this.initChart(this.props.data);
      this.setState({clusterData: this.props.data});
    } else {
      this.setState({clusterData: null});
    }
  }

  componentWillReceiveProps(props) {
    var data = !Object.keys(this.props.data).length ? this.props.alldata : this.props.data;
    if(data && data.overRepresented && data.underRepresented) {
      this.initChart(data);
      this.setState({clusterData: data});
    } else {
      this.setState({clusterData: null});
    }
  }

  render() {
    return (
      <div className="row">
        <div className="col-lg-12">
          <div className="ibox float-e-margins">
            <div className="ibox-content" id="customer-map" style={{borderStyle: 'none'}}>
              <div id="usa_customer_map"></div>
            </div>
          </div>
        </div>

      </div>
    )
  }
}

class CustomersHeader extends React.Component {
  render() {
    let breadCrumb = this.props.id == "new" ? <a><b>Create</b></a> : <a><b>View</b></a>;
    return (
      <div className="col-lg-5">
      <div className='xylo-page-header'>
      <h2>Customers</h2>
      <ol className="breadcrumb">
      <li>
      <a href="index.html">Customers</a>
      </li>
      <li>
      <Link to="/customers/groups">
        Groups
      </Link>
      </li>
      <li>
        <a><b>Create</b></a>
      </li>
      </ol>
      </div>
      </div>
    );
  }
}

  class CustomerGroupMenu extends Component {
    
    constructor(){
      super();
      this.handleNameChange = this.handleNameChange.bind(this);
      this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
      this.saveCustomerGroup = this.saveCustomerGroup.bind(this);
      this.close = this.close.bind(this);
      this.open = this.open.bind(this);
      this.state = {customerGroup: {
        name:"",
        description:"",
        "filters": [
          {
            "field": "Age",
            "type": "range",
            "min": 0,
            "max": 100
          },
        {
          "field": "DAYS_SINCE_LAST_PURCHASE",
          "type": "range",
          "min": 0,
          "max": 3650
        },
        {
          "field": "AVG_DAYS_BETWEEN_ORDERS",
          "type": "range",
          "min": 0,
          "max": 3650
        },
        {
          "field": "GENDER",
          "type": "list",
          "list": ["F", "M", ""]
        },
        {
          "field": "children_in_household",
          "type": "list",
          "list":[true, false]
        }],
        "groupByField": "Life Stage",
        "id": ""
      },
      showModal: false
    }
    }

    saveCustomerGroup() {
      XyloFetch.postC360(this.state.customerGroup)
        .then(response => {
          $('#myModal').modal('hide');
          this.close();
          this.props.router.push('/customers/groups');
        });
    }

    componentWillReceiveProps(){
      this.setState({customerGroup: {
        name:this.state.customerGroup.name,
        description:this.state.customerGroup.description,
        "filters": [
          {
            "field": "Age",
            "type": "range",
            "min": this.props.data.age.min,
            "max": this.props.data.age.max
          },
        {
          "field": "DAYS_SINCE_LAST_PURCHASE",
          "type": "range",
          "min": this.props.data.recency.min,
          "max": this.props.data.recency.max
        },
        {
          "field": "AVG_DAYS_BETWEEN_ORDERS",
          "type": "range",
          "min": this.props.data.frequency.min,
          "max": this.props.data.frequency.max
        },
        {
          "field": "GENDER",
          "type": "list",
          "list": (this.props.data.gender == null ? ["F", "M", ""] : [this.props.data.gender])
        },
        {
          "field": "children_in_household",
          "type": "list",
          "list": (this.props.data.childrenInHouseholdClusterAvg == null ? [true, false] : [this.props.data.childrenInHouseholdClusterAvg])
        }],
        "groupByField": "Life Stage",
        "id": this.props.id
      },
      showModal: this.state.showModal
    });
    }

    handleNameChange(event){
      this.setState({customerGroup: {
        name:event.target.value,
        description:this.state.customerGroup.description,
        "filters": [
          {
            "field": "Age",
            "type": "range",
            "min": this.state.customerGroup.filters[0].min,
            "max": this.state.customerGroup.filters[0].max
          },
        {
          "field": "DAYS_SINCE_LAST_PURCHASE",
          "type": "range",
          "min": this.props.data.recency.min,
          "max": this.props.data.recency.max
        },
        {
          "field": "AVG_DAYS_BETWEEN_ORDERS",
          "type": "range",
          "min": this.props.data.frequency.min,
          "max": this.props.data.frequency.max
        },
        {
          "field": "GENDER",
          "type": "list",
          "list": (this.props.data.gender == null ? ["F", "M", ""] : [this.props.data.gender])
        },
        {
          "field": "children_in_household",
          "type": "list",
          "list": (this.props.data.childrenInHouseholdClusterAvg == null ? [true, false] : [this.props.data.childrenInHouseholdClusterAvg])
        }],
        "groupByField": "Life Stage",
        "id": this.props.id
      },
      showModal: this.state.showModal
    });
    }
    handleDescriptionChange(event){
      this.setState({customerGroup: {
        name:this.state.customerGroup.name,
        description:event.target.value,
        "filters": [
          {
            "field": "Age",
            "type": "range",
            "min": this.state.customerGroup.filters[0].min,
            "max": this.state.customerGroup.filters[0].max
          },
        {
          "field": "DAYS_SINCE_LAST_PURCHASE",
          "type": "range",
          "min": this.props.data.recency.min,
          "max": this.props.data.recency.max
        },
        {
          "field": "AVG_DAYS_BETWEEN_ORDERS",
          "type": "range",
          "min": this.props.data.frequency.min,
          "max": this.props.data.frequency.max
        },
        {
          "field": "GENDER",
          "type": "list",
          "list": (this.props.data.gender == null ? ["F", "M", ""] : [this.props.data.gender])
        },
        {
          "field": "children_in_household",
          "type": "list",
          "list": (this.props.data.childrenInHouseholdClusterAvg == null ? [true, false] : [this.props.data.childrenInHouseholdClusterAvg])
        }],
        "groupByField": "Life Stage",
        "id": this.props.id
      },
      showModal: this.state.showModal
    });
    }

     close() {
      this.setState({ showModal: false });
    }

    open() {
      this.setState({ showModal: true });
    }

    render() {
      return (
        <div className="col-lg-12">
          <div className="wrapper wrapper-content">
            <div className="ibox">
              <div className="ibox-title">
                <h5>{this.props.name ? this.props.name :  (this.props.id  == "new" ? "New Customer Group" : "All Customer's Group")}</h5>
                { (() => {
                    if(this.state.customerGroup.id && this.state.customerGroup.id == "new"){
                      return(
                      <div className="ibox-tools">
                        <button onClick={this.open} className="btn btn-primary">
                          Save Customer Group
                        </button>
                      </div>
                      )
                    }
                  })()
                }
                <Modal show={this.state.showModal} onHide={this.close}>
                  <Modal.Header closeButton>
                    <Modal.Title>Modal heading</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <div className="form-group"><label>Create Customer Group</label> 
                      <input type="text" placeholder="Enter name of customer group" onChange={this.handleNameChange} className="form-control" />
                      <input type="text" placeholder="Enter description of customer group" onChange={this.handleDescriptionChange} className="form-control" />
                    </div>
                  </Modal.Body>
                  <Modal.Footer>
                    <button type="button" className="btn btn-white" onClick={this.close}>Close</button>
                    <button type="button" onClick={this.saveCustomerGroup} className="btn btn-primary">Save</button>
                </Modal.Footer>
                </Modal>
              </div>
            </div>
          </div>
        </div>
      )
    }
  }

  class ClusterCharacteristics extends Component {

    componentDidMount(){
    }
    render(){
      return (
        <div className="ibox float-e-margins">
          <div className="ibox-title">
            <h3>Cluster Characteristics</h3>
          </div>
          <div className="ibox-content no-padding">
            <div className="row">
              { (() => {
                if(this.props.id == 'new')
                  return(<div></div>);
                else
                  return(
                <div className="col-lg-4">
                  <div className="ibox">
                    <div className="ibox-content">
                      <h5>
                      Cluster Definition:{this.props.description}
                      </h5>
                    </div>
                  </div>
                </div>
                )
                ;
                })()
              }
              <div className="col-lg-4">
                <div className="ibox">
                  <div className="ibox-content">
                    <h5>
                    Number of Customers:{this.props.numberOfCustomers}
                    </h5>
                  </div>
                </div>
              </div>
              <div className="col-lg-4">
                <div className="ibox">
                  <div className="ibox-content">
                    <h5>
                    Annual Spend:${(this.props.annualSpend * this.props.numberOfCustomers).toFixed(2)}
                    </h5>
                  </div>
                </div>
              </div>
            </div>
            <div className="row row-flex">
              <div className="widget style1 navy-bg col-flex">
                  <div className="row">
                      <div className="col-xs-4">
                          <i className="fa fa-cloud fa-5x"></i>
                      </div>
                      <div className="col-xs-8 text-right">
                          <span> Median Age of customers in cluster</span>
                          <h2 className="font-bold">{this.props.data.ageMedian ? ((this.props.data.ageMedian.length > 1) ? ((parseInt(this.props.data.ageMedian[0].Age) + parseInt(this.props.data.ageMedian[1].Age)) / 2) : this.props.data.ageMedian[0].Age) : ''} years</h2>
                          <span> Company Average: {this.props.alldata.ageMedian ? ((this.props.alldata.ageMedian.length > 1) ? ((parseInt(this.props.alldata.ageMedian[0].Age) + parseInt(this.props.alldata.ageMedian[1].Age)) / 2) : this.props.alldata.ageMedian[0].Age) : ''} years </span>
                      </div>
                  </div>
              </div>
              <div className="widget style1 navy-bg col-flex">
                  <div className="row">
                      <div className="col-xs-4">
                          <i className="fa fa-venus fa-5x"></i>
                      </div>
                      <div className="col-xs-8 text-right">
                          <span> Percentage of female customers </span>
                          <h2 className="font-bold">{this.props.data.femalePercentage ? this.props.data.femalePercentage.toFixed(2) : (this.props.data.femalePercentage == 0 ? '0.00' : '')} % </h2>
                          <span> Company Average: {this.props.alldata.femalePercentage ? this.props.alldata.femalePercentage.toFixed(2) : ''} % </span>
                      </div>
                  </div>
              </div>
              <div className="widget style1 navy-bg col-flex">
                  <div className="row">
                      <div className="col-xs-4">
                          <i className="fa fa-child fa-5x"></i>
                      </div>
                      <div className="col-xs-8 text-right">
                          <span> Customers having children in household </span>
                          <h2 className="font-bold">{this.props.data.childrenInHouseholdClusterAvg ? this.props.data.childrenInHouseholdClusterAvg.toFixed(2) : ''} % </h2>
                          <span> Company Average: {this.props.alldata.childrenInHouseholdClusterAvg ? this.props.alldata.childrenInHouseholdClusterAvg.toFixed(2) : ''} % </span>
                      </div>
                  </div>
              </div>
            </div>
            <div className="row row-flex">
              <div className="col-md-12">
                <div className="ibox">
                    <div className="ibox-content segment-detail-tab-container">
                        <h5>Significant States</h5>
                        <GeographyComponent data={this.props.data.significantStates} alldata={this.props.alldata.significantStates}/>
                    </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }
  }

  class ClusterShoppingBehavior extends Component {

    render(){
        return (
        <div className="ibox float-e-margins">
          <div className="ibox-title">
            <h3>Cluster Shopping Behavior</h3>
          </div>
          <div className="ibox-content no-padding">
            <div className="row">
              <div className="col-lg-6">
                <div className="ibox">
                  <div className="ibox-content">
                      <h5>% of all Company Customers</h5>
                      <h2>{this.props.data.customerPercentOfCompany.toFixed(1)}%</h2>
                      <div className="progress">
                        <div className="progress-bar progress-bar-navy" role="progressbar" aria-valuenow={this.props.data.customerPercentOfCompany.toFixed(1)} aria-valuemin="0" aria-valuemax="100" style={{width: this.props.data.customerPercentOfCompany.toFixed(1) + '%'}}>
                          <span className="sr-only">{this.props.data.customerPercentOfCompany.toFixed(1)}%</span>
                        </div>
                      </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="ibox">
                  <div className="ibox-content">
                      <h5>% of all Company Spend</h5>
                      <h2>{this.props.data.spendPercentOfCompany.toFixed(1)}%</h2>
                      <div className="progress">
                        <div className="progress-bar progress-bar-navy" role="progressbar" aria-valuenow={this.props.data.spendPercentOfCompany.toFixed(1)} aria-valuemin="0" aria-valuemax="100" style={{width: this.props.data.spendPercentOfCompany.toFixed(1) + '%'}}>
                          <span className="sr-only">{this.props.data.spendPercentOfCompany.toFixed(1)}%</span>
                        </div>
                      </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row row-flex">
              <div className="widget style1 navy-bg col-flex">
                <div className="row">
                    <div className="col-xs-4">
                        <i className="fa fa-shopping-cart fa-5x"></i>
                    </div>
                    <div className="col-xs-8 text-right">
                        <span> Average Trips / Customer</span>
                        <h2 className="font-bold">{this.props.data.averageTripsPerCustomer ? this.props.data.averageTripsPerCustomer.toFixed(1) : ''}</h2>
                            <span> Company Average: {this.props.alldata.averageTripsPerCustomer ? this.props.alldata.averageTripsPerCustomer.toFixed(1) : ''}</span>
                    </div>
                </div>
              </div>
              <div className="widget style1 navy-bg col-flex">
                <div className="row">
                    <div className="col-xs-4">
                        <i className="fa fa-money fa-5x"></i>
                    </div>
                    <div className="col-xs-8 text-right">
                        <span> Average Spend / Trip</span>
                        <h2 className="font-bold"> $ {this.props.data.averageSpendsPerTrip ? this.props.data.averageSpendsPerTrip.toFixed(2) : ''}</h2>
                            <span> Company Average: $ {this.props.alldata.averageSpendsPerTrip ? this.props.alldata.averageSpendsPerTrip.toFixed(2) : ''}</span>
                    </div>
                </div>
              </div>
              <div className="widget style1 navy-bg col-flex">
                <div className="row">
                    <div className="col-xs-4">
                        <i className="fa fa-money fa-5x"></i>
                    </div>
                    <div className="col-xs-8 text-right">
                        <span> Average Annual Spend</span>
                        <h2 className="font-bold"> $ {this.props.data.averageAnnualSpends ? this.props.data.averageAnnualSpends.toFixed(2) : ''}</h2>
                            <span> Company Average: $ {this.props.alldata.averageAnnualSpends ? this.props.alldata.averageAnnualSpends.toFixed(2) : ''}</span>
                    </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        )
    }
  }

  class Seasonality extends Component {
    componentDidMount(){
      var data = [
      ['Spend distribution index vs Company average', 0, 0, 0, 0]
      ]

      this.chart = c3.generate({
        bindto: '#seasonality',
        data: {
          columns: data,
          type: 'bar',
          color: function (color, d) {
            return d.value < 0 ? 'rgba(255, 99, 132, 0.6)' : 'rgba(55, 86, 186, 0.6)';
          }
        },
        bar: {
            width: {
                ratio: 0.5 // this makes bar width 50% of length between ticks
            }
        },
        axis: {
          y:{
            show: false,
          },
          x: {
            type: 'category',
            show: true,
            categories: ['Q 1', 'Q 2', 'Q 3', 'Q 4']  
          }
        },
        grid: {
          y: {
            lines: [
                {value: 0, text: '100%'}
            ]
        }
        },
        tooltip: {
          format: {
              value: function (value, ratio, id, index) {
                  return (parseFloat(value) + 100.0).toFixed(2) + "%";
                  }
      //            value: d3.format(',') // apply this format to both y and y2
              }
          }
      });
    }
    render(){
      if(this.props.data){
        if(this.chart){
          this.chart.load({columns: [
            ['Spend distribution index vs Company average', parseInt(this.props.data.q1) - 100, parseInt(this.props.data.q2) - 100, parseInt(this.props.data.q3) - 100, parseInt(this.props.data.q4) - 100]
          ]});
        }
      }
      return (
      <div className="ibox float-e-margins">
        <div className="ibox-title">
          <h3>Seasonality</h3>
        </div>
        <div className="ibox-content no-padding">
          <div id="seasonality"></div>
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
      var data = {awarenessFunnel: [], considerationFunnel: [], conversionFunnel: []};
        if(this.props.data.totalcustomers){
          data.awarenessFunnel = [["Unique Visitors (Customers)", this.props.data.totalcustomers],["Percent Non-referred", this.props.data.percentNonReferred]];
          data.considerationFunnel = [
            ["Visits per Visitor", this.props.data.visitsPerVisitor],
            ["Pages per Visit", this.props.data.pagesPerVisit],
            ["Average Duration (minutes)", this.props.data.averageDuration],
            ["Search Usage", this.props.data.searchUsage],
            ["Review Usage", this.props.data.reviewUsage]
          ];
          data.conversionFunnel = [
            ["Transaction Conversion", this.props.data.transactionConversion],
            ["Non-Referred Conversion rate", this.props.data.transactionNonReferredConversion],
            ["Search Conversion Rate", this.props.data.searchConversion],
            ["Review Conversion Rate", this.props.data.reviewConversion],
            ["Checkout Abandonment Rate", this.props.data.checkoutAbandonment]
          ];
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
                <div key={"awarenessrow" + i} className="widget style1 navy-bg col-flex" style={{marginRight: ((i * 3) + 5) + '%', marginLeft: ((i * 3) + 5) + '%'}}>
                <div className="row text-center">{row[0]}</div>
                <div className="row text-center"><h2 className="font-bold">{row[1].toFixed(2)}</h2></div>
                </div>
              );
            })}
          </div>
          <div className="col-sm-4" id="considerationFunnel">
          {data.considerationFunnel.map(function(row, i) {
            return (
                <div key={"considerationrow" + i} className="widget style1 navy-bg col-flex" style={{marginRight: ((i * 3) + 5) + '%', marginLeft: ((i * 3) + 5) + '%'}}>
                <div className="row text-center">{row[0]}</div>
                <div className="row text-center"><h2 className="font-bold">{row[1].toFixed(2)}</h2></div>
                </div>
              );
            })}
          </div>
          <div className="col-sm-4" id="conversionFunnel">
          {data.conversionFunnel.map(function(row, i) {
              return (
                <div key={"conversionrow" + i} className="widget style1 navy-bg col-flex" style={{marginRight: ((i * 3) + 5) + '%', marginLeft: ((i * 3) + 5) + '%'}}>
                <div className="row text-center">{row[0]}</div>
                <div className="row text-center"><h2 className="font-bold">{row[1].toFixed(2)}</h2></div>
                </div>
              );
            })}
          </div>
          </div>
      </div>
      )
    }
  }

  class ClusterOnlineShoppingBehavior extends Component {
    componentDidMount(){
    }

    componentWillReceiveProps(){
    }

    render(){
      return (
      <div className="ibox float-e-margins">
          <div className="ibox-title">
            <h3>Cluster Profile - Online Behavior</h3>
          </div>
          <div className="ibox-content no-padding">
            <div className="row">
              <div className="col-lg-6">
                <div className="ibox">
                  <div className="ibox-content">
                    <h5>
                    Number of Customers with online activity:{this.props.data.totalcustomers ? this.props.data.totalcustomers : ''}
                    </h5>
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="ibox">
                  <div className="ibox-content">
                    <h5>
                    Annual Spend online:${this.props.data.totalSpend ? this.props.data.totalSpend.toFixed(2) : ''}
                    </h5>
                  </div>
                </div>
              </div>
            </div>
            <div className="row row-flex">
              <div className="widget style1 navy-bg col-flex">
                  <div className="row">
                      <div className="col-xs-4">
                          <i className="fa fa-television fa-5x"></i>
                      </div>
                      <div className="col-xs-8 text-right">
                          <span> Browsed Product </span>
                          <h2 className="font-bold">{this.props.data.customersBrowsed ? this.props.data.customersBrowsed.toFixed(2) : ''}%</h2>
                      </div>
                  </div>
              </div>
              <div className="widget style1 navy-bg col-flex">
                  <div className="row">
                      <div className="col-xs-4">
                          <i className="fa fa-cart-arrow-down fa-5x"></i>
                      </div>
                      <div className="col-xs-8 text-right">
                          <span> Purchased Product </span>
                          <h2 className="font-bold">{this.props.data.customersPurchased ? this.props.data.customersPurchased.toFixed(2) : ''}%</h2>
                      </div>
                  </div>
              </div>
              <div className="widget style1 navy-bg col-flex">
                  <div className="row">
                      <div className="col-xs-4">
                          <i className="fa fa-shopping-cart fa-5x"></i>
                      </div>
                      <div className="col-xs-8 text-right">
                          <span> Percentage of purchase online </span>
                          <h2 className="font-bold">{this.props.data.totalSpend ? (((parseInt(this.props.data.totalSpend.toFixed(0))/(parseInt(this.props.data.totalSpend.toFixed(0))+parseInt(this.props.data.totalOfflineSpend.toFixed(0))))*100).toFixed(2)) : (0) }%</h2>
                      </div>
                  </div>
              </div>
            </div>
            <div className="row row-flex">
              <div className="widget style1 navy-bg col-flex">
                  <div className="row">
                      <div className="col-xs-4">
                          <i className="fa fa-cart-arrow-down fa-5x"></i>
                      </div>
                      <div className="col-xs-8 text-right">
                          <span> Purchases per customer </span>
                          <h2 className="font-bold">{this.props.data.avgPurchasePerCustomer ? this.props.data.avgPurchasePerCustomer.toFixed(2) : ''}</h2>
                      </div>
                  </div>
              </div>
              <div className="widget style1 navy-bg col-flex">
                  <div className="row">
                      <div className="col-xs-4">
                          <i className="fa fa-money fa-5x"></i>
                      </div>
                      <div className="col-xs-8 text-right">
                          <span> Spend per purchase </span>
                          <h2 className="font-bold">{this.props.data.avgSpendPerPurchase ? '$' + this.props.data.avgSpendPerPurchase.toFixed(2) : ''}</h2>
                      </div>
                  </div>
              </div>
              <div className="widget style1 navy-bg col-flex">
                  <div className="row">
                      <div className="col-xs-4">
                          <i className="fa fa-shopping-basket fa-5x"></i>
                      </div>
                      <div className="col-xs-8 text-right">
                          <span> Average basket size </span>
                          <h2 className="font-bold">{this.props.data.avgBasketSize ? this.props.data.avgBasketSize.toFixed(2) : ''}</h2>
                      </div>
                  </div>
              </div>
            </div>
        </div>
      </div>
      )
    }
  }

  class SegmentationDemographicSplit extends Component {

    componentDidMount(){
      var colors = Themes.palette1.pie_colors_simple;
      var data = [
      ["Young Singles", 40],
      ["Young Couples", 15],
      ["Mom & Baby", 34],
      ["Empty Nester", 30],
      ["Mature", 20]];
      var colorObj = {
            "Young Singles": colors[0],
            "Young Couples": colors[1],
            "Mom & Baby": colors[2],
            "Empty Nester": colors[3],
            "Mature": colors[4]
          };
      this.chart = c3.generate({
        bindto: '#lifestagedemographic',
        data:{
          columns: data,
          type : 'pie',
          colors: colorObj
        },
        pie: {
          label: {
            threshold: 0.1
          }
        },
        legend: {
          position: 'bottom'
        }
      });
    }

    componentWillReceiveProps(){
    }

    findWithAttr(array, attr, value){
      for (var i = 0; i < array.length; i += 1){
          if(array[i][attr] === value){
              return i;
              };
          };
      };

    render(){
      var self = this;
      var order = ["Young Singles", "Young Couples", "Mom & Baby", "Empty Nester", "Mature"];
      var data = "";
      var sum = 0;
      var data = [];
      if(this.props.data && this.props.alldata){
        this.props.data.map(function(object, i){
            data.push([object._id, parseInt(object.count)]);
          });
          this.props.alldata.map(function(object, i){
            sum += parseInt(object.count);
          });
        if(self.props.alldata.length > 0){
        var dataTable = order.map(function(object, i){
          var index = self.findWithAttr(self.props.alldata, '_id', object);
          if(self.props.alldata[index])
            return (<tr key={"row" + i}><td>{self.props.alldata[index]._id}</td><td>{((self.props.alldata[index].count/sum)*100).toFixed(1)}%</td></tr>);
          else
            return (<span></span>);
        });
        }
        if(this.chart)
          this.chart.load({columns: data});
      }
      return (
        <div className="ibox float-e-margins">
          <div className="ibox-title">
            <h3>Life Stage Split</h3>
          </div>
          <div className="ibox-content no-padding">
            <div className="col-sm-6">
              <div id="lifestagedemographic"></div>
            </div>
            <div className="col-sm-6" style={{marginTop: 20}}>
              <table className="table table-striped table-bordered">
              <thead>
              <tr>
              <th></th>
              <th>Total Company</th>
              </tr>
              </thead>
              <tbody>
                {dataTable}
              </tbody>
              </table>
            </div>
          </div>
        </div>
      )
    }
  }

  class SegmentationRFVSplit extends Component {
    componentDidMount(){
      var colors = Themes.palette1.pie_colors_simple;
      var data = [
      ['VIPs', 7.3],
      ['Convenience Shoppers', 5.2],
      ['Enthusiasts', 15.5],
      ['Explorers', 18],
      ['Least Engaged', 34.4]
      ]
      var colorObj = {
            "VIPs": colors[0],
            "Convenience Shoppers": colors[1],
            "Enthusiasts": colors[2],
            "Explorers": colors[3],
            "Least Engaged": colors[4]
          };
      this.chart = c3.generate({
        bindto: '#lifestagerfv',
        data:{
          columns: data,
          colors: colorObj,
          type : 'pie'
        },
        pie: {
          label: {
            threshold: 0.1
          }
        }
      });

    }

    findWithAttr(array, attr, value){
      for (var i = 0; i < array.length; i += 1){
          if(array[i][attr] === value){
              return i;
              };
          };
      };

    render(){
      var self = this;
      var order = ["VIPs", "Convenience Shoppers", "Enthusiasts", "Explorers", "Least Engaged"];
      var data = "";
      var sum = 0;
      var data = [];
      if(this.props.data && this.props.alldata){
        this.props.data.map(function(object, i){
          if(object._id != 'Occasional Spenders')
            data.push([object._id, parseInt(object.count)]);
          });
          this.props.alldata.map(function(object, i){
            if(object._id != 'Occasional Spenders')
              sum += parseInt(object.count);
          });
        if(self.props.alldata.length > 0){
        var dataTable = order.map(function(object, i){
          var index = self.findWithAttr(self.props.alldata, '_id', object);
          if(self.props.alldata[index])
            return (<tr key={"row" + i}><td>{self.props.alldata[index]._id}</td><td>{((self.props.alldata[index].count/sum)*100).toFixed(1)}%</td></tr>);
          else
            return (<span></span>);
        });
        }
        if(this.chart)
          this.chart.load({columns: data});
      }
      return (
        <div className="ibox float-e-margins">
          <div className="ibox-title">
            <h3>RFV Split</h3>
          </div>
          <div className="ibox-content no-padding">
            <div className="col-sm-6">
              <div id="lifestagerfv"></div>
            </div>
            <div className="col-sm-6" style={{marginTop: 20}}>
              <table className="table table-striped table-bordered">
              <thead>
              <tr>
              <th></th>
              <th>Total Company</th>
              </tr>
              </thead>
              <tbody>
                {dataTable}
              </tbody>
              </table>
            </div>
          </div>
        </div>
      )
    }
  }

  class Sentiment extends Component {
    componentDidMount(){
      var data = [
      ['Contribution', 1, 7, 8, 17, 27, 32, 28, 48],
      ['Sentiment Score', -78, -29, -3, -1, -26, -38, 4, -22]
      ]

      var chart = c3.generate({
        bindto: '#sentimentbar',
        data: {
          columns: data,
          type: 'bar',
          color: function (color, d) {
            if(d.id)
              return d.id === 'Sentiment Score' && Math.abs(d.value) > 50 ? 'rgba(255, 99, 132, 0.6)' : (d.id === 'Contribution' ? 'rgba(55, 86, 186, 0.6)' : 'rgba(245, 57, 20, 0.6)');
            },
          groups: [
          ['Contribution', 'Sentiment Score']
          ],
          order: 'asc',
          labels: {
            format: function (value, id, index, j) {
                if(id === "Sentiment Score")
                  return (parseFloat(value)/100.0).toFixed(2);
                else
                  return value.toFixed(0) + "%";
            }
          }
        },
        legend: {
          show: false
        },
        tooltip: {
          format: {
              value: function (value, ratio, id, index) {
                if(id === "Sentiment Score")
                  return (parseFloat(value)/100.0).toFixed(2);
                else
                  return value.toFixed(0) + "%";
                  }
              }
          },
        grid: {
          y: {
            lines: [{value:0}]
          }
        },
        axis: {
          rotated: true,
          x: {
            type: 'category',
            show: false,
            categories: ['Customer Care', 'Website', 'Brands', 'Material', 'Quantity', 'Purchase', 'Quality', 'Pricing']
          },
          y: {
            show: false
          }
        }
      });
    }

    componentWillReceiveProps(){

    }

    render(){
      return (
        <div className="ibox float-e-margins">
          <div className="ibox-title">
            <h3>Sentiment Analysis</h3>
          </div>
          <div className="ibox-content no-padding">
            <div className="col-sm-6 text-center">Sentiment Score</div>
            <div className="col-sm-6 text-center">Contribution</div>
            <div id="sentimentbar"></div>
          </div>
        </div>
      )
    }
  }

  class PurchaseRelatedFeedback extends Component {
    componentDidMount(){
      var colors = Themes.palette1.pie_colors_simple;
      var data = [
      ['Return Items', 17.5],
      ['Will Not Buy Again', 5.2],
      ['Buy Again', 15.5],
      ['Exchange', 42.5],
      ['Out of stock', 18]
      ]
      var colorObj = {
            "Return Items": colors[0],
            "Will Not Buy Again": colors[1],
            "Buy Again": colors[2],
            "Exchange": colors[3],
            "Out of stock": colors[4]
          };
      c3.generate({
        bindto: '#lifestagefeedback',
        data:{
          columns: data,
          legend: {
            position: 'right'
          },
          colors: colorObj,
          type : 'pie'
        },
        pie: {
          label: {
            threshold: 0.1
          }
        }
      });

    }
    render(){
      return (
        <div className="ibox float-e-margins">
          <div className="ibox-title">
            <h3>Purchase related feedback</h3>
          </div>
          <div className="ibox-content no-padding">
            <div id="lifestagefeedback"></div>
          </div>
        </div>
      )
    }
  }

  export default class Customers extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        filters: {
          age: {
            "min": parseInt(0),
            "max": parseInt(100)
          },
          recency: {
            "min": parseInt(-1),
            "max": parseInt(3651)
          },
          frequency: {
            "min": parseInt(-1),
            "max": parseInt(3651)
          },
          childrenInHouseholdClusterAvg: null,
          gender: null
        },
        data: {
          rfvSplit: [],
          demographicSplit: [], 
          clusterCharacteristics: {ageMedian: 0, femalePercentage: 0, childrenInHouseholdClusterAvg: 0, significantStates: {}},
          seasonality: {},
          clusterShoppingBehavior: {customerPercentOfCompany: 0, spendPercentOfCompany: 0, averageAnnualSpends: 0, averageSpendsPerTrip: 0, averageTripsPerCustomer: 0},
          onlineData: {},
          significantStates: {}
        },

        alldata: {
          rfvSplit: [],
          demographicSplit: [], 
          clusterCharacteristics: {ageMedian: 0, femalePercentage: 0, childrenInHouseholdClusterAvg: 0, significantStates: {}},
          seasonality: {},
          clusterShoppingBehavior: {customerPercentOfCompany: 0, spendPercentOfCompany: 0, averageAnnualSpends: 0, averageSpendsPerTrip: 0, averageTripsPerCustomer: 0},
          onlineData: {}
        },
        values: {}
      };
    }

    componentWillMount() {
      var childrenInHouseholdClusterAvg = this.state.filters.childrenInHouseholdClusterAvg === "Y" ? true : false;
      const sessionManager = SessionManager.instance;
      if(!sessionManager.isUserLoggedIn()) {
        this.props.router.push('/');
      }
      if(this.props.params.id !== "new" && this.props.params.id !== "all"){
        this.getCustomerGroup(this.props.params.id);
      }
      this.queryCustomerGroup({filters: [{
          "field": "Age",
          "type": "range",
          "min": this.state.filters.age.min,
          "max": this.state.filters.age.max
        },
        {
          "field": "DAYS_SINCE_LAST_PURCHASE",
          "type": "range",
          "min": this.state.filters.recency.min,
          "max": this.state.filters.recency.max
        },
        {
          "field": "AVG_DAYS_BETWEEN_ORDERS",
          "type": "range",
          "min": this.state.filters.frequency.min,
          "max": this.state.filters.frequency.max
        },
        {
          "field": "GENDER",
          "type": "list",
          "list": (this.state.filters.gender == null ? ["F", "M", "Others"] : [this.state.filters.gender])
        },
        {
          "field": "children_in_household",
          "type": "list",
          "list": (this.state.filters.childrenInHouseholdClusterAvg == null ? [true, false] : [childrenInHouseholdClusterAvg])
        }
        ], groupByField: "Life Stage"}, this.props.params.id);
    }

    handleAgeChange(component, values) {
      this.setState({
        filters: {age: values, recency: this.state.filters.recency, frequency: this.state.filters.frequency, childrenInHouseholdClusterAvg: this.state.filters.childrenInHouseholdClusterAvg, gender: this.state.filters.gender}
      });
    }

    handleAgeChangeComplete(component, values) {
      this.setState({
        filters: {age: values, recency: this.state.filters.recency, frequency: this.state.filters.frequency, childrenInHouseholdClusterAvg: this.state.filters.childrenInHouseholdClusterAvg, gender: this.state.filters.gender}
      }, function(){
        this.filterChanged(this.state.filters);
      });
    }

    handleChildrenChangeComplete(values) {
      this.setState({
        filters: {age: this.state.filters.age, recency: this.state.filters.recency, frequency: this.state.filters.frequency, childrenInHouseholdClusterAvg: values, gender: this.state.filters.gender}
      }, function(){
        this.filterChanged(this.state.filters);
      });
    }

    handleGenderChangeComplete(values) {
      console.log(this.gender);
      this.setState({
        filters: {age: this.state.filters.age, recency: this.state.filters.recency, frequency: this.state.filters.frequency, childrenInHouseholdClusterAvg: this.state.filters.childrenInHouseholdClusterAvg, gender: values}
      }, function(){
        this.filterChanged(this.state.filters);
      });
    }

    handleRecencyChange(minValue, maxValue){
      this.setState({
        filters: {age: this.state.filters.age, recency: {min: minValue, max: maxValue}, frequency: this.state.filters.frequency, childrenInHouseholdClusterAvg: this.state.filters.childrenInHouseholdClusterAvg, gender: this.state.filters.gender}
      }, function(){
        this.filterChanged(this.state.filters);
      });
    }

    handleFrequencyChange(minValue, maxValue){
      this.setState({
        filters: {age: this.state.filters.age, recency: this.state.filters.recency, frequency: {min: minValue, max: maxValue}, childrenInHouseholdClusterAvg: this.state.filters.childrenInHouseholdClusterAvg}
      }, function(){
        this.filterChanged(this.state.filters);
      });
    }

    filterChanged(data){
      var childrenInHouseholdClusterAvg = this.state.filters.childrenInHouseholdClusterAvg === "Y" ? true : false;
      var data = {
            filters: [{
              "field": "Age",
              "type": "range",
              "min": this.state.filters.age.min,
              "max": this.state.filters.age.max
            },
            {
              "field": "DAYS_SINCE_LAST_PURCHASE",
              "type": "range",
              "min": this.state.filters.recency.min,
              "max": this.state.filters.recency.max
            },
            {
              "field": "AVG_DAYS_BETWEEN_ORDERS",
              "type": "range",
              "min": this.state.filters.frequency.min,
              "max": this.state.filters.frequency.max
            },
            {
              "field": "GENDER",
              "type": "list",
              "list": (this.state.filters.gender == null ? ["F", "M", "Others"] : [this.state.filters.gender])
            },
            {
              "field": "children_in_household",
              "type": "list",
              "list": (this.state.filters.childrenInHouseholdClusterAvg == null ? [true, false] : [childrenInHouseholdClusterAvg])
            }],
            groupByField: "Life Stage"
          };
      this.queryCustomerGroup(data);
    }

    thisSetState(key, response){
      this.setState({
        [key]: {
          rfvSplit: response.payload.groupByRFV,
          numberOfCustomers: response.payload.numberOfCustomers,
          demographicSplit: response.payload.groupByCount, 
          clusterCharacteristics: {ageMedian: response.payload.ageMedian, femalePercentage: response.payload.femalePercentage, childrenInHouseholdClusterAvg: response.payload.childrenInHouseholdClusterAvg, significantStates: response.payload.significantStates},
          seasonality: response.payload.seasonality,
          clusterShoppingBehavior: {
          customerPercentOfCompany: response.payload.customerPercentOfCompany, 
          spendPercentOfCompany: response.payload.spendPercentOfCompany, 
          averageAnnualSpends: response.payload.averageAnnualSpends, 
          averageSpendsPerTrip: response.payload.averageSpendsPerTrip, 
          averageTripsPerCustomer: response.payload.averageTripsPerCustomer
          },
          onlineData: response.payload.onlineData
      }
      });
    }

    handleRadioChange(){
      console.log("CheckBox changed");
    }

    queryCustomerGroup(dummy, flag = "") {
      XyloFetch.queryC360(dummy)
        .then(response => {
          if(flag == "new" || flag == "all"){
            this.thisSetState('alldata', response);
            this.thisSetState('data', response);
          }
          else if(flag != ""){
            this.thisSetState('alldata', response);
          }
          else{
            this.thisSetState('data', response);
          }
        });
    }

    getCustomerGroup(id) {
      XyloFetch.getC360(id)
        .then(response => {
              this.setState({
                data: {
                  name:response.payload.name,
                  numberOfCustomers: response.payload.result.numberOfCustomers,
                  description: response.payload.description,
                  rfvSplit: response.payload.result.groupByRFV, 
                  demographicSplit: response.payload.result.groupByCount,
                  clusterCharacteristics: {ageMedian: response.payload.result.ageMedian, femalePercentage: response.payload.result.femalePercentage, childrenInHouseholdClusterAvg: response.payload.result.childrenInHouseholdClusterAvg, significantStates: response.payload.result.significantStates},
                  seasonality: response.payload.result.seasonality,
                  clusterShoppingBehavior: {customerPercentOfCompany: response.payload.result.customerPercentOfCompany, 
                  spendPercentOfCompany: response.payload.result.spendPercentOfCompany, 
                  averageAnnualSpends: response.payload.result.averageAnnualSpends, 
                  averageSpendsPerTrip: response.payload.result.averageSpendsPerTrip, 
                  averageTripsPerCustomer: response.payload.result.averageTripsPerCustomer
                  },
                  onlineData: response.payload.result.onlineData
              }
              });
        });
    }

    clearFilters(){
      this.setState({
        filters: {
          age: {
            "min": parseInt(0),
            "max": parseInt(100)
          },
          recency: {
            "min": parseInt(-1),
            "max": parseInt(3651)
          },
          frequency: {
            "min": parseInt(-1),
            "max": parseInt(3651)
          },
          childrenInHouseholdClusterAvg: null,
          gender: null
        }
      }, function(){
        this.filterChanged(this.state.filters);
      });
    }

    render() {
      return (
      <div className='xylo-page-heading'>

      <div className="row wrapper white-bg page-heading">
      <CustomersHeader id={this.props.params.id}/>
      </div>

      <div className="row">
        <CustomerGroupMenu data={this.state.filters} id={this.props.params.id} name={this.state.data.name}/>
      </div>

      <Layout className="xylo-search xylo-bg customers">
      <LayoutBody>
      { (() => {
      if(this.props.params.id == "new") {
      return(
        <SideBar>
        <div className="sk-layout__filters-row">
        <div className="sk-panel">
        <div className="sk-panel__header col-md-12">
        <span className="pull-left text-left">Customer Attributes</span><a onClick={this.clearFilters.bind(this)} className="pull-right text-right">Clear All</a>
        </div>
        <div className="sk-panel__content">
        <div className="sk-item-list-option__text">Age</div>
        <div>
          <div className="ptb-5">
          <InputRange
            maxValue={parseInt(100)}
            minValue={parseInt(0)}
            value={this.state.filters.age}
            onChange={this.handleAgeChange.bind(this)}
            onChangeComplete={this.handleAgeChangeComplete.bind(this)}
          />
          </div>
        </div>
        <div className="sk-item-list-option__text">Gender</div>
        <div className="ptb-5">
          <RadioGroup name="gender" className="new-line" value={this.state.filters.gender}>
            <Radio
              value="M"
              radioClass="iradio_square-green"
              increaseArea="20%"
              label="<span class='label1'>Male</span>"
              onClick={() => this.handleGenderChangeComplete("M")}
            />
            <Radio
              value="F"
              radioClass="iradio_square-green"
              increaseArea="20%"
              label="<span class='label1'>Female</span>"
              onClick={() => this.handleGenderChangeComplete("F")}
            />
            <Radio
              value=""
              radioClass="iradio_square-green"
              increaseArea="20%"
              label="<span class='label1'>Others</span>"
              onClick={() => this.handleGenderChangeComplete("Others")}
            />
          </RadioGroup>
        </div>
        <div className="sk-item-list-option__text">Have Children in household?</div>
        <div className="ptb-5">
          <RadioGroup name="children_in_household" className="new-line" value={this.state.filters.childrenInHouseholdClusterAvg ? this.state.filters.childrenInHouseholdClusterAvg.toString() : ""}>
            <Radio
              value="Y"
              radioClass="iradio_square-green"
              increaseArea="20%"
              label="<span class='label1'>Yes</span>"
              onClick={() => this.handleChildrenChangeComplete("Y")}
            />
            <Radio
              value="N"
              radioClass="iradio_square-green"
              increaseArea="20%"
              label="<span class='label1'>No</span>"
              onClick={() => this.handleChildrenChangeComplete("N")}
            />
          </RadioGroup>
        </div>
        <div className="sk-item-list-option__text">Recency</div>
        <div className="ptb-5">
          <RadioGroup name="recency" className="new-line" value={this.state.filters.recency.max ? this.state.filters.recency.max.toString() : ""}>
            <Radio
              value="6"
              radioClass="iradio_square-green"
              increaseArea="20%"
              label="<span class='label1'>Less than a week</span>"
              onClick={() => this.handleRecencyChange(0, 6)}
            />
            <Radio
              value="14"
              radioClass="iradio_square-green"
              increaseArea="20%"
              label="<span class='label1'>1 - 2 weeks</span>"
              onClick={() => this.handleRecencyChange(7, 14)}
            />
            <Radio
              value="28"
              radioClass="iradio_square-green"
              increaseArea="20%"
              label="<span class='label1'>2 - 4 weeks</span>"
              onClick={() => this.handleRecencyChange(14, 28)}
            />
            <Radio
              value="3650"
              radioClass="iradio_square-green"
              increaseArea="20%"
              label="<span class='label1'>Greater than 4 weeks</span>"
              onClick={() => this.handleRecencyChange(28, 3650)}
            />
          </RadioGroup>
        </div>
        <div className="sk-item-list-option__text">Frequency</div>
        <div className="ptb-5">
          <RadioGroup name="frequency" className="new-line" value={this.state.filters.frequency.max ? this.state.filters.frequency.max.toString() : ""}>
            <Radio
              value="7"
              radioClass="iradio_square-green"
              increaseArea="20%"
              label="<span class='label1'>Weekly or more</span>"
              onClick={() => this.handleFrequencyChange(0, 7)}
            />
            <Radio
              value="14"
              radioClass="iradio_square-green"
              increaseArea="20%"
              label="<span class='label1'>Biweekly</span>"
              onClick={() => this.handleFrequencyChange(7, 14)}
            />
            <Radio
              value="30"
              radioClass="iradio_square-green"
              increaseArea="20%"
              label="<span class='label1'>Monthly</span>"
              onClick={() => this.handleFrequencyChange(14, 30)}
            />
            <Radio
              value="3650"
              radioClass="iradio_square-green"
              increaseArea="20%"
              label="<span class='label1'>More</span>"
              onClick={() => this.handleFrequencyChange(31, 3650)}
            />
          </RadioGroup>
        </div>
        <div className="sk-item-list-option__text">Marital status</div>
        <div className="ptb-5">
          <RadioGroup name="marital-status" className="new-line">
            <Radio
              value="single"
              radioClass="iradio_square-green"
              increaseArea="20%"
              label="<span class='label1'>Single</span>"
            />
            <Radio
              value="married"
              radioClass="iradio_square-green"
              increaseArea="20%"
              label="<span class='label1'>Married</span>"
            />
            <Radio
              value="divorced"
              radioClass="iradio_square-green"
              increaseArea="20%"
              label="<span class='label1'>Divorced</span>"
            />
          </RadioGroup>
        </div>
        <div className="sk-item-list-option__text">Sales</div>
        <div className="ptb-5">
          <RadioGroup name="marital-status" className="new-line">
            <Radio
              value="veryhigh"
              radioClass="iradio_square-green"
              increaseArea="20%"
              label="<span class='label1'>Very High</span>"
            />
            <Radio
              value="high"
              radioClass="iradio_square-green"
              increaseArea="20%"
              label="<span class='label1'>High</span>"
            />
            <Radio
              value="medium"
              radioClass="iradio_square-green"
              increaseArea="20%"
              label="<span class='label1'>Medium</span>"
            />
            <Radio
              value="low"
              radioClass="iradio_square-green"
              increaseArea="20%"
              label="<span class='label1'>Low</span>"
            />
          </RadioGroup>
        </div>
        <div className="sk-item-list-option__text">Propensity to buy</div>
        <div className="ptb-5">
          <RadioGroup name="propensitytobuy" className="new-line">
            <Radio
              value="veryhigh"
              radioClass="iradio_square-green"
              increaseArea="20%"
              label="<span class='label1'>Very High</span>"
            />
            <Radio
              value="high"
              radioClass="iradio_square-green"
              increaseArea="20%"
              label="<span class='label1'>High</span>"
            />
            <Radio
              value="medium"
              radioClass="iradio_square-green"
              increaseArea="20%"
              label="<span class='label1'>Medium</span>"
            />
            <Radio
              value="low"
              radioClass="iradio_square-green"
              increaseArea="20%"
              label="<span class='label1'>Low</span>"
            />
          </RadioGroup>
        </div>
        <div className="sk-item-list-option__text">Predicted LTV</div>
        <div className="ptb-5">
          <RadioGroup name="predicted-ltv" className="new-line">
            <Radio
              value="veryhigh"
              radioClass="iradio_square-green"
              increaseArea="20%"
              label="<span class='label1'>Very High</span>"
            />
            <Radio
              value="high"
              radioClass="iradio_square-green"
              increaseArea="20%"
              label="<span class='label1'>High</span>"
            />
            <Radio
              value="medium"
              radioClass="iradio_square-green"
              increaseArea="20%"
              label="<span class='label1'>Medium</span>"
            />
            <Radio
              value="low"
              radioClass="iradio_square-green"
              increaseArea="20%"
              label="<span class='label1'>Low</span>"
            />
          </RadioGroup>
        </div>
        <div className="sk-item-list-option__text">Preferred communication channel</div>
        <div className="ptb-5">
          <RadioGroup name="preferred-communication" className="new-line">
            <Radio
              value="mail"
              radioClass="iradio_square-green"
              increaseArea="20%"
              label="<span class='label1'>Mail</span>"
            />
            <Radio
              value="call"
              radioClass="iradio_square-green"
              increaseArea="20%"
              label="<span class='label1'>Call</span>"
            />
          </RadioGroup>
        </div>
        <div className="sk-item-list-option__text">Propensity to churn</div>
        <div className="ptb-5">
          <RadioGroup name="propensity-to-churn" className="new-line">
            <Radio
              value="high"
              radioClass="iradio_square-green"
              increaseArea="20%"
              label="<span class='label1'>High</span>"
            />
            <Radio
              value="low"
              radioClass="iradio_square-green"
              increaseArea="20%"
              label="<span class='label1'>Low</span>"
            />
          </RadioGroup>
        </div>
        </div>
        </div>
        </div>

        </SideBar>
        )
      }
      else{
        return (
          <div></div>
        )
      }
    })()
    }
      <LayoutResults>
        <div className="m-t-sm">
          <div className="row">
            <div className="col-md-12">
              <ClusterCharacteristics data={this.state.data.clusterCharacteristics} alldata={this.state.alldata.clusterCharacteristics} id={this.props.params.id} description={this.state.data.description ? this.state.data.description : ''} numberOfCustomers={this.state.data.numberOfCustomers ? this.state.data.numberOfCustomers : ''} annualSpend={this.state.data.clusterShoppingBehavior.averageAnnualSpends ? this.state.data.clusterShoppingBehavior.averageAnnualSpends : ''}/>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <ClusterShoppingBehavior data={this.state.data.clusterShoppingBehavior} alldata={this.state.alldata.clusterShoppingBehavior}/>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <ClusterOnlineShoppingBehavior data={this.state.data.onlineData}/>
            </div>
            <div className="col-md-12">
              <ClusterConversionFunnel data={this.state.data.onlineData}/>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <Seasonality data={this.state.data.seasonality}/>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6">
              <SegmentationDemographicSplit data={this.state.data.demographicSplit} alldata={this.state.alldata.demographicSplit}/>
            </div>
            <div className="col-md-6">
              <SegmentationRFVSplit data={this.state.data.rfvSplit} alldata={this.state.alldata.rfvSplit}/>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6">
              <Sentiment />
            </div>
            <div className="col-md-6">
              <PurchaseRelatedFeedback />
            </div>
          </div>
        </div>
      </LayoutResults>
      </LayoutBody>

      </Layout>

      </div>

      );
    }
  }