import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames/bind';
import { Row, Col } from 'reactstrap';
import { connect } from 'react-redux';
import { isEmpty, cloneDeep, pick } from 'lodash';

import { withRouter } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import { Button, EButtonType, SingleDropdown } from '@workhall-pvt-lmt/wh-ui-library';
import Alert from '../../../components/form_components/alert/Alert';

import gClasses from '../../../scss/Typography.module.scss';
import { LTZ_STRINGS } from './LanguageTimeZoneSettings.strings';
import {
  REQUIRED_TEXT,
  EMPTY_STRING,
  COMMA,
} from '../../../utils/strings/CommonStrings';
import {
  compareObjects,
  isBasicUserMode,
} from '../../../utils/UtilityFunctions';
import { store } from '../../../Store';
import { ROLES } from '../../../utils/Constants';
import {
  getUserPreferenceDataThunk,
  clearUserPreferenceDataAction,
  userPreferenceDataChangeAction,
  updateUserPreferenceDataThunk,
} from '../../../redux/actions/UserPreference.Action';
import {
  getLanguageLookupDataThunk,
  clearLanguageLookUpDataAction,
} from '../../../redux/actions/LanguageLookUp.Action';
import {
  getTimeZoneLookUpDataThunk,
  clearTimeZoneLookUpDataAction,
} from '../../../redux/actions/TimeZoneLookUp.Action';
import {
  getLocaleLookUpDataThunk,
  clearLocaleLookUpDataAction,
} from '../../../redux/actions/LocaleLookUp.Action';
import { BS } from '../../../utils/UIConstants';
import ReadOnlyText from '../../../components/form_components/read_only_text/ReadOnlyText';
import jsUtils from '../../../utils/jsUtility';
import styles from './LanguageTimeZoneSettings.module.scss';
import ThemeContext from '../../../hoc/ThemeContext';
import { BASIC_FORM_FIELD_CONFIG_STRINGS } from '../../form/sections/field_configuration/basic_configuration/BasicConfiguration.strings';

let cancelForGetPreferenceDetails;

export const getCancelTokenForPreferenceDetails = (cancelToken) => {
  cancelForGetPreferenceDetails = cancelToken;
};

class LanguageTimeZoneSettings extends Component {
  constructor(props) {
    super(props);
    this.state = {
     search: EMPTY_STRING,
    };
  }

  componentDidMount() {
    const { getUserPreferenceData } = this.props;
    getUserPreferenceData(getCancelTokenForPreferenceDetails);
    this.getLookupForSelectedDropDown(LTZ_STRINGS.LOCALE_DROPDOWN.ID, true);
  }

  componentWillUnmount() {
    const {
      clearUserPreferenceData,
      clearLanguageLookUpData,
      clearTimeZoneLookUpData,
      clearLocaleLookUpData,
    } = this.props;
    clearUserPreferenceData();
    clearLanguageLookUpData();
    clearTimeZoneLookUpData();
    clearLocaleLookUpData();
    if (
      cancelForGetPreferenceDetails &&
      cancelForGetPreferenceDetails.cancelToken
    ) {
      cancelForGetPreferenceDetails.cancelToken();
    }
  }

