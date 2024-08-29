import React from 'react';
import propTypes from 'prop-types';
import cx from 'classnames/bind';
import Paginator from 'paginator';
import Skeleton from 'react-loading-skeleton';
import jsUtils from 'utils/jsUtility';
import { POPPER_PLACEMENTS } from 'components/auto_positioning_popper/AutoPositioningPopper';
import { ROWS_PER_PAGE } from 'components/form_components/pagination/Pagination.strings';
import ThemeContext from '../../../../hoc/ThemeContext';
import Page from './Page';
import NextIcon from '../../../../assets/icons/pagination/NextIcon';
import MoveToEndIcon from '../../../../assets/icons/pagination/MoveToEndIcon';
import styles from './Pagination.module.scss';
import {
  ARIA_ROLES,
  BS,
  SKELETON_LOADER_DIMENSION_CONSTANTS,
} from '../../../../utils/UIConstants';
import {
  PAGINATION_STRINGS,
  ICON_STRINGS,
  PAGE_KEYS,
} from './Pagination.strings';
import gClasses from '../../../../scss/Typography.module.scss';
import { HASH, EMPTY_STRING } from '../../../../utils/strings/CommonStrings';
import ChevronIcon from '../../../../assets/icons/ChevronIcon';
import Dropdown from '../../dropdown/Dropdown';

