import React from 'react';
import LeftAlignIcon from '../../../../../assets/icons/apps/LeftAlignIcon';
import { translateFunction } from '../../../../../utils/jsUtility';
import CenterAlignIcon from '../../../../../assets/icons/apps/CenterAlignIcon';
import RightAlignIcon from '../../../../../assets/icons/apps/RightAlignIcon';
import { EMPTY_STRING } from '../../../../../utils/strings/CommonStrings';

export const LINK_CONFIGURATION_STRINGS = (t = translateFunction) => {
    return {
        TITLE: t('app_strings.pages.link.title'),
        LABEL: t('app_strings.pages.link.label'),
        LABEL_ID: 'label',
        PLACEHOLDER: t('app_strings.link_config.placeholder'),
        INVALID_URL_ERROR: t('app_strings.link_config.invalid_url_error'),
        COMPONENT_INFO_ID: 'component_info',
        SHORTCUT_STYLE: {
            ID: 'shortcut_style',
            LABEL: t('app_strings.pages.link.shortcut_style.label'),
            OPTION_LIST: [
                {
                    label: t('app_strings.pages.link.shortcut_style.options.link_style.label'),
                    value: t('app_strings.pages.link.shortcut_style.options.link_style.value'),
                  },
                  {
                    label: t('app_strings.pages.link.shortcut_style.options.button_style.label'),
                    value: t('app_strings.pages.link.shortcut_style.options.button_style.value'),
                  },
                  {
                    label: t('app_strings.pages.link.shortcut_style.options.outline_button_style.label'),
                    value: t('app_strings.pages.link.shortcut_style.options.outline_button_style.value'),
                  },
            ],
        },
        ALIGNMENT: {
            ID: 'alignment',
            LABEL: t('app_strings.pages.link.alignment.label'),
            OPTION_LIST: [
                {
                  label: t('app_strings.pages.link.alignment.options.left.label'),
                  value: t('app_strings.pages.link.alignment.options.left.value'),
                  icon: <LeftAlignIcon />,
                },
                {
                  label: t('app_strings.pages.link.alignment.options.center.label'),
                  value: t('app_strings.pages.link.alignment.options.center.value'),
                  icon: <CenterAlignIcon />,
                },
                {
                  label: t('app_strings.pages.link.alignment.options.right.label'),
                  value: t('app_strings.pages.link.alignment.options.right.value'),
                  icon: <RightAlignIcon />,
                },
              ],
        },
        LINKS: {
          ID: 'links',
          MAPPING_KEY: 'links',
          HEADERS: [
            t('app_strings.pages.link.links.headers.link_type'),
            EMPTY_STRING,
            EMPTY_STRING,
          ],
          COLUMN_LABELS: [
            t('app_strings.pages.link.links.headers.link_type'),
            t('app_strings.pages.link.links.headers.link_name'),
            t('app_strings.pages.link.links.headers.link_url'),
            t('app_strings.pages.link.links.headers.choose_flow'),
            t('app_strings.pages.link.links.headers.choose_datalist'),
          ],
          LINK_TYPES: {
            ID: 'type',
            PLACEHOLDER: t('app_strings.pages.link.links.link_types.placeholder'),
            OPTION_LIST: [
              {
                label: t('app_strings.pages.link.links.link_types.link.label'),
                value: 'adhoc_link',
              },
              {
                label: t('app_strings.pages.link.links.link_types.flow.label'),
                value: 'flow_link',
                EMPTY_MESSAGE: t('app_strings.pages.link.links.link_types.flow.empty_message'),
                PLACHEHOLDER: t('app_strings.pages.link.links.link_types.flow.placeholder'),
              },
              {
                label: t('app_strings.pages.link.links.link_types.datalist.label'),
                value: 'data_list_link',
                EMPTY_MESSAGE: t('app_strings.pages.link.links.link_types.datalist.empty_message'),
                PLACHEHOLDER: t('app_strings.pages.link.links.link_types.datalist.placeholder'),
                NO_ACCESS_ERROR: {
                  TITLE: t('app_strings.pages.link.links.link_types.datalist.no_acess_error.title'),
                  SUBTITLE: t('app_strings.pages.link.links.link_types.datalist.no_acess_error.subtitle'),
                },
              },
            ],
          },
          LINK_NAME: {
            ID: 'name',
            LINK_PLACEHOLDER: t('app_strings.pages.link.links.link_name.link_placeholder'),
            BUTTON_PLACEHOLDER: t('app_strings.pages.link.links.link_name.button_placeholder'),
          },
          LINK: {
            URL: 'url',
            SOURCE_UUID: 'source_uuid',
            ADHOC_LINK: {
              PLACEHOLDER: t('app_strings.pages.link.links.url.adhoc_link.placeholder'),
            },
            FLOW_LINK: {
              PLACEHOLDER: t('app_strings.pages.link.links.url.flow_link.placeholder'),
            },
            DATALIST_LINK: {
              PLACEHOLDER: t('app_strings.pages.link.links.url.datalist_link.placeholder'),
            },
          },
        },
        BUTTONS: {
          APPLY: t('app_strings.pages.link.save'),
          CANCEL: t('app_strings.pages.link.cancel'),
          DELETE: t('app_strings.pages.link.delete'),
        },
    };
};

export const SEARCH_DATALIST = 'app_strings.link_config.search_datalist';
export const SEARCH_FLOW = 'app_strings.link_config.search_flow';

export const LINK_COMPONENT_INITIAL_VALUE = (t = translateFunction) => {
  return {
    label: EMPTY_STRING,
    type: 'link',
    label_position: 'link',
    alignment: EMPTY_STRING,
    coordination: {
      maxH: 2,
      maxW: 4,
      minH: 1,
      minW: 1,
      w: 1,
      h: 1,
      i: 1,
      is_moved: false,
      is_static: false,
    },
    component_info: {
      shortcut_style: EMPTY_STRING,
      links: [{
        type: LINK_CONFIGURATION_STRINGS(t).LINKS.LINK_TYPES.OPTION_LIST[0].value,
        name: EMPTY_STRING,
        url: EMPTY_STRING,
        source_uuid: EMPTY_STRING,
      }],
    },
    errorList: {},
  };
};
