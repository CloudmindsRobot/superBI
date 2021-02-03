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
import { getChartControlPanelRegistry } from '@superset-ui/chart';
import MainPreset from '../visualizations/presets/MainPreset';
import setupPluginsExtra from './setupPluginsExtra';

import DeckArc from '../explore/controlPanels/DeckArc';
import DeckGeojson from '../explore/controlPanels/DeckGeojson';
import DeckGrid from '../explore/controlPanels/DeckGrid';
import DeckHex from '../explore/controlPanels/DeckHex';
import DeckMulti from '../explore/controlPanels/DeckMulti';
import DeckPath from '../explore/controlPanels/DeckPath';
import DeckPolygon from '../explore/controlPanels/DeckPolygon';
import DeckScatter from '../explore/controlPanels/DeckScatter';
import DeckScreengrid from '../explore/controlPanels/DeckScreengrid';
import FilterBox from '../explore/controlPanels/FilterBox';
import Separator from '../explore/controlPanels/Separator';
import TimeTable from '../explore/controlPanels/TimeTable';


import WordCloud from '../explore/controlPanels/WordCloud';
import WorldMap from '../explore/controlPanels/WorldMap';
import EchartsLine from  '../explore/controlPanels/EchartsLine';
import ScatterGL from '../explore/controlPanels/ScatterGL';
import Echarts3DLines from '../explore/controlPanels/Echarts3DLines';
import Odometer from "../explore/controlPanels/Odometer";
import WordCloud3D from "../explore/controlPanels/WordCloud3D";
import CarouselTable from "../explore/controlPanels/CarouselTable";
import EchartsPie from "../explore/controlPanels/EchartsPie";
import EchartsBar from "../explore/controlPanels/EchartsBar";
import EchartsMultipleLines from "../explore/controlPanels/EchartsMultipleLines";
import EchartsMapLines from "../explore/controlPanels/EchartsMapLines";
import EchartsPictorialBar from "../explore/controlPanels/EchartsPictorialBar";

export default function setupPlugins() {
  new MainPreset().register();

  // TODO: Remove these shims once the control panel configs are moved into the plugin package.
  getChartControlPanelRegistry()
    .registerValue('separator', Separator)
    .registerValue('time_table', TimeTable)
    .registerValue('deck_arc', DeckArc)
    .registerValue('deck_geojson', DeckGeojson)
    .registerValue('deck_grid', DeckGrid)
    .registerValue('deck_hex', DeckHex)
    .registerValue('deck_multi', DeckMulti)
    .registerValue('deck_path', DeckPath)
    .registerValue('deck_polygon', DeckPolygon)
    .registerValue('deck_scatter', DeckScatter)
    .registerValue('filter_box', FilterBox)
    .registerValue('deck_screengrid', DeckScreengrid)
    .registerValue('Echarts', EchartsLine)
    .registerValue('scatter_gl', ScatterGL)
    .registerValue("Echarts3DLines",  Echarts3DLines)
    .registerValue("Odometer", Odometer)
    .registerValue("WordCloud3D", WordCloud3D)
    .registerValue("CarouselTable", CarouselTable)
    .registerValue("EchartsPie", EchartsPie)
    .registerValue("EchartsBar", EchartsBar)
    .registerValue("EchartsMultipleLines", EchartsMultipleLines)
    .registerValue("EchartsMapLines", EchartsMapLines)
    .registerValue("EchartsPictorialBar", EchartsPictorialBar)
    .registerValue('word_cloud', WordCloud)
    .registerValue('world_map', WorldMap)
  setupPluginsExtra();
}
