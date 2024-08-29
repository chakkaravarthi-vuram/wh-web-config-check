import React, { useEffect } from 'react';
import { connect, useSelector } from 'react-redux';
import { validate } from 'utils/UtilityFunctions';
import jsUtils, { isEmpty } from 'utils/jsUtility';
import { getTimeZoneLookUpDataThunk } from 'redux/actions/TimeZoneLookUp.Action';
import { getLanguageLookupDataThunk } from 'redux/actions/LanguageLookUp.Action';
import { getCountryTaxListThunk, paymentDataThunk, savePaymentProfileThunk } from 'redux/actions/BillingModule.Action';
import { getFormattedSaveProfileData } from 'containers/billing_module/BillingModule.utils';
import { EMPTY_STRING } from 'utils/strings/CommonStrings';
import { setPaymentMethodStateChange, setPaymentProfileState } from 'redux/reducer/BillingModuleReducer';
import { BILLING_CURRENCY, BILLING_VALIDATIONS, CURRENT_PAY_SCREEN } from 'containers/billing_module/BillingModule.string';
import { useTranslation } from 'react-i18next';
import SetPaymentProfileForm from './SetPaymentProfileForm/SetPaymentProfileForm';
import { getSavePaymentProfile, savePaymentProfileSchema } from '../../BillingModule.validation.schema';
import { SET_PAYMENT_PROFILE_STRINGS } from './SetPaymentProfile.strings';
import { getTaxDetailsDropdown } from '../../BillingModule.utils';

function SetPaymentProfile(props) {
    const { state, setPaymentStateChange, languages_list, timezone_list, getLanguageLookUpData, getTimeZoneLookUpData, changeExistingPayScreen, setPaymentProfileCall, getCountryWithTax, country_tax_list, tax_number_type_list, currency_list, userProfileData, setPaymentMethodChange, acc_timezone, tax_num_placeholder, paymentProfileDataThunk, paymentState, hasBillingProfile, is_already_billing_complted } = props;
    const { primary_locale } = useSelector((state) => state.RoleReducer);
    console.log('fsdafgdasg', primary_locale);
    const { t } = useTranslation();
    useEffect(() => {
        setPaymentStateChange({ [SET_PAYMENT_PROFILE_STRINGS.FORM_DETAILS.TIMEZONE.ID]: acc_timezone, [SET_PAYMENT_PROFILE_STRINGS.FORM_DETAILS.LANGUAGE.ID]: primary_locale });
        if (hasBillingProfile || is_already_billing_complted) {
            paymentProfileDataThunk(t);
        }
        getCountryWithTax();
    }, []);

    useEffect(() => {
        if (!isEmpty(paymentState) && (hasBillingProfile || is_already_billing_complted)) {
            const { city, line1, line2, postal_code, state } = paymentState.address;
            const { country, subscription_details } = paymentState;
            let billing_currency;
            country === 'India' ? billing_currency = 'INR' : billing_currency = 'USD';
            const countryObject = country_tax_list.length !== 0 && country_tax_list.find((value) => value.label === country);
            let tax_number_type_list = [];
            if (!isEmpty(countryObject)) tax_number_type_list = getTaxDetailsDropdown(countryObject.tax_type);
            setPaymentStateChange({ city, line1, line2, postal_code, state, billing_currency, country, tax_number_type_list, cost_details_id: subscription_details[0].cost_details_id });
        }
    }, [paymentState, country_tax_list.length]);

    const onChangeHandler = (id, isAddress) => async (event) => {
        let { value } = event.target;
        let countryCurrency;
        if (isAddress) {
            setPaymentMethodChange({ [id]: value });
        }
        if (id === SET_PAYMENT_PROFILE_STRINGS.FORM_DETAILS.POSTAL_CODE.ID) {
            value = value ? Number(value) : EMPTY_STRING;
        } else if (id === SET_PAYMENT_PROFILE_STRINGS.FORM_DETAILS.COUNTRY.ID) {
            const countryObject = country_tax_list.find((country) => country.label === value);

            if (countryObject.label === 'India') {
                countryCurrency = BILLING_CURRENCY.INR;
                const currencyObject = currency_list.find((currency) => currency.label === BILLING_CURRENCY.INR);
                setPaymentStateChange({ tax_number_type_list: getTaxDetailsDropdown(countryObject.tax_type), type: EMPTY_STRING, id: EMPTY_STRING, [SET_PAYMENT_PROFILE_STRINGS.FORM_DETAILS.BILLING_CURRENCY.ID]: BILLING_CURRENCY.INR, cost_details_id: currencyObject.value });
            } else {
                countryCurrency = BILLING_CURRENCY.USD;
                const currencyObject = currency_list.find((currency) => currency.label === BILLING_CURRENCY.USD);
                setPaymentStateChange({ tax_number_type_list: getTaxDetailsDropdown(countryObject.tax_type), type: EMPTY_STRING, id: EMPTY_STRING, [SET_PAYMENT_PROFILE_STRINGS.FORM_DETAILS.BILLING_CURRENCY.ID]: BILLING_CURRENCY.USD, cost_details_id: currencyObject.value });
            }
        } else if (id === SET_PAYMENT_PROFILE_STRINGS.FORM_DETAILS.TAX_NUMBER_TYPE.ID) {
            const taxObj = tax_number_type_list.find((detail) => detail.value === value);
            setPaymentStateChange({ tax_number_placeholder: taxObj.placeholder });
        }

        await setPaymentStateChange({ [id]: value });
        if (!jsUtils.isEmpty(state.error_list)) {
            const validateValue = { ...state, [id]: value };
            if (id === SET_PAYMENT_PROFILE_STRINGS.FORM_DETAILS.COUNTRY.ID) {
                validateValue.cost_details_id = countryCurrency;
            }
            const error = validate(
                getSavePaymentProfile(validateValue),
                savePaymentProfileSchema(t),
              );
            setPaymentStateChange({
                error_list: error,
            });
        }
    };

    const redirectToMethod = () => {
        changeExistingPayScreen(CURRENT_PAY_SCREEN.PAY_METHODs_SCREEN);
    };

    const onSubmitClick = async () => {
        const error = validate(
            getSavePaymentProfile(state),
            savePaymentProfileSchema(t),
          );
          if ((state.type !== EMPTY_STRING && state.type !== 0) && state.id === EMPTY_STRING) {
            error.id = BILLING_VALIDATIONS.TAX_NUMBER;
          }
          if ((state.type === EMPTY_STRING || state.type === 0) && state.id !== EMPTY_STRING) {
            error.type = BILLING_VALIDATIONS.TAX_TYPE;
          }
        await setPaymentStateChange({
            error_list: error,
        });
        if (jsUtils.isEmpty(error)) {
            setPaymentProfileCall(getFormattedSaveProfileData(state, null, userProfileData), redirectToMethod);
        }
    };

    const getDropDownValues = (id) => {
        switch (id) {
          case SET_PAYMENT_PROFILE_STRINGS.FORM_DETAILS.LANGUAGE.ID:
            if (jsUtils.isEmpty(languages_list)) {
                getLanguageLookUpData();
            }
            break;
          case SET_PAYMENT_PROFILE_STRINGS.FORM_DETAILS.TIMEZONE.ID:
            if (jsUtils.isEmpty(timezone_list)) {
                getTimeZoneLookUpData();
            }
            break;
          case SET_PAYMENT_PROFILE_STRINGS.FORM_DETAILS.COUNTRY.ID:
            if (jsUtils.isEmpty(country_tax_list)) {
                getCountryWithTax();
            }
            break;
          default:
            break;
        }
    };

    return (
        <SetPaymentProfileForm
            onChangeHandler={onChangeHandler}
            formDetails={state}
            getDropDownValues={getDropDownValues}
            timezone_list={timezone_list}
            languages_list={languages_list}
            changeExistingPayScreen={changeExistingPayScreen}
            onSubmitClick={onSubmitClick}
            country_tax_list={country_tax_list}
            tax_number_type_list={tax_number_type_list}
            currency_list={currency_list}
            userProfileData={userProfileData}
            setPaymentStateChange={setPaymentStateChange}
            tax_num_placeholder={tax_num_placeholder}
        />
    );
}

