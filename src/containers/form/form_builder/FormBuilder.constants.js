import { SUMMARY_FORM_STRINGS } from './FormBuilder.strings';

export const FORM_CONFIGURATION_TAB = {
    FIELDS: 0,
    CONFIGURATION: 1,
    COMPONENTS: 2,
    ADDED_FIELDS: 3,
};

export const TAB_OPTION_LIST = [
    {
        labelText: 'Form Fields',
        value: FORM_CONFIGURATION_TAB.FIELDS,
        tabIndex: FORM_CONFIGURATION_TAB.FIELDS,
    },
    {
        labelText: 'Form Configuration',
        value: FORM_CONFIGURATION_TAB.CONFIGURATION,
        tabIndex: FORM_CONFIGURATION_TAB.CONFIGURATION,
    },
];

export const SUMMARY_TAB_OPTIONS_LIST = (t) => [
    {
        labelText: SUMMARY_FORM_STRINGS(t).TABS.DESIGN_ELEMENTS,
        value: FORM_CONFIGURATION_TAB.COMPONENTS,
        tabIndex: FORM_CONFIGURATION_TAB.COMPONENTS,
    },
    {
        labelText: SUMMARY_FORM_STRINGS(t).TABS.FIELDS,
        value: FORM_CONFIGURATION_TAB.ADDED_FIELDS,
        tabIndex: FORM_CONFIGURATION_TAB.ADDED_FIELDS,
    },
];
