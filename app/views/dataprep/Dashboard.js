import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import d3 from '../../../public/vendor/d3/d3';
import c3 from '../../../public/vendor/c3/c3.min.js';

import 'datatables.net/js/jquery.dataTables.js';
import "datatables.net-buttons/js/dataTables.buttons.js";
import "datatables.net-buttons/js/buttons.html5.js";
import "datatables.net-buttons/js/buttons.colVis.js";
import "datatables.net-select/js/dataTables.select.js";
import "datatables.net-bs/js/dataTables.bootstrap.js";

import * as venn from 'venn.js';
import "../../../node_modules/datatables/media/css/jquery.dataTables.css";
import "../../../node_modules/datatables.net-buttons-bs/css/buttons.bootstrap.css";
import "../../../node_modules/datatables.net-select-bs/css/select.bootstrap.css";
import "../../../node_modules/datatables.net-bs/css/dataTables.bootstrap.css";
import "../../../node_modules/datatables.net-dt/css/jquery.dataTables.css";
import "../../../node_modules/datatables.net-buttons-dt/css/buttons.dataTables.css";

import '../../../public/vendor/datatables/pdfmake.min.js';
import '../../../public/vendor/datatables/vfs_fonts.js';

import * as XyloFetch from '../../components/common/XyloFetch';
import * as UrlConstants from '../../components/common/UrlConstants';
import SessionManager from '../../components/common/SessionManager';
/*=============================================>>>>>
= Header counters =
===============================================>>>>>*/
class HeaderCounters extends Component {
  render() {
    return (
      <div className='xylo-dashboard-counters'>
        <div className="col-md-3">
          <div className="ibox float-e-margins">
            <div className="ibox-title">
              <span className='fa fa-list pull-right' style={{fontSize: 18}}></span>
              <h5>Categories</h5>
            </div>
            <div className="ibox-content">
              <h2 className="no-margins">{this.props.sourcesCount}</h2>
              <div className="stat-percent font-bold text-success"></div>
              <small></small>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="ibox float-e-margins">
            <div className="ibox-title">
              <span className='fa fa-gear pull-right' style={{fontSize: 18}}></span>
              <h5>Attributes</h5>
            </div>
            <div className="ibox-content">
              <h2 className="no-margins">{this.props.attributesCount}</h2>
              <div className="stat-percent font-bold text-success"></div>
              <small></small>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="ibox float-e-margins">
            <div className="ibox-title">
              <span className='fa fa-dot-circle-o pull-right' style={{fontSize: 18}}></span>
              <h5>Records</h5>
            </div>
            <div className="ibox-content">
              <h2 className="no-margins">{this.props.recordsCount}</h2>
              <div className="stat-percent font-bold text-success"></div>
              <small></small>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="ibox float-e-margins">
            <div className="ibox-title">
              <span className='fa fa-file-text-o pull-right' style={{fontSize: 18}}></span>
              <h5>Projects</h5>
            </div>
            <div className="ibox-content">
              <h2 className="no-margins">{this.props.projectsCount}</h2>
              <div className="stat-percent font-bold text-success"></div>
              <small></small>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
/*= End of Header counters =*/
/*=============================================<<<<<*/


/*=============================================>>>>>
= Treemap component =
===============================================>>>>>*/
class XyloChartTreeMap extends React.Component {

  componentDidMount() {
    this.renderChart();
    $(window).resize(function () {
      this.preRenderChart();
    }.bind(this));
  }

  componentDidUpdate() {
    this.preRenderChart();
  }

  preRenderChart() {
    let div = document.getElementById("chart");
    if(div) {
      //div.removeChild(div.childNodes[1]);
      div.removeChild(div.childNodes[0]);
      this.renderChart();
    }
  }

  renderChart() {
    /* Creating data for treemap */
    let treemapData = [];
    this.props.treemapSource.forEach(function(edge) {
      edge.attributes.forEach(function(attrib) {
        attrib.metrics.forEach(function(metric) {
          treemapData.push({region: edge.name, subregion: attrib.name, key: metric.name, value: metric.value});
        });
      });
    });

    window.addEventListener('message', function(e) {
      var opts = e.data.opts,
          data = e.data.data;

      return main(opts, data);
    });
    var defaults = {
      margin: {top: 24, right: 0, bottom: 0, left: 0},
      rootname: "TOP",
      format: ",d",
      title: "",
      width: $('.tree-map-main-container').width(),
      height: 650,
      //height: $('.map-container-col-1').height() - 100
    };

    function main(o, data) {
      var root,
      opts = $.extend(true, {}, defaults, o),
      formatNumber = d3.format(opts.format),
      rname = opts.rootname,
      margin = opts.margin,
      theight = 36 + 16;

      $('#chart').width(opts.width).height(opts.height);
      var width = opts.width - margin.left - margin.right,
      height = opts.height - margin.top - margin.bottom - theight,
      transitioning;

      var color = d3.scale.category20c();

      var x = d3.scale.linear()
      .domain([0, width])
      .range([0, width]);

      var y = d3.scale.linear()
      .domain([0, height])
      .range([0, height]);

      var treemap = d3.layout.treemap()
      .children(function(d, depth) { return depth ? null : d._children; })
      .sort(function(a, b) { return a.value - b.value; })
      .ratio(height / width * 0.5 * (1 + Math.sqrt(5)))
      .round(false);


      var svg = d3.select("#chart").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.bottom + margin.top)
      .style("margin-left", -margin.left + "px")
      .style("margin.right", -margin.right + "px")
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
      .style("shape-rendering", "crispEdges");

      var grandparent = svg.append("g")
      .attr("class", "grandparent");

      grandparent.append("rect")
      .attr("y", -margin.top)
      .attr("width", width)
      .attr("height", margin.top);

      grandparent.append("text")
      .attr("x", 6)
      .attr("y", 6 - margin.top)
      .attr("dy", ".75em");

      if (opts.title) {
        $("#chart").prepend("<p class='title'>" + opts.title + "</p>");
      }
      if (data instanceof Array) {
        root = { key: rname, values: data };
      } else {
        root = data;
      }

      initialize(root);
      accumulate(root);
      layout(root);
      //console.log(root);
      display(root);

      if (window.parent !== window) {
        var myheight = document.documentElement.scrollHeight || document.body.scrollHeight;
        window.parent.postMessage({height: myheight}, '*');
      }

      function initialize(root) {
        root.x = root.y = 0;
        root.dx = width;
        root.dy = height;
        root.depth = 0;
        }

      // Aggregate the values for internal nodes. This is normally done by the
      // treemap layout, but not here because of our custom implementation.
      // We also take a snapshot of the original children (_children) to avoid
      // the children being overwritten when when layout is computed.
      function accumulate(d) {
        return (d._children = d.values)
          ? d.value = d.values.reduce(function(p, v) { return p + accumulate(v); }, 0)
          : d.value;
      }

      // Compute the treemap layout recursively such that each group of siblings
      // uses the same size (1×1) rather than the dimensions of the parent cell.
      // This optimizes the layout for the current zoom state. Note that a wrapper
      // object is created for the parent node for each group of siblings so that
      // the parent’s dimensions are not discarded as we recurse. Since each group
      // of sibling was laid out in 1×1, we must rescale to fit using absolute
      // coordinates. This lets us use a viewport to zoom.
      function layout(d) {
        if (d._children) {
          treemap.nodes({_children: d._children});
          d._children.forEach(function(c) {
            c.x = d.x + c.x * d.dx;
            c.y = d.y + c.y * d.dy;
            c.dx *= d.dx;
            c.dy *= d.dy;
            c.parent = d;
            layout(c);
          });
        }
      }

      function display(d) {
        grandparent
          .datum(d.parent)
          .on("click", transition)
          .select("text")
          .text(name(d));

        var g1 = svg.insert("g", ".grandparent")
          .datum(d)
          .attr("class", "depth");

        var g = g1.selectAll("g")
          .data(d._children)
          .enter().append("g");

        g.filter(function(d) { return d._children; })
          .classed("children", true)
          .on("click", transition);

        var children = g.selectAll(".child")
          .data(function(d) { return d._children || [d]; })
          .enter().append("g");

        children.append("rect")
          .attr("class", "child")
          .call(rect)
          .append("title")
          .text(function(d) { return d.key + " (" + formatNumber(d.value) + ")"; });
        children.append("text")
          .attr("class", "ctext")
          .text(function(d) { return d.key; })
          .call(text2);

        g.append("rect")
          .attr("class", "parent")
          .call(rect);

        var t = g.append("text")
          .attr("class", "ptext")
          .attr("dy", ".75em")

        t.append("tspan")
          .text(function(d) { return d.key; });
        t.append("tspan")
          .attr("dy", "1.0em")
          .text(function(d) { return formatNumber(d.value); });
          t.call(text);

        g.selectAll("rect")
          .style("fill", function(d) { return color(d.key); });

        function transition(d) {
          if (transitioning || !d) return;
          transitioning = true;

          var g2 = display(d),
            t1 = g1.transition().duration(750),
            t2 = g2.transition().duration(750);

          // Update the domain only after entering new elements.
          x.domain([d.x, d.x + d.dx]);
          y.domain([d.y, d.y + d.dy]);

          // Enable anti-aliasing during the transition.
          svg.style("shape-rendering", null);

          // Draw child nodes on top of parent nodes.
          svg.selectAll(".depth").sort(function(a, b) { return a.depth - b.depth; });

          // Fade-in entering text.
          g2.selectAll("text").style("fill-opacity", 0);

          // Transition to the new view.
          t1.selectAll(".ptext").call(text).style("fill-opacity", 0);
          t1.selectAll(".ctext").call(text2).style("fill-opacity", 0);
          t2.selectAll(".ptext").call(text).style("fill-opacity", 1);
          t2.selectAll(".ctext").call(text2).style("fill-opacity", 1);
          t1.selectAll("rect").call(rect);
          t2.selectAll("rect").call(rect);

          // Remove the old node when the transition is finished.
          t1.remove().each("end", function() {
            svg.style("shape-rendering", "crispEdges");
            transitioning = false;
            });
          }

          return g;
        }

        function text(text) {
          text.selectAll("tspan")
            .attr("x", function(d) { return x(d.x) + 6; })
          text.attr("x", function(d) { return x(d.x) + 6; })
            .attr("y", function(d) { return y(d.y) + 6; })
            .style("opacity", function(d) { return this.getComputedTextLength() < x(d.x + d.dx) - x(d.x) ? 1 : 0; });
        }

        function text2(text) {
          text.attr("x", function(d) { return x(d.x + d.dx) - this.getComputedTextLength() - 6; })
            .attr("y", function(d) { return y(d.y + d.dy) - 6; })
             .style("opacity", function(d) { return this.getComputedTextLength() < x(d.x + d.dx) - x(d.x) ? 1 : 0; });
            // .style("opacity", function(d) { return 0; });
            {/* .style("opacity", function(d) { return this.getComputedTextLength() < x(d.x + d.dx) - x(d.x) ? 1 : 0; }); */}
        }

        function rect(rect) {
          rect.attr("x", function(d) { return x(d.x); })
            .attr("y", function(d) { return y(d.y); })
            .attr("width", function(d) { return x(d.x + d.dx) - x(d.x); })
            .attr("height", function(d) { return y(d.y + d.dy) - y(d.y); });
        }

        function name(d) {
          return d.parent
            ? name(d.parent) + " / " + d.key + " (" + formatNumber(d.value) + ")"
            : d.key + " (" + formatNumber(d.value) + ")";
        }
      }

        // if (window.location.hash === "") {
        //     d3.json("/country.json", function(err, res) {
        //         if (!err) {
        //             //console.log(res);
        //             var data = d3.nest().key(function(d) { return d.region; }).key(function(d) { return d.subregion; }).entries(res);
        //             main({title: "Source Records"}, {key: "Source Records", values: data});
        //         }
        //     });
        // }
      var data = d3.nest().key(function(d) { return d.region; }).key(function(d) { return d.subregion; }).entries(treemapData);
      main({title: ''}, {key: this.props.treemapHeading, values: data});
    } //componentDidMount END

  render() {
    return (
        <div style={{marginTop: 50}}>
          <div className="tree-map" id={this.props.id}></div>
        </div>
    );
  }
}
/*= End of Treemap component =*/
/*=============================================<<<<<*/

/*=============================================>>>>>
= Sources Venn diagram =
===============================================>>>>>*/

class SourcesVennDiagram extends Component {
  state = {
    setData: [
      {
        set: ['CRM_DB'],
        value: 249111
      },
      {
        set: ['BILLING_DB'],
        value: 101982
      },
      {
        set: ['CAMPAIGN_DB'],
        value: 187818
      },
      {
        set: ['CRM_DB', 'BILLING_DB'],
        value: 35826
      },
      {
        set: ['CRM_DB', 'CAMPAIGN_DB'],
        value: 82576
      },
      {
        set: ['BILLING_DB', 'CAMPAIGN_DB'],
        value: 32898
      },
      {
        set: ['CRM_DB', 'BILLING_DB', 'CAMPAIGN_DB'],
        value: 23509
      }
    ],
    sets :[]
  }

  componentWillMount() {
    // var setCollection = [];
    // var finalData = [];
    // // Create the final data for venn diagram from the raw data.
    // this.state.setData.forEach(function(item) {
    //   if(item.set.length === 1) {
    //     var currentItemLabel = item.set[0];
    //     setCollection.push(currentItemLabel);
    //     var setIndex = setCollection.indexOf(currentItemLabel);
    //     finalData.push({sets: [setIndex], label: currentItemLabel, size: item.value});
    //   } else {
    //     var setIds = [];
    //     item.set.forEach(function(setname) {
    //       setIds.push(setCollection.indexOf(setname));
    //     });
    //     finalData.push({sets: setIds, size: item.value});
    //   }
    // });
    // this.setState({sets: finalData});
  }

  componentDidMount() {
		// this.renderChart();
  }

	componentWillReceiveProps(props) {
		console.log("venn data");
		console.log(props.data);
		const self = this;
		this.generateData(props.data);
		setTimeout(function(){self.renderChart()}, 500);
		// this.renderChart();
	}

	generateData(data) {
		var setCollection = [];
    var finalData = [];
		//Sort data to bring the records with single source on top
		data.sort(function(intersection1, intersection2) {
			return intersection1.sources.length > intersection2.sources.length;
		});

    // Create the final data for venn diagram from the raw data.
    data.forEach(function(item) {
      if(item.sources.length === 1) {
        var currentItemLabel = item.sources[0];
        setCollection.push(currentItemLabel);
        var setIndex = setCollection.indexOf(currentItemLabel);
        finalData.push({sets: [setIndex], label: currentItemLabel, size: item.count});
      } else {
        var setIds = [];
        item.sources.forEach(function(setname) {
          setIds.push(setCollection.indexOf(setname));
        });
        finalData.push({sets: setIds, size: item.count});
      }
    });

		console.log("final venn data");
		console.log(finalData);
    this.setState({sets: finalData, sources: setCollection});
	}

	renderChart() {
		var self = this;
    var vennWidth = $(".venn-container").width();
    console.log("vennWidth: "+vennWidth);
    var chart = venn.VennDiagram().width(vennWidth);
    var div = d3.select("#venn");
    d3.select("#venn").datum(this.state.sets).call(chart);

    // add a tooltip
    var tooltip = d3.select("body").append("div")
    .attr("class", "venntooltip");

    div.selectAll("path")
    .style("stroke-opacity", 0)
    .style("stroke", "#fff")
    .style("stroke-width", 3)

    // add listeners to all the groups to display tooltip on mouseover
    div.selectAll("g")
    .on("mouseover", function(d, i) {
      // sort all the areas relative to the current item
      venn.sortAreas(div, d);

      // Display a tooltip with the current size and the interected labels
      tooltip.transition().duration(400).style("opacity", .9);
      if(d.sets.length === 1) {
        tooltip.text(d.label + ' : ' + d.size + " records");
      } else {
        var currentSetLabel = 'Common Records in';
        d.sets.forEach(function(item, i) {
          if(i === 0) {
            currentSetLabel += ' ' + self.state.sets[item].label;
          } else {
            currentSetLabel += ', ' + self.state.sets[item].label;
          }

        });
        currentSetLabel += ' : ' + d.size;
        tooltip.text(currentSetLabel);
      }


      // highlight the current path
      var selection = d3.select(this).transition("tooltip").duration(400);
      selection.select("path")
      .style("stroke-width", 3)
      .style("fill-opacity", d.sets.length == 1 ? .4 : .1)
      .style("stroke-opacity", 1);
    })
    .on("click", function(d, i) {
      console.log(d);
      console.log(i);
    })
    .on("mousemove", function() {
      tooltip.style("left", (d3.event.pageX) + "px")
      .style("top", (d3.event.pageY - 28) + "px");
    })

    .on("mouseout", function(d, i) {
      tooltip.transition().duration(400).style("opacity", 0);
      var selection = d3.select(this).transition("tooltip").duration(400);
      selection.select("path")
      .style("stroke-width", 0)
      .style("fill-opacity", d.sets.length == 1 ? .25 : .0)
      .style("stroke-opacity", 0);
    });
	}

	render() {
		const venDig = UrlConstants.BASE_URL + '/logos/venn.jpg';
		const self = this;
		return (
      <div>
    		<div className="col-lg-12" style={{textAlign:"center", marginTop: 20}}>
          <div className="row">
            <div className="col-xs-12 venn-container">
              <div id="venn" height="500"></div>
            </div>

          </div>
    		</div>
      </div>
    )
	}
}

/*= End of Sources Venn diagram =*/
/*=============================================<<<<<*/


/*=============================================>>>>>
= Project charts =
===============================================>>>>>*/

class ProjectCharts extends Component {
	state = {
		colors: ["#23BFAA",
						 "#8FAABB",
						 "#FAA586",
						 "#EC5657",
						 "#4661EE",
						 "#B08BEB",
						 "#3EA0DD",
						 "#F5A52A",
						 "#1BCDD1",
						 "#EB8CC6"]
	}



	componentDidMount() {
		const self = this;
		var chartColors = {};
		var recordColumns = [];
		var attribColumns = [];
		this.props.projects.forEach(function(project, index) {
			const projectName = project.name;
			var recordCount = 0;
			var attribCount = 0;
			project.datasets.forEach(function(dataset) {
				attribCount += dataset.attributes.length;
				recordCount += dataset.records.length;
			});

			recordColumns.push([projectName, recordCount]);
			attribColumns.push([projectName, attribCount]);
			chartColors[projectName] = self.state.colors[index];
		});




		c3.generate({
                bindto: '#project_records',
                data:{
                    columns: recordColumns,
                    colors:chartColors,
                    type : 'pie'
                }
            });

		c3.generate({
                bindto: '#project_attributes',
                data:{
                    columns: attribColumns,
                    colors:chartColors,
                    type : 'pie'
                }
            });
	}

	render() {
		return (
      <div>
  			<div className="col-lg-12" style={{marginTop: 20}}>
  				<div className="col-lg-6">
  					<div className="col-lg-12" style={{textAlign: "center", marginTop: 20}}> <h2>Records Count</h2> </div>
  					<div id="project_records" className="col-lg-12" style={{height:400}}> </div>
  				</div>
  				<div className="col-lg-6">
  					<div className="col-lg-12" style={{textAlign: "center", marginTop: 20}}> <h2>Attributes Count</h2> </div>
  					<div id="project_attributes" className="col-lg-12" style={{height:400}}> </div>
  				</div>
      	</div>
       </div>
      )
	}
}

/*= End of Project charts =*/
/*=============================================<<<<<*/

/*=============================================>>>>>
= SourcesTable component =
===============================================>>>>>*/
class SourcesTable extends Component {
  /* Function is called when the component is rendered in the DOM */
  componentDidMount() {
    this.initHomedataTable();
  }

  /* Function is called before the table is updated
  * Here we destroy the earlier datatable.
  */
  componentWillUpdate() {
    this.destroyHomedataTable();
  }

  /* Function is called when the component is updated
  * when the sources/categories view is toggled. So initialise datatable again
  */
  componentDidUpdate() {
    this.initHomedataTable();
  }

  /* Function to initialise the Datatable */
  initHomedataTable() {
    const sessionManager = SessionManager.instance;
    var tenant = sessionManager.getUser().tenant.name;
    var fileName = tenant+'_category';
    $('#homeDatatable')
      .addClass('nowrap')
      .DataTable({
        pageLength: 100,
        responsive: true,
        //dom: '<"html5buttons"B>lTfgitp',
        dom: '<"html5buttons"B>Tgt',
        buttons: [],
        "columnDefs": [
           { className: "dt-body-left", "targets": "_all" }
        ]
        //buttons: [
            //{extend: 'copy'},
            //{extend: 'csv', title: fileName, text: 'Download as CSV'},
            // {extend: 'excel', title: 'ExampleFile'},
            //{extend: 'pdfHtml5', title: fileName, text: 'Download as PDF'}
            // {extend: 'print',
            //  customize: function (win){
            //   console.log('here');
            //   $(win.document.body).addClass('white-bg');
            //   $(win.document.body).css('font-size', '10px');

            //   $(win.document.body).find('table')
            //     .addClass('compact')
            //     .css('font-size', 'inherit');
            // }
            //}
        //]
      });

    //dataTable();
    //var dataHealth_tableTools = new $.fn.dataTable.TableTools(dataHealth_table, {
    //    pageLength: 100,
    //    responsive: true,
    //    dom: '<"html5buttons"B>Tgt',
    //    buttons: [
    //        {extend: 'csv', title: fileName, text: 'Download as CSV'},
    //        {extend: 'pdfHtml5', title: fileName, text: 'Download as PDF'}
    //    ]
    //});
    //$(dataHealth_tableTools.fnContainer()).insertAfter('div.info');

  }

  /* Function to destroy the home DataTable */
  destroyHomedataTable() {
    $('#homeDatatable').DataTable().destroy();
  }

  /* Function to render table headingd depending upon the view selected. */
  renderHomeTableHeadings() {
    if(this.props.view == 'sourceView') {
      return (
        <tr>
          <th>Name</th>
          <th>Type</th>
          <th>Records</th>
          <th>Completeness</th>
          <th>Uniqueness</th>
          <th>Cardinality</th>
        </tr>
      );
    } else if(this.props.view == 'categoryView') {
      return (
        <tr>
          <th>Name</th>
          <th>Records</th>
          <th>Completeness</th>
          <th>Uniqueness</th>
          <th>Cardinality</th>
        </tr>
      );
    }
    else if(this.props.view == 'projectView') {
      return (
        <tr>
          <th>Name</th>
          <th>Description</th>
          <th>Records</th>
          <th>Attributes</th>
        </tr>
      );
    }
  }

  /* Function to render table contents depending upon the view selected. */
  renderHomeTableBody() {
    if(this.props.view === 'sourceView') {
      return this.props.tableSource.map(function(item){
        const completeness = parseInt(item.completeness);
        const uniqueness = parseInt(item.uniqueness);
        const cardinality = parseInt(item.cardinality);
        return (
          <tr key = {item._id}>
            <td>{item.name}</td>
            <td>{item.type}</td>
            <td>{item.numRecords}</td>
            <td>{completeness}%</td>
            <td>{uniqueness}%</td>
            <td>{cardinality}</td>
          </tr>
        );
      });
    } else if(this.props.view === 'categoryView') {
      return this.props.tableSource.map(function(item){
        return (
          <tr key = {item._id}>
            <td>{item.name}</td>
            <td>{item.numRecords}</td>
            <td>{item.completeness}%</td>
            <td>{item.uniqueness}%</td>
            <td>{item.cardinality}</td>
          </tr>
        );
      });
    }
    else if(this.props.view === 'projectView') {
      return this.props.tableSource.map(function(item){

        var recordCount = 0;
        var attribCount = 0;
        item.datasets.forEach(function(dataset) {
          attribCount += dataset.attributes.length;
          recordCount += dataset.records.length;
        });

        return (
          <tr key = {item._id}>
            <td>{item.name}</td>
            <td>{item.description}</td>
            <td>{recordCount}</td>
            <td>{attribCount}</td>
          </tr>
        );
      });
    }
  }

  render() {
    return (
        <div className="table-responsive">
          <table id='homeDatatable' className="table table-striped table-bordered table-hover dataTables-example" >
            <thead>
            {
              this.renderHomeTableHeadings()
            }
            </thead>
            <tbody>
              {
                this.renderHomeTableBody()
              }
            </tbody>
          </table>
        </div>
    )
  }
}
/*= End of SourcesTable component =*/
/*=============================================<<<<<*/


/*=============================================>>>>>
= Main Component - Dashboard =
===============================================>>>>>*/
class Dashboard extends Component {
  state = {
    selectedView: 'categoryView',
    treemapSource: [],
    treemapHeading: 'Records by Categories',
    densitySource: [],
    uniquenessSource: [],
    attributesSource: [],
    completenessSource: [],
    projects: [],
    multiSelectDropdownLabel: 'Categories',
    sources: [],
    categories: []
  };

  // static contextTypes = {
  //   relay: Relay.PropTypes.Environment,
  // };

  componentDidMount() {
    this.state.treemapHeading = 'Records by Categories';

    // Get All Data and switch to CategoryView
    this.getAllData('categoryView');

    $(this.refs.btnsource).tooltip({trigger : 'hover'});
    $(this.refs.btncategory).tooltip({trigger : 'hover'});
    $(this.refs.btnproject).tooltip({trigger : 'hover'});
  }

  componentWillMount() {
    // const sessionManager = SessionManager.instance;
    // if(!sessionManager.isUserLoggedIn()) {
    //   this.props.router.push('/');
    // }
    //this.report = {};
    //this.sourceRecords = {};
    //this.categoryRecords = {};

    /*Create maps: report, sourceRecords, categoryRecords.
    * Set the states for the 4 maps
    *create a report object with map anme as key and records as values */
    // this.props.user.reports.edges.forEach(function(item) {
    //   if(item.node.records != undefined || item.node.records != null) {
    //     this.report[item.node.name] = item.node.records;
    //   } else {
    //     this.sourceRecords[item.node.name] = item.node.sourceRecords;
    //     this.categoryRecords[item.node.name] = item.node.categoryRecords;
    //   }
    // }.bind(this));
    // this.setState(
    //   {
    //     densitySource: this.sourceRecords.Density,
    //     uniquenessSource: this.sourceRecords.Uniqueness,
    //     attributesSource: this.sourceRecords.Attributes,
    //     completenessSource: this.sourceRecords.Completeness
    //   }
    // );
  }

  getAllData(view) {
    var self = this;
    var _categories = [];
    var _projects = [];
    var _sources = [];
     // Get Sources
     XyloFetch.getAllSources()
      .then(response => {
        _sources = response.payload;
        self.setState({sources: _sources});

        // Get Categories
        XyloFetch.getCategories()
          .then(response => {
             _categories = response.payload;
            self.setState({categories: _categories});
            self.setState({treemapSource: _categories});

            // Get Projects Info
            XyloFetch.getAllProjects()
                .then(response => {
                    _projects = response.payload;
                    self.setState({projects: _projects});
                    self.setState({selectedView: view});

										XyloFetch.getTenantIntersections()
											.then(response => {
												self.setState({sourceIntersetctions: response.payload});
											});

            });

        });

      });

  }

  /* on view toggle button change */
  onViewSelectionChange(view) {
    this.getAllData(view);
  }

  onMsSelectDropdownValueChanged() {}

  render() {
		const self = this;
    let totalRecordsCount = 0;
    let totalAttributesCount = 0;
    let viewNamesArray = [];
    this.state.treemapSource.forEach(function(item) {
      viewNamesArray.push({id: item.id, text: item.name, isSelected: true});
      totalRecordsCount += item.numRecords;
      if( item.attributes ){
        totalAttributesCount += item.attributes.length;
      }
    });
    return (

      <div className="dashboard wrapper wrapper-content">
        <div className='row'>
          <HeaderCounters sourcesCount = {this.state.treemapSource.length}
          attributesCount = {totalAttributesCount}
          recordsCount = {totalRecordsCount}
          projectsCount = {this.state.projects.length}/>
        </div>

        <div className='row'>
          <div className="col-lg-12">
            <div className="ibox">
              <div className="ibox-content">
                <div className='row'>
                  <div className='col-sm-1'></div>
                    <div className="pull-right">
                      <button ref="btnsource"
                        type="button"
                        className={"btn btn-white toggle-view-button " + (this.state.selectedView == 'sourceView' ? 'active-view' : '')}
                        onClick={this.onViewSelectionChange.bind(this, 'sourceView')}
                        data-toggle="tooltip"
                        data-placement="left"
                        title="Source">
                          <i className="fa fa-list"></i>
                      </button>
                      <button ref="btncategory"
                        type="button"
                        className={"btn btn-white toggle-view-button " + (this.state.selectedView == 'categoryView' ? 'active-view' : '')}
                        onClick={this.onViewSelectionChange.bind(this, 'categoryView')}
                        data-toggle="tooltip"
                        data-placement="top"
                        title="Category">
                        <i className="fa fa-th-large"></i>
                      </button>
                      <button ref="btnproject"
                        type="button"
                        className={"btn btn-white toggle-view-button " + (this.state.selectedView == 'projectView' ? 'active-view' : '')}
                        onClick={this.onViewSelectionChange.bind(this, 'projectView')}
                        data-toggle="tooltip"
                        data-placement="top"
                        title="Project">
                          <i className="fa fa-files-o"></i>
                      </button>
                    </div>
                    <div className='col-sm-12 tree-map-main-container'>
                      {
                        (() => {
                          if (this.state.selectedView === 'sourceView') {
                            return (
                              <div className="col-lg-12" style={{textAlign: "center"}}>
                                  <h1>Sources</h1>
                                  <SourcesVennDiagram data={this.state.sourceIntersetctions}/>
                                   <div className="col-lg-12" style={{marginTop: 50}}>
                                     <SourcesTable view={this.state.selectedView} tableSource = {this.state.sources} />
                                   </div>
                              </div>
                            )
                          }
                          else if (this.state.selectedView === 'categoryView') {
                            return (
                              <div className="col-lg-12" style={{textAlign: "center"}}>
                                  <h1>Categories</h1>
                                  <XyloChartTreeMap treemapSource = {this.state.treemapSource} treemapHeading = {this.state.treemapHeading} id='chart' />
                                   <div className="col-lg-12" style={{marginTop: 0}}>
                                     <SourcesTable view={this.state.selectedView} tableSource = {this.state.categories} />
                                   </div>
                              </div>
                            )
                          }
                          else if (this.state.selectedView === 'projectView') {
                            return(
                              <div className="col-lg-12" style={{textAlign: "center"}}>
                                  <h1>Projects</h1>
                                  <ProjectCharts projects={this.state.projects}/>
                                   <div className="col-lg-12" style={{marginTop: 50}}>
                                     <SourcesTable view={this.state.selectedView} tableSource = {this.state.projects} />
                                   </div>
                              </div>
                            )
                          }
                        })()
                      }

                    </div>
                </div>
              </div>
            </div>
          </div>
        </div>



      </div>
    )
  }
}
/*= End of Main Component - Dashboard =*/
/*=============================================<<<<<*/

export default Dashboard;
