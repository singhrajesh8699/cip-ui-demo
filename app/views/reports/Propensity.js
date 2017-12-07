import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { withRouter, Link, Location } from 'react-router';

import * as XyloFetch from '../../components/common/XyloFetch';
import * as UrlConstants from '../../components/common/UrlConstants';

/*=============================================>>>>>
= Header block =
===============================================>>>>>*/
class PropensityHeader extends Component {
  render() {
    return (
      <div className="col-lg-10">
        <div className='xylo-page-header'>
          <h2>Propensity to Buy</h2>
          <ol className="breadcrumb">
              <li>
                  <Link to="/dataprep/main_dashboard">Reports</Link>
              </li>
              <li>
                  <a><b>Propensity</b></a>
              </li>
          </ol>
        </div>
      </div>
    );
  }
}
/*= End of Header block =*/
/*=============================================<<<<<*/

class Propensity extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className='xylo-page-heading'>
        <div className="row wrapper white-bg page-heading">
          <PropensityHeader />
        </div>
				<div className="row">
				<div className="col-lg-12">
					<div className="ibox" style={{marginTop: 20, marginLeft: 10, marginRight: 10}}>

						<div className="ibox-content" id="ibox-content">

								<div id="vertical-timeline" className="vertical-container dark-timeline center-orientation">
										<div className="vertical-timeline-block">
												<div className="vertical-timeline-icon navy-bg">
														<i className="fa fa-sliders"></i>
												</div>

												<div className="vertical-timeline-content">
													<h2>Propensity</h2>
													<p>
														Compute propensity score of all (or selected) customers to buy Groceries in next 3 months
													</p>
													<span className="vertical-date">
															December <br/>
															<small>2016</small>
													</span>
												</div>
										</div>

										<div className="vertical-timeline-block">
												<div className="vertical-timeline-icon blue-bg">
														<i className="fa fa-sliders"></i>
												</div>

												<div className="vertical-timeline-content">
													<h2>Performance</h2>
													<p>
														Performance window to compute Dependent variable:
														Customers who bought groceries tagged as 1, rest as 0
													</p>
													<span className="vertical-date">
														September <br/>
														<small>2016</small>
													</span>
											</div>
										</div>

										<div className="vertical-timeline-block">
												<div className="vertical-timeline-icon lazur-bg">
														<i className="fa fa-sliders"></i>
												</div>

												<div className="vertical-timeline-content">
													<h2>Observation Month</h2>
													<p>
														Random sample drawn & point in time Independent variables chosen like Age, Gender, Geography, Income etc
													</p>

													<span className="vertical-date"> June <br/><small>2016</small></span>
												</div>
										</div>

										<div className="vertical-timeline-block">
												<div className="vertical-timeline-icon yellow-bg">
														<i className="fa fa-sliders"></i>
												</div>

												<div className="vertical-timeline-content">
												<h2>Independent variables</h2>
												<p>
													Window to Compute performance related long term (12 months) & short-term(3 months)
												</p>
												<p>
													<ul>
														<li>No. of grocery purchases in last 3 months</li>
														<li>$ spend in grocery in last 3 months</li>
														<li>No. of trips to store in last one year</li>
														<li>No. of trips only for groceries</li>
													</ul>
												</p>
														<span className="vertical-date">September <br/><small>2015</small></span>
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

export default Propensity;
