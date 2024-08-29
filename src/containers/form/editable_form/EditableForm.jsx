import React, { useEffect, useState } from 'react';
import Joi from 'joi';
import gClasses from 'scss/Typography.module.scss';
import { useSelector } from 'react-redux';
import { FIELD_ACTION, FORM_ACTIONS, FORM_TYPE, ROW_IDENTIFIER } from '../Form.string';
import Sections from '../sections/Sections';
import { RESPONSE_FIELD_KEYS } from '../../../utils/constants/form/form.constant';
import { combineFormVisibility, formatData, formatFormDataForVisibilityAndValueConfig, formatFormData, getPostDataForFormFieldsUpdate, getFormFieldUpdateResponse, getCancelTokenKeyForFormFieldUpdate } from './EditableForm.utils';
import { get, includes, cloneDeep, isEmpty } from '../../../utils/jsUtility';
import { getFieldVisibilityListApi } from '../../../axios/apiService/task.apiService';
import { FIELD_TYPES } from '../sections/field_configuration/FieldConfiguration.strings';
import { generateSchemaForAllFields } from './EditableFrom.schema';
import { validate, CancelToken } from '../../../utils/UtilityFunctions';

const cancelTokenSchema = {
};

const setCancelTokenSchema = (key, token) => {
  cancelTokenSchema[key]?.setCancelToken(token);
};

