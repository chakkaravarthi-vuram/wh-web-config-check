import React, { useEffect, useState } from 'react';
import Proptypes from 'prop-types';
import { connect } from 'react-redux';
import { Row } from 'reactstrap';
import { isEmpty, cloneDeep } from 'lodash';
import cx from 'classnames/bind';
import { useTranslation } from 'react-i18next';
import { withRouter } from 'react-router-dom';
import Button from '../../../components/form_components/button/Button';
import LanguageDetails from './language_details/LanguageDetails';
import TimeAndDayDetails from './time_and_day_details/TimeAndDayDetails';
import Holidays from './holidays/Holidays';
import CustomCol from '../../../components/custom_col/CustomCol';

import { ACCOUNT_SETTINGS_FORM } from '../account_settings/AccountSettings.strings';

import { BUTTON_TYPE } from '../../../utils/Constants';
import {
  compareObjects,
  validate,
  mergeObjects,
} from '../../../utils/UtilityFunctions';
import { L_C_FORM } from './LanguagesAndCalendar.strings';
import {
  languageDetailsValidateSchema,
  getCurrentLanguageAndCalendarDetails,
  getLanguageInitialState,
  getUpdatedLanguageDetailsData,
} from './LanguagesAndCalendar.validate.schema';
import { EMPTY_STRING } from '../../../utils/strings/CommonStrings';
import {
  getLanguageAndCalendarDataThunk,
  languageAndCalendarDataChangeAction,
  updateLanguageAndCalendarDataThunk,
} from '../../../redux/actions/LanguageAndCalendarAdmin.Action';
import { updateLanguageAction } from '../../../redux/actions/Actions';
import { clearLanguageLookUpDataAction } from '../../../redux/actions/LanguageLookUp.Action';
import {
  getTimeZoneLookUpDataThunk,
  clearTimeZoneLookUpDataAction,
} from '../../../redux/actions/TimeZoneLookUp.Action';
import {
  getLocaleLookUpDataThunk,
  clearLocaleLookUpDataAction,
} from '../../../redux/actions/LocaleLookUp.Action';
import { BS } from '../../../utils/UIConstants';
import {
  CUSTOM_LAYOUT_COL,
  SAVE_BUTTON_COL_SIZE,
} from '../AdminSettings.strings';

import gClasses from '../../../scss/Typography.module.scss';
import FormPostOperationFeedback from '../../../components/popovers/form_post_operation_feedback/FormPostOperationFeedback';
import { getISOStringFromTimeString } from '../../../utils/dateUtils';
import styles from './LanguagesAndCalendar.module.scss';

