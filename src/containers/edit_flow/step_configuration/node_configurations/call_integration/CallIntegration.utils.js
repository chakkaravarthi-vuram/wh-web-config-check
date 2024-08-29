import {
  get,
  set,
  cloneDeep,
  isEmpty,
  pick,
  isUndefined,
  compact,
  uniq,
  has,
  unset,
} from 'utils/jsUtility';
import {
  CALL_INTEGRATION_CONSTANTS,
  CALL_INTEGRATION_INITIAL_STATE,
  REQUEST_FIELD_KEYS,
  RESPONSE_FIELD_KEYS,
} from './CallIntegration.constants';
import { EMPTY_STRING } from '../../../../../utils/strings/CommonStrings';
import { normalizer } from '../../../../../utils/normalizer.utils';
import { getIntegrationConnectorApi } from '../../../../../axios/apiService/Integration.apiService';
import { validateAndExtractRelativePathFromEndPoint } from '../../../../integration/Integration.utils';
import { FIELD_VALUE_TYPES, ROW_COMPONENT_KEY_TYPES } from '../row_components/RowComponents.constants';
import { FIELD_TYPE } from '../../../../../utils/constants/form.constant';
import { isBoolean } from '../../../../../utils/jsUtility';
import { getModelDetailsApi } from '../../../../../axios/apiService/mlModel.apiService';
import { INTEGRATION_METHOD_TYPES } from '../../../../../utils/Constants';
import { formatValidationData } from '../../../../../utils/formUtils';
import { getStaticValue } from '../../StepConfiguration.utils';

const updateChildRowsBasedOnSiblings = (data) => {
  if (!isEmpty(data.child_rows)) {
    data.child_rows.forEach((childRow, index) => {
      if (!childRow.keepChild) {
        if (childRow.is_required) {
          set(data, ['child_rows', index, 'keepChild'], true);
          set(
            data,
            ['child_rows', index],
            updateChildRowsBasedOnSiblings(childRow),
          );
        }
      }
    });
  }
  return data;
};

const checkForValidChild = (data, keyLabel, isValidationData) => {
  if (!has(data, ['keepChild']) || data.keepChild === undefined) {
    data.keepChild = false;
  }
  (data.child_rows || []).forEach((childRow, index) => {
    set(data, ['child_rows', index, 'keepChild'], false);

    if (childRow.key_type === 'object') {
      if (childRow.is_multiple && !isEmpty(childRow[keyLabel])) {
        if (!data.keepChild) {
          data.keepChild = true;
        }
      }
      const childRowUpdated = checkForValidChild(childRow, keyLabel);
      set(data, ['child_rows', index], childRowUpdated);
    } else if (!isEmpty(childRow[keyLabel]) || isBoolean(childRow[keyLabel])) {
      set(data, ['child_rows', index, 'keepChild'], true);
      if (data.type === FIELD_VALUE_TYPES.STATIC) {
        if (isValidationData) {
          data.value = formatValidationData(
            data?.value,
            data?.field_type,
          );
        } else {
          data.value = getStaticValue(data.value, data?.field_type, { isParseNumber: true });
        }
      }
      if (!data.keepChild) {
        data.keepChild = true;
      }
    }
  });
  if (data.child_rows) {
    const childList = data.child_rows.some((childRow) => childRow.keepChild);
    if (childList) {
      data.keepChild = true;
      data = updateChildRowsBasedOnSiblings(data);
    }
  }
  return data;
};

export const getIntegrationRequestBodyData = (requestBody = [], isValidationData = false) => {
  const formattedRequestBody = [];
  const clonedRequestBody = cloneDeep(requestBody);
  clonedRequestBody.forEach((data) => {
    data.keepChild = false;
    if (data.is_required) data.keepChild = true;
    if (data.key_type === 'object') {
      if (data.is_multiple && !isEmpty(data.value)) {
        data.keepChild = true;
      }
      const updatedChild = checkForValidChild(cloneDeep(data), 'value', isValidationData);
      formattedRequestBody.push(updatedChild);
    } else {
      if (!isEmpty(data.value) || isBoolean(data.value)) data.keepChild = true;
      if (data.type === FIELD_VALUE_TYPES.STATIC) {
        if (isValidationData) {
          data.value = formatValidationData(
            data?.value,
            data?.field_type,
          );
        } else {
          data.value = getStaticValue(data.value, data?.field_type, { isParseNumber: true });
        }
      }
      formattedRequestBody.push(data);
    }
  });

  return formattedRequestBody;
};

