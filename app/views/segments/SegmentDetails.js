import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { withRouter, Link, Location } from 'react-router';
import { Route, Router, IndexRedirect, browserHistory} from 'react-router';
import Moment from 'moment';
// import vex from 'vex';
import ReactBubbleChart from 'react-bubble-chart';

import Chart from 'chart.js';
import c3 from '../../../public/vendor/c3/c3.min.js';

import { Segments, SegmentClusters } from '../../components/common/Segments';
import Datamap from "datamaps/dist/datamaps.all.min.js";

import "select2/dist/js/select2.full.min.js";
import "../../../node_modules/select2/dist/css/select2.css";
import _ from 'lodash';

import * as XyloFetch from '../../components/common/XyloFetch';
import * as serverURLs from '../../components/common/UrlConstants';
var baseURL = serverURLs.BASE_URL;

import Loading from '../../components/common/Loading';

import * as Themes from '../../components/common/Themes';

import ClusterDemographics from './Clusters/Demographics';
import ClusterShopping from './Clusters/Shopping';
import ClusterOnline from './Clusters/Online';


/*=============================================>>>>>
= SegmentListHeader component =
===============================================>>>>>*/
class SegmentListHeader extends Component {
  render() {
    return (
      <div className="col-lg-10">
        <div className='xylo-page'>
          <h2>Cluster Profile</h2>
          <ol className="breadcrumb">
              <li>
                  <Link to="/segments/ma_dashboard">Segmentations</Link>
              </li>
              <li>
                  <Link to="/segments/ma_dashboard">{this.props.scheme_name}</Link>
              </li>
              <li>
                  <a><b>{this.props.cluster_name}</b></a>
              </li>
          </ol>
        </div>
      </div>
    );
  }
}
/*= End of SegmentListHeader component =*/
/*=============================================<<<<<*/

/*=============================================>>>>>
= SegmentListMenu component =
===============================================>>>>>*/
class SegmentListMenu extends Component {

  componentDidMount() {
    this.initMenu();
  }

  initMenu()
  {

    $(".select2_demo_1").select2({
      placeholder: "Select a Department",
      allowClear: true
    });

    $(".select2_demo_2").select2({
      placeholder: "Select a Category",
      allowClear: true
    });

    $(".select2_demo_3").select2({
      placeholder: "Select a SubCategory",
      allowClear: true
    });
  }


  render() {
    return (
      <div className="ibox-content m-b-sm border-bottom">
          <div className="row">
              <div className="col-md-4">
                <select className="select2_demo_1 form-control">
                   <option></option>
                   <option value="1">Electronics</option>
                   <option value="2">Apparel</option>
                   <option value="3">Stationery</option>
                </select>
             </div>
             <div className="col-md-4">
                <select className="select2_demo_2 form-control">
                   <option></option>
                   <option value="1">Computers</option>
                   <option value="2">Printers</option>
                   <option value="3">Routers</option>
                   <option value="4">TV</option>
                </select>
             </div>
             <div className="col-md-4">
                <select className="select2_demo_3 form-control">
                   <option></option>
                   <option value="Phones">Phones</option>
                   <option value="Desktops">Desktops</option>
                   <option value="Laptops">Laptops</option>
                   <option value="Servers">Servers</option>
                   <option value="Tablets">Tablets</option>
                </select>
             </div>
          </div>
        </div>
    )
  }
}
/*= End of SegmentListMenu component =*/
/*=============================================<<<<<*/


/*=============================================>>>>>
= SegmentList component =
===============================================>>>>>*/
class SegmentList extends Component {

  componentDidMount() {
  }


  render() {
    return (
       <div>
            <div className="col-lg-3">
                <div className="ibox">
                    <div className="ibox-content">
                        <h5 className="m-b-md">Server status Q12</h5>
                        <h2 className="text-navy">
                            <i className="fa fa-play fa-rotate-270"></i> Up
                        </h2>
                        <small>Last down 42 days ago</small>
                    </div>
                </div>
            </div>
            <div className="col-lg-3">
                <div className="ibox">
                    <div className="ibox-content ">
                        <h5 className="m-b-md">Server status Q13</h5>
                        <h2 className="text-navy">
                            <i className="fa fa-play fa-rotate-270"></i> Up
                        </h2>
                        <small>Last down 42 days ago</small>
                    </div>
                </div>
            </div>
        </div>
    )
  }
}
/*= End of SegmentList component =*/
/*=============================================<<<<<*/

@withRouter
class SegmentClusterLens extends Component {
  constructor(props) {
    super(props);
    this.tableData = [];
    this.state = {
      clusterData: null
    };
  }

  initChart(data) {

    if (!data.cluster_details.cluster_lens) {
      return;
    }

    var compwidth = $('.segment-detail-tab-container').width();
    if(window.innerWidth > 768) {
      compwidth = compwidth/2;
    }

    var chartdata = [];
    //var colors = ['#87CEEB', '#FF6A6A', '#EB8CC6', '#AB82FF', '#FF8C00'];
    var colors = Themes.palette1.pie_colors_simple;
    var colorObj = {};
    this.tableData = [];
    // var responseValues = data.cluster_details.cluster_lens.data.values;
    // var responseLabels = data.cluster_details.cluster_lens.data.labels;
		const companyTotal = data.company_details.groupByCount[0].count;

    var cluster_count = 0;
    data.cluster_details.cluster_lens.forEach(function(item, index) {
      cluster_count += item.count;
    });

    data.cluster_details.cluster_lens.forEach(function(item, index) {
      chartdata.push([item._id, item.count]);
      colorObj[item._id] = colors[index];
			const companyPercent = (item.count/companyTotal) * 100;
      const itemPercent = (item.count / cluster_count) * 100;
      this.tableData.push({
        name: item._id,
        value: itemPercent.toFixed(1),
        company_value: companyPercent.toFixed(1)
      });
      // responseValues.push(item.count);
      // responseLabels.push(item._id);
    }.bind(this));

    // responseValues.forEach(function(item, index) {
    //   chartdata.push([responseLabels[index], item]);
    //   colorObj[responseLabels[index]] = colors[index];
    //   this.tableData.push({name: responseLabels[index], value: item});
    // }.bind(this));
    c3.generate({
      bindto: '#otherSegmentPie',
      data:{
        columns: chartdata,
        colors: colorObj,
        type : 'pie'
      },
      size: {
        width: compwidth
      }
    });

  }

