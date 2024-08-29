import React, { useState, useEffect, useRef, useMemo } from 'react';
import cx from 'classnames/bind';
import { useHistory } from 'react-router-dom';
import cloneDeep from 'lodash/cloneDeep';
import { connect } from 'react-redux';
import gClasses from 'scss/Typography.module.scss';
import { isMobileScreen } from 'utils/UtilityFunctions';
import { EMPTY_STRING } from 'utils/strings/CommonStrings';
import { getAllSearchApiThunk, getSearchInitialState, SearchTextChange } from 'redux/actions/SearchResults.Action';
import { REDIRECTED_FROM, MULTICATEGORY_SEARCH_TYPE, SEARCH_CONSTANTS } from 'utils/Constants';
import SearchResults from 'containers/landing_page/main_header/SearchResults/SearchResults';
import Modal from 'components/form_components/modal/Modal';
import { FLOW_DASHBOARD, DATA_LIST_DASHBOARD, TASKS, OPEN_TASKS, TEAMS, DATALIST_USERS } from 'urls/RouteConstants';
import AutoPositioningPopper, { POPPER_PLACEMENTS } from 'components/auto_positioning_popper/AutoPositioningPopper';
import { ARIA_ROLES } from 'utils/UIConstants';
import styles from './MultiCategorySearch.module.scss';
import { store } from '../../Store';
import { getUserData } from '../../axios/apiService/addMember.apiService ';
import { isBasicUserMode, routeNavigate } from '../../utils/UtilityFunctions';
import { get } from '../../utils/jsUtility';
import { TAB_ROUTE } from '../application/app_components/dashboard/flow/Flow.strings';
import { ROUTE_METHOD } from '../../utils/Constants';
import SearchLandingIcon from '../../assets/icons/SearchLandingIcon';

let cancelGlobalSearch;
export const getCancelTokenForGlobalSearch = (cancelToken) => {
    cancelGlobalSearch = cancelToken;
};

