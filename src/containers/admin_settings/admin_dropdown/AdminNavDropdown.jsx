import React, { useEffect, useState } from 'react';
import gClasses from 'scss/Typography.module.scss';
import cx from 'classnames/bind';
import { isMobileScreen } from 'utils/UtilityFunctions';
import styles from './AdminNavDropdown.module.scss';

function AdminNavDropdown(props) {
  const [isMobileView, setMobileView] = useState(isMobileScreen());
  const { dropdownValues, currentTabIndex, onNavClick, closeDropdown } = props;

  const onClickHandler = (e, value) => {
    onNavClick(e, value);
    closeDropdown();
  };

  const mobileViewScreen = () => {
    setMobileView(isMobileScreen());
  };

  useEffect(() => {
    window.addEventListener('resize', mobileViewScreen);
  });

  return (
    <ul className={cx(styles.CreateContainer)}>
      {dropdownValues && dropdownValues.map((value, index) => (
        (isMobileView || !value.defaultView) && (
          <li key={index}>
            <button className={cx(gClasses.FontWeight500, currentTabIndex === value.value ? gClasses.FTwo12BlueV39 : gClasses.FTwo12GrayV3, gClasses.CenterV, gClasses.CursorPointer)} onClick={(e) => onClickHandler(e, value.value)}>
            <div className={cx(gClasses.MR10, styles.IconWidth, currentTabIndex === value.value && styles.ActiveSvg)}>
              {value.icon}
            </div>
            {value.label}
            </button>
          </li>
        )
      ))}
    </ul>
  );
}
export default AdminNavDropdown;
