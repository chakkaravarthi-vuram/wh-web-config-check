import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames/bind';
import { connect } from 'react-redux';
import { isEmpty } from 'lodash';
import ModalLayout from 'components/form_components/modal_layout/ModalLayout';
import modalStyles from 'components/form_components/modal_layout/CustomClasses.module.scss';
import { DATALIST_USERS } from 'urls/RouteConstants';
import { Link } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import i18next from 'i18next';
import Button from '../../../../../components/form_components/button/Button';
import AddMemberBasicDetails from './add_member_basic_details/AddMemberBasicDetails';
import countryCodeList from '../../../../../components/form_components/flags/countryCodeList';
import { ADD_MEMBERS_STRINGS } from './AddMember.strings';
import {
  validate,
  mergeObjects,
  evaluateFocusOnError,
  getDevRoutePath,
  showToastPopover,
} from '../../../../../utils/UtilityFunctions';
import { ADD_MEMBER_BASIC_DETAILS_FORM } from './add_member_basic_details/AddMemberBasicDetails.strings';
import {
  addMemberValidationSchema,
  addMemberValidationSchema2,
  getAddMemberDetailsData,
  getAddMemberBasicDetailsValidateData,
  clearAddMemberState,
} from './AddMember.validation.schema';
import { BUTTON_TYPE, ROLES, KEY_CODES, FORM_POPOVER_STATUS } from '../../../../../utils/Constants';
import { USER_NAME_UNIQUE_CONSTRAIN } from '../AddOrInviteMembers.strings';
import { OTHER_DETAILS_FORM } from './other_details/OtherDetails.strings';
import { EMAIL_REGEX } from '../../../../../utils/strings/Regex';
import {
  getAddMemberDataThunk,
  updateRoleThunk,
  addMemberDataChangeAction,
  updateBusinessUnitThunk,
  updateUserThunk,
  checkUserNameExistThunk,
  clearAddMemberDataAction,
  getEditUserDataThunk,
  checkEmailExistThunk,
  updateUserDetailsThunk,
  addMemberClearReportingManager,
} from '../../../../../redux/actions/AddMember.Action';
import { EMPTY_STRING } from '../../../../../utils/strings/CommonStrings';
import { BS } from '../../../../../utils/UIConstants';
import jsUtils from '../../../../../utils/jsUtility';
import gClasses from '../../../../../scss/Typography.module.scss';
import { removePlusFromCountryCode } from '../../../../../utils/generatorUtils';
import MFAResetConfirmModal from '../../../../mfa/mfa_authentication_methods/confirm_model/ConfirmModal';

let cancelForEmailExist;
let cancelForUserNameExist;
let cancelForAddNewMember;
let cancelForGetUserRole;
let cancelForGetBusinessUnit;
let cancelForGetSuggesstion;
let cancelForAddNewRole;
let cancelForAddNewBusinessUnit;

class AddMember extends Component {
  constructor() {
    super();
    this.state = {
      focusOnErrorFieldId: null,
      focusOnErrorRefresher: null,
      isResetMFAModalOpen: false,
    };
  }

  componentDidMount() {
    const { getEditUserData } = this.props;
    const { userManagementData } = this.props;
    if (userManagementData.isEditable) {
      getEditUserData({ _id: userManagementData.userId });
    } else {
      const constructorData = {
        mobile_number_country_code: countryCodeList[94].countryCodeId,
        mobile_number_country: countryCodeList[94].countryCode.toUpperCase(),
        user_type: ROLES.MEMBER,
      };
      const { dispatch } = this.props;
      dispatch(addMemberDataChangeAction(constructorData));
    }
    // getAddMemberData();
  }

  componentWillUnmount() {
    if (cancelForEmailExist) cancelForEmailExist();
    if (cancelForUserNameExist) cancelForUserNameExist();
    if (cancelForAddNewMember) cancelForAddNewMember();
    if (cancelForGetUserRole) cancelForGetUserRole();
    if (cancelForGetBusinessUnit) cancelForGetBusinessUnit();
    if (cancelForGetSuggesstion) cancelForGetSuggesstion();
    if (cancelForAddNewRole) cancelForAddNewRole();
    if (cancelForAddNewBusinessUnit) cancelForAddNewBusinessUnit();
    const { clearAddMemberData } = this.props;
    clearAddMemberData();
  }

