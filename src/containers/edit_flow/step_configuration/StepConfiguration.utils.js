import React from 'react';
import cx from 'classnames/bind';
import { BS } from 'utils/UIConstants';
import gClasses from 'scss/Typography.module.scss';
import {
  clearAlertPopOverStatus,
  convertTextToHtml,
  getFileNameFromServer,
  trimString,
  updateAlertPopverStatus,
  validate,
} from 'utils/UtilityFunctions';
import Button, { BUTTON_TYPE } from 'components/form_components/button/Button';
import { cloneDeep, find, get, has, isArray, isEmpty, uniq, set, isUndefined, translateFunction } from 'utils/jsUtility';
import { formatValidationData, getFormDetailsValidateData } from 'utils/formUtils';
import { TASK_STRINGS } from 'containers/task/task/Task.strings';
import { EMPTY_STRING, FORM_POPOVER_STRINGS, SECTION_IS_REQUIRED_TEXT, VALUE_REQUIRED_ERROR } from 'utils/strings/CommonStrings';
import { FILE_UPLOAD_STATUS, LINK_FIELD_PROTOCOL, STEP_TYPE } from 'utils/Constants';
import { FIELD_KEYS, PROPERTY_PICKER_ARRAY, PROPERTY_PICKER_KEYS } from 'utils/constants/form.constant';
import { FIELD_TYPES } from 'components/form_builder/FormBuilder.strings';
import { MAPPING_CONSTANTS } from 'components/flow_trigger_configuration/field_mapping/FieldMapping.constants';
import { getModifiedRequestBody } from 'containers/integration/add_integration/events/add_event/request_body/RequestBody.utils';
import { DIRECT_FIELD_LIST_TYPE, TABLE_FIELD_LIST_TYPE } from 'utils/ValidationConstants';
import { translate } from 'language/config';
import { getDataListPickerFieldFromActiveForm } from 'containers/landing_page/my_tasks/task_content/TaskContent.utils';
import { FIELD_MAPPING_TYPES, FLOW_TRIGGER_CONSTANTS } from 'components/flow_trigger_configuration/TriggerConfiguration.constants';
import { constructRuleDataForFinalSubmission } from '../../../components/condition_builder/ConditionBuilder.utils';
import {
  DUE_DATE_AND_STATUS,
  FLOW_STRINGS,
  FIELD_TYPE_CATEGORY,
  ACTORS_RECOMMENDED_STRINGS,
  STEPPER_DETAILS_STRINGS,
  ACTORS_STRINGS,
  FLOW_ACTION_TYPES,
  STEP_LABELS,
} from '../EditFlow.strings';
import { dueDateValidationSchema } from './StepConfiguration.validations';
import { ASSIGNEE_TYPE } from '../EditFlow.utils';
import { ACTION_CONSTANTS } from '../diagramatic_flow_view/flow_component/conditional_configuration/action_card/ActionCard.constants';
import { INTEGRATION_CONSTANTS } from '../diagramatic_flow_view/flow_component/flow_integration_configuration/FlowIntegrationConfiguration.constants';
import { REQ_BODY_KEY_TYPES } from '../../integration/Integration.utils';
import { DATA_TYPE } from './StepConfiguration.constants';
import { FIELD_LIST_TYPE } from '../../../utils/constants/form.constant';
import { constructFlatStructure } from '../../form/sections/form_layout/FormLayout.utils';
import Trash from '../../../assets/icons/application/Trash';
import { ALLOW_COMMENTS, BUTTON_COLOR_TYPES, BUTTON_POSITION_TYPES, FOOTER_PARAMS_POST_DATA_ID, FORM_ACTION_TYPES } from '../../form/form_builder/form_footer/FormFooter.constant';
import EditIcon from '../../../assets/icons/admin_settings/authentication/EditIcon';
import { BASIC_FORM_FIELD_CONFIG_STRINGS } from '../../form/sections/field_configuration/basic_configuration/BasicConfiguration.strings';
import { getFieldLabelWithRefName } from '../../../utils/UtilityFunctions';
import { BOOLEAN_FIELD_OPTIONS, YES_NO_FIELD_OPTIONS } from '../../../utils/Constants';
import { isFiniteNumber } from '../../../utils/jsUtility';
import { stepAssigneesPostData } from '../node_configuration/NodeConfiguration.utils';
import { USER_STEP_ASSIGNEE_OBJECT_KEYS } from './set_assignee/SetAssignee.utils';

export const getStepConfigBreadcrumbList = ({ flowName, stepName }, t = translateFunction) => ([
  {
    text: flowName,
  },
  {
    // eslint-disable-next-line no-use-before-define
    text: `${t(STATIC_INFO_TITLE_STRINGS.STEP_CONFIG)}: ${stepName}`,
  },
]);

export const getFlowBreadCrumbList = ({ fieldLabel, flowName }) => {
  const textArray = [];
  fieldLabel && textArray.push({
    text: fieldLabel,
    isText: true,
  });
  flowName && textArray.push({
    text: flowName,
    isText: true,
  });
  return textArray;
};

export const getStepperDetails = (onClick, t = translateFunction) => [
  {
    text: t(STEPPER_DETAILS_STRINGS.STEP_DETAILS_AND_ACTORS),
    onClick: () => onClick(0),
  },
  {
    text: t(STEPPER_DETAILS_STRINGS.DESIGN_FORM),
    onClick: () => onClick(1),
  },
  {
    text: t(STEPPER_DETAILS_STRINGS.ADDITIONAL_CONFIG),
    onClick: () => onClick(2),
  },
];

export const INTEGRATION_METHOD_TYPES = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE',
};

export const actorsRecommendationClickHandler = (t = translateFunction) => {
  updateAlertPopverStatus({
    isVisible: true,
    type: 2,
    customElement: (
      <>
        <div className={gClasses.PageMainHeader}>
          {t(ACTORS_RECOMMENDED_STRINGS.WHY_RECOMMENDED)}
        </div>
        <div className={cx(gClasses.MT30, gClasses.FOne13GrayV14)}>
          <span className={gClasses.DisplayBlock}>
            {t(ACTORS_RECOMMENDED_STRINGS.DESCRIPTION_1)}
          </span>
          <span className={cx(gClasses.DisplayBlock, gClasses.MT5)}>
            {t(ACTORS_RECOMMENDED_STRINGS.DESCRIPTION_2)}
          </span>
        </div>
        <div className={cx(gClasses.MT30, BS.FLOAT_RIGHT)}>
          <Button
            buttonType={BUTTON_TYPE.PRIMARY}
            onClick={() => clearAlertPopOverStatus()}
          >
            {t(ACTORS_RECOMMENDED_STRINGS.OK)}
          </Button>
        </div>
      </>
    ),
  });
};

export const STEP_CONFIG_CONSTANTS = {
  STEP_DUE_DATE: {
    ID: 'duration',
    DROPDOWN_ID: 'duration_type',
  },
  SERVER_RESPONSE: {
    NEW_STEP_ERROR_KEYS: {
      FROM_FLOW_DD: 'step_name_flow_dd',
      FROM_SYSTEM_STEP_CONFIG: 'step_name_system_stpe_config',
    },
  },
  STEP_ACTOR_OPTIONS: {
    DIRECT_ASSIGNEE: ASSIGNEE_TYPE.DIRECT_ASSIGNEE,
  },
};

export const BASIC_CONFIG_STRINGS = {
  SAVE_LABEL: 'charts.save',
  CANCEL_LABEL: 'charts.cancel',
  TITLE: {
    STEP_DETAILS: 'flows.basic_config_strings.title.step_details',
    STEP_ACTORS: 'flows.basic_config_strings.title.step_actors',
    RECOMMEND_TEAM: 'flows.basic_config_strings.title.recommend_team',
    WHY: 'flows.basic_config_strings.title.why',
    ADDITIONAL: 'flows.basic_config_strings.title.additional',
  },
  FIELDS: {
    STEP_NAME: {
      ID: 'step_name',
      LABEL: 'flows.basic_config_strings.fields.step_name.label',
      PLACEHOLDER: 'flows.basic_config_strings.fields.step_name.placeholder',
      TOOLTIP:
        'flows.basic_config_strings.fields.step_name.tooltip',
      TOOLTIP_ID: 'stepNameTooltip1',
    },
    STEP_DESCRIPTION: {
      ID: 'step_description',
      LABEL: 'flows.basic_config_strings.fields.step_description.label',
      PLACEHOLDER: 'flows.basic_config_strings.fields.step_description.placeholder',
    },
    STEP_ASSIGNEES: {
      LABEL: 'flows.basic_config_strings.fields.step_assignee.label',
    },
    STEP_DUE_DATE: {
      ID: 'duration',
      LABEL: 'flows.basic_config_strings.fields.step_due_date.label',
      PLACEHOLDER: '000',
      DROPDOWN_ID: 'duration_type',
      OPTIONS: (t) => [
        {
          label: t('flows.basic_config_strings.fields.step_due_date.options.day_label'),
          value: 'days',
        },
        {
          label: t('flows.basic_config_strings.fields.step_due_date.options.hours_label'),
          value: 'hours',
        },
      ],
    },
    STEP_STATUS: {
      ADD_STATUS: 'flows.basic_config_strings.fields.step_due_date.add_status',
    },
  },
};

export const STATIC_INFO_TITLE_STRINGS = {
  STEP_CONFIG: 'flows.static_info_title_strings.step_config',
  ADDITIONAL_CONFIG: 'flows.static_info_title_strings.additional_config',
};

export const STEP_CONFIG_STATIC_INFO = (t = translateFunction) => [
  {
    title: t('flows.step_config_static_info.step_name_and_description.title'),
    description: t('flows.step_config_static_info.step_name_and_description.description'),
  },
  {
    title: t('flows.step_config_static_info.step_assignee.title'),
    description: t('flows.step_config_static_info.step_assignee.description'),
  },
  {
    title: t('flows.step_config_static_info.due_date.title'),
    description: t('flows.step_config_static_info.due_date.description'),
  },
];

export const ADDITIONAL_CONFIG_STATIC_INFO = (t = translateFunction) => [
  {
    title: t('flows.additional_config_static_info.send_email.title'),
    description: t('flows.additional_config_static_info.send_email.description'),
  },
  {
    title: t('flows.additional_config_static_info.escalation.title'),
    description: t('flows.additional_config_static_info.escalation.description'),
  },
  {
    title: t('flows.additional_config_static_info.data_to_data_list.title'),
    description: t('flows.additional_config_static_info.data_to_data_list.description'),
  },
  {
    title: t('flows.additional_config_static_info.document_generation.title'),
    description: t('flows.additional_config_static_info.document_generation.description'),
  },
];

export const constructDueDateData = (due_data) => {
  const duration = due_data[BASIC_CONFIG_STRINGS.FIELDS.STEP_DUE_DATE.ID];
  if (duration && !Number.isNaN(duration)) {
    return {
      [BASIC_CONFIG_STRINGS.FIELDS.STEP_DUE_DATE.ID]: Number(duration),
      type: due_data.type,
      [BASIC_CONFIG_STRINGS.FIELDS.STEP_DUE_DATE.DROPDOWN_ID]:
        due_data.duration_type,
    };
  }
  return {};
};

export const getErrorMessageForDueDate = (
  error_list = {},
  is_escaltion = false,
) => {
  let due_date_error = '';
  Object.keys(error_list).forEach((errorKey) => {
    if (
      is_escaltion
        ? errorKey.includes('escalation_due') || errorKey.includes('duration')
        : errorKey.includes('due_data')
    ) {
      if (error_list[errorKey] && error_list[errorKey].includes('an integer')) {
        due_date_error = (error_list[errorKey] || '').replace(
          'an integer',
          'a whole number',
        );
      } else due_date_error = error_list[errorKey];
    }
  });
  return due_date_error;
};

export const getStatusOptionList = (flowData) => {
  const flow_data = cloneDeep(flowData);
  let step_statuses = get(flow_data, ['step_statuses'], []);
  if (isEmpty(step_statuses)) {
    step_statuses = [DUE_DATE_AND_STATUS.STATUS.OPTIONS[0].label];
  }
  const optionList = step_statuses.map((step_status) => {
    return {
      label: step_status,
      value: step_status,
    };
  });
  return optionList;
};

export const getStaticValue = (value, fieldType, additionalConfig = {}) => {
  if (fieldType === FIELD_TYPES.CURRENCY) {
    return {
      value: Number(value.value),
      currency_type: value.currency_type,
    };
  } else if (fieldType === FIELD_TYPES.LINK) {
    let url = null;
    value = value.map((eachLink) => {
      const link = {
        link_url: eachLink?.link_url,
        link_text: eachLink?.link_text,
      };
      url = link?.link_url;
      if (url) {
        link.link_url = url.trim();
        if (link.link_url.includes(':/') || link.link_url.includes('://')) {
          return link;
        } else {
          link.link_url = `${LINK_FIELD_PROTOCOL.HTTP}${url}`;
          return link;
        }
      }
      return link;
    });
    return value;
  } else if (fieldType === FIELD_TYPES.FILE_UPLOAD) {
    const filePostData = [];
    // const newfilePostData = [];
    console.log('getStaticValue document', value);
    if (!isEmpty(value)) {
      // state.document_details && state.document_details.file_metadata &&
      // state.document_details.file_metadata.some((file_info) => {
      value.forEach((eachFile) => {
        if (eachFile) {
          // if (eachFile.file_uuid === file_info.file_ref_id) {
          filePostData.push(eachFile.fileId || eachFile.documentId);
          // }
          // return false;
        }
      });
      // });
      // f_value = filePostData;
    }
    return { doc_ids: [...new Set([...filePostData])] };
  } else if (fieldType === FIELD_TYPES.USER_TEAM_PICKER ||
    (value && (value.users || value.teams))) {
    const userSelectorStaticValue = {};
    if (value.teams && value.teams.length > 0) {
      userSelectorStaticValue.teams =
        value.teams.map((team) => team._id);
    }

    if (value.users && value.users.length > 0) {
      userSelectorStaticValue.users =
        value.users.map((user) => user._id);
    }
    return userSelectorStaticValue;
  } else if (fieldType === FIELD_TYPES.DATA_LIST) {
    const datalistSelectorStaticValue =
      value && value.map((datalistValue) => datalistValue.value);
    return datalistSelectorStaticValue;
  } else if (additionalConfig?.isParseNumber && fieldType === FIELD_TYPES.NUMBER) {
    return isFiniteNumber(Number(value)) ? value?.toString().includes('.') ? parseFloat(value) : parseInt(value, 10) : value;
  } else {
    return value;
  }
};

