import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  Button,
  CheckboxGroup,
  DropdownList,
  ECheckboxSize,
  EPopperPlacements,
  NestedDropdown,
  RadioGroupLayout,
  TabBuilder,
  Text,
  EButtonType,
  EButtonSizeType,
  Tab,
  ETabVariation,
  ETextSize,
  Tooltip,
  ETooltipType,
  ETooltipPlacements,
} from '@workhall-pvt-lmt/wh-ui-library';
import cx from 'classnames';
import gClasses from 'scss/Typography.module.scss';
import { useTranslation } from 'react-i18next';
import DownArrowIconV2 from '../../../../assets/icons/DownArrowIconV2';
import styles from '../IndividualEntry.module.scss';
import PageSettings from '../page_settings/PageSettings';
import { getReorderPageData } from '../IndividualEntry.utils';
import { EMPTY_STRING } from '../../../../utils/strings/CommonStrings';
import PageSettingsIcon from '../../../../assets/icons/PageSettingsIcon';
import RightMultiNavigateIcon from '../../../../assets/icons/RightMultiNavigateIcon';
import LeftDirArrowIcon from '../../../../assets/icons/app_builder_icons/LeftDirArrow';
import AppHeaderDropdownIcon from '../../../../assets/icons/app_builder_icons/AppHeaderDropdownArrow';
import jsUtility from '../../../../utils/jsUtility';
import {
  saveDashboardPageApiThunk,
  reorderPagesApiThunk,
  editPagesApiThunk,
  deletePagesApiThunk,
  updateSystemDashboardPagesApiThunk,
  getDashboardPageByIdThunk,
} from '../../../../redux/actions/IndividualEntry.Action';
import { dataChange } from '../../../../redux/reducer/IndividualEntryReducer';
import { HEADER_STRINGS } from '../../../application/header/header.utils';
import { validateFormDetails } from '../summary_builder/SummaryBuilder.utils';
import { getFormattedSystemPages } from './IndividualEntryTab.utils';
import {
  INDIVIDUAL_ENTRY_MODE,
  INDIVIDUAL_ENTRY_TAB_TYPES,
  INDIVIDUAL_ENTRY_TYPE,
  MAX_CUSTOM_PAGE_LIMIT,
} from '../IndividualEntry.strings';
import INDIVIDUAL_ENTRY_TABS_STRINGS from './IndividualEntryTab.constants';