  render() {
    const {
      error_list,
      server_error,
      reporting_manager_search_value,
      not_reporting,
      is_data_loading,
      datalist_info,
      id,
      isModalOpen,
      closeModal,
      t,
      resetMfaFn,
      user_details,
    } = this.props;
    if (!is_data_loading) this.initialLoading = false;
    const { userManagementData } = this.props;
    const { focusOnErrorFieldId, focusOnErrorRefresher, isResetMFAModalOpen } = this.state;
    let addOrEditUserSection = null;
    let addOrEditUserButtonSection = null;
    let resetPassword = null;
    let resetMfa = null;
    if (userManagementData.isEditable) {
      addOrEditUserSection = (
        <div className={modalStyles.ModalHeaderContainer}>
          <div>
            <h2 className={cx(modalStyles.PageTitle)}>
            {t(ADD_MEMBERS_STRINGS.EDIT_TITLE)}
            </h2>
          </div>
        </div>
      );
      addOrEditUserButtonSection = userManagementData.isEditable && !this.initialLoading && (
        <div className={cx(BS.W100, BS.D_FLEX, BS.JC_BETWEEN, BS.ALIGN_ITEM_CENTER)}>
          <div className={cx(BS.D_FLEX)}>
            <Button id="add_member_clear" buttonType={BUTTON_TYPE.SECONDARY} onClick={this.onEditClearClicked}>
              {t(ADD_MEMBERS_STRINGS.CLEAR)}
            </Button>
          </div>
          <div className={cx(BS.D_FLEX)}>
            <Button buttonType={BUTTON_TYPE.PRIMARY} onClick={this.onUpdateUserClicked} id="add_member_save">
            {t(ADD_MEMBERS_STRINGS.UPDATE)}
            </Button>
          </div>
        </div>
      );
    } else {
      addOrEditUserSection = (
        <div className={modalStyles.ModalHeaderContainer}>
          <div>
            <h2 className={cx(modalStyles.PageTitle)}>
            {t(ADD_MEMBERS_STRINGS.TITLE)}
            </h2>
          </div>
        </div>
      );
      addOrEditUserButtonSection = (
        <div className={cx(BS.W100, BS.D_FLEX, BS.JC_BETWEEN, BS.ALIGN_ITEM_CENTER)}>
          <div className={cx(BS.D_FLEX)}>
            <Button id="add_member_clear" buttonType={BUTTON_TYPE.SECONDARY} onClick={this.onClearClicked}>
              {t(ADD_MEMBERS_STRINGS.CLEAR)}
            </Button>
          </div>
          <div className={cx(BS.D_FLEX)}>
            <Button buttonType={BUTTON_TYPE.PRIMARY} onClick={this.onAddMemberClicked} id="add_member_save">
              {t(ADD_MEMBERS_STRINGS.ADD_USER)}
            </Button>
          </div>
        </div>
      );
    }
    const errors = mergeObjects(error_list, server_error);
    let navigateTo;
    if (!jsUtils.isNull(datalist_info)) {
      navigateTo = `${DATALIST_USERS}/${datalist_info.data_list_uuid}/${datalist_info.entry_id}`;
    }

    resetPassword = userManagementData.isEditable && !this.initialLoading && (
      <div className={cx(BS.D_FLEX, gClasses.MT10)}>
        <Button id="reset_password" buttonType={BUTTON_TYPE.SECONDARY} onClick={this.onResetClicked}>
          {t(ADD_MEMBERS_STRINGS.RESET_PASSWORD)}
        </Button>
      </div>
    );
    resetMfa = userManagementData.isEditable && !this.initialLoading && (
      <div className={cx(BS.D_FLEX, gClasses.MT10, gClasses.ML10)}>
        <Button id="reset_mfa" buttonType={BUTTON_TYPE.SECONDARY} onClick={this.onResetClicked}>
          {t(ADD_MEMBERS_STRINGS.RESET_MFA)}
        </Button>
      </div>
    );

    resetMfa = userManagementData.isEditable && !this.initialLoading && user_details?.is_mfa_verified && (
      <div className={cx(BS.D_FLEX, gClasses.MT10, gClasses.ML10)}>
        <Button id="reset_mfa" buttonType={BUTTON_TYPE.SECONDARY} onClick={this.onResetMFAClicked}>
          {t(ADD_MEMBERS_STRINGS.RESET_MFA)}
        </Button>
      </div>
    );

    return (
      <>
        <ModalLayout
          id={id}
          isModalOpen={isModalOpen}
          onCloseClick={closeModal}
          mainContent={(
            <>
              <AddMemberBasicDetails
                formDetails={this.props}
                onUserTypeSelect={this.onUserTypeSelect}
                onChangeHandler={this.onChangeHandler}
                onBlurHandler={this.onBlurHandler}
                errors={errors}
                onKeyDownHandler={this.onEnterKeyPressed}
                reportingManagerSearchText={reporting_manager_search_value}
                setReportingManagerSearchText={this.setReportingManagerSearchText}
                onReportingManagerCBToggle={this.onReportingManagerCBToggle}
                not_reporting={not_reporting}
                removeUserHandler={this.removeUserHandler}
                isEditable={userManagementData.isEditable}
                isDataLoading={userManagementData.isEditable && is_data_loading}
                onFocusHandler={this.onFocusHandler}
                focusOnErrorFieldId={focusOnErrorFieldId}
                focusOnErrorRefresher={focusOnErrorRefresher}
              />
              {!jsUtils.isNull(datalist_info) ?
                (
                <div className={cx(BS.JC_START, gClasses.FTwo13GrayV2)}>
                  <div>
                  {t(ADD_MEMBERS_STRINGS.EDIT_VIEW_FIELDS)}
                  {' '}
                    <Link to={getDevRoutePath(navigateTo)} target="_blank" className={gClasses.FontWeight500}>
                      {t(ADD_MEMBERS_STRINGS.CLICK_HERE)}
                    </Link>
                  </div>
                </div>
                ) : null
              }
              <div className={cx(BS.D_FLEX)}>
              {resetPassword}
              {resetMfa}
              </div>
            </>
          )}
          headerContent={addOrEditUserSection}
          footerContent={addOrEditUserButtonSection}
        />

    <div className={cx(BS.P_RELATIVE)}>
      <MFAResetConfirmModal
        isModalOpen={isResetMFAModalOpen}
        content={t(ADD_MEMBERS_STRINGS.RESET_MFA_MODAL_CONTENT_LINE1)}
        firstLine={t(ADD_MEMBERS_STRINGS.RESET_MFA_MODAL_CONTENT_LINE2)}
        onDelete={() => {
          resetMfaFn(user_details?._id, true);
          this.setState({ isResetMFAModalOpen: false });
        }}
        onCloseModal={() => { this.setState({ isResetMFAModalOpen: false }); }}
        okButtonName={t(ADD_MEMBERS_STRINGS.RESET_MFA_MODAL_DISABLE_BTN_TEXT)}
        cancelButtonName={t(ADD_MEMBERS_STRINGS.RESET_MFA_MODAL_CANCEL_BTN_TEXT)}
      />
    </div>
        {/* <OtherDetails
          // formDetails={this.props}
          onChangeHandler={this.onChangeHandler}
          errors={errors}
          addNewRole={this.addNewRole}
          addNewBusinessUnit={this.addNewBusinessUnit}
          isDataLoading={userManagementData.isEditable && is_data_loading}
          newRoleOrBusinessUnitError={{ ...new_role_error, ...business_unit_error }}
          onKeyDownHandler={this.onEnterKeyPressed}
          onEnterForAddNewRolePressed={this.onEnterForAddNewRolePressed}
          onEnterForAddNewBusinessUnitPressed={this.onEnterForAddNewBusinessUnitPressed}
          isAddBusinessUnitLoading={is_add_business_unit_loading}
          isAddRoleLoading={is_add_role_loading}
        />
        <ContactDetails
          setCountryCode={this.setCountryCode}
          formDetails={this.props}
          onChangeHandler={this.onChangeHandler}
          errors={errors}
          isDataLoading={userManagementData.isEditable && is_data_loading}
          onKeyDownHandler={this.onEnterKeyPressed}
        /> */}
      </>
    );
  }

