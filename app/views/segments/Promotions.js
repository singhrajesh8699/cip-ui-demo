import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { withRouter, Link, Location } from 'react-router';
import { Route, Router, IndexRedirect, browserHistory} from 'react-router';
import moment from 'moment';
// import vex from 'vex';

import * as XyloFetch from '../../components/common/XyloFetch';
import c3 from '../../../public/vendor/c3/c3.min.js';

import { Segments, SegmentClusters } from '../../components/common/Segments';
import ProductCategories from '../../components/common/ProductCategories';

import "../../../public/vendor/daterangepicker/daterangepicker.js";
import "../../../public/vendor/datapicker/bootstrap-datepicker.js";

import "select2/dist/js/select2.full.min.js";

import "../../../node_modules/select2/dist/css/select2.css";
import _ from 'lodash';

import * as Themes from '../../components/common/Themes';

class PromotionsHeader extends Component {
  render() {
    return (
      <div className="col-lg-10">
        <div className='xylo-page-header'>
          <h2>Promotions</h2>
          <ol className="breadcrumb">
              <li>
                 <Link to="/segments/ma_dashboard">Segmentations</Link>
              </li>
              <li>
                  <a><b>Promotions</b></a>
              </li>
          </ol>
        </div>
      </div>
    );
  }
}

/*=============================================>>>>>
= Promotion Header menu =
===============================================>>>>>*/
class PromotionsHeaderMenu extends Component {

  onSchemeChange(scheme_id, scheme_name) {
    //console.log(scheme_id, scheme_name);
    this.props.onSchemeChange(scheme_id);
  }

  onProductChange(department, category) {
    this.props.onProductChange(department, category);
  }

  render() {
    return (
      <div className="col-lg-12">
        <div style={{marginTop: 15, marginLeft: 15}}>
          <div className="row">
            <div className="col-sm-3">
               <Segments
                initial_segment={this.props.scheme_data._id}
                onChange={::this.onSchemeChange}
               />
            </div>
            <div className="col-sm-offset-3 col-sm-6">
              <ProductCategories
                divRowClass1='col-sm-4'
                divRowClass2='col-sm-6'
                set_defaults='true'
                onChange={::this.onProductChange}
              />
            </div>
           </div>
           <hr className="col-lg-11"/>
         </div>
      </div>
    )
  }
}
/*= End of Promotion Header menu =*/
/*=============================================<<<<<*/


/*=============================================>>>>>
= Promotions graph component =
===============================================>>>>>*/
class PromotionsChart extends Component {

  constructor(props) {
    super(props);

    this.state = {
      chart_promos: null,
      chart_cherrypicking: null
    };
  }

  handleSelect(date){
    console.log(date); // Momentjs object
  }

  handleChange() {
  }

  handleBfChange(e) {
    this.props.onBfIntervalChange(e.target.value);
  }

  handleAfChange(e) {
   this.props.onAfIntervalChange(e.target.value);
  }

  init_chart(data) {
    $('#data_5 .input-daterange').datepicker({
        dateFormat: 'yy-mm-dd',
        keyboardNavigation: false,
        forceParse: false,
        autoclose: true
    });

    const self = this;
    (()=> {
      var barOptions = {
        responsive: true,
        legend: {
          display: false,
            labels: {
              //usePointStyle: true,
              generateLabels: function(chart) {
                var labels = Chart.defaults.global.legend.labels.generateLabels(chart);
                labels[1].lineWidth = 0;
                //console.log(labels[1]);
                return labels;
             }
           }
        },
        scales: {
           yAxes: [{
              display: true,
              ticks: {
                min: 0,
                userCallback: function(label, index, labels) {
                 // when the floored value is the same as the value we have a whole number
                   if (Math.floor(label) === label) {
                       return '$' + label;
                   }
                 }
              }
           }]
        }
      };

      var barData = {
        labels: data.cluster_names,
        datasets: [
         {
           type: 'bar',
           label: "Incremental Sales",
           backgroundColor: Themes.palette1.bar_colors2[0].bgColor,
           pointBorderColor: "#fff",
           data: data.cluster_incsales
         },
         {
           type: 'line',
           fill: false,
           label: "Company Average",
            borderColor: 'rgba(236, 147, 47, 0.5)',
            backgroundColor: 'rgba(236, 147, 47, 0.5)',
            pointBorderColor: 'rgba(236, 147, 47, 0.5)',
            pointBackgroundColor: 'rgba(236, 147, 47, 0.5)',
            pointHoverBackgroundColor: 'rgba(236, 147, 47, 0.5)',
            pointHoverBorderColor: 'rgba(236, 147, 47, 0.5)',
            data: data.company_average
         }
        ]
      };

      var ctx2 = document.getElementById("incrementalsales").getContext("2d");
      this.state.chart_promos = new Chart(ctx2, {type: 'bar', data: barData, options:barOptions});
      document.getElementById('js-legend').innerHTML = this.state.chart_promos.generateLegend();
    })();

    (()=> {
      var barOptions = {
        responsive: true,

        scales: {
           yAxes: [{
              display: true,
              ticks: {
                min: 0,
                stepSize: 20,
                max: 100,
                userCallback: function(label, index, labels) {
                 // when the floored value is the same as the value we have a whole number
                   if (Math.floor(label) === label) {
                     return label+'%';
                   }
                 }
              }
           }]
        }
      };

      var barData = {
        labels: data.cluster_names,
        datasets: [
         {
           label: "Cherry Picking %",
           backgroundColor: Themes.palette1.bar_colors[1].bgColor,
           pointBorderColor: "#fff",
           data: data.cluster_cherrypicking_percents
         }
        ]
      };

      var ctx2 = document.getElementById("cherrypicking").getContext("2d");
      this.state.chart_cherrypicking = new Chart(ctx2, {type: 'bar', data: barData, options:barOptions});
    })();
  }

