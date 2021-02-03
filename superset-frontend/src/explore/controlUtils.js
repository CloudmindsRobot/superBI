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
import memoizeOne from 'memoize-one';
import { getChartControlPanelRegistry } from '@superset-ui/chart';
import { expandControlConfig } from '@superset-ui/chart-controls';
import * as SECTIONS from './controlPanels/sections';
import controls from './controls';

function isGlobalControl(controlKey) {
  return controlKey in controls;
}

export function getFormDataFromControls(controlsState) {
  const formData = { queryFields: {} };
  Object.keys(controlsState).forEach(controlName => {
    const control = controlsState[controlName];
    formData[controlName] = control.value;
    if (control.hasOwnProperty('queryField')) {
      formData.queryFields[controlName] = control.queryField;
    }
  });
  return formData;
}

export function validateControl(control, processedState) {
  const validators = control.validators;
  const validationErrors = [];
  if (validators && validators.length > 0) {
    validators.forEach(f => {
      const v = f.call(control, control.value, processedState);
      if (v) {
        validationErrors.push(v);
      }
    });
  }
  // always reset validation errors even when there is no validator
  return { ...control, validationErrors };
}

/**
 * Find control item from control panel config.
 */
function findControlItem(controlPanelSections, controlKey) {
  for (const section of controlPanelSections) {
    for (const controlArr of section.controlSetRows) {
      for (const control of controlArr) {
        if (controlKey === control) return control;
        if (
          control !== null &&
          typeof control === 'object' &&
          control.name === controlKey
        ) {
          return control;
        }
      }
    }
  }
  return null;
}

export const getControlConfig = memoizeOne(function getControlConfig(
  controlKey,
  vizType,
) {
  const controlPanelConfig = getChartControlPanelRegistry().get(vizType) || {};
  const {
    controlOverrides = {},
    controlPanelSections = [],
  } = controlPanelConfig;

  const control = expandControlConfig(
    findControlItem(controlPanelSections, controlKey),
    controlOverrides,
  );
  return control?.config || control;
});

function handleMissingChoice(control) {
  // If the value is not valid anymore based on choices, clear it
  const value = control.value;
  if (
    control.type === 'SelectControl' &&
    !control.freeForm &&
    control.choices &&
    value
  ) {
    const alteredControl = { ...control };
    const choiceValues = control.choices.map(c => c[0]);
    if (control.multi && value.length > 0) {
      alteredControl.value = value.filter(el => choiceValues.indexOf(el) > -1);
      return alteredControl;
    } else if (!control.multi && choiceValues.indexOf(value) < 0) {
      alteredControl.value = null;
      return alteredControl;
    }
  }
  return control;
}

export function applyMapStateToPropsToControl(controlState, controlPanelState) {
  const { mapStateToProps } = controlState;
  let { value } = controlState;
  let state = { ...controlState };
  if (mapStateToProps && controlPanelState) {
    state = {
      ...controlState,
      ...mapStateToProps(controlPanelState, controlState),
    };
  }
  // If default is a function, evaluate it
  if (typeof state.default === 'function') {
    state.default = state.default(state, controlPanelState);
    // if default is still a function, discard
    if (typeof state.default === 'function') {
      delete state.default;
    }
  }
  // If no current value, set it as default
  if ( value === undefined) {
    value = state.default;
  }
  // If a choice control went from multi=false to true, wrap value in array
  if (value && state.multi && !Array.isArray(value)) {
    value = [value];
  }
  state.value = value;
  return validateControl(handleMissingChoice(state), state);
}

export function getControlStateFromControlConfig(
  controlConfig,
  controlPanelState,
  value,
) {
  // skip invalid config values
  if (!controlConfig) {
    return null;
  }
  const controlState = { ...controlConfig, value };
  // only apply mapStateToProps when control states have been initialized
  // or when explicitly didn't provide control panel state (mostly for testing)
  if (
    (controlPanelState && controlPanelState.controls) ||
    controlPanelState === null
  ) {
    return applyMapStateToPropsToControl(controlState, controlPanelState);
  }
  return controlState;
}

export function getControlState(controlKey, vizType, state, value) {
  return getControlStateFromControlConfig(
    getControlConfig(controlKey, vizType),
    state,
    value,
  );
}

/**
 * Get the clean and processed control panel sections
 */
