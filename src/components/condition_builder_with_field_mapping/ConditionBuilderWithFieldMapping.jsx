import React, { useMemo } from 'react';
import { ConditionBuilder as Builder, CBChangeHandlerType, CBAllKeys, cbExpressionUpdater, CBActions } from '@workhall-pvt-lmt/wh-ui-library';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { cloneDeep, get, has, isEmpty } from '../../utils/jsUtility';
import CONDITION_BUILDER from '../condition_builder/ConditionBuilder.strings';
import { getValidatedExpression } from '../condition_builder/ConditionBuilder.utils';
import { getAllFieldsOperator } from '../../redux/reducer';
import { OPERAND_TYPES } from '../../utils/constants/rule/operand_type.constant';
import { L_VALUE_TYPE, R_CONSTANT, VALUE_TYPE, VALUE_TYPE_KEY } from '../../utils/constants/rule/rule.constant';
import RuleWithMapping from './rule_with_field_mapping/RuleWithFieldMapping';
import { getConditionInitialStateForCBWithMapping, getExpressionInitialStateForCBWithMapping, getModifiedFieldDetails, getModifiedFieldDetailsForLFields } from './ConditionBuilderWithFieldMapping.utils';
import { FEILD_LIST_DROPDOWN_TYPE } from '../../containers/edit_flow/step_configuration/StepConfiguration.utils';

