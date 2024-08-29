import React from 'react';
import cx from 'classnames/bind';

import Header from './Header';

import styles from './Rejected.module.scss';
import gClasses from '../../../../../scss/Typography.module.scss';
import Body from '../body/Body';

function Created(props) {
  const {
    index,
    isLoading,
    instanceSummary,
    instanceSummary: {
      isShow, task_name, closed_by, closed_on, translation_data, instanceBodyData, action_history,
    },
    onHeaderClick,
    isShowTaskDetails = false,
  } = props;

  const pref_locale = localStorage.getItem('application_language');
  const isCancelledBySendBack = (action_history?.action_type === 'cancelled_due_to_send_back');

  return (
    <div className={cx(`card ${styles.redBorderCard}`, gClasses.CursorPointer)}>
      <Header
        task_name={translation_data?.[pref_locale]?.task_name || task_name}
        onHeaderClick={onHeaderClick}
        isShow={isShow}
        index={index}
        closedBy={closed_by}
        closedOn={closed_on}
        className={!isShowTaskDetails && gClasses.CursorDefaultImp}
        cancellationComments={instanceSummary.comments}
        isCancelledBySendBack={isCancelledBySendBack}
      />

      {isShow && (
        <Body
          isLoading={isLoading}
          isShow={isShow ? 'show' : 'hide'}
          instanceBodyData={instanceBodyData}
        />
      )}
    </div>
  );
}

export default Created;
