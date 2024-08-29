import React, { useEffect, useState } from 'react';
import Modal from 'components/form_components/modal/Modal';
import { connect } from 'react-redux';
import { getTimeZoneLookUpDataThunk } from 'redux/actions/TimeZoneLookUp.Action';
import { getLocaleLookUpDataThunk } from 'redux/actions/LocaleLookUp.Action';
import { getIndustryListApiThunk } from 'redux/actions/AccountSettings.Action';
import { accountSettingStateChange, accountSettingStateClear } from 'redux/reducer/AccountConfigSetReducer';
import { validate } from 'utils/UtilityFunctions';
import { EMPTY_STRING } from 'utils/strings/CommonStrings';
import { accountSettingSaveThunk, getCountryListThunk } from 'redux/actions/SignUp.Action';
import { useHistory } from 'react-router-dom';
import gClasses from 'scss/Typography.module.scss';
import cx from 'classnames/bind';
import { FIELD_ERRORS } from 'containers/admin_settings/account_settings/AccountSettings.strings';
import { useTranslation } from 'react-i18next';
import { accountSettingValidationSchema, getAccountMainModalValidationData, getAccountSettingVadidateData, getLanguageAccountValidationData } from './AccountInfoModal.validation.schema';
import { ACCOUNT_DROPDOWN_STRING } from './AccountInfoModal.string';
import jsUtils from '../../../utils/jsUtility';
import AccountInfoForm from './account_info_form/AccountInfoForm';
import styles from './AccountInfoModal.module.scss';
import { accountMainDetails } from '../../../axios/apiService/accountSettings.apiService';

function AccountInfoModal(props) {
    const { languages_list, locale_list, timezone_list,
            getLocaleLookUpData, getTimeZoneLookUpData, getIndustryListApiCall,
            industry_list, setState, company_name, industry, acc_timezone, acc_locale,
            acc_language, company_logo, error_list, account_id, accountSettingConfig,
            getCountryList, country_list, country, state,
            LanguageAndCalendar, account_domain, signOut, clearStateAccountSetting } = props;
    const { t } = useTranslation();
    const history = useHistory();
    const [selectedLanguages, setSelectedLanguages] = useState([]);
    const [primaryLanguageOptions, setPrimaryLanguageOptions] = useState([]);
    useEffect(() => {
      accountMainDetails().then((response) => {
        setState({
          account_id: response._id,
          company_name: response.account_name,
          industry: response.industry_type || [],
          primary_locale: response.primary_locale,
          acc_locale: response.acc_locale || [],
          acc_timezone: response.acc_timezone || EMPTY_STRING,
          country: response.country || EMPTY_STRING,
          acc_language: response.acc_language || EMPTY_STRING,
          is_default_theme: response.is_default_theme,
          theme: response.theme || {},
         });
         if (!jsUtils.isEmpty(response.acc_timezone)) {
          getTimeZoneLookUpData();
         }
         if (!jsUtils.isEmpty(response.acc_locale)) {
          setSelectedLanguages(response.acc_locale);
          getLocaleLookUpData();
         }
         if (!jsUtils.isEmpty(response.country)) {
          getCountryList();
        }
         if (!jsUtils.isEmpty(response.industry_type)) {
          getIndustryListApiCall();
        }
      });
      return () => {
        clearStateAccountSetting();
      };
    }, []);
    useEffect(() => {
        setPrimaryLanguageOptions(
          locale_list.filter((option) => option.value !== selectedLanguages),
        );
    }, [locale_list]);

    const signOutInitiate = () => {
      clearStateAccountSetting();
      signOut();
    };

    const validationCheck = (id, value) => {
      let validateParam = { company_name, industry, acc_timezone, acc_locale, acc_language, company_logo, country };
      validateParam = { ...validateParam, [id]: value };
      if (!jsUtils.isEmpty(error_list)) {
        const errorData = validate(
          getAccountSettingVadidateData(validateParam),
          accountSettingValidationSchema(t),
        );
        if (id === ACCOUNT_DROPDOWN_STRING.INDUSTRY_DROPDOWN.ID) {
          if (jsUtils.isEmpty(value)) errorData[ACCOUNT_DROPDOWN_STRING.INDUSTRY_DROPDOWN.ID] = FIELD_ERRORS.INDUSTRY_TYPE(t).IS_EMPTY;
          else delete errorData[ACCOUNT_DROPDOWN_STRING.INDUSTRY_DROPDOWN.ID];
        }
        setState({
          error_list: errorData,
        });
      }
    };

    const onChangeHandler = (id) => async (event) => {
      const localeCheck = {};
      if (id === ACCOUNT_DROPDOWN_STRING.LANGUAGE.ID) {
        localeCheck[ACCOUNT_DROPDOWN_STRING.LOCALE_DROPDOWN.ID] = EMPTY_STRING;
        await setState(localeCheck);
      }
      if (id === ACCOUNT_DROPDOWN_STRING.INDUSTRY_DROPDOWN.ID) {
        const { value } = event.target;
        const { state, setState } = props;
        const { industry } = state;
        const industryList = jsUtils.isUndefined(industry)
          ? []
          : jsUtils.cloneDeep(industry);
        if (!industryList.includes(value)) {
          industryList.push(value);
        } else {
          industryList.splice(industryList.indexOf(value), 1);
        }
        validationCheck(id, industryList);
        await setState({ [id]: industryList });
      } else {
        await setState({ [id]: event.target.value });
        validationCheck(id, event.target.value);
      }
    };

    const onLanguagesChange = (event) => {
      let updated_locale = [];
      const { value } = event.target;
      if (selectedLanguages.includes(value)) {
        setSelectedLanguages(selectedLanguages.filter((val) => val !== value));
        updated_locale = selectedLanguages.filter((val) => val !== value);
        setPrimaryLanguageOptions(
          primaryLanguageOptions.filter((option) => option.value !== value),
        );
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
      }
      updated_locale = locale_list.filter((curr_locale) =>
        updated_locale.includes(curr_locale.value),
      );
      updated_locale = updated_locale.map((curr_locale) => curr_locale.value);
      setState({
        acc_locale: updated_locale,
      });
    };

    const onPrimaryLanguageChange = (event) => {
      const { value } = event.target;
      const data = {
        primary_locale: value,
        acc_language: event.target.language,
      };
      setState({ ...data });
    };

    const onSubmitHandler = async (complogo, file_upload_details, callback) => {
      const company_logo = complogo;
      const validateParam = { company_name, industry, acc_timezone, acc_locale, acc_language, company_logo, country, ...complogo && company_logo };
      const data = getAccountSettingVadidateData(validateParam);
      const errorData = validate(data, accountSettingValidationSchema(t));
      if (jsUtils.isEmpty(data[ACCOUNT_DROPDOWN_STRING.INDUSTRY_DROPDOWN.ID])) errorData[ACCOUNT_DROPDOWN_STRING.INDUSTRY_DROPDOWN.ID] = FIELD_ERRORS.INDUSTRY_TYPE(t).IS_EMPTY;
      else delete errorData[ACCOUNT_DROPDOWN_STRING.INDUSTRY_DROPDOWN.ID];
      const validationStatus = errorData;
      callback && callback(validationStatus);
      await setState({
        error_list: validationStatus,
      });
      if (jsUtils.isEmpty(validationStatus)) {
        accountSettingConfig(getAccountMainModalValidationData({ ...state, company_logo, ...file_upload_details }, account_domain), getLanguageAccountValidationData(state, LanguageAndCalendar), history);
      }
    };

    const getDropDownValues = (id) => {
        switch (id) {
          case ACCOUNT_DROPDOWN_STRING.LANGUAGE.ID:
            getLocaleLookUpData();
            break;
          case ACCOUNT_DROPDOWN_STRING.TIMEZONE_DROPDOWN.ID:
            if (jsUtils.isEmpty(timezone_list)) {
              getTimeZoneLookUpData();
            }
            break;
          case ACCOUNT_DROPDOWN_STRING.COUNTRY.ID:
            if (jsUtils.isEmpty(country_list)) {
              getCountryList();
            }
            break;
          case ACCOUNT_DROPDOWN_STRING.INDUSTRY_DROPDOWN.ID:
            if (jsUtils.isEmpty(industry_list)) {
              getIndustryListApiCall();
            }
          break;
          default:
            break;
        }
      };

    return (
        <Modal
        id="account_info_details"
        contentClass={cx(styles.ContainerClass, gClasses.ZIndex152)}
        containerClass={styles.ContentClass}
        isModalOpen
        centerVH
        escCloseDisabled
        noCloseIcon
        >
            <AccountInfoForm
              getDropDownValues={getDropDownValues}
              timezone_list={timezone_list}
              languages_list={languages_list}
              locale_list={locale_list}
              industry_list={industry_list}
              onChangeHandler={onChangeHandler}
              company_logo={company_logo}
              error_list={error_list}
              onSubmitHandler={onSubmitHandler}
              account_id={account_id}
              country_list={country_list}
              setState={setState}
              validationCheck={validationCheck}
              account_domain={account_domain}
              signOut={signOutInitiate}
              formDetails={state}
              selectedLanguages={selectedLanguages}
              primaryLanguageOptions={primaryLanguageOptions}
              onPrimaryLanguageChange={onPrimaryLanguageChange}
              onLanguagesChange={onLanguagesChange}
            />
        </Modal>
    );
}

