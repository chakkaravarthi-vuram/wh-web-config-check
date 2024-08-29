import React from 'react';
import cx from 'classnames';
import ConditionBuilder from '../ConditionBuilder';
import styles from '../ConditionBuilder.module.scss';
import { EMPTY_STRING } from '../../../utils/strings/CommonStrings';

function SingleGroupConditionBuilder(props) {
    const {
        id,
        rule,
        hasValidation,
        isLoading,
        isDeletable = false,
        children,
        lstAllFields,
        onLoadMoreExternalFields,
        onSearchExternalFields,
        updateExpressionInReduxFn,
        onDeleteGroupCondition,
        colorScheme,
        removeDndBackendWrapper,
        noFieldsFoundMsg,
        choiceValueTypeBased = false, // only for dynamic security policy
    } = props;
    return (
          <div id={`if-${rule?.expression_uuid}`} className={cx(styles.ConditionBuilderBg, styles.SingleExpressionContainer)}>
            <ConditionBuilder
                id={id}
                rule={rule}
                className={styles.ConditionBuilderBg}
                maxNestedLevel={1}
                hasValidation={hasValidation}
                isLoading={isLoading}
                singleExpressionProps={{
                  enableSingleExpressionMode: true,
                  isDeletable: isDeletable,
                }}
                lstAllFields={lstAllFields}
                onLoadMoreExternalFields={onLoadMoreExternalFields}
                onSearchExternalFields={onSearchExternalFields}
                updateExpressionInReduxFn={updateExpressionInReduxFn}
                getClassNameBasedOnNestedLevel={(nestedLevel) => (nestedLevel === 1) ? styles.SingleExpression : EMPTY_STRING}
                onDeleteSingleGroup={onDeleteGroupCondition}
                colorScheme={colorScheme}
                removeDndBackendWrapper={removeDndBackendWrapper}
                noFieldsFoundMsg={noFieldsFoundMsg}
                choiceValueTypeBased={choiceValueTypeBased}
            />
            {children &&
              <div className={styles.SingleExpressionChildren}>
                {children}
              </div>
            }
          </div>
    );
}

export default React.memo(SingleGroupConditionBuilder);
