import  React from "react";
import Echarts from "echarts-for-react";
import d3 from "d3";
import "d3-time-format";

import {
    getCategoricalSchemeRegistry,
    getSequentialSchemeRegistry,
  } from '@superset-ui/color';

  import widthAutoRefresh from "../withAutoRefresh";
import { applyOptionExtends } from '../applyOptionExtends';

const mapToSeries =  function(data, props) {
    const {formData, width} = props;
    const {axisType} = formData;
    const yAxisFormat = d3.format(formData.yAxisFormat);
    return data.map(function(item) {
        return {
            data:  item.values.map(value => [axisType === "time" ? new Date(value.x) : value.x, value.y]),
            type: 'bar',
            name: Array.isArray( item.key) ? item.key.join(',') : item.key,
            smooth: formData.smooth,
            showSymbol: formData.showMarkers,
            areaStyle: formData.showAreaStyle ? {} : null,
            stack: formData.barStacked ? "stack" : null,
            large: true,
            barMaxWidth:  width/30,
            barCategoryGap: "20%",
            label: {
                show: formData.showBarValue,
                // formatter : yAxisFormat,
                // show: true,
                position: 'top'
            }
        }
    })
}

class EchartsBar extends React.PureComponent {
    constructor(props) {
        super(props);
        this.getOption = this.getOption.bind(this);
    }

    componentDidMount() {
        const onQuery = this.props.hooks ? this.props.hooks.onQuery : null;
    }
    getOption() {
        
        const { formData,  queryData: { data }, width } = this.props; 

        const categoricalSchemeRegistry = getCategoricalSchemeRegistry();

        const colorItem = categoricalSchemeRegistry.get(formData.colorScheme);


        const series = mapToSeries(data, this.props);
        const yAxisFormat = d3.format(formData.yAxisFormat);
        const d3TimeFormat = d3.time.format(formData.xAxisFormat);
        const timeFormat  = formData.xAxisFormat &&  formData.xAxisFormat !== "smart_date"  ?  (time) => d3TimeFormat(new Date(time)) : null;
        const rotate =  parseInt(formData.labelValueRotate) || 0;
        const toRGBAColorString = function(color) {
            const {r,g,b,a} = color;
            return `rgba(${r},${g},${b},${a})`;
        }

        const {bottomMargin, barStacked, axisType} = formData;

       return   {
           color:  colorItem.colors,
           grid: {
               bottom: "8%",
               top: "10%",
               left: "8%",
               right: "8%",
               containLabel: true
           },
           tooltip: {
               show:  formData.richTooltip,
               trigger: "axis",
               appendToBody: true
           },
           legend: {
                show: formData.showLegend,
                data: series.map(item => item.name),
                type: "scroll"
           },
            xAxis: {
                show: formData.showXAxisLine,
                type:  axisType,
               // boundaryGap: false,
                name:  formData.xAxisLabel,
                axisLabel: {
                    margin: formData.bottomMargin === "auto" ? 10 : formData.bottomMargin,
                    formatter: axisType === "time" ? timeFormat : null,
                    rotate,
                    color: toRGBAColorString(formData.xAxisLabelColor)
                },
                axisLine: {
                    lineStyle: {
                        color: toRGBAColorString(formData.xAxisLabelColor)
                    }
                }
            },
            yAxis: {
                show: formData.showYAxisLine,
                min: formData.yAxisBounds[0],
                max: formData.yAxisBounds[1],
                type: 'value',
                name:  formData.yAxisLabel,
                axisLabel: {
                    margin: formData.leftMargin === "auto" ? 10 : formData.leftMargin,
                    formatter: yAxisFormat,
                    color: toRGBAColorString(formData.yAxisLabelColor)
                },
                axisLine: {
                    lineStyle: {
                        color: toRGBAColorString(formData.yAxisLabelColor)
                    }
                }
            },
            series,
        };
        
    }

    render() {
        const {width, height, formData, queryData: {data}} = this.props;

        const barMinWidth = 10;

        const dataLength = data[0] ? data[0].values.length : 0;

        const containerWidth = Math.max(width, dataLength * barMinWidth)

        return (
            <div style={{height: `${height}px`, width: '100%', overflow: "auto"}}>
                <Echarts notMerge={true} style={{height: `100%`, width: `${containerWidth}px`}}  option= {applyOptionExtends(this.getOption(), this.props)}/>
            </div>
        )
    }
}



export default widthAutoRefresh(EchartsBar)

