import React, { useCallback, useContext, useEffect, useState, useRef } from 'react';
import _ from 'lodash';
import cx from 'classnames/bind';
import { useTranslation } from 'react-i18next';
import { Text, ETextSize, WorkHallPageLoader } from '@workhall-pvt-lmt/wh-ui-library';
import { connect } from 'react-redux';
import { Prompt, useHistory, useParams, withRouter } from 'react-router-dom';
import { BS } from 'utils/UIConstants';
import Skeleton from 'react-loading-skeleton';
import style from './AppBuilder.module.scss';
import 'react-grid-layout/css/styles.css';
import AppBuilderLayout from './AppBuilderLayout';
import { AppBuilderElementDefaultDimensions } from './AppBuilder.utils';
import { AppBuilderElementList, APP_COMP_STRINGS, COMPONENT_INFO } from './AppBuilder.strings';
import AppBuilderTab from './app_builder_tab/AppBuilderTab';
import gClasses from '../../../scss/Typography.module.scss';
import AppHeader from './app_header/AppHeader';
import ToggleIcon from '../../../assets/icons/app_builder_icons/ToggleIcon';
import { getAppComponentsThunk, getComponentDetailsByApiThunk, saveCoordinatesThunk } from '../../../redux/actions/Appplication.Action';
import Tooltip from '../../../components/tooltip/Tooltip';
import { applicationClear, applicationStateChange } from '../../../redux/reducer/ApplicationReducer';
import { EMPTY_STRING } from '../../../utils/strings/CommonStrings';
import AppConfiguration from '../app_configuration/AppConfiguration';
import jsUtility from '../../../utils/jsUtility';
import AppBasicDetails from '../app_basic_details/AppBasicDetails';
import PublishApp from '../publish_app/PublishApp';
import { layoutMainWrapperId } from '../../../components/form_components/modal/Modal.strings';
import { NavToggle } from '../../../redux/actions/NavBar.Action';
import { DEFAULT_COLORS_CONSTANTS } from '../../../utils/UIConstants';
import ThemeContext from '../../../hoc/ThemeContext';
import CreateAppInstruction from '../create_app/create_app_instruction/CreateAppInstruction';
import { CREATE_APP, SIGNIN } from '../../../urls/RouteConstants';
import { APP_COMPONENT_TYPE } from '../app_components/AppComponent.constants';
import { getDevRoutePath, handleBlockedNavigation } from '../../../utils/UtilityFunctions';
import PageNotFound from '../../error_pages/PageNotFound';
import { randomNumberInRange } from '../../../utils/generatorUtils';
import { APP_HEADER_DISPLAY } from '../app_listing/app_header_settings/AppHeaderSettings.string';

