import React, { useContext, useRef } from 'react';
import { ETitleSize, Title, WorkHallPageLoader } from '@workhall-pvt-lmt/wh-ui-library';
import cx from 'clsx';
import { useTranslation } from 'react-i18next';
import gClasses from 'scss/Typography.module.scss';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { APP_COMPONENT_TYPE } from './AppComponent.constants';
import Tasks from './task_listing/tasks/Tasks';
import Flow from './dashboard/flow/Flow';
import { CancelToken } from '../../../utils/UtilityFunctions';
import { getConsolidatedFiltersForTask, getTaskParam } from './AppComponent.utils';
import Links from './links/Links';
import { BS } from '../../../utils/UIConstants';
import styles from '../app_builder/AppBuilder.module.scss';
import { EMPTY_STRING } from '../../../utils/strings/CommonStrings';
import TextStyling from './text_styling/TextStyling';
import ThemeContext from '../../../hoc/ThemeContext';
import { TASK_TABLE_TYPE } from './task_listing/TaskList.constants';
import AppCompSettingIcon from '../../../assets/icons/app_builder_icons/AppCompSettingIcon';
import ImageAppComponent from './image/ImageAppComponent';
import Datalist from './dashboard/datalist/Datalist';
import { TYPE_OPTION_LIST } from '../app_configuration/dashboard_configuration/DashboardConfig.strings';
import jsUtility, { get } from '../../../utils/jsUtility';
import Report from './report/Report';
import ExpandIcon from '../../../assets/icons/ExpandIcon';
import WebpageEmbed from './webpage_embed/WebpageEmbed';
import Tooltip from '../../../components/tooltip/Tooltip';
import { POPPER_PLACEMENTS } from '../../../components/auto_positioning_popper/AutoPositioningPopper';

