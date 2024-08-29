import React, { useContext } from 'react';
import cx from 'classnames/bind';
import PropTypes from 'prop-types';
import Skeleton from 'react-loading-skeleton';

import { ICON_ARIA_LABELS } from 'utils/strings/CommonStrings';
import ThemeContext from '../../../hoc/ThemeContext';
import UserImage from '../../user_image/UserImage';

import { ARIA_ROLES, BS, PIXEL_CONSTANTS } from '../../../utils/UIConstants';

import styles from './RemainderStatusCard.module.scss';
import gClasses from '../../../scss/Typography.module.scss';
import BellIcon from '../../../assets/icons/BellIcon';

function RemainderStatusCard(props) {
  const { buttonColor } = useContext(ThemeContext);
  const {
    data: {
      profilePic, firstName, lastName, status, date, scheduled_date_time, remainder_message,
    },
    isDataLoading,
    className,
  } = props;
  console.log('PROPS PASSED', firstName, lastName, status, date, scheduled_date_time, remainder_message);
  return (
    <div className={cx(styles.Container, className, status === 1 ? styles.FullOpacity : styles.HalfOpacity)}>
      <div className={cx(gClasses.CenterV, BS.JC_BETWEEN)}>
        <div className={cx(gClasses.CenterV, gClasses.Flex1, gClasses.OverflowHidden)}>
          <UserImage
            src={profilePic}
            className={styles.UserImage}
            firstName={firstName}
            lastName={lastName}
            isDataLoading={isDataLoading}
          />
          <div className={cx(gClasses.ML10, gClasses.FOne13, gClasses.Ellipsis)} style={{ color: buttonColor }}>
            {!isDataLoading ? `${firstName} ${lastName}` : <Skeleton width={PIXEL_CONSTANTS.ONE_EIGHT_PIXEL} />}
          </div>
          <div className={cx(gClasses.ML5, gClasses.FOne13GrayV17, gClasses.Ellipsis)}>
            {!isDataLoading ? null : <Skeleton width={PIXEL_CONSTANTS.ONE_TWENTY_PIXEL} />}
          </div>
        </div>
        <div className={cx(gClasses.FOne12GrayV17, gClasses.Italics)}>
          {!isDataLoading ? date : <Skeleton width={PIXEL_CONSTANTS.FIFTY_PIXEL} />}
        </div>
      </div>
      <div className={gClasses.ML34}>
        <div className={cx(gClasses.MT7, gClasses.FOne13GrayV3, BS.TEXT_JUSTIFY, gClasses.WordWrap)}>
          {!isDataLoading ? remainder_message : <Skeleton width={PIXEL_CONSTANTS.FOUR_HUNDRED_PIXEL} />}
        </div>
        {/* <div className={cx(gClasses.MT15, gClasses.CenterV, { [BS.D_NONE]: !scheduled_date_time })}>
          <div className={cx(gClasses.FOne12GrayV14, styles.CategoryBox, gClasses.MR15, { [BS.D_NONE]: !scheduled_date_time })}>{scheduled_date_time}</div>
        </div> */}
        <div className={cx(gClasses.MT10, gClasses.MR75)}>
          <BellIcon className={cx(styles.Bell)} isButtonColor role={ARIA_ROLES.IMG} ariaLabel={ICON_ARIA_LABELS.BELL_ICON} ariaHidden />
          <span className={cx(styles.TimeAndDate, gClasses.ML10)}>
            {scheduled_date_time}
          </span>
        </div>
      </div>
    </div>
  );
}

export default RemainderStatusCard;

RemainderStatusCard.propTypes = {
  data: PropTypes.objectOf(PropTypes.any),
  isDataLoading: PropTypes.bool,
};
RemainderStatusCard.defaultProps = {
  data: {},
  isDataLoading: false,
};
