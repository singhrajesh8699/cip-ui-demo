import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { withRouter, Link, Location } from 'react-router';
import { Route, Router, IndexRedirect, browserHistory} from 'react-router';
import moment from 'moment';
// import vex from 'vex';


import { Segments, SegmentClusters } from '../../components/common/Segments';
import ProductCategories from '../../components/common/ProductCategories';

import * as XyloFetch from '../../components/common/XyloFetch';
import Chart from 'chart.js';
import c3 from '../../../public/vendor/c3/c3.min.js';
import * as Themes from '../../components/common/Themes';

import "select2/dist/js/select2.full.min.js";
import "../../../node_modules/select2/dist/css/select2.css";

/*=============================================>>>>>
= Customer feedback header =
===============================================>>>>>*/
class CustomerFeedbackHeader extends Component {
  render() {
    return (
      <div className="col-lg-10">
          <h2>Customer Feedback</h2>
          <ol className="breadcrumb">
              <li>
                <Link to="/segments/ma_dashboard">Segmentations</Link>
              </li>
              <li>
                <a><b>Customer Feedback</b></a>
              </li>
          </ol>
      </div>
    );
  }
}
/*= End of Customer feedback header =*/
/*=============================================<<<<<*/


/*=============================================>>>>>
= Customer feedback Header menu =
===============================================>>>>>*/
class CustomerFeedbackHeaderMenu extends Component {

  constructor(props) {
    super(props);
    this.state = {
      cluster_id: null,
      department: null,
      category: null,
      source: null,
      month: '1',

      traffic_source_ref: null,
      month_ref: null
    };
  }

  componentDidMount() {
    this.state.cluster_id = this.props.cluster_id;
    this.initMenu();
  }

  onProductChange(department, category) {
    this.state.department = department;
    this.state.category = category;
    this.props.onSelectionChange(this.state.department, this.state.category, this.state.cluster_id, this.state.source, this.state.month);
  }

  onSegmentChange(selected_id, selected_val) {
    this.state.cluster_id = selected_id;
    this.props.onSelectionChange(this.state.department, this.state.category, this.state.cluster_id, this.state.source, this.state.month);
  }

  onMonthChange(month_id) {
    this.state.month = month_id;
    this.props.onSelectionChange(this.state.department, this.state.category, this.state.cluster_id, this.state.source, this.state.month);
  }

  onTrafficSourceChange(source) {
    this.state.source = source;
    this.props.onSelectionChange(this.state.department, this.state.category, this.state.cluster_id, this.state.source, this.state.month);
  }

  initMenu()
  {
    var self = this;

    var traffic_source_data = [{'id': -1, text: ''}];
    traffic_source_data.push({'id': 'Phones', 'text': 'Phones'});
    traffic_source_data.push({'id': 'Desktops', 'text': 'Desktops'});
    traffic_source_data.push({'id': 'Laptops', 'text': 'Laptops'});
    traffic_source_data.push({'id': 'Servers', 'text': 'Servers'});
    traffic_source_data.push({'id': 'Tablets', 'text': 'Tablets'});

    self.state.traffic_source_ref = $(".traffic_source").select2({
      placeholder: { id: "-1",  text: "Traffic Source" },
      allowClear: true,
      minimumResultsForSearch: Infinity,
      data: traffic_source_data
    });

    self.state.traffic_source_ref.on('change.select2', function(e) {
      var select_val = self.state.traffic_source_ref.select2('data')[0].id;
      //console.log(select_val);
      self.onTrafficSourceChange(select_val);
    });

    var month_data = [];
    month_data.push({'id': '1', 'text': 'January'});
    month_data.push({'id': '2', 'text': 'February'});
    month_data.push({'id': '3', 'text': 'March'});
    month_data.push({'id': '4', 'text': 'April'});
    month_data.push({'id': '5', 'text': 'May'});
    month_data.push({'id': '6', 'text': 'June'});
    month_data.push({'id': '7', 'text': 'July'});
    month_data.push({'id': '8', 'text': 'August'});
    month_data.push({'id': '9', 'text': 'September'});
    month_data.push({'id': '10', 'text': 'October'});
    month_data.push({'id': '11', 'text': 'November'});
    month_data.push({'id': '12', 'text': 'December'});

    self.state.month_ref = $(".month").select2({
      placeholder: "Select a Month",
      minimumResultsForSearch: Infinity,
      data: month_data
    });

    self.state.month_ref.on('change.select2', function(e) {
      var select_val = self.state.month_ref.select2('data')[0].id;
      //console.log(select_val);
      self.onMonthChange(select_val);
    });

  }

