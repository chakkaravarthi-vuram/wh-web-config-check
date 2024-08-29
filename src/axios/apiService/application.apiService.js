import axios from 'axios';
import { APPLICATION, DELETE_APPLICATOIN, DELETE_PAGE, DISCARD_APPLICATION, PAGES, PUBLISH_APPLICATION } from 'urls/ApiUrls';
import {
  normalizeDeleteApp,
  normalizeDeletePage,
  normalizeDiscardApp,
  normalizeGetAllApps,
  normalizeGetAppData,
  normalizePublishApp,
  normalizeSaveApp,
  normalizeSavePage,
  normalizeUpdateAppSecurity,
  normalizeUpdateAppHeader,
 } from 'axios/apiNormalizer/application.apiNormalizer';
import { axiosGetUtils, axiosPostUtils } from '../AxiosHelper';
import { GET_ALL_USERS_OR_TEAMS, GET_COMPONENTS, GET_USERS, SAVE_APPLICATION, SAVE_COMPONENT, SAVE_COORDINATES, UPDATE_APP_SECURITY, DELETE_COMPONENT, VALIDATE_APP, UPDATE_PAGE_ORDER, SORTED_VIEW_FLOW, GET_PAGES_NORMAL, GET_COMPONENTS_NORMAL, GET_APPLICATION_DATA_NORMAL, GET_LATEST_APP_VERSION, UPDATE_APP_HEADER, UPDATE_APP_ORDER, POST_VERIFY_WEBPAGE_EMBEDDING_URL } from '../../urls/ApiUrls';
import { getCancelTokenGetPages } from '../../containers/application/app_builder/app_builder_tab/AppBuilderTab';
import { normalizeGetPages, normalizeSaveCoordinates, normalizeGetComponentById, normalizeSaveComponent, normalizeValidateApp, normalizeUpdatePageOrder, normalizeGetAllAppsForRoute, validateGetAppCurrentVersionData, normalizeVerifyWebpageEmbedUrlApi } from '../apiNormalizer/application.apiNormalizer';

const { CancelToken } = axios;

export const getAllApps = (params, cancelToken) => {
  if (cancelToken?.cancelToken) cancelToken.cancelToken();
  return new Promise((resolve, reject) => {
    axiosGetUtils(
      SAVE_APPLICATION,
      { params,
        cancelToken: new CancelToken((c) => {
           cancelToken.setCancelToken(c);
        }),
      },
    )
      .then((response) => {
        resolve(normalizeGetAllApps(response, params.type));
      })
      .catch((error) => {
        reject(error);
      });
});
};
export const getAllAppsForRoute = (params) =>
  new Promise((resolve, reject) => {
    axiosGetUtils(GET_APPLICATION_DATA_NORMAL, { params })
      .then((response) => {
        resolve(normalizeGetAllAppsForRoute(response));
      })
      .catch((error) => {
        reject(error);
      });
  });

