import React from 'react';
import cx from 'classnames/bind';
import { Text, Chip, EChipSize, Tooltip, ETooltipType, ETooltipPlacements } from '@workhall-pvt-lmt/wh-ui-library';
import { useTranslation } from 'react-i18next';
import gClasses from '../../../../../../../scss/Typography.module.scss';
import styles from '../../DataManipulator.module.scss';
import Trash from '../../../../../../../assets/icons/application/Trash';
import Edit from '../../../../../../../assets/icons/application/EditV2';
import { RESPONSE_KEYS } from '../../DataManipulator.constants';
import { EXPRESSION_COLORS } from './Expression.constants';
import { DATA_MANIPULATOR_STEP_CONFIGURATION } from '../../DataManipulator.strings';

function Expression(props) {
    const { t } = useTranslation();
    const { savedRuleData = {}, onEdit = null, onDelete = null, index = null } = props;

    const { EXPRESSION } = DATA_MANIPULATOR_STEP_CONFIGURATION(t);

    const {
        RULE_NAME,
     } = RESPONSE_KEYS;

    console.log('expression manipulation');
    return (
        <div className={styles.SelectedRuleContainer}>
            <Tooltip
                id={`${index}_${EXPRESSION.TOOLTIP_ID}`}
                text={savedRuleData?.[RULE_NAME]}
                tooltipType={ETooltipType.INFO}
                tooltipPlacement={ETooltipPlacements.BOTTOM}
                icon={
                    <Text
                        content={savedRuleData?.[RULE_NAME]}
                        className={cx(styles.RuleName, gClasses.Ellipsis, gClasses.PR8)}
                    />
                }
            />
            <div className={cx(gClasses.DisplayFlex, gClasses.AlignCenter)}>
                <Chip
                    id={`${index}_${EXPRESSION.TOOLTIP_ID}`}
                    text={EXPRESSION.TYPE}
                    size={EChipSize.SM}
                    className={cx(gClasses.FS13, gClasses.FontWeight500, gClasses.LineHeightV2, gClasses.LetterSpacingNormal, styles.ChipStyle)}
                    textClassName={styles.ChipTextStyle}
                    backgroundColor={EXPRESSION_COLORS.BG_COLOR}
                    textColor={EXPRESSION_COLORS.TEXT_COLOR}
                />
                <button
                    className={gClasses.ML8}
                    onClick={onEdit}
                >
                    <Edit />
                </button>
                <button
                    className={gClasses.ML8}
                    onClick={onDelete}
                >
                    <Trash />
                </button>
            </div>
        </div>
    );
}

export default Expression;
