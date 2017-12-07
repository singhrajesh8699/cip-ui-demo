import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { withRouter, Link, Location } from 'react-router';

import ScrollArea from 'react-scrollbar';

import { Route, Router, IndexRedirect, browserHistory} from 'react-router';
import moment from 'moment';
// import vex from 'vex';

import * as XyloFetch from '../../components/common/XyloFetch';

import ProductCategories from '../../components/common/ProductCategories';

import { Segments, SegmentClusters } from '../../components/common/Segments';

import "../../../public/vendor/daterangepicker/daterangepicker.js";
import "../../../public/vendor/datapicker/bootstrap-datepicker.js";

import d3 from '../../../public/vendor/d3/d3';

/*=============================================>>>>>
= Customer feedback header =
===============================================>>>>>*/
class ProductAffinityHeader extends Component {
  render() {
    return (
      <div className="col-lg-10">
        <div className='xylo-page-header'>
          <h2>Product Affinity</h2>
          <ol className="breadcrumb">
              <li>
                <Link to="/segments/ma_dashboard">Segmentations</Link>
              </li>
              <li>
                <a><b>Product Affinity</b></a>
              </li>
          </ol>
        </div>
      </div>
    );
  }
}
/*= End of Customer feedback header =*/
/*=============================================<<<<<*/


/*=============================================>>>>>
= Product Affinity Header menu =
===============================================>>>>>*/
class ProductAffinityHeaderMenu extends Component {

  constructor(props) {
    super(props);
    this.state = {
      cluster_id: null,
      department: null,
      category: null,

      prodlimit: '3',
      prodlimit_ref: null
    };
  }

  componentDidMount() {
    this.state.cluster_id = this.props.cluster_id;
    this.initMenu();
  }

  onProductChange(department, category) {
    this.state.department = department;
    this.state.category = category;
    this.props.onSelectionChange(this.state.department, this.state.category, this.state.cluster_id, this.state.prodlimit);
  }

  onSegmentChange(selected_id, selected_val) {
    this.state.cluster_id = selected_id;
    this.props.onSelectionChange(this.state.department, this.state.category, this.state.cluster_id, this.state.prodlimit);
  }

  onProdLimitChange(prodlimit) {
    this.state.prodlimit = prodlimit;
    this.props.onSelectionChange(this.state.department, this.state.category, this.state.cluster_id, this.state.prodlimit);
  }

  initMenu()
  {
    var self = this;

    var numMin = 3;
    var numMax = 11;
    var month_data = [];
    for (var i=numMin; i<numMax; i++) {
      month_data.push({'id': i.toString(), 'text': i.toString()});
    }

    self.state.prodlimit_ref = $(".prodlimit").select2({
      placeholder: "Select a Month",
      minimumResultsForSearch: Infinity,
      data: month_data
    });

    self.state.prodlimit_ref.on('change.select2', function(e) {
      var select_val = self.state.prodlimit_ref.select2('data')[0].id;
      //console.log(select_val);
      self.onProdLimitChange(select_val);
    });

  }

  render() {
    return (
      <div className="col-lg-12">
        
        <div style={{marginTop: 10, marginLeft: 10}}> 
          
          <div className="row">

            <div className="col-sm-4">
                <SegmentClusters 
                  init_cluster_id={this.props.cluster_id} 
                  onSegmentChange={::this.onSegmentChange}
                  divRowClass1='col-sm-6'
                  divRowClass2='col-sm-6' 
                />
            </div>

            <div className="col-sm-offset-1 col-sm-4">
                <div>
                    <ProductCategories 
                      divRowClass1='col-sm-5'
                      divRowClass2='col-sm-5'
                      onChange={::this.onProductChange}
                    />
                </div>
            </div>
              
            <div className="col-sm-3">
              <div>
                <div className="row">
                  <div className='col-sm-6'>
                    <h4>Select Product Limit</h4>
                  </div>
                </div>

                <div className="row">
                  <div className='col-sm-6'>
                    <select className="prodlimit form-control"/>
                  </div>
                </div>

              </div>
            </div>

          </div>

          <hr className="col-lg-11"/>
        </div>
      </div>
    )
  }
}

/*=============================================>>>>>
= ProductAffinityChart affinity =
===============================================>>>>>*/

class ProductAffinityChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lastJQueryTS: 0,

      chartData: null,

      host_sales_startdate: "11/25/2016",
      host_sales_enddate: "12/26/2016",
      attached_period_bfstartdate: '2',
      attached_period_afenddate: '2'
    };
  }

  onhandleProductSalesStartChange(start) {
    const self = this;
    self.state.host_sales_startdate = moment(start).format('MM/DD/YYYY');
    self.onChange();
  }

  onhandleProductSalesEndChange(end) {
    const self = this;
    self.state.host_sales_enddate = moment(end).format('MM/DD/YYYY');
    self.onChange();
  }

  onhandleProductPerfBfStartChange(e) {
    const self = this;
    self.state.attached_period_bfstartdate = e.target.value;
    self.onChange();
  }

  onhandleProductPerfAfEndChange(e) {
    const self = this;
    self.state.attached_period_afenddate = e.target.value;
    self.onChange();
  }

  onChange()  {
    const self = this;
    this.props.onProductParamsChange(self.state.attached_period_bfstartdate,
        self.state.host_sales_startdate,
        self.state.host_sales_enddate,
        self.state.attached_period_afenddate);
  }

  initChart(product_affinity_data) {
    const self = this;

    $('#affinity .input-daterange').datepicker({
        dateFormat: 'yy-mm-dd',
        keyboardNavigation: false,
        forceParse: false,
        autoclose: true
    }).on('changeDate', function(ev) {
      // https://github.com/uxsolutions/bootstrap-datepicker/issues/912
      var send = true;
      if (typeof(event) == 'object') {
          if (event.timeStamp - self.state.lastJQueryTS < 300){
              send = false;
          }
          self.state.lastJQueryTS = event.timeStamp;
      }
      if (send) {
        if (ev.target.className.includes('start')) {
          self.onhandleProductSalesStartChange(ev.date);
        }
        else if (ev.target.className.includes('end')) {
          self.onhandleProductSalesEndChange(ev.date);
        }
      }
    });

    $("#product_affinity_chart").parent().append( "<div id='product_affinity_chart'></div>");
    $("#product_affinity_chart").remove();
    var products = [];
    var affinity_products = [];
    var data = [];
    var isAffinityProductsPopulated = false;
    product_affinity_data.forEach(function(productitem, prod_index) {
      if(productitem.product !== null) {
        products.push(productitem.product);
      }
      if(productitem.affinity !== null) {
        productitem.affinity.forEach(function(affinityitem, aff_index) {
          if(!isAffinityProductsPopulated) {
            affinity_products.push(affinityitem.product);
          }
          data.push({day: prod_index, hour: aff_index, value: affinityitem.affinity_value});
        });
        isAffinityProductsPopulated = true;
      }
    });
    //console.log("data"); console.log(products); console.log(affinity_products); console.log(data);

    var margin = { top: 250, right: 0, bottom: 100, left: 350 },
      width = 1000,
      height = 400,
      gridSize = Math.floor(width / 15),
      legendElementWidth = gridSize*2,
      buckets = 7,
      colors = ["rgb(228,251,247)","rgb(177,244,230)","rgb(109,234,208)","rgb(40,224,187)","rgb(97, 203, 181)","rgb(37, 153, 129)","rgb(4, 112, 90)"], // alternatively colorbrewer.YlGnBu[9]
      days = products,
      times = affinity_products;

    var svg = d3.select("#product_affinity_chart").append("svg")
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
      .range(colors);

    //console.log('sales heat-map: quantiles');
    var quantiles = colorScale.quantiles();

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

    d3.select("#affinity_tooltip").attr("class", "hidden");

    cards.on("mouseover", function(d){
       var aff_value = ( function() { 
          var val = 0;
          quantiles.forEach(function(q, index) {
            if (val === 0 && d.value <= q) {
              val = index;
            } 
          });
          if (val === 0) { val = quantiles.length; }
          return val - 1;
       })();
       //Update the tooltip position and value
       d3.select("#affinity_tooltip")
        .style("left", (d3.event.pageX-230) + "px")
        .style("top", (d3.event.pageY-220) + "px")
        .select("#value")
        //.text('Affinity Index: .' + d.value.toString().substring(0, 2));
        .text('Affinity: ' + aff_value);
        //Show the tooltip
         d3.select("#affinity_tooltip").classed("hidden", false);
    })
   
    cards.on("mouseout", function(){
       //d3.select(this).attr("class", "cell-hover");
       d3.selectAll(".rowLabel").attr("class", "text-highlight");
       d3.selectAll(".colLabel").attr("class", "text-highlight");
       d3.select("#affinity_tooltip").attr("class", "hidden");
    })

    cards.exit().remove();
  }

  componentWillMount() {
    this.setState({chartData: this.props.data});
  }

  componentWillReceiveProps(props) {
    this.setState({chartData: props.data});
    this.initChart(props.data);
  }

	componentDidMount() {
    if(this.props.data.length != 0) {
      this.setState({chartData: this.props.data});
      this.initChart(this.props.data);
    } else {
      this.setState({chartData: null});
    }
	}

	render() {
  		return (
        <div className="col-lg-12">
          <div id="affinity_tooltip" className="hidden">
            <p><span id="value"></span></p>
          </div>
          <div>
            <div className="row">
                <div className='col-sm-3'>
                  <h5>Attached Product Performance Period Before Start Date</h5>
               </div>
               <div className="col-sm-offset-1 col-sm-4">
                  <h5>Host Product Sales Start and End Dates</h5>
               </div>
               <div className="col-sm-offset-1 col-sm-3">
                 <h5>Attached Product Performance Period After End Date</h5>
                </div>
            </div>
            <div className="row">
                <div className='col-sm-3'>
                    <select className="form-control m-b" name="account" onChange={::this.onhandleProductPerfBfStartChange}>
                      <option value="2">2 months before</option>
                      <option value="4">4 months before</option>
                      <option value="6">6 months before</option>
                    </select>
               </div>
               <div className="col-sm-offset-1 col-sm-4" id="affinity">
                  <div className="input-daterange input-group" id="datepicker">
                    <input type="text" className="input-sm form-control start" name="start" 
                      value={this.state.host_sales_startdate} />
                    <span className="input-group-addon">to</span>
                    <input type="text" className="input-sm form-control end" name="end"
                      value={this.state.host_sales_enddate} />
                  </div>
               </div>
               <div className="col-sm-offset-1 col-sm-3">
                    <select className="form-control m-b" name="account" onChange={::this.onhandleProductPerfAfEndChange}>
                    <option value="2">2 months after</option>
                    <option value="4">4 months after</option>
                    <option value="6">6 months after</option>
                    </select>
                </div>
            </div>
          </div>

          { (() => {
              if(this.props.data.length === 0) {
                return (
                    <div>
                      <div className="row" style={{marginTop: 50}}>
                        <div className="col-sm-offset-4 col-sm-4">
                          <h1> No Data Available </h1>
                        </div>
                      </div> 
                    </div>
                  )
              }
            })()
          }

          <div>
            <div className="row" style={{marginTop: 50}}>
              <div id="product_affinity_chart"></div>
            </div> 
          </div>


      </div>
  	)
	}

}

