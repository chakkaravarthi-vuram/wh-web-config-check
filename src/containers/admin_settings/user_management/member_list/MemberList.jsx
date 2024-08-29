import React, { useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { AvatarGroup, AvatarSizeVariant, EPopperPlacements } from '@workhall-pvt-lmt/wh-ui-library';
import BlockUserIconCopy from '../../../../assets/icons/BlockUserIconCopy';
import EditIconV2 from '../../../../assets/icons/form_fields/EditIconV2';
import ThemeContext from '../../../../hoc/ThemeContext';

import UpdateConfirmPopover from '../../../../components/update_confirm_popover/UpdateConfirmPopover';
import UserManagementListContentLoader from '../../../../components/content_loaders/admin_settings_content_loaders/UserManagementListContentLoader';
import ResponseHandler from '../../../../components/response_handlers/ResponseHandler';
import UnBlockUserIcon from '../../../../assets/icons/UnBlockUserIcon';
import TablePaginationRowSelection from '../../../../components/table_pagination_row_selection/TablePaginationRowSelection';
import Button from '../../../../components/form_components/button/Button';
import MailIcon from '../../../../assets/icons/MailIcon';
import {
  ROW_COUNT_DROPDOWN, MEMBER_LIST_POP_OVER_STRINGS,
  HEADER_STRINGS,
  USER_MANAGEMENT_FORM,
  RESET_PASSWORD,
  USER_MANAGEMENT_HEADING,
  RESET_MFA_STRINGS,
} from '../UserManagement.strings';

import { BUTTON_TYPE, KEY_CODES } from '../../../../utils/Constants';
import {
  EMPTY_STRING,
  USER_TYPE_STRINGS,
} from '../../../../utils/strings/CommonStrings';

import {
  clearAlertPopOverStatus,
  getPopperContent,
  getUserImagesForAvatar,
  updateAlertPopverStatus,
  validateEmailAndName,
} from '../../../../utils/UtilityFunctions';
import { ARIA_ROLES, BS } from '../../../../utils/UIConstants';

import gClasses from '../../../../scss/Typography.module.scss';
import styles from './MemberList.module.scss';
import { getFullName } from '../../../../utils/generatorUtils';
import MFAResetConfirmModal from '../../../mfa/mfa_authentication_methods/confirm_model/ConfirmModal';
import { constructAvatarGroupList } from '../../../application/app_listing/AppListing.utils';

function MemberList(props) {
  const {
    memberList,
    onActivateOrDeactivateClick,
    messageObject,
    emptyListClassName,
    onEditUserClicked,
    cardCount,
    isMemberListLoading,
    onAddMemberButtonClick,
    userAutoSuggestion,
    document_details,

    ddlRowSelectedValue,
    ddlRowOnChangeHandler,

    paginationActivePage,
    paginationItemsCountPerPage,
    paginationTotalItemsCount,
    paginationOnChange,
    paginationClassName,
    paginationIsDataLoading,
    mailDisplayNone,
    userManagementRowClass,
    userManagementProfile,
    paddingTd,
    userSettingsMarginBottom,
    resetPasswordFunction,
    resetMfaFn,
  } = props;
  const { t } = useTranslation();
  const { buttonColor } = useContext(ThemeContext);
  const history = useHistory();
  let memberListView = null;

  const [mfaFormData, setIsResetMFAModalOpen] = useState({ isResetMFAModalOpen: false, accountId: '' });
  const handleEscClose = (event) => {
    if (event.keyCode === KEY_CODES.ESCAPE) {
      setIsResetMFAModalOpen({ ...mfaFormData, isResetMFAModalOpen: false });
    }
  };
  useEffect(() => {
    document.addEventListener('keydown', handleEscClose);
  }, []);
  // const onSortToggle = (sortField) => {
  //   let userListSortIndex = SORT_VALUE.ASCENDING;

  //   if (user_list_sort_index === SORT_VALUE.ASCENDING) {
  //     userListSortIndex = SORT_VALUE.DESCENDING;
  //   }
  //   dispatch(
  //     userManagementDataChangeAction({
  //       ...sortField,
  //       user_list_sort_index: userListSortIndex,
  //     }),
  //   ).then(() => {
  //     dispatch(getUserManagementDataThunk());
  //   });
  // };

  // const onUserNameSortToggle = () => {
  //   const sortField = 'first_name';
  //   onSortToggle({ sort_field: sortField });
  // };

  // const onUserRoleSortToggle = () => {
  //   const sortField = 'user_type';
  //   onSortToggle({ sort_field: sortField });
  // };

  const handlePasswordReset = (id) => {
    resetPasswordFunction(id);
  };

  const handleResetMfaConfirm = (accountid) => {
    setIsResetMFAModalOpen({ ...mfaFormData, isResetMFAModalOpen: true, accountId: accountid });
  };

  const deletConfirm = (memberDetails, title, subTitle) => {
    // if (memberDetails.is_active) {
      updateAlertPopverStatus({
        isVisible: true,
        customElement: (
          <UpdateConfirmPopover
            onYesHandler={async () => {
              onActivateOrDeactivateClick(memberDetails);
              clearAlertPopOverStatus();
            }}
            onNoHandler={() => clearAlertPopOverStatus()}
            title={title}
            subTitle={subTitle}
          />
        ),
      });
    // } else {
    //   onActivateOrDeactivateClick(memberDetails);
    // }
  };

  // let nameArrowClass = gClasses.Rotate90;
  // let roleArrowClass = gClasses.Rotate90;
  // const isUserNameSortActive = sort_field === 'first_name';
  // const isUserRoleSortActive = sort_field === 'user_type';
  let actionButton = (
    <BlockUserIconCopy
      className={cx(gClasses.RedV2)}
      title={t(USER_MANAGEMENT_HEADING.DEACTIVATE_USER_ICON)}
      ariaLabel="Deactivate User"
      role={ARIA_ROLES.IMG}
    />
  );
  let inActiveUserClass = EMPTY_STRING;

  // if (isUserNameSortActive) {
  //   if (user_list_sort_index === SORT_VALUE.DESCENDING) {
  //     nameArrowClass = gClasses.Rotate90;
  //   } else {
  //     nameArrowClass = gClasses.Rotate270;
  //   }
  // } else if (sort_field === 'user_type') {
  //   if (user_list_sort_index === SORT_VALUE.DESCENDING) {
  //     roleArrowClass = gClasses.Rotate90;
  //   }
  //   else {
  //     roleArrowClass = gClasses.Rotate270;
  //   }
  // }
  if (isMemberListLoading) {
    memberListView = <UserManagementListContentLoader count={cardCount} />;
  } else if (memberList && memberList.length > 0) {
    const profilePics = getUserImagesForAvatar(
      memberList,
      [],
      document_details,
    );
    const contentArray = memberList.map((memberDetails, index) => {
      const userImageObj = [];
      userImageObj.push({
        firstName: memberDetails.first_name,
        lastName: memberDetails.last_name,
        url: profilePics[index].url,
        id: memberDetails._id,
      });
      if (!memberDetails.is_active) {
        actionButton = (
          <UnBlockUserIcon
            className={cx(styles.AccountStatus)}
            title={t(USER_MANAGEMENT_HEADING.ACTIVATE_USER_ICON)}
            role={ARIA_ROLES.IMG}
            ariaLabel="Activate User"
          />
        );
        inActiveUserClass = gClasses.Opacity5;
      }
      const fullName = getFullName(
        memberDetails.first_name,
        memberDetails.last_name,
      );
      const rowObj = {
        fullName: (
          <div className={cx(inActiveUserClass, gClasses.CenterV, styles.UsernameStyle)}>
            <AvatarGroup
              userImages={constructAvatarGroupList({ users: [{ ...memberDetails, profile_pic: profilePics[index].url }] })}
              allAvatarData={constructAvatarGroupList({ users: [{ ...memberDetails, profile_pic: profilePics[index].url }] })}
              count={1}
              size={AvatarSizeVariant.xs}
              popperPlacement={EPopperPlacements.AUTO}
              getPopperContent={(id, type, onShow, onHide) =>
                getPopperContent(id, type, onShow, onHide, history, true)
              }
              getRemainingPopperContent={(id, type, onShow, onHide) =>
                getPopperContent(id, type, onShow, onHide, history, true)
              }
              className={cx(styles.UserImage, userManagementProfile)}
            />
            <div className={cx(BS.D_FLEX)} style={{ flexDirection: 'column' }}>
              <div
                className={cx(
                  gClasses.ML20,
                  gClasses.Ellipsis,
                  styles.TableContent,
                )}
                title={fullName}
              >
                {fullName}
              </div>
              <div
                className={cx(
                  inActiveUserClass,
                  gClasses.ML20,
                  mailDisplayNone,
                  styles.TableContent,
                )}
              >
                <div
                  className={cx(gClasses.FOne13GrayV3, gClasses.Ellipsis)}
                  title={memberDetails.username}
                >
                  <MailIcon style={{ fill: '#dee0e4' }} />
                  <span className={gClasses.ML10}>{memberDetails.email}</span>
                </div>
              </div>
            </div>
          </div>
        ),
        role: (
          <div className={cx(inActiveUserClass, styles.TableContent)}>
            <div
              className={cx(
                gClasses.FOne12GrayV3,
                gClasses.Ellipsis,
                gClasses.FlexGrow1,
              )}
            >
              {USER_TYPE_STRINGS[memberDetails.user_type]}
            </div>
          </div>
        ),
        last_signin: memberDetails.last_signin ? (
          <div className={cx(inActiveUserClass, styles.TableContent)}>
            <div
              className={cx(
                gClasses.FOne12GrayV3,
                gClasses.Ellipsis,
                gClasses.FlexGrow1,
              )}
            >
              {memberDetails.last_signin.pref_datetime_display}
            </div>
          </div>
        ) : (
          t(USER_MANAGEMENT_HEADING.YET_TO_LOGIN)
        ),
      };

      if (memberDetails.is_active) {
        rowObj.edit =
          <div className={styles.ButtonColm}>
            <button
              className={cx(
                gClasses.CursorPointer,
                styles.Button,
                styles.EditContainer,
                gClasses.ClickableElement,
              )}
              style={{ borderColor: buttonColor }}
              onClick={() => onEditUserClicked(memberDetails._id)}
              id={memberDetails._id}
            >
              {userManagementProfile ? (
                <EditIconV2 title={t(USER_MANAGEMENT_HEADING.EDIT_USERS)} />
              ) : (
                <EditIconV2
                  className={styles.EditIcon}
                  isButtonColor
                  title={t(USER_MANAGEMENT_HEADING.EDIT_USERS)}
                />
              )}
            </button>
            <button
              className={cx(
                gClasses.CursorPointer,
                styles.Button,
                gClasses.ClickableElement,
                gClasses.MR5,
                styles.IconsSpace,
              )}
              onClick={() => {
                deletConfirm(memberDetails, t(MEMBER_LIST_POP_OVER_STRINGS.DEACTIVE.TITLE), t(MEMBER_LIST_POP_OVER_STRINGS.DEACTIVE.SUB_TITLE));
              }}
              id={memberDetails._id}
            >
              {!userManagementProfile ? (
                <UnBlockUserIcon title={t(USER_MANAGEMENT_HEADING.ACTIVATE_USER_ICON)} />
              ) : (
                actionButton
              )}
            </button>
            <Button id="reset_password" className={cx(styles.Button, gClasses.ML5)} buttonType={BUTTON_TYPE.OUTLINE_PRIMARY} onClick={() => handlePasswordReset(memberDetails._id)}>
              {t(RESET_PASSWORD.RESET)}
            </Button>
            {(memberDetails?.is_mfa_verified) &&
              <Button id="reset_mfa" className={cx(styles.Button, gClasses.ML5)} buttonType={BUTTON_TYPE.OUTLINE_PRIMARY} onClick={() => handleResetMfaConfirm(memberDetails._id)}>
                {t(RESET_MFA_STRINGS.RESET_MFA)}
              </Button>
            }
          </div>;
      }

      if (!memberDetails.is_active) {
        rowObj.deActivate =
          <button
            className={cx(gClasses.CursorPointer, styles.Button, gClasses.ClickableElement)}
            onClick={() => {
              deletConfirm(memberDetails, t(MEMBER_LIST_POP_OVER_STRINGS.ACTIVE.TITLE), t(MEMBER_LIST_POP_OVER_STRINGS.ACTIVE.SUB_TITLE));
            }}
            id={memberDetails._id}
          >
            {!memberDetails.is_active ? <UnBlockUserIcon title={t(USER_MANAGEMENT_HEADING.ACTIVATE_USER_ICON)} role={ARIA_ROLES.IMG} ariaLabel="Activate User" /> : null}
          </button>;
      }

      return rowObj;
    });
    const headerArray = [
      <span>
        {t(HEADER_STRINGS.FULL_NAME)}
        {/* <ArrowIcon
          className={cx(nameArrowClass, styles.ArrowIcon, gClasses.ML5, gClasses.CursorPointer)}
          onClick={onUserNameSortToggle}
          isButtonColor={isUserNameSortActive}
        /> */}
      </span>,
      <span>
        {t(HEADER_STRINGS.ROLE)}
      </span>,
      <span>
        {t(HEADER_STRINGS.LAST_LOGGED_IN)}
        {/* <ArrowIcon
          className={cx(roleArrowClass, styles.ArrowIcon, gClasses.ML5, gClasses.CursorPointer)}
          onClick={onUserRoleSortToggle}
          isButtonColor={isUserRoleSortActive}
        /> */}
      </span>,
    ];
    memberListView = (
      <TablePaginationRowSelection
        ddlRowOptionList={ROW_COUNT_DROPDOWN}
        ddlRowSelectedValue={ddlRowSelectedValue}
        ddlRowOnChangeHandler={ddlRowOnChangeHandler}
        userManagementRowClass={userManagementRowClass}
        tblClassName={styles.Table}
        tblRowClassName={styles.RowContainer}
        tblHeader={headerArray}
        tblData={contentArray}
        tblFixFirstColumn
        paddingTd={paddingTd}
        paginationActivePage={paginationActivePage}
        paginationItemsCountPerPage={paginationItemsCountPerPage}
        paginationTotalItemsCount={paginationTotalItemsCount}
        paginationOnChange={paginationOnChange}
        paginationClassName={paginationClassName}
        paginationIsDataLoading={paginationIsDataLoading}
        userSettingsMarginBottom={userSettingsMarginBottom}
        PaginationWithRowsPerPageStatus
        pageRangeDisplayed={3}
        isUserManagement
      />
    );
  } else if (messageObject) {
    const searchInputType = validateEmailAndName(userAutoSuggestion);
    const addUserSuggestion = searchInputType !==
      USER_MANAGEMENT_FORM.RESPONSE_HANLDER_STRINGS.PEOPLE.SEARCH_INPUT_TYPES
        .INVALID && (
      <>
        <div className={cx(gClasses.CenterH)}>
          <div className={cx(gClasses.FOne13GrayV6, gClasses.MR5)}>
            {t(USER_MANAGEMENT_FORM.RESPONSE_HANLDER_STRINGS.PEOPLE.SUB_TITLE_1)}
          </div>
          <div className={cx(gClasses.FOne13GrayV3, gClasses.MR5)}>
            {userAutoSuggestion}
          </div>
          <div className={cx(gClasses.FOne13GrayV6)}>
            {t(USER_MANAGEMENT_FORM.RESPONSE_HANLDER_STRINGS.PEOPLE.SUB_TITLE_2)}
          </div>
        </div>
        <div className={cx(gClasses.CenterH, gClasses.MB20)}>
          <Button
            onClick={() => {
              onAddMemberButtonClick({
                searchInput: userAutoSuggestion,
                searchInputType,
              });
            }}
            className={cx(gClasses.WidthFitContent, gClasses.MT15)}
            buttonType={BUTTON_TYPE.PRIMARY}
          >
            {t(USER_MANAGEMENT_FORM.RESPONSE_HANLDER_STRINGS.PEOPLE.BUTTON_TEXT)}
          </Button>
        </div>
      </>
    );
    memberListView = (
      <>
        <ResponseHandler
          className={cx(emptyListClassName, gClasses.MT50)}
          messageObject={messageObject}
        />
        <div className={gClasses.MT10}>{addUserSuggestion}</div>
      </>
    );
  }

  return (
  <>
    {memberListView}
    <div className={cx(BS.P_RELATIVE)}>
      <MFAResetConfirmModal
        isModalOpen={mfaFormData.isResetMFAModalOpen}
        content={t(RESET_MFA_STRINGS.RESET_MFA_MODAL_CONTENT_LINE1)}
        firstLine={t(RESET_MFA_STRINGS.RESET_MFA_MODAL_CONTENT_LINE2)}
        onDelete={() => {
          setIsResetMFAModalOpen({ ...mfaFormData, isResetMFAModalOpen: false });
          resetMfaFn(mfaFormData.accountId, false);
        }}
        onCloseModal={() => { setIsResetMFAModalOpen({ ...mfaFormData, isResetMFAModalOpen: false }); }}
        okButtonName={t(RESET_MFA_STRINGS.RESET_MFA_MODAL_DISABLE_BTN_TEXT)}
        cancelButtonName={t(RESET_MFA_STRINGS.RESET_MFA_MODAL_CANCEL_BTN_TEXT)}
      />
    </div>
  </>
  );
}

const mapStateToProps = (state) => {
  const { user_list_sort_index, sort_field, document_details } =
    state.UserManagementAdminReducer;

  return {
    user_list_sort_index,
    sort_field,
    document_details,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MemberList);
MemberList.defaultProps = {
  placeholder: EMPTY_STRING,
  isDataLoading: false,
  messageObject: {},
  emptyListClassName: EMPTY_STRING,
  className: EMPTY_STRING,
  teamDetails: {},
  isMemberListLoading: false,
  type: null,
  document_details: [],
};
MemberList.propTypes = {
  memberList: PropTypes.arrayOf(PropTypes.any).isRequired,
  onActivateOrDeactivateClick: PropTypes.func.isRequired,
  onDropdownChange: PropTypes.func.isRequired,
  onEditUserClicked: PropTypes.func.isRequired,
  type: PropTypes.number,
  placeholder: PropTypes.string,
  isDataLoading: PropTypes.bool,
  messageObject: PropTypes.objectOf(PropTypes.any),
  emptyListClassName: PropTypes.string,
  className: PropTypes.string,
  teamDetails: PropTypes.objectOf(PropTypes.any),
  cardCount: PropTypes.number.isRequired,
  isMemberListLoading: PropTypes.bool,
  document_details: PropTypes.arrayOf(PropTypes.object),
};
