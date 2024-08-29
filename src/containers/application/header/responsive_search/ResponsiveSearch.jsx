import React from 'react';
import cx from 'classnames/bind';
import { ETitleSize, Modal, ModalSize, ModalStyleType, Title } from '@workhall-pvt-lmt/wh-ui-library';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import gClasses from '../../../../scss/Typography.module.scss';
import styles from '../Header.module.scss';
import CloseIcon from '../../../../assets/icons/task/CloseIcon';
import SearchResponsiveViewIcon from '../../../../assets/icons/SearchResponsiveIcon';
import { isBasicUserMode, routeNavigate } from '../../../../utils/UtilityFunctions';
import { REDIRECTED_FROM, ROUTE_METHOD, SEARCH_CONSTANTS } from '../../../../utils/Constants';
import { DATALIST_USERS, DATA_LIST_DASHBOARD, OPEN_TASKS, FLOW_DASHBOARD, TASKS, TEAMS } from '../../../../urls/RouteConstants';
import { EMPTY_STRING } from '../../../../utils/strings/CommonStrings';
import { TAB_ROUTE } from '../../app_components/dashboard/flow/Flow.strings';
import { getUserData } from '../../../../axios/apiService/addMember.apiService ';
import jsUtility from '../../../../utils/jsUtility';
import { store } from '../../../../Store';
import SearchResults from '../../../landing_page/main_header/SearchResults/SearchResults';
import { HEADER_TRANSLATE_STRINGS } from '../Header.string';
import Copilot from '../../../copilot/Copilot';

let cancelGlobalSearch;
export const getCancelTokenForGlobalSearch = (cancelToken) => {
    cancelGlobalSearch = cancelToken;
};

