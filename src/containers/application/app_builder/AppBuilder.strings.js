import DashboardCompIcon from '../../../assets/icons/app_builder_icons/DashboardCompIcon';
import ImageCompIcon from '../../../assets/icons/app_builder_icons/ImageCompIcon';
import LinkCompIcon from '../../../assets/icons/app_builder_icons/LinkCompIcon';
import ReportsCompIcon from '../../../assets/icons/app_builder_icons/ReportsCompIcon';
import TaskCompIcon from '../../../assets/icons/app_builder_icons/TaskCompIcon';
import TextEditorIcon from '../../../assets/icons/app_builder_icons/TextEditorIcon';
import TriangleDownIcon from '../../../assets/icons/app_builder_icons/TriangleDown';
import WebpageEmbedIcon from '../../../assets/icons/app_builder_icons/WebpageEmbedIcon';
import { APP_MIN_MAX_CONSTRAINT } from '../../../utils/Constants';
import { translateFunction } from '../../../utils/jsUtility';
import {
  CHARACTERS_STRING,
  DISCARD_APP,
  EMPTY_STRING,
  NAME_PLACEHOLDER_PART1,
} from '../../../utils/strings/CommonStrings';
import { BE_TASK_LIST_TYPE } from '../app_components/task_listing/TaskList.constants';
import {
  GET_TASK_CONFIG_CONSTANT,
  TASK_COMPONENT_CONFIG_KEYS,
  TYPE_OF_TASK_KEY,
} from '../app_configuration/task_configuration/TaskConfiguration.constants';

export const APP_COMP_STRINGS = {
    TEXT_EDITOR: 'textstyle',
    IMAGE: 'image',
    LINK: 'link',
    REPORTS: 'reports',
    TASK: 'task',
    DASHBOARDS: 'dashboards',
    WEBPAGE_EMBED: 'embed',
    ADD: 'add',
};

export const UNTITLED_PAGE = 'app_strings.app_builder_tab.untitled_page';
export const UNTITLED_PAGE_1 = 'app_strings.app_builder_tab.untitled_page_1';

export const AppBuilderElementList = (t = translateFunction) => [
    {
        elementName: t('app_strings.app_builder.elements_list.text.name'),
        elementDesc: t('app_strings.app_builder.elements_list.text.description'),
        icon: TextEditorIcon,
        type: APP_COMP_STRINGS.TEXT_EDITOR,
    }, {
        elementName: t('app_strings.app_builder.elements_list.image.name'),
        elementDesc: t('app_strings.app_builder.elements_list.image.description'),
        icon: ImageCompIcon,
        type: APP_COMP_STRINGS.IMAGE,
    }, {
        elementName: t('app_strings.app_builder.elements_list.link.name'),
        elementDesc: t('app_strings.app_builder.elements_list.link.description'),
        icon: LinkCompIcon,
        type: APP_COMP_STRINGS.LINK,
    }, {
        elementName: t('app_strings.app_builder.elements_list.reports.name'),
        elementDesc: t('app_strings.app_builder.elements_list.reports.description'),
        icon: ReportsCompIcon,
        type: APP_COMP_STRINGS.REPORTS,
    }, {
        elementName: t('app_strings.app_builder.elements_list.task.name'),
        elementDesc: t('app_strings.app_builder.elements_list.task.description'),
        icon: TaskCompIcon,
        type: APP_COMP_STRINGS.TASK,
    }, {
        elementName: t('app_strings.app_builder.elements_list.dashboard.name'),
        elementDesc: t('app_strings.app_builder.elements_list.dashboard.description'),
        icon: DashboardCompIcon,
        type: APP_COMP_STRINGS.DASHBOARDS,
    }, {
        elementName: t('app_strings.app_builder.elements_list.webpage_embed.name'),
        elementDesc: t('app_strings.app_builder.elements_list.webpage_embed.description'),
        icon: WebpageEmbedIcon,
        type: APP_COMP_STRINGS.WEBPAGE_EMBED,
    },
];

export const ADD_COMPONENT_LABEL =
  'app_strings.app_builder.add_component_label';
export const CREATE_APP_TITLE = 'app_strings.create_app.title';
export const APPS_TITLE = 'app_strings.app_listing.apps';
export const EDIT_APP_TITLE = 'app_strings.edit_app_title';

export const APP_TAB_OPTIONS = (t = translateFunction) => [
  {
    labelText: t('app_strings.app_builder_tab.untitled_page'),
    value: 1,
    tabIndex: 1,
    Icon: TriangleDownIcon,
    isEditable: false,
  },
];

export const EMPTY_PAGE_NAME_ERROR = {
  TITLE: 'app_strings.app_builder_tab.empty_page_name_error.title',
  SUBTITLE: 'app_strings.app_builder_tab.empty_page_name_error.subtitle',
  SAME_NAME: 'app_strings.app_builder_tab.empty_page_name_error.page_unique',
  SAME_NAME_SUBTITLE:
    'app_strings.app_builder_tab.empty_page_name_error.page_unique_subtitle',
  PAGE_NAME_LIMIT:
    'app_strings.app_builder_tab.empty_page_name_error.page_name_char_limit_title',
};

export const APP_TAB_VALUE = {
  PAGE_SETTINGS: 'Page Settings',
};

