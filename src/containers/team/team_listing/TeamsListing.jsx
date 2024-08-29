import React, { useEffect, useState, useRef } from 'react';
import { connect, useSelector } from 'react-redux';
import {
  BorderRadiusVariant,
  Button,
  ETextSize,
  TableColumnWidthVariant,
  Text,
  EButtonType,
  colorSchemaDefaultValue,
  Input,
  Size,
  EInputIconPlacement,
  Popper,
  EPopperPlacements,
  DropdownList,
  TableWithInfiniteScroll,
  TableScrollType,
} from '@workhall-pvt-lmt/wh-ui-library';
import { useTranslation } from 'react-i18next';
import gClasses from 'scss/Typography.module.scss';
import cx from 'classnames/bind';
import TeamsIcon from 'assets/icons/teams/TeamsIcon';
import { useHistory, useParams } from 'react-router-dom';
import { isEmpty, get } from 'utils/jsUtility';
import * as ROUTE_CONSTANTS from 'urls/RouteConstants';
import queryString from 'query-string';
import CreateEditTeam from '../create_and_edit_team/CreateEditTeam';
import { TEAMS_STRINGS } from '../teams.strings';
import { EMPTY_STRING } from '../../../utils/strings/CommonStrings';
import styles from './TeamsListing.module.scss';
import { TEAM_CREATE_TEAM } from '../../../urls/RouteConstants';
import {
  createEditDataChange,
  clearCreateEditDetails,
  teamListingDataChange,
} from '../../../redux/reducer/TeamsReducer';
import { getAllTeamsDataThunk } from '../../../redux/actions/Teams.action';
import { ROUTE_METHOD, SORT_BY } from '../../../utils/Constants';
import { TEAM_TABS, getTeamName, getTeamType, isCreateVisible } from '../teams.utils';
import {
  getButtonLabel,
} from '../../landing_page/main_header/common_header/CommonHeader.utils';
import { LANDING_PAGE_TOPICS } from '../../landing_page/main_header/common_header/CommonHeader.strings';
import TeamDetails from '../team_details/TeamDetails';
import NoTeamsFoundIcon from '../../../assets/icons/NoTeamsFound';
import { keydownOrKeypessEnterHandle, routeNavigate, useClickOutsideDetector } from '../../../utils/UtilityFunctions';
import AddIcon from '../../../assets/icons/teams/AddIcon';
import LandingPageSearchIcon from '../../../assets/icons/landing_page/LandingPageSearchIcon';
import LandingSearchExitIcon from '../../../assets/icons/LandingSearchExitIcon';
import { ICON_STRINGS } from '../../../components/list_and_filter/ListAndFilter.strings';
import { ARIA_ROLES } from '../../../utils/UIConstants';
import SortDropdownIcon from '../../../assets/icons/landing_page/SortDropdownIcon';
import { LANDING_PAGE_HEADER_CONSTANT } from '../../landing_page/landing_page_header/LandingPageHeader.string';
import useWindowSize from '../../../hooks/useWindowSize';
import { getLandingListingRowCount } from '../../../utils/generatorUtils';

