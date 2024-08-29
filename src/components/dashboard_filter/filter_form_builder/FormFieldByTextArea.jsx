import React from 'react';
import cx from 'classnames/bind';
import propTypes from 'prop-types';
import {
  TextArea,
  Title,
  ETitleHeadingLevel,
} from '@workhall-pvt-lmt/wh-ui-library';
import gClasses from 'scss/Typography.module.scss';
import CloseIcon from 'assets/icons/CloseIcon';
import { keydownOrKeypessEnterHandle } from 'utils/UtilityFunctions';
import { ARIA_ROLES, BS } from '../../../utils/UIConstants';
import styles from '../Filter.module.scss';

function FormFieldByTextArea(props) {
  const {
    title,
    fieldUpdateValue,
    onChangeSingleLine,
    isFromMoreFilter,
    onCloseCover,
    error,
  } = props;

  const textAreaElement = (
    <TextArea
      id={title}
      inputInnerClassName={gClasses.FOne13BlackV1}
      placeholder={title}
      onChange={onChangeSingleLine}
      value={fieldUpdateValue}
      className={gClasses.MB10}
      errorMessage={error}
    />
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
      <div>{textAreaElement}</div>
    </div>
  );
}

FormFieldByTextArea.propTypes = {
  title: propTypes.string,
  fieldUpdateValue: propTypes.string,
  onChangeSingleLine: propTypes.func,
  isFromMoreFilter: propTypes.bool,
  onCloseCover: propTypes.func,
  error: propTypes.string,
};

export default FormFieldByTextArea;
