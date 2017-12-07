import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { withRouter } from 'react-router';
import { Route, Router, IndexRedirect, browserHistory, Link} from 'react-router';
import Moment from 'moment';

import * as XyloFetch from '../../components/common/XyloFetch';

class SourcesListHeader extends Component {
  render() {
    return (
      <div className="col-lg-10">
        <div className='xylo-page-header'>
          <h2>Sources</h2>
          <ol className="breadcrumb">
              <li>
                  <Link to="/dataprep/dashboard">Data Prep</Link>
              </li>
              <li>
                  <a><b>Sources</b></a>
              </li>
          </ol>
        </div>
      </div>
    );
  }
}


/*=============================================>>>>>
= Source Component =
===============================================>>>>>*/
class SourcesList extends Component {
  state = {
    source: {}
  };

	componentWillMount() {
		this.setState({sources: []});
	}

  componentDidMount() {
    this.fetchSourcesList();
  }

  fetchSourcesList() {
  	console.log("in fetchSourcesList");
    const self = this;
    XyloFetch.getAllSources()
    .then( response => {
      console.log("API response: ");
      console.log(response);
      self.setState({sources: response.payload});
    });
  }

  onDeleteClick(source) {
    this.setState({source: source});
    $('#deleteSourceModal').modal('show');
  }

  render() {
    return (
      <div className="col-lg-12">
        <div className="wrapper wrapper-content">
          <div className="ibox">
            <div className="ibox-title">
              <h5>All available Sources</h5>
              <div className="ibox-tools">
                <Link to='/dataprep/createsource' className="btn btn-primary btn-md">Add Source</Link>
              </div>
            </div>
            <div className="ibox-content xylo-list">
              <div className="row m-b-sm m-t-sm">
                <div className="col-md-1">
                  <button type="button" id="loading-example-btn" className="btn btn-danger btn-outline btn-md" ><i className="fa fa-refresh"></i> Refresh</button>
                </div>
              </div>
              <div className="project-list">
                <table className="table table-hover">
                  <tbody>
                    {
                      this.state.sources.map((source) => {
												//console.log(source);
                        return (
                          <tr key={source._id}>
                            <td>
                              <span className="project-title">{source.name}</span>
                              <br/>
                              <small>{Moment(source.createdAt).format('MMMM Do YYYY, h:mm a')}</small>
                            </td>
														<td className="project-title">
                              {source.attributes.length}
                              <br/>
                              <small>attributes</small>
                            </td>
														<td className="project-title">
                              {source.numRecords}
                              <br/>
                              <small>records</small>
                            </td>
														<td className="project-title">
                              {source.uniqueness}%
                              <br/>
                              <small>uniqueness</small>
                            </td>
														<td className="project-title">
                              {source.completeness}
                              <br/>
                              <small>completeness</small>
                            </td>
														<td className="project-title">
                              {source.cardinality}
                              <br/>
                              <small>cardinality</small>
                            </td>
                            <td className="project-actions">
                              {/* <DeleteSource source={source} deleteCallback={::this.fetchSourcesList} /> */}
                              <button type="button"
                              className="btn btn-white btn-md"
                              onClick={::this.onDeleteClick.bind(this, source)}>
                                <i className="fa fa-trash"></i> Delete
                              </button>
                            </td>
                          </tr>
                        )
                      })
                    }
                  </tbody>
                </table>
              </div>
            </div> {/*ibox-content END*/}
        </div> {/*ibox END*/}
        <DeleteSourceModal source={this.state.source} deleteCallback={::this.fetchSourcesList} />
       </div>
      </div>
    )
  }
}
/* = End of Source Component = */
/*=============================================<<<<<*/

/*=============================================>>>>>
= Delete Dataset Modal =
===============================================>>>>>*/
@withRouter
class DeleteSourceModal extends Component {
  state = {
    source: {}
  }

  conponentWillMount() {
    this.setState({source: this.props.source});
  }

  componentWillReceiveProps(props) {
    this.setState({source: props.source});
  }

  deleteSource(source) {
    let sourceId = source._id;
        let self = this;
    XyloFetch.deleteSource(sourceId)
    .then(response => {
      console.log(response);
      $('#deleteSourceModal').modal('hide');
      self.props.deleteCallback();
    });
  }

  render() {
    return (
      <div className="modal inmodal" id="deleteSourceModal" tabindex="-1" role="dialog" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span className="sr-only">Close</span></button>
              {/* <i className="fa fa-laptop modal-icon"></i> */}
              <h4 className="modal-title">Delete Source</h4>
            </div>
            <div className="modal-body" style={{textAlign: 'left'}}>
              <p>Are you sure you want to delete "{this.state.source.name}" ?</p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-white" data-dismiss="modal">Cancel</button>
              <button type="button" className="btn btn-primary" onClick={::this.deleteSource.bind(this, this.state.source)}>Delete</button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
/*= End of Delete Dataset Modal =*/
/*=============================================<<<<<*/

class Sources extends Component {
  constructor(props) {
    super(props);

    this.state = {
      sources: []
    };
  }

  render() {
    return (
      <div className='xylo-page-heading'>

         <div className="row wrapper white-bg page-heading xylo-page-header-container">
            <SourcesListHeader />
         </div>

        <div className="row">
          <SourcesList />
        </div>

      </div>
    )
  }
}

export default Sources;
