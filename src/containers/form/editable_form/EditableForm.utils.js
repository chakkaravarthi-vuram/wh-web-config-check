import { v4 as uuidv4 } from 'uuid';
import { FIELD_TYPE, PROPERTY_PICKER_ARRAY } from '../../../utils/constants/form.constant';
import { RESPONSE_FIELD_KEYS, RESPONSE_VALIDATION_KEYS } from '../../../utils/constants/form/form.constant';
import { cloneDeep, compact, get, has, isBoolean, isEmpty, isFiniteNumber, isNull, isPlainObject, set, unset } from '../../../utils/jsUtility';
import { EMPTY_STRING } from '../../../utils/strings/CommonStrings';
import { FIELD_ACTION, FIELD_VISIBILITY_TYPE, ROW_IDENTIFIER, TABLE_ACTIONS } from '../Form.string';
import { SELECT_ALL_OPTION } from '../sections/form_field/FormField.string';
import { constructFileUpload, getDataListPickerFieldFromActiveForm } from '../../landing_page/my_tasks/task_content/TaskContent.utils';
import { LINK_FIELD_PROTOCOL, MODULE_TYPES } from '../../../utils/Constants';
import { VISIBILITY_TYPES } from '../form_builder/form_footer/FormFooter.constant';
import { CHECKBOX_SELECT_ALL } from '../../../components/form_builder/FormBuilder.strings';
import { getExtensionFromFileName } from '../../../utils/generatorUtils';
import { getTableColumnsFromFields } from '../form_builder/form_body/FormBody.utils';
import { FIELD_TYPES } from '../sections/field_configuration/FieldConfiguration.strings';

// tableUtils = { tableUUID: null, rowId: null, tempId: null }
export const formatData = (field, value, action, formData = {}, options = {}) => {
  const fieldType = field[RESPONSE_FIELD_KEYS.FIELD_TYPE];
  const fieldUUID = field[RESPONSE_FIELD_KEYS.FIELD_UUID];
  const isTableField = field?.[RESPONSE_FIELD_KEYS.FIELD_LIST_TYPES] === FIELD_TYPE.TABLE;
  const { tableUUID, rowIndex } = options;
  let updatedValue = value;
  const updatedOptions = {};

  // console.log('xyz formatData', { field, value, action, formData, options });
  switch (fieldType) {
    case FIELD_TYPE.CHECKBOX: {
      const optionList = field[RESPONSE_FIELD_KEYS.VALUES] || [];
      let consolidatedValue = isTableField
        ? get(cloneDeep(formData), [tableUUID, rowIndex, fieldUUID], []) || []
        : get(cloneDeep(formData), [fieldUUID], []) || [];
      if (value === SELECT_ALL_OPTION.value) {
        const optionValues = optionList.map((list) => list.value);
        if (consolidatedValue.length === optionValues.length) {
          consolidatedValue = [];
        } else consolidatedValue = optionValues;
      } else {
        if (consolidatedValue.includes(value)) {
          const index = consolidatedValue.findIndex((v) => v === value);
          if (index > -1) consolidatedValue.splice(index, 1);
        } else {
          consolidatedValue.push(value);
        }
      }
      updatedValue = consolidatedValue;
      break;
    }
    case FIELD_TYPE.USER_TEAM_PICKER: {
      const userTeams = isTableField
        ? get(cloneDeep(formData), [tableUUID, rowIndex, fieldUUID], {
          users: [],
        }) || {}
        : get(cloneDeep(formData), [fieldUUID], {
          users: [],
        }) || {};
      if (action === FIELD_ACTION.SELECT) {
        if (value?.is_user) {
          const exists = (userTeams?.users || []).find((u) => u._id === value._id);
          if (isEmpty(exists)) userTeams.users = [...(userTeams?.users || []), value];
        } else {
          const exists = (userTeams?.teams || []).find((u) => u._id === value._id);
          if (isEmpty(exists)) userTeams.teams = [...(userTeams?.teams || []), value];
        }
      } else if (action === FIELD_ACTION.REMOVE) {
        userTeams.users = (userTeams?.users || []).filter((u) => u._id !== value);
      }
      updatedValue = userTeams;
      break;
    }
    case FIELD_TYPE.FILE_UPLOAD: {
      const { document = {}, fileId = EMPTY_STRING } = options;
      if (action === FIELD_ACTION.FILE_ADD) {
        updatedValue = value;
        updatedOptions.document = document;
      } else if (action === FIELD_ACTION.FILE_REMOVE) {
        updatedValue = null;
        updatedOptions.removeIndex = value;
        updatedOptions.removedFileId = fileId;
      }
      return { updatedValue, updatedOptions };
    }
    case FIELD_TYPE.TABLE: {
      const existingRows = cloneDeep(formData[fieldUUID]) || [];
      if (action === FIELD_ACTION.TABLE_ADD_ROW) {
        const newRow = {};
        updatedValue = [...existingRows, newRow];
      } else if (action === FIELD_ACTION.TABLE_REMOVE_ROW) {
        const { rowIndex } = options;
        existingRows.splice(rowIndex, 1);
        updatedValue = existingRows;
      }
      break;
    }
    case FIELD_TYPE.DATA_LIST:
      let datalistEntries = isTableField
        ? get(cloneDeep(formData), [tableUUID, rowIndex, fieldUUID], []) || []
        : get(cloneDeep(formData), [fieldUUID], []) || [];
      if (action === FIELD_ACTION.SELECT) {
        if (!datalistEntries?.find((eachEntry) => eachEntry?.id === value?.id)) {
          datalistEntries.push(value);
        }
      } else if (action === FIELD_ACTION.REMOVE) {
        datalistEntries = datalistEntries?.filter((eachEntry) => eachEntry?.id !== value);
      }
      updatedValue = datalistEntries;
      break;
    case FIELD_TYPE.LINK:
      if ((value.length === 1 && isEmpty(value[0]?.link_text) && isEmpty(value[0]?.link_url)) && action === FIELD_ACTION.EDIT) {
        updatedValue = [];
      } else updatedValue = value;
      break;
    default:
      updatedValue = value;
      break;
  }

  // Table Field
  if (isTableField) {
    const existingData = cloneDeep(formData?.[tableUUID] || []);
    const rowData = existingData?.[rowIndex || 0] || {};
    rowData[fieldUUID] = updatedValue;
    existingData[rowIndex || 0] = rowData;
    updatedValue = existingData;
  }

  return { updatedValue: cloneDeep(updatedValue), updatedOptions };
};

