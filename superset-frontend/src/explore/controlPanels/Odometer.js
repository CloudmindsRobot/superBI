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
      controlSetRows: [['metric'], ['adhoc_filters']],
    },
    {
      label: t('Options'),
      expanded: true,
      controlSetRows: [['subheader'], ['y_axis_format']],
    },
    {
      label: t('Chart Options'),
      expanded: true,
      controlSetRows: [['header_font_size'], ['odometer_theme'], ['font_size'], ['color']],
    },
  ],
  controlOverrides: {
    y_axis_format: {
      label: t('Number format'),
      default: '(,ddd)',
      choices: [
        ['(,ddd)', '(,ddd)    -  12,345,678'],
        ['(,ddd).dd', '(,ddd).dd -  12,345,678.09'],
        ['(.ddd),dd', '(.ddd),dd -  12.345.678,09'],
        ['( ddd),dd', '( ddd),dd -  12 345 678,09'],
        ['d',        '-  12345678']
      ] 
    },
    header_font_size: {
      label: t('Big Number Font Size'),
    },
    font_size: {
      label: t('Fixed Font Size')
    }
  },
};
