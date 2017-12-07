import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { withRouter, Link, Location } from 'react-router';

import 'datatables.net/js/jquery.dataTables.js';
import "datatables.net-buttons/js/dataTables.buttons.js";
import "datatables.net-buttons/js/buttons.html5.js";
import "datatables.net-buttons/js/buttons.colVis.js";
import "datatables.net-select/js/dataTables.select.js";
import "datatables.net-bs/js/dataTables.bootstrap.js";

import "../../../node_modules/datatables/media/css/jquery.dataTables.css";
import "../../../node_modules/datatables.net-buttons-bs/css/buttons.bootstrap.css";
import "../../../node_modules/datatables.net-select-bs/css/select.bootstrap.css";
import "../../../node_modules/datatables.net-bs/css/dataTables.bootstrap.css";
import "../../../node_modules/datatables.net-dt/css/jquery.dataTables.css";
import "../../../node_modules/datatables.net-buttons-dt/css/buttons.dataTables.css";

import * as XyloFetch from '../../components/common/XyloFetch';
import * as UrlConstants from '../../components/common/UrlConstants';
import SessionManager from '../../components/common/SessionManager';

import Loading from '../../components/common/Loading';

import DropzoneComponent from 'react-dropzone-component';
import Chart from 'chart.js';
import _ from 'lodash';

class DatasetListHeader extends Component {
  state = {
    datasets: {
      name: "",
      status: ""
    }
    };

  componentWillReceiveProps(props) {
		console.log('props updated ');
		console.log(props.dataset);
		const dataset = props.dataset;
		this.setState({datasets: dataset})
	}

  render() {
    let datasetStatus = 'label label-default label-md';
    if(this.state.datasets.status === 'new') {
      datasetStatus = 'label label-info label-md';
    } else if(this.state.datasets.status === 'draft') {
      datasetStatus = 'label label-primary label-md';
    } else if(this.state.datasets.status === 'published') {
      datasetStatus = 'label label-success label-md';
    }
    return (
      <div className="col-lg-10">
        <div className='xylo-page-header'>
          <h2>Datasets</h2>
          <ol className="breadcrumb">
              <li>
                  <Link to="/dataprep/dashboard">Data Prep</Link>
              </li>
              <li>
                  <Link to="/dataprep/datasets">Datasets</Link>
              </li>
              <li>
                <a><b>Load</b></a>
            </li>
          </ol>
        </div>
      </div>
    );
  }
}

class AttributeAnalysisModal extends Component {
  state = {
    attribAnalysisColumn: '',
    chartData: {},
    columnType: '',
    activeClass: true
  }

  constructor(props) {
    super(props);
    this.chartRef = null;
    this.numericColumnArray = [
      "No of Colur Printers",
      "No of PCs",
      "No of Servers",
      "No of Printers",
      "No of Inkjet Printers",
      "No of Laser Printers",
      "No of MFD",
      "No of High End Printers",
      "PC Budget",
      "Server Budget",
      "Printer Budget",
      "Other Hardware Budget",
      "Storage Budget",
      "Peripheral Budget",
      "Growth Score",
      "Buzz Score",
      "No of PC per Employees",
      "No of PC per Employees : Industry Benchmark",
      "Printer per Employees",
      "Printer per Employees : Industry Benchmark",
      "Per Printer Supplies Spending",
      "Per Printer Supplies Spending : Industry Benchmark",
      "Brand Wallet Share : Ink & Toner",
      "Brand Wallet Share : Supplies",
      "Brand Wallet Share :  Facilities",
      "Brand Wallet Share :  Technology",
      "Potenital Score  Overall",
      "Potential Score : Ink & Toner",
      "Potential Score : Supplies",
      "Potential Score : Facilities",
      "Potential Score : Technology",
      "Competitive Index",
      "Competitive Index : Ink & Toner",
      "Competitive Index : Supplies",
      "Competitive Index : Facilities",
      "Competitive Index : Technology",
      "Ink & Toner Sales Propensity",
      "Supplies Sales Propensity",
      "Faciltiies Sales Propensity",
      "Technology Sales Propensity",
      "Facilties Size",
      "Employees (All sites)",
      "Employees (This site)",
      "Annual Sales"
    ];
  }

