import React, { useEffect, useState } from 'react';
import cx from 'classnames/bind';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { Prompt, useHistory } from 'react-router-dom';
import { accountConfigurationDataChangeAction } from 'redux/actions/AccountConfigurationAdmin.Action';
import { SIGNIN } from 'urls/RouteConstants';
import { v4 as uuidv4 } from 'uuid';
import FormTitle, {
  FORM_TITLE_TYPES,
} from '../../../../components/form_components/form_title/FormTitle';

import gClasses from '../../../../scss/Typography.module.scss';
import {
  isEmpty,
  cloneDeep,
  get,
  set,
} from '../../../../utils/jsUtility';
import {
  getUserProfileData,
  handleBlockedNavigation,
  setUserProfileData,
} from '../../../../utils/UtilityFunctions';
import { EMPTY_STRING } from '../../../../utils/strings/CommonStrings';
// funcs
import {
  getDataFieldsTypeAndSectionSelector,
  getDataListMetricsSelector,
} from '../../../../redux/selectors/CreateDataList.selectors';
import { getLookupListApiThunk } from '../../../../redux/actions/LookUp.Action';
import {
  createDataListSetState,
  dataListStateChangeAction,
  openFieldConfig,
  setDataListSelectorErrorListData,
  setDefaultRuleFieldData,
  setEntireField,
  setErrorListData,
  setFieldData,
  setFieldListData,
  setFieldListValidation,
  setSectionDataAction,
  setVisibilityFieldData,
} from '../../../../redux/reducer/CreateDataListReducer';
import { MODULE_TYPES } from '../../../../utils/Constants';
import {
  saveFormApiThunkDataList,
  getRuleDetailsByIdInFieldVisibility,
  saveRuleForFieldApiThunk,
  saveFieldApiThunkDataList,
  saveTableApiThunkDataList,
} from '../../../../redux/actions/CreateDataList.action';
import { tableValidationExternalFieldsThunk, visibilityExternalFieldsThunk, externalFieldsClear, clearVisibilityOperators, updateExternalFieldsFromDeletedFieldUUID } from '../../../../redux/actions/Visibility.Action';
import {
  deleteFormFieldOrFieldListApiAction, checkDependencyAndDeleteFieldApiAction, checkDependencyAndDeleteSectionApiAction, listDependencyApiThunk,
} from '../../../../redux/actions/Form.Action';
import {
  createTaskSetState,
} from '../../../../redux/reducer/CreateTaskReducer';
import { DATALIST_FORM_TITLE } from './AddDataSetFields.constant';
import { FIELD_ACTION_TYPE, FORM_TYPE } from '../../../form/Form.string';
import { REQUEST_SAVE_FORM } from '../../../../utils/constants/form/form.constant';
import Form from '../../../form/Form';
import { getParentNodeUuidFromTree } from '../../../form/sections/form_layout/FormLayout.utils';
import { saveField } from '../../../../axios/apiService/createTask.apiService';
import { saveTable } from '../../../../axios/apiService/form.apiService';
import { getAccountConfigurationDetailsApiService } from '../../../../axios/apiService/accountConfigurationDetailsAdmin.apiService';

const mapStateToProps = (state, ownProps) => {
  return {
    addFormFieldsDropdownVisibilityData:
      state.CreateDataListReducer.addFormFieldsDropdownVisibilityData,
    dataFieldsTypeAndSection: getDataFieldsTypeAndSectionSelector(
      state.CreateDataListReducer,
      ownProps.isEditDataListView,
    ),
    dependency_data: state.CreateDataListReducer.dependency_data,
    error_list: state.CreateDataListReducer.error_list,
    datalist_selector_error_list: state.CreateDataListReducer.datalist_selector_error_list,
    additional_error_list: state.CreateDataListReducer.additional_error_list,
    server_error: state.CreateDataListReducer.server_error,
    lookUpListCurrentPage: state.LookUpReducer.lookUpListCurrentPage,
    lookUpListDataCountPerCall: state.LookUpReducer.lookUpListDataCountPerCall,
    lookUpList: state.LookUpReducer.lookUpList,
    lookupHasMore: state.LookUpReducer.hasMore,
    metricsDataList: getDataListMetricsSelector(state.CreateDataListReducer),
    formUuid: state.CreateDataListReducer.formUuid,
    formId: state.CreateDataListReducer.formId,
    state: state.CreateTaskReducer,
    isEditDatalist: state.CreateDataListReducer.isEditDatalist,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onDataListStateChange: (data, id) => {
      dispatch(dataListStateChangeAction(data, id));
    },
    setState: (object) => dispatch(createDataListSetState(object)),
    setSection: (...params) => dispatch(setSectionDataAction(...params)),
    setField: (...params) => dispatch(setFieldData(...params)),
    openFieldConfigAction: (sectionIndex, fieldListIndex, fieldIndex) =>
      dispatch(openFieldConfig(sectionIndex, fieldListIndex, fieldIndex)),
    setEntireField: (...params) => dispatch(setEntireField(...params)),
    setFieldList: (...params) => dispatch(setFieldListData(...params)),
    setFieldListValidation: (...params) => dispatch(setFieldListValidation(...params)),
    setErrorList: (errorList) => dispatch(setErrorListData(errorList)),
    setDataListSelectorErrorList: (errorList) => dispatch(setDataListSelectorErrorListData(errorList)),
    setDefaultRuleValue: (
      id,
      value,
      sectionIndex,
      fieldListIndex,
      fieldIndex,
      toggle,
      isInitial,
    ) =>
      dispatch(
        setDefaultRuleFieldData(
          id,
          value,
          sectionIndex,
          fieldListIndex,
          fieldIndex,
          () => {},
          toggle,
          isInitial,
        ),
      ),
    setVisibilityFieldValue: (
      id,
      value,
      sectionIndex,
      fieldListIndex,
      fieldIndex,
    ) =>
      dispatch(
        setVisibilityFieldData(
          id,
          value,
          sectionIndex,
          fieldListIndex,
          fieldIndex,
        ),
      ),
    onSaveFieldApiThunk: (postData, isConfigPopupOpen, saveFormCallback) =>
      dispatch(saveFieldApiThunkDataList(postData, isConfigPopupOpen, saveFormCallback)),
    onSaveTableApiThunk: (postData, isConfigPopupOpen, isClose, isFinalSubmission, t) =>
    dispatch(saveTableApiThunkDataList(postData, isConfigPopupOpen, isClose, isFinalSubmission, t)),
    onSaveFormApiThunk: (postData, isConfigPopupOpen) =>
      dispatch(saveFormApiThunkDataList(postData, isConfigPopupOpen)),
    saveRuleForFieldApi: (
      ruleData,
      id,
      sectionIndex,
      fieldListIndex,
      fieldIndex,
    ) =>
      dispatch(
        saveRuleForFieldApiThunk(
          ruleData,
          id,
          sectionIndex,
          fieldListIndex,
          fieldIndex,
        ),
      ),
    getVisibilityExternalFields: (...params) =>
      dispatch(visibilityExternalFieldsThunk(...params)),
    getTableValidationFields: (...params) =>
      dispatch(tableValidationExternalFieldsThunk(...params)),
    getRuleDetailsByIdInFieldVisibilityApi: (
      ruleId,
      sectionIndex,
      fieldListIndex,
      fieldIndex,
      avoidExpressionUpdate,
    ) =>
      dispatch(
        getRuleDetailsByIdInFieldVisibility(
          ruleId,
          sectionIndex,
          fieldListIndex,
          fieldIndex,
          avoidExpressionUpdate,
        ),
      ),
    deleteFormFieldOrFieldListApi: (...params) =>
      dispatch(deleteFormFieldOrFieldListApiAction(...params)),
    checkDependencyAndDeleteFieldApi: (...params) =>
      dispatch(checkDependencyAndDeleteFieldApiAction(...params)),
    checkDependencyAndDeleteSectionApi: (...params) =>
      dispatch(checkDependencyAndDeleteSectionApiAction(...params)),
    onGetLookupList: (params, isPaginatedData, isSearch) =>
      dispatch(getLookupListApiThunk(params, isPaginatedData, isSearch)),
    setTaskState: (value) => dispatch(createTaskSetState(value)),
    onClearExternalFields: () => dispatch(externalFieldsClear()),
    onClearVisibilityOperators: () => dispatch(clearVisibilityOperators()),
    onUpdateExternalFieldsFromDeletedFieldUUID: (field_uuid) => dispatch(updateExternalFieldsFromDeletedFieldUUID(field_uuid)),
    setAccountConfigurationData: (response) => {
      dispatch(accountConfigurationDataChangeAction(response));
    },
    listDependencyApiCall: (...params) =>
      dispatch(listDependencyApiThunk(...params)),
    dispatch,
    // saveDataList: (postData) => {
    //   dispatch(saveDataListApiThunk(postData));
    // },
  };
};

