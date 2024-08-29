import { Checkbox, ECheckboxSize, Size, TextInput } from '@workhall-pvt-lmt/wh-ui-library';
import React from 'react';
import { useTranslation } from 'react-i18next';
import gClasses from 'scss/Typography.module.scss';
import cx from 'classnames/bind';
import styles from '../ValidationConfiguration.module.scss';
import { VALIDATION_CONFIG_STRINGS } from '../ValidationConfiguration.strings';
import { getFieldValidationErrorMessage } from '../ValidationConfiguration.utils';
import { cloneDeep, isNaN } from '../../../../../../../utils/jsUtility';
import { RESPONSE_VALIDATION_KEYS } from '../../../../../../../utils/constants/form/form.constant';
import { FIELD_TYPES } from '../../../FieldConfiguration.strings';

function NumberValidationConfiguration(props) {
    const { setFieldDetails, fieldDetails = {} } = props;
    const { errorList = {} } = fieldDetails;
    const { t } = useTranslation();

    const onNumberFieldValidationChangeHandler = (value, id) => {
        const validationData = cloneDeep(fieldDetails?.[RESPONSE_VALIDATION_KEYS.VALIDATION_DATA]);
        const validationValue = parseInt(value, 10);
        if (isNaN(validationValue)) delete validationData[id];
        if (id === VALIDATION_CONFIG_STRINGS(t).ALLOWED_MINIMUM.ID) {
            if (validationValue > 0) {
                validationData.dontAllowZero = true;
            } else {
                validationData.dontAllowZero = false;
            }
        }
        setFieldDetails({
            ...fieldDetails,
            [RESPONSE_VALIDATION_KEYS.VALIDATION_DATA]: {
            ...validationData,
            ...(!isNaN(validationValue)) ?
            { [id]: validationValue } :
            {},
            },
        });
    };

    return (
    <>
        <div className={cx(gClasses.DisplayFlex, gClasses.JusSpaceBtw)}>
        <TextInput
            id={VALIDATION_CONFIG_STRINGS(t).ALLOWED_MINIMUM.ID}
            className={gClasses.FlexBasis45}
            placeholder={VALIDATION_CONFIG_STRINGS(t).ALLOWED_MINIMUM.PLACEHOLDER}
            labelText={VALIDATION_CONFIG_STRINGS(t).ALLOWED_MINIMUM.LABEL}
            type="number"
            onChange={(event) => {
                onNumberFieldValidationChangeHandler(event?.target?.value, event?.target?.id);
            }}
            value={fieldDetails?.[RESPONSE_VALIDATION_KEYS.VALIDATION_DATA]?.[RESPONSE_VALIDATION_KEYS[FIELD_TYPES.NUMBER].ALLOWED_MINIMUM]}
            errorMessage={getFieldValidationErrorMessage(errorList, VALIDATION_CONFIG_STRINGS(t).ALLOWED_MINIMUM.ID)}
            size={Size.lg}
            inputInnerClassName={styles.TextField}
        />
        <TextInput
            id={VALIDATION_CONFIG_STRINGS(t).ALLOWED_MAXIMUM.ID}
            className={gClasses.FlexBasis45}
            placeholder={VALIDATION_CONFIG_STRINGS(t).ALLOWED_MAXIMUM.PLACEHOLDER}
            labelText={VALIDATION_CONFIG_STRINGS(t).ALLOWED_MAXIMUM.LABEL}
            type="number"
            onChange={(event) => {
                onNumberFieldValidationChangeHandler(event?.target?.value, event?.target?.id);
            }}
            value={fieldDetails?.[RESPONSE_VALIDATION_KEYS.VALIDATION_DATA]?.[RESPONSE_VALIDATION_KEYS[FIELD_TYPES.NUMBER].ALLOWED_MAXIMUM]}
            errorMessage={getFieldValidationErrorMessage(errorList, VALIDATION_CONFIG_STRINGS(t).ALLOWED_MAXIMUM.ID)}
            inputInnerClassName={styles.TextField}
        />
        </div>
        <Checkbox
        className={cx(gClasses.MT16, gClasses.CenterV)}
        isValueSelected={fieldDetails?.[RESPONSE_VALIDATION_KEYS.VALIDATION_DATA]?.[RESPONSE_VALIDATION_KEYS[FIELD_TYPES.NUMBER].DONT_ALLOW_ZERO]}
        details={VALIDATION_CONFIG_STRINGS(t).DONT_ALLOW_ZERO.OPTION_LIST[0]}
        size={ECheckboxSize.SM}
        onClick={() =>
            setFieldDetails({
            ...fieldDetails,
            [RESPONSE_VALIDATION_KEYS.VALIDATION_DATA]: {
                ...fieldDetails?.[RESPONSE_VALIDATION_KEYS.VALIDATION_DATA] || {},
                [RESPONSE_VALIDATION_KEYS[FIELD_TYPES.NUMBER].DONT_ALLOW_ZERO]: !fieldDetails?.[RESPONSE_VALIDATION_KEYS.VALIDATION_DATA]?.[RESPONSE_VALIDATION_KEYS[FIELD_TYPES.NUMBER].DONT_ALLOW_ZERO],
            },
        })}
        checkboxViewLabelClassName={cx(gClasses.FTwo13BlackV20, gClasses.CheckboxClass, styles.CheckboxClass)}
        />
        {fieldDetails?.[RESPONSE_VALIDATION_KEYS[FIELD_TYPES.NUMBER].ALLOW_DECIMAL] &&
        <TextInput
            labelText={VALIDATION_CONFIG_STRINGS(t).ALLOWED_DECIMAL_POINTS.LABEL}
            className={gClasses.MT16}
            id={VALIDATION_CONFIG_STRINGS(t).ALLOWED_DECIMAL_POINTS.ID}
            placeholder={VALIDATION_CONFIG_STRINGS(t).ALLOWED_DECIMAL_POINTS.PLACEHOLDER}
            onChange={(event) => {
                onNumberFieldValidationChangeHandler(event?.target?.value, event?.target?.id);
            }}
            value={fieldDetails?.[RESPONSE_VALIDATION_KEYS.VALIDATION_DATA]?.[RESPONSE_VALIDATION_KEYS[FIELD_TYPES.NUMBER].ALLOWED_DECIMAL_POINTS]}
            errorMessage={getFieldValidationErrorMessage(errorList, VALIDATION_CONFIG_STRINGS(t).ALLOWED_DECIMAL_POINTS.ID)}
            size={Size.lg}
        />
        }
    </>
    );
}

  export default NumberValidationConfiguration;