export const constructRequestBodyPostData = (
  reqParam,
  updatedList,
  getCurrentRow,
  isPost = false,
  dataFields = [],
  isTest = false,
) => {
  reqParam?.forEach((currentRow) => {
    if (currentRow.keepChild) {
      if (currentRow.key_type === ROW_COMPONENT_KEY_TYPES.OBJECT) {
        if (!currentRow.is_multiple || isTest) currentRow.value = EMPTY_STRING;
        else if (currentRow.is_multiple) {
          if (isEmpty(currentRow.value)) {
            currentRow.value = EMPTY_STRING;
            currentRow.type =
              CALL_INTEGRATION_CONSTANTS.FIELD_VALUE_TYPES.STATIC;
          }
        }
      }
      const modifiedCurrentRow = getCurrentRow && getCurrentRow(currentRow);
      if (
        currentRow.key_type === ROW_COMPONENT_KEY_TYPES.OBJECT ||
        (currentRow.key_type !== ROW_COMPONENT_KEY_TYPES.OBJECT &&
          (!isUndefined(modifiedCurrentRow.value) ||
            isBoolean(modifiedCurrentRow.value)))
      ) {
        updatedList.push(modifiedCurrentRow);
      }
      if (
        currentRow?.type ===
          CALL_INTEGRATION_CONSTANTS.FIELD_VALUE_TYPES.DYNAMIC &&
        modifiedCurrentRow?.value
      ) {
        dataFields.push(modifiedCurrentRow.value);
      }
      if (currentRow?.child_rows && currentRow?.child_rows?.length > 0) {
        const { reqBody: updatedData, dataFields: updatedDataFields } =
          constructRequestBodyPostData(
            currentRow.child_rows,
            updatedList,
            getCurrentRow,
            isPost,
            dataFields,
            isTest,
          );
        updatedList = updatedData;
        dataFields = updatedDataFields;
      }
    }
  });

  return {
    reqBody: updatedList,
    dataFields,
  };
};

const constructResponseFormatPostData = (responseFormat) => {
  const clonedResponseFormat = cloneDeep(responseFormat);

  const modifiedResponse = clonedResponseFormat?.map((eachResponse) => {
    if (eachResponse?.is_deleted) return null;

    const updatedResponse = {
      [REQUEST_FIELD_KEYS.MAPPING_INFO]: get(
        eachResponse,
        [RESPONSE_FIELD_KEYS.MAPPING_INFO],
        EMPTY_STRING,
      ),
      [REQUEST_FIELD_KEYS.MAPPING_FIELD_TYPE]: get(
        eachResponse,
        [RESPONSE_FIELD_KEYS.MAPPING_FIELD_TYPE],
        EMPTY_STRING,
      ),
    };

    if (
      get(eachResponse, [
        RESPONSE_FIELD_KEYS.FIELD_DETAILS,
        RESPONSE_FIELD_KEYS.FIELD_TYPE,
      ]) === FIELD_TYPE.TABLE
    ) {
      updatedResponse[REQUEST_FIELD_KEYS.TABLE_UUID] = get(
        eachResponse,
        [RESPONSE_FIELD_KEYS.FIELD_DETAILS, RESPONSE_FIELD_KEYS.FIELD_UUID],
        EMPTY_STRING,
      );
    } else {
      updatedResponse[REQUEST_FIELD_KEYS.FIELD_UUID] = get(
        eachResponse,
        [RESPONSE_FIELD_KEYS.FIELD_DETAILS, RESPONSE_FIELD_KEYS.FIELD_UUID],
        EMPTY_STRING,
      );
    }

    if (eachResponse?.mappingFieldType === ROW_COMPONENT_KEY_TYPES.OBJECT) {
      const columnMapping = constructResponseFormatPostData(
        eachResponse?.[RESPONSE_FIELD_KEYS.COLUMN_MAPPING],
      );
      if (!isEmpty(columnMapping)) {
        updatedResponse[REQUEST_FIELD_KEYS.COLUMN_MAPPING] = columnMapping;
      }
    }

    return updatedResponse;
  });

  return compact(modifiedResponse);
};

