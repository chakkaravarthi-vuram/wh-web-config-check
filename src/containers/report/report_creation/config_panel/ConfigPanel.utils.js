import React from 'react';
import { EChartsType } from '@workhall-pvt-lmt/wh-ui-library';
import BarVerticalIconV2 from 'assets/icons/BarVerticalIconV2';
import BarHorizontalIconV2 from 'assets/icons/BarHorizontalIconV2';
import BarStackedIconV2 from 'assets/icons/BarStackedIconV2';
import BarClusteredIconV2 from 'assets/icons/BarClusteredIconV2';
import PieChartIconV2 from 'assets/icons/PieChartIconV2';
import DonutIconV2 from 'assets/icons/DonutIconV2';
import LineChartIcon from 'assets/icons/LineChartIcon';
import jsUtility from '../../../../utils/jsUtility';
import { EMPTY_STRING } from '../../../../utils/strings/CommonStrings';
import CONFIG_PANEL_STRINGS, {
  GROUP_FIELD_TYPES,
  SORT_BY_VALUE,
} from './ConfigPanel.strings';
import { getOutputKey } from '../ReportCreation.utils';
import {
  CLUSTERED_TYPES,
  REPORT_CATEGORY_TYPES,
  REPORT_VISUALIZATION_TYPES,
  SINGLED_TYPES,
} from '../../Report.strings';

export const VISUALIZATION_TYPES = (t) => {
  const { REPORT_VISUALIZATION_STRINGS } = CONFIG_PANEL_STRINGS(t);

  return [
    {
      name: REPORT_VISUALIZATION_STRINGS.VERTICAL_BAR,
      id: REPORT_VISUALIZATION_TYPES.VERTICAL_BAR,
      icon: <BarVerticalIconV2 />,
      type: EChartsType.verticalBar,
    },
    {
      name: REPORT_VISUALIZATION_STRINGS.HORIZONTAL_BAR,
      id: REPORT_VISUALIZATION_TYPES.HORIZONTAL_BAR,
      icon: <BarHorizontalIconV2 />,
      type: EChartsType.horizontalBar,
    },
    {
      name: REPORT_VISUALIZATION_STRINGS.STACKED,
      id: REPORT_VISUALIZATION_TYPES.STACKED,
      icon: <BarStackedIconV2 />,
      type: EChartsType.stackedBar,
    },
    {
      name: REPORT_VISUALIZATION_STRINGS.CLUSTERED,
      id: REPORT_VISUALIZATION_TYPES.CLUSTERED,
      icon: <BarClusteredIconV2 />,
      type: EChartsType.clusteredBar,
    },
    {
      name: REPORT_VISUALIZATION_STRINGS.PIE,
      id: REPORT_VISUALIZATION_TYPES.PIE,
      icon: <PieChartIconV2 />,
      type: EChartsType.pie,
    },
    {
      name: REPORT_VISUALIZATION_STRINGS.DONUT,
      id: REPORT_VISUALIZATION_TYPES.DONUT,
      icon: <DonutIconV2 />,
      type: EChartsType.doughnut,
    },
    {
      name: REPORT_VISUALIZATION_STRINGS.LINE,
      id: REPORT_VISUALIZATION_TYPES.LINE,
      icon: <LineChartIcon />,
      type: EChartsType.line,
    },
  ];
};

export const getVisualizationTypes = (
  visualizationArr,
  reportCategory,
  visualizationType,
  reports,
) => {
  let y = 0;
  const isChartView = reportCategory === REPORT_CATEGORY_TYPES.CHART;
  reports.selectedFieldsFromReport.forEach((d) => {
    if (d.axis === 'y') y++;
  });
  const arr = visualizationArr.map((v) => {
    const _v = { ...v, disabled: true, selected: false };
    if (isChartView) {
      _v.selected = v.id === visualizationType;
      if (reports.is_break_down) {
        _v.disabled = v.id !== REPORT_VISUALIZATION_TYPES.STACKED;
      } else if (y < 2) {
        _v.disabled = !SINGLED_TYPES.includes(v.id);
      } else if (y >= 2) {
        _v.disabled = !CLUSTERED_TYPES.includes(v.id);
      } else {
        _v.disabled = false;
      }
    }

    return _v;
  });

  if (isChartView) {
    arr.sort((v1, v2) => (!v2.disabled ? 1 : -1));
  }

  return arr;
};