const mapStateToProps = (state) => {
    const { languages_list } = state.LanguageLookUpReducer;
    const { timezone_list } = state.TimeZoneLookUpReducer;
    const { locale_list } = state.LocaleLookUpReducer;
    return {
        industry_list: state.AccountSettingsReducer.industry_list,
        error_list: state.AccountSettingModalReducer.error_list,
        company_name: state.AccountSettingModalReducer.company_name,
        industry: state.AccountSettingModalReducer.industry,
        company_logo: state.AccountSettingModalReducer.company_logo,
        acc_timezone: state.AccountSettingModalReducer.acc_timezone,
        acc_locale: state.AccountSettingModalReducer.acc_locale,
        primary_locale: state.AccountSettingModalReducer.primary_locale,
        acc_language: state.AccountSettingModalReducer.acc_language,
        country: state.AccountSettingModalReducer.country,
        languages_list,
        timezone_list,
        locale_list,
        country_list: state.CountryLookUpReducer.country_list,
        state: state.AccountSettingModalReducer,
        LanguageAndCalendar: state.LanguageAndCalendarAdminReducer,
        account_domain: state.AdminProfileReducer.adminProfile.account_domain,
        account_id: state.AccountSettingModalReducer.account_id,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getTimeZoneLookUpData: (params) => {
            dispatch(getTimeZoneLookUpDataThunk(params));
        },
        getLocaleLookUpData: (params) => {
            dispatch(getLocaleLookUpDataThunk(params));
        },
        getIndustryListApiCall: () => {
            dispatch(getIndustryListApiThunk());
        },
        setState: (params) => {
          dispatch(accountSettingStateChange(params));
        },
        accountSettingConfig: (param1, param2, obj) => {
          dispatch(accountSettingSaveThunk(param1, param2, obj));
        },
        getCountryList: () => {
          dispatch(getCountryListThunk());
        },
        clearStateAccountSetting: () => {
          dispatch(accountSettingStateClear());
        },
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(AccountInfoModal);
