import moment from 'moment';
import jsUtility from '../../../utils/jsUtility';
import { COMMA, EMPTY_STRING, NA } from '../../../utils/strings/CommonStrings';
import { FIELD_TYPE } from '../../../utils/constants/form_fields.constant';
import { FILTER_TYPES } from '../../../components/dashboard_filter/Filter.strings';
import {
  generateFilterQuery,
  getDateFieldFormatValue,
} from './FilterQuery.utils';
import { fieldYesNoData, getOutputKey } from './ReportCreation.utils';
import {
  REPORT_SOURCE_TYPES,
  REPORT_CATEGORY_TYPES,
  AGGREGATE_TYPE,
} from '../Report.strings';
import { SORT_BY_VALUE } from './config_panel/ConfigPanel.strings';

const getFieldQueryField = (field, reports, isPublish, isDrillDown = false) => {
  const { isRangeSelected, is_break_down, is_unique_combination } = reports;
  const {
    query_to_pass,
    output_key,
    field_uuid,
    aggregation_type,
    is_system_field,
    source_collection_uuid,
    is_table_field,
    is_property_picker,
    fieldType,
    fieldDisplayName,
    skipNullValues,
    ddMonthYearSelectedValue,
    axis,
    range = [],
    distinct_value,
    is_roundup,
    roundup_value,
  } = field;

  const queryField = {
    query_to_pass,
    output_key,
    field_type: fieldType,
    is_system_field,
    source_collection_uuid,
    aggregation_type: aggregation_type || AGGREGATE_TYPE.NONE,
    skip_null_values: skipNullValues,
    is_property_picker,
    is_table_field,
    is_multiselect_combination: false,
    is_breakdown: false,
    distinct_value,
    is_roundup,
    roundup_value,
    field_uuid,
  };

  const updateAxisProperties = () => {
    if (axis === 'x' && isRangeSelected) {
      queryField.range = range;
    }
    if (axis === 'y' && is_break_down) {
      queryField.is_breakdown = true;
    }
    if (is_unique_combination) {
      queryField.is_multiselect_combination = true;
    }
  };
  if (axis) updateAxisProperties();

  if (isPublish) queryField.field_display_name = fieldDisplayName;
  else {
    const aggregationType =
      axis === 'y' && is_break_down ? 'breakdown' : aggregation_type;
    queryField.output_key = getOutputKey(output_key, aggregationType);
  }

  // aggregation_type
  if (
    [FIELD_TYPE.DATE, FIELD_TYPE.DATETIME].includes(fieldType) &&
    ddMonthYearSelectedValue
  ) {
    if (isDrillDown && axis === 'x') {
      queryField.aggregation_type = 'none';
    } else {
      queryField.aggregation_type = ddMonthYearSelectedValue;
    }
  }
  return queryField;
};

const getFieldSortFields = (field, queryField, sortByValue) => {
  const {
    query_to_pass,
    field_uuid,
    is_system_field,
    source_collection_uuid,
    is_table_field,
    is_property_picker,
  } = field;
  const sortField = {
    query_to_pass,
    output_key: queryField.output_key,
    field_type: queryField.field_type,
    is_system_field,
    is_table_field,
    is_property_picker,
    source_collection_uuid,
    aggregation_type: queryField.aggregation_type,
    order_type: sortByValue === SORT_BY_VALUE.ASC ? 1 : -1,
    is_multiselect_combination: false,
    is_breakdown: false,
  };
  if (field_uuid) sortField.field_uuid = field_uuid;
  return sortField;
};

