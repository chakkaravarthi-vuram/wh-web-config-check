import React, { useEffect, useState } from 'react';
import cx from 'classnames/bind';
import gClasses from 'scss/Typography.module.scss';
import { ARIA_ROLES, BS } from 'utils/UIConstants';
import Input from 'components/form_components/input/Input';
import TextArea from 'components/form_components/text_area/TextArea';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { updateFlowDataChange, updateFlowStateChange } from 'redux/reducer/EditFlowReducer';
import { cloneDeep, get, isEmpty, capitalizeEachFirstLetter } from 'utils/jsUtility';
import { EMPTY_STRING } from 'utils/strings/CommonStrings';
import HELPER_MESSAGE_TYPE from 'components/form_components/helper_message/HelperMessage.strings';
import HelperMessage from 'components/form_components/helper_message/HelperMessage';
import IntegrationDropdown from 'containers/integration/integration_dropdown/IntegrationDropdown';
import { useTranslation } from 'react-i18next';
import { SingleDropdown } from '@workhall-pvt-lmt/wh-ui-library';
import styles from './BasicIntegrationConfiguration.module.scss';
import { INTEGRATION_CONSTANTS } from '../FlowIntegrationConfiguration.constants';
import { WORKHALL_API_STRINGS } from '../../../../../integration/Integration.strings';
import { getAllIntegrationEventsApiThunk, getIntegrationListApiThunk } from '../../../../../../redux/actions/FlowStepConfiguration.Action';
import { keydownOrKeypessEnterHandle } from '../../../../../../utils/UtilityFunctions';

let cancelTokenGetAllEvents;

export const getCancelTokenGetAllEvents = (cancelToken) => {
  cancelTokenGetAllEvents = cancelToken;
};

