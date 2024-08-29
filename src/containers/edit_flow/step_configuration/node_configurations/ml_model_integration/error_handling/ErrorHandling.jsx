import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CheckboxGroup, Text, RadioGroupLayout, RadioSize, Input, Size, RadioGroup } from '@workhall-pvt-lmt/wh-ui-library';
import cx from 'classnames/bind';
import gClasses from '../../../../../../scss/Typography.module.scss';
import styles from './ErrorHandling.module.scss';
import { EMPTY_STRING } from '../../../../../../utils/strings/CommonStrings';
import { cloneDeep } from '../../../../../../utils/jsUtility';
import { ML_MODEL_INTEGRATION_STRINGS, RETRY_OPTIONS } from '../MLModelIntegration.strings';

function ErrorHandling() {
    const { t } = useTranslation();
    const { ERROR_HANDLING } = ML_MODEL_INTEGRATION_STRINGS(t);
    const { RETRY, ERROR_PATH } = ERROR_HANDLING;

    const [retryOptions, setRetryOptions] = useState([]);
    const [errorPath, setErrorPath] = useState(ERROR_PATH.OPTIONS[0].value);

    const getRetryOptions = (retryOptions) => {
        console.log('retry options', retryOptions);
        return RETRY_OPTIONS(t, retryOptions)?.map((eachOption) => {
            switch (eachOption?.value) {
                case RETRY_OPTIONS(t, [])?.[0]?.value:
                    return {
                        ...eachOption,
                        ...retryOptions.includes(eachOption?.value) && {
                            children: (
                                <Input
                                    size={Size.sm}
                                    placeholder="00 min"
                                    content={EMPTY_STRING}
                                    onChange={null}
                                    className={gClasses.ML18}
                                />
                            ),
                        },
                    };
                case RETRY_OPTIONS(t, [])?.[1]?.value:
                    return {
                        ...eachOption,
                        ...retryOptions.includes(eachOption?.value) && {
                            children: (
                                <Input
                                    size={Size.sm}
                                    placeholder="00 min"
                                    content={EMPTY_STRING}
                                    onChange={null}
                                    className={gClasses.ML18}
                                />
                            ),
                        },
                    };
                case RETRY_OPTIONS(t, [])?.[2]?.value:
                    return {
                        ...eachOption,
                        ...retryOptions.includes(eachOption?.value) && {
                            children: (
                                <Input
                                    size={Size.sm}
                                    placeholder="00 min"
                                    content={EMPTY_STRING}
                                    onChange={null}
                                    className={gClasses.ML18}
                                />
                            ),
                        },
                    };
                default: return eachOption;
            }
        });
    };

    const changeRetryOptions = (value) => {
        let clonedRetryOpions = cloneDeep(retryOptions);
        if (!clonedRetryOpions?.includes(value)) clonedRetryOpions.push(value);
        else {
            const selectedIndex = clonedRetryOpions?.findIndex((eachValue) => eachValue === value);
            clonedRetryOpions = clonedRetryOpions.slice(0, selectedIndex).concat(clonedRetryOpions.slice(selectedIndex + 1));
        }
        setRetryOptions(clonedRetryOpions);
    };

    return (
        <div>
            <Text
                className={cx(gClasses.FontWeight500, gClasses.FTwo16GrayV3)}
                content={RETRY.TITLE}
            />
            <CheckboxGroup
                labelText={RETRY.LABEL}
                options={getRetryOptions(retryOptions)}
                onClick={changeRetryOptions}
                layout={RadioGroupLayout.stack}
                className={gClasses.MT12}
                labelClassName={cx(styles.RetryLabel, gClasses.MB6)}
                checkboxGroupClassName={styles.RetryOptions}
                checkboxViewLabelClassName={styles.EachOption}
            />
            <Text
                className={cx(gClasses.FontWeight500, gClasses.FTwo16GrayV3, gClasses.MT28)}
                content={ERROR_PATH.TITLE}
            />
            <RadioGroup
                labelText={ERROR_PATH.LABEL}
                selectedValue={errorPath}
                options={ERROR_PATH.OPTIONS}
                onChange={(_event, _id, value) => setErrorPath(value)}
                layout={RadioGroupLayout.stack}
                errorMessage={EMPTY_STRING}
                required
                className={gClasses.MT8}
                labelClassName={cx(styles.RetryLabel, gClasses.MB6)}
                optionLabelClass={styles.EachOption}
                size={RadioSize.lg}
            />
        </div>
    );
}

export default ErrorHandling;
