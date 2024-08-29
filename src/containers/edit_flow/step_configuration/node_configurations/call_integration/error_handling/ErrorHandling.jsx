import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  CheckboxGroup,
  Text,
  RadioGroupLayout,
  RadioSize,
  RadioGroup,
  InputDropdown,
} from '@workhall-pvt-lmt/wh-ui-library';
import cx from 'classnames/bind';
import { set, get } from 'utils/jsUtility';
import {
  CALL_INTEGRATION_STRINGS,
  getRetryOptions,
} from '../CallIntegration.strings';
import gClasses from '../../../../../../scss/Typography.module.scss';
import styles from './ErrorHandling.module.scss';
import { EMPTY_STRING } from '../../../../../../utils/strings/CommonStrings';
import { cloneDeep } from '../../../../../../utils/jsUtility';
import {
  CALL_INTEGRATION_CONSTANTS,
  RESPONSE_FIELD_KEYS,
} from '../CallIntegration.constants';
import {
  nodeConfigDataChange,
  useFlowNodeConfig,
} from '../../../../node_configuration/use_node_reducer/useNodeReducer';
import { SPECIFIED_DROPDOWN_OPTIONS } from '../../wait_step/WaitStepConfig.strings';
import { DURATION_TYPE_VALUE } from '../../wait_step/WaitStepConfig.constants';
import { deleteErrorListWithId } from '../CallIntegration.utils';