export const commonReqResData = ({
  resStateData = {},
  sourceDataKeys = {},
  targetDataKeys = {},
  pickData = [],
}) => {
  const dataToBeConverted = pick(
    resStateData,
    pickData?.map((eachPick) => sourceDataKeys?.[eachPick]),
  );

  return normalizer(dataToBeConverted, sourceDataKeys, targetDataKeys);
};

export const getMLModifiedSampleResponse = (sampleResponse) => {
  const modifiedSampleResponse = Object.keys(sampleResponse).map((key) => {
    return {
      key,
      type: sampleResponse[key],
      label: key,
      is_multiple: false,
      key_uuid: EMPTY_STRING,
    };
  });

  // const newObject = {
  //   key: CALL_INTEGRATION_CONSTANTS.ENTIRE_RESPONSE,
  //   type: ROW_COMPONENT_KEY_TYPES.OBJECT,
  //   label: CALL_INTEGRATION_CONSTANTS.ENTIRE_RESPONSE,
  //   is_multiple: false,
  //   key_uuid: EMPTY_STRING,
  // };
  // modifiedSampleResponse.push(newObject);

  return modifiedSampleResponse;
};

export const constructIntegrationStateData = async (
  apiDataParam = {},
  isMLIntegration,
) => {
  const apiData = cloneDeep(apiDataParam);

  let stateData = normalizer(apiData, REQUEST_FIELD_KEYS, RESPONSE_FIELD_KEYS);

  const integrationDetails = isMLIntegration
    ? stateData?.[RESPONSE_FIELD_KEYS.ML_INTEGRATION_DETAILS]
    : stateData?.[RESPONSE_FIELD_KEYS.INTEGRATION_DETAILS];

  set(stateData, [RESPONSE_FIELD_KEYS.FIELD_DETAILS], stateData?.fieldDetails);

  let selectedEvent = {};

  if (isMLIntegration) {
    if (!isEmpty(integrationDetails?.modelCode)) {
      const params = {
        model_code: integrationDetails?.modelCode,
      };

      const integrationResponse = await getModelDetailsApi(params);
      selectedEvent = get(integrationResponse, ['events'], {});

      set(stateData, [RESPONSE_FIELD_KEYS.SELECTED_MODEL], integrationResponse);
    }
  } else {
    if (!isEmpty(integrationDetails?.connectorUuid)) {
      const params = {
        connector_uuid: integrationDetails?.connectorUuid,
        status: CALL_INTEGRATION_CONSTANTS.PUBLISHED,
        event_uuid: integrationDetails?.eventUuid,
      };

      const integrationResponse = await getIntegrationConnectorApi(params);
      selectedEvent = get(integrationResponse, ['events', 0], {});

      set(
        stateData,
        [RESPONSE_FIELD_KEYS.SELECTED_CONNECTOR],
        integrationResponse,
      );
    }
  }

  set(stateData, [RESPONSE_FIELD_KEYS.SELECTED_EVENT], selectedEvent);

  const { relative_path_params } = validateAndExtractRelativePathFromEndPoint(
    selectedEvent?.end_point || EMPTY_STRING,
  );

  const modifiedRelativePath = relative_path_params?.map((eachRow) => {
    return {
      pathName: eachRow?.key,
      value: EMPTY_STRING,
      isRequired: true,
    };
  });
  set(
    stateData,
    [RESPONSE_FIELD_KEYS.EVENT_RELATIVE_PATH],
    modifiedRelativePath,
  );

  const modifiedServerRelativePath = integrationDetails?.[
    RESPONSE_FIELD_KEYS.RELATIVE_PATH
  ]?.map((eachRow) => {
    return {
      pathName: eachRow?.pathName,
      value: eachRow?.value,
      type: eachRow?.type,
      isRequired: eachRow?.isRequired,
    };
  });
  set(
    stateData,
    [RESPONSE_FIELD_KEYS.SERVER_RELATIVE_PATH],
    modifiedServerRelativePath,
  );

  const modifiedEventHeaders = selectedEvent?.headers?.map((eachRow) => {
    return {
      key: eachRow?.key,
      keyUuid: eachRow?.key_uuid,
      value: EMPTY_STRING,
      isRequired: eachRow?.is_required,
    };
  });
  set(
    stateData,
    [RESPONSE_FIELD_KEYS.EVENT_INTERNAL_HEADERS],
    modifiedEventHeaders,
  );

  const modifiedServerEventHeaders = integrationDetails?.[
    RESPONSE_FIELD_KEYS.EVENT_HEADERS
  ]?.map((eachRow) => {
    return {
      key: eachRow?.keyName,
      keyUuid: eachRow?.key,
      value: eachRow?.value,
      type: eachRow?.type,
      isRequired: eachRow?.isRequired,
    };
  });
  set(
    stateData,
    [RESPONSE_FIELD_KEYS.SERVER_EVENT_HEADERS],
    modifiedServerEventHeaders,
  );

  const modifiedQueryParams = selectedEvent?.params?.map((eachRow) => {
    return {
      key: eachRow?.key,
      keyUuid: eachRow?.key_uuid,
      value: EMPTY_STRING,
      isRequired: eachRow?.is_required,
    };
  });
  set(stateData, [RESPONSE_FIELD_KEYS.EVENT_QUERY_PARAMS], modifiedQueryParams);

  const modifiedServerQueryParams = integrationDetails?.[
    RESPONSE_FIELD_KEYS.QUERY_PARAMS
  ]?.map((eachRow) => {
    return {
      key: eachRow?.keyName,
      keyUuid: eachRow?.key,
      value: eachRow?.value,
      type: eachRow?.type,
      isRequired: eachRow?.isRequired,
    };
  });
  set(
    stateData,
    [RESPONSE_FIELD_KEYS.SERVER_QUERY_PARAMS],
    modifiedServerQueryParams,
  );
  set(
    stateData,
    [RESPONSE_FIELD_KEYS.EVENT_REQUEST_BODY],
    get(selectedEvent, 'body', []),
  );
  if (!isEmpty(integrationDetails?.[RESPONSE_FIELD_KEYS.REQUEST_BODY])) {
    set(
      stateData,
      [RESPONSE_FIELD_KEYS.SERVER_REQUEST_BODY],
      integrationDetails?.[RESPONSE_FIELD_KEYS.REQUEST_BODY],
    );
  }

  if (isMLIntegration) {
    const modifiedSampleResponse = getMLModifiedSampleResponse(
      selectedEvent?.sample_response,
    );
    set(stateData, [RESPONSE_FIELD_KEYS.RESPONSE_BODY], modifiedSampleResponse);
  } else {
    set(
      stateData,
      [RESPONSE_FIELD_KEYS.RESPONSE_BODY],
      get(selectedEvent, 'response_body', []),
    );
  }

  if (!isEmpty(integrationDetails?.[RESPONSE_FIELD_KEYS.RESPONSE_FORMAT]) || selectedEvent?.method === INTEGRATION_METHOD_TYPES.GET) {
    set(stateData, [RESPONSE_FIELD_KEYS.IS_SAVE_RESPONSE], true);
    set(
      stateData,
      [RESPONSE_FIELD_KEYS.SERVER_RESPONSE_FORMAT],
      integrationDetails?.[RESPONSE_FIELD_KEYS.RESPONSE_FORMAT],
    );
  }

  const initRetryAttempts = cloneDeep(
    CALL_INTEGRATION_INITIAL_STATE.retryAttempts,
  );
  const retryOptions = [];
  const apiRetryAttempts = stateData?.[RESPONSE_FIELD_KEYS.RETRY_ATTEMPTS];
  const modifiedRetryAttempts = initRetryAttempts?.map(
    (eachAttempt = {}, index) => {
      const currentRetryDuration = get(apiRetryAttempts, [index, RESPONSE_FIELD_KEYS.RETRY_DURATION]);
      const currentRetryDurationType = get(apiRetryAttempts, [
        index,
        RESPONSE_FIELD_KEYS.RETRY_DURATION_TYPE,
      ]);

      if (!isEmpty(currentRetryDuration) || !isUndefined(currentRetryDuration)) {
        retryOptions.push(index);
        return {
          [RESPONSE_FIELD_KEYS.RETRY_DURATION]: currentRetryDuration,
          [RESPONSE_FIELD_KEYS.RETRY_DURATION_TYPE]: currentRetryDurationType,
        };
      }
      return eachAttempt;
    },
  );
  set(stateData, [RESPONSE_FIELD_KEYS.RETRY_ATTEMPTS], modifiedRetryAttempts);
  set(stateData, [RESPONSE_FIELD_KEYS.RETRY_OPTIONS], retryOptions);

  stateData = {
    ...stateData,
    ...pick(integrationDetails, [
      RESPONSE_FIELD_KEYS.MODEL_ID,
      RESPONSE_FIELD_KEYS.MODEL_CODE,
      RESPONSE_FIELD_KEYS.MODEL_NAME,
      RESPONSE_FIELD_KEYS.INTEGRATION_UUID,
      RESPONSE_FIELD_KEYS.CONNECTOR_UUID,
      RESPONSE_FIELD_KEYS.CONNECTOR_NAME,
      RESPONSE_FIELD_KEYS.EVENT_UUID,
      RESPONSE_FIELD_KEYS.EVENT_NAME,
      RESPONSE_FIELD_KEYS.END_POINT,
      RESPONSE_FIELD_KEYS.EVENT_METHOD,
      RESPONSE_FIELD_KEYS.DATA_FIELDS,
    ]),
  };

  delete stateData?.integrationDetails;

  return stateData;
};

