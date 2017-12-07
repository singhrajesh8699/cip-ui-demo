import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { withRouter, Link, Location } from 'react-router';
import { Route, Router, IndexRedirect, browserHistory} from 'react-router';
import Moment from 'moment';

import * as UrlConstants from '../../components/common/UrlConstants';
import * as XyloFetch from '../../components/common/XyloFetch';
import DropzoneComponent from 'react-dropzone-component';
import SessionManager from '../../components/common/SessionManager';

/*=============================================>>>>>
= Create source Header =
===============================================>>>>>*/

class CreateSourceHeader extends Component {
  render() {
    return (
      <div className="col-lg-10">
        <div className='xylo-page-header'>
          <h2>Add Sources</h2>
          <ol className="breadcrumb">
              <li>
                <Link to="index.html">Data Prep</Link>
              </li>
              <li>
                <Link to="/dataprep/sources">Sources</Link>
              </li>
							<li>
                <a><b>Add Source</b></a>
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
class CreateSourceForm extends Component {
  state = {
    updatedFileName: '',
    errorMsg: ''
  };

	constructor(props) {
		super(props);
    var sessionManager = SessionManager.instance;
    var tenantId = sessionManager.getUser().tenant._id;
    var self = this;
		this.djsConfig = {
			addRemoveLinks: true,
      headers: {
				tenantID: tenantId
			},
      accept: function(file, done) {
        //console.log("in djsConfig");
        //function call
        self.doneCallback = done;
        self.currentFilename = file.name;
        self.validateFileNameFunction(file.name);
      },
      renameFilename: function(file) {
        //console.log("in rename filename"); console.log(self.currentFilename);
        return self.currentFilename;
      }
			//dictDefaultMessage: "Put your custom message here"
		};

		var url = UrlConstants.BASE_URL + '/dataxylo/v1/sources/upload/';
		//var url = 'http://dataxylo.duckdns.com:8080/dataxylo/v1/datasets/upload/'+mondoId;
		this.componentConfig = {
			iconFiletypes: [],
			showFiletypeIcon: true,
			postUrl: url,
      headers: {
				tenantID: tenantId
			}
		};
	}

  updateFileName(e) {
    this.setState({updatedFileName: e.target.value});
  }

  submitFileName() {
    var splitArray = this.currentFilename.split('.');
    var extension = splitArray[splitArray.length-1];
    //console.log("extension: "+extension);
    this.currentFilename = this.state.updatedFileName + '.' + extension;
    this.validateFileNameFunction(this.currentFilename);
  }

  //function to validate the filename
  validateFileNameFunction(filename) {
    var self = this;
    XyloFetch.getSourceByName(filename)
    .then(function(res) {
      //console.log("in getSourceByName"); console.log(res);
      var errorMsg = "Filename already exists. Please enter new filename";
      if(res.payload === null) {
        $('#acceptFilenameModal').modal('hide');
        self.doneCallback();
      } else {
        self.setState({errorMsg: errorMsg, updatedFileName: ''});
        $('#acceptFilenameModal').modal('show');
      }
    });
  }

	render() {
		const config = this.componentConfig;
		const djsConfig = this.djsConfig;

		console.log(djsConfig);
		console.log(config);

		const eventHandlers = {
			init: dz => this.dropzone = dz,
		}

		return (
			<div className='row formCreateSource' style={{padding: 25}} >
				<div className="col-lg-12">
	        <div className="tabs-container">
            <ul className="nav nav-tabs">
                <li className="active"><a data-toggle="tab" href="#tab-1">LOCAL FILE</a></li>
                <li className=""><a data-toggle="tab" href="#tab-2">FTP</a></li>
								<li className=""><a data-toggle="tab" href="#tab-3">DATABASE</a></li>
								<li className=""><a data-toggle="tab" href="#tab-4">API</a></li>
            </ul>
            <div className="tab-content">
              <div id="tab-1" className="tab-pane active">
                <div className="panel-body">
									<DropzoneComponent config={config} eventHandlers={eventHandlers} djsConfig={djsConfig} />
                </div>
              </div>
              <div id="tab-2" className="tab-pane">
                <div className="panel-body">
                  <h2>Coming soon</h2>
                </div>
              </div>
							<div id="tab-3" className="tab-pane">
                <div className="panel-body">
                  <h2>Coming soon</h2>
                </div>
              </div>
							<div id="tab-4" className="tab-pane">
                <div className="panel-body">
                  <h2>Coming soon</h2>
                </div>
              </div>
            </div>
	        </div>
	      </div>

        {/* alert to accept new filename */}
        <div className="modal inmodal" id="acceptFilenameModal" tabindex="-1" role="dialog" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content animated bounceInRight">
              <div className="modal-header">
                <button type="button" className="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span className="sr-only">Close</span></button>
                {/* <i className="fa fa-laptop modal-icon"></i>*/}
                <h4 className="modal-title">Enter New Filename</h4>
              </div>
              <form role="form" className="form-inline">
                <div className="modal-body" style={{textAlign: 'left'}}>
                  <input type="text" placeholder="Project Name" className="form-control"
                    value={this.state.updatedFileName}
                    onChange={::this.updateFileName} />
                  <div><small style={{color: 'red'}}>{this.state.errorMsg}</small></div>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-primary" type="button" onClick={::this.submitFileName}>OK</button>
                  <button type="button" className="btn btn-white" data-dismiss="modal">CANCEL</button>
                </div>
              </form>
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

class CreateSource extends Component {

  render() {
    return (
			<div className='xylo-page-heading'>

         <div className="row wrapper white-bg page-heading">
            <CreateSourceHeader />
         </div>

        <div className="row">
          <CreateSourceForm />
        </div>

      </div>
    )
  }
}

/*= End of Create source form =*/
/*=============================================<<<<<*/

export default CreateSource;
