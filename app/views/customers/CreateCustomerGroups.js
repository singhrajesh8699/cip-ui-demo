import React from 'react';
import ReactDOM from 'react-dom';
import { withRouter, Link } from 'react-router';

import * as _ from "lodash";

import {
  SearchkitManager,SearchkitProvider, HierarchicalMenuFilter, DynamicRangeFilter,
  SearchBox, Hits, RefinementListFilter, Pagination,
  MenuFilter, HitsStats, SortingSelector, NoHits,
  ItemList, CheckboxItemList, ItemHistogramList,
  NumericRefinementListFilter,
  Tabs, TagCloud, Toggle, Select,
  Layout, LayoutBody, LayoutResults,
  SideBar, TopBar,
  RangeFilter,
  ActionBar, ActionBarRow,
  } from "searchkit";

import * as serverURLs from '../../components/common/UrlConstants';
import SessionManager from '../../components/common/SessionManager';

import "../../../public/vendor/searchkit/theme.css";

const searchkit = new SearchkitManager(serverURLs.ES_URL + '/companies');

class CustomersHeader extends React.Component {
  render() {
    return (
      <div className="col-lg-10">
        <div className='xylo-page-header'>
          <h2>Customers</h2>
          <ol className="breadcrumb">
              <li>
                  <a href="index.html">Customers</a>
              </li>
              <li>
                  <a href="index.html">Groups</a>
              </li>
              <li>
                  <a><b>Create</b></a>
              </li>
          </ol>
        </div>
      </div>
    );
  }
}


export const HitsListItem = (props)=> {
  const {bemBlocks, result} = props;
  let url = "/app/segment/profileinfo/" + result._id;
  const source:any = _.extend({}, result._source, result.highlight)
  return (
      <div className={bemBlocks.item().mix(bemBlocks.container("item"))} data-qa="hit">
        <div className={bemBlocks.item("poster")}>
         {/* <a onClick={this.props.router.push(`/app/segment/profileinfo/${customer._id}`);}}> */}
         <a>
          <img className='thumbnail' data-qa="poster" src={result._source["Company Logo"]} width="110"/>
         </a>
        </div>
        <div className={bemBlocks.item("details")}>
           <Link to={url}>
            <h2 className={bemBlocks.item("title")} dangerouslySetInnerHTML={{__html:source['Company Name']}}></h2>
          </Link>
          <h3 className={bemBlocks.item("subtitle")}>Founded in {result._source['Years of Establishment']}</h3>
                <div className={"industry"}>{result._source['Industry']}</div>
                <div className={"city"}>Located at {result._source['City']}, {result._source['Country']}</div>
        </div>

      </div>
    )
}


export default class CustomerGroups extends React.Component {

    componentWillMount() {
        const sessionManager = SessionManager.instance;
        if(!sessionManager.isUserLoggedIn()) {
            this.props.router.push('/');
        }
    }

