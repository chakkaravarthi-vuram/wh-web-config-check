import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames/bind';
import Skeleton from 'react-loading-skeleton';
import ThemeContext from '../../hoc/ThemeContext';

import styles from './Icons.module.scss';
import gClasses from '../../scss/Typography.module.scss';

function CustomFilterIcon(props) {
  const { className, onClick, style, title, isDataLoading } = props;
  const { buttonColor } = useContext(ThemeContext);

  return isDataLoading ? (
    <Skeleton height={32} width={32} />
  ) : (
    <button
      className={cx(
        styles.CustomFilterIconContainer,
        gClasses.CenterVH,
        gClasses.CursorPointer,
        gClasses.ClickableElement,
        className,
      )}
      onClick={onClick}
      id="custom_filter_icon"
      style={{ borderColor: buttonColor }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="13"
        height="14"
        viewBox="0 0 13 14"
        style={({ ...style }, { fill: buttonColor })}
        className={styles.CustomFilterIcon}
      >
        <title>{title}</title>
        <path
          fillRule="nonzero"
          d="M3.56 6.423v4.927c0 .52.309.991.797 1.203l3.252 1.35a1.325 1.325 0 0 0 1.22-.114c.357-.244.568-.65.568-1.074V6.423l3.236-4.065a1.418 1.418 0 0 0 .18-1.529C12.583.31 12.08 0 11.51 0H1.463C.893 0 .389.309.145.83a1.418 1.418 0 0 0 .18 1.528L3.56 6.423zm6.91-4.472L7.87 5.236a1.85 1.85 0 0 0-.406 1.154v5.334L5.51 10.91V6.39c0-.424-.146-.83-.406-1.155L2.503 1.95h7.968z"
        />
      </svg>
    </button>
  );
}
export default CustomFilterIcon;
CustomFilterIcon.defaultProps = {
  className: null,
  onClick: null,
  style: null,
  title: null,
  isDataLoading: false,
};
CustomFilterIcon.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  style: PropTypes.objectOf(PropTypes.any),
  title: PropTypes.string,
  isDataLoading: PropTypes.bool,
};
