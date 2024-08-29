import { translate } from 'language/config';
import {
  bulkDataListEntryChange,
  bulkDataListEntryRowDelete,
  bulkDataListEntryValidationChange,
  bulkUploadCompleted,
  bulkUploadFailed,
  bulkUploadStarted,
  setBulkUploadValidationMessage,
} from '../reducer/BulkUploadReducer';

import jsUtils from '../../utils/jsUtility';
import { DOCUMENT_TYPES, EMPTY_STRING } from '../../utils/strings/CommonStrings';
import { submitBulkDataListEntry } from '../../axios/apiService/dataList.apiService';
import { showToastPopover, updatePostLoader, validate } from '../../utils/UtilityFunctions';
import { FORM_POPOVER_STATUS } from '../../utils/Constants';
import { CHECKBOX_SELECT_ALL, FIELD_TYPES } from '../../components/form_builder/FormBuilder.strings';
import {
  getValidationsForNumberField, getValidationsForSingleLine, getValidationsForParagraphField,
  getValidationsForDateField, getValidationsforYesOrNoField, getValidationsforCheckboxField,
  getValidationsforDropdownField, getValidationsforRadioField, getValidationsForInfoField, getValidationsForEmailField, getValidationsForScanner,
} from '../../containers/landing_page/my_tasks/task_content/TaskContent.validation.schema';
import { BULK_UPLOAD_SUPPROTED_FIELDS } from '../../containers/data_list/data_list_dashboard/bulk_upload/PreviewUpload/PreviewUpload.strings';
import { getFileUrl } from '../../utils/attachmentUtils';

const getValidationSchema = (fieldDetails, workingDays) => {
  const fieldData = { field_name: fieldDetails.field_name };
  switch (fieldDetails.field_type) {
    case FIELD_TYPES.NUMBER:
      return getValidationsForNumberField(fieldDetails.validations, fieldData, fieldDetails.required);
    case FIELD_TYPES.SINGLE_LINE:
      return getValidationsForSingleLine(fieldDetails.validations, fieldData, fieldDetails.required);
    case FIELD_TYPES.PARAGRAPH:
      return getValidationsForParagraphField(fieldDetails.validations, fieldData, fieldDetails.required);
    case FIELD_TYPES.DATE:
    case FIELD_TYPES.DATETIME:
      return getValidationsForDateField(fieldDetails.read_only, fieldDetails.validations, fieldData, fieldDetails.required, fieldDetails.field_type, null, true, workingDays);
    case FIELD_TYPES.DROPDOWN:
      return getValidationsforDropdownField(fieldDetails.validations, fieldData, fieldDetails.required, null, null, fieldDetails.values, true);
    case FIELD_TYPES.CHECKBOX:
      return getValidationsforCheckboxField(fieldDetails.validations, fieldData, fieldDetails.required, null, null, fieldDetails.values);
    case FIELD_TYPES.RADIO_GROUP:
      return getValidationsforRadioField(fieldDetails.validations, fieldData, fieldDetails.required, null, null, true, fieldDetails.values);
    case FIELD_TYPES.YES_NO:
      return getValidationsforYesOrNoField(fieldDetails.validations, fieldData, fieldDetails.required, null, null, true);
    case FIELD_TYPES.INFORMATION:
      return getValidationsForInfoField(fieldData);
    case FIELD_TYPES.EMAIL:
      return getValidationsForEmailField(fieldDetails.validations, fieldData, fieldDetails.required);
    case FIELD_TYPES.SCANNER:
      return getValidationsForScanner(fieldDetails.validations, fieldData, fieldDetails.required);
    default:
      return null;
  }
};

const validation = (data, fieldUuid, fieldDetails, index, validationSchema, type) => {
  if (fieldDetails.required && !jsUtils.has(data, ['bulk_data_list_entries', Number(index), fieldUuid])) return { undefined: `${fieldDetails.field_name} is required` };
  return type === 'date.base' ? { undefined: 'Invalid date' } : validate(jsUtils.get(data, ['bulk_data_list_entries', Number(index), fieldUuid], ''), validationSchema);
};

