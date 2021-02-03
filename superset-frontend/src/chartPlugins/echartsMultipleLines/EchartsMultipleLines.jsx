import React from 'react';
import Echarts from 'echarts-for-react';
import d3 from 'd3';
import 'd3-time-format';

import {
  getCategoricalSchemeRegistry,
  getSequentialSchemeRegistry,
} from '@superset-ui/color';

import {
  isRGBColor,
  hexToRgb,
  rgbColorString2Object,
  toRGBAColorString,
} from '../utils';
import { applyOptionExtends } from '../applyOptionExtends';

const mapToBarSeries = function (item, props) {
  const { formData, width } = props;
  const { axisType } = formData;
  return {
    data: item.values.map(value => [
      axisType === 'time' ? new Date(value.x) : value.x,
      value.y,
    ]),
    type: 'bar',
    name: Array.isArray(item.key) ? item.key.join(',') : item.key,
    showSymbol: formData.showMarkers,
    areaStyle: formData.showAreaStyle ? {} : null,
    stack: formData.barStacked ? 'stack' : null,
    large: true,
    barMaxWidth: width / 30,
    barCategoryGap: '20%',
    yAxisIndex: item.yAxis - 1,
  };
};

const mapToLineSeries = function (item, props, i) {
  const { formData } = props;

  const categoricalSchemeRegistry = getCategoricalSchemeRegistry();

  const colors = categoricalSchemeRegistry.get(formData.colorScheme).colors;
  i %= colors.length;
  let colorStringToObject = hexToRgb;
  if (isRGBColor(colors[i])) {
    colorStringToObject = rgbColorString2Object;
  }

  const color = colorStringToObject(colors[i]);

  return {
    data: item.values.map(value => [value.x, value.y]),
    type: 'line',
    name: Array.isArray(item.key) ? item.key.join(',') : item.key,
    smooth: formData.smooth,
    showSymbol: formData.showMarkers,
    yAxisIndex: item.yAxis - 1,
    areaStyle: formData.showAreaStyle
      ? {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 1,
                color: toRGBAColorString(color, 0.1), // 0% 处的颜色
              },
              {
                offset: 0,
                color: toRGBAColorString(color), // 100% 处的颜色
              },
            ],
          },
        }
      : null,
  };
};

const mapToSeries = function (data, props) {
  const toSeries = {
    line: mapToLineSeries,
    bar: mapToBarSeries,
  };

  return data.map(function (item, index) {
    return toSeries[item.type] ? toSeries[item.type](item, props, index) : null;
  });
};

export default class EchartsMultipleLines extends React.PureComponent {
  constructor(props) {
    super(props);
    this.getOption = this.getOption.bind(this);
  }

  componentDidMount() {
    const onQuery = this.props.hooks ? this.props.hooks.onQuery : null;
  }
  getOption() {
    const {
      formData,
      queryData: { data },
    } = this.props;

    console.log(this.props);

    const categoricalSchemeRegistry = getCategoricalSchemeRegistry();

    const colorItem = categoricalSchemeRegistry.get(formData.colorScheme);

    const series = mapToSeries(data, this.props);
    const yAxisFormat = d3.format(formData.yAxisFormat);
    const d3TimeFormat = d3.time.format(formData.xAxisFormat);
    const timeFormat =
      formData.xAxisFormat && formData.xAxisFormat !== 'smart_date'
        ? time => d3TimeFormat(new Date(time))
        : null;
    const rotate = parseInt(formData.labelValueRotate) || 0;
    const { axisType, richTooltip, showXAxisLine, showLegend } = formData;

    return {
      color: colorItem.colors,
      tooltip: {
        show: richTooltip,
        trigger: 'axis',
      },
      grid: {
        top: '10%',
        bottom: '8%',
        left: '8%',
        right: '8%',
      },
      legend: {
        type: 'scroll',
        show: showLegend,
        data: series.map(item => item.name.toString()),
      },
      xAxis: {
        show: showXAxisLine,
        type: axisType,
        boundaryGap: false,
        name: formData.xAxisLabel,
        axisLabel: {
          margin: formData.bottomMargin === 'auto' ? 10 : formData.bottomMargin,
          formatter: axisType === 'time' ? timeFormat : null,
          rotate,
          color: toRGBAColorString(formData.xAxisLabelColor),
        },
        axisLine: {
          lineStyle: {
            color: toRGBAColorString(formData.xAxisLabelColor),
          },
        },
      },
      yAxis: [
        {
          // show: formData.showYAxisLine,
          // min: formData.yAxisBounds[0],
          // max: formData.yAxisBounds[1],
          // name:  formData.yAxisLabel,
          type: 'value',
          axisLabel: {
            margin: formData.leftMargin === 'auto' ? 10 : formData.leftMargin,
            formatter: yAxisFormat,
            color: toRGBAColorString(formData.xAxisLabelColor),
          },
          axisLine: {
            lineStyle: {
              color: toRGBAColorString(formData.xAxisLabelColor),
            },
          },
        },
        {
          // show: formData.showYAxisLine,
          // min: formData.yAxisBounds[0],
          // max: formData.yAxisBounds[1],
          // name:  formData.yAxisLabel,
          type: 'value',
          axisLabel: {
            margin: formData.leftMargin === 'auto' ? 10 : formData.leftMargin,
            formatter: yAxisFormat,
            color: toRGBAColorString(formData.xAxisLabelColor),
          },
          axisLine: {
            lineStyle: {
              color: toRGBAColorString(formData.xAxisLabelColor),
            },
          },
        },
      ],
      series,
    };
  }

  render() {
    const { width, height } = this.props;
    return (
      <div>
        <Echarts
          notMerge
          style={{ width: `${width} px`, height: `${height}px` }}
          option={applyOptionExtends(this.getOption(), this.props)}
        />
      </div>
    );
  }
}