export const constructIntegrationPostData = (
  stateDataParam = {},
  isMLIntegration,
) => {
  const stateData = cloneDeep(stateDataParam);

  const postData = {
    ...commonReqResData({
      resStateData: stateData,
      sourceDataKeys: RESPONSE_FIELD_KEYS,
      targetDataKeys: REQUEST_FIELD_KEYS,
      pickData: CALL_INTEGRATION_CONSTANTS.COMMON_PICK_DATA,
    }),
  };

  // set(postData, [REQUEST_FIELD_KEYS.CONNECTED_STEPS], []);

  const filteredRetryAttempts = stateData?.retryAttempts?.filter((_, index) => stateData?.retryOptions?.includes(index));

  if (!isEmpty(filteredRetryAttempts)) {
    const modifiedRetryAttempts = filteredRetryAttempts?.map(
      (eachAttempt = {}) => {
        return {
          [REQUEST_FIELD_KEYS.RETRY_DURATION]: Number(eachAttempt?.duration),
          [REQUEST_FIELD_KEYS.RETRY_DURATION_TYPE]: eachAttempt?.durationType,
        };
      },
    );
    set(postData, [REQUEST_FIELD_KEYS.RETRY_ATTEMPTS], modifiedRetryAttempts);
  }

  const integrationDetailsKey = isMLIntegration
    ? REQUEST_FIELD_KEYS.ML_INTEGRATION_DETAILS
    : REQUEST_FIELD_KEYS.INTEGRATION_DETAILS;

  if (isMLIntegration) {
    set(
      postData,
      [integrationDetailsKey, REQUEST_FIELD_KEYS.MODEL_ID],
      stateData?.[RESPONSE_FIELD_KEYS.MODEL_ID],
    );
    set(
      postData,
      [integrationDetailsKey, REQUEST_FIELD_KEYS.MODEL_CODE],
      stateData?.[RESPONSE_FIELD_KEYS.MODEL_CODE],
    );
  } else {
    set(
      postData,
      [integrationDetailsKey, REQUEST_FIELD_KEYS.CONNECTOR_UUID],
      stateData?.[RESPONSE_FIELD_KEYS.CONNECTOR_UUID],
    );
    set(
      postData,
      [integrationDetailsKey, REQUEST_FIELD_KEYS.EVENT_UUID],
      stateData?.[RESPONSE_FIELD_KEYS.EVENT_UUID],
    );
  }

  if (!isEmpty(stateData?.[RESPONSE_FIELD_KEYS.INTEGRATION_UUID])) {
    set(
      postData,
      [integrationDetailsKey, REQUEST_FIELD_KEYS.INTEGRATION_UUID],
      stateData?.[RESPONSE_FIELD_KEYS.INTEGRATION_UUID],
    );
  }

  set(
    postData,
    [integrationDetailsKey, REQUEST_FIELD_KEYS.IS_REQUIRED_CHECK],
    false,
  );

  const formFields = [];
  const systemFields = [];

  if (!isEmpty(stateData?.[RESPONSE_FIELD_KEYS.RELATIVE_PATH])) {
    const rawRelativePath = stateData?.relativePath;

    let modifiedRelativePath = rawRelativePath?.map((eachRelativePath = {}) => {
      if (isEmpty(eachRelativePath?.value)) return null;
      if (
        eachRelativePath?.type ===
        CALL_INTEGRATION_CONSTANTS.FIELD_VALUE_TYPES.DYNAMIC
      ) {
        formFields.push(eachRelativePath?.value);
      }

      return {
        [REQUEST_FIELD_KEYS.PATH_NAME]: eachRelativePath?.pathName,
        value: eachRelativePath?.value,
        type: eachRelativePath?.type,
      };
    });

    modifiedRelativePath = compact(modifiedRelativePath);

    if (!isEmpty(modifiedRelativePath)) {
      set(
        postData,
        [integrationDetailsKey, REQUEST_FIELD_KEYS.RELATIVE_PATH],
        modifiedRelativePath,
      );
    }
  }

  if (!isEmpty(stateData?.[RESPONSE_FIELD_KEYS.QUERY_PARAMS])) {
    const rawQueryParams = stateData?.queryParams;

    let modifiedQueryParams = rawQueryParams?.map((eachParam = {}) => {
      if (isEmpty(eachParam?.value)) return null;
      if (
        eachParam?.type === CALL_INTEGRATION_CONSTANTS.FIELD_VALUE_TYPES.DYNAMIC
      ) {
        formFields.push(eachParam?.value);
      }

      return {
        key: eachParam?.keyUuid,
        value: eachParam?.value,
        type: eachParam?.type,
      };
    });

    modifiedQueryParams = compact(modifiedQueryParams);

    if (!isEmpty(modifiedQueryParams)) {
      set(
        postData,
        [integrationDetailsKey, REQUEST_FIELD_KEYS.QUERY_PARAMS],
        modifiedQueryParams,
      );
    }
  }

  if (!isEmpty(stateData?.[RESPONSE_FIELD_KEYS.EVENT_HEADERS])) {
    const rawEventHeaders = stateData?.eventHeaders;

    let modifiedEventHeaders = rawEventHeaders?.map((eachHeader = {}) => {
      if (isEmpty(eachHeader?.value)) return null;
      if (
        eachHeader?.type ===
        CALL_INTEGRATION_CONSTANTS.FIELD_VALUE_TYPES.DYNAMIC
      ) {
        formFields.push(eachHeader?.value);
      }

      return {
        key: eachHeader?.keyUuid,
        value: eachHeader?.value,
        type: eachHeader?.type,
      };
    });

    modifiedEventHeaders = compact(modifiedEventHeaders);

    if (!isEmpty(modifiedEventHeaders)) {
      set(
        postData,
        [integrationDetailsKey, REQUEST_FIELD_KEYS.EVENT_HEADERS],
        modifiedEventHeaders,
      );
    }
  }

  if (!isEmpty(stateData?.[RESPONSE_FIELD_KEYS.REQUEST_BODY])) {
    const modifiedRequestBody =
      getIntegrationRequestBodyData(stateData?.requestBody) || [];

    const getCurrentRowPostData = (currentRow) => {
      return {
        key: currentRow.key_uuid,
        value: currentRow?.value,
        type:
          currentRow.type ||
          CALL_INTEGRATION_CONSTANTS.FIELD_VALUE_TYPES.DYNAMIC,
      };
    };

    const { reqBody: requestBody, dataFields: reqDataFields } =
      constructRequestBodyPostData(
        modifiedRequestBody,
        [],
        getCurrentRowPostData,
        true,
      );

    formFields.push(...reqDataFields);

    if (!isEmpty(requestBody)) {
      set(
        postData,
        [integrationDetailsKey, REQUEST_FIELD_KEYS.REQUEST_BODY],
        requestBody,
      );
    }
  }

  if (!isEmpty(stateData?.[RESPONSE_FIELD_KEYS.RESPONSE_FORMAT])) {
    const responseFormat = constructResponseFormatPostData(
      stateData?.responseFormat,
    );

    if (!isEmpty(responseFormat)) {
      set(
        postData,
        [integrationDetailsKey, REQUEST_FIELD_KEYS.RESPONSE_FORMAT],
        responseFormat,
      );
    }
  } else {
    set(
      postData,
      [integrationDetailsKey, REQUEST_FIELD_KEYS.RESPONSE_FORMAT],
      [],
    );
  }

  const dataFields = {};

  if (!isEmpty(formFields)) {
    dataFields[REQUEST_FIELD_KEYS.FORM_FIELDS] = uniq(formFields);
  }

  if (!isEmpty(systemFields)) {
    dataFields[REQUEST_FIELD_KEYS.SYSTEM_FIELDS] = uniq(systemFields);
  }

  if (!isEmpty(dataFields)) {
    set(postData, [integrationDetailsKey, REQUEST_FIELD_KEYS.DATA_FIELDS], {
      [REQUEST_FIELD_KEYS.FORM_FIELDS]: uniq(formFields),
      [REQUEST_FIELD_KEYS.SYSTEM_FIELDS]: uniq(systemFields),
    });
  }

  return postData;
};

