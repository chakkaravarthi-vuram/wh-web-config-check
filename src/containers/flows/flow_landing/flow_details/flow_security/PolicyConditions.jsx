import React from 'react';
import cx from 'classnames/bind';
import { useTranslation } from 'react-i18next';
import { Text, Chip, EChipSize, Label } from '@workhall-pvt-lmt/wh-ui-library';
import gClasses from '../../../../../scss/Typography.module.scss';
import { FLOW_SECURITY_CONSTANTS } from './FlowSecurity.strings';
import styles from './FlowSecurity.module.scss';
import { POLICY_TYPE } from './FlowSecurity.utils';
import { CHIP_COLOR, UTIL_COLOR } from '../../../../../utils/Constants';
import UserPicker from '../../../../../components/user_picker/UserPicker';
import { isEmpty } from '../../../../../utils/jsUtility';
import { convertOperatorstoReadable } from '../../../../data_lists/data_list_landing/datalist_details/datalist_data_security/DatalistDataSecurity.utils';
import { constructIndexingFields } from '../../../../../utils/UtilityFunctions';

function PolicyConditions(props) {
   const { policyList, policyFields } = props;
    const { t } = useTranslation();
    const { SECURITY_POLICY } = FLOW_SECURITY_CONSTANTS(t);

    const indexedPolicyFields = constructIndexingFields(policyFields);

    const conditionPolicyList = policyList?.filter(
        (eachPolicy = {}) => eachPolicy?.type === POLICY_TYPE.CONDIITON_BASED,
      );

    const userFieldPolicyList = policyList?.filter(
    (eachPolicy = {}) => eachPolicy?.type === POLICY_TYPE.USER_FIELD_BASED,
    );

    const getFieldBasedSecurityComponent = () => {
        if (isEmpty(conditionPolicyList)) return '-';
        return conditionPolicyList?.map((eachPolicy, policyIndex) => (
                <div key={policyIndex} className={cx(gClasses.W65, styles.PolicyContainer, policyIndex !== 0 && gClasses.MT12)}>
                    <div className={cx(gClasses.DisplayFlex, gClasses.gap12)}>
                        <div className={cx(gClasses.CenterV, gClasses.FTwo13Black)}>
                            {`${eachPolicy?.policy?.logical_operator?.toUpperCase()} -`}
                            <div className={gClasses.ML4}>
                                {eachPolicy?.policy?.conditions?.map((eachCondition, conditionIndex) => (
                                    <div key={conditionIndex} className={conditionIndex !== 0 && gClasses.MT4}>
                                        {`( ${indexedPolicyFields[eachCondition.l_field]?.field_name || 'Field'} ) ${convertOperatorstoReadable(eachCondition.operator)} ${eachCondition?.r_value || ''}`}
                                    </div>
                                ))
                                }
                            </div>
                        </div>
                        <UserPicker // Access to
                            hideLabel
                            maxLimit={100}
                            selectedValue={eachPolicy.access_to?.user_team || {}}
                            disabled
                            className={gClasses.NoPointerEvent}
                            buttonClassName={gClasses.DisplayNone}
                            // selectedValueContainerClassName={styles.SecurityLabel}
                        />
                    </div>
                </div>
            ));
    };

    const getUserPolicyComponent = () => {
        if (isEmpty(userFieldPolicyList)) return '-';
        return userFieldPolicyList?.[0]?.access_to?.field_uuids?.map((eachField, eachFieldIndex) => (
            <div key={eachFieldIndex} className={cx(gClasses.W50, styles.PolicyContainer, eachFieldIndex !== 0 && gClasses.MT12)}>
                <div className={cx(gClasses.DisplayFlex, gClasses.Gap16, gClasses.FTwo13Black)}>
                    {indexedPolicyFields[eachField]?.field_name}
                    <Chip
                        text={indexedPolicyFields[eachField].field_type}
                        size={EChipSize.md}
                        className={cx(gClasses.WhiteSpaceNoWrap)}
                        textClassName={gClasses.FTwo12}
                        backgroundColor={CHIP_COLOR.BLUE_01}
                        textColor={UTIL_COLOR.BLUE_PRIMARY}
                    />
                </div>
            </div>
        ));
    };

    const getLabel = (labelText) => (
        <Label
            labelName={labelText}
            className={cx(styles.Security, gClasses.PB4)}
        />
    );

    const getMainContent = () => {
        if (isEmpty(conditionPolicyList) && isEmpty(userFieldPolicyList)) {
            return '-';
        }
        return (
            <>
            <div className={gClasses.MB16}>
                {getLabel(SECURITY_POLICY.CONDITION_POLICY_SECURITY.LABEL)}
                {getFieldBasedSecurityComponent()}
            </div>
            <div className={gClasses.MB16}>
                {getLabel(SECURITY_POLICY.USER_FIELD_POLICY_SECURITY.LABEL)}
                {getUserPolicyComponent()}
            </div>
            </>
        );
    };

    return (
        <div>
            <Text
                content={SECURITY_POLICY.ADVANCED_DATA_SECURITY}
                className={cx(gClasses.FTwo16GrayV3, gClasses.FontWeight500, gClasses.MT16)}
            />
            {getMainContent()}
        </div>
    );
}

export default PolicyConditions;
