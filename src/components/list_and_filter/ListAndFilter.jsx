import React, { useState } from 'react';
import cx from 'classnames/bind';
import PropTypes from 'prop-types';
import InfiniteScroll from 'react-infinite-scroll-component';
import { withRouter } from 'react-router-dom';

import { USERS } from 'utils/strings/CommonStrings';
import { useTranslation } from 'react-i18next';
import Dropdown from '../form_components/dropdown/Dropdown';
import SearchIcon from '../../assets/icons/SearchIcon';
import ResponseHandler from '../response_handlers/ResponseHandler';
import Button, { BUTTON_TYPE } from '../form_components/button/Button';
import Tab, { TAB_TYPE } from '../tab/Tab';
import Accordion from '../accordion/Accordion';
import TaskList from '../../containers/landing_page/my_tasks/task_list/TaskList';

import { getServerErrorMessageObject } from '../../utils/UtilityFunctions';
import jsUtils, { nullCheckObject } from '../../utils/jsUtility';

import gClasses from '../../scss/Typography.module.scss';
import styles from './ListAndFilter.module.scss';

import { BS } from '../../utils/UIConstants';
import {
  ICON_STRINGS,
  RESPONSE_HANLDER_STRINGS,
} from './ListAndFilter.strings';
import { EMPTY_STRING } from '../../utils/strings/CommonStrings';
import { ALL_USERS } from '../../urls/RouteConstants';
import {
  M_T_STRINGS,
  TASK_ACCORDION_INDEX,
} from '../../containers/landing_page/LandingPage.strings';
import RefreshIcon from '../../assets/icons/RefreshIcon';

import { getTaskListResponseHandler } from '../../utils/taskContentUtils';
import CloseIcon from '../../assets/icons/CloseIcon';
import { POPPER_PLACEMENTS } from '../auto_positioning_popper/AutoPositioningPopper';
import { getCardCount } from '../../utils/generatorUtils';

