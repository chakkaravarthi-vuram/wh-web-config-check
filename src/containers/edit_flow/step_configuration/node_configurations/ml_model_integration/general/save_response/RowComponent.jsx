import React from 'react';
import gClasses from 'scss/Typography.module.scss';
import cx from 'classnames';
import { SingleDropdown } from '@workhall-pvt-lmt/wh-ui-library';
import Trash from '../../../../../../../assets/icons/application/Trash';
import styles from './SaveResponse.module.scss';
import { EMPTY_STRING } from '../../../../../../../utils/strings/CommonStrings';

function RowComponent(props) {
    const { currentRow } = props;
    console.log('rowcomponentQueryParams', currentRow);
    return (
        <div className={cx(gClasses.CenterV, gClasses.Gap8)}>
          <div className={cx(styles.ColumnsFlex)}>
            <SingleDropdown
                optionList={[]}
                placeholder="Choose Response Key"
                dropdownViewProps={{
                  selectedLabel: 'Rating',
                }}
            />
          </div>
          <div className={cx(styles.ColumnsFlex)}>
            <SingleDropdown
                optionList={[]}
                dropdownViewProps={{
                  disabled: true,
                  selectedLabel: 'Number',
                }}
            />
          </div>
          <div className={cx(styles.ColumnsFlex)}>
          <SingleDropdown
              id="save_field"
              optionList={[]}
              dropdownViewProps={{
                selectedLabel: 'Rating',
              }}
              placeholder="Choose Field"
              selectedValue={EMPTY_STRING}
              errorMessage={EMPTY_STRING}
              showReset
          />
          </div>
          <div className={styles.DeleteIcon}>
            <Trash />
          </div>
        </div>
      );
}

export default RowComponent;
