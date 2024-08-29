import { FLOW_ACTION_VALUE_TYPE } from '../../../components/automated_systems/AutomatedSystems.constants';
import { constructIndexingFields, getShortCode } from '../../../utils/UtilityFunctions';
import { displayErrorToast } from '../../../utils/flowErrorUtils';
import { cloneDeep, isPlainObject, has, isArray, isBoolean, isEmpty, uniq, translateFunction } from '../../../utils/jsUtility';
import { COMMA, EMPTY_STRING, VALIDATION_ERROR_TYPES } from '../../../utils/strings/CommonStrings';
import { constructPolicyForConditionBasedData, constructPolicyForResponse } from '../../edit_flow/security/policy_builder/PolicyBuilder.utils';
import { formatParentTrigger } from '../../flows/flow_create_or_edit/FlowCreateEdit.utils';
import { getSectionAndFieldsFromResponse } from '../../form/sections/form_layout/FormLayout.utils';
import { EDIT_DATALIST_HEADER_TYPE } from './DatalistsCreateEdit.constant';

export const getErrorMessage = (errorList = {}, path = []) => {
  if (isEmpty(path)) return null;
  const consolidatedPath = Array.isArray(path) ? path : [path];
  const key = consolidatedPath.join(COMMA);
  return errorList?.[key];
};

