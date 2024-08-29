import React from 'react';
import cx from 'classnames/bind';

import styles from './ProgressBar.module.scss';
import { BS } from '../../utils/UIConstants';
import gClasses from '../../scss/Typography.module.scss';
import { PROGRESS_BAR_COLORS_CONSTANTS } from './ProgressBar.Strings';

function ProgressBar(props) {
  const {
    status, total_tasks, completed_tasks, completed_percentage,
  } = props;
  let progressBarColorStyle;
  let strStatus;
  if (status === 'inprogress') {
    progressBarColorStyle = PROGRESS_BAR_COLORS_CONSTANTS.IN_PROGRESS;
  } else if (status === 'completed' || (completed_tasks === total_tasks && status !== 'cancelled')) {
    progressBarColorStyle = PROGRESS_BAR_COLORS_CONSTANTS.COMPLETED;
    strStatus = 'Completed';
  } else if (status === 'cancelled') {
    progressBarColorStyle = PROGRESS_BAR_COLORS_CONSTANTS.REJECTED;
    strStatus = 'Cancelled';
  } else {
    progressBarColorStyle = PROGRESS_BAR_COLORS_CONSTANTS.REJECTED;
  }
  const completed_percentage_ = Math.min(Math.max(completed_percentage, 0), 100);
  const statusName = strStatus || 'completed';
  const percentage_string = `${completed_percentage_}% ${statusName}`;

  return (
    <>
      <div className={cx(BS.D_FLEX, BS.JC_BETWEEN, styles.PercentageString)}>
        <div className={cx(gClasses.FTwo12GrayV4, BS.TEXT_JUSTIFY)}>{percentage_string}</div>
        <div
          className={cx(gClasses.FTwo12GrayV4, gClasses.FontWeight600)}
        >
          {`${completed_tasks}/${total_tasks}`}
        </div>
      </div>
      <div className={cx(gClasses.MT3)}>
        <div className={styles.ProgressBarBG} />
        <div
          className={styles.ProgressBar}
          style={{ width: `${completed_percentage_}%`, backgroundColor: progressBarColorStyle }}
        />
      </div>
    </>
  );
}

export default ProgressBar;

ProgressBar.propTypes = {
  //   userImages: PropTypes.arrayOf(PropTypes.object),
  //   isDataLoading: PropTypes.bool,
};

ProgressBar.defaultProps = {
  //   userImages: [],
  //   isDataLoading: false,
};
