import React from 'react';
import cx from 'classnames/bind';

import Header from './Header';

import styles from './NotStarted.module.scss';
import gClasses from '../../../../../scss/Typography.module.scss';

function NotStarted(props) {
  const {
    index,
    instanceSummary: { step_name, translation_data },
  } = props;

  const pref_locale = localStorage.getItem('application_language');

  return (
    <div className={cx(`card ${styles.grayborderCard}`, gClasses.CursorDefault)}>
      <Header
        index={index}
        task_name={translation_data?.[pref_locale]?.step_name || translation_data?.[pref_locale]?.task_name || step_name}
      />
    </div>
  );
}

export default NotStarted;