  render() {

    //const SearchkitProvider = Searchkit.SearchkitProvider;
    //const Searchbox = Searchkit.SearchBox;
    return (

      <div className='xylo-page-heading'>

         <div className="row wrapper white-bg page-heading">
            <CustomersHeader />
         </div>

          <SearchkitProvider searchkit={searchkit}>
              <Layout className="xylo-search xylo-bg customers">

                  <div className="sk-layout__searchbox">
                    <SearchBox
                      autofocus={true}
                      searchOnChange={true}
                      prefixQueryFields={["Company Name", "Industry"]}/>
                  </div>

                  <LayoutBody>
                      <SideBar>
                        <div className="sk-layout__filters-row">

                          <RefinementListFilter id="cities" title="City" field="City" operator="OR" size={10}/>
                          <RefinementListFilter id="industries" title="Industry" field="Industry" operator="OR" size={10}/>

                          <RangeFilter min={1990} max={2016} field="Years of Establishment" id="establishment" title="Founded in" showHistogram={true}/>

                          <NumericRefinementListFilter id="server_count" title="Number of Servers" field="No of Servers" options={[
                            {title:"All"},
                            {title:"up to 10", from:0, to:10},
                            {title:"11 to 20", from:10, to:20},
                            {title:"21 to 40", from:20, to:40},
                            {title:"41 to 60", from:40, to:60},
                            {title:"61 to 100", from:60, to:100},
                            {title:"100 or more", from:100, to:10000}
                          ]}/>

                          <RefinementListFilter id="xylo-quadrant" title="Xylo Quadrant" field="XYLO Quadrant" operator="OR" size={10} />
                          <RefinementListFilter id="ltv" title="LTV Range" field="Life Time Value" operator="OR" size={10} />

                          <DynamicRangeFilter id="ps-overall" title="Potenital Score: Overall" field="Potenital Score  Overall"/>
                          <DynamicRangeFilter id="ps-ink-toner" title="Potential Score : Ink & Toner" field="Potential Score : Ink & Toner"/>
                          <DynamicRangeFilter id="ps-supplies" title="Potential Score : Supplies" field="Potential Score : Supplies"/>
                          <DynamicRangeFilter id="ps-facilites" title="Potential Score : Facilities" field="Potential Score : Facilities"/>
                          <DynamicRangeFilter id="ps-technology" title="Potential Score : Technology" field="Potential Score : Technology"/>

                          <DynamicRangeFilter id="comp-index" title="Competitive Index" field="Competitive Index"/>
                          <DynamicRangeFilter id="ci-ink-toner" title="Competitive Index : Ink & Toner" field="Competitive Index : Ink & Toner"/>
                          <DynamicRangeFilter id="ci-supplies" title="Competitive Index : Supplies" field="Competitive Index : Supplies"/>
                          <DynamicRangeFilter id="ci-facilites" title="Competitive Index : Facilities" field="Competitive Index : Facilities"/>
                          <DynamicRangeFilter id="ci-technology" title="Competitive Index : Technology" field="Competitive Index : Technology"/>

                          <RefinementListFilter id="usage-segment" title="Usage Segmentation" field="Usage Segmentation" operator="OR" size={10} />

                          <MenuFilter field={"type.raw"} title="CheckboxItemList" id="checkbox-item-list" listComponent={CheckboxItemList} />
                          <MenuFilter field={"type.raw"} title="ItemHistogramList" id="histogram-list" listComponent={ItemHistogramList} />
                          <MenuFilter field={"type.raw"} title="TagCloud" id="tag-cloud" listComponent={TagCloud} />
                          <MenuFilter field={"type.raw"} title="Toggle" id="toggle" listComponent={Toggle} />
                          <MenuFilter field={"type.raw"} title="Tabs" id="tabs" listComponent={Tabs} />
                          <MenuFilter field={"type.raw"} title="Select" id="select" listComponent={Select} />

                          <NumericRefinementListFilter id="pc_count" title="Number of PCs" field="No of PCs" options={[
                            {title:"All"},
                            {title:"up to 50", from:0, to:50},
                            {title:"50 to 100", from:51, to:100},
                            {title:"101 to 200", from:101, to:500},
                            {title:"501 to 2000", from:501, to:2000},
                            {title:"2001 to 5000", from:2001, to:5000},
                            {title:"5001 or more", from:5001, to:10000}
                          ]}/>
                          <MenuFilter field={"type.raw"} title="CheckboxItemList" id="checkbox-item-list" listComponent={CheckboxItemList} />
                          <MenuFilter field={"type.raw"} title="ItemHistogramList" id="histogram-list" listComponent={ItemHistogramList} />
                          <MenuFilter field={"type.raw"} title="TagCloud" id="tag-cloud" listComponent={TagCloud} />
                          <MenuFilter field={"type.raw"} title="Toggle" id="toggle" listComponent={Toggle} />
                          <MenuFilter field={"type.raw"} title="Tabs" id="tabs" listComponent={Tabs} />
                          <MenuFilter field={"type.raw"} title="Select" id="select" listComponent={Select} />

                          <DynamicRangeFilter id="ps-ink-toner-propensity" title="Ink &amp; Toner Sales Propensity"
                            field="Ink & Toner Sales Propensity"/>

                          <DynamicRangeFilter id="ps-supplies-sales-propensity" title="Supplies Sales Propensity"
                            field="Supplies Sales Propensity"/>

                          <DynamicRangeFilter id="ps-facilities-sales-propensity" title="Faciltiies Sales Propensity"
                            field="Faciltiies Sales Propensity"/>

                          <DynamicRangeFilter id="ps-technology-sales-propensity" title="Technology Sales Propensity"
                            field="Technology Sales Propensity"/>

                        </div>
                      </SideBar>

                      <LayoutResults>
                        <ActionBar>
                          <ActionBarRow>
                            <HitsStats translations={{
                              "hitstats.results_found":"{hitCount} results found"
                            }}/>
                          </ActionBarRow>
                        </ActionBar>
                        <Hits
                            hitsPerPage={12} highlightFields={["Company Name", "Industry"]}
                            sourceFilter={["Company Logo", "Company Name", "City", "Country", "No of Sites", "Years of Establishment", "Industry"]}
                            mod="sk-hits-list" itemComponent={HitsListItem} scrollTo="body"
                        />
                        <NoHits suggestionsField={"Company Name"}/>
                        <Pagination showNumbers={true}/>
                      </LayoutResults>
                  </LayoutBody>

              </Layout>
            </SearchkitProvider>

        </div>

      );
  }
}
