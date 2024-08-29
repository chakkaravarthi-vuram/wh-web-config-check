import React, { useContext } from 'react';
import Radium from 'radium';
import cx from 'classnames/bind';
import { Link } from 'react-router-dom';
import gClasses from 'scss/Typography.module.scss';
import ThemeContext from 'hoc/ThemeContext';
import styles from '../QuickLinksPanel.module.scss';

function QuickLinkItem(props) {
  const { buttonColor } = useContext(ThemeContext);

  const { label, link } = props;
  return (
    <li className={cx(styles.QuickLinkItem, gClasses.CursorPointer)}>
      <Link
        to={{ pathname: link }}
        className={cx(styles.QuickLink, gClasses.CenterV, gClasses.MB20)}
        target="_blank"
      >
        <div
          className={cx(styles.QuickLinkArrow, gClasses.MR10)}
        />
        <div
          className={cx(styles.QuickLinkArrowOnHover, gClasses.MR10)}
          style={{ borderColor: buttonColor }}
        />
        <div className={cx(gClasses.FTwo12GrayV3, gClasses.FontWeight500, styles.QuickLinkLabel)}>
          {label}
        </div>
        <div
          className={cx(gClasses.FTwo12, gClasses.FontWeight500, styles.QuickLinkLabelOnHover)}
          style={{ color: buttonColor }}
        >
          {label}
        </div>
      </Link>
    </li>
  );
}

export default Radium(QuickLinkItem);
