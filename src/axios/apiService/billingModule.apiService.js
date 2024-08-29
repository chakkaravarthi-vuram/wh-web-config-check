import axios from 'axios';
import { axiosGetUtils, axiosPostUtils } from '../AxiosHelper';
import {
  normalizeAllPaymentUsers,
  normalizeAllUpdatedPaymentData,
  normalizeSubscriptionData,
  normalizeInvoiceListData,
  normalizeGetAllSubList,
  normalizeGetTrialDetails,
  normalizeAccountSettingConfig,
  normalizeSavePaymentProfile,
  normalizeGetCountryTax,
  normalizeVerifyPayment,
  normalizePaymentUrlData,
} from '../apiNormalizer/billingModule.apiNormalizer';
import {
  EDIT_PAYMENT_DATA,
  GET_PAYMENT_USERS_BY_ID,
  UPDATE_PAYMENT_PROFILE,
  SAVE_OR_UPDATE_PAYMENT_METHOD,
  GET_ALL_INVOICES,
  SUBSRIPTION_BILLING,
  GET_ALL_SUBSCRIPTION,
  GET_ALL_TRIAL_DETAILS,
  ACCOUNT_CONFIGURATION,
  SAVE_PAYMENT_PROFILE,
  GET_COUNTRY_TAX_LIST,
  VERIFY_PAYMENT_METHOD,
  CHECK_PAYMENT_STATUS,
  GET_PAYMENT_URL,
} from '../../urls/ApiUrls';

const { CancelToken } = axios;
let cancelForUpdatePaymentData;
let cancelTokenEditUserProfile;
let cancelTokenSaveOrEditPaymentMethod;
let cancelTokenGetInvoiceList;
let cancelSubscription;
let cancelAllSubscriptionList;
let cancelAllTrialDetails;
let cancelAccountSettingConfig;
let cancelSavePaymentProfile;
let cancelVerifyPayment;

export const getPaymentUsersFromApi = () =>
   new Promise((resolve, reject) => {
    axiosGetUtils(GET_PAYMENT_USERS_BY_ID, {
      // cancelToken: new CancelToken((c) => {
      //   cancelTokenForGetPaymentuser = c;
      // }),
    })
    .then((response) => {
      resolve(normalizeAllPaymentUsers(response));
    })
    .catch((error) => {
      reject(error);
    });
  });
