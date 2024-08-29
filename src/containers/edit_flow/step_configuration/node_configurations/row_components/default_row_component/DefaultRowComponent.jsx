import React, { useState } from 'react';
import cx from 'classnames/bind';
import {
  Input,
  SingleDropdown,
  Size,
  Text,
} from '@workhall-pvt-lmt/wh-ui-library';
import gClasses from 'scss/Typography.module.scss';
import { EMPTY_STRING } from 'utils/strings/CommonStrings';
import styles from './DefaultRowComponent.module.scss';

function DefaultRowComponent(props) {
  const { isDynamicFirstColumn, currentRow = {}, hideSecondColumn } = props;

  const [valueType, setValueType] = useState('flow_field');

  console.log('DefaultRowComponent', currentRow, hideSecondColumn, isDynamicFirstColumn);

  return (
    <div className={gClasses.DisplayFlex}>
      {isDynamicFirstColumn ? (
        <div
          className={cx(
            styles.ValueContainer,
            gClasses.DisplayFlex,
            gClasses.AlignCenter,
            styles.FirstColumn,
            gClasses.MR16,
          )}
        >
          <SingleDropdown
            optionList={[
              {
                label: 'User defined fields',
                value: 'user_fields',
              },
              {
                label: 'System fields',
                value: 'system_fields',
              },
              {
                label: 'Static value',
                value: 'static_value',
              },
            ]}
            dropdownViewProps={{
              size: Size.md,
            }}
            onClick={(value) => setValueType(value)}
            selectedValue={valueType}
            errorMessage={EMPTY_STRING}
            className={styles.ValueTypeFlex}
          />
          {valueType !== 'static_value' ? (
            <SingleDropdown
              optionList={[
                {
                  label: 'Field1',
                  value: 'uuid',
                },
              ]}
              dropdownViewProps={{
                size: Size.md,
              }}
              onClick={null}
              selectedValue={EMPTY_STRING}
              errorMessage={EMPTY_STRING}
              showReset
              className={styles.ValueFlex}
            />
          ) : (
            <Input
              size={Size.md}
              content={EMPTY_STRING}
              placeholder="Enter static value"
              className={cx(styles.ValueFlex, gClasses.W100)}
            />
          )}
        </div>
      ) : (
        <div className={cx(styles.SecondColumn, gClasses.MR16)}>
          <Text content="pathname 1" />
        </div>
      )}

      <div className={cx(styles.SecondColumn, gClasses.MR16)}>
        <Text content="Single Line Text" />
      </div>
      <div
        className={cx(
          styles.ValueContainer,
          gClasses.DisplayFlex,
          gClasses.AlignCenter,
          styles.ThirdColumn,
          gClasses.MR16,
        )}
      >
        <SingleDropdown
          optionList={[
            {
              label: 'User defined fields',
              value: 'user_fields',
            },
            {
              label: 'System fields',
              value: 'system_fields',
            },
            {
              label: 'Static value',
              value: 'static_value',
            },
          ]}
          dropdownViewProps={{
            size: Size.md,
          }}
          onClick={(value) => setValueType(value)}
          selectedValue={valueType}
          errorMessage={EMPTY_STRING}
          className={styles.ValueTypeFlex}
        />
        {valueType !== 'static_value' ? (
          <SingleDropdown
            optionList={[
              {
                label: 'Field1',
                value: 'uuid',
              },
            ]}
            dropdownViewProps={{
              size: Size.md,
            }}
            onClick={null}
            selectedValue={EMPTY_STRING}
            errorMessage={EMPTY_STRING}
            showReset
            className={styles.ValueFlex}
          />
        ) : (
          <Input
            size={Size.md}
            content={EMPTY_STRING}
            placeholder="Enter static value"
            className={cx(styles.ValueFlex, gClasses.W100)}
          />
        )}
      </div>
    </div>
  );
}

export default DefaultRowComponent;
