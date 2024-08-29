import { store } from 'Store';
import { translate } from 'language/config';
import { VALIDATION_CONSTANT } from 'server_validations/serverValidation.constant';
import jsUtils, { translateFunction } from '../../utils/jsUtility';
import { getCountryList } from '../../axios/apiService/signUp.apiService';
import {
  deleteAdminAccount,
  updateAdminAccount,
  addNewAdminAccountApiService,
  getAdminAccountApiService,
  getAdminAccountDetailsApiService,
  getUsageSummaryApiService,
  getAdminAccountSummarySessionCountApiService,
  getAdminAccountSummaryActionPerSessionApiService,
  getAdminAccountSummaryActiveUserCountApiService,
  getAdminAccountSummaryRetentionRateApiService,
} from '../../axios/apiService/adminAccounts.apiService';
import {
  generateGetServerErrorMessage,
  generatePostServerErrorMessage,
} from '../../server_validations/ServerValidation';
import {
  updatePostLoader,
  getDropDownOptionListForCountry,
  showToastPopover,
} from '../../utils/UtilityFunctions';
import { FORM_POPOVER_STATUS } from '../../utils/Constants';
import {
  adminAccountApiStarted,
  adminAccountApiFailure,
  adminAccountApiSuccess,
  openOrCloseModal,
  adminAccountPageLoad,
  paginateAdminAccount,
  modalAdminAccountDataClear,
  accountDetailsAPIStarted,
  accountDetailsAPIFailure,
  accountDetailsAPISuccess,
  usageSummaryAPIStarted,
  usageSummaryAPIFailure,
  usageSummaryAPISuccess,
  adminAccountDataChange,
  validCheck,
  adminAccountSummaryActionPerSessionApiStarted,
  adminAccountSummaryActionPerSessionApiStop,
  adminAccountSummaryActionPerSessionDataChange,
  adminAccountSummarySessionCountApiStarted,
  adminAccountSummarySessionCountApiStop,
  adminAccountSummarySessionCountDataChange,
  adminAccountSummaryActiveUserCountApiStarted,
  adminAccountSummaryActiveUserCountApiStop,
  adminAccountSummaryActiveUserCountDataChange,
  adminAccountSummaryRetentionRateApiStarted,
  adminAccountSummaryRetentionRateApiStop,
  adminAccountSummaryRetentionRateDataChange,
} from '../reducer/AdminAccountsReducer';
import { getIndustryList } from '../../axios/apiService/accountSettings.apiService';
import { EMPTY_STRING } from '../../utils/strings/CommonStrings';

export const adminAccountDataThunk =
  (params, isPageLoading, cancelToken) => (dispatch) => {
    if (isPageLoading) {
      dispatch(adminAccountPageLoad());
    }

    dispatch(adminAccountApiStarted());

    getAdminAccountApiService(params, cancelToken)
      .then((response) => {
        if (response) {
          response.pagination_details = response.paginationDetails;
          response.pagination_data = response.paginationData;
          dispatch(adminAccountApiSuccess(response));
          dispatch(paginateAdminAccount(response));
        } else {
          const err = {
            response: {
              status: 500,
            },
          };
          const errors = generateGetServerErrorMessage(err);
          dispatch(adminAccountApiFailure(errors));
        }
      })
      .catch((error) => {
        if (error && error.code === 'ERR_CANCELED') return;

        const errors = generateGetServerErrorMessage(error);
        dispatch(adminAccountApiFailure(errors));
        showToastPopover(
          (errors?.common_server_error) || translate('error_popover_status.somthing_went_wrong'),
          translate('error_popover_status.try_again'),
          FORM_POPOVER_STATUS.SERVER_ERROR,
          true,
        );
      });
  };

export const deleteAdminAccountApiThunk = (data) => (dispatch) => {
  deleteAdminAccount(data).then((response) => {
    if (response) {
      const { adminAccountCurrentPage, adminAccountDataCountPerPage } =
        store.getState().AdminAccountsReducer;
      const paginationData = {
        page: adminAccountCurrentPage,
        size: adminAccountDataCountPerPage,
      };
      dispatch(adminAccountDataThunk(paginationData));
      showToastPopover(
        translate('error_popover_status.delete_account'),
        EMPTY_STRING,
        FORM_POPOVER_STATUS.SERVER_ERROR,
        true,
      );
    } else {
      const err = {
        response: {
          status: 500,
        },
      };
      const errors = generateGetServerErrorMessage(err);
      dispatch(adminAccountApiFailure(errors));
    }
  });
};