export const getSubscriptionDetailsFromApi = (params) => {
  if (cancelSubscription) cancelSubscription();
  return new Promise((resolve, reject) => {
    axiosGetUtils(SUBSRIPTION_BILLING, {
      params,
      cancelToken: new CancelToken((c) => {
        cancelSubscription = c;
      }),
    })
      .then((response) => {
        resolve(normalizeSubscriptionData(response));
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const updatePaymentData = (data) => {
  if (cancelForUpdatePaymentData) cancelForUpdatePaymentData();
  return new Promise((resolve, reject) => {
    axiosPostUtils(EDIT_PAYMENT_DATA, data, {
      cancelToken: new CancelToken((c) => {
        cancelForUpdatePaymentData = c;
      }),
    })
      .then((response) => {
        resolve(normalizeAllPaymentUsers(response));
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const updatePaymentProfile = (data) => {
  if (cancelTokenEditUserProfile) cancelTokenEditUserProfile();
  return new Promise((resolve, reject) => {
    axiosPostUtils(UPDATE_PAYMENT_PROFILE, data, {
      cancelToken: new CancelToken((c) => {
        cancelTokenEditUserProfile = c;
      }),
    })
      .then((response) => {
        resolve(normalizeAllUpdatedPaymentData(response));
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const saveOrUpdatePaymentMethodApi = (data) => {
  if (cancelTokenSaveOrEditPaymentMethod) cancelTokenSaveOrEditPaymentMethod();
  return new Promise((resolve, reject) => {
    axiosPostUtils(SAVE_OR_UPDATE_PAYMENT_METHOD, data, {
      cancelToken: new CancelToken((c) => {
        cancelTokenSaveOrEditPaymentMethod = c;
      }),
    })
      .then((response) => {
        resolve(normalizeAllUpdatedPaymentData(response));
      })
      .catch((error) => {
        reject(error);
      });
  });
};
export const getInvoiceList = (params) => {
  if (cancelTokenGetInvoiceList)cancelTokenGetInvoiceList();
  return new Promise((resolve, reject) => {
    axiosGetUtils(GET_ALL_INVOICES, { params,
      cancelToken: new CancelToken((c) => {
      cancelTokenGetInvoiceList = c;
    }) }).then((response) => {
    resolve(normalizeInvoiceListData(response));
    }).catch((error) => {
      reject(error);
    });
  });
};

export const getAllSubscriptionList = (params) => {
  if (cancelAllSubscriptionList) cancelAllSubscriptionList();
  return new Promise((resolve, reject) => {
    axiosGetUtils(GET_ALL_SUBSCRIPTION, { params,
      cancelToken: new CancelToken((c) => {
        cancelAllSubscriptionList = c;
    }) }).then((response) => {
    resolve(normalizeGetAllSubList(response));
    }).catch((error) => {
      reject(error);
    });
  });
};

export const getAllTrialDetails = (data) => new Promise((resolve, reject) => {
  if (cancelAllTrialDetails) cancelAllTrialDetails();
  axiosGetUtils(GET_ALL_TRIAL_DETAILS, data, {
    cancelToken: new CancelToken((c) => {
      cancelAllTrialDetails = c;
    }),
  })
    .then((response) => {
      resolve(normalizeGetTrialDetails(response));
    })
    .catch((error) => {
      reject(error);
    });
});

export const accountSettingConfigCall = (data) => new Promise((resolve, reject) => {
  if (cancelAccountSettingConfig) cancelAccountSettingConfig();
  axiosPostUtils(ACCOUNT_CONFIGURATION, data, {
    cancelToken: new CancelToken((c) => {
      cancelAccountSettingConfig = c;
    }),
  })
  .then((response) => {
    resolve(response);
    resolve(normalizeAccountSettingConfig(response));
  })
  .catch((error) => {
    reject(error);
  });
});

export const savePaymentProfileApi = (data) => new Promise((resolve, reject) => {
  if (cancelSavePaymentProfile) cancelSavePaymentProfile();
    axiosPostUtils(SAVE_PAYMENT_PROFILE, data, {
      cancelToken: new CancelToken((c) => {
        cancelSavePaymentProfile = c;
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then((response) => {
      resolve(normalizeSavePaymentProfile(response));
    })
    .catch((error) => {
      reject(error);
    });
  });

  export const getCountryWithTaxDetails = (data) => new Promise((resolve, reject) => {
    if (cancelAllTrialDetails) cancelAllTrialDetails();
    axiosGetUtils(GET_COUNTRY_TAX_LIST, data, {
      cancelToken: new CancelToken((c) => {
        cancelAllTrialDetails = c;
      }),
    })
      .then((response) => {
        resolve(normalizeGetCountryTax(response));
      })
      .catch((error) => {
        reject(error);
      });
  });

  export const VerifyPaymentMethod = (data) => new Promise((resolve, reject) => {
    if (cancelVerifyPayment) cancelVerifyPayment();
    axiosPostUtils(VERIFY_PAYMENT_METHOD, data, {
      cancelToken: new CancelToken((c) => {
        cancelVerifyPayment = c;
      }),
    })
    .then((response) => {
      resolve(normalizeVerifyPayment(response));
    })
    .catch((error) => {
      reject(error);
    });
  });

  export const getPaymentStatusCheck = (params) => {
    if (cancelAllTrialDetails) cancelAllTrialDetails();
    return new Promise((resolve, reject) => {
      axiosGetUtils(CHECK_PAYMENT_STATUS, {
        params,
        cancelToken: new CancelToken((c) => {
          cancelAllTrialDetails = c;
        }),
      })
        .then((response) => {
          resolve(normalizeSubscriptionData(response));
        })
        .catch((error) => {
          reject(error);
        });
    });
  };

  export const getPaymentUrlData = (params) => {
    if (cancelAllTrialDetails) cancelAllTrialDetails();
    return new Promise((resolve, reject) => {
      axiosGetUtils(GET_PAYMENT_URL, {
        params,
        cancelToken: new CancelToken((c) => {
          cancelAllTrialDetails = c;
        }),
      })
        .then((response) => {
          resolve(normalizePaymentUrlData(response));
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