  render() {
    const {
      // languages_list,
      locale_list,
      timezone_list,
      pref_language,
      pref_locale,
      pref_timezone,
      enable_button,
      error_list,
      allow_update_timezone,
      allow_update_language_locale,
      isDataLoading,
      t,
      history,
    } = this.props;
    const { search } = this.state;
    const { colorScheme, colorSchemeDefault } = this.context;
    const isNormalMode = isBasicUserMode(history);
    let save_and_cancel_buttons = null;
    if (enable_button) {
      save_and_cancel_buttons = (
        <Row className={cx(gClasses.MT20, BS.JC_CENTER)}>
          <Button
            id={LTZ_STRINGS.CANCEL_BUTTON.ID}
            type={EButtonType.SECONDARY}
            onClick={this.onCancelClicked}
            className={cx(styles.PrimaryButtonClass)}
            width100
            buttonText={t(LTZ_STRINGS.CANCEL_BUTTON.LABEL)}
            colorSchema={isNormalMode ? colorScheme : colorSchemeDefault}
          />

          <Button
            id={LTZ_STRINGS.SAVE_BUTTON.ID}
            type={EButtonType.PRIMARY}
            onClick={this.onSaveClicked}
            className={cx(styles.SecondaryButtonClass)}
            width100
            buttonText={t(LTZ_STRINGS.SAVE_BUTTON.LABEL)}
            colorSchema={isNormalMode ? colorScheme : colorSchemeDefault}
          />
        </Row>
      );
    }
    const alertContentPrefix = t(LTZ_STRINGS.ALERT_CONTENT);
    let languageLocalAlertContent = EMPTY_STRING;
    let timeZoneAlertContent = EMPTY_STRING;
    let localeComponent = null;
    let timeZoneComponent = null;
    if (!allow_update_language_locale) {
      localeComponent = (
        <ReadOnlyText
          id={LTZ_STRINGS.LOCALE_DROPDOWN.ID}
          label={t(LTZ_STRINGS.LOCALE_DROPDOWN.LABEL)}
          value={`${pref_language} ${pref_locale}`}
          isLoading={isDataLoading}
        />
      );
      languageLocalAlertContent = t(LTZ_STRINGS.LANGUAGE_LOCALE);
    } else {
      this.getLookupForSelectedDropDown(LTZ_STRINGS.LOCALE_DROPDOWN.ID);
      localeComponent = (
        <SingleDropdown
        id={LTZ_STRINGS.LOCALE_DROPDOWN.ID}
        placeholder={t(LTZ_STRINGS.LOCALE_DROPDOWN.PLACEHOLDER)}
        optionList={locale_list}
        selectedValue={pref_locale}
        dropdownViewProps={{
          labelName: t(LTZ_STRINGS.LOCALE_DROPDOWN.LABEL),
          labelClassName: styles.TitleClass,
          selectedLabel: locale_list?.label,
          colorScheme: isNormalMode ? colorScheme : colorSchemeDefault,
        }}
        onClick={(value, _label, _list, id) => this.onChangeHandler({ target: { id, value, _label, _list } })}
        isLoadingOptions={isDataLoading}
        errorMessage={error_list[LTZ_STRINGS.LOCALE_DROPDOWN.ID]}
        colorScheme={isNormalMode ? colorScheme : colorSchemeDefault}
        searchProps={{
          searchPlaceholder: BASIC_FORM_FIELD_CONFIG_STRINGS(t).FIELD_TYPE.SEARCH_FIELD_TYPE,
          searchValue: search,
          onChangeSearch: (event) => this.setState({ search: event?.target?.value }),
          removeSearchIcon: false,
        }}
        />
      );
    }

    if (!allow_update_timezone) {
      timeZoneComponent = (
        <ReadOnlyText
          id={LTZ_STRINGS.TZ_DROPDOWN.ID}
          label={t(LTZ_STRINGS.TZ_DROPDOWN.LABEL)}
          value={pref_timezone}
          isLoading={isDataLoading}
        />
      );
      timeZoneAlertContent = t(LTZ_STRINGS.TIME_ZONE);
    } else {
      this.getLookupForSelectedDropDown(LTZ_STRINGS.TZ_DROPDOWN.ID);
      timeZoneComponent = (
        <SingleDropdown
        id={LTZ_STRINGS.TZ_DROPDOWN.ID}
        placeholder={t(LTZ_STRINGS.TZ_DROPDOWN.PLACEHOLDER)}
        optionList={timezone_list}
        selectedValue={pref_timezone}
        dropdownViewProps={{
          labelName: t(LTZ_STRINGS.TZ_DROPDOWN.LABEL),
          labelClassName: styles.TitleClass,
          selectedLabel: timezone_list?.label,
          colorScheme: isNormalMode ? colorScheme : colorSchemeDefault,
        }}
        onClick={(value, _label, _list, id) => this.onChangeHandler({ target: { id, value } })}
        isLoadingOptions={isDataLoading}
        colorScheme={isNormalMode ? colorScheme : colorSchemeDefault}
        searchProps={{
          searchPlaceholder: BASIC_FORM_FIELD_CONFIG_STRINGS(t).FIELD_TYPE.SEARCH_FIELD_TYPE,
          searchValue: search,
          onChangeSearch: (event) => this.setState({ search: event?.target?.value }),
          removeSearchIcon: true,
        }}
        />
      );
    }
    let alertContent = null;
    if (!allow_update_language_locale || !allow_update_timezone) {
      alertContent = `${alertContentPrefix} ${timeZoneAlertContent} ${
        allow_update_language_locale && allow_update_timezone
          ? COMMA
          : EMPTY_STRING
      } ${languageLocalAlertContent}`;
    }
    return (
      <>
        {!isDataLoading && (
          <Alert
            content={alertContent}
            className={cx(gClasses.MB20, BS.BORDER_0)}
          />
        )}
        <Row>
          {/* <Col sm={12} lg={6}>
            {languageComponent}
          </Col> */}
          <Col sm={12} lg={6}>
            {localeComponent}
          </Col>
          <Col sm={12} lg={6}>
            {timeZoneComponent}
          </Col>
        </Row>
        {/* <Row>

        </Row> */}

        {save_and_cancel_buttons}
      </>
    );
  }

