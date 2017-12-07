import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { withRouter, Link, Location } from 'react-router';
import { Route, Router, IndexRedirect, browserHistory} from 'react-router';
import Moment from 'moment';
// import vex from 'vex';
import ReactBubbleChart from 'react-bubble-chart';

import Chart from 'chart.js';
import c3 from '../../../public/vendor/c3/c3.min.js';

import "select2/dist/js/select2.full.min.js";
import "../../../node_modules/select2/dist/css/select2.css";


import * as XyloFetch from '../../components/common/XyloFetch';
import * as serverURLs from '../../components/common/UrlConstants';
var baseURL = serverURLs.BASE_URL;

/*=============================================>>>>>
= ClusterHeader component =
===============================================>>>>>*/
class ClusterHeader extends Component {
  render() {
    return (
      <div className="col-lg-10">
        <div className='xylo-page-header'>
          <h2>Cluster Details</h2>
          <ol className="breadcrumb">
              <li>
                  <Link to="/segments/overview">Cluster</Link>
              </li>
              <li>
                  <a><b>Details</b></a>
              </li>
          </ol>
        </div>
      </div>
    )
  }
}
/*= End of ClusterHeader component =*/
/*=============================================<<<<<*/

/*=============================================>>>>>
= AgeChart component =
===============================================>>>>>*/
class AgeChart extends Component {
	componentDidMount() {
		var data = [
			['Cluster Average', 39],
			['Company Average', 43]
		]

		c3.generate({
			bindto: '#ageChart',
			data:{
				columns: data,
				colors: {
					'Cluster Average': '#00BFFF',
					'Company Average': '#FF6A6A'
				},
				type : 'pie'
			}
		});
	}

	render() {
		return (
			<div className="row">
				<div className="col-md-12 text-center">
					<h2>
						Median Age
					</h2>
				</div>
				<div className="col-md-12">
					<div id="ageChart"></div>
				</div>

			</div>
		)
	}
}
/*= End of AgeChart component =*/
/*=============================================<<<<<*/

/*=============================================>>>>>
= Cluster Characteristics =
===============================================>>>>>*/

class ClusterCharacteristics extends Component {
  componentDidMount() {
    (()=> {
      var barOptions = {
        responsive: true
      };

      var barData = {
        labels: ["Female Customers", "Children in household", "HH Income $0-$49.9K", "HH Income $50-$99.9K", "HH Income $100K+", "Live 0-3 miles from Company", "Live 3-10 miles from Company"],
        datasets: [
         {
           label: "Cluster Average",
           backgroundColor: '#FFCCCC',
           pointBorderColor: "#fff",
           data: [84.7, 55.6, 14.2, 45.5, 40.4, 34.5, 23.8]
         },
         {
           label: "Company Average",
           backgroundColor: '#98F5FF',
           borderColor: "#98F5FF",
           pointBackgroundColor: "#98F5FF",
           pointBorderColor: "#fff",
           data: [65.0, 35.6, 28.7, 45.6, 25.6, 32.9, 21.6]
         }
        ]
      };

      var ctx2 = document.getElementById("barChart").getContext("2d");
      new Chart(ctx2, {type: 'bar', data: barData, options:barOptions});
    })();
  }

  render() {
    return (
      <div className="row">
				<div className="col-sm-12 text-center">
					<h2>
						Cluster Characteristics
					</h2>
				</div>
        <div className="col-sm-12">
          <canvas id="barChart" height="130"></canvas>
        </div>
      </div>
    )
  }

}


/*= End of Cluster Characteristics =*/
/*=============================================<<<<<*/

/*=============================================>>>>>
= LifeStage  =
===============================================>>>>>*/

class LifeStage extends Component {
  componentDidMount() {
    var data = [
      ['Young Singles', 7.3],
      ['Young Couples', 10.2],
      ['Mom & Child', 15.5],
      ['Mom & Tween', 8.1],
      ['Mom & Teen', 18],
      ['Empty Nester', 34.4],
      ['Mature', 10.2]
    ]

    c3.generate({
      bindto: '#lifestage',
      data:{
        columns: data,
        colors: {
          'Young Singles': '#87CEEB',
          'Young Couples': '#FF6A6A',
          'Mom & Child': '#00BFFF',
          'Mom & Tween': '#1BCDD1',
          'Mom & Teen': '#FF7F00',
          'Empty Nester': '#CD919E',
          'Mature': '#EB8CC6'
        },
        type : 'pie'
      }
    });

  }

  render() {
    return (
			<div className="row" >
				<div className="col-md-12 text-center">
					<h2>
						Life Stage
					</h2>
				</div>
				<div className="col-md-12">
					<div id="lifestage"></div>
				</div>
			</div>

    )
  }

}

/*= End of LifeStage  =*/
/*=============================================<<<<<*/