  onUpdateUserClicked = () => {
    this.validateUpdateUserData();
  };

  onClearClicked = (event) => {
    event.preventDefault();
    this.clearAddMemberState();
  };

  onUserTypeSelect = (user_type) => {
    const { dispatch } = this.props;
    dispatch(addMemberDataChangeAction({ user_type }));
  };

  onAddMemberClicked = (event) => {
    console.log('add member clickd');
    event.preventDefault();
    this.validateAddMemberData();
  };

  onEditClearClicked = () => {
    const { dispatch } = this.props;
    const { user_details } = this.props;
    const data = this.getUserDetailsInitialData(user_details);
    dispatch(
      addMemberDataChangeAction({
        ...data,
        enable_button: false,
        error_list: {},
        server_error: {},
      }),
    );
  };

  onResetClicked = () => {
  const { resetPasswordFunction, user_details } = this.props;
  resetPasswordFunction(user_details._id);
  };

  onResetMFAClicked = () => {
    this.setState({ isResetMFAModalOpen: true });
  };

  onBlurHandler = (event) => {
    const { error_list, username, unique_username, email, unique_email } = this.props;
    const { id } = event.target;
    // Check username is unique from server
    const { userManagementData } = this.props;
    if (!userManagementData.isEditable) {
      if (
        id === ADD_MEMBER_BASIC_DETAILS_FORM.USER_NAME.ID &&
        isEmpty(error_list[ADD_MEMBER_BASIC_DETAILS_FORM.USER_NAME.ID]) &&
        username.length >= USER_NAME_UNIQUE_CONSTRAIN &&
        unique_username !== username
      ) {
        this.checkUsernameExistAPI();
      }

      // Check email is unique from server
      if (
        id === ADD_MEMBER_BASIC_DETAILS_FORM.EMAIL.ID &&
        isEmpty(error_list[ADD_MEMBER_BASIC_DETAILS_FORM.EMAIL.ID]) &&
        EMAIL_REGEX.test(email) &&
        unique_email !== email
      ) {
        this.checkEmailExistAPI();
      }
    }
  };

