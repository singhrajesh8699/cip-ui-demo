import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { withRouter, Link, Location } from 'react-router';
import { Route, Router, IndexRedirect, browserHistory} from 'react-router';
import Moment from 'moment';


import * as UrlConstants from '../../components/common/UrlConstants';
import * as XyloFetch from '../../components/common/XyloFetch';
import TreeMultiselect from '../../components/common/TreeMultiselect';
import Dropzone from '../../../public/vendor/dropzone/dropzone';

/*=============================================>>>>>
= Create source Header =
===============================================>>>>>*/

class CreateProjectHeader extends Component {
  render() {
    return (
      <div className="col-lg-10">
        <div className='xylo-page-header'>
          <h2>Create New Project</h2>
          <ol className="breadcrumb">
              <li>
                <Link to="/dataprep/dashboard">Data Prep</Link>
              </li>
              <li>
                <Link to="/dataprep/projects">Projects</Link>
              </li>
							<li>
                <a><b>Create Project</b></a>
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
class CreateProjectForm extends Component {

	state = {
    datasetList: [],
    selectedDatasets: [],
    datasetMap: {},
    name: '',
    desc: '',
    type: 'private'
  };

 	createProject(e) {
	 	e.preventDefault();

		const self = this;
    let projectName = this.state.name;
		let projectDescription = this.state.desc;
    let projectType = this.state.type;

		let selectedDatasetList = [];
		this.state.selectedDatasets.forEach(function(item){
			selectedDatasetList.push(self.findItemById(item));
		});

		let projectObj = {
			name: projectName,
			description: projectDescription,
			type: projectType,
			datasets: selectedDatasetList
		};

		XyloFetch.postProject(projectObj)
    .then((serverProjects) => {
  		console.log("server response ");
  		console.log(serverProjects);
  		self.props.router.push('/dataprep/projects/')
    });
  }

	findItemById(id) {
		var selectedItem = null;
		for(var counter = 0; counter < this.state.datasetList.length; ++counter){
			if(this.state.datasetList[counter]._id === id) {
				selectedItem = this.state.datasetList[counter];
				break;
			}
		}
		return selectedItem;
	}

  cancel() {
    this.props.router.push('/dataprep/projects');
  }


  onDatasetsFetched(payload) {
    let datasets = payload;

    /* creating map of dataset attributes */
    let datasetAttributesMap = {};
		const publishedDatasets = [];
    datasets.forEach(function(item) {
			if(item.status === 'published'){
	      datasetAttributesMap[item._id] = item.attributes;
				publishedDatasets.push(item);
			}
    });
    this.setState({datasetList: publishedDatasets, datasetMap: datasetAttributesMap});
  }

	componentDidMount() {
			const self = this;
			XyloFetch.getAllDatasets()
			.then( response => {
				if(response.payload) {
					self.onDatasetsFetched(response.payload);
				}
			});
		}

	datasetCheckboxChanged(event){
    let datasetArray = this.state.selectedDatasets;

		if(event.target.checked){
			datasetArray.push(event.target.value);
		}
		else{
			var index = datasetArray.indexOf(event.target.value);
			if (index !== -1) {
			  datasetArray.splice(index, 1);
			}
		}
    this.datasetValidationMessage = '';
    this.datasetValidationState = '';
    this.datasetselectValidationClass = '';
    if(datasetArray.length === 0) {
      this.datasetValidationState = 'error';
      this.datasetselectValidationClass = 'dataset-select-error';
      this.datasetValidationMessage = "Dataset are Required";
    } else {
      this.datasetselectValidationClass = 'dataset-select-success';
      this.datasetValidationState = 'success';
    }
    this.setState({selectedDatasets: datasetArray});
	}

  /* validation function for project name */
  validateName(e) {
    let name = e.target.value;
    let nameValidationState = '';
    this.nameValidationMessage = '';
    if(name != '' && name != undefined) {
      this.nameValidationState = 'success';
    } else {
      this.nameValidationState = 'error';
      this.nameValidationMessage = "Project Name is Required";
    }
    this.setState({name: name});
  }

  /* validation function for project description */
  validateDesc(e) {
    let desc = e.target.value;
    let descValidationState = '';
    this.descValidationMessage = '';
    if(desc != '' && desc != undefined) {
      this.descValidationState = 'success';
    } else {
      this.descValidationState = 'error';
      this.descValidationMessage = "Project Description is Required";
    }
    this.setState({desc: desc});
  }

	typeSelectionChanged(e) {
    this.setState({type: e.target.value});
		console.log(this.state.type);
  }

  /* function to show validation message */
  showValidationMessage(validationSate, validationMessage) {
    if(validationSate == 'error') {
      return (
        <span className='validation-error-message'>{validationMessage}</span>
      );
    }
  }

  /* function to check whether dataset form is valid */
  validateProjectForm() {
    if(this.nameValidationState != undefined && this.descValidationState != undefined && this.datasetValidationState != undefined) {
      if(this.nameValidationState == 'error' || this.descValidationState == 'error' || this.datasetValidationState == 'error') {
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }
  }

	render() {
    let projectNameStatus = '';
    let projectDescStatus = '';
    let dataseStatus = '';
    if(this.nameValidationState === 'success') {
      projectNameStatus = 'has-success';
    } else if(this.nameValidationState === 'error') {
      projectNameStatus = 'has-error';
    }

    if(this.descValidationState === 'success') {
      projectDescStatus = 'has-success';
    } else if(this.descValidationState === 'error') {
      projectDescStatus = 'has-error';
    }

    if(this.datasetValidationState === 'success') {
      dataseStatus = 'has-success';
    } else if(this.datasetValidationState === 'error') {
      dataseStatus = 'has-error';
    }

		return (
			<div className='row' style={{padding: 25}} >
			<div className="ibox-content">
				<form className="form-horizontal" onSubmit={::this.createProject}>
						<div className="form-group">
              <label className="col-lg-2 control-label">Name</label>
							<div className={"col-lg-8 " + (projectNameStatus)}>
								<input type="text" placeholder="Project Name" className="form-control"
									value={this.state.name}
                  onChange={::this.validateName}
                  ref={(projectName) => this.projectName = projectName} />
                  {
                    this.showValidationMessage(this.nameValidationState, this.nameValidationMessage)
                  }
							</div>
						</div>

						<div className="form-group">
              <label className="col-lg-2 control-label">Description</label>
							<div className={"col-lg-8 " + (projectDescStatus)}>
								<textarea placeholder="Description" rows='5' className="form-control"
                  value={this.state.desc}
                  onChange={::this.validateDesc}
                  ref={(projectDescription) => this.projectDescription = projectDescription}/>
                  {
                    this.showValidationMessage(this.descValidationState, this.descValidationMessage)
                  }
							</div>
						</div>

						<div className="form-group">
              <label className="col-lg-2 control-label">Type</label>
							<div className="col-lg-8">
								<select componentClass='select' defaultValue='Private' className="form-control"
									onChange={::this.typeSelectionChanged}
									ref={(projectType) => this.projectType = projectType}>
									<option value='private'>Private</option>
									<option value='public'>Public</option>
									<option value='shared'>Shared</option>
								</select>
							</div>
						</div>

						<div className="form-group">
              <label className="col-lg-2 control-label">Datasets</label>
							<div className={"col-lg-8 " + (dataseStatus)}>
							{
								this.state.datasetList.map((dataset) => {
									return (
										<div className="i-checks">
											<label>
												<input type="checkbox"
													key={dataset._id}
													value={dataset._id}
													style={{fontSize: 16}}
													name='horizontal-checkbox-options'
													onChange={::this.datasetCheckboxChanged} />
													<i></i> {dataset.name}
											</label>
										</div>
									);
								})
							}
              {
                this.showValidationMessage(this.datasetValidationState, this.datasetValidationMessage)
              }
							</div>
						</div>

            <div className="form-group">
              <div className="col-lg-offset-2 col-lg-8">
              <ul style={{paddingLeft: 0}}>
                  {
                    this.state.selectedDatasets.map((datasetname, i) => {
                      return (
                        <li key ={datasetname} style={{listStyleType: 'none', marginBottom: 20}}>
                          {
                            this.state.datasetMap[datasetname].map((attrib, index) => {
                              return(
                                <label className='label label-default label-md' key={index} style={{marginRight: 5, padding: 5, fontSize: 12}}>{attrib.name}</label>
                              );
                            })
                          }
                        </li>
                      );
                    })
                  }
                </ul>
              </div>
            </div>

						<div className="form-group">
								<div className="col-lg-offset-2 col-lg-8" style={{textAlign: 'right'}}>
                  <button className="btn btn-sm btn-white" type="button" onClick={::this.cancel}>Cancel</button>&nbsp;&nbsp;
									<button className="btn btn-sm btn-primary" type="submit" disabled={::this.validateProjectForm()}>Create</button>
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

class CreateProject extends React.Component {
  render() {
    return (
			<div className='xylo-page-heading'>

         <div className="row wrapper white-bg page-heading">
            <CreateProjectHeader />
         </div>

        <div className="row">
          <CreateProjectForm />
        </div>

      </div>
    )
  }
}

/*= End of Create source form =*/
/*=============================================<<<<<*/



export default CreateProject;
