import React, { useContext, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { connect } from 'react-redux';
import cx from 'clsx';
import { Tab, Title } from '@workhall-pvt-lmt/wh-ui-library';
import gClasses from 'scss/Typography.module.scss';
import styles from './PageNav.module.scss';
import style from '../Header.module.scss';
import { getAppComponentsThunk, getAppPagesThunk } from '../../../../redux/actions/Appplication.Action';
import { getPageTabData } from '../../app_builder/AppBuilder.utils';
import ThemeContext from '../../../../hoc/ThemeContext';
import { routeNavigate } from '../../../../utils/UtilityFunctions';
import { HOME_CONST, ROUTE_METHOD } from '../../../../utils/Constants';
import MoreIcon from '../../../../assets/icons/MoreIcon';
import jsUtility from '../../../../utils/jsUtility';
import { APP, DEFAULT_APP_ROUTE } from '../../../../urls/RouteConstants';
import { applicationStateChange } from '../../../../redux/reducer/ApplicationReducer';
import { EMPTY_STRING } from '../../../../utils/strings/CommonStrings';

function PageNav(props) {
  const { getPagesApiData, pages, getComponentsApi, isDisplayMultipleApp, isHome, appStateChange, appDetails, isResponsiveHeader = false } = props;
  const { app_uuid, page_uuid, app_name, page_name } = useParams();
  const history = useHistory();
  const { colorScheme } = useContext(ThemeContext);

  useEffect(() => {
    if (!isHome) {
      const params = {
        app_uuid,
      };
      if (app_name) {
        params.app_url_path = app_name;
        jsUtility.has(params, 'app_uuid') && delete params.app_uuid;
      }
      const pagesParams = {
        app_uuid,
        page_uuid,
      };
      if (app_name && page_name) {
        pagesParams.app_url_path = app_name;
        pagesParams.page_url_path = page_name;
        jsUtility.has(pagesParams, 'app_uuid') && delete pagesParams.app_uuid;
        jsUtility.has(pagesParams, 'page_uuid') && delete pagesParams.page_uuid;
      }
      getPagesApiData(params, () => getComponentsApi(pagesParams, true), true);
    }
  }, [app_name, page_name, page_uuid]);

  useEffect(() => {
    const pagesParams = {
      app_uuid,
      page_uuid,
    };
    if (app_name && page_name) {
      pagesParams.app_url_path = app_name;
      pagesParams.page_url_path = page_name;
      jsUtility.has(pagesParams, 'app_uuid') && delete pagesParams.app_uuid;
      jsUtility.has(pagesParams, 'page_uuid') && delete pagesParams.page_uuid;
    }
    getComponentsApi(pagesParams, true);
  }, [page_uuid, page_name, app_name]);

  const redirectToPage = (page_name_data) => {
    if (page_name === page_name_data) return;
    appStateChange({ layoutsDetails: [] });
    const pageNavPathName = isHome ? DEFAULT_APP_ROUTE : `${APP}${app_name}/${page_name_data}`;
    routeNavigate(history, ROUTE_METHOD.PUSH, pageNavPathName, null, null);
  };

  const getAppName = () => {
    const selectedApp = appDetails?.find((app) => app.url_path === app_name);
    return selectedApp?.name || EMPTY_STRING;
  };

  const getDisplayCount = () => {
    if (isResponsiveHeader) return 2;
    else if (isDisplayMultipleApp) return 7;
    else return 3;
  };

  return (
    <>
      {isDisplayMultipleApp && (
        <div className={styles.PageNav}>
          <Title content={getAppName()} className={styles.TitleData} />
        </div>
      )}
      <Tab
        className={cx(!isDisplayMultipleApp && gClasses.PT16, isDisplayMultipleApp && styles.TabSticky)}
        options={getPageTabData(pages, isHome)}
        bottomSelectionClass={styles.highlightClass}
        textClass={isDisplayMultipleApp ? styles.TabTextClass : style.TabText}
        onClick={redirectToPage}
        selectedTabIndex={isHome ? HOME_CONST : page_name}
        selectedPopperData={page_name}
        colorScheme={colorScheme}
        tabDisplayCount={getDisplayCount()}
        onPopperOptionSelect={redirectToPage}
        moreComponent={
          <MoreIcon className={cx(styles.moreIcon, isDisplayMultipleApp ? styles.multiColor : styles.fillWhite)} />
        }
        morePopperProps={{ className: gClasses.ZIndex22 }}
      />
    </>
  );
}

const mapStateToProps = (state) => {
  return {
    pages: state.ApplicationReducer.pages,
  };
};

const mapDispatchToProps = (dispatch) => {
    return {
      getPagesApiData: (params, func, isBasicUser) => {
        dispatch(getAppPagesThunk(params, func, isBasicUser));
      },
      appStateChange: (params) => {
        dispatch(applicationStateChange(params));
      },
      getComponentsApi: (params, isBasicUser) => {
        dispatch(getAppComponentsThunk(params, isBasicUser));
      },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PageNav);
