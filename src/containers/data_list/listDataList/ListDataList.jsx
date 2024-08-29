import React, { useState, useEffect, lazy, useRef } from 'react';
import cx from 'classnames/bind';
import propTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { NavBarDataChange } from 'redux/actions/NavBar.Action';
import {
  dataListStateChangeAction,
  toggleAddDataListModalVisibility,
} from 'redux/reducer/DataListReducer';
import { DATA_LIST_DASHBOARD, EDIT_DATA_LIST } from 'urls/RouteConstants';
import { useTranslation } from 'react-i18next';
import { language } from 'language/config';
import { BorderRadiusVariant, Chip, DropdownList, EChipSize, EInputIconPlacement, EPopperPlacements, Input, Popper, Size, TableColumnWidthVariant, TableScrollType, TableWithInfiniteScroll, Text, UserDisplayGroup } from '@workhall-pvt-lmt/wh-ui-library';
import * as ROUTE_CONSTANTS from '../../../urls/RouteConstants';
import gClasses from '../../../scss/Typography.module.scss';
import {
  DATA_LIST_DROPDOWN,
  SEARCH_DATA_LIST,
  SCROLLABLE_DIV_ID,
  DATALIST_NORMAL_HEADERS,
  DATALIST_LISTING_SORT_OPTIONS,
  SORT_DROP_DOWN,
  DATALIST_KEY_ID,
} from './listDataList.strings';
import { ROLES, ROUTE_METHOD } from '../../../utils/Constants';
import jsUtils from '../../../utils/jsUtility';
import styles from './ListDataList.module.scss';
import {
  getNoDataFoundStrings,
  getTabFromUrl,
} from './ListDataList.utils';
import {
  getAllDataListDraftThunk,
  getAllDevDataListApiThunk,
} from '../../../redux/actions/DataListAction';
import { constructAvatarOrUserDisplayGroupList, getPopperContent, keydownOrKeypessEnterHandle, routeNavigate, useClickOutsideDetector } from '../../../utils/UtilityFunctions';
import { postDataListCreationPromptThunk } from '../../../redux/actions/DataListCreationPrompt.Action';
import LandingSearchExitIcon from '../../../assets/icons/LandingSearchExitIcon';
import LandingPageSearchIcon from '../../../assets/icons/landing_page/LandingPageSearchIcon';
import { EMPTY_STRING, ICON_ARIA_LABELS } from '../../../utils/strings/CommonStrings';
import { ICON_STRINGS } from '../../../components/list_and_filter/ListAndFilter.strings';
import { ARIA_ROLES } from '../../../utils/UIConstants';
import DatalistListingIcon from '../../../assets/icons/landing_page/DatalistListingIcon';
import { COLOR } from '../../application/app_components/task_listing/TaskList.constants';
import SortDropdownIcon from '../../../assets/icons/landing_page/SortDropdownIcon';
import Edit from '../../../assets/icons/application/EditV2';
import useWindowSize from '../../../hooks/useWindowSize';
import { getLandingListingRowCount } from '../../../utils/generatorUtils';
import { isSameDay, parse12HoursTimeFromUTC } from '../../../utils/dateUtils';
import { DataListDataEntity } from './listDataList.selectors';
// lazy imports
const NoDataFound = lazy(() => import('../../landing_page/no_data_found/NoDataFound'));
const CreateDatalist = lazy(() => import('containers/flow/create_data_list/CreateDataList'));

let cancelForGetAllDataListByCategory;
let cancelForGetAllDraftDataList;

export const getCancelTokenForGetAllDataListsByCategory = (cancelToken) => {
  cancelForGetAllDataListByCategory = cancelToken;
  return cancelToken;
};

export const getCancelTokenForGetAllDraftDataLists = (cancelToken) => {
  cancelForGetAllDraftDataList = cancelToken;
  return cancelToken;
};

