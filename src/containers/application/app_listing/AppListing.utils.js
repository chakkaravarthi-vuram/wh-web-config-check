import React from 'react';
import cx from 'classnames';
import {
  Text,
  ETextSize,
  UTToolTipType,
  EPopperPlacements,
  UserDisplayGroup,
} from '@workhall-pvt-lmt/wh-ui-library';

import moment from 'moment';
import i18next from 'i18next';
import { cloneDeep, isEmpty } from '../../../utils/jsUtility';
import Grid from '../../../assets/icons/application/Grid';
import { BS } from '../../../utils/UIConstants';
import gClasses from '../../../scss/Typography.module.scss';
import Edit from '../../../assets/icons/application/EditV2';
import { EMPTY_STRING } from '../../../utils/strings/CommonStrings';
import styles from './AppListing.module.scss';
import CustomUserInfoToolTipNew from '../../../components/form_components/user_team_tool_tip/custom_userinfo_tooltip/CustomUserInfoToolTipNew';
import {
  APP_LIST_SORT_FIELD_KEYS,
  DEFAULT_APP,
  GET_APP_LIST_COLUMN_LABEL,
} from './AppList.constants';

// Table Related Utils

export const constructDMSURL = (imageId) => {
  let constructServerImageUrl = EMPTY_STRING;
  if (window.location.protocol !== 'https:') {
    constructServerImageUrl = `https://workhall.dev/dms/display/?id=${imageId}`;
  } else {
    constructServerImageUrl = `https://${window.location.hostname}/dms/display/?id=${imageId}`;
  }
  return constructServerImageUrl;
};

export const constructAvatarGroupList = (assignee = {}, createProfilePic = true) => {
  const { users, teams } = assignee;
  const avatarObjectList = [];

  if (!isEmpty(users) && Array.isArray(users)) {
    users.forEach((user) => {
      if (!isEmpty(user)) {
        avatarObjectList.push({
          id: user?._id,
          src: user?.profile_pic || (createProfilePic && constructDMSURL(user?._id)) || EMPTY_STRING,
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
          id: team?._id,
          src: team?.profile_pic || EMPTY_STRING,
          name: team.team_name,
          type: UTToolTipType.team,
        });
      }
    });
  }
  console.log('avatarobjects', avatarObjectList);
  return avatarObjectList;
};

export const constructTableHeader = (
  selectedTabIndex = 1,
  t = i18next.t,
) => {
  const APP_LIST_COLUMN_HEADER = GET_APP_LIST_COLUMN_LABEL(t);

  return [
    {
      label: APP_LIST_COLUMN_HEADER.APP_NAME,
      id: 'app_listing_app_name',
      widthWeight: 3,
    },
    {
      label: APP_LIST_COLUMN_HEADER.ADMINS,
      id: 'app_listing_admins',
      widthWeight: 0.75,
    },
    {
      label:
      selectedTabIndex === 0
          ? APP_LIST_COLUMN_HEADER.PUBLISHED_ON
          : APP_LIST_COLUMN_HEADER.SAVED_ON,
      id: 'app_listing_published_on',
      widthWeight: 0.5,
    },
    {
      label: '',
      id: 'app_listing_actions',
      widthWeight: 0.5,
    },
  ];
};

export const APP_SORT_DROPDOWN_OPTIONS = (t, isDraft) => ([
  {
    label: !isDraft ? 'Published On (DESC)' : 'Saved On (DESC)',
    sortField: APP_LIST_SORT_FIELD_KEYS.LAST_UPDATED_ON,
    sortBy: -1,
    value: !isDraft ? 'Published On (DESC)' : 'Saved On (DESC)',
  }, {
    label: !isDraft ? 'Published On (ASC)' : 'Saved On (ASC)',
    sortField: APP_LIST_SORT_FIELD_KEYS.LAST_UPDATED_ON,
    sortBy: 1,
    value: !isDraft ? 'Published On (ASC)' : 'Saved On (ASC)',
  },
  {
    label: 'App Name (ASC)',
    sortField: APP_LIST_SORT_FIELD_KEYS.NAME,
    sortBy: 1,
    value: 'App Name (ASC)',
  }, {
    label: 'App Name (DESC)',
    sortField: APP_LIST_SORT_FIELD_KEYS.NAME,
    sortBy: -1,
    value: 'App Name (DESC)',
  },
]);

export const constructTableData = (appList = [], onEditApp, selectedTabIndex) => {
  if (isEmpty(appList)) return [];

  const getEachRow = (appDetail = {}) => {
    const getPopperContent = (id, type, onShow, onHide) => {
      const content = (
        <CustomUserInfoToolTipNew
          id={id}
          contentClassName={styles.bgWhite}
          type={type}
          onFocus={onShow}
          onBlur={onHide}
          onMouseEnter={onShow}
          onMouseLeave={onHide}
          showCreateTask
        />
      );
      return content;
    };

    return {
      id: appDetail._id,
      component: [
        <div className={cx(gClasses.CenterV)}>
          <div className={gClasses.MR8}>
            <Grid className={gClasses.MinHW20} />
          </div>
          <Text
            content={appDetail.name}
            size={ETextSize.MD}
            className={cx(gClasses.width60ch, gClasses.Ellipsis)}
          />
        </div>,
        // (<AvatarGroup
        //     allAvatarData={constructAvatarGroupList(appDetail.admins)}
        //     maxCountLimit={5}
        //     getPopperContent={popperContent}
        //     size={AvatarSizeVariant.xs}
        //     popperPlacement={EPopperPlacements.LEFT_START}
        //     className={gClasses.WidthFitContent}
        // />),
        <UserDisplayGroup
          userAndTeamList={constructAvatarGroupList(appDetail.admins)}
          count={1}
          separator=", "
          popperPlacement={EPopperPlacements.BOTTOM_START}
          getPopperContent={(id, type, onShow, onHide) =>
            getPopperContent(id, type, onShow, onHide)
          }
          getRemainingPopperContent={(id, type, onShow, onHide) =>
            getPopperContent(id, type, onShow, onHide)
          }
        />,
        <Text
          className={cx(gClasses.WidthFitContent, gClasses.WhiteSpaceNoWrap)}
          content={`V${appDetail?.version || 0}, ${moment(selectedTabIndex === 0 ?
            appDetail?.published_on?.pref_tz_datetime :
            appDetail?.last_updated_on?.pref_tz_datetime,
          ).format('DD MMM YYYY')}`}
          size={ETextSize.MD}
        />,
        <div className={cx(BS.W100, BS.D_FLEX, BS.JC_END)}>
          {appDetail.name !== DEFAULT_APP && appDetail?.can_edit_app && (
          <button
            className={gClasses.PR16}
            onClick={() => onEditApp(appDetail?.app_uuid)}
          >
            <Edit className={styles.EditIcon} />
          </button>
          )}
        </div>,
      ],
    };
  };

  const tableBody = appList.map((eachApp) => getEachRow(eachApp));
  return tableBody;
};

export const setAppOrderData = (appListDetails) => {
  const appDetails = cloneDeep(appListDetails);
  const orderData = [];
  appDetails?.forEach((app, index) => {
    const appObj = {};
    appObj.id = app.app_uuid;
    appObj.order = index;
    appObj.text = app.name;
    orderData.push(appObj);
  });
  return orderData;
};
