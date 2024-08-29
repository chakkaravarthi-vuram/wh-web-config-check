import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { CheckboxGroup, ETextSize, Text } from '@workhall-pvt-lmt/wh-ui-library';

import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import ConditionBuilderWithMapping from '../../../../../components/condition_builder_with_field_mapping/ConditionBuilderWithFieldMapping';
import { getVisibilityExternalFieldsDropdownList } from '../../../../../redux/reducer';
import { clearVisibilityOperators, setOperators } from '../../../../../redux/actions/Visibility.Action';
import { POLICY_BUILDER_OPERATOR_LIST } from '../../../../edit_flow/security/security_policy/SecurityPolicy.strings';
import jsUtility from '../../../../../utils/jsUtility';
import Trash from '../../../../../assets/icons/application/Trash';
import PlusIcon from '../../../../../assets/icons/PlusIcon';
import styles from '../../datalist/DatalistData.module.scss';
import { getExpressionInitialStateForCBWithMapping } from '../../../../../components/condition_builder_with_field_mapping/ConditionBuilderWithFieldMapping.utils';
import { DATA_LIST_CONSTANTS } from '../../ExternalSource.constants';
import { DATALIST_STRINGS } from '../../ExternalSource.strings';

function ExternalSourceFilter(props) {
    const {
        // entry
        // dataListUUID = null,
        type = null,
        tableUUID = null,

        // filter
        filter,
        handleFilterChange,

        // field list
        lSystemFields,
        rSystemFields,
        externalFieldsDropdownList,
        rDataFields,

        // actions
        onInitialLoadOperators,
        onClearOperators,
    } = props;

    const { t } = useTranslation();

    const {
        rule, hasValidation, postRule, isPostRuleHasValidation,
    } = jsUtility.pick(filter, ['rule', 'hasValidation', 'postRule', 'isPostRuleHasValidation']);

    const isRuleEmpty = isEmpty(rule);
    const isPostRuleEmpty = isEmpty(postRule);

    useEffect(() => {
        onInitialLoadOperators(POLICY_BUILDER_OPERATOR_LIST);
        return () => onClearOperators();
    }, []);

    // Rule Related Actions.
    const onAddFilter = (key) => {
        handleFilterChange(key, getExpressionInitialStateForCBWithMapping().expression);
    };

    const onRemoveFilter = (key, callback = null) => {
        handleFilterChange(key, {});
        callback?.(false);
    };

    const onUpdateExpression = (key, expression) => handleFilterChange(key, expression);

    // Basic Filter
    const getBasicFilter = () => {
        const onAdd = () => onAddFilter('rule');
        const onRemove = () => onRemoveFilter('rule');

        const titleComponent = (
                <Text
                    size={ETextSize.MD}
                    className={styles.Title}
                    content={t(DATALIST_STRINGS.BASIC_FILTER)}
                />);

        if (isRuleEmpty) {
            return (
                <div className={styles.AddFilterContainer}>
                    {titleComponent}
                    <button className={styles.AddFilter} onClick={onAdd}>
                        <PlusIcon className={styles.AddIcon} />
                        <span className={styles.AddFilterText}>{t(DATALIST_STRINGS.ADD_FILTER)}</span>
                    </button>
                </div>
            );
        }

        const filterComponent = (
            <ConditionBuilderWithMapping
                id="basic-filter"
                rule={rule}
                maxNestedLevel={4}
                hasValidation={hasValidation}
                lDataFieldList={externalFieldsDropdownList}
                lSystemFieldList={Object.values(lSystemFields || {})}
                rDataFieldList={rDataFields}
                rSystemFieldList={Object.values(rSystemFields || {})}
                isLoading={false}
                updateExpressionInReduxFn={(expression) => onUpdateExpression(
                    'rule', expression)}
                choiceValueTypeBased
            />
        );

        return (
            <div className={styles.BasicFilter}>
                <div className={styles.RemoveBtn}>
                   {titleComponent}
                    <button className={styles.RemoveFilter} onClick={onRemove}>
                        <Trash className={styles.RemoveIcon} />
                        <span className={styles.RemoveFilterText}>{t(DATALIST_STRINGS.REMOVE_FILTER)}</span>
                    </button>
                </div>
                {filterComponent}
            </div>
        );
    };

    // Post Filter
    const getPostFilter = () => {
        if (type !== DATA_LIST_CONSTANTS.QUERY_TYPE.SUB_TABLE_QUERY) return null;

        const onChange = () => {
          if (isPostRuleEmpty) {
            onAddFilter('postRule');
          } else {
            onRemoveFilter('postRule');
          }
        };

        return (
            <div className={styles.PostFilter}>
                <CheckboxGroup
                    options={[
                        {
                            label: t(DATALIST_STRINGS.OPTIONAL_FILTER),
                            value: 1,
                            selected: !isPostRuleEmpty,
                        },
                    ]}
                    onClick={onChange}
                />
                {!isPostRuleEmpty && (
                     <ConditionBuilderWithMapping
                        id="post-filter"
                        rule={postRule}
                        maxNestedLevel={4}
                        hasValidation={isPostRuleHasValidation}
                        lDataFieldList={externalFieldsDropdownList}
                        lSystemFieldList={Object.values(lSystemFields || {})}
                        rDataFieldList={rDataFields}
                        rSystemFieldList={Object.values(rSystemFields || {})}
                        isLoading={false}
                        updateExpressionInReduxFn={(expression) => onUpdateExpression(
                            'postRule', expression)}
                        choiceValueTypeBased
                        isOnlyTableColumn
                        tableUUID={tableUUID}
                     />
                )}
            </div>
        );
    };

    return (
        <div className={styles.FilterContainer}>
            {getBasicFilter()}
            {getPostFilter()}
        </div>
    );
}

const mapStateToProps = (state) => {
 return {
    externalFieldsDropdownList: getVisibilityExternalFieldsDropdownList(
        state,
        null,
        false,
      ),
 };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onInitialLoadOperators: (operators = {}) => dispatch(setOperators([], operators)),
        onClearOperators: () => dispatch(clearVisibilityOperators()),
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(ExternalSourceFilter);

ExternalSourceFilter.propTypes = {
    type: PropTypes.number,
    tableUUID: PropTypes.string,
    filter: PropTypes.object,
    handleFilterChange: PropTypes.func,
    lSystemFields: PropTypes.object,
    rSystemFields: PropTypes.object,
    externalFieldsDropdownList: PropTypes.array,
    rDataFields: PropTypes.array,
    onInitialLoadOperators: PropTypes.func,
    onClearOperators: PropTypes.func,
};