  render() {
    return (
      <div className="col-lg-12">
        
        <div style={{marginTop: 10, marginLeft: 10}}> 
          
          <div className="row">

              <div className="col-sm-3">
                <SegmentClusters 
                  init_cluster_id={this.props.cluster_id} 
                  onSegmentChange={::this.onSegmentChange}
                  divRowClass1='col-sm-6'
                  divRowClass2='col-sm-6' 
                />
              </div>

              <div className="col-sm-offset-1 col-sm-4">

                <div className="row">
                  <div className="col-sm-5">
                    <h4>Select a Traffic Source</h4>
                  </div>

                  <div className="col-sm-5">
                    <h4>Select a Month</h4>
                  </div>
                </div>


                <div className="row">
                  <div className="col-sm-5">
                    <select className="traffic_source form-control"/>
                  </div>
           
                   <div className="col-sm-5">
                    <select className="month form-control"/>
                  </div>
                </div>

              </div>
              
              <div className="col-sm-4">
                <div>
                    <ProductCategories 
                      divRowClass1='col-sm-5'
                      divRowClass2='col-sm-5'
                      onChange={::this.onProductChange}
                    />
                </div>
              </div>

          </div>

          <hr className="col-lg-11"/>
        </div>
      </div>
    )
  }
}

/*= End of Customer feedback Header menu =*/
/*=============================================<<<<<*/


