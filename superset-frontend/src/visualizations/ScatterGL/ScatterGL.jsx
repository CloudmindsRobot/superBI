/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
import React from 'react';
import PropTypes from 'prop-types';
import { t } from '@superset-ui/translation';

//import ReactEcharts from "echarts-for-react";
import ReactEchartsCore from 'echarts-for-react/lib/core';
import echarts from 'echarts/lib/echarts';
import 'echarts-gl'
import 'echarts/lib/chart/scatter';
import 'echarts/lib/chart/bar';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
require('echarts/map/js/world.js');
require('echarts/map/js/china.js');

import './ScatterGL.less';

const propTypes = {

};
const defaultProps = {

};

class ScatterGL extends React.Component {
    constructor(props) {
        super(props);
        this.getOption = this.getOption.bind(this);
        this.fetchData = this.fetchData.bind(this);
    }

    componentDidMount() {
        this.renderScatterGLData(this.props.scatterGLPointArray.features);
        //for test 
        //this.fetchData(0);
    }

    componentDidUpdate() {
        this.renderScatterGLData(this.props.scatterGLPointArray.features);
    }

    renderScatterGLData(pointsList) {
        let echarts_instance = this.echarts_react.getEchartsInstance();
        var list = [];
        pointsList.forEach(function (item, i) {
            list[2 * i] = item[1];
            list[2 * i + 1] = item[0];
        });
        echarts_instance.appendData({
            seriesIndex: 0,
            data: new Float32Array(list)
        })
    }

    getOption() {
        return {
            backgroundColor: this.props.sactterglBgColor,
            title: {
                text: this.props.scatterGlTitle,
                left: 'center',
                textStyle: {
                    color: '#fff'
                }
            },
            geo: {
                map: this.props.sactterglMapMode,
                roam: true,
                label: {
                    emphasis: {
                        show: false
                    }
                },
                silent: true,
                itemStyle: {
                    normal: {
                        areaColor: '#323c48',
                        borderColor: '#111'
                    },
                    emphasis: {
                        areaColor: '#2a333d'
                    }
                }
            },
            series: [{
                name: 'ruo',
                type: 'scatterGL',
                progressive: 1e6,
                coordinateSystem: 'geo',
                symbolSize: 1,
                zoomScale: 0.002,
                blendMode: 'lighter',
                large: true,
                itemStyle: {
                    color: this.props.sactterglDotColor
                },
                postEffect: {
                    enable: true
                },
                silent: true,
                dimensions: ['lng', 'lat'],
                data: new Float32Array()
            }]
        }
    }

    fetchData(idx) {
        var self = this;
        let echarts_instance = this.echarts_react.getEchartsInstance();
        return new Promise(function (reslove, reject) {
            if (idx >= 20) {
                return;
            }
            var dataURL = "https://www.echartsjs.com/examples/" + 'data/asset/data/gps/gps_' + idx + '.bin';
            var xhr = new XMLHttpRequest();
            xhr.open('GET', dataURL, true);
            xhr.responseType = 'arraybuffer';

            xhr.onload = function (e) {
                var rawData = new Int32Array(this.response);
                var data = new Float32Array(rawData.length);
                var addedDataCount = rawData.length / 2;
                for (var i = 0; i < rawData.length; i += 2) {
                    data[i] = rawData[i + 1] / 1e7;
                    data[i + 1] = rawData[i] / 1e7;
                }

                echarts_instance.appendData({
                    seriesIndex: 0,
                    data: data
                })
                self.fetchData(idx + 1);
            }

            xhr.send();
        })

    }

    render() {
        return (
            <div className="scatter_container">
                <ReactEchartsCore
                    echarts={echarts}
                    ref={(e) => { this.echarts_react = e; }}
                    option={this.getOption()}
                    style={{ height: '100%' }}
                />
            </div>
        );
    }
}

ScatterGL.propTypes = propTypes;
ScatterGL.defaultProps = defaultProps;

export default ScatterGL;