	componentWillMount() {
		this.setState({id: this.props.id, clusterData: this.props.data});
	}

  componentDidMount() {
    if(this.props.data && this.props.data.cluster_details) {
      this.setState({clusterData: this.props.data});
      this.initChart(this.props.data);
    } else {
      this.setState({clusterData: null});
    }
  }

	componentWillReceiveProps(props) {
    this.setState({clusterData: props.data});
    this.initChart(props.data);
	}

  render() {
    var heading;
    if (this.props.scheme_name === 'Life Stage') {
      heading = 'Distribution of RFV Cluster within this Cluster';
    }
    else {
      heading = 'Distribution of Life Stage Cluster within this Cluster';
    }


    return (
        <div className="ibox float-e-margins">
          <div className="ibox-content" style={{borderStyle: 'none'}}>
            <h2 className="m-b-md" style={{textAlign: "center", paddingTop: 10}}>{heading}</h2>
            <div className="row" style={{paddingTop: 30}}>
              <div className="col-sm-6">
                <div id="otherSegmentPie"></div>
              </div>
              <div className="col-sm-3" style={{marginTop: 20}}>
                <table className="table table-striped table-bordered table-hover">
                  <thead>
                    <tr>
                      <th></th>
                      <th>Total Company</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      this.tableData.map(function(item, index) {
                        var bgColor = Themes.palette1.pie_colors[index].bgColor;
                        return(
                          <tr key={item.name}>
                            <td style={{backgroundColor: bgColor }}>{item.name}</td>
                            <td align="center">{item.company_value + "%"}</td>
                          </tr>
                        )
                      }.bind(this))
                    }
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
    )

  }

}

class SegmentTabDemographics extends Component {
  //init chart
  initChart(data) {
    var self = this;
    var cluster_details = [
      data.cluster_details.ageMedian[0].Age,
      data.cluster_details.femalePercentage.toFixed(2),
      data.cluster_details.childrenInHouseholdClusterAvg.toFixed(2),
      data.cluster_details["HH Income $0-$49K"].toFixed(2),
      data.cluster_details["HH Income $50-$99K"].toFixed(2),
      data.cluster_details["HH Income $100K+"].toFixed(2)
    ];

    var company_details = [
      data.company_details.ageMedian[0].Age,
      data.company_details.femalePercentage.toFixed(2),
      data.company_details.childrenInHouseholdClusterAvg.toFixed(2),
      data.company_details["HH Income $0-$49K"].toFixed(2),
      data.company_details["HH Income $50-$99K"].toFixed(2),
      data.company_details["HH Income $100K+"].toFixed(2)
    ];
    var barOptions = {
      responsive: true,
      scales: {
        yAxes: [{
          display: true,
          ticks: {
            beginAtZero: true // minimum value will be 0.
          }
        }]
      }
    };
    var barData = {
      labels: ["Median Age", "Female Percentage", "Children in household", "HH Income $0-$49K", "HH Income $50-$99K", "HH Income $100K+"],
      datasets: [
       {
         label: "Cluster Average",
         backgroundColor: Themes.palette1.bar_colors[0].bgColor,
         pointBorderColor: "#fff",
         data: cluster_details
       },
       {
         label: "Company Average",
         backgroundColor: Themes.palette1.bar_colors[1].bgColor,
         borderColor: "#98F5FF",
         pointBackgroundColor: "#98F5FF",
         pointBorderColor: "#fff",
         data: company_details
       }
      ]
    };

    var ctx2 = document.getElementById("barChart").getContext("2d");
    if(self.chartRef) {
      self.chartRef.destroy();
    }
    self.chartRef = new Chart(ctx2, {type: 'bar', data: barData, options:barOptions});
  }

  componentDidMount() {
    if(this.props.data && this.props.data.cluster_details) {
      this.initChart(this.props.data);
    }
  }

  componentWillReceiveProps(props) {
    this.initChart(props.data);
  }

  render() {
    return (
      <div className="row">
        <h3 className="m-b-md" style={{textAlign: "center", paddingTop: 30}}>Demographics Metrics - Cluster vs Company Average</h3>
        <div className="col-sm-offset-1 col-sm-10" style={{paddingTop: 30}}>
          <canvas id="barChart" height="130"></canvas>
        </div>
      </div>
    )
  }
}

class SegmentTabGeography extends Component {
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
    data.cluster_details.significantStates.overRepresented.forEach(function(item) {
      geo_data[item] = { fillKey: "overRepresented" };
    });
    data.cluster_details.significantStates.underRepresented.forEach(function(item) {
      geo_data[item] = { fillKey: "underRepresented" };
    });
    //console.log("geo"); console.log(geo_data);
    if(this.chartRef) {
      $("#usa_map").parent().append( "<div id='usa_map'></div>");
      $("#usa_map").remove();
    } else {
      this.chartHeight = $('.segment-detail-tab-container').width() / 1.6;
    }

