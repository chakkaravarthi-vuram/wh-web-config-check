import React, { useRef } from 'react';
import AutoPositioningPopper, { POPPER_PLACEMENTS } from 'components/auto_positioning_popper/AutoPositioningPopper';
import cx from 'classnames/bind';
import gClasses from 'scss/Typography.module.scss';
import Button, { BUTTON_TYPE } from 'components/form_components/button/Button';
import { BS } from 'utils/UIConstants';
import { FORMULA_EXPRESSION_COMMON_STRINGS } from 'components/formula_builder/FormulaBuilder.strings';
import { useClickOutsideDetector } from 'utils/UtilityFunctions';
import { useTranslation } from 'react-i18next';
import styles from './ClearConfirmation.module.scss';

function ClearFormulaConfirmation(props) {
    const { isPopperOpen, referenceElement, closeClearModal, onClearClick } = props;
    const { t } = useTranslation();
    const wrapperRef = useRef(null);
    useClickOutsideDetector(wrapperRef, closeClearModal);

    return (
        <AutoPositioningPopper
            isPopperOpen={isPopperOpen}
            referenceElement={referenceElement}
            placement={POPPER_PLACEMENTS.BOTTOM}
            className={cx(gClasses.ZIndex2, styles.PopperPosition)}
        >
            <div className={cx(styles.ClearContainer)} ref={wrapperRef}>
                <h3 className={cx(gClasses.FTwo12GrayV3, gClasses.FontWeight500)}>{FORMULA_EXPRESSION_COMMON_STRINGS(t).CONFIRMATION_MESSAGE}</h3>
                <div className={cx(BS.D_FLEX, BS.JC_CENTER, gClasses.MT15)}>
                    <Button
                        buttonType={BUTTON_TYPE.SECONDARY}
                        className={cx(gClasses.FTwo11, gClasses.FontWeight600, styles.ConfirmButton, gClasses.MR8)}
                        onClick={() => closeClearModal()}
                    >
                        {FORMULA_EXPRESSION_COMMON_STRINGS(t).NO}
                    </Button>
                    <Button
                        buttonType={BUTTON_TYPE.PRIMARY}
                        className={cx(gClasses.FTwo11, gClasses.FontWeight600, styles.ConfirmButton)}
                        onClick={() => onClearClick()}
                    >
                        {FORMULA_EXPRESSION_COMMON_STRINGS(t).YES}
                    </Button>
                </div>
            </div>
        </AutoPositioningPopper>
    );
}

export default ClearFormulaConfirmation;