const getCurrencyFormattedData = (value) => {
  const updatedValue = {
    currency_type: value.currency_type,
    value: Number(value.value.toString().replace(/,/g, '')),
  };
  return updatedValue;
};

const getLinkFormattedData = (value) => {
  if (isEmpty(value)) return [];
  const constructedValue = value?.map((link) => { return { link_text: link.link_text, link_url: link.link_url }; });
  return constructedValue.map((link) => {
    if (link?.link_url) {
      link.link_url = link.link_url.trim();
      if (link.link_url.includes(':/') || link.link_url.includes('://')) {
        return link;
      } else {
        link.link_url = `${LINK_FIELD_PROTOCOL.HTTP}${link.link_url}`;
        return link;
      }
    }
    return link;
  });
};

// Task Validation Construction Utils
const formatDataForValidation = (value, field, isSubmission = false) => {
  const fieldType = field[RESPONSE_FIELD_KEYS.FIELD_TYPE];
  switch (fieldType) {
    case FIELD_TYPE.USER_TEAM_PICKER: {
      if ((get(value, ['users', 'length'], 0) + get(value, ['teams', 'length'], 0)) > 0) {
        const updatedValue = {};
        if (value?.users?.length) updatedValue.users = value.users.map((u) => u._id);
        if (value?.teams?.length) updatedValue.teams = value.teams.map((u) => u._id);
       return updatedValue;
      } return isSubmission ? null : {};
    }
    case FIELD_TYPE.DATA_LIST: {
      if (isSubmission) {
        if (isEmpty(value)) return null;
        return value?.map((eachValue) => eachValue?.id);
      }
      return Array.isArray(value) ? value?.map((eachValue) => eachValue?.id) : [];
    }

    case FIELD_TYPE.LINK:
      if (isSubmission) {
        if (isEmpty(value)) return null;
        return getLinkFormattedData(value);
      }
      return getLinkFormattedData(value);
    case FIELD_TYPE.CHECKBOX:
      if (isSubmission && isEmpty(value)) return null;
      const choiceValuesList = field?.[RESPONSE_FIELD_KEYS.CHOICE_VALUES]?.map((choice) => choice.value);
      const modifiedValues = value?.filter((eachValue) => choiceValuesList?.includes(eachValue));
      const isChoiceValueTypeDate = field[RESPONSE_FIELD_KEYS.CHOICE_VALUE_TYPE] === 'date';
      if (Array.isArray(modifiedValues) && isSubmission && isChoiceValueTypeDate) {
        return modifiedValues?.map((eachValue) => eachValue?.substring(0, 10));
      }

      if (Array.isArray(modifiedValues)) {
        return modifiedValues.filter((data) => data !== CHECKBOX_SELECT_ALL.VALUE);
      }
      return [];
    case FIELD_TYPE.PHONE_NUMBER:
      if (value?.phone_number && value?.country_code) {
        return {
          phone_number: value.phone_number,
          country_code: value.country_code,
        };
      }
      return null;
    case FIELD_TYPE.DROPDOWN:
    case FIELD_TYPE.RADIO_GROUP: {
      const isChoiceValueTypeDate = field[RESPONSE_FIELD_KEYS.CHOICE_VALUE_TYPE] === 'date';
      if (isSubmission) {
        if ([EMPTY_STRING, null].includes(value)) return null;
        else if (isChoiceValueTypeDate) return value?.substring(0, 10);
      }
      return value;
    }

    case FIELD_TYPE.FILE_UPLOAD:
      let fileUploadValidationObject = [];
      const stabilizedValue = Array.isArray(value) ? value : [];
      if (isSubmission) {
        if (isEmpty(stabilizedValue)) return null;
        fileUploadValidationObject = stabilizedValue.map((f) => f.documentId || f.id);
      } else {
        if (!isEmpty(stabilizedValue)) {
          stabilizedValue.forEach((eachFile) => {
            if (eachFile) {
              fileUploadValidationObject.push({
                type: getExtensionFromFileName(get(eachFile, ['file', 'name'], '')),
                size: get(eachFile, ['file', 'size'], ''),
              });
            }
          });
        }
      }
      return fileUploadValidationObject;

    case FIELD_TYPE.NUMBER:
      if (isEmpty(value?.toString())) return null;
      const updatedValue = Number(value.toString().replace(/,/g, ''));
      return updatedValue;

    case FIELD_TYPE.CURRENCY:
      // if (isSubmission) {
        if (value?.currency_type && value?.value) {
          return getCurrencyFormattedData(value);
        }
        return null;
      // }
      // break;
    case FIELD_TYPE.INFORMATION: return value;
    // default: return !isEmpty(value) ? value : null;
    default: return !isFiniteNumber(value) && !isBoolean(value) && isEmpty(value) ? null : value;
  }
  // return value;
};