function ResponsiveSearch(props) {
    const {
        isPopperOpen,
        onCloseClick,
        searchText,
        perPageDataCount,
        getGlobalSearch,
        searchResultData,
        isSearchLoading,
        onSearchResultClick,
        clearSearchResult,
        seacrhTextChange,
        placeholder,
        isCopilotSearch = false,
    } = props;
    const history = useHistory();
    const { t } = useTranslation();
    const { AI_POWERED_SEARCH } = HEADER_TRANSLATE_STRINGS(t);
    const isNormalMode = isBasicUserMode(history);

    const getGlobalSearchValue = (
        searchValue,
        type,
        page = 1,
    ) => {
        const params = {
            size: perPageDataCount,
            search: searchValue,
            search_for: type,
            page,
        };

        if (cancelGlobalSearch) cancelGlobalSearch();
        getGlobalSearch(params, type, isNormalMode);
        };

    const showMoreHandler = (type, itemsCount) => {
        const page = (itemsCount / perPageDataCount) + 1;
        getGlobalSearchValue(searchText, type, page);
    };

    const onRedirectClickHandler = (type, uuid, name, id) => {
        const isNormalMode = isBasicUserMode(history);
        const allRequests = isNormalMode ? `/${TAB_ROUTE.ALL_REQUEST}` : EMPTY_STRING;

        let procedurePathName;
        let procedureState;
        switch (type) {
            case SEARCH_CONSTANTS.ALLOW_PROCEDURE_ONLY:
                procedurePathName = `${FLOW_DASHBOARD}/${uuid}${allRequests}`;
                procedureState = { uuid, name, id, procedure_tab: 1, redirectedFrom: REDIRECTED_FROM.HOME };
                routeNavigate(history, ROUTE_METHOD.PUSH, procedurePathName, EMPTY_STRING, procedureState);
                return onCloseClick();
            case SEARCH_CONSTANTS.ALLOW_DATALIST_ONLY:
                procedurePathName = `${DATA_LIST_DASHBOARD}/${uuid}${allRequests}`;
                procedureState = { id, uuid, datalist_tab: 1, redirectedFrom: REDIRECTED_FROM.HOME };
                routeNavigate(history, ROUTE_METHOD.PUSH, procedurePathName, EMPTY_STRING, procedureState);
                return onCloseClick();
            case SEARCH_CONSTANTS.ALLOW_TASK_ONLY:
                let taskUuid = EMPTY_STRING;
                if (jsUtility.cloneDeep(history)?.location?.pathname.includes(`${TASKS}/${OPEN_TASKS}`)) {
                    const url = jsUtility.cloneDeep(history)?.location?.pathname.split('/');
                    if (jsUtility.get(url, [(url.length) - 1])) {
                        taskUuid = jsUtility.cloneDeep(url[(url.length) - 1]);
                    }
                }
                if (taskUuid !== uuid) {
                    const procedureState = {
                        redirectedFrom: REDIRECTED_FROM.HOME,
                        tabIndex: OPEN_TASKS,
                        taskUuid: uuid,
                    };
                    routeNavigate(history, ROUTE_METHOD.PUSH, `${TASKS}/${OPEN_TASKS}/${uuid}`, EMPTY_STRING, procedureState);
                }
                return onCloseClick();
            case SEARCH_CONSTANTS.ALLOW_USER_ONLY:
                const userDatalistUuid = jsUtility.cloneDeep(store.getState().UserProfileReducer.user_data_list_uuid);
                const params = {
                    _id: id,
                };
                const cancelDataListToken = {
                    cancelToken: null,
                };
                const setDataListCancelToken = (c) => {
                    cancelDataListToken.cancelToken = c;
                };
                getUserData(params, setDataListCancelToken)
                    .then((response) => {
                        if (isNormalMode) {
                            procedurePathName = `${DATA_LIST_DASHBOARD}/${userDatalistUuid}${allRequests}/${response.datalist_info.entry_id}`;
                            procedureState = { id, userDatalistUuid, datalist_tab: 1, redirectedFrom: REDIRECTED_FROM.HOME };
                            routeNavigate(history, ROUTE_METHOD.PUSH, procedurePathName, EMPTY_STRING, procedureState);
                            return onCloseClick();
                        }
                        const dataListUserIdPathName = `${DATALIST_USERS}/${userDatalistUuid}/${response.datalist_info.entry_id}`;
                        routeNavigate(history, ROUTE_METHOD.PUSH, dataListUserIdPathName);
                        return onCloseClick();
                    })
                    .catch((error) => {
                        console.log('getuserdata api catch', error);
                    });
                return null;

            case SEARCH_CONSTANTS.ALLOW_TEAM_ONLY:
                const taskIdPathName = `${TEAMS}/${id}`;
                routeNavigate(history, ROUTE_METHOD.PUSH, taskIdPathName);

                return onCloseClick();
            default:
                break;
        }
        return null;
    };

    const searchResultsComponent = (
        <SearchResults
            isMobileView
            showMoreHandler={showMoreHandler}
            results={searchResultData}
            isSearchLoading={isSearchLoading}
            isPopper={false}
            onSearchResultClick={onSearchResultClick}
            onRedirectClickHandler={onRedirectClickHandler}
            currentIndex={0}
        />
    );

    const onChangeHandler = (event) => {
        const valueText = event.target.value;
        if (valueText === EMPTY_STRING) {
            clearSearchResult();
        } else {
            getGlobalSearchValue(valueText, SEARCH_CONSTANTS.ALLOW_ALL);
        }
        seacrhTextChange(valueText);
    };

    return (
        <Modal
            isModalOpen={isPopperOpen}
            modalStyle={ModalStyleType.modal}
            modalSize={ModalSize.sm}
            mainContentClassName={styles.OverflowYAuto}
            className={gClasses.CursorDefault}
            headerContent={
                <div className={cx(isCopilotSearch && gClasses.MB12, styles.SearchHeaderContainer, gClasses.DisplayFlex, gClasses.P24, gClasses.PositionRelative, gClasses.PB0)}>
                    <Title content={AI_POWERED_SEARCH} size={ETitleSize.small} />
                    <CloseIcon onClick={() => { onCloseClick(); clearSearchResult(); }} className={cx(gClasses.CursorPointer, styles.CloseIcon)} />
                </div>
            }
            mainContent={!isCopilotSearch ? (
                <div className={cx(gClasses.MT16, gClasses.PX24)}>
                    <div className={cx(gClasses.W100, gClasses.CenterV, styles.SearchRespContainer)}>
                        <button className={cx(gClasses.CenterV, gClasses.PX8, gClasses.PY10)}>
                            <SearchResponsiveViewIcon className={gClasses.MR8} />
                            <input
                                value={searchText}
                                onChange={onChangeHandler}
                                className={gClasses.W100}
                                placeholder={placeholder}
                            />
                        </button>
                    </div>
                    {searchText && (
                    <div className={gClasses.MT16}>
                        {searchResultsComponent}
                    </div>)}
                </div>) : <Copilot isResponsiveView closeSearch={onCloseClick} />
            }
        />
    );
}

export default ResponsiveSearch;
