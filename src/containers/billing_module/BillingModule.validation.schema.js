import { EMPTY_STRING } from 'utils/strings/CommonStrings';
import {
    FIRST_NAME_VALIDATION,
    constructJoiObject,
    STRING_VALIDATION,
    NUMBER_VALIDATION,
    EMAIL_VALIDATION,
    arrayValidation,
    ADDRESS_VALIDATIONS,
    POSTAL_CODE_VALIDATIONS,
    CVV_NUMBER,
    CITY_VALIDATION,
  } from 'utils/ValidationConstants';
import { CARD_NUMBER_VALIDATION } from '../../utils/ValidationConstants';
import { PAY_METHOD, PAY_PROFILE, BILLING_ADD_USER, BILLING_ADD_USER_REFERENCE } from './BillingModule.string';
import { CANCEL_COMMON } from './cancel_subscription/CancelSubs.strings';
import { SET_PAYMENT_PROFILE_STRINGS } from './payment_flow/setting_payment_profile/SetPaymentProfile.strings';
import { SETPAYMENT_METHOD_STRINGS } from './payment_flow/set_payment_method/SetPaymentMethod.string';

const Joi = require('joi');

export const paymentProfileValidationSchema = (t) => constructJoiObject({
    [t(PAY_PROFILE.LABEL.NAME_LABEL)]: FIRST_NAME_VALIDATION.required().label(t(PAY_PROFILE.LABEL.NAME_LABEL)),
    [t(PAY_PROFILE.LABEL.ADDRESS1_LABEL)]: ADDRESS_VALIDATIONS.required().label(t(PAY_PROFILE.LABEL.ADDRESS1_LABEL)),
    [t(PAY_PROFILE.LABEL.ADDRESS2_LABEL)]: ADDRESS_VALIDATIONS.required().label(t(PAY_PROFILE.LABEL.ADDRESS2_LABEL)),
    [t(PAY_PROFILE.LABEL.POSTAL_CODE)]: NUMBER_VALIDATION.required().label(t(PAY_PROFILE.LABEL.POSTAL_CODE)),
    [t(PAY_PROFILE.LABEL.CITY)]: CITY_VALIDATION.required().label(t(PAY_PROFILE.LABEL.CITY)),
    [t(PAY_PROFILE.LABEL.STATE)]: CITY_VALIDATION.required().label(t(PAY_PROFILE.LABEL.STATE)),
});

export const getPayProfileVadidateData = (state, t) => {
    console.log('gsfdshhgs', state);
    const data = {
        [t(PAY_PROFILE.LABEL.NAME_LABEL)]: state.account_name.trim(),
        [t(PAY_PROFILE.LABEL.ADDRESS1_LABEL)]: state.address.line1.trim(),
        [t(PAY_PROFILE.LABEL.ADDRESS2_LABEL)]: state.address.line2.trim(),
        [t(PAY_PROFILE.LABEL.POSTAL_CODE)]: state.address.postal_code,
        [t(PAY_PROFILE.LABEL.CITY)]: state.address.city.trim(),
        [t(PAY_PROFILE.LABEL.STATE)]: state.address.state.trim(),
    };
    return data;
};

export const paymentMethodValidationSchema = constructJoiObject({
    [PAY_METHOD.LABEL.EXPIRY_MONTH]: NUMBER_VALIDATION.required().label(PAY_METHOD.LABEL.EXPIRY_MONTH),
    [PAY_METHOD.LABEL.EXPIRY_YEAR]: NUMBER_VALIDATION.required().label(PAY_METHOD.LABEL.EXPIRY_YEAR),
    [PAY_METHOD.LABEL.BILLING_CVC_NUMBER]: CVV_NUMBER.required().label(PAY_METHOD.LABEL.BILLING_CVC_NUMBER),
    [PAY_METHOD.LABEL.BILLING_CARD_NUMBER]: CARD_NUMBER_VALIDATION.required().label(PAY_METHOD.LABEL.BILLING_CARD_NUMBER),
    // [PAY_METHOD.LABEL.BILLING_METHOD_CITY]: STRING_VALIDATION.required().label(PAY_METHOD.LABEL.BILLING_METHOD_CITY),
    // [PAY_METHOD.LABEL.BILLING_METHOD_POSTAL_CODE]: NUMBER_VALIDATION.required().label(PAY_METHOD.LABEL.BILLING_METHOD_POSTAL_CODE),
    // [PAY_METHOD.LABEL.BILLING_METHOD_LINE1]: STRING_VALIDATION.required().label(PAY_METHOD.LABEL.BILLING_METHOD_LINE1),
    // [PAY_METHOD.LABEL.BILLING_METHOD_LINE2]: STRING_VALIDATION.required().label(PAY_METHOD.LABEL.BILLING_METHOD_LINE2),
    // [PAY_METHOD.LABEL.BILLING_METHOD_STATE]: STRING_VALIDATION.required().label(PAY_METHOD.LABEL.BILLING_METHOD_STATE),
    // [PAY_METHOD.LABEL.BILLING_CARD_HOLDER_NAME]: STRING_VALIDATION.required().label(PAY_METHOD.LABEL.BILLING_CARD_HOLDER_NAME),
});

