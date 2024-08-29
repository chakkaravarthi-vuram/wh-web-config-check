import { Button, EButtonType, ETitleHeadingLevel, ETitleSize, NestedDropdown, Title, EPopperPlacements, Text } from '@workhall-pvt-lmt/wh-ui-library';
import cx from 'classnames';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import gClasses from 'scss/Typography.module.scss';
import PropTypes from 'prop-types';
import styles from './ExternalSourceSelection.module.scss';
import PlusIconBlueNew from '../../../../../assets/icons/PlusIconBlueNew';
import AutoPositioningPopper, { POPPER_PLACEMENTS } from '../../../../../components/auto_positioning_popper/AutoPositioningPopper';
import { CancelToken, useClickOutsideDetector, validate } from '../../../../../utils/UtilityFunctions';
import jsUtility, { isEmpty } from '../../../../../utils/jsUtility';
import { EMPTY_STRING } from '../../../../../utils/strings/CommonStrings';
import { DEFAULT_VALUE_FIELD_CONFIG_STRINGS } from '../field_value_configuration/FieldValueConfiguration.strings';
import { SELECT_RULE_STRINGS } from '../select_form_configuration_rule/SelectFormConfigurationRule.strings';
import { selectedRuleSchema } from '../select_form_configuration_rule/SelectFormConfigurationRule.validate.schema';
import { getModuleIdByModuleType } from '../../../Form.utils';
import { LeftArrowIcon, RightArrowIcon } from '../../../../../assets/icons/DirectionArrows';
import { DEFAULT_VALUE_CONFIG_STRINGS } from '../../../../../components/form_builder/field_config/basic_config/DefaultValueRule.strings';
import { getDataRules } from '../../../../../axios/apiService/form.apiService';
import { RESPONSE_FIELD_KEYS } from '../../../../../utils/constants/form/form.constant';

