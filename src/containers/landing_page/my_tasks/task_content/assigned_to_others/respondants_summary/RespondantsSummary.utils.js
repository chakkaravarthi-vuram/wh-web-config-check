import React from 'react';
import { EPopperPlacements, UserDisplayGroup } from '@workhall-pvt-lmt/wh-ui-library';
import Button from '../../../../../../components/form_components/button/Button';
import { TASK_STATUS } from '../../../../../../utils/constants/taskContent.constant';
import { get, translateFunction } from '../../../../../../utils/jsUtility';
import { RESPONDANTS_SUMMARY_STRINGS } from './RespondantsSummary.strings';
import { BUTTON_TYPE } from '../../../../../../utils/Constants';
import { constructAvatarGroupList } from '../../../../../application/app_listing/AppListing.utils';
import { getPopperContent } from '../../../../../../utils/UtilityFunctions';

const getIsRespondedData = (taskStatus, t = translateFunction) => {
  if (taskStatus === TASK_STATUS.IN_PROGRESS) return RESPONDANTS_SUMMARY_STRINGS.TABLE_TITLES(t).NO;
  if (taskStatus === TASK_STATUS.CANCELLED) return RESPONDANTS_SUMMARY_STRINGS.TABLE_TITLES(t).NO_TASK_CANCELLED;
  return RESPONDANTS_SUMMARY_STRINGS.TABLE_TITLES(t).YES;
};

const getRespondedOnData = (eachInstance) => {
  if (eachInstance.status === TASK_STATUS.CANCELLED) return '_';
  return get(eachInstance, 'processed_on.pref_datetime_display', '-');
};

export const getRespondantsSummaryTableData = (allInstances, onNudgeClickHandler, buttonStyle = null, t = translateFunction, showCreateTask, history) => {
  const usersAndTeams = [];
  allInstances.forEach((eachInstance) => {
    usersAndTeams.push({
      participant: eachInstance?.participant,
      is_responded: getIsRespondedData(eachInstance.status, t),
      responsed_on: getRespondedOnData(eachInstance),
      is_nudge_visible: eachInstance.status === TASK_STATUS.IN_PROGRESS,
      instance_id: eachInstance._id,
    });
  });

  const tableRowData = usersAndTeams.map((eachUserAndTeam) => {
    const displayName = (
      <UserDisplayGroup
        assignees={get(eachUserAndTeam, ['participant'], {})}
        userAndTeamList={constructAvatarGroupList(get(eachUserAndTeam, ['participant'], {}))}
        count={1}
        popperPlacement={EPopperPlacements.AUTO}
        getPopperContent={(id, type, onShow, onHide) =>
          getPopperContent(id, type, onShow, onHide, history, showCreateTask)
        }
        getRemainingPopperContent={(id, type, onShow, onHide) =>
          getPopperContent(id, type, onShow, onHide, history, showCreateTask)
        }
      />
    );

    return [
      <div>{displayName}</div>,
      <div>{eachUserAndTeam.is_responded}</div>,
      <div>{eachUserAndTeam.responsed_on}</div>,
      <Button
        buttonType={BUTTON_TYPE.OUTLINE_PRIMARY}
        primaryButtonStyle={buttonStyle}
        disabled={!eachUserAndTeam.is_nudge_visible}
        onClick={eachUserAndTeam.is_nudge_visible ? () => onNudgeClickHandler(eachUserAndTeam.instance_id) : null}
      >
        {RESPONDANTS_SUMMARY_STRINGS.NUDGE_BUTTON(t).LABEL}
      </Button>,
    ];
  });
  return tableRowData;
};

export default getRespondantsSummaryTableData;
