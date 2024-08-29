import { DROPDOWN_CONSTANTS } from 'utils/strings/CommonStrings';

export const SET_PAYMENT_PROFILE_STRINGS = {
    TITLE: 'billing_module.set_payment_profile.title',
    WORK_EMAIL: 'billing_module.set_payment_profile.work_email',
    BILLING_DETAILS: 'billing_module.set_payment_profile.billing_details',
    TAX_DETAILS: 'billing_module.set_payment_profile.tax_details',
    OTHER_PREFERNCE_DETAILS: 'billing_module.set_payment_profile.other_preference_details',

    FORM_DETAILS: {
        EMAIL: {
            ID: 'email',
            LABEL: 'billing_module.set_payment_profile.form_details.email.label',
            PLACEHOLDER: 'billing_module.set_payment_profile.form_details.email.placeholder',
            INSTRUCTION: 'billing_module.set_payment_profile.form_details.email.instruction',
        },
        ADDRESS_LINE_1: {
            ID: 'line1',
            LABEL: 'billing_module.set_payment_profile.form_details.address1.label',
            PLACEHOLDER: 'billing_module.set_payment_profile.form_details.address1.placeholder',
        },
        ADDRESS_LINE_2: {
            ID: 'line2',
            LABEL: 'billing_module.set_payment_profile.form_details.address2.label',
            PLACEHOLDER: 'billing_module.set_payment_profile.form_details.address2.placeholder',
        },
        POSTAL_CODE: {
            ID: 'postal_code',
            LABEL: 'billing_module.set_payment_profile.form_details.postal_code.label',
            PLACEHOLDER: 'billing_module.set_payment_profile.form_details.postal_code.placeholder',
        },
        CITY: {
            ID: 'city',
            LABEL: 'billing_module.set_payment_profile.form_details.city.label',
            PLACEHOLDER: 'billing_module.set_payment_profile.form_details.city.placeholder',
        },
        COUNTRY: {
            ID: 'country',
            LABEL: 'billing_module.set_payment_profile.form_details.country.label',
            PLACEHOLDER: 'billing_module.set_payment_profile.form_details.country.placeholder',
        },
        STATE: {
            ID: 'state',
            LABEL: 'billing_module.set_payment_profile.form_details.state.label',
            PLACEHOLDER: 'billing_module.set_payment_profile.form_details.state.placeholder',
        },
        TAX_STATUS: {
            ID: 'tax_status',
            LABEL: 'billing_module.set_payment_profile.form_details.tax_status.label',
            PLACEHOLDER: 'billing_module.set_payment_profile.form_details.tax_status.placeholder',
        },
        TAX_NUMBER_TYPE: {
            ID: 'type',
            LABEL: 'billing_module.set_payment_profile.form_details.tax_number_type.label',
            PLACEHOLDER: 'billing_module.set_payment_profile.form_details.tax_number_type.placeholder',
        },
        TAX_NUMBER: {
            ID: 'id',
            LABEL: 'billing_module.set_payment_profile.form_details.tax_number.label',
            PLACEHOLDER: 'billing_module.set_payment_profile.form_details.tax_number.placeholder',
        },
        LANGUAGE: {
            ID: 'billing_language',
            LABEL: 'billing_module.set_payment_profile.form_details.language.label',
            PLACEHOLDER: 'billing_module.set_payment_profile.form_details.language.placeholder',
        },
        TIMEZONE: {
            ID: 'timezone',
            LABEL: 'billing_module.set_payment_profile.form_details.time_zone.label',
            PLACEHOLDER: 'billing_module.set_payment_profile.form_details.time_zone.placeholder',
        },
        BILLING_CURRENCY: {
            ID: 'billing_currency',
            LABEL: 'billing_module.set_payment_profile.form_details.billing_currency.label',
            PLACEHOLDER: 'billing_module.set_payment_profile.form_details.billing_currency.placeholder',
        },
        SUBMIT_BUTTON: {
            BACK: 'billing_module.set_payment_profile.form_details.submit_button.back',
            NEXT: 'billing_module.set_payment_profile.form_details.submit_button.next',
        },
    },
};

export const TAX_DROPDOWN = [
    {
        [DROPDOWN_CONSTANTS.OPTION_TEXT]: 'Taxable',
        [DROPDOWN_CONSTANTS.VALUE]: 'taxable',
    },
    {
        [DROPDOWN_CONSTANTS.OPTION_TEXT]: 'Exempt',
        [DROPDOWN_CONSTANTS.VALUE]: 'exempt',
    },
];

export const ERROR_POPUP = {
    COUNTRY_REQUIRED: 'billing_module.set_payment_profile.error_popup.country_required',
    TRY_AGAIN: 'billing_module.set_payment_profile.error_popup.try_again',
};
