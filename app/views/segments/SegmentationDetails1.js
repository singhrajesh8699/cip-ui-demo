import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { withRouter, Link, Location } from 'react-router';
import { Route, Router, IndexRedirect, browserHistory} from 'react-router';
import Moment from 'moment';

import Chart from 'chart.js';
import c3 from '../../../public/vendor/c3/c3.min.js';

import { Segments, SegmentClusters } from '../../components/common/Segments';
import ProductCategories from '../../components/common/ProductCategories';

import "select2/dist/js/select2.full.min.js";
import "../../../node_modules/select2/dist/css/select2.css";

import * as XyloFetch from '../../components/common/XyloFetch';
import * as serverURLs from '../../components/common/UrlConstants';
var baseURL = serverURLs.BASE_URL;

import * as Themes from '../../components/common/Themes';

// --------------------------------------------------------------------
// SegmentationListHeader
// --------------------------------------------------------------------
@withRouter
class SegmentationListHeader extends Component {

  render() {

    var scheme_thumb_small = baseURL + '/logos/' + this.props.scheme_data.thumb_small;

    return (
      <div>

        <div className="row">
          <div className="col-lg-10">
              <h2>Segmentation Details</h2>
              <ol className="breadcrumb">
                  <li>
                      <Link to="/segments/ma_dashboard">Segmentations</Link>
                  </li>
                  <li>
                      <a><b>{this.props.scheme_data.name}</b></a>
                  </li>
              </ol>
          </div>
        </div>

        <div className="row" style={{paddingTop: 30}}>
            <div className="col-md-1">
               <img src={scheme_thumb_small} align="left" className="img-responsive" />
            </div>
            <div className="col-md-3">
              <div className="row">
               <h2 className="font-bold">{this.props.scheme_data.name}</h2>
                {this.props.scheme_data.description}
              </div>
            </div>

         </div>

      </div>
    );
  }
}


// --------------------------------------------------------------------
// SegmentationListItem
// --------------------------------------------------------------------
@withRouter
class SegmentationListItem extends Component {

  onSchemeChange(scheme_id, scheme_name) {
    //console.log(scheme_id, scheme_name);
    this.props.onSchemeChange(scheme_id);
  }

  onProductChange(department, category) {
    this.props.onProductChange(department, category);
  }

  render() {

    var scheme_colors = Themes.palette1.pie_colors;
    console.log(scheme_colors);

    return (
        <div>
          <div className="col-lg-12">

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
            <div className="row">
              <hr className="col-lg-11"/>
            </div>

            <div className="row" style={{paddingTop: 30}}>

                <div className="col-md-12">
                  <div className="col-md-6">
                    <SegmentationBubbleChart
                      scheme_data={this.props.scheme_data}
                      scheme_colors={scheme_colors}
                    />
                  </div>
                  <div className="col-md-6">
                    <SegmentationPieChart
                      scheme_data={this.props.scheme_data}
                      scheme_colors={scheme_colors}
                    />
                  </div>
                </div>

            </div>

          </div>
        </div>
    )
  }

}

// --------------------------------------------------------------------
// SegmentationBubbleChart
// --------------------------------------------------------------------
@withRouter
class SegmentationBubbleChart extends Component {

  constructor(props) {
    super(props);

    this.state = {
      chart: null
    };
  }

  componentDidMount() {
    this.initChart();
  }

  onBubbleClicked(evt, element) {
    let self = this;
    var chartData = this.props.scheme_data.overview.customer_aggregations[0].bubble_data;
    var clusterName = chartData.datasets[element[0]._datasetIndex].label;
    XyloFetch.getClusterId(clusterName)
    .then(function(res) {
      self.props.router.push('/segments/segmentdetails/' + res.payload._id);
    });
    //console.log(element[0]._datasetIndex);
    //this.props.router.push('/segments/segmentdetails/' + element[0]._datasetIndex);
  }

  assignColors(data, colors) {
    data.datasets.forEach(function(d, index) {
      d.backgroundColor = colors[index].bgColor;
    });
  }

