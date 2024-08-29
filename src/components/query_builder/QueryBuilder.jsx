import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { getAllFieldsOperator } from 'redux/reducer';
import { FORM_POPOVER_STATUS } from 'utils/Constants';
import Skeleton from 'react-loading-skeleton';
import { EMPTY_STRING } from 'utils/strings/CommonStrings';
import { isEmpty, isArray, get, cloneDeep, has, join, set } from '../../utils/jsUtility';
import GroupConditions from './group_conditions/GroupConditions';
import QUERY_BUILDER, { INITIAL_STATE } from './QueryBuilder.strings';
import { updateExpression, deleteCondition } from './QueryBuilder.utils';
import { updateTableColConditionList } from '../../redux/actions/Visibility.Action';
import { showToastPopover } from '../../utils/UtilityFunctions';

function QueryBuilder(props) {
    const {
           ruleExpression,
           ruleExpression: { expression = {} },
           has_validation,
           updateExpressionInReduxFn,
           lstAllFields,
           all_fields_operator,
           serverEntityUUID,
           isLoading,
           onLoadMoreExternalFields,
           onSearchExternalFields,
           maxNestedLevel,
           isSingleGroupBuilder,
           isVisibilityConfig,
           updateVisibilityOptions,
           conditionTempId,
          } = props;
      const { t } = useTranslation();
    const { ALL_KEYS, ACTIONS, CHANGE_HANDLER_TYPE, MULTIPLE_OPERAND_TYPES, DUAL_OPERAND_TYPES } = QUERY_BUILDER;

    // Function helps to handle all the button actions.
    const onActionButtonChangeHandler = (action, nestedLevel = -1, expressionIndex = -1, expressionPathTrace = '', currentExpression = {}, ruleIndex = -1) => {
      if (
        nestedLevel > -1 &&
        expressionIndex > -1 &&
        !isEmpty(currentExpression) &&
        has(currentExpression, [ALL_KEYS.OPERANDS], false)

      ) {
          let clonedExpression = cloneDeep(expression);
          const cloneCurrentExpression = cloneDeep(currentExpression);
          switch (action) {
            case ACTIONS.ADD_CONDITION: {
                const innerExpression = get(cloneCurrentExpression, [ALL_KEYS.OPERANDS, ALL_KEYS.EXPRESSIONS], []);
                    innerExpression.push(INITIAL_STATE.GET_CONDITION());
                    cloneCurrentExpression[ALL_KEYS.OPERANDS][ALL_KEYS.EXPRESSIONS] = innerExpression;
             }
              break;
            case ACTIONS.DELETE_CONDITION:
              clonedExpression = deleteCondition(clonedExpression, {
                nestedLevel: nestedLevel,
                expressionPathTrace: expressionPathTrace,
                expressionIndex: expressionIndex,
              }, 0, 0, '0', has_validation, t);
              const { tableColConditionList = [] } = cloneDeep(props);
              const { updateTableColConditionList } = props;
              const updatedTableColConditionList = tableColConditionList.filter((tableCol) => (tableCol.nestedLevel < nestedLevel));
              updateTableColConditionList(updatedTableColConditionList);
              break;
            case ACTIONS.ADD_RULE: {
                  const innerCondition = get(cloneCurrentExpression, [ALL_KEYS.OPERANDS, ALL_KEYS.CONDITIONS], []);
                  innerCondition.push(INITIAL_STATE.GET_RULE());
                  cloneCurrentExpression[ALL_KEYS.OPERANDS][ALL_KEYS.CONDITIONS] = innerCondition;
                }
              break;
            case ACTIONS.DELETE_RULE: {
              const innerCondition = get(cloneCurrentExpression, [ALL_KEYS.OPERANDS, ALL_KEYS.CONDITIONS], []);
              if ((innerCondition || []).length > ruleIndex) {
                innerCondition.splice(ruleIndex, 1);
                cloneCurrentExpression[ALL_KEYS.OPERANDS][ALL_KEYS.CONDITIONS] = innerCondition;
              }
              const { tableColConditionList = [] } = cloneDeep(props);
              const { updateTableColConditionList } = props;
              const tableColForCurrentRuleIndex = tableColConditionList.findIndex((tableCol) => (tableCol.ruleIndex === ruleIndex && tableCol.nestedLevel === nestedLevel));
              if (tableColForCurrentRuleIndex > -1) {
                tableColConditionList.splice(tableColForCurrentRuleIndex, 1);
                updateTableColConditionList(tableColConditionList);
              }
            }
            break;
            default:
              break;
          }
          if (action !== ACTIONS.DELETE_CONDITION) {
              clonedExpression = updateExpression(
                clonedExpression,
                {
                  nestedLevel: nestedLevel,
                  expressionIndex: expressionIndex,
                  expressionPathTrace: expressionPathTrace,
                  updatedParticularExpression: cloneCurrentExpression,
                },
                0,
                0,
                '0',
                has_validation,
                lstAllFields,
                all_fields_operator,
                false,
                t,
              );
            }
           updateExpressionInReduxFn && updateExpressionInReduxFn({ ...ruleExpression, expression: clonedExpression });
      }
    };

    // Function to handle all the field changes in the query builder.
    const onFieldChangeHandler = (type, event, currentExpression, expressionIndex, expressionPathTrace, nestedLevel, ruleIndex = 0, selected_opertor_info = {}) => {
      const clonedCurrentExpression = cloneDeep(currentExpression);
      let clonedExpression = cloneDeep(expression);
      switch (type) {
         case CHANGE_HANDLER_TYPE.EXPRESSION:
           if (
            get(event, ['target', 'id'], false) &&
            !isEmpty(clonedCurrentExpression) &&
            get(event, ['target', 'value'], null) !== null
           ) {
              const { target } = event;
              clonedCurrentExpression[target.id] = target.value;
           }
           break;
         case CHANGE_HANDLER_TYPE.RULE:
           if (
              get(event, ['target', 'id'], false) &&
              !isEmpty(clonedCurrentExpression)
            ) {
              const { target } = event;
              let currentCondition = clonedCurrentExpression[ALL_KEYS.OPERANDS][ALL_KEYS.CONDITIONS][ruleIndex] || INITIAL_STATE.GET_RULE();
              switch (target.id) {
                   case ALL_KEYS.L_FIELD:
                    if (serverEntityUUID === target.value) {
                      showToastPopover(
                        'Cannot add rule',
                        'Cannot set rule for same field',
                        FORM_POPOVER_STATUS.SERVER_ERROR,
                        true,
                      );
                      } else {
                        if (isVisibilityConfig) {
                      const { tableColConditionList = [] } = cloneDeep(props);
                      const { updateTableColConditionList } = props;
                      const tableColForCurrentRuleIndex = tableColConditionList.findIndex((tableCol) => (tableCol.ruleIndex === ruleIndex && tableCol.nestedLevel === nestedLevel));
                      if (tableColForCurrentRuleIndex > -1) {
                        if (event?.target?.addedTableCol) {
                          set(tableColConditionList, [tableColForCurrentRuleIndex, 'colId'], event?.target?.addedTableCol);
                          updateVisibilityOptions();
                        } else tableColConditionList.splice(tableColForCurrentRuleIndex, 1);
                      } else if (event?.target?.addedTableCol) {
                        updateVisibilityOptions();
                        tableColConditionList.push({
                          nestedLevel: nestedLevel,
                          ruleIndex: ruleIndex,
                          colId: event?.target?.addedTableCol,
                        });
                      }
                      updateTableColConditionList(tableColConditionList);
                    }
                      currentCondition = {
                        ...currentCondition,
                        [target.id]: target.value,
                        [ALL_KEYS.OPERATOR]: EMPTY_STRING,
                      };
                      if (has(currentCondition, [ALL_KEYS.R_VALUE], false)) currentCondition[ALL_KEYS.R_VALUE] = null;
                    }
                      break;
                   case ALL_KEYS.OPERATOR:
                      currentCondition = {
                        ...currentCondition,
                        [target.id]: target.value,
                      };
                      if (selected_opertor_info.has_operand) {
                         if (DUAL_OPERAND_TYPES.includes(selected_opertor_info.operand_field)) {
                           currentCondition[ALL_KEYS.R_VALUE] = [null, null];
                         } else if (MULTIPLE_OPERAND_TYPES.includes(selected_opertor_info.operand_field)) {
                          currentCondition[ALL_KEYS.R_VALUE] = [];
                         } else currentCondition[ALL_KEYS.R_VALUE] = EMPTY_STRING;
                      }
                      if (!selected_opertor_info.has_operand && has(currentCondition, [ALL_KEYS.R_VALUE], false)) {
                          delete currentCondition[ALL_KEYS.R_VALUE];
                      }
                    break;
                   case ALL_KEYS.R_VALUE:
                      currentCondition = {
                        ...currentCondition,
                        [target.id]: target.value,
                      };
                     break;
                   default:
                     break;
              }
              clonedCurrentExpression[ALL_KEYS.OPERANDS][ALL_KEYS.CONDITIONS][ruleIndex] = currentCondition;
           }
           break;
         default:
           break;
      }

      clonedExpression = updateExpression(clonedExpression, {
        nestedLevel: nestedLevel,
        expressionIndex: expressionIndex,
        expressionPathTrace: expressionPathTrace,
        updatedParticularExpression: clonedCurrentExpression,
      }, 0, 0, '0', has_validation, lstAllFields, all_fields_operator, false, t);

      updateExpressionInReduxFn && updateExpressionInReduxFn({ ...ruleExpression, expression: clonedExpression });
    };

    // Function helps to return all the group conditions in the nested structure
    const getAllGroupConditions = useCallback((expression, nestedLevel = 0, expressionIndex = 0, expressionPathTrace = '0') => {
        if (isEmpty(expression) && !expression) return null;
        if (isArray(expression) && !isEmpty(expression)) {
        return expression.map((eachExpression, eachExpressionIndex) => {
            const path = join([expressionPathTrace, eachExpressionIndex], ',');
            const children = getAllGroupConditions(get(eachExpression, [ALL_KEYS.OPERANDS, ALL_KEYS.EXPRESSIONS], null), nestedLevel + 1, eachExpressionIndex, path);
            return (
                <GroupConditions
                    key={eachExpression[ALL_KEYS.EXPRESSION_UUID]}
                    expression={eachExpression}
                    nestedLevel={nestedLevel + 1}
                    expressionPathTrace={path}
                    expressionIndex={eachExpressionIndex}
                    onActionButtonChangeHandler={onActionButtonChangeHandler}
                    onFieldChangeHandler={onFieldChangeHandler}
                    lstAllFields={lstAllFields}
                    onLoadMoreExternalFields={onLoadMoreExternalFields}
                    onSearchExternalFields={onSearchExternalFields}
                    maxNestedLevel={maxNestedLevel}
                    serverEntityUUID={serverEntityUUID}
                >
                    {children}
                </GroupConditions>
                );
        });
        } else if (typeof expression === 'object' && !isEmpty(expression)) {
          const children = getAllGroupConditions(get(expression, [ALL_KEYS.OPERANDS, ALL_KEYS.EXPRESSIONS], null), nestedLevel + 1, 0, expressionPathTrace);
          const id = isSingleGroupBuilder ? `${expression[ALL_KEYS.EXPRESSION_UUID]}_${conditionTempId}` : expression[ALL_KEYS.EXPRESSION_UUID];
          return (
              <GroupConditions
                  id={id}
                  key={id}
                  expression={expression}
                  nestedLevel={nestedLevel + 1}
                  expressionPathTrace={expressionPathTrace}
                  expressionIndex={expressionIndex}
                  onActionButtonChangeHandler={onActionButtonChangeHandler}
                  onFieldChangeHandler={onFieldChangeHandler}
                  lstAllFields={lstAllFields}
                  onLoadMoreExternalFields={onLoadMoreExternalFields}
                  onSearchExternalFields={onSearchExternalFields}
                  maxNestedLevel={maxNestedLevel}
                  isSingleGroupBuilder={isSingleGroupBuilder}
                  serverEntityUUID={serverEntityUUID}
              >
                  {children}
              </GroupConditions>
              );
        }
        return null;
    }, [expression, lstAllFields]);

    return (!isEmpty(expression) && !isLoading) ? getAllGroupConditions(expression) : (<Skeleton height={48} />);
}

const mapStateToProps = (state) => {
  return {
    all_fields_operator: getAllFieldsOperator(state),
    tableColConditionList: state.VisibilityReducer.externalFieldReducer.tableColConditionList,
  };
};

const mapDispatchToProps = {
  updateTableColConditionList,
};

export default connect(mapStateToProps, mapDispatchToProps)(QueryBuilder);

QueryBuilder.defaultProps = {
  updateExpressionInReduxFn: null,
  has_validation: false,
  lstAllFields: [],
  serverEntityUUID: 'PMFKNDFN',
  // ruleExpression: {},
  isLoading: false,
  maxNestedLevel: QUERY_BUILDER.INITIAL_NEST_LEVEL,
  isSingleGroupBuilder: false,
};

QueryBuilder.propTypes = {
  updateExpressionInReduxFn: PropTypes.func,
  has_validation: PropTypes.bool,
  lstAllFields: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.string,
  })),
  serverEntityUUID: PropTypes.string,
  isLoading: PropTypes.bool,
  maxNestedLevel: PropTypes.number,
  isSingleGroupBuilder: PropTypes.bool,
};
