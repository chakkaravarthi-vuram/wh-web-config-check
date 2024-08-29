import React from 'react';
import AllFlowsIcon from 'assets/icons/flow/AllFlowsIcon';
import DraftFlow from 'assets/icons/flow/DraftFlow';
import {
  ADMIN_ACCOUNTS_ACCOUNTS,
  ADMIN_ACCOUNTS_SUMMARY,
} from 'urls/RouteConstants';
import ADMIN_ACCOUNTS_STRINGS from './AdminPages.string';

export const ADMIN_ACCOUNTS_DROPDOWN = {
  ID: 'ADMIN_ACCOUNTS_TAB_ID',
  OPTION_LIST: [
    {
      label: ADMIN_ACCOUNTS_STRINGS.ACCOUNTS.LABEL,
      value: ADMIN_ACCOUNTS_STRINGS.ACCOUNTS.TAB_INDEX,
      icon: <AllFlowsIcon />,
    },
    {
      label: ADMIN_ACCOUNTS_STRINGS.DASHBOARD.LABEL,
      value: ADMIN_ACCOUNTS_STRINGS.DASHBOARD.TAB_INDEX,
      icon: <DraftFlow />,
    },
  ],
};

export const getAdminAccountsUrl = (tabIndex) => {
  if (tabIndex === ADMIN_ACCOUNTS_STRINGS.ACCOUNTS.TAB_INDEX) {
    return ADMIN_ACCOUNTS_ACCOUNTS;
  }
  if (tabIndex === ADMIN_ACCOUNTS_STRINGS.DASHBOARD.TAB_INDEX) {
    return ADMIN_ACCOUNTS_SUMMARY;
  }
  return null;
};

const getAdminAccountsNavbarOptions = (tab_index, t) => [
  {
    label: t && t(ADMIN_ACCOUNTS_STRINGS.ACCOUNTS.LABEL),
    value: ADMIN_ACCOUNTS_STRINGS.ACCOUNTS.TAB_INDEX,
    icon: (
      <AllFlowsIcon
        isSelected={tab_index === ADMIN_ACCOUNTS_STRINGS.ACCOUNTS.TAB_INDEX}
      />
    ),
  },
  {
    label: t && t(ADMIN_ACCOUNTS_STRINGS.DASHBOARD.LABEL),
    value: ADMIN_ACCOUNTS_STRINGS.DASHBOARD.TAB_INDEX,
    icon: (
      <DraftFlow
        isSelected={tab_index === ADMIN_ACCOUNTS_STRINGS.DASHBOARD.TAB_INDEX}
      />
    ),
  },
];

export default getAdminAccountsNavbarOptions;
