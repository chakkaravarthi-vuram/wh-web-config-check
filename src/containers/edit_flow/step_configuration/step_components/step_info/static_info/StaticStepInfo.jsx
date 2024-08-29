import React from 'react';
import FormTitle, { FORM_TITLE_TYPES } from 'components/form_components/form_title/FormTitle';
import cx from 'classnames/bind';
import gClasses from 'scss/Typography.module.scss';
import styles from './StaticStepInfo.module.scss';

function StaticStepInfo(props) {
    const {
        list,
        sectionTitle,
    } = props;

    let stepConfigInfo = null;
    stepConfigInfo = list.map((field) => (
        <div className={styles.StepInfoField}>
          <div className={cx(gClasses.FieldName, gClasses.MB5)}>
            {field.title}
          </div>
          <div className={gClasses.FTwo13GrayV3}>
            {field.description}
          </div>
        </div>
      ));
    return (
        <>
          <div className={styles.StepInfoHeader}>
            <FormTitle type={FORM_TITLE_TYPES.TYPE_4}>
              {sectionTitle}
            </FormTitle>
          </div>
          <div className={styles.StepConfigInfo}>
            {stepConfigInfo}
          </div>
        </>
    );
}

export default StaticStepInfo;