  componentDidMount() {
    if (this.props.promotions_data) {
      this.init_chart(this.props.promotions_data);
    }
  }

  render() {
    if (this.state.chart_promos && this.state.chart_cherrypicking) {
      this.state.chart_promos.destroy();
      this.state.chart_cherrypicking.destroy();
      if (this.props.promotions_data) {
        this.init_chart(this.props.promotions_data);
      }
    }
    else {
       if (this.props.promotions_data) {
        this.init_chart(this.props.promotions_data);
      }
    }
    let fromDate = "11/25/2016"; //moment(new Date()).format("DD/MM/YYYY");
    let toDate = "12/26/2016"; //moment(new Date()).format("DD/MM/YYYY");
    return (
      <div className="col-sm-10" style={{paddingLeft: 75}}>
          <div>
            <div className="row">
                <div className='col-sm-3'>
                  <h5>Select Period before Promotion</h5>
               </div>
               <div className="col-sm-offset-1 col-sm-4">
                  <h5>Select Promotion Period</h5>
               </div>
               <div className="col-sm-offset-1 col-sm-3">
                 <h5>Select Period after Promotion</h5>
                </div>
            </div>
            <div className="row">
                <div className='col-sm-3'>
                    <select className="form-control m-b" name="account" onChange={::this.handleBfChange}>
                      <option value="2">2 months before</option>
                      <option value="4">4 months before</option>
                      <option value="6">6 months before</option>
                    </select>
               </div>
               <div className="col-sm-offset-1 col-sm-4" id="data_5">
                  <div className="input-daterange input-group" id="datepicker">
                    <input type="text" className="input-sm form-control" name="start" value={fromDate} onChange={::this.handleChange} />
                    <span className="input-group-addon">to</span>
                    <input type="text" className="input-sm form-control" name="end" value={toDate} onChange={::this.handleChange} />
                  </div>
               </div>
               <div className="col-sm-offset-1 col-sm-3">
                    <select className="form-control m-b" name="account" onChange={::this.handleAfChange}>
                    <option value="2">2 months after</option>
                    <option value="4">4 months after</option>
                    <option value="6">6 months after</option>
                    </select>
                </div>
            </div>
          </div>

          <div>
            <div className="tabs-container">
              <ul className="nav nav-tabs">
               <li className="active"><a data-toggle="tab" href="#incrementalSales">Incremental Sales</a></li>
               <li className=""><a data-toggle="tab" href="#cherryPicking">Cherry Picking</a></li>
              </ul>
              <div className="tab-content">
                <div id="incrementalSales" className="tab-pane active">
                  <div className="panel-body">
                    <div id="js-legend" className="chart-legend"></div>
                    <canvas id="incrementalsales" height="100"></canvas>
                    <p><strong>Incremental sales </strong>= Sales in promotion period minus average of sales in pre promotion and post promotion period</p>
                  </div>
                </div>
                <div id="cherryPicking" className="tab-pane">
                  <div className="panel-body">
                    <canvas id="cherrypicking" height="100"></canvas>
                    <p><strong>Cherry Picking </strong>= Basket with only promoted item / ALL basket with promoted items</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

      </div>
    )
  }
}
/*= End of Promotions graph component =*/
/*=============================================<<<<<*/

/*=============================================>>>>>
= Promotions Component =
===============================================>>>>>*/
class PromotionsMain extends Component {