const isEmptyMembers = (members) => isEmpty(members?.users) && isEmpty(members?.teams);
export const constructSaveDataListPostData = (data, dataListUUID, isInitial = false, initialData = {}, tab = null, currentTab = null, isSaveAndClose = false) => {
  const basicData = data?.basicDetails || {};
  const securityData = data?.security || {};
  const addOnData = data?.addOn || {};

  const getFieldUUIDS = (fieldValuePairs) => {
    if (isArray(fieldValuePairs)) return fieldValuePairs.map((field) => field?.value || '');
    else return fieldValuePairs?.value || '';
  };

  const getUserAndTeamIDs = (members) => {
    const modifiedMembers = {};
    if (!isEmpty(members?.users)) modifiedMembers.users = members.users.map((user) => user?._id);
    if (!isEmpty(members?.teams)) modifiedMembers.teams = members.teams.map((team) => team?._id);
    return modifiedMembers;
  };

  let postData = {
    // mandatory data
    data_list_uuid: dataListUUID,
    data_list_name: basicData?.dataListName?.trim(),
    ...(basicData?.dataListDescription?.trim()) && { data_list_description: basicData.dataListDescription.trim() },
    ...(tab === EDIT_DATALIST_HEADER_TYPE.DATA) ? { add_form: true } : {},
    ...(tab === EDIT_DATALIST_HEADER_TYPE.SECURITY) ? { send_policy_fields: true } : {},
    ...(isSaveAndClose) ? { is_save_close: true } : {},
  };

  switch (currentTab) {
    case EDIT_DATALIST_HEADER_TYPE.SECURITY:
      postData = {
        ...postData,
        // security data
        security: {
          ...(!isEmptyMembers(securityData?.addSecurity)) ? { add_security: getUserAndTeamIDs(securityData?.addSecurity) } : {},
          ...(!isEmptyMembers(securityData?.dataListAdmins)) ? { admins: getUserAndTeamIDs(securityData?.dataListAdmins) } : {},
          ...(!isEmptyMembers(securityData?.dataListOwners)) ? { owners: getUserAndTeamIDs(securityData?.dataListOwners) } : {},
          ...(!isEmptyMembers(securityData?.viewers)) ? { viewers: getUserAndTeamIDs(securityData?.viewers) } : {},
          ...(!isEmptyMembers(securityData?.entityViewers)) ? { entity_viewers: getUserAndTeamIDs(securityData?.entityViewers) } : {},
          edit_security: {
            same_as_add: isBoolean(securityData?.editSecurity?.sameAsAdd) ? securityData?.editSecurity?.sameAsAdd : true,
            ...(!isBoolean(securityData?.editSecurity?.sameAsAdd) || (securityData?.editSecurity?.sameAsAdd)) ? { is_all_entries: securityData?.editSecurity?.isAllEntries || false } : {},
            ...(!isEmptyMembers(securityData?.editSecurity?.members) && securityData?.editSecurity?.specifiedMembers) ? { members: getUserAndTeamIDs(securityData?.editSecurity?.members) } : {},
          },
          delete_security: {
            same_as_add: isBoolean(securityData?.deleteSecurity?.sameAsAdd) ? securityData?.deleteSecurity?.sameAsAdd : true,
            ...((!isBoolean(securityData?.deleteSecurity?.sameAsAdd)) || (securityData?.deleteSecurity?.sameAsAdd)) ? { is_all_entries: securityData?.deleteSecurity?.isAllEntries || false } : {},
            ...(!isEmptyMembers(securityData?.deleteSecurity?.members) && securityData?.deleteSecurity?.specifiedMembers) ? { members: getUserAndTeamIDs(securityData?.deleteSecurity?.members) } : {},
          },
          is_row_security_policy: isBoolean(securityData?.isRowSecurityPolicy) ? securityData?.isRowSecurityPolicy : false,
          ...(securityData?.isRowSecurityPolicy && !isEmpty(securityData?.security_policies)) ? { security_policies: constructPolicyForConditionBasedData(securityData?.security_policies) } : {},
          is_participants_level_security: isBoolean(securityData?.isParticipantsLevelSecurity) ? securityData?.isParticipantsLevelSecurity : true,
        },
      };
    break;
    case EDIT_DATALIST_HEADER_TYPE.ADD_ON:
      postData = {
        ...postData,
        // addOn data
        data_list_short_code: addOnData?.dataListShortCode,
        technical_reference_name: addOnData?.technicalReferenceName,
        is_system_identifier: isBoolean(addOnData?.isSystemIdentifier) ? addOnData?.isSystemIdentifier : true,
        ...(!addOnData?.isSystemIdentifier && !isEmpty(addOnData?.customIdentifier?.value)) ? { custom_identifier: getFieldUUIDS(addOnData?.customIdentifier) } : {},
        ...(addOnData?.uniqueField?.value) ? { unique_field: getFieldUUIDS(addOnData?.uniqueField), is_ignore_null: addOnData?.isIgnoreNull || false } : { unique_field: null, is_ignore_null: false },
        ...(!isEmpty(addOnData?.category?.value)) ? { category_id: addOnData?.category?.value } : {},
        // ...(!isEmpty(addOnData?.taskIdentifier)) ? { task_identifier: getFieldUUIDS(addOnData?.taskIdentifier) } : {},
      };
    break;
    case EDIT_DATALIST_HEADER_TYPE.RELATED_ACTIONS:
      postData = {
        ...postData,
        has_related_flows: data?.hasRelatedFlows || false,
        has_system_events: data?.hasSystemEvents || false,
        ...(!isEmpty(data?.trigger_details)) ? { trigger_details: formatParentTrigger(data.trigger_details) } : {},
      };
    break;
    default:
      postData = {
        ...postData,
        ...(basicData?.dataListDescription?.trim()) && { data_list_description: basicData.dataListDescription.trim() },
      };
    break;
  }

  console.log('tabx', currentTab, postData);

  const initialSaveData = {
    add_form: true,
    data_list_name: initialData?.basicDetails?.dataListName,
    ...(initialData?.basicDetails?.dataListDescription) ? { data_list_description: initialData?.basicDetails?.dataListDescription } : {},
    data_list_short_code: initialData?.addOn?.dataListShortCode || getShortCode(initialData?.basicDetails?.dataListName),
    data_list_uuid: dataListUUID,
    technical_reference_name: initialData?.addOn?.technicalReferenceName,
    ...(!initialData?.hasRelatedFlows ? { has_related_flows: false } : null),
    ...(!initialData?.hasSystemEvents ? { has_system_events: false } : null),
  };
  return isInitial ? initialSaveData : postData;
};

export const constructSecurityDataForValidation = (securityData) => {
  const validationData = {
    ...securityData,
    addSecurity: { ...(isEmptyMembers(securityData?.addSecurity)) ? {} : securityData?.addSecurity },
    dataListAdmins: { ...(isEmptyMembers(securityData?.dataListAdmins)) ? {} : securityData?.dataListAdmins },
    dataListOwners: { ...(isEmptyMembers(securityData?.dataListOwners)) ? {} : securityData?.dataListOwners },
    editSecurity: {
      ...securityData?.editSecurity,
      members: { ...(isEmptyMembers(securityData?.editSecurity?.members)) ? {} : securityData?.editSecurity?.members },
    },
    deleteSecurity: {
      ...securityData?.deleteSecurity,
      members: { ...(isEmptyMembers(securityData?.deleteSecurity?.members)) ? {} : securityData?.deleteSecurity?.members },
    },
    viewers: !isEmptyMembers(securityData?.viewers) ? securityData?.viewers : {},
  };
  return validationData;
};

