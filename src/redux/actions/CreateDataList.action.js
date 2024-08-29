/* eslint-disable import/no-cycle */
import { dataListIntStateChangeAction } from 'redux/reducer/DataListReducer';
import { getVisibilityExternalFieldsData } from 'redux/reducer';
import { COMMA, SOMEONE_IS_EDITING, EMPTY_STRING, SPACE, VALIDATION_ERROR_TYPES } from 'utils/strings/CommonStrings';
import { QUERY_BUILDER_INITIAL_STATE } from 'components/query_builder/QueryBuilder.strings';
import { DASHBOARD_ADMIN_VALIDATION_MESSAGE } from 'components/form_builder/section/form_fields/FormField.strings';
import { getTypeFromOperator, getTypeFromTableOperator } from 'components/form_builder/field_config/basic_config/DefaultValueRule.selectors';
import { getFormattedDateFromUTC } from 'utils/dateUtils';
import { getCurrentUserId } from 'utils/userUtils';
import { EXPRESSION_TYPE } from 'utils/constants/rule/rule.constant';
import { saveForm, saveTable } from 'axios/apiService/form.apiService';
import { apiGetFlowDetailsByUUID, getAllFlows } from 'axios/apiService/flowList.apiService';
import { constructTriggerMappingFieldMetadata, getDeletedFieldsErrorList, getGroupedFieldListForMapping } from 'containers/edit_flow/step_configuration/StepConfiguration.utils';
import { FLOW_TRIGGER_CONSTANTS } from 'components/flow_trigger_configuration/TriggerConfiguration.constants';
import {
  FLOW_STRINGS,
  // FIELD_TYPE_CATEGORY,
} from 'containers/edit_flow/EditFlow.strings';
import { translate } from 'language/config';
import { getActiveUsers } from 'containers/edit_flow/EditFlow.utils';
import {
  constructIndexingFields,
  generateApiErrorsAndHandleCatchBlock,
  getFieldLabelWithRefName,
  hasOwn,
  routeNavigate,
  setPointerEvent,
  showToastPopover,
  updateEditConfirmPopOverStatus,
  updatePostLoader,
} from '../../utils/UtilityFunctions';
import jsUtils, {
  cloneDeep,
  get,
  isEmpty,
  isNull,
  isUndefined,
  set,
  has,
  some,
  translateFunction,
} from '../../utils/jsUtility';
import { store } from '../../Store';
import {
  generateGetServerErrorMessage,
  generatePostServerErrorMessage,
} from '../../server_validations/ServerValidation';
import {
  saveDataList,
  publishDataList,
  deleteDataList,
  discardDataList,
  apiSaveRule,
  getDataListFormDetailsByIdApi,
  getDataListDetailsById,
} from '../../axios/apiService/dataList.apiService';
import {
  apiGetAllFieldsList,
  apiGetRuleDetailsById,
  apiGetRuleOperatorsByFieldType,
  getTriggerDetails,
} from '../../axios/apiService/flow.apiService';
import { saveField, validateFormApi } from '../../axios/apiService/createTask.apiService';
import { FORM_POPOVER_STATUS, FLOW_MIN_MAX_CONSTRAINT, ROUTE_METHOD } from '../../utils/Constants';
import { GET_ALL_FIELDS_LIST_BY_FILTER_TYPES } from '../../containers/flow/Flow.strings';
import {
  dataListValuesStateChangeAction,
  dataListStateChangeAction,
  dataListInitialLoading,
  saveDataListFailedAction,
  saveDataListStartedAction,
  dataListClearAction,
  getAllFieldsDataListStartedAction,
  getAllFieldsDataListSuccessAction,
  getAllFieldsDataListFailedAction,
  ruleFieldTypeChangeDataListStarted,
  ruleFieldTypeChangeDataListFailed,
  ruleFieldTypeChangeDataListSucess,
  ruleFieldTypeChangeDataListIntSucess,
  dataListFormLoading,
  saveRuleAction,
  createDatalistChange,
  isEditDatalistAction,
} from '../reducer/CreateDataListReducer';
import { ADMIN_HOME } from '../../urls/RouteConstants';
import {
  getEditDataListBasicDetails,
  getEditDataListMetricDetails,
  getEditDataListSecurityDetails,
} from '../selectors/CreateDataList.selectors';
import {
  getDataFromRuleFields,
  getSelectedOperatorInfo,
} from '../../utils/rule_engine/RuleEngine.utils';
import { getAllDataListApi } from './DataListAction';
import { ERROR_MESSAGES } from '../../components/form_builder/FormBuilder.strings';
import { getFormDetailsAPIDataDataList, getSaveFieldDetailsAPIDataDataList, getSaveTableDetailsAPIDataDataList } from '../../containers/flow/create_data_list/CreateDataList.validation.schema';
import { getTableColConditionList, saveFormApiResponseProcess } from '../../utils/formUtils';
import { FIELD_KEYS, FIELD_LIST_TYPE, PROPERTY_PICKER_KEYS } from '../../utils/constants/form.constant';
import { ALL_FLOW_TAB_INDEX } from '../../containers/landing_page/LandingPage.strings';
import { externalFieldDataChange, setOperators, updateTableColConditionList } from './Visibility.Action';
import { externalFieldsDataChange } from './DefaultValueRule.Action';
import { handleSyntaxError } from './FormulaBuilder.Actions';
import { constructTreeStructure, getSectionAndFieldsFromResponse } from '../../containers/form/sections/form_layout/FormLayout.utils';
import { constructPolicyForResponse } from '../../containers/edit_flow/security/policy_builder/PolicyBuilder.utils';
import { ERROR_TYPE_PATTERN_BASE_ERROR } from '../../utils/ServerValidationUtils';

export const updateSomeoneIsEditingPopover = (errorMessage, customDataListID = null, customDataListUUID = null) => {
  const { data_list_uuid, data_list_id } = store.getState().CreateDataListReducer;
  const { time, isMoreThanHoursLimit } = getFormattedDateFromUTC(errorMessage.edited_on, SOMEONE_IS_EDITING);
  const isCurrentUser = getCurrentUserId() === errorMessage.user_id;
  let editSubtitle = null;
  if (isCurrentUser) {
    editSubtitle = translate('error_popover_status.edit_in_another_screen');
  } else {
    editSubtitle = `${errorMessage.full_name} (${errorMessage.email}) ${translate('error_popover_status.is_editing')}`;
  }
  updateEditConfirmPopOverStatus({
    title: translate('error_popover_status.error_in_datalist'),
    subTitle: editSubtitle,
    secondSubTitle: isCurrentUser ? EMPTY_STRING : `${translate('error_popover_status.last_edited')} ${time}`,
    status: FORM_POPOVER_STATUS.SERVER_ERROR,
    isVisible: false,
    isEditConfirmVisible: true,
    type: 'Data List',
    enableDirectEditing: isCurrentUser && isMoreThanHoursLimit,
    params: {
      data_list_id: customDataListID || data_list_id,
      data_list_uuid: customDataListUUID || data_list_uuid,
    },
  });
};

