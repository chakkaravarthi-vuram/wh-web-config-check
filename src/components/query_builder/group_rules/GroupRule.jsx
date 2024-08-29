import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import HelperMessage, { HELPER_MESSAGE_TYPE } from 'components/form_components/helper_message/HelperMessage';
import gClasses from '../../../scss/Typography.module.scss';
import { get, isEmpty } from '../../../utils/jsUtility';
import styles from '../QueryBuilder.module.scss';
// eslint-disable-next-line import/no-cycle
import Rule from './Rule';

function GroupRule(props) {
const {
        conditions,
        onDeleteRule,
        lstAllFields,
        validations,
        onChangeHandler,
        onLoadMoreExternalFields,
        onSearchExternalFields,
        serverEntityUUID,
      } = props;

const getErrorMessage = (ruleIndex = -1) => {
 let error_message = null;
 error_message = get(validations, ['operands,conditions,empty_rule'], null);
 if (!error_message && ruleIndex > -1) error_message = get(validations, [`operands,conditions,${ruleIndex},rule_duplicate`], null);
 return error_message;
};

const errorMessageRow = (ruleIndex = -1) => {
  const error_message = getErrorMessage(ruleIndex);
   return error_message && (
      <tr>
        <td colSpan="4">
          <HelperMessage
            type={HELPER_MESSAGE_TYPE.ERROR}
            message={error_message}
            className={cx(gClasses.ErrorMarginV1)}
          />
        </td>
      </tr>
    );
};
// Function help to get a single row condition.
const constructConditions = () => (
  (conditions || []).map((condition, ruleIndex) => {
    const {
      l_field = null,
      operator = null,
      r_value = null,
      condition_uuid = null,
    } = condition;
    return (
      <>
      <Rule
          condition_uuid={condition_uuid}
          l_field={l_field}
          operator={operator}
          r_value={r_value}
          lstAllFields={lstAllFields}
          ruleIndex={ruleIndex}
          onChangeHandler={onChangeHandler}
          onDeleteRule={onDeleteRule}
          validations={validations}
          onLoadMoreExternalFields={onLoadMoreExternalFields}
          onSearchExternalFields={onSearchExternalFields}
          serverEntityUUID={serverEntityUUID}
      />
      {errorMessageRow(ruleIndex)}
      </>
    );
    })
  );

 return (
   <table className={styles.ConditionTable} role="table">
     <thead />
     <tbody>
       {constructConditions()}
       {isEmpty(conditions) && errorMessageRow()}
     </tbody>
   </table>
  );
}

 export default GroupRule;

 GroupRule.defaultProps = {
  onDeleteRule: () => {},
  onChangeHandler: () => {},
};

GroupRule.propTypes = {
  onDeleteRule: PropTypes.func,
  onChangeHandler: PropTypes.func,
};
