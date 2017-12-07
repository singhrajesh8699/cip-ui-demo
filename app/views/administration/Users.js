import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { withRouter, Link, Location } from 'react-router';
import { Route, Router, IndexRedirect, browserHistory} from 'react-router';
import Moment from 'moment';
// import vex from 'vex';

import * as ServerURLs from '../../components/common/UrlConstants';
import * as XyloFetch from '../../components/common/XyloFetch';

class ListHeader extends Component {
  render() {
    return (
      <div className="col-lg-10">
        <div className='xylo-page-header'>
          <h2>Users</h2>
          <ol className="breadcrumb">
              <li>
                <Link to="/dataprep/dashboard">Administraion</Link>
              </li>
              <li>
                <a><b>Users</b></a>
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
class UserList extends Component {
  state={
    user: {}
  };

  onDeleteClick(user) {
    this.setState({user: user});
    $('#deleteModal').modal('show');
  }

  render() {
    return (
      <div className="col-lg-12">
        <div className="wrapper wrapper-content">
          <div className="ibox">
            <div className="ibox-title">
              <h5>All Users</h5>
              <div className="ibox-tools">
                <button type='button' className="btn btn-primary btn-md">
                  <Link to='/admin/createuser' style={{color: '#fff'}}>Create User</Link>
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
                      this.props.usersList.map((user) => {
												if(!user.sa_user) {
													const tenantLogo = ServerURLs.BASE_URL + '/logos/' + user.thumbnail;
	                        let datasetStatus = 'label label-default';
	                        let editIdURL = '/admin/edituser/'+user._id;
													let roles = '';
													if(user.dx_user) {
														roles = "Tenant Admin"
													}
													if(user.da_user) {
														roles += roles.length > 1 ? " | " : "";
														roles += "Data Analyst"
													}
													if(user.ma_user) {
														roles += roles.length > 1 ? " | " : "";
														roles += "Marketing Analyst"
													}

	                        return (
	                          <tr key={user._id}>
															<td>
																<span style={{width: 80, height: 80}}>
																<img src={tenantLogo} style={{maxHeight: 80, maxWidth: 80}} />
																</span>
															</td>
	                            <td className="project-title">
	                              <a>{user.name}</a>
	                              <br/>
	                              <small>{Moment(user.createdAt).format('MMMM Do YYYY, h:mm a')}</small>
	                            </td>
															<td className="project-title">
																<a>{roles}</a>
																<br/>
																<small>Roles</small>
															</td>
	                            <td className="project-actions">
	                              <button type='button' className="btn btn-white btn-md"
																	 style={{marginRight: 5}}>
	                                <Link to={editIdURL} className='text-primary'>
	                                  <i className="fa fa-pencil"></i> Edit
	                                </Link>
	                              </button>
                                <button type="button"
                                className="btn btn-white btn-md"
                                onClick={::this.onDeleteClick.bind(this, user)}>
                                  <i className="fa fa-trash"></i> Delete
                                </button>
	                              {/* <DeleteUser user={user} deleteCallback={this.props.deleteCallback} /> */}
	                            </td>
	                          </tr>
	                        )
												}
                      })
                    }
                  </tbody>
                </table>
              </div>
            </div> {/*ibox-content END*/}
          </div> {/*ibox END*/}
          <DeleteUserModal user={this.state.user} deleteCallback={this.props.deleteCallback} />
        </div>
      </div>
    )
  }
}
/* = End of Dataset Component = */
/*=============================================<<<<<*/

/*=============================================>>>>>
= Delete Dataset Modal =
===============================================>>>>>*/
@withRouter
class DeleteUserModal extends Component {
  state = {
    user: {}
  }

  conponentWillMount() {
    this.setState({user: this.props.user});
  }

  componentWillReceiveProps(props) {
    this.setState({user: props.user});
  }

  deleteUser(user) {
    let userId = user._id;
    let self = this;
    XyloFetch.deleteUser(userId)
    .then(response => {
      console.log(response);
      self.props.deleteCallback();
      $('#deleteModal').modal('hide');
      self.props.deleteCallback();
    });
  }

  render() {
    return (
      <div className="modal inmodal" id="deleteModal" tabindex="-1" role="dialog" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content animated bounceInRight">
            <div className="modal-header">
              <button type="button" className="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span className="sr-only">Close</span></button>
              {/* <i className="fa fa-laptop modal-icon"></i> */}
              <h4 className="modal-title">Delete User</h4>
            </div>
            <div className="modal-body" style={{textAlign: 'left'}}>
              <p>Are you sure you want to delete "{this.state.user.name}" ?</p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-white" data-dismiss="modal">Cancel</button>
              <button type="button" className="btn btn-primary" onClick={::this.deleteUser.bind(this, this.state.user)}>Delete</button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
/*= End of Delete Dataset Modal =*/
/*=============================================<<<<<*/

class Users extends Component {
  constructor(props) {
    super(props);

    this.state = {
      users: []
    };
  }

  componentWillMount() {}

  componentDidMount() {
    this.fetchUserList();
  }

  fetchUserList() {
  console.log("in fetchUserList");
    const self = this;
    XyloFetch.getUsers()
    .then( response => {
      console.log("API response: ");
      console.log(response);
      self.setState({users: response.payload});
    });
  }

  render() {
    return (
      <div className='xylo-page-heading'>
         <div className="row wrapper white-bg page-heading">
            <ListHeader />
         </div>

        <div className="row">
          <UserList usersList={this.state.users} deleteCallback={::this.fetchUserList} />
        </div>
      </div>
    )
  }
}

export default Users;
