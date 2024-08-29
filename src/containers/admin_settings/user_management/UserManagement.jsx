/**
 * @author Asttle
 * @email asttlej@vuram.com
 * @create date 2020-01-29 18:15:12
 * @modify date 2020-01-29 18:15:12
 * @desc [description]
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames/bind';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';
import { withTranslation } from 'react-i18next';
import ThemeContext from '../../../hoc/ThemeContext';

import Input, {
  INPUT_VARIANTS,
} from '../../../components/form_components/input/Input';
import Button from '../../../components/form_components/button/Button';
import SearchIcon from '../../../assets/icons/SearchIcon';
import CloseIconNew from '../../../assets/icons/CloseIconNew';

import AddMember from './add_or_invite_members/add_member/AddMember';
import Dropdown from '../../../components/form_components/dropdown/Dropdown';
import Label from '../../../components/form_components/label/Label';
import AddExistingUser from './add_existing_user/AddExistingUser';
import InviteMember from './add_or_invite_members/invite_member/InviteMember';
import MemberList from './member_list/MemberList';
import {
  USER_MANAGEMENT_FORM,
  USER_TYPE_DD,
  USER_TYPE_DD_OPTIONS,
  USER_STATUS_DD,
  USER_TYPES_INDEX,
  USER_MANAGEMENT_PAGINATION,
  MODAL_STATUS,
  USER_MANAGEMENT_HEADING,
} from './UserManagement.strings';
import { BS } from '../../../utils/UIConstants';
import { BUTTON_TYPE } from '../../../utils/Constants';
import {
  getServerErrorMessageObject,
  getUserProfileData,
  keydownOrKeypessEnterHandle,
  updateConfirmPopover,
  validateEmailAndName,
} from '../../../utils/UtilityFunctions';
import jsUtils from '../../../utils/jsUtility';
import {
  getUserManagementDataThunk,
  userManagementDataChangeAction,
  activateOrDeactivateUserThunk,
  userRoleChangeThunk,
  clearUserManagementDataAction,
  passwordResetThunk,
  resetMfaThunk,
} from '../../../redux/actions/UserManagementAdmin.Action';
import { EMPTY_STRING } from '../../../utils/strings/CommonStrings';
import { addMemberDataChangeAction, getEditUserDataThunk } from '../../../redux/actions/AddMember.Action';

import gClasses from '../../../scss/Typography.module.scss';
import styles from './UserManagement.module.scss';
import {
  generateEventTargetObject,
} from '../../../utils/generatorUtils';

let cancelForUserList;
let cancelForUpdateUserType;
let cancelForActivateOrDeactivateUser;

export const getCancelGetUserList = (cancelToken) => {
  cancelForUserList = cancelToken;
};

export const getCancelActivateOrDeactivateUser = (cancelToken) => {
  cancelForActivateOrDeactivateUser = cancelToken;
};

export const getCancelUpdateUserType = (cancelToken) => {
  cancelForUpdateUserType = cancelToken;
};

class UserManagement extends Component {
  constructor(props) {
    super(props);
    this.containerCompRef = null;
    this.headerCompRef = null;
    this.headerRef = (element) => {
      this.headerCompRef = element;
    };
    this.listCompRef = null;
    this.listRef = (element) => {
      this.listCompRef = element;
    };
    this.state = { ddlRowSelectedValue: 5 };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    let listHeight = 500;
    if (this.containerCompRef && this.headerCompRef && this.listCompRef) {
      listHeight =
        this.containerCompRef.clientHeight - this.headerCompRef.clientHeight;
      this.listCompRef.style.height = `${listHeight}px`;
    }
    const cardCount = 5;
    const data = {
      user_type: USER_TYPES_INDEX.ALL_USERS,
      modal_status: MODAL_STATUS.CLOSE,
      total_items_count:
        USER_MANAGEMENT_PAGINATION.PAGINATION_DATA.totalItemsCount,
      cardCount,
    };
    dispatch(userManagementDataChangeAction(data)).then(() => {
      this.getUserList();
    });
  }

  componentWillUnmount() {
    if (cancelForUserList) cancelForUserList();
    if (cancelForUpdateUserType) cancelForUpdateUserType();
    if (cancelForActivateOrDeactivateUser) cancelForActivateOrDeactivateUser();
    const { clearUserManagementData } = this.props;
    clearUserManagementData();
  }

  render() {
    const {
      common_server_error,
      user_list,
      modal_status,
      user_type,
      user_auto_suggestion,
      is_data_loading,
      page,
      total_items_count,
      cardCount,
      user_status_index,
      isMemberListLoading,
      t,
      isMfaVerified,
    } = this.props;
    const { ddlRowSelectedValue } = this.state;
    const message_object = getServerErrorMessageObject(
      common_server_error,
      user_list,
      null,
      t,
    );
    if (message_object) {
      message_object.title =
        t(USER_MANAGEMENT_FORM.RESPONSE_HANLDER_STRINGS.PEOPLE.TITLE);
      message_object.subTitle =
        validateEmailAndName(user_auto_suggestion) !==
        USER_MANAGEMENT_FORM.RESPONSE_HANLDER_STRINGS.PEOPLE.SEARCH_INPUT_TYPES
          .INVALID
          ? EMPTY_STRING
          : t(USER_MANAGEMENT_FORM.RESPONSE_HANLDER_STRINGS.PEOPLE.SUB_TITLE);
    }
    let modal = null;
    let commonHeader = null;
    commonHeader = (
      <div>
        <p className={cx(styles.SubCommonHeaderTitle, gClasses.HeadingTitle2)}>
         {t(USER_MANAGEMENT_HEADING.HEADING)}
        </p>
        <div
          className={cx(gClasses.CenterV, BS.JC_BETWEEN, styles.CommonHeader, BS.P_RELATIVE)}
          // style={{ marginTop: '-50px' }}
        >
          <div className={cx(BS.D_FLEX)}>
          {USER_TYPE_DD_OPTIONS.OPTION_LIST(t).map((option, index) => {
            const labelClassName = cx(
              option.value === user_type
                ? styles.SelectedColor
                : styles.UnSelectedColor,
            );
            return (
              <div
                key={option.label}
                className={cx(
                  index + 1 === USER_TYPE_DD.OPTION_LIST.length
                    ? gClasses.MR40
                    : gClasses.MR30,
                  BS.P_RELATIVE,
                )}
                tabIndex={0}
                role="button"
                onClick={() =>
                  this.onChangeHandler(
                    generateEventTargetObject(USER_TYPE_DD.ID, option.value),
                  )}
                onKeyDown={(e) => keydownOrKeypessEnterHandle(e) && this.onChangeHandler(
                    generateEventTargetObject(USER_TYPE_DD.ID, option.value),
                  )}
              >
                <Label
                  content={option.label}
                  value={option.value}
                  id={USER_TYPE_DD.ID}
                  className={cx(
                    labelClassName,
                    gClasses.ClickableElement,
                    gClasses.CursorPointer,
                    styles.noselect,
                  )}
                  labelStyles={cx(styles.LabelStyles)}
                  isDataLoading={is_data_loading}
                />
                <div className={option.value === user_type && styles.Active} />
              </div>
            );
          })}
          </div>
          <div className={cx(BS.P_ABSOLUTE, styles.ButtonContainerPosition)}>
            {is_data_loading ? (
              <>
                <Skeleton
                  width={75}
                  height={25}
                  style={{ borderRadius: '20' }}
                />
                <Skeleton
                  width={75}
                  height={25}
                  style={{ borderRadius: '20' }}
                />
              </>
            ) : (
              <>
                <Button
                  buttonType={BUTTON_TYPE.SECONDARY}
                  onClick={this.onInviteMemberButtonClick}
                  className={cx(gClasses.ButtonSM)}
                >
                  {t(USER_MANAGEMENT_FORM.INVITE_BUTTON.TITLE)}
                </Button>
                <Button
                  id="add_member"
                  buttonType={BUTTON_TYPE.PRIMARY}
                  onClick={this.onAddMemberButtonClick}
                  className={(styles.Button, gClasses.ML15)}
                  isDataLoading={is_data_loading}
                >
                  {t(USER_MANAGEMENT_FORM.ADD_BUTTON.TITLE)}
                </Button>
              </>
            )}
          </div>
        </div>
        <div
          className={cx(gClasses.CenterV, gClasses.Flex1, styles.InputSearch)}
        >
          <span id={`${USER_MANAGEMENT_FORM.USER_SEARCH.ID}_label`} />
          <Input
            className={cx(gClasses.Flex1)}
            inputContainerClasses={cx(
              styles.SearchInputPadding,
              styles.CustomHeight,
              styles.InputBorderSearch,
            )}
            placeholder={t(USER_MANAGEMENT_FORM.USER_SEARCH.PLACEHOLDER)}
            id={USER_MANAGEMENT_FORM.USER_SEARCH.ID}
            value={user_auto_suggestion}
            onChangeHandler={this.onChangeHandler}
            inputVariant={INPUT_VARIANTS.TYPE_2}
            readOnlyPrefix={<SearchIcon className={styles.SearchIcon} title="search" ariaHidden />}
            isDataLoading={is_data_loading}
            icon={!jsUtils.isEmpty(user_auto_suggestion) && (
              <CloseIconNew
                title="Clear"
                className={cx(styles.CloseIcon, gClasses.CursorPointer)}
                onClick={this.onCloseIconClick}
              />
            )}
          />
          <div className={cx(styles.SortContainer, BS.P_ABSOLUTE)}>
            {/* <Dropdown
              dropdownListClasses={styles.DropdownList}
              // id={dropdown.id}
              optionList={USER_STATUS_DD.OPTION_LIST}
              onChange={(event) => {
                console.log('gfsgfgdf', event.target.value, user_status_index - 1)
                // if (event.target.value !== user_status_index + 1) {
                //   this.onChangeHandler(event);
                // }
              }}
              selectedValue={user_status_index}
              tabBased
              isNewDropdown
              isBorderLess
              noInputPadding
              isTaskDropDown
              isSortDropdown
              isAdminSearchSort
            /> */}
            <Dropdown
              dropdownListClasses={styles.DropdownList}
              optionList={USER_STATUS_DD.OPTION_LIST(t).map((item) => {
                return { ...item, value: item.value + 1 };
              })}
              onChange={(event) => {
                if (event.target.value !== user_status_index + 1) {
                  this.onChangeHandler(event);
                }
              }}
              id={USER_STATUS_DD.ID}
              selectedValue={user_status_index + 1}
              // errorMessage={defaultValueError}
              tabBased
              isNewDropdown
              isBorderLess
              noInputPadding
              isTaskDropDown
              isSortDropdown
              isAdminSearchSort
            />
          </div>
        </div>
      </div>
    );
    switch (modal_status) {
      case MODAL_STATUS.ADD_USER:
        modal = (
          <AddMember
            id="add_user_modal"
            isModalOpen
            onCloseClick={this.onAddMemberModalClose}
            closeModal={this.onAddMemberModalClose}
            contentClass={cx(
              styles.ModalPadding,
              gClasses.ModalContentClass,
              gClasses.FullScreenModal,
            )}
            resetPasswordFunction={this.resetPasswordAPI}
            resetMfaFn={this.resetMFAAPI}
            isMfaVerified={isMfaVerified}
          />
        );
        break;
      case MODAL_STATUS.INVITE_USER:
        modal = (
          <InviteMember
            id="invite_user_modal"
            isModalOpen
            onCloseClick={this.onInviteMemberModalClose}
            onCloseHandler={() => this.onInviteMemberModalClose(true)}
            contentClass={cx(
              styles.ModalPadding,
              gClasses.ModalContentClass,
              gClasses.FullScreenModal,
            )}
          />
        );
        break;
      default:
        break;
    }
    return (
      <div className={cx(BS.H100)}>
        {modal}
        {commonHeader}
        <div className={styles.UserContent} ref={this.headerRef}>
          {user_type !== USER_TYPES_INDEX.ALL_USERS && (
            <AddExistingUser
              userType={user_type}
              onRoleChange={this.onDropdownChange}
              isDataLoading={is_data_loading}
              className={cx(gClasses.MB10, gClasses.MT10)}
            />
          )}
          <div className={cx(gClasses.PB5)} ref={this.listRef}>
            <MemberList
              className={styles.MemberList}
              memberList={user_list}
              onActivateOrDeactivateClick={this.onActivateOrDeactivateClick}
              onDropdownChange={this.onDropdownChange}
              onEditUserClicked={this.onEditUserClicked}
              placeholder={t(USER_MANAGEMENT_FORM.MEMBER_LIST.PLACEHOLDER)}
              isDataLoading={is_data_loading}
              isMemberListLoading={isMemberListLoading}
              emptyListClassName={gClasses.MT40}
              messageObject={message_object}
              cardCount={cardCount}
              onAddMemberButtonClick={this.onAddMemberButtonClick}
              userAutoSuggestion={user_auto_suggestion}
              ddlRowSelectedValue={ddlRowSelectedValue}
              ddlRowOnChangeHandler={this.ddlRowOnChangeHandler}
              paginationActivePage={page}
              paginationItemsCountPerPage={cardCount}
              tblRowClassName={styles.RowContainer}
              paginationTotalItemsCount={total_items_count}
              paginationOnChange={this.handlePageChange}
              paginationClassName={cx(gClasses.MT15, gClasses.MB30)}
              paginationIsDataLoading={is_data_loading}
              mailDisplayNone={styles.MailDisplayNone}
              userManagementRowClass={styles.UserManagementRowClass}
              userManagementProfile={styles.UserManagementProfile}
              paddingTd={styles.UserManagementContentPadding}
              userSettingsMarginBottom={gClasses.MT15}
              PaginationWithRowsPerPage
              resetPasswordFunction={this.resetPasswordAPI}
              resetMfaFn={this.resetMFAAPI}
              isMfaVerified={isMfaVerified}
            />
          </div>
        </div>
      </div>
    );
  }

  onEditUserClicked = (id) => {
    const { dispatch } = this.props;
    dispatch(
      userManagementDataChangeAction({
        isEditable: true,
        userId: id,
      }),
    );
    this.setModalStatus(MODAL_STATUS.ADD_USER);
  };

  onActivateOrDeactivateClick = (details) => {
    const { t } = this.props;
    const userProfile = getUserProfileData();
    if (details.email === userProfile.email) {
      updateConfirmPopover({
        title: t(USER_MANAGEMENT_FORM.CONFIRM_DEACTIVATE_STRING),
        isVisible: true,
        onConfirm: () => this.activateOrDeactivateUser(details, true),
      });
    } else this.activateOrDeactivateUser(details);
  };

  onChangeHandler = (event) => {
    const { dispatch } = this.props;
    const eventValue = event.target.value;
    const eventId = event.target.id;
    const dataObj = { [eventId]: eventValue };

    dispatch(userManagementDataChangeAction(dataObj)).then(() => {
      switch (eventId) {
        case USER_MANAGEMENT_FORM.USER_SEARCH.ID:
          if (cancelForUserList) cancelForUserList();
          this.getUserList();
          break;
        case USER_TYPE_DD.ID: {
          const data = {
            user_type: eventValue,
            page: 1,
          };
          dispatch(userManagementDataChangeAction(data)).then(() => {
            this.getUserList();
          });
          break;
        }
        case USER_STATUS_DD.ID: {
          const user_status_index = eventValue - 1;
          const data = {
            user_status_index,
            page: 1,
          };
          dispatch(userManagementDataChangeAction(data)).then(() => {
            this.getUserList();
          });
          break;
        }

        default:
          break;
      }
    });
  };

  onCloseIconClick = () => {
    const event = {
      target: {
        id: USER_MANAGEMENT_FORM.USER_SEARCH.ID,
        value: EMPTY_STRING,
      },
    };
    this.onChangeHandler(event);
  };

  onDropdownChange = (event) => {
    const { user_list } = this.props;
    const data = {
      _id: event.target.id,
      user_type: event.target.value,
    };
    console.log('here add on', data);
    const updated_user_type = user_list.findIndex(
      (user) => user._id === data._id,
    );
    if (
      jsUtils.get(user_list, [updated_user_type, 'user_type']) !==
      data.user_type
    ) {
      const userProfile = getUserProfileData();
      if (
        jsUtils.get(user_list, [updated_user_type, 'email']) ===
        userProfile.email
      ) {
        // eslint-disable-next-line no-alert
        const change_role = window.confirm(
          USER_MANAGEMENT_FORM.CONFIRM_CHANGE_ROLE_STRING,
        );
        if (change_role) this.callRoleChangeAPI(data, true);
      } else {
        this.callRoleChangeAPI(data);
      }
    }
  };

  onAddMemberButtonClick = (autoPopulateInputs) => {
    this.setModalStatus(MODAL_STATUS.ADD_USER, autoPopulateInputs);
  };

  onInviteMemberButtonClick = () => {
    this.setModalStatus(MODAL_STATUS.INVITE_USER);
  };

  onInviteMemberModalClose = (noConfirmation) => {
    if (noConfirmation) {
      this.setModalStatus(MODAL_STATUS.CLOSE);
    } else {
    updateConfirmPopover({
      title:
        'Change made will be lost if you try to collapse. Do you want to collapse?',
      isVisible: true,
      onConfirm: () => this.setModalStatus(MODAL_STATUS.CLOSE),
    });
    }
  };

  onAddMemberModalClose = (isMemberAddedSuccessful) => {
    const { dispatch } = this.props;
    const { isEditable } = this.props;
    dispatch(
      userManagementDataChangeAction({
        isEditable: isEditable ? false : isEditable,
      }),
    );
    this.setModalStatus(MODAL_STATUS.CLOSE);
    if (isMemberAddedSuccessful) this.getUserList();
  };

  ddlRowOnChangeHandler = (e) => {
    const { cardCount } = this.props;
    const selectedTableRowCount = e.target.value;
    if (cardCount !== selectedTableRowCount) {
      const data = {
        page: 1,
        cardCount: selectedTableRowCount,
      };
      const { dispatch } = this.props;
      dispatch(userManagementDataChangeAction(data)).then(() => {
        this.getUserList();
      });
      this.setState({ ddlRowSelectedValue: selectedTableRowCount });
    }
  };

  getUserList = () => {
    const { getUserManagementData } = this.props;
    getUserManagementData();
  };

  activateOrDeactivateUser = (details, isActiveUser) => {
    const data = {
      _id: details._id,
    };
    const { dispatch, t } = this.props;
    dispatch(activateOrDeactivateUserThunk(data, isActiveUser, t)).then(() => {
      this.getUserList();
    });
  };

  callRoleChangeAPI = (data, isActiveUser) => {
    const { dispatch, t } = this.props;
    dispatch(userRoleChangeThunk(data, isActiveUser, t)).then(() => {
      this.getUserList();
    });
  };

  resetPasswordAPI = (id) => {
    const { dispatch, t } = this.props;
    dispatch(
      passwordResetThunk({
        user_id: id,
      },
        t,
      ));
  };

  resetMFAAPI = (id, isEditUser) => {
    const { t, dispatch } = this.props;
    if (isEditUser) {
      dispatch(resetMfaThunk({ user_id: id }, t)).then((res) => {
        if (res) {
          dispatch(getEditUserDataThunk({ _id: id }));
        }
      });
    } else {
      dispatch(resetMfaThunk({ user_id: id }, t)).then((res) => {
        if (res) {
          this.getUserList();
        }
      });
    }
  };

  setModalStatus = async (modal_status, autoPopulateInputs) => {
    const { dispatch, addMemberDataChange } = this.props;
    await dispatch(
      userManagementDataChangeAction({
        modal_status,
      }),
    );
    if (!jsUtils.isEmpty(autoPopulateInputs)) {
      let autoPopulateData = {};
      if (
        autoPopulateInputs.searchInputType ===
        USER_MANAGEMENT_FORM.RESPONSE_HANLDER_STRINGS.PEOPLE.SEARCH_INPUT_TYPES
          .EMAIL
      ) {
        autoPopulateData = {
          email: autoPopulateInputs.searchInput,
          username: autoPopulateInputs.searchInput,
        };
      } else if (
        autoPopulateInputs.searchInputType ===
        USER_MANAGEMENT_FORM.RESPONSE_HANLDER_STRINGS.PEOPLE.SEARCH_INPUT_TYPES
          .FIRST_NAME
      ) {
        autoPopulateData = {
          first_name: jsUtils.startCase(autoPopulateInputs.searchInput),
        };
      } else if (
        autoPopulateInputs.searchInputType ===
        USER_MANAGEMENT_FORM.RESPONSE_HANLDER_STRINGS.PEOPLE.SEARCH_INPUT_TYPES
          .FULL_NAME
      ) {
        const stringTokens = autoPopulateInputs.searchInput.split(' ');
        const lastName = stringTokens.splice(stringTokens.length - 1, 1);
        const firstName = stringTokens.join(' ');
        autoPopulateData = {
          first_name: jsUtils.startCase(firstName),
          last_name: jsUtils.startCase(lastName),
        };
      }
      addMemberDataChange(autoPopulateData);
    }
  };

  handlePageChange = (page) => {
    const data = {
      page,
    };
    const { dispatch } = this.props;
    dispatch(userManagementDataChangeAction(data)).then(() => {
      this.getUserList();
    });
  };
}

