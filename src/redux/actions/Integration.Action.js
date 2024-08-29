import {
  postIntegrationConnectorApi,
  getIntegrationConnectorApi,
  getIntegrationEventCategoriesApi,
  publishIntegrationConnectorApi,
  verifyOAuth2CredentialsApi,
  deleteIntegrationConnectorApi,
  deleteWorkhallApiConfiguration,
  getIntegrationTemplatesApi,
  discardIntegrationConnectorApi,
  discardWorkhallApiConfiguration,
  checkIntegrationDependencyApi,
  workhallApiConfigurationPostApi,
  getWorkhallApiConfigurationApi,
  getInitiationStepActions,
  workhallApiConfigurationPublishApi,
  saveDBConnectorApi,
} from 'axios/apiService/Integration.apiService';
import {
  AUTHORIZATION_STATUS,
  getExternalIntegrationStateData,
  getSingleConnectorData,
  VERIFY_OAUTH_RESPOSNE_TYPE,
} from 'containers/integration/Integration.utils';
import { isEmpty, cloneDeep, has } from 'lodash';
import { integrationDataChange } from 'redux/reducer/IntegrationReducer';
import { store } from 'Store';
import { FORM_POPOVER_STATUS } from 'utils/Constants';
import { setPointerEvent, updatePostLoader } from 'utils/loaderUtils';
import {
  updateEditConfirmPopOverStatus,
} from 'utils/UtilityFunctions';
import jsUtils, { get } from 'utils/jsUtility';
import { getFormattedDateFromUTC } from 'utils/dateUtils';
import {
  EMPTY_STRING,
  SOMEONE_IS_EDITING,
  SOMEONE_IS_EDITING_ERROR,
} from 'utils/strings/CommonStrings';
import { getCurrentUserId } from 'utils/userUtils';
import { translate } from 'language/config';
import { enryptAesEncryptionData } from 'utils/encryptionUtils';
import i18next from 'i18next';
import { setEncryptionData } from './EncryptionData.Action';
import instance from '../../axios/axios';
import { apiGetAllFieldsList, testIntegration } from '../../axios/apiService/flow.apiService';
import {
  decryptyOauthCredentialApi,
  deleteDBConnectorApi,
  deleteDBConnectorQueryApi,
  deleteOauthCredentialApi,
  discardDBConnectorApi,
  enableOrDisableOauthApi,
  fetchDBDataApi,
  generateOauthClientCredentialApi,
  getAllIntegrationEventsApi,
  getDBConnectorConfigurationApi,
  getDBConnectorQueryApi,
  getDBConnectorSupportedOptionsApi,
  getOauthClientCredentialsApi,
  getTableInfoApi,
  getTablesListApi,
  integrationAddEventApi,
  integrationRemoveEventApi,
  postDBConnectorQueryApi,
  publishDBConnectorApi,
  publishDBConnectorQueryApi,
  updateOauthCredentialApi,
} from '../../axios/apiService/Integration.apiService';
import { getAllFlows } from '../../axios/apiService/flowList.apiService';
import { SCOPE_OPTION_LIST, getCurrentFlowActions, getSelectedLabels, getServerErrors } from '../../containers/integration/Integration.utils';
import { getAllViewDataList } from '../../axios/apiService/dataList.apiService';
import { getSingleWorkhallAPIReducerData } from '../../containers/integration/add_integration/workhall_api/WorkhallApi.utils';
import { SERVER_ERROR_MESSAGES } from '../../utils/strings/CommonStrings';
import { ERROR_TYPE_STRING_GUID_ERROR, SOMEONE_EDITING } from '../../utils/ServerValidationUtils';
import { translateFunction } from '../../utils/jsUtility';
import { INTEGRATION_CONSTANTS } from '../../containers/integration/Integration.constants';
import { OAUTH_CRED_LABELS, INTEGRATION_ERROR_STRINGS } from '../../containers/integration/Integration.strings';
import { getQueryServerErrors, getSingleDBConnectorAuthReducerData, getSingleDBConnectorQueryReducerData } from '../../containers/integration/add_integration/db_connector/DBConnector.utils';
import { dbConnectorDataChange } from '../reducer/IntegrationReducer';
import { DB_CONNECTOR_INCORRECT_MESSAGE } from '../../containers/integration/add_integration/db_connector/DBConnector.strings';
import { showToastPopover } from '../../utils/UtilityFunctions';

const updateSomeoneIsEditingPopover = (errorMessage, uuid, isExternal = true, isDBConnector = false) => {
  const { time, isMoreThanHoursLimit } = getFormattedDateFromUTC(
    errorMessage.edited_on,
    SOMEONE_IS_EDITING,
  );
  const isCurrentUser = getCurrentUserId() === errorMessage.user_id;
  let editSubtitle = null;
  if (isCurrentUser) {
    editSubtitle = SOMEONE_IS_EDITING_ERROR.SAME_USER;
  } else {
    editSubtitle = `${errorMessage.full_name} (${errorMessage.email}) ${SOMEONE_IS_EDITING_ERROR.DIFFERENT_USER}`;
  }
  let content = {};
  let params = {};
  if (isExternal) {
    content = SOMEONE_IS_EDITING_ERROR.INTEGRATION;
    params = {
      connector_uuid: uuid,
    };
  } else if (isDBConnector) {
    content = SOMEONE_IS_EDITING_ERROR.EXTERNAL_DB_CONNECTOR;
    params = {
      db_connector_uuid: uuid,
    };
  } else {
    content = SOMEONE_IS_EDITING_ERROR.WORKHALL_API_CONFIGURATION;
    params = {
      api_configuration_uuid: uuid,
    };
  }
  updateEditConfirmPopOverStatus({
    title: content.TITLE,
    subTitle: editSubtitle,
    secondSubTitle: isCurrentUser
      ? EMPTY_STRING
      : `${SOMEONE_IS_EDITING_ERROR.DESCRIPTION_LABEL} ${time}`,
    status: FORM_POPOVER_STATUS.SERVER_ERROR,
    isVisible: false,
    isEditConfirmVisible: true,
    type: content.TYPE,
    enableDirectEditing: isCurrentUser && isMoreThanHoursLimit,
    params,
  });
};

export const postIntegrationConnectorApiThunk =
  (data, successCallback, donotUpdateDetails = false, updateId = false, t = translateFunction) => (dispatch) =>
    new Promise((resolve, reject) => {
      if (process.env.REACT_APP_ENCRYPTION_ENABLED === '1') {
      const encryptionDetails = JSON.parse(
        localStorage.getItem('encryption_details'),
      );
      if (
        encryptionDetails
        && encryptionDetails.pks_id
        && encryptionDetails.public_key
        && encryptionDetails.aes_key
        && encryptionDetails.aek
      ) {
      data.isIntegrationConnector = true;
      const dataToBeEncrypted = jsUtils.cloneDeep(data);
      store.dispatch(setEncryptionData(dataToBeEncrypted));
      const request_enc_data = enryptAesEncryptionData(
        { authentication: data?.authentication },
        encryptionDetails.aes_key,
      );
      if (!data?.template_id && data.base_url) {
        data.base_url = encodeURIComponent(data.base_url);
      }
      data.request_enc_data = request_enc_data;
      delete data?.authentication;
      delete data?.isIntegrationConnector;
      instance.defaults.headers.common.pks_id = encryptionDetails.pks_id;
      instance.defaults.headers.common.aek = encryptionDetails.aek;
      }
    }
      updatePostLoader(true);
      postIntegrationConnectorApi(data)
        .then((response) => {
          updatePostLoader(false);

          if (successCallback) successCallback(response);
          if (!donotUpdateDetails) {
            dispatch(
              integrationDataChange({
                ...getSingleConnectorData(response),
              }),
            );
          } else if (updateId) {
            dispatch(
              integrationDataChange({
                selected_connector: response?._id,
                version: response?.version,
                connector_status: response?.status,
                _id: response?._id,
              }),
            );
          }

          resolve(response);
        })
        .catch((error) => {
          updatePostLoader(false);
          reject(error);
          if (error?.response?.data?.errors?.[0]?.type === SOMEONE_EDITING) {
            updateSomeoneIsEditingPopover(
              error.response.data.errors[0].message,
              data?.connector_uuid,
            );
          } else {
            const { error_list, serverErrorText } = getServerErrors(error, t);
            if (!isEmpty(error_list)) {
              dispatch(
                integrationDataChange({ error_list }),
              );
            }
            showToastPopover(
              serverErrorText,
              EMPTY_STRING,
              FORM_POPOVER_STATUS.SERVER_ERROR,
              true,
            );
          }
        });
    });