export const formatTableData = (data = [], tableField, fields = {}, formVisibility, isSubmission) => {
  const tableData = data.flatMap((eachRow, rowIndex) => {
    let isConsiderEmptyRow = true;
    const validations = tableField[RESPONSE_FIELD_KEYS.VALIDATIONS];
    const allowModifyExistingRow = get(validations, [RESPONSE_VALIDATION_KEYS[FIELD_TYPE.TABLE].ALLOW_MODIFY_EXISTING], false);

    const { visible_fields = {}, visible_disable_fields = {} } = formVisibility;

    // If editing existing row is disabled, no need to validate it.
    if (
      (!allowModifyExistingRow && isEmpty(eachRow?.id)) ||
      allowModifyExistingRow
    ) {
       Object.keys(eachRow).forEach((eachColumnKey) => {
          const isDisableField = get(visible_disable_fields, [tableField?.[RESPONSE_FIELD_KEYS.FIELD_UUID], rowIndex, eachColumnKey], false);
          const isVisibleField = visible_fields?.[eachColumnKey] || false;
          const field = get(fields, [eachColumnKey], {});

          const visibilityType = get(field, [RESPONSE_FIELD_KEYS.IS_VISIBLE], false) ? VISIBILITY_TYPES.HIDE : VISIBILITY_TYPES.DISABLE;

          const isFieldShowWhenRule = get(field, [RESPONSE_FIELD_KEYS.IS_FIELD_SHOW_WHEN_RULE], null);

          const allowFieldValidation = (
            !isFieldShowWhenRule ||
            (visibilityType === VISIBILITY_TYPES.HIDE && isVisibleField) ||
            (visibilityType === VISIBILITY_TYPES.DISABLE && !isDisableField)
          );

          if (
            !isEmpty(field) &&
            allowFieldValidation
            // ![null, EMPTY_STRING].includes(eachRow[eachColumnKey])
          ) {
              if (!field[RESPONSE_FIELD_KEYS.READ_ONLY]) {
                // no need to validate Read only fields
                isConsiderEmptyRow = false;
                const formattedData = formatDataForValidation(eachRow?.[eachColumnKey], field, isSubmission);
                // if ((isSubmission && !isNull(formattedData)) || !isSubmission) {
                  set(eachRow, [eachColumnKey], formattedData);
                // } else {
                //   unset(eachRow, [eachColumnKey]);
                // }
              } else {
                unset(eachRow, [eachColumnKey]);
              }
          } else if ([ROW_IDENTIFIER.ID].includes(eachColumnKey)) {
            isConsiderEmptyRow = false;
          } else if (
              eachRow[eachColumnKey] == null ||
              eachRow[eachColumnKey] !== EMPTY_STRING
          ) {
            unset(eachRow, [eachColumnKey]);
          }

          if (
              !isSubmission &&
              !isEmpty(field) && (
                visibilityType === VISIBILITY_TYPES.DISABLE ||
                visible_fields[eachColumnKey]
              )
            ) {
            if (!allowFieldValidation) isConsiderEmptyRow = false;
            eachRow[`is_hidden_${eachColumnKey}`] = !allowFieldValidation;
            }
       });
    }
    return isConsiderEmptyRow ? [{}] : eachRow;
  });

  return tableData;
};

const constructReadOnlyTableData = (value = []) => {
   const clonedValue = Array.isArray(value) ? value : [];

   const consolidatedValue = clonedValue.map((eachValue) => {
      if (eachValue?._id) return { _id: eachValue?._id };
      return null;
   });

   return compact(consolidatedValue);
};

export const formatFormData = (formData, fields, formVisibility, isSubmission = false) => {
  const formattedData = {};

  Object.keys(formData || {}).forEach((uuid) => {
    if (uuid === 'tableSchema') return;

    const value = cloneDeep(formData[uuid]);
    const field = fields[uuid];
    const visibility = (field[RESPONSE_FIELD_KEYS.FIELD_TYPE] === FIELD_TYPE.TABLE) ? formVisibility?.visible_tables : formVisibility?.visible_fields;

    if (field?.[RESPONSE_FIELD_KEYS.READ_ONLY] || !visibility?.[uuid]) return; // Return no value if readonly or not visible.
    if (field?.[RESPONSE_FIELD_KEYS.FIELD_TYPE] === FIELD_TYPE.INFORMATION) return;

    // if (!isFiniteNumber(value) && !isBoolean(value) && isEmpty(value)) {
    //   // formattedData[uuid] = null;
    //   return;
    // }

    if (field[RESPONSE_FIELD_KEYS.FIELD_TYPE] === FIELD_TYPE.TABLE) {
      // Check the all the field inside the table are readonly.
      const availableColumns = getTableColumnsFromFields(field?.[RESPONSE_FIELD_KEYS.FIELD_UUID], fields);
      const isAllColumnReadOnly = (Array.isArray(availableColumns) ? availableColumns : [])?.every((eachColumn) => eachColumn?.[RESPONSE_FIELD_KEYS.READ_ONLY]);

      // ReadOnly Table are not allowed to be a part of post/validation data.
      if (isAllColumnReadOnly) {
         const readonlyTableValue = isSubmission ? constructReadOnlyTableData(value) : [];
         if (!isEmpty(readonlyTableValue)) {
           formattedData[uuid] = readonlyTableValue;
         }
      } else {
        formattedData[uuid] = formatTableData(value, field, fields, formVisibility, isSubmission);
      }
    } else {
      const fieldData = formatDataForValidation(value, field, isSubmission);
      formattedData[uuid] = fieldData;
    }
  });
  return formattedData;
};

const combineDisableFields = (localDisableFields = {}, responseDisableFields = {}) => {
  const disableFields = cloneDeep(localDisableFields);
  Object.keys(responseDisableFields).forEach((eachFieldUUID) => {
       const value = responseDisableFields[eachFieldUUID];
       if (Array.isArray(value)) {
         const tableValue = value.map((eachRow, rowIndex) => combineDisableFields(
           get(localDisableFields, [eachFieldUUID, rowIndex], {}),
           eachRow));
         disableFields[eachFieldUUID] = tableValue;
       } else {
         disableFields[eachFieldUUID] = value;
       }
  });
  return disableFields;
 };

export const combineFormVisibility = (visibility1, visibility2) => {
  const updatedVisibility = {};
  updatedVisibility.visible_disable_fields = combineDisableFields(
    get(visibility1, 'visible_disable_fields', {}),
    get(visibility2, 'visible_disable_fields', {}),
  );

  updatedVisibility.visible_fields = {
    ...get(visibility1, 'visible_fields', {}),
    ...get(visibility2, 'visible_fields', {}),
  };

  updatedVisibility.visible_sections = {
    ...get(visibility1, 'visible_sections', {}),
    ...get(visibility2, 'visible_sections', {}),
  };

  updatedVisibility.visible_tables = {
    ...get(visibility1, 'visible_tables', {}),
    ...get(visibility2, 'visible_tables', {}),
  };

  return updatedVisibility;
};

