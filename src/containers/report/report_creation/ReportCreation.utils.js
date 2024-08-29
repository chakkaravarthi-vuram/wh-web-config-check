import React from 'react';
import moment from 'moment';
import {
  ETextSize,
  ETitleSize,
  Text,
  Title,
} from '@workhall-pvt-lmt/wh-ui-library';
import cx from 'classnames/bind';
import gClasses from '../../../scss/Typography.module.scss';
import { BS } from '../../../utils/UIConstants';
import jsUtility from '../../../utils/jsUtility';
import { EMPTY_STRING } from '../../../utils/strings/CommonStrings';
import { FIELD_TYPE } from '../../../utils/constants/form_fields.constant';
import { generateCurrencyFilterList } from '../../../utils/UtilityFunctions';
import { getDateFormatByDateTime } from '../../../components/dashboard_filter/FilterUtils';
import { generateReportQuery } from './ReportQuery.utils';
import {
  REPORT_SOURCE_TYPES,
  REPORT_CATEGORY_TYPES,
  AGGREGATE_TYPE,
} from '../Report.strings';
import { SORT_BY_VALUE } from './config_panel/ConfigPanel.strings';
import { FILTER_TYPES } from '../../../components/dashboard_filter/Filter.strings';
import { getDateFieldFormatValue, getSelectedOperatorByFieldType } from './FilterQuery.utils';

export const fieldYesNoData = [
  {
    label: 'Yes',
    value: true,
    isCheck: false,
  },
  {
    label: 'No',
    value: false,
    isCheck: false,
  },
];

export const getFieldValuesByType = (fieldType, fieldValues) => {
  let fieldData;
  switch (fieldType) {
    case FIELD_TYPE.SINGLE_LINE:
    case FIELD_TYPE.NUMBER:
    case FIELD_TYPE.PARAGRAPH:
    case FIELD_TYPE.EMAIL:
    case FIELD_TYPE.PHONE_NUMBER:
      fieldData = fieldValues;
      break;
    case FIELD_TYPE.DATE:
    case FIELD_TYPE.DATETIME:
      fieldData = fieldValues?.map((fieldData) => {
        return {
          value: fieldData,
          key: fieldData,
          isCheck: false,
        };
      });
      break;
    case FIELD_TYPE.DROPDOWN:
    case FIELD_TYPE.CHECKBOX:
    case FIELD_TYPE.RADIO_BUTTON:
    case FIELD_TYPE.RADIO_GROUP:
    case FIELD_TYPE.LOOK_UP_DROPDOWN:
      fieldData =
        fieldValues &&
        Object.keys(fieldValues).map((key) => {
          return {
            ...fieldData,
            label: key,
            value: fieldValues[key],
            isCheck: false,
          };
        });
      break;
    case FIELD_TYPE.YES_NO:
      fieldData = fieldYesNoData;
      break;
    case FIELD_TYPE.CURRENCY:
      fieldData = fieldValues;
      break;
    default:
  }
  return fieldData;
};

export const getOutputKey = (output_key, aggregation_type = EMPTY_STRING) => {
  let _output_key = output_key;
  if (aggregation_type && aggregation_type !== AGGREGATE_TYPE.NONE) {
    _output_key = `${output_key}_${aggregation_type.replaceAll(' ', '_')}`;
  }
  return _output_key;
};

