import React from 'react';
import { RadioGroup, RadioGroupLayout, RadioSize } from '@workhall-pvt-lmt/wh-ui-library';
import cx from 'classnames/bind';
import gClasses from '../../../../../scss/Typography.module.scss';

function Reassigntask(props) {
    const {
    optionList,
    onSelecthandler,
    selectedData,
    defaultValueError,
    } = props;
    return (
      <div className={cx(gClasses.PT16, gClasses.MLN4)}>
        <RadioGroup
            options={optionList}
            onChange={(_event, _id, value) => onSelecthandler(value)}
            selectedValue={selectedData}
            errorMessage={defaultValueError}
            isRequired
            layout={RadioGroupLayout.RadioGroupLayout}
            size={RadioSize.lg}
        />
      </div>
    );
}

export default Reassigntask;
