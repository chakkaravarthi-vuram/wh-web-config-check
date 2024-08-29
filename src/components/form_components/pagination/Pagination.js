import React from 'react';
import propTypes from 'prop-types';
import cx from 'classnames/bind';
import Paginator from 'paginator';
import Skeleton from 'react-loading-skeleton';
import jsUtils from 'utils/jsUtility';
import { keydownOrKeypessEnterHandle } from 'utils/UtilityFunctions';
import ThemeContext from '../../../hoc/ThemeContext';
import Page from './Page';
import NextIcon from '../../../assets/icons/pagination/NextIcon';
import MoveToEndIcon from '../../../assets/icons/pagination/MoveToEndIcon';
import styles from './Pagination.module.scss';
import {
  ARIA_ROLES,
  BS,
  SKELETON_LOADER_DIMENSION_CONSTANTS,
} from '../../../utils/UIConstants';
import {
  PAGINATION_STRINGS,
  ICON_STRINGS,
  PAGE_KEYS,
} from './Pagination.strings';
import gClasses from '../../../scss/Typography.module.scss';
import { HASH, EMPTY_STRING } from '../../../utils/strings/CommonStrings';
import ChevronIcon from '../../../assets/icons/ChevronIcon';

function Pagination(props) {
  const {
    innerClass,
    itemsCountPerPage,
    activePage,
    totalItemsCount,
    className,
    flowDashboardView,
    datalistDashboardView,
    isDataLoading,
    responseTableView,
    type,
    paginationItem,
    showItemDisplayInfoStrictly,
    onChange,
    rowsPerPageDropdown,
    libraryManagementStyles,
    PaginationStyle,
  } = props;
  console.log('pagofsgkfjskdf', PaginationStyle);

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
        ariaLabel={ICON_STRINGS.PREVIOUS}
        role={ARIA_ROLES.IMG}
      />
    );
    const firstPageText = (
      <MoveToEndIcon
        title={ICON_STRINGS.MOVE_BEGIN}
        className={styles.Icon}
        role={ARIA_ROLES.IMG}
        ariaLabel={ICON_STRINGS.MOVE_BEGIN}
        style={{ fill: '#6c727e' }}
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

    const paginationInfo = new Paginator(itemsCountPerPage, 5).build(totalItemsCount, activePage);
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
          <div className={cx(BS.D_FLEX, BS.JC_BETWEEN, className)} style={PaginationStyle}>
            <div
              className={cx(
                gClasses.FTwo13GrayV6,
                gClasses.CenterV,
              )}
            >
              {PAGINATION_STRINGS.SHOW}
              <span className={cx(gClasses.FTwo12BlueV10, gClasses.ML5)}>
                {minOfRange}
              </span>
              {hyphen}
              <span className={gClasses.FTwo12BlueV10}>{maxOfRange}</span>
              <div className={cx(gClasses.FTwo13GrayV6, gClasses.ML5)}>
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
    } else if (flowDashboardView || datalistDashboardView) {
      const modifiedMinOfRange = totalItemsCount === 0 ? 0 : minOfRange;
      // const modifiedMaxOfRange = maxOfRange || 0;
      paginationView = (
        <div className={cx(BS.D_FLEX, BS.JC_BETWEEN, className)} style={PaginationStyle}>
          <div
            className={cx(
              gClasses.FTwo13GrayV6,
              gClasses.CenterV,
            )}
          >
            {PAGINATION_STRINGS.SHOW}
            <span className={cx(gClasses.FTwo12BlueV10, gClasses.ML5)}>
              {modifiedMinOfRange}
            </span>
            {hyphen}
            <span className={gClasses.FTwo12BlueV10}>{maxOfRange}</span>
            <div className={cx(gClasses.FTwo13GrayV6, gClasses.ML5)}>
              {PAGINATION_STRINGS.OF}
            </div>
            <div className={cx(gClasses.FTwo12BlueV10, gClasses.ML5)}>
              {totalItemsCount}
            </div>
            {/* <div className={gClasses.ML5}>{datalistDashboardView ? PAGINATION_STRINGS.DATA_LISTS : PAGINATION_STRINGS.FLOWS}</div> */}
          </div>
          {itemsCountPerPage < totalItemsCount ? (
            <ul className={ulClass}>{pages}</ul>
          ) : null}
        </div>
      );
    } else if (!libraryManagementStyles && showItemDisplayInfoStrictly) {
      paginationView = totalItemsCount > 0 && (
        <div className={cx(BS.D_FLEX, className)} style={PaginationStyle}>
          <ul className={ulClass}>{pages}</ul>
          <div
            className={cx(
              gClasses.FTwo13GrayV6,
              gClasses.CenterV,
              itemsCountPerPage < totalItemsCount && gClasses.ML20,
            )}
          >
            {PAGINATION_STRINGS.SHOW}
            <span className={cx(gClasses.FTwo12BlueV10, gClasses.ML5)}>
              {minOfRange}
            </span>
            {hyphen}
            <span className={gClasses.FTwo12BlueV10}>{maxOfRange}</span>
            <div className={cx(gClasses.FTwo13GrayV6, gClasses.ML5)}>
              {PAGINATION_STRINGS.OF}
            </div>
            <div className={cx(gClasses.FTwo12BlueV10, gClasses.ML5)}>
              {totalItemsCount}
            </div>
            <div className={cx(gClasses.ML5, gClasses.WordWrap)}>
              {jsUtils.isEmpty(paginationItem)
                ? PAGINATION_STRINGS.USERS
                : paginationItem}
            </div>
          </div>
        </div>
      );
    } else if (libraryManagementStyles) {
      paginationView = totalItemsCount > 0 && (
        <div>
          <div
            style={{ float: 'left' }}
            className={cx(
              gClasses.FTwo13GrayV6,
              gClasses.CenterV,
              gClasses.MT10,
            )}
          >
            {PAGINATION_STRINGS.SHOW}
            <span className={cx(gClasses.FTwo12BlueV10, gClasses.ML5)}>
              {minOfRange}
            </span>
            {hyphen}
            <span className={gClasses.FTwo12BlueV10}>{maxOfRange}</span>
            <div className={cx(gClasses.FTwo13GrayV6, gClasses.ML5)}>
              {PAGINATION_STRINGS.OF}
            </div>
            <div className={cx(gClasses.FTwo12BlueV10, gClasses.ML5)}>
              {totalItemsCount}
            </div>
            <div className={cx(gClasses.ML5, gClasses.WordWrap)}>
              {jsUtils.isEmpty(paginationItem)
                ? PAGINATION_STRINGS.USERS
                : paginationItem}
            </div>
          </div>
          <span className={cx(BS.D_FLEX, BS.JC_END, gClasses.MT10)}>
            {rowsPerPageDropdown}
            <ul className={ulClass}>{pages}</ul>
          </span>
        </div>
      );
    } else {
      paginationView =
        itemsCountPerPage < totalItemsCount ? (
          <div className={cx(BS.D_FLEX, className)} style={PaginationStyle}>
            <ul className={ulClass}>{pages}</ul>
            <div
              className={cx(
                gClasses.FTwo13GrayV6,
                gClasses.CenterV,
                gClasses.ML20,
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
          </div>
        ) : null;
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
          role="button"
          tabIndex={activePage === totalItemsCount ? -1 : 0}
          onKeyDown={(e) => {
            keydownOrKeypessEnterHandle(e) &&
            onChange(
              activePage + 1 > totalItemsCount
                ? totalItemsCount
                : activePage + 1,
            );
          }}
          className={cx(gClasses.Rotate90)}
          ariaLabel={ICON_STRINGS.NEXT}
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
          role="button"
          tabIndex={activePage === 1 ? -1 : 0}
          onKeyDown={(e) => {
            keydownOrKeypessEnterHandle(e) &&
            onChange(activePage - 1 < 1 ? 1 : activePage - 1);
          }}
          ariaLabel={ICON_STRINGS.PREVIOUS}
          className={cx(gClasses.Rotate270)}
        />
      </div>
    );
    paginationView = (
      <div className={cx(BS.D_FLEX, gClasses.CenterV, className)} style={PaginationStyle}>
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
    <div className={className} style={PaginationStyle}>
      <Skeleton height={SKELETON_LOADER_DIMENSION_CONSTANTS.PX32} />
    </div>
  ) : (
    paginationView
  );
}

export default Pagination;

Pagination.defaultProps = {
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
  flowDashboardView: false,
  datalistDashboardView: false,
  responseTableView: false,
  isDataLoading: false,
  type: 1,
};

Pagination.propTypes = {
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
  flowDashboardView: propTypes.bool,
  datalistDashboardView: propTypes.bool,
  responseTableView: propTypes.bool,
  isDataLoading: propTypes.bool,
  type: propTypes.number,
};

Pagination.contextType = ThemeContext;
