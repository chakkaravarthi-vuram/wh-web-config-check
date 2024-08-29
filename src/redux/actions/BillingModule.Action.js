import {
  getPaymentUsersFromApi,
  updatePaymentData,
  getSubscriptionDetailsFromApi,
  getInvoiceList,
  getAllSubscriptionList,
  accountSettingConfigCall,
  savePaymentProfileApi,
  getCountryWithTaxDetails,
  VerifyPaymentMethod,
  getPaymentUrlData,
} from 'axios/apiService/billingModule.apiService';
import {
  getPaymentUsers,
  constructCustmizeSubscriptionData,
  getpaymentUsersIvoiceCustomData,
  getDropdownCountryDetails,
} from 'containers/billing_module/BillingModule.utils';
import {
  getPaymentDataStarted,
  getPaymentDataSuccess,
  getPaymentDataFailure,
  setPaymentCustomizedDetails,
  getSubscriptionDataSucess,
  getSubscriptionDataFailer,
  setSubscriptionCustomizedDetails,
  getSubscriptionDataStarted,
  setPaymentState,
  setPaymentSpecificData,
  getPaymentDataLoadingStatus,
  updateInvoiceData,
  getAllInvoieApiStarted,
  getAllSubscriptionListApiStarted,
  setPaymentProfileState,
  setPaymentMethodStateChange,
  ChangePayScreen,
  setPaymentRedirectShow,
} from 'redux/reducer/BillingModuleReducer';
import { EMPTY_STRING } from 'utils/strings/CommonStrings';
import { accountSettingFailure, accountSettingStarted, accountSettingStateChange } from 'redux/reducer/AccountConfigSetReducer';
import { CURRENT_PAY_SCREEN } from 'containers/billing_module/BillingModule.string';
import { HOME } from 'urls/RouteConstants';
import jsUtils from 'utils/jsUtility';
import { translate } from 'language/config';
import { generateGetServerErrorMessage } from '../../server_validations/ServerValidation';
import { FORM_POPOVER_STATUS, ROUTE_METHOD } from '../../utils/Constants';
import { routeNavigate, showToastPopover } from '../../utils/UtilityFunctions';
import { updatePaymentProfile, saveOrUpdatePaymentMethodApi, getPaymentStatusCheck } from '../../axios/apiService/billingModule.apiService';
import { store } from '../../Store';

export const paymentDataThunk = (t) => (dispatch) => new Promise((resolve) => {
   dispatch(getAllInvoieApiStarted());
    getPaymentUsersFromApi()
      .then((response) => {
        if (response) {
          dispatch(getPaymentDataSuccess(response));
          dispatch(setPaymentCustomizedDetails(getPaymentUsers(response, t)));
          resolve();
        } else {
          const err = {
            response: {
              status: 500,
            },
          };
          const errors = generateGetServerErrorMessage(err);
          dispatch(getPaymentDataFailure(errors));
        }
      });
      // .catch((error) => {
      //   reject();
      //   const errors = generateGetServerErrorMessage(error);
      //   dispatch(
      //     getPaymentDataFailure({
      //        common_server_error: errors.common_server_error,
      //     }),
      //   );
      // });
  });
export const getSubscriptionDataThunk = (t) => (dispatch) => {
  dispatch(getSubscriptionDataStarted());
  const { paymentAPIDetails } = store.getState().BillingModuleReducer;
  const params = { account_id: paymentAPIDetails.account_id };
  getSubscriptionDetailsFromApi(params)
    .then((response) => {
      if (response) {
        dispatch(getSubscriptionDataSucess(response));
        dispatch(
          setSubscriptionCustomizedDetails(
            constructCustmizeSubscriptionData(response, t),
          ),
        );
      } else {
        const err = {
          response: {
            status: 500,
          },
        };
        const errors = generateGetServerErrorMessage(err);
        dispatch(getSubscriptionDataFailer(errors));
      }
    })
    .catch((error) => {
      const errors = generateGetServerErrorMessage(error);
      dispatch(
        getSubscriptionDataFailer({
          common_server_error: errors.common_server_error,
        }),
      );
    });
};
export const editpaymentDataThunk = (params, message, t) => (dispatch) => {
  const { paymentAPIDetails } = store.getState().BillingModuleReducer;
  dispatch(getPaymentDataStarted());
  updatePaymentData(params)
    .then((response) => {
      if (response) {
        console.log('fvadsgsdagasdg', response.billing_owners);
        dispatch(setPaymentSpecificData({ billing_owners: response.billing_owners }));
        dispatch(setPaymentCustomizedDetails(getPaymentUsers({ ...paymentAPIDetails, billing_owners: response.billing_owners }, t)));
        showToastPopover(
          `${translate('error_popover_status.payment_users')} ${message} ${translate('error_popover_status.successful')} `,
          EMPTY_STRING,
          FORM_POPOVER_STATUS.SUCCESS,
          true,
        );
      } else {
        const err = {
          response: {
            status: 500,
          },
        };
        const errors = generateGetServerErrorMessage(err);
        dispatch(getPaymentDataFailure(errors));
        showToastPopover(
          translate('error_popover_status.network_error'),
          EMPTY_STRING,
          FORM_POPOVER_STATUS.SERVER_ERROR,
          true,
        );
       }
    });
};

