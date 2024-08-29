import cx from 'classnames';
import { ASSIGNEE_TYPE } from 'containers/edit_flow/EditFlow.utils';
import React from 'react';
import { get, find, cloneDeep, isEmpty } from 'utils/jsUtility';
import RemainingUsersTooltip from 'components/form_components/remainingUsers/RemainingUsersTooltip';
import { TOOL_TIP_TYPE } from 'utils/Constants';
import { POPPER_PLACEMENTS } from 'components/auto_positioning_popper/AutoPositioningPopper';
import MyTeamIcon from 'assets/icons/side_bar/MyTeamIcon';
import gClasses from 'scss/Typography.module.scss';
import { BS } from 'utils/UIConstants';
import { UserDisplayGroup, EPopperPlacements } from '@workhall-pvt-lmt/wh-ui-library';
import { useHistory } from 'react-router-dom';
import styles from '../step_card/StepCard.module.scss';
import { constructAvatarGroupList } from '../../../../../application/app_listing/AppListing.utils';
import { getPopperContent } from '../../../../../../utils/UtilityFunctions';

function AssigneeGroups(props) {
    const { assigneesList = [], assigneeLabels, hideUserIcon, outerClassName } = props;
    const history = useHistory();
    let assigneeGroupComponent = null;
    let firstAssignee = null;
    let otherAssignees = null;
    let assigneesIsAdded = false;
    if (assigneesList.length) {
        const directAssigneeData = find(assigneesList, { assignee_type: ASSIGNEE_TYPE.DIRECT_ASSIGNEE });
        const otherAssigneeData = cloneDeep(assigneeLabels);
        if (directAssigneeData && (!isEmpty(directAssigneeData?.assignees?.users) || !isEmpty(directAssigneeData?.assignees?.teams))) {
            assigneesIsAdded = true;
            const assignees = get(directAssigneeData, ['assignees'], { users: [], teams: [] });
            firstAssignee = (
                <UserDisplayGroup
                    assignees={assignees || {}}
                    userAndTeamList={constructAvatarGroupList(assignees || {})}
                    count={1}
                    popperPlacement={EPopperPlacements.AUTO}
                    getPopperContent={(id, type, onShow, onHide) =>
                        getPopperContent(id, type, onShow, onHide, history, true)
                    }
                    getRemainingPopperContent={(id, type, onShow, onHide) =>
                        getPopperContent(id, type, onShow, onHide, history, true)
                    }
                />
            );
        } else {
            if (otherAssigneeData?.length) {
                assigneesIsAdded = true;
                const firstAssigneeData = otherAssigneeData[0];
                otherAssigneeData.splice(0, 1);
                firstAssignee = (
                    <div className={cx(gClasses.FTwo13BlackV6, gClasses.Ellipsis, BS.TEXT_LEFT, BS.MY_AUTO)} title={firstAssigneeData.label}>{firstAssigneeData.label}</div>
                );
            }
        }
        if (otherAssigneeData?.length) {
            otherAssignees = (
                <>
                <div className={cx(BS.MY_AUTO, gClasses.FTwo13BlackV6)}>&nbsp;and</div>
                <RemainingUsersTooltip
                    userOrTeam={TOOL_TIP_TYPE.PROFILE}
                    popperPlacement={POPPER_PLACEMENTS.RIGHT}
                    remainingUsers={otherAssigneeData}
                    isText
                >
                    <div className={styles.ExtraAssignees}>{`+${otherAssigneeData.length}`}</div>
                </RemainingUsersTooltip>
                </>
            );
        }
        assigneeGroupComponent = (
            <div className={cx(BS.D_FLEX, gClasses.W100, outerClassName)}>
                {
                    (!hideUserIcon && assigneesIsAdded)
                    && (
                        <div className={cx(styles.UserIcon, gClasses.CenterVH)}>
                            <MyTeamIcon />
                        </div>
                    )
                }
                {firstAssignee}
                {otherAssignees}
            </div>
        );
    }
    return assigneeGroupComponent;
}

export default AssigneeGroups;
