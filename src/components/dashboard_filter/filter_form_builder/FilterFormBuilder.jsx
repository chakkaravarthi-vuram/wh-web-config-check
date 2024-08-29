import React from 'react';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { DATE } from 'utils/Constants';
import CloseCoverButton from '../../form_components/close_cover_button/CloseCoverButton';
import FormFieldBySingleLine from './FormFieldBySingleLine';
import FormFieldByNumber from './FormFieldByNumber';
import FormFieldByDate from './FormFieldByDate';
import FormFieldByMultiCheck from './FormFieldByMultiCheck';
import FormFieldByUserTeamPicker from './FormFieldByUserTeamPicker';
import FormFieldByDatalistPicker from './FormFieldByDatalistPicker';
import { FIELD_TYPE } from '../../../utils/constants/form_fields.constant';
import { EMPTY_STRING } from '../../../utils/strings/CommonStrings';
import jsUtils from '../../../utils/jsUtility';
import FILTER_STRINGS, {
  FILTER_TYPES,
  ONLY_SELECT_FIELDS,
  ONLY_SELECT_NUMBER_FIELD,
  SINGLE_INPUT_NUMBER_FIELD,
} from '../Filter.strings';
import FormFieldByTextArea from './FormFieldByTextArea';
import AppliedFieldEdit from './AppliedFieldEdit';
import { getDateFieldValue, selectFieldLabelName } from '../FilterUtils';