export const getReportPublishData = (
  reportConfig,
  reports,
  filter,
  is_new,
  userFilter = {},
) => {
  const data = {
    is_new_report: is_new,
    report_name: reportConfig.name,
    report_description: reportConfig.description,
    report_config: {
      report_category: 1,
      report_type: 1,
      visualization_type: 1,
    },
    source_config: [],
    query_config: {
      default_filters: [],
      user_filter_options: [],
      additional_filter_data: {
        user_picker_filter_data: [],
        datalist_picker_filter_data: [],
      },
      sort_fields: [],
    },
    additional_config: {},
    owners: {
      users: [],
      teams: [],
    },
    viewers: {
      users: [],
      teams: [],
    },
  };
  if (!is_new) {
    data._id = reportConfig._id;
    data.report_uuid = reportConfig.uuid;
  }

  const { source_Data, report_Data } = reportConfig;
  const query = generateReportQuery(
    reports,
    filter,
    reportConfig,
    userFilter,
    {},
    true,
  );
  const {
    query_config: {
      selected_fields,
      selected_filters,
      sort_fields,
      user_filters,
    },
    user_picker_filter_data,
    datalist_picker_filter_data,
  } = query;

  if (report_Data.report_category === REPORT_CATEGORY_TYPES.CHART) {
    data.query_config.x_axis = [...selected_fields.x_axis];
    data.query_config.y_axis = [...selected_fields.y_axis];
  } else {
    data.query_config.report_fields = [...selected_fields.report_fields];
  }

  data.query_config.default_filters = selected_filters;
  data.query_config.user_filter_options = user_filters?.map((userFilter) => {
    if (userFilter?.values) {
      delete userFilter.values;
    }
    if (userFilter?.operator) {
      delete userFilter.operator;
    }
    return userFilter;
  });
  data.query_config.sort_fields = sort_fields;
  data.additional_config = query.additional_config;

  data.report_config.report_category = report_Data.report_category;
  data.report_config.report_type = report_Data.report_type;
  data.report_config.visualization_type = reportConfig.visualizationType;

  data.source_config = source_Data.map((source) => {
    const _source = { ...source };
    delete _source.source_name;
    _source.map_config = _source.map_config.map((map) => {
      const _map = { ...map };
      const { local_field_details, foreign_source_details } = _map;
      _map.local_field_details = jsUtility.omit(local_field_details, [
        'field_name',
      ]);
      _map.foreign_source_details = jsUtility.omit(foreign_source_details, [
        'field_name',
        'source_name',
      ]);
      return _map;
    });
    return _source;
  });

  data.owners.users = reportConfig.admins.users?.map((u) => u._id);
  data.owners.teams = reportConfig.admins.teams?.map((u) => u._id);
  data.viewers.users = reportConfig.viewers.users?.map((u) => u._id);
  data.viewers.teams = reportConfig.viewers.teams?.map((u) => u._id);

  if (user_picker_filter_data) {
    data.query_config.additional_filter_data.user_picker_filter_data =
      user_picker_filter_data;
  }

  if (datalist_picker_filter_data) {
    data.query_config.additional_filter_data.datalist_picker_filter_data =
      datalist_picker_filter_data;
  }

  return data;
};

export const getSelectedDimensions = (inputFieldsForReport, report) => {
  const { report_metadata, error_metadata = {} } = report;
  const { report_config, query_config } = report_metadata;
  let queryFields = [];
  const selectedDimensions = [];

  if (report_config.report_category === REPORT_CATEGORY_TYPES.CHART) {
    queryFields = [
      ...(query_config?.x_axis.map((x_field) => {
        return { ...x_field, axis: 'x' };
      }) || []),
      ...(query_config?.y_axis.map((y_field) => {
        return { ...y_field, axis: 'y' };
      }) || []),
    ];
  } else {
    queryFields = [...(query_config?.report_fields || [])];
  }

  queryFields.forEach((field) => {
    if (error_metadata.deleted_field_uuid?.includes(field.field_uuid)) {
      const { field_display_name } = field;
      selectedDimensions.push({
        ...field,
        fieldDisplayName: field_display_name,
        isMeasure:
          field.aggregation_type &&
          field.aggregation_type !== AGGREGATE_TYPE.NONE,
        skipNullValues: field.skip_null_values,
        isFieldDeleted: true,
        ddMonthYearSelectedValue: field?.aggregation_type,
      });
    } else {
      inputFieldsForReport.forEach((c) => {
        if (c.output_key === field.output_key) {
          const { field_display_name } = field;
          selectedDimensions.push({
            ...c,
            ...field,
            fieldDisplayName: field_display_name || c.fieldNames,
            isMeasure:
              field.aggregation_type &&
              field.aggregation_type !== AGGREGATE_TYPE.NONE,
            skipNullValues: field.skip_null_values,
            ddMonthYearSelectedValue: field?.aggregation_type,
          });
        }
      });
    }
  });

  return selectedDimensions;
};