export const getSingleIntegrationConnectorThunk =
  (params, currentConnector, setCancelToken) => (dispatch) =>
    new Promise((resolve, reject) => {
      dispatch(
        integrationDataChange({
          isLoadingIntegrationDetail: true,
        }),
      );
      getIntegrationConnectorApi(params, setCancelToken)
        .then((response) => {
          dispatch(
            integrationDataChange({
              ...getSingleConnectorData(response),
              isExternalIntegration: !isEmpty(response?.template_id),
              isLoadingIntegrationDetail: false,
              api_type: INTEGRATION_CONSTANTS.API_TYPE.EXTERNAL,
            }),
          );
          resolve(response);
        })
        .catch((error) => {
          const errorList = error?.response?.data?.errors || [];
          switch (errorList?.[0]?.type) {
            case SOMEONE_EDITING:
              updateSomeoneIsEditingPopover(
                error.response.data.errors[0].message,
                currentConnector?.connector_uuid,
              );
              break;
            case ERROR_TYPE_STRING_GUID_ERROR:
              showToastPopover(
                translate(SERVER_ERROR_MESSAGES.ERROR_TYPE_STRING_GUID_ERROR.TITLE),
                EMPTY_STRING,
                FORM_POPOVER_STATUS.SERVER_ERROR,
                true,
              );
            break;
            default:
              showToastPopover(
                translate('error_popover_status.somthing_went_wrong'),
                translate('error_popover_status.refresh_try_again'),
                FORM_POPOVER_STATUS.SERVER_ERROR,
                true,
              );
            break;
          }
          dispatch(
            integrationDataChange({
              isErrorInIntegrationDetail: true,
              isLoadingIntegrationDetail: false,
            }),
          );
          reject(error);
        });
    });

export const getCredentialsListApiThunk =
  (params, initialLoad, setCancelToken) => (dispatch) =>
    new Promise((resolve, reject) => {
      if (initialLoad) {
        dispatch(
          integrationDataChange({
            credentialsList: [],
            totalCredentialsCount: 0,
            hasMoreCredentials: false,
            isLoadingCredentialsList: true,
            isErrorInLoadingCredentialsList: false,
          }),
        );
      } else {
        dispatch(
          integrationDataChange({
            isErrorInLoadingCredentialsList: false,
          }),
        );
      }
      getOauthClientCredentialsApi(params, setCancelToken)
        .then((response) => {
          if (!isEmpty(response)) {
            let listData = [];
            let paginationDetails = {
              remainingCredentialsCount: 0,
              hasMoreCredentials: false,
            };
            const { credentialsList } = cloneDeep(
              store.getState().IntegrationReducer,
            );
            if (!isEmpty(response.pagination_data)) {
              const formattedResponse = response.pagination_data.map((credential) => {
                return {
                  label: credential?.name,
                  value: credential?._id,
                  _id: credential?._id,
                  name: credential?.name,
                };
              });
              listData = initialLoad
                ? formattedResponse
                : [...credentialsList, ...formattedResponse];
            }
              if (response.pagination_details?.[0]) {
                const remainingCredentialsCount = response.pagination_details[0].total_count - listData.length;
                paginationDetails = {
                  remainingCredentialsCount,
                  hasMoreCredentials: remainingCredentialsCount > 0,
                  totalCredentialsCount:
                    response.pagination_details[0]?.total_count,
                  credentialsCurrentPage: response.pagination_details[0]?.page,
                };
              }
            dispatch(
              integrationDataChange({
                credentialsList: listData,
                isLoadingCredentialsList: false,
                ...paginationDetails,
              }),
            );
            resolve(listData);
          } else {
            dispatch(
              integrationDataChange({
                isLoadingCredentialsList: false,
                isErrorInLoadingCredentialsList: true,
              }),
            );
            resolve(false);
          }
        })
        .catch((error) => {
          console.log('errorGetOauthCreds', error);
          if (has(error, ['code']) && error.code === 'ERR_CANCELED') return;
          dispatch(
            integrationDataChange({
              isLoadingCredentialsList: false,
              isErrorInLoadingCredentialsList: true,
            }),
          );
          resolve(false);
          reject(error);
        });
    });

export const getListOauthClientCredentialsApiThunk =
  (params, initialLoad, setCancelToken) => (dispatch) =>
    new Promise((resolve, reject) => {
      if (initialLoad) {
        dispatch(
          integrationDataChange({
            integrationsList: [],
            totalIntegrationsCount: 0,
            hasMoreIntegrations: false,
            isLoadingIntegrationsList: true,
            isErrorInLoadingIntegrationsList: false,
          }),
        );
      } else {
        dispatch(
          integrationDataChange({
            isLoadingIntegrationsList: true,
            isErrorInLoadingIntegrationsList: false,
          }),
        );
      }
      getOauthClientCredentialsApi(params, setCancelToken)
        .then((response) => {
          if (!isEmpty(response)) {
            let listData = [];
            let remainingIntegrationsCount = 0;
            const { integrationsList } = cloneDeep(
              store.getState().IntegrationReducer,
            );
            if (!isEmpty(response.pagination_data) && !isEmpty(response.pagination_details)) {
              listData = initialLoad
                ? response.pagination_data
                : [...integrationsList, ...response.pagination_data];
              remainingIntegrationsCount =
                response.pagination_details[0].total_count - listData.length;
            }
            dispatch(
              integrationDataChange({
                remainingIntegrationsCount,
                integrationsList: listData,
                hasMoreIntegrations: remainingIntegrationsCount > 0,
                totalIntegrationsCount:
                  response.pagination_details[0]?.total_count,
                currentPage: response.pagination_details[0]?.page,
                isLoadingIntegrationsList: false,
              }),
            );
            resolve(listData);
          } else {
            console.log('emptyRresponsegetOauthCreds');
            showToastPopover(
              translate('error_popover_status.somthing_went_wrong'),
              translate('error_popover_status.refresh_try_again'),
              FORM_POPOVER_STATUS.SERVER_ERROR,
              true,
            );
            dispatch(
              integrationDataChange({
                isLoadingIntegrationsList: false,
                isErrorInLoadingIntegrationsList: true,
              }),
            );
            resolve(false);
          }
        })
        .catch((error) => {
          console.log('errorGetOauthCreds', error);
          if (has(error, ['code']) && error.code === 'ERR_CANCELED') return;
          showToastPopover(
            translate('error_popover_status.somthing_went_wrong'),
            translate('error_popover_status.refresh_try_again'),
            FORM_POPOVER_STATUS.SERVER_ERROR,
            true,
          );
          dispatch(
            integrationDataChange({
              isLoadingIntegrationsList: false,
              isErrorInLoadingIntegrationsList: true,
            }),
          );
          resolve(false);
          reject(error);
        });
    });

export const getSingleOauthCredentialApiThunk = (params, setCancelToken) => (dispatch) =>
  new Promise((resolve, reject) => {
    getOauthClientCredentialsApi(params, setCancelToken)
      .then((response) => {
        console.log('response getSingleOauth', response);
        if (!isEmpty(response)) {
          dispatch(
            integrationDataChange({
              credentialData: response,
              initialCredData: response,
              isEditCredentialModalOpen: true,
              isSingleOauthClicked: true,
              scope_labels: getSelectedLabels(SCOPE_OPTION_LIST, response?.scope),
            }),
          );
        }
        resolve(response);
      })
      .catch((error) => {
        console.log('error getSingleOAuth', error);
        showToastPopover(
          translate('error_popover_status.somthing_went_wrong'),
          translate('error_popover_status.refresh_try_again'),
          FORM_POPOVER_STATUS.SERVER_ERROR,
          true,
        );
        reject(error);
      });
  });

