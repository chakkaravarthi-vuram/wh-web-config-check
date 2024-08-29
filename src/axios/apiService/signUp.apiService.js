import axios from 'axios';
import { axiosPostUtils, axiosGetUtils } from '../AxiosHelper';
import {
  VERIFY_ACCOUNT_GENERATE_OTP,
  VERIFY_ACCOUNT_RESEND_OTP,
  VALIDATE_EMAIL,
  VERIFY_OTP,
  SIGN_UP,
  VALIDATE_ACCOUNT_DOMAIN,
  ACCOUNT_CONFIGURATION,
  GET_ALL_TRIAL_DETAILS,
  GET_ALL_COUNTRIES,
  VALIDATE_EMAIL_DOMAIN,
} from '../../urls/ApiUrls';
import { getLoaderConfig } from '../../utils/UtilityFunctions';
import {
  normalizeGenerateOTPSignUp,
  normalizeResendOTPSignUp,
  normalizeValidateEmail,
  normalizeVerifyOtp,
  normalizeSignUp,
  normalizeValidateAccountDomain,
  normalizeAccountSettingConfig,
  normalizeGetTrialDetails,
  normalizeGetCountryTax,
  normalizeValidateEmailAndDomain,
} from '../apiNormalizer/signUp.apiNormalizer';
import {
  signUpBasicDetailsCancel,
  signUpOtpVerificationCancel,
  signUpAdditionalDetailsCancel,
} from '../../redux/actions/SignUp.Action';

const { CancelToken } = axios;
let cancelTokenForGenerateOtp;
let cancelTokenForResendOtp;
let canceTokenForEmailUnique;
let cancelTokenForVerifyOtp;
let cancelTokenForSignUp;
let cancelTokenForDomainName;
let cancelAccountSettingConfig;
let cancelAllTrialDetails;

export const generateOTPAPI = (data) => new Promise((resolve, reject) => {
  axiosPostUtils(VERIFY_ACCOUNT_GENERATE_OTP, data, {
    ...getLoaderConfig(),
    cancelToken: new CancelToken((c) => {
      cancelTokenForGenerateOtp = c;
    }),
  })
    .then((response) => {
      resolve(normalizeGenerateOTPSignUp(cancelTokenForGenerateOtp, response));
    })
    .catch((error) => {
      reject(error);
    });
});

export const resendOTPSignUp = (data) => new Promise((resolve, reject) => {
  axiosPostUtils(VERIFY_ACCOUNT_RESEND_OTP, data, {
    ...getLoaderConfig(),
    cancelToken: new CancelToken((c) => {
      cancelTokenForResendOtp = c;
    }),
  })
    .then((response) => {
      resolve(normalizeResendOTPSignUp(cancelTokenForResendOtp, response));
    })
    .catch((error) => {
      reject(error);
    });
});

export const validateEmail = (data) => new Promise((resolve, reject) => {
  axiosPostUtils(VALIDATE_EMAIL, data, {
    cancelToken: new CancelToken((c) => {
      canceTokenForEmailUnique = c;
    }),
  })
    .then((response) => {
      resolve(normalizeValidateEmail(response));
    })
    .catch((error) => {
      reject(error);
    });
});

export const validateEmailDomain = (data) => new Promise((resolve, reject) => {
  axiosPostUtils(VALIDATE_EMAIL_DOMAIN, data, {
    cancelToken: new CancelToken((c) => {
      canceTokenForEmailUnique = c;
    }),
  })
  .then((response) => {
    resolve(normalizeValidateEmailAndDomain(response));
  })
  .catch((error) => {
    reject(error);
  });
});

export const verifyOtp = (data) => new Promise((resolve, reject) => {
  axiosPostUtils(VERIFY_OTP, data, {
    ...getLoaderConfig(),
    cancelToken: new CancelToken((c) => {
      cancelTokenForVerifyOtp = c;
    }),
  })
    .then((response) => {
      resolve(normalizeVerifyOtp(response));
    })
    .catch((error) => {
      reject(error);
    });
});

export const signUp = (data) => new Promise((resolve, reject) => {
  axiosPostUtils(SIGN_UP, data, {
    ...getLoaderConfig(),
    cancelToken: new CancelToken((c) => {
      cancelTokenForSignUp = c;
    }),
  })
    .then((response) => {
      resolve(normalizeSignUp(response));
    })
    .catch((error) => {
      reject(error);
    });
});

export const validateAccountDomain = (data) => new Promise((resolve, reject) => {
  axiosPostUtils(VALIDATE_ACCOUNT_DOMAIN, data, {
    cancelToken: new CancelToken((c) => {
      cancelTokenForDomainName = c;
    }),
  })
    .then((response) => {
      resolve(normalizeValidateAccountDomain(response));
    })
    .catch((error) => {
      reject(error);
    });
});

export const cancelTokenForGenerateOtpAndClearState = (
  cancelFunction = signUpBasicDetailsCancel,
) => (dispatch) => {
  if (cancelTokenForGenerateOtp) {
    cancelTokenForGenerateOtp();
    dispatch(cancelFunction());
  }
};

export const cancelTokenForResendOtpAndClearState = (cancelFunction = signUpBasicDetailsCancel) => (
  dispatch,
) => {
  if (cancelTokenForResendOtp) {
    cancelTokenForResendOtp();
    dispatch(cancelFunction());
  }
};

export const cancelTokenForValidateEmailAndClearState = (
  cancelFunction = signUpBasicDetailsCancel,
) => (dispatch) => {
  if (canceTokenForEmailUnique) {
    canceTokenForEmailUnique();
    dispatch(cancelFunction());
  }
};

export const cancelTokenForVerifyOtpAndClearState = (
  cancelFunction = signUpOtpVerificationCancel,
) => (dispatch) => {
  if (cancelTokenForVerifyOtp) {
    cancelTokenForVerifyOtp();
    dispatch(cancelFunction());
  }
};

export const cancelTokenForSignUpAndClearState = (
  cancelFunction = signUpAdditionalDetailsCancel,
) => (dispatch) => {
  if (cancelTokenForSignUp) {
    cancelTokenForSignUp();
    dispatch(cancelFunction());
  }
};

export const cancelTokenForDomainNameAndClearState = (
  cancelFunction = signUpAdditionalDetailsCancel,
) => (dispatch) => {
  if (cancelTokenForDomainName) {
    cancelTokenForDomainName();
    dispatch(cancelFunction());
  }
};

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

export const getCountryList = (data) => new Promise((resolve, reject) => {
  if (cancelAllTrialDetails) cancelAllTrialDetails();
  axiosGetUtils(GET_ALL_COUNTRIES, data, {
    cancelToken: new CancelToken((c) => {
      cancelAllTrialDetails = c;
    }),
  })
    .then((response) => {
      console.log('fvsdfv', normalizeGetCountryTax(response));
      console.log('fvsdfv', response);

      resolve(normalizeGetCountryTax(response));
    })
    .catch((error) => {
      reject(error);
    });
});

export default generateOTPAPI;
