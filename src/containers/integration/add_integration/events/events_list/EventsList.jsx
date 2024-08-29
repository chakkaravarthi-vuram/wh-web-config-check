import React, { useContext, useState } from 'react';
import cx from 'classnames/bind';
import { BS } from 'utils/UIConstants';
import { connect } from 'react-redux';
import gClasses from 'scss/Typography.module.scss';
import { cloneDeep, isEmpty, set, get, find } from 'utils/jsUtility';
import { useTranslation } from 'react-i18next';
import {
  getEventsReducerData,
  validateAndExtractRelativePathFromEndPoint,
} from 'containers/integration/Integration.utils';
import { FEATURE_INTEGRATION_STRINGS } from 'containers/integration/Integration.strings';
import { keydownOrKeypessEnterHandle, validate } from 'utils/UtilityFunctions';
import EditIconV5 from 'assets/icons/EditIconV5';
import Tooltip from 'components/tooltip/Tooltip';
import {
  BorderRadiusVariant,
  Button,
  ButtonContentVaraint,
  EButtonType,
  Modal,
  ModalSize,
  ModalStyleType,
  PaginationButtonPlacement,
  TableColumnWidthVariant,
  TableSortOrder,
  TableWithPagination,
} from '@workhall-pvt-lmt/wh-ui-library';
import styles from '../Events.module.scss';
import EventDetails from './EventDetails';
import TestConnection from './test_connection/TestConnection';
import { getModifiedRequestBody } from '../add_event/request_body/RequestBody.utils';
import { getIntegrationTestRequestBodyData } from './test_connection/TestConnection.utils';
import { TEST_INTEGRATION_STRINGS } from '../../../Integration.strings';
import Trash from '../../../../../assets/icons/application/Trash';
import CloseVectorIcon from '../../../../../assets/icons/create_app/create_modal/CloseVectorIcon';
import { INTEGRATION_STRINGS, getTemplateEventsPostData } from '../../../Integration.utils';
import { getAllIntegrationEventsApiThunk, postIntegrationConnectorApiThunk } from '../../../../../redux/actions/Integration.Action';
import { eventResponseBodyValidationSchema } from '../../../Integration.validation.schema';
import ThemeContext from '../../../../../hoc/ThemeContext';
import { EMPTY_STRING, OF_TEXT, SHOWING_LABEL } from '../../../../../utils/strings/CommonStrings';
import { SORT_BY } from '../../../../../utils/Constants';

function getRowComponent(paramObject) {
  const {
    handleEdit,
    handleDeleteEvent,
    isExternalTemplate,
    isEditView,
    currentEvent,
    t,
    handleTestConnection,
    colorSchemeDefault,
  } = paramObject;

  const eventName = (
    <span className={cx(styles.EventName, gClasses.Ellipsis)} title={currentEvent?.name}>
      {currentEvent?.name}
    </span>
  );
  const eventCategory = (
    <span className={cx(styles.EventCategory, gClasses.Ellipsis)} title={currentEvent?.category}>{currentEvent?.category}</span>
  );
  const eventMethod = (
    <span className={cx(styles.EventMethod)} title={currentEvent?.method}>{currentEvent?.method}</span>
  );
  const eventEndPoint = (
    <span className={cx(styles.EventEndPoint, gClasses.Ellipsis)} title={currentEvent?.end_point}>
      {currentEvent?.end_point}
    </span>
  );
  const eventEditOrDelete =
    (!isExternalTemplate && isEditView) ? (
      <div
        className={cx(
          BS.D_FLEX,
          BS.JC_END,
          BS.ALIGN_ITEM_CENTER,
          gClasses.Margin0,
        )}
      >
        <Button
          id={TEST_INTEGRATION_STRINGS.TEST_CONNECTION.ID}
          buttonText={t(TEST_INTEGRATION_STRINGS.TEST_CONNECTION.BUTTON_LABEL)}
          type={EButtonType.SECONDARY}
          colorSchema={colorSchemeDefault}
          onClickHandler={(e) => handleTestConnection && handleTestConnection(e, currentEvent)}
          className={gClasses.MR22}
        />
        <div
          role="button"
          tabIndex={0}
          onKeyDown={(e) =>
            keydownOrKeypessEnterHandle(e) &&
            handleEdit &&
            handleEdit(currentEvent)
          }
          onClick={() => handleEdit && handleEdit(currentEvent)}
          className={styles.ActionButtons}
        >
          <EditIconV5 className={styles.EditIcon} />
        </div>
        <div
          onClick={() => handleDeleteEvent && handleDeleteEvent(currentEvent)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) =>
            keydownOrKeypessEnterHandle(e) &&
            handleDeleteEvent &&
            handleDeleteEvent(currentEvent)
          }
          className={styles.ActionButtons}
        >
          <Trash className={cx(styles.DeleteIcon, gClasses.MR8)} />
        </div>
      </div>
    ) : (
      <div
        className={cx(
          BS.D_FLEX,
          BS.JC_END,
          BS.ALIGN_ITEM_CENTER,
          gClasses.Margin0,
        )}
      >
        <div className={styles.ActionButtons}>
          <Button
            id={TEST_INTEGRATION_STRINGS.TEST_CONNECTION.ID}
            buttonText={t(TEST_INTEGRATION_STRINGS.TEST_CONNECTION.BUTTON_LABEL)}
            type={EButtonType.SECONDARY}
            onClickHandler={(e) => handleTestConnection && handleTestConnection(e, currentEvent)}
            className={gClasses.MR22}
            colorSchema={colorSchemeDefault}
          />
        </div>
      </div>
    );

  return {
    id: currentEvent?.event_uuid,
    component: [
      eventName,
      eventCategory,
      eventMethod,
      eventEndPoint,
      eventEditOrDelete,
    ],
  };
}

