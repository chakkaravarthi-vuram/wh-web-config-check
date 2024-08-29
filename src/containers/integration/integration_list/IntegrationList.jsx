import React, { useContext, useEffect, useRef, useState } from 'react';
import cx from 'classnames/bind';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import gClasses from 'scss/Typography.module.scss';
import { isEmpty, has } from 'utils/jsUtility';
import TaskCard from 'containers/landing_page/to_do_task/task_card/TaskCard';
import {
  Button,
  ColorVariant,
  EButtonType,
  EPopperPlacements,
  ETextSize,
  Input,
  Popper,
  RadioGroup,
  RadioGroupLayout,
  RadioSize,
  SingleDropdown,
  TableColumnWidthVariant,
  TableScrollType,
  TableWithInfiniteScroll,
  Text,
  Variant,
  ToggleButton,
  EInputIconPlacement,
  Size,
  BorderRadiusVariant,
  EButtonSizeType,
  Title,
  ETitleHeadingLevel,
  ETitleSize,
  DropdownList,
} from '@workhall-pvt-lmt/wh-ui-library';
import queryString from 'query-string';
import { cloneDeep, get } from 'lodash';
import styles from '../Integration.module.scss';
import {
  EXTERNAL_API_FILTERS,
  FILTER_TYPE,
  getBadgeValue,
  getIntegrationListHeader,
  getNameValue,
  getTableStyle,
  getTypeValue,
  getUpdatedOnValue,
  INTEGRATION_TABS,
  SHOW_BY_OPTIONS,
} from '../Integration.utils';
import {
  CREATE_CREDENTIAL,
  CREATE_FIRST_CREDENTIAL,
  CREATE_FIRST_INTEGRATION,
  CREATE_INTEGRATION_TEXT,
  EMPTY_LIST_STRINGS,
  getIntegrationSortOptions,
  LIST_FILTER_LABELS,
  LIST_TITLE,
  MAX_CRED_LIMIT_LABELS,
  NO_CREDENTIAL_FOUND,
  NO_INTEGRATION_FOUND,
} from '../Integration.strings';
import { ARIA_ROLES, BS } from '../../../utils/UIConstants';
import { EMPTY_STRING, SEARCH_LABEL } from '../../../utils/strings/CommonStrings';
import {
  getDBConnectorConfigurationApiThunk,
  getIntegrationConfigurationApiThunk,
  getIntegrationConnectorApiThunk,
  getListOauthClientCredentialsApiThunk,
  getSingleOauthCredentialApiThunk,
} from '../../../redux/actions/Integration.Action';
import {
  EXTERNAL_FILTER_COUNT,
  INTEGRATION_CONSTANTS,
  INTEGRATION_FILTER_CONSTANTS,
  LIST_CONSTANTS,
  LIST_TAB_VALUES,
} from '../Integration.constants';
import { keydownOrKeypessEnterHandle, routeNavigate, useClickOutsideDetector } from '../../../utils/UtilityFunctions';
import { integrationDataChange } from '../../../redux/reducer/IntegrationReducer';
import { generateEventTargetObject, getFullName } from '../../../utils/generatorUtils';
import NoDataFoundIcon from '../../../assets/icons/integration/listing/NoDataFoundIcon';
import {
  API_CREDENTIAL,
  DRAFT_INTEGRATION,
  EXTERNAL_DB_CONNECTION,
  EXTERNAL_INTEGRATION,
  WORKHALL_INTEGRATION,
} from '../../../urls/RouteConstants';
import CreateCredential from '../client_credential/create_credential/CreateCredential';
import EditCredential from '../client_credential/edit_credential/EditCredential';
import NoDataComponent from '../../no_data_component/NoDataComponent';
import ListLoadErrorIcon from '../../../assets/icons/user_settings/security/ListLoadErrorIcon';
import { API_KEY_STRINGS } from '../../user_settings/UserSettings.strings';
import NoSearchFoundIcon from '../../../assets/icons/integration/listing/NoSearchFoundIcon';
import WorkhallIconLetter from '../../../assets/icons/WorkhallIconLetter';
import IntegrationNavIcon from '../../../assets/icons/side_bar/IntegrationNavIcon';
import jsUtility from '../../../utils/jsUtility';
import CircleAlertIcon from '../../../assets/icons/user_settings/CircleAlertIcon';
import ConfirmationModal from '../../../components/form_components/confirmation_modal/ConfirmationModal';
import { ROUTE_METHOD } from '../../../utils/Constants';
import ThemeContext from '../../../hoc/ThemeContext';
import { setPointerEvent, updatePostLoader } from '../../../utils/loaderUtils';
import { getOauthClientCredentialsApi } from '../../../axios/apiService/Integration.apiService';
import LandingSearchExitIcon from '../../../assets/icons/LandingSearchExitIcon';
import { ICON_STRINGS } from '../../sign_in/SignIn.strings';
import LandingPageSearchIcon from '../../../assets/icons/landing_page/LandingPageSearchIcon';
import LandingFilterIcon from '../../../assets/icons/landing_page/LandingFilterIcon';
import SortDropdownIcon from '../../../assets/icons/landing_page/SortDropdownIcon';
import { SORT_DROP_DOWN } from '../../flow/listFlow/listFlow.strings';