export const getFormattedDocumentDetails = (documentDetails, _removedDocList = [], fields = {}, formData = {}) => {
  if ((isEmpty(documentDetails) || isEmpty(documentDetails?.uploaded_doc_metadata)) && isEmpty(_removedDocList)) return {};
  const removedDocList = [..._removedDocList];
  const documents = [];
  const usedDocumentsIds = [];
  const fileUploadFields = Object.values(fields)
    .filter((f) => f[RESPONSE_FIELD_KEYS.FIELD_TYPE] === FIELD_TYPE.FILE_UPLOAD);

  // ETF-13198 - To prevent sending a unused document Id when saving/submitting a form
  fileUploadFields.forEach((field) => {
    const tableUUID = field[RESPONSE_FIELD_KEYS.TABLE_UUID];
    const fieldUUID = field[RESPONSE_FIELD_KEYS.FIELD_UUID];

    if (tableUUID) {
      const tableData = formData[tableUUID] || [];
      tableData.forEach((row, idx) => {
        if (row[fieldUUID]) {
          const fieldData = get(tableData, [idx, fieldUUID], []);
          usedDocumentsIds.push(...(fieldData.map((f) => f.documentId || f.id)));
        }
      });
      return;
    }

    // direct field
    if (formData[fieldUUID]) {
      const fieldData = formData[fieldUUID] || [];
      usedDocumentsIds.push(...(fieldData.map((f) => f.documentId || f.id)));
    }
  });

  documentDetails?.uploaded_doc_metadata?.forEach((doc) => {
    if (!removedDocList.includes(doc._id) && usedDocumentsIds.includes(doc._id)) {
      documents.push({
        upload_signed_url: doc?.upload_signed_url?.s3_key,
        type: doc.type,
        document_id: doc._id,
      });
    }
  });

  const data = {
    ...(!isEmpty(documents)) ? {
      uploaded_doc_metadata: documents,
      entity: documentDetails.entity,
      entity_id: documentDetails.entity_id,
      ref_uuid: documentDetails.ref_uuid,
    } : {},
    ...(!isEmpty(removedDocList)) ? { removed_doc_list: removedDocList } : {},
  };
  return { document_details: data };
};

const getPostDataByField = (field, value) => {
  switch (field[RESPONSE_FIELD_KEYS.FIELD_TYPE]) {
    case FIELD_TYPE.NUMBER:
      if (isEmpty(value?.toString())) return null;
      const updatedValue = Number(value.toString().replace(/,/g, ''));
      return updatedValue;
    case FIELD_TYPE.FILE_UPLOAD: {
      if (value) {
        return value.map((f) => f.documentId || f.id);
      }
      break;
    }
    case FIELD_TYPE.CURRENCY: {
      if (value?.currency_type && value?.value) {
        return getCurrencyFormattedData(value);
      }
      break;
    }
    case FIELD_TYPE.PHONE_NUMBER: {
      if (value?.phone_number && value?.country_code) {
        return value;
      }
      break;
    }
    case FIELD_TYPE.USER_TEAM_PICKER: {
      if (((value?.users?.length || 0) + (value?.teams?.length || 0)) > 0) {
        const updatedValue = {};
        if (value?.users?.length) {
          if (typeof value?.users?.[0] === 'string') updatedValue.users = value.users;
          else if (typeof value?.users?.[0] === 'object') updatedValue.users = value.users.map((u) => u._id);
        }
        if (value?.teams?.length) {
          if (typeof value?.teams?.[0] === 'string') updatedValue.teams = value.teams;
          else if (typeof value?.teams?.[0] === 'object') updatedValue.teams = value.teams.map((u) => u._id);
        }
        return updatedValue;
      }
      break;
    }

    case FIELD_TYPE.LINK: {
      if (isEmpty(value)) return null;
        return getLinkFormattedData(value);
    }
    case FIELD_TYPE.DATA_LIST: {
      if (typeof value?.[0] === 'string') return value;
      else if (typeof value?.[0] === 'object') return value?.map((eachValue) => eachValue?.id);
      break;
    }
    case FIELD_TYPE.DROPDOWN:
    case FIELD_TYPE.RADIO_GROUP: {
      if (field?.[RESPONSE_FIELD_KEYS.CHOICE_VALUE_TYPE] === 'date') {
        value = value?.substring(0, 10);
      }
      return value;
    }
    case FIELD_TYPE.CHECKBOX: {
      if (isEmpty(value)) return null;
      const choiceValuesList = field?.[RESPONSE_FIELD_KEYS.CHOICE_VALUES]?.map((choice) => choice.value);
      const modifiedValues = value?.filter((eachValue) => choiceValuesList?.includes(eachValue));
      const isChoiceValueTypeDate = field[RESPONSE_FIELD_KEYS.CHOICE_VALUE_TYPE] === 'date';
      if (Array.isArray(modifiedValues) && isChoiceValueTypeDate) {
        return modifiedValues?.map((eachValue) => eachValue?.substring(0, 10));
      }

      if (Array.isArray(modifiedValues)) {
        return modifiedValues.filter((data) => data !== CHECKBOX_SELECT_ALL.VALUE);
      }
      return [];
      // return value;
    }

    default: return value;
  }
  return null;
};