const getResponseStaticValue = (value) => {
  let updateValue = value;
  if (isPlainObject(value)) {
    if (!isEmpty(value.entry_ids)) {
      updateValue = cloneDeep(value.entry_ids);
    } else if (!isEmpty(value.users) || !isEmpty(value.teams)) {
      updateValue = {};
      if (!isEmpty(value.users)) updateValue.users = value.users.map((u) => u._id);
      if (!isEmpty(value.teams)) updateValue.teams = value.teams.map((u) => u._id);
    }
  }

  return updateValue;
};

export const getResponseTriggerDetails = (triggerDetails) => {
  const triggers = triggerDetails.map((t) => {
    const trigger = { ...t };

    if (!isEmpty(trigger.trigger_mapping)) {
      trigger.trigger_mapping = trigger.trigger_mapping.map((tm) => {
        const _tm = { ...tm };
        if (tm.value_type === FLOW_ACTION_VALUE_TYPE.STATIC) {
          _tm.value = getResponseStaticValue(tm.value);
        }

        if (tm.field_mapping) {
          _tm.field_mapping = tm.field_mapping.map((tfm) => {
            const _tfm = { ...tfm };
            if (_tfm.value_type === FLOW_ACTION_VALUE_TYPE.STATIC) {
              _tfm.value = getResponseStaticValue(_tfm.value);
            }
            return _tfm;
          });
        }
        return _tm;
      });
    }

    return trigger;
  });

  return triggers;
};

export const constructGetDataForDataList = (data) => {
  console.log('datax', data);
  const { sections, fields } = getSectionAndFieldsFromResponse(data?.form_metadata?.sections || []);
  const constructedData = {
    ...data,
    basicDetails: {
      dataListName: data?.dataListName,
      dataListDescription: data?.dataListDescription,
    },
    security: {
      ...data?.security,
      ...(data?.security?.security_policies) ? { security_policies: constructPolicyForResponse(data?.security?.security_policies, constructIndexingFields(data?.policy_fields)) } : {},
      editSecurity: {
        ...data?.security?.editSecurity,
        sameAsAdd: isBoolean(data?.security?.editSecurity?.sameAsAdd) ? data?.security?.editSecurity?.sameAsAdd : true,
        specifiedMembers: !isEmptyMembers(data?.security?.editSecurity?.members),
      },
      deleteSecurity: {
        ...data?.security?.deleteSecurity,
        sameAsAdd: isBoolean(data?.security?.deleteSecurity?.sameAsAdd) ? data?.security?.deleteSecurity?.sameAsAdd : true,
        specifiedMembers: !isEmptyMembers(data?.security?.deleteSecurity?.members),
      },
      isParticipantsLevelSecurity: isBoolean(data?.security?.isParticipantsLevelSecurity) ? data?.security?.isParticipantsLevelSecurity : true,
      isRowSecurityPolicy: isBoolean(data?.security?.isRowSecurityPolicy) ? data?.security?.isRowSecurityPolicy : false,
      dataListAdmins: data?.security?.admins,
      dataListOwners: data?.security?.owners,
    },
    addOn: {
      dataListShortCode: data?.dataListShortCode,
      technicalReferenceName: data?.technicalReferenceName,
      // taskIdentifier: data?.taskIdentifier,
      ...(data?.customIdentifier?.fieldUUID) ? { customIdentifier: { label: data?.customIdentifier?.fieldName, value: data?.customIdentifier?.fieldUUID } } : {},
      ...(data?.uniqueField) ? { uniqueField: { label: data?.uniqueField?.fieldName, value: data?.uniqueField?.fieldUUID || data?.uniqueField }, isIgnoreNull: data?.isIgnoreNull } : {},
      isSystemIdentifier: data?.isSystemIdentifier,
      ...(data?.categoryId) ? { category: { label: data?.categoryName, value: data?.categoryId } } : {},
    },
    ...(data?.form_metadata) ? {
      formData: {
        sections: sections,
        fields: fields,
        showSectionName: data?.form_metadata?.show_section_name,
        formUUID: data?.form_metadata?.form_uuid,
      },
    } : {},
    trigger_details: getResponseTriggerDetails(data?.trigger_details ? data.trigger_details : []),
  };
  return constructedData;
};

