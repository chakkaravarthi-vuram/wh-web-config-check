import React, { useContext } from 'react';
import cx from 'classnames/bind';
import PropTypes from 'prop-types';
import Skeleton from 'react-loading-skeleton';
import parse from 'html-react-parser';

import ThemeContext from '../../hoc/ThemeContext';
import UserImage from '../user_image/UserImage';

import { BS, PIXEL_CONSTANTS } from '../../utils/UIConstants';

import styles from './StatusCard.module.scss';
import gClasses from '../../scss/Typography.module.scss';

function StatusCard(props) {
  const { buttonColor } = useContext(ThemeContext);
  const {
    data: {
      profilePic, firstName, lastName, status, date, description, category,
    },
    attachmentsElement,
    isDataLoading,
    className,
  } = props;

  return (
    <div className={cx(styles.Container, className)}>
      <div className={cx(gClasses.CenterV, BS.JC_BETWEEN)}>
        <div className={cx(gClasses.CenterV, gClasses.Flex1, gClasses.OverflowHidden)}>
          <UserImage
            src={profilePic}
            className={styles.UserImage}
            firstName={firstName}
            lastName={lastName}
            isDataLoading={isDataLoading}
          />
          <div className={cx(gClasses.ML10, gClasses.FTwo14, gClasses.Ellipsis, gClasses.FontWeight500)} style={{ color: buttonColor }}>
            {!isDataLoading ? `${firstName} ${lastName}` : <Skeleton width={PIXEL_CONSTANTS.ONE_EIGHT_PIXEL} />}
          </div>
          <div className={cx(gClasses.ML5, gClasses.FOne13GrayV17, gClasses.Ellipsis)}>
            {!isDataLoading ? status : <Skeleton width={PIXEL_CONSTANTS.ONE_TWENTY_PIXEL} />}
          </div>
        </div>
        <div className={cx(gClasses.FOne13GrayV17)}>
          {!isDataLoading ? date : <Skeleton width={PIXEL_CONSTANTS.FIFTY_PIXEL} />}
        </div>
      </div>
      <div className={gClasses.ML34}>
        <div className={cx(gClasses.MT7, gClasses.FTwo13GrayV3, BS.TEXT_JUSTIFY, gClasses.WordBreakBreakWord, styles.DescriptionClass)}>
          {!isDataLoading ? description && parse(description) : <Skeleton width={PIXEL_CONSTANTS.FOUR_HUNDRED_PIXEL} />}
        </div>
        <div className={cx(gClasses.MT15, gClasses.CenterV, { [BS.D_NONE]: !category && !attachmentsElement })}>
          <div className={cx(gClasses.FOne12GrayV14, styles.CategoryBox, gClasses.MR15, { [BS.D_NONE]: !category })}>{category}</div>
          {attachmentsElement}
        </div>
      </div>
    </div>
  );
}

export default StatusCard;

StatusCard.propTypes = {
  data: PropTypes.objectOf(PropTypes.any),
  isDataLoading: PropTypes.bool,
};
StatusCard.defaultProps = {
  data: {},
  isDataLoading: false,
};
