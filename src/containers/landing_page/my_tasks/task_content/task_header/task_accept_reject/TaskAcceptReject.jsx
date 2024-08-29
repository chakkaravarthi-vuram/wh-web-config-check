import React, { useContext, useEffect, useState } from 'react';
import { AvatarGroup, AvatarSizeVariant, Button, EButtonSizeType, EButtonType, EPopperPlacements, UserPicker } from '@workhall-pvt-lmt/wh-ui-library';
import cx from 'classnames/bind';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import styles from './TaskAcceptReject.module.scss';
import gClasses from '../../../../../../scss/Typography.module.scss';
import InfoCircle from '../../../../../../assets/icons/task/InfoCircle';
import { TASK_ACTION } from '../../../../LandingPage.strings';
import { getUrlFromPicId } from './TaskAcceptReject.utils';
import { isEmpty } from '../../../../../../utils/jsUtility';
import { constructAvatarOrUserDisplayGroupList, getFullName, isBasicUserMode } from '../../../../../../utils/UtilityFunctions';
import CustomUserInfoToolTipNew from '../../../../../../components/form_components/user_team_tool_tip/custom_userinfo_tooltip/CustomUserInfoToolTipNew';
import { EMPTY_STRING } from '../../../../../../utils/strings/CommonStrings';
import ThemeContext from '../../../../../../hoc/ThemeContext';
import { axiosGetUtils } from '../../../../../../axios/AxiosHelper';
import { GET_TEST_BED_ASSIGNEES } from '../../../../../../urls/ApiUrls';
import { TESTBED_FLOW_ASSIGNEES } from './TaskAcceptReject.strings';

let cancelTokenTestAssignees;

const { CancelToken } = axios;

export const getCancelTokenForTestAssignees = (cancelToken) => {
  cancelTokenTestAssignees = cancelToken;
};