const handleFilterValueForDateTimeFields = (filterObj) => {
  if (filterObj.values) {
    const isDateTime = filterObj.fieldType === FIELD_TYPE.DATETIME;
    const [fieldValue1, fieldValue2] = filterObj.values;
    if (fieldValue1) {
      filterObj.fieldUpdateBetweenOne = getDateFormatByDateTime(
        fieldValue1,
        isDateTime,
      );
    }
    if (fieldValue2) {
      filterObj.fieldUpdateBetweenTwo = getDateFormatByDateTime(
        fieldValue2,
        isDateTime,
      );
    }
  }
};
const handleFilterValueForUserTeamField = (filterObj, userPickerFilterData) => {
  filterObj.fieldUpdateValue = { users: [], teams: [] };
  if (filterObj.values) {
    userPickerFilterData.forEach((data) => {
      if (filterObj.values.includes(data._id)) {
        if (data.is_user) {
          const userObj = jsUtility.cloneDeep(data);
          userObj.username = data.user_name;
          filterObj.fieldUpdateValue.users.push(userObj);
        } else {
          const teamObj = jsUtility.cloneDeep(data);
          filterObj.fieldUpdateValue.teams.push(teamObj);
        }
      }
    });
  }
};
const handleFilterValueForDataList = (filterObj, datalistPickerFilterData) => {
  filterObj.fieldUpdateValue = [];
  if (filterObj.values) {
    datalistPickerFilterData.forEach((data) => {
      if (filterObj.values.includes(data.label)) {
        const datalistObj = jsUtility.cloneDeep(data);
        filterObj.fieldUpdateValue.push(datalistObj);
      }
    });
  }
};
const getAppliedFilterValues = (filterObj, additional_filter_data) => {
  const { user_picker_filter_data, datalist_picker_filter_data } =
    additional_filter_data;

  switch (filterObj.fieldType) {
    case FIELD_TYPE.DATE:
    case FIELD_TYPE.DATETIME:
      handleFilterValueForDateTimeFields(filterObj);
      break;
    case FIELD_TYPE.NUMBER:
    case FIELD_TYPE.CURRENCY:
      if (filterObj.values) {
        const [fieldValue1, fieldValue2] = filterObj.values;
        if (fieldValue1) filterObj.fieldUpdateBetweenOne = fieldValue1;
        if (fieldValue2) filterObj.fieldUpdateBetweenTwo = fieldValue2;
      }
      break;
    case FIELD_TYPE.USER_TEAM_PICKER:
      handleFilterValueForUserTeamField(filterObj, user_picker_filter_data);
      break;
    case FIELD_TYPE.DATA_LIST:
      handleFilterValueForDataList(filterObj, datalist_picker_filter_data);
      break;
    case FIELD_TYPE.DROPDOWN:
    case FIELD_TYPE.CHECKBOX:
    case FIELD_TYPE.RADIO_BUTTON:
    case FIELD_TYPE.LOOK_UP_DROPDOWN:
    case FIELD_TYPE.YES_NO:
      filterObj.fieldValues = filterObj.fieldValues.map((fv) => {
        if (filterObj.fieldUpdateValue.includes(fv.value)) {
          fv.isCheck = true;
        }
        return fv;
      });
      break;
    default:
      break;
  }
};

