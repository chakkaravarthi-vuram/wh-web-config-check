import React from 'react';
import cx from 'classnames/bind';
import PropTypes from 'prop-types';

import styles from './TypingBubble.module.scss';
import gClasses from '../../../scss/Typography.module.scss';

function TypingBubble(props) {
  const { name } = props;
  return (
    <div className={cx(gClasses.CenterV, gClasses.MB10, gClasses.MT10)}>
      <div className={styles.Dot} />
      <div className={styles.Dot} />
      <div className={styles.Dot} />
      <div className={cx(gClasses.FTwo10GrayV53, gClasses.ML5)}>{`${name} is typing`}</div>
    </div>
  );
}

TypingBubble.defaultProps = {};
TypingBubble.propTypes = {
  data: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default TypingBubble;
