import React, { useContext } from 'react';
import propTypes from 'prop-types';
import cx from 'classnames/bind';
import { Col, Row } from 'reactstrap';
import { keydownOrKeypessEnterHandle } from 'utils/UtilityFunctions';
import DeleteIconV2 from 'assets/icons/form_fields/DeleteIconV2';
import { isEmpty } from 'utils/jsUtility';
import UserImage from '../user_image/UserImage';
import ThemeContext from '../../hoc/ThemeContext';
import gClasses from '../../scss/Typography.module.scss';
import styles from './UserCard.module.scss';
import radioClasses from '../form_components/radio_group/RadioGroup.module.scss';
import { ARIA_ROLES, BS, INPUT_TYPES } from '../../utils/UIConstants';
import { EMPTY_STRING } from '../../utils/strings/CommonStrings';
import MailIcon from '../../assets/icons/MailIcon';

export const USER_CARD_TYPES = {
  TYPE_1: 'USER_CARD_TYPE_1',
  TYPE_2: 'USER_CARD_TYPE_2',
};

function UserCard(props) {
  const {
    type = USER_CARD_TYPES.TYPE_1,
    id,
    firstName,
    lastName,
    src,
    className,
    isDropdown,
    onClick,
    accountId,
    isBorderLess,
    selectedAccountId,
    accountDomain,
    email,
    onDeleteClickHandler,
    withCheckbox,
    ariaHidden,
  } = props;
  const { buttonColor } = useContext(ThemeContext);
  const fullName = `${firstName || EMPTY_STRING} ${lastName || EMPTY_STRING}`;
  let component = null;
    let checkboxComponent = null;
  const isSelected = (selectedAccountId === accountId);
  switch (type) {
    case USER_CARD_TYPES.TYPE_1:
      if (withCheckbox) {
        let checkBoxMockStyle;
        let innerRadioMockStyle;
        if (isSelected) {
          checkBoxMockStyle = {
            borderColor: buttonColor,
          };
          innerRadioMockStyle = {
            backgroundColor: buttonColor,
          };
        }
        // old check box component - now replaced with radio button
        // checkboxComponent = (
        //   <div className={cx(gClasses.MR12, 'my-auto')}>
        //     <input
        //       type={INPUT_TYPES.RADIO}
        //       // role={ARIA_ROLES.CHECKBOX}
        //       onChange={() => {
        //         onClick(accountId, accountDomain);
        //       }}
        //       checked={isSelected}
        //       id={accountId}
        //       className={cx(checkboxClasses.CheckBox, BS.P_ABSOLUTE)}
        //       // tabIndex={0}
        //       // aria-hidden="true"
        //     />
        //     <div
        //       className={cx(
        //         checkboxClasses.CheckBoxMock,
        //         gClasses.CenterVH,
        //       )}
        //       style={checkBoxMockStyle}
        //       tabIndex={0}
        //       role="radio"
        //       aria-checked={isSelected}
        //       onKeyDown={(e) => keydownOrKeypessEnterHandle(e) && onClick(accountId, accountDomain)}
        //       aria-label={`${fullName}, ${accountDomain}`}
        //     >
        //       {isSelected ? (
        //         <CorrectIcon
        //         // title="Checkbox Selected"
        //         className={checkboxClasses.CorrectIcon}
        //         isButtonColor
        //         // ariaHidden="true"
        //         />
        //       ) : null}
        //     </div>
        //   </div>
        // );
            checkboxComponent = (
              <div className={cx(gClasses.MR12, 'my-auto')}>
                <input
                  type={INPUT_TYPES.RADIO}
                  onChange={() => {
                    onClick(accountId, accountDomain);
                  }}
                  checked={isSelected}
                  id={accountId}
                  className={cx(radioClasses.Radio, BS.P_ABSOLUTE)}
                  tabIndex={0}
                  aria-hidden="true"
                  name="radiobutton"
                />
                <div
                  className={cx(
                    radioClasses.RadioMock,
                    gClasses.CenterVH,
                    gClasses.FlexShrink0,
                  )}
                  style={checkBoxMockStyle}
                >
                  <div className=" " style={innerRadioMockStyle} />
                </div>
              </div>
            );
      }
      component = (
          <div
            className={cx(
              className,
              BS.D_FLEX,
              !isDropdown && gClasses.InputPaddingV2,
              isBorderLess ? null : styles.UserCardBorder,
              isSelected
                ? styles.SelectedUserCard
                : { [styles.UserCard]: !isDropdown },
            )}
            onClick={
              isDropdown ? () => { } : () => onClick(accountId, accountDomain)
            }
            tabIndex={0}
            onKeyDown={(e) => {
              keydownOrKeypessEnterHandle(e) && !isDropdown && onClick(accountId, accountDomain);
            }}
            role="radio"
            aria-checked={isSelected}
          >
            {checkboxComponent}
            <UserImage
              firstName={firstName}
              lastName={lastName}
              src={src}
              className={styles.UserImage}
              ariaHidden={ariaHidden}
            />
            <div className={cx(gClasses.ML20, styles.UsernameAndDomain, BS.MY_AUTO)}>
              <div
                className={cx(
                  gClasses.FTwo12BlackV3,
                  gClasses.FontWeight500,
                  gClasses.Ellipsis,
                )}
                // title={fullName}
                id={fullName}
              >
                {fullName}
              </div>
              {
                accountDomain && (
                  <div
                  className={cx(
                    gClasses.FOne11GrayV2,
                    styles.FlexGrow1,
                    gClasses.Ellipsis,
                  )}
                  // title={accountDomain}
                  >
                  {accountDomain}
                  </div>
                  )
              }
            </div>
            {isDropdown ? (
              <div
                className={cx(
                  styles.DropDownArrowContainer,
                  gClasses.CenterH,
                  BS.MT_AUTO,
                  BS.MB_AUTO,
                  BS.ML_AUTO,
                )}
              >
                <div
                  className={cx(gClasses.DropdownArrow, gClasses.ML5)}
                  style={{
                    borderTopColor: buttonColor,
                  }}
                />
              </div>
            ) : null}
          </div>
      );
      break;

    case USER_CARD_TYPES.TYPE_2:
      component = (
        <Row
          className={cx(
            className,
            gClasses.CenterV,
            gClasses.P10,
            gClasses.MX0,
            isBorderLess ? null : styles.UserCardBorderV2,
          )}
        >
          <Col className={cx(gClasses.CenterV, gClasses.Padding0)} sm={6}>
            <UserImage
              firstName={firstName}
              lastName={lastName}
              src={src}
              className={styles.UserImage}
            />
            <div
              className={cx(
                gClasses.FOne13GrayV3,
                gClasses.FontWeight500,
                gClasses.Ellipsis,
                gClasses.Flex1,
                gClasses.ML10,
              )}
            >
              {fullName}
            </div>
          </Col>
          <Col className={cx(gClasses.CenterV, BS.JC_BETWEEN)} sm={6}>
            <div className={cx(gClasses.CenterV, gClasses.Flex1, gClasses.OverflowHidden)}>
              {!isEmpty(email) && (
                  <MailIcon
                    title={email}
                    className={cx(gClasses.MR10, styles.MailIcon)}
                    role={ARIA_ROLES.IMG}
                  />
              )}
              <div className={cx(gClasses.FOne13GrayV2, gClasses.Ellipsis, gClasses.Flex1)} title={email}>{email}</div>
            </div>
            <div className={cx(styles.DeleteIconContainer, BS.D_FLEX, BS.JC_CENTER, BS.ALIGN_ITEM_CENTER)}>
              <DeleteIconV2
                className={cx(styles.DeleteIcon, gClasses.CursorPointer)}
                onClick={() => onDeleteClickHandler(id)}
                ariaLabel={`delete ${firstName} ${lastName}`}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => keydownOrKeypessEnterHandle(e) && onDeleteClickHandler(id)}
              />
            </div>
          </Col>
        </Row>
      );
      break;

    default:
      component = null;
      break;
  }

  return component;
}

UserCard.defaultProps = {
  className: null,
  firstName: null,
  lastName: null,
  src: null,
  accountName: null,
  isDropdown: false,
  isBorderLess: false,
  selectedAccountId: EMPTY_STRING,
  accountDomain: EMPTY_STRING,
  withCheckbox: false,
};

UserCard.propTypes = {
  firstName: propTypes.string,
  lastName: propTypes.string,
  accountDomain: propTypes.string,
  src: propTypes.string,
  className: propTypes.string,
  accountName: propTypes.string,
  isDropdown: propTypes.bool,
  isBorderLess: propTypes.bool,
  onClick: propTypes.func.isRequired,
  accountId: propTypes.string.isRequired,
  selectedAccountId: propTypes.string,
  withCheckbox: propTypes.bool,
};

export default UserCard;