  onChangeHandler = async (event) => {
    const { pref_language, userPreferenceDataChange } = this.props;
    let data = null;
    let selectedLanguage = {};
    if (
      event.target.id === LTZ_STRINGS.L_DROPDOWN.ID &&
      event.target.value !== pref_language
    ) {
      selectedLanguage = event?.target?._list.find((language) => language?.value === event.target.value);
      data = {
        pref_locale: EMPTY_STRING,
        is_language_changed: true,
      };
    }
    if (event.target.id === LTZ_STRINGS.LOCALE_DROPDOWN.ID) {
      selectedLanguage = event?.target?._list.find((language) => language?.value === event.target.value);
      data = {
        pref_language: selectedLanguage?.language,
        error_list: [],
        ...data,
      };
      localStorage.setItem('application_language', event.target.value);
    }
    data = {
      ...data,
      [event.target.id]: event.target.value,
    };
    console.log('onChangeHandler', event, data);
    await userPreferenceDataChange(data);

    this.compareValuesAndEnableButton();
  };

  onSaveClicked = (event) => {
    event.preventDefault();
    const { language_settings, error_list } = cloneDeep(this.props);
    const { userPreferenceDataChange, i18n } = this.props;
    const data = this.getUpdatedLanguageDetailsData(language_settings, {
      ...this.props,
    });
    if (data.pref_language && !data.pref_locale) {
      const { t } = this.props;
      error_list[LTZ_STRINGS.LOCALE_DROPDOWN.ID] =
        t(LTZ_STRINGS.LOCALE_DROPDOWN.LABEL) + REQUIRED_TEXT;
      userPreferenceDataChange({
        error_list,
      });
    } else {
      this.updateDetailsAPI(data);
      i18n.changeLanguage(localStorage.getItem('application_language'));
    }
  };

  onCancelClicked = (event) => {
    event.preventDefault();
    const stateData = cloneDeep(this.props);
    const updatedData = pick(stateData.language_settings, [
      'pref_language',
      'pref_locale',
      'pref_timezone',
    ]);

    store
      .dispatch(
        userPreferenceDataChangeAction({
          ...stateData,
          ...updatedData,
        }),
      )
      .then(() => {
        this.compareValuesAndEnableButton();
      });
  };