function PaginationWithRowsPerPage(props) {
  const {
    innerClass,
    itemsCountPerPage,
    activePage,
    totalItemsCount,
    className,
    isDataLoading,
    responseTableView,
    type,
    paginationItem,
    onChange,
    tblIsDataLoading,
    ddlRowOptionList,
    ddlRowOnChangeHandler,
    ddlRowSelectedValue,
  } = props;

  const isFirstPageVisible = (has_previous_page) => {
    const { hideDisabled, hideFirstLastPages } = props;
    if (hideFirstLastPages || (hideDisabled && !has_previous_page)) {
      return false;
    }
    return true;
  };

  const isPrevPageVisible = (has_previous_page) => {
    const { hideDisabled, hideNavigation } = props;
    if (hideNavigation || (hideDisabled && !has_previous_page)) return false;
    return true;
  };

  const isNextPageVisible = (has_next_page) => {
    const { hideDisabled, hideNavigation } = props;
    if (hideNavigation || (hideDisabled && !has_next_page)) return false;
    return true;
  };

  const isLastPageVisible = (has_next_page) => {
    const { hideDisabled, hideFirstLastPages } = props;
    if (hideFirstLastPages || (hideDisabled && !has_next_page)) return false;
    return true;
  };

  const buildPages = () => {
    const pages = [];
    const {
      itemsCountPerPage,
      activePage,
      totalItemsCount,
      onChange,
      activeClass,
      itemClass,
      itemClassFirst,
      itemClassPrev,
      itemClassNext,
      itemClassLast,
      activeLinkClass,
      disabledClass,
      linkClass,
      linkClassFirst,
      linkClassPrev,
      linkClassNext,
      linkClassLast,
      getPageUrl,
    } = props;
    const prevPageText = (
      <NextIcon
        title={ICON_STRINGS.PREVIOUS}
        className={styles.Icon}
        style={{ fill: '#6c727e' }}
        role={ARIA_ROLES.IMG}
        ariaLabel={ICON_STRINGS.PREVIOUS}
      />
    );
    const firstPageText = (
      <MoveToEndIcon
        title={ICON_STRINGS.MOVE_BEGIN}
        className={styles.Icon}
        style={{ fill: '#6c727e' }}
        role={ARIA_ROLES.IMG}
        ariaLabel={ICON_STRINGS.MOVE_BEGIN}
      />
    );
    const nextPageText = (
      <NextIcon
        title={ICON_STRINGS.NEXT}
        className={cx(styles.Icon, gClasses.Rotate180)}
        style={{ fill: '#6c727e' }}
        role={ARIA_ROLES.IMG}
        ariaLabel={ICON_STRINGS.NEXT}
      />
    );
    const lastPageText = (
      <MoveToEndIcon
        title={ICON_STRINGS.MOVE_END}
        className={cx(styles.Icon, gClasses.Rotate180)}
        style={{ fill: '#6c727e' }}
        role={ARIA_ROLES.IMG}
        ariaLabel={ICON_STRINGS.MOVE_END}
      />
    );

    const paginationInfo = new Paginator(
      itemsCountPerPage,
      5,
    ).build(totalItemsCount, activePage);

    for (
      let i = paginationInfo.first_page;
      i <= paginationInfo.last_page;
      i += 1
    ) {
      pages.push(
        <Page
          isActive={i === activePage}
          key={i}
          href={getPageUrl(i)}
          pageNumber={i}
          pageText={`${i}`}
          onClick={onChange}
          itemClass={itemClass}
          linkClass={linkClass}
          activeClass={activeClass}
          activeLinkClass={activeLinkClass}
        />,
      );
    }

    if (isPrevPageVisible(paginationInfo.has_previous_page)) {
      pages.unshift(
        <Page
          key={`prev${paginationInfo.previous_page}`}
          href={getPageUrl(paginationInfo.previous_page)}
          pageNumber={paginationInfo.previous_page}
          onClick={onChange}
          pageText={prevPageText}
          isDisabled={!paginationInfo.has_previous_page}
          itemClass={cx(itemClass, itemClassPrev)}
          linkClass={cx(linkClass, linkClassPrev)}
          disabledClass={disabledClass}
        />,
      );
    }

    if (isFirstPageVisible(paginationInfo.has_previous_page)) {
      pages.unshift(
        <Page
          key={PAGE_KEYS.FIRST}
          href={getPageUrl(1)}
          pageNumber={1}
          onClick={onChange}
          pageText={firstPageText}
          isDisabled={!paginationInfo.has_previous_page}
          itemClass={cx(itemClass, itemClassFirst)}
          linkClass={cx(linkClass, linkClassFirst)}
          disabledClass={disabledClass}
        />,
      );
    }

    if (isNextPageVisible(paginationInfo.has_next_page)) {
      pages.push(
        <Page
          key={`next${paginationInfo.next_page}`}
          href={getPageUrl(paginationInfo.next_page)}
          pageNumber={paginationInfo.next_page}
          onClick={onChange}
          pageText={nextPageText}
          isDisabled={!paginationInfo.has_next_page}
          itemClass={cx(itemClass, itemClassNext)}
          linkClass={cx(linkClass, linkClassNext)}
          disabledClass={disabledClass}
        />,
      );
    }

    if (isLastPageVisible(paginationInfo.has_next_page)) {
      pages.push(
        <Page
          key={PAGE_KEYS.LAST}
          href={getPageUrl(paginationInfo.total_pages)}
          pageNumber={paginationInfo.total_pages}
          onClick={onChange}
          pageText={lastPageText}
          isDisabled={
            paginationInfo.current_page === paginationInfo.total_pages
          }
          itemClass={cx(itemClass, itemClassLast)}
          linkClass={cx(linkClass, linkClassLast)}
          disabledClass={disabledClass}
        />,
      );
    }

    return paginationInfo.last_page === 1 ? null : pages;
  };

  const ulClass = cx(innerClass, styles.ulContainer);
  let hyphen = PAGINATION_STRINGS.HYPHEN;
  const pages = buildPages();
  let maxOfRange = itemsCountPerPage * activePage;
  if (totalItemsCount <= maxOfRange) maxOfRange = totalItemsCount;
  console.log(maxOfRange);
  const minOfRange = itemsCountPerPage * (activePage - 1) + 1;
  if (minOfRange === maxOfRange) {
    maxOfRange = null;
    hyphen = null;
  }
  let paginationView;
  if (type === 1) {
    if (responseTableView) {
      paginationView =
        itemsCountPerPage < totalItemsCount ? (
          <div className={cx(BS.D_FLEX, BS.JC_BETWEEN, className, gClasses.MT20)}>
            <div
              className={cx(
                gClasses.Italics,
                gClasses.FTwo12GrayV6,
                gClasses.CenterV,
                gClasses.FontWeight500,
              )}
            >
              {PAGINATION_STRINGS.SHOW}
              <span className={cx(gClasses.FTwo12BlueV10, gClasses.ML5)}>
                {minOfRange}
              </span>
              {hyphen}
              <span className={gClasses.FTwo12BlueV10}>{maxOfRange}</span>
              <div className={cx(gClasses.FTwo12GrayV6, gClasses.ML5)}>
                {PAGINATION_STRINGS.OF}
              </div>
              <div className={cx(gClasses.FTwo12BlueV10, gClasses.ML5)}>
                {totalItemsCount}
              </div>
              <div className={gClasses.ML5}>{PAGINATION_STRINGS.RESPONSES}</div>
            </div>
            <ul className={ulClass}>{pages}</ul>
          </div>
        ) : null;
    } else {
      paginationView = (
        // itemsCountPerPage < totalItemsCount ? (
          <div className={cx(BS.D_FLEX, className, BS.JC_BETWEEN, gClasses.W100, gClasses.MT20, gClasses.MB30)}>
            <div
              className={cx(
                gClasses.FTwo13GrayV6,
                gClasses.CenterV,
              )}
            >
              {PAGINATION_STRINGS.SHOW}
              <span className={cx(gClasses.FOne13BlueV10, gClasses.ML5)}>
                {minOfRange}
              </span>
              {hyphen}
              <span className={gClasses.FOne13BlueV10}>{maxOfRange}</span>
              <div className={gClasses.ML5}>{PAGINATION_STRINGS.OF}</div>
              <div className={gClasses.ML5}>{totalItemsCount}</div>
              <div className={cx(gClasses.ML5, gClasses.WordWrap)}>
                {jsUtils.isEmpty(paginationItem)
                  ? PAGINATION_STRINGS.USERS
                  : paginationItem}
              </div>
            </div>
            <div className={cx(gClasses.CenterV)}>
               {!tblIsDataLoading ? (
                <>
                  <span className={cx(styles.RowsPerPage, gClasses.FTwo12GrayV3, gClasses.MR10)}>{ROWS_PER_PAGE.ROW_LABEL}</span>
                  <Dropdown
                    hideLabel
                    optionList={ddlRowOptionList}
                    onChange={ddlRowOnChangeHandler}
                    selectedValue={ddlRowSelectedValue}
                    innerClassName={styles.RowDropdown}
                    className={gClasses.MR20}
                    hideMessage
                    placement={POPPER_PLACEMENTS.TOP}
                    heightClassName={gClasses.InputHeight32Important}
                  />
                </>
              ) : (
                <Skeleton />
              )}
              <ul className={ulClass}>{pages}</ul>
            </div>
          </div>
      );
        // ) : null;
    }
  } else if (type === 2) {
    const nextIcon = (
      <div
        className={cx(
          gClasses.CursorPointer,
          BS.D_FLEX,
          gClasses.CenterVH,
          styles.NavigationButton,
          activePage === totalItemsCount && gClasses.NoPointerEvent,
          activePage === totalItemsCount && gClasses.Opacity5,
        )}
      >
        <ChevronIcon
          onClick={() => {
            onChange(
              activePage + 1 > totalItemsCount
                ? totalItemsCount
                : activePage + 1,
            );
          }}
          className={cx(gClasses.Rotate90)}
        />
      </div>
    );
    const prevIcon = (
      <div
        className={cx(
          gClasses.CursorPointer,
          BS.D_FLEX,
          gClasses.CenterVH,
          styles.NavigationButton,
          activePage === 1 && gClasses.NoPointerEvent,
          activePage === 1 && gClasses.Opacity5,
        )}
      >
        <ChevronIcon
          onClick={() => {
            onChange(activePage - 1 < 1 ? 1 : activePage - 1);
          }}
          className={cx(gClasses.Rotate270)}
        />
      </div>
    );
    paginationView = (
      <div className={cx(BS.D_FLEX, gClasses.CenterV, className)}>
        {prevIcon}
        <div className={cx(gClasses.FTwo12GrayV3, gClasses.ML10)}>
          {activePage}
        </div>
        <div className={cx(gClasses.Fone12GrayV3, gClasses.ML10)}>of</div>
        <div
          className={cx(gClasses.Fone12GrayV3, gClasses.ML10, gClasses.MR10)}
        >
          {totalItemsCount}
        </div>
        {nextIcon}
      </div>
    );
  }
  return isDataLoading ? (
    <div className={className}>
      <Skeleton height={SKELETON_LOADER_DIMENSION_CONSTANTS.PX32} />
    </div>
  ) : (
    paginationView
  );
}

