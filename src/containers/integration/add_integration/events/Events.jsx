import React, { useEffect, useRef, useState } from 'react';
import cx from 'classnames/bind';
import { connect } from 'react-redux';
import {
  INTEGRATION_STRINGS,
  getEventsReducerData,
} from 'containers/integration/Integration.utils';
import { BS } from 'utils/UIConstants';
import { keydownOrKeypessEnterHandle } from 'utils/UtilityFunctions';
import { integrationDataChange } from 'redux/reducer/IntegrationReducer';
import gClasses from 'scss/Typography.module.scss';
import SearchTab from 'containers/search_tab/SearchTab';
import { cloneDeep, isEmpty, isNaN } from 'utils/jsUtility';
import { useTranslation } from 'react-i18next';
import { v4 as uuidv4 } from 'uuid';
import { EMPTY_STRING } from 'utils/strings/CommonStrings';
import { FEATURE_INTEGRATION_STRINGS } from 'containers/integration/Integration.strings';
import { checkIntegrationDependencyApiThunk } from 'redux/actions/Integration.Action';
import NoSearchResults from 'containers/integration/no_search_results/NoSearchResults';
import { FORM_POPOVER_STATUS } from 'utils/Constants';
import { Button, EButtonSizeType, EButtonType, ETextSize, Text } from '@workhall-pvt-lmt/wh-ui-library';
import EventsList from './events_list/EventsList';
import styles from './Events.module.scss';
import PlusIconNew from '../../../../assets/icons/PlusIconV2';
import SearchNewIcon from '../../../../assets/icons/SearchIconV2';
import NoDataFoundIcon from '../../../../assets/icons/integration/listing/NoDataFoundIcon';
import DependencyHandler from '../../../../components/dependency_handler/DependencyHandler';
import WarningOrangeIcon from '../../../../assets/icons/integration/WarningOrangeIcon';
import { getAllIntegrationEventsApiThunk, integrationRemoveEventApiThunk } from '../../../../redux/actions/Integration.Action';
import { showToastPopover } from '../../../../utils/UtilityFunctions';

let cancelTokenGetAllEvents;

export const getCancelTokenGetAllEvents = (cancelToken) => {
  cancelTokenGetAllEvents = cancelToken;
};

