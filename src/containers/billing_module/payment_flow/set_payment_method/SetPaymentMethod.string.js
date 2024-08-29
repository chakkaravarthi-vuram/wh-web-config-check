 export const SETPAYMENT_METHOD_STRINGS = {
    TITLE: 'Set payment method',
    WORK_EMAIL: 'Work Email: ',
    SUB_TITLE: 'Payment Method',
    FORM_DETAILS: {
        EMAIL: {
            ID: 'email',
            LABEL: 'Billing email',
            PLACEHOLDER: 'Enter your company email',
            INSTRUCTION: 'Same as account signup',
        },
        ADDRESS_LINE_1: {
            ID: 'line1',
            LABEL: 'Address line 1',
            PLACEHOLDER: 'Company name, Street address…',
        },
        ADDRESS_LINE_2: {
            ID: 'line2',
            LABEL: 'Address line 2',
            PLACEHOLDER: 'Suite, unit, building, floor etc.',
        },
        POSTAL_CODE: {
            ID: 'postal_code',
            LABEL: 'ZIP/Postal code',
            PLACEHOLDER: 'Enter your postal code here…',
            TYPE: 'number',
        },
        CITY: {
            ID: 'city',
            LABEL: 'City',
            PLACEHOLDER: 'Select your city',
        },
        COUNTRY: {
            ID: 'country',
            LABEL: 'Country / Region',
            PLACEHOLDER: 'Enter your country',
        },
        STATE: {
            ID: 'state',
            LABEL: 'State',
            PLACEHOLDER: 'Enter your state',
        },
        CARD_HOLDER_NAME: {
            ID: 'cardHolderName',
            LABEL: 'Card Holder Name',
            PLACEHOLDER: 'Type card holder name here',
        },
       CVC_NUMBER: {
            ID: 'CVV',
            TYPE: 'number',
            LABEL: 'CVV',
            PLACEHOLDER: '000',
        },
        CARS_NICK_NAME: {
            ID: 'cardNickName',
            LABEL: 'Card Nick Name',
            PLACEHOLDER: 'Type card nick name here...',
        },
        EXPIRY_YEAR: {
            ID: 'expiryYear',
            LABEL: '',
            PLACEHOLDER: 'YYYY',
        },
        EXPIRY_MONTH: {
            ID: 'expiryMonth',
            LABEL: 'Expiry Month/Year',
            PLACEHOLDER: 'MM/YY',
        },
        EXPIRY_MONTH_YEAR: {
            ID: 'expiryMonthYear',
            LABEL: 'Expiry Month/Year',
            PLACEHOLDER: 'MM/YY',
        },
        CARD_NUMBER: {
            ID: 'cardNumber',
            LABEL: 'Card Number',
            PLACEHOLDER: '0000 0000 0000 0000',
            TYPE: 'number',
        },
    },
 };
// below strings are not used anymore, as card verification done in Stripe
export const SETPAYMENT_METHOD_STRINGS_COMMON = {
    PAYMENT_METHOD: 'Payment Method',
    CARD_ADDRESS: 'Card Address',
    BACK: 'BACK',
    MAKE_PAYMENT: 'VERIFY CARD',
    SET_PAYMENT_METHOD: 'Set Payment Method',
    WORK_EMAIL: 'Work Email: ',
    EXIT_PAYMENT: 'CANCEL',
    VERIFY_INFO: 'For verifying this card, we will be deducting ₹2 /$1 from you. Once verification is done, we will refund this money to your verified card.',
};

export const verificationInfoString = (currenyCheck) => (`For verifying this card, we will be deducting  ${currenyCheck ? '₹2' : '$1'} from you. Once verification is done, we will refund this money to your verified card.`);