function ListAndFilter(props) {
  const {
    iterableComponent: IterableComponent,
    list,
    selectedId,
    onCardClick,
    dataLength,
    onLoadMoreCallHandler,
    hasMore,
    id,
    isDataLoading,
    server_error,
    className,
    title,
    actionButton,
    input,
    dropdown,
    tab,
    dataCountPerCall,
    containerRef,
    headerRef,
    listRef,
    listHeight,
    searchText,
    history,
    tabDropdown,
    documentUrlDetails,
    accordion,
    isLoadMoreData,
    isTaskCountDataLoading,
    refreshTaskListApi,
    type,
    actionButtonClassName,
  } = props;

  const [searchValue, setSearchValue] = useState(EMPTY_STRING);
  let elementList = null;
  const errorHandle = null;
  const tabIndex =
    tabDropdown && tabDropdown.selectedValue ? tabDropdown.selectedValue : null;
  let accordionList = '';
  const { t } = useTranslation();
  const currentTitle =
    title === t(M_T_STRINGS.TASK_LIST.TITLE)
      ? t(M_T_STRINGS.TASK_LIST.TITLE)
      : title === USERS.TITLE
      ? USERS.TITLE
      : null;
  const onSearchInputChange = (event) => {
    setSearchValue(event.target.value);
    input.onChange(event);
  };
  const onCloseIconClick = () => {
    const event = {
      target: {
        value: EMPTY_STRING,
      },
    };
    setSearchValue(EMPTY_STRING);
    input.onChange(event);
  };

  const accordionComponent = accordion
    ? (children) => (
        <div className={cx(styles.Accordion)}>
          <Accordion
            headerText={M_T_STRINGS.TASK_LIST.SEARCH_ACCORDION_STRINGS(t)[0]}
            onHeaderClick={() =>
              accordion.setSearchAccordionIndex(TASK_ACCORDION_INDEX.OPEN)
            }
            isChildrenVisible={
              accordion.searchAccordionIndex === TASK_ACCORDION_INDEX.OPEN &&
              accordion.searchTaskCount.active_task_count
            }
            headerClassName={cx(gClasses.PB10)}
            childrenClassName={cx(gClasses.ScrollBar)}
            childrenStyle={{
              maxHeight: `${listHeight - 131}px`,
              paddingBottom: '0px',
            }}
            hideBorder
            chevronLabel={M_T_STRINGS.TASK_LIST.MATCH_FOUND(
              accordion.searchTaskCount.active_task_count,
              isTaskCountDataLoading,
            )}
          >
            {children}
          </Accordion>

          <Accordion
            headerText={M_T_STRINGS.TASK_LIST.SEARCH_ACCORDION_STRINGS(t)[1]}
            onHeaderClick={() =>
              accordion.setSearchAccordionIndex(
                TASK_ACCORDION_INDEX.ASSIGNED_TO_OTHERS,
              )
            }
            isChildrenVisible={
              accordion.searchAccordionIndex ===
                TASK_ACCORDION_INDEX.ASSIGNED_TO_OTHERS &&
              accordion.searchTaskCount.assigned_to_others_task_count
            }
            headerClassName={cx(gClasses.PB10)}
            childrenClassName={cx(gClasses.ScrollBar)}
            childrenStyle={{
              maxHeight: `${listHeight - 98}px`,
              paddingBottom: '0px',
            }}
            hideBorder
            chevronLabel={M_T_STRINGS.TASK_LIST.MATCH_FOUND(
              accordion.searchTaskCount.assigned_to_others_task_count,
              isTaskCountDataLoading,
            )}
          >
            {children}
          </Accordion>
          <Accordion
            headerText={M_T_STRINGS.TASK_LIST.SEARCH_ACCORDION_STRINGS(t)[2]}
            onHeaderClick={() =>
              accordion.setSearchAccordionIndex(TASK_ACCORDION_INDEX.COMPLETED)
            }
            isChildrenVisible={
              accordion.searchAccordionIndex ===
                TASK_ACCORDION_INDEX.COMPLETED &&
              accordion.searchTaskCount.completed_task_count
            }
            headerClassName={cx(gClasses.PB10)}
            childrenClassName={cx(gClasses.ScrollBar)}
            childrenStyle={{
              maxHeight: `${listHeight - 131}px`,
              paddingBottom: '0px',
            }}
            hideBorder
            chevronLabel={M_T_STRINGS.TASK_LIST.MATCH_FOUND(
              accordion.searchTaskCount.completed_task_count,
              isTaskCountDataLoading,
            )}
          >
            {children}
          </Accordion>
        </div>
      )
    : null;
  if (isDataLoading) {
    let accordionResultsCount = dataCountPerCall;
    let infiniteScrollHeight = listHeight;
    const cardHeight = M_T_STRINGS.TASK_LIST.CARD_HEIGHT;
    if (
      accordion &&
      accordion.searchAccordionIndex === TASK_ACCORDION_INDEX.OPEN
    ) {
      infiniteScrollHeight = listHeight - 131;
      if (
        nullCheckObject(accordion, ['searchTaskCount']) &&
        getCardCount(infiniteScrollHeight, cardHeight) >
          getCardCount(
            accordion.searchTaskCount.active_task_count * cardHeight,
            cardHeight,
          )
      ) {
        accordionResultsCount = getCardCount(
          accordion.searchTaskCount.active_task_count * cardHeight,
          cardHeight,
        );
      } else accordionResultsCount = getCardCount(infiniteScrollHeight, cardHeight);
    } else if (
      accordion &&
      accordion.searchAccordionIndex === TASK_ACCORDION_INDEX.COMPLETED
    ) {
      infiniteScrollHeight = listHeight - 131;
      if (
        nullCheckObject(accordion, ['searchTaskCount']) &&
        getCardCount(infiniteScrollHeight, cardHeight) >
          getCardCount(
            accordion.searchTaskCount.completed_task_count * cardHeight,
            cardHeight,
          )
      ) {
        accordionResultsCount = getCardCount(
          accordion.searchTaskCount.completed_task_count * cardHeight,
          cardHeight,
        );
      } else accordionResultsCount = getCardCount(infiniteScrollHeight, cardHeight);
    } else if (
      accordion &&
      accordion.searchAccordionIndex === TASK_ACCORDION_INDEX.ASSIGNED_TO_OTHERS
    ) {
      infiniteScrollHeight = listHeight - 98;
      if (
        nullCheckObject(accordion, ['searchTaskCount']) &&
        getCardCount(infiniteScrollHeight, cardHeight) >
          getCardCount(
            accordion.searchTaskCount.assigned_to_others_task_count *
              cardHeight,
            cardHeight,
          )
      ) {
        accordionResultsCount = getCardCount(
          accordion.searchTaskCount.assigned_to_others_task_count * cardHeight,
          cardHeight,
        );
      } else accordionResultsCount = getCardCount(infiniteScrollHeight, cardHeight);
    }
    const loaderCount = searchText ? accordionResultsCount : dataCountPerCall;
    const loaderList = Array(loaderCount)
      .fill()
      .map(() => (
        <IterableComponent
          isDataLoading={isDataLoading}
          tabIndex={tabIndex}
          searchText={searchText}
          accordionIndex={accordion ? accordion.searchAccordionIndex : null}
          key={`list_and_filter_loader_${Math.random()}`}
        />
      ));
    if (title === t(M_T_STRINGS.TASK_LIST.TITLE) && searchText) {
      accordionList = accordionComponent(loaderList);
    } else {
      elementList = (
        <div className={cx(styles.InfiniteScroll, gClasses.MT10)}>
          {loaderList}
        </div>
      );
    }
  } else if (!jsUtils.isEmpty(list)) {
    elementList = list.map((item) => (
      <IterableComponent
        data={item}
        selectedId={selectedId}
        onClick={onCardClick}
        tabIndex={tabIndex}
        isDataLoading={isDataLoading}
        searchText={searchText}
        accordionIndex={accordion ? accordion.searchAccordionIndex : null}
        documentUrlDetails={documentUrlDetails}
        key={`${item._id}`}
      />
    ));
    if (title === t(M_T_STRINGS.TASK_LIST.TITLE) && searchText) {
      let infiniteScrollHeight = listHeight;
      if (
        accordion &&
        accordion.searchAccordionIndex === TASK_ACCORDION_INDEX.OPEN &&
        nullCheckObject(accordion, ['searchTaskCount'])
      ) {
        infiniteScrollHeight = listHeight - 131;
        if (
          infiniteScrollHeight >
          accordion.searchTaskCount.active_task_count *
            M_T_STRINGS.TASK_LIST.CARD_HEIGHT
        ) infiniteScrollHeight = accordion.searchTaskCount.active_task_count * M_T_STRINGS.TASK_LIST.CARD_HEIGHT + 14;
      } else if (
        accordion &&
        accordion.searchAccordionIndex === TASK_ACCORDION_INDEX.COMPLETED &&
        nullCheckObject(accordion, ['searchTaskCount'])
      ) {
        infiniteScrollHeight = listHeight - 98;
        if (
          infiniteScrollHeight >
          accordion.searchTaskCount.completed_task_count *
            M_T_STRINGS.TASK_LIST.CARD_HEIGHT
        ) infiniteScrollHeight = accordion.searchTaskCount.completed_task_count * M_T_STRINGS.TASK_LIST.CARD_HEIGHT + 14;
      } else if (
        accordion &&
        accordion.searchAccordionIndex ===
          TASK_ACCORDION_INDEX.ASSIGNED_TO_OTHERS &&
        nullCheckObject(accordion, ['searchTaskCount'])
      ) {
        infiniteScrollHeight = listHeight - 131;
        if (
          infiniteScrollHeight >
          accordion.searchTaskCount.assigned_to_others_task_count *
            M_T_STRINGS.TASK_LIST.CARD_HEIGHT
        ) infiniteScrollHeight = accordion.searchTaskCount.assigned_to_others_task_count * M_T_STRINGS.TASK_LIST.CARD_HEIGHT + 14;
      }
      elementList = (
        <InfiniteScroll
          dataLength={dataLength}
          next={onLoadMoreCallHandler}
          hasMore={hasMore}
          scrollThreshold={0.6}
          loader={(
            <TaskList
              tabIndex={tabIndex}
              dataCountPerCall={dataCountPerCall}
              isLoading={isLoadMoreData}
              searchText={searchText}
              accordionIndex={accordion ? accordion.searchAccordionIndex : null}
            />
          )}
          height={infiniteScrollHeight || BS.INHERIT}
          scrollableTarget={id}
          className={cx(gClasses.ScrollBar, styles.AccordionInfiniteScroll)}
        >
          <div className={gClasses.MT10}>{elementList}</div>
        </InfiniteScroll>
      );
      accordionList = accordionComponent(elementList);
    } else {
      elementList = (
        <InfiniteScroll
          dataLength={dataLength}
          next={onLoadMoreCallHandler}
          hasMore={hasMore}
          scrollThreshold={0.6}
          loader={(
            <TaskList
              tabIndex={tabIndex}
              dataCountPerCall={dataCountPerCall}
              isLoading={isLoadMoreData}
              searchText={searchText}
              accordionIndex={accordion ? accordion.searchAccordionIndex : null}
            />
          )}
          height={listHeight || BS.INHERIT}
          scrollableTarget={id}
          className={cx(gClasses.ScrollBar, styles.InfiniteScroll)}
        >
          <div className={gClasses.MT10}>{elementList}</div>
        </InfiniteScroll>
      );
    }
  } else if (searchText && title === t(M_T_STRINGS.TASK_LIST.TITLE)) {
    accordionList = accordionComponent(null);
  } else if (!isDataLoading) {
    let messageObject;
    if (title === t(M_T_STRINGS.TASK_LIST.TITLE)) {
      messageObject = getTaskListResponseHandler(server_error, list, tabIndex, t);
    } else messageObject = getServerErrorMessageObject(server_error, list, null, t);
    let responseHandlerActionButton;
    if (history.location.pathname === ALL_USERS && actionButton.isVisible) {
      messageObject.title = RESPONSE_HANLDER_STRINGS.PEOPLE.TITLE;
      messageObject.subTitle = RESPONSE_HANLDER_STRINGS.PEOPLE.SUB_TITLE;
      responseHandlerActionButton = (
        <Button
          onClick={actionButton.onClick}
          className={cx(gClasses.WidthFitContent, gClasses.MT20)}
          buttonType={BUTTON_TYPE.PRIMARY}
        >
          {RESPONSE_HANLDER_STRINGS.PEOPLE.BUTTON_TEXT}
        </Button>
      );
    }
    elementList = (
      <div className={cx(gClasses.CenterVH, BS.H100)}>
          <div>
            <ResponseHandler messageObject={messageObject} />
            <div className={gClasses.CenterH}>
              {responseHandlerActionButton}
            </div>
          </div>
      </div>
    );
  }

  const actionButtonComponent = actionButton.isVisible ? (
    <Button
      onClick={actionButton.onClick}
      className={cx(gClasses.WidthFitContent, gClasses.PX15Imp, actionButtonClassName)}
      buttonType={BUTTON_TYPE.PRIMARY}
    >
      {actionButton.text}
    </Button>
  ) : null;
  let inputComponent = null;
  let dropdownComponent = null;
  let tabDropdownComponent = null;
  if (jsUtils.has(tabDropdown, 'optionList')) {
    if (title === t(M_T_STRINGS.TASK_LIST.TITLE)) {
      tabDropdownComponent = (
        <div className={BS.D_FLEX}>
          {/* <Tab
            tabIList={myTaskTab.optionList}
            setTab={myTaskTab.onClick}
            selectedIndex={myTaskTab.activeTab}
            type={TAB_TYPE.TYPE_4}
            className={gClasses.MT10}
          /> */}
          <Dropdown
            dropdownListClasses={styles.DropdownList}
            id={tabDropdown.id}
            optionList={tabDropdown.optionList}
            onChange={tabDropdown.onChange}
            selectedValue={tabDropdown.selectedValue}
            tabBased
            isNewDropdown
            isBorderLess
            noInputPadding
            isTaskDropDown
          />
        </div>
      );
    } else if (type === 3) {
      tabDropdownComponent = (
        <div className={BS.D_FLEX}>
          <Tab
            tabIList={tabDropdown.optionList}
            setTab={tabDropdown.onChange}
            selectedIndex={tabDropdown.selectedValue}
            type={TAB_TYPE.TYPE_4}
            className={gClasses.MT10}
          />
        </div>
      );
    } else {
      tabDropdownComponent = (
        <Dropdown
          id={tabDropdown.id}
          optionList={tabDropdown.optionList}
          className={styles.TabDropdown}
          onChange={tabDropdown.onChange}
          selectedValue={tabDropdown.selectedValue}
          isNewDropdown
          isBorderLess
          noInputPadding
          isTaskDropDown
          tabBased
        />
      );
    }
  } else if (history.location.pathname.includes(ALL_USERS)) {
    tabDropdownComponent = <div />;
  }
  if (input.isVisible) {
    inputComponent = (
      <div className={cx(gClasses.CenterV)}>
        <SearchIcon title={ICON_STRINGS.SEARCH_ICON} />
        <input
          id={input.id}
          className={cx(
            styles.Input,
            gClasses.ML10,
            gClasses.FTwo11,
            gClasses.FontWeight500,
          )}
          placeholder={input.placeholder}
          onChange={onSearchInputChange}
          value={searchValue}
        />
        {!jsUtils.isEmpty(searchValue) ? (
          <CloseIcon
            title={ICON_STRINGS.CLEAR}
            className={cx(styles.CloseIcon, gClasses.CursorPointer)}
            isButtonColor
            onClick={onCloseIconClick}
          />
        ) : null}
      </div>
    );
  }

  if (dropdown.isVisible) {
    dropdownComponent = (
      <div className={cx(BS.D_FLEX, gClasses.MR5)}>
        {/* <FilterIcon type={2} /> */}
        <Dropdown
          id={dropdown.id}
          optionList={dropdown.optionList}
          onChange={dropdown.onChange}
          placeholder={dropdown.placeholder}
          selectedValue={dropdown.selectedValue}
          isNewDropdown
          isBorderLess
          rtl
          hideLabel
          isSortTeamUser={title === USERS.TITLE}
          isSortDropdown={title === t(M_T_STRINGS.TASK_LIST.TITLE)}
          placement={POPPER_PLACEMENTS.BOTTOM_END}
          popperClasses={gClasses.ZIndex2}
        />
        {title === t(M_T_STRINGS.TASK_LIST.TITLE) ||
        title === USERS.TITLE ||
        title === USERS.TITLE ? (
          <RefreshIcon
            title={currentTitle}
            className={cx(gClasses.CursorPointer)}
            type={2}
            onClick={() => {
              refreshTaskListApi(
                title === t(M_T_STRINGS.TASK_LIST.TITLE)
                  ? M_T_STRINGS.TASK_LIST.REFRESH_TASK_LIST
                  : title === USERS.TITLE
                  ? USERS.RELOADDATA
                  : null,
              );
            }}
            isButtonColor
          />
        ) : null}
      </div>
    );
  }
  const tabSearchFilterAndDropdownView = (
    <>
      <div className={cx(styles.MyTasksSearchInput, gClasses.MT10)}>
        {inputComponent}
      </div>
      {!searchText && (
        <div className={cx(BS.D_FLEX, BS.JC_BETWEEN, gClasses.MT15)}>
          {tabDropdownComponent}
          {dropdownComponent}
        </div>
      )}
      {/* <div className={cx(gClasses.Hr, BS.P_ABSOLUTE, BS.W100, styles.Hr, gClasses.MT8)} /> */}
    </>
  );
  const elementListOrAccordion =
    title === t(M_T_STRINGS.TASK_LIST.TITLE) && searchText ? (
      accordionList
    ) : (
      <div
        className={cx(styles.ListContainer, gClasses.ScrollBar, gClasses.PL30)}
        ref={listRef}
      >
        {elementList}
        {errorHandle}
      </div>
    );
  return (
    <div
      className={cx(
        styles.Container,
        className,
        gClasses.HeightInherit,
        BS.H100,
        BS.D_FLEX,
        BS.FLEX_COLUMN,
      )}
      ref={containerRef}
    >
      <div
        className={cx(gClasses.Header, BS.P_RELATIVE, gClasses.PB10)}
        ref={headerRef}
      >
        <div className={cx(BS.D_FLEX, BS.JC_BETWEEN)}>
          <div className={cx(BS.D_FLEX, BS.JC_BETWEEN)}>
            <h1 className={cx(gClasses.PageTitle, gClasses.FlexGrow1)}>
              {title}
            </h1>
            {/* {title === M_T_STRINGS.TASK_LIST.TITLE?<Button onClick={onCreateTaskClicked} className={cx(styles.CreateTaskButton)}>{CREATE_TASK_BUTTON}</Button>:null} */}
          </div>
          {actionButtonComponent}
        </div>
        {history.location.pathname.includes(ALL_USERS) ||
        title === t(M_T_STRINGS.TASK_LIST.TITLE) ||
        type === 3 ? (
          tabSearchFilterAndDropdownView
        ) : (
          <>
            <div
              className={cx(
                styles.SearchFilterContainer,
                BS.D_FLEX,
                gClasses.MT10,
                !(tab.optionList && Array.isArray(tab.optionList))
                  ? gClasses.MB15
                  : null,
              )}
            >
              {inputComponent}
              {dropdownComponent}
            </div>
            {tabDropdownComponent}
          </>
        )}
      </div>
      {/* <div className={cx(styles.ListContainer, gClasses.ScrollBar, gClasses.PL30)} ref={listRef}>
        {elementList}
        {errorHandle}
      </div> */}
      {elementListOrAccordion}
    </div>
  );
}

