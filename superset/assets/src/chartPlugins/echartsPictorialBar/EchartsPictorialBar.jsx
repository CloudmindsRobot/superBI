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
const defaultSymbol = "path://M10 80 Q 95 10 180 80"
const mapToSeries =  function(data, props, symbols) {
    const {formData, width} = props
    const {axisType, reverseAxis} = formData;
    return data.map(function(item, index) {
        const symbolArray = symbols[index] || []
        return {
            data:  item.values.map(function(value, index) {
                const dataValue = [axisType === "time" ? new Date(value.x) : value.x, value.y];
                if(reverseAxis) {
                    dataValue.reverse();
                }
                 return {
                     value:  dataValue,
                     symbol: symbolArray[index] || defaultSymbol
                 }
            }),
            type: 'pictorialBar',
            name: Array.isArray( item.key) ? item.key.join(',') : item.key,
            showSymbol: formData.showMarkers,
            symbolRepeat: true,
            symbolSize: 20,
            large: true,
            barCategoryGap: "20%"
        }
    })
}

const parseSymbols = function(symbolText) {
    const symbols = JSON.parse(symbolText);
    return symbols
}

export default  class EchartsPictorialBar extends React.PureComponent {
    constructor(props) {
        super(props);
        this.getOption = this.getOption.bind(this);
    }

    componentDidMount() {
        const onQuery = this.props.hooks ? this.props.hooks.onQuery : null;
    }
    getOption() {
        
        const { formData,  queryData: { data }, width } = this.props; 

        console.log(this.props);

        const categoricalSchemeRegistry = getCategoricalSchemeRegistry();

        const colorItem = categoricalSchemeRegistry.get(formData.colorScheme);

        const symbols = parseSymbols(formData.symbolText)
        const series = mapToSeries(data, this.props, symbols);
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
               left: "15%"
           },
           tooltip: {
               show:  formData.richTooltip,
               trigger: "axis",
           },
           legend: {
                show: formData.showLegend,
                data: series.map(item => item.name)
           },
            xAxis: {
                show: formData.showXAxisLine,
                type:  axisType,
                // boundaryGap: false,
                name:  formData.xAxisLabel,
                splitLine: {
                    show: false,
                },
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
                // min: formData.yAxisBounds[0],
                // max: formData.yAxisBounds[1],
                type: formData.yAxisType,
                name:  formData.yAxisLabel,
                axisLabel: {
                    margin: formData.leftMargin === "auto" ? 10 : formData.leftMargin,
                    formatter: formData.yAxisType === "value" ?  yAxisFormat : null,
                    color: toRGBAColorString(formData.yAxisLabelColor)
                },
                axisTick: {
                    show: false,
                },
                axisLine: {
                    show: false,
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




