import React, { useState } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames/bind';
import { useTranslation } from 'react-i18next';
import { ARIA_ROLES, BS } from 'utils/UIConstants';
import RadioGroup from 'components/form_components/radio_group/RadioGroup';
import HelperMessage, { HELPER_MESSAGE_TYPE } from 'components/form_components/helper_message/HelperMessage';
import ConditionalWrapper from 'components/conditional_wrapper/ConditionalWrapper';
import Accordion from '../../accordion/Accordion';
import Input from '../../form_components/input/Input';
import styles from '../QueryBuilder.module.scss';
import gClasses from '../../../scss/Typography.module.scss';
import QUERY_BUILDER, { LOGICAL_OPERATOR_OPTION_LIST } from '../QueryBuilder.strings';
import { isEmpty, get } from '../../../utils/jsUtility';
import AddIcon from '../../../assets/icons/AddIcon';
import { generateEventTargetObject } from '../../../utils/generatorUtils';
// eslint-disable-next-line import/no-cycle
import GroupRule from '../group_rules/GroupRule';
import { getLogicalOperator } from '../QueryBuilder.utils';

function GroupConditions(props) {
  const {
      nestedLevel,
      expressionIndex,
      expression,
      className,
      accordionClassName,
      expressionPathTrace,
      children,
      inlineStyles,
      onActionButtonChangeHandler,
      onFieldChangeHandler,
      lstAllFields,
      onLoadMoreExternalFields,
      onSearchExternalFields,
      maxNestedLevel,
      isSingleGroupBuilder,
      serverEntityUUID,
      id,
     } = props;
  const { t } = useTranslation();
  const { ALL_LABELS, ALL_KEYS, ACTIONS, INITIAL_NEST_LEVEL, CHANGE_HANDLER_TYPE } = QUERY_BUILDER;
  const [isExpanded, setIsExpanded] = useState(true);
  const { expression_uuid, logical_operator, operands = {} } = expression;
  const validations = expression[ALL_KEYS.VALIDATIONS];

// Handler to handle ADD CONDITION, ADD RULE, DELETE CONDITION.
 const onActionLinkHandler = (action) => onActionButtonChangeHandler(action, nestedLevel, expressionIndex, expressionPathTrace, expression);

// Handler to handle DELETE RULE.
 const onDeleteRule = (deleteIndex) => onActionButtonChangeHandler(ACTIONS.DELETE_RULE, nestedLevel, expressionIndex, expressionPathTrace, expression, deleteIndex);

// Helps to handle the rule(sub-condition) related field changes.
const onRuleFieldChangeHandler = (event, ruleIndex, selected_opertor_info) => onFieldChangeHandler(CHANGE_HANDLER_TYPE.RULE, event, expression, expressionIndex, expressionPathTrace, nestedLevel, ruleIndex, selected_opertor_info);

// Helps to handle the expression(condition) related field changes.
const onExpressionFieldHandler = (event) => onFieldChangeHandler(CHANGE_HANDLER_TYPE.EXPRESSION, event, expression, expressionIndex, expressionPathTrace, nestedLevel);

// Funtion helps to get the accordion header content.
const getHeaderComponent = () => (
    <div className={gClasses.CenterV}>
        <span className={styles.Operator}>{getLogicalOperator(expression, t)}</span>
        <Input
            id={ALL_KEYS.LABEL}
            hideLabel
            hideMessage
            hideBorder
            placeholder={t(ALL_LABELS.ADD_CONDITION_NAME)}
            value={expression[ALL_KEYS.LABEL] || ''}
            className={BS.W100}
            onChangeHandler={onExpressionFieldHandler}
            // onFocusHandler={labelInputFocusHandler}
        />
    </div>
);

// Function helps to get the inner content of the GroupCondition component.
const getSubConditions = () => (
    <>
        <RadioGroup
          id={`${ALL_KEYS.LOGICAL_OPERATOR}_${id}`}
          label={t(ALL_LABELS.SHOW_THE_FIELD_WHEN)}
          hideMessage
          className={gClasses.MB10}
          optionList={LOGICAL_OPERATOR_OPTION_LIST(t)}
          selectedValue={logical_operator}
          onClick={(event) => onExpressionFieldHandler(generateEventTargetObject(ALL_KEYS.LOGICAL_OPERATOR, event))}
        />
        <GroupRule
             conditions={operands[ALL_KEYS.CONDITIONS]}
             onDeleteRule={onDeleteRule}
             onChangeHandler={onRuleFieldChangeHandler}
             lstAllFields={lstAllFields}
             validations={validations}
             onLoadMoreExternalFields={onLoadMoreExternalFields}
             onSearchExternalFields={onSearchExternalFields}
             serverEntityUUID={serverEntityUUID}
        />
    </>
  );

// Function helps to get all the action buttons.
 const getAllActionButtons = () => {
    const getActionButton = (icon, label, addOnClasses, onClickHandler) => (
        <button
            id={label}
            className={cx(
                gClasses.ClickableElement,
                gClasses.CenterV,
                addOnClasses,
                gClasses.FTwo13,
                gClasses.FontWeight500,
                gClasses.MT15,
                )}
            onClick={onClickHandler}
        >
            {icon}
            <span className={icon && gClasses.ML7}>{label}</span>
        </button>
    );

    return (
        <div className={cx(gClasses.CenterV, BS.JC_BETWEEN, BS.FLEX_WRAP_WRAP)}>
                        {
                            getActionButton(
                                (<AddIcon className={styles.AddBtn} ariaHidden role={ARIA_ROLES.IMG} ariaLabel="Add" />),
                                t(ALL_LABELS.ADD_SUB_CONDITION),
                                styles.AddBtn,
                                () => onActionLinkHandler(ACTIONS.ADD_RULE),
                            )
                        }
                <div className={cx(gClasses.CenterV, BS.JC_END, gClasses.Flex1)}>
                        {
                            (nestedLevel < maxNestedLevel) &&
                            getActionButton(
                                (<AddIcon className={styles.AddBtn} ariaHidden role={ARIA_ROLES.IMG} ariaLabel="Add" />),
                                t(ALL_LABELS.ADD_CONDITION),
                                styles.AddBtn,
                                () => onActionLinkHandler(ACTIONS.ADD_CONDITION),
                            )
                        }
                        {
                            (nestedLevel !== INITIAL_NEST_LEVEL) &&
                            getActionButton(
                                (null),
                                t(ALL_LABELS.DELETE_CONDITION),
                                cx(styles.DeleteBtn, gClasses.ML20),
                                () => onActionLinkHandler(ACTIONS.DELETE_CONDITION),
                            )
                        }
                </div>
        </div>
    );
  };
  return (
    <div
        id={expression_uuid}
        style={inlineStyles}
        className={cx(
            BS.P_RELATIVE,
            styles.GroupConditions,
           // (isExpanded ? styles.Active : null),
            (nestedLevel !== INITIAL_NEST_LEVEL ? styles.HierarchyStructure : BS.MARGIN_0),
            (nestedLevel !== INITIAL_NEST_LEVEL && (isExpanded || children) && styles.HasChild),
            className,
            )}
    >
        {
            <ConditionalWrapper
             condition={!isSingleGroupBuilder}
             wrapper={(children) => (
                <Accordion
                    id={expression_uuid}
                    headerContent={getHeaderComponent() || ''}
                    onIconClickHandler={() => setIsExpanded((isExpanded) => !isExpanded)}
                    isChildrenVisible={isExpanded}
                    className={cx(styles.Accordion, accordionClassName, (!isEmpty(validations) && gClasses.ErrorInputBorderImp))}
                    headerClassName={styles.Header}
                    childrenClassName={styles.AccordionContent}
                    headerContentClassName={cx(gClasses.Flex2, gClasses.MR10)}
                    iconContainerClassName={styles.IconContainer}
                     // iconClassName={styles.AccordionIcon}
                >
                    {children}
                </Accordion>
               )}
            >
                {
                    get(validations, ['label'], null) && (
                    <HelperMessage
                        type={HELPER_MESSAGE_TYPE.ERROR}
                        message={get(validations, ['label'], null)}
                        className={cx(gClasses.ErrorMarginV1)}
                    />
                    )
                }
                {getSubConditions()}
                {getAllActionButtons()}
            </ConditionalWrapper>
        }
        {children}
    </div>
);
}

export default GroupConditions;

GroupConditions.defaultProps = {
  id: null,
 //  expression: {},
  addCondition: null,
  deleteCondition: null,
  onFieldChangeHandler: null,
  className: null,
  nestedLevel: 0,
  expressionIndex: 0,
  expressionPathTrace: '0',
  isSingleGroupBuilder: false,
  onActionButtonChangeHandler: () => {},
};

GroupConditions.propTypes = {
  id: PropTypes.string,
  // expression: {},
  addCondition: PropTypes.func,
  deleteCondition: PropTypes.func,
  onFieldChangeHandler: PropTypes.func,
  className: PropTypes.string,
  nestedLevel: PropTypes.number,
  expressionIndex: PropTypes.number,
  expressionPathTrace: PropTypes.number,
  onActionButtonChangeHandler: PropTypes.func,
  isSingleGroupBuilder: PropTypes.bool,
};
