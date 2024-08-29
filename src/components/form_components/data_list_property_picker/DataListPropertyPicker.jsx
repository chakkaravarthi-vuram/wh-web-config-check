import React from 'react';
import PropTypes from 'prop-types';

import cx from 'classnames/bind';
import gClasses from '../../../scss/Typography.module.scss';
import { BS } from '../../../utils/UIConstants';
import { FORM_TYPES } from '../../../utils/constants/form.constant';
import { EMPTY_STRING } from '../../../utils/strings/CommonStrings';
import { isEmpty } from '../../../utils/jsUtility';
import Label from '../label/Label';

function DataListPropertyPicker(props) {
  const {
      className,
      editIcon,
      deleteIcon,
      isTable,
      formType,
      getValue,
      fieldTypeInstruction,
      fieldData,
      helperTooltipMessage,
      helperToolTipId,
      instructionMessage,
      instructionClass,
    } = props;

  return (
            <div key={fieldData.field_uuid} className={className}>
                <div className={cx(BS.D_FLEX, BS.JC_BETWEEN, BS.ALIGN_ITEM_CENTER)}>
                 {!isTable && (
                 <Label
                    labelFontClass={cx(gClasses.MB7)}
                    labelFor={fieldData.field_uuid}
                    id={`${fieldData.field_uuid}_label`}
                    content={fieldData.field_name}
                    message={helperTooltipMessage}
                    toolTipId={helperToolTipId}
                    hideLabelClass
                 />
                 )}
                 {!isTable
                 ? ((editIcon && fieldTypeInstruction) || editIcon || deleteIcon) && (
                    <div className={cx(gClasses.CenterV, BS.JC_END)}>
                        {fieldTypeInstruction}
                    </div>
                    )
                 : null}
                </div>
                <div
                    role="presentation"
                    className={cx(
                        formType === FORM_TYPES.EDITABLE_FORM
                        ? gClasses.FTwo12GrayV3
                        : cx(gClasses.FTwo12GrayV62, gClasses.Italics),
                    )}
                >
                {getValue()}
                </div>
                {
                    // Instruction Message
                    !isEmpty(instructionMessage) && (
                    <div className={cx(gClasses.FontStyleNormal, gClasses.MT5, gClasses.Fone12GrayV4, gClasses.WordWrap, instructionClass)}>
                      {instructionMessage}
                    </div>
                    )
                }
            </div>
  );
}

export default DataListPropertyPicker;

DataListPropertyPicker.defaultProps = {
    className: EMPTY_STRING,
    editIcon: null,
    deleteIcon: null,
    isTable: false,
    formType: null,
    getValue: EMPTY_STRING,
    fieldTypeInstruction: EMPTY_STRING,
    helperTooltipMessage: EMPTY_STRING,
    helperToolTipId: EMPTY_STRING,
    instructionMessage: EMPTY_STRING,
};

DataListPropertyPicker.propTypes = {
    className: PropTypes.string,
    editIcon: PropTypes.node,
    deleteIcon: PropTypes.node,
    isTable: PropTypes.bool,
    formType: PropTypes.oneOf(Object.values(FORM_TYPES)),
    getValue: PropTypes.func,
    fieldTypeInstruction: PropTypes.string,
    helperTooltipMessage: PropTypes.string,
    helperToolTipId: PropTypes.string,
    instructionMessage: PropTypes.string,
};
