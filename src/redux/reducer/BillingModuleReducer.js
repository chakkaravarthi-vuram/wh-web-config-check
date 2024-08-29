import { createAction, createReducer } from '@reduxjs/toolkit';
import { BILLING_MODULE } from 'redux/actions/ActionConstants';
import { EMPTY_STRING } from '../../utils/strings/CommonStrings';

const initialState = {
  paymentAPIDetails: {},
  paymentCustomizedDetails: {},
  editType: EMPTY_STRING,
  isPaymentUserDataLoading: true,
  common_server_error: null,
  member_team_search_value: EMPTY_STRING,
  selectedUserData: [],
  isSubscriptionDataLoading: true,
  SubscriptionApiDetails: {},
  SubscriptionCustomizedDetails: {},
  isSubscriptionApiDetailsLoading: true,
  isPaymentMethodDataLoading: true,
  isPaymentProfileDataLoading: true,
  payment_profile_errorlist: {},
  addMemberData: [],
  addUserBillingError: {},
  cancelModalOpenStatus: false,
  invoiceCurrentPage: 1,
  invoiceTotalCount: '',
  invoiceDataLoading: true,
  getAllSUbsLoading: false,
  setPaymentProfile: {
    country: EMPTY_STRING,
    line1: EMPTY_STRING,
    line2: EMPTY_STRING,
    city: EMPTY_STRING,
    postal_code: EMPTY_STRING,
    state: EMPTY_STRING,
    billing_language: EMPTY_STRING,
    timezone: EMPTY_STRING,
    tax_status: EMPTY_STRING,
    type: EMPTY_STRING,
    id: EMPTY_STRING,
    email: EMPTY_STRING,
    error_list: {},
    country_tax_list: [],
    tax_number_type_list: [],
    current_subscription_number: EMPTY_STRING,
    currency_list: [],
    cost_details_id: EMPTY_STRING,
    billing_currency: EMPTY_STRING,
    payment_status: false,
    payment_status_loading: true,
    payment_method_status_id: EMPTY_STRING,
    tax_number_placeholder: EMPTY_STRING,
  },
  is_profile_completed: false,
  currentPayScreen: 1,
  setPaymentMethod: {
    cardType: EMPTY_STRING,
    cardNumber: EMPTY_STRING,
    expiryYear: EMPTY_STRING,
    expiryMonth: EMPTY_STRING,
    cardNickName: EMPTY_STRING,
    cardHolderName: EMPTY_STRING,
    line1: EMPTY_STRING,
    line2: EMPTY_STRING,
    postal_code: EMPTY_STRING,
    city: EMPTY_STRING,
    country: EMPTY_STRING,
    state: EMPTY_STRING,
    setPaymentProfileErrorList: {},
    Cvc: EMPTY_STRING,
    isDefault: false,
    is_direct_payment_method: false,
    expiryMonthYear: EMPTY_STRING,
  },
  PaymentRedirectShow: false,
};

export const changeBillingEditType = createAction(
  BILLING_MODULE.EDIT_CHANGE,
  (edit_type) => {
    return {
      payload: edit_type,
    };
  },
);
export const BillingApicallSucess = createAction(BILLING_MODULE.APICALL_SUCESS);

export const getPaymentDataStarted = createAction(
  BILLING_MODULE.PAYMENT_DATA_STARTED,
);
export const getSubscriptionDataStarted = createAction(
  BILLING_MODULE.SUBSCRIPTION_DATA_STARTED,
);

export const getPaymentDataSuccess = createAction(
  BILLING_MODULE.PAYMENT_DATA_SUCCESS,
  (response) => {
    return {
      payload: response,
    };
  },
);
export const getUpdatedPaymentDataSuccess = createAction(
  BILLING_MODULE.UPDATED_PAYMENT_DATA_SUCCESS,
  (response) => {
    return {
      payload: response,
    };
  },
);
export const getUpdatedPaymentDataFailure = createAction(
  BILLING_MODULE.UPDATED_PAYMENT_DATA_FAILURE,
  (error) => {
    return {
      payload: error,
    };
  },
);
export const getPaymentDataFailure = createAction(
  BILLING_MODULE.PAYMENT_DATA_FAILURE,
  (error) => {
    return {
      payload: error,
    };
  },
);
export const getSubscriptionDataSucess = createAction(
  BILLING_MODULE.SUBSCRIPTION_DATA_SUCESS,
  (SubscriptionData) => {
    return {
      payload: SubscriptionData,
    };
  },
);
export const getSubscriptionDataFailer = createAction(
  BILLING_MODULE.SUBSCRIPTION_DATA_FAILER,
  (error) => {
    return {
      payload: error,
    };
  },
);
export const setSubscriptionCustomizedDetails = createAction(
  BILLING_MODULE.CUSTOMIZED_SUBSCRIPTION_DATA,
  (data) => {
    return { payload: data };
  },
);
export const setStateyou = createAction(BILLING_MODULE.SET_STATE, (data) => {
  return {
    payload: data,
  };
});

