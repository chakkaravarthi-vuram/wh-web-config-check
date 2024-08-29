import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import cx from 'classnames/bind';
import { Row, Col } from 'reactstrap';
import { useTranslation } from 'react-i18next';
import { Text, ETextSize, CheckboxGroup as CheckboxGroupFromLib } from '@workhall-pvt-lmt/wh-ui-library';
import { useHistory } from 'react-router';
import Button, {
  BUTTON_TYPE,
} from '../../../components/form_components/button/Button';
import CheckboxGroup from '../../../components/form_components/checkbox_group/CheckboxGroup';
import Label from '../../../components/form_components/label/Label';
import Dropdown from '../../../components/form_components/dropdown/Dropdown';
import FormTitle from '../../../components/form_components/form_title/FormTitle';
import Input from '../../../components/form_components/input/Input';
import AddMembers from '../../../components/member_list/add_members/AddMembers';
import CustomCol from '../../../components/custom_col/CustomCol';

import { OTHER_SETTINGS_FORM } from './OtherSettings.strings';
import gClasses from '../../../scss/Typography.module.scss';
import { BS } from '../../../utils/UIConstants';
import styles from './OtherSettings.module.scss';
import {
  EMPTY_STRING,
  DROPDOWN_CONSTANTS,
} from '../../../utils/strings/CommonStrings';
import {
  validate,
  mergeObjects,
  getCountryCodeDropdownList,
  isBasicUserMode,
} from '../../../utils/UtilityFunctions';
import jsUtils, { cloneDeep } from '../../../utils/jsUtility';

import {
  authAccountConfigurationValidationSchema,
  accountConfigurationValidationSchema,
  mfaDetailsValidationSchema,
} from './OtherSettings.validate.schema';
import {
  getAccountConfigurationDetailsApiAction,
  accountConfigurationDataChangeAction,
  updateAccountConfigurationDetailsApiAction,
  updateAuthAccountConfigurationDetailsApiAction,
  getAuthAccountConfigurationDetailsApiAction,
} from '../../../redux/actions/AccountConfigurationAdmin.Action';

import {
  CUSTOM_LAYOUT_COL,
  SAVE_BUTTON_COL_SIZE,
} from '../AdminSettings.strings';
import FormPostOperationFeedback from '../../../components/popovers/form_post_operation_feedback/FormPostOperationFeedback';
import WebpageEmbedSettings from './webpage_embed_settings/WebpageEmbedSettings';
import { getUsersApiThunk } from '../../../redux/actions/Appplication.Action';
import { applicationDataChange } from '../../../redux/reducer/ApplicationReducer';
import DeleteConfirmModal from '../../application/delete_comfirm_modal/DeleteConfirmModal';
import { NON_PRIVATE_TEAMS_PARAMS } from '../../edit_flow/EditFlow.utils';

let cancelForGetConfigurationDetails;
let cancelForUpdateDetails;
let cancelForGetConfigurationDetailsAuth;
let cancelForUpdateDetailsAuth;

export const getCancelGetConfigurationDetails = (cancelToken) => {
  cancelForGetConfigurationDetails = cancelToken;
};

export const getCancelUpdateConfigurationDetails = (cancelToken) => {
  cancelForUpdateDetails = cancelToken;
};

export const getCancelGetConfigurationDetailsAuth = (cancelToken) => {
  cancelForGetConfigurationDetailsAuth = cancelToken;
};

export const getCancelUpdateConfigurationDetailsAuth = (cancelToken) => {
  cancelForUpdateDetailsAuth = cancelToken;
};