export default withRouter(ListAndFilter);

ListAndFilter.defaultProps = {
  list: [],
  selectedId: null,
  dataLength: 0,
  isDataLoading: false,
  server_error: {},
  className: EMPTY_STRING,
  title: EMPTY_STRING,
  searchText: EMPTY_STRING,
  actionButton: {},
  input: {},
  tab: {},
  dropdown: {},
  documentUrlDetails: [],
  headerRef: null,
  containerRef: null,
  listRef: null,
  id: EMPTY_STRING,
  iterableComponent: EMPTY_STRING,
  listHeight: EMPTY_STRING,
  accordion: {},
  tabDropdown: {},
  isLoadMoreData: null,
  isTaskCountDataLoading: null,
  myTaskTab: null,
  actionButtonClassName: EMPTY_STRING,
};

ListAndFilter.propTypes = {
  iterableComponent: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.node,
    PropTypes.func,
  ]),
  list: PropTypes.arrayOf(PropTypes.any),
  selectedId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  onCardClick: PropTypes.func.isRequired,
  dataLength: PropTypes.number,
  onLoadMoreCallHandler: PropTypes.func.isRequired,
  hasMore: PropTypes.bool.isRequired,
  id: PropTypes.string,
  isDataLoading: PropTypes.bool,
  server_error: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.array,
    PropTypes.object,
  ]),
  className: PropTypes.string,
  title: PropTypes.string,
  actionButton: PropTypes.shape({
    text: PropTypes.string,
    onClick: PropTypes.func,
    isVisible: PropTypes.bool,
  }),
  input: PropTypes.shape({
    onChange: PropTypes.func,
    placeholder: PropTypes.string,
    isVisible: PropTypes.bool,
    id: PropTypes.string,
  }),
  tab: PropTypes.shape({
    onClick: PropTypes.func,
    optionList: PropTypes.arrayOf(PropTypes.any),
    activeTab: PropTypes.number,
  }),
  dropdown: PropTypes.shape({
    onChange: PropTypes.func,
    isVisible: PropTypes.bool,
    id: PropTypes.string,
    placeholder: PropTypes.string,
    optionList: PropTypes.arrayOf(PropTypes.any),
    index: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    selectedValue: PropTypes.number,
  }),
  dataCountPerCall: PropTypes.number.isRequired,
  headerRef: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  containerRef: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  listRef: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  documentUrlDetails: PropTypes.arrayOf(PropTypes.any),
  listHeight: PropTypes.number,
  history: PropTypes.objectOf(PropTypes.any).isRequired,
  accordion: PropTypes.shape({
    searchAccordionIndex: PropTypes.number,
    searchTaskCount: PropTypes.objectOf(
      PropTypes.shape({
        active_task_count: PropTypes.number,
        completed_task_count: PropTypes.number,
        assigned_to_others_task_count: PropTypes.number,
      }),
    ),
    setSearchAccordionIndex: PropTypes.func,
  }),
  tabDropdown: PropTypes.objectOf(
    PropTypes.shape({
      optionList: PropTypes.arrayOf(PropTypes.any),
      selectedValue: PropTypes.number,
      id: PropTypes.string,
      onChange: PropTypes.func,
    }),
  ),
  myTaskTab: PropTypes.objectOf(PropTypes.any),
  searchText: PropTypes.string,
  isLoadMoreData: PropTypes.bool,
  isTaskCountDataLoading: PropTypes.bool,
  refreshTaskListApi: PropTypes.func.isRequired,
  actionButtonClassName: PropTypes.string,
};