export default PaginationWithRowsPerPage;

PaginationWithRowsPerPage.defaultProps = {
  innerClass: PAGINATION_STRINGS.PAGINATION,
  itemClass: styles.itemClass,
  linkClass: styles.linkClass,
  itemClassFirst: styles.itemClassFirst,
  itemClassPrev: styles.itemClassPrev,
  itemClassNext: styles.itemClassNext,
  itemClassLast: styles.itemClassLast,
  linkClassFirst: styles.linkClassFirst,
  linkClassNext: styles.linkClassNext,
  linkClassPrev: styles.linkClassPrev,
  linkClassLast: styles.linkClassLast,
  disabledClass: styles.disabledClass,
  activeLinkClass: styles.SelectedDayBox,
  activeClass: styles.SelectedDayBox,
  className: EMPTY_STRING,
  hideFirstLastPages: false,
  hideDisabled: false,
  hideNavigation: false,
  getPageUrl: () => HASH,
  onChange: null,
  responseTableView: false,
  isDataLoading: false,
  type: 1,
};

PaginationWithRowsPerPage.propTypes = {
  itemsCountPerPage: propTypes.number.isRequired,
  activePage: propTypes.number.isRequired,
  className: propTypes.string,
  innerClass: propTypes.string,
  itemClass: propTypes.string,
  linkClass: propTypes.string,
  activeLinkClass: propTypes.string,
  itemClassFirst: propTypes.string,
  itemClassNext: propTypes.string,
  itemClassPrev: propTypes.string,
  itemClassLast: propTypes.string,
  disabledClass: propTypes.string,
  linkClassFirst: propTypes.string,
  linkClassNext: propTypes.string,
  linkClassPrev: propTypes.string,
  linkClassLast: propTypes.string,
  activeClass: propTypes.string,
  hideFirstLastPages: propTypes.bool,
  hideDisabled: propTypes.bool,
  hideNavigation: propTypes.bool,
  totalItemsCount: propTypes.number.isRequired,
  getPageUrl: propTypes.func,
  onChange: propTypes.func,
  responseTableView: propTypes.bool,
  isDataLoading: propTypes.bool,
  type: propTypes.number,
};

PaginationWithRowsPerPage.contextType = ThemeContext;