export const getAdminDetailsThunk = (params) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(accountDetailsAPIStarted());
    getAdminAccountDetailsApiService(params)
      .then((response) => {
        if (response) {
          dispatch(accountDetailsAPISuccess(response));
          resolve(response);
        } else {
          const err = {
            response: {
              status: 500,
            },
          };
          const errors = generateGetServerErrorMessage(err);
          dispatch(accountDetailsAPIFailure(errors));
          reject(errors);
        }
      })
      .catch((error) => {
        const errors = generateGetServerErrorMessage(error);
        dispatch(accountDetailsAPIFailure(errors));
        showToastPopover(
          (errors?.common_server_error) || translate('error_popover_status.somthing_went_wrong'),
          translate('error_popover_status.try_again'),
          FORM_POPOVER_STATUS.SERVER_ERROR,
          true,
        );
        reject(errors);
      });
  });

export const getUsageSummaryThunk = (params) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(usageSummaryAPIStarted());
    getUsageSummaryApiService(params)
      .then((response) => {
        if (response) {
          dispatch(usageSummaryAPISuccess(response));
          resolve(response);
        } else {
          const err = {
            response: {
              status: 500,
            },
          };
          const errors = generateGetServerErrorMessage(err);
          dispatch(usageSummaryAPIFailure(errors));
          reject(errors);
        }
      })
      .catch((error) => {
        const errors = generateGetServerErrorMessage(error);
        dispatch(usageSummaryAPIFailure(errors));
        showToastPopover(
          (errors?.common_server_error) || translate('error_popover_status.somthing_went_wrong'),
          translate('error_popover_status.try_again'),
          FORM_POPOVER_STATUS.SERVER_ERROR,
          true,
        );
        reject(errors);
      });
  });

// values api call
export const getIndustryListApiThunk = () => (dispatch) =>
  new Promise((resolve, reject) => {
    getIndustryList()
      .then((response) => {
        if (response) {
          const industries = response.industries.map((obj) => {
            obj.label = obj.industry_type;
            obj.value = obj.industry_type; // Assign new key
            delete obj.industry_type; // Delete old key
            return obj;
          });
          dispatch(adminAccountDataChange('industry_list', industries));
          resolve(response);
        } else {
          const err = {
            response: {
              status: 500,
            },
          };
          const errors = generateGetServerErrorMessage(err);
          reject(errors);
        }
      })
      .catch((error) => {
        const errors = generateGetServerErrorMessage(error);
        showToastPopover(
          (errors?.common_server_error) || translate('error_popover_status.somthing_went_wrong'),
          translate('error_popover_status.try_again'),
          FORM_POPOVER_STATUS.SERVER_ERROR,
          true,
        );
        reject(errors);
      });
  });

export const getCountryListThunk = () => (dispatch) =>
  new Promise((resolve, reject) => {
    getCountryList()
      .then((response) => {
        if (response) {
          dispatch(
            adminAccountDataChange(
              'country_list',
              getDropDownOptionListForCountry(response),
            ),
          );
          resolve(response);
        } else {
          const err = {
            response: {
              status: 500,
            },
          };
          const errors = generateGetServerErrorMessage(err);
          reject(errors);
        }
      })
      .catch((error) => {
        const errors = generateGetServerErrorMessage(error);
        showToastPopover(
          (errors?.common_server_error) || translate('error_popover_status.somthing_went_wrong'),
          translate('error_popover_status.try_again'),
          FORM_POPOVER_STATUS.SERVER_ERROR,
          true,
        );
        reject(errors);
      });
  });

