import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { withRouter, Link, Location } from 'react-router';
import { Route, Router, IndexRedirect, browserHistory} from 'react-router';
import Moment from 'moment';
// import vex from 'vex';


import * as UrlConstants from '../../components/common/UrlConstants';
import * as XyloFetch from '../../components/common/XyloFetch';
import TreeMultiselect from '../../components/common/TreeMultiselect';
import Dropzone from '../../../public/vendor/dropzone/dropzone';
import async from 'async';


/*=============================================>>>>>
= Create source Header =
===============================================>>>>>*/

class EditDatasetHeader extends Component {
  render() {
    return (
      <div className="col-lg-10">
        <div className='xylo-page-header'>
          <h2>Edit Dataset</h2>
          <ol className="breadcrumb">
              <li>
                  <Link to="/dataprep/dashboard">Data Prep</Link>
              </li>
              <li>
                  <Link to="/dataprep/datasets">Datasets</Link>
              </li>
							<li>
                  <a><b>Edit Dataset</b></a>
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
class EditDatasetForm extends Component {
  state = {
    id: '',
    name: '',
    desc: '',
    attributes: []
  };

	componentWillMount() {
    this.getDatasetToEdit();
	}

	componentDidMount() {
    this.getCategories();
    // var self = this;
    // async.series([function(callback) {
    //   console.log("call getDatasetToEdit 1");
    //   self.getDatasetToEdit(callback);
    // }, function(callback) {
    //   console.log("log 2");
    //   self.getCategories(callback);
    // }], function(err, result) {
    //   console.log("log 3");
    //   self.forceUpdate();
    // });
  }

  onDatasetSubmit(e) {
    e.preventDefault();

    let self = this;
    let setName = this.state.name;
   	let setDescription = this.state.desc;

    let selectedDatasetItems = this.datasetRef.getSelectedChildren();
    let tempAttributes = [];
    selectedDatasetItems.forEach(function(item) {
       tempAttributes.push({name: item.text, sourceName: item.parentName});
    });

   	var datasetObj = {};
   	datasetObj.name = setName;
   	datasetObj.description = setDescription;

   	//datasetObj.attributes = this.selectedSources;
     datasetObj.attributes = tempAttributes;

     //const mondoId = fromGlobalId(this.state.id).id
 		XyloFetch.editDataset(this.state.id, datasetObj)
 	 .then((serverDatasets) => {
 			console.log("server response ");
 			console.log(serverDatasets);
       self.props.router.push('/dataprep/datasets/');
 		});
   }

   getCategories() {
     console.log("in get categories");
     this.attributes = [];
     const self = this;
     XyloFetch.getCategories()
     .then(response => {
       let categories = response.payload;
       categories.forEach(function(categoryItem) {
         let categoryName = categoryItem.name;
         var listItem = {};
          listItem.text = categoryName;
          listItem.value = categoryName;
          listItem.isSelected = false;
          listItem.children = [];
          categoryItem.attributes.forEach(function(attribItem) {
            let attribArray = this.selectedAttributesMap[categoryName];
            if(attribArray && attribArray.length > 0) {
              let listItem1 = {};
              listItem1.text = attribItem.name;
              listItem1.value = attribItem.name;
              if (attribItem.name === 'Company Name' || attribItem.name === 'DUNS Number') {
                  listItem1.isSelected = true;  
                  listItem1.isDisabled = true;
              }
              else {
                listItem1.isSelected = false;
                listItem1.isDisabled = false;
              }
              listItem1.isSelected = attribArray.indexOf(attribItem.name) != -1;
              listItem.children.push(listItem1);
            } else {
              let listItem1 = {};
               listItem1.text = attribItem.name;
               listItem1.value = attribItem.name;
               listItem1.isSelected = false;
               listItem.children.push(listItem1);
            }
          }.bind(this));
          self.attributes.push(listItem);
       }.bind(this));
       self.forceUpdate();
       //let sources = response.payload;

       /* create the data for multi-select */
      //  sources.forEach(function(sourceItem){
   	// 		let sourceName = sourceItem.name;
      //    var listItem = {};
      //    listItem.text = sourceName;
      //    listItem.value = sourceName;
      //    listItem.isSelected = false;
      //    listItem.children = [];
   	// 		sourceItem.attributes.forEach(function(attribItem){
      //      let attrib = self.selectedAttributesMap[sourceName];
      //      if(attrib && attrib.length > 0) {
      //        var listItem1 = {};
     // 				listItem1.text = attribItem.name;
     // 				listItem1.value = attribItem.name;
     // 				listItem1.isSelected = attrib.indexOf(attribItem.name) != -1;
     // 				listItem.children.push(listItem1);
      //      } else {
      //        var listItem1 = {};
      //        listItem1.text = attribItem.name;
      //        listItem1.value = attribItem.name;
      //        listItem1.isSelected = false;
      //        listItem.children.push(listItem1);
      //      }
   	// 		}.bind(this));
      //    this.attributes.push(listItem);
   	// 	}.bind(this));
      //  this.forceUpdate();                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    self.forceUpdate();
     });
   }

   getDatasetToEdit() {
    this.selectedAttributesMap = {};
    const self=this;
    XyloFetch.getDataset(this.props.datasetId)
    .then(response => {
      let editDatasetObj = {};
      editDatasetObj = response.payload;
      let tempObj = {};
      tempObj.id = editDatasetObj._id;
      tempObj.name = editDatasetObj.name;
      tempObj.desc = editDatasetObj.description;
      tempObj.attributes = editDatasetObj.attributes;
      this.setState(tempObj);
      this.nameValidationState = 'success';
      this.descValidationState = 'success';
      this.attribValidationState = 'success';
      this.multiselectValidationClass = 'tree-multi-select-success';
      this.validateDatasetForm();

      //this.attributes = [];
      console.log("dataset edit attributes"); console.log(response.payload.attributes);
      let preSelectedAttributes = response.payload.attributes;
      preSelectedAttributes.forEach(function(item) {
        if(self.selectedAttributesMap[item.sourceName]) {
          self.selectedAttributesMap[item.sourceName].push(item.name);
        } else {
          self.selectedAttributesMap[item.sourceName] = [item.name]
        }
      });
      console.log("map");
      console.log(self.selectedAttributesMap);
      console.log("function call to get categories");
    })
  }

  onTreeSelectionChanged(selectedDatasets) {
    this.attribValidationMessage = '';
    this.attribValidationState = '';
    this.multiselectValidationClass = '';
    if(selectedDatasets.length === 0) {
      this.attribValidationState = 'error';
      this.multiselectValidationClass = 'tree-multi-select-error';
      this.attribValidationMessage = "Dataset Attrbutes are Required";
    } else {
      this.multiselectValidationClass = 'tree-multi-select-success';
      this.attribValidationState = 'success';
    }
    this.forceUpdate();
  }

  /* validation function for dataset name */
  validateDatasetName(e) {
    let name = e.target.value;
    let nameValidationState = '';
    this.nameValidationMessage = '';
    if(name != '' && name != undefined) {
      this.nameValidationState = 'success';
    } else {
      this.nameValidationState = 'error';
      this.nameValidationMessage = "Dataset Name is Required";
    }
    this.setState({name: name});
  }

  /* validation function for dataset description */
  validateDatasetDesc(e) {
    let desc = e.target.value;
    let descValidationState = '';
    this.descValidationMessage = '';
    if(desc != '' && desc != undefined) {
      this.descValidationState = 'success';
    } else {
      this.descValidationState = 'error';
      this.descValidationMessage = "Dataset Description is Required";
    }
    this.setState({desc: desc});
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
  validateDatasetForm() {
    if(this.nameValidationState != undefined && this.descValidationState != undefined && this.attribValidationState != undefined) {
      if(this.nameValidationState == 'error' || this.descValidationState == 'error' || this.attribValidationState == 'error') {
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }
  }

  cancel() {
		this.props.router.push('/dataprep/datasets');
	}

	render() {
    let datasetNameStatus = '';
    let datasetDescStatus = '';
    let datasetAttribStatus = '';
    if(this.nameValidationState === 'success') {
      datasetNameStatus = 'has-success';
    } else if(this.nameValidationState === 'error') {
      datasetNameStatus = 'has-error';
    }

    if(this.descValidationState === 'success') {
      datasetDescStatus = 'has-success';
    } else if(this.descValidationState === 'error') {
      datasetDescStatus = 'has-error';
    }

    if(this.attribValidationState === 'success') {
      datasetAttribStatus = 'has-success';
    } else if(this.attribValidationState === 'error') {
      datasetAttribStatus = 'has-error';
    }
    console.log("atributes");
    console.log(this.attributes);
		return (
			<div className='row' style={{padding: 25}} >
			<div className="ibox-content">
				<form className="form-horizontal" onSubmit={::this.onDatasetSubmit}>
						<div className="form-group">
              <label className="col-lg-2 control-label">Name</label>
							<div className={"col-lg-8 " + (datasetNameStatus)}>
								<input type="text" placeholder="Dataset Name" className="form-control"
									onChange={::this.validateDatasetName}
									value={this.state.name}
									ref={(name) => this.name = name} />
                  {
                    this.showValidationMessage(this.nameValidationState, this.nameValidationMessage)
                  }
							</div>
						</div>

						<div className="form-group">
              <label className="col-lg-2 control-label">Description</label>
							<div className={"col-lg-8 " + (datasetDescStatus)}>
							<textarea placeholder="Description" className="form-control"
								onChange={::this.validateDatasetDesc}
								value={this.state.desc}
								ref={(desc) => this.desc = desc}/>
                {
                  this.showValidationMessage(this.descValidationState, this.descValidationMessage)
                }
							</div>
						</div>

						<div className="form-group">
              <label className="col-lg-2 control-label">Categories</label>
  						<div className={"col-lg-8 " + (datasetAttribStatus)}>
  						<TreeMultiselect
              id="datasetAttr"
              data={this.attributes}
              ref={(c) => this.datasetRef = c}
              onChange = {::this.onTreeSelectionChanged}
              className={this.multiselectValidationClass} />
              {
                this.showValidationMessage(this.attribValidationState, this.attribValidationMessage)
              }
  						</div>
						</div>
						<div className="form-group row">
							<div className="col-lg-offset-2 col-lg-8" style={{textAlign: 'right'}}>
								<button className="btn btn-sm btn-white" type="button" onClick={::this.cancel}>Cancel</button>&nbsp;&nbsp;
                <button className="btn btn-sm btn-primary" type="submit" disabled={::this.validateDatasetForm()}>Update</button>
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

class EditDataset extends Component {
  render() {
    return (
			<div className='xylo-page-heading'>
         <div className="row wrapper white-bg page-heading">
            <EditDatasetHeader />
         </div>
        <div className="row">
          <EditDatasetForm datasetId = {this.props.params.id}/>
        </div>
      </div>
    )
  }
}

/*= End of Create source form =*/
/*=============================================<<<<<*/



export default EditDataset;