export const getIntegrationConnectorApiThunk =
  (params, initialLoad, setCancelToken) => (dispatch) =>
    new Promise((resolve, reject) => {
      if (initialLoad) {
        dispatch(
          integrationDataChange({
            integrationsList: [],
            totalIntegrationsCount: 0,
            hasMoreIntegrations: false,
            isLoadingIntegrationsList: true,
            isErrorInLoadingIntegrationsList: false,
          }),
        );
      } else {
        dispatch(
          integrationDataChange({
            isLoadingIntegrationsList: true,
            isErrorInLoadingIntegrationsList: false,
          }),
        );
      }
      getIntegrationConnectorApi(params, setCancelToken)
        .then((response) => {
          if (!isEmpty(response)) {
            let listData = [];
            let remainingIntegrationsCount = 0;
            const { integrationsList } = cloneDeep(
              store.getState().IntegrationReducer,
            );
            if (!isEmpty(response.pagination_data)) {
              listData = initialLoad
                ? response.pagination_data
                : [...integrationsList, ...response.pagination_data];
              remainingIntegrationsCount =
                response.pagination_details[0].total_count - listData.length;
            }
            dispatch(
              integrationDataChange({
                remainingIntegrationsCount,
                integrationsList: listData,
                hasMoreIntegrations: remainingIntegrationsCount > 0,
                totalIntegrationsCount:
                  response.pagination_details[0].total_count,
                currentPage: response.pagination_details[0].page,
                isLoadingIntegrationsList: false,
              }),
            );
            resolve(true);
          } else {
            console.log('emptyResponseGetConnector');
            showToastPopover(
              translate('error_popover_status.somthing_went_wrong'),
              translate('error_popover_status.refresh_try_again'),
              FORM_POPOVER_STATUS.SERVER_ERROR,
              true,
            );
            dispatch(
              integrationDataChange({
                isLoadingIntegrationsList: false,
                isErrorInLoadingIntegrationsList: true,
              }),
            );
            resolve(false);
          }
        })
        .catch((error) => {
          console.log('errorGetConnectorr', error);
          if (has(error, ['code']) && error.code === 'ERR_CANCELED') return;
          showToastPopover(
            translate('error_popover_status.somthing_went_wrong'),
            translate('error_popover_status.refresh_try_again'),
            FORM_POPOVER_STATUS.SERVER_ERROR,
            true,
          );
          dispatch(
            integrationDataChange({
              isLoadingIntegrationsList: false,
              isErrorInLoadingIntegrationsList: true,
            }),
          );
          resolve(false);
          reject(error);
        });
    });

export const getIntegrationConfigurationApiThunk =
  (params, initialLoad, setCancelToken) => (dispatch) =>
    new Promise((resolve, reject) => {
      if (initialLoad) {
        dispatch(
          integrationDataChange({
            integrationsList: [],
            totalIntegrationsCount: 0,
            hasMoreIntegrations: false,
            isLoadingIntegrationsList: true,
            isErrorInLoadingIntegrationsList: false,
          }),
        );
      } else {
        dispatch(
          integrationDataChange({
            isLoadingIntegrationsList: true,
            isErrorInLoadingIntegrationsList: false,
          }),
        );
      }
      getWorkhallApiConfigurationApi(params, setCancelToken)
        .then((response) => {
          if (!isEmpty(response)) {
            let listData = [];
            let remainingIntegrationsCount = 0;
            const { integrationsList } = cloneDeep(
              store.getState().IntegrationReducer,
            );
            if (!isEmpty(response.pagination_data) && !isEmpty(response.pagination_details)) {
              listData = initialLoad
                ? response.pagination_data
                : [...integrationsList, ...response.pagination_data];
              remainingIntegrationsCount =
                response.pagination_details[0].total_count - listData.length;
            }
            dispatch(
              integrationDataChange({
                remainingIntegrationsCount,
                integrationsList: listData,
                hasMoreIntegrations: remainingIntegrationsCount > 0,
                totalIntegrationsCount:
                  response.pagination_details[0]?.total_count,
                currentPage: response.pagination_details[0]?.page,
                isLoadingIntegrationsList: false,
              }),
            );
            resolve(true);
          } else {
            console.log('emptyRresponsegetConfiguration');
            showToastPopover(
              translate('error_popover_status.somthing_went_wrong'),
              translate('error_popover_status.refresh_try_again'),
              FORM_POPOVER_STATUS.SERVER_ERROR,
              true,
            );
            dispatch(
              integrationDataChange({
                isLoadingIntegrationsList: false,
                isErrorInLoadingIntegrationsList: true,
              }),
            );
            resolve(false);
          }
        })
        .catch((error) => {
          console.log('errorGetConfigurationr', error);
          if (has(error, ['code']) && error.code === 'ERR_CANCELED') return;
          showToastPopover(
            translate('error_popover_status.somthing_went_wrong'),
            translate('error_popover_status.refresh_try_again'),
            FORM_POPOVER_STATUS.SERVER_ERROR,
            true,
          );
          dispatch(
            integrationDataChange({
              isLoadingIntegrationsList: false,
              isErrorInLoadingIntegrationsList: true,
            }),
          );
          resolve(false);
          reject(error);
        });
    });

export const getIntegrationEventCategoriesApiThunk = (params) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(
      integrationDataChange({
        isCategoryListLoading: true,
      }),
    );
    getIntegrationEventCategoriesApi(params)
      .then((response) => {
        const state = store.getState().IntegrationReducer;
        if (!isEmpty(response)) {
          const modifiedCategory = response?.map((currentCategory) => {
            return {
              id: currentCategory,
              label: currentCategory,
              value: currentCategory,
            };
          });
          const activeEvent = get(state, 'active_event', {});
          dispatch(
            integrationDataChange({
              active_event: {
                ...activeEvent,
                categoryOptionList: modifiedCategory,
              },
              isCategoryListLoading: false,
            }),
          );
        } else {
          dispatch(
            integrationDataChange({
              category: [],
              isCategoryListLoading: false,
            }),
          );
        }

        resolve(response);
      })
      .catch((error) => {
        dispatch(
          integrationDataChange({
            category: [],
            isCategoryListLoading: false,
          }),
        );
        reject(error);
      });
  });

export const deleteOauthCredentialApiThunk = (params) => () =>
  new Promise((resolve, reject) => {
    deleteOauthCredentialApi(params)
      .then((response) => {
        showToastPopover('Credentials Deleted Successfully', EMPTY_STRING, FORM_POPOVER_STATUS.DELETE, true);
        resolve(response);
      })
      .catch((error) => {
        console.log('errordeleteOauthCredential', error);
        reject(error);
      });
  });

export const enableOrDisableOauthApiThunk = (params) => (dispatch) =>
  new Promise((resolve, reject) => {
    enableOrDisableOauthApi(params)
      .then((response) => {
        const { credentialData = {} } = cloneDeep(store.getState().IntegrationReducer);
        console.log('ClonedDataenableOrDisable', response, 'credentialData', credentialData);
        dispatch(
          integrationDataChange({
            isEditCredentialModalOpen: true,
            credentialData: { ...response, client_secret: credentialData?.client_secret },
          }),
        );
        resolve(response);
      })
      .catch((error) => {
        console.log('errorenableOrDisableOauthCredential', error);
        reject(error);
      });
  });

export const decryptyOauthCredentialApiThunk = (params) => (dispatch) =>
  new Promise((resolve, reject) => {
    decryptyOauthCredentialApi(params)
      .then((response) => {
        const { credentialData = {} } = cloneDeep(store.getState().IntegrationReducer);
        console.log('responseDataDecryptOauth', response, 'credentialData', credentialData);
        dispatch(
          integrationDataChange({
            isEditCredentialModalOpen: true,
            credentialData: { ...credentialData, client_secret: response?.client_secret },
          }),
        );
        resolve(response);
      })
      .catch((error) => {
        console.log('errorDecryptOauthCredential', error);
        reject(error);
      });
  });