  conponentWillMount() {
    console.log("dataset");
    console.log(this.props.dataset);
    var isColumnNameNumeric = this.isColumnNameNumericCheck(this.props.attribAnalysisColumn);
    this.setState({attribAnalysisColumn: this.props.attribAnalysisColumn, columnType: isColumnNameNumeric});
  }

  componentWillReceiveProps(props) {
    console.log("dataset will recieve props");
    console.log(props.dataset);
    var temp = [];
    if(props.dataset.records && props.dataset.records.length > 0) {
      var generatedData = this.parserRecords(props.dataset.records, props.attribAnalysisColumn);
      var isColumnNameNumeric = this.isColumnNameNumericCheck(props.attribAnalysisColumn);
      // console.log("generatedData");
      // console.log(generatedData);
      this.numericDataOperations(generatedData);
      this.setState({attribAnalysisColumn: props.attribAnalysisColumn, chartData: generatedData, columnType: isColumnNameNumeric});
      setTimeout(function() {
        this.createBarChart();
      }.bind(this), 1000);
    }
  }

  /* function to check whether selected column name is numeric. It checks in the numericColumnArray */
  isColumnNameNumericCheck(columnName) {
    console.log("isColumnNameNumericCheck: "+columnName);
    if(this.numericColumnArray.indexOf(columnName) === -1) {
      return 'nonNumeric';
    }
    return 'numeric';
  }

  numericDataOperations(data) {
    this.calculateMean(data);
    this.calculateMedian(data);
    this.calculateMode(data);
    this.calculateRange(data);
  }

  /* calculate mean */
  calculateMean(data) {
    this.mean = _.mean(data.labels);
    this.mean = parseFloat(Math.round(this.mean * 100) / 100).toFixed(2);
    //console.log("mean: "+ this.mean);
  }

  /* calculate median */
  calculateMedian(data) {
    data.labels.sort((a, b) => a - b);
    let lowMiddle = Math.floor((data.labels.length - 1) / 2);
    let highMiddle = Math.ceil((data.labels.length - 1) / 2);
    this.median = (data.labels[lowMiddle] + data.labels[highMiddle]) / 2;
    // console.log("median: ");
    // console.log(this.median);
  }

  /* calculate mode */
  calculateMode(data) {
    var mode = function mode(arr) {
      return arr.reduce(function(current, item) {
          var val = current.numMapping[item] = (current.numMapping[item] || 0) + 1;
          if (val > current.greatestFreq) {
              current.greatestFreq = val;
              current.mode = item;
          }
          return current;
      }, {mode: null, greatestFreq: -Infinity, numMapping: {}}, arr).mode;
    };
    this.mode = mode(data.labels);
    //console.log("mode: "+this.mode);
  }

  calculateRange(data) {
    Array.prototype.max = function() {
      return Math.max.apply(null, this);
    };

    Array.prototype.min = function() {
      return Math.min.apply(null, this);
    };

    this.arrMin = data.labels.min();
    this.arrMax = data.labels.max();
    this.range = data.labels.max() - data.labels.min();
    //console.log("range: "+this.range);
  }

  /* Parse the data in the form of {labels, data} */
  parserRecords(records, colName) {
    console.log("records");
    console.log(records);
    console.log(colName);
    if(records && records.length > 0) {
      var valueArray = [];
      var occurranceArray = [];
      records.forEach(function(item, index) {
        if(index > 10)
        return;
        var curr = item[colName];
        var currIndex = valueArray.indexOf(curr);
        if(currIndex === -1) {
          valueArray.push(curr);
          occurranceArray.push(1);
        } else {
          occurranceArray[currIndex] = occurranceArray[currIndex] + 1;
        }
      });
      return {
        labels: valueArray,
        data: occurranceArray
      };
    }
  }

