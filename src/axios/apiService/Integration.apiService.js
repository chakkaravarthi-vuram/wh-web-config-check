import axios from 'axios';
import { axiosGetUtils, axiosPostUtils } from 'axios/AxiosHelper';
import {
  normalizeCheckEventDependency,
  normalizeDeleteConnector,
  normalizeDiscardConnector,
  normalizeGetTemplates,
  normalizePostConnector,
  normalizeVerifyOauth2Credentials,
  normalizeWorkhallPostApi,
  normalizeInitiationStepActors,
  normalizeWorkhallPublishApi,
} from 'axios/apiNormalizer/Integration.apiNormalizer';
import {
  CHECK_INTEGRATION_DEPENDENCY,
  DELETE_CONNECTOR,
  DISCARD_CONNECTOR,
  GET_EVENT_CATEGORY,
  GET_INTEGRATION_TEMPLATES,
  INTEGRATION_CONNECTOR,
  PUBLISH_CONNECTOR,
  VERIFY_OAUTH2_CREDENTIALS,
} from 'urls/ApiUrls';
import {
  GET_ALL_USERS_OR_TEAMS,
  GET_OAUTH_CLIENT_CREDENTIALS,
  GET_INITIATION_STEP_ACTIONS,
  WORKHALL_API_CONFIGURATION,
  WORKHALL_API_PUBLISH,
  GENERATE_OAUTH_CLIENT_CREDENTIALS,
  DELETE_OAUTH_CLIENT_CREDENTIALS,
  ENABLE_DISABLE_CLIENT_CREDENTIALS,
  UPDATE_OAUTH_CLIENT_CREDENTIALS,
  DECRYPT_OAUTH_CLIENT_CREDENTIALS,
  DISCARD_WORKHALL_API_CONFIGURATION,
  DELETE_WORKHALL_API_CONFIURATION,
  GET_ALL_USERS,
  GET_ALL_EVENTS,
  ADD_INTEGRATION_EVENT,
  REMOVE_INTEGRATION_EVENT,
  DB_CONNECTOR,
  DISCARD_DB_CONNECTOR,
  DELETE_DB_CONNECTOR,
  GET_TABLES_LIST,
  GET_TABLE_INFO,
  FETCH_DB_DATA,
  DB_CONNECTOR_QUERY,
  PUBLISH_DB_CONNECTOR_QUERY,
  DELETE_DB_CONNECTOR_QUERY,
  GET_DB_CONNECTOR_SUPPORTED_OPTIONS,
  PUBLISH_DB_CONNECTOR,
} from '../../urls/ApiUrls';
import {
  normalizeDeleteOauthCredential,
  normalizeGenerateOauthClientCreds,
  normalizeWorkhallApiGetConfiguration,
  normalizeGetOAuthClientCredentials,
  normalizePostOauthCredential,
  normalizeGetAllEvents,
  normalizeAddEvent,
  normalizeRemoveEventApi,
  normalizeSaveDBConnectorApi,
  normalizeDiscardDBConnectorApi,
  normalizeDeleteDBConnectorApi,
  normalizeGetTableListApi,
  normalizeGetTableInfoApi,
  normalizeFetchDBDataApi,
  normalizePublishDBConnectorQueryApi,
  normalizeDeleteDBConnectorQueryApi,
  normalizeGetDBConnectorSupportedOptionsApi,
  normalizePostDBConnectorQueryApi,
  normalizeGetDBConnectorQueryApi,
  normalizeGetDBConnectorApi,
  normalizePublishDBConnectorApi,
} from '../apiNormalizer/Integration.apiNormalizer';

const { CancelToken } = axios;

let cancelTokenForGetAllIntegrations;
let cancelTokenForGetAllEvents;

export const postIntegrationConnectorApi = (data) =>
  new Promise((resolve, reject) => {
    axiosPostUtils(INTEGRATION_CONNECTOR, data)
      .then((response) => {
        resolve(normalizePostConnector(response));
      })
      .catch((error) => {
        reject(error);
      });
  });

