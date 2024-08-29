import { useTranslation } from 'react-i18next';
import {
  ETitleHeadingLevel,
  ETitleSize,
  TableSortOrder,
  TableWithPagination,
  Title,
  Input as InputComponent,
  EInputIconPlacement,
  BorderRadiusVariant,
  Text,
  ETextSize,
  Avatar,
  AvatarSizeVariant,
  TableColumnWidthVariant,
  ButtonContentVaraint,
  PaginationButtonPlacement,
  Size,
  Chip,
} from '@workhall-pvt-lmt/wh-ui-library';
import React, { useEffect, useState } from 'react';
import gClasses from 'scss/Typography.module.scss';
import cx from 'classnames/bind';
import jsUtils from 'utils/jsUtility';
import { cloneDeep } from 'lodash';
import { TEAMS_STRINGS } from '../../teams.strings';
import styles from '../TeamDetails.module.scss';
import { CHIP_COLOR, SORT_BY } from '../../../../utils/Constants';
import SearchIconNew from '../../../../assets/icons/SearchIconNew';
import {
  EMPTY_STRING,
  TEAM_TYPE_STRINGS,
  USER_TYPE_STRINGS,
} from '../../../../utils/strings/CommonStrings';
import { TABLE_ROW_COUNT } from '../../../application/app_components/task_listing/TaskList.constants';
import NoSearchIcon from '../../../../assets/icons/teams/NoSearchIcon';
import { getTableTeamsHeader } from '../../teams.utils';
import { isMobileScreen, onWindowResize } from '../../../../utils/UtilityFunctions';

