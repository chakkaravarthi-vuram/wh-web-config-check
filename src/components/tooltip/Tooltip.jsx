import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Tooltip as RSTooltip } from 'reactstrap';
import cx from 'classnames';
import { isArray } from 'lodash';

import InfoIconNew from 'assets/icons/InfoIconNew';
import gClasses from '../../scss/Typography.module.scss';
import styles from './Tooltip.module.scss';
import { BS } from '../../utils/UIConstants';

function Tooltip(props) {
  const { content, id, placement, isCustomToolTip, isNav, customInnerClasss, customArrowClass, outerClass, displayList, listTitle, listTitleClass, className, arrowStyle } = props;
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const toggle = () => setTooltipOpen(!tooltipOpen);
  let tootlTipContent = content;
  if (isArray(content)) {
    tootlTipContent = (
     <>
      {displayList &&
        <div className={cx(gClasses.MB10, BS.TEXT_LEFT, listTitleClass)}>
          {listTitle}
        </div>
      }
      <ul>
        {
          content.map((paragraph, tcIndex) => (
            <div className={cx(gClasses.CenterV, displayList && gClasses.MB7)}>
              {displayList && <InfoIconNew className={cx(gClasses.MR5, styles.InfoIcon)} />}
              <li className={BS.TEXT_LEFT} key={`tc${tcIndex}`}>
                {paragraph}
              </li>
            </div>
          ))
        }
      </ul>
     </>
    );
  } else {
    if (displayList) {
      tootlTipContent = (
        <>
          <div className={cx(gClasses.MB10, BS.TEXT_LEFT, listTitleClass)}>
            {listTitle}
          </div>
          <div className={gClasses.CenterV}>
            <InfoIconNew className={cx(gClasses.MR5, styles.InfoIcon)} />
            {content}
          </div>
        </>
      );
    }
  }
let toolTip = null;
  if (isCustomToolTip) {
    toolTip = (
      <RSTooltip
        placement={placement || 'top'}
        isOpen={tooltipOpen}
        target={id}
        toggle={toggle}
        innerClassName={cx(isNav ? styles.CustomNavContainer : styles.CustomContainer, gClasses.FOne13BlackV6, customInnerClasss)}
        arrowClassName={customArrowClass}
        popperClassName={isNav ? styles.OuterNavContainer : cx(styles.OuterContainer, outerClass)}
        // className={styles.Arrow}
        autohide={false}
        className={cx(isNav ? styles.OuterNavContainer : styles.OuterContainer, className, arrowStyle)}
        flip
        fade
      >
        {tootlTipContent}
      </RSTooltip>
    );
  } else {
    toolTip = (
      <RSTooltip
      placement={placement || 'top'}
      isOpen={tooltipOpen}
      target={id}
      toggle={toggle}
      innerClassName={cx(styles.Container, gClasses.FOne13BlackV6, customInnerClasss)}
      // arrowClassName={styles.Arrow}
      popperClassName={styles.Arrow}
      className={styles.Arrow}
      autohide={false}
      >
      {tootlTipContent}
      </RSTooltip>
    );
  }

  return (
      toolTip
  );
}
export default Tooltip;
Tooltip.defaultProps = { content: null, id: 'random-id', isCustomToolTip: false, isNav: false };
Tooltip.propTypes = { content: PropTypes.node, id: PropTypes.string, isCustomToolTip: PropTypes.bool, isNav: PropTypes.bool };
