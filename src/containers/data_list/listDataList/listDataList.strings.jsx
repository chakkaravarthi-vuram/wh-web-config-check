import React from 'react';
import AllFlowsIcon from 'assets/icons/flow/AllFlowsIcon';
import DraftFlow from 'assets/icons/flow/DraftFlow';
import FlowIOwnIcon from 'assets/icons/flow/FlowIOwnIcon';
import LIST_HEADER from '../../../components/list_headers/ListHeader.strings';
import { EMPTY_STRING } from '../../../utils/strings/CommonStrings';

export const DATA_LIST_DROPDOWN = {
  ID: 'DATA_LIST_TAB_ID',
  ALL_DATA_LIST: 1,
  DATA_LIST_I_OWN: 2,
  DRAFT_DATA_LIST: 3,
  OPTION_LIST: (t) => {
    [
      {
        label: t('datalist.list_datalist.all_data_lists'),
        value: 1,
        icon: <AllFlowsIcon />,
      },
      {
        label: t('datalist.list_datalist.data_lists_i_own'),
        value: 2,
        icon: <FlowIOwnIcon />,
      },
      {
        label: t('datalist.list_datalist.drafts'),
        value: 3,
        icon: <DraftFlow />,
      },
    ];
  },
};

export const getDatalistNavbarOptions = (t, tab_index) => [
  {
    label: t('datalist.list_datalist.all_data_lists'),
    value: 1,
    icon: <AllFlowsIcon isSelected={tab_index === 1} />,
  },
  {
    label: t('datalist.list_datalist.data_lists_i_own'),
    value: 2,
    icon: <FlowIOwnIcon isSelected={tab_index === 2} />,
  },
  {
    label: t('datalist.list_datalist.drafts'),
    value: 3,
    icon: <DraftFlow isSelected={tab_index === 3} />,
  },
];

export const DATALIST_LABELS = {
  category: 'Category',
};

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

export const OTHERS = 'datalist.list_datalist.others';

export const SEARCH_DATA_LIST = {
  PLACE_HOLDER: 'datalist.list_datalist.search_data_lists',
  ID: 'search_data_list',
};

export const SCROLLABLE_DIV_ID = 'scrollableDatalisDiv';

export const DATA_LIST_CREATION_NLP = {
  PLACEHOLDER: 'landing_page_header.ai_prompt.prompt_description.datalist',
  FAILURE: 'prompt.data_list.failure',
};

export const DATALIST_NORMAL_HEADERS = (isDraft, t) => {
  if (isDraft) {
    return (
      [
        {
          label: t(LIST_HEADER.DATA_LIST.DATALIST_NAME),
          widthWeight: 6,
        }, {
          label: t(LIST_HEADER.DATA_LIST.ADMINS),
          widthWeight: 2,
        }, {
          label: t(LIST_HEADER.DATA_LIST.SAVED_ON),
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
          label: t(LIST_HEADER.DATA_LIST.DATALIST_NAME),
          widthWeight: 4,
          bodyStyleConfig: { isChangeIconColorOnHover: true },
        },
        {
          id: 'Data Description',
          label: t(LIST_HEADER.DATA_LIST.DATALIST_DESC),
          widthWeight: 5,
        },
        {
          id: 'Published On',
          label: 'Published On',
          widthWeight: 1,
        },
      ]
    );
  }
};

export const DATALIST_LISTING_SORT_OPTIONS = () => (
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
      label: 'Datalist Name (ASC)',
      value: 'Datalist Name (ASC)',
      type: 'data_list_name',
      sortBy: 1,
    },
    {
      label: 'Datalist Name (DESC)',
      value: 'Datalist Name (DESC)',
      type: 'data_list_name',
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

export const DATALIST_KEY_ID = (t) => {
  return (
    {
      VALUE: 'value',
      LABEL: 'label',
      SORT_LABEL: 'sortLabel',
      SORT_VALUE: 'sortValue',
      SORT_BY: 'sortBy',
      DL_UUID: 'data_list_uuid',
      SHOWING: t('landing_page_header.common.showing'),
      DATALISTS: t('landing_page_header.common.datalists'),
      SEARCH_PLACEHOLDER: t('landing_page_header.common.search_placeholder'),
    }
  );
};
