import React, { useEffect } from 'react';
import cx from 'classnames/bind';
import gClasses from 'scss/Typography.module.scss';
import { Text, ETextSize } from '@workhall-pvt-lmt/wh-ui-library';
import { connect } from 'react-redux';
import { GET_CONDITION_BASED_POLICY_INITAIL_STATE, getModuleIdByType } from './PolicyBuilder.utils';
import { cloneDeep } from '../../../../utils/jsUtility';
import { POLICY_BUILDER_ALLOWED_FIELDS, POLICY_BUILDER_OPERATOR_LIST, POLICY_STRINGS } from '../security_policy/SecurityPolicy.strings';
import { getVisibilityExternalFieldsDropdownListByChoiceValueType } from '../../../../redux/reducer';
import useRuleCondition from '../../../../hooks/useRuleCondition';
import { getAllFieldsByFilterAndUpdateOnVisibilityReducer } from '../../../../redux/actions/EditFlow.Action';
import { setOperators } from '../../../../redux/actions/Visibility.Action';
import styles from '../security_policy/SecurityPolicy.module.scss';
import Plus from '../../../../assets/icons/configuration_rule_builder/Plus';
import SinglePolicyBuilder from './single_policy_builder/SinglePolicyBuilder';
import { FIELD_LIST_TYPE } from '../../../../utils/constants/form.constant';

function PolicyBuilder(props) {
   const {
    moduleId,
    moduleType,
    policies = [],
    hasValidation = false,
    onFlowDataChange,
    onPolicyConditionUpdate,
    conditionPolicyList = [],

    // Redux data
    fieldOptionList = [],
    externalFieldListData = [],
    onGetAllFieldsByFilter,
    onInitialLoadOperators,
    securityPolicyErrorList,
    } = props;

    const { POLICY_UUID, ACCESS_TO } = POLICY_STRINGS.REQUEST_KEYS;
    const ruleProps = {
        parentData: {},
        moduleProps: getModuleIdByType(moduleId, moduleType),
        onGetAllFieldsByFilter,
        externalFieldsDropdownData: externalFieldListData,
        expectedFieldPagination: {
            allowed_field_types: POLICY_BUILDER_ALLOWED_FIELDS,
            include_property_picker: undefined,
            allowed_choice_value_types: ['text', 'number'],
            field_list_type: FIELD_LIST_TYPE.DIRECT,
        },
    };

    const {
        onLoadMoreCallHandler: onLoadMoreFields,
        getAllFieldsByFilterApi,
        onSearchHandler: onSearchFields,
    } = useRuleCondition(ruleProps);

    useEffect(() => {
        onInitialLoadOperators(POLICY_BUILDER_OPERATOR_LIST);
        getAllFieldsByFilterApi();
    }, []);

    const updatePolicy = (policyUUID, key, value) => {
        const clonedPolicies = cloneDeep(policies);
        const policyIndex = clonedPolicies.findIndex((eachPolicy) => eachPolicy?.[POLICY_UUID] === policyUUID);

        if (policyIndex > -1) {
            const policy = clonedPolicies[policyIndex];
            policy[key] = value;
            if (key === ACCESS_TO) {
                delete policy?.accessToErrorMessage;
            }
            clonedPolicies[policyIndex] = policy;
        }
        onFlowDataChange({ policyList: clonedPolicies });
    };

    const onAddPolicy = () => {
        const policyList = [...cloneDeep(policies), GET_CONDITION_BASED_POLICY_INITAIL_STATE()];
        const clonedErrorList = cloneDeep(securityPolicyErrorList);

        if (clonedErrorList?.policyList) {
            delete clonedErrorList?.policyList;
        }
        onFlowDataChange({ policyList: cloneDeep(policyList), securityPolicyErrorList: clonedErrorList });
    };

    const onUpdatePolicy = (expression, policyUUID) => {
        onPolicyConditionUpdate(policyUUID, expression);
    };
    const onDeletePolicy = (policyUUID) => {
        const clonedPolicies = cloneDeep(policies);
        const policyIndex = clonedPolicies.findIndex((eachPolicy) => eachPolicy?.[POLICY_UUID] === policyUUID);
        if (policyIndex > -1) {
            clonedPolicies.splice(policyIndex, 1);
        }
        onFlowDataChange({ policyList: cloneDeep(clonedPolicies) });
    };

    const getAllPolicy = () => (
        <div className={styles.PolicyList}>
            {conditionPolicyList.map((eachPolicy) => (
                <SinglePolicyBuilder
                    key={eachPolicy?.[POLICY_UUID]}
                    policy={eachPolicy}
                    hasValidation={hasValidation}
                    fieldOptionList={fieldOptionList}
                    isDeletable={(conditionPolicyList || []).length > 1}
                    updatePolicy={updatePolicy}
                    onLoadMoreFields={onLoadMoreFields}
                    onSearchFields={onSearchFields}
                    onUpdatePolicy={onUpdatePolicy}
                    onDeletePolicy={onDeletePolicy}
                />
            ))}
        </div>
    );

    return (
        <div className={styles.CondtionBasedPolicy}>
            <Text
              content={POLICY_STRINGS.LABELS.CONDITION_BASED_POLICY_TITLE}
              size={ETextSize.MD}
              className={cx(styles.Title, gClasses.LabelStyle)}
            />
            {getAllPolicy()}
            <button
              onClick={onAddPolicy}
              className={cx(styles.AddPolicy, gClasses.MT12, gClasses.FontWeight500)}
            >
             <Plus />
             {POLICY_STRINGS.LABELS.ADD_POLICY}
            </button>
        </div>
    );
}

const mapStateToProps = (state) => {
    return {
        fieldOptionList: getVisibilityExternalFieldsDropdownListByChoiceValueType(state, null, false),
        externalFieldListData: state.VisibilityReducer.externalFieldReducer.externalFields,
    };
};

const mapDispatchToProps = (dispatch) => {
   return {
    onGetAllFieldsByFilter: (paginationData, currentFieldUuid, fieldType, noLstAllFieldsUpdate) => {
        dispatch(
          getAllFieldsByFilterAndUpdateOnVisibilityReducer(
            paginationData,
            currentFieldUuid,
            fieldType,
            noLstAllFieldsUpdate,
          ),
        );
    },
    onInitialLoadOperators: (operators = {}) => dispatch(setOperators([], operators)),
   };
};

export default connect(mapStateToProps, mapDispatchToProps)(PolicyBuilder);