const mapStateToProps = (state) => {
  const {
    page,
    user_type,
    user_auto_suggestion,
    new_card_user_auto_suggestion,
    user_list,
    modal_status,
    total_items_count,
    cardCount,
    full_user_list,
    common_server_error,
    is_data_loading,
    user_status_index,
    isEditable,
    isMemberListLoading,
  } = state.UserManagementAdminReducer;
  const { adminProfile } = state.AdminProfileReducer.adminProfile;
  const { isMfaVerified } = state.MfaReducer;

  return {
    adminProfile,
    isMfaVerified,
    page,
    user_type,
    user_auto_suggestion,
    new_card_user_auto_suggestion,
    user_list,
    modal_status,
    total_items_count,
    cardCount,
    common_server_error,
    is_data_loading,
    full_user_list,
    user_status_index,
    isEditable,
    isMemberListLoading,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getUserManagementData: (value) => {
      dispatch(getUserManagementDataThunk(value));
    },
    clearUserManagementData: (value) => {
      dispatch(clearUserManagementDataAction(value));
    },
    addMemberDataChange: (value) => {
      dispatch(addMemberDataChangeAction(value));
    },
    resetMFA: (value) => {
      dispatch(resetMfaThunk(value));
    },
    dispatch,
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(withTranslation()(UserManagement)),
);

UserManagement.defaultProps = {
  adminProfile: {},
  user_type: null,
  new_card_user_auto_suggestion: EMPTY_STRING,
  common_server_error: EMPTY_STRING,
  user_list: [],
};

UserManagement.propTypes = {
  adminProfile: PropTypes.objectOf(PropTypes.any),
  // containerHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  // user_type_index: PropTypes.number.isRequired,
  page: PropTypes.number.isRequired,
  user_type: PropTypes.number,
  user_auto_suggestion: PropTypes.string.isRequired,
  new_card_user_auto_suggestion: PropTypes.string,
  user_list: PropTypes.arrayOf(PropTypes.any),
  // is_add_button_clicked: false,
  modal_status: PropTypes.number.isRequired,
  total_items_count: PropTypes.number.isRequired,
  cardCount: PropTypes.number.isRequired,
  getUserManagementData: PropTypes.func.isRequired,
  dispatch: PropTypes.func.isRequired,
  common_server_error: PropTypes.string,
  is_data_loading: PropTypes.bool.isRequired,
  user_status_index: PropTypes.number.isRequired,
  clearUserManagementData: PropTypes.func.isRequired,
};

UserManagement.contextType = ThemeContext;