export const sectionsToRender = memoizeOne(function sectionsToRender(
  vizType,
  datasourceType,
) {
  const controlPanelConfig = getChartControlPanelRegistry().get(vizType) || {};
  const {
    sectionOverrides = {},
    controlOverrides,
    controlPanelSections = [],
  } = controlPanelConfig;

  //add sql option
  const sqlOption = {
    label: 'SQL',
    expanded: true,
    controlSetRows: [
      [{
        name: 'sql',
        config: {
          type: 'TextAreaControl',
          label: 'SQL',
          description: 'Put your sql code here,use this function with caution',
          aboveEditorSection: (
            <div>
              <p>When you use filterBox in Dashboards,you can add variable @filters in sql statement</p>
              <p>eg:</p>
              <p>SELECT * FROM table WHERE @filters</p>
              <p>If you want to execute multi-statement sql,please use variable @split</p>
              <p>eg:</p>
              <p>SELECT * FROM table1;@split SELECT * FROM table2;</p>
            </div>
          ),
          mapStateToProps: state => ({
            warning:"When you use filterBox in Dashboards,you can add variable @filters in sql statement" + 
            "\n eg:" +
            "\n SELECT * FROM table WHERE @filters",
            language:
              state.controls && state.controls.markup_type
                ? state.controls.markup_type.value
                : 'markdown',
          }),
          default: '',
        },
      }]
    ],
    isInsert:true
  };
  controlPanelSections[1] && controlPanelSections[1].isInsert 
  ? ""
  : controlPanelSections.splice(1,0,sqlOption);
  // default control panel sections
  const sections = { ...SECTIONS };


  // apply section overrides
  Object.entries(sectionOverrides).forEach(([section, overrides]) => {
    if (typeof overrides === 'object' && overrides.constructor === Object) {
      sections[section] = {
        ...sections[section],
        ...overrides,
      };
    } else {
      sections[section] = overrides;
    }
  });

  const { datasourceAndVizType, sqlaTimeSeries, druidTimeSeries, CSVOptions } = sections;
  const timeSection =
    datasourceType === 'table' ? sqlaTimeSeries : druidTimeSeries;

    if(vizType === 'table') {
      controlPanelSections.push(CSVOptions);
    }

  const ret = []
  .concat(datasourceAndVizType, timeSection, controlPanelSections)
  .filter(section => !!section)
  .map(section => {
    const { controlSetRows } = section;
    return {
      ...section,
      controlSetRows:
        controlSetRows?.map(row =>
          row.map(item => {
            let control = expandControlConfig(item, controlOverrides);
            if(typeof control === 'string') {
              control = {
                name: control,
                config: getGlobalControlConfig(control, vizType)
              }
            }

            return control;
          }),
        ) || [],
    };
  });

  return ret
});
// export function sectionsToRender(vizType, datasourceType) {
//   const controlPanelConfig = getChartControlPanelRegistry().get(vizType) || {};
//   const {
//     sectionOverrides = {},
//     controlPanelSections = [],
//   } = controlPanelConfig;

//   //add sql option
//   const sqlOption = {
//     label: 'SQL',
//     expanded: true,
//     controlSetRows: [
//       ['sql']
//     ],
//     isInsert:true
//   };
//   controlPanelSections[1] && controlPanelSections[1].isInsert 
//   ? ""
//   : controlPanelSections.splice(1,0,sqlOption);

//   const sectionsCopy = { ...sections };

//   Object.entries(sectionOverrides).forEach(([section, overrides]) => {
//     if (typeof overrides === 'object' && overrides.constructor === Object) {
//       sectionsCopy[section] = {
//         ...sectionsCopy[section],
//         ...overrides,
//       };
//     } else {
//       sectionsCopy[section] = overrides;
//     }
//   });

//   const {
//     datasourceAndVizType,
//     sqlaTimeSeries,
//     druidTimeSeries,
//   } = sectionsCopy;

//   return []
//     .concat(
//       datasourceAndVizType,
//       datasourceType === 'table' ? sqlaTimeSeries : druidTimeSeries,
//       controlPanelSections,
//     )
//     .filter(section => section);
// }

export function getAllControlsState(vizType, datasourceType, state, formData) {
  const controlsState = {};
  sectionsToRender(vizType, datasourceType).forEach(section =>
    section.controlSetRows.forEach(fieldsetRow =>
      fieldsetRow.forEach(field => {
        if (field && field.config && field.name) {
          const { config, name } = field;
          controlsState[name] = getControlStateFromControlConfig(
            config,
            state,
            formData[name],
          );
        }
      }),
    ),
  );
  return controlsState;
}

export function getGlobalControlConfig(controlKey, vizType) {
  // Gets the control definition, applies overrides, and executes
  // the mapStatetoProps
  const controlPanelConfig = getChartControlPanelRegistry().get(vizType) || {};
  const {
    controlOverrides = {},
    controlPanelSections = [],
  } = controlPanelConfig;

  if (!isGlobalControl(controlKey)) {
    for (const section of controlPanelSections) {
      for (const controlArr of section.controlSetRows) {
        for (const control of controlArr) {
          if (control != null && typeof control === 'object') {
            if (control.config && control.name === controlKey) {
              return {
                ...control.config,
                ...controlOverrides[controlKey],
              };
            }
          }
        }
      }
    }
  }

  return {
    ...controls[controlKey],
    ...controlOverrides[controlKey],
  };
}