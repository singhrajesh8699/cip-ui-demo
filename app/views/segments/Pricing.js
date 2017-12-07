import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { withRouter, Link, Location } from 'react-router';
import { Route, Router, IndexRedirect, browserHistory} from 'react-router';
import Moment from 'moment';
// import vex from 'vex';

import * as XyloFetch from '../../components/common/XyloFetch';
import c3 from '../../../public/vendor/c3/c3.min.js';

import { Segments, SegmentClusters } from '../../components/common/Segments';
import ProductCategories from '../../components/common/ProductCategories';

import "select2/dist/js/select2.full.min.js";

import "../../../node_modules/select2/dist/css/select2.css";
import _ from 'lodash';

import * as Themes from '../../components/common/Themes';

class PricingHeader extends Component {
  render() {
    return (
      <div className="col-lg-10">
        <div className='xylo-page-header'>
          <h2>Pricing</h2>
          <ol className="breadcrumb">
              <li>
                 <Link to="/segments/ma_dashboard">Segmentations</Link>
              </li>
              <li>
                  <a><b>Pricing</b></a>
              </li>
          </ol>
        </div>
      </div>
    );
  }
}

/*=============================================>>>>>
= Pricing Header menu =
===============================================>>>>>*/
class PricingHeaderMenu extends Component {

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
= pricing graph component =
===============================================>>>>>*/
class PricingChart extends Component {

  constructor(props) {
    super(props);

    this.state = {
      chart: null
    };
  }

  init_chart(data) {
   var self = this;
   self.state.chart = c3.generate({
      bindto: '#pricingStockChart',
      data:{
        x : 'x',
        columns: data,
        colors:{
          Good: Themes.palette2.bar_colors[0].bgColor,
          Better: Themes.palette2.bar_colors[1].bgColor,
          Best: Themes.palette2.bar_colors[2].bgColor
        },
        type: 'bar',
        groups: [
          ['Good', 'Better', 'Best']
        ],
        empty: {
            label: {
                text: "No Data Available"
            }
        }
      },
      axis: {
        x: {
          type: 'categorized'
        },
        y: {
          max: 100,
          tick: {
            format: function(d) {
              if(d <= 100) {
                return d+'%';
              }
            }
          }
        }
      }
    });
  }

  componentDidMount() {
    //console.log(this.props.pricing_data);
    if (this.props.pricing_data) {
      this.init_chart(this.props.pricing_data);
    }
  }

  render() {
    console.log('rendering ...');
    if (this.state.chart) {
      this.state.chart.load({
        unload: true,
        columns: this.props.pricing_data
      });
    }
    else {
      console.log('init ...');
      if (this.props.pricing_data) {
        this.init_chart(this.props.pricing_data);
      }
    }
    return (
      <div>
        <div id="pricingStockChart"></div>
      </div>
    );
  }
}
/*= End of pricing graph component =*/
/*=============================================<<<<<*/

/*=============================================>>>>>
= Pricing Component =
===============================================>>>>>*/
class PricingMain extends Component {

  onProductChange(department, category) {
    this.props.onProductChange(department, category);
  }

  render() {
    return (
      <div className="col-lg-12">
        <div className="">
           <div style={{paddingLeft: 2, paddingTop: 2}}>
            <div>
              <div className="row">
                <div className="col-sm-12">
                  <PricingChart 
                    pricing_data={this.props.pricing_data}
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



class Pricing extends Component {

  constructor(props) {
    super(props);
      
    this.state = {
      scheme_data: null,
      department: null,
      category: null,
      pricing_data: null
    };

  }

  transformResponse(rsp) {
    var cols_data = [];
    var clusters = ['x'];
    var scale_good = ['Good'];
    var scale_better = ['Better'];
    var scale_best = ['Best'];

    var sorted_rsp = _.sortBy(rsp, [function(o) { return o.order_num; }]);

    sorted_rsp.forEach(function(e) {
      if (e._id !== null) {
        clusters.push(e._id);
        var good_count = _.find(e.counts, {'Scale': 'Good'}).count;
        var better_count = _.find(e.counts, {'Scale': 'Better'}).count;
        var best_count = _.find(e.counts, {'Scale': 'Best'}).count;
        var total_count = good_count + better_count + best_count;
        var good_count_pc = ( good_count / total_count ) * 100.0;
        var better_count_pc = ( better_count / total_count ) * 100.0;
        var best_count_pc = ( best_count / total_count ) * 100.0;
        scale_good.push(Math.round(good_count_pc));
        scale_better.push(Math.round(better_count_pc));
        scale_best.push(Math.round(best_count_pc));
      }
    });
    cols_data.push(clusters);
    cols_data.push(scale_good);
    cols_data.push(scale_better);
    cols_data.push(scale_best);
    return cols_data;
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
    XyloFetch.queryPricing({
        scheme_name: self.state.scheme_data.name,
        department_name: param_department_name,
        category_name: param_category_name,
        subcategory_name: null
      })
      .then(function(response, err) {
          console.log(response);
          if (response.status.errorCode) {
            self.setState({pricing_data: null});
          }
          else {
            self.setState({pricing_data: self.transformResponse(response.payload)});
          }
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
              <PricingHeader />
            </div>

            <div className="row">
              <PricingHeaderMenu 
                scheme_data={this.state.scheme_data}
                onSchemeChange={::this.fetchData}
                onProductChange={::this.fetchDataOnProductChange}
              />
            </div>

            <div className="row">
              <PricingMain 
                pricing_data={this.state.pricing_data}
              />
            </div>

          </div>
        )
      }
      else {
         return <div>Loading...</div>;
      }
  }
}

export default Pricing;
