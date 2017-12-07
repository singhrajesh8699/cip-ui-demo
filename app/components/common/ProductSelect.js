import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { withRouter, Link, Location } from 'react-router';
import { Route, Router, IndexRedirect, browserHistory} from 'react-router';
import _ from 'lodash';

import * as XyloFetch from './XyloFetch';
import * as serverURLs from './UrlConstants';
var baseURL = serverURLs.BASE_URL;

@withRouter
class ProductCategories extends Component {

  constructor(props) {
    super(props);

    this.state = {
      set_defaults: null,
      allow_clear: true,
      productcategories: [],
      cur_department: null,
      cur_category: null,
      cur_subcategory: null,

      department_ref: null,
      category_ref: null
    };
  }

  componentDidMount() {
    this.state.set_defaults = this.props.set_defaults;
    this.fetchProductCategories();
  }

  // setupCategories(department) {
  //   var self = this;
  //   // Category
  //   var default_category = null;
  //   var cat_data = [{'id': -1, text: ''}];
  //   if (department) {
  //     department.categories.forEach(function(cat, index) {
  //       //console.log(cat);
  //       cat_data.push({'id': cat.name, 'text': cat.name});
  //       if (index === 0) {
  //         default_category = cat.name;
  //       }
  //     });
  //   }
	//
  //   self.state.category_ref.select2('destroy').empty().select2({
  //     placeholder: { id: "-1",  text: "Select a Category" },
  //     allowClear: self.state.allow_clear,
  //     minimumResultsForSearch: Infinity,
  //     data: cat_data
  //   }).on('change.select2', function(e) {
  //     //console.log('category - change.select2');
  //     var select_val = self.state.category_ref.select2('data')[0].text;
  //     //console.log(self.state.cur_department);
  //     if (self.state.cur_department) {
  //       self.state.cur_category = _.find(self.state.cur_department.categories, function(o) { return o.name === select_val });
  //     }
  //     // Call the callback if exists
  //     if (self.props.onChange) {
  //       self.props.onChange(self.state.cur_department, self.state.cur_category);
  //     }
  //   }); // Category
	//
  //   if (self.state.set_defaults) {
  //     self.state.category_ref.val(default_category).trigger('change');
  //   }
  // }

  fetchProductCategories() {
    const self = this;

    if (self.props.set_defaults) {
      self.state.allow_clear = true;
    }

    if (!self.state.department_ref) {
      // Department
      self.state.department_ref = $(".select2_dept").select2({
        placeholder: { id: "-1", text: "Select a Department" },
        allowClear: self.state.allow_clear,
        minimumResultsForSearch: Infinity
      });
    }

    if (!self.state.category_ref) {
      // Category
      self.state.category_ref = $(".select2_cat").select2({
        placeholder: { id: "-1",  text: "Select a Category" },
        minimumResultsForSearch: Infinity,
        allowClear: self.state.allow_clear
      });
    }

    XyloFetch.getAllProductCategories()
    .then( response => {
      //console.log("API response: ");
      //console.log(response);

      self.setState({productcategories: response.payload});

      var default_department = null;
      var department_data = [{'id': -1, text: ''}];
      self.state.productcategories.forEach(function(productCategory, index) {
        //console.log(productCategory);
        if (index === 0) {
          default_department = productCategory._id;
        }
        department_data.push({'id': productCategory._id, 'text': productCategory.name});
      });

      // Reinit
      self.state.department_ref.select2('destroy').empty().select2({
        placeholder: { id: "-1",  text: "Select a Department" },
        allowClear: self.state.allow_clear,
        minimumResultsForSearch: Infinity,
        data: department_data
      })

      self.state.department_ref.on('change.select2', function(e) {
        var select_val = self.state.department_ref.select2('data')[0].text;
        var department = _.find(self.state.productcategories, function(o) { return o.name === select_val });
        self.state.cur_department = department;
        if (self.props.onChange) {
          self.props.onChange(self.state.cur_department, self.state.cur_category);
        }
        // self.setupCategories(department);

      }); // Department - onChange

      // Now trigger ...
      if (self.state.set_defaults) {
        self.state.department_ref.val(default_department).trigger('change');
      }

    }); // Fetch
  }

  render() {
    return (
        <div>
          <div className="row">
            <div className={this.props.divRowClass1}>
              <h4>Select Product Filters</h4>
            </div>
          </div>

          <div className="row">
              <div className={this.props.divRowClass1}>
                <select className="select2_dept form-control" />
             </div>
          </div>
        </div>
    )
  }
}


export default ProductCategories;