function AppComponent(props) {
   const { componentType, compLayout, onComponentEdit, isBasicUser, isHoververd, currentPageName = EMPTY_STRING } = props;
   const location = useLocation();
   const { componentDetails, error } = compLayout;
   const { t } = useTranslation();
   const componentContainer = useRef(null);
   const app = useSelector((state) => state.ApplicationReducer);
   const { colorScheme, colorSchemeDefault } = useContext(ThemeContext);
   const colorSchema = isBasicUser ? colorScheme : colorSchemeDefault;
   const getComponent = () => {
       let component = null;

       switch (componentType) {
          case APP_COMPONENT_TYPE.TASK: {
               const recoveredFilter = get(location, ['state', 'defaultComponent', componentDetails?._id, 'pagination'], {});
               const { filter: defaultFilter, selectColumns, taskListType } = getTaskParam(componentDetails);
               const filter = getConsolidatedFiltersForTask(defaultFilter, recoveredFilter);
               component = (
                  app?.isPageTaskLoading ? <WorkHallPageLoader color={colorSchema?.activeColor && colorSchema?.activeColor} className={BS.H100} /> : (
                     <Tasks
                        coordinates={componentDetails?.coordination}
                        key={componentDetails?._id}
                        componentId={componentDetails?._id || EMPTY_STRING}
                        taskListType={taskListType}
                        dynamicColumnKeys={selectColumns}
                        defaultFilters={filter}
                        cancelToken={new CancelToken()}
                        hideScroll={!isBasicUser}
                        tableType={TASK_TABLE_TYPE.DYNAMIC_PAGINATION}
                        componentInfo={jsUtility.get(componentDetails, ['component_info'], {}) || {}}
                        currentPageName={currentPageName}
                     />
                  )
               );
            }
            break;
          case APP_COMPONENT_TYPE.DASHBOARDS:
            if (componentDetails?.component_info?.type === TYPE_OPTION_LIST(t)[0].value) {
               component = (
               <Flow
                  uuid={componentDetails?.component_info?.source_uuid}
                  componentId={componentDetails?._id}
                  componentLabel={componentDetails?.label}
                  cancelToken={new CancelToken()}
                  key={componentDetails?._id}
                  currentPageName={currentPageName}
                  componentContainer={componentContainer}
                  isAppDashboard
                  componentDetails={componentDetails}
               />);
            } else {
               component = (
                 <Datalist
                  uuid={componentDetails?.component_info?.source_uuid}
                  componentId={componentDetails?._id}
                  componentLabel={componentDetails?.label}
                  cancelToken={new CancelToken()}
                  key={componentDetails?._id}
                  componentContainer={componentContainer}
                  isAppDashboard
                  componentDetails={componentDetails}
                 />);
            }
          break;
          case APP_COMPONENT_TYPE.LINK:
            component = (
               <Links
                  componentDetails={componentDetails}
                  alignment={componentDetails?.alignment}
                  key={componentDetails?._id}
                  currentPageName={currentPageName}
               />
            );
          break;
          case APP_COMPONENT_TYPE.TEXT_STYLE: {
            component = <TextStyling componentDetails={componentDetails} key={componentDetails?._id} />;
            break;
         }
         case APP_COMPONENT_TYPE.IMAGE:
          component = <ImageAppComponent componentDetails={componentDetails} key={componentDetails?._id} />;
          break;
          case APP_COMPONENT_TYPE.REPORTS:
            component = <Report componentDetails={componentDetails} key={componentDetails?._id} isAppReport componentName={componentDetails?.label} />;
          break;
         case APP_COMPONENT_TYPE.WEBPAGE_EMBED:
            component = <WebpageEmbed componentDetails={componentDetails} key={componentDetails?._id} />;
          break;
         default: break;
       }

       return (
       <>
         {component}
         {!isBasicUser &&
            (
               <div className={cx(styles.overlay, error && styles.ErrorCompBorder, isHoververd && styles.OverlayHover)}>
                  <AppCompSettingIcon
                     className={styles.EditComp}
                     onClick={() => onComponentEdit(compLayout, componentType, compLayout)}
                  />
                  {isHoververd && <ExpandIcon className={styles.ExpandIcon} />}
               </div>
            )
         }
       </>
       );
   };

   if (componentType === APP_COMPONENT_TYPE.TEXT_STYLE || componentType === APP_COMPONENT_TYPE.IMAGE) {
      return <div className={cx(BS.P_RELATIVE, BS.H100, componentType === APP_COMPONENT_TYPE.IMAGE && styles.ImageComponentStyle)}>
               {getComponent()}
             </div>;
   }

   const getAlignmentClass = (alignment) => {
      if (alignment === 'center') return gClasses.TextAlignCenterImp;
      else if (alignment === 'right') return gClasses.TextAlignRightImp;
      else return gClasses.TextAlignLeftImp;
  };

   return (
    <div
      className={cx(
               BS.P_RELATIVE,
               gClasses.P24,
               styles.AppCompBorder,
               componentType === APP_COMPONENT_TYPE.LINK && cx(gClasses.Ellipsis, styles.AppComponent),
               'h-full w-full',
               gClasses.OverflowAuto,
            )}
      style={{ backgroundColor: componentDetails.color || colorScheme?.widgetBg }}
      ref={componentContainer}
    >
      <div id={`title_app_${componentDetails?._id}`}>
        {
        (![APP_COMPONENT_TYPE.DASHBOARDS, APP_COMPONENT_TYPE.REPORTS, APP_COMPONENT_TYPE.IMAGE, APP_COMPONENT_TYPE.TEXT_STYLE].includes(componentType)) &&
        (
        <div
        id={`title_app_${componentDetails?._id}`}
        >
         <Title
            content={componentDetails?.label}
            size={ETitleSize.xs}
            className={cx(styles.AppComponentTitle, componentType === APP_COMPONENT_TYPE.LINK && getAlignmentClass(componentDetails?.alignment))}
            colorScheme={{ ...colorScheme, activeColor: colorScheme?.highlight }}
         />
        </div>)
        }
        <Tooltip
          id={`title_app_${componentDetails?._id}`}
          content={componentDetails?.label}
          placement={POPPER_PLACEMENTS.BOTTOM_START}
          isCustomToolTip
          outerClass={cx(gClasses.OpacityFull)}
        />
      </div>
        {getComponent()}
    </div>

   );
}

export default AppComponent;