function IndividualEntryTab(props) {
  const {
    mode,
    type,
    onUpdateError,
    isLoading,
    pagesList,
    currentTab,
    pageMetadata,
    pageSettings,
    dashboardId,
    systemPages,
    dataChange,
    saveDashboardPageApiThunk,
    reorderPagesApiThunk,
    editPagesApiThunk,
    deletePagesApiThunk,
    updateSystemDashboardPagesApiThunk,
    getDashboardPageByIdThunk,
  } = props;
  const { t } = useTranslation();

  const pageInitialState = {
    pageName: EMPTY_STRING,
    order: EMPTY_STRING,
    allowCustomViewers: false,
    errorList: {},
    isEdit: false,
    currentPageId: EMPTY_STRING,
    pageViewers: { users: [], teams: [] },
    pageType: EMPTY_STRING,
  };

  const [showPageSettings, setShowPageSettings] = useState(false);
  const [localSystemPages, setLocalSystemPages] = useState(systemPages);
  const isReadOnlyMode = mode === INDIVIDUAL_ENTRY_MODE.READ_ONLY_MODE;

  const onCreatePageClick = () => {
    dataChange({ pageSettings: { ...pageSettings, pageType: 'custom' } });
    setShowPageSettings(true);
  };

  const onPageCloseOrCancelClick = () => {
    setShowPageSettings(false);
    if (currentTab?.value) {
      getDashboardPageByIdThunk(currentTab?.value);
    }
    dataChange({ pageSettings: pageInitialState });
  };

  const onPageSettingClick = (options) => {
    const clonePageViewers = jsUtility.cloneDeep(
      pageMetadata?.security?.viewers,
    );
    if (!jsUtility.isEmpty(clonePageViewers)) {
      if (jsUtility.isEmpty(clonePageViewers?.teams)) {
        clonePageViewers.teams = [];
      }
      if (jsUtility.isEmpty(clonePageViewers?.users)) {
        clonePageViewers.users = [];
      }
    }
    const pageData = {
      pageName: options?.labelText,
      currentPageId: options?.value,
      allowCustomViewers: !pageMetadata?.security?.is_inherit_from_parent,
      pageViewers: clonePageViewers,
      order: options?.order,
      isEdit: true,
      pageType: options?.type,
    };
    dataChange({ pageSettings: { ...pageSettings, ...pageData } });
    setShowPageSettings(true);
  };

  const onUpdateSystemPage = (close) => {
    const params = {
      dashboard_id: dashboardId,
      types: localSystemPages,
    };
    close();
    updateSystemDashboardPagesApiThunk(params);
  };

  const onTabSelectHandler = (
    tabData,
    isInitialLoad = false,
    isErrorCheck = false,
  ) => {
    if (!isInitialLoad && tabData?.value === currentTab?.value) return;
    const clonePageMetadata = jsUtility.cloneDeep(pageMetadata);
    if (
      !isErrorCheck &&
      currentTab.type === INDIVIDUAL_ENTRY_TAB_TYPES.PAGE_BUILDER
    ) {
      clonePageMetadata.errorList = validateFormDetails?.(
        jsUtility.cloneDeep(clonePageMetadata?.formMetadata?.sections || []),
        t,
      );
    }
    if (!jsUtility.isEmpty(clonePageMetadata.errorList)) {
      onUpdateError({});
      dataChange({
        pageMetadata: clonePageMetadata,
      });
      return;
    }

    let currentTabData = jsUtility.cloneDeep(tabData);
    if (isReadOnlyMode && typeof currentTabData === 'string') {
      currentTabData = pagesList.filter((tab) => tab?.value === tabData)?.[0];
    }
    const updateData = {
      currentPageDetails: currentTabData,
      errorList: {},
    };
    if (
      mode === INDIVIDUAL_ENTRY_MODE.DEVELOP_MODE ||
      (isReadOnlyMode &&
        currentTabData.type === INDIVIDUAL_ENTRY_TAB_TYPES.PAGE_BUILDER)
    ) {
      if (currentTabData?.value) {
        getDashboardPageByIdThunk(currentTabData.value, isReadOnlyMode);
      }
    } else updateData.pageMetadata = {};
    dataChange(updateData);
    onUpdateError({});
  };

  const onTabOptionReorderDelete = (options, deleteId) => {
    if (deleteId) {
      deletePagesApiThunk({ page_id: deleteId }, dashboardId, () => {
        onPageCloseOrCancelClick();
      });
    } else {
      reorderPagesApiThunk(getReorderPageData(options, dashboardId), () =>
        onPageCloseOrCancelClick(),
      );
    }
  };

  const getInitialView = (onNextView, close) => {
    const customPageCount = jsUtility
      .cloneDeep(pagesList)
      .filter(
        (page) => page.type === INDIVIDUAL_ENTRY_TAB_TYPES.PAGE_BUILDER,
      ).length;
    const isMaxCustomPage = customPageCount >= MAX_CUSTOM_PAGE_LIMIT;

    return (
      <div>
        <DropdownList
          optionList={[
            {
              label: INDIVIDUAL_ENTRY_TABS_STRINGS(t).CREATE_CUSTOM_PAGE,
              value: 1,
              disabled: isMaxCustomPage,
            },
            {
              label: INDIVIDUAL_ENTRY_TABS_STRINGS(t).ENABLE_SYSTEM_PAGE,
              value: 2,
              isStep: true,
            },
          ]}
          selectedValue={1}
          customDropdownListView={(option) => {
            const button = (
              <button
                className={cx(
                  styles.ViewContainer,
                  gClasses.CenterV,
                  gClasses.JusSpaceBtw,
                  gClasses.W100,
                  gClasses.PX12,
                  gClasses.PY10,
                  { [styles.DisabledPageOptions]: option.disabled },
                )}
                onClick={() => {
                  if (option?.isStep) {
                    onNextView();
                  } else if (!option?.disabled) {
                    close();
                    onCreatePageClick();
                  }
                }}
              >
                <div className={cx(gClasses.FTwo13, styles.FlowOrDlLabel)}>
                  {option.label}
                </div>
                {option.isStep && <RightMultiNavigateIcon />}
              </button>
            );
            if (option.disabled) {
              return (
                <Tooltip
                  text={INDIVIDUAL_ENTRY_TABS_STRINGS(t).MAX_CUSTOM_ERROR}
                  tooltipPlacement={ETooltipPlacements.LEFT}
                  tooltipType={ETooltipType.INFO}
                  icon={button}
                />
              );
            }
            return button;
          }}
        />
      </div>
    );
  };

  const onSystemPagesSelect = (selectedPage) => {
    let systemPagesData = jsUtility.cloneDeep(localSystemPages);
    if (localSystemPages.includes(selectedPage)) {
      systemPagesData = systemPagesData.filter((page) => page !== selectedPage);
    } else systemPagesData.push(selectedPage);
    setLocalSystemPages(systemPagesData);
  };

  const showPageActionButtons =
    JSON.stringify([...localSystemPages].sort()) ===
    JSON.stringify([...systemPages].sort());

  const getSystemPagesView = (onPreviousView, close) => (
    <div className={styles.SecondNestedView}>
      <button
        className={cx(styles.DirectionButton, gClasses.CenterV, gClasses.W100)}
        onClick={onPreviousView}
      >
        <LeftDirArrowIcon className={gClasses.MR5} fill="#959BA3" />
        <Text content={INDIVIDUAL_ENTRY_TABS_STRINGS(t).SYSTEM_PAGE} />
      </button>
      <div className={gClasses.P12}>
        <CheckboxGroup
          size={ECheckboxSize.SM}
          hideLabel
          layout={RadioGroupLayout.stack}
          checkboxGroupClassName={gClasses.GAP20}
          options={getFormattedSystemPages(
            localSystemPages,
            pagesList,
            type === INDIVIDUAL_ENTRY_TYPE.FLOW,
            t,
          )}
          onClick={onSystemPagesSelect}
          className={styles.CheckBoxStyle}
        />
      </div>
      {!showPageActionButtons && (
        <div
          className={cx(
            gClasses.PX12,
            gClasses.PY8,
            gClasses.DisplayFlex,
            gClasses.JusEnd,
            styles.AddPageFooter,
          )}
        >
          <Button
            buttonText={INDIVIDUAL_ENTRY_TABS_STRINGS(t).BUTTONS.CANCEL}
            onClickHandler={() => setLocalSystemPages(systemPages)}
            type={EButtonType.OUTLINE_SECONDARY}
            className={cx(styles.MdCancelBtn)}
          />
          <Button
            buttonText={INDIVIDUAL_ENTRY_TABS_STRINGS(t).BUTTONS.APPLY}
            size={EButtonSizeType.SM}
            onClickHandler={() => onUpdateSystemPage(close)}
            type={EButtonType.PRIMARY}
          />
        </div>
      )}
    </div>
  );

  const nestedDropdownElement = () => {
    if (mode !== INDIVIDUAL_ENTRY_MODE.DEVELOP_MODE) return null;
    return (
      <NestedDropdown
        displayText={INDIVIDUAL_ENTRY_TABS_STRINGS(t).PAGE_OPTIONS}
        totalViews={2}
        popperClass={styles.PopperWidth}
        className={styles.AddPageWidth}
        popperPlacement={EPopperPlacements.BOTTOM_END}
        dropdownViewProps={{
          className: styles.PageOptions,
          hideDropdownIcon: true,
          customDropdownView: (
            <div>
              <button
                className={cx(
                  gClasses.FTwo13BlueV39,
                  gClasses.FontWeight500,
                  gClasses.WhiteSpaceNoWrap,
                )}
              >
                {INDIVIDUAL_ENTRY_TABS_STRINGS(t).PAGE_OPTIONS}
                <DownArrowIconV2 className={gClasses.ML6} />
              </button>
            </div>
          ),
        }}
      >
        {({ close, view, nextView: onNextView, prevView: onPreviousView }) => {
          switch (view) {
            case 1:
              return getInitialView(onNextView, close);
            case 2:
              return getSystemPagesView(onPreviousView, close);
            default:
              return null;
          }
        }}
      </NestedDropdown>
    );
  };

  return (
    <div>
      <PageSettings
        showPageSettings={showPageSettings}
        individualDashboardChange={dataChange}
        pageSettings={pageSettings}
        onPageCloseOrCancelClick={onPageCloseOrCancelClick}
        newPageOrder={pagesList.length + 1}
        dashboardId={dashboardId}
        saveDashboardPageApiThunk={saveDashboardPageApiThunk}
        editPagesApiThunk={editPagesApiThunk}
        isReadOnlyMode={isReadOnlyMode}
      />
      {isReadOnlyMode ? (
        <Tab
          variation={ETabVariation.folder}
          options={pagesList}
          bottomSelectionClass={styles.ActiveBar}
          selectedTabIndex={currentTab?.value}
          onClick={(value) => onTabSelectHandler(value, false, true)}
          onPopperOptionSelect={(value) =>
            onTabSelectHandler(value, false, true)
          }
          tabDisplayCount={6}
          morePopperProps={{ style: { zIndex: 16 } }}
          moreComponent={
            <div className={cx(gClasses.CenterV)}>
              <Text
                content={t(HEADER_STRINGS.MORE)}
                className={cx(styles.TabText, styles.MoreButton)}
                fontClass={gClasses.FontWeight500}
                size={ETextSize.MD}
              />
              <AppHeaderDropdownIcon className={styles.MoreArrow} />
            </div>
          }
        />
      ) : (
        <TabBuilder
          className={styles.TabBuilder}
          seletedTab={currentTab?.value}
          tabSettings={
            !isLoading
              ? {
                  label: INDIVIDUAL_ENTRY_TABS_STRINGS(t).PAGE_SETTINGS.TITLE,
                  icon: <PageSettingsIcon />,
                  value: pageSettings?.currentPageId,
                }
              : {}
          }
          onCustomTabOptionClick={(options) => onPageSettingClick(options)}
          onTabOptionsChange={(options, deleteId) => {
            onTabOptionReorderDelete(options, deleteId);
          }}
          tabOptions={pagesList}
          onTabClick={onTabSelectHandler}
          customAddPageComponent={nestedDropdownElement()}
          tabContainerClassName={styles.TabWidth}
          maxTabLimit={15}
        />
      )}
    </div>
  );
}

