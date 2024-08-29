import React from 'react';
import cx from 'classnames';
import styles from './TextStyling.module.scss';

function TextStyling(props) {
  const { componentDetails = {} } = props;
  const { color = '#fffff', component_info = {} } = componentDetails;

  return (
    <div
      style={{ backgroundColor: color }}
      className={cx('prose', styles.TextStyling)}
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: component_info?.formatter }}
    />
  );
}

export default TextStyling;
