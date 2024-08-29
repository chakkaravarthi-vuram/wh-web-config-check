import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames/bind';
import { useTranslation } from 'react-i18next';
import Skeleton from 'react-loading-skeleton';
import ThemeContext from '../../hoc/ThemeContext';

import HelpIcon from '../../assets/icons/HelpIcon';

import gClasses from '../../scss/Typography.module.scss';
import styles from './Tab.module.scss';

import {
  BS,
  SKELETON_LOADER_DIMENSION_CONSTANTS,
} from '../../utils/UIConstants';
import { EMPTY_STRING } from '../../utils/strings/CommonStrings';
import { generateEventTargetObject } from '../../utils/generatorUtils';

const TAB_TYPE = {
  TYPE_1: 1,
  TYPE_2: 2,
  TYPE_3: 3,
  TYPE_4: 4,
  TYPE_5: 5,
  TYPE_6: 6,
  TYPE_7: 7,
};

function Tab(props) {
  const {
    className,
    selectedIndex,
    tabIList,
    type,
    setTab,
    darkBg,
    tabRef,
    isDataLoading,
    isDashboard,
    tabTextClassName,
    tabClass,
    isLanguageConvert,
  } = props;
  const { t } = useTranslation();
  console.log('listHeight', tabRef);
  const { buttonColor } = useContext(ThemeContext);
  let typeStyles = null;
  switch (type) {
    case TAB_TYPE.TYPE_1:
      typeStyles = styles.Type1;
      break;
    case TAB_TYPE.TYPE_2:
      typeStyles = styles.Type2;
      break;
    case TAB_TYPE.TYPE_3:
      typeStyles = styles.Type3;
      break;
    case TAB_TYPE.TYPE_4:
      typeStyles = styles.Type4;
      break;
    case TAB_TYPE.TYPE_5:
      typeStyles = styles.Type5;
      break;
    case TAB_TYPE.TYPE_6:
      typeStyles = styles.Type6;
      break;
    case TAB_TYPE.TYPE_7:
      typeStyles = styles.Type7;
      break;
    default:
      typeStyles = styles.Default;
  }

  const onTabClick = (tabIndex) => {
    console.log('tabIndex', tabIndex);
    if (selectedIndex !== tabIndex) {
      if (type === TAB_TYPE.TYPE_4)setTab(generateEventTargetObject(null, tabIndex));
      else setTab(tabIndex);
      // when clicked tab is switched page got moved up
      // if (ref) {
      //   const domNode = ReactDOM.findDOMNode(ref.current);
      //   if (domNode) {
      //     // domNode.scrollIntoView();
      //     domNode.scrollIntoView({ behavior: 'smooth', block: 'start' });
      //   }
      // }
    }
  };

  const tabItems = tabIList.map((tab, index) => {
    const tabItemClass = cx(
      darkBg ? gClasses.FTwo13White : gClasses.FTwo13BlackV2,
      gClasses.CenterV,
      gClasses.CursorPointer,
      BS.P_RELATIVE,
      BS.D_FLEX,
      gClasses.ClickableElement,
      isDashboard && tab.INDEX === selectedIndex && styles.SelectedDashboard,
      isDashboard && styles.Dashboard,
    );
    const buttonRef = React.createRef();
    return (
      <React.Fragment key={`tab_${index}`}>
        {isDataLoading ? (
          <div className={gClasses.MR20}>
            <Skeleton
              width={SKELETON_LOADER_DIMENSION_CONSTANTS.PX100}
              height={SKELETON_LOADER_DIMENSION_CONSTANTS.PX16}
            />
          </div>
        ) : (
          <button
            id={`tab_${tab.TEXT}`}
            key={tab.INDEX}
            onClick={(event) => {
              onTabClick(tab.INDEX, buttonRef);
              event.stopPropagation();
            }}
            className={tabItemClass}
            style={tab.INDEX === selectedIndex ? null : { color: buttonColor }}
            ref={buttonRef}
          >
            <span
              style={{
                  marginBottom:
                    type === TAB_TYPE.TYPE_4 || type === TAB_TYPE.TYPE_5
                      ? '7px'
                      : 0,
                  color: tab.INDEX === selectedIndex ? '#217CF5' : '#282828',
              }}
              className={cx(tabTextClassName, styles.TabName, gClasses.FontWeight500)}
            >
              {tab.ICON && <tab.ICON className={cx(gClasses.MR12, styles.TabIcon)} style={{ fill: tab.INDEX === selectedIndex ? '#217CF5' : '#959BA3' }} />}
              {isLanguageConvert ? t(tab.TEXT) : tab.TEXT}
              {type === TAB_TYPE.TYPE_7 && <span style={(tab.INDEX === selectedIndex) ? { backgroundColor: '#217CF5' } : {}} />}
            </span>
            {tab.HELP_TEXT ? (
              <HelpIcon
                className={gClasses.HelpIcon}
                title={tab.HELP_TEXT}
                id="tabHelp"
              />
            ) : null}
            {tab.INDEX === selectedIndex && !isDashboard && type !== TAB_TYPE.TYPE_7 ? (
              <div
                className={cx(
                  tabClass,
                  styles.SelectedTab,
                  BS.P_ABSOLUTE,
                  BS.W100,
                  gClasses.SelectedTab,
                )}
                style={{ backgroundColor: buttonColor }}
              />
            ) : null}
          </button>
        )}
      </React.Fragment>
    );
  });

  return (
    <div
      className={cx(
        className,
        typeStyles,
        BS.D_FLEX,
        gClasses.WhiteSpaceNoWrap,
      )}
    // tabRef={tabRef}
    >
      {tabItems}
    </div>
  );
}

Tab.defaultProps = {
  className: EMPTY_STRING,
  tabIList: [],
  darkBg: false,
  tabRef: {},
  isDataLoading: false,
  type: null,
  selectedIndex: null,
  tabClass: EMPTY_STRING,
};
Tab.propTypes = {
  className: PropTypes.string,
  selectedIndex: PropTypes.number,
  tabIList: PropTypes.arrayOf(PropTypes.any),
  type: PropTypes.number,
  setTab: PropTypes.func.isRequired,
  darkBg: PropTypes.bool,
  tabRef: PropTypes.objectOf(PropTypes.any),
  isDataLoading: PropTypes.bool,
  tabClass: PropTypes.string,
};
export default React.forwardRef((props, ref) => (
  <Tab tabRef={ref} {...props} />
));
export { TAB_TYPE };