export const getSaveTriggerValidateData = (
  details,
) => {
  const { trigger_mapping, child_flow_details } = cloneDeep(details);
  const { child_flow_uuid } = child_flow_details;
  let subProcessValidationData = [];
  if (trigger_mapping) {
    subProcessValidationData = trigger_mapping.map((eachMapping) => {
      const fieldMapping = [];
      if (has(eachMapping, ['child_table_details', 'table_uuid'])) {
        get(eachMapping, ['field_mapping'], []).forEach((eachSubMapping) => {
          let fieldMappingDetails = {
            value_type: eachSubMapping.value_type,
            child_field_type: get(eachSubMapping, ['child_field_details', 'field_type'], EMPTY_STRING),
            child_field_uuid: get(eachSubMapping, ['child_field_details', 'field_uuid'], EMPTY_STRING),
          };

          if (eachSubMapping.value_type === FIELD_MAPPING_TYPES.DYNAMIC) {
            fieldMappingDetails = {
              ...fieldMappingDetails,
              parent_field_uuid: get(eachSubMapping, ['parent_field_details', 'field_uuid'], EMPTY_STRING),
            };
          } else if (eachSubMapping.value_type === FIELD_MAPPING_TYPES.STATIC) {
            fieldMappingDetails = {
              ...fieldMappingDetails,
              static_value: formatValidationData(eachSubMapping.static_value, get(eachSubMapping, ['child_field_details', 'field_type'], EMPTY_STRING)),
            };
          } else if (eachSubMapping.value_type === FIELD_MAPPING_TYPES.SYSTEM) {
            fieldMappingDetails = {
              ...fieldMappingDetails,
              parent_system_field: get(eachSubMapping, ['parent_field_details', 'system_field'], EMPTY_STRING),
            };
          }

          if (has(eachSubMapping, ['child_field_details', 'values'])) {
            fieldMappingDetails = {
              ...fieldMappingDetails,
              values: eachSubMapping.child_field_details.values,
            };
          }

          fieldMapping.push(fieldMappingDetails);
        });
      }
      console.log('eachMapping in post data', eachMapping);

      let currentMappingDetails = { value_type: eachMapping.value_type };

      if (!isEmpty(get(eachMapping, ['child_field_details', 'field_uuid'], []))) {
        currentMappingDetails = {
          ...currentMappingDetails,
          child_field_uuid: get(eachMapping, ['child_field_details', 'field_uuid'], EMPTY_STRING),
          child_field_type: get(eachMapping, ['child_field_details', 'field_type'], EMPTY_STRING),
        };
      } else {
        currentMappingDetails = {
          ...currentMappingDetails,
          child_table_uuid: get(eachMapping, ['child_table_details', 'table_uuid'], EMPTY_STRING),
          child_field_type: get(eachMapping, ['child_table_details', 'field_list_type'], EMPTY_STRING),
        };
      }

      if (eachMapping.value_type === FIELD_MAPPING_TYPES.DYNAMIC) {
        if (!isEmpty(get(eachMapping, ['parent_field_details', 'field_uuid'], []))) {
          currentMappingDetails = {
            ...currentMappingDetails,
            parent_field_uuid: get(eachMapping, ['parent_field_details', 'field_uuid'], EMPTY_STRING),
            parent_field_type: get(eachMapping, ['parent_field_details', 'field_type'], EMPTY_STRING),
          };
        } else {
          currentMappingDetails = {
            ...currentMappingDetails,
            parent_table_uuid: get(eachMapping, ['parent_table_details', 'table_uuid'], EMPTY_STRING),
            parent_field_type: get(eachMapping, ['parent_table_details', 'field_list_type'], EMPTY_STRING),
          };
        }
      } else if (eachMapping.value_type === FIELD_MAPPING_TYPES.STATIC) {
        currentMappingDetails = {
          ...currentMappingDetails,
          static_value: formatValidationData(eachMapping.static_value, get(eachMapping, ['child_field_details', 'field_type'], EMPTY_STRING)),
        };
      } else if (eachMapping.value_type === FIELD_MAPPING_TYPES.SYSTEM) {
        currentMappingDetails = {
          ...currentMappingDetails,
          parent_system_field: get(eachMapping, ['parent_field_details', 'system_field'], EMPTY_STRING),
          parent_field_type: get(eachMapping, ['parent_field_details', 'field_type'], EMPTY_STRING),
        };
      }

      if (has(eachMapping, ['child_field_details', 'values'])) {
        currentMappingDetails = {
          ...currentMappingDetails,
          values: eachMapping.child_field_details.values,
        };
      }

      if (has(eachMapping, ['child_table_details', 'table_uuid'])) {
        currentMappingDetails = {
          ...currentMappingDetails,
          field_mapping: fieldMapping,
        };
      }

      return currentMappingDetails;
    });
  }

  return {
    ...(!isEmpty(subProcessValidationData) ? { trigger_mapping: subProcessValidationData } : null),
    child_flow_uuid: child_flow_uuid,
  };
};

export const getInactiveAssigneesList = (assignees = {}) => {
  const { users = [], teams = [] } = assignees;
  const invalidAssignees = [];
  users.forEach((user) => {
    if (!user.is_active) {
      const name = [];
      if (user?.first_name) {
        name.push(user.first_name);
        if (user?.last_name) name.push(user.last_name);
      } else name.push(user.email);
      invalidAssignees.push(name.join(' '));
    }
  });
  teams.forEach((team) => {
    if (!team.is_active) {
      invalidAssignees.push(team.team_name);
    }
  });
  return invalidAssignees;
};

export const getParallelStepSaveValidateData = (
  steps,
  stepIndex,
) => {
  return {
    step_name: trimString(steps[stepIndex].step_name),
    actions: steps[stepIndex].actions,
  };
};

export const getJoinStepSaveValidateData = (steps, stepIndex) => {
  return {
    step_name: trimString(steps[stepIndex].step_name),
    actions: steps[stepIndex].actions,
    join_condition: steps[stepIndex].join_condition,
  };
};

export const getMLIntegerationInitalValidationData = (details) => {
  const { ml_integration_details = {} } = cloneDeep(details);
  console.log('getIntegerationInitalValidationData', details);
  return {
    step_name: details?.step_name,
    description: details?.description,
    model_code: ml_integration_details?.model_code,
  };
};

export const getIntegerationInitalValidationData = (details) => {
  const { integration_details = {}, event_details = {} } = cloneDeep(details);
  return {
    step_name: details?.step_name,
    step_description: details?.step_description,
    connector_uuid: integration_details?.connector_uuid,
    event_uuid: event_details?.event_uuid,
  };
};

export const constructRequestBodyPostData = (reqParam, updatedList, getCurrentRow, isPost = false, dataFields = [], isTest = false) => {
  reqParam?.forEach((currentRow) => {
    if (currentRow.keepChild) {
      if (currentRow.key_type === 'object') {
        if (!currentRow.is_multiple || isTest) currentRow.value = EMPTY_STRING;
        else if (currentRow.is_multiple) {
          if (isEmpty(currentRow.value)) {
            currentRow.value = EMPTY_STRING;
            currentRow.type = 'direct';
          }
        }
      }
      const modifiedCurrentRow = getCurrentRow && getCurrentRow(currentRow);
      if (currentRow.key_type === 'object' || (currentRow.key_type !== 'object' && !isUndefined(modifiedCurrentRow.value))) updatedList.push(modifiedCurrentRow);
      if (currentRow?.type === 'expression' && modifiedCurrentRow?.value) {
        dataFields.push(modifiedCurrentRow.value);
      }
      if (currentRow?.child_rows && currentRow?.child_rows?.length > 0) {
        const { reqBody: updatedData, dataFields: updatedDataFields } = constructRequestBodyPostData(
          currentRow.child_rows,
          updatedList,
          getCurrentRow,
          isPost,
          dataFields,
          isTest,
        );
        updatedList = updatedData;
        dataFields = updatedDataFields;
      }
    }
  });
  console.log(reqParam, updatedList, 'khkhjkhjk');
  return {
    reqBody: updatedList,
    dataFields,
  };
};

const updateChildRowsBasedOnSiblings = (data) => {
  if (!isEmpty(data.child_rows)) {
    data.child_rows.forEach((childRow, index) => {
      if (!childRow.keepChild) {
        if (childRow.is_required) {
          set(data, ['child_rows', index, 'keepChild'], true);
          set(data, ['child_rows', index], updateChildRowsBasedOnSiblings(childRow));
        }
      }
    });
  }
  return data;
};

const checkForValidChild = (data, keyLabel) => {
  if (!has(data, ['keepChild']) || data.keepChild === undefined) data.keepChild = false;
  (data.child_rows || []).forEach((childRow, index) => {
    if (!has(childRow, ['keepChild']) || childRow.keepChild === undefined) set(data, ['child_rows', index, 'keepChild'], false);
    if (childRow.key_type === 'object') {
      if (childRow.is_multiple && !isEmpty(childRow[keyLabel])) {
        if (!data.keepChild) {
          data.keepChild = true;
        }
      }
      const childRowUpdated = checkForValidChild(childRow, keyLabel);
      set(data, ['child_rows', index], childRowUpdated);
    } else if (!isEmpty(childRow[keyLabel])) {
      set(data, ['child_rows', index, 'keepChild'], true);
      if (!data.keepChild) {
        data.keepChild = true;
      }
    }
  });
  if (data.child_rows) {
    const childList = data.child_rows.some((childRow) => (childRow.keepChild));
    console.log(data.key_name, childList, 'Child list 123');
    if (childList) {
      data.keepChild = true;
      data = updateChildRowsBasedOnSiblings(data);
    }
  }
  return data;
};

export const getIntegrationTestRequestBodyData = (requestBody = []) => {
  const formattedRequestBody = [];
  const clonedRequestBody = cloneDeep(requestBody);
  clonedRequestBody.forEach((data) => {
    if (data.is_required) data.keepChild = true;
    if (data.key_type === 'object') {
      const updatedChild = checkForValidChild(cloneDeep(data), 'test_value');
      formattedRequestBody.push(updatedChild);
    } else {
      if (!isEmpty(data.test_value)) data.keepChild = true;
      formattedRequestBody.push(data);
    }
  });
  console.log(formattedRequestBody, clonedRequestBody, 'formattedRequestBody jljlkjlkj');
  return formattedRequestBody;
};

export const getIntegrationRequestBodyData = (requestBody = []) => {
  const formattedRequestBody = [];
  const clonedRequestBody = cloneDeep(requestBody);
  clonedRequestBody.forEach((data) => {
    if (data.is_required) data.keepChild = true;
    if (data.key_type === 'object') {
      if (data.is_multiple && !isEmpty(data.value)) {
        data.keepChild = true;
      }
      const updatedChild = checkForValidChild(cloneDeep(data), 'value');
      formattedRequestBody.push(updatedChild);
    } else {
      if (!isEmpty(data.value)) data.keepChild = true;
      formattedRequestBody.push(data);
    }
  });
  console.log(formattedRequestBody, clonedRequestBody, 'formattedRequestBody jljlkjlkj actual');
  return formattedRequestBody;
};

export const getMLIntegrationRequestBodyData = (requestBody = []) => {
  const formattedRequestBody = [];
  const clonedRequestBody = cloneDeep(requestBody);
  clonedRequestBody.forEach((data) => {
    if (data.is_required) data.keepChild = true;
    if (data.key === 'object') {
      if (data.is_multiple && !isEmpty(data.value)) {
        data.keepChild = true;
      }
      const updatedChild = checkForValidChild(cloneDeep(data), 'value');
      formattedRequestBody.push(updatedChild);
    } else {
      const reqData = {};
      if (!isEmpty(data.value)) reqData.keepChild = true;
      reqData.key = data.key;
      reqData.value = data.value;
      reqData.is_required = data.is_required;
      reqData.type = data.type;
      reqData.key_uuid = data.key_uuid;
      reqData.is_multiple = data.is_multiple;
      reqData.value_uuid = data?.field_details?.field_uuid;
      formattedRequestBody.push(reqData);
    }
  });
  console.log(formattedRequestBody, clonedRequestBody, 'formattedRequestBody jljlkjlkj actual');
  return formattedRequestBody;
};

export const getIntegerationRequestValidationData = (details) => {
  const { query_params = [], event_headers = [], request_body = [], relative_path } = cloneDeep(details);
  const eventHeaders = [];
  const queryParams = [];
  const relativePath = [];
  let requestBody = [];
  if (!isEmpty(event_headers)) {
    event_headers.forEach((header) => {
      eventHeaders.push({
        key: header.key,
        key_name: header.key_name,
        value: header.value,
        isRequired: header.isRequired,
      });
    });
  }
  if (!isEmpty(query_params)) {
    query_params.forEach((param) => {
      queryParams.push({
        key: param.key,
        key_name: param.key_name,
        value: param.value,
        isRequired: param.isRequired,
      });
    });
  }
  if (!isEmpty(relative_path)) {
    relative_path.forEach((param) => {
      relativePath.push({
        key: param.key,
        key_name: param.key_name,
        value: param.value,
        isRequired: param.isRequired,
      });
    });
  }
  if (!isEmpty(request_body)) {
    const getCurrentRow = (currentRow) => {
      if ((currentRow?.key_type === 'object') && !currentRow?.is_multiple) {
        return {
          key: currentRow?.key,
          type: currentRow?.type,
          is_required: currentRow?.is_required,
          value: currentRow?.value,
        };
      }
      return {
        key: currentRow?.key,
        value: currentRow?.value,
        type: currentRow?.type,
        is_required: currentRow?.is_required,
      };
    };
    const { reqBody } = constructRequestBodyPostData(
      request_body,
      [],
      getCurrentRow,
    );
    requestBody = reqBody;
  }
  return {
    ...getIntegerationInitalValidationData(details),
    ...(!isEmpty(eventHeaders)) ? { event_headers: eventHeaders } : null,
    ...(!isEmpty(queryParams)) ? { query_params: queryParams } : null,
    ...(!isEmpty(relativePath)) ? { relative_path: relativePath } : null,
    ...(!isEmpty(requestBody)) ? { body: requestBody } : null,
  };
};

export const getMLIntegerationRequestValidationData = (details) => {
  console.log('integrationCurrentPage@@@@@@@@', details);
  const { request_body = [] } = cloneDeep(details);
  const requestBody = [];
  if (!isEmpty(request_body)) {
    request_body.forEach((param) => {
      requestBody.push({
        key: param?.key,
        type: param?.type,
        is_required: param?.is_required,
        value: param?.value,
      });
    });
   }
  return {
    ...getMLIntegerationInitalValidationData(details),
    ...(!isEmpty(requestBody)) ? { request_body: requestBody } : null,
  };
};

