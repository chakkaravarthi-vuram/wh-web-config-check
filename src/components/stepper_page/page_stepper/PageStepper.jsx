import React, { useContext, useRef } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames/bind';
import Skeleton from 'react-loading-skeleton';
import Tooltip from 'components/tooltip/Tooltip';
import ThemeContext from '../../../hoc/ThemeContext';

import CardPatch from '../../card_patch/CardPatch';

import gClasses from '../../../scss/Typography.module.scss';

import { BS } from '../../../utils/UIConstants';
import styles from './PageStepper.module.scss';
import CorrectIcon from '../../../assets/icons/CorrectIcon';
import { calculateVerticalCardCountFromRef } from '../../../utils/UtilityFunctions';

function Tabs(props) {
  const tabListRef = useRef(null);
  const {
    onTabClick, selectedTab, stepperList, subTitle,
    isAdminSettingsView, isProgressStep, isDataLoading,
  } = props;
  const { primaryColor } = useContext(ThemeContext);
  let tabList = [];

  if (isDataLoading) {
    tabList = Array(calculateVerticalCardCountFromRef(tabListRef, 50, 0, 10)).fill().map(() => <Skeleton className={gClasses.MB10} height={40} />);
  } else {
    tabList = stepperList.map((TAB, index) => {
      const isSelected = selectedTab === TAB.INDEX;
      let color = null;
      const circleTextClass = cx(
        gClasses.FTwo12BlackV10,
        gClasses.FontWeight500,
        gClasses.CenterVH,
      );
      let circleIndex = null;
      let textClass = null;
      if (isAdminSettingsView) {
        color = isSelected ? '#222747' : '#228bb5';
        circleIndex = isSelected ? <div className={styles.SelectedIcon}>{TAB.ICON}</div> : <div className={styles.UnSelectedIcon}>{TAB.ICON}</div>;
      } else if (selectedTab < TAB.INDEX) {
        circleIndex = (
          <div
            className={cx(
              styles.Circle1,
              styles.UnSelectedCircle,
              circleTextClass,
            )}
          >
            {TAB.INDEX}
          </div>
        );
        textClass = isAdminSettingsView && styles.PendingTextClass;
      } else if (selectedTab > TAB.INDEX) {
        if (isProgressStep) {
         circleIndex = (
          <div className={cx(styles.Circle1, styles.CompletedStepCircle, circleTextClass)}>
            <CorrectIcon className={styles.CorrectIcon} />
          </div>
        );
        textClass = styles.CompletedTextClass;
        } else {
          circleIndex = (
            <div
              className={cx(
                styles.Circle1,
                styles.UnSelectedCircle,
                circleTextClass,
              )}
            >
              {TAB.INDEX}
            </div>
          );
          textClass = isProgressStep && styles.PendingTextClass;
        }
      } else {
        circleIndex = (
          <div
          className={cx(
            styles.Circle1,
            styles.SelectedCircle,
            circleTextClass,
          )}
          >
            {TAB.INDEX}
          </div>
       );
        color = primaryColor;
      }

      return (
        <button
          className={cx(
            gClasses.ClickableElement,
            gClasses.CursorPointer,
            BS.P_RELATIVE,
            BS.W100,
            gClasses.CenterV,
            BS.JC_BETWEEN,
            styles.ListCard,
            { [gClasses.SelectedListCard]: isSelected },
            isSelected && styles.SelectedCard,
          )}
          onClick={() => onTabClick(TAB.INDEX)}
          key={`page_stepper_tab_${index}`}
        >
          <div className={cx(gClasses.CenterV)}>
          {circleIndex}
          <div
            className={cx(
              gClasses.ML15,
              gClasses.FTwo14,
              gClasses.FontWeight500,
              textClass,
              gClasses.BlueV25,
              styles.StepName,
            )}
            id={`tool${TAB.INDEX}`}
            style={{ color }}
          >
            {TAB.TEXT}
          </div>
          <Tooltip id={`tool${TAB.INDEX}`} content={TAB.TEXT} isCustomToolTip />

          </div>
          <CardPatch className={styles.CardPatch} isSelected={isSelected} />
        </button>
      );
    });
  }

  return (
    <>
      <div className={cx(gClasses.SectionSubTitle, styles.SubTitle)}>{subTitle}</div>
      <div className={styles.TabListContainer}>
        <div className={cx(styles.TabLists, gClasses.Flex1, gClasses.ScrollBar)} ref={tabListRef}>{tabList}</div>
      </div>
    </>
  );
}
export default Tabs;
Tabs.defaultProps = {
  isAdminSettingsView: false,
  isEditFlowView: false,
};
Tabs.propTypes = {
  onTabClick: PropTypes.func.isRequired,
  selectedTab: PropTypes.number.isRequired,
  stepperList: PropTypes.arrayOf(PropTypes.any).isRequired,
  title: PropTypes.string.isRequired,
  isAdminSettingsView: PropTypes.bool,
  isEditFlowView: PropTypes.bool,
};
