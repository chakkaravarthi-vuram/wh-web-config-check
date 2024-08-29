import React from 'react';
import { connect } from 'react-redux';
import { cloneDeep, isEmpty, get, set, unset } from 'utils/jsUtility';
import { FEATURE_INTEGRATION_STRINGS } from 'containers/integration/Integration.strings';
import { integrationDataChange } from 'redux/reducer/IntegrationReducer';
import cx from 'classnames/bind';
import gClasses from 'scss/Typography.module.scss';
import { useTranslation } from 'react-i18next';
import { BS } from 'utils/UIConstants';
import NoRequestInputs from 'containers/integration/no_request_inputs/NoRequestInputs';
import {
  Checkbox,
  ECheckboxSize,
  ETextSize,
  RadioGroupLayout,
  Text,
} from '@workhall-pvt-lmt/wh-ui-library';
import RequestBody from '../add_event/request_body/RequestBody';
import styles from './EventsList.module.scss';
import ResponseBody from '../add_event/response_body/ResponseBody';
import { generateEventTargetObject } from '../../../../../utils/generatorUtils';
import { INTEGRATION_STRINGS } from '../../../Integration.utils';
import { INTEGRATION_CONSTANTS } from '../../../Integration.constants';

function EventDetails(props) {
  const {
    currentEventDetails,
    isEditView,
    active_event,
    integrationDataChange,
    error_list,
  } = props;
  const { QUERY_PARAMETERS, NO_EVENT_PARAMS, HEADERS } = FEATURE_INTEGRATION_STRINGS;
  const { ADD_EVENT } = INTEGRATION_STRINGS;
  const { t } = useTranslation();

  const getAllParamsAndHeaders = (data = []) => {
    if (data) {
      const clonedParams = cloneDeep(data);
      return clonedParams?.map((currentParam) => (
        <div className={styles.EachParam}>
          <div className={styles.HeaderTitle}>{currentParam?.key}</div>
          {currentParam?.description && (
            <div
              className={cx(gClasses.MT10, styles.Description, gClasses.MR10)}
            >
              {currentParam?.description}
            </div>
          )}
        </div>
      ));
    }
    return null;
  };

  const handleCheckboxChangeHandler = (e) => {
    const activeEvent = cloneDeep(active_event);
    const clonedErrorList = cloneDeep(error_list) || {};

    if (activeEvent[e.target.id]) {
      set(activeEvent, [e.target.id], null);
      unset(activeEvent, [INTEGRATION_CONSTANTS.RESPONSE_BODY]);
    } else {
      set(activeEvent, [e.target.id], e.target.value);
    }

    delete clonedErrorList[e.target.id];

    integrationDataChange({
      active_event: activeEvent,
      error_list: clonedErrorList,
    });
  };

  let responseBodyComponent = null;
  let responseCheckboxComponent = null;

  if (isEditView) {
    responseCheckboxComponent = (
      <Checkbox
        id={ADD_EVENT.RESPONSE_BODY.IS_RESPONSE_BODY.ID}
        size={ECheckboxSize.LG}
        layout={RadioGroupLayout.stack}
        isValueSelected={active_event?.is_response_body}
        details={get(ADD_EVENT.RESPONSE_BODY.IS_RESPONSE_BODY.OPTIONS, 0, {})}
        className={gClasses.MT24}
        onClick={(value) =>
          handleCheckboxChangeHandler(
            generateEventTargetObject(
              ADD_EVENT.RESPONSE_BODY.IS_RESPONSE_BODY.ID,
              value,
            ),
          )
        }
      />
    );
    if (active_event?.is_response_body) {
      responseBodyComponent = <ResponseBody />;
    }
  } else if (!isEmpty(active_event?.response_body)) {
    responseBodyComponent = (
      <ResponseBody
        readOnlyResponseBody={active_event?.response_body}
        isExternalIntegration={!isEditView}
      />
    );
  } else {
    // do nothing
  }

  return (
    <div className={cx(BS.H100, gClasses.PX40)}>
      {isEmpty(currentEventDetails?.headers) &&
      isEmpty(currentEventDetails?.params) &&
      isEmpty(currentEventDetails?.body) &&
      isEmpty(active_event?.response_body) ? (
        <NoRequestInputs
          noDataFoundMessage={t(NO_EVENT_PARAMS.NO_INPUTS_AVAILABLE)}
        />
      ) : (
        <>
          {!isEmpty(currentEventDetails?.headers) && (
            <div>
              <Text size={ETextSize.LG} content={t(HEADERS)} className={gClasses.MB16} />
              {getAllParamsAndHeaders(currentEventDetails?.headers)}
            </div>
          )}
          {!isEmpty(currentEventDetails?.params) && (
            <div className={gClasses.MT20}>
              <Text size={ETextSize.LG} content={t(QUERY_PARAMETERS)} className={gClasses.MB16} />
              {getAllParamsAndHeaders(currentEventDetails?.params)}
            </div>
          )}
          {!isEmpty(currentEventDetails?.body) && (
            <RequestBody
              readOnlyRequestBody={currentEventDetails?.body}
              isExternalIntegration
            />
          )}
          {responseCheckboxComponent}
          {responseBodyComponent}
        </>
      )}
    </div>
  );
}

const mapStateToProps = ({ IntegrationReducer }) => {
  return {
    active_event: IntegrationReducer.active_event,
    error_list: IntegrationReducer.error_list,
  };
};

const mapDispatchToProps = {
  integrationDataChange,
};

export default connect(mapStateToProps, mapDispatchToProps)(EventDetails);