export const saveDataListApiThunk =
  (postData, history = null, isClose = false, onPublishDataList = false, changeSettingsPage = false, nextPage = null, returnResponse = false,
    extraProps = {}) =>
  (dispatch) =>
    new Promise((resolve) => {
      dispatch(saveDataListStartedAction());
      postData.is_save_close && dispatch(isEditDatalistAction(false));
      setPointerEvent(true);
      updatePostLoader(true);
      saveDataList(postData)
        .then((res) => {
          const state = store.getState().CreateDataListReducer;
          const { security } = cloneDeep(state);
          set(security, 'owners', getActiveUsers(res.admins));
          set(security, 'reassignedOwners', getActiveUsers(res.owners));
          if (!isEmpty(res.entry_adders)) {
            const entryAdders = {};
            const activeEntryAdders = getActiveUsers(res.entry_adders);
            if (!isEmpty(activeEntryAdders?.users)) entryAdders.users = activeEntryAdders.users;
            if (!isEmpty(activeEntryAdders?.teams)) entryAdders.teams = activeEntryAdders.teams;
            set(security, 'entry_adders', entryAdders);
          } else {
            set(security, 'entry_adders', {});
          }

          if (!isEmpty(res?.entity_viewers)) {
            const entityViewers = {};
            const activeEntityViewers = getActiveUsers(res.entity_viewers);

            if (!isEmpty(activeEntityViewers?.users)) entityViewers.users = activeEntityViewers.users;
            if (!isEmpty(activeEntityViewers?.teams)) entityViewers.teams = activeEntityViewers.teams;

            set(security, 'entityViewers', cloneDeep(entityViewers));
            set(security, 'entityViewersMetaData', cloneDeep(entityViewers));
          } else {
            set(security, 'entityViewers', {});
            set(security, 'entityViewersMetaData', {});
          }

          if (!isEmpty(res.viewers)) {
            const viewers = {};
            const activeViewers = getActiveUsers(res.viewers);
            if (!isEmpty(activeViewers.users)) viewers.users = activeViewers.users;
            if (!isEmpty(activeViewers.teams)) viewers.teams = activeViewers.teams;
            set(security, 'viewers', viewers);
          } else {
            set(security, 'viewers', {});
          }

          const datalistState = cloneDeep(store.getState().CreateDataListReducer);
          const { currentSettingsPage } = datalistState;
          if (!jsUtils.isEmpty(res)) {
            let isError = false;
            const error_list = {};
            const triggerDetailsServerError = {};
            const defaultReportFieldErrorList = {};
            if (currentSettingsPage === 0) {
              if (!isEmpty(res.validation_message)) {
                res.validation_message.forEach((errorObj) => {
                    const errorKeys = errorObj.field.split('.');
                    if (errorObj.indexes?.includes('entity_viewers')) {
                      error_list.entityViewers = translate('error_popover_status.invalid_teams_or_users');
                    } else if ((errorObj.indexes?.includes('entry_adders')) || (errorObj.indexes?.includes('viewers'))) {
                      error_list[errorKeys[0]] =
                      translate('error_popover_status.invalid_teams_or_users');
                    }
                });
              }
              if (!isEmpty(error_list)) {
                dispatch(createDatalistChange({
                  error_list: { ...(state.error_list || {}), ...error_list } }));
                  setPointerEvent(false);
                  updatePostLoader(false);
                  return resolve(true);
              }
            }
            if (currentSettingsPage === 1) {
              if (!isEmpty(res.validation_message)) {
                res.validation_message.forEach((errorObj) => {
                  console.log('triggerDetailsServerError1', errorObj);
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
                      translate('error_popover_status.error_in_shortcut_name');
                    }
                  }
                  if (errorObj.field.includes('default_report_fields')) {
                    if ([VALIDATION_ERROR_TYPES.ONLY].includes(errorObj.type)) {
                      isError = true;
                      defaultReportFieldErrorList[errorObj.field?.split('.')?.[1]] = translate('error_popover_status.fields_deleted');
                    }
                  }
                });
                console.log('triggerDetailsServerError2', triggerDetailsServerError);
              }
            }
            if (currentSettingsPage === 2) {
              const errorList = {};
              isError = true;
              if (!isEmpty(res.validation_message)) {
                res.validation_message.forEach((eachErrorObject) => {
                    if ((eachErrorObject?.field || EMPTY_STRING).includes('custom_identifier')) {
                        if (eachErrorObject?.type === VALIDATION_ERROR_TYPES.ONLY || eachErrorObject?.type === VALIDATION_ERROR_TYPES.UNKNOWN) {
                            errorList.custom_identifier = 'Custom identifier field has been deleted';
                        }
                    }

                    if ((eachErrorObject?.field || EMPTY_STRING).includes('task_identifier' || eachErrorObject?.type === VALIDATION_ERROR_TYPES.EXCLUDES)) {
                        const errorKey = eachErrorObject.field.split('.');
                        if (eachErrorObject?.type === VALIDATION_ERROR_TYPES.ONLY) {
                          set(errorList, ['task_identifier', errorKey[1]], 'Field has been deleted');
                       }
                  }
                });
                if (!isEmpty(errorList)) {
                  dispatch(createDatalistChange({
                    error_list: { ...(state.error_list || {}), ...errorList } }));
                    setPointerEvent(false);
                    updatePostLoader(false);
                    return resolve(true);
                }
            }
          }
          if (onPublishDataList) onPublishDataList();
          else {
            setPointerEvent(false);
            updatePostLoader(false);
          }
            const dataListState = [
              {
                id: 'data_list_uuid',
                value: res.data_list_uuid,
              },
              {
                id: 'data_list_id',
                value: res._id,
              },
              {
                id: 'isDataListModalDisabled',
                value: true,
              },
              {
                id: 'update_in_progress',
                value: res.update_in_progress || false,
              },
              {
                id: 'trigger_details',
                value: res.trigger_details || [],
              },
              {
                id: 'is_trigger_set',
                value: get(res, 'is_trigger_set', false),
              },
              {
                id: 'isDatalistTriggerShortcutModalOpen',
                value: false,
              },
              {
                id: 'document_url_details',
                value: res.document_url_details || [],
              },
              { ...(!isError && changeSettingsPage) ?
                {
                  id: 'currentSettingsPage',
                  value: nextPage || currentSettingsPage + 1,
                } : null,
              },
              { ...(!isEmpty(triggerDetailsServerError)) ?
                {
                  id: 'triggerDetailsServerError',
                  value: triggerDetailsServerError,
                } : null,
              },
              {
                id: 'security',
                value: cloneDeep(security),
              },
              {
                id: 'is_row_security_policy',
                value: res.is_row_security_policy,
              },
              {
                id: 'policyListMetaData',
                value: constructPolicyForResponse(res?.security_policies, constructIndexingFields(res?.policy_fields)),
              },
              {
                id: 'activeTriggerData',
                value: {},
              },
              {
                id: 'isFormDetailsLoading',
                value: false,
              },
              {
                id: 'isDatalistShortCodeSaved',
                value: res?.version > 1,
              },
              {
                id: 'isTechnicalRefercenNameSaved',
                value: res?.version > 1,
              },
            ];
            if (postData?.send_policy_fields) {
              const policyList = constructPolicyForResponse(res?.security_policies, constructIndexingFields(res?.policy_fields));
              dataListState.push({
                id: 'is_row_security_policy',
                value: res.is_row_security_policy,
              });
              dataListState.push({
                id: 'policyList',
                value: policyList,
              });
              dataListState.push({
                id: 'policyListMetaData',
                value: policyList,
              });
            }

            let sections = [];
            let fields = {};
            const formMetadata = cloneDeep(res?.form_metadata);
            if (extraProps?.isFromPromptCreation) {
              sections = extraProps?.existingSection;
              formMetadata.sections = extraProps?.existingSection;
              formMetadata.show_section_name = (Array.isArray(extraProps?.existingSection) ? extraProps?.existingSection.length : 0) > 1;
            } else {
              const data = getSectionAndFieldsFromResponse(res?.form_metadata?.sections || []);
              sections = data?.sections;
              fields = data?.fields;
            }

            if (postData.add_form) {
              dataListState.push({
                id: 'fields',
                value: fields,
              });
              dataListState.push({
                id: 'form_details',
                value: formMetadata,
              });
              dataListState.push({
                id: 'sections',
                value: sections,
              });
              const securityDetails = getEditDataListSecurityDetails(res);
              if (!jsUtils.isEmpty(securityDetails)) { dataListState.push({ id: 'security', value: securityDetails }); }
            }

            const basicDetails = getEditDataListBasicDetails(res);
            console.log('action.payload.map', basicDetails, res, postData);
            if (!jsUtils.isEmpty(basicDetails)) dataListState.push(...basicDetails);
            const metricDetails = getEditDataListMetricDetails(res);
            if (!isEmpty(defaultReportFieldErrorList)) {
              const defaultReportFields = [];
              (res?.default_report_fields || []).forEach((field, index) => {
                defaultReportFields.push({
                  label: getFieldLabelWithRefName(field?.field_name, field?.reference_name),
                  reference_name: field?.reference_name,
                  existing_data: { ...field },
                  ...field,
                  isFieldDeleted: defaultReportFieldErrorList?.[index],
                });
              });
              metricDetails.metric_fields = defaultReportFields;
            }
            if (!jsUtils.isEmpty(metricDetails)) { dataListState.push({ id: 'metrics', value: metricDetails }); }
            if (!isEmpty(res?.category_id)) dataListState.push({ id: 'category', value: { category_id: res?.category_id, category_name: res?.category_name } });
            if (!jsUtils.isEmpty(dataListState)) {
              dispatch(
                dataListIntStateChangeAction(
                  jsUtils.pick(res, [
                    'can_edit_datalist',
                    'can_add_datalist_entry',
                    'is_system_defined',
                  ]),
                  'dataListSecurity',
                ),
              );
              dispatch(dataListValuesStateChangeAction(dataListState));
            }
            if (isClose) {
              showToastPopover(
                translate('error_popover_status.saved_successfully'),
                translate('error_popover_status.data_list_saved'),
                FORM_POPOVER_STATUS.SUCCESS,
                true,
              );
              dispatch(dataListClearAction());
              routeNavigate(history, ROUTE_METHOD.PUSH, ADMIN_HOME);
            }
            if (returnResponse) resolve(res);
            else resolve(res._id);
          } else {
            const err = {
              response: {
                status: 500,
              },
            };
            const errors = generatePostServerErrorMessage(err);
            dispatch(saveDataListFailedAction(errors.common_server_error));
            dispatch(isEditDatalistAction(true));
            resolve(false);
          }
          return null;
        })
        .catch((error) => {
          console.log('asdfasdfasdfasfsfasdfasfd', error);
          setPointerEvent(false);
          updatePostLoader(false);
          dispatch(isEditDatalistAction(true));
          const { server_error, flowSettingsModalVisibility } = store.getState().CreateDataListReducer;
          const errorData = {
            error,
            server_error,
          };
          const apiFailureAction = {
            dispatch,
            action: saveDataListFailedAction,
          };
          const errors = generateApiErrorsAndHandleCatchBlock(
            errorData,
            apiFailureAction,
            false,
            true,
          );
          console.log('asdfasfasdfafafasfasdf', errors);
          if (
            error.response &&
            error.response.data &&
            error.response.data.errors[0].type === 'someone_editing'
          ) {
            updateSomeoneIsEditingPopover(error.response.data.errors[0].message);
          } else if (
            error.response &&
            error.response.data &&
            error.response.data.errors[0].field === 'owners.users' && error.response.data.errors[0].type === 'invalid'
          ) {
            showToastPopover(
              `${error.response.data.errors[0].indexes.length === 1 ? translate('error_popover_status.one') : translate('error_popover_status.some')} ${translate('error_popover_status.role_is_not_admin')}`,
              `Change the ${error.response.data.errors[0].indexes.length === 1 ? translate('error_popover_status.owner') : translate('error_popover_status.owners')} ${translate('error_popover_status.role_to_admin_admin_publish')}`,
              FORM_POPOVER_STATUS.SERVER_ERROR,
              true,
            );
          } else if (error.response &&
            error.response.data &&
            error.response.data.errors[0] && error.response.data.errors[0].type === VALIDATION_ERROR_TYPES.LIMIT) {
              showToastPopover(
                'Limit Exceeded',
                EMPTY_STRING,
                FORM_POPOVER_STATUS.SERVER_ERROR,
                true,
              );
            } else if (error.response &&
              error.response.data &&
              error.response.data.errors[0].field.includes('trigger_name')) {
                console.log('checkdlerrorsfornow', error.response);
              showToastPopover(
                translate('error_popover_status.error_in_shortcut_name'),
                translate('error_popover_status.name_already_exist'),
                FORM_POPOVER_STATUS.SERVER_ERROR,
                true,
              );
            } else if (!(error?.response?.data?.errors[0]?.field === 'data_list_name' &&
            error?.response?.data?.errors[0]?.type === ERROR_TYPE_PATTERN_BASE_ERROR)) {
              showToastPopover(
                translate(
                  flowSettingsModalVisibility ?
                  'error_popover_status.unable_to_publish' :
                  'error_popover_status.unable_to_create',
                  ),
                errors?.state_error?.data_list_name,
                FORM_POPOVER_STATUS.SERVER_ERROR,
                true,
              );
            }
            resolve(false);
          });
      });