export const constructUserAndTeamForStepAssignees = (
  details,
  isChildLevel = false,
) => {
  const clonedDetails = cloneDeep(details);
  let step_assignees = [];
  let consolidated_step_assignees = [];
  if (!isEmpty(clonedDetails.step_assignees)) {
    step_assignees = clonedDetails.step_assignees;
    consolidated_step_assignees = cloneDeep(step_assignees);

    let actorKey = null;
    step_assignees.forEach((step_assignee, idk) => {
      actorKey = null;
      if (has(step_assignee, ['assignees'])) actorKey = 'assignees';
      else if (has(step_assignee, ['assignee_field_default'])) {
        actorKey = 'assignee_field_default';
      }

      if (step_assignee?.assignee_type === ASSIGNEE_TYPE.RULE_BASED && !isChildLevel) {
        // TODO: use the below commented lines for new rule based assignee
        // consolidated_step_assignees[idk].rules = consolidated_step_assignees[idk].rules.map((rule) => {
        //   return {
        //     condition_rule: rule.condition_rule,
        //     rule_assignees: constructUserAndTeamForStepAssignees({
        //       ...details, step_assignees: rule.rule_assignees,
        //     }, true),
        //   };
        // });

        consolidated_step_assignees[idk].rule_assignees = constructUserAndTeamForStepAssignees({
          ...details,
          step_assignees: step_assignee.rule_assignees,
        }, true);
      }

      if (actorKey && !isEmpty(step_assignee[actorKey])) {
        const userOrTeamAssignee = step_assignee[actorKey];

        if (userOrTeamAssignee.teams && userOrTeamAssignee.teams.length > 0) {
          consolidated_step_assignees[idk][actorKey].teams =
            userOrTeamAssignee.teams.map((team) => team._id);
        }

        if (userOrTeamAssignee.users && userOrTeamAssignee.users.length > 0) {
          consolidated_step_assignees[idk][actorKey].users =
            userOrTeamAssignee.users.map((user) => user._id);
        }

        if (!consolidated_step_assignees[idk][actorKey].teams) {
          delete consolidated_step_assignees[idk][actorKey].teams;
        }
        if (!consolidated_step_assignees[idk][actorKey].users) {
          delete consolidated_step_assignees[idk][actorKey].users;
        }
      }
    });
  }
  return consolidated_step_assignees;
};

export const getBasicDetailSaveStepPostData = (details, flowData) => {
  const data = {
    flow_id: flowData.flow_id,
    step_name: trimString(details.step_name),
    step_order: details.step_order, // for api data
    step_type: details.step_type,
    // connected_steps: details.connected_steps || [],
  };
  if (details.step_description) data.step_description = details.step_description;

  if (!isEmpty(details._id)) {
    data._id = details._id;
  }
  if (!isEmpty(details.step_uuid)) {
    data.step_uuid = details.step_uuid;
  }
  data.step_assignees = stepAssigneesPostData(
    details.step_assignees,
    USER_STEP_ASSIGNEE_OBJECT_KEYS,
    USER_STEP_ASSIGNEE_OBJECT_KEYS,
  );
  if (details?.due_data?.type === DATA_TYPE.DIRECT) {
    if (
      details?.due_data?.duration &&
      !Number.isNaN(details.due_data.duration)
    ) {
      console.log('flowDataPostDataDuration', constructDueDateData(details?.due_data));
      data.due_data = constructDueDateData(details?.due_data);
    }
  } else if (details?.due_data?.type === DATA_TYPE.RULE) {
    data.due_data = {
      type: details?.due_data?.type,
      rule_uuid: details?.due_data?.rule_uuid,
    };
  }
  if (!isEmpty(details.step_status)) {
    data.step_status = details.step_status;
  }
  // if (!details.is_initiation) {
    data.is_workload_assignment = details.is_workload_assignment;
  // }
  return data;
};