    this.chartRef = new Datamap({
        element: document.getElementById("usa_map"),
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
      defaultFillName: "Neutral",
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
    if(this.props.data && this.props.data.cluster_details) {
      this.setState({clusterData: this.props.data});
      this.initChart(this.props.data);
    } else {
      this.setState({clusterData: null});
    }
  }

  componentWillReceiveProps(props) {
    this.setState({clusterData: this.props.data});
    this.initChart(props.data);
  }

  render() {
    return (
      <div className="row">

         <h2 className="m-b-md" style={{textAlign: "center", paddingTop: 10}}>Geography Metrics</h2>

        <div className="col-lg-12">
          <div className="ibox float-e-margins">
            <div className="ibox-content" style={{borderStyle: 'none'}}>
              <div id="usa_map"></div>
            </div>
          </div>
        </div>

      </div>
    )
  }
}

class SegmentTabLifeStage extends Component {
  constructor(props) {
    super(props);
    this.tableData=[];
    this.state = {
      clusterData: null
    }
  }

  initChart(data) {

    if (!data.cluster_details.lifestage)
      return;

    var compwidth = $('.segment-detail-tab-container').width();
    if(window.innerWidth > 768) {
      compwidth = compwidth/2;
    }

    var chartdata = [];
    //var colors = ['#87CEEB', '#FF6A6A', '#00BFFF', '#1BCDD1', '#FF8C00', '#CD919E', '#EB8CC6'];
    var colors = Themes.palette1.pie_colors_simple;
    var colorObj = {};
    this.tableData = [];
    var responseValues = data.cluster_details.lifestage.data.values;
    var responseLabels = data.cluster_details.lifestage.data.labels;
    responseValues.forEach(function(item, index) {
      chartdata.push([responseLabels[index], item]);
      colorObj[responseLabels[index]] = colors[index];
      this.tableData.push({name: responseLabels[index], value: item});
    }.bind(this));

    c3.generate({
      bindto: '#lifestage',
      data:{
        columns: chartdata,
        colors: colorObj,
        type : 'pie'
      },
      size: {
        width: compwidth
      }
    });
  }

  componentWillMount() {
    this.setState({clusterData: this.props.data});
  }

  componentDidMount() {
    if(this.props.data && this.props.data.cluster_details) {
      this.setState({clusterData: this.props.data});
      this.initChart(this.props.data);
    } else {
      this.setState({clusterData: null});
    }
  }

  componentWillReceiveProps(props) {
    this.setState({clusterData: props.data});
    this.initChart(props.data);
  }

  render() {
    return (
      <div className="ibox float-e-margins">
        <div className="ibox-content" style={{borderStyle: 'none'}}>
          <div className="row">
            <div className="col-xs-12 col-sm-6">
              <div id="lifestage"></div>
            </div>
            <div className="col-xs-12 col-sm-6" style={{marginTop: 20}}>
            <table className="table table-bordered table-striped table-hover">
              <thead>
                <tr>
                  <th></th>
                  <th>Total Company</th>
                </tr>
              </thead>
              <tbody>
                {
                  this.tableData.map(function(item) {
                    return(
                      <tr key={item.name}>
                        <td>{item.name}</td>
                        <td>{item.value}%</td>
                      </tr>
                    )
                  }.bind(this))
                }
              </tbody>
            </table>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

class SegmentTabBestLightValue extends Component {
  constructor(props) {
    super(props);
    this.tableData=[];
    this.state = {
      clusterData: null
    };
  }

  initChart(data) {
    var compwidth = $('.segment-detail-tab-container').width();
    if(window.innerWidth > 768) {
      compwidth = compwidth/2;
    }

    var chartdata = [];
    var colors = ['#87CEEB', '#FF6A6A', '#B08BEB', '#EB8CC6'];
    var colorObj = {};
    this.tableData = [];
    var responseValues = data.cluster_details.best_light_value.data.values;
    var responseLabels = data.cluster_details.best_light_value.data.labels;
    responseValues.forEach(function(item, index) {
      chartdata.push([responseLabels[index], item]);
      colorObj[responseLabels[index]] = colors[index];
      this.tableData.push({name: responseLabels[index], value: item});
    }.bind(this));

    c3.generate({
      bindto: '#lightvalue',
      data:{
        columns: chartdata,
        colors: colorObj,
        type : 'pie'
      },
      size: {
        width: compwidth
      }
    });
  }

  componentWillMount() {
    this.setState({clusterData: this.props.data});
  }

  componentDidMount() {
    if(this.props.data && this.props.data.cluster_details) {
      this.setState({clusterData: this.props.data});
      this.initChart(this.props.data);
    } else {
      this.setState({clusterData: null});
    }
  }

  componentWillReceiveProps(props) {
    this.setState({clusterData: props.data});
    this.initChart(props.data);
  }

  render() {
    return (
      <div className="ibox float-e-margins">
        <div className="ibox-content" style={{borderStyle: 'none'}}>
          <div className="row">
            <div className="col-xs-12 col-sm-6">
              <div id="lightvalue"></div>
            </div>
            <div className="col-xs-12 col-sm-6" style={{marginTop: 20}}>
            <table className="table table-striped table-bordered table-hover">
               <thead>
                 <tr>
                   <th></th>
                   <th>Total Company</th>
                 </tr>
               </thead>
               <tbody>
                 {
                   this.tableData.map(function(item) {
                     return(
                       <tr key={item.name}>
                         <td>{item.name}</td>
                         <td>{item.value}%</td>
                       </tr>
                     )
                   }.bind(this))
                 }
               </tbody>
             </table>
            </div>
          </div>
        </div>
      </div>
    )
  }

}

class SegmentTabShopping extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categories_overview: [],
      clusterData: null
    };
  }