export const validateFormApiThunk = (params, callBackFn) => (dispatch) =>
  new Promise(() => {
    validateFormApi(params).then((errors) => {
      const sections = cloneDeep(
        store.getState().CreateDataListReducer.sections,
      );
      console.log('check params', params, errors);
      const serverErrors = {};
      if (typeof errors !== 'boolean') {
        errors?.forEach((eachError) => {
          const key = eachError?.field?.split('.');
          if (!isEmpty(key)) {
            if (has(key, 1) && has(key, 3)) {
              if (sections?.[key[1]]?.contents?.[key[3]]) {
                const errorField = sections?.[key[1]]?.contents?.[key[3]];
                serverErrors[errorField.field_uuid] = eachError.indexes;
              }
            }
          }
        });
        if (isEmpty(serverErrors)) callBackFn?.();
        else dispatch(dataListStateChangeAction(serverErrors, 'error_list'));
    } else callBackFn?.();
    }).catch((data) => {
      const error_type = get(data?.errors, [0, 'type'], EMPTY_STRING);
      const errors = {};
      data?.errors?.forEach((eachError) => {
          errors[eachError.field] = eachError.field;
      });
      console.log('validate form err', errors);
      if (error_type === 'someone_editing') {
        updateSomeoneIsEditingPopover(get(data?.errors, [0, 'message'], {}));
      }
      dispatch(dataListStateChangeAction(errors, 'error_list'));
    });
  });

export const getArrOperatorData = (operator_details, fieldType) => {
  const filterData = [];
  switch (fieldType) {
    case 'singleline':
      const singlelineData =
        hasOwn(operator_details, 'singleline') && operator_details.singleline;
      singlelineData &&
        singlelineData.length > 0 &&
        filterData.push(...singlelineData);
      break;
    case 'checkbox':
      const checkboxData =
        hasOwn(operator_details, 'checkbox') && operator_details.checkbox;
      checkboxData &&
        checkboxData.length > 0 &&
        filterData.push(...checkboxData);
      break;
    case 'number':
      const numberData =
        hasOwn(operator_details, 'number') && operator_details.number;
      numberData && numberData.length > 0 && filterData.push(...numberData);
      break;
    case 'yesorno':
      const yesOrNoData =
        hasOwn(operator_details, 'yesorno') && operator_details.yesorno;
      yesOrNoData && yesOrNoData.length > 0 && filterData.push(...yesOrNoData);
      break;
    case 'date':
      const dateData =
        hasOwn(operator_details, 'date') && operator_details.date;
      dateData && dateData.length > 0 && filterData.push(...dateData);
      break;
    case 'paragraph':
      const paragraphData =
        hasOwn(operator_details, 'paragraph') && operator_details.paragraph;
      paragraphData &&
        paragraphData.length > 0 &&
        filterData.push(...paragraphData);
      break;
    case 'dropdown':
      const dropdownData =
        hasOwn(operator_details, 'dropdown') && operator_details.dropdown;
      dropdownData &&
        dropdownData.length > 0 &&
        filterData.push(...dropdownData);
      break;
    case 'radio':
      const radioData =
        hasOwn(operator_details, 'radio') && operator_details.radio;
      radioData && radioData.length > 0 && filterData.push(...radioData);
      break;
    case 'currency':
      const currencyData =
        hasOwn(operator_details, 'currency') && operator_details.currency;
      currencyData &&
        currencyData.length > 0 &&
        filterData.push(...currencyData);
      break;
    case 'fileupload':
      const fileUploadData =
        hasOwn(operator_details, 'fileupload') && operator_details.fileupload;
      fileUploadData &&
        fileUploadData.length > 0 &&
        filterData.push(...fileUploadData);
      break;
    default:
      break;
  }

  filterData.map((operandData) => {
    operandData.value = operandData.operator;
    return operandData;
  });

  return filterData;
};

export const getDefaultRuleByIdApiThunk =
  (ruleId, sectionIndex, fieldListIndex, fieldIndex, fieldType, onlyUpdateFieldMetadata = false) => (dispatch) =>
    new Promise((resolve, reject) => {
      apiGetRuleDetailsById(ruleId)
        .then((res) => {
          const {
            rule_details: {
              rule: { expression, expression_type, decimal_point, concat_with },
            },
            field_metadata,
            default_operator_details,
          } = res;
          let ruleData = {};
          if (expression_type !== EXPRESSION_TYPE.FORMULA_EXPRESSION) {
              const sections = cloneDeep(
                store.getState().CreateDataListReducer.sections,
              );

              const currentFieldType = jsUtils.get(
                sections,
                [sectionIndex, 'field_list', fieldListIndex, 'fields', fieldIndex, FIELD_KEYS.PROPERTY_PICKER_DETAILS, PROPERTY_PICKER_KEYS.REFERENCE_FIELD_TYPE],
                null,
              );
              const consolidatedType = currentFieldType || fieldType;
              const selectedOperatorInfo = getSelectedOperatorInfo(
                default_operator_details,
                expression.operator,
                getTypeFromOperator(expression.operator, consolidatedType) || getTypeFromTableOperator(expression.operator, consolidatedType),
                // currentFieldType || fieldType,
              );

            if (!onlyUpdateFieldMetadata) {
                ruleData = getDataFromRuleFields(expression, expression_type, {
                  decimal_point,
                  concat_with,
                });
                jsUtils.set(
                  sections,
                  [sectionIndex, 'field_list', fieldListIndex, 'fields', fieldIndex, 'draft_default_rule'],
                  {
                    ...ruleData,
                  },
                );
              }
              jsUtils.set(
                sections,
                [sectionIndex, 'field_list', fieldListIndex, 'fields', fieldIndex, 'draft_default_rule', 'operator'],
                expression.operator,
              );
              jsUtils.set(
                sections,
                [sectionIndex, 'field_list', fieldListIndex, 'fields', fieldIndex, 'draft_default_rule', 'operatorInfo'],
                selectedOperatorInfo,
              );
              jsUtils.set(
                sections,
                [sectionIndex, 'field_list', fieldListIndex, 'fields', fieldIndex, FIELD_KEYS.PREVIOUS_DRAFT_DRAFT_RULE],
                jsUtils.get(sections,
                  [sectionIndex, 'field_list', fieldListIndex, 'fields', fieldIndex, 'draft_default_rule']),
              );
              dispatch(
                dataListValuesStateChangeAction([
                  { id: 'sections', value: sections },
                ]),
              );
              dispatch(externalFieldsDataChange({
                field_metadata: (field_metadata || []),
              }));
           }
          resolve(ruleData);
        })
        .catch((err) => {
          reject(err);
          console.log(err);
        });
    });

