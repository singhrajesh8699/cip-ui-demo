import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { withRouter, Link, Location } from 'react-router';
import { Route, Router, IndexRedirect, browserHistory} from 'react-router';
import moment from 'moment';
// import vex from 'vex';

import * as XyloFetch from '../../components/common/XyloFetch';
import c3 from '../../../public/vendor/c3/c3.min.js';

import { Segments, SegmentClusters } from '../../components/common/Segments';
import ProductCategories from '../../components/common/ProductSelect';

import "select2/dist/js/select2.full.min.js";

import "../../../node_modules/select2/dist/css/select2.css";
import _ from 'lodash';

import * as Themes from '../../components/common/Themes';

class SalesHeader extends Component {
  render() {
    return (
      <div className="col-lg-10">
        <div className='xylo-page-header'>
          <h2>Sales</h2>
          <ol className="breadcrumb">
              <li>
                 <Link to="/segments/ma_dashboard">Segmentations</Link>
              </li>
              <li>
                  <a><b>Sales</b></a>
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
class SalesHeaderMenu extends Component {

	ComponentWillMount() {
		this.setState({scheme_id: this.props.scheme_data._id});
	}

  onSchemeChange(scheme_id, scheme_name) {
    //console.log(scheme_id, scheme_name);
    this.setState({scheme_id: scheme_id});
    this.props.onSchemeChange(scheme_id, null, null);
  }

	onProductChange(department, category) {
		var deptName = null;
		if(department) {
			deptName = department.name;
		}
		console.log("department is " + department + "    category " + category);
		this.props.onSchemeChange(this.state.scheme_id, deptName, null);
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
            <div className="col-sm-offset-5 col-sm-4">
              <ProductCategories
                divRowClass1='col-sm-12'
                divRowClass2='col-sm-6'
                set_defaults={false}
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
= Sales graph component =
===============================================>>>>>*/
class SalesChart extends Component {

  constructor(props) {
    super(props);

    this.state = {
      chart_clusterseasonality: null,
      chart_clusterproducts: null,
      chart_product_affinity_cluster_data: null
    };
  }

  init_chart(data) {
    //console.log('init_chart');
    //console.log(data);
    const self = this;
    (()=> {
     var self = this;
     self.state.chart_clusterseasonality = c3.generate({
        bindto: '#clusterseasonalityChart',
        data:{
          x : 'x',
          columns: data.cols_data,
          colors: data.colors,
          type: 'bar',
          groups: [
            data.groups
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

    })();
  }

  init_heat_map(heat_map_data) {
    $("#sales_product_affinity_chart").parent().append( "<div id='sales_product_affinity_chart'></div>");
    $("#sales_product_affinity_chart").remove();

    var clusters = [];
    var products = [];
    var values = [];
    var data = [];
    var isAffinityProductsPopulated = false;
    if(heat_map_data) {
      heat_map_data.data.forEach(function(cluster_item, cluster_index) {
        clusters.push(cluster_item.cluster.name);
        cluster_item.data.forEach(function(product_item, product_index) {
          if(!isAffinityProductsPopulated) {
            products.push(product_item._id);
          }
          //values.push(product_item.count);
          data.push({day: product_index, hour: cluster_index, value: product_item.count});
        });
        isAffinityProductsPopulated = true;
      });

      // console.log(data);

      var margin = { top: 250, right: 0, bottom: 100, left: 350 },
        width = 1000,
        height = 400,
        gridSize = Math.floor(width / 15),
        legendElementWidth = gridSize*2,
        buckets = 7,
        colors = ["rgb(177,244,230)","rgb(109,234,208)","rgb(40,224,187)","rgb(97, 203, 181)","rgb(37, 153, 129)","rgb(4, 112, 90)"], 
        //colors = ["rgb(75, 192, 192)","rgb(45, 107, 120)","rgb(34, 139, 34)"], // alternatively colorbrewer.YlGnBu[9]
        days = products,
        times = clusters;

      var svg = d3.select("#sales_product_affinity_chart").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      var dayLabels = svg.selectAll(".dayLabel")
        .data(days)
        .enter().append("text")
        .text(function (d) { return d; })
        .attr("x", 0)
        .attr("y", function (d, i) { return (i * gridSize)-70; })
        .style("text-anchor", "end")
        .attr("transform", "translate(-100," + gridSize / 2 + ")")
        .attr("class", function (d, i) { return ((i >= 0 && i <= 4) ? "dayLabel mono axis axis-workweek" : "dayLabel mono axis"); });

      var timeLabels = svg.selectAll(".timeLabel")
        .data(times)
        .enter().append("text")
        .text(function(d) { return d; })
        .attr("x", 100)
        .attr("y", function(d, i) { return (i * gridSize) - 30; })
        .style("text-anchor", "start")
        .attr("transform", "rotate(270)")
        // .attr("transform", "rotate(90)")
        .attr("class", function(d, i) { return ((i >= 7 && i <= 16) ? "timeLabel mono axis axis-worktime" : "timeLabel mono axis"); });


      var colorScale = d3.scale.quantile()
        .domain([0, buckets - 1, d3.max(data, function (d) { return d.value; })])
        //.domain([d3.min(data, function (d) { return d.value; }), buckets - 1, d3.max(data, function (d) { return d.value; })])
        .range(colors);

      //console.log('sales heat-map: quantiles');
      //console.log(colorScale.quantiles());

      var cards = svg.selectAll(".hour")
        .data(data, function(d) {return d.day+':'+d.hour;});

      cards.append("title");

      cards.enter().append("rect")
        .attr("x", function(d) { return (d.hour - 1) * gridSize; })
        .attr("y", function(d) { return (d.day - 1) * gridSize; })
        .attr("rx", 4)
        .attr("ry", 4)
        .attr("class", "hour bordered")
        .attr("width", gridSize)
        .attr("height", gridSize)
        .style("fill", colors[0]);

      cards.transition().duration(1000)
        .style("fill", function(d) { return colorScale(d.value); });
      cards.select("title").text(function(d) { return d.value; });

      d3.select("#sales_tooltip").attr("class", "hidden");

      cards.on("mouseover", function(d){
         //Update the tooltip position and value
         d3.select("#sales_tooltip")
          .style("left", (d3.event.pageX-230) + "px")
          .style("top", (d3.event.pageY-50) + "px")
          .select("#value")
          //.text('Sales Index: .' + d.value.toString().substring(0, 2));
          .text('# Units sold in 2016: ' + d.value);
          //.text("Sold: "+d.value+" Units");
           //Show the tooltip
           d3.select("#sales_tooltip").classed("hidden", false);
      })
      cards.on("mouseout", function(){
         //d3.select(this).attr("class", "cell-hover");
         d3.selectAll(".rowLabel").attr("class", "text-highlight");
         d3.selectAll(".colLabel").attr("class", "text-highlight");
         d3.select("#sales_tooltip").attr("class", "hidden");
      })
      cards.exit().remove();
    }
  }

  componentDidMount() {
    if (this.props.sales_data) {
      this.init_chart(this.props.sales_data);
    }
    if(this.props.product_affinity_cluster_data) {
      this.init_heat_map(this.props.product_affinity_cluster_data);
      this.setState({chart_product_affinity_cluster_data: this.props.product_affinity_cluster_data});
    }
  }

  componentWillReceiveProps(props) {
    this.setState({chart_product_affinity_cluster_data: props.product_affinity_cluster_data});
    this.init_heat_map(props.product_affinity_cluster_data);
    this.init_chart(props.sales_data);
  }

  render() {
    if (this.state.chart_clusterseasonality && this.state.chart_clusterproducts) {
      this.state.chart_clusterseasonality.load({
        unload: true,
        columns: this.props.sales_data
      });
      this.state.chart_clusterproducts.destroy();
      if (this.props.sales_data) {
        this.init_chart(this.props.sales_data);
      }
    }
    else {
       if (this.props.sales_data) {
        this.init_chart(this.props.sales_data);
      }
    }
    return (
      <div>
        <div id="sales_tooltip" className="hidden">
          <p><span id="value"></span></p>
        </div>
        <div className="row">
          <div className="ibox" style={{marginTop: 50, paddingLeft: 15}}>

            <div className="tabs-container">
              <ul className="nav nav-tabs">
               <li className="active"><a data-toggle="tab" href="#clusterseasonality">Revenue Seasonality</a></li>
               <li className=""><a data-toggle="tab" href="#productAffinity">Product Purchase Behavior</a></li>
              </ul>

              <div className="tab-content">

                <div id="clusterseasonality" className="tab-pane active">
                  <div className="panel-body">
                    <div id="clusterseasonalityChart"></div>
                   </div>
                </div>

                <div id="productAffinity" className="tab-pane">
                  <div className="panel-body">
                    <div className="row">
                      <div className="col-sm-12"> 
                        <div id="sales_product_affinity_chart"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    )
  }
}
/*= End of Sales graph component =*/
/*=============================================<<<<<*/


class Sales extends Component {

  constructor(props) {
    super(props);

    this.state = {
      scheme_data: null,
      sales_data: null,
      product_affinity_cluster_data: null
    };

  }

  fetchData(scheme_id, dept, category) {
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
        self.fetchProductAffinityClusterDetails(response.payload._id, dept, category);
        self.setState({scheme_data: response.payload});
        self.setState({sales_data: self.getSalesData(response.payload)});
      });
  }

  // TODO - May be some other math function can do this instead
  helper_get_percent(q_rev) {
    var q_percent_rev = {};
    var sum = 0;
    for (var key in q_rev) {
      if (q_rev.hasOwnProperty(key)) {
        //console.log(key + " -> " + p[key]);
        sum = sum + q_rev[key];
      }
    }
    for (var key in q_rev) {
      if (q_rev.hasOwnProperty(key)) {
        q_percent_rev[key] = Math.round((q_rev[key] / sum) * 100);
      }
    }
    return q_percent_rev;
  }

  getSalesData(scheme_data) {
    var chart_data = {};
    var cols_data = [];
    var quarter_names = ['x', 'Q1 2016', 'Q2 2016', 'Q3 2016', 'Q4 2016'];
    cols_data.push(quarter_names);

    var groups = [];
    var colors = {};
    var q1 = {}, q2 = {}, q3 = {}, q4 = {};
    var index = 0;
    scheme_data.clusters.forEach(function(e) {
      q1[e.name] = Math.round(e.seasonality.q1);
      q2[e.name] = Math.round(e.seasonality.q2);
      q3[e.name] = Math.round(e.seasonality.q3);
      q4[e.name] = Math.round(e.seasonality.q4);
      colors[e.name] = Themes.palette2.bar_colors[index].bgColor;
      groups.push(e.name);
      index++;
    });
    var q1_percent = this.helper_get_percent(q1);
    var q2_percent = this.helper_get_percent(q2);
    var q3_percent = this.helper_get_percent(q3);
    var q4_percent = this.helper_get_percent(q4);
    scheme_data.clusters.forEach(function(e) {
      var cluster_seasonality_revenue = [];
      cluster_seasonality_revenue[0] = e.name;
      cluster_seasonality_revenue[1] = q1_percent[e.name];
      cluster_seasonality_revenue[2] = q2_percent[e.name];
      cluster_seasonality_revenue[3] = q3_percent[e.name];
      cluster_seasonality_revenue[4] = q4_percent[e.name];
      cols_data.push(cluster_seasonality_revenue);
    });

    chart_data['cols_data'] = cols_data;
    chart_data['colors'] = colors;
    chart_data['groups'] = groups;

    return chart_data;
  }

  // get product_affinity vs cluster data for heatmap
  fetchProductAffinityClusterDetails(scheme_id, dept, category) {
    var self = this;
    XyloFetch.getProdAffinityCluster(scheme_id, dept, category)
    .then(function(response) {
      self.setState({product_affinity_cluster_data: response.payload});
    });
  }

  componentDidMount() {
   this.fetchData('default');
    // this.fetchProductAffinityClusterDetails('default');
  }

  render() {
     if (this.state.scheme_data) {
      return (
          <div className='xylo-page'>
            <div className="row wrapper white-bg page-heading">
              <SalesHeader />
            </div>

            <div className="row">
              <SalesHeaderMenu
                scheme_data={this.state.scheme_data}
                onSchemeChange={::this.fetchData}
              />
            </div>


            <div className="row">
              <SalesChart
                sales_data={this.state.sales_data}
                product_affinity_cluster_data={this.state.product_affinity_cluster_data}
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

export default Sales;