export const setPaymentCustomizedDetails = createAction(
  BILLING_MODULE.CUSTOMIZED_PAYMENT_DATA,
  (customizedDetails) => {
    return {
      payload: customizedDetails,
    };
  },
);

export const setMemberTeamSearchValue = createAction(
  BILLING_MODULE.MEMBER_SEARCH_VALUE,
  (searchValue) => {
    return {
      payload: searchValue,
    };
  },
);

export const setSelectedUserData = createAction(
  BILLING_MODULE.SELECTED_USER_DATA,
  (userData) => {
    return {
      payload: userData,
    };
  },
);
export const setAddMemberData = createAction(
  BILLING_MODULE.ADD_MEMBER_DATA,
  (userData) => {
    return {
      payload: userData,
    };
  },
);

export const setPaymentState = createAction(
  BILLING_MODULE.SET_PAYMENT_DETAILS,
  (setData) => {
    return {
      payload: setData,
    };
  },
);

export const setPaymentSpecificData = createAction(
  BILLING_MODULE.SET_PAYMENT_SPECIFIC_DATA,
  (setData) => {
    return {
      payload: setData,
    };
  },
);

export const getPaymentDataLoadingStatus = createAction(
  BILLING_MODULE.SET_BILLING_LOADING_STATUS,
  (response) => {
    return {
      payload: response,
    };
  },
);
export const updateInvoiceData = createAction(BILLING_MODULE.UPDATE_INVOICE_DATA, (response) => {
  return {
    payload: response,
  };
});
export const billingModulePageChangeAction = createAction(BILLING_MODULE.BILLING_MODULE_PAGE_CHANGE, (data) => {
  return {
    payload: data,
  };
});
export const setPaymentProfileState = createAction(
  BILLING_MODULE.SAVE_PAYMENT_SETSTATE,
  (response) => {
    return {
      payload: response,
    };
  },
);
export const ChangePayScreen = createAction(
  BILLING_MODULE.CHANGE_PAYMENT_SCREEN,
  (setData) => {
    return {
      payload: setData,
    };
  },
);
export const setPaymentMethodStateChange = createAction(BILLING_MODULE.SET_PAYMENT_METHOD_STATE_CHANGE, (data) => {
  return {
    payload: data,
  };
});
export const setPaymentRedirectShow = createAction(BILLING_MODULE.SET_PAYMENT_REDIRECT_SCREEN, (data) => {
  return {
    payload: data,
  };
});
export const clearPayProfileData = createAction(BILLING_MODULE.CLEAR_SET_PAYPROFILE);
export const getAllInvoieApiStarted = createAction(BILLING_MODULE.GET_ALL_INVOICE_STARTED);
export const getAllSubscriptionListApiStarted = createAction(BILLING_MODULE.GET_ALL_SUBSCRIPTION_LIST);
const BillingModuleReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(changeBillingEditType, (state, action) => {
      return {
        ...state,
        editType: action.payload,
      };
    })
    .addCase(getPaymentDataStarted, (state) => {
      return {
        ...state,
        isPaymentUserDataLoading: true,
      };
    })
    .addCase(getSubscriptionDataStarted, (state) => {
      return {
        ...state,
        isSubscriptionDataLoading: true,
      };
    })
    .addCase(getPaymentDataSuccess, (state, action) => {
      return {
        ...state,
        paymentAPIDetails: { ...state.paymentAPIDetails, ...action.payload },
        common_server_error: null,
        editType: EMPTY_STRING,
        isPaymentMethodDataLoading: false,
        isPaymentProfileDataLoading: false,
        isPaymentUserDataLoading: false,
      };
    })
    .addCase(getPaymentDataFailure, (state, action) => {
      return {
        ...state,
        common_server_error: action.payload.common_server_error,
        server_error: action.payload.common_server_error,
        editType: EMPTY_STRING,
        isPaymentUserDataLoading: false,
        isSubscriptionApiDetailsLoading: false,
        isPaymentMethodDataLoading: false,
        isPaymentProfileDataLoading: false,
        invoiceDataLoading: false,
      };
    })
    .addCase(getUpdatedPaymentDataSuccess, (state, action) => {
      return {
        ...state,
        paymentAPIDetails: { ...state.paymentAPIDetails, ...action.payload },
        common_server_error: null,
        isPaymentUserDataLoading: false,
      };
    })
    .addCase(getUpdatedPaymentDataFailure, (state, action) => {
      return {
        ...state,
        common_server_error: action.payload.common_server_error,
        server_error: action.payload.common_server_error,
        isPaymentUserDataLoading: false,
      };
    })
    .addCase(getSubscriptionDataSucess, (state, action) => {
      return {
        ...state,
        subscriptionApiDetais: action.payload,
        common_server_error: null,
        isSubscriptionApiDetailsLoading: false,
        isPaymentUserDataLoading: false,
        isPaymentMethodDataLoading: false,
        isPaymentProfileDataLoading: false,
      };
    })
    .addCase(getSubscriptionDataFailer, (state, action) => {
      return {
        ...state,
        common_server_error: action.payload.common_server_error,
        server_error: action.payload.common_server_error,
        isSubscriptionDataLoading: false,
      };
    })
    .addCase(setSubscriptionCustomizedDetails, (state, action) => {
      return {
        ...state,
        isSubscriptionDataLoading: false,
        SubscriptionCustomizedDetails: action.payload,
      };
    })
    .addCase(setPaymentCustomizedDetails, (state, action) => {
      return {
        ...state,
        isPaymentDataLoading: false,
        invoiceDataLoading: false,
        paymentCustomizedDetails: action.payload,
      };
    })
    .addCase(BillingApicallSucess, (state) => {
      return {
        ...state,
        is_data_loading: false,
      };
    })
    .addCase(setMemberTeamSearchValue, (state, action) => {
      return {
        ...state,
        member_team_search_value: action.payload,
      };
    })
    .addCase(setSelectedUserData, (state, action) => {
      return {
        ...state,
        selectedUserData: action.payload,
      };
    })
    .addCase(setPaymentState, (state, action) => {
      return {
        ...state,
        ...action.payload,
      };
    })
    .addCase(setAddMemberData, (state, action) => {
      return {
        ...state,
        addMemberData: action.payload,
      };
    })
    .addCase(setPaymentSpecificData, (state, action) => {
      return {
        ...state,
        paymentAPIDetails: {
          ...state.paymentAPIDetails,
          ...action.payload,
        },
        editType: EMPTY_STRING,
        isPaymentUserDataLoading: false,
      };
    })
    .addCase(getPaymentDataLoadingStatus, (state, action) => {
      return {
        ...state,
        ...action.payload,
      };
    })
    .addCase(updateInvoiceData, (state, action) => {
        state.paymentCustomizedDetails.paymentUsersIvoiceCustomData = action.payload.invoiceList;
        state.invoiceTotalCount = action.payload.invoiceTotalCount;
        state.paymentAPIDetails.invoice_details = action.payload.apiInvoiceData;
        state.invoiceDataLoading = false;
    })
    .addCase(billingModulePageChangeAction, (state, action) => {
        state.invoiceCurrentPage = action.payload;
    })
    .addCase(getAllInvoieApiStarted, (state) => {
      state.invoiceDataLoading = true;
    })
    .addCase(getAllSubscriptionListApiStarted, (state) => {
      state.getAllSUbsLoading = true;
    })
    .addCase(setPaymentProfileState, (state, action) => {
      return {
        ...state,
        setPaymentProfile: { ...state.setPaymentProfile, ...action.payload },
      };
    })
    .addCase(ChangePayScreen, (state, action) => {
      return {
        ...state,
        currentPayScreen: action.payload,
      };
    })
    .addCase(setPaymentMethodStateChange, (state, action) => {
      const { setPaymentMethod } = state;
      state.setPaymentMethod = { ...setPaymentMethod, ...action.payload };
    })
    .addCase(setPaymentRedirectShow, (state, action) => {
      return {
        ...state,
        PaymentRedirectShow: action.payload,
      };
    })
    .addCase(clearPayProfileData, (state) => {
      return {
        ...state,
        setPaymentMethod: initialState.setPaymentMethod,
        setPaymentProfile: initialState.setPaymentProfile,
       };
    });
});

export default BillingModuleReducer;
