import React, { useState } from 'react';
import cx from 'classnames/bind';
import Skeleton from 'react-loading-skeleton';
import PropTypes from 'prop-types';

import gClasses from '../../../scss/Typography.module.scss';
import styles from './EditableLabel.module.scss';
import { BS } from '../../../utils/UIConstants';
import HelperMessage, { HELPER_MESSAGE_TYPE } from '../helper_message/HelperMessage';

function EditableLabel(props) {
  const {
    value,
    onChangeHandler,
    id,
    placeholder,
    className,
    textClasses,
    errorMessage,
    onBlurHandler,
    isDataLoading,
    style,
    noLabelPadding,
    autoComplete,
    readOnly,
    isEnableInputTooltip,
  } = props;
  const [isEditable, setEditableStatus] = useState(false);
  const padding = !noLabelPadding && cx(gClasses.PL10, gClasses.PR10);

  return (
    isDataLoading ? (
        <div className={cx(gClasses.PL10, gClasses.PR10, className, style)}>
          <Skeleton />
        </div>
      ) : (
        <>
          <div
            className={cx(
              styles.Container,
              padding,
              isEditable && styles.BackgroundBox,
              isEditable && (!readOnly && styles.Editable),
              className,
              gClasses.CenterV,
              errorMessage ? gClasses.ErrorInputBorder : null,
            )}
            style={style}
          >
            <input
              id={id}
              autoComplete={autoComplete}
              className={cx(styles.Input, textClasses, BS.W100)}
              placeholder={placeholder}
              value={value}
              onChange={onChangeHandler}
              onBlur={(e) => {
                setEditableStatus(false);
                if (onBlurHandler) onBlurHandler(e);
              }}
              onClick={() => setEditableStatus(true)}
              readOnly={readOnly}
              title={isEnableInputTooltip ? value : null}
            />
          </div>
          {errorMessage ? (
            <HelperMessage
              message={errorMessage}
              type={HELPER_MESSAGE_TYPE.ERROR}
              className={cx(gClasses.ErrorMarginV1, padding)}
            />
          ) : null}
        </>
      )
  );
}

EditableLabel.defaultProps = {
  value: '',
  onChangeHandler: null,
  id: '',
  placeholder: '',
  className: null,
  textClasses: '',
  errorMessage: '',
  onBlurHandler: null,
  isDataLoading: false,
  style: null,
  noLabelPadding: false,
  readOnly: false,
  isEnableInputTooltip: false,
};

EditableLabel.propTypes = {
  value: PropTypes.string,
  onChangeHandler: PropTypes.func,
  id: PropTypes.string,
  placeholder: PropTypes.string,
  className: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  textClasses: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  errorMessage: PropTypes.string,
  onBlurHandler: PropTypes.func,
  isDataLoading: PropTypes.bool,
  style: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  noLabelPadding: PropTypes.bool,
  readOnly: PropTypes.bool,
  isEnableInputTooltip: PropTypes.bool,
};

export default EditableLabel;