  compareValuesAndEnableButton = () => {
    const { language_settings, userPreferenceDataChange } = this.props;
    const is_equal = compareObjects(
      this.getCurrentLanguageAndCalendarDetails(cloneDeep(this.props)),
      this.getCurrentLanguageAndCalendarDetails(language_settings),
    );
    const data = {
      enable_button: !is_equal,
    };
    userPreferenceDataChange(data);
  };

  getUpdatedLanguageDetailsData = (props, state) => {
    const data = {};
    Object.keys(props).forEach((id) => {
      if (jsUtils.isEmpty(state[id]) && !jsUtils.isEmpty(props[id])) {
        data[id] = null;
      } else if (!jsUtils.isEmpty(state[id])) {
        data[id] = state[id];
      }
    });
    return data;
  };

  getCurrentLanguageAndCalendarDetails = (props) => {
    const data = {
      allow_update_timezone: props.allow_update_timezone,
      allow_update_language_locale: props.allow_update_language_locale,
    };
    if (props.pref_language) {
      data[LTZ_STRINGS.L_DROPDOWN.ID] = props.pref_language;
    }
    if (props.pref_locale) {
      data[LTZ_STRINGS.LOCALE_DROPDOWN.ID] = props.pref_locale;
    }
    if (props.pref_timezone) {
      data[LTZ_STRINGS.TZ_DROPDOWN.ID] = props.pref_timezone;
    }
    return data;
  };

  getUserId = () => {
    switch (store.getState().RoleReducer.role) {
      case ROLES.ADMIN:
        return store.getState().AdminProfileReducer.adminProfile.id;
      case ROLES.FLOW_CREATOR:
        return store.getState().DeveloperProfileReducer
          .flowCreatorProfile.id;
      case ROLES.MEMBER:
        return store.getState().MemberProfileReducer.memberProfile.id;
      default:
        return null;
    }
  };

  getLookupForSelectedDropDown = (id, forceUpdate) => {
    const {
      languages_list,
      pref_language,
      locale_list,
      timezone_list,
      error_list,
      userPreferenceDataChange,
    } = this.props;
    switch (id) {
      case LTZ_STRINGS.L_DROPDOWN.ID:
        if (isEmpty(languages_list)) {
          const { getLanguageLookUpData } = this.props;
          getLanguageLookUpData();
        }
        break;
      case LTZ_STRINGS.LOCALE_DROPDOWN.ID:
        if (
          (isEmpty(pref_language) &&
            (isEmpty(locale_list))) ||
          forceUpdate
        ) {
          const { getLocaleLookUpData } = this.props;
          error_list[LTZ_STRINGS.L_DROPDOWN.ID] = null;
          const params = { acc_locale: 1 };
          getLocaleLookUpData(params);
        } else {
          const { t } = this.props;
          error_list[LTZ_STRINGS.L_DROPDOWN.ID] =
            [t(LTZ_STRINGS.L_DROPDOWN.LABEL)] + REQUIRED_TEXT;
          userPreferenceDataChange({
            error_list,
          });
        }
        break;
      case LTZ_STRINGS.TZ_DROPDOWN.ID:
        if (isEmpty(timezone_list)) {
          const { getTimeZoneLookUpData } = this.props;
          getTimeZoneLookUpData();
        }
        break;
      default:
        break;
    }
    console.log('gdgdf', this.props);
  };

