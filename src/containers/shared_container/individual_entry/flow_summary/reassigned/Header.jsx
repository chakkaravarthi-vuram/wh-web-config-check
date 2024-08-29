/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState } from 'react';
import cx from 'classnames/bind';
import { PD_SUMMARY_STRINGS, SUMMARY_STATUS } from 'containers/flow/flow_dashboard/FlowDashboard.string';
import { flowDashboardDataChange } from 'redux/actions/FlowDashboard.Action';
import { connect, useSelector } from 'react-redux';
import { EMPTY_STRING } from 'utils/strings/CommonStrings';
import ReassignModal from 'components/reassign_modal/ReassignModal';
import Dropdown from 'components/form_components/dropdown/Dropdown';
import { POPPER_PLACEMENTS } from 'components/auto_positioning_popper/AutoPositioningPopper';
import MeatBallMenu from 'assets/icons/reassign_task/MeatBallMenu';
import { REASSIGN_MODAL } from 'containers/flow/Flow.strings';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { AvatarSizeVariant, EPopperPlacements, AvatarGroup } from '@workhall-pvt-lmt/wh-ui-library';
import styles from './Reassigned.module.scss';
import gClasses from '../../../../../scss/Typography.module.scss';
import { TASK_REASSIGN_OPTIONS, getFormattedDateAndTimeLabel } from '../Summary.utils';
import { getPopperContent, isBasicUserMode, keydownOrKeypessEnterHandle } from '../../../../../utils/UtilityFunctions';
import { ARIA_ROLES, BS } from '../../../../../utils/UIConstants';
import { getUserDisplayGroup } from '../../../../application/app_components/task_listing/TaskListing.utils';
import { constructUserTeamPickerByClosedBy } from '../../../../application/app_components/dashboard/flow/flow_instance/FlowInstance.utils';
import { constructAvatarGroupList } from '../../../../application/app_listing/AppListing.utils';

function Header(props) {
  const {
    index, task_name, taskStatus, dateTime,
    usersTeams,
    onHeaderClick,
    isShow,
    instanceSummary,
    taskLogId,
    dataChange,
    isOwnerUser,
    className,
    is_owner_user,
    flowUuid,
  } = props;
  const { t } = useTranslation();
  // const [taskDropdown, setTaskDropdown] = useState(0);
  const history = useHistory();
  const isNormalMode = isBasicUserMode(history);
  const showCreateTask = useSelector((state) => state.RoleReducer.is_show_app_tasks);
  const [isModalVisible, setIsModalVisible] = useState(false);
  let modalContent = null;
  let modalContainer = null;
  const userTeamPickerPopOverData = constructUserTeamPickerByClosedBy(usersTeams);

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
    instanceSummary={instanceSummary}
    taskLogId={taskLogId}
    modalVisiblity
    closeModal={closeModal}
    flowUuid={flowUuid}
    />
  );

  modalContent = (
    <Dropdown
    id={REASSIGN_MODAL.SUMMARY.REASSIGNED}
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
  const userTeamsElement = usersTeams ? (taskStatus === 'assigned' ? (
    <div className={cx(gClasses.CenterV, BS.JC_END)}>
      <AvatarGroup
        userImages={constructAvatarGroupList({ users: usersTeams.users, teams: usersTeams.teams }, true)}
        allAvatarData={constructAvatarGroupList({ users: usersTeams.users, teams: usersTeams.teamss }, true)}
        count={1}
        size={AvatarSizeVariant.xs}
        popperPlacement={EPopperPlacements.AUTO}
        getPopperContent={(id, type, onShow, onHide) =>
          getPopperContent(id, type, onShow, onHide, history, true)
        }
        getRemainingPopperContent={(id, type, onShow, onHide) =>
          getPopperContent(id, type, onShow, onHide, history, true)
        }
        className={gClasses.MR0}
      />
    </div>
  ) : getUserDisplayGroup(userTeamPickerPopOverData, isNormalMode && showCreateTask, true)) : null;

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
        <div className={cx(BS.D_FLEX, BS.JC_BETWEEN)}>
        <div className={cx(BS.D_FLEX, gClasses.CenterV)}>
          <div className={cx(styles.Circle1, styles.OpenBg, circleTextClass, styles.AccsummaryCircle)}>
            {(index + 1)}
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
                      )}
                    >
                      {SUMMARY_STATUS(t).REASSIGN_TO}
                    </div>
                    )}
                    {taskStatus === 'accepted' &&
                    (
                    <div
                      className={cx(
                        gClasses.FTwo12GrayV53,
                        gClasses.CenterV,
                      )}
                    >
                      {SUMMARY_STATUS(t).ACCEPTED_BY}
                    </div>
                    )}
                    <div
                      className={cx(
                        gClasses.FTwo12BlueV21,
                        gClasses.ML3,
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
                     on:
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
        <div className={BS.D_FLEX}>
        <div
            className={cx(BS.JC_END, styles.AccnotStartedtxt)}
        >
           {instanceSummary?.is_reassigned && PD_SUMMARY_STRINGS(t).REASSIGNED_LABEL}
        </div>
        <div
          id={REASSIGN_MODAL.HEADER.REASSIGN_MODAL_OUTER}
          onClick={(e) => { e.stopPropagation(); }}
          tabIndex={0}
          role="button"
        >
        {(isOwnerUser || is_owner_user) && modalContent}
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
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
