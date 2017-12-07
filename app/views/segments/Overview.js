import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { withRouter, Link, Location } from 'react-router';
import { Route, Router, IndexRedirect, browserHistory} from 'react-router';
import Moment from 'moment';
// import vex from 'vex';
import ReactBubbleChart from 'react-bubble-chart';

import Chart from 'chart.js';

import "select2/dist/js/select2.full.min.js";
import "../../../node_modules/select2/dist/css/select2.css";


import * as XyloFetch from '../../components/common/XyloFetch';
import * as serverURLs from '../../components/common/UrlConstants';
var baseURL = serverURLs.BASE_URL;

/*=============================================>>>>>
= SegmentationListHeader component =
===============================================>>>>>*/
@withRouter
class SegmentationListHeader extends Component {
  render() {
    return (
      <div className="col-lg-10">
        <div className='xylo-page-header'>
          <h2>Segmentations</h2>
          <ol className="breadcrumb">
              <li>
                  <Link to="/dataprep/dashboard">Segmentations</Link>
              </li>
              <li>
                  <a><b>Overview</b></a>
              </li>
          </ol>
        </div>
      </div>
    );
  }
}
/*= End of SegmentationListHeader component =*/
/*=============================================<<<<<*/

/*=============================================>>>>>
= SegmentationListMenu component =
===============================================>>>>>*/
@withRouter
class SegmentationListMenu extends Component {

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
/*= End of SegmentationListMenu component =*/
/*=============================================<<<<<*/


/*=============================================>>>>>
= SegmentationListDemographics component =
===============================================>>>>>*/
@withRouter
class SegmentationListItem extends Component {

  componentDidMount() {
    this.initItem();

		this.initCharts()

  }

  initItem()
  {

  }

	initCharts() {
		var data1 = this.props.bubbleData;
		var labelX = this.props.labelX;
		var labelY = this.props.labelY;

		var options = {
										layout:{
											padding: 50
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
									      scaleLabel: {
									        display: true,
									        labelString: labelX
									      }
									    }],
									    yAxes: [{
									      scaleLabel: {
									        display: true,
									        labelString: labelY
									      }
									    }]
									  },
										tooltips: {
					            callbacks: {
					                label: function(tooltipItems, data) {
														var actulaValue = data.datasets[tooltipItems.datasetIndex].data[0].r * 3;
					                  return data.datasets[tooltipItems.datasetIndex].label +': ' + actulaValue;
					                }
					            }
					          }
									}