export const getPayMethodVadidateData = (state) => {
    const data = {};
    // Object.keys(state.billing_details.address).forEach((value) => {
    // if (value === 'line1') {
    //     data[PAY_METHOD.LABEL.BILLING_METHOD_LINE1] = state.billing_details.address[value] ? state.billing_details.address[value].trim() : null;
    // } else if (value === 'line2') {
    //     data[PAY_METHOD.LABEL.BILLING_METHOD_LINE2] = state.billing_details.address[value] ? state.billing_details.address[value].trim() : null;
    // } else if (value === 'city') {
    //     data[PAY_METHOD.LABEL.BILLING_METHOD_CITY] = state.billing_details.address[value] ? state.billing_details.address[value].trim() : null;
    // } else if (value === 'state') {
    //     data[PAY_METHOD.LABEL.BILLING_METHOD_STATE] = state.billing_details.address[value] ? state.billing_details.address[value].trim() : null;
    // } else if (value === 'postal_code') {
    //     data[PAY_METHOD.LABEL.BILLING_METHOD_POSTAL_CODE] = state.billing_details.address[value];
    // }
    // });
    // data[PAY_METHOD.LABEL.CARD_NICK_NAME] = state.metadata.card_nick_name.trim();
    data[PAY_METHOD.LABEL.EXPIRY_MONTH] = state.card.exp_month;
    data[PAY_METHOD.LABEL.EXPIRY_YEAR] = state.card.exp_year;
    data[PAY_METHOD.LABEL.BILLING_CVC_NUMBER] = state.card.cvc.toString();
    data[PAY_METHOD.LABEL.BILLING_CARD_NUMBER] = state.card.number.replace(/ /g, '');
    // data[PAY_METHOD.LABEL.BILLING_CARD_HOLDER_NAME] = state.billing_details.name;
    return data;
};

const addPaymentObjectSchema = Joi.object().keys({
    [BILLING_ADD_USER_REFERENCE.EMAIL]: EMAIL_VALIDATION.required().label(BILLING_ADD_USER.EMAIL),
    [BILLING_ADD_USER_REFERENCE.IS_PRIMARY_CONTACT]: STRING_VALIDATION.required().label(BILLING_ADD_USER.IS_PRIMARY_CONTACT),
    [BILLING_ADD_USER_REFERENCE.FIRST_NAME]: Joi.any().required().label(BILLING_ADD_USER.FIRST_NAME),
    search_value: Joi.string().allow(EMPTY_STRING),
});

export const addPaymentUserValidationSchema = Joi.array().items(addPaymentObjectSchema).min(1).required();

export const getPayAddUserValidation = (state) => {
    const data = {};
    data[BILLING_ADD_USER.EMAIL] = state.email.trim();
    data[BILLING_ADD_USER.IS_PRIMARY_CONTACT] = state.is_primary_contact;
    data[BILLING_ADD_USER.FIRST_NAME] = state.first_name.trim();
    return data;
};

export const cancelQuestionSchema = constructJoiObject({
    [CANCEL_COMMON.CANCEL_QUERY]: STRING_VALIDATION.required().label(CANCEL_COMMON.CANCEL_QUERY),
    [CANCEL_COMMON.CANCEL_QUESTION]: STRING_VALIDATION.allow(null, EMPTY_STRING).label(CANCEL_COMMON.CANCEL_QUESTION),
    [CANCEL_COMMON.CANCEL_PH]: STRING_VALIDATION.allow(null, EMPTY_STRING).label(CANCEL_COMMON.CANCEL_PH),
});

export const cancelArraySchema = arrayValidation(cancelQuestionSchema);

export const getCancelValidation = (state) => {
    const data = {};
    data[CANCEL_COMMON.CANCEL_QUERY] = state.email.trim();
};

