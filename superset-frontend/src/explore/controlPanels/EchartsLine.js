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
import { NVD3TimeSeries, annotations } from './sections';
import { D3_TIME_FORMAT_OPTIONS } from '../controls';

export default {
  requiresTime: true,
  controlPanelSections: [
    NVD3TimeSeries[0],
    {
      label: t('Chart Options'),
      expanded: true,
      controlSetRows: [
        ['color_scheme', 'label_colors'],
        ['show_legend', 'show_area_style'],
        ['rich_tooltip', 'show_markers'],
        ['smooth', 'use_UTC', 'bar_stacked'],
      ],
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
    {
      label: t('Y Axis'),
      expanded: true,
      controlSetRows: [
        ['show_y_axis_line'],
        ['y_axis_label', 'left_margin'],
        ['y_axis_showminmax', 'y_log_scale'],
        ['y_axis_format', 'y_axis_bounds'],
        ['y_axis_label_color']
      ],
    },
    // NVD3TimeSeries[1],
    // annotations,
  ],
  controlOverrides: {
    x_axis_format: {
      choices: D3_TIME_FORMAT_OPTIONS,
      default: 'smart_date',
    },
    row_limit: {
      default: 50000,
    },
  },
  sectionOverrides: {
    druidTimeSeries: {
      controlSetRows: [['granularity', 'druid_time_origin'], ['time_range']],
    },
    sqlaTimeSeries: {
      controlSetRows: [['granularity_sqla', 'time_grain_sqla'], ['time_range']],
    },
  },
};
