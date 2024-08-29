import React from 'react';
import cx from 'classnames/bind';
import { Text } from '@workhall-pvt-lmt/wh-ui-library';
import gClasses from 'scss/Typography.module.scss';
import styles from './KeyValue.module.scss';
import FieldPicker from '../field_picker/FieldPicker';
import { FIELD_TYPE } from '../../../../../../utils/constants/form.constant';

function KeyValue(props) {
  const {
    currentRow = {},
    hideSecondColumn,
    additionalRowComponentProps = {},
    onChangeHandlers,
    path,
    errorList,
    parentDetails,
  } = props;

  const {
    keyObject: { key, isRequired },
  } = additionalRowComponentProps;

  console.log(
    'DefaultRowComponent',
    currentRow,
    hideSecondColumn,
    additionalRowComponentProps,
  );

  const isRequiredIcon = currentRow?.[isRequired] ? (
    <span className={styles.Required}>&nbsp;*</span>
  ) : null;

  return (
    <div className={gClasses.DisplayFlex}>
      <div className={cx(styles.InputColumn, gClasses.DisplayFlex)}>
        <Text content={currentRow?.[key]} />
        {isRequiredIcon}
      </div>
      <div className={cx(styles.OutputColumn, gClasses.MR16)}>
        <FieldPicker
          currentRow={currentRow}
          path={path}
          onChangeHandlers={onChangeHandlers}
          parentDetails={parentDetails}
          additionalRowComponentProps={{
            ...additionalRowComponentProps,
            childFieldDetails: {
              fieldType: FIELD_TYPE.SINGLE_LINE,
            },
            ignoreFieldTypes: [FIELD_TYPE.TABLE],
          }}
          errorList={errorList}
        />
      </div>
    </div>
  );
}

export default KeyValue;