export const formatFormDataForSubmit = (formData, fields, formVisibility,
  isFormUpdates = false) => {
  const { visible_fields = {} } = formVisibility;
  const formattedData = {};
  Object.keys(formData || []).forEach((uuid) => {
    const value = formData[uuid];
    const field = fields[uuid];
    if (!visible_fields[uuid]) return;
    if (PROPERTY_PICKER_ARRAY.includes(field[RESPONSE_FIELD_KEYS.FIELD_TYPE])) return; // don't have to send value for property picker fields

    if (!isFiniteNumber(value) && !isBoolean(value) && !isFormUpdates && isEmpty(value)) {
      formattedData[uuid] = null;
      if (field[RESPONSE_FIELD_KEYS.FIELD_TYPE] === FIELD_TYPE.TABLE) {
        formattedData[uuid] = [];
      }
      return;
    }

    if (field[RESPONSE_FIELD_KEYS.FIELD_TYPE] === FIELD_TYPE.TABLE) {
      const updatedValue = [];
      value?.forEach((row) => {
        const formattedRowData = formatFormDataForSubmit(row, fields, formVisibility);
        if (row[ROW_IDENTIFIER.ID]) formattedRowData[ROW_IDENTIFIER.ID] = row[ROW_IDENTIFIER.ID];
        updatedValue.push(formattedRowData);
      });
      formattedData[uuid] = updatedValue;
    } else {
      const fieldValue = getPostDataByField(field, value);
      if (!isNull(fieldValue)) formattedData[uuid] = fieldValue;
      else formattedData[uuid] = null;
    }
  });
  return formattedData;
};

export const constructPostDataForTable = (field = {}, value = [], fieldList = [], formVisibility = {}, isFormUpdate = false, tableAction = null) => {
  const { FIELD_UUID, IS_VISIBLE, IS_FIELD_SHOW_WHEN_RULE, READ_ONLY } = RESPONSE_FIELD_KEYS;
  const { ID, TEMP_ROW_UUID } = ROW_IDENTIFIER;
  const {
    visible_disable_fields = {},
    visible_fields = {},
  } = formVisibility;

  const tableUUID = field[FIELD_UUID];

  const tableData = value.flatMap((eachRow, rowIndex) => {
    let isEmptyRow = true;
    let checkAllFieldsAreEditable = true;
    Object.keys(eachRow).forEach((eachColumnKey) => {
      const currentField = fieldList?.[eachColumnKey];
      const fieldType = currentField?.field_type;

      const isDisabled = get(visible_disable_fields, [tableUUID, rowIndex, eachColumnKey], false);
      const visibilityType = currentField?.[IS_VISIBLE] ? FIELD_VISIBILITY_TYPE.DISABLE : FIELD_VISIBILITY_TYPE.HIDE;
      const isFieldShowWhenRule = currentField?.[IS_FIELD_SHOW_WHEN_RULE];

      const isFieldValidatable = !isFieldShowWhenRule || (
        (visibilityType === FIELD_VISIBILITY_TYPE.DISABLE && visible_fields[eachColumnKey]) ||
        (visibilityType === FIELD_VISIBILITY_TYPE.HIDE && !isDisabled)
      );

      if (!isFieldValidatable) {
        if (![ID, TEMP_ROW_UUID].includes(eachColumnKey) && isEmpty(currentField)) {
          if (currentField?.[IS_VISIBLE] === false) {
            checkAllFieldsAreEditable = false;
          }
        }
        if (
          eachColumnKey !== ID &&
          (isFormUpdate ? eachColumnKey !== TEMP_ROW_UUID : true)
        ) {
          unset(eachRow, [eachColumnKey]);
        }

        if (eachColumnKey === ID) isEmptyRow = false;
      } else if (!isEmpty(currentField) && (eachRow[eachColumnKey] != null || isFormUpdate)) {
        if (!currentField[READ_ONLY]) {
          const data = getPostDataByField(currentField, eachRow[eachColumnKey]);
          if (!isFiniteNumber(data) && !isBoolean(data) && isEmpty(data)) {
            eachRow[eachColumnKey] = null;
          } else {
            isEmptyRow = false;
            eachRow[eachColumnKey] = data;
          }
        } else {
          checkAllFieldsAreEditable = false;
          if (
            eachColumnKey !== ID &&
            (isFormUpdate ? eachColumnKey !== TEMP_ROW_UUID : true)
          ) {
            unset(eachRow, [eachColumnKey]);
          }
        }
      } else if (eachRow._id) {
        const data = eachRow?.[eachColumnKey];
        if (data === null) unset(eachRow, [eachColumnKey]);

        isEmptyRow = false;
        if (data === EMPTY_STRING) eachRow[eachColumnKey] = null;

        if (fieldType && PROPERTY_PICKER_ARRAY.includes(fieldType) && data === null) {
          unset(eachRow, [eachColumnKey]);
        } else if (
          eachColumnKey !== ID &&
          (eachColumnKey === TEMP_ROW_UUID ? !isFormUpdate : currentField?.[READ_ONLY])) {
          unset(eachRow, [eachColumnKey]);
        }
      } else if (
        eachColumnKey !== ID &&
        (eachColumnKey === TEMP_ROW_UUID ? !isFormUpdate : currentField?.[READ_ONLY])) {
        checkAllFieldsAreEditable = false;
        unset(eachRow, [eachColumnKey]);
      }

      if (
        eachColumnKey === TEMP_ROW_UUID &&
        (isFormUpdate || TABLE_ACTIONS.includes(tableAction))
      ) isEmptyRow = false;
    });

    if (
      TABLE_ACTIONS.includes(tableAction) &&
      !isEmptyRow
    ) return eachRow;

    if (!checkAllFieldsAreEditable && isEmptyRow) return eachRow;
    return isEmptyRow ? [] : eachRow;
  });

  return tableData;
};

export const formatFormDataForVisibilityAndValueConfig = (
  formData,
  fields,
  formVisibility = {},
  // formMetaData = {},
  currentField = {},
  tableAction = null,
) => {
  const { visible_fields = {}, visible_tables = {} } = formVisibility;
  // const { dependentFields = [] } = formMetaData;
  const formattedData = {};

  Object.keys(formData || {}).forEach((uuid) => {
    const value = formData[uuid];
    const field = fields[uuid];
    const fieldType = field?.[RESPONSE_FIELD_KEYS.FIELD_TYPE];
    // const hasDLPropertyField = get(field, [RESPONSE_FIELD_KEYS.DATA_LIST_DETAILS, RESPONSE_FIELD_KEYS.HAS_PROPERTY_FIELD], false);
    // const hasUserPropertyField = get(field, [RESPONSE_FIELD_KEYS.HAS_PROPERTY_FIELD], false);

    // if (
    //   fieldType !== FIELD_TYPE.TABLE &&
    //   !dependentFields.includes(uuid) &&
    //   !hasDLPropertyField &&
    //   !hasUserPropertyField
    // ) return;
    if (!visible_fields?.[uuid]) return;

    if (fieldType === FIELD_TYPE.TABLE) {
      if (visible_tables?.[uuid]) {
        formattedData[uuid] = constructPostDataForTable(currentField, value, fields, formVisibility, true, tableAction);
      }
    } else {
      const fieldValue = getPostDataByField(field, value);
      if (!isNull(fieldValue)) formattedData[uuid] = fieldValue;

      if (!isFiniteNumber(fieldValue) && !isBoolean(fieldValue) && isEmpty(fieldValue)) {
        formattedData[uuid] = null;
      }
    }
  });
  return formattedData;
};

