import React, { useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import ThemeContext from '../../../hoc/ThemeContext';
import { getColorSchemeByThemeContext } from '../../../containers/application/app_components/AppComponent.utils';

function RefreshDashboardIcon(props) {
  const {
    className,
    onClick,
    role,
    ariaLabel,
    tabIndex,
    title,
    onkeydown,
    isAppColor = false,
  } = props;
  const [isHovered, setIsHovered] = useState(false);
  const history = useHistory();
  const themeContext = useContext(ThemeContext);
  const colorScheme = isAppColor
    ? themeContext.colorScheme
    : getColorSchemeByThemeContext(themeContext, history);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      fill="none"
      viewBox="0 0 20 20"
      aria-label={ariaLabel}
      tabIndex={tabIndex}
      title={title}
      role={role}
      className={className}
      onClick={onClick || null}
      onkeydown={onkeydown}
      onMouseLeave={() => setIsHovered(false)}
      onMouseEnter={() => setIsHovered(true)}
    >
      <g>
        <path
          fill={isHovered ? colorScheme?.activeColor : '#9E9E9E'}
          fillRule="evenodd"
          d="M.833 10a8.333 8.333 0 0114.228-5.89 26.124 26.124 0 011.606 1.802V3.333a.833.833 0 111.666 0v5c0 .46-.373.833-.833.833h-5a.833.833 0 010-1.666h3.308c-.577-.724-1.294-1.58-1.926-2.213a6.667 6.667 0 101.69 6.565.833.833 0 111.602.462A8.333 8.333 0 01.834 10z"
          clipRule="evenodd"
        />
      </g>
    </svg>
  );
}

export default RefreshDashboardIcon;
