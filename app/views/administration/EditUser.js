import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { withRouter, Link, Location } from 'react-router';
import { Route, Router, IndexRedirect, browserHistory} from 'react-router';
import Moment from 'moment';
// import vex from 'vex';

import SessionManager from '../../components/common/SessionManager';

import * as UrlConstants from '../../components/common/UrlConstants';
import * as XyloFetch from '../../components/common/XyloFetch';
import TreeMultiselect from '../../components/common/TreeMultiselect';
import Dropzone from '../../../public/vendor/dropzone/dropzone';


/*=============================================>>>>>
= Create source Header =
===============================================>>>>>*/

class EditFormHeader extends Component {
  render() {
    return (
      <div className="col-lg-10">
        <div className='xylo-page-header'>
          <h2>Edit User</h2>
          <ol className="breadcrumb">
              <li>
                  <Link to="/dataprep/dashboard">Dashboard</Link>
              </li>
              <li>
                  <Link to="/admin/users">Users</Link>
              </li>
							<li>
                <a><b>Edit User</b></a>
              </li>
          </ol>
        </div>
      </div>
    );
  }
}

/*= End of Create source Header =*/
/*=============================================<<<<<*/

/*=============================================>>>>>
= Create source panel =
===============================================>>>>>*/

@withRouter
class EditForm extends Component {

  state = {
    fname: '',
    lname: '',
    email: '',
    pswd: '',
    userlogoBase64: null,
    userlogoUrl: '',
    tenantName: '',
    userRoles: [],
    selectedRoles: []
  }

  constructor() {
    super();
  }

  /* Function to update user */
  updateUser(e) {
    e.preventDefault();
    let reqObj = {
      "name": this.state.fname + ' ' + this.state.lname,
      "email": this.state.email,
      tenant_id: this.state.tenantName,
    };
    this.state.selectedRoles.forEach(function(item) {
      if(item === 'da_user') {
        reqObj.da_user = true;
      }
      if(item === 'dx_user') {
        reqObj.dx_user = true;
      }
      if(item === 'ma_user') {
        reqObj.ma_user = true;
      }
    });

    XyloFetch.editUser(reqObj, this.props.userId)
    .then(response => {
      this.props.router.push('/app/users');
    });
  }

  //* Function to validate first name */
  validatefName(e) {
    let fname = e.target.value;
    this.fNameValidationMessage = '';
    this.fNameValidationState = '';
    if(fname != '' && fname != undefined) {
      this.fNameValidationState = 'success';
    } else {
      this.fNameValidationState = 'error';
      this.fNameValidationMessage = "First Name is Required";
    }
    this.setState({fname});
  }

  /* Function to validate last name */
  validatelName(e) {
    let lname = e.target.value;
    this.lNameValidationMessage = '';
    this.lNameValidationState = '';
    if(lname != '' && lname != undefined) {
      this.lNameValidationState = 'success';
    } else {
      this.lNameValidationState = 'error';
      this.lNameValidationMessage = "Last Name is Required";
    }
    this.setState({lname});
  }

/* Function to validate email*/
  validateEmail(e) {
    let email = e.target.value;
    this.emailValidationMessage = '';
    this.emailValidationState = '';
    if(email != '' && email != undefined) {
      this.emailValidationState = 'success';
    } else {
      this.emailValidationState = 'error';
      this.emailValidationMessage = "Email is Required";
    }
    this.setState({email});
  }

  /* Function to validate logo. Convert logo in base64 format to show in the UI */
  validateLogo(e) {
    let self = this;
    let userlogo = e.target.files;
    let logoValidationState = '';
    this.logoValidationMessage = '';
    if(userlogo != '' && userlogo != undefined) {
      this.logoValidationState = 'success';
      // Only process image files.
      if(userlogo[0] != undefined) {
        if (!userlogo[0].type.match('image.*')) {
          this.logoValidationState = 'error';
          this.logoValidationMessage = "Select image for logo";
          return;
        }
      } else {
        self.setState({userlogoBase64: null});
        this.logoValidationState = 'error';
        this.logoValidationMessage = "User Logo is Required";
      }
      var reader = new FileReader();
      // Closure to capture the file information.
      reader.onload = (function(theFile) {
        return function(e) {
          // Render thumbnail.
          self.setState({userlogoBase64: e.target.result});
        };
      })(userlogo[0]);
      // Read in the image file as a data URL.
      reader.readAsDataURL(userlogo[0]);
    } else {
      this.logoValidationState = 'error';
      this.logoValidationMessage = "User Logo is Required";
    }
  }

  /* function called when checkbox selection is changed */
  roleCheckboxChanged(e) {
    let roleArray = this.state.selectedRoles;

		if(e.target.checked){
			roleArray.push(e.target.value);
		}
		else{
			var index = roleArray.indexOf(e.target.value);
			if (index !== -1) {
			  roleArray.splice(index, 1);
			}
		}
    this.roleValidationMessage = '';
    this.roleValidationState = '';
    this.roleSelectValidationClass = '';
    if(roleArray.length === 0) {
      this.roleValidationState = 'error';
      this.roleSelectValidationClass = 'role-select-error';
      this.roleValidationMessage = "Roles are Required";
    } else {
      this.roleSelectValidationClass = 'role-select-success';
      this.roleValidationState = 'success';
    }
    this.setState({selectedRoles: roleArray});
  }

