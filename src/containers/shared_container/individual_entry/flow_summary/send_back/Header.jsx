import React from 'react';
import cx from 'classnames/bind';
import { useTranslation } from 'react-i18next';

import { BS } from 'utils/UIConstants';
import DashboardSendBackIcon from 'assets/icons/DashboardSendBackIcon';
import { keydownOrKeypessEnterHandle } from 'utils/UtilityFunctions';
import { PD_SUMMARY_STRINGS } from 'containers/flow/flow_dashboard/FlowDashboard.string';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import styles from './SendBack.module.scss';
import gClasses from '../../../../../scss/Typography.module.scss';
import { getFormattedDateAndTimeLabel } from '../Summary.utils';
import { constructUserTeamPickerByClosedBy } from '../../../../application/app_components/dashboard/flow/flow_instance/FlowInstance.utils';
import { getUserDisplayGroup } from '../../../../application/app_components/task_listing/TaskListing.utils';
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
    className,
    translation_data,
  } = props;

  const history = useHistory();
  const isNormalMode = isBasicUserMode(history);
  const pref_locale = localStorage.getItem('application_language');
  const userTeamPickerPopOverData = constructUserTeamPickerByClosedBy(closedBy);
  const showCreateTask = useSelector((state) => state.RoleReducer.is_show_app_tasks);

  return (
    <div
      className={cx(className, `card-header ${styles.cardheaderbg}`)}
      id="headingOne"
      onClick={() => onHeaderClick(isShow, index)}
      onKeyDown={(e) => keydownOrKeypessEnterHandle(e) && onHeaderClick(isShow, index)}
      tabIndex={0}
      role="button"
    >
      <div>
      <div>
      <div className={cx(BS.D_FLEX, BS.JC_BETWEEN)}>
        <div className={cx(BS.D_FLEX, gClasses.CenterV)}>
          <div className={cx(styles.AccsummaryCircle)}>
            <DashboardSendBackIcon />
          </div>
          <div>
          <span className={styles.AccTitle} title={translation_data?.[pref_locale]?.task_name || task_name}>
            {translation_data?.[pref_locale]?.task_name || task_name}
          </span>
          <div className={cx(BS.D_FLEX, gClasses.WordWrap)}>
                    <div
                      className={cx(
                        gClasses.FTwo12GrayV53,
                        gClasses.CenterV,
                      )}
                    >
                      {PD_SUMMARY_STRINGS(t).SENT_BACK_BY}
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
            {PD_SUMMARY_STRINGS(t).SENT_BACK}
        </div>
      </div>
      </div>
      </div>
    </div>
  );
}

export default Header;