  initChart1(data) {
    var self = this;
    var company_spend = [
      data.company_details.spendPercentOfCompany.toFixed(2),
      data.company_details.customerPercentOfCompany.toFixed(2)
    ];
    var segment_spend = [
      data.cluster_details.spendPercentOfCompany.toFixed(2),
      data.cluster_details.customerPercentOfCompany.toFixed(2)
    ];
    var barOptions = {
      responsive: true
    };
    var barData = {
      labels: ["Company Guests", "Company Spend"],
      datasets: [
       {
         label: "Cluster Average",
         backgroundColor: Themes.palette1.bar_colors[0].bgColor,
         pointBorderColor: "#fff",
         data: segment_spend
       },
       {
         label: "Company Average",
         backgroundColor: Themes.palette1.bar_colors[1].bgColor,
         borderColor: "rgba(135, 206, 255, 0.7)",
         pointBackgroundColor: "rgba(135, 206, 255, 0.7)",
         pointBorderColor: "#fff",
         data: company_spend
       }
      ]
    };

    var ctx2 = document.getElementById("shoppingChart").getContext("2d");
    if(self.chartRef) {
      self.chartRef.destroy();
    }
    self.chartRef = new Chart(ctx2, {type: 'bar', data: barData, options:barOptions});
  }

  initChart2(data) {
    var self = this;
    var company_spend = [
      data.company_details.averageSpendsPerTrip.toFixed(2),
      data.company_details.averageAnnualSpends.toFixed(2)
    ];
    var segment_spend = [
      data.cluster_details.averageSpendsPerTrip.toFixed(2),
      data.cluster_details.averageAnnualSpends.toFixed(2)
    ];
    var barOptions = {
      responsive: true
    };
    var barData = {
      labels: ["Avg Spends / Trip", "Avg Annual Spend"],
      datasets: [
       {
         label: "Cluster Average",
         backgroundColor: Themes.palette1.bar_colors[0].bgColor,
         pointBorderColor: "#fff",
         data: segment_spend
       },
       {
         label: "Company Average",
         backgroundColor: Themes.palette1.bar_colors[1].bgColor,
         borderColor: "rgba(135, 206, 255, 0.7)",
         pointBackgroundColor: "rgba(135, 206, 255, 0.7)",
         pointBorderColor: "#fff",
         data: company_spend
       }
      ]
    };
    var ctx2 = document.getElementById("shoppingChart2").getContext("2d");
    if(self.chartRef2) {
      self.chartRef2.destroy();
    }
    self.chartRef2 = new Chart(ctx2, {type: 'bar', data: barData, options:barOptions});
  }

  initChart3(data) {
    var self = this;
    var company_spend = [data.company_details.averageTripsPerCustomer];
    var segment_spend = [data.cluster_details.averageTripsPerCustomer];
    var barOptions = {
      responsive: true
    };
    var barData = {
      labels: ["Avg Trips / Customer"],
      datasets: [
       {
         label: "Cluster Average",
         backgroundColor: Themes.palette1.bar_colors[0].bgColor,
         pointBorderColor: "#fff",
         data: segment_spend
       },
       {
         label: "Company Average",
         backgroundColor: Themes.palette1.bar_colors[1].bgColor,
         borderColor: "rgba(135, 206, 255, 0.7)",
         pointBackgroundColor: "rgba(135, 206, 255, 0.7)",
         pointBorderColor: "#fff",
         data: company_spend
       }
      ]
    };

    var ctx2 = document.getElementById("shoppingChart3").getContext("2d");
    if(self.chartRef3) {
      self.chartRef3.destroy();
    }
    self.chartRef3 = new Chart(ctx2, {type: 'bar', data: barData, options:barOptions});
  }

  componentDidMount() {
    if(this.props.data && this.props.data.cluster_details) {
      this.setState({clusterData: this.props.data, categories_overview: this.props.data.cluster_details.shopping.categories_overview});
      this.initChart1(this.props.data);
      this.initChart2(this.props.data);
      this.initChart3(this.props.data);
    } else {
      this.setState({clusterData: null, categories_overview: []});
    }
  }

  componentWillReceiveProps(props) {
    this.setState({clusterData: props.data, categories_overview: props.data.cluster_details.shopping.categories_overview});
    this.initChart1(props.data);
    this.initChart2(props.data);
    this.initChart3(props.data);
  }

