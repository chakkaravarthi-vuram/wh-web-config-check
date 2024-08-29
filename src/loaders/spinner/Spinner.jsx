import React from 'react';
import styles from './Spinner.module.scss';

function Spinner(props) {
  const { width = 24, height = 24 } = props;
  return (
    <div className={styles.SpinnerLoader} style={{ width, height }}>
      <div
        className={styles.SpinnerLoaderAnimation}
        style={{ width, height }}
      />
    </div>
  );
}

export default Spinner;
