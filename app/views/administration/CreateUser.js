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

class CreateFormHeader extends Component {
  render() {
    return (
      <div className="col-lg-10">
        <div className='xylo-page-header'>
          <h2>Create New User</h2>
          <ol className="breadcrumb">
              <li>
                  <Link to="/dataprep/dashboard">Dashboard</Link>
              </li>
              <li>
                  <Link to="/admin/users">Users</Link>
              </li>
							<li>
                  <a><b>Create User</b></a>
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
class CreateForm extends Component {

	state = {
	    fname: '',
	    lname: '',
	    email: '',
	    pswd: '',
	    userlogo: null,
	    tenantName: '',
	    userRoles: [],
	    selectedRoles: []
	  }

  constructor() {
    super();
  }

  createUser(e) {
    e.preventDefault();

    let input = document.querySelector('input[type="file"]')

    let data = new FormData();
    data.append('file', input.files[0])
    data.append('name', this.state.fname + ' ' + this.state.lname)
    data.append('email', this.state.email)
    data.append('password', this.state.pswd)

    this.state.selectedRoles.forEach(function(item) {
      if(item === 'da_user') {
        data.append('da_user', true)
      }
      if(item === 'dx_user') {
        data.append('dx_user', true)
      }
      if(item === 'ma_user') {
        data.append('ma_user', true)
      }
    });

    XyloFetch.addTenantUser(data, this.state.tenantName)
    .then(response => {
      this.props.router.push('/admin/users/');
    });
  }

  /* Function to validate first name */
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

  /* Function to validate password*/
  validatePswd(e) {
    let pswd = e.target.value;
    this.pswdValidationMessage = '';
    this.pswdValidationState = '';
    if(pswd != '' && pswd != undefined) {
      this.pswdValidationState = 'success';
    } else {
      this.pswdValidationState = 'error';
      this.pswdValidationMessage = "Password is Required";
    }
    this.setState({pswd});
  }

  /* function to validate user logo */
  validateLogo(e) {
    let self = this;
    console.log('in file upload');
    console.log(e.target.files);
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
        self.setState({userlogo: null});
        this.logoValidationState = 'error';
        this.logoValidationMessage = "User Logo is Required";
      }
      var reader = new FileReader();
      // Closure to capture the file information.
      reader.onload = (function(theFile) {
        return function(e) {
          // Render thumbnail.
          self.setState({userlogo: e.target.result});
        };
      })(userlogo[0]);
      // Read in the image file as a data URL.
      reader.readAsDataURL(userlogo[0]);
    } else {
      this.logoValidationState = 'error';
      this.logoValidationMessage = "User Logo is Required";
    }
  }

  showValidationMessage(validationSate, validationMessage) {
    if(validationSate == 'error') {
      return (
        <span className='validation-error-message'>{validationMessage}</span>
      );
    }
  }

  validateUserForm() {
    if(this.fNameValidationState != undefined && this.lNameValidationState != undefined && this.emailValidationState != undefined && this.pswdValidationState != undefined && this.logoValidationState != undefined && this.roleValidationState != undefined && this.state.tenantName != '') {
      if(this.fNameValidationState == 'error' || this.lNameValidationState == 'error' || this.emailValidationState == 'error' || this.pswdValidationState == 'error' || this.logoValidationState == 'error' || this.roleValidationState == 'error' || this.state.tenantName == '') {
        return true;
      } else {
        return false;
      }
    } else {
      return true;
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

  componentWillMount() {
  	const sessionManager = SessionManager.instance;
  	if(!sessionManager.isUserLoggedIn()) {
  		this.props.router.push('/');
  		return;
  	}
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

	render() {
    let firstNameStatus = 'form-group';
    let lastNameStatus = 'form-group';
    let emailStatus = 'form-group';
    let pswdStatus = 'form-group';
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

    if(this.pswdValidationState === 'success') {
      pswdStatus = 'form-group has-success';
    } else if(this.pswdValidationState === 'error') {
      pswdStatus = 'form-group has-error';
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
				<form className="form-horizontal" onSubmit={::this.createUser}>
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

						<div className={pswdStatus}>
              <label className="col-lg-2 control-label">Password</label>
							<div className="col-lg-8">
								<input type="password" placeholder="Password" className="form-control"
								value={this.state.pswd}
                onChange={::this.validatePswd} />
                {
                  this.showValidationMessage(this.pswdValidationState, this.pswdValidationMessage)
                }
							</div>
						</div>

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
								<select  onChange={::this.tenantSelectionChanged} className="form-control tenant-dropdown-list">
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

						<div className={logoStatus}>
              <label className="col-lg-2 control-label">Tenant Logo</label>
							<div className="col-lg-8">
								<input type='file'
									onChange={::this.validateLogo} />
									<img src={this.state.userlogo} width="100" className={(this.state.userlogo === null ? 'hidden': '')}/>
                  {
                    this.showValidationMessage(this.logoValidationState, this.logoValidationMessage)
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

class CreateUser extends React.Component {
  render() {
    return (
			<div className='xylo-page-heading'>

         <div className="row wrapper white-bg page-heading">
            <CreateFormHeader />
         </div>

        <div className="row">
          <CreateForm />
        </div>

      </div>
    )
  }
}

/*= End of Create source form =*/
/*=============================================<<<<<*/



export default CreateUser;
