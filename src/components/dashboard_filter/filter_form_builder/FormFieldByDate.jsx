import React from 'react';
import { useTranslation } from 'react-i18next';
import cx from 'classnames/bind';
import propTypes from 'prop-types';
import {
  Title,
  ETitleHeadingLevel,
  RadioGroup,
  RadioGroupLayout,
} from '@workhall-pvt-lmt/wh-ui-library';
import moment from 'moment';
import CloseIcon from 'assets/icons/CloseIcon';
import DateTimeWrapper from 'components/date_time_wrapper/DateTimeWrapper';
import { keydownOrKeypessEnterHandle } from 'utils/UtilityFunctions';
import { isArray } from '../../../utils/jsUtility';
import gClasses from '../../../scss/Typography.module.scss';
import styles from '../Filter.module.scss';
import { ARIA_ROLES, BS } from '../../../utils/UIConstants';
import FILTER_STRINGS from '../Filter.strings';

function FormFieldByDate(props) {
  const { t } = useTranslation();
  const {
    title,
    selectedOperator,
    fieldUpdateBetweenOne,
    fieldUpdateBetweenTwo,
    error,
    enableTime,
    onOperatorInput,
    onChangeDateBetween,
    isFromMoreFilter,
    onCloseCover,
  } = props;

  const {
    FIELDS: { DATE },
  } = FILTER_STRINGS(t);

  const RD_GROUP = {
    OPTION_LIST: [],
  };

  let fieldUpdateBetweenOneError = null;
  let fieldUpdateBetweenTwoError = null;
  if (isArray(error)) {
    [fieldUpdateBetweenOneError, fieldUpdateBetweenTwoError] = error;
  }

  if (!enableTime) {
    RD_GROUP.OPTION_LIST.push(
      {
        value: DATE.EQUAL.TYPE,
        label: DATE.EQUAL.LABEL,
        customElement: (
          <DateTimeWrapper
            id={`${title}_${DATE.EQUAL.TYPE}`}
            hideLabel
            getDate={(selectedDate) => onChangeDateBetween(selectedDate, 0)}
            date={fieldUpdateBetweenOne}
            enableTime={enableTime}
            inputAriaLabelledBy={`${title}_label`}
            noAriaLabelledBy
            errorMessage={error}
          />
        ),
      },
    );
  }

  RD_GROUP.OPTION_LIST.push(
    {
      value: DATE.BETWEEN.TYPE,
      label: DATE.BETWEEN.LABEL,
      customElement: (
        <div className={styles.DoubleFieldData}>
          <DateTimeWrapper
            id={`${title}_${DATE.BETWEEN.TYPE}_1`}
            hideLabel
            getDate={(selectedDate) => onChangeDateBetween(selectedDate, 0)}
            date={fieldUpdateBetweenOne}
            errorMessage={fieldUpdateBetweenOneError}
            enableTime={enableTime}
            inputAriaLabelledBy={`${title}_label`}
            noAriaLabelledBy
          />
          <DateTimeWrapper
            id={`${title}_${DATE.BETWEEN.TYPE}_2`}
            hideLabel
            getDate={(selectedDate) => onChangeDateBetween(selectedDate, 1)}
            date={fieldUpdateBetweenTwo}
            errorMessage={fieldUpdateBetweenTwoError}
            enableTime={enableTime}
            inputAriaLabelledBy={`${title}_label`}
            noAriaLabelledBy
          />
        </div>
      ),
    },
    {
      value: DATE.FROM_DATE_TO_TODAY.TYPE,
      label: DATE.FROM_DATE_TO_TODAY.LABEL,
      customElement: (
        <DateTimeWrapper
        id={`${title}_${DATE.FROM_DATE_TO_TODAY.TYPE}`}
          hideLabel
          getDate={(selectedDate) => onChangeDateBetween(selectedDate, 0)}
          date={fieldUpdateBetweenOne}
          validations={{
            date_selection: [{
              sub_type: 'all_past',
              type: 'past',
            }],
          }}
          enableTime={enableTime}
          inputAriaLabelledBy={`${title}_label`}
          noAriaLabelledBy
          errorMessage={error}
        />
      ),
    },
    {
      value: DATE.BEFORE.TYPE,
      label: DATE.BEFORE.LABEL,
      customElement: (
        <DateTimeWrapper
          id={`${title}_${DATE.BEFORE.TYPE}`}
          hideLabel
          getDate={(selectedDate) => onChangeDateBetween(selectedDate, 0)}
          date={fieldUpdateBetweenOne}
          enableTime={enableTime}
          inputAriaLabelledBy={`${title}_label`}
          noAriaLabelledBy
          errorMessage={error}
        />
      ),
    },
    {
      value: DATE.CURRENT_YEAR_TO_DATE.TYPE,
      label: DATE.CURRENT_YEAR_TO_DATE.LABEL,
      customElement: (
        <DateTimeWrapper
          id={`${title}_${DATE.CURRENT_YEAR_TO_DATE.TYPE}`}
          hideLabel
          getDate={(selectedDate) => onChangeDateBetween(selectedDate, 1)}
          date={fieldUpdateBetweenTwo}
          enableTime={enableTime}
          inputAriaLabelledBy={`${title}_label`}
          validations={{
            date_selection: [{
              type: 'date',
              sub_type: 'after',
              start_date: moment.utc(fieldUpdateBetweenOne, DATE.DATE_FORMAT).format(),
            }],
          }}
          noAriaLabelledBy
          errorMessage={error}
        />
      ),
    },
    {
      value: DATE.CURRENT_MONTH.TYPE,
      label: DATE.CURRENT_MONTH.LABEL,
    },
    {
      value: DATE.NEXT_MONTH.TYPE,
      label: DATE.NEXT_MONTH.LABEL,
    },
    {
      value: DATE.LAST_7_DAYS.TYPE,
      label: DATE.LAST_7_DAYS.LABEL,
    },
    {
      value: DATE.LAST_30_DAYS.TYPE,
      label: DATE.LAST_30_DAYS.LABEL,
    },
    {
      value: DATE.TODAY.TYPE,
      label: DATE.TODAY.LABEL,
    },
    {
      value: DATE.ALL_PAST_DAYS.TYPE,
      label: DATE.ALL_PAST_DAYS.LABEL,
    },
    {
      value: DATE.ALL_FUTURE_DAYS.TYPE,
      label: DATE.ALL_FUTURE_DAYS.LABEL,
    },
  );

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

FormFieldByDate.propTypes = {
  title: propTypes.string,
  selectedOperator: propTypes.string,
  fieldUpdateBetweenOne: propTypes.string,
  fieldUpdateBetweenTwo: propTypes.string,
  error: propTypes.oneOfType([
    propTypes.string,
    propTypes.arrayOf(propTypes.string),
  ]),
  enableTime: propTypes.bool,
  onOperatorInput: propTypes.func,
  onChangeDateBetween: propTypes.func,
  isFromMoreFilter: propTypes.bool,
  onCloseCover: propTypes.func,
};

export default FormFieldByDate;
