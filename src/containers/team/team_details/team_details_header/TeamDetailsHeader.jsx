import {
  Avatar,
  AvatarSizeVariant,
  Button,
  EButtonType,
  ETabVariation,
  Tab,
  Thumbnail,
  UTToolTipType,
  UserOrTeamToolTip,
  EPopperPlacements,
  Title,
  ETitleSize,
  ETitleHeadingLevel,
  Text,
} from '@workhall-pvt-lmt/wh-ui-library';
import React, { useContext, useEffect, useRef, useState } from 'react';
import cx from 'classnames/bind';
import gClasses from 'scss/Typography.module.scss';
import { connect, useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import queryString from 'query-string';
import { get } from 'utils/jsUtility';
import ThemeContext from 'hoc/ThemeContext';
import PropTypes from 'prop-types';
import { createTaskSetState } from '../../../../redux/reducer/CreateTaskReducer';
import styles from '../TeamDetails.module.scss';
import TeamDetailsIcon from '../../../../assets/icons/teams/TeamDetailsIcon';
import { DEFAULT_COLORS_CONSTANTS } from '../../../../utils/UIConstants';
import {
  createEditDataChange,
  teamDetailsDataChange,
} from '../../../../redux/reducer/TeamsReducer';
import {
  getTeamDetailsThunk,
  getDependencyListThunk,
  deactivateTeamApiThunk,
} from '../../../../redux/actions/Teams.action';
import {
  EMPTY_STRING,
  TEAM_CREATED_DATE_TIME,
} from '../../../../utils/strings/CommonStrings';
import { getFormattedDateFromUTC } from '../../../../utils/dateUtils';
import CustomUserInfoToolTipNew from '../../../../components/form_components/user_team_tool_tip/custom_userinfo_tooltip/CustomUserInfoToolTipNew';
import { getSignedUrlFromDocumentUrlDetails } from '../../../../utils/profileUtils';
import { isBasicUserMode, routeNavigate } from '../../../../utils/UtilityFunctions';
import { APPLICATION_STRINGS } from '../../../application/application.strings';
import AutoPositioningPopper, {
  POPPER_PLACEMENTS,
} from '../../../../components/auto_positioning_popper/AutoPositioningPopper';
import SettingsEditIcon from '../../../../assets/icons/teams/SettingEditIcon';
import { TEAMS_STRINGS } from '../../teams.strings';
import { TEAMS_EDIT_TEAM } from '../../../../urls/RouteConstants';
import { SettingsDropdown, constructAddTask, generateContent, setEditTeamData } from '../../teams.utils';
import TeamDependencyCheck from '../dependency_details/TeamDependencyCheck';
import { ROUTE_METHOD } from '../../../../utils/Constants';

function TeamDetailsHeader(props) {
  const {
    state,
    selectedTeamId,
    teamsDetails,
    teamDetailsDataChange,
    getTeamDetailsThunk,
    getDependencyListThunk,
    deactivateTeamApiThunk,
    createEditDataChange,
    teamCreateEditState: {
      security: { owner, visibility },
    },
    isShowAppTasks,
  } = props;
  const {
    teamName,
    teamDesc = EMPTY_STRING,
    createdOn,
    teamDetails,
    isTeamDetailsLoading,
    deactivateTeamModalVisibility,
  } = state;
  const { utc_tz_datetime } = createdOn;
  const dispatch = useDispatch();
  const history = useHistory();
  const isNormalMode = isBasicUserMode(history);
  const showCreateTask = useSelector((state) => state.RoleReducer.is_show_app_tasks);
  const { t } = useTranslation();
  const [isSettingOpen, setIsSettingOpen] = useState(false);
  const [showFullText, setShowFullText] = useState(false);
  const referenceDropdownPopper = useRef(null);
  const { colorScheme, colorSchemeDefault } = useContext(ThemeContext);
  const { TAB, CREATED_ON, VIEW_MORE, VIEW_LESS } = TEAMS_STRINGS(t).TEAM_DETAILS;
  const [selectedTabIndex, setSelectedTabIndex] = useState(
    TAB.OPTIONS[0].tabIndex,
  );

  useEffect(() => {
    if (selectedTeamId) {
      const params = { _id: selectedTeamId };
      teamDetailsDataChange({
        teamSearchText: EMPTY_STRING,
        isTeamMembersListLoading: true,
        isTeamDetailsLoading: true,
      });
      getTeamDetailsThunk(params, isNormalMode);
      setSelectedTabIndex(TAB.OPTIONS[0].tabIndex);
      teamDetailsDataChange({
        selectedTabIndex: TAB.OPTIONS[0].tabIndex,
      });
    }
  }, [selectedTeamId]);

  // Called when tab switch
  const onTabChange = (value) => {
    setSelectedTabIndex(value);
    teamDetailsDataChange({
      selectedTabIndex: value,
    });
  };

  // Triggered when setting click
  const handleSettingClick = () => {
    setIsSettingOpen(!isSettingOpen);
  };

  // Thumbnail
  const getPopperContent = (id, type, onShow, onHide) => {
    const content = (
      <CustomUserInfoToolTipNew
        id={id}
        contentClassName={cx(gClasses.WhiteBackground, gClasses.ZIndex152)}
        type={type}
        onFocus={onShow}
        onBlur={onHide}
        onMouseEnter={onShow}
        onMouseLeave={onHide}
        isStandardUserMode={isNormalMode}
        showCreateTask={showCreateTask || !isNormalMode}
      />
    );
    return content;
  };

  // get team created admin Data
  const getProfileData = (user) => {
    const createdBy = user?.createdBy?.[0];
    const userImage = {
      name: `${createdBy?.first_name} ${createdBy?.last_name}`,
      src: getSignedUrlFromDocumentUrlDetails(
        teamsDetails?.documentUrlDetails,
        createdBy?.profile_pic,
      ),
      id: createdBy?._id,
      type: UTToolTipType.user,
      colorScheme: isNormalMode && colorScheme,
    };
    const avatarGroup = (
      <UserOrTeamToolTip
        id={String(userImage.id)}
        key={String(userImage.id)}
        type={userImage.type}
        colorScheme={isNormalMode ? colorScheme : colorSchemeDefault}
        popperPlacement={EPopperPlacements.BOTTOM_START}
        popperContent={(_id, _type, showPopper, hidePopper) =>
          getPopperContent(_id, _type, showPopper, hidePopper)
        }
        popperClassName={gClasses.ZIndex13}
      >
        <Avatar
          {...userImage}
          size={AvatarSizeVariant.sm}
          colorScheme={isNormalMode ? colorScheme : colorSchemeDefault}
          isLoading={isTeamDetailsLoading}
        />
      </UserOrTeamToolTip>
    );
    return avatarGroup;
  };

  const teamDependency = (
    <TeamDependencyCheck
      selectedTeamId={selectedTeamId}
      deactivateTeamApiThunk={deactivateTeamApiThunk}
      teamDetailsDataChange={teamDetailsDataChange}
      isBasicUserMode={isBasicUserMode}
      history={history}
      getDependencyListThunk={getDependencyListThunk}
      state={state}
    />
  );

  // Clicking on Settings
  const handleSettingsDropdownClick = (menu) => {
    setIsSettingOpen(false);
    if (menu?.value === 1) {
      const { ownerData, visibilityData, common } =
        setEditTeamData(teamDetails, isNormalMode);
      createEditDataChange({
        ...common,
        security: {
          owner: { ...owner, ...ownerData },
          visibility: { ...visibility, ...visibilityData },
        },
      });
      const teamPathname = TEAMS_EDIT_TEAM + selectedTeamId;
      routeNavigate(history, ROUTE_METHOD.PUSH, teamPathname);
    } else {
      teamDetailsDataChange({ deactivateTeamModalVisibility: true });
    }
  };

  // Add Task click for Private Teams
  const onAddTask = () => {
    const currentParams = queryString.parseUrl(history.location.pathname);
    const newParams = { ...get(currentParams, ['query'], {}), create: 'task' };
    const teamSearchParams = new URLSearchParams(newParams).toString();
    routeNavigate(history, ROUTE_METHOD.PUSH, EMPTY_STRING, teamSearchParams);
    const modifiedTeamDetails = constructAddTask(teamDetails);
    const assignees = {};
    assignees.teams = [];
    assignees.teams.push(modifiedTeamDetails);
    dispatch(createTaskSetState({ assignees: assignees }));
  };

  const toggleShowFullText = () => {
    setShowFullText(!showFullText);
  };

  const buttonText = (
    <button className={cx(gClasses.BlueV39, gClasses.ML3)} onClick={toggleShowFullText}>
      {showFullText ? VIEW_LESS : VIEW_MORE }
    </button>
  );
  // Settings Popper
  const getSettingsAction = (
    <div ref={referenceDropdownPopper}>
      <AutoPositioningPopper
        className={gClasses.ZIndex1}
        placement={POPPER_PLACEMENTS.BOTTOM_END}
        fallbackPlacements={[POPPER_PLACEMENTS.BOTTOM_END]}
        referenceElement={referenceDropdownPopper?.current}
        isPopperOpen={isSettingOpen}
        enableOnBlur={isSettingOpen}
        onBlur={() => setIsSettingOpen(!isSettingOpen)}
      >
        <div className={styles.PopperStyles}>
          {SettingsDropdown(t).map((menu) => (
            <button
              key={menu.title}
              className={styles.SettingsOption}
              onClick={() => handleSettingsDropdownClick(menu)}
            >
              <div className={gClasses.MR8}>{menu.icon}</div>
              <div className={cx(menu.value === 1 ? gClasses.FTwo13GrayV89 : gClasses.RedV22)}>{menu.title}</div>
            </button>
          ))}
        </div>
      </AutoPositioningPopper>
      <button onClick={handleSettingClick}>
        <SettingsEditIcon />
      </button>
    </div>
  );

  // Header Tabs
  const headerTabs = (
    <Tab
      options={TAB.OPTIONS}
      selectedTabIndex={Number(selectedTabIndex)}
      variation={ETabVariation.primary}
      bottomSelectionClass={gClasses.ActiveBar}
      onClick={onTabChange}
      className={styles.Tab}
      colorScheme={isNormalMode ? colorScheme : colorSchemeDefault}
      tabContainerClass={gClasses.ZIndex10}
    />
  );

  return (
    <div className={gClasses.PX20}>
      <div className={cx(gClasses.CenterVSpaceBetween, gClasses.PB10, styles.ResponsiveHeader)}>
        <div
          className={cx(gClasses.CenterV, styles.TeamIcon, styles.HeaderBlock)}
        >
          <Thumbnail
            showIcon
            isDataLoading={isTeamDetailsLoading}
            className={styles.Thumbnail}
            icon={
              <TeamDetailsIcon
                fillColor={
                  isNormalMode
                    ? colorScheme?.activeColor
                    : DEFAULT_COLORS_CONSTANTS.BLUE_V39
                }
              />
            }
            backgroundColor={
              isNormalMode
                ? `${colorScheme?.activeColor}20`
                : `${DEFAULT_COLORS_CONSTANTS.BLUE_V39}20`
            }
          />
          <div className={cx(gClasses.ML20, gClasses.W100)}>
            <Title
              isDataLoading={isTeamDetailsLoading}
              content={teamName}
              size={ETitleSize.sm}
              headingLevel={ETitleHeadingLevel.h4}
              className={cx(styles.TeamName, gClasses.FontSize24)}
            />
            <Text
              isLoading={isTeamDetailsLoading}
              content={generateContent(teamDesc, buttonText, showFullText)}
              className={cx(gClasses.FontSize12, styles.TeamDesc)}
            />
          </div>
        </div>
        <div className={cx(gClasses.CenterV, styles.ResponsiveStyle)}>
          <div
            className={cx(
              gClasses.FTwo12GrayV98,
              gClasses.DisplayInlineBlock,
              gClasses.MR4,
            )}
          >
            {`${t(CREATED_ON)}: `}
          </div>
          <div
            className={cx(
              gClasses.FTwo12Black,
              gClasses.MR12,
              gClasses.DisplayInlineBlock,
            )}
          >
            <Text
              isLoading={isTeamDetailsLoading}
              content={getFormattedDateFromUTC(
                utc_tz_datetime,
                TEAM_CREATED_DATE_TIME,
              )}
              className={gClasses.FontSize12}
            />
          </div>
          <div
            className={cx(
              gClasses.FTwo12Black,
              gClasses.DisplayInlineBlock,
            )}
          >
            {getProfileData(teamsDetails)}
          </div>
          {teamsDetails?.isEditTeam && (
            <div
              className={cx(
                gClasses.FTwo12Black,
                gClasses.DisplayInlineBlock,
                gClasses.ML12,
                gClasses.PL12,
                gClasses.LeftBorder,
              )}
            >
              {getSettingsAction}
            </div>
          )}
          {isNormalMode && isShowAppTasks && (
            <div className={cx(gClasses.DisplayInlineBlock, gClasses.ML12)}>
              <Button
                onClickHandler={() => onAddTask()}
                colorSchema={isNormalMode && colorScheme}
                buttonText={APPLICATION_STRINGS(t).SYSTEM_DIRECTORY.ADD_TASK}
                type={EButtonType.PRIMARY}
              />
            </div>
          )}
          {deactivateTeamModalVisibility && teamDependency}
        </div>
      </div>
      {headerTabs}
    </div>
  );
}

TeamDetailsHeader.propTypes = {
  selectedTeamId: PropTypes.number.isRequired,
  state: PropTypes.objectOf(),
  teamsDetails: PropTypes.objectOf(),
};

const mapStateToProps = (state) => {
  return {
    state: state.TeamsReducer.teamDetails,
    teamCreateEditState: state.TeamsReducer.createEditTeam,
    isShowAppTasks: state.RoleReducer.is_show_app_tasks,
  };
};

const mapDispatchToProps = {
  getTeamDetailsThunk,
  getDependencyListThunk,
  deactivateTeamApiThunk,
  teamDetailsDataChange,
  createEditDataChange,
};

export default connect(mapStateToProps, mapDispatchToProps)(TeamDetailsHeader);