export const getRuleDetailsByIdInFieldVisibility =
  (ruleId, sectionIndex, fieldListIndex, fieldIndex = null, avoidExpressionUpdate = false) =>
    (dispatch) =>
      new Promise((resolve) => {
        apiGetRuleDetailsById(ruleId)
          .then((res) => {
            const sections = jsUtils.cloneDeep(
              store.getState().CreateDataListReducer.sections,
            );
            const {
              rule_details: { rule },
              field_metadata,
              conditional_operator_details,
            } = res;
            const fieldData =
              fieldIndex !== null
                ? sections[sectionIndex].field_list[fieldListIndex].fields[
                fieldIndex
                ]
                : sections[sectionIndex].field_list[fieldListIndex];

            if (fieldData) {
              if ((fieldIndex !== null) && sections[sectionIndex].field_list[fieldListIndex].field_list_type === FIELD_LIST_TYPE.TABLE) {
                const tableCol = getTableColConditionList(rule.expression, [], field_metadata);
                dispatch(updateTableColConditionList(tableCol));
              }
              if (!avoidExpressionUpdate) {
              fieldData[FIELD_KEYS.RULE_EXPRESSION] = { ...QUERY_BUILDER_INITIAL_STATE, expression: rule.expression };
              fieldData[FIELD_KEYS.PREVIOUS_RULE_EXPRESSION] = cloneDeep(fieldData[FIELD_KEYS.RULE_EXPRESSION]);
              }
              const externalFields = getVisibilityExternalFieldsData(store.getState());
              dispatch(setOperators([], conditional_operator_details));
              dispatch(externalFieldDataChange(externalFields, field_metadata));
            }

            dispatch(
              dataListValuesStateChangeAction([
                {
                  id: 'sections',
                  value: sections,
                },
              ]),
            );
            resolve({});
          })
          .catch((err) => {
            resolve(false);
            console.log(err);
          });
      });

export const getDataListDetailsByIdApiThunk = (params) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(dataListInitialLoading(true));
    dispatch(dataListFormLoading(true));
    getDataListDetailsById(params)
      .then(
        (res) => {
          if (!jsUtils.isEmpty(res)) {
            let dataList = [];
            const basicDetails = getEditDataListBasicDetails(res);
            if (!jsUtils.isEmpty(basicDetails)) dataList = basicDetails;
            const securityDetails = getEditDataListSecurityDetails(res);
            if (!jsUtils.isEmpty(securityDetails)) { dataList.push({ id: 'security', value: securityDetails }); }
            const metricDetails = getEditDataListMetricDetails(res);
            if (!jsUtils.isEmpty(metricDetails)) { dataList.push({ id: 'metrics', value: metricDetails }); }
            dataList.push({ id: 'sections', value: [] });
            if (!isEmpty(res?.category_id)) dataList.push({ id: 'category', value: { category_id: res?.category_id, category_name: res?.category_name } });
            if (!jsUtils.isEmpty(dataList)) {
              dispatch(
                dataListIntStateChangeAction(
                  jsUtils.pick(res, [
                    'can_edit_datalist',
                    'can_add_datalist_entry',
                    'is_system_defined',
                  ]),
                  'dataListSecurity',
                ),
              );
              dispatch(dataListValuesStateChangeAction(dataList));
            }
            resolve(res);
          } else {
            const err = {
              response: {
                status: 500,
              },
            };
            const errors = generatePostServerErrorMessage(err);
            dispatch(saveDataListFailedAction(errors.common_server_error));
            resolve(false);
          }
          dispatch(dataListInitialLoading(false));
        },
        () => {
          dispatch(dataListInitialLoading(false));
          dispatch(dataListFormLoading(false));
          resolve(false);
        },
      )
      .catch((error) => {
        dispatch(dataListInitialLoading(false));
        dispatch(dataListFormLoading(false));
        reject(error);
      });
  });

  export const getDataListFormDetailsByidApiThunk = (params) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(dataListFormLoading(true));
    getDataListFormDetailsByIdApi(params, () => { })
      .then(
        (res) => {
          if (!jsUtils.isEmpty(res)) {
            const formDetails = res;
            const clonedSections = jsUtils.get(formDetails, ['sections'], []);
            if (!jsUtils.isEmpty(clonedSections)) {
              console.log('createDataListAction', formDetails);
              const dataListReduxData = [
                {
                  id: 'form_details',
                  value: formDetails,
                },
                {
                  id: 'temporary_form_details',
                  value: formDetails,
                },
                {
                  id: 'sections',
                  value: formDetails?.sections,
                },
                {
                  id: 'fields',
                  value: formDetails?.fields,
                },
              ];
              dispatch(dataListValuesStateChangeAction(dataListReduxData));
            }
            resolve(formDetails);
          } else {
            resolve(true);
          }
          dispatch(dataListFormLoading(false));
        },
        () => {
          dispatch(dataListFormLoading(false));
          resolve(false);
        },
      )
      .catch((error) => {
        dispatch(dataListFormLoading(false));
        reject(error);
      });
  });

export const saveFieldApiThunkDataList =
  (postData, isConfigPopupOpen = false, saveFormCallback) =>
    (dispatch) =>
      new Promise((resolve) => {
        setPointerEvent(true);
        updatePostLoader(true);
        if (isEmpty(postData.data)) {
          postData.data = getSaveFieldDetailsAPIDataDataList(
            store.getState().CreateDataListReducer,
            postData.sectionIndex,
            postData.fieldListIndex,
            postData.fieldIndex,
          );
        }
        saveField(postData.data)
          .then((response) => {
            setPointerEvent(false);
            updatePostLoader(false);
            const form_details = response;
            let sections = jsUtils.cloneDeep(
              store.getState().CreateDataListReducer.sections,
            );
            sections = saveFormApiResponseProcess(
              sections,
              postData.sectionIndex,
              postData.fieldListIndex,
              postData.fieldIndex,
              response,
              isConfigPopupOpen,
              true, // isSaveField
            );
            const dataListState = [
              {
                id: 'form_details',
                value: form_details,
              },
              {
                id: 'sections',
                value: sections,
              },
              {
                id: 'error_list',
                value: {},
              },
              {
                id: 'server_error',
                value: [],
              },
            ];
            dispatch(dataListValuesStateChangeAction(dataListState));
            if (saveFormCallback) saveFormCallback(sections, form_details);
            return resolve(sections);
          })
          .catch((error) => {
            setPointerEvent(false);
            updatePostLoader(false);
            const errors = jsUtils.get(error, ['response', 'data', 'errors'], []);
            const error_type = jsUtils.get(errors, [0, 'type'], EMPTY_STRING);

            if (error_type === 'someone_editing') {
              updateSomeoneIsEditingPopover(errors[0].message);
            } else if (
              error &&
              error.response &&
              error.response.data &&
              error.response.data.errors.length &&
              error.response.data.errors[0].validation_message &&
              error.response.data.errors[0].validation_message ===
              'cyclicDependency'
            ) {
              showToastPopover(
                translate('error_popover_status.cyclic_dependency'),
                translate('error_popover_status.cannot_set_rule'),
                FORM_POPOVER_STATUS.SERVER_ERROR,
                true,
              );
            } else if (errors.length > 0) {
              dispatch(
                dataListStateChangeAction(
                  error.response.data.errors,
                  'server_error',
                ),
              );
              const errorMessages = jsUtils.compact(errors.map((error) => error.message || null) || []);
              handleSyntaxError(errors, dispatch, true);
              if (!isEmpty(errorMessages) && errorMessages && errorMessages[0]) {
                showToastPopover(
                  'Error',
                  errorMessages[0],
                  FORM_POPOVER_STATUS.SERVER_ERROR,
                  true,
                );
              }
            } else {
              const { server_error } = store.getState().CreateDataListReducer;
              const errorData = {
                error,
                server_error,
              };
              const apiFailureAction = {
                dispatch,
                action: saveDataListFailedAction,
              };
              generateApiErrorsAndHandleCatchBlock(
                errorData,
                apiFailureAction,
                false,
                true,
              );
            }
            return resolve(false);
          });
      });