/*=============================================>>>>>
= CustomerFeedbackSentimentScore component =
===============================================>>>>>*/
class CustomerFeedbackSentimentScore extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chartData: null,
      selectedSentiment: '',
      selectedReviewSentiment: null,
      selectedReviewAssignment: null,
      feedbackTableHeight: 360,
      reviews: [],
      assignmentArray: [],
      sentimentArray: []
    };
  }

  initChart(sentiment_data) {
    console.log("sentiment initchart");
    console.log(sentiment_data);
    var self = this;
    var sentimentArray = ['Sentiment Score'];
    var contributionArray = ['Contribution'];
    var categoriesArray = [];
    sentiment_data.data.sentiment_contribution.forEach(function(item) {
      sentimentArray.push(item.sentiment);
      contributionArray.push(item.contribution);
      categoriesArray.push(item.name);
    });
    var data = [contributionArray, sentimentArray];

    if(this.chart) {
      this.chart.destroy();
    }

    this.chart = c3.generate({
      bindto: '#sentimentChart',
      data: {
        columns: data,
        type: 'bar',
        color: function (color, d) {
            if(d.id)
              return d.id === 'Sentiment Score' && Math.abs(d.value) > 50 ? 'rgba(255, 99, 132, 0.6)' : (d.id === 'Contribution' ? 'rgba(55, 86, 186, 0.6)' : 'rgba(245, 107, 20, 0.6)');
            },
        groups: [
          ['Contribution', 'Sentiment Score']
        ],
        labels: {
          format: function (value, id, index, j) {
              if(id === "Sentiment Score")
                return (parseFloat(value)/100.0).toFixed(2);
              else
                return value.toFixed(0) + "%";
          }
        },
        onclick: ::self.labelClicked,
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
          categories: categoriesArray
        },
        y: {
          show: false
        }
      }
    });
  }

  labelClicked(data, index) {
    var assignmentArray = [];
    var sentimentArray = [];
    this.props.data.data.sentiment_contribution[data.index].reviews.forEach(function(item) {
      if(assignmentArray.indexOf(item.assignment) === -1) {
        assignmentArray.push(item.assignment);
      }
      if(sentimentArray.indexOf(item.sentiment) === -1) {
        sentimentArray.push(item.sentiment);
      }
    });

    this.setState({
      reviews: this.props.data.data.sentiment_contribution[data.index].reviews,
      selectedSentiment: this.props.data.data.sentiment_contribution[data.index].name,
      assignmentArray: assignmentArray,
      sentimentArray: sentimentArray,
      selectedReviewSentiment: '',
      selectedReviewAssignment: ''
    });
    console.log(data); console.log(index);
  }

  assignmentChanged(e) {
    this.setState({selectedReviewAssignment: e.target.value});
  }

  sentimentChanged(e) {
    this.setState({selectedReviewSentiment: e.target.value});
  }

  componentWillReceiveProps(props) {
    if(props.data) {
      this.initChart(props.data);
    }
    this.setState({chartData: props.data,
      reviews: [],
      selectedSentiment: '',
      assignmentArray: [],
      sentimentArray: []
    });
  }

	componentDidMount() {
    if(this.props.data) {
      this.initChart(this.props.data);
      this.setState({chartData: this.props.data});
    } else {
      this.setState({chartData: null});
    }
	}

  render() {
    var self = this;
    console.log("sentiment render");
    console.log(this.state.chartData);
    return (
      
      <div>

          <div className="row">
            <h4>Sentiment Score and Contribution Analysis</h4>
          </div>

          <div className="row"> 
            <div id="sentimentChart" style={{width: 600}}></div>
          </div>

         {
            (()=> {
              if(this.state.selectedSentiment !== '') {
              
                return (

                  <div>
                    <div className="row" style={{paddingTop: 60}}>
                      <h2>{this.state.selectedSentiment}</h2>
                    </div>

                    <div className="row" style={{paddingTop: 20}}>

                        <div className="col-md-6">
                          <label>Assignment Type: </label>
                          <select className="form-control m-b" name="account" onChange={::this.assignmentChanged} value={this.state.selectedReviewAssignment}>
                            <option value=''>All Statements</option>
                            {
                              this.state.assignmentArray.map(function(item, i) {
                                return (
                                  <option key={item+i}>{item}</option>
                                )
                              })
                            }
                          </select>
                        </div>

                        <div className="col-md-6">
                          <label>Sentiment Filter: </label>
                          <select className="form-control m-b" name="account" onChange={::this.sentimentChanged} value={this.state.selectedReviewSentiment}>
                            <option value=''>All Statements</option>
                            {
                              this.state.sentimentArray.map(function(item, i) {
                                return (
                                  <option key={item+i}>{item}</option>
                                )
                              })
                            }
                          </select>
                        </div>

                    </div>

                    <div className="row">

                        <div className="col-md-12" style={{maxHeight: this.state.feedbackTableHeight}}>
                        {
                          (() => {
                            if(this.state.selectedSentiment !== '') {
                              return (
                                <ul className="list-group">
                                  {
                                    this.state.reviews.map(function(item, i) {
                                      var badgeclass = 'badge ';
                                      if(item.positivity === 0) {
                                        badgeclass = 'badge badge-danger';
                                      } else if(item.positivity === 1) {
                                        badgeclass = 'badge badge-warning';
                                      } else if(item.positivity === 2) {
                                        badgeclass = 'badge badge-success';
                                      } else if(item.positivity === 3) {
                                        badgeclass = 'badge badge-info';
                                      } else if(item.positivity === 4) {
                                        badgeclass = 'badge badge-primary';
                                      }
                                      if(!this.state.selectedReviewSentiment && !this.state.selectedReviewAssignment) {
                                        return (
                                          <li key={i} className="list-group-item">
                                              <span className={badgeclass}>&nbsp;&nbsp;</span>
                                              {item.review}
                                          </li>
                                        )
                                      } else if(this.state.selectedReviewSentiment && !this.state.selectedReviewAssignment) {
                                        if(this.state.selectedReviewSentiment === item.sentiment) {
                                          return (
                                            <li key={i} className="list-group-item">
                                                <span className={badgeclass}>&nbsp;&nbsp;</span>
                                                {item.review}
                                            </li>
                                          )
                                        }
                                      } else if(!this.state.selectedReviewSentiment && this.state.selectedReviewAssignment) {
                                        if(this.state.selectedReviewAssignment === item.assignment) {
                                          return (
                                            <li key={i} className="list-group-item">
                                                <span className={badgeclass}>&nbsp;&nbsp;</span>
                                                {item.review}
                                            </li>
                                          )
                                        }
                                      } else {
                                        if((this.state.selectedReviewAssignment === item.assignment) &&
                                            (this.state.selectedReviewSentiment === item.sentiment)) {
                                          return (
                                            <li key={i} className="list-group-item">
                                                <span className={badgeclass}>&nbsp;&nbsp;</span>
                                                {item.review}
                                            </li>
                                          )
                                        }
                                      }
                                    }.bind(this))
                                  }
                                </ul>
                              )
                              }
                            })()
                          }
                        </div>

                    </div>
                  </div>
                )
              }
            })()
          }
      </div>
    )
  }
}
/*= End of CustomerFeedbackSentimentScore component =*/
/*=============================================<<<<<*/