function TeamMembersList(props) {
  const {
    selectedTeamId,
    teamsDetails,
    isNormalMode,
    colorScheme,
    membersList,
    teamDetailsDataChange,
    getTeamMembersListThunk,
  } = props;
  const {
    membersTotalItemsCount,
    membersDataCountPerCall,
    membersCurrentPage,
    teamSearchText,
    isTeamMembersListLoading,
    sortBy,
    sortField,
  } = teamsDetails;
  const { t } = useTranslation();
  const [headerTableData, setHeaderTableData] = useState(
    getTableTeamsHeader(t),
  );
  const [isMobileView, setMobileView] = useState(isMobileScreen());
  const { SHOWING, OF, SEARCH } = TEAMS_STRINGS(t).TEAMS_LISTING;
  const { NO_DATA, NO_DATA_SUBTITLE } = TEAMS_STRINGS(t).COMMON_STRINGS;

  const [isSearchFocus, setIsSearchFocus] = useState(false);

  const windowResize = () => {
    setMobileView(isMobileScreen());
};

useEffect(() => {
    onWindowResize(windowResize);
    return () => window.removeEventListener('resize', windowResize);
  });

  // Handles Members Page change
  const handlePageChange = (currentPage) => {
    if (membersCurrentPage === currentPage) return;
    const params = {
      _id: selectedTeamId,
      size: membersDataCountPerCall,
      page: currentPage,
      sort_by: sortBy,
      sort_field: sortField,
    };
    if (!jsUtils.isEmpty(teamSearchText)) params.search = teamSearchText;
    teamDetailsDataChange({
      membersCurrentPage: currentPage,
      isTeamMembersListLoading: true,
    });
    getTeamMembersListThunk(params);
  };

  // Team first column Data
  const teamDataCard = (data) => (
    <div className={gClasses.CenterV}>
      <Avatar
        size={AvatarSizeVariant.md}
        name={data?.name}
        id={data?.name}
        src={data?.profile_pic}
        colorScheme={isNormalMode && colorScheme}
        type={data?.memberType}
      />
      <div className={gClasses.ML12}>
        <Text
          size={ETextSize.SM}
          fontClass={cx(gClasses.FontWeight500, gClasses.FTwo12GrayV89)}
          content={data?.name}
        />
        <Text
          size={ETextSize.SM}
          fontClass={gClasses.FTwo12GrayV86}
          content={data?.email}
        />
      </div>
    </div>
  );

  // Table row members
  const getMembersRowData = () => {
    const rows = [];
    membersList?.forEach((team) => {
      const rowData = { component: [], id: EMPTY_STRING };
      rowData.component.push(teamDataCard(team));
      rowData.component.push(
        <Chip
        textClassName={gClasses.FontSize12}
        textColor={team.userType === 1 ? CHIP_COLOR.BLUE_10 : CHIP_COLOR.BLACK_10}
        backgroundColor={team.userType === 1 ? CHIP_COLOR.BLUE_01 : CHIP_COLOR.GRAY_10}
        text={
          USER_TYPE_STRINGS[team.userType] ||
          TEAM_TYPE_STRINGS[team.teamType]
        }
        borderRadiusType={BorderRadiusVariant.circle}
        className={gClasses.WhiteSpaceNoWrap}
        />,
      );
      rowData.id = team?._id;
      rows.push(rowData);
    });
    return rows;
  };

  // Showing Results data
  const showingResultsText = (
    <Title
      content={`${TEAMS_STRINGS(t).TEAMS_LISTING.SHOWING} ${
        membersTotalItemsCount || 0
      } ${membersTotalItemsCount === 1 ? TEAMS_STRINGS(t).TEAMS_LISTING.MEMBER : TEAMS_STRINGS(t).TEAMS_LISTING.MEMBERS}`}
      size={ETitleSize.xs}
      headingLevel={ETitleHeadingLevel.h5}
      className={styles.ResultText}
    />
  );

  // Sort Table handle
  const onSortHandler = (fieldKey = null, sortOrder = TableSortOrder.ASC) => {
    const sort_order =
      sortOrder === TableSortOrder.ASC ? SORT_BY.DESC : SORT_BY.ASC;
    const params = {
      _id: selectedTeamId,
      size: membersDataCountPerCall,
      page: membersCurrentPage,
    };
    params.sort_by = sort_order;
    params.sort_field = fieldKey;
    const headerData = cloneDeep(headerTableData);
    if (fieldKey === getTableTeamsHeader()[1].sortBy) {
      headerData[1].sortOrder =
        sortOrder === TableSortOrder.ASC
          ? TableSortOrder.DESC
          : TableSortOrder.ASC;
      headerData[1].active = true;
      headerData[0].active = false;
    } else {
      headerData[0].sortOrder =
        sortOrder === TableSortOrder.ASC
          ? TableSortOrder.DESC
          : TableSortOrder.ASC;
      headerData[0].active = true;
      headerData[1].active = false;
    }
    setHeaderTableData(headerData);
    if (!jsUtils.isEmpty(teamSearchText)) params.search = teamSearchText;
    teamDetailsDataChange({
      isTeamMembersListLoading: true,
      sortBy: sort_order,
      sortField: fieldKey,
    });
    getTeamMembersListThunk(params);
  };

  const getSearchIcon = () => (
    <button
      aria-label={SEARCH}
      className={styles.SearchIcon}
      onClick={() => setIsSearchFocus(!isSearchFocus)}
    >
      <SearchIconNew />
    </button>
  );

  // On Search member handle
  const onChangeHandler = (event) => {
    const params = {
      _id: selectedTeamId,
      size: membersDataCountPerCall,
      page: 1,
      sort_by: sortBy,
      sort_field: sortField,
    };
    if (!jsUtils.isEmpty(event.target.value)) params.search = event.target.value;
    teamDetailsDataChange({
      teamSearchText: event.target.value,
      isTeamMembersListLoading: true,
      membersCurrentPage: 1,
    });
    getTeamMembersListThunk(params);
  };

  return (
    <div className={cx(gClasses.PT10, gClasses.PX20)}>
      <div className={cx(gClasses.CenterVSpaceBetween, gClasses.PB10, styles.MembersHeader)}>
        {showingResultsText}
        {isSearchFocus ? (
          <div className={gClasses.M16}>
            <InputComponent
              content={teamSearchText || EMPTY_STRING}
              prefixIcon={getSearchIcon()}
              onChange={onChangeHandler}
              iconPosition={EInputIconPlacement.left}
              placeholder={SEARCH}
              size={Size.md}
              borderRadiusType={BorderRadiusVariant.rounded}
            />
          </div>
        ) : (
          getSearchIcon()
        )}
      </div>
      {!jsUtils.isEmpty(teamSearchText) && membersList?.length === 0 ? (
        <div className={cx(gClasses.TextAlignCenter, gClasses.MT30)}>
          <NoSearchIcon />
          <div className={cx(gClasses.FTwoBlackV12, gClasses.MT30)}>
            {NO_DATA}
          </div>
          <div className={gClasses.FTwoGrayV104}>{NO_DATA_SUBTITLE}</div>
        </div>
      ) : (
        <TableWithPagination
          tableClassName={styles.TableManageMember}
          header={headerTableData}
          data={getMembersRowData()}
          isLoading={isTeamMembersListLoading}
          onSortClick={onSortHandler}
          widthVariant={TableColumnWidthVariant.CUSTOM}
          colorScheme={isNormalMode && colorScheme}
          paginationProps={{
            totalItemsCount: membersTotalItemsCount,
            itemsCountPerPage:
              membersDataCountPerCall || TABLE_ROW_COUNT.PAGINATED,
            activePage: membersCurrentPage,
            constructItemsCountMessage: (itemStart, itemEnd, totalCount) =>
              `${SHOWING} ${itemStart} - ${itemEnd} ${OF} ${totalCount}`,
            prevAndNextButtonContentVariant: ButtonContentVaraint.icon,
            prevAndNextButtonPlacement: PaginationButtonPlacement.connected,
            shape: BorderRadiusVariant.square,
            onChange: (_event, page) => handlePageChange(page),
            totalBoxes: isMobileView ? 3 : 7,
            breakPoint: isMobileView ? 1 : 4,
          }}
        />
      )}
    </div>
  );
}

export default TeamMembersList;