export const generateReportQuery = (
  reports,
  filter,
  reportConfig,
  userFilter = {},
  state = {},
  isPublish = false,
) => {
  const query = {
    report_config: {
      is_chart: true,
      report_category: reportConfig.report_Data.report_category,
    },
    query_config: {
      selected_fields: {},
      selected_filters: [],
      sort_fields: [],
      skip_data: 0,
      limit_data: 0,
    },
    additional_config: {
      show_total: reports.additionalConfiguration.isShowTotal,
    },
  };
  const { report_Data, source_Data } = reportConfig;

  if (
    report_Data.report_type === REPORT_SOURCE_TYPES.CROSS_FLOW_DATALIST &&
    !isPublish
  ) {
    query.source_config = source_Data;
    if (reportConfig._id) {
      query.report_config.report_id = reportConfig._id;
    }
  }

  if (report_Data.report_category === REPORT_CATEGORY_TYPES.CHART) {
    query.report_config.report_category = report_Data.report_category;
    query.query_config.selected_fields.x_axis = [];
    query.query_config.selected_fields.y_axis = [];
    query.report_config.is_chart = true;
  } else {
    query.query_config.selected_fields.report_fields = [];
  }

  reports.selectedFieldsFromReport.forEach((field) => {
    const { output_key, aggregation_type, axis } = field;

    const fieldReports = {
      isRangeSelected: reports?.isRangeSelected,
      is_break_down: reports?.is_break_down,
      is_unique_combination: reports?.is_unique_combination,
    };
    const queryField = getFieldQueryField(field, fieldReports, isPublish);

    // for sorting
    let fieldValue = output_key;
    if (axis === 'x' || axis === 'y') {
      fieldValue = getOutputKey(output_key, aggregation_type);
    }
    if (
      fieldValue === reports.additionalConfiguration.sortBySelectedFieldValue &&
      query.query_config.sort_fields.length === 0
    ) {
      const clonedSortField = jsUtility.cloneDeep(
        getFieldSortFields(
          field,
          queryField,
          reports.additionalConfiguration.sortBySelectedValue,
        ),
      );
      query.query_config.sort_fields.push(clonedSortField);
    }

    if (axis) {
      if (axis === 'x') {
        query.query_config.selected_fields?.x_axis?.push(queryField);
      } else if (axis === 'y') {
        query.query_config.selected_fields?.y_axis?.push(queryField);
      }
    } else {
      query.query_config.selected_fields?.report_fields?.push(queryField);
    }
  });

  // Add Filters Data.
  const {
    selected_filters,
    user_picker_filter_data,
    datalist_picker_filter_data,
    user_Filters,
    quick_filter_data,
  } = generateFilterQuery(filter, isPublish, userFilter, reports, state);
  query.query_config.selected_filters = jsUtility.cloneDeep(selected_filters);
  query.query_config.quick_filters = jsUtility.cloneDeep(quick_filter_data);
  query.query_config.user_filters = jsUtility.cloneDeep(user_Filters);
  if (isPublish) {
    query.user_picker_filter_data = jsUtility.cloneDeep(
      user_picker_filter_data,
    );
    query.datalist_picker_filter_data = jsUtility.cloneDeep(
      datalist_picker_filter_data,
    );
    query.query_config.user_filters = jsUtility.cloneDeep(user_Filters);
  }

  return query;
};

const handleFilterDrillDownDateTime = (
  drillDownFilterData,
  queryField,
  isDateTime,
  quickFilterData,
) => {
  const { dayFilterData, monthFilterData, yearFilterData } = quickFilterData;
  let date1 = drillDownFilterData;
  let date2 = drillDownFilterData;
  let operator = FILTER_TYPES.DATE.EQUAL;
  const splitDataLength = drillDownFilterData.split(' ').length;
  if (splitDataLength === 1) {
    if (!jsUtility.isNaN(Number(drillDownFilterData)) && drillDownFilterData.length === 4) {
      date1 = moment(drillDownFilterData).startOf('year');
      date2 = moment(drillDownFilterData).endOf('year');
      operator = FILTER_TYPES.DATE.DATE_IN_RANGE;
    } else if (!jsUtility.isNaN(Number(drillDownFilterData)) && [1, 2].includes(drillDownFilterData.length)) {
      const date = `${yearFilterData}-${monthFilterData}-${drillDownFilterData}`;
      date1 = moment(date).startOf('date');
      date2 = moment(date).endOf('date');
      if (isDateTime) {
        operator = FILTER_TYPES.DATE.DATE_IN_RANGE;
      }
    } else {
      const date = `${drillDownFilterData} ${yearFilterData}`;
      date1 = moment(date).startOf('month');
      date2 = moment(date).endOf('month');
      operator = FILTER_TYPES.DATE.DATE_IN_RANGE;
    }
  } else if (splitDataLength === 2) {
    date1 = moment(drillDownFilterData).startOf('month');
    date2 = moment(drillDownFilterData).endOf('month');
    operator = FILTER_TYPES.DATE.DATE_IN_RANGE;
  } else if (splitDataLength === 3) {
    date1 = moment(drillDownFilterData).startOf('date');
    date2 = moment(drillDownFilterData).endOf('date');
    if (isDateTime) {
      operator = FILTER_TYPES.DATE.DATE_IN_RANGE;
    }
  } else if (drillDownFilterData.includes('-')) {
    const splitTimeOfDay = drillDownFilterData
      .split('-')
      .map((time) => time.trim().split(' ').join(':00 '));
    const date = `${yearFilterData}-${monthFilterData}-${dayFilterData}`;
    const dateTime1 = `${date} ${splitTimeOfDay[0]}`;
    const dateTime2 = `${date} ${splitTimeOfDay[1]}`;
    date1 = moment(dateTime1);
    date2 = moment(dateTime2);
    operator = FILTER_TYPES.DATE.DATE_IN_RANGE;
  }
  if (isDateTime && operator === FILTER_TYPES.DATE.EQUAL) {
    date2 = moment(date2).add(1, 'seconds');
    operator = FILTER_TYPES.DATE.DATE_IN_RANGE;
  }
  const formattedDate1 = getDateFieldFormatValue(date1, isDateTime);
  const formattedDate2 = getDateFieldFormatValue(date2, isDateTime);
  queryField.operator = operator;
  if (operator === FILTER_TYPES.DATE.EQUAL) {
    queryField.values = [formattedDate1];
  } else if (operator === FILTER_TYPES.DATE.DATE_IN_RANGE) {
    queryField.values = [formattedDate1, formattedDate2];
  }
};

