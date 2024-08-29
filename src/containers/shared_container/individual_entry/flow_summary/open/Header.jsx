/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState } from 'react';
import cx from 'classnames/bind';
import { PD_SUMMARY_STRINGS } from 'containers/flow/flow_dashboard/FlowDashboard.string';
import Dropdown from 'components/form_components/dropdown/Dropdown';
import { POPPER_PLACEMENTS } from 'components/auto_positioning_popper/AutoPositioningPopper';
import MeatBallMenu from 'assets/icons/reassign_task/MeatBallMenu';
import { connect, useSelector } from 'react-redux';
import { flowDashboardDataChange } from 'redux/actions/FlowDashboard.Action';
import { EMPTY_STRING } from 'utils/strings/CommonStrings';
import ReassignModal from 'components/reassign_modal/ReassignModal';
import { REASSIGN_MODAL } from 'containers/flow/Flow.strings';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import styles from './Open.module.scss';
import gClasses from '../../../../../scss/Typography.module.scss';
import { TASK_REASSIGN_OPTIONS, getFormattedDateAndTimeLabel } from '../Summary.utils';
import { isBasicUserMode, keydownOrKeypessEnterHandle } from '../../../../../utils/UtilityFunctions';
import { ARIA_ROLES, BS } from '../../../../../utils/UIConstants';
import ReviewTaskIcon from '../../../../../assets/icons/ReviewTaskIcon';
import { constructUserTeamPickerByClosedBy } from '../../../../application/app_components/dashboard/flow/flow_instance/FlowInstance.utils';
import { getUserDisplayGroup } from '../../../../application/app_components/task_listing/TaskListing.utils';

