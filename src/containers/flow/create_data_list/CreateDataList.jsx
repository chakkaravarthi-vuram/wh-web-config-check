import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import cx from 'classnames/bind';
import { withRouter } from 'react-router-dom';

// components
import { FORM_POPOVER_STATUS, FLOW_MIN_MAX_CONSTRAINT, ROUTE_METHOD } from 'utils/Constants';
import UpdateConfirmPopover from 'components/update_confirm_popover/UpdateConfirmPopover';
import ModalLayout from 'components/form_components/modal_layout/ModalLayout';
import ConfirmationModal from 'components/form_components/confirmation_modal/ConfirmationModal';
import { clearFormulaBuilderValues } from 'redux/reducer/FormulaBuilderReducer';
import { store } from 'Store';
import queryString from 'query-string';
import { consolidateMetricFields, getBasicUsernamesFromUserDetails } from 'containers/edit_flow/EditFlow.utils';
import { useTranslation } from 'react-i18next';
import { DASHBOARD_ADMIN_VALIDATION_MESSAGE } from 'components/form_builder/section/form_fields/FormField.strings';
import { VALIDATION_CONSTANT } from 'utils/constants/validation.constant';
import { EButtonType, ETitleSize, Modal, ModalSize, ModalStyleType, Title, Button as LibraryButton } from '@workhall-pvt-lmt/wh-ui-library';
import BasicDetails from './basic_details/BasicDetails';
import AddDataSetFields from './add_data_set_fields/AddDataSetFields';
import CustomLink from '../../../components/form_components/link/Link';
import Button, { BUTTON_TYPE } from '../../../components/form_components/button/Button';
import HeaderAndBodyLayout from '../../../components/header_and_body_layout/HeaderAndBodyLayout';
import DeleteDataList from '../delete_data_list/DeleteDataList';

// funcs
import {
  getDataListBasicDetailsSelector,
  getDataListBasicPostDetailsSelector,
  getSaveDataListPostDetailsSelector,
  getDataFieldsTypeAndSectionSelector,
  getDataListInitialDataLoading,
  getDataListFromDetailsLoading,
  getsaveDataListValidateSecurityDataSelector,
} from '../../../redux/selectors/CreateDataList.selectors';
import {
  saveDataListApiThunk, publishDataListApiThunk,
  saveFormApiThunkDataList, getDataListDetailsByIdApiThunk,
  getDataListFormDetailsByidApiThunk,
  discardDataListApiThunk,
  validateFormApiThunk,
} from '../../../redux/actions/CreateDataList.action';
import { dataListStateChangeAction, dataListClearAction, createDatalistChange, dataListValuesStateChangeAction } from '../../../redux/reducer/CreateDataListReducer';
import {
  validate,
  mergeObjects,
  isMobileScreen,
  onWindowResize,
  updateAlertPopverStatus,
  clearAlertPopOverStatus,
  editDiscardExit,
  routeNavigate,
  getRouteLink,
  showToastPopover,
} from '../../../utils/UtilityFunctions';
import { basicDataListDetailsValidationSchema, dataListNameValidation, securityValidateSchema, datalistDescriptionValidation, datalistFormValidationSchema, addOnSettingsSchema } from './CreateDataList.validation.schema';
import jsUtils, { cloneDeep, isEmpty } from '../../../utils/jsUtility';

// css,strings,constants
import gClasses from '../../../scss/Typography.module.scss';
import { ARIA_ROLES, BS } from '../../../utils/UIConstants';
import styles from './CreateDataList.module.scss';
import { FLOW_STRINGS, CREATE_FLOW_TAB_INDEX } from '../Flow.strings';
import { EMPTY_STRING } from '../../../utils/strings/CommonStrings';
import { DL_SECONDARY_ACTIONS_LIST, getDataListDetailsPostData, getDatalistSecondaryActionMenu, getReassignedOwnersValidations } from './CreateDataList.utility';
import ResponseHandler from '../../../components/response_handlers/ResponseHandler';
import { CREATE_DATA_LIST_STRINGS } from './CreateDataList.strings';
import * as ROUTE_CONSTANTS from '../../../urls/RouteConstants';
import FlowSettingsConfiguration from './settings/settings_configuration/SettingsConfiguration';
import { getSectionAndFieldsFromResponse, getSectionFieldsFromLayout } from '../../form/sections/form_layout/FormLayout.utils';
import { formatValidationMessages } from '../../task/task/Task.utils';
import Header from '../../../components/header_and_body_layout/Header';
import { validatePolicy } from '../../edit_flow/security/policy_builder/PolicyBuilder.utils';
import { saveFormWithField } from '../../../axios/apiService/createTaskFromPrompt.apiService';
import { DashboardConfig } from '../../shared_container';
import CloseIconV2 from '../../../assets/icons/CloseIconV2';