const mapStateToProps = (state) => {
    const { languages_list } = state.LanguageLookUpReducer;
    const { timezone_list } = state.TimeZoneLookUpReducer;
    return {
        state: state.BillingModuleReducer.setPaymentProfile,
        languages_list,
        timezone_list,
        country_tax_list: state.BillingModuleReducer.setPaymentProfile.country_tax_list,
        tax_number_type_list: state.BillingModuleReducer.setPaymentProfile.tax_number_type_list,
        currency_list: state.BillingModuleReducer.setPaymentProfile.currency_list,
        acc_timezone: state.AccountCompleteCheckReducer.timezone,
        acc_language: state.AccountCompleteCheckReducer.language,
        tax_num_placeholder: state.BillingModuleReducer.setPaymentProfile.tax_number_placeholder,
        paymentState: state.BillingModuleReducer.paymentAPIDetails,
        hasBillingProfile: state.AccountCompleteCheckReducer.has_billing_profile,
        is_already_billing_complted: state.BillingModuleReducer.is_profile_completed,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        setPaymentStateChange: (data) => dispatch(setPaymentProfileState(data)),
        getLanguageLookUpData: (params) => {
            dispatch(getLanguageLookupDataThunk(params));
        },
        getTimeZoneLookUpData: (params) => {
            dispatch(getTimeZoneLookUpDataThunk(params));
        },
        setPaymentProfileCall: (params, func1) => dispatch(savePaymentProfileThunk(params, func1)),
        getCountryWithTax: () => dispatch(getCountryTaxListThunk()),
        setPaymentMethodChange: (data) => dispatch(setPaymentMethodStateChange(data)),
        paymentProfileDataThunk: (t) => dispatch(paymentDataThunk(t)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(SetPaymentProfile);
