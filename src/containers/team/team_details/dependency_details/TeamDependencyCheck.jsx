import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import DependencyHandler from '../../../../components/dependency_handler/DependencyHandler';
import { DEFAULT_APP_ROUTE } from '../../../../urls/RouteConstants';
import { getTabUrl } from '../../teams.utils';
import { routeNavigate } from '../../../../utils/UtilityFunctions';
import { TEAMS_STRINGS } from '../../teams.strings';
import { NUMBER_STRINGS } from '../../../../utils/strings/CommonStrings';
import { ROUTE_METHOD } from '../../../../utils/Constants';

function TeamDependencyCheck(props) {
  const {
    selectedTeamId,
    deactivateTeamApiThunk,
    teamDetailsDataChange,
    isBasicUserMode,
    history,
    getDependencyListThunk,
    state,
  } = props;
  const { isDependencyListLoading, dependencyData } = state;
  const { t } = useTranslation();
  const { TEAM } = TEAMS_STRINGS(t).TEAMS_LISTING;

  useEffect(() => {
    const params = { _id: selectedTeamId };
    teamDetailsDataChange({
      isDependencyListLoading: true,
    });
    getDependencyListThunk(params);
  }, []);

  // Cancel Deactivate Modal
  const onCloseDeactivateClick = () => {
    teamDetailsDataChange({ deactivateTeamModalVisibility: false });
  };

  // Handle Deactivate Teams Handler
  const onDeactivateTeamClick = async () => {
    deactivateTeamApiThunk(selectedTeamId, t).then(() => {
      teamDetailsDataChange({ deactivateTeamModalVisibility: false });
      if (isBasicUserMode(history)) {
        routeNavigate(history, ROUTE_METHOD.PUSH, DEFAULT_APP_ROUTE);
      } else {
        const teamPathname = getTabUrl(NUMBER_STRINGS.TWO);
        routeNavigate(history, ROUTE_METHOD.PUSH, teamPathname);
      }
    });
  };

  return (
    <DependencyHandler
      onDeleteClick={onDeactivateTeamClick}
      onCancelDeleteClick={onCloseDeactivateClick}
      isDependencyListLoading={isDependencyListLoading}
      dependencyHeaderTitle={TEAM}
      dependencyData={dependencyData}
    />
  );
}

export default TeamDependencyCheck;