export const saveTableApiThunkDataList =
(postData, isConfigPopupOpen = false, isClose = false, isFinalSubmission = false, t) =>
  (dispatch) =>
    new Promise((resolve) => {
      setPointerEvent(true);
      updatePostLoader(true);
      if (isEmpty(postData.data)) {
        postData.data = getSaveTableDetailsAPIDataDataList(
          store.getState().CreateDataListReducer,
          postData.sectionIndex,
          postData.fieldListIndex,
          isFinalSubmission,
        );
      }
      saveTable(postData.data)
        .then((response) => {
          setPointerEvent(false);
          updatePostLoader(false);
          if (isClose) {
            dispatch(dataListClearAction());
            return resolve(response);
          }
          const form_details = response;
          let sections = jsUtils.cloneDeep(
            store.getState().CreateDataListReducer.sections,
          );
          sections = saveFormApiResponseProcess(
            sections,
            postData.sectionIndex,
            postData.fieldListIndex,
            postData.fieldIndex,
            response,
            isConfigPopupOpen,
          );
          const dataListState = [
            {
              id: 'form_details',
              value: form_details,
            },
            {
              id: 'sections',
              value: sections,
            },
            {
              id: 'error_list',
              value: {},
            },
            {
              id: 'server_error',
              value: [],
            },
          ];
          dispatch(dataListValuesStateChangeAction(dataListState));
          return resolve(sections);
        })
        .catch((error) => {
          setPointerEvent(false);
          updatePostLoader(false);
          if (
            error.response &&
            error.response.data &&
            error.response.data.errors[0].type === 'someone_editing'
          ) {
            updateSomeoneIsEditingPopover(error.response.data.errors[0].message);
          } else if (
            error.response &&
            error.response.data &&
            error.response.data.errors &&
            (error.response.data.errors || []).length > 0 && error.response.data.errors[0].indexes && error.response.data.errors[0].indexes.includes('section_name')
            ) {
              if ((error.response.data.errors[0].type === 'string.min') || (error.response.data.errors[0].type === 'string.max')) {
                showToastPopover(
                  `${translate('error_popover_status.section_name_length')} ${FLOW_MIN_MAX_CONSTRAINT.SECTION_NAME_MIN_VALUE} ${translate('error_popover_status.to')} ${FLOW_MIN_MAX_CONSTRAINT.SECTION_NAME_MAX_VALUE} ${translate('error_popover_status.character_long')}`,
                  EMPTY_STRING,
                  FORM_POPOVER_STATUS.SERVER_ERROR,
                  true,
                );
              }
          } else if ((error?.response?.data?.errors || []).length > 0) {
          const isErrorInDataListOrPropertyPickers = some(error.response.data.errors, (errorObj) => {
            if (errorObj?.field.includes('data_list')) return true;
            if (errorObj?.field.includes('property_picker_details')) return true;
            if (errorObj?.field) {
              const idArray = errorObj?.field.split('.');
              if (
                  (idArray[0] === 'sections') &&
                  (idArray[2] === 'field_list') &&
                  (idArray[4] === 'fields') &&
                  (idArray[6] === 'field')
                ) return true;
            }
            return true;
          });
          if (isErrorInDataListOrPropertyPickers) {
            showToastPopover(
              t(ERROR_MESSAGES.ERROR_IN_FIELD),
              t(ERROR_MESSAGES.CHECK_FIELD_CONFIG),
              FORM_POPOVER_STATUS.SERVER_ERROR,
              true,
            );
            dispatch(
              dataListStateChangeAction(error.response.data.errors, 'server_error'),
            );
          }
        } else if (
            error &&
            error.response &&
            error.response.data &&
            error.response.data.errors.length
          ) {
            dispatch(
              dataListStateChangeAction(
                error.response.data.errors,
                'server_error',
              ),
            );
            const errors = jsUtils.compact(error.response.data.errors.map((error) => error.message || null) || []);

            if (!isEmpty(errors) && errors && errors[0]) {
              showToastPopover(
                translate('error_popover_status.error'),
                errors[0],
                FORM_POPOVER_STATUS.SERVER_ERROR,
                true,
              );
            }
          } else {
            const { server_error } = store.getState().CreateDataListReducer;
            const errorData = {
              error,
              server_error,
            };
            const apiFailureAction = {
              dispatch,
              action: saveDataListFailedAction,
            };
            generateApiErrorsAndHandleCatchBlock(
              errorData,
              apiFailureAction,
              false,
              true,
            );
          }
          return resolve(false);
        });
    });

export const saveFormApiThunkDataList =
  (postData, isClose = false, isFinalSubmission = false) =>
    (dispatch) =>
      new Promise((resolve) => {
        setPointerEvent(true);
        updatePostLoader(true);
        if (isEmpty(postData.data)) {
          postData.data = getFormDetailsAPIDataDataList(
            store.getState().CreateDataListReducer,
            postData.sectionIndex,
            postData.fieldListIndex,
            postData.fieldIndex,
            isFinalSubmission,
          );
        }
        dispatch(dataListFormLoading(true));
        saveForm(postData.data)
          .then((response) => {
            setPointerEvent(false);
            updatePostLoader(false);
            if (isClose) {
              dispatch(dataListClearAction());
              return resolve(response);
            }
            const form_details = response;
            const sections = response?.sections?.map((section) => {
              return {
                ...section,
                layout: constructTreeStructure(section?.contents),
              };
            });
            const dataListState = [
              {
                id: 'form_details',
                value: form_details,
              },
              {
                id: 'sections',
                value: sections,
              },
              {
                id: 'error_list',
                value: {},
              },
              {
                id: 'server_error',
                value: [],
              },
            ];
            dispatch(dataListValuesStateChangeAction(dataListState));
            dispatch(dataListFormLoading(false));
            return resolve(sections);
          })
          .catch((error) => {
            setPointerEvent(false);
            updatePostLoader(false);
            if (
              error?.response?.data?.errors?.[0]?.type === 'someone_editing'
            ) {
              updateSomeoneIsEditingPopover(error.response.data.errors[0].message);
            } else if (
              (error?.response?.data?.errors || []).length > 0 && error.response.data.errors[0].indexes && error.response.data.errors[0].indexes.includes('section_name')
              ) {
               if ((error.response.data.errors[0].type === 'string.min') || (error.response.data.errors[0].type === 'string.max')) {
                showToastPopover(
                  `${translate('error_popover_status.section_name_length')} ${FLOW_MIN_MAX_CONSTRAINT.SECTION_NAME_MIN_VALUE} ${translate('error_popover_status.to')} ${FLOW_MIN_MAX_CONSTRAINT.SECTION_NAME_MAX_VALUE} ${translate('error_popover_status.character_long')}`,
                  EMPTY_STRING,
                  FORM_POPOVER_STATUS.SERVER_ERROR,
                  true,
                );
               }
            } else if ((error?.response?.data?.errors || []).length > 0) {
            const isErrorInDataListOrPropertyPickers = some(error.response.data.errors, (errorObj) => {
              if (errorObj?.field.includes('data_list')) return true;
              if (errorObj?.field.includes('property_picker_details')) return true;
              if (errorObj?.field) {
                const idArray = errorObj?.field.split('.');
                if (
                    (idArray[0] === 'sections') &&
                    (idArray[2] === 'field_list') &&
                    (idArray[4] === 'fields') &&
                    (idArray[6] === 'field')
                  ) return true;
              }
              return true;
            });
            if (isErrorInDataListOrPropertyPickers) {
              showToastPopover(
                'Error in field',
                'Check the field configuration',
                FORM_POPOVER_STATUS.SERVER_ERROR,
                true,
              );
              dispatch(
                dataListStateChangeAction(error.response.data.errors, 'server_error'),
              );
            }
          } else if (
              error &&
              error.response &&
              error.response.data &&
              error.response.data.errors.length
            ) {
              dispatch(
                dataListStateChangeAction(
                  error.response.data.errors,
                  'server_error',
                ),
              );
              const errors = jsUtils.compact(error.response.data.errors.map((error) => error.message || null) || []);

              if (!isEmpty(errors) && errors && errors[0]) {
                showToastPopover(
                  translate('error_popover_status.error'),
                  errors[0],
                  FORM_POPOVER_STATUS.SERVER_ERROR,
                  true,
                );
              }
            } else {
              const { server_error } = store.getState().CreateDataListReducer;
              const errorData = {
                error,
                server_error,
              };
              const apiFailureAction = {
                dispatch,
                action: saveDataListFailedAction,
              };
              generateApiErrorsAndHandleCatchBlock(
                errorData,
                apiFailureAction,
                false,
                true,
              );
            }
            return resolve(false);
          });
      });

export const saveRuleForFieldApiThunk =
  (ruleData, id, sectionIndex, fieldListIndex, fieldIndex = null) =>
    (dispatch) =>
      new Promise((resolve, reject) => {
        apiSaveRule(ruleData)
          .then((res) => {
            dispatch(
              saveRuleAction(res, id, sectionIndex, fieldListIndex, fieldIndex),
            );
            resolve(true);
          })
          .catch((error) => {
            console.log('saveRuleFailed saveRuleForFieldInDataList', error.response.data.errors[0].validation_message);
            if (
              error.response &&
              error.response.data &&
              error.response.data.errors[0].type === 'someone_editing'
            ) {
              updateSomeoneIsEditingPopover(error.response.data.errors[0].message);
            } else if (
              error &&
              error.response &&
              error.response.data &&
              error.response.data.errors.length &&
              error.response.data.errors[0].validation_message &&
              error.response.data.errors[0].validation_message === 'cyclicDependency'
            ) {
              showToastPopover(
                translate('error_popover_status.cyclic_dependency'),
                translate('error_popover_status.cannot_set_rule'),
                FORM_POPOVER_STATUS.SERVER_ERROR,
                true,
              );
            } else {
              showToastPopover(
                translate('error_popover_status.save_rule'),
                translate('error_popover_status.rules_not_set'),
                FORM_POPOVER_STATUS.SERVER_ERROR,
                true,
              );
            }
            reject(error);
          });
      });

