import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { withRouter, Link, Location } from 'react-router';
import { Route, Router, IndexRedirect, browserHistory} from 'react-router';
import Moment from 'moment';

import * as ServerURLs from '../../components/common/UrlConstants';
import * as XyloFetch from '../../components/common/XyloFetch';

class ListHeader extends Component {
  render() {
    return (
      <div className="col-lg-10">
        <div className='xylo-page-header'>
          <h2>Tenants</h2>
          <ol className="breadcrumb">
              <li>
                  <Link to="/dataprep/dashboard">Administration</Link>
              </li>
              <li>
                  <a><b>Tenants</b></a>
              </li>
          </ol>
        </div>
      </div>
    );
  }
}


/*=============================================>>>>>
= Dataset Component =
===============================================>>>>>*/
class TenantList extends Component {

  state={
    tenant: {}
  };

  onDeleteClick(tenant) {
    this.setState({tenant: tenant});
    $('#deleteModal').modal('show');
  }

  render() {
    return (
      <div className="col-lg-12">
        <div className="wrapper wrapper-content">
          <div className="ibox">
            <div className="ibox-title">
              <h5>All Tenants</h5>
              <div className="ibox-tools">
                <button type='button' className="btn btn-primary btn-md">
                  <Link to='/admin/createtenant' style={{color: '#fff'}}>Create Tenant</Link>
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
                      this.props.tenantsList.map((tenant) => {
												const tenantLogo = ServerURLs.BASE_URL + '/logos/' + tenant.logo;
                        let editIdURL = '/admin/edittenant/'+tenant._id;

                        return (
                          <tr key={tenant._id}>
														<td>
															<span style={{width: 80, height: 80}}>
															<img src={tenantLogo} style={{maxHeight: 80, maxWidth: 80}} />
															</span>
														</td>
                            <td className="project-title">
                              <a>{tenant.name}</a>
                              <br/>
                              <small>{Moment(tenant.createdAt).format('MMMM Do YYYY, h:mm a')}</small>
                            </td>
                            <td className="project-actions">
                              <button type='button' className="btn btn-white btn-md"
																 style={{marginRight: 5}}>
                                <Link to={editIdURL} className='text-primary'>
                                  <i className="fa fa-pencil"></i> Edit
                                </Link>
                              </button>
                              <button type="button"
                              disabled="true"
                              className="btn btn-white btn-md"
                              onClick={::this.onDeleteClick.bind(this, tenant)}>
                                <i className="fa fa-trash"></i> Delete
                              </button>
                              {/* <DeleteTenant tenant={tenant} deleteCallback={this.props.deleteCallback} /> */}
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
          <DeleteTenantModal tenant={this.state.tenant} deleteCallback={this.props.deleteCallback} />
        </div>
      </div>
    )
  }
}
/* = End of Dataset Component = */
/*=============================================<<<<<*/

/*=============================================>>>>>
= deleteTenant component =
===============================================>>>>>*/
@withRouter
class DeleteTenantModal extends React.Component {
  state = {
    tenant: {}
  }

  conponentWillMount() {
    this.setState({tenant: this.props.tenant});
  }

  componentWillReceiveProps(props) {
    this.setState({tenant: props.tenant});
  }

  deleteTenant(tenant) {
    let tenantId = tenant._id;
    let self = this;
    XyloFetch.deleteTenant(tenantId)
    .then(response => {
      console.log(response);
      self.props.deleteCallback();
      $('#deleteModal').modal('hide');
      self.props.deleteCallback();
    });
  }

  render() {
    const self = this;
    return (
        <div className="modal inmodal" id="deleteModal" tabindex="-1" role="dialog" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content animated bounceInRight">
              <div className="modal-header">
                <button type="button" className="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span className="sr-only">Close</span></button>
                {/* <i className="fa fa-laptop modal-icon"></i> */}
                <h4 className="modal-title">Delete Tenant</h4>
              </div>
              <div className="modal-body" style={{textAlign: 'left'}}>
                <p>Are you sure you want to delete "{this.state.tenant.name}" ?</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-white" data-dismiss="modal">Cancel</button>
                <button type="button" className="btn btn-primary"	onClick={::this.deleteTenant.bind(this, this.state.tenant)}>Delete</button>
              </div>
            </div>
          </div>
        </div>
    );
  }
}
/*= End of deleteTenant component =*/
/*=============================================<<<<<*/

class Tenants extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tenants: []
    };
  }

  componentWillMount() {
    //const sessionManager = SessionManager.instance;
    //if(!sessionManager.isUserLoggedIn()) {
    //  this.props.router.push('/');
    //}
  }

  componentDidMount() {
    this.fetchTenantList();
  }

  fetchTenantList() {
  console.log("in fetchTenantList");
    const self = this;
    XyloFetch.getTenants()
    .then( response => {
      console.log("API response: ");
      console.log(response);
      self.setState({tenants: response.payload});
    });
  }

  render() {
    return (
      <div className='xylo-page-heading'>
         <div className="row wrapper white-bg page-heading">
            <ListHeader />
         </div>

        <div className="row">
          <TenantList tenantsList={this.state.tenants} deleteCallback={::this.fetchTenantList} />
        </div>

      </div>
    )
  }
}

export default Tenants;