export const constructActiveFormDataFromResponse = (
  formData,
  fields,
  options = {},
) => {
  console.log('DL CONATRUCT', formData, fields, options);
  const updatedFormData = {};
  const { documentDetails = [] } = options;
  Object.keys(formData || {}).forEach((uuid) => {
    const fieldType = get(fields, [uuid, RESPONSE_FIELD_KEYS.FIELD_TYPE]);
    const referenceFieldType =
      ((fieldType === FIELD_TYPE.DATA_LIST_PROPERTY_PICKER) || (fieldType === FIELD_TYPE.USER_PROPERTY_PICKER)) &&
      get(fields, [uuid, RESPONSE_FIELD_KEYS.PROPERTY_PICKER_DETAILS, RESPONSE_FIELD_KEYS.REFERENCE_FIELD_TYPE]);
    const value = formData[uuid];
    if (!fieldType) return;
    if ((fieldType === FIELD_TYPE.FILE_UPLOAD) || (referenceFieldType === FIELD_TYPE.FILE_UPLOAD)) {
      updatedFormData[uuid] = constructFileUpload(documentDetails, value, { field_uuid: uuid });
    } else if ((fieldType === FIELD_TYPE.DATA_LIST)) {
      updatedFormData[uuid] = getDataListPickerFieldFromActiveForm(value) || null;
    } else if ((fieldType === FIELD_TYPE.TABLE)) {
      const updatedValue = [];
      (value || [])?.forEach((row) => {
        const rowData = constructActiveFormDataFromResponse(row, fields, options);
        updatedValue.push(rowData);
      });
      updatedFormData[uuid] = updatedValue;
    } else updatedFormData[uuid] = value;
  });

  return updatedFormData;
};

export const getPostDataForFormFieldsUpdate = (metaData, moduleType, field, formValues, tableAction, updatedRowUUID) => {
  const { FIELD_UUID, TABLE_UUID } = RESPONSE_FIELD_KEYS;
  let fieldUUID = null;
  let tableUUID = null;

  if (field[RESPONSE_FIELD_KEYS.FIELD_TYPE] === FIELD_TYPE.TABLE) {
    tableUUID = field[FIELD_UUID];
  } else {
    fieldUUID = field[FIELD_UUID];
    tableUUID = field?.[TABLE_UUID] || null;
  }

  const data = {
    field_details: formValues,
    form_uuid: metaData.formUUID,
    is_add_new: (tableAction === FIELD_ACTION.TABLE_ADD_ROW),
    is_button_visibility: true,
    is_table_default_value: true,
    validate: true,
  };

  if (updatedRowUUID) {
    data.temp_row_uuid = updatedRowUUID;
    data.table_uuid = tableUUID;
  } else if (tableUUID) {
    data.updated_table_field = tableUUID;
  }

  if (fieldUUID) {
    data.updated_field = fieldUUID;
  }

  if (moduleType === MODULE_TYPES.TASK) {
    data.instance_id = metaData.instanceId;
    if (metaData.stepId) data.step_id = metaData.stepId;
    else data.task_metadata_id = metaData.moduleId;
  } else if (moduleType === MODULE_TYPES.DATA_LIST) {
    data.data_list_id = metaData.moduleId;
    data.data_list_entry_id = metaData.instanceId || null;
  }

  // if (metaData.moduleId) {
  //   data.task_metadata_id = metaData.moduleId;
  // } else {
  //   data.step_id = metaData.stepId;
  // }

  return data;
};

