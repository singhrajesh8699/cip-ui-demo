import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { withRouter, Link, Location } from 'react-router';
import { Route, Router, IndexRedirect, browserHistory} from 'react-router';
import Moment from 'moment';
// import vex from 'vex';

import * as XyloFetch from '../../components/common/XyloFetch';


/*=============================================>>>>>
= DatasetListHeader component =
===============================================>>>>>*/
class DatasetListHeader extends Component {
  render() {
    return (
      <div className="col-lg-10">
        <div className='xylo-page-header'>
          <h2>Datasets</h2>
          <ol className="breadcrumb">
              <li>
                  <Link to="/dataprep/dashboard">Data Prep</Link>
              </li>
              <li>
                  <a><b>Datasets</b></a>
              </li>
          </ol>
        </div>
      </div>
    );
  }
}
/*= End of DatasetListHeader component =*/
/*=============================================<<<<<*/

/*=============================================>>>>>
= Dataset Component =
===============================================>>>>>*/
class DatasetList extends Component {
  state = {
    datasetAttributes: [],
    dataset: {}
  }

  onAttributeClick(attributes) {
    this.setState({datasetAttributes: attributes});
    $('#attributeModal').modal('show');
  }

  onDeleteClick(dataset) {
    this.setState({dataset: dataset});
    $('#deleteDatasetModal').modal('show');
  }

