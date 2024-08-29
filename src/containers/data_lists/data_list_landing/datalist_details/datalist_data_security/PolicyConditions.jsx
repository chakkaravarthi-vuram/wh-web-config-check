import React from 'react';
import cx from 'classnames/bind';
import { useTranslation } from 'react-i18next';
import { Text, Chip, EChipSize, Label } from '@workhall-pvt-lmt/wh-ui-library';
import gClasses from '../../../../../scss/Typography.module.scss';
import { DATALIST_SECURITY_CONSTANTS } from './DatalistDataSecurity.strings';
import styles from './DatalistDataSecurity.module.scss';
import { POLICY_TYPE, convertOperatorstoReadable } from './DatalistDataSecurity.utils';
import { CHIP_COLOR, UTIL_COLOR } from '../../../../../utils/Constants';
import UserPicker from '../../../../../components/user_picker/UserPicker';
import { isEmpty } from '../../../../../utils/jsUtility';
import { constructIndexingFields } from '../../../../../utils/UtilityFunctions';

function PolicyConditions(props) {
    const { policyList = [], isLoading, policyFields } = props;
    const { t } = useTranslation();
    const indexedPolicyFields = constructIndexingFields(policyFields);

    // comments - can we have NODataText as component within this folder
    const getNoDataText = () => (<Text content="-" className={gClasses.FTwo13Black18} isLoading={isLoading} />);

    const conditionPolicyList = policyList?.filter(
        (eachPolicy = {}) => eachPolicy?.type === POLICY_TYPE.CONDIITON_BASED,
      );

    const userFieldPolicyList = policyList?.filter(
    (eachPolicy = {}) => eachPolicy?.type === POLICY_TYPE.USER_FIELD_BASED,
    );

    // comments - declare constant instead of repeating the code to get the value
    const getFieldBasedSecurityComponent = () => {
        console.log('security policy field');
        if (isEmpty(conditionPolicyList)) return getNoDataText();
        return conditionPolicyList?.map((eachPolicy, policyIndex) => {
            console.log('eachPolicy check', eachPolicy);
            // comments - why JS variables not used?
            return (
                <div key={policyIndex} className={cx(gClasses.W65, styles.PolicyContainer, policyIndex !== 0 && gClasses.MT12)}>
                    <div className={cx(gClasses.DisplayFlex, gClasses.gap12)}>
                        <div className={cx(gClasses.CenterV, gClasses.FTwo13Black)}>
                            {`${eachPolicy?.policy?.logical_operator?.toUpperCase()} -`}
                            <div className={gClasses.ML4}>
                                {eachPolicy?.policy?.conditions?.map((eachCondition, conditionIndex) => (
                                    <div key={conditionIndex} className={conditionIndex !== 0 && gClasses.MT4}>
                                        {`( ${indexedPolicyFields[eachCondition.l_field]?.field_name} ) ${convertOperatorstoReadable(eachCondition.operator)} ${eachCondition?.r_value || ''}`}
                                    </div>
                                ))
                                }
                            </div>
                        </div>
                        <UserPicker // Access to
                            hideLabel
                            maxLimit={100}
                            selectedValue={eachPolicy?.access_to?.user_team}
                            disabled
                            className={gClasses.NoPointerEvent}
                            buttonClassName={gClasses.DisplayNone}
                            // selectedValueContainerClassName={styles.SecurityLabel}
                        />
                    </div>
                </div>
            );
        });
    };

    const getUserPolicyComponent = () => {
        console.log('userpolicies', userFieldPolicyList);
        if (isEmpty(userFieldPolicyList)) return getNoDataText();
        return userFieldPolicyList?.[0]?.access_to?.field_uuids?.map((eachField, eachFieldIndex) => (
            <div key={eachFieldIndex} className={cx(gClasses.W50, styles.PolicyContainer, eachFieldIndex !== 0 && gClasses.MT12)}>
                <div className={cx(gClasses.DisplayFlex, gClasses.Gap16, gClasses.FTwo13Black)}>
                    {indexedPolicyFields[eachField]?.field_name}
                    <Chip
                        text={indexedPolicyFields[eachField]?.field_type}
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

    const getLabel = (content) => (
    <Label
        labelName={content}
        className={cx(styles.Security, gClasses.PB4)}
        isLoading={isLoading}
    />);

    const getMainContent = () => {
        if (isEmpty(conditionPolicyList) && isEmpty(userFieldPolicyList)) {
            return getNoDataText();
        }
        return (
            <>
            <div className={gClasses.MB16}>
                    {getLabel(DATALIST_SECURITY_CONSTANTS(t).SECURITY_POLICY.CONDITION_POLICY_SECURITY.LABEL)}
                    {getFieldBasedSecurityComponent()}
            </div>
            <div className={gClasses.MB16}>
                {getLabel(DATALIST_SECURITY_CONSTANTS(t).SECURITY_POLICY.USER_FIELD_POLICY_SECURITY.LABEL)}
                {getUserPolicyComponent()}
            </div>
            </>
        );
    };

    return (
        <div>
            <Text
                content={DATALIST_SECURITY_CONSTANTS(t).SECURITY_POLICY.ADVANCED_DATA_SECURITY}
                className={cx(gClasses.FTwo16GrayV3, gClasses.FontWeight500, gClasses.MB12)}
            />
            {getMainContent()}
        </div>
    );
}

export default PolicyConditions;