		var ctx1 = document.getElementById(this.props.bubbleId).getContext("2d");
		new Chart(ctx1,{
		    type: 'bubble',
		    data: data1,
		    options: options
		});

	}


  render() {

		var data = [
			{
				_id: "a",
				value: 432,
				sentiment: 2,
				selected: false
			},
			{
				_id: "b",
				value: 432,
				sentiment: 3,
				selected: false
			},
			{
				_id: "c",
				value: 432,
				sentiment: 4,
				selected: false
			},
			{
				_id: "d",
				value: 432,
				sentiment: 5,
				selected: false
			}
		];

		var bubbleUrl = baseURL + '/logos/' + this.props.bubble;

    return (
      <div>
        <div className="row">
          <div className="col-lg-12">
            <div className="ibox overview-product-detail">
              <div className="ibox-title">
                 <div className="row">
                    <div className="col-md-1">
											<img src={this.props.image_url} align="left" className="img-responsive" />
                    </div>
                    <div className="col-md-3">
                       <h2 className="font-bold">{this.props.name}</h2>
                       <small>Description</small>
                    </div>
                    <div className="pull-right" style={{paddingRight: 10}}>
                      <div className="row">
                        <div className="col-md-1 pull-right">
                         <button type='button' className="pull-right btn btn-white btn-md">
                            <Link to='/segments/segmentationDetails' className='text-primary'>
                            	<i className="fa fa-list-ul"></i> Details
                            </Link>
                         </button>
                         &nbsp;
                        </div>
                      </div>
                      <div>
                        <medium className="analysis-text-container">
                         <strong>Analysis:</strong> {this.props.analysis_text}
                        </medium>
                      </div>
                    </div>
                 </div>
              </div>
              <div className="ibox-content">
                <div className="row" style={{paddingTop: 30}}>
                   <div className="col-md-6">
                      <div>
											{/*
                         <SegmentationBubbleChart data={data} id={this.props.name} />
											 */}
												<canvas id={this.props.bubbleId} height="100"></canvas>
                      </div>
                   </div>
                   <div className="col-md-6">
                      <div>
                         <SegmentationBarChart id={this.props.name} />
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
/*= End of SegmentationListMenu component =*/
/*=============================================<<<<<*/

@withRouter
class SegmentationBarChart extends Component {

  constructor(props) {
    super(props);
  }

  testOnClick(evt, element) {
    console.log(this.props);
    this.props.router.push('/segments/segmentDetails');
  }

  componentDidMount() {

    var self = this;

    (() => {
      var ctx = $("#Demographics").get(0).getContext("2d");
      var data = {
          labels: ["Empty Nesters", "Mom & Baby", "Matures", "Young Single", "Young Couples"],
          datasets: [
              {
                  backgroundColor: [
                      'rgba(255, 99, 132, 0.5)',
                      'rgba(54, 162, 235, 0.5)',
                      'rgba(255, 206, 86, 0.5)',
                      'rgba(75, 192, 192, 0.5)',
                      'rgba(153, 102, 255, 0.5)'
                  ],
                  borderColor: [
                      'rgba(255,99,132,1)',
                      'rgba(54, 162, 235, 1)',
                      'rgba(255, 206, 86, 1)',
                      'rgba(75, 192, 192, 1)',
                      'rgba(153, 102, 255, 1)'
                  ],
                  borderWidth: 1,
                  data: [65, 59, 80, 81, 56],
              }
          ]
      };

      var myBarChart = new Chart(ctx, {
        type: 'bar',
        data: data,
        options: {
          responsive: true,
          legend: {
            display: false
          },
          scales: {
            yAxes: [{
              scaleLabel: {
                display: true,
                labelString: 'LTV'
              }
            }]
          },
          onClick: self.testOnClick.bind(this),
          tooltips: {
            callbacks: {
                label: function(tooltipItems, data) {
									console.log(data);
                    return tooltipItems.yLabel;
                }
            }
          }
        }
      });

    })();

    (() => {
      var ctx = $("#RFV").get(0).getContext("2d");
      var data = {
          labels: ["Conv Shoppers", "VIP", "Least Engaged", "Enthusiasts", "Occ Spenders"],
          datasets: [
              {
                  backgroundColor: [
                      'rgba(155, 99, 162, 0.5)',
                      'rgba(154, 162, 135, 0.5)',
                      'rgba(255, 206, 186, 0.5)',
                      'rgba(75, 192, 92, 0.5)',
                      'rgba(153, 102, 125, 0.5)'
                  ],
                  borderColor: [
                      'rgba(155,99,132,1)',
                      'rgba(154, 162, 235, 1)',
                      'rgba(255, 206, 86, 1)',
                      'rgba(75, 192, 192, 1)',
                      'rgba(153, 102, 255, 1)'
                  ],
                  borderWidth: 1,
                  data: [35, 39, 12, 20, 61],
              }
          ]
      };

      var myBarChart = new Chart(ctx, {
        type: 'bar',
        data: data,
        options: {
          responsive: true,
          legend: {
            display: false
          },
          scales: {
            yAxes: [{
              scaleLabel: {
                display: true,
                labelString: 'LTV'
              }
            }]
          },
          tooltips: {
            callbacks: {
                label: function(tooltipItems, data) {
									console.log(data);
                  return tooltipItems.yLabel;
                }
            }
          }
        }
      });

    })();

  }

  render() {

    return (
      <div><canvas id={this.props.id} width='80' height='25'></canvas></div>
    )

  }
}

class SegmentationBubbleChart extends Component {

  componentDidMount() {

  }

	onSliceClick(data) {
	 	console.log('clicked');
 	}
  render () {

		var colorLegend = [
		  //reds from dark to light
		  {color: "#67000d", text: 'Negative', textColor: "#ffffff"}, "#a50f15", "#cb181d", "#ef3b2c", "#fb6a4a", "#fc9272", "#fcbba1", "#fee0d2",
		  //neutral grey
		  {color: "#f0f0f0", text: 'Neutral'},
		  // blues from light to dark
		  "#deebf7", "#c6dbef", "#9ecae1", "#6baed6", "#4292c6", "#2171b5", "#08519c", {color: "#08306b", text: 'Positive', textColor: "#ffffff"}
		];

		var tooltipProps =
			[{
			  css: 'symbol',
			  prop: '_id'
			}, {
			  css: 'value',
			  prop: 'value',
			  display: 'Last Value'
			}, {
			  css: 'change',
			  prop: 'colorValue',
			  display: 'Change'
			}];


			var data = [];
			this.props.data.forEach( function(d) {
				data.push({
	        _id: d._id,
	        value: d.value,
	        colorValue: d.sentiment,
	        selected: d.selected
	      });
			});

      return (
        <ReactBubbleChart
          className="my-cool-chart"
          colorLegend={colorLegend}
          data={data}
          selectedColor="#737373"
          selectedTextColor="#d9d9d9"
          fixedDomain={{min: -1, max: 1}}
          onClick={this.onSliceClick}
          legend={true}
          legendSpacing={0}
          tooltip={true}
          tooltipProps={tooltipProps}
        />
      )
  }
}

@withRouter
class Segmentations extends Component {
  constructor(props) {
    super(props);
  }

  render() {
		var data1 = {
									datasets: [
											{
													label: 'Empty Nesters',
													data: [
															{
																	x: 60,
																	y: 100,
																	r: 22
															}
													],
													backgroundColor:"rgba(255, 99, 132, 0.6)",
													hoverBackgroundColor: "rgba(255, 99, 132, 1)",
											},
											{
													label: 'Mom & Baby',
													data: [
															{
																	x: 21,
																	y: 50,
																	r: 20
															}
													],
													backgroundColor:"rgba(154, 162, 235, 0.6)",
													hoverBackgroundColor: "rgba(154, 162, 235, 1)",
											},
											{
													label: 'Matures',
													data: [
															{
																	x: 35,
																	y: 75,
																	r: 26
															}
													],
													backgroundColor:"rgba(255, 206, 86, 0.6)",
													hoverBackgroundColor: "rgba(255, 206, 86, 1)",
											},
											{
													label: 'Young Single',
													data: [
															{
																	x: 20,
																	y: 25,
																	r: 27
															}
													],
													backgroundColor:"rgba(75, 192, 192, 0.6)",
													hoverBackgroundColor: "rgba(75, 192, 192, 1)",
											},
											{
													label: 'Young Couples',
													data: [
															{
																	x: 27,
																	y: 45,
																	r: 19
															}
													],
													backgroundColor:"rgba(153, 102, 255, 0.6)",
													hoverBackgroundColor: "rgba(153, 102, 255, 1)",
											}]
										};

		var data2 = {
									datasets: [
										{
												label: 'Conv Shoppers',
												data: [
														{
																x: 16,
																y: 25,
																r: 35
														}
												],
												backgroundColor:"rgba(155, 99, 162, 0.5)",
												hoverBackgroundColor: "rgba(155, 99, 162, 1)",
										},
										{
												label: 'VIP',
												data: [
														{
																x: 21,
																y: 21,
																r: 39
														}
												],
												backgroundColor:"rgba(154, 162, 135, 0.5)",
												hoverBackgroundColor: "rgba(154, 162, 135, 1)",
										},
										{
												label: 'Least Engaged',
												data: [
														{
																x: 46,
																y: 15,
																r: 12
														}
												],
												backgroundColor:"rgba(255, 206, 186, 0.5)",
												hoverBackgroundColor: "rgba(255, 206, 186, 1)",
										},
										{
												label: 'Enthusiasts',
												data: [
														{
																x: 28,
																y: 20,
																r: 20
														}
												],
												backgroundColor:"rgba(75, 192, 92, 0.5)",
												hoverBackgroundColor: "rgba(75, 192, 92, 1)",
										},
										{
												label: 'Occ Spenders',
												data: [
														{
																x: 33,
																y: 30,
																r: 61
														}
												],
												backgroundColor:"rgba(153, 102, 125, 0.5)",
												hoverBackgroundColor: "rgba(153, 102, 125, 1)",
										}]
							};


    return (
      <div className='xylo-page-heading'>
         <div className="row wrapper white-bg page-heading">
            <SegmentationListHeader />
         </div>

         <div className="wrapper wrapper-content">

            <SegmentationListMenu />

            <SegmentationListItem
              name='Demographics'
              image_url='/img/demo.jpg'
							bubble="bubble1.png"
							labelX="Age group"
							labelY="Baskete Size"
							bubbleData={data1}
							bubbleId="bubbleContainer1"
              analysis_text='Empty Nesters shop as much for Electronics as Young Single' />

            <SegmentationListItem
              name='RFV'
              image_url='/img/rfm.png'
							bubble="bubble2.png"
							labelX="Trip Frequency"
							labelY="Number of customers"
							bubbleData={data2}
							bubbleId="bubbleContainer2"
              analysis_text='Occasional Shoppers shop more than Convenience Shoppers'
              />

         </div>

      </div>
    )
  }
}

export default Segmentations;