let cancelGetIntegrationsList = null;
let cancelTokenExternalApi;
let cancelTokenWorkhallApi;
let cancelTokenOauthApi;
let cancelTokenExternalDBConnectorApi;

export const setCancelGetIntegrationsList = (cancelToken) => {
  cancelGetIntegrationsList = cancelToken;
};

export const getCancelTokenExternalApi = (cancelToken) => {
  cancelTokenExternalApi = cancelToken;
};

export const getCancelTokenWorkhallApi = (cancelToken) => {
  cancelTokenWorkhallApi = cancelToken;
};

export const getCancelTokenOauthApi = (cancelToken) => {
  cancelTokenOauthApi = cancelToken;
};

export const setCancelTokenExternalDBConnectorApi = (cancelToken) => {
  cancelTokenExternalDBConnectorApi = cancelToken;
};

function IntegrationList(props) {
  const {
    integrationsList,
    handleCardClick,
    selectedTab,
    isLoadingList,
    isErrorInLoading,
    hasMore,
    listCount = 0,
    getIntegrationConnectorApi,
    onIntegrationDataChange,
    template_filter_type,
    show_by_value,
    getIntegrationConfigurationApi,
    listSearchText,
    getListOauthClientCredentialsApi,
    isCreateCredentialModalOpen,
    isEditCredentialModalOpen,
    getSingleOauthCredentialApi,
    integrationTab,
    initial_template_filter,
    isListView,
    getDBConnectorConfigurationApi,
    sortType,
    sortBy,
    sortLabel,
  } = props;
  const { t } = useTranslation();
  const [isSortPopOverVisible, setIsSortPopOverVisible] = useState(false);
  const sortPopOverTargetRef = useRef(null);
  useClickOutsideDetector(sortPopOverTargetRef, () => setIsSortPopOverVisible(false));
  const { colorSchemeDefault } = useContext(ThemeContext);

  let createCredentialModal = null;
  let editCredentialModal = null;
  const headerTotalHeight = 160;
  const singleCardHeight = 48;

  const filterRef = useRef();
  const history = useHistory();
  const [perPageCount, setPerPageCount] = useState(15);
  const [searchFocus, setSearchFocus] = useState(false);
  const [isFilterOpen, setFilterOpen] = useState(false);
  const [isTemplateApplied, setTemplateApplied] = useState(false);
  const [isMaxCredentialLimitOpen, setMaxCredentialLimitOpen] = useState(false);
  const [isDraft, setIsDraft] = useState(false);
  const { SHOWING, INTEGRATIONS, DB_CONNECTOR, CREDENTIALS, DRAFT } = LIST_TITLE(t);
  const { API_TYPE } = INTEGRATION_CONSTANTS;
  const isWorkhallApi = (selectedTab === INTEGRATION_TABS.WORKHALL_API ||
    ((selectedTab === INTEGRATION_TABS.DRAFT_INTEGRATION) && (show_by_value === API_TYPE.WORKHALL)));

  let pageTitle = INTEGRATIONS;
  if (selectedTab === INTEGRATION_TABS.API_CREDENTIAL) {
    pageTitle = CREDENTIALS;
  } else if (selectedTab === INTEGRATION_TABS.EXTERNAL_DB_CONNECTOR) {
    pageTitle = DB_CONNECTOR;
  }

  const onFilterBlur = () => {
    console.log('onFilterBlur', initial_template_filter);
    onIntegrationDataChange({
      template_filter_type: initial_template_filter,
    });
    setFilterOpen(false);
  };

  useClickOutsideDetector(filterRef, () => onFilterBlur(), [initial_template_filter]);

  const cardClick = (id) => {
    if (selectedTab === LIST_TAB_VALUES.API_CREDENTIALS) {
      const data = {
        _id: id,
      };
      getSingleOauthCredentialApi(data, getCancelTokenOauthApi);
    } else if (selectedTab === LIST_TAB_VALUES.DB_CONNECTOR) {
      const data = integrationsList?.find((integration) => integration._id === id);
      handleCardClick(data, isDraft, EXTERNAL_DB_CONNECTION);
    } else {
      const data = integrationsList?.find((integration) => integration._id === id);
      if (show_by_value === API_TYPE.EXTERNAL) {
        handleCardClick(data, false, EXTERNAL_INTEGRATION);
      } else {
        handleCardClick(data, false, WORKHALL_INTEGRATION);
      }
    }
  };

  const loadListData = async (tabIndex, additionalParams = {}, showByValue = show_by_value, isDraft = false) => {
    let apiParams = {
      page: 1,
      size: perPageCount,
      search: listSearchText,
      ...additionalParams,
    };
    if (isEmpty(apiParams?.search)) delete apiParams.search;
    if (cancelGetIntegrationsList) cancelGetIntegrationsList();
    if (cancelTokenExternalApi) cancelTokenExternalApi();
    if (cancelTokenWorkhallApi) cancelTokenWorkhallApi();
    if (cancelTokenOauthApi) cancelTokenOauthApi();
    if (cancelTokenExternalDBConnectorApi) cancelTokenExternalDBConnectorApi();
    let apiTabIndex = tabIndex;
    const initialLoad = apiParams?.page === 1;
    if (tabIndex === LIST_TAB_VALUES.DRAFTS) {
      apiTabIndex = showByValue === INTEGRATION_CONSTANTS.API_TYPE.EXTERNAL ? LIST_TAB_VALUES.EXTERNAL_API : LIST_TAB_VALUES.WORKHALL_API;
    }
    switch (apiTabIndex) {
      case LIST_TAB_VALUES.EXTERNAL_API:
        apiParams = {
          ...apiParams,
          status: tabIndex === LIST_TAB_VALUES.DRAFTS ? FILTER_TYPE.UN_PUBLISHED : FILTER_TYPE.PUBLISHED,
        };
        if (has(apiParams, 'is_template')) {
          if (apiParams?.is_template === null) delete apiParams?.is_template;
        } else if (jsUtility.isNumber(template_filter_type)) {
          apiParams.is_template = template_filter_type;
        }
        const loadedData = await getIntegrationConnectorApi(
          apiParams,
          initialLoad,
          getCancelTokenExternalApi,
        );
        if (loadedData) {
          setTemplateApplied(has(apiParams, 'is_template'));
        }
        break;
      case LIST_TAB_VALUES.WORKHALL_API:
        getIntegrationConfigurationApi(
          {
            ...apiParams,
            status: tabIndex === LIST_TAB_VALUES.DRAFTS ? FILTER_TYPE.UN_PUBLISHED : FILTER_TYPE.PUBLISHED,
          },
          initialLoad,
          getCancelTokenWorkhallApi,
        );
        break;
      case LIST_TAB_VALUES.DB_CONNECTOR:
        getDBConnectorConfigurationApi(
          {
            ...apiParams,
            status: isDraft ? FILTER_TYPE.UN_PUBLISHED : FILTER_TYPE.PUBLISHED,
          },
          initialLoad,
          setCancelTokenExternalDBConnectorApi,
        );
        break;
      case LIST_TAB_VALUES.API_CREDENTIALS:
        getListOauthClientCredentialsApi(
          apiParams,
          initialLoad,
          getCancelTokenOauthApi,
        );
        break;
      default:
        break;
    }
  };

  const onLoadMoreCallHandler = () => {
    const { currentPage } = props;
    if (hasMore && !isLoadingList) {
      const params = { page: currentPage + 1, size: perPageCount, sort_field: sortType, sort_by: sortBy };
      loadListData(selectedTab, params);
    }
  };

  const updateIntegrationTab = () => {
    let tabIndex = null;
    switch (integrationTab) {
      case EXTERNAL_INTEGRATION:
        tabIndex = LIST_TAB_VALUES.EXTERNAL_API;
        break;
      case WORKHALL_INTEGRATION:
        tabIndex = LIST_TAB_VALUES.WORKHALL_API;
        break;
      case EXTERNAL_DB_CONNECTION:
        tabIndex = LIST_TAB_VALUES.DB_CONNECTOR;
        break;
      case API_CREDENTIAL:
        tabIndex = LIST_TAB_VALUES.API_CREDENTIALS;
        break;
      case DRAFT_INTEGRATION:
        tabIndex = LIST_TAB_VALUES.DRAFTS;
        break;
      default:
        break;
    }
    const currentTabSortData = getIntegrationSortOptions(tabIndex, tabIndex === DRAFT_INTEGRATION, isWorkhallApi)?.[0];
    loadListData(tabIndex, { search: null, sort_field: currentTabSortData?.sortType, sort_by: currentTabSortData?.sortBy });
    onIntegrationDataChange({
      tab_index: tabIndex,
      initial_template_filter: EMPTY_STRING,
      sortBy: currentTabSortData?.sortBy,
      sortLabel: currentTabSortData?.label,
      sortType: currentTabSortData?.sortType,
    });
  };

  useEffect(() => {
    setSearchFocus(false);
    setIsDraft(false);
    updateIntegrationTab();
    return () => {
      onIntegrationDataChange({
        listSearchText: EMPTY_STRING,
        show_by_value: INTEGRATION_CONSTANTS.API_TYPE.EXTERNAL,
        template_filter_type: EMPTY_STRING,
        initial_template_filter: EMPTY_STRING,
      });
    };
  }, [integrationTab, isListView]);

  const reloadCredentialsList = () => {
    loadListData(LIST_TAB_VALUES.API_CREDENTIALS);
  };

  const onSearchHandler = (event) => {
    const searchValue = event?.target?.value;
    onIntegrationDataChange({
      listSearchText: searchValue,
    });
    loadListData(selectedTab, { search: searchValue, sort_field: sortType, sort_by: sortBy });
  };

  const onClearTemplateFilter = () => {
    if (cancelTokenExternalApi) cancelTokenExternalApi();
    onIntegrationDataChange({
      template_filter_type: EMPTY_STRING,
      initial_template_filter: EMPTY_STRING,
    });
    loadListData(selectedTab, { is_template: null });
    setFilterOpen(false);
    setTemplateApplied(false);
  };

  const getListFilter = () => {
    const onFilterChange = (event, id, value) => {
      onIntegrationDataChange({
        template_filter_type: template_filter_type === value ? EMPTY_STRING : value,
      });
    };

    const onApplyFilter = () => {
      let filterParams = {};
      if ([
        INTEGRATION_FILTER_CONSTANTS.EXTERNAL.TEMPLATE.CUSTOM,
        INTEGRATION_FILTER_CONSTANTS.EXTERNAL.TEMPLATE.PRE_BUILD,
      ].includes(template_filter_type)) {
        filterParams = { is_template: template_filter_type };
      }
      onIntegrationDataChange({ initial_template_filter: template_filter_type });
      loadListData(selectedTab, filterParams);
      setFilterOpen(false);
    };

    const popperContent = (
      <div className={styles.FilterContainer}>
        <Title
          content={LIST_FILTER_LABELS(t).FILTER}
          headingLevel={ETitleHeadingLevel.h5}
          size={ETitleSize.xs}
          className={cx(gClasses.BlackV20, styles.FilterTitle)}
        />
        <RadioGroup
          labelText={LIST_FILTER_LABELS(t).TEMPLATE_TYPE}
          selectedValue={template_filter_type}
          options={EXTERNAL_API_FILTERS(t)}
          layout={RadioGroupLayout.stack}
          size={RadioSize.md}
          onChange={onFilterChange}
          radioContainerStyle={styles.FilterRadio}
          optionLabelClass={styles.RadioLabel}
          className={cx(gClasses.PX16, gClasses.PT12)}
        />
        <div className={styles.FilterActions}>
          <Button
              size={EButtonSizeType.SM}
              type={EButtonType.TERTIARY}
              buttonText={LIST_FILTER_LABELS(t).CLEAR_ALL}
              onClickHandler={onClearTemplateFilter}
              className={gClasses.P0}
          />
          <Button
            size={EButtonSizeType.SM}
            buttonText={LIST_FILTER_LABELS(t).APPLY}
            onClickHandler={onApplyFilter}
          />
        </div>
      </div>
    );
    return (
      <div className={gClasses.ML16} ref={filterRef}>
        <div className={gClasses.CenterV}>
          <button
            onClick={() => setFilterOpen((prevOpen) => !prevOpen)}
            className={gClasses.CenterV}
          >
            <LandingFilterIcon />
            {isTemplateApplied && (
            <div className={cx(styles.FilterCount)}>
              {String(EXTERNAL_FILTER_COUNT).padStart(2, '0')}
            </div>)}
          </button>
        </div>
        <Popper
          targetRef={filterRef}
          open={isFilterOpen}
          placement={EPopperPlacements.BOTTOM_END}
          content={popperContent}
          className={gClasses.ZIndex10}
        />
      </div>
    );
  };

  const getShowByFilter = () => {
    const onChange = (event) => {
      const { value } = event.target;
      const selectedSort = getIntegrationSortOptions(selectedTab, value === INTEGRATION_CONSTANTS.API_TYPE.WORKHALL)?.[0];
      onIntegrationDataChange({
        show_by_value: value,
        sortBy: selectedSort?.sortBy,
        sortLabel: selectedSort?.label,
        sortType: selectedSort?.sortType,
      });
      loadListData(selectedTab, { sort_field: selectedSort?.sortType, sort_by: selectedSort?.sortBy }, value);
    };

    return (
      <div className={cx(gClasses.ML12, gClasses.P4, gClasses.CenterV)}>
        <div className={styles.ShowByText}>
          {LIST_FILTER_LABELS(t).SHOW_BY}
        </div>
        <SingleDropdown
          optionList={SHOW_BY_OPTIONS}
          selectedValue={show_by_value}
          className={styles.ShowByDropdown}
          onClick={
            (value, _label, _list, id) => onChange(generateEventTargetObject(id, value))
          }
          getPopperContainerClassName={() => styles.ShowByPopper}
          dropdownViewProps={
            {
              colorVariant: ColorVariant.fill,
              variant: Variant.borderLess,
            }
          }
        />
      </div>
    );
  };

  const onClearSearch = () => {
    onIntegrationDataChange({
      listSearchText: EMPTY_STRING,
    });
    loadListData(selectedTab, { search: null });
  };

  const onCreateCredential = async () => {
    const totalCount = listCount;
    try {
      setPointerEvent(true);
      updatePostLoader(true);
      const response = await getOauthClientCredentialsApi(
        { status: 3 },
        getCancelTokenOauthApi,
      );
      setPointerEvent(false);
      updatePostLoader(false);
      const expiredCount = response?.pagination_details[0]?.total_count;
      const activeCount = totalCount - expiredCount;
      console.log('getexpiredCredsResponse', response, 'expiredCount', expiredCount, 'totalCount', totalCount, 'activeCount', activeCount);
      if (activeCount < 25) {
        onIntegrationDataChange({ isCreateCredentialModalOpen: true });
      } else {
        setMaxCredentialLimitOpen(true);
      }
    } catch (error) {
      console.log('getexpiredCredsError', error);
    }
  };

  const onDraftClick = () => {
    const notOfIsDraft = cloneDeep(!isDraft);
    setIsDraft(notOfIsDraft);
    loadListData(selectedTab, {}, show_by_value, notOfIsDraft);
  };

  let containerData = null;
  let loader = null;
  let subActionComponent = null;
  let searchComponent = null;
  let resultsText = null;
  let toggleDraftComponent = null;

  if (isCreateCredentialModalOpen) {
    createCredentialModal = (
      <CreateCredential
        isModalOpen={isCreateCredentialModalOpen}
        reloadCredentialsList={reloadCredentialsList}
      />
    );
  }
  if (isEditCredentialModalOpen) {
    editCredentialModal = (
      <EditCredential
        isModalOpen={isEditCredentialModalOpen}
        reloadCredentialsList={reloadCredentialsList}
      />
    );
  }

  switch (selectedTab) {
    case INTEGRATION_TABS.EXTERNAL_API:
      subActionComponent = getListFilter();
      break;
    case INTEGRATION_TABS.DRAFT_INTEGRATION:
      subActionComponent = getShowByFilter();
      break;
    case INTEGRATION_TABS.API_CREDENTIAL:
      subActionComponent = (
        !isEmpty(integrationsList) &&
          <Button
            type={EButtonType.SECONDARY}
            buttonText={t(CREATE_CREDENTIAL)}
            className={gClasses.ML16}
            onClickHandler={onCreateCredential}
            colorSchema={colorSchemeDefault}
          />
      );
      break;
    default:
      break;
  }

  let hideHeaderCondition = null;
  switch (selectedTab) {
    case INTEGRATION_TABS.EXTERNAL_API:
      hideHeaderCondition = isEmpty(listSearchText) && isEmpty(template_filter_type);
      break;
    case INTEGRATION_TABS.DRAFT_INTEGRATION:
      hideHeaderCondition = false;
      break;
    case INTEGRATION_TABS.WORKHALL_API:
    case INTEGRATION_TABS.API_CREDENTIAL:
      hideHeaderCondition = isEmpty(listSearchText);
      break;
    default:
      break;
  }

  // Search Icon
  const getSearchIcon = () => (
    <button
      aria-label={t(SEARCH_LABEL)}
      className={gClasses.CenterV}
      onClick={() => setSearchFocus(!searchFocus)}
    >
      <LandingPageSearchIcon />
    </button>
  );

  searchComponent = (
    <Input
      content={listSearchText || EMPTY_STRING}
      prefixIcon={getSearchIcon()}
      onChange={onSearchHandler}
      onFocusHandler={() => setSearchFocus(true)}
      onBlurHandler={() => setSearchFocus(false)}
      iconPosition={EInputIconPlacement.left}
      className={cx(styles.SearchOuterContainer, { [styles.ExpandedSearch]: searchFocus })}
      placeholder={t(SEARCH_LABEL)}
      size={Size.md}
      suffixIcon={
        listSearchText && (
          <LandingSearchExitIcon
            title={ICON_STRINGS.CLEAR}
            className={cx(styles.SearchCloseIcon, gClasses.CursorPointer, gClasses.Width8, gClasses.MR6)}
            tabIndex={0}
            height={12}
            width={12}
            ariaLabel={ICON_STRINGS.CLEAR}
            role={ARIA_ROLES.BUTTON}
            onKeyDown={(e) => keydownOrKeypessEnterHandle(e) && onClearSearch()}
            onClick={() => onClearSearch()}
          />
        )
      }
      borderRadiusType={BorderRadiusVariant.rounded}
    />
  );

  toggleDraftComponent = selectedTab === INTEGRATION_TABS.EXTERNAL_DB_CONNECTOR && (
    <ToggleButton
      label={DRAFT}
      isActive={isDraft}
      onChange={onDraftClick}
      className={gClasses.ML8}
    />
  );

  if (isLoadingList) {
    loader = (
      <div className={gClasses.PX30}>
        {
          Array(8)
          .fill()
          .map((eachCard, index) => (
            <TaskCard
              CardContainerStyle={styles.CardLoader}
              isDataLoading
              key={index}
            />
          ))
        }
      </div>
    );
  }
  const onCreateClick = () => {
    if (selectedTab === LIST_TAB_VALUES.API_CREDENTIALS) {
      onIntegrationDataChange({ isCreateCredentialModalOpen: true });
    } else {
      console.log('CREATEINTEGRATIONclick');
      const currentParams = queryString.parseUrl(history.location.pathname);
      let newParams = { ...get(currentParams, ['query'], {}) };
      newParams = { ...newParams, create: 'integration' };
      const integrationState = { createModalOpen: true };
      const search = new URLSearchParams(newParams).toString();
      routeNavigate(history, ROUTE_METHOD.PUSH, EMPTY_STRING, search, integrationState);
      onIntegrationDataChange({ isBasicDetailsModalOpen: true });
    }
  };

  if (isEmpty(integrationsList)) {
    if (!isLoadingList) {
      let noDataText = null;
      if (isErrorInLoading) {
        containerData = (
          <NoDataComponent
            noDataIcon={<ListLoadErrorIcon />}
            iconClass={styles.MT56}
            mainTitle={API_KEY_STRINGS(t).CANT_DISPLAY_LIST}
            subTitle={API_KEY_STRINGS(t).COULD_NOT_LOAD}
            className={BS.ALIGN_ITEMS_START}
          />
        );
      } else {
        noDataText = (selectedTab === LIST_TAB_VALUES.API_CREDENTIALS)
          ? t(NO_CREDENTIAL_FOUND)
          : t(NO_INTEGRATION_FOUND);
        const createNewText = (selectedTab === LIST_TAB_VALUES.API_CREDENTIALS)
          ? t(CREATE_CREDENTIAL)
          : t(CREATE_INTEGRATION_TEXT);
        const createTextSubtitle = (selectedTab === LIST_TAB_VALUES.API_CREDENTIALS)
          ? t(CREATE_FIRST_CREDENTIAL)
          : t(CREATE_FIRST_INTEGRATION);

        if (isEmpty(listSearchText)) {
          containerData = (
            <NoDataComponent
              noDataIcon={<NoDataFoundIcon className={gClasses.MT20} />}
              mainTitle={noDataText}
              subTitle={createTextSubtitle}
              createButtonText={createNewText}
              onCreateButtonClick={onCreateClick}
              className={BS.ALIGN_ITEMS_START}
            />
          );
        } else {
          containerData = (
            <NoDataComponent
              noDataIcon={<NoSearchFoundIcon />}
              iconClass={styles.MT56}
              mainTitle={t(EMPTY_LIST_STRINGS.NO_MATCHES_FOUND)}
              subTitle={t(EMPTY_LIST_STRINGS.TRY_ANOTHER_TERM)}
              className={BS.ALIGN_ITEMS_START}
            />
          );
        }
      }
    }
  } else {
    resultsText = `${SHOWING} ${listCount} ${pageTitle}`;
    const getEachRow = (connector) => {
      let activeTabComponent = selectedTab;
      if (selectedTab === LIST_TAB_VALUES.DRAFTS) {
        activeTabComponent = (show_by_value === API_TYPE.EXTERNAL) ? LIST_TAB_VALUES.EXTERNAL_API : LIST_TAB_VALUES.WORKHALL_API;
      }
      let connectorDetails = null;
      if (activeTabComponent !== LIST_TAB_VALUES.API_CREDENTIALS && activeTabComponent !== LIST_TAB_VALUES.DB_CONNECTOR) {
        connectorDetails = (
          <div className={cx(gClasses.CenterV, styles.ConnectorNameContainer)}>
            {
              connector?.connector_logo ? (
                <img className={styles.ConnectorLogo} src={connector?.connector_logo} alt="loading" />
              ) : (
                <div className={cx(styles.LogoIntegrationContainer, gClasses.CenterVH, isWorkhallApi && styles.BR50)}>
                  {isWorkhallApi ? <WorkhallIconLetter className={styles.WorkhallLogo} />
                  : <IntegrationNavIcon className={cx(styles.DefaultLogo, styles.IntegrationNavIcon)} />}
                </div>
              )
            }
            <div className={cx(BS.D_FLEX, BS.FLEX_COLUMN, BS.TEXT_LEFT, styles.ConnectorClass)} title={getNameValue(connector, selectedTab)}>
              <Text
                className={gClasses.Ellipsis}
                content={getNameValue(connector, selectedTab)}
                size={ETextSize.MD}
              />
            </div>
          </div>
        );
      }
      const {
        label,
        style,
      } = getBadgeValue(connector, selectedTab, show_by_value);
      const authTypeOrStatus = (
        <div className={styles.AuthInfo}>
          <span className={cx(styles.APITypeBadge, style, gClasses.Ellipsis)}>
            {label}
          </span>
        </div>
      );
      const lastUpdatedOn = (
        <span className={styles.CreatedOn}>
          {getUpdatedOnValue(connector, selectedTab)}
        </span>
      );
      let rowData = null;
      switch (activeTabComponent) {
        case LIST_TAB_VALUES.EXTERNAL_API:
          const eventCount = (
            <span className={styles.CreatedOn}>
              {connector?.no_of_events}
            </span>
          );
          rowData = {
            id: connector?._id,
            component: [
              connectorDetails,
              authTypeOrStatus,
              eventCount,
              lastUpdatedOn,
            ],
          };
          break;
        case LIST_TAB_VALUES.WORKHALL_API:
          const typeColumn = (
            <span className={styles.CreatedOn}>
              {getTypeValue(connector?.type)}
            </span>
          );
          const sourceColumn = (
            <span className={cx(styles.CreatedOn, styles.SourceCol)} title={connector?.flow_name || connector?.data_list_name}>
              {connector?.flow_name || connector?.data_list_name}
            </span>
          );
          rowData = {
            id: connector?._id,
            component: [
              connectorDetails,
              typeColumn,
              sourceColumn,
              authTypeOrStatus,
              lastUpdatedOn,
            ],
          };
          break;
        case LIST_TAB_VALUES.DB_CONNECTOR:
          const connectorName = (
            <div title={connector?.db_connector_name}>
              <Text
                className={cx(gClasses.Ellipsis, styles.OauthName)}
                content={connector?.db_connector_name}
                size={ETextSize.MD}
              />
            </div>
          );
          const lastUpdatedBy = (
            <span className={cx(styles.UpdatedBy, gClasses.Ellipsis)}>
              {getFullName(connector?.last_updated_by?.first_name, connector?.last_updated_by?.last_name)}
            </span>
          );
          rowData = {
            id: connector?._id,
            component: [
              connectorName,
              authTypeOrStatus,
              lastUpdatedOn,
              lastUpdatedBy,
            ],
          };
          break;
        case LIST_TAB_VALUES.API_CREDENTIALS:
          const nameColumn = (
            <div title={connector?.name}>
            <Text
              className={cx(gClasses.Ellipsis, styles.OauthName)}
              content={connector?.name}
              size={ETextSize.MD}
            />
            </div>
          );
          const updatedBy = (
            <span className={cx(styles.UpdatedBy, gClasses.Ellipsis)}>
              {getFullName(connector?.updated_by?.first_name, connector?.updated_by?.last_name)}
            </span>
          );
          rowData = {
            id: connector?._id,
            component: [
              nameColumn,
              authTypeOrStatus,
              lastUpdatedOn,
              updatedBy,
            ],
          };
          break;
        default:
          break;
      }
      return rowData;
    };
    const tableBody = integrationsList.map((eachItem) => getEachRow(eachItem));
    containerData = (
      <div className={cx(styles.OuterTable)} id={LIST_CONSTANTS.TABLE.ID}>
        <TableWithInfiniteScroll
          scrollableId={LIST_CONSTANTS.TABLE.ID}
          className={cx(styles.OverFlowInherit, gClasses.PX24)}
          tableClassName={cx(styles.Table, styles.GeneralTable, getTableStyle(selectedTab, show_by_value))}
          header={getIntegrationListHeader(selectedTab, show_by_value, t)}
          data={tableBody}
          onRowClick={cardClick}
          isLoading={isLoadingList}
          loaderRowCount={4}
          onLoadMore={onLoadMoreCallHandler}
          hasMore={hasMore}
          isRowClickable
          scrollType={TableScrollType.BODY_SCROLL}
          widthVariant={TableColumnWidthVariant.CUSTOM}
        />
      </div>
    );
  }

  useEffect(() => {
    const windowHeight = window.innerHeight;
    const count = Math.floor(
      (windowHeight - headerTotalHeight) / singleCardHeight,
    );
    setPerPageCount(count);
  }, []);

  const onSortHandler = (sortId) => {
    const sortObject = jsUtility.filter(getIntegrationSortOptions(selectedTab), ['label', sortId])[0];
    const additionParams = {
      sort_field: sortObject?.sortType,
      sort_by: sortObject?.sortBy,
    };
    onIntegrationDataChange({
      sortBy: sortObject?.sortBy,
      sortLabel: sortObject?.label,
      sortType: sortObject?.sortType,
    });
    loadListData(selectedTab, additionParams);
  };

  // Sort Integration
  const getSortPopper = () => (
    <Popper
      targetRef={sortPopOverTargetRef}
      open={isSortPopOverVisible}
      placement={EPopperPlacements.BOTTOM_START}
      className={gClasses.ZIndex10}
      content={
          <DropdownList
            optionList={getIntegrationSortOptions(selectedTab)}
            onClick={onSortHandler}
            selectedValue={sortLabel}
          />
        }
    />
  );

  return (
    <>
      {isEmpty(integrationsList) && hideHeaderCondition ? null :
      <div className={cx(gClasses.CenterV, gClasses.JusSpaceBtw, gClasses.MX24, gClasses.PT16, gClasses.PB16)}>
        <Text
          content={resultsText}
          className={cx(gClasses.FTwo12GrayV98, gClasses.FontWeight500)}
          isLoading={isLoadingList}
        />
        <div className={cx(gClasses.CenterV)}>
          {searchComponent}
          <div className={cx(gClasses.CenterV, gClasses.ML12, gClasses.MR12)}>
            <Text content={SORT_DROP_DOWN.PLACE_HOLDER} className={cx(gClasses.FTwo12GrayV98, gClasses.FontWeight500, gClasses.MR8)} />
            <button onClick={() => setIsSortPopOverVisible((prevState) => !prevState)} ref={sortPopOverTargetRef} className={cx(gClasses.FTwo12BlueV39, gClasses.FontWeight500, styles.SortContainer, gClasses.gap8, gClasses.CenterV)}>
              {sortLabel}
              <SortDropdownIcon />
              {getSortPopper()}
            </button>
          </div>
          {subActionComponent}
          {toggleDraftComponent}
        </div>
      </div>
      }
      {containerData}
      {createCredentialModal}
      {editCredentialModal}
      {isMaxCredentialLimitOpen && (
        <ConfirmationModal
          isModalOpen={isMaxCredentialLimitOpen}
          onConfirmClick={() => setMaxCredentialLimitOpen(false)}
          titleName={t(MAX_CRED_LIMIT_LABELS.TITLE)}
          mainDescription={t(MAX_CRED_LIMIT_LABELS.INFO)}
          confirmationName={API_KEY_STRINGS(t).OKAY}
          noClickOutsideAction
          notShowClose
          customIcon={<CircleAlertIcon />}
          customIconClass={gClasses.MB24}
          primaryButtonClass={styles.OkButton}
          innerClass={styles.MaxLimitModal}
        />
        )
      }
      {loader}
    </>
  );
}