export const getSavePaymentProfile = (state) => {
    const data = {
        [SET_PAYMENT_PROFILE_STRINGS.FORM_DETAILS.ADDRESS_LINE_1.ID]: state.line1.trim(),
        [SET_PAYMENT_PROFILE_STRINGS.FORM_DETAILS.ADDRESS_LINE_2.ID]: state.line2.trim(),
        [SET_PAYMENT_PROFILE_STRINGS.FORM_DETAILS.COUNTRY.ID]: state.country.trim(),
        [SET_PAYMENT_PROFILE_STRINGS.FORM_DETAILS.LANGUAGE.ID]: state.billing_language.trim(),
        [SET_PAYMENT_PROFILE_STRINGS.FORM_DETAILS.POSTAL_CODE.ID]: state.postal_code,
        [SET_PAYMENT_PROFILE_STRINGS.FORM_DETAILS.TIMEZONE.ID]: state.timezone.trim(),
        [SET_PAYMENT_PROFILE_STRINGS.FORM_DETAILS.BILLING_CURRENCY.ID]: state.cost_details_id.trim(),
        [SET_PAYMENT_PROFILE_STRINGS.FORM_DETAILS.STATE.ID]: state.state.trim(),
        [SET_PAYMENT_PROFILE_STRINGS.FORM_DETAILS.CITY.ID]: state.city.trim(),
    };
    return data;
};

