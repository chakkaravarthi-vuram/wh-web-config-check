import React, { useContext } from 'react';
import PropType from 'prop-types';
import Radium from 'radium';
import Skeleton from 'react-loading-skeleton';
import cx from 'classnames/bind';

import gClasses from '../../scss/Typography.module.scss';
import styles from './ButtonTab.module.scss';
import ThemeContext from '../../hoc/ThemeContext';
import { BS, COLOR_CONSTANTS, SKELETON_LOADER_DIMENSION_CONSTANTS } from '../../utils/UIConstants';
import { EMPTY_STRING } from '../../utils/strings/CommonStrings';
import Label from '../form_components/label/Label';

export const BUTTON_TAB_TYPES = {
  TYPE_1: 1,
  TYPE_2: 2,
};

function ButtonTab(props) {
  const {
    type = BUTTON_TAB_TYPES.TYPE_1, id, selectedTab, tabs, selectedTabs, label, setButtonTab, hideLabel, isDataLoading, className,
  } = props;
  const { buttonColor } = useContext(ThemeContext);

  let isTabSelected = false;

  const tabsView = tabs.map((tab, tabIndex) => {
    const { title = '' } = tab;
    let tabLabel = '';
    let tabKey = '';

    if (selectedTabs) {
      isTabSelected = selectedTabs.some((selectedTabVal) => tab.value === selectedTabVal);
    }
    if (selectedTab) {
      isTabSelected = selectedTab === tab.value;
    }
    const inlineStyles = {
      outline: isTabSelected ? `1px solid ${buttonColor}` : null,
      color: isTabSelected ? COLOR_CONSTANTS.GRAY_v2 : null,
      backgroundColor: isTabSelected ? COLOR_CONSTANTS.BLUE_V7 : null,
      [BS.HOVER]: {
        outline: `1px solid ${buttonColor}`,
        backgroundColor: COLOR_CONSTANTS.BLUE_V7,
      },
    };

    switch (type) {
      case BUTTON_TAB_TYPES.TYPE_1:
        tabLabel = tab.label;
        tabKey = tab.label;
        break;
      case BUTTON_TAB_TYPES.TYPE_2:
        tabLabel = tab.icon;
        tabKey = `button_tab_${tabIndex}`;
        break;
      default:
        tabLabel = tab.label;
        tabKey = tab.label;
        break;
    }

    return (
      <button
        title={title}
        key={tabKey}
        className={cx(styles.Tab, gClasses.CenterVH, gClasses.ClickableElementV2, gClasses.CursorPointer)}
        style={inlineStyles}
        onClick={tab.value !== selectedTab ? () => setButtonTab(id, tab.value) : null}
      >
        {tabLabel}
      </button>
    );
  });
  return (
    <div className={className}>
      {!hideLabel && <Label content={label} isDataLoading={isDataLoading} />}
      {isDataLoading ? (
        <Skeleton height={SKELETON_LOADER_DIMENSION_CONSTANTS.PX32} width={SKELETON_LOADER_DIMENSION_CONSTANTS.PX150} />
      ) : (
        <div
          id={id}
          className={cx(
            gClasses.InputBorder,
            gClasses.InputBorderRadius,
            gClasses.FOne13BlueV11,
            gClasses.CursorPointer,
            BS.D_FLEX,
            styles.ButtonTab,
          )}
        >
          {tabsView}
        </div>
      )}
    </div>
  );
}

ButtonTab.defaultProps = {
  id: EMPTY_STRING,
  selectedTab: EMPTY_STRING,
  tabs: [],
  selectedTabs: [],
  label: EMPTY_STRING,
  hideLabel: false,
  isDataLoading: false,
  className: EMPTY_STRING,
};
ButtonTab.propTypes = {
  id: PropType.string,
  selectedTab: PropType.string,
  tabs: PropType.arrayOf,
  selectedTabs: PropType.arrayOf,
  label: PropType.string,
  setButtonTab: PropType.func.isRequired,
  hideLabel: PropType.bool,
  isDataLoading: PropType.bool,
  className: PropType.oneOfType([PropType.string, PropType.object]),
};

export default Radium(ButtonTab);
