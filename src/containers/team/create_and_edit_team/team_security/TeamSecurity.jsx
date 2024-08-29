import React from 'react';
import { connect } from 'react-redux';
import { createEditDataChange } from 'redux/reducer/TeamsReducer';
import { useHistory } from 'react-router-dom';
import SecurityOwners from './security_owners/SecurityOwners';
import SecurityVisibility from './security_visibility/SecurityVisibility';
import { isBasicUserMode } from '../../../../utils/UtilityFunctions';

function TeamSecurity(props) {
    const {
        teamCreateEditState: {
            security,
            errorMessage,
            security: {
                owner,
                visibility,
            },
        },
        createEditDataChange,
        teamDetailsState,
        isTeamDetails = false,
        currentUserData,
    } = props;
    const history = useHistory();
    const isNormalMode = isBasicUserMode(history);

    let securityData;
    const ownerDetails = { ...teamDetailsState?.security?.owner };
    const visibilityDetails = { ...teamDetailsState?.security?.visibility };
    if (isNormalMode) {
        ownerDetails.selectiveUsers = true;
        ownerDetails.users = currentUserData;
        visibilityDetails.selectiveUsers = true;
        visibilityDetails.others = { users: currentUserData, teams: [] };
    }
    if (isTeamDetails) {
        securityData = { ownerData: ownerDetails, visibilityData: visibilityDetails };
    } else {
        securityData = { ownerData: owner, visibilityData: visibility };
    }

    return (
        <div>
            <SecurityOwners errorMessage={errorMessage} currentUserData={currentUserData} isTeamDetails={isTeamDetails} owner={securityData?.ownerData} createEditDataChange={createEditDataChange} security={security} />
            <SecurityVisibility errorMessage={errorMessage} currentUserData={currentUserData} isTeamDetails={isTeamDetails} visibility={securityData?.visibilityData} createEditDataChange={createEditDataChange} security={security} />
        </div>
    );
}

const mapStateToProps = (state) => {
    return {
        teamCreateEditState: state.TeamsReducer.createEditTeam,
        teamDetailsState: state.TeamsReducer.teamDetails,
    };
};

const mapDispatchToProps = { createEditDataChange };

export default connect(mapStateToProps, mapDispatchToProps)(TeamSecurity);
