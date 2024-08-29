import React, { useRef } from 'react';
import * as ReactDOMServer from 'react-dom/server';
import cx from 'classnames/bind';
import { BUTTON_TYPE } from 'utils/Constants';
import Button from 'components/form_components/button/Button';
import { EMPTY_STRING } from 'utils/strings/CommonStrings';
import { FORMULA_TAB_TITLE } from 'components/formula_builder/FormulaBuilder.strings';
import { FIELD, TOKENS } from 'components/formula_builder/formula_tokenizer_utils/constants';
import { constructFieldDisplayValue, encodeField } from 'components/formula_builder/formula_tokenizer_utils/formulaBuilder.utils';
import { BS } from 'utils/UIConstants';
import styles from '../formulaEditorTabs.module.scss';
import FormulaEditorToolTip from '../../tool_tip/FormulaEditorToolTip';

function TabData(props) {
   const { id, type, details, onClick, modalId = '' } = props;

   const popperRef = useRef();
   const btnContainerRef = useRef();
   const onClickHandler = () => {
        let displayData = EMPTY_STRING;
        if (type === FORMULA_TAB_TITLE.FIELDS) {
            displayData = ` ${FIELD.PREFIX}${encodeField(details.field_uuid)}${FIELD.SUFFIX}${String.fromCharCode(FIELD.ZERO_WIDTH_NO_BREAK_SPACE)} `;
        } else if (type === FORMULA_TAB_TITLE.FUNCTION) {
            displayData = ` ${details.expression} `;
        }
        onClick(displayData, type, details);
   };

   const getDisplayValue = () => {
       if (type === FORMULA_TAB_TITLE.FIELDS) {
           return constructFieldDisplayValue(details);
       } else if (type === FORMULA_TAB_TITLE.FUNCTION) {
           return details.name;
       }
       return EMPTY_STRING;
   };

   const getPopper = () => {
        if (type === FORMULA_TAB_TITLE.FUNCTION) {
            return ReactDOMServer.renderToStaticMarkup(
                            <FormulaEditorToolTip
                                functionDetails={details}
                                attributes={{ type: TOKENS.KEYWORD }}
                            />,
                        );
        }
     return null;
    };

   const onMouseOver = () => {
      popperRef.current.innerHTML = getPopper();
      const field_config_element = document.getElementById(
        modalId ? `Modal-${modalId}` : 'modal-content-field-config-modal',
      );
      const modalRect = field_config_element.getBoundingClientRect();
      const popperRect = popperRef.current.getBoundingClientRect();
      const buttonContainerRect = btnContainerRef.current.getBoundingClientRect();
      const popperData = {
        xMinimumPixel: modalRect.left,
        xMaximumPixel: modalRect.left + modalRect.width,
        popperHeight: popperRect.height,
        popperWidth: popperRect.width,
        buttonX: buttonContainerRect.left,
        buttonY: buttonContainerRect.top,
     };
     let x = popperData.xMinimumPixel;
     const y = popperData.buttonY - (popperData.popperHeight + 4);

    //  Popper x
        if (popperData.xMaximumPixel - popperData.buttonX < popperData.popperWidth) {
            x = popperData.xMaximumPixel - popperData.popperWidth;
        } else x = popperData.buttonX;

        popperRef.current.setAttribute(
            'style',
            `top: ${y}px; left: ${x}px; z-index: 2; visbility: visible`,
           );
   };

   const onMouseLeave = () => {
         popperRef.current.innerHTML = null;
         popperRef.current.setAttribute(
             'style',
             'visibility: hidden;  z-index: -1',
         );
   };
    return (
        <div className={styles.ButtonContainer} ref={btnContainerRef}>
        <Button
            id={id}
            buttonType={BUTTON_TYPE.SECONDARY}
            className={cx(styles.TabButton, styles[type])}
            onClick={onClickHandler}
            onMouseOver={onMouseOver}
            onMouseLeave={onMouseLeave}
        >
            {getDisplayValue()}
            <span ref={popperRef} className={cx(BS.P_FIXED, styles.TabDataPopper)} />
        </Button>
        </div>
    );
}

export default TabData;