let cancelForLanguageDetails;
let cancelForLanguageDetailsUpdate;
let cancelTokenForGetLanguage;
let cancelTokenForGetLocale;
let cancelTokenForGetTimezone;
function LanguagesAndCalendar(props) {
  const { locale_list, is_data_loading, acc_locale, getTimeZoneLookUpData } = props;
  const { i18n, t } = useTranslation();
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [primaryLanguageOptions, setPrimaryLanguageOptions] = useState([]);
  useEffect(() => {
    const { getLanguageAndCalendarData, error_list } = props;
    getLanguageAndCalendarData();
    delete error_list?.[L_C_FORM.L_DROPDOWN.ID];
    delete error_list?.[L_C_FORM.LOCALE_DROPDOWN.ID];
  }, []);

  useEffect(() => {
    if (is_data_loading) return;

    const selectedAccLocales = acc_locale?.map(
      (current_locale) => current_locale?.locale || current_locale,
    );
    setSelectedLanguages(selectedAccLocales);

    if (!isEmpty(acc_locale)) {
      const primaryOptionsData = locale_list.filter((localeData) =>
        selectedAccLocales.includes(localeData.value),
      );
      console.log({ primaryOptionsData });
      setPrimaryLanguageOptions(primaryOptionsData);
    }
  }, [is_data_loading, locale_list?.length]);

  useEffect(
    () => () => {
      const {
        clearLanguageLookUpData,
        clearTimeZoneLookUpData,
        clearLocaleLookUpData,
      } = props;
      if (cancelForLanguageDetails) cancelForLanguageDetails();
      if (cancelForLanguageDetailsUpdate) cancelForLanguageDetailsUpdate();
      if (cancelTokenForGetLanguage) cancelTokenForGetLanguage();
      if (cancelTokenForGetLocale) cancelTokenForGetLocale();
      if (cancelTokenForGetTimezone) cancelTokenForGetTimezone();
      clearLanguageLookUpData();
      clearTimeZoneLookUpData();
      clearLocaleLookUpData();
    },
    [],
  );

  const compareValuesAndEnableButton = (props) => {
    const { language_settings } = props;
    const is_equal = compareObjects(
      getCurrentLanguageAndCalendarDetails({ ...props }),
      language_settings,
    );
    return !is_equal;
  };

  const onChangeToggler = (id, value) => {
    const { languageAndCalendarDataChange } = props;
    const data = {
      [id]: !value,
    };
    const enable_button = compareValuesAndEnableButton({ ...props, ...data });
    languageAndCalendarDataChange({ ...data, enable_button });
  };

  // check1
  const getLanguageAndCalendarDetailsValidateData = (state) => {
    const {
      acc_language,
      acc_locale,
      working_days,
      working_hour_start_time,
      working_hour_end_time,
      primary_locale,
    } = state;
    const data = {
      [L_C_FORM.L_DROPDOWN.ID]: acc_language,
      [L_C_FORM.LOCALE_DROPDOWN.ID]: acc_locale,
      primary_locale,
      [L_C_FORM.WORKING_DAYS.ID]: working_days,
      [L_C_FORM.WORKING_HOURS_FROM_DROPDOWN.ID]: working_hour_start_time
        ? getISOStringFromTimeString(working_hour_start_time)
        : null,
      [L_C_FORM.WORKING_HOURS_TO_DROPDOWN.ID]: working_hour_end_time
        ? getISOStringFromTimeString(working_hour_end_time)
        : null,
    };
    return data;
  };

  const onChangeHandler = (event) => {
    const {
      acc_language,
      clearLocaleLookUpData,
      languageAndCalendarDataChange,
      error_list,
    } = props;
    let data = {
      [event.target.id]: event.target.value,
    };
    if (
      event.target.id === L_C_FORM.L_DROPDOWN.ID &&
      event.target.value !== acc_language
    ) {
      data = {
        ...data,
        is_language_changed: true,
      };
      clearLocaleLookUpData();
    }
    const updatedState = { ...props, ...data };
    let errorData = null;
    if (!isEmpty(error_list)) {
      errorData = validate(
        getLanguageAndCalendarDetailsValidateData(updatedState),
        languageDetailsValidateSchema(t),
      );
    }
    const enable_button = compareValuesAndEnableButton(updatedState);
    languageAndCalendarDataChange({
      ...data,
      enable_button,
      error_list: errorData,
    });
  };

  const onLanguagesChange = (event) => {
    const {
      languageAndCalendarDataChange,
      acc_locale,
      primary_locale,
      error_list,
    } = props;
    let updated_locale = [];
    let clonePrimaryLocate = cloneDeep(primary_locale);
    const { value } = event.target;

    if (selectedLanguages.includes(value)) {
      setSelectedLanguages(selectedLanguages.filter((val) => val !== value));
      updated_locale = selectedLanguages.filter((val) => val !== value);
      setPrimaryLanguageOptions(
        primaryLanguageOptions.filter((option) => option.value !== value),
      );
      if (value === primary_locale) {
        clonePrimaryLocate = EMPTY_STRING;
      }
    } else {
      setSelectedLanguages([...selectedLanguages, value]);
      updated_locale = [...selectedLanguages, value];
      const selectedOption = locale_list.find(
        (locale) => locale.value === value,
      );
      const { label, language } = selectedOption;
      const result = {
        label,
        value: selectedOption?.value,
        language,
      };
      setPrimaryLanguageOptions([...primaryLanguageOptions, result]);
      delete error_list[L_C_FORM.LOCALE_DROPDOWN.ID];
    }

    updated_locale = locale_list.filter((curr_locale) =>
      updated_locale.includes(curr_locale.value),
    );
    updated_locale = updated_locale.map((curr_locale) => curr_locale.value);
    const updatedState = { ...props, acc_locale };
    const enable_button = compareValuesAndEnableButton(updatedState);
    languageAndCalendarDataChange({
      acc_locale: updated_locale,
      enable_button,
      error_list,
      primary_locale: clonePrimaryLocate,
    });
  };

  const onPrimaryLanguageChange = (event) => {
    const { languageAndCalendarDataChange, error_list } = props;
    const { value } = event.target;
    const data = {
      primary_locale: value,
      acc_language: event.target.language,
    };
    const updatedState = { ...props, ...data };
    const enable_button = compareValuesAndEnableButton(updatedState);
    delete error_list[L_C_FORM.L_DROPDOWN.ID];
    languageAndCalendarDataChange({ ...data, enable_button, error_list });
    localStorage.setItem('application_language', value);
  };

  const onDayClick = (value) => {
    const { working_days } = cloneDeep(props);
    const { languageAndCalendarDataChange, error_list } = props;
    const index = working_days.indexOf(value);
    if (index !== -1) working_days.splice(index, 1);
    else working_days.push(value);
    const updatedState = { ...props, working_days };
    let errorData = null;
    const enable_button = compareValuesAndEnableButton(updatedState);
    if (!isEmpty(error_list)) {
      errorData = validate(
        getLanguageAndCalendarDetailsValidateData(updatedState),
        languageDetailsValidateSchema(t),
      );
    }
    languageAndCalendarDataChange({
      working_days,
      error_list: errorData,
      enable_button,
    });
  };

  // api post
  const updateLanguageAndCalendarDetails = () => {
    const {
      language_settings,
      updateLanguageAndCalendarData,
      history,
      acc_language,
      acc_locale,
      primary_locale,
    } = props;
    const data = getUpdatedLanguageDetailsData(language_settings, {
      ...props,
    });
    let accLocale = cloneDeep(acc_locale);
    data[L_C_FORM.L_DROPDOWN.ID] = acc_language;
    if (acc_locale[0]?.language) {
      accLocale = accLocale?.map(
        (current_locale) => current_locale?.locale || current_locale,
      );
    }
    data[L_C_FORM.LOCALE_DROPDOWN.ID] = accLocale;
    data.primary_locale = primary_locale;
    updateLanguageAndCalendarData(data, history);
  };

  const onSaveClicked = (event) => {
    event.preventDefault();
    const { languageAndCalendarDataChange } = props;
    const error_list = validate(
      getLanguageAndCalendarDetailsValidateData(props),
      languageDetailsValidateSchema(t),
    );
    languageAndCalendarDataChange({ error_list });
    if (isEmpty(error_list)) {
      updateLanguageAndCalendarDetails();
      i18n.changeLanguage(localStorage.getItem('application_language'));
    }
  };

  const onCancelClicked = (event) => {
    event.preventDefault();
    const { languageAndCalendarDataChange } = props;
    const initial_state = getLanguageInitialState({ ...props });
    languageAndCalendarDataChange({
      ...initial_state,
    });
  };

  const getLookupForSelectedDropDown = (id) => {
    const { error_list } = cloneDeep(props);
    const {
      // languages_list,
      // is_language_changed,
      timezone_list,
    } = props;

    switch (id) {
      case L_C_FORM.L_DROPDOWN.ID: {
        const { getLocaleLookUpData } = props;
        if (!isEmpty(error_list)) error_list[L_C_FORM.L_DROPDOWN.ID] = null;
        getLocaleLookUpData();
        break;
      }
      case L_C_FORM.TZ_DROPDOWN.ID:
        if (isEmpty(timezone_list)) {
          const { getTimeZoneLookUpData } = props;
          getTimeZoneLookUpData();
        }
        break;
      default:
        break;
    }
  };

  const { error_list, server_error, enable_button } = props;
  const errors = mergeObjects(error_list, server_error);
  let save_and_cancel_buttons = null;
  if (enable_button) {
    save_and_cancel_buttons = (
      <Row className={cx(gClasses.MT20, BS.JC_CENTER)}>
        <CustomCol size={SAVE_BUTTON_COL_SIZE}>
          <Button
            id="language_settings_cancel"
            buttonType={BUTTON_TYPE.SECONDARY}
            onClick={onCancelClicked}
            className={BS.PADDING_0}
            width100
          >
            {t(ACCOUNT_SETTINGS_FORM.CANCEL.LABEL)}
          </Button>
        </CustomCol>
        <CustomCol size={SAVE_BUTTON_COL_SIZE}>
          <Button
            id="language_settings_save"
            buttonType={BUTTON_TYPE.PRIMARY}
            onClick={onSaveClicked}
            className={BS.PADDING_0}
            width100
          >
            {t(ACCOUNT_SETTINGS_FORM.SAVE.LABEL)}
          </Button>
        </CustomCol>
      </Row>
    );
  }
  return (
    <Row className={cx(styles.LanguageCalendarContainer)}>
      <FormPostOperationFeedback id="language_and_calender_settings" />
      <CustomCol size={CUSTOM_LAYOUT_COL} className={gClasses.P0}>
        <form>
          <LanguageDetails
            onChange={onChangeHandler}
            formDetails={props}
            getLookupForSelectedDropDown={getLookupForSelectedDropDown}
            errors={errors}
            isDataLoading={is_data_loading}
            onChangeToggler={onChangeToggler}
            LangAndTimeDetailsLabels={styles.LangAndTimeDetailsLabels}
            selectedLanguages={selectedLanguages}
            primaryLanguageOptions={primaryLanguageOptions}
            onLanguagesChange={onLanguagesChange}
            onPrimaryLanguageChange={onPrimaryLanguageChange}
          />
          <TimeAndDayDetails
            onChange={onChangeHandler}
            onDayClick={onDayClick}
            formDetails={props}
            errors={errors}
            getLookupForSelectedDropDown={getLookupForSelectedDropDown}
            isDataLoading={is_data_loading}
            onChangeToggler={onChangeToggler}
            getTimeZoneLookUpData={getTimeZoneLookUpData}
            LangAndTimeDetailsLabels={styles.LangAndTimeDetailsLabels}
            dayPickerBoxStyles={styles.DayPickerBoxStyles}
          />
          {/* Yet to add functionality */}
          <Holidays
            langAndTimeDetailsLabels={styles.LangAndTimeDetailsLabels}
            formDetails={props}
            isDataLoading={is_data_loading}
          />
          {save_and_cancel_buttons}
        </form>
      </CustomCol>
    </Row>
  );
}