function OtherSettings(props) {
  const { t } = useTranslation();
  const [searchText, setSearchText] = useState(EMPTY_STRING);
  const [mfaConfirmationModal, setMfaConfirmationModal] = useState(false);
  const [isMfaDataChanged, setIsMfaDataChanged] = useState(false);
  const { mfa_enforced_teams } = props;
  const history = useHistory();
  const isNormalMode = isBasicUserMode(history);
  useEffect(() => {
    const {
      getAccountConfigurationDetailsApi,
      getAuthAccountConfigurationDetailsApi,
    } = props;
    getAccountConfigurationDetailsApi();
    getAuthAccountConfigurationDetailsApi();
  }, []);

  useEffect(() => () => {
    if (cancelForGetConfigurationDetails) cancelForGetConfigurationDetails();
    if (cancelForUpdateDetails) cancelForUpdateDetails();
    if (cancelForGetConfigurationDetailsAuth) cancelForGetConfigurationDetailsAuth();
    if (cancelForUpdateDetailsAuth) cancelForUpdateDetailsAuth();
  }, []);

  const getAuthAccountConfigurationData = (serverData) => {
    return {
      session_timeout: serverData.session_timeout
        ? Number(serverData.session_timeout)
        : 0,
        mobile_session_timeout: serverData.mobile_session_timeout
        ? Number(serverData.mobile_session_timeout)
        : 1, // default value is 1 day
      is_remember_me_enabled: serverData.is_remember_me_enabled
        ? serverData.is_remember_me_enabled
        : false,
      remember_me_days: serverData.remember_me_days
        ? Number(serverData.remember_me_days)
        : 0,
      is_password_expiry_enabled: serverData.is_password_expiry_enabled
        ? serverData.is_password_expiry_enabled
        : false,
      password_expiry_days: serverData.password_expiry_days
        ? Number(serverData.password_expiry_days)
        : 0,
    };
  };

  const getMfaConfigurationServerdata = (serverData) => {
    return {
      mfa_details: {
      allowed_mfa_methods: serverData.mfa_details?.allowed_mfa_methods
        ? serverData.mfa_details?.allowed_mfa_methods
        : [],
      },
      mfa_enforced_teams: serverData.mfa_enforced_teams
        ? serverData.mfa_enforced_teams
        : [],
      is_mfa_enabled: serverData.is_mfa_enabled ? serverData.is_mfa_enabled : false,
    };
  };

  const getAccountConfigurationData = (serverData) => {
    return {
      maximum_file_size: serverData.maximum_file_size
        ? Number(serverData.maximum_file_size)
        : 0,
      allowed_extensions: serverData.allowed_extensions
        ? serverData.allowed_extensions
        : [],
      allowed_currency_types: serverData.allowed_currency_types
        ? serverData.allowed_currency_types
        : [],
      default_currency_type: serverData.default_currency_type
        ? serverData.default_currency_type
        : null,
      default_country_code: serverData.default_country_code
        ? serverData.default_country_code
        : null,
    };
  };
  const getMfaConfigurationData = (serverData) => {
    return {
      is_mfa_enabled: serverData.is_mfa_enabled
        ? serverData.is_mfa_enabled
        : false,
        allowed_mfa_methods: serverData.mfa_details?.allowed_mfa_methods
        ? serverData.mfa_details?.allowed_mfa_methods
        : [],
        mfa_enforced_teams: serverData.mfa_enforced_teams
        ? serverData.mfa_enforced_teams
        : [],
    };
  };
  const compareStateAndServerData = (state) => {
    const { other_settings } = state;
    const authAccountConfigurationData = getAuthAccountConfigurationData(state);
    const authAccountConfigurationServerData =
      getAuthAccountConfigurationData(other_settings);
    const accountConfigurationData = getAccountConfigurationData(state);
    const accountConfigurationServerData =
      getAccountConfigurationData(other_settings);

    // non modified data
    const mfaConfigurationServerData = getMfaConfigurationData(other_settings);
    const mfaConfigurationData = getMfaConfigurationData(state);

    const isAuthAccountConfigurationDataModified = !jsUtils.isEqual(
      authAccountConfigurationData,
      authAccountConfigurationServerData,
    );
    const isAccountConfigurationDataModified = !jsUtils.isEqual(
      accountConfigurationData,
      accountConfigurationServerData,
    );

    // check if it supports array
    const isMfaConfigurationDataModified = !jsUtils.isEqual(
      mfaConfigurationData,
      mfaConfigurationServerData,
    );
    return {
      authAccountConfigurationData,
      accountConfigurationData,
      authAccountConfigurationServerData,
      accountConfigurationServerData,
      mfaConfigurationServerData,
      mfaConfigurationData,
      isAccountConfigurationDataModified,
      isAuthAccountConfigurationDataModified,
      isMfaConfigurationDataModified,
    };
  };
  const compareValuesAndEnableButton = (state) => {
    const {
      isAccountConfigurationDataModified,
      isAuthAccountConfigurationDataModified,
      isMfaConfigurationDataModified,
    } = compareStateAndServerData(state);
    const isModified =
      isAccountConfigurationDataModified ||
      isAuthAccountConfigurationDataModified ||
      isMfaConfigurationDataModified;
    return isModified;
  };
  const onChangeToggler = (id, value) => {
    const data = { [id]: !value };
    const { accountConfigurationDataChange, other_settings } = props;
    if (other_settings.is_mfa_enabled) setIsMfaDataChanged(value);
    const enable_button = compareValuesAndEnableButton({ ...props, ...data });
    accountConfigurationDataChange({
      ...data,
      enable_button,
      error_list: [],
      server_error: [],
    });
  };

  const onChangeHandler = (event) => {
    const data = { [event.target.id]: event.target.value };
    const { accountConfigurationDataChange, error_list } = props;
    let errorData = null;
    const clonedProps = cloneDeep(props);
    clonedProps[event.target.id] = event.target.value;
    if (!jsUtils.isEmpty(error_list)) {
      errorData = {
        error_list: {
          ...validate(
            getAccountConfigurationData(clonedProps),
            accountConfigurationValidationSchema(t),
          ),
          ...validate(
            getAuthAccountConfigurationData(clonedProps),
            authAccountConfigurationValidationSchema(t),
          ),
        },
      };
    }
    const enable_button = compareValuesAndEnableButton({ ...clonedProps });
    accountConfigurationDataChange({
      ...data,
      ...errorData,
      enable_button,
    });
  };

  const onCancelClicked = (event) => {
    event.preventDefault();
    const { other_settings, accountConfigurationDataChange } = props;

    accountConfigurationDataChange({
      ...getAccountConfigurationData(other_settings),
      ...getAuthAccountConfigurationData(other_settings),
      enable_button: false,
      error_list: [],
      server_error: [],
      ...getMfaConfigurationServerdata(other_settings),
    });
  };

  const onSaveClicked = (event, isSaveConfirm) => {
    event.preventDefault();
    const {
      accountConfigurationDataChange,
      updateAccountConfigurationDetailsApi,
      updateAuthAccountConfigurationDetailsApi,
      mfa_details,
      is_mfa_enabled,
      mfa_enforced_teams,
    } = props;
    const {
      authAccountConfigurationData,
      accountConfigurationData,
      isAccountConfigurationDataModified,
      isAuthAccountConfigurationDataModified,
      isMfaConfigurationDataModified,
    } = compareStateAndServerData(props);

    const authErrorList = validate(
      getAuthAccountConfigurationData(props),
      authAccountConfigurationValidationSchema(t),
    );
    const errorList = validate(
      getAccountConfigurationData(props),
      accountConfigurationValidationSchema(t),
    );
    const mfaErrorList = is_mfa_enabled ? validate(
      getMfaConfigurationData(props),
      mfaDetailsValidationSchema(t),
    ) : {};
    accountConfigurationDataChange({
      error_list: { ...authErrorList, ...errorList, ...mfaErrorList },
    });
    if (jsUtils.isEmpty(authErrorList) && jsUtils.isEmpty(errorList) && jsUtils.isEmpty(mfaErrorList)) {
      if (isMfaDataChanged && !isSaveConfirm) {
        setMfaConfirmationModal(true);
      } else {
      if (isAccountConfigurationDataModified) {
        updateAccountConfigurationDetailsApi(accountConfigurationData);
      }
      if (isAuthAccountConfigurationDataModified || isMfaConfigurationDataModified) {
        let mfaData = {};
        if (is_mfa_enabled) {
          mfaData = { mfa_details: { ...mfa_details, mfa_enforced_teams: mfa_enforced_teams.map((team) => (team._id)) } };
          setIsMfaDataChanged(false);
        }
        if (!authAccountConfigurationData.is_password_expiry_enabled) {
          // delete authAccountConfigurationData.password_expiry_days;
          authAccountConfigurationData.password_expiry_days = null;
        }
        if (!authAccountConfigurationData.is_remember_me_enabled) {
          authAccountConfigurationData.remember_me_days = null;
        }
        updateAuthAccountConfigurationDetailsApi({ ...authAccountConfigurationData, ...mfaData, is_mfa_enabled }, isMfaConfigurationDataModified);
      }
    }
  }
  };

  const onAddCurrencyHandler = async (event) => {
    // event.preventDefault();
    const { allowed_currency_types, accountConfigurationDataChange } = props;
    if (
      !jsUtils.isEmpty(event.target.value) &&
      !jsUtils.isEmpty(event.target.value.code) &&
      !allowed_currency_types.includes(event.target.value.code)
    ) {
      const allowedCurrencyType = {
        allowed_currency_types: [
          ...allowed_currency_types,
          event.target.value.code,
        ],
      };
      const enable_button = compareValuesAndEnableButton({
        ...props,
        ...allowedCurrencyType,
      });
      accountConfigurationDataChange({
        ...allowedCurrencyType,
        enable_button,
      });
    }
  };

  const onAddExtensionHandler = async (event) => {
    // event.preventDefault();
    const { allowed_extensions, accountConfigurationDataChange } = props;
    let allowedExtensions = { allowed_extensions };
    if (!jsUtils.isEmpty(jsUtils.get(event, ['target', 'value', 'display']))) {
      const extensions = jsUtils.union(
        allowed_extensions,
        event.target.value.file_extension,
      );
      if (allowed_extensions.length !== extensions.length) {
        allowedExtensions = {
          allowed_extensions: [...extensions],
        };
      }
    } else if (
      !jsUtils.isEmpty(
        jsUtils.get(event, ['target', 'value', 'file_extension']),
      ) &&
      !allowed_extensions.includes(event.target.value.file_extension)
    ) {
      allowedExtensions = {
        allowed_extensions: [
          ...allowed_extensions,
          event.target.value.file_extension,
        ],
      };
    }
    const enable_button = compareValuesAndEnableButton({
      ...props,
      ...allowedExtensions,
    });
    accountConfigurationDataChange({ ...allowedExtensions, enable_button });
  };

const onRemoveCurrencyHandler = (value) => {
    const {
      allowed_currency_types,
      default_currency_type,
      accountConfigurationDataChange,
    } = props;
    const updatedCurrencyList = allowed_currency_types.filter(
      (eachCurrency) => eachCurrency !== value,
    );
    let data = {
      allowed_currency_types: updatedCurrencyList,
      errorText: EMPTY_STRING,
    };
    if (default_currency_type === value) {
      data = { ...data, default_currency_type: EMPTY_STRING };
    }
    const enable_button = compareValuesAndEnableButton({
      ...props,
      ...data,
    });
    accountConfigurationDataChange({
      ...data,
      enable_button,
    });
  };

  const onRemoveExtensionHandler = (value) => {
    const { allowed_extensions, accountConfigurationDataChange } = props;
    const updatedExtensionList = allowed_extensions.filter(
      (eachCurrency) => eachCurrency !== value,
    );
    const data = {
      allowed_extensions: updatedExtensionList,
      errorText: EMPTY_STRING,
    };
    const enable_button = compareValuesAndEnableButton({ ...props, ...data });
    accountConfigurationDataChange({ ...data, enable_button });
  };

  const setCurrencySearchValue = (event) => {
    const data = {
      currency_search_value: event.target.value,
    };
    const { accountConfigurationDataChange } = props;
    accountConfigurationDataChange(data);
  };

  const setExtensionSearchValue = (event) => {
    const data = {
      extension_search_value: event.target.value,
    };
    const { accountConfigurationDataChange } = props;
    accountConfigurationDataChange(data);
  };
  const getFormattedCurrencyListDropDown = (response) => {
    let index;
    const data = [];
    for (index = 0; index < response.length; index += 1) {
      data.push({
        [DROPDOWN_CONSTANTS.OPTION_TEXT]: response[index],
        [DROPDOWN_CONSTANTS.VALUE]: response[index],
      });
    }
    return data;
  };

// Add member functions
const onTeamOrUserSelectHandler = async (event) => {
  const { value } = event.target;
  const { mfa_enforced_teams, accountConfigurationDataChange } = props;
  const mfaEnforcedTeams = [...mfa_enforced_teams, value];

  const data = {
    mfa_enforced_teams: mfaEnforcedTeams,
    errorText: EMPTY_STRING,
  };

   const enable_button = compareValuesAndEnableButton({
      ...props,
      ...data,
    });

  accountConfigurationDataChange({ mfa_enforced_teams: mfaEnforcedTeams, enable_button });
};

const onTeamOrUserRemoveHandler = (value) => {
  const { mfa_enforced_teams, accountConfigurationDataChange } = props;

  const mfaEnforcedTeams = mfa_enforced_teams.filter(
    (team) => team._id !== value,
  );
  const data = {
    mfa_enforced_teams: mfaEnforcedTeams,
    errorText: EMPTY_STRING,
  };
  const enable_button = compareValuesAndEnableButton({ ...props, ...data });

  accountConfigurationDataChange({ mfa_enforced_teams: mfaEnforcedTeams, enable_button });
};

// end add memeber function
  const {
    enable_button,
    session_timeout,
    mobile_session_timeout,
    remember_me_days,
    password_expiry_days,
    maximum_file_size,
    // common_server_error,
    is_remember_me_enabled,
    is_password_expiry_enabled,
    error_list,
    server_error,
    allowed_extensions,
    current_selected_extension,
    default_currency_type,
    // currency_list,
    extension_search_value,
    current_selected_currency,
    currency_search_value,
    allowed_currency_types,
    accountConfigurationDataChange,
    is_data_loading,
    is_auth_data_loading,
    default_country_code,
    is_mfa_enabled,
    mfa_details,
  } = props;
  const [countryCodeList] = useState(
    getCountryCodeDropdownList(),
  );
  // const onCountryCodeSearchHandler = (searchText) => {
  //   setCountryCodeList(getSearchedCountryCodeDropdownList(searchText));
  // };

  const isDataLoading = is_data_loading || is_auth_data_loading;
  const errors = mergeObjects(error_list, server_error);
  let save_and_cancel_buttons = null;
  if (enable_button) {
    save_and_cancel_buttons = (
      <Row className={cx(gClasses.MT20, gClasses.MB50, BS.JC_CENTER)}>
        <CustomCol size={SAVE_BUTTON_COL_SIZE}>
          <Button
            buttonType={BUTTON_TYPE.SECONDARY}
            onClick={onCancelClicked}
            className={BS.PADDING_0}
            width100
          >
            {t(OTHER_SETTINGS_FORM.CANCEL.LABEL)}
          </Button>
        </CustomCol>
        <CustomCol size={SAVE_BUTTON_COL_SIZE}>
          <Button
            buttonType={BUTTON_TYPE.PRIMARY}
            onClick={(event) => {
              onSaveClicked(event, false);
            }}
            className={BS.PADDING_0}
            width100
          >
            {t(OTHER_SETTINGS_FORM.SAVE.LABEL)}
          </Button>
        </CustomCol>
      </Row>
    );
  }

  const handleAllowedMfaMethodsCheckBox = (value) => {
    let allowed_methods = [];
    const { other_settings } = props;
    const isExists = mfa_details?.allowed_mfa_methods.includes(value);
    const default_mfa_method = other_settings?.mfa_details?.allowed_mfa_methods.includes(value);
    if (default_mfa_method) setIsMfaDataChanged(isExists);
    if (isExists) {
      allowed_methods = mfa_details?.allowed_mfa_methods.filter((method) => method !== value);
    } else {
      allowed_methods = [...mfa_details.allowed_mfa_methods, value];
    }
    const enable_button = compareValuesAndEnableButton({ ...props, mfa_details: { ...mfa_details, allowed_mfa_methods: allowed_methods } });
    accountConfigurationDataChange({ mfa_details: { ...mfa_details, allowed_mfa_methods: allowed_methods }, enable_button });
  };

  const mfaComponent = (
    <>
      <FormTitle fontFamilyStyle={styles.OtherSettingsFontStyle} isDataLoading={isDataLoading}>
        {t(OTHER_SETTINGS_FORM.MFA_SETTINGS.TITLE)}
      </FormTitle>
      <div>
        <Text
          content={t(OTHER_SETTINGS_FORM.MFA_SETTINGS.DESCRIPTION)}
          size={ETextSize.SM}
          isLoading={isDataLoading}
        />
      </div>

      <div className={cx(BS.D_FLEX, BS.JC_START)}>
        <Text
          content={t(OTHER_SETTINGS_FORM.MFA_SETTINGS.ENABLE_MFA_TO_USERS)}
          size={ETextSize.MD}
          className={cx(gClasses.MT16, gClasses.FontWeight500, styles.MFALabel)}
          isLoading={isDataLoading}
        />
        <CheckboxGroup
          id={OTHER_SETTINGS_FORM.MFA_CHECKBOX_ID}
          className={gClasses.MT17}
          optionList={OTHER_SETTINGS_FORM.ENABLE_MFA_TO_USER_CB}
          onClick={() => {
            onChangeToggler(
              OTHER_SETTINGS_FORM.MFA_CHECKBOX_ID,
              is_mfa_enabled,
            );
          }}
          selectedValues={is_mfa_enabled ? [1] : []}
          hideLabel
          isSlider
          hideOptionLabel
          isDataLoading={isDataLoading}
          sliderAriaLabel={t(OTHER_SETTINGS_FORM.PASSWORD_AGE.LABEL)}
        />
      </div>
      <div className={cx(gClasses.MT6)}>
        <Text
          isLoading={isDataLoading}
          content={is_mfa_enabled ? t(OTHER_SETTINGS_FORM.MFA_SETTINGS.ENABLED_TEXT) : t(OTHER_SETTINGS_FORM.MFA_SETTINGS.DISABLED_TEXT)}
          size={ETextSize.XS}
          className={styles.MfaEnabledDisaledText}
        />
      </div>

      {is_mfa_enabled &&
      <>
      <div>
        <Text
          content={t(OTHER_SETTINGS_FORM.MFA_SETTINGS.ALLOWED_MFA_METHODS)}
          size={ETextSize.MD}
          className={cx(gClasses.MT16, gClasses.MB5, gClasses.FontWeight500)}
          isLoading={isDataLoading}
        />
      </div>
      <CheckboxGroupFromLib
        errorMessage={errors?.allowed_mfa_methods}
        layout=""
        className={cx(styles.MfaCheckbox, gClasses.MB16)}
        checkboxViewLabelClassName={cx(styles.MfaCheckbox)}
        options={[
          {
            description: '',
            disabled: false,
            label: t(OTHER_SETTINGS_FORM.MFA_SETTINGS.TOTP_USING_AUTHENTICATOR_APP),
            selected: mfa_details?.allowed_mfa_methods.includes(1),
            value: 1,
          },
          {
            description: '',
            disabled: false,
            label: t(OTHER_SETTINGS_FORM.MFA_SETTINGS.EMAIL_OTP),
            selected: mfa_details?.allowed_mfa_methods.includes(2),
            value: 2,
          },
        ]}
        size="sm"
        onClick={handleAllowedMfaMethodsCheckBox}
        isLoading={isDataLoading}
      />

      <div className={cx(styles.ContainerSize)}>
      <AddMembers
        label={t(OTHER_SETTINGS_FORM.MFA_SETTINGS.SELECT_TEAMS_TEXT)}
        id={OTHER_SETTINGS_FORM.MFA_SETTINGS.ADD_TEAM_ID}
        onUserSelectHandler={(e) => onTeamOrUserSelectHandler(e)}
        selectedData={mfa_enforced_teams}
        removeSelectedUser={onTeamOrUserRemoveHandler}
        memberSearchValue={searchText}
        setMemberSearchValue={(e) => setSearchText(e.target.value)}
        placeholder={t(OTHER_SETTINGS_FORM.MFA_SETTINGS.ADD_TEAM_PLACEHOLDER)}
        getTeams
        isActive
        customClass={styles.AssignTo}
        apiParams={!isNormalMode && NON_PRIVATE_TEAMS_PARAMS}
        isDataLoading={isDataLoading}
      />
      </div>

      </>
      }

    </>
  );
  return (
    <div>
    <Row className={cx(styles.OtherSettingsContainer)}>
      <CustomCol size={CUSTOM_LAYOUT_COL} className={gClasses.P0}>
        <FormTitle fontFamilyStyle={styles.OtherSettingsFontStyle} isDataLoading={isDataLoading}>
          {t(OTHER_SETTINGS_FORM.SESSION_TIMEOUT.TITLE)}
        </FormTitle>
        <FormPostOperationFeedback id="other_settings" />
          <Row>
            <Col xl={6} lg={6} md={12} xs={12}>
              <div className={cx(BS.D_FLEX, gClasses.WidthInherit)}>
                <Input
                  id={OTHER_SETTINGS_FORM.SESSION_TIMEOUT.ID}
                  label={t(OTHER_SETTINGS_FORM.SESSION_TIMEOUT.LABEL)}
                  placeholder={t(OTHER_SETTINGS_FORM.SESSION_TIMEOUT.PLACEHOLDER)}
                  onChangeHandler={onChangeHandler}
                  value={session_timeout}
                  type="number"
                  errorMessage={errors[OTHER_SETTINGS_FORM.SESSION_TIMEOUT.ID]}
                  isDataLoading={isDataLoading}
                  className={cx(gClasses.WidthInherit, styles.Input)}
                  labelClassAdmin={cx(styles.OtherSettingslabelClass)}
                  inputContainerClasses={styles.OtherSettingsInputContainer}
                  readOnlySuffix={(
                    <div
                      className={cx(
                        gClasses.ML10,
                        gClasses.FOne13GrayV14,
                        gClasses.CenterV,
                      )}
                    >
                      {t(OTHER_SETTINGS_FORM.SESSION_TIMEOUT.SUFFIX)}
                    </div>
                  )}
                />
              </div>
            </Col>
          </Row>

          <FormTitle fontFamilyStyle={styles.OtherSettingsFontStyle} isDataLoading={isDataLoading}>
            {t(OTHER_SETTINGS_FORM.MOBILE_APP_SESSION_TIMEOUT.TITLE)}
          </FormTitle>
          <div className={cx(BS.D_FLEX, gClasses.WidthInherit)}>
            <Input
              id={OTHER_SETTINGS_FORM.MOBILE_APP_SESSION_TIMEOUT.ID}
              label={t(OTHER_SETTINGS_FORM.MOBILE_APP_SESSION_TIMEOUT.LABEL)}
              placeholder={t(OTHER_SETTINGS_FORM.MOBILE_APP_SESSION_TIMEOUT.PLACEHOLDER)}
              onChangeHandler={onChangeHandler}
              value={mobile_session_timeout}
              type="number"
              errorMessage={errors[OTHER_SETTINGS_FORM.MOBILE_APP_SESSION_TIMEOUT.ID]}
              isDataLoading={isDataLoading}
              className={cx(gClasses.WidthInherit, styles.Input)}
              labelClassAdmin={cx(styles.OtherSettingslabelClass)}
              inputContainerClasses={styles.OtherSettingsInputContainer}
              readOnlySuffix={(
                <div
                  className={cx(
                    gClasses.ML10,
                    gClasses.FOne13GrayV14,
                    gClasses.CenterV,
                  )}
                >
                  {t(OTHER_SETTINGS_FORM.MOBILE_APP_SESSION_TIMEOUT.SUFFIX)}
                </div>
              )}
            />
          </div>

          <FormTitle fontFamilyStyle={styles.OtherSettingsFontStyle} isDataLoading={isDataLoading}>
            {t(OTHER_SETTINGS_FORM.USER_AUTHENTICATION_POLICIES.TITLE)}
          </FormTitle>

          <Row>
            <Col xl={12} lg={12} md={12} xs={12}>
              <div className={cx(BS.D_FLEX, BS.D_FLEX_WRAP_WRAP, gClasses.WidthInherit)}>
                <Label
                  id={`${OTHER_SETTINGS_FORM.STAY_LOGGED_IN.ID}_label`}
                  labelFor={`checkbox-group-${OTHER_SETTINGS_FORM.STAY_LOGGED_IN.CHECKBOX_ID}`}
                  isDataLoading={isDataLoading}
                  content={t(OTHER_SETTINGS_FORM.STAY_LOGGED_IN.LABEL)}
                  LabelStylesOtherSettings={cx(styles.LabelStylesOtherSettings)}
                  hideLabelClass
                />
                <CheckboxGroup
                  id={OTHER_SETTINGS_FORM.STAY_LOGGED_IN.CHECKBOX_ID}
                  className={gClasses.MT7}
                  optionList={OTHER_SETTINGS_FORM.STAY_LOGGED_IN_CB}
                  onClick={() => {
                    onChangeToggler(
                      OTHER_SETTINGS_FORM.STAY_LOGGED_IN.CHECKBOX_ID,
                      is_remember_me_enabled,
                    );
                  }}
                  selectedValues={is_remember_me_enabled ? [1] : []}
                  hideLabel
                  isSlider
                  hideOptionLabel
                  isDataLoading={isDataLoading}
                  sliderAriaLabel={t(OTHER_SETTINGS_FORM.STAY_LOGGED_IN.LABEL)}
                />
                <Input
                  id={OTHER_SETTINGS_FORM.STAY_LOGGED_IN.ID}
                  onChangeHandler={onChangeHandler}
                  hideLabel
                  placeholder={t(OTHER_SETTINGS_FORM.STAY_LOGGED_IN.PLACEHOLDER)}
                  value={remember_me_days}
                  readOnly={!is_remember_me_enabled}
                  type="number"
                  errorMessage={errors[OTHER_SETTINGS_FORM.STAY_LOGGED_IN.ID]}
                  inputContainerClasses={styles.OtherSettingsInputContainer}
                  isDataLoading={isDataLoading}
                  className={cx(gClasses.WidthInherit, styles.Input)}
                  readOnlySuffix={(
                    <div
                      className={cx(
                        gClasses.ML10,
                        gClasses.FOne13GrayV14,
                        gClasses.CenterV,
                      )}
                      id={`${OTHER_SETTINGS_FORM.STAY_LOGGED_IN.ID}_label`}
                      aria-label="Enter days for remember me"
                    >
                      {t(OTHER_SETTINGS_FORM.STAY_LOGGED_IN.SUFFIX)}
                    </div>
                  )}
                />
              </div>
            </Col>
          </Row>
        <Row>
          <div className={cx(BS.D_FLEX)}>
            <Col xl={12} lg={12} md={12} xs={12} className={cx(BS.D_FLEX)}>
              <Label
                id={`${OTHER_SETTINGS_FORM.PASSWORD_AGE.ID}_label`}
                labelFor={`checkbox-group-${OTHER_SETTINGS_FORM.PASSWORD_AGE.CHECKBOX_ID}`}
                isDataLoading={isDataLoading}
                content={t(OTHER_SETTINGS_FORM.PASSWORD_AGE.LABEL)}
                LabelStylesOtherSettings={cx(styles.LabelStylesOtherSettings)}
                hideLabelClass
              />
              <div className={cx(BS.D_FLEX, gClasses.WidthInherit)}>
                <CheckboxGroup
                  id={OTHER_SETTINGS_FORM.PASSWORD_AGE.CHECKBOX_ID}
                  className={gClasses.MT7}
                  optionList={OTHER_SETTINGS_FORM.PASSWORD_AGE_CB}
                  onClick={() => {
                    onChangeToggler(
                      OTHER_SETTINGS_FORM.PASSWORD_AGE.CHECKBOX_ID,
                      is_password_expiry_enabled,
                    );
                  }}
                  selectedValues={is_password_expiry_enabled ? [1] : []}
                  hideLabel
                  isSlider
                  hideOptionLabel
                  isDataLoading={isDataLoading}
                  sliderAriaLabel={t(OTHER_SETTINGS_FORM.PASSWORD_AGE.LABEL)}
                />
                <Input
                  id={OTHER_SETTINGS_FORM.PASSWORD_AGE.ID}
                  onChangeHandler={onChangeHandler}
                  hideLabel
                  placeholder={t(OTHER_SETTINGS_FORM.PASSWORD_AGE.PLACEHOLDER)}
                  value={password_expiry_days}
                  readOnly={!is_password_expiry_enabled}
                  type="number"
                  errorMessage={errors[OTHER_SETTINGS_FORM.PASSWORD_AGE.ID]}
                  inputContainerClasses={styles.OtherSettingsInputContainer}
                  isDataLoading={isDataLoading}
                  className={cx(gClasses.WidthInherit, styles.Input)}
                  readOnlySuffix={(
                    <div
                      className={cx(
                        gClasses.ML10,
                        gClasses.FOne13GrayV14,
                        gClasses.CenterV,
                      )}
                      id={`${OTHER_SETTINGS_FORM.PASSWORD_AGE.ID}_label`}
                      aria-label="Enter days for password age"
                    >
                      {t(OTHER_SETTINGS_FORM.PASSWORD_AGE.SUFFIX)}
                    </div>
                  )}
                />
              </div>
            </Col>
          </div>
        </Row>
        {mfaComponent}
        <FormTitle fontFamilyStyle={styles.OtherSettingsFontStyle} isDataLoading={isDataLoading}>
          {t(OTHER_SETTINGS_FORM.DOCUMENT_SETTINGS.LABEL)}
        </FormTitle>
        <Row>
          <Col xl={6} lg={6} md={12} xs={12}>
            <div className={cx(BS.D_FLEX, gClasses.WidthInherit)}>
              <Input
                id={OTHER_SETTINGS_FORM.MAXIMUM_FILE_SIZE.ID}
                label={t(OTHER_SETTINGS_FORM.MAXIMUM_FILE_SIZE.LABEL)}
                placeholder={t(OTHER_SETTINGS_FORM.MAXIMUM_FILE_SIZE.PLACEHOLDER)}
                value={maximum_file_size}
                onChangeHandler={onChangeHandler}
                type="number"
                errorMessage={errors[OTHER_SETTINGS_FORM.MAXIMUM_FILE_SIZE.ID]}
                isDataLoading={isDataLoading}
                className={cx(gClasses.WidthInherit, styles.Input)}
                labelClassAdmin={cx(styles.OtherSettingslabelClass)}
                inputContainerClasses={styles.OtherSettingsInputContainer}
                readOnlySuffix={(
                  <div
                    className={cx(
                      gClasses.ML10,
                      gClasses.FOne13GrayV14,
                      gClasses.CenterV,
                      styles.ExtensionLabel,
                    )}
                  >
                    {t(OTHER_SETTINGS_FORM.MAXIMUM_FILE_SIZE.SUFFIX)}
                  </div>
                )}
              />
            </div>
          </Col>
        </Row>
        {/* <Row>
            <Col xl={6} lg={6} md={12} xs={12}>
              <div className={cx(BS.D_FLEX, gClasses.WidthInherit)}>
                <Input
                  id={OTHER_SETTINGS_FORM.DOCUMENT_EXPIRY_TIME.ID}
                  label={OTHER_SETTINGS_FORM.DOCUMENT_EXPIRY_TIME.LABEL}
                  placeholder={OTHER_SETTINGS_FORM.DOCUMENT_EXPIRY_TIME.PLACEHOLDER}
                  value={doc_expiry_time}
                  onChangeHandler={onChangeHandler}
                  type="number"
                  errorMessage={errors[OTHER_SETTINGS_FORM.DOCUMENT_EXPIRY_TIME.ID]}
                  isDataLoading={isDataLoading}
                  className={cx(gClasses.WidthInherit, styles.Input)}
                  readOnlySuffix={
                    <div className={cx(gClasses.ML10, gClasses.FOne13GrayV14, gClasses.CenterV, styles.ExtensionLabel)}>
                      {OTHER_SETTINGS_FORM.DOCUMENT_EXPIRY_TIME.SUFFIX}
                    </div>
                  }
                />
              </div>
            </Col>
          </Row> */}
        <Row
          onBlur={() => {
            accountConfigurationDataChange({
              extension_search_value: EMPTY_STRING,
            });
          }}
        >
          <Col xl={6} lg={6} md={12} xs={12}>
            <AddMembers
              id={OTHER_SETTINGS_FORM.ALLOWED_EXTENSIONS.ID}
              onUserSelectHandler={onAddExtensionHandler}
              placeholder={t(OTHER_SETTINGS_FORM.ALLOWED_EXTENSIONS.PLACEHOLDER)}
              selectedData={allowed_extensions}
              removeSelectedUser={onRemoveExtensionHandler}
              // errorText={create_team_state.errorText}
              selectedSuggestionData={current_selected_extension}
              memberSearchValue={extension_search_value}
              setMemberSearchValue={setExtensionSearchValue}
              label={t(OTHER_SETTINGS_FORM.ALLOWED_EXTENSIONS.LABEL)}
              labelClassAdmin={cx(styles.OtherSettingslabelClass)}
              getAllFileExtensions
              hideUserIcon
              isDataLoading={isDataLoading}
              errorText={errors.allowed_extensions}
              containerSize={styles.ContainerSize}
            />
          </Col>
        </Row>
        <FormTitle fontFamilyStyle={styles.OtherSettingsFontStyle} isDataLoading={isDataLoading}>
          {t(OTHER_SETTINGS_FORM.CURRENCY_SETTINGS.LABEL)}
        </FormTitle>
        <Row
          onBlur={() => {
            accountConfigurationDataChange({
              currency_search_value: EMPTY_STRING,
            });
          }}
        >
          <Col xl={6} lg={6} md={12} xs={12}>
            <AddMembers
              id={OTHER_SETTINGS_FORM.ALLOWED_CURRENCY_TYPES.ID}
              onUserSelectHandler={onAddCurrencyHandler}
              placeholder={
                t(OTHER_SETTINGS_FORM.ALLOWED_CURRENCY_TYPES.PLACEHOLDER)
              }
              selectedData={allowed_currency_types}
              removeSelectedUser={onRemoveCurrencyHandler}
              // errorText={create_team_state.errorText}
              selectedSuggestionData={current_selected_currency}
              memberSearchValue={currency_search_value}
              setMemberSearchValue={setCurrencySearchValue}
              label={t(OTHER_SETTINGS_FORM.ALLOWED_CURRENCY_TYPES.LABEL)}
              labelClassAdmin={cx(styles.OtherSettingslabelClass)}
              containerSize={styles.ContainerSize}
              getAllCurrencyTypes
              hideUserIcon
              isDataLoading={isDataLoading}
              errorText={errors.allowed_currency_types}
            />
          </Col>
        </Row>
        <Row>
          <Col xl={3} lg={6} md={12} xs={12}>
            <Dropdown
              id={OTHER_SETTINGS_FORM.DEFAULT_CURRENCY.ID}
              optionList={getFormattedCurrencyListDropDown(
                allowed_currency_types,
              )}
              label={t(OTHER_SETTINGS_FORM.DEFAULT_CURRENCY.LABEL)}
              labelClassAdmin={cx(styles.OtherSettingslabelClass)}
              // inputDropdownContainer={styles.OtherSettingsInputContainer}
              onChange={onChangeHandler}
              placeholder={t(OTHER_SETTINGS_FORM.DEFAULT_CURRENCY.PLACEHOLDER)}
              selectedValue={default_currency_type}
              // loadData={loadDropdownData}
              // errorMessage={errors[L_C_FORM.L_DROPDOWN.ID]}
              isDataLoading={isDataLoading}
              showNoDataFoundOption
              noDataFoundOptionLabel={
                OTHER_SETTINGS_FORM.ALLOWED_CURRENCY_TYPES.NO_DATA_FOUND_LABEL
              }
              errorMessage={errors.default_currency_type}
            />
          </Col>
        </Row>
        <FormTitle fontFamilyStyle={styles.OtherSettingsFontStyle} isDataLoading={isDataLoading}>
          {t(OTHER_SETTINGS_FORM.PHONE_NUMBER_SETTINGS.LABEL)}
        </FormTitle>
        <Row>
          <Col xl={3} lg={6} md={12} xs={12}>
            <Dropdown
              id={OTHER_SETTINGS_FORM.DEFAULT_COUNTRY_CODE_SETTING.ID}
              label={t(OTHER_SETTINGS_FORM.DEFAULT_COUNTRY_CODE_SETTING.LABEL)}
              labelClassAdmin={cx(styles.OtherSettingslabelClass)}
              // inputDropdownContainer={styles.OtherSettingsInputContainer}
              placeholder={
                t(OTHER_SETTINGS_FORM.DEFAULT_COUNTRY_CODE_SETTING.PLACEHOLDER)
              }
              selectedValue={default_country_code}
              optionList={countryCodeList}
              // onSearchInputChange={onCountryCodeSearchHandler}
              onChange={onChangeHandler}
              // enableSearch
              isCountryCodeList
              // loadData={getSearchedCountryCodeDropdownList(default_country_code)}
              isDataLoading={isDataLoading}
              errorMessage={errors.default_country_code}
              setSelectedValue
            />
          </Col>
        </Row>
        <FormTitle fontFamilyStyle={styles.OtherSettingsFontStyle} isDataLoading={isDataLoading}>
          {t(OTHER_SETTINGS_FORM.WEBPAGE_EMBED_SETTING.LABEL)}
        </FormTitle>
        <WebpageEmbedSettings />
        {save_and_cancel_buttons}
      </CustomCol>
    </Row>
    <DeleteConfirmModal
        isModalOpen={mfaConfirmationModal}
        content={t(OTHER_SETTINGS_FORM.MFA_SETTINGS.MFA_CONFIRMATION_MODAL.MAIN_CONTENT)}
        firstLine={t(OTHER_SETTINGS_FORM.MFA_SETTINGS.MFA_CONFIRMATION_MODAL.FIRST_LIST)}
        secondLine={t(OTHER_SETTINGS_FORM.MFA_SETTINGS.MFA_CONFIRMATION_MODAL.SECOND_LINE)}
        cancelButton={t(OTHER_SETTINGS_FORM.MFA_SETTINGS.MFA_CONFIRMATION_MODAL.CANCEL_BUTTON)}
        DeleteButton={t(OTHER_SETTINGS_FORM.MFA_SETTINGS.MFA_CONFIRMATION_MODAL.DELETE_BUTTON)}
        onDelete={(event) => {
          onSaveClicked(event, true);
          setMfaConfirmationModal(false);
        }}
        onCloseModal={(event) => {
          onCancelClicked(event);
          setMfaConfirmationModal(false);
        }}
        isMfaConfirmationModal
    />
    </div>
  );
}

