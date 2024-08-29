import React, { useContext, useEffect } from 'react';
import { connect } from 'react-redux';
import jsUtils from 'utils/jsUtility';
import cx from 'classnames/bind';
import { useHistory } from 'react-router';
import ThemeContext from 'hoc/ThemeContext';
import PropTypes from 'prop-types';
import gClasses from 'scss/Typography.module.scss';
import { Breadcrumb } from '@workhall-pvt-lmt/wh-ui-library';
import { useTranslation } from 'react-i18next';
import TeamDetailsHeader from './team_details_header/TeamDetailsHeader';
import { ROUTE_METHOD, SORT_BY } from '../../../utils/Constants';
import { getTeamMembersListThunk } from '../../../redux/actions/Teams.action';
import { EMPTY_STRING } from '../../../utils/strings/CommonStrings';
import { teamDetailsDataChange, clearTeamDetails } from '../../../redux/reducer/TeamsReducer';
import { TEAMS_STRINGS, TEAM_MEMBERS_TAB_INDEX } from '../teams.strings';
import { isBasicUserMode, routeNavigate } from '../../../utils/UtilityFunctions';
import TeamMembersList from './members_list/MembersList';
import TeamSecurity from '../create_and_edit_team/team_security/TeamSecurity';
import { getBreadcrumbData, getTabUrl } from '../teams.utils';
import styles from './TeamDetails.module.scss';
import { DEFAULT_APP_ROUTE, HOME } from '../../../urls/RouteConstants';

function TeamDetails(props) {
  const {
    selectedTeamId,
    state,
    getTeamMembersListThunk,
    teamDetailsDataChange,
    clearTeamDetails,
  } = props;
  const {
    membersList,
    membersDataCountPerCall,
    teamSearchText,
    selectedTabIndex,
    teamName,
    isTeamDetailsLoading,
    createdBy,
    teamDetails: { teamType },
  } = state;
  const history = useHistory();
  const { t } = useTranslation();
  const isNormalMode = isBasicUserMode(history);
  const { colorScheme, colorSchemeDefault } = useContext(ThemeContext);

  useEffect(() => {
    if (selectedTeamId) {
      const params = {
        _id: selectedTeamId,
        size: membersDataCountPerCall,
        page: 1,
        sort_by: SORT_BY.ASC,
        sort_field: SORT_BY.SORT_NAME,
      };
      teamDetailsDataChange({
        teamSearchText: EMPTY_STRING,
        isTeamMembersListLoading: true,
      });
      if (!jsUtils.isEmpty(teamSearchText)) params.search = teamSearchText;
      getTeamMembersListThunk(params);
    }
    return () => {
      clearTeamDetails();
    };
  }, [selectedTeamId]);

  // get current Team Detail Tab
  const getCurrentTab = () => {
    let currentTab;
    switch (selectedTabIndex) {
      case TEAM_MEMBERS_TAB_INDEX.TEAM_MEMBERS:
        currentTab = (
          <TeamMembersList
            selectedTeamId={selectedTeamId}
            isNormalMode={isNormalMode}
            colorScheme={colorScheme}
            teamsDetails={state}
            membersList={membersList}
            teamDetailsDataChange={teamDetailsDataChange}
            getTeamMembersListThunk={getTeamMembersListThunk}
          />
        );
        break;
      case TEAM_MEMBERS_TAB_INDEX.SECURITY:
        currentTab = (
          <div className={cx(gClasses.PX20, gClasses.PT10, gClasses.BackgroundWhite)}>
            <TeamSecurity isTeamDetails currentUserData={createdBy} />
          </div>
        );
        break;
      default:
        break;
    }
    return currentTab;
  };

  // Breadcrumb link click
  const handleBreadCrumb = (event) => {
    let teamPathName;
    if (isNormalMode) {
      teamPathName = DEFAULT_APP_ROUTE;
    } else if (event?.target?.innerText === TEAMS_STRINGS(t).TEAMS_LISTING.HOME) {
       teamPathName = HOME;
    } else {
       teamPathName = getTabUrl(teamType?.toString());
    }
    routeNavigate(history, ROUTE_METHOD.PUSH, teamPathName);
  };

  // Header Wrapper
  const headerComponent = (
    <>
    <Breadcrumb
     isLoading={isTeamDetailsLoading}
      list={getBreadcrumbData(teamName, teamType, t, isNormalMode)}
      preventNavigation
      handleLinkClick={handleBreadCrumb}
      colorScheme={isNormalMode ? colorScheme : colorSchemeDefault}
      className={cx(gClasses.PL20, gClasses.PY8)}
    />
    <div>
      <TeamDetailsHeader
        selectedTeamId={selectedTeamId}
        teamsDetails={state}
        membersList={membersList}
      />
      <hr />
    </div>
    </>
  );

  return (
    <div className={cx(gClasses.PB15, gClasses.BackgroundWhite)}>
      {headerComponent}
      <div className={styles.TeamsDetailsListing}>
        {getCurrentTab()}
      </div>
    </div>
  );
}

TeamDetails.propTypes = {
  selectedTeamId: PropTypes.number.isRequired,
  state: PropTypes.objectOf(),
};

const mapStateToProps = (state) => {
  return {
    state: state.TeamsReducer.teamDetails,
  };
};

const mapDispatchToProps = {
  getTeamMembersListThunk,
  teamDetailsDataChange,
  clearTeamDetails,
};

export default connect(mapStateToProps, mapDispatchToProps)(TeamDetails);