export const savePaymentProfileSchema = (t) => constructJoiObject({
    [SET_PAYMENT_PROFILE_STRINGS.FORM_DETAILS.ADDRESS_LINE_1.ID]: ADDRESS_VALIDATIONS.required().label(t(SET_PAYMENT_PROFILE_STRINGS.FORM_DETAILS.ADDRESS_LINE_1.LABEL)),
    [SET_PAYMENT_PROFILE_STRINGS.FORM_DETAILS.ADDRESS_LINE_2.ID]: ADDRESS_VALIDATIONS.required().label(t(SET_PAYMENT_PROFILE_STRINGS.FORM_DETAILS.ADDRESS_LINE_2.LABEL)),
    [SET_PAYMENT_PROFILE_STRINGS.FORM_DETAILS.COUNTRY.ID]: STRING_VALIDATION.required().label(t(SET_PAYMENT_PROFILE_STRINGS.FORM_DETAILS.COUNTRY.LABEL)),
    [SET_PAYMENT_PROFILE_STRINGS.FORM_DETAILS.LANGUAGE.ID]: STRING_VALIDATION.required().label(t(SET_PAYMENT_PROFILE_STRINGS.FORM_DETAILS.LANGUAGE.LABEL)),
    [SET_PAYMENT_PROFILE_STRINGS.FORM_DETAILS.POSTAL_CODE.ID]: POSTAL_CODE_VALIDATIONS.required().label(t(SET_PAYMENT_PROFILE_STRINGS.FORM_DETAILS.POSTAL_CODE.LABEL)),
    [SET_PAYMENT_PROFILE_STRINGS.FORM_DETAILS.TIMEZONE.ID]: STRING_VALIDATION.required().label(t(SET_PAYMENT_PROFILE_STRINGS.FORM_DETAILS.TIMEZONE.LABEL)),
    [SET_PAYMENT_PROFILE_STRINGS.FORM_DETAILS.BILLING_CURRENCY.ID]: STRING_VALIDATION.required().label(t(SET_PAYMENT_PROFILE_STRINGS.FORM_DETAILS.BILLING_CURRENCY.LABEL)),
    [SET_PAYMENT_PROFILE_STRINGS.FORM_DETAILS.STATE.ID]: CITY_VALIDATION.required().label(t(SET_PAYMENT_PROFILE_STRINGS.FORM_DETAILS.STATE.LABEL)),
    [SET_PAYMENT_PROFILE_STRINGS.FORM_DETAILS.CITY.ID]: CITY_VALIDATION.required().label(t(SET_PAYMENT_PROFILE_STRINGS.FORM_DETAILS.CITY.LABEL)),
});
export const setPaymentMethodValidateData = (state) => {
        const data = {};
        // data[SETPAYMENT_METHOD_STRINGS.FORM_DETAILS.ADDRESS_LINE_1.ID] = state['line1'] ? state['line1'].trim() : null;
        // data[SETPAYMENT_METHOD_STRINGS.FORM_DETAILS.ADDRESS_LINE_2.ID] = state['line2'] ? state['line2'].trim() : null;
        // data[SETPAYMENT_METHOD_STRINGS.FORM_DETAILS.CITY.ID] = state['city'] ? state['city'].trim() : null;
        // data[SETPAYMENT_METHOD_STRINGS.FORM_DETAILS.STATE.ID] = state['state'] ? state['state'].trim() : null;
        // data[SETPAYMENT_METHOD_STRINGS.FORM_DETAILS.POSTAL_CODE.ID] = state['postal_code'] ? state['postal_code'] : null;
        // data[SETPAYMENT_METHOD_STRINGS.FORM_DETAILS.CARS_NICK_NAME.ID] = state['cardNickName'] ? state['cardNickName'].trim() : null;
        data[SETPAYMENT_METHOD_STRINGS.FORM_DETAILS.EXPIRY_MONTH.ID] = state.expiryMonth ? state.expiryMonth : null;
        data[SETPAYMENT_METHOD_STRINGS.FORM_DETAILS.EXPIRY_YEAR.ID] = state.expiryYear ? state.expiryYear : null;
        // data[SETPAYMENT_METHOD_STRINGS.FORM_DETAILS.CARD_HOLDER_NAME.ID] = state['cardHolderName'] ? state['cardHolderName'].trim():null;
        data[SETPAYMENT_METHOD_STRINGS.FORM_DETAILS.CARD_NUMBER.ID] = state.cardNumber ? state.cardNumber.replace(/ /g, '') : null;
        data[SETPAYMENT_METHOD_STRINGS.FORM_DETAILS.CVC_NUMBER.ID] = state.CVV ? state.CVV.toString() : null;
        // data[SETPAYMENT_METHOD_STRINGS.FORM_DETAILS.COUNTRY.ID] = state[SETPAYMENT_METHOD_STRINGS.FORM_DETAILS.COUNTRY.ID];
        return data;
};
export const setPaymentMethodValidationSchema = constructJoiObject({
    // [SETPAYMENT_METHOD_STRINGS.FORM_DETAILS.CARS_NICK_NAME.ID]: STRING_VALIDATION.allow(null, EMPTY_STRING).label(PAY_METHOD.LABEL.CARD_NICK_NAME),
    [SETPAYMENT_METHOD_STRINGS.FORM_DETAILS.EXPIRY_MONTH.ID]: STRING_VALIDATION.required().label(PAY_METHOD.LABEL.EXPIRY_MONTH),
    [SETPAYMENT_METHOD_STRINGS.FORM_DETAILS.EXPIRY_YEAR.ID]: STRING_VALIDATION.required().label(PAY_METHOD.LABEL.EXPIRY_YEAR),
    // [SETPAYMENT_METHOD_STRINGS.FORM_DETAILS.CITY.ID]: STRING_VALIDATION.required().label(PAY_METHOD.LABEL.BILLING_METHOD_CITY),
    // [SETPAYMENT_METHOD_STRINGS.FORM_DETAILS.POSTAL_CODE.ID]: NUMBER_VALIDATION.required().label(PAY_METHOD.LABEL.BILLING_METHOD_POSTAL_CODE),
    // [SETPAYMENT_METHOD_STRINGS.FORM_DETAILS.ADDRESS_LINE_1.ID]: ADDRESS_VALIDATIONS.required().label(PAY_METHOD.LABEL.BILLING_METHOD_LINE1),
    // [SETPAYMENT_METHOD_STRINGS.FORM_DETAILS.ADDRESS_LINE_2.ID]: ADDRESS_VALIDATIONS.required().label(PAY_METHOD.LABEL.BILLING_METHOD_LINE2),
    // [SETPAYMENT_METHOD_STRINGS.FORM_DETAILS.STATE.ID]: STRING_VALIDATION.required().label(PAY_METHOD.LABEL.BILLING_METHOD_STATE),
    // [SETPAYMENT_METHOD_STRINGS.FORM_DETAILS.CARD_HOLDER_NAME.ID]: STRING_VALIDATION.required().label(PAY_METHOD.LABEL.BILLING_CARD_HOLDER_NAME),
    [SETPAYMENT_METHOD_STRINGS.FORM_DETAILS.CARD_NUMBER.ID]: CARD_NUMBER_VALIDATION.required().label(PAY_METHOD.LABEL.BILLING_CARD_NUMBER),
    [SETPAYMENT_METHOD_STRINGS.FORM_DETAILS.CVC_NUMBER.ID]: CVV_NUMBER.required().label(PAY_METHOD.LABEL.BILLING_CVC_NUMBER),
    // [SETPAYMENT_METHOD_STRINGS.FORM_DETAILS.COUNTRY.ID]: STRING_VALIDATION.required().label(SETPAYMENT_METHOD_STRINGS.FORM_DETAILS.COUNTRY.LABEL),
});
