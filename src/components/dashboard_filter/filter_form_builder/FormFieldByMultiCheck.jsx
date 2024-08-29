import React from 'react';
import cx from 'classnames/bind';
import propTypes from 'prop-types';
import {
  CheckboxGroup,
  // MultiDropdown,
  Title,
  ETitleHeadingLevel,
  ECheckboxSize,
} from '@workhall-pvt-lmt/wh-ui-library';
import gClasses from 'scss/Typography.module.scss';
import CloseIcon from 'assets/icons/CloseIcon';
import { keydownOrKeypessEnterHandle } from 'utils/UtilityFunctions';
import { cloneDeep, isArray } from 'utils/jsUtility';
import styles from '../Filter.module.scss';
import { ARIA_ROLES, BS } from '../../../utils/UIConstants';

function FormFieldByMultiCheck(props) {
  const {
    title,
    fieldValues,
    onChangeMultiCheck,
    isFromMoreFilter,
    onCloseCover,
    error,
  } = props;

  let multiCheckElement = null;
  if (isArray(fieldValues)) {
    // if (fieldValues.length <= 4) {
      const cbOptions = cloneDeep(fieldValues).map((fData) => {
        fData.selected = fData.isCheck;
        delete fData.isCheck;
        return fData;
      });
      multiCheckElement = (
        <CheckboxGroup
          id={title}
          hideLabel
          options={cbOptions}
          onClick={onChangeMultiCheck}
          errorMessage={error}
          size={ECheckboxSize.SM}
          className={styles.CheckBoxClass}
        />
      );
    // we need this code for next april 2024 sprint
    // } else {
    //   const ddSelectedValue = cloneDeep(fieldValues)?.filter(
    //     (fData) => fData.isCheck,
    //   );
    //   const ddValue = cloneDeep(ddSelectedValue)?.map((fData) => fData.value);
    //   const ddLabel = cloneDeep(ddSelectedValue)
    //   ?.map((fData) => fData.label)
    //   ?.join(', ');
    //   multiCheckElement = (
    //     <MultiDropdown
    //       id={title}
    //       optionList={fieldValues}
    //       selectedListValue={ddValue || []}
    //       dropdownViewProps={{
    //         selectedLabel: ddLabel || '',
    //         errorMessage: error,
    //       }}
    //       onClick={onChangeMultiCheck}
    //     />
    //   );
    // }
  }

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
      <div>{multiCheckElement}</div>
    </div>
  );
}

FormFieldByMultiCheck.propTypes = {
  title: propTypes.string,
  fieldValues: propTypes.array,
  onChangeMultiCheck: propTypes.func,
  isFromMoreFilter: propTypes.bool,
  onCloseCover: propTypes.bool,
  error: propTypes.string,
};

export default FormFieldByMultiCheck;