export const initialStateFieldEdit = {
  isEdit: false,
  output_key: EMPTY_STRING,
  measureDimension: EMPTY_STRING,
  monthYearValue: EMPTY_STRING,
  skipNullValues: true,
  fieldDisplayName: EMPTY_STRING,
  chartSelectedRange: [
    {
      label: EMPTY_STRING,
      boundary: [],
    },
  ],
  isRangeSelected: false,
};

export const getSortBySelectedFieldValue = (t, selectedFieldsFromReport) => {
  const reData = {
    sortBySelectedFieldValue: EMPTY_STRING,
    sortBySelectedValue: EMPTY_STRING,
  };
  if (
    jsUtility.isArray(selectedFieldsFromReport) &&
    selectedFieldsFromReport.length === 0
  ) {
    return reData;
  }

  const { axis, output_key, aggregation_type } = selectedFieldsFromReport[0];
  if (axis === 'x' || axis === 'y') {
    reData.sortBySelectedFieldValue = getOutputKey(
      output_key,
      aggregation_type,
    );
  } else {
    reData.sortBySelectedFieldValue = output_key;
  }
  reData.sortBySelectedValue = SORT_BY_VALUE.ASC;
  return reData;
};

const getGroupedFieldsEmptyObj = (t) => {
  const { FIELD_HEADER } = CONFIG_PANEL_STRINGS(t);
  const groupedFieldsObj = {
    [FIELD_HEADER.TEXT]: [],
    [FIELD_HEADER.NUMBER]: [],
    [FIELD_HEADER.SINGLE_SELECTION]: [],
    [FIELD_HEADER.MULTI_SELECTION]: [],
    [FIELD_HEADER.CURRENCY]: [],
    [FIELD_HEADER.DATE]: [],
    [FIELD_HEADER.DATE_TIME]: [],
    [FIELD_HEADER.TABLES]: [],
  };
  return jsUtility.cloneDeep(groupedFieldsObj);
};

const getGroupedFieldsByType = (
  t,
  fields,
  groupedFields,
  isGroupTableFields = false,
) => {
  const { FIELD_HEADER } = CONFIG_PANEL_STRINGS(t);
  if (!fields || !groupedFields) {
    return groupedFields;
  }

  fields.forEach((dField) => {
    const { isDataReferenceField, fieldType } = dField;
    if (
      (GROUP_FIELD_TYPES.TABLE.includes(fieldType) || dField?.is_table_field) &&
      !isGroupTableFields
    ) {
      groupedFields[FIELD_HEADER.TABLES].push({ ...dField });
    } else if (GROUP_FIELD_TYPES.TEXT.includes(fieldType)) {
      groupedFields[FIELD_HEADER.TEXT].push({ ...dField });
    } else if (GROUP_FIELD_TYPES.NUMBER.includes(fieldType)) {
      groupedFields[FIELD_HEADER.NUMBER].push({ ...dField });
    } else if (GROUP_FIELD_TYPES.SINGLE_SELECTION.includes(fieldType)) {
      groupedFields[FIELD_HEADER.SINGLE_SELECTION].push({ ...dField });
    } else if (GROUP_FIELD_TYPES.MULTI_SELECTION.includes(fieldType)) {
      groupedFields[FIELD_HEADER.MULTI_SELECTION].push({ ...dField });
    } else if (GROUP_FIELD_TYPES.CURRENCY.includes(fieldType)) {
      groupedFields[FIELD_HEADER.CURRENCY].push({ ...dField });
    } else if (GROUP_FIELD_TYPES.DATE.includes(fieldType)) {
      groupedFields[FIELD_HEADER.DATE].push({ ...dField });
    } else if (GROUP_FIELD_TYPES.DATE_TIME.includes(fieldType)) {
      groupedFields[FIELD_HEADER.DATE_TIME].push({ ...dField });
    } else if (
      isDataReferenceField ||
      GROUP_FIELD_TYPES.MULTI_SELECTION.includes(dField.fieldType)
    ) {
      groupedFields[FIELD_HEADER.MULTI_SELECTION].push({ ...dField });
    }
  });

  return jsUtility.cloneDeep(groupedFields);
};

export const getGroupedTableFields = (fields, t) => {
  const tableFields = [];
  const groupedFields = getGroupedFieldsByType(
    t,
    fields,
    getGroupedFieldsEmptyObj(t),
    true,
  );

  Object.keys(groupedFields).forEach((key) => {
    groupedFields[key].forEach((field, idx) => {
      if (idx === 0) field.groupFieldType = key;
      else field.groupFieldType = undefined;
      tableFields.push(field);
    });
  });

  return tableFields;
};