export const verifyOAuth2CredentialsThunk = (params, verifierAndChallenge = {}) => (dispatch) =>
  new Promise((resolve) => {
    setPointerEvent(true);
    const encryptionDetails = JSON.parse(
      localStorage.getItem('encryption_details'),
    );
    instance.defaults.headers.common.pks_id = encryptionDetails.pks_id;
    instance.defaults.headers.common.aek = encryptionDetails.aek;
    params.isOAuthCredentials = true;
    const dataToBeEncrypted = jsUtils.cloneDeep(params);
    store.dispatch(setEncryptionData(dataToBeEncrypted));
    delete params?.clientData;
    delete params?.isOAuthCredentials;
    verifyOAuth2CredentialsApi(params)
      .then((res) => {
        setPointerEvent(false);
        let authorization_status = null;
        const additionalParams = {};
        const { authentication } = cloneDeep(
          store.getState().IntegrationReducer,
        );
        if (res.type === VERIFY_OAUTH_RESPOSNE_TYPE.SUCCESS) {
          authorization_status = AUTHORIZATION_STATUS.SUCCESS;
          if (res.refresh_token_id) { additionalParams.refresh_token_id = res.refresh_token_id; }
          if (res.expiry_date) additionalParams.expiry_date = res.expiry_date;
        } else if (res.type === VERIFY_OAUTH_RESPOSNE_TYPE.SUCCESS_WITH_WARNING) {
          authorization_status = AUTHORIZATION_STATUS.SUCCESS_WITH_WARNING;
          if (res.refresh_token_id) { additionalParams.refresh_token_id = res.refresh_token_id; }
          if (res.expiry_date) additionalParams.expiry_date = res.expiry_date;
        } else {
          authorization_status = AUTHORIZATION_STATUS.FAILURE;
        }
        console.log(
          {
            ...authentication,
            authorization_status,
            ...additionalParams,
            ...verifierAndChallenge,
          },
          res,
          additionalParams,
          'nkn,njn',
        );
        dispatch(
          integrationDataChange({
            authentication: {
              ...authentication,
              authorization_status,
              ...additionalParams,
              ...verifierAndChallenge,
            },
          }),
        );
        resolve(true);
      })
      .catch(() => {
        setPointerEvent(false);
        updatePostLoader(false);
        const { authentication } = cloneDeep(
          store.getState().IntegrationReducer,
        );
        dispatch(
          integrationDataChange({
            authentication: {
              ...authentication,
              authorization_status: AUTHORIZATION_STATUS.FAILURE,
            },
          }),
        );
        resolve(false);
      });
  });

export const publishIntegrationConnectorApiThunk =
  (data, successCallback, t) => (dispatch) =>
    new Promise((resolve, reject) => {
      publishIntegrationConnectorApi(data)
        .then((response) => {
          updatePostLoader(false);
          if (successCallback) successCallback();
          resolve(response);
        })
        .catch((error) => {
          const { admins } = cloneDeep(store.getState().IntegrationReducer);
          const { error_list, serverErrorText, additionalData } = getServerErrors(error, t, { admins });
          console.log('Publisherr0list', error_list, 'serverErrorText', serverErrorText, 'additionalDataPublisherror1', additionalData, 'admins', admins);
          if (!jsUtils.isEmpty(additionalData?.disabledAdminUsers) || !isEmpty(additionalData?.disabledAdminTeams)) {
            dispatch(
              integrationDataChange({ isInvalidUserModalOpen: true }),
            );
          }
          if (!isEmpty(error_list)) {
            dispatch(
              integrationDataChange({ error_list, ...additionalData }),
            );
          }
          showToastPopover(
            serverErrorText,
            EMPTY_STRING,
            FORM_POPOVER_STATUS.SERVER_ERROR,
            true,
          );
          reject(error);
          updatePostLoader(false);
        });
    });

export const deleteIntegrationConnectorApiThunk = (data) => () =>
  new Promise((resolve, reject) => {
    deleteIntegrationConnectorApi(data)
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });

export const deleteWorkhallAPIConfigurationThunk = (data) => () =>
  new Promise((resolve, reject) => {
    deleteWorkhallApiConfiguration(data)
      .then((response) => {
        showToastPopover('Workhall API Deleted Successfully', EMPTY_STRING, FORM_POPOVER_STATUS.DELETE, true);
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });

export const getSingleIntegrationTemplateApiThunk = (params, singleConnectorDetails) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(
      integrationDataChange({
        isIntegrationTemplateLoading: true,
      }),
    );
    getIntegrationTemplatesApi(params)
      .then((response) => {
        if (!isEmpty(response)) {
          const templateData = response.pagination_data[0];
          const { authentication = {} } = cloneDeep(
            store.getState().IntegrationReducer,
          );

          const authDetails = singleConnectorDetails?.authentication || authentication;

          dispatch(
            integrationDataChange({
              ...getExternalIntegrationStateData(templateData, true, authDetails, singleConnectorDetails?.no_of_events),
              isIntegrationTemplateLoading: false,
              isExternalIntegration: true,
            }),
          );
          resolve(response);
          return;
        }
        dispatch(
          integrationDataChange({
            isIntegrationTemplateLoading: false,
          }),
        );
        resolve(response);
      })
      .catch((error) => {
        dispatch(
          integrationDataChange({
            isIntegrationTemplateLoading: false,
          }),
        );
        reject(error);
      });
  });

export const generateOauthClientCredentialApiThunk = (data, reloadList) => (dispatch) =>
  new Promise((resolve, reject) => {
    const { error_list } = cloneDeep(store.getState().IntegrationReducer);
    generateOauthClientCredentialApi(data)
      .then((response) => {
        console.log('response generateOauth', response);
        if (!isEmpty(response)) {
          dispatch(
            integrationDataChange({
              isCreateCredentialModalOpen: false,
              credentialData: response,
              isEditCredentialModalOpen: true,
            }),
          );
          if (reloadList) {
            dispatch(
              integrationDataChange({
                isSingleOauthClicked: false,
              }),
            );
          }
        }
        resolve(response);
      })
      .catch((error) => {
        console.log('error generateOAuthcred', error);
        const errorData = get(error, ['response', 'data', 'errors', 0], {});
        if (errorData.type === 'exist' && errorData.field === 'name') {
          dispatch(
            integrationDataChange({
              error_list: {
                ...error_list,
                credential_name: OAUTH_CRED_LABELS(i18next.t).NAME_EXIST_ERROR,
              },
            }),
          );
        } else {
          showToastPopover(
            translate('error_popover_status.somthing_went_wrong'),
            translate('error_popover_status.refresh_try_again'),
            FORM_POPOVER_STATUS.SERVER_ERROR,
            true,
          );
        }
        reject(error);
      });
  });

export const updateOauthCredentialApiThunk = (data) => (dispatch) =>
  new Promise((resolve, reject) => {
    const { error_list } = cloneDeep(store.getState().IntegrationReducer);
    updateOauthCredentialApi(data)
      .then((response) => {
        const { credentialData = {} } = cloneDeep(store.getState().IntegrationReducer);
        console.log('response updateOauth', response);
        if (!isEmpty(response)) {
          dispatch(
            integrationDataChange({
              // to retain client ID and secret
              credentialData: { ...credentialData, ...response },
              isEditCredentialModalOpen: true,
              isEditableCredential: false,
              initialCredData: response,
            }),
          );
        }
        resolve(response);
      })
      .catch((error) => {
        console.log('error updateOauthCredential', error);
        const errorData = get(error, ['response', 'data', 'errors', 0], {});
        if (errorData.type === 'exist' && errorData.field === 'name') {
          dispatch(
            integrationDataChange({
              error_list: {
                ...error_list,
                credential_name: OAUTH_CRED_LABELS(i18next.t).NAME_EXIST_ERROR,
              },
            }),
          );
        } else {
          showToastPopover(
            translate('error_popover_status.somthing_went_wrong'),
            translate('error_popover_status.refresh_try_again'),
            FORM_POPOVER_STATUS.SERVER_ERROR,
            true,
          );
        }
        reject(error);
      });
  });

