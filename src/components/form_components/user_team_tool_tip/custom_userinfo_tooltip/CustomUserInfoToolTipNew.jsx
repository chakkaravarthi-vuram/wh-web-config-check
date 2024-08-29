import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { withRouter } from 'react-router';
import queryString from 'query-string';
import { UserOrTeamToolTipContent } from '@workhall-pvt-lmt/wh-ui-library';
import { EMPTY_STRING } from 'utils/strings/CommonStrings';
import { TOOL_TIP_TYPE } from 'utils/Constants';
import { TEAMS } from 'urls/RouteConstants';
import { store } from 'Store';
import { createTaskSetState } from 'redux/reducer/CreateTaskReducer';
 import { get } from 'utils/jsUtility';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import jsUtils from '../../../../utils/jsUtility';
import { getUserData } from '../../../../axios/apiService/addMember.apiService ';
import ThemeContext from '../../../../hoc/ThemeContext';
import styles from './CustomUserInfoTooltip.module.scss';
import AlertIcon from '../../../../assets/icons/teams/AlertIcon';
import { SERVER_ERROR_CODE_STRINGS } from '../../../../utils/strings/CommonStrings';
import { SERVER_ERROR_CODES } from '../../../../utils/ServerConstants';
import { ROLES, ROUTE_METHOD } from '../../../../utils/Constants';
import { getDevRoutePath, routeNavigate } from '../../../../utils/UtilityFunctions';
import { apiTeamDetailsById } from '../../../../axios/apiService/teams.apiService';
import { ALL_REQUESTS, DATA_LIST_DASHBOARD } from '../../../../urls/RouteConstants';

function CustomUserInfoTooltipNew(props) {
  const [assignee, setAssignee] = useState({});
  const { id, type, contentClassName, onFocus, onBlur, onMouseEnter, onMouseLeave, isStandardUserMode = false, showCreateTask } = props;
  const role = useSelector((state) => state.RoleReducer.role);
  const [isLoading, setLoader] = useState(true);
  const history = useHistory();
  const [datalistInfo, setdatalistInfo] = useState({});
  const [isTeamUnauthorized, setIsTeamUnauthorized] = useState(false);
  const { t } = useTranslation();

  const { colorScheme, colorSchemeDefault } = useContext(ThemeContext);

  useEffect(() => {
    let params = null;
    let apiCall = null;
    if (type === TOOL_TIP_TYPE.USER) {
        apiCall = getUserData;
        params = {
            _id: id,
        };
    } else if (type === TOOL_TIP_TYPE.TEAM) {
        apiCall = apiTeamDetailsById;
        params = id;
    }

    const cancelDataListToken = { cancelToken: null };
    const setDataListCancelToken = (c) => { cancelDataListToken.cancelToken = c; };

    if (apiCall) {
        apiCall(params, setDataListCancelToken)
        .then((response) => {
            setAssignee(response);
            (type === TOOL_TIP_TYPE.USER) ? setdatalistInfo(response.datalist_info) : null;
            setLoader(false);
        })
        .catch(() => {
            setIsTeamUnauthorized(true);
            setLoader(false);
        });
    }
  }, [id, type]);

  // Profile Picture
  let profile_pic = null;
  if (type === TOOL_TIP_TYPE.USER && assignee.profile_pic) {
    const documentDetail = jsUtils.find(assignee.document_url_details, { document_id: assignee.profile_pic });
    profile_pic = get(documentDetail, ['signedurl'], EMPTY_STRING);
  } else if (type === TOOL_TIP_TYPE.TEAM) {
    profile_pic = get(assignee, ['team_pic'], EMPTY_STRING);
  }

  // Create Task
  const onClickHandler = (e) => {
    e.stopPropagation();
    const currentParams = queryString.parseUrl(history.location.pathname);
    const newParams = { ...get(currentParams, ['query'], {}), create: 'task' };
    const searchParams = new URLSearchParams(newParams).toString();
    routeNavigate(history, ROUTE_METHOD.PUSH, null, searchParams, null);

    const assignees = {};
    if (id && type === TOOL_TIP_TYPE.TEAM) {
      assignees.teams = [];
      assignees.teams.push(assignee);
    } else if (type === TOOL_TIP_TYPE.USER) {
      assignees.users = [];
      assignees.users.push(assignee);
    }
    store.dispatch(createTaskSetState({ assignees: assignees }));
  };

  // Open Navigation Link
  const userRedirectHandle = (e) => {
    e.stopPropagation();
    let navigateTo = null;
    if ((type === TOOL_TIP_TYPE.USER) && !jsUtils.isUndefined(datalistInfo)) {
        navigateTo = `${DATA_LIST_DASHBOARD}/${datalistInfo.data_list_uuid}/${ALL_REQUESTS}/${datalistInfo.entry_id}`;
    } else if (id && type === TOOL_TIP_TYPE.TEAM) {
        navigateTo = getDevRoutePath(`${TEAMS}/${id}`);
    }
    window.open(navigateTo, '_blank');
  };

  const onUnauthorizedClickhandler = (e) => {
    e.stopPropagation();
  };

  const getToolTip = () => {
    const constructUserOrTeam = () => {
        return {
            src: profile_pic || EMPTY_STRING,
            name: (type === TOOL_TIP_TYPE.USER) ? [assignee.first_name, assignee.last_name].join(' ') : (
                (type === TOOL_TIP_TYPE.TEAM) ? assignee.team_name : EMPTY_STRING
            ),
            email: assignee.email || EMPTY_STRING,
            showCreateTask: (type === TOOL_TIP_TYPE.TEAM) ? true :
            ((role === ROLES.ADMIN) || (role === ROLES.FLOW_CREATOR)),
        };
    };
    return (
      <div
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
      >
      {isTeamUnauthorized ? (
          <div
          className={styles.TeamsUnauthorizeContainer}
          tabIndex={0}
          onClick={onUnauthorizedClickhandler}
          onKeyDown={onUnauthorizedClickhandler}
          role="textbox"
          >
            <div className={styles.AlertIcon}>
              <AlertIcon />
            </div>
            <div className={(styles.UnauthorizedTextClass)}>
              {SERVER_ERROR_CODE_STRINGS[SERVER_ERROR_CODES.UNAUTHORIZED]}
            </div>
          </div>
      ) : (
        <UserOrTeamToolTipContent
            id={id}
            colorScheme={isStandardUserMode ? colorScheme : colorSchemeDefault}
            hideViewProfile={(isStandardUserMode && role !== ROLES.ADMIN)}
            className={contentClassName}
            userOrTeamDetail={constructUserOrTeam()}
            type={type}
            onFocus={onFocus}
            onBlur={onBlur}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            onClickCreateTask={onClickHandler}
            onClickViewDetail={userRedirectHandle}
            isLoading={isLoading}
            hideCreateTask={!showCreateTask}
            buttonLabel={{
                viewDetail: t('common_strings.view_details'),
                createTask: t('common_strings.create_task'),
            }}
        />
        )}
      </div>
    );
  };

  return (
    <>
      {getToolTip()}
    </>
  );
}

export default withRouter(CustomUserInfoTooltipNew);