export const getGroupedField = (t, systemFields, dataFields) => {
  const { FIELD_HEADER } = CONFIG_PANEL_STRINGS(t);
  const groupedSystemFields = getGroupedFieldsByType(
    t,
    systemFields,
    getGroupedFieldsEmptyObj(t),
  );
  const groupedDataFields = getGroupedFieldsByType(
    t,
    dataFields,
    getGroupedFieldsEmptyObj(t),
  );
  const systemFieldsArr = [];
  const dataFieldsArr = [];
  let tableFields = [];

  Object.keys(groupedSystemFields).forEach((fieldType) => {
    if (groupedSystemFields[fieldType].length > 0) {
      if (fieldType === FIELD_HEADER.TABLES) {
        // Your array of objects
        const data = groupedSystemFields[fieldType];
        tableFields = data;
        // Create an object to store the unique objects based on table_name and table_reference_name
        const uniqueTables = data.reduce((acc, currentObject) => {
          const key = `${currentObject.table_name}-${currentObject.table_reference_name}`;
          if (!acc[key]) {
            acc[key] = currentObject;
          }
          return acc;
        }, {});
        const uniqueTablesList = Object.values(uniqueTables);
        uniqueTablesList?.forEach((field, idx) => {
          if (idx === 0) field.groupFieldType = fieldType;
          else field.groupFieldType = undefined;
          dataFieldsArr.push(field);
        });
      } else {
        groupedSystemFields[fieldType].forEach((field, idx) => {
          if (idx === 0) field.groupFieldType = fieldType;
          else field.groupFieldType = undefined;
          systemFieldsArr.push(field);
        });
      }
    }
  });

  Object.keys(groupedDataFields).forEach((fieldType) => {
    if (groupedDataFields[fieldType].length > 0) {
      if (fieldType === FIELD_HEADER.TABLES) {
        // Your array of objects
        const data = groupedDataFields[fieldType];
        tableFields = data;
        // Create an object to store the unique objects based on table_name and table_reference_name
        const uniqueTables = data.reduce((acc, currentObject) => {
          const key = `${currentObject.table_name}-${currentObject.table_reference_name}`;
          if (!acc[key]) {
            acc[key] = currentObject;
          }
          return acc;
        }, {});
        const uniqueTablesList = Object.values(uniqueTables);
        uniqueTablesList?.forEach((field, idx) => {
          if (idx === 0) field.groupFieldType = fieldType;
          else field.groupFieldType = undefined;
          dataFieldsArr.push(field);
        });
      } else {
        groupedDataFields[fieldType].forEach((field, idx) => {
          if (idx === 0) field.groupFieldType = fieldType;
          else field.groupFieldType = undefined;
          dataFieldsArr.push(field);
        });
      }
    }
  });

  return [systemFieldsArr, dataFieldsArr, tableFields];
};

export const getSystemAndDataFields = (inputFieldsForReport) => {
  const systemFields = [];
  const dataFields = [];
  inputFieldsForReport.forEach((data) => {
    const { is_system_field } = data;
    !is_system_field ? dataFields.push(data) : systemFields.push(data);
  });
  return [systemFields, dataFields];
};

export const getSelectedFieldsByAllSourceFields = (
  allSourceFields,
  sourceUuid,
) => {
  if (
    !jsUtility.isEmpty(allSourceFields) &&
    !jsUtility.isArray(allSourceFields) &&
    !sourceUuid
  ) {
    return allSourceFields;
  }

  const selectedFields = [];
  allSourceFields?.forEach((fields) => {
    if (fields.contextUuid === sourceUuid) {
      selectedFields.push(fields);
    }
  });
  return selectedFields;
};

export const getSortByDimensionOptionList = (inputFieldsForReport) => {
  const sortByDimensionOptionList = [];
  if (
    !jsUtility.isEmpty(inputFieldsForReport) &&
    jsUtility.isArray(inputFieldsForReport) &&
    inputFieldsForReport.length > 0
  ) {
    inputFieldsForReport.forEach((cDimension) => {
      const { label, axis, aggregation_type, output_key, fieldDisplayName } =
        cDimension;
      const objOption = {
        label: EMPTY_STRING,
        value: EMPTY_STRING,
      };
      objOption.label = label;
      objOption.value = output_key;

      if (axis === 'x' || axis === 'y') {
        objOption.label = fieldDisplayName;
        objOption.value = getOutputKey(output_key, aggregation_type);
      }
      sortByDimensionOptionList.push(objOption);
    });
  }
  return jsUtility.uniqBy(sortByDimensionOptionList, (obj) => obj.value);
};