  initChart() {
    const self = this;
    var chart_data = this.props.scheme_data.overview.customer_aggregations[0].bubble_data;
    console.log("Init Bubble chart");
    console.log(chart_data);
    self.assignColors(chart_data, this.props.scheme_colors);
    var labelX = this.props.scheme_data.overview.customer_aggregations[0].bubble_data.labelX;
    var labelY = this.props.scheme_data.overview.customer_aggregations[0].bubble_data.labelY;

    var options = {
      layout:{
        padding: 40
      },
      elements: {
        points: {
          borderWidth: 1,
          borderColor: 'rgb(0, 0, 0)'
        }
      },
      legend: {
        display: false
      },
      scales: {
        xAxes: [{
          display: false,
          scaleLabel: {
            display: true,
            labelString: labelX
          }
        }],
        yAxes: [{
          display: false,
          scaleLabel: {
            display: true,
            labelString: labelY
          }
        }]
      },
      tooltips: {
        //mode: 'single',
        callbacks: {
          label:
            function(tooltipItems, data) {
              //var actualValue = data.datasets[tooltipItems.datasetIndex].data[0].r * 3;
              return data.datasets[tooltipItems.datasetIndex].label;
            },
            afterBody: function(data) {
              var cluster_selected = self.props.scheme_data.clusters[data[0].datasetIndex];
              var segment_size = 'Cluster Size: ' + cluster_selected.segmentSize.toFixed(2)+'%';
              var segment_spend = 'Cluster Spend: '+ cluster_selected.segmentSpend.toFixed(2)+'%';
              var average_trips = 'Average Trips per Customer: ' + cluster_selected.avgTripsPerCust.toFixed(3);
              var average_spend = 'Average Spend per Trip: $' + cluster_selected.avgSpendPerTrip.toFixed(2);
              var average_annual_spend = 'Average Annual Spend: $' + cluster_selected.avgAnnualSpend.toFixed(2);

              var tooltip_info = [];
              tooltip_info.push(segment_size);
              tooltip_info.push(segment_spend);
              tooltip_info.push(average_trips);
              tooltip_info.push(average_spend);
              tooltip_info.push(average_annual_spend);
              return tooltip_info;
            }
        }
      },
      onClick: self.onBubbleClicked.bind(this)
    }

    // Only RFV and LifeStage support display of X and Y axes
    if (this.props.scheme_data.name === 'RFV' ||
        this.props.scheme_data.name === 'Life Stage') {
      options.scales.xAxes[0].display = true;
      options.scales.yAxes[0].display = true;
    }
    console.log("Bubble chart data:");
    console.log(chart_data);
    console.log(options);
    var ctx1 = document.getElementById('bubbleChartContainer').getContext("2d");
    this.state.chart = new Chart(ctx1,{
      type: 'bubble',
      data: chart_data,
      options: options
    });
  }

  render() {

    if (this.state.chart) {
      this.state.chart.destroy();
      this.initChart();
      //this.state.chart.data = this.props.scheme_data.overview.customer_aggregations[0].bubble_data;
      //this.state.chart.update();
    }

    return (
      <div className="ibox">
       <h2 className="m-b-md" style={{textAlign: "center"}}>Cluster Metrics</h2>
       <canvas id='bubbleChartContainer' height="300" width="500"></canvas>
      </div>
    )

  }
}

// --------------------------------------------------------------------
// SegmentationPieChart
// --------------------------------------------------------------------
@withRouter
class SegmentationPieChart extends Component {

  constructor(props) {
    super(props);

    this.state = {
      chart: null
    };
  }

  componentWillReceiveProps(newProp) {
    console.log("new props received ");
    console.log(newProp);
    this.initChart();
  }

  onPieClicked(data, index) {
    let self = this;
    XyloFetch.getClusterId(data.id)
    .then(function(res) {
      self.props.router.push('/segments/segmentdetails/' + res.payload._id);
    });
    //this.props.router.push('/segments/segmentdetails/' + data.index);
  }

  assignColors(data, scheme_colors) {
    var idx = 0;
    var colors = {};
    data.forEach(function(d) {
      var label = d[0];
      d.backgroundColor = scheme_colors[idx].bgColor;
      colors[label] = d.backgroundColor;
      idx++;
    });
    return colors;
  }

  initChart() {
    var pieData = [];
    for(var index = 1; index < 6; index++) {
      this.props.scheme_data.overview.customer_aggregations[0].sales_data.forEach(function(item) {
        if(item[2] === index) {
          pieData.push(item);
        }
      });
    }
    var self = this;
    var data = pieData;
    var new_colors = self.assignColors(data, this.props.scheme_colors);
    console.log('rt');
    console.log(data);
    console.log(new_colors);
    this.state.chart = c3.generate({
      bindto: '#segmentSales',
      unload: true,
      data:{
        columns: data,
        type : 'pie',
        colors: new_colors,
        onclick: ::self.onPieClicked
      }
    });
  }

  componentDidMount() {
    this.initChart();
  }

  render() {

    if (this.state.chart) {
      var data = this.props.scheme_data.overview.customer_aggregations[0].sales_data;
      var new_colors = this.assignColors(data, this.props.scheme_colors);
      //console.log('sc2');
      //console.log(new_colors);
      this.state.chart.load({
        unload: true,
        columns: data,
        colors: new_colors
      });
    }

    return (
      <div className="ibox">
        <h2 className="m-b-md" style={{textAlign: "center"}}>Total Sales</h2>
        <div id="segmentSales">Total Sales</div>
      </div>
    )

  }
}

// --------------------------------------------------------------------
// Segmentations
// --------------------------------------------------------------------
@withRouter
class Segmentations extends Component {

  constructor(props) {
    super(props);

    this.state = {
      scheme_data: null,
      department: null,
      category: null
    };
  }

  componentDidMount() {
    this.fetchData(this.props.params.id);
  }

  fetchData(scheme_id) {
    const self = this;
    if (scheme_id === 'default') {
      XyloFetch.getSchemeDetailsByName('RFV')
      .then(function(response) {
        self.setState({scheme_data: response.payload});
        self.fetchDataOnProductChange(null, null);
      });
    }
    else {
      XyloFetch.getSchemeDetails(scheme_id)
      .then(function(response) {
        self.setState({scheme_data: response.payload});
        self.fetchDataOnProductChange(null, null);
      });
    }
  }

