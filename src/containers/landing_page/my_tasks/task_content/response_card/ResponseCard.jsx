import React, { useEffect, useState, lazy } from 'react';
import cx from 'classnames/bind';
import Skeleton from 'react-loading-skeleton';
import PropTypes from 'prop-types';
import { HEADER_TAB } from 'containers/flow/flow_dashboard/FlowDashboard.string';
import Tab, { TAB_TYPE } from 'components/tab/Tab';
import { ICON_STRINGS } from 'containers/sign_in/SignIn.strings';
import InProgressIcon from 'assets/icons/InprogressIcon';
import AvatarGroup from 'components/avatar_group/AvatarGroup';
import AcceptPendingIcon from 'assets/icons/AcceptPending';
import { useTranslation } from 'react-i18next';
import styles from './ResponseCard.module.scss';
import gClasses from '../../../../../scss/Typography.module.scss';
import { ARIA_ROLES, BS } from '../../../../../utils/UIConstants';
import {
  TASK_CONTENT_STRINGS,
  TASK_STATUS_TYPES,
} from '../../../LandingPage.strings';
import CorrectIcon from '../../../../../assets/icons/CorrectIcon';
import jsUtils, {
  intersectionWith,
  isEmpty,
  get,
} from '../../../../../utils/jsUtility';
import { getTaskStatusLabel } from '../TaskContent.utils';
import { getSignedUrlFromDocumentUrlDetails } from '../../../../../utils/profileUtils';
import { getFileNameFromServer, getUserImagesForAvatar, keydownOrKeypessEnterHandle } from '../../../../../utils/UtilityFunctions';
import TaskHistory from '../task_history/TaskHistory';
import { MODULE_TYPES } from '../../../../../utils/Constants';
import { FORM_TYPE } from '../../../../form/Form.string';

// lazy imports
const Form = lazy(() => import('../../../../form/Form'));
const UserImage = lazy(() =>
  import('../../../../../components/user_image/UserImage'));
const ResponseHandler = lazy(() =>
  import('../../../../../components/response_handlers/ResponseHandler'));

