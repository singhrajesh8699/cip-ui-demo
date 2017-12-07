import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { withRouter, Link, Location } from 'react-router';
import { Route, Router, IndexRedirect, browserHistory} from 'react-router';
import Moment from 'moment';
// import vex from 'vex';
import ReactBubbleChart from 'react-bubble-chart';

import Chart from 'chart.js';
import { Sparklines, SparklinesLine } from 'react-sparklines';

import "select2/dist/js/select2.full.min.js";
import "../../../node_modules/select2/dist/css/select2.css";


import * as XyloFetch from '../../components/common/XyloFetch';
import * as serverURLs from '../../components/common/UrlConstants';
var baseURL = serverURLs.BASE_URL;

/*=============================================>>>>>
= RFVSegment Component =
===============================================>>>>>*/
class RFVSegment extends Component {
	constructor(props) {
		super(props);
		console.log("rfv");
		console.log(props);
	}

	componentDidMount() {
		var leastValuable = this.props.data.card.least_valuable;
		var mostValuable = this.props.data.card.most_valuable;
		var lineData = {
			labels: ["Q1", "Q2", "Q3", "Q4"],
			datasets: [
				{
					label: "Most Valuable",
					backgroundColor: "rgba(26,179,148,0.5)",
					borderColor: "rgba(26,179,148,0.7)",
					pointBackgroundColor: "rgba(26,179,148,1)",
					pointBorderColor: "#fff",
					data: [mostValuable['Q1 Sales'], mostValuable['Q2 Sales'], mostValuable['Q3 Sales'], mostValuable['Q4 Sales']]
				},
				{
					label: "Least valuable",
					backgroundColor: "rgba(220,220,220,0.5)",
					borderColor: "rgba(220,220,220,1)",
					pointBackgroundColor: "rgba(220,220,220,1)",
					pointBorderColor: "#fff",
					data: [leastValuable['Q1 Sales'], leastValuable['Q2 Sales'], leastValuable['Q3 Sales'], leastValuable['Q4 Sales']]
				}
			]
		};

		var lineOptions = {
				responsive: true
		};

		if(document.getElementById('rfv_linechart')){
			var ctx = document.getElementById('rfv_linechart').getContext("2d");
			new Chart(ctx, {type: 'line', data: lineData, options:lineOptions});
		}
	}

	render() {
		var imgsrc_mostval = baseURL + this.props.data.card.most_valuable.THUMB;
		var imgsrc_leastval = baseURL + this.props.data.card.least_valuable.THUMB;
		return (
			<div className="col-sm-2 col-lg-5ths col-md-5ths">
				<div className="ibox">
					<div className="ibox-content product-box" style={{height: 650}}>
						<h2 className="m-b-md" style={{textAlign: "center"}}>{this.props.data.name}</h2>
						<div style={{height: 150}} style={{textAlign: "center", marginTop: 50}}>
							<h4 style={{textAlign: "center"}}>Most Valuable</h4>
							<img src={imgsrc_mostval} style={{maxHeight: 140, maxWidth: 140}}/>
							<h3 style={{textAlign: "center"}}>{this.props.data.card.most_valuable.FIRST_NAME} {this.props.data.card.most_valuable.LAST_NAME}</h3>
						</div>
						<div style={{marginTop:50}}>
							<canvas id="rfv_linechart" height="170"></canvas>
						</div>
						<div style={{height: 150}} style={{textAlign: "center", marginTop: 50}}>
							<h4 style={{textAlign: "center"}}>Least Valuable</h4>
							<img src={imgsrc_leastval} style={{maxHeight: 140, maxWidth: 140}}/>
							<h3 style={{textAlign: "center"}}>{this.props.data.card.least_valuable.FIRST_NAME} {this.props.data.card.least_valuable.LAST_NAME}</h3>
						</div>
					</div>
					<div className="ibox-content">
					<div style={{textAlign: "center"}}>
						<Link to={"/segments/segmentationDetails/"+this.props.data._id}>
							<button className="btn btn-primary" >View Details</button>
						</Link>
					</div>
					</div>
				</div>
			</div>
		)
	}
}
/*= End of RFVSegment Component =*/
/*=============================================<<<<<*/


