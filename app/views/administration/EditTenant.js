import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { withRouter, Link, Location } from 'react-router';
import { Route, Router, IndexRedirect, browserHistory} from 'react-router';
import Moment from 'moment';

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
          <h2>EditTenant</h2>
          <ol className="breadcrumb">
              <li>
                <Link to="/dataprep/dashboard">Data Prep</Link>
              </li>
              <li>
                <Link to="/admin/tenants">Tenants</Link>
              </li>
							<li>
                <a><b>Edit Tenant</b></a>
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
	    name: '',
	    description: '',
			logo: null,
      tenantlogoBase64: null,
	  }

  constructor() {
    super();
  }

  updateTenant(e) {
    e.preventDefault();
    let self = this;
    let reqData = {
      'name': this.state.name,
      'description': this.state.description
    };
    XyloFetch.editTenant(reqData, this.props.tenantId)
    .then(response => {
      self.props.router.push('/admin/tenants/');
    });
  }

    /* Function to validate first name */
  validateTenantName(e) {
    let name = e.target.value;
    this.tenantNameValidationMessage = '';
    this.tenantNameValidationState = '';
    if(name != '' && name != undefined) {
      this.tenantNameValidationState = 'success';
    } else {
      this.tenantNameValidationState = 'error';
      this.tenantNameValidationMessage = "Tenant Name is Required";
    }
    this.setState({name});
  }

  validateDesc(e) {
    let description = e.target.value;
    let descValidationState = '';
    this.descValidationMessage = '';
    if(description != '' && description != undefined) {
      this.descValidationState = 'success';
    } else {
      this.descValidationState = 'error';
      this.descValidationMessage = "Tenant Description is Required";
    }
    this.setState({description: description});
  }

  validateLogo(e) {
    let self = this;
    console.log('in file upload');
    console.log(e.target.files);
    let logo = e.target.files;
    let logoValidationState = '';
    this.logoValidationMessage = '';
    if(logo != '' && logo != undefined) {
      this.logoValidationState = 'success';
      // Only process image files.
      if(logo[0] != undefined) {
        if (!logo[0].type.match('image.*')) {
          this.logoValidationState = 'error';
          this.logoValidationMessage = "Select image for logo";
          return;
        }
      } else {
        self.setState({logo: null});
        this.logoValidationState = 'error';
        this.logoValidationMessage = "Tenant Logo is Required";
      }
      var reader = new FileReader();
      // Closure to capture the file information.
      reader.onload = (function(theFile) {
        return function(e) {
          // Render thumbnail.
          self.setState({logo: e.target.result});
        };
      })(logo[0]);
      // Read in the image file as a data URL.
      if(logo.length !== 0) {
        reader.readAsDataURL(logo[0]);
      }
    } else {
      this.logoValidationState = 'error';
      this.logoValidationMessage = "Tenant Logo is Required";
    }
  }

  showValidationMessage(validationSate, validationMessage) {
    if(validationSate == 'error') {
      return (
        <span className='validation-error-message'>{validationMessage}</span>
      );
    }
  }

  /* Function to check tenant form validity */
  validateTenantForm() {
    if(this.tenantNameValidationState != undefined && this.descValidationState != undefined) {
      if(this.tenantNameValidationState == 'error' || this.descValidationState == 'error') {
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }
  }

	cancel() {
		this.props.router.push('/admin/tenants');
	}

  /* Function to fetch the tenant to be edited */
  fetchTenantToEdit() {
    const self = this;
    this.baseURL = UrlConstants.BASE_URL;
    XyloFetch.getTenant(this.props.tenantId)
    .then(response => {
      let tenantObj = {};
      tenantObj.name = response.payload.name;
      tenantObj.description = response.payload.description;
      tenantObj.logo = self.baseURL + '/logos/' + response.payload.logo;
      this.tenantNameValidationState = 'success';
      this.descValidationState = 'success';
      this.logoValidationState = 'success';
      this.setState(tenantObj);
    })
  }

  onFileUploadSucess() {
    this.fetchTenantToEdit();
  }

  componentDidMount() {
    this.fetchTenantToEdit();
    let self = this;
    var sessionManager = SessionManager.instance;
    const token = 'Bearer ' + sessionManager.getToken();

    Dropzone.options.dropzoneForm = {
				url: UrlConstants.BASE_URL + "/dataxylo/v1/tenants/logo/"+this.props.tenantId,
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
    let nameStatus = 'form-group';
    let descStatus = 'form-group';
    let logoStatus = 'form-group';
    if(this.tenantNameValidationState === 'success') {
      nameStatus = 'form-group has-success';
    } else if(this.tenantNameValidationState === 'error') {
      nameStatus = 'form-group has-error';
    }

    if(this.descValidationState === 'success') {
      descStatus = 'form-group has-success';
    } else if(this.descValidationState === 'error') {
      descStatus = 'form-group has-error';
    }

    if(this.logoValidationState === 'success') {
      logoStatus = 'form-group has-success';
    } else if(this.logoValidationState === 'error') {
      logoStatus = 'form-group has-error';
    }
		return (
			<div className='row' style={{padding: 25}} >
		   <div className="ibox-content">
          <form className="form-horizontal" onSubmit={::this.updateTenant}>
            <div className={nameStatus}>
              <label className="col-lg-2 control-label">Name</label>
            	<div className="col-lg-8">
            		<input type="text" placeholder="Tenant Name" className="form-control"
            			value={this.state.name}
                  onChange={::this.validateTenantName}/>
                  {
                    this.showValidationMessage(this.tenantNameValidationState, this.tenantNameValidationMessage)
                  }
            	</div>
            </div>
            <div className={descStatus}>
              <label className="col-lg-2 control-label">Last Name</label>
            	<div className="col-lg-8">
            		<textarea placeholder="Description" className="form-control"
            			value={this.state.description}
                  onChange={::this.validateDesc} />
                  {
                    this.showValidationMessage(this.descValidationState, this.descValidationMessage)
                  }
            	</div>
            </div>

            <div className="form-group row">
            	<div className="col-lg-offset-2 col-lg-8" style={{textAlign: 'right'}}>
                <button className="btn btn-sm btn-white" type="button" onClick={::this.cancel}>Cancel</button>&nbsp;&nbsp;
            		<button className="btn btn-sm btn-primary" type="submit" disabled={::this.validateTenantForm()}>Create</button>
            	</div>
            </div>
            </form>
            <hr />

            <div className="row">
              <label className="col-lg-2 control-label"></label>
              <div className="col-lg-3">
                <form action="#" className="dropzone" id="dropzoneForm"></form>
              </div>
            	<div className="col-lg-7">
                <img src={this.state.tenantlogoBase64} style={{maxHeight: 200, maxWidth: 200}} className={(this.state.tenantlogoBase64 === null ? 'hidden': '')}/>
                <img src={this.state.logo} style={{maxHeight: 200, maxWidth: 200}} className={(this.state.tenantlogoBase64 !== null ? 'hidden': '')} />
                {
                  this.showValidationMessage(this.logoValidationState, this.logoValidationMessage)
                }
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

class EditTenant extends React.Component {
  render() {
    return (
			<div className='xylo-page-heading'>

         <div className="row wrapper white-bg page-heading">
            <EditFormHeader />
         </div>

        <div className="row">
          <EditForm tenantId={this.props.params.id} />
        </div>

      </div>
    )
  }
}

/*= End of Create source form =*/
/*=============================================<<<<<*/



export default EditTenant;