const handleDrillDownFilterUserTeamPickerFields = (
  queryField,
  drillDownFilterData,
  paginationDataForDrillDown,
  is_logged_in_user,
  output_key,
) => {
  queryField.values = [];
  queryField.is_logged_in_user = false;
  if (is_logged_in_user) {
    queryField.is_logged_in_user = true;
  }
  const userTeamPickerKey = `${output_key}_userteamid`;
  const filterPickerData = paginationDataForDrillDown?.filter((u) => {
    if (
      jsUtility.isArray(u[output_key]) &&
      jsUtility.isArray(u[userTeamPickerKey])
    ) {
      const arrUserTeamPickerNames = u[output_key];
      const strUserTeamPickerNames = jsUtility
        .join(arrUserTeamPickerNames, ', ')
        .toString();
      const isUserTeamPickerData =
        strUserTeamPickerNames === drillDownFilterData.toString();
      return isUserTeamPickerData;
    } else {
      return u[output_key] === drillDownFilterData && u[userTeamPickerKey];
    }
  });

  if (
    filterPickerData &&
    jsUtility.isArray(filterPickerData) &&
    filterPickerData.length > 0
  ) {
    const userTeamId = filterPickerData[0][userTeamPickerKey];
    if (!jsUtility.isEmpty(userTeamId)) {
      if (jsUtility.isArray(userTeamId)) {
        queryField.values = userTeamId;
      } else {
        queryField.values = [userTeamId];
      }
    }
  }
};

const handleDrillDownFilterMultiSelectFields = (
  queryField,
  fieldValues,
  choiceLabels,
  drillDownFilterData,
) => {
  if (drillDownFilterData) {
    let filterData = null;
    if (queryField.field_type === FIELD_TYPE.CHECKBOX) {
      const isNumber = jsUtility.isNumber(fieldValues[0].value);
      if (jsUtility.isArray(drillDownFilterData)) {
        drillDownFilterData = isNumber
          ? drillDownFilterData.map((value) => Number(value))
          : drillDownFilterData;
      } else {
        drillDownFilterData = isNumber
          ? Number(drillDownFilterData)
          : drillDownFilterData;
      }
    }
    if (
      jsUtility.isArray(drillDownFilterData) &&
      drillDownFilterData.length > 0
    ) {
      filterData = drillDownFilterData;
    } else if (
      choiceLabels &&
      jsUtility.has(choiceLabels, drillDownFilterData)
    ) {
      filterData = choiceLabels[drillDownFilterData];
    }
    if (jsUtility.isArray(filterData) && filterData.length > 0) {
      queryField.values = filterData;
    } else if (filterData === 0 || !jsUtility.isEmpty(filterData)) {
      queryField.values = [filterData];
    }
  }
};

