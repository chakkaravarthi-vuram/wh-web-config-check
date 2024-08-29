import React, { useEffect, useState, lazy } from 'react';
import cx from 'classnames/bind';
import { Col, Row } from 'reactstrap';
import Skeleton from 'react-loading-skeleton';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { HEADER_TAB } from 'containers/flow/flow_dashboard/FlowDashboard.string';
import Tab, { TAB_TYPE } from 'components/tab/Tab';
import InProgressIcon from 'assets/icons/InprogressIcon';
import { useTranslation } from 'react-i18next';
import styles from './IndividualResponseCard.module.scss';
import gClasses from '../../../../../scss/Typography.module.scss';
import { ARIA_ROLES, BS } from '../../../../../utils/UIConstants';
import {
  TASK_CONTENT_STRINGS,
  TASK_STATUS_TYPES,
} from '../../../LandingPage.strings';
import UserImage from '../../../../../components/user_image/UserImage';
import CorrectIcon from '../../../../../assets/icons/CorrectIcon';
import Dropdown from '../../../../../components/form_components/dropdown/Dropdown';
import ResponseHandler from '../../../../../components/response_handlers/ResponseHandler';
import Pagination from '../../../../../components/form_components/pagination/Pagination';
import { taskContentDataChange } from '../../../../../redux/actions/TaskActions';
import { getTaskStatusLabel } from '../TaskContent.utils';
import jsUtils, { intersectionWith } from '../../../../../utils/jsUtility';
import { getSignedUrlFromDocumentUrlDetails } from '../../../../../utils/profileUtils';
import { getFileNameFromServer, keydownOrKeypessEnterHandle } from '../../../../../utils/UtilityFunctions';
import TaskHistory from '../task_history/TaskHistory';
import { MODULE_TYPES } from '../../../../../utils/Constants';
import { FORM_TYPE } from '../../../../form/Form.string';
import { EMPTY_STRING } from '../../../../../utils/strings/CommonStrings';

// lazy imports
const Form = lazy(() => import('../../../../form/Form'));

