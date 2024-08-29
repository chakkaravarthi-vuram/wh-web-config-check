import React, { useEffect, useState } from 'react';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';
import gClasses from 'scss/Typography.module.scss';
import { connect } from 'react-redux';
import { EButtonType, ETabVariation, Text } from '@workhall-pvt-lmt/wh-ui-library';
import { useHistory } from 'react-router-dom';

import { Prompt } from 'react-router-dom/cjs/react-router-dom';
import styles from '../Integration.module.scss';
import {
    INTEGRATION_STRINGS,
    INTEGRATION_TAB_OPTIONS,
    getEditIntegrationSecondaryActionMenu,
    FILTER_TYPE,
    WORKHALL_INTEGRATION_TAB_OPTIONS,
    constructConnectorPostData,
    AUTHENTICATION_TYPE_CONSTANTS,
    isAuthDetailsChanged,
    AUTHORIZATION_STATUS,
    EDIT_VIEW_INTEGRATION_TABS,
    EXTERNAL_VIEW_TABS,
    WORKHALL_VIEW_TABS,
    getIntegrationBreadcrumb,
    EXTERNAL_DB_CONNECTION_TAB_OPTIONS,
    DB_CONNECTOR_VIEW_TABS,
} from '../Integration.utils';
import Header from '../../../components/header_and_body_layout/Header';
import {
    ADMIN_INFO,
    CREATE_INTEGRATION,
    FEATURE_INTEGRATION_STRINGS,
    INTEGRATION_ERROR_STRINGS,
    SECONDARY_ACTIONS_LIST,
} from '../Integration.strings';
import {
    checkIntegrationDependencyApiThunk,
    deleteDBConnectorApiThunk,
    deleteIntegrationConnectorApiThunk,
    deleteWorkhallAPIConfigurationThunk,
    discardDBConnectorApiThunk,
    discardIntegrationConnectorApiThunk,
    discardWorkhallApiConfigurationThunk,
    getDBConnetorOptionsApiThunk,
    getSingleDBConnetorConfigurationApiThunk,
    getSingleIntegrationConnectorThunk,
    getSingleIntegrationTemplateApiThunk,
    getWorkhallApiConfigurationApiThunk,
    postIntegrationConnectorApiThunk,
    publishDBConnectorApiThunk,
    publishIntegrationConnectorApiThunk,
    saveDBConnectorPostApiThunk,
    workhallApiConfigurationPostApiThunk,
    workhallApiConfigurationPublishApiThunk,
} from '../../../redux/actions/Integration.Action';
import { integrationDataChange, INTEGRATION_DETAILS_INIT_DATA, dbConnectorDataChange } from '../../../redux/reducer/IntegrationReducer';
import {
    EXTERNAL_DB_CONNECTION,
    EXTERNAL_INTEGRATION,
    INTEGRATIONS,
    SIGNIN,
    WORKHALL_INTEGRATION,
} from '../../../urls/RouteConstants';
import EditExternalIntegration from '../add_integration/external_integration/EditExternalIntegration';
import EditWorkhallIntegration from '../add_integration/workhall_api/edit_workhall_integration/EditWorkhallIntegration';
import {
    apiConfigBodyValidationSchema,
    apiConfigurationReqResponseSchema,
    apiConfigurationSchema,
    draftIntegrationValidationSchema,
    overallIntegrationValidationSchema,
} from '../Integration.validation.schema';
import {
    handleBlockedNavigation,
    routeNavigate,
    showToastPopover,
    updatePostLoader,
    validate,
} from '../../../utils/UtilityFunctions';
import { FORM_POPOVER_STATUS, ROUTE_METHOD } from '../../../utils/Constants';
import {
    isEmpty,
    cloneDeep,
    pick,
} from '../../../utils/jsUtility';
import { getSubmissionDataForWorkhallApi } from '../add_integration/workhall_api/WorkhallApi.utils';
import ConfirmationModal from '../../../components/form_components/confirmation_modal/ConfirmationModal';
import DependencyHandler from '../../../components/dependency_handler/DependencyHandler';
import { INTEGRATION_CONSTANTS, INTEGRATION_DETAIL_ACTION } from '../Integration.constants';
import IntegrationNavIcon from '../../../assets/icons/side_bar/IntegrationNavIcon';
import ViewHeader from '../../landing_page/main_header/view_header/ViewHeader';
import WorkhallIconLetter from '../../../assets/icons/WorkhallIconLetter';
import EditIconPencil from '../../../assets/icons/integration/EditIconPencil';
import { EMPTY_STRING } from '../../../utils/strings/CommonStrings';
import { constructJoiObject } from '../../../utils/ValidationConstants';
import RightArrowIcon from '../../../assets/icons/header/RightIcon';
import AlertCircle from '../../../assets/icons/application/AlertCircle';
import DBConnector from '../add_integration/db_connector/DBConnector';
import { genreateSaveDBConnectorData } from '../add_integration/db_connector/DBConnector.utils';
import { dbConnectorAuthenticationSchema } from '../add_integration/db_connector/DBConnector.validation.schema';