export const getIntegrationTemplatesApiThunk =
  (params, initialLoad) => (dispatch) =>
    new Promise((resolve, reject) => {
      if (initialLoad) {
        dispatch(
          integrationDataChange({
            integrationsTemplates: [],
            isLoadingIntegrationsTemplates: true,
            isErrorInLoadingIntegrationsTemplates: false,
          }),
        );
      } else {
        dispatch(
          integrationDataChange({
            isLoadingIntegrationsTemplates: true,
            isErrorInLoadingIntegrationsTemplates: false,
          }),
        );
      }
      getIntegrationTemplatesApi(params)
        .then((response) => {
          if (!isEmpty(response)) {
            let listData = [];
            let remainingTemplatesCount = 0;
            const { integrationsTemplates } = cloneDeep(
              store.getState().IntegrationReducer,
            );
            if (!isEmpty(response.pagination_data)) {
              listData = initialLoad
                ? response.pagination_data
                : [...integrationsTemplates, ...response.pagination_data];
              remainingTemplatesCount =
                response.pagination_details[0].total_count - listData.length;
            }
            dispatch(
              integrationDataChange({
                remainingTemplatesCount,
                integrationsTemplates: listData,
                hasMoreTemplates: remainingTemplatesCount > 0,
                totalTemplatesCount: response.pagination_details[0].total_count,
                currentTemplatesPage: response.pagination_details[0].page,
                isLoadingIntegrationsTemplates: false,
              }),
            );
            resolve(true);
          } else {
            showToastPopover(
              translate('error_popover_status.somthing_went_wrong'),
              translate('error_popover_status.refresh_try_again'),
              FORM_POPOVER_STATUS.SERVER_ERROR,
              true,
            );
            dispatch(
              integrationDataChange({
                isLoadingIntegrationsTemplates: false,
                isErrorInLoadingIntegrationsTemplates: true,
              }),
            );
            resolve(false);
          }
        })
        .catch((error) => {
          if (has(error, ['code']) && error.code === 'ERR_CANCELED') return;
          showToastPopover(
            translate('error_popover_status.somthing_went_wrong'),
            translate('error_popover_status.refresh_try_again'),
            FORM_POPOVER_STATUS.SERVER_ERROR,
            true,
          );
          dispatch(
            integrationDataChange({
              isLoadingIntegrationsTemplates: false,
              isErrorInLoadingIntegrationsTemplates: true,
            }),
          );
          resolve(false);
          reject(error);
        });
    });

export const discardIntegrationConnectorApiThunk = (data) => () =>
  new Promise((resolve, reject) => {
    discardIntegrationConnectorApi(data)
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });

export const discardWorkhallApiConfigurationThunk = (data) => () =>
  new Promise((resolve, reject) => {
    discardWorkhallApiConfiguration(data)
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });

export const checkIntegrationDependencyApiThunk = (data, isEvent = false) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(
      integrationDataChange({
        isDependencyListLoading: true,
        isDependencyModalVisible: !isEvent,
        isEventDependencyModalVisible: isEvent,
        isErrorInLoadingDependencyList: false,
      }),
    );
    checkIntegrationDependencyApi(data)
      .then((response) => {
        dispatch(
          integrationDataChange({
            isDependencyListLoading: false,
            dependencyData: response,
          }),
        );
        resolve(response);
      })
      .catch((error) => {
        dispatch(
          integrationDataChange({
            isDependencyListLoading: false,
            isErrorInLoadingDependencyList: true,
          }),
        );
        reject(error);
      });
  });

export const testIntegrationApiThunk = (params) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(integrationDataChange({ isTestLoading: true }));
    testIntegration(params)
      .then((response) => {
          const testResponse = get(response, ['result', 'response_info', 'data'], {});
          const testStatus = {
            status: get(response, ['success'], false),
            code: get(response, ['statusCode'], 200),
            time: get(response, ['result', 'response_time'], 60),
            isTested: true,
            showResponseWindow: has(response, ['result', 'response_info', 'data']),
          };
          dispatch(integrationDataChange({ eventTestResponse: { testResponse, testStatus }, isTestLoading: false }));
          updatePostLoader(false);
          setPointerEvent(false);
          resolve(response);
      })
      .catch((error) => {
        const testStatus = {
          status: false,
          code: EMPTY_STRING,
          time: EMPTY_STRING,
          isTested: true,
          showResponseWindow: false,
        };
        updatePostLoader(false);
        setPointerEvent(false);
        dispatch(integrationDataChange({ eventTestResponse: { testStatus }, isTestLoading: false }));
        reject(error);
      });
  });

export const getAllFieldsByFilterApiThunk = (paginationData) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(integrationDataChange({
      isAllFieldsLoading: true,
    }));

    apiGetAllFieldsList(paginationData)
      .then((res) => {
        const { pagination_data } = res;
        if (pagination_data?.length) {
            const fields = [];
            pagination_data.forEach((fieldData) => {
              fields.push({
                ...fieldData,
                value: fieldData.field_uuid,
              });
            });
            dispatch(
              integrationDataChange({
                allFields: fields,
                isAllFieldsLoading: false,
              }),
            );
            resolve(fields);
        } else {
          dispatch(
            integrationDataChange({
              allFields: [],
              isAllFieldsLoading: false,
            }),
          );
          resolve([]);
        }
      })
      .catch((err) => {
        dispatch(
          integrationDataChange({
            allFields: [],
            isAllFieldsLoading: false,
          }),
        );
        console.log(err);
        reject();
      });
  });

export const workhallApiConfigurationPostApiThunk = (data, donotUpdateDetails, t, updateId) => (dispatch) =>
  new Promise((resolve, reject) => {
    workhallApiConfigurationPostApi(data)
      .then((response) => {
        if (!isEmpty(response)) {
          if (updateId) {
            dispatch(
              integrationDataChange({
                _id: response?._id,
                version: response?.version,
                status: response?.status,
              }),
            );
          } else if (!donotUpdateDetails) {
          dispatch(
            integrationDataChange({
              ...getSingleWorkhallAPIReducerData(response, t),
            }),
          );
        }
      }
        resolve(response);
      })
      .catch((error) => {
        if (error?.response?.data?.errors?.[0]?.type === SOMEONE_EDITING) {
          updateSomeoneIsEditingPopover(
            error.response.data.errors[0].message,
            data?.api_configuration_uuid,
            false,
          );
        } else {
          const { error_list, serverErrorText, additionalData } = getServerErrors(error, t);
          if (!isEmpty(error_list) || !isEmpty(additionalData)) {
            dispatch(
              integrationDataChange({
                error_list,
                ...additionalData,
              }),
            );
          }
          showToastPopover(
            serverErrorText,
            EMPTY_STRING,
            FORM_POPOVER_STATUS.SERVER_ERROR,
            true,
          );
        }
        reject(error);
      });
  });

export const getWorkhallApiConfigurationApiThunk = (data, t) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(integrationDataChange({ isLoadingIntegrationDetail: true }));
    getWorkhallApiConfigurationApi(data)
      .then((response) => {
        let formattedData = {};
        if (!isEmpty(response)) {
          formattedData = getSingleWorkhallAPIReducerData(response, t);
          dispatch(
            integrationDataChange({
              ...formattedData,
              isLoadingIntegrationDetail: false,
            }),
          );
        }
        resolve(formattedData);
      })
      .catch((error) => {
        dispatch(
          integrationDataChange({
            isErrorInIntegrationDetail: true,
            isLoadingIntegrationDetail: false,
          }),
        );
        reject(error);
      });
  });

export const getAllFlowListApiThunk = (params, initialLoad, cancelToken) => (dispatch) =>
  new Promise((resolve, reject) => {
    if (initialLoad) {
      dispatch(
        integrationDataChange({
          allFlows: [],
          totalFlowsCount: 0,
          hasMoreFlows: false,
          isAllFlowListLoading: true,
          isErrorInLoadingFlows: false,
        }),
      );
    } else {
      dispatch(
        integrationDataChange({
          isErrorInLoadingFlows: false,
        }),
      );
    }
    if (!params.search) delete params.search;
    getAllFlows(params, cancelToken)
      .then((response) => {
        const { pagination_data } = response;
        const { allFlows } = cloneDeep(
          store.getState().IntegrationReducer,
        );
        if (pagination_data?.length) {
            const formattedResponse = [];
            pagination_data.forEach((fieldData) => {
              formattedResponse.push({
                ...fieldData,
                label: fieldData.flow_name,
                value: fieldData.flow_uuid,
              });
            });
            const listData = initialLoad
            ? formattedResponse
            : [...allFlows, ...formattedResponse];
            let paginationDetails = {};
            if (response.pagination_details?.[0]) {
              const remainingFlowsCount = response.pagination_details[0].total_count - listData.length;
              paginationDetails = {
                remainingFlowsCount,
                hasMoreFlows: remainingFlowsCount > 0,
                totalFlowsCount:
                  response.pagination_details[0]?.total_count,
                flowsCurrentPage: response.pagination_details[0]?.page,
              };
            }
            dispatch(
              integrationDataChange({
                allFlows: listData,
                isAllFlowListLoading: false,
                ...paginationDetails,
              }),
            );
            resolve(listData);
        } else {
          dispatch(
            integrationDataChange({
              isAllFlowListLoading: false,
            }),
          );
          resolve([]);
        }
      })
      .catch((err) => {
        dispatch(
          integrationDataChange({
            isAllFlowListLoading: false,
            isErrorInLoadingFlows: true,
          }),
        );
        console.log(err);
        reject();
      });
  });

