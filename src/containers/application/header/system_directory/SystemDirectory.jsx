import React, { useContext, useEffect, useState } from 'react';
import {
  BorderRadiusVariant,
  Button,
  EButtonSizeType,
  EButtonType,
  Input,
  Modal,
  ModalSize,
  ModalStyleType,
  Skeleton,
  Tab,
  Text,
  ETextSize,
  EButtonIconPosition,
} from '@workhall-pvt-lmt/wh-ui-library';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import cx from 'classnames/bind';
import CloseIconV2 from 'assets/icons/CloseIconV2';
import queryString from 'query-string';
import DatalistIconNew from '../../../../assets/icons/DatalistIconNew';
import gClasses from '../../../../scss/Typography.module.scss';
import { ARIA_ROLES, BS } from '../../../../utils/UIConstants';
import styles from './SystemDirectory.module.scss';
import SearchIconNew from '../../../../assets/icons/SearchIconNew';
import { keydownOrKeypessEnterHandle, getRouteLink, routeNavigate } from '../../../../utils/UtilityFunctions';
import { APPLICATION_STRINGS } from '../../application.strings';
import {
  getAllAppTeamsForSystemDirectory,
  getAllDataListsForSystemDirectory,
  getAllFlowForSystemDirectory,
} from '../../../../redux/actions/Appplication.Action';
import jsUtility, { get, isEmpty } from '../../../../utils/jsUtility';
import { getUrlFromTab } from '../../../flow/listFlow/ListFlow.utils';
import { initiateFlowApi } from '../../../../redux/actions/FloatingActionMenuStartSection.Action';
import { REDIRECTED_FROM, ROUTE_METHOD } from '../../../../utils/Constants';
import { PD_TAB } from '../../../flow/flow_dashboard/FlowDashboard.string';
import { DATALIST_ENTRY_ACTIONS } from '../../../data_list/data_list_dashboard/DataList.strings';
import { DATA_LIST_DASHBOARD, DEFAULT_APP_ROUTE, HOME, FLOW_DASHBOARD, TEAMS_EDIT_TEAM, TEAM_CREATE_TEAM, PRIVATE_TEAMS } from '../../../../urls/RouteConstants';
import { toggleAddDataListModalVisibility } from '../../../../redux/reducer/DataListReducer';
import ThemeContext from '../../../../hoc/ThemeContext';
import AppTeamsIcon from '../../../../assets/icons/app_builder_icons/AppTeamsIcon';
import { createTaskSetState } from '../../../../redux/reducer/CreateTaskReducer';
import NoSearchDataFoundIcon from '../../../../assets/icons/NoSearchDataFoundIcon';
import NoTeamsFoundIcon from '../../../../assets/icons/NoTeamsFound';
import PlusIconNew from '../../../../assets/icons/PlusIconV2';
import { HEADER_STRINGS } from '../header.utils';
import { TAB_ROUTE } from '../../app_components/dashboard/flow/Flow.strings';
import FlowStackIcon from '../../../../assets/icons/apps/FlowStackIcon';
import { clearCreateEditDetails } from '../../../../redux/reducer/TeamsReducer';

