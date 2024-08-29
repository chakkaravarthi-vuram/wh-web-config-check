import React from 'react';
import cx from 'classnames/bind';
import gClasses from 'scss/Typography.module.scss';
import { BS } from 'utils/UIConstants';
import { keydownOrKeypessEnterHandle } from 'utils/UtilityFunctions';
import styles from './DashboardTrigger.module.scss';

function DashboardTriggerCard(props) {
  const { title, iconElm, onClick } = props;

  return (
    <div
      className={cx(styles.CardContainer)}
      onClick={onClick}
      onKeyDown={(e) => keydownOrKeypessEnterHandle(e) && onClick && onClick()}
      role="menu"
      tabIndex={0}
    >
      <div className={BS.D_FLEX}>
        <div className={cx(styles.IconContainer, gClasses.MR10, gClasses.MT6)}>
          {iconElm}
        </div>
        <div className={cx(BS.D_FLEX, BS.ALIGN_ITEM_CENTER)}>
          <span className={cx(styles.Title, gClasses.Ellipsis)} title={title}>
            {title}
          </span>
          {/* <div className={BS.D_FLEX}>
            <div
              className={cx(
                styles.SubTitle1,
                BS.P_RELATIVE,
                BS.D_FLEX,
                BS.ALIGN_ITEM_CENTER,
                gClasses.MR8,
                gClasses.PR8,
              )}
            >
              {secondaryIconElm}
              <span
                className={cx(gClasses.ML4, gClasses.Ellipsis)}
                title={subTitle1}
              >
                {subTitle1}
              </span>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
}

export default DashboardTriggerCard;