function BasicIntegerationConfiguration(props) {
  const { integerationList = [], currentIntegrationData = {}, updateIntegerationData,
    allIntegrationList = [], updateFlowData, integration_error_list = {},
    getIntegrationConnectorApi,
    activeIntegrationServerError = EMPTY_STRING, updateFlowState, isLoadingStepDetails, getAllIntegrationEventsApi } = props;
  const { integration_details = {}, event_details = {}, events_list = [], isEventsLoading = false, events_list_has_more = false, events_current_page = 0, selected_connector = EMPTY_STRING } = cloneDeep(currentIntegrationData);
  console.log('integerationListAPI', currentIntegrationData, integration_details, 'event_details', currentIntegrationData?.event_details);
  const [searchText, setSearchText] = useState(EMPTY_STRING);

  const [isIntegrationContainerOpen, setIntegrationContainerOpen] = useState(false);
  const [eventSearchText, setEventSearchText] = useState(EMPTY_STRING);
  const { BASIC_CONFIGURATION } = INTEGRATION_CONSTANTS;
  const { t } = useTranslation();
  useEffect(() => {
    if (!isIntegrationContainerOpen) {
      setEventSearchText(EMPTY_STRING);
    }
  }, [isIntegrationContainerOpen]);

  const chooseIntegeration = (integeration) => {
    const clonedIntegerationDetails = cloneDeep(currentIntegrationData);
    console.log('chooseIntegeration', integeration);
    setIntegrationContainerOpen(false);
    setSearchText(EMPTY_STRING);
    clonedIntegerationDetails.integration_details = integeration;
    clonedIntegerationDetails.selected_connector = integeration?._id;
    clonedIntegerationDetails.event_details = {};
    clonedIntegerationDetails.integration_error_list = {};
    if (clonedIntegerationDetails.integration_error_list) delete clonedIntegerationDetails.integration_error_list[BASIC_CONFIGURATION.APP.APP_ID];
    delete clonedIntegerationDetails.event_headers;
    delete clonedIntegerationDetails.test_event_headers;
    delete clonedIntegerationDetails.query_params;
    delete clonedIntegerationDetails.test_query_params;
    delete clonedIntegerationDetails.relative_path;
    delete clonedIntegerationDetails.test_relative_path;
    delete clonedIntegerationDetails.request_body;
    delete clonedIntegerationDetails.test_body;
    delete clonedIntegerationDetails.test_response;
    delete clonedIntegerationDetails.response_format;
    delete clonedIntegerationDetails.dataFields;
    updateIntegerationData(clonedIntegerationDetails);
  };

  const chooseEvent = async (event, isCustomDropdownOpen) => {
    let clonedIntegerationDetails = cloneDeep(currentIntegrationData);
    clonedIntegerationDetails.event_details = { ...event };
    const { dispatch } = props;
    clonedIntegerationDetails = await dispatch(getIntegrationListApiThunk({
      postData: {
        connector_uuid: integration_details?.connector_uuid,
        status: 'published',
        event_uuid: event.event_uuid,
      },
      isSelectEvent: true,
      details: clonedIntegerationDetails,
    }));
    if (clonedIntegerationDetails?.integration_error_list) delete clonedIntegerationDetails.integration_error_list[BASIC_CONFIGURATION.EVENT.EVENT_ID];
    clonedIntegerationDetails.integration_error_list = {};
    if (isCustomDropdownOpen) isCustomDropdownOpen();
    updateIntegerationData(clonedIntegerationDetails);
  };

  const handleSearchIntegration = (event) => {
    setSearchText(event?.target?.value);
    if (event?.target?.value) {
      const filteredList = allIntegrationList.filter((eachIntegration) =>
        (eachIntegration?.connector_name || eachIntegration?.name || EMPTY_STRING).toLowerCase().includes(event.target.value.toLowerCase()));
      updateFlowData({ integerationList: filteredList });
    } else {
      updateFlowData({ integerationList: allIntegrationList });
    }
  };

  const changeIntegrationStepName = (event) => {
    const clonedIntegerationDetails = cloneDeep(currentIntegrationData);
    clonedIntegerationDetails.step_name = event.target.value;
    if (clonedIntegerationDetails.integration_error_list) delete clonedIntegerationDetails.integration_error_list[BASIC_CONFIGURATION.STEP_NAME.ID];
    updateFlowState({ activeIntegrationServerError: '' });
    updateIntegerationData(clonedIntegerationDetails);
  };

  const changeIntegrationStepDescription = (event) => {
    const clonedIntegerationDetails = cloneDeep(currentIntegrationData);
    clonedIntegerationDetails.step_description = event.target.value;
    if (clonedIntegerationDetails.integration_error_list) delete clonedIntegerationDetails.integration_error_list[BASIC_CONFIGURATION.STEP_DESCRIPTION.ID];
    updateIntegerationData(clonedIntegerationDetails);
  };

  const onEventSearch = (event) => {
    if (event?.target) {
      setEventSearchText(event.target.value);

      if (cancelTokenGetAllEvents) cancelTokenGetAllEvents();

      const params = {
        page: 1,
        size: 7,
        connector_id: selected_connector,
      };

      if (!isEmpty(event.target.value)) params.search = event.target.value;

      getAllIntegrationEventsApi(
        params,
        { connector_uuid: integration_details?.connector_uuid },
        getCancelTokenGetAllEvents,
        { stepId: currentIntegrationData._id },
      );
    }
  };

  const clearSearch = () => {
    setSearchText(EMPTY_STRING);
  };

  const loadMoreEvents = () => {
    const params = {
      page: events_current_page,
      size: 7,
      connector_id: selected_connector,
    };

    if (!isEmpty(eventSearchText)) params.search = eventSearchText;

    getAllIntegrationEventsApi(
      params,
      { connector_uuid: integration_details?.connector_uuid },
      getCancelTokenGetAllEvents,
      { stepId: currentIntegrationData._id, events_list },
    );
  };

  const eventsDropdownOnClick = () => {
    if (isEmpty(selected_connector)) return;

    if (cancelTokenGetAllEvents) cancelTokenGetAllEvents();

    const params = {
      page: 1,
      size: 7,
      connector_id: selected_connector,
    };

    getAllIntegrationEventsApi(
      params,
      { connector_uuid: integration_details?.connector_uuid },
      getCancelTokenGetAllEvents,
      { stepId: currentIntegrationData._id },
    );
    setEventSearchText(EMPTY_STRING);
  };

  return (
    <div className={cx(BS.H100)}>
      <div
        className={cx(styles.AddIntegrationTitle, BS.W100, BS.TEXT_CENTER)}
      >
        {t(INTEGRATION_CONSTANTS.TITLE)}
      </div>
      <div className={cx(BS.TEXT_LEFT, gClasses.MT40)}>
        <div>
          <div className={cx(gClasses.LabelStyle)}>
            {t(BASIC_CONFIGURATION.APP.LABEL)}
          </div>
          {/* {isIntegrationContainerOpen && ( */}
          <IntegrationDropdown
            integerationList={integerationList}
            integration_details={integration_details}
            getIntegrationConnectorApi={getIntegrationConnectorApi}
            chooseAppError={
              integration_error_list[BASIC_CONFIGURATION.APP.APP_ID]
            }
            chooseIntegeration={chooseIntegeration}
            // integerationReferencePopperElement={integerationReferencePopperElement}
            isIntegrationContainerOpen={isIntegrationContainerOpen}
            setIntegrationContainerOpen={setIntegrationContainerOpen}
            isDataLoading={isLoadingStepDetails}
            onInputChange={handleSearchIntegration}
            clearSearch={clearSearch}
            searchIntegrationText={searchText}
            isFlow
            popperContainerClassName={styles.ExternalListPopper}
          />
          {/* )} */}
          <HelperMessage
            message={integration_error_list[BASIC_CONFIGURATION.APP.APP_ID]}
            type={HELPER_MESSAGE_TYPE.ERROR}
            // id={messageId}
            className={gClasses.MB15}
            noMarginBottom
            // ariaLabelHelperMessage={ariaLabelHelperMessage}
            // ariaHidden={!helperAriaHidden}
            role={ARIA_ROLES.ALERT}
          />
        </div>
        {!isEmpty(
          get(integration_details, ['connector_uuid'], EMPTY_STRING),
        ) && (
            <>
              <Input
                label={t(BASIC_CONFIGURATION.STEP_NAME.LABEL)}
                onChangeHandler={(event) => changeIntegrationStepName(event)}
                id={BASIC_CONFIGURATION.STEP_NAME.ID}
                className={styles.FormFields}
                errorMessage={
                  integration_error_list[BASIC_CONFIGURATION.STEP_NAME.ID] ||
                  activeIntegrationServerError
                }
                value={currentIntegrationData?.step_name}
              />
              <TextArea
                label={t(BASIC_CONFIGURATION.STEP_DESCRIPTION.LABEL)}
                id={BASIC_CONFIGURATION.STEP_DESCRIPTION.ID}
                value={currentIntegrationData?.step_description}
                onChangeHandler={(event) =>
                  changeIntegrationStepDescription(event)
                }
                className={cx(gClasses.MT15)}
                innerClass={styles.IntegrationDescriptionHeight}
                errorMessage={
                  integration_error_list[
                  BASIC_CONFIGURATION.STEP_DESCRIPTION.ID
                  ]
                }
                isCreationField
                isTable
              />
              <SingleDropdown
                id={BASIC_CONFIGURATION.EVENT.ID}
                dropdownViewProps={{
                  labelName: t(BASIC_CONFIGURATION.EVENT.LABEL),
                  onClick: eventsDropdownOnClick,
                  onKeyDown: eventsDropdownOnClick,
                  selectedLabel: event_details?.name,
                  isRequired: true,
                  isLoading: isLoadingStepDetails,
                  placeholder: t(BASIC_CONFIGURATION.EVENT.PLACEHOLDER),
                  className: styles.CustomDropdownViewClass,
                  customDropdownView: isEmpty(
                    get(event_details, ['event_uuid'], EMPTY_STRING),
                  ) ? (
                    <span
                      className={cx(
                        gClasses.FTwo13GrayV62,
                        gClasses.FontWeight400,
                        gClasses.CenterV,
                        styles.SelectedNoEventInfo,
                      )}
                    >
                      {t(BASIC_CONFIGURATION.EVENT.PLACEHOLDER)}
                    </span>
                  ) : (
                    <div
                      className={cx(
                        gClasses.FTwo13GrayV62,
                        gClasses.CenterV,
                        styles.SelectedEventInfo,
                      )}
                    >
                      <div
                        className={cx(
                          styles.Method,
                          gClasses.FTwo13GrayV3,
                          gClasses.FontWeight500,
                        )}
                      >
                        {capitalizeEachFirstLetter(
                          event_details?.method?.toLowerCase(),
                        )}
                      </div>
                      <div
                        className={cx(
                          styles.EventName,
                          gClasses.CenterV,
                          gClasses.FTwo13GrayV90,
                          styles.SelectedEvent,
                        )}
                      >
                        {event_details?.name}
                      </div>
                      <div
                        className={cx(
                          gClasses.ML20,
                          gClasses.FTwo13GrayV90,
                          styles.SelectedEvent,
                        )}
                      >
                        {event_details?.end_point}
                      </div>
                    </div>
                  ),
                }}
                customDropdownListView={(eachEvent, isCustomDropdownOpen) => {
                  if (eachEvent.disabled) {
                    return (
                      <div
                        className={cx(
                          styles.CategoryContainer,
                          gClasses.CenterV,
                        )}
                        id={eachEvent.name}
                        key={eachEvent.name}
                      >
                        <div
                          className={cx(
                            gClasses.FTwo13GrayV90,
                            gClasses.FontWeight500,
                          )}
                        >
                          {eachEvent.name}
                        </div>
                      </div>
                    );
                  } else {
                    return (
                      <div
                        className={cx(
                          styles.OptionContainer,
                          event_details?.event_uuid === eachEvent.event_uuid
                            ? styles.SelectedOption
                            : null,
                        )}
                        onClick={() =>
                          chooseEvent(eachEvent, isCustomDropdownOpen)
                        }
                        role="menuitem"
                        tabIndex="0"
                        onKeyDown={() =>
                          keydownOrKeypessEnterHandle(eachEvent) &&
                          chooseEvent(eachEvent, isCustomDropdownOpen)
                        }
                        id={eachEvent._id}
                        key={eachEvent._id}
                      >
                        <div
                          className={cx(
                            gClasses.CenterV,
                            gClasses.ClickableElement,
                            gClasses.CursorPointer,
                          )}
                        >
                          <div
                            className={cx(
                              gClasses.CenterV,
                              styles.MethodContainer,
                            )}
                          >
                            <div
                              className={cx(
                                gClasses.FTwo13GrayV3,
                                styles.EventMethod,
                              )}
                            >
                              {capitalizeEachFirstLetter(
                                eachEvent.method?.toLowerCase(),
                              )}
                            </div>
                          </div>
                          <div
                            className={cx(
                              gClasses.FTwo13GrayV3,
                              styles.OptionLabel,
                              gClasses.WordBreakBreakWord,
                            )}
                          >
                            {eachEvent.name}
                          </div>
                          <div
                            className={cx(
                              gClasses.FTwo13GrayV3,
                              styles.EndPoint,
                              gClasses.WordBreakAll,
                            )}
                          >
                            {eachEvent.end_point}
                          </div>
                        </div>
                      </div>
                    );
                  }
                }}
                optionList={events_list}
                className={
                  integration_error_list[
                    BASIC_CONFIGURATION.STEP_DESCRIPTION.ID
                  ]
                    ? gClasses.MT25
                    : gClasses.MT15
                }
                selectedValue={event_details?.event_uuid}
                errorMessage={
                  integration_error_list[BASIC_CONFIGURATION.EVENT.EVENT_ID]
                }
                isLoadingOptions={isEventsLoading}
                infiniteScrollProps={{
                  dataLength: events_list?.length,
                  next: loadMoreEvents,
                  hasMore: events_list_has_more,
                  scrollableId: WORKHALL_API_STRINGS.CHOOSE_FLOW.SCROLLABLE_ID,
                }}
                searchProps={{
                  searchPlaceholder: t(BASIC_CONFIGURATION.EVENT.SEARCH),
                  searchValue: eventSearchText,
                  onChangeSearch: onEventSearch,
                }}
              />
            </>
          )}
      </div>
    </div>
  );
}

const mapStateToProps = ({ EditFlowReducer }) => {
  return {
    integerationList: EditFlowReducer.flowData.integerationList,
    allIntegrationList: EditFlowReducer.flowData.allIntegrationList,
    integration_details: EditFlowReducer.flowData.integration_details,
    isLoadingStepDetails: EditFlowReducer.isLoadingStepDetails,
    activeIntegrationServerError: EditFlowReducer.activeIntegrationServerError,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateFlowData: (...params) => {
      dispatch(updateFlowDataChange(...params));
    },
    getIntegrationConnectorApi: (...params) => {
      dispatch(getIntegrationListApiThunk(...params));
    },
    updateFlowState: (value) => {
      dispatch(updateFlowStateChange(value));
    },
    getAllIntegrationEventsApi: (...params) => {
      dispatch(getAllIntegrationEventsApiThunk(...params));
    },
    dispatch,
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(BasicIntegerationConfiguration));