function TaskAcceptReject(props) {
    const { t } = useTranslation();
    const { isLoading, document_url_details, taskAssignees, taskLogId, taskId, isTestBed,
        onRejectTask, onAcceptTask, isBasicUser, setTestAssignee, selectedTestAssignee } = props;
    const { colorScheme, colorSchemeDefault } = useContext(ThemeContext);
    const colorSchema = isBasicUser ? colorScheme : colorSchemeDefault;
    const [testAssigneesList, setTestAssigneesList] = useState([]);
    const [searchText, setSearchText] = useState(EMPTY_STRING);

    const showCreateTask = useSelector((state) => state.RoleReducer.is_show_app_tasks);
    const history = useHistory();
    const isNormalMode = isBasicUserMode(history);

    const getTestAssignees = (searchText = EMPTY_STRING) => {
      const params = {
        id: taskId,
      };
      if (searchText) params.search = searchText;
      if (cancelTokenTestAssignees) cancelTokenTestAssignees?.();
      axiosGetUtils(GET_TEST_BED_ASSIGNEES, {
        params,
        cancelToken: new CancelToken((c) => {
          getCancelTokenForTestAssignees?.(c);
        }),
      }).then((response) => {
        const testAssginees = [];
        const documentDetails = response?.data?.result?.data?.document_url_details || [];
        (response?.data?.result?.data?.pagination_data || [])?.forEach((user) => {
          const userPic = documentDetails.find(
            (eachDocument) => eachDocument.document_id === user.profile_pic,
          );
          testAssginees.push({
              ...user,
              src: (user.profile_pic && getUrlFromPicId(user.profile_pic, documentDetails)) ||
              (user.team_pic || getUrlFromPicId(user.team_pic, documentDetails)) || null,
              label: getFullName(user?.first_name, user?.last_name),
              name: getFullName(user?.first_name, user?.last_name),
              id: user?._id,
              ...(userPic?.signedurl) ? { avatar: userPic.signedurl } : null,
              noDelate: true,
          });
        });
        setTestAssigneesList(testAssginees);
      }).catch((err) => {
        console.log('testresponses', err);
      });
    };

    useEffect(() => {
      isTestBed && getTestAssignees(EMPTY_STRING);
    }, []);

    const searchTestAssginees = (searchEvent) => {
      const searchValue = searchEvent?.target?.value;
      if (searchValue) {
        setSearchText(searchValue);
        getTestAssignees(searchValue);
      } else {
        setSearchText(EMPTY_STRING);
        getTestAssignees(EMPTY_STRING);
      }
    };

    const usersAndTeams = { users: [], teams: [] };
    if (taskAssignees) {
        if (!isEmpty(taskAssignees?.users)) {
          usersAndTeams.users = taskAssignees?.users?.map((user) => {
            return {
                ...user,
                src: (user.profile_pic && getUrlFromPicId(user.profile_pic, document_url_details)) ||
                (user.team_pic || getUrlFromPicId(user.team_pic, document_url_details)) || null,

            };
          });
        }
        if (!isEmpty(taskAssignees?.teams)) {
            usersAndTeams.teams = taskAssignees?.teams?.map((team) => {
                return {
                    ...team,
                    src: (team.profile_pic && getUrlFromPicId(team.profile_pic, document_url_details)) ||
                    (team.team_pic || getUrlFromPicId(team.team_pic, document_url_details)) || null,
                };
              });
            }
    }

    const acceptTask = (event) => {
        event.preventDefault();
        const acceptData = {
          task_log_id: taskLogId,
          status: TASK_ACTION.STATUS_ACCEPTED,
        };
        onAcceptTask(acceptData);
    };

    const rejectTask = (event) => {
        event.preventDefault();
        const rejectData = {
          task_log_id: taskLogId,
        };
        onRejectTask(rejectData);
      };

    const getPopperContent = (id, type, onShow, onHide) => {
        const content = (
            <CustomUserInfoToolTipNew
                id={id}
                contentClassName={gClasses.BackgroundWhite}
                type={type}
                onFocus={onShow}
                onBlur={onHide}
                onMouseEnter={onShow}
                onMouseLeave={onHide}
                isStandardUserMode={isBasicUser}
                showCreateTask={!isNormalMode || showCreateTask}
            />
        );
        return content;
    };

    return (
        <div
          style={{ backgroundColor: '#FFF6ED', borderBottom: '#FFF6ED' }}
          className={cx(gClasses.PX12, gClasses.PY24)}
        >
          <div className={styles.LastActivity}>
              <div className={cx([gClasses.DisplayFlex, gClasses.CenterV])}>
                  <span className={cx([gClasses.FTwo13RedV28, gClasses.MR8, gClasses.FontWeight500])}>
                      <InfoCircle iconFillColor="#DC6803" />
                      {t(TASK_ACTION.TITLE)}
                  </span>
                  <span className={cx(gClasses.FTwo12BlackV20, gClasses.MB2)}>
                      {t(TASK_ACTION.LABEL)}
                  </span>
              </div>
              <div className={cx([gClasses.DisplayFlex, gClasses.CenterV])}>
                  <div>
                      <AvatarGroup
                          colorScheme={colorSchema}
                          size={AvatarSizeVariant.sm}
                          allAvatarData={constructAvatarOrUserDisplayGroupList(usersAndTeams)}
                          isLoading={isLoading}
                          className={styles.Assignees}
                          popperPlacement={EPopperPlacements.BOTTOM_START}
                          getPopperContent={(id, type, onShow, onHide) => getPopperContent(id, type, onShow, onHide)}
                      />
                  </div>
                      {!isTestBed &&
                        <Button
                          size={EButtonSizeType.SM}
                          type={EMPTY_STRING}
                          buttonText={t(TASK_ACTION.BUTTON.LABEL.REJECT)}
                          onClickHandler={rejectTask}
                          className={cx(gClasses.MR12, gClasses.ML12)}
                          disabled={isEmpty(selectedTestAssignee) && isTestBed}
                        />
                      }
                      <Button
                          size={EButtonSizeType.SM}
                          type={EButtonType.PRIMARY}
                          buttonText={t(TASK_ACTION.BUTTON.LABEL.ACCEPT)}
                          onClickHandler={acceptTask}
                          colorSchema={colorSchema}
                          disabled={isEmpty(selectedTestAssignee) && isTestBed}
                      />
              </div>
          </div>
          {isTestBed &&
            <UserPicker
              colorScheme={colorSchema}
              id={TESTBED_FLOW_ASSIGNEES.TEST_ASSIGNEES.ID}
              selectedValue={isEmpty(selectedTestAssignee) ? [] : [selectedTestAssignee]}
              labelText={t(TESTBED_FLOW_ASSIGNEES.TEST_ASSIGNEES.LABEL)}
              isLoading={false}
              labelClassName={gClasses.FTwo12BlackV20}
              selectedValueContainerClassName={!isEmpty(selectedTestAssignee) && styles.HideAddAssignee}
              noDataFoundMessage={t(TESTBED_FLOW_ASSIGNEES.TEST_ASSIGNEES.NO_USERS_ON_SEARCH)}
              optionList={testAssigneesList}
              onSelect={(_event, option) => {
                setTestAssignee(option);
              }}
              errorMessage={EMPTY_STRING}
              onRemove={(removeUserOrTeamId) => {
                console.log('onremovehandler final', removeUserOrTeamId);
                setTestAssignee({});
              }}
              isSearchable
              onSearch={(event) => searchTestAssginees(event)}
              searchText={searchText}
              popperPosition={EPopperPlacements.RIGHT_END}
              required
              onPopperOutsideClick={() => {
                setSearchText(EMPTY_STRING);
                getTestAssignees(EMPTY_STRING);
              }}
              getPopperContent={(id, type, onShow, onHide) => getPopperContent(id, type, onShow, onHide, history, showCreateTask)}
            />
          }
        </div>
    );
}
export default TaskAcceptReject;

TaskAcceptReject.propTypes = {

};
