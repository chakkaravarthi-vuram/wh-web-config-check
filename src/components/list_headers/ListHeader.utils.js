import React from 'react';
import gClasses from 'scss/Typography.module.scss';
import { translateFunction } from 'utils/jsUtility';
import LIST_HEADER from './ListHeader.strings';
import { TASK_TAB_INDEX } from '../../containers/landing_page/LandingPage.strings';
import { FLOW_DROPDOWN, FLOW_MANAGED_BY_TYPE } from '../../containers/flow/listFlow/listFlow.strings';
import { DATA_LIST_DROPDOWN } from '../../containers/data_list/listDataList/listDataList.strings';
import { EMPTY_STRING } from '../../utils/strings/CommonStrings';

export const getTaskHeader = (t = translateFunction, tabIndex, isCompletedTask = false) => {
    if (tabIndex === TASK_TAB_INDEX.OPEN) {
        return [
            {
                label: t(LIST_HEADER.TASK.TASK_NAME),
            }, {
                label: t(LIST_HEADER.TASK.CREATED_BY),
            }, {
                label: t(LIST_HEADER.TASK.ASSIGNED_ON),
            }, {
                label: t(LIST_HEADER.TASK.DUE_DATE),
            },
        ];
    } else if (tabIndex === TASK_TAB_INDEX.SNOOZED_TASK) {
        return [
            {
                label: t(LIST_HEADER.TASK.TASK_NAME),
            }, {
                label: t(LIST_HEADER.TASK.SNOOZED_UNTIL),
            }, {
                label: t(LIST_HEADER.TASK.CREATED_ON),
            }, {
                label: <div className={gClasses.ML8}>{t(LIST_HEADER.TASK.DUE_DATE)}</div>,
            },
        ];
    } else if (tabIndex === TASK_TAB_INDEX.ASSIGNED_TO_OTHERS) {
        if (isCompletedTask) {
            return [
                {
                    label: t(LIST_HEADER.TASK.TASK_NAME),
                }, {
                    label: t(LIST_HEADER.TASK.ASSIGNED_TO),
                }, {
                    label: t(LIST_HEADER.TASK.ASSIGNED_ON),
                }, {
                    label: <div className={gClasses.ML8}>{t(LIST_HEADER.TASK.COMPLETED_ON)}</div>,
                },
            ];
        } else {
            return [
                {
                    label: t(LIST_HEADER.TASK.TASK_NAME),
                }, {
                    label: t(LIST_HEADER.TASK.ASSIGNED_TO),
                }, {
                    label: t(LIST_HEADER.TASK.ASSIGNED_ON),
                }, {
                    label: <div className={gClasses.ML8}>{t(LIST_HEADER.TASK.DUE_DATE)}</div>,
                },
           ];
        }
    } else if (tabIndex === TASK_TAB_INDEX.COMPLETED) {
        return [
            {
                label: t(LIST_HEADER.TASK.TASK_NAME),
            }, {
                label: t(LIST_HEADER.TASK.ASSIGNED_TO),
            }, {
                label: t(LIST_HEADER.TASK.COMPLETED_ON),
            },
        ];
    } else if (tabIndex === TASK_TAB_INDEX.DRAFT_TASK) {
        return [
            {
                label: t(LIST_HEADER.TASK.TASK_NAME),
            }, {
                label: t(LIST_HEADER.TASK.ASSIGNED_TO),
            }, {
                label: t(LIST_HEADER.TASK.LAST_EDITED_ON),
            }, {
                label: EMPTY_STRING,
            },
        ];
    } else return [null, null, null, null, null];
};

export const getFlowHeader = (t, tabIndex, subTabIndex) => {
    if (
        [FLOW_DROPDOWN.PUBLISHED_FLOW, FLOW_DROPDOWN.UNDER_TESTING].includes(tabIndex) &&
        [FLOW_MANAGED_BY_TYPE.VALUE_MANAGED_BY_YOU, FLOW_MANAGED_BY_TYPE.VALUE_MANAGED_BY_OTHERS].includes(subTabIndex)
       ) {
      return [
          t(LIST_HEADER.FLOW.FLOW_NAME),
          t(LIST_HEADER.FLOW.ADMINS),
          t(LIST_HEADER.FLOW.PUBLISHED_ON),
    ];
   } else if (tabIndex === FLOW_DROPDOWN.DRAFT_FLOW) {
      return [
        {
            Header: ' ',
            columns: [
                {
                    Header: t(LIST_HEADER.FLOW.FLOW_NAME),
                    accessor: 'flow_name',
                }, {
                    Header: t(LIST_HEADER.FLOW.ADMINS),
                    accessor: 'admins',
                }, {
                    Header: <div className={gClasses.ML8}>{t(LIST_HEADER.FLOW.SAVED_ON)}</div>,
                    accessor: 'saved_on',
                },
            ],
        },
    ];
   } else return [null, null, null, null];
};

export const getDataListHeader = (t, tabIndex) => {
   if (tabIndex === DATA_LIST_DROPDOWN.ALL_DATA_LIST) {
      return [
          t(LIST_HEADER.DATA_LIST.DATALIST_NAME),
          null,
          null,
          LIST_HEADER.DATA_LIST.ACTION,
    ];
   } else if (tabIndex === DATA_LIST_DROPDOWN.DATA_LIST_I_OWN) {
      return [
          t(LIST_HEADER.DATA_LIST.DATALIST_NAME),
          t(LIST_HEADER.DATA_LIST.ADMINS),
          LIST_HEADER.DATA_LIST.PUBLISHED_ON,
          LIST_HEADER.DATA_LIST.ACTIONS,
    ];
   } else if (tabIndex === DATA_LIST_DROPDOWN.DRAFT_DATA_LIST) {
      return [
        {
            Header: ' ',
            columns: [
                {
                    Header: t(LIST_HEADER.DATA_LIST.DATALIST_NAME),
                    accessor: 'dlName',
                }, {
                    Header: t(LIST_HEADER.DATA_LIST.ADMINS),
                    accessor: 'admins',
                }, {
                    Header: <div className={gClasses.ML8}>{t(LIST_HEADER.DATA_LIST.SAVED_ON)}</div>,
                    accessor: 'savedOn',
                },
            ],
        },
    ];
   } else return [null, null, null, null];
};
