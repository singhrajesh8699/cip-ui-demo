import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { withRouter, Link, Location } from 'react-router';

import * as XyloFetch from '../../components/common/XyloFetch';
import * as UrlConstants from '../../components/common/UrlConstants';

/*=============================================>>>>>
= Header block =
===============================================>>>>>*/
class RetentionHeader extends Component {
  render() {
    return (
      <div className="col-lg-10">
        <div className='xylo-page-header'>
          <h2>Retention Opportunities</h2>
          <ol className="breadcrumb">
              <li>
                  <Link to="/dataprep/main_dashboard">Reports</Link>
              </li>
              <li>
                  <a><b>Retention Opportunities</b></a>
              </li>
          </ol>
        </div>
      </div>
    );
  }
}
/*= End of Header block =*/
/*=============================================<<<<<*/

class RetentionOpportunities extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className='xylo-page-heading'>
        <div className="row wrapper white-bg page-heading">
          <RetentionHeader />
        </div>
      </div>
    )
  }
}

export default RetentionOpportunities;