/*=============================================>>>>>
= Shopping charts =
===============================================>>>>>*/

class Shopping extends Component {
  componentDidMount() {
    (()=> {
      var barOptions = {
        responsive: true
      };

      var barData = {
        labels: ["Company Guests", "Company Spend"],
        datasets: [
         {
           label: "Segment Average",
           backgroundColor: 'rgba(179, 179, 179, 0.7)',
           pointBorderColor: "#fff",
           data: [2.9, 22.7]
         },
         {
           label: "Company Guest Average",
           backgroundColor: 'rgba(135, 206, 255, 0.7)',
           borderColor: "rgba(135, 206, 255, 0.7)",
           pointBackgroundColor: "rgba(135, 206, 255, 0.7)",
           pointBorderColor: "#fff",
           data: [4.6, 20.3]
         }
        ]
      };

      var ctx2 = document.getElementById("shoppingChart").getContext("2d");
      new Chart(ctx2, {type: 'bar', data: barData, options:barOptions});
    })();
  }

  render() {
    return (
      <div className="row">
        <div className="col-sm-4">
          <h3 style={{textAlign: 'center', paddingTop: 20}}>Shopping Overview</h3>
          <canvas id="shoppingChart" height="200"></canvas>
        </div>
        <div className="col-sm-8" style={{marginTop: 20}}>
          <h3 style={{textAlign: 'center'}}>Shopping Categories Overview</h3>
          <div className='row'>
            <div className="col-lg-3">
              <div className="ibox" style={{border: '1px solid #ccc'}}>
                <div className="ibox-content">
                  <h5 className="m-b-md">Grocery</h5>
                  <h2 className="text-navy">
                      <i className="fa fa-play fa-rotate-270"></i> Up
                  </h2>
                  <small>Last down 42 days ago</small>
                </div>
              </div>
            </div>
            <div className="col-lg-3">
              <div className="ibox" style={{border: '1px solid #ccc'}}>
                <div className="ibox-content">
                  <h5 className="m-b-md">Health & Beauty</h5>
                  <h2 className="text-navy">
                      <i className="fa fa-play fa-rotate-270"></i> Up
                  </h2>
                  <small>Last down 42 days ago</small>
                </div>
              </div>
            </div>
            <div className="col-lg-3">
              <div className="ibox" style={{border: '1px solid #ccc'}}>
                <div className="ibox-content">
                  <h5 className="m-b-md">Perishables</h5>
                  <h2 className="text-navy">
                      <i className="fa fa-play fa-rotate-270"></i> Up
                  </h2>
                  <small>Last down 42 days ago</small>
                </div>
              </div>
            </div>
            <div className="col-lg-3">
              <div className="ibox" style={{border: '1px solid #ccc'}}>
                <div className="ibox-content">
                  <h5 className="m-b-md">D/D/F</h5>
                  <h2 className="text-navy">
                      <i className="fa fa-play fa-rotate-270"></i> Up
                  </h2>
                  <small>Last down 42 days ago</small>
                </div>
              </div>
            </div>
            <div className="col-lg-3">
              <div className="ibox" style={{border: '1px solid #ccc'}}>
                <div className="ibox-content">
                  <h5 className="m-b-md">Healthcare</h5>
                  <h2 className="text-navy">
                      <i className="fa fa-play fa-rotate-270"></i> Up
                  </h2>
                  <small>Last down 42 days ago</small>
                </div>
              </div>
            </div>
            <div className="col-lg-3">
              <div className="ibox" style={{border: '1px solid #ccc'}}>
                <div className="ibox-content">
                  <h5 className="m-b-md">A & A</h5>
                  <h2 className="text-danger">
                      <i className="fa fa-play fa-rotate-90"></i> Down
                  </h2>
                  <small>Last down 42 days ago</small>
                </div>
              </div>
            </div>
            <div className="col-lg-3">
              <div className="ibox" style={{border: '1px solid #ccc'}}>
                <div className="ibox-content">
                  <h5 className="m-b-md">Home</h5>
                  <h2 className="text-danger">
                      <i className="fa fa-play fa-rotate-90"></i> Down
                  </h2>
                  <small>Last down 42 days ago</small>
                </div>
              </div>
            </div>
            <div className="col-lg-3">
              <div className="ibox" style={{border: '1px solid #ccc'}}>
                <div className="ibox-content">
                  <h5 className="m-b-md">Mens</h5>
                  <h2 className="text-danger">
                      <i className="fa fa-play fa-rotate-90"></i> Down
                  </h2>
                  <small>Last down 42 days ago</small>
                </div>
              </div>
            </div>
            <div className="col-lg-3">
              <div className="ibox" style={{border: '1px solid #ccc'}}>
                <div className="ibox-content">
                  <h5 className="m-b-md">Electronics</h5>
                  <h2 className="text-danger">
                      <i className="fa fa-play fa-rotate-90"></i> Down
                  </h2>
                  <small>Last down 42 days ago</small>
                </div>
              </div>
            </div>
            <div className="col-lg-3">
              <div className="ibox" style={{border: '1px solid #ccc'}}>
                <div className="ibox-content">
                  <h5 className="m-b-md">Housewares</h5>
                  <h2 className="text-danger">
                      <i className="fa fa-play fa-rotate-90"></i> Down
                  </h2>
                  <small>Last down 42 days ago</small>
                </div>
              </div>
            </div>
            <div className="col-lg-3">
              <div className="ibox" style={{border: '1px solid #ccc'}}>
                <div className="ibox-content">
                  <h5 className="m-b-md">J/A</h5>
                  <h2 className="text-danger">
                      <i className="fa fa-play fa-rotate-90"></i> Down
                  </h2>
                  <small>Last down 42 days ago</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

}



/*= End of Shopping charts =*/
/*=============================================<<<<<*/

/*=============================================>>>>>
= Best Light =
===============================================>>>>>*/

class BestLightValue extends Component {
  componentDidMount() {
    var data = [
      ['Best Guests', 10],
      ['Heavy Guests', 30],
      ['Medium Guests', 30],
      ['Light Guests', 30]
    ]

    c3.generate({
      bindto: '#lightvalue',
      data:{
        columns: data,
        colors: {
          'Best Guests': '#00BFFF',
          'Heavy Guests': '#FF6A6A',
          'Medium Guests': '#B08BEB',
          'Light Guests': '#EB8CC6'
        },
        type : 'pie'
      }
    });
  }

  render() {
    return (
				<div className="row">
					<div className="col-md-12 text-center">
						<h2>
							Median Age
						</h2>
					</div>
					<div className="col-md-12">
						<div id="lightvalue"></div>
					</div>
				</div>
    )
  }

}


/*= End of Best Light =*/
/*=============================================<<<<<*/

/*=============================================>>>>>
= Migration =
===============================================>>>>>*/
class Migration extends Component {
  componentDidMount() {
    var data = [
      ['Enthusiasts', 31.1],
      ['Convenience', 40.4],
      ['Moderates', 14.6],
      ['Occasional Spenders', 1.6],
      ['Least Engaged', 1.1],
      ['No Behavior', 2.4]
    ];

    c3.generate({
      bindto: '#migrationChart',
      data:{
        columns: data,
        colors: {
          'Enthusiasts': '#87CEEB',
          'Convenience': '#FF6A6A',
          'Moderates': '#1BCDD1',
          'Occasional Spenders': '#EB8CC6',
          'Least Engaged': '#AB82FF',
          'No Behavior': '#FF8C00'
        },
        type : 'pie'
      }
    });
  }

  render() {
    return (
			<div className="row">
				<div className="col-md-12 text-center">
					<h2>
						Median Age
					</h2>
				</div>
				<div className="col-md-12">
					<div id="migrationChart"></div>
				</div>
			</div>
    )
  }
}
/*= End of Migration =*/
/*=============================================<<<<<*/


/*=============================================>>>>>
= ClusterMain component =
===============================================>>>>>*/
class ClusterMain extends Component {

  render() {
    return (
       <div className="row">
			 	<div className="col-md-4" style={{paddingBottom: 20, paddingBottom: 20}}>
        	<AgeChart />
				</div>
				<div className="col-md-8" style={{paddingBottom: 20, paddingBottom: 20}}>
					<ClusterCharacteristics />
				</div>
				<div className="col-md-4 border-top" style={{paddingTop: 20, paddingBottom: 20}}>
        	<LifeStage />
				</div>
				<div className="col-md-4 border-top" style={{paddingTop: 20, paddingBottom: 20}}>
        	<BestLightValue />
				</div>
				<div className="col-md-4 border-top" style={{paddingTop: 20, paddingBottom: 20}}>
        	<Migration />
				</div>
				<div className="col-md-12 border-top" style={{paddingTop: 20, paddingBottom: 20}}>
					<Shopping />
				</div>
      </div>
    )
  }
}
/*= End of AgeChart component =*/
/*=============================================<<<<<*/

class ClusterDetails extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className='xylo-page-heading'>
         <div className="row wrapper white-bg page-heading">
            <ClusterHeader />
         </div>

         <div className="row">
					 <div className="col-lg-12">
					 	<div className="wrapper wrapper-content">
					 		<div className="ibox">
					 			<div className="ibox-title">
					 				<h5>Cluster Name</h5>
					 			</div>
					 			<div className="ibox-content xylo-list">
	            		<ClusterMain />
								</div>
							</div>
						</div>
					</div>
         </div>

      </div>
    )
  }
}

export default ClusterDetails;