/*=============================================>>>>>
= Potential Segment Component =
===============================================>>>>>*/
class PotentialSegment extends Component {
	constructor(props) {
		super(props);
	}

	componentDidMount() {
		var lineData = {
			labels: ["Q1", "Q2", "Q3", "Q4"],
			datasets: [
				{
					label: "Revenue",
					backgroundColor: "rgba(26,179,148,0.5)",
					borderColor: "rgba(26,179,148,0.7)",
					pointBackgroundColor: "rgba(26,179,148,1)",
					pointBorderColor: "#fff",
					data: this.props.data.card.potential_customer_revenue
				}
			]
		};

		var lineOptions = {
				responsive: true
		};

		if(document.getElementById('potential_linechart')){
			var ctx = document.getElementById('potential_linechart').getContext("2d");
			new Chart(ctx, {type: 'line', data: lineData, options:lineOptions});
		}
	}

	render() {
		return (
			<div className="col-sm-2 col-lg-5ths col-md-5ths">
				<div className="ibox">
					<div className="ibox-content product-box" style={{height: 650}}>
						<h2 className="m-b-md" style={{textAlign: "center"}}>{this.props.data.name}</h2>
						<div style={{height: 150}} style={{textAlign: "center", marginTop: 50}}>
							<h4 style={{textAlign: "center"}}>Potential Customer</h4>
							<img src={baseURL + this.props.data.card.potential_customer.thumb} style={{maxHeight: 140, maxWidth: 140}}/>
							<h3 style={{textAlign: "center"}}>{this.props.data.card.potential_customer.FIRST_NAME} {this.props.data.card.potential_customer.LAST_NAME}</h3>
						</div>
						<div style={{marginTop:30}}>
							<canvas id="potential_linechart" height="170"></canvas>
						</div>
						<h3 style={{textAlign: "center", paddingTop: 30}}> Top Potential</h3>
						<table className="table table-stripped small m-t-md">
							<tbody>
								{
									this.props.data.card.top_potential.map(function(item, i) {
										return (
											<tr key={item.FIRST_NAME+i}>
												<td className="no-borders">
													<i className="fa fa-circle text-navy" style={{marginLeft: 10}}></i>
												</td>
												<td  className="no-borders">
													<h4>{item.FIRST_NAME} {item.LAST_NAME}</h4>
												</td>
											</tr>
										)
									})
								}
							</tbody>
						</table>
					</div>
					<div className="ibox-content">
						<div style={{textAlign: "center"}}>
							<Link to={"/segments/segmentationDetails/"+this.props.data._id}>
								<button className="btn btn-primary" >View Details</button>
							</Link>
						</div>
					</div>
				</div>
			</div>
		)
	}
}
/*= End of Potential Segment Component =*/
/*=============================================<<<<<*/

/*=============================================>>>>>
= LifeStage Component =
===============================================>>>>>*/
class LifeStageSegment extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		var data = this.props.data.card;
		var youngSingles = [data.young_singles.q1, data.young_singles.q2, data.young_singles.q3, data.young_singles.q4];
		var youngCouples = [data.young_couples.q1, data.young_couples.q2, data.young_couples.q3, data.young_couples.q4];
		var matures = [data.matures.q1, data.matures.q2, data.matures.q3, data.matures.q4];
		var emptyNesters = [data.empty_nesters.q1, data.empty_nesters.q2, data.empty_nesters.q3, data.empty_nesters.q4];

		return (
			<div className="col-sm-2 col-lg-5ths col-md-5ths">
				<div className="ibox">
					<div className="ibox-content product-box" style={{height: 650}}>
						<h2 className="m-b-md" style={{textAlign: "center"}}>{this.props.data.name}</h2>

						<h4 style={{textAlign: "center", marginTop: 50}}>Young Singles</h4>
						<Sparklines data={youngSingles} limit={5} width={100} height={25} margin={5} >
							<SparklinesLine color="rgba(237, 85, 101, 0.5)" />
						</Sparklines>

						<h4 className="border-top" style={{textAlign: "center", paddingTop: 20}}>Young Couples</h4>
						<Sparklines data={youngCouples} limit={5} width={100} height={25} margin={5}>
							<SparklinesLine color="rgba(237, 85, 101, 0.5)" />
						</Sparklines>

						<h4 className="border-top" style={{textAlign: "center", paddingTop: 20}}>Matures</h4>
						<Sparklines data={matures} limit={5} width={100} height={25} margin={5}>
							<SparklinesLine color="rgba(237, 85, 101, 0.5)" />
						</Sparklines>

						<h4 className="border-top" style={{textAlign: "center", paddingTop: 20}}>Empty Nesters</h4>
						<Sparklines data={emptyNesters} limit={5} width={100} height={25} margin={5}>
							<SparklinesLine color="rgba(237, 85, 101, 0.5)" />
						</Sparklines>
					</div>
					<div className="ibox-content">
						<div style={{textAlign: "center"}}>
							<Link to={"/segments/segmentationDetails/"+this.props.data._id}>
								<button className="btn btn-primary" >View Details</button>
							</Link>
						</div>
					</div>
				</div>
			</div>
		)
	}
}
/*= End of LifeStage Component =*/
/*=============================================<<<<<*/