function CreateDataList(props) {
  const {
    basicDataListDetails,
    basicDataListDetails: {
      tabIndex,
      isShortCodeEdited = false,
      data_list_name,
      data_list_description,
      data_list_uuid,
      flowSettingsModalVisibility,
      // data_list_short_code,
      data_list_id,
      status,
      version,
    },
    error_list,
    onPublishDataList,
    onSaveDataList,
    onDataListClearAction,
    server_error,
    dataListUuid, // from location state
    isEditInitialLoading,
    isEditFormDetailsLoading,
    isEditDataListView,
    isDraft,
    security,
    is_system_defined,
    onDataListDataChange,
    saveDataListPostDetails,
    dataListState,
    dataListState: {
      currentSettingsPage,
    },
    history,
    discardDataListApiCall,
    formPopoverStatus,
    isUpdateInProgress,
    clearFormulaBuilderValues,
  } = props;
  console.log('dataListStatex', dataListState);
  const { t } = useTranslation();
  const pageTitle = isEditDataListView ? FLOW_STRINGS(t).CREATE_DATA_LIST.EDIT_TITLE : FLOW_STRINGS(t).CREATE_DATA_LIST.TITLE;
  const errors = mergeObjects(server_error, error_list);
  const containerCompRef = useRef(null);
  const buttonContainerCompRef = useRef(null);
  const currentComponentCompRef = useRef(null);
  const {
    PUBLISH,
    SAVE_AND_CLOSE,
    BACK,
    NEXT,
    CANCEL,
  } = FLOW_STRINGS(t).CREATE_FLOW.ACTION_BUTTONS;
  const [editLoadError, setEditLoadError] = useState(false);
  const [, setIsMobile] = useState(isMobileScreen());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [headerTabIndex, setHeaderTabIndex] = useState(2);
  const windowResize = () => {
    setIsMobile(isMobileScreen());
  };
  useEffect(() => {
    const { onDataListStateChange } = props;
    if (isModalOpen) {
      onDataListStateChange(data_list_name, 'temp_data_list_name');
      onDataListStateChange(data_list_description, 'temp_data_list_desc');
    }
  }, [isModalOpen]);

  useEffect(
    () => () => {
      clearFormulaBuilderValues();
      onDataListClearAction();
      if (containerCompRef && buttonContainerCompRef && currentComponentCompRef) {
        let listHeight = 0;
        if (!jsUtils.isNull(containerCompRef.current)) {
          listHeight =
            containerCompRef.current.clientHeight -
            buttonContainerCompRef.current.clientHeight;
          if (currentComponentCompRef.current) { currentComponentCompRef.current.style.height = `${listHeight - 160}px`; } // 60px hardcoded assign to a dynamic variable(subtracting footer height)
        }
      }
      onWindowResize(windowResize);
      return () => window.removeEventListener('resize', windowResize);
    },
    [],
  );

  const validateSaveDatalistSecurityData = () => {
    const { saveDataListValidateSecurityData } = props;
    let errorList = {};
    const entryAddersError = validate(saveDataListValidateSecurityData, securityValidateSchema);
    const clonedSavePublishDataList = jsUtils.cloneDeep(saveDataListPostDetails);
    const reassignedOwnersValidations = getReassignedOwnersValidations(clonedSavePublishDataList?.reassignedOwners);
    const basicUserNamesFromFlowOwner = getBasicUsernamesFromUserDetails(jsUtils.get(clonedSavePublishDataList, ['owners', 'users'], []));

    if (!isEmpty(basicUserNamesFromFlowOwner)) {
      errorList = {
        ...(errorList || {}),
        owners: `${basicUserNamesFromFlowOwner} ${DASHBOARD_ADMIN_VALIDATION_MESSAGE}`,
      };
    }
     if (!isEmpty(entryAddersError)) {
      errorList = {
        ...(errorList || {}),
        entry_adders: `${t(VALIDATION_CONSTANT.ATLEAST_ONE_ADDER_REQUIRED)}`,
      };
    }
    if (reassignedOwnersValidations && !isEmpty(reassignedOwnersValidations)) errorList.reassignedOwners = reassignedOwnersValidations;
    const policyObject = {};
    if (dataListState?.is_row_security_policy) {
        const { validatedPolicyList, isAnyPolicyHasValidation, userFieldPolicyErrorList, commonErrorList } = validatePolicy(dataListState?.policyList);
        policyObject.policyList = validatedPolicyList;
        policyObject.securityPolicyErrorList = commonErrorList;
        policyObject.policyListHasValidation = isAnyPolicyHasValidation;
        policyObject.userFieldPolicyErrorList = userFieldPolicyErrorList;
        if (isAnyPolicyHasValidation) {
          errorList = { ...(errorList || {}), policyListError: true };
        }
    }
    onDataListDataChange({ ...dataListState, ...policyObject, error_list: errorList });
    return isEmpty(errorList);
  };

  const validateAddOnSettings = () => {
    const { saveDataListPostDetails, onDataListStateChange } = cloneDeep(props);
      const error_list = validate(
        {
          data_list_short_code: saveDataListPostDetails.data_list_short_code,
          technical_reference_name: saveDataListPostDetails.technical_reference_name,
          is_system_identifier: saveDataListPostDetails.is_system_identifier,
          custom_identifier: saveDataListPostDetails?.custom_identifier || null,
        },
        addOnSettingsSchema(t),
      );
      if (!isEmpty(error_list)) {
        onDataListStateChange(error_list, 'error_list');
      }
      return isEmpty(error_list);
    };

  useEffect(() => {
    if (!jsUtils.isEmpty(error_list)) validateSaveDatalistSecurityData();
    if (containerCompRef && buttonContainerCompRef && currentComponentCompRef) {
      let listHeight = 0;
      if (!jsUtils.isNull(containerCompRef.current)) {
        listHeight =
          containerCompRef.current.clientHeight -
          buttonContainerCompRef.current.clientHeight;
        if (currentComponentCompRef.current) { currentComponentCompRef.current.style.height = `${listHeight - 160}px`; } // 60px hardcoded assign to a dynamic variable(subtracting footer height)
      }
    }
  }, [security.entry_adders]);

  const onDataListBasicDetailsChangeHandler = (event) => {
    const { onDataListStateChange, basicDataListDetails } = props;
    if (!isEmpty(error_list?.data_list_name) || !isEmpty(error_list?.data_list_description)) {
      const validationDetails = {
        ...basicDataListDetails,
        data_list_name: event.target.id === 'data_list_name' ? event.target.value : dataListState?.data_list_name,
        data_list_description: event.target.id === 'data_list_description' ? event.target.value : dataListState?.data_list_desc,
      };
      const errorList = validate(validationDetails, basicDataListDetailsValidationSchema(t));
      !isEmpty(errorList) && onDataListStateChange(errorList, 'error_list');
    }
    onDataListStateChange(event.target.value, event.target.id);
    if (!data_list_uuid && (event.target.id === 'data_list_short_code' || event.target.id === 'data_list_name')) {
    if (event.target.id === 'data_list_name') {
      const shortCodeName = event.target.value.replace(/[^a-zA-Z0-9 ]/g, '').toUpperCase().trim();
      const shortCode = shortCodeName.split(' ');
      let code = shortCode.toString();
      if (shortCode.length < 2) {
        code = code.slice(0, 3);
      } else if (shortCode.length === 2) {
        const firstWord = shortCode[0];
        const secondWord = shortCode[1];
        code = `${firstWord[0] || ''}${(firstWord[1] || '')}${secondWord[0] || ''}`;
      } else if (shortCode.length >= 3) {
        const firstWord = shortCode[0];
        const secondWord = shortCode[1];
        const thirdWord = shortCode[2];
        code = `${firstWord[0] || ''}${secondWord[0] || ''}${thirdWord[0] || ''}`;
      }
      onDataListStateChange(event.target.value, event.target.id);
      !isShortCodeEdited && onDataListStateChange(code, 'data_list_short_code');
    } else {
      onDataListStateChange(true, 'isShortCodeEdited');
      const format = /^[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]*$/;
      let val = (event.target.value).toString().toUpperCase();
      val = val.slice(val.length - 1, val.length);
      if (!(format.test(val)) || event.target.value === '') {
        onDataListStateChange(event.target.value.toUpperCase(), event.target.id);
      }
    }
  }
  // if (!isEmpty(error_list)) {
  //   const validationDetails = {
  //     ...basicDataListDetails,
  //     data_list_name: event.target.id === 'data_list_name' ? event.target.value : dataListState?.data_list_name,
  //     data_list_description: event.target.id === 'data_list_description' ? event.target.value : dataListState?.data_list_desc,
  //   };
  //   const errorList = validate(validationDetails, basicDataListDetailsValidationSchema(t));
  //   !isEmpty(errorList) && onDataListStateChange(errorList, 'error_list');
  // }
  // onDataListStateChange(event.target.value, event.target.id);
  };

//   const dataListDataOnChangeHandler = (event, isOnBlur) => {
//     const { onDataListStateChange } = props;
//     const { error_list } = props;
//     let errorList = jsUtils.cloneDeep(error_list);
//     const { id } = event.target;
//     let { value } = event.target;
//     console.log(value, 'jklhjkhh', error_list, id);
//     if (jsUtils.has(errorList, [id]) || isOnBlur) {
//         if (isOnBlur) value = (value || EMPTY_STRING).trim();
//         const errorObj = validate({ [id]: value }, constructJoiObject({ [id]: basicDataListSchema(t)[id] }));
//         console.log('errorobjsdwe', errorObj);
//         if (!jsUtils.isEmpty(errorObj)) {
//         if (errorObj[id]) {
//           errorList = {
//                 ...errorList,
//                 [id]: errorObj[id],
//             };
//         } else delete errorList[id];
//       } else delete errorList[id];
//     }
//     onDataListStateChange(value, id);
//     onDataListStateChange(errorList, 'error_list');
//     console.log('error_liststateeee', errorList);
// };

  const onDataListNextButtonClicked = async (event) => {
    if (event) {
      event.preventDefault();
    }
    const { basicDataListPostDetails, onDataListStateChange, isFromPromptCreation, dispatch } = props;
    const existingSections = cloneDeep(dataListState?.sections);
    const errorList = validate(
      basicDataListPostDetails,
      basicDataListDetailsValidationSchema(t),
      t,
    );
    onDataListStateChange(errorList, 'error_list');
    if (jsUtils.isEmpty(errorList)) {
      const state = await onSaveDataList(
        basicDataListPostDetails,
        null,
        false,
        false,
        false,
        null,
        true,
        { isFromPromptCreation, existingSection: dataListState?.sections },
        );
        const { _id } = state;

      let newSections = null;
      if (isEmpty(existingSections)) {
        newSections = jsUtils.get(state, ['form_metadata', 'sections'], []);
      } else if (isFromPromptCreation) {
        const postData = {
          sections: existingSections,
          data_list_id: _id,
          form_uuid: jsUtils.get(state, ['form_metadata', 'form_uuid'], null),
        };
        const routeObj = {
          pathname: getRouteLink(`${ROUTE_CONSTANTS.EDIT_DATA_LIST}`, history),
          state: { data_list_uuid: state?.data_list_uuid },
        };
        history.push(routeObj);
        const response = await saveFormWithField(postData);
        newSections = cloneDeep(response?.sections);

        const formData = {
          form_uuid: response?.form_uuid,
          sections: newSections,
          show_section_name: (Array.isArray(newSections) ? newSections.length : 0) > 1,
        };

        const { sections, fields } = getSectionAndFieldsFromResponse(newSections || []);

        dispatch(
          dataListValuesStateChangeAction([
            { id: 'form_details', value: formData },
            { id: 'sections', value: sections },
            { id: 'fields', value: fields },
          ]),
        );
      }

      // routing from create
      if (state) {
        const routeObj = {
          pathname: getRouteLink(`${ROUTE_CONSTANTS.EDIT_DATA_LIST}`, history),
          state: { data_list_uuid: state?.data_list_uuid },
        };
        history.push(routeObj);
      }

      if (_id && newSections.length && isFromPromptCreation) {
          onDataListDataChange({ isFromPromptCreation: false });
      }
    }

    return errorList;
  };
  useEffect(() => {
    if (isEditDataListView && dataListUuid) {
      if (editLoadError) setEditLoadError(false);
      const { getDataListDetailsByIdApi } = props;
      getDataListDetailsByIdApi({ data_list_uuid: dataListUuid }).then(async (response) => {
        if (response) {
          await onSaveDataList({
            technical_reference_name: response.technical_reference_name,
            data_list_description: response.data_list_description,
            data_list_name: response.data_list_name,
            data_list_short_code: response.data_list_short_code,
            data_list_uuid: response.data_list_uuid,
            add_form: true,
            send_policy_fields: true,
          });
        } else setEditLoadError(true);
      }).catch(() => setEditLoadError(true));
    } else if (isEditDataListView && isEmpty(dataListUuid)) {
      routeNavigate(history, ROUTE_METHOD.PUSH, ROUTE_CONSTANTS.HOME);
    } else {
      const { isFromPromptCreation } = props;
      if (isFromPromptCreation) {
        console.log('dc creation use effect');
        const { sections } = dataListState;
        console.log('filescheck sections ', sections);
        onDataListNextButtonClicked(null);
      }
    }

    if (containerCompRef && buttonContainerCompRef && currentComponentCompRef) {
      let listHeight = 0;
      if (!jsUtils.isNull(containerCompRef.current)) {
        listHeight =
          containerCompRef.current.clientHeight -
          buttonContainerCompRef.current.clientHeight;
        if (currentComponentCompRef.current) { currentComponentCompRef.current.style.height = `${listHeight - 160}px`; } // 60px hardcoded assign to a dynamic variable(subtracting footer height)
      }
    }
  }, [dataListUuid]);

  const validateFormDetails = (updatedSections = []) => {
    const { dataFieldsTypeAndSection } = props;
    const clonedState = jsUtils.cloneDeep(dataFieldsTypeAndSection);
    const sections = cloneDeep(clonedState.sections);
    const sectionsData = !isEmpty(updatedSections) ? cloneDeep(updatedSections) : cloneDeep(sections);
    const flattenedSectionWithFields = [];
    sectionsData?.forEach((eachSection) => {
      const sectionFields = [];
      eachSection?.layout?.forEach((eachLayout) => {
        const fields = getSectionFieldsFromLayout(eachLayout);
        sectionFields.push(...fields);
      });
      flattenedSectionWithFields.push({
        section_name: eachSection?.section_name,
        section_order: eachSection?.section_order,
        section_uuid: eachSection?.section_uuid,
        is_section_show_when_rule: eachSection?.is_section_show_when_rule,
        fields: sectionFields,
      });
    });
    return formatValidationMessages(
      validate({ sections: flattenedSectionWithFields },
        datalistFormValidationSchema(t)),
      cloneDeep(flattenedSectionWithFields),
    );
  };

  const onPublishButtonClick = async (tabIndex, t) => {
    const { onDataListStateChange, dataFieldsTypeAndSection, dispatch } = props;
    const clonedState = jsUtils.cloneDeep(dataFieldsTypeAndSection);
    let errorList = validateFormDetails();
    const nameError = validate({ data_list_name }, dataListNameValidation(t));
    const descriptionError = validate({ data_list_description }, datalistDescriptionValidation(t));
    errorList = { ...(errorList || {}), ...(nameError || {}), ...(descriptionError || {}) };
    onDataListStateChange(errorList, 'error_list');
    console.log('all errors', errorList);

    if (!jsUtils.isEmpty(errorList)) {
      const sectionTitleError = Object.keys(errorList).toString().includes('section_name');
      const sectionError = Object.keys(errorList).toString().includes('sections');
      if (isEmpty(clonedState.sections) && sectionError) {
        showToastPopover(
          FLOW_STRINGS(t).CREATE_DATA_LIST.SECTION_WITHOUT_FIELDLIST_TITLE,
          FLOW_STRINGS(t).CREATE_DATA_LIST.SECTION_WITHOUT_CONTENT,
          FORM_POPOVER_STATUS.SERVER_ERROR,
          true,
        );
      }
      if (sectionTitleError) {
        showToastPopover(
          `Section name length must be ${FLOW_MIN_MAX_CONSTRAINT.SECTION_NAME_MIN_VALUE} to ${FLOW_MIN_MAX_CONSTRAINT.SECTION_NAME_MAX_VALUE} characters long`,
          EMPTY_STRING,
          FORM_POPOVER_STATUS.SERVER_ERROR,
          true,
        );
      } else {
        let sectionWithoutFieldList = 0;
        const clonedSection = jsUtils.cloneDeep(clonedState.sections);
        clonedSection.forEach((section) => {
          if ((section.field_list || []).length === 0) {
            sectionWithoutFieldList++;
          }
        });
        if (sectionWithoutFieldList !== 0) {
          showToastPopover(
            FLOW_STRINGS(t).CREATE_DATA_LIST.SECTION_WITHOUT_FIELDLIST_TITLE,
            FLOW_STRINGS(t).CREATE_DATA_LIST.SECTION_WITHOUT_FIELDLIST_SUBTITLE,
            FORM_POPOVER_STATUS.SERVER_ERROR,
            true,
          );
        }
      }
    } else {
      // try {
      //   if (data_list_uuid) { // getting any possible form errors from BE API
      //   const formData = getFormDetailsAPIDataDataList(jsUtils.cloneDeep(dataFieldsTypeAndSection), null, null, true);
      //   if (jsUtils.has(formData, ['sections']) && formData.sections.length) {
      //     await saveFormApiThunk({ data: formData });
      //     }
      //   }
      // } catch (e) {
      //   console.log('clicked 1 error', e);
      // }
      dispatch(validateFormApiThunk(
        { data_list_id: data_list_id },
        () => {
          if (jsUtils.isEmpty(store.getState().CreateDataListReducer.server_error)) {
            onDataListDataChange({
              ...dataListState,
              security: {
                ...dataListState?.security,
                entityViewers: cloneDeep(dataListState?.security?.entityViewersMetaData) || {},
              },
              tabIndex: tabIndex,
              flowSettingsModalVisibility: true,
              currentSettingsPage: 0,
              policyList: dataListState?.policyListMetaData || [],
              is_row_security_policy: !isEmpty(dataListState?.policyListMetaData),
            });
          }
        },
      ));
    }
  };

  const handleSettingsCloseHandler = () => {
    const clonedMetrics = jsUtils.cloneDeep(saveDataListPostDetails.metrics);
    const save_data = {
      tabIndex: 2,
      flowSettingsModalVisibility: false,
      metrics: {
        metric_fields: consolidateMetricFields(
          jsUtils.get(clonedMetrics, ['metric_fields'], []),
         ),
        isShowMetricAdd: false,
        lstAllFields: [],
        l_field: EMPTY_STRING,
        err_l_field: {},
      },
      currentSettingsPage: 0,
    };
    onDataListDataChange(save_data);
  };

  const savePublishDataList = async () => {
    const { history } = props;
    const clonedSavePublishDataList = jsUtils.cloneDeep(saveDataListPostDetails);
    const publishPostData = getDataListDetailsPostData(clonedSavePublishDataList, true);
    const savePostData = getDataListDetailsPostData(clonedSavePublishDataList);
    savePostData.has_system_events = false;
    if (validateSaveDatalistSecurityData() && validateAddOnSettings()) await onSaveDataList(savePostData, null, false, () => onPublishDataList(publishPostData, history, t));
  };

  const saveDraft = async (isSaveAndCloseClicked = false) => {
    const { saveDataListPostDetails } = props;
    const postData = getDataListDetailsPostData(jsUtils.cloneDeep(saveDataListPostDetails));
    // if (data_list_uuid) {
    //   const formData = getFormDetailsAPIDataDataList(jsUtils.cloneDeep(dataFieldsTypeAndSection), null, null, true);
    //   if (jsUtils.has(formData, ['sections']) && formData.sections.length) {
    //     await saveFormApiThunk({ data: formData });
    //   }
    // }
    if (isSaveAndCloseClicked) postData.is_save_close = true;
    await onSaveDataList(postData);
  };

  const saveAndClose = async () => {
    const { history } = props;
    await saveDraft(true);
    routeNavigate(history, ROUTE_METHOD.PUSH, `${ROUTE_CONSTANTS.LIST_DATA_LIST}${ROUTE_CONSTANTS.DATALIST_OVERVIEW}`);
  };

  const onSubmitEditBasicDetails = async () => {
    const { basicDataListPostDetails, onDataListStateChange } = props;
    const errorList = validate(basicDataListPostDetails, basicDataListDetailsValidationSchema(t));
    if (isEmpty(errorList)) {
      await saveDraft(true);
    } else onDataListStateChange(errorList, 'error_list');
    return errorList;
  };

  const onCancelButtonClick = () => {
    const { history } = props;
    const currentParams = jsUtils.get(queryString.parseUrl(history.location.pathname), ['query'], {});
    delete currentParams.create;
    const createDataListSearchParams = new URLSearchParams(currentParams).toString();
    routeNavigate(history, ROUTE_METHOD.PUSH, EMPTY_STRING, createDataListSearchParams);
  };

  const onGoBackDiscardButton = () => {
    const { history, isEditDataListView } = props;
    if (isEditDataListView) {
      const editMode = 'DL';
      editDiscardExit(history, editMode);
      return;
    }
    routeNavigate(history, ROUTE_METHOD.GO_BACK);
  };

  let currentFlowScreen = null;
  let flowSettingsModal = null;
  let deleteDataListModal = null;
  const elements = {
    currentComponent: null,
    backButton: null,
    nextButton: null,
    secondaryActionButton: null,
  };
  const { onDataListStateChange } = props;
  // const topRightActionButtons = !isEditFormDetailsLoading && (
  //   <div className={cx(gClasses.CenterV)}>
  //     <Button
  //       buttonType={BUTTON_TYPE.OUTLINE_PRIMARY}
  //       className={cx(gClasses.MR15, styles.SaveButton)}
  //       onClick={() => saveAndClose()}
  //     >
  //       {SAVE_AND_CLOSE}
  //     </Button>
  //     <Button
  //       buttonType={BUTTON_TYPE.PRIMARY}
  //       primaryButtonStyle={styles.PublishButton}
  //       onClick={() => onPublishButtonClick(CREATE_FLOW_TAB_INDEX.SECURITY, t)}
  //     >
  //       {PUBLISH}
  //     </Button>
  //     {!is_system_defined ?
  //       (
  //         <Dropdown
  //           className={cx(gClasses.ML20)}
  //           optionList={FLOW_STRINGS(t).EDIT_DATA_LIST(isDraft, status, version_number).MENU_DROPDOWN_LIST}
  //           onChange={(event) => {
  //             onDataListStateChange(event.target.value, 'editDataListDropdownSelectedValue');
  //           }}
  //           isBorderLess
  //           isNewDropdown
  //           isTaskDropDown
  //           placement={POPPER_PLACEMENTS.BOTTOM_END}
  //           fallbackPlacements={[POPPER_PLACEMENTS.TOP_END]}
  //           popperClasses={cx(gClasses.ZIndex5, gClasses.MT10, gClasses.ML10)}
  //           customDisplay={<MoreIcon />}
  //           outerClassName={gClasses.MinWidth0}
  //           noInputPadding
  //           comboboxClass={gClasses.MinWidth0}
  //         />
  //       ) : null}
  //   </div>
  // );
  // if (isEditDataListView) {
  const { editDataListDropdownSelectedValue } = props;
  if (editDataListDropdownSelectedValue === 1) {
    deleteDataListModal = (
      <DeleteDataList
        id="delete_datalist_modal"
        data_list_uuid={data_list_uuid}
        isModalOpen
        isDraft={isDraft}
        onCloseClick={() => {
          onDataListStateChange(0, 'editDataListDropdownSelectedValue');
        }}
        onCancelDeleteDataListClickHandler={() => {
          onDataListStateChange(0, 'editDataListDropdownSelectedValue');
        }}
      />
    );
  }
  if ((editDataListDropdownSelectedValue === 3) && ((status === 'published') || (version > 1))) {
    onDataListStateChange(0, 'editDataListDropdownSelectedValue');
    updateAlertPopverStatus({
      isVisible: true,
      customElement: (
        <UpdateConfirmPopover
          onYesHandler={async () => {
            if (!jsUtils.isUndefined(data_list_id)) {
              await discardDataListApiCall({
                data_list_id: data_list_id,
              });
            }
            clearAlertPopOverStatus();
            onGoBackDiscardButton();
          }}
          onNoHandler={() => clearAlertPopOverStatus()}
          title={(CREATE_DATA_LIST_STRINGS(t).DISCARD.TITLE)}
          subTitle={(CREATE_DATA_LIST_STRINGS(t).DISCARD.SUBTITLE)}
        />
      ),
    });
  }
  // }
  // const DLNameError = errors.data_list_name;
  // const DLDescriptionError = errors.data_list_description;

  const handleSecondaryActionChange = (selectedAction) => {
    if (selectedAction === DL_SECONDARY_ACTIONS_LIST.DISCARD) {
      updateAlertPopverStatus({
        isVisible: true,
        customElement: (
          <UpdateConfirmPopover
            onYesHandler={async () => {
              if (!jsUtils.isUndefined(data_list_id)) {
                await discardDataListApiCall({
                  data_list_id: data_list_id,
                });
              }
              clearAlertPopOverStatus();
              onGoBackDiscardButton();
            }}
            onNoHandler={() => clearAlertPopOverStatus()}
            title={CREATE_DATA_LIST_STRINGS(t).DISCARD.TITLE}
            subTitle={(CREATE_DATA_LIST_STRINGS(t).DISCARD.SUBTITLE)}
            titleStyle={gClasses.WhiteSpaceNoWrap}
            labelStyle={gClasses.AlignCenter}
          />
        ),
      });
    } else if (selectedAction === DL_SECONDARY_ACTIONS_LIST.EDIT_BASIC_DETAILS) {
      setIsModalOpen(true);
    }
    onDataListStateChange(selectedAction, 'editDataListDropdownSelectedValue');
  };

  const secondaryProps = {
    displaySecondaryActions: true,
    subMenuList: !is_system_defined && getDatalistSecondaryActionMenu(isDraft, status, version, t),
    primaryCTALabel: PUBLISH,
    primaryCTAClicked: () => onPublishButtonClick(CREATE_FLOW_TAB_INDEX.SECURITY, t),
    secondaryCTALabel: SAVE_AND_CLOSE,
    secondaryCTAClicked: () => saveAndClose(),
    subMenuItemClicked: handleSecondaryActionChange,
  };
  const headerElement = (
    // <div className={cx(BS.D_FLEX, BS.ALIGN_ITEM_CENTER)}>
    //   <Thumbnail
    //           className={gClasses.Margin0}
    //           type={FORM_PARENT_MODULE_TYPES.DATA_LIST}
    //           title={data_list_short_code}
    //           isLoading={isEditFormDetailsLoading}
    //           containerClassName={styles.Thumbnail}
    //           thumbNailIconClass={cx(styles.ThumbnailText, BS.D_FLEX, BS.JC_CENTER, BS.ALIGN_ITEM_CENTER)}
    //           customSvgHeight="27"
    //           customSvgWidth="24"
    //           isIconThumbnail
    //   />
    //   <div className={cx(gClasses.CenterV, BS.JC_BETWEEN, styles.HeaderWidth, BS.W100)}>
    //     <div className={cx(gClasses.ML10, gClasses.MR20, gClasses.OverflowHidden, gClasses.Flex1)}>
    //       <EditableLabel
    //         id="data_list_name"
    //         textClasses={cx(gClasses.HeadingTitle2)}
    //         className={cx(styles.DlName, !jsUtils.isEmpty(DLNameError) && gClasses.ErrorInputBorder)}
    //         placeholder={FLOW_STRINGS(t).CREATE_DATA_LIST.DATA_LIST_PLACEHOLDER}
    //         value={data_list_name}
    //         onChangeHandler={(event) => {
    //           dataListDataOnChangeHandler(event);
    //         }}
    //         onBlurHandler={(event) => dataListDataOnChangeHandler(event, true)}
    //         // errorMessage={errors.data_list_name}
    //         isDataLoading={isEditFormDetailsLoading}
    //       />
    //       {!jsUtils.isEmpty(DLNameError) && <Tooltip content={DLNameError} id="data_list_name" isCustomToolTip customInnerClasss={styles.TooltipError} customArrowClass={styles.TooltipArrow} placement="top" /> }
    //       <EditableLabel
    //         id="data_list_description"
    //         textClasses={cx(gClasses.FTwo13BlackV13, gClasses.Ellipsis)}
    //         className={cx(gClasses.MT5, !jsUtils.isEmpty(DLDescriptionError) && gClasses.ErrorInputBorder)}
    //         placeholder={FLOW_STRINGS(t).CREATE_DATA_LIST.DATA_LIST_DESCRIPTION}
    //         value={data_list_description}
    //         onChangeHandler={(event) => {
    //           dataListDataOnChangeHandler(event);
    //         }}
    //         onBlurHandler={(event) => dataListDataOnChangeHandler(event, true)}
    //         // errorMessage={errors.data_list_description}
    //         isDataLoading={isEditFormDetailsLoading}
    //         isEnableInputTooltip
    //       />
    //       {!jsUtils.isEmpty(DLDescriptionError) && <Tooltip content={DLDescriptionError} id="data_list_description" isCustomToolTip customInnerClasss={styles.TooltipError} customArrowClass={styles.TooltipArrow} placement="bottom" /> }
    //     </div>
    //     <div className={cx(gClasses.FlexShrink0)}>{topRightActionButtons}</div>
    //   </div>
    // </div>
    <Header
      pageTitle={history.location.pathname.toString().includes('editDatalist') ? t('datalist.create_data_list.edit_datalist') : t('datalist.create_data_list.create_datalist')}
      fieldLabel={t('datalist.create_data_list.datalist_name')}
      fieldValue={data_list_name}
      fieldClassName={gClasses.PL15}
      headerLabelClass={gClasses.WhiteSpaceNoWrap}
      headerValueClass={styles.DatalistName}
      tabOptions={[
        {
          labelText: 'Define Data',
          value: 1,
          tabIndex: 1,
          // Icon: ,
        },
        {
          labelText: 'Default Report',
          value: 2,
          tabIndex: 2,
          // Icon: QueriesTabIcon,
        },
      ]}
      selectedTabIndex={headerTabIndex}
      onTabItemClick={setHeaderTabIndex}
      subMenuClassName={gClasses.MR2}
      className={cx(gClasses.MT2, gClasses.MB2)}
      {...secondaryProps}
    />
  );

  elements.currentComponent = (
    <BasicDetails
      basicDetails={basicDataListDetails}
      onDataListBasicDetailsChangeHandler={onDataListBasicDetailsChangeHandler}
      error_list={errors}
    />
  );

  elements.nextButton = (
    <Button
      buttonType={BUTTON_TYPE.PRIMARY}
    // onClick={(event) => onDataListNextButtonClicked(event)}
    >
      Next
    </Button>
  );

  elements.backButton = <div>{EMPTY_STRING}</div>;

  elements.secondaryActionButton = (
    <CustomLink
      buttonType={BUTTON_TYPE.SECONDARY}
      // onClick={onCancelButtonClick}
    >
      Discard
    </CustomLink>
  );

  const startScreenActionButtons = (
    <div className={cx(gClasses.CenterV, gClasses.JusEnd, gClasses.MT32)}>
      <LibraryButton
        buttonText={CANCEL}
        noBorder
        className={cx(gClasses.MR24, gClasses.FontWeight500, styles.CancelButton)}
        onClickHandler={onCancelButtonClick}
      />
      <LibraryButton
          type={EButtonType.PRIMARY}
          buttonText={NEXT}
          onClickHandler={(event) => onDataListNextButtonClicked(event)}
      />
    </div>
  );

  if (tabIndex === CREATE_FLOW_TAB_INDEX.SECURITY) {
    const onBackClicked = () => {
      onDataListStateChange(currentSettingsPage - 1, 'currentSettingsPage');
    };

    const onNextClicked = async (nextPage) => {
      const clonedSavePublishDataList = jsUtils.cloneDeep(saveDataListPostDetails);
      const savePostData = { ...getDataListDetailsPostData(clonedSavePublishDataList), send_policy_fields: true };

      let errorList = false;

      if (currentSettingsPage === 0 && !validateSaveDatalistSecurityData()) {
        errorList = true;
      }
      if (currentSettingsPage === 2) {
        const error_list = validate(
          {
            data_list_short_code: clonedSavePublishDataList.data_list_short_code,
            technical_reference_name: clonedSavePublishDataList.technical_reference_name,
            is_system_identifier: clonedSavePublishDataList.is_system_identifier,
            custom_identifier: clonedSavePublishDataList?.custom_identifier,
          },
          addOnSettingsSchema(t),
        );
        if (!isEmpty(error_list)) {
          errorList = true;
          onDataListStateChange(error_list, 'error_list');
        }
      }

      if (!errorList) {
        await onSaveDataList(savePostData, null, false, false, true, nextPage);
        // onDataListStateChange(currentSettingsPage + 1, 'currentSettingsPage');
      }
    };

    const backButton = (
      <Button
      buttonType={BUTTON_TYPE.SECONDARY}
      className={cx(gClasses.MR15, styles.CommonButtonClass, styles.DirectionIcon)}
      onClick={() => onBackClicked()}
      previousArrow
      >
        {BACK}
      </Button>
    );

    const saveButton = (
      <Button
        className={cx(gClasses.MR20, gClasses.FTwo13)}
        onClick={() => saveAndClose()}
        buttonType={BUTTON_TYPE.OUTLINE_PRIMARY}
      >
        {SAVE_AND_CLOSE}
      </Button>
    );

    const publishButton = (
      <Button
        buttonType={BUTTON_TYPE.PRIMARY}
        className={cx(gClasses.MR20, gClasses.FTwo13)}
        onClick={() => savePublishDataList()}
      >
        {PUBLISH}
      </Button>
    );

    const nextButton = (
      <Button
        className={cx(gClasses.MR15, styles.CommonButtonClass, styles.PrimaryButtonClass)}
        buttonType={BUTTON_TYPE.PRIMARY}
        onClick={() => onNextClicked()}
        nextArrow
      >
        {NEXT}
      </Button>
    );

    const bottomActionButtons = (
      <div className={cx(gClasses.CenterV, styles.ButtonContainer, BS.W100, BS.D_FLEX, BS.JC_BETWEEN)}>
        <div className={cx(BS.D_FLEX, BS.JC_START)}>
          {currentSettingsPage !== 0 && backButton}
          {saveButton}
        </div>
        <div className={cx(BS.D_FLEX, BS.JC_END)}>
          {currentSettingsPage === 2 && publishButton}
          {currentSettingsPage !== 2 && nextButton}
        </div>
      </div>
    );

    flowSettingsModal = (
      <FlowSettingsConfiguration
        onNextClicked={onNextClicked}
        isEditDataListView={isEditDataListView}
        bottomActionButtons={bottomActionButtons}
        handleSettingsCloseHandler={handleSettingsCloseHandler}
        datalistDetails={dataListState}
        errorList={errors}
      />
    );
  }

  if (isEditDataListView && isUpdateInProgress) {
    const CONFIRMATION_CONTENT = CREATE_DATA_LIST_STRINGS(t).RESTRICT_EDIT_MODAL_INFO;
    return (
           <ConfirmationModal
              isModalOpen
              onConfirmClick={onCancelButtonClick}
              onCancelOrCloseClick={onCancelButtonClick}
              titleName={CONFIRMATION_CONTENT.TITLE}
              mainDescription={CONFIRMATION_CONTENT.MAIN_DESCRIPTION}
              subDescription={CONFIRMATION_CONTENT.SUB_DESCRIPTION}
              confirmationName={CONFIRMATION_CONTENT.PRIMARY_ACTION}
              noClickOutsideAction
              buttonContainerClass={styles.ConfirmationModalButtonContainer}
           />
       );
  }

  if ((data_list_uuid || (isEditDataListView)) && !editLoadError) {
    let formBodyContent = null;
    if (headerTabIndex === 1) {
      formBodyContent = (
        <AddDataSetFields
          isDataLoading={isEditInitialLoading}
          isFormDetailsLoading={isEditFormDetailsLoading}
          isEditDataListView={isEditDataListView}
          dataListId={data_list_id}
          validateFormDetails={validateFormDetails}
          hideTitle
        />
      );
    } else if (headerTabIndex === 2) {
      formBodyContent = <DashboardConfig dataListId={data_list_id} />;
    }
    currentFlowScreen = (
      <HeaderAndBodyLayout
        headerClass={cx(gClasses.P0, gClasses.BorderNoneImportant, gClasses.BoxShadowNone)}
        bodyClass={cx(gClasses.P0, gClasses.PB50Important, gClasses.OverflowYHiddenImportant)}
        bodyContent={formBodyContent}
        headerElement={headerElement}
      />
    );
  } else {
    currentFlowScreen = !formPopoverStatus.isEditConfirmVisible ? (
      <div className={cx(styles.StartScreenContainer, gClasses.ScrollBar)}>
        <div className={cx(gClasses.PageMainHeader, gClasses.TextAlignCenter)}>{pageTitle}</div>
        <div className={cx(styles.Label, styles.SubHeaderLabelMargin, gClasses.TextAlignCenter)}>{FLOW_STRINGS(t).CREATE_DATA_LIST.SUBTITLE}</div>
        {elements.currentComponent}
        {startScreenActionButtons}
      </div>
    ) : null;
  }

  if (isEditDataListView && editLoadError && !formPopoverStatus.isEditConfirmVisible) {
    return (
      <div className={cx(styles.ErrorContainer)}>
        <div
          className={cx(gClasses.CenterVH, BS.H100)}
        >
          <ResponseHandler
            messageObject={CREATE_DATA_LIST_STRINGS(t).EDIT_RESPONSE_HANDLER.MESAAGE_OBJECT}
          />
        </div>
      </div>
    );
  }
  const URLParams = new URLSearchParams(jsUtils.get(history, ['location', 'search'], ''));

  const editFlowScreen = (
    <div className={cx(styles.StartScreenContainer, gClasses.ScrollBar)}>
    <div className={cx(gClasses.PageMainHeader, gClasses.TextAlignCenter, gClasses.MB20)}>{t('datalist.create_data_list.edit_name_description')}</div>
      <BasicDetails
        isEditDatalist
        basicDetails={basicDataListDetails}
        onDataListBasicDetailsChangeHandler={onDataListBasicDetailsChangeHandler}
        error_list={errors}
      />
      <div className={cx(gClasses.CenterV, gClasses.FlexDirectionColumn)}>
        <Button
          className={cx(gClasses.MT10)}
          buttonType={BUTTON_TYPE.PRIMARY}
          onClick={async (event) => {
            const error = await onSubmitEditBasicDetails(event);
            if (isEmpty(error?.data_list_name) && isEmpty(error?.data_list_description)) {
              onDataListDataChange({ ...dataListState, data_list_name: data_list_name, data_list_description: data_list_description, temp_data_list_name: '', temp_data_list_desc: '', error_list: {} });
              setIsModalOpen(false);
            }
          }}
        >
          {t('common_strings.save')}
        </Button>
      </div>
    </div>
  );
  const modalHeaderContent = () => (
    <div className={cx(gClasses.CenterV, gClasses.JusEnd, gClasses.P24, gClasses.PB16)}>
        <button onClick={onCancelButtonClick}>
            <CloseIconV2
                className={cx(
                    gClasses.CursorPointer,
                )}
                role={ARIA_ROLES.IMG}
                height={16}
                width={16}
            />
        </button>
    </div>
);
const modalBodyContent = () => (
  <div className={gClasses.CenterH}>
      <div className={cx(gClasses.P24, gClasses.PT0, styles.CreateMaxWidth)}>
                  <Title className={cx(gClasses.TextAlignCenterImp, styles.TitleClass)} content={pageTitle} size={ETitleSize.small} />
          {elements.currentComponent}
          {startScreenActionButtons}
      </div>
  </div>
);

  return (
    <>
      { }
      {deleteDataListModal}
      {flowSettingsModalVisibility && flowSettingsModal}
      {/* <div className={cx(styles.Container)}>{currentFlowScreen}</div> */}
      {(URLParams.get('create') === 'datalist' || history.location.pathname === '/createDatalist' || history.location.pathname === '/data_lists/createDatalist') ? (
            (dataListState.isDataListModalDisabled) ? (
              <div className={cx(styles.Container, styles.FlowModalContainer)}>{currentFlowScreen}</div>
            ) : (
              <Modal
                  modalStyle={ModalStyleType.modal}
                  modalSize={ModalSize.full}
                  headerContent={modalHeaderContent()}
                  mainContent={modalBodyContent()}
                  isModalOpen
                  enableEscClickClose
                  onCloseClick={onCancelButtonClick}

              />
          )
        ) :
        (
            <div className={cx(styles.Container)}>{currentFlowScreen}</div>
        )}
      <ModalLayout
        id="edit_basic_details"
        isModalOpen={isModalOpen}
        onCloseClick={() => {
          onDataListDataChange({
            ...dataListState,
            data_list_name: dataListState.temp_data_list_name || dataListState.data_list_name,
            data_list_description: dataListState.temp_data_list_desc,
            temp_data_list_name: '',
            temp_data_list_desc: '',
            error_list: {},
          });
          setIsModalOpen(false);
        }}
        headerClassName={styles.CreateDataListHeader}
        mainContentClassName={styles.CreateDatalistContent}
        headerContent
        mainContent={(
          <div className={styles.ModalContainer}>
            <div className={cx(styles.Container)}>{editFlowScreen}</div>
          </div>
        )}
      />
    </>
  );
}

