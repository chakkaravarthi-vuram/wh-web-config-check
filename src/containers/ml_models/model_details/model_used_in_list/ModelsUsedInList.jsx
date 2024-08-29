import React, { useEffect, useState } from 'react';
// import { connect } from 'react-redux';
import cx from 'classnames';
import {
  ETitleHeadingLevel,
  ETitleSize,
  TableWithInfiniteScroll,
  Title,
  TableScrollType,
  TableColumnWidthVariant,
  ETitleAlign,
  TableSortOrder,
  Input,
  BorderRadiusVariant,
  Variant,
  EInputIconPlacement } from '@workhall-pvt-lmt/wh-ui-library';

import { useTranslation } from 'react-i18next';
import { useDispatch, connect } from 'react-redux';
import { get, isEmpty } from 'lodash';
import { useHistory } from 'react-router-dom/cjs/react-router-dom';
import gClasses from '../../../../scss/Typography.module.scss';
import styles from './ModelsUsedInList.module.scss';
import { constructTableData, constructTableHeader } from './ModelsUsedInList.utils';
import { ARIA_ROLES, BS } from '../../../../utils/UIConstants';
import { GET_MODELS_USED_IN_LIST_STRINGS } from './ModelsUsedInList.strings';
import { getMLFlowListApiThunk, resetFlowList } from '../../../../redux/actions/MlModelList.Action';
import {
  APP_LIST_ID,
  APP_LIST_INITIAL_PAGE,
  APP_LIST_SORT_FIELD_KEYS,
} from '../../../application/app_listing/AppList.constants';
import EmptyAppIcon from '../../../../assets/icons/application/EmptyAppIcon';
import { EMPTY_STRING, SEARCH_LABEL } from '../../../../utils/strings/CommonStrings';
// import { PROCEDURE_DASHBOARD } from '../../../../urls/RouteConstants';
// import { resetAppListing } from '../../../../redux/reducer/ApplicationReducer';
import CloseIconNew from '../../../../assets/icons/CloseIconNew';
import { ROUTE_METHOD, SORT_BY } from '../../../../utils/Constants';
import jsUtility from '../../../../utils/jsUtility';
import SearchIcon from '../../../../assets/icons/SearchIcon';
import { ICON_STRINGS } from '../../../../components/list_and_filter/ListAndFilter.strings';
import { ARIA_LABEL } from '../../../search_tab/SearchTab.utils';
import { keydownOrKeypessEnterHandle, routeNavigate, getDevRoutePath } from '../../../../utils/UtilityFunctions';
import { EDIT_FLOW } from '../../../../urls/RouteConstants';

