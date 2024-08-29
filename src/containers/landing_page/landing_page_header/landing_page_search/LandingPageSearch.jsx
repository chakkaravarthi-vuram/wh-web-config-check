import React, { useMemo, useRef, useState } from 'react';
import cx from 'classnames/bind';
import gClasses from 'scss/Typography.module.scss';
import { EPopperPlacements, Input, Popper, Size, Variant } from '@workhall-pvt-lmt/wh-ui-library';
import { getUserData } from 'axios/apiService/addMember.apiService ';
import { useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import { getAllSearchApiThunk, getSearchInitialState, SearchTextChange } from 'redux/actions/SearchResults.Action';
import { ARIA_ROLES } from '../../../../utils/UIConstants';
import SearchLandingIcon from '../../../../assets/icons/SearchLandingIcon';
import styles from '../LandingPageHeader.module.scss';
import LandingSearchExitIcon from '../../../../assets/icons/LandingSearchExitIcon';
import { EMPTY_STRING } from '../../../../utils/strings/CommonStrings';
import SearchResults from '../../main_header/SearchResults/SearchResults';
import { isBasicUserMode, routeNavigate, useClickOutsideDetector } from '../../../../utils/UtilityFunctions';
import { REDIRECTED_FROM, ROUTE_METHOD, SEARCH_CONSTANTS } from '../../../../utils/Constants';
import { DATALIST_USERS, DATA_LIST_DASHBOARD, FLOW_DASHBOARD, OPEN_TASKS, TASKS, TEAMS } from '../../../../urls/RouteConstants';
import { TAB_ROUTE } from '../../../application/app_components/dashboard/flow/Flow.strings';
import jsUtility from '../../../../utils/jsUtility';
import { store } from '../../../../Store';

let cancelGlobalSearch;
export const getCancelTokenForGlobalSearch = (cancelToken) => {
    cancelGlobalSearch = cancelToken;
};

function LandingPageSearch(props) {
    const {
        searchTextChange,
        searchText,
        clearSearchResult,
        getGlobalSearch,
        perPageDataCount,
        onSearchResultClick,
        searchResultData,
        isSearchLoading,
        placeholder,
    } = props;
    const [toggle, setToggle] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [ariaLabel, setAriaLabel] = useState(EMPTY_STRING);
    const targetRef = useRef(null);
    const countRef = useRef(-1);
    const history = useHistory();

    const closeClickHandler = () => {
        clearSearchResult();
        setToggle(false);
        searchTextChange(EMPTY_STRING);
    };

    useClickOutsideDetector(targetRef, closeClickHandler);

    const getCurrentItem = (indexedSearchResultData, currentIndex) => {
        let currentItem;
        let currentType;
        indexedSearchResultData.forEach((result) => {
            result?.list?.forEach((item) => {
                if (item.index === currentIndex) {
                    currentType = result.type;
                    currentItem = item;
                    return null;
                }
                return null;
            });
        });
        return [currentItem, currentType];
    };

    // an auto incremented index is added to all the results items
    const [isResultsExists, indexedSearchResultData] = useMemo(() => {
        const isResultsExists = searchResultData.map((c) => c?.list?.length !== 0).some((i) => i);
        countRef.current = -1;
        const newData = searchResultData.map((result) => {
            const resultArr = result?.list?.map((item) => {
                countRef.current++;
                return { ...item, index: countRef.current };
            });
            return { ...result, list: resultArr };
        });

        if (countRef.current >= 1 && currentIndex === 0) {
            const [currentItem, currentType] = getCurrentItem(newData, 0);
            setAriaLabel(`${currentType} ${currentItem.name}`);
        } else if (countRef.current === -1) {
            setAriaLabel('');
        }
        return [isResultsExists, newData];
    }, [searchResultData]);

    const inputAriaLabel = isSearchLoading ? 'Searching' : searchText ? isResultsExists ? 'Result Found' : 'No Results Found' : '';
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
        const isNormalMode = isBasicUserMode(history);
        if (cancelGlobalSearch) cancelGlobalSearch();
        getGlobalSearch(params, type, isNormalMode);
    };

    const onChangeHandler = (event) => {
        const valueText = event.target.value;
        if (valueText === EMPTY_STRING) {
            clearSearchResult();
        } else {
            getGlobalSearchValue(valueText, SEARCH_CONSTANTS.ALLOW_ALL);
        }
        searchTextChange(valueText);
        setCurrentIndex(0);
        countRef.current = -1;
    };

    const onRedirectClickHandler = (type, uuid, name, id) => {
        if (onSearchResultClick) {
            return onSearchResultClick(id);
        }
        const isNormalMode = isBasicUserMode(history);
        const allRequests = isNormalMode ? `/${TAB_ROUTE.ALL_REQUEST}` : EMPTY_STRING;

        let flowPathName;
        let flowState;
        switch (type) {
            case SEARCH_CONSTANTS.ALLOW_FLOW_ONLY:
                flowPathName = `${FLOW_DASHBOARD}/${uuid}${allRequests}`;
                flowState = { uuid, name, id, flow_tab: 1, redirectedFrom: REDIRECTED_FROM.HOME };
                routeNavigate(history, ROUTE_METHOD.PUSH, flowPathName, EMPTY_STRING, flowState);
                return closeClickHandler();
            case SEARCH_CONSTANTS.ALLOW_DATALIST_ONLY:
                flowPathName = `${DATA_LIST_DASHBOARD}/${uuid}${allRequests}`;
                flowState = { id, uuid, datalist_tab: 1, redirectedFrom: REDIRECTED_FROM.HOME };
                routeNavigate(history, ROUTE_METHOD.PUSH, flowPathName, EMPTY_STRING, flowState);
                return closeClickHandler();
            case SEARCH_CONSTANTS.ALLOW_TASK_ONLY:
                let taskUuid = EMPTY_STRING;
                if (jsUtility.cloneDeep(history)?.location?.pathname.includes(`${TASKS}/${OPEN_TASKS}`)) {
                    const url = jsUtility.cloneDeep(history)?.location?.pathname.split('/');
                    const urlLength = url?.length;
                    if (jsUtility.get(url, [(urlLength) - 1])) {
                         taskUuid = jsUtility.cloneDeep(url[(urlLength) - 1]);
                      }
                }
                if (taskUuid !== uuid) {
                    const flowState = {
                        redirectedFrom: REDIRECTED_FROM.HOME,
                        tabIndex: OPEN_TASKS,
                        taskUuid: uuid,
                    };
                    routeNavigate(history, ROUTE_METHOD.PUSH, `${TASKS}/${OPEN_TASKS}/${uuid}`, EMPTY_STRING, flowState);
                }
                return closeClickHandler();
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
                        flowPathName = `${DATA_LIST_DASHBOARD}/${userDatalistUuid}${allRequests}/${response.datalist_info.entry_id}`;
                        flowState = { id, userDatalistUuid, datalist_tab: 1, redirectedFrom: REDIRECTED_FROM.HOME };
                        routeNavigate(history, ROUTE_METHOD.PUSH, flowPathName, EMPTY_STRING, flowState);
                        return closeClickHandler();
                    }
                    const dataListUserIdPathName = `${DATALIST_USERS}/${userDatalistUuid}/${response._id}`;
                    routeNavigate(history, ROUTE_METHOD.PUSH, dataListUserIdPathName);
                    return closeClickHandler();
                  })
                  .catch((error) => {
                    console.log(error);
                  });
                  return null;

            case SEARCH_CONSTANTS.ALLOW_TEAM_ONLY:
                const taskIdPathName = `${TEAMS}/${id}`;
                routeNavigate(history, ROUTE_METHOD.PUSH, taskIdPathName);

                return closeClickHandler();
            default:
                break;
        }
        return null;
    };

    const showMoreHandler = (type, itemsCount) => {
        const page = (itemsCount / perPageDataCount) + 1;
        getGlobalSearchValue(searchText, type, page);
    };

    const searchResultsComponent = (
        <SearchResults
            // currentIndex={currentIndex}
            isMobileView={false}
            showMoreHandler={showMoreHandler}
            results={indexedSearchResultData}
            isSearchLoading={isSearchLoading}
            onSearchResultClick={onSearchResultClick}
            onRedirectClickHandler={onRedirectClickHandler}
            customContainerClass={styles.CustomSearchResultsContainer}
        />
    );

    // handle when user uses tabnavigation or arrow key navigation to access search result data, from dropdown
    const handleKeyDownHandler = (e) => {
        if (((e.shiftKey && e.key === 'Tab') || e.key === 'ArrowUp') && currentIndex - 1 >= 0) {
          const [currentItem, currentType] = getCurrentItem(indexedSearchResultData, currentIndex - 1);
          setAriaLabel(`${currentType} ${currentItem.name}`);
          setCurrentIndex((p) => p - 1);
        } else if (((e.key === 'Tab' && !e.shiftKey) || e.key === 'ArrowDown') && currentIndex + 1 <= countRef.current) {
          const [currentItem, currentType] = getCurrentItem(indexedSearchResultData, currentIndex + 1);
          setAriaLabel(`${currentType} ${currentItem.name}`);
          setCurrentIndex((p) => p + 1);
        }

        if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || (e.key === 'Tab' && searchText)) {
          e.preventDefault();
          e.stopPropagation();
        }

        if (e.key === 'Escape') {
            searchTextChange(EMPTY_STRING);
            setCurrentIndex(0);
            setAriaLabel(EMPTY_STRING);
            closeClickHandler();
        }

        if (e.key === 'Enter') {
          const [currentItem, currentType] = getCurrentItem(indexedSearchResultData, currentIndex);
          onRedirectClickHandler(currentType, currentItem.uuid, currentItem.name, currentItem.id);
        }
      return null;
      };

    return (
        <div ref={targetRef}>
            <SearchLandingIcon
                role={ARIA_ROLES.BUTTON}
                tabIndex={0}
                onClick={() => setToggle((search) => !search)}
                onKeyDown={() => setToggle((search) => !search)}
            />
            <Popper
                targetRef={targetRef}
                open={toggle}
                className={styles.SearchPopper}
                placement={EPopperPlacements.BOTTOM_START}
                style={{ zIndex: 10 }}
                content={
                    <div className={styles.SearchContainer}>
                        <div className={cx(gClasses.CenterV, styles.SearchHeader)}>
                            <SearchLandingIcon
                                role={ARIA_ROLES.BUTTON}
                                tabIndex={0}
                                onClick={() => setToggle((search) => !search)}
                                onKeyDown={() => setToggle((search) => !search)}
                            />
                            <Input
                                autoFocus
                                size={Size.sm}
                                placeholder={placeholder}
                                variant={Variant.borderLess}
                                content={searchText}
                                onChange={onChangeHandler}
                                onKeyPress={handleKeyDownHandler}
                                className={styles.SearchInput}
                                ariaLabel={isResultsExists ? ariaLabel : inputAriaLabel}
                            />
                            {searchText && (
                                <button onClick={() => { clearSearchResult(); searchTextChange(EMPTY_STRING); }}>
                                    <LandingSearchExitIcon />
                                </button>
                            )}
                        </div>
                        <div className={styles.SeachBodyContainer}>
                            {searchResultsComponent}
                        </div>
                    </div>
                }
            />
        </div>
    );
}

const mapDispatchToProps = (dispatch) => {
    return {
        searchTextChange: (value) => {
            dispatch(SearchTextChange(value));
        },
        clearSearchResult: () => {
            dispatch(getSearchInitialState());
        },
        getGlobalSearch: (params, type, isNormalMode) => {
            dispatch(getAllSearchApiThunk(params, type, isNormalMode));
        },
    };
};

export default connect(null, mapDispatchToProps)(LandingPageSearch);