function ListFlow(props) {
  const {
    tab_index,
    dispatch,
    data_list,
    isDataListEnteriesLoading,
    isDataListListingLoadMore,
    // common_server_error,
    total_count,
    hasMore,
    role,
    getAllDevDataListApiThunk,
    dataliststate,
    isTrialDisplayed,
  } = props;
  const { sortType, sortValue, sortLabel, sortBy } = dataliststate;
  const { t, i18n } = useTranslation();
  const [searchText, setSearchText] = useState('');
  const [activePage, setCurrentPage] = useState(1);
  const [isSearchFocus, setIsSearchFocus] = useState(false);
  const [isSortPopOverVisible, setIsSortPopOverVisible] = useState(false);
  const sortPopOverTargetRef = useRef(null);
  const [height] = useWindowSize();
  useClickOutsideDetector(sortPopOverTargetRef, () => setIsSortPopOverVisible(false));

  const getDataListByAllCategory = (basicParams = {}, additionalParams = {}) => {
    const { search, ...remainingParams } = basicParams;
    const params = {
      size: getLandingListingRowCount(height, isTrialDisplayed),
      search: searchText,
      with_category: '1',
      sort_field: sortType,
      sort_by: sortBy,
      ...remainingParams,
    };
    if (jsUtils.has(basicParams, 'search')) {
      params.search = basicParams.search;
    }
    if (basicParams.search !== searchText) {
      if (cancelForGetAllDataListByCategory) cancelForGetAllDataListByCategory();
    }
    if (!params.search) delete params.search;
    if (basicParams.page) {
      setCurrentPage(basicParams.page || 1);
    }
    getAllDevDataListApiThunk({
      ...params,
      ...additionalParams,
    });
  };

  const getDraftDataList = (basicParams) => {
    const { getAllDataListDraftThunk } = props;
    const { search, ...remainingParams } = basicParams;
    const params = {
      size: getLandingListingRowCount(height, isTrialDisplayed),
      search: searchText,
      ...remainingParams,
    };
    if (jsUtils.has(basicParams, 'search')) {
      params.search = basicParams.search;
    }
    if (basicParams.search !== searchText) {
      if (cancelForGetAllDraftDataList) cancelForGetAllDraftDataList();
    }
    if (!params.search) delete params.search;
    setCurrentPage(basicParams.page || 1);
    getAllDataListDraftThunk({ ...params });
  };

  const getDataListFromAction = (page, search, additionParams) => {
    const { tab_index } = props;
    switch (tab_index) {
      case DATA_LIST_DROPDOWN.ALL_DATA_LIST:
        return getDataListByAllCategory({ page, search }, { ...additionParams });
      case DATA_LIST_DROPDOWN.DATA_LIST_I_OWN:
        return getDataListByAllCategory({ page, search }, { managed_by: 'me', ...additionParams });
      case DATA_LIST_DROPDOWN.DRAFT_DATA_LIST:
        return getDraftDataList({ page, search });
      default:
        return null;
    }
  };

  const onInputChange = (event) => {
    const {
      target: { value },
    } = event;
    getDataListFromAction(1, value);
    if (value !== searchText) {
      return setSearchText(value);
    }
    return null;
  };

  const input = {
    onChange: onInputChange,
    placeholder: t(SEARCH_DATA_LIST.PLACE_HOLDER),
    isVisible: true,
    id: SEARCH_DATA_LIST.ID,
  };

  const onLoadMoreCallHandler = () => {
    if (data_list.length < total_count) {
      getDataListFromAction(activePage + 1, searchText);
    } else {
      dispatch(dataListStateChangeAction(false, 'hasMore'));
    }
  };

  const editDatalistFromListing = (datalist_uuid) => {
    const { history } = props;
    const editDataListPathName = EDIT_DATA_LIST;
    const editDataListState = { dataListUuid: datalist_uuid };
    routeNavigate(history, ROUTE_METHOD.PUSH, editDataListPathName, null, editDataListState);
  };

  const onActionHandler = (datalist_uuid) => {
    editDatalistFromListing(datalist_uuid);
  };

  const onCardClick = (dataListUuid, isDraft) => {
    const { history } = props;
    if (!isDraft) {
      const cardClickPathName = `${DATA_LIST_DASHBOARD}/${dataListUuid}`;
      const cardClickState = {
        datalist_tab: tab_index,
      };
      routeNavigate(history, ROUTE_METHOD.PUSH, cardClickPathName, null, cardClickState);
    } else {
      onActionHandler(dataListUuid);
    }
  };

  const { history } = props;

  useEffect(() => {
    if (!history?.location?.pathname) return;
    if (
      role === ROLES.MEMBER &&
      history.location.pathname !==
        ROUTE_CONSTANTS.LIST_DATA_LIST + ROUTE_CONSTANTS.DATALIST_OVERVIEW
    ) {
      const listDatalistPathName = ROUTE_CONSTANTS.LIST_DATA_LIST + ROUTE_CONSTANTS.DATALIST_OVERVIEW;
      routeNavigate(history, ROUTE_METHOD.PUSH, listDatalistPathName, null, null);
    }

    const tabIndexFromUrl = getTabFromUrl(history.location.pathname);

    if (tab_index !== tabIndexFromUrl) {
      dispatch(dataListStateChangeAction(tabIndexFromUrl, 'tab_index'));
    } else {
      getDataListFromAction(1, searchText);
    }
  }, [tab_index, height]);

  useEffect(() => {
    async function initFunction() {
      const { navbarChange } = props;
      await navbarChange({
        commonHeader: {
          tabOptions: DATA_LIST_DROPDOWN.OPTION_LIST(t),
          button: null,
        },
      });
    }
    initFunction();
  }, []);

  const getDatalistTitleAndCategory = (datalistRow) => (
    <div className={gClasses.CenterV}>
      <DatalistListingIcon className={gClasses.MinHW20} />
      <Text content={datalistRow?.data_list_name} className={cx(gClasses.FTwo12GrayV3Important, gClasses.FontWeight500, gClasses.ML8)} />
      {datalistRow?.category_name && (
        <Chip
          key={datalistRow?.label}
          size={EChipSize.sm}
          textColor={COLOR.BLACK_20}
          backgroundColor={COLOR.GRAY_10}
          text={datalistRow?.category_name}
          borderRadiusType={BorderRadiusVariant.circle}
          textClassName={cx(gClasses.FontWeight400, gClasses.FTwo11)}
          className={cx(gClasses.WhiteSpaceNoWrap, gClasses.PR6, gClasses.ML8)}
        />
      )}
    </div>
  );

  const getDatalistDescription = (datalistRow) => (
    <Text
      content={datalistRow?.data_list_description ? datalistRow?.data_list_description : '-'}
      className={cx(
        gClasses.FTwo12GrayV3Important,
        gClasses.FontWeight500,
        gClasses.Ellipsis,
        styles.DescWidth,
        gClasses.FTwo13GrayV98,
      )}
    />
  );

  const onSortHandler = (sortId) => {
    const sortObject = jsUtils.filter(DATALIST_LISTING_SORT_OPTIONS(t), [DATALIST_KEY_ID(t).VALUE, sortId])[0];
    const additionParams = {
      sort_field: sortObject?.type,
      sort_by: sortObject?.sortBy,
    };
    dispatch(dataListStateChangeAction(sortObject.label, DATALIST_KEY_ID(t).SORT_LABEL));
    dispatch(dataListStateChangeAction(sortObject.value, DATALIST_KEY_ID(t).SORT_VALUE));
    dispatch(dataListStateChangeAction(sortObject.sortBy, DATALIST_KEY_ID(t).SORT_BY));
    getDataListFromAction(1, searchText, additionParams);
  };

  // Sort datalists
  const getSortPopper = () => (
    <Popper
      targetRef={sortPopOverTargetRef}
      open={isSortPopOverVisible}
      placement={EPopperPlacements.BOTTOM_START}
      className={gClasses.ZIndex10}
      content={
          <DropdownList
            optionList={DATALIST_LISTING_SORT_OPTIONS(t)}
            onClick={onSortHandler}
            selectedValue={sortValue}
          />
        }
    />
  );

  const getAssignedOnDetails = (assigned_on) => {
    if (!assigned_on) return null;
    const dateTimeFormat = assigned_on.pref_datetime_display;
    if (dateTimeFormat) {
      const dateYear = dateTimeFormat.split(',')[0];
      const dateYearArray = dateYear.split(' ');
      const timeLabel = '';
      if (isSameDay(assigned_on.utc_tz_datetime)) {
        return `${timeLabel} ${parse12HoursTimeFromUTC(dateTimeFormat)}`;
      }
      return `${timeLabel} ${dateYearArray[1]} ${dateYearArray[0]}, ${dateYearArray[2]}`;
    }
    return null;
  };

  let datalistListItems = [];
  let isNoData = false;
  if ((isDataListEnteriesLoading) && !isDataListListingLoadMore) {
    isNoData = false;
  } else if (!jsUtils.isEmpty(data_list)) {
    isNoData = false;
    if (tab_index === DATA_LIST_DROPDOWN.DRAFT_DATA_LIST) {
      datalistListItems = data_list.map((eachDatalist) => {
      const dataListData = DataListDataEntity(eachDatalist);

      const onEditClick = () => {
        onActionHandler(dataListData.getDataLisUuid());
      };
      const version = (
        <div
          className={cx(
            styles.VersionText,
            gClasses.FTwo12,
            gClasses.CenterV,
            (i18n.language === language.spanish_mexico) ? gClasses.W150 : gClasses.W125,
            gClasses.MR8,
            gClasses.ML8,
          )}
        >
          {dataListData.getVersionNumberDisplay()}
          {', '}
          {dataListData.getLastUpdateOnView()}
        </div>
      );
      const DatalistName = dataListData.getDataListName();
      const datalistDesc = dataListData.getDataListDescription();
      const editButton = (
        <button
          className={gClasses.PR16}
          onClick={onEditClick}
        >
          <Edit className={styles.EditIcon} />
        </button>
      );
      const avatarGroup = (
        <div className={cx(styles.DatalistIOwnAvatar)}>
          <UserDisplayGroup
              id="UserDisplayGroup"
              userAndTeamList={constructAvatarOrUserDisplayGroupList({
                users: dataListData.getDatalistUsers(),
                teams: dataListData.getDatalistTeams(),
              })}
              count={1}
              separator=", "
              popperPlacement={EPopperPlacements.AUTO}
              getPopperContent={(id, type, onShow, onHide) => getPopperContent(id, type, onShow, onHide)}
              getRemainingPopperContent={(id, type, onShow, onHide) => getPopperContent(id, type, onShow, onHide)}
              className={cx(styles.UserList, gClasses.W100)}
          />
        </div>
      );
      const titleData = (
        <div
          role="presentation"
          className={cx(
            gClasses.FTwo13GrayV3,
            styles.DatalistTitleContainer,
            gClasses.Ellipsis,
            gClasses.CenterV,
          )}
        >
          <DatalistListingIcon className={gClasses.MinHW20} />
          <span className={cx(gClasses.TextTransformCap, gClasses.ML8, gClasses.FTwo13GrayV3, gClasses.FontWeight500, styles.TaskDefinition)}>{DatalistName}</span>
          {datalistDesc && (<span className={styles.TitleDescDivider} />)}
          {datalistDesc && (
            <span title={datalistDesc} className={cx(styles.DatalistDesc, gClasses.FTwo12, styles.TaskDefinition)}>
              {datalistDesc}
            </span>
          )}
        </div>
      );
      return {
        id: eachDatalist?.data_list_uuid,
        component: [titleData, avatarGroup, version, editButton],
      };
      });
    } else {
      const datalistData = [];
      data_list.forEach((eachDatalist) => {
        const rowData = { component: [], id: EMPTY_STRING };
        rowData.component = [getDatalistTitleAndCategory(eachDatalist), getDatalistDescription(eachDatalist), getAssignedOnDetails(eachDatalist?.last_updated_on)];
        rowData.id = eachDatalist?.data_list_uuid;
        datalistData.push(rowData);
      });
      datalistListItems = datalistData;
    }
  } else {
    isNoData = true;
  }

  const handleRowClick = (dataListUuid) => {
    const selectedDatalistData = jsUtils.filter(data_list, [DATALIST_KEY_ID(t).DL_UUID, dataListUuid])[0];
    onCardClick(dataListUuid, tab_index === DATA_LIST_DROPDOWN.DRAFT_DATA_LIST, selectedDatalistData);
  };

  const tableViewDatalist = () => {
    if (isNoData) {
      return (
        <div className={gClasses.MX30}>
          <NoDataFound
            dataText={getNoDataFoundStrings(tab_index, searchText, t)}
            originalLocation="Datalists"
            NoSearchFoundLabelStyles={gClasses.BoxShadowNone}
          />
        </div>
      );
    } else {
      return (
        <div id={SCROLLABLE_DIV_ID} className={cx(styles.TableTaskContainer, gClasses.W100, { [styles.TableTrialContainer]: isTrialDisplayed })}>
          <TableWithInfiniteScroll
            scrollableId={SCROLLABLE_DIV_ID}
            tableClassName={cx(styles.DatalistTable, gClasses.W100, { [styles.DraftTable]: tab_index === DATA_LIST_DROPDOWN.DRAFT_DATA_LIST })}
            header={DATALIST_NORMAL_HEADERS(tab_index === DATA_LIST_DROPDOWN.DRAFT_DATA_LIST, t)}
            data={datalistListItems}
            isLoading={isDataListEnteriesLoading}
            isRowClickable
            onRowClick={handleRowClick}
            scrollType={TableScrollType.BODY_SCROLL}
            hasMore={hasMore}
            onLoadMore={onLoadMoreCallHandler}
            loaderRowCount={4}
            widthVariant={TableColumnWidthVariant.CUSTOM}
          />
        </div>
      );
    }
  };

  // Search Icon
  const getSearchIcon = () => (
    <button
      aria-label={ICON_ARIA_LABELS.SEARCH}
      className={gClasses.CenterV}
      onClick={() => setIsSearchFocus(!isSearchFocus)}
    >
      <LandingPageSearchIcon />
    </button>
  );

  return (
    <div>
      <div className={cx(gClasses.CenterV, gClasses.JusSpaceBtw, gClasses.MX24, gClasses.PT16, gClasses.PB16)}>
        <Text
          content={`${DATALIST_KEY_ID(t).SHOWING} ${total_count} ${DATALIST_KEY_ID(t).DATALISTS}`}
          className={cx(gClasses.FTwo12GrayV98, gClasses.FontWeight500)}
          isLoading={isDataListEnteriesLoading}
        />
        <div className={cx(gClasses.Gap16, gClasses.CenterV, gClasses.JusEnd)}>
          <div className={gClasses.M16}>
            <Input
              content={searchText || EMPTY_STRING}
              prefixIcon={getSearchIcon()}
              onChange={input.onChange}
              onFocusHandler={() => setIsSearchFocus(true)}
              onBlurHandler={() => setIsSearchFocus(false)}
              iconPosition={EInputIconPlacement.left}
              className={cx(styles.SearchOuterContainer, { [styles.ExpandedSearch]: isSearchFocus })}
              placeholder={DATALIST_KEY_ID(t).SEARCH_PLACEHOLDER}
              size={Size.md}
              suffixIcon={
                searchText && (
                  <LandingSearchExitIcon
                    title={ICON_STRINGS.CLEAR}
                    className={cx(styles.SearchCloseIcon, gClasses.CursorPointer, gClasses.Width8, gClasses.MR6)}
                    tabIndex={0}
                    height={12}
                    width={12}
                    ariaLabel={ICON_STRINGS.CLEAR}
                    role={ARIA_ROLES.BUTTON}
                    onKeyDown={(e) => keydownOrKeypessEnterHandle(e) && input.onChange({ target: { value: EMPTY_STRING } })}
                    onClick={() => input.onChange({ target: { value: EMPTY_STRING } })}
                  />
                )
              }
              borderRadiusType={BorderRadiusVariant.rounded}
            />
          </div>
          {tab_index !== DATA_LIST_DROPDOWN.DRAFT_DATA_LIST && (
            <div className={gClasses.CenterV}>
              <Text content={SORT_DROP_DOWN.PLACE_HOLDER} className={cx(gClasses.FTwo12GrayV98, gClasses.FontWeight500, gClasses.MR8)} />
              <button onClick={() => setIsSortPopOverVisible((prevState) => !prevState)} ref={sortPopOverTargetRef} className={cx(gClasses.FTwo12BlueV39, gClasses.FontWeight500, styles.SortContainer, gClasses.gap8, gClasses.CenterV)}>
                {sortLabel}
                <SortDropdownIcon />
                {getSortPopper()}
              </button>
            </div>)}
        </div>
      </div>
      <div className={cx(
        styles.DatalisListingContainer,
        (tab_index === DATA_LIST_DROPDOWN.DRAFT_DATA_LIST) && gClasses.PL0,
      )}
      >
        {tableViewDatalist()}
      </div>
      {((history.location.pathname.includes('createDatalist'))) ? <CreateDatalist /> : null}
    </div>
  );
}

