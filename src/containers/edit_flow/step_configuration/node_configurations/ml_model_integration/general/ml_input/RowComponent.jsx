import React from 'react';
import gClasses from 'scss/Typography.module.scss';
import cx from 'classnames';
import { Text } from '@workhall-pvt-lmt/wh-ui-library';
import styles from './MLInput.module.scss';
import NestedComponent from './NestedComponent';

function RowComponent(props) {
    const { currentRow } = props;
    console.log('rowcomponent', currentRow);
    return (
        <div className={cx(gClasses.CenterV, gClasses.W100, gClasses.Gap8)}>
          <div className={cx(styles.ParamNameFlex)}>
            <Text content={currentRow?.key} fontClass={gClasses.FTwo13GrayV89} />
          </div>
          <div className={cx(styles.TypeFlex)}>
            <Text content={currentRow?.fieldType} fontClass={gClasses.FTwo13GrayV89} />
          </div>
          <div className={cx(styles.ValueNameFlex)}>
            <NestedComponent />
          </div>
        </div>
      );
}

export default RowComponent;
