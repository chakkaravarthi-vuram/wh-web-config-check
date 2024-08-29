import React, { useEffect, useState } from 'react';
import cx from 'classnames/bind';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { apiTeamDetailsById } from 'axios/apiService/teams.apiService';
import { POPPER_PLACEMENTS } from 'components/auto_positioning_popper/AutoPositioningPopper';
import UserOrTeamToolTip from 'components/form_components/user_team_tool_tip/UserOrTeamToolTip';
import { TOOL_TIP_TYPE } from 'utils/Constants';
import { EMPTY_STRING } from 'utils/strings/CommonStrings';
import { getFullName } from 'utils/generatorUtils';
import UserImage from '../../../../user_image/UserImage';
import gClasses from '../../../../../scss/Typography.module.scss';
import styles from '../CustomRemainingUsersTooltip.module.scss';
import { BS } from '../../../../../utils/UIConstants';
import { getUserData } from '../../../../../axios/apiService/addMember.apiService ';
import jsUtils, { isNull } from '../../../../../utils/jsUtility';

function EachRemainingUserTooltip(props) {
  const { id, userOrTeam, userDetails, teamDetails } = props;
    const [userData, setUserData] = useState({ ...userDetails });
    const [teamData, setTeamData] = useState({ ...teamDetails });
    const [profilePicLoaded, setProfilePicLoaded] = useState(false);

    useEffect(() => {
        const params = {
            _id: id,
        };
        if (id && (userOrTeam === TOOL_TIP_TYPE.USER || userOrTeam === TOOL_TIP_TYPE.PROFILE)) {
            const cancelDataListToken = {
                cancelToken: null,
            };
            const setDataListCancelToken = (c) => { cancelDataListToken.cancelToken = c; };
            getUserData(params, setDataListCancelToken).then((response) => {
                setUserData(response);
                setProfilePicLoaded(true);
                })
                .catch((error) => {
                    console.log('setError', error);
                    setProfilePicLoaded(false);
                });
        } else if (id && userOrTeam === 'team') {
            apiTeamDetailsById(id)
            .then((response) => {
                setTeamData(response);
                setProfilePicLoaded(true);
            })
            .catch((error) => {
                console.log('setError', error);
                setProfilePicLoaded(false);
            });
        }
    }, [id, userOrTeam]);

    let profile_pic = null;
    if (profilePicLoaded && userData.profile_pic && userData.document_url_details) {
        const documentDetail = jsUtils.find(userData.document_url_details, { document_id: userData.profile_pic });
        profile_pic = documentDetail && documentDetail.signedurl;
    } else if (profilePicLoaded && teamData.team_pic && !isNull(teamData.team_pic)) {
        profile_pic = teamData.team_pic;
    } else {
      profile_pic = null;
    }

    if (id && userOrTeam === 'team') {
        const assignees = {};
        assignees.teams = [];
        assignees.teams.push(teamData);
      } else {
        const assignees = {};
        assignees.users = [];
        assignees.users.push(userData);
      }
      console.log('checktooltip', userOrTeam, id);
    const getToolTip = () => {
        switch (userOrTeam) {
        case TOOL_TIP_TYPE.USER:
            return userData && (
            <div className={cx(styles.ProfileDetailContainer, BS.D_FLEX)}>
                <UserOrTeamToolTip
                id={id}
                userOrTeam={TOOL_TIP_TYPE.PROFILE}
                popperPlacement={POPPER_PLACEMENTS.RIGHT}
                className={gClasses.CenterV}
                >
                <UserImage
                src={profile_pic}
                className={cx(styles.UserIcon)}
                firstName={userData.first_name}
                lastName={userData.last_name}
                // isDataLoading={profilePicLoaded}
                />
                </UserOrTeamToolTip>
                <div
                className={cx(
                    BS.FLEX_COLUMN,
                    BS.D_FLEX,
                    gClasses.ML20,
                    gClasses.Ellipsis,
                )}
                >
                <div
                    className={cx(gClasses.Ellipsis, gClasses.FTwo12GrayV3)}
                >
                    {`${getFullName(userData.first_name, userData.last_name)}`}
                </div>
                <div className={cx(gClasses.Ellipsis, gClasses.Width150, gClasses.FTwo12GrayV3)}>{userData.email}</div>
                </div>
            </div>
        );
        case TOOL_TIP_TYPE.TEAM:
            return teamData && (
                <div className={cx(styles.ProfileDetailContainer, BS.D_FLEX)}>
                <UserOrTeamToolTip
                id={id}
                userOrTeam={TOOL_TIP_TYPE.TEAM}
                popperPlacement={POPPER_PLACEMENTS.RIGHT}
                className={gClasses.CenterV}
                >
                <UserImage
                src={profile_pic}
                className={cx(styles.UserIcon, gClasses.CursorPointer)}
                firstName={teamData.team_name}
                lastName={EMPTY_STRING}
                />
                </UserOrTeamToolTip>
                  <div
                    className={cx(
                      BS.FLEX_COLUMN,
                      BS.D_FLEX,
                      gClasses.ML20,
                      gClasses.Ellipsis,
                      gClasses.FTwo12GrayV3,
                    )}
                  >
                    <div className={cx(gClasses.Ellipsis, gClasses.Width150)}>
                      {teamData.team_name}
                    </div>
                  </div>
                </div>
            );
        default: break;
        }
        return null;
    };

    return (
        <>
          {getToolTip()}
        </>
    );
}

const mapStateToProps = (state) => {
    return {
      userId: state.RoleReducer.user_id,
    };
  };

  export default connect(
    mapStateToProps,
  )(withRouter(EachRemainingUserTooltip));