  onChangeHandler = (event) => {
    console.log('mobile numbers', event.target);
    const { server_error, error_list, not_reporting, dispatch, user_details, t } = this.props;
    // if (server_error.username) delete server_error.username;
    let data = {
      [event.target.id]: event.target.value,
      server_error,
    };
    if (
      event.target.id === OTHER_DETAILS_FORM.REPORTING_MANAGER.ID &&
      event.target.value._id !== jsUtils.get(user_details, '_id')
    ) {
      data = { ...data, reporting_manager_search_value: EMPTY_STRING };
    } else if (
      event.target.id === OTHER_DETAILS_FORM.REPORTING_MANAGER.ID &&
      event.target.value._id === jsUtils.get(user_details, '_id')
    ) {
      return dispatch(
        addMemberDataChangeAction({
          error_list: { ...error_list, reporting_manager: 'Incorrect Reporting Manager' },
        }),
      );
    }
    console.log(data);
    dispatch(addMemberDataChangeAction(data)).then(() => {
      if (!isEmpty(error_list)) {
        const errorData = {
          error_list: validate(
            getAddMemberBasicDetailsValidateData({ ...this.props }),
            not_reporting ? addMemberValidationSchema(t) : addMemberValidationSchema2(t),
          ),
        };
        dispatch(addMemberDataChangeAction(errorData));
      }
    });
    return null;
  };

  onEnterKeyPressed = (event) => {
    if (event?.keyCode === KEY_CODES.ENTER) {
      event.preventDefault();
      this.validateAddMemberData();
    }
  };

  onFocusHandler = () => {
    this.setState({ focusOnErrorFieldId: null });
  };

  onReportingManagerCBToggle = () => {
    const { not_reporting, dispatch, onAddMemberClearReportingManager } = this.props;
    dispatch(
      addMemberDataChangeAction({
        not_reporting: !not_reporting,
      }),
    );
    onAddMemberClearReportingManager();
  };

