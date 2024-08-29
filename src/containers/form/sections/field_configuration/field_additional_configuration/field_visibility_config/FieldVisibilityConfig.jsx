import React, { useState } from 'react';
import {
  Button,
  Chip,
  Label,
  Text,
  EButtonSizeType,
  RadioGroup,
  RadioGroupLayout,
} from '@workhall-pvt-lmt/wh-ui-library';
import cx from 'classnames/bind';
import gClasses from 'scss/Typography.module.scss';
import { useTranslation } from 'react-i18next';
import Plus from 'assets/icons/configuration_rule_builder/Plus';
import Edit from 'assets/icons/application/EditV2';
import Trash from 'assets/icons/application/Trash';
import { EMPTY_STRING } from 'utils/strings/CommonStrings';
import { DEFAULT_COLORS_CONSTANTS } from 'utils/UIConstants';
import { RULE_TYPE } from 'utils/constants/rule/rule.constant';
import styles from '../FieldAdditionalConfiguration.module.scss';
import { FIELD_CONFIGURATIONS_CONSTANTS } from '../../FieldConfiguration.constants';
import FieldVisibilityRuleConfig from '../../../../../form_configuration/field_visibility/field_visibility_rule_config/FieldVisibilityRuleConfig';
import { get, isEmpty } from '../../../../../../utils/jsUtility';
import { RESPONSE_FIELD_KEYS } from '../../../../../../utils/constants/form/form.constant';

function FieldVisibilityConfig(props) {
  const {
    metaData,
    moduleType,
    fieldDetails,
    setFieldDetails,
    tableUUID,
    isShowValueEmpty = false,
  } = props;
  const { t } = useTranslation();
  const {
    ADDITIONAL_CONFIG: { VISIBILITY },
  } = FIELD_CONFIGURATIONS_CONSTANTS(t);
  const [conditionVisible, setConditionVisible] = useState(false);

  const onSave = (rule) => {
    setFieldDetails({
      ...fieldDetails,
      [RESPONSE_FIELD_KEYS.RULE_UUID]: rule.rule_uuid,
      [RESPONSE_FIELD_KEYS.RULE_NAME]: rule.rule_name,
    });
  };

  const onDeleteRule = () => {
    setFieldDetails({
      ...fieldDetails,
      [RESPONSE_FIELD_KEYS.RULE_UUID]: EMPTY_STRING,
      [RESPONSE_FIELD_KEYS.RULE_NAME]: EMPTY_STRING,
    });
  };

  const getVisibilityRuleConfigModal = () => (
    <FieldVisibilityRuleConfig
      ruleUUID={get(fieldDetails, [RESPONSE_FIELD_KEYS.RULE_UUID])}
      metaData={metaData}
      moduleType={moduleType}
      isModalOpen={conditionVisible}
      setIsModalOpen={setConditionVisible}
      onClose={() => setConditionVisible(false)}
      onSave={onSave}
      ruleType={RULE_TYPE.VISIBILITY}
      tableUUID={tableUUID}
      ruleNameGenerate={fieldDetails[RESPONSE_FIELD_KEYS.FIELD_NAME]}
    />
  );

  return (
    <div>
      {conditionVisible && getVisibilityRuleConfigModal()}
      <Text
        content={VISIBILITY.TITLE}
        className={cx(gClasses.FTwo16GrayV3, gClasses.FontWeight500)}
      />
      <Label labelName={VISIBILITY.CONDITION.LABEL} className={gClasses.MT12} />
      <div className={cx(gClasses.MT6, styles.VisibilityContainer)}>
        {isEmpty(fieldDetails[RESPONSE_FIELD_KEYS.RULE_UUID]) ? (
          <button
            className={cx(gClasses.FTwo13BlueV39, gClasses.FontWeight500)}
            onClick={() => setConditionVisible(true)}
          >
            <Plus className={gClasses.MR8} />
            {VISIBILITY.CONDITION.ADD_CONDITION}
          </button>
        ) : (
          <div
            className={cx(
              styles.SelectedRuleContainer,
              gClasses.CenterV,
              gClasses.JusSpaceBtw,
            )}
          >
            <Text
              content={fieldDetails[RESPONSE_FIELD_KEYS.RULE_NAME]}
              title={fieldDetails[RESPONSE_FIELD_KEYS.RULE_NAME]}
              className={cx(
                gClasses.Ellipsis,
                gClasses.FTwo13BlackV20,
                gClasses.FontWeight500,
                gClasses.PR10,
              )}
            />
            <div className={gClasses.DisplayFlex}>
              <Chip
                text={VISIBILITY.CONDITION.EXPRESSION_OR_CALCULATION}
                size={EButtonSizeType.SM}
                className={cx(
                  gClasses.FS13,
                  gClasses.FontWeight500,
                  gClasses.LineHeightV2,
                  gClasses.LetterSpacingNormal,
                  styles.ChipStyle,
                )}
                textClassName={styles.ChipTextStyle}
                backgroundColor={DEFAULT_COLORS_CONSTANTS.LIGHT_BLUE}
                textColor={DEFAULT_COLORS_CONSTANTS.BLUE_V39}
              />
              <Button
                icon={<Edit className={styles.EditIcon} />}
                size={EButtonSizeType.SM}
                iconOnly
                type={EMPTY_STRING}
                className={styles.ButtonContainer}
                onClickHandler={() => setConditionVisible(true)}
              />
              <Button
                icon={<Trash />}
                size={EButtonSizeType.SM}
                iconOnly
                type={EMPTY_STRING}
                className={styles.ButtonContainer}
                onClickHandler={onDeleteRule}
              />
            </div>
          </div>
        )}
      </div>
      {isShowValueEmpty && (
        <RadioGroup
          labelText={VISIBILITY.WHEN_VALUE_EMPTY.LABEL}
          selectedValue={fieldDetails?.[RESPONSE_FIELD_KEYS.HIDE_FIELD_IF_NULL]}
          options={VISIBILITY.WHEN_VALUE_EMPTY.OPTION}
          onChange={(_event, _id, value) =>
            setFieldDetails({
              ...fieldDetails,
              [RESPONSE_FIELD_KEYS.HIDE_FIELD_IF_NULL]: value,
            })
          }
          layout={RadioGroupLayout.inline}
          className={cx(gClasses.MT16, gClasses.MB16)}
        />
      )}
    </div>
  );
}

export default FieldVisibilityConfig;
