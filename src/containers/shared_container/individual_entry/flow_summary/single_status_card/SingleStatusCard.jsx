import React from 'react';
import cx from 'classnames/bind';
import { BS } from 'utils/UIConstants';
import gClasses from 'scss/Typography.module.scss';
import { useTranslation } from 'react-i18next';
import styles from './SingleStatusCard.module.scss';
import { getCurrentStatusDisplay } from '../Summary.utils';

function SingleStatusCard(props) {
  const {
    instanceSummary: { task_name, task_status },
    icon,
  } = props;
  const { t } = useTranslation();
  const circleTextClass = cx(gClasses.CenterVH);

  return (
    <div className={task_status === 'skipped' ? `card ${styles.grayborderCard}` : `card ${styles.greenborderCard}`}>
      <div
         className={task_status === 'skipped' ? cx(
          `card-header ${styles.cardheaderSkippedbg}`,
           BS.D_FLEX,
           BS.JC_BETWEEN,
           ) : cx(
          `card-header ${styles.cardheaderNobg}`,
            BS.D_FLEX,
            BS.JC_BETWEEN,
            )}
        id="headingFive"
      >
        <div className={cx(BS.D_FLEX, BS.JC_BETWEEN, BS.ALIGN_ITEM_CENTER)}>
          <div className={cx(gClasses.CenterV)}>
            <div
              className={task_status === 'skipped' ? cx(
                styles.Circle1,
                styles.SkippedCardBg,
                circleTextClass,
                styles.AccsummaryCircle,
              ) : cx(
                styles.Circle1,
                styles.SingleCardBg,
                circleTextClass,
                styles.AccsummaryCircle,
              )}
            >
              {icon}
            </div>
          </div>
          <div className={cx(BS.D_FLEX, BS.FLEX_COLUMN)}>
            <span className={styles.AccTitle} title={task_name}>
              {task_name}
            </span>
          </div>
        </div>
        <div className={cx(BS.D_FLEX, BS.JC_BETWEEN, BS.ALIGN_ITEM_CENTER)}>
          <div
            className={task_status === 'skipped' ? cx(
              gClasses.CenterV,
              BS.JC_END,
              styles.SkippedText,
              gClasses.ML24,
            ) : cx(
              gClasses.CenterV,
              BS.JC_END,
              styles.AccnotStartedtxt,
              gClasses.ML24,
            )}
          >
            {getCurrentStatusDisplay(task_status, t)}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SingleStatusCard;
