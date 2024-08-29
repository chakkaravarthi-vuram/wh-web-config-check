import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames/bind';
import { withRouter } from 'react-router-dom';

import PageStepper from './page_stepper/PageStepper';
import CloseIcon from '../../assets/icons/CloseIcon';

import gClasses from '../../scss/Typography.module.scss';
import styles from './StepperPage.module.scss';
import { BS } from '../../utils/UIConstants';
import ThemeContext from '../../hoc/ThemeContext';
import jsUtils from '../../utils/jsUtility';
import { routeNavigate } from '../../utils/UtilityFunctions';
import { ROUTE_METHOD } from '../../utils/Constants';

class StepperPage extends Component {
  constructor(props) {
    super(props);
    this.currentComponentCompRef = null;
    // this.currentComponentRef = (element) => {
    //   this.currentComponentCompRef = element;
    // };
  }

  render() {
    const {
      onTabClick,
      selectedTab,
      stepperList,
      title,
      subTitle,
      currentComponent,
      buttomActionButtons = false,
      isAdminSettingsView,
      leftSideContainerClasses,
      rightSideContainerClasses,
      enableCloseButton,
      isProgressStep,
      enableCurrentTabTitles,
      isDataLoading,
      className,
    } = this.props;
    const { primaryColor } = this.context;
    const currentTabIndex = stepperList.findIndex(
      (step) => step.INDEX === selectedTab,
    );
    const currentTabObj = stepperList[currentTabIndex];

    const titleAndSubTitle = enableCurrentTabTitles ? (
      <>
        <div className={gClasses.FTwo18} style={{ color: primaryColor }}>
          {jsUtils.get(currentTabObj, 'TEXT')}
        </div>
        <div className={cx(gClasses.FTwo12GrayV9, gClasses.MB20)}>
          {jsUtils.get(currentTabObj, 'SUB_TITLE')}
        </div>
      </>
    ) : null;
    if (isAdminSettingsView && !jsUtils.isNull(this.currentComponentCompRef)) {
      this.currentComponentCompRef.scrollTop = '0px';
    }

    return (
      <div className={cx(styles.LCContainer, className)}>
        <div className={cx(styles.LeftContainer, leftSideContainerClasses)}>
          <PageStepper
            selectedTab={selectedTab}
            onTabClick={onTabClick}
            stepperList={stepperList}
            title={title}
            subTitle={subTitle}
            isAdminSettingsView={isAdminSettingsView}
            isProgressStep={isProgressStep}
            isDataLoading={isDataLoading}
          />
          {enableCloseButton ? (
            <CloseIcon
              className={cx(styles.CloseButton, BS.P_ABSOLUTE)}
              onClick={this.onCloseIconClick}
              isButtonColor
            />
          ) : null}
        </div>
        <div className={styles.VLine} />
        <div
          className={cx(
            styles.RightContainer,
            BS.P_RELATIVE,
            BS.D_FLEX,
            BS.FLEX_COLUMN,
            rightSideContainerClasses,
          )}
        >
          <div
            className={cx(
              gClasses.Flex1,
              gClasses.ScrollBar,
              isAdminSettingsView ? styles.RightContainerScrollableArea : null,
            )}
            ref={this.containerRef}
          >
            {titleAndSubTitle}
            {currentComponent}
          </div>
          {buttomActionButtons}
        </div>
      </div>
    );
  }

  onCloseIconClick = () => {
    let doRedirectToPrevLocation = false;
    const { onCloseClick } = this.props;
    if (onCloseClick) {
      doRedirectToPrevLocation = onCloseClick();
    } else {
      return this.redirectToPrevLocation();
    }
    if (doRedirectToPrevLocation) {
      return this.redirectToPrevLocation();
    }
    return null;
  };

  redirectToPrevLocation = () => {
    const { history } = this.props;
    routeNavigate(history, ROUTE_METHOD.GO_BACK, null, null, null);
  };
}
export default withRouter(StepperPage);
StepperPage.defaultProps = {
  isAdminSettingsView: false,
};
StepperPage.propTypes = {
  isAdminSettingsView: PropTypes.bool,
};
StepperPage.contextType = ThemeContext;