export const getFormFieldUpdateResponse = (
  response = {},
  formData = {},
  fieldList = {},
  formVisibility = {},
) => {
  if (isEmpty(response)) return formData;
  const SELECTION_FIELD_TYPES = [FIELD_TYPE.RADIO_GROUP, FIELD_TYPE.CHECKBOX, FIELD_TYPE.DROPDOWN];

  // REQUEST
  const visibleFields = cloneDeep(get(formVisibility, ['visible_fields'], {}));
  const visibleTables = get(formVisibility, ['visible_tables'], {});
  const allTableUUID = compact(Object.keys(visibleTables));
  const documentDetails = get(response, ['document_url_details'], []);

  const defaultValues = get(response, ['fields', 'default_field_values'], {});
  const clonedFormData = cloneDeep(formData);
  if (!isEmpty(defaultValues)) {
    Object.keys(defaultValues).forEach((fieldKey) => {
      if (
        has(visibleFields, [fieldKey], false) ||
        has(visibleTables, [fieldKey], false)
      ) {
        if (allTableUUID.includes(fieldKey)) {
          const tableValue = defaultValues[fieldKey];
          if (Array.isArray(tableValue) && !isEmpty(tableValue)) {
            tableValue.forEach((eachRow, eachRowIndex) => {
              if (!isEmpty(eachRow)) {
                Object.keys(eachRow).forEach((eachColumnKey) => {
                  const field = fieldList[eachColumnKey];
                  const value = eachRow[eachColumnKey];
                  // Data List Field Handling
                  if (field?.[RESPONSE_FIELD_KEYS.FIELD_TYPE] === FIELD_TYPE.DATA_LIST) {
                    if (!isEmpty(value) && Array.isArray(value)) {
                      if (value.every((eachValue) => typeof eachValue === 'string')) { return; }
                    }
                      set(
                        clonedFormData,
                        [fieldKey, eachRowIndex, eachColumnKey],
                        getDataListPickerFieldFromActiveForm(value, field),
                    );
                  } else if ((field?.[RESPONSE_FIELD_KEYS.FIELD_TYPE] === FIELD_TYPE.FILE_UPLOAD) ||
                    (field?.[RESPONSE_FIELD_KEYS.PROPERTY_PICKER_DETAILS]?.[RESPONSE_FIELD_KEYS.REFERENCE_FIELD_TYPE] === FIELD_TYPE.FILE_UPLOAD)) {
                    set(
                      clonedFormData,
                      [fieldKey, eachRowIndex, eachColumnKey],
                      constructFileUpload(documentDetails, value, { field_uuid: field?.[RESPONSE_FIELD_KEYS.FIELD_UUID] }),
                    );
                  } else if ((field?.[RESPONSE_FIELD_KEYS.FIELD_TYPE] === FIELD_TYPE.CHECKBOX) ||
                      (field?.[RESPONSE_FIELD_KEYS.PROPERTY_PICKER_DETAILS]?.[RESPONSE_FIELD_KEYS.REFERENCE_FIELD_TYPE] === FIELD_TYPE.CHECKBOX)) {
                        let checkboxValue = value;
                        if ((field?.[RESPONSE_FIELD_KEYS.CHOICE_VALUE_TYPE] === FIELD_TYPE.DATE) && !isEmpty(value)) {
                          checkboxValue = value.map((v) => field?.[RESPONSE_FIELD_KEYS.CHOICE_VALUES]?.find((c) => c.value.startsWith(v))?.value);
                        }
                        set(
                        clonedFormData,
                        [fieldKey, eachRowIndex, eachColumnKey],
                        checkboxValue,
                      );
                  } else if ((field?.[RESPONSE_FIELD_KEYS.FIELD_TYPE] === FIELD_TYPE.RADIO_GROUP) ||
                      (field?.[RESPONSE_FIELD_KEYS.PROPERTY_PICKER_DETAILS]?.[RESPONSE_FIELD_KEYS.REFERENCE_FIELD_TYPE] === FIELD_TYPE.RADIO_GROUP) ||
                      (field?.[RESPONSE_FIELD_KEYS.FIELD_TYPE] === FIELD_TYPE.DROPDOWN) ||
                      (field?.[RESPONSE_FIELD_KEYS.PROPERTY_PICKER_DETAILS]?.[RESPONSE_FIELD_KEYS.REFERENCE_FIELD_TYPE] === FIELD_TYPE.DROPDOWN) ||
                      (field?.[RESPONSE_FIELD_KEYS.FIELD_TYPE] === FIELD_TYPE.CUSTOM_LOOKUP_DROPDOWN) ||
                      (field?.[RESPONSE_FIELD_KEYS.PROPERTY_PICKER_DETAILS]?.[RESPONSE_FIELD_KEYS.REFERENCE_FIELD_TYPE] === FIELD_TYPE.CUSTOM_LOOKUP_DROPDOWN)) {
                        console.log('dropdowndatetype', field, value);
                        let selectedValue = value;
                        if ((field?.[RESPONSE_FIELD_KEYS.CHOICE_VALUE_TYPE] === FIELD_TYPE.DATE) && !isEmpty(value)) {
                          const _value = field?.[RESPONSE_FIELD_KEYS.CHOICE_VALUES]?.find((c) => c.value.startsWith(value))?.value;
                          selectedValue = _value;
                        }
                        if (!field?.[RESPONSE_FIELD_KEYS.CHOICE_VALUES]?.find((eachValue) => (eachValue?.value || eachValue) === selectedValue)) selectedValue = null;
                        set(
                        clonedFormData,
                        [fieldKey, eachRowIndex, eachColumnKey],
                        selectedValue,
                      );
                  } else {
                    set(
                      clonedFormData,
                      [fieldKey, eachRowIndex, eachColumnKey],
                      value,
                    );
                  }
                });
              } else if (isPlainObject(eachRow) && isEmpty(eachRow)) {
                set(
                  clonedFormData,
                  [fieldKey, eachRowIndex],
                  eachRow,
                );
              }
            });
          } else if (Array.isArray(tableValue) && isEmpty(tableValue)) {
            set(
              clonedFormData,
              [fieldKey],
              tableValue,
            );
          }

          // if row from backend is lesser than row existing in frontend end, then trim it to backend row length.
          const tableValueLength = tableValue?.length || 0;
          if (
            // Array.isArray(tableValue) &&
            Array.isArray(clonedFormData[fieldKey]) &&
            tableValueLength < clonedFormData[fieldKey].length
          ) {
               set(clonedFormData, [fieldKey], clonedFormData[fieldKey].slice(0, tableValueLength));
          }
        } else {
          const field = fieldList[fieldKey];
          const value = defaultValues[fieldKey];

          // Data List Field Handling
          if (field?.[RESPONSE_FIELD_KEYS.FIELD_TYPE] === FIELD_TYPE.DATA_LIST) {
            if (!isEmpty(value) && Array.isArray(value)) {
              if (value.every((eachValue) => typeof eachValue === 'string')) { return; }
            }
            set(
              clonedFormData,
              [fieldKey],
              getDataListPickerFieldFromActiveForm(value, field),
            );
          } else if ((field?.[RESPONSE_FIELD_KEYS.FIELD_TYPE] === FIELD_TYPE.FILE_UPLOAD) ||
            (field?.[RESPONSE_FIELD_KEYS.PROPERTY_PICKER_DETAILS]?.[RESPONSE_FIELD_KEYS.REFERENCE_FIELD_TYPE] === FIELD_TYPE.FILE_UPLOAD)) {
            set(
              clonedFormData,
              [fieldKey],
              constructFileUpload(documentDetails, value, { field_uuid: field?.[RESPONSE_FIELD_KEYS.FIELD_UUID] }),
            );
          } else if (field[RESPONSE_FIELD_KEYS.FIELD_TYPE] === FIELD_TYPE.CHECKBOX) {
            let _value = value;
            if (field?.[RESPONSE_FIELD_KEYS.CHOICE_VALUE_TYPE] === FIELD_TYPE.DATE && !isEmpty(value)) {
               _value = value.map((v) => field?.[RESPONSE_FIELD_KEYS.CHOICE_VALUES]?.find((c) => c.value.startsWith(v))?.value);
            }
            set(clonedFormData, [fieldKey], _value);
          } else if (SELECTION_FIELD_TYPES.includes(field[RESPONSE_FIELD_KEYS.FIELD_TYPE])) {
            let _value = value;
            if (field?.[RESPONSE_FIELD_KEYS.CHOICE_VALUE_TYPE] === FIELD_TYPE.DATE) {
               _value = field[RESPONSE_FIELD_KEYS.CHOICE_VALUES]?.find((c) => c.value.split('T')[0] === value)?.value;
              if (!field?.[RESPONSE_FIELD_KEYS.CHOICE_VALUES]?.find((eachValue) => eachValue.value.startsWith(value))) _value = null;
            } else {
              if (!field?.[RESPONSE_FIELD_KEYS.CHOICE_VALUES]?.find((eachValue) => eachValue.value === value)) _value = null;
            }
            set(clonedFormData, [fieldKey], _value);
          } else {
            set(clonedFormData, [fieldKey], value);
          }
        }
      }
      if (allTableUUID.includes(fieldKey)) {
        const tableSchema = get(clonedFormData, ['tableSchema', fieldKey], {});
        if (!isEmpty(tableSchema)) {
          for (let rowIndex = get(clonedFormData, [fieldKey, 'length'], 0) - 1; rowIndex >= 0; rowIndex--) {
            if (!has(clonedFormData, [fieldKey, rowIndex, ROW_IDENTIFIER.TEMP_ROW_UUID], false)) {
            clonedFormData[fieldKey][rowIndex] = {
              ...(tableSchema || {}),
              ...(get(cloneDeep(clonedFormData), [fieldKey, rowIndex], {}) || {}),
              [ROW_IDENTIFIER.TEMP_ROW_UUID]: uuidv4(),
              };
            } else break;
          }
        } else {
          clonedFormData[fieldKey] = [...(defaultValues?.[fieldKey] || {})];
          if (
            !isEmpty(defaultValues[fieldKey]) &&
            !has(clonedFormData, [fieldKey, ROW_IDENTIFIER.TEMP_ROW_UUID], false)
          ) {
            clonedFormData[fieldKey].temp_row_uuid = uuidv4();
          }
          clonedFormData.tableSchema = {
            ...clonedFormData.tableSchema,
            ...{ [fieldKey]: defaultValues[fieldKey] },
          };
        }
      }
    });
  }
  return clonedFormData;
};