function ErrorHandling() {
  const { t } = useTranslation();
  const { ERROR_HANDLING } = CALL_INTEGRATION_STRINGS(t);
  const { RETRY, ERROR_PATH } = ERROR_HANDLING;
  const { RETRY_OPTIONS, DURATION_MINUTE_TYPE } = CALL_INTEGRATION_CONSTANTS;

  const { state, dispatch } = useFlowNodeConfig();

  const { retryAttempts, errorActions, retryOptions, errorList = {} } = state;

  const handleRetryAttemptChange = (event, index) => {
    const {
      target: { value },
    } = event;

    const clonedAttempts = cloneDeep(retryAttempts);

    set(clonedAttempts, [index, RESPONSE_FIELD_KEYS.RETRY_DURATION], value);
    set(
      clonedAttempts,
      [index, RESPONSE_FIELD_KEYS.RETRY_DURATION_TYPE],
      DURATION_MINUTE_TYPE,
    );

    const modifiedErrorList = deleteErrorListWithId(errorList, [
      `${RESPONSE_FIELD_KEYS.RETRY_ATTEMPTS},${index},${RESPONSE_FIELD_KEYS.RETRY_DURATION}`,
    ]);

    dispatch(
      nodeConfigDataChange({
        retryAttempts: clonedAttempts,
        errorList: modifiedErrorList,
      }),
    );
  };

  const handleErrorActionChange = (value) => {
    dispatch(
      nodeConfigDataChange({
        errorActions: value,
      }),
    );
  };

  const getRetryOptionsList = (retryOptions) =>
    getRetryOptions(t, retryOptions)?.map((eachOption, index) => {
      switch (eachOption?.value) {
        case RETRY_OPTIONS.FIRST_RETRY:
          return {
            ...eachOption,
            ...(retryOptions.includes(eachOption?.value) && {
              children: (
                <InputDropdown
                  className={cx(gClasses.ML18, styles.SpecifiedMaxWidth)}
                  reverseLayout
                  optionList={SPECIFIED_DROPDOWN_OPTIONS(t)}
                  dropdownViewClass={cx(styles.InputDropDownMaxWidth, gClasses.DisabledFieldV2)}
                  inputValue={get(retryAttempts, [
                    eachOption?.value,
                    RESPONSE_FIELD_KEYS.RETRY_DURATION,
                  ])}
                  selectedValue={DURATION_TYPE_VALUE.MINUTE}
                  onInputChange={(event) =>
                    handleRetryAttemptChange(event, eachOption?.value)
                  }
                  selectedLabel={SPECIFIED_DROPDOWN_OPTIONS(t)[2].label}
                  placeholder="00"
                  errorMessage={
                    errorList[
                      `${RESPONSE_FIELD_KEYS.RETRY_ATTEMPTS},${index},${RESPONSE_FIELD_KEYS.RETRY_DURATION}`
                    ]
                  }
                />
              ),
            }),
          };
        case RETRY_OPTIONS.SECOND_RETRY:
          return {
            ...eachOption,
            ...(retryOptions.includes(eachOption?.value) && {
              children: (
                <InputDropdown
                  className={cx(gClasses.ML18, styles.SpecifiedMaxWidth)}
                  reverseLayout
                  optionList={SPECIFIED_DROPDOWN_OPTIONS(t)}
                  dropdownViewClass={cx(styles.InputDropDownMaxWidth, gClasses.DisabledFieldV2)}
                  inputValue={get(retryAttempts, [
                    eachOption?.value,
                    RESPONSE_FIELD_KEYS.RETRY_DURATION,
                  ])}
                  selectedValue={DURATION_TYPE_VALUE.MINUTE}
                  onInputChange={(event) =>
                    handleRetryAttemptChange(event, eachOption?.value)
                  }
                  selectedLabel={SPECIFIED_DROPDOWN_OPTIONS(t)[2].label}
                  placeholder="00"
                  errorMessage={
                    errorList[
                      `${RESPONSE_FIELD_KEYS.RETRY_ATTEMPTS},${index},${RESPONSE_FIELD_KEYS.RETRY_DURATION}`
                    ]
                  }
                />
              ),
            }),
          };
        case RETRY_OPTIONS.THIRD_RETRY:
          return {
            ...eachOption,
            ...(retryOptions.includes(eachOption?.value) && {
              children: (
                <InputDropdown
                  className={cx(gClasses.ML18, styles.SpecifiedMaxWidth)}
                  reverseLayout
                  optionList={SPECIFIED_DROPDOWN_OPTIONS(t)}
                  dropdownViewClass={cx(styles.InputDropDownMaxWidth, gClasses.DisabledFieldV2)}
                  inputValue={get(retryAttempts, [
                    eachOption?.value,
                    RESPONSE_FIELD_KEYS.RETRY_DURATION,
                  ])}
                  selectedValue={DURATION_TYPE_VALUE.MINUTE}
                  onInputChange={(event) =>
                    handleRetryAttemptChange(event, eachOption?.value)
                  }
                  selectedLabel={SPECIFIED_DROPDOWN_OPTIONS(t)[2].label}
                  placeholder="00"
                  errorMessage={
                    errorList[
                      `${RESPONSE_FIELD_KEYS.RETRY_ATTEMPTS},${index},${RESPONSE_FIELD_KEYS.RETRY_DURATION}`
                    ]
                  }
                />
              ),
            }),
          };
        default:
          return eachOption;
      }
    });

  const changeRetryOptions = (value) => {
    let clonedRetryOptions = cloneDeep(retryOptions);
    let clonedRetryAttempts = cloneDeep(retryAttempts);
    if (!clonedRetryOptions?.includes(value)) clonedRetryOptions.push(value);
    else {
      const selectedIndex = clonedRetryOptions?.findIndex(
        (eachValue) => eachValue === value,
      );
      clonedRetryOptions = clonedRetryOptions.slice(0, selectedIndex);
      clonedRetryAttempts = clonedRetryAttempts?.map((eachAttempt, index) => {
        if (!clonedRetryOptions?.includes(index)) {
          return {
            ...eachAttempt,
            [RESPONSE_FIELD_KEYS.RETRY_DURATION]: EMPTY_STRING,
          };
        }
        return eachAttempt;
      });
    }
    dispatch(
      nodeConfigDataChange({
        retryOptions: clonedRetryOptions,
        retryAttempts: clonedRetryAttempts,
      }),
    );
  };

  return (
    <div>
      <Text
        className={cx(gClasses.FontWeight500, gClasses.FTwo16GrayV3)}
        content={RETRY.TITLE}
      />
      <CheckboxGroup
        labelText={RETRY.LABEL}
        options={getRetryOptionsList(retryOptions)}
        onClick={changeRetryOptions}
        layout={RadioGroupLayout.stack}
        className={gClasses.MT12}
        labelClassName={cx(styles.RetryLabel, gClasses.MB6)}
        checkboxGroupClassName={styles.RetryOptions}
        checkboxViewLabelClassName={styles.EachOption}
      />
      <Text
        className={cx(
          gClasses.FontWeight500,
          gClasses.FTwo16GrayV3,
          gClasses.MT28,
        )}
        content={ERROR_PATH.TITLE}
      />
      <RadioGroup
        labelText={ERROR_PATH.LABEL}
        selectedValue={errorActions}
        options={ERROR_PATH.OPTIONS}
        onChange={(_event, _id, value) => handleErrorActionChange(value)}
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
