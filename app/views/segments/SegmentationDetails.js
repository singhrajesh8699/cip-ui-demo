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
class SegmentationListHeader extends Component {
  render() {
    return (
      <div className="col-lg-10">
        <div className='xylo-page-header'>
          <h2>Demographics Details</h2>
          <ol className="breadcrumb">
              <li>
                  <Link to="/segments/overview">Segmentations</Link>
              </li>
              <li>
                  <a><b>Details</b></a>
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
= SegmentationList component =
===============================================>>>>>*/
class SegmentationList extends Component {

	state = {data: [
		{	id: "linechart1",
			title: "Empty Nesters",
			data1: [28, 48, 40, 19],
			data2: [54, 12, 66, 21],
			revenue: 23441,
			thumb: baseURL + "/logos/empty_nesters.jpeg"},
		{	id: "linechart2",
			title: "Mom & Baby",
			data1: [54, 12, 33, 77],
			data2: [28, 48, 40, 19],
			revenue: 43573,
			thumb: baseURL + "/logos/momnbaby.jpeg"},
		{	id: "linechart4",
			title: "Young Single",
			data1: [43, 15, 76, 51],
			data2: [43, 64, 12, 53],
			revenue: 66122,
			thumb: baseURL + "/logos/young_singles.jpeg"},
		{	id: "linechart5",
			title: "Young Couples",
			data1: [54, 12, 66, 21],
			data2: [28, 48, 40, 19],
			revenue: 33154,
			thumb: baseURL + "/logos/young_couples.jpeg"}
	]}

	componentDidMount() {
		this.state.data.forEach(function(item) {
			var dataList1 = item.data1;
			var dataList2 = item.data2;

			var lineData = {
	            labels: ["Q1", "Q2", "Q3", "Q4"],
	            datasets: [
	                {
	                    label: "Example dataset",
	                    backgroundColor: "rgba(26,179,148,0.5)",
	                    borderColor: "rgba(26,179,148,0.7)",
	                    pointBackgroundColor: "rgba(26,179,148,1)",
	                    pointBorderColor: "#fff",
	                    data: dataList1
	                },
	                {
	                    label: "Example dataset",
	                    backgroundColor: "rgba(220,220,220,0.5)",
	                    borderColor: "rgba(220,220,220,1)",
	                    pointBackgroundColor: "rgba(220,220,220,1)",
	                    pointBorderColor: "#fff",
	                    data: dataList2
	                }
	            ]
	        };

	    var lineOptions = {
	        responsive: true
	    };

	    var ctx = document.getElementById(item.id).getContext("2d");
	    new Chart(ctx, {type: 'line', data: lineData, options:lineOptions});
		});

  }

  render() {
		console.log(this.state.data);
    return (
       <div>
			 		<div className="col-lg-3">
	                <div className="ibox">
	                    <div className="ibox-content">
	                        <h2 className="m-b-md" style={{textAlign: "center"}}>{this.state.data[0].title}</h2>
													<div style={{height: 150}} style={{textAlign: "center", marginTop: 30}}>
														<img src={this.state.data[0].thumb} style={{maxHeight: 150}}/>
													</div>
													<div style={{marginTop:30}}>
														<canvas id={this.state.data[0].id} height="170"></canvas>
													</div>
													<h2 style={{marginTop:30, textAlign: "center"}}>Half Yearly revenue </h2>
	                        <h1 className="text-navy" style={{marginBottom:30, textAlign: "center"}}>
															${this.state.data[0].revenue}
	                        </h1>
													<div style={{textAlign: "center"}}>
	                        	<Link to="/segments/segmentDetails">
														<Link to="/segments/segmentDetails">
															<button className="btn btn-primary" >View Details</button>
														</Link>
														</Link>
													</div>
	                    </div>
	                </div>
	            </div>

						<div className="col-lg-3">
		                <div className="ibox">
		                    <div className="ibox-content">
		                        <h2 className="m-b-md" style={{textAlign: "center"}}>{this.state.data[1].title}</h2>
														<div style={{height: 150}} style={{textAlign: "center", marginTop: 30}}>
															<img src={this.state.data[1].thumb} style={{maxHeight: 150}}/>
														</div>
														<div style={{marginTop:30}}>
															<canvas id={this.state.data[1].id} height="170"></canvas>
														</div>
														<h2 style={{marginTop:30, textAlign: "center"}}>Half Yearly revenue </h2>
		                        <h1 className="text-navy" style={{marginBottom:30, textAlign: "center"}}>
																${this.state.data[1].revenue}
		                        </h1>
														<div style={{textAlign: "center"}}>
															<Link to="/segments/segmentDetails">
																<button className="btn btn-primary" >View Details</button>
															</Link>
														</div>
		                    </div>
		                </div>
		            </div>

							<div className="col-lg-3">
			                <div className="ibox">
			                    <div className="ibox-content">
			                        <h2 className="m-b-md" style={{textAlign: "center"}}>{this.state.data[2].title}</h2>
															<div style={{height: 150}} style={{textAlign: "center", marginTop: 30}}>
																<img src={this.state.data[2].thumb} style={{maxHeight: 150}}/>
															</div>
															<div style={{marginTop:30}}>
																<canvas id={this.state.data[2].id} height="170"></canvas>
															</div>
															<h2 style={{marginTop:30, textAlign: "center"}}>Half Yearly revenue </h2>
			                        <h1 className="text-navy" style={{marginBottom:30, textAlign: "center"}}>
																	${this.state.data[2].revenue}
			                        </h1>
															<div style={{textAlign: "center"}}>
																<Link to="/segments/segmentDetails">
																	<button className="btn btn-primary" >View Details</button>
																</Link>
															</div>
			                    </div>
			                </div>
			            </div>

								<div className="col-lg-3">
				                <div className="ibox">
				                    <div className="ibox-content">
				                        <h2 className="m-b-md" style={{textAlign: "center"}}>{this.state.data[3].title}</h2>
																<div style={{height: 150}} style={{textAlign: "center", marginTop: 30}}>
																	<img src={this.state.data[3].thumb} style={{maxHeight: 150}}/>
																</div>
																<div style={{marginTop:30}}>
																	<canvas id={this.state.data[3].id} height="170"></canvas>
																</div>
																<h2 style={{marginTop:30, textAlign: "center"}}>Half Yearly revenue </h2>
				                        <h1 className="text-navy" style={{marginBottom:30, textAlign: "center"}}>
																		${this.state.data[3].revenue}
				                        </h1>
																<div style={{textAlign: "center"}}>
																	<Link to="/segments/segmentDetails">
																		<button className="btn btn-primary" >View Details</button>
																	</Link>
																</div>
				                    </div>
				                </div>
				            </div>
        </div>
    )
  }
}
/*= End of SegmentationList component =*/
/*=============================================<<<<<*/

/*=============================================>>>>>
= SegmentationMain component =
===============================================>>>>>*/
class SegmentationMain extends Component {

  componentDidMount() {
  }


  render() {
    return (
       <div className="row">
          <SegmentationList />
       </div>
    )
  }
}
/*= End of SegmentationList component =*/
/*=============================================<<<<<*/

class SegmentationDetails extends Component {
  constructor(props) {
    super(props);
  }

  render() {

		console.log("params id :" + this.props.params.id);
    return (
      <div className='xylo-page-heading'>
         <div className="row wrapper white-bg page-heading">
            <SegmentationListHeader />
         </div>

         <div className="wrapper wrapper-content">
            <SegmentationListMenu />

            <SegmentationMain />
         </div>

      </div>
    )
  }
}

export default SegmentationDetails;