OtherSettings.propTypes = {
  enable_button: PropTypes.bool.isRequired,
  session_timeout: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
    .isRequired,
  remember_me_days: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  password_expiry_days: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]),
  maximum_file_size: PropTypes.number.isRequired,
  doc_expiry_time: PropTypes.number.isRequired,
  is_remember_me_enabled: PropTypes.bool.isRequired,
  is_password_expiry_enabled: PropTypes.bool.isRequired,
  error_list: PropTypes.arrayOf(PropTypes.any).isRequired,
  server_error: PropTypes.arrayOf(PropTypes.any).isRequired,
  default_currency_type: PropTypes.string.isRequired,
  allowed_currency_types: PropTypes.arrayOf(PropTypes.any).isRequired,
  currency_search_value: PropTypes.string.isRequired,
  allowed_extensions: PropTypes.arrayOf(PropTypes.any).isRequired,
  extension_search_value: PropTypes.string.isRequired,

  accountConfigurationDataChange: PropTypes.func.isRequired,
  other_settings: PropTypes.objectOf(PropTypes.any).isRequired,
  dispatch: PropTypes.func.isRequired,
  is_mfa_enabled: PropTypes.bool.isRequired,
};
OtherSettings.defaultProps = {
  remember_me_days: null,
  password_expiry_days: null,
};
const mapStateToProps = (state) => {
  const {
    enable_button,
    session_timeout,
    mobile_session_timeout, // days
    remember_me_days,
    password_expiry_days,
    maximum_file_size,
    doc_expiry_time,
    is_remember_me_enabled,
    is_password_expiry_enabled,
    error_list,
    server_error,
    common_server_error,
    default_currency_type,
    allowed_currency_types,
    currency_search_value,
    allowed_extensions,
    extension_search_value,
    other_settings,
    current_selected_extension,
    // currency_list,
    current_selected_currency,
    is_data_loading,
    is_auth_data_loading,
    default_country_code,
    is_mfa_enabled,
    mfa_details,
    mfa_enforced_teams,
  } = state.AccountConfigurationAdminReducer;
  const {
    usersAndTeamsData,
    activeAppData,
  } = state.ApplicationReducer;
  return {
    enable_button,
    session_timeout,
    mobile_session_timeout,
    remember_me_days,
    password_expiry_days,
    maximum_file_size,
    doc_expiry_time,
    is_remember_me_enabled,
    is_password_expiry_enabled,
    error_list,
    server_error,
    common_server_error,
    default_currency_type,
    allowed_currency_types,
    currency_search_value,
    allowed_extensions,
    extension_search_value,
    other_settings,
    current_selected_extension,
    // currency_list,
    current_selected_currency,
    is_data_loading,
    is_auth_data_loading,
    default_country_code,
    is_mfa_enabled,
    usersAndTeamsData,
    activeAppData,
    mfa_details,
    mfa_enforced_teams,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getAccountConfigurationDetailsApi: (value) => {
      dispatch(getAccountConfigurationDetailsApiAction(value));
    },
    getAuthAccountConfigurationDetailsApi: (value) => {
      dispatch(getAuthAccountConfigurationDetailsApiAction(value));
    },
    updateAccountConfigurationDetailsApi: (value) => {
      dispatch(updateAccountConfigurationDetailsApiAction(value));
    },
    updateAuthAccountConfigurationDetailsApi: (value, isMfaDataConfigured) => {
      dispatch(updateAuthAccountConfigurationDetailsApiAction(value, isMfaDataConfigured));
    },
    accountConfigurationDataChange: (value) => {
      dispatch(accountConfigurationDataChangeAction(value));
    },
    getUsersApi: (props, setCancelToken) => {
      dispatch(getUsersApiThunk(props, setCancelToken));
    },
    userPickerDataChange: (props) => {
      dispatch(applicationDataChange(props));
    },
    dispatch,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(OtherSettings);