function Events(props) {
  const {
    state,
    state: {
      events = [],
      searchText = EMPTY_STRING,
      error_list = {},
      isExternalIntegration,
      template_id,
      connector_uuid,
      dependencyData,
      eventTobeDeleted,
      isEventDependencyModalVisible,
      isDependencyListLoading,
      isErrorInLoadingDependencyList,
      events_page_size,
      sortField,
      sortBy,
      connector_events_count = 0,
      selected_connector,
      events_total_count,
    },
    integrationDataChange,
    checkIntegrationDependencyApi,
    isEditView,
    integrationRemoveEventApi,
  } = cloneDeep(props);

  const [showSearch, setShowSearch] = useState();

  const eventsContainerRef = useRef();

  const { t } = useTranslation();

  const isExternalTemplate = isExternalIntegration && !isEmpty(template_id);

  const { ADD_EVENT, EVENTS, ADD_EVENT_TEXT } = INTEGRATION_STRINGS;
  const { EVENT_REQUIRED_ERROR, EVENT_DELETED_MESSAGE, EVENT_DEPENDENCY } = FEATURE_INTEGRATION_STRINGS;

  const handleAddEvent = () => {
    if (isExternalTemplate) return;
    integrationDataChange({
      isAddEventVisible: true,
      isEventEdit: false,
      active_event: {
        event_uuid: uuidv4(),
      },
    });
  };
  useEffect(() => () => {
      integrationDataChange({
        searchText: EMPTY_STRING,
      });
    }, []);

  const handleEditEvent = (currentEvent) => {
    integrationDataChange({
      isAddEventVisible: true,
      isEventEdit: true,
      active_event: getEventsReducerData(currentEvent),
    });
  };

  const handleCloseDependency = () => {
    integrationDataChange({
      isEventDependencyModalVisible: false,
      dependencyData: {},
    });
  };

  const getAllEvents = (searchValue, calculatedSize = 0) => {
    const { getAllIntegrationEventsApi } = props;

    if (cancelTokenGetAllEvents) cancelTokenGetAllEvents();

    const params = {
      page: 1,
      size: calculatedSize || events_page_size,
      connector_id: selected_connector,
    };

    if (!isEmpty(searchValue)) {
      params.search = searchValue;
    }

    if (!isEmpty(sortField)) {
      params.sort_field = sortField;
      params.sort_by = sortBy;
    }

    getAllIntegrationEventsApi(params, { connector_uuid }, getCancelTokenGetAllEvents);

    integrationDataChange({
      events_page_size: calculatedSize || events_page_size,
    });
  };

  useEffect(() => {
    if (!isEmpty(selected_connector)) {
      let perPageDataCount = events_page_size;
      const singleCardHeight = 62;
      const containerHeight = eventsContainerRef?.current?.offsetHeight;

      if (containerHeight) {
        perPageDataCount = Math.floor(
          (containerHeight - 100) / singleCardHeight,
        );

        if (perPageDataCount <= 0 || isNaN(perPageDataCount)) perPageDataCount = events_page_size;
      }

      getAllEvents(null, perPageDataCount);
    }
  }, [selected_connector]);

  const handleDeleteFromDependency = async () => {
    const currentEvent = cloneDeep(eventTobeDeleted);

    if (!isEmpty(currentEvent)) {
      try {
        const saveEventPostData = {
          _id: state?.selected_connector,
          connector_uuid: state?.connector_uuid,
          remove_events: [currentEvent?.event_uuid],
        };

        await integrationRemoveEventApi(saveEventPostData, null, t);
        getAllEvents(searchText);
        showToastPopover(t(EVENT_DELETED_MESSAGE.TITLE), EMPTY_STRING, FORM_POPOVER_STATUS.DELETE, true);

        handleCloseDependency();
      } catch (e) {
        console.log(e);
      }
    }
  };

  const handleDeleteEvent = (currentEvent) => {
    if (connector_events_count <= 1) {
      showToastPopover(
        t(EVENT_REQUIRED_ERROR.TITLE),
        t(EVENT_REQUIRED_ERROR.SUBTITLE),
        FORM_POPOVER_STATUS.SERVER_ERROR,
        true,
      );
      showToastPopover(t(EVENT_REQUIRED_ERROR.TITLE), t(EVENT_REQUIRED_ERROR.SUBTITLE), FORM_POPOVER_STATUS.SERVER_ERROR, true);
      return;
    }

    checkIntegrationDependencyApi({
      connector_uuid,
      event_uuid: currentEvent?.event_uuid,
    }, true);

    integrationDataChange({
      eventTobeDeleted: currentEvent,
    });
  };

  const onInputChange = (event) => {
    const {
      target: { value = EMPTY_STRING },
    } = event;
    if (value !== searchText) {
      getAllEvents(value);
      integrationDataChange({
        searchText: value,
      });
    }
    return null;
  };

  const searchTabInput = {
    onChange: onInputChange,
    placeholder: t(ADD_EVENT.EVENT_SEARCH.PLACEHOLDER),
    isVisible: true,
    id: ADD_EVENT.EVENT_SEARCH.ID,
  };

  let searchHeader = null;
  searchHeader = showSearch ? (
    <div className={cx(styles.SearchTab, gClasses.MR16)} onBlur={() => isEmpty(searchText) && setShowSearch(false)}>
      <SearchTab
        input={searchTabInput}
        searchText={searchText}
        inputRefCallback={(inputRef) => inputRef?.current?.focus()}
      />
    </div>
  ) : (
    <button onClick={() => setShowSearch(true)} className={cx(gClasses.MR16)}>
      <SearchNewIcon />
    </button>
  );

  const getApiEvents = () =>
    isEmpty(events) && !isEmpty(searchText) ? (
       <NoSearchResults />
    ) : (
      <EventsList
        eventHeaders={ADD_EVENT.EVENTS_TABLE_HEADERS(t)}
        editEvent={handleEditEvent}
        handleDeleteEvent={handleDeleteEvent}
        events={events}
        stateEvents={events}
        integrationDataChange={integrationDataChange}
        isExternalTemplate={isExternalTemplate}
        isEditView={isEditView}
        eventsContainerRef={eventsContainerRef}
      />
    );

  const eventErrorComponent = (
    <div className={cx(styles.ErrorContainer, gClasses.CenterV, gClasses.MB28, gClasses.DisplayFlex)}>
      <WarningOrangeIcon />
      <div className={cx(styles.ErrorMsg, gClasses.ML8)}>{t(INTEGRATION_STRINGS.EVENT_ERROR_VALUE)}</div>
    </div>
  );

  if (!connector_events_count) {
    return (
      <div className={cx(styles.NoDataEventsContainer, !isEditView ? styles.ViewHeight : styles.EditHeight)}>
        <div
          className={cx(
            BS.D_FLEX,
            BS.FLEX_COLUMN,
            BS.JC_CENTER,
            BS.ALIGN_ITEM_CENTER,
            BS.H100,
          )}
        >
          <NoDataFoundIcon />
          <Text
            content={FEATURE_INTEGRATION_STRINGS.NO_EVENTS_TITLE}
            size={ETextSize.MD}
            className={cx(
              styles.NoEventTitle,
              gClasses.FontWeight500,
              gClasses.MT30,
              gClasses.MB8,
            )}
          />
          <Text
            content={FEATURE_INTEGRATION_STRINGS.NO_EVENTS_SUB_TITLE}
            size={ETextSize.SM}
            className={cx(styles.NoEventSubTitle, gClasses.MB20)}
          />
          {error_list?.events_count && !connector_events_count && eventErrorComponent}
          <Button
            buttonText={FEATURE_INTEGRATION_STRINGS.CREATE_EVENT_TEXT}
            type={EButtonType.PRIMARY}
            size={EButtonSizeType.MD}
            onClickHandler={handleAddEvent}
            icon={<PlusIconNew className={styles.CreateIcon} />}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={cx(styles.EventsContainer, !isEditView ? styles.ViewHeight : styles.EditHeight)}>
      <div className={cx(BS.D_FLEX, BS.JC_BETWEEN, BS.ALIGN_ITEM_CENTER)}>
        <span className={styles.EventTitle}>{`${t(EVENTS.SHOWING)} ${events_total_count} ${t(EVENTS.TITLE)}`}</span>
        <div className={cx(BS.D_FLEX, BS.ALIGN_ITEM_CENTER, styles.ActionHeader)}>
          {searchHeader}
          <div
            tabIndex={0}
            role="button"
            className={cx(BS.D_FLEX, BS.ALIGN_ITEM_CENTER, styles.AddMoreIcon)}
            onKeyDown={(e) => !isExternalTemplate && isEditView && keydownOrKeypessEnterHandle(e) && handleAddEvent()}
            onClick={!isExternalTemplate && isEditView && handleAddEvent}
          >
            {!isExternalTemplate && isEditView && (
                <Button
                  buttonText={t(ADD_EVENT_TEXT)}
                  type={EButtonType.PRIMARY}
                  size={EButtonSizeType.MD}
                />
              )
            }
          </div>
        </div>
      </div>
      <div>{getApiEvents()}</div>
      {
        isEventDependencyModalVisible && (
          <DependencyHandler
            onDeleteClick={handleDeleteFromDependency}
            onCancelDeleteClick={handleCloseDependency}
            dependencyHeaderTitle={t(EVENT_DEPENDENCY.NAME)}
            isDependencyListLoading={isDependencyListLoading}
            dependencyData={dependencyData}
            isErrorInLoadingDependencyList={isErrorInLoadingDependencyList}
          />
        )
      }
    </div>
  );
}

const mapStateToProps = ({ IntegrationReducer }) => {
  return {
    state: IntegrationReducer,
  };
};

const mapDispatchToProps = {
  integrationDataChange,
  checkIntegrationDependencyApi: checkIntegrationDependencyApiThunk,
  integrationRemoveEventApi: integrationRemoveEventApiThunk,
  getAllIntegrationEventsApi: getAllIntegrationEventsApiThunk,
};

export default connect(mapStateToProps, mapDispatchToProps)(Events);
