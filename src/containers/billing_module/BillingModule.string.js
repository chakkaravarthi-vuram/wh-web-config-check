/* eslint-disable react/react-in-jsx-scope */
import { DROPDOWN_CONSTANTS } from 'utils/strings/CommonStrings';
import moment from 'moment';

export const BILL_FORM_TYPE = {
    INPUT: 1,
    TEXTAREA: 2,
    DROPDOWN: 3,
    INPUT_NUMBER: 4,
    EXPIRY_DATE: 5,
    CHECK_BOX: 6,
};

export const FORM_FIELD_DIMENSIONS = {
    FULL_WIDTH: '100%',
    HALF_WIDTH: '50%',
    QUARTER_WIDTH: '25%',
    SKELETON_60: '60px',
    SKELETON_40: '40px',
};

export const BILLING_DROPDOWN_VALUE = { USER_TYPE: 'USER_TYPE', TIMEZONE: 'TIMEZONE', CURRENCY: 'CURRENCY' };

export const BILLING_PLACEHOLDER = {
    SELECT_USER: 'billing_module.billing_placeholder.selected_user',
    EMAIL: 'billing_module.billing_placeholder.email',
    USER_ROLE: 'billing_module.billing_placeholder.user_role',
};

export const BILLING_CONSTANTS_VALUES = {
    NO_INVOICE: 'billing_module.billing_constant_values.no_invoice',
    ALL_INVOICE: 'billing_module.billing_constant_values.all_invoice',
    VERIFY: 'billing_module.billing_constant_values.verify',
    UPDATE: 'billing_module.billing_constant_values.update',
    TRANSACTION_SUCCESSFUL: 'billing_module.billing_constant_values.transaction_successful',
    MORE_PRODUCTIVE: 'billing_module.billing_constant_values.most_productive',
    CONTINUE: 'billing_module.billing_constant_values.continue',
    TRANSACTION_FAILED: 'billing_module.billing_constant_values.tyransaction_failed',
    FAILURE_REASON: 'billing_module.billing_constant_values.failure_reason',
    CHANGE_CARD_DETAILS: 'billing_module.billing_constant_values.change_card_details',
    REDIRECT: 'billing_module.billing_constant_values.redirect',
    CANCEL: 'billing_module.billing_constant_values.cancel',
    ADD: 'billing_module.billing_constant_values.add',
};

export const USER_DET = {
    TITLE: 'billing_module.user_det.title',
    DETAILS: [
        {
            SUB_TITLE: 'billing_module.user_det.sub_title_1',
            isEditable: false,
        },
        {
            SUB_TITLE: 'billing_module.user_det.sub_title_2',
            isEditable: false,
            VALUE: 5,
            DEPENDENT: true,
        },
    ],
};

export const LATEST_INVOICE = {
    TITLE: 'billing_module.latest_invoice.title',
    ACTION: 'billing_module.latest_invoice.action',
    DETAILS: [],
};

