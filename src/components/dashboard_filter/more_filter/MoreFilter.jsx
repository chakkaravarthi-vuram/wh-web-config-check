import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import cx from 'classnames/bind';
import PropTypes from 'prop-types';
import { Popper, Button, EButtonType, EPopperPlacements } from '@workhall-pvt-lmt/wh-ui-library';
import jsUtils from 'utils/jsUtility';
import { BS } from 'utils/UIConstants';
import gClasses from 'scss/Typography.module.scss';
import { FIELD_TYPE } from 'utils/constants/form_fields.constant';
import { EMPTY_STRING } from 'utils/strings/CommonStrings';
import { DATE } from 'utils/Constants';
import { useClickOutsideDetectorForFilters } from '../../../utils/UtilityFunctions';
import styles from './MoreFilter.module.scss';
import FILTER_STRINGS, { FILTER_TYPES } from '../Filter.strings';
import FormFieldBySingleLine from '../filter_form_builder/FormFieldBySingleLine';
import FormFieldByTextArea from '../filter_form_builder/FormFieldByTextArea';
import FormFieldByNumber from '../filter_form_builder/FormFieldByNumber';
import FormFieldByDate from '../filter_form_builder/FormFieldByDate';
import FormFieldByMultiCheck from '../filter_form_builder/FormFieldByMultiCheck';
import FormFieldByUserTeamPicker from '../filter_form_builder/FormFieldByUserTeamPicker';
import FormFieldByDatalistPicker from '../filter_form_builder/FormFieldByDatalistPicker';