const generateFilterDrillDownQuery = (
  drillDownFilterData,
  filter,
  reports = {},
  quickFilterData = {},
) => {
  const { selectedFieldsFromReport, paginationDataForDrillDown = [] } = reports;
  const objFilterData = {
    selected_filters: [],
  };
  if (
    jsUtility.isEmpty(filter) &&
    jsUtility.isEmpty(selectedFieldsFromReport)
  ) {
    return objFilterData;
  }

  if (!jsUtility.isEmpty(selectedFieldsFromReport)) {
    selectedFieldsFromReport.forEach((field) => {
      const {
        query_to_pass,
        output_key,
        is_system_field,
        source_collection_uuid,
        is_table_field = false,
        is_property_picker = false,
        field_uuid,
        aggregation_type,
        axis,

        fieldType,
        selectedOperator,
        is_logged_in_user,
        fieldValues,
        choice_labels,
      } = field;
      if (axis === 'x') {
        const queryField = {
          query_to_pass,
          output_key,
          field_uuid,
          field_type: fieldType,
          is_system_field,
          source_collection_uuid,
          is_table_field,
          is_property_picker,
          operator: selectedOperator,
          values: [],
          is_multiselect_combination: false,
          is_breakdown: false,
        };
        const _output_key = getOutputKey(output_key, aggregation_type);
        queryField.output_key = _output_key;
        queryField.operator = FILTER_TYPES.SINGLE_LINE.EQUAL;
        const filterValue =
          drillDownFilterData === NA ? null : drillDownFilterData;
        queryField.values.push(filterValue);

        if (drillDownFilterData !== NA) {
          switch (fieldType) {
            case FIELD_TYPE.NUMBER: {
              const numberData = Number(drillDownFilterData.toString().replaceAll(COMMA, EMPTY_STRING));
              if (!jsUtility.isNaN(numberData)) {
                queryField.values = [numberData];
              }
              break;
            }
            case FIELD_TYPE.DATE:
            case FIELD_TYPE.DATETIME: {
              const isDateTime = fieldType === FIELD_TYPE.DATETIME;
              handleFilterDrillDownDateTime(
                drillDownFilterData.toString(),
                queryField,
                isDateTime,
                quickFilterData,
              );
              break;
            }
            case FIELD_TYPE.USER_TEAM_PICKER:
              handleDrillDownFilterUserTeamPickerFields(
                queryField,
                drillDownFilterData,
                paginationDataForDrillDown,
                is_logged_in_user,
                output_key,
              );
              break;
            case FIELD_TYPE.YES_NO:
              queryField.values = [
                drillDownFilterData === fieldYesNoData[0].label,
              ];
              break;
            case FIELD_TYPE.CURRENCY:
              if (drillDownFilterData) {
                const currencyData = jsUtility.round(
                  drillDownFilterData.replace(/[^\d.-]/g, EMPTY_STRING),
                  2,
                );
                queryField.values = jsUtility.isNumber(currencyData) && [
                  currencyData,
                ];
              }
              break;
            case FIELD_TYPE.DROPDOWN:
            case FIELD_TYPE.CHECKBOX:
            case FIELD_TYPE.RADIO_GROUP:
            case FIELD_TYPE.RADIO_BUTTON:
            case FIELD_TYPE.LOOK_UP_DROPDOWN:
              handleDrillDownFilterMultiSelectFields(
                queryField,
                fieldValues,
                choice_labels,
                drillDownFilterData,
              );
              break;
            default:
              break;
          }
        } else {
          if (fieldType === FIELD_TYPE.USER_TEAM_PICKER) {
            queryField.is_logged_in_user = false;
          } else if ([FIELD_TYPE.NUMBER, FIELD_TYPE.CURRENCY].includes(fieldType)) {
            queryField.values = [];
            queryField.operator = FILTER_TYPES.NUMBER.EMPTY;
          }
        }

        objFilterData.selected_filters.push(queryField);
      }
    });
  }

  return objFilterData;
};

export const getInputFieldsFromDrillDownOutputKey = (
  inputFieldDetailsForFilter,
  drillDownOutputKeys,
) => {
  const arrInputFields = [];
  if (
    !jsUtility.isEmpty(inputFieldDetailsForFilter) &&
    jsUtility.isArray(inputFieldDetailsForFilter) &&
    !jsUtility.isEmpty(drillDownOutputKeys) &&
    jsUtility.isArray(drillDownOutputKeys)
  ) {
    drillDownOutputKeys.forEach((objOutput) => {
      const { field, label } = objOutput;
      const objInputField = jsUtility
        .cloneDeep(inputFieldDetailsForFilter)
        .find((filter) =>
          [filter.field_uuid, filter.query_to_pass].includes(field),
        );
      if (
        !jsUtility.isEmpty(objInputField) &&
        objInputField.fieldType !== FIELD_TYPE.FILE_UPLOAD
      ) {
        objInputField.label = label;
        objInputField.fieldDisplayName = label;
        arrInputFields.push(objInputField);
      }
    });
  }
  return arrInputFields;
};

