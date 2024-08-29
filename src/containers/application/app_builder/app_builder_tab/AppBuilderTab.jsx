import React, { useEffect, useRef, useState } from 'react';
import { Text } from '@workhall-pvt-lmt/wh-ui-library';
import cx from 'classnames/bind';
import { connect } from 'react-redux';
import { useParams, withRouter } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useClickOutsideDetector } from 'utils/UtilityFunctions';
import { APP_TAB_VALUE, APP_UNTITLED_PAGE, UNTITLED_PAGE_1 } from '../AppBuilder.strings';
import styles from '../AppBuilder.module.scss';
import gClasses from '../../../../scss/Typography.module.scss';
import { BS } from '../../../../utils/UIConstants';
import TriangleDownIcon from '../../../../assets/icons/app_builder_icons/TriangleDown';
import AutoPositioningPopper, { POPPER_PLACEMENTS } from '../../../../components/auto_positioning_popper/AutoPositioningPopper';
import { deleteAppPagesThunk, getAppDataApiThunk, getAppPagesThunk, savePagesThunk, updatePageOrderApiThunk, saveAppApiThunk, getDraftAppDataApiThunk, getCurrentAppVersionApiThunk } from '../../../../redux/actions/Appplication.Action';
import 'react-multi-carousel/lib/styles.css';
import { editAnywayApiThunk } from '../../../../redux/actions/Layout.Action';
import jsUtility, { cloneDeep, isEmpty } from '../../../../utils/jsUtility';
import { applicationComponentDataChange, applicationDataChange, applicationPageConfigChange, applicationPageSettingClear, applicationStateChange } from '../../../../redux/reducer/ApplicationReducer';
import { validate } from '../../../../utils/UtilityFunctions';
import { CREATE_APP, EDIT_APP } from '../../../../urls/RouteConstants';
import { getDynamicAppOptions } from '../AppBuilder.utils';
import DeleteConfirmModal from '../../delete_comfirm_modal/DeleteConfirmModal';
import { GET_APP_LIST_LABEL } from '../../app_listing/AppList.constants';
import AppPageSettings from '../app_page_settings/AppPageSettings';
import { appPageSchema, getPageSettingsValidationData } from '../../application.validation.schema';
import AppTabCarousel from './app_tab_carousel/AppTabCarousel';
import { savePagesList } from '../../../../redux/actions/AppCreationFromPrompt.Action';

let cancelTokenPages;

export const getCancelTokenGetPages = (cancelToken) => {
    cancelTokenPages = cancelToken;
};

