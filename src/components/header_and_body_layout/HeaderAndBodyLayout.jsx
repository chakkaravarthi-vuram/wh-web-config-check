import React from 'react';
import cx from 'classnames/bind';

import gClasses from '../../scss/Typography.module.scss';
import styles from './HeaderAndBodyLayout.module.scss';
import { BS } from '../../utils/UIConstants';
import { HEADER_AND_BODY_LAYOUT } from '../form_components/modal/Modal.strings';

export default function HeaderAndBodyLayout(props) {
  const {
    bodyContent,
    headerElement,
    isFlow,
    bodyClass,
    wrapperClassName,
    headerClass,
  } = props;
  return (
    <div className={cx(BS.H100, BS.W100, BS.D_FLEX, gClasses.FlexDirectionColumn, wrapperClassName)}>
      <div className={cx(styles.HeaderContainer, gClasses.ZIndex7, headerClass)}>
        {headerElement}
      </div>
      {/* <div className={gClasses.HorizontalLine} /> */}
      <div id={HEADER_AND_BODY_LAYOUT} className={cx(styles.BodyContainer, bodyClass, (isFlow ? styles.FlowBodyContainer : null))}>
        {bodyContent}
      </div>
    </div>
  );
}