/*= End of ProductAffinitiyChart =*/
/*=============================================<<<<<*/

class ProductAffinity extends Component {
  constructor(props) {
    super(props);
    this.state = {

      cluster_id: null,
      department: null,
      category: null,
      prodlimit: null,

      attached_period_bfstartdate: null,
      attached_perios_afenddate: null,

      host_sales_startdate: null,
      host_sales_enddate: null,

      product_affinity_data: null,

      initialized: false
    };
  }

  fetchDataOnProductParamsChange(attached_period_bfstartdate, host_sales_startdate, host_sales_enddate, attached_period_afenddate) { 
    const self = this;

    self.state.attached_period_bfstartdate = attached_period_bfstartdate;
    self.state.host_sales_startdate = host_sales_startdate;
    self.state.host_sales_enddate = host_sales_enddate;
    self.state.attached_period_afenddate = attached_period_afenddate;

    self.queryData();
  }

  fetchData(cluster_name) {
    const self = this;
    XyloFetch.getClusterId(cluster_name)
      .then(function(res) {
        self.setState({cluster_id: res.payload._id});
        self.fetchDataOnSelectionChange(self.state.department, self.state.category, self.state.cluster_id, self.state.prodlimit);
      });
  }

  fetchDataOnSelectionChange(department, category, cluster_id, prodlimit) {
    const self = this;
    
    self.state.department = department;
    self.state.category = category;
    self.state.cluster_id = cluster_id;
    self.state.prodlimit = prodlimit;

    self.queryData();
  }

  queryData() {
      const self = this;

      XyloFetch.queryProductAffinity({
        department_name: self.state.department ? self.state.department.name : null,
        category_name: self.state.category ? self.state.category.name : null,
        cluster_id: self.state.cluster_id,
        prodlimit: self.state.prodlimit,
        attached_period_bfstartdate: self.state.attached_period_bfstartdate,
        host_sales_startdate: self.state.host_sales_startdate,
        host_sales_enddate: self.state.host_sales_enddate,
        attached_period_afenddate: self.state.attached_period_afenddate
      })
      .then(function(response, err) {
          self.state.initialized = true;
          //console.log(response);
          if (response.status.errorCode) {
            self.setState({product_affinity_data: null});
          }
          else {
            self.setState({product_affinity_data: response.payload});
          }
      });
  }

  componentDidMount() {
    // By default fetch this ...
    this.fetchData('Young Singles');
  }

  render() {
    const self = this;
    if (self.state.initialized) {
      return (
        <div className='xylo-page-heading'>
          <div className="row wrapper white-bg page-heading">
            <ProductAffinityHeader />
          </div>

          <div className="row">
            <ProductAffinityHeaderMenu 
              cluster_id={this.state.cluster_id}
              onSelectionChange={::this.fetchDataOnSelectionChange}
            />
          </div>

           <ScrollArea
              speed={0.8}
              className="area"
              contentClassName="content"
              horizontal={false}
            >
  				<div className="row" style={{margin: 50}}>
           
              <ProductAffinityChart 
                data = {this.state.product_affinity_data} 
                onProductParamsChange={::this.fetchDataOnProductParamsChange}
              />
          
          </div>

          </ScrollArea>

        </div>
      )
    }
    else  {
      return <div>Loading...</div>;
    }
  }
}

export default ProductAffinity;