const parseValidationMessage = (data, fieldMap, workingDays) => {
  const { validation_message } = data;
  const validationMessage = {};
  if (validation_message) {
    const firstValidation = jsUtils.get(validation_message, [0, 'field']);
    if (firstValidation === 'bulk_data_list_entries') {
      return false;
    }
  }
  const containsUnSupportedField = [];
  validation_message.forEach((eachMessage) => {
    const [, index, fieldUuid] = eachMessage.field.split('.');
    const { type } = eachMessage;
    if (validationMessage[index]) {
      const fields = validationMessage[index];
      const validationSchema = getValidationSchema(fieldMap.get(fieldUuid), workingDays);
      const error = validation(data, fieldUuid, fieldMap.get(fieldUuid), index, validationSchema, type);
      if (fieldMap.get(fieldUuid).field_type === FIELD_TYPES.CHECKBOX && !error.undefined && !jsUtils.isEmpty(error)) {
        const errorKeys = Object.keys(error);
        validationMessage[index] = { ...fields, [fieldUuid]: jsUtils.get(error, [errorKeys[0]]) };
      } else validationMessage[index] = { ...fields, [fieldUuid]: error.undefined };
    } else {
      const validationSchema = getValidationSchema(fieldMap.get(fieldUuid), workingDays);
      const error = validation(data, fieldUuid, fieldMap.get(fieldUuid), index, validationSchema, type);
      if (fieldMap.get(fieldUuid).field_type === FIELD_TYPES.CHECKBOX && !error.undefined && !jsUtils.isEmpty(error)) {
        const errorKeys = Object.keys(error);
        validationMessage[index] = { [fieldUuid]: jsUtils.get(error, [errorKeys[0]]) };
      } else validationMessage[index] = { [fieldUuid]: error.undefined };
    }
    if (!BULK_UPLOAD_SUPPROTED_FIELDS.includes(fieldMap.get(fieldUuid).field_type)) {
      containsUnSupportedField.push(fieldMap.get(fieldUuid).field_name);
    }
  });
  if (!jsUtils.isEmpty(containsUnSupportedField)) {
    showToastPopover(
      translate('error_popover_status.bulk_upload_fields'),
      `${translate('error_popover_status.remove_fields')} ${containsUnSupportedField} ${translate('error_popover_status.and_try_again')}`,
      FORM_POPOVER_STATUS.SERVER_ERROR,
      true,
    );
  }
  return validationMessage;
};

