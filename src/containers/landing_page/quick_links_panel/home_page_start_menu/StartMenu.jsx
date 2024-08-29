import React, { useEffect } from 'react';
import cx from 'classnames/bind';
import Skeleton from 'react-loading-skeleton';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroller';
import { REDIRECTED_FROM } from 'utils/Constants';
import { keydownOrKeypessEnterHandle } from 'utils/UtilityFunctions';
import { useTranslation } from 'react-i18next';
import SearchBar, {
  SEARCH_BAR_TYPES,
} from '../../../../components/form_components/search_bar/SearchBar';
import styles from './StartMenu.module.scss';
import gClasses from '../../../../scss/Typography.module.scss';
import { BS } from '../../../../utils/UIConstants';
import { FLOATING_ACTION_MENU_STRINGS } from '../../LandingPage.strings';
import {
  getAllInitiateFlows,
  floatingActionMenuStartSectionClear,
  floatingActionMenuStartSectionSetSearchText,
  initiateFlowApi,
  floatingActionMenuStartSectionDataChange,
} from '../../../../redux/actions/FloatingActionMenuStartSection.Action';
import {
  cancelGetAllInitiateFlowAndClearState,
} from '../../../../axios/apiService/flowList.apiService';
import {
  getDefaultResponseHandler,
  getSearchTextResponseHandler,
} from '../../all_flows/FlowStrings';

const mapDispatchToProps = (dispatch) => {
  return {
    onGetAllInitiateFlows: (searchWithPaginationData) => {
      dispatch(getAllInitiateFlows(searchWithPaginationData));
    },
    onFloatingActionMenuStartSectionClear: () => {
      dispatch(floatingActionMenuStartSectionClear());
    },
    onFloatingActionMenuStartSectionSetSearchText: (searchText) => {
      dispatch(floatingActionMenuStartSectionSetSearchText(searchText));
    },
    initiateFlow: (data, history, redirectedFrom) => {
      dispatch(initiateFlowApi(data, history, redirectedFrom));
    },
    dispatch,
  };
};

const mapStateToProps = (state) => {
  return {
    lstInitiateFlows:
      state.FloatingActionMenuStartSectionReducer.lstInitiateFlows,
    isLoading: state.FloatingActionMenuStartSectionReducer.isLoading,
    isPaginatedData:
      state.FloatingActionMenuStartSectionReducer.isPaginatedData,
    searchText: state.FloatingActionMenuStartSectionReducer.searchText,
    initiateFlowList:
      state.FloatingActionMenuStartSectionReducer.initiateFlowList,
    isInitiateFlowListInfiniteScrollLoading:
      state.FloatingActionMenuStartSectionReducer
        .isInitiateFlowListInfiniteScrollLoading,
    initiateFlowTotalCount:
      state.FloatingActionMenuStartSectionReducer.initiateFlowTotalCount,
    initiateFlowListCurrentPage:
      state.FloatingActionMenuStartSectionReducer
        .initiateFlowListCurrentPage,
    renderedInitiateFlowListCount:
      state.FloatingActionMenuStartSectionReducer
        .renderedInitiateFlowListCount,
    initiateFlowListDataCountPerCall:
      state.FloatingActionMenuStartSectionReducer
        .initiateFlowListDataCountPerCall,
    initiateFlowListDocumentDetails:
      state.FloatingActionMenuStartSectionReducer
        .initiateFlowListDocumentDetails,
  };
};

