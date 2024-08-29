import axios from 'axios';
import normalizeGetFormulaBuilderFunctions from 'axios/apiNormalizer/formulaBuilder.apiNormalizer';
import { axiosGetUtils, axiosPostUtils } from 'axios/AxiosHelper';
import { GET_FORMULA_BUILDER_FUNCTIONS, EXPRESSION_VERIFICATION, GET_ALL_FIELDS } from '../../urls/ApiUrls';
import { normalizeGetExternalFields } from '../apiNormalizer/formulaBuilder.apiNormalizer';

const { CancelToken: AxiosCancelToken } = axios;

let formulaBuilderFunctionAbortController;
let externalFieldsAbortController;

export const getFormulaBuilderFunctionsApi = () =>
  new Promise((resolve, reject) => {
    if (formulaBuilderFunctionAbortController) formulaBuilderFunctionAbortController.abort();
    formulaBuilderFunctionAbortController = new AbortController();
    axiosGetUtils(GET_FORMULA_BUILDER_FUNCTIONS, {
      signal: formulaBuilderFunctionAbortController.signal,
    })
      .then((response) => {
        resolve(normalizeGetFormulaBuilderFunctions(response));
      })
      .catch((error) => {
        if (error.code === 'ERR_CANCELED') return;
        reject(error);
      });
  });

export const verifyExpressionApi = (post_data) => new Promise((resolve, reject) => {
   axiosPostUtils(
       EXPRESSION_VERIFICATION,
       post_data,
   ).then((response) => {
       resolve(response);
   }).catch((error) => {
       reject(error);
   });
});

export const getExternalFields = (params, cancelToken) => new Promise((resolve, reject) => {
  // if (externalFieldsAbortController) externalFieldsAbortController.abort();
  //  externalFieldsAbortController = new AbortController();

  if (cancelToken) {
    cancelToken.cancelToken?.();
   } else {
     externalFieldsAbortController?.();
   }

  axiosGetUtils(GET_ALL_FIELDS, {
    params,
    cancelToken: new AxiosCancelToken((token) => {
        if (cancelToken) {
         cancelToken.setCancelToken = token;
        } else {
          externalFieldsAbortController = token;
        }
      }),
  })
    .then((response) => resolve(normalizeGetExternalFields(response.data.result.data)))
    .catch((error = {}) => {
      if (error.code === 'ERR_CANCELED') return;
      reject(error);
    });
});
