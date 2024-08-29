import React from 'react';
import cx from 'classnames/bind';
import gClasses from 'scss/Typography.module.scss';
import StartMenu from './home_page_start_menu/StartMenu';
import styles from './QuickLinksPanel.module.scss';
import { QUICK_LINKS_FLOW } from '../LandingPage.strings';

function QuickLinksPanel(props) {
  const { isTrialDisplayed } = props;

  return (
    <div
      className={cx(
        styles.QuickLinksPanel,
        isTrialDisplayed && styles.TrialQuickHeight,
        gClasses.PB0,
      )}
    >
      <div className={cx(gClasses.HeadingTitleV1)}>
        {QUICK_LINKS_FLOW.TITLE}
      </div>
      <StartMenu />
    </div>
  );
}

export default QuickLinksPanel;
