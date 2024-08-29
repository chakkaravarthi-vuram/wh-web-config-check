import React from 'react';
import { ConditionBuilder as Builder, CBChangeHandlerType, CBAllKeys, cbExpressionUpdater, CBActions } from '@workhall-pvt-lmt/wh-ui-library';
import { connect } from 'react-redux';
import { cloneDeep, get, has } from '../../utils/jsUtility';
import Rule from './rule/Rule';
import CONDITION_BUILDER from './ConditionBuilder.strings';
import { getValidatedExpression } from './ConditionBuilder.utils';
import { getAllFieldsOperator } from '../../redux/reducer';
import { OPERAND_TYPES } from '../../utils/constants/rule/operand_type.constant';
import { R_CONSTANT } from '../../utils/constants/rule/rule.constant';

function RuleBuilder(props) {
    const {
        id,
        rule,
        className,
        maxNestedLevel,
        hasValidation,
        lstAllFields,
        allFieldOperator,
        colorScheme,
        isLoading,
        singleExpressionProps,
        onDeleteSingleGroup, // Only for single group builder
        onSearchExternalFields,
        onLoadMoreExternalFields,
        updateExpressionInReduxFn,
        getClassNameBasedOnNestedLevel,
        removeDndBackendWrapper,
        noFieldsFoundMsg,
        choiceValueTypeBased = false, // only for dynamic security policy
    } = props;

  const { MULTIPLE_OPERAND_TYPES, DUAL_OPERAND_TYPES } = CONDITION_BUILDER;

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
          condition[CBAllKeys.OPERATOR] = null;
          condition[CBAllKeys.R_VALUE] = null;
          delete condition[R_CONSTANT];
        break;
        case CBAllKeys.OPERATOR:
          condition[CBAllKeys.OPERATOR] = value;
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
            delete condition[R_CONSTANT];
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

  // (event: any, index: number, selectedOpertorInfo: CBFieldOperator) => void

  const getEachRule = (condition, index, onChange, expression) => (
        <Rule
            condition_uuid={condition.condition_uuid}
            l_field={condition.l_field}
            operator={condition.operator}
            r_value={condition.r_value}
            r_constant={condition[R_CONSTANT]}
            lstAllFields={lstAllFields}
            ruleIndex={index}
            onChangeHandler={onChange}
            validations={get(expression, [CBAllKeys.VALIDATIONS], {})}
            onLoadMoreExternalFields={onLoadMoreExternalFields}
            onSearchExternalFields={onSearchExternalFields}
            serverEntityUUID={null}
            noFieldsFoundMsg={noFieldsFoundMsg}
            choiceValueTypeBased={choiceValueTypeBased}
        />
     );
  return (
    <Builder
       id={id}
       rule={cloneDeep(rule)}
       className={className}
       lstAllFields={lstAllFields}
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
    />
  );
}
const mapStateToProps = (state) => {
  return {
    allFieldOperator: getAllFieldsOperator(state),
  };
};

const ConditionBuilder = React.memo(RuleBuilder);

export default connect(mapStateToProps)(ConditionBuilder);