export const updateAdminAccountApiThunk = (data, callback) => (dispatch) => {
  dispatch(adminAccountApiStarted());
  updateAdminAccount(data)
    .then((response) => {
      if (response) {
        dispatch(
          getAdminDetailsThunk({
            account_id: response._id,
          }),
        );
        dispatch(openOrCloseModal(false));
        dispatch(modalAdminAccountDataClear());
        if (callback) callback();
        showToastPopover(
          translate('error_popover_status.update_account'),
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
        const errors = generatePostServerErrorMessage(err);
        dispatch(adminAccountApiFailure(errors));
      }
    })
    .catch((error) => {
      if (error && error.code === 'ERR_CANCELED') return;

      const errors = generatePostServerErrorMessage(error);
      dispatch(adminAccountApiFailure(errors));

      showToastPopover(
        (errors?.common_server_error) || translate('error_popover_status.somthing_went_wrong'),
        translate('error_popover_status.try_again'),
        FORM_POPOVER_STATUS.SERVER_ERROR,
        true,
      );
    });
};

export const addAdminAccountApiThunk = (data, callback, t = translateFunction) => (dispatch) => {
  dispatch(adminAccountApiStarted());
  addNewAdminAccountApiService(data)
    .then((response) => {
      updatePostLoader(false);
      if (response) {
        dispatch(openOrCloseModal(false));
        dispatch(modalAdminAccountDataClear());
        dispatch(adminAccountDataThunk());
        if (callback) callback();
        showToastPopover(
          translate('error_popover_status.add_account'),
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
        const errors = generatePostServerErrorMessage(err);
        dispatch(adminAccountApiFailure(errors));
      }
    })
    .catch((error) => {
      if (error && error.code === 'ERR_CANCELED') return;
      updatePostLoader(false);

      const { adminAccountErrorList } = store.getState().AdminAccountsReducer;

      if (
        error.response &&
        error.response.data &&
        error.response.data.errors[0].type &&
        error.response.data.errors[0].type.includes('exist')
      ) {
        const { field } = error.response.data.errors[0];
        showToastPopover(
          `${field === 'email' ? 'Email' : translate('error_popover_status.account_domain')} ${t(VALIDATION_CONSTANT.ALREADY_EXIST)}`,
          `${translate('error_popover_status.try_any_other')} ${
            field === 'email' ? 'Email' : translate('error_popover_status.account_domain')}`,
          FORM_POPOVER_STATUS.SERVER_ERROR,
          true,
        );

        const errorKey = field === 'email' ? 'account_email' : 'account_domain';
        dispatch(
          validCheck({
            ...adminAccountErrorList,
            [errorKey]: `${
              field === 'email' ? translate('error_popover_status.email') : translate('error_popover_status.account_domain')
            } ${t(VALIDATION_CONSTANT.ALREADY_EXIST)}`,
          }),
        );
        return;
      }

      const errors = generatePostServerErrorMessage(error);
      dispatch(adminAccountApiFailure(errors));
      // if (
      //   error.response &&
      //   error.response.data &&
      //   error.response.data.errors[0].type &&
      //   error.response.data.errors[0].type.includes('exist')
      // ) {
      //   const { field } = error.response.data.errors[0];
      //   console.log('wertyujkmnbvcsruytre4', error);

      //   const errorKey = field === 'email' ? 'account_email' : 'account_domain';
      //   dispatch(
      //     validCheck({
      //       ...adminAccountErrorList,
      //       [errorKey]: `${
      //         field === 'email' ? translate('error_popover_status.email') : translate('error_popover_status.account_domain')
      //       } ${translate('server_validation_constants.already_exist')}`,
      //     }),
      //   );
      //   return;
      // }

      if (
        error.response &&
        error.response.data &&
        error.response.data.errors[0].type &&
        error.response.data.errors[0].type.includes('string.pattern.base') &&
        error.response.data.errors[0].field === 'email'
      ) {
        dispatch(
          validCheck({
            ...adminAccountErrorList,
            account_email: translate('error_popover_status.invalid_email'),
          }),
        );
      }
      showToastPopover(
        (errors?.common_server_error) || translate('error_popover_status.somthing_went_wrong'),
        translate('error_popover_status.try_again'),
        FORM_POPOVER_STATUS.SERVER_ERROR,
        true,
      );
    });
};

// Admin Account Summary - API Thunk
export const getAdminAccountSummaryActionPerSessionApiThunk =
  (params) => (dispatch) =>
    new Promise((resolve, reject) => {
      dispatch(adminAccountSummaryActionPerSessionApiStarted());
      getAdminAccountSummaryActionPerSessionApiService(params)
        .then((response) => {
          if (response) {
            const { x_value, y_values } = response;
            const {
              adminAccountSummary: { actionPerSession },
            } = store.getState().AdminAccountsReducer;
            const clonedActionPerSession = jsUtils.cloneDeep(actionPerSession);
            clonedActionPerSession.isActionPerSessionLoading = false;
            clonedActionPerSession.labelsActionPerSession = x_value;
            clonedActionPerSession.dataActionPerSession = y_values;
            dispatch(
              adminAccountSummaryActionPerSessionDataChange(
                clonedActionPerSession,
              ),
            );
            resolve(response);
          } else {
            const err = {
              response: {
                status: 500,
              },
            };
            const errors = generateGetServerErrorMessage(err);
            dispatch(adminAccountSummaryActionPerSessionApiStop());
            reject(errors);
          }
        })
        .catch((error) => {
          const errors = generateGetServerErrorMessage(error);
          dispatch(adminAccountSummaryActionPerSessionApiStop());
          showToastPopover(
            (errors?.common_server_error) || translate('error_popover_status.somthing_went_wrong'),
            translate('error_popover_status.try_again'),
            FORM_POPOVER_STATUS.SERVER_ERROR,
            true,
          );
          reject(errors);
        });
    });

export const getAdminAccountSummarySessionCountApiThunk =
  (params) => (dispatch) =>
    new Promise((resolve, reject) => {
      dispatch(adminAccountSummarySessionCountApiStarted());
      getAdminAccountSummarySessionCountApiService(params)
        .then((response) => {
          if (response) {
            const { x_value, y_values } = response;
            const {
              adminAccountSummary: { sessionCount },
            } = store.getState().AdminAccountsReducer;
            const clonedSessionCount = jsUtils.cloneDeep(sessionCount);
            clonedSessionCount.isSessionCountLoading = false;
            clonedSessionCount.labelsSessionCount = x_value;
            clonedSessionCount.dataSessionCount = y_values;
            dispatch(
              adminAccountSummarySessionCountDataChange(clonedSessionCount),
            );
            resolve(response);
          } else {
            const err = {
              response: {
                status: 500,
              },
            };
            const errors = generateGetServerErrorMessage(err);
            dispatch(adminAccountSummarySessionCountApiStop());
            reject(errors);
          }
        })
        .catch((error) => {
          const errors = generateGetServerErrorMessage(error);
          dispatch(adminAccountSummarySessionCountApiStop());
          showToastPopover(
            (errors?.common_server_error) || translate('error_popover_status.somthing_went_wrong'),
            translate('error_popover_status.try_again'),
            FORM_POPOVER_STATUS.SERVER_ERROR,
            true,
          );
          reject(errors);
        });
    });

export const getAdminAccountSummaryActiveUserCountApiThunk =
  (params) => (dispatch) =>
    new Promise((resolve, reject) => {
      dispatch(adminAccountSummaryActiveUserCountApiStarted());
      getAdminAccountSummaryActiveUserCountApiService(params)
        .then((response) => {
          if (response) {
            const { x_value, y_values } = response;
            const {
              adminAccountSummary: { activeUserCount },
            } = store.getState().AdminAccountsReducer;
            const clonedActiveUserCount = jsUtils.cloneDeep(activeUserCount);
            clonedActiveUserCount.isActiveUserCountLoading = false;
            clonedActiveUserCount.labelsActiveUserCount = x_value;
            clonedActiveUserCount.dataActiveUserCount = y_values;
            dispatch(
              adminAccountSummaryActiveUserCountDataChange(
                clonedActiveUserCount,
              ),
            );
            resolve(response);
          } else {
            const err = {
              response: {
                status: 500,
              },
            };
            const errors = generateGetServerErrorMessage(err);
            dispatch(adminAccountSummaryActiveUserCountApiStop());
            reject(errors);
          }
        })
        .catch((error) => {
          const errors = generateGetServerErrorMessage(error);
          dispatch(adminAccountSummaryActiveUserCountApiStop());
          showToastPopover(
            (errors?.common_server_error) || translate('error_popover_status.somthing_went_wrong'),
            translate('error_popover_status.try_again'),
            FORM_POPOVER_STATUS.SERVER_ERROR,
            true,
          );
          reject(errors);
        });
    });

export const getAdminAccountSummaryRetentionRateApiThunk = () => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(adminAccountSummaryRetentionRateApiStarted());
    getAdminAccountSummaryRetentionRateApiService()
      .then((response) => {
        if (response) {
          const { x_value, y_values } = response;
          const {
            adminAccountSummary: { retentionRate },
          } = store.getState().AdminAccountsReducer;
          const clonedRetentionRate = jsUtils.cloneDeep(retentionRate);
          clonedRetentionRate.isRetentionRateLoading = false;
          clonedRetentionRate.labelsRetentionRate = x_value;
          clonedRetentionRate.dataRetentionRate = y_values;
          dispatch(
            adminAccountSummaryRetentionRateDataChange(clonedRetentionRate),
          );
          resolve(response);
        } else {
          const err = {
            response: {
              status: 500,
            },
          };
          const errors = generateGetServerErrorMessage(err);
          dispatch(adminAccountSummaryRetentionRateApiStop());
          reject(errors);
        }
      })
      .catch((error) => {
        const errors = generateGetServerErrorMessage(error);
        dispatch(adminAccountSummaryRetentionRateApiStop());
        showToastPopover(
          (errors?.common_server_error) || translate('error_popover_status.somthing_went_wrong'),
          translate('error_popover_status.try_again'),
          FORM_POPOVER_STATUS.SERVER_ERROR,
          true,
        );
        reject(errors);
      });
  });
