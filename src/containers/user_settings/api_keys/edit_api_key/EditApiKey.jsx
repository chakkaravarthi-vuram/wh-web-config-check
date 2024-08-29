import React from 'react';
import cx from 'classnames/bind';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import gClasses from 'scss/Typography.module.scss';
import { Button, EButtonType, ETitleSize, Modal, ModalSize, ModalStyleType, RadioGroup, RadioGroupLayout, RadioSize, Text, TextInput, Title } from '@workhall-pvt-lmt/wh-ui-library';
import { API_KEY_VALUES, KEY_SCOPE_LIST } from '../../UserSettings.utils';
import styles from '../../UserSettings.module.scss';
import { cloneDeep, isEmpty } from '../../../../utils/jsUtility';
import { BS } from '../../../../utils/UIConstants';
import CloseVectorIcon from '../../../../assets/icons/create_app/create_modal/CloseVectorIcon';
import { API_KEY_STRINGS } from '../../UserSettings.strings';
import { generateApiKeyThunk, updateApiKeyDetailsThunk, userSettingsDataChange } from '../../../../redux/actions/UserSettings.Action';
import { generateEventTargetObject } from '../../../../utils/generatorUtils';
import { EMPTY_STRING } from '../../../../utils/strings/CommonStrings';
import { validate } from '../../../../utils/UtilityFunctions';
import { apiKeyValidationSchema } from '../../UserSettings.validation.schema';
import InfoIconCircle from '../../../../assets/icons/integration/InfoIconCircle';
import Tooltip from '../../../../components/tooltip/Tooltip';
import { CREDENTIAL_NAME_TOOLTIP } from '../../../integration/Integration.strings';

