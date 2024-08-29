import { Button, Chip, EButtonSizeType, ETextSize, ETitleHeadingLevel, ETitleSize, Label, Text, Title, TextInput } from '@workhall-pvt-lmt/wh-ui-library';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import gClasses from 'scss/Typography.module.scss';
import cx from 'classnames/bind';
import { EMPTY_STRING } from '../../../../../../utils/strings/CommonStrings';
import { FIELD_CONFIG } from '../../../../../../components/form_builder/FormBuilder.strings';
import styles from './AdvancedTechnicalConfiguration.module.scss';
import { MODULE_TYPES, UTIL_COLOR } from '../../../../../../utils/Constants';
import { RESPONSE_FIELD_KEYS } from '../../../../../../utils/constants/form/form.constant';
import { getReferenceNameApiService } from '../../../../../../axios/apiService/form.apiService';
import { getModuleIdByModuleType } from '../../../../Form.utils';
import jsUtility, { cloneDeep } from '../../../../../../utils/jsUtility';
import { FIELD_TYPES } from '../../FieldConfiguration.strings';
import { setPointerEvent, updatePostLoader } from '../../../../../../utils/UtilityFunctions';
import { VALIDATION_CONSTANT } from '../../../../../../utils/constants/validation.constant';

function AdvancedTechnicalConfiguration(props) {
    const { fieldDetails, setFieldDetails, metaData, moduleType, tableColumns, className,
        // isFocused, setIsFocused, onSaveFormFieldFunction,
    } = props;
    const { errorList = {} } = fieldDetails;
    const { t } = useTranslation();
    const { ADVANCED_TECHNICAL_CONFIG } = FIELD_CONFIG(t);
    const [selectedName, setSelectedName] = useState(EMPTY_STRING);
    const [referenceNameError, setReferenceNameError] = useState(EMPTY_STRING);

    // let instruction = ADVANCED_TECHNICAL_CONFIG.FLOW_FIELD_INSTRUCTION;
    let columnReferenceNameLabel = ADVANCED_TECHNICAL_CONFIG.FLOW_TABLE_COLUMN_LABEL;
    if (moduleType === MODULE_TYPES.DATA_LIST) {
        // instruction = ADVANCED_TECHNICAL_CONFIG.DATALIST_FIELD_INSTRUCTION;
        columnReferenceNameLabel = ADVANCED_TECHNICAL_CONFIG.DATALIST_TABLE_COLUMN_LABEL;
    }

    const getReferenceName = (initialCall = false, value = EMPTY_STRING) => {
        setPointerEvent(true);
        updatePostLoader(true);
        const apiParams = {
            ...getModuleIdByModuleType(metaData, moduleType, false),
            field_uuid: fieldDetails?.[RESPONSE_FIELD_KEYS.FIELD_UUID] || fieldDetails?.fieldUuid,
            field_name: fieldDetails?.[RESPONSE_FIELD_KEYS.FIELD_NAME],
            ...((value || fieldDetails?.referenceName) ? { reference_name: value || fieldDetails?.referenceName } : null),
        };
        getReferenceNameApiService(apiParams).then((res) => {
            setPointerEvent(false);
            updatePostLoader(false);
            setReferenceNameError(EMPTY_STRING);
            const { referenceName } = res;
            setFieldDetails({
                ...fieldDetails,
                [RESPONSE_FIELD_KEYS.TEMPORARY_REFERENCE_NAME]: referenceName || value || fieldDetails?.temporaryReferenceName,
                ...(initialCall && jsUtility.isEmpty(fieldDetails?.referenceName)) && {
                    [RESPONSE_FIELD_KEYS.REFERENCE_NAME]: referenceName || value,
                },
            });
            setSelectedName(referenceName || value || fieldDetails?.temporaryReferenceName || fieldDetails?.referenceName);
            // if (isFocused?.isSave) {
            //     onSaveFormFieldFunction?.({
            //         [RESPONSE_FIELD_KEYS.TEMPORARY_REFERENCE_NAME]: referenceName || value || fieldDetails?.temporaryReferenceName,
            //         ...(initialCall && jsUtility.isEmpty(fieldDetails?.referenceName)) && {
            //             [RESPONSE_FIELD_KEYS.REFERENCE_NAME]: referenceName || value,
            //         },
            //     });
            // }
        }).catch((err) => {
            setPointerEvent(false);
            updatePostLoader(false);
            setFieldDetails({
                ...fieldDetails,
                [RESPONSE_FIELD_KEYS.TEMPORARY_REFERENCE_NAME]: value || fieldDetails?.temporaryReferenceName,
            });
            const errors = err?.response?.data?.errors;
            if (errors) {
                const errorType = errors[0].type;
                if (errorType === 'string.pattern.base') {
                    setReferenceNameError(t(VALIDATION_CONSTANT.INVALID_CHARACTERS));
                } else if (errorType !== 'AuthorizationError') {
                    setReferenceNameError('Reference Name Already Exists');
                }
            }
        });
    };
    useEffect(() => {
        if (fieldDetails?.[RESPONSE_FIELD_KEYS.IS_NEW_FIELD]) {
            getReferenceName(true);
        }
    }, []);

    const validateAndSetReferenceName = (value) => {
        getReferenceName(false, value);
    };

    const getColumnsConfiguration = () => tableColumns?.map((eachColumn) => (
        <div className={gClasses.W100}>
        <div className={cx(gClasses.CenterV, styles.FlowFieldContainer, gClasses.FlexBasis100, gClasses.MB8)}>
                <Chip
                    text={eachColumn?.[RESPONSE_FIELD_KEYS.REFERENCE_NAME]}
                    textColor={UTIL_COLOR.BLUE_PRIMARY}
                    backgroundColor={UTIL_COLOR.BLUE_10}
                    className={cx(gClasses.FontSize13, gClasses.LineHeightNormal, gClasses.FontWeight400, gClasses.CenterVH, styles.FlowFieldChip)}
                    showTitle={eachColumn?.[RESPONSE_FIELD_KEYS.REFERENCE_NAME]}
                />
        </div>
        </div>
    ));

    const onBlurHandler = (value) => {
        // to make onClick event of onSave have precedence over onBlur event of tech ref name
        // setTimeout(() => {
        //     if (!isFocused?.visibility) {
                validateAndSetReferenceName(value);
        //     }
        // }, 0);
    };

    // to make onClick event of Cancel Edit have precedence over onBlur event of tech ref name
    // const handleMouseDown = () => setIsFocused({ ...isFocused, visibility: true });

    const getSameFieldConfigContent = () => (
        <>
            <Label labelName={ADVANCED_TECHNICAL_CONFIG.FLOW_FIELD.PLACEHOLDER} className={gClasses.MB6} />
            <div className={fieldDetails?.[RESPONSE_FIELD_KEYS.IS_NEW_FIELD] && cx(gClasses.DisplayFlex, gClasses.JusSpaceBtw)}>
            {
                fieldDetails?.[RESPONSE_FIELD_KEYS.IS_NEW_FIELD] &&
                fieldDetails?.fieldType === FIELD_TYPES.TABLE &&
                <Label labelName={columnReferenceNameLabel} className={gClasses.MB6} />
            }
            </div>
            <div className={fieldDetails?.[RESPONSE_FIELD_KEYS.IS_NEW_FIELD] && cx(gClasses.DisplayFlex, gClasses.JusSpaceBtw)}>
                <div className={gClasses.W100}>
                    {!fieldDetails?.[RESPONSE_FIELD_KEYS.EDIT_REFERENCE_NAME] ? (
                        <div className={cx(gClasses.CenterV, styles.FlowFieldContainer, gClasses.W100)}>
                            <Chip
                                text={fieldDetails?.[RESPONSE_FIELD_KEYS.REFERENCE_NAME]}
                                textColor={UTIL_COLOR.BLUE_PRIMARY}
                                backgroundColor={UTIL_COLOR.BLUE_10}
                                className={cx(gClasses.FontSize13, gClasses.LineHeightNormal, gClasses.FontWeight400, gClasses.CenterVH, styles.FlowFieldChip)}
                                showTitle={fieldDetails?.[RESPONSE_FIELD_KEYS.REFERENCE_NAME]}
                            />
                        </div>) : (
                        <TextInput
                            value={selectedName}
                            placeholder={ADVANCED_TECHNICAL_CONFIG.CREATE_NEW_FLOW_FIELD}
                            onChange={(event) => setSelectedName(event?.target?.value)}
                            onBlurHandler={(event) => onBlurHandler(event?.target?.value)}
                            inputClassName={styles.FlowFieldInput}
                            errorMessage={referenceNameError || errorList?.[RESPONSE_FIELD_KEYS.TEMPORARY_REFERENCE_NAME]}
                        />
                    )}
                    <Text
                        content={ADVANCED_TECHNICAL_CONFIG.CREATE_NEW_INSTRUCTION}
                        size={ETextSize.XS}
                        className={cx(gClasses.GrayV104, gClasses.MT5)}
                    />
                </div>
                {fieldDetails?.fieldType === FIELD_TYPES.TABLE &&
                <div>
                    {getColumnsConfiguration()}
                </div>}
            </div>
        </>
    );

    return (
        <>
            <div className={cx(gClasses.DisplayFlex, gClasses.JusSpaceBtw, gClasses.MT24, className)}>
                <Title
                    content={ADVANCED_TECHNICAL_CONFIG.TITLE}
                    headingLevel={ETitleHeadingLevel.h4}
                    className={cx(gClasses.MB16, styles.AdvancedTitle)}
                    size={ETitleSize.xs}
                />
                {fieldDetails?.[RESPONSE_FIELD_KEYS.IS_NEW_FIELD] &&
                    <Button
                    type={EMPTY_STRING}
                    // onMouseDown={handleMouseDown}
                    onClickHandler={() => {
                        // setIsFocused({ ...isFocused, visibility: false });
                        const clonedFieldDetails = cloneDeep(fieldDetails);
                        clonedFieldDetails[RESPONSE_FIELD_KEYS.EDIT_REFERENCE_NAME] = !fieldDetails?.[RESPONSE_FIELD_KEYS.EDIT_REFERENCE_NAME];
                        if (fieldDetails?.[RESPONSE_FIELD_KEYS.EDIT_REFERENCE_NAME]) {
                            clonedFieldDetails[RESPONSE_FIELD_KEYS.TEMPORARY_REFERENCE_NAME] = fieldDetails?.REFERENCE_NAME;
                        }
                        setFieldDetails(clonedFieldDetails);
                        setSelectedName(fieldDetails?.referenceName);
                        setReferenceNameError(EMPTY_STRING);
                    }}
                    size={EButtonSizeType.SM}
                    buttonText={!fieldDetails?.[RESPONSE_FIELD_KEYS.EDIT_REFERENCE_NAME] ? ADVANCED_TECHNICAL_CONFIG.EDIT_CONFIGURATION : ADVANCED_TECHNICAL_CONFIG.CANCEL_EDIT}
                    className={cx(gClasses.FTwo12BlueV39, gClasses.FontWeight500)}
                    />
                }
            </div>

            {getSameFieldConfigContent()}

            {/* <Text
                content={instruction}
                size={ETextSize.XS}
                className={cx(gClasses.FTwo12GrayV87, gClasses.MT6)}
            /> */}
        </>
    );
  }

  export default AdvancedTechnicalConfiguration;