function AddDataSetFields(props) {
  const {
    dataFieldsTypeAndSection,
    dataFieldsTypeAndSection: {
      data_list_id,
      sections,
      error_list,
      fields,
    },

    onClearExternalFields,
    onClearVisibilityOperators,
    isEditDatalist,
    dataListId,
    hideTitle,
  } = props;
  console.log('fbgsababaz', isEditDatalist, sections);
  const { t } = useTranslation();

  const [blockNavigation, setNavigationBlockerStatus] = useState(true);
  const history = useHistory();
  useEffect(() => {
    getAccountConfigurationDetailsApiService().then(setUserProfileData);
    () => {
      onClearExternalFields();
      onClearVisibilityOperators();
    };
  }, []);

  // const updateSectionsAndCheckError = (data_list_data) => {
  //   const { setErrorList } = props;
  //   let errorList = jsUtils.cloneDeep(data_list_data.error_list);
  //   if (!jsUtils.isEmpty(errorList)) {
  //     if (data_list_data.sections.length === 1) {
  //       errorList = validate(
  //         getFormDetailsValidationData(data_list_data),
  //         formDetailsValidateSchemaWithOneSection(t),
  //       );
  //     } else {
  //       errorList = validate(
  //         getFormDetailsValidationData(data_list_data),
  //         formDetailsValidateSchema(t),
  //       );
  //     }
  //   }
  //   setErrorList(errorList);
  // };

  // const onDefaultChangeHandler = (
  //   event,
  //   sectionIndex,
  //   fieldListIndex,
  //   fieldIndex,
  // ) => {
  //   const {
  //     dataFieldsTypeAndSection: { sections },
  //     setField,
  //   } = props;
  //   const field = setDefaultValueForField(
  //     sections,
  //     sectionIndex,
  //     fieldListIndex,
  //     fieldIndex,
  //     event,
  //     t,
  //   );
  //   if (field.field_type === FIELD_TYPES.INFORMATION && !field.field_name) {
  //     setField(
  //       FIELD_KEYS.REFERENCE_NAME,
  //      'infofield',
  //       sectionIndex,
  //       fieldListIndex,
  //       fieldIndex,
  //     );
  //     setField(
  //       FIELD_KEYS.FIELD_NAME,
  //      'infofield',
  //       sectionIndex,
  //       fieldListIndex,
  //       fieldIndex,
  //     );
  //   }
  //   setField(
  //     FIELD_KEYS.DEFAULT_VALUE,
  //     field[FIELD_KEYS.DEFAULT_VALUE],
  //     sectionIndex,
  //     fieldListIndex,
  //     fieldIndex,
  //     false,
  //     updateSectionsAndCheckError,
  //   );
  // };

  // const onRequiredClickHandler = (
  //   value,
  //   sectionIndex,
  //   fieldListIndex,
  //   fieldIndex,
  // ) => {
  //   const { setField } = props;
  //   setField(
  //     FIELD_KEYS.REQUIRED,
  //     null,
  //     sectionIndex,
  //     fieldListIndex,
  //     fieldIndex,
  //     true,
  //   );
  // };

  // const onVisibilityFieldChangeHandler = (
  //   event,
  //   sectionIndex,
  //   fieldListIndex,
  //   fieldIndex,
  // ) => {
  //   const { setVisibilityFieldValue } = props;
  //   setVisibilityFieldValue(
  //     event.target.id,
  //     event.target.value,
  //     sectionIndex,
  //     fieldListIndex,
  //     fieldIndex,
  //   );
  // };

  // const onReadOnlyClickHandler = (
  //   value,
  //   sectionIndex,
  //   fieldListIndex,
  //   fieldIndex,
  // ) => {
  //   const { setField } = props;
  //   setField(
  //     FIELD_KEYS.READ_ONLY,
  //     null,
  //     sectionIndex,
  //     fieldListIndex,
  //     fieldIndex,
  //     true,
  //   );
  //   setField(
  //     FIELD_KEYS.READ_ONLY_PREVIOUS_STATE,
  //     !value,
  //     sectionIndex,
  //     fieldListIndex,
  //     fieldIndex,
  //   );
  // };

  // const onFieldIsShowWhenRule = (
  //   value,
  //   sectionIndex,
  //   fieldListIndex,
  //   fieldIndex,
  //   type,
  // ) => {
  //   const { setField } = props;
  //   setField(
  //     type,
  //     null,
  //     sectionIndex,
  //     fieldListIndex,
  //     fieldIndex,
  //     true,
  //   );
  // };

  // const onFieldVisibleRule = (
  //   value,
  //   sectionIndex,
  //   fieldListIndex,
  //   fieldIndex,
  // ) => {
  //   const { setField } = props;
  //   setField(
  //     FIELD_KEYS.IS_VISIBLE,
  //     value,
  //     sectionIndex,
  //     fieldListIndex,
  //     fieldIndex,
  //     true,
  //   );
  // };

  // const onOtherConfigChangeHandler = (
  //   event,
  //   sectionIndex,
  //   fieldListIndex,
  //   fieldIndex,
  // ) => {
  //   const {
  //     dataFieldsTypeAndSection: { sections },
  //     setEntireField,
  //   } = props;
  //   const field = setOtherConfigDataForField(
  //     sections,
  //     sectionIndex,
  //     fieldListIndex,
  //     fieldIndex,
  //     event,
  //   );
  //   setEntireField(
  //     field,
  //     sectionIndex,
  //     fieldListIndex,
  //     fieldIndex,
  //     updateSectionsAndCheckError,
  //   );
  // };

  // const onDataListChangeHandler = (
  //   event,
  //   sectionIndex,
  //   fieldListIndex,
  //   fieldIndex,
  //   t,
  // ) => {
  //   const { setField } = props;
  //   setField(
  //     FIELD_KEYS.DATA_LIST,
  //     event.target.value,
  //     sectionIndex,
  //     fieldListIndex,
  //     fieldIndex,
  //   );
  //   if (jsUtils.has(event, ['target', 'index'])) {
  //     const { setDataListSelectorErrorList } = props;
  //     const { datalist_selector_error_list } = jsUtils.cloneDeep(store.getState().CreateDataListReducer);
  //     const errorList = jsUtils.cloneDeep(datalist_selector_error_list);
  //     if (errorList[event.target.index]) delete errorList[event.target.index];
  //     console.log('deletederrorlsit', errorList);
  //     setDataListSelectorErrorList(errorList);
  //   }
  //   if (event.target.clearFilter) {
  //     const validationEvent =
  //     {
  //       target:
  //       { id: FIELD_CONFIG(t).VALIDATION_CONFIG.LIMIT_DATALIST.FILTER_FIELDS.ID,
  //           value: [],
  //       },
  //     };
  //     const field = setValidationConfigForField(
  //       sections,
  //       sectionIndex,
  //       fieldListIndex,
  //       fieldIndex,
  //       validationEvent,
  //       false, // isTable param
  //     );
  //     setField(
  //       FIELD_KEYS.VALIDATIONS,
  //       field[FIELD_KEYS.VALIDATIONS],
  //       sectionIndex,
  //       fieldListIndex,
  //       fieldIndex,
  //       false,
  //       updateSectionsAndCheckError,
  //     );
  //   }
  // };

  // const onSetDataListSelectorErrorList = (index, errorMessage = t(VALIDATION_CONSTANT.DATA_LIST_SELECTOR_FIELDS_DELETED)) => {
  //   const { setDataListSelectorErrorList } = props;
  //   const { datalist_selector_error_list } = jsUtils.cloneDeep(store.getState().CreateDataListReducer);
  //   let errorList = jsUtils.cloneDeep(datalist_selector_error_list);
  //   if (index !== -1) {
  //     errorList[index] = errorMessage;
  //   } else {
  //     errorList = {};
  //   }
  //   console.log('indexindexindexindexindexindexindexindexindexindexindexindexccccccccc', index, errorList, datalist_selector_error_list);
  //   setDataListSelectorErrorList(errorList);
  // };

  // const onSetDataListPropertyPickerErrorList = () => {
  //   onSetDataListSelectorErrorList(0, t(VALIDATION_CONSTANT.DATA_LIST_PROPERTY_PICKER_FIELD_DELETED));
  // };

  // const onTableValidationConfigChangeHandler = (
  //   event,
  //   sectionIndex,
  //   fieldListIndex,
  //   fieldIndex,
  // ) => {
  //   const {
  //     dataFieldsTypeAndSection: { sections },
  //     setFieldListValidation,
  //   } = props;
  //   const field = setValidationConfigForField(
  //     sections,
  //     sectionIndex,
  //     fieldListIndex,
  //     fieldIndex,
  //     event,
  //     true, // isTable param
  //   );
  //   console.log('event.target.value onTableValidationConfigChangeHandler', event, field);
  //   setFieldListValidation(
  //     event.target.id,
  //     field,
  //     sectionIndex,
  //     fieldListIndex,
  //     false,
  //   );
  // };

  // const onValidationConfigChangeHandler = (
  //   event,
  //   sectionIndex,
  //   fieldListIndex,
  //   fieldIndex,
  // ) => {
  //   const {
  //     dataFieldsTypeAndSection: { sections },
  //     setField,
  //   } = props;
  //   if (DateValidationOptionListId.includes(jsUtils.get(event, ['target', 'id'], ''))) {
  //     const { setErrorList } = props;
  //     setErrorList({});
  //   }
  //   const field = setValidationConfigForField(
  //     sections,
  //     sectionIndex,
  //     fieldListIndex,
  //     fieldIndex,
  //     event,
  //     false, // isTable param
  //   );
  //   if (event.target.id === 'allowed_maximum' || event.target.id === 'allowed_minimum') {
  //     if (!rangeContainsZero(field?.validations?.allowed_minimum, field?.validations?.allowed_maximum)) {
  //       field[FIELD_KEYS.VALIDATIONS] = {
  //         ...field[FIELD_KEYS.VALIDATIONS],
  //         dont_allow_zero: true,
  //       };
  //     } else delete field[FIELD_KEYS.VALIDATIONS]?.dont_allow_zero;
  //   }
  //   console.log('event.target.value validationConfig', event.target.value);
  //   setField(
  //     FIELD_KEYS.VALIDATIONS,
  //     field[FIELD_KEYS.VALIDATIONS],
  //     sectionIndex,
  //     fieldListIndex,
  //     fieldIndex,
  //     false,
  //     updateSectionsAndCheckError,
  //   );
  // };

  // const onSaveFormField = (
  //   sectionId,
  //   fieldListIndex,
  //   fieldId = null,
  //   isConfigPopupOpen,
  // ) => {
  //   const { setTaskState, state, dataFieldsTypeAndSection, datalist_selector_error_list } = props;
  //   const sectionIndex = sectionId - 1;
  //   const fieldIndex = fieldId ? fieldId - 1 : null;
  //   const clonedState = cloneDeep(dataFieldsTypeAndSection);
  //   let field = fieldId
  //   ? jsUtils.get(clonedState, [
  //     'sections',
  //     sectionIndex,
  //     'field_list',
  //     fieldListIndex,
  //     'fields',
  //     fieldIndex,
  //   ])
  //   : jsUtils.get(clonedState, [
  //     'sections',
  //     sectionIndex,
  //     'field_list',
  //     fieldListIndex,
  //   ]);
  //   const { allSections: validatedSection, has_validation } = validateExpressionAndUpdateField(
  //     field,
  //     sectionIndex,
  //     fieldListIndex,
  //     fieldIndex,
  //     !fieldId && (fieldListIndex || fieldListIndex === 0),
  //     cloneDeep(get(clonedState, ['sections'], {})),
  //   );
  //   onDataListStateChange(validatedSection, 'sections');
  //   PostFormFieldAndAutocompleteSuggestionAPI(state);

  //   setTaskState({
  //     isFieldSuggestionEnabled: false,
  //     initialTaskLabel: EMPTY_STRING,
  //     field_type_data: [],
  //     // disableFieldTypeSuggestion: true,
  //   });

  //   // get field from validated section.
  //   field = fieldId ?
  //   jsUtils.get(validatedSection, [sectionIndex, 'field_list', fieldListIndex, 'fields', fieldIndex], field)
  //     : jsUtils.get(validatedSection, [sectionIndex, 'field_list', fieldListIndex]);

  //   const isTableField = fieldId
  //     && jsUtils.get(clonedState, [
  //         'sections',
  //         sectionIndex,
  //         'field_list',
  //         fieldListIndex,
  //         'fields',
  //         fieldIndex,
  //       ]);
  //   const selectedFieldList = jsUtils.get(clonedState, [
  //     'sections',
  //     sectionIndex,
  //     'field_list',
  //     fieldListIndex,
  //   ]);
  //   let errorList = {};
  //   let isSaveField = true;
  //   if (selectedFieldList && selectedFieldList.field_list_type === FIELD_TYPES.TABLE) {
  //     if (!isTableField) {
  //       isSaveField = false;
  //     }
  //   }
  //   if (isSaveField) {
  //     const errorTaskDetailsValidate = {};
  //     const fieldValidate = validate(
  //       getFieldDataForValidation(jsUtils.cloneDeep(field)),
  //       saveFieldValidateSchema(t),
  //     );
  //     Object.keys(fieldValidate).map((errorKey) => {
  //       errorTaskDetailsValidate[`sections,${sectionIndex},field_list,${fieldListIndex},fields,${fieldIndex},${errorKey}`] = fieldValidate[errorKey];
  //       return null;
  //     });
  //     errorList = {
  //       ...errorTaskDetailsValidate,
  //       ...additional_error_list,
  //       ...validate(
  //         getFormDetailsValidationData(clonedState),
  //         getformDetailValidationSchema(sectionId),
  //       ),
  //     };
  //   } else {
  //     errorList = {
  //       ...validate(
  //         getFormDetailsValidationData(clonedState),
  //         getformDetailValidationSchema(sectionId),
  //       ),
  //       ...additional_error_list,
  //     };
  //   }
  //   console.log('onSaveFormField Datalist', errorList, getFormDetailsValidationData(clonedState));
  //   onDataListStateChange(errorList, 'error_list');
  //   return new Promise((resolve) => {
  //     if (jsUtils.isEmpty(errorList) && !has_validation && jsUtils.isEmpty(datalist_selector_error_list)) {
  //       const {
  //         saveRuleForFieldApi,
  //         setDefaultRuleValue,
  //         setVisibilityFieldValue,
  //       } = props;
  //       if (clonedState.form_details && clonedState.form_details.data_list_id) {
  //         const metadata = {
  //           data_list_id: clonedState.form_details.data_list_id,
  //           form_uuid: clonedState.form_details.form_uuid,
  //         };
  //         let isSaveField = true;
  //         if (selectedFieldList && selectedFieldList.field_list_type === FIELD_TYPES.TABLE) {
  //           if (!isTableField) {
  //             isSaveField = false;
  //           }
  //         }

  //         saveFormRule(metadata, field, async (ruleData, id) =>
  //           saveRuleForFieldApi(
  //             ruleData,
  //             id,
  //             sectionIndex,
  //             fieldListIndex,
  //             fieldId ? fieldIndex : null,
  //           ), isSaveField).then(
  //           (response) => {
  //             if (response.success) {
  //               const postData = {
  //                 data: null,
  //                 sectionIndex,
  //                 fieldListIndex,
  //                 fieldIndex,
  //               };
  //               if (isSaveField) {
  //                 return onSaveFieldApiThunk(postData, isConfigPopupOpen, saveFormCallback).then(
  //                   (status) => resolve(status),
  //                 );
  //               } else if (!fieldId && (fieldListIndex || fieldListIndex === 0)) {
  //                 return onSaveTableApiThunk(postData, isConfigPopupOpen, false, true, t).then(
  //                   (status) => resolve(status),
  //                 );
  //                 } else {
  //                 return onSaveFormApiThunk(postData, isConfigPopupOpen).then(
  //                   (status) => resolve(status),
  //                 );
  //               }
  //             }
  //             if (response.visibilityField) {
  //               setVisibilityFieldValue(
  //                 VISIBILITY_CONFIG_FIELDS.ERRORS,
  //                 { ...response.error },
  //                 sectionIndex,
  //                 fieldListIndex,
  //                 fieldIndex,
  //               );
  //             } else if (response.defaultValue) {
  //               setDefaultRuleValue(
  //                 DEFAULT_RULE_KEYS.ERRORS,
  //                 { ...response.error },
  //                 sectionIndex,
  //                 fieldListIndex,
  //                 fieldIndex,
  //               );
  //             }
  //             return resolve(false);
  //           },
  //           (error) => {
  //             const { allSections: validatedSections } = modifyAndUpdateServerErrorInExpression(
  //               error,
  //               cloneDeep(field[FIELD_KEYS.RULE_EXPRESSION]),
  //               sectionIndex,
  //               fieldListIndex,
  //               fieldIndex,
  //               !fieldId && (fieldListIndex || fieldListIndex === 0),
  //               cloneDeep(get(clonedState, ['sections'], {})),
  //               );
  //               onDataListStateChange(validatedSections, 'sections');
  //             resolve(false);
  //           },
  //         );
  //       } else {
  //         let isSaveField = true;
  //         let saveFormData = {};
  //         if (selectedFieldList && selectedFieldList.field_list_type === FIELD_TYPES.TABLE) {
  //           if (!isTableField) {
  //             isSaveField = false;
  //           }
  //         }
  //         if (isSaveField) {
  //           saveFormData = getSaveFieldDetailsAPIDataDataList(
  //             clonedState,
  //             sectionIndex,
  //             fieldListIndex,
  //             fieldIndex,
  //           );
  //         } else {
  //           saveFormData = getFormDetailsAPIDataDataList(
  //             clonedState,
  //             sectionIndex,
  //             fieldListIndex,
  //             fieldIndex,
  //           );
  //         }
  //         const postData = {
  //           data: saveFormData,
  //           sectionIndex,
  //           fieldListIndex,
  //           fieldIndex,
  //         };
  //         if (isEmpty(postData?.data?.form_uuid)) postData.data.form_uuid = formUuid;
  //         if (isEmpty(postData?.data?.form_id)) postData.data.form_id = formId;
  //         if (isSaveField) {
  //           onSaveFieldApiThunk(postData, isConfigPopupOpen, saveFormCallback).then((status) =>
  //             resolve(status));
  //         } else if (!fieldId && (fieldListIndex || fieldListIndex === 0)) {
  //           onSaveTableApiThunk(postData, isConfigPopupOpen).then(
  //             (status) => resolve(status),
  //           );
  //           } else {
  //           onSaveFormApiThunk(postData, isConfigPopupOpen).then((status) =>
  //             resolve(status));
  //         }
  //       }
  //     } else {
  //       const sectionTitleError = Object.keys(errorList).toString().includes('section_name');
  //       if (sectionTitleError) {
  //       }
  //       resolve(false);
  //     }
  //   });
  // };

  // const onAddValues = (event, sectionIndex, fieldListIndex, fieldIndex) => {
  //   const {
  //     dataFieldsTypeAndSection: { sections },
  //     setEntireField,
  //     setErrorList,
  //   } = props;
  //   if (jsUtils.has(error_list, `sections,${sectionIndex},field_list,${fieldListIndex},fields,${fieldIndex},${FIELD_KEYS.VALUES}`)) {
  //     const errorList = { ...error_list };
  //     unset(errorList, `sections,${sectionIndex},field_list,${fieldListIndex},fields,${fieldIndex},${FIELD_KEYS.VALUES}`);
  //     setErrorList(errorList);
  //   }
  //   const newFieldValue = setValuesForField(
  //     jsUtils.cloneDeep(sections),
  //     sectionIndex,
  //     fieldListIndex,
  //     fieldIndex,
  //     event.target.value,
  //   );
  //   setEntireField(newFieldValue, sectionIndex, fieldListIndex, fieldIndex);
  // };

  // const onDefaultValueCalculationTypeHandler = (sectionIndex, fieldListIndex, fieldIndex, value = false) => {
  //   const { setField } = props;
  //   setField(FIELD_KEYS.DEFAULT_DRAFT_VALUE, {}, sectionIndex, fieldListIndex, fieldIndex);
  //   setField(FIELD_KEYS.PREVIOUS_DRAFT_DRAFT_RULE, {}, sectionIndex, fieldListIndex, fieldIndex);
  //   setField(FIELD_KEYS.IS_ADVANCED_EXPRESSION, value, sectionIndex, fieldListIndex, fieldIndex);
  // };

  // const onAddExistingFieldToSection = () => {};
  // const onDependencyCheckSuccessCallBack = (clonedState, postData) => {
  //          store
  //           .dispatch(
  //             createDataListSetState({
  //               sections: clonedState.sections,
  //               error_list: [],
  //             }),
  //           )
  //           .then(() => {
  //             onSaveFormApiThunk(postData);
  //           });
  // };

  // const lookupListHandler = () => {
  //   const { lookUpList } = props;
  //   console.log('CSS ISSUE Lookuplist', lookUpList);
  //   // const params = {
  //   //   page: lookUpListCurrentPage,
  //   //   size: 5,
  //   // };
  //   // if (lookupHasMore) onGetLookupList(params, true);
  //   //   console.log('CSS ISSUE', lookUpList);
  //   const option_list = [];
  //   if (!isNull(lookUpList)) {
  //     lookUpList.forEach((item) => {
  //       const data = {
  //         label: item.lookup_name,
  //         value: item.lookup_name,
  //       };
  //       option_list.push(data);
  //       console.log('CSS ISSUE 1', item, data, option_list);
  //     });
  //   }
  //   return option_list;
  // };

  // const onDeleteFormFromDependencyConfig = () => {};
  // const onEditFieldClick = (
  //   event,
  //   sectionIndex,
  //   fieldListIndex,
  //   fieldIndex,
  // ) => {
  //   const { setField } = props;
  //   setField(
  //     FIELD_KEYS.IS_CONFIG_OPEN,
  //     true,
  //     sectionIndex,
  //     fieldListIndex,
  //     fieldIndex,
  //   );
  // };

  // const onTabChange = async (
  //     { currentIndex, index },
  //     sectionIndex,
  //     fieldListIndex,
  //     fieldIndex = null,
  //   ) => {
  //     const { datalist_selector_error_list } = props;
  //     if (!jsUtils.isEmpty(datalist_selector_error_list)) return false;
  //     if (
  //       [
  //         FIELD_CONFIGS.BASIC_CONFIG.TAB_INDEX,
  //         FIELD_CONFIGS.VALIDATION.TAB_INDEX,
  //         FIELD_CONFIGS.OTHER_SETTINGS.TAB_INDEX,
  //       ].includes(currentIndex)
  //     ) {
  //         const errorList = validate(
  //           getFormDetailsValidationData(dataFieldsTypeAndSection),
  //           getformDetailValidationSchema(),
  //         );
  //         if (!jsUtils.isEmpty(errorList)) {
  //           onDataListStateChange(errorList, 'error_list');
  //             return false;
  //         }
  //       }

  //     if (currentIndex === FIELD_CONFIGS.BASIC_CONFIG.TAB_INDEX || currentIndex === FIELD_CONFIGS.VALIDATION.TAB_INDEX) {
  //       if (jsUtils.isNull(fieldIndex)) {
  //         const reference_name = jsUtils.get(dataFieldsTypeAndSection, ['sections', sectionIndex, 'field_list',
  //           fieldListIndex, 'table_reference_name']);

  //         const referenceCheck = (event) => onTableReferenceNameBlurHandler(event, sectionIndex, fieldListIndex);
  //         const status = await referenceCheck({ target: { value: reference_name } });
  //         if (!status) return false;
  //       }
  //     }
  //     if (
  //       currentIndex === FIELD_CONFIGS.OTHER_SETTINGS.TAB_INDEX &&
  //       fieldIndex !== null
  //     ) {
  //       const currentField = jsUtils.get(dataFieldsTypeAndSection, [
  //         'sections',
  //         sectionIndex,
  //         'field_list',
  //         fieldListIndex,
  //         'fields',
  //         fieldIndex,
  //       ]);
  //       const is_advanced_expression = jsUtils.get(dataFieldsTypeAndSection, [
  //         'sections',
  //         sectionIndex,
  //         'field_list',
  //         fieldListIndex,
  //         'fields',
  //         fieldIndex,
  //         FIELD_KEYS.IS_ADVANCED_EXPRESSION,
  //       ], false);

  //       if (currentField[FIELD_KEYS.IS_DEFAULT_VALUE_RULE]) {
  //         unset(currentField, ['draft_default_value', 'errors']);
  //         const { validation_error: error } = checkForDefaultValueValidation(currentField);
  //         if (!isEmpty(error)) {
  //           const { setDefaultRuleValue } = props;
  //           setDefaultRuleValue(
  //             DEFAULT_RULE_KEYS.ERRORS,
  //             error,
  //             sectionIndex,
  //             fieldListIndex,
  //             fieldIndex,
  //           );
  //           return false;
  //         }

  //         let has_error = false;
  //         if (is_advanced_expression) {
  //           const { setDefaultRuleValue, dispatch } = props;
  //           const formulaCode = jsUtils.get(
  //             currentField,
  //             [FIELD_KEYS.DEFAULT_DRAFT_VALUE, DEFAULT_RULE_KEYS.INPUT],
  //             EMPTY_STRING,
  //             );
  //           const { INCORRECT_SYNTAX } = FORMULA_BUILDER(t).VALIDATION.LABEL;
  //           await dispatch(globalFormulaBuilderEvaluateThunk(formulaCode))
  //           .then(() => true)
  //           .catch(({ error }) => {
  //               if (!jsUtils.isEmpty(error)) {
  //                 has_error = true;
  //                 const serverErrorMessage = jsUtils.get(Object.values(error), [0], EMPTY_STRING);
  //                 const message = serverErrorMessage ? `${INCORRECT_SYNTAX}: ${serverErrorMessage}` : INCORRECT_SYNTAX;
  //                 setDefaultRuleValue(
  //                     DEFAULT_RULE_KEYS.ERRORS,
  //                     {
  //                     [DEFAULT_RULE_KEYS.INPUT]: message,
  //                     },
  //                     sectionIndex,
  //                     fieldListIndex,
  //                     fieldIndex);
  //               }
  //             });
  //           return !has_error;
  //         }
  //       }
  //     }
  //     if (
  //       index === FIELD_CONFIGS.VISIBILITY.TAB_INDEX &&
  //       !jsUtils.isEmpty(data_list_id) &&
  //       (jsUtils.isEmpty(dataFieldsTypeAndSection.form_details) ||
  //         !dataFieldsTypeAndSection.form_details.sections[sectionIndex] ||
  //         (fieldIndex !== null
  //           ? !jsUtils.get(dataFieldsTypeAndSection, [
  //             'sections',
  //             sectionIndex,
  //             'field_list',
  //             fieldListIndex,
  //             'fields',
  //             fieldIndex,
  //             'field_uuid',
  //           ])
  //           : !jsUtils.get(dataFieldsTypeAndSection, [
  //             'sections',
  //             sectionIndex,
  //             'field_list',
  //             fieldListIndex,
  //             'table_uuid',
  //           ])))
  //     ) {
  //       const errorList = validate(
  //         getFormDetailsValidationData(dataFieldsTypeAndSection),
  //         getformDetailValidationSchema(),
  //       );
  //       if (!jsUtils.isEmpty(errorList)) {
  //         onDataListStateChange(errorList, 'error_list');
  //         return false;
  //       }
  //       if (jsUtils.isEmpty(errorList) && fieldListIndex !== null && fieldIndex === null) {
  //         const status = onSaveFormField(
  //           sectionIndex + 1,
  //           fieldListIndex,
  //           fieldIndex !== null ? fieldIndex + 1 : null,
  //           true,
  //         );
  //         if (!status) return false;
  //       }
  //     }
  //     if (currentIndex === FIELD_CONFIGS.VISIBILITY.TAB_INDEX) {
  //       const fieldData =
  //         fieldIndex !== null
  //           ? jsUtils.get(dataFieldsTypeAndSection, [
  //             'sections',
  //             sectionIndex,
  //             'field_list',
  //             fieldListIndex,
  //             'fields',
  //             fieldIndex,
  //           ])
  //           : jsUtils.get(dataFieldsTypeAndSection, [
  //             'sections',
  //             sectionIndex,
  //             'field_list',
  //             fieldListIndex,
  //           ]);
  //       if (
  //         fieldIndex !== null
  //           ? fieldData[FIELD_KEYS.IS_SHOW_WHEN_RULE]
  //           : fieldData[FIELD_LIST_KEYS.IS_FIELD_LIST_SHOW_WHEN_RULE]
  //       ) {
  //         const { allSections: validatedSections, has_validation } = validateExpressionAndUpdateField(fieldData, sectionIndex, fieldListIndex, fieldIndex, isNull(fieldIndex), dataFieldsTypeAndSection.sections);
  //         onDataListStateChange(validatedSections, 'sections');
  //         if (has_validation) {
  //           return false;
  //         }
  //       }
  //     }
  //     return true;
  //   };

  // const onDeleteForm = () => {};

  const getFormBuilder = (isDataLoading) => {
    const clonedState = cloneDeep(dataFieldsTypeAndSection);
    const updateSections = (sections, validateSection = false, sectionUUID = EMPTY_STRING) => {
      const { setState, state = {}, validateFormDetails } = props;
      let { error_list = {} } = cloneDeep(state);
      let error = {};
      if (validateSection) {
        if (sectionUUID) {
          let sectionHasError = false;
          Object.keys(error_list)?.forEach((key) => {
            if (key === `${sectionUUID},${REQUEST_SAVE_FORM.SECTION_NAME}`) {
              sectionHasError = true;
              delete error_list[`${sectionUUID},${REQUEST_SAVE_FORM.SECTION_NAME}`];
            }
          });
          if (sectionHasError) {
            const sectionIndex = sections.findIndex((eachSection) => eachSection.section_uuid === sectionUUID);
            if (sectionIndex > -1) {
              error = validateFormDetails?.([cloneDeep(get(sections, [sectionIndex], {}))]);
            }
          }
        } else {
          error = validateFormDetails?.(cloneDeep(sections));
          error_list = {};
        }
      }
      setState({
        sections: sections,
        error_list: { ...error_list, ...error },
      });
    };

    const validatePostSaveField = (sectionData, sectionUUID) => {
      const { setState, state, validateFormDetails } = props;
      const { error_list, sections } = cloneDeep(state);
      const sectionIndex = sections.findIndex((eachSection) => eachSection.section_uuid === sectionUUID);
      if (sectionIndex > -1) {
          set(sections, [sectionIndex], {
              ...get(sections, [sectionIndex], {}),
              ...(sectionData || {}),
          });
      }
      const sectionList = [cloneDeep({ ...get(sections, [sectionIndex], {}), ...(sectionData || {}) })];
      const error = validateFormDetails?.(sectionList);
      // const error = {};
      Object.keys(error_list)?.forEach((key) => {
        if (key.includes(sectionUUID)) delete error_list[key];
      });
      setState({ error_list: { ...error_list, ...error } });
    };

    const saveFieldHandler = (data, path, sectionUUID, sectionData, onSuccess, onError) => {
      if (sectionData) {
        const { parentNodeUuid, fieldOrder } = getParentNodeUuidFromTree(sectionData, path);
        const fieldNodeUuid = data?.node_uuid || uuidv4();
        const postData = {
          ...data,
          data_list_id: data_list_id,
          form_uuid: clonedState?.form_details?.form_uuid,
          node_uuid: fieldNodeUuid,
          parent_node_uuid: parentNodeUuid,
          section_uuid: sectionUUID,
          is_field_show_when_rule: data.is_field_show_when_rule || false,
          is_save: false,
          order: fieldOrder,
          validations: data.validations || {},
        };
        saveField(postData).then((res) => {
          onSuccess?.(res, fieldNodeUuid, validatePostSaveField);
        }).catch((err) => {
          onError?.(err);
        });
      }
    };

    const saveTableHandler = (data, path, sectionUUID, sectionData, onSuccess, onError) => {
      const metadata = {
        data_list_id: data_list_id,
        form_uuid: clonedState?.form_details?.form_uuid,
        section_uuid: sectionUUID,
      };
      if (!isEmpty(sectionData)) {
        const { parentNodeUuid } = getParentNodeUuidFromTree(sectionData, path);
        const nodeUUID = data?.node_uuid || uuidv4();
        const postData = {
          ...data,
          ...metadata,
          parent_node_uuid: parentNodeUuid,
          node_uuid: nodeUUID,
        };
        saveTable(postData)
        .then((res) => onSuccess?.(res, nodeUUID, validatePostSaveField))
        .catch((err) => onError?.(err));
      }
    };

    const onSaveField = (type, data, path, sectionUUID, sectionData, onSuccess, onError) => {
        switch (type) {
          case FIELD_ACTION_TYPE.FIELD:
            saveFieldHandler(data, path, sectionUUID, sectionData, onSuccess, onError);
            break;
          case FIELD_ACTION_TYPE.TABLE:
            saveTableHandler(data, path, sectionUUID, sectionData, onSuccess, onError);
           break;
          default: break;
        }
    };

    const isLayoutConstructed = sections?.[0]?.layout;
    return !isDataLoading && isLayoutConstructed && (
      // <>asdf</>
      // <FormBuilder
      //   isDataList
      //   userDetails={userProfileData}
      //   formType={FORM_TYPES.CREATION_FORM}
      //   isDataLoading={isDataLoading}
      //   parentModuleType={FORM_PARENT_MODULE_TYPES.DATA_LIST}
      //   onSectionTitleChangeHandler={onSectionTitleChangeHandler}
      //   sectionTitle={sectionTitle}
      //   sectionTitleError={sectionTitleError}
      //   onSectionAddButtonClick={onSectionAddButtonClick}
      //   sections={sections}
      //   getNewInputId={getNewInputId}
      //   onLabelChangeHandler={onLabelChangeHandler}
      //   onLabelBlurHandler={onLabelBlurHandler}
      //   onReferenceNameChangeHandler={onReferenceNameChangeHandler}
      //   onReferenceNameBlurHandler={onReferenceNameBlurHandler}
      //   onDefaultChangeHandler={onDefaultChangeHandler}
      //   onRequiredClickHandler={onRequiredClickHandler}
      //   onReadOnlyClickHandler={onReadOnlyClickHandler}
      //   onOtherConfigChangeHandler={onOtherConfigChangeHandler}
      //   onFormFieldChangeHandler={onFormFieldChangeHandler}
      //   deleteFormFieldHandler={deleteFormFieldHandler}
      //   getMoreDependency={getMoreDependency}
      //   deleteFormFieldFromDependencyConfig={
      //     deleteFormFieldFromDependencyConfig
      //   }
      //   dependencyConfigCloseHandler={dependencyConfigCloseHandler}
      //   dependencyConfigCancelHandler={dependencyConfigCancelHandler}
      //   dependencyConfigData={getDependencyConfigData(
      //     FORM_PARENT_MODULE_TYPES.DATA_LIST,
      //     dataFieldsTypeAndSection,
      //   )}
      //   // onOtherConfigBlurHandler={onOtherConfigBlurHandler}
      //   onValidationConfigChangeHandler={onValidationConfigChangeHandler}
      //   // onValidationConfigBlurHandler={onValidationConfigBlurHandler}
      //   onTableNameBlurHandler={onTableNameBlurHandler}
      //   onTableReferenceNameChangeHandler={onTableReferenceNameChangeHandler}
      //   onTableReferenceNameBlurHandler={onTableReferenceNameBlurHandler}
      //   error_list={error_list}
      //   datalist_selector_error_list={datalist_selector_error_list}
      //   server_error={server_error}
      //   onSaveFormField={onSaveFormField}
      // //  deleteFormField={deleteFormField}
      //   onAddValues={onAddValues}
      //   onAddedSectionTitleChangeHandler={onAddedSectionTitleChangeHandler}
      //   onDeleteSectionHandler={onDeleteSectionHandler}
      //   onFormFieldOpenAndCloseHandler={onFormFieldOpenAndCloseHandler}
      //   onEditFieldClick={onEditFieldClick}
      //   hideTitle
      //   showOnlyNewFormFieldsDropdown
      //   onFieldDragEndHandler={onFieldDragEndHandler}
      //   onSectionDragEndHandler={onSectionDragEndHandler}
      //   onDefaultValueRuleHandler={onDefaultValueRuleHandler}
      //   onDefaultRuleOperatorDropdownHandler={
      //     onDefaultRuleOperatorDropdownHandler
      //   }
      //   onDefaultRuleOperatorInfoHandler={onDefaultRuleOperatorInfoHandler}
      //   onDefaultLValueRuleHandler={onDefaultLValueRuleHandler}
      //   onDefaultRValueRuleHandler={onDefaultRValueRuleHandler}
      //   onDefaultExtraOptionsRuleHandler={onDefaultExtraOptionsRuleHandler}
      //   getDefaultRuleByIdApiThunk={getDefaultRuleByIdApiThunk}
      //   getRuleDetailsByIdInFieldVisibilityApi={
      //     getRuleDetailsByIdInFieldVisibilityApi
      //   }
      //   getVisibilityExternalFields={getVisibilityExternalFieldApi}
      //   getTableValidationFields={getTableValidationFieldApi}
      //   isDataListForm
      //   taskId={jsUtils.get(dataFieldsTypeAndSection, [
      //     'form_details',
      //     'data_list_id',
      //   ])}
      //   addFormFieldsDropdownVisibilityData={
      //     addFormFieldsDropdownVisibilityData
      //   }
      //   setAddFormFieldsDropdownVisibility={(visibility) =>
      //     onDataListStateChange(
      //       visibility,
      //       'addFormFieldsDropdownVisibilityData',
      //     )
      //   }
      //   setAdditionalErrorList={setAdditionalErrorList}
      //   lookupListDropdown={lookupDropdown}
      //   lookupLoadDataHandler={loadDataHandler}
      //   onLookupFieldChangeHandler={onLookupFieldChangeHandler}
      //   getDataListPropertyApi={getDataListPropertyApi}
      //   onDefaultValueCalculationTypeHandler={onDefaultValueCalculationTypeHandler}
      //   onDefaultRuleAdvanceCodeInputHandler={onDefaultRuleAdvanceCodeInputHandler}
      //   onDefaultRuleAdvanceCodeErrortHandler={onDefaultRuleAdvanceCodeErrortHandler}
      //   disableDefaultValueConfig={isEmpty(jsUtils.get(dataFieldsTypeAndSection, ['form_details'], {}))}
      //   onSectionTitleBlurHandler={onSectionTitleBlurHandler}
      //   onUserSelectorDefaultValueChangeHandler={onUserSelectorDefaultValueChangeHandler}
      // />
      <Form
        moduleType={MODULE_TYPES.DATA_LIST}
        saveField={onSaveField}
        formType={FORM_TYPE.CREATION_FORM}
        metaData={{
          formUUID: clonedState?.form_details?.form_uuid,
          moduleId: data_list_id,
        }}
        sections={sections || []}
        fields={fields}
        onFormConfigUpdate={updateSections}
        errorList={cloneDeep(error_list)}
        showSectionName={clonedState?.form_details?.show_section_name || false}
        userProfileData={getUserProfileData()}
      />
    );
  };
  const promptBeforeLeaving = (location) => {
    if ((location.pathname !== SIGNIN) && blockNavigation) {
      handleBlockedNavigation(
        t,
        () => {
          setNavigationBlockerStatus(false);
        },
        history,
        location,
      );
    } else return true;
    return false;
  };

  const { isFormDetailsLoading } = props;
  const formBuilder = getFormBuilder(isFormDetailsLoading);
  const enablePrompt = !isFormDetailsLoading && isEditDatalist && !isEmpty(dataListId);

  return (
    <>
      <Prompt when={enablePrompt} message={promptBeforeLeaving} />
      {!hideTitle &&
      <FormTitle
        className={cx(gClasses.PT0)}
        isDataLoading={isFormDetailsLoading}
        type={FORM_TITLE_TYPES.TYPE_1}
      >
        {DATALIST_FORM_TITLE(t)}
      </FormTitle>
      }
      {true && formBuilder}
    </>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(AddDataSetFields);