const mapDispatchToProps = (dispatch) => {
  return {
    navbarChange: (data) => {
      dispatch(NavBarDataChange(data));
    },
    onDataListDataChange: (data, id) => {
      dispatch(dataListStateChangeAction(data, id));
    },
    getAllDataListDraftThunk: (params) => {
      dispatch(getAllDataListDraftThunk(params));
    },
    getAllDevDataListApiThunk: (params) => {
      dispatch(getAllDevDataListApiThunk(params));
    },
    toggleAddDataListModalVisibilityAction: (data) => {
      dispatch(toggleAddDataListModalVisibility(data));
    },
    postDataListCreationPrompt: (...params) => {
      dispatch(postDataListCreationPromptThunk(...params));
    },
    dispatch,
  };
};

const mapStateToProps = (state) => {
  return {
    tab_index: state.DataListReducer.tab_index,
    dataliststate: state.DataListReducer,
    data_list: state.DataListReducer.data_list,
    isDataListEnteriesLoading: state.DataListReducer.isDataListEnteriesLoading,
    isDataListListingLoadMore: state.DataListReducer.isDataListListingLoadMore,
    common_server_error: state.DataListReducer.common_server_error,
    total_count: state.DataListReducer.count,
    hasMore: state.DataListReducer.hasMore,
    userId: state.RoleReducer.user_id,
    dataListSecurity: state.DataListReducer.dataListSecurity,
    document_url_details: state.DataListReducer.document_url_details,
    role: state.RoleReducer.role,
    enablePrompt: state.RoleReducer.enable_prompt,
    isTrialDisplayed: state.NavBarReducer.isTrialDisplayed,
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(ListFlow),
);
ListFlow.propTypes = {
  history: propTypes.objectOf(propTypes.any).isRequired,
};
