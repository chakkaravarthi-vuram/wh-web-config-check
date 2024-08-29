import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames/bind';
import ThemeContext from '../../hoc/ThemeContext';

import styles from './Accordion.module.scss';
import { ARIA_ROLES, BS } from '../../utils/UIConstants';
import gClasses from '../../scss/Typography.module.scss';
import { EMPTY_STRING } from '../../utils/strings/CommonStrings';
import ChevronUp from '../../assets/icons/ChevronUp';

function Accordion(props) {
  const { primaryColor } = useContext(ThemeContext);
  const {
    id,
    children,
    headerText,
    onHeaderClick,
    isChildrenVisible,
    className,
    headerClassName,
    hideBorder,
    childrenClassName,
    childrenStyle,
    chevronLabel,
    headerContent,
    headerContentClassName,
    onIconClickHandler,
    iconClassName,
    iconContainerClassName,
    iconRotationBeforeClassName,
    iconRotationAfterClassName,
    hideIcon,
  } = props;
  const borderClass = !hideBorder && styles.Border;
  return (
    <div id={id} className={cx(styles.Container, borderClass, className)}>
      <button
        className={cx(
          styles.Header,
          gClasses.CenterV,
          BS.JC_BETWEEN,
          gClasses.ClickableElement,
          BS.W100,
          gClasses.CursorPointer,
          headerClassName,
        )}
        onClick={onHeaderClick}
        tabIndex={onHeaderClick ? 0 : -1}
      >
        <div className={cx(gClasses.FTwo13, headerContentClassName)} style={{ color: primaryColor }}>
          {headerContent || headerText}
        </div>
        {!hideIcon &&
          <button
            className={cx(BS.D_FLEX, gClasses.CenterV, gClasses.ClickableElement, iconContainerClassName)}
            onClick={onIconClickHandler}
          >
            {chevronLabel && (
              <div className={cx(gClasses.FOne11BlackV11, gClasses.Italics, gClasses.MR15)}>
                {chevronLabel}
              </div>
            )}
            <ChevronUp
              role={ARIA_ROLES.IMG}
              ariaLabel={isChildrenVisible ? 'Collapse' : 'Expand'}
              className={cx(iconClassName, (isChildrenVisible ? iconRotationAfterClassName || null : iconRotationBeforeClassName || gClasses.Rotate180))}
            />
          </button>
        }
      </button>
      <div
        className={cx(childrenClassName, isChildrenVisible ? styles.Content : BS.D_NONE)}
        style={childrenStyle}
      >
        {children}
      </div>
    </div>
  );
}

export default Accordion;
Accordion.defaultProps = {
  children: null,
  isChildrenVisible: false,
  className: EMPTY_STRING,
  headerClassName: EMPTY_STRING,
  headerContent: null,
  headerContentClassName: EMPTY_STRING,
  iconClassName: EMPTY_STRING,
  iconContainerClassName: EMPTY_STRING,
  onIconClickHandler: () => {},
};
Accordion.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
    PropTypes.string,
  ]),
  isChildrenVisible: PropTypes.bool,
  headerText: PropTypes.string.isRequired,
  onHeaderClick: PropTypes.func.isRequired,
  className: PropTypes.string,
  headerClassName: PropTypes.string,
  headerContent: PropTypes.element,
  headerContentClassName: PropTypes.string,
  iconClassName: PropTypes.string,
  iconContainerClassName: PropTypes.string,
  onIconClickHandler: PropTypes.func,
};
