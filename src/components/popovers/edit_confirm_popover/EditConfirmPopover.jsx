import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { translate } from 'language/config';
import {
  DRAFT_TASK,
  TASKS,
  LIST_DATA_LIST,
  DATALIST_OVERVIEW,
  LIST_FLOW,
  FLOW_OVERVIEW,
  DATALIST_USERS,
  INTEGRATIONS,
  LIST_APPLICATION,
  PUBLISHED_APP_LIST,
} from 'urls/RouteConstants';
import ConfirmationModal from 'components/form_components/confirmation_modal/ConfirmationModal';
import {
  EDIT_ANYWAY_CONNECTOR,
  EDIT_ANYWAY_DATA_LIST,
  EDIT_ANYWAY_FLOW,
  EDIT_ANYWAY_TASK,
} from 'urls/ApiUrls';
import { editAnywayApiThunk } from 'redux/actions/Layout.Action';
import { formPopOverStatusAction } from 'redux/actions/Actions';
import { FORM_POPOVER_STATUS, ROUTE_METHOD } from '../../../utils/Constants';
import { EMPTY_STRING, SOMEONE_IS_EDITING_ERROR } from '../../../utils/strings/CommonStrings';
import { routeNavigate } from '../../../utils/UtilityFunctions';
import { EDIT_ANYWAY_APP, EDIT_ANYWAY_WORKHALL_API_CONFIGURATION, EDIT_ANYWAY_DB_CONNECTOR } from '../../../urls/ApiUrls';
import { EDIT_FLOW, EXTERNAL_INTEGRATION, WORKHALL_INTEGRATION, EXTERNAL_DB_CONNECTION, EDIT_APP, CREATE_APP } from '../../../urls/RouteConstants';

let cancelForEditAnyway;
export const getCancelTokenForEditAnyway = (cancelToken) => {
  cancelForEditAnyway = cancelToken;
};

function EditConfirmPopover(props) {
  const { formPopoverStatus, updateFormPopOverStatus, history, editAnywayApi } =
    props;

  const onConfirmEditClick = () => {
    let apiUrl = EMPTY_STRING;
    switch (formPopoverStatus.type) {
      case 'Flow':
        apiUrl = EDIT_ANYWAY_FLOW;
        break;
      case 'Task':
        apiUrl = EDIT_ANYWAY_TASK;
        break;
      case 'Data List':
        apiUrl = EDIT_ANYWAY_DATA_LIST;
        break;
      case SOMEONE_IS_EDITING_ERROR.INTEGRATION.TYPE:
        apiUrl = EDIT_ANYWAY_CONNECTOR;
        break;
      case SOMEONE_IS_EDITING_ERROR.WORKHALL_API_CONFIGURATION.TYPE:
        apiUrl = EDIT_ANYWAY_WORKHALL_API_CONFIGURATION;
        break;
      case SOMEONE_IS_EDITING_ERROR.EXTERNAL_DB_CONNECTOR.TYPE:
        apiUrl = EDIT_ANYWAY_DB_CONNECTOR;
        break;
      case SOMEONE_IS_EDITING_ERROR.APPLICATION.TYPE:
        apiUrl = EDIT_ANYWAY_APP;
        break;
      default:
    }
    if (cancelForEditAnyway) {
      cancelForEditAnyway();
    }
    editAnywayApi(
      formPopoverStatus.params,
      apiUrl,
      getCancelTokenForEditAnyway,
    );
  };

  useEffect(() => {
    if (formPopoverStatus.enableDirectEditing) {
      onConfirmEditClick();
    }
  }, [formPopoverStatus.enableDirectEditing]);

  const onCancelOrCloseEditConfirmClick = () => {
    const formPopoverStatus = {
      title: EMPTY_STRING,
      subTitle: EMPTY_STRING,
      status: FORM_POPOVER_STATUS.SERVER_ERROR,
      isEditConfirmVisible: false,
      params: {},
    };
    updateFormPopOverStatus(formPopoverStatus);
    if (history.location.pathname.includes(EDIT_FLOW)) {
      const editFlowPathName = LIST_FLOW + FLOW_OVERVIEW;
      routeNavigate(history, ROUTE_METHOD.PUSH, editFlowPathName, null, null);
    }
    if (history.location.pathname.includes('tasks')) {
      const taskPathName = `${TASKS}/${DRAFT_TASK}`;
      routeNavigate(history, ROUTE_METHOD.PUSH, taskPathName, null, null);
    }
    if (history.location.pathname.includes('editDatalist')) {
      if (history.location.state) {
        const { isUsers, dataListUuid } = history.location.state;
        const path = isUsers
          ? `${DATALIST_USERS}/${dataListUuid}`
          : LIST_DATA_LIST + DATALIST_OVERVIEW;
        routeNavigate(history, ROUTE_METHOD.PUSH, path, null, null);
      }
    }
    if (history.location.pathname.includes(INTEGRATIONS)) {
      if (history.location.pathname.includes(EXTERNAL_INTEGRATION)) {
        routeNavigate(history, ROUTE_METHOD.PUSH, `${INTEGRATIONS}/${EXTERNAL_INTEGRATION}`, null, null);
      } else if (history.location.pathname.includes(WORKHALL_INTEGRATION)) {
        routeNavigate(history, ROUTE_METHOD.PUSH, `${INTEGRATIONS}/${WORKHALL_INTEGRATION}`, null, null);
      } else if (history.location.pathname.includes(EXTERNAL_DB_CONNECTION)) {
        routeNavigate(history, ROUTE_METHOD.PUSH, `${INTEGRATIONS}/${EXTERNAL_DB_CONNECTION}`, null, null);
      }
    }
    if (history.location.pathname.includes(EDIT_APP) || history.location.pathname.includes(CREATE_APP)) {
      const editAppPathName = `${LIST_APPLICATION}${PUBLISHED_APP_LIST}`;
      routeNavigate(history, ROUTE_METHOD.PUSH, editAppPathName, null, null);
    }
  };

  return (
    formPopoverStatus.isEditConfirmVisible &&
    !formPopoverStatus.enableDirectEditing && (
      <ConfirmationModal
        isModalOpen={formPopoverStatus.isEditConfirmVisible}
        onConfirmClick={onConfirmEditClick}
        onCancelOrCloseClick={onCancelOrCloseEditConfirmClick}
        titleName={formPopoverStatus.title}
        mainDescription={formPopoverStatus.subTitle}
        secondSubDescription={formPopoverStatus.secondSubTitle}
        subDescription={translate('someone_is_editing_error.continue_editing')}
        confirmationName={translate('someone_is_editing_error.edit_anyway')}
        cancelConfirmationName={translate('someone_is_editing_error.cancel')}
        notShowClose={formPopoverStatus?.notShowClose}
        noClickOutsideAction
      />
    )
  );
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateFormPopOverStatus: (value) => {
      dispatch(formPopOverStatusAction(value));
    },
    editAnywayApi: (params, apiUrl, setCancelToken) => {
      dispatch(editAnywayApiThunk(params, apiUrl, setCancelToken));
    },
  };
};
const mapStateToProps = (state) => {
  return {
    formPopoverStatus: state.FormStatusPopoverReducer.formStatus,
  };
};

EditConfirmPopover.propTypes = {
  formPopoverStatus: PropTypes.objectOf(PropTypes.any).isRequired,
  updateFormPopOverStatus: PropTypes.func.isRequired,
};
export default connect(mapStateToProps, mapDispatchToProps)(EditConfirmPopover);
