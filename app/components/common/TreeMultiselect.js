/*
    Data Structure to be passed to this component
    let data = [
        {
            text: "Child1",
            value: "child1",
            isSelected: true,
            children: [
                {
                    text: "Child2",
                    value: "child2",
                    isSelected: false
                },{
                    text: "Child3",
                    value: "child3",
                    isSelected: true
                }
            ]
        },{
            text: "Child2",
            value: "child2",
            isSelected: false
        },{
            text: "Child3",
            value: "child3",
            isSelected: true
        },{
            text: "Child4",
            value: "child4",
            isSelected: false
        }
    ];
*/

import React from 'react';
import ReactDOM from 'react-dom';

export default class TreeMultiselect extends React.Component {
    static propTypes = {
        id: React.PropTypes.string.isRequired,
        data: React.PropTypes.array.isRequired
    }

    state = {
        data: []
    }

    getSelectedItems() {
        let selectedItems = [];
        for(var i=0; i<this.state.data.length; i++) {
            let parent = this.state.data[i];
            let children = [];
            for(var j=0; j<parent.children.length; j++) {
                let child = parent.children[j];
                if(child.isSelected) {
                    children.push({
                        text: child.text,
                        value: child.value,
                        isSelected: true,
                        children: []
                    });
                }
            }
            if(children.length > 0) {
              selectedItems.push({
                  text: parent.text,
                  value: parent.value,
                  isSelected: true,
                  children: children
              });
            }
        }
        return selectedItems;
    }

    getSelectedChildren() {
      let selectedItems = [];
      for(var i=0; i<this.state.data.length; i++) {
          let parent = this.state.data[i];
          //let children = [];
          for(var j=0; j<parent.children.length; j++) {
              let child = parent.children[j];
              if(child.isSelected) {
                  selectedItems.push({
                      parentName: parent.text,
                      text: child.text,
                      value: child.value,
                      isSelected: true,
                      children: []
                  });
              }
          }
          // if(children.length > 0) {
          //   selectedItems.push({
          //       text: parent.text,
          //       value: parent.value,
          //       isSelected: true,
          //       children: children
          //   });
          // }
      }
      return selectedItems;
    }

    buildInitialData() {
        if(this.props.data == undefined || this.props.data.length ==0) {
            return;
        }
        var formattedData = [];
        for(var i=0; i<this.props.data.length; i++) {
            var item = this.props.data[i];
            item.searchableText = item.text.toLowerCase();
            item.isSelected = item.isSelected || false;
            item.key = i+1;
            item.hide = false;
            item.collapsed = false;
            if(item.children && item.children.length > 1) {
                item.children = this.buildChildData(item.key, item.text, item.children);
            } else {
                item.children = [];
            }
            formattedData.push(item);
        }
        this.setState({"data": formattedData});
    }

    buildChildData(parentKey, parentName, childData) {
        if(childData == undefined || childData.length ==0) {
            return childData;
        }
        var formattedChildData = [];
        for(var i=0; i<childData.length; i++) {
            var item = childData[i];
            item.searchableText = item.text.toLowerCase();
            item.isSelected = item.isSelected  || false;
            item.key = parentKey + "." + (i+1);
            item.parent = parentName;
            item.hide = false;
            if(item.children && item.children.length > 1) {
                item.children = this.buildChildData(item.key, item.parent + "/" + item.text, item.children);
            } else {
                item.children = [];
            }
            formattedChildData.push(item);
        }

        return formattedChildData;
    }

    componentWillMount() {
        this.buildInitialData();
    }

    componentDidMount() {
        $('.tms-checkboxes').prop('disabled', true);
    }

    componentWillReceiveProps() {
        this.buildInitialData();
    }

    componentDidUpdate() {
    }

    onSelectionChange(e) {
        let parentId;
        let childId;
        let data;
        if(e.target.id.indexOf(".") != -1) {
            parentId = e.target.id.split(".")[0];
            childId = e.target.id.split(".")[1];
            data = this.state.data[parentId - 1].children[childId - 1];
            data.isSelected = e.target.checked;
        } else {
            parentId = e.target.id;
            data = this.state.data[parentId - 1];
            data.isSelected = e.target.checked;
            for(var i=0; i<data.children.length; i++) {
                if (!data.children[i].isDisabled) {
                  data.children[i].isSelected = data.isSelected;
                }
            }
        }
        this.setState({data: this.state.data});

        if(this.props.onChange) {
            this.props.onChange(this.getSelectedItems());
        }
    }

    onSelectedItemChange(id) {
        let parentId;
        let childId;
        parentId = id.split(".")[0];
        childId = id.split(".")[1];
        let data = this.state.data[parentId - 1].children[childId - 1];
        data.isSelected = !data.isSelected;
        this.setState({data: this.state.data});

        if(this.props.onChange) {
            this.props.onChange(this.getSelectedItems());
        }
    }

    onSearchKeyChange(e) {
        let searchKey = e.target.value.toLowerCase();
        if(this.timeoutToken) {
            clearTimeout(this.timeoutToken);
        }
        this.timeoutToken = setTimeout(function() {
            for(var i=0; i<this.state.data.length; i++) {
                var parent = this.state.data[i];
                var totalHidden = 0;
                for(var j=0; j<parent.children.length; j++) {
                    var child = parent.children[j];
                    if(child.searchableText.indexOf(searchKey) == -1) {
                        child.hide = true;
                        totalHidden++;
                    } else {
                        child.hide = false;
                    }
                }
                if(totalHidden == parent.children.length && parent.searchableText.indexOf(searchKey) == -1) {
                    parent.hide = true;
                } else {
                    parent.hide = false;
                    if(totalHidden != parent.children.length) {
                        parent.collapsed = false;
                    }
                }

                if(searchKey === "") {
                    parent.collapsed = true;
                }
            }
            this.setState({data: this.state.data});
        }.bind(this), 500);
    }