  createBarChart() {
    if(this.state.chartData.data && this.state.chartData.data.length > 0) {
      const self = this;
      console.log("charddata in bar chart");
      console.log(self.state.chartData);
      (()=> {
        var barOptions = {
          responsive: true,
          scales: {
             yAxes: [{
                display: true,
                ticks: {
                  min: 0,
                  userCallback: function(label, index, labels) {
                   // when the floored value is the same as the value we have a whole number
                     if (Math.floor(label) === label) {
                         return label;
                     }
                   }
                }
             }]
          }
        };

        var barData = {
          labels: self.state.chartData.labels,
          datasets: [
           {
             label: "Frequency Distribution",
             backgroundColor: 'rgba(0, 191, 255, 0.7)',
             pointBorderColor: "#fff",
             data: self.state.chartData.data
           }
          ]
        };

        var ctx2 = document.getElementById("attribHistogram").getContext("2d");
        if(self.chartRef) {
          self.chartRef.destroy();
        }
        self.chartRef = new Chart(ctx2, {type: 'bar', data: barData, options:barOptions});
      })();
    }
  }

  componentDidMount() {
    const self = this;
    if(this.state.chartData.data && this.state.chartData.data.length > 0) {

    }
    $('#attribAnalysysModal').on('hide.bs.modal', function() {
      console.log("in modal hide");
      $('.tab-pane').removeClass('active');
      $('.tab-label').removeClass('active');
      $('#histogram').addClass('active');
      $('#tab-label1').addClass('active');
    })
  }

