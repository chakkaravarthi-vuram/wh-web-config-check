import React, { useContext, useEffect, useState } from 'react';
import cx from 'classnames/bind';
import PropTypes from 'prop-types';
import { Container, Row, Col } from 'reactstrap';
import ModalLayout from 'components/form_components/modal_layout/ModalLayout';
import modalStyles from 'components/form_components/modal_layout/CustomClasses.module.scss';
import { useTranslation } from 'react-i18next';
import { VALIDATION_ERROR_TYPES } from 'utils/strings/CommonStrings';
import ThemeContext from '../../../../../hoc/ThemeContext';
import InviteMemberCard from '../../../../../components/member_list/invite_member/InviteMemberCard';
import Button, { BUTTON_TYPE } from '../../../../../components/form_components/button/Button';

import { IM_FORM, INVITE_USER_ERROR_POPOVER, INVITE_USER_SUCCESS_POPOVER } from './InviteMember.strings';
import { BS } from '../../../../../utils/UIConstants';
import {
  addNewMemberCardToList,
  clearReporteeByIndex,
  deleteMemberCardByIndex,
  getEmail,
  getError,
  getInitialUserDetails,
  getMemberDetailsByIndex,
  getMemberValidationDetailsByIndex,
  getPermission,
  getReportee,
  getReporteeSearchText,
  setMemberCardDetailsByIndex,
  setEmail,
  setErrorByIndex,
  setPermission,
  setReportee,
  setReporteSearchText,
  getMembersValidationDetails,
  setError,
  clearErrorByIndex,
  getDataForApi,
  setServerError,
} from './inviteMemberCard.selectors';
import { FORM_POPOVER_STATUS, ROLES_LIST } from '../../../../../utils/Constants';
import {
  EMAIL_ADDRESS_ID,
  REPORTING_MANAGER_ID,
  USER_PERMISSION_ID,
} from '../../../../../components/member_list/invite_member/inviteMemberCard.strings';
import { keydownOrKeypessEnterHandle, showToastPopover, validate } from '../../../../../utils/UtilityFunctions';
import { isEmpty } from '../../../../../utils/jsUtility';
import { inviteMemberCardSchema, inviteMembersSchema } from './validation/inviteMember.schema';
import { checkEmailUniqueError } from './inviteMemberUtils';
import { inviteUserApiService } from '../../../../../axios/apiService/userManagementAdmin.apiService';

import gClasses from '../../../../../scss/Typography.module.scss';
import { EMPTY_STRING } from '../../../../../utils/strings/CommonStrings';
import { ERROR_TYPE_TRIAL_EXPIRATION_ERROR } from '../../../../../utils/ServerValidationUtils';
import { ADD_OR_INVITE_USERS_ERROR } from '../AddOrInviteMembers.strings';

let cancelForInviteUser;

