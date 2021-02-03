import  React from "react";
import "echarts-gl";
import "echarts/map/js/world"
import Echarts from "echarts-for-react";
import d3 from "d3";
import "d3-time-format";
import baseTexture from './world.topo.bathy.200401.jpg'
import heightTexture from './bathymetry_bw_composite_4k.jpg'

import {
    getCategoricalSchemeRegistry,
    getSequentialSchemeRegistry,
  } from '@superset-ui/color';
export default class Echarts3DLines extends React.PureComponent {
    constructor(props) {
        super(props);
        this.getOption = this.getOption.bind(this);
    }

    getOption() {
        
        const { formData,  queryData: { data } } = this.props; 

        const seriesData = data.features.map((item)=> {
            return [item.start_point, item.end_point]
        })

        const {r, g, b, a} = formData.color

        const mapToCoord = {
            "globe": {
                baseTexture,
                heightTexture,
    
                shading: 'lambert',
    
                light: {
                    ambient: {
                        intensity: 0.4
                    },
                    main: {
                        intensity: 0.4
                    }
                },
    
                viewControl: {
                    autoRotate: true,
                    distance:  parseInt(formData.globeDistance)
                },
                postEffect: {
                    enable: true
                }
            },
            geo3D: {
                map: 'world',
                shading: 'realistic',
                silent: true,
                realisticMaterial: {
                    roughness: 0.8,
                    metalness: 0
                },
                postEffect: {
                    enable: true
                },
                groundPlane: {
                    show: false
                },
                light: {
                    main: {
                        intensity: 1,
                        alpha: 30
                    },
                    ambient: {
                        intensity: 0
                    }
                },
                viewControl: {
                    distance:  parseInt(formData.globeDistance),
                    alpha: 100
                },
    
                itemStyle: {
                    areaColor: '#000'
                },
                boxHeight: 10,
                regionHeight: 0.5
            },
        }

        const {coordinateSystem} = formData;

        const baseOption = {
            backgroundColor: `rgba(${r},${g},${b},${a})`,
            series:  {
                type: 'lines3D',

                coordinateSystem,
    
                blendMode: 'lighter',
                effect: {
                    show: true,
                    trailOpacity: 0.6,
                    trailLength: 0.2,
                    trailWidth: 2
                },
                lineStyle: {
                    width: 1,
                    color: 'rgb(50, 50, 150)',
                    opacity: 1    
                },
                data: seriesData
            }
        }

        baseOption[coordinateSystem] = mapToCoord[coordinateSystem];
        console.log(baseOption)
        return    baseOption
        

        
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