  getUserDetailsInitialData = (server_data) => {
    const data = {
      first_name: server_data.first_name,
      last_name: server_data.last_name,
      username: server_data.username,
      email: server_data.email,
      user_type: server_data.user_type,
      not_reporting: server_data.not_reporting,
      role: EMPTY_STRING,
      business_unit: EMPTY_STRING,
      reporting_manager: null,
      reporting_manager_search_value: EMPTY_STRING,
    };
    if (server_data.role) data.role = server_data.role;
    if (server_data.business_unit) data.business_unit = server_data.business_unit;
    // Removing Mobile number and Phone Number ,Since these field are not available in update and add user screen.
    // so ther is no use in sending the value in update_user and add_user api.
    if (server_data.reporting_manager) {
      data.reporting_manager = server_data.reporting_manager;
    }
    return data;
  };

  removeUserHandler = () => {
    const { dispatch } = this.props;
    dispatch(addMemberDataChangeAction({ reporting_manager: EMPTY_STRING }));
  };

  // addNewRole = () => {
  //   const { roles, dispatch } = this.props;
  //   if (!isEmpty(roles)) {
  //     const new_role_error = validate({ roles }, addRoleValidationSchema);
  //     dispatch(addMemberDataChangeAction({ new_role_error })).then(() => {
  //       const { new_role_error, role_list } = this.props;
  //       if (isEmpty(new_role_error[OTHER_DETAILS_FORM.ADD_ROLE.ID])) {
  //         const { server_error } = this.props;
  //         const data = {
  //           roles: [roles.trim()],
  //         };
  //         const { updateRole } = this.props;
  //         updateRole(data);
  //       }
  //     });
  //   }
  // };

  // addNewBusinessUnit = () => {
  //   const { business_units, dispatch, updateBusinessUnit } = this.props;
  //   if (!isEmpty(business_units)) {
  //     const businessUnitError = {
  //       business_unit_error: validate({ business_units }, addBusinessUnitValidationSchema),
  //     };
  //     dispatch(addMemberDataChangeAction(businessUnitError)).then(() => {
  //       const { business_unit_error } = this.props;
  //       if (isEmpty(business_unit_error[OTHER_DETAILS_FORM.ADD_BUSINESS_UIT.ID])) {
  //         const { business_units } = this.props;
  //         const data = {
  //           business_units: [business_units.trim()],
  //         };
  //         updateBusinessUnit(data);
  //       }
  //     });
  //   }
  // };

  addMemberAPI = () => {
    console.log('add member api called');
    const { isCreateMemberFromFlow, addMemberToFlow, dispatch } = this.props;
    // Api call for adding member
    const userData = getAddMemberDetailsData({ ...this.props });
    console.log(userData);
    dispatch(updateUserThunk(userData, i18next.t)).then((response) => {
      const { username, closeModal } = this.props;
      if (isCreateMemberFromFlow) {
        console.log(response);
        addMemberToFlow(response._id, username);
      }
      closeModal(true);
      this.clearAddMemberState();
    })
    .catch((error) => {
      const err = error?.response?.data?.errors ? error.response.data.errors[0] : undefined;
      const { focusOnErrorRefresher, focusOnErrorFieldId } = this.state;
      if (err?.type === 'exist' && err?.field === 'username') {
        const refresher = focusOnErrorFieldId === ADD_MEMBER_BASIC_DETAILS_FORM.USER_NAME.ID ? !focusOnErrorRefresher : focusOnErrorRefresher;
        this.setState({ focusOnErrorFieldId: ADD_MEMBER_BASIC_DETAILS_FORM.USER_NAME.ID, focusOnErrorRefresher: refresher });
      } else if (err?.type === 'exist' && err?.field === 'email') {
        const refresher = focusOnErrorFieldId === ADD_MEMBER_BASIC_DETAILS_FORM.EMAIL.ID ? !focusOnErrorRefresher : focusOnErrorRefresher;
        this.setState({ focusOnErrorFieldId: ADD_MEMBER_BASIC_DETAILS_FORM.EMAIL.ID, focusOnErrorRefresher: refresher });
      } else {
        this.setState({ focusOnErrorFieldId: null });
      }
      });
  };

  // setCountryCode = (event) => {
  //   // let data = event.target.countryCodeId;
  //   // data = data.replace("+", "");
  //   const { dispatch } = this.props;
  //   const data = {
  //     mobile_number_country_code: event.target.countryCodeId,
  //     mobile_number_country: event.target.countryCode.toUpperCase(),
  //   };
  //   dispatch(addMemberDataChangeAction(data));
  // };