  render() {
    return (
      <div>
        <div className="row">
          <div className="col-sm-12">
            <h3 className="m-b-md" style={{textAlign: "center", paddingTop: 10}}>Shopping Metrics - Cluster vs Company Average</h3>
            <div className="row" style={{paddingTop: 30}}>
              <div className="col-xs-12 col-sm-6">
                <canvas id="shoppingChart" height="180"></canvas>
              </div>
              <div className="col-xs-12 col-sm-6">
                <canvas id="shoppingChart3" height="180"></canvas>
              </div>
            </div>
            <div className="row" style={{marginTop: 30}}>
              <div className="col-xs-12 col-sm-6">
                <canvas id="shoppingChart2" height="180"></canvas>
              </div>
              <div className="col-xs-12 col-sm-6">
                {
                  (() => {
                    if(this.state.clusterData && this.state.clusterData.cluster_details) {
                      return (
                        <table className="table table-bordered table-striped table-hover">
                          <thead>
                            <tr>
                              <th></th>
                              <th>Cluster Average</th>
                              <th>Company Average</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>% of all Company Customers</td>
                              <td>{this.state.clusterData.cluster_details.customerPercentOfCompany.toFixed(2) + "%"}</td>
                              <td>{this.state.clusterData.cluster_details.spendPercentOfCompany.toFixed(2) + "%"}</td>
                            </tr>
                            <tr>
                              <td>% of all Company Spend</td>
                              <td>{this.state.clusterData.company_details.customerPercentOfCompany + "%"}</td>
                              <td>{this.state.clusterData.company_details.spendPercentOfCompany + "%"}</td>
                            </tr>
                            <tr>
                              <td>Average Trips / Customer</td>
                              <td>{this.state.clusterData.cluster_details.averageTripsPerCustomer}</td>
                              <td>{this.state.clusterData.company_details.averageTripsPerCustomer}</td>
                            </tr>
                            <tr>
                              <td>Average Spend / Trip</td>
                              <td>{"$ " + this.state.clusterData.cluster_details.averageSpendsPerTrip.toFixed(2)}</td>
                              <td>{"$ " + this.state.clusterData.company_details.averageSpendsPerTrip.toFixed(2)}</td>
                            </tr>
                            <tr>
                              <td>Average Annual Spend</td>
                              <td>{"$ " + this.state.clusterData.cluster_details.averageAnnualSpends.toFixed(2)}</td>
                              <td>{"$ " + this.state.clusterData.company_details.averageAnnualSpends.toFixed(2)}</td>
                            </tr>
                          </tbody>
                        </table>
                      )
                    }
                  })()
                }
              </div>
            </div>
          </div>
        </div>
        {/* <div className="row">
          <div className="col-sm-12" style={{marginTop: 20}}>
            <h3 style={{textAlign: 'center'}}>Categories Overview</h3>
            <div className='row'>
              {
                this.state.categories_overview.map(function(item, i) {
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
                    <div key={item.title+i} className="col-lg-3">
                      <div className="ibox" style={{border: '1px solid #ccc'}}>
                        <div className="ibox-content">
                          <h5 className="m-b-md">{item.title}</h5>
                          <h2 className={textClass}>
                              <i className={arrowClass}></i> Up
                          </h2>
                          <small>Last down {item.last_updated_days} days ago</small>
                        </div>
                      </div>
                    </div>
                  )
                })
              }
            </div>
          </div>
        </div> */}
      </div>
    )
  }

}

class SegmentTabSeasonality extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clusterData: null
    };
  }

  initChart(data) {
    var self = this;
    var chartColorArray = [];
    var chartData = [(parseInt(data.cluster_details.seasonality.q1.toFixed(2)) - 100),
											(parseInt(data.cluster_details.seasonality.q2.toFixed(2)) - 100),
											(parseInt(data.cluster_details.seasonality.q3.toFixed(2)) - 100),
											(parseInt(data.cluster_details.seasonality.q4.toFixed(2)) - 100)];

    chartData.forEach(function(item) {
      if(item >= 0) { //green
        chartColorArray.push(Themes.palette1.bar_colors[3].bgColor);
      } else if(item < 0) { //red
        chartColorArray.push(Themes.palette1.bar_colors[4].bgColor);
      }
    });
    var barOptions = {
      responsive: true,
			tooltips: {
				callbacks: {
					label: function(tooltipItem, data) {
						var value = parseInt(tooltipItem.yLabel) + 100;
						return " " + value + "%";
					}
				}
			},
      scales: {
        yAxes: [{
          display: true,
          ticks: {
              beginAtZero: true,   // minimum value will be 0.
							callback: function(label, index, labels) {
						      return parseInt(label) + 100;
						  }
          }

				}]
      }
    };

    var barData = {
      labels: ["2016 Q-1", "2016 Q-2", "2016 Q-3", "2016 Q-4"],
      datasets: [
       {
         label: "Spend Distribution Index vs Company Average",
         backgroundColor: chartColorArray,
         borderColor: "rgba(255, 182, 193, 0.7)",
         pointBackgroundColor: "rgba(255, 182, 193, 0.7)",
         pointBorderColor: "#fff",
         data: chartData
       }
      ]
    };

    var ctx2 = document.getElementById("seasonalityChart").getContext("2d");
    if(self.chartRef) {
      self.chartRef.destroy();
    }
    self.chartRef = new Chart(ctx2, {type: 'bar', data: barData, options:barOptions});
  }

  componentWillMount() {
    this.setState({clusterData: this.props.data});
  }

  componentDidMount() {
    if(this.props.data && this.props.data.cluster_details) {
      this.setState({clusterData: this.props.data});
      this.initChart(this.props.data);
    } else {
      this.setState({clusterData: null});
    }
  }

  componentWillReceiveProps(props) {
    this.setState({clusterData: props.data});
    this.initChart(props.data);
  }

  render() {
    return (
      <div className="row">
        <h2 className="m-b-md" style={{textAlign: "center", paddingTop: 10}}>Seasonality</h2>
        <div className="col-sm-offset-1 col-sm-10" style={{paddingTop: 30}}>
          <canvas id="seasonalityChart" height="100"></canvas>
        </div>
      </div>
    )
  }
}

class SegmentTabHeading extends Component {
  render() {
    return (
      <div className="row" style={{paddingTop: 30}}>
        <div className="col-sm-offset-3 col-sm-6">
          <h2 className="m-b-md" style={{textAlign: "center", paddingTop: 10}}>{this.props.heading}</h2>
        </div>
      </div>
    );
  }

}

class SegmentTabMigration extends Component {
  constructor(props) {
    super(props)
    this.tableData = [];
    this.state = {
      clusterData: null
    };
  }

  initChart(data) {
    var compwidth = $('.segment-detail-tab-container').width();
    if(window.innerWidth > 768) {
      compwidth = compwidth/2;
    }

    var chartdata = [];
    var colors = Themes.palette1.pie_colors_simple;
    var colorObj = {};
    this.tableData = [];
    if(data.cluster_details.migration2015) {
      var migrationValues = data.cluster_details.migration2015;
      migrationValues.forEach(function(item, index) {
        var item_val = Math.round((item.count / data.num_of_customers) * 100);
        chartdata.push([item._id, item_val]);
        colorObj[item._id] = colors[index];
        this.tableData.push({name: item._id, value: item_val});
      }.bind(this));

      c3.generate({
        bindto: '#migrationChart',
        data:{
          columns: chartdata,
          colors: colorObj,
          type : 'pie'
        },
        legend: {
          position: 'right'
        },
        size: {
          width: compwidth
        }
      });
    }
  }

