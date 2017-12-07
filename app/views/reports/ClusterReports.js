import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { withRouter, Link, Location } from 'react-router';

import * as XyloFetch from '../../components/common/XyloFetch';
import * as UrlConstants from '../../components/common/UrlConstants';

/*=============================================>>>>>
= Header block =
===============================================>>>>>*/
class ClusterHeader extends Component {
  render() {
    return (
      <div className="col-lg-10">
        <div className='xylo-page-header'>
          <h2>Cluster Reports</h2>
          <ol className="breadcrumb">
              <li>
                <Link to="/dataprep/main_dashboard">Reports</Link>
              </li>
              <li>
                <a><b>Cluster Reports</b></a>
              </li>
          </ol>
        </div>
      </div>
    );
  }
}
/*= End of Header block =*/
/*=============================================<<<<<*/

class ClusterReports extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className='xylo-page-heading'>
        <div className="row wrapper white-bg page-heading">
          <ClusterHeader />
        </div>
      </div>
    )
  }
}

export default ClusterReports;
