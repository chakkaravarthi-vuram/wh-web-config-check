import React, { useContext, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Prompt, useHistory } from 'react-router-dom';
import gClasses from 'scss/Typography.module.scss';
import cx from 'classnames';
import { useSelector } from 'react-redux';
import { toastPopOver, EToastType, WorkHallPageLoader } from '@workhall-pvt-lmt/wh-ui-library';
import DatalistsCreateEditDetails from './datalists_create_edit_details/DatalistsCreateEditDetails';
import DatalistsCreateEditHeader from './datalists_create_edit_header/DatalistsCreateEditHeader';
import { DatalistReducer, DL_ACTIONS, useDatalistReducer } from './useDatalistReducer';
import { cloneDeep, isEmpty } from '../../../utils/jsUtility';
import { handleBlockedNavigation, isBasicUserMode, routeNavigate, setLoaderAndPointerEvent, setUserProfileData, somethingWentWrongErrorToast, validate } from '../../../utils/UtilityFunctions';
import { securityDataValidationSchema } from './datalists_create_edit_details/datalists_create_edit_set_security/DatalistSecurity.validate.schema';
import { getDataListDraftApi, publishDataListApi, saveDataListApi } from '../../../axios/apiService/dataList.apiService';
import { constructGetDataForDataList, constructSaveDataListPostData, constructSecurityDataForValidation, formatPublishError, getErrorTabs, getServerValidationErrorTabs } from './DatalistsCreateEdit.utils';
import { EDIT_DATALIST_HEADER_TYPE, ERROR_LIST_TYPE } from './DatalistsCreateEdit.constant';
import { addOnDataSchema } from './datalists_create_edit_details/datalists_create_edit_language_and_others/DatalistLanguageAndOthers.validate.schema';
import { basicDetailsSchema } from '../data_list_landing/datalist_header/edit_datalist/DatalistEditBasicDetails.validate.schema';
import { validatePolicy } from '../../edit_flow/security/policy_builder/PolicyBuilder.utils';
import { ROUTE_METHOD } from '../../../utils/Constants';
import { DATALIST_OVERVIEW, EDIT_DATA_LIST, LIST_DATA_LIST, MY_DRAFT_DATALIST } from '../../../urls/RouteConstants';
import { updateSomeoneIsEditingPopover as datalistUpdateSomeoneIsEditingPopover } from '../../../redux/actions/CreateDataList.action';
import styles from './DatalistsCreateEdit.module.scss';
import { getSectionFieldsFromLayout } from '../../form/sections/form_layout/FormLayout.utils';
import { formatValidationMessages } from '../../task/task/Task.utils';
import { datalistFormValidationSchema } from '../../flow/create_data_list/CreateDataList.validation.schema';
import { getAccountConfigurationDetailsApiService } from '../../../axios/apiService/accountConfigurationDetailsAdmin.apiService';
import { validateFormDetails } from '../../shared_container/individual_entry/summary_builder/SummaryBuilder.utils';
import { displayErrorToast } from '../../../utils/flowErrorUtils';
import { FLOW_STRINGS } from '../../edit_flow/EditFlow.strings';
import ThemeContext from '../../../hoc/ThemeContext';
import { INDIVIDUAL_ENTRY_TAB_TYPES } from '../../shared_container/individual_entry/IndividualEntry.strings';
import { CREATE_APP_STRINGS } from '../../application/create_app/CreateApp.strings';
import { ERROR_TYPE_PATTERN_BASE_ERROR } from '../../../utils/ServerValidationUtils';

