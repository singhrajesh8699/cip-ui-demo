import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import c3 from '../../../public/vendor/c3/c3.min.js';
import Chart from 'chart.js';

import * as XyloFetch from '../../components/common/XyloFetch';
import * as serverURLs from '../../components/common/UrlConstants';
var baseURL = serverURLs.BASE_URL;
/*=============================================>>>>>
= Traffic Component =
===============================================>>>>>*/
class TrafficComponent extends Component {
  componentDidMount() {
    (()=>{
      var lineData = {
        labels: ["Q1-15", "Q2-15", "Q3-15", "Q4-15", "Q1-16", "Q2-16", "Q3-16", "Q4-16"],
        datasets: [
            {
                label: "Traffic",
                backgroundColor: 'rgba(135, 206, 235, 0.7)',
                borderColor: "rgba(135, 206, 235, 0.7)",
                pointBackgroundColor: "rgba(135, 206, 235, 0.7)",
                pointBorderColor: "rgba(135, 206, 235, 0.7)",
                data: [48, 58, 20, 49, 36, 87, 70, 50]
            }
        ]
    };

    var lineOptions = {
        responsive: true
    };
    var ctx = document.getElementById("trafficChart").getContext("2d");
    new Chart(ctx, {type: 'line', data: lineData, options:lineOptions});

    })();
  }