let cancelTokenExternalApi;

export const getCancelTokenExternalApi = (cancelToken) => {
    cancelTokenExternalApi = cancelToken;
};

function EditIntegration(props) {
    const {
        clearIntegrationData,
        state,
        state: {
            name: connector_name,
            description,
            error_list,
            bodyError = {},
            isLoadingIntegrationDetail,
            version,
            isErrorInIntegrationDetail,
            _id,
            body,
            isDependencyListLoading,
            isErrorInLoadingDependencyList,
            isDependencyModalVisible,
            authentication_type,
            connector_logo,
            connector_events_count,
            dbConnector,
        },
        isEditView,
        handleEditClick,
        integrationTab,
        isNavOpen,
        postIntegrationConnectorApi,
        integrationDataChange,
        dbConnectorDataChange,
        uuidFromUrl,
        isFromEditPage = true,
        dependencyData,
        api_type,
        isInvalidUserModalOpen,
    } = props;
    const { t } = useTranslation();
    const [selectedIntegrationTab, setIntegrationTab] = useState(INTEGRATION_TAB_OPTIONS[0].tabIndex);
    const [errorTabList, setErrorTabList] = useState([]);
    const [confirmationModalId, setConfirmationModalId] = useState(null);
    const [blockNavigation, setNavigationBlockerStatus] = useState(true);
    let invalidUserModal = null;
    const [detailAction, setDetailViewAction] = useState(isEditView ? INTEGRATION_DETAIL_ACTION.EDIT : INTEGRATION_DETAIL_ACTION.VIEW);

    const { ADD_INTEGRATION } = INTEGRATION_STRINGS;
    const { EDIT_INTEGRATION } = CREATE_INTEGRATION;
    const { INTEGRATION_DEPENDENCY } = FEATURE_INTEGRATION_STRINGS;

    const history = useHistory();
    const onEditClick = () => {
        const { state: { connector_id, connector_uuid, template_id, api_configuration_uuid } } = props;
        handleEditClick({
            connector_id,
            connector_uuid,
            template_id,
            api_configuration_uuid,
        }, true);
    };

    const successCallback = (isSaveAndClose) => {
        setDetailViewAction(INTEGRATION_DETAIL_ACTION.SAVED);
        updatePostLoader(false);
        if (!isSaveAndClose) {
            showToastPopover(
                t(FEATURE_INTEGRATION_STRINGS.PUBLISHED.TITLE),
                t(FEATURE_INTEGRATION_STRINGS.PUBLISHED.SUBTITLE),
                FORM_POPOVER_STATUS.SUCCESS,
                true,
            );
        }
        integrationDataChange({ ...INTEGRATION_DETAILS_INIT_DATA });
    };

    useEffect(() => {
        if (detailAction === INTEGRATION_DETAIL_ACTION.SAVED) {
            const integrationsPathName = `${INTEGRATIONS}/${integrationTab}`;
            routeNavigate(history, ROUTE_METHOD.PUSH, integrationsPathName);
        }
    }, [detailAction]);

    useEffect(() => {
        if (!(isEmpty(error_list) && isEmpty(errorTabList) && isEmpty(bodyError) && isEmpty(dbConnector.error_list))) {
            const updatedErrorTabList = [];
            if (integrationTab === EXTERNAL_INTEGRATION) {
                const allErrorKeys = Object.keys(error_list);
                const authTabErrorKeys = [];
                allErrorKeys.forEach((key) => {
                    if (![
                        'name',
                        'admins',
                        'description',
                        'events_count',
                    ].includes(key)) {
                        authTabErrorKeys.push(key);
                    }
                });
                console.log(allErrorKeys, 'allErrorKeys allErrorKeys', connector_events_count, authTabErrorKeys);

                if (authTabErrorKeys.length > 0) {
                    updatedErrorTabList.push(EDIT_VIEW_INTEGRATION_TABS.AUTHENTICATION);
                }
                if (connector_events_count < 1) {
                    updatedErrorTabList.push(EDIT_VIEW_INTEGRATION_TABS.EVENTS);
                }
            } else if (integrationTab === WORKHALL_INTEGRATION) {
                const allErrorKeys = Object.keys(error_list);
                const credTabErrorKeys = [];
                const reqResTabErrorKeys = [];
                allErrorKeys.forEach((key) => {
                    if (![
                        'name',
                        'admins',
                        'description',
                    ].includes(key)) {
                        if (
                            key.includes('default_filter') ||
                            key.includes('query_params') ||
                            key.includes('body')
                        ) {
                            reqResTabErrorKeys.push(key);
                        } else credTabErrorKeys.push(key);
                    }
                });
                if (credTabErrorKeys.length > 0) {
                    updatedErrorTabList.push(EDIT_VIEW_INTEGRATION_TABS.CREDENTIALS);
                }
                if (reqResTabErrorKeys.length > 0 || !isEmpty(bodyError)) {
                    updatedErrorTabList.push(EDIT_VIEW_INTEGRATION_TABS.REQUEST_RESPONSE);
                }
            } else if (integrationTab === EXTERNAL_DB_CONNECTION) {
                const allErrorKeys = Object.keys(dbConnector.error_list);
                const authTabErrorKeys = [];
                allErrorKeys.forEach((key) => {
                    if (![
                        'name',
                        'admins',
                        'description',
                        'query_count',
                    ].includes(key)) {
                        authTabErrorKeys.push(key);
                    }
                });

                if (authTabErrorKeys.length > 0) {
                    updatedErrorTabList.push(EDIT_VIEW_INTEGRATION_TABS.AUTHENTICATION);
                }
                if (allErrorKeys.includes('query_count')) {
                    updatedErrorTabList.push(EDIT_VIEW_INTEGRATION_TABS.QUERIES);
                }
            }
            setErrorTabList(updatedErrorTabList);
        }
    }, [Object.keys(error_list)?.length, Object.keys(bodyError)?.length, Object.keys(dbConnector.error_list)?.length]);

    const validateWorkhallApiData = (state, isSaveAndClose, isInitialSave = false) => {
        const postData = getSubmissionDataForWorkhallApi(state, true);
        let dataToBeValidated = {
            ...postData,
        };
        let schema = apiConfigurationSchema(t, api_type, authentication_type);
        if (isSaveAndClose) {
            dataToBeValidated = {
                type: postData.type,
                default_filter: postData.default_filter,
                query_params: postData.query_params,
            };
            schema = constructJoiObject(apiConfigurationReqResponseSchema());
        }
        const errorData = validate(
            dataToBeValidated,
            schema,
        );
        console.log(errorData, postData, 'gjkhjkdkgjkd');
        let bodyError = {};
        if (!isEmpty(postData?.body)) {
            bodyError = validate(
                body,
                apiConfigBodyValidationSchema(t),
            );
            console.log(errorData, postData?.body, 'gjkhjkdkgjkd dfdfdf', bodyError);
        }
        if (!isInitialSave) {
            integrationDataChange({
                error_list: errorData,
                bodyError,
            });
        }
        return {
            errorData,
            bodyError,
            postData,
        };
    };

    const publishWorkhallIntegration = async () => {
        const { errorData, bodyError, postData } = validateWorkhallApiData(state);
        if (isEmpty(errorData) && isEmpty(bodyError)) {
            const { workhallApiConfigurationPostApi, workhallApiConfigurationPublishApi } = props;
            try {
                const responseData = await workhallApiConfigurationPostApi(postData, true, t);
                await workhallApiConfigurationPublishApi({
                    api_configuration_uuid: responseData?.api_configuration_uuid,
                }, successCallback, t);
            } catch (error) {
                console.log('unable to publish api configuration', error);
            }
        } else {
            showToastPopover(
                t(INTEGRATION_ERROR_STRINGS.CONFIG),
                EMPTY_STRING,
                FORM_POPOVER_STATUS.SERVER_ERROR,
                true,
            );
        }
    };

    const validateExternalDBConnectorData = (
      state,
      isPublish = false,
      isSaveAndClose = false,
    ) => {
      const errorList = validate(
        {
          ...state.authentication,
          query_count: state.totalQueryCount,
          isSaveAndClose,
          isPublish,
        },
        dbConnectorAuthenticationSchema(t),
      );
      let postData = {};
      if (isEmpty(errorList)) {
        postData = genreateSaveDBConnectorData(
          state.authentication,
          state._id,
          state.db_connector_uuid,
          isSaveAndClose,
        );
      } else {
        dbConnectorDataChange({
          error_list: errorList,
        });
      }
      return { errorList, postData };
    };

    const publishExternalDBConnector = async () => {
      const { errorList, postData } = validateExternalDBConnectorData(dbConnector, true);
      if (isEmpty(errorList)) {
        const { saveDBConnectorPostApi, publishDBConnectorApi } = props;
        try {
          const responseData = await saveDBConnectorPostApi(postData, t, false);
          await publishDBConnectorApi(
            {
              db_connector_uuid: responseData?.db_connector_uuid,
            },
            successCallback,
          );
        } catch (error) {
          console.log('unable to publish db connector', error);
        }
      } else {
        showToastPopover(
            t(INTEGRATION_ERROR_STRINGS.CONFIG),
            EMPTY_STRING,
            FORM_POPOVER_STATUS.SERVER_ERROR,
            true,
        );
      }
    };

    const publishExternalIntegration = async () => {
        const dataToBeValidated = constructConnectorPostData(state);
        const { publishIntegrationConnectorApi } = props;
        const current_error_list = validate(
            {
                ...dataToBeValidated,
                isExternalIntegration: state?.isExternalIntegration,
            },
            overallIntegrationValidationSchema(t),
        );
        integrationDataChange({
            error_list: {
                ...error_list,
                ...current_error_list,
            },
        });
        if (isEmpty(current_error_list)) {
            const {
                authentication = {},
                init_authentication = {},
                authentication: { type, authorization_status, is_authorized },
            } = state;
            if (
                [
                    AUTHENTICATION_TYPE_CONSTANTS.OAUTH_AUTH_CODE,
                ].includes(type) && (
                    (is_authorized && isAuthDetailsChanged(init_authentication, authentication) && authorization_status !== AUTHORIZATION_STATUS.SUCCESS) ||
                    (!is_authorized && authorization_status !== AUTHORIZATION_STATUS.SUCCESS)
                )
            ) {
                showToastPopover(
                    t(FEATURE_INTEGRATION_STRINGS.AUTHORIZE_ERROR),
                    EMPTY_STRING,
                    FORM_POPOVER_STATUS.SERVER_ERROR,
                    true,
                );
            } else {
                const { selected_connector } = props;
                let data = constructConnectorPostData(state, true);
                if (selected_connector) {
                    data = {
                        ...data,
                        _id: selected_connector,
                    };
                }
                try {
                    const successResponse = await postIntegrationConnectorApi(data, null, true);
                    const publishObj = {
                        connector_uuid: successResponse?.connector_uuid,
                    };
                    await publishIntegrationConnectorApi(publishObj, successCallback, t);
                } catch (error) {
                    console.log('unable to publish external integration', error);
                }
            }
        } else {
            showToastPopover(
                t(INTEGRATION_ERROR_STRINGS.CONFIG),
                EMPTY_STRING,
                FORM_POPOVER_STATUS.SERVER_ERROR,
                true,
            );
        }
    };
    const saveExternalIntegration = async () => {
        const errorList = cloneDeep(error_list);
        const dataToBeValidated = constructConnectorPostData(state);
        const current_error_list = validate(dataToBeValidated, draftIntegrationValidationSchema(t));
        integrationDataChange({
            error_list: {
                ...errorList,
                ...current_error_list,
            },
        });
        if (isEmpty(current_error_list)) {
            const { selected_connector } = props;
            let data = constructConnectorPostData(state, true);
            if (selected_connector) {
                data = {
                    ...data,
                    is_save_close: true,
                    _id: selected_connector,
                };
            }
            try {
                await postIntegrationConnectorApi(data);
                successCallback(true);
            } catch (e) {
                console.log('Unable to save external integration configuration');
            }
        }
    };

    const saveWorkhallIntegration = async (initData = {}, isSaveAndClose = true, updateId = false) => {
        const { errorData, bodyError, postData } = validateWorkhallApiData({ ...state, ...initData }, isSaveAndClose, updateId);
        if (!isSaveAndClose || (isEmpty(errorData) && isEmpty(bodyError))) {
            const { workhallApiConfigurationPostApi } = props;
            try {
                await workhallApiConfigurationPostApi(postData, true, t, updateId);
                if (isSaveAndClose) successCallback(true);
            } catch (error) {
                console.log('Unable to save api configuration');
            }
        } else {
            showToastPopover(
                t(INTEGRATION_ERROR_STRINGS.CONFIG),
                EMPTY_STRING,
                FORM_POPOVER_STATUS.SERVER_ERROR,
                true,
            );
        }
    };

    const saveExternalDBConnector = async () => {
      const { errorList, postData } = validateExternalDBConnectorData(
        dbConnector,
        false,
        true,
      );
      if (isEmpty(errorList)) {
        const { saveDBConnectorPostApi } = props;
        await saveDBConnectorPostApi(postData);
        successCallback(true);
      } else {
        showToastPopover(
            t(INTEGRATION_ERROR_STRINGS.CONFIG),
            EMPTY_STRING,
            FORM_POPOVER_STATUS.SERVER_ERROR,
            true,
        );
      }
    };

    const handleSubmitClick = () => {
        if (integrationTab === EXTERNAL_INTEGRATION) {
            publishExternalIntegration();
        } else if (integrationTab === WORKHALL_INTEGRATION) {
            publishWorkhallIntegration();
        } else if (integrationTab === EXTERNAL_DB_CONNECTION) {
            publishExternalDBConnector();
        }
    };
    const handleSaveClick = () => {
        if (integrationTab === EXTERNAL_INTEGRATION) {
            saveExternalIntegration();
        } else if (integrationTab === WORKHALL_INTEGRATION) {
            saveWorkhallIntegration();
        } else if (integrationTab === EXTERNAL_DB_CONNECTION) {
            saveExternalDBConnector();
        }
    };
    const onIntegrationTabChange = (value) => {
        setIntegrationTab(value);
    };

    const getConnectorTemplateDetails = async () => {
        let singleConnectorDetails = {};
        const { getSingleIntegrationConnector, getSingleIntegrationTemplateApi } = props;
        const params = {
            connector_uuid: uuidFromUrl,
            is_authorized_check: 1,
        };
        if (isFromEditPage) {
            params.is_conflict_check = 1;
            params.status = FILTER_TYPE.ANY;
        } else {
            params.status = FILTER_TYPE.PUBLISHED;
        }
        if (cancelTokenExternalApi) cancelTokenExternalApi();

        singleConnectorDetails = await getSingleIntegrationConnector({
            ...params,
        }, { connector_uuid: uuidFromUrl }, getCancelTokenExternalApi);
        if (isFromEditPage && singleConnectorDetails?.status === FILTER_TYPE.PUBLISHED) {
            try {
                const initialPostData = pick(singleConnectorDetails, [
                    '_id',
                    'connector_uuid',
                    'connector_name',
                    'description',
                ]);
                await postIntegrationConnectorApi(initialPostData, null, true, true);
            } catch (e) {
                console.log(e);
            }
        }
        if (singleConnectorDetails.template_id) {
            await getSingleIntegrationTemplateApi({
                _id: singleConnectorDetails.template_id,
            }, { ...singleConnectorDetails });
        }
    };
    const getWorkhallIntegrationDetails = async () => {
        const { getWorkhallApiConfigurationApi } = props;
        if (!isEmpty(uuidFromUrl)) {
            const params = {
                api_configuration_uuid: uuidFromUrl,
            };
            if (isFromEditPage) {
                params.status = FILTER_TYPE.ANY;
            } else {
                params.status = FILTER_TYPE.PUBLISHED;
            }
            const response = await getWorkhallApiConfigurationApi(params, t);
            if (isFromEditPage
                // && response?.status === FILTER_TYPE.PUBLISHED
            ) {
                try {
                    saveWorkhallIntegration(response, false, true);
                } catch (e) {
                    console.log(e);
                }
            }
        }
    };

    const getDBConnectorDetails = () => {
      const { getSingleDBConnetorConfigurationApi, getDBConnetorOptionsApi } = props;
      if (!isEmpty(uuidFromUrl)) {
        const params = {
          db_connector_uuid: uuidFromUrl,
        };
        if (isFromEditPage) {
          params.status = FILTER_TYPE.ANY;
          params.is_conflict_check = 1;
        } else {
          params.status = FILTER_TYPE.PUBLISHED;
        }
        getDBConnetorOptionsApi().then(() => {
          getSingleDBConnetorConfigurationApi(params);
        });
      }
    };

    const promptBeforeLeaving = (location) => {
        console.log('propmtblockNavigation', blockNavigation);
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

    useEffect(() => {
        integrationDataChange({
            isBasicDetailsModalOpen: false,
        });
        setDetailViewAction(isEditView ? INTEGRATION_DETAIL_ACTION.EDIT : INTEGRATION_DETAIL_ACTION.VIEW);
        if (integrationTab === EXTERNAL_INTEGRATION) {
            setIntegrationTab(EDIT_VIEW_INTEGRATION_TABS.AUTHENTICATION);
            getConnectorTemplateDetails();
        } else if (integrationTab === WORKHALL_INTEGRATION) {
            setIntegrationTab(EDIT_VIEW_INTEGRATION_TABS.CREDENTIALS);
            getWorkhallIntegrationDetails();
        } else if (integrationTab === EXTERNAL_DB_CONNECTION) {
            setIntegrationTab(EDIT_VIEW_INTEGRATION_TABS.AUTHENTICATION);
            getDBConnectorDetails();
        }
        return () => {
            clearIntegrationData();
        };
    }, [history.location.pathname]);

    const handleCloseDependency = () => {
        integrationDataChange({
            isDependencyModalVisible: false,
            dependencyData: {},
        });
        setNavigationBlockerStatus(true);
    };

    if (isInvalidUserModalOpen) {
        invalidUserModal = (
            <ConfirmationModal
                isModalOpen={isInvalidUserModalOpen}
                onConfirmClick={() => integrationDataChange({
                    isInvalidUserModalOpen: false,
                })}
                titleName={ADMIN_INFO.USER_TEAM_DELETED}
                mainDescription={ADMIN_INFO.USER_TEAM_DELETED_SUBTITLE}
                confirmationName={ADMIN_INFO.OKAY}
                noClickOutsideAction
                notShowClose
                customIcon={<AlertCircle className={styles.AlertIcon} />}
                customIconClass={cx(styles.AlertCircle, gClasses.MB24)}
                primaryButtonClass={styles.OkButton}
                innerClass={styles.AlertModal}
                buttonContainerClass={styles.AlertModalBtns}
            />
        );
    }

    const handleDeleteFromDependency = async () => {
        try {
            const { deleteIntegrationConnectorApi } = props;
            await deleteIntegrationConnectorApi({
                connector_uuid: uuidFromUrl,
            });
            showToastPopover('Integration Deleted Successfully', EMPTY_STRING, FORM_POPOVER_STATUS.DELETE, true);
            handleCloseDependency();
            const integrationPathname = `${INTEGRATIONS}/${EXTERNAL_INTEGRATION}`;
            routeNavigate(history, ROUTE_METHOD.REPLACE, integrationPathname);
        } catch (e) {
            console.log(e);
        }
    };

    const handleDeleteClick = async () => {
        if (integrationTab === EXTERNAL_INTEGRATION) {
            const { checkIntegrationDependencyApi } = props;
            checkIntegrationDependencyApi({
                connector_uuid: uuidFromUrl,
            });
            setNavigationBlockerStatus(false);
        } else {
            setConfirmationModalId(INTEGRATION_CONSTANTS.SECONDARY_ACTIONS_LIST.DELETE);
        }
    };

    const discardIntegration = async () => {
        try {
            const { discardIntegrationConnectorApi, discardWorkhallApiConfiguration } = props;
            if (integrationTab === EXTERNAL_INTEGRATION) {
                await discardIntegrationConnectorApi({
                    connector_id: _id,
                });
                const integrationPathname = `${INTEGRATIONS}/${EXTERNAL_INTEGRATION}`;
                routeNavigate(history, ROUTE_METHOD.REPLACE, integrationPathname);
            } else if (integrationTab === WORKHALL_INTEGRATION) {
                await discardWorkhallApiConfiguration({
                    api_configuration_id: _id,
                });
                const integrationPathname = `${INTEGRATIONS}/${WORKHALL_INTEGRATION}`;
                routeNavigate(history, ROUTE_METHOD.REPLACE, integrationPathname);
            } else if (integrationTab === EXTERNAL_DB_CONNECTION) {
                const { discardDBConnectorApiThunkConfiguration } = props;
                await discardDBConnectorApiThunkConfiguration({ db_connector_id: _id });
                const integrationPathname = `${INTEGRATIONS}/${EXTERNAL_DB_CONNECTION}`;
                routeNavigate(history, ROUTE_METHOD.REPLACE, integrationPathname);
            }
        } catch (e) {
            console.log(e);
        }
    };

    const onConfirmClick = async () => {
        if (confirmationModalId === INTEGRATION_CONSTANTS.SECONDARY_ACTIONS_LIST.DELETE) {
            if (integrationTab === WORKHALL_INTEGRATION) {
                const { deleteWorkhallAPIConfiguration } = props;
                await deleteWorkhallAPIConfiguration({ api_configuration_uuid: uuidFromUrl });
                const integrationPathname = `${INTEGRATIONS}/${WORKHALL_INTEGRATION}`;
                routeNavigate(history, ROUTE_METHOD.REPLACE, integrationPathname);
            } else if (integrationTab === EXTERNAL_DB_CONNECTION) {
                const { deleteDBConnectorApiConfiguration } = props;
                await deleteDBConnectorApiConfiguration({ db_connector_uuid: uuidFromUrl });
                const integrationPathname = `${INTEGRATIONS}/${EXTERNAL_DB_CONNECTION}`;
                routeNavigate(history, ROUTE_METHOD.REPLACE, integrationPathname);
            }
        } else discardIntegration();
    };

    const handleSecondaryActionChange = (selectedAction) => {
        switch (selectedAction) {
            case INTEGRATION_CONSTANTS.SECONDARY_ACTIONS_LIST.DISCARD:
                setConfirmationModalId(selectedAction);
                break;
            case INTEGRATION_CONSTANTS.SECONDARY_ACTIONS_LIST.EDIT_NAME_AND_SECURITY:
                integrationDataChange({
                    isBasicDetailsModalOpen: true,
                });
                break;
            case INTEGRATION_CONSTANTS.SECONDARY_ACTIONS_LIST.DELETE:
                handleDeleteClick();
                break;
            default:
                break;
        }
    };

    const viewHeaderButtons = (
        <button className={cx(gClasses.CenterV, styles.EditButton)} onClick={onEditClick}>
            <EditIconPencil />
            <Text className={cx(gClasses.ML8, styles.EditText)} content={EDIT_INTEGRATION} />
        </button>
    );

    const handleBreadCrumb = (e) => {
        const route = `/${e?.target?.href?.replace(e?.target?.baseURI, EMPTY_STRING)}`;
        console.log('eventhandleBreadCrumb', e, 'href', e?.target?.href, 'route', route);
        if (!isEmpty(route)) {
            routeNavigate(history, ROUTE_METHOD.REPLACE, route, EMPTY_STRING, {}, true);
        }
    };

    const integrationIcon = (integrationTab === WORKHALL_INTEGRATION ? <WorkhallIconLetter />
    : (connector_logo ?
        <img className={styles.TemplateLogo} src={connector_logo} alt="loading" />
        : <IntegrationNavIcon className={cx(styles.IntegrationLogo)} />
    ));

    let routerTitle = CREATE_INTEGRATION.INTEGRATION;
    let secondaryProps = {};
    let tabOptions = [];
    if (isEditView) {
        routerTitle = isFromEditPage ? CREATE_INTEGRATION.EDIT_INTEGRATION : CREATE_INTEGRATION.TITLE;
        secondaryProps = {
            displaySecondaryActions: true,
            subMenuList: getEditIntegrationSecondaryActionMenu(version, t),
            primaryCTALabel: t(ADD_INTEGRATION.HEADER.PUBLISH),
            primaryCTAClicked: handleSubmitClick,
            secondaryCTALabel: t(ADD_INTEGRATION.HEADER.SAVE_AND_CLOSE),
            secondaryCTAClicked: handleSaveClick,
            subMenuItemClicked: handleSecondaryActionChange,
        };
    } else {
        secondaryProps = {
            displaySecondaryActions: true,
            primaryCTALabel: t(ADD_INTEGRATION.HEADER.EDIT),
            primaryCTAClicked: onEditClick,
            primaryCTAType: EButtonType.PRIMARY,
        };
    }
    let editDetailComponent = null;
    if (!isLoadingIntegrationDetail && !isErrorInIntegrationDetail) {
        if (integrationTab === EXTERNAL_INTEGRATION) {
            tabOptions = INTEGRATION_TAB_OPTIONS;
            editDetailComponent = (
                <EditExternalIntegration
                    clearIntegrationData={clearIntegrationData}
                    uuidFromUrl={uuidFromUrl}
                    integrationEditTab={selectedIntegrationTab}
                    isEditView={isEditView}
                />
            );
        } else if (integrationTab === WORKHALL_INTEGRATION) {
            tabOptions = WORKHALL_INTEGRATION_TAB_OPTIONS;
            editDetailComponent = (
                <EditWorkhallIntegration
                    isEditView={isEditView}
                    integrationEditTab={selectedIntegrationTab}
                />
            );
        } else if (integrationTab === EXTERNAL_DB_CONNECTION) {
            tabOptions = EXTERNAL_DB_CONNECTION_TAB_OPTIONS;
            editDetailComponent = (
                <DBConnector
                    isEditView={isEditView}
                    integrationEditTab={selectedIntegrationTab}
                />
            );
        }
    }
    let confirmationModalContent = null;
    if (confirmationModalId) {
        const content = confirmationModalId === INTEGRATION_CONSTANTS.SECONDARY_ACTIONS_LIST.DISCARD ? SECONDARY_ACTIONS_LIST.DISCARD : SECONDARY_ACTIONS_LIST.DELETE;
        confirmationModalContent = (
            <ConfirmationModal
                isModalOpen={confirmationModalId}
                onConfirmClick={onConfirmClick}
                onCancelOrCloseClick={() => setConfirmationModalId(null)}
                titleName={t(content.TITLE)}
                mainDescription={t(content.SUBTITLE)}
                confirmationName={t(content.CONFIRM)}
                cancelConfirmationName={t(content.CANCEL)}
                noClickOutsideAction
            />
        );
    }
    const enablePrompt = (detailAction === INTEGRATION_DETAIL_ACTION.EDIT) &&
        !confirmationModalId &&
        !isErrorInIntegrationDetail &&
        !isLoadingIntegrationDetail &&
        !isEmpty(_id);

    let viewHeaderTabOptions = [];
    if (integrationTab === EXTERNAL_INTEGRATION) {
        viewHeaderTabOptions = EXTERNAL_VIEW_TABS;
    } else if (integrationTab === WORKHALL_INTEGRATION) {
        viewHeaderTabOptions = WORKHALL_VIEW_TABS;
    } else {
        viewHeaderTabOptions = DB_CONNECTOR_VIEW_TABS;
    }

    return (
        <>
            <Prompt when={enablePrompt} message={promptBeforeLeaving} />
            {isEditView ?
            <Header
                pageTitle={routerTitle}
                fieldLabel={t(ADD_INTEGRATION.INTEGRATION_NAME.LABEL)}
                fieldValue={connector_name}
                SeparatorIcon={RightArrowIcon}
                tabDisplayCount={2}
                tabOptions={tabOptions}
                innerTabClass={styles.EditHeaderTab}
                tabIconClassName={styles.EditHeaderIconClass}
                errorTabList={errorTabList}
                selectedTabIndex={selectedIntegrationTab}
                variation={ETabVariation.stepper}
                onTabItemClick={onIntegrationTabChange}
                bottomSelectionClass={styles.ActiveTab}
                textClass={styles.TabText}
                {...secondaryProps}
                isLoading={isLoadingIntegrationDetail}
            />
            : (
                <ViewHeader
                    breadcrumbList={getIntegrationBreadcrumb(integrationTab, connector_name, history)}
                    titleName={connector_name}
                    actionButtons={viewHeaderButtons}
                    isLoading={isLoadingIntegrationDetail}
                    thumbnailIcon={integrationIcon}
                    handleBreadCrumb={handleBreadCrumb}
                    description={description}
                    descriptionClass={cx(isNavOpen ? styles.ViewLabel : styles.NavStyle, styles.ViewDesc)}
                    nameClass={cx(gClasses.FontWeight500, isNavOpen ? styles.ViewLabel : styles.NavStyle)}
                    showNameTitle
                    showDescTitle
                    onEditClick={onEditClick}
                    buttonLabel={t(ADD_INTEGRATION.HEADER.EDIT)}
                    tabOptions={viewHeaderTabOptions}
                    onTabChange={onIntegrationTabChange}
                    selectedTabIndex={selectedIntegrationTab}
                />
            )}
            {editDetailComponent}
            {confirmationModalContent}
            {invalidUserModal}
            {
                isDependencyModalVisible && (
                    <DependencyHandler
                      onDeleteClick={handleDeleteFromDependency}
                      onCancelDeleteClick={handleCloseDependency}
                      isDependencyListLoading={isDependencyListLoading}
                      dependencyHeaderTitle={t(INTEGRATION_DEPENDENCY.NAME)}
                      dependencyData={dependencyData}
                      isErrorInLoadingDependencyList={isErrorInLoadingDependencyList}
                    />
                )
            }
        </>
    );
}

const mapStateToProps = ({ IntegrationReducer, NavBarReducer }) => {
    return {
        state: IntegrationReducer,
        dependencyData: IntegrationReducer.dependencyData,
        connectorTobeDeleted: IntegrationReducer.connectorTobeDeleted,
        isNavOpen: NavBarReducer.isNavOpen,
        api_type: IntegrationReducer.api_type,
        isInvalidUserModalOpen: IntegrationReducer.isInvalidUserModalOpen,
    };
};

const mapDispatchToProps = {
    getSingleIntegrationTemplateApi: getSingleIntegrationTemplateApiThunk,
    postIntegrationConnectorApi: postIntegrationConnectorApiThunk,
    getSingleIntegrationConnector: getSingleIntegrationConnectorThunk,
    publishIntegrationConnectorApi: publishIntegrationConnectorApiThunk,
    workhallApiConfigurationPostApi: workhallApiConfigurationPostApiThunk,
    workhallApiConfigurationPublishApi: workhallApiConfigurationPublishApiThunk,
    getSingleDBConnetorConfigurationApi: getSingleDBConnetorConfigurationApiThunk,
    saveDBConnectorPostApi: saveDBConnectorPostApiThunk,
    publishDBConnectorApi: publishDBConnectorApiThunk,
    getDBConnetorOptionsApi: getDBConnetorOptionsApiThunk,
    integrationDataChange,
    dbConnectorDataChange,
    getWorkhallApiConfigurationApi: getWorkhallApiConfigurationApiThunk,
    deleteIntegrationConnectorApi: deleteIntegrationConnectorApiThunk,
    deleteWorkhallAPIConfiguration: deleteWorkhallAPIConfigurationThunk,
    deleteDBConnectorApiConfiguration: deleteDBConnectorApiThunk,
    checkIntegrationDependencyApi: checkIntegrationDependencyApiThunk,
    discardIntegrationConnectorApi: discardIntegrationConnectorApiThunk,
    discardWorkhallApiConfiguration: discardWorkhallApiConfigurationThunk,
    discardDBConnectorApiThunkConfiguration: discardDBConnectorApiThunk,
};

export default connect(mapStateToProps, mapDispatchToProps)(EditIntegration);