function DatalistsCreateEdit() {
    const [currentTab, setCurrentTab] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [isPublishing, setIsPublishing] = useState(false);
    const [commonErrorList, setCommonErrorList] = useState({});
    const { state: dataListData, dispatch } = useDatalistReducer();
    const errorList = dataListData?.errorList || {};
    const { t } = useTranslation();
    const history = useHistory();
    const { pageMetadata } = useSelector((store) => store.IndividualEntryReducer);
    const { colorScheme, colorSchemeDefault } = useContext(ThemeContext);
    const isBasicUser = isBasicUserMode(history);
    const colorSchema = isBasicUser ? colorScheme : colorSchemeDefault;
    // server error handling
    const [errorTabs, setErrorTabs] = useState([]);

    const dataListUUID = history?.location?.state?.data_list_uuid || history?.location?.state?.dataListUuid;
    const blockNavigationRef = useRef(true);

    console.log('dlErrx', dataListData, errorTabs, currentTab);

    const promptBeforeLeaving = (location) => {
        if (
          !location.pathname.includes(EDIT_DATA_LIST) &&
          blockNavigationRef.current
        ) {
          handleBlockedNavigation(
            t,
            () => {
              blockNavigationRef.current = false;
            },
            history,
            location,
          );
          return false;
        }
        return true;
      };

    const onUpdateTabError = (localErrors, tabType) => {
        if (isEmpty(localErrors)) {
            const filteredErrorTabs = (errorTabs || []).filter((eTab) => eTab !== tabType);
            setErrorTabs(filteredErrorTabs);
           }
    };

    // Trigger Error Updater
    const onUpdateError = (localErrors, type) => {
        switch (type) {
            case ERROR_LIST_TYPE.SECURITY:
                dispatch(DL_ACTIONS.UPDATE_ERROR_LIST, {
                    ...errorList,
                    securityError: localErrors,
                });
            break;
            case ERROR_LIST_TYPE.ADD_ON:
                dispatch(DL_ACTIONS.UPDATE_ERROR_LIST, {
                    ...errorList,
                    addOnError: localErrors,
                });
            break;
            case ERROR_LIST_TYPE.BASIC_DETAILS:
                dispatch(DL_ACTIONS.UPDATE_ERROR_LIST, {
                    ...errorList,
                    basicDetailsError: localErrors,
                });
            break;
            case ERROR_LIST_TYPE.DATA_REPORT:
                onUpdateTabError(localErrors, EDIT_DATALIST_HEADER_TYPE.ALL_DATA_REPORT);
                dispatch(DL_ACTIONS.UPDATE_ERROR_LIST, {
                    ...errorList,
                    dataReportError: localErrors,
                });
            break;
            case ERROR_LIST_TYPE.INDIVIDUAL_ENTRY:
                onUpdateTabError(localErrors, EDIT_DATALIST_HEADER_TYPE.DATA_DASHBOARD);
                dispatch(DL_ACTIONS.UPDATE_ERROR_LIST, {
                    ...errorList,
                    individualEntryError: localErrors,
                });
            break;
            default: break;
        }
    };

    const commonValidator = (data, schema, type) => {
        const errorList = validate(data, schema);
        onUpdateError(errorList, type);
        return errorList;
    };

    const navigateBack = (toDraft = false) => {
        blockNavigationRef.current = false;
        routeNavigate(history, ROUTE_METHOD.PUSH, `${LIST_DATA_LIST}${toDraft ? MY_DRAFT_DATALIST : DATALIST_OVERVIEW}`);
    };

    const getTabWiseValidation = (data = null, isBasicDetails = false) => {
        let localErrorList = {};
        switch (currentTab) {
            case EDIT_DATALIST_HEADER_TYPE.DATA: {
                const validateFormDetails = () => {
                    const clonedState = cloneDeep(dataListData?.formData);
                    const sectionsData = cloneDeep(clonedState?.sections);
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
                      validate(
                        { sections: flattenedSectionWithFields },
                        datalistFormValidationSchema(t),
                      ),
                      cloneDeep(flattenedSectionWithFields),
                    );
                };
                const formError = validateFormDetails();
                localErrorList = formError;
                dispatch(DL_ACTIONS.FORM_DATA_CHANGE, { ...dataListData?.formData, errorList: formError || {} });
            }
            break;
            case EDIT_DATALIST_HEADER_TYPE.SECURITY: {
                const currentData = data || dataListData?.security;
                localErrorList = commonValidator(constructSecurityDataForValidation(currentData), securityDataValidationSchema(t), ERROR_LIST_TYPE.SECURITY);
                // policy ErrorCheck
                if (currentData?.isRowSecurityPolicy) {
                    const { validatedPolicyList, isAnyPolicyHasValidation, userFieldPolicyErrorList, commonErrorList } = validatePolicy(currentData?.security_policies);
                    dispatch(DL_ACTIONS.SECURITY_DATA_CHANGE, { ...currentData, security_policies: validatedPolicyList });
                    if (isAnyPolicyHasValidation) {
                        localErrorList.isAnyPolicyHasValidation = isAnyPolicyHasValidation;
                        localErrorList.userFieldPolicyErrorList = userFieldPolicyErrorList;
                        localErrorList.commonErrorList = commonErrorList;
                    }
                }
            }
            break;
            case EDIT_DATALIST_HEADER_TYPE.ADD_ON:
                localErrorList = commonValidator(data || dataListData?.addOn, addOnDataSchema(t), ERROR_LIST_TYPE.ADD_ON);
            break;
            case EDIT_DATALIST_HEADER_TYPE.ALL_DATA_REPORT:
                localErrorList = errorList?.dataReportError;
            break;
            case EDIT_DATALIST_HEADER_TYPE.DATA_DASHBOARD: {
                const clonePageMetadata = cloneDeep(pageMetadata);
                if (
                  clonePageMetadata.type ===
                  INDIVIDUAL_ENTRY_TAB_TYPES.PAGE_BUILDER
                ) {
                  localErrorList = validateFormDetails?.(
                    cloneDeep(clonePageMetadata?.formMetadata?.sections || []),
                    t,
                  );
                  if (!isEmpty(localErrorList)) {
                    displayErrorToast(
                      FLOW_STRINGS.SERVER_RESPONSE
                        .FORM_CONFIGURATION_VALIDATION,
                    );
                  }
                  setCommonErrorList({
                    dashboardErrors: {
                      sectionError: localErrorList,
                    },
                  });
                }
            }
            break;
            default:
            break;
        }
        if (isBasicDetails) {
            localErrorList = commonValidator(data || dataListData?.basicDetails, basicDetailsSchema(t), ERROR_LIST_TYPE.BASIC_DETAILS);
        }
        return localErrorList;
    };

    // save dataList API
    const saveDataList = (isInitial = false, initialData = {}, isPublish = false, onSuccess = null, tab = null, isSaveAndClose = false, basicDetailsData = {}) => {
        if (isPublish) {
            const prePublishErrorList = getTabWiseValidation();
                if (!isEmpty(prePublishErrorList)) return;
            setIsPublishing(true);
        }
        setLoaderAndPointerEvent(true);
        const postDataListData = cloneDeep(dataListData);
        if (!isEmpty(basicDetailsData)) {
            postDataListData.basicDetails = basicDetailsData;
        }
        const payload = constructSaveDataListPostData(postDataListData, dataListUUID, isInitial, initialData, tab, !isEmpty(basicDetailsData) ? 0 : currentTab, isSaveAndClose);
        saveDataListApi(payload).then((data) => {
            const constructedData = constructGetDataForDataList(data);
            dispatch(DL_ACTIONS.DATA_CHANGE, constructedData);
            onSuccess?.();
            if (!isEmpty(errorTabs) && !isSaveAndClose) {
                const localErrorTabs = getErrorTabs(constructedData?.validationMessage);
                setErrorTabs(localErrorTabs);
            }

            if (isPublish) {
                // tabwise server error handling
                const { serverErrorList, localErrorTabs, localFormErrors, localDataReportErrors, localIndividualEntryErrors } = getServerValidationErrorTabs(constructedData?.validationMessage, constructedData?.formData?.sections, t);
                setErrorTabs(localErrorTabs);
                setCommonErrorList({
                  formErrors: localFormErrors,
                  dataReportErrors: localDataReportErrors,
                  individualEntryErrors: localIndividualEntryErrors,
                });
                dispatch(DL_ACTIONS.UPDATE_ERROR_LIST, serverErrorList);
                if (!isEmpty(localErrorTabs)) {
                    setIsPublishing(false);
                    setLoaderAndPointerEvent(false);
                    setIsLoading(false);
                    return;
                }

                const params = { data_list_uuid: dataListUUID };
                // publish api loaders
                setLoaderAndPointerEvent(true);
                publishDataListApi(params).then((data) => {
                    setLoaderAndPointerEvent(false);
                    console.log('publish dl res', data);
                    toastPopOver({
                        title: t('common_strings.form_popover_strings.datalist_published_successfully'),
                        toastType: EToastType.success,
                    });
                    navigateBack();
                }).catch((err) => {
                    const { localErrorTabs, serverErrorList } = formatPublishError(err, { t });
                    setErrorTabs(localErrorTabs);
                    dispatch(DL_ACTIONS.UPDATE_ERROR_LIST, serverErrorList);
                    console.log('publish dl err', err);
                    if (isEmpty(localErrorTabs)) {
                        somethingWentWrongErrorToast(t('error_popover_status.unable_to_publish'));
                    }
                }).finally(() => {
                    setLoaderAndPointerEvent(false);
                    setIsPublishing(false);
                    setIsLoading(false);
                });
            } else {
                setLoaderAndPointerEvent(false);
                setIsLoading(false);
            }
        }).catch((err) => {
            setLoaderAndPointerEvent(false);
            setIsLoading(false);
            setIsPublishing(false);
            if (err?.[0]?.field === 'data_list_name' &&
                err?.[0]?.type === ERROR_TYPE_PATTERN_BASE_ERROR) {
                onUpdateError({ dataListName: CREATE_APP_STRINGS(t).APP_NAME.ALPHANUMBERIC_ERROR }, ERROR_LIST_TYPE.BASIC_DETAILS);
            }
            if (err?.[0]?.type === 'someone_editing') {
                datalistUpdateSomeoneIsEditingPopover(err[0].message, initialData?.id || dataListData?.id, dataListUUID);
            } else if (!(err?.[0]?.field === 'data_list_name' &&
                err?.[0]?.type === ERROR_TYPE_PATTERN_BASE_ERROR)) {
                somethingWentWrongErrorToast();
            }
        });
    };

    // getting DL data
    const getDataListData = () => {
        setLoaderAndPointerEvent(true);
        const params = {
            data_list_uuid: dataListUUID,
        };
        getDataListDraftApi(params).then((data) => {
            const constructedData = constructGetDataForDataList(data);
            dispatch(DL_ACTIONS.DATA_CHANGE, constructedData);
            saveDataList(true, constructedData);
        }).catch((err) => {
            console.log('get dl data err', err);
            somethingWentWrongErrorToast();
            setIsLoading(false);
            setLoaderAndPointerEvent(false);
        });
    };

    useEffect(() => {
        getDataListData();
        getAccountConfigurationDetailsApiService().then(setUserProfileData);
    }, []);

    const onTabChangeHandler = (tab) => {
        if (tab === currentTab) return;
        const returnedErrorList = getTabWiseValidation();
        if (tab) {
            if (isEmpty(returnedErrorList)) {
                saveDataList(false, {}, false, () => setCurrentTab(tab), tab);
            }
        }
    };

    // Data Change
    const onDataChangeHandler = (data, type = DL_ACTIONS.DATA_CHANGE) => {
        dispatch(type, data);
        const hasError = Object.values(errorList).some((obj) => Object.keys(obj).length > 0);
        if (hasError) {
            getTabWiseValidation(data, type === DL_ACTIONS.BASIC_DATA_CHANGE);
        }
    };

    const onSaveBasicDetailsHandler = (currentData, onSuccess) => {
        const localErrorList = commonValidator(currentData, basicDetailsSchema(t), ERROR_LIST_TYPE.BASIC_DETAILS);
        if (isEmpty(localErrorList)) {
            const successFunction = () => {
                onSuccess?.();
                dispatch(DL_ACTIONS.BASIC_DATA_CHANGE, currentData);
            };
            saveDataList(null, null, false, successFunction, null, false, currentData);
        }
        return null;
    };

    // header sav and close handler
    const onSaveAndCloseHandler = () => {
        const onSuccessFucntion = () => {
            toastPopOver({
                title: t('common_strings.form_popover_strings.datalist_saved_successfully'),
                toastType: EToastType.success,
            });
            navigateBack(true);
        };
        saveDataList(false, {}, false, onSuccessFucntion, null, true);
    };

    const onPublishClickHandler = () => {
        const onSuccessFunction = () => {
        };
        saveDataList(false, {}, true, onSuccessFunction);
    };

    if (isLoading) {
        return <WorkHallPageLoader color={colorSchema?.activeColor && colorSchema?.activeColor} className={gClasses.H100} />;
    }

    return (
      <div
        className={cx(
          gClasses.DisplayFlex,
          gClasses.FlexDirectionColumn,
          gClasses.Height100Vh,
          gClasses.PositionRelative,
        )}
      >
        <Prompt when message={promptBeforeLeaving} />
        <DatalistsCreateEditHeader
          version={dataListData?.version}
          currentTab={currentTab}
          onTabChangeHandler={onTabChangeHandler}
          basicDetails={dataListData?.basicDetails}
          onSaveBasicDetails={onSaveBasicDetailsHandler}
          errorList={errorList}
          onDataChangeHandler={onDataChangeHandler}
          onSaveAndClose={onSaveAndCloseHandler}
          onPublish={onPublishClickHandler}
          dataListID={dataListData?.id}
          dataListUUID={dataListUUID}
          onDiscardDelete={navigateBack}
          errorTabs={errorTabs}
          getTabWiseValidation={getTabWiseValidation}
          isUsersDataList={dataListData?.isSystemDefined}
        />
        <DatalistsCreateEditDetails
          dataListUUID={dataListUUID}
          dataListData={dataListData}
          dataListID={dataListData?.id}
          currentTab={currentTab}
          onDataChangeHandler={onDataChangeHandler}
          dispatch={dispatch}
          commonErrorList={commonErrorList}
          onUpdateError={onUpdateError}
        />
        {isPublishing && (
          <div className={styles.PublishingLoader}>
            <WorkHallPageLoader
              color={colorSchema?.activeColor && colorSchema?.activeColor}
              className={gClasses.H100}
            />
          </div>
        )}
      </div>
    );
}

function ProviderDatalistsCreateEdit(props) {
  return (
    <DatalistReducer>
      <DatalistsCreateEdit {...props} />
    </DatalistReducer>
  );
}

export default ProviderDatalistsCreateEdit;