function Header(props) {
  const {
    index, task_name, taskStatus, dateTime,
    usersTeams, usersTeamsLabel,
    onHeaderClick,
    isShow,
    instanceSummary,
    taskLogId,
    dataChange,
    isOwnerUser,
    isTestBed,
    className,
    is_owner_user,
    flowUuid,
    isReviewStep,
  } = props;
  const history = useHistory();
  const isNormalMode = isBasicUserMode(history);
  const userTeamPickerPopOverData = constructUserTeamPickerByClosedBy(usersTeams);
  const showCreateTask = useSelector((state) => state.RoleReducer.is_show_app_tasks);
  const { t } = useTranslation();
  const [isModalVisible, setIsModalVisible] = useState(false);
  let modalContent = null;
  let modalContainer = null;

  const handleTaskDropdownChange = () => {
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    dataChange({
      reassignModal: {
        error_list: {},
      },
      reassignTaskDetails: {
        reassignedUsers: {
          teams: [],
          users: [],
        },
        member_team_search_value: EMPTY_STRING,
      },
    });
  };

  modalContainer = (
    <ReassignModal
    instanceSummary={{
      ...instanceSummary,
      task_name: task_name }}
    taskLogId={taskLogId}
    modalVisiblity
    closeModal={closeModal}
    flowUuid={flowUuid}
    />
  );

  modalContent = (
    <Dropdown
    id={REASSIGN_MODAL.SUMMARY.OPEN}
    optionList={TASK_REASSIGN_OPTIONS(t)}
    onChange={handleTaskDropdownChange}
    selectedValue={0}
    hideLabel
    isNewDropdown
    popperPlacement={POPPER_PLACEMENTS.LEFT}
    inputDropdownContainer={cx(gClasses.BorderNone, styles.InputDropdownContainer)}
    optionListClassName={styles.InnerClass}
    optionListDropDown={styles.OptionListDropDownStyles}
    customDisplay={<MeatBallMenu role={ARIA_ROLES.IMG} ariaLabel="More Options" />}
    customContentStyle={styles.CustomContentStyle}
    isCustomFilterDropdown
    isSummaryMenu
    dropdownListVisibilityConditionProps={gClasses.MR10}
    isUserDropdownLabel={cx(BS.D_FLEX, BS.ALIGN_ITEM_CENTER)}
    />
  );

  const circleTextClass = cx(
    gClasses.CenterVH,
  );

  const elementLabelWithUserDisplay = (
    <div className={cx(
      gClasses.Ellipsis,
      gClasses.FTwo12BlueV39,
      gClasses.DisplayFlex,
    )}
    >
    <span className={cx(gClasses.MR5, gClasses.FTwo12GrayV53)}>{usersTeamsLabel}</span>
    {getUserDisplayGroup(userTeamPickerPopOverData, isNormalMode && showCreateTask, true)}
    </div>
  );

  const userTeamsElement = usersTeams ? (taskStatus === 'assigned' ? (
    <div className={cx(gClasses.CenterV, BS.JC_END)}>
      {getUserDisplayGroup(usersTeams, isNormalMode && showCreateTask, true)}
    </div>
  ) : elementLabelWithUserDisplay) : null;

  return (
    <div
       className={cx(className, `card-header ${styles.cardheaderNobg}`)}
       id="headingFour"
       onClick={() => onHeaderClick(isShow, index)}
       onKeyDown={(e) => keydownOrKeypessEnterHandle(e) && onHeaderClick(isShow, index)}
       tabIndex={0}
       role="button"
    >
      <div>
      <div
        id={REASSIGN_MODAL.HEADER.REASSIGN_MODALVIEW}
        onClick={(e) => { e.stopPropagation(); }}
        tabIndex={0}
        role="button"
      >
        {isModalVisible && modalContainer}
      </div>
        <div>
        <div className={cx(BS.D_FLEX, BS.JC_BETWEEN)}>
        <div className={cx(BS.D_FLEX, gClasses.CenterV)}>
          <div className={cx(styles.Circle1, styles.OpenBg, circleTextClass, styles.AccsummaryCircle)}>
            {isReviewStep ? <ReviewTaskIcon className={styles.ReviewIcon} /> : (index + 1)}
          </div>
          <div>
          <span className={styles.AccTitle} title={task_name}>{task_name}</span>
          <div className={cx(BS.D_FLEX, gClasses.WordWrap)}>
                    {taskStatus === 'assigned' &&
                    (
                    <div
                      className={cx(
                        gClasses.FTwo12GrayV53,
                        gClasses.CenterV,
                        gClasses.MT2,

                      )}
                    >
                      {PD_SUMMARY_STRINGS(t).OPEN_WITH}
                    </div>
                    )}
                    <div
                      className={cx(
                        gClasses.FTwo12BlueV21,
                        gClasses.ML5,
                        gClasses.MT3,
                        gClasses.CenterV,
                      )}
                    >
                    {userTeamsElement}
                    </div>
                    <div
                      className={cx(
                        gClasses.FTwo12GrayV53,
                        gClasses.ML3,
                        gClasses.CenterV,
                      )}
                    >
                    {PD_SUMMARY_STRINGS(t).ON}
                    </div>
                    <div
                      className={cx(
                        gClasses.FTwo12GrayV53,
                        gClasses.ML3,
                        gClasses.CenterV,
                      )}
                    >
                    {getFormattedDateAndTimeLabel(dateTime)}
                    </div>
          </div>
          </div>
        </div>
        <div
          id={REASSIGN_MODAL.HEADER.REASSIGN_MODAL_OUTER}
          onClick={(e) => { e.stopPropagation(); }}
          tabIndex={0}
          role="button"
          className={gClasses.PT15}
        >
          {(isOwnerUser || is_owner_user) && !isTestBed && !instanceSummary?.is_test_bed_task && modalContent}
        </div>
        </div>
        </div>
      </div>
    </div>
  );
}

const mapDispatchToProps = (dispatch) => {
  return {
    dataChange: (data) => {
      dispatch(flowDashboardDataChange(data));
    },
  };
};

const mapStateToProps = (state) => {
  return {
    isOwnerUser: state.FlowDashboardReducer.canReassign,
    isTestBed: state.FlowDashboardReducer.isTestBed,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
