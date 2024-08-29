import { cloneDeep } from 'lodash';
import TriangleDownIcon from '../../../assets/icons/app_builder_icons/TriangleDown';
import { HOME_CONST } from '../../../utils/Constants';
import jsUtility, { translateFunction } from '../../../utils/jsUtility';
import { EMPTY_STRING } from '../../../utils/strings/CommonStrings';
import { APP_COMP_STRINGS, APP_TAB_DATA } from './AppBuilder.strings';

export const AppBuilderElementDefaultDimensions = (type, index, forDrag = false) => {
    let dimensions;
    const commonDimensions = {
        moved: false,
        static: false,
        add: false,
        y: Infinity,
        x: 0,
        type: type,
        i: index,
    };
    switch (type) {
        case APP_COMP_STRINGS.TEXT_EDITOR:
            dimensions = { maxH: 8, maxW: 4, minH: 1, minW: 1, w: 2, h: 1 };
            break;
        case APP_COMP_STRINGS.IMAGE:
            dimensions = { maxH: 4, maxW: 4, minH: 1, minW: 1, w: 2, h: 3 };
            break;
        case APP_COMP_STRINGS.LINK:
            dimensions = { maxH: 4, maxW: 4, minH: 1, minW: 1, w: 1, h: 2 };
            break;
        case APP_COMP_STRINGS.REPORTS:
            dimensions = { maxH: 8, maxW: 4, minH: 1, minW: 1, w: 2, h: 3 };
            break;
        case APP_COMP_STRINGS.TASK:
            dimensions = { maxH: 8, maxW: 4, minH: 2, minW: 1, w: 4, h: 3 };
            break;
        case APP_COMP_STRINGS.DASHBOARDS:
            dimensions = { maxH: 8, maxW: 4, minH: 3, minW: 2, w: 4, h: 4 };
            break;
        case APP_COMP_STRINGS.WEBPAGE_EMBED:
            dimensions = { maxH: 8, maxW: 4, minH: 1, minW: 1, w: 2, h: 1 };
            break;
        default:
          break;
    }
    if (!forDrag) dimensions = { ...dimensions, ...commonDimensions };
    else dimensions = { ...dimensions, i: index, type: type };
    return dimensions;
};

export const getPageOptions = (pages) => {
    const pagesData = cloneDeep(pages);
    const options = [];
    pagesData?.forEach((page) => {
        const particularPage = {
            labelText: page.name,
            value: page._id,
            tabIndex: page.order,
            Icon: TriangleDownIcon,
            isEditable: false,
            uuid: page.page_uuid,
            error: false,
        };
        options.push(particularPage);
    });
    return options;
};

export const updatePageIdAfterSave = (page) => {
    return {
        labelText: page.name,
        value: page._id,
        tabIndex: page.order,
        Icon: TriangleDownIcon,
        isEditable: false,
    };
};

export const getComponentsStructure = (apiData, isBasicUser = false, errorPageData, errorData = {}) => {
    const layoutData = [];
    let errorComp = [];
    if (!jsUtility.isEmpty(errorPageData)) {
        const errorPages = Object.keys(errorData);
        if (errorPages.includes((errorPageData.tabIndex - 1).toString())) {
            errorComp = errorData[errorPageData.tabIndex - 1] || [];
        }
    }
    if (!jsUtility.isEmpty(apiData)) {
        apiData.forEach((component, index) => {
            const layoutDataObj = {
                ...component.coordination,
                type: component.type,
                componentDetails: component,
                i: index,
                error: errorComp.findIndex((error) => error.errorCompIndex === index) !== -1,
            };
            if (!jsUtility.isEmpty(errorPageData)) {
                if (component.type === APP_COMP_STRINGS.LINK) {
                    layoutDataObj.errorInComponentData = (errorComp.filter((error) => error.errorCompIndex === index) || []).map((error) => error.errorIn);
                    layoutDataObj.componentIndex = index;
                    layoutDataObj.pageIndex = errorPageData.tabIndex - 1;
                } else {
                    layoutDataObj.errorInComponentData = errorComp[errorComp.findIndex((error) => error.errorCompIndex === index)]?.errorIn || EMPTY_STRING;
                    layoutDataObj.componentIndex = index;
                    layoutDataObj.pageIndex = errorPageData.tabIndex - 1;
                }
            }
            if (isBasicUser) layoutDataObj.static = true;

            layoutData.push(layoutDataObj);
        });
    }
    return layoutData;
};

export const getDynamicAppOptions = (isFirst, isLast, lastOne, t = translateFunction) => {
    const options = [];
    options.push(APP_TAB_DATA(t)[0]);
    if (!isLast) {
        options.push(APP_TAB_DATA(t)[1]);
    }
    if (!isFirst) {
        options.push(APP_TAB_DATA(t)[2]);
    }
    if (!lastOne) {
        options.push(APP_TAB_DATA(t)[3]);
    }
    return options;
};

export const getPageTabData = (tabs, isHome) => {
    let tabData = [];
    if (isHome) {
        tabData = [{
            labelText: HOME_CONST,
            value: HOME_CONST,
            tabIndex: HOME_CONST,
        }];
    } else if (!jsUtility.isEmpty(tabs)) {
        tabs.forEach((tab) => {
            tabData.push({
                labelText: tab.name,
                value: tab.url_path,
                tabIndex: tab.url_path,
            });
        });
    }
    return tabData;
};

export const getAppPageUrl = (name, isFromML) => {
    const urlPath = jsUtility.join(jsUtility.split(name.toLowerCase(), ' '), '-');
    if (isFromML) return jsUtility.join(jsUtility.split(urlPath.toLowerCase(), '_'), '-');
    return urlPath;
};
