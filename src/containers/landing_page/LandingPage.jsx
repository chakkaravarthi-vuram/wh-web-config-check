import React, { useState, useEffect } from 'react';
import { Prompt, useHistory, withRouter } from 'react-router-dom';
import cx from 'classnames/bind';
import queryString from 'query-string';
import { connect } from 'react-redux';
import Cookies from 'universal-cookie';
import { getUserProfileData, setUserProfileData } from 'utils/UtilityFunctions';
import Task from 'containers/task/task/Task';
import gClasses from 'scss/Typography.module.scss';
// import { BS } from 'utils/UIConstants';
// import { useSelector } from 'react-redux';
import jsUtils, { get } from 'utils/jsUtility';
import CreateDataList from 'containers/flow/create_data_list/CreateDataList';
import InitFlowModal from 'containers/edit_flow/InitFlowModal';
import { setWelcomeChange } from 'redux/reducer/WelcomeInsightsReducer';
import { getWelcomeMessageThunk } from 'redux/actions/Layout.Action';
// eslint-disable-next-line import/order
import { useTranslation } from 'react-i18next';
import { ROLES } from 'utils/Constants';
import { HOME } from 'urls/RouteConstants';
import styles from './LandingPage.module.scss';
// import QuickLinksPanel from './quick_links_panel/QuickLinksPanel';
import DataLists from './data_lists/DataLists';
import ToDoTask from './to_do_task/ToDoTask';
import Flows from './flows/Flows';
// import UserPanel from './user_panel/UserPanel';
import NoticeBoard from './notice_board/NoticeBoard';
import WelcomeInsights from './welcome_insights/WelcomeInsights';
import CarouselSlider from './carousel_slider/CarouselSlider';
import CreateApp from '../application/create_app/CreateApp';
import { routeNavigate } from '../../utils/UtilityFunctions';
import { ALL_ACTIONS, ROUTE_METHOD } from '../../utils/Constants';
import AddIntegration from '../integration/add_integration/AddIntegration';
import CreateEditTeam from '../team/create_and_edit_team/CreateEditTeam';
import CreateAppModal from '../application/create_app/create_app_modal/CreateAppModal';
import { EMPTY_STRING } from '../../utils/strings/CommonStrings';
// import TaskPromptSection from './task_prompt_section/TaskPromptSection';
// import NotificationContent from './main_header/notification/NotificationContent';