  render() {
    return (
      <div className="col-lg-12">
        <div className="wrapper wrapper-content">
          <div className="ibox">
            <div className="ibox-title">
              <h5>All available Datasets</h5>
              <div className="ibox-tools">
                <button type='button' className="btn btn-primary btn-md">
                  <Link to='/dataprep/createdataset' style={{color: '#fff'}}>Create Dataset</Link>
                </button>
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
                      this.props.datasetList.map((dataset) => {
                        let datasetStatus = 'label label-default';
                        let editDatasetId = '/dataprep/editdataset/'+dataset._id;
                        let loadDatasetId = '/dataprep/datasets/'+dataset._id;
                        if(dataset.status === 'new') {
                          datasetStatus = 'label label-info';
                        } else if(dataset.status === 'draft') {
                          datasetStatus = 'label label-primary';
                        } else if(dataset.status === 'published') {
                          datasetStatus = 'label label-success';
                        }
                        return (
                          <tr key={dataset._id}>
                            <td className="project-status">
                              <h3><span className={datasetStatus} style={{fontSize: 12, textTransform: 'capitalize'}}>{dataset.status}</span></h3>
                            </td>
                            <td>
                              <span className="project-title">{dataset.name}</span>
                              <br/>
                              <small>{Moment(dataset.createdAt).format('MMMM Do YYYY, h:mm a')}</small>
                            </td>
                            <td className="project-completion">
                            </td>
                            <td className="project-actions">
                              <button type="button" className="btn btn-white btn-md" onClick={::this.onAttributeClick.bind(this, dataset.attributes)}>
                                <i className="fa fa-folder"></i> Attributes
                              </button>&nbsp;

                              <button type='button' className="btn btn-white btn-md">
                                <Link to={loadDatasetId} className='text-primary'>
                                  <i className="fa fa-list-ul"></i> Load
                                </Link>
                              </button>&nbsp;

                              <button type='button' className="btn btn-white btn-md" disabled={dataset.status === 'published' ? true: false}>
                                {
                                  (()=>{
                                    if(dataset.status === 'published') {
                                      return(
                                          <span><i className="fa fa-pencil"></i> Edit</span>
                                      )
                                    } else {
                                      return(
                                        <Link to={editDatasetId} className='text-primary'>
                                          <i className="fa fa-pencil"></i> Edit
                                        </Link>
                                      )
                                    }
                                  })()
                                }
                              </button>&nbsp;
                              <button type="button"
                              className="btn btn-white btn-md"
                              disabled ={dataset.status === 'published' ? true : false}
                              onClick={::this.onDeleteClick.bind(this, dataset)}>
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
        <AttributeModal datasetAttributes={this.state.datasetAttributes} />
        <DeleteDatasetModal dataset={this.state.dataset} deleteCallback={this.props.deleteCallback} />
       </div>
      </div>
    )
  }
}
/* = End of Dataset Component = */
/*=============================================<<<<<*/


/*=============================================>>>>>
= Modal for attributes =
===============================================>>>>>*/
class AttributeModal extends Component {
  state = {
    datasetAttributes: []
  }

  conponentWillMount() {
    this.setState({datasetAttributes: this.props.datasetAttributes});
  }

  componentWillReceiveProps(props) {
    this.setState({datasetAttributes: props.datasetAttributes});
  }

  render() {
    return (
      <div className="modal inmodal" id="attributeModal" tabindex="-1" role="dialog" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content animated">
            <div className="modal-header">
              <button type="button" className="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span className="sr-only">Close</span></button>
              {/* <i className="fa fa-laptop modal-icon"></i> */}
              <h4 className="modal-title">Dataset Attributes</h4>
            </div>
            <div className="modal-body" style={{textAlign: 'left'}}>
            <ul>
              {
                this.state.datasetAttributes.map((attrib, i) => {
                  return (
                    <li key={i}>{attrib.name}</li>
                  )
                })
              }
            </ul>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-white" data-dismiss="modal">Close</button>
              {/* <button type="button" className="btn btn-primary">Save changes</button> */}
            </div>
          </div>
        </div>
      </div>
    )
  }
}
/*= End of Modal for attributes =*/
/*=============================================<<<<<*/

/*=============================================>>>>>
= Delete Dataset Modal =
===============================================>>>>>*/
@withRouter
class DeleteDatasetModal extends Component {
  state = {
    dataset: {}
  }

  conponentWillMount() {
    this.setState({dataset: this.props.dataset});
  }

  componentWillReceiveProps(props) {
    this.setState({dataset: props.dataset});
  }

  deleteDataset(dataset) {
    let datasetId = dataset._id;
    let self = this;
    XyloFetch.deleteDataset(datasetId)
    .then(response => {
      console.log(response);
      self.props.deleteCallback();
      $('#deleteDatasetModal').modal('hide');
      self.props.router.push('/dataprep/datasets');
    });
  }

  render() {
    return (
      <div className="modal inmodal" id="deleteDatasetModal" tabindex="-1" role="dialog" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span className="sr-only">Close</span></button>
              {/* <i className="fa fa-laptop modal-icon"></i> */}
              <h4 className="modal-title">Delete Dataset</h4>
            </div>
            <div className="modal-body" style={{textAlign: 'left'}}>
              <p>Are you sure you want to delete "{this.state.dataset.name}" ?</p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-white" data-dismiss="modal">Cancel</button>
              <button type="button" className="btn btn-primary" onClick={::this.deleteDataset.bind(this, this.state.dataset)}>Delete</button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
/*= End of Delete Dataset Modal =*/
/*=============================================<<<<<*/

class Datasets extends Component {
  constructor(props) {
    super(props);

    this.state = {
      datasets: []
    };
  }

  componentWillMount() {}

  componentDidMount() {
    this.fetchDatasetList();
  }

  fetchDatasetList() {
  console.log("in fetchDatasetList");
    const self = this;
    XyloFetch.getAllDatasets()
    .then( response => {
      console.log("API response: ");
      console.log(response);
      self.setState({datasets: response.payload});
    });
  }

  render() {
    return (
      <div className='xylo-page-heading'>
         <div className="row wrapper white-bg page-heading">
            <DatasetListHeader />
         </div>

        <div className="row">
          <DatasetList datasetList={this.state.datasets} deleteCallback={::this.fetchDatasetList} />
        </div>

      </div>
    )
  }
}

export default Datasets;