export const publishDataListApiThunk = (postData, history, t = translateFunction) => (dispatch) => {
  dispatch(isEditDatalistAction(false));
  dispatch(saveDataListStartedAction());
  setPointerEvent(true);
  updatePostLoader(true);
  publishDataList(postData)
    .then((res) => {
      setPointerEvent(false);
      updatePostLoader(false);
      if (!jsUtils.isEmpty(res)) {
        showToastPopover(
          translate('error_popover_status.published_successfully'),
          translate('error_popover_status.datalis_published'),
          FORM_POPOVER_STATUS.SUCCESS,
          true,
        );
        dispatch(dataListClearAction());
        const { tab_index: allFlowsTabIndex } =
          store.getState().FlowListReducer;
        if (allFlowsTabIndex === ALL_FLOW_TAB_INDEX.DATALIST_TAB) {
          const { otherDataListDataCountPerCall } =
            store.getState().DataListReducer;
          const params = {
            sort_field: 'last_updated_on',
            sort_by: -1,
            // page: 1,
            size: otherDataListDataCountPerCall,
          };
          dispatch(getAllDataListApi(params, 'isOthers'));
        }
        routeNavigate(history, ROUTE_METHOD.PUSH, ADMIN_HOME);
      } else {
        const err = {
          response: {
            status: 500,
          },
        };
        const errors = generatePostServerErrorMessage(err);
        dispatch(isEditDatalistAction(true));
        dispatch(saveDataListFailedAction(errors.common_server_error));
      }
    })
    .catch((error) => {
      const { server_error, security } = store.getState().CreateDataListReducer;
      setPointerEvent(false);
      updatePostLoader(false);
      dispatch(isEditDatalistAction(true));
      console.log('eroorrr', error.response);
      if (error.response && error.response.data) {
        if (error.response.data.errors[0].type === 'someone_editing') {
          updateSomeoneIsEditingPopover(error.response.data.errors[0].message);
        } else if (error?.response?.data?.errors[0]?.field?.includes('metric_fields')) {
          showToastPopover(
            translate('error_popover_status.error_in_metric'),
            translate('error_popover_status.remove_deleted_field'),
            FORM_POPOVER_STATUS.SERVER_ERROR,
            true,
          );
        } else if (error.response.data.errors[0].type === 'invalid') {
          const errorDataDetails = {};
            switch (error.response.data.errors[0].field) {
              case 'admins.users':
                showToastPopover(
                  `${error.response.data.errors[0].indexes.length === 1 ? 'One' : 'Some'} of the datalist admin role is not admin`,
                  `Change the ${error.response.data.errors[0].indexes.length === 1 ? 'admin' : 'admins'} role to admin and publish`,
                  FORM_POPOVER_STATUS.SERVER_ERROR,
                  true,
                );
                break;
              case 'owners.users':
                const allUsers = jsUtils.get(security, ['owners', 'users'], []);
                let ownerErrorMessage = null;
                const invalidUserIndexes = (error.response.data.errors[0].indexes) || [];
                if (!jsUtils.isEmpty(allUsers) && !jsUtils.isEmpty(invalidUserIndexes)) {
                  ownerErrorMessage = jsUtils.compact(allUsers.map((user, idk) => (invalidUserIndexes.includes(idk)) ? user.username : null)).join(COMMA + SPACE);
                  ownerErrorMessage += DASHBOARD_ADMIN_VALIDATION_MESSAGE;
                  errorDataDetails.reassignedOwners = ownerErrorMessage;
                }
                showToastPopover(
                  `${error.response.data.errors[0].indexes.length === 1 ? 'One' : 'Some'} of the datalist owners role is not admin`,
                  `Change the ${error.response.data.errors[0].indexes.length === 1 ? 'owner' : 'owners'} role to admin and publish`,
                  FORM_POPOVER_STATUS.SERVER_ERROR,
                  true,
                );
                break;
              case 'entry_adders.users':
                showToastPopover(
                  `${error.response.data.errors[0].indexes.length === 1 ? 'One' : 'Some'} of the datalist entry adders role is not admin`,
                  `Change the ${error.response.data.errors[0].indexes.length === 1 ? 'owner' : 'owners'} role to admin and publish`,
                  FORM_POPOVER_STATUS.SERVER_ERROR,
                  true,
                );
                break;
              case 'viewers.users':
                showToastPopover(
                  `${error.response.data.errors[0].indexes.length === 1 ? 'One' : 'Some'} of the datalist viewers role is not admin`,
                  `Change the ${error.response.data.errors[0].indexes.length === 1 ? 'owner' : 'owners'} role to admin and publish`,
                  FORM_POPOVER_STATUS.SERVER_ERROR,
                  true,
                );
                break;
              default:
                showToastPopover(
                  'Error',
                  'Failed to publish datalist',
                  FORM_POPOVER_STATUS.SERVER_ERROR,
                  true,
                );
                break;
            }
        } else if ((error.response.data.errors[0].type === 'any.required') && (error.response.data.errors[0].field === 'form')) {
          showToastPopover(
            'Unable to publish',
            'Add at least one field to the datalist to publish',
            FORM_POPOVER_STATUS.SERVER_ERROR,
            true,
          );
        } else if (error?.response?.data?.errors[0]?.type === VALIDATION_ERROR_TYPES.LIMIT) {
          showToastPopover(
            'Limit Exceeded',
            EMPTY_STRING,
            FORM_POPOVER_STATUS.SERVER_ERROR,
            true,
          );
        } else {
          let errorPopoverData = {
            title: 'Unable to publish',
            subTitle: error.state_error && error.state_error.data_list_name,
            isVisible: true,
            status: 2,
          };
          console.log('errorPopoverData', get(error, ['response', 'data', 'errors'], []));
          get(error, ['response', 'data', 'errors'], []).forEach((eachError) => {
            console.log('errorPopoverData', eachError);
            if (eachError?.field?.includes('trigger_details')) {
              errorPopoverData = FLOW_STRINGS.SERVER_RESPONSE.TRIGGER_DETAILS(t);
            }
          });
          showToastPopover(
            errorPopoverData?.title,
            errorPopoverData?.subTitle,
            FORM_POPOVER_STATUS.SERVER_ERROR,
            true,
          );
        }
      } else {
        let errorPopoverData = {
          title: 'Error',
          subTitle: 'Failed to publish datalist',
          status: FORM_POPOVER_STATUS.SERVER_ERROR,
          isVisible: true,
        };
        console.log('errorPopoverData', get(error, ['response', 'data', 'errors'], []));
        get(error, ['response', 'data', 'errors'], []).forEach((eachError) => {
          console.log('errorPopoverData', eachError);
          if (eachError?.field?.includes('trigger_details')) {
            errorPopoverData = FLOW_STRINGS.SERVER_RESPONSE.TRIGGER_DETAILS(t);
          }
        });
        showToastPopover(
          errorPopoverData?.title,
          errorPopoverData?.subTitle,
          FORM_POPOVER_STATUS.SERVER_ERROR,
          true,
        );
      }
      const errorData = {
        error,
        server_error,
      };
      const apiFailureAction = {
        dispatch,
        action: saveDataListFailedAction,
      };
      generateApiErrorsAndHandleCatchBlock(
        errorData,
        apiFailureAction,
        false,
        true,
      );
    });
};

export const deleteDataListApiThunk =
  (postData, closeFunction, historyObj, t) => (dispatch) => {
    dispatch(saveDataListStartedAction());
    dispatch(isEditDatalistAction(false));
    setPointerEvent(true);
    updatePostLoader(true);
    deleteDataList(postData)
      .then((response) => {
        console.log(
          'DELETED DATA LIST action',
          response,
          jsUtils.isEmpty(response),
        );
        setPointerEvent(false);
        updatePostLoader(false);
        closeFunction();
        console.log('DELETED DATA LIST', response, jsUtils.isEmpty(response));
        if (!isNull(response)) {
          routeNavigate(historyObj, ROUTE_METHOD.PUSH, ADMIN_HOME);
        }
        if (jsUtils.isEmpty(response)) {
          showToastPopover(
            t('error_popover_status.deleted_successfully'),
            t('error_popover_status.datalist_deleted'),
            FORM_POPOVER_STATUS.SUCCESS,
            true,
          );
        } else {
          const err = {
            response: {
              status: 500,
            },
          };
          dispatch(isEditDatalistAction(true));
          const errors = generatePostServerErrorMessage(err);
          dispatch(saveDataListFailedAction(errors.common_server_error));
        }
      })
      .catch((error) => {
        const { server_error } = store.getState().CreateDataListReducer;
        dispatch(isEditDatalistAction(true));
        if (
          error.response &&
          error.response.data &&
          error.response.data.errors[0].type === 'someone_editing'
        ) {
          updateSomeoneIsEditingPopover(error.response.data.errors[0].message);
        }
        const errorData = {
          error,
          server_error,
        };
        const apiFailureAction = {
          dispatch,
          action: saveDataListFailedAction,
        };
        generateApiErrorsAndHandleCatchBlock(
          errorData,
          apiFailureAction,
          false,
          true,
        );
      });
  };

