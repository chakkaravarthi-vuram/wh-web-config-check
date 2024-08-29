import React from 'react';
import cx from 'classnames/bind';

import { BS } from '../../../../../utils/UIConstants';
import styles from './NotStarted.module.scss';
import gClasses from '../../../../../scss/Typography.module.scss';

function Header(props) {
  const { index, task_name } = props;

  const circleTextClass = cx(
    gClasses.CenterVH,
  );

  return (
    <div className={`card-header ${styles.cardheaderNobg}`} id="headingFive">
      <div className="row">
        <div className={cx('col-10', gClasses.CenterV)}>
          <div
            className={cx(
              styles.Circle1,
              styles.NotStartedBg,
              circleTextClass,
              styles.AccsummaryCircle,
            )}
          >
            {index + 1}
          </div>
          <span className={styles.AccTitle} title={task_name}>{task_name}</span>
        </div>
        <div className="col-2">
          <div
            className={cx(gClasses.CenterV, BS.JC_END, styles.AccnotStartedtxt)}
          >
            Not started
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