  showValidationMessage(validationSate, validationMessage) {
    if(validationSate == 'error') {
      return (
        <span className='validation-error-message'>{validationMessage}</span>
      );
    }
  }

  validateUserForm() {
    if(this.fNameValidationState != undefined && this.lNameValidationState != undefined && this.emailValidationState != undefined && this.roleValidationState != undefined && this.state.tenantName != '') {
      if(this.fNameValidationState == 'error' || this.lNameValidationState == 'error' || this.emailValidationState == 'error' || this.roleValidationState == 'error' || this.state.tenantName == '') {
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }
  }

  /* Function is called when tenant selection is changed. Validates the selection */
  tenantSelectionChanged(e) {
    this.tenantValidationMessage = '';
    if(e.target.value === '') {
      this.tenantValidationState = 'error';
      this.tenantValidationMessage = 'Tenants are Required';
    } else {
      this.tenantValidationState = 'success';
    }
    this.setState({tenantName: e.target.value});
  }

	cancel() {
		this.props.router.push('/admin/users');
	}

  onFileUploadSucess() {
    this.fetchUserToEdit();
  }

  /* Function to fetch the user to be edited */
  fetchUserToEdit() {
    const self = this;
    this.baseURL = UrlConstants.BASE_URL;
    XyloFetch.getUser(this.props.userId)
    .then(response => {
      console.log(response);
      let userObj = {};
      userObj.fname = response.payload.name.split(' ')[0];
      userObj.lname = response.payload.name.split(' ')[1];
      userObj.email = response.payload.email;
      userObj.tenantName = response.payload.tenant._id;
      userObj.userlogoUrl = self.baseURL + '/logos/' + response.payload.thumbnail;
      userObj.selectedRoles = [];
      if(response.payload.ma_user == true) {
        userObj.selectedRoles.push('ma_user');
      }
      if(response.payload.da_user == true) {
        userObj.selectedRoles.push('da_user');
      }
      if(response.payload.dx_user == true) {
        userObj.selectedRoles.push('dx_user');
      }
      console.log(userObj.selectedRoles);
      this.fNameValidationState = 'success';
      this.lNameValidationState = 'success';
      this.emailValidationState = 'success';
      this.tenantValidationState = 'success';
      this.roleValidationState = 'success';
      this.setState(userObj);
    })
  }

  componentWillMount() {
		const sessionManager = SessionManager.instance;
		if(!sessionManager.isUserLoggedIn()) {
			this.props.router.push('/');
			return;
		}
    this.fetchUserToEdit();

    this.tenantsListArray = [];
    XyloFetch.getTenants()
    .then(response => {
      this.tenantsListArray = response.payload;
      this.forceUpdate();
    });

    let userRoles = [
      {
        value: 'dx_user',
        name: 'Tenant Admin'
      },
      {
        value: 'da_user',
        name: 'Data Analyst'
      },
      {
        value: 'ma_user',
        name: 'Marketing Analyst'
      }
    ];
    this.setState({userRoles: userRoles});
  }

  componentDidMount() {
    let self = this;
    var sessionManager = SessionManager.instance;
    const token = 'Bearer ' + sessionManager.getToken();

    Dropzone.options.dropzoneForm = {
				url: UrlConstants.BASE_URL + "/dataxylo/v1/user/thumb/"+this.props.userId,
				method: "post",
        paramName: "file", // The name that will be used to transfer the file
        maxFilesize: 2, // MB
        dictDefaultMessage: "<strong>Drop picture here to update.</strong>",
        headers: {
  				"authorization": token
  			},
        init: function() {
          this.on('success', function(file, response) {
            console.log('file uploaded successfully');
            console.log(response);
            if(response.status.statusCode === 0) {
              self.onFileUploadSucess();
            }
          });
          this.on('error', function(file, error, xhr) {
            console.log('file upload failed');
            console.log(error);
          });
        }
    };

  }

	render() {
    let firstNameStatus = 'form-group';
    let lastNameStatus = 'form-group';
    let emailStatus = 'form-group';
    let logoStatus = 'form-group';
    let tenantStatus = 'form-group';
    let roleStatus = 'form-group';
    if(this.fNameValidationState === 'success') {
      firstNameStatus = 'form-group has-success';
    } else if(this.fNameValidationState === 'error') {
      firstNameStatus = 'form-group has-error';
    }

    if(this.lNameValidationState === 'success') {
      lastNameStatus = 'form-group has-success';
    } else if(this.lNameValidationState === 'error') {
      lastNameStatus = 'form-group has-error';
    }

    if(this.emailValidationState === 'success') {
      emailStatus = 'form-group has-success';
    } else if(this.emailValidationState === 'error') {
      emailStatus = 'form-group has-error';
    }

    if(this.logoValidationState === 'success') {
      logoStatus = 'form-group has-success';
    } else if(this.logoValidationState === 'error') {
      logoStatus = 'form-group has-error';
    }

    if(this.tenantValidationState === 'success') {
      tenantStatus = 'form-group has-success';
    } else if(this.tenantValidationState === 'error') {
      tenantStatus = 'form-group has-error';
    }

    if(this.roleValidationState === 'success') {
      roleStatus = 'form-group has-success';
    } else if(this.roleValidationState === 'error') {
      roleStatus = 'form-group has-error';
    }

		return (
			<div className='row' style={{padding: 25}} >
			<div className="ibox-content">
				<form className="form-horizontal" onSubmit={::this.updateUser}>
						<div className={firstNameStatus}>
              <label className="col-lg-2 control-label">First Name</label>
							<div className="col-lg-8">
								<input type="text" placeholder="First Name"
                className="form-control"
								value={this.state.fname}
                onChange={::this.validatefName}/>
                {
                  this.showValidationMessage(this.fNameValidationState, this.fNameValidationMessage)
                }
							</div>
						</div>

						<div className={lastNameStatus}>
              <label className="col-lg-2 control-label">Last Name</label>
							<div className="col-lg-8">
								<input type="text" placeholder="Last Name"
                className="form-control"
								value={this.state.lname}
                onChange={::this.validatelName} />
                {
                  this.showValidationMessage(this.lNameValidationState, this.lNameValidationMessage)
                }
							</div>
						</div>

						<div className={emailStatus}>
              <label className="col-lg-2 control-label">E-mail</label>
							<div className="col-lg-8">
								<input type="email" placeholder="E-mail address" className="form-control"
								value={this.state.email}
                onChange={::this.validateEmail} />
                {
                  this.showValidationMessage(this.emailValidationState, this.emailValidationMessage)
                }
							</div>
						</div>

						{/* <div className={pswdStatus}>
              <label className="col-lg-2 control-label">Password</label>
							<div className="col-lg-8">
								<input type="password" placeholder="Password" className="form-control"
								value={this.state.pswd}
                onChange={::this.validatePswd} />
                {
                  this.showValidationMessage(this.pswdValidationState, this.pswdValidationMessage)
                }
							</div>
						</div> */}

						<div className={roleStatus}>
              <label className="col-lg-2 control-label">User Type</label>
							<div className="col-lg-8">
								{
									this.state.userRoles.map((role) => {
										return (
											<div className="i-checks">
												<label>
													<input type="checkbox"
														key={role._id}
														value={role.value}
														style={{fontSize: 16}}
                            checked={this.state.selectedRoles.indexOf(role.value) != -1}
														name='horizontal-checkbox-options'
														onChange={::this.roleCheckboxChanged} />
														<i></i> {role.name}
												</label>
											</div>
										);
									})
								}
                {
                  this.showValidationMessage(this.roleValidationState, this.roleValidationMessage)
                }
							</div>
						</div>

						<div className={tenantStatus}>
              <label className="col-lg-2 control-label">Tenant</label>
							<div className="col-lg-8">
								<select  onChange={::this.tenantSelectionChanged} className="form-control tenant-dropdown-list" value={this.state.tenantName}>
									<option value=''>Select Tenant</option>
									{
										this.tenantsListArray.map(function(item) {
											return <option key={item._id} value={item._id}>{item.name}</option>
										})
									}
								</select>
                {
                  this.showValidationMessage(this.tenantValidationState, this.tenantValidationMessage)
                }
							</div>
						</div>

            <div className="form-group">
							<div className="col-lg-offset-2 col-lg-8" style={{textAlign: 'right'}}>
                <button className="btn btn-sm btn-white" type="button" onClick={::this.cancel}>Cancel</button>&nbsp;&nbsp;
								<button className="btn btn-sm btn-primary" type="submit" disabled={::this.validateUserForm()}>Create</button>
							</div>
						</div>
            </form>

            <hr />

            <div className="row">
              <div className="col-lg-2"></div>
              <div className="col-lg-3">
                <form action="#" className="dropzone" id="dropzoneForm"></form>
              </div>
              <div className="col-lg-7">
                <img src={this.state.userlogoBase64} style={{maxHeight: 200, maxWidth: 200}} className={(this.state.userlogoBase64 === null ? 'hidden': '')}/>
                <img src={this.state.userlogoUrl} style={{maxHeight: 200, maxWidth: 200}} className={(this.state.userlogoBase64 !== null ? 'hidden': '')} />
              </div>
            </div>
				</div>
			</div>
		)
	}
}

/*= End of Create source panel =*/
/*=============================================<<<<<*/

/*=============================================>>>>>
= Create source form =
===============================================>>>>>*/

class EditUser extends React.Component {
  render() {
    return (
			<div className='xylo-page-heading'>

         <div className="row wrapper white-bg page-heading">
            <EditFormHeader />
         </div>

        <div className="row">
          <EditForm userId = {this.props.params.id} />
        </div>

      </div>
    )
  }
}

/*= End of Create source form =*/
/*=============================================<<<<<*/



export default EditUser;