export const discardDataListApiThunk =
  (postData, closeFunction, historyObj) => (dispatch) => {
    dispatch(saveDataListStartedAction());
    dispatch(isEditDatalistAction(false));
    setPointerEvent(true);
    updatePostLoader(true);
    discardDataList(postData)
      .then((response) => {
        console.log(
          'DISCARD DATA LIST action',
          response,
          jsUtils.isEmpty(response),
        );
        setPointerEvent(false);
        updatePostLoader(false);
        closeFunction();
        console.log('DISCARD DATA LIST', response, jsUtils.isEmpty(response));
        if (!isNull(response)) {
          historyObj.push(ADMIN_HOME);
        }
        if (jsUtils.isEmpty(response)) {
          showToastPopover(
            'Discarded successfully',
            'Datalist discarded successfully',
            FORM_POPOVER_STATUS.SUCCESS,
            true,
          );
        } else {
          const err = {
            response: {
              status: 500,
            },
          };
          dispatch(isEditDatalistAction(true));
          const errors = generatePostServerErrorMessage(err);
          dispatch(saveDataListFailedAction(errors.common_server_error));
        }
      })
      .catch((error) => {
        const { server_error } = store.getState().CreateDataListReducer;
        dispatch(isEditDatalistAction(true));
        if (
          error.response &&
          error.response.data &&
          error.response.data.errors[0].type === 'someone_editing'
        ) {
          updateSomeoneIsEditingPopover(error.response.data.errors[0].message);
        }
        const errorData = {
          error,
          server_error,
        };
        const apiFailureAction = {
          dispatch,
          action: saveDataListFailedAction,
        };
        generateApiErrorsAndHandleCatchBlock(
          errorData,
          apiFailureAction,
          false,
          true,
        );
      });
  };

export const getAllFieldsDataList =
  (params, currentFieldUuid = '', setStateKey = '', mapping = [], fieldListDropdownType, tableUuid, getCancelToken) =>
    (dispatch) => {
      if (!isEmpty(setStateKey) && params.page === 1) {
        dispatch(createDatalistChange({
          [`all${setStateKey}`]: [],
          [setStateKey]: [],
          [`loading${setStateKey}`]: true,
        }));
      }
      dispatch(getAllFieldsDataListStartedAction());
      apiGetAllFieldsList(params, getCancelToken)
        .then((res) => {
          console.log('action.payload', res);
          const { pagination_data, pagination_details } = res;
          console.log('action.payload', pagination_data);
          if (pagination_data && pagination_data.length) {
            const dataListData = jsUtils.cloneDeep(
              store.getState().CreateDataListReducer,
            );
            const fields = [];
            pagination_data.forEach((fieldData) => {
              if (
                !(currentFieldUuid && fieldData.field_uuid === currentFieldUuid)
              ) {
                fields.push({
                  ...fieldData,
                  label: fieldData.label || fieldData.reference_name,
                  value: fieldData.field_uuid,
                });
              }
            });
            if (isEmpty(setStateKey)) {
              if (jsUtils.isObject(dataListData.lstPaginationData)) {
                if (
                  dataListData.lstPaginationData.page < pagination_details[0].page
                ) {
                  dataListData.lstAllFields = [
                    ...dataListData.lstAllFields,
                    ...fields,
                  ];
                  dataListData.lstPaginationData = { ...pagination_details[0] };
                } else if (pagination_details[0].page === 1) {
                  dataListData.lstAllFields = [...fields];
                  dataListData.lstPaginationData = { ...pagination_details[0] };
                }
              } else {
                dataListData.lstAllFields = [...fields];
                [dataListData.lstPaginationData] = pagination_details || [];
              }
              dataListData[`loading${setStateKey}`] = false;
              dispatch(getAllFieldsDataListSuccessAction(dataListData));
            } else {
              const mappedFieldUuids = [];
              mapping.forEach((eachMapping) => {
                if (!isEmpty(get(eachMapping, ['child_field_details', 'field_uuid'], []))) {
                  mappedFieldUuids.push(get(eachMapping, ['child_field_details', 'field_uuid'], []));
                }
                if (!isEmpty(get(eachMapping, ['child_table_details', 'table_uuid'], []))) {
                  mappedFieldUuids.push(get(eachMapping, ['child_table_details', 'table_uuid'], []));
                }
                if (!isEmpty(get(eachMapping, ['field_mapping'], []))) {
                  get(eachMapping, ['field_mapping'], []).forEach((eachSubMapping) => {
                    if (!isEmpty(get(eachSubMapping, ['child_field_details', 'field_uuid'], []))) {
                      mappedFieldUuids.push(get(eachSubMapping, ['child_field_details', 'field_uuid'], []));
                    }
                  });
                }
              });
console.log(params.table_uuid, params, 'kjkljkljkllj');
              const fields = getGroupedFieldListForMapping(tableUuid || params.table_uuid, pagination_data, mappedFieldUuids, fieldListDropdownType);

              const paginationDataKey = `${setStateKey}paginationData`;
              if (jsUtils.isObject(dataListData[paginationDataKey])) {
                if (
                  dataListData[paginationDataKey].page < pagination_details[0].page
                ) {
                  dataListData[setStateKey] = [
                    ...dataListData[setStateKey],
                    ...fields,
                  ];
                  dataListData[`${setStateKey}MetaData`] = [
                    ...dataListData[setStateKey],
                    ...fields,
                  ];
                  dataListData[`all${setStateKey}`] = [
                    ...pagination_data,
                    ...fields,
                  ];
                  dataListData[paginationDataKey] = { ...pagination_details[0] };
                } else if (pagination_details[0].page === 1) {
                  dataListData[setStateKey] = [...fields];
                  dataListData[`${setStateKey}MetaData`] = [...fields];
                  dataListData[`all${setStateKey}`] = pagination_data;
                  dataListData[paginationDataKey] = { ...pagination_details[0] };
                }
              } else {
                dataListData[setStateKey] = [...fields];
                dataListData[`${setStateKey}MetaData`] = [...fields];
                dataListData[`all${setStateKey}`] = pagination_data;
                [dataListData[paginationDataKey]] = pagination_details || [];
              }
              dataListData[`loading${setStateKey}`] = false;
              dataListData.triggerMappedUuids = mappedFieldUuids;
              dispatch(createDatalistChange(dataListData));
            }

            console.log('action.payload setStateKey', dataListData, setStateKey);
          } else {
            dispatch(createDatalistChange({
              [`loading${setStateKey}`]: false,
            }));
          }
        })
        .catch((error) => {
          console.log('selected_eventselected_event', error);
          if (has(error, ['code']) && error.code === 'ERR_CANCELED') return;
          const errors = generateGetServerErrorMessage(error);
          dispatch(getAllFieldsDataListFailedAction(errors));
          dispatch(createDatalistChange({
            [`loading${setStateKey}`]: false,
          }));
        });
    };

export const saveRuleForFieldInDataList =
  (ruleData, sectionId, fieldId) => (dispatch) =>
    new Promise((resolve, reject) => {
      apiSaveRule(ruleData)
        .then((res) => {
          const { _id } = res;
          console.log('sections222', _id);
          const { sections } = cloneDeep(
            store.getState().CreateDataListReducer,
          );
          sections[sectionId - 1].fields[fieldId - 1].show_when_rule = _id;
          console.log('sections222', sections);
          dispatch(ruleFieldTypeChangeDataListIntSucess(sections)).then(() => {
            resolve(true);
          });
        })
        .catch((error) => {
          console.log('saveRuleFailed saveRuleForFieldInDataList', error);
          console.log('saveRuleFailed saveRuleForFieldInDataList', error.response.data.errors[0].validation_message);
          if (
            error.response &&
            error.response.data &&
            error.response.data.errors[0].type === 'someone_editing'
          ) {
            updateSomeoneIsEditingPopover(error.response.data.errors[0].message);
          } else if (
            error &&
            error.response &&
            error.response.data &&
            error.response.data.errors.length &&
            error.response.data.errors[0].validation_message &&
            error.response.data.errors[0].validation_message === 'cyclicDependency'
          ) {
            showToastPopover(
              translate('error_popover_status.cyclic_dependency'),
              translate('error_popover_status.cannot_set_rule'),
              FORM_POPOVER_STATUS.SERVER_ERROR,
              true,
            );
          } else {
            showToastPopover(
              translate('error_popover_status.save_rule'),
              translate('error_popover_status.rules_not_set'),
              FORM_POPOVER_STATUS.SERVER_ERROR,
              true,
            );
          }
          reject(error);
        });
    });

