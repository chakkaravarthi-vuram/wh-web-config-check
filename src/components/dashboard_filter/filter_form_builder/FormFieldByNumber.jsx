import React from 'react';
import { useTranslation } from 'react-i18next';
import cx from 'classnames/bind';
import propTypes from 'prop-types';
import {
  TextInput,
  Title,
  ETitleHeadingLevel,
  RadioGroup,
  RadioGroupLayout,
} from '@workhall-pvt-lmt/wh-ui-library';
import CloseIcon from 'assets/icons/CloseIcon';
import { keydownOrKeypessEnterHandle } from 'utils/UtilityFunctions';
import styles from '../Filter.module.scss';
import { ARIA_ROLES, BS, INPUT_TYPES } from '../../../utils/UIConstants';
import gClasses from '../../../scss/Typography.module.scss';
import FILTER_STRINGS from '../Filter.strings';
import jsUtility from '../../../utils/jsUtility';

function FormFieldByNumber(props) {
  const { t } = useTranslation();
  const {
    title,
    fieldUpdateValue,
    selectedOperator,
    fieldUpdateBetweenOne,
    fieldUpdateBetweenTwo,
    onOperatorInput,
    onChangeNumber,
    onChangeNumberBetween,
    isFromMoreFilter,
    onCloseCover,
    error,
  } = props;

  const {
    FIELDS: { NUMBER },
  } = FILTER_STRINGS(t);

  let fieldUpdateBetweenOneError = !fieldUpdateBetweenOne && error;
  let fieldUpdateBetweenTwoError = !fieldUpdateBetweenTwo && error;
  if (jsUtility.isArray(error)) {
    [fieldUpdateBetweenOneError, fieldUpdateBetweenTwoError] = error;
  }

  const RD_GROUP = {
    OPTION_LIST: [
      {
        value: NUMBER.EQUAL.TYPE,
        label: NUMBER.EQUAL.LABEL,
        customElement: (
          <TextInput
            placeholder={title}
            type={INPUT_TYPES.NUMBER}
            onChange={onChangeNumber}
            value={fieldUpdateValue}
            errorMessage={error}
          />
        ),
      },
      {
        value: NUMBER.BETWEEN.TYPE,
        label: NUMBER.BETWEEN.LABEL,
        customElement: (
          <div className={cx(BS.D_FLEX, gClasses.Gap8)}>
            <TextInput
              placeholder={title}
              type={INPUT_TYPES.NUMBER}
              onChange={(event) => onChangeNumberBetween(event, 0)}
              value={fieldUpdateBetweenOne}
              errorMessage={fieldUpdateBetweenOneError}
            />
            <TextInput
              placeholder={title}
              type={INPUT_TYPES.NUMBER}
              onChange={(event) => onChangeNumberBetween(event, 1)}
              value={fieldUpdateBetweenTwo}
              errorMessage={fieldUpdateBetweenTwoError}
            />
          </div>
        ),
      },
      {
        value: NUMBER.GREATER_THAN.TYPE,
        label: NUMBER.GREATER_THAN.LABEL,
        customElement: (
          <TextInput
            placeholder={title}
            type={INPUT_TYPES.NUMBER}
            onChange={onChangeNumber}
            value={fieldUpdateValue}
            errorMessage={error}
          />
        ),
      },
      {
        value: NUMBER.GREATER_THAN_EQUALS_TO.TYPE,
        label: NUMBER.GREATER_THAN_EQUALS_TO.LABEL,
        customElement: (
          <TextInput
            placeholder={title}
            type={INPUT_TYPES.NUMBER}
            onChange={onChangeNumber}
            value={fieldUpdateValue}
            errorMessage={error}
          />
        ),
      },
      {
        value: NUMBER.LESS_THAN.TYPE,
        label: NUMBER.LESS_THAN.LABEL,
        customElement: (
          <TextInput
            placeholder={title}
            type={INPUT_TYPES.NUMBER}
            onChange={onChangeNumber}
            value={fieldUpdateValue}
            errorMessage={error}
          />
        ),
      },
      {
        value: NUMBER.LESS_THAN_EQUALS_TO.TYPE,
        label: NUMBER.LESS_THAN_EQUALS_TO.LABEL,
        customElement: (
          <TextInput
            placeholder={title}
            type={INPUT_TYPES.NUMBER}
            onChange={onChangeNumber}
            value={fieldUpdateValue}
            errorMessage={error}
          />
        ),
      },
      {
        value: NUMBER.NOT_EQUAL_TO.TYPE,
        label: NUMBER.NOT_EQUAL_TO.LABEL,
        customElement: (
          <TextInput
            placeholder={title}
            type={INPUT_TYPES.NUMBER}
            onChange={onChangeNumber}
            value={fieldUpdateValue}
            errorMessage={error}
          />
        ),
      },
      {
        value: NUMBER.EMPTY.TYPE,
        label: NUMBER.EMPTY.LABEL,
      },
    ],
  };

  return (
    <div>
      <div className={cx(BS.D_FLEX, isFromMoreFilter && BS.JC_BETWEEN)}>
        <Title
          id={`${title}_label`}
          content={title}
          headingLevel={ETitleHeadingLevel.h3}
          className={cx(styles.FieldTitle, gClasses.LabelStyle)}
        />
        {isFromMoreFilter && (
          <CloseIcon
            className={cx(
              styles.closeIcon,
              gClasses.ML10,
              BS.JC_END,
              gClasses.CursorPointer,
            )}
            onClick={onCloseCover}
            isButtonColor
            role={ARIA_ROLES.BUTTON}
            tabIndex={0}
            ariaLabel={`Remove ${title} filter`}
            onKeyDown={(e) => keydownOrKeypessEnterHandle(e) && onCloseCover()}
          />
        )}
      </div>
      <div className={BS.D_FLEX}>
        <RadioGroup
          id={title}
          hideLabel
          options={RD_GROUP.OPTION_LIST}
          onChange={(_event, _id, value) => onOperatorInput(value)}
          selectedValue={selectedOperator}
          layout={RadioGroupLayout.stack}
          radioContainerStyle={gClasses.Gap8}
        />
      </div>
    </div>
  );
}

FormFieldByNumber.propTypes = {
  title: propTypes.string,
  fieldUpdateValue: propTypes.string,
  selectedOperator: propTypes.string,
  fieldUpdateBetweenOne: propTypes.string,
  fieldUpdateBetweenTwo: propTypes.string,
  onOperatorInput: propTypes.func,
  onChangeNumber: propTypes.func,
  onChangeNumberBetween: propTypes.func,
  isFromMoreFilter: propTypes.bool,
  onCloseCover: propTypes.func,
  error: propTypes.oneOfType([
    propTypes.string,
    propTypes.arrayOf(propTypes.string),
  ]),
};

export default FormFieldByNumber;
