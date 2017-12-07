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


class IncomeDemographics extends Component {

  constructor(props) {
    super(props);

    this.state = {
      chart: null
    };
  }

  setup_data(cluster_data) {

    var cols_data = [];
    
    var clusters = ['x'];
    clusters.push('Cluster');
    clusters.push('Company');

    var n1 = ["Low $0-$49K"];
    var n2 = ["Medium $50-$99K"];
    var n3 = ["High $100K+"];
    
    var c1, c2, c3, total;
    
    // Cluster 
    c1 = parseInt(cluster_data.cluster_details["HH Income $0-$49K"]);
    c2 = parseInt(cluster_data.cluster_details["HH Income $50-$99K"]);
    c3 = parseInt(cluster_data.cluster_details["HH Income $100K+"]);
    total = c1 + c2 + c3;
    n1.push(Math.round((c1 / total) * 100.0));
    n2.push(Math.round((c2 / total) * 100.0));
    n3.push(Math.round((c3 / total) * 100.0));

    // Company 
    c1 = parseInt(cluster_data.company_details["HH Income $0-$49K"]);
    c2 = parseInt(cluster_data.company_details["HH Income $50-$99K"]);
    c3 = parseInt(cluster_data.company_details["HH Income $100K+"]);
    total = c1 + c2 + c3;
    n1.push(Math.round((c1 / total) * 100.0));
    n2.push(Math.round((c2 / total) * 100.0));
    n3.push(Math.round((c3 / total) * 100.0));

    cols_data.push(clusters);
    cols_data.push(n1);
    cols_data.push(n2);
    cols_data.push(n3);

    //console.log(cols_data);

    return cols_data;
  }

  //init chart
  init_chart(income_data) {
    var self = this;

    self.state.chart = c3.generate({
      bindto: '#incomeChart',
      size: {
        height: 400,
        width: 280
      },
      title: { text: 'Household Income' },
      data:{
        x : 'x',
        columns: income_data,
        colors:{
          'Low $0-$49K': Themes.palette1.bar_colors[0].bgColor,
          'Medium $50-$99K': Themes.palette1.bar_colors[1].bgColor,
          'High $100K+': Themes.palette1.bar_colors[2].bgColor,
        },
        type: 'bar',
        groups: [
          ['Low $0-$49K', 'Medium $50-$99K', 'High $100K+']
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
    var income_data = this.setup_data(this.props.cluster_data);
    if (income_data) {
      this.init_chart(income_data);
    }
  }

  render() {
    var income_data = this.setup_data(this.props.cluster_data);
    if (this.state.chart) {
      this.state.chart.load({
        unload: true,
        columns: income_data
      });
    }
    else {
      if (income_data) {
        this.init_chart(income_data);
      }
    }
    return (
      <div>
        <div id="incomeChart"></div>
      </div>
    );
  }

}

class AgeDemographics extends Component {

  render() {

    var cluster_age = this.props.cluster_data.cluster_details.ageMedian[0].Age;
    var company_age = this.props.cluster_data.company_details.ageMedian[0].Age;
    
    return (
      <div className="col-sm-12">
            <div className="ibox float-e-margins">
                <div className="ibox-title">
                 <div className="col-sm-1"><i className="fa fa-2x fa-birthday-cake"></i></div>
                    <div className="col-sm-11">
                      <h4>Median Age</h4>
                    </div>
                </div>

                <div className="ibox-content">         

                    <div className="row">
                        <div className="col-md-6">
                            <h2 className="no-margins">{cluster_age}</h2>
                            <div className="font-bold text-navy"><small>Cluster Average</small></div>
                        </div>
                        <div className="col-md-6">
                            <h2 className="no-margins">{company_age}</h2>
                            <div className="font-bold text-navy"><small>Company Average</small></div>
                        </div>
                    </div>


                </div>
            </div>
        </div>
    );
  }
}

class ChildrenDemographics extends Component {

  render() {

    var cluster_cih = this.props.cluster_data.cluster_details.childrenInHouseholdClusterAvg.toFixed(0);
    var company_cih = this.props.cluster_data.company_details.childrenInHouseholdClusterAvg.toFixed(0);

    return (
      <div className="col-sm-12">
            <div className="ibox float-e-margins">
                <div className="ibox-title">
                  <div className="col-sm-1"><i className="fa fa-2x fa-group"></i></div>
                    <div className="col-sm-11">
                      <h4>Children in Household Percentage</h4>
                    </div>
                </div>
                <div className="ibox-content">

                    <div className="row">
                        <div className="col-md-6">
                            <h2 className="no-margins">{cluster_cih}%</h2>
                            <div className="font-bold text-navy"><small>Cluster Average</small></div>
                        </div>
                        <div className="col-md-6">
                            <h2 className="no-margins">{company_cih}%</h2>
                            <div className="font-bold text-navy"><small>Company Average</small></div>
                        </div>
                    </div>


                </div>
            </div>
        </div>
      );
  }

}

class GenderDemographics extends Component {

  render() {

    var cluster_gender = this.props.cluster_data.cluster_details.femalePercentage.toFixed(0);
    var company_gender = this.props.cluster_data.company_details.femalePercentage.toFixed(0);
    return (
      <div className="col-sm-12">
            <div className="ibox float-e-margins">
                <div className="ibox-title">
                  <div className="col-sm-1"><i className="fa fa-2x fa-female"></i></div>
                    <div className="col-sm-11">
                      <h4>Female Percentage</h4>
                    </div>
                </div>
                <div className="ibox-content">
                    <div className="row">
                        <div className="col-md-6">
                            <h2 className="no-margins">{cluster_gender}%</h2>
                            <div className="font-bold text-navy"><small>Cluster Average</small></div>
                        </div>
                        <div className="col-md-6">
                            <h2 className="no-margins">{company_gender}%</h2>
                            <div className="font-bold text-navy"><small>Company Average</small></div>
                        </div>
                    </div>


                </div>
            </div>
        </div>
    );
  }
}


class ClusterDemographics extends Component {

  render() {
    return (
      <div>
        <div className="row">
          <div className="col-sm-12">
            <h2 className="m-b-md" style={{textAlign: "center", paddingTop: 10}}>Demographics Metrics</h2>
            <div className="row" style={{paddingTop: 30}}>
              <div className="col-sm-8">
                <div className="row">
                  <AgeDemographics cluster_data={this.props.data} />
                </div>
                <div className="row">
                  <GenderDemographics cluster_data={this.props.data} />
                </div>
                <div className="row">
                  <ChildrenDemographics cluster_data={this.props.data} />
                </div> 
              </div>
              <div className="col-sm-4">
                <div className="row" style={{paddingTop: 30}}>
                 <IncomeDemographics cluster_data={this.props.data} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default ClusterDemographics;