export const updatePaymentProfileThunk = (params, t, redirectToNext, notShowPopup = false) => (dispatch) => {
  const data = {
    ...params,
  };
  dispatch(getPaymentDataLoadingStatus({ isPaymentProfileDataLoading: true }));
  updatePaymentProfile(data)
  .then((response) => {
    if (response) {
      const { paymentAPIDetails } = store.getState().BillingModuleReducer;
      dispatch(setPaymentSpecificData({ ...response, payment_methods: paymentAPIDetails.payment_methods, billing_owners: paymentAPIDetails.billing_owners }));
      dispatch(setPaymentCustomizedDetails(getPaymentUsers({ ...response, invoice_details: paymentAPIDetails.invoice_details, payment_methods: paymentAPIDetails.payment_methods, billing_owners: paymentAPIDetails.billing_owners }, t)));
      dispatch(getPaymentDataLoadingStatus({ isPaymentProfileDataLoading: false }));
        dispatch(setPaymentState({ editType: EMPTY_STRING }));
        jsUtils.has(response, 'is_profile_complete') && dispatch(setPaymentState({ is_profile_completed: true }));
        if (!notShowPopup) {
          showToastPopover(
            translate('error_popover_status.payment_profile_saved'),
            EMPTY_STRING,
            FORM_POPOVER_STATUS.SUCCESS,
            true,
          );
        }
        if (redirectToNext) {
          dispatch(setPaymentRedirectShow(true));
        }
      // }, 500);
    } else {
      const err = {
        response: {
          status: 500,
        },
      };
      const errors = generateGetServerErrorMessage(err);
      dispatch(getPaymentDataLoadingStatus({ isPaymentProfileDataLoading: false }));
      console.log(errors);
      showToastPopover(
        translate('error_popover_status.somthing_went_wrong_try_again'),
        EMPTY_STRING,
        FORM_POPOVER_STATUS.SERVER_ERROR,
        true,
      );
    }
  });
};

export const verifyPaymentMethodCall = (params) => {
  VerifyPaymentMethod(params)
  .then((response) => {
    if (response) {
      window.location = response;
    } else {
      const err = {
        response: {
          status: 500,
        },
      };
      const errors = generateGetServerErrorMessage(err);
      // dispatch(accountSettingFailure(errors));
      console.log(errors);
      showToastPopover(
        translate('error_popover_status.somthing_went_wrong_try_again'),
        EMPTY_STRING,
        FORM_POPOVER_STATUS.SERVER_ERROR,
        true,
      );
    }
  });
};

export const saveOrUpdatePaymentMethodProfileThunk = (params) => (dispatch) => {
 const { paymentCustomizedDetails } = store.getState().BillingModuleReducer;
  const data = {
    // account_id: paymentAPIDetails.account_id,
    payment_methods: params,
  };
  dispatch(getPaymentDataLoadingStatus({ isPaymentMethodDataLoading: true }));
  saveOrUpdatePaymentMethodApi(data)
  .then((response) => {
    dispatch(getPaymentDataLoadingStatus({ isPaymentMethodDataLoading: false }));
    if (response) {
      const editedData = jsUtils.cloneDeep(paymentCustomizedDetails);
      editedData.paymentMethodDetails.DETAILS[3].VALUE = '***';
      dispatch(setPaymentCustomizedDetails(editedData));
      dispatch(setPaymentState({ editType: EMPTY_STRING }));

      window.location = response;
      showToastPopover(
        translate('error_popover_status.edit_payment_menthod'),
        EMPTY_STRING,
        FORM_POPOVER_STATUS.SUCCESS,
        true,
      );
    } else {
      const err = {
        response: {
          status: 500,
        },
      };
      const errors = generateGetServerErrorMessage(err);
      console.log(errors);
      dispatch(getPaymentDataLoadingStatus({ isPaymentMethodDataLoading: false }));
      showToastPopover(
        translate('error_popover_status.somthing_went_wrong_try_again'),
        EMPTY_STRING,
        FORM_POPOVER_STATUS.SERVER_ERROR,
        true,
      );
    }
  })
  .catch((error) => {
    dispatch(getPaymentDataLoadingStatus({ isPaymentMethodDataLoading: false }));
    if (
      error.response &&
      error.response.data &&
      error.response.data.errors[0].type &&
      error.response.data.errors[0].type.includes('exist')
    ) {
      showToastPopover(
        translate('error_popover_status.account_already_exist'),
        translate('error_popover_status.try_another_account'),
        FORM_POPOVER_STATUS.SERVER_ERROR,
        true,
      );
    } else if (error && error.response && error.response.data && error.response.data.errors[0].message) {
      showToastPopover(
        error.response.data.errors[0].message,
        translate('error_popover_status.recheck_card_details'),
        FORM_POPOVER_STATUS.SERVER_ERROR,
        true,
      );
    } else if (error && error.response && error.response.data && error.response.data.errors[0] && error.response.data.errors[0] instanceof String) {
      showToastPopover(
        error.response.data.errors[0],
        translate('error_popover_status.valid_details'),
        FORM_POPOVER_STATUS.SERVER_ERROR,
        true,
      );
    }
  });
};

