import moment from 'moment';
import jsUtility from '../../../utils/jsUtility';
import { DATE } from '../../../utils/Constants';
import { FIELD_TYPE } from '../../../utils/constants/form_fields.constant';
import {
  FILTER_TYPES,
  ONLY_SELECT_FIELDS,
} from '../../../components/dashboard_filter/Filter.strings';
import { getOutputKey } from './ReportCreation.utils';
import { DATA_LIST_FIELD_DATA, USER_AND_TEAM_DATA } from '../Report.strings';
import { EMPTY_STRING } from '../../../utils/strings/CommonStrings';

export const getSelectedOperatorByFieldType = (fieldType) => {
  let operator;
  switch (fieldType) {
    case FIELD_TYPE.SINGLE_LINE:
    case FIELD_TYPE.PARAGRAPH:
    case FIELD_TYPE.EMAIL:
    case FIELD_TYPE.INFORMATION:
      operator = FILTER_TYPES.SINGLE_LINE.CONTAINS;
      break;
    case FIELD_TYPE.NUMBER:
    case FIELD_TYPE.PHONE_NUMBER:
      operator = FILTER_TYPES.SINGLE_LINE.EQUAL;
      break;
    case FIELD_TYPE.DATE:
      operator = FILTER_TYPES.DATE.EQUAL;
      break;
    case FIELD_TYPE.DATETIME:
      operator = FILTER_TYPES.DATE.DATE_IN_RANGE;
      break;
    case FIELD_TYPE.DROPDOWN:
    case FIELD_TYPE.CHECKBOX:
    case FIELD_TYPE.RADIO_BUTTON:
    case FIELD_TYPE.RADIO_GROUP:
    case FIELD_TYPE.LOOK_UP_DROPDOWN:
    case FIELD_TYPE.CURRENCY:
    case FIELD_TYPE.YES_NO:
      operator = FILTER_TYPES.SINGLE_LINE.EQUAL;
      break;
    default:
      operator = FILTER_TYPES.SINGLE_LINE.EQUAL;
  }
  return operator;
};

const constructDateFilterValues = (
  dayFilterData,
  monthFilterData,
  yearFilterData,
  isDateTimeField,
) => {
  // If dayFilterData, monthFilterData, and isDateTimeField are not provided,
  // and yearFilterData is specified, construct the starting and ending dates for the year.
  if (!dayFilterData && !monthFilterData && yearFilterData) {
    const year = yearFilterData;
    if (isDateTimeField) {
      return [`${year}-01-01 00:00:00`, `${year}-12-31 23:59:59`];
    }
    return [`${year}-01-01`, `${year}-12-31`];
  }

  // Determine the year, month, and day to use
  const currentYear = new Date().getFullYear();
  const year = yearFilterData || currentYear;
  const month = monthFilterData || 1; // Default to the first month (January)
  const day = dayFilterData || 1; // Default to the first day of the month

  // Calculate the last day of the selected month
  const lastDay = new Date(year, month, 0).getDate();

  // Calculate the last month of the year

  // Construct the date part (YYYY-MM-DD)
  const datePart = `${year}-${month.toString().padStart(2, '0')}-${day
    .toString()
    .padStart(2, '0')}`;
  let endDatePart = null;
  if (dayFilterData) {
    endDatePart = `${datePart}`;
  } else {
    endDatePart = `${year}-${month.toString().padStart(2, '0')}-${lastDay
      .toString()
      .padStart(2, '0')}`;
  }

  // Construct the starting and ending dates
  const startDateTimeStamp = '00:00:00';
  const endDateTimeStamp = '23:59:59';
  const startDate = isDateTimeField
    ? `${datePart} ${startDateTimeStamp}`
    : datePart;
  const endDate = isDateTimeField
    ? `${endDatePart} ${endDateTimeStamp}`
    : `${endDatePart}`;

  return [startDate, endDate];
};

export const getDateFieldFormatValue = (date, isDateTime = true) => {
  const dateFormat = moment(date).format(
    isDateTime ? DATE.DATE_AND_TIME_24_FORMAT : DATE.DATE_FORMAT,
  );
  return dateFormat;
};