  componentWillMount() {
    this.setState({clusterData: this.props.data});
  }

  componentDidMount() {
    if(this.props.data && this.props.data.cluster_details) {
      this.setState({clusterData: this.props.data});
      this.initChart(this.props.data);
    } else {
      this.setState({clusterData: null});
    }
  }

  componentWillReceiveProps(props) {
    this.setState({clusterData: props.data});
    this.initChart(props.data);
  }

  render() {
    return (
      <div className="ibox float-e-margins">
        <div className="ibox-content" style={{borderStyle: 'none'}}>
          <SegmentTabHeading
            heading="Clusters these customers were in last year"
            />
          <div className="row">
            <div className="col-sm-offset-3 col-sm-6">
              <div id="migrationChart"></div>
            </div>
            {/*
            <div className="col-xs-12 col-sm-6" style={{marginTop: 20}}>
              <table className="table table-striped table-bordered table-hover">
                <thead>
                  <tr>
                    <th>Cluster</th>
                    <th>Percent</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    this.tableData.map(function(item) {
                      return(
                        <tr key={item.name}>
                          <td>{item.name}</td>
                          <td>{item.value}%</td>
                        </tr>
                      )
                    }.bind(this))
                  }
                </tbody>
              </table>
            </div>
          */}
          </div>
        </div>
      </div>
    )
  }
}


class SegmentTabOnlineBehavior extends Component {
  constructor(props) {
    super(props);
    this.trafficSource = [];
    this.OBdata = {};
    this.state = {
      trafficData: {},
      clusterData: null
    };
  }

  initChart(data) {
    this.trafficSource = {};
    this.trafficSource =  data.cluster_details.online_behaviour;
    //console.log("trafficdata"); console.log(this.trafficSource);
    this.setState({trafficData: this.trafficSource});
  }

  onTrafficSourceChange(e) {
    this.setState({trafficData: this.OBdata[e.target.value]});

  }

  ratio (a, b) {
    return (b == 0) ? a : this.ratio (b, a%b);
  }

  componentWillMount() {
    this.setState({clusterData: this.props.data});
  }

  componentDidMount() {
    if(this.props.data && this.props.data.cluster_details) {
      this.setState({clusterData: this.props.data});
      this.initChart(this.props.data);
    } else {
      this.setState({clusterData: null, trafficData: {}});
    }
  }

  componentWillReceiveProps(props) {
    this.setState({clusterData: props.data});
    this.initChart(props.data);
  }

