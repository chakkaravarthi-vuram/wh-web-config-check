import React, { useState, useEffect } from 'react';
import { BorderRadiusVariant, ETextSize, Size, Text, TextInput, Variant } from '@workhall-pvt-lmt/wh-ui-library';
import cx from 'classnames/bind';
import gClasses from 'scss/Typography.module.scss';
import { FLOW_STRINGS } from '../../EditFlow.strings';
import { isEmpty } from '../../../../utils/jsUtility';
import styles from './TechnicalConfiguration.module.scss';
import { generateEntityReferenceNameAPI } from '../../../../axios/apiService/flow.apiService';
import { generateEventTargetObject } from '../../../../utils/generatorUtils';

export default function TechnicalConfiguration(props) {
    const [isLoadingReferenceName, setIsLoadingReferenceName] = useState(false);
    const {
        idList,
        shortCode,
        referenceName,
        referenceNameChangeHandler,
        shortCodeChangeHandler,
        errorList,
        disableShortCode,
        disableReferenceName,
        entityUuid,
        name,
    } = props;

    const loadReferenceName = async () => {
        setIsLoadingReferenceName(true);
        try {
            const res = await generateEntityReferenceNameAPI({ [idList.ENTITY_UUID]: entityUuid, entity_name: name });
            if (!isEmpty(res)) {
                referenceNameChangeHandler(generateEventTargetObject(idList.TECHNICAL_REF_NAME, res));
            }
            setIsLoadingReferenceName(false);
        } catch (e) {
            setIsLoadingReferenceName(false);
        }
    };

    useEffect(() => {
        if (isEmpty(referenceName)) {
            loadReferenceName();
        }
    }, []);

    return (
        <div>
            <Text
                content={FLOW_STRINGS.SETTINGS.TECHNICAL_CONFIGURATION.TITLE}
                size={ETextSize.MD}
                className={cx(
                    gClasses.SectionSubTitle,
                    gClasses.MB16,
                    gClasses.MT24,
                )}
            />
            <TextInput
                id={idList.SHORT_CODE}
                borderRadiusType={BorderRadiusVariant.rounded}
                variant={Variant.border}
                size={Size.lg}
                value={shortCode}
                errorMessage={errorList[idList.SHORT_CODE]}
                onChange={shortCodeChangeHandler}
                labelText={FLOW_STRINGS.SETTINGS.TECHNICAL_CONFIGURATION.SHORT_CODE_STRINGS.TITLE}
                readOnly={disableShortCode}
                className={gClasses.MB16}
                inputClassName={!disableShortCode && styles.InputField}
                placeholder={FLOW_STRINGS.BASIC_INFO.SHORT_CODE.PLACEHOLDER}
            />
            <TextInput
                id={idList.TECHNICAL_REF_NAME}
                borderRadiusType={BorderRadiusVariant.rounded}
                variant={Variant.border}
                size={Size.lg}
                className={gClasses.MB16}
                instruction={FLOW_STRINGS.SETTINGS.TECHNICAL_CONFIGURATION.REFERENCE_NAME_STRINGS.INFORMATION}
                value={referenceName}
                errorMessage={errorList[idList.TECHNICAL_REF_NAME]}
                onChange={referenceNameChangeHandler}
                labelText={FLOW_STRINGS.SETTINGS.TECHNICAL_CONFIGURATION.REFERENCE_NAME_STRINGS.TITLE}
                readOnly={disableReferenceName}
                isLoading={isLoadingReferenceName}
                inputClassName={!disableShortCode && styles.InputField}
                placeholder={FLOW_STRINGS.BASIC_INFO.FLOW_TECHNICAL_REF_NAME.PLACEHOLDER}
            />
        </div>
    );
}
