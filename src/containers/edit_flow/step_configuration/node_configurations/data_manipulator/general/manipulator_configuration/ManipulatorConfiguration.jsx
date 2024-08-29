import React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { EMPTY_STRING } from '../../../../../../../utils/strings/CommonStrings';
import { RULE_TYPE } from '../../../../../../../utils/constants/rule/rule.constant';
import FieldValueRuleConfig from '../../../../../../form_configuration/field_value/field_value_rule_config/FieldValueRuleConfig';
import { nodeConfigDataChange, useFlowNodeConfig } from '../../../../../node_configuration/use_node_reducer/useNodeReducer';
import { MODULE_TYPES } from '../../../../../../../utils/Constants';
import { cloneDeep, isUndefined, isEmpty } from '../../../../../../../utils/jsUtility';
import { ExternalSourceProvider } from '../../../../../../form/external_source_data/useExternalSource';
import ExternalSource from '../../../../../../form/external_source_data/ExternalSource';
import { processDataRules } from '../../../../../../form/sections/field_configuration/column_configuration/external_source_column_configuration/ExternalSourceColumnConfiguration.utils';
import { RESPONSE_KEYS } from '../../DataManipulator.constants';
import { DATA_MANIPULATOR_STEP_CONFIGURATION } from '../../DataManipulator.strings';

