import React from 'react';
import i18next from 'i18next';
import { BorderRadiusVariant, Chip, EChipSize } from '@workhall-pvt-lmt/wh-ui-library';
import cx from 'classnames';
import { validate } from '../../../../utils/UtilityFunctions';
import { FIELD_CONFIG_TABS } from './FieldConfiguration.constants';
import { getFieldGuidanceConfigurationValidationData } from './additional_configuration/field_guidance_configuration/FieldGuidanceConfiguration.utils';
import { fieldGuidanceConfigurationSchema } from './additional_configuration/field_guidance_configuration/FieldGuidanceConfiguration.validate.schema';
import { DEFAULT_VALUE_FIELDS, fieldBasicConfigurationValidationData } from './basic_configuration/BasicConfiguration.utils';
import { fieldBasicConfigurationSchema } from './basic_configuration/BasicConfiguration.validate.schema';
import { getFieldValidationConfigurationValidationData } from './validation_and_visibility_configuration/validation_configuration/ValidationConfiguration.utils';
import { fieldValidationConfigurationSchema } from './validation_and_visibility_configuration/validation_configuration/ValidationConfiguration.validate.schema';
import { fieldDefaultValueConfigurationSchema } from './field_value_configuration/FieldValueConfiguration.validation.schema';
import { getFieldDefaultValueConfigurationValidationData } from './field_value_configuration/FieldValueConfiguration.utils';
import AlertTriangleIcon from '../../../../assets/icons/AlertTriangle';
import { UTIL_COLOR } from '../../../../utils/Constants';
import jsUtility, { isEmpty, translateFunction } from '../../../../utils/jsUtility';
import gClasses from '../../../../scss/Typography.module.scss';
import { FIELD_GENERAL_CONFIG, RESPONSE_FIELD_KEYS } from '../../../../utils/constants/form/form.constant';
import { FIELD_TYPES } from './FieldConfiguration.strings';
import { EXISTING_DATA_LIST_DELETED_ERROR_INSTRUCTION } from './basic_configuration/datalist_selector_basic_configuration/DatalistSelectorBasicConfiguration.utils';
// import { fieldSummaryConfigurationSchema } from './FieldSummaryConfiguration.validate.schema';
import { FIELD_TYPE } from '../../../../utils/constants/form.constant';
import { savePageComponentValidateSchema } from '../../../shared_container/individual_entry/IndividualEntry.validation.schema';

export const getFieldConfigurationGenaralValidationData = (fieldData) => {
  if (fieldData?.fieldType === FIELD_GENERAL_CONFIG.ACTION_BUTTON) {
    return {
      [FIELD_GENERAL_CONFIG.BUTTON_ACTION_TYPE]: fieldData?.[FIELD_GENERAL_CONFIG.BUTTON_ACTION_TYPE],
      [FIELD_GENERAL_CONFIG.BUTTON_NAME]: fieldData?.[FIELD_GENERAL_CONFIG.BUTTON_NAME],
      [FIELD_GENERAL_CONFIG.BUTTON_STYLE]: fieldData?.[FIELD_GENERAL_CONFIG.BUTTON_STYLE],
      [RESPONSE_FIELD_KEYS.FIELD_TYPE]: fieldData?.[RESPONSE_FIELD_KEYS.FIELD_TYPE],
    };
  } else if (fieldData?.fieldType === FIELD_GENERAL_CONFIG.IMAGE) {
    return {
      [FIELD_GENERAL_CONFIG.IMAGE_ID]: fieldData?.[FIELD_GENERAL_CONFIG.IMAGE_ID],
    };
  } else if (fieldData?.fieldListType === FIELD_GENERAL_CONFIG.SYSTEM_FIELD || fieldData?.fieldListType === FIELD_GENERAL_CONFIG.DIRECT_FIELD) {
    return {
      [FIELD_GENERAL_CONFIG.FIELD_LIST_TYPE]: fieldData?.[FIELD_GENERAL_CONFIG.FIELD_LIST_TYPE],
      [RESPONSE_FIELD_KEYS.FIELD_NAME]: fieldData?.[RESPONSE_FIELD_KEYS.FIELD_NAME],
      [RESPONSE_FIELD_KEYS.FIELD_TYPE]: fieldData?.[RESPONSE_FIELD_KEYS.FIELD_TYPE],
      [RESPONSE_FIELD_KEYS.INSTRUCTION]: fieldData?.[RESPONSE_FIELD_KEYS.INSTRUCTION],
      [RESPONSE_FIELD_KEYS.HELPER_TOOLTIP]: fieldData?.[RESPONSE_FIELD_KEYS.HELPER_TOOLTIP],
      [RESPONSE_FIELD_KEYS.FIELD_NAME]: fieldData[RESPONSE_FIELD_KEYS.FIELD_NAME],
      [RESPONSE_FIELD_KEYS.FIELD_TYPE]: fieldData[RESPONSE_FIELD_KEYS.FIELD_TYPE],
      [RESPONSE_FIELD_KEYS.FIELD_UUID]: fieldData[RESPONSE_FIELD_KEYS.FIELD_UUID],
    };
  }
  return null;
};