export const constructDynamicMailContentMessage = (content, fieldlist) => {
  const re = /\[([^\]]*)]/g;
  const matches = [];
  let m;
  // eslint-disable-next-line no-cond-assign
  while ((m = re.exec(content))) {
    // eslint-disable-next-line no-useless-escape
    matches.push({ label: m[1].replace(/[\[\]']+/g, '').trim() });
  }
  fieldlist &&
    fieldlist.map((field) => {
      console.log('ConstructField', field);
      const convertedHtml = convertTextToHtml(field.label);
      const field_label = convertedHtml.body.innerHTML;
      if (find(matches, { label: field_label })) {
        if (field.type === 'system') {
          console.log('constructField_System', field);
          content = content.replace(
            `[${field_label}]`,
            `!@#\${"type":"system","identifier":"${field.label}","title":"${field.label}"}$#@!`,
          );
        } else {
          console.log('constructField_Form', field);
          content = content.replace(
            `[${field_label}]`,
            `!@#\${"type":"field","identifier":"${field.field_uuid}","title":"${field.label}"}$#@!`,
          );
        }
      }
      return null;
    });
    console.log('DynamicMailContent', content);
  return content;
};

export const constructSystemStepSaveData = (
  details,
  flowData,
) => {
  const clonedDetails = cloneDeep(details);
  const data = {
    flow_id: flowData.flow_id,
    step_name: trimString(clonedDetails.step_name),
    step_order: details.step_order, // for api data
    step_type: details.step_type,
    is_workload_assignment: false,
    is_timer: false,
    connected_steps: details.connected_steps,
  };
  if (!isEmpty(clonedDetails._id)) {
    data._id = clonedDetails._id;
  }
  if (details?.description) {
    data.description = details?.description;
  }
  if (!isEmpty(clonedDetails.step_uuid)) {
    data.step_uuid = clonedDetails.step_uuid;
  }
  return data;
};

export const constructSaveResponsePostData = (saveResponse = []) => {
  const postData = [];
  saveResponse.forEach((eachRow) => {
    const eachRowData = {};
    if (!eachRow.is_deleted) {
      if (eachRow?.field_type === TABLE_FIELD_LIST_TYPE) {
        if (eachRow?.field_value) {
          eachRowData.table_uuid = eachRow?.field_value;
        } else {
          eachRowData.table_name = eachRow?.field_details?.table_name;
        }
      } else {
        if (eachRow?.field_value) {
          eachRowData.field_uuid = eachRow?.field_value;
        } else {
          eachRowData.field_name = eachRow?.field_details?.field_name;
          eachRowData.field_type = eachRow?.field_type;
        }
      }
      eachRowData.mapping_info = eachRow?.response_key;
      eachRowData.mapping_field_type = eachRow?.response_type;
      if (eachRow?.column_mapping) {
        eachRowData.column_mapping = [];
        eachRow.column_mapping.forEach((eachColumn) => {
          if (!eachColumn.is_deleted) {
            const eachColumnData = {};
            eachColumnData.field_uuid = eachColumn?.field_value;
            eachColumnData.mapping_info = eachColumn?.response_key;
            eachColumnData.mapping_field_type = eachColumn?.response_type;
            if (eachColumn?.field_value) {
              eachColumnData.field_uuid = eachColumn?.field_value;
            } else {
              eachColumnData.field_name = eachColumn?.field_details?.field_name;
              eachColumnData.field_type = eachColumn?.field_type;
            }
            eachRowData.column_mapping.push(eachColumnData);
          }
        });
      }
      postData.push(eachRowData);
    }
  });
  return postData;
};

const integrationMappingPostData = (details, currentPage = 0) => {
  const { query_params, request_body, response_format = [], relative_path = [], event_headers = [] } = cloneDeep(details);
  const eventHeaders = [];
  const queryParams = [];
  const queryDataFields = [];
  const headerDataFields = [];

  if (!isEmpty(event_headers)) {
    event_headers.forEach((param) => {
      if (param?.value) {
        if (param.type === 'expression') headerDataFields.push(param.value);
        eventHeaders.push({
          key: param.key, // key uuid
          value: param.value,
          type: param.type,
        });
      }
    });
  }
  if (!isEmpty(query_params)) {
    query_params.forEach((param) => {
      if (param?.value) {
        if (param.type === 'expression') queryDataFields.push(param.value);
        queryParams.push({
          key: param.key, // key uuid
          value: param.value,
          type: param.type,
        });
      }
    });
  }

  const relativePath = [];
  const relativePathDataFields = [];
  if (!isEmpty(relative_path)) {
    relative_path.forEach((param) => {
      if (param?.value) {
        if (param.type === 'expression') relativePathDataFields.push(param.value);
        relativePath.push({
          path_name: param.key_name, // key uuid
          value: param.value,
          type: param.type,
        });
      }
    });
  }

  const getCurrentRowPostData = (currentRow) => {
    return {
      key: currentRow.key,
      value: currentRow?.value,
      type: currentRow.type || 'expression',
    };
  };

  const { reqBody: requestBody, dataFields: reqDataFields } = constructRequestBodyPostData(request_body, [], getCurrentRowPostData, true);
  const saveResponseBody = (currentPage === 3) ? constructSaveResponsePostData(response_format) : {};
  console.log(cloneDeep(reqDataFields), cloneDeep(queryDataFields), 'lklkllklllkl', requestBody, request_body);
  return {
    ...(!isEmpty(eventHeaders)) ? { event_headers: eventHeaders } : null,
    ...(!isEmpty(queryParams)) ? { query_params: queryParams } : null,
    ...(!isEmpty(relativePath)) ? { relative_path: relativePath } : null,
    ...(!isEmpty(requestBody)) ? { body: requestBody } : null,
    ...(!isEmpty(saveResponseBody)) ? { response_format: saveResponseBody } : null,
    ...(!isEmpty(reqDataFields) || !isEmpty(queryDataFields) || !isEmpty(headerDataFields) || !isEmpty(relativePathDataFields)) ? { data_fields: uniq([...reqDataFields, ...headerDataFields, ...queryDataFields, ...relativePathDataFields]) } : null,
  };
};

export const getFormDetailsValidationData = (flowData) =>
  getFormDetailsValidateData(flowData, null, TASK_STRINGS);

export const ERROR_ON_DESIGN_FORM = translate('flow_config_strings.form_actions.error_on_design_form');
export const BTN_ACTION_MISSING_TEXT = translate('flow_config_strings.form_actions.btn_action_missing_text');

export const BUTTON_ACTION_ERROR_MESSAGE = {
  TITLE: translate('flow_config_strings.form_actions.button_action_error.title'),
  DESCRIPTIVE_TITLE: `${ERROR_ON_DESIGN_FORM} - ${BTN_ACTION_MISSING_TEXT}.`,
  SUBTITLE:
    translate('flow_config_strings.form_actions.button_action_error.subtitle'),
};

export const SECTION_ERROR_MESSAGE = {
  TITLE: FORM_POPOVER_STRINGS.SECTION_REQUIRED_ERROR,
  DESCRIPTIVE_TITLE: `${ERROR_ON_DESIGN_FORM} - ${SECTION_IS_REQUIRED_TEXT}`,
  SUBTITLE:
    FORM_POPOVER_STRINGS.SECTION_REQUIRED_SUBTITLE,
};

export const getSaveFormPostData = (details, flowDataParam, stepIndex) => {
  const flowData = cloneDeep(flowDataParam);

  const data = {
    flow_id: flowData.flow_id,
    step_name: trimString(flowData.steps[stepIndex].step_name),
    step_order: details.step_order, // for api data
    flow_trigger_type:
      flowData.steps[stepIndex].flow_trigger_type,
    repeat_every: flowData.steps[stepIndex].repeat_every,
  };

  if (flowData.steps[stepIndex]._id !== stepIndex) {
    data._id = flowData.steps[stepIndex]._id;
  }

  if (flowData.steps[stepIndex].step_uuid) {
    data.step_uuid = flowData.steps[stepIndex].step_uuid;
  }

  // if (isEmpty(flowData.steps[stepIndex].step_description)) {
  //   data.step_description = null;
  // } else if (!isEmpty(flowData.steps[stepIndex].step_description)) {
  //   data.step_description = flowData.steps[stepIndex].step_description;
  // }

  return data;
};

export const NEW_TRIGGER_STEP_DATA = {
  step_name: EMPTY_STRING,
  step_type: STEP_TYPE.FLOW_TRIGGER,
  connected_steps: [],
  // coordinate_info: coordinate_info, // coordinate_info push
  actions: [],
  savedProgress: 0,
  assignees: {},
  step_assignees: [{
    assignee_type: ASSIGNEE_TYPE.DIRECT_ASSIGNEE,
  }],
  other_step_id: '',
  assignee_field_uuid: '',
  assignee_field_default: [],
  is_final_step: 2,
  is_active: false,
  is_new_step: true,
  isAllFieldsLoading: true,
  trigger_mapping: [],
  child_flow_details: {
    child_flow_uuid: EMPTY_STRING,
    child_flow_id: EMPTY_STRING,
    child_flow_name: EMPTY_STRING,
  },
  is_mni: false,
  cancel_with_parent: false,
  is_async: true,
  trigger_mapping_error_list: {},
};

export const getEmailActionsValidateData = (stepData) => {
  const emailBody = get(stepData, ['active_email_action', 'email_body'], null);
  const data = {
    email_name:
      get(stepData, ['active_email_action', 'email_name'], null) ||
      'Submit Email',
    email_subject: get(
      stepData,
      ['active_email_action', 'email_subject'],
      null,
    ),
    email_body: emailBody === '<p></p>\n' ? '' : emailBody,
    action_uuid: get(stepData, ['active_email_action', 'action_uuid'], []),
    is_condition_rule: false,
  };
  return data;
};

export const getDocumentActionsValidateData = (stepData) => {
  const documentBody = get(
    stepData,
    ['active_document_action', 'document_body'],
    null,
  );
  const data = {
    document_body:
      documentBody === ('<p></p>\n' || '<p><br></p>') ? '' : documentBody,
    file_name: get(stepData, ['active_document_action', 'file_name'], null),
    document_field_name: get(stepData, ['active_document_action', 'document_field_name'], null),
    action_uuid: get(stepData, ['active_document_action', 'action_uuid'], []),
    // is_condition_rule: false,
  };
  return data;
};

export const getDueDateValidation = (stepData, t) => {
  const { due_data } = stepData;
  const error_list = validate(
    constructDueDateData(due_data),
    dueDateValidationSchema(t),
  );
  if (isEmpty(error_list)) {
    Object.keys(stepData?.error_list || {}).forEach((errorKey) => {
      if (errorKey.includes('due_data')) {
        delete stepData.error_list[errorKey];
      }
    });
  }
  const consolidated_error_list =
    isEmpty(stepData?.error_list) && isEmpty(error_list)
      ? {}
      : { ...(stepData?.error_list || {}), ...(error_list || {}) };
  return consolidated_error_list;
};

export const getNewStepInitData = ({
  _id,
  step_id,
  step_uuid,
  step_order,
  step_name,
  step_type,
  connected_steps,
  coordinate_info,
}, params) => {
  const data = {
    _id,
    step_uuid,
    step_order,
    step_name,
    step_type,
    connected_steps: connected_steps,
    coordinate_info: coordinate_info, // coordinate_info push
    actions: [],
  };
  let additionalData = {};
  if (step_type === STEP_TYPE.USER_STEP) {
    additionalData = {
      progress: 0,
      savedProgress: 0,
      step_description: EMPTY_STRING,
      assignees: {},
      step_assignees: [{
        assignee_type: ASSIGNEE_TYPE.DIRECT_ASSIGNEE,
      }],
      other_step_id: '',
      assignee_field_uuid: '',
      assignee_field_default: [],
      due_data: {
        duration_type:
          FLOW_STRINGS.STEPS.STEP.BASIC_INFO_AND_ACTORS.ACTORS
            .OTHER_STEP_ASSIGNEE.DUE_DATA.DUE_DURATION_TYPES[0].TYPE,
        duration: null,
      },
      is_final_step: 2,
      is_active: false,
      is_new_step: true,
      actions: [],
      step_status: DUE_DATE_AND_STATUS.STATUS.OPTIONS[0].value, // step_status initially must be empty string - to be discussed later
      email_actions: [],
      document_generation: [],
      escalations: [],
      data_list_mapping: [],
      active_email_action: {},
      active_escalation: {},
      escalation_error_list: {},
      email_action_error_list: {},
      active_data_list_mapping: {},
      active_document_action: {},
      isAllFieldsLoading: true,
    };
  } else if (step_type === STEP_TYPE.FLOW_TRIGGER) {
    additionalData = {
      progress: 0,
      savedProgress: 0,
      assignees: {},
      step_assignees: [{
        assignee_type: ASSIGNEE_TYPE.DIRECT_ASSIGNEE,
      }],
      other_step_id: '',
      assignee_field_uuid: '',
      assignee_field_default: [],
      is_final_step: 2,
      is_active: false,
      is_new_step: true,
      isAllFieldsLoading: true,
      trigger_mapping: [],
      child_flow_details: {
        child_flow_uuid: EMPTY_STRING,
        child_flow_id: EMPTY_STRING,
        child_flow_name: EMPTY_STRING,
      },
      is_mni: false,
      cancel_with_parent: false,
      is_async: true,
      trigger_mapping_error_list: {},
    };
  } else if (params.step_type === STEP_TYPE.START_STEP) {
    additionalData = {
      connected_steps: [],
      initiators: {
        users: [],
        teams: [],
      },
      has_auto_trigger: false,
      system_initiation: {
        allow_call_by_flow: true,
        allow_call_by_api: false,
      },
      _id: step_id,
      step_name: translateFunction(STEP_LABELS[STEP_TYPE.START_STEP]),
      step_type: STEP_TYPE.START_STEP,
    };
  }

  return {
    ...data,
    ...additionalData,
  };
};

export const getHideShowActionSaveData = (actionData, flow_id) => {
  const { rule_expression = {} } = actionData;

  const _id = '';
  const data = {
    rule_type: 'rule_step_action_condition',
    flow_id,
    rule: constructRuleDataForFinalSubmission(rule_expression),
  };

  if (_id) {
    data._id = _id;
  }

  return data;
};

export const getRuleActionSaveData = (actionData, flow_id) => {
  const next_step_expression = get(actionData, [ACTION_CONSTANTS.KEYS.NEXT_STEP_RULE_EXPRESSION], {});
  const lstIf = get(next_step_expression, ['if'], []);
  const _id = '';
  const lstIfData = [];

  lstIf.map((conditionData) => {
    const ifOutputValue = [];
    ifOutputValue.push(conditionData.next_output_value);
    const condition_expression = constructRuleDataForFinalSubmission({
      expression: conditionData[ACTION_CONSTANTS.KEYS.CONDITION_EXPRESSION],
    });
    const lstConditions = {
      [ACTION_CONSTANTS.KEYS.CONDITION_EXPRESSION]: condition_expression?.expression || {},
      output_value: ifOutputValue,
    };

    lstIfData.push(lstConditions);
    return null;
  });

  const elseOutputValue = [];
  elseOutputValue.push(next_step_expression.else_next_output_value);

  const data = {
    rule_type: 'rule_step_action_next_step',
    flow_id,
    rule: {
      expression_type: 'decisionExpression',
      expression: {
        if: lstIfData,
        else_output_value: elseOutputValue,
      },
    },
  };

  if (_id) {
    data._id = _id;
  }
  return data;
};

export const getStepOrderData = (flowData) => {
  const filteredSteps = cloneDeep(flowData.steps)?.filter((step) => step.step_type !== STEP_TYPE.START_STEP);
  const stepOrderPostData = {};
  stepOrderPostData.flow_id = flowData.flow_id;
  stepOrderPostData.step_details = [];
  const startStepIndex = flowData.steps?.findIndex((step) => step.step_type === STEP_TYPE.START_STEP);
  if (startStepIndex > -1) {
    stepOrderPostData.step_details.push({
      step_id: flowData.steps[startStepIndex]?._id,
      step_order: 0,
    });
  }
  filteredSteps.forEach((step, stepIndex) => {
    const stepOrderData = {
      step_id: step._id,
      step_order: stepIndex + 1,
    };
    stepOrderPostData.step_details.push(stepOrderData);
  });
  return stepOrderPostData;
};

export const constructTriggerMappingPostData = (triggerMapping, document_url_details = []) => {
  let triggerMappingPostData = [];
  if (isArray(triggerMapping) && !isEmpty(triggerMapping)) {
    triggerMappingPostData = triggerMapping.map((eachMapping) => {
      console.log('constructTriggerMappingPostData', eachMapping);
      const fieldMapping = [];
      if (has(eachMapping, ['child_table_details', 'table_uuid'])) {
        get(eachMapping, ['field_mapping'], []).forEach((eachSubMapping) => {
          let fieldMappingDetails = {
            value_type: eachSubMapping.value_type,
            child_field_uuid: get(eachSubMapping, ['child_field_details', 'field_uuid'], EMPTY_STRING),
          };

          if (eachSubMapping.value_type === FIELD_MAPPING_TYPES.DYNAMIC) {
            fieldMappingDetails = {
              ...fieldMappingDetails,
              parent_field_uuid: get(eachSubMapping, ['parent_field_details', 'field_uuid'], EMPTY_STRING),
            };
          } else if (eachSubMapping.value_type === FIELD_MAPPING_TYPES.STATIC) {
            fieldMappingDetails = {
              ...fieldMappingDetails,
              static_value: getStaticValue(
                eachSubMapping.static_value,
                get(eachSubMapping, ['child_field_details', 'field_type'], EMPTY_STRING),
                document_url_details),
            };
          } else if (eachSubMapping.value_type === FIELD_MAPPING_TYPES.SYSTEM) {
            fieldMappingDetails = {
              ...fieldMappingDetails,
              system_field: get(eachSubMapping, ['parent_field_details', 'system_field'], EMPTY_STRING),
            };
          }

          fieldMapping.push(fieldMappingDetails);
        });
      }

      let currentMappingDetails = {};

      if (!isEmpty(get(eachMapping, ['child_field_details', 'field_uuid'], []))) {
        currentMappingDetails = { value_type: eachMapping.value_type };
      }

      if (eachMapping.value_type === FIELD_MAPPING_TYPES.DYNAMIC) {
        if (!isEmpty(get(eachMapping, ['parent_field_details', 'field_uuid'], []))) {
          currentMappingDetails = {
            ...currentMappingDetails,
            parent_field_uuid: get(eachMapping, ['parent_field_details', 'field_uuid'], EMPTY_STRING),
          };
        } else {
          currentMappingDetails = {
            ...currentMappingDetails,
            parent_table_uuid: get(eachMapping, ['parent_table_details', 'table_uuid'], EMPTY_STRING),
          };
        }
      } else if (eachMapping.value_type === FIELD_MAPPING_TYPES.STATIC) {
        currentMappingDetails = {
          ...currentMappingDetails,
          static_value: getStaticValue(
            eachMapping.static_value,
            get(eachMapping, ['child_field_details', 'field_type'], EMPTY_STRING),
            document_url_details),
        };
      } else if (eachMapping.value_type === FIELD_MAPPING_TYPES.SYSTEM) {
        currentMappingDetails = {
          ...currentMappingDetails,
          system_field: get(eachMapping, ['parent_field_details', 'system_field'], EMPTY_STRING),
        };
      }

      if (!isEmpty(get(eachMapping, ['child_field_details', 'field_uuid'], []))) {
        currentMappingDetails = {
          ...currentMappingDetails,
          child_field_uuid: get(eachMapping, ['child_field_details', 'field_uuid'], EMPTY_STRING),
        };
      } else {
        currentMappingDetails = {
          ...currentMappingDetails,
          child_table_uuid: get(eachMapping, ['child_table_details', 'table_uuid'], EMPTY_STRING),
        };
      }

      if (has(eachMapping, ['child_table_details', 'table_uuid'])) {
        currentMappingDetails = {
          ...currentMappingDetails,
          field_mapping: fieldMapping,
        };
      }

      return currentMappingDetails;
    });
  }
  console.log('constructTriggerMappingPostData triggerMappingPostData', triggerMappingPostData);
  return triggerMappingPostData;
};

export const constructStaticValues = (value, fieldType, documentUrlDetails, parentId, entity, type, additionalConfig = {}) => {
  if (fieldType === FIELD_TYPES.FILE_UPLOAD && value && value.doc_ids && isArray(value.doc_ids) &&
    value.doc_ids[0] && typeof value.doc_ids[0] === 'string') {
    const document = [];
    documentUrlDetails && documentUrlDetails.forEach((eachDocument) => {
      if (value && value.doc_ids && value.doc_ids.includes(eachDocument.document_id)) {
        document.push(eachDocument);
      }
    });
    const documentFieldValue = [];
    document.forEach((eachDocument) => {
      if (eachDocument && eachDocument.original_filename) {
        documentFieldValue.push(
          {
            ref_uuid: eachDocument.original_filename.ref_uuid,
            fileName: getFileNameFromServer(eachDocument.original_filename),
            link: eachDocument.signedurl,
            id: eachDocument.document_id,
            documentId: eachDocument.document_id,
            file: {
              name: getFileNameFromServer(eachDocument.original_filename),
              type: eachDocument.original_filename.content_type,
              url: eachDocument.signedurl,
              size: eachDocument.original_filename.file_size,
            },
            url: eachDocument.signedurl,
            status: FILE_UPLOAD_STATUS.SUCCESS,
            fileId: eachDocument.document_id,
            entity_id: parentId,
            entity: entity,
            newDocument: false,
            type: type,
            thumbnail: eachDocument.signedurl,
            upload_signed_url: eachDocument.signedurl,
          },
        );
      }
    });
    return documentFieldValue;
  } else if (fieldType === FIELD_TYPES.DATA_LIST) {
    return getDataListPickerFieldFromActiveForm(value);
  } else if (fieldType === FIELD_TYPES.NUMBER && additionalConfig?.isParseNumber) {
    return String(value);
  } else {
    return value;
  }
};

export const constructSubProcessMappingFromApiData = (mappingData = []) => {
  const constructedMappingData = mappingData?.map((eachMapping) => {
    console.log('eachmapping from API data', eachMapping);
    let parentFieldIsTable = false;
    let childFieldIsTable = false;
    if (eachMapping.parent_table_uuid) {
      parentFieldIsTable = true;
      eachMapping.value_type = MAPPING_CONSTANTS.VALUE_TYPE_OPTION_LIST()[1].value;
    }
    if (eachMapping.child_table_uuid) {
      childFieldIsTable = true;
      eachMapping.value_type = MAPPING_CONSTANTS.VALUE_TYPE_OPTION_LIST()[1].value;
    }
    const fieldMapping = [];
    if (!isEmpty(get(eachMapping, ['field_mapping'], []))) {
      eachMapping.field_mapping.forEach((eachSubMapping) => {
        let { static_value } = cloneDeep(eachSubMapping);
        if (static_value && (has(static_value, ['entry_details']))) {
          static_value = constructStaticValues(static_value, FIELD_TYPES.DATA_LIST);
        }

        let fieldMappingDetails = {
          value_type: eachSubMapping.value_type,
        };

        if (eachSubMapping.value_type === 'dynamic') {
          fieldMappingDetails = {
            ...fieldMappingDetails,
            parent_field_details: {
              field_uuid: eachSubMapping.parent_field_uuid,
              field_name: EMPTY_STRING,
            },
          };
        } else if (eachSubMapping.value_type === 'static') {
          fieldMappingDetails = {
            ...fieldMappingDetails,
            static_value: static_value,
          };
        } else if (eachSubMapping.value_type === 'system') {
          fieldMappingDetails = {
            ...fieldMappingDetails,
            parent_field_details: {
              system_field: eachSubMapping.system_field,
              field_name: EMPTY_STRING,
            },
          };
        }

        if (eachSubMapping?.static_value && has(eachSubMapping?.static_value, ['entry_details'])) {
          fieldMappingDetails = {
            ...fieldMappingDetails,
            child_field_details: {
              field_uuid: eachSubMapping.child_field_uuid,
              field_name: EMPTY_STRING,
              field_type: FIELD_TYPES.DATA_LIST,
            },
          };
        } else {
          fieldMappingDetails = {
            ...fieldMappingDetails,
            child_field_details: {
              field_uuid: eachSubMapping.child_field_uuid,
              field_name: EMPTY_STRING,
            },
          };
        }

        fieldMapping.push(fieldMappingDetails);
      });
    }

    let { static_value } = cloneDeep(eachMapping);
    if (static_value && (has(static_value, ['entry_details']))) {
      static_value = constructStaticValues(static_value, FIELD_TYPES.DATA_LIST);
    }

    let currentMappingDetails = {
      value_type: eachMapping.value_type || MAPPING_CONSTANTS.VALUE_TYPE_OPTION_LIST()[1].value,
    };

    if (eachMapping.value_type === 'dynamic') {
      if (!parentFieldIsTable) {
        currentMappingDetails = {
          ...currentMappingDetails,
          parent_field_details: {
            field_uuid: eachMapping.parent_field_uuid,
            field_name: EMPTY_STRING,
          },
        };
      } else {
        currentMappingDetails = {
          ...currentMappingDetails,
          parent_table_details: {
            table_uuid: eachMapping.parent_table_uuid,
            table_name: EMPTY_STRING,
          },
        };
      }
    } else if (eachMapping.value_type === 'static') {
      currentMappingDetails = {
        ...currentMappingDetails,
        static_value: static_value,
      };
    } else if (eachMapping.value_type === 'system') {
      currentMappingDetails = {
        ...currentMappingDetails,
        parent_field_details: {
          system_field: eachMapping.system_field,
          field_name: EMPTY_STRING,
        },
      };
    }

    if (!childFieldIsTable) {
      if (eachMapping?.static_value && has(eachMapping?.static_value, ['entry_details'])) {
        currentMappingDetails = {
          ...currentMappingDetails,
          child_field_details: {
            field_uuid: eachMapping.child_field_uuid,
            field_name: EMPTY_STRING,
            field_type: FIELD_TYPES.DATA_LIST,
          },
        };
      } else {
        currentMappingDetails = {
          ...currentMappingDetails,
          child_field_details: {
            field_uuid: eachMapping.child_field_uuid,
            field_name: EMPTY_STRING,
          },
        };
      }
    } else {
      currentMappingDetails = {
        ...currentMappingDetails,
        child_table_details: {
          table_uuid: eachMapping.child_table_uuid,
          table_name: EMPTY_STRING,
        },
      };
    }

    if (!isEmpty(fieldMapping)) {
      currentMappingDetails = {
        ...currentMappingDetails,
        field_mapping: fieldMapping,
      };
    }

    return currentMappingDetails;
  });
  return constructedMappingData;
};

export const constructStaticValue = (valueList, fieldType) => {
  console.log('constructStaticValue', fieldType, valueList);
  const values = fieldType === FIELD_TYPES.YES_NO ? [
    {
      value: true,
      label: 'Yes',
    },
    {
      value: false,
      label: 'No',
    },
  ] : valueList.map((eachValue) => {
    return {
      label: eachValue,
      value: eachValue,
    };
  });
  return values;
};

export const constructTriggerMappingFieldMetadata = (
  triggerMapping, fieldMetadata, tableMetadata, documentDetails = [], parentId, entity = EMPTY_STRING, type, t = translateFunction) => {
  const clonedMapping = cloneDeep(triggerMapping);
  const document_details = {
    documents: [],
    entity: entity,
    entity_id: parentId,
  };
  const modifiedMappingData = clonedMapping.map((eachMapping) => {
    const childFlowField = find(fieldMetadata, {
      field_uuid: get(eachMapping, ['child_field_details', 'field_uuid'], EMPTY_STRING),
    });
    const childFlowTableField = find(fieldMetadata, {
      field_uuid: get(eachMapping, ['child_table_details', 'table_uuid'], EMPTY_STRING),
    });

    let parentFlowField = find(fieldMetadata, {
      field_uuid: get(eachMapping, ['parent_field_details', 'field_uuid'], EMPTY_STRING),
    });

    if (isEmpty(parentFlowField) && get(eachMapping, ['parent_field_details', 'system_field'], null)) {
      parentFlowField = find(FLOW_TRIGGER_CONSTANTS.SYSTEM_FIELD_LIST(t), {
        value: get(eachMapping, ['parent_field_details', 'system_field'], EMPTY_STRING),
      });
    }

    const parentFlowTableField = find(fieldMetadata, {
      field_uuid: get(eachMapping, ['parent_table_details', 'table_uuid'], EMPTY_STRING),
    });
    const childFieldType = childFlowField ? childFlowField?.field_type : childFlowTableField?.field_type;

    const staticValue = eachMapping.value_type === 'static' && constructStaticValues(
      eachMapping.static_value, childFieldType, documentDetails, parentId, entity, type);
    if (eachMapping.value_type === 'static' && childFieldType === FIELD_TYPES.FILE_UPLOAD) {
      document_details.ref_uuid = staticValue && staticValue[0] && staticValue[0].ref_uuid;
      document_details.documents.push({ staticValue });
    }

    const fieldMapping = [];
    if (!isEmpty(get(eachMapping, ['field_mapping'], []))) {
      eachMapping.field_mapping.forEach((eachSubMapping) => {
        // clonedMapping.map((eachMapping) => {
        const childFlowField = find(fieldMetadata, {
          field_uuid: eachSubMapping.child_field_details.field_uuid,
        });

        let parentFlowField = find(fieldMetadata, {
          field_uuid: eachSubMapping.parent_field_details?.field_uuid,
        });

        if (isEmpty(parentFlowField) && get(eachSubMapping, ['parent_field_details', 'system_field'], null)) {
          parentFlowField = find(FLOW_TRIGGER_CONSTANTS.SYSTEM_FIELD_LIST(t), {
            value: get(eachSubMapping, ['parent_field_details', 'system_field'], EMPTY_STRING),
          });
        }

        const childFieldType = childFlowField && childFlowField.field_type;
        console.log('childFlowField dropdown eachSubMapping', childFlowField, parentFlowField);
        const staticValue = eachSubMapping.value_type === 'static' && constructStaticValues(
          eachSubMapping.static_value, childFieldType, documentDetails, parentId, entity, type);
        if (eachSubMapping.value_type === 'static' && childFieldType === FIELD_TYPES.FILE_UPLOAD) {
          document_details.documents.push({ staticValue });
        }

        let fieldMappingDetails = {
          ...eachSubMapping,
        };

        const childDetails = {
          field_uuid: (childFlowField && childFlowField.field_uuid) || EMPTY_STRING,
          field_id: (childFlowField && childFlowField._id) || EMPTY_STRING,
          field_name: (childFlowField && childFlowField.field_name) || EMPTY_STRING,
          field_type: (childFieldType) || EMPTY_STRING,
          choice_value_type: childFlowField?.choice_value_type,
          choice_values: childFlowField?.choice_values || [],
          label: getFieldLabelWithRefName(childFlowField?.field_name, childFlowField?.reference_name),
        };

        if (has(childFlowField, ['values']) || (childFieldType === FIELD_TYPES.YES_NO)) {
          childDetails.values = (childFlowField &&
            childFieldType === FIELD_TYPES.FILE_UPLOAD ? staticValue :
            constructStaticValue(childFlowField.values,
              childFieldType)) || [];
        }

        if (has(childFlowField, ['data_list_details'])) {
          childDetails.data_list_details = childFlowField?.data_list_details;
        }

        fieldMappingDetails = {
          ...fieldMappingDetails,
          child_field_details: childDetails,
        };

        if (eachSubMapping.value_type === 'dynamic') {
          fieldMappingDetails = {
            ...fieldMappingDetails,
            parent_field_details: {
              field_uuid: (parentFlowField && parentFlowField.field_uuid) || EMPTY_STRING,
              field_name: (parentFlowField && parentFlowField.field_name) || EMPTY_STRING,
              field_type: (parentFlowField && parentFlowField.field_type) || EMPTY_STRING,
              label: getFieldLabelWithRefName(parentFlowField?.field_name, parentFlowField?.reference_name),
            },
          };
        } else if (eachSubMapping.value_type === 'static') {
          fieldMappingDetails = {
            ...fieldMappingDetails,
            static_value: staticValue,
          };
        } else if (eachSubMapping.value_type === 'system') {
          fieldMappingDetails = {
            ...fieldMappingDetails,
            parent_field_details: {
              system_field: (parentFlowField && parentFlowField.value) || EMPTY_STRING,
              field_name: (parentFlowField && parentFlowField.label) || EMPTY_STRING,
              field_type: (parentFlowField && parentFlowField.field_type) || EMPTY_STRING,
              label: parentFlowField.label,
            },
          };
        }

        fieldMapping.push(fieldMappingDetails);
        // });
      });
    }

    if (childFlowTableField || parentFlowTableField) eachMapping.value_type = 'dynamic';
    console.log('check each one mapping', fieldMapping, eachMapping, childFlowField, childFlowTableField, parentFlowField, parentFlowTableField);

    let currentMappingDetails = {
      ...eachMapping,
    };

    if (childFlowField) {
      const childDetails = {
        field_uuid: (childFlowField && childFlowField.field_uuid) || EMPTY_STRING,
        field_id: (childFlowField && childFlowField._id) || EMPTY_STRING,
        field_name: (childFlowField && childFlowField.field_name) || EMPTY_STRING,
        field_type: (childFieldType) || EMPTY_STRING,
        choice_value_type: childFlowField?.choice_value_type,
        choice_values: childFlowField?.choice_values || [],
        label: getFieldLabelWithRefName(childFlowField?.field_name, childFlowField?.reference_name),
      };

      if (has(childFlowField, ['values']) || (childFieldType === FIELD_TYPES.YES_NO)) {
        childDetails.values = (childFlowField &&
          childFieldType === FIELD_TYPES.FILE_UPLOAD ? staticValue :
          constructStaticValue(childFlowField.values,
            childFieldType)) || [];
      }
      if (has(childFlowField, ['data_list_details'])) {
        childDetails.data_list_details = childFlowField?.data_list_details;
      }

      currentMappingDetails = {
        ...currentMappingDetails,
        child_field_details: childDetails,
      };
    } else {
      currentMappingDetails = {
        ...currentMappingDetails,
        child_table_details: {
          table_uuid: childFlowTableField?.field_uuid || EMPTY_STRING,
          field_list_type: childFieldType || TABLE_FIELD_LIST_TYPE,
          table_name: getFieldLabelWithRefName(childFlowTableField?.field_name, childFlowTableField?.reference_name),
        },
      };
    }

    if (eachMapping.value_type === 'dynamic') {
      if (parentFlowField) {
        currentMappingDetails = {
          ...currentMappingDetails,
          parent_field_details: {
            field_uuid: (parentFlowField && parentFlowField.field_uuid) || EMPTY_STRING,
            field_name: (parentFlowField && parentFlowField.field_name) || EMPTY_STRING,
            field_type: (parentFlowField && parentFlowField.field_type) || EMPTY_STRING,
            label: getFieldLabelWithRefName(parentFlowField?.field_name, parentFlowField?.reference_name),
          },
        };
      } else {
        currentMappingDetails = {
          ...currentMappingDetails,
          parent_table_details: {
            table_uuid: parentFlowTableField?.field_uuid || EMPTY_STRING,
            field_list_type: parentFlowTableField?.field_type || TABLE_FIELD_LIST_TYPE,
            table_name: getFieldLabelWithRefName(parentFlowTableField?.field_name, parentFlowTableField?.reference_name),
          },
        };
      }
    } else if (eachMapping.value_type === 'static') {
      currentMappingDetails = {
        ...currentMappingDetails,
        static_value: staticValue,
      };
    } else if (eachMapping.value_type === 'system') {
      currentMappingDetails = {
        ...currentMappingDetails,
        parent_field_details: {
          system_field: (parentFlowField && parentFlowField.value) || EMPTY_STRING,
          field_name: (parentFlowField && parentFlowField.label) || EMPTY_STRING,
          field_type: (parentFlowField && parentFlowField.field_type) || EMPTY_STRING,
          label: parentFlowField.label,
        },
      };
    }

    if (!isEmpty(fieldMapping)) {
      currentMappingDetails = {
        ...currentMappingDetails,
        field_mapping: fieldMapping,
      };
    }

    return currentMappingDetails;
  });
  console.log('updatedTriggerMapping eachMapping',
    modifiedMappingData);
  return { modifiedMappingData, document_details };
};

export const getDeletedFieldsErrorList = (triggerMappingErrorList = {}, trigger_mapping = [], t = translateFunction) => {
  const { CHILD_FIELD_MAPPING, PARENT_FIELD_MAPPING,
    TRIGGER_MAPPING, STATIC_VALUE } = MAPPING_CONSTANTS;
  const errorList = triggerMappingErrorList;
  trigger_mapping.forEach((eachMapping, mappingIndex) => {
    const childFieldCondition = !isEmpty(get(eachMapping, ['child_field_details', 'field_name'], EMPTY_STRING));
    const childTableFieldCondition = !isEmpty(get(eachMapping, ['child_table_details', 'table_name'], EMPTY_STRING));
    const parentFieldCondition = !isEmpty(get(eachMapping, ['parent_field_details', 'field_name'], EMPTY_STRING));
    const parentTableFieldCondition = !isEmpty(get(eachMapping, ['parent_table_details', 'table_name'], EMPTY_STRING));
    console.log('getDeletedFieldsErrorList loop', MAPPING_CONSTANTS.VALUE_TYPE_OPTION_LIST()[1].value, eachMapping.value_type, childFieldCondition, childTableFieldCondition, eachMapping);
    console.log('eachMapping.value_type === MAPPING_CONSTANTS.VALUE_TYPE_OPTION_LIST()[1].value',
      eachMapping.value_type,
      MAPPING_CONSTANTS.VALUE_TYPE_OPTION_LIST()[1].value);
    if (!(childFieldCondition || childTableFieldCondition)) {
      errorList[`${TRIGGER_MAPPING},${mappingIndex},${CHILD_FIELD_MAPPING.ID}`] = t('error_popover_status.fields_deleted');
    }
    if (!(parentFieldCondition || parentTableFieldCondition) && eachMapping.value_type === MAPPING_CONSTANTS.VALUE_TYPE_OPTION_LIST()[1].value) {
      errorList[`${TRIGGER_MAPPING},${mappingIndex},${PARENT_FIELD_MAPPING.ID}`] = t('error_popover_status.fields_deleted');
    }
    if (has(eachMapping, [STATIC_VALUE.ID]) && (isEmpty(eachMapping.static_value) &&
      eachMapping?.child_field_mapping?.field_type === FIELD_TYPES.DATA_LIST)) {
      errorList[`${TRIGGER_MAPPING},${mappingIndex},${STATIC_VALUE.ID}`] = t(STATIC_VALUE.ERROR_MESSAGE);
    }
    // if(has())
  });
  console.log('getDeletedFieldsErrorList', errorList);
  return errorList;
};

export const constructTriggerStepSaveData = (
  details,
  flowData,
) => {
  console.log('construct trigger step data', cloneDeep(details));
  const clonedDetails = cloneDeep(details);
  const triggerMapping = constructTriggerMappingPostData(
    details.trigger_mapping,
    details.document_details || []) || [];
  const data = {
    ...constructSystemStepSaveData(clonedDetails, flowData),
    flow_id: flowData.flow_id,
    step_order: details.step_order || flowData.steps.length + 1,
    trigger_details: {
      child_flow_uuid:
        get(details, ['child_flow_details', 'child_flow_uuid'], EMPTY_STRING) || EMPTY_STRING,
        ...(!isEmpty(triggerMapping)) ? { trigger_mapping: triggerMapping } : null,
    },
    is_mni: false,
    cancel_with_parent: details.cancel_with_parent || false,
    is_async: true,
    step_type: details.step_type,
    step_assignees: constructUserAndTeamForStepAssignees(
      cloneDeep(details),
    ),
  };
  if (!isEmpty(clonedDetails._id)) {
    data._id = clonedDetails._id;
  }
  if (!isEmpty(clonedDetails.step_uuid)) {
    data.step_uuid = clonedDetails.step_uuid;
  }
  if (!isEmpty(clonedDetails.step_uuid)) {
    data.step_uuid = clonedDetails.step_uuid;
  }
  if (!isEmpty(clonedDetails.trigger_uuid)) {
    data.trigger_details.trigger_uuid = details.trigger_uuid;
  }
  if (clonedDetails.document_details && !isEmpty(clonedDetails.document_details.documents)) {
    const documentDetails = {};
    if (clonedDetails.document_details.entity) documentDetails.entity = clonedDetails.document_details.entity;
    if (clonedDetails.document_details.entity_id) documentDetails.entity_id = clonedDetails.document_details.entity_id;
    if (clonedDetails.document_details.ref_uuid) documentDetails.ref_uuid = clonedDetails.document_details.ref_uuid;
    documentDetails.uploaded_doc_metadata = [];
    clonedDetails.document_details.documents.forEach((eachDocument) => {
      const removedDocList = get(clonedDetails, ['removedDocList'], []);
      if (isEmpty(removedDocList) ||
        (isArray(removedDocList) && !removedDocList.includes(eachDocument.fileId))) {
        if (eachDocument.newDocument) {
          documentDetails.uploaded_doc_metadata.push({
            document_id: eachDocument.fileId,
            type: eachDocument.type,
            upload_signed_url: eachDocument.upload_signed_url,
          });
        }
      }
      if (isArray(removedDocList) && !isEmpty(removedDocList)) {
        documentDetails.removed_doc_list = removedDocList;
      }
    });
    if (!isEmpty(documentDetails.uploaded_doc_metadata)) {
      data.document_details = documentDetails;
    }
  }
  return data;
};

export const constructInitialIntegrationPostData = (
  details,
  flowData,
) => {
  console.log('construct trigger step data', cloneDeep(details));
  const clonedDetails = cloneDeep(details);
  const { integration_details = {}, event_details = {} } = cloneDeep(details);
  //  integration_details.connector_id = integration_details?._id;
  const integrationDetailsPostData = {
    connector_uuid: integration_details?.connector_uuid,
    event_uuid: event_details?.event_uuid,
    ...(details._id) ? { ...integrationMappingPostData(cloneDeep(details), true) } : null,
    is_required_check: false,
  };
  const data = {
    ...constructSystemStepSaveData(clonedDetails, flowData),
    flow_id: flowData.flow_id,
    step_order: details.step_order || flowData.steps.length + 1,
    step_type: details.step_type,
    integration_details: integrationDetailsPostData,
  };

  // temporary failure action
  // data.failure_action = clonedDetails.failure_action || 'continue_flow';
  data.skip_during_testbed = has(clonedDetails, ['skip_during_testbed']) ? clonedDetails.skip_during_testbed : true;

  if (!isEmpty(clonedDetails._id)) {
    data._id = clonedDetails._id;
  }
  if (!isEmpty(clonedDetails.step_uuid)) {
    data.step_uuid = clonedDetails.step_uuid;
  }

  return data;
};
export const constructMLIntegrationPostData = (MLIntegrationPostData) => {
  const { body = [], response_format = [], data_fields = [] } = MLIntegrationPostData;
  const data = {};
  if (!isEmpty(body)) data.body = body;
  if (!isEmpty(response_format)) data.response_format = response_format;
  if (!isEmpty(data_fields)) data.data_fields = data_fields;
  return data;
};

export const constructInitialMLIntegrationPostData = (
  details,
  flowData,
) => {
  const clonedDetails = cloneDeep(details);
  const { ml_integration_details = {} } = cloneDeep(details);
 const mlModelConfigDetailsPostData = {
  model_id: ml_integration_details?.model_id,
  model_code: ml_integration_details?.model_code,
  ...(details._id) ? { ...constructMLIntegrationPostData(cloneDeep(ml_integration_details)) } : null,
 };
  const data = {
    ...constructSystemStepSaveData(clonedDetails, flowData),

    // procedure_id: flowData.procedure_id,
    step_order: details.step_order || flowData.steps.length + 1,
    step_type: details.step_type,
    // collect_data: false,
    ml_integration_details: mlModelConfigDetailsPostData,
  };

   // temporary failure action
  //  data.failure_action = clonedDetails.failure_action || 'continue_flow';
  //  data.skip_during_testbed = has(clonedDetails, ['skip_during_testbed']) ? clonedDetails.skip_during_testbed : true;

  if (!isEmpty(clonedDetails._id)) {
    data._id = clonedDetails._id;
  }
  if (!isEmpty(clonedDetails.step_uuid)) {
    data.step_uuid = clonedDetails.step_uuid;
  }

  return data;
};

export const constructMLRequestIntegrationPostData = (
  details,
  flowData,
) => {
  const clonedDetails = cloneDeep(details);
  const { ml_integration_details = {}, request_body } = cloneDeep(details);
  const body = [];
 const data_fields = [];

  request_body.forEach((data) => {
      const reqData = {};
      reqData.key = data.key_uuid;
      reqData.type = data.type;
      body.push(reqData);
      if (data.type === INTEGRATION_CONSTANTS.REQUEST_CONFIGURATION.RELATIVE_PATH.VALUE.TYPES.EXPRESSION) {
        data_fields.push(data.value_uuid);
        reqData.value = data.value_uuid;
      } else {
        reqData.value = data.value;
      }
  });
 const mlModelConfigDetailsPostData = {
  model_id: ml_integration_details?.model_id,
  model_code: ml_integration_details?.model_code,
  body: body,
 };
  if (!isEmpty(data_fields)) {
    mlModelConfigDetailsPostData.data_fields = data_fields;
  }
  const data = {
    ...constructSystemStepSaveData(clonedDetails, flowData),

    step_order: details.step_order || flowData.steps.length + 1,
    step_type: details.step_type,
    ml_integration_details: mlModelConfigDetailsPostData,
  };
  if (!isEmpty(clonedDetails._id)) {
    data._id = clonedDetails._id;
  }
  if (!isEmpty(clonedDetails.step_uuid)) {
    data.step_uuid = clonedDetails.step_uuid;
  }

  return data;
};

export const constructMLResponseIntegrationPostData = (details, flowData, isResponseData = true) => {
    const clonedDetails = cloneDeep(details);
  const { ml_integration_details = {}, request_body, response_format = {} } = cloneDeep(details);
  const body = [];
 const data_fields = [];
 const response_format_data = [];

  request_body.forEach((data) => {
      const reqData = {};
      reqData.key = data.key_uuid;
      reqData.type = data.type;
      body.push(reqData);
      if (data.type === INTEGRATION_CONSTANTS.REQUEST_CONFIGURATION.RELATIVE_PATH.VALUE.TYPES.EXPRESSION) {
        data_fields.push(data.value_uuid);
        reqData.value = data.value_uuid;
      } else {
        reqData.value = data.value;
      }
  });
  response_format.forEach((data) => {
    const resData = {};
    if (!data.is_deleted) {
      resData.mapping_info = data.response_key;
      resData.mapping_field_type = data.response_type;
      if (data?.field_details?.field_list_type === INTEGRATION_CONSTANTS.REQUEST_CONFIGURATION.RELATIVE_PATH.VALUE.TYPES.EXPRESSION) {
        resData.field_uuid = data?.field_details?.field_uuid;
      } else {
        resData.field_name = data?.field_value;
        resData.field_type = data?.field_type;
      }
      response_format_data.push(resData);
    }
});
 const mlModelConfigDetailsPostData = {
  model_id: ml_integration_details?.model_id,
  model_code: ml_integration_details?.model_code,
  body: body,
 };
 if (isResponseData) mlModelConfigDetailsPostData.response_format = response_format_data;

 if (!isEmpty(data_fields)) {
  mlModelConfigDetailsPostData.data_fields = data_fields;
}
  const data = {
    ...constructSystemStepSaveData(clonedDetails, flowData),

    step_order: details.step_order || flowData.steps.length + 1,
    step_type: details.step_type,
    ml_integration_details: mlModelConfigDetailsPostData,
  };
  if (!isEmpty(clonedDetails._id)) {
    data._id = clonedDetails._id;
  }
  if (!isEmpty(clonedDetails.step_uuid)) {
    data.step_uuid = clonedDetails.step_uuid;
  }
  return data;
};

export const constructMLResponsePostData = (details) => {
const { response_format = {} } = cloneDeep(details);
const response_format_data = [];

response_format.forEach((data) => {
  const resData = {};
  if (!data.is_deleted) {
  resData.response_key = data.response_key;
  resData.response_type = data.response_type;
  resData.field_value = data.field_value ? data.field_value : null;
  resData.field_type = data.field_type ? data.field_type : null;
  response_format_data.push(resData);
  }
});
return response_format_data;
};

export const constructMLResponseValidateData = (details) => {
  const { response_format = {} } = cloneDeep(details);
  const response_format_data = [];
  response_format.forEach((data) => {
    const resData = {};
    resData.response_key = data.response_key;
    resData.response_type = data.response_type;
    resData.field_value = data.field_value ? data.field_value : null;
    resData.field_type = data.field_type ? data.field_type : null;
    resData.is_deleted = data.is_deleted;
    response_format_data.push(resData);
  });
  return response_format_data;
  };

export const constructIntegrationStepSaveData = (details, flowData, saveFromFlow = false) => {
  const { REQUEST_CONFIGURATION } = INTEGRATION_CONSTANTS;
  const reqbody = saveFromFlow ? cloneDeep(details)?.request_body || [] :
    getIntegrationRequestBodyData(cloneDeep(details)?.request_body, REQUEST_CONFIGURATION.QUERY.VALUE.ID) || [];
  const data = constructInitialIntegrationPostData(
    { ...cloneDeep(details), request_body: reqbody },
    flowData);
  return data;
};

export const constructMLIntegrationStepSaveData = (details, flowData, saveFromFlow = false) => {
  const reqbody = saveFromFlow ? cloneDeep(details)?.request_body || [] :
  getMLIntegrationRequestBodyData(cloneDeep(details)?.request_body) || [];
  const data = constructInitialMLIntegrationPostData(
    { ...cloneDeep(details), request_body: reqbody },
    flowData);
  return data;
};

export const constructRequestPageIntegrationPostData = (
  details,
  flowData,
) => {
  const clonedDetails = cloneDeep(details);
  // const { integration_details = {}, event_details = {} } = cloneDeep(details);

  //   const integrationDetailsPostData = {
  //   connector_uuid: integration_details?.connector_uuid,
  //   event_uuid: event_details?.event_uuid,
  //   ...integrationMappingPostData(cloneDeep(details)),
  //   // ...(!isEmpty(dataFields)) ? { data_fields: dataFields } : null,
  //  };
  const data = {
    ...constructSystemStepSaveData(clonedDetails, flowData),
    ...constructInitialIntegrationPostData(clonedDetails, flowData),

    flow_id: flowData.flow_id,
    step_order: details.step_order || flowData.steps.length + 1,
    step_type: details.step_type,
    // integration_details: integrationDetailsPostData,
  };

  // temporary failure action
  // data.failure_action = clonedDetails.failure_action || 'continue_flow';
  data.skip_during_testbed = has(clonedDetails, ['skip_during_testbed']) ? clonedDetails.skip_during_testbed : true;

  if (!isEmpty(clonedDetails._id)) {
    data._id = clonedDetails._id;
  }
  if (!isEmpty(clonedDetails.step_uuid)) {
    data.step_uuid = clonedDetails.step_uuid;
  }

  return data;
};

export const constructMLRequestPageIntegrationPostData = (
  details,
  flowData,
) => {
  const clonedDetails = cloneDeep(details);
  console.log(details, flowData, constructMLRequestIntegrationPostData(clonedDetails, flowData), 'getMLIntegrationRequestBodyDatareqbody!!!!!!!!!!');

  const data = {
    ...constructSystemStepSaveData(clonedDetails, flowData),
    ...constructMLRequestIntegrationPostData(clonedDetails, flowData),
    step_order: details.step_order || flowData.steps.length + 1,
    step_type: details.step_type,
  };
   data.skip_during_testbed = has(clonedDetails, ['skip_during_testbed']) ? clonedDetails.skip_during_testbed : true;

  if (!isEmpty(clonedDetails._id)) {
    data._id = clonedDetails._id;
  }
  if (!isEmpty(clonedDetails.step_uuid)) {
    data.step_uuid = clonedDetails.step_uuid;
  }

  return data;
};

export const constructIntegrationTestPostData = (
  details,
  formattedTestRequesBody,
) => {
  const clonedDetails = cloneDeep(details);
  const { integration_details = {}, event_details = {},
    test_query_params = [], test_relative_path = [], test_event_headers = [] } = clonedDetails;
  //  integration_details.connector_id = integration_details?._id;

  const getCurrentRowPostData = (currentRow) => {
    let value = EMPTY_STRING;
    if ((currentRow?.type !== REQ_BODY_KEY_TYPES.OBJECT) || isEmpty(currentRow?.child_rows)) {
      if (currentRow.key_type === REQ_BODY_KEY_TYPES.STREAM) {
        value = [];
        (currentRow?.test_value?.fileData || []).forEach((file) => {
          value.push(file.fileId);
        });
      } else {
        value = currentRow?.test_value || EMPTY_STRING;
      }
    }
    return {
      key: currentRow?.key,
      value,
    };
  };
  const getRelativePathPostData = (currentRow) => {
    return {
      path_name: currentRow?.key_name,
      value: currentRow?.test_value,
      // is_deleted: currentRow.type === 'object',
    };
  };

  const { reqBody: testBody } = constructRequestBodyPostData(formattedTestRequesBody, [], getCurrentRowPostData, false, [], true);
  const testEventHeaders = [];
  if (!isEmpty(test_event_headers)) {
    test_event_headers.forEach((param) => {
      if (!isEmpty(param.test_value)) testEventHeaders.push(getCurrentRowPostData(param));
    });
  }
  const testParams = [];
  if (!isEmpty(test_query_params)) {
    test_query_params.forEach((param) => {
      if (!isEmpty(param.test_value)) testParams.push(getCurrentRowPostData(param));
    });
  }
  const testRelativePath = [];
  if (!isEmpty(test_relative_path)) {
    test_relative_path.forEach((param) => {
      if (!isEmpty(param.test_value)) testRelativePath.push(getRelativePathPostData(param));
    });
  }
  console.log('flatArray final', formattedTestRequesBody, details, testParams, testRelativePath, testBody);
  const integrationDetailsPostData = {
    connector_uuid: integration_details?.connector_uuid,
    event_uuid: event_details?.event_uuid,
    ...(!isEmpty(testBody)) ? { body: testBody } : null,
    ...(!isEmpty(testEventHeaders)) ? { event_headers: testEventHeaders } : null,
    ...(!isEmpty(testParams)) ? { query_params: testParams } : null,
    ...(!isEmpty(testRelativePath)) ? { relative_path: testRelativePath } : null,
    // is_required_check: true,
  };
  return integrationDetailsPostData;
};

export const constructSaveResponseIntegrationPostData = (
  details,
  flowData,
  currentPage,
) => {
  const clonedDetails = cloneDeep(details);
  const { integration_details = {}, event_details = {} } = cloneDeep(details);
  //  integration_details.connector_id = integration_details?._id;
  console.log('asdfasdfasdfasdfasdfasdfasf1', cloneDeep(details).response_format);
  const integrationDetailsPostData = {
    connector_uuid: integration_details?.connector_uuid,
    event_uuid: event_details?.event_uuid,
    // ...(!isEmpty(dataFields)) ? { data_fields: dataFields } : null,
    ...integrationMappingPostData(cloneDeep(details), currentPage),
    is_required_check: false,
  };

  const data = {
    ...constructSystemStepSaveData(clonedDetails, flowData),
    ...constructInitialIntegrationPostData(clonedDetails, flowData),
    flow_id: flowData.flow_id,
    step_order: details.step_order || flowData.steps.length + 1,
    step_type: details.step_type,
    integration_details: integrationDetailsPostData,
  };

  // temporary failure action
  // data.failure_action = clonedDetails.failure_action || 'continue_flow';
  data.skip_during_testbed = has(clonedDetails, ['skip_during_testbed']) ? clonedDetails.skip_during_testbed : true;

  if (!isEmpty(clonedDetails._id)) {
    data._id = clonedDetails._id;
  }
  if (!isEmpty(clonedDetails.step_uuid)) {
    data.step_uuid = clonedDetails.step_uuid;
  }

  return data;
};

export const constructMLSaveResponseIntegrationPostData = (
  details,
  flowData,
) => {
  const clonedDetails = cloneDeep(details);

  const data = {
    ...constructSystemStepSaveData(clonedDetails, flowData),
    ...constructMLResponseIntegrationPostData(clonedDetails, flowData, true),
    flow_id: flowData.flow_id,
    step_order: details.step_order || flowData.steps.length + 1,
    step_type: details.step_type,
  };

  data.skip_during_testbed = has(clonedDetails, ['skip_during_testbed']) ? clonedDetails.skip_during_testbed : true;

  if (!isEmpty(clonedDetails._id)) {
    data._id = clonedDetails._id;
  }
  if (!isEmpty(clonedDetails.step_uuid)) {
    data.step_uuid = clonedDetails.step_uuid;
  }

  return data;
};

export const constructMLSaveActionIntegrationPostData = (
  details,
  flowData,
) => {
  const clonedDetails = cloneDeep(details);

  const data = {
    ...constructSystemStepSaveData(clonedDetails, flowData),
    ...constructMLResponseIntegrationPostData(clonedDetails, flowData, false),
    flow_id: flowData.flow_id,
    step_order: details.step_order || flowData.steps.length + 1,
    step_type: details.step_type,
  };

  data.skip_during_testbed = has(clonedDetails, ['skip_during_testbed']) ? clonedDetails.skip_during_testbed : true;

  if (!isEmpty(clonedDetails._id)) {
    data._id = clonedDetails._id;
  }
  if (!isEmpty(clonedDetails.step_uuid)) {
    data.step_uuid = clonedDetails.step_uuid;
  }

  return data;
};
export const constructSaveResponseFromApiData = (saveResponseApiData = [], field_details = [], updateData = null) => {
  const postData = [];
  const mappedResponseFields = [];
  saveResponseApiData.forEach((eachRow, rowIndex) => {
    const parentPath = rowIndex.toString();
    const eachRowData = {};
    eachRowData.field_value = eachRow.field_uuid || eachRow.table_uuid;
    eachRowData.response_key = eachRow.mapping_info;
    eachRowData.response_type = eachRow.mapping_field_type;
    eachRowData.path = parentPath;
    if (eachRow.table_uuid) {
      const tableDetails = field_details.find((field) => field.field_uuid === eachRowData.field_value) || {};
      if (tableDetails) {
        if (updateData && tableDetails?.table_uuid) mappedResponseFields.push(tableDetails?.table_uuid);
        const tableLabel = getFieldLabelWithRefName(tableDetails?.field_name, tableDetails?.reference_name);
        eachRowData.field_details = {
          label: tableLabel,
          table_name: tableLabel,
          value: tableDetails?.table_uuid,
          table_uuid: tableDetails?.table_uuid,
          field_list_type: eachRow?.field_list_type,
          id: 'field_value',
        };
      }
    } else {
      const fieldDetails = field_details.find((field) => field.field_uuid === eachRowData.field_value) || {};
      eachRowData.field_details = {
        ...fieldDetails,
        label: getFieldLabelWithRefName(fieldDetails?.field_name, fieldDetails?.reference_name),
        value: eachRowData.field_value,
      };
    }
    eachRowData.field_type = eachRow.table_uuid ? TABLE_FIELD_LIST_TYPE : eachRowData.field_details?.field_type;
    if (eachRowData.field_details) {
      eachRowData.field_details.field_list_type = eachRow.table_uuid ? TABLE_FIELD_LIST_TYPE : DIRECT_FIELD_LIST_TYPE;
    }
    eachRowData.new_field = false;
    eachRowData.is_deleted = false;
    if (eachRow?.column_mapping) {
      eachRowData.column_mapping = [];
      eachRow.column_mapping.forEach((eachColumn, columnIndex) => {
        const childPath = columnIndex.toString();
        const eachColumnData = {};
        eachColumnData.field_value = eachColumn.field_uuid || eachColumn.table_uuid;
        eachColumnData.response_key = eachColumn.mapping_info;
        eachColumnData.response_type = eachColumn.mapping_field_type;
        eachColumnData.path = `${parentPath},column_mapping,${childPath}`;
        const fieldDetails = field_details.find((field) => field.field_uuid === eachColumnData.field_value) || {};
        eachColumnData.field_details = {
        ...fieldDetails,
        label: getFieldLabelWithRefName(fieldDetails?.field_name, fieldDetails?.reference_name),
        value: eachColumnData.field_value,
      };
        eachColumnData.parent_table_uuid = eachColumnData?.field_details?.table_uuid;
        eachColumnData.parent_table_name = eachColumnData?.field_details?.table_name;
        eachColumnData.field_type = eachColumnData.field_details?.field_type;
        eachColumnData.new_field = false;
        eachColumnData.is_deleted = false;
        eachRowData.column_mapping.push(eachColumnData);
      });
    }
    postData.push(eachRowData);
  });
  if (updateData) updateData(mappedResponseFields);
  return postData;
};

export const FEILD_LIST_DROPDOWN_TYPE = {
  ALL_TABLE_FIELDS: 1,
  DIRECT: 2,
  ALL: 3,
  SELECTED_TABLE_FIELDS: 4,
  TABLES: 5,
  SELECTED_TABLE_FIELDS_AND_DIRECT: 6,
};

export const getGroupedFieldListForMapping = (table_uuid = EMPTY_STRING, pagination_data = [], mappedFieldUuids = [], fieldListDropdownType = FEILD_LIST_DROPDOWN_TYPE.ALL, t = translateFunction, allowedFieldTypes = []) => {
  const groupedTriggerFields = {
    [t('flows.send_data_to_datalist_all_labels.field_groups.text_fields')]: [],
    [t('flows.send_data_to_datalist_all_labels.field_groups.number_fields')]: [],
    [t('flows.send_data_to_datalist_all_labels.field_groups.date_fields')]: [],
    [t('flows.send_data_to_datalist_all_labels.field_groups.selection_fields')]: [],
    [t('flows.send_data_to_datalist_all_labels.field_groups.file_fields')]: [],
    [t('flows.send_data_to_datalist_all_labels.field_groups.table_names')]: [],
    [t('flows.send_data_to_datalist_all_labels.field_groups.other_fields')]: [],
  };
  const fields = [];
  const isFetchTableFields = !isEmpty(table_uuid) || ([FEILD_LIST_DROPDOWN_TYPE.ALL_TABLE_FIELDS, FEILD_LIST_DROPDOWN_TYPE.SELECTED_TABLE_FIELDS_AND_DIRECT].includes(fieldListDropdownType));
  console.log('ghhghgcvhgv', table_uuid, isFetchTableFields);

  let filteredFields = [];

  if (isEmpty(allowedFieldTypes)) filteredFields = pagination_data;
  else {
    filteredFields = pagination_data?.filter((fieldData) => allowedFieldTypes?.includes(fieldData.field_type));
  }

  filteredFields?.forEach((fieldData = {}) => {
    if (!has(fieldData, ['disabled']) && fieldData.field_type !== 'table') {
      if (fieldListDropdownType === FEILD_LIST_DROPDOWN_TYPE.TABLES) {
        if (!groupedTriggerFields[t('flows.send_data_to_datalist_all_labels.field_groups.table_names')].some((table) =>
          table.table_uuid === fieldData.table_uuid) && fieldData.table_uuid
          && !mappedFieldUuids.includes(fieldData.table_uuid)) {
          const label = filteredFields.find((data) => data.field_uuid === fieldData.table_uuid)?.label || fieldData.table_reference_name;
          groupedTriggerFields[t('flows.send_data_to_datalist_all_labels.field_groups.table_names')].push({
            label,
            value: fieldData.table_uuid,
            field_list_type: fieldData.field_list_type,
            table_uuid: fieldData.table_uuid,
            table_name: label,
            field_name: label,
            ...(fieldData?.data_list_details) ? { data_list_details: fieldData?.data_list_details } : {},
            // current_level: FIELD_PICKER_DROPDOWN_TYPES.TABLE_FIELDS,
          });
        }
      } else if (fieldData.field_list_type === FIELD_LIST_TYPE.DIRECT || isFetchTableFields) {
        const checkifTableField = isFetchTableFields && (
          (
            [FEILD_LIST_DROPDOWN_TYPE.ALL_TABLE_FIELDS, FEILD_LIST_DROPDOWN_TYPE.SELECTED_TABLE_FIELDS_AND_DIRECT].includes(fieldListDropdownType) &&
            (get(fieldData, ['field_list_type'], EMPTY_STRING) === FIELD_LIST_TYPE.TABLE)
          ) ||
          (
            [FEILD_LIST_DROPDOWN_TYPE.SELECTED_TABLE_FIELDS, FEILD_LIST_DROPDOWN_TYPE.SELECTED_TABLE_FIELDS_AND_DIRECT].includes(fieldListDropdownType) &&
            !isEmpty(table_uuid) &&
            (get(fieldData, ['table_uuid'], EMPTY_STRING) === table_uuid)
          ) || (
            (fieldListDropdownType === FEILD_LIST_DROPDOWN_TYPE.SELECTED_TABLE_FIELDS_AND_DIRECT) &&
            (fieldData.field_list_type === FIELD_LIST_TYPE.DIRECT)
          )
        );
       const updatedFieldData = {
          ...fieldData,
          value: fieldData.field_uuid,
          field_list_type: fieldData.field_list_type,
          ...(fieldData?.data_list_details) ? { data_list_details: fieldData?.data_list_details } : {},
          // current_level: FIELD_PICKER_DROPDOWN_TYPES.DATA_FIELDS,
        };
        if (
          !mappedFieldUuids.includes(fieldData.field_uuid) &&
          (!isFetchTableFields || checkifTableField)
        ) {
          if (FIELD_TYPE_CATEGORY.NUMBER_FIELDS.includes(fieldData.field_type)) {
            groupedTriggerFields[t('flows.send_data_to_datalist_all_labels.field_groups.number_fields')].push(updatedFieldData);
          } else if (FIELD_TYPE_CATEGORY.DATE_FIELDS.includes(fieldData.field_type)) {
            groupedTriggerFields[t('flows.send_data_to_datalist_all_labels.field_groups.date_fields')].push(updatedFieldData);
          } else if (FIELD_TYPE_CATEGORY.SELECTION_FIELDS.includes(fieldData.field_type)) {
            groupedTriggerFields[t('flows.send_data_to_datalist_all_labels.field_groups.selection_fields')].push(updatedFieldData);
          } else if (FIELD_TYPE_CATEGORY.TEXT_FIELDS.includes(fieldData.field_type)
            && !mappedFieldUuids.includes(fieldData.field_uuid)) {
            groupedTriggerFields[t('flows.send_data_to_datalist_all_labels.field_groups.text_fields')].push(updatedFieldData);
          } else if (FIELD_TYPE_CATEGORY.FILE_FIELDS.includes(fieldData.field_type)) {
            groupedTriggerFields[t('flows.send_data_to_datalist_all_labels.field_groups.file_fields')].push(updatedFieldData);
          } else if (FIELD_TYPE_CATEGORY.TABLE_FIELDS.includes(fieldData.field_type)) {
            groupedTriggerFields[t('flows.send_data_to_datalist_all_labels.field_groups.table_names')].push(updatedFieldData);
          } else if (!mappedFieldUuids.includes(fieldData.field_uuid)) {
            groupedTriggerFields[t('flows.send_data_to_datalist_all_labels.field_groups.other_fields')].push(updatedFieldData);
          }
        }
      } else if (((fieldListDropdownType !== FEILD_LIST_DROPDOWN_TYPE.DIRECT) || (fieldListDropdownType === FEILD_LIST_DROPDOWN_TYPE.ALL)) && (fieldData.field_list_type === FIELD_LIST_TYPE.TABLE)) {
        if (!groupedTriggerFields[t('flows.send_data_to_datalist_all_labels.field_groups.table_names')].some((table) =>
          table.table_uuid === fieldData.table_uuid)
          && !mappedFieldUuids.includes(fieldData.table_uuid)) {
          const label = filteredFields.find((data) => data.field_uuid === fieldData.table_uuid)?.label || fieldData.table_reference_name;
          groupedTriggerFields[t('flows.send_data_to_datalist_all_labels.field_groups.table_names')].push({
            ...fieldData,
            label,
            value: fieldData.table_uuid,
            field_list_type: fieldData.field_list_type,
            table_uuid: fieldData.table_uuid,
            table_name: label,
            field_name: label,
            ...(fieldData?.data_list_details) ? { data_list_details: fieldData?.data_list_details } : {},
            // current_level: FIELD_PICKER_DROPDOWN_TYPES.TABLE_FIELDS,
          });
        }
      }
    }
  });
  console.log('groupedTriggerFields fieldData', groupedTriggerFields);
  Object.keys(groupedTriggerFields).forEach((eachCategory) => {
    console.log('groupedTriggerFields', groupedTriggerFields[eachCategory]);
    if (!isEmpty(groupedTriggerFields[eachCategory])) {
      // if (isUndefined(titleField) || (
      //   !isUndefined(titleField) && titleField.disabled === false
      // ))
      fields.push({
        label: eachCategory,
        value: eachCategory,
        optionType: 'Title',
        disabled: true,
      });
      fields.push(...groupedTriggerFields[eachCategory]);
    }
  });
  console.log('check fields now here', fields);
  return fields;
};

export const getActionPostData = (action) => {
  const actions = {
    [FOOTER_PARAMS_POST_DATA_ID.ACTION_LABEL]: get(action, [FOOTER_PARAMS_POST_DATA_ID.ACTION_LABEL], EMPTY_STRING),
    [FOOTER_PARAMS_POST_DATA_ID.ACTION_TYPE]: get(action, [FOOTER_PARAMS_POST_DATA_ID.ACTION_TYPE], EMPTY_STRING),
    [FOOTER_PARAMS_POST_DATA_ID.ALLOW_COMMENTS]: get(action, [FOOTER_PARAMS_POST_DATA_ID.ALLOW_COMMENTS], ALLOW_COMMENTS.OPTIONAL),
    [FOOTER_PARAMS_POST_DATA_ID.BUTTON_COLOR]: get(action, [FOOTER_PARAMS_POST_DATA_ID.BUTTON_COLOR], BUTTON_COLOR_TYPES.POSITIVE),
    [FOOTER_PARAMS_POST_DATA_ID.BUTTON_POSITION]: get(action, [FOOTER_PARAMS_POST_DATA_ID.BUTTON_POSITION], BUTTON_POSITION_TYPES.RIGHT),
    [FOOTER_PARAMS_POST_DATA_ID.IS_CONDITION_RULE]: false,
  };
  if (get(action, [FOOTER_PARAMS_POST_DATA_ID.ACTION_UUID])) {
    actions[FOOTER_PARAMS_POST_DATA_ID.ACTION_UUID] = action[FOOTER_PARAMS_POST_DATA_ID.ACTION_UUID];
  }
  if (action[FOOTER_PARAMS_POST_DATA_ID.ACTION_TYPE] === FORM_ACTION_TYPES.FORWARD) {
    if (action[FOOTER_PARAMS_POST_DATA_ID.IS_NEXT_STEP_RULE]) {
        actions[FOOTER_PARAMS_POST_DATA_ID.IS_NEXT_STEP_RULE] = true;
        actions[FOOTER_PARAMS_POST_DATA_ID.NEXT_STEP_RULE] = action[FOOTER_PARAMS_POST_DATA_ID.NEXT_STEP_RULE];
    } else {
        actions[FOOTER_PARAMS_POST_DATA_ID.IS_NEXT_STEP_RULE] = false;
        actions[FOOTER_PARAMS_POST_DATA_ID.NEXT_STEP_UUID] = action[FOOTER_PARAMS_POST_DATA_ID.NEXT_STEP_UUID];
    }
  }

  if (action[FOOTER_PARAMS_POST_DATA_ID.ACTION_TYPE] === FORM_ACTION_TYPES.END_FLOW) {
    actions[FOOTER_PARAMS_POST_DATA_ID.NEXT_STEP_UUID] = action[FOOTER_PARAMS_POST_DATA_ID.NEXT_STEP_UUID];
  }

  if (action[FOOTER_PARAMS_POST_DATA_ID.IS_CONDITION_RULE]) {
    actions[FOOTER_PARAMS_POST_DATA_ID.IS_CONDITION_RULE] = true;
    actions[FOOTER_PARAMS_POST_DATA_ID.CONDITION_RULE] = action[FOOTER_PARAMS_POST_DATA_ID.CONDITION_RULE];
  }
  return actions;
};

export const getFieldTypeIncludingChoiceValueType = (field) => {
  if (PROPERTY_PICKER_ARRAY.includes(get(field, ['field_type'], null))) {
    return {
      fieldType: get(field, [FIELD_KEYS.PROPERTY_PICKER_DETAILS, PROPERTY_PICKER_KEYS.REFERENCE_FIELD_TYPE], null),
    };
  }
  if ([FIELD_TYPES.DROPDOWN, FIELD_TYPES.RADIO_GROUP].includes(field?.field_type)) {
    let choiceValueType = null;
    const chioceValueOptions = BASIC_FORM_FIELD_CONFIG_STRINGS(translateFunction).OPTIONS.VALUE_TYPES;
    switch (field?.choice_value_type) {
      case chioceValueOptions[0].VALUE:
        choiceValueType = FIELD_TYPES.SINGLE_LINE;
        break;
      case chioceValueOptions[1].VALUE:
        choiceValueType = FIELD_TYPES.NUMBER;
        break;
      case chioceValueOptions[2].VALUE:
        choiceValueType = FIELD_TYPES.DATE;
        break;
      default:
        choiceValueType = FIELD_TYPES.SINGLE_LINE;
        break;
    }
    return {
      choiceValueType,
      actualChoiceValueType: field?.choice_value_type,
      fieldType: field?.field_type,
    };
  }
  return {
    fieldType: field?.field_type,
  };
};

export const getFieldType = (field) => {
  if (PROPERTY_PICKER_ARRAY.includes(get(field, ['field_type'], null))) {
    return get(field, [FIELD_KEYS.PROPERTY_PICKER_DETAILS, PROPERTY_PICKER_KEYS.REFERENCE_FIELD_TYPE], null);
  }
  return get(field, ['field_type'], null);
};
export const getOptionValue = (field) => {
  if (PROPERTY_PICKER_ARRAY.includes(get(field, ['field_type'], null))) {
    return get(field, [FIELD_KEYS.PROPERTY_PICKER_DETAILS, PROPERTY_PICKER_KEYS.VALUES], []);
  }
  return get(field, [PROPERTY_PICKER_KEYS.VALUES], []);
};

export const getIgnoreStepTypeList = (stepType) => {
  if (stepType === STEP_TYPE.PARALLEL_STEP) {
    return [STEP_TYPE.END_FLOW, STEP_TYPE.JOIN_STEP];
  } else return [];
  // else if (stepType === STEP_TYPE.JOIN_STEP) {
  //   return [STEP_TYPE.END_FLOW];
};

export const getValidationDataForAdditionalConfig = (stepData) => {
  const { additional_configuration, email_actions, escalations, data_list_mapping, document_generation } = cloneDeep(stepData);
  return {
    send_email_condition: additional_configuration?.send_email_condition,
    email_escalation_condition: additional_configuration?.email_escalation_condition,
    send_data_to_datalist_condition: additional_configuration?.send_data_to_datalist_condition,
    document_generation_condition: additional_configuration?.document_generation_condition,
    email_actions,
    escalations,
    data_list_mapping,
    document_generation,
  };
};

export const stepAssigneeServerErrorHandling = (errorMessage, step_assignees, t = translateFunction) => {
  if (errorMessage
    // && errorMessage.includes('indexes')
  ) {
    const errorIndexList = errorMessage.split('.');
    if (!isEmpty(errorIndexList) && errorIndexList.length > 2) {
      const errorIndex = errorIndexList[1];
      const selectedAssigneeList = step_assignees[errorIndex];
      if (selectedAssigneeList.assignee_type === ASSIGNEE_TYPE.DIRECT_ASSIGNEE) {
        return {
          direct_assignee: t(ACTORS_STRINGS.INVALID_ACTOR),
        };
      }
    }
  }
  return {};
};

export const formatInitialEventData = (selected_event = {}, integration_details, field_details = [], validateParams = false) => {
  const data = {};
  const errorList = {};
  const { REQUEST_CONFIGURATION } = INTEGRATION_CONSTANTS;
  if (!isEmpty(selected_event?.headers)) {
    if (!has(errorList, ['requestError'])) errorList.requestError = {};
    data.event_headers = selected_event?.headers.map((eachHeader, index) => {
      let additionalData = {};
      if (!isEmpty(integration_details?.event_headers)) {
        const headerData = integration_details?.event_headers.find((data) => data.key === eachHeader.key_uuid);
        if (!isEmpty(headerData)) {
          const fieldDetails = field_details?.find((field) => field.field_uuid === headerData.value);
          additionalData = {
            value: headerData.value,
            type: headerData.type,
            ...(headerData.type === 'expression') ? {
              field_details: {
                ...fieldDetails,
                label: getFieldLabelWithRefName(fieldDetails?.field_name, fieldDetails?.reference_name),
              },
            } : null,
          };
        }
        if (validateParams && eachHeader.is_required && isEmpty(eachHeader.value) && isEmpty(headerData.value)) {
          errorList.requestError[`${REQUEST_CONFIGURATION.HEADERS.ID},${index},${REQUEST_CONFIGURATION.HEADERS.VALUE.ID}`] = VALUE_REQUIRED_ERROR;
        }
      }
      return {
        key_name: eachHeader.key,
        value: eachHeader.value,
        key: eachHeader.key_uuid,
        isRequired: eachHeader.is_required,
        test_value: additionalData.type === 'direct' ? additionalData.value : EMPTY_STRING,
        type: 'expression',
        ...additionalData,
      };
    });
    data.test_event_headers = cloneDeep(data.event_headers);
  }
  if (!isEmpty(selected_event?.params)) {
    if (!has(errorList, ['requestError'])) errorList.requestError = {};
    data.query_params = selected_event?.params.map((eachParam, index) => {
      let additionalData = {};
      if (!isEmpty(integration_details?.query_params)) {
        const queryData = integration_details?.query_params.find((data) => data.key === eachParam.key_uuid);
        if (!isEmpty(queryData)) {
          const fieldDetails = field_details?.find((field) => field.field_uuid === queryData.value);
          additionalData = {
            value: queryData.value,
            type: queryData.type,
            ...(queryData.type === 'expression') ? {
              field_details: {
                ...fieldDetails,
                label: getFieldLabelWithRefName(fieldDetails?.field_name, fieldDetails?.reference_name),
              },
            } : null,
          };
        }
        if (validateParams && eachParam.is_required && isEmpty(eachParam.value) && isEmpty(queryData.value)) {
          errorList.requestError[`${REQUEST_CONFIGURATION.QUERY.ID},${index},${REQUEST_CONFIGURATION.QUERY.VALUE.ID}`] = VALUE_REQUIRED_ERROR;
        }
      }
      return {
        key_name: eachParam.key,
        value: eachParam.value,
        key: eachParam.key_uuid,
        isRequired: eachParam.is_required,
        test_value: additionalData.type === 'direct' ? additionalData.value : EMPTY_STRING,
        type: 'expression',
        ...additionalData,
      };
    });
    data.test_query_params = cloneDeep(data.query_params);
  }
  if (!isEmpty(selected_event?.relative_path)) {
    data.relative_path = selected_event?.relative_path.map((eachParam, index) => {
      console.log(eachParam, 'jkhjkhjkhjk');
      let additionalData = {};
      if (!isEmpty(integration_details?.relative_path)) {
        if (!has(errorList, ['requestError'])) errorList.requestError = {};
        const relativePathData = integration_details?.relative_path.find((data) => data.path_name === eachParam.key);
        if (!isEmpty(relativePathData)) {
          const fieldDetails = field_details?.find((field) => field.field_uuid === relativePathData.value);
          additionalData = {
            value: relativePathData.value,
            type: relativePathData.type,
            ...(relativePathData.type === 'expression') ? {
              field_details: {
                ...fieldDetails,
                label: getFieldLabelWithRefName(fieldDetails?.field_name, fieldDetails?.reference_name),
              },
            } : null,
          };
          if (validateParams && eachParam.is_required && isEmpty(eachParam.value) && isEmpty(relativePathData.value)) {
            errorList.requestError[`${REQUEST_CONFIGURATION.RELATIVE_PATH.ID},${index},${REQUEST_CONFIGURATION.QUERY.VALUE.ID}`] = VALUE_REQUIRED_ERROR;
          }
        }
      }
      return {
        key_name: eachParam.key,
        value: eachParam.value,
        key: eachParam.key_uuid,
        isRequired: true,
        test_value: additionalData.type === 'direct' ? additionalData.value : EMPTY_STRING,
        type: 'expression',
        ...additionalData,
      };
    });
    data.test_relative_path = cloneDeep(data.relative_path);
    console.log(data.relative_path, 'lhjklhjkhkjhkjhjk', selected_event?.relative_path);
  }
  if (!isEmpty(selected_event?.body)) {
    if (!has(errorList, ['requestBodyErrorList'])) errorList.requestBodyErrorList = {};
    const getRowData = (data) => {
      console.log('getRowDataChooseEvent', cloneDeep(data));
      data.key_name = data.key;
      data.key = data.key_uuid;
      data.key_type = data.type;
      if (data?.value_type) {
        data.type = data.value_type;
        if (data.type === 'expression') {
          const fieldDetails = field_details.find((field) => field.field_uuid === data.value);
          data.field_details = {
            ...fieldDetails,
            label: getFieldLabelWithRefName(fieldDetails?.field_name, fieldDetails?.reference_name),
          };
        } else data.test_value = data.value;
        delete data.value_type;
      } else {
        if (data.key_type === 'object' && !data.is_multiple) data.type = 'direct';
        else data.type = 'expression';
      }
      delete data.key_uuid;
      return data;
    };
    const initialReqBody = getModifiedRequestBody(selected_event?.body, 'child_rows', 'key_uuid', getRowData, integration_details?.body);
    data.request_body = getIntegrationRequestBodyData(cloneDeep(initialReqBody));
    console.log(cloneDeep(initialReqBody), data.request_body, 'mkmklmklm');
    data.test_body = getIntegrationTestRequestBodyData(cloneDeep(initialReqBody));
  }
  if (!isEmpty(errorList)) data.errorList = errorList;
  if (!isEmpty(selected_event?.response_body)) data.response_body = getModifiedRequestBody(selected_event?.response_body);

  return data;
};

export const getModifiedLocaleFlowData = (localeFlowData) => {
  const keyCounts = {};

  localeFlowData?.forEach?.((data) => {
    const { key } = data;
    keyCounts[key] = (keyCounts[key] || 0) + 1;
  });

  const modifiedLocaleFlowData = localeFlowData.map((data) => {
    const { key } = data;
    const count = keyCounts[key];
    keyCounts[key] -= 1;
    const newKey = count === 1 ? key : `${key}_${count}`;

    return {
      ...data,
      newKey: newKey,
    };
  });
  return modifiedLocaleFlowData;
};

export const constructSaveFormDataForFlow = (formData, metaData) => {
  const data = {
    flow_id: metaData.moduleId,
    step_id: metaData.stepId,
    sections: formData.sections.map((s) => {
      const section = {
        section_name: s.section_name,
        section_order: s.section_order,
        section_uuid: s.section_uuid,
        is_section_show_when_rule: s.is_section_show_when_rule,
        no_of_columns: s.no_of_columns,
        contents: constructFlatStructure(s.layout),
      };
      return section;
    }),
    form_uuid: metaData.formUUID,
    form_name: formData.title,
  };
  if (formData.description) data.form_description = formData.description;

  return data;
};

export const STEP_ACTION_VALUE = {
  EDIT_NAME_DETAILS: 'edit_name_details',
  DELETE_STEP: 'delete_step',
};

export const getStepConfigSecondaryActionMenu = (t = translateFunction) => {
  const optionList = [
    {
      label: 'Edit Step Name & Description',
      icon: <EditIcon />,
      value: STEP_ACTION_VALUE.EDIT_NAME_DETAILS,
      isChecked: false,
    },
    {
      label: t('flows.step_footer_button.delete_step'),
      icon: <Trash />,
      value: STEP_ACTION_VALUE.DELETE_STEP,
      isChecked: false,
    },
  ];
  return optionList;
};

export const getNewActionData = (actionsLength) => {
  return {
    action_name: actionsLength === 0
      ? FLOW_ACTION_TYPES.FORWARD.action
      : `Action${actionsLength}`,
    has_next_step: true,
    next_step_uuid: [],
    action_order: actionsLength + 1,
    action_next_step_name: '',
    err_action_next_step_name: '',
    action_next_output_value: '',
    is_hide_show_action: false,
    condition_rule: '',

    is_rule_action: false,
    next_step_rule: '',
    [ACTION_CONSTANTS.KEYS.NEXT_STEP_RULE_EXPRESSION]: {
      if: [
        { ...ACTION_CONSTANTS.INITIAL_STATE.NEXT_STEP_RULE_EXPRESSION() },
      ],
      else_next_step_name: '',
      else_next_output_value: '',
    },
    isActionConfigPopupVisible: true,
    isActionSaved: false,
    error_list: {},
  };
};

export const getOptionListForStaticValue = (fieldDetails, fieldTypeKey = 'field_type', choiceValuesKey = 'choice_values', additionalConfig = {}) => {
  const fieldType = get(fieldDetails, [fieldTypeKey], null);
  if (fieldType === FIELD_TYPES.YES_NO) {
    if (additionalConfig?.isIntegrationStep) {
      return BOOLEAN_FIELD_OPTIONS;
    }
    return YES_NO_FIELD_OPTIONS;
  }
  if (fieldType === FIELD_TYPES.CUSTOM_LOOKUP_DROPDOWN) {
    const optionList = [];
    (fieldDetails?.[choiceValuesKey] || []).forEach((value) => {
      optionList.push({
        label: value,
        value,
      });
    });
    return optionList;
  }
  if (fieldDetails?.[choiceValuesKey]) {
    return fieldDetails[choiceValuesKey] || [];
  }
  return [];
};
