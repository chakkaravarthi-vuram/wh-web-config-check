import React from 'react';
import cx from 'classnames/bind';
import PropTypes from 'prop-types';
import { Row, Col } from 'reactstrap';
import { useTranslation } from 'react-i18next';
import { keydownOrKeypessEnterHandle } from 'utils/UtilityFunctions';
import DeleteIconV2 from 'assets/icons/form_fields/DeleteIconV2';
import Input from '../../form_components/input/Input';
import {
  EMAIL_ADDRESS_ID,
  EMAIL_ADDRESS_LABEL,
  REPORTING_MANAGER_ID,
  REPORTING_MANAGER_LABEL,
  USER_PERMISSION_ID,
  USER_PERMISSION_LABEL,
} from './inviteMemberCard.strings';
import Dropdown from '../../form_components/dropdown/Dropdown';
import AddMembers from '../add_members/AddMembers';

import { ARIA_ROLES, BS } from '../../../utils/UIConstants';
import { EMPTY_STRING } from '../../../utils/strings/CommonStrings';
import { isEmpty } from '../../../utils/jsUtility';

import styles from './InviteMemberCard.module.scss';
import gClasses from '../../../scss/Typography.module.scss';

function InviteMemberCard(props) {
  const {
    index,
    onDeleteClick,
    onEmailChangeHandler,
    email,
    userPermission,
    onPermissionChangeHandler,
    permissionList,
    reportee,
    memberSearchHandler,
    memberSearchValue,
    onMemberSelectHandler,
    removeUserHandler,
    onBlurHandler,
    error_list,
    focusOnError,
    focusOnErrorRefresher,
  } = props;
  const { t } = useTranslation();
  return (
    <div className={styles.CardContainer}>
      <Row>
        <Col xl={12} sm={12}>
          <div className={cx(BS.ML_AUTO, styles.DeleteIconContainer)}>
            <DeleteIconV2
            className={cx(gClasses.CursorPointer, styles.DeleteIcon)}
            role={ARIA_ROLES.BUTTON}
            tabIndex={0}
            title="Delete"
            onClick={() => onDeleteClick(index)}
            onKeyDown={(e) => keydownOrKeypessEnterHandle(e) && onDeleteClick(index)}
            />
          </div>
        </Col>
        <Col xl={12} sm={12}>
          <Input
            id={`${EMAIL_ADDRESS_ID}_${index}`}
            label={t(EMAIL_ADDRESS_LABEL)}
            value={email}
            onChangeHandler={(event) => onEmailChangeHandler(event.target.value, index, EMAIL_ADDRESS_ID)}
            onBlurHandler={() => onBlurHandler(index)}
            errorMessage={error_list[EMAIL_ADDRESS_ID]}
            focusOnError={focusOnError}
            focusOnErrorRefresher={focusOnErrorRefresher}
            isRequired
          />
        </Col>
      </Row>
      <Row>
        <Col xl={4} lg={4} md={12} sm={12}>
          <Dropdown
            id={`${USER_PERMISSION_ID}_${index}`}
            label={t(USER_PERMISSION_LABEL)}
            selectedValue={userPermission}
            optionList={permissionList}
            onChange={(event) => onPermissionChangeHandler(event.target.value, index, USER_PERMISSION_ID)}
            onBlurHandler={() => onBlurHandler(index)}
            errorMessage={error_list[USER_PERMISSION_ID]}
            isRequired
          />
        </Col>
        <Col xl={8} lg={8} md={12} sm={12}>
          <AddMembers
            id={`${REPORTING_MANAGER_ID}_${index}`}
            label={t(REPORTING_MANAGER_LABEL)}
            selectedData={isEmpty(reportee) ? [] : [reportee]}
            selectedSuggestionData={isEmpty(reportee) ? [] : [reportee]}
            memberSearchValue={memberSearchValue}
            onUserSelectHandler={(event) => onMemberSelectHandler(event.target.value, index, REPORTING_MANAGER_ID)}
            setMemberSearchValue={(event) => memberSearchHandler(event.target.value, index)}
            removeSelectedUser={() => removeUserHandler(index)}
            onBlurHandler={() => onBlurHandler(index)}
            errorText={error_list[REPORTING_MANAGER_ID]}
            isActive
            lastSignin
            clearTextOnUnmount={false}
          />
        </Col>
      </Row>
    </div>
  );
}

InviteMemberCard.defaultProps = {
  email: EMPTY_STRING,
  userPermission: EMPTY_STRING,
  permissionList: [],
  reportee: {},
  memberSearchValue: EMPTY_STRING,
  error_list: {},
  onBlurHandler: () => {},
};

InviteMemberCard.propTypes = {
  index: PropTypes.number.isRequired,
  onDeleteClick: PropTypes.func.isRequired,
  onEmailChangeHandler: PropTypes.func.isRequired,
  onPermissionChangeHandler: PropTypes.func.isRequired,
  memberSearchHandler: PropTypes.func.isRequired,
  onMemberSelectHandler: PropTypes.func.isRequired,
  email: PropTypes.string,
  userPermission: PropTypes.string,
  error_list: PropTypes.objectOf(PropTypes.any),
  removeUserHandler: PropTypes.func.isRequired,
  memberSearchValue: PropTypes.string,
  permissionList: PropTypes.arrayOf(PropTypes.any),
  onBlurHandler: PropTypes.func,
  reportee: PropTypes.objectOf(PropTypes.any),
};

export default InviteMemberCard;