function AppBuilderTab(props) {
    const { t } = useTranslation();
    const { getPagesApiData, pagesData, deletPageApi, savePagesApi, current_page_id,
    appOnChange, app_id, saveAppApi, history, getAppCurrentVersionApi,
    updateOptionsApi, isBasicUser, isPageSettingsModelOpen,
    activeAppData, appPageConfigDataChange, currentPageConfig, appPageSettingClear,
    isFromAppCreationPrompt, applicationDataChange } = props;
    const { app_uuid, app_name } = useParams();
    const [tabData, setTabData] = useState([]);
    const [counter, setCounter] = useState(0);
    const [isPopperOpen, setIsPopperOpen] = useState(false);
    const [referencePopperElement, setReferencePopperElement] = useState(null);
    const [deleteStatus, setDeleteStatus] = useState(false);
    const [selectedTabPopper, setSelectedTabPopper] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const containerRef = useRef(null);
    const tabContainerRef = useRef(null);
    const APP_LIST_LABEL = GET_APP_LIST_LABEL(t);

    const prevSlide = () => {
        if ((currentPage - 1) >= 1) {
            setCurrentPage(currentPage - 1);
            setCurrentIndex((prevIndex) => prevIndex - 1);
        }
    };

    const totalPagesCount = () => {
        const scrollArea = containerRef?.current?.scrollWidth;
        let totalPages = scrollArea / (tabContainerRef?.current?.offsetWidth || 1000);
        totalPages = (totalPages % 1 > 0) ? Math.trunc(totalPages) + 1 : totalPages;
        return totalPages;
    };

    const nextSlide = () => {
        if ((currentPage + 1) <= totalPagesCount()) {
            setCurrentPage(currentPage + 1);
            setCurrentIndex((prevIndex) => prevIndex + 1);
        }
    };

    const saveIntialPages = () => {
        const params = {
            name: APP_LIST_LABEL.UNTITLED_PAGE_NAME,
            app_id: app_id,
            is_inherit_from_app: true,
            order: 1,
            url_path: APP_LIST_LABEL.UNTITLED_PAGE_URL,
        };
        const newTab = {
            labelText: t(UNTITLED_PAGE_1),
            tabIndex: 1,
            Icon: TriangleDownIcon,
            isEditable: false,
            error: false,
        };
        appOnChange({ customizedPagesData: [newTab] });
        setTabData([newTab]);
        savePagesApi(params, 0, true);
    };

    const getPageDataFunction = (id, holdCurrentPage, pageInFocus = null) => {
        const params = {
            app_id: id || app_id,
        };
        if (app_name) {
            params.app_url_path = app_name;
            jsUtility.has(params, 'app_id') && delete params.app_id;
        }
        if (cancelTokenPages) cancelTokenPages();
        getPagesApiData(params, !app_uuid && !isBasicUser && saveIntialPages, isBasicUser, holdCurrentPage, pageInFocus);
    };

    const saveAppFunction = (activeAppData) => {
        const appAdmins = {};
        if (activeAppData?.admins?.teams && activeAppData?.admins?.teams?.length > 0) {
        appAdmins.teams =
        activeAppData?.admins?.teams?.map((team) => team._id);
        }

        if (activeAppData?.admins?.users && activeAppData?.admins?.users?.length > 0) {
        appAdmins.users =
        activeAppData?.admins?.users?.map((user) => user._id);
        }

        const appViewers = {};
        if (activeAppData?.viewers?.teams && activeAppData?.viewers?.teams?.length > 0) {
        appViewers.teams =
        activeAppData?.viewers?.teams?.map((team) => team._id);
        }

        if (activeAppData?.viewers?.users && activeAppData?.viewers?.users?.length > 0) {
        appViewers.users =
        activeAppData?.viewers?.users?.map((user) => user._id);
        }
        const saveData = {
            name: activeAppData?.name,
           ...(!isEmpty(activeAppData?.description) ? { description: activeAppData?.description } : null),
        //    ...(activeAppData?.id ? { _id: activeAppData?.id } : null),
           ...(activeAppData?.app_uuid ? { app_uuid: activeAppData?.app_uuid } : null),
            admins: appAdmins,
            viewers: appViewers,
        };
        saveAppApi(saveData, t, history, false, false, getPageDataFunction);
    };

    const updatePagesInAppData = (data, pagesList) => {
        appOnChange({ ...data });
        setTabData(pagesList);
    };

    useEffect(() => {
        if (isFromAppCreationPrompt) {
            const { savePagesList } = props;
            savePagesList(activeAppData.promptPagesData, updatePagesInAppData, t);
        } else if (history?.location?.pathname?.includes(EDIT_APP) && app_uuid) {
            getAppCurrentVersionApi({ app_uuid: app_uuid }, !isBasicUser && saveAppFunction);
        } else if (history?.location?.pathname?.includes(CREATE_APP) && !activeAppData.name) {
            const { app_history_admins, app_history_viewers, app_history_uuid, app_history_app_name, app_history_description, app_history_url_path } = history.location.state;
            applicationDataChange?.({ ...activeAppData,
                name: app_history_app_name,
                description: app_history_description,
                url_path: app_history_url_path,
                admins: app_history_admins,
                viewers: app_history_viewers,
                app_uuid: app_history_uuid,
                closeInstructionMessage: true,
            });
            const saveData = {
                name: app_history_app_name,
                description: app_history_description,
                app_uuid: app_history_uuid,
                admins: app_history_admins,
                viewers: app_history_viewers,
            };
            saveAppApi(saveData, t, history, false, false, getPageDataFunction);
        } else if (!history?.location?.pathname?.includes(EDIT_APP)) {
            getPageDataFunction();
        }
    }, []);

    useEffect(() => {
        if (!jsUtility.isEmpty(pagesData)) {
            setTabData(pagesData);
        }
    }, [JSON.stringify(pagesData)]);

    const closeModal = () => {
        setIsPopperOpen(false);
    };
    const wrapperRef = useRef(null);
    useClickOutsideDetector(wrapperRef, closeModal);

    const pageScrollNavigateOnPageAdd = (existingTab) => {
        setTabData(existingTab);
        setTimeout(() => {
            setCurrentPage(totalPagesCount());
            setCurrentIndex(totalPagesCount() - 1);
        }, 500);
    };

    const addTabClick = () => {
        let existingTab = cloneDeep(tabData);
        let untitledPageCount = 0;
        const orderCount = tabData[tabData.length - 1].order || tabData[tabData.length - 1].tabIndex;
        const pageArray = [];
        existingTab?.forEach((tab) => {
            if (tab?.labelText?.includes(`${APP_UNTITLED_PAGE} `)) {
                const countChar = tab?.labelText?.slice(-2);
                if (!Number.isNaN(Number(countChar))) pageArray.push(Number(countChar));
            }
        });
        const sortedPageArray = pageArray.sort((inst1, inst2) => inst1 - inst2);
        const lastPageIndex = sortedPageArray[sortedPageArray.length - 1];
        untitledPageCount = existingTab.map((tab) => (tab.labelText.includes(APP_UNTITLED_PAGE)) && tab.labelText).length + 1;
        let tabName = APP_UNTITLED_PAGE;
        if (untitledPageCount) {
            const nameAlreadyExist = tabData.some((tab) => tab.labelText === `${APP_UNTITLED_PAGE} ${lastPageIndex || untitledPageCount}`);
            if (!nameAlreadyExist) {
                tabName = `${APP_UNTITLED_PAGE} ${untitledPageCount}`;
            } else {
                let tempCount = lastPageIndex || 1;
                while (tabData?.length < 10) {
                    const currentCount = tempCount;
                    const nameAlreadyExistCheck = tabData.some((tab) => tab.labelText === `${APP_UNTITLED_PAGE} ${currentCount}`);
                    if (!nameAlreadyExistCheck) {
                        tabName = `${APP_UNTITLED_PAGE} ${currentCount}`;
                        break;
                    }
                    tempCount++;
                }
            }
        }
        const newTab = {
                labelText: tabName,
                tabIndex: orderCount + 1,
                Icon: TriangleDownIcon,
                isEditable: false,
            };
        existingTab = [...existingTab, newTab];
        setCounter(counter + 1);
        const params = {
            app_id: app_id,
            order: orderCount + 1,
        };
        params.isPageSettingsModelOpen = true;
        appPageConfigDataChange(params);
    };

    const onDeletePageConfirmClick = () => {
        const params = {
            _id: selectedTabPopper,
        };
        const selectedIndex = tabData.find((tab) => tab.value === selectedTabPopper)?.tabIndex;
        let pageInFocus;
        if (selectedIndex === 1) pageInFocus = 1;
        else pageInFocus = selectedIndex - 1;
        let tabDetails = cloneDeep(tabData);
        tabDetails = tabDetails.filter((tab) => tab.value !== selectedTabPopper);
        const pageDetails = tabDetails.map((tab, index) => {
            return { page_id: tab.value, order: index + 1 };
        });
        const updateOrderParams = {
            app_id: app_id,
            page_details: pageDetails,
        };
        deletPageApi(params, app_id, isBasicUser, () => updateOptionsApi(updateOrderParams, () => getPageDataFunction(null, true, pageInFocus - 1)));
        setDeleteStatus(false);
    };

    const onOptionSelect = (options) => {
        setIsPopperOpen(false);
        const tabDetails = cloneDeep(tabData);
        if (options.value === 'delete') {
            setDeleteStatus(true);
        } else if (options.value === 'Move Right') {
            const index = tabDetails.findIndex((tab) => tab.value === current_page_id);
            tabDetails[index + 1].tabIndex = tabData[index].tabIndex;
            tabDetails[index].tabIndex = tabData[index + 1].tabIndex;
            const pageDetails = tabDetails.map((tab) => {
                return { page_id: tab.value, order: tab.tabIndex };
            });

            const params = {
                app_id: app_id,
                page_details: pageDetails,
            };
            updateOptionsApi(params, () => getPageDataFunction(app_id, true));
        } else if (options.value === 'Move Left') {
            const index = tabDetails.findIndex((tab) => tab.value === current_page_id);
            const leftObj = tabDetails[index - 1];
            leftObj.tabIndex = tabData[index].tabIndex;
            const rightObj = tabDetails[index];
            rightObj.tabIndex = tabData[index - 1].tabIndex;
            tabDetails[index] = leftObj;
            tabDetails[index - 1] = rightObj;
            const params = {
                app_id: app_id,
                page_details: tabDetails.map((tab) => {
                    return { page_id: tab.value, order: tab.tabIndex };
                }),
            };
            updateOptionsApi(params, () => getPageDataFunction(app_id, true));
        } else if (options.value === APP_TAB_VALUE.PAGE_SETTINGS) {
            const pageData = jsUtility.find(activeAppData?.pages, { _id: current_page_id });
            const viewersData = { teams: pageData?.viewers?.teams, users: [] };
            const data = {
                name: pageData?.name,
                url_path: pageData?.url_path,
                viewers: viewersData || { users: [], teams: [] },
                inheritFromApp: pageData?.is_inherit_from_app,
                isPageSettingsModelOpen: true,
                order: pageData?.order,
                page_id: pageData?._id,
                page_uuid: pageData?.page_uuid,
            };
            appPageConfigDataChange(data);
            const index = tabDetails.findIndex((tab) => tab.value === current_page_id);
            tabDetails[index].isEditable = true;
            setTabData(tabDetails);
        }
    };

    const tabOptionPopper = () => {
        const index = tabData.findIndex((tab) => tab.value === current_page_id);
        return (
            <AutoPositioningPopper
                className={cx(gClasses.ZIndex10)}
                placement={POPPER_PLACEMENTS.BOTTOM}
                isPopperOpen={isPopperOpen}
                referenceElement={referencePopperElement}
            >
                <div className={cx(styles.PopperLayout)} ref={wrapperRef}>
                    {getDynamicAppOptions(index === 0, index === (tabData.length - 1), tabData.length === 1, t).map((options) => (
                        <button className={styles.PopperElement} key={options.value} onClick={() => onOptionSelect(options)}><Text className={options.value.includes('delete') ? gClasses.RedV22 : gClasses.BlackV12} content={options.label} /></button>),
                    )}
                </div>
            </AutoPositioningPopper>
        );
    };

    const onOptionsClick = (id, value) => {
        setSelectedTabPopper(value);
        setReferencePopperElement(document.getElementById(id));
        setIsPopperOpen(true);
    };

    const onTabChange = (value) => {
        if (value?.value !== current_page_id) {
            appOnChange({ current_page_id: value?.value, current_page_uuid: value?.uuid });
        }
    };

    const updatePageNameSettings = () => {
        let existingTab = cloneDeep(tabData);
        const { viewers, url_path, name, order, inheritFromApp, page_id, page_uuid } = currentPageConfig;
        const newTab = {
            labelText: name,
            tabIndex: order,
            Icon: TriangleDownIcon,
            isEditable: false,
        };
        existingTab = [...existingTab, newTab];
        const params = {
            app_id: app_id,
            is_inherit_from_app: inheritFromApp,
            order,
            name,
            url_path,
        };
        if (page_id && page_uuid) {
            params._id = page_id;
            params.page_uuid = page_uuid;
        }
        if (!isEmpty(viewers?.teams)) {
            params.viewers = { teams: viewers?.teams?.map((team) => team._id) || [] };
        } else if (!inheritFromApp) {
            params.viewers = { teams: activeAppData?.viewers?.teams?.map((team) => team._id) || [] };
        }
        const errorList = validate(getPageSettingsValidationData(currentPageConfig), appPageSchema(t));
        if (isEmpty(errorList)) {
            if (page_id && page_uuid) {
                savePagesApi(params, order - 1, false, false, true, false, () => { appPageConfigDataChange({ isPageSettingsModelOpen: false }); appPageSettingClear(); }, t);
            } else {
                savePagesApi(params, order - 1, false, newTab, false, false, () => { pageScrollNavigateOnPageAdd([...existingTab, newTab]); appPageConfigDataChange({ isPageSettingsModelOpen: false }); appPageSettingClear(); }, t);
            }
        } else {
            appPageConfigDataChange({ errorList });
        }
    };

    return (
        <>
            <div className={cx(BS.P_RELATIVE)}>
                <DeleteConfirmModal
                    isModalOpen={deleteStatus}
                    content={APP_LIST_LABEL.DELETE_PAGE}
                    firstLine={APP_LIST_LABEL.DELETE_PAGE_TITLE}
                    secondLine={APP_LIST_LABEL.DELETE_PAGE_LAST_LINE}
                    onDelete={() => onDeletePageConfirmClick()}
                    onCloseModal={() => setDeleteStatus(false)}
                />
                {isPageSettingsModelOpen && (
                <AppPageSettings
                    updatePageNameSettings={updatePageNameSettings}
                    isPageSettingsModelOpen={isPageSettingsModelOpen}
                    appPageConfigDataChange={appPageConfigDataChange}
                    currentPageConfig={currentPageConfig}
                    appPageSettingClear={appPageSettingClear}
                />)}
                <AppTabCarousel
                    currentPage={currentPage}
                    tabData={tabData}
                    onTabChange={onTabChange}
                    current_page_id={current_page_id}
                    totalPagesCount={totalPagesCount}
                    onOptionsClick={onOptionsClick}
                    addTabClick={addTabClick}
                    nextSlide={nextSlide}
                    prevSlide={prevSlide}
                    currentIndex={currentIndex}
                    tabContainerRef={tabContainerRef}
                    containerRef={containerRef}
                />
            </div>

            {tabOptionPopper()}
        </>
    );
}