export const setPaymentMethodProfileThunk = (params) => () => {
   saveOrUpdatePaymentMethodApi(params)
   .then((response) => {
     if (response) {
      console.log('response.payment_methods', response);
      // verifyPaymentMethodCall({ payment_method_id: response[0].payment_method_id });
      window.location = response;
     } else {
       const err = {
         response: {
           status: 500,
         },
       };
       const errors = generateGetServerErrorMessage(err);
       console.log(errors);
      showToastPopover(
        translate('error_popover_status.somthing_went_wrong_try_again'),
        EMPTY_STRING,
        FORM_POPOVER_STATUS.SERVER_ERROR,
        true,
      );
     }
   })
    .catch((error) => {
      if (
        error.response &&
        error.response.data &&
        error.response.data.errors[0].type &&
        error.response.data.errors[0].type.includes('exist')
      ) {
        showToastPopover(
          translate('error_popover_status.account_already_exist'),
          translate('error_popover_status.try_another_account'),
          FORM_POPOVER_STATUS.SERVER_ERROR,
          true,
        );
      } else if (error && error.response && error.response.data && error.response.data.errors[0].message === translate('error_popover_status.card_number_incorect')) {
          showToastPopover(
            translate('error_popover_status.card_number_incorect'),
            translate('error_popover_status.recheck_card_number'),
            FORM_POPOVER_STATUS.SERVER_ERROR,
            true,
          );
      } else if (error && error.response && error.response.data && error.response.data.errors[0] && error.response.data.errors[0] && error.response.data.errors[0].includes('Invalid value for')) {
        showToastPopover(
          translate('error_popover_status.incorrect_tax_number'),
          translate('error_popover_status.valid_tax_number'),
          FORM_POPOVER_STATUS.SERVER_ERROR,
          true,
        );
      }
    });
 };

export const getInvoiceListThunk = (data) => (dispatch) => {
  dispatch(getAllInvoieApiStarted());
  getInvoiceList(data).then((response) => {
    const apiInvoiceData = response.pagination_data;
        const invoiceList = getpaymentUsersIvoiceCustomData({ invoice_details: response.pagination_data });
   const paginationData = { invoiceTotalCount: response.pagination_details[0].total_count, invoiceList, apiInvoiceData };
   dispatch(updateInvoiceData(paginationData));
  //  dispatch(billingModulePageChangeAction(response.pagination_details.total_count));
  });
};

export const getAllSubscriptionListThunk = () => (dispatch) => {
  dispatch(getAllSubscriptionListApiStarted());
  getAllSubscriptionList()
  .then((response) => {
    if (response) {
      dispatch(setPaymentState({ subscription_list: response, getAllSUbsLoading: false }));
    } else {
      const err = {
        response: {
          status: 500,
        },
      };
      const errors = generateGetServerErrorMessage(err);
      console.log(errors);
      dispatch(setPaymentState({ getAllSUbsLoading: false }));
      showToastPopover(
        translate('error_popover_status.somthing_went_wrong_try_again'),
        EMPTY_STRING,
        FORM_POPOVER_STATUS.SERVER_ERROR,
        true,
      );
    }
  }).catch((error) => console.log('err', error));
};

