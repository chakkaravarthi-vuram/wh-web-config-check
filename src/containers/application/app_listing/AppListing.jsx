import React, { useEffect, useRef, useState } from 'react';
import cx from 'classnames';
import {
  ETitleHeadingLevel,
  ETitleSize,
  TableWithInfiniteScroll,
  Title,
  TableScrollType,
  TableColumnWidthVariant,
  Button,
  Text,
  ETitleAlign,
  ETextSize,
  Modal,
  ModalStyleType,
  DialogSize,
  EButtonType,
  Input,
  BorderRadiusVariant,
  EInputIconPlacement,
  Size,
  Popper,
  EPopperPlacements,
  DropdownList,
} from '@workhall-pvt-lmt/wh-ui-library';

import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector, connect } from 'react-redux';
import { get, isEmpty } from 'lodash';
import { useHistory } from 'react-router-dom/cjs/react-router-dom';
import { withRouter } from 'react-router';
import gClasses from '../../../scss/Typography.module.scss';
import styles from './AppListing.module.scss';
import { APP_SORT_DROPDOWN_OPTIONS, constructTableData, constructTableHeader } from './AppListing.utils';
import { ARIA_ROLES, BS } from '../../../utils/UIConstants';
import { APPLICATION_STRINGS, APP_DELETE_ANYWAY } from '../application.strings';
import {
  deleteAppThunk,
  getAppsListApiThunk,
  updateAppHeaderApiThunk,
  updateAppOrderApiThunk,
} from '../../../redux/actions/Appplication.Action';
import {
  APP_LIST_ID,
  APP_LIST_INITIAL_PAGE,
  APP_LIST_SORT_FIELD_KEYS,
  APP_LIST_STATUS,
  APP_LIST_SETTINGS_OPTIONS,
  GET_APP_LIST_LABEL,
  APP_OPTION_VALUE,
} from './AppList.constants';
import EmptyAppIcon from '../../../assets/icons/application/EmptyAppIcon';
import { EMPTY_STRING, SEARCH_LABEL } from '../../../utils/strings/CommonStrings';
import {
  DRAFT_APP_LIST,
  EDIT_APP,
} from '../../../urls/RouteConstants';
import { appDeleteAnywayInitial, appListDataChange, resetAppListing } from '../../../redux/reducer/ApplicationReducer';
import AlertCircle from '../../../assets/icons/application/AlertCircle';
import CloseIconNew from '../../../assets/icons/CloseIconNew';
import { FORM_POPOVER_STATUS, ROUTE_METHOD, SORT_BY, UTIL_COLOR } from '../../../utils/Constants';
import jsUtility from '../../../utils/jsUtility';
import { ICON_STRINGS } from '../../../components/list_and_filter/ListAndFilter.strings';
import { keydownOrKeypessEnterHandle, useClickOutsideDetector, routeNavigate, showToastPopover } from '../../../utils/UtilityFunctions';
import DeleteConfirmModalAnyway from '../delete_comfirm_modal_anyway/DeleteConfirmModalAnyway';
import SettingsAppIcon from '../../../assets/icons/app_builder_icons/SettingsAppIcon';
import AutoPositioningPopper, { POPPER_PLACEMENTS } from '../../../components/auto_positioning_popper/AutoPositioningPopper';
import AppHeaderSettings from './app_header_settings/AppHeaderSettings';
import LandingSearchExitIcon from '../../../assets/icons/LandingSearchExitIcon';
import LandingPageSearchIcon from '../../../assets/icons/landing_page/LandingPageSearchIcon';
import SortDropdownIcon from '../../../assets/icons/landing_page/SortDropdownIcon';
import { getLandingListingRowCount } from '../../../utils/generatorUtils';
import useWindowSize from '../../../hooks/useWindowSize';