  checkUsernameExistAPI = (shouldAddMemberOnSuccess) => {
    const { username, dispatch, t } = this.props;
    const data = {
      username,
    };
    dispatch(checkUserNameExistThunk(data, shouldAddMemberOnSuccess, t)).then((data) => {
      console.log('add member api to be called', data.shouldAddMember, data.is_email_unique);
      this.setState({ focusOnErrorFieldId: null });
      if (data.shouldAddMember && data.is_email_unique) this.addMemberAPI();
      else if (data.shouldAddMember && !data.is_email_unique) this.checkEmailExistAPI(true);
    }).catch((error) => {
      const err = error?.response?.data?.errors ? error.response.data.errors[0] : undefined;
      if (err?.type === 'exist' && err?.field === 'username') {
        if (shouldAddMemberOnSuccess) {
          const { focusOnErrorRefresher, focusOnErrorFieldId } = this.state;
          const refresher = focusOnErrorFieldId === ADD_MEMBER_BASIC_DETAILS_FORM.USER_NAME.ID ? !focusOnErrorRefresher : focusOnErrorRefresher;
          this.setState({ focusOnErrorFieldId: ADD_MEMBER_BASIC_DETAILS_FORM.USER_NAME.ID, focusOnErrorRefresher: refresher });
          return;
        }
        this.setState({ focusOnErrorFieldId: null });
      }
    });
  };

  checkEmailExistAPI = (shouldAddMemberOnSuccess) => {
    const { email, dispatch, t } = this.props;
    const data = {
      email,
    };
    dispatch(checkEmailExistThunk(data, shouldAddMemberOnSuccess, t)).then((data) => {
      this.setState({ focusOnErrorFieldId: null });
      if (data.shouldAddMember && data.is_username_unique) this.addMemberAPI();
      else if (data.shouldAddMember && !data.is_username_unique) this.checkUsernameExistAPI(true);
    }).catch((error) => {
      const err = error?.response?.data?.errors ? error.response.data.errors[0] : undefined;
      if (err?.type === 'exist' && err?.field === 'email') {
        if (shouldAddMemberOnSuccess) {
          const { focusOnErrorRefresher, focusOnErrorFieldId } = this.state;
          const refresher = focusOnErrorFieldId === ADD_MEMBER_BASIC_DETAILS_FORM.EMAIL.ID ? !focusOnErrorRefresher : focusOnErrorRefresher;
          this.setState({ focusOnErrorFieldId: ADD_MEMBER_BASIC_DETAILS_FORM.EMAIL.ID, focusOnErrorRefresher: refresher });
          return;
        }
        this.setState({ focusOnErrorFieldId: null });
      }
    });
  };

  setReportingManagerSearchText = (event) => {
    const { dispatch } = this.props;
    dispatch(
      addMemberDataChangeAction({
        reporting_manager_search_value: event.target.value,
      }),
    );
  };

  validateUpdateUserData = () => {
    const { not_reporting, dispatch, t } = this.props;
    const errorData = {
      error_list: validate(
        getAddMemberBasicDetailsValidateData({ ...this.props }),
        not_reporting ? addMemberValidationSchema(t) : addMemberValidationSchema2(t),
      ),
    };
    dispatch(addMemberDataChangeAction(errorData)).then(() => {
      const { error_list, server_error } = this.props;
      if (isEmpty(error_list) && isEmpty(server_error)) {
        this.updateUserApi();
      } else {
           const allFormFieldIdsInAccessibleOrder = [
            ADD_MEMBER_BASIC_DETAILS_FORM.FIRST_NAME.ID,
            ADD_MEMBER_BASIC_DETAILS_FORM.LAST_NAME.ID,
          ];
          !not_reporting && allFormFieldIdsInAccessibleOrder.push(OTHER_DETAILS_FORM.REPORTING_MANAGER.ID);
          const { focusOnErrorRefresher, focusOnErrorFieldId } = this.state;
          const newFocusOnErrorFieldId = evaluateFocusOnError(allFormFieldIdsInAccessibleOrder, error_list);
          const refresher = focusOnErrorFieldId === newFocusOnErrorFieldId ? !focusOnErrorRefresher : focusOnErrorRefresher;
          this.setState({ focusOnErrorFieldId: newFocusOnErrorFieldId, focusOnErrorRefresher: refresher });
      }
    });
  };

