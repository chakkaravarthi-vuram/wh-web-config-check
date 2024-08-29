import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import parse from 'html-react-parser';
import { Skeleton } from '@workhall-pvt-lmt/wh-ui-library';
import gClasses from 'scss/Typography.module.scss';
import BellIcon from '../../../../../assets/icons/BellIcon';
import ThemeContext from '../../../../../hoc/ThemeContext';
import { ARIA_ROLES, PIXEL_CONSTANTS } from '../../../../../utils/UIConstants';
import { ICON_ARIA_LABELS } from '../../../../../utils/strings/CommonStrings';
import UserImage from '../../../../../components/user_image/UserImage';
import styles from './NotesAndRemaindersCard.module.scss';

function NotesAndRemaindersCard(props) {
  const {
    data: {
      profilePic,
      firstName,
      lastName,
      status,
      date,
      description,
      category,
      scheduled_date_time,
      remainder_message,
    },
    attachmentsElement,
    isDataLoading,
    className,
    isNotes = false,
    isRemainders = false,
  } = props;
  const { buttonColor } = useContext(ThemeContext);

  return (
    <div
      className={cx(
        styles.Container,
        className,
        isRemainders &&
          (status === 1 ? styles.FullOpacity : styles.HalfOpacity),
      )}
    >
      <div className={gClasses.CenterVSpaceBetween}>
        <div
          className={cx(
            gClasses.CenterV,
            gClasses.Flex1,
            gClasses.OverflowHidden,
          )}
        >
          <UserImage
            src={profilePic}
            className={styles.UserImage}
            firstName={firstName}
            lastName={lastName}
            isDataLoading={isDataLoading}
          />
          <div
            className={cx(
              gClasses.ML10,
              gClasses.FTwo14,
              gClasses.Ellipsis,
              gClasses.FontWeight500,
            )}
            style={{ color: buttonColor }}
          >
            {!isDataLoading ? (
              `${firstName} ${lastName}`
            ) : (
              <Skeleton width={PIXEL_CONSTANTS.ONE_EIGHT_PIXEL} />
            )}
          </div>
        </div>
        <div className={gClasses.FOne13GrayV17}>
          {!isDataLoading ? (
            date
          ) : (
            <Skeleton width={PIXEL_CONSTANTS.FIFTY_PIXEL} />
          )}
        </div>
      </div>
      <div className={gClasses.ML34}>
        <div
          className={cx(
            gClasses.MT7,
            gClasses.FTwo13GrayV3,
            gClasses.TextAlignJustify,
            gClasses.WordBreakBreakWord,
            { [styles.DescriptionClass]: isNotes },
          )}
        >
          {isDataLoading ? (
            <Skeleton width={PIXEL_CONSTANTS.FOUR_HUNDRED_PIXEL} />
          ) : (
            <>
              {isNotes ? description && parse(description) : null}
              {isRemainders ? remainder_message : null}
            </>
          )}
        </div>
        {isNotes ? (
          <div
            className={cx(gClasses.MT15, gClasses.CenterV, {
              [gClasses.DisplayNone]: !category && !attachmentsElement,
            })}
          >
            <div
              className={cx(
                gClasses.FOne12GrayV14,
                styles.CategoryBox,
                gClasses.MR15,
                { [gClasses.DisplayNone]: !category },
              )}
            >
              {category}
            </div>
            {attachmentsElement}
          </div>
        ) : null}
        {isRemainders ? (
          <div className={cx(gClasses.MT10, gClasses.MR75)}>
            <BellIcon
              className={styles.Bell}
              isButtonColor
              role={ARIA_ROLES.IMG}
              ariaLabel={ICON_ARIA_LABELS.BELL_ICON}
              ariaHidden
            />
            <span className={cx(styles.TimeAndDate, gClasses.ML10)}>
              {scheduled_date_time}
            </span>
          </div>
        ) : null}
      </div>
    </div>
  );
}

NotesAndRemaindersCard.propTypes = {
  data: PropTypes.objectOf({
    profilePic: PropTypes.string,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    status: PropTypes.number,
    date: PropTypes.string,
    description: PropTypes.string,
    category: PropTypes.string,
    scheduled_date_time: PropTypes.string,
    remainder_message: PropTypes.string,
  }),
  attachmentsElement: PropTypes.object,
  isDataLoading: PropTypes.bool,
  className: PropTypes.string,
  isNotes: PropTypes.bool,
  isRemainders: PropTypes.bool,
};

export default NotesAndRemaindersCard;