export const getAppliedFilter = (
  inputFieldDetailsForFilter,
  report,
  userFilter = false,
) => {
  const {
    report_metadata: { query_config, report_config },
    error_metadata = {},
  } = report;

  const appliedFilters = [];

  if (error_metadata.deleted_field_uuid.length > 0) {
    query_config?.default_filters?.forEach((field) => {
      if (error_metadata.deleted_field_uuid.includes(field.field_uuid)) {
        let queryFields = [];
        if (report_config.report_category === REPORT_CATEGORY_TYPES.CHART) {
          queryFields = [
            ...(query_config?.x_axis || []),
            ...(query_config?.y_axis || []),
          ];
        } else {
          queryFields = query_config?.report_fields;
        }

        const filterField = queryFields.find(
          (f) => f.field_uuid === field.field_uuid,
        );
        const filterObj = { ...jsUtility.cloneDeep(field), ...filterField };
        if (
          !jsUtility.isEmpty(filterField) &&
          jsUtility.isObject(filterField)
        ) {
          filterObj.fieldDisplayName =
            filterField?.field_display_name || EMPTY_STRING;
          filterObj.fieldNames =
            filterField?.field_display_name || EMPTY_STRING;
          filterObj.isAppliedFilter = true;
          filterObj.fieldUpdateValue = filterField?.values || [];
          filterObj.isFieldDeleted = true;
          getAppliedFilterValues(
            filterObj,
            query_config.additional_filter_data,
          );
        }
        appliedFilters.push(filterObj);
      }
    });
  }
  inputFieldDetailsForFilter.length > 0 &&
    inputFieldDetailsForFilter.forEach((field) => {
      const filterList = userFilter
        ? query_config?.user_filter_options
        : query_config?.default_filters;
      const filterField = filterList.find(
        (data) => data.output_key === field.output_key,
      );
      const filterObj = { ...jsUtility.cloneDeep(field), ...filterField };
      if (!jsUtility.isEmpty(filterField) && jsUtility.isObject(filterField)) {
        if (!userFilter) {
          filterObj.selectedOperator = filterField?.operator;
        }
        const { aggregation_type } = filterField;
        filterObj.fieldDisplayName =
          filterField.field_display_name || filterObj.fieldNames;
        filterObj.isMeasure =
          aggregation_type && aggregation_type !== AGGREGATE_TYPE.NONE;
        filterObj.isAppliedFilter = true;
        if (filterField.values) {
          filterObj.fieldUpdateValue = filterField.values || [];
        }
        getAppliedFilterValues(filterObj, query_config.additional_filter_data);
      }
      appliedFilters.push(filterObj);
    });

  return appliedFilters;
};

export const getSortField = (selectedFieldsFromReport, report_metadata) => {
  const { query_config } = report_metadata;
  const sort = {
    sortBySelectedFieldValue: EMPTY_STRING,
    sortBySelectedValue: EMPTY_STRING,
  };

  query_config.sort_fields?.forEach((field) => {
    selectedFieldsFromReport.forEach((c) => {
      const { output_key, aggregation_type } = field;
      const { axis } = c;
      if (c.output_key === field.output_key) {
        if (axis === 'x' || axis === 'y') {
          sort.sortBySelectedFieldValue = getOutputKey(
            output_key,
            aggregation_type,
          );
        } else {
          sort.sortBySelectedFieldValue = output_key;
        }
        sort.sortBySelectedValue =
          field.order_type === 1 ? SORT_BY_VALUE.ASC : SORT_BY_VALUE.DSC;
      }
    });
  });

  return sort;
};