const mapStateToProps = (state) => {
  const {
    acc_language,
    acc_locale,
    primary_locale,
    acc_timezone,
    working_hour_start_time,
    working_hour_end_time,
    working_days,
    enable_button,
    error_list,
    server_error,
    common_server_error,
    is_data_loading,
    is_language_changed,
    allow_update_timezone,
    allow_update_language_locale,
    language_settings,
  } = state.LanguageAndCalendarAdminReducer;
  const { languages_list } = state.LanguageLookUpReducer;
  const { timezone_list } = state.TimeZoneLookUpReducer;
  const { locale_list } = state.LocaleLookUpReducer;
  return {
    languages_list,
    timezone_list,
    locale_list,
    acc_language,
    acc_locale,
    primary_locale,
    acc_timezone,
    working_hour_start_time,
    working_hour_end_time,
    working_days,
    enable_button,
    error_list,
    server_error,
    common_server_error,
    is_data_loading,
    is_language_changed,
    allow_update_timezone,
    allow_update_language_locale,
    language_settings,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getLanguageAndCalendarData: (value) => {
      dispatch(getLanguageAndCalendarDataThunk(value));
      return Promise.resolve();
    },
    languageAndCalendarDataChange: (value) => {
      dispatch(languageAndCalendarDataChangeAction(value));
    },
    updateLanguageAndCalendarData: (value, history) => {
      dispatch(updateLanguageAndCalendarDataThunk(value, history));
    },
    updateLanguageStrings: (value) => {
      dispatch(updateLanguageAction(value));
    },
    getTimeZoneLookUpData: (params) => {
      dispatch(getTimeZoneLookUpDataThunk(params));
    },
    getLocaleLookUpData: (params) => {
      dispatch(getLocaleLookUpDataThunk(params));
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
  connect(mapStateToProps, mapDispatchToProps)(LanguagesAndCalendar),
);

LanguagesAndCalendar.propTypes = {
  getLanguageAndCalendarData: Proptypes.func.isRequired,
  languageAndCalendarDataChange: Proptypes.func.isRequired,
  updateLanguageAndCalendarData: Proptypes.func.isRequired,
  getLanguageLookUpData: Proptypes.func.isRequired,
  getTimeZoneLookUpData: Proptypes.func.isRequired,
  getLocaleLookUpData: Proptypes.func.isRequired,
  clearLanguageLookUpData: Proptypes.func.isRequired,
  clearTimeZoneLookUpData: Proptypes.func.isRequired,
  clearLocaleLookUpData: Proptypes.func.isRequired,
  languages_list: Proptypes.arrayOf(Proptypes.any).isRequired,
  timezone_list: Proptypes.arrayOf(Proptypes.any).isRequired,
  locale_list: Proptypes.arrayOf(Proptypes.any).isRequired,
  acc_language: Proptypes.string,
  acc_locale: Proptypes.string,
  working_hour_start_time: Proptypes.string,
  working_hour_end_time: Proptypes.string,
  working_days: Proptypes.arrayOf(Proptypes.any).isRequired,
  enable_button: Proptypes.bool.isRequired,
  error_list: Proptypes.arrayOf(Proptypes.any).isRequired,
  server_error: Proptypes.oneOfType([Proptypes.array, Proptypes.object])
    .isRequired,
  is_language_changed: Proptypes.bool.isRequired,
  language_settings: Proptypes.objectOf(Proptypes.any).isRequired,
  dispatch: Proptypes.func.isRequired,
  is_data_loading: Proptypes.bool.isRequired,
  primary_locale: Proptypes.string,
};
LanguagesAndCalendar.defaultProps = {
  acc_language: EMPTY_STRING,
  acc_locale: EMPTY_STRING,
  working_hour_start_time: EMPTY_STRING,
  working_hour_end_time: EMPTY_STRING,
  primary_locale: EMPTY_STRING,
};
