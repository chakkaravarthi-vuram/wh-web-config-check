import axios from 'axios';
import { DELETE_CONDITIONAL_RULE, DELETE_DEFAULT_VALUE_RULE, GET_CONDITIONAL_RULES, GET_ESCALATIONS, GET_RULES, GET_RULE_DETAILS_BY_ID, GET_UNIQUE_RULE_NAME, GET_RULE_OPERATORS_BY_FIELD_TYPE, IMPORT_RULES, REMOVE_RULE, SAVE_RULE } from '../../urls/ApiUrls';
import { axiosPostUtils, axiosGetUtils } from '../AxiosHelper';
import { normalizeGetRules, normalizeRuleDetailsById, normalizeSaveRule } from '../apiNormalizer/rule.apiNormalizer';
import { normalizeIsEmpty } from '../../utils/UtilityFunctions';
import jsUtility from '../../utils/jsUtility';
import { normalizeGetUniqueRuleName } from '../apiNormalizer/rules.apiNormalizer';

  const { CancelToken } = axios;

  // let getRuleCancelToken = null;
  export const getRulesApi = (params, cancelToken) => {
    cancelToken?.();

    return new Promise((resolve, reject) => {
        axiosGetUtils(GET_RULES, {
        params,
        cancelToken: new CancelToken((token) => {
          cancelToken = token;
        }),
        })
        .then((response) => {
            resolve(normalizeGetRules(response));
        })
        .catch((error) => {
            reject(error);
        });
    });
  };

  let importRulesCancelToken = null;
  export const importRulesApi = (params) => {
    importRulesCancelToken?.();

    return new Promise((resolve, reject) => {
        axiosPostUtils(IMPORT_RULES, params, {
        cancelToken: new CancelToken((token) => {
            importRulesCancelToken = token;
        }),
        })
        .then((response) => {
            resolve(response?.data?.result?.data);
        })
        .catch((error) => {
            reject(error);
        });
    });
  };

  let removeRuleCancelToken = null;
  export const removeRuleApi = (params) => {
    removeRuleCancelToken?.();

    return new Promise((resolve, reject) => {
        axiosPostUtils(REMOVE_RULE, params, {
        cancelToken: new CancelToken((token) => {
            removeRuleCancelToken = token;
        }),
        })
        .then((response) => {
            resolve(response?.data?.result?.data);
        })
        .catch((error) => {
            reject(error);
        });
    });
  };

  let saveRuleCancelToken = null;
  export const saveRuleApi = (params) => {
    saveRuleCancelToken?.();

    return new Promise((resolve, reject) => {
        axiosPostUtils(SAVE_RULE, params, {
            cancelToken: new CancelToken((token) => { saveRuleCancelToken = token; }),
        }).then((response) => {
            resolve(normalizeSaveRule(response?.data?.result?.data));
        }).catch((error) => {
            reject(error);
        });
    });
  };

  let getRuleOperatorsByFieldTypeCancelToken = null;
  export const getRuleOperatorsByFieldTypeApi = (fieldTypes) => {
    getRuleOperatorsByFieldTypeCancelToken?.();

    return new Promise((resolve, reject) => {
      axiosGetUtils(GET_RULE_OPERATORS_BY_FIELD_TYPE, {
        params: { field_types: fieldTypes },
        cancelToken: new CancelToken((token) => { getRuleOperatorsByFieldTypeCancelToken = token; }),
      })
        .then((response) => {
          const normalizeData = response.data.result.data;
          resolve(normalizeData);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };

  let getRuleDetailsByIdCancelToken = null;
  export const getRuleDetailsByIdApi = (params) => {
    getRuleDetailsByIdCancelToken?.();

    return new Promise((resolve, reject) => {
      axiosGetUtils(GET_RULE_DETAILS_BY_ID, {
        params,
        cancelToken: new CancelToken((token) => { getRuleDetailsByIdCancelToken = token; }),
      })
        .then((res) => {
          const normalizeData = normalizeRuleDetailsById(res.data.result.data);
          normalizeIsEmpty(normalizeData, resolve, reject);
        })
        .catch((err) => {
          reject(err);
        });
    });
  };

let getEscalationsCancelToken = null;
export const getEscalationsApi = (params) => {
    getEscalationsCancelToken?.();

    return new Promise((resolve, reject) => {
      axiosGetUtils(GET_ESCALATIONS, {
        params,
        cancelToken: new CancelToken((token) => { getEscalationsCancelToken = token; }),
      })
        .then((res) => {
          resolve(jsUtility.get(res, ['data', 'result', 'data'], {}));
        })
        .catch((err) => {
          reject(err);
        });
    });
};

let getConditionalRulesCancelToken = null;
export const getConditionalRulesApi = (params, cancelToken = {}) => {
  if (cancelToken?.cancelToken) {
    cancelToken.cancelToken();
  } else getConditionalRulesCancelToken?.();
    return new Promise((resolve, reject) => {
      axiosGetUtils(GET_CONDITIONAL_RULES, {
        params,
        cancelToken: new CancelToken((token) => {
          if (cancelToken.setCancelToken) {
            cancelToken.setCancelToken(token);
          } else getConditionalRulesCancelToken = token;
        }),
      })
        .then((res) => {
          resolve(jsUtility.get(res, ['data', 'result', 'data'], {}));
        })
        .catch((err) => {
          reject(err);
        });
    });
};

export const getUniqueRuleNameApi = (params, cancelToken) => new Promise((resolve, reject) => {
  if (cancelToken?.cancelToken) cancelToken.cancelToken();
  axiosGetUtils(GET_UNIQUE_RULE_NAME, {
    params,
    cancelToken: new CancelToken((c) => {
      cancelToken.setCancelToken(c);
    }),
  })
    .then((response) => {
      resolve(normalizeGetUniqueRuleName(response));
    })
    .catch((error) => {
      reject(error);
    });
});
export const deleteConditionalRuleApi = (data) =>
  new Promise((resolve, reject) => {
    axiosPostUtils(DELETE_CONDITIONAL_RULE, data, {
      cancelToken: new CancelToken((token) => {
        saveRuleCancelToken = token;
      }),
    })
      .then((response) => {
        resolve(response?.data?.result?.data);
      })
      .catch((error) => {
        reject(error);
      });
  });

export const deleteDefaultValueRuleApi = (data) =>
  new Promise((resolve, reject) => {
    axiosPostUtils(DELETE_DEFAULT_VALUE_RULE, data, {
      cancelToken: new CancelToken((token) => {
        saveRuleCancelToken = token;
      }),
    })
      .then((response) => {
        resolve(response?.data?.result?.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