function AppBuilder(props) {
  const { t } = useTranslation();
  const history = useHistory();
  const { getComponentsApi, layoutsDetails, appOnChange, current_page_id, app_id,
    isConfigurationOpen, activeComponent, appUuid, isBasicSettingsModalOpen, applicationClear,
    isPublishModalOpen, saveCoordinatesApi, isBasicUser = false, appName, isNavOpen, toggleFunction,
    isComponentLoading, hideClosePopper, customizedPagesData, current_page_uuid,
    isLoading, isFromAppCreationPrompt = false, closeInstruction, headerType } = props;
      const [layouts, setLayouts] = useState({ lg: [], md: [] });
      const [layoutmain, setLayoutMain] = useState([]);
      const [draggableDimensions, setDraggableElement] = useState(null);
      const [currentBreakpoint, setCurrentBreakpoint] = useState('lg');
      const [compactType] = useState('vertical');
      const [mounted, setMounted] = useState(false);
      const [toggleOpen, setToggleOpen] = useState(true);
      const [isAppInstructionOpen, setAppInstructionOpen] = useState(!isFromAppCreationPrompt);
      const [rerenderSize, setRerenderSize] = useState(true);
      const [toolbox, setToolbox] = useState({
        lg: [],
      });
      const currentPageDetails = (customizedPagesData || [])?.find?.((page) => page.uuid === current_page_uuid);
      const [blockNavigation, setNavigationBlockerStatus] = useState(true);
      const placeholderRowCountMax = Math.max(...layoutmain.map((layout) => layout.h + layout.y));
      const placeholderRowCount = Number.isFinite(placeholderRowCountMax) ? (placeholderRowCountMax + 1) * 4 : 4;
      const { app_uuid, page_uuid } = useParams();
      const { colorScheme, colorSchemeDefault } = useContext(ThemeContext);
      const colorSchema = isBasicUser ? colorScheme : colorSchemeDefault;
      const containerRef = useRef(null);
      const isDisplayMultipleApp = jsUtility.isEqual(headerType, APP_HEADER_DISPLAY.MULTIPLE);

      let appInstructionModal = null;
      const pathName = window.location.pathname;
      useEffect(() => {
          setLayoutMain(layoutsDetails);
          setLayouts({ lg: layoutsDetails, md: layoutsDetails });
      }, [JSON.stringify(layoutsDetails)]);

      useEffect(() => {
        if (!isBasicUser) {
          setRerenderSize(false);
          setTimeout(() => setRerenderSize(true), 500);
        }
      }, [isNavOpen]);

      useEffect(() => {
        const layoutMainDiv = document.getElementById(layoutMainWrapperId);
        const bodyElement = document.body;
        if (!isBasicUser) {
          toggleFunction({ isNavOpen: false });
          setTimeout(() => {
            if (layoutMainDiv) {
              layoutMainDiv.classList.add(style.OverFlowHidden);
            }
          }, 500);
        } else {
          bodyElement.classList.add(style.OverFlowHidden);
        }
        return () => {
          if (layoutMainDiv) {
            layoutMainDiv.classList.remove(style.OverFlowHidden);
            bodyElement.classList.remove(style.OverFlowHidden);
          }
          applicationClear();
        };
      }, []);

      useEffect(() => {
        setMounted(true);
        console.log('gsafgsafgas', app_uuid, page_uuid);
        if (!isFromAppCreationPrompt && ((current_page_id && app_id) || (app_uuid && page_uuid)) && !isBasicUser) {
          const params = {
            app_id: app_id,
            page_id: current_page_id,
          };
          getComponentsApi(params, isBasicUser);
        }
      }, [current_page_id, app_id, app_uuid, page_uuid, isFromAppCreationPrompt]);

      const onBreakpointChange = (breakpoint) => {
        setCurrentBreakpoint(breakpoint);
        setToolbox({
          ...toolbox,
          [breakpoint]: toolbox[breakpoint] || toolbox[currentBreakpoint] || [],
        });
      };

      const onCloseAppInstruction = () => {
        setAppInstructionOpen(false);
      };

      const onAdddComp = (compType, index) => {
        const layoutsData = layouts;
        layoutsData?.lg.push(AppBuilderElementDefaultDimensions(compType, index));
        layoutsData?.md.push(AppBuilderElementDefaultDimensions(compType, index));
        setLayouts(layoutsData);
        setLayoutMain(layoutmain.concat(AppBuilderElementDefaultDimensions(compType, index)));
      };

      const onRemoveItem = (i) => {
        setLayoutMain(_.reject(layoutmain, { i: i }));
      };

      const onLayoutChange = (layout) => {
        if (isFromAppCreationPrompt) return;
        const apiCoordinate = [];
        const layoutMainConstruct = [];
        layout?.forEach((updatedLayout) => {
          layoutmain?.forEach((existingLayout) => {
            if (Number(updatedLayout?.i) === existingLayout?.i) {
              const { x, y, w, h } = updatedLayout;
              const updateObj = {
                ...existingLayout,
                componentDetails: {
                  ...existingLayout.componentDetails,
                  coordination: {
                    ...existingLayout.componentDetails.coordination,
                    x,
                    y,
                    w,
                    h,
                  },
                },
                type: existingLayout.type,
                x,
                y,
                w,
                h,
              };
              const coordinateData = {};
              coordinateData.component_id = existingLayout.componentDetails._id;
              const apiCoordinatObj = {
                i: existingLayout.i,
                x,
                y,
                w,
                h,
                maxH: existingLayout.maxH,
                maxW: existingLayout.maxW,
                minH: existingLayout.minH,
                minW: existingLayout.minW,
                is_moved: false,
                is_static: false,
              };
              coordinateData.coordination = apiCoordinatObj;
              apiCoordinate.push(coordinateData);
              layoutMainConstruct.push(updateObj);
            }
          });
        });
        setLayoutMain(layoutMainConstruct);
        const params = {
          app_id: app_id,
          page_id: current_page_id,
          coordinate_data: apiCoordinate,
        };
        if (!jsUtility.isEmpty(params.coordinate_data)) {
          !isBasicUser && saveCoordinatesApi(params);
        }
      };

      const onDrop = (layout, layoutItem) => {
        if (!isBasicUser) {
          const addedLayouts = layoutmain.concat({ ...layoutItem, ...draggableDimensions });
        const draggableDimensionsCopy = jsUtility.cloneDeep(draggableDimensions);
        delete draggableDimensionsCopy.type;
        delete draggableDimensionsCopy.componentDetails;
        const activeComponent = {
          type: draggableDimensions.type,
          coordination: {
            ...draggableDimensionsCopy,
            x: layoutItem.x,
            y: layoutItem.y,
            is_static: false,
            is_moved: false,
          },
          alignment: 'left',
          app_id: app_id,
          app_uuid: appUuid,
          page_id: current_page_id,
          label: EMPTY_STRING,
          label_position: 'adjacent',
          component_info: COMPONENT_INFO[draggableDimensions.type],
        };
        appOnChange({ activeComponent: activeComponent, isConfigurationOpen: true, activeUpdatedLayout: addedLayouts });
        }
      };

      const toggleHandle = () => {
        setToggleOpen(!toggleOpen);
        setRerenderSize(false);
        setTimeout(() => setRerenderSize(true), 500);
        const adasf = layoutmain;
        setLayoutMain(adasf);
      };

      if (isAppInstructionOpen) {
        appInstructionModal = (
          <CreateAppInstruction
            onCloseInstructionModal={onCloseAppInstruction}
          />
        );
      }

      const onComponentEdit = (layout, type, compData) => {
        const { errorInComponentData, componentIndex, pageIndex } = compData;
        const { getComponentDetailsByIdApi } = props;
        const layoutComp = jsUtility.cloneDeep(layout);
        const objActiveComponent = layoutComp?.componentDetails;

        if (layoutComp?.type === APP_COMPONENT_TYPE.IMAGE || layout?.type === APP_COMPONENT_TYPE.LINK) {
          getComponentDetailsByIdApi(layoutComp?.componentDetails?._id, t);
        } else {
          const appData = {
            activeComponent: objActiveComponent,
            isConfigurationOpen: true,
          };
          if (errorInComponentData) {
            appData.isComponentError = true;
            appData.componentIndex = componentIndex;
            appData.pageIndex = pageIndex;
            if (type === APP_COMP_STRINGS.LINK) {
              const linkError = {};
              errorInComponentData?.forEach((error) => {
                linkError[error] = 'Selected Dashboard is deleted, try another';
              });
              console.log('gfdgagasdgf', linkError);
              appData.error_list_config = linkError;
            } else {
              appData.error_list_config = { [errorInComponentData]: 'Selected Dashboard is deleted, try another' };
            }
          }
          appOnChange(appData);
        }
      };

      const appLayoutProps = {
        appBuilderDimensions: props,
        breakpoint: currentBreakpoint,
        layouts: layouts,
        mounted: mounted,
        compactType: compactType,
        layoutmain: layoutmain,
        draggableDimensions: draggableDimensions,
        isBasicUser: isBasicUser,
        toggleOpen: toggleOpen,
        rerenderSize: rerenderSize,
      };

      const getAppLayout = useCallback(() => {
        if (isFromAppCreationPrompt) {
          return <div className={cx(gClasses.CenterVH, BS.H100)}><WorkHallPageLoader color={colorSchema?.activeColor && colorSchema?.activeColor} /></div>;
        }
        if (rerenderSize && !isComponentLoading) {
          return (<AppBuilderLayout
          onAdddComp={onAdddComp}
          // generateDOM={generateDOM}
          onDrop={onDrop}
          onLayoutChange={onLayoutChange}
          onBreakpointChange={onBreakpointChange}
          onRemoveItem={onRemoveItem}
          onComponentEdit={onComponentEdit}
          currentPageDetails={currentPageDetails}
          heightReference={containerRef?.current?.clientHeight}
          {...appLayoutProps}
          />);
      }
        return <div className={cx(gClasses.CenterVH, BS.H100)}><WorkHallPageLoader color={colorSchema?.activeColor && colorSchema?.activeColor} /></div>;
      }, [JSON.stringify(appLayoutProps), isFromAppCreationPrompt]);

      const promptBeforeLeaving = (location) => {
        if ((location.pathname !== SIGNIN && !hideClosePopper) &&
        blockNavigation) {
          handleBlockedNavigation(
            t,
            () => {
              setNavigationBlockerStatus(false);
            },
            history,
            {
              ...location,
            },
          );
        } else return true;
        return false;
      };

      return (
        <>
        <Prompt when={!isBasicUser} message={promptBeforeLeaving} />
        {pathName === getDevRoutePath(CREATE_APP) && !closeInstruction && appInstructionModal}
        {!isBasicUser &&
        <>
          <AppHeader appUuid={appUuid} app_id={app_id} appName={appName} isBasicUser={isBasicUser} />
          <AppConfiguration isBasicUser={isBasicUser} isPopperOpen={isConfigurationOpen} type={activeComponent?.type} />
        </>}
          <div className={cx(BS.D_FLEX, BS.W100, gClasses.OverflowXHidden, (!isDisplayMultipleApp && isBasicUser) && style.AppContainerHeight)}>
            <div style={{ backgroundColor: colorScheme?.appBg || DEFAULT_COLORS_CONSTANTS.GRAY_103 }} className={cx(style.AppBuilderContainer, toggleOpen ? style.AppContainerToggle : style.AppContainerWoToggle, isBasicUser && style.W100Imp)}>
              {!isBasicUser &&
              <div className={cx(style.TabContainer, BS.P_RELATIVE)}>
                <AppBuilderTab isBasicUser={isBasicUser} />
              </div>}
              {isLoading ? (
                <div className={cx(style.LoaderComponent, gClasses.M24)}>
                  {[...Array(4)].map(() => (
                    <div style={{ backgroundColor: colorScheme.widgetBg }}>
                      <Skeleton width={`${randomNumberInRange(40, 100)}%`} />
                      <Skeleton width={`${randomNumberInRange(40, 100)}%`} />
                      <Skeleton width={`${randomNumberInRange(40, 100)}%`} />
                      <Skeleton width={`${randomNumberInRange(40, 100)}%`} />
                    </div>
                  ))}
                </div>
              ) : !isBasicUser || layoutsDetails.length > 0 ? (
              <div className={cx(BS.W100, gClasses.OverflowYAuto, !isBasicUser && style.LayoutDndContainer, BS.P_RELATIVE)}>
                {getAppLayout()}
                {!isBasicUser && rerenderSize && !isComponentLoading && !isFromAppCreationPrompt && (
                <div className={cx(BS.ABSOLUTE, style.BgPlaceholderContainer)} ref={containerRef} style={{ backgroundColor: colorScheme?.appBg }}>
                  {[...Array(placeholderRowCount)].map((row) => <div key={row} className={style.BgPlaceholder} />)}
                </div>
                )}
                <div />
              </div>
              ) : <div><PageNotFound /></div>}
            </div>
            {!isBasicUser &&
            (
            <div className={cx(style.ComponentDnd, !toggleOpen && style.w72)}>
              <div className={cx(style.ComponentDndHeader, gClasses.CenterV, gClasses.PX20, !toggleOpen ? BS.JC_CENTER : gClasses.JusSpaceBtw)}>
                {toggleOpen && <Text content="Components" size={ETextSize.LG} className={cx(gClasses.GrayV3, gClasses.MR30)} />}
                <ToggleIcon className={cx(gClasses.CursorPointer, style.IconsStrokeHover, !toggleOpen && style.ToggleIcon)} onClick={() => toggleHandle()} />
              </div>
              <div className={cx(style.ElementGrid, gClasses.CenterV, BS.FLEX_COLUMN)}>
                {AppBuilderElementList(t).map((element) => (
                  <div
                    key={element.elementName}
                    id={`navtools${element.type}`}
                    className={cx(style.DragElement, gClasses.CenterV, gClasses.MB12, toggleOpen ? style.ToggleOpen : style.ToggleClose)}
                    draggable
                    unselectable="on"
                    onDragStart={(e) => {
                      e.dataTransfer.setData('text/plain', '');
                      setDraggableElement(AppBuilderElementDefaultDimensions(element.type, layoutmain.length, true));
                    }}
                  >
                    <div className={cx({ [style.W32]: toggleOpen })}>
                      <element.icon className={element.type === APP_COMP_STRINGS.TEXT_EDITOR && style.TextStyle} />
                    </div>
                    {toggleOpen && <Text size={ETextSize.SM} content={element.elementName} fontClass={gClasses.FontWeight500} className={cx(gClasses.BlackV12)} />}
                    <Tooltip
                      id={`navtools${element.type}`}
                      content={
                        <div className={BS.TEXT_LEFT}>
                          <div className={cx(gClasses.FTwo13, gClasses.MB4)}>{element.elementName}</div>
                          <div className={gClasses.FTwo11}>{element.elementDesc}</div>
                        </div>}
                      placement="top"
                      isCustomToolTip
                      outerClass={style.Opac1}
                      customInnerClasss={style.BgBlack}
                    />
                  </div>
                  ))}
              </div>
            </div>)}

          </div>
          {isBasicSettingsModalOpen && !isBasicUser && <AppBasicDetails />}
          {isPublishModalOpen && !isBasicUser && <PublishApp />}
        </>
      );
}

