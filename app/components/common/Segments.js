import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { withRouter, Link, Location } from 'react-router';
import { Route, Router, IndexRedirect, browserHistory} from 'react-router';
import _ from 'lodash';

import * as XyloFetch from './XyloFetch';
import * as serverURLs from './UrlConstants';
var baseURL = serverURLs.BASE_URL;

@withRouter
export class Segments extends Component {

  constructor(props) {
    super(props);

    this.state = {
      segments: [],

      segment_ref: null
    };
  }

  componentDidMount() {
    this.fetchSegments();
  }

  fetchSegments() {
    const self = this;
    XyloFetch.getSchemes()
    .then( response => {
      console.log("API response: ");
      console.log(response);
      self.setState({segments: response.payload});

      var segments_data = [];
      self.state.segments.forEach(function(segment) {
        segments_data.push({'id': segment._id, 'text': segment.name});
      });

      //console.log(segments_data);

      self.state.segment_ref = $(".select2_segments").select2({
        data: segments_data,
        minimumResultsForSearch: -1
      }).on('change.select2', function(e) {
         if(self.props.onChange) {
            var selected_id = self.state.segment_ref.select2('data')[0].id;
            var selected_val = self.state.segment_ref.select2('data')[0].text;
            self.props.onChange(selected_id, selected_val);
        }
      });

      self.state.segment_ref.val(self.props.initial_segment).trigger('change');

    });
  }

  render() {
    return (
      <div>
        <div className="row">
          <div style={{paddingLeft: 15}}>
            <h4>Select a Scheme</h4>
          </div>
        </div>

        <div>
          <select className="select2_segments form-control m-b" />
        </div>
      </div>
    )
  }

}


@withRouter
export class SegmentClusters extends Component {

  constructor(props) {
    super(props);

    this.state = {
      segments: [],
      segmentsData: [],

      segment_ref: null,
      cluster_ref: null
    };
  }

  componentDidMount() {
    this.fetchSegments();
  }

  refreshClusters(segment, selected_cluster_id) {
    let self = this;
    var clusters_data = [];
    segment.clusters.forEach(function(cluster) {
      //console.log(cat);
      clusters_data.push({'id': cluster._id, 'text': cluster.name});
    });

    self.state.cluster_ref.select2('destroy').empty().select2({
      minimumResultsForSearch: -1,
      data: clusters_data
    });
    self.state.cluster_ref.val(selected_cluster_id).trigger('change');

    self.state.cluster_ref.on('change.select2', function(e) {
      if(self.props.onSegmentChange) {
        var selected_id = self.state.cluster_ref.select2('data')[0].id;
        var selected_val = self.state.cluster_ref.select2('data')[0].text;
        self.props.onSegmentChange(selected_id, selected_val);
      }
    });


  }

  fetchSegments() {
    const self = this;

    self.state.cluster_ref = $(".select2_clusters").select2({minimumResultsForSearch: -1});

    XyloFetch.getSchemes()
    .then( response => {
      console.log("API response: ");
      console.log(response);
      self.setState({segments: response.payload});

      var segments_data = [];
      var selectedSegment = null;
      self.state.segments.forEach(function(segment) {
        segments_data.push({'id': segment._id, 'text': segment.name});
        segment.clusters.forEach(function(cluster) {
          if(cluster._id === self.props.init_cluster_id) {
            selectedSegment = segment;
          }
        })
      });

      this.setState({segmentsData: segments_data});
      self.refreshClusters(selectedSegment, self.props.init_cluster_id);

      self.state.segment_ref = $(".select2_segments").select2({
        data: segments_data,
        minimumResultsForSearch: -1
      });

      self.state.segment_ref.val(selectedSegment._id).trigger('change');

      self.state.segment_ref.on('change.select2', function(e) {
        if(self.props.onSegmentChange) {
          var select_val = self.state.segment_ref.select2('data')[0].text;
          var segment = _.find(self.state.segments, function(o) { return o.name === select_val });
          self.refreshClusters(segment, segment.clusters[0]._id);
          self.props.onSegmentChange(segment.clusters[0]._id, segment.clusters[0].name);
        }
      });

    });
  }

  render() {
    return (
      <div>
        <div className="row">
          <div className={this.props.divRowClass1} style={{paddingLeft: 15}}>
            <h4>Select a Scheme</h4>
          </div>
          <div className={this.props.divRowClass2} style={{paddingLeft: 15}}>
            <h4>Select a Cluster</h4>
          </div>
        </div>

        <div className="row">
          <div className={this.props.divRowClass1}>
            <select className="select2_segments form-control" />
         </div>
         <div className={this.props.divRowClass2}>
            <select className="select2_clusters form-control" />
         </div>
        </div>
      </div>
    )
  }
  
}