const handleFilterDateTimeFields = (queryField, field) => {
  const { selectedOperator, fieldUpdateBetweenOne, fieldUpdateBetweenTwo } =
    field;
  queryField.operator = selectedOperator;
  if (FILTER_TYPES.DATE.FROM_DATE_TO_TODAY === selectedOperator) {
    const today = moment();
    queryField.values = [
      getDateFieldFormatValue(fieldUpdateBetweenOne),
      getDateFieldFormatValue(today.endOf('day')),
    ];
  } else if (
    ![FILTER_TYPES.DATE.BEFORE, FILTER_TYPES.DATE.EQUAL].includes(
      selectedOperator,
    )
  ) {
    queryField.values = [
      getDateFieldFormatValue(fieldUpdateBetweenOne),
      getDateFieldFormatValue(fieldUpdateBetweenTwo),
    ];
  } else {
    queryField.values = [getDateFieldFormatValue(fieldUpdateBetweenOne)];
  }
};

const handleFilterUserTeamPickerFields = (
  queryField,
  field,
  isPublish,
  objFilterData,
) => {
  const {
    is_logged_in_user,
    fieldUpdateValue,
    output_key,
    source_collection_uuid,
    is_system_field,
    field_uuid,
  } = field;
  queryField.is_logged_in_user = false;
  if (is_logged_in_user) {
    queryField.is_logged_in_user = true;
  }
  queryField.values = [
    ...((fieldUpdateValue?.users || [])?.map((u) => u._id) || []),
    ...((fieldUpdateValue?.teams || [])?.map((u) => u._id) || []),
  ];
  if (isPublish) {
    objFilterData.user_picker_filter_data = [
      ...objFilterData.user_picker_filter_data,
      ...((fieldUpdateValue.users || [])?.map((u) => {
        return {
          output_key,
          source_collection_uuid,
          is_system_field,
          field_uuid,
          ...jsUtility.pick(u, USER_AND_TEAM_DATA.USERS),
          user_name: u.username,
          full_name: `${
            u.full_name ? u.full_name : `${u.first_name} ${u.last_name}`
          }`,
        };
      }) || []),
      ...((fieldUpdateValue.teams || [])?.map((u) => {
        return {
          output_key,
          source_collection_uuid,
          is_system_field,
          field_uuid,
          ...jsUtility.pick(u, USER_AND_TEAM_DATA.TEAMS),
        };
      }) || []),
    ];
  }
};

const handleFilterDataListFields = (
  queryField,
  field,
  isPublish = false,
  objFilterData = [],
) => {
  const {
    fieldUpdateValue,
    output_key,
    source_collection_uuid,
    is_system_field,
    field_uuid,
  } = field;
  queryField.values = (fieldUpdateValue || []).map((d) => d.label);
  if (isPublish) {
    objFilterData.datalist_picker_filter_data = [
      ...(objFilterData.datalist_picker_filter_data || []),
      ...((fieldUpdateValue || []).map((d) => {
        return {
          output_key,
          source_collection_uuid,
          is_system_field,
          field_uuid,
          ...jsUtility.pick(d, DATA_LIST_FIELD_DATA),
        };
      }) || []),
    ];
  }
};

const handleFilterYesNoFields = (queryField, fieldUpdateValue) => {
  if (
    !jsUtility.isEmpty(fieldUpdateValue) &&
    jsUtility.isArray(fieldUpdateValue)
  ) {
    queryField.values = (fieldUpdateValue || []).map((d) => {
      if (d === 'true') return true;
      else if (d === 'false') return false;
      else return d;
    });
  }
};

const getFilterQueryField = (
  field,
  isPublish,
  objFilterData,
  isSelectedFilter = false,
) => {
  const {
    query_to_pass,
    output_key,
    is_system_field,
    source_collection_uuid,
    is_table_field = false,
    is_property_picker = false,
    field_uuid,
    aggregation_type,
    fieldType,
    fieldUpdateValue,
    fieldUpdateBetweenOne,
    fieldUpdateBetweenTwo,
  } = field;
  if (!isSelectedFilter && jsUtility.isEmpty(field.selectedOperator)) {
    field.selectedOperator = getSelectedOperatorByFieldType(fieldType);
  }
  const { selectedOperator } = field;
  const queryField = {
    query_to_pass,
    output_key,
    field_uuid,
    field_type: fieldType,
    is_system_field,
    source_collection_uuid,
    is_table_field,
    is_property_picker,
    is_multiselect_combination: false,
    is_breakdown: false,
  };
  if (isSelectedFilter) {
    queryField.operator = selectedOperator;
    queryField.values = [];
  } else if (!isPublish) {
    queryField.operator = selectedOperator;
  }
  const _output_key = getOutputKey(output_key, aggregation_type);
  queryField.output_key = _output_key;

  if (fieldUpdateValue && fieldUpdateValue.length > 0) {
    queryField.values = fieldUpdateValue;
  } else if (fieldUpdateBetweenOne && fieldUpdateBetweenTwo) {
    queryField.values = [fieldUpdateBetweenOne, fieldUpdateBetweenTwo];
  }

  switch (fieldType) {
    case FIELD_TYPE.DATE:
    case FIELD_TYPE.DATETIME:
      handleFilterDateTimeFields(queryField, field);
      break;
    case FIELD_TYPE.USER_TEAM_PICKER:
      handleFilterUserTeamPickerFields(
        queryField,
        field,
        isPublish,
        objFilterData,
      );
      break;
    case FIELD_TYPE.DATA_LIST:
      handleFilterDataListFields(queryField, field, isPublish, objFilterData);
      break;
    case FIELD_TYPE.YES_NO:
      handleFilterYesNoFields(queryField, fieldUpdateValue);
      break;
    default:
      break;
  }
  if (ONLY_SELECT_FIELDS.includes(selectedOperator)) {
    queryField.values = [];
  }

  return queryField;
};