  render() {
    return (
      <div className="ibox float-e-margins">
        <div className="ibox-content">
          <canvas id="trafficChart" height="120"></canvas>
          <div className="row header-section-headings">
            <div className="col-xs-12 col-sm-6">
              <div className="header-heading">Traffic</div>
            </div>
            <div className="col-xs-12 col-sm-6 header-subheading">
              <div className="header-subheading-1">+9.7% increase</div>
              <div className="header-subheading-2">in traffic over 2015</div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
/*= End of Traffic Component =*/
/*=============================================<<<<<*/

/*=============================================>>>>>
= Revenuw Component =
===============================================>>>>>*/
class RevenueComponent extends Component {
  componentDidMount() {
    (()=>{
      var lineData = {
        labels: ["Q1-15", "Q2-15", "Q3-15", "Q4-15", "Q1-16", "Q2-16", "Q3-16", "Q4-16"],
        datasets: [
            {
                label: "Revenue",
                backgroundColor: 'rgba(26,179,148,0.5)',
                borderColor: "rgba(26,179,148,0.7)",
                pointBackgroundColor: "rgba(26,179,148,1)",
                pointBorderColor: "#fff",
                data: [28, 48, 40, 19, 86, 27, 90, 50]
            }
        ]
    };

    var lineOptions = {
        responsive: true
    };
    var ctx = document.getElementById("revenueChart").getContext("2d");
    new Chart(ctx, {type: 'line', data: lineData, options:lineOptions});

    })();
  }

  render() {
    return (
      <div className="ibox float-e-margins">
        <div className="ibox-content">
          <canvas id="revenueChart" height="120"></canvas>
          <div className="row header-section-headings">
            <div className="col-xs-12 col-sm-6">
              <div className="header-heading">Revenue</div>
            </div>
            <div className="col-xs-12 col-sm-6 header-subheading">
              <div className="header-subheading-1">+3.8% increase</div>
              <div className="header-subheading-2">in revenue over 2015</div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
/*= End of Revenuw Component =*/
/*=============================================<<<<<*/

/*=============================================>>>>>
= middle Component =
===============================================>>>>>*/
class MiddleComponent extends Component {
  render() {
    return (
      <div className="">
        <div className="col-xs-12 col-sm-6 col-md-5ths col-lg-5ths white-bg">
          <div className="widget yellow-bg p-sm text-center">
              <div className="m-b-xs">
                <h3 className="m-xs">Add to Cart Rate</h3>
                <h2 className="font-bold ">7.9%</h2>
              </div>
          </div>
          <div className="ibox middle-sub-component-section-sucess">
            <div className="ibox-content">
              <h5 className="m-b-md">Increased over 2015</h5>
              <h2 className="text-navy">
                <i className="fa fa-play fa-rotate-270"></i> +2.5%
              </h2>
            </div>
          </div>
        </div>
        <div className="col-xs-12 col-sm-6 col-md-5ths col-lg-5ths white-bg">
          <div className="widget yellow-bg p-sm text-center">
              <div className="m-b-xs">
                <h3 className="m-xs">Average Order Size</h3>
                <h2 className="font-bold">$124.77</h2>
              </div>
          </div>
          <div className="ibox middle-sub-component-section-sucess">
            <div className="ibox-content">
              <h5 className="m-b-md">Increased over 2015</h5>
              <h2 className="text-navy">
                <i className="fa fa-play fa-rotate-270"></i> +1.8%
              </h2>
            </div>
          </div>
        </div>
        <div className="col-xs-12 col-sm-6 col-md-5ths col-lg-5ths white-bg">
          <div className="widget yellow-bg p-sm text-center">
              <div className="m-b-xs">
                <h3 className="m-xs">% Conversion</h3>
                <h2 className="font-bold">2.09%</h2>
              </div>
          </div>
          <div className="ibox middle-sub-component-section-failure">
            <div className="ibox-content">
              <h5 className="m-b-md">Decreased over 2015</h5>
              <h2 className="text-danger">
                <i className="fa fa-play fa-rotate-90"></i> -2.7%
              </h2>
            </div>
          </div>
        </div>
        <div className="col-xs-12 col-sm-6 col-md-5ths col-lg-5ths white-bg">
          <div className="widget yellow-bg p-sm text-center">
              <div className="m-b-xs">
                <h3 className="m-xs">% Abandoned Cart</h3>
                <h2 className="font-bold">34.1%</h2>
              </div>
          </div>
          <div className="ibox middle-sub-component-section-sucess">
            <div className="ibox-content">
              <h5 className="m-b-md">Increased over 2015</h5>
              <h2 className="text-navy">
                <i className="fa fa-play fa-rotate-270"></i> +2.8%
              </h2>
            </div>
          </div>
        </div>
        <div className="col-xs-12 col-sm-6 col-md-5ths col-lg-5ths white-bg">
          <div className="widget yellow-bg p-sm text-center">
              <div className="m-b-xs">
                <h3 className="m-xs">% Abandoned Checkout</h3>
                <h2 className="font-bold">14.6%</h2>
              </div>
          </div>
          <div className="ibox middle-sub-component-section-sucess">
            <div className="ibox-content">
              <h5 className="m-b-md">Increased over 2015</h5>
              <h2 className="text-navy">
                <i className="fa fa-play fa-rotate-270"></i> +6.7%
              </h2>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
/*= End of Component =*/
/*=============================================<<<<<*/

/*=============================================>>>>>
= middle Component =
===============================================>>>>>*/
class MiddleComponentX extends Component {
  render() {
    return (
      <div className="">
        <div className="col-xs-12 col-sm-6 col-md-5ths col-lg-5ths white-bg">
         <div className="widget style1 yellow-bg">
            <div className="row">
              <div className="col-xs-8">
                  <span>Add to Cart Rate</span>
                  <h2 className="font-bold">7.9%</h2>
              </div>
            </div>
          </div>
          <div className="ibox middle-sub-component-section-sucess">
            <div className="ibox-content">
              <h5 className="m-b-md">Increased over 2015</h5>
              <h2 className="text-navy">
                <i className="fa fa-play fa-rotate-270"></i> +2.5%
              </h2>
            </div>
          </div>
        </div>
        <div className="col-xs-12 col-sm-6 col-md-5ths col-lg-5ths white-bg">
          <div className="widget style1 yellow-bg">
            <div className="row">
              <div className="col-xs-8">
                  <span>Average Order Size</span>
                  <h2 className="font-bold">$124.77</h2>
              </div>
            </div>
          </div>
          <div className="ibox middle-sub-component-section-sucess">
            <div className="ibox-content">
              <h5 className="m-b-md">Increased over 2015</h5>
              <h2 className="text-navy">
                <i className="fa fa-play fa-rotate-270"></i> +1.8%
              </h2>
            </div>
          </div>
        </div>
        <div className="col-xs-12 col-sm-6 col-md-5ths col-lg-5ths white-bg">
         <div className="widget style1 yellow-bg">
            <div className="row">
                <div className="col-xs-8">
                    <span>% Conversion</span>
                    <h2 className="font-bold">2.09%</h2>
                </div>
            </div>
          </div>
          <div className="ibox middle-sub-component-section-failure">
            <div className="ibox-content">
              <h5 className="m-b-md">Decreased over 2015</h5>
              <h2 className="text-danger">
                <i className="fa fa-play fa-rotate-90"></i> -2.7%
              </h2>
            </div>
          </div>
        </div>
        <div className="col-xs-12 col-sm-6 col-md-5ths col-lg-5ths white-bg">
         <div className="widget style1 yellow-bg">
            <div className="row">
                <div className="col-xs-8">
                    <span>% Abandoned Cart</span>
                    <h2 className="font-bold">26.4%</h2>
                </div>
            </div>
          </div>
          <div className="ibox middle-sub-component-section-sucess">
            <div className="ibox-content">
              <h5 className="m-b-md">Increased over 2015</h5>
              <h2 className="text-navy">
                <i className="fa fa-play fa-rotate-270"></i> +2.8%
              </h2>
            </div>
          </div>
        </div>
        <div className="col-xs-12 col-sm-6 col-md-5ths col-lg-5ths white-bg">
         <div className="widget style1 yellow-bg">
            <div className="row">
                <div className="col-xs-8">
                    <span>% Abandoned Checkout</span>
                    <h2 className="font-bold">16.4%</h2>
                </div>
            </div>
          </div>
          <div className="ibox middle-sub-component-section-sucess">
            <div className="ibox-content">
              <h5 className="m-b-md">Increased over 2015</h5>
              <h2 className="text-navy">
                <i className="fa fa-play fa-rotate-270"></i> +6.7%
              </h2>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
/*= End of middle Component =*/
/*=============================================<<<<<*/

/*=============================================>>>>>
= Footer Component =
===============================================>>>>>*/
class FooterComponent extends Component {
  componentDidMount() {
    (() => {
      var chart = c3.generate({
        bindto: '#chart1',
        data: {
            columns: [
              ['Smartphone', 28],
              ['Tablet',15],
              ['Desktop', 57]
            ],
            colors: {
              'Smartphone': '#87CEEB',
              'Tablet': '#ec7c4b',
              'Desktop': '#4e76ed'
            },
            type : 'donut'
        },
        size: {
          height: 250,
          width: $('.pie-chart').width()
        },
        donut: {
          title: "% Traffic",
          width: 40,
          label: {
            format: function(value, ratio, id) {
              return value.toFixed(0) + '%';
            }
          }
        }
      });
    })();

    (() => {
      var chart = c3.generate({
        bindto: '#chart2',
        data: {
            columns: [
                ['Smartphone', 11],
                ['Tablet',13],
                ['Desktop', 76]
            ],
            colors: {
              'Smartphone': '#87CEEB',
              'Tablet': '#ec7c4b',
              'Desktop': '#4e76ed'
            },
            type : 'donut'
        },
        size: {
          height: 250,
          width: $('.pie-chart').width()
        },
        donut: {
          title: "% Revenue",
          width: 40,
          label: {
            format: function(value, ratio, id) {
              return value.toFixed(0) + '%';
            }
          } 
        }
      });
    })();

    (() => {
      var chart = c3.generate({
        bindto: '#chart3',
        data: {
            columns: [
                ['Organic', 31],
                ['PPC',18],
                ['Direct', 20],
                ['Social', 2],
                ['Email', 13],
                ['Other', 16]
            ],
            colors: {
              'Organic': '#87CEEB',
              'PPC': '#ec7c4b',
              'Direct': '#4e76ed',
              'Social': '#f55858',
              'Email': '#cc7af2',
              'Other': '#5d9a72'
            },
            type : 'donut'
        },
        size: {
          height: 250,
          width: $('.pie-chart').width()
        },
        donut: {
            title: "% Traffic",
            width: 40,
            label: {
              format: function(value, ratio, id) {
                return value.toFixed(0) + '%';
              }
            }
        }
      });
    })();

    (() => {
      var chart = c3.generate({
        bindto: '#chart4',
        data: {
            columns: [
                ['Organic', 26],
                ['PPC',22],
                ['Direct', 21],
                ['Social', 1],
                ['Email', 15],
                ['Other', 15]
            ],
            colors: {
              'Organic': '#87CEEB',
              'PPC': '#ec7c4b',
              'Direct': '#4e76ed',
              'Social': '#f55858',
              'Email': '#cc7af2',
              'Other': '#5d9a72'
            },
            type : 'donut'
        },
        size: {
          height: 250,
          width: $('.pie-chart').width()
        },
        donut: {
            title: "% Revenue",
            width: 40,
            label: {
              format: function(value, ratio, id) {
                return value.toFixed(0) + '%';
              }
            }
          }
      });
    })();
  }
  render() {
    return (
      <div className="dashboard2-footer-component">
        <div className="col-xs-12 col-sm-6 col-md-4 footer-sub-component">
          <div className="ibox float-e-margins">
            <div className="ibox-title">
              <h3>Mobile Devices</h3>
            </div>
            <div className="ibox-content">
              <div className="row">
                <div className="col-xs-12 col-sm-6" style={{padding: '0px 3px'}}>
                  <div className="pie-chart">
                    <div id="chart1"></div>
                  </div>
                </div>
                <div className="col-xs-12 col-sm-6" style={{padding: '0px 3px'}}>
                  <div className="pie-chart">
                    <div id="chart2"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xs-12 col-sm-6 col-md-4 footer-sub-component">
          <div className="ibox float-e-margins">
            <div className="ibox-title">
              <h3>Traffic/Revenue Mix</h3>
            </div>
            <div className="ibox-content">
              <div className="row">
                <div className="col-xs-12 col-sm-6" style={{padding: '0px 3px'}}>
                  <div className="pie-chart">
                    <div id="chart3"></div>
                  </div>
                </div>
                <div className="col-xs-12 col-sm-6" style={{padding: '0px 3px'}}>
                  <div className="pie-chart">
                    <div id="chart4"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xs-12 col-sm-6 col-md-4 footer-sub-component">
          <div className="ibox float-e-margins">
            <div className="ibox-title">
              <h3>Engagement</h3>
            </div>
            <div className="ibox-content">
              <div className="row">
                <div className="col-sm-6">
                  <div className="row">
                    <div className="col-sm-5">
                      <i className="fa fa-clock-o" style={{fontSize: 70}}></i>
                    </div>
                    <div className="col-sm-7">
                      <h1>4:06</h1>
                      <div>Time on Site</div>
                      <div>-2.1%   <i className="fa fa-long-arrow-down text-danger" style={{fontSize: 21}}></i></div>
                    </div>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="row">
                    <div className="col-sm-5">
                      <i className="fa fa-file" style={{fontSize: 60}}></i>
                    </div>
                    <div className="col-sm-7">
                      <h1>7.1</h1>
                      <div>Pages/Visit</div>
                      <div><i className="fa fa-arrows-h" style={{fontSize: 21}}></i></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row" style={{marginTop: 15}}>
                <div className="col-sm-6">
                  <div className="row">
                    <div className="col-sm-5">
                      <i className="fa fa-share-square-o" style={{fontSize: 70}}></i>
                    </div>
                    <div className="col-sm-7">
                      <h1>24%</h1>
                      <div>Home Page</div>
                      <div>Bounce Rate   <i className="fa fa-long-arrow-up text-danger" style={{fontSize: 21}}></i></div>
                    </div>
                  </div>
                </div>
                <div className="col-sm-6">
                <div className="row">
                  <div className="col-sm-5">
                    <i className="fa fa-reply" style={{fontSize: 60}}></i>
                  </div>
                  <div className="col-sm-7">
                    <h1>36%</h1>
                    <div>Bounce</div>
                    <div>Rate   <i className="fa fa-arrows-h" style={{fontSize: 21}}></i></div>
                  </div>
                </div>
                </div>
              </div>




              {/* <div className="row">
                <div className="col-xs-12 col-sm-6" style={{marginTop: 9}}>
                  <div className="row">
                    <div className="col-xs-12 col-sm-6" style={{marginTop: 0}}>
                      <div className="row">
                        <div className="col-sm-5">
                          <i className="fa fa-clock-o" style={{fontSize: 70}}></i>
                        </div>
                        <div className="col-sm-7">
                          <h1>4:06</h1>
                          <div>Time on Site</div>
                          <div>-2.1%   <i className="fa fa-long-arrow-down text-danger" style={{fontSize: 21}}></i></div>
                        </div>
                      </div>
                    </div>

                    <div className="col-xs-12 col-sm-6" style={{marginTop: 10}}>
                      <div className="row">
                        <div className="col-sm-5">
                          <i className="fa fa-share-square-o" style={{fontSize: 70}}></i>
                        </div>
                        <div className="col-sm-7">
                          <h1>24%</h1>
                          <div>Home Page</div>
                          <div>Bounce Rate   <i className="fa fa-long-arrow-up text-danger" style={{fontSize: 21}}></i></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xs-12 col-sm-6" style={{marginTop: 15}}>
                  <div className="row">
                    <div className="col-xs-12 col-sm-6" style={{marginTop: 0}}>
                      <div className="row">
                        <div className="col-sm-5">
                          <i className="fa fa-file" style={{fontSize: 60}}></i>
                        </div>
                        <div className="col-sm-7">
                          <h1>7.1</h1>
                          <div>Pages/Visit</div>
                          <div>Flat   <i className="fa fa-arrows-h" style={{fontSize: 21}}></i></div>
                        </div>
                      </div>
                    </div>

                    <div className="col-xs-12 col-sm-6" style={{marginTop: 19}}>
                      <div className="row">
                        <div className="col-sm-5">
                          <i className="fa fa-reply" style={{fontSize: 60}}></i>
                        </div>
                        <div className="col-sm-7">
                          <h1>7.1</h1>
                          <div>Pages/Visit</div>
                          <div>Flat   <i className="fa fa-arrows-h" style={{fontSize: 21}}></i></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div> */}

            </div>
          </div>
        </div>
      </div>
    )
  }
}
/*= End of Footer Component =*/
/*=============================================<<<<<*/

class Dashboard2 extends Component {
  render() {
    return (
      <div className="main-dashboard2-container">
        <div className="row wrapper dashboard2-header-charts">
          <div className='col-xs-12 col-sm-6 header-sub-chart'>
            <TrafficComponent />
          </div>
          <div className='col-xs-12 col-sm-6 header-sub-chart'>
            <RevenueComponent />
          </div>
        </div>
        <div className="row wrapper dashboard2-middle-component" style={{padding: '0px 35px 26px 5px'}}>
          <MiddleComponent />
        </div>
        <div className="row wrapper dashboard2-footer-component">
          <FooterComponent />
        </div>

      </div>
    )
  }
}

export default Dashboard2;