let cancelTokenGetAllEvents;

export const getCancelTokenGetAllEvents = (cancelToken) => {
  cancelTokenGetAllEvents = cancelToken;
};

function EventsList(props) {
  const {
    events = [],
    eventHeaders = [],
    editEvent,
    integrationDataChange,
    handleDeleteEvent,
    isExternalTemplate,
    isEditView,
    state,
    state: {
      active_event = {},
      connector_uuid,
      events_page_size,
      events_total_count,
      events_current_page,
      searchText = EMPTY_STRING,
      sortField,
      sortBy,
      connector_events_count = 0,
      isEventsLoading,
      selected_connector,
    },
    postIntegrationConnectorApi,
    eventsContainerRef,
  } = props;

  const { colorSchemeDefault } = useContext(ThemeContext);

  const { t } = useTranslation();
  const { ADD_INTEGRATION } = INTEGRATION_STRINGS;

  const [showEventDetails, setShowEventDetails] = useState(false);
  const [eventListHeaders, setEventListHeaders] = useState(eventHeaders);

  const handleTestConnection = (e, currentEvent) => {
    e?.stopPropagation();

    const { relative_path_params } = validateAndExtractRelativePathFromEndPoint(
      currentEvent?.end_point,
      currentEvent?.relative_path || [],
    );
    const modifiedRequestBody = getModifiedRequestBody(currentEvent?.body);

    integrationDataChange({
      isTestConnectionModalVisible: true,
      active_test_event: {
        ...getEventsReducerData(currentEvent),
        body: getIntegrationTestRequestBodyData(modifiedRequestBody),
        relative_path: relative_path_params,
      },
    });
  };

  const getEachEventCategory = () => {
    const clonedEvents = cloneDeep(events);
    return clonedEvents.map((currentEvent) =>
      getRowComponent({
        handleEdit: editEvent,
        handleDeleteEvent,
        isExternalTemplate,
        currentEvent,
        isEditView,
        t,
        handleTestConnection,
        integrationDataChange,
        colorSchemeDefault,
      }),
    );
  };

  const { METHOD, END_POINT } = FEATURE_INTEGRATION_STRINGS;

  const handleCloseClick = () => {
    setShowEventDetails(false);
    integrationDataChange({ active_event: {}, response_error_list: {} });
  };

  const subHeaderContent = (
    <div
      className={cx(BS.D_FLEX, BS.FLEX_COLUMN, BS.ALIGN_ITEMS_END, gClasses.PY20, gClasses.PR15)}
    >
      <button
        onClick={handleCloseClick}
        onKeyDown={(e) =>
          keydownOrKeypessEnterHandle(e) && handleCloseClick()
        }
        className={gClasses.DisplayFlex}
      >
        <CloseVectorIcon
          className={cx(BS.JC_END, gClasses.CursorPointer)}
        />
      </button>
      <div
        className={cx(
          BS.D_FLEX,
          BS.JC_BETWEEN,
          BS.ALIGN_ITEM_CENTER,
          BS.W100,
          styles.EventDetailsHeader,
        )}
      >
        <div
          className={cx(
            gClasses.ModalHeader,
            styles.TitleWrapper,
            gClasses.MR10,
          )}
        >
          {active_event?.name}
        </div>
        <div className={gClasses.MR10}>
          <span className={cx(styles.HeaderTitle)}>{`${t(METHOD)}:`}</span>
          <span className={cx(styles.EventMethod, gClasses.ML6)}>
            {active_event?.method}
          </span>
        </div>
        <div className={cx(styles.TitleWrapper, gClasses.MR10, BS.D_FLEX)}>
          <p id="EndPointID" className={cx(styles.EndPoint)}>
            <span className={cx(styles.HeaderTitle)}>
              {`${t(END_POINT)}: `}
            </span>
            <span>{active_event?.end_point}</span>
          </p>
          <Tooltip
            id="EndPointID"
            content={active_event?.end_point}
            isCustomToolTip
            customInnerClasss={cx(styles.CategoryTooltip)}
            className={styles.EndPointToolTip}
          />
        </div>
      </div>
    </div>
  );

  const getAllEvents = async () => {
    const { getAllIntegrationEventsApi } = props;

    if (cancelTokenGetAllEvents) cancelTokenGetAllEvents();

    const params = {
      page: 1,
      size: events_page_size,
      connector_id: selected_connector,
    };

    if (!isEmpty(searchText)) {
      params.search = searchText;
    }

    if (!isEmpty(sortField)) {
      params.sort_field = sortField;
      params.sort_by = sortBy;
    }

    await getAllIntegrationEventsApi(params, { connector_uuid }, getCancelTokenGetAllEvents);
  };

  const handleSubmitClick = async () => {
    const postData = getTemplateEventsPostData(active_event, true);

    let dataTobeUpdated = {};
    let current_response_error = {};

    if (!isEmpty(active_event?.response_body)) {
      current_response_error = validate(
        active_event?.response_body,
        eventResponseBodyValidationSchema(t),
      );
    }

    if (isEmpty(current_response_error)) {
      try {
        const eventsPostDataObj = [
          {
            event_uuid: active_event?.event_uuid,
          },
        ];

        if (postData?.response_body) {
          set(eventsPostDataObj, [0, 'response_body'], postData?.response_body);
        }

        const saveEventPostData = {
          _id: state?.selected_connector,
          connector_uuid: state?.connector_uuid,
          events: eventsPostDataObj,
        };

        await postIntegrationConnectorApi(saveEventPostData, null, true);
        getAllEvents();

        dataTobeUpdated = {
          isAddEventVisible: false,
          isEventEdit: false,
          active_event: {},
        };

        integrationDataChange({
          error_list: {},
          ...dataTobeUpdated,
        });

        setShowEventDetails(false);
      } catch (e) {
        console.log(e);
      }
      return;
    }

    integrationDataChange({
      response_error_list: current_response_error,
      ...dataTobeUpdated,
    });
  };

  const footerContent = (
    <div
      className={cx(
        BS.D_FLEX,
        BS.JC_END,
        BS.W100,
        BS.ALIGN_ITEM_CENTER,
        gClasses.P24,
      )}
    >
      {
        isEditView && (
          <Button
            id={TEST_INTEGRATION_STRINGS.TEST_CONNECTION.ID}
            buttonText={t(ADD_INTEGRATION.FOOTER.UPDATE)}
            type={EButtonType.PRIMARY}
            onClickHandler={handleSubmitClick}
            className={gClasses.ML16}
            colorSchema={colorSchemeDefault}
          />
        )
      }
    </div>
  );

  const handleMoreClick = (eventId) => {
    if (!isExternalTemplate && isEditView) return;

    setShowEventDetails(true);

    const reducerData = cloneDeep(find(events, (event) => eventId === event?.event_uuid));

    const responseBody = get(reducerData, 'response_body', []);
    const requestBody = get(reducerData, 'body', []);

    if (!isEmpty(responseBody)) {
      reducerData.response_body = getModifiedRequestBody(responseBody);
      reducerData.is_response_body = 1;
    }

    reducerData.body = getModifiedRequestBody(requestBody);

    integrationDataChange({ active_event: reducerData });
  };

  const onPageChange = (page) => {
    const { getAllIntegrationEventsApi } = props;

    if (cancelTokenGetAllEvents) cancelTokenGetAllEvents();

    const params = {
      page,
      size: events_page_size,
      connector_id: selected_connector,
    };

    if (!isEmpty(searchText)) {
      params.search = searchText;
    }

    if (!isEmpty(sortField)) {
      params.sort_field = sortField;
      params.sort_by = sortBy;
    }

    getAllIntegrationEventsApi(params, { connector_uuid }, getCancelTokenGetAllEvents);
  };

  const onSortClick = (sortBy, sortOrder = TableSortOrder.ASC) => {
    const sort_order = (sortOrder === TableSortOrder.ASC) ? SORT_BY.DESC : SORT_BY.ASC;

    const { getAllIntegrationEventsApi } = props;

    if (cancelTokenGetAllEvents) cancelTokenGetAllEvents();

    const params = {
      page: events_current_page,
      size: events_page_size,
      connector_id: selected_connector,
    };

    if (!isEmpty(searchText)) {
      params.search = searchText;
    }

    params.sort_field = sortBy;
    params.sort_by = sort_order;

    getAllIntegrationEventsApi(params, { connector_uuid }, getCancelTokenGetAllEvents);

    const modifiedHeaders = eventListHeaders?.map((currentHeader) => {
      const eachHeader = cloneDeep(currentHeader);

      eachHeader.active = false;

      if (currentHeader?.sortBy === sortBy) {
        eachHeader.sortOrder = sortOrder === TableSortOrder.ASC ? TableSortOrder.DESC : TableSortOrder.ASC;
        eachHeader.active = true;
      }

      return eachHeader;
    });

    integrationDataChange({
      sortField: sortBy,
      sortBy: sort_order,
    });

    setEventListHeaders(modifiedHeaders);
  };

  return (
    <div
      ref={eventsContainerRef}
      className={cx(
        BS.D_FLEX,
        BS.FLEX_COLUMN,
        isEditView
          ? styles.EventsListWrapper
          : styles.ReadOnlyEventsListWrapper,
      )}
    >
      <div className={BS.OVERFLOW_AUTO}>
        {connector_events_count && (
          <TableWithPagination
            isRowClickable
            onRowClick={handleMoreClick}
            header={eventListHeaders}
            data={getEachEventCategory()}
            className={cx(styles.EventsListTable, gClasses.MT17)}
            widthVariant={TableColumnWidthVariant.CUSTOM}
            paginationProps={{
              itemsCountPerPage: events_page_size,
              totalItemsCount: events_total_count,
              activePage: events_current_page,
              prevAndNextButtonContentVariant: ButtonContentVaraint.icon,
              prevAndNextButtonPlacement: PaginationButtonPlacement.connected,
              shape: BorderRadiusVariant.square,
              onChange: (_event, page) => onPageChange(page),
              constructItemsCountMessage: (itemStart, itemEnd, totalCount) =>
                `${t(SHOWING_LABEL)} ${itemStart} - ${itemEnd} ${t(
                  OF_TEXT,
                )} ${totalCount}`,
            }}
            onSortClick={onSortClick}
            isLoading={isEventsLoading}
          />
        )}

        <TestConnection />

        {showEventDetails && (
          <Modal
            id="event_details"
            isModalOpen={showEventDetails}
            customModalClass={styles.AddEventModal}
            modalSize={ModalSize.lg}
            modalStyle={ModalStyleType.modal}
            headerContent={subHeaderContent}
            mainContent={
              <EventDetails
                isEditView={isEditView}
                isExternalTemplate={isExternalTemplate}
                currentEventDetails={active_event}
              />
            }
            footerContent={footerContent}
          />
        )}
      </div>
    </div>
  );
}

const mapStateToProps = ({ IntegrationReducer }) => {
  return {
    state: IntegrationReducer,
  };
};

const mapDispatchToProps = {
  postIntegrationConnectorApi: postIntegrationConnectorApiThunk,
  getAllIntegrationEventsApi: getAllIntegrationEventsApiThunk,
};

export default connect(mapStateToProps, mapDispatchToProps)(EventsList);
