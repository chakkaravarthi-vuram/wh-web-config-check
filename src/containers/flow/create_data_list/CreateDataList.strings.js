import { translate } from 'language/config';
import { translateFunction } from 'utils/jsUtility';
import { RESPONSE_TYPE } from '../../../utils/Constants';

export const CREATE_DATA_LIST_TAB_INDEX = {
  BASIC_INFO: 1,
  ADD_DATA_SET_FIELD: 2,
  SETTINGS: 3,
};

export const DATA_LIST_NAME = {
  ID: 'data_list_name',
};

export const GET_ALL_FIELDS_LIST_BY_FILTER_TYPES = {
  METRICS: 1,
  IDENTIFIERS: 2,
};

export const OWNERS_VALIDATION = {
  DATALIST_OWNERS_REQUIRED: translate('datalist_strings.errors.datalist_owners_required'),
};

export const CREATE_DATA_LIST_STRINGS = (translate = translateFunction) => {
  return {
  TITLE: 'Create Datalist',
  TABS: [
    {
      TEXT: 'Basic Info',
      INDEX: CREATE_DATA_LIST_TAB_INDEX.BASIC_INFO,
      SUB_TITLE: 'Creating your datalist is just a few steps away, enter your datalist name to continue.',
      EDIT_VIEW_SUB_TITLE: 'Editing your datalist is just a few steps away, edit your datalist name to continue.',
    },
    {
      TEXT: 'Add datalist fields',
      INDEX: CREATE_DATA_LIST_TAB_INDEX.ADD_DATA_SET_FIELD,
      SUB_TITLE: 'Creating your datalist is just a few steps away.',
      EDIT_VIEW_SUB_TITLE: 'Editing your datalist is just a few steps away.',
    },
    {
      TEXT: 'Settings',
      INDEX: CREATE_DATA_LIST_TAB_INDEX.SETTINGS,
      SUB_TITLE: 'Setup your metrics, secure your datalist visibility and sharing with easy way.',
    },
  ],
  BASIC_INFO: {
    FLOW_NAME: {
      LABEL: 'Datalist Name',
      ID: 'datalist_name',
      PLACEHOLDER: 'Type your datalist name here…',
    },
    FLOW_DESCRIPTION: {
      LABEL: 'Datalist Description',
      ID: 'datalist_description',
      PLACEHOLDER: 'Type your datalist description here…',
    },
    FLOW_COLOR: {
      LABEL: 'Datalist Color',
    },
  },
  ADD_DATA_SET_FIELD: {
    INDEX: 2,
    TITLE: 'Add datalist fields',
    SUBTITLE: 'Add form fields to capture information.',
    DATA_COLLECTION_CONFIRMATION: {
      LABEL: 'How do you want to add your data fields?',
      OPTION_LIST: [
        { value: 1, label: 'From scratch' },
        // { value: 2, label: 'From excel sheet' },
      ],
    },
    NO_SOURCE: {
      TITLE: 'Create new  form from scratch',
      SUB_TITLE: 'This is to capture information & ask questions',
      INDEX: 1,
    },
    IMPORT_SOURCE: {
      TITLE: 'Import first task form',
      SUB_TITLE: 'This will help you to get previous task form.',
      INDEX: 2,
    },
    IMPORT_FORM_POP_UP: {
      TITLE: 'Import Task Form',
      SUB_TITLE: 'Copy and Import first task form as read only',
      CANCEL: 'Cancel',
      IMPORT: 'Import',
    },
  },
  DATA_LIST_LABELS: {
    data_list_name: 'Table Name',
    data_list_description: 'Datalist Description',
    // steps: FLOW_T_STRINGS.FLOW_LABELS_STEPS,
    // step_name: FLOW_T_STRINGS.FLOW_LABELS_STEP_NAME,
    // step_description: FLOW_T_STRINGS.FLOW_LABELS_FLOW_STEP_DESCRIPTION,
    // step_document: FLOW_T_STRINGS.FLOW_LABELS_STEP_DOCUMENT,
    // effective_date: FLOW_T_STRINGS.FLOW_LABELS_EFFECTIVE_DATE,
    // owners: FLOW_T_STRINGS.FLOW_LABELS_OWNERS,
    // other_references: FLOW_T_STRINGS.FLOW_LABELS_OTHER_REFERENCES,
  },
  EDIT_RESPONSE_HANDLER: {
    MESAAGE_OBJECT: {
      title: translate('datalist.message_obj.oops'),
      subTitle: translate('datalist.message_obj.somthing_went_wrong'),
      type: RESPONSE_TYPE.SERVER_ERROR,
    },
  },
  SECURITY: {
    DATALIST_ADMINS: {
      LABEL: translate('publish_settings.security_settings.datalist_admins.label'),
    },
    DATALIST_OWNERS: {
      LABEL: translate('publish_settings.security_settings.datalist_owners.label'),
    },
    DATALIST_UPDATERS: {
      LABEL: translate('publish_settings.security_settings.datalist_updaters.label'),
    },
    DATA_SECURITY: {
      LABEL: translate('publish_settings.security_settings.datalist_security.label'),
      OPTION_LIST: [
        {
          value: true, // value changed to true from false after var name change from open visibility to is row level security
          label: translate('publish_settings.security_settings.datalist_security.option_list.tight_security'),
        },
        {
          value: false, // value changed to false from true after var name change from open visibility to is row level security
          label: translate('publish_settings.security_settings.datalist_security.option_list.open_security'),
        },
      ],
    },
    DATALIST_VIEWERS: {
      LABEL: translate('publish_settings.security_settings.datalist_viewers.label'),
    },
  },
  RESTRICT_EDIT_MODAL_INFO: {
    TITLE: translate('datalist.restrict_edit_model.title'),
    MAIN_DESCRIPTION: translate('datalist.restrict_edit_model.main_desc'),
    SUB_DESCRIPTION: translate('datalist.restrict_edit_model.sub_desc'),
    PRIMARY_ACTION: translate('datalist.restrict_edit_model.ok'),
  },
  DISCARD: {
    TITLE: translate('datalist.discard.title'),
    SUBTITLE: translate('datalist.discard.subtitle'),
  },
};
};