  fetchDataOnProductChange(department, category) {
    const self = this;
    self.state.department = department;
    self.state.category = category;
    var department_name = undefined;
    var category_name = undefined;
    if (department) {
      department_name = department.name;
    }
    if (category) {
      category_name = category.name;
    }
    XyloFetch.getSchemeDetailsByProduct(self.state.scheme_data._id, department_name, category_name)
      .then(function(response) {
        var updatedScheme = self.updateSchemeData(response.payload);
        self.setState({scheme_data: updatedScheme});
        console.log("Updated scheme");
        console.log(updatedScheme);
    });
  }


  updateSchemeData(newData) {
    const self = this;
    var schemeData = this.state.scheme_data;
    newData.customerCount = this.updateNewData(newData.customerCount);
    schemeData.overview.customer_aggregations[0].bubble_data.datasets.forEach(function(item, index) {
      item.data[0].r = self.findSchemeCustomerCountByName(item.label, newData);

      //if (schemeData.name === 'RFV' ||
      //  schemeData.name === 'Life Stage') {
        if(schemeData.overview.customer_aggregations[0].bubble_data.xAxis) {
          item.data[0].x = self.findXAxisValue(item.label);
        }
        if(schemeData.overview.customer_aggregations[0].bubble_data.yAxis) {
          item.data[0].y = self.findYAxisValue(item.label);
        }
      //}
      //else {
      //  item.data[0].y = 50;
      //  item.data[0].x = 50 + index * 5;

        //if (index === 0) {
        //  item.data[0].x = 0;
        //  item.data[0].y = 0;
        //}
        //else if (index === 1) {
        //  item.data[0].x = 50;
        //  item.data[0].y = 0;
        //}
        //else if (index === 2) {
        //  item.data[0].x = 0;
        //  item.data[0].y = 50;
        //}
        //else if (index === 3) {
        //  item.data[0].x = 50;
        //  item.data[0].y = 50;
        //}
      //}

    });

    schemeData.overview.customer_aggregations[0].sales_data.forEach(function(item) {
      item[1] = self.findSchemeSalesByName(item[0], newData);
    });
    return schemeData;
  }

  findSchemeCustomerCountByName(name, data) {

    var count = null;
    data.customerCount.forEach(function(item) {
      if(item._id === name) {
        count = item.count;
      }
    });
    return count;
  }

  findXAxisValue(name) {
    var schemeData = this.state.scheme_data;
    var count = null;
    schemeData.overview.customer_aggregations[0].bubble_data.xAxis.forEach(function(item) {
      if(item._id === name) {
        count = item.count;
      }
    });
    return count;
  }

  findYAxisValue(name, r, index) {
    var schemeData = this.state.scheme_data;
    var count = null;
    schemeData.overview.customer_aggregations[0].bubble_data.yAxis.forEach(function(item) {
      if(item._id === name) {
        count = item.count;
      }
    });
    return count;
  }

  findSchemeSalesByName(name, data) {
    var sales = null;
    data.totalSales.forEach(function(item) {
      if(item._id === name) {
        sales = item.count;
      }
    });
    return sales;
  }

  updateNewData(newData) {
    var maxCount = 0;
    var factor = 0;
    console.log("New data:");
    newData.forEach(function(item) {
    console.log(item);
      if(item.count > maxCount) {
        maxCount = item.count;
      }
    });
    factor = this.findDividingFactor(maxCount / (Math.pow(10, maxCount.toString().length - 3)));
    newData.forEach(function(item) {
      item.count = (item.count / (Math.pow(10, maxCount.toString().length - 3))) / factor;
    });    

    // console.log("max count " + maxCount);
    // if(maxCount > 100) {
    //   var divisor = this.isDivisor(maxCount, 10);
    //   console.log("divisor is " + divisor);
    //   newData.forEach(function(item) {
    //     item.count = item.count / divisor;
    //   });
    // }
    return newData;
  }

  findDividingFactor(number) {
    var primeFactors = [1, 2, 3, 5, 7, 9, 11];
    var factor = 0;
    for (var item in primeFactors) {
      var quotient = number / primeFactors[item];
      if(quotient < 80){
        factor = primeFactors[item];
        break;
      }
    }
    return factor;
  }

  isDivisor(number, currentDivisor) {
    return (number / currentDivisor < 100) ? currentDivisor : this.isDivisor(number , (currentDivisor * 10));
  }

  render() {

    if (this.state.scheme_data) {
      //console.log('scheme data');
      //console.log(this.state.scheme_data);
      return (
        <div className='xylo-page'>
           <div className="row wrapper white-bg page-heading">
              <SegmentationListHeader
                scheme_data={this.state.scheme_data}/>
           </div>

           <div className="wrapper wrapper-content">
              <SegmentationListItem
                scheme_data={this.state.scheme_data}
                onSchemeChange={::this.fetchData}
                onProductChange={::this.fetchDataOnProductChange}
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

export default Segmentations;