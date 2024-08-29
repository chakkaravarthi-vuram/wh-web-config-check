/* eslint-disable consistent-return */
import { v4 as uuidv4 } from 'uuid';

import { DEFAULT_CURRENCY_TYPE } from 'utils/constants/currency.constant';
import { getAssignedOn, getDueDate, getInitiatorName, getPublisherName, getTaskName, getDirectFieldUuidData, getCurrencyFromAllowedCurrencyTypes, TASK_CATEGORY_FLOW_TASK, getEditableFormSubmissionData } from 'utils/taskContentUtils';
import { getFieldType } from 'containers/edit_flow/step_configuration/StepConfiguration.utils';
import { COMMON_SERVER_ERROR_TYPES } from 'utils/ServerConstants';
import { MODULE_TYPES, FILE_UPLOAD_STATUS } from '../../../../utils/Constants';
// import { areAllColumnsListReadOnly } from '../../../../components/form_builder/FormBuilder.utils';
import { taskContentDataChange } from '../../../../redux/actions/TaskActions';
import { store } from '../../../../Store';
import {
  FIELD_LIST_TYPE,
  FIELD_TYPE,
} from '../../../../utils/constants/form.constant';
import jsUtils, {
  cloneDeep,
  has,
  isEmpty,
  get,
  groupBy,
  isFiniteNumber,
  isNull,
  uniqBy,
  isArray,
} from '../../../../utils/jsUtility';
import { EMPTY_STRING } from '../../../../utils/strings/CommonStrings';
import {
  getFileNameFromServer,
  getUserProfileData,
} from '../../../../utils/UtilityFunctions';
import { TIME_LABEL, TASK_STATUS_TYPES } from '../../LandingPage.strings';
import { getDmsLinkForPreviewAndDownload } from '../../../../utils/attachmentUtils';

export const getDataListPickerFieldFromActiveForm = (activeFormPickerField, field = {}, fieldList = []) => {
  const displayFieldsUUIDS = get(field, ['data_list_details', 'display_fields'], []);
  const choiceObj = {};
  displayFieldsUUIDS.forEach((uuid) => {
    const displayField = fieldList?.find((eachField) => eachField?.field_uuid === uuid);
      if (displayField) {
        const choiceValues = get(displayField, ['choice_values'], []);
        const _choiceObj = {};
        choiceValues.forEach((c) => {
          _choiceObj[c.value.toString()] = c.label;
        });
        if (!isEmpty(_choiceObj)) choiceObj[uuid] = _choiceObj;
      }
  });

  if (jsUtils.isArray(activeFormPickerField)) {
    return activeFormPickerField;
  }
  console.log('getDataListPickerFieldFromActiveForm', { activeFormPickerField, field, fieldList, choiceObj });
  if (
    jsUtils.has(activeFormPickerField, 'entry_details') &&
    !jsUtils.isEmpty(activeFormPickerField.entry_details)
  ) {
    const fieldValue = activeFormPickerField.entry_details.flatMap(
      (eachEntry) => {
        console.log('eachEntry 3', cloneDeep(eachEntry), eachEntry._id, eachEntry.id);
        const eachValue = activeFormPickerField.display_fields.flatMap(
          (displayField) => {
            console.log('eachEntry 4', choiceObj, cloneDeep(eachEntry), eachEntry._id, eachEntry.id);
            // if (has(choiceObj, [displayField, eachEntry[displayField]])) return [choiceObj[displayField][eachEntry[displayField]]];
            return jsUtils.has(eachEntry, [displayField]) ? [eachEntry[displayField]] : [];
      });
      console.log('eachEntry 1', cloneDeep(eachEntry), eachEntry._id, eachEntry.id);

        if (eachValue !== null) {
          const label = eachValue.join(
            jsUtils.get(activeFormPickerField, 'separator') || '-',
          );
          console.log('eachEntry 2', cloneDeep(eachEntry), eachEntry._id, eachEntry.id);
          if (!jsUtils.isEmpty(label)) return [{ label, value: eachEntry._id || eachEntry.id, id: eachEntry._id || eachEntry.id, datalistUUID: activeFormPickerField.data_list_uuid }];
        }
        return [];
      },
    );
    return fieldValue;
  }
  return [];
};

export const getTaskSubmissionData = (
  sections,
  statedata,
  isVisibility,
  finalSubmission,
  isCancelClicked = false,
  tableRowUpdateAction = EMPTY_STRING,
) => getEditableFormSubmissionData(
    sections,
    statedata,
    isVisibility,
    finalSubmission,
    isCancelClicked,
    tableRowUpdateAction,
    null,
    MODULE_TYPES.TASK,
  );

export const getFieldDataFromSection = (field_uuid, sections = []) => {
  let field_data = {};
  sections.some((eachSection) => {
    (eachSection.field_list || []).some((fieldList) => {
      field_data = (fieldList.fields || []).find((field) => (field.field_uuid === field_uuid));
      if (isEmpty(field_data)) return false;
      return true;
    });
    if (isEmpty(field_data)) return false;
    return true;
  });
  return isEmpty(field_data) ? {} : field_data;
};

export const getDefaultValue = (default_values, field_key, all_file_fields = [], document_url_details = [], sections = []) => {
  let data = default_values[field_key];
  if (
      all_file_fields &&
      !isEmpty(all_file_fields) &&
      all_file_fields.includes(field_key) &&
      data &&
      !jsUtils.isEmpty(data)
    ) {
      const document = [];
      document_url_details && document_url_details.forEach((eachDocument) => {
        if (data && data.includes(eachDocument.document_id)) {
          console.log('eachDocumentcheck', data, data.indexOf(eachDocument.document_id));
          document.push(eachDocument);
        }
      });
      const documentFieldValue = [];
      document.forEach((eachDocument) => {
        if (eachDocument && eachDocument.original_filename) {
          documentFieldValue.push(
            {
              fileName: getFileNameFromServer(eachDocument.original_filename),
              link: eachDocument.signedurl,
              id: eachDocument.document_id,
              fileId: field_key,
              file: {
                name: getFileNameFromServer(eachDocument.original_filename),
                type: eachDocument.original_filename.content_type,
                url: eachDocument.signedurl,
                size: eachDocument?.original_filename?.file_size,
              },
              url: eachDocument.signedurl,
              status: FILE_UPLOAD_STATUS.SUCCESS,
              // fileId: field.field_uuid,
            },
          );
        }
      });
      if (documentFieldValue) {
        data = documentFieldValue;
      }
  } else if (!isEmpty(sections)) {
    const fieldData = getFieldDataFromSection(field_key, sections);
    if (fieldData.field_type === FIELD_TYPE.DATA_LIST) {
      return getDataListPickerFieldFromActiveForm(data);
    }
  }
  return data;
};

export const constructFileUpload = (documentUrlDetails = [], value = [], field) => {
  const document = [];
  !isEmpty(documentUrlDetails) && documentUrlDetails.forEach((eachDocument) => {
    if (value && value.includes(eachDocument.document_id)) {
      document.push(eachDocument);
    }
  });

  const documentFieldValue = [];
  !isEmpty(document) && document.forEach((eachDocument) => {
    if (eachDocument && eachDocument.original_filename) {
      documentFieldValue.push(
        {
          fileName: getFileNameFromServer(eachDocument.original_filename),
          link: eachDocument.signedurl,
          id: eachDocument.document_id,
          file: {
            name: getFileNameFromServer(eachDocument.original_filename),
            type: eachDocument.original_filename.content_type,
            url: eachDocument.signedurl,
            size: eachDocument.original_filename.file_size,
          },
          thumbnail: `${getDmsLinkForPreviewAndDownload(
            window,
          )}/dms/display/?id=${eachDocument.document_id}`,
          url: eachDocument.signedurl,
          status: FILE_UPLOAD_STATUS.SUCCESS,
          fileId: field.field_uuid,
        },
      );
    }
  });
  return documentFieldValue;
};

export const getFields = (fields = []) => {
   const fieldList = [];
   const directField = fields.filter((field) => field?.field_list_type === FIELD_LIST_TYPE.DIRECT);

   directField.forEach((field) => {
      const eachField = field;
      if (eachField?.field_type === FIELD_TYPE.TABLE) {
       const { true: allColumns } = groupBy(fields, (each) => each.table_uuid === eachField?.field_uuid);
       eachField.columns = allColumns;
      }
      fieldList.push(eachField);
   });
   return directField;
};

const constructFieldMetaDataFromAllSections = (sections = []) => {
  let allSectionsFieldMetaData = [];

  sections?.forEach((section = {}) => {
    if (section?.field_metadata) {
      allSectionsFieldMetaData = [...allSectionsFieldMetaData, ...section.field_metadata];
    }
  });

  return uniqBy(allSectionsFieldMetaData, (field) => field.field_uuid);
};

const constructDependencyFieldMetaDataFromAllSections = (dependencyEntityFields = []) => uniqBy(dependencyEntityFields, (field) => field.field_uuid);

export const constructInformationFieldFormContent = ({
  sections = [],
  activeFormContent = {},
  documentUrlDetails = [],
  userProfileData = {},
  isSummary = false,
  dependencyEntityFields = [],
}) => {
  try {
    const infoFieldFormState = {};
    let infoFieldMetaData = [];
    if (isSummary) {
      infoFieldMetaData = getFields(constructDependencyFieldMetaDataFromAllSections(dependencyEntityFields));
    } else {
      infoFieldMetaData = getFields(constructFieldMetaDataFromAllSections(sections));
    }

    if (sections) {
      const environment_specific_default_currency = jsUtils.get(userProfileData, ['default_currency_type'], DEFAULT_CURRENCY_TYPE);

      sections?.forEach((section = {}) => {
        const fields = getFields(section?.field_metadata);

        fields?.forEach((eachField = {}) => {
          if (eachField.field_type === FIELD_TYPE.INFORMATION || eachField.field_type === FIELD_TYPE.RICH_TEXT) {
            const fieldUuids = get(eachField, ['information_data', 'field_uuids'], []);

            if (isEmpty(fieldUuids)) return;

            const currentInfoFieldFormContent = {};
            const currentLvlActiveFormContent = activeFormContent?.[eachField?.field_uuid];

            fieldUuids?.forEach((eachUuid = EMPTY_STRING) => {
              const currentField = infoFieldMetaData?.find((eachFieldMetaData) => eachFieldMetaData?.field_uuid === eachUuid);

              if (isEmpty(currentField) || isEmpty(currentLvlActiveFormContent)) return;

              if (currentField?.field_type === FIELD_TYPE.TABLE) {
                const activeFormTableContent = currentLvlActiveFormContent[eachUuid] || [];

                let modifiedTableData = activeFormTableContent.map((tableRow_, currentRowIndex) => {
                  const tableRow = jsUtils.cloneDeep(tableRow_);

                  jsUtils.forEach(tableRow, (_value, key) => {
                    const currentTablefield = currentField?.columns?.find((field) => field.field_uuid === key);

                    const activeFieldValue = currentTablefield ? jsUtils.get(
                      currentLvlActiveFormContent,
                      [eachUuid, currentRowIndex, currentTablefield?.field_uuid],
                      null,
                    ) : null;

                    if (key !== '_id' && currentTablefield) {
                      const currentTableFieldValue = getDirectFieldUuidData(
                        currentTablefield,
                        tableRow,
                        activeFieldValue,
                        environment_specific_default_currency,
                        documentUrlDetails,
                        (val) => getDataListPickerFieldFromActiveForm(val, currentTablefield, isSummary ? dependencyEntityFields : section?.field_metadata),
                      );

                      tableRow[key] = get(currentTableFieldValue, key, EMPTY_STRING);
                    }
                  });
                  return tableRow;
                });

                // To make sure all the columns were availble in the each row of the current table .
                modifiedTableData = modifiedTableData.map((rowData) => {
                  const fieldKeys = {};

                  currentField?.columns?.forEach((field) => {
                    jsUtils.set(fieldKeys, [field.field_uuid], null);
                  });

                  return {
                    ...fieldKeys, // null values for fields which doesn't have any value
                    ...rowData, // field values
                    temp_row_uuid: uuidv4(),
                  };
                });

                // check whether this table data is already save or not(fresh task).
                currentInfoFieldFormContent[eachUuid] = modifiedTableData;
              } else {
                let fieldValue = EMPTY_STRING;
                if (has(currentLvlActiveFormContent, [eachUuid])) {
                  fieldValue = currentLvlActiveFormContent[eachUuid];
                } else if (has(currentField, 'default_value')) {
                  if (currentField?.field_type === FIELD_TYPE.CURRENCY) fieldValue = { ...currentField?.default_value };
                  else fieldValue = currentField?.default_value;
                }

                const currentFieldValue = getDirectFieldUuidData(
                  currentField,
                  currentLvlActiveFormContent,
                  fieldValue,
                  environment_specific_default_currency,
                  documentUrlDetails,
                  (val) => getDataListPickerFieldFromActiveForm(val, currentField, isSummary ? dependencyEntityFields : section?.field_metadata),
                );

                currentInfoFieldFormContent[eachUuid] = get(currentFieldValue, eachUuid, EMPTY_STRING);
              }
            });
            infoFieldFormState[eachField?.field_uuid] = currentInfoFieldFormContent;
          }
        });
      });
    }

    return { infoFieldFormState };
  } catch (e) {
    console.log('constructInformationFieldFormContent Error', e);
    return { infoFieldFormState: {} };
  }
};

export const getStateVariables = (
  sections,
  activeFormContent,
  documentUrlDetails,
  userProfileData,
  isReadOnlyForm = false,
) => {
  try {
    const finalFormState = {};
    const tableSchema = {};
    if (sections) {
      const environment_specific_default_currency = jsUtils.get(
        userProfileData, ['default_currency_type'], DEFAULT_CURRENCY_TYPE);

      const formState = sections.flatMap((section) => {
        const fields = getFields(section?.field_metadata);
        let fieldListState = null;
        fieldListState = fields.flatMap((eachField) => {
          let fieldState;
          // below code helps to construct field data for redux
          if (eachField.field_type === FIELD_TYPE.TABLE) {
            const activeFormTableContent = isArray(activeFormContent[eachField.field_uuid]) ? activeFormContent[eachField.field_uuid] : [];
            // contruct the data, depend on the field type and return as table format.
            let modifiedTableData = activeFormTableContent.map((tableRow_, currentRowIndex) => {
              const tableRow = jsUtils.cloneDeep(tableRow_);
              jsUtils.forEach(tableRow, (_value, key) => {
                    const field = eachField?.columns?.find((field) => field.field_uuid === key);
                    const activeFieldValue = field ? jsUtils.get(
                      activeFormContent,
                      [eachField.field_uuid, currentRowIndex, field?.field_uuid],
                      null,
                    ) : null;

                    if (key !== '_id' && field) {
                      let fieldValue = null;
                      switch (field.field_type) {
                        case FIELD_TYPE.CURRENCY:
                          if (field.read_only) fieldValue = tableRow[key];
                          let currencyFieldValue = null;

                          if (typeof activeFieldValue?.value === 'number') {
                            currencyFieldValue = activeFieldValue.value;
                          }

                          fieldValue = {
                            value: currencyFieldValue?.toString(),
                            currency_type: (
                                activeFieldValue?.currency_type ||
                                jsUtils.get(field, ['default_value', 'currency_type'], null) ||
                                getCurrencyFromAllowedCurrencyTypes(field, environment_specific_default_currency) ||
                                environment_specific_default_currency ||
                                DEFAULT_CURRENCY_TYPE
                            ),
                          };
                          break;
                        case FIELD_TYPE.NUMBER:
                          fieldValue = tableRow[key]?.toString() || null;
                          break;
                        case FIELD_TYPE.DATA_LIST:
                          fieldValue = getDataListPickerFieldFromActiveForm(activeFieldValue, field, section?.field_metadata) || null;
                          break;
                        case FIELD_TYPE.CHECKBOX: {
                          fieldValue = tableRow[key] || [];
                          if (field.choice_value_type === FIELD_TYPE.DATE && !isEmpty(fieldValue)) {
                            const _value = fieldValue.map((v) => field.choice_values?.find((c) => c.value.startsWith(v))?.value);
                            fieldValue = _value;
                          }
                        }
                          break;
                        case FIELD_TYPE.DROPDOWN:
                        case FIELD_TYPE.CUSTOM_LOOKUP_DROPDOWN:
                        case FIELD_TYPE.RADIO_GROUP: {
                          fieldValue = tableRow[key];
                          if (field?.choice_value_type === FIELD_TYPE.DATE && !isEmpty(fieldValue)) {
                            const _value = field.choice_values?.find((c) => c.value.startsWith(fieldValue))?.value;
                            fieldValue = _value;
                          }
                          // if (!field?.choice_values?.find((eachValue) => (eachValue?.value || eachValue) === fieldValue)) fieldValue = null;
                          break;
                        }
                        case FIELD_TYPE.FILE_UPLOAD:
                          fieldValue = constructFileUpload(documentUrlDetails, tableRow[key], field);
                          break;
                        case FIELD_TYPE.INFORMATION:
                          fieldValue = field.default_value || EMPTY_STRING;
                          break;
                        case FIELD_TYPE.DATA_LIST_PROPERTY_PICKER:
                        case FIELD_TYPE.USER_PROPERTY_PICKER:
                          if (getFieldType(field) === FIELD_TYPE.FILE_UPLOAD) {
                            fieldValue = constructFileUpload(documentUrlDetails, tableRow[key], field);
                          } else fieldValue = tableRow[key];
                          break;
                        case FIELD_TYPE.LINK:
                          if (isArray(tableRow[key]) && !(field?.read_only)) {
                            fieldValue = tableRow[key].map((link) => { return { link_text: link?.link_text || '', link_url: link?.link_url || '', isEditEnabled: (!isEmpty(link?.link_text) && !isEmpty(link?.link_url)) }; });
                          } else fieldValue = tableRow[key];
                          break;
                        default:
                        fieldValue = tableRow[key];
                      }
                      tableRow[key] = fieldValue;
                    }
              });
              return tableRow;
            });
            // To make sure all the columns were availble in the each row of the current table .
            modifiedTableData = modifiedTableData.map((rowData) => {
              const fieldKeys = {};
              eachField?.columns?.forEach((field) => {
                jsUtils.set(fieldKeys, [field.field_uuid], null);
              });

              return {
                ...fieldKeys, // null values for fields which doesn't have any value
                ...rowData, // field values
                temp_row_uuid: uuidv4(),
              };
            });
            // check whether this table data is already save or not(fresh task).
            fieldState = [{ [eachField.field_uuid]: modifiedTableData }];
          } else {
            let fieldValue = EMPTY_STRING;
            if (has(activeFormContent, [eachField.field_uuid])) {
              fieldValue = activeFormContent[eachField.field_uuid];
            } else if (has(eachField, 'default_value')) {
              if (eachField.field_type === FIELD_TYPE.CURRENCY) fieldValue = { ...eachField.default_value };
              else fieldValue = eachField.default_value;
            }
            fieldState = getDirectFieldUuidData(
              eachField,
              activeFormContent,
              fieldValue,
              environment_specific_default_currency,
              documentUrlDetails,
              (val) => getDataListPickerFieldFromActiveForm(val, eachField, section?.field_metadata),
            );
          }
          let tableUuid = null;
          // below code helps to construct table schema
          if (
            eachField.field_type === FIELD_TYPE.TABLE &&
            jsUtils.get(eachField, ['table_validations', 'add_new_row'], true)
          ) {
              tableUuid = eachField.field_uuid;
              const fieldKeys = {};
              // const isReadOnly = areAllColumnsListReadOnly(eachField.columns);
              // if (!isReadOnly &&
              if (
                ((isReadOnlyForm) ? !isEmpty(fieldState) : true)
              ) {
                  eachField?.columns?.forEach((field) => {
                  if (field.field_type === FIELD_TYPE.CHECKBOX) {
                    jsUtils.set(
                      fieldKeys,
                      [field.field_uuid],
                      jsUtils.get(field, ['default_value'], null),
                    );
                  } else if (field.field_type === FIELD_TYPE.CURRENCY) {
                    const value = jsUtils.get(field, ['default_value', 'value'], null);
                    if (!isNull(value) && isFiniteNumber(Number(value))) {
                      jsUtils.set(fieldKeys, [field.field_uuid], {
                        value: jsUtils.get(field, ['default_value', 'value'], null),
                        currency_type: jsUtils.get(
                          field,
                          ['default_value', 'currency_type'],
                          ) || getCurrencyFromAllowedCurrencyTypes(field, environment_specific_default_currency) ||
                          DEFAULT_CURRENCY_TYPE,
                      });
                    } else {
                      jsUtils.set(fieldKeys, [field.field_uuid], null);
                    }
                  } else {
                    jsUtils.set(
                      fieldKeys,
                      [field.field_uuid],
                      jsUtils.get(field, ['default_value'], null),
                    );
                  }
                  });
                  tableSchema[tableUuid] = fieldKeys;
                  if (jsUtils.isEmpty(activeFormContent[tableUuid])) {
                    // const table_empty_row_data = { ...(tableSchema[tableUuid]), temp_row_uuid: uuidv4() };
                    fieldState = [{ [tableUuid]: [] }];
                  }
              } else {
                if (jsUtils.isEmpty(activeFormContent[tableUuid])) {
                  fieldState = [{ [tableUuid]: [] }];
                } else {
                  tableSchema[tableUuid] = {};
                }
              }
          } else if (eachField.field_type === FIELD_TYPE.TABLE) {
              tableUuid = eachField.field_uuid;
              tableSchema[tableUuid] = {};
          }
          return fieldState;
        });
        return fieldListState;
      });

      // construct final form state data.
      formState.forEach((fields) => {
        if (fields) {
          const keys = Object.keys(fields);
          keys.forEach((key) => {
            finalFormState[key] = fields[key];
          });
        }
      });
    }
    finalFormState.tableSchema = jsUtils.cloneDeep(tableSchema);
    return finalFormState;
  } catch (error) {
    console.log('finalFormState error', error);
  }
};

export const onReviewersRemoveHandler = (reviewers_, id, dispatch) => {
  // const reviewers = cloneDeep(reviewers_);
  if (reviewers_ && reviewers_.teams) {
    if (jsUtils.find(reviewers_.teams, { _id: id })) {
      jsUtils.remove(reviewers_.teams, { _id: id });
      if (reviewers_.teams.length === 0) delete reviewers_.teams;
    }
  }
  if (reviewers_ && reviewers_.users) {
    if (jsUtils.find(reviewers_.users, { _id: id })) {
      jsUtils.remove(reviewers_.users, { _id: id });
      if (reviewers_.users.length === 0) delete reviewers_.users;
    }
  }
  dispatch(taskContentDataChange({ reviewers_ }));
};

export const onReviewersSelectHandler = (reviewers_, eventObject, dispatch, action_error_list = {}) => {
  const team_or_user = eventObject.target.value;
  if (team_or_user.is_user) {
    if (reviewers_ && reviewers_.users) {
      if (!jsUtils.find(reviewers_.users, { _id: team_or_user._id })) {
        reviewers_.users.push(team_or_user);
      }
    } else {
      reviewers_.users = [];
      reviewers_.users.push(team_or_user);
    }
  } else if (!team_or_user.is_user) {
    if (reviewers_ && reviewers_.teams) {
      if (!jsUtils.find(reviewers_.teams, { _id: team_or_user._id })) {
        reviewers_.teams.push(team_or_user);
      }
    } else {
      reviewers_.teams = [];
      reviewers_.teams.push(team_or_user);
    }
  }
  jsUtils.unset(action_error_list, 'reviewers_search_value');
  dispatch(taskContentDataChange({ action_error_list, reviewers_ }));
};

export const onPrecedingStepsChangeHandler = (send_back_task_id, send_back_task_steps, value, label, dispatch, action_error_list = {}) => {
  const sendBackId = cloneDeep(send_back_task_id) || [];
  const sendBackSteps = cloneDeep(send_back_task_steps) || [];
  const index = sendBackId.findIndex((_id) => _id === value);
  if (index > -1) {
    sendBackId.splice(index, 1);
    sendBackSteps.splice(index, 1);
  } else {
    sendBackId.push(value);
    sendBackSteps.push(label);
  }
  jsUtils.unset(action_error_list, 'preceding_steps_value');
  dispatch(taskContentDataChange({ action_error_list, send_back_task_id: sendBackId, send_back_task_steps: sendBackSteps }));
};

export const onReviewersSearchHandler = (event, dispatch) => {
  dispatch(taskContentDataChange({ reviewersSearchValue: event.target.value }));
};

export const isFlowTask = () => {
  const { flow_id = '' } =
    store.getState().TaskContentReducer.active_task_details.task_log_info;
  if (flow_id) return true;
  return false;
};

export const getTaskStatusLabel = (taskStatus, isResponseCard = false) => {
  if (taskStatus === TASK_STATUS_TYPES.COMPLETED) return TIME_LABEL.COMPLETED;
  if (taskStatus === TASK_STATUS_TYPES.CANCELLED) return TIME_LABEL.CANCELLED;
  if (taskStatus === TASK_STATUS_TYPES.ASSIGNED && isResponseCard) return TIME_LABEL.YET_TO_ACCEPT;
  if (taskStatus === TASK_STATUS_TYPES.ACCEPTED || taskStatus === TASK_STATUS_TYPES.ASSIGNED) return TIME_LABEL.IN_PROGRESS;
  return TIME_LABEL.CLOSED;
};

export const getActiveTaskDetail = (state) => {
  const { activeTaskId, active_tasks_list } = state;
  let activeTaskList = [];

  if (!jsUtils.isEmpty(active_tasks_list.open)) {
    activeTaskList = [...active_tasks_list.open];
  }
  if (!jsUtils.isEmpty(active_tasks_list.completed)) {
    activeTaskList = [...active_tasks_list.completed];
  }

  if (!jsUtils.isEmpty(activeTaskId)) {
    let activeTask = null;
    if (Array.isArray(active_tasks_list)) {
      activeTask = active_tasks_list.find((task) => task._id === activeTaskId);
    } else {
      activeTask = activeTaskList.find((task) => task._id === activeTaskId);
    }

    return activeTask;
  }
  return null;
};

export const replaceNullWithNA = (value) => value || 'N/A';

export const getTaskActionFieldsData = (
  activeTaskDetails,
  documentUrlDetails,
) => {
  const { attachments = [], comments } = activeTaskDetails;

  const taskActionUploadData = {};
  const nonFormFiles = {};

  attachments && !jsUtils.isNull(attachments) && attachments.forEach((eachId) => {
    nonFormFiles[eachId] = eachId;
    const document = jsUtils.find(documentUrlDetails, {
      document_id: eachId,
    });
    if (document && document.original_filename) {
      taskActionUploadData[eachId] = {
        fileName: getFileNameFromServer(document.original_filename),
        file: {
          name: getFileNameFromServer(document.original_filename),
          type: document.original_filename.content_type,
          url: document.signedurl,
        },
        url: document.signedurl,
        status: FILE_UPLOAD_STATUS.SUCCESS,
        fileId: eachId,
      };
    }
  });

  return {
    ...(comments && { comments }),
    ...(attachments && { attachments }),
    taskActionUploadData,
    nonFormFiles,
  };
};

export default getStateVariables;

export const getFlowFieldFromActiveForm = (
  documentId,
  documentDetails,
  fieldUuid,
) => {
  console.log('documentIddocumentId', documentId, fieldUuid);
  if (!documentId || (documentId && documentId[0] && typeof documentId[0] !== 'string')) return;

  // const [docId] = documentId;
 const document = [];
 documentDetails && documentDetails.forEach((eachDocument) => {
  if (documentId && documentId.includes(eachDocument.document_id)) {
    console.log('eachDocumentcheck', documentId, documentId.indexOf(eachDocument.document_id));
    document.push(eachDocument);
  }
});
  // const document = documentDetails?.find((currentDoc) => {
  //   if (docId === currentDoc.document_id) {
  //     return true;
  //   }
  // });
  const documentFieldValue = [];
  document.forEach((eachDocument) => {
    if (eachDocument && eachDocument.original_filename) {
      documentFieldValue.push(
        {
          fileName: getFileNameFromServer(eachDocument.original_filename),
          link: eachDocument.signedurl,
          id: eachDocument.document_id,
          status: FILE_UPLOAD_STATUS.SUCCESS,
          file: {
            name: getFileNameFromServer(eachDocument.original_filename),
            type: eachDocument.original_filename.content_type,
            url: eachDocument.signedurl,
          },
          url: eachDocument.signedurl,
          fileId: fieldUuid,
        },
      );
    }
  });
  return document
    ? documentFieldValue
    : null;
};

export const getIsFlowBasedTask = (active_task_details) => active_task_details &&
  active_task_details.task_log_info &&
  !jsUtils.isEmpty(active_task_details.task_log_info.flow_id);

export const getTaskBasicDetails = (taskMetadata, selectedCardTab, active_task_details, isLoading) => {
  // assigned on
  console.log('### getTaskBasicDetails', taskMetadata, active_task_details);
  const assignedOn = getAssignedOn(taskMetadata, selectedCardTab, active_task_details, isLoading);
  const dueDate = getDueDate(taskMetadata, active_task_details, isLoading);
  // initiated by
  const initiatorName = getInitiatorName(active_task_details, isLoading);
  // assigned by
  const publisherName = getPublisherName(taskMetadata, active_task_details, isLoading, true);
  const taskName = getTaskName(isLoading, active_task_details, taskMetadata);
  return {
    assignedOn,
    dueDate,
    initiatorName,
    publisherName,
    taskName,
  };
};

export const getFlowNavLinkInfo = (metadata_info, task_log_info, taskCategory) => {
  let flowId = null;
  let flowUUID = null;
  let instanceId = null;
  let showNavLink = taskCategory === TASK_CATEGORY_FLOW_TASK;
  let referenceId = null;
  if (taskCategory === TASK_CATEGORY_FLOW_TASK) {
      flowId = task_log_info && jsUtils.get(task_log_info, ['flowId']);
      flowUUID = task_log_info && jsUtils.get(task_log_info, ['flow_uuid']);
      instanceId = task_log_info && jsUtils.get(task_log_info, ['instance_id']);
  } else {
      flowId = metadata_info && jsUtils.get(metadata_info, ['flow_id']);
      flowUUID = metadata_info && jsUtils.get(metadata_info, ['flow_uuid']);
      instanceId = metadata_info && jsUtils.get(metadata_info, ['flow_instance_id']);
      showNavLink = metadata_info && jsUtils.get(metadata_info, ['is_parent_accessible']);
  }
  referenceId = showNavLink && metadata_info && jsUtils.get(metadata_info, ['instance_identifier']);
  return {
    flowId,
    flowUUID,
    instanceId,
    showNavLink,
    referenceId,
  };
};

export const getDatalistNavLinkInfo = (metadata_info) => {
  const dataListId = metadata_info && jsUtils.get(metadata_info, ['data_list_id']);
  const dataListUUID = metadata_info && jsUtils.get(metadata_info, ['data_list_uuid']);
  const instanceId = metadata_info && jsUtils.get(metadata_info, ['data_list_entry_id']);
  const showNavLink = metadata_info && jsUtils.get(metadata_info, ['is_parent_accessible']);
  const referenceId = showNavLink && metadata_info && jsUtils.get(metadata_info, ['data_list_entry_identifier']);
  return {
    dataListId,
    dataListUUID,
    instanceId,
    showNavLink,
    referenceId,
  };
};

export const showReplicateTask = (metadata_info, selectedCardTab) => {
  const userDetails = getUserProfileData();
  console.log('showReplicateTask', selectedCardTab, metadata_info, metadata_info && jsUtils.get(metadata_info, ['is_parent_accessible']));
  if (selectedCardTab === 3) return true;
  else if (selectedCardTab === 1) {
      if (metadata_info &&
        jsUtils.get(metadata_info, ['published_by']) &&
        jsUtils.get(metadata_info, ['published_by'])._id === userDetails.id) return true;
      else return false;
  }
};

export const validateInvalidReviewers = (reviewers) => {
  const users = get(reviewers, 'users', []);
  const teams = get(reviewers, 'teams', []);

  const userTeams = [...users, ...teams];

  let isInvalidReviewers = false;

  userTeams?.map((eachUserTeam) => {
    if (eachUserTeam?.is_invalid_assignee) isInvalidReviewers = true;
    return null;
  });

  return isInvalidReviewers;
};

export const TASK_NO_ACCESS = (translate) => {
  return {
    title: translate('task_content.server_errors.task_no_access.title'),
    subTitle: translate('task_content.server_errors.task_no_access.sub_title'),
    type: COMMON_SERVER_ERROR_TYPES.UNAUTHORIZED,
  };
};

export const TASK_UNAUTHORIZED = (translate) => {
  return {
    title: translate('task_content.server_errors.unauthorized_access.title'),
    subTitle: translate('task_content.server_errors.unauthorized_access.sub_title'),
    type: COMMON_SERVER_ERROR_TYPES.UNAUTHORIZED,
  };
};

export const ARIA_LABEL = {
  UNAUTHORIZED: 'Unauthorized',
};

export const TASK_NOT_EXIST = (translate) => {
  return {
    title: translate('task_content.server_errors.task_not_exist.title'),
    type: COMMON_SERVER_ERROR_TYPES.NOT_EXIST,
  };
};