const mapStateToProps = (state, ownProps) => {
  return {
    dataListState: state.CreateDataListReducer,
    dataFieldsTypeAndSection: getDataFieldsTypeAndSectionSelector(state.CreateDataListReducer, ownProps.isEditDataListView),
    basicDataListDetails: getDataListBasicDetailsSelector(state.CreateDataListReducer),
    basicDataListPostDetails: getDataListBasicPostDetailsSelector(state.CreateDataListReducer),
    saveDataListPostDetails: getSaveDataListPostDetailsSelector(state.CreateDataListReducer),
    isEditInitialLoading: getDataListInitialDataLoading(state.CreateDataListReducer),
    isEditFormDetailsLoading: getDataListFromDetailsLoading(state.CreateDataListReducer),
    saveDataListValidateSecurityData: getsaveDataListValidateSecurityDataSelector(state.CreateDataListReducer),
    error_list: state.CreateDataListReducer.error_list,
    server_error: state.CreateDataListReducer.server_error,
    security: state.CreateDataListReducer.security,
    editDataListDropdownSelectedValue: state.CreateDataListReducer.editDataListDropdownSelectedValue,
    is_system_defined: state.DataListReducer.dataListSecurity.is_system_defined,
    formPopoverStatus: state.FormStatusPopoverReducer.formStatus,
    isUpdateInProgress: jsUtils.get(state, ['CreateDataListReducer', 'update_in_progress'], false),
    isFromPromptCreation: state.CreateDataListReducer.isFromPromptCreation,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onDataListStateChange: (data, id) => {
      dispatch(dataListStateChangeAction(data, id));
    },
    discardDataListApiCall: (data, closeFunction, historyObj) => {
      dispatch(discardDataListApiThunk(data, closeFunction, historyObj));
    },
    onSaveDataList: (...params) => dispatch(saveDataListApiThunk(...params)),
    saveFormApiThunk: (postData, isConfigPopupOpen, isClose) => dispatch(saveFormApiThunkDataList(postData, isConfigPopupOpen, isClose)),
    onPublishDataList: (postData, history, t) => {
      dispatch(publishDataListApiThunk(postData, history, t));
    },
    getDataListDetailsByIdApi: (params) => dispatch(getDataListDetailsByIdApiThunk(params)),
    getFormDetailsByIdApi: (params) => dispatch(getDataListFormDetailsByidApiThunk(params)),
    onDataListClearAction: () => {
      dispatch(dataListClearAction());
    },
    onDataListDataChange: (dataListData) => dispatch(createDatalistChange(dataListData)),
    clearFormulaBuilderValues: () => dispatch(clearFormulaBuilderValues()),
    dispatch,
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CreateDataList));
