import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { withRouter } from 'react-router';
import { Route, Router, IndexRedirect, Link, browserHistory} from 'react-router';
import Moment from 'moment';

import * as XyloFetch from '../../components/common/XyloFetch';

import Loading from '../../components/common/Loading';

class ProjectListHeader extends Component {
  render() {
    return (
      <div className="col-lg-10">
        <div className='xylo-page-header'>
          <h2>Projects</h2>
          <ol className="breadcrumb">
              <li>
                 <Link to="/dataprep/dashboard">Data Prep</Link>
              </li>
              <li>
                  <a><b>Projects</b></a>
              </li>
          </ol>
        </div>
      </div>
    );
  }
}

/*=============================================>>>>>
= Project Component =
===============================================>>>>>*/
class ProjectList extends Component {
  state={
    project: {}
  }

	componentWillMount() {
		this.setState({projects: []});
	}

  componentDidMount() {
      this.fetchProjectList();
  }

  fetchProjectList() {
  	console.log("in fetchProjectList");
      const self = this;
      XyloFetch.getAllProjects()
      .then( response => {
	      console.log("API response: ");
	      console.log(response);
        self.setState({projects: response.payload});
      });
  }

  onDeleteClick(project) {
    this.setState({project: project});
    $('#deleteProjectModal').modal('show');
  }

  render() {
    if (this.state.projects.length !== 0) {
      return (
        <div className="col-lg-12">
          <div className="wrapper wrapper-content">
            <div className="ibox">
              <div className="ibox-title">
                <h5>All available Projects</h5>
                <div className="ibox-tools">
                    <Link to="/dataprep/createproject" className="btn btn-primary btn-md">Create Project</Link>
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
                        this.state.projects.map((project) => {
  												//console.log(project);
                          let projectIdUrl = '/dataprep/editproject/'+project._id;
                          return (
                            <tr key={project._id}>
                              <td>
                                <span className="project-title">{project.name}</span>
                                <br/>
                                <small>{Moment(project.createdAt).format('MMMM Do YYYY, h:mm a')}</small>
                              </td>
  														<td className="project-title">
                                {project.datasets.length}
                                <br/>
                                <small>datasets</small>
                              </td>
                              <td className="project-actions">
                                <button type='button' className="btn btn-white btn-md">
                                  <Link to={projectIdUrl} className='text-primary'>
                                    <i className="fa fa-pencil"></i> Edit
                                  </Link>
                                </button>&nbsp;
                                <button type="button"
                                className="btn btn-white btn-md"
                                onClick={::this.onDeleteClick.bind(this, project)}>
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
            <DeleteProjectModal project={this.state.project} deleteCallback={::this.fetchProjectList} />
         </div>
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
/* = End of Project Component = */
/*=============================================<<<<<*/

/*=============================================>>>>>
= deleteProjectModal =
===============================================>>>>>*/
class DeleteProjectModal extends Component {
  state = {
    project: {}
  }

  conponentWillMount() {
    this.setState({project: this.props.project});
  }

  componentWillReceiveProps(props) {
    this.setState({project: props.project});
  }

  deleteproject(project) {
    let projectId = project._id;
        let self = this;
    XyloFetch.deleteProject(projectId)
    .then(response => {
      console.log(response);
      $('#deleteProjectModal').modal('hide');
      self.props.deleteCallback();
    });
  }

  render() {
    const self = this;
    return (
      <div className="modal inmodal" id="deleteProjectModal" tabindex="-1" role="dialog" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content animated bounceInRight">
            <div className="modal-header">
              <button type="button" className="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span className="sr-only">Close</span></button>
              {/* <i className="fa fa-laptop modal-icon"></i> */}
              <h4 className="modal-title">Delete Project</h4>
            </div>
            <div className="modal-body" style={{textAlign: 'left'}}>
              <p>Are you sure you want to delete "{this.state.project.name}" ?</p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-white" data-dismiss="modal">Cancel</button>
              <button type="button" className="btn btn-primary" onClick={::this.deleteproject.bind(this, this.state.project)}>Delete</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
/*= End of deleteProjectModal =*/
/*=============================================<<<<<*/


class Projects extends Component {
  constructor(props) {
    super(props);
    this.state = {
      projects: []
    };
  }

  componentWillMount() {}

  render() {
  
    return (
      <div className='xylo-page-heading'>

         <div className="row wrapper white-bg page-heading">
            <ProjectListHeader />
         </div>

        <div className="row">
          <ProjectList />
        </div>

      </div>
    )
   
  }
}

export default Projects;