/*=============================================>>>>>
= CustomerFeedbackPurchase component =
===============================================>>>>>*/
class CustomerFeedbackPurchase extends Component {
  constructor(props) {
    super(props);
    this.tableData=[];
    this.state = {
      feedbackData: null
    };
  }

  initChart(feedback_data) {
  var data = [];
  var colors = {};
  this.tableData = [];
  feedback_data.data.feedback.forEach(function(item, i) {
    data.push([item.name, item.value]);
    colors[item.name] = Themes.palette1.pie_colors[i].bgColor;
    this.tableData.push({name: item.name, value: item.value});
  }.bind(this));

    if(this.chart) {
      this.chart.destroy();
    }

    this.chart = c3.generate({
      bindto: '#purchaseFeedback',
      data:{
        columns: data,
        colors: colors,
        type : 'pie'
      }
    });
  }

  componentWillMount() {
    this.setState({feedbackData: this.props.data});
  }

  componentDidMount() {
    if(this.props.data && this.props.data.data) {
      this.initChart(this.props.data);
      this.setState({feedbackData: this.props.data});
    } else {
      this.setState({feedbackData: null});
    }
  }

  componentWillReceiveProps(props) {
    if(props.data) {
      this.initChart(props.data);
    }
    this.setState({feedbackData: props.data});
  }

  render() {
    var self = this;
    return (
      <div className="purchase-feedback-container">
        <div>
          <div>
            <h4>Feedback</h4>
          </div>
          <div>
            <div className="row">
              <div className="col-xs-12 col-sm-6">
                <div id="purchaseFeedback"></div>
              </div>
              <div className="col-xs-2 col-sm-2" style={{marginTop: 20}}>
                <table className="table table-bordered table-striped table-hover">
                  <thead>
                    <tr>
                      <th>Feedback Type</th>
                      <th>Percent Customers</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      this.tableData.map(function(item, i) {
                        return (
                          <tr key={item.name+i}>
                            <td>{item.name}</td>
                            <td>{item.value}%</td>
                          </tr>
                        )
                      })
                    }
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
/*= End of CustomerFeedbackPurchase component =*/
/*=============================================<<<<<*/


class CustomerFeedback extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cluster_id: null,
      department: null,
      category: null,
      month: '1',
      customerFeedback_data: null,

      initialized: false
    };
  }

  fetchData(cluster_name) {
    const self = this;
    XyloFetch.getClusterId(cluster_name)
      .then(function(res) {
        self.setState({cluster_id: res.payload._id});
        self.fetchDataOnSelectionChange(self.state.department, self.state.category, self.state.cluster_id, self.state.source, self.state.month);
      });
  }

  fetchDataOnSelectionChange(department, category, cluster_id, source, month) {
    const self = this;
    
    self.state.department = department;
    self.state.category = category;
    self.state.cluster_id = cluster_id;
    self.state.source = source;
    self.state.month = month;


    XyloFetch.queryFeedback({
        department_name: self.state.department ? self.state.department.name : null,
        category_name: self.state.category ? self.state.category.name : null,
        cluster_id: self.state.cluster_id,
        source: self.state.source,
        month: self.state.month
      })
      .then(function(response, err) {
          self.state.initialized = true;
          //console.log(response);
          if (response.status.errorCode) {
            self.setState({customerFeedback_data: null});
          }
          else {
            self.setState({customerFeedback_data: response.payload});
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
          <div className='xylo-page'>

            <div className="row wrapper white-bg page-heading">
              <CustomerFeedbackHeader />
            </div>

           <div className="row">
            <CustomerFeedbackHeaderMenu 
              cluster_id={this.state.cluster_id}
              onSelectionChange={::this.fetchDataOnSelectionChange}
            />
           </div>

           <div className="row" style={{paddingTop: 30}}>
             <div>

                <div className="row" style={{paddingTop: 30}}>
                    <div className="col-md-12" style={{paddingLeft: 50}}>
                      <div className="col-md-6">
                        <CustomerFeedbackSentimentScore
                          data={this.state.customerFeedback_data}
                        />
                      </div>
                      <div className="col-md-6">
                        <CustomerFeedbackPurchase
                          data={self.state.customerFeedback_data}
                         />
                      </div>
                    </div>
                </div>
              </div>
            </div>

          </div>
        )
    }
    else {
       return <div>Loading...</div>;
    }
  }
}

export default CustomerFeedback;