/*=============================================>>>>>
= Life Style Segment Component =
===============================================>>>>>*/
class LifeStyleSegment extends Component {
	constructor(props) {
		super(props);
	}

	componentDidMount() {
		var barOptions = {
			responsive: true
		};

		var barData = {
			labels: this.props.data.card.shopping_expense.labels,
			datasets: [
			 {
				 label: "Average Shopping Expense Trend",
				 backgroundColor: 'rgba(26,179,148,0.5)',
				 pointBorderColor: "#fff",
				 data: this.props.data.card.shopping_expense.data
			 }
			]
		};

		var ctx2 = document.getElementById("lifestyle_barChart").getContext("2d");
		new Chart(ctx2, {type: 'bar', data: barData, options:barOptions});
	}

	render() {
		return (
			<div className="col-sm-2 col-lg-5ths col-md-5ths">
				<div className="ibox">
					<div className="ibox-content product-box" style={{height: 650}}>
						<h2 className="m-b-md" style={{textAlign: "center"}}>{this.props.data.name}</h2>
						<div style={{height: 150}} style={{textAlign: "center", marginTop: 50}}>
							<img src={baseURL+this.props.data.card.thumb} style={{maxHeight: 150, maxWidth: "80%"}}/>
						</div>
						<div style={{marginTop:50}}>
							{/* <canvas id={this.state.data[3].id} height="170"></canvas> */}
							<canvas id="lifestyle_barChart" height="230"></canvas>
						</div>
						<h3 style={{marginTop:50, textAlign: "center"}}>Half Yearly revenue </h3>
						<h1 className="text-navy" style={{marginBottom:30, textAlign: "center"}}>
								${this.props.data.card.revenue}
						</h1>
					</div>
					<div className="ibox-content">
						<div style={{textAlign: "center"}}>
							<Link to={"/segments/segmentationDetails/"+this.props.data._id}>
								<button className="btn btn-primary" >View Details</button>
							</Link>
						</div>
					</div>
				</div>
			</div>
		)
	}
}
/*= End of Life Style Segment Component =*/
/*=============================================<<<<<*/

/*=============================================>>>>>
= Mission Segment Component =
===============================================>>>>>*/
class MissionSegment extends Component {
	constructor(props) {
		super(props);
	}

	componentDidMount() {
		var lineData = {
			labels: ["Q1", "Q2", "Q3", "Q4"],
			datasets: [
				{
					label: "Most Valuable",
					backgroundColor: "rgba(26,179,148,0.5)",
					borderColor: "rgba(26,179,148,0.7)",
					pointBackgroundColor: "rgba(26,179,148,1)",
					pointBorderColor: "#fff",
					data: this.props.data.card.data1
				},
				{
					label: "Least valuable",
					backgroundColor: "rgba(220,220,220,0.5)",
					borderColor: "rgba(220,220,220,1)",
					pointBackgroundColor: "rgba(220,220,220,1)",
					pointBorderColor: "#fff",
					data: this.props.data.card.data2
				}
			]
		};

		var lineOptions = {
				responsive: true
		};

		if(document.getElementById('mission_linechart')){
			var ctx = document.getElementById('mission_linechart').getContext("2d");
			new Chart(ctx, {type: 'line', data: lineData, options:lineOptions});
		}
	}