function ManipulatorConfiguration(props) {
  const { t } = useTranslation();
    const { chosenManipulator = null, closeConfiguration = null, index, isNewRule } = props;
    const { flowData } = useSelector((state) => state.EditFlowReducer);
    const { activeRule } = useSelector((state) => state?.VisibilityReducer?.fieldDefaultValueReducer);

    const { MANIPULATION, ADD_MANIPULATION } = DATA_MANIPULATOR_STEP_CONFIGURATION(t);

    const { state, dispatch } = useFlowNodeConfig();

    const { manipulationDetails = [] } = state;

    const {
      CHILD_MAPPING,
      SOURCE_TYPE,
      OPERATOR,
      SAVE_TO,
      RULE_DETAILS,
      RULE_NAME,
      IS_MULTIPLE,
      SOURCE_VALUE,
      CHILD_DATA,
   } = RESPONSE_KEYS;

   console.log('ManipulatorConfiguration', index);
   const getExpressionConfiguration = () => {
        if (chosenManipulator !== 0) return null;

        const onClose = () => {
          dispatch(
            nodeConfigDataChange({
              selectedManipulator: null,
              isNewRule: false,
              manipulatorEditIndex: null,
            }),
          );
          closeConfiguration();
        };

        const onSave = (rule) => {
          const clonedManipulatorData = cloneDeep(manipulationDetails);
          if (!isNewRule) {
            const currentData = cloneDeep(clonedManipulatorData)?.[index];
            currentData.ruleDetails = {
              [RULE_NAME]: rule.rule_name,
              ruleUUID: rule.rule_uuid,
            };
            currentData[SOURCE_VALUE] = rule.rule_uuid;
            clonedManipulatorData[index] = currentData;
          } else {
            const currentData = !isUndefined(index) && !isEmpty(clonedManipulatorData?.[index]) ?
            {
              ...clonedManipulatorData[index],
              [SOURCE_VALUE]: rule.rule_uuid,
              source: rule.rule_uuid,
              [RULE_DETAILS]: {
                [RULE_NAME]: rule.rule_name,
                ruleUUID: rule.rule_uuid,
              },
            } : {
              [SOURCE_TYPE]: ADD_MANIPULATION.OPTIONS[0]?.[SOURCE_TYPE],
              [SOURCE_VALUE]: rule.rule_uuid,
              [OPERATOR]: MANIPULATION.OPERATOR_OPTIONS(true)?.[0]?.value,
              [SAVE_TO]: EMPTY_STRING,
              source: rule.rule_uuid,
              [RULE_DETAILS]: {
                [RULE_NAME]: rule.rule_name,
                ruleUUID: rule.rule_uuid,
              },
            };
            if (!isUndefined(index) && !isEmpty(clonedManipulatorData[index])) clonedManipulatorData[index] = currentData;
            else clonedManipulatorData.push(currentData);
          }
          dispatch(
              nodeConfigDataChange({
                manipulationDetails: clonedManipulatorData,
                selectedManipulator: null,
                isNewRule: false,
                manipulatorEditIndex: null,
              }),
          );
        };

        return (
          <FieldValueRuleConfig
            ruleUUID={cloneDeep(manipulationDetails)?.[index]?.[RULE_DETAILS]?.ruleUUID}
            defaultRuleType={1}
            metaData={{
              moduleId: flowData.flow_id,
              moduleUUID: flowData.flow_uuid,
              stepId: state._id,
              stepUUID: state.step_uuid,
            }}
            moduleType={MODULE_TYPES.FLOW}
            isModalOpen={chosenManipulator === 0}
            setIsModalOpen={closeConfiguration}
            onClose={onClose}
            onSave={onSave}
            ruleType={RULE_TYPE.DEFAULT_VALUE}
            tableUUID={EMPTY_STRING}
            ruleNameGenerate={state.step_name}
            disableConfigurationRule
            hideToggle
            isDataManipulatorRule
            isLoading={activeRule?.ruleType !== 1}
          />
        );
    };

    const getExternalSourceConfiguration = () => {
      console.log('external source');
      const onSaveExternalSource = (ruleData) => {
        const clonedManipulatorData = cloneDeep(manipulationDetails);
        const processedMapping = {
          ...processDataRules([ruleData])?.[0],
          [RULE_NAME]: ruleData.rule_name,
          ruleUUID: ruleData.rule_uuid,
          ruleId: ruleData._id,
        };
        const ruleFields = [];
        processedMapping?.tables?.forEach((eachTable) => {
          ruleFields.push(eachTable);
          eachTable?.columns?.forEach((eachRow) => {
            eachRow?.forEach((eachField) => {
              if (!isUndefined(eachField?.label)) {
                ruleFields.push({
                  ...eachField,
                  tableUUID: eachTable.value,
                });
              }
            });
          });
        });
        console.log('externalRULE', processedMapping, ruleData);
        processedMapping?.directFields?.forEach((eachRow) => {
          eachRow?.forEach((eachField) => {
            if (eachField && !isUndefined(eachField.label)) {
              ruleFields.push(eachField);
            }
          });
        });
        if (!isNewRule) {
          const currentData = cloneDeep(clonedManipulatorData)?.[index];
          console.log('processedMapping',
            processedMapping,
            currentData,
            currentData?.[RULE_DETAILS]?.[IS_MULTIPLE],
            processedMapping?.[IS_MULTIPLE],
            currentData?.[RULE_DETAILS]?.[IS_MULTIPLE] === processedMapping?.[IS_MULTIPLE]);
            currentData.ruleDetails = {
              ...processedMapping,
              fieldsList: ruleFields,
            };
            clonedManipulatorData[index] = currentData;
        } else {
          const currentData = {
            [SOURCE_TYPE]: ADD_MANIPULATION.OPTIONS[1]?.[SOURCE_TYPE],
            [OPERATOR]: MANIPULATION.OPERATOR_OPTIONS(true)?.[0]?.value,
            [SAVE_TO]: EMPTY_STRING,
            source: ruleData.rule_uuid,
            [SOURCE_VALUE]: ruleData.rule_uuid,
            [CHILD_DATA]: ruleData.rule_uuid,
            [RULE_DETAILS]: {
              ...processedMapping,
              fieldsList: ruleFields,
            },
            [CHILD_MAPPING]: [{
              [SOURCE_TYPE]: ADD_MANIPULATION.OPTIONS[1]?.[SOURCE_TYPE],
              [OPERATOR]: MANIPULATION.OPERATOR_OPTIONS(true)?.[0]?.value,
              [SAVE_TO]: EMPTY_STRING,
              source: EMPTY_STRING,
            }],
          };
          clonedManipulatorData.push(currentData);
        }
        dispatch(
            nodeConfigDataChange({
              manipulationDetails: clonedManipulatorData,
              selectedManipulator: null,
              isNewRule: false,
              manipulatorEditIndex: null,
            }),
        );
      };

      const onClose = () => {
        dispatch(
          nodeConfigDataChange({
            selectedManipulator: null,
            isNewRule: false,
            manipulatorEditIndex: null,
          }),
        );
        closeConfiguration();
      };

      if (chosenManipulator !== 1) return null;
      return (
        <ExternalSourceProvider>
          <ExternalSource
            moduleId={flowData.flow_id}
            metaData={{ moduleId: flowData.flow_id }}
            moduleType={MODULE_TYPES.FLOW}
            ruleId={cloneDeep(manipulationDetails)?.[index]?.[RULE_DETAILS]?.ruleId}
            onCloseClick={onClose}
            onSave={onSaveExternalSource}
          />
        </ExternalSourceProvider>
      );
    };

    return (
      <>
        {getExpressionConfiguration()}
        {getExternalSourceConfiguration()}
      </>
    );
}

export default ManipulatorConfiguration;
