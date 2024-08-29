import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames/bind';
import { useSwipeable } from 'react-swipeable';
import { useHistory } from 'react-router-dom';

import { Tab } from '@workhall-pvt-lmt/wh-ui-library';
import gClasses from '../../scss/Typography.module.scss';
import styles from './TabViewLayout.module.scss';
import {
  isBasicUserMode,
  isMobileScreen,
  onSwipedUpOrDown,
  onWindowResize,
} from '../../utils/UtilityFunctions';
import { EMPTY_STRING } from '../../utils/strings/CommonStrings';
import ConditionalWrapper from '../conditional_wrapper/ConditionalWrapper';
import ThemeContext from '../../hoc/ThemeContext';

function TabViewLayout(props) {
  const {
    className,
    pageTitle,
    tabList,
    onTabChange,
    selectedTabIndex,
    currentComponent,
    titleWidth,
    headerContent,
  } = props;
  const history = useHistory();
  const isNormalMode = isBasicUserMode(history);
  const { colorScheme, colorSchemeDefault } = useContext(ThemeContext);

  let headerCompRef = null;

  const headerRef = (element) => {
    headerCompRef = element;
  };

  let containerCompRef = null;

  const containerRef = (element) => {
    containerCompRef = element;
  };

  let contentContainerCompRef = null;

  const contentContainerRef = (element) => {
    contentContainerCompRef = element;
  };

  const [isMobileScreenView, setMobileScreenView] = useState(isMobileScreen());

  const windowResize = () => {
    if (headerCompRef && containerCompRef && contentContainerCompRef) {
      const listHeight =
        containerCompRef.clientHeight - headerCompRef.clientHeight;
      contentContainerCompRef.style.height = `${listHeight}px`;
    }
    setMobileScreenView(isMobileScreen());
  };

  const onSwiped = (event) => {
    if (containerCompRef) {
      const top = onSwipedUpOrDown(event);
      containerCompRef.style.top = `${top}px`;
    }
  };

  useEffect(() => {
    windowResize();
    onWindowResize(windowResize);
  });

  const handlers = useSwipeable({
    onSwipedUp: (event) => onSwiped(event),
    onSwipedDown: (event) => onSwiped(event),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  });

  return (
    <div
      className={cx(
        className,
        styles.Container,
        gClasses.DisplayFlex,
        gClasses.FlexDirectionColumn,
      )}
      ref={containerRef}
    >
      <ConditionalWrapper
        condition={isMobileScreenView}
        wrapper={(children) => <div {...handlers}>{children}</div>}
      >
        <div
          className={styles.HeaderContainer}
          ref={headerRef}
          style={{
            backgroundColor: isNormalMode
              ? colorScheme?.highlight
              : colorSchemeDefault?.highlight,
          }}
        >
          {headerContent}
          <div
            className={cx(
              gClasses.SwipeIndicatorBar,
              gClasses.SwipeIndicatorBarPosition,
            )}
          />
          <div className={cx(styles.Title, gClasses.ModalHeader, titleWidth)}>
            {pageTitle}
          </div>
          <div>
            <Tab
              options={tabList}
              selectedTabIndex={selectedTabIndex}
              className={gClasses.ML50}
              onClick={onTabChange}
              colorScheme={isNormalMode ? colorScheme : colorSchemeDefault}
              textClass={styles.TabText}
              bottomSelectionClass={styles.TabClass}
            />
          </div>
        </div>
      </ConditionalWrapper>

      <div
        className={cx(
          gClasses.ContentPadding,
          gClasses.ScrollBar,
          styles.ContentContainer,
        )}
        ref={contentContainerRef}
      >
        {currentComponent}
      </div>
    </div>
  );
}
export default TabViewLayout;
TabViewLayout.defaultProps = {
  className: EMPTY_STRING,
  pageTitle: EMPTY_STRING,
  tabList: [],
  onTabChange: null,
  selectedTabIndex: null,
  currentComponent: null,
};
TabViewLayout.propTypes = {
  className: PropTypes.string,
  pageTitle: PropTypes.string,
  tabList: PropTypes.arrayOf(PropTypes.any),
  onTabChange: PropTypes.func,
  selectedTabIndex: PropTypes.number,
  currentComponent: PropTypes.node,
};