function MoreFilterDashboard(props) {
  const { t } = useTranslation();
  const {
    filter,
    onSetFilterAction,
    getReportData,
    onClickApply,
    moreFilterState,
    referencePopperElement,
  } = props;
  let shouldClose = false;
  const { BUTTONS } = FILTER_STRINGS(t);

  const moreWrapperRef = useRef(null);

  const closeMoreFilter = () => {
    const clonedFilter = jsUtils.cloneDeep(filter);
    if (shouldClose) {
      clonedFilter.isMoreFilter = false;
      onSetFilterAction(clonedFilter);
    }
  };

  useClickOutsideDetectorForFilters(moreWrapperRef, closeMoreFilter);

  useEffect(() => {
    shouldClose = true;
  }, [filter && filter.isMoreFilter]);

  const onOperatorInput = (selectedOperator, index) => {
    const clonedFilter = jsUtils.cloneDeep(filter);
    clonedFilter.inputFieldDetailsForFilter[index].selectedOperator = selectedOperator;
    clonedFilter.inputFieldDetailsForFilter[index].fieldUpdateValue = [];
    clonedFilter.inputFieldDetailsForFilter[index].fieldUpdateBetweenOne = EMPTY_STRING;
    clonedFilter.inputFieldDetailsForFilter[index].fieldUpdateBetweenTwo = EMPTY_STRING;
    onSetFilterAction(clonedFilter);
  };

  const onCloseCover = (index) => {
    const clonedFilter = jsUtils.cloneDeep(filter);
    clonedFilter.inputFieldDetailsForFilter[index].fieldValues?.map(
      (checkList) => {
        checkList.isCheck = false;
        return checkList;
      },
    );
    clonedFilter.inputFieldDetailsForFilter[index].fieldUpdateValue = EMPTY_STRING;
    clonedFilter.inputFieldDetailsForFilter[index].isAppliedFilter = false;
    clonedFilter.inputFieldDetailsForFilter?.map((proData) => {
      proData.isAppliedFieldEdit = false;
      return proData;
    });
    clonedFilter.inputFieldDetailsForFilter[index].fieldUpdateBetweenOne = EMPTY_STRING;
    clonedFilter.inputFieldDetailsForFilter[index].fieldUpdateBetweenTwo = EMPTY_STRING;
    clonedFilter.selectedFieldDetailsFromFilter = jsUtils.cloneDeep(
      clonedFilter.inputFieldDetailsForFilter,
    );
    getReportData(clonedFilter);
  };

  const updatedTheFilter = (updateValue, index) => {
    const clonedFilter = jsUtils.cloneDeep(filter);
    if (updateValue !== undefined && updateValue !== null) {
      const { selectedOperator } = clonedFilter.inputFieldDetailsForFilter[index];
      if (selectedOperator === 'gte' || selectedOperator === 'inDateRange') {
        clonedFilter.inputFieldDetailsForFilter[index].fieldUpdateValue = updateValue;
      } else {
        clonedFilter.inputFieldDetailsForFilter[index].fieldUpdateValue = updateValue ? [updateValue.toString()] : [];
      }
      onSetFilterAction(clonedFilter);
    }
  };

  const onChangeSingleLine = (event, index) => {
    const eValue = event.target.value;
    updatedTheFilter(eValue, index);
  };

  const onChangeNumber = (event, index) => {
    const eValue = event.target.value;
    updatedTheFilter(eValue, index);
  };

  const onChangeNumberBetween = (event, indexNumber, index) => {
    const clonedFilter = jsUtils.cloneDeep(filter);
    const eValue = event.target.value;
    if (indexNumber === 0) {
      clonedFilter.inputFieldDetailsForFilter[index].fieldUpdateBetweenOne = eValue;
    } else if (indexNumber === 1) {
      clonedFilter.inputFieldDetailsForFilter[index].fieldUpdateBetweenTwo = eValue;
    }
    const { fieldUpdateBetweenOne, fieldUpdateBetweenTwo } = jsUtils.cloneDeep(
      clonedFilter.inputFieldDetailsForFilter[index],
    );
    if (
      (fieldUpdateBetweenOne || fieldUpdateBetweenOne === 0) &&
      fieldUpdateBetweenTwo
    ) {
      const arrData = [fieldUpdateBetweenOne, fieldUpdateBetweenTwo];
      clonedFilter.inputFieldDetailsForFilter[index].fieldUpdateValue = arrData;
    }
    onSetFilterAction(clonedFilter);
  };

  const onChangeDateBetween = (
    selectedDate,
    indexNumber,
    index,
    selectedOperator,
  ) => {
    const clonedFilter = jsUtils.cloneDeep(filter);
    const eValue = selectedDate;
    let { fieldUpdateBetweenOne, fieldUpdateBetweenTwo } = clonedFilter.inputFieldDetailsForFilter[index];
    switch (selectedOperator) {
      case FILTER_TYPES.DATE.EQUAL:
        fieldUpdateBetweenOne = eValue;
        fieldUpdateBetweenTwo = eValue;
        break;
      case FILTER_TYPES.DATE.DATE_IN_RANGE:
        if (indexNumber === 0) {
          fieldUpdateBetweenOne = eValue;
        } else {
          fieldUpdateBetweenTwo = eValue;
        }
        break;
      case FILTER_TYPES.DATE.CURRENT_YEAR_TO_DATE: {
        const selectedDate = new Date(eValue);
        const selectedYear = selectedDate.getFullYear();
        const firstDayOfYear = `${selectedYear}-01-01`;
        fieldUpdateBetweenOne = firstDayOfYear;
        fieldUpdateBetweenTwo = eValue;
        break;
      }
      case FILTER_TYPES.DATE.FROM_DATE_TO_TODAY: {
        fieldUpdateBetweenOne = eValue;
        const todayDate = moment().format(DATE.DATE_AND_TIME_24_FORMAT);
        fieldUpdateBetweenTwo = todayDate;
        break;
      }
      case FILTER_TYPES.DATE.BEFORE:
        fieldUpdateBetweenOne = eValue;
        break;
      default:
        break;
    }
    clonedFilter.inputFieldDetailsForFilter[index].fieldUpdateBetweenOne = fieldUpdateBetweenOne;
    clonedFilter.inputFieldDetailsForFilter[index].fieldUpdateBetweenTwo = fieldUpdateBetweenTwo;
    onSetFilterAction(clonedFilter);
  };

  const elementDate = (
    fieldType,
    fieldId,
    fieldNames,
    fieldUpdateValue,
    index,
    selectedOperator,
    fieldUpdateBetweenOne,
    fieldUpdateBetweenTwo,
    fieldUpdateBetweenOneError,
    fieldUpdateBetweenTwoError,
  ) => {
    const isDateTime = fieldType === FIELD_TYPE.DATETIME;

    return (
      <FormFieldByDate
        fieldId={fieldId}
        title={fieldNames}
        fieldUpdateValue={fieldUpdateValue}
        selectedOperator={selectedOperator}
        onOperatorInput={(value) => onOperatorInput(value, index)}
        fieldUpdateBetweenOne={fieldUpdateBetweenOne}
        fieldUpdateBetweenTwo={fieldUpdateBetweenTwo}
        fieldUpdateBetweenOneError={fieldUpdateBetweenOneError}
        fieldUpdateBetweenTwoError={fieldUpdateBetweenTwoError}
        onChangeDateBetween={(selectedDate, indexNumber) =>
          onChangeDateBetween(
            selectedDate,
            indexNumber,
            index,
            selectedOperator,
          )
        }
        enableTime={isDateTime}
        isFromMoreFilter
        onCloseCover={() => onCloseCover(index)}
      />
    );
  };

  const onChangeMultiCheck = (value, index) => {
    const ddSelectedValue = value;
    const clonedFilter = jsUtils.cloneDeep(filter);
    const { fieldValues, fieldType } = jsUtils.cloneDeep(
      clonedFilter.inputFieldDetailsForFilter[index],
    );
    const arrValues = [];
    const modifiedFieldValue = fieldValues.map((valueData) => {
      if (ddSelectedValue === valueData.value) {
        valueData.isCheck = !valueData.isCheck;
      }
      if (valueData.isCheck) {
        if (fieldType === FIELD_TYPE.YES_NO) {
          arrValues.push(valueData.value.toString());
        } else {
          arrValues.push(valueData.value);
        }
      }
      return valueData;
    });
    clonedFilter.inputFieldDetailsForFilter[index].fieldUpdateValue = arrValues;
    clonedFilter.inputFieldDetailsForFilter[index].fieldValues = modifiedFieldValue;
    onSetFilterAction(clonedFilter);
  };

  const elementMultiCheck = (fieldNames, fieldValues, index) => (
    <FormFieldByMultiCheck
      title={fieldNames}
      fieldValues={fieldValues}
      onChangeMultiCheck={(value) => onChangeMultiCheck(value, index)}
      isFromMoreFilter
      onCloseCover={() => onCloseCover(index)}
    />
  );

  const onChangePicker = (value, index) => {
    const clonedFilter = jsUtils.cloneDeep(filter);
    clonedFilter.inputFieldDetailsForFilter[index].fieldUpdateValue = value;
    onSetFilterAction(clonedFilter);
  };

  const elementUserTeamPicker = (fieldNames, fieldUpdateValue, index) => (
    <FormFieldByUserTeamPicker
      title={fieldNames}
      fieldUpdateValue={fieldUpdateValue}
      onChangeUserTeamPicker={(value) => onChangePicker(value, index)}
      isFromMoreFilter
      onCloseCover={() => onCloseCover(index)}
    />
  );

  const elementDatalistPicker = (
    fieldNames,
    fieldUpdateValue,
    fieldId,
    index,
  ) => (
    <FormFieldByDatalistPicker
      title={fieldNames}
      fieldUpdateValue={fieldUpdateValue}
      fieldId={fieldId}
      onChangeDatalistPicker={(value) => onChangePicker(value, index)}
      isFromMoreFilter
      onCloseCover={() => onCloseCover(index)}
    />
  );

  const getElementFieldByFieldType = () => {
    const clonedMoreFilterFields = jsUtils.cloneDeep(moreFilterState);
    const moreFilterFields = clonedMoreFilterFields?.map((filterProData) => {
      const {
        fieldType,
        fieldNames,
        fieldValues,
        fieldUpdateValue,
        selectedOperator,
        fieldUpdateBetweenOne,
        fieldUpdateBetweenOneError,
        fieldUpdateBetweenTwo,
        fieldUpdateBetweenTwoError,
        index,
        fieldId,
      } = filterProData;
      let fieldComponent = EMPTY_STRING;

      switch (fieldType) {
        case FIELD_TYPE.SINGLE_LINE:
        case FIELD_TYPE.EMAIL:
        case FIELD_TYPE.PHONE_NUMBER:
        case FIELD_TYPE.LINK:
        case FIELD_TYPE.SCANNER:
          fieldComponent = (
            <FormFieldBySingleLine
              title={fieldNames}
              fieldUpdateValue={fieldUpdateValue}
              selectedOperator={selectedOperator}
              onOperatorInput={(value) => onOperatorInput(value, index)}
              onChangeSingleLine={(e) => onChangeSingleLine(e, index)}
              isFromMoreFilter
              onCloseCover={() => onCloseCover(index)}
            />
          );
          break;
        case FIELD_TYPE.PARAGRAPH:
        case FIELD_TYPE.INFORMATION:
          fieldComponent = (
            <FormFieldByTextArea
              title={fieldNames}
              fieldUpdateValue={fieldUpdateValue}
              selectedOperator={selectedOperator}
              onOperatorInput={(value) => onOperatorInput(value, index)}
              onChangeSingleLine={(e) => onChangeSingleLine(e, index)}
              isFromMoreFilter
              onCloseCover={() => onCloseCover(index)}
            />
          );
          break;
        case FIELD_TYPE.NUMBER:
        case FIELD_TYPE.CURRENCY:
          fieldComponent = (
            <FormFieldByNumber
              title={fieldNames}
              fieldUpdateValue={fieldUpdateValue}
              selectedOperator={selectedOperator}
              onOperatorInput={(value) => onOperatorInput(value, index)}
              onChangeNumber={(event) => onChangeNumber(event, index)}
              fieldUpdateBetweenOne={fieldUpdateBetweenOne}
              fieldUpdateBetweenTwo={fieldUpdateBetweenTwo}
              onChangeNumberBetween={(event, indexNumber) =>
                onChangeNumberBetween(event, indexNumber, index)
              }
              isFromMoreFilter
              onCloseCover={() => onCloseCover(index)}
            />
          );
          break;
        case FIELD_TYPE.DATE:
        case FIELD_TYPE.DATETIME:
          fieldComponent = elementDate(
            fieldType,
            fieldId,
            fieldNames,
            fieldUpdateValue,
            index,
            selectedOperator,
            fieldUpdateBetweenOne,
            fieldUpdateBetweenTwo,
            fieldUpdateBetweenOneError,
            fieldUpdateBetweenTwoError,
          );
          break;
        case FIELD_TYPE.DROPDOWN:
        case FIELD_TYPE.CHECKBOX:
        case FIELD_TYPE.YES_NO:
        case FIELD_TYPE.RADIO_GROUP:
        case FIELD_TYPE.RADIO_BUTTON:
        case FIELD_TYPE.LOOK_UP_DROPDOWN:
          fieldComponent = elementMultiCheck(fieldNames, fieldValues, index);
          break;
        case FIELD_TYPE.USER_TEAM_PICKER:
          fieldComponent = elementUserTeamPicker(
            fieldNames,
            fieldUpdateValue,
            index,
          );
          break;
        case FIELD_TYPE.DATA_LIST:
          fieldComponent = elementDatalistPicker(
            fieldNames,
            fieldUpdateValue,
            fieldId,
            index,
          );
          break;
        default:
      }
      return fieldComponent;
    });

    return moreFilterFields;
  };

  return (
    <Popper
      className={cx(gClasses.ZIndex10, BS.D_FLEX, BS.P_ABSOLUTE)}
      targetRef={referencePopperElement}
      open={filter && filter.isMoreFilter}
      placement={EPopperPlacements.BOTTOM}
      content={
        <div className={styles.FieldsContainer} ref={moreWrapperRef}>
          <div
            className={cx(
              gClasses.P12,
              styles.ContainerHeight,
            )}
          >
            {getElementFieldByFieldType()}
          </div>
          <div
            className={cx(
              BS.D_FLEX,
              BS.JC_END,
              styles.AppliedFieldEditButtonContainer,
              BS.W100,
            )}
          >
            <div className={gClasses.CenterV}>
              <Button
                type={EButtonType.PRIMARY}
                className={cx(BS.TEXT_NO_WRAP)}
                onClickHandler={() => onClickApply()}
                buttonText={BUTTONS.APPLY}
              />
            </div>
          </div>
        </div>
      }
    />
  );
}

MoreFilterDashboard.propTypes = {
  filter: PropTypes.object,
  onSetFilterAction: PropTypes.func,
  getReportData: PropTypes.func,
  onClickApply: PropTypes.func,
  moreFilterState: PropTypes.arrayOf(PropTypes.object),
  referencePopperElement: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.any }),
  ]),
};

export default MoreFilterDashboard;
