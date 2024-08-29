import { Checkbox, ETitleHeadingLevel, ETitleSize, Size, TextArea, TextInput, Title, ECheckboxSize, ETooltipPlacements } from '@workhall-pvt-lmt/wh-ui-library';
import React from 'react';
import { useTranslation } from 'react-i18next';
import gClasses from 'scss/Typography.module.scss';
import cx from 'classnames/bind';

import { FIELD_CONFIG } from '../../../../../../components/form_builder/FormBuilder.strings';
import { PLACEHOLDER_APPLICABLE_FIELD_TYPES } from './FieldGuidanceConfiguration.utils';
import { RESPONSE_FIELD_KEYS, RESPONSE_VALIDATION_KEYS } from '../../../../../../utils/constants/form/form.constant';
import { FIELD_TYPES } from '../../FieldConfiguration.strings';
import { VALIDATION_CONFIG_STRINGS } from '../../validation_and_visibility_configuration/validation_configuration/ValidationConfiguration.strings';
import jsUtility from '../../../../../../utils/jsUtility';
import styles from '../advance_technical_configuration/AdvancedTechnicalConfiguration.module.scss';
import { FIELD_LIST_OBJECT } from '../../basic_configuration/BasicConfiguration.constants';

function FieldGuidanceConfiguration(props) {
  const { setFieldDetails, fieldDetails } = props;
  const { errorList } = fieldDetails;
  const { t } = useTranslation();
  const { OTHER_CONFIG } = FIELD_CONFIG(t);
  // CHange naming
  const isPlaceholderApplicable = PLACEHOLDER_APPLICABLE_FIELD_TYPES.includes(fieldDetails?.[RESPONSE_FIELD_KEYS.FIELD_TYPE]);

  const getEllipsisContent = () => (
    <div>
    <Checkbox
        className={cx(gClasses.MT16, gClasses.CenterV)}
        isValueSelected={fieldDetails?.[RESPONSE_VALIDATION_KEYS[FIELD_TYPES.PARAGRAPH].SHOW_ELLIPSIS]}
        details={VALIDATION_CONFIG_STRINGS(t).SHOW_ELLIPSIS.OPTION_LIST[0]}
        size={ECheckboxSize.SM}
        onClick={() => {
            if (fieldDetails?.[RESPONSE_VALIDATION_KEYS[FIELD_TYPES.PARAGRAPH].SHOW_ELLIPSIS]) {
                const clonedDetails = jsUtility.cloneDeep(fieldDetails);
                delete clonedDetails?.[RESPONSE_VALIDATION_KEYS[FIELD_TYPES.PARAGRAPH].ELLIPSIS_LENGTH];
                console.log('herex', clonedDetails);
                setFieldDetails({
                    ...clonedDetails,
                    [RESPONSE_VALIDATION_KEYS[FIELD_TYPES.PARAGRAPH].SHOW_ELLIPSIS]: !fieldDetails?.[RESPONSE_VALIDATION_KEYS[FIELD_TYPES.PARAGRAPH].SHOW_ELLIPSIS],
                });
            } else {
                setFieldDetails({
                    ...fieldDetails,
                    [RESPONSE_VALIDATION_KEYS[FIELD_TYPES.PARAGRAPH].SHOW_ELLIPSIS]: !fieldDetails?.[RESPONSE_VALIDATION_KEYS[FIELD_TYPES.PARAGRAPH].SHOW_ELLIPSIS],
                });
            }
        }}
        checkboxViewLabelClassName={cx(gClasses.FTwo13BlackV20, gClasses.CheckboxClass)}
    />
    {fieldDetails?.[RESPONSE_VALIDATION_KEYS[FIELD_TYPES.PARAGRAPH].SHOW_ELLIPSIS] &&
    <TextInput
        className={gClasses.MT16}
        id={VALIDATION_CONFIG_STRINGS(t).ELLIPSIS_LENGTH.ID}
        placeholder={VALIDATION_CONFIG_STRINGS(t).ELLIPSIS_LENGTH.PLACEHOLDER}
        type="number"
        onChange={(event) => {
            setFieldDetails({
                ...fieldDetails,
                [RESPONSE_VALIDATION_KEYS[FIELD_TYPES.PARAGRAPH].ELLIPSIS_LENGTH]: Number(event.target.value),
            });
        }}
        value={fieldDetails?.[RESPONSE_VALIDATION_KEYS[FIELD_TYPES.PARAGRAPH].ELLIPSIS_LENGTH]}
        errorMessage={errorList[VALIDATION_CONFIG_STRINGS(t).ELLIPSIS_LENGTH.ID]}
        size={Size.lg}
    />}
    </div>
  );
    return (
        <>
            <Title
                content={OTHER_CONFIG.TITLE}
                headingLevel={ETitleHeadingLevel.h4}
                className={cx(gClasses.MB16, gClasses.FTwo16GrayV3)}
                size={ETitleSize.xs}
            />
            {isPlaceholderApplicable &&
                <TextInput
                id={OTHER_CONFIG.PLACEHOLDER_VALUE.ID}
                placeholder={OTHER_CONFIG.PLACEHOLDER_VALUE.PLACEHOLDER}
                labelText={OTHER_CONFIG.PLACEHOLDER_VALUE.LABEL}
                helpTooltip={OTHER_CONFIG.PLACEHOLDER_VALUE.HELPER_TOOLTIP}
                helpTooltipPlacement={ETooltipPlacements.RIGHT}
                innerLabelClass={gClasses.Margin0}
                onChange={(event) =>
                    setFieldDetails({
                        ...fieldDetails,
                        [RESPONSE_FIELD_KEYS.PLACEHOLDER]: event?.target?.value,
                    })
                }
                value={fieldDetails?.[RESPONSE_FIELD_KEYS.PLACEHOLDER]}
                errorMessage={errorList?.[RESPONSE_FIELD_KEYS.PLACEHOLDER]}
                size={Size.lg}
                />
            }

            {(fieldDetails[RESPONSE_FIELD_KEYS.FIELD_TYPE] !== FIELD_TYPES.SCANNER &&
            fieldDetails[RESPONSE_FIELD_KEYS.FIELD_TYPE] !== FIELD_TYPES.INFORMATION) &&
            <TextArea
                id={OTHER_CONFIG.INSTRUCTION.ID}
                className={gClasses.MT16}
                placeholder={OTHER_CONFIG.INSTRUCTION.PLACEHOLDER}
                labelText={OTHER_CONFIG.INSTRUCTION.LABEL}
                helpTooltip={OTHER_CONFIG.INSTRUCTION.HELPER_TOOLTIP}
                helpTooltipPlacement={ETooltipPlacements.RIGHT}
                labelClassName={styles.Margin0}
                onChange={(event) =>
                    setFieldDetails({
                        ...fieldDetails,
                        [RESPONSE_FIELD_KEYS.INSTRUCTION]: event?.target?.value,
                    })
                }
                value={fieldDetails?.[RESPONSE_FIELD_KEYS.INSTRUCTION]}
                errorMessage={errorList?.[RESPONSE_FIELD_KEYS.INSTRUCTION]}
                size={Size.sm}
            />
            }

            {(fieldDetails[RESPONSE_FIELD_KEYS.FIELD_TYPE] !== FIELD_TYPES.SCANNER &&
            fieldDetails[RESPONSE_FIELD_KEYS.FIELD_TYPE] !== FIELD_TYPES.INFORMATION) &&
            <TextInput
                id={OTHER_CONFIG.HELPER_TOOL_TIP.ID}
                placeholder={OTHER_CONFIG.HELPER_TOOL_TIP.PLACEHOLDER}
                labelText={OTHER_CONFIG.HELPER_TOOL_TIP.LABEL}
                helpTooltip={OTHER_CONFIG.HELPER_TOOL_TIP.HELPER_TOOLTIP}
                helpTooltipPlacement={ETooltipPlacements.RIGHT}
                className={gClasses.MT16}
                innerLabelClass={gClasses.Margin0}
                onChange={(event) =>
                    setFieldDetails({
                        ...fieldDetails,
                        [RESPONSE_FIELD_KEYS.HELPER_TOOLTIP]: event?.target?.value,
                    })
                }
                value={fieldDetails?.[RESPONSE_FIELD_KEYS.HELPER_TOOLTIP]}
                errorMessage={errorList?.[RESPONSE_FIELD_KEYS.HELPER_TOOLTIP]}
                size={Size.lg}
            />
            }
            {(fieldDetails[RESPONSE_FIELD_KEYS.FIELD_TYPE] === FIELD_TYPES.SCANNER ||
            fieldDetails[RESPONSE_FIELD_KEYS.FIELD_TYPE] === FIELD_TYPES.INFORMATION) &&
            <Title
                content={`${t('form_field_strings.validation_config.field_guidance_not_applicable')} '${FIELD_LIST_OBJECT(t)?.[fieldDetails?.[RESPONSE_FIELD_KEYS.FIELD_TYPE]]}' ${t('form_field_strings.validation_config.fields')}.`}
                className={cx(gClasses.MB16, gClasses.FontSize13)}
                size={ETitleSize.xs}
            />}
            {fieldDetails?.[RESPONSE_FIELD_KEYS.FIELD_TYPE] === FIELD_TYPES.PARAGRAPH && getEllipsisContent()}
        </>
    );
  }

  export default FieldGuidanceConfiguration;