const mapStateToProps = (state) => {
    return {
      pagesData: state.ApplicationReducer.customizedPagesData,
      current_page_id: state.ApplicationReducer.current_page_id,
      app_id: state.ApplicationReducer.activeAppData.id,
      appUuid: state.ApplicationReducer.activeAppData.app_uuid,
      viewers: state.ApplicationReducer.activeAppData.viewersOriginal,
      activeAppData: state.ApplicationReducer.activeAppData,
      current_page_uuid: state.ApplicationReducer.current_page_uuid,
      isPageSettingsModelOpen: state.ApplicationReducer.activeAppData.currentPageConfig.isPageSettingsModelOpen,
      currentPageConfig: state.ApplicationReducer.activeAppData.currentPageConfig,
      isFromAppCreationPrompt: state.ApplicationReducer.isFromAppCreationPrompt,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getPagesApiData: (params, func, isBasicUser, bool, num) => {
            dispatch(getAppPagesThunk(params, func, isBasicUser, bool, num));
        },
        deletPageApi: (params, func, bool, func2) => {
            dispatch(deleteAppPagesThunk(params, func, bool, func2));
        },
        savePagesApi: (params, indexOrder, isInitial, newTab, isGetPages, isBasicUser, pageScroll, translate) => {
            dispatch(savePagesThunk(params, indexOrder, isInitial, newTab, isGetPages, isBasicUser, pageScroll, translate));
        },
        editAnywayApi: (params, apiUrl, setCancelToken) => {
            dispatch(editAnywayApiThunk(params, apiUrl, setCancelToken));
        },
        appOnChange: (params) => {
            dispatch(applicationStateChange(params));
        },
        getAppDataApi: (props, callBack) => {
            dispatch(getAppDataApiThunk(props, callBack));
        },
        getDraftAppData: (props, callBack, publishedAppId) => {
            dispatch(getDraftAppDataApiThunk(props, callBack, publishedAppId));
        },
        updateOptionsApi: (params, func) => {
            dispatch(updatePageOrderApiThunk(params, func));
        },
        saveAppApi: (props, translateFunction, history, isSaveAndClose, isCreateApp, callbackFn) => {
            dispatch(saveAppApiThunk(props, translateFunction, history, isSaveAndClose, isCreateApp, callbackFn));
        },
        getAppCurrentVersionApi: (params, func) => {
            dispatch(getCurrentAppVersionApiThunk(params, func));
        },
        appComponentDataChange: (data) => {
            dispatch(applicationComponentDataChange(data));
        },
        appPageConfigDataChange: (data) => {
            dispatch(applicationPageConfigChange(data));
        },
        appPageSettingClear: () => {
            dispatch(applicationPageSettingClear());
        },
        savePagesList: (...params) => {
            dispatch(savePagesList(...params));
        },
        applicationDataChange: (props) => {
            dispatch(applicationDataChange(props));
        },
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AppBuilderTab));