function AppListing(props) {
  const {
    appListDataChange,
    isTrialDisplayed,
  } = props;
  const { t } = useTranslation();
  const { deleteAnyWayPopper, appOrder } = useSelector((store) => store.ApplicationReducer);
  const header_type = useSelector((store) => store.RoleReducer.app_header_type);
  const { SHOWING, APPS, TAB } = APPLICATION_STRINGS(t).APP_LISTING;
  const dispatch = useDispatch();
  const {
    appList = [],
    isLoading = false,
    totalCount = 0,
    paginationDetails = {},
    hasMore = false,
    selectedTab,
  } = useSelector((state) => state.ApplicationReducer.appListParams);
  const history = useHistory();
  const [isSearchFocus, setIsSearchFocus] = useState(false);
  const pathname = get(history, ['location', 'pathname'], EMPTY_STRING);
  const [height] = useWindowSize();
  const draftApps = selectedTab === TAB.OPTIONS[1].tabIndex;

  const APP_LIST_LABEL = GET_APP_LIST_LABEL(t);
  // Screen Related States and Variables
  const initialParams = {
    size: 15,
    sort_field: APP_LIST_SORT_FIELD_KEYS.LAST_UPDATED_ON,
    sort_by: SORT_BY.DESC,
    sort_name: draftApps ? 'Saved On (DESC)' : 'Published On (DESC)',
    page: APP_LIST_INITIAL_PAGE,
  };
  initialParams.size = getLandingListingRowCount(height, isTrialDisplayed);
  const [params, setParams] = useState(initialParams);

  const [deletableAppUUID, setAppUUID] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [header, setHeader] = useState([]);
  const [isPopperOpen, setIsPopperOpen] = useState(false);
  const [selectedPopper, setSelectedPopper] = useState(null);
  const [isSortPopOverVisible, setIsSortPopOverVisible] = useState(false);
  const sortPopOverTargetRef = useRef(null);
  useClickOutsideDetector(sortPopOverTargetRef, () => setIsSortPopOverVisible(false));
  const wrapperRef = useRef(null);

  const closePopper = () => {
    setIsPopperOpen(false);
  };
  useClickOutsideDetector(wrapperRef, closePopper);

  // Main API Call
  const loadAppList = (page = null, status = null) => {
    const paramsData = jsUtility.cloneDeep(params);
    paramsData.size = initialParams.size;
    delete paramsData?.sort_name;
    dispatch(
      getAppsListApiThunk({
        ...paramsData,
        ...(page ? { page } : {}),
        ...(status ? { status } : {}),
      }),
    );
  };

  useEffect(() => {
    params?.status && loadAppList();
  }, [JSON.stringify(params), initialParams.size]);

  // set tab based on route
  useEffect(() => {
    let status = null;
    let tabIndex = null;
    if (pathname.includes(DRAFT_APP_LIST)) {
      status = APP_LIST_STATUS.UNPUBLISHED;
      tabIndex = TAB.OPTIONS[1].tabIndex;
    } else {
      status = APP_LIST_STATUS.PUBLISHED;
      tabIndex = TAB.OPTIONS[0].tabIndex;
    }

    appListDataChange({
      selectedTab: tabIndex,
    });

    setHeader(constructTableHeader(
      tabIndex,
      t,
      params?.sort_field,
      params?.sort_by,
    ));

    setParams({ ...initialParams, status });

    return () => dispatch(resetAppListing());
  }, [pathname]);

  const onLoadMoreForInifniteScroll = () => {
    loadAppList(get(paginationDetails, ['page'], 0) + 1);
  };

  // Actions.
  const onEditRow = (app_uuid) => {
    const editRowPathName = `${EDIT_APP}/${app_uuid}`;
    const editRowState = { app_uuid: app_uuid };
    routeNavigate(history, ROUTE_METHOD.PUSH, editRowPathName, null, editRowState);
  };

  const onDelete = (paramData = {}) => {
    dispatch(deleteAppThunk({ app_uuid: deletableAppUUID, ...paramData }, t))
      .then((response) => {
        if (response) {
          if (params?.page === APP_LIST_INITIAL_PAGE) {
            loadAppList();
          } else {
            setParams((previousParam) => {
              return { ...previousParam, page: APP_LIST_INITIAL_PAGE };
            });
          }
        }
        showToastPopover(
          t(APP_DELETE_ANYWAY.DELETED_SUCCESS),
          EMPTY_STRING,
          FORM_POPOVER_STATUS.SUCCESS,
          true,
        );
        if (paramData?.delete_anyway) {
          dispatch(appDeleteAnywayInitial());
        }
        setAppUUID(null);
        setShowDeleteModal(false);
      })
      .catch(() => {
        setShowDeleteModal(false);
      });
  };

  const onSort = (sort_order, label) => {
    const sortObject = jsUtility.filter(APP_SORT_DROPDOWN_OPTIONS(t), ['label', label])[0];
    setParams((previousState) => {
      return {
        ...previousState,
        page: APP_LIST_INITIAL_PAGE,
        sort_field: sortObject?.sortField,
        sort_by: sortObject?.sortBy,
        sort_name: label,
      };
    });
  };

  const updateHeaderSetting = (e, callBack) => {
    e.preventDefault();
    if (selectedPopper === APP_OPTION_VALUE.HEADER_SETTINGS) {
      dispatch(updateAppHeaderApiThunk({ header_type }, callBack));
      setSelectedPopper(null);
    } else {
      const params = { app_details: appOrder?.details.map((data, index) => { return { app_uuid: data.id, order: index + 2 }; }) || [] };
      dispatch(updateAppOrderApiThunk(params, t, () => setSelectedPopper(null)));
    }
  };

  // Empty Message
  const getEmptyMessage = () => (
      <div className={styles.EmptyMessageContainer}>
        <div>
          <EmptyAppIcon />
          <Title
            content={APP_LIST_LABEL.EMPTY_LIST_TITLE}
            alignment={ETitleAlign.middle}
            headingLevel={ETitleHeadingLevel.h5}
            size={ETitleSize.xs}
            className={styles.Title}
          />
        </div>
      </div>
    );

  const onCloseIconClick = () => {
    setParams((previousParams) => {
      const clonedParams = jsUtility.cloneDeep(previousParams);
      delete clonedParams.search;
      return clonedParams;
    });
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

  // Search Icon
  const getSearchIcon = () => (
    <button
      aria-label={t(SEARCH_LABEL)}
      className={gClasses.CenterV}
      onClick={() => setIsSearchFocus(!isSearchFocus)}
    >
      <LandingPageSearchIcon />
    </button>
  );

  // Sort Apps
  const getSortPopper = () => (
    <Popper
      targetRef={sortPopOverTargetRef}
      open={isSortPopOverVisible}
      placement={EPopperPlacements.BOTTOM_START}
      className={gClasses.ZIndex10}
      content={
          <DropdownList
            optionList={APP_SORT_DROPDOWN_OPTIONS(t, draftApps)}
            onClick={onSort}
            selectedValue={params?.sort_name}
          />
        }
    />
  );

  // Item count with filter function
  const getItemDisplayWithFilter = () => (
    <div
      className={cx(gClasses.CenterV, gClasses.JusSpaceBtw, gClasses.MX24, gClasses.PT16, gClasses.PB16)}
    >
      <Text
        content={`${SHOWING} ${totalCount} ${APPS}`}
        className={cx(gClasses.FTwo12GrayV98, gClasses.FontWeight500)}
        isLoading={isLoading}
      />
      <div className={cx(gClasses.Gap16, gClasses.CenterV, gClasses.JusEnd)}>
        <div className={gClasses.M16}>
          <Input
            content={params?.search || EMPTY_STRING}
            prefixIcon={getSearchIcon()}
            onChange={onSearchHandler}
            onFocusHandler={() => setIsSearchFocus(true)}
            onBlurHandler={() => setIsSearchFocus(false)}
            iconPosition={EInputIconPlacement.left}
            className={cx(styles.SearchOuterContainer, { [styles.ExpandedSearch]: isSearchFocus })}
            placeholder={t(SEARCH_LABEL)}
            size={Size.md}
            suffixIcon={
              params?.search && (
                <LandingSearchExitIcon
                  title={ICON_STRINGS.CLEAR}
                  className={cx(styles.SearchCloseIcon, gClasses.CursorPointer, gClasses.Width8, gClasses.MR6)}
                  tabIndex={0}
                  height={12}
                  width={12}
                  ariaLabel={ICON_STRINGS.CLEAR}
                  role={ARIA_ROLES.BUTTON}
                  onKeyDown={(e) => keydownOrKeypessEnterHandle(e) && onCloseIconClick()}
                  onClick={() => onCloseIconClick()}
                />
              )
            }
            borderRadiusType={BorderRadiusVariant.rounded}
          />
        </div>
        <div className={gClasses.CenterV}>
          <Text content="Sort By" className={cx(gClasses.FTwo12GrayV98, gClasses.FontWeight500, gClasses.MR8)} />
          <button onClick={() => setIsSortPopOverVisible((prevState) => !prevState)} ref={sortPopOverTargetRef} className={cx(gClasses.FTwo12BlueV39, gClasses.FontWeight500, styles.SortContainer, gClasses.gap8, gClasses.CenterV)}>
            {params?.sort_name}
            <SortDropdownIcon />
            {getSortPopper()}
          </button>
        </div>
        {!draftApps &&
          <div ref={wrapperRef}>
            <SettingsAppIcon
              className={cx(gClasses.CursorPointer, styles.IconsStrokeHover)}
              onClick={() => setIsPopperOpen(true)}
            />
            <AutoPositioningPopper
              className={cx(styles.PopperPosition, gClasses.ZIndex10)}
              placement={POPPER_PLACEMENTS.LEFT_START}
              isPopperOpen={isPopperOpen}
              referenceElement={wrapperRef?.current}
              fixedStrategy
            >
              <div className={cx(styles.PopperLayout, gClasses.P24)}>
                {APP_LIST_SETTINGS_OPTIONS(t).map((options) => (
                  <button
                    key={options.label}
                    className={styles.PopperElement}
                    onClick={() => setSelectedPopper(options.value)}
                  >
                    <Text className={gClasses.BlackV12} content={options.label} />
                  </button>
                ))}
              </div>
            </AutoPositioningPopper>
            <AppHeaderSettings
              selectedPopper={selectedPopper}
              isModalOpen={selectedPopper !== null}
              closeAppHeaderModel={() => setSelectedPopper(null)}
              updateHeaderSetting={updateHeaderSetting}
              isHeaderSetting={selectedPopper === APP_OPTION_VALUE.HEADER_SETTINGS}
            />
          </div>
        }
      </div>
    </div>
  );

  const disableInfiniteScroll = appList?.length < 4;

  // Table With Infinite scroll function
  const getAppListTable = () => (
    <div id={APP_LIST_ID.TABLE_ID} className={cx(styles.TableContainer, { [styles.OverflowXAuto]: disableInfiniteScroll, [styles.TableTrialContainer]: isTrialDisplayed })}>
      <TableWithInfiniteScroll
        scrollableId={APP_LIST_ID.TABLE_ID}
        className={cx({ [styles.ScrollInherit]: disableInfiniteScroll, [styles.OverFlowInherit]: !disableInfiniteScroll })}
        tableClassName={styles.AppListTable}
        header={header}
        data={constructTableData(appList, onEditRow, selectedTab)}
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
    if (!isLoading && isEmpty(appList)) return getEmptyMessage();
    return (
      getAppListTable()
    );
  };

  const onCloseModal = () => {
    setAppUUID(null);
    setShowDeleteModal(false);
    if (deleteAnyWayPopper) {
      dispatch(appDeleteAnywayInitial());
    }
  };

  return (
    <>
      <Modal
        id={APP_LIST_ID.DELETE_MODAL_ID}
        modalStyle={ModalStyleType.dialog}
        dialogSize={DialogSize.sm}
        className={gClasses.CursorAuto}
        mainContent={
          <div
            className={cx(
              BS.D_FLEX,
              BS.FLEX_COLUMN,
              BS.ALIGN_ITEM_CENTER,
              gClasses.P16,
            )}
          >
            <div className={cx(BS.D_FLEX, BS.JC_END, gClasses.MB8, BS.W100)}>
              <button onClick={onCloseModal}>
                <CloseIconNew />
              </button>
            </div>

            <div className={styles.AlertCircle}>
              <AlertCircle />
            </div>
            <Title
              content={APP_LIST_LABEL.DELETE_MODAL_TITLE}
              alignment={ETitleAlign.middle}
              headingLevel={ETitleHeadingLevel.h5}
              size={ETitleSize.xs}
              className={gClasses.MB16}
            />
            <Text
              content={APP_LIST_LABEL.DELETE_MODAL_SUB_TITLE_FIRST}
              size={ETextSize.SM}
              className={gClasses.MB8}
            />
            <Text
              content={APP_LIST_LABEL.DELETE_MODAL_SUB_TITLE_SECOND}
              size={ETextSize.SM}
              className={gClasses.MB8}
            />
            <div
              className={cx(
                BS.D_FLEX,
                BS.ALIGN_ITEM_CENTER,
                gClasses.MT16,
                gClasses.MB32,
              )}
            >
              <Button
                buttonText={APP_LIST_LABEL.DELETE_MODAL_NO_ACTION}
                onClickHandler={onCloseModal}
                type={EButtonType.OUTLINE_SECONDARY}
                className={cx(styles.MdCancelBtn, gClasses.MR16)}
              />
              <Button
                buttonText={APP_LIST_LABEL.DELETE_MODAL_YES_ACTION}
                onClickHandler={() => onDelete()}
                // className={gClasses.MR16}
                colorSchema={{ activeColor: UTIL_COLOR.RED_600 }}
                className={styles.MdDeleteBtn}
                type={EButtonType.PRIMARY}
              />
            </div>
          </div>
        }
        isModalOpen={showDeleteModal}
      />
      {deleteAnyWayPopper?.isAnywayVisible && (
        <DeleteConfirmModalAnyway
          deletePopperData={deleteAnyWayPopper}
          onCloseModal={onCloseModal}
          onDelete={onDelete}
        />)}
      <div className={styles.AppListContainer}>
        <div className={cx(styles.Content, styles.ContentWithoutPrompt)}>
          {getItemDisplayWithFilter()}
          {getContent()}
        </div>
      </div>
    </>
  );
}
const mapStateToProps = (state) => {
  return {
    enablePrompt: state.RoleReducer.enable_prompt,
    isTrialDisplayed: state.NavBarReducer.isTrialDisplayed,
    state,
  };
};

const mapDispatchToProps = {
  appListDataChange,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AppListing));
