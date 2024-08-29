import React from 'react';
import cx from 'classnames/bind';
import { useTranslation } from 'react-i18next';
import NewCorrectIcon from 'assets/icons/NewCorrectIcon';
import { ARIA_ROLES, BS } from 'utils/UIConstants';
import { keydownOrKeypessEnterHandle } from 'utils/UtilityFunctions';
import { PD_SUMMARY_STRINGS } from 'containers/flow/flow_dashboard/FlowDashboard.string';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import styles from './Created.module.scss';
import gClasses from '../../../../../scss/Typography.module.scss';
import { getFormattedDateAndTimeLabel } from '../Summary.utils';
import { getUserDisplayGroup } from '../../../../application/app_components/task_listing/TaskListing.utils';
import { constructUserTeamPickerByClosedBy } from '../../../../application/app_components/dashboard/flow/flow_instance/FlowInstance.utils';
import { isBasicUserMode } from '../../../../../utils/UtilityFunctions';

function Header(props) {
  const { t } = useTranslation();
  const {
    index,
    isShow,
    task_name,
    onHeaderClick,
    closedBy,
    closedOn,
    isFirstStep,
    action,
    borderClass,
    className,
    isReviewStep,
    isSendBackTask = false,
  } = props;
  const history = useHistory();
  const isNormalMode = isBasicUserMode(history);
  const userTeamPickerPopOverData = constructUserTeamPickerByClosedBy(closedBy);
  const showCreateTask = useSelector((state) => state.RoleReducer.is_show_app_tasks);
  const handleHeaderClick = () => {
    onHeaderClick(isShow, index);
  };

  let stepActionFontStyle = gClasses.FTwo13GreenV26;
  if (isReviewStep) stepActionFontStyle = gClasses.FTwo14BlackV20;
  if (isSendBackTask) stepActionFontStyle = gClasses.FTwo14RedV28;
  return (
    <div
      className={cx(`card-header ${isReviewStep ?
        styles.ReviewTaskCardHeaderBg :
        (isSendBackTask ? styles.ResentTaskHeader : styles.cardheaderbg)}`, borderClass, className)}
      id="headingOne"
      onClick={handleHeaderClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => keydownOrKeypessEnterHandle(e) && onHeaderClick(isShow, index)}
    >
      <div>
      <div>
        <div className={cx(BS.D_FLEX, BS.JC_BETWEEN)}>
        <div className={cx(BS.D_FLEX, gClasses.CenterV)}>
          <div className={cx(styles.Circle1, styles.AccsummaryCircle)}>
            <NewCorrectIcon role={ARIA_ROLES.IMG} width={32} height={32} ariaLabel="Successfully started" />
          </div>
          <div>
          {/* <div className={BS.D_FLEX}>
          <span className={styles.AccTitle} title={task_name}>{task_name}</span>
          </div> */}
          <div>
          <span className={cx(gClasses.FTwo14GrayV3, gClasses.FontWeight500)} title={task_name}>{task_name}</span>
          <div className={cx(BS.D_FLEX, gClasses.WordWrap)}>
                    <div
                      className={cx(
                        gClasses.FTwo12GrayV53,
                        gClasses.CenterV,
                        gClasses.WhiteSpaceNoWrap,
                      )}
                    >
                      {isFirstStep ? PD_SUMMARY_STRINGS(t).STARTED_BY : PD_SUMMARY_STRINGS(t).STARTED_BY }
                    </div>
                    <div
                      className={cx(
                        gClasses.FTwo12BlueV39,
                        gClasses.ML3,
                        gClasses.CenterV,
                      )}
                    >
                      {getUserDisplayGroup(userTeamPickerPopOverData, isNormalMode && showCreateTask, true)}
                    </div>
                    <div
                      className={cx(
                        gClasses.FTwo12GrayV53,
                        gClasses.ML3,
                        gClasses.CenterV,
                      )}
                    >
                     {PD_SUMMARY_STRINGS(t).ON_WITHOUT_COLON}
                    </div>
                    <div
                      className={cx(
                        gClasses.FTwo12GrayV53,
                        gClasses.ML3,
                        gClasses.CenterV,
                      )}
                    >
                    {getFormattedDateAndTimeLabel(closedOn)}
                    </div>
          </div>
          </div>
          </div>
        </div>
          <div
            className={cx(BS.JC_END, styles.AccnotStartedtxt, stepActionFontStyle)}
          >
           {isFirstStep ? PD_SUMMARY_STRINGS(t).STARTED :
           (task_name.includes('Sent Back') ? PD_SUMMARY_STRINGS(t).RESEND :
           action === 'end_flow' ? PD_SUMMARY_STRINGS(t).COMPLETED_THE_INSTANCE :
           action === 'assign_review' ? PD_SUMMARY_STRINGS(t).ASSIGNED_FOR_REVIEW :
           action === 'reassign' ? PD_SUMMARY_STRINGS(t).REASSIGN :
           isSendBackTask ? PD_SUMMARY_STRINGS(t).RESENT :
           isReviewStep ? PD_SUMMARY_STRINGS(t).REVIEWED : PD_SUMMARY_STRINGS(t).SENT)}
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}

export default Header;
