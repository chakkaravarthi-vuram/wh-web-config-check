import { SingleDropdown, Text } from '@workhall-pvt-lmt/wh-ui-library';
import React, { useState, useEffect } from 'react';
import cx from 'classnames/bind';
import { useTranslation } from 'react-i18next';
import gClasses from '../../../../../../scss/Typography.module.scss';
import { EMPTY_STRING } from '../../../../../../utils/strings/CommonStrings';
import { isEmpty, get } from '../../../../../../utils/jsUtility';
import RelativePath from './relative_path/RelativePath';
import QueryParams from './query_params/QueryParams';
import SaveResponse from './save_response/SaveResponse';
import RequestBody from './request_body/RequestBody';
import { CALL_INTEGRATION_STRINGS } from '../CallIntegration.strings';
import useApiCall from '../../../../../../hooks/useApiCall';
import { INTEGRATION_CONSTANTS } from './GeneralConfiguration.contants';
import {
  getAllIntegrationEventsApi,
  getIntegrationConnectorApi,
} from '../../../../../../axios/apiService/Integration.apiService';
import {
  nodeConfigDataChange,
  useFlowNodeConfig,
} from '../../../../node_configuration/use_node_reducer/useNodeReducer';
import { generateEventTargetObject } from '../../../../../../utils/generatorUtils';
import { validateAndExtractRelativePathFromEndPoint } from '../../../../../integration/Integration.utils';
import {
  RESPONSE_FIELD_KEYS,
} from '../CallIntegration.constants';
import EventHeaders from './event_headers/EventHeaders';
import {
  getModelDetailsApi,
  getModelListApi,
} from '../../../../../../axios/apiService/mlModel.apiService';
import { deleteErrorListWithId, getMLModifiedSampleResponse } from '../CallIntegration.utils';
import { dataLossAlertPopover } from '../../../../node_configuration/NodeConfiguration.utils';
import { INTEGRATION_METHOD_TYPES } from '../../../../../../utils/Constants';

