const ADMIN_ACCOUNTS_SUMMARY_STRINGS = {
  GRANULARITY: {
    OPTION_LIST: (customElement, t) => [
      {
        value: 'hour',
        label: t && t('super_admin.account_details.accounts_summary.granularity.daily'),
      },
      {
        value: 'day',
        label: t && t('super_admin.account_details.accounts_summary.granularity.weekly'),
      },
      {
        value: 'month',
        label: t && t('super_admin.account_details.accounts_summary.granularity.monthly'),
      },
      {
        value: 'year',
        label: t && t('super_admin.account_details.accounts_summary.granularity.yearly'),
      },
      {
        value: 'custom',
        label: t && t('super_admin.account_details.accounts_summary.granularity.custom'),
        element: customElement,
      },
    ],
    CUSTOM_LABEL: 'super_admin.account_details.accounts_summary.granularity.custom',
    ADD_FILTER: 'super_admin.account_details.accounts_summary.granularity.add_filter',
  },
  ACTION_PER_SESSION: {
    ID: 'ACTION_PER_SESSION',
    TITLE: 'super_admin.account_details.accounts_summary.action_per_session',
  },
  SESSION_COUNT: {
    ID: 'SESSION_COUNT',
    TITLE: 'super_admin.account_details.accounts_summary.session_count',
  },
  ACTIVE_USER_COUNT: {
    ID: 'ACTIVE_USER_COUNT',
    TITLE: 'super_admin.account_details.accounts_summary.active_user_per_count',
  },
  RETENTION_RATE: {
    ID: 'RETENTION_RATE',
    TITLE: 'super_admin.account_details.accounts_summary.retention_rate',
  },
};

export const chartColorPallet = [
  '#003060',
  '#228B22',
  '#A9CC00',
  '#FFA500',
  '#055C9D',
  '#2BB02B',
  '#C4E500',
  '#FFB52E',
  '#0E86D4',
  '#3ACF3A',
  '#DFFF00',
  '#FFC55C',
];

export default ADMIN_ACCOUNTS_SUMMARY_STRINGS;
