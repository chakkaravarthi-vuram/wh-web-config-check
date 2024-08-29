import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames/bind';

import { EMPTY_STRING } from '../../utils/strings/CommonStrings';
import gClasses from '../../scss/Typography.module.scss';

function ConcentricCircles(props) {
  const { className, innerClassName, color, children, borderWidth } = props;
  return (
    <div
      className={cx(className, gClasses.CenterVH)}
      style={{ border: `${borderWidth}px solid${color}` }}
    >
      <div className={cx(innerClassName, gClasses.CenterVH)} style={{ backgroundColor: color }}>
        {children}
      </div>
    </div>
  );
}
export default ConcentricCircles;
ConcentricCircles.defaultProps = {
  className: EMPTY_STRING,
  innerClassName: EMPTY_STRING,
  color: EMPTY_STRING,
  children: null,
  borderWidth: 1,
};
ConcentricCircles.propTypes = {
  className: PropTypes.string,
  innerClassName: PropTypes.string,
  color: PropTypes.string,
  children: PropTypes.node,
  borderWidth: PropTypes.number,
};
