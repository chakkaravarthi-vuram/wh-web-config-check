import React from 'react';
import cx from 'classnames/bind';
import { useTranslation } from 'react-i18next';
import RejectedIcon from 'assets/icons/RejectedIcon';
import { PD_SUMMARY_STRINGS } from 'containers/flow/flow_dashboard/FlowDashboard.string';
import { keydownOrKeypessEnterHandle } from 'utils/UtilityFunctions';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import styles from './Rejected.module.scss';
import gClasses from '../../../../../scss/Typography.module.scss';
import { ARIA_ROLES, BS } from '../../../../../utils/UIConstants';
import { getFormattedDateAndTimeLabel } from '../Summary.utils';
import { isEmpty } from '../../../../../utils/jsUtility';
import { constructUserTeamPickerByClosedBy } from '../../../../application/app_components/dashboard/flow/flow_instance/FlowInstance.utils';
import { getUserDisplayGroup } from '../../../../application/app_components/task_listing/TaskListing.utils';
import { isBasicUserMode } from '../../../../../utils/UtilityFunctions';

function Header(props) {
  const { t } = useTranslation();
  const {
    task_name, closedOn, closedBy, isShow, index, onHeaderClick, className, cancellationComments,
    isCancelledBySendBack,
  } = props;
  const history = useHistory();
  const isNormalMode = isBasicUserMode(history);
  const userTeamPickerPopOverData = constructUserTeamPickerByClosedBy(closedBy);
  const showCreateTask = useSelector((state) => state.RoleReducer.is_show_app_tasks);

  return (
    <div
      className={cx(className, `card-header ${styles.cardheaderbg} `)}
      id="headingOne"
      onClick={() => onHeaderClick(isShow, index)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => keydownOrKeypessEnterHandle(e) && onHeaderClick(isShow, index)}
    >
      <div>
        <div>
          <div className={cx(BS.D_FLEX, BS.JC_BETWEEN)}>
            <div className={cx(BS.D_FLEX, gClasses.CenterV)}>
              <div className={gClasses.MR10}>
                <RejectedIcon role={ARIA_ROLES.IMG} ariaLabel="Cancelled" />
              </div>
              <div>
                <span className={styles.AccTitle} title={task_name}>{task_name}</span>
                <div className={cx(BS.D_FLEX, gClasses.WordWrap)}>
                  <div
                    className={cx(
                      gClasses.FTwo12GrayV53,
                      gClasses.CenterV,
                    )}
                  >
                    {PD_SUMMARY_STRINGS(t).CANCELLED_BY}
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
                    {PD_SUMMARY_STRINGS(t).ON}
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
            <div
              className={cx(BS.JC_END, styles.AccnotStartedtxt)}
            >
              {isCancelledBySendBack ? PD_SUMMARY_STRINGS(t).CANCEL_INSTANCE_BY_SEND_BACK : PD_SUMMARY_STRINGS(t).CANCEL_INSTANCE}
            </div>
          </div>
        </div>
      </div>
      {
        !isEmpty(cancellationComments) && (
          <div className={cx(gClasses.CursorDefault, gClasses.ML15, gClasses.MR15, gClasses.MT10)}>
            <div className={gClasses.FieldName}>
              {PD_SUMMARY_STRINGS(t).CANCELLED_REASON}
            </div>
            <div className={cx(gClasses.FTwo12GrayV3, gClasses.WordWrap)}>{cancellationComments}</div>
          </div>
        )
      }
    </div>
  );
}

export default Header;
