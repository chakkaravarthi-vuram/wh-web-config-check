import React from 'react';
import gClasses from 'scss/Typography.module.scss';
import styles from './SendBack.module.scss';
import Header from './Header';
import Body from '../body/Body';

function Created(props) {
  const {
    isLoading,
    index,
    instanceSummary: {
      isShow,
      task_name,
      instanceBodyData,
      closed_by,
      closed_on,
      translation_data,
    },
    isFirstStep,
    onHeaderClick,
    isShowTaskDetails = false,
  } = props;
  return (
    <div className={`card ${!isFirstStep ? styles.yellowborderCard : styles.firstyellowborderCard}`}>
      <Header
        task_name={task_name}
        translation_data={translation_data}
        onHeaderClick={onHeaderClick}
        isShow={isShow}
        index={index}
        closedBy={closed_by}
        closedOn={closed_on}
        isFirstStep={isFirstStep}
        className={!isShowTaskDetails && gClasses.CursorDefaultImp}
      />
      {
        isShow && (
          <Body
            isLoading={isLoading}
            isShow={isShow ? 'show' : 'hide'}
            instanceBodyData={instanceBodyData}
            translation_data={translation_data}
          />
        )
      }
    </div>
  );
}

export default Created;
