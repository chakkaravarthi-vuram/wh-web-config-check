import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames/bind';
import jsUtils from '../../../utils/jsUtility';
import ThemeContext from '../../../hoc/ThemeContext';

import gClasses from '../../../scss/Typography.module.scss';
import { EMPTY_STRING } from '../../../utils/strings/CommonStrings';

function Link(props) {
  const colorCodes = useContext(ThemeContext);
  const { children, className, onClick, id, title, disabled } = props;
  const cursor = disabled ? gClasses.CursorNotAllowed : gClasses.CursorPointer;
  let buttonColor = null;
  if (!jsUtils.isEmpty(colorCodes)) ({ buttonColor } = colorCodes);
  return (
    <button
      id={id}
      className={cx(className, cursor, gClasses.ClickableElement)}
      style={{ color: buttonColor }}
      onClick={disabled ? () => {} : onClick}
      title={title}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
export default React.memo(Link);

Link.defaultProps = {
  className: EMPTY_STRING,
  id: EMPTY_STRING,
  onClick: null,
};

Link.propTypes = {
  className: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
    PropTypes.string,
  ]).isRequired,
  onClick: PropTypes.func,
  id: PropTypes.string,
};