function AppListing(props) {
  const { getMLFlowListApiThunk, resetFlowList, flowListParams, selectedModelCode } = props;
  console.log(props, 'AppListing');
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const {
    flowList = [],
    isLoading = false,
    totalCount = 0,
    paginationDetails = {},
    hasMore = false,
  } = flowListParams;

  const history = useHistory();
  const pathname = get(history, ['location', 'pathname'], EMPTY_STRING);
  const [params, setParams] = useState({
    model_id: selectedModelCode,
    size: 20,
    sort_field: APP_LIST_SORT_FIELD_KEYS.NAME,
    sort_by: SORT_BY.ASC,
    page: APP_LIST_INITIAL_PAGE,
  });
  const [header, setHeader] = useState([]);

  // Main API Call
  const loadFlowList = (page = null) => {
    getMLFlowListApiThunk({
      ...params,
      ...(page ? { page } : {}),
    });
  };

  useEffect(() => {
    loadFlowList();
  }, [JSON.stringify(params)]);

  // set tab based on route
  useEffect(() => {
    setHeader(constructTableHeader(
      t,
      params?.sort_field,
      params?.sort_by,
    ));

    return () => dispatch(resetFlowList);
  }, [pathname]);

  const onLoadMoreForInifniteScroll = () => {
    loadFlowList(get(paginationDetails, ['page'], 0) + 1);
  };

  // Actions.
  const onEditRow = (flow_uuid) => {
      const flowDashboardState = {
        flow_uuid: flow_uuid,
      };
      const pathname = getDevRoutePath(`${EDIT_FLOW}`);
      routeNavigate(history, ROUTE_METHOD.PUSH, pathname, EMPTY_STRING, flowDashboardState, true);
  };

  const onSort = (fieldKey = null, sortOrder = TableSortOrder.ASC) => {
    setHeader(() => {
      const sort_order =
        sortOrder === TableSortOrder.ASC ? SORT_BY.DESC : SORT_BY.ASC;
      setParams((previousState) => {
        return {
          ...previousState,
          page: APP_LIST_INITIAL_PAGE,
          sort_field: fieldKey,
          sort_by: sort_order,
        };
      });
      return constructTableHeader(t, fieldKey, sort_order);
    });
  };

  // Empty Message
  const getEmptyMessage = () => (
      <div className={styles.EmptyMessageContainer}>
        <div>
          <EmptyAppIcon />
          <Title
            content={GET_MODELS_USED_IN_LIST_STRINGS(t).EMPTY_LIST_TITLE}
            alignment={ETitleAlign.middle}
            headingLevel={ETitleHeadingLevel.h5}
            size={ETitleSize.xs}
            className={styles.Title}
          />
        </div>
      </div>
    );

  // Item count with filter function
  const getItemDisplayWithFilter = () => (
    <div
      className={cx(
        gClasses.MB8,
        gClasses.PL9,
        BS.D_FLEX,
        BS.ALIGN_ITEM_CENTER,
        BS.JC_BETWEEN,
      )}
    >
      <Title
         content={`${GET_MODELS_USED_IN_LIST_STRINGS(t).SHOWING} ${totalCount} ${GET_MODELS_USED_IN_LIST_STRINGS(t).FLOWS}`}
        headingLevel={ETitleHeadingLevel.h5}
        size={ETitleSize.xs}
        isDataLoading={isLoading}
      />
    </div>
  );

  const disableInfiniteScroll = flowList?.length < 4;

  // Table With Infinite scroll function
  const getFlowListTable = () => (
    <div id={APP_LIST_ID.TABLE_ID} className={cx(styles.TableContainer, { [styles.OverflowXAuto]: disableInfiniteScroll })}>
      <TableWithInfiniteScroll
        scrollableId={APP_LIST_ID.TABLE_ID}
        className={cx({ [styles.ScrollInherit]: disableInfiniteScroll, [styles.OverFlowInherit]: !disableInfiniteScroll })}
        tableClassName={styles.FlowListTable}
        header={header}
        data={constructTableData(flowList, onEditRow)}
        isLoading={
          get(paginationDetails, ['page'], 0) > APP_LIST_INITIAL_PAGE
            ? false
            : isLoading
        }
        isRowClickable
        onRowClick={() => {}}
        onSortClick={onSort}
        scrollType={TableScrollType.BODY_SCROLL}
        hasMore={hasMore}
        onLoadMore={onLoadMoreForInifniteScroll}
        loaderRowCount={4}
        widthVariant={TableColumnWidthVariant.CUSTOM}
      />
    </div>
  );

  const getContent = () => {
    if (!isLoading && isEmpty(flowList)) return getEmptyMessage();
    return (
      <>
        {/* Item count with filter */}
        {getItemDisplayWithFilter()}

        {/* Table With Infinite scroll */}
        {getFlowListTable()}
      </>
    );
  };

  const onSearchHandler = (event) => {
     const search = event?.target?.value;
     setParams((previousParams) => {
      const clonedParams = jsUtility.cloneDeep(previousParams);
      if (search) clonedParams.search = search;
      else delete clonedParams?.search;

      return clonedParams;
    });
  };

  const onCloseIconClick = () => {
    setParams((previousParams) => {
      const clonedParams = jsUtility.cloneDeep(previousParams);
      delete clonedParams.search;
      return clonedParams;
    });
  };

//   const isEnablePrompt = enablePrompt && role !== ROLES.MEMBER;
  const isEnablePrompt = false;

  return (
      <div className={styles.AppListContainer}>
        <div className={styles.SearchShadow}>
          <Input
            content={params?.search || EMPTY_STRING}
            prefixIcon={(
              <SearchIcon
                className={styles.SearchIcon}
                role={ARIA_ROLES.PRESENTATION}
              />
            )}
            suffixIcon={!isEmpty(params?.search) && (
              <CloseIconNew
                title={ICON_STRINGS.CLEAR}
                className={cx(styles.CloseIcon, gClasses.CursorPointer)}
                onClick={onCloseIconClick}
                role={ARIA_ROLES.BUTTON}
                tabIndex={0}
                ariaLabel={ARIA_LABEL.CLEAR_SEARCH}
                onKeyDown={(e) => keydownOrKeypessEnterHandle(e) && onCloseIconClick()}
              />
            )}
            onChange={onSearchHandler}
            iconPosition={EInputIconPlacement.left}
            className={styles.Search}
            placeholder={t(SEARCH_LABEL)}
            size="lg"
            variant={Variant.borderLess}
            borderRadiusType={BorderRadiusVariant.rounded}
          />
        </div>
        <div className={cx(gClasses.PX15, styles.Content, isEnablePrompt ? styles.ContentWithPrompt : styles.ContentWithoutPrompt)}>
          {getContent()}
        </div>
      </div>
  );
}

const mapStateToProps = (state) => {
  return {
    flowListParams: state.MlModelListReducer.flowListParams,
    mldata: state.MlModelListReducer,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch,
    getMLFlowListApiThunk: (params) => {
      dispatch(getMLFlowListApiThunk(params));
    },
    resetFlowList: () => {
      dispatch(resetFlowList());
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AppListing);
// export default AppListing;