  updateUserApi = () => {
    const { user_details, t } = this.props;
    const data = this.getUpdatedUserDetailsData(this.getUserDetailsInitialData(user_details), {
      ...this.props,
    });
    if (!jsUtils.isEmpty(data)) {
      const { userManagementData, dispatch } = this.props;
      data._id = userManagementData.userId;
      dispatch(updateUserDetailsThunk(data, t))
        .then(() => {
          const { closeModal } = this.props;
          closeModal(true);
          this.clearAddMemberState();
        })
        .catch((errorData) => {
          if (errorData.common_server_error) {
            showToastPopover(
              errorData.common_server_error,
              EMPTY_STRING,
              FORM_POPOVER_STATUS.SERVER_ERROR,
              true,
            );
          } else if (errorData.server_error) {
            const errorMessage = Object.values(errorData.server_error)[0];
              showToastPopover(
                'Error in updating user',
                errorMessage,
                FORM_POPOVER_STATUS.SERVER_ERROR,
                true,
              );
          } else {
            showToastPopover(
              'Something went wrong',
              'Please try again after sometimes',
              FORM_POPOVER_STATUS.SERVER_ERROR,
              true,
            );
          }
        });
    }
  };

  getUpdatedUserDetailsData = (props, state) => {
    const data = {};
    Object.keys(props).forEach((id) => {
      // if (!jsUtils.isEqual(props[id], state[id])) {
      if (
        id !== OTHER_DETAILS_FORM.MOBILE_NUMBER.ID &&
        id !== OTHER_DETAILS_FORM.MOBILE_NUMBER_COUNTRY.ID &&
        id !== OTHER_DETAILS_FORM.MOBILE_NUMBER_COUNTRY_CODE.ID
      ) {
        if (id === OTHER_DETAILS_FORM.REPORTING_MANAGER.ID) {
          if (!state.not_reporting) data[id] = state[id]._id;
        } else if (id === OTHER_DETAILS_FORM.MOBILE_NUMBER_COUNTRY_CODE.ID) {
          data[id] = removePlusFromCountryCode(state[id]);
        } else if (id === 'not_reporting') {
          data[id] = state[id];
        } else if (id === 'user_type') {
          data[id] = state[id];
        } else if (jsUtils.isEmpty(state[id]) && !jsUtils.isEmpty(props[id])) data[id] = null;
        else if (!jsUtils.isEmpty(state[id])) data[id] = state[id].trim();
      }
    });
    // Removing Mobile Number ,Since this field is not available in update user screen
    // so ther is no use in sending the value in update_user api.
    // removing username and email since read only
    return data;
  };

  validateAddMemberData = () => {
    const { not_reporting, dispatch, t } = this.props;
    const errorData = {
      error_list: validate(
        getAddMemberBasicDetailsValidateData({ ...this.props }),
        not_reporting ? addMemberValidationSchema(t) : addMemberValidationSchema2(t),
      ),
    };
    dispatch(addMemberDataChangeAction(errorData)).then(() => {
      const { error_list, is_username_unique, is_email_unique, server_error } = this.props;
      if (isEmpty(error_list)) {
        console.log('add member validated');
        console.log('add member error list', server_error);
        if (cancelForEmailExist) cancelForEmailExist();
        if (cancelForUserNameExist) cancelForUserNameExist();
        if (!is_email_unique) this.checkEmailExistAPI(true);
        else if (!is_username_unique) this.checkUsernameExistAPI(true);
        else if (
          (isEmpty(server_error) || isEmpty(server_error.email)) &&
          (isEmpty(server_error) || isEmpty(server_error.username))
        ) {
          console.log('add membere api calld');
          this.addMemberAPI();
          this.setState({ focusOnErrorFieldId: null });
        }
      } else {
          const allFormFieldIdsInAccessibleOrder = [
            ADD_MEMBER_BASIC_DETAILS_FORM.FIRST_NAME.ID,
            ADD_MEMBER_BASIC_DETAILS_FORM.LAST_NAME.ID,
            ADD_MEMBER_BASIC_DETAILS_FORM.EMAIL.ID,
            ADD_MEMBER_BASIC_DETAILS_FORM.USER_NAME.ID,
            OTHER_DETAILS_FORM.REPORTING_MANAGER.ID,
          ];
          const { focusOnErrorRefresher } = this.state;
          const focusOnErrorFieldId = evaluateFocusOnError(allFormFieldIdsInAccessibleOrder, error_list);
          this.setState({ focusOnErrorFieldId, focusOnErrorRefresher: !focusOnErrorRefresher });
          console.log('xyz submitting');
      }
    });
  };

