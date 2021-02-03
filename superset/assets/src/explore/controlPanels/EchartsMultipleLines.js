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
import { t } from '@superset-ui/translation';
import { annotations } from './sections';
import { D3_TIME_FORMAT_OPTIONS } from '../controls';


const seriesTypeConfig = {
    label: t("Series Type"),
    type: "SelectControl",
    renderTrigger: true,
    description:  t("See https://www.echartsjs.com/zh/option.html#series"),
    default: "line",
    choices: [
      ["line", "Line"],
      ["bar", "Bar"],
    ]
}

export default {
  requiresTime: true,
  controlPanelSections: [
    {
      label: t('Chart Options'),
      expanded: true,
      controlSetRows: [
          ['color_scheme', 'label_colors'],
          ['show_legend', 'show_area_style', 'use_UTC'],
          ['rich_tooltip', 'show_markers'],
          ['smooth', 'bar_stacked'],
        ],
    },
    {
      label: t('Y Axis 1'),
      expanded: true,
      controlSetRows: [
          ['metric', 'y_axis_format'],
          [{
            name: "seriestype",
            config: seriesTypeConfig
          }]
        ],
    },
    {
      label: t('Y Axis 2'),
      expanded: true,
      controlSetRows: [
          ['metric_2', 'y_axis_2_format'],
          [{
            name: "seriestype_2",
            config: seriesTypeConfig
          }]
        ],
    },
    {
      label: t('Query'),
      expanded: true,
      controlSetRows: [['adhoc_filters', 'row_limit']],
    },
    {
        label: t('X Axis'),
        expanded: true,
        controlSetRows: [
          ['show_x_axis_line', 'axis_type'],
          ['x_axis_label', 'bottom_margin'],
          ['label_value_rotate', 'x_axis_format'],
          ['x_axis_showminmax', 'x_axis_label_color'],
        ],
      },
    // annotations,
  ],
  controlOverrides: {
    metric: {
      label: t('Left Axis Metric'),
      description: t('Choose a metric for left axis'),
    },
    y_axis_format: {
      label: t('Left Axis Format'),
    },
    x_axis_format: {
      choices: D3_TIME_FORMAT_OPTIONS,
      default: 'smart_date',
    },
  },
};