export const getVisibilityConfigOperatorsByFieldTypeInDataList =
  (fieldTypes, selectedFieldUuid, sectionCount, fieldsCount) => (dispatch) => {
    dispatch(ruleFieldTypeChangeDataListStarted());
    apiGetRuleOperatorsByFieldType(fieldTypes)
      .then((res) => {
        const lstOperandData = res;
        const { sections } = jsUtils.cloneDeep(
          store.getState().CreateDataListReducer,
        );
        const fieldType = fieldTypes[0];

        const lstOperator = getArrOperatorData(lstOperandData, fieldType);
        if (lstOperator !== undefined && lstOperator !== null) {
          sections[sectionCount].fields[fieldsCount].arrOperatorData =
            lstOperator;
        }

        sections[sectionCount].fields[fieldsCount].l_field = selectedFieldUuid;
        sections[sectionCount].fields[fieldsCount].l_selectedFieldValue =
          fieldType;
        dispatch(ruleFieldTypeChangeDataListSucess(sections));
      })
      .catch((err) => {
        const errors = generateGetServerErrorMessage(err);
        dispatch(ruleFieldTypeChangeDataListFailed(errors));
      });
  };

export const getAllFieldsListApiThunk =
  (
    paginationData,
    type = GET_ALL_FIELDS_LIST_BY_FILTER_TYPES.DEFAULT_REPORT_FIELDS,
    isPaginated = false,
  ) =>
    (dispatch) => {
      apiGetAllFieldsList(paginationData)
        .then((res) => {
          const { pagination_data } = res;
          if (pagination_data) {
            let {
              lstAllFields,
              allIdentifierFields,
              hasMore,
              metricCurrentPage,
              identifierCurrentPage,
            } = jsUtils.cloneDeep(store.getState().CreateDataListReducer);
            pagination_data &&
              pagination_data.map((fieldData) => {
                fieldData.label = fieldData.label || fieldData.reference_name;
                fieldData.value = fieldData.field_uuid;
                return fieldData;
              });
            const pagination_detail = jsUtils.get(res, ['pagination_details', 0], {});
            if (type === GET_ALL_FIELDS_LIST_BY_FILTER_TYPES.DEFAULT_REPORT_FIELDS) {
              const rendered = pagination_detail.size * pagination_detail.page;
              const total = pagination_detail.total_count;
              if (rendered >= total) hasMore = false;
              else hasMore = true;

              if (isPaginated && pagination_detail.page > 1) {
                lstAllFields = [...lstAllFields, ...res.pagination_data];
              } else {
                lstAllFields = res.pagination_data;
              }
              metricCurrentPage = pagination_detail.page;
            } else if (type === GET_ALL_FIELDS_LIST_BY_FILTER_TYPES.IDENTIFIERS) {
              const rendered = pagination_detail.size * pagination_detail.page;
              const total = pagination_detail.total_count;
              if (rendered >= total) hasMore = false;
              else hasMore = true;

              if (isPaginated && pagination_detail.page > 1) {
                allIdentifierFields = [
                  ...allIdentifierFields,
                  ...res.pagination_data,
                ];
              } else {
                allIdentifierFields = res.pagination_data;
              }
              identifierCurrentPage = pagination_detail.page;
            }
            const dataListState = [
              {
                id: 'lstAllFields',
                value: lstAllFields,
              },
              {
                id: 'allIdentifierFields',
                value: allIdentifierFields,
              },
              {
                id: 'hasMore',
                value: hasMore,
              },
              {
                id: 'metricCurrentPage',
                value: metricCurrentPage,
              },
              {
                id: 'identifierCurrentPage',
                value: identifierCurrentPage,
              },
            ];
            dispatch(dataListValuesStateChangeAction(dataListState));
          }
        })
        .catch((err) => {
          console.log(err);
        });
    };

export const getChildFlowDetailsByUUID =
  (flow_uuid, isTestBed, currentTriggerData, enableLoader = true) => (dispatch) =>
    new Promise((resolve, reject) => {
      if (enableLoader) {
        dispatch(createDatalistChange({
          isChildFlowDetailsLoading: true,
        }));
      }
      apiGetFlowDetailsByUUID({
        flow_uuid,
        is_test_bed: isTestBed ? 1 : 0,
        initiation_step_details: 1, // to fetch details of first step of child flow
      })
        .then((res) => {
          const currentTrigger = cloneDeep(currentTriggerData);
          const { initiation_step } = res;
          let initiationStepDetails = {};
          if (initiation_step) {
            initiationStepDetails = {
              child_flow_initial_step_name: initiation_step.step_name,
              child_flow_initial_step_assignees: initiation_step.step_assignees,
            };
          }
          const updatedChildFlowDetails = {
            ...currentTrigger.child_flow_details,
            child_flow_id: res._id,
            child_flow_name: res.flow_name,
            ...initiationStepDetails,
          };
          currentTrigger.child_flow_details = updatedChildFlowDetails;
          dispatch(createDatalistChange({ activeTriggerData: currentTrigger }));
          dispatch(createDatalistChange({
            isChildFlowDetailsLoading: false,
          }));
          resolve(true);
        })
        .catch((err) => {
          console.log('errr in fetching sub flow details', err);
          showToastPopover(
            'Unable to fetch trigger flow details',
            EMPTY_STRING,
            FORM_POPOVER_STATUS.SERVER_ERROR,
            true,
          );
          dispatch(createDatalistChange({
            isChildFlowDetailsLoading: false,
          }));
          reject();
        });
    });

export const getAllFlowListApiThunk = (params, savedData) => (dispatch) => {
  if (params.page === 1 && !params.search) {
    dispatch(createDatalistChange({
      isFlowListLoading: true,
    }));
  }
  getAllFlows(params)
    .then((res) => {
      const state = cloneDeep(store.getState().CreateDataListReducer);
      const { allFlowsList, flowsTotalCount } = cloneDeep(state);
      const newFlowsList = [];
      res.pagination_data.forEach((flow) => {
          newFlowsList.push({
            label: flow.flow_name,
            value: flow.flow_uuid,
          });
      });
      let updatedFlowList = newFlowsList;
      if (res.pagination_details[0].page > 1) updatedFlowList = [...allFlowsList, ...newFlowsList];
      const savedStepData = savedData;
      dispatch(createDatalistChange({
        isFlowListLoading: false,
        allFlowsList: updatedFlowList,
        flowsTotalCount: get(res, ['pagination_details', 0, 'total_count'], flowsTotalCount),
        savedStepData: savedStepData,
      }));
    })
    .catch((err) => {
      console.log('API CALL ERROR', err);
    });
};

export const getTriggerDetailsByUUID =
(trigger_uuid, currentTriggerData, entity, documentType, entityId, t = translateFunction) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(createDatalistChange({
      isChildFlowDetailsLoading: true,
    }));
    const state = cloneDeep(store.getState().CreateDataListReducer);
    getTriggerDetails({ data_list_id: state?.data_list_id, trigger_uuid: [trigger_uuid] })
      .then((res) => {
        const currentTrigger = cloneDeep(currentTriggerData);
        const { trigger_metadata, field_metadata = [], table_metadata = [] } = res;
        let initiationStepDetails = {};
        if (trigger_metadata && trigger_metadata[0]) {
          const { initiation_step } = trigger_metadata[0];
          if (initiation_step) {
            initiationStepDetails = {
              child_flow_initial_step_name: initiation_step.step_name,
              child_flow_initial_step_assignees: initiation_step.step_assignees,
            };
          }
        }
        const { trigger_mapping } = currentTriggerData;
        let updatedTriggerMapping = cloneDeep(trigger_mapping);
        if ((!isEmpty(field_metadata) || !isEmpty(table_metadata)) && !isEmpty(trigger_mapping)) {
          const { modifiedMappingData, document_details } =
          constructTriggerMappingFieldMetadata(
            trigger_mapping,
            field_metadata,
            table_metadata,
            res.document_url_details || [],
            entityId,
            entity,
            documentType);
          updatedTriggerMapping = modifiedMappingData;
          currentTrigger.document_details = document_details;
        }
        const updatedChildFlowDetails = {
          ...currentTrigger.child_flow_details,
          child_flow_id: trigger_metadata && trigger_metadata[0] && trigger_metadata[0].child_flow_id,
          child_flow_name: trigger_metadata && trigger_metadata[0] && trigger_metadata[0].child_flow_name,
          ...initiationStepDetails,
        };
        console.log('updatedTriggerMapping', updatedTriggerMapping);
        currentTrigger.child_flow_details = updatedChildFlowDetails;
        currentTrigger.trigger_mapping = updatedTriggerMapping;
        currentTrigger.trigger_mapping_error_list = getDeletedFieldsErrorList(currentTrigger.trigger_mapping_error_list, updatedTriggerMapping, t);
        if (isUndefined(updatedChildFlowDetails.child_flow_name)) {
          currentTrigger.trigger_mapping_error_list[FLOW_TRIGGER_CONSTANTS.FLOW_SELECTION.ID] =
          'Child Flow has been deleted';
        }
        dispatch(createDatalistChange({ activeTriggerData: currentTrigger }));
        dispatch(createDatalistChange({
          isChildFlowDetailsLoading: false,
        }));
        resolve(true);
      })
      .catch((err) => {
        console.log('errr in fetching trigger details', err);
        showToastPopover(
          'Unable to fetch trigger details',
          EMPTY_STRING,
          FORM_POPOVER_STATUS.SERVER_ERROR,
          true,
        );
        dispatch(createDatalistChange({
          isChildFlowDetailsLoading: false,
        }));
        reject();
      });
  });

export default getAllFieldsDataList;