function StartMenu(props) {
  const {
    isLoading,
    searchText,
    onGetAllInitiateFlows,
    onFloatingActionMenuStartSectionSetSearchText,
    onFloatingActionMenuStartSectionClear,
    dispatch,
    initiateFlowList,
    isInitiateFlowListInfiniteScrollLoading,
    initiateFlowTotalCount,
    initiateFlowListCurrentPage,
    renderedInitiateFlowListCount,
  } = props;
  const { t } = useTranslation();
  useEffect(() => {
    const searchWithPaginationData = {
      page: initiateFlowListCurrentPage,
      sort_field: 'username',
      size: 8,
    };
    dispatch(
      floatingActionMenuStartSectionDataChange({ isPaginatedData: false }),
    );
    onGetAllInitiateFlows(searchWithPaginationData);
    return () => {
      dispatch(cancelGetAllInitiateFlowAndClearState());
      onFloatingActionMenuStartSectionClear();
    };
  }, []);

  const onChangeHandler = (value) => {
    onFloatingActionMenuStartSectionSetSearchText(value);
    const searchWithPaginationData = {
      page: 1,
      sort_field: 'username',
      size: 10,
    };
    if (value) searchWithPaginationData.search = value;
    dispatch(
      floatingActionMenuStartSectionDataChange({
        isPaginatedData: false,
        isLoading: true,
      }),
    );
    onGetAllInitiateFlows(searchWithPaginationData);
  };

  const initiateFlowFromList = (flow_uuid) => {
    const postData = {
      flow_uuid,
    };
    const { history } = props;
    dispatch(
      initiateFlowApi(postData, history, REDIRECTED_FROM.HOME),
    ).then(() => {});
  };

  const arrInitiateFlows = isLoading
    ? Array(3).fill(1)
    : initiateFlowList;
  let flowList = null;

  if (arrInitiateFlows && arrInitiateFlows.length > 0) {
    flowList = arrInitiateFlows.map((eachFlow, index) => (
      <div
        className={cx(
          styles.QuickLink,
          gClasses.CenterV,
          gClasses.MB20,
          gClasses.FTwo12GrayV3,
          gClasses.CursorPointer,
          gClasses.TextTransformCap,
        )}
        key={`floating_menu_start_section_item_${index}`}
      >
        {isLoading ? (
          <div className={BS.TEXT_CENTER}>
            <Skeleton width="180px" />
          </div>
        ) : (
          <div
            onClick={() => {
              initiateFlowFromList(eachFlow.flow_uuid);
            }}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => keydownOrKeypessEnterHandle(e) &&
              initiateFlowFromList(eachFlow.flow_uuid)}
          >
            {eachFlow.step_name}
          </div>
        )}
      </div>
    ));
  } else if (searchText) {
    flowList = (
      <div className={BS.TEXT_CENTER}>
        {getSearchTextResponseHandler(searchText)}
      </div>
    );
  } else {
    flowList = (
      <div className={BS.TEXT_CENTER}>{getDefaultResponseHandler(t)}</div>
    );
  }
  const getLoaders = (count) => {
    if (count > 0) {
      return Array(count)
        .fill()
        .map(() => flowList);
    }
    return null;
  };
  const isRemainingFlowListExists = () => {
    if (initiateFlowListCurrentPage * 10 < initiateFlowTotalCount) {
      return {
        isRemainingDataExists: true,
        count: initiateFlowTotalCount - renderedInitiateFlowListCount,
      };
    }
    return {
      isRemainingDataExists: false,
    };
  };
  const onLoadMoreHandler = () => {
    const searchWithPaginationData = {
      page: initiateFlowListCurrentPage,
      sort_field: 'username',
      size: 10,
    };
    if (searchText) searchWithPaginationData.search = searchText;
    dispatch(
      floatingActionMenuStartSectionDataChange({ isPaginatedData: true }),
    );
    onGetAllInitiateFlows(searchWithPaginationData);
  };

  const remainingFlowData = isRemainingFlowListExists();

  const scrollLoaders =
    isInitiateFlowListInfiniteScrollLoading &&
    getLoaders(remainingFlowData.count);
  const initiateFlowListScroller = isLoading ? (
    flowList
  ) : (
    <InfiniteScroll
      initialLoad={false}
      pageStart={0}
      loadMore={() => {
        if (
          remainingFlowData.isRemainingDataExists &&
          !isInitiateFlowListInfiniteScrollLoading &&
          !isLoading
        ) {
          onLoadMoreHandler();
        }
      }}
      hasMore={remainingFlowData.isRemainingDataExists}
      useWindow={false}
    >
      {flowList}
    </InfiniteScroll>
  );

  return (
    <>
      <div>
        <SearchBar
          className={cx(styles.SearchBar, gClasses.MT10)}
          searchIcon={styles.SearchIcon}
          placeholder={
            FLOATING_ACTION_MENU_STRINGS.START_SECTION.START.PLACEHOLDER
          }
          value={searchText}
          onChange={(value) => onChangeHandler(value)}
          type={SEARCH_BAR_TYPES.TYPE_3}
          searchIconAriaHidden="true"
          title="Search flows"
          autoComplete="off"
          ariaLabel={(searchText && arrInitiateFlows.length > 0 && !isLoading) ? 'search found' : ''}
          ariaLabelledBy={searchText && arrInitiateFlows.length === 0 && !isLoading && 'noResultsFound'}
        />
      </div>
      <div
        className={cx(
          gClasses.ScrollBar,
          styles.ScrollBar,
          gClasses.OverflowYScroll,
          gClasses.MT15,
          localStorage.getItem('application_language') === 'es-MX' ?
          styles.SpanishLanguageHeight :
          styles.OtherLanguageHeight,
        )}
      >
        {initiateFlowListScroller}
        {scrollLoaders}
      </div>
    </>
  );
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(StartMenu),
);
