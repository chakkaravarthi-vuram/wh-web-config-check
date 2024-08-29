import i18next from 'i18next';
import { DRAFT_APP_LIST, LIST_APPLICATION, PUBLISHED_APP_LIST } from '../../../../urls/RouteConstants';

export const APP_LIST_STATUS = {
    PUBLISHED: 'published',
    UNPUBLISHED: 'unpublished',
};

export const APP_LIST_ROUTE = {
    PUBLISHED: LIST_APPLICATION + PUBLISHED_APP_LIST,
    DRAFT: LIST_APPLICATION + DRAFT_APP_LIST,
};

export const GET_APP_LIST_COLUMN_LABEL = (t = i18next.t) => {
 return {
    APP_NAME: t('app_strings.app_listing.column_header.app_name'),
    ADMINS: t('app_strings.app_listing.column_header.admins'),
    PUBLISHED_ON: t('app_strings.app_listing.column_header.published_on'),
    SAVED_ON: t('app_strings.app_listing.column_header.saved_on'),
 };
};

export const GET_APP_LIST_LABEL = (t) => {
  return {
    EMPTY_LIST_TITLE: t('app_strings.app_listing.empty_list.title'),
    EMPTY_LIST_SUB_TITLE: t('app_strings.app_listing.empty_list.subtitle'),
    EMPTY_LIST_CREATE_APP_ACTION: t('app_strings.app_listing.empty_list.create_app'),
    DELETE_MODAL_TITLE: t('app_strings.app_listing.delete_modal.title'),
    DELETE_MODAL_SUB_TITLE_FIRST: t('app_strings.app_listing.delete_modal.subtitle_first'),
    DELETE_MODAL_SUB_TITLE_SECOND: t('app_strings.app_listing.delete_modal.subtitle_second'),
    DELETE_MODAL_YES_ACTION: t('app_strings.app_listing.delete_modal.delete'),
    DELETE_MODAL_NO_ACTION: t('app_strings.app_listing.delete_modal.cancel'),
    DELETE_PAGE_LAST_LINE: t('app_strings.app_listing.delete_modal.page_lastline'),
    DELETE_PAGE: t('app_strings.app_listing.delete_modal.delete_page'),
    DELETE_PAGE_TITLE: t('app_strings.app_listing.delete_modal.delete_page_title'),
    DELETE_COMPONENT: t('app_strings.app_listing.delete_modal.delete_component'),
    DELETE_COMPONENT_FIRST: t('app_strings.app_listing.delete_modal.delete_component_firstline'),
    DELETE_COMPONENT_SECOND: t('app_strings.app_listing.delete_modal.delete_component_lastline'),
    UNTITLED_PAGE_URL: 'untitled-page-1',
    UNTITLED_PAGE_NAME: 'Untitled Page 1',
  };
};

export const APP_LIST_ID = {
  TABLE_ID: 'application_list',
  DELETE_MODAL_ID: 'delete_modal',
};

export const APP_LIST_SORT_FIELD_KEYS = {
  NAME: 'name',
  ADMINS: 'admins',
  LAST_UPDATED_ON: 'last_updated_on',
};

export const APP_LIST_INITIAL_PAGE = 1;

export const APP_LIST_SETTINGS_OPTIONS = (t) => [
  {
    label: t('app_strings.app_listing.settings_options.app_header'),
    value: 1,
  },
  {
    label: t('app_strings.app_listing.settings_options.app_order'),
    value: 2,
  },
];

export const APP_HEADER_SETTINGS = (t) => {
  return {
    TITLE: t('app_strings.app_header_settings.title'),
    APP_ORDER_TITLE: t('app_strings.app_listing.settings_options.app_order'),
    DISPLAY_SETTINGS: {
      LABEL: t('app_strings.app_header_settings.display_settings.label'),
      APP_ORDER_LABEL: t('app_strings.app_header_settings.display_settings.app_order_label'),
      ID: t('app_strings.app_header_settings.display_settings.id'),
      OPTIONS: [
        {
          label: t('app_strings.app_header_settings.display_settings.one_at_a_time'),
        },
        {
          label: t('app_strings.app_header_settings.display_settings.multiple_at_a_time'),
        },
      ],
    },
    BUTTON: {
      CANCEL: t('app_strings.app_header_settings.button.cancel'),
    },
  };
};

export const APP_OPTION_VALUE = {
  HEADER_SETTINGS: 1,
  ORDER_SETTINGS: 2,
};

export const APP_LIST_COMMON_STRINGS = () => {
  return ({
    CARD: 'card',
  });
};

export const DEFAULT_APP = 'Default';
