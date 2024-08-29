import React from 'react';
import AllFlowsIcon from 'assets/icons/flow/AllFlowsIcon';
import BugIcon from 'assets/icons/flow/BugIcon';
import { translate } from 'language/config';
import { translateFunction } from 'utils/jsUtility';
import DraftFlow from 'assets/icons/flow/DraftFlow';
import LIST_HEADER from '../../../components/list_headers/ListHeader.strings';
import { EMPTY_STRING } from '../../../utils/strings/CommonStrings';

export const FLOW_DROPDOWN = {
  ID: 'FLOW_LIST_TAB_ID',
  PUBLISHED_FLOW: 1, // ALL_FLOW
  UNDER_TESTING: 2, // FLOW_I_OWN
  DRAFT_FLOW: 3, // DRAFT_FLOW
  OPTION_LIST: (t) => [
    {
      label: t('flow.list_flow.flow_dropdown.published_flows'),
      value: 1,
      icon: <AllFlowsIcon />,
    },
    {
      label: t('flow.list_flow.flow_dropdown.under_testing'),
      value: 2,
      icon: <BugIcon />,
    },
    {
      label: t('flow.list_flow.flow_dropdown.drafts'),
      value: 3,
      icon: <DraftFlow />,
    },
  ],
};

export const getFlowNavbarOptions = (tab_index, t) => [
  {
    label: t('flow.list_flow.flow_dropdown.published_flows'),
    value: 1,
    icon: <AllFlowsIcon isSelected={tab_index === FLOW_DROPDOWN.PUBLISHED_FLOW} />,
  },
  {
    label: t('flow.list_flow.flow_dropdown.under_testing'),
    value: 2,
    icon: <BugIcon isSelected={tab_index === FLOW_DROPDOWN.UNDER_TESTING} />,
  },
  {
    label: t('flow.list_flow.flow_dropdown.drafts'),
    value: 3,
    icon: <DraftFlow isSelected={tab_index === FLOW_DROPDOWN.DRAFT_FLOW} />,
  },
];

export const SORT_DROP_DOWN = {
  ID: 'sortDropdown',
  PLACE_HOLDER: 'Sort by',
  OPTION_LIST: [
    {
      label: 'Name (Asc)',
      value: 1,
    },
    {
      label: 'Name (Des)',
      value: -1,
    },
  ],
};

export const FLOW_HEADER = {
  DRAFT_FLOWS: 'flow.list_flow.flow_header.draft_flows',
};

export const SEARCH_FLOW = {
  PLACE_HOLDER: 'flow.list_flow.search_flow',
  ID: 'search_flow',
};

export const SCROLLABLE_DIV_ID = 'scrollableFlowDiv';

export const FLOW_MANAGED_BY_TYPE = {
  ID: 'Managed_By',
  ALL: 'all',
  ME: 'me',
  OTHERS: 'others',
  VALUE_ALL: 1,
  VALUE_MANAGED_BY_YOU: 2,
  VALUE_MANAGED_BY_OTHERS: 3,
  OPTIONS: (t = translateFunction) => ([
    {
      label: t('flow.list_flow.flow_managed_by_type.all_flows'),
      value: 1,
    },
    {
      label: t('flow.list_flow.flow_managed_by_type.managed_by_you'),
      value: 2,
    },
    {
      label: t('flow.list_flow.flow_managed_by_type.managed_by_others'),
      value: 3,
    },
   ]),
  TAB_OPTIONS: (t = translateFunction) => ([
    {
      TEXT: t('flow.list_flow.flow_managed_by_type.all_flows'),
      INDEX: 1,
    },
    {
      TEXT: t('flow.list_flow.flow_managed_by_type.managed_by_you'),
      INDEX: 2,
    },
    {
      TEXT: t('flow.list_flow.flow_managed_by_type.managed_by_others'),
      INDEX: 3,
    },
  ]),
};

export const FLOW_ACTIONS = {
  EDIT: 'EDIT',
  ADD: 'ADD',
  START: 'START',
 };

export const FLOW_LIST_BUTTONS = {
START: 'flow_dashboard.flow_list_buttons.start',
EDIT: 'flow_dashboard.flow_list_buttons.edit',
};

export const TASK_OPTION_LIST_STRINGS = {
  CLOSED_BY: translate('flow_dashboard.tasks_strings.closed_by'),
  COMPLETED_ON: translate('flow_dashboard.tasks_strings.completed_on'),
};

export const FLOW_CREATION_NLP = {
  PLACEHOLDER: 'landing_page_header.ai_prompt.prompt_description.flow',
  FAILURE: 'prompt.flow.failure',
};

export const FLOW_NORMAL_HEADERS = (isDraft, t) => {
  if (isDraft) {
    return (
      [
        {
          label: t(LIST_HEADER.FLOW.FLOW_NAME),
          widthWeight: 6,
        }, {
          label: t(LIST_HEADER.FLOW.ADMINS),
          widthWeight: 2,
        }, {
          label: t(LIST_HEADER.FLOW.SAVED_ON),
          widthWeight: 1,
        }, {
          label: EMPTY_STRING,
          widthWeight: 1,
        },
      ]
    );
  } else {
    return (
      [
        {
          id: 'Data Name',
          label: t(LIST_HEADER.FLOW.FLOW_NAME),
          widthWeight: 4,
          bodyStyleConfig: { isChangeIconColorOnHover: true },
        },
        {
          id: 'flow Description',
          label: 'Flow Description',
          widthWeight: 5,
        },
        {
          id: 'published on',
          label: 'Published On',
          widthWeight: 1,
        },
      ]
    );
  }
};

export const FLOW_LISTING_SORT_OPTIONS = () => (
  [
    {
      label: 'Published On (DESC)',
      value: 'Published On (DESC)',
      type: 'last_updated_on',
      sortBy: -1,
    },
    {
      label: 'Published On (ASC)',
      value: 'Published On (ASC)',
      type: 'last_updated_on',
      sortBy: 1,
    },
    {
      label: 'Flow Name (ASC)',
      value: 'Flow Name (ASC)',
      type: 'flow_name',
      sortBy: 1,
    },
    {
      label: 'Flow Name (DESC)',
      value: 'Flow Name (DESC)',
      type: 'flow_name',
      sortBy: -1,
    },
    {
      label: 'Category Name (ASC)',
      value: 'Category Name (ASC)',
      type: 'category_name',
      sortBy: 1,
    },
    {
      label: 'Category Name (DESC)',
      value: 'Category Name (DESC)',
      type: 'category_name',
      sortBy: -1,
    },
  ]
);

export const FLOW_KEY_ID = (t) => {
  return (
    {
      VALUE: 'value',
      LABEL: 'label',
      SORT_LABEL: 'sortLabel',
      SORT_VALUE: 'sortValue',
      DL_UUID: 'data_list_uuid',
      SHOWING: t('landing_page_header.common.showing'),
      FLOWS: 'Flows',
      SHOW_BY: 'Show By',
      SEARCH_PLACEHOLDER: t('landing_page_header.common.search_placeholder'),
    }
  );
};