export const getIntegrationConnectorApi = (params, setCancelToken) => {
  if (cancelTokenForGetAllIntegrations) cancelTokenForGetAllIntegrations();
  return new Promise((resolve, reject) => {
    axiosGetUtils(INTEGRATION_CONNECTOR, {
      params,
      cancelToken: new CancelToken((c) => {
        if (setCancelToken) setCancelToken?.(c);
        else cancelTokenForGetAllIntegrations = c;
      }),
    })
      .then((res) => {
        resolve(normalizePostConnector(res));
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const getOauthClientCredentialsApi = (params, setCancelToken) =>
  new Promise((resolve, reject) => {
    axiosGetUtils(GET_OAUTH_CLIENT_CREDENTIALS, {
      params,
      cancelToken: new CancelToken((c) => {
        setCancelToken?.(c);
      }),
    })
      .then((res) => {
        console.log('resgetOauthClientCredentialsApi', normalizeGetOAuthClientCredentials(res));
        resolve(normalizeGetOAuthClientCredentials(res));
      })
      .catch((err) => {
        console.log('err', err);
        reject(err);
      });
  });

export const getIntegrationEventCategoriesApi = (params) =>
  new Promise((resolve, reject) => {
    axiosGetUtils(GET_EVENT_CATEGORY, {
      params,
    })
      .then((res) => {
        resolve(normalizePostConnector(res));
      })
      .catch((err) => {
        reject(err);
      });
  });

export const deleteOauthCredentialApi = (data) =>
  new Promise((resolve, reject) => {
    axiosPostUtils(DELETE_OAUTH_CLIENT_CREDENTIALS, data)
      .then((response) => {
        resolve(normalizeDeleteOauthCredential(response));
      })
      .catch((error) => {
        reject(error);
      });
  });

export const enableOrDisableOauthApi = (data) =>
  new Promise((resolve, reject) => {
    axiosPostUtils(ENABLE_DISABLE_CLIENT_CREDENTIALS, data)
      .then((response) => {
        resolve(normalizePostOauthCredential(response));
      })
      .catch((error) => {
        reject(error);
      });
  });

export const decryptyOauthCredentialApi = (params) =>
  new Promise((resolve, reject) => {
    axiosGetUtils(DECRYPT_OAUTH_CLIENT_CREDENTIALS, {
      params,
    })
      .then((res) => {
        resolve(normalizeGetOAuthClientCredentials(res));
      })
      .catch((err) => {
        reject(err);
      });
  });

export const verifyOAuth2CredentialsApi = (data) =>
  new Promise((resolve, reject) => {
    axiosPostUtils(VERIFY_OAUTH2_CREDENTIALS, data)
      .then((res) => {
        resolve(normalizeVerifyOauth2Credentials(res));
      })
      .catch((err) => reject(err));
  });

export const publishIntegrationConnectorApi = (data) =>
  new Promise((resolve, reject) => {
    axiosPostUtils(PUBLISH_CONNECTOR, data)
      .then((response) => {
        resolve(normalizePostConnector(response));
      })
      .catch((error) => {
        reject(error);
      });
  });

export const deleteIntegrationConnectorApi = (data) =>
  new Promise((resolve, reject) => {
    axiosPostUtils(DELETE_CONNECTOR, data)
      .then((response) => {
        resolve(normalizeDeleteConnector(response));
      })
      .catch((error) => {
        reject(error);
      });
  });

export const deleteWorkhallApiConfiguration = (data) =>
  new Promise((resolve, reject) => {
    axiosPostUtils(DELETE_WORKHALL_API_CONFIURATION, data)
      .then((response) => {
        resolve(normalizeDeleteConnector(response));
      })
      .catch((error) => {
        reject(error);
      });
  });

export const getIntegrationTemplatesApi = (params) =>
  new Promise((resolve, reject) => {
    axiosGetUtils(GET_INTEGRATION_TEMPLATES, {
      params,
    })
      .then((res) => {
        resolve(normalizeGetTemplates(res));
      })
      .catch((err) => {
        reject(err);
      });
  });

export const getTeamsAndUsers = (params, setCancelToken) =>
  new Promise((resolve, reject) => {
    axiosGetUtils(GET_ALL_USERS_OR_TEAMS, {
      params,
      cancelToken: new CancelToken((c) => {
        setCancelToken(c);
      }),
    })
      .then((response) => {
        resolve(response?.data?.result?.data);
      })
      .catch((error) => {
        reject(error);
      });
});

export const getAllUsers = (params, setCancelToken) =>
  new Promise((resolve, reject) => {
    axiosGetUtils(GET_ALL_USERS, {
      params,
      cancelToken: new CancelToken((c) => {
        setCancelToken(c);
      }),
    })
      .then((response) => {
        resolve(response?.data?.result?.data);
      })
      .catch((error) => {
        reject(error);
      });
});

export const discardIntegrationConnectorApi = (data) =>
  new Promise((resolve, reject) => {
    axiosPostUtils(DISCARD_CONNECTOR, data)
      .then((response) => {
        resolve(normalizeDiscardConnector(response));
      })
      .catch((error) => {
        reject(error);
      });
  });

export const discardWorkhallApiConfiguration = (data) =>
new Promise((resolve, reject) => {
  axiosPostUtils(DISCARD_WORKHALL_API_CONFIGURATION, data)
    .then((response) => {
      resolve(normalizeDiscardConnector(response));
    })
    .catch((error) => {
      reject(error);
    });
});

export const checkIntegrationDependencyApi = (data) =>
  new Promise((resolve, reject) => {
    axiosPostUtils(CHECK_INTEGRATION_DEPENDENCY, data)
      .then((res) => {
        resolve(normalizeCheckEventDependency(res));
      })
      .catch((err) => {
        reject(err);
      });
  });

export const workhallApiConfigurationPostApi = (data) =>
  new Promise((resolve, reject) => {
    axiosPostUtils(WORKHALL_API_CONFIGURATION, data)
      .then((response) => {
        resolve(normalizeWorkhallPostApi(response));
      })
      .catch((error) => {
        reject(error);
      });
  });

export const generateOauthClientCredentialApi = (data) =>
  new Promise((resolve, reject) => {
    axiosPostUtils(GENERATE_OAUTH_CLIENT_CREDENTIALS, data)
      .then((response) => {
        resolve(normalizeGenerateOauthClientCreds(response));
      })
      .catch((error) => {
        reject(error);
      });
  });

export const updateOauthCredentialApi = (data) =>
  new Promise((resolve, reject) => {
    axiosPostUtils(UPDATE_OAUTH_CLIENT_CREDENTIALS, data)
      .then((response) => {
        resolve(normalizePostOauthCredential(response));
      })
      .catch((error) => {
        reject(error);
      });
  });

export const getWorkhallApiConfigurationApi = (params, setCancelToken) =>
  new Promise((resolve, reject) => {
    axiosGetUtils(WORKHALL_API_CONFIGURATION, {
      params,
      cancelToken: new CancelToken((c) => {
        setCancelToken?.(c);
      }),
    })
      .then((res) => {
        resolve(normalizeWorkhallApiGetConfiguration(res));
      })
      .catch((err) => {
        reject(err);
      });
  });
export const getInitiationStepActions = (params) =>
  new Promise((resolve, reject) => {
    axiosGetUtils(GET_INITIATION_STEP_ACTIONS, {
      params,
    })
      .then((res) => {
        resolve(normalizeInitiationStepActors(res));
      })
      .catch((err) => {
        reject(err);
      });
  });

export const workhallApiConfigurationPublishApi = (data) =>
  new Promise((resolve, reject) => {
    axiosPostUtils(WORKHALL_API_PUBLISH, data)
      .then((response) => {
        resolve(normalizeWorkhallPublishApi(response));
      })
      .catch((error) => {
        reject(error);
      });
  });

export const getAllIntegrationEventsApi = (params, setCancelToken) => {
  if (cancelTokenForGetAllEvents) cancelTokenForGetAllEvents();
  return new Promise((resolve, reject) => {
    axiosGetUtils(GET_ALL_EVENTS, {
      params,
      cancelToken: new CancelToken((c) => {
        if (setCancelToken) setCancelToken?.(c);
        else cancelTokenForGetAllEvents = c;
      }),
    })
      .then((res) => {
        resolve(normalizeGetAllEvents(res));
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const integrationAddEventApi = (data) =>
  new Promise((resolve, reject) => {
    axiosPostUtils(ADD_INTEGRATION_EVENT, data)
      .then((response) => {
        resolve(normalizeAddEvent(response));
      })
      .catch((error) => {
        reject(error);
      });
  });

export const integrationRemoveEventApi = (data) =>
  new Promise((resolve, reject) => {
    axiosPostUtils(REMOVE_INTEGRATION_EVENT, data)
      .then((response) => {
        resolve(normalizeRemoveEventApi(response));
      })
      .catch((error) => {
        reject(error);
      });
  });

export const saveDBConnectorApi = (data) =>
  new Promise((resolve, reject) => {
    axiosPostUtils(DB_CONNECTOR, data)
      .then((response) => {
        resolve(normalizeSaveDBConnectorApi(response));
      })
      .catch((error) => {
        reject(error);
      });
  });

export const publishDBConnectorApi = (data) =>
  new Promise((resolve, reject) => {
    axiosPostUtils(PUBLISH_DB_CONNECTOR, data)
      .then((response) => {
        resolve(normalizePublishDBConnectorApi(response));
      })
      .catch((error) => {
        reject(error);
      });
  });

export const discardDBConnectorApi = (data) =>
  new Promise((resolve, reject) => {
    axiosPostUtils(DISCARD_DB_CONNECTOR, data)
      .then((response) => {
        resolve(normalizeDiscardDBConnectorApi(response));
      })
      .catch((error) => {
        reject(error);
      });
  });

export const deleteDBConnectorApi = (data) =>
  new Promise((resolve, reject) => {
    axiosPostUtils(DELETE_DB_CONNECTOR, data)
      .then((response) => {
        resolve(normalizeDeleteDBConnectorApi(response));
      })
      .catch((error) => {
        reject(error);
      });
  });

export const getDBConnectorConfigurationApi = (params, setCancelToken) =>
  new Promise((resolve, reject) => {
    axiosGetUtils(DB_CONNECTOR, {
      params,
      cancelToken: new CancelToken((c) => {
        setCancelToken?.(c);
      }),
    })
      .then((response) => {
        resolve(normalizeGetDBConnectorApi(response));
      })
      .catch((error) => {
        reject(error);
      });
  });

export const getTablesListApi = (data) =>
  new Promise((resolve, reject) => {
    axiosPostUtils(GET_TABLES_LIST, data)
      .then((response) => {
        resolve(normalizeGetTableListApi(response));
      })
      .catch((error) => {
        reject(error);
      });
  });

export const getTableInfoApi = (data) =>
  new Promise((resolve, reject) => {
    axiosPostUtils(GET_TABLE_INFO, data)
      .then((response) => {
        resolve(normalizeGetTableInfoApi(response));
      })
      .catch((error) => {
        reject(error);
      });
  });

export const fetchDBDataApi = (data) =>
  new Promise((resolve, reject) => {
    axiosPostUtils(FETCH_DB_DATA, data)
      .then((response) => {
        resolve(normalizeFetchDBDataApi(response));
      })
      .catch((error) => {
        reject(error);
      });
  });

export const postDBConnectorQueryApi = (data) =>
  new Promise((resolve, reject) => {
    axiosPostUtils(DB_CONNECTOR_QUERY, data)
      .then((response) => {
        resolve(normalizePostDBConnectorQueryApi(response));
      })
      .catch((error) => {
        reject(error);
      });
  });

export const getDBConnectorQueryApi = (params, setCancelToken) =>
  new Promise((resolve, reject) => {
    axiosGetUtils(DB_CONNECTOR_QUERY, {
      params,
      cancelToken: new CancelToken((c) => {
        setCancelToken?.(c);
      }),
    })
      .then((response) => {
        resolve(normalizeGetDBConnectorQueryApi(response));
      })
      .catch((error) => {
        reject(error);
      });
  });

export const publishDBConnectorQueryApi = (data) =>
  new Promise((resolve, reject) => {
    axiosPostUtils(PUBLISH_DB_CONNECTOR_QUERY, data)
      .then((response) => {
        resolve(normalizePublishDBConnectorQueryApi(response));
      })
      .catch((error) => {
        reject(error);
      });
  });

export const deleteDBConnectorQueryApi = (data) =>
  new Promise((resolve, reject) => {
    axiosPostUtils(DELETE_DB_CONNECTOR_QUERY, data)
      .then((response) => {
        resolve(normalizeDeleteDBConnectorQueryApi(response));
      })
      .catch((error) => {
        reject(error);
      });
  });

export const getDBConnectorSupportedOptionsApi = (params, setCancelToken) =>
  new Promise((resolve, reject) => {
    axiosGetUtils(GET_DB_CONNECTOR_SUPPORTED_OPTIONS, {
      params,
      cancelToken: new CancelToken((c) => {
        setCancelToken?.(c);
      }),
    })
      .then((response) => {
        resolve(normalizeGetDBConnectorSupportedOptionsApi(response));
      })
      .catch((error) => {
        reject(error);
      });
  });

export default postIntegrationConnectorApi;
