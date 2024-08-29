import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames/bind';
import { Col, Row } from 'reactstrap';

import { keydownOrKeypessEnterHandle } from 'utils/UtilityFunctions';
import DeleteIconV2 from 'assets/icons/form_fields/DeleteIconV2';
import Dropdown from '../../form_components/dropdown/Dropdown';
import MailIcon from '../../../assets/icons/MailIcon';

import { BS, BS_LAYOUT_COL } from '../../../utils/UIConstants';
import gClasses from '../../../scss/Typography.module.scss';
import styles from './MemberCard.module.scss';
import UserImage from '../../user_image/UserImage';
import {
  MEMBER_CARD_STRINGS,
  MEMBER_CARD_TYPE,
  ICON_STRINGS,
  ROLES_LIST,
} from './MemberCard.strings';
import { USER_TYPE_STRINGS, EMPTY_STRING, TEAM_TYPE_STRINGS } from '../../../utils/strings/CommonStrings';
import { isMobileScreen } from '../../../utils/UtilityFunctions';
import { IMAGE_BASE_URL } from '../../../urls/ApiUrls';

function MemberCard(props) {
  const {
    type,
    memberDetails,
    onDropdownChange,
    onActivateOrDeactivateClick,
    placeholder,
    teamDetails,
    hideRole,
    isTeamComponent,
    customMemberListContainer,
  } = props;
  let actionButtonContent = null;
  console.log('props.type', props.type);
  switch (props.type) {
    case MEMBER_CARD_TYPE.TYPE_1:
      actionButtonContent = (
      <div className={styles.DeleteIconContainer}>
        <DeleteIconV2 className={styles.DeleteIcon} />
      </div>
        );
      break;
    case MEMBER_CARD_TYPE.TYPE_2:
      actionButtonContent = props.memberDetails.is_active ? (
        <span className={cx(gClasses.FOne13, gClasses.RedV2)}>
          {MEMBER_CARD_STRINGS.DEACTIVATE}
        </span>
      ) : (
        <span className={cx(gClasses.FOne13, styles.Activate)}>{MEMBER_CARD_STRINGS.ACTIVATE}</span>
      );
      break;
    default:
      actionButtonContent = props.memberDetails.is_active
        ? MEMBER_CARD_STRINGS.DEACTIVATE
        : MEMBER_CARD_STRINGS.ACTIVATE;
      break;
  }
  let content = null;
  if (!isMobileScreen() || isTeamComponent) {
    let colSize = null;
    if (isTeamComponent) colSize = BS_LAYOUT_COL.NINE;
    else colSize = (type === MEMBER_CARD_TYPE.TYPE_1 ? BS_LAYOUT_COL.SEVEN : BS_LAYOUT_COL.FIVE);
    content = (
      <li
        className={cx(
          customMemberListContainer,
          gClasses.InputBorder,
          gClasses.InputBorderRadius,
          styles.MemberListContainer,
          {
            [styles.Hover]: type === MEMBER_CARD_TYPE.TYPE_2,
          },
          gClasses.CenterV,
        )}
      >
        <Col
          lg={colSize}
          md={colSize}
          xs={colSize}
        >
          <div className={cx(BS.D_FLEX, styles.UserDetailContainer)}>
            <UserImage
              src={memberDetails.profile_pic}
              firstName={isTeamComponent ? memberDetails?.name : `${memberDetails.first_name} ${memberDetails.last_name}`}
              lastName={isTeamComponent ? '' : memberDetails.last_name}
              className={styles.UserImage}
            />
            <div className={BS.W100}>
              <div
                className={cx(
                  gClasses.FOne13GrayV3,
                  gClasses.ML20,
                  gClasses.FontWeight500,
                  BS.W75,
                  gClasses.Ellipsis,
                  gClasses.TextTransformCap,
                  styles.UserName,
                )}
                title={isTeamComponent ? memberDetails.name : `${memberDetails.first_name} ${memberDetails.last_name}`}
              >
                {isTeamComponent ? memberDetails?.name : `${memberDetails.first_name} ${memberDetails.last_name}`}
              </div>
              <div
                className={cx(
                  gClasses.FOne13GrayV3,
                  gClasses.ML20,
                  styles.UserEmail,
                  gClasses.CenterV,
                )}
              >
                {memberDetails.email}
              </div>
            </div>
          </div>
        </Col>
        {hideRole ? null : (
          <Col lg={BS_LAYOUT_COL.THREE} md={BS_LAYOUT_COL.FIVE} xs={BS_LAYOUT_COL.FIVE} className={gClasses.PL0}>
            <div className={cx(BS.D_FLEX, styles.UserRole, gClasses.FOne12GrayV2)}>
              {USER_TYPE_STRINGS[memberDetails.user_type] || TEAM_TYPE_STRINGS[memberDetails.team_type]}
            </div>
          </Col>
        )}
        {type === MEMBER_CARD_TYPE.TYPE_2 ? (
          <Col lg={BS_LAYOUT_COL.TWO}>
            {onDropdownChange && memberDetails.is_active ? (
              <Dropdown
                placeholder={placeholder}
                id={memberDetails._id}
                optionList={ROLES_LIST}
                selectedValue={USER_TYPE_STRINGS[memberDetails.user_type]}
                onChange={onDropdownChange}
                className={cx(styles.Dropdown, gClasses.ML20)}
                rtl
                isBorderLess
              />
            ) : null}
          </Col>
        ) : null}
        {teamDetails.is_remove_member ? (
          <Col lg={BS_LAYOUT_COL.TWO}>
            <div
              className={cx(
                gClasses.ML30,
                gClasses.CursorPointer,
                styles.Button,
                BS.FLOAT_RIGHT,
                gClasses.CenterV,
              )}
              onClick={() => {
                onActivateOrDeactivateClick(memberDetails);
              }}
              id={memberDetails._id}
              role="presentation"
            >
              {!isTeamComponent && actionButtonContent}
            </div>
          </Col>
        ) : null}
      </li>
    );
  } else {
    content = (
      <li
        className={cx(
          customMemberListContainer,
          gClasses.InputBorder,
          gClasses.InputBorderRadius,
          styles.MemberListContainer,
          {
            [styles.Hover]: type === MEMBER_CARD_TYPE.TYPE_2,
          },
          gClasses.CenterV,
        )}
      >
        <Col md={type === MEMBER_CARD_TYPE.TYPE_1 ? BS_LAYOUT_COL.TWELVE : BS_LAYOUT_COL.FIVE}>
          <div className={cx(BS.D_FLEX, styles.UserDetailContainer)}>
            <UserImage
              src={
                memberDetails.profile_pic && memberDetails.profile_pic.location
                  ? IMAGE_BASE_URL + memberDetails.profile_pic.location
                  : null
              }
              firstName={memberDetails.first_name}
              lastName={memberDetails.first_name}
              className={styles.UserImage}
            />
            <div className={gClasses.FlexGrow1}>
              <div className={cx(BS.D_FLEX)}>
                <div
                  className={cx(
                    gClasses.FOne13GrayV3,
                    gClasses.ML20,
                    gClasses.FontWeight500,
                    gClasses.FlexGrow1,
                    gClasses.TextTransformCap,
                  )}
                >
                  {memberDetails.first_name}
                  {' '}
                  {memberDetails.last_name}
                </div>
                <div
                  className={cx(
                    gClasses.ML30,
                    gClasses.CursorPointer,
                    styles.Button,
                    BS.FLOAT_RIGHT,
                    gClasses.CenterV,
                  )}
                  onClick={() => {
                    onActivateOrDeactivateClick(memberDetails);
                  }}
                  onKeyDown={(e) => keydownOrKeypessEnterHandle(e) && onActivateOrDeactivateClick(memberDetails)}
                  id={memberDetails._id}
                  role="button"
                  tabIndex={0}
                >
                  {actionButtonContent}
                </div>
              </div>
              <Row>
                <Col md={BS_LAYOUT_COL.SEVEN} xs={BS_LAYOUT_COL.SEVEN}>
                  <div
                    className={cx(
                      gClasses.FOne13GrayV3,
                      gClasses.ML20,
                      styles.UserEmail,
                      gClasses.CenterV,
                    )}
                  >
                    <MailIcon
                      title={ICON_STRINGS.MAIL_ICON}
                      className={cx(gClasses.MR10, styles.MailIcon)}
                    />
                    {memberDetails.email}
                  </div>
                </Col>
                {hideRole ? null : (
                  <Col md={BS_LAYOUT_COL.FIVE} xs={BS_LAYOUT_COL.FIVE}>
                    <div className={cx(BS.D_FLEX, styles.UserRole, gClasses.FOne13GrayV2)}>
                      {USER_TYPE_STRINGS[memberDetails.user_type] || TEAM_TYPE_STRINGS[memberDetails.team_type]}
                    </div>
                  </Col>
                )}
              </Row>
            </div>
          </div>
        </Col>
      </li>
    );
  }

  return content;
}

MemberCard.defaultProps = {
  placeholder: EMPTY_STRING,
  teamDetails: {},
  onDropdownChange: null,
};

MemberCard.propTypes = {
  type: PropTypes.number.isRequired,
  memberDetails: PropTypes.objectOf(PropTypes.any).isRequired,
  onDropdownChange: PropTypes.func,
  onActivateOrDeactivateClick: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  teamDetails: PropTypes.objectOf(PropTypes.any),
};

export default MemberCard;