export const getUsers = (params, setCancelToken) =>
  new Promise((resolve, reject) => {
    axiosGetUtils(GET_USERS, {
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

export const getAppData = (params) =>
  new Promise((resolve, reject) => {
    axiosGetUtils(APPLICATION, {
      params,
    })
      .then((response) => {
        resolve(normalizeGetAppData(response));
      })
      .catch((error) => {
        reject(error);
      });
});

export const getAppCurrentVersion = (params) =>
  new Promise((resolve, reject) => {
    axiosGetUtils(GET_LATEST_APP_VERSION, {
      params,
    })
    .then((response) => {
      resolve(validateGetAppCurrentVersionData(response));
    })
    .catch((error) => {
      reject(error);
    });
});

export const saveApp = (params) =>
  new Promise((resolve, reject) => {
    axiosPostUtils(SAVE_APPLICATION, params)
      .then((response) => {
        resolve(normalizeSaveApp(response));
      })
      .catch((error) => {
        reject(error);
      });
});

export const deleteApp = (params) =>
  new Promise((resolve, reject) => {
    axiosPostUtils(DELETE_APPLICATOIN, params)
      .then((response) => {
        resolve(normalizeDeleteApp(response));
      })
      .catch((error) => {
        reject(error);
      });
});

export const discardApp = (params) =>
  new Promise((resolve, reject) => {
    axiosPostUtils(DISCARD_APPLICATION, params)
      .then((response) => {
        resolve(normalizeDiscardApp(response));
      })
      .catch((error) => {
        reject(error);
      });
});

export const publishApp = (params) =>
  new Promise((resolve, reject) => {
    axiosPostUtils(PUBLISH_APPLICATION, params)
      .then((response) => {
        resolve(normalizePublishApp(response));
      })
      .catch((error) => {
        reject(error);
      });
});

export const savePage = (params) =>
  new Promise((resolve, reject) => {
    axiosPostUtils(PAGES, params)
      .then((response) => {
        resolve(normalizeSavePage(response));
      })
      .catch((error) => {
        reject(error);
      });
});

export const deletePage = (params) =>
  new Promise((resolve, reject) => {
    axiosPostUtils(DELETE_PAGE, params)
      .then((response) => {
        resolve(normalizeDeletePage(response));
      })
      .catch((error) => {
        reject(error);
      });
});

export const updateAppSecurity = (params) =>
  new Promise((resolve, reject) => {
    axiosPostUtils(UPDATE_APP_SECURITY, params)
      .then((response) => {
        console.log('updtae app security failed', response);
        resolve(normalizeUpdateAppSecurity(response));
      })
      .catch((error) => {
        reject(error);
      });
});
export const getAppPagesApi = (params, isBasicUser) =>
  new Promise((resolve, reject) => {
    axiosGetUtils(isBasicUser ? GET_PAGES_NORMAL : PAGES,
      { params,
      },
    )
    .then((response) => {
      resolve(normalizeGetPages(response));
    })
    .catch((error) => {
      reject(error);
    });
  });

export const saveCoordinateAPI = (params) =>
  new Promise((resolve, reject) => {
    axiosPostUtils(SAVE_COORDINATES, params)
    .then((response) => {
      resolve(normalizeSaveCoordinates(response));
    })
    .catch((error) => {
      reject(error);
    });
});

export const geComponentsApi = (params, isBasicUser) =>
  new Promise((resolve, reject) => {
    axiosGetUtils(isBasicUser ? GET_COMPONENTS_NORMAL : GET_COMPONENTS,
      { params,
        cancelToken: new CancelToken((c) => {
          getCancelTokenGetPages(c);
        }),
      },
    )
    .then((response) => {
      resolve(normalizeGetPages(response));
    })
    .catch((error) => {
      reject(error);
    });
  });

export const saveComponent = (params) =>
  new Promise((resolve, reject) => {
    axiosPostUtils(SAVE_COMPONENT, params)
      .then((response) => {
        resolve(normalizeSaveComponent(response));
      })
      .catch((error) => {
        reject(error);
      });
    });

export const getComponentById = (id) =>
  new Promise((resolve, reject) => {
    axiosGetUtils(
      `${GET_COMPONENTS_NORMAL}/${id}`,
    )
      .then((response) => {
        resolve(normalizeGetComponentById(response));
      })
      .catch((error) => {
        reject(error);
      });
});

export const deleteComponentApi = (params) =>
  new Promise((resolve, reject) => {
    axiosPostUtils(DELETE_COMPONENT, params)
      .then((response) => {
        resolve(normalizeDeletePage(response));
      })
      .catch((error) => {
        reject(error);
      });
});

export const validateAppApi = (params) =>
  new Promise((resolve, reject) => {
    axiosPostUtils(VALIDATE_APP, params)
      .then((response) => {
        resolve(normalizeValidateApp(response));
      })
      .catch((error) => {
        reject(error);
      });
});

export const udpateOrderApi = (params) =>
  new Promise((resolve, reject) => {
    axiosPostUtils(UPDATE_PAGE_ORDER, params)
      .then((response) => {
        resolve(normalizeUpdatePageOrder(response));
      })
      .catch((error) => {
        reject(error);
      });
});

export const getSortedViewFlowApi = (params) =>
  new Promise((resolve, reject) => {
    axiosGetUtils(SORTED_VIEW_FLOW,
      { params,
        cancelToken: new CancelToken((c) => {
          getCancelTokenGetPages(c);
        }),
      },
    )
    .then((response) => {
      resolve(normalizeGetPages(response));
    })
    .catch((error) => {
      reject(error);
    });
  });

export const postVerifyWebpageEmbedUrlApi = (params) =>
  new Promise((resolve, reject) => {
    axiosPostUtils(POST_VERIFY_WEBPAGE_EMBEDDING_URL, params)
      .then((response) => {
        resolve(normalizeVerifyWebpageEmbedUrlApi(response));
      })
      .catch((error) => {
        reject(error);
      });
  });

export const updateAppHeaderApi = (params) =>
  new Promise((resolve, reject) => {
    axiosPostUtils(UPDATE_APP_HEADER, params)
      .then((response) => {
        resolve(normalizeUpdateAppHeader(response));
      })
      .catch((error) => {
        reject(error);
      });
  });

export const updateAppOrderApi = (params) =>
  new Promise((resolve, reject) => {
    axiosPostUtils(UPDATE_APP_ORDER, params)
      .then((response) => {
        resolve(normalizeUpdatePageOrder(response));
      })
      .catch((error) => {
        reject(error);
      });
});