export const generateQueryFromReportResponse = (report_metadata) => {
  const { additional_config, query_config, report_config, source_config, _id } =
    report_metadata;
  const query = {
    report_config: {
      is_chart: true,
      report_category: report_config.report_category,
    },
    query_config: {
      selected_fields: {},
      selected_filters: [],
      sort_fields: [],
      skip_data: 0,
      limit_data: 0,
    },
    additional_config,
  };

  const fn = ({
    field_display_name,
    aggregation_type = AGGREGATE_TYPE.NONE,
    output_key,
    is_breakdown,
    ...rest
  }) => {
    const data = {
      ...rest,
      aggregation_type,
      is_breakdown,
    };
    if (is_breakdown) {
      data.output_key = getOutputKey(output_key, 'breakdown');
    } else {
      data.output_key = getOutputKey(output_key, aggregation_type);
    }
    return data;
  };

  if (report_config.report_type === REPORT_SOURCE_TYPES.CROSS_FLOW_DATALIST) {
    query.source_config = source_config;
    query.report_config.report_id = _id;
  }

  if (report_config.report_category === REPORT_CATEGORY_TYPES.CHART) {
    query.report_config.report_category = report_config.report_category;
    query.report_config.is_chart = true;
    query.query_config.selected_fields.x_axis = query_config.x_axis.map(fn);
    query.query_config.selected_fields.y_axis = query_config.y_axis.map(fn);
  } else {
    query.query_config.selected_fields.report_fields =
      query_config.report_fields.map(fn);
  }

  query.query_config.sort_fields = query_config.sort_fields.map(fn);
  if (
    query_config.default_filters &&
    jsUtility.isArray(query_config.default_filters) &&
    query_config.default_filters.length > 0
  ) {
    const arrDefaultFilters = [];
    query_config.default_filters.forEach((queryField) => {
      const clonedQueryField = jsUtility.cloneDeep(queryField);
      if (
        FILTER_TYPES.DATE.FROM_DATE_TO_TODAY === clonedQueryField.operator &&
        jsUtility.isArray(clonedQueryField.values) &&
        clonedQueryField.values.length > 1
      ) {
        const today = moment();
        clonedQueryField.values[1] = getDateFieldFormatValue(
          today.endOf('day'),
        );
      }
      arrDefaultFilters.push(clonedQueryField);
    });
    query.query_config.selected_filters = arrDefaultFilters;
  }

  return query;
};

export const isReportSourceEqual = (source1, source2) => {
  if (
    Array.isArray(source1) &&
    Array.isArray(source2) &&
    source1.length !== source2.length
  ) {
    return [false];
  }

  const n = source1.length;
  for (let i = 0; i < n; i++) {
    if (source1[i]?.source_uuid !== source2[i]?.source_uuid) {
      return [false, false];
    }
    const map1 = source1[i].map_config;
    const map2 = source2[i].map_config;
    if (map1.length !== map2.length) return [false, false];

    for (let j = 0; j < map1.length; j++) {
      const localFields1 = map1[j].local_field_details;
      const localFields2 = map2[j].local_field_details;
      const foreignField1 = map1[j].foreign_source_details;
      const foreignField2 = map2[j].foreign_source_details;

      if (
        localFields1.field_uuid !== localFields2.field_uuid ||
        foreignField1.field_uuid !== foreignField2.field_uuid
      ) {
        return [false, true];
      }
    }
  }

  return [true, true];
};

export const getPreviewMessage = (
  icon,
  title,
  subTitle = EMPTY_STRING,
  btn = null,
) => (
  <div
    className={cx(
      BS.W100,
      BS.H100,
      BS.D_FLEX_JUSTIFY_CENTER,
      BS.FLEX_COLUMN,
      BS.ALIGN_ITEM_CENTER,
    )}
  >
    {icon}
    <Title className={gClasses.MT24} content={title} size={ETitleSize.xs} />
    {subTitle && <Text content={subTitle} size={ETextSize.XS} />}
    {btn}
  </div>
);

export const getDateFilterData = (quick_filter_data, selectedXAxisField) => {
  const dateFilterData = {
    day: EMPTY_STRING,
    month: EMPTY_STRING,
    year: EMPTY_STRING,
  };
  const xAxisSelectedFieldData = selectedXAxisField[0] || {};
  if (!jsUtility.isEmpty(xAxisSelectedFieldData)) {
    const xAxisOutputKey = xAxisSelectedFieldData?.output_key;
    const isDateFieldSelected =
      Object.keys(quick_filter_data).includes(xAxisOutputKey);
    if (isDateFieldSelected) {
      dateFilterData.day = quick_filter_data[xAxisOutputKey]?.day;
      dateFilterData.month = quick_filter_data[xAxisOutputKey]?.month;
      dateFilterData.year = quick_filter_data[xAxisOutputKey]?.year;
    } else {
      return null;
    }
    return dateFilterData;
  }
  return null;
};

