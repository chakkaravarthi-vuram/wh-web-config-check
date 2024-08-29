import React, { useContext } from 'react';
import cx from 'classnames/bind';
import propTypes from 'prop-types';
import { useHistory } from 'react-router';
import { Title, ETitleHeadingLevel } from '@workhall-pvt-lmt/wh-ui-library';
import DatalistPicker from 'components/form_components/datalist_picker/DatalistPicker';
import gClasses from 'scss/Typography.module.scss';
import CloseIcon from 'assets/icons/CloseIcon';
import ThemeContext from 'hoc/ThemeContext';
import {
  isBasicUserMode,
  keydownOrKeypessEnterHandle,
} from 'utils/UtilityFunctions';
import styles from '../Filter.module.scss';
import { datalistPickerChangeHandler } from './FilterFormBuilder.utils';
import { ARIA_ROLES, BS } from '../../../utils/UIConstants';
import { DATALIST_PICKER_CHANGE_HANDLER_TYPES } from '../../../utils/constants/form.constant';

function FormFieldByDatalistPicker(props) {
  const {
    title,
    fieldUpdateValue,
    fieldId,
    onChangeDatalistPicker,
    isFromMoreFilter,
    onCloseCover,
    error,
  } = props;

  const history = useHistory();
  const isNormalMode = isBasicUserMode(history);
  const { colorScheme, colorSchemeDefault } = useContext(ThemeContext);

  const datalistPickerApiParams = {
    field_id: fieldId,
  };

  return (
    <div
      className={cx(
        gClasses.DisplayFlex,
        gClasses.FlexDirectionCol,
        gClasses.Gap8,
      )}
    >
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
      <div>
        <DatalistPicker
          id={title}
          labelText={title}
          hideLabel
          onChange={(field) => {
            const updatedUserTeamObj = datalistPickerChangeHandler(
              fieldUpdateValue,
              field,
              DATALIST_PICKER_CHANGE_HANDLER_TYPES.DATALIST_PICKER_CH_ADD,
            );
            onChangeDatalistPicker(updatedUserTeamObj);
          }}
          onRemove={(id) => {
            const updatedUserTeamObj = datalistPickerChangeHandler(
              fieldUpdateValue,
              id,
              DATALIST_PICKER_CHANGE_HANDLER_TYPES.DATALIST_PICKER_CH_REMOVE,
            );
            onChangeDatalistPicker(updatedUserTeamObj);
          }}
          selectedValue={fieldUpdateValue}
          getParams={() => datalistPickerApiParams}
          errorMessage={error}
          colorScheme={isNormalMode ? colorScheme : colorSchemeDefault}
        />
      </div>
    </div>
  );
}

FormFieldByDatalistPicker.propTypes = {
  title: propTypes.string,
  fieldUpdateValue: propTypes.array,
  fieldId: propTypes.string,
  onChangeDatalistPicker: propTypes.func,
  isFromMoreFilter: propTypes.bool,
  onCloseCover: propTypes.func,
  error: propTypes.string,
};

export default FormFieldByDatalistPicker;
