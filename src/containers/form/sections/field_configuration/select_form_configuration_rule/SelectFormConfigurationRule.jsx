import { Button, EButtonSizeType, Text, Chip } from '@workhall-pvt-lmt/wh-ui-library';
import cx from 'classnames/bind';
import { useTranslation } from 'react-i18next';
import React from 'react';
import gClasses from 'scss/Typography.module.scss';
import Edit from '../../../../../assets/icons/application/EditV2';
import Trash from '../../../../../assets/icons/application/Trash';
import { EMPTY_STRING } from '../../../../../utils/strings/CommonStrings';
import styles from './SelectFormConfigurationRule.module.scss';
import { VALUE_CONFIG_TYPES } from '../../../Form.string';
import { SELECT_RULE_STRINGS } from './SelectFormConfigurationRule.strings';

function SelectFormConfigurationRule(props) {
  const { onDelete, onEdit, savedRuleData = {}, type } = props;
  const { t } = useTranslation();
  return (
    <div className={styles.SelectedRuleContainer}>
      <Text content={savedRuleData?.ruleName} title={savedRuleData?.ruleName} className={cx(gClasses.Ellipsis, gClasses.PR10)} />
      <div className={gClasses.DisplayFlex}>
           <Chip text={type === VALUE_CONFIG_TYPES.EXTERNAL_DATA ? SELECT_RULE_STRINGS(t).EXTERNAL_SOURCE : SELECT_RULE_STRINGS(t).FORMULA_EXPRESSION} size={EButtonSizeType.SM} className={cx(gClasses.FS13, gClasses.FontWeight500, gClasses.LineHeightV2, gClasses.LetterSpacingNormal, styles.ChipStyle)} textClassName={styles.ChipTextStyle} backgroundColor="#e8f2fe" textColor="#217cf5" />
        <Button
          icon={<Edit className={styles.EditIcon} />}
          onClickHandler={onEdit}
          size={EButtonSizeType.SM}
          iconOnly
          type={EMPTY_STRING}
          className={styles.ButtonContainer}
        />
        <Button
          icon={<Trash />}
          onClickHandler={onDelete}
          size={EButtonSizeType.SM}
          iconOnly
          type={EMPTY_STRING}
          className={styles.ButtonContainer}
        />
      </div>
    </div>
  );
}

export default SelectFormConfigurationRule;
