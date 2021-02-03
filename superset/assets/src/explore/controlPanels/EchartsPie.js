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

export default {
  controlPanelSections: [
    {
      label: t('Query'),
      expanded: true,
      controlSetRows: [
        ['metric'],
        ['adhoc_filters'],
        ['groupby'],
        ['row_limit'],
      ],
    },
    {
      label: t('Chart Options'),
      expanded: true,
      controlSetRows: [
        ['pie_label_type',  {
          name: "rouse_type",
          config: {
            label: t("Rouse Type"),
            description: t("See https://www.echartsjs.com/zh/option.html#series-pie.roseType"),
            type: "CheckboxControl",
            default: false,
          }
        }],
        ['show_labels', 'show_legend', 'use_UTC'],
        [ 
            {
                name: "label_position",
                config: {
                  label: t("Label Position"),
                  type: "SelectControl",
                  renderTrigger: true,
                  description:  t("See https://www.echartsjs.com/zh/option.html#series-pie.label.position"),
                  default: "outside",
                  choices: [
                    ["inside", "inside"],
                    ["outside", "outside"],
                    ["center", "center"]
                  ]
                }
            },
            'color_scheme'
        ],
        [
          {
            name: "center_x",
            config: {
              label: t("Pie Center X"),
              renderTrigger: true,
              type: "TextControl",
              default: "50",
              description: t("See https://www.echartsjs.com/zh/option.html#series-pie.center")
            }
          },
          {
            name: "center_y",
            config: {
              label: t("Pie Center Y"),
              renderTrigger: true,
              type: "TextControl",
              default: "50",
              description: t("See https://www.echartsjs.com/zh/option.html#series-pie.center")
            }
          }
        ],
        [
          {
            name: "radius_inner",
            config: {
              label: t("Radius Inner"),
              renderTrigger: true,
              type: "TextControl",
              default: "0",
              description: t("See https://www.echartsjs.com/zh/option.html#series-pie.center")
            }
          },
          {
            name: "radius_outer",
            config: {
              label: t("Radius Inner"),
              renderTrigger: true,
              type: "TextControl",
              default: "80",
              description: t("See https://www.echartsjs.com/zh/option.html#series-pie.center")
            }
          }
        ]
      ],
    },
  ],
  controlOverrides: {
    row_limit: {
      default: 25,
    },
    number_format: {
      description:
        t('D3 format syntax: https://github.com/d3/d3-format') +
        ' ' +
        t('Only applies when the "Label Type" is not set to a percentage.'),
    },
  },
};