export default function ResponseCard(props) {
  const {
    taskDetails,
    isTaskDataLoading,
    taskState,
    completedAssignees,
    selectedValue,
    isCompletedAssigneesLoading,
    completedAssigneesDocumentUrlDetails,
    selectedInstanceId,
    taskAssignee,
    is_assign_to_individual_assignees,
    activeTask,
    onFormFillUpdate,
  } = props;

  const [documentsList, setDocumentList] = useState([]);
  const { t } = useTranslation();
  const downloadFile = (link) => {
    window.open(`${link}&is_download=true`, '_blank');
  };
  const instanceId = selectedInstanceId;
  const taskLogId = selectedValue;
  const assignees = get(taskAssignee && taskAssignee[0], ['assigned_to'], {});

  useEffect(() => {
    const documentArray =
      taskDetails.active_task_details &&
      taskDetails.active_task_details.attachments
        ? intersectionWith(
            taskDetails.document_details,
            taskDetails.active_task_details.attachments,
            (document, attachment) => document.document_id === attachment,
          )
        : [];
    documentArray.map(async (doc) => {
      // doc.signedurl = await getDownloadUrl(doc.signedurl);
      setDocumentList([...documentsList, doc]);
    });
  }, []);

  let firstName;
  let lastName;
  let completedOn;
  let displayContent;
  let pic;
  const readOnlyTextClass = cx(
    gClasses.FOne13GrayV3,
    BS.TEXT_JUSTIFY,
    gClasses.MinHeight18,
    gClasses.MinWidth50,
  );
  const [tabIndex, setTabIndex] = useState(0);
  const onTabChange = (index) => {
    setTabIndex(index);
   };
  console.log('ioio', taskDetails);
  const documentListDiv = documentsList.map((eachDocument) => (
    <div
      className={cx(gClasses.FOne12BlueV17, gClasses.Underline, gClasses.MR15, gClasses.CursorPointer)}
      onClick={() => downloadFile(eachDocument.signedurl)}
      tabIndex={0}
      role="button"
      onKeyDown={(e) => keydownOrKeypessEnterHandle(e) && downloadFile(eachDocument.signedurl)}
    >
        {getFileNameFromServer(eachDocument.original_filename)}
    </div>
  ));
  if (isTaskDataLoading || isCompletedAssigneesLoading) {
    displayContent = (
      <div className={cx(gClasses.MT20, gClasses.MB50)}>
        <div className={cx(gClasses.MT15)}>
          <div className={cx(styles.Container, BS.D_FLEX)}>
            <Skeleton width={32} height={32} circle />
            <div
              className={cx(gClasses.ML15, gClasses.MT5)}
              style={{ width: 'calc(100% - 47px)' }}
            >
              <div className={cx(BS.D_FLEX, BS.JC_BETWEEN, gClasses.CenterV)}>
                <Skeleton width={250} />
                <Skeleton width={150} />
              </div>
              <div className={gClasses.MT20}>
                <Skeleton width={150} height={10} />
              </div>
              <div className={gClasses.MT10}>
                <Skeleton width={75} height={10} />
              </div>
              <div className={gClasses.MT10}>
                <Skeleton width={150} height={10} />
              </div>
              <div className={gClasses.MT10}>
                <Skeleton width={75} height={10} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } else if (!isTaskDataLoading && !isCompletedAssigneesLoading) {
    let performedBy;
    let closedOn;
    const completedAssignee = jsUtils.find(completedAssignees, {
      _id: selectedValue,
    });

    if (completedAssignee) {
      performedBy = completedAssignee.assigned_to;
      closedOn = completedAssignee.closed_on;
    }

    if (jsUtils.has(taskDetails, ['active_task_details', 'performed_by'])) {
      performedBy = taskDetails.active_task_details.performed_by;
    }
    if (completedAssignees.length && performedBy) {
      taskState.active_task_details = taskState.assignee_task_details;
      firstName = performedBy.isTeam
        ? jsUtils.capitalize(performedBy.team_name)
        : jsUtils.capitalize(performedBy.first_name);
      lastName = performedBy.isTeam
        ? ''
        : jsUtils.capitalize(performedBy.last_name);
      pic = performedBy.isTeam ? performedBy.team_pic : performedBy.profile_pic;
      completedOn = closedOn ? closedOn.pref_datetime_display : null;
      const taskStatus = completedAssignees.find((value) => value._id === selectedValue);
      const metaData = {
        moduleId: taskDetails.task_log_info._id,
        instanceId: taskDetails.task_log_info.instance_id,
        formUUID: taskDetails.form_metadata.form_uuid,
      };
      const {
        sections = [],
        fields = {},
        activeFormData = {},
        formMetaData = {},
        errorList = {},
        documentDetails = {},
        showSectionName = false,
      } = activeTask || {};
      const formVisibility = formMetaData?.formVisibility || {};

      displayContent = (
        <div className={cx(gClasses.MT20, gClasses.MB50)}>
          <div className={cx(gClasses.MT15)}>
            <div
              className={cx(
                styles.Container,
                BS.D_FLEX,
                gClasses.FlexDirectionColumn,
              )}
            >
              <div className={cx(BS.D_FLEX, BS.W100, gClasses.CenterV)}>
             {(is_assign_to_individual_assignees && get(taskAssignee && taskAssignee[0], ['task_status'], null) === 'assigned') ? (
             <AvatarGroup
                isDataLoading={isTaskDataLoading}
                userImages={getUserImagesForAvatar(
                assignees.users,
                assignees.teams,
                completedAssigneesDocumentUrlDetails,
                )}
                isToolTipRequired
             />) :
                (<UserImage
                  className={styles.UserImage}
                  firstName={firstName}
                  lastName={lastName}
                  src={getSignedUrlFromDocumentUrlDetails(
                    completedAssigneesDocumentUrlDetails,
                    pic,
                  )}
                />)}
                <div
                  className={cx(BS.D_FLEX, gClasses.ML15)}
                  style={{ flex: 1 }}
                >
                 {(!is_assign_to_individual_assignees || get(taskAssignee && taskAssignee[0], ['task_status'], null) !== 'assigned') &&
                  <div
                    className={cx(readOnlyTextClass)}
                  >
{`${firstName} ${lastName}`}

                  </div>}
                </div>
                <div className={cx(gClasses.ML15, gClasses.MT5)}>
                  <div className={cx(BS.D_FLEX)}>
                    <div className={cx(gClasses.FOne12GrayV4)}>
                      {getTaskStatusLabel(taskStatus.task_status, true)}
                    </div>
                    <div className={cx(gClasses.Fone12GrayV3, gClasses.ML5)}>
                      {completedOn}
                    </div>
                    <div
                      className={cx(
                        taskStatus.task_status === TASK_STATUS_TYPES.COMPLETED && styles.CorrectIconCircleBG,
                        gClasses.CenterVH,
                        gClasses.ML5,
                      )}
                    >
                   {(taskStatus.task_status === TASK_STATUS_TYPES.COMPLETED || taskStatus.task_status === TASK_STATUS_TYPES.CANCELLED) ? <CorrectIcon className={styles.CorrectIcon} ariaLabel={ICON_STRINGS.VERIFIED} role={ARIA_ROLES.IMG} /> : ((taskStatus.task_status === TASK_STATUS_TYPES.ASSIGNED) ? <AcceptPendingIcon className={styles.InProgressIcon} /> : <InProgressIcon className={styles.InProgressIcon} />)}

                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.TabBorder}>
                    <Tab
                      tabIList={HEADER_TAB(t)}
                      type={TAB_TYPE.TYPE_2}
                      setTab={(index) => onTabChange(index)}
                      selectedIndex={tabIndex}
                      className={cx(gClasses.MT12, gClasses.ML20)}
                      tabClass={gClasses.Height2}
                    />
              </div>
              {tabIndex === 0 ? (taskStatus.task_status === TASK_STATUS_TYPES.COMPLETED ?
                (((taskDetails.form_metadata &&
                  !jsUtils.isEmpty(taskDetails.form_metadata.sections)) ||
                  !jsUtils.isEmpty(taskDetails.active_task_details.comments) ||
                  !jsUtils.isEmpty(
                    taskDetails.active_task_details.attachments,
                  )) ? (
                  <div
                    className={gClasses.MT15}
                    style={{ alignSelf: 'flex-end', width: '100%' }}
                  >
                    {/* <Form
                      active_task_details={taskDetails}
                      isCompletedForm
                      stateData={{
                        active_task_details: taskDetails,
                        error_list: {},
                        ...formUploadData,
                      }}
                    /> */}
                    <Form
                      moduleType={MODULE_TYPES.TASK}
                      formType={FORM_TYPE.READONLY_FORM}
                      metaData={metaData}
                      sections={sections}
                      fields={fields}
                      activeFormData={activeFormData}
                      onFormFillUpdate={onFormFillUpdate}
                      onValidateField={() => {}}
                      errorList={errorList}
                      formVisibility={formVisibility}
                      formMetaData={formMetaData}
                      documentDetails={documentDetails}
                      showSectionName={showSectionName}
                    />
                    {taskDetails.active_task_details &&
                    taskDetails.active_task_details.comments ? (
                      <div className={cx(BS.D_FLEX, BS.FLEX_COLUMN)}>
                        <div className={cx(gClasses.FieldName)}>
                          Comments
                        </div>
                        <div className={cx(gClasses.FTwo13GrayV3, gClasses.WordWrap)}>
                          {taskDetails.active_task_details.comments}
                        </div>
                        {taskDetails.active_task_details &&
                        !isEmpty(
                          taskDetails.active_task_details.attachments,
                        ) ? (
                          <>
                            <div
                              className={cx(
                                gClasses.FieldName,
                                gClasses.MT10,
                              )}
                            >
                              Attachments
                            </div>
                            {documentListDiv}
                          </>
                        ) : null}
                      </div>
                    ) : null}
                  </div>
                ) : <ResponseHandler
                      className={gClasses.MT70}
                      messageObject={TASK_CONTENT_STRINGS.TASK_DETAILS_NO_RESPONSE}
                />) :
                <ResponseHandler
                  className={gClasses.MT70}
                  messageObject={TASK_CONTENT_STRINGS.TASK_DETAILS_NO_RESPONSE}
                />) :
                <TaskHistory
                  instanceId={instanceId}
                  showNavigationLink={() => false}
                  hideHeader
                  taskLogId={taskLogId}
                />
                }
            </div>
          </div>
        </div>
      );
    } else {
      displayContent = (
        <ResponseHandler
          className={gClasses.MT70}
          messageObject={TASK_CONTENT_STRINGS.TASK_SUMMARY_NO_RESPONSE}
        />
      );
    }
  }
  return displayContent;
}

ResponseCard.defaultProps = {
  taskDetails: {},
  completedAssignees: [],
};

ResponseCard.propTypes = {
  isTaskDataLoading: PropTypes.bool.isRequired,
  taskDetails: PropTypes.shape({
    active_task_details: PropTypes.objectOf(PropTypes.any),
    task_log_info: PropTypes.objectOf(PropTypes.any),
    formContent: PropTypes.objectOf(PropTypes.any),
  }),
};
