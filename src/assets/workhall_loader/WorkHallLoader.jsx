import React from 'react';

import styles from './WorkHallLoader.module.scss';

export default function WorkHallLoader(props) {
  const { color = '#217cf5' } = props;
  return (
    <div id="workhall-loader" className={styles.WorkHallLoader} style={{ color: color }}>
    <div id="workhall-loader" className={styles.loader} />
    </div>
  );
}