export const APP_TAB_DATA = (t = translateFunction) => [
  {
    label: t('app_strings.app_builder_tab.app_tab_data.page_settings'),
    value: APP_TAB_VALUE.PAGE_SETTINGS,
    isEditable: 'false',
  },
  {
    label: t('app_strings.app_builder_tab.app_tab_data.move_right'),
    value: 'Move Right',
    isEditable: 'false',
  },
  {
    label: t('app_strings.app_builder_tab.app_tab_data.move_left'),
    value: 'Move Left',
    isEditable: 'false',
  },
  {
    label: t('app_strings.app_builder_tab.app_tab_data.delete_page'),
    value: 'delete',
    isEditable: 'false',
  },
];

export const APP_TAB_HEADER_OPTIONS = (t = translateFunction) => [
  {
    label: t('app_strings.app_tab_headers.edit_basic_details'),
    value: 'Edit Basic Details',
  },
  {
    label: t(DISCARD_APP),
    value: 'Discard App',
  },
  {
    label: t('app_strings.app_tab_headers.delete_app'),
    value: 'Delete App',
  },
];

export const CAROUSEL_RESPONSIVE = {
  superLargeDesktop: {
    breakpoint: { max: 4000, min: 1500 },
    items: 5,
  },
  desktop: {
    breakpoint: { max: 1500, min: 1300 },
    items: 5,
    partialVisibilityGutter: 40,
  },
  tablet: {
    breakpoint: { max: 1300, min: 800 },
    items: 3,
  },
  mobile: {
    breakpoint: { max: 800, min: 435 },
    items: 1,
  },
};

const TASK_CONFIG_CONSTANTS = GET_TASK_CONFIG_CONSTANT();

export const COMPONENT_INFO = {
  [APP_COMP_STRINGS.TEXT_EDITOR]: {
    formatter: EMPTY_STRING,
  },
  [APP_COMP_STRINGS.LINK]: {
    shortcut_style: 'link',
    links: [
      {
        type: 'adhoc_link',
        url: EMPTY_STRING,
        name: EMPTY_STRING,
        source_uuid: EMPTY_STRING,
      },
    ],
  },
  [APP_COMP_STRINGS.IMAGE]: {
    image: EMPTY_STRING,
    document_details: {
      documents: [],
      removed_doc_list: [],
    },
  },
  [APP_COMP_STRINGS.TASK]: {
    type: BE_TASK_LIST_TYPE.OPEN,
    type_of_task: TYPE_OF_TASK_KEY.FLOW_OR_DATA_LIST,
    [TASK_COMPONENT_CONFIG_KEYS.ASSIGNED_TO]:
      TASK_CONFIG_CONSTANTS.FILTER.ASSIGNED_TO.OPTIONS[0].value,
    [TASK_COMPONENT_CONFIG_KEYS.SELECT_COLUMNS]: [
      TASK_CONFIG_CONSTANTS.FILTER.SELECT_COLUMN.OPTIONS[0].value,
    ],
  },
  [APP_COMP_STRINGS.REPORTS]: {},
};

export const APP_UNTITLED_PAGE = 'Untitled Page';

export const APP_PAGE_SETTINGS_TAB_VALUE = {
  BASIC: 1,
  SECURITY: 2,
};

export const APP_PAGE_SETTINGS = (t = translateFunction) => {
  return {
    TITLE: t('app_strings.app_page_settings.title'),
    TAB: {
      OPTIONS: [
        {
          labelText: t(
            'app_strings.app_page_settings.tab_header_options.basic',
          ),
          value: APP_PAGE_SETTINGS_TAB_VALUE.BASIC,
          tabIndex: APP_PAGE_SETTINGS_TAB_VALUE.BASIC,
        },
        {
          labelText: t(
            'app_strings.app_page_settings.tab_header_options.security',
          ),
          value: APP_PAGE_SETTINGS_TAB_VALUE.SECURITY,
          tabIndex: APP_PAGE_SETTINGS_TAB_VALUE.SECURITY,
        },
      ],
    },
    BASIC: {
      PAGE_NAME: {
        ID: 'name',
        LABEL: t('app_strings.app_page_settings.page_name.label'),
        PLACEHOLDER: `${t(NAME_PLACEHOLDER_PART1)} ${
          APP_MIN_MAX_CONSTRAINT.APP_NAME_MAX_VALUE
        } ${t(CHARACTERS_STRING)}`,
        EXIST_ERROR: t('app_strings.app_page_settings.page_name.exist_error'),
      },
      PAGE_URL: {
        ID: 'url_path',
        LABEL: t('app_strings.app_page_settings.page_url.label'),
      },
    },
    SECURITY: {
      PAGE_ADMINS: {
        ID: 'admins',
        LABEL: t('app_strings.app_page_settings.page_admins.label'),
      },
      INHERIT_PAGE: {
        ID: 'is_inherit_from_page',
        OPTION: {
          label: t('app_strings.app_page_settings.inherit_page.label'),
          value: 'inheritPageSecurity',
        },
      },
      PAGE_VIEWERS: {
        ID: 'viewers,teams',
        LABEL: t('app_strings.app_page_settings.page_viewers.label'),
      },
    },
    BUTTONS: {
      DISCARD: t('app_strings.app_page_settings.discard'),
      SAVE: t('app_strings.app_page_settings.save'),
      ARIA_LABEL: 'Close App Model',
    },
  };
};