export const generateReportDrillDownQuery = (
  reports,
  filter,
  reportConfig,
  isPublish = false,
  skip = 0,
  userFilter = {},
  state = {},
  quickFilterData = {},
  drillDownFilterData = EMPTY_STRING,
) => {
  const {
    drillDownOutputKeys = [],
    selectedFieldsFromReport = [],
    inputFieldsForReport = [],
  } = reports;
  const query = {
    report_config: {
      is_chart: true,
      report_category: reportConfig.report_Data.report_category,
    },
    query_config: {
      selected_fields: {},
      selected_filters: [],
      sort_fields: [],
      skip_data: skip,
      limit_data: 0,
    },
    additional_config: {
      show_total: reports.additionalConfiguration.isShowTotal,
    },
  };
  const { report_Data, source_Data } = reportConfig;

  if (
    report_Data.report_type === REPORT_SOURCE_TYPES.CROSS_FLOW_DATALIST &&
    !isPublish
  ) {
    query.source_config = source_Data;
    if (reportConfig._id) {
      query.report_config.report_id = reportConfig._id;
    }
  }

  query.query_config.selected_fields.report_fields = [];
  let filteredInputFields = [];
  if (report_Data.report_type === REPORT_SOURCE_TYPES.CROSS_FLOW_DATALIST) {
    filteredInputFields = jsUtility.cloneDeep(selectedFieldsFromReport);
  } else {
    filteredInputFields = getInputFieldsFromDrillDownOutputKey(
      inputFieldsForReport,
      drillDownOutputKeys,
    );
  }

  if (
    !jsUtility.isEmpty(filteredInputFields) &&
    jsUtility.isArray(filteredInputFields)
  ) {
    filteredInputFields.forEach((field, index) => {
      if (
        selectedFieldsFromReport &&
        jsUtility.isArray(selectedFieldsFromReport) &&
        selectedFieldsFromReport.length > 0
      ) {
        const selectedFieldObject = jsUtility.find(selectedFieldsFromReport, {
          output_key: field.output_key,
        });
        if (!jsUtility.isEmpty(selectedFieldObject)) {
          field.axis = selectedFieldObject.axis;
          field.ddMonthYearSelectedValue =
            selectedFieldObject.ddMonthYearSelectedValue;
          field.range = selectedFieldObject.range;
          field.skipNullValues = selectedFieldObject.skipNullValues;
        } else {
          field.skipNullValues = false;
        }
      }

      const fieldReports = {
        isRangeSelected: reports?.isRangeSelected,
        is_break_down: reports?.is_break_down,
        is_unique_combination: reports?.is_unique_combination,
      };
      const queryField = getFieldQueryField(
        field,
        fieldReports,
        isPublish,
        true,
      );

      // for sorting
      if (index === 0 && query.query_config.sort_fields.length === 0) {
        const clonedSortField = jsUtility.cloneDeep(
          getFieldSortFields(
            field,
            queryField,
            reports.additionalConfiguration.sortBySelectedValue,
          ),
        );
        query.query_config.sort_fields.push(clonedSortField);
      }

      query?.query_config?.selected_fields?.report_fields?.push(queryField);
    });
  }

  // Add Filters Data.
  const { selected_filters, user_Filters, quick_filter_data } =
    generateFilterQuery(filter, isPublish, userFilter, reports, state);
  query.query_config.selected_filters = jsUtility.cloneDeep(selected_filters);
  query.query_config.quick_filters = jsUtility.cloneDeep(quick_filter_data);
  query.query_config.user_filters = jsUtility.cloneDeep(user_Filters);

  if (drillDownFilterData) {
    const { selected_filters: drillDownSelectedFilter } =
      generateFilterDrillDownQuery(
        drillDownFilterData,
        filter,
        reports,
        quickFilterData,
      );
    if (
      drillDownSelectedFilter &&
      jsUtility.isArray(drillDownSelectedFilter) &&
      drillDownSelectedFilter.length > 0
    ) {
      query.query_config.selected_filters = [
        ...query.query_config.selected_filters,
        jsUtility.cloneDeep(...drillDownSelectedFilter),
      ];
    }
  }

  return query;
};
