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
import airbnb from '@superset-ui/color/esm/colorSchemes/categorical/airbnb';
import categoricalD3 from '@superset-ui/color/esm/colorSchemes/categorical/d3';
import google from '@superset-ui/color/esm/colorSchemes/categorical/google';
import lyft from '@superset-ui/color/esm/colorSchemes/categorical/lyft';
import preset from '@superset-ui/color/esm/colorSchemes/categorical/preset';
import sequentialCommon from '@superset-ui/color/esm/colorSchemes/sequential/common';
import sequentialD3 from '@superset-ui/color/esm/colorSchemes/sequential/d3';
import {
  getCategoricalSchemeRegistry,
  getSequentialSchemeRegistry,
  SequentialScheme,
  CategoricalScheme,
} from '@superset-ui/color';
import superset from '@superset-ui/color/esm/colorSchemes/categorical/superset';


const EXTRA_COLOR_SCHEME = [
  {
    isDiverging: true,
    colors: [ "rgb(108, 176, 225)", 'rgb(70,159,237)', 'rgb(170,110,191)', 'rgb(245, 181, 106)', '#A0CE3A', '#31C5C0', '#7F6AAD', '#009D85', 'rgb(60, 72, 245,0.8)'],
    id: "EchartsColors",
    label: "Echarts Color Scheme",
    description: '',
  }
]

export default function setupColors() {
  // Register color schemes
  const categoricalSchemeRegistry = getCategoricalSchemeRegistry();
  [superset, airbnb, categoricalD3, google, lyft, preset].forEach(group => {
    group.forEach(scheme => {
      categoricalSchemeRegistry.registerValue(scheme.id, scheme);
    });
  });

  EXTRA_COLOR_SCHEME.map(config => new CategoricalScheme(config)).forEach(scheme => {
    categoricalSchemeRegistry.registerValue(scheme.id, scheme);
  })

  categoricalSchemeRegistry.setDefaultKey('bnbColors');
  // categoricalSchemeRegistry.setDefaultKey('supersetColors');

  EXTRA_COLOR_SCHEME.map(config => new CategoricalScheme(config)).forEach(scheme => {
    categoricalSchemeRegistry.registerValue(scheme.id, scheme);
  })

  // categoricalSchemeRegistry.setDefaultKey('bnbColors');

  const sequentialSchemeRegistry = getSequentialSchemeRegistry();
  [sequentialCommon, sequentialD3].forEach(group => {
    group.forEach(scheme => {
      sequentialSchemeRegistry.registerValue(scheme.id, scheme);
    });
  });
  sequentialSchemeRegistry.setDefaultKey('superset_seq_1');
}