  render() {
    return (
      <div className="modal inmodal" id="attribAnalysysModal" tabindex="-1" role="dialog" aria-hidden="true">
        <div className="modal-dialog modal-lg">
          <div className="modal-content animated bounceInRight">
            <div className="modal-header">
              <button type="button" className="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span className="sr-only">Close</span></button>
              {/* <i className="fa fa-laptop modal-icon"></i>*/}
              <h4 className="modal-title">Attribute Analysis</h4>
            </div>
            <div className="modal-body" style={{textAlign: 'left'}}>
              <h3>{this.state.attribAnalysisColumn}</h3>
              <div className="tabs-container">
                <ul className="nav nav-tabs">
                   {/* <li className="active"><a data-toggle="tab" href="#summary">Summary</a></li> */}
                   <li className="tab-label active" id="tab-label1"><a data-toggle="tab" href="#histogram">Histogram</a></li>
                   {
                     (() => {
                       console.log("Tab state: "+this.state.columnType);
                       if(this.state.columnType === 'numeric') {
                         return (
                           <li className="tab-label"><a data-toggle="tab" href="#statistics">Statistics</a></li>
                         )
                       }
                     })()
                   }
                </ul>
                <div className="tab-content">
                  {/* <div id="summary" className="tab-pane active">
                    <div className="panel-body">
                      <strong>Lorem ipsum dolor sit amet, consectetuer adipiscing</strong>
                      <p>A wonderful serenity has taken possession of my entire soul, like these sweet mornings of spring which I enjoy with my whole heart.</p>
                    </div>
                  </div> */}
                  <div id="histogram" className="tab-pane active">
                    <div className="panel-body">
                      <canvas id="attribHistogram" height="100"></canvas>
                    </div>
                  </div>
                  {
                    (() => {
                      console.log("Content state: "+this.state.columnType);
                      if(this.state.columnType === 'numeric') {
                        return (
                          <div id="statistics" className="tab-pane">
                            <div className="panel-body">
                              <table className="table table-bordered">
                                <tbody>
                                  <tr>
                                    <td style={{textAlign: 'center'}}><strong>Min</strong></td>
                                    <td style={{textAlign: 'center'}}>{this.arrMin}</td>
                                  </tr>
                                  <tr>
                                    <td style={{textAlign: 'center'}}><strong>Max</strong></td>
                                    <td style={{textAlign: 'center'}}>{this.arrMax}</td>
                                  </tr>
                                  <tr>
                                    <td style={{textAlign: 'center'}}><strong>Mean</strong></td>
                                    <td style={{textAlign: 'center'}}>{this.mean}</td>
                                  </tr>
                                  <tr>
                                    <td style={{textAlign: 'center'}}><strong>Median</strong></td>
                                    <td style={{textAlign: 'center'}}>{this.median}</td>
                                  </tr>
                                  <tr>
                                    <td style={{textAlign: 'center'}}><strong>Mode</strong></td>
                                    <td style={{textAlign: 'center'}}>{this.mode}</td>
                                  </tr>
                                  <tr>
                                    <td style={{textAlign: 'center'}}><strong>Range</strong></td>
                                    <td style={{textAlign: 'center'}}>{this.range}</td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                        )
                      }
                    })()
                  }
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-primary" data-dismiss="modal">OK</button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

class PublishButton extends Component {

  constructor(props) {
    super(props);
		var label = props.status === 'draft' ? 'Publish' : '';
    this.state = {
      id: props.id,
			status: props.status,
			label: label
    }
  }

	componentWillReceiveProps(props) {
		var label = props.status === 'draft' ? 'Publish' : '';
		this.setState({
      id: props.id,
			status: props.status,
			label: label});
	}

	updateStatus(){
		if(this.state.status === 'draft'){
			const self = this;
			XyloFetch.publishDataset(this.state.id)
			.then( response => {
				self.props.onStatusChange('published');
			});
		}
		else if(this.state.status === 'published'){
			const self = this;
			XyloFetch.unpublishDataset(this.state.id)
			.then( response => {
				self.props.onStatusChange('draft');
			});
		}
	}

  render() {
		var style = {display: "none"};
		if(this.state.status === 'draft') {
			style.display = 'inline';
		}
    return (
    	<button style={style} className='btn btn-sm btn-primary' disabled={this.state.status === 'published' ? true : false} onClick={::this.updateStatus}>
    		{this.state.label}
    	</button>
    );
  }
}

class LoadDataset extends Component {
  state = {
    datasets: {
			status: ""
		},
    mergeColumnName: '',
    alertModalMessage: '',
    attribAnalysisColumn: '',
    updatedFileName: '',
    errorMsg: ''
  };

	constructor(props) {
		super(props);

		var sessionManager = SessionManager.instance;
		const token = 'Bearer ' + sessionManager.getToken();
    var self = this;
		this.djsConfig = {
			addRemoveLinks: true,
			headers: {
				"authorization": token
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
		};

		var url = UrlConstants.BASE_URL + "/dataxylo/v1/datasets/upload/" + props.params.id;
		//var url = 'http://dataxylo.duckdns.com:8080/dataxylo/v1/datasets/upload/'+mondoId;
		this.componentConfig = {
			iconFiletypes: [],
			showFiletypeIcon: true,
			postUrl: url,
			headers: {
				"authorization": token
			}
		};
	}

  updateFileName(e) {
    this.setState({updatedFileName: e.target.value});
  }

  submiteFileName() {
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

  launchFileUploadModal() {
    this.fileUploadModal.open();
  }

  publishDataset() {
    browserHistory.push('/app/datasets');
  }

  postDatasetFetch() {
    var self = this;
    self.initDatatable();
  }

    /**Function to initialise the dataTable */
  initDatatable() {
    const self = this;

    const dataTableFields = [];
    const tableColumnsToValidate = [];
    this.state.datasets.attributes.forEach(function(item, index) {
      const currentLabel = item.name;
      dataTableFields.push({
          label: currentLabel,
          name: currentLabel
        });
      tableColumnsToValidate.push(index);
    });

    // var editor = new $.fn.dataTable.Editor( {
    //   table: "#example",
    //   idSrc:  '_id',
    //   fields: dataTableFields
    // });

     var table = $('#example')
    .addClass('nowrap')
    .DataTable({
      dom: '<"html5buttons"B>lTfgitp',
      responsive: true,
      scrollX: true,
      pageLength: 25,
      iDisplayLength: 20,
      select: {
        items: 'column',
        style: 'multi'
      },
      buttons: [
        'selectNone',
        {
          extend: 'csvHtml5',
          text: 'Download as CSV'
        },
        {
          extend: 'colvis',
          text: 'Column Visibility',
          columns: ':gt(0)'
        },
        // {
        //   extend: 'edit'
        //   editor: editor
        // },
        {
          text: 'Clear Whitespaces',
          action: function ( e, dt, node, config ) {
                    var count1 = table.column({ selected: true });
                    let selectedColumnName = self.state.datasets.attributes[count1.index()].name;
                    self.trimColumnSpaces(selectedColumnName);
                }
        },
        {
          text: 'Split Column',
          action: function (e, dt, node, config) {
                  var count1 = table.column({ selected: true });
                  if(count1.length === 0) {
                    let alertMessage = 'Please select atleast one column to split';
                    self.showAlertModal(alertMessage);
                    $('#alertModal').modal('show')
                  } else {
                    let selectedColumnName = self.state.datasets.attributes[count1.index()].name;
                    self.splitColumnModalShow(selectedColumnName);
                  }
                }
        },
        {
          text: 'Merge Columns',
          action: function (e, dt, node, config) {
            self.mergeColumns(table.columns({ selected: true })[0]);
          }
        },
        {
          text: 'Attribute Analysis',
          action: function(e, dt, node, config) {
            var count1 = table.columns({selected: true})[0];
            console.log(count1.length);
            if(count1.length === 0) {
              let alertMessage = 'Please select atlease one column for Attribute Analysis';
              self.showAlertModal(alertMessage);
              $('#alertModal').modal('show');
            } else if(count1.length > 1) {
              let alertMessage = 'Please select only one column for Attribute Analysis';
              self.showAlertModal(alertMessage);
              $('#alertModal').modal('show');
            } else {
              var count2 = table.column({selected: true});
              let selectedColumnName = self.state.datasets.attributes[count2.index()].name;
              self.attributeAnalize(selectedColumnName);
            }
          }
        }
      ],
      initComplete: function(settings, json) {
        $('.cell_data_trimmable').parent().css('background', '#E58888');
      }
    });
  }

  /**Function to get teh datasets from API */
  loadDatasets(callback) {
    let datasetId = this.props.params.id;
     XyloFetch.getDataset(datasetId).
     then((serverDatasets) => {
       try {
         if ( $.fn.DataTable.isDataTable( '#example' ) ) {
           $('#example').DataTable().destroy();
          }
        } catch(e) {
          console.log(e);
        }
       this.setState({ datasets: serverDatasets.payload });
       callback();
     });
  }

  /*on file upload success callback */
  onFileUploadSucess() {
    this.loadDatasets(function() {
      this.postDatasetFetch();
    }.bind(this));
  }

  attributeAnalize(selectedColumn) {
    this.setState({attribAnalysisColumn: selectedColumn});
    $('#attribAnalysysModal').modal('show');
  }

	/* Function to store selected column and show dialog */
	splitColumnModalShow(selectedColumn) {
		this.columnToSplit = selectedColumn;
		$('#promptSplitColumn').modal('show');

	}

  /* Function to split the column */
  splitSelectedColumn(column, delimeter) {
    const self = this;

    XyloFetch.splitColumn(this.state.datasets._id, column, delimeter)
    .then( response => {
      //PubSub.publish( BroadcastEvents.FETCH_LOGS, 'updated' );
      self.loadDatasets(function() {
        self.postDatasetFetch();
      }.bind(self));
    });
  }

	onHandleSplit() {
		const self = this;
		console.log("splitting column " + this.columnToSplit + "    delimiter " + this.state.splitDelimeter);
		this.splitSelectedColumn(this.columnToSplit, encodeURIComponent(this.state.splitDelimeter));

	}

	updateSplitDelimeter(e) {
		this.setState({splitDelimeter: e.target.value})
	}

  /* Merge selected columns */
  mergeColumns(selectedColumns) {
    this.columnList = [];
    console.log("selected columns " + selectedColumns.length);
    console.log(typeof selectedColumns);
    const self = this;
    if(typeof selectedColumns === 'undefined' || selectedColumns.length < 2) {
      //vex.dialog.alert('Please select atleast two or more columns to merge');
      let alertMessage = 'Please select atleast two or more columns to merge';
      this.showAlertModal(alertMessage);
      //$('#alertMergeColumn').modal('show');
    }
    else{
      selectedColumns.forEach(function(column) {
        self.columnList.push(self.state.datasets.attributes[column].name);
      });
      $('#promptMergeColumn').modal('show');
      // vex.dialog.prompt({
      //   message: 'Enter name for new column :',
      //   placeholder: 'Merge columns',
      //   callback: function (value) {
      //     var payload = {name: value,
      //                   columns: this.columnList};
      //     XyloFetch.mergeColumns(self.state.datasets._id, payload)
      //     .then( response => {
      //       //PubSub.publish( BroadcastEvents.FETCH_LOGS, 'updated' );
      //       self.loadDatasets(function() {
      //         self.postDatasetFetch();
      //       }.bind(self));
      //     });
      //   }
      // });
    }
  }

  /* Function to split the column */
  trimColumnSpaces(selectedColumn) {
    const self = this;
    XyloFetch.columnTrimSpaces(this.state.datasets._id, selectedColumn)
    .then( response => {
      //PubSub.publish( BroadcastEvents.FETCH_LOGS, 'updated' );
      self.loadDatasets(function() {
        self.postDatasetFetch();
      }.bind(self));
    });
  }

  checkRulesAndUpdate(data) {
    //TODO: Check rules and create set of classes accordingly
    //			Below is an example wrapper with hardcoded class
    if(data.charAt(0) === ' ' || data.charAt(data.length - 1) === ' ') {
      return "<div class='highlighted_cell cell_data_trimmable'>" + data + "</div>";
    }
    else{
      return "<div class='highlighted_cell'>" + data + "</div>";
    }
  }

  hasWhiteSpaces(data) {
    if(typeof data === 'string'){
      return (data.charAt(0) === ' ' || data.charAt(data.length - 1) === ' ')
    }
    return false;
  }

  isDuplicate(data) {
    return (this.lists.duplicate.indexOf(data) !== -1);
  }

  isNew(data) {
    return (this.lists.newAddition.indexOf(data) !== -1);
  }

  isUpdated(data) {
    return (this.lists.updated.indexOf(data) !== -1);
  }

  isMerged(data) {
    return (data.indexOf(' : ') !== -1);
  }


  /* load datatable headings dynamically from db */
  loadDatatableHeadings() {
    this.recordHeadingMap = {};
    var i = 0;
    if(this.state.datasets.attributes != undefined) {
      return this.state.datasets.attributes.map(function(item) {
        this.recordHeadingMap[i++] = item.name;
        return (
          <th>{item.name}</th>
        );
      }.bind(this));
    }
  }

  /* load datatable content dynamically from db */
  loadDatatableContent() {
		// const tooltip_whitespaces = (
		// 	<Tooltip id='tooltip_whitespaces'><strong>Extra white spaces observed</strong></Tooltip>
		// );
		// const tooltip_duplicate = (
	  // 	<Tooltip id='tooltip_duplicate'><strong>Duplicate value</strong></Tooltip>
		// );
		// const tooltip_new = (
	  // 	<Tooltip id='tooltip_new'><strong>New attribute</strong></Tooltip>
		// );
		// const tooltip_updated = (
	  // 	<Tooltip id='tooltip_updated'><strong>Updated value</strong></Tooltip>
		// );
		// const tooltip_merged = (
	  // 	<Tooltip id='tooltip_merged'><strong>Merged column</strong></Tooltip>
		// );

    if(this.state.datasets.records != undefined) {
			const self = this;
      var recordArray = [];
      var attributeArray = [];
      recordArray = this.state.datasets.records;
      attributeArray = this.state.datasets.attributes
      return recordArray.map(function(rec) {
        return(
          <tr>
            {
              attributeArray.map(function(attrib) {
								if(typeof rec[attrib.name] !== 'undefined'){
									const value = rec[attrib.name];
									if(this.hasWhiteSpaces(value)){
										return (
															<td data-toggle="tooltip" title="Extra white spaces observed" className="dataset-grid-cell-whitespaces">
																<span>{rec[attrib.name]}</span>
															</td>
														);
									}
									else if(this.isDuplicate(value)){
										return (
															<td data-toggle="tooltip" title="Duplicate value" className="dataset-grid-cell-duplicate">
																<span> {rec[attrib.name]} </span>
															</td>
														);
									}
									else if(this.isNew(value)){
										return (
															<td data-toggle="tooltip" title="New attribute" className="dataset-grid-cell-new">
																<span>{rec[attrib.name]}</span>
															</td>
													);
									}
									else if(this.isUpdated(value)){
										return (
															<td data-toggle="tooltip" title="Updated value" className="dataset-grid-cell-updated">
																<span>{rec[attrib.name]}</span>
															</td>
														);
									}
									else if(this.isMerged(attrib.name)){
										return (
															<td data-toggle="tooltip" title="Merged column" className="dataset-grid-cell-merged">
																<span>{rec[attrib.name]}</span>
															</td>
													);
									}
	                return (<td>{rec[attrib.name]}</td>);
								}
								else {
									return (<td></td>);
								}
              }.bind(this))
            }
          </tr>
        );
      }.bind(this))
    }
  }

	updateStatus(newStatus) {
		// console.log('updatng status in parent ' + newStatus);
		var updatedDatasets = this.state.datasets;
		updatedDatasets.status = newStatus;
		this.setState({datasets: updatedDatasets});
	}

  /* function called when merge column name is updated in the modal */
  updateMergeColumnName(e) {
    this.setState({mergeColumnName: e.target.value});
  }

  /* function is called when modal button 'ok' is clicked */
  onHandleMerge() {
    let self = this;
    var payload = {name: this.state.mergeColumnName,
                  columns: this.columnList};
    XyloFetch.mergeColumns(this.state.datasets._id, payload)
    .then( response => {
      $('#promptMergeColumn').modal('hide');
      //PubSub.publish( BroadcastEvents.FETCH_LOGS, 'updated' );
      self.loadDatasets(function() {
        self.postDatasetFetch();
      }.bind(self));
    });
  }

  showAlertModal(message) {
    this.setState({alertModalMessage: message});
    $('#alertModal').modal('show');
  }

  componentWillMount() {
		this.lists = {
			duplicate: ["Collins LLC", "Stark, Smith and Senger", "Crist, Fahey and Lebsack", "Stehr, Rempel and Kerluke"],
			newAddition: ["Assistant Project Manager", 435, 999, 664, 387, "Team Lead", "Marketing Head"],
			updated: ["Project Operation Manager", 4947310738, "England", "Infrastructure Science", 2354083719, 9024568932]
		};
	}

  componentDidMount() {
    this.loadDatasets(function() {
      this.postDatasetFetch();
    }.bind(this));

    let self = this;



  }

  componentDidUpdate() {}

  render() {
		const self = this;
		const config = this.componentConfig;
		const djsConfig = this.djsConfig;

		const eventHandlers = {
			init: dz => this.dropzone = dz,
			success: () => { self.onFileUploadSucess(); }
		}

    let projectName = this.props.params.projectName;
    let datasetName = this.props.params.datasetName;

    let datasetStatus = 'label label-default label-md';
    if(this.state.datasets.status === 'new') {
      datasetStatus = 'label label-info label-md';
    } else if(this.state.datasets.status === 'draft') {
      datasetStatus = 'label label-primary label-md';
    } else if(this.state.datasets.status === 'published') {
      datasetStatus = 'label label-success label-md';
    }

    if (this.state.datasets.status !== "") {
      return (
        <div className='load-dataset xylo-page-heading'>
          <div className="row wrapper white-bg page-heading">
             <DatasetListHeader projectName={projectName} datasetName={datasetName} dataset={this.state.datasets} />
          </div>

          <div className="row">
            <div className='wrapper wrapper-content'>
              <div className="ibox float-e-margins">
                <div className="ibox-title">
                  <div className='row'>
                    <div className='col-sm-4'>
                      <span style={{fontSize: 22, fontWeight: 500, verticalAlign: 'sub'}}>{this.state.datasets != null ? this.state.datasets.name : ""}</span>&nbsp;
                      <span className={datasetStatus} style={{fontSize: 13, fontWeight: 400, textTransform: 'uppercase', float: 'none'}}>{this.state.datasets != null ? this.state.datasets.status : ""}</span>
                    </div>

                    <div className='col-sm-8' style={{fontSize: 18, textAlign: 'right'}}>
                      <PublishButton
                        id={this.props.params.id}
                        status={this.state.datasets.status}
                        onStatusChange={::this.updateStatus} />
                      {' '}
                      <button className='btn btn-sm btn-primary'
      	                disabled={this.state.datasets.status === 'draft' ? false : true }
      									//onClick={::this.launchFileUploadModal}
                        data-toggle="modal" data-target="#fileUploadModal">
                        Append Datasets
                      </button>
                    </div>
                  </div>

                </div>
                <div className="ibox-content">
                  <table id="example" className='display table' cellSpacing='0' width='100%' >
                    <thead>
                      <tr>
                      {
                        this.loadDatatableHeadings()
                      }
                      </tr>
                    </thead>
                    <tbody>
                    {
                      this.loadDatatableContent()
                    }
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* prompt for merge column */}
          <div className="modal inmodal" id="promptMergeColumn" tabindex="-1" role="dialog" aria-hidden="true">
            <div className="modal-dialog">
              <div className="modal-content animated bounceInRight">
              <button type="button" className="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span className="sr-only">Close</span></button>
                <form role="form" className="form-inline" onSubmit={::this.onHandleMerge}>
                  <div className="modal-body" style={{textAlign: 'left'}}>
                    <div className="form-group">
                        <h4>Enter name for new column :</h4>
                        <input type="text"
                        placeholder="Merge columns"
                        className="form-control"
                        value={this.state.mergeColumnName}
                        onChange={::this.updateMergeColumnName} />
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button className="btn btn-primary" type="submit">OK</button>
                    <button type="button" className="btn btn-white" data-dismiss="modal">CANCEL</button>
                  </div>
                </form>
              </div>
            </div>
          </div>


  				{/* prompt for split column */}
          <div className="modal inmodal" id="promptSplitColumn" tabindex="-1" role="dialog" aria-hidden="true">
            <div className="modal-dialog">
              <div className="modal-content animated bounceInRight">
              <button type="button" className="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span className="sr-only">Close</span></button>
                <form role="form" className="form-inline" onSubmit={::this.onHandleSplit}>
                  <div className="modal-body" style={{textAlign: 'left'}}>
                    <div className="form-group">
                        <h4>Enter Delimeter to split column values :</h4>
                        <input type="text"
                        placeholder="Delimiter to split"
                        className="form-control"
                        value={this.state.splitDelimeter}
                        onChange={::this.updateSplitDelimeter} />
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button className="btn btn-primary" type="submit">OK</button>
                    <button type="button" className="btn btn-white" data-dismiss="modal">CANCEL</button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* alert for merge column */}
          <div className="modal inmodal" id="alertModal" tabindex="-1" role="dialog" aria-hidden="true">
            <div className="modal-dialog">
              <div className="modal-content animated bounceInRight">
                <div className="modal-header">
                  <button type="button" className="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span className="sr-only">Close</span></button>
                  {/* <i className="fa fa-laptop modal-icon"></i>*/}
                  <h4 className="modal-title">Alert !!</h4>
                </div>
                <div className="modal-body" style={{textAlign: 'left'}}>
                  <h5>{this.state.alertModalMessage}</h5>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-primary" data-dismiss="modal">OK</button>
                </div>
              </div>
            </div>
          </div>

          {/* alert for merge column */}
          <div className="modal inmodal" id="fileUploadModal" tabindex="-1" role="dialog" aria-hidden="true">
            <div className="modal-dialog">
              <div className="modal-content animated bounceInRight">
                <div className="modal-header">
                  <button type="button" className="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span className="sr-only">Close</span></button>
                  {/* <i className="fa fa-laptop modal-icon"></i>*/}
                  <h4 className="modal-title">Append Datasets</h4>
                </div>
                <div className="modal-body" style={{textAlign: 'left'}}>
                  <DropzoneComponent config={config} eventHandlers={eventHandlers} djsConfig={djsConfig} />
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-primary" data-dismiss="modal">OK</button>
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
                    <button className="btn btn-primary" type="button" onClick={::this.submiteFileName}>OK</button>
                    <button type="button" className="btn btn-white" data-dismiss="modal">CANCEL</button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* alert for attribute analysis histogram */}
          <AttributeAnalysisModal attribAnalysisColumn = {this.state.attribAnalysisColumn} dataset={this.state.datasets}/>
        </div>
      )
    }
    else {
      return (
          <Loading message='Loading ..' />
      )
    }
  }
}

export default LoadDataset;