function TeamsListing(props) {
  const { state, createEditDataChange, clearCreateEditDetails, getAllTeamsDataThunk, teamListingDataChange, isTrialDisplayed } = props;
  const {
    teamsListData,
    teamsCount = 0,
    membersDataCountPerCall,
    membersCurrentPage,
    isTeamDetailModalOpen,
    isTeamListLoading,
    sortBy,
    selectedTabIndex,
    totalTeams,
    sortName,
    hasMore,
    isInitialLoading,
  } = state;
  const { t } = useTranslation();
  const { TEAMS_LISTING, TEAMS_LISTING: { SEARCH, SORT_OPTIONS, SCROLL_ID }, COMMON_STRINGS } = TEAMS_STRINGS(t);
  const { COMMON: { SORT_BY_LABEL } } = LANDING_PAGE_HEADER_CONSTANT(t);
  const [isSearchFocus, setIsSearchFocus] = useState(false);
  const [isSortPopOverVisible, setIsSortPopOverVisible] = useState(false);
  const [teamSearchText, setTeamSearchText] = useState(EMPTY_STRING);
  const sortPopOverTargetRef = useRef(null);
  useClickOutsideDetector(sortPopOverTargetRef, () => setIsSortPopOverVisible(false));
  const [height] = useWindowSize();
  const history = useHistory();
  const { tab } = useParams();
  const Role = useSelector((state) => state.RoleReducer);

  useEffect(() => {
    const params = {
      size: getLandingListingRowCount(height, isTrialDisplayed),
      page: 1,
      is_active: 1,
      sort_by: SORT_BY.ASC,
      sort_field: SORT_BY.NAME,
    };
    if (!isEmpty(teamSearchText)) params.search = teamSearchText;
    const selectedTeam = getTeamType(tab);
    params.team_type = selectedTeam;
    teamListingDataChange({
      isInitialLoading: true,
      isTeamListLoading: true,
      membersCurrentPage: 1,
      selectedTabIndex: selectedTeam.toString(),
    });
    getAllTeamsDataThunk(params);
  }, [teamSearchText, height]);

  useEffect(() => {
    if (history.location.pathname === TEAM_CREATE_TEAM) {
      createEditDataChange({ createEditTeamModalOpen: true });
    }
    const params = {
      size: membersDataCountPerCall,
      page: 1,
      is_active: 1,
      sort_by: SORT_BY.ASC,
      sort_field: SORT_BY.NAME,
    };
    const selectedTeam = getTeamType(tab);
    params.team_type = getTeamType(tab);
    teamListingDataChange({
      isTeamListLoading: true,
      isInitialLoading: true,
      membersCurrentPage: 1,
      sortBy: SORT_BY.ASC,
      sortName: SORT_OPTIONS?.[0].label,
      selectedTabIndex: selectedTeam.toString(),
    });
    setTeamSearchText(EMPTY_STRING);
    setIsSearchFocus(false);
    getAllTeamsDataThunk(params);
  }, [history.location.pathname]);

  // Function displays team icon, name, description
  const teamDataCard = (data) => (
    <div className={gClasses.CenterV}>
      <TeamsIcon className={gClasses.MinHW20} />
      <div className={cx(gClasses.ML12, gClasses.DisplayFlex, gClasses.Ellipsis)}>
        <Text
          size={ETextSize.SM}
          fontClass={cx(gClasses.FontWeight500, gClasses.FTwo12BlackV12)}
          content={data?.teamName}
          className={cx(gClasses.Ellipsis, gClasses.MW15)}
          title={data?.teamName}
        />
        <Text
          size={ETextSize.SM}
          className={cx(gClasses.ML12, { [styles.LeftBorder]: data?.description }, gClasses.Ellipsis, gClasses.MW30)}
          fontClass={gClasses.FTwo12GrayV101}
          content={data?.description}
          title={data?.description}
        />
      </div>
    </div>
  );

  // Function displays team membersCount
  const membersCount = (data) => (
    <div className={cx(gClasses.CursorPointer)}>
      <div className={cx(gClasses.ML5)}>
        {(data?.totalMemberUsersCount || 0) + (data?.totalMemberTeamsCount || 0)}
      </div>
    </div>
  );

  // teamDetails Component
  const teamDetails = (
    <TeamDetails
      isModalOpen={isTeamDetailModalOpen}
      selectedTeamId={tab}
    />
  );

  // Specifies a table rows
  const getMembersRowData = () => {
    const rows = [];
    teamsListData?.forEach((team) => {
      const rowData = { component: [], id: EMPTY_STRING };
      rowData.component.push(teamDataCard(team));
      rowData.component.push(membersCount(team));
      rowData.id = team?._id;
      rows.push(rowData);
    });
    return rows;
  };

  // Teams Listing Row click handler
  const displayTeamDetails = (id) => {
    if (isEmpty(id)) return;
    const teamPathname = `${ROUTE_CONSTANTS.TEAMS}/${id}`;
    routeNavigate(history, ROUTE_METHOD.PUSH, teamPathname);
  };

  // Close create team modal handler
  const onCloseCreateEditModal = () => {
    history.goBack();
    clearCreateEditDetails();
  };

  // Infinite Pagination add change
  const handleLoadMorePageChange = () => {
    const params = {
      size: membersDataCountPerCall,
      page: membersCurrentPage + 1,
      is_active: 1,
      sort_by: sortBy,
      sort_field: SORT_BY.NAME,
    };
    params.team_type = getTeamType(tab);
    getAllTeamsDataThunk(params, true);
    teamListingDataChange({
      membersCurrentPage: membersCurrentPage + 1,
      isTeamListLoading: true,
    });
  };

  // Listing sort handler
  const onSortHandler = (sortOrder, sortOrderName) => {
    const params = {
      size: membersDataCountPerCall,
      page: membersCurrentPage,
      is_active: 1,
      team_type: getTeamType(tab),
      sort_field: SORT_BY.NAME,
    };
    params.sort_by = sortOrder;
    teamListingDataChange({
      isTeamListLoading: true,
      sortBy: sortOrder,
      sortName: sortOrderName,
    });
    getAllTeamsDataThunk(params);
  };

  // Showing Results
  const showingResultsText = (
    <Text
      content={`${TEAMS_STRINGS(t).TEAMS_LISTING.SHOWING} ${teamsCount} ${getTeamName(tab, t)} ${teamsCount === 1 ? TEAMS_STRINGS(t).TEAMS_LISTING.TEAM : TEAMS_STRINGS(t).TEAMS_LISTING.TEAMS}`}
      className={cx(gClasses.FTwo12GrayV98, gClasses.FontWeight500)}
      isLoading={isTeamListLoading}
    />
  );

  // Create Button click
  const createTeamButton = (noData) => (
    <Button
      type={noData ? EButtonType.PRIMARY : EButtonType.SECONDARY}
      className={cx(gClasses.PX12, styles.CreateTeamButton)}
      icon={<AddIcon />}
      colorSchema={colorSchemaDefaultValue}
      buttonText={TEAMS_STRINGS(t).TEAMS_LISTING.CREATE_TEAM}
      onClick={() => {
        clearCreateEditDetails();
        const currentParams = queryString.parseUrl(history.location.pathname);
        let newParams = { ...get(currentParams, ['query'], {}) };
        newParams = { ...newParams, create: 'teams' };
        const search = new URLSearchParams(newParams).toString();
        routeNavigate(history, ROUTE_METHOD.PUSH, EMPTY_STRING, search);
      }}
      ariaLabel={getButtonLabel(t(LANDING_PAGE_TOPICS.TEAMS), t)}
    />
  );

  const createTeamInfo = (
    <div className={cx(gClasses.DFlexCenter, gClasses.FlexDirectionColumn)}>
      {totalTeams === 0 && <Text size={ETextSize.SM} className={gClasses.FTwo12BlackV21} content={TEAMS_LISTING.CREATE_FIRST_TEAM} />}
      <div className={gClasses.MT24}>{createTeamButton(true)}</div>
    </div>
  );

  // Search Team Change
  const onSearchChangeHandler = (event) => {
    const { value } = event.target;
    setTeamSearchText(value);
  };

  // Search Icon
  const getSearchIcon = () => (
    <button
      aria-label={SEARCH}
      className={gClasses.CenterV}
      onClick={() => setIsSearchFocus(!isSearchFocus)}
    >
      <LandingPageSearchIcon />
    </button>
  );

  // Sort teams
  const getSortPopper = () => (
    <Popper
      targetRef={sortPopOverTargetRef}
      open={isSortPopOverVisible}
      placement={EPopperPlacements.BOTTOM_START}
      className={gClasses.ZIndex10}
      content={
          <DropdownList
            optionList={SORT_OPTIONS}
            onClick={onSortHandler}
            selectedValue={sortBy}
          />
        }
    />
  );

  const isTeamDetailsOpen =
    !([
      TEAM_TABS.ORGANISATIONAL,
      TEAM_TABS.CREATE,
      TEAM_TABS.EDIT,
      TEAM_TABS.PRIVATE,
      TEAM_TABS.SYSTEM,
    ].includes(tab));
  let currentComponent = null;
  if (isTeamDetailsOpen) {
    currentComponent = teamDetails;
  } else {
    currentComponent = (
      <>
        <CreateEditTeam onCloseClick={onCloseCreateEditModal} />
        <div className={cx(styles.ListingTable)}>
          <div className={cx(gClasses.CenterV, gClasses.JusSpaceBtw, gClasses.MX24, gClasses.PT16, gClasses.PB16)}>
            {showingResultsText}
            <div className={cx(gClasses.Gap16, gClasses.CenterV, gClasses.JusEnd)}>
              <div className={gClasses.M16}>
                <Input
                  content={teamSearchText || EMPTY_STRING}
                  prefixIcon={getSearchIcon()}
                  onChange={onSearchChangeHandler}
                  onFocusHandler={() => setIsSearchFocus(true)}
                  onBlurHandler={() => setIsSearchFocus(false)}
                  iconPosition={EInputIconPlacement.left}
                  className={cx(styles.SearchOuterContainer, { [styles.ExpandedSearch]: isSearchFocus })}
                  placeholder={SEARCH}
                  size={Size.md}
                  suffixIcon={
                    teamSearchText && (
                      <LandingSearchExitIcon
                        title={ICON_STRINGS.CLEAR}
                        className={cx(styles.SearchCloseIcon, gClasses.CursorPointer, gClasses.Width8, gClasses.MR6)}
                        tabIndex={0}
                        height={12}
                        width={12}
                        ariaLabel={ICON_STRINGS.CLEAR}
                        role={ARIA_ROLES.BUTTON}
                        onKeyDown={(e) => keydownOrKeypessEnterHandle(e) && onSearchChangeHandler({ target: { value: EMPTY_STRING } })}
                        onClick={() => onSearchChangeHandler({ target: { value: EMPTY_STRING } })}
                      />
                    )
                  }
                  borderRadiusType={BorderRadiusVariant.rounded}
                />
              </div>
              <div className={gClasses.CenterV}>
                <Text content={SORT_BY_LABEL} className={cx(gClasses.FTwo12GrayV98, gClasses.FontWeight500, gClasses.MR8)} />
                <button onClick={() => setIsSortPopOverVisible((prevState) => !prevState)} ref={sortPopOverTargetRef} className={cx(gClasses.FTwo12BlueV39, gClasses.FontWeight500, styles.SortContainer, gClasses.gap8, gClasses.CenterV)}>
                  {sortName}
                  <SortDropdownIcon />
                  {getSortPopper()}
                </button>
              </div>
            </div>
          </div>
          {teamsCount === 0 && !isTeamListLoading ? (
            <div className={cx(gClasses.CenterVH, gClasses.FlexDirectionColumn)}>
              <NoTeamsFoundIcon />
              <Text size={ETextSize.LG} className={cx(gClasses.FontWeight500)} content={COMMON_STRINGS.NO_TEAMS_FOUND} />
              {Role.role !== 2 && isCreateVisible(selectedTabIndex) && createTeamInfo}
            </div>
          ) :
            <div id={SCROLL_ID} className={cx(styles.TableTaskContainer, { [styles.TableTrialContainer]: isTrialDisplayed }, gClasses.W100)}>
              <TableWithInfiniteScroll
                scrollableId={SCROLL_ID}
                tableClassName={cx(styles.TeamTable, gClasses.W100)}
                header={TEAMS_LISTING.TABLE_HEADERS}
                data={getMembersRowData()}
                isLoading={isInitialLoading}
                isRowClickable
                onRowClick={displayTeamDetails}
                scrollType={TableScrollType.BODY_SCROLL}
                hasMore={hasMore}
                onLoadMore={handleLoadMorePageChange}
                loaderRowCount={4}
                widthVariant={TableColumnWidthVariant.CUSTOM}
              />
            </div>
          }
        </div>
      </>
    );
  }

  return (
    <div>
      {currentComponent}
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    state: state.TeamsReducer.teamListing,
    isTrialDisplayed: state.NavBarReducer.isTrialDisplayed,
  };
};

const mapDispatchToProps = {
  createEditDataChange,
  clearCreateEditDetails,
  getAllTeamsDataThunk,
  teamListingDataChange,
};

export default connect(mapStateToProps, mapDispatchToProps)(TeamsListing);