function EditableForm(props) {
   const {
      metaData = {}, // used in dynamic default vakue and visibility api call
      moduleType,
      sections,
      formData,
      informationFieldFormContent,
      documentDetails,
      fields,
      formVisibility,
      formMetaData,
      validationMessage,
      dispatch,
      onFormFillUpdate,
      dynamicValidation,
      userProfileData,
    } = props;
    const [schema, setSchema] = useState({});

    const working_days = useSelector((state) => state?.LanguageAndCalendarAdminReducer?.working_days);
    const locale = useSelector((state) => state?.RoleReducer?.acc_locale);

    useEffect(() => {
      const formattedData = {};
      const _schema = generateSchemaForAllFields(
          sections,
          formVisibility,
          userProfileData,
          working_days,
          formattedData,
          fields,
          sections?.contents,
      );
      setSchema(_schema);
    }, [locale]);

    const onFormFieldUpdatedSuccess = (responseData, tableAction, field, fieldUUID, existingData) => {
      const { fields: fieldRelatedData = {}, actions = {} } = responseData;
      const { form_visibility } = fieldRelatedData;
      const { button_visibility = {} } = actions;

      const { activeFormData, formMetaData } = existingData;
      const formVisibility = formMetaData?.formVisibility || {};

      const updatedActiveFormData = getFormFieldUpdateResponse(responseData, cloneDeep(activeFormData), fields, formVisibility);
      let errorList = null;

      if (tableAction === FIELD_ACTION.TABLE_ADD_ROW) {
        const options = { tableUUID: fieldUUID };
        // eslint-disable-next-line no-use-before-define
        errorList = calculateDynamicValidation(field, updatedActiveFormData[fieldUUID], options);
      }
      const updatedFormMetaData = {
        dependentFields: formMetaData.dependentFields,
        formVisibility: combineFormVisibility(formVisibility, form_visibility),
        buttonVisibility: { ...formMetaData.buttonVisibility, ...button_visibility },
      };

      dispatch(FORM_ACTIONS.FORM_DATA_CHANGE, { activeFormData: updatedActiveFormData, formMetaData: updatedFormMetaData });
      onFormFillUpdate(updatedActiveFormData, { formMetaData: updatedFormMetaData, errorList });
    };

    const getFormFieldUpdates = (field, activeFormData, tableUtility = {}) => {
      const tableAction = tableUtility?.tableAction;
      const updatedRowUUID = tableUtility?.[ROW_IDENTIFIER.TEMP_ROW_UUID];
      const { HAS_PROPERTY_FIELD, FIELD_UUID, DATA_LIST_DETAILS } = RESPONSE_FIELD_KEYS;
      const fieldUUID = field[FIELD_UUID];
      const hasDLPropertyField = get(field, [DATA_LIST_DETAILS, HAS_PROPERTY_FIELD], false);
      const hasUserPropertyField = get(field, [HAS_PROPERTY_FIELD], false);

      if (
        !tableAction &&
        !includes(formMetaData.dependentFields, fieldUUID) &&
        !hasDLPropertyField &&
        !hasUserPropertyField
      ) return;

      const formValues = formatFormDataForVisibilityAndValueConfig(
          cloneDeep(activeFormData),
          fields,
          formVisibility,
          formMetaData,
          field,
          tableAction,
        );
      const postData = getPostDataForFormFieldsUpdate(metaData, moduleType, field, formValues, tableAction, updatedRowUUID);

      const key = getCancelTokenKeyForFormFieldUpdate(field, tableUtility);

      if (!cancelTokenSchema?.[key]) {
        cancelTokenSchema[key] = new CancelToken();
      }

      const cancelToken = cancelTokenSchema[key];

      getFieldVisibilityListApi(postData, cancelToken?.cancelToken, (token) => setCancelTokenSchema(key, token)).then((data) => {
        dispatch(
          FORM_ACTIONS.COMMON_STATE_UPDATER, {
          executableFunc: (existingState) => onFormFieldUpdatedSuccess(data, tableAction, field, fieldUUID, existingState),
          },
        );
      }).catch((e) => console.log('xyz getFormFieldUpdates', e));
    };

    const calculateDynamicValidation = (field, value, options = {}) => {
      const fieldUUID = field[RESPONSE_FIELD_KEYS.FIELD_UUID];
      const fieldSchema = schema[fieldUUID];
      if (!dynamicValidation || !fieldSchema) return validationMessage;

      const { tableUUID, rowIndex } = options;
      const validateSchema = Joi.object(fieldSchema); // fieldSchema -> { field_uuid: joi_schema_obj }
      const clonedValidationMessage = cloneDeep(validationMessage);
      let key = '';
      let errorObj = {};

      if (tableUUID) {
        if (tableUUID === fieldUUID) { // direct interaction on table like add/remove row
          key = fieldUUID;
          const validateObj = { [fieldUUID]: value };
          const formattedData = formatFormData(validateObj, fields, formVisibility);
          const error = validate(formattedData, validateSchema);
          errorObj = error;
        } else {
          // for table fields
          key = `${tableUUID},${rowIndex},${fieldUUID}`;
          const _value = value[rowIndex][fieldUUID];
          const validateObj = { [fieldUUID]: _value };
          const formattedData = formatFormData(validateObj, fields, formVisibility);
          const error = validate(formattedData, validateSchema);
          if (error[fieldUUID]) errorObj[key] = error[fieldUUID];
          else {
            // for phone, currency, link fields
            // `[field_uuid],phone_number` --> `[table_uuid],0,[field_uuid],phone_number`
            Object.keys(error).forEach((k) => {
              const newKey = `${tableUUID},${rowIndex},${k}`;
              errorObj[newKey] = error[k];
            });
          }
        }
      } else {
        key = fieldUUID;
        const validateObj = { [fieldUUID]: value };
        const formattedData = formatFormData(validateObj, fields, formVisibility);
        const error = validate(formattedData, validateSchema);
        errorObj = error;
      }

      Object.keys(validationMessage).forEach((k) => {
        if (k.startsWith(key)) delete clonedValidationMessage[k];
      });

      const updatedValidationMessage = { ...clonedValidationMessage, ...errorObj };
      return updatedValidationMessage;
    };

   // tableUtils = { tableUUID: null, rowId: null, tempId: null }
   const onFieldDataChange = (field, value, action, options = {}) => {
      const { updatedValue, updatedOptions } = formatData(field, value, action, formData, options);
      const fieldUUID = field[RESPONSE_FIELD_KEYS.FIELD_UUID];
      const isFileUpload = field[RESPONSE_FIELD_KEYS.FIELD_TYPE] === FIELD_TYPES.FILE_UPLOAD;
      // if it is a table field replace fieldUUID with tableUUID
      // if (field[RESPONSE_FIELD_KEYS.FIELD_LIST_TYPES] === FIELD_TYPES.TABLE && !isFileUpload) {
      //   fieldUUID = options.tableUUID;
      // }

      const errorList = isFileUpload ? {} : calculateDynamicValidation(field, updatedValue, options);
      const _options = { ...options, ...updatedOptions, getFormFieldUpdates, errorList };
      if (isFileUpload) {
        dispatch(FORM_ACTIONS.FILE_UPLOAD_FIELD_DATA_CHANGE, { fieldUUID, file: updatedValue, options: _options, calculateDynamicValidation: (value) => calculateDynamicValidation(field, value, options) });
      } else {
        dispatch(FORM_ACTIONS.ACTIVE_FORM_DATA_CHANGE, { fieldUUID, value: updatedValue, options: _options });
      }
   };
   return (
    <div className={isEmpty(sections) && gClasses.DisplayNone}>
      <Sections
        metaData={metaData}
        moduleType={moduleType}
        formData={formData}
        informationFieldFormContent={informationFieldFormContent}
        documentDetails={documentDetails}
        sections={sections}
        dispatch={dispatch}
        fields={fields}
        formType={FORM_TYPE.EDITABLE_FORM}
        formVisibility={formVisibility}
        validationMessage={validationMessage}
        onFieldDataChange={onFieldDataChange}
        userProfileData={userProfileData}
      />
    </div>
   );
}

export default EditableForm;