const mapStateToProps = ({ IntegrationReducer }) => {
  return {
    isLoadingList: IntegrationReducer.isLoadingIntegrationsList,
    hasMore: IntegrationReducer.hasMoreIntegrations,
    listCount: IntegrationReducer.totalIntegrationsCount,
    currentPage: IntegrationReducer.currentPage,
    integrationsList: IntegrationReducer.integrationsList,
    isErrorInLoading: IntegrationReducer.isErrorInLoadingIntegrationsList,
    template_filter_type: IntegrationReducer.template_filter_type,
    show_by_value: IntegrationReducer.show_by_value,
    initial_template_filter: IntegrationReducer.initial_template_filter,
    selectedTab: IntegrationReducer.tab_index,
    listSearchText: IntegrationReducer.listSearchText,
    isCreateCredentialModalOpen: IntegrationReducer.isCreateCredentialModalOpen,
    isEditCredentialModalOpen: IntegrationReducer.isEditCredentialModalOpen,
    sortType: IntegrationReducer.sortType,
    sortBy: IntegrationReducer.sortBy,
    sortLabel: IntegrationReducer.sortLabel,
  };
};

const mapDispatchToProps = {
  getIntegrationConnectorApi: getIntegrationConnectorApiThunk,
  onIntegrationDataChange: integrationDataChange,
  getIntegrationConfigurationApi: getIntegrationConfigurationApiThunk,
  getListOauthClientCredentialsApi: getListOauthClientCredentialsApiThunk,
  getSingleOauthCredentialApi: getSingleOauthCredentialApiThunk,
  getDBConnectorConfigurationApi: getDBConnectorConfigurationApiThunk,
};

export default connect(mapStateToProps, mapDispatchToProps)(IntegrationList);