export const getErrorTabs = (validationMessage = {}) => {
  const tabsWithErrors = Object.keys(validationMessage).filter((tab) => !isEmpty(validationMessage?.[tab]));
  const errorTabs = tabsWithErrors.map((type) => {
    switch (type) {
      case 'form': return EDIT_DATALIST_HEADER_TYPE.DATA;
      case 'security': return EDIT_DATALIST_HEADER_TYPE.SECURITY;
      case 'dashboard': {
        const dashboardErrorTabList = validationMessage[type]?.map((error) => {
          if (error.field.includes('report')) {
            return 'report';
          } else {
            return 'dashboard';
          }
        });
        if (dashboardErrorTabList.includes('report')) {
          return EDIT_DATALIST_HEADER_TYPE.ALL_DATA_REPORT;
        }
        return EDIT_DATALIST_HEADER_TYPE.DATA_DASHBOARD;
      }
      case 'relatedActions': return EDIT_DATALIST_HEADER_TYPE.RELATED_ACTIONS;
      case 'addOnConfig': return EDIT_DATALIST_HEADER_TYPE.ADD_ON;
      case 'dataListDeatils': return 8;
      default: return 1;
    }
  });
  return errorTabs;
};

export const getServerValidationErrorTabs = (validationMessage, sections = [], t = translateFunction) => {
  let isError = false;
  const error_list = {
    securityError: {},
    addOnError: {},
  };
  const triggerDetailsServerError = {};
  const formErrors = {};
  const dataReportErrors = {};
  const individualEntryErrors = {
    formErrors: [],
  };
  Object.keys(validationMessage).forEach((tab) => {
    if (!isEmpty(validationMessage?.[tab])) {
      validationMessage?.[tab].forEach((errorObj) => {
        if (errorObj.field.includes('trigger_details')) {
          const errorKeys = errorObj.field.split('.');
          if (errorObj.indexes?.includes('invalid trigger mapping')) {
            isError = true;
            triggerDetailsServerError[errorKeys[1]] =
            'One/more mapped fields have been deleted';
          }
          if (errorObj.indexes?.includes('invalid child')) {
            isError = true;
            triggerDetailsServerError[errorKeys[1]] =
            'Child flow has been deleted';
          }
          if (errorObj.indexes?.includes('trigger_details')) {
            isError = true;
            triggerDetailsServerError[errorKeys[1]] =
            t('error_popover_status.error_in_shortcut_name');
          }
        }
        if (errorObj.field.includes('report.table_columns')) {
          if ([VALIDATION_ERROR_TYPES.ONLY].includes(errorObj.type)) {
            isError = true;
            dataReportErrors[errorObj.field?.split('.')?.[3]] = 'Field Deleted';
          }
        }
        if (errorObj.indexes?.includes('entity_viewers')) {
          isError = true;
          error_list.securityError.entityViewers = t('error_popover_status.invalid_teams_or_users');
        }
        if (errorObj.indexes?.includes('add_security')) {
          isError = true;
          error_list.securityError.addSecurity =
          t('error_popover_status.invalid_teams_or_users');
          if (errorObj.type === VALIDATION_ERROR_TYPES.REQUIRED && errorObj?.field.includes('add_security')) {
            error_list.securityError.addSecurity = t('validation_constants.utility_constant.one_user_team_required');
          }
        }
        if (errorObj.indexes?.includes('viewers')) {
          isError = true;
          error_list.securityError.viewers =
          t('error_popover_status.invalid_teams_or_users');
        }
        if (errorObj.field?.includes('owners') && errorObj?.type === VALIDATION_ERROR_TYPES.OBJECT_MISSING) {
          isError = true;
          error_list.securityError.dataListOwners = t('validation_constants.utility_constant.one_user_team_required');
        }
        if ((errorObj?.field || EMPTY_STRING).includes('custom_identifier')) {
          if (errorObj?.type === VALIDATION_ERROR_TYPES.ONLY || errorObj?.type === VALIDATION_ERROR_TYPES.UNKNOWN) {
              isError = true;
              error_list.addOnError.customIdentifier = t('flow_config_strings.errors.custom_identifier_deleted');
          }
          if (errorObj?.type === VALIDATION_ERROR_TYPES.REQUIRED) {
            isError = true;
            error_list.addOnError.customIdentifier = t('flow_config_strings.errors.custom_iedntifier_required');
          }
        }
        if ((errorObj?.field || EMPTY_STRING).includes('unique_field')) {
          if (errorObj?.type === VALIDATION_ERROR_TYPES.ONLY || errorObj?.type === VALIDATION_ERROR_TYPES.UNKNOWN) {
              isError = true;
              error_list.addOnError.uniqueField = t('flow_config_strings.errors.unique_field_deleted');
          }
        }
        if ((errorObj?.field || EMPTY_STRING).includes('technical_reference_name')) {
          if (errorObj?.type === VALIDATION_ERROR_TYPES.REQUIRED) {
              isError = true;
              error_list.addOnError.technicalReferenceName = t('flow_config_strings.errors.tech_name_required');
          }
        }
        if (
          (errorObj?.field || EMPTY_STRING).includes('form_metadata') &&
          !(errorObj?.field || EMPTY_STRING).includes('dashboard_metadata')
        ) {
          const key = errorObj?.field?.split('.');
          if (!isEmpty(key)) {
            if (has(key, 2) && has(key, 4)) {
              if (sections?.[key[2]]?.contents?.[key[4]]) {
                const errorField = sections?.[key[2]]?.contents?.[key[4]];
                formErrors[errorField.field_uuid] = errorObj.indexes;
              }
            } else if (has(key, 2)) {
              if (sections?.[key[2]]) {
                const errorField = sections?.[key[2]];
                if (errorObj.type === 'array.hasUnknown') {
                  formErrors[errorField.section_uuid] =
                  t('flow_config_strings.errors.section_atleast_one_field');
                } else {
                  formErrors[errorField.section_uuid] = errorObj.indexes;
                }
              }
            }
          }
        }
        if ((errorObj?.field || EMPTY_STRING).includes('form_metadata') && (errorObj?.field || EMPTY_STRING).includes('dashboard_metadata.pages')) {
          individualEntryErrors.formErrors.push(errorObj);
        }
      });
    }
  });
  if (!isEmpty(formErrors)) {
    displayErrorToast({
      title: t('validation_constants.server_error_constant.error_in_form_field_configuration'),
      subtitle: t('error_popover_status.correct_the_validation_and_proceed'),
    });
  } else if (isError) {
    displayErrorToast({
      title: t('flow_config_strings.errors.failed_to_save_datalist'),
      subtitle: t('flow_config_strings.errors.failed_to_save_datalist_subtitle'),
    });
  }
  console.log('pubErr', isError, error_list, triggerDetailsServerError, dataReportErrors, validationMessage);
  return {
    localErrorTabs: getErrorTabs(validationMessage),
    serverErrorList: error_list,
    localFormErrors: formErrors,
    localDataReportErrors: dataReportErrors,
    localIndividualEntryErrors: individualEntryErrors,
  };
};

export const filterCurrentUser = (data, currentUser) => {
  const constructedUsers = data?.users?.map((user) => ((user?.id || user?._id) === currentUser) ? { ...user, noDelete: true } : user);
  return {
      ...data,
      users: constructedUsers,
  };
};

export const formatPublishError = (errors, options = {}) => {
  const { t } = options;
  const localErrorTabs = [];
  const serverErrorList = { addOnError: {}, securityError: {} };

  errors?.forEach?.((e) => {
    if (e?.type === 'duplicate') {
      serverErrorList.addOnError.uniqueField = t('data_lists.datalist_create_edit.errors.unique_field_duplicate');
      localErrorTabs.push(EDIT_DATALIST_HEADER_TYPE.ADD_ON);
    }
  });

  if (!isEmpty(localErrorTabs)) {
    displayErrorToast({
      title: t('flow_config_strings.errors.failed_to_save_datalist'),
      subtitle: t('flow_config_strings.errors.failed_to_save_datalist_subtitle'),
    });
  }

  return { localErrorTabs: uniq(localErrorTabs), serverErrorList };
};