export const PAY_PROFILE = {
    TITLE: 'billing_module.pay_profile.title',
    ACTION: 'billing_module.pay_profile.action',
    LABEL: {
        NAME_LABEL: 'billing_module.pay_profile.label.name',
        ADDRESS1_LABEL: 'billing_module.pay_profile.label.address1',
        ADDRESS2_LABEL: 'billing_module.pay_profile.label.address2',
        POSTAL_CODE: 'billing_module.pay_profile.label.postal_code',
        CITY: 'billing_module.pay_profile.label.city',
        COUNTRY: 'billing_module.pay_profile.label.country',
        STATE: 'billing_module.pay_profile.label.state',
        TAX_ID: 'billing_module.pay_profile.label.tax_id',
        TAX_NUMBER: 'billing_module.pay_profile.label.tax_number',
    },
    DETAILS: [
        {
            ID: 'Name',
            SUB_TITLE: 'billing_module.pay_profile.label.name',
            isEditable: false,
            FORM_TYPE: BILL_FORM_TYPE.INPUT,
            FORM_LABEL: 'Name',
            INSTRUCTION: '',
            isShow: true,
        },
        {
            ID: 'Address Line 1',
            SUB_TITLE: 'billing_module.pay_profile.label.address1',
            isEditable: true,
            FORM_TYPE: BILL_FORM_TYPE.INPUT,
            FORM_LABEL: 'billing_module.pay_profile.label.address1',
            INSTRUCTION: 'billing_module.pay_profile.instruction.address1',
            isShow: true,
        },
        {
            ID: 'Address Line 2',
            SUB_TITLE: 'billing_module.pay_profile.label.address2',
            isEditable: true,
            FORM_TYPE: BILL_FORM_TYPE.INPUT,
            FORM_LABEL: 'billing_module.pay_profile.label.address2',
            INSTRUCTION: 'billing_module.pay_profile.instruction.address2',
            isShow: true,
        },
        {
            ID: 'ZIP/Postal Code',
            SUB_TITLE: 'billing_module.pay_profile.label.postal_code',
            isEditable: true,
            FORM_TYPE: BILL_FORM_TYPE.INPUT_NUMBER,
            FORM_LABEL: 'billing_module.pay_profile.label.postal_code',
            isShow: true,
            PLACEHOLDER: 'billing_module.pay_profile.placeholder.postal_code_placeholder',
        },
        {
            ID: 'City',
            SUB_TITLE: 'billing_module.pay_profile.label.city',
            isEditable: true,
            FORM_TYPE: BILL_FORM_TYPE.INPUT,
            FORM_LABEL: 'billing_module.pay_profile.label.city',
            isShow: true,
            PLACEHOLDER: 'billing_module.pay_profile.placeholder.city_placeholder',
        },
        {
            ID: 'State',
            SUB_TITLE: 'billing_module.pay_profile.label.state',
            isEditable: true,
            FORM_TYPE: BILL_FORM_TYPE.INPUT,
            FORM_LABEL: 'billing_module.pay_profile.label.state',
            isShow: true,
            PLACEHOLDER: 'billing_module.pay_profile.placeholder.state_placeholder',
        },
        {
            ID: 'Country',
            SUB_TITLE: 'billing_module.pay_profile.label.country',
            isEditable: false,
            isShow: true,
        },
        {
            ID: 'Billing Currency',
            SUB_TITLE: 'billing_module.pay_profile.label.billing_currency',
            FORM_TYPE: BILL_FORM_TYPE.DROPDOWN,
            FORM_LABEL: 'billing_module.pay_profile.label.billing_currency',
            isEditable: false,
            FORM_DROPDOWN_TYPE: BILLING_DROPDOWN_VALUE.CURRENCY,
            isShow: true,
        },
        {
            ID: 'Tax ID',
            SUB_TITLE: 'billing_module.pay_profile.label.tax_id',
            isEditable: false,
            FORM_TYPE: BILL_FORM_TYPE.DROPDOWN,
            FORM_LABEL: 'billing_module.pay_profile.label.tax_id',
            isShow: true,
        },
        {
            ID: 'Tax Number',
            SUB_TITLE: 'billing_module.pay_profile.label.tax_number',
            isEditable: false,
            FORM_TYPE: BILL_FORM_TYPE.INPUT,
            FORM_LABEL: 'billing_module.pay_profile.label.tax_number',
            isShow: true,
        },
        {
            ID: 'Auto Debit',
            SUB_TITLE: 'billing_module.pay_profile.label.auto_debit',
            FORM_TYPE: BILL_FORM_TYPE.CHECK_BOX,
            FORM_LABEL: 'billing_module.pay_profile.label.auto_debit',
            isEditable: true,
            isShow: true,
        },
    ],
};

