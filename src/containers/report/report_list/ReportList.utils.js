import React from 'react';
import cx from 'classnames';
import {
  TableAlignOption,
  Text,
  ETextSize,
  AvatarSizeVariant,
  AvatarGroup,
  EPopperPlacements,
  UserDisplayGroup,
} from '@workhall-pvt-lmt/wh-ui-library';
import styles from './ReportList.module.scss';
import { REPORT_STRINGS } from '../Report.strings';
import jsUtility, { capitalizeEachFirstLetter } from '../../../utils/jsUtility';
import BarChartSquare from '../../../assets/icons/BarChartSquare';
import gClasses from '../../../scss/Typography.module.scss';
import { BS } from '../../../utils/UIConstants';
import CustomUserInfoToolTipNew from '../../../components/form_components/user_team_tool_tip/custom_userinfo_tooltip/CustomUserInfoToolTipNew';
import { constructAvatarOrUserDisplayGroupList } from '../../../utils/UtilityFunctions';
import { USER_TYPE } from '../../landing_page/my_tasks/task_content/task_header/TaskHeader.constants';

export const constructTableHeader = () => {
  const {
    REPORT_LISTINGS: { REPORT_LIST_COLUMN_HEADER },
  } = REPORT_STRINGS();
  return [
    {
      label: REPORT_LIST_COLUMN_HEADER.REPORT_NAME,
      id: 'reportListingReportName',
      widthWeight: 4,
      headerStyleConfig: {
        align: TableAlignOption.LEFT,
      },
      bodyStyleConfig: {
        align: TableAlignOption.LEFT,
        isChangeIconColorOnHover: true,
      },
    },
    {
      label: REPORT_LIST_COLUMN_HEADER.PRIMARY_SOURCE,
      id: 'reportListingPrimarySource',
      widthWeight: 2,
      headerStyleConfig: {
        align: TableAlignOption.LEFT,
      },
      bodyStyleConfig: {
        align: TableAlignOption.LEFT,
      },
    },
    {
      label: REPORT_LIST_COLUMN_HEADER.REPORT_VIEW,
      id: 'reportListingReportView',
      widthWeight: 2,
      headerStyleConfig: {
        align: TableAlignOption.LEFT,
      },
      bodyStyleConfig: {
        align: TableAlignOption.LEFT,
      },
    },
    {
      label: REPORT_LIST_COLUMN_HEADER.ADMINS,
      id: 'reportListingAdmins',
      widthWeight: 2,
      headerStyleConfig: {
        align: TableAlignOption.LEFT,
      },
      bodyStyleConfig: {
        align: TableAlignOption.LEFT,
      },
    },
  ];
};

export const getUserDisplayGroup = (assignee) => {
  const getPopperContent = (id, type, onShow, onHide) => {
      if (assignee?.users?.[0]?.user_type === USER_TYPE.SYSTEM) return null;
      const content = (
              <CustomUserInfoToolTipNew
                  id={id}
                  contentClassName={gClasses.WhiteBackground}
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
  return (
      <UserDisplayGroup
          id="UserDisplayGroup"
          userAndTeamList={constructAvatarOrUserDisplayGroupList(assignee)}
          count={1}
          separator=", "
          popperPlacement={EPopperPlacements.BOTTOM_START}
          getPopperContent={(id, type, onShow, onHide) => getPopperContent(id, type, onShow, onHide)}
          getRemainingPopperContent={(id, type, onShow, onHide) => getPopperContent(id, type, onShow, onHide)}
          className={cx(styles.UserList, gClasses.W100)}
      />
  );
};

export const getAvatarDisplay = (assignee, showCreateTask = true) => {
  if (assignee?.users && assignee?.users.length > 0) {
    const getPopperContent = (id, type, onShow, onHide) => {
      const content = (
        <CustomUserInfoToolTipNew
          id={id}
          contentClassName={gClasses.WhiteBackground}
          type={type}
          onFocus={onShow}
          onBlur={onHide}
          onMouseEnter={onShow}
          onMouseLeave={onHide}
          showCreateTask={showCreateTask}
          isStandardUserMode
        />
      );
      return content;
    };

    return (
      <AvatarGroup
        size={AvatarSizeVariant.sm}
        allAvatarData={constructAvatarOrUserDisplayGroupList(assignee)}
        popperPlacement={EPopperPlacements.BOTTOM_START}
        getPopperContent={(id, type, onShow, onHide) =>
          getPopperContent(id, type, onShow, onHide)
        }
        maxCountLimit={2}
      />
    );
  } else {
    return null;
  }
};

export const constructTableData = (reportList) => {
  if (jsUtility.isEmpty(reportList)) return [];

  const { REPORTVIEW } = REPORT_STRINGS();

  const getEachRow = (eachReport) => {
    const {
      _id,
      report_uuid,
      report_name,
      primary_source_name,
      owners,
      report_config: { report_category },
    } = eachReport;
    const strReportCategoryView = REPORTVIEW.find(
      (rViewData) => rViewData.value === report_category,
    ).label;

    return {
      id: report_uuid,
      component: [
        <div key={`${_id}_1`} className={cx(BS.D_FLEX, BS.ALIGN_ITEM_CENTER)}>
          <div className={gClasses.MR8}>
            <BarChartSquare className={gClasses.MinHW20} width={20} height={20} />
          </div>
          <div
            className={cx(
              BS.D_FLEX,
              BS.FLEX_COLUMN,
              BS.TEXT_LEFT,
              styles.ClassReportColumn,
            )}
            title={report_name}
          >
            <Text
              content={report_name}
              size={ETextSize.MD}
              className={gClasses.Ellipsis}
            />
          </div>
        </div>,
        <div
          key={`${_id}_2`}
          className={cx(
            BS.D_FLEX,
            BS.FLEX_COLUMN,
            BS.TEXT_LEFT,
            styles.ClassReportColumnWithNoLeftPadding,
          )}
          title={primary_source_name}
        >
          <Text
            className={cx(gClasses.Ellipsis)}
            content={primary_source_name}
            size={ETextSize.MD}
          />
        </div>,
        <div
          key={`${_id}_3`}
          className={cx(
            BS.D_FLEX,
            BS.FLEX_COLUMN,
            BS.TEXT_LEFT,
            styles.ClassReportColumnWithNoLeftPadding,
          )}
          title={strReportCategoryView}
        >
          <Text
            className={cx(gClasses.Ellipsis)}
            content={strReportCategoryView}
            size={ETextSize.MD}
          />
        </div>,
        getUserDisplayGroup(owners),
      ],
    };
  };

  const tableBody = reportList.map((eachReport) => getEachRow(eachReport));
  return tableBody;
};

export const constructUsersOrTeams = (data) => {
  const users = data?.users?.map((item) => {
    const label = capitalizeEachFirstLetter(
      `${item?.first_name} ${item?.last_name}`,
    );
    return {
      ...item,
      id: item?._id,
      label,
      name: label,
    };
  });
  const teams = data?.teams?.map((item) => {
    const label = capitalizeEachFirstLetter(`${item?.team_name}`);
    return {
      ...item,
      id: item?._id,
      label,
      name: label,
    };
  });
  return { users, teams };
};