export const validateFieldConfigurationTab = (tab = null, fieldData = {}, t = i18next.t, isSummaryForm = false) => {
    let errorList = {};
    switch (tab) {
      case FIELD_CONFIG_TABS.BASIC_CONFIG:
          errorList = validate(fieldBasicConfigurationValidationData(fieldData, t), fieldBasicConfigurationSchema(t));
          break;
        case FIELD_CONFIG_TABS.VALUE_CONFIG:
          if (DEFAULT_VALUE_FIELDS?.includes(fieldData[RESPONSE_FIELD_KEYS.FIELD_TYPE])) {
            errorList = validate(getFieldDefaultValueConfigurationValidationData(fieldData), fieldDefaultValueConfigurationSchema(t));
          }
          break;
        case FIELD_CONFIG_TABS.VALIDATION_VISIBILITY_CONFIG:
          errorList = validate(getFieldValidationConfigurationValidationData(fieldData, t), fieldValidationConfigurationSchema(t));
          break;
        case FIELD_CONFIG_TABS.ADDITIONAL_CONFIG:
          errorList = isSummaryForm ? validate(fieldData, savePageComponentValidateSchema(t)) : validate(getFieldGuidanceConfigurationValidationData(fieldData), fieldGuidanceConfigurationSchema(t));
          break;
        case FIELD_CONFIG_TABS.GENERAL:
          errorList = validate(fieldData, savePageComponentValidateSchema(t));
          break;
        default: break;
    }
    return errorList;
  };

export const getSharedPropertyWarningText = (message = '', t = i18next.t) => {
  const text = message || t('form_field_strings.field_config.shared_property_text');
  return (
    <Chip
      avatar={<AlertTriangleIcon />}
      text={text}
      backgroundColor={UTIL_COLOR.YELLOW_50}
      textColor={UTIL_COLOR.YELLOW_600}
      size={EChipSize.sm}
      className={cx(gClasses.MT8, gClasses.MB8, gClasses.PY2)}
      borderRadiusType={BorderRadiusVariant.square}
    />
  );
};

export const constructServerErrors = (fieldData, t = translateFunction) => {
  const errorList = {};
  if (fieldData?.[RESPONSE_FIELD_KEYS.FIELD_TYPE] === FIELD_TYPES.DATA_LIST) {
    if (isEmpty(fieldData?.dataList) && fieldData?.[RESPONSE_FIELD_KEYS.FIELD_UUID]) {
      errorList[`${RESPONSE_FIELD_KEYS.DATA_LIST_DETAILS},${RESPONSE_FIELD_KEYS.DATA_LIST_ID}`] = EXISTING_DATA_LIST_DELETED_ERROR_INSTRUCTION(t);
    }
  }
  return errorList;
};

export const getTableFieldChildData = (fieldData, fields) => {
  if (
    fieldData[RESPONSE_FIELD_KEYS.FIELD_TYPE] === FIELD_TYPE.TABLE &&
    !jsUtility.isEmpty(fieldData[RESPONSE_FIELD_KEYS.FIELD_UUID])
  ) {
    const addedTableChildData = [];
    Object.keys(fields).forEach((fieldUUID) => {
      if (fieldUUID) {
        const tableField = fields[fieldUUID];
        if (
          tableField[RESPONSE_FIELD_KEYS.TABLE_UUID] ===
          fieldData[RESPONSE_FIELD_KEYS.FIELD_UUID]
        ) {
          const childData = {
            child_data: tableField[RESPONSE_FIELD_KEYS.SELECTED_FIELD_UUID],
            child_field_uuid: fieldUUID,
          };
          addedTableChildData.push(childData);
        }
      }
    });
    return addedTableChildData;
  }
  return null;
};
