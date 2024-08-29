const LOOK_UP_MANAGEMENT_STRINGS = {
    HEADING: 'admin_settings.library_management.heading',
    SUBTITLE: 'admin_settings.library_management.look_up_management_strings.sub_title',
    ROWS_PER_PAGE: 'admin_settings.library_management.category_management_strings.rows_per_page',
    EDIT_LOOK_UP_ICON_LABEL: 'admin_settings.library_management.look_up_management_strings.edit_look_up_icon_label',
    SET_LOOKUP_FIELDS: {
        LABEL: 'admin_settings.library_management.look_up_management_strings.set_look_up_fields_label',
    },
    LOOK_UP_ERROR: 'admin_settings.library_management.look_up_management_strings.lookup_error',
    CANCEL_BUTTON: {
        LABEL: 'admin_settings.library_management.look_up_management_strings.cancel_button',
    },
    ADD_NEW: 'admin_settings.library_management.look_up_management_strings.add_new',
    ADD_VALUE: 'admin_settings.library_management.look_up_management_strings.add_value',
    ADD_LOOKUP: {
     TITLE: 'admin_settings.library_management.add_look_up.title',
     EDIT_TITLE: 'admin_settings.library_management.add_look_up.edit_title',
     SUBTITLE: 'admin_settings.library_management.add_look_up.sub_title',
     EDIT_SUBTITLE: 'admin_settings.library_management.add_look_up.edit_subtitle',
     FIELD_TYPE: {
         ID: 'lookup_type',
         PLACEHOLDER: 'admin_settings.library_management.add_look_up.field_type.placeholder',
         LABEL: 'admin_settings.library_management.add_look_up.field_type.label',
     },
     FIELD_NAME: {
        ID: 'lookup_name',
        PLACEHOLDER: 'admin_settings.library_management.add_look_up.field_name.placeholder',
        LABEL: 'admin_settings.library_management.add_look_up.field_name.label',
        MIN_ERROR: 'admin_settings.library_management.add_look_up.field_name.min_error',
        MAX_ERROR: 'admin_settings.library_management.add_look_up.field_name.max_error',
    },
    VALUES: {
        ID: 'lookup_value',
        PLACEHOLDER: 'admin_settings.library_management.add_look_up.values.placeholder',
        LABEL: 'admin_settings.library_management.add_look_up.values.label',
        MIN_ERROR: 'admin_settings.library_management.add_look_up.values.min_error',
        WORKING_DAYS: 'admin_settings.language_calendar.working_days',
        INSTRUCTION: 'admin_settings.library_management.add_look_up.values.instructions',
        VALIDATIONS: {
            NUMBER_VALIDATION: 'admin_settings.library_management.add_look_up.values.type_error_number',
        },
    },
    },
};

export const headers = (t) => [
    t('admin_settings.library_management.add_look_up.headers.field_name'),
    t('admin_settings.library_management.add_look_up.headers.field_type'),
    t('admin_settings.library_management.add_look_up.headers.values'),
    ''];

export const lookUpDropDown = (translate) => [
    {
        label: translate('admin_settings.library_management.add_look_up.look_up_drop_down.text_label'),
        value: 'Text',
        id: 'Text',
    },
    {
        label: translate('admin_settings.library_management.add_look_up.look_up_drop_down.number_label'),
        value: 'Number',
        id: 'Number',
    },
];

export const data = [
    {
    readOnly: true,
    isEditable: false,
    createNew: false,
   },
   {
    readOnly: true,
    isEditable: false,
    createNew: false,
   },
   {
    readOnly: false,
    isEditable: true,
    createNew: false,
   },
   {
    readOnly: false,
    isEditable: false,
    createNew: true,
   },
];

export default LOOK_UP_MANAGEMENT_STRINGS;