export const getAllDataListApiThunk = (params, initialLoad, cancelToken) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(integrationDataChange({
      isAllDataListLoading: true,
    }));
    if (initialLoad) {
      dispatch(
        integrationDataChange({
          allDataLists: [],
          totalDataListsCount: 0,
          hasMoreDataLists: false,
          isAllDataListLoading: true,
          isErrorInLoadingDataLists: false,
        }),
      );
    } else {
      dispatch(
        integrationDataChange({
          isErrorInLoadingDataLists: false,
        }),
      );
    }
    if (!params.search) delete params.search;
    getAllViewDataList(params, cancelToken)
      .then((response) => {
        const { allDataLists } = cloneDeep(
          store.getState().IntegrationReducer,
        );
        const { pagination_data } = response;
        if (pagination_data?.length) {
            const formattedResponse = [];
            pagination_data.forEach((fieldData) => {
              formattedResponse.push({
                ...fieldData,
                label: fieldData.data_list_name,
                value: fieldData.data_list_uuid,
              });
            });
            const listData = initialLoad
            ? formattedResponse
            : [...allDataLists, ...formattedResponse];
            let paginationDetails = {};
            if (response.pagination_details?.[0]) {
              const remainingDataListsCount = response.pagination_details[0].total_count - listData.length;
              paginationDetails = {
                remainingDataListsCount,
                hasMoreDataLists: remainingDataListsCount > 0,
                totalDataListsCount:
                  response.pagination_details[0]?.total_count,
                dataListsCurrentPage: response.pagination_details[0]?.page,
              };
            }
            dispatch(
              integrationDataChange({
                allDataLists: listData,
                isAllDataListLoading: false,
                ...paginationDetails,
              }),
            );
            resolve(listData);
        } else {
          dispatch(
            integrationDataChange({
              allDataLists: [],
              isAllDataListLoading: false,
            }),
          );
          resolve([]);
        }
      })
      .catch((err) => {
        dispatch(
          integrationDataChange({
            allDataLists: [],
            isAllDataListLoading: false,
            isErrorInLoadingDataLists: true,
          }),
        );
        reject();
        console.log(err);
      });
  });

export const getInitiationStepActionsApiThunk = (params) => (dispatch) => {
  dispatch(integrationDataChange({
    isInitiationActionsLoading: true,
  }));

  getInitiationStepActions(params)
    .then((response) => {
      if (response?.actions) {
          dispatch(
            integrationDataChange({
              currentFlowActions: getCurrentFlowActions(response?.actions),
              isInitiationActionsLoading: false,
            }),
          );
      } else {
        dispatch(
          integrationDataChange({
            currentFlowActions: [],
            isInitiationActionsLoading: false,
          }),
        );
      }
    })
    .catch((err) => {
      dispatch(
        integrationDataChange({
          currentFlowActions: [],
          isInitiationActionsLoading: false,
        }),
      );
      console.log(err);
    });
  };

export const workhallApiConfigurationPublishApiThunk = (data, successCallback, t) => (dispatch) =>
  new Promise((resolve, reject) => {
    workhallApiConfigurationPublishApi(data)
      .then((response) => {
        updatePostLoader(false);
        if (successCallback) successCallback();
        resolve(response);
      })
      .catch((error) => {
        const { admins } = cloneDeep(store.getState().IntegrationReducer);
        const { error_list, serverErrorText, additionalData } = getServerErrors(error, t, { admins });
        console.log('PublishWorkhallError', error_list, 'serverErrorText', serverErrorText, 'additionalData', additionalData, 'admins', admins);
        if (!jsUtils.isEmpty(additionalData?.disabledAdminUsers) || !isEmpty(additionalData?.disabledAdminTeams)) {
          dispatch(
            integrationDataChange({ isInvalidUserModalOpen: true }),
          );
        }
        console.log(additionalData, 'jhjkkk additionalData');
          if (!isEmpty(error_list) || !isEmpty(additionalData)) {
            dispatch(
              integrationDataChange({
                error_list,
                ...additionalData,
              }),
            );
          }
          showToastPopover(
            serverErrorText,
            EMPTY_STRING,
            FORM_POPOVER_STATUS.SERVER_ERROR,
            true,
          );
        updatePostLoader(false);
        reject(error);
      });
  });

export const getAllIntegrationEventsApiThunk =
  (params, currentConnector, setCancelToken) => (dispatch) =>
    new Promise((resolve, reject) => {
      dispatch(
        integrationDataChange({
          isEventsLoading: true,
        }),
      );
      getAllIntegrationEventsApi(params, setCancelToken)
        .then((response) => {
            dispatch(
              integrationDataChange({
                events: response?.pagination_data,
                events_current_page: params?.page,
                events_pagination_details: response?.pagination_details,
                events_total_count: get(response, ['pagination_details', 0, 'total_count'], 0),
                isEventsLoading: false,
              }),
            );
            resolve(response);
        })
        .catch((error) => {
          if (error && error.code === 'ERR_CANCELED') return;

          const errorList = error?.response?.data?.errors || [];
          switch (errorList?.[0]?.type) {
            case SOMEONE_EDITING:
              updateSomeoneIsEditingPopover(
                error.response.data.errors[0].message,
                currentConnector?.connector_uuid,
              );
              break;
            case ERROR_TYPE_STRING_GUID_ERROR:
              showToastPopover(
                translate(SERVER_ERROR_MESSAGES.ERROR_TYPE_STRING_GUID_ERROR.TITLE),
                EMPTY_STRING,
                FORM_POPOVER_STATUS.SERVER_ERROR,
                true,
              );
            break;
            default:
              showToastPopover(
                translate('error_popover_status.somthing_went_wrong'),
                translate('error_popover_status.refresh_try_again'),
                FORM_POPOVER_STATUS.SERVER_ERROR,
                true,
              );
            break;
          }
          dispatch(
            integrationDataChange({
              isEventsLoading: false,
            }),
          );
          reject(error);
        });
    });

export const integrationAddEventApiThunk = (data, successCallback, t) => (dispatch) =>
  new Promise((resolve, reject) => {
    integrationAddEventApi(data)
      .then((response) => {
        updatePostLoader(false);
        if (successCallback) successCallback();
        dispatch(
          integrationDataChange({
            connector_events_count: get(response, ['no_of_events'], 0),
          }),
        );
        resolve(response);
      })
      .catch((error) => {
        const { admins } = cloneDeep(store.getState().IntegrationReducer);
        const { error_list, serverErrorText, additionalData } = getServerErrors(error, t, { admins });
        if (!isEmpty(error_list) || !isEmpty(additionalData)) {
          dispatch(
            integrationDataChange({
              error_list,
              ...additionalData,
            }),
          );
        }
        showToastPopover(
          serverErrorText,
          EMPTY_STRING,
          FORM_POPOVER_STATUS.SERVER_ERROR,
          true,
        );
        updatePostLoader(false);
        reject(error);
      });
  });