function FilterFormBuilder(props) {
  const { t } = useTranslation();
  const {
    index,
    fieldType,
    fieldNames,
    fieldValues,
    fieldUpdateValue,
    isAppliedFieldEdit,
    fieldId,

    selectedOperator,
    fieldUpdateBetweenOne,
    fieldUpdateBetweenTwo,

    isApplied,
    filter,
    onSetFilterAction,
    getReportData,
    onClickApply,
    error,
    resetError,
    isUserFilter = false,
    is_logged_in_user,
  } = props;

  const onOperatorInput = (selectedOperator) => {
    const clonedFilter = jsUtils.cloneDeep(filter);
    clonedFilter.inputFieldDetailsForFilter[index].selectedOperator =
      selectedOperator;
    clonedFilter.inputFieldDetailsForFilter[index].fieldUpdateValue = [];
    clonedFilter.inputFieldDetailsForFilter[index].fieldUpdateBetweenOne =
      EMPTY_STRING;
    clonedFilter.inputFieldDetailsForFilter[index].error = EMPTY_STRING;
    if (
      selectedOperator ===
      FILTER_TYPES.DATE.CURRENT_YEAR_TO_DATE
    ) {
      clonedFilter.inputFieldDetailsForFilter[
        index
      ].fieldUpdateBetweenOne = `${moment().year()}-01-01`;
    }
    clonedFilter.inputFieldDetailsForFilter[index].fieldUpdateBetweenTwo =
      EMPTY_STRING;
    onSetFilterAction(clonedFilter);
    resetError && resetError();
  };

  const appliedFilterLabelClicked = () => {
    const clonedFilter = jsUtils.cloneDeep(filter);
    clonedFilter.inputFieldDetailsForFilter?.map((proData) => {
      proData.isAppliedFieldEdit = false;
      return proData;
    });
    clonedFilter.inputFieldDetailsForFilter[index].isAppliedFieldEdit = true;
    clonedFilter.selectedFieldDetailsFromFilter = jsUtils.cloneDeep(
      clonedFilter.inputFieldDetailsForFilter,
    );
    onSetFilterAction(clonedFilter);
  };

  const onCloseCover = () => {
    const clonedFilter = jsUtils.cloneDeep(filter);
    clonedFilter.inputFieldDetailsForFilter[index].fieldValues?.map(
      (checkList) => {
        checkList.isCheck = false;
        return checkList;
      },
    );
    clonedFilter.inputFieldDetailsForFilter[index].fieldUpdateValue =
      EMPTY_STRING;
    clonedFilter.inputFieldDetailsForFilter[index].isAppliedFilter = false;
    clonedFilter.inputFieldDetailsForFilter[index].isUserFilterApplied = false;
    clonedFilter.inputFieldDetailsForFilter?.map((proData) => {
      proData.isAppliedFieldEdit = false;
      return proData;
    });
    clonedFilter.inputFieldDetailsForFilter[index].fieldUpdateBetweenOne =
      EMPTY_STRING;
    clonedFilter.inputFieldDetailsForFilter[index].fieldUpdateBetweenTwo =
      EMPTY_STRING;
    if (
      ONLY_SELECT_FIELDS.includes(
        clonedFilter.inputFieldDetailsForFilter[index].selectedOperator,
      )
    ) {
      if (
        clonedFilter.inputFieldDetailsForFilter[index].fieldType ===
        FIELD_TYPE.DATE
      ) {
        clonedFilter.inputFieldDetailsForFilter[index].selectedOperator =
          FILTER_TYPES.DATE.EQUAL;
      } else if (
        clonedFilter.inputFieldDetailsForFilter[index].fieldType ===
        FIELD_TYPE.DATETIME
      ) {
        clonedFilter.inputFieldDetailsForFilter[index].selectedOperator =
          FILTER_TYPES.DATE.DATE_IN_RANGE;
      } else {
        clonedFilter.inputFieldDetailsForFilter[index].selectedOperator =
          FILTER_TYPES.NUMBER.EQUAL;
      }
    }
    if (clonedFilter.inputFieldDetailsForFilter[index].is_logged_in_user) {
      clonedFilter.inputFieldDetailsForFilter[index].is_logged_in_user = false;
    }
    clonedFilter.selectedFieldDetailsFromFilter = jsUtils.cloneDeep(
      clonedFilter.inputFieldDetailsForFilter,
    );
    if (isUserFilter) {
      onSetFilterAction(clonedFilter);
      return;
    }
    getReportData(clonedFilter);
  };

  const onBlurClickHandler = () => {
    const clonedFilter = jsUtils.cloneDeep(filter);
    clonedFilter.selectedFieldDetailsFromFilter?.map((proData) => {
      proData.isAppliedFieldEdit = false;
      return proData;
    });
    const { inputFieldDetailsForFilter, selectedFieldDetailsFromFilter } =
      clonedFilter;

    const isEqual = jsUtils.isEqual(
      inputFieldDetailsForFilter,
      selectedFieldDetailsFromFilter,
    );
    if (!isEqual) {
      clonedFilter.inputFieldDetailsForFilter = jsUtils.cloneDeep(
        selectedFieldDetailsFromFilter,
      );
    }
    onSetFilterAction(clonedFilter);
  };

  const updatedTheFilter = (updateValue) => {
    const clonedFilter = jsUtils.cloneDeep(filter);
    if (updateValue !== undefined && updateValue !== null) {
      const { selectedOperator } =
        clonedFilter.inputFieldDetailsForFilter[index];
      if (selectedOperator === 'inDateRange') {
        clonedFilter.inputFieldDetailsForFilter[index].fieldUpdateValue =
          updateValue;
      } else {
        clonedFilter.inputFieldDetailsForFilter[index].fieldUpdateValue =
          updateValue || updateValue === 0 ? [updateValue] : [];
      }
      onSetFilterAction(clonedFilter);
    }
  };

  const onChangeSingleLine = (event) => {
    const eValue = event.target.value;
    updatedTheFilter(eValue);
  };

  const elementTextArea = () => (
    <>
      <CloseCoverButton
        name={fieldNames}
        value={fieldUpdateValue}
        type={fieldType}
        isCover={isApplied}
        onCloseCover={() => onCloseCover()}
        labelClicked={appliedFilterLabelClicked}
        isClickableLabel
        isUserFilter={isUserFilter}
      />
      {!isUserFilter && (!isApplied || isAppliedFieldEdit) && (
        <AppliedFieldEdit
          isApplied={isApplied}
          isAppliedFieldEdit={isAppliedFieldEdit}
          onClickApply={onClickApply}
          onBlurClickHandler={onBlurClickHandler}
        >
          <FormFieldByTextArea
            title={fieldNames}
            fieldUpdateValue={fieldUpdateValue}
            onChangeSingleLine={onChangeSingleLine}
            error={error}
          />
        </AppliedFieldEdit>
      )}
    </>
  );

  const elementSingleLine = () => (
    <>
      <CloseCoverButton
        name={fieldNames}
        value={fieldUpdateValue}
        type={fieldType}
        isCover={isApplied}
        onCloseCover={() => onCloseCover()}
        labelClicked={appliedFilterLabelClicked}
        isClickableLabel
        isUserFilter={isUserFilter}
      />
      {!isUserFilter && (!isApplied || isAppliedFieldEdit) && (
        <AppliedFieldEdit
          isApplied={isApplied}
          isAppliedFieldEdit={isAppliedFieldEdit}
          onClickApply={onClickApply}
          onBlurClickHandler={onBlurClickHandler}
        >
          <FormFieldBySingleLine
            title={fieldNames}
            fieldUpdateValue={fieldUpdateValue}
            onChangeSingleLine={onChangeSingleLine}
            error={error}
          />
        </AppliedFieldEdit>
      )}
    </>
  );

  const onChangeNumber = (event) => {
    const eValue = event.target.value;
    updatedTheFilter(eValue ? Number(eValue) : EMPTY_STRING);
  };

  const onChangeNumberBetween = (event, indexNumber) => {
    const clonedFilter = jsUtils.cloneDeep(filter);
    const eValue = event.target.value;

    if (indexNumber === 0) {
      clonedFilter.inputFieldDetailsForFilter[index].fieldUpdateBetweenOne =
        eValue ? Number(eValue) : EMPTY_STRING;
      delete clonedFilter.inputFieldDetailsForFilter[index]?.error?.[0];
    } else if (indexNumber === 1) {
      clonedFilter.inputFieldDetailsForFilter[index].fieldUpdateBetweenTwo =
        eValue ? Number(eValue) : EMPTY_STRING;
      delete clonedFilter.inputFieldDetailsForFilter[index]?.error?.[1];
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

  const elementNumber = () => {
    let fieldUpdatedNumber;
    if (ONLY_SELECT_NUMBER_FIELD.includes(selectedOperator)) {
      fieldUpdatedNumber = selectFieldLabelName(selectedOperator, t);
    } else if (SINGLE_INPUT_NUMBER_FIELD.includes(selectedOperator)) {
      fieldUpdatedNumber = fieldUpdateValue;
    } else if (
      (fieldUpdateBetweenOne || fieldUpdateBetweenOne === 0) &&
      (fieldUpdateBetweenTwo || fieldUpdateBetweenTwo === 0)
    ) {
      fieldUpdatedNumber = `${fieldUpdateBetweenOne} - ${fieldUpdateBetweenTwo}`;
    } else {
      fieldUpdatedNumber =
        fieldUpdateBetweenOne || fieldUpdateBetweenTwo || EMPTY_STRING;
    }

    return (
      <>
        <CloseCoverButton
          name={fieldNames}
          value={fieldUpdatedNumber}
          type={fieldType}
          isCover={isApplied}
          onCloseCover={() => onCloseCover()}
          labelClicked={appliedFilterLabelClicked}
          isClickableLabel
          isUserFilter={isUserFilter}
        />
        {!isUserFilter && (!isApplied || isAppliedFieldEdit) && (
          <AppliedFieldEdit
            isApplied={isApplied}
            isAppliedFieldEdit={isAppliedFieldEdit}
            onClickApply={onClickApply}
            onBlurClickHandler={onBlurClickHandler}
          >
            <FormFieldByNumber
              title={fieldNames}
              fieldUpdateValue={fieldUpdateValue.toString()}
              selectedOperator={selectedOperator}
              onOperatorInput={onOperatorInput}
              onChangeNumber={onChangeNumber}
              fieldUpdateBetweenOne={fieldUpdateBetweenOne.toString()}
              fieldUpdateBetweenTwo={fieldUpdateBetweenTwo.toString()}
              onChangeNumberBetween={onChangeNumberBetween}
              error={error}
            />
          </AppliedFieldEdit>
        )}
      </>
    );
  };

  const onChangeDateBetween = (selectedDate, indexNumber) => {
    const clonedFilter = jsUtils.cloneDeep(filter);
    const eValue = selectedDate;
    let { fieldUpdateBetweenOne, fieldUpdateBetweenTwo } =
      clonedFilter.inputFieldDetailsForFilter[index];

    switch (selectedOperator) {
      case FILTER_TYPES.DATE.EQUAL:
        fieldUpdateBetweenOne = eValue;
        fieldUpdateBetweenTwo = eValue;
        break;
      case FILTER_TYPES.DATE.DATE_IN_RANGE:
        if (indexNumber === 0) {
          fieldUpdateBetweenOne = eValue;
          delete clonedFilter.inputFieldDetailsForFilter[index]?.error?.[0];
        } else {
          fieldUpdateBetweenTwo = eValue;
          delete clonedFilter.inputFieldDetailsForFilter[index]?.error?.[1];
        }
        break;
      case FILTER_TYPES.DATE.CURRENT_YEAR_TO_DATE:
        fieldUpdateBetweenTwo = eValue;
        break;
      case FILTER_TYPES.DATE.FROM_DATE_TO_TODAY: {
        fieldUpdateBetweenOne = eValue;
        const todayDate = moment().format(DATE.UTC_DATE_WITH_TIME_STAMP);
        fieldUpdateBetweenTwo = todayDate;
        break;
      }
      case FILTER_TYPES.DATE.BEFORE:
        fieldUpdateBetweenOne = eValue;
        break;
      default:
        break;
    }

    clonedFilter.inputFieldDetailsForFilter[index].fieldUpdateBetweenOne =
      fieldUpdateBetweenOne;
    clonedFilter.inputFieldDetailsForFilter[index].fieldUpdateBetweenTwo =
      fieldUpdateBetweenTwo;
    onSetFilterAction(clonedFilter);
  };

  const elementDate = () => {
    const isDateTime = fieldType === FIELD_TYPE.DATETIME;
    const fieldUpdatedData = getDateFieldValue(
      fieldUpdateBetweenOne,
      fieldUpdateBetweenTwo,
      selectedOperator,
      isDateTime,
      t,
    );

    return (
      <>
        <CloseCoverButton
          name={fieldNames}
          value={fieldUpdatedData}
          type={fieldType}
          isCover={isApplied}
          onCloseCover={() => onCloseCover()}
          labelClicked={appliedFilterLabelClicked}
          isClickableLabel
          isUserFilter={isUserFilter}
        />
        {!isUserFilter && (!isApplied || isAppliedFieldEdit) && (
          <AppliedFieldEdit
            isApplied={isApplied}
            isAppliedFieldEdit={isAppliedFieldEdit}
            onClickApply={onClickApply}
            onBlurClickHandler={onBlurClickHandler}
          >
            <FormFieldByDate
              title={fieldNames}
              selectedOperator={selectedOperator}
              onOperatorInput={onOperatorInput}
              fieldUpdateBetweenOne={fieldUpdateBetweenOne}
              fieldUpdateBetweenTwo={fieldUpdateBetweenTwo}
              error={error}
              onChangeDateBetween={onChangeDateBetween}
              enableTime={isDateTime}
            />
          </AppliedFieldEdit>
        )}
      </>
    );
  };

  const onChangeMultiCheck = (value) => {
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
    clonedFilter.inputFieldDetailsForFilter[index].fieldValues =
      modifiedFieldValue;

    onSetFilterAction(clonedFilter);
  };

  const elementMultiCheck = () => (
    <>
      <CloseCoverButton
        name={fieldNames}
        value={fieldUpdateValue}
        fieldValues={fieldValues}
        type={fieldType}
        isCover={isApplied}
        onCloseCover={() => onCloseCover()}
        labelClicked={appliedFilterLabelClicked}
        isClickableLabel
        isUserFilter={isUserFilter}
      />
      {!isUserFilter && (!isApplied || isAppliedFieldEdit) && (
        <AppliedFieldEdit
          isApplied={isApplied}
          isAppliedFieldEdit={isAppliedFieldEdit}
          onClickApply={onClickApply}
          onBlurClickHandler={onBlurClickHandler}
        >
          <FormFieldByMultiCheck
            title={fieldNames}
            fieldValues={fieldValues}
            onChangeMultiCheck={onChangeMultiCheck}
            error={error}
          />
        </AppliedFieldEdit>
      )}
    </>
  );

  const onChangePicker = (value) => {
    const clonedFilter = jsUtils.cloneDeep(filter);
    clonedFilter.inputFieldDetailsForFilter[index].fieldUpdateValue = value;
    onSetFilterAction(clonedFilter);
  };

  const onClickLoggedInUser = () => {
    const clonedFilter = jsUtils.cloneDeep(filter);
    clonedFilter.inputFieldDetailsForFilter[index].is_logged_in_user =
      !is_logged_in_user;
    if (clonedFilter.inputFieldDetailsForFilter[index].is_logged_in_user) {
      clonedFilter.inputFieldDetailsForFilter[index].fieldUpdateValue = [];
    }
    onSetFilterAction(clonedFilter);
  };

  const elementUserTeamPicker = () => {
    const valueData = is_logged_in_user
      ? FILTER_STRINGS(t).FIELDS.USER_TEAM_PICKER.LOGGED_IN_USER.DETAILS.label
      : fieldUpdateValue;
    return (
      <>
        <CloseCoverButton
          name={fieldNames}
          value={valueData}
          type={fieldType}
          isCover={isApplied}
          onCloseCover={() => onCloseCover()}
          labelClicked={appliedFilterLabelClicked}
          isClickableLabel
          isUserFilter={isUserFilter}
        />
        {!isUserFilter && (!isApplied || isAppliedFieldEdit) && (
          <AppliedFieldEdit
            isApplied={isApplied}
            isAppliedFieldEdit={isAppliedFieldEdit}
            onClickApply={onClickApply}
            onBlurClickHandler={onBlurClickHandler}
          >
            <FormFieldByUserTeamPicker
              title={fieldNames}
              fieldUpdateValue={fieldUpdateValue}
              onChangeUserTeamPicker={onChangePicker}
              isLoggedInUser={is_logged_in_user}
              onClickLoggedInUser={onClickLoggedInUser}
              error={error}
            />
          </AppliedFieldEdit>
        )}
      </>
    );
  };

  const elementDatalistPicker = () => (
    <>
      <CloseCoverButton
        name={fieldNames}
        value={fieldUpdateValue}
        type={fieldType}
        isCover={isApplied}
        onCloseCover={() => onCloseCover()}
        labelClicked={appliedFilterLabelClicked}
        isClickableLabel
        isUserFilter={isUserFilter}
      />
      {!isUserFilter && (!isApplied || isAppliedFieldEdit) && (
        <AppliedFieldEdit
          isApplied={isApplied}
          isAppliedFieldEdit={isAppliedFieldEdit}
          onClickApply={onClickApply}
          onBlurClickHandler={onBlurClickHandler}
        >
          <FormFieldByDatalistPicker
            title={fieldNames}
            fieldUpdateValue={fieldUpdateValue}
            fieldId={fieldId}
            onChangeDatalistPicker={onChangePicker}
            error={error}
          />
        </AppliedFieldEdit>
      )}
    </>
  );

  const getElementFieldByFieldType = () => {
    let ret = EMPTY_STRING;
    switch (fieldType) {
      case FIELD_TYPE.SINGLE_LINE:
      case FIELD_TYPE.EMAIL:
      case FIELD_TYPE.PHONE_NUMBER:
      case FIELD_TYPE.LINK:
      case FIELD_TYPE.SCANNER:
        ret = elementSingleLine();
        break;
      case FIELD_TYPE.PARAGRAPH:
      case FIELD_TYPE.INFORMATION:
        ret = elementTextArea();
        break;
      case FIELD_TYPE.NUMBER:
      case FIELD_TYPE.CURRENCY:
        ret = elementNumber();
        break;
      case FIELD_TYPE.DATE:
      case FIELD_TYPE.DATETIME:
        ret = elementDate();
        break;
      case FIELD_TYPE.DROPDOWN:
      case FIELD_TYPE.CHECKBOX:
      case FIELD_TYPE.YES_NO:
      case FIELD_TYPE.RADIO_GROUP:
      case FIELD_TYPE.RADIO_BUTTON:
      case FIELD_TYPE.LOOK_UP_DROPDOWN:
        ret = elementMultiCheck();
        break;
      case FIELD_TYPE.USER_TEAM_PICKER:
        ret = elementUserTeamPicker();
        break;
      case FIELD_TYPE.DATA_LIST:
        ret = elementDatalistPicker();
        break;
      default:
    }
    return ret;
  };

  return getElementFieldByFieldType();
}

FilterFormBuilder.propTypes = {
  filter: PropTypes.objectOf({
    inputFieldDetailsForFilter: PropTypes.arrayOf(PropTypes.object),
  }),
  index: PropTypes.number,
  selectedOperator: PropTypes.string,

  fieldType: PropTypes.string,
  fieldNames: PropTypes.string,
  fieldValues: PropTypes.array,
  fieldUpdateValue: PropTypes.any,
  fieldUpdateBetweenOne: PropTypes.string,
  fieldUpdateBetweenTwo: PropTypes.string,
  fieldId: PropTypes.string,

  onSetFilterAction: PropTypes.func,
  getReportData: PropTypes.func,
  onClickApply: PropTypes.func,
  error: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]),
  resetError: PropTypes.func,

  isAppliedFieldEdit: PropTypes.bool,
  isApplied: PropTypes.bool,
  isUserFilter: PropTypes.bool,
  is_logged_in_user: PropTypes.bool,
};

export default FilterFormBuilder;