export const generateFilterQuery = (
  filter,
  isPublish = false,
  userFilter = {},
  reports = {},
  state = {},
) => {
  const objFilterData = {
    selected_filters: [],
    user_picker_filter_data: [],
    datalist_picker_filter_data: [],
    user_Filters: [],
    quick_filter_data: [],
  };
  if (jsUtility.isEmpty(filter)) {
    return objFilterData;
  }
  const {
    dayFilterData,
    monthFilterData,
    yearFilterData,
    selectedCurrencyFilter,
  } = state;
  const { selectedFieldsFromReport, is_break_down } = reports;
  const { inputFieldDetailsForFilter } = filter;

  const { inputFieldDetailsForFilter: userFilterFlowData } = userFilter;

  if (!jsUtility.isEmpty(inputFieldDetailsForFilter)) {
    inputFieldDetailsForFilter.forEach((field) => {
      if (field.isAppliedFilter) {
        const queryField = getFilterQueryField(
          field,
          isPublish,
          objFilterData,
          true,
        );

        objFilterData.selected_filters.push(queryField);
      }
    });
  }
  if (!jsUtility.isEmpty(userFilterFlowData)) {
    userFilterFlowData.forEach((field) => {
      if (field.isAppliedFilter || isPublish) {
        const queryField = getFilterQueryField(
          field,
          isPublish,
          objFilterData,
          false,
        );

        objFilterData.user_Filters.push(queryField);
      }
    });
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
        fieldType: field_type,
        aggregation_type,
      } = field;
      let _output_key = output_key;
      if (!isPublish) {
        _output_key = getOutputKey(output_key, aggregation_type);
      }

      const quickField = {
        query_to_pass,
        output_key: _output_key,
        field_uuid,
        field_type,
        is_system_field,
        source_collection_uuid,
        is_table_field,
        is_property_picker,
        values: [],
        is_multiselect_combination: false,
        is_breakdown: false,
      };
      if (field.axis === 'x') {
        if (
          (field_type === FIELD_TYPE.DATE ||
            field_type === FIELD_TYPE.DATETIME) &&
          (dayFilterData || monthFilterData || yearFilterData)
        ) {
          const isDateTimeField = field_type === FIELD_TYPE.DATETIME;
          quickField.values = constructDateFilterValues(
            dayFilterData,
            monthFilterData,
            yearFilterData,
            isDateTimeField,
          );
          quickField.operator = FILTER_TYPES.DATE.DATE_IN_RANGE;
          objFilterData.quick_filter_data.push(quickField);
        } else if (
          field_type === FIELD_TYPE.CURRENCY &&
          (selectedCurrencyFilter || selectedCurrencyFilter === EMPTY_STRING) &&
          !state?.reports?.isSkipNullChanged
        ) {
          quickField.operator = FILTER_TYPES.NUMBER.EQUAL;
          quickField.values = [
            selectedCurrencyFilter === EMPTY_STRING
              ? null
              : selectedCurrencyFilter,
          ];
          objFilterData.quick_filter_data.push(quickField);
        }
      } else if (field.axis === 'y' && is_break_down) {
        quickField.is_breakdown = true;
      }
    });
  }

  objFilterData.user_picker_filter_data = jsUtility.uniqBy(
    objFilterData.user_picker_filter_data,
    '_id',
  );

  return objFilterData;
};