export const integrationRemoveEventApiThunk = (data, successCallback, t) => (dispatch) =>
  new Promise((resolve, reject) => {
    integrationRemoveEventApi(data)
      .then((response) => {
        updatePostLoader(false);
        if (successCallback) successCallback();
        dispatch(
          integrationDataChange({
            connector_events_count: get(response, ['no_of_events'], 0),
          }),
        );
        resolve(response);
      })
      .catch((error) => {
        const { admins } = cloneDeep(store.getState().IntegrationReducer);
        const { error_list, serverErrorText, additionalData } = getServerErrors(error, t, { admins });
        if (!isEmpty(error_list) || !isEmpty(additionalData)) {
          dispatch(
            integrationDataChange({
              error_list,
              ...additionalData,
            }),
          );
        }
        showToastPopover(
          serverErrorText,
          EMPTY_STRING,
          FORM_POPOVER_STATUS.SERVER_ERROR,
          true,
        );
        updatePostLoader(false);
        reject(error);
      });
  });

export const saveDBConnectorPostApiThunk = (data, t, isFromAddIntegration = true) => (dispatch) =>
  new Promise((resolve, reject) => {
    if (process.env.REACT_APP_ENCRYPTION_ENABLED === '1') {
      const encryptionDetails = JSON.parse(
        localStorage.getItem('encryption_details'),
      );
      if (
        encryptionDetails?.pks_id &&
        encryptionDetails?.public_key &&
        encryptionDetails?.aes_key &&
        encryptionDetails?.aek
      ) {
        data.isDBConnector = true;
        const dataToBeEncrypted = jsUtils.cloneDeep(data);
        store.dispatch(setEncryptionData(dataToBeEncrypted));
        const request_enc_data = enryptAesEncryptionData(
          { connection_details: data?.connection_details },
          encryptionDetails.aes_key,
        );
        if (!data?.template_id && data.base_url) {
          data.base_url = encodeURIComponent(data.base_url);
        }
        data.request_enc_data = request_enc_data;
        delete data?.connection_details;
        delete data?.isDBConnector;
        instance.defaults.headers.common.pks_id = encryptionDetails.pks_id;
        instance.defaults.headers.common.aek = encryptionDetails.aek;
      }
    }
    updatePostLoader(true);
    saveDBConnectorApi(data)
      .then((response) => {
        if (!isEmpty(response)) {
          const { authentication } = cloneDeep(
            store.getState().IntegrationReducer.dbConnector,
          );
          let prevAuthentication = {};
          if (isFromAddIntegration) {
            prevAuthentication = authentication;
          } else {
            prevAuthentication = {
              password: authentication?.password,
              password_preview: authentication?.password_preview,
              password_toggle: authentication?.password_toggle,
            };
          }
          const dbConnectionData = getSingleDBConnectorAuthReducerData(
            response,
            prevAuthentication,
          );
          dispatch(dbConnectorDataChange(dbConnectionData));
          dispatch(
            integrationDataChange({
              connector_uuid: response.db_connector_uuid,
              _id: response._id,
              name: response.db_connector_name,
              description: response.description,
            }),
          );
          const connectionResponse = response?.connection_response;
          if (!connectionResponse?.is_connection_established && !isFromAddIntegration) {
            const error_message = connectionResponse?.error_details?.error_message;
            let errorSubTitle = DB_CONNECTOR_INCORRECT_MESSAGE(t).SOMETHING_WENT_WRONG;
            if (
              error_message.includes('ETIMEDOUT') ||
              error_message.includes('ENOTFOUND') ||
              error_message.includes('Connection lost')
            ) {
              errorSubTitle =
                DB_CONNECTOR_INCORRECT_MESSAGE(t).PORT_OR_HOST_NAME;
            } else if (error_message.includes('Access denied')) {
              errorSubTitle =
                DB_CONNECTOR_INCORRECT_MESSAGE(t).USERNAME_OR_PASSWORD;
            } else if (error_message.includes('Unknown database')) {
              errorSubTitle = DB_CONNECTOR_INCORRECT_MESSAGE(t).DATABASE;
            } else if (error_message.includes('Login failed')) {
              errorSubTitle = error_message;
            }
            showToastPopover(
              t(INTEGRATION_ERROR_STRINGS.CONFIG),
              errorSubTitle,
              FORM_POPOVER_STATUS.SERVER_ERROR,
              true,
            );
          }
        }
        updatePostLoader(false);
        resolve(response);
      })
      .catch((error) => {
        updatePostLoader(false);
        reject(error);
        const { error_list, serverErrorText } = getServerErrors(error, t);
        if (!isEmpty(error_list)) {
          if (isFromAddIntegration) {
            dispatch(integrationDataChange({ error_list }));
          } else {
            dispatch(dbConnectorDataChange({ error_list }));
          }
        }
        showToastPopover(
          serverErrorText,
          EMPTY_STRING,
          FORM_POPOVER_STATUS.SERVER_ERROR,
          true,
        );
      });
  });

export const publishDBConnectorApiThunk = (data, successCallback) => () =>
  new Promise((reslove, reject) => {
    updatePostLoader(true);
    publishDBConnectorApi(data)
      .then((response) => {
        if (successCallback) successCallback();
        updatePostLoader(false);
        reslove(response);
      })
      .catch((error) => {
        updatePostLoader(false);
        reject(error);
      });
  });

export const discardDBConnectorApiThunk = (data) => () =>
  new Promise((resolve, reject) => {
    discardDBConnectorApi(data)
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });

export const deleteDBConnectorApiThunk = (data) => () =>
  new Promise((resolve, reject) => {
    deleteDBConnectorApi(data)
      .then((response) => {
        showToastPopover('DB connector Deleted Successfully', EMPTY_STRING, FORM_POPOVER_STATUS.DELETE, true);
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });

export const getDBConnectorConfigurationApiThunk = (params, initialLoad, setCancelToken) => (dispatch) =>
  new Promise((resolve, reject) => {
    if (initialLoad) {
      dispatch(
        integrationDataChange({
          integrationsList: [],
          totalIntegrationsCount: 0,
          hasMoreIntegrations: false,
          isLoadingIntegrationsList: true,
          isErrorInLoadingIntegrationsList: false,
        }),
      );
    } else {
      dispatch(
        integrationDataChange({
          isLoadingIntegrationsList: true,
          isErrorInLoadingIntegrationsList: false,
        }),
      );
    }
    getDBConnectorConfigurationApi(params, setCancelToken)
      .then((response) => {
        if (!isEmpty(response)) {
          let listData = [];
          let remainingIntegrationsCount = 0;
          const { integrationsList } = cloneDeep(
            store.getState().IntegrationReducer,
          );
          if (
            !isEmpty(response.pagination_data) &&
            !isEmpty(response.pagination_details)
          ) {
            listData = initialLoad
              ? response.pagination_data
              : [...integrationsList, ...response.pagination_data];
            remainingIntegrationsCount =
              response.pagination_details[0].total_count - listData.length;
          }
          dispatch(
            integrationDataChange({
              remainingIntegrationsCount,
              integrationsList: listData,
              hasMoreIntegrations: remainingIntegrationsCount > 0,
              totalIntegrationsCount:
                response.pagination_details[0]?.total_count,
              currentPage: response.pagination_details[0]?.page,
              isLoadingIntegrationsList: false,
            }),
          );
          resolve(true);
        } else {
          showToastPopover(
            translate('error_popover_status.somthing_went_wrong'),
            translate('error_popover_status.refresh_try_again'),
            FORM_POPOVER_STATUS.SERVER_ERROR,
            true,
          );
          dispatch(
            integrationDataChange({
              isLoadingIntegrationsList: false,
              isErrorInLoadingIntegrationsList: true,
            }),
          );
          resolve(false);
        }
      })
      .catch((error) => {
        if (has(error, ['code']) && error.code === 'ERR_CANCELED') return;
        showToastPopover(
          translate('error_popover_status.somthing_went_wrong'),
          translate('error_popover_status.refresh_try_again'),
          FORM_POPOVER_STATUS.SERVER_ERROR,
          true,
        );
        dispatch(
          integrationDataChange({
            isLoadingIntegrationsList: false,
            isErrorInLoadingIntegrationsList: true,
          }),
        );
        resolve(false);
        reject(error);
      });
  });

export const getSingleDBConnetorConfigurationApiThunk = (data) => (dispatch) =>
  new Promise((reslove, reject) => {
    getDBConnectorConfigurationApi(data)
      .then((response) => {
        if (!isEmpty(response)) {
          const data = getSingleDBConnectorAuthReducerData(response);
          dispatch(dbConnectorDataChange(data));
          dispatch(
            integrationDataChange({
              _id: response._id,
              connector_uuid: response.db_connector_uuid,
              name: response.db_connector_name,
              description: response.description,
              api_type: INTEGRATION_CONSTANTS.API_TYPE.DB_CONNECTION,
              version_number: response?.version_number,
              status: response?.status,
              is_active: response?.is_active,
            }),
          );
        }
        reslove(response);
      })
      .catch((error) => {
        reject(error);
        if (error?.response?.data?.errors?.[0]?.type === SOMEONE_EDITING) {
          updateSomeoneIsEditingPopover(
            error.response.data.errors[0].message,
            data?.db_connector_uuid,
            false,
            true,
          );
        }
      });
  });

export const getTablesListApiThunk = (data, t = translateFunction) => (dispatch) =>
  new Promise((reslove, reject) => {
    updatePostLoader(true);
    getTablesListApi(data)
      .then((response) => {
        dispatch(dbConnectorDataChange({ table_list: response }));
        updatePostLoader(false);
        reslove(response);
      })
      .catch((error) => {
        const errors = error?.response?.data?.errors;
        if (errors) {
          showToastPopover(
            t(INTEGRATION_ERROR_STRINGS.CONFIG),
            DB_CONNECTOR_INCORRECT_MESSAGE(t).SOMETHING_WENT_WRONG,
            FORM_POPOVER_STATUS.SERVER_ERROR,
            true,
          );
        }
        updatePostLoader(false);
        reject(error);
      });
  });

export const getTableInfoApiThunk = (data) => (dispatch) =>
  new Promise((reslove, reject) => {
    getTableInfoApi(data)
      .then((response) => {
        dispatch(dbConnectorDataChange({ table_info: response }));
        reslove(response);
      })
      .catch((error) => {
        reject(error);
      });
  });

export const fetchDBDataApiThunk = (data, t = translateFunction) => (dispatch) =>
  new Promise((reslove, reject) => {
    fetchDBDataApi(data)
      .then((response) => {
        if (jsUtils.isArray(response.query_data) && (jsUtils.isUndefined(response?.query_data?.status))) {
          const responseData = {
            query_data: response?.query_data,
            query_details: response?.query_details,
          };
          dispatch(dbConnectorDataChange(responseData));
        } else {
          showToastPopover(DB_CONNECTOR_INCORRECT_MESSAGE(t).SOMETHING_WENT_WRONG, response?.query_data?.errorMessage || EMPTY_STRING, FORM_POPOVER_STATUS.SERVER_ERROR, true);
        }
        reslove(response);
      })
      .catch((error) => {
        reject(error);
      });
  });

export const postDBConnectorQueryApiThunk = (data, t) => (dispatch) =>
  new Promise((reslove, reject) => {
    updatePostLoader(true);
    postDBConnectorQueryApi(data)
      .then((response) => {
        if (!isEmpty(response)) {
          const DBConnectorQueryData = getSingleDBConnectorQueryReducerData(response);
          dispatch(dbConnectorDataChange({ query: DBConnectorQueryData }));
        }
        updatePostLoader(false);
        reslove(response);
      })
      .catch((error) => {
        const { error_list, serverErrorText } = getQueryServerErrors(error, t);
        if (!isEmpty(error_list)) {
          dispatch(dbConnectorDataChange({ error_list }));
        }
        showToastPopover(
          serverErrorText,
          EMPTY_STRING,
          FORM_POPOVER_STATUS.SERVER_ERROR,
          true,
        );
        updatePostLoader(false);
        reject(error);
      });
  });

export const getDBConnectorQueryConfigurationApiThunk = (params, initialLoad, setCancelToken) => (dispatch) =>
  new Promise((resolve, reject) => {
    if (initialLoad) {
      dispatch(
        dbConnectorDataChange({
          queryList: [],
          totalQueryCount: 0,
          hasMoreQuery: false,
          isQueryListLoading: true,
          isErrorInQueryListLoading: false,
        }),
      );
    } else {
      dispatch(
        dbConnectorDataChange({
          isQueryListLoading: true,
          isErrorInQueryListLoading: false,
        }),
      );
    }
    getDBConnectorQueryApi(params, setCancelToken)
      .then((response) => {
        if (!isEmpty(response)) {
          let queryListData = [];
          let remainingQueryCount = 0;
          const { queryList } = cloneDeep(
            store.getState().IntegrationReducer.dbConnector,
          );
          if (
            !isEmpty(response.pagination_data) &&
            !isEmpty(response.pagination_details)
          ) {
            queryListData = initialLoad
              ? response.pagination_data
              : [...queryList, ...response.pagination_data];
            remainingQueryCount =
              response.pagination_details[0].total_count -
              queryListData.length;
          }
          dispatch(
            dbConnectorDataChange({
              remainingQueryCount,
              queryList: queryListData,
              hasMoreQuery: remainingQueryCount > 0,
              totalQueryCount: response.pagination_details[0]?.total_count,
              currentQueryPage: response.pagination_details[0]?.page,
              isQueryListLoading: false,
            }),
          );
          resolve(true);
        } else {
          showToastPopover(
            translate('error_popover_status.somthing_went_wrong'),
            translate('error_popover_status.refresh_try_again'),
            FORM_POPOVER_STATUS.SERVER_ERROR,
            true,
          );
          dispatch(
            dbConnectorDataChange({
              isQueryListLoading: false,
              isErrorInQueryListLoading: true,
            }),
          );
          resolve(false);
        }
      })
      .catch((error) => {
        if (has(error, ['code']) && error.code === 'ERR_CANCELED') return;
        showToastPopover(
          translate('error_popover_status.somthing_went_wrong'),
          translate('error_popover_status.refresh_try_again'),
          FORM_POPOVER_STATUS.SERVER_ERROR,
          true,
        );
        dispatch(
          dbConnectorDataChange({
            isQueryListLoading: false,
            isErrorInQueryListLoading: true,
          }),
        );
        reject(error);
      });
  });

export const getSingleDBConnetorQueryConfigurationApiThunk = (data, t) => (dispatch) =>
  new Promise((reslove, reject) => {
    getDBConnectorQueryApi(data)
      .then((response) => {
        if (!isEmpty(response)) {
          const data = getSingleDBConnectorQueryReducerData(response, true);
          const tableListData = {
            connector_id: response.connector_id,
            table_type: data.data_source_type,
          };
          dispatch(getTablesListApiThunk(tableListData, t)).then(() => {
            const tableInfoData = {
              connector_id: response.connector_id,
              table_name: data.table_name,
            };
            dispatch(getTableInfoApiThunk(tableInfoData)).then(() => {
              dispatch(dbConnectorDataChange({ query: data }));
              reslove(response);
            });
          });
        }
      })
      .catch((error) => {
        reject(error);
        if (error?.response?.data?.errors?.[0]?.type === SOMEONE_EDITING) {
          updateSomeoneIsEditingPopover(
            error.response.data.errors[0].message,
            data?.db_connector_uuid,
            false,
            true,
          );
        }
      });
  });

export const publishDBConnectorQueryApiThunk = (data, successCallback) => () =>
  new Promise((reslove, reject) => {
    updatePostLoader(true);
    publishDBConnectorQueryApi(data)
      .then((response) => {
        if (successCallback) successCallback();
        updatePostLoader(false);
        reslove(response);
      })
      .catch((error) => {
        updatePostLoader(false);
        reject(error);
      });
  });

export const deleteDBConnectorQueryApiThunk = (data) => () =>
  new Promise((resolve, reject) => {
    deleteDBConnectorQueryApi(data)
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });

export const getDBConnetorOptionsApiThunk = (params, setCancelToken) => (dispatch) =>
  new Promise((reslove, reject) => {
    getDBConnectorSupportedOptionsApi(params, setCancelToken)
      .then((response) => {
        const responseData = {};
        if (isEmpty(params?.database_type)) {
          responseData.allowed_db_types = response.allowed_db_types;
        } else {
          responseData.db_allowed_options =
            response.db_allowed_options[params.database_type];
        }
        dispatch(dbConnectorDataChange(responseData));
        reslove(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