function IndividualResponseCard(props) {
  const {
    taskDetails,
    taskState,
    completedAssignees,
    selectedValue,
    onDropDownChangeHandler,
    isCompletedAssigneesLoading,
    totalCount,
    taskResponseSummary,
    isResponseCardDataLoading,
    cancelledCount,
    setState,
    completedAssigneesDocumentUrlDetails,
    selectedInstanceId,
    activeTask,
    onFormFillUpdate,
  } = props;

  const { t } = useTranslation();

  const [documentsList, setDocumentList] = useState([]);
  const [tabIndex, setTabIndex] = useState(0);

  const downloadFile = (link) => {
    window.open(`${link}&is_download=true`, '_blank');
  };

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
  const ICON_STRINGS = {
    VERIFIED: 'Verified',
  };
  console.log('taskResponseSummary', taskResponseSummary, completedAssignees);
  const completedUsersIdList =
    !jsUtils.isEmpty(completedAssignees) &&
    completedAssignees.map(
      (value) => {
        if (value && value.assigned_to && value.assigned_to) return value.assigned_to._id;
        else return value;
      },
    );
  let firstName;
  let lastName;
  let completedOn;
  let displayContent;
  let pic;
  const readOnlyTextClass = cx(
    gClasses.FTwo13GrayV3,
    BS.TEXT_JUSTIFY,
    gClasses.MinHeight18,
    gClasses.MinWidth50,
  );
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
  const dropdownComponent = (list) => (
    <Dropdown
      className={cx(styles.UserDropdown, gClasses.Flex1)}
      optionList={list}
      onChange={(event) => {
        setTabIndex(0);
        onDropDownChangeHandler(event);
      }}
      selectedValue={selectedValue}
      isDataLoading={isCompletedAssigneesLoading}
      hideLabel
      hideMessage
      isIndividualResponseDropdown
      disablePopper
      dropdownListClasses={styles.DropdownListClass}
    />
  );
   const onTabChange = (index) => {
    setTabIndex(index);
   };

  const activePage = !isCompletedAssigneesLoading
    ? completedAssignees.findIndex((item) => item._id === selectedValue) + 1
    : 1;

  const responsedParticipantsString =
      isCompletedAssigneesLoading ? (
        <Skeleton width={200} />
      ) : (
        <div className={cx(gClasses.FTwo13GrayV2)}>
            <span className={cx(gClasses.MR5)}>
              {completedAssignees.length - cancelledCount}
            </span>
            {TASK_CONTENT_STRINGS.TOTAL_ASSIGNEES(totalCount)}
        </div>
      );

  const generateDropdownList = (assignees) => {
    const respondantsUserList = [];
    assignees.forEach((assignee) => {
      if (
        completedUsersIdList &&
        completedUsersIdList.includes(assignee.assigned_to?._id)
      ) {
        respondantsUserList.push({
          label: assignee.isTeam
            ? jsUtils.capitalize(assignee.assigned_to.team_name)
            : `${jsUtils.capitalize(
                assignee.assigned_to.first_name,
              )} ${jsUtils.capitalize(assignee.assigned_to.last_name)}`,
          value: assignee._id,
          instanceId: assignee.instance_id,
        });
      }
    });
    return respondantsUserList;
  };
  const taskLogId = selectedValue;
  const instanceId = selectedInstanceId;
  if (isCompletedAssigneesLoading || isResponseCardDataLoading) {
    displayContent = (
      <div className={cx(gClasses.MT20, gClasses.MB50)}>
        <Row>
          <Col sm={12} md={12} lg={12} xl={6} className={cx(gClasses.CenterV)}>
            {dropdownComponent(generateDropdownList(completedAssignees))}
            {!isCompletedAssigneesLoading && (
              <Pagination
                activePage={activePage}
                itemsCountPerPage={1}
                totalItemsCount={completedAssignees.length}
                onChange={(value) => {
                  if (
                    value !== activePage &&
                    completedAssignees.length &&
                    completedAssignees[value - 1] &&
                    completedAssignees[value - 1]._id
                  ) {
                    setState({
                      individualResponseSelectedValue:
                        completedAssignees[value - 1]._id,
                        individualResponseSelectedInstanceId: completedAssignees[value - 1].instance_id,
                    });
                    setTabIndex(0);
                  }
                }}
                className={cx(
                  gClasses.ML10,
                  completedAssignees.length < 2 && gClasses.Opacity0,
                )}
                type={2}
              />
            )}
          </Col>
          <Col
            sm={12}
            md={12}
            lg={12}
            xl={6}
            className={cx(BS.D_FLEX, BS.JC_END, gClasses.MT6)}
          >
            {responsedParticipantsString}
          </Col>
        </Row>
        <div className={cx(gClasses.MT15)}>
          <div className={cx(styles.Container, BS.D_FLEX)}>
            <Skeleton width={32} height={32} circle />
            <div
              className={cx(gClasses.ML15, gClasses.MT5)}
              style={{ width: 'calc(100% - 47px)' }}
            >
              <div
                className={cx(
                  BS.D_FLEX,
                  BS.JC_BETWEEN,
                  gClasses.CenterV,
                  BS.FLEX_WRAP_WRAP,
                )}
              >
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
  } else if (!isResponseCardDataLoading && completedAssignees.length) {
    let responseDetails;
    let performedBy;
    let closedOn;
    const completedAssignee = jsUtils.find(completedAssignees, {
      _id: selectedValue,
    });

    if (jsUtils.has(taskDetails, ['active_task_details', 'performed_by'])) {
      performedBy = taskDetails.active_task_details.performed_by;
    }
    if (completedAssignee) {
      performedBy = completedAssignee.assigned_to;
      closedOn = completedAssignee.closed_on;
    }

    if (performedBy) {
      taskState.active_task_details = taskState.assignee_task_details;
      firstName = performedBy.isTeam
        ? jsUtils.capitalize(performedBy.team_name)
        : jsUtils.capitalize(performedBy.first_name);
      lastName = performedBy.isTeam
        ? ''
        : jsUtils.capitalize(performedBy.last_name);
      completedOn = closedOn ? closedOn.pref_datetime_display : null;
      pic = performedBy.isTeam ? performedBy.team_pic : performedBy.profile_pic;

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
      const formVisibility = formMetaData?.formVisibility;
      responseDetails = (
        <div className={cx(gClasses.MT15)}>
          <div
            className={cx(
              styles.Container,
              BS.D_FLEX,
              gClasses.FlexDirectionColumn,
            )}
          >
            <div className={cx(BS.D_FLEX, gClasses.CenterV, BS.W100)}>
              <UserImage
                className={styles.UserImage}
                firstName={firstName}
                lastName={lastName}
                role={ARIA_ROLES.IMG}
                src={getSignedUrlFromDocumentUrlDetails(
                  completedAssigneesDocumentUrlDetails,
                  pic,
                )}
              />
              <div className={cx(BS.D_FLEX, gClasses.ML15)} style={{ flex: 1 }}>
                <div
                  className={cx(readOnlyTextClass)}
                >
{`${firstName} ${lastName}`}

                </div>
              </div>
              <div className={cx(gClasses.ML15, gClasses.MT5)}>
                <div className={cx(BS.D_FLEX)}>
                  <div className={cx(gClasses.FTwo12GrayV66)}>
                    {getTaskStatusLabel(taskStatus.task_status)}
                  </div>
                  <div className={cx(gClasses.FTwo12GrayV3, gClasses.ML5)}>
                    {completedOn}
                  </div>
                  <div
                    className={cx(
                      taskStatus.task_status === TASK_STATUS_TYPES.COMPLETED && styles.CorrectIconCircleBG,
                      gClasses.CenterVH,
                      gClasses.ML5,
                    )}
                  >
                    {(taskStatus.task_status === TASK_STATUS_TYPES.COMPLETED || taskStatus.task_status === TASK_STATUS_TYPES.CANCELLED) ? <CorrectIcon className={styles.CorrectIcon} ariaLabel={ICON_STRINGS.VERIFIED} role={ARIA_ROLES.IMG} /> : <InProgressIcon className={styles.InProgressIcon} />}
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
            {tabIndex === 0 && ((taskStatus.task_status === TASK_STATUS_TYPES.COMPLETED) ?
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
                    formMetaData={{ ...formMetaData, formVisibility }}
                    documentDetails={documentDetails}
                    showSectionName={showSectionName}
                  />
                  {taskDetails.active_task_details &&
                  taskDetails.active_task_details.comments ? (
                    <div className={cx(BS.D_FLEX, BS.FLEX_COLUMN)}>
                      <div className={cx(gClasses.FTwo12BlackV13)}>
                        Comments
                      </div>
                      <div className={cx(gClasses.FTwo12GrayV3, gClasses.WordWrap)}>
                        {taskDetails.active_task_details.comments}
                      </div>
                      {taskDetails.active_task_details &&
                      !jsUtils.isEmpty(
                        taskDetails.active_task_details.attachments,
                      ) ? (
                        <>
                          <div
                            className={cx(gClasses.FOne12GrayV4, gClasses.MT10)}
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
                    className={gClasses.MT90}
                    messageObject={{
                      ...TASK_CONTENT_STRINGS.TASK_DETAILS_NO_RESPONSE,
                      subTitle: EMPTY_STRING,
                    }}
              />) :
              (<ResponseHandler
                className={gClasses.MT90}
                messageObject={TASK_CONTENT_STRINGS.TASK_DETAILS_NO_RESPONSE}
              />))
              }
              {
                tabIndex === 1 &&
              <TaskHistory
                instanceId={instanceId}
                showNavigationLink={() => false}
                hideHeader
                taskLogId={taskLogId}
              />
              }
          </div>
        </div>
      );
    } else {
      responseDetails = (
        <ResponseHandler
          className={gClasses.MT90}
          messageObject={TASK_CONTENT_STRINGS.TASK_INDIVIDUAL_NO_DATA_FOUND}
        />
      );
    }
    displayContent = (
      <div className={cx(gClasses.MT20, gClasses.MB50)}>
        <Row>
          <Col sm={12} md={12} lg={12} xl={6} className={cx(gClasses.CenterV)}>
            {dropdownComponent(generateDropdownList(completedAssignees))}
            {!isCompletedAssigneesLoading && (
              <Pagination
                activePage={activePage}
                itemsCountPerPage={1}
                totalItemsCount={completedAssignees.length}
                onChange={(value) => {
                  if (
                    value !== activePage &&
                    completedAssignees.length &&
                    completedAssignees[value - 1] &&
                    completedAssignees[value - 1]._id
                  ) {
                    setState({
                      individualResponseSelectedValue:
                        completedAssignees[value - 1]._id,
                      individualResponseSelectedInstanceId: completedAssignees[value - 1].instance_id,
                    });
                    setTabIndex(0);
                  }
                }}
                className={cx(
                  gClasses.ML10,
                  completedAssignees.length < 2 && gClasses.Opacity0,
                )}
                type={2}
              />
            )}
          </Col>
          <Col
            sm={12}
            md={12}
            lg={12}
            xl={6}
            className={cx(BS.D_FLEX, BS.JC_END, gClasses.MT6)}
          >
            {responsedParticipantsString}
          </Col>
        </Row>
        {responseDetails}
      </div>
    );
  } else {
    displayContent = (
      <ResponseHandler
        className={gClasses.MT90}
        messageObject={TASK_CONTENT_STRINGS.TASK_INDIVIDUAL_NO_RESPONSE}
      />
    );
  }
  return displayContent;
}

const mapDispatchToProps = (dispatch) => {
  return {
    setState: (value) => {
      dispatch(taskContentDataChange(value));
    },
  };
};

export default withRouter(
  connect(null, mapDispatchToProps)(IndividualResponseCard),
);
IndividualResponseCard.defaultProps = {
  taskDetails: {},
  completedAssignees: [],
  selectedValue: null,
};

IndividualResponseCard.propTypes = {
  isTaskDataLoading: PropTypes.bool.isRequired,
  taskDetails: PropTypes.shape({
    active_task_details: PropTypes.objectOf(PropTypes.any),
    task_log_info: PropTypes.objectOf(PropTypes.any),
    formContent: PropTypes.objectOf(PropTypes.any),
  }),
  completedAssignees: PropTypes.arrayOf(PropTypes.any),
  selectedValue: PropTypes.string,
  onDropDownChangeHandler: PropTypes.func.isRequired,
  totalCount: PropTypes.number.isRequired,
};
