import React from "react";
import "./index.less"
import { formatNumber, NumberFormats } from '@superset-ui/number-format';
import { Set } from 'immutable';
import { formatTime } from '@superset-ui/time-format';
import { getTimeFormatter } from '@superset-ui/time-format';


function getScrollbarWidth() {

    // Creating invisible container
    const outer = document.createElement('div');
    outer.style.visibility = 'hidden';
    outer.style.overflow = 'scroll'; // forcing scrollbar to appear
    outer.style.msOverflowStyle = 'scrollbar'; // needed for WinJS apps
    document.body.appendChild(outer);
  
    // Creating inner element and placing it in the container
    const inner = document.createElement('div');
    outer.appendChild(inner);
  
    // Calculating difference between container's full width and the child width
    const scrollbarWidth = (outer.offsetWidth - inner.offsetWidth);
  
    // Removing temporary elements from the DOM
    outer.parentNode.removeChild(outer);
  
    return scrollbarWidth;
  
  }

export default class CarouselTable extends React.PureComponent {
    constructor(props) {
        super(props);
        this.headerRef = React.createRef();
        this.bodyRef = React.createRef();
        this.headerTable = React.createRef();
        this.bodyWrapper = React.createRef();
        this.bodyTableRef = React.createRef();
    }

    componentDidUpdate() {
        this.setHeaderCellSize();
    }

    componentDidMount() {
        this.setHeaderCellSize();
    }

    setHeaderCellSize() {
        const {headerRef, bodyRef, headerTable, bodyWrapper, bodyTableRef} = this;
        const {width} = this.props;
        const headerEl = headerRef.current, 
        bodyEl = bodyRef.current,  
        headTableEl = headerTable.current, 
        bodyWrapperEl = bodyWrapper.current,
        bodyTableEl = bodyTableRef.current;
        const headerCells = headerEl.children, bodyCells = bodyEl.children;


        const bodyElWidth = bodyEl.getBoundingClientRect().width;

        let headerTableWidth =  Math.max(bodyElWidth, width);
        if(bodyTableEl.clientHeight > bodyWrapperEl.clientHeight) {
            const scrollbarWidth = getScrollbarWidth();
            headerTableWidth -= scrollbarWidth;
        }

        headTableEl.style.width =  headerTableWidth + 'px';
        bodyWrapperEl.style.width = Math.max(bodyElWidth, width) + 'px';
        for(let i = 0; i < bodyCells.length; i++) {
            const cellWidth = bodyCells[i].getBoundingClientRect().width;

            headerCells[i].style.width = cellWidth + 'px'
        }
    }

    render() {

        const {columns, data, percentMetrics, tableTimestampFormat} = this.props;
        const percentMetricSet = new Set(percentMetrics);
        const { PERCENT_3_POINT } = NumberFormats;
        const formatTimestamp = getTimeFormatter(tableTimestampFormat);

        const cellText = function(key, val) {
            if (key === '__timestamp') {
                return formatTimestamp(val);
            }

            if(percentMetricSet.has(key)) {
                return formatNumber(PERCENT_3_POINT, val);
            }

            return val;
        }
        


        console.log(this.props)

        return (
        <div className="carousel-table">
            <table ref={this.headerTable} className="header-table">
                <thead>
                    <tr  ref={this.headerRef}>
                        {
                            columns.map((item, index) => (
                                <th key={item.key} className="header-cell">{item.label}</th>
                            ))
                        }
                    </tr>
                </thead>
            </table>
            <div ref={this.bodyWrapper} className="body-table-wrapper">
                <table ref={this.bodyTableRef} className = "body-table">
                    <thead>
                        <tr  ref={this.bodyRef}>
                            {
                                columns.map((item, index) => (
                                    <th key={item.key} className="header-cell">{item.label}</th>
                                ))
                            }
                        </tr>
                    </thead>
                    <tbody>
                        {
                            data.map((item, index) => (
                                <tr style={{animationDelay: `${index * 0.25}s`}} key={index} className="table-row">
                                    {
                                        columns.map((col) => (
                                            <td key={col.key} className="body-cell">{cellText(col.key, item[col.key])}</td>
                                        ))
                                    }
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
        </div>
        )
    }
}