import React from 'react';
import moment from 'moment';
import { getStringAndSubString } from 'utils/UtilityFunctions';
import { DATE } from 'utils/Constants';
import gClasses from 'scss/Typography.module.scss';
import { FIELD_TYPE } from '../../utils/constants/form_fields.constant';
import FILTER_STRINGS, {
  FILTER_TYPES,
  ONLY_SELECT_DATE_FIELD,
  ONLY_SELECT_FIELDS,
  ONLY_SELECT_NUMBER_FIELD,
} from './Filter.strings';
import { EMPTY_STRING } from '../../utils/strings/CommonStrings';
import jsUtils from '../../utils/jsUtility';
import { fieldYesNoData } from '../../containers/report/report_creation/ReportCreation.utils';
import { STATUS_CONSTANTS } from '../../containers/flow/flow_dashboard/FlowDashboard.string';
import { getFullName } from '../../utils/generatorUtils';

const YesNoData = [
  {
    label: 'Yes',
    value: 1,
  },
  {
    label: 'No',
    value: 0,
  },
];

const getStatusNameByStatusKey = (status, onlyData = false, t = () => {}) => {
  let strStatus = null;
  let statusClass = null;
  switch (status) {
    case STATUS_CONSTANTS(t).IN_PROGRESS.KEY:
    case 'inprogress':
      strStatus = STATUS_CONSTANTS(t).IN_PROGRESS.NAME;
      statusClass = gClasses.FTwo13Blue;
      break;
    case STATUS_CONSTANTS(t).COMPLETED.KEY:
    case 'completed':
      strStatus = STATUS_CONSTANTS(t).COMPLETED.NAME;
      statusClass = gClasses.FTwo13GreenV6;
      break;
    case STATUS_CONSTANTS(t).CANCELLED.KEY:
    case 'cancelled':
      strStatus = STATUS_CONSTANTS(t).CANCELLED.NAME;
      statusClass = gClasses.FTwo13RedV5;
      break;
    default:
      strStatus = status;
      statusClass = gClasses.FTwo13Blue;
  }
  if (onlyData) {
    return strStatus;
  }
  return <div className={statusClass}>{strStatus}</div>;
};

export const getFieldDataByType = (fieldData, type, t) => {
  let reData;
  switch (type) {
    case FIELD_TYPE.YES_NO:
      if (
        jsUtils.isBoolean(fieldData) ||
        fieldData === 'true' ||
        fieldData === 'false'
      ) {
        reData =
          fieldData.toString() === fieldYesNoData[0].value.toString()
            ? fieldYesNoData[0].label
            : fieldYesNoData[1].label;
      } else {
        reData =
          fieldData.toString() === YesNoData[0].value.toString()
            ? YesNoData[0].label
            : YesNoData[1].label;
      }
      break;
    case FIELD_TYPE.DROPDOWN:
      reData = getStatusNameByStatusKey(fieldData, true, t);
      break;
    case FIELD_TYPE.DATA_LIST:
      reData = fieldData.label;
      break;
    default:
      reData = fieldData;
      break;
  }
  return reData;
};

export const getSelectedUserTeamPickerDataForFilter = (
  fieldUpdateValue,
  isGetName = true,
  isCapitalize = true,
) => {
  const arrUserTeamPicker = [];
  if (jsUtils.isObject(fieldUpdateValue)) {
    fieldUpdateValue.users &&
      fieldUpdateValue.users.forEach((usersData) => {
        const { _id, first_name, last_name } = usersData;
        if (isGetName) {
          if (first_name) {
            let name;
            if (isCapitalize) {
              name = `${getFullName(first_name, last_name)}`;
            } else {
              name = `${first_name} ${last_name}`;
            }
            arrUserTeamPicker.push(name);
          }
        } else if (_id) {
          arrUserTeamPicker.push(_id);
        }
      });
    fieldUpdateValue.teams &&
      fieldUpdateValue.teams.forEach((teamData) => {
        const { _id, team_name } = teamData;
        if (isGetName) {
          if (team_name) {
            arrUserTeamPicker.push(team_name);
          }
        } else if (_id) {
          arrUserTeamPicker.push(_id);
        }
      });
  }
  return arrUserTeamPicker;
};

export const isEmptyFieldUpdateValue = (filterProData) => {
  const {
    fieldUpdateValue,
    fieldUpdateBetweenOne,
    fieldUpdateBetweenTwo,
    fieldType,
    selectedOperator,
    is_logged_in_user,
  } = filterProData;
  let ret = false;
  switch (fieldType) {
    case FIELD_TYPE.SINGLE_LINE:
    case FIELD_TYPE.SCANNER:
    case FIELD_TYPE.INFORMATION:
    case FIELD_TYPE.EMAIL:
    case FIELD_TYPE.PHONE_NUMBER:
    case FIELD_TYPE.PARAGRAPH:
    case FIELD_TYPE.LINK:
    case FIELD_TYPE.DROPDOWN:
    case FIELD_TYPE.CHECKBOX:
    case FIELD_TYPE.YES_NO:
    case FIELD_TYPE.RADIO_GROUP:
    case FIELD_TYPE.RADIO_BUTTON:
    case FIELD_TYPE.LOOK_UP_DROPDOWN:
    case FIELD_TYPE.DATA_LIST:
      ret =
        fieldUpdateValue &&
        jsUtils.isArray(fieldUpdateValue) &&
        fieldUpdateValue.length > 0;
      break;
    case FIELD_TYPE.NUMBER:
    case FIELD_TYPE.CURRENCY:
      ret =
        (fieldUpdateValue &&
          jsUtils.isArray(fieldUpdateValue) &&
          fieldUpdateValue.length > 0) ||
        ONLY_SELECT_NUMBER_FIELD.includes(selectedOperator);
      break;
    case FIELD_TYPE.DATE:
    case FIELD_TYPE.DATETIME:
      ret =
        !jsUtils.isEmpty(fieldUpdateBetweenOne) ||
        !jsUtils.isEmpty(fieldUpdateBetweenTwo) ||
        ONLY_SELECT_DATE_FIELD.includes(selectedOperator);
      break;
    case FIELD_TYPE.USER_TEAM_PICKER:
      if (is_logged_in_user) {
        ret = true;
      } else if (jsUtils.isObject(fieldUpdateValue)) {
        const arrUserTeamPicker =
          getSelectedUserTeamPickerDataForFilter(fieldUpdateValue);
        if (arrUserTeamPicker && arrUserTeamPicker.length > 0) {
          ret = true;
        }
      }
      break;
    default:
  }
  return ret;
};

export const searchFieldsByText = (clonedFilterFlowData, searchText) => {
  const cloneSearch = searchText.replace(/[-|()\\[\]]/g, '\\$&');
  const mapFilterFlowData =
    clonedFilterFlowData &&
    clonedFilterFlowData.length > 0 &&
    clonedFilterFlowData.map((filterProData) => {
      const re = new RegExp(cloneSearch, 'gi');
      if (re.test(filterProData.fieldNames) || searchText === EMPTY_STRING) {
        filterProData.isSearch = true;
      } else {
        filterProData.isSearch = false;
      }
      return filterProData;
    });
  return mapFilterFlowData;
};

export const selectFieldLabelName = (type, t) => {
  const { FIELDS } = FILTER_STRINGS(t);
  const SELECT_FIELD_LABEL_LIST = {
    [FILTER_TYPES.NUMBER.EMPTY]: FIELDS.NUMBER.EMPTY.LABEL,
    [FILTER_TYPES.DATE.CURRENT_MONTH]: FIELDS.DATE.CURRENT_MONTH.LABEL,
    [FILTER_TYPES.DATE.NEXT_MONTH]: FIELDS.DATE.NEXT_MONTH.LABEL,
    [FILTER_TYPES.DATE.LAST_7_DAYS]: FIELDS.DATE.LAST_7_DAYS.LABEL,
    [FILTER_TYPES.DATE.LAST_30_DAYS]: FIELDS.DATE.LAST_30_DAYS.LABEL,
    [FILTER_TYPES.DATE.TODAY]: FIELDS.DATE.TODAY.LABEL,
    [FILTER_TYPES.DATE.ALL_PAST_DAYS]: FIELDS.DATE.ALL_PAST_DAYS.LABEL,
    [FILTER_TYPES.DATE.ALL_FUTURE_DAYS]: FIELDS.DATE.ALL_FUTURE_DAYS.LABEL,
  };
  const selectedLabel = SELECT_FIELD_LABEL_LIST[type];
  return selectedLabel;
};

export const getDateFormatByDateTime = (date, isDateTime) => {
  const dateFormat = isDateTime
    ? moment(date).format(DATE.DATE_AND_TIME_FORMAT)
    : moment(date).format(DATE.DATE_FORMAT);
  return dateFormat;
};

export const getDateFieldValue = (
  fieldUpdateBetweenOne,
  fieldUpdateBetweenTwo,
  selectedOperator,
  isDateTime,
  t,
) => {
  let formattedDateOne = EMPTY_STRING;
  if (fieldUpdateBetweenOne) {
    formattedDateOne = getDateFormatByDateTime(
      fieldUpdateBetweenOne,
      isDateTime,
    );
  }
  let fieldUpdatedValue;
  if (ONLY_SELECT_DATE_FIELD.includes(selectedOperator)) {
    fieldUpdatedValue = selectFieldLabelName(selectedOperator, t);
  } else if (selectedOperator === FILTER_TYPES.DATE.EQUAL) {
    fieldUpdatedValue = formattedDateOne;
  } else if (selectedOperator === FILTER_TYPES.DATE.BEFORE) {
    fieldUpdatedValue = `${
      FILTER_STRINGS(t).FIELDS.DATE.BEFORE.LABEL
    } ${formattedDateOne}`;
  } else {
    let formattedDateTwo = EMPTY_STRING;
    if (fieldUpdateBetweenTwo) {
      formattedDateTwo = getDateFormatByDateTime(
        fieldUpdateBetweenTwo,
        isDateTime,
      );
    }
    fieldUpdatedValue =
      fieldUpdateBetweenOne && fieldUpdateBetweenTwo
        ? `${formattedDateOne} - ${formattedDateTwo}`
        : formattedDateOne || formattedDateTwo || EMPTY_STRING;
  }
  return fieldUpdatedValue;
};

export const getAppliedFilterDisplayText = (filter, t) => {
  const {
    fieldUpdateValue,
    fieldUpdateBetweenOne,
    fieldUpdateBetweenTwo,
    fieldType,
    selectedOperator,
    is_logged_in_user,
  } = filter;
  let fieldUpdatedValue = fieldUpdateValue;

  if ([FIELD_TYPE.DATETIME, FIELD_TYPE.DATE].includes(fieldType)) {
    const isDateTime = fieldType === FIELD_TYPE.DATETIME;
    fieldUpdatedValue = getDateFieldValue(
      fieldUpdateBetweenOne,
      fieldUpdateBetweenTwo,
      selectedOperator,
      isDateTime,
      t,
    );
  } else if (fieldType === FIELD_TYPE.USER_TEAM_PICKER) {
    fieldUpdatedValue = is_logged_in_user
      ? FILTER_STRINGS(t).FIELDS.USER_TEAM_PICKER.LOGGED_IN_USER.DETAILS.label
      : fieldUpdatedValue;
  }
  if (ONLY_SELECT_FIELDS.includes(selectedOperator)) {
    fieldUpdatedValue = selectFieldLabelName(selectedOperator, t);
  }

  const { str: strValue } = getStringAndSubString(
    fieldUpdatedValue,
    t,
    fieldType,
    15,
    '...',
  );

  return strValue;
};

export const allowedFieldTypesForFieldValues = [
  FIELD_TYPE.CHECKBOX,
  FIELD_TYPE.DROPDOWN,
  FIELD_TYPE.RADIO_GROUP,
  FIELD_TYPE.RADIO_BUTTON,
];

export const getSelectedFieldNames = (fieldValues) => {
  const arrSelectedNames = [];
  if (jsUtils.isEmpty(fieldValues)) {
    return arrSelectedNames;
  }

  if (jsUtils.isArray(fieldValues)) {
    fieldValues.forEach((fValues) => {
      const { label, isCheck } = fValues;
      if (isCheck) {
        arrSelectedNames.push(label);
      }
    });
  }

  return arrSelectedNames;
};
