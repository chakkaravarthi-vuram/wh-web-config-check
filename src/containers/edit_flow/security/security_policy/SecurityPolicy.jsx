import React from 'react';
import cx from 'classnames/bind';
import gClasses from 'scss/Typography.module.scss';
import PolicyBuilder from '../policy_builder/PolicyBuilder';
import { POLICY_TYPE } from './SecurityPolicy.strings';
import UserFieldPolicy from '../user_field_policy/UserFieldPolicy';
import styles from './SecurityPolicy.module.scss';

function SecurityPolicy(props) {
  const {
    moduleId,
    moduleType,
    policyList = [],
    policyListHasValidation = false,
    onDataChange = null,
    onPolicyConditionUpdate,
    userFieldOptionList = [],
    userFieldPaginationData = {},
    userFieldPolicyErrorList,
    onLoadMoreFields,
    isUserFieldsLoading,
    securityPolicyErrorList,
    isRowSecurityEnabled,
  } = props;

  const conditionPolicyList = policyList?.filter(
    (eachPolicy = {}) => eachPolicy?.type === POLICY_TYPE.CONDIITON_BASED,
  );

  const userFieldPolicyList = policyList?.filter(
    (eachPolicy = {}) => eachPolicy?.type === POLICY_TYPE.USER_FIELD_BASED,
  );

  let content = null;
  if (isRowSecurityEnabled) {
    content = (
      <div className={cx(gClasses.P20, styles.SecurityContainer)}>
          <PolicyBuilder
            moduleType={moduleType}
            moduleId={moduleId}
            policies={policyList}
            conditionPolicyList={conditionPolicyList}
            hasValidation={policyListHasValidation}
            onFlowDataChange={onDataChange}
            onPolicyConditionUpdate={onPolicyConditionUpdate}
            securityPolicyErrorList={securityPolicyErrorList}
          />
          <UserFieldPolicy
            moduleId={moduleId}
            moduleType={moduleType}
            policies={policyList}
            userFieldPolicyList={userFieldPolicyList}
            userFieldOptionList={userFieldOptionList}
            userFieldPaginationData={userFieldPaginationData}
            onDataChange={onDataChange}
            errorList={userFieldPolicyErrorList}
            onLoadMoreFields={onLoadMoreFields}
            isFieldsLoading={isUserFieldsLoading}
            securityPolicyErrorList={securityPolicyErrorList}
          />
      </div>
    );
  }

  return content;
}

export default SecurityPolicy;