  render() {
    return (
      <div className="col-lg-12">
        <div className="">
          <div style={{paddingLeft: 2, paddingTop: 2}}>
            <div>
              <div className="row" style={{marginTop: 10}}>
                <div className="col-sm-12">
                  <PromotionsChart
                    promotions_data={this.props.promotions_data}
                    onBfIntervalChange={this.props.onBfIntervalChange}
                    onAfIntervalChange={this.props.onAfIntervalChange}
                    />
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    )
  }
}
/*=============================================<<<<<*/



class Promotions extends Component {

  constructor(props) {
    super(props);

    this.state = {
      scheme_data: null,
      department: null,
      category: null,
      bf_interval: '2',
      af_interval: '2',
      promotions_data: null
    };

  }

  fetchData(scheme_id) {
    const self = this;
    var getScheme = null;
    if (scheme_id === 'default') {
      getScheme = XyloFetch.getSchemeDetailsByName('Life Stage');
    }
    else {
      getScheme = XyloFetch.getSchemeDetails(scheme_id);
    }
    // Rajeev - TODO: Get lighter version of Scheme Details
    getScheme
      .then(function(response) {
        self.setState({scheme_data: response.payload});
        if (self.state.department && self.state.category) {
          self.fetchDataOnProductChange(self.state.department, self.state.category);
        }
      });
  }

  transformResponse(rsp) {
    var cols_data = {};
    var company_average = [];
    var cluster_names = [];
    var cluster_incsales = [];
    var cherry_picking_percents = [];

    var sorted_promos = _.sortBy(rsp.promo, [function(o) { return o.order_num; }]);
    var sorted_cherrypicked = _.sortBy(rsp.cherry_picked, [function(o) { return o.order_num; }]);

    sorted_promos.forEach(function(e) {
      cluster_incsales.push(Math.round(e.inc_sale));
      cluster_names.push(e._id.Cluster);
      company_average.push(Math.round(rsp.company_average[0].avg_inc_sale));

      var cherry_picked =
        _.filter(sorted_cherrypicked, function(o) { return o._id.Cluster === e._id.Cluster });
      var cherry_picked_count = cherry_picked[0].count;
      var cherry_picked_percent = Math.round( (cherry_picked_count / e.count) * 100.0);
      cherry_picking_percents.push(cherry_picked_percent);
    });
    cols_data['company_average'] = company_average;
    cols_data['cluster_names'] = cluster_names;
    cols_data['cluster_incsales'] = cluster_incsales;
    cols_data['cluster_cherrypicking_percents'] = cherry_picking_percents;
    return cols_data;
  }

  fetchDataOnProductChange(department, category) {
    const self = this;
    console.log('fetchDataOnProductChange');
    self.state.department = department;
    self.state.category = category;
    var param_department_name = null;
    if (self.state.department) {
      param_department_name = self.state.department.name;
    }
    var param_category_name = null;
    if (self.state.category) {
      param_category_name = self.state.category.name;
    }
    XyloFetch.queryPromotions({
        scheme_name: self.state.scheme_data.name,
        department_name: param_department_name,
        category_name: param_category_name,
        subcategory_name: null,
        bf_interval: self.state.bf_interval,
        af_interval: self.state.af_interval
      })
      .then(function(response, err) {
          //console.log(response);
          if (response.status.errorCode) {
            self.setState({promotions_data: null});
          }
          else {
            self.setState({promotions_data: self.transformResponse(response.payload)});
          }
      });
  }

  fetchDataOnBfIntervalChange(bf_interval) {
    const self = this;
    self.setState({bf_interval: bf_interval}, function() {
      self.fetchDataOnProductChange(self.state.department, self.state.category);
    });
  }

  fetchDataOnAfIntervalChange(af_interval) {
    const self = this;
    self.setState({af_interval: af_interval}, function() {
      self.fetchDataOnProductChange(self.state.department, self.state.category);
    });
  }

  componentDidMount() {
    this.fetchData('default');
  }

  render() {
     if (this.state.scheme_data) {
      return (
          <div className='xylo-page'>
            <div className="row wrapper white-bg page-heading">
              <PromotionsHeader />
            </div>

            <div className="row">
              <PromotionsHeaderMenu
                scheme_data={this.state.scheme_data}
                onSchemeChange={::this.fetchData}
                onProductChange={::this.fetchDataOnProductChange}
              />
            </div>

            <div className="row">
              <PromotionsMain
                promotions_data={this.state.promotions_data}
                onBfIntervalChange={::this.fetchDataOnBfIntervalChange}
                onAfIntervalChange={::this.fetchDataOnAfIntervalChange}
              />
            </div>

          </div>
        )
      }
      else {
        return (
          <div className="xylo-msg-center">
            <h1>Loading ... </h1>
          </div>
        )
      }
  }
}

export default Promotions;