export const submitBulkDataListEntryAction = ({ documentDetails, formMetadata, dataListId, sheetName, uploadFile, currentIndex, workingDaysArray }, setCancelBulkdataListEntry) => (dispatch, getState) => {
  const fieldMap = new Map();
  formMetadata && formMetadata.sections && formMetadata.sections.forEach((section) => {
    if (section) {
      section?.field_metadata.forEach((field) => {
        fieldMap.set(field.field_uuid, { ...field });
      });
    }
  });
  if (!jsUtils.isEmpty(documentDetails) && currentIndex === 0) {
    const documentMetadata = documentDetails.file_metadata.find((metadata) => metadata.file_ref_id === jsUtils.get(uploadFile, ['file_ref_uuid']));
    if (documentMetadata) {
      const uploadData = {
        data_list_id: dataListId,
        form_id: jsUtils.get(formMetadata, ['form_id']),
        sheet_name: sheetName,
        bulk_entry_doc_id: documentMetadata._id,
        form_uuid: formMetadata?.form_uuid,
        document_details: {
          entity: documentDetails.entity,
          entity_id: documentDetails.entity_id,
          ref_uuid: documentDetails.ref_uuid,
          uploaded_doc_metadata: [
            {
              type: DOCUMENT_TYPES.DATA_LIST_BULK_ENTRY,
              document_id: documentMetadata._id,
              upload_signed_url: getFileUrl(documentMetadata?.upload_signed_url),
            },
          ],
        },
      };
      dispatch(bulkUploadStarted());
      updatePostLoader(true);
      return submitBulkDataListEntry(uploadData, setCancelBulkdataListEntry).then((data) => {
        const validationMessage = parseValidationMessage(data, fieldMap, workingDaysArray);
        if (validationMessage === false) {
          updatePostLoader(false);
          showToastPopover(
            translate('error_popover_status.bulk_upload_failed'),
            translate('error_popover_status.no_data_found_sheet'),
            FORM_POPOVER_STATUS.SERVER_ERROR,
            true,
          );
          return Promise.resolve(false);
        }
        dispatch(bulkUploadCompleted({ ...data, validationMessage }));
        updatePostLoader(false);
        return Promise.resolve(true);
      }).catch((err) => {
        const error_message = jsUtils.get(err, ['response', 'data', 'errors', '0', 'field']);
        let title = translate('error_popover_status.bulk_upload_failed');
        if (error_message === 'update_in_progress') title = translate('error_popover_status.bulk_upload_inprogress');
        showToastPopover(
          title,
          EMPTY_STRING,
          FORM_POPOVER_STATUS.SERVER_ERROR,
          true,
        );
        updatePostLoader(false);
        dispatch(bulkUploadFailed(err));
        return Promise.resolve(false);
      });
    } else {
      return Promise.resolve(false);
    }
  } else if (currentIndex === 1) {
    const { bulkDataListEntries } = getState().bulkUploadReducer;
    const postData = [];
    bulkDataListEntries.map((fields) => {
      const data = {};
      if (!jsUtils.isEmpty(fields)) {
        jsUtils.forEach(fields, (_value, key) => {
          console.log('fieldMapfieldMap', _value, fieldMap, key, formMetadata, fieldMap.get(key));
          if (key !== '_id') {
            if (key !== 'system_identifier' && fieldMap.get(key)?.field_type === FIELD_TYPES.YES_NO) data[key] = _value;
            else if (jsUtils.isArray(_value)) {
              data[key] = _value.filter((data) => data !== CHECKBOX_SELECT_ALL.VALUE);
            } else data[key] = jsUtils.isNumber(_value) ? _value : (_value || null);
          }
        });
      }
      postData.push(data);
      return null;
    });
    const uploadData = {
      bulk_data_list_entries: postData,
      data_list_id: dataListId,
      form_id: jsUtils.get(formMetadata, ['form_id']),
      form_uuid: formMetadata?.form_uuid,
    };
    updatePostLoader(true);
    return submitBulkDataListEntry(uploadData, setCancelBulkdataListEntry).then(() => {
      updatePostLoader(false);
      return Promise.resolve(true);
    }).catch((err) => {
      updatePostLoader(false);
      const { bulkDataListEntries } = getState().bulkUploadReducer;
      if (err.response && err.response.data.error_code === 1100) {
        const validationMessage = parseValidationMessage({ validation_message: err.response.data.errors, bulk_data_list_entries: bulkDataListEntries }, fieldMap, workingDaysArray);
        if (validationMessage === false) {
          showToastPopover(
            translate('error_popover_status.bulk_upload_failed'),
            translate('error_popover_status.no_data_found_sheet'),
            FORM_POPOVER_STATUS.SERVER_ERROR,
            true,
          );
          return Promise.resolve(false);
        }
        dispatch(setBulkUploadValidationMessage(validationMessage));
      }

      const error_message = jsUtils.get(err, ['response', 'data', 'errors', '0', 'field']);
      let title = translate('error_popover_status.bulk_upload_failed');
      if (error_message === 'update_in_progress') title = translate('error_popover_status.bulk_upload_inprogress');
      showToastPopover(
        title,
        EMPTY_STRING,
        FORM_POPOVER_STATUS.SERVER_ERROR,
        true,
      );
      updatePostLoader(false);
      dispatch(bulkUploadFailed(err));
      return Promise.resolve(false);
    });
  } else {
    dispatch(bulkUploadFailed({ name: 'xlsx file not uploaded' }));
    showToastPopover(
      translate('error_popover_status.upload_xlsx'),
      EMPTY_STRING,
      FORM_POPOVER_STATUS.SERVER_ERROR,
      true,
    );
    return Promise.resolve(false);
  }
};

export const bulkDataListEntryChangeAction = (index, value, fieldUuid) => (dispatch) => dispatch(bulkDataListEntryChange(index, value, fieldUuid));

export const bulkDataListEntryValidationChangeAction = (index, fieldDetails, currentValue, workingDays) => (dispatch) => {
  let error = {};
  if ((fieldDetails.required) || (jsUtils.formFieldEmptyCheck(currentValue))) {
    if (fieldDetails.required && !jsUtils.formFieldEmptyCheck(currentValue)) error = { undefined: `${fieldDetails.field_name} is required` };
    else error = validate(currentValue, getValidationSchema(fieldDetails, workingDays));
  }
  dispatch(bulkDataListEntryValidationChange(index, fieldDetails.field_uuid, error.undefined));
};

export const bulkDataListEntryDeleteRowAction = (index) => (dispatch) => dispatch(bulkDataListEntryRowDelete(index));