export const PAY_METHOD = {
    TITLE: 'billing_module.pay_method.title',
    ACTION: 'billing_module.pay_method.action',
    LABEL: {
        CARD_NICK_NAME: 'Card Nick Name',
        EXPIRY_MONTH: 'Expiry month',
        EXPIRY_YEAR: 'Expiry year',
        BILLING_METHOD_POSTAL_CODE: 'Billing Postal Code',
        BILLING_METHOD_CITY: 'Billing City',
        BILLING_METHOD_LINE1: 'Card Holder Address line 1',
        BILLING_METHOD_LINE2: 'Card Holder Address line 2',
        BILLING_METHOD_STATE: 'Billing State',
        BILLING_CARD_HOLDER_NAME: 'Card Holder Name',
        BILLING_CARD_NUMBER: 'Card Number',
        BILLING_CVC_NUMBER: 'CVV',
    },
    DETAILS: [
        {
            SUB_TITLE: 'Card Type',
            isEditable: false,
        },
        {
            SUB_TITLE: 'Card Number',
            isEditable: true,
            FORM_TYPE: BILL_FORM_TYPE.INPUT,
            FORM_LABEL: 'Card Number',
        },
        {
            SUB_TITLE: 'Expiry Month - Year',
            isEditable: true,
            FORM_TYPE: BILL_FORM_TYPE.EXPIRY_DATE,
            FORM_LABEL: 'Expiry Month',
            FORM_LABEL_YEAR: 'Expiry Year',
        },
        {
            SUB_TITLE: 'CVV Number',
            isEditable: false,
            FORM_TYPE: BILL_FORM_TYPE.INPUT,
            FORM_LABEL: 'CVV Number',
        },
    ],
};

export const INVOICE_HEADER = ['billing_module.invoice_header.invoice_id', 'billing_module.invoice_header.invoice_date', 'billing_module.invoice_header.invoice_amount', ''];

export const PAYMENT_HEADER = ['billing_module.payment_header.role', 'billing_module.payment_header.name', 'billing_module.payment_header.email', ''];

export const BILLING_EDITABLE_VIEW = {
    PAYMENT_USERS: 'User edit',
    PAYMENT_METHOD: 'Method edit',
    PAYMENT_PROFILE: 'Profile edit',
    USER_DETAILS: 'User details',
    SUBSCRIPTION_DETAILS: 'Subs details',
    INVOICES: 'Billing invoices',
};

export const BILLING_USER_TYPE_DROPDOWN = (t) => [
    {
      [DROPDOWN_CONSTANTS.OPTION_TEXT]: t('super_admin.account_details.primary'),
      [DROPDOWN_CONSTANTS.VALUE]: t('billing_module.billing_role.primary'),
    },
    {
      [DROPDOWN_CONSTANTS.OPTION_TEXT]: t('super_admin.account_details.secondary'),
      [DROPDOWN_CONSTANTS.VALUE]: t('billing_module.billing_role.secondary'),
    },
];

export const BILLING_USER_TYPE_DROPDOWN_PRIMARY = (t) => [
    {
      [DROPDOWN_CONSTANTS.OPTION_TEXT]: t('super_admin.account_details.primary'),
      [DROPDOWN_CONSTANTS.VALUE]: t('billing_module.billing_role.primary'),
    },
];

export const BILLING_USER_IS_WORKHALL = [
    {
      [DROPDOWN_CONSTANTS.OPTION_TEXT]: 'Workhall',
      [DROPDOWN_CONSTANTS.VALUE]: 'Workhall',
    },
    {
      [DROPDOWN_CONSTANTS.OPTION_TEXT]: 'Non-Workhall',
      [DROPDOWN_CONSTANTS.VALUE]: 'Non-Workhall',
    },
];

export function getMonthDropdownArray(year) {
    const currentYear = moment().format('YYYY');
    const currentMonth = moment().format('MM');
    const start = (year === currentYear) ? parseInt(currentMonth.replace(/^0+/, ''), 10) : 1;

    const array = [];
    for (let i = start; i <= 12; i++) {
        const monthObject = {};
        monthObject[DROPDOWN_CONSTANTS.OPTION_TEXT] = i;
        monthObject[DROPDOWN_CONSTANTS.VALUE] = i;
        array.push(monthObject);
    }
    return array;
}

export const BILLING_METHOD_MONTH = getMonthDropdownArray();

function getYearDropdownArray() {
    const currentYear = new Date().getFullYear();
    const array = [];
    for (let i = currentYear; i <= currentYear + 10; i++) {
        const yearObject = {};
        yearObject[DROPDOWN_CONSTANTS.OPTION_TEXT] = i;
        yearObject[DROPDOWN_CONSTANTS.VALUE] = i;
        array.push(yearObject);
    }
    return array;
}

