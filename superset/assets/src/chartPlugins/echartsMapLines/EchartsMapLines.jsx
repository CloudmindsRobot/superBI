import  React from "react";
import  echarts from "echarts";
import "echarts/map/js/china"
import chinaUsJapan from "./china-us-japan.json";
import Echarts from "echarts-for-react";
import d3 from "d3";
import "d3-time-format";
echarts.registerMap("china-us-japan", chinaUsJapan, {
    'United States of America': {              // 把阿拉斯加移到美国主大陆左下方
        left: 78,
        top: 15,
        width: 18
    },
    'Japan': {              // 把阿拉斯加移到美国主大陆左下方
        left: 125,
        top: 18,
        width: 8
    }
})
import {
    getCategoricalSchemeRegistry,
    getSequentialSchemeRegistry,
  } from '@superset-ui/color';
import { toRGBAColorString } from '../utils.js';
export default class EchartsMapLines extends React.PureComponent {
    constructor(props) {
        super(props);
        this.getOption = this.getOption.bind(this);
    }

    getOption() {
        
        const { formData,  queryData: { data } } = this.props; 

        const seriesData = data.features.map((item)=> {
            return [item.start_point, item.end_point]
        })

        const scatterData = []
        data.features.forEach((item)=> {
            scatterData.push(item.start_point, item.end_point)
        })

        console.log(formData)

        const {r, g, b, a} = formData.color
        return {
            backgroundColor: `rgba(${r},${g},${b},${a})`,
            geo: {
                map: formData.echartsMapType,
                roam: false, //开启鼠标缩放和漫游
                zoom: 1, //地图缩放级别
                selectedMode: false, //选中模式：single | multiple
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
                layoutCenter: ['50%', '46%'], //设置后left/right/top/bottom等属性无效
                layoutSize: '100%', //保持地图宽高比
                label: {
                    emphasis: {
                        show: false
                    }
                },
                itemStyle: {
                    normal: {
                        areaColor: toRGBAColorString(formData.areaColor),
                        borderWidth: 1.1,
                        borderColor: toRGBAColorString(formData.borderColor)
                    },
                    emphasis: {
                        areaColor: '#069'
                    }
                }
            },
            series:  [{
                type: 'lines',

                coordinateSystem: 'geo',
                zlevel: 1,
                symbol: ['none', 'none'],
                symbolSize: 0,
                effect: { //特效线配置
                    show: true,
                    period: 5, //特效动画时间，单位s
                    trailLength: 0.3, //特效尾迹的长度，从0到1
                    symbol: 'arrow',
                    symbolSize: formData.effectSymbolSize
                },
                lineStyle: {
                    normal: {
                        color: toRGBAColorString(formData.lineColor),
                        width: formData.lineWidth,
                        opacity: 0.6,
                        curveness: 0.2 //线的平滑度
                    }
                },
                data: seriesData
            },{
                type: 'effectScatter',
                coordinateSystem: 'geo',
                zlevel: 2,
                rippleEffect: { //涟漪特效
                    period: 5, //特效动画时长 
                    scale: 5, //波纹的最大缩放比例
                    brushType: 'stroke' ,//波纹的绘制方式：stroke | fill
                    color: toRGBAColorString(formData.rippleEffectColor)
                },
                label: {
                    normal: {
                        show: false,
                        position: 'right',
                        formatter: '{b}'
                    }
                },
                symbol: 'circle',
                symbolSize: function (val) {
                    //根据某项数据值设置符号大小
                    return 10;
                },
                itemStyle: {
                    normal: {
                        color: toRGBAColorString(formData.scatterColor)
                    }
                },
                data: scatterData
            }]
        }
        
    }

    render() {
        const {width, height} = this.props;
        return (
            <div>
                <Echarts notMerge style={{width: `${width} px`, height: `${height}px`}}  option= {this.getOption()}/>
            </div>
        )
    }
}