function LandingPage(props) {
  const { isWelcomeInsightsOpen, setWelcomeChange, welcomeApiCall, isWelcomeInsightsLoading, roleState } = props;
  const { i18n } = useTranslation();
  // const dispatch = useDispatch();
  const history = useHistory();
  // const [isMobile, setIsMobile] = useState(isMobileScreen());
  const [, setTaskModal] = useState(false);
  const [, setFlowModal] = useState(false);
  const [, setDatalistModal] = useState(false);
  const [, setApplistModal] = useState(false);
  const profile = getUserProfileData();
  const { show_cover } = profile;
  const [showCover, setShowCover] = useState(show_cover);
  const cookies = new Cookies();
  const URLParams = new URLSearchParams(jsUtils.get(history, ['location', 'search'], ''));
  let createAppModal = null;

  // const windowResize = () => {
  //   setIsMobile(isMobileScreen());
  // };

  useEffect(() => {
    isWelcomeInsightsOpen && welcomeApiCall();
    i18n.changeLanguage(localStorage.getItem('application_language'));

    if (roleState.role === ROLES.MEMBER) {
      if (URLParams.get('create') === 'flow' || URLParams.get('create') === 'datalist') {
        routeNavigate(history, ROUTE_METHOD.PUSH, HOME, null, null);
      }
    }
  }, []);

  useEffect(() => {
    if (history.location.state && history.location.state.createModalOpen) { setTaskModal(true); } else if (history.location.state && !history.location.state.createModalOpen) { setTaskModal(false); }
    if (history.location.state && history.location.state.createFlowModalOpen) { setFlowModal(true); }
    if (history.location.state && !history.location.state.createFlowModalOpen) { setFlowModal(false); }
    if (history.location.state && history.location.state.createDatalistModalOpen) { setDatalistModal(true); }
    if (history.location.state && !history.location.state.createDatalistModalOpen) { setDatalistModal(false); }
    if (history.location.state && history.location.state.createAppModalOpen) { setApplistModal(true); }
    if (history.location.state && !history.location.state.createAppModalOpen) { setApplistModal(false); }

    // onWindowResize(windowResize);
  });

  // useEffect(() => {
  //   if (!isNotificationsModalOpen) getNotificationsCountApiCall({ is_read: 0 });
  // }, [isNotificationsModalOpen]);

  const onCloseIconClick = () => {
    console.log('pop2');
    const currentParams = jsUtils.get(queryString.parseUrl(history.location.pathname), ['query'], {});
    routeNavigate(history, ROUTE_METHOD.PUSH, null, new URLSearchParams(currentParams).toString(), {
      createModalOpen: false,
      // type: 'Right',
    });
  };

  const promptBeforeLeaving = () => {
    if (isWelcomeInsightsOpen) {
      setWelcomeChange({ isWelcomeInsightsOpen: false });
      cookies.remove('welcome-show', {
        path: '/',
        domain: window.location.hostname,
      });
      if (cookies.get('invite-user')) {
        cookies.remove('invite-user', {
          path: '/',
          domain: window.location.hostname,
        });
      }
    }
  };

  const onNoticeClose = () => {
    setShowCover(false);
    setUserProfileData({ show_cover: false });
  };
  const onCloseCreateModal = () => {
    const currentParams = get(queryString.parseUrl(history.location.pathname), ['query'], {});
    delete currentParams.create;
    const navBarSearchParams = new URLSearchParams(currentParams).toString();
    const navBarState = {
      createModalOpen: false,
    };
    routeNavigate(history, ROUTE_METHOD.PUSH, EMPTY_STRING, navBarSearchParams, navBarState);
  };
  if (URLParams.get('create') === ALL_ACTIONS) {
    createAppModal = (
      <CreateAppModal
        onCloseCreateModal={onCloseCreateModal}
        createModalClass={styles.CreateAppModal}
      />
    );
  }

  return (
    <>
      <Prompt when message={promptBeforeLeaving} />
      <div className={cx(styles.ContentBlock)}>
        {showCover && isWelcomeInsightsOpen && <CarouselSlider showCover={showCover} onCloseClick={onNoticeClose} isWelcomeInsightsLoading={isWelcomeInsightsLoading} />}
        {isWelcomeInsightsOpen && !showCover && <WelcomeInsights className={gClasses.MB16} />}
        {showCover && !isWelcomeInsightsOpen && <NoticeBoard showCover={showCover} onCloseClick={onNoticeClose} />}
        {/* <TaskPromptSection /> */}
        {/* <Banner createModalOpen={(value) => setTaskModal(value)} /> */}
        {/* {isMobile ? (
          <div className={cx(styles.MobileDisplay)}>
            <UserPanel />
          </div>
        ) : null} */}
        <ToDoTask className={cx(styles.TaskList)} />
        {/* {isMobile ? (
          <div className={cx(styles.MobileDisplay, gClasses.PB30)}>
            <QuickLinksPanel isTrialDisplayed={isTrialDisplayed} />
          </div>
        ) : null} */}
        <Flows />
        <DataLists />
      </div>
      {/* {!isMobile ? (
        <div className={cx(styles.RightBlock, isTrialDisplayed && styles.TrialHeight)} id="right-block">
          <UserPanel />
          <QuickLinksPanel isTrialDisplayed={isTrialDisplayed} />
        </div>
      ) : null} */}
          {URLParams.get('create') === 'task' ? <Task onCloseClick={onCloseIconClick} /> : null}
          {console.log('gfsagasgfasg', URLParams.get('create'))}
          {
            roleState.role !== ROLES.MEMBER && (
              <>
                {URLParams.get('create') === 'flow' ? <InitFlowModal /> : null}
                {URLParams.get('create') === 'datalist' ? <CreateDataList /> : null}
                {URLParams.get('create') === 'app' ? <CreateApp onCloseClick={onCloseIconClick} /> : null}
                {URLParams.get('create') === 'integration' ? <AddIntegration isModalOpen /> : null}
                {URLParams.get('create') === 'teams' ? <CreateEditTeam /> : null}
              </>
            )
          }
          {createAppModal}
        {/* <div className={cx(gClasses.ZIndex10, BS.P_RELATIVE)}>
          {isNotificationsModalOpen && (
          <NotificationContent
            isModalOpen={isNotificationsModalOpen}
          />
          )}
        </div> */}
    </>
  );
}
const mapStateToprops = (state) => {
  return {
    isWelcomeInsightsOpen: state.WelcomeInsightReducer.isWelcomeInsightsOpen,
    isWelcomeInsightsLoading: state.WelcomeInsightReducer.isDataLoading,
    roleState: state.RoleReducer,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setWelcomeChange: (params) => {
      dispatch(setWelcomeChange(params));
    },
    welcomeApiCall: () => {
      dispatch(getWelcomeMessageThunk());
    },
    dispatch,
  };
};

export default withRouter(connect(mapStateToprops, mapDispatchToProps)(LandingPage));
