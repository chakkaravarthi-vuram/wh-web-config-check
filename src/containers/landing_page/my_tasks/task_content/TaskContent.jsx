/* eslint-disable array-callback-return */
/* eslint-disable consistent-return */
import React, { Component } from 'react';
// import { v4 as uuidv4 } from 'uuid';
import { withTranslation } from 'react-i18next';
import cloneDeep from 'lodash/cloneDeep';
// import axios from 'axios';
import cx from 'classnames/bind';
import PropTypes from 'prop-types';
import { Row } from 'reactstrap';
import { Prompt, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { BeatLoader, SyncLoader } from 'react-spinners';
import moment from 'moment';
import i18next from 'i18next';
import { ACTION_TYPE } from 'utils/constants/action.constant';
import { getLanguageAndCalendarDataThunk } from 'redux/actions/LanguageAndCalendarAdmin.Action';
import { DATE, MODULE_TYPES, NOTIFICATION_SOCKET_EVENTS } from 'utils/Constants';
import { NavBarDataChange } from 'redux/actions/NavBar.Action';
import { clearApiQueue } from 'redux/reducer/FieldVisiblityReducer';
import { store } from 'Store';
// import { formatValidationData, getEditableFormValidationData, getFieldBasedValidationSectionData } from 'utils/formUtils';
import { isTimeValid } from 'components/form_components/date_picker/DatePicker.utils';
import UpdateConfirmPopover from 'components/update_confirm_popover/UpdateConfirmPopover';
// import { getDmsLinkForPreviewAndDownload, getFieldsForDMS } from 'utils/attachmentUtils';
import Dropdown from 'components/form_components/dropdown/Dropdown';
import { DOWNLOAD_WINDOW_STRINGS } from 'components/download/Download.strings';
import ConditionalWrapper from 'components/conditional_wrapper/ConditionalWrapper';
import { LANDING_PAGE } from 'containers/landing_page/LandingPageTranslation.strings';
import {
  EMPTY_STRING,
  ENTITY,
  DOCUMENT_TYPES,
  // TABLE_ACTION_TYPE,
  // FORM_POPOVER_STRINGS,
} from 'utils/strings/CommonStrings';
import PermissionDeniedIcon from 'assets/icons/PermissionDeniedIcon';
import NoDataFound from 'assets/icons/flow/NoDataFound';
import { Breadcrumb, EButtonType, MultiDropdown, Button as LibraryButton, TextArea, Modal, ModalStyleType, Title, ETitleSize, Text, Size, TextInput, DialogSize, toastPopOver, EToastType, EToastPosition } from '@workhall-pvt-lmt/wh-ui-library';
import ThemeContext from '../../../../hoc/ThemeContext';
import Tab, { TAB_TYPE } from '../../../../components/tab/Tab';
import Button, {
  BUTTON_TYPE,
} from '../../../../components/form_components/button/Button';
import DownloadIcon from '../../../../assets/icons/DownloadIcon';
// import Form from './form/Form';
import FormBuilderLoader from '../../../../components/form_builder/FormBuilderLoader';
import ColumnBarChart from '../../../../components/column_bar_chart/ColumnBarChart';
import ResponseCard from './response_card/ResponseCard';
import IndividualResponseCard from './individual_response_card/IndividualResponseCard';
import TaskResponseTable from '../../../../components/task_summary_components/task_response_table/TaskResponseTable';
import ResponseHandler from '../../../../components/response_handlers/ResponseHandler';
import ModalLayout from '../../../../components/form_components/modal_layout/ModalLayout';
import Alert from '../../../../components/form_components/alert/Alert';
// import TextArea from '../../../../components/form_components/text_area/TextArea';
import ReadOnlyText from '../../../../components/form_components/read_only_text/ReadOnlyText';
import AddMembers from '../../../../components/member_list/add_members/AddMembers';
import CancelTask from './cancel_task/CancelTask';
import AddOrRemoveAssignee from './assigned_to_others/add_or_remove_assignee/AddOrRemoveAssignee';
import RespondantsSummary from './assigned_to_others/respondants_summary/RespondantsSummary';
import gClasses from '../../../../scss/Typography.module.scss';
import styles from './TaskContent.module.scss';
import {
  validate,
  // appendFormDataArrayOrObject,
  // setPointerEvent,
  getUserProfileData,
  getServerErrorMessageObject,
  // getUsersAndTeamsIdList,
  isMobileScreen,
  updateAlertPopverStatus,
  clearAlertPopOverStatus,
  disableAllReadonlyFields,
  getProfileDataForChat,
  handleBlockedNavigation,
  routeNavigate,
  isBasicUserMode,
  getUsersAndTeamsIdList,
} from '../../../../utils/UtilityFunctions';
import {
  isAssigneedToOtherTab,
  getTaskDescription,
  generateTaskContentButton,
  isCompletedTab,
  getAllSearchParams,
  getTabFromUrl,
  // getDocumentMetaData,
  isAssignedToOthersTaskCompleted,
  isSelfTaskTab,
  TASK_CATEGORY_DATALIST_ADHOC_TASK,
  TASK_CATEGORY_FLOW_ADHOC_TASK,
  TASK_CATEGORY_FLOW_TASK,
  getTaskCategory,
  TASK_CATEGORY_ADHOC_TASK,
  getTabFromUrlForBasicUserMode,
} from '../../../../utils/taskContentUtils';
import jsUtils, {
  isEmpty,
  nullCheck,
  // set,
  // unset,
  get,
  // includes,
  // find,
  union,
  isObjectFieldsEmpty,
  has,
  // isObject,
  safeTrim,
  // isFiniteNumber,
  isBoolean,
  // isString,
  capitalizeEachFirstLetter,
} from '../../../../utils/jsUtility';

import {
  adhocCommentsSchema,
  // constructSchemaFromData,
  // getTableUniqueColumnMessage,
  // getUserTeamPickerMinMaxErrors,
  nonFormValidateSchema,
  // testBedValidateSchema,
} from './TaskContent.validation.schema';

import {
  submitTaskApiThunk,
  getTaskDetailsApiThunk,
  getSignedUrlApiThunk,
  taskContentDataChange,
  clearTaskContentData,
  hideTaskListCompleted,
  getTaskCompletedAssigneesApiThunk,
  taskListDataChange,
  getTaskResponseSummaryApiThunk,
  clearTaskResponseSummaryData,
  getTaskFormDetailsApiThunk,
  getTaskMetadataApiThunk,
  getFieldVisibilityListApiThunk,
  clearAddOrRemoveAssigneeDataAction,
  setAddOrRemoveAssigneeDataAction,
  getAllInstancesByTaskMetadataUuidApiAction,
  nudgeTaskApiAction,
  getExportTaskDetailsThunk,
  updateActiveTaskDetailsApiAction,
  replicateTaskApiThunk,
  snoozeTaskApiThunk,
  postUpdateApiThunk,
  setReassignTaskActionThunk,
  postUpdateTaskStatus,
  postRejectTask,
  setSelectedAssigneeData,
  activeTaskDataChange,
} from '../../../../redux/actions/TaskActions';

import { cancelSubmitTask } from '../../../../axios/apiService/task.apiService';
import { ADD_OR_REMOVE_ASSIGNEE_STRINGS } from './assigned_to_others/add_or_remove_assignee/AddOrRemoveAssignee.strings';

import {
  TASK_CONTENT_STRINGS,
  TASK_TAB_INDEX,
  CONTENT_TAB_INDEX,
  TASK_STATUS_TYPES,
} from '../../LandingPage.strings';

import { BS, DEFAULT_COLORS_CONSTANTS, COLOR_CONSTANTS, ARIA_ROLES } from '../../../../utils/UIConstants';
import {
  // FILE_UPLOAD_STATUS,
  // FORM_POPOVER_STATUS,
  NON_PRIVATE_TEAM_TYPES,
  RESPONSE_TYPE,
  ROUTE_METHOD,
  UTIL_COLOR,
} from '../../../../utils/Constants';
import { COMPLETED_TASKS, TASKS, FLOW_DASHBOARD, DATA_LIST_DASHBOARD, TEST_BED, SIGNIN } from '../../../../urls/RouteConstants';
import {
  // FIELD_LIST_KEYS,
  // FIELD_LIST_TYPE,
  // FIELD_TYPE,
} from '../../../../utils/constants/form.constant';
// import { DEFAULT_CURRENCY_TYPE } from '../../../../utils/constants/currency.constant';
import {
  getStateVariables,
  // getTaskSubmissionData,
  onReviewersRemoveHandler,
  onReviewersSearchHandler,
  onReviewersSelectHandler,
  getActiveTaskDetail,
  getTaskBasicDetails,
  getFlowNavLinkInfo,
  getDatalistNavLinkInfo,
  onPrecedingStepsChangeHandler,
  validateInvalidReviewers,
  TASK_NO_ACCESS,
  TASK_NOT_EXIST,
  getIsFlowBasedTask,
  TASK_UNAUTHORIZED,
  ARIA_LABEL,
} from './TaskContent.utils';
// import { calculateProgressPercentage } from '../../../../utils/loaderUtils';
import {
  CHART_RESPONSE_SUMMARY,
  TABLE_RESPONSE_SUMMARY,
  VALID_RESPONSE_CHART_FIELDS,
  VALID_RESPONSE_TABLE_FIELDS,
} from '../../../../utils/constants/taskContent.constant';
import { getAccountConfigurationDetailsApiService } from '../../../../axios/apiService/accountConfigurationDetailsAdmin.apiService';
import TaskReferenceAttachments from './task_reference_documents/TaskReferenceAttachments';
import { RESPONDANTS_SUMMARY_STRINGS } from './assigned_to_others/respondants_summary/RespondantsSummary.strings';
import TaskHeader from './task_header/TaskHeader';
import LastActivity from './task_header/last_activity/LastActivity';
import TaskHistoryModal from './task_history/TaskHistoryModal';
import TaskAcceptReject from './task_header/task_accept_reject/TaskAcceptReject';
import AlertCircle from '../../../../assets/icons/application/AlertCircle';
import { getFileUrl } from '../../../../utils/attachmentUtils';
import Form from '../../../form/Form';
import { FORM_TYPE } from '../../../form/Form.string';
import { getSchemaForFormData } from '../../../form/editable_form/EditableFrom.schema';
import { formatFormData, formatFormDataForSubmit, getFormattedDocumentDetails } from '../../../form/editable_form/EditableForm.utils';
import { ALLOW_COMMENTS, FORM_ACTION_TYPES } from '../../../form/form_builder/form_footer/FormFooter.constant';
import { CANCEL_MESSAGE } from '../../../../utils/constants/action.constant';
import { UNAUTHORIZED_CONTEXT } from '../../../../utils/ServerConstants';
import ResponseHandlerIcon from '../../../../assets/icons/response_status_handler/ResponseHandlerIcon';
import CloseIconNew from '../../../../assets/icons/CloseIconNew';

let cancelForGetTaskDetails;
// let cancelForFieldVisibilityList;

export const getCancelTokenTaskDetails = (cancelToken) => {
  cancelForGetTaskDetails = cancelToken;
};

// export const getCnacelTokenFieldVisibilityList = (cancelToken) => {
//   cancelForFieldVisibilityList = cancelToken;
// };

let cancelForGetAllInstancesByTaskMetadataUuid;

export const cancelTokenForGetAllInstancesByTaskMetadataUuid = (
  cancelToken,
) => {
  cancelForGetAllInstancesByTaskMetadataUuid = cancelToken;
};

class TaskContent extends Component {
  constructor(props) {
    super(props);
    this.currentComponentCompRef = React.createRef();
    this.buttonContainerCompRef = React.createRef();
    this.containerCompRef = React.createRef();
    this.state = {
      userProfileData: {},
      blockNavigation: true,
      isMobile: isMobileScreen(),
      snoozeDateTime: EMPTY_STRING,
      snoozeErrorMessage: EMPTY_STRING,
      snoozeComments: EMPTY_STRING,
      isSendBackReviewModalOpen: false,
      sendBackReviewComments: null,
      dynamicValidation: false,
      isCommentsModalOpen: false,
      // fileUploadsFieldsInProgress: [],
    };
  }

  componentDidMount() {
    let listHeight = 0;
    if (this?.containerCompRef?.current && this?.buttonContainerCompRef?.current) {
      listHeight =
        this.containerCompRef.current.clientHeight -
        (this.buttonContainerCompRef.current.clientHeight || 64);
    }
    if (
      this?.currentComponentCompRef?.current?.style
    ) {
      this.currentComponentCompRef.current.style.height = `${listHeight - 1000}px`; // 60px hardcoded assign to a dynamic variable(subtracting footer height)
    }
    const { id, location, dispatch } = this.props;
    this.calculateListSize();
    if (!isAssigneedToOtherTab(getTabFromUrl(location.pathname), location.pathname)) {
      getAccountConfigurationDetailsApiService().then((response) => {
        this.setState({ userProfileData: response });
      });
    }

    dispatch(
      taskListDataChange({
        selectedCardTab: Number(getTabFromUrl(location.pathname)),
      }),
    );
    if (isAssigneedToOtherTab(getTabFromUrl(location.pathname), location.pathname)) {
      dispatch(
        taskContentDataChange({
          initialLoading: true,
        }),
      );
      this.getTaskMetaData(id);
    } else {
      this.getTaskDetails(id);
    }
    const { getLanguageAndCalendarData } = this.props;
    if (!isAssigneedToOtherTab(getTabFromUrl(location.pathname), location.pathname)) getLanguageAndCalendarData();
  }

  componentDidUpdate(prevProps) {
    const { history } = this.props;
    const { blockNavigation } = this.state;
    if (history?.location?.state?.taskUuid && !blockNavigation) {
      this.setState({ blockNavigation: true });
      if (history?.location?.state?.taskUuid) {
        const { location } = cloneDeep(history);
        delete location?.state?.taskUuid;
        routeNavigate(history, ROUTE_METHOD.REPLACE, location?.pathname, location?.search, location?.state);
      }
    }
    let listHeight = 0;
    if (this.containerCompRef.current && this.buttonContainerCompRef.current) {
      listHeight =
        this.containerCompRef.current.clientHeight -
        (this.buttonContainerCompRef.current.clientHeight || 64);
    }
    if (
      this?.currentComponentCompRef?.current?.style
    ) {
      this.currentComponentCompRef.current.style.height = `${listHeight - 1000}px`; // 60px hardcoded assign to a dynamic variable(subtracting footer height)
    }
    const {
      id,
      clearState,
      state,
      individualResponseSelectedValue,
      isCompletedAssigneesLoading,
      location,
      selectedCardTab,
      dispatch,
      assigneesCount,
      isRefresh,
      getTaskResponseSummaryApi,
      taskListTabIndex,
      getTaskFormDetailsApi,
      taskMetadataUUID,
    } = this.props;
    const { taskMetadata, isTaskDataLoading } = state;
    let refresh = false;
    const searchParams = getAllSearchParams(
      new URLSearchParams(location.search),
    );
    if (
      isAssigneedToOtherTab(getTabFromUrl(location.pathname), location.pathname) &&
      !isTaskDataLoading &&
      jsUtils.has(taskMetadata, [TASK_CONTENT_STRINGS.TASK_INFO.TOTAL_TASKS]) &&
      prevProps.assigneesCount !== assigneesCount
    ) {
      if (assigneesCount > 1) {
        dispatch(
          taskContentDataChange({
            tab_index: CONTENT_TAB_INDEX.RESPONSE_SUMMARY,
          }),
        );
      } else {
        dispatch(
          taskContentDataChange({
            tab_index: CONTENT_TAB_INDEX.TASK_SUMMARY,
          }),
        );
      }
    }
    if (prevProps.isRefresh !== isRefresh) {
      if (
        isAssigneedToOtherTab(selectedCardTab, location.pathname) &&
        isAssigneedToOtherTab(taskListTabIndex, location.pathname)
      ) {
        refresh = true;
      }
    }
    if (id && prevProps.id === id && !isTaskDataLoading) {
      if (
        refresh &&
        (state.tab_index === CONTENT_TAB_INDEX.INDIVIDUAL_RESPONSES ||
          state.tab_index === CONTENT_TAB_INDEX.TASK_SUMMARY ||
          state.tab_index === CONTENT_TAB_INDEX.RESPONSE_SUMMARY ||
          state.tab_index === CONTENT_TAB_INDEX.TASK_DETAIL)
      ) {
        dispatch(taskContentDataChange({ initialLoading: true }));
      }
      if (
        ((prevProps.state.tab_index !==
          CONTENT_TAB_INDEX.INDIVIDUAL_RESPONSES ||
          refresh) &&
          state.tab_index === CONTENT_TAB_INDEX.INDIVIDUAL_RESPONSES) ||
        ((prevProps.state.tab_index !== CONTENT_TAB_INDEX.TASK_SUMMARY ||
          refresh) &&
          state.tab_index === CONTENT_TAB_INDEX.TASK_SUMMARY)
      ) {
        if (refresh) this.getTaskMetaData(id);
        this.getTaskCompletedAssignees(
          searchParams.uuid || taskMetadataUUID,
          refresh,
        );
      } else if (
        prevProps.isCompletedAssigneesLoading === isCompletedAssigneesLoading &&
        state.tab_index === CONTENT_TAB_INDEX.INDIVIDUAL_RESPONSES &&
        prevProps.individualResponseSelectedValue !==
        individualResponseSelectedValue
      ) {
        this.getTaskDetails(individualResponseSelectedValue, true);
      } else if (
        (prevProps.state.tab_index !== CONTENT_TAB_INDEX.RESPONSE_SUMMARY ||
          refresh) &&
        state.tab_index === CONTENT_TAB_INDEX.RESPONSE_SUMMARY
      ) {
        if (refresh) this.getTaskMetaData(id);
        getTaskResponseSummaryApi({
          task_metadata_uuid: searchParams.uuid || taskMetadataUUID,
        });
        this.callGetAllInstancesByTaskMetadataUuidApi();
      } else if (state.tab_index === CONTENT_TAB_INDEX.TASK_DETAIL && refresh) {
        if (refresh) this.getTaskMetaData(id);
        getTaskFormDetailsApi({ task_metadata_id: id });
      }
    } else if (id && prevProps.id !== id) {
      clearState();
      if (isAssigneedToOtherTab(selectedCardTab, location.pathname)) {
        dispatch(taskContentDataChange({ initialLoading: true }));
        this.getTaskMetaData(id);
      } else {
        console.log('callgettaskdetails 3');
        this.getTaskDetails(id);
      }
    }

    const { state: { active_task_details: { task_log_info } } } = this.props;
    const { state: { active_task_details: { task_log_info: prev_task_log_info } } } = prevProps;
    if (prev_task_log_info.show_accept_reject !== task_log_info.show_accept_reject) {
      setTimeout(() => {
        disableAllReadonlyFields('task_input_content', task_log_info.show_accept_reject);
      }, '1');
    }
  }

  async componentWillUnmount() {
    const { clearState, hideTaskListComplete } = this.props;
    const { hideTaskList, clearVisibilityApiQueue } = this.props;
    clearState();
    clearVisibilityApiQueue();
    if (hideTaskList) {
      hideTaskListComplete();
    }
    cancelSubmitTask();
    if (cancelForGetTaskDetails) cancelForGetTaskDetails();
  }

  render() {
    const {
      isBasicUser,
      id,
      state,
      assigneesCount,
      cancelledCount,
      selectedCardTab,
      isCompletedAssigneesLoading,
      completedAssignees,
      individualResponseSelectedValue,
      location,
      isResponseCardDataLoading,
      history,
      dispatch,
      onTaskSuccessfulSubmit,
      completedAssigneesDocumentUrlDetails,
      setAddOrRemoveAssigneeData,
      toggleModal,
      isAddOrRemoveAssigneeModalVisible,
      allInstances,
      nudgeTaskApiCall,
      taskMetadataUUID,
      respondantsSummary,
      navigationLink,
      referenceId,
      onCloseIconClick,
      snoozeTaskApi,
      getAssignedTaskList,
      assign_to_others,
      show_reassign,
      individualResponseSelectedInstanceId,
      taskAssignee,
      selectedTestAssignee,
      initialBreadCrumbList = [],
      setState,
      onUpdateTaskStatus,
      onRejectTask,
      setSelectedAssigneeData,
      isShowAppTasks,
    } = this.props;

    // color schema based on user mode
    const tabIndex = isBasicUserMode({ location }) ? getTabFromUrlForBasicUserMode(location.pathname) : getTabFromUrl(location.pathname);
    const { colorScheme, colorSchemeDefault } = this.context;
    const customBg = isBasicUser ? colorScheme?.appBg : colorSchemeDefault?.appBg;
    const widgetBg = isBasicUser ? colorScheme?.widgetBg : colorSchemeDefault?.widgetBg;
    const { isMobile, snoozeErrorMessage, snoozeDateTime, snoozeComments, snoozeCommentErrorMessage,
      isSendBackReviewModalOpen, sendBackReviewComments, dynamicValidation, userProfileData } = this.state;
    const metadata_info = jsUtils.get(state, [
      TASK_CONTENT_STRINGS.TASK_INFO.ACTIVE_TASK_DETAILS,
      TASK_CONTENT_STRINGS.TASK_INFO.METADATA_INFO,
    ]);
    const {
      is_buttons_enabled,
      common_server_error,
      active_task_details: { task_log_info },
      active_task_details,
      active_form_content,
      // document_url_details,
      action = {},
      isTaskDataLoading,
      tab_index,
      isTaskHistoryModalOpen,
      isShowLatestActivity = true,
      taskResponseSummary,
      assignee_task_details,
      isTaskResponseSummaryLoading,
      taskFormDetails,
      isTaskFormDetailsLoading,
      taskMetadata,
      initialLoading,
      initialCompletedAssigneesLoading,
      precedingStepsList,
      send_back_task_id,
      send_back_task_steps = [],
      isCommentPosted,
      latest_action_history = {},
    } = state;
    const isAcceptReject = jsUtils.get(active_task_details, [TASK_CONTENT_STRINGS.TASK_INFO.TASKS_LOG_INFO, 'show_accept_reject']);
    const pref_locale = localStorage.getItem('application_language');
    const userDetails = getUserProfileData();
    const isAcceptedTask = jsUtils.get(active_task_details, [TASK_CONTENT_STRINGS.TASK_INFO.TASKS_LOG_INFO, 'accepted_by', '_id']) === userDetails.id;
    const { is_test_bed_task } = task_log_info;
    const { t } = this.props;
    const isTestBed = is_test_bed_task;
    let isTaskAlreadyAcceptedByOthers = false;

    const searchParams = getAllSearchParams(
      new URLSearchParams(location.search),
    );
    const isFlowBasedTask = getIsFlowBasedTask(active_task_details);

    const activeTaskInfo = jsUtils.get(active_task_details, [TASK_CONTENT_STRINGS.TASK_INFO.TASKS_LOG_INFO, TASK_CONTENT_STRINGS.TASK_INFO.TASK_STATUS]);
    const taskLogId = jsUtils.get(active_task_details, [TASK_CONTENT_STRINGS.TASK_INFO.TASKS_LOG_INFO, '_id']);
    const isCompletedTask = activeTaskInfo === TASK_STATUS_TYPES.COMPLETED;
    const isCancelledTask = activeTaskInfo === TASK_STATUS_TYPES.CANCELLED;
    const is_initiated_task = jsUtils.get(active_task_details.metadata_info, [
      TASK_CONTENT_STRINGS.TASK_INFO.IS_INITIATION_TASK,
    ]);
    const comment = jsUtils.get(active_task_details, [
      TASK_CONTENT_STRINGS.TASK_INFO.ACTIVE_TASK_DETAILS,
      TASK_CONTENT_STRINGS.TASK_COMMENTS.ID,
    ]);
    const attachments = jsUtils.get(active_task_details, [
      TASK_CONTENT_STRINGS.TASK_INFO.ACTIVE_TASK_DETAILS,
      TASK_CONTENT_STRINGS.TASK_INFO.ATTACHMENTS,
    ]);
    const { taskName } = getTaskBasicDetails(taskMetadata, selectedCardTab, active_task_details, isTaskDataLoading || initialLoading);

    const taskDescription = getTaskDescription(
      taskMetadata,
      active_task_details,
      isTaskDataLoading || initialLoading,
      selectedCardTab,
    )[0];
    const ICON_STRINGS = {
      DOWNLOAD: 'Download',
      EDIT_ASSIGNEES: LANDING_PAGE.EDIT_ASSIGNEES_TITLE,
      SNOOZE: 'Snooze',
      DUPLICATE: LANDING_PAGE.DUPLICATE_TASK_TITLE,
    };

    const showNavigationLink = () => navigationLink && referenceId;

    let addOrRemoveAssigneeModal = null;

    if (isAssigneedToOtherTab(selectedCardTab, location.pathname)) {
      toggleModal({ isModalOpen: true });
      addOrRemoveAssigneeModal = (
        <ModalLayout
          id={id}
          isModalOpen={isAddOrRemoveAssigneeModalVisible}
          onCloseClick={() => {
            setAddOrRemoveAssigneeData('isModalVisible', false);
          }}
          mainContent={(
            <AddOrRemoveAssignee
              getAssignedTaskList={getAssignedTaskList}
            />
          )}
          headerClassName={styles.ModalHeader}
          mainContentClassName={styles.ModalContent}
          headerContent={(
            <div className={styles.ModalHeaderContainer}>
              <div className={styles.ModalHeaderContent}>
                <div className={gClasses.ModalHeader}>
                  {ADD_OR_REMOVE_ASSIGNEE_STRINGS(t).TITLE}
                </div>
                <div className={gClasses.FOne13GrayV9}>
                  {ADD_OR_REMOVE_ASSIGNEE_STRINGS(t).SUB_TITLE}
                </div>
              </div>
            </div>
          )}
        />
      );
    }

    const taskActionOptionList = [];

    if (
      nullCheck(
        active_task_details,
        'form_metadata.actions.action_details.length',
        true,
      )
    ) {
      const button_visibility = get(state.activeTask, ['formMetaData', 'buttonVisibility'], {});
      state.activeTask.actions.forEach(
        (eachAction) => {
          taskActionOptionList.push({
            label: eachAction.action_name,
            value: eachAction.action_name,
            type: eachAction.action_type,
            action_uuid: eachAction.action_uuid,
            allow_comments: eachAction.allow_comments,
            isVisible: this.isActionButtonVisible(eachAction, button_visibility),
            systemButton: eachAction?.type === 'system',
            translation_data: eachAction?.translation_data || {},
            isSystemAction: eachAction.type === ACTION_TYPE.SYSTEM,
          });
        },
      );
    }

    let save_and_cancel_buttons = null;

    save_and_cancel_buttons = generateTaskContentButton(
      is_buttons_enabled,
      active_task_details,
      isTaskDataLoading || initialLoading,
      this.updateTaskDetails, // reset action on clicking save
      taskActionOptionList,
      is_initiated_task,
      this.buttonClickHandler,
      isTestBed,
      i18next.t,
      isBasicUser ? colorScheme : colorSchemeDefault,
    );

    const formLoader = (
      <div className={cx(gClasses.MT20, gClasses.M24)}>
        <FormBuilderLoader />
      </div>
    );

    // let formVisibility = null;
    if (nullCheck(active_task_details, TASK_CONTENT_STRINGS.TASK_INFO.FORM_METADATA_FIELDS)) {
      // formVisibility = active_task_details.form_metadata.fields.form_visibility;
    }
    let formComponent = formLoader;
    let taskActionLabel = null;
    let tabList = null;

    const downloadButton = (
      <Button
        buttonType={BUTTON_TYPE.SECONDARY}
        onClick={this.onClickDownloadCheckPrompt}
      >
        <div className={cx(BS.D_FLEX, gClasses.CenterVH)}>
          <DownloadIcon className={styles.DownloadIcon} role={ARIA_ROLES.IMG} ariaHidden ariaLabel={ICON_STRINGS.DOWNLOAD} />
          <div className={cx(gClasses.ML5)}>
            {RESPONDANTS_SUMMARY_STRINGS.DOWNLOAD_BUTTON(t).LABEL}
          </div>
        </div>
      </Button>
    );

    // error response handler
    if (
      !isTaskDataLoading &&
      jsUtils.isEmpty(active_task_details.task_log_info) &&
      jsUtils.isEmpty(taskMetadata)
    ) {
      if (jsUtils.has(common_server_error, [0, TASK_CONTENT_STRINGS.TASK_INFO.TYPE])) {
        console.log('ERROTS 0');
        return (
          <ResponseHandler
            isTask
            onCloseIconClick={onCloseIconClick}
            className={gClasses.MT50}
            messageObject={TASK_CONTENT_STRINGS.TASK_NOT_FOUND(i18next.t)}
          />
        );
      }
      if (!isEmpty(common_server_error) && (!isEmpty(getServerErrorMessageObject(common_server_error, [], null, t)))) {
        let messageObject = getServerErrorMessageObject(common_server_error, [], null, t);
        let messageIcon = null;
        if (common_server_error === UNAUTHORIZED_CONTEXT.TASK) {
          // messageObject = {
          //   title: TASK_UNAUTHORIZED(t).title,
          //   subTitle: TASK_UNAUTHORIZED(t).subTitle,
          //   type: RESPONSE_TYPE.SERVER_ERROR,
          // };
          return (
            <Modal
                id="unauthorized"
                modalStyle={ModalStyleType.dialog}
                dialogSize={DialogSize.lg}
                isModalOpen
                customModalClass={styles.TaskUnauthorized}
                mainContentClassName={gClasses.P24}
                mainContent={(
                <div>
                  <div className={cx(BS.D_FLEX, BS.JC_END, gClasses.MB8, BS.W100)}>
                    <button onClick={() => onCloseIconClick()}>
                      <CloseIconNew />
                    </button>
                  </div>
                  <div className={cx(BS.TEXT_CENTER)}>
                    <ResponseHandlerIcon
                      height={60}
                      width={60}
                      role={ARIA_ROLES.IMG}
                      ariaLabel={ARIA_LABEL.UNAUTHORIZED}
                      type={RESPONSE_TYPE.SERVER_ERROR}
                    />
                    <div className={cx(gClasses.FTwo18BlackV4, gClasses.FontWeight500, gClasses.MT20)}>
                      {TASK_UNAUTHORIZED(t).title}
                    </div>
                    <div className={cx(gClasses.FOne13GrayV17, gClasses.MT5)}>
                      {TASK_UNAUTHORIZED(t).subTitle}
                    </div>
                  </div>
                </div>
              )}
            />
          );
        } else if (common_server_error === TASK_NO_ACCESS(t).type) {
          messageObject = {
            title: TASK_NO_ACCESS(t).title,
            subTitle: TASK_NO_ACCESS(t).subTitle,
            type: RESPONSE_TYPE.SERVER_ERROR,
          };
          messageIcon = PermissionDeniedIcon;
        } else if (common_server_error === TASK_NOT_EXIST(t).type) {
          messageObject = {
            title: TASK_NOT_EXIST(t).title,
            type: RESPONSE_TYPE.SERVER_ERROR,
          };
          messageIcon = NoDataFound;
        }

        return (
          <ResponseHandler
            customResponseIcon={messageIcon}
            onCloseIconClick={onCloseIconClick}
            className={gClasses.MT50}
            messageObject={messageObject}
          />
        );
      }
      return null;
    }
    const taskReferenceDocumentsAttach = this.getTaskReferenceDocuments(state.active_task_details.task_log_info);
    if (
      isAssigneedToOtherTab(selectedCardTab, location.pathname) &&
      !isTaskDataLoading &&
      !initialLoading
    ) {
      if (assigneesCount > 1) tabList = TASK_CONTENT_STRINGS.MULTIPLE_TASK_ASSIGNED_TO_OTHERS_CONTENT_TAB(i18next.t);
      else tabList = TASK_CONTENT_STRINGS.SINGLE_TASK_ASSIGNED_TO_OTHERS_CONTENT_TAB(i18next.t);
    } else tabList = TASK_CONTENT_STRINGS.TASK_CONTENT_TAB(i18next.t);

    if (!isTaskDataLoading && !initialLoading) {
      if (!jsUtils.isEmpty(taskReferenceDocumentsAttach)) {
        taskActionLabel = (
          <div
            className={cx(
              gClasses.SectionSubTitle,
            )}
          >
            {!jsUtils.isEmpty(taskReferenceDocumentsAttach) ? i18next.t(TASK_CONTENT_STRINGS.TASK_ACTION.LABEL_ATTACHMENTS) : null}
          </div>
        );
      }

      // const { userProfileData } = this.state;

      const formType = isCompletedTask ? FORM_TYPE.READONLY_FORM : FORM_TYPE.EDITABLE_FORM;
      const {
        metaData,
        sections = [],
        fields = {},
        activeFormData = {},
        // formVisibility = {},
        formMetaData = {},
        errorList = {},
        documentDetails = {},
        showSectionName = false,
        refUuid = EMPTY_STRING,
        informationFieldFormContent,
      } = state.activeTask || {};
      if (
        !jsUtils.isEmpty(active_task_details.task_log_info) &&
        !active_task_details.task_log_info.show_accept_reject &&
        active_task_details.task_log_info.accepted_by &&
        userDetails &&
        userDetails.id === active_task_details.task_log_info.accepted_by._id
      ) {
        formComponent = (
          <Form
            moduleType={MODULE_TYPES.TASK}
            formType={formType}
            metaData={{ ...metaData, refUuid: refUuid }}
            sections={sections}
            fields={fields}
            activeFormData={activeFormData}
            informationFieldFormContent={informationFieldFormContent}
            onFormFillUpdate={this.onFormFillUpdate}
            onValidateField={() => {}}
            errorList={errorList}
            formVisibility={formMetaData.formVisibility}
            formMetaData={formMetaData}
            documentDetails={documentDetails}
            showSectionName={showSectionName}
            dynamicValidation={dynamicValidation}
            userProfileData={userProfileData}
          />
        );

        // formComponent = (
        //   <div>
        //     <Form
        //       active_task_details={active_task_details}
        //       document_url_details={document_url_details}
        //       isCompletedForm={isCompletedTask}
        //       onChangeHandler={this.onChangeHandler}
        //       stateData={{
        //         ...jsUtils.pick(state, [TASK_CONTENT_STRINGS.TASK_INFO.ACTIVE_TASK_DETAILS, TASK_CONTENT_STRINGS.TASK_INFO.ERROR_LIST]),
        //         ...state.formUploadData,
        //       }}
        //       onDeleteFileClick={this.deleteUploadedFiles}
        //       onRetryFileUploadClick={this.onRetryFileUpload}
        //       onTableAddOrDeleteRowClick={this.onTableAddOrDeleteRowClick}
        //       formVisibility={formVisibility}
        //       userDetails={userProfileData}
        //     />
        //   </div>
        // );
      } else if (active_task_details.task_log_info.show_accept_reject) {
        // Need to blur out form since task is neither accepted nor rejected
        // formComponent = active_task_details.metadata_info.collect_data && (
        formComponent = (
          <div>
            <Form
              moduleType={MODULE_TYPES.TASK}
              formType={formType}
              metaData={{ ...metaData, refUuid: refUuid }}
              sections={sections}
              fields={fields}
              activeFormData={activeFormData}
              informationFieldFormContent={informationFieldFormContent}
              onFormFillUpdate={this.onFormFillUpdate}
              onValidateField={() => {}}
              errorList={errorList}
              formVisibility={formMetaData.formVisibility}
              formMetaData={formMetaData}
              documentDetails={documentDetails}
              showSectionName={showSectionName}
              dynamicValidation={dynamicValidation}
              userProfileData={userProfileData}
            />
          </div>
        );
        const { show_accept_reject } = this.props;
        if (show_accept_reject) save_and_cancel_buttons = null;
      } else {
        // UI to show task already accepted or rejected
        isTaskAlreadyAcceptedByOthers = true;
        formComponent = (
          <Alert
            content={i18next.t(TASK_CONTENT_STRINGS.TASK_INFO.TASK_ALREADY_ACCEPTED)}
            className={cx(gClasses.MB20, gClasses.MT20, BS.BORDER_0)}
          />
        );
        save_and_cancel_buttons = null;
      }
    }
    let task_name = taskName.length > 30 ? taskName.substring(0, 30) : taskName;
    if (isTestBed) task_name = `${taskName} - ${t(TASK_CONTENT_STRINGS.TASK_INFO.TEST_TASK)}`;
    const breadCrumbClassName = cx(styles.BreadCrumb, taskName.length > 30 && styles.BreadCrumbEllipsis);
    const breadCrumbItemClassName = isTestBed ? styles.TestBedTaskName : undefined;
    const breadcrumbList = [
      ...initialBreadCrumbList,
      { text: task_name, itemClassName: breadCrumbItemClassName, isText: true, className: breadCrumbClassName },
    ];

    let tabsView = null;
    let taskActionContent = null;
    console.log('sjhvfhajbsfj', {
      isFlowBasedTask,
      isCompletedTask,
      assigned: !isAssigneedToOtherTab(selectedCardTab, location.pathname),
      tab_index,
      CONTENT_TAB_INDEX,
    });
    if (isFlowBasedTask) {
      if (isCompletedTask) {
        taskActionContent = (
          <>
            <ReadOnlyText
              value={active_task_details.active_task_details.action}
              hideLabel
            />
            <ReadOnlyText
              id="commentId"
              label={TASK_CONTENT_STRINGS.TASK_COMMENTS(i18next.t).LABEL}
              value={active_task_details.active_task_details.comments}
              textClassName={gClasses.WordBreakBreakWord}
            />
            {/* <Label content={TASK_CONTENT_STRINGS.FILE_UPLOAD.LABEL} hideLabelClass /> */}
            {/* <FileUploadProgress
              files={completedTaskAttachments}
              isCompletedForm={isCompletedTask}
            /> */}
          </>
        );
      } else {
        const taskActionRadioGroup = null;
        let taskReviewers = null;
        let joinStepList = null;
        let isAssignReviewActionSelected = false;
        let isSendBackActionSelected = false;
        let actionModalHeader = null;
        // let commentsClass = null;
        let actionBtnName = null;
        if (
          nullCheck(
            active_task_details,
            'form_metadata.actions.action_details.length',
            true,
          )
        ) {
          const taskActionOptionList = [];
          const button_visibility = get(active_task_details, ['form_metadata', 'actions', 'button_visibility'], {});
          active_task_details.form_metadata.actions.action_details.forEach(
            (eachAction) => {
              const actionType = get(eachAction, ['action_type'], null);
              if (action?.value === eachAction.action_name && actionType === ACTION_TYPE.ASSIGN_REVIEW) {
                isAssignReviewActionSelected = true;
                actionModalHeader = ADD_OR_REMOVE_ASSIGNEE_STRINGS(t).REVIEW_DETAILS;
                // commentsClass = styles.CommentsArea;
                actionBtnName = jsUtils.capitalizeEachFirstLetter(action.value);
              }
              if (action?.value === eachAction.action_name && actionType === ACTION_TYPE.SEND_BACK) {
                isSendBackActionSelected = true;
                actionModalHeader = t(TASK_CONTENT_STRINGS.TASK_INFO.SEND_BACK_HEADER);
                actionBtnName = jsUtils.capitalizeEachFirstLetter(action.value);
              }
              taskActionOptionList.push({
                label: eachAction.action_name,
                value: eachAction.action_name,
                action_uuid: eachAction.action_uuid,
                allow_comments: eachAction.allow_comments,
                isVisible: this.isActionButtonVisible(eachAction, button_visibility),
              });
            },
          );
          if (isAssignReviewActionSelected) {
            const { reviewers, reviewersSearchValue, action_error_list } =
              this.props;
            let reviewersList = [];
            if (reviewers?.teams) reviewersList = union(reviewersList, reviewers.teams);
            if (reviewers?.users) reviewersList = union(reviewersList, reviewers.users);
            const taskReviewersParams = {
              task_log_id: taskLogId,
            };
            if (!isBasicUser) taskReviewersParams.team_type = NON_PRIVATE_TEAM_TYPES;

            taskReviewers = (
              <AddMembers
                id={TASK_CONTENT_STRINGS.TASK_INFO.REVIEWERS}
                label={i18next.t(TASK_CONTENT_STRINGS.TASK_INFO.CHOOSE_USERS_OR_TEAMS)}
                placeholder={i18next.t(TASK_CONTENT_STRINGS.TASK_INFO.SELECT_USER_OR_TEAM)}
                onUserSelectHandler={(event) =>
                  onReviewersSelectHandler(reviewers, event, dispatch, action_error_list)
                }
                selectedData={reviewersList}
                selectedSuggestionData={reviewersList}
                removeSelectedUser={(id_) =>
                  onReviewersRemoveHandler(reviewers, id_, dispatch)
                }
                errorText={action_error_list.reviewers_search_value}
                memberSearchValue={reviewersSearchValue}
                setMemberSearchValue={(event) =>
                  onReviewersSearchHandler(event, dispatch)
                }
                getValidTeamsAndUsers
                isRequired
                displayOneByOne
                memberListClass={styles.SelectedList}
                tagUserClass={gClasses.MB5}
                apiParams={taskReviewersParams}
                helperMessageClassName={styles.SelectReviewerErrorClass}
              />
            );
          }
          if (isSendBackActionSelected) {
            const { action_error_list } = this.props;
            joinStepList = (
              <Dropdown
                id={TASK_CONTENT_STRINGS.PRECEDING_STEPS_INFO.ID}
                label={t(TASK_CONTENT_STRINGS.PRECEDING_STEPS_INFO.LABEL)}
                optionList={precedingStepsList}
                onChange={(event) => onPrecedingStepsChangeHandler(send_back_task_id, event, dispatch, action_error_list)}
                selectedValue={send_back_task_id}
                errorMessage={action_error_list.preceding_steps_value}
                isMultiSelect
                isRequired
                optionContainerClassName={styles.StepListDropdown}
              />
            );
          }
        }
        const taskReferenceDocuments = this.getTaskReferenceDocuments(state.active_task_details.task_log_info);
        const headerContent = (
          <div
            className={cx(styles.SnoozeHeader, BS.JC_BETWEEN, BS.ALIGN_ITEM_CENTER, BS.D_FLEX)}
          >
            <div className={cx(gClasses.ModalHeader)}>
              {actionModalHeader}
            </div>
          </div>
        );
        const footerContent = (
          <div
            className={cx(
              styles.ButtonContainer,
              BS.W100,
              BS.D_FLEX,
              BS.JC_BETWEEN,
              BS.W100,
              styles.ForSnooze,
            )}
            style={{ backgroundColor: widgetBg }}
          >
            <div className={gClasses.CenterV}>
              <Button
                buttonType={BUTTON_TYPE.SECONDARY}
                className={cx(BS.TEXT_NO_WRAP)}
                onClick={this.closeSendBackReviewModal}
              >
                {i18next.t(TASK_CONTENT_STRINGS.SNOOZE_TASK_DISCARD)}
              </Button>
            </div>
            <div className={gClasses.CenterV}>
              <Button
                buttonType={BUTTON_TYPE.PRIMARY}
                className={cx(BS.TEXT_NO_WRAP)}
                onClick={this.saveSendBackReview}
                toolTip={jsUtils.capitalizeEachFirstLetter(action.value || '')}
              >
                {console.log('actionBtnName', actionBtnName)}
                {i18next.t(TASK_CONTENT_STRINGS.CONFIRM_SEND_BACK_OR_REVIEW)}
              </Button>
            </div>
          </div>
        );
        const mainContent = (
          <>
            {taskReviewers || joinStepList}
            <TextInput
              placeholder={i18next.t(TASK_CONTENT_STRINGS.SEND_BACK_REVIEW_COMMENTS.PLACEHOLDER)}
              labelText={i18next.t(TASK_CONTENT_STRINGS.SEND_BACK_REVIEW_COMMENTS.LABEL)}
              required={action.isCommentsMandatory}
              onChange={this.onSendBackReviewCommentsChangeHandler}
              id={TASK_CONTENT_STRINGS.SEND_BACK_REVIEW_COMMENTS.ID}
              value={sendBackReviewComments}
              errorMessage={state.non_form_error_list[TASK_CONTENT_STRINGS.SEND_BACK_REVIEW_COMMENTS.ID]}
              className={gClasses.MB16}
              size={Size.sm}
              disabled={!action.askForComments}
              readOnly={!action.askForComments}
            />
            {/* <TextArea
              placeholder={i18next.t(TASK_CONTENT_STRINGS.SEND_BACK_REVIEW_COMMENTS.PLACEHOLDER)}
              labelText={i18next.t(TASK_CONTENT_STRINGS.SEND_BACK_REVIEW_COMMENTS.LABEL)}
              required={action.isCommentsMandatory}
              onChange={this.onSendBackReviewCommentsChangeHandler}
              id={TASK_CONTENT_STRINGS.SEND_BACK_REVIEW_COMMENTS.ID}
              value={sendBackReviewComments}
              errorMessage={
                state.non_form_error_list[TASK_CONTENT_STRINGS.SEND_BACK_REVIEW_COMMENTS.ID]
              }
              disabled={!action.askForComments}
              readOnly={!action.askForComments}
              size={Size.sm}
            /> */}
          </>
        );

        taskActionContent = (
          <>
            {!is_initiated_task ? <div>{taskActionRadioGroup}</div> : null}
            <ModalLayout
              id="send_back_review_modal#####"
              isModalOpen={isSendBackReviewModalOpen}
              onCloseClick={this.closeSendBackReviewModal}
              headerClassName={styles.SnoozeModalHeader}
              closeIconClass={styles.SnoozeClose}
              centerVH
              modalContainerClass={styles.SendBackModalContainer}
              headerContent={headerContent}
              mainContent={mainContent}
              footerClassName={styles.SnoozeFooter}
              footerContent={footerContent}
              extraSpace={64} // passing footer height to avoid modal content getting cropped
            />
            {!jsUtils.isEmpty(taskReferenceDocuments) && !isCompletedTask ?
              (
                <TaskReferenceAttachments
                  taskReferenceDocuments={taskReferenceDocuments}
                  document_url_details={state.active_task_details.document_url_details}
                />
              ) : null
            }
          </>
        );
      }
    } else if (isCompletedTask) {
      const taskReferenceDocuments = this.getTaskReferenceDocuments(state.active_task_details.task_log_info);
      taskActionContent = jsUtils.get(active_task_details, [
        TASK_CONTENT_STRINGS.TASK_INFO.ACTIVE_TASK_DETAILS,
        TASK_CONTENT_STRINGS.TASK_COMMENTS(i18next.t).ID,
      ]) ? (
        <ReadOnlyText
          label={TASK_CONTENT_STRINGS.TASK_COMMENTS(i18next.t).LABEL}
          value={active_task_details.active_task_details.comments}
          id="comment"
          textClassName={gClasses.WordBreakBreakWord}
        />
      ) :
        (
          !jsUtils.isEmpty(taskReferenceDocuments) && !isCompletedTask &&
          (
            <TaskReferenceAttachments
              taskReferenceDocuments={taskReferenceDocuments}
              document_url_details={state.active_task_details.document_url_details}
            />
          )
        );
    } else if (!isAssigneedToOtherTab(selectedCardTab, location.pathname)) {
      const taskReferenceDocuments = this.getTaskReferenceDocuments(state.active_task_details.task_log_info);
      taskActionContent = (
        <>
          {/* <TextArea
            placeholder={TASK_CONTENT_STRINGS.TASK_COMMENTS.PLACEHOLDER}
            label={TASK_CONTENT_STRINGS.TASK_COMMENTS.LABEL}
            onChangeHandler={this.onCommentsChangeHandler}
            id={TASK_CONTENT_STRINGS.TASK_COMMENTS.ID}
            value={state[TASK_CONTENT_STRINGS.TASK_COMMENTS.ID]}
            errorMessage={
              state.non_form_error_list[TASK_CONTENT_STRINGS.TASK_COMMENTS.ID]
            }
          /> */}
          {!jsUtils.isEmpty(taskReferenceDocuments) && !isCompletedTask ?
            (
              <TaskReferenceAttachments
                taskReferenceDocuments={taskReferenceDocuments}
                document_url_details={state.active_task_details.document_url_details}
              />
            ) : null
          }
        </>
      );
    }
    if (isTaskAlreadyAcceptedByOthers) {
      taskActionContent = null;
      taskActionLabel = null;
    }
    if (!initialLoading) {
      const taskReferenceDocuments = this.getTaskReferenceDocuments(isAssigneedToOtherTab(selectedCardTab, location.pathname) ? state.taskMetadata : state.active_task_details.task_log_info);
      if (tab_index === CONTENT_TAB_INDEX.TASK_DETAILS) {
        if (
          !isTaskDataLoading &&
          isCompletedTab(selectedCardTab) &&
          !taskDescription &&
          !jsUtils.nullCheck(
            active_task_details,
            'form_metadata.sections.length',
            true,
          ) &&
          comment === null &&
          (attachments === null || jsUtils.isNull(attachments.length === 0)) &&
          jsUtils.isEmpty(taskReferenceDocuments)
        ) {
          tabsView = (
            <ResponseHandler
              onCloseIconClick={onCloseIconClick}
              className={gClasses.MT50}
              messageObject={{
                title: i18next.t(TASK_CONTENT_STRINGS.TASK_INFO.NO_FORM_DETAILS_AVAILABLE),
                type: RESPONSE_TYPE.NO_DATA_FOUND,
              }}
            />
          );
        } else if (
          !isTaskDataLoading &&
          isSelfTaskTab(selectedCardTab) &&
          isCompletedTask &&
          comment === null &&
          (attachments === null ||
            attachments.length === 0) &&
          !taskDescription &&
          !jsUtils.nullCheck(
            active_task_details,
            'form_metadata.sections.length',
            true,
          ) && jsUtils.isEmpty(taskReferenceDocuments)
        ) {
          tabsView = (
            <ResponseHandler
              onCloseIconClick={onCloseIconClick}
              className={gClasses.MT50}
              messageObject={{
                title: i18next.t(TASK_CONTENT_STRINGS.TASK_INFO.THIS_TASK_COMPLETE),
                type: RESPONSE_TYPE.NO_DATA_FOUND,
                subTitle: i18next.t(TASK_CONTENT_STRINGS.TASK_INFO.NO_FORM_DETAILS_AVAILABLE),
              }}
            />
          );
        } else if (isCancelledTask) {
          save_and_cancel_buttons = null;
          tabsView = (
            <Alert
              content={i18next.t(TASK_CONTENT_STRINGS.TASK_INFO.THIS_TASK_CANCEL)}
              className={cx(gClasses.MB20, gClasses.MT20, BS.BORDER_0)}
            />
          );
        } else if (
          isCompletedTask &&
          !isCompletedTab(selectedCardTab) &&
          !isSelfTaskTab(selectedCardTab)
        ) {
          tabsView = (
            <>
              <ResponseHandler
                onCloseIconClick={onCloseIconClick}
                className={gClasses.MT50}
                messageObject={TASK_CONTENT_STRINGS.TASK_MOVED_TO_COMPLETE((i18next.t))}
                outerClass={styles.FitContent}
              />
              <Row
                className={cx(
                  gClasses.MT20,
                  gClasses.MB30,
                  BS.JC_CENTER,
                  BS.TEXT_CENTER,
                )}
              >
              <LibraryButton
                type={EButtonType.PRIMARY}
                className={cx(gClasses.WidthFitContent)}
                onClickHandler={() => {
                  this.setState({ blockNavigation: false });
                  this.promptBeforeLeaving({
                    ...history.location,
                    state: {
                      switchTab: true,
                    },
                  });
                }}
                buttonText={i18next.t(TASK_CONTENT_STRINGS.TASK_MOVED_TO_COMPLETE_BUTTON)}
                colorScheme={isBasicUser ? colorScheme : colorSchemeDefault}
              />
              </Row>
            </>
          );
        } else {
          const isFormSection = (!isEmpty(taskDescription) &&
          getTaskCategory(active_task_details) !== TASK_CATEGORY_DATALIST_ADHOC_TASK &&
          getTaskCategory(active_task_details) !== TASK_CATEGORY_FLOW_ADHOC_TASK) ||
          active_task_details?.form_metadata?.sections?.length > 0 || taskActionLabel;
          tabsView = (
            <div
              className={cx(
                { [styles.InputContainer]: (!isTaskDataLoading || !initialLoading) && isShowLatestActivity &&
                  !isEmpty(latest_action_history) && !isAssigneedToOtherTab(selectedCardTab) &&
                  !isAcceptReject,
                },
                active_task_details.task_log_info.show_accept_reject
                  ? gClasses.DisabledFieldV2
                  : null,
              )
              }
              id="task_input_content"
            >

              {isFormSection &&
                <section className={cx([styles.SectionContainer])} style={{ background: widgetBg }}>

                  {(!isTaskDataLoading &&
                    !isEmpty(taskDescription)) && (getTaskCategory(active_task_details) === TASK_CATEGORY_ADHOC_TASK) && (

                      <div className={gClasses.P16}>
                        <h6 className={cx([gClasses.FTwo12BlackV20, gClasses.FontWeight600])}>{i18next.t(TASK_CONTENT_STRINGS.TASK_INFO.DESCRIPTION)}</h6>
                        <div className={cx(gClasses.MT5, gClasses.FontWeight500, gClasses.FTwo13GrayV89, gClasses.WhiteSpacePreWrap, gClasses.WordBreakBreakWord)}>
                          {taskDescription}
                        </div>
                      </div>

                    )}
                  {formComponent}
                  {taskActionLabel &&
                    <div className={cx(gClasses.MT20, gClasses.P16)}>
                      <div className={isFlowBasedTask ? gClasses.PB10 : null}>
                        <div className={cx(BS.D_FLEX, BS.JC_BETWEEN)}>
                          <div className={gClasses.PB10}>
                            {taskActionLabel}
                          </div>
                        </div>
                        {!isTaskDataLoading && taskActionContent}
                        {!jsUtils.isEmpty(taskReferenceDocuments) && isCompletedTask ?
                          (
                            <TaskReferenceAttachments
                              taskReferenceDocuments={taskReferenceDocuments}
                              document_url_details={state.active_task_details.document_url_details}
                            />
                          ) : null
                        }
                      </div>
                    </div>
                  }
                </section>
              }
            </div>
          );
        }
      } else if (tab_index === CONTENT_TAB_INDEX.CHAT) {
        let threadId;
        let threadType;
        if (task_log_info?.instance_id) {
          threadId = task_log_info.instance_id;
          threadType = TASK_CONTENT_STRINGS.TASK_INFO.TASK;
        } else {
          threadId = jsUtils.get(searchParams, [TASK_CONTENT_STRINGS.TASK_INFO.TASK_UUID], null);
          threadType = TASK_CONTENT_STRINGS.TASK_INFO.ASSIGNED_TASK;
        }
        if (isTaskDataLoading) {
          tabsView = (
            <div
              className={cx(gClasses.CenterVH, gClasses.MT30)}
              style={{ color: COLOR_CONSTANTS.BLACK }}
            >
              <BeatLoader size={10} color={DEFAULT_COLORS_CONSTANTS.SECONDARY} loading />
            </div>
          );
        } else if (!isTaskDataLoading && threadId && threadType) {
          // Chat tab will come here
        } else {
          tabsView = (
            <ResponseHandler
              isTask
              onCloseIconClick={onCloseIconClick}
              className={gClasses.MT50}
              messageObject={{
                title: i18next.t(TASK_CONTENT_STRINGS.TASK_INFO.UNABLE_TO_CONNECT_CHAT),
                subTitle: i18next.t(TASK_CONTENT_STRINGS.TASK_INFO.TRY_AFTER_SOME_TIME),
                type: 1,
              }}
            />
          );
        }
      } else if (tab_index === CONTENT_TAB_INDEX.TASK_SUMMARY) {
        tabsView = (
          <div className={cx(gClasses.MT20, gClasses.MB50)}>
            <ResponseCard
              taskDetails={assignee_task_details}
              formContent={active_form_content}
              isTaskDataLoading={isResponseCardDataLoading}
              isCompletedAssigneesLoading={isCompletedAssigneesLoading}
              taskState={cloneDeep(state)}
              completedAssignees={completedAssignees}
              selectedValue={individualResponseSelectedValue}
              formUploadData={state.formUploadData}
              completedAssigneesDocumentUrlDetails={
                completedAssigneesDocumentUrlDetails
              }
              selectedInstanceId={individualResponseSelectedInstanceId}
              taskAssignee={taskAssignee}
              is_assign_to_individual_assignees={taskMetadata.is_assign_to_individual_assignees}
              activeTask={state.activeTask}
              onFormFillUpdate={this.onFormFillUpdate}
            />
          </div>
        );
      } else if (tab_index === CONTENT_TAB_INDEX.TASK_DETAIL) {
        if (isTaskFormDetailsLoading) {
          tabsView = formLoader;
        } else if (
          !isTaskFormDetailsLoading &&
          taskFormDetails &&
          !jsUtils.isEmpty(taskFormDetails.sections)
        ) {
          // const readOnlySections = taskFormDetails.sections.map(
          //   (eachSection) => {
          //     const readOnlyFieldList = eachSection.field_list.map(
          //       (eachFieldList) => {
          //         const readOnlyFields = eachFieldList.fields.map(
          //           (eachField) => {
          //             return {
          //               ...eachField,
          //               read_only: true,
          //             };
          //           },
          //         );
          //         return {
          //           ...eachFieldList,
          //           fields: readOnlyFields,
          //         };
          //       },
          //     );
          //     return { ...eachSection, field_list: readOnlyFieldList };
          //   },
          // );
          // const readOnlyFormDetails = {
          //   ...taskFormDetails,
          //   sections: readOnlySections,
          // };
          const taskReferenceDocuments =
            this.getTaskReferenceDocuments(
              !jsUtils.isEmpty(state.active_task_details.task_log_info) ?
                state.active_task_details.task_log_info : state.taskMetadata,
            );
            const metaData = {
              moduleId: taskMetadata._id,
              instanceId: active_task_details.task_log_info.instance_id,
              formUUID: taskFormDetails?.form_uuid,
              refUuid: state?.activeTask?.refUuid,
            };
            const {
              sections = [],
              fields = {},
              activeFormData = {},
              // formVisibility = {},
              formMetaData = {},
              // errorList = {},
              documentDetails = {},
              showSectionName = false,
              informationFieldFormContent,
            } = taskFormDetails.activeTask || {};
          tabsView = (
            <>
              {taskDescription && !jsUtils.isEmpty(taskReferenceDocuments) && ( // check expected behavior on this condition to display task desc
                <div>
                  {taskDescription}
                </div>
              )}
              <div id="task_details">
                {/* <Form
                  active_task_details={{
                    form_metadata: readOnlyFormDetails,
                    active_form_content: {},
                  }}
                  stateData={{}}
                  isReadOnlyForm
                /> */}
                <Form
                  moduleType={MODULE_TYPES.TASK}
                  formType={FORM_TYPE.READONLY_FORM}
                  metaData={metaData}
                  sections={sections}
                  fields={fields}
                  activeFormData={activeFormData}
                  informationFieldFormContent={informationFieldFormContent}
                  // onFormFillUpdate={this.onFormFillUpdate}
                  onValidateField={() => {}}
                  // errorList={errorList}
                  // formVisibility={formVisibility}
                  formMetaData={formMetaData}
                  documentDetails={documentDetails}
                  showSectionName={showSectionName}
                  showAllFields
                  disableVisibility
                />
                {!jsUtils.isEmpty(taskReferenceDocuments) && !isCompletedTask ?
                  (
                    <TaskReferenceAttachments
                      taskReferenceDocuments={taskReferenceDocuments}
                      document_url_details={
                        state.active_task_details.document_url_details || state.taskMetadata.document_url_details
                      }
                    />
                  ) : null
                }
              </div>
            </>
          );
        } else {
          const completedTaskDetail = !jsUtils.isEmpty(taskReferenceDocuments) && !isCompletedTask ?
            (
              <TaskReferenceAttachments
                taskReferenceDocuments={taskReferenceDocuments}
                document_url_details={state.taskMetadata.document_url_details}
              />
            ) :
            (
              <ResponseHandler
                onCloseIconClick={onCloseIconClick}
                className={gClasses.MT50}
                messageObject={{
                  title: i18next.t(TASK_CONTENT_STRINGS.TASK_INFO.NO_FORM_FIELD_REQUIRED),
                  subTitle: EMPTY_STRING,
                  type: RESPONSE_TYPE.NO_DATA_FOUND,
                }}
              />
            );
          tabsView = !jsUtils.isEmpty(taskDescription) && !jsUtils.isNull(taskDescription) ? (
            <div className={cx(gClasses.FTwo12GrayV3, gClasses.WordBreakBreakWord)} style={{ marginBottom: '-2px' }}>
              {taskDescription}
            </div>
          ) : completedTaskDetail;
        }
      } else if (tab_index === CONTENT_TAB_INDEX.RESPONSE_SUMMARY) {
        let responseSummaryView = null;
        if (isTaskResponseSummaryLoading) {
          responseSummaryView = (
            <div className={cx(gClasses.CenterH, gClasses.MT100)}>
              <SyncLoader size={12} color={DEFAULT_COLORS_CONSTANTS.SECONDARY} loading />
            </div>
          );
        } else {
          let dataSummary = null;
          let respondantsTable = null;

          if (
            !jsUtils.isEmpty(taskResponseSummary) &&
            !jsUtils.isEmpty(taskResponseSummary.report_details) &&
            !this.areReportResponsesEmpty(taskResponseSummary.report_details)
          ) {
            dataSummary = (
              <>
                <div
                  className={cx(gClasses.MT20, styles.FTwo14BlackV2)}
                >
                  {i18next.t(TASK_CONTENT_STRINGS.TASK_INFO.DATA_SUMMARY.TAB_NAME)}
                </div>
                {taskResponseSummary.report_details.map(
                  (eachReport, reportIndex) => {
                    if (
                      VALID_RESPONSE_TABLE_FIELDS.includes(
                        eachReport.field_type,
                      )
                    ) {
                      if (
                        this.isTaskSummaryReponseDetailsEmpty(
                          eachReport.response_details,
                          TABLE_RESPONSE_SUMMARY,
                        )
                      ) {
                        const tableData = eachReport.response_details.map(
                          (eachResponse) => {
                            return {
                              user: {
                                first_name: eachResponse.user.first_name,
                                last_name: eachResponse.user.last_name,
                              },
                              response: eachResponse.response,
                            };
                          },
                        );
                        return (
                          <div
                            className={
                              reportIndex === 0 ? gClasses.MT10 : gClasses.MT20
                            }
                            key={eachReport.field_name}
                          >
                            <div className={gClasses.FTwo13GrayV3}>
                              {eachReport.field_name}
                            </div>
                            <TaskResponseTable
                              className={gClasses.MT10}
                              responseList={tableData}
                              fieldType={eachReport.field_type}
                            />
                          </div>
                        );
                      }
                    }
                    if (
                      VALID_RESPONSE_CHART_FIELDS.includes(
                        eachReport.field_type,
                      )
                    ) {
                      if (
                        this.isTaskSummaryReponseDetailsEmpty(
                          eachReport.response_details,
                          CHART_RESPONSE_SUMMARY,
                        )
                      ) {
                        const barChartData = eachReport.response_details.map(
                          (eachResponse) => {
                            const hasResponded = eachResponse.option
                              ? i18next.t(TASK_CONTENT_STRINGS.TASK_INFO.YES)
                              : i18next.t(TASK_CONTENT_STRINGS.TASK_INFO.NO);
                            return {
                              name:
                                eachReport.field_type === TASK_CONTENT_STRINGS.TASK_INFO.YES_OR_NO
                                  ? hasResponded
                                  : eachResponse.option,
                              count: eachResponse.count,
                            };
                          },
                        );
                        return (
                          <div className={gClasses.MT20} key={eachReport.field_name}>
                            <div className={gClasses.FTwo13GrayV3}>
                              {eachReport.field_name}
                            </div>
                            <ColumnBarChart
                              className={gClasses.MT10}
                              barChartData={barChartData}
                            />
                          </div>
                        );
                      }
                    }
                  },
                )}
              </>
            );
          }
          if (nullCheck(allInstances, TASK_CONTENT_STRINGS.TASK_INFO.LENGTH, true)) {
            respondantsTable = (
              <RespondantsSummary
                downloadButton={downloadButton}
                isCompletedTask={
                  taskMetadata.total_tasks === taskMetadata.completed_tasks
                }
                allInstances={allInstances}
                onNudgeClickHandler={(instance_id) =>
                  nudgeTaskApiCall({ instance_id })
                }
                onNudgeAllClickHandler={() =>
                  nudgeTaskApiCall({
                    task_metadata_uuid: searchParams.uuid || taskMetadataUUID,
                  })
                }
                activePage={respondantsSummary.activePage}
                itemsCountPerPage={respondantsSummary.itemsCountPerPage}
                totalItemsCount={respondantsSummary.totalItemsCount}
                onPageChangeHandler={(page) =>
                  this.callGetAllInstancesByTaskMetadataUuidApi(page)
                }
              />
            );
          }

          if (respondantsTable || dataSummary) {
            responseSummaryView = respondantsTable;
          }
        }

        tabsView = (
          responseSummaryView || (
            <ResponseHandler
              onCloseIconClick={onCloseIconClick}
              className={gClasses.MT50}
              messageObject={{
                title: i18next.t(TASK_CONTENT_STRINGS.TASK_INFO.NO_RESPONSE_SUMMARY),
                subTitle: i18next.t(TASK_CONTENT_STRINGS.TASK_INFO.RESPONSE_SUMMARY_WILL_LIVE_HERE),
                type: 1,
              }}
            />
          )
        );
      } else if (tab_index === CONTENT_TAB_INDEX.INDIVIDUAL_RESPONSES) {
        tabsView = (
          <IndividualResponseCard
            taskDetails={assignee_task_details}
            formContent={active_form_content}
            taskResponseSummary={taskResponseSummary}
            formUploadData={state.formUploadData}
            isResponseCardDataLoading={isResponseCardDataLoading}
            totalCount={assigneesCount}
            cancelledCount={cancelledCount}
            isCompletedAssigneesLoading={
              isCompletedAssigneesLoading || initialCompletedAssigneesLoading
            }
            taskState={cloneDeep(state)}
            completedAssignees={completedAssignees}
            selectedValue={individualResponseSelectedValue}
            onDropDownChangeHandler={this.onIndividualResponseChangeHandler}
            completedAssigneesDocumentUrlDetails={
              completedAssigneesDocumentUrlDetails
            }
            selectedInstanceId={individualResponseSelectedInstanceId}
            activeTask={state.activeTask}
            onFormFillUpdate={this.onFormFillUpdate}
          />
        );
      }
    } else tabsView = formLoader;
    const onCloseReassigneeTaskModal = (closeReassignModal) => {
      const { setState } = this.props;
      closeReassignModal?.(false);
      setState({ assign_to_others: false });
    };

    const reassignTask = () => {
      const { assign_to_others, setReassignTaskAPI, history } = this.props;
      const props = {
        task_log_id: taskLogId,
        assign_to_others: assign_to_others,
      };
      setReassignTaskAPI(props, onCloseIconClick, history);
    };

    const snoozeTask = async (closeSnoozeModal) => {
      const { snoozeDateTime, snoozeComments } = this.state;
      let errorMessage = EMPTY_STRING;
      let snoozeCommentErrorMessage = EMPTY_STRING;
      const isDateValid = moment(
        snoozeDateTime,
        [TASK_CONTENT_STRINGS.SNOOZE_TASK.DATE_FORMAT,
        moment.ISO_8601],
        true).isValid();
      const currentTime = new Date()
        .toLocaleTimeString([], {
          hour: TASK_CONTENT_STRINGS.SNOOZE_TASK.HOUR_MINUTE_FORMAT,
          minute: TASK_CONTENT_STRINGS.SNOOZE_TASK.HOUR_MINUTE_FORMAT,
        })
        .toUpperCase();
        const currentTimeObj = new Date();
        const minSnoozeTimeObj = new Date(currentTimeObj.getTime() + 5 * 60000); // Adding 5 minutes (5 * 60000 milliseconds)

        const minSnoozeTime = minSnoozeTimeObj.toLocaleTimeString([], {
            hour: TASK_CONTENT_STRINGS.SNOOZE_TASK.HOUR_MINUTE_FORMAT,
            minute: TASK_CONTENT_STRINGS.SNOOZE_TASK.HOUR_MINUTE_FORMAT,
        }).toUpperCase();

      if (!isDateValid) {
        const timeString = !isEmpty(snoozeDateTime) ? snoozeDateTime.split('T')[1] : EMPTY_STRING;
        const timeStringTrimmed = safeTrim(timeString);
        if ((isEmpty(timeStringTrimmed) || (timeStringTrimmed.length < 8) || !isTimeValid(timeString))) errorMessage = i18next.t(TASK_CONTENT_STRINGS.SNOOZE_TASK.INVALID_DATE_TIME_ERROR);
        else errorMessage = i18next.t(TASK_CONTENT_STRINGS.SNOOZE_TASK.INVALID_DATE_ERROR);
      } else {
        const timeString = !isEmpty(snoozeDateTime) ? snoozeDateTime.split('T')[1] : EMPTY_STRING;
        const timeStringTrimmed = safeTrim(timeString);
        if ((isEmpty(timeStringTrimmed) || (timeStringTrimmed.length < 8) || !isTimeValid(timeString))) errorMessage = i18next.t(TASK_CONTENT_STRINGS.SNOOZE_TASK.INVALID_DATE_TIME_ERROR);
      }
      if (!isEmpty(snoozeComments)) {
        if (snoozeComments.length > 2000) snoozeCommentErrorMessage = LANDING_PAGE.SNOOZE_COMMENTS_ERROR_MESSAGE;
      }
      this.setState({ snoozeErrorMessage: errorMessage, snoozeCommentErrorMessage });
      if (isEmpty(errorMessage)) {
        let dateWithTimezone;
        const userProfileData = getUserProfileData();
        if (userProfileData.pref_timezone) {
          dateWithTimezone = moment.utc().tz(userProfileData.pref_timezone).format(DATE.UTC_DATE_WITH_TIME_STAMP);
        } else {
          dateWithTimezone = moment.utc().format(DATE.UTC_DATE_WITH_TIME_STAMP);
        }
        const timeString = !isEmpty(snoozeDateTime) ? snoozeDateTime.split('T')[1] : EMPTY_STRING;
        const maxDateString = new Date(dateWithTimezone);
        maxDateString.setDate(maxDateString.getDate() + 31);
        if (new Date(snoozeDateTime) < new Date(dateWithTimezone)) {
          errorMessage = i18next.t(TASK_CONTENT_STRINGS.SNOOZE_TASK.FUTURE_DATE_ERROR);
          this.setState({ snoozeErrorMessage: i18next.t(TASK_CONTENT_STRINGS.SNOOZE_TASK.FUTURE_DATE_ERROR) });
        }
        if (new Date(snoozeDateTime) > new Date(maxDateString)) {
          errorMessage = i18next.t(TASK_CONTENT_STRINGS.SNOOZE_TASK.FUTURE_DATE_LIMIT_ERROR);
          this.setState({ snoozeErrorMessage: i18next.t(TASK_CONTENT_STRINGS.SNOOZE_TASK.FUTURE_DATE_LIMIT_ERROR) });
        }
        if ((new Date(snoozeDateTime).toDateString() === new Date(dateWithTimezone).toDateString()) &&
        moment(snoozeDateTime).isSame(moment(dateWithTimezone), 'day')) {
          if (moment(currentTime, 'hh:mm A').format('HH:mm') >
            moment(timeString, 'hh:mm A').format('HH:mm') &&
            !isEmpty(snoozeDateTime)) {
            errorMessage = i18next.t(TASK_CONTENT_STRINGS.SNOOZE_TASK.FUTURE_TIME_ERROR);
            this.setState({ snoozeErrorMessage: i18next.t(TASK_CONTENT_STRINGS.SNOOZE_TASK.FUTURE_TIME_ERROR) });
          } else if ((moment(timeString, 'hh:mm A').format('HH:mm') <
            moment(minSnoozeTime, 'hh:mm A').format('HH:mm')) &&
            !isEmpty(snoozeDateTime)) {
            errorMessage = i18next.t(TASK_CONTENT_STRINGS.SNOOZE_TASK.FUTURE_TIME_MIN_ERROR);
            this.setState({ snoozeErrorMessage: i18next.t(TASK_CONTENT_STRINGS.SNOOZE_TASK.FUTURE_TIME_MIN_ERROR) });
          }
        }
          if (isEmpty(snoozeCommentErrorMessage) && isEmpty(errorMessage)) {
            snoozeTaskApi(
              {
                task_log_id: taskLogId,
                snooze_time: snoozeDateTime,
                ...(isEmpty(snoozeComments) ? null : { comments: snoozeComments }),
              },
              onCloseIconClick,
              closeSnoozeModal,
              history,
            );
          }
      }
    };

    // All UI Functions

    const getBreadCrumbUI = () => (
      <div
        className={
          cx(styles.Header, BS.JC_BETWEEN, BS.ALIGN_ITEM_CENTER, BS.D_FLEX, gClasses.ML24)
        }
      >
        {
          !isTaskDataLoading ?
            (
              <Breadcrumb
                list={breadcrumbList}
                preventNavigation
                handleLinkClick={(event) => {
                  if ((!history?.location?.state?.hideClosePopper &&
                  !isCompletedTab(tabIndex) && !isAssigneedToOtherTab(tabIndex))) {
                    event?.target?.href && this?.promptBeforeLeaving({
                      ...history?.location,
                      pathname: `/${event?.target?.href?.replace(event?.target?.baseURI, EMPTY_STRING)}`,
                    });
                  } else {
                    const taskPathName = `/${event?.target?.href?.replace(event?.target?.baseURI, EMPTY_STRING)}`;
                    routeNavigate(history, ROUTE_METHOD.REPLACE, taskPathName, history?.location?.search, history?.location?.state, true);
                  }
                }}
                colorScheme={isBasicUser ? colorScheme : colorSchemeDefault}
                className
              />
            ) :
            null
        }
      </div>
    );

    let taskReviewers = null;
    let joinStepList = null;
    let isAssignReviewActionSelected = false;
    let isSendBackActionSelected = false;
    let actionModalHeader = null;
    // let commentsRequired = false;
    if (
      nullCheck(
        active_task_details,
        'form_metadata.actions.action_details.length',
        true,
      )
    ) {
      const taskActionOptionList = [];
      const button_visibility = get(state.activeTask, ['formMetaData', 'buttonVisibility'], {});
      active_task_details.form_metadata.actions.action_details.forEach(
        (eachAction) => {
          const actionType = get(eachAction, ['action_type'], null);
          if (action.value === eachAction.action_name && actionType === ACTION_TYPE.ASSIGN_REVIEW) {
            isAssignReviewActionSelected = true;
            actionModalHeader = ADD_OR_REMOVE_ASSIGNEE_STRINGS(t).REVIEW_DETAILS;
          }
          if (action.value === eachAction.action_name && actionType === ACTION_TYPE.SEND_BACK) {
            isSendBackActionSelected = true;
            actionModalHeader = i18next.t(TASK_CONTENT_STRINGS.TASK_INFO.SEND_BACK_HEADER);
          }
          taskActionOptionList.push({
            label: eachAction.action_name,
            value: eachAction.action_name,
            action_uuid: eachAction.action_uuid,
            isVisible: this.isActionButtonVisible(eachAction, button_visibility),
          });
        },
      );
      if (isAssignReviewActionSelected) {
        const { reviewers, reviewersSearchValue, action_error_list } =
          this.props;
        let reviewersList = [];
        if (reviewers?.teams) reviewersList = union(reviewersList, reviewers.teams);
        if (reviewers?.users) reviewersList = union(reviewersList, reviewers.users);

        taskReviewers = (
          <AddMembers
            id={TASK_CONTENT_STRINGS.TASK_INFO.REVIEWERS}
            label={i18next.t(TASK_CONTENT_STRINGS.TASK_INFO.CHOOSE_USERS_OR_TEAMS)}
            placeholder={i18next.t(TASK_CONTENT_STRINGS.TASK_INFO.SELECT_USER_OR_TEAM)}
            onUserSelectHandler={(event) =>
              onReviewersSelectHandler(reviewers, event, dispatch, action_error_list)
            }
            selectedData={reviewersList}
            selectedSuggestionData={reviewersList}
            removeSelectedUser={(id_) =>
              onReviewersRemoveHandler(reviewers, id_, dispatch)
            }
            errorText={action_error_list.reviewers_search_value}
            memberSearchValue={reviewersSearchValue}
            setMemberSearchValue={(event) =>
              onReviewersSearchHandler(event, dispatch)
            }
            getValidTeamsAndUsers
            isRequired
            displayOneByOne
            popperFixedStrategy
            memberListClass={styles.SelectedList}
            tagUserClass={gClasses.MB5}
            apiParams={{ task_log_id: taskLogId }}
            helperMessageClassName={styles.SelectReviewerErrorClass}
          />
        );
      }
      if (isSendBackActionSelected) {
        const { action_error_list } = this.props;
        joinStepList = (
          <MultiDropdown
            id={TASK_CONTENT_STRINGS.PRECEDING_STEPS_INFO.ID}
            className={cx(BS.W100)}
            dropdownViewProps={{
              labelName: t(TASK_CONTENT_STRINGS.PRECEDING_STEPS_INFO.LABEL),
              errorMessage: action_error_list.preceding_steps_value,
              isRequired: true,
              selectedLabel: send_back_task_steps.join(', '),
              placeholder: t(TASK_CONTENT_STRINGS.PRECEDING_STEPS_INFO.PLACEHOLDER),
            }}
            required
            optionList={cloneDeep(precedingStepsList)}
            onClick={(value, label) => onPrecedingStepsChangeHandler(send_back_task_id, send_back_task_steps, value, label, dispatch, action_error_list)}
            selectedListValue={send_back_task_id}
            labelClassName={cx(gClasses.FTwo12BlackV20)}
            colorScheme={isBasicUser && colorScheme}
          />
        );
      }
    }

    return common_server_error === UNAUTHORIZED_CONTEXT.TASK ? (
      <div>
        Name
      </div>
    ) : (
      <>
        <Prompt
          when={!history?.location?.state?.hideClosePopper &&
            !isCompletedTab(tabIndex) && !isAssigneedToOtherTab(tabIndex)}
          message={this.promptBeforeLeaving}
        />
        <TaskHistoryModal
          isTaskHistoryModalOpen={isTaskHistoryModalOpen}
          onCloseTaskHistoryModal={this.onCloseModalClick}
          isTaskDataLoading={isTaskDataLoading || initialLoading}
          active_task_details={active_task_details}
          instanceId={task_log_info.instance_id}
          showNavigationLink={showNavigationLink}
          referenceId={referenceId}
          navigationLink={navigationLink}
          isCommentPosted={isCommentPosted}
          isCompletedTask={isCompletedTask}
          isBasicUser={isBasicUser}
        />
        {addOrRemoveAssigneeModal}
        <div
          className={cx(styles.Container, (!isMobile && !isAssigneedToOtherTab(selectedCardTab, location.pathname)) && styles.flexColumn)}
        >
          <ConditionalWrapper
            condition={isMobile || isAssigneedToOtherTab(selectedCardTab, location.pathname)}
            wrapper={(children) => (
              <div className={styles.ResponsiveContainerClass}>{children}</div>
            )}
          >
            <TaskHeader
              isBasicUser={isBasicUser}
              isMobile={isMobile}
              isTestBed={isTestBed}
              isLoading={isTaskDataLoading || initialLoading}
              taskMetadata={taskMetadata}
              activeTaskDetail={active_task_details}
              selectedCardTab={selectedCardTab}
              taskCategory={getTaskCategory(active_task_details) || state?.taskMetadata?.task_category}
              showReassign={show_reassign}
              setStateFromProps={setState}
              setAddOrRemoveAssigneeData={setAddOrRemoveAssigneeData}
              parentProps={this.props}
              reassignTaskApi={reassignTask}
              breadCrumbComponent={getBreadCrumbUI()}
              showActionHistory={() => setState({ isTaskHistoryModalOpen: true })}
              saveAndCloseTask={this.updateTaskDetails}
              isCompletedTask={isCompletedTask}
              isShowAppTasks={isShowAppTasks}
              snoozeProps={{
                onChange: (value, type) => {
                  if (type === LANDING_PAGE.SNOOZE_DATE.ID) this.setState({ snoozeDateTime: value, snoozeErrorMessage: '' });
                  else if (type === LANDING_PAGE.SNOOZE_COMMENTS.ID) this.setState({ snoozeComments: value, snoozeErrorMessage: '' });
                },
                snoozeDateTime: snoozeDateTime,
                snoozeErrorMessage: snoozeErrorMessage,
                snoozeComments: snoozeComments,
                snoozeCommentErrorMessage: snoozeCommentErrorMessage,
                submit: snoozeTask,
                close: () => {
                  this.setState({
                    snoozeDateTime: EMPTY_STRING,
                    snoozeErrorMessage: EMPTY_STRING,
                    snoozeComments: EMPTY_STRING,
                    snoozeCommentErrorMessage: EMPTY_STRING,
                  });
                },
              }}
              reassignProps={{
                showReassign: show_reassign && !isTaskDataLoading && !initialLoading && (selectedCardTab === 1 || selectedCardTab === 6) && isAcceptedTask,
                assign_to_others: assign_to_others,
                onChange: this.onSelecthandler,
                submit: reassignTask,
                close: onCloseReassigneeTaskModal,
              }}
              reviewRejectProps={{
                isModalOpen: isSendBackReviewModalOpen,
                modalHeader: actionModalHeader,
                reviewRejectData: taskReviewers || joinStepList,
                errorMessage: state?.non_form_error_list?.[TASK_CONTENT_STRINGS.SEND_BACK_REVIEW_COMMENTS.ID],
                close: this.closeSendBackReviewModal,
                submit: this.saveSendBackReview,
                onChange: this.onSendBackReviewCommentsChangeHandler,
                action: action,
              }}
              postUpdateProps={{
                comments: state[TASK_CONTENT_STRINGS.ADHOC_COMMENT_ID],
                isAttachmentUploadInProgress: state.isAttachmentUploadInProgress,
                commentsError: state?.non_form_error_list?.notes,
                onChange: this.onAdhocCommentChangeHandler,
                submit: this.onPostClickHandler,
                attachmentProps: this.getPostUpdateAttachmentProps(task_log_info, metadata_info),
                close: () => {
                  const { setState, state } = this.props;
                  const { non_form_error_list } = state;
                  if (!isEmpty(non_form_error_list)) delete non_form_error_list.notes;
                  setState({
                    adhoc_comments: EMPTY_STRING,
                    isAdhocComment: !(jsUtils.get(state, ['isAdhocComment'], false)),
                    non_form_error_list,
                    parsed_comments: EMPTY_STRING,
                  });
                },
              }}
            />
            {(!isTaskDataLoading || !initialLoading) && isShowLatestActivity &&
            !isEmpty(latest_action_history) && !isAssigneedToOtherTab(selectedCardTab) &&
            !isAcceptReject &&
              <LastActivity
                data={latest_action_history}
                showFullActionHistory={() => setState({ isTaskHistoryModalOpen: true, isShowLatestActivity: false })}
                onCloseClickHandler={() => setState({ isShowLatestActivity: false })}
                isLoading={isTaskDataLoading || initialLoading}
                sourceName={capitalizeEachFirstLetter(
                  get(active_task_details, [
                    'task_log_info',
                    'translation_data',
                    pref_locale,
                    'task_definition',
                    ], EMPTY_STRING) ||
                    jsUtils.get(active_task_details, ['task_log_info', 'task_name']) ||
                    jsUtils.get(taskMetadata, ['task_name']) ||
                    active_task_details?.metadata_info?.flow_name ||
                    get(active_task_details, [
                      'task_log_info',
                      'translation_data',
                      pref_locale,
                      'task_definition',
                      ], EMPTY_STRING) ||
                    get(active_task_details, [
                      'task_log_info',
                      'translation_data',
                      pref_locale,
                      'task_definition',
                    ], EMPTY_STRING))}
                  isBasicUser={isBasicUser}
              />
            }
            {console.log('isAcceptRejectisAcceptRejectisAcceptReject', isAcceptReject)}
            {
              isAcceptReject &&
              <TaskAcceptReject
                taskId={task_log_info._id}
                isLoading={isTaskDataLoading}
                document_url_details={active_task_details?.document_url_details || []}
                setTestAssignee={setSelectedAssigneeData}
                selectedTestAssignee={selectedTestAssignee}
                taskAssignees={!isTestBed ?
                  get(active_task_details, ['task_log_info', 'assigned_to'], {}) :
                  task_log_info.test_assignees}
                taskLogId={taskLogId}
                onAcceptTask={(acceptData) => {
                  onUpdateTaskStatus(
                    acceptData,
                    onCloseIconClick,
                    this.declareStateVariables,
                    this.setDashboardNavigationLink,
                  );
                }}
                onRejectTask={(rejectData) => {
                  onRejectTask(rejectData, history, onCloseIconClick);
                }}
                isBasicUser={isBasicUser}
                isTestBed={isTestBed}
              />
            }

            {!(isTaskDataLoading || initialLoading) &&
              isAssigneedToOtherTab(selectedCardTab, location.pathname) &&
              (
                <div className={cx(styles.AssignedToOtherHeader, BS.P_RELATIVE, isAssignedToOthersTaskCompleted() && gClasses.MT15)}>
                  {/* <div className={styles.AssignToOthersHeaderBottom} /> */}
                  {!isAssignedToOthersTaskCompleted() && (
                    <CancelTask onTaskSuccessfulSubmit={onTaskSuccessfulSubmit} />
                  )}
                </div>
              )}

            {(isAssigneedToOtherTab(selectedCardTab, location.pathname) &&
              !isTaskDataLoading &&
              !initialLoading) ?
              (
                <div className={cx(!isAssigneedToOtherTab(selectedCardTab, location.pathname) && styles.TabBorder, styles.TabContainer)}>
                  <div className={
                    cx(
                      isAssigneedToOtherTab(selectedCardTab, location.pathname) && gClasses.MT0,
                      isAssigneedToOtherTab(selectedCardTab, location.pathname) && styles.TabBorder)}
                  >
                    <Tab
                      tabIList={tabList}
                      setTab={this.setTab}
                      selectedIndex={tab_index}
                      type={TAB_TYPE.TYPE_2}
                      className={gClasses.MT10}
                      isDataLoading={isTaskDataLoading || initialLoading}
                    />
                  </div>
                </div>
              ) : null
            }
            <div
              className={
                cx(
                  ((isAssigneedToOtherTab(selectedCardTab, location.pathname) && !isTaskDataLoading && !initialLoading)) ?
                    styles.LeftScroll1 : styles.LeftScroll,
                )
              }
              tabIndex={-1} // To focus the component
              style={{ background: customBg }}
            >
              {/* {(show_accept_reject && !isAssigneedToOtherTab(selectedCardTab, location.pathname)
                && !isCompletedTask && isTestBed) ? (
                <>
                  <TaskAction
                    className={gClasses.MT20}
                    onCloseIconClick={onCloseIconClick}
                    hideAvatarGroup={isTestBed}
                    acceptedAs={isTestBed ? selectedTestAssignee : null}
                    isTestBed={isTestBed}
                    statevariables={this.declareStateVariables}
                    setDashboardNavigationLink={this.setDashboardNavigationLink}
                  >
                    <TestAssignees
                      isLoading={isTaskDataLoading || initialLoading}
                      taskId={task_log_info._id}
                      taskAssignees={task_log_info.test_assignees}
                    />
                  </TaskAction>
                  {
                    !isCompletedTask && isTestBed && (
                      <div className={gClasses.MR50}>
                        <hr />
                      </div>
                    )
                  }
                </>
              ) : null} */}
              {tabsView}
              {this.getCommentsModal()}
            </div>
            {!(isAssigneedToOtherTab(selectedCardTab, location.pathname)) && save_and_cancel_buttons &&
              !isTaskDataLoading &&
              !initialLoading ?
              (
                <div
                  className={cx(
                    styles.ButtonContainer,
                    BS.W100,
                  )}
                  style={{ backgroundColor: widgetBg }}
                >
                  {save_and_cancel_buttons}
                </div>
              ) : null
            }
          </ConditionalWrapper>
        </div>
      </>
    );
  }

  onClickDownload = () => {
    const { getExportTaskDetails, taskMetadataUUID, location } = this.props;
    const searchParams = getAllSearchParams(
      new URLSearchParams(location.search),
    );
    const task_metadata_uuid = searchParams.uuid || taskMetadataUUID;
    getExportTaskDetails(task_metadata_uuid.toString());
  };

  onClickDownloadCheckPrompt = () => {
    const { download_list } = this.props;
    const objDownloadData =
      download_list && download_list.length > 0 && download_list[0];
    const { status = null } = objDownloadData;
    if (objDownloadData && status === DOWNLOAD_WINDOW_STRINGS.STATUS.CREATED) {
      updateAlertPopverStatus({
        isVisible: true,
        customElement: (
          <UpdateConfirmPopover
            onYesHandler={async () => {
              this.onClickDownload();
              clearAlertPopOverStatus();
            }}
            onNoHandler={() => clearAlertPopOverStatus()}
            title="Already a Task download is in progress do you want to try again?"
          />
        ),
      });
    } else {
      this.onClickDownload();
    }
  };

  onCloseModalClick = () => {
    const { setState, state } = this.props;
    const { isTaskHistoryModalOpen } = state;
    setState({ isTaskHistoryModalOpen: !isTaskHistoryModalOpen });
  };

  onIndividualResponseChangeHandler = (event) => {
    const { individualResponseSelectedValue, dispatch } = this.props;
    if (event?.target?.value !== individualResponseSelectedValue) {
      dispatch(
        taskContentDataChange({
          individualResponseSelectedValue: event?.target?.value,
          individualResponseSelectedInstanceId: event?.target?.instanceId,
        }),
      );
    }
  };

  onFormFillUpdate = (activeFormData, options = {}) => {
    const { updateActiveTaskData, state = {} } = this.props;
    const { documentDetails, errorList, formMetaData, removedFileId } = options;
    const { removedDocList = [] } = state.activeTask;
    if (!isEmpty(removedFileId)) removedDocList.push(removedFileId);
    const activeTask = {
      activeFormData,
      ...(!isEmpty(documentDetails) ? { documentDetails, refUuid: documentDetails?.ref_uuid } : {}),
      ...(!isEmpty(removedDocList) ? { removedDocList: removedDocList } : {}),
      ...(!isEmpty(formMetaData) ? { formMetaData } : {}),
      ...(errorList ? { errorList } : {}),
    };
    updateActiveTaskData({ ...activeTask });
  };

  // onChangeHandler = (
  //   id,
  //   stateData,
  //   type,
  //   sectionIndex,
  //   fieldListIndex,
  //   fieldIndex,
  //   tableRow,
  //   filess,
  //   currentIndex,
  //   totalLength,
  //   recursiveFunc,
  //   entityId,
  //   currentFilesLength,
  //   invalidFileType,
  //   invalidFileSize,
  //   isMultiple,
  //   currentFileIndex,
  // ) => {
  //   const { dispatch } = this.props;
  //   let fieldData = {};
  //   let fileRefUUID = null;
  //   let has_property_field = false;
  //   const state = this.getTaskContentReducerState();

  //   const fieldListData = jsUtils.get(state, [
  //     TASK_CONTENT_STRINGS.TASK_INFO.ACTIVE_TASK_DETAILS,
  //     'form_metadata',
  //     'sections',
  //     sectionIndex,
  //     'field_list',
  //     fieldListIndex,
  //   ]);

  //   const currentField = fieldListData?.fields?.find((field) => field?.field_uuid === id);

  //   const fieldInfo = {
  //     fieldName: currentField?.field_name,
  //     fieldUuid: currentField?.field_uuid,
  //   };
  //   const isTable = fieldListData?.field_list_type === FIELD_LIST_TYPE.TABLE;

  //   const table_row_data = get(state, ['formUploadData', fieldListData?.table_uuid, tableRow], {});
  //   const table_temp_row_uuid = table_row_data?.temp_row_uuid;

  //   const { file_ref_uuid, formUploadData } = cloneDeep(state);
  //   const { userProfileData } = this.state;

  //   const errorList = cloneDeep(state.error_list);
  //   if (!jsUtils.isEmpty(state.error_list)) {
  //     Object.keys(state.error_list).forEach((errorId) => {
  //       if (errorId.includes(id)) {
  //         if (isTable) {
  //           const tableFieldErrorLabel = [fieldListData.table_uuid, table_temp_row_uuid, id].join(',');
  //           if (errorId.includes(tableFieldErrorLabel)) unset(errorList, [errorId]);
  //         } else unset(errorList, [errorId]);
  //       }
  //     });
  //   }

  //   switch (type) {
  //     case FIELD_TYPE.USER_TEAM_PICKER:
  //       const fieldDetails = !isEmpty(fieldListData.fields) && fieldListData.fields.find((field) => field.field_uuid === id);
  //       if (!isEmpty(fieldDetails)) {
  //         has_property_field = !!fieldDetails.has_property_field;
  //       }
  //       fieldData = stateData;
  //       break;
  //     case FIELD_TYPE.CURRENCY:
  //       const currencyObject = isTable
  //         ? state.formUploadData[fieldListData.table_uuid][tableRow][id]
  //         : state.formUploadData[id];

  //       if (jsUtils.isEmpty(currencyObject)) {
  //         fieldData = {
  //           currency_type: stateData.currency_type ||
  //             userProfileData.default_currency_type ||
  //             DEFAULT_CURRENCY_TYPE, // need to be changed to account level currency type
  //           value: stateData.value.replace(/[^0-9.-]/g, ''),
  //         };
  //       } else {
  //         currencyObject.currency_type = stateData.currency_type;

  //         if (jsUtils.isEmpty(stateData.value)) currencyObject.value = EMPTY_STRING;
  //         else currencyObject.value = stateData.value.replace(/[^0-9.-]/g, '');
  //         fieldData = currencyObject;
  //       }
  //       break;
  //     case FIELD_TYPE.PHONE_NUMBER:
  //       const phoneNumberObject = isTable
  //         ? state.formUploadData[fieldListData.table_uuid][tableRow][id]
  //         : state.formUploadData[id];

  //       if (jsUtils.isEmpty(phoneNumberObject)) {
  //         fieldData = {
  //           phone_number: stateData.phone_number,
  //           country_code: stateData.country_code || userProfileData.default_country_code,
  //         };
  //       } else {
  //         phoneNumberObject.country_code = stateData.country_code;
  //         if (jsUtils.isEmpty(stateData.phone_number)) phoneNumberObject.phone_number = null;
  //         else phoneNumberObject.phone_number = stateData.phone_number;
  //         fieldData = phoneNumberObject;
  //       }
  //       break;
  //     case FIELD_TYPE.FILE_UPLOAD:
  //       fileRefUUID = uuidv4();
  //       file_ref_uuid.push({ [id]: fileRefUUID });
  //       fieldData = {
  //         ...stateData.files[0],
  //         fileId: id,
  //         status: FILE_UPLOAD_STATUS.IN_PROGRESS,
  //         progress: 0,
  //         file_uuid: fileRefUUID,
  //       };
  //       break;
  //     case FIELD_TYPE.NUMBER:
  //       fieldData = stateData.replace(/[^0-9.-]/g, '');
  //       break;
  //     default:
  //       if (jsUtils.isObject(type) && type.fieldType === FIELD_TYPE.DATA_LIST) {
  //         const currentFieldData = isTable
  //           ? state.formUploadData[fieldListData.table_uuid][tableRow][id]
  //           : state.formUploadData[id];
  //         const fieldDetails = !isEmpty(fieldListData.fields) &&
  //           fieldListData.fields.find((field) => field.field_uuid === id);
  //         has_property_field = get(fieldDetails, ['data_list', 'has_property_field'], false);

  //         if (type.remove) {
  //           if (
  //             jsUtils.isArray(currentFieldData) &&
  //             jsUtils.find(currentFieldData, { value: stateData.value })
  //           ) {
  //             fieldData = [...currentFieldData];
  //             jsUtils.remove(fieldData, { value: stateData.value });
  //             if (jsUtils.isEmpty(fieldData)) fieldData = null;
  //           }
  //         } else if (jsUtils.isArray(currentFieldData)) {
  //           fieldData = jsUtils.uniqBy([...currentFieldData, stateData], (value) => value.value);
  //         } else fieldData = [stateData];
  //       } else {
  //         fieldData = stateData;
  //       }
  //       break;
  //   }

  //   const get_and_set_position = (isTable) ? [fieldListData.table_uuid, tableRow, id] : [id];
  //   if (fileRefUUID) {
  //     const fileArray = jsUtils.get(this.getTaskContentReducerState().formUploadData, [...get_and_set_position], []) || [];
  //     fileArray[stateData.index] = { ...fieldData, fileRefUUID };
  //     fieldData = set(formUploadData, [...get_and_set_position], fileArray);
  //     fieldData = { ...fieldData };
  //   } else {
  //     set(formUploadData, [...get_and_set_position], cloneDeep(fieldData));
  //   }
  //   dispatch(
  //     taskContentDataChange({
  //       formUploadData,
  //       file_ref_uuid,
  //       error_list: errorList,
  //     }),
  //   ).then(async () => {
  //     if (fileRefUUID) {
  //       if (isTable) {
  //         await this.uploadFiles(
  //           id,
  //           fileRefUUID,
  //           DOCUMENT_TYPES.FORM_DOCUMENTS,
  //           file_ref_uuid,
  //           fieldListData.table_uuid,
  //           tableRow,
  //           stateData.index,
  //           filess,
  //           currentIndex,
  //           totalLength,
  //           recursiveFunc,
  //           entityId,
  //           currentFilesLength,
  //           invalidFileType,
  //           invalidFileSize,
  //           isMultiple,
  //           currentFileIndex,
  //           fieldInfo,
  //         );
  //       } else {
  //         await this.uploadFiles(
  //           id,
  //           fileRefUUID,
  //           DOCUMENT_TYPES.FORM_DOCUMENTS,
  //           file_ref_uuid,
  //           undefined,
  //           undefined,
  //           stateData.index,
  //           filess,
  //           currentIndex,
  //           totalLength,
  //           recursiveFunc,
  //           entityId,
  //           currentFilesLength,
  //           invalidFileType,
  //           invalidFileSize,
  //           isMultiple,
  //           currentFileIndex,
  //           fieldInfo,
  //         );
  //       }
  //     }
  //     const form_meta_data_fields = get(state, ['active_task_details', 'form_metadata', 'fields'], {});
  //     const form_meta_data_actions = get(state, ['active_task_details', 'form_metadata', 'actions'], {});

  //     if (!isEmpty(form_meta_data_fields) || !isEmpty(form_meta_data_actions)) {
  //       if (
  //         (
  //           includes(form_meta_data_fields.dependent_fields, id) ||
  //           includes(form_meta_data_actions.dependent_field, id) ||
  //           has_property_field
  //         ) &&
  //         type !== FIELD_TYPE.FILE_UPLOAD
  //       ) {
  //         this.getFormFieldUpdates(
  //           state, // state
  //           { is_visibility: true }, // post_data_constructor_utils object
  //           id, // updated_field_uuid
  //           fieldListData?.table_uuid || null, // updated_table_uuid
  //           false, // is_add_new_row
  //           isTable, // is table field updated
  //           table_temp_row_uuid, // updated table field row id.
  //         );
  //       }
  //     }
  //   });
  // };

  onAdhocCommentChangeHandler = (event) => {
    const { setState, state } = this.props;
    const { non_form_error_list } = state;
    if (isEmpty(event?.target?.id)) jsUtils.unset(non_form_error_list, 'notes');
    setState({
      non_form_error_list,
      [event?.target?.id || TASK_CONTENT_STRINGS.ADHOC_COMMENT_ID]: (!isEmpty(event?.target?.value) || isBoolean(event?.target?.value)) ? event?.target?.value : EMPTY_STRING,
      ...(has(event?.target, ['parsedContent'])) ?
      { [TASK_CONTENT_STRINGS.PARSED_ADHOC_COMMENT_ID]: event.target.parsedContent } :
      null,
    });
  };

  onPostClickHandler = (closePostModal) => {
    const { setState, state, postUpdateApiAction } = this.props;
    const { adhoc_comments, isCommentPosted, postNoteAttachments,
      active_task_details: { task_log_info } } = state;
    const parser = new DOMParser();
    const doc = parser.parseFromString(adhoc_comments, 'text/html');
    const parsedElement = doc?.body;
    const validationData = {
      task_log_id: task_log_info?._id,
      notes: (parsedElement?.textContent?.trim() || EMPTY_STRING),
    };

    const errorList = validate(validationData, adhocCommentsSchema);
    if (!jsUtils.isEmpty(errorList)) {
      setState({
        non_form_error_list: errorList,
      });
    }
    if (jsUtils.isEmpty(errorList)) {
      console.log('attachmentsattachments', postNoteAttachments);
      const postData = {
        task_log_id: task_log_info?._id,
        notes: (adhoc_comments || EMPTY_STRING)?.trim(),
      };
      if (!jsUtils.isEmpty(postNoteAttachments)) {
        postData.document_details = {};
        postData.document_details.uploaded_doc_metadata = [];
        postData.document_details.entity = postNoteAttachments.entity;
        postData.document_details.entity_id = postNoteAttachments.entity_id;
        postData._id = postNoteAttachments.entity_id;
        postData.document_details.ref_uuid = postNoteAttachments.ref_uuid;
        if (postNoteAttachments.file_metadata) {
          postNoteAttachments.file_metadata.forEach((file_info) => {
            postData.document_details.uploaded_doc_metadata.push({
              upload_signed_url: getFileUrl(file_info?.upload_signed_url),
              type: file_info.type,
              document_id: file_info._id,
            });
            postData.attachments = [file_info._id];
          });
        }
      }
      postUpdateApiAction(postData, isCommentPosted, task_log_info, closePostModal);
    }
  };

  onSendBackReviewCommentsChangeHandler = (event) => {
    const { state } = this.props;
    const { non_form_error_list } = state;
    jsUtils.unset(non_form_error_list, event.target.id);
    this.setState({
      sendBackReviewComments: event.target.value,
    });
  };

  onCancelTask = (postData) => {
    const { state, setState, history, submitTaskApi, onTaskSuccessfulSubmit, onCloseIconClick } = this.props;
    const step_order = jsUtils.get(state, ['active_task_details', 'metadata_info', 'step_order'], null);
    const is_initiation_task = jsUtils.get(state, ['active_task_details', 'metadata_info', 'is_initiation_task'], false);
    const customMessage = (step_order === 1) && (is_initiation_task ? CANCEL_MESSAGE.DELETED : CANCEL_MESSAGE.CANCELLED);

    updateAlertPopverStatus({
      isVisible: true,
      customElement: (
        <UpdateConfirmPopover
          alertIcon={<div className={gClasses.AlertCircle}><AlertCircle /></div>}
          onYesHandler={async () => {
            clearAlertPopOverStatus();
            setState({ actionType: null });
            submitTaskApi(postData, true, onTaskSuccessfulSubmit, onCloseIconClick, this.readNotificationForCompleted, history);
          }}
          onNoHandler={() => {
            clearAlertPopOverStatus();
            setState({ actionType: null });
          }}
          title={i18next.t(TASK_CONTENT_STRINGS.CANCEL_TASK.POPUP.ALTERNATE_TITLE)}
          subTitle={customMessage}
        />
      ),
    });
  };

  onSaveClicked = async (event, isSaveTask = false, options = {}) => {
    const {
      history,
      state,
      submitTaskApi,
      updateActiveTaskDetailsApi,
      onTaskSuccessfulSubmit,
      onCloseIconClick,
      updateActiveTaskData,
      t,
      working_days,
    } = this.props;
    event?.preventDefault();
    this.setState({ dynamicValidation: true });

    const { sendBackReviewComments, userProfileData } = this.state;
    const { action = {}, fromCommentsModal } = options;
    const { active_task_details, send_back_task_id, reviewers } = state;
    const { sections, formMetaData: { formVisibility }, activeFormData, fields, documentDetails, removedDocList = [] } = state.activeTask;

    // Save and Close
    if (isSaveTask) {
      const formValues = formatFormDataForSubmit(activeFormData, fields, formVisibility);
            const postData = {
        form_uuid: active_task_details.form_metadata.form_uuid,
        task_log_id: active_task_details.task_log_info._id,
        ...formValues,
        ...(getFormattedDocumentDetails(documentDetails, removedDocList, fields, activeFormData)),
      };
      updateActiveTaskDetailsApi(postData, true, onTaskSuccessfulSubmit, onCloseIconClick, history);
      return;
    }

    // Cancel button
    if (action.type === FORM_ACTION_TYPES.CANCEL) {
      const postData = {
        form_uuid: active_task_details.form_metadata.form_uuid,
        task_log_id: active_task_details.task_log_info._id,
        action_name: action.value,
      };
      if (isEmpty(sendBackReviewComments) && !fromCommentsModal) {
        if (action.askForComments) {
          this.setState({
            isCommentsModalOpen: true,
            sendBackReviewComments: state.comments || '',
          });
       } else {
        this.onCancelTask(postData); // open confirmation popup
       }
      } else {
        if (sendBackReviewComments) postData.comments = sendBackReviewComments;
        submitTaskApi(postData, true, onTaskSuccessfulSubmit, onCloseIconClick, this.readNotificationForCompleted, history);
      }
      return;
    }

    // Validate Fields
    const formattedData = formatFormData(activeFormData, fields, formVisibility, false);
    const schema = getSchemaForFormData(
        sections,
        formVisibility,
        userProfileData,
        working_days,
        formattedData,
        fields,
        sections?.contents,
    );
    const errorList = validate(formattedData, schema);
    updateActiveTaskData({ errorList });

    if (!isEmpty(errorList)) {
      return toastPopOver({
        title: t('common_strings.form_popover_strings.check_details_to_proceed'),
        toastType: EToastType.error,
        toastPosition: EToastPosition.TOP_CENTER,
      });
    }

    // construct postData
    const formValues = formatFormData(activeFormData, fields, formVisibility, true);
    const postData = {
      form_uuid: active_task_details.form_metadata.form_uuid,
      task_log_id: active_task_details.task_log_info._id,
      action_name: action.value || 'Submit',
      ...formValues,
      ...(getFormattedDocumentDetails(documentDetails, removedDocList, fields, activeFormData)),
    };

    // Send back button
    if (action.type === FORM_ACTION_TYPES.SEND_BACK) {
      if (options.saveSendBackReview) {
        // internally called after getting send_back_task_id, comments from popup
        postData.send_back_task_id = send_back_task_id;
        if (sendBackReviewComments) postData.comments = sendBackReviewComments;
        submitTaskApi(postData, true, onTaskSuccessfulSubmit, onCloseIconClick, this.readNotificationForCompleted, history);
        return;
      } else {
        // user clicks on send Back button directly
        this.setState({
          isSendBackReviewModalOpen: true,
          sendBackReviewComments: state.comments || '',
        });
        return;
      }
    }

    // send for review
    if (action.type === FORM_ACTION_TYPES.ASSIGN_REVIEW) {
      if (options.saveSendBackReview) {
        // internally called after getting reviewers, comments from popup
        postData.reviewers = getUsersAndTeamsIdList(reviewers);
        if (sendBackReviewComments) postData.comments = sendBackReviewComments;
        submitTaskApi(postData, true, onTaskSuccessfulSubmit, onCloseIconClick, this.readNotificationForCompleted, history);
        return;
      } else {
        // user clicks on Review button directly
        this.setState({
          isSendBackReviewModalOpen: true,
          sendBackReviewComments: state.comments || '',
        });
        return;
      }
    }

    // Ask For Comments
    if (action.askForComments && !fromCommentsModal && !action.systemButton) {
      this.setState({
        isCommentsModalOpen: true,
        sendBackReviewComments: state.comments || '',
      });
      return;
    }
    if (sendBackReviewComments) postData.comments = sendBackReviewComments;

    const onSubmitFailure = () => {
      this.setState({
        isCommentsModalOpen: false,
      });
    };

    const onSubmitSuccess = onSubmitFailure;

    submitTaskApi(postData, true, onTaskSuccessfulSubmit, onCloseIconClick, this.readNotificationForCompleted, history, onSubmitFailure, onSubmitSuccess);

    // const { fileUploadsFieldsInProgress } = this.state;
    // if (!jsUtils.isEmpty(fileUploadsFieldsInProgress)) {
    //   const fields = fileUploadsFieldsInProgress?.map((eachField) => eachField?.fieldName).join(',');
    //   return;
    // }
    // const { active_task_details: { task_log_info }, action } = state;
    // const { is_test_bed_task } = task_log_info;
    // const isTestBed = is_test_bed_task;
    // const errorListData = cloneDeep(state.error_list);

    // if (isSaveTask && !jsUtils.isEmpty(state.error_list)) {
    //   await setState({
    //     error_list: {},
    //   });
    // }

    // if (!isSaveTask && !jsUtils.isEmpty(errorListData)) {
    //   Object.keys(state.error_list).forEach((errorId) => {
    //     Object.keys(active_task_details.form_metadata.fields.form_visibility.visible_fields).forEach((visibleId) => {
    //       if (errorId === visibleId && !active_task_details.form_metadata.fields.form_visibility.visible_fields[visibleId]) {
    //         delete errorListData[errorId];
    //       }
    //     });
    //   });
    //   if (state.error_list !== errorListData) await setState({ error_list: errorListData });
    // }
    // if (
    //   active_task_details?.form_metadata?.sections
    // ) {
    //   if (action) {
    //     const active_action = find(
    //       active_task_details.form_metadata.actions.action_details,
    //       {
    //         action: action,
    //       },
    //     );
    //     if (active_action.action_type !== ACTION_TYPE.CANCEL && !isSaveTask) {
    //       await this.updateErrorListForSubmitTask(isSaveTask);
    //     }
    //   } else if (!isSaveTask) {
    //     // validation not needed for savetask
    //     await this.updateErrorListForSubmitTask(isSaveTask);
    //   }
    // } else if (active_task_details.form_metadata.fields && !isSaveTask) {
    //   await this.updateErrorListForSubmitTask(isSaveTask);
    // }

    // if (state.comments) {
    //   await setState({
    //     non_form_error_list: validate(
    //       this.getNonFormData(),
    //       nonFormValidateSchema,
    //     ),
    //   });
    // }

    // if (isTestBed) {
    //   await setState({
    //     test_bed_error_list: validate(
    //       this.getTestBedData(),
    //       testBedValidateSchema,
    //     ),
    //   });
    // }

    // const { error_list, test_bed_error_list, state: state_data } = this.props;

    // if (
    //   (state.actionType === ACTION_TYPE.SEND_BACK || state.actionType === ACTION_TYPE.ASSIGN_REVIEW) &&
    //   jsUtils.isEmpty(error_list) &&
    //   jsUtils.isEmpty(state_data.non_form_error_list) &&
    //   jsUtils.isEmpty(test_bed_error_list) &&
    //   !saveSendBackReview
    // ) {
    //   this.setState({
    //     isSendBackReviewModalOpen: true,
    //     sendBackReviewComments: state.comments,
    //   });
    //   return;
    // }

    // if (state.actionType === ACTION_TYPE.CANCEL) {
    //   const step_order = jsUtils.get(state_data, ['active_task_details', 'metadata_info', 'step_order'], null);
    //   const is_initiation_task = jsUtils.get(state_data, ['active_task_details', 'metadata_info', 'is_initiation_task'], false);
    //   const customMessage = (step_order === 1) && (is_initiation_task ? CANCEL_MESSAGE.DELETED : CANCEL_MESSAGE.CANCELLED);
    //   updateAlertPopverStatus({
    //     isVisible: true,
    //     customElement: (
    //       <UpdateConfirmPopover
    //         alertIcon={<div className={gClasses.AlertCircle}><AlertCircle /></div>}
    //         onYesHandler={async () => {
    //           clearAlertPopOverStatus();
    //           const isFileExist =
    //             state_data.file_ref_uuid.length > 0 ||
    //             !jsUtils.isEmpty(state_data.nonFormFiles);
    //           if (isFileExist) {
    //             const post_data = {};
    //             await this.submitTaskAPI(post_data, isSaveTask);
    //           } else {
    //             const post_data = {};
    //             this.submitTaskAPI(post_data, isSaveTask);
    //           }
    //           setState({ actionType: null });
    //         }}
    //         onNoHandler={() => {
    //           clearAlertPopOverStatus();
    //           setState({ actionType: null });
    //         }}
    //         title={i18next.t(TASK_CONTENT_STRINGS.CANCEL_TASK.POPUP.ALTERNATE_TITLE)}
    //         subTitle={customMessage}
    //       />
    //     ),
    //   });
    // } else if (
    //   jsUtils.isEmpty(error_list) &&
    //   jsUtils.isEmpty(state_data.non_form_error_list) &&
    //   jsUtils.isEmpty(test_bed_error_list)
    // ) {
    //   let post_data = {};
    //   if (state.actionType !== ACTION_TYPE.CANCEL) {
    //     if ((active_task_details?.form_metadata?.sections)) {
    //       post_data = this.getTaskSubmissionPostData(
    //         active_task_details.form_metadata.sections,
    //         null,
    //         false,
    //         true,
    //         state.actionType === ACTION_TYPE.CANCEL, // true if cancel is clicked
    //       );
    //     } else {
    //       post_data = {
    //         data: {
    //           comments: state_data.comments,
    //         },
    //       };
    //     }
    //   }
    //   this.submitTaskAPI(post_data, isSaveTask);
    // } else {
    // }
  };

  // onRetryFileUpload = (
  //   fileId,
  //   table_uuid,
  //   table_row,
  //   filePositionIndex,
  // ) => {
  //   const { dispatch } = this.props;
  //   const { state } = cloneDeep(this.props);
  //   const fileRefUUID = uuidv4();
  //   let type = null;
  //   if (!jsUtils.isEmpty(state.nonFormFiles[fileId])) {
  //     state.nonFormFiles[fileId] = fileRefUUID;
  //     type = DOCUMENT_TYPES.ATTACHMENT;
  //   } else {
  //     state.file_ref_uuid.map((fileRefUuidObj) => {
  //       const _fileId = Object.keys(fileRefUuidObj)[0];
  //       if (_fileId === fileId) {
  //         fileRefUuidObj[fileId] = fileRefUUID;
  //       }
  //       return fileRefUuidObj;
  //     });
  //     type = DOCUMENT_TYPES.FORM_DOCUMENTS;
  //   }
  //   if (table_uuid) {
  //     set(
  //       state.formUploadData[table_uuid][table_row][fileId][filePositionIndex],
  //       ['status'],
  //       FILE_UPLOAD_STATUS.IN_PROGRESS,
  //     );
  //     set(
  //       state.formUploadData[table_uuid][table_row][fileId][filePositionIndex],
  //       ['progress'],
  //       0,
  //     );
  //   } else {
  //     set(
  //       state,
  //       ['formUploadData', fileId, filePositionIndex, 'status'],
  //       FILE_UPLOAD_STATUS.IN_PROGRESS,
  //     );
  //     set(state, ['formUploadData', fileId, filePositionIndex, 'progress'], 0);
  //   }

  //   dispatch(
  //     taskContentDataChange({
  //       ...state,
  //     }),
  //   ).then(async () => {
  //     if (table_uuid) {
  //       await this.uploadFiles(
  //         fileId,
  //         fileRefUUID,
  //         type,
  //         state.file_ref_uuid,
  //         table_uuid,
  //         table_row,
  //         filePositionIndex,
  //         undefined,
  //         undefined,
  //         undefined,
  //         undefined,
  //         undefined,
  //         undefined,
  //         [],
  //         [],
  //       );
  //     } else {
  //       await this.uploadFiles(
  //         fileId,
  //         fileRefUUID,
  //         type,
  //         state.file_ref_uuid,
  //         undefined,
  //         undefined,
  //         filePositionIndex,
  //         undefined,
  //         undefined,
  //         undefined,
  //         undefined,
  //         undefined,
  //         undefined,
  //         [],
  //         [],
  //       );
  //     }
  //   });
  // };

  // onTableAddOrDeleteRowClick = async (tableUuid, tableRowId) => {
  //   const isAddTable = typeof tableRowId === 'undefined';
  //   const props = cloneDeep(this.props);
  //   let state = cloneDeep(props.state);
  //   const { active_task_details } = state;
  //   const rowOrder = get(state, ['formUploadData', tableUuid], []).findIndex((each_row) => each_row.temp_row_uuid === tableRowId);
  //   const { setState } = this.props;
  //   const sections = cloneDeep(active_task_details.form_metadata.sections);

  //   if (!isAddTable) {
  //     const existing_error_list = jsUtils.cloneDeep(state.error_list);
  //     const deleteable_row_error_label = [tableUuid, tableRowId].join(',');
  //     Object.keys(existing_error_list).some((each_error_key) => {
  //       const [table_uuid] = each_error_key.split(',');
  //       if (existing_error_list[each_error_key] === '"table" must have at least 1 key') {
  //         if (table_uuid === tableUuid) {
  //           jsUtils.unset(existing_error_list, [each_error_key]);
  //         }
  //       }
  //       if (table_uuid === tableUuid) {
  //         if (each_error_key.includes(deleteable_row_error_label)) {
  //           jsUtils.unset(existing_error_list, [each_error_key]); // ignore deleted row's error
  //         }
  //       }
  //     });
  //     state.error_list = { ...existing_error_list };
  //     await setState({ error_list: { ...existing_error_list } }); // while deleting documents changes made in error list is not updated in redux
  //     const newState = await this.deleteDocuments(tableUuid, rowOrder);
  //     state = newState || state;
  //     state.formUploadData[tableUuid].splice(rowOrder, 1);

  //     const visibleDisableFields = get(active_task_details, ['form_metadata', 'fields', 'form_visibility', 'visible_disable_fields']);
  //     if (has(visibleDisableFields, [tableUuid, rowOrder])) {
  //       visibleDisableFields[tableUuid].splice(rowOrder, 1);
  //       set(state, ['active_task_details', 'form_metadata', 'fields', 'form_visibility', 'visible_disable_fields'], visibleDisableFields);
  //     }

  //     if (Object.keys(state.error_list).includes(tableUuid)) {
  //       let errorList = jsUtils.cloneDeep(state.error_list);
  //       let uniqueFieldUuid = '';
  //       sections.forEach((each_section) => {
  //         get(each_section, ['field_list'], []).forEach((each_field_list) => {
  //           if (each_field_list[FIELD_LIST_KEYS.FIELD_LIST_TYPE] === FIELD_LIST_TYPE.TABLE) {
  //             if (each_field_list.table_uuid === tableUuid) {
  //               if (!isEmpty(each_field_list?.table_validations?.unique_column_uuid)) {
  //                 uniqueFieldUuid = each_field_list?.table_validations?.unique_column_uuid.toString();
  //               }
  //             }
  //           }
  //         });
  //       });
  //       const [uniqueColumnValidationMessage, notUniqueIndices] =
  //         getTableUniqueColumnMessage(
  //           state.formUploadData[tableUuid],
  //           uniqueFieldUuid,
  //           false,
  //         );
  //       errorList = {
  //         ...errorList,
  //         [tableUuid]: uniqueColumnValidationMessage,
  //         [`${tableUuid}non_unique_indices`]: notUniqueIndices,
  //       };
  //       if (isEmpty(errorList?.[`${tableUuid}non_unique_indices`])) {
  //         delete errorList[tableUuid];
  //         delete errorList[`${tableUuid}non_unique_indices`];
  //       }
  //       state.error_list = errorList;
  //       setState({ ...state, error_list: errorList });
  //     }
  //   }

  //   if (state.active_task_details.form_metadata.fields) {
  //     this.getFormFieldUpdates(
  //       state, // state
  //       {
  //         allow_state_for_submission: true,
  //         table_row_update_action: isAddTable ? TABLE_ACTION_TYPE.ADD_ROW : TABLE_ACTION_TYPE.DELETE_ROW,
  //       }, // post_data_constructor_utils object
  //       null, // updated_field_uuid
  //       tableUuid, // updated_table_uuid
  //       isAddTable, // is_add_new_row
  //     );
  //   }
  //   let tableSchema = cloneDeep(
  //     jsUtils.get(state, ['formUploadData', 'tableSchema', tableUuid]),
  //   );
  //   if (isAddTable && !isEmpty(tableSchema)) {
  //     tableSchema = { temp_row_uuid: uuidv4(), ...tableSchema };
  //     state.formUploadData[tableUuid].push(tableSchema);
  //   }
  //   setState({ ...state });
  // };

  onSelecthandler = (event) => {
    const { setState } = this.props;
    setState({ assign_to_others: event });
  };

  // getFormFieldUpdates = (
  //   state = {},
  //   post_data_constructor_utils = {},
  //   updated_field_uuid = null,
  //   updated_table_uuid = null,
  //   is_add_new_row = false,
  //   is_table_field_updated = false,
  //   updated_table_field_row = null,
  // ) => {
  //   const { getFieldVisibilityList } = this.props;
  //   const { document_url_details = [], removed_doc_list = [] } = state;

  //   post_data_constructor_utils = {
  //     is_visibility: false,
  //     is_final_submission: false,
  //     is_cancel_task: false,
  //     table_row_update_action: EMPTY_STRING,
  //     allow_state_for_submission: false,
  //     ...(post_data_constructor_utils || {}),
  //   };
  //   const task_submission_field_post_data = this.getTaskSubmissionPostData(
  //     state.active_task_details.form_metadata.sections,
  //     (post_data_constructor_utils.allow_state_for_submission) ? cloneDeep(state) : null,
  //     post_data_constructor_utils.is_visibility,
  //     post_data_constructor_utils.is_final_submission,
  //     post_data_constructor_utils.is_cancel_task,
  //     post_data_constructor_utils.table_row_update_action,
  //   );
  //   const post_data = {
  //     _id: state.active_task_details.form_metadata.form_id,
  //     instance_id: state.active_task_details.task_log_info.instance_id,
  //     validate: true,
  //     field_details: task_submission_field_post_data.data,
  //     is_button_visibility: true,
  //     is_add_new: is_add_new_row,
  //     is_table_default_value: true,
  //   };
  //   const { active_task_details: { task_log_info } } = state;

  //   if (!isEmpty(task_submission_field_post_data.modified_readOnly_fields)) {
  //     post_data.modified_readOnly_fields = task_submission_field_post_data.modified_readOnly_fields;
  //   }

  //   if (updated_field_uuid) post_data.updated_field = updated_field_uuid;
  //   if (updated_table_uuid) {
  //     // To check backend support uncommented if condition
  //     // Once backend changes were done for get form field updates on table, please do uncomment it.
  //     if (is_table_field_updated) {
  //       post_data.table_uuid = updated_table_uuid;
  //       post_data.temp_row_uuid = updated_table_field_row;
  //     } else post_data.updated_table_field = updated_table_uuid;
  //   }
  //   if (task_log_info.is_test_bed_task) post_data.task_log_id = task_log_info._id;
  //   if (cancelForFieldVisibilityList) cancelForFieldVisibilityList();
  //   getFieldVisibilityList(post_data, document_url_details, removed_doc_list);
  // };

  // updateErrorListForSubmitTask = async (isSaveTask) => {
  //   const { setState, working_days } = this.props;
  //   const state = this.getTaskContentReducerState();
  //   const { userProfileData } = this.state;
  //   const { active_task_details, formUploadData } = this.getTaskContentReducerState();
  //   const sections = cloneDeep(active_task_details.form_metadata.sections);
  //   console.log('dsfsdfsdfsedtrfsdfsdf', this.getTaskSubmissionData(isSaveTask, true), constructSchemaFromData(
  //     active_task_details.form_metadata.sections,
  //     false,
  //     active_task_details.form_metadata.fields.form_visibility,
  //     !isSaveTask,
  //     userProfileData,
  //     working_days,
  //     state.formUploadData,
  //     getFieldBasedValidationSectionData(active_task_details.form_metadata.sections),
  //     i18next.t,
  //   ));
  //   let temporary_error_list = validate(
  //     this.getTaskSubmissionData(isSaveTask, true),
  //     constructSchemaFromData(
  //       active_task_details.form_metadata.sections,
  //       false,
  //       active_task_details.form_metadata.fields.form_visibility,
  //       !isSaveTask,
  //       userProfileData,
  //       working_days,
  //       state.formUploadData,
  //       getFieldBasedValidationSectionData(active_task_details.form_metadata.sections),
  //       i18next.t,
  //     ),
  //   );
  //   const submissionData = this.getTaskSubmissionPostData(
  //     active_task_details.form_metadata.sections,
  //     null,
  //     false,
  //     true,
  //   );
  //   temporary_error_list = {
  //     ...(temporary_error_list || {}),
  //     ...getUserTeamPickerMinMaxErrors(
  //       submissionData.data,
  //       active_task_details.form_metadata.sections,
  //       active_task_details.form_metadata.fields.form_visibility,
  //       isSaveTask,
  //       userProfileData,
  //       working_days,
  //       this.getValidationTableAddRowData,
  //       i18next.t),
  //   };
  //   const table_uuid = [];
  //   const tableValidationList = [];
  //   sections.forEach((each_section) => {
  //     get(each_section, ['field_list'], []).forEach((each_field_list) => {
  //       if (each_field_list[FIELD_LIST_KEYS.FIELD_LIST_TYPE] === FIELD_LIST_TYPE.TABLE) {
  //         table_uuid.push(each_field_list.table_uuid);
  //         tableValidationList.push({ tableUUID: each_field_list.table_uuid, tableValidation: each_field_list.table_validations });
  //       }
  //     });
  //   });
  //   const error_list = {};
  //   Object.keys(temporary_error_list).forEach((each_error_key) => {
  //     const splitted_error_key = each_error_key.split(',');
  //     if (table_uuid.includes(splitted_error_key[0])) {
  //       const currentTableValidation = tableValidationList.find((item) => item.tableUUID === splitted_error_key[0]);
  //       const table_value = formUploadData[splitted_error_key[0]];
  //       if (currentTableValidation.tableUUID === splitted_error_key[0] && !currentTableValidation.tableValidation.allow_modify_existing) {
  //         if (get(table_value, [splitted_error_key[1], '_id'], null)) {
  //           delete temporary_error_list[each_error_key];
  //         }
  //       }
  //       if (
  //         each_error_key.includes([splitted_error_key[0], splitted_error_key[1]].join(',')) &&
  //         (
  //           get(table_value, [splitted_error_key[1], 'temp_row_uuid'], null)
  //         )
  //       ) {
  //         splitted_error_key[1] = (
  //           get(table_value, [splitted_error_key[1], 'temp_row_uuid'], null)
  //         );
  //         error_list[splitted_error_key.join(',')] = temporary_error_list[each_error_key];
  //       } else {
  //         error_list[each_error_key] = temporary_error_list[each_error_key];
  //       }
  //     } else {
  //       error_list[each_error_key] = temporary_error_list[each_error_key];
  //     }
  //   });
  //   Object.keys(error_list).forEach((key) => error_list[key] === undefined && delete error_list[key]);
  //   await setState({ error_list: { ...error_list } });
  // };

  getTaskReferenceDocuments = (task_log_info) => {
    if (task_log_info.task_reference_documents) return task_log_info.task_reference_documents;
    else return [];
  };

  buttonClickHandler = async (event, _action, saveSendBackReview = false, fromCommentsModal = false) => {
    const visible = _action.isVisible;
    const askForComments = _action.allow_comments !== ALLOW_COMMENTS.NO_COMMENTS;
    const isCommentsMandatory = _action.allow_comments === ALLOW_COMMENTS.REQUIRED;
    const action = {
      ..._action,
      askForComments,
      isCommentsMandatory,
    };

    if (visible) {
      const { setState } = this.props;
      await setState({ action });
      const options = { action, saveSendBackReview, fromCommentsModal };
      this.onSaveClicked(event, null, options);
    }
  };

  updateTaskDetails = async (event, isSaveTask = false) => {
    const { setState } = this.props;
    if (isSaveTask) await setState({ action: {}, actionType: null });
    this.onSaveClicked(event, isSaveTask);
  };

  setDashboardNavigationLink = () => {
    const { dispatch, navigationLink, referenceId } = this.props;
    const taskState = this.getTaskContentReducerState();
    const taskCategory = jsUtils.get(taskState, [
      TASK_CONTENT_STRINGS.TASK_INFO.ACTIVE_TASK_DETAILS,
      TASK_CONTENT_STRINGS.TASK_INFO.TASKS_LOG_INFO,
      TASK_CONTENT_STRINGS.TASK_INFO.TASK_CATEGORY,
    ]);

    if (taskCategory) {
      switch (taskCategory) {
        case TASK_CATEGORY_DATALIST_ADHOC_TASK: {
          this.setDataListDashbardNavigationLink(taskState);
          break;
        }
        case TASK_CATEGORY_FLOW_TASK:
        case TASK_CATEGORY_FLOW_ADHOC_TASK: {
          this.setFlowDashbardNavigationLink(taskState);
          break;
        }
        default: {
          if (referenceId || navigationLink) {
            dispatch(
              taskContentDataChange({
                referenceId: null,
                navigationLink: null,
              }),
            );
          }
          break;
        }
      }
    }
  };

  setDataListDashbardNavigationLink = (state) => {
    const { dispatch } = this.props;
    const metadata_info = jsUtils.get(state, [
      TASK_CONTENT_STRINGS.TASK_INFO.ACTIVE_TASK_DETAILS,
      TASK_CONTENT_STRINGS.TASK_INFO.METADATA_INFO,
    ]);
    const { dataListUUID, instanceId, showNavLink, referenceId } = getDatalistNavLinkInfo(metadata_info);
    const navigateTo = showNavLink && `${DATA_LIST_DASHBOARD}/${dataListUUID}/${instanceId}?openInstance=true`;
    dispatch(
      taskContentDataChange({
        referenceId: referenceId,
        navigationLink: navigateTo,
      }),
    );
  };

  setFlowDashbardNavigationLink = (state) => {
    const { dispatch } = this.props;
    const { active_task_details: { task_log_info } } = state;
    const { is_test_bed_task } = task_log_info;
    const metadata_info = jsUtils.get(state, [
      TASK_CONTENT_STRINGS.TASK_INFO.ACTIVE_TASK_DETAILS,
      TASK_CONTENT_STRINGS.TASK_INFO.METADATA_INFO,
    ]);
    const taskCategory = jsUtils.get(state, [
      TASK_CONTENT_STRINGS.TASK_INFO.ACTIVE_TASK_DETAILS,
      TASK_CONTENT_STRINGS.TASK_INFO.TASKS_LOG_INFO,
      TASK_CONTENT_STRINGS.TASK_INFO.TASK_CATEGORY,
    ]);
    const { flowUUID, instanceId, showNavLink, referenceId } = getFlowNavLinkInfo(metadata_info, task_log_info, taskCategory);
    const navigateTo = showNavLink && (is_test_bed_task ?
      `${FLOW_DASHBOARD}/${TEST_BED}/${flowUUID}/${instanceId}` :
      `${FLOW_DASHBOARD}/${flowUUID}/${instanceId}`);
    dispatch(
      taskContentDataChange({
        referenceId: referenceId,
        navigationLink: navigateTo,
      }),
    );
  };

  // deleteDocuments = async (tableUuid, rowOrder) => {
  //   let deleteRowCompleted = false;
  //   const {
  //     state: { active_task_details, formUploadData },
  //   } = this.props;
  //   let newState = null;
  //   if (has(active_task_details, ['form_metadata', 'sections'])) {
  //     const { sections } = active_task_details.form_metadata;
  //     let currentTableFieldList = null;
  //     sections.forEach((section) => {
  //       if (section.field_list) {
  //         currentTableFieldList = section.field_list.find(
  //           (eachFieldList) => eachFieldList.table_uuid === tableUuid,
  //         );
  //       }
  //     });
  //     if (has(formUploadData, [tableUuid, rowOrder]) && currentTableFieldList) {
  //       const tableCurrentRow = formUploadData[tableUuid][rowOrder];
  //       if (isObject(tableCurrentRow)) {
  //         const tableRowCells = Object.keys(tableCurrentRow);
  //         tableRowCells.forEach((tableFieldKeyUuid) => {
  //           const currentFieldInfo = currentTableFieldList.fields.find(
  //             (_field) => tableFieldKeyUuid === _field.field_uuid,
  //           );
  //           if (
  //             get(currentFieldInfo, ['field_type']) === FIELD_TYPE.FILE_UPLOAD
  //           ) {
  //             if (jsUtils.get(tableCurrentRow, [tableFieldKeyUuid], []) !== null) {
  //               let allFilesSuccess = true;
  //               get(tableCurrentRow, [tableFieldKeyUuid], []).forEach((eachFile) => {
  //                 if (eachFile.status !== FILE_UPLOAD_STATUS.SUCCESS) allFilesSuccess = false;
  //               });
  //               if (
  //                 allFilesSuccess && !deleteRowCompleted
  //               ) {
  //                 deleteRowCompleted = true;
  //                 newState = this.deleteUploadedFiles(
  //                   tableFieldKeyUuid,
  //                   tableUuid,
  //                   rowOrder,
  //                   formUploadData,
  //                   undefined,
  //                   currentTableFieldList,
  //                 );
  //               }
  //             }
  //           }
  //         });
  //       }
  //     }
  //   }
  //   return Promise.resolve(newState);
  // };

  areReportResponsesEmpty = (reportDetails) => reportDetails.every((eachReport) => eachReport.response_details.length === 0);

  // deleteUploadedFiles = async (_fileId, table_uuid, table_row, formUploadData, fileIndex = undefined, tableFieldList = []) => {
  //   const { setState, state } = this.props;
  //   let state_val = cloneDeep(state);
  //   formUploadData = formUploadData || state_val.formUploadData;
  //   const errorList = cloneDeep(state_val.error_list);
  //   let fieldRowIndex = table_row;
  //   const {
  //     active_task_details: { active_form_content },
  //   } = state_val;
  //   if (table_uuid) {
  //     const error_id = `${table_uuid},${table_row},${_fileId}`;
  //     if (!jsUtils.isEmpty(state_val.error_list)) {
  //       Object.keys(state_val.error_list).forEach((errorId) => {
  //         if (errorId.includes(error_id)) {
  //           unset(errorList, [errorId]);
  //         }
  //       });
  //     }
  //     if (
  //       formUploadData?.[table_uuid]?.[table_row]?._id
  //     ) {
  //       const currentRowId = formUploadData[table_uuid][table_row]._id;
  //       fieldRowIndex = active_form_content[table_uuid].findIndex((row) => row._id === currentRowId);
  //     }
  //     let document = null;
  //     if (!jsUtils.isUndefined(fileIndex)) {
  //       document = jsUtils.find(
  //         jsUtils.get(state_val, ['document_details', 'file_metadata']),
  //         {
  //           file_ref_id: jsUtils.get(
  //             state_val.formUploadData,
  //             [table_uuid, fieldRowIndex, _fileId, fileIndex, 'file_uuid'],
  //             null,
  //           ),
  //         },
  //       );
  //       if (jsUtils.isEmpty(document)) {
  //         let document_id = null;
  //         const url = jsUtils.get(
  //           formUploadData,
  //           [table_uuid, fieldRowIndex, _fileId, fileIndex, 'file', 'url'],
  //           null,
  //         );
  //         if (!jsUtils.isNull(url)) {
  //           const params = queryString.parseUrl(url);
  //           if (params?.query?.id) document_id = params.query.id;
  //         }
  //         document = jsUtils.find(
  //           state_val.active_task_details.document_url_details,
  //           {
  //             document_id: document_id,
  //           },
  //         );
  //       }
  //     } else {
  //       const stateForDoc = cloneDeep(this.getTaskContentReducerState());
  //       Object.keys(jsUtils.get(state_val, ['formUploadData', table_uuid, table_row], [])).forEach((fieldKey) => {
  //         const currentFieldInfo = tableFieldList.fields.find(
  //           (_field) => fieldKey === _field.field_uuid,
  //         );
  //         if (get(currentFieldInfo, ['field_type']) === FIELD_TYPE.FILE_UPLOAD) {
  //           const tableRowDocumentField = jsUtils.cloneDeep(jsUtils.get(
  //             state_val.formUploadData,
  //             [table_uuid, table_row, fieldKey],
  //             []));
  //           (tableRowDocumentField || []).forEach(async (eachDocument, eachDocumentIndex) => {
  //             let currentTableRowDocument = jsUtils.find(
  //               jsUtils.get(stateForDoc, ['document_details', 'file_metadata']),
  //               {
  //                 file_ref_id: jsUtils.get(
  //                   stateForDoc.formUploadData[table_uuid][table_row][fieldKey],
  //                   [0, 'file_uuid'],
  //                   null,
  //                 ),
  //               },
  //             );
  //             if (jsUtils.isEmpty(currentTableRowDocument)) {
  //               let document_id = null;
  //               const url = jsUtils.get(
  //                 formUploadData,
  //                 [table_uuid, table_row, fieldKey, eachDocumentIndex, 'url'],
  //                 null,
  //               );
  //               if (!jsUtils.isNull(url)) {
  //                 const params = queryString.parseUrl(url);
  //                 if (params?.query?.id) document_id = params.query.id;
  //               }
  //               currentTableRowDocument = jsUtils.find(
  //                 state_val.active_task_details.document_url_details,
  //                 {
  //                   document_id: document_id,
  //                 },
  //               );
  //             }
  //             if (currentTableRowDocument && (currentTableRowDocument.document_id || currentTableRowDocument._id)) {
  //               const _id = (currentTableRowDocument.document_id || currentTableRowDocument._id);
  //               stateForDoc.removed_doc_list.push(_id);
  //               const deleted = jsUtils.unset(stateForDoc, ['formUploadData', table_uuid, table_row, fieldKey, eachDocumentIndex]);
  //               if (deleted) stateForDoc.formUploadData[table_uuid][table_row][fieldKey].splice(eachDocumentIndex, 1);
  //             } else {
  //               const deleted = jsUtils.unset(stateForDoc, ['formUploadData', table_uuid, table_row, fieldKey, eachDocumentIndex]);
  //               if (deleted) stateForDoc.formUploadData[table_uuid][table_row][fieldKey].splice(eachDocumentIndex, 1);
  //             }
  //             state_val = { ...cloneDeep(stateForDoc) };
  //             await setState({ ...stateForDoc });
  //           });
  //         }
  //       });
  //       if (
  //         jsUtils.isEmpty(stateForDoc.nonFormFiles[_fileId]) &&
  //         (
  //           includes(
  //             stateForDoc.active_task_details.form_metadata.fields.dependent_fields,
  //             _fileId,
  //           ) ||
  //           includes(
  //             stateForDoc.active_task_details.form_metadata.actions.dependent_field,
  //             _fileId,
  //           )
  //         )
  //       ) {
  //         setState({ ...stateForDoc, error_list: errorList }).then(() => {
  //           this.getFormFieldUpdates(
  //             stateForDoc, // state
  //             null, // post_data_constructor_utils object
  //             _fileId, // updated_field_uuid
  //             null, // updated_table_uuid
  //             false, // is_add_new_row
  //           );
  //         });
  //       }
  //     }
  //     if (document && (document.document_id || document._id)) {
  //       const _id = (document.document_id || document._id);
  //       state_val.removed_doc_list.push(_id);
  //       const deleted = jsUtils.unset(state_val, ['formUploadData', table_uuid, fieldRowIndex, _fileId, fileIndex]);
  //       if (deleted) state_val.formUploadData[table_uuid][table_row][_fileId].splice(fileIndex, 1);
  //       if (
  //         jsUtils.isEmpty(state_val.nonFormFiles[_fileId]) &&
  //         (
  //           includes(
  //             state_val.active_task_details.form_metadata.fields.dependent_fields,
  //             _fileId,
  //           ) ||
  //           includes(
  //             state_val.active_task_details.form_metadata.actions.dependent_field,
  //             _fileId,
  //           )
  //         )
  //       ) {
  //         setState({ ...state_val, error_list: errorList }).then(() => {
  //           this.getFormFieldUpdates(
  //             state_val, // state
  //             null, // post_data_constructor_utils object
  //             _fileId, // updated_field_uuid
  //             null, // updated_table_uuid
  //             false, // is_add_new_row
  //           );
  //         });
  //       }
  //     } else if (!jsUtils.isUndefined(fileIndex)) {
  //       const deleted = jsUtils.unset(state_val, ['formUploadData', table_uuid, table_row, _fileId, fileIndex]);
  //       if (deleted) state_val.formUploadData[table_uuid][table_row][_fileId].splice(fileIndex, 1);
  //     }
  //     if (!jsUtils.isEmpty(state_val.nonFormFiles[_fileId])) {
  //       delete state_val.nonFormFiles[_fileId];
  //     } else {
  //       let formFileRefIndex = null;
  //       state_val.file_ref_uuid.forEach((fileRefUuidObj, index) => {
  //         jsUtils.forEach(fileRefUuidObj, (fileRefId, fileId) => {
  //           if (fileId === _fileId) formFileRefIndex = index;
  //         });
  //       });
  //       state_val.file_ref_uuid.splice(formFileRefIndex, 1);
  //     }
  //     await setState({ ...cloneDeep(state_val), error_list: errorList });
  //   } else {
  //     if (!jsUtils.isEmpty(state_val.error_list)) {
  //       Object.keys(state_val.error_list).forEach((errorId) => {
  //         if (errorId.includes(_fileId)) {
  //           unset(errorList, [errorId]);
  //         }
  //       });
  //     }
  //     let document = jsUtils.find(
  //       jsUtils.get(state_val, ['document_details', 'file_metadata']),
  //       {
  //         file_ref_id: jsUtils.get(state_val, [
  //           'formUploadData',
  //           _fileId,
  //           fileIndex,
  //           'file_uuid',
  //         ]),
  //       },
  //     );
  //     if (jsUtils.isEmpty(document)) {
  //       const documentFromFormUploadData = jsUtils.get(jsUtils.cloneDeep(formUploadData), [
  //         _fileId,
  //         fileIndex,
  //       ]);
  //       if (documentFromFormUploadData.id) {
  //         document = jsUtils.find(
  //           state_val.active_task_details.document_url_details,
  //           {
  //             document_id: documentFromFormUploadData.id,
  //           },
  //         );
  //         if (isEmpty(document)) {
  //           document = documentFromFormUploadData;
  //         }
  //       }
  //     }
  //     if (document && (document.document_id || document._id || document.id)) {
  //       const _id = (document.document_id || document._id || document.id);
  //       state_val.removed_doc_list.push(_id);
  //       const deleted = jsUtils.unset(state_val, ['formUploadData', _fileId, fileIndex]);
  //       if (deleted) state_val.formUploadData[_fileId].splice(fileIndex, 1);
  //       if (
  //         jsUtils.isEmpty(state_val.nonFormFiles[_fileId]) &&
  //         (
  //           includes(
  //             state_val.active_task_details.form_metadata.fields.dependent_fields,
  //             _fileId,
  //           ) ||
  //           includes(
  //             state_val.active_task_details.form_metadata.actions.dependent_field,
  //             _fileId,
  //           )
  //         )
  //       ) {
  //         setState({ ...state_val, error_list: errorList }).then(() => {
  //           this.getFormFieldUpdates(
  //             state_val, // state
  //             null, // post_data_constructor_utils object
  //             _fileId, // updated_field_uuid
  //             null, // updated_table_uuid
  //             false, // is_add_new_row
  //           );
  //         });
  //       }
  //     } else {
  //       const deleted = jsUtils.unset(state_val, ['formUploadData', _fileId, fileIndex]);
  //       if (deleted) state_val.formUploadData[_fileId].splice(fileIndex, 1);
  //     }
  //     if (!jsUtils.isEmpty(state_val.nonFormFiles[_fileId])) {
  //       delete state_val.nonFormFiles[_fileId];
  //     } else {
  //       let formFileRefIndex = null;
  //       state_val.file_ref_uuid.forEach((fileRefUuidObj, index) => {
  //         jsUtils.forEach(fileRefUuidObj, (fileRefId, fileId) => {
  //           if (fileId === _fileId) formFileRefIndex = index;
  //         });
  //       });
  //       state_val.file_ref_uuid.splice(formFileRefIndex, 1);
  //     }
  //     await setState({ ...state_val, error_list: errorList });
  //   }
  //   return state_val;
  // };

  // uploadFiles = async (
  //   id,
  //   fileRefUUID,
  //   type,
  //   file_ref_uuid,
  //   table_uuid,
  //   table_row,
  //   index,
  //   filess,
  //   currentIndex,
  //   totalLength,
  //   recursiveFunc,
  //   entityId,
  //   currentFilesLength,
  //   invalidFileType,
  //   invalidFileSize,
  //   isMultiple,
  //   currentFileIndex,
  //   fieldInfo = {},
  // ) => {
  //   console.log('entrypoint', totalLength, currentIndex);
  //   const { setState } = this.props;
  //   let files = [];
  //   const taskState = cloneDeep(this.getTaskContentReducerState());
  //   if (table_uuid) {
  //     const tableFile = jsUtils.get(taskState.formUploadData, [table_uuid, table_row]);
  //     let finaltableFile = null;
  //     // eslint-disable-next-line array-callback-return
  //     if (jsUtils.includes(Object.keys(tableFile), id) && !jsUtils.isNull(tableFile[id])) {
  //       finaltableFile = tableFile[id];
  //     }
  //     const file = !jsUtils.isUndefined(index) ? [jsUtils.get(finaltableFile, [index, 'file'])] : [finaltableFile.file];
  //     files = finaltableFile ? file : [];
  //   } else {
  //     const file = (jsUtils.get(taskState, ['formUploadData', id]) &&
  //       jsUtils.get(taskState, ['formUploadData', id])[index] ?
  //       [jsUtils.get(taskState, ['formUploadData', id])[index].file] : []);
  //     files = !jsUtils.isUndefined(index) ? file :
  //       [jsUtils.get(taskState, ['formUploadData', id, 'file'])];
  //   }
  //   await setState({
  //     files,
  //   });
  //   await this.getUploadSignedUrl(
  //     files,
  //     ENTITY.INSTANCES,
  //     fileRefUUID,
  //     type,
  //     file_ref_uuid,
  //     table_uuid,
  //     table_row,
  //     index,
  //     filess,
  //     currentIndex,
  //     totalLength,
  //     recursiveFunc,
  //     entityId,
  //     currentFilesLength,
  //     invalidFileType,
  //     invalidFileSize,
  //     isMultiple,
  //     currentFileIndex,
  //     fieldInfo,
  //   );
  // };

  calculateListSize = () => {
    if (this.containerCompRef && this.headerCompRef && this.listCompRef) {
      const listHeight =
        this.containerCompRef.clientHeight - '64px';
      this.listCompRef.style.height = `${listHeight}px`;
    }
  };

  setTab = (tabIndex) => {
    const { setState, getTaskFormDetailsApi, id } = this.props;
    if (
      tabIndex === CONTENT_TAB_INDEX.INDIVIDUAL_RESPONSES ||
      tabIndex === CONTENT_TAB_INDEX.TASK_SUMMARY
    ) {
      setState({ tab_index: tabIndex, isCompletedAssigneesLoading: true });
    } else if (tabIndex === CONTENT_TAB_INDEX.TASK_DETAIL) {
      setState({ tab_index: tabIndex });
      getTaskFormDetailsApi({ task_metadata_id: id });
    } else setState({ tab_index: tabIndex });
  };

  // getUploadSignedUrl = (
  //   doc_details,
  //   entity,
  //   fileRefUUID,
  //   type,
  //   file_ref_uuid,
  //   table_uuid,
  //   tableRow,
  //   index,
  //   filess,
  //   currentIndex,
  //   totalLength,
  //   recursiveFunc,
  //   entityId,
  //   currentFilesLength,
  //   invalidFileType,
  //   invalidFileSize,
  //   isMultiple,
  //   currentFileIndex,
  //   fieldInfo = {},
  // ) => {
  //   const taskState = this.getTaskContentReducerState();
  //   const { fileUploadsFieldsInProgress } = this.state;
  //   let currentInprogressFields = fileUploadsFieldsInProgress;
  //   const { dispatch, setState } = this.props;
  //   let uploadFileId = null;
  //   if (type === DOCUMENT_TYPES.ATTACHMENT) {
  //     jsUtils.forEach(taskState.nonFormFiles, (fileRefId, fileId) => {
  //       if (fileRefId === fileRefUUID) uploadFileId = fileId;
  //     });
  //   } else if (jsUtils.nullCheckObject(taskState, ['file_ref_uuid'])) {
  //     taskState.file_ref_uuid.forEach((fileRefUuidObj) => {
  //       jsUtils.forEach(fileRefUuidObj, (fileRefId, fileId) => {
  //         if (fileRefId === fileRefUUID) uploadFileId = fileId;
  //       });
  //     });
  //   }
  //   const refUuid = jsUtils.get(taskState, ['document_details', 'ref_uuid'], null);
  //   const data = getDocumentMetaData(
  //     doc_details,
  //     fileRefUUID,
  //     entity,
  //     taskState.active_task_details,
  //     type,
  //     uploadFileId,
  //     refUuid,
  //   );
  //   if (!fileUploadsFieldsInProgress.find((field) => field?.fieldUuid === fieldInfo?.fieldUuid)) {
  //     const updatedFieldsInProgress = [...fileUploadsFieldsInProgress, fieldInfo];
  //     this.setState({ fileUploadsFieldsInProgress: updatedFieldsInProgress });
  //   }

  //   dispatch(
  //     getSignedUrlApiThunk(
  //       data,
  //       this.uploadDocumentToDMS,
  //       type,
  //       file_ref_uuid,
  //       table_uuid,
  //       tableRow,
  //       null,
  //       null,
  //       false,
  //       index,
  //       filess,
  //       currentIndex,
  //       totalLength,
  //       recursiveFunc,
  //       entityId,
  //       currentFilesLength,
  //       invalidFileType,
  //       invalidFileSize,
  //       isMultiple,
  //       currentFileIndex,
  //       fieldInfo,
  //     ),
  //   ).catch(() => {
  //     currentInprogressFields = currentInprogressFields?.filter((field) => field?.fieldUuid !== fieldInfo?.fieldUuid);
  //     this.setState({ fileUploadsFieldsInProgress: currentInprogressFields });
  //     const { state } = cloneDeep(this.props);
  //     if (table_uuid) {
  //       set(
  //         state.formUploadData[table_uuid][tableRow][uploadFileId][index],
  //         ['progress'],
  //         0,
  //       );
  //       set(
  //         state.formUploadData[table_uuid][tableRow][uploadFileId][index],
  //         ['status'],
  //         FILE_UPLOAD_STATUS.FAILURE,
  //       );
  //     } else {
  //       set(state, ['formUploadData', uploadFileId, index, 'progress'], 0);
  //       set(
  //         state,
  //         ['formUploadData', uploadFileId, index, 'status'],
  //         FILE_UPLOAD_STATUS.FAILURE,
  //       );
  //     }
  //     const fileIndex = state.unSuccessfullFileUploads.findIndex(
  //       (unSuccessfullFileUploadId) =>
  //         unSuccessfullFileUploadId === uploadFileId,
  //     );
  //     if (fileIndex !== -1) {
  //       state.unSuccessfullFileUploads.splice(uploadFileId, 1);
  //     }
  //     setState({ ...state });
  //   });
  // };

  getTaskCompletedAssignees = async (id, refresh) => {
    const { getTaskCompletedAssigneesApi } = this.props;
    await getTaskCompletedAssigneesApi(
      { task_metadata_uuid: id },
      this.declareStateVariables,
      refresh,
    );
  };

  isReadOnlyForm = (isCompletedTask) => {
    const { state: { tab_index } } = this.props;
    if ([
      CONTENT_TAB_INDEX.TASK_DETAIL,
      CONTENT_TAB_INDEX.RESPONSE_SUMMARY,
      CONTENT_TAB_INDEX.INDIVIDUAL_RESPONSES,
    ].includes(tab_index)) return true;

    if ((tab_index === CONTENT_TAB_INDEX.TASK_DETAILS) && isCompletedTask) return true;
  };

  declareStateVariables = (
    sections,
    activeFormContent,
    documentUrlDetails,
    isCompletedTask,
  ) => {
    const { userProfileData } = this.state;
    return getStateVariables(
      sections,
      activeFormContent,
      documentUrlDetails,
      userProfileData,
      this.isReadOnlyForm(isCompletedTask),
    );
  };

  // getTaskSubmissionPostData = (
  //   sections = [],
  //   _state = {},
  //   isVisibility = false,
  //   finalSubmission = false,
  //   isCancelClicked = false,
  //   tableRowUpdateAction = EMPTY_STRING,
  // ) => {
  //   const StateData = this.getTaskContentReducerState();
  //   const state_data = _state || cloneDeep(StateData);
  //   return getTaskSubmissionData(
  //     sections,
  //     state_data,
  //     isVisibility,
  //     finalSubmission,
  //     isCancelClicked,
  //     tableRowUpdateAction,
  //   );
  // };

  // getValidationTableAddRowData = (tableFieldList) => {
  //   const { state } = this.props;
  //   const state_data = cloneDeep(state);
  //   if (
  //     tableFieldList.field_list_type === FIELD_LIST_TYPE.TABLE && tableFieldList.table_uuid
  //   ) {
  //     const tableDataArray = jsUtils
  //       .get(state_data, ['formUploadData', tableFieldList.table_uuid], [])
  //       .flatMap((tableRow, tableRowIndex) => {
  //         let isTableEmpty = true;
  //         Object.keys(tableRow).forEach((key) => {
  //           const currentField = tableFieldList?.fields?.find((field) => field.field_uuid === key);
  //           const fieldType = currentField?.field_type;
  //           const { visible_fields = {}, visible_disable_fields = {} } = get(state_data, [
  //             'active_task_details',
  //             'form_metadata',
  //             'fields',
  //             'form_visibility',
  //           ], {});

  //           const isDisabled = get(visible_disable_fields, [tableFieldList.table_uuid, tableRowIndex, key], false);
  //           const isVisibile = currentField?.is_visible;
  //           const isFieldShowWhenRule = currentField?.is_field_show_when_rule;

  //           const isFieldValidatable = !isFieldShowWhenRule || ((isVisibile && visible_fields[key]) || (!isVisibile && !isDisabled));

  //           if (isFieldValidatable &&
  //             fieldType &&
  //             !currentField?.read_only &&
  //             (
  //               fieldType === FIELD_TYPE.PHONE_NUMBER ?
  //                 !isEmpty(get(tableRow, [key, 'phone_number'], null)) :
  //                 (fieldType !== FIELD_TYPE.PHONE_NUMBER &&
  //                   (
  //                     isBoolean(tableRow[key]) ||
  //                     isFiniteNumber(tableRow[key]) ||
  //                     (
  //                       (isString(tableRow[key]) || Array.isArray(tableRow[key])) &&
  //                       !isEmpty(tableRow[key])
  //                     ) ||
  //                     (isObject(tableRow[key]) && !isEmpty(tableRow[key]) &&
  //                       ![null, EMPTY_STRING].includes(tableRow[key].value))
  //                   )
  //                 )
  //             )
  //           ) {
  //             isTableEmpty = false;
  //             tableRow[key] = formatValidationData(tableRow[key], fieldType);
  //           } else if (tableRow[key] === null || tableRow[key] !== '' || !isFieldValidatable) unset(tableRow, [key]);
  //         });
  //         return isTableEmpty ? [{}] : tableRow;
  //       });
  //     return { [tableFieldList.table_uuid]: tableDataArray };
  //   }
  //   return null;
  // };

  // getTaskSubmissionData = (isSaveTask = false, isValidateData = false) => {
  //   const state_data = cloneDeep(this.getTaskContentReducerState());
  //   const { active_task_details } = state_data;
  //   let validate_data = {};
  //   if (active_task_details.form_metadata.sections) {
  //     validate_data = getEditableFormValidationData(
  //       active_task_details.form_metadata.sections,
  //       get(state_data, ['active_task_details', 'form_metadata', 'fields', 'form_visibility'], {}),
  //       get(state_data, ['formUploadData'], {}),
  //       MODULE_TYPES.TASK,
  //       isSaveTask,
  //       isValidateData,
  //     );
  //   }
  //   return validate_data;
  // };

  // getNonFormData = () => {
  //   const { state } = this.props;
  //   const { comments } = state;
  //   return { comments };
  // };

  // getTestBedData = () => {
  //   const { selectedTestAssignee } = this.props;
  //   const userProfileData = getUserProfileData();
  //   const complete_as_user = selectedTestAssignee._id || userProfileData.id;
  //   return { complete_as_user };
  // };

  readNotificationForOpened = async (taskId = null, instanceId = null) => {
    const userProfileData = getProfileDataForChat();
    if (userProfileData?.notificationSocket) {
      if (!jsUtils.isNull(taskId)) {
        const data = jsUtils.isNull(instanceId)
          ? { task_id: taskId }
          : { task_id: taskId, instance_id: instanceId };
        userProfileData.notificationSocket.emit(
          NOTIFICATION_SOCKET_EVENTS.EMIT_EVENTS.TASK_OPENED,
          data,
          (code, error) => {
            console.log('NotificationForOpened read via socket', code, error);
          },
        );
      }
    }
  };

  readNotificationForCompleted = async (taskId = null, instanceId = null) => {
    const userProfileData = getProfileDataForChat();
    if (userProfileData?.notificationSocket) {
      if (!jsUtils.isNull(taskId)) {
        const data = jsUtils.isNull(instanceId)
          ? { task_id: taskId }
          : { task_id: taskId, instance_id: instanceId };
        userProfileData.notificationSocket.emit(
          NOTIFICATION_SOCKET_EVENTS.EMIT_EVENTS.TASK_COMPLETED,
          data,
          (code, error) => {
            console.log('NotificationForCompleted read via socket', code, error);
          },
        );
      }
    }
  };

  getTaskDetails = (activeTaskId, isResponseCard) => {
    const { dispatch, state, t } = this.props;
    const {
      active_task_details,
    } = cloneDeep(state);
    const { userProfileData } = this.state;

    const activeTaskInfo = jsUtils.get(active_task_details, [TASK_CONTENT_STRINGS.TASK_INFO.TASKS_LOG_INFO, TASK_CONTENT_STRINGS.TASK_INFO.TASK_STATUS]);
    const isCompletedTask = activeTaskInfo === TASK_STATUS_TYPES.COMPLETED;
    const params = { task_log_id: activeTaskId, is_open_task: 1 };

    if (!isCompletedTask) {
      params.is_table_default_value = 1;
    }

    dispatch(
      getTaskDetailsApiThunk(
        params,
        this.declareStateVariables,
        isResponseCard,
        this.readNotificationForOpened,
        t,
        userProfileData,
      ),
    ).then(() => {
      this.setDashboardNavigationLink();
      // Calling latest activity history
      const activeTaskInstanceId = jsUtils.get(active_task_details, [TASK_CONTENT_STRINGS.TASK_INFO.TASKS_LOG_INFO, 'instance_id']);

      console.log('# test', activeTaskInstanceId, active_task_details, active_task_details?.task_log_info?.instance_id);
    });
  };

  getTaskMetaData = (id) => {
    const { getTaskMetadataApi } = this.props;
    const params = {
      _id: id,
      resolutions: { 'assignees.users.profile_pic': 'small' },
    };
    getTaskMetadataApi(params);
  };

  // updateProgress = (progressEvent, uploadFileId) => {
  //   const progressPercentage = calculateProgressPercentage(progressEvent);
  //   const { state, setState } = this.props;
  //   const formData = cloneDeep(jsUtils.get(state, ['formUploadData']));
  //   jsUtils.set(formData, [uploadFileId, 'progress'], progressPercentage);
  //   setState({ formUploadData: formData });
  // };

  // eslint-disable-next-line no-unused-vars
  // uploadDocumentToDMS = (
  //   fileArray,
  //   file_ref_uuid,
  //   table_uuid,
  //   tableRow,
  //   // eslint-disable-next-line no-unused-vars
  //   _doc_details = null,
  //   // eslint-disable-next-line no-unused-vars
  //   _metadata = null,
  //   filePositionIndex,
  //   filess,
  //   currentIndex,
  //   totalLength,
  //   recursiveFunc,
  //   entity_id,
  //   currentFilesLength,
  //   invalidFileType,
  //   invalidFileSize,
  //   isMultiple,
  //   currentFileIndex,
  //   fieldInfo,
  // ) => {
  //   const { state, history } = this.props;
  //   const { files } = cloneDeep(state);
  //   let { fileUploadsFieldsInProgress: currentInprogressFields } = this.state;
  //   fileArray.forEach((data, index) => {
  //     const postData = getFieldsForDMS(
  //       data.upload_signed_url.fields,
  //       files[index],
  //     );
  //     setPointerEvent(true);
  //     let uploadFileId = null;
  //     let nonFormFile = false;
  //     jsUtils.forEach(state.nonFormFiles, (fileRefId, fileId) => {
  //       if (fileRefId === data.file_ref_id) {
  //         uploadFileId = fileId;
  //         nonFormFile = true;
  //       }
  //     });
  //     if (!uploadFileId && jsUtils.nullCheckObject(state, 'file_ref_uuid')) {
  //       state.file_ref_uuid.forEach((fileRefUuidObj) => {
  //         jsUtils.forEach(fileRefUuidObj, (fileRefId, fileId) => {
  //           if (fileRefId === data.file_ref_id) {
  //             uploadFileId = fileId;
  //           }
  //         });
  //       });
  //     }
  //     const config = {
  //       onUploadProgress: (progressEvent) =>
  //         this.updateProgress(progressEvent, uploadFileId),
  //     };
  //     axios
  //       .post(
  //         data.upload_signed_url.url,
  //         appendFormDataArrayOrObject(postData),
  //         config,
  //       )
  //       .then(() => {
  //         if (currentIndex + 1 === totalLength) {
  //           currentInprogressFields = currentInprogressFields?.filter((field) => field?.fieldUuid !== fieldInfo?.fieldUuid);
  //           this.setState({ fileUploadsFieldsInProgress: currentInprogressFields });
  //         }
  //         const { setState } = this.props;
  //         const { state: stateData } = this.props;
  //         const formUploadData = cloneDeep(
  //           jsUtils.get(stateData, ['formUploadData']),
  //         );
  //         const unSuccessfullFileUploads = cloneDeep(
  //           stateData.unSuccessfullFileUploads,
  //         );
  //         if (
  //           !nonFormFile &&
  //           (
  //             includes(
  //               jsUtils.get(stateData, [TASK_CONTENT_STRINGS.TASK_INFO.ACTIVE_TASK_DETAILS,
  //                 'form_metadata', 'fields', 'dependent_fields']),
  //               uploadFileId,
  //             ) ||
  //             includes(
  //               jsUtils.get(stateData, [TASK_CONTENT_STRINGS.TASK_INFO.ACTIVE_TASK_DETAILS,
  //                 'form_metadata', 'actions', 'dependent_field']),
  //               uploadFileId,
  //             )
  //           )
  //         ) {
  //           this.getFormFieldUpdates(
  //             stateData, // state
  //             null, // post_data_constructor_utils object
  //             uploadFileId, // updated_field_uuid
  //             null, // updated_table_uuid
  //             false, // is_add_new_row
  //           );
  //         }
  //         if (table_uuid) {
  //           formUploadData[table_uuid][tableRow][uploadFileId].forEach((_eachFile, fileIndex) => {
  //             if (formUploadData[table_uuid][tableRow][uploadFileId][fileIndex].status !== 3) {
  //               set(
  //                 formUploadData[table_uuid][tableRow][uploadFileId][filePositionIndex],
  //                 ['url'],
  //                 `${getDmsLinkForPreviewAndDownload(history)}/dms/display/?id=${fileArray[0]._id}`,
  //               );
  //               set(
  //                 formUploadData[table_uuid][tableRow][uploadFileId][fileIndex],
  //                 ['progress'],
  //                 100,
  //               );
  //               set(
  //                 formUploadData[table_uuid][tableRow][uploadFileId][fileIndex],
  //                 ['status'],
  //                 FILE_UPLOAD_STATUS.SUCCESS,
  //               );
  //             }
  //           });
  //         } else if (formUploadData[uploadFileId][filePositionIndex].status !== 3) {
  //           set(
  //             formUploadData[uploadFileId][filePositionIndex],
  //             ['url'],
  //             `${getDmsLinkForPreviewAndDownload(history)}/dms/display/?id=${fileArray[0]._id}`,
  //           );
  //           set(formUploadData[uploadFileId][filePositionIndex], ['progress'], 100);
  //           set(
  //             formUploadData[uploadFileId][filePositionIndex],
  //             ['status'],
  //             FILE_UPLOAD_STATUS.SUCCESS,
  //           );
  //         }
  //         if (recursiveFunc && (isMultiple || (!isMultiple && filess.length === 1))) {
  //           recursiveFunc(
  //             filess,
  //             currentIndex + 1,
  //             totalLength,
  //             entity_id,
  //             currentFilesLength,
  //             invalidFileType,
  //             invalidFileSize,
  //             !jsUtils.isEmpty(invalidFileType) || !jsUtils.isEmpty(invalidFileSize),
  //             isMultiple,
  //             currentFileIndex,
  //           );
  //         }
  //         const fileIndex = unSuccessfullFileUploads.findIndex(
  //           (unSuccessfulFileUploadId) =>
  //             unSuccessfulFileUploadId === uploadFileId,
  //         );
  //         if (fileIndex !== -1) {
  //           unSuccessfullFileUploads.splice(uploadFileId, 1);
  //         }
  //         setState({ formUploadData, unSuccessfullFileUploads });
  //       })
  //       .catch(() => {
  //         const { setState } = this.props;
  //         const { state: stateData } = this.props;
  //         currentInprogressFields = currentInprogressFields?.filter((field) => field?.fieldUuid !== fieldInfo?.fieldUuid);
  //         this.setState({ fileUploadsFieldsInProgress: currentInprogressFields });
  //         const formUploadData = cloneDeep(stateData.formUploadData);
  //         const unSuccessfullFileUploads = cloneDeep(
  //           stateData.unSuccessfullFileUploads,
  //         );
  //         if (table_uuid) {
  //           set(
  //             formUploadData[table_uuid][tableRow][uploadFileId][filePositionIndex],
  //             ['progress'],
  //             0,
  //           );
  //           set(
  //             formUploadData[table_uuid][tableRow][uploadFileId][filePositionIndex],
  //             ['status'],
  //             FILE_UPLOAD_STATUS.FAILURE,
  //           );
  //         } else {
  //           set(formUploadData[uploadFileId][filePositionIndex], ['progress'], 0);
  //           set(
  //             formUploadData[uploadFileId][filePositionIndex],
  //             ['status'],
  //             FILE_UPLOAD_STATUS.FAILURE,
  //           );
  //         }

  //         const isFilePresent = unSuccessfullFileUploads.some(
  //           (unSuccessfullFileUploadId) =>
  //             unSuccessfullFileUploadId === uploadFileId,
  //         );
  //         if (!isFilePresent) {
  //           unSuccessfullFileUploads.push(uploadFileId);
  //         }

  //         setState({ formUploadData, unSuccessfullFileUploads });
  //       });
  //     return data;
  //   });
  //   setPointerEvent(false);
  // };

  // submitTaskAPI = async (post_data, isSaveTask) => {
  //   const {
  //     submitTaskApi,
  //     updateActiveTaskDetailsApi,
  //     onTaskSuccessfulSubmit,
  //     onCloseIconClick,
  //     state,
  //     setState,
  //     selectedTestAssignee,
  //     t,
  //     history,
  //   } = this.props;
  //   const {
  //     active_task_details,
  //     active_task_details: { task_log_info },
  //     action,
  //     comments,
  //     unSuccessfullFileUploads,
  //     nonFormFiles,
  //     removed_doc_list,
  //     reviewers,
  //     action_error_list,
  //     attachments: existingAttachments = [],
  //     send_back_task_id,
  //     non_form_error_list,
  //     selected_task_assignee,
  //   } = state;
  //   const { sendBackReviewComments } = this.state;
  //   const { is_test_bed_task } = task_log_info;
  //   const isTestBed = is_test_bed_task;
  //   const postData = post_data.data ? post_data.data : {};
  //   postData.instance_id = active_task_details.task_log_info.instance_id;
  //   postData.form_id = active_task_details.form_metadata.form_id;
  //   postData.task_log_id = active_task_details.task_log_info._id;
  //   if (!isEmpty(post_data.modified_readOnly_fields)) postData.modified_readOnly_fields = post_data.modified_readOnly_fields;

  //   const attachments = [];
  //   jsUtils.forEach(nonFormFiles, (fileUuid) => {
  //     if (jsUtils.has(state, ['document_details', 'file_metadata'])) {
  //       state.document_details.file_metadata.forEach((file_info) => {
  //         if (fileUuid === file_info.file_ref_id) {
  //           attachments.push(file_info._id);
  //         }
  //       });
  //     }
  //   });
  //   existingAttachments?.forEach((eachFile) => {
  //     if (jsUtils.some(nonFormFiles, (fileId) => fileId === eachFile)) attachments.push(eachFile);
  //   });
  //   const actionData = find(active_task_details.form_metadata.actions.action_details, { action: action });
  //   if (unSuccessfullFileUploads.length === 0) {
  //     if (!jsUtils.isEmpty(action) && !isSaveTask) {
  //       postData.action = actionData.action;
  //     }
  //     // if action data is undefind, we can consider that action as save & close
  //     if (!actionData || ((actionData.action_type !== ACTION_TYPE.CANCEL && actionData.action_type !== ACTION_TYPE.SEND_BACK))) {
  //       if (attachments.length > 0) {
  //         postData.attachments = attachments;
  //       }
  //       if (comments) {
  //         postData.comments = comments;
  //       } else {
  //         jsUtils.unset(postData, [TASK_CONTENT_STRINGS.TASK_COMMENTS(i18next.t).ID]); // if comments is empty don't send it backend will throw error
  //       }
  //       if (removed_doc_list.length > 0) {
  //         set(
  //           postData,
  //           ['document_details', 'removed_doc_list'],
  //           removed_doc_list,
  //         );
  //       }
  //       if (isTestBed && (selectedTestAssignee ? !isEmpty(selectedTestAssignee) : false)) {
  //         postData.complete_as_user = selectedTestAssignee._id;
  //       }
  //       if (isTestBed && (selected_task_assignee ? !isEmpty(selected_task_assignee) : false)) {
  //         postData.complete_as_user = selected_task_assignee;
  //       }
  //     }

  //     // action error list
  //     if (
  //       !isEmpty(actionData) &&
  //       actionData.action_type === ACTION_TYPE.ASSIGN_REVIEW
  //     ) {
  //       if (isObjectFieldsEmpty(reviewers)) {
  //         action_error_list.reviewers_search_value =
  //           ADD_OR_REMOVE_ASSIGNEE_STRINGS(t).REVIEWER_REQUIRED;
  //         await setState({ action_error_list });
  //       } else if (validateInvalidReviewers(reviewers)) {
  //         action_error_list.reviewers_search_value = ADD_OR_REMOVE_ASSIGNEE_STRINGS(t).REVIEW_OWNER_ERROR;
  //       } else {
  //         if (nullCheck(action_error_list, 'reviewers_search_value')) {
  //           jsUtils.unset(action_error_list, 'reviewers_search_value');
  //           await setState({ action_error_list });
  //         }
  //         if (actionData.action_type !== ACTION_TYPE.CANCEL && actionData.action_type !== ACTION_TYPE.SEND_BACK) { postData.reviewers = getUsersAndTeamsIdList(reviewers); }
  //       }
  //       if (isEmpty(sendBackReviewComments)) {
  //         non_form_error_list[TASK_CONTENT_STRINGS.SEND_BACK_REVIEW_COMMENTS.ID] = ADD_OR_REMOVE_ASSIGNEE_STRINGS(t).REVIEW_COMMENT;
  //       } else {
  //         const errorList = validate(
  //           {
  //             comments: sendBackReviewComments,
  //           },
  //           nonFormValidateSchema,
  //         );
  //         if (isEmpty(errorList)) {
  //           postData.comments = sendBackReviewComments;
  //           if (nullCheck(non_form_error_list, TASK_CONTENT_STRINGS.SEND_BACK_REVIEW_COMMENTS.ID)) {
  //             jsUtils.unset(non_form_error_list, TASK_CONTENT_STRINGS.SEND_BACK_REVIEW_COMMENTS.ID);
  //             await setState({ non_form_error_list });
  //           }
  //         } else {
  //           non_form_error_list[TASK_CONTENT_STRINGS.SEND_BACK_REVIEW_COMMENTS.ID] = errorList?.comments;
  //         }
  //       }
  //       await setState({ non_form_error_list });
  //     } else if (
  //       !isEmpty(actionData) &&
  //       actionData.action_type === ACTION_TYPE.SEND_BACK
  //     ) {
  //       if (isEmpty(send_back_task_id)) {
  //         action_error_list.preceding_steps_value =
  //         ADD_OR_REMOVE_ASSIGNEE_STRINGS(t).PRECEEDING_STEPS_REQUIRED;
  //         await setState({ action_error_list });
  //       } else {
  //         if (nullCheck(action_error_list, 'preceding_steps_value')) {
  //           jsUtils.unset(action_error_list, 'preceding_steps_value');
  //           await setState({ action_error_list });
  //         }
  //         postData.send_back_task_id = send_back_task_id;
  //       }
  //       if (isEmpty(sendBackReviewComments)) {
  //         non_form_error_list[TASK_CONTENT_STRINGS.SEND_BACK_REVIEW_COMMENTS.ID] = ADD_OR_REMOVE_ASSIGNEE_STRINGS(t).SEND_BACK_COMMENTS;
  //       } else {
  //         const errorList = validate(
  //           {
  //             comments: sendBackReviewComments,
  //           },
  //           nonFormValidateSchema,
  //         );
  //         if (isEmpty(errorList)) {
  //           postData.comments = sendBackReviewComments;
  //           if (nullCheck(non_form_error_list, TASK_CONTENT_STRINGS.SEND_BACK_REVIEW_COMMENTS.ID)) {
  //             jsUtils.unset(non_form_error_list, TASK_CONTENT_STRINGS.SEND_BACK_REVIEW_COMMENTS.ID);
  //             await setState({ non_form_error_list });
  //           }
  //         } else {
  //           non_form_error_list[TASK_CONTENT_STRINGS.SEND_BACK_REVIEW_COMMENTS.ID] = errorList?.comments;
  //         }
  //       }
  //       await setState({ non_form_error_list });
  //     } else if (nullCheck(action_error_list, 'reviewers_search_value')) {
  //       jsUtils.unset(action_error_list, 'reviewers_search_value');
  //       await setState({ action_error_list });
  //     }

  //     if (isEmpty(action_error_list) && isEmpty(non_form_error_list)) {
  //       setPointerEvent(true);
  //       if (isSaveTask) {
  //         updateActiveTaskDetailsApi(
  //           postData,
  //           post_data.isFormData,
  //           onTaskSuccessfulSubmit,
  //           onCloseIconClick,
  //           history,
  //         );
  //       } else {
  //         const { history } = this.props;
  //         await submitTaskApi(postData, post_data.isFormData, onTaskSuccessfulSubmit, onCloseIconClick, this.readNotificationForCompleted, history);
  //       }
  //     }
  //   } else {
  //   }
  // };

  isTaskSummaryReponseDetailsEmpty = (responseDetails, type) => {
    if (type === TABLE_RESPONSE_SUMMARY) {
      return responseDetails.some(
        (eachResponse) => eachResponse.response !== EMPTY_STRING,
      );
    }
    if (type === CHART_RESPONSE_SUMMARY) {
      return responseDetails.some((eachResponse) => eachResponse.count !== 0);
    }
  };

  callGetAllInstancesByTaskMetadataUuidApi = (page = 1) => {
    const {
      getAllInstancesByTaskMetadataUuidApiCall,
      taskMetadataUUID,
      location,
      respondantsSummary,
    } = this.props;
    const searchParams = getAllSearchParams(
      new URLSearchParams(location.search),
    );

    const params = {
      task_metadata_uuid: searchParams.uuid || taskMetadataUUID,
      page,
      size: respondantsSummary.itemsCountPerPage,
      sort_field: 'processed_on',
      sort_by: -1,
    };
    cancelForGetAllInstancesByTaskMetadataUuid?.();
    getAllInstancesByTaskMetadataUuidApiCall(params);
  };

  closeSendBackReviewModal = () => {
    const { setState, state } = this.props;
    const { action_error_list, non_form_error_list } = state;
    this.setState({
      isSendBackReviewModalOpen: false,
      sendBackReviewComments: null,
    });
    jsUtils.unset(action_error_list, 'reviewers_search_value');
    jsUtils.unset(action_error_list, 'preceding_steps_value');
    jsUtils.unset(non_form_error_list, TASK_CONTENT_STRINGS.SEND_BACK_REVIEW_COMMENTS.ID);
    setState({
      action_error_list,
      non_form_error_list,
      send_back_task_id: [],
      send_back_task_steps: [],
      reviewers: [],
    });
  };

  saveSendBackReview = async (event) => {
    const { state, setState, t } = this.props;
    const { sendBackReviewComments } = this.state;
    const { action, send_back_task_id, reviewers, action_error_list, non_form_error_list } = state;
    let canPostData = true;

    // validate reviewers
    if (action.type === FORM_ACTION_TYPES.ASSIGN_REVIEW) {
      if (isObjectFieldsEmpty(reviewers)) {
        action_error_list.reviewers_search_value = ADD_OR_REMOVE_ASSIGNEE_STRINGS(t).REVIEWER_REQUIRED;
        canPostData = false;
      } else if (validateInvalidReviewers(reviewers)) {
        action_error_list.reviewers_search_value = ADD_OR_REMOVE_ASSIGNEE_STRINGS(t).REVIEW_OWNER_ERROR;
        canPostData = false;
      }
    } else if (nullCheck(action_error_list, 'reviewers_search_value')) {
      jsUtils.unset(action_error_list, 'reviewers_search_value');
    }

    // validate preceding steps
    if (action.type === FORM_ACTION_TYPES.SEND_BACK) {
      if (isEmpty(send_back_task_id)) {
        action_error_list.preceding_steps_value = ADD_OR_REMOVE_ASSIGNEE_STRINGS(t).PRECEEDING_STEPS_REQUIRED;
        canPostData = false;
      } else if (nullCheck(action_error_list, 'preceding_steps_value')) {
        jsUtils.unset(action_error_list, 'preceding_steps_value');
      }
    }

    // validate comments
    if (action.isCommentsMandatory || !isEmpty(sendBackReviewComments)) {
      if (action.isCommentsMandatory && isEmpty(sendBackReviewComments)) {
        non_form_error_list[TASK_CONTENT_STRINGS.SEND_BACK_REVIEW_COMMENTS.ID] = ADD_OR_REMOVE_ASSIGNEE_STRINGS(t).SEND_BACK_COMMENTS;
        canPostData = false;
      } else {
        const errorList = validate({ comments: sendBackReviewComments }, nonFormValidateSchema);
        if (isEmpty(errorList)) {
          jsUtils.unset(non_form_error_list, TASK_CONTENT_STRINGS.SEND_BACK_REVIEW_COMMENTS.ID);
        } else {
          non_form_error_list[TASK_CONTENT_STRINGS.SEND_BACK_REVIEW_COMMENTS.ID] = errorList?.comments;
          canPostData = false;
        }
      }
    }
    await setState({ action_error_list, non_form_error_list });
    if (canPostData) this.buttonClickHandler(event, action, true);
  };

  getCommentsModal = () => {
    const { colorScheme, colorSchemeDefault } = this.context;
    const { state: { action = {}, non_form_error_list, isTaskDataLoading }, setState, t, isBasicUser } = this.props;
    const { isCommentsModalOpen, sendBackReviewComments } = this.state;
    if (!isCommentsModalOpen) return null;
    const { TASK_ACTION_CONFIRMATION } = TASK_CONTENT_STRINGS;
    const isCancelButton = action?.type === FORM_ACTION_TYPES.CANCEL;
    const cancelButtonText = isCancelButton ? TASK_ACTION_CONFIRMATION.DONT_CANCEL : TASK_ACTION_CONFIRMATION.CANCEL;
    const colorSchema = isCancelButton ? { activeColor: UTIL_COLOR.RED_600 } :
    (isBasicUser ? colorScheme : colorSchemeDefault);

    const onCancelClick = () => {
      this.setState({ sendBackReviewComments: '', isCommentsModalOpen: false });
      jsUtils.unset(non_form_error_list, TASK_CONTENT_STRINGS.SEND_BACK_REVIEW_COMMENTS.ID);
      setState({ action: {}, non_form_error_list });
    };

    const onPositiveBtnClick = (e) => {
      // handle Validation;
      let canPost = true;
      if ((action.isCommentsMandatory || !isEmpty(sendBackReviewComments)) && !action.systemButton) {
        if (action.isCommentsMandatory && isEmpty(sendBackReviewComments)) {
          non_form_error_list[TASK_CONTENT_STRINGS.SEND_BACK_REVIEW_COMMENTS.ID] = ADD_OR_REMOVE_ASSIGNEE_STRINGS(t).SEND_BACK_COMMENTS;
          canPost = false;
        } else {
          const errorList = validate({ comments: sendBackReviewComments?.trim() }, nonFormValidateSchema);
          if (isEmpty(errorList)) {
            jsUtils.unset(non_form_error_list, TASK_CONTENT_STRINGS.SEND_BACK_REVIEW_COMMENTS.ID);
          } else {
            non_form_error_list[TASK_CONTENT_STRINGS.SEND_BACK_REVIEW_COMMENTS.ID] = errorList?.comments;
            canPost = false;
          }
        }
      }
      setState({ non_form_error_list });
      if (canPost) this.buttonClickHandler(e, action, false, true);
    };

    return (
      <Modal
        id="review-comments"
        modalStyle={ModalStyleType.dialog}
        dialogSize={DialogSize.sm}
        isModalOpen
        mainContent={
          <div className={gClasses.P24}>
            <Title content={TASK_ACTION_CONFIRMATION.TITLE} size={ETitleSize.small} className={gClasses.MB16} />
            <div className={cx(gClasses.DisplayFlex, gClasses.MB16, gClasses.gap8)}>
              <Text content={TASK_ACTION_CONFIRMATION.TASK_ACTION} />
              <Text content={action.value} fontClass={gClasses.FontWeight500} />
            </div>

            {action.askForComments &&
            <TextArea
              placeholder={t(TASK_CONTENT_STRINGS.SEND_BACK_REVIEW_COMMENTS.PLACEHOLDER)}
              labelText={t(TASK_CONTENT_STRINGS.SEND_BACK_REVIEW_COMMENTS.LABEL)}
              required={action.isCommentsMandatory}
              onChange={this.onSendBackReviewCommentsChangeHandler}
              id={TASK_CONTENT_STRINGS.SEND_BACK_REVIEW_COMMENTS.ID}
              value={sendBackReviewComments}
              errorMessage={non_form_error_list[TASK_CONTENT_STRINGS.SEND_BACK_REVIEW_COMMENTS.ID]}
              className={gClasses.MB16}
              size={Size.sm}
              disabled={!action.askForComments}
              readOnly={!action.askForComments}
            />}

            <div className={cx(gClasses.DisplayFlex, gClasses.JusEnd, gClasses.Gap16)}>
              <button
                onClick={onCancelClick}
                className={cx(gClasses.FS13, gClasses.FontWeight500)}
                disabled={isTaskDataLoading}
              >
                {cancelButtonText}
              </button>
              <LibraryButton
                buttonText={action.value}
                onClickHandler={onPositiveBtnClick}
                colorSchema={colorSchema}
                disabled={isTaskDataLoading}
              />
            </div>
          </div>
        }
      />
    );
  };

  getTaskContentReducerState = () => cloneDeep(store.getState().TaskContentReducer);

  getPostUpdateAttachmentProps = (task_log_info, metadata_info) => {
    const { userProfileData } = this.state;
    switch (task_log_info?.task_category) {
      case TASK_CATEGORY_FLOW_ADHOC_TASK:
      case TASK_CATEGORY_FLOW_TASK:
        return {
          entity: DOCUMENT_TYPES.ACTION_HISTORY,
          type: ENTITY.INSTANCE_NOTES,
          context_id: task_log_info?.instance_id,
          context_uuid: task_log_info?.flow_uuid,
          maxFileSize: userProfileData?.maximum_file_size,
          allowedFileTypes: userProfileData?.allowed_extensions,
        };
      case TASK_CATEGORY_ADHOC_TASK:
        return {
          entity: DOCUMENT_TYPES.ACTION_HISTORY,
          type: ENTITY.INSTANCE_NOTES,
          context_id: task_log_info?.instance_id,
          context_uuid: task_log_info?.task_metadata_uuid,
          maxFileSize: userProfileData?.maximum_file_size,
          allowedFileTypes: userProfileData?.allowed_extensions,
        };
      case TASK_CATEGORY_DATALIST_ADHOC_TASK:
        return {
          entity: DOCUMENT_TYPES.ACTION_HISTORY,
          type: DOCUMENT_TYPES.DATA_LIST_ENTRY_ATTACHMENTS,
          context_id: metadata_info?.data_list_entry_id,
          context_uuid: metadata_info?.data_list_uuid,
          maxFileSize: userProfileData?.maximum_file_size,
          allowedFileTypes: userProfileData?.allowed_extensions,
        };
      default:
        break;
    }
  };

  isActionButtonVisible = (action_detail = {}, button_visiblity = {}) => {
    if (isEmpty(button_visiblity) || isEmpty(action_detail)) return false;
    if (has(button_visiblity, [action_detail.action_name])) return button_visiblity[action_detail.action_name];
    return false;
  };

  promptBeforeLeaving = (location) => {
    const { blockNavigation } = this.state;
    const { onTaskListDataChange, id } = this.props;
    const { history } = this.props;
    console.log('asdfasfasdfasdfasf', location, history);
    if (location?.state?.hideClosePopper) return;
    else if (location?.state?.switchTab) {
      console.log('asdfasfasdfasdfasf1', location);
      this.setState({ blockNavigation: false });
      const completedTaskIdPathName = `${TASKS}/${COMPLETED_TASKS}/${id}`;
      routeNavigate(history, ROUTE_METHOD.PUSH, completedTaskIdPathName, null, { hideClosePopper: true });
      onTaskListDataChange({
        selectedCardTab: TASK_TAB_INDEX.COMPLETED,
        tab_index: TASK_TAB_INDEX.COMPLETED,
        active_tasks_list: [],
      });
    } else if ((location.pathname !== SIGNIN) && blockNavigation &&
      (history.location.pathname !== location.pathname) && !history?.location?.state?.hideClosePopper) {
        console.log('asdfasfasdfasdfasf2', history, location);

      handleBlockedNavigation(
        i18next.t,
        () => {
          this.setState({ blockNavigation: false });
        },
        history,
        {
          ...location,
        },
      );
    } else {
      console.log('asdfasfasdfasdfasf4', location);
      return true;
    }
    return false;
  };
}

const mapStateToProps = (state, ownProps) => {
  return {
    state: state.TaskContentReducer,
    error_list: state.TaskContentReducer.error_list,
    show_accept_reject: state.TaskContentReducer.show_accept_reject,
    show_reassign: state.TaskContentReducer.show_reassign,
    hideTaskList: state.TaskContentReducer.hideTaskList,
    initiateFlowTask: state.TaskContentReducer.initiateFlowTask,
    assigneesCount: state.TaskContentReducer.assigneesCount,
    cancelledCount: state.TaskContentReducer.cancelledCount,
    isRefresh: state.TaskReducer.isRefresh,
    selectedCardTab: state.TaskReducer?.selectedCardTab || ownProps?.selectedCardTab,
    taskListTabIndex: state.TaskReducer.tab_index,
    completedAssignees: state.TaskContentReducer.completedAssignees,
    isCompletedAssigneesLoading:
      state.TaskContentReducer.isCompletedAssigneesLoading,
    individualResponseSelectedValue:
      state.TaskContentReducer.individualResponseSelectedValue,
    isResponseCardDataLoading:
      state.TaskContentReducer.isResponseCardDataLoading,
    reviewers: state.TaskContentReducer.reviewers,
    reviewersSearchValue: state.TaskContentReducer.reviewersSearchValue,
    action_error_list: state.TaskContentReducer.action_error_list,
    completedAssigneesDocumentUrlDetails:
      state.TaskContentReducer.completedAssigneesDocumentUrlDetails,
    isAddOrRemoveAssigneeModalVisible:
      state.TaskContentReducer.addOrRemoveAssignee.isModalVisible,
    taskMetadataUUID: state.TaskContentReducer.taskMetadata.task_metadata_uuid,
    taskMetadataID: state.TaskContentReducer.active_task_details.task_log_info.task_metadata_id,
    allInstances: state.TaskContentReducer.respondantsSummary.allInstances,
    respondantsSummary: state.TaskContentReducer.respondantsSummary,
    activeTask: getActiveTaskDetail(state.TaskReducer),
    navigationLink: state.TaskContentReducer.navigationLink,
    referenceId: state.TaskContentReducer.referenceId,
    working_days: state.LanguageAndCalendarAdminReducer.working_days,
    selectedTestAssignee: state.TaskContentReducer.selectedTestAssignee,
    test_bed_error_list: state.TaskContentReducer.test_bed_error_list,
    assign_to_others: state.TaskContentReducer.assign_to_others,
    download_list: state.DownloadWindowReducer.download_list,
    individualResponseSelectedInstanceId: state.TaskContentReducer.individualResponseSelectedInstanceId,
    taskAssignee: state.TaskContentReducer.taskAssignee,
    isShowAppTasks: state.RoleReducer.is_show_app_tasks,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    toggleModal: (data) => {
      dispatch(NavBarDataChange(data));
    },
    submitTaskApi: (value, bool, func, onCloseIconClick, readNotificationForCompleted, history, onSubmitFailure, onSuccess) => {
      dispatch(submitTaskApiThunk(value, bool, func, onCloseIconClick, readNotificationForCompleted, history, onSubmitFailure, onSuccess));
    },
    replicateTaskApi: (params, history, refreshTaskListApiParams) => {
      dispatch(replicateTaskApiThunk(params, history, refreshTaskListApiParams));
    },
    snoozeTaskApi: (params, onCloseIconClick, closeSnoozeTask, history) => {
      dispatch(snoozeTaskApiThunk(params, onCloseIconClick, closeSnoozeTask, history));
    },
    updateActiveTaskDetailsApi: (...params) =>
      dispatch(updateActiveTaskDetailsApiAction(...params)),
    getTaskCompletedAssigneesApi: (value, func, refresh) => {
      dispatch(getTaskCompletedAssigneesApiThunk(value, func, refresh));
    },
    getTaskMetadataApi: (value) => {
      dispatch(getTaskMetadataApiThunk(value));
    },
    getSignedUrlApi: (value, func, type) => {
      dispatch(getSignedUrlApiThunk(value, func, type));
    },
    setState: (value) => dispatch(taskContentDataChange(value)),
    clearState: (value) => {
      dispatch(clearTaskContentData(value));
    },
    onTaskListDataChange: (value) => {
      dispatch(taskListDataChange(value));
    },
    hideTaskListComplete: () => {
      dispatch(hideTaskListCompleted());
    },
    getTaskResponseSummaryApi: (params) => {
      dispatch(getTaskResponseSummaryApiThunk(params));
    },
    clearTaskResponseSummaryReduxData: () => {
      dispatch(clearTaskResponseSummaryData());
    },
    getTaskFormDetailsApi: (params) => {
      dispatch(getTaskFormDetailsApiThunk(params));
    },
    getFieldVisibilityList: (data, document_url_details, removedDocs) => {
      dispatch(getFieldVisibilityListApiThunk(data, document_url_details, removedDocs));
    },
    getExportTaskDetails: (task_metadata_uuid) => {
      dispatch(getExportTaskDetailsThunk(task_metadata_uuid));
    },
    setAddOrRemoveAssigneeData: (...params) =>
      dispatch(setAddOrRemoveAssigneeDataAction(...params)),
    clearAddOrRemoveAssigneeData: (...params) =>
      dispatch(clearAddOrRemoveAssigneeDataAction(...params)),
    getAllInstancesByTaskMetadataUuidApiCall: (...params) =>
      dispatch(getAllInstancesByTaskMetadataUuidApiAction(...params)),
    nudgeTaskApiCall: (...params) => dispatch(nudgeTaskApiAction(...params)),
    getLanguageAndCalendarData: (value) => {
      dispatch(getLanguageAndCalendarDataThunk(value));
      return Promise.resolve();
    },
    clearVisibilityApiQueue: () => {
      dispatch(clearApiQueue());
    },
    postUpdateApiAction: (data, isCommentPosted, task_log_info, closePostModal) => {
      dispatch(postUpdateApiThunk(data, isCommentPosted, task_log_info, closePostModal));
    },
    setReassignTaskAPI: (...params) =>
      dispatch(setReassignTaskActionThunk(...params)),
    onUpdateTaskStatus: (acceptData, onCloseIconClick, statevariables, setDashboardNavigationLink) => {
      dispatch(postUpdateTaskStatus(acceptData, onCloseIconClick, statevariables, setDashboardNavigationLink));
    },
    onRejectTask: (rejectData, history, onCloseIconClick) => {
      dispatch(postRejectTask(rejectData, history, onCloseIconClick));
    },
    setSelectedAssigneeData: (assigneeData) => {
      dispatch(setSelectedAssigneeData(assigneeData));
    },
    updateActiveTaskData: (activeTask) => {
      dispatch(activeTaskDataChange(activeTask));
    },
    dispatch,
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(withTranslation()(TaskContent)),
);

TaskContent.defaultProps = {
  id: null,
  setModalBg: null,
  individualResponseSelectedValue: null,
  completedAssignees: [],
  isCompletedAssigneesLoading: false,
  isResponseCardDataLoading: false,
  selectedCardTab: null,
  isRefresh: false,
  taskListTabIndex: 0,
  taskMetadata: {},
};

TaskContent.propTypes = {
  id: PropTypes.string,
  onTaskSuccessfulSubmit: PropTypes.func.isRequired,
  submitTaskApi: PropTypes.func.isRequired,
  getSignedUrlApi: PropTypes.func.isRequired,
  setState: PropTypes.func.isRequired,
  clearState: PropTypes.func.isRequired,
  state: PropTypes.objectOf(PropTypes.any).isRequired,
  error_list: PropTypes.objectOf(PropTypes.any).isRequired,
  assigneesCount: PropTypes.number.isRequired,
  location: PropTypes.shape({
    hash: PropTypes.string,
    key: PropTypes.string,
    search: PropTypes.string,
    state: PropTypes.objectOf(PropTypes.any),
    pathname: PropTypes.string,
  }).isRequired,
  setModalBg: PropTypes.func,
  dispatch: PropTypes.func.isRequired,
  individualResponseSelectedValue: PropTypes.string,
  completedAssignees: PropTypes.arrayOf(PropTypes.any),
  isCompletedAssigneesLoading: PropTypes.bool,
  isResponseCardDataLoading: PropTypes.bool,
  selectedCardTab: PropTypes.number,
  isRefresh: PropTypes.bool,
  taskListTabIndex: PropTypes.number,
  getTaskMetadataApi: PropTypes.func.isRequired,
  getTaskFormDetailsApi: PropTypes.func.isRequired,
  getTaskResponseSummaryApi: PropTypes.func.isRequired,
  history: PropTypes.objectOf(PropTypes.any).isRequired,
  taskMetadata: PropTypes.objectOf(PropTypes.any),
};

TaskContent.contextType = ThemeContext;
