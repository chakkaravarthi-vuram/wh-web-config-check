import React, { useState } from 'react';
import cx from 'classnames/bind';
import { Input, SingleDropdown, Size } from '@workhall-pvt-lmt/wh-ui-library';
import styles from './MLInput.module.scss';
import gClasses from '../../../../../../../scss/Typography.module.scss';
import { EMPTY_STRING } from '../../../../../../../utils/strings/CommonStrings';

function NestedComponent() {
    console.log('nestedcompnent');
    const [valueType, setValueType] = useState('flow_field');

    return (
        <div className={cx(styles.ValueContainer, gClasses.DisplayFlex, gClasses.AlignCenter)}>
            <SingleDropdown
                id="external_system"
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
                    // selectedLabel: 'Flow fields',
                }}
                onClick={(value) => setValueType(value)}
                selectedValue={valueType}
                errorMessage={EMPTY_STRING}
                // showReset
                className={styles.ValueTypeFlex}
            />
            {valueType !== 'static_value' ?
                (
                    <SingleDropdown
                        id="fields"
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
                        placeholder="Choose flow field"
                    />
                ) :
                (
                    <Input
                        size={Size.md}
                        content={EMPTY_STRING}
                        placeholder="Enter static value"
                        className={cx(styles.ValueFlex, gClasses.W100)}
                    />
                )}
        </div>
    );
}

export default NestedComponent;
