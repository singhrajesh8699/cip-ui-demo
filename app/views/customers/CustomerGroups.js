import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { withRouter } from 'react-router';
import { Route, Router, IndexRedirect, Link, browserHistory} from 'react-router';
import Moment from 'moment';

import Identicons from 'identicons-react';
import * as XyloFetch from '../../components/common/XyloFetch';

@withRouter
class CustomerGroupsHeader extends Component {
  render() {
    return (
      <div className="col-lg-10">
        <div className='xylo-page-header'>
          <h2>Customer Groups</h2>
          <ol className="breadcrumb">
              <li>
                 <Link to="/dataprep/dashboard">Customers</Link>
              </li>
              <li>
                  <a><b>Groups</b></a>
              </li>
          </ol>
        </div>
      </div>
    );
  }
}

class CustomerCount extends Component{
  render(){
    let sum = 0;
    if (this.props.data) {
      this.props.data.map(function(group, j){
          sum += group.count;
      })
    }
    return (<div>{sum}</div>);
  }
}

@withRouter
class CustomerGroupsMenu extends Component {

  render() {
    return (
      <div className="col-lg-12">
        <div className="wrapper wrapper-content">
          <div className="ibox">
            <div className="ibox-title">
              <h5>All Customer Groups</h5>
              <div className="ibox-tools">
                  <Link to="/customers/search/new" className="btn btn-primary btn-md">Create Customer Group</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
/* = End of Project Component = */
/*=============================================<<<<<*/


class CustomerGroupsTiles extends Component {

    constructor(){
      super();
      this.getAllCustomerGroup = this.getAllCustomerGroup.bind(this);
      this.fetchCustomerGroups = this.fetchCustomerGroups.bind(this);
    }

    componentWillMount() {
        this.setState({customerGroups: []});
    }

  componentDidMount() {
      this.fetchCustomerGroups();
  }

  fetchCustomerGroups() {
      XyloFetch.getCustomerGroups()
      .then( response => {
        this.getAllCustomerGroup(response.payload);
      });
  }

  getAllCustomerGroup(array){
    XyloFetch.queryC360({})
        .then(response => {
          array.unshift({_id: "all", name: "All Customers", description: "This is a group of all customers", result: {groupByCount: response.payload.groupByCount}});
          this.setState({customerGroups: array});
        });
  }
  render() {
  let editIdURL = '/customers/search/';
  let sum = 0;
    return (
        <div className="col-lg-12">
          <div className="wrapper wrapper-content">
            <div className="ibox">
                <div className="row">
                  {
                    this.state.customerGroups.map(function(object, i){
                      return (
                        <div className="col-md-3" key={"customgroup" + i}>
                          <div className="ibox">
                            <div className="ibox-content product-box">
                               <div className="product-desc">
                                  <span className="product-price-top-left">
                                    <CustomerCount data={object.result.groupByCount}/>
                                  </span>
                                  <small className="text-muted">Name</small>
                                  <a className="product-name">{object.name}</a>
                                  <div className="small m-t-xs">
                                     {object.description}
                                  </div>
                                  <div className="m-t text-right">
                                    <div className="btn btn-xs btn-outline btn-primary">
                                    <Link to={editIdURL + object._id} className='text-primary'>
                                      Info <i className="fa fa-long-arrow-right"></i>
                                    </Link>
                                    </div>
                                  </div>
                               </div>
                            </div>
                         </div>
                      </div>
                      );
                    })
                  }
                 </div>
            </div>
          </div>
        </div>

      )
  }
}
/* = End of Project Component = */
/*=============================================<<<<<*/



class CustomerGroups extends Component {
  constructor(props) {
    super(props);

    this.state = {
      customerGroups: []
    };
  }

  componentWillMount() {
        //const sessionManager = SessionManager.instance;
        //if(!sessionManager.isUserLoggedIn()) {
        //  this.props.router.push('/');
        //}
    }


  render() {
    return (
      <div className='xylo-page-heading'>

         <div className="row wrapper white-bg page-heading">
            <CustomerGroupsHeader />
         </div>

          <div className="wrapper wrapper-content xylo-shift-top">
            <div className="row">
              <CustomerGroupsMenu />
            </div>
             <div className="row">
              <CustomerGroupsTiles />
            </div>
          </div>


      </div>
    )
  }
}

export default CustomerGroups;