function RuleBuilder(props) {
    const {
        id,
        rule,
        className,
        maxNestedLevel,
        hasValidation,

        lDataFieldList,
        rDataFieldList,
        lSystemFieldList = [],
        rSystemFieldList = [],
        allFieldOperator,

        singleExpressionProps,
        onDeleteSingleGroup, // Only for single group builder
        updateExpressionInReduxFn,

        colorScheme,
        isLoading,
        getClassNameBasedOnNestedLevel,
        removeDndBackendWrapper,
        noFieldsFoundMsg,
        choiceValueTypeBased = false, // only for dynamic security policy
        tableUUID = null,
        isOnlyTableColumn = false,
    } = props;

  const { MULTIPLE_OPERAND_TYPES, DUAL_OPERAND_TYPES } = CONDITION_BUILDER;
  const { t } = useTranslation();

  const lFields = useMemo(
    () => getModifiedFieldDetailsForLFields(lDataFieldList, lSystemFieldList, isOnlyTableColumn, tableUUID, t),
    [lDataFieldList?.length, lSystemFieldList?.length, tableUUID],
  );
  const rFields = getModifiedFieldDetails(rDataFieldList, rSystemFieldList, FEILD_LIST_DROPDOWN_TYPE.DIRECT, null, true);

  const onFieldChange = (
    event,
    type,
    expression,
    updatorUtils,
    selectedOpertorInfo,
  ) => {
    const { id, value } = event?.target ?? {};
    const clonedExpression = cloneDeep(expression);
    if (type === CBChangeHandlerType.EXPRESSION) {
       clonedExpression[CBAllKeys.LOGICAL_OPERATOR] = value;
    } else {
       const { conditionIndex = null } = updatorUtils?.destinationPath ?? {};
       const condition = cloneDeep(get(expression, [CBAllKeys.CONDITIONS, conditionIndex], {}));

       switch (id) {
        case CBAllKeys.L_FIELD:
          condition[CBAllKeys.L_FIELD] = value;
          condition[L_VALUE_TYPE] = get(event, ['target', L_VALUE_TYPE], null);
          condition[CBAllKeys.OPERATOR] = null;
          condition[CBAllKeys.R_VALUE] = null;
          delete condition[R_CONSTANT];
        break;
        case CBAllKeys.OPERATOR:
          condition[id] = value;
          delete condition[R_CONSTANT];
          if (selectedOpertorInfo?.has_operand) {
             if (DUAL_OPERAND_TYPES.includes(selectedOpertorInfo?.operand_field)) {
               condition[CBAllKeys.R_VALUE] = [null, null];
             } else if (MULTIPLE_OPERAND_TYPES.includes(selectedOpertorInfo?.operand_field)) {
               condition[CBAllKeys.R_VALUE] = [];
             } else if (OPERAND_TYPES.MIN_MAX === selectedOpertorInfo?.operand_field) {
               condition[CBAllKeys.R_VALUE] = {};
             } else {
               condition[CBAllKeys.R_VALUE] = null;
             }

             if (isEmpty(condition[VALUE_TYPE])) {
              condition[VALUE_TYPE] = VALUE_TYPE_KEY.STATIC_VALUE;
             }
          } else if (!selectedOpertorInfo?.has_operands) {
              delete condition?.[CBAllKeys.R_VALUE];
              delete condition?.[VALUE_TYPE];
          }
        break;
        case VALUE_TYPE:
          condition[id] = value;
          if (selectedOpertorInfo?.has_operand) {
             if (DUAL_OPERAND_TYPES.includes(selectedOpertorInfo?.operand_field)) {
               condition[CBAllKeys.R_VALUE] = [null, null];
             } else if (MULTIPLE_OPERAND_TYPES.includes(selectedOpertorInfo?.operand_field)) {
               condition[CBAllKeys.R_VALUE] = [];
             } else if (OPERAND_TYPES.MIN_MAX === selectedOpertorInfo?.operand_field) {
               condition[CBAllKeys.R_VALUE] = {};
             } else {
               condition[CBAllKeys.R_VALUE] = null;
             }
          } else if (
            !selectedOpertorInfo?.has_operands &&
            has(condition, [CBAllKeys.R_VALUE], false)
            ) {
              delete condition[CBAllKeys.R_VALUE];
          }
        break;
        case CBAllKeys.R_VALUE:
          condition[CBAllKeys.R_VALUE] = value;
        break;
        case R_CONSTANT:
          if (value) {
            condition[R_CONSTANT] = value;
            delete condition[CBAllKeys.R_VALUE];
          } else {
            delete condition[R_CONSTANT];
            condition[CBAllKeys.R_VALUE] = null;
          }
        break;
        default: break;
       }
       clonedExpression[CBAllKeys.CONDITIONS][conditionIndex] = condition;
    }
    const updatedExpression = cbExpressionUpdater({
      ...updatorUtils,
      updatedExpression: {
        type: CBChangeHandlerType.EXPRESSION,
        expression: clonedExpression,
      },
      getValidatedExpression: hasValidation ? getValidatedExpression : null,
    });
    updateExpressionInReduxFn?.(updatedExpression);
  };
  const onActionClick = (expression, action) => {
    if ((!!singleExpressionProps?.enableSingleExpressionMode) && action === CBActions.DELETE_EXPRESSION) {
      onDeleteSingleGroup?.();
    } else {
      updateExpressionInReduxFn?.(expression);
    }
  };
  const onDragAndDrop = (expresion) => updateExpressionInReduxFn?.(expresion);

  console.log('sajkbdlkas', { id, lDataFieldList, lFields });
  // (event: any, index: number, selectedOpertorInfo: CBFieldOperator) => void

  const getEachRule = (condition, index, onChange, expression) => (
        <RuleWithMapping
            condition_uuid={condition.condition_uuid}
            l_field={condition.l_field}
            operator={condition.operator}
            r_value={condition.r_value}
            r_constant={condition[R_CONSTANT]}
            value_type={condition[VALUE_TYPE]}
            ruleIndex={index}
            onChangeHandler={onChange}
            validations={get(expression, [CBAllKeys.VALIDATIONS], {})}
            serverEntityUUID={null}
            noFieldsFoundMsg={noFieldsFoundMsg}
            choiceValueTypeBased={choiceValueTypeBased}
            lDataFieldList={lDataFieldList}
            lFieldsDetail={lFields}
            rFieldsDetail={rFields}
        />
     );
  return (
    <Builder
       id={id}
       rule={cloneDeep(rule)}
       className={className}
       lstAllFields={Object.values(lFields?.allFields)}
       allFieldOperator={allFieldOperator}
       hasValidation={hasValidation}
       isLoading={isLoading}
       maxNestedLevel={maxNestedLevel}
       colorScheme={colorScheme}
       singleExpressionProps={singleExpressionProps}
       onActionClick={onActionClick}
       onFieldChange={onFieldChange}
       onDragAndDrop={onDragAndDrop}
       getEachRule={getEachRule}
       getValidatedExpression={getValidatedExpression}
       getClassName={getClassNameBasedOnNestedLevel}
       removeDndBackendWrapper={removeDndBackendWrapper}
       extraProps={{
        getConditionInitialState: getConditionInitialStateForCBWithMapping,
        getConditionExpressionInitialState: getExpressionInitialStateForCBWithMapping,
       }}
    />
  );
}
const mapStateToProps = (state) => {
  return {
    allFieldOperator: getAllFieldsOperator(state),
  };
};

const ConditionBuilderWithMapping = React.memo(RuleBuilder);

export default connect(mapStateToProps)(ConditionBuilderWithMapping);
