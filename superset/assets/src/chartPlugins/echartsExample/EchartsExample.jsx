import  React from "react";
import Echarts from "echarts-for-react";
import {getTimeFormatter} from  "@superset-ui/time-format"
import d3 from "d3";
import "d3-time-format";

import {
    getCategoricalSchemeRegistry,
    getSequentialSchemeRegistry,
  } from '@superset-ui/color';

import {isRGBColor, hexToRgb, rgbColorString2Object} from "../utils"
import { applyOptionExtends } from '../applyOptionExtends';


  const toRGBAColorString = function(color, alpha) {
    const {r,g,b,a} = color;
    return `rgba(${r},${g},${b},${alpha || a})`;
}


const mapToSeries =  function(data, formData) {

    const categoricalSchemeRegistry = getCategoricalSchemeRegistry();

    const colors = categoricalSchemeRegistry.get(formData.colorScheme).colors;
    return data.map(function(item, i) {
        const  colorItem = colors[i % colors.length];
        let colorStringToObject = hexToRgb;
        if(isRGBColor(colorItem)){
            colorStringToObject = rgbColorString2Object;
        }
    
        const color = colorStringToObject(colorItem);

        return {
            data:  item.values.map(value => [value.x, value.y]),
            type: 'line',
            name: Array.isArray( item.key) ? item.key.join(',') : item.key,
            smooth: formData.smooth,
            stack: formData.barStacked ? "stack" : null,
            showSymbol: formData.showMarkers,
            areaStyle: formData.showAreaStyle ? {
                color: {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [{
                        offset: 1, color: toRGBAColorString(color, 0.1) // 0% 处的颜色
                    }, {
                        offset: 0, color: toRGBAColorString(color) // 100% 处的颜色
                    }],
                }
            } : null
        }
    })
}


export default class EchartExample extends React.PureComponent {
    constructor(props) {
        super(props);
        this.getOption = this.getOption.bind(this);
    }

    componentDidMount() {
        const onQuery = this.props.hooks ? this.props.hooks.onQuery : null;
    }
    getOption() {
        
        const { formData,  queryData: { data } } = this.props; 

        console.log(this.props);

        const categoricalSchemeRegistry = getCategoricalSchemeRegistry();

        const colorItem = categoricalSchemeRegistry.get(formData.colorScheme);

        const series = mapToSeries(data, formData);
        const yAxisFormat = d3.format(formData.yAxisFormat);
        
        const d3TimeFormat =  getTimeFormatter(formData.xAxisFormat)//d3.time.format(formData.xAxisFormat);
        const timeFormat  = formData.xAxisFormat &&  formData.xAxisFormat !== "smart_date"  ?  (time) => d3TimeFormat(new Date(time)) : null;
        const rotate =  parseInt(formData.labelValueRotate) || 0;
        const {axisType, richTooltip, showXAxisLine, showLegend} = formData;

       return   {
           color:  colorItem.colors,
           tooltip: {
               show:  richTooltip,
               trigger: "axis",
               appendToBody: true
           },
           grid: {
               top: "10%",
               bottom: "8%",
               left: "8%",
               right: "8%",
               containLabel: true
           },
           grid: {
               top: "10%",
               bottom: "8%",
               left: "8%",
               right: "8%"
           },
           legend: {
               type: "scroll",
                show: showLegend,
                data: series.map(item => item.name)
           },
            xAxis: {
                show: showXAxisLine,
                type:  axisType,
                boundaryGap: false,
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
                    color: toRGBAColorString(formData.xAxisLabelColor)
                },
                axisLine: {
                    lineStyle: {
                        color: toRGBAColorString(formData.xAxisLabelColor)
                    }
                }
            },
            series,
        };
        
    }

    render() {
        const {width, height} = this.props;
        return (
            <div>
                <Echarts  notMerge style={{width: `${width} px`, height: `${height}px`}}  option= {applyOptionExtends(this.getOption(), this.props)}/>
            </div>
        )
    }
}





