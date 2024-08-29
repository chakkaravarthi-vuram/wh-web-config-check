import cx from 'classnames';
import Accordion from 'components/accordion/Accordion';
import React, { useState } from 'react';
import QueryBuilder from '../QueryBuilder';
import gClasses from '../../../scss/Typography.module.scss';
import styles from '../QueryBuilder.module.scss';

function SingleGroupQueryBuilder(props) {
   const {
    index,
    ruleExpression,
    has_validation,
    updateExpressionInReduxFn,
    lstAllFields,
    isLoading,
    onLoadMoreExternalFields,
    onSearchExternalFields,
    headerHighlightedStaticText,
    headerDynamicText,
    children = null,
   } = props;

   const [isExpanded, setIsExpanded] = useState(true);

   const getHeaderComponent = () => (
        <div className={gClasses.CenterV}>
            <span className={styles.StaticText}>{headerHighlightedStaticText}</span>
            <span className={cx(styles.DynamicText, gClasses.FTwo13GrayV53)}>{headerDynamicText}</span>
        </div>
      );
   return (
    <Accordion
      className={styles.SingleGroupQueryBuilder}
      isChildrenVisible={isExpanded}
      headerContent={getHeaderComponent()}
      onIconClickHandler={() => setIsExpanded((isExpanded) => !isExpanded)}
      headerClassName={cx(styles.Header)}
      iconContainerClassName={styles.IconContainer}
      childrenClassName={styles.AccordionContent}
    >
            <QueryBuilder
                conditionTempId={index}
                ruleExpression={ruleExpression}
                has_validation={has_validation}
                updateExpressionInReduxFn={updateExpressionInReduxFn}
                lstAllFields={lstAllFields}
                isLoading={isLoading}
                onLoadMoreExternalFields={onLoadMoreExternalFields}
                onSearchExternalFields={onSearchExternalFields}
                isSingleGroupBuilder
            />
            <div className={gClasses.MT15}>
             {children}
            </div>
    </Accordion>
   );
}

export default SingleGroupQueryBuilder;
