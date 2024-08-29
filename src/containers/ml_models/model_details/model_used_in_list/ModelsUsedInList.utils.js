import React from 'react';
import cx from 'classnames';
import {
  Text,
  ETextSize,
  UTToolTipType,
  TableSortOrder,
} from '@workhall-pvt-lmt/wh-ui-library';

import i18next from 'i18next';
import { cloneDeep, isEmpty } from '../../../../utils/jsUtility';
import MLModelIcon from '../../../../assets/icons/side_bar/MLModelIcon';
import { BS } from '../../../../utils/UIConstants';
import gClasses from '../../../../scss/Typography.module.scss';
import Edit from '../../../../assets/icons/application/EditV2';
import { EMPTY_STRING } from '../../../../utils/strings/CommonStrings';
import styles from './ModelsUsedInList.module.scss';
import {
  APP_LIST_SORT_FIELD_KEYS,
} from './ModelsUsedInList.constants';
import { GET_MODELS_USED_IN_LIST_COLUMN_LABEL } from './ModelsUsedInList.strings';
import { SORT_BY } from '../../../../utils/Constants';

// Table Related Utils
export const constructAvatarGroupList = (assignee = {}) => {
  const { users, teams } = assignee;
  const avatarObjectList = [];

  if (!isEmpty(users) && Array.isArray(users)) {
    users.forEach((user) => {
      if (!isEmpty(user)) {
        avatarObjectList.push({
          id: user?.flow_uuid,
          src: user?.profile_pic || EMPTY_STRING,
          name: [user.first_name, user.last_name].join(' '),
          email: user.email || EMPTY_STRING,
          type: UTToolTipType.user,
        });
      }
    });
  }

  if (!isEmpty(teams) && Array.isArray(teams)) {
    teams.forEach((team) => {
      if (!isEmpty(team)) {
        avatarObjectList.push({
          id: team?.flow_uuid,
          src: team?.profile_pic || EMPTY_STRING,
          name: team.team_name,
          type: UTToolTipType.team,
        });
      }
    });
  }

  return avatarObjectList;
};

export const constructTableHeader = (
  // selectedTabIndex = 1,
  t = i18next.t,
  fieldkey = null,
  sortOrder = SORT_BY.ASC,
) => {
  // const APP_LIST_COLUMN_HEADER = GET_APP_LIST_COLUMN_LABEL(t);
  const MODELS_USED_IN_LIST_COLUMN_HEADER = GET_MODELS_USED_IN_LIST_COLUMN_LABEL(t);
  const sort_order =
    sortOrder === SORT_BY.ASC ? TableSortOrder.ASC : TableSortOrder.DESC;
  return [
    {
      label: MODELS_USED_IN_LIST_COLUMN_HEADER.FLOW_NAME,
      id: 'flow_listing_flow_name',
      widthWeight: 3,
      sortBy: APP_LIST_SORT_FIELD_KEYS.NAME,
      sortOrder: sort_order,
      active: fieldkey === APP_LIST_SORT_FIELD_KEYS.NAME,
    },
    {
      label: MODELS_USED_IN_LIST_COLUMN_HEADER.STEP_NAME,
      id: 'flow_listing_admins',
      widthWeight: 0.75,
      sortBy: APP_LIST_SORT_FIELD_KEYS.ADMINS,
      sortOrder: sort_order,
      active: fieldkey === APP_LIST_SORT_FIELD_KEYS.ADMINS,
    },
    {
      label: '',
      id: 'flow_listing_actions',
      widthWeight: 0.5,
    },
  ];
};

// export const constructTableData = (modelFlow = [], onEditModel, selectedTabIndex) => {
  export const constructTableData = (modelFlow = [], onEditModel) => {
  if (isEmpty(modelFlow)) return [];

  const getEachRow = (flowDetail = {}) => {
    return {
      id: flowDetail.flow_uuid,
      component: [
        <div className={cx(gClasses.CenterV)}>
          <div>
            <MLModelIcon />
          </div>
          <Text
            content={flowDetail.flow_name}
            size={ETextSize.MD}
            className={cx(gClasses.ML18, gClasses.width60ch, gClasses.Ellipsis)}
          />
        </div>,
        <Text
        className={cx(gClasses.WidthFitContent, gClasses.WhiteSpaceNoWrap)}
        content={flowDetail.step_name}
        size={ETextSize.MD}
        />,
        <div className={cx(BS.W100, BS.D_FLEX, BS.JC_END)}>
          <button
            className={gClasses.PR16}
            onClick={() => onEditModel(flowDetail?.flow_uuid)}
          >
            <Edit className={styles.EditIcon} />
          </button>
        </div>,
      ],
    };
  };

  const tableBody = modelFlow.map((eachApp) => getEachRow(eachApp));
  return tableBody;
};

export const setAppOrderData = (modelFlowDetails) => {
  const flowDetails = cloneDeep(modelFlowDetails);
  const orderData = [];
  flowDetails?.forEach((flow, index) => {
    const flowObj = {};
    flowObj.id = flow.flow_uuid;
    flowObj.order = index;
    flowObj.text = flow.step_name;
    orderData.push(flowObj);
  });
  return orderData;
};
