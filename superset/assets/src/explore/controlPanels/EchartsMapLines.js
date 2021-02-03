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
import timeGrainSqlaAnimationOverrides from './timeGrainSqlaAnimationOverrides';

export default {
  requiresTime: true,
  onInit: controlState => ({
    ...controlState,
    time_grain_sqla: {
      ...controlState.time_grain_sqla,
      value: null,
    },
    granularity: {
      ...controlState.granularity,
      value: null,
    },
  }),
  controlPanelSections: [
    {
      label: t('Query'),
      expanded: true,
      controlSetRows: [
        ['start_point', "end_point"],
        ['row_limit', 'filter_nulls'],
        ['adhoc_filters', 'use_UTC'],
      ],
    },
    {
      label: t('Map Options'),
      expanded: true,
      controlSetRows: [
        ['echarts_map_type'],
        ['color', {
            name: "area_color",
            renderTrigger: true,
            config: {
                type: "ColorPickerControl",
                label: t("Area Color"),
                // #101f32
                default: {r: 16, g: 31,  b: 20, a: 255}
            }
        }, {
            name: "border_color",
            renderTrigger: true,
            config: {
                type: "ColorPickerControl",
                label: t("Border Color"),
                // #43d0d6
                default: {r: 67, g: 208,  b: 214, a: 255}
            }
        }]
      ]
    },
    {
        label: t('line Options'),
        expanded: true,
        controlSetRows: [
          [
            {
            name: "line_color",
            config: {
              renderTrigger: true,
                type: "ColorPickerControl",
                label: t("Line Color"),
                // #f19000
                default: {r: 241, g: 144,  b: 0, a: 255}
            }
        },
        {
          name: "line_width",
          config: {
            type: "TextControl",
            default: 2,
            label: t("Line Width")
          }
        },
        {
          name: "effect_symbol_size",
          config: {
            type: "TextControl",
            renderTrigger: true,
            default: 6,
            label: t("Effect Symbol Size")
          }
        }
      ],
        ]
    },
    {
      label: t('Scatter Options'),
      expanded: true,
      controlSetRows: [
        [
          {
          name: "scatter_color",
          config: {
            renderTrigger: true,
              type: "ColorPickerControl",
              label: t("Scatter Color"),
              // #f00
              default: {r: 240, g: 0,  b: 0, a: 255}
          }
      },
      {
        name: "ripple_effect_color",
        config: {
          type: "ColorPickerControl",
          renderTrigger: true,
          //f19000
          default: {r: 241, g: 144,  b: 0, a: 255},
          label: t("Ripple Effect Color")
        }
      }
    ],
      ]
  }
  ],
  controlOverrides: {
    dimension: {
      label: t('Categorical Color'),
      description: t(
        'Pick a dimension from which categorical colors are defined',
      ),
    },
    color: {
      label: t("Background Color"),
      default: {r: 255, g:255, b:255,a:0 }
    },
    size: {
      validators: [],
    },
    time_grain_sqla: timeGrainSqlaAnimationOverrides,
  },
};