const mapStateToProps = (state) => {
  return {
    layoutsDetails: state.ApplicationReducer.layoutsDetails,
    hideClosePopper: state.ApplicationReducer.hideClosePopper,
    isComponentLoading: state.ApplicationReducer.isComponentLoading,
    current_page_id: state.ApplicationReducer.current_page_id,
    app_id: state.ApplicationReducer.activeAppData.id,
    appUuid: state.ApplicationReducer.activeAppData.app_uuid,
    isConfigurationOpen: state.ApplicationReducer.isConfigurationOpen,
    activeComponent: state.ApplicationReducer.activeComponent,
    isBasicSettingsModalOpen: state.ApplicationReducer.activeAppData.isBasicSettingsModalOpen,
    isPublishModalOpen: state.ApplicationReducer.activeAppData.isPublishModalOpen,
    appName: state.ApplicationReducer.activeAppData.name,
    isNavOpen: state.NavBarReducer.isNavOpen,
    current_page_uuid: state.ApplicationReducer.current_page_uuid,
    customizedPagesData: state.ApplicationReducer.customizedPagesData,
    isFromAppCreationPrompt: state.ApplicationReducer.isFromAppCreationPrompt,
    isLoading: state.ApplicationReducer.isLoading,
    closeInstruction: state.ApplicationReducer.activeAppData.closeInstructionMessage,
    headerType: state.RoleReducer.app_header_type,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getComponentsApi: (params, isBasicUser) => {
      dispatch(getAppComponentsThunk(params, isBasicUser));
    },
    appOnChange: (params) => {
      dispatch(applicationStateChange(params));
    },
    saveCoordinatesApi: (params) => {
      dispatch(saveCoordinatesThunk(params));
    },
    getComponentDetailsByIdApi: (componentId, t) => {
      dispatch(getComponentDetailsByApiThunk(componentId, t));
    },
    applicationClear: () => {
      dispatch(applicationClear());
    },
    toggleFunction: (data) => {
      dispatch(NavToggle(data));
    },
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AppBuilder));

AppBuilder.defaultProps = {
    className: 'layout',
    cols: { lg: 4, md: 4, sm: 4, xs: 1, xxs: 1 },
    rowHeight: 100,
    breakpoints: { lg: 300, md: 200 },
    containerPadding: [24, 24],
    margin: [24, 24],
};