function MultiCategorySearch(props) {
        const history = useHistory();
    const {
        placeholder,
        perPageDataCount,
        seacrhTextChange,
        getGlobalSearch,
        clearSearchResult,
        searchText,
        isSearchLoading,
        searchResultData,
        resetClearSearch,
        isClearSearch,
        useOnlyPopper,
        searchType,
        onSearchResultClick,
        title,
        required,
        fromAppHeader,
        showSearch,
        searchIcon,
        closeFn,
    } = props;
    const [referencePopperElement, setReferencePopperElement] = useState(null);
    const [showSearchResult, setShowSearchResult] = useState(false);
    const [expandSearch, setExpandSearch] = useState(false);
    const [smallSearchShow, setSmallSearchShow] = useState(false);
    const isMobile = isMobileScreen();
    const [currentIndex, setCurrentIndex] = useState(0);
    const countRef = useRef(-1);
    const [ariaLabel, setAriaLabel] = useState('');
    // const [inputPlaceholder, setInputPlaceholder] = useState(placeholder);
    // const [sizeValue, setSizeValue] = useState({
    //     task: 5,
    //     flow: 5,
    //     datalist: 5,
    //     users: 5,
    //     teams: 5,
    // });
    const toggleSearchStatus = () => {
        if (!useOnlyPopper) {
            !expandSearch && referencePopperElement?.focus();
            setExpandSearch(!expandSearch);
            if (isMobileScreen()) {
                console.log('xyz here');
                setSmallSearchShow(!smallSearchShow);
            }
        }
    };
    const enableSearch = () => {
        referencePopperElement?.focus();
        if (!expandSearch) setExpandSearch(true);
        if (!smallSearchShow && isMobileScreen()) setSmallSearchShow(true);
    };
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
        if (searchType === MULTICATEGORY_SEARCH_TYPE.GLOBAL) {
            const isNormalMode = isBasicUserMode(history);
            if (cancelGlobalSearch) cancelGlobalSearch();
            getGlobalSearch(params, type, isNormalMode);
        }
    };
    const onChangeHandler = (event) => {
        const valueText = event.target.value;
        // setSizeValue({ task: perPageDataCount, flow: 5, datalist: 5, users: 5, teams: 5 });
        if (valueText === EMPTY_STRING) {
            clearSearchResult();
        } else {
            getGlobalSearchValue(valueText, SEARCH_CONSTANTS.ALLOW_ALL);
            setShowSearchResult(true);
        }
        seacrhTextChange(valueText);
        setCurrentIndex(0);
        countRef.current = -1;
    };
    const closeClickHandler = () => {
        clearSearchResult();
        setShowSearchResult(false);
        setExpandSearch(false);
        fromAppHeader && closeFn();
    };

    useEffect(() => {
        setExpandSearch(showSearch);
        if (showSearch) referencePopperElement?.focus();
    }, [showSearch, referencePopperElement]);

    useEffect(() => () => {
        closeClickHandler();
    }, []);
    useEffect(() => {
        if (isClearSearch) {
            closeClickHandler();
            resetClearSearch();
        }
    }, [isClearSearch]);
    const showMoreHandler = (type, itemsCount) => {
        const page = (itemsCount / perPageDataCount) + 1;
        getGlobalSearchValue(searchText, type, page);
        referencePopperElement?.focus();
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
                // Temporary fix added for ETF-10861 to stop from history action when user tries to open
                // a task from global search when that task is already open
                // Proper fix must be done by the use of dynamic routing
                if (cloneDeep(history)?.location?.pathname.includes(`${TASKS}/${OPEN_TASKS}`)) {
                    const url = cloneDeep(history)?.location?.pathname.split('/');
                    const urlLength = url?.length;
                    if (get(url, [(urlLength) - 1])) {
                         taskUuid = cloneDeep(url[(urlLength) - 1]);
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
                const userDatalistUuid = cloneDeep(store.getState().UserProfileReducer.user_data_list_uuid);
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
                    const dataListUserIdPathName = `${DATALIST_USERS}/${userDatalistUuid}/${response.datalist_info.entry_id}`;
                    routeNavigate(history, ROUTE_METHOD.PUSH, dataListUserIdPathName);
                    return closeClickHandler();
                  })
                  .catch((error) => {
                    console.log('getuserdata api catch', error);
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

     const getCurrentItem = (indexedSearchResultData, currentIndex) => {
            referencePopperElement?.focus();
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

    // an auto incmented index is added to all the results items
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

    const searchResultsComponent = (
        <SearchResults
            currentIndex={currentIndex}
            isMobileView={isMobile}
            showMoreHandler={showMoreHandler}
            results={indexedSearchResultData}
            isSearchLoading={isSearchLoading}
            isPopper={useOnlyPopper}
            onSearchResultClick={onSearchResultClick}
            onRedirectClickHandler={onRedirectClickHandler}
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
          seacrhTextChange(EMPTY_STRING);
          setCurrentIndex(0);
          setAriaLabel(EMPTY_STRING);
          closeClickHandler();
        //   referencePopperElement?.blur();
      }

      if (e.key === 'Enter') {
        const [currentItem, currentType] = getCurrentItem(indexedSearchResultData, currentIndex);
        onRedirectClickHandler(currentType, currentItem.uuid, currentItem.name, currentItem.id);
      }
    return null;
    };

    const inputAriaLabel = isSearchLoading ? 'Searching' : searchText ? isResultsExists ? 'Result Found' : 'No Results Found' : '';
    return (
        <div className={`${fromAppHeader ? 'flex items-center w-full max-w-lg' : ''}`}>
            {!fromAppHeader ?
            <SearchLandingIcon
                className={cx(styles.SearchIcon, !useOnlyPopper && gClasses.CursorPointer)}
                onClick={toggleSearchStatus}
                role={ARIA_ROLES.IMG}
                ariaHidden="true"
            /> :
                searchIcon
            }
            {((fromAppHeader && showSearch) || !fromAppHeader) &&
            <input
                onClick={enableSearch}
                onFocus={enableSearch}
                value={searchText}
                onChange={onChangeHandler}
                onKeyDown={handleKeyDownHandler}
                className={cx(
                    useOnlyPopper && styles.OpenSearch,
                    gClasses.FTwo13,
                    isMobile &&
                    (!smallSearchShow && !useOnlyPopper) &&
                    styles.SearchCondition,
                    !isMobile && searchText?.length !== 0 && styles.SearchTextHighlightBorder,
                    (!useOnlyPopper && expandSearch) && styles.SearchInputFocused,
                    styles.SearchInput,
                    fromAppHeader && styles.AppHeaderSearch,
                )}
                type="text"
                placeholder={searchText ? '' : placeholder}
                required={required}
                ref={setReferencePopperElement}
                title={title}
                autoComplete="off"
                aria-label={isResultsExists ? ariaLabel : inputAriaLabel}
                // onBlur={closeClickHandler}
            />
            }
            {(!useOnlyPopper && isMobile) ? (
                (searchText !== EMPTY_STRING && showSearchResult) &&
                <Modal
                    id="multisearch-modal"
                    isModalOpen={
                        searchText !== EMPTY_STRING && showSearchResult
                    }
                    right
                    contentClass={cx(
                        styles.SearchMobileContainer,
                        gClasses.ModalContentClassWithoutPadding,
                    )}
                    containerClass={styles.SearchMobileOuter}
                    onCloseClick={closeClickHandler}
                    closeIconClasses={styles.IconExit}
                >
                    {searchResultsComponent}
                </Modal>
            ) : (
                <AutoPositioningPopper
                    className={cx(
                        gClasses.ZIndex5,
                        gClasses.MT3,
                        styles.SearchResultsContainer,
                    )}
                    placement={POPPER_PLACEMENTS.BOTTOM_START}
                    referenceElement={referencePopperElement}
                    isPopperOpen={
                        searchText !== EMPTY_STRING && showSearchResult
                    }
                >
                    {searchResultsComponent}
                </AutoPositioningPopper>
            )}
        </div>
    );
}

const mapDispatchToProps = (dispatch) => {
    return {
        seacrhTextChange: (value) => {
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

export default connect(null, mapDispatchToProps)(MultiCategorySearch);