function GeneralConfiguration(props) {
  const { metaData, steps, isMLIntegration, systemFieldParams } = props;

  const { t } = useTranslation();

  const [localState, setLocalState] = useState({
    integrationSearch: EMPTY_STRING,
    eventSearch: EMPTY_STRING,
  });

  const { state, dispatch } = useFlowNodeConfig();

  const {
    connectorUuid,
    connectorName,
    modelId,
    modelName,
    eventUuid,
    eventName,
    selectedConnector,
    eventRelativePath,
    eventInternalHeaders,
    eventQueryParams,
    eventRequestBody,
    responseFormat,
    mlModelList,
    errorList,
  } = state;

  console.log('state_callIntegration', state, 'eventInternalHeaders', eventInternalHeaders);

  const { EXTERNAL_SYSTEM, MAPPING } = CALL_INTEGRATION_STRINGS(t).GENERAL;

  // Integration List Reducer
  const {
    data: integrationList,
    fetch: integrationListFetch,
    isLoading: isIntegrationListLoading,
    hasMore: hasMoreIntegrationList,
    page: integrationListCurrentPage,
  } = useApiCall({}, true);

  // Event List Reducer
  const {
    data: eventList,
    fetch: eventListFetch,
    isLoading: isEventListLoading,
    hasMore: hasMoreEventList,
    page: eventListCurrentPage,
  } = useApiCall({}, true);

  const getIntegrations = (search, pageParam, customParams = {}) => {
    const params = {
      page: pageParam || integrationListCurrentPage || 1,
      size: INTEGRATION_CONSTANTS.LIST_PAGE_SIZE,
      ...customParams,
    };

    if (!isEmpty(search)) params.search = search;

    integrationListFetch(getIntegrationConnectorApi(params));
  };

  const loadInitialIntegrations = () => {
    if (isMLIntegration) return;
    if (
      (isEmpty(integrationList) && !isIntegrationListLoading) ||
      !isEmpty(localState?.integrationSearch)
    ) {
      getIntegrations(EMPTY_STRING, 1);

      setLocalState({
        ...localState,
        integrationSearch: EMPTY_STRING,
      });
    }
  };

  const handleLoadMoreIntegration = () => {
    if (isMLIntegration) return;
    getIntegrations(
      localState?.integrationSearch,
      integrationListCurrentPage + 1,
    );
  };

  const handleSearchIntegration = (event) => {
    if (isMLIntegration) return;
    const {
      target: { value },
    } = event;

    setLocalState({
      ...localState,
      integrationSearch: value,
    });

    if (!isMLIntegration) {
      getIntegrations(value, 1);
    }
  };

  const getEvents = (search, pageParam, selectedConnector = {}) => {
    const params = {
      page: pageParam || eventListCurrentPage || 1,
      size: INTEGRATION_CONSTANTS.LIST_PAGE_SIZE,
      connector_id: selectedConnector?._id,
    };

    if (!isEmpty(search)) params.search = search;

    eventListFetch(getAllIntegrationEventsApi(params));
  };

  const loadInitialEvents = () => {
    if (
      (isEmpty(eventList) && !isEventListLoading) ||
      !isEmpty(localState?.eventSearch)
    ) {
      getEvents(EMPTY_STRING, 1, selectedConnector);

      setLocalState({
        ...localState,
        eventSearch: EMPTY_STRING,
      });
    }
  };

  const handleLoadMoreEvents = () => {
    getEvents(
      localState?.eventSearch,
      eventListCurrentPage + 1,
      selectedConnector,
    );
  };

  const handleSearchEvent = (event) => {
    const {
      target: { value },
    } = event;

    setLocalState({
      ...localState,
      eventSearch: value,
    });

    getEvents(value, 1, selectedConnector);
  };

  useEffect(() => {
    if (!isEmpty(selectedConnector)) {
      getEvents(EMPTY_STRING, 1, selectedConnector);
    }
  }, [selectedConnector?._id]);

  const getMLIntegrationModels = async () => {
    const response = await getModelListApi();

    dispatch(
      nodeConfigDataChange({
        mlModelList: response,
      }),
    );
  };

  useEffect(() => {
    if (isMLIntegration) getMLIntegrationModels();
  }, []);

  const getSelectedModelDetail = async (selectedModel, updatedData = {}) => {
    const params = {
      model_code: selectedModel?.model_code,
    };
    const response = await getModelDetailsApi(params);

    const selectedEvent = response?.events || {};

    const modifiedSampleResponse = getMLModifiedSampleResponse(selectedEvent?.sample_response);

    dispatch(
      nodeConfigDataChange({
        ...updatedData,
        selectedEvent,
        [RESPONSE_FIELD_KEYS.EVENT_REQUEST_BODY]: get(
          selectedEvent,
          'body',
          [],
        ),
        [RESPONSE_FIELD_KEYS.RESPONSE_BODY]: modifiedSampleResponse,
      }),
    );
  };

  let integrationOptionList = [];

  if (isMLIntegration) {
    integrationOptionList = mlModelList?.map((eachModel) => {
      return {
        label: eachModel?.model_name,
        value: eachModel?.model_id,
      };
    });
  } else {
    integrationOptionList = integrationList?.map((eachIntegration) => {
      return {
        label: eachIntegration?.connector_name,
        value: eachIntegration?.connector_uuid,
      };
    });
  }

  const eventOptionList = eventList?.map((eachEvent) => {
    return {
      label: eachEvent?.name,
      value: eachEvent?.event_uuid,
    };
  });

  const handleChooseIntegration = (event) => {
    const {
      target: { id, value },
    } = event;

    let selectedIntegration = {};
    const modifiedErrorList = deleteErrorListWithId(errorList, [
      id,
    ]);

    const updatedData = {
      [id]: value,
      [RESPONSE_FIELD_KEYS.EVENT_UUID]: null,
      [RESPONSE_FIELD_KEYS.EVENT_NAME]: null,
      [RESPONSE_FIELD_KEYS.SELECTED_EVENT]: null,
      [RESPONSE_FIELD_KEYS.EVENT_HEADERS]: [],
      [RESPONSE_FIELD_KEYS.SERVER_EVENT_HEADERS]: [],
      [RESPONSE_FIELD_KEYS.EVENT_INTERNAL_HEADERS]: [],
      [RESPONSE_FIELD_KEYS.RELATIVE_PATH]: [],
      [RESPONSE_FIELD_KEYS.EVENT_RELATIVE_PATH]: [],
      [RESPONSE_FIELD_KEYS.SERVER_RELATIVE_PATH]: [],
      [RESPONSE_FIELD_KEYS.QUERY_PARAMS]: [],
      [RESPONSE_FIELD_KEYS.EVENT_QUERY_PARAMS]: [],
      [RESPONSE_FIELD_KEYS.SERVER_QUERY_PARAMS]: [],
      [RESPONSE_FIELD_KEYS.REQUEST_BODY]: [],
      [RESPONSE_FIELD_KEYS.EVENT_REQUEST_BODY]: [],
      [RESPONSE_FIELD_KEYS.SERVER_REQUEST_BODY]: [],
      [RESPONSE_FIELD_KEYS.IS_SAVE_RESPONSE]: false,
      [RESPONSE_FIELD_KEYS.RESPONSE_FORMAT]: [],
      [RESPONSE_FIELD_KEYS.SERVER_RESPONSE_FORMAT]: [],
      [RESPONSE_FIELD_KEYS.FIELD_DETAILS]: [],
      errorList: modifiedErrorList,
    };

    if (isMLIntegration) {
      selectedIntegration = mlModelList?.find(
        (eachModel) => eachModel?.model_id === value,
      );
      updatedData[RESPONSE_FIELD_KEYS.MODEL_NAME] =
        selectedIntegration?.model_name;
      updatedData[RESPONSE_FIELD_KEYS.MODEL_CODE] =
        selectedIntegration?.model_code;
      updatedData[RESPONSE_FIELD_KEYS.SELECTED_MODEL] = selectedIntegration;

      if (isEmpty(selectedIntegration)) {
        dispatch(nodeConfigDataChange(updatedData));
      } else {
        getSelectedModelDetail(selectedIntegration, updatedData);
      }
    } else {
      selectedIntegration = integrationList?.find(
        (eachIntegration) => eachIntegration?.connector_uuid === value,
      );
      updatedData[RESPONSE_FIELD_KEYS.CONNECTOR_NAME] =
        selectedIntegration?.connector_name;
      updatedData[RESPONSE_FIELD_KEYS.SELECTED_CONNECTOR] = selectedIntegration;
      if (!isEmpty(eventUuid) && connectorUuid !== value) {
        dataLossAlertPopover({
          title: 'Data Loss',
          subTitle: 'Do you want to proceed?',
          onYesHandlerAdditionalFunc: () => {
            dispatch(nodeConfigDataChange(updatedData));
          },
        });
      } else {
        dispatch(nodeConfigDataChange(updatedData));
      }
    }
  };

  const handleChooseEvent = (event) => {
    const {
      target: { id, value },
    } = event;

    const selectedEvent = eventList?.find(
      (eachEvent) => eachEvent?.event_uuid === value,
    );

    const modifiedErrorList = deleteErrorListWithId(errorList, [
      id,
    ]);

    const { relative_path_params } = validateAndExtractRelativePathFromEndPoint(
      selectedEvent?.end_point,
    );

    const modifiedRelativePath = relative_path_params?.map((eachRow) => {
      return {
        pathName: eachRow?.key,
        value: EMPTY_STRING,
        isRequired: true,
      };
    });

    const modifiedEventHeaders = selectedEvent?.headers?.map((eachRow) => {
      return {
        key: eachRow?.key,
        keyUuid: eachRow?.key_uuid,
        value: EMPTY_STRING,
        isRequired: eachRow?.is_required,
      };
    });

    const modifiedQueryParams = selectedEvent?.params?.map((eachRow) => {
      return {
        key: eachRow?.key,
        keyUuid: eachRow?.key_uuid,
        value: EMPTY_STRING,
        isRequired: eachRow?.is_required,
      };
    });

    const updatedData = {
      [id]: value,
      selectedEvent,
      [RESPONSE_FIELD_KEYS.EVENT_NAME]: selectedEvent?.name,
      [RESPONSE_FIELD_KEYS.RELATIVE_PATH]: [],
      [RESPONSE_FIELD_KEYS.SERVER_RELATIVE_PATH]: [],
      [RESPONSE_FIELD_KEYS.EVENT_RELATIVE_PATH]: modifiedRelativePath || [],
      [RESPONSE_FIELD_KEYS.EVENT_HEADERS]: [],
      [RESPONSE_FIELD_KEYS.SERVER_EVENT_HEADERS]: [],
      [RESPONSE_FIELD_KEYS.EVENT_INTERNAL_HEADERS]:
        modifiedEventHeaders || [],
      [RESPONSE_FIELD_KEYS.QUERY_PARAMS]: [],
      [RESPONSE_FIELD_KEYS.SERVER_QUERY_PARAMS]: [],
      [RESPONSE_FIELD_KEYS.EVENT_QUERY_PARAMS]: modifiedQueryParams || [],
      [RESPONSE_FIELD_KEYS.REQUEST_BODY]: [],
      [RESPONSE_FIELD_KEYS.EVENT_REQUEST_BODY]: get(
        selectedEvent,
        'body',
        [],
      ),
      [RESPONSE_FIELD_KEYS.SERVER_REQUEST_BODY]: [],
      [RESPONSE_FIELD_KEYS.RESPONSE_BODY]: get(
        selectedEvent,
        'response_body',
        [],
      ),
      [RESPONSE_FIELD_KEYS.RESPONSE_FORMAT]: [],
      [RESPONSE_FIELD_KEYS.SERVER_RESPONSE_FORMAT]: [],
      [RESPONSE_FIELD_KEYS.FIELD_DETAILS]: [],
      errorList: modifiedErrorList,
    };

    if (selectedEvent?.method === INTEGRATION_METHOD_TYPES.GET) {
      updatedData[RESPONSE_FIELD_KEYS.IS_SAVE_RESPONSE] = true;
    }

    if (eventUuid !== value) {
      if ((!isEmpty(responseFormat) || !isEmpty(eventRequestBody) || !isEmpty(eventQueryParams)
        || !isEmpty(eventInternalHeaders))) {
        dataLossAlertPopover({
          title: 'Data Loss',
          subTitle: 'Do you want to proceed?',
          onYesHandlerAdditionalFunc: () => {
            dispatch(
              nodeConfigDataChange(updatedData),
            );
          },
        });
      } else {
        dispatch(
          nodeConfigDataChange(updatedData),
        );
      }
    }
  };

  return (
    <div>
      <Text
        className={cx(gClasses.FontWeight500, gClasses.FTwo16GrayV3)}
        content={EXTERNAL_SYSTEM.TITLE}
      />
      <div className={cx(gClasses.MT12, gClasses.W40)}>
        <SingleDropdown
          id={
            isMLIntegration
              ? EXTERNAL_SYSTEM.CHOOSE_ML_MODEL.ID
              : EXTERNAL_SYSTEM.CHOOSE_INTEGRATION.ID
          }
          required
          optionList={integrationOptionList}
          onClick={(value, _label, _list, id) =>
            handleChooseIntegration(generateEventTargetObject(id, value))
          }
          dropdownViewProps={{
            labelName: isMLIntegration
              ? EXTERNAL_SYSTEM.CHOOSE_ML_MODEL.LABEL
              : EXTERNAL_SYSTEM.CHOOSE_INTEGRATION.LABEL,
              onClick: loadInitialIntegrations,
              onKeyDown: loadInitialIntegrations,
            selectedLabel: isMLIntegration ? modelName : connectorName,
            isRequired: true,
          }}
          infiniteScrollProps={{
            dataLength: integrationList?.length || 0,
            next: handleLoadMoreIntegration,
            hasMore: hasMoreIntegrationList,
            scrollableId: INTEGRATION_CONSTANTS.LIST_SCROLL_ID,
            scrollThreshold: INTEGRATION_CONSTANTS.LIST_SCROLLABLE_THRESOLD,
          }}
          searchProps={{
            searchValue: localState?.integrationSearch,
            onChangeSearch: handleSearchIntegration,
          }}
          selectedValue={isMLIntegration ? modelId : connectorUuid}
          errorMessage={errorList?.connectorUuid || errorList?.modelId}
          isLoadingOptions={isIntegrationListLoading}
        />
      </div>
      {!isMLIntegration && !isEmpty(connectorUuid) && (
        <div className={cx(gClasses.MT12, gClasses.W40)}>
          <SingleDropdown
            id={EXTERNAL_SYSTEM.EVENT.ID}
            optionList={eventOptionList}
            onClick={(value, _label, _list, id) =>
              handleChooseEvent(generateEventTargetObject(id, value))
            }
            required
            dropdownViewProps={{
              labelName: EXTERNAL_SYSTEM.EVENT.LABEL,
              onClick: loadInitialEvents,
              onKeyDown: loadInitialEvents,
              selectedLabel: eventName,
              isRequired: true,
            }}
            infiniteScrollProps={{
              dataLength: eventList?.length || 0,
              next: handleLoadMoreEvents,
              hasMore: hasMoreEventList,
              scrollableId: INTEGRATION_CONSTANTS.EVENT_LIST_SCROLL_ID,
              scrollThreshold: INTEGRATION_CONSTANTS.LIST_SCROLLABLE_THRESOLD,
            }}
            searchProps={{
              searchValue: localState?.eventSearch,
              onChangeSearch: handleSearchEvent,
            }}
            selectedValue={eventUuid}
            errorMessage={errorList?.eventUuid}
          />
        </div>
      )}
      {(!isEmpty(eventUuid) || (isMLIntegration && !isEmpty(modelId))) && (
        <div className={gClasses.MT24}>
          {(!isEmpty(eventRelativePath) ||
            !isEmpty(eventInternalHeaders) ||
            !isEmpty(eventQueryParams) ||
            !isEmpty(eventRequestBody)) && (
              <>
                <Text
                  className={cx(gClasses.FontWeight500, gClasses.FTwo16GrayV3)}
                  content={MAPPING.TITLE}
                />
                {!isEmpty(eventRelativePath) && (
                  <RelativePath
                    steps={steps}
                    metaData={metaData}
                    systemFieldParams={systemFieldParams}
                  />
                )}
                {!isEmpty(eventInternalHeaders) && (
                  <EventHeaders
                    steps={steps}
                    metaData={metaData}
                    systemFieldParams={systemFieldParams}
                  />
                )}
                {!isEmpty(eventQueryParams) && (
                  <QueryParams
                    steps={steps}
                    metaData={metaData}
                    systemFieldParams={systemFieldParams}
                  />
                )}
                {!isEmpty(eventRequestBody) && (
                  <RequestBody
                    steps={steps}
                    metaData={metaData}
                    systemFieldParams={systemFieldParams}
                    isMLIntegration={isMLIntegration}
                  />
                )}
              </>
            )}
          <SaveResponse metaData={metaData} />
        </div>
      )}
    </div>
  );
}

export default GeneralConfiguration;