    onCollapseChange(id) {
        let data = this.state.data[id - 1];
        data.collapsed = !data.collapsed;
        this.setState({data: this.state.data});
    }

    renderSelectables(item) {
        let parentStyle = {
            padding: 5,
            backgroundColor: "#ABABAB",
            color: "#FFFFFF",
            marginBottom: 0,
            borderBottom: "1px solid #d5d5d5",
            display: "block"
        }
        let collapseStyle = {
            float: "left",
            padding: "2px 10px",
            color: "#FFF",
            fontWeight: "bold",
            fontSize: "15px",
            cursor: "pointer",
            width: "30px"
        }

        let checkboxStyle = {
          lineHeight: "normal",
          verticalAlign: "sub"
        }
        return (
            <div className={item.hide ? 'hidden' : ''}>
                <span style={collapseStyle} onClick={this.onCollapseChange.bind(this, item.key)}>
                    <span className={!item.collapsed ? "hidden" : ""}>+</span>
                    <span className={item.collapsed ? "hidden" : ""}>-</span>
                </span>
                <label key={item.key} style={parentStyle}>
                    <input type="checkbox"
                        value={item.value}
                        key={item.key}
                        id={item.key}
                        checked={item.isSelected}
                        onChange={::this.onSelectionChange}/>
                    {item.text}
                </label>
                <div className={item.collapsed ? "hidden" : ""}>
                    {
                        ::this.renderSelectablesChildren(item.children)
                    }
                </div>
            </div>
        )
    }

    renderSelectablesChildren(children) {
        if(children == undefined || children.length == 0) {
            return;
        }
        let childStyle = {
            marginLeft: 30,
            padding: 5,
            marginBottom: 0
        }

        return (
            children.map(function(child){
                var itemText = child.isDisabled === true ? child.text + '*' : child.text;
                console.log(child.key);
                return (
                    <div>
                        <label style={childStyle} className={child.hide ? 'hidden' : ''}>
                        { (() => {
                            if (child.isDisabled === true) {
                              return (
                                <input type="checkbox" value={child.value} disabled
                                    key={child.key}
                                    id={child.key}
                                    checked={child.isSelected}
                                    onChange={::this.onSelectionChange}/>
                                )
                            }
                            else {
                              return (
                                  <input type="checkbox" value={child.value}
                                    key={child.key}
                                    id={child.key}
                                    checked={child.isSelected}
                                    onChange={::this.onSelectionChange}/>
                                )
                            }
                          })()
                        }
                        {itemText}
                        </label>
                        {
                            this.renderSelectablesChildren(child.children)
                        }
                    </div>
                )
            }.bind(this))
        )
    }

    renderSelectedItems(item) {
        let selectedStyle = {
            padding: 5,
            borderBottom: "1px solid gray",
            display: "table-row",
            lineHeight: "35px"
        }
        let closableStyle = {
            cursor: "pointer",
            marginRight: "15px",
            fontWeight: "bold",
            fontSize: "15px",
            fontFamily: "sans-serif",
            padding: "5px",
        }
        let containerStyle = {
            width: "50%",
            display: "table-cell"
        }
        if(item.isSelected) {
            if (item.isDisabled) {
              return(
                  <div style={selectedStyle}>
                      <div style={containerStyle}>
                          <span>{item.text}</span>
                      </div>
                      <div style={containerStyle} className="text-right">
                          <span>{item.parent}</span>
                      </div>
                  </div>
              )
            }
            else {
              return(
                  <div style={selectedStyle}>
                      <div style={containerStyle}>
                          <span style={closableStyle}
                              onClick={this.onSelectedItemChange.bind(this, item.key)}>x</span>
                          <span>{item.text}</span>
                      </div>
                      <div style={containerStyle} className="text-right">
                          <span>{item.parent}</span>
                      </div>
                  </div>
              )
            }
        }
    }

    render() {
        let classes = this.props.className ? this.props.className+' tree-multiselect' : 'tree-multiselect';

        let containerStyle = {
            padding: 0
            //height: "500px"
        }

        let containerSelectedStyle = {
            //display: "table"
        }

        let scrollable = {
            minHeight: "180px",
            maxHeight: "500px",
            overflow: "auto"
        }

        let selectedItemsOuterScrollable = {
            minHeight: "180px",
            maxHeight: "540px",
            overflow: "auto"
        }

        let selectedItemsScrollable = {
            //minHeight: "180px",
            maxHeight: "500px",
            overflow: "auto",
            display: "table",
            width: "100%"
        }

        return (
            <div className={classes}>
                <div className="col-xs-12 col-sm-6 selectable-items" style={containerStyle}>
                    <div>
                        <input type="text" placeholder="search"
                            className="form-control"
                            onChange={::this.onSearchKeyChange} />
                    </div>
                    <div style={scrollable}>
                        {
                            this.state.data.map(::this.renderSelectables)
                        }
                    </div>
                </div>
                <div className="col-xs-12 col-sm-6 selected-items" style={selectedItemsOuterScrollable}>
                    <div>
                        <label>Selected Items</label>
                    </div>
                    <div style={selectedItemsScrollable}>
                        {
                            this.state.data.map(function(item) {
                                return item.children.map(::this.renderSelectedItems)
                            }.bind(this))
                        }
                    </div>
                </div>
            </div>
        );
    }
}