export const getCurrencyFilterOptionalList = (
  quick_filter_data,
  selectedXAxisField,
) => {
  const currencyFilterOutPutKey = `${selectedXAxisField?.output_key}_type`;
  const isCurrencyFilterSelected = Object.keys(quick_filter_data).includes(
    currencyFilterOutPutKey,
  );
  if (!isCurrencyFilterSelected) return [];
  return generateCurrencyFilterList(
    quick_filter_data[currencyFilterOutPutKey] || [],
  );
};

export const getSystemFields = (fields, contextId) => {
  const systemFields = [];

  if (fields && fields.length > 0) {
    fields.forEach((fieldData) => {
      const {
        label,
        field_type,
        query_to_pass,
        output_key,
        supported_aggregations,
        aggregation_type = AGGREGATE_TYPE.NONE,
        is_system_field,
        // technical_reference_name,
        source_collection_uuid,
        filter_data,
      } = fieldData;

      const selectedOperator = getSelectedOperatorByFieldType(field_type);

      const choiceLabels = {};
      filter_data?.forEach?.((f) => {
        choiceLabels[f] = f;
      });

      const fieldValue = filter_data
        ? getFieldValuesByType(field_type, choiceLabels)
        : [];

      const objFilterProData = {
        is_system_field,
        fieldNames: label,
        fieldType: field_type,
        is_table_field: false,
        is_property_picker: false,
        query_to_pass,
        output_key,
        supported_aggregations,
        aggregation_type,
        source_collection_uuid,

        contextId,
        contextUuid: source_collection_uuid,
        label,
        choice_labels: choiceLabels,

        fieldValues: fieldValue,
        isAppliedFilter: false,
        isAppliedFieldEdit: false,
        selectedOperator,
        fieldUpdateValue: EMPTY_STRING,
        fieldUpdateBetweenOne: EMPTY_STRING,
        fieldUpdateBetweenTwo: EMPTY_STRING,

        isMeasure: false,
        skipNullValues: true,
        is_logged_in_user: false,
      };

      systemFields.push(objFilterProData);
    });
  }

  return systemFields;
};

export const getDataFields = (fields, contextId) => {
  const dataFields = [];
  if (fields && fields.length > 0) {
    fields.forEach((fieldData) => {
      const {
        is_system_field,
        field_id,
        field_name,
        reference_name,
        field_type,
        // original_field_type,
        field_uuid,
        is_table_field,
        is_property_picker,
        is_digit_formatted,
        // technical_reference_name,
        source_collection_uuid,
        // reference_field_type,
        // source_field_uuid,
        choice_labels,
        // is_multiselect_accepted,
        query_to_pass,
        output_key,
        table_name,
        table_reference_name,
        supported_aggregations,
        // field_query_suffixes,
        label,
        aggregation_type = AGGREGATE_TYPE.NONE,
      } = fieldData;

      const fieldName =
        field_name !== reference_name
          ? `${field_name} (Ref: ${reference_name})`
          : field_name;

      const fieldValue = getFieldValuesByType(field_type, choice_labels);
      const selectedOperator = getSelectedOperatorByFieldType(field_type);

      const objFilterProData = {
        is_system_field,
        fieldId: field_id,
        fieldNames: fieldName,
        reference_name,
        fieldType: field_type,
        field_uuid,
        is_table_field,
        is_property_picker,
        is_digit_formatted,
        query_to_pass,
        output_key,
        table_name,
        table_reference_name,
        supported_aggregations,
        aggregation_type,
        source_collection_uuid,

        contextId,
        contextUuid: source_collection_uuid,
        label,

        fieldValues: fieldValue,
        isAppliedFilter: false,
        isAppliedFieldEdit: false,
        selectedOperator,
        fieldUpdateValue: EMPTY_STRING,
        fieldUpdateBetweenOne: EMPTY_STRING,
        fieldUpdateBetweenTwo: EMPTY_STRING,

        isMeasure: false,
        skipNullValues: true,
        is_logged_in_user: false,
      };

      dataFields.push(objFilterProData);
    });
  }

  return dataFields;
};