export const accountSettingSaveThunk = (params) => (dispatch) => {
  dispatch(accountSettingStarted());
  accountSettingConfigCall(params)
  .then((response) => {
    if (response) {
      dispatch(accountSettingStateChange({ account_setting_open: false }));
      showToastPopover(
        translate('error_popover_status.company_settings'),
        EMPTY_STRING,
        FORM_POPOVER_STATUS.SUCCESS,
        true,
      );
    } else {
      const err = {
        response: {
          status: 500,
        },
      };
      const errors = generateGetServerErrorMessage(err);
      dispatch(accountSettingFailure(errors));
      console.log(errors);
      showToastPopover(
        translate('error_popover_status.somthing_went_wrong_try_again'),
        EMPTY_STRING,
        FORM_POPOVER_STATUS.SERVER_ERROR,
        true,
      );
    }
  });
};

export const savePaymentProfileThunk = (params) => (dispatch) => {
  savePaymentProfileApi(params)
  .then((response) => {
    if (response) {
      // rediretToMethod();
      dispatch(setPaymentRedirectShow(true));
      jsUtils.has(response, 'is_profile_complete') && dispatch(setPaymentState({ is_profile_completed: true }));
    } else {
      const err = {
        response: {
          status: 500,
        },
      };
      const errors = generateGetServerErrorMessage(err);
      // dispatch(accountSettingFailure(errors));
      console.log('errors', errors);
      showToastPopover(
        translate('error_popover_status.somthing_went_wrong_try_again'),
        EMPTY_STRING,
        FORM_POPOVER_STATUS.SERVER_ERROR,
        true,
      );
    }
  })
  .catch((error) => {
    if (
      error.response &&
      error.response.data &&
      error.response.data.errors[0].type &&
      error.response.data.errors[0].type.includes('exist')
    ) {
      showToastPopover(
        translate('error_popover_status.account_already_exist'),
        translate('error_popover_status.try_another_account'),
        FORM_POPOVER_STATUS.SERVER_ERROR,
        true,
      );
    } else if (error && error.response && error.response.data && error.response.data.errors[0].message === translate('error_popover_status.card_number_incorect')) {
        showToastPopover(
          translate('error_popover_status.card_number_incorect'),
          translate('error_popover_status.recheck_card_number'),
          FORM_POPOVER_STATUS.SERVER_ERROR,
          true,
        );
    } else if (error && error.response && error.response.data && error.response.data.errors[0] && error.response.data.errors[0] && error.response.data.errors[0].includes('Invalid value for')) {
      showToastPopover(
        translate('error_popover_status.incorrect_tax_number'),
        translate('error_popover_status.valid_tax_number'),
        FORM_POPOVER_STATUS.SERVER_ERROR,
        true,
      );
    }
  });
};

export const getCountryTaxListThunk = () => (dispatch) => {
  getCountryWithTaxDetails()
  .then((response) => {
    if (response) {
      dispatch(setPaymentProfileState({ country_tax_list: getDropdownCountryDetails(response) }));
    } else {
      const err = {
        response: {
          status: 500,
        },
      };
      const errors = generateGetServerErrorMessage(err);
      console.log(errors);
      showToastPopover(
        translate('error_popover_status.country_code_error'),
        EMPTY_STRING,
        FORM_POPOVER_STATUS.SERVER_ERROR,
        true,
      );
    }
  });
};

export const getPaymentStatusThunk = (params, redirectToHome) => (dispatch) => {
  getPaymentStatusCheck(params)
  .then((response) => {
    if (response) {
      dispatch(setPaymentProfileState({ payment_status: response.payment_status, payment_method_status_id: response.payment_method_id, payment_status_loading: false, savedBillingCurrency: response.billing_currency }));
      if (response.reason === 'invalid_account') {
        redirectToHome();
      }
    } else {
      const err = {
        response: {
          status: 500,
        },
      };
      const errors = generateGetServerErrorMessage(err);
      dispatch(setPaymentProfileState({ payment_status_loading: false }));
      console.log(errors);
    }
  })
  .catch((error) => {
    console.log(error);
    dispatch(setPaymentProfileState({ payment_status_loading: false }));
    if (error && error.response && error.response.status === 401) {
      redirectToHome();
    }
  });
};

export const tryAgainBillingPayment = (history) => (dispatch) => {
  routeNavigate(history, ROUTE_METHOD.PUSH, HOME);
  dispatch(setPaymentMethodStateChange({ is_direct_payment_method: true }));
  dispatch(ChangePayScreen(CURRENT_PAY_SCREEN.PAY_METHODs_SCREEN));
};

export const getPaymentUrlThunk = (params) => (dispatch) => {
  getPaymentUrlData(params)
  .then((response) => {
    if (response) {
      dispatch(setPaymentRedirectShow(false));
      window.location = response;
    } else {
      const err = {
        response: {
          status: 500,
        },
      };
      const errors = generateGetServerErrorMessage(err);
      console.log('errors', errors);
    }
  })
  .catch((error) => {
    console.log(error);
  });
};