function EditApiKey(props) {
    const {
        isModalOpen,
        error_list,
        apiKeyData,
        onUserSettingsDataChange,
        generateApiKey,
        isSingleCardClicked,
        updateApiKeyDetails,
    } = props;

    const { t } = useTranslation();

    const dataToValidate = {
        descriptive_name: apiKeyData?.name,
        scope: apiKeyData?.scope,
    };
    const clearData = {
        name: EMPTY_STRING,
        scope: EMPTY_STRING,
    };

    const onCloseEditKey = () => {
        onUserSettingsDataChange({
            isEditApiKeyOpen: false,
            apiKeyData: clearData,
            error_list: {},
            isSingleCardClicked: false,
        });
    };

    const headerContent = (
        <div className={cx(BS.D_FLEX, BS.JC_END, styles.EditKeyHeader)}>
            <button onClick={onCloseEditKey}>
                <CloseVectorIcon />
            </button>
        </div>
    );

    const onSaveApiKey = () => {
        const apiKeyErrorList = validate(dataToValidate, apiKeyValidationSchema(t));
        console.log('apiKeyErrorList', apiKeyErrorList);
        if (isEmpty(apiKeyErrorList)) {
            const data = {
                name: apiKeyData?.name,
                scope: apiKeyData?.scope,
            };
            if (isSingleCardClicked) { // singleCardClicked is for editing api key row
                data._id = apiKeyData?._id;
                updateApiKeyDetails(data);
            } else {
                generateApiKey(data);
            }
            console.log('dataonGenerateClick', data);
        } else {
            onUserSettingsDataChange({ error_list: apiKeyErrorList });
        }
    };

    const onChangeHandler = (e, id) => {
        const value = e?.target?.value;
        console.log('valueonEditApiKey', value);
        const clonedData = cloneDeep(apiKeyData);
        const clonedErrors = cloneDeep(error_list);
        switch (id) {
            case API_KEY_VALUES.DESCRIPTIVE_NAME:
                clonedData.name = value;
                dataToValidate.descriptive_name = value;
                break;
            case API_KEY_VALUES.SCOPE:
                clonedData.scope = value;
                dataToValidate.scope = value;
                break;
            default: break;
        }
        if (!isEmpty(clonedErrors)) {
            const apiKeyErrorList = validate(dataToValidate, apiKeyValidationSchema(t));
            onUserSettingsDataChange({
                apiKeyData: clonedData,
                error_list: apiKeyErrorList,
            });
            console.log('onChangeerrors', apiKeyErrorList);
        } else {
            onUserSettingsDataChange({ apiKeyData: clonedData });
        }
    };

    const mainContent = (
        <>
            <Title
                content={isSingleCardClicked ? API_KEY_STRINGS(t).EDIT_API_KEY : API_KEY_STRINGS(t).GENERATE_KEY}
                size={ETitleSize.small}
                className={cx(styles.ApiKeyTitle, gClasses.MB12)}
            />
            <Text content={API_KEY_STRINGS(t).TITLE_INFO} className={cx(styles.TitleInfo, gClasses.MB24)} />
            <TextInput
                id={API_KEY_VALUES.DESCRIPTIVE_NAME}
                value={apiKeyData?.name}
                labelText={API_KEY_STRINGS(t).DESCRIPTIVE_NAME}
                placeholder={API_KEY_STRINGS(t).NAME_PLACEHOLDER}
                onChange={(e) => onChangeHandler(e, API_KEY_VALUES.DESCRIPTIVE_NAME)}
                className={cx(gClasses.MB24)}
                labelClassName={styles.FieldLabel}
                errorMessage={error_list[API_KEY_VALUES.DESCRIPTIVE_NAME]}
                required
                suffixIcon={(
                    <>
                        <div id={API_KEY_VALUES.NAME_INFO}>
                            <InfoIconCircle />
                        </div>
                        <Tooltip id={API_KEY_VALUES.NAME_INFO} content={CREDENTIAL_NAME_TOOLTIP} isCustomToolTip />
                    </>
                )}
            />
            <RadioGroup
                id={API_KEY_VALUES.SCOPE}
                labelText={API_KEY_STRINGS(t).SCOPE_LABEL}
                selectedValue={apiKeyData?.scope}
                options={KEY_SCOPE_LIST(t)}
                layout={RadioGroupLayout.stack}
                labelClassName={styles.FieldLabel}
                size={RadioSize.md}
                onChange={(_event, id, value) => onChangeHandler(
                    generateEventTargetObject(id, value),
                    API_KEY_VALUES.SCOPE,
                )}
                errorMessage={error_list[API_KEY_VALUES.SCOPE]}
                required
            />
        </>
    );

    const footerContent = (
        <div className={cx(BS.D_FLEX, BS.JC_END, styles.EditKeyFooter)}>
            <div className={BS.D_FLEX}>
                <Button
                    type={EButtonType.OUTLINE_SECONDARY}
                    buttonText={API_KEY_STRINGS(t).CANCEL}
                    className={cx(gClasses.MR24, styles.CancelBtn)}
                    noBorder
                    onClickHandler={onCloseEditKey}
                />
                <Button
                    type={EButtonType.PRIMARY}
                    buttonText={isSingleCardClicked ? API_KEY_STRINGS(t).SAVE : API_KEY_STRINGS(t).NEXT}
                    onClickHandler={onSaveApiKey}
                />
            </div>
        </div>
    );

    return (
        <Modal
            id={API_KEY_VALUES.EDIT_API_KEY}
            modalStyle={ModalStyleType.dialog}
            className={cx(gClasses.CursorDefault)}
            // customModalClass={cx(styles.EditKeyModal)}
            isModalOpen={isModalOpen}
            headerContent={headerContent}
            mainContent={mainContent}
            mainContentClassName={styles.EditModalMain}
            modalSize={ModalSize.md}
            footerContent={footerContent}
        />
    );
}

const mapStateToProps = ({ UserSettingsReducer }) => {
    return {
        isEditApiKeyOpen: UserSettingsReducer.isEditApiKeyOpen,
        apiKeyData: UserSettingsReducer.apiKeyData,
        isSingleCardClicked: UserSettingsReducer.isSingleCardClicked,
        error_list: UserSettingsReducer.error_list,
    };
};

const mapDispatchToProps = {
    onUserSettingsDataChange: userSettingsDataChange,
    generateApiKey: generateApiKeyThunk,
    updateApiKeyDetails: updateApiKeyDetailsThunk,
};

export default connect(mapStateToProps, mapDispatchToProps)(EditApiKey);