export const BILLING_METHOD_YEAR = getYearDropdownArray();

export const BILLING_ADD_USER = { EMAIL: 'Email', IS_PRIMARY_CONTACT: 'Role', FIRST_NAME: 'User Name', LAST_NAME: 'Last Name' };

export const BILLING_ADD_USER_REFERENCE = { EMAIL: 'email', IS_PRIMARY_CONTACT: 'userRole', FIRST_NAME: 'user' };

export const BILLING_EDIT_USER = { EMAIL: 'Email', IS_PRIMARY_CONTACT: 'Role', FIRST_NAME: 'First Name', LAST_NAME: 'Last Name' };

export const CURRENT_PAY_SCREEN = {
    PLANS_SELECT_SCREEN: 1,
    PAY_PROFILE_SCREEN: 2,
    PAY_METHODs_SCREEN: 3,
};
export const INVOICE_PERIOD = {
    THREE_MONTH: '3 Month',
    SIX_MONTH: '6 Month',
    YEAR: '1 Year',
    ALL: 'All Invoices',
};
export const PERIOD_LIST = [{ [DROPDOWN_CONSTANTS.OPTION_TEXT]: '3 Month',
[DROPDOWN_CONSTANTS.VALUE]: '3 Month' }, { [DROPDOWN_CONSTANTS.OPTION_TEXT]: '6 Month', [DROPDOWN_CONSTANTS.VALUE]: '6 Month' }, { [DROPDOWN_CONSTANTS.OPTION_TEXT]: '1 Year', [DROPDOWN_CONSTANTS.VALUE]: '1 Year' }, { [DROPDOWN_CONSTANTS.OPTION_TEXT]: 'All Invoices', [DROPDOWN_CONSTANTS.VALUE]: 'All Invoices' }];

export const RESTRICTION_INFO_BILLING = 'billing_module.billing_constant_values.restriction_info';

export const BILLING_DEBIT_ENABLE_DISABLE = {
    TITLE: 'Do you want to enable Auto Debit for your Payments ?',
    OPTION_LIST: [
        {
          value: true,
          label: 'Yes',
        },
        {
          value: false,
          label: 'No',
        },
    ],
};

export const CVV_CHAR = {
    FOUR_CVV: '****',
    THREE_CVV: '***',
};

export const CARD_TYPE = {
    AMEX: 'amex',
};

export const PAYMENT_DETAILS = {
    PAYMENT_DETAILS: 'billing_module.payment_details.payment_detail',
    EDIT_USER: 'billing_module.payment_details.edit_user',
    INVOICES: 'billing_module.payment_details.invoices',
};

export const PAYMENT_ICONS = {
    VISA: 'visa',
    MASTER_CARD: 'mastercard',
    AMERICAN_EXPRESS: 'amex',
};

export const BILLING_VALIDATIONS = {
    TAX_TYPE: 'billing_module.billing_validation_common.tax_type',
    TAX_NUMBER: 'billing_module.billing_validation_common.tax_number',
    EMAIL_EXIST: 'billing_module.billing_validation_common.email_exist',
    USER_NAME_EXIST: 'billing_module.billing_validation_common.user_name_exist',
    ONE_PRIMARY: 'billing_module.billing_validation_common.one_priamry',
};

export const BILLING_CURRENCY = {
    USD: 'USD',
    INR: 'INR',
};

export const BILLLING_VALIDATION_ERROR = {
    DELETE_CONFIRMATION: 'billing_module.billing_validation_error.delete_confirmation',
    PAYMENT_USER_DELETE: 'billing_module.billing_validation_error.payment_user_delete',
};

export const PAY_BUTTON_STRINGS = {
PAY_NOW: 'billing_module.pay_button_strings.pay_now',
PAID: 'billing_module.pay_button_strings.paid',
};

export const BILLING_ROLE = {
    PRIMARY: 'billing_module.billing_role.primary',
    SECONDARY: 'billing_module.billing_role.secondary',
};
