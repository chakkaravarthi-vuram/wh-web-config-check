import React from 'react';
import cx from 'classnames';
import Radium from 'radium';
import propTypes from 'prop-types';
import { Row, Col } from 'reactstrap';

import CloseIcon from 'assets/icons/CloseIcon';
import { keydownOrKeypessEnterHandle } from 'utils/UtilityFunctions';
import { BUTTON_TYPE } from '../../../utils/Constants';
import styles from './ButtonMultiCheck.module.scss';
import gClasses from '../../../scss/Typography.module.scss';
import { ARIA_ROLES, BS } from '../../../utils/UIConstants';
import { EMPTY_STRING } from '../../../utils/strings/CommonStrings';
import Label from '../label/Label';
import ButtonCheck from '../button_check/ButtonCheck';

function ButtonMultiCheck(props) {
  const {
    id,
    onClick,
    isRequired,
    hideLabel,
    label,
    valueList,
    isDataLoading,
    isFromMoreFilter,
    onCloseCover,
    errorMessage,
  } = props;
  const fieldId = !id ? label.replace(/\s/g, '') : id;
  const mainLabel = label;
  const getElementButtonMultiCheck =
    valueList &&
    valueList.length > 0 &&
    valueList.map((valueData, index) => {
      if (valueData) {
        const { label, isCheck, value } = valueData;
        return (
          <ButtonCheck
            id={index === 0 ? fieldId : null}
            label={label}
            mainLabel={mainLabel}
            buttonLabelId={`${fieldId}_label_${index}`}
            isCheck={isCheck}
            onClick={() => onClick(label, isCheck, value, index)}
          />
        );
      }
      return null;
    });

  return (
    <Row>
      <Col>
        <Row>
          <Col className={cx(BS.D_FLEX, BS.JC_BETWEEN)}>
            {!hideLabel && (
              <Label
                id={`${fieldId}_label`}
                labelFor={fieldId}
                content={label}
                isRequired={isRequired}
                isDataLoading={isDataLoading}
                innerClassName={
                  isFromMoreFilter ? gClasses.FTwo13BlackV2 : cx(styles.FieldTitle, gClasses.FieldName)
                }
              />
            )}
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
                ariaLabel={`Remove ${label} filter`}
                onKeyDown={(e) => keydownOrKeypessEnterHandle(e) && onCloseCover()}
              />
            )}
          </Col>
        </Row>
        <Row className={cx(BS.D_FLEX)}>
          <Col>{!isDataLoading && getElementButtonMultiCheck}</Col>
          {errorMessage &&
          <div className={cx(gClasses.FTwo12RedV18, gClasses.ErrorMarginV1, gClasses.LineHeightNormal, gClasses.PX16)}>{errorMessage}</div>}
        </Row>
      </Col>
    </Row>
  );
}
ButtonMultiCheck.defaultProps = {
  onClick: null,
  id: null,
  className: null,
  disabled: false,
  onMouseDown: null,
  onBlur: null,
  style: null,
  isDataLoading: false,
  testId: EMPTY_STRING,
};
ButtonMultiCheck.propTypes = {
  onClick: propTypes.func,
  id: propTypes.string,
  valueList: propTypes.oneOfType([
    propTypes.arrayOf(propTypes.node),
    propTypes.node,
    propTypes.string,
  ]).isRequired,
  className: propTypes.string,
  disabled: propTypes.bool,
  onMouseDown: propTypes.func,
  onBlur: propTypes.func,
  style: propTypes.string,
  isDataLoading: propTypes.bool,
  testId: propTypes.string,
};
export { BUTTON_TYPE };

export default Radium(ButtonMultiCheck);