export const getCancelTokenForInviteUser = (cancelToken) => {
  cancelForInviteUser = cancelToken;
};
function InviteMember(props) {
  const { buttonColor } = useContext(ThemeContext);
  const [inviteMemberList, setInviteMemberList] = useState([getInitialUserDetails()]);
  const { onCloseHandler, id, isModalOpen } = props;
  const [focusOnErrorCard, setFocusOnErrorCard] = useState(-1);
  const [focusOnErrorRefresher, setFocusOnErrorRefresher] = useState(false);
  const { t } = useTranslation();
  useEffect(() => {
    if (cancelForInviteUser) return cancelForInviteUser;
    return () => {};
  }, []);

  const updateErrorPopover = () => {
    showToastPopover(
      t(INVITE_USER_ERROR_POPOVER.title),
      t(INVITE_USER_ERROR_POPOVER.subTitle),
      FORM_POPOVER_STATUS.SERVER_ERROR,
      true,
    );
  };

  const inviteUserApiCall = () => {
    inviteUserApiService(getDataForApi(inviteMemberList)).then(
      (response) => {
        if (response) {
          showToastPopover(t(INVITE_USER_SUCCESS_POPOVER.title), EMPTY_STRING, FORM_POPOVER_STATUS.SUCCESS, true);
          onCloseHandler();
          return true;
        }
        updateErrorPopover();
        return false;
      },
      (error) => {
        const { TRIAL_LIMIT, LIMIT_EXCEED } = ADD_OR_INVITE_USERS_ERROR(t);
        setInviteMemberList(setServerError(inviteMemberList, error));
        if (error?.common_server_error === VALIDATION_ERROR_TYPES.LIMIT || error?.response?.data?.errors[0]?.type === VALIDATION_ERROR_TYPES.LIMIT) {
          showToastPopover(LIMIT_EXCEED, EMPTY_STRING, FORM_POPOVER_STATUS.SERVER_ERROR, true);
        } else if (error?.common_server_error === ERROR_TYPE_TRIAL_EXPIRATION_ERROR || error?.response?.data?.errors[0]?.type === ERROR_TYPE_TRIAL_EXPIRATION_ERROR) {
          showToastPopover(TRIAL_LIMIT, EMPTY_STRING, FORM_POPOVER_STATUS.SERVER_ERROR, true);
        } else {
          showToastPopover(t(INVITE_USER_ERROR_POPOVER.title), error?.server_error, FORM_POPOVER_STATUS.SERVER_ERROR, true);
        }
        const errorKeys = error?.state_error && Object.keys(error.state_error);
        const index = errorKeys && errorKeys[0].split('.')[1];
        if (index) {
          setFocusOnErrorCard(Number(index));
          setFocusOnErrorRefresher((p) => !p);
        }
      },
    );
  };
  const onInviteUserClick = (event) => {
    event.preventDefault();
    const memberList = getMembersValidationDetails(inviteMemberList);
    const error = validate(memberList, inviteMembersSchema(t));
    let newMemberList;
    let uniqueEmailError;
    if (isEmpty(error)) {
      [newMemberList, uniqueEmailError] = checkEmailUniqueError(inviteMemberList);
      setInviteMemberList(newMemberList);
      setFocusOnErrorCard(-1);
    }
    if (!isEmpty(error)) {
      const newList = setError(inviteMemberList, error);
      setInviteMemberList(newList);
      updateErrorPopover();
      const index = Object.keys(error)[0].split(',')[0];
      setFocusOnErrorCard(Number(index));
      setFocusOnErrorRefresher((p) => !p);
      return false;
    }
    if (uniqueEmailError) {
      updateErrorPopover();
      return false;
    }
    inviteUserApiCall();
    return true;
  };

  const onDeleteHandler = (_index) => {
    const memberList = deleteMemberCardByIndex(inviteMemberList, _index);
    const [newMemberList] = checkEmailUniqueError(memberList);
    setInviteMemberList(newMemberList);
  };
  const onAddUserClick = () => {
    setInviteMemberList(addNewMemberCardToList(inviteMemberList));
  };

  const onReporteeRemoveHandler = (_index) => {
    const memberDetails = getMemberDetailsByIndex(inviteMemberList, _index);
    if (memberDetails) {
      const newList = clearReporteeByIndex(inviteMemberList, _index);
      if (newList) {
        setInviteMemberList(newList);
      }
    }
  };

  const setReporteeSearchTextHandler = (searchText, _index) => {
    const memberDetails = getMemberDetailsByIndex(inviteMemberList, _index);
    if (memberDetails) {
      const updatedMemberDetails = setReporteSearchText(memberDetails, searchText);
      const newList = setMemberCardDetailsByIndex(inviteMemberList, _index, updatedMemberDetails);
      if (newList) {
        setInviteMemberList(newList);
      }
    }
  };

  const onBlurHandler = (_index) => {
    const memberDetails = getMemberValidationDetailsByIndex(inviteMemberList, _index);
    let newMemberList;
    let uniqueEmailError;
    const error = validate(memberDetails, inviteMemberCardSchema(t));
    if (!isEmpty(error)) {
      const newList = setErrorByIndex(inviteMemberList, _index, error);
      if (newList) {
        setInviteMemberList(newList);
      }
    } else if (isEmpty(error)) {
      newMemberList = clearErrorByIndex(inviteMemberList, _index);
      [newMemberList, uniqueEmailError] = checkEmailUniqueError(newMemberList);
      if (!uniqueEmailError) {
        const newList = clearErrorByIndex(newMemberList, _index);
        if (newList) {
          setInviteMemberList(newList);
        }
      } else {
        setInviteMemberList(newMemberList);
      }
    }
  };

  const onChangeHandler = (value, _index, id) => {
    const memberDetails = getMemberDetailsByIndex(inviteMemberList, _index);
    if (memberDetails) {
      let newValue;
      switch (id) {
        case REPORTING_MANAGER_ID: {
          newValue = setReportee(memberDetails, value);
          break;
        }
        case EMAIL_ADDRESS_ID: {
          newValue = setEmail(memberDetails, value);
          break;
        }
        case USER_PERMISSION_ID: {
          newValue = setPermission(memberDetails, value);
          break;
        }
        default:
          break;
      }
      const newList = setMemberCardDetailsByIndex(inviteMemberList, _index, newValue);
      setInviteMemberList(newList);
    }
  };

  return (
    <Container fluid>
      <ModalLayout
        id={id}
        isModalOpen={isModalOpen}
        onCloseClick={onCloseHandler}
        mainContent={(
          <>
            <Row>
              <Col sm={12} xl={12}>
                <div className={cx(gClasses.MT5, gClasses.FOne13GrayV2)}>{t(IM_FORM.SUB_TTILE)}</div>
                <div>
                  {inviteMemberList.map((memberDetails, index) => (
                    <div className={gClasses.MT20}>
                      <InviteMemberCard
                        index={index}
                        onEmailChangeHandler={onChangeHandler}
                        onDeleteClick={onDeleteHandler}
                        email={getEmail(memberDetails)}
                        userPermission={getPermission(memberDetails)}
                        reportee={getReportee(memberDetails)}
                        permissionList={ROLES_LIST}
                        onPermissionChangeHandler={onChangeHandler}
                        memberSearchHandler={setReporteeSearchTextHandler}
                        memberSearchValue={getReporteeSearchText(memberDetails)}
                        onMemberSelectHandler={onChangeHandler}
                        removeUserHandler={onReporteeRemoveHandler}
                        onBlurHandler={onBlurHandler}
                        error_list={getError(memberDetails)}
                        focusOnError={focusOnErrorCard === index}
                        focusOnErrorRefresher={focusOnErrorRefresher}
                      />
                    </div>
                  ))}
                </div>
              </Col>
            </Row>
            <div>
              <div
                className={cx(BS.ML_AUTO, gClasses.CursorPointer, gClasses.FTwo13, gClasses.MT15, gClasses.MB5, gClasses.FontWeight500)}
                onClick={onAddUserClick}
                onKeyDown={(e) => keydownOrKeypessEnterHandle(e) && onAddUserClick(e)}
                tabIndex={0}
                role="button"
                style={{ color: buttonColor }}
              >
                {t(IM_FORM.ADD_USER)}
              </div>
            </div>
          </>
        )}
        headerContent={(
          <div className={modalStyles.ModalHeaderContainer}>
            <div>
              <h2 className={cx(gClasses.ModalHeader, modalStyles.PageTitle)}>
              {t(IM_FORM.TITLE)}
              </h2>
            </div>
          </div>
        )}
        footerContent={(
          <div className={cx(BS.W100, BS.D_FLEX, BS.JC_END, BS.ALIGN_ITEM_CENTER)}>
            <Button
              id={IM_FORM.INVITE_BUTTON_ID}
              buttonType={BUTTON_TYPE.PRIMARY}
              disabled={inviteMemberList.length === 0}
              onClick={onInviteUserClick}
            >
              {t(IM_FORM.INVITE_BUTTON)}
            </Button>
          </div>
        )}
      />
    </Container>
  );
}

InviteMember.propTypes = {
  onCloseHandler: PropTypes.func.isRequired,
};

export default InviteMember;