export const integrationValidateData = (stateDataParam) => {
  const stateData = cloneDeep(stateDataParam);

  const validateData = pick(stateData, [
    RESPONSE_FIELD_KEYS.ID,
    RESPONSE_FIELD_KEYS.STEP_NAME,
    RESPONSE_FIELD_KEYS.STEP_ORDER,
    RESPONSE_FIELD_KEYS.STEP_STATUS,
    RESPONSE_FIELD_KEYS.STEP_UUID,
    RESPONSE_FIELD_KEYS.CONNECTOR_UUID,
    RESPONSE_FIELD_KEYS.EVENT_UUID,
    RESPONSE_FIELD_KEYS.MODEL_ID,
    RESPONSE_FIELD_KEYS.MODEL_CODE,
    RESPONSE_FIELD_KEYS.IS_SAVE_RESPONSE,
  ]);

  const modifiedRetryAttempts = stateData?.retryAttempts?.filter((_, index) => stateData?.retryOptions?.includes(index));

  validateData[RESPONSE_FIELD_KEYS.RETRY_ATTEMPTS] = modifiedRetryAttempts?.map((eachAttempt = {}) => {
    if (isEmpty(eachAttempt?.duration) || isUndefined(eachAttempt?.duration)) return eachAttempt;
    return { ...eachAttempt, [RESPONSE_FIELD_KEYS.RETRY_DURATION]: Number(eachAttempt?.duration) };
  }) || [];

  if (stateData?.eventHeaders) {
    validateData[RESPONSE_FIELD_KEYS.EVENT_HEADERS] =
      stateData?.eventHeaders?.map((eachHeader = {}) => {
        return {
          key: eachHeader?.key,
          keyUuid: eachHeader?.keyUuid,
          value: eachHeader?.value,
          type: eachHeader?.type,
          isRequired: eachHeader?.isRequired,
        };
      });
  }

  if (stateData?.queryParams) {
    validateData[RESPONSE_FIELD_KEYS.QUERY_PARAMS] =
      stateData?.queryParams?.map((eachParam = {}) => {
        return {
          key: eachParam?.key,
          keyUuid: eachParam?.keyUuid,
          value: eachParam?.value,
          type: eachParam?.type,
          isRequired: eachParam?.isRequired,
        };
      });
  }

  if (stateData?.relativePath) {
    validateData[RESPONSE_FIELD_KEYS.RELATIVE_PATH] =
      stateData?.relativePath?.map((eachPath = {}) => {
        return {
          pathName: eachPath?.pathName,
          value: eachPath?.value,
          type: eachPath?.type,
          isRequired: eachPath?.isRequired,
        };
      });
  }

  if (stateData?.responseFormat) {
    validateData[RESPONSE_FIELD_KEYS.RESPONSE_FORMAT] =
      stateData?.responseFormat?.filter(
        (eachResponse = {}) => !eachResponse?.is_deleted,
      ) || [];
  }

  return validateData;
};

export const deleteErrorListWithId = (errorList, idsTobeDeleted = []) => {
  const clonedErrorList = cloneDeep(errorList);

  idsTobeDeleted?.forEach((id) => unset(clonedErrorList, id));

  return clonedErrorList;
};