  updateDetailsAPI = (paramData) => {
    const {
      updateUserPreferenceData,
      history,
      allow_update_language_locale,
      allow_update_timezone,
      t,
    } = this.props;
    if (!allow_update_language_locale) {
      delete paramData.pref_locale;
      delete paramData.pref_language;
    }
    if (!allow_update_timezone) {
      delete paramData.pref_timezone;
    }
    const data = { ...paramData };
    const user_id = this.getUserId();
    data._id = user_id;
    updateUserPreferenceData(data, history, t);
  };
}
const mapStateToProps = (state) => {
  const {
    common_server_error,
    error_list,
    enable_button,
    pref_timezone,
    pref_locale,
    pref_language,
    language_settings,
    allow_update_timezone,
    allow_update_language_locale,
    is_language_changed,
    isDataLoading,
  } = state.UserPreferenceReducer;
  const { languages_list } = state.LanguageLookUpReducer;
  const { timezone_list } = state.TimeZoneLookUpReducer;
  const { locale_list } = state.LocaleLookUpReducer;
  return {
    languages_list,
    timezone_list,
    pref_language,
    pref_locale,
    pref_timezone,
    enable_button,
    error_list,
    common_server_error,
    language_settings,
    allow_update_timezone,
    allow_update_language_locale,
    is_language_changed,
    locale_list,
    isDataLoading,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getUserPreferenceData: (getCancelToken) => {
      dispatch(getUserPreferenceDataThunk(getCancelToken));
    },
    userPreferenceDataChange: (value) => {
      dispatch(userPreferenceDataChangeAction(value));
    },
    updateUserPreferenceData: (value, history, t) => {
      dispatch(updateUserPreferenceDataThunk(value, history, t));
    },
    getLanguageLookUpData: (params) => {
      dispatch(getLanguageLookupDataThunk(params));
    },
    getTimeZoneLookUpData: (params) => {
      dispatch(getTimeZoneLookUpDataThunk(params));
    },
    getLocaleLookUpData: (params) => {
      dispatch(getLocaleLookUpDataThunk(params));
    },
    clearUserPreferenceData: () => {
      dispatch(clearUserPreferenceDataAction());
    },
    clearLanguageLookUpData: () => {
      dispatch(clearLanguageLookUpDataAction());
    },
    clearTimeZoneLookUpData: () => {
      dispatch(clearTimeZoneLookUpDataAction());
    },
    clearLocaleLookUpData: () => {
      dispatch(clearLocaleLookUpDataAction());
    },
    dispatch,
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(withTranslation()(LanguageTimeZoneSettings)),
);
LanguageTimeZoneSettings.contextType = ThemeContext;

LanguageTimeZoneSettings.defaultProps = {
  pref_language: EMPTY_STRING,
  pref_locale: EMPTY_STRING,
  pref_timezone: EMPTY_STRING,
  allow_update_timezone: EMPTY_STRING,
  allow_update_language_locale: EMPTY_STRING,
  language_settings: null,
};

LanguageTimeZoneSettings.propTypes = {
  languages_list: PropTypes.arrayOf(PropTypes.string).isRequired,
  locale_list: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string))
    .isRequired,
  timezone_list: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string,
      country: PropTypes.string,
      utc_offset: PropTypes.number,
      utc_offsetStr: PropTypes.string,
      timezone: PropTypes.string,
      country_code: PropTypes.string,
      timezone_display: PropTypes.string,
    }),
  ).isRequired,
  pref_language: PropTypes.string,
  pref_locale: PropTypes.string,
  pref_timezone: PropTypes.string,
  enable_button: PropTypes.bool.isRequired,
  error_list: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string))
    .isRequired,
  allow_update_timezone: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]),
  allow_update_language_locale: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]),
  getUserPreferenceData: PropTypes.func.isRequired,
  userPreferenceDataChange: PropTypes.func.isRequired,
  updateUserPreferenceData: PropTypes.func.isRequired,
  getLanguageLookUpData: PropTypes.func.isRequired,
  getTimeZoneLookUpData: PropTypes.func.isRequired,
  getLocaleLookUpData: PropTypes.func.isRequired,
  clearUserPreferenceData: PropTypes.func.isRequired,
  clearLanguageLookUpData: PropTypes.func.isRequired,
  clearTimeZoneLookUpData: PropTypes.func.isRequired,
  clearLocaleLookUpData: PropTypes.func.isRequired,
  language_settings: PropTypes.objectOf(PropTypes.string),
  is_language_changed: PropTypes.bool.isRequired,
};