  clearAddMemberState = () => {
    const data = clearAddMemberState();
    const { dispatch } = this.props;
    dispatch(
      addMemberDataChangeAction({
        ...data,
      }),
    );
    this.setState({ focusOnErrorFieldId: null });
  };

  initialLoading = true;
}

const mapStateToProps = (state) => {
  const {
    role,
    user_type,
    reporting_manager,
    business_unit,
    mobile_number_country_code,
    mobile_number_country,
    first_name,
    last_name,
    username,
    email,
    phone_number,
    mobile_number,
    error_list,
    server_error,
    common_server_error,
    selected_value,
    is_data_loading,
    suggestion_list,
    role_list,
    business_unit_list,
    roles,
    business_units,
    new_role_error,
    business_unit_error,
    reporting_manager_search_value,
    not_reporting,
    user_details,
    enable_button,
    is_add_role_loading,
    is_add_business_unit_loading,
    unique_email,
    unique_username,
    datalist_info,
  } = state.AddMemberReducer;

  const userManagementData = state.UserManagementAdminReducer;

  return {
    userManagementData,
    role,
    user_type,
    reporting_manager,
    business_unit,
    mobile_number_country_code,
    mobile_number_country,
    first_name,
    last_name,
    username,
    email,
    phone_number,
    mobile_number,
    error_list,
    server_error,
    common_server_error,
    selected_value,
    is_data_loading,
    suggestion_list,
    role_list,
    business_unit_list,
    roles,
    business_units,
    new_role_error,
    business_unit_error,
    reporting_manager_search_value,
    not_reporting,
    user_details,
    enable_button,
    is_add_role_loading,
    is_add_business_unit_loading,
    unique_email,
    unique_username,
    datalist_info,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getEditUserData: (id) => {
      dispatch(getEditUserDataThunk(id));
    },
    getAddMemberData: () => {
      dispatch(getAddMemberDataThunk());
    },
    updateRole: (value, t) => {
      dispatch(updateRoleThunk(value, t));
    },
    updateBusinessUnit: (value, t) => {
      dispatch(updateBusinessUnitThunk(value, t));
    },
    clearAddMemberData: (value) => {
      dispatch(clearAddMemberDataAction(value));
    },
    onAddMemberClearReportingManager: () => {
      dispatch(addMemberClearReportingManager());
    },
    dispatch,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(AddMember));
AddMember.propTypes = {
  closeModal: PropTypes.func,
  isCreateMemberFromFlow: PropTypes.bool,
  addMemberToFlow: PropTypes.func,
  username: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  error_list: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  server_error: PropTypes.arrayOf(PropTypes.any),
  is_data_loading: PropTypes.bool.isRequired,
  role_list: PropTypes.arrayOf(PropTypes.any).isRequired,
  roles: PropTypes.string.isRequired,
  business_units: PropTypes.string.isRequired,
  new_role_error: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  business_unit_error: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  reporting_manager_search_value: PropTypes.string.isRequired,
  not_reporting: PropTypes.bool.isRequired,
  getAddMemberData: PropTypes.func.isRequired,
  updateRole: PropTypes.func.isRequired,
  updateBusinessUnit: PropTypes.func.isRequired,
  is_username_unique: PropTypes.bool,
  is_email_unique: PropTypes.bool,
  dispatch: PropTypes.func.isRequired,
  clearAddMemberData: PropTypes.func.isRequired,
  is_add_business_unit_loading: PropTypes.bool,
  is_add_role_loading: PropTypes.bool,
};
AddMember.defaultProps = {
  closeModal: null,
  isCreateMemberFromFlow: false,
  addMemberToFlow: null,
  error_list: [],
  server_error: [],
  new_role_error: [],
  business_unit_error: [],
  is_username_unique: null,
  is_email_unique: null,
  is_add_business_unit_loading: false,
  is_add_role_loading: false,
};