function SystemDirectory(props) {
  const { closeFn, onCloseClickHandler, isShowAppTasks } = props;
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const history = useHistory();
  const { colorScheme } = useContext(ThemeContext);
  const { systemDirectory } = useSelector((store) => store.ApplicationReducer);
  const flow_tabindex = useSelector(
    (store) => store.FlowListReducer.tab_index,
  );
  const pref_locale = localStorage.getItem('application_language');

  const { SYSTEM_DIRECTORY } = APPLICATION_STRINGS(t);
  const [tabIndex, setTabIndex] = useState(
    history?.location?.state?.tabIndexes ||
    SYSTEM_DIRECTORY.TAB_OPTIONS[0].value,
  );
  const [value, setValue] = useState('');

  useEffect(() => {
    if (tabIndex === SYSTEM_DIRECTORY.TAB_OPTIONS[0].value) {
      dispatch(getAllFlowForSystemDirectory({}));
    } else if (tabIndex === SYSTEM_DIRECTORY.TAB_OPTIONS[1].value) {
      dispatch(getAllDataListsForSystemDirectory({}));
    } else if (tabIndex === SYSTEM_DIRECTORY.TAB_OPTIONS[2].value) {
      const apiParams = {
        sort_by: 1,
        is_active: 1,
        sort_field: 'team_name',
        // size: 50,
        team_type: [3],
      };
      dispatch(getAllAppTeamsForSystemDirectory(apiParams));
    }
  }, [tabIndex]);

  let placeholder;
  if (tabIndex === SYSTEM_DIRECTORY.TAB_OPTIONS[0].value) {
    placeholder = SYSTEM_DIRECTORY.PLACEHOLDER_FLOW;
  } else if (tabIndex === SYSTEM_DIRECTORY.TAB_OPTIONS[1].value) {
    placeholder = SYSTEM_DIRECTORY.PLACEHOLDER_DL;
  } else if (tabIndex === SYSTEM_DIRECTORY.TAB_OPTIONS[2].value) {
    placeholder = SYSTEM_DIRECTORY.PLACEHOLDER_TEAMS;
  }

  const onTabChange = (_tabIndex) => {
    setTabIndex(_tabIndex);
    setValue('');
  };

  const onInputChange = (e) => {
    setValue(e.target.value);
    const search = e.target.value;
    if (search) {
      if (tabIndex === SYSTEM_DIRECTORY.TAB_OPTIONS[0].value) {
        dispatch(getAllFlowForSystemDirectory({ search }));
      } else if (tabIndex === SYSTEM_DIRECTORY.TAB_OPTIONS[2].value) {
        const apiParams = {
          sort_by: 1,
          is_active: 1,
          sort_field: 'team_name',
          search: search,
          // size: 50,
          team_type: [3],
        };
        dispatch(getAllAppTeamsForSystemDirectory(apiParams));
      } else {
        dispatch(getAllDataListsForSystemDirectory({ search }));
      }
    } else {
      if (tabIndex === SYSTEM_DIRECTORY.TAB_OPTIONS[0].value) {
        dispatch(getAllFlowForSystemDirectory({}));
      } else if (tabIndex === SYSTEM_DIRECTORY.TAB_OPTIONS[2].value) {
        const apiParams = {
          sort_by: 1,
          is_active: 1,
          sort_field: 'team_name',
          // size: 50,
          team_type: [3],
        };
        dispatch(getAllAppTeamsForSystemDirectory(apiParams));
      } else {
        dispatch(getAllDataListsForSystemDirectory({}));
      }
    }
  };

  const onClickHandler = (data) => {
    if (![SYSTEM_DIRECTORY.TAB_OPTIONS[0].value, SYSTEM_DIRECTORY.TAB_OPTIONS[1].value, SYSTEM_DIRECTORY.TAB_OPTIONS[2].value].includes(tabIndex)) return;
    let link;
    const uuid = data?.flow_uuid || data?.data_list_uuid || data?._id;
    if (tabIndex === SYSTEM_DIRECTORY.TAB_OPTIONS[0].value) {
      link = `${FLOW_DASHBOARD}/${uuid}/${TAB_ROUTE.ALL_REQUEST}`;
    } else if (tabIndex === SYSTEM_DIRECTORY.TAB_OPTIONS[1].value) {
      link = `${DATA_LIST_DASHBOARD}/${uuid}/${TAB_ROUTE.ALL_REQUEST}`;
    } else if (tabIndex === SYSTEM_DIRECTORY.TAB_OPTIONS[2].value) {
      link = `${PRIVATE_TEAMS}/${uuid}`;
    }
    closeFn();
    const systemDirectoryPathName = getRouteLink(link, history);
    routeNavigate(history, ROUTE_METHOD.PUSH, systemDirectoryPathName, null, null);
  };

  const onActionClickHandler = (uuid, actionData = null) => {
    if (tabIndex === SYSTEM_DIRECTORY.TAB_OPTIONS[0].value) {
      const postData = {
        flow_uuid: uuid,
        is_test_bed: 0,
      };
      const flowTabUrl = getUrlFromTab(flow_tabindex);
      dispatch(
        initiateFlowApi(postData, history, REDIRECTED_FROM.HOME, {
          flowTabUrl,
        }),
      );
      closeFn();
    } else if (tabIndex === SYSTEM_DIRECTORY.TAB_OPTIONS[2].value) {
      const currentParams = queryString.parseUrl(history.location.pathname);
      const newParams = { ...get(currentParams, ['query'], {}), create: 'task' };
      const systemDirectorySearchParams = new URLSearchParams(newParams).toString();
      routeNavigate(history, ROUTE_METHOD.PUSH, null, systemDirectorySearchParams, null);
      const assignees = {};
      assignees.teams = [];
      const evaluatedTeam = {
          is_active: actionData?.isActive,
          team_name: actionData?.teamName,
          team_type: actionData?.teamType,
          total_member_teams_count: actionData?.totalMemberTeamsCount,
          total_member_users_count: actionData?.totalMemberUsersCount,
          _id: actionData?._id,
      };
      assignees.teams.push(evaluatedTeam);
      dispatch(createTaskSetState({ assignees: assignees }));
      closeFn();
    } else {
      dispatch(toggleAddDataListModalVisibility(1));
      const dataListDashboardPathName = `${DATA_LIST_DASHBOARD}/${uuid}`;
      const dataListDashboardState = {
        dashboardTab: PD_TAB(t).ALL.TAB_INDEX,
        modalType: DATALIST_ENTRY_ACTIONS.ADD_DATA,
      };
      routeNavigate(history, ROUTE_METHOD.PUSH, dataListDashboardPathName, null, dataListDashboardState);
    }
    closeFn();
  };

  const onCreateTeam = () => {
    dispatch(clearCreateEditDetails());
    const currentParams = queryString.parseUrl(history.location.pathname);
    let newParams = { ...get(currentParams, ['query'], {}) };
    newParams = { ...newParams, create: 'teams' };
    const search = new URLSearchParams(newParams).toString();
    const routeData = { search };
    if (history.location.pathname.includes(TEAM_CREATE_TEAM) || history.location.pathname.includes(TEAMS_EDIT_TEAM)) {
      routeData.pathname = getRouteLink(HOME, history);
    }
    routeNavigate(history, ROUTE_METHOD.PUSH, DEFAULT_APP_ROUTE, search);
    closeFn();
  };

  const getResults = () => {
    if (
      jsUtility.isEmpty(systemDirectory.data) ||
      jsUtility.isArrayObjectsEmpty(systemDirectory.data)
    ) {
      if (tabIndex === SYSTEM_DIRECTORY?.TAB_OPTIONS[2]?.value && (isEmpty(value))) {
        return (
          <div className={cx(gClasses.CenterVH, gClasses.FlexDirectionColumn, BS.H100)}>
            <NoTeamsFoundIcon />
            <Text
              size={ETextSize.SM}
              className={gClasses.MT30}
              content={SYSTEM_DIRECTORY.NO_TEAMS}
              fontClass={cx(gClasses.FontWeight500, gClasses.BlackV12)}
            />
            <Text
              size={ETextSize.XS}
              className={gClasses.MT6}
              fontClass={gClasses.FTwo12BlackV21}
              content={SYSTEM_DIRECTORY.CREATE_YOUR_FIRST_TEAM}
            />
            <Button
              icon={<PlusIconNew className={styles.PlusIcon} />}
              type={EButtonType.PRIMARY}
              iconPosition={EButtonIconPosition.LEFT}
              colorSchema={colorScheme}
              className={gClasses.MT24}
              buttonText={SYSTEM_DIRECTORY.CREATE_TEAM}
              onClickHandler={() => onCreateTeam()}
            />
          </div>
        );
      }
      return (
        <div className={cx(gClasses.CenterVH, gClasses.FlexDirectionColumn, BS.H100)}>
          <NoSearchDataFoundIcon />
          <Text
            size={ETextSize.SM}
            className={gClasses.MT30}
            content={SYSTEM_DIRECTORY.NO_TEAMS_ON_SEARCH}
            fontClass={cx(gClasses.FontWeight500, gClasses.BlackV12)}
          />
          <Text
            size={ETextSize.XS}
            className={gClasses.MT6}
            fontClass={gClasses.FTwo12BlackV21}
            content={SYSTEM_DIRECTORY.TRY_SEARCHING}
          />
        </div>
      );
    }

    if (tabIndex === SYSTEM_DIRECTORY.TAB_OPTIONS[0].value) {
      return systemDirectory.data?.map((c) => (
        <>
          <div className={styles.GroupTitle}>{c.category}</div>
          {c.flows?.map((p) => (
            <div
              key={p.flow_uuid}
              role="button"
              tabIndex="0"
              className={styles.Result}
              onClick={() => onClickHandler(p)}
              onKeyDown={(e) =>
                keydownOrKeypessEnterHandle(e) && onClickHandler(p)
              }
            >
              <div className={styles.Content}>
                <FlowStackIcon className={styles.Icon} />
                <h3
                  title={p?.translation_data?.[pref_locale]?.flow_name || p.flow_name}
                >
                  {p?.translation_data?.[pref_locale]?.flow_name || p.flow_name}
                </h3>
                {p.flow_description && (
                  <p title={p?.translation_data?.[pref_locale]?.flow_description || p.flow_description}>
                    {p?.translation_data?.[pref_locale]?.flow_description || p.flow_description}
                  </p>
                )}
              </div>
              {p.is_initiate && (
                <Button
                  buttonText={SYSTEM_DIRECTORY.START}
                  className={styles.Btn}
                  size={EButtonSizeType.SM}
                  onClickHandler={() => onActionClickHandler(p.flow_uuid)}
                  colorSchema={colorScheme}
                  type={EButtonType.PRIMARY}
                />
              )}
            </div>
          ))}
        </>
      ));
    } else if (tabIndex === SYSTEM_DIRECTORY.TAB_OPTIONS[2].value) {
        return systemDirectory.data?.map((team) => (
            <div key={team._id} className={cx(BS.P_RELATIVE, styles.RowContainer)}>
              <div
                role="button"
                tabIndex="0"
                className={styles.Result}
                onClick={() => onClickHandler(team)}
                onKeyDown={(e) =>
                  keydownOrKeypessEnterHandle(e) && onClickHandler(team)
                }
              >
                <div className={styles.Content}>
                  <AppTeamsIcon className={styles.Icon} />
                  <h3 title={team?.teamName} className={(team?.teamName?.length > 40 && team?.description) ? styles.MaxTeamContent : styles.TeamsContent}>{team?.teamName}</h3>
                  {team.description && (
                    <p title={team.description}>
                      {team.description}
                    </p>
                  )}
                </div>
              </div>
              {isShowAppTasks && (
              <Button
                buttonText={SYSTEM_DIRECTORY.ADD_TASK}
                className={styles.BtnTeam}
                size={EButtonSizeType.SM}
                onClickHandler={() => onActionClickHandler(team._id, team)}
                colorSchema={colorScheme}
                type={EButtonType.PRIMARY}
              />)}
            </div>
        ));
    }
    return systemDirectory.data?.map((c) => (
      <>
        <div className={styles.GroupTitle}>{c.category}</div>
        {c.data_lists?.map((d) => (
          <div
            key={d.data_list_uuid}
            role="button"
            tabIndex="0"
            className={styles.Result}
            onClick={() => onClickHandler(d)}
            onKeyDown={(e) =>
              keydownOrKeypessEnterHandle(e) && onClickHandler(d)
            }
          >
            <div className={styles.Content}>
              <DatalistIconNew className={styles.Icon} />
              <h3 title={d?.translation_data?.[pref_locale]?.data_list_name || d.data_list_name}>
                {d?.translation_data?.[pref_locale]?.data_list_name || d.data_list_name}
              </h3>
              {d.data_list_description && (
                <p title={d?.translation_data?.[pref_locale]?.data_list_description || d.data_list_description}>
                  {d?.translation_data?.[pref_locale]?.data_list_description || d.data_list_description}
                </p>
              )}
            </div>
            {d.is_add_entry && (
              <Button
                buttonText={SYSTEM_DIRECTORY.ADD}
                className={styles.Btn}
                type={EButtonType.PRIMARY}
                size={EButtonSizeType.SM}
                onClickHandler={() => onActionClickHandler(d.data_list_uuid)}
                colorSchema={colorScheme}
              />
            )}
          </div>
        ))}
      </>
    ));
  };

  const getLoader = () =>
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => {
      const randomWidth = Math.floor(Math.random() * (200 - 85 + 1)) + 200;
      return <Skeleton key={`loader-${value}`} width={randomWidth} className={styles.Loader} />;
    });

  return (
    <Modal
      id={SYSTEM_DIRECTORY.ID}
      isModalOpen
      modalStyle={ModalStyleType.modal}
      modalSize={ModalSize.sm}
      mainContentClassName={styles.OverflowYAuto}
      className={gClasses.CursorDefault}
      enableEscClickClose
      onCloseClick={onCloseClickHandler}
      headerContent={
        <>
          <div className={styles.Header}>
            <h1 className={styles.Title}>{SYSTEM_DIRECTORY.TITLE}</h1>
            <button className={styles.CloseBtn} onClick={onCloseClickHandler}>
              <CloseIconV2
                className={gClasses.CursorPointer}
                ariaLabel={t(HEADER_STRINGS.ARIA_LABEL.CLOSE)}
                role={ARIA_ROLES.IMG}
                height="16"
                width="16"
              />
            </button>
          </div>
          <div className={styles.TabsContainer}>
            <Tab
              selectedTabIndex={tabIndex}
              onClick={onTabChange}
              options={SYSTEM_DIRECTORY.TAB_OPTIONS}
              bottomSelectionClass={styles.TabUnderLine}
              colorScheme={colorScheme}
            />
          </div>
        </>
      }
      mainContent={
        <div className={styles.MainContent}>
          <div className={cx(styles.InputContainer, tabIndex === SYSTEM_DIRECTORY.TAB_OPTIONS[2].value && BS.D_FLEX)}>
            <div className={BS.W100}>
              <Input
                className={cx(styles.SearchInput, styles.H40)}
                prefixIcon={<SearchIconNew className={styles.SearchIcon} />}
                content={value}
                placeholder={placeholder}
                onChange={onInputChange}
                borderRadiusType={BorderRadiusVariant.rounded}
              />
            </div>
            {tabIndex === SYSTEM_DIRECTORY.TAB_OPTIONS[2].value && (
              <Button
                buttonText={SYSTEM_DIRECTORY.CREATE_TEAM}
                className={cx(styles.Btn, styles.H40, gClasses.ML16)}
                type={EButtonType.PRIMARY}
                size={EButtonSizeType.SM}
                onClickHandler={() => onCreateTeam()}
                colorSchema={colorScheme}
              />
            )}
          </div>
          <div className={styles.ResultContainer}>
            {systemDirectory.loading ? getLoader() : getResults()}
          </div>
        </div>
      }
    />
  );
}

export default SystemDirectory;