function ExternalSourceSelection(props) {
  const { onSave, metaData, moduleType, ruleData, isModalOpen, setIsModalOpen, isEditMode,
    fieldDetails, isTableField, tableExternalRule = {} } = props;
  const referencePopperElement = useRef(null);
  const [selectedRule, setSelectedRule] = useState({});
  const [selectedField, setSelectedField] = useState({});
  const [rules, setRules] = useState([]);
  const [displayText, setDisplayText] = useState('');

  const { t } = useTranslation();
  const wrapperRef = useRef(null);

  useClickOutsideDetector(wrapperRef, () => {
    setIsModalOpen(false);
    setSelectedRule({});
    setSelectedField({});
  });

  const closeRulePopup = () => {
    setIsModalOpen(false);
    setSelectedRule({});
    setSelectedField({});
    setDisplayText(EMPTY_STRING);
  };

  const saveSelectedRule = () => {
    const errorList = validate(selectedRule?._id, selectedRuleSchema);
    if (isEmpty(errorList)) {
      setIsModalOpen(false);
      onSave(selectedRule, selectedField.fieldUUID, selectedField?.parentUUID);
    }
  };

  useEffect(() => {
    if (ruleData && !isEmpty(rules)) {
      const currentSelectedRule = rules?.find((rule) => (rule?.rule_uuid === ruleData?.source) || (rule?.rule_uuid === tableExternalRule?.source));
      let fieldName = '';
      currentSelectedRule?.rule?.output_format?.find((field) => {
        if (field?.type === 'table' || field?.type === 'object') {
          const tableField = field?.column_mapping?.find((eachMapping) => ruleData?.childData.includes(eachMapping.uuid));
          if (tableField) {
            fieldName = tableField?.name;
            return true;
          }
        } else if (field?.uuid === ruleData?.childData) {
            fieldName = field?.name;
            return true;
        }
        return false;
      });
      setDisplayText(`Name: ${fieldName}`);
    }
  }, [rules]);
  useEffect(() => {
    const fieldsCancelToken = new CancelToken();
    const isExternalRuleInTable = ((tableExternalRule?.type === 'external_data') || (ruleData?.type === 'external_data')) && (ruleData?.is_inherit_from_parent || tableExternalRule?.is_inherit_from_parent);
    console.log('tabl iss', isExternalRuleInTable, ruleData, tableExternalRule);
    const params = {
      page: 1,
      size: 15,
      ...getModuleIdByModuleType(metaData, moduleType, false),
      field_type: fieldDetails?.[RESPONSE_FIELD_KEYS.FIELD_TYPE],
      ...isTableField && {
        rule_uuid: ruleData?.[RESPONSE_FIELD_KEYS.RULE_UUID] || tableExternalRule?.[RESPONSE_FIELD_KEYS.SOURCE],
        // ...(tableExternalRule?.[RESPONSE_FIELD_KEYS.CHILD_DATA]) && {
        //   table_uuid: isExternalRuleInTable ? tableExternalRule?.[RESPONSE_FIELD_KEYS.CHILD_DATA] : ruleData?.[RESPONSE_FIELD_KEYS.CHILD_DATA],
        // },
      },
    };
    getDataRules(params, fieldsCancelToken?.setCancelToken)
    .then((response) => {
      const data = response?.pagination_data;
      setRules(jsUtility.compact(data.map((ruleData) => ruleData)));
    });
  }, []);

  return (
    <div ref={referencePopperElement} className={isEditMode && cx(gClasses.DisplayFlex, gClasses.JusEnd)}>
      {!isEditMode &&
      <button
        onClick={() => setIsModalOpen(!isModalOpen)}
        className={cx(
          gClasses.P0,
          gClasses.MT10,
          gClasses.MR12,
          gClasses.CenterV,
        )}
      >
        <PlusIconBlueNew />
        <Text className={cx(gClasses.BlueIconBtn, gClasses.ML12, gClasses.FTwo13Important)} content={DEFAULT_VALUE_FIELD_CONFIG_STRINGS(t).DEFAULT_VALUE.EXTERNAL_SOURCE.BUTTON} />
      </button>}
      <AutoPositioningPopper
        className={styles.ChoosePopup}
        placement={!isEditMode ? POPPER_PLACEMENTS.BOTTOM_START : POPPER_PLACEMENTS.RIGHT_END}
        isPopperOpen={isModalOpen}
        referenceElement={referencePopperElement}
        onBlur={() => {
          closeRulePopup();
        }}
      >
        <div className={cx(styles.PopperLayout, gClasses.P24)} ref={wrapperRef}>
          <Title
            content={!isEditMode ?
              DEFAULT_VALUE_FIELD_CONFIG_STRINGS(t).DEFAULT_VALUE
                .EXTERNAL_SOURCE.TITLE : DEFAULT_VALUE_FIELD_CONFIG_STRINGS(t).DEFAULT_VALUE.EXTERNAL_SOURCE.EDIT_TITLE
            }
            headingLevel={ETitleHeadingLevel.h4}
            className={cx(
              gClasses.MB16,
              gClasses.FTwo13GrayV89,
            )}
            size={ETitleSize.xs}
          />
          <NestedDropdown
            className={gClasses.MB24}
            displayText={displayText}
            popperClass={styles.ExternalPopper}
            popperPlacement={EPopperPlacements.BOTTOM_START}
            totalViews={3}
            label="Select an Option"
          >
            {({ close, view, nextView, prevView }) => {
                if (view === 1) {
                  if (rules.length === 0) {
                    return (
                      <Text
                        className={styles.NoDataText}
                        content="No data found"
                      />
                    );
                  } else {
                      return (
                          <div>
                              {rules.map((ruleData, index) => (
                                  <button
                                      key={`${ruleData?.rule_name},${index}`}
                                      className={styles.EachRule}
                                      onClick={() => { setSelectedRule(ruleData); nextView(); }}
                                  >
                                      <span>{ruleData?.rule_name}</span>
                                      <div className={cx(gClasses.DisplayFlex, gClasses.CenterV)}>
                                      <span>{ruleData?.rule?.output_format?.length || 0}</span>
                                      <RightArrowIcon className={cx(styles.ArrowIcon, gClasses.ML4)} />
                                      </div>
                                  </button>
                              ))}
                          </div>
                      );
                    }
                } else if (view === 2) {
                  return (
                    <div>
                      <button
                        className={styles.GoBackButton}
                        onClick={prevView}
                      >
                        <LeftArrowIcon className={styles.ArrowIcon} />
                        <span className={styles.GoBackText}>Go Back</span>
                      </button>
                      {!(selectedRule?.rule.output_format?.length) ?
                      <Text
                        className={styles.NoDataText}
                        content={t(DEFAULT_VALUE_CONFIG_STRINGS.NO_FIELDS)}
                      />
                      : jsUtility.compact(selectedRule?.rule?.output_format).map((field, index) => (
                        <button
                            key={`${field?.name},${index}`}
                            className={styles.EachRule}
                            onClick={() => {
                              if (field.type === 'table' || field.type === 'object') {
                                setSelectedField({ fieldUUID: field.uuid, index: index });
                                nextView();
                              } else {
                                setDisplayText(`Name: ${field.name}`);
                                setSelectedField({ fieldUUID: field.uuid, index: index });
                                close();
                              }
                            }}
                        >
                          <span>{field?.name}</span>
                          {(field.type === 'table' || field.type === 'object') && <RightArrowIcon className={styles.ArrowIcon} />}
                        </button>
                      ))}
                    </div>
                  );
                } else {
                  return (
                    <div>
                      <button
                        className={styles.GoBackButton}
                        onClick={prevView}
                      >
                        <LeftArrowIcon className={styles.ArrowIcon} />
                        <span className={styles.GoBackText}>Go Back</span>
                      </button>
                      {jsUtility.compact(selectedRule?.rule?.output_format?.[selectedField.index].column_mapping).map((field, index) => (
                          <button
                              key={`${field?.name},${index}`}
                              className={styles.EachRule}
                              onClick={() => {
                                setDisplayText(`Name: ${field.name}`);
                                setSelectedField({ fieldUUID: field.uuid, parentUUID: selectedField?.fieldUUID, index: index });
                                close();
                            }}
                          >
                            <span>{field?.name}</span>
                          </button>
                      ))}
                    </div>
                  );
                }
              }}
          </NestedDropdown>
          {rules.length > 0 &&
          <div
            className={cx(
              gClasses.DisplayFlex,
              gClasses.JusEnd,
            )}
          >
            <Button
              buttonText={SELECT_RULE_STRINGS(t).CANCEL}
              type={EMPTY_STRING}
              onClickHandler={closeRulePopup}
            />
            <Button
              buttonText={SELECT_RULE_STRINGS(t).SAVE}
              type={EButtonType.PRIMARY}
              onClickHandler={saveSelectedRule}
            />
          </div>}
        </div>
      </AutoPositioningPopper>
    </div>
  );
}

export default ExternalSourceSelection;

ExternalSourceSelection.propTypes = {
  onSave: PropTypes.func,
  metaData: PropTypes.object,
  moduleType: PropTypes.string,
  ruleData: PropTypes.object,
  isModalOpen: PropTypes.bool,
  setIsModalOpen: PropTypes.func,
  isEditMode: PropTypes.bool,
  fieldDetails: PropTypes.object,
  isTableField: PropTypes.bool,
  tableExternalRule: PropTypes.object,
};
