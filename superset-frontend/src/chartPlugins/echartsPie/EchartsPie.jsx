import  React from "react";
import Echarts from "echarts-for-react";

import {
    getCategoricalSchemeRegistry,
    getSequentialSchemeRegistry,
  } from '@superset-ui/color';
import { applyOptionExtends } from '../applyOptionExtends';


export default class EchartsPie extends React.PureComponent {
    constructor(props) {
        super(props);
        this.getOption = this.getOption.bind(this);
    }

    componentDidMount() {
        const onQuery = this.props.hooks ? this.props.hooks.onQuery : null;
    }
    getOption() {
        
        const { formData,  queryData: { data } } = this.props; 

        const {pieLabelType, labelPosition, centerX, centerY, rouseType, radiusInner, radiusOuter} = formData;


        const mapLabelTypeToFormatter = {
            "key": "{b}",
            "value": "{c}",
            "percent": "{d}%",
            "key_value": "{b} {c}",
            "key_percent": "{b} {d}%"
        }

        console.log(this.props);

        const categoricalSchemeRegistry = getCategoricalSchemeRegistry();

        const colorItem = categoricalSchemeRegistry.get(formData.colorScheme);
        const toRGBAColorString = function(color) {
            const {r,g,b,a} = color;
            return `rgba(${r},${g},${b},${a})`;
        }

        const chartData = data.map(({x, y}) => {
            return {name: x, value: y}
        });

       return   {
           color:  colorItem.colors,
           tooltip: {
           },
           legend: {
                data: chartData.map(item => {
                    return {
                        name: item.name,
                        icon: "circle"
                    }
                }),
                show: formData.showLegend
           },
            series: {
                type: 'pie',
                // radius: [40, 90],
                // center: ['50%', '40%'],
                radius: [`${radiusInner}%`, `${radiusOuter}%`],
                center: [`${centerX}%`, `${centerY}%`],
                roseType: rouseType,
                data: chartData,
                label: {
                    show: formData.showLabels,
                    position: labelPosition,
                    formatter: mapLabelTypeToFormatter[pieLabelType]
                },
                labelLine: {
                    show: formData.showLabels
                }
            }
        };
        
    }

    render() {
        const {width, height} = this.props;
        return (
            <div>
                <Echarts notMerge style={{width: `${width} px`, height: `${height}px`}}  option= {applyOptionExtends(this.getOption(), this.props)}/>
            </div>
        )
    }
}





