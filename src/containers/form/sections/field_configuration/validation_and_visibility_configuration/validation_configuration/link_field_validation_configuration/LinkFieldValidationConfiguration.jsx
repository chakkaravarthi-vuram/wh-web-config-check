import { Size, TextInput } from '@workhall-pvt-lmt/wh-ui-library';
import React from 'react';
import { useTranslation } from 'react-i18next';
import gClasses from 'scss/Typography.module.scss';
import cx from 'classnames/bind';
import PropTypes from 'prop-types';
import styles from '../ValidationConfiguration.module.scss';
import { VALIDATION_CONFIG_STRINGS } from '../ValidationConfiguration.strings';
import { getFieldValidationErrorMessage } from '../ValidationConfiguration.utils';
import { cloneDeep, isNaN } from '../../../../../../../utils/jsUtility';
import { RESPONSE_FIELD_KEYS, RESPONSE_VALIDATION_KEYS } from '../../../../../../../utils/constants/form/form.constant';
import { FIELD_TYPES } from '../../../FieldConfiguration.strings';
import { getSharedPropertyWarningText } from '../../../FieldConfiguration.utils';

function LinkFieldValidationConfiguration(props) {
    const { setFieldDetails, fieldDetails = {} } = props;
    const { errorList = {} } = fieldDetails;
    const { t } = useTranslation();

    const onLinkFieldValidationChangeHandler = (value, id) => {
        if (value.includes('-') || value.includes('+')) return;
        const validationData = cloneDeep(fieldDetails?.[RESPONSE_VALIDATION_KEYS.VALIDATION_DATA]);
        const validationValue = parseInt(value, 10);
        if (isNaN(validationValue)) delete validationData[id];
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
        {fieldDetails[RESPONSE_FIELD_KEYS.FORM_COUNT] > 1 && getSharedPropertyWarningText()}
        {fieldDetails?.[RESPONSE_VALIDATION_KEYS[FIELD_TYPES.LINK].IS_MULTIPLE] ?
        <div className={cx(gClasses.DisplayFlex, gClasses.JusSpaceBtw, gClasses.MT16)}>
            <TextInput
            id={VALIDATION_CONFIG_STRINGS(t).ALLOWED_MINIMUM_LINK_COUNT.ID}
            className={gClasses.FlexBasis45}
            placeholder={VALIDATION_CONFIG_STRINGS(t).ALLOWED_MINIMUM_LINK_COUNT.PLACEHOLDER}
            labelText={VALIDATION_CONFIG_STRINGS(t).ALLOWED_MINIMUM_LINK_COUNT.LABEL}
            onChange={(event) => {
                onLinkFieldValidationChangeHandler(event?.target?.value, event?.target?.id);
            }}
            value={fieldDetails?.[RESPONSE_VALIDATION_KEYS.VALIDATION_DATA]?.[RESPONSE_VALIDATION_KEYS[FIELD_TYPES.LINK].MINIMUM_COUNT]}
            errorMessage={getFieldValidationErrorMessage(errorList, VALIDATION_CONFIG_STRINGS(t).ALLOWED_MINIMUM_LINK_COUNT.ID)}
            size={Size.lg}
            inputInnerClassName={styles.TextField}
            />
            <TextInput
            id={VALIDATION_CONFIG_STRINGS(t).ALLOWED_MAXIMUM_LINK_COUNT.ID}
            className={gClasses.FlexBasis45}
            placeholder={VALIDATION_CONFIG_STRINGS(t).ALLOWED_MAXIMUM_LINK_COUNT.PLACEHOLDER}
            labelText={VALIDATION_CONFIG_STRINGS(t).ALLOWED_MAXIMUM_LINK_COUNT.LABEL}
            onChange={(event) => {
                onLinkFieldValidationChangeHandler(event?.target?.value, event?.target?.id);
            }}
            value={fieldDetails?.[RESPONSE_VALIDATION_KEYS.VALIDATION_DATA]?.[RESPONSE_VALIDATION_KEYS[FIELD_TYPES.LINK].MAXIMUM_COUNT]}
            errorMessage={getFieldValidationErrorMessage(errorList, VALIDATION_CONFIG_STRINGS(t).ALLOWED_MAXIMUM_LINK_COUNT.ID)}
            inputInnerClassName={styles.TextField}
            />
        </div> : <div>NA</div>}
    </>
    );
}

export default LinkFieldValidationConfiguration;

LinkFieldValidationConfiguration.propTypes = {
    fieldDetails: PropTypes.object,
    setFieldDetails: PropTypes.func,
};