	render() {
		return (
			<div className="col-sm-2 col-lg-5ths col-md-5ths">
				<div className="ibox">
					<div className="ibox-content product-box" style={{height: 650}}>
						<h2 className="m-b-md" style={{textAlign: "center"}}>{this.props.data.name}</h2>
						<div style={{height: 150}} style={{textAlign: "center", marginTop: 50}}>
							<img src={baseURL+this.props.data.card.thumb} style={{maxHeight: 150, maxWidth: "80%"}}/>
						</div>
						<div style={{marginTop:50}}>
							<canvas id="mission_linechart" height="170"></canvas>
						</div>
						<h3 style={{marginTop:50, textAlign: "center"}}>Half Yearly revenue </h3>
						<h1 className="text-navy" style={{marginBottom:30, textAlign: "center"}}>
								${this.props.data.card.revenue}
						</h1>
						{/*
						<Sparklines data={this.props.data.card.line_chart} limit={5} width={100} height={50} margin={5}>
							<SparklinesLine color="#253e56" />
						</Sparklines>
						*/}
					</div>
					<div className="ibox-content">
						<div style={{textAlign: "center"}}>
							<Link to={"/segments/segmentationDetails/"+this.props.data._id}>
								<button className="btn btn-primary" >View Details</button>
							</Link>
						</div>
					</div>
				</div>
			</div>
		)
	}
}
/*= End of Mission Segment Component =*/
/*=============================================<<<<<*/

/*=============================================>>>>>
= MADashboardList component =
===============================================>>>>>*/
class MADashboardList extends Component {
	state = {
		data: []
	};

	componentWillMount() {
		XyloFetch.getSchemes()
	 .then(response => {
		 console.log(response);
		 this.setState({data: response.payload});
	 });
	}

	componentDidMount() {}

  render() {
		console.log(this.state.data);
    return (
			<div>
				{
					this.state.data.map(function(item, i) {
						return (
							<div className="col-sm-2 col-lg-5ths col-md-5ths">
								<div className="ibox">
									<div className="ibox-content product-box xylo-cmetrics-dashboard" style={{height: 1000}}>
										<Link to={"/segments/segmentationDetails/" + item._id}>
											<h2 className="m-b-md" style={{textAlign: "center", color: "#000", paddingBottom: 10, borderColor: "#cfcfcf", borderWidth: "0px 0px 3px 0px", borderStyle: "solid"}}>{item.name} </h2>
										</Link>
										{
											item.clusters.map(function(cluster, i) {
												var img_url = baseURL + "/logos/" + cluster.thumbnail;
												return (
													<Link to={"/segments/segmentDetails/" + cluster._id}>
													<div style={{height: 80}} style={{textAlign: "center", marginTop: 50, borderColor: "#efefef", borderWidth: "0px 0px 1px 0px", borderStyle: "solid"}}>
														<h4 style={{textAlign: "center", color: "#000"}}>{cluster.name}</h4>
														<div style={{maxHeight: 70, minHeight: 100}}>
															<img src={img_url} className="img-circle" style={{maxHeight: 100, maxWidth: 150}}/>
														</div>
													</div>
													</Link>
											)
											}.bind(this))
										}


									</div>
									<div className="ibox-content">
									<div style={{textAlign: "center"}}>
										<Link to={"/segments/segmentationDetails/" + item._id}>
											<button className="btn btn-primary" >View Details</button>
										</Link>
									</div>
									</div>
								</div>
							</div>
						)
					}.bind(this))
				}
      </div>
    )
  }
}
/*= End of MADashboardList component =*/
/*=============================================<<<<<*/

/*=============================================>>>>>
= MADashboard component =
===============================================>>>>>*/
class MADashboard extends Component {

  componentDidMount() {
  }
  render() {
    return (
     <div className="row">
      <MADashboardList />
     </div>
    )
  }
}
/*= End of MADashboardList component =*/
/*=============================================<<<<<*/

class SegmentationDetails extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className='xylo-page'>
       <div className="wrapper wrapper-content">
          <MADashboard />
       </div>
      </div>
    )
  }
}

export default SegmentationDetails;