IndividualEntryTab.propTypes = {
  mode: PropTypes.string,
  type: PropTypes.string,
  onUpdateError: PropTypes.func,
  isLoading: PropTypes.bool,
  pagesList: PropTypes.array,
  currentTab: PropTypes.object,
  pageMetadata: PropTypes.object,
  pageSettings: PropTypes.object,
  dashboardId: PropTypes.string,
  systemPages: PropTypes.array,
  dataChange: PropTypes.func,
  saveDashboardPageApiThunk: PropTypes.func,
  reorderPagesApiThunk: PropTypes.func,
  editPagesApiThunk: PropTypes.func,
  deletePagesApiThunk: PropTypes.func,
  updateSystemDashboardPagesApiThunk: PropTypes.func,
  getDashboardPageByIdThunk: PropTypes.func,
};

const mapStateToProps = (state) => {
  const { pageSettings, dashboardId, systemPages } =
    state.IndividualEntryReducer;
  return {
    pageSettings,
    dashboardId,
    systemPages,
  };
};

const mapDispatchToProps = {
  dataChange,
  saveDashboardPageApiThunk,
  reorderPagesApiThunk,
  editPagesApiThunk,
  deletePagesApiThunk,
  updateSystemDashboardPagesApiThunk,
  getDashboardPageByIdThunk,
};

export default connect(mapStateToProps, mapDispatchToProps)(IndividualEntryTab);