  render() {
    console.log("Segment Online Behavior");
    console.log(this.state.trafficdata);
    var data = {awarenessFunnel: [], considerationFunnel: [], conversionFunnel: []};
        if(this.state.trafficData.totalcustomers){
          data.awarenessFunnel = [["Unique Visitors (Customers)", this.state.trafficData.totalcustomers],["Percent Non-referred", this.state.trafficData.percentNonReferred]];
          data.considerationFunnel = [
            ["Visits per Visitor", this.state.trafficData.visitsPerVisitor],
            ["Pages per Visit", this.state.trafficData.pagesPerVisit],
            ["Average Duration (minutes)", this.state.trafficData.averageDuration],
            ["Search Usage", this.state.trafficData.searchUsage],
            ["Review Usage", this.state.trafficData.reviewUsage]
          ];
          data.conversionFunnel = [
            ["Transaction Conversion", this.state.trafficData.transactionConversion],
            ["Non-Referred Conversion rate", this.state.trafficData.transactionNonReferredConversion],
            ["Search Conversion Rate", this.state.trafficData.searchConversion],
            ["Review Conversion Rate", this.state.trafficData.reviewConversion],
            ["Checkout Abandonment Rate", this.state.trafficData.checkoutAbandonment]
          ];
        }
    return (
      <div>
        <div className="no-padding">
            <div className="row">
              <div className="col-lg-6">
                <div>
                  <div>
                    <h5>
                    Number of Customers with online activity:{this.state.trafficData.totalcustomers ? this.state.trafficData.totalcustomers : 0}
                    </h5>
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <div>
                  <div>
                    <h5>
                    Annual Spend online:${this.state.trafficData.totalSpend ? this.state.trafficData.totalSpend.toFixed(2) : 0}
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
                          <h2 className="font-bold">{this.state.trafficData.customersBrowsed ? this.state.trafficData.customersBrowsed.toFixed(2) : 0}%</h2>
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
                          <h2 className="font-bold">{this.state.trafficData.customersPurchased ? this.state.trafficData.customersPurchased.toFixed(2) : 0}%</h2>
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
                          <h2 className="font-bold">{this.state.trafficData.totalSpend ? (((parseInt(this.state.trafficData.totalSpend.toFixed(0))/(parseInt(this.state.trafficData.totalSpend.toFixed(0))+parseInt(this.state.trafficData.totalOfflineSpend.toFixed(0))))*100).toFixed(2)) : (0) }%</h2>
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
                          <h2 className="font-bold">{this.state.trafficData.avgPurchasePerCustomer ? this.state.trafficData.avgPurchasePerCustomer.toFixed(2) : 0}</h2>
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
                          <h2 className="font-bold">{this.state.trafficData.avgSpendPerPurchase ? '$' + this.state.trafficData.avgSpendPerPurchase.toFixed(2) : 0}</h2>
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
                          <h2 className="font-bold">{this.state.trafficData.avgBasketSize ? this.state.trafficData.avgBasketSize.toFixed(2) : 0}</h2>
                      </div>
                  </div>
              </div>
            </div>
        </div>
        <div className="row no-padding">
          <div className="col-sm-12 text-left">
            <div className="ibox"> 
              <div className="ibox-content">
                <h5>
                  Cluster Conversion Funnel
                </h5>
              </div>
            </div>
          </div>
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


/*=============================================>>>>>
= SegmentMain component =
===============================================>>>>>*/
class SegmentMain extends Component {
  constructor(props) {
    super(props);

    this.state = {
      clusterData: {}
    };
  }

  componentWillMount(){
    this.setState({clusterData: this.props.clusterData});
  }

  componentDidMount() {
    this.setState({clusterData: this.props.clusterData});
  }

  componentWillReceiveProps(props) {
    this.setState({clusterData: this.props.clusterData});
  }

  isFloat(n){
    return Number(n) === n && n % 1 !== 0;
  }

  render() {

    var thumbnail;
    if (this.props.clusterData.thumbnail) {
      thumbnail = baseURL + "/logos/" + this.props.clusterData.thumbnail;
    }
    else {
      thumbnail = 'http://ipsumimage.appspot.com/300x200?l=' + this.props.clusterData.name;
    }

    if(this.props.clusterData.cluster_details === null) {
      return (
        <div className="row">
          <div className="col-lg-9">
            <div className="wrapper wrapper-content animated fadeInUp">
              <div className="ibox">
                <div className="ibox-content" style={{borderStyle: 'none'}}>
                  <h2>No Data Available</h2>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    } else {
      if(this.props.clusterData.revenue) {
        if(this.isFloat(this.props.clusterData.revenue)) {
          var avg_revenue = this.props.clusterData.revenue.toFixed(2);
        } else {
          var avg_revenue = this.props.clusterData.revenue;
        }

      }
      if(this.props.clusterData.avg_sales) {
        if(this.isFloat(this.props.clusterData.avg_sales)) {
          var avg_sales = this.props.clusterData.avg_sales.toFixed(2);
        } else {
          var avg_sales = this.props.clusterData.avg_sales;
        }
				avg_sales = avg_sales.toLocaleString();
      }
      if(this.props.clusterData.annual_spend) {
        if(this.isFloat(this.props.clusterData.annual_spend)) {
          var annual_spend = this.props.clusterData.annual_spend.toFixed(2);
        } else {
          var annual_spend = this.props.clusterData.annual_spend;
        }
				annual_spend = annual_spend.toLocaleString();
      }
      return (
        <div className="row">
           <div className="col-lg-12">
              <div className="wrapper wrapper-content animated fadeInUp">
                 <div className="ibox">
                    <div className="ibox-content" style={{borderStyle: 'none'}}>
                       <div className="row">
                         <div className="col-md-6">
                          <div className="row">
                            <h1>{this.props.clusterData.name}</h1>
                          </div>
                          <div className="row">
                            <div className="col-md-3">
                              <img src={thumbnail} className="img-responsive" style={{width: '105%'}}/>
                            </div>
                            <div className="col-md-9">
                              <h4>{this.props.clusterData.definition}</h4>
                            </div>
                          </div>
                           {/* <h1 className="m-b-xs">$ {this.props.clusterData.revenue}</h1>
                           <h3 className="font-bold no-margins">
                               Half-year revenue margin
                           </h3>
                           <small>Sales marketing.</small> */}
                         </div>
												 <div className="col-md-3">
													 <div className="ibox float-e-margins" style={{border: '1px solid #ddd', borderTop: '5px solid #ddd', height: 125}}>
														 <div className="ibox-title" style={{height: 61}}>
															 <span className='fa fa-file-text-o pull-right' style={{fontSize: 18}}></span>
																<span style={{fontSize: 14, fontWeight: 600}}>Annual Spend</span>
														 </div>
														 <div className="ibox-content" style={{padding: '15px 20px 5px 20px'}}>
															 <h2 className="no-margins">$ {annual_spend}</h2>
															 <div className="stat-percent font-bold text-success"></div>
															 <small></small>
														 </div>
													 </div>
												 </div>
												 <div className="col-md-3">
													 <div className="ibox float-e-margins" style={{border: '1px solid #ddd', borderTop: '5px solid #ddd', height: 125}}>
														 <div className="ibox-title" style={{height: 61}}>
															 <span className='fa fa-dot-circle-o pull-right' style={{fontSize: 18}}></span>
																<span style={{fontSize: 14, fontWeight: 600}}>Number of Customers</span>
														 </div>
														 <div className="ibox-content" style={{padding: '15px 20px 5px 20px'}}>
															 <h2 className="no-margins">{this.props.clusterData.num_of_customers}</h2>
															 <div className="stat-percent font-bold text-success"></div>
															 <small></small>
														 </div>
													 </div>
												 </div>
                         {/*
                         <div className="col-md-7">
                           <span className="pull-right text-right">
                             <small>Average value of sales in the past month in: <strong>United states</strong></small>
                               <br/>
                               All sales: 162,862
                           </span>
                         </div>
                         */}

                      </div>
                          {/* <SegmentClusterLens id={this.props.id} title={this.props.title}/> */}

                       <div className="row m-t-sm">
                          <div className="col-lg-12">
                             <div className="panel blank-panel">
                                <div className="panel-heading">
                                   <div className="panel-options">
                                      <ul className="nav nav-tabs">
                                        <li className=""><a href="#tab-1" data-toggle="tab">Demographics</a></li>
                                        <li className=""><a href="#tab-2" data-toggle="tab">Geography</a></li>
                                        {/*
                                        <li className=""><a href="#tab-3" data-toggle="tab">LifeStage</a></li>
                                          <li className=""><a href="#tab-4" data-toggle="tab">BestLightValue</a></li>
                                        */}
                                        { (() => {
                                            if(this.props.clusterData.scheme_name === 'Life Stage') {
                                              return (
                                                <li className=""><a href="#tab-0" data-toggle="tab">RFV Split</a></li>
                                              )
                                            }
                                            else {
                                              return (
                                                <li className=""><a href="#tab-0" data-toggle="tab">Life Stage Split</a></li>
                                              )
                                            }
                                          })()
                                        }
                                        <li className=""><a href="#tab-5" data-toggle="tab">Shopping</a></li>
                                        <li className=""><a href="#tab-6" data-toggle="tab">Seasonality</a></li>
                                        { (() => {
                                            if(this.props.clusterData.scheme_name === 'RFV') {
                                              return (
                                                <li className=""><a href="#tab-7" data-toggle="tab">Migration</a></li>
                                              )
                                            }
                                          })()
                                        }
                                        <li className=""><a href="#tab-8" data-toggle="tab">Online Behavior</a></li>
                                      </ul>
                                   </div>
                                </div>
                                <div className="panel-body">
                                   <div className="tab-content segment-detail-tab-container">
                                      <div className="tab-pane" id="tab-0">
                                        <SegmentClusterLens id={this.props.id} title={this.props.title} data={this.props.clusterData} />
                                      </div>
                                      <div className="tab-pane active" id="tab-1">
                                          <ClusterDemographics data={this.props.clusterData} />
                                      </div>
                                      <div className="tab-pane" id="tab-2">
                                          <SegmentTabGeography data={this.props.clusterData} />
                                      </div>

                                       <div className="tab-pane" id="tab-5">
                                          <ClusterShopping data={this.props.clusterData} />
                                      </div>
                                       <div className="tab-pane" id="tab-6">
                                          <SegmentTabSeasonality data={this.props.clusterData} />
                                      </div>
                                       <div className="tab-pane" id="tab-7">
                                          <SegmentTabMigration data={this.props.clusterData} />
                                      </div>
  																		<div className="tab-pane" id="tab-8">
  																			 <SegmentTabOnlineBehavior data={this.props.clusterData} />
  																	 </div>
                                   </div>
                                </div>
                             </div>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
           {/*
           <div className="col-lg-3">
              <div className="wrapper wrapper-content project-manager">
                 <img src={thumbnail} className="img-responsive" style={{width: '100%'}}/>
                 <p className="small">{this.props.clusterData.description}</p>
              </div>
           </div>
         */}
        </div>
      )
    }
  }
}
/*= End of SegmentList component =*/
/*=============================================<<<<<*/
@withRouter
class SegmentDetails extends Component {

	state = {
    clusterData: null
	};

  componentWillMount(){
    this.fetchClusterDetails(this.props.params.id);
  }

  componentDidMount() {
    this.fetchClusterDetails(this.props.params.id);
  }

  componentWillReceiveProps(props) {
    console.log("in segment details componentWillReceiveProps");
    this.fetchClusterDetails(props.params.id);
  }

  fetchClusterDetails(clusterId) {
    let self = this;
    XyloFetch.getClusterDetails(clusterId)
    .then(function(res) {
      console.log("get cluster data Api: ");
      console.log(res);
      res.payload.cluster_details.cluster_lens = 
        _.sortBy(res.payload.cluster_details.cluster_lens, [function(o) { return o.order_num; }]);
       res.payload.cluster_details.migration2015 = 
        _.sortBy(res.payload.cluster_details.migration2015, [function(o) { return o.order_num; }]);
      self.setState({clusterData: res.payload});
    })
  }

  constructor(props) {
    super(props);
  }

	onSegmentChange(selected_id, selected_val) {
    this.props.router.push("/segments/segmentdetails/" + selected_id);
    console.log("in segment change id: "+selected_id+", selected_val: "+selected_val);
	}

  render() {
		const self = this;
    console.log(this.props.params.id);
    if (self.state.clusterData) {
      return (
        <div className='xylo-page-heading'>
           <div className="row wrapper white-bg page-heading">
              <SegmentListHeader
                scheme_name={this.state.clusterData.scheme_name}
                cluster_name={this.state.clusterData.name} />
           </div>

  				 <div className="row">
  					 <div className="col-lg-12" style={{marginLeft: 20, marginTop: 20}}>
              <SegmentClusters
                init_cluster_id={this.props.params.id}
                onSegmentChange={::this.onSegmentChange}
                divRowClass1='col-md-3'
                divRowClass2='col-md-3'
                />
             </div>
  				 </div>
           {/* {
             (() => {
               if(this.state.clusterData.cluster_details === null) {
                 return (
                   <div className="row">
                     <div className="col-lg-9">
                       <div className="wrapper wrapper-content animated fadeInUp">
                         <div className="ibox">
                           <div className="ibox-content" style={{borderStyle: 'none'}}>
                             <h2>No Data Available</h2>
                           </div>
                         </div>
                       </div>
                     </div>
                   </div>
                 )
               } else {
                 return (
                   <div className="wrapper wrapper-content">
                      <SegmentMain id={this.props.params.id} title={this.state.clusterData.name} clusterData={this.state.clusterData} />
                   </div>
                 )
               }
             })()
           } */}
           <div className="wrapper wrapper-content">
              <SegmentMain
                id={this.props.params.id}
                title={this.state.clusterData.name}
                clusterData={this.state.clusterData} />
           </div>

        </div>
      )
    }
    else { 
      return (
          <Loading message='Loading ..' />
      )
    }
  }
}

export default SegmentDetails;