export const isAllFieldsInsideTableDisabled = (tableUUID, value = [], tableFields = [], formVisibility = {}) => {
  let isAllRowDisabled = true;

  const visibleDisableFields = formVisibility?.visible_disable_fields || {};
  const visibleFields = formVisibility?.visible_fields || {};

  const tableFields_ = Array.isArray(tableFields) ? tableFields : [];
  const singleRowSchema = {};
  tableFields_.forEach((eachField) => { singleRowSchema[eachField[RESPONSE_FIELD_KEYS.FIELD_UUID]] = null; });

  let clonedValue = Array.isArray(value) ? cloneDeep(value) : [];

  if (isEmpty(clonedValue)) clonedValue = [{}];

  for (let rowIdk = 0; rowIdk < clonedValue.length; rowIdk++) {
    let isRowDisabled = true;
    const allFieldKeys = Object.keys(singleRowSchema);
    for (let colIdk = 0; colIdk < allFieldKeys.length; colIdk++) {
      if (visibleFields?.[allFieldKeys[colIdk]]) {
       isRowDisabled = isRowDisabled && get(visibleDisableFields, [tableUUID, rowIdk, allFieldKeys[colIdk]], false);
      }
      if (!isRowDisabled) break;
    }
    isAllRowDisabled = isAllRowDisabled && isRowDisabled;
    if (!isAllRowDisabled) break;
  }

  return isAllRowDisabled;
};

export const isAllFieldsInsideTableReadOnly = (tableFields = [], formVisibility = {}) => {
  const visibleFields = formVisibility?.visible_fields || {};
  const tableFields_ = Array.isArray(tableFields) ? tableFields : [];
  return tableFields_.every((eachField) => {
    if (visibleFields?.[eachField?.[RESPONSE_FIELD_KEYS.FIELD_UUID]]) {
      return eachField?.[RESPONSE_FIELD_KEYS.READ_ONLY];
    }
    return true;
  });
};

export const getCancelTokenKeyForFormFieldUpdate = (field, tableUtility) => {
  let key = null;

  const fieldUUID = field?.[RESPONSE_FIELD_KEYS.FIELD_UUID];
  const tableUUID = field?.[RESPONSE_FIELD_KEYS.TABLE_UUID];
  const rowUUID = tableUtility?.[ROW_IDENTIFIER.TEMP_ROW_UUID];
  const action = tableUtility?.tableAction;

  if (field?.[RESPONSE_FIELD_KEYS.FIELD_TYPE] === FIELD_TYPES.TABLE) {
    if (action === FIELD_ACTION.TABLE_ADD_ROW) {
      key = `${fieldUUID},${FIELD_ACTION.TABLE_ADD_ROW}`;
    } else if (action === FIELD_ACTION.TABLE_REMOVE_ROW) {
      key = `${fieldUUID},${rowUUID},${FIELD_ACTION.REMOVE}`;
    }
  } else if (field?.[RESPONSE_FIELD_KEYS.FIELD_LIST_TYPES] === FIELD_TYPES.TABLE && field?.[RESPONSE_FIELD_KEYS.TABLE_UUID]) {
    key = `${tableUUID},${rowUUID},${fieldUUID}`;
  } else {
   key = fieldUUID;
  }
  return key;
};
