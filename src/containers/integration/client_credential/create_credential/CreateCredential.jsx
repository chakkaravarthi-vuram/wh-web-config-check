import React from 'react';
import cx from 'classnames/bind';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import gClasses from 'scss/Typography.module.scss';
import { Button, EButtonType, Modal, ModalSize, ModalStyleType, MultiDropdown, TextArea, TextInput, Title } from '@workhall-pvt-lmt/wh-ui-library';
import styles from '../ClientCredential.module.scss';
import CloseVectorIcon from '../../../../assets/icons/create_app/create_modal/CloseVectorIcon';
import { BS } from '../../../../utils/UIConstants';
import { integrationDataChange } from '../../../../redux/reducer/IntegrationReducer';
import { SCOPE_OPTION_LIST } from '../../Integration.utils';
import { CREDENTIAL_NAME_TOOLTIP, OAUTH_CRED_LABELS } from '../../Integration.strings';
import { OAUTH_CRED_VALUES } from '../../Integration.constants';
import jsUtility, { cloneDeep, isEmpty } from '../../../../utils/jsUtility';
import { generateOauthClientCredentialApiThunk } from '../../../../redux/actions/Integration.Action';
import { EMPTY_STRING } from '../../../../utils/strings/CommonStrings';
import { validate } from '../../../../utils/UtilityFunctions';
import { clientCredentialValidationSchema } from '../../Integration.validation.schema';
import Tooltip from '../../../../components/tooltip/Tooltip';
import InfoIconCircle from '../../../../assets/icons/integration/InfoIconCircle';

function CreateCredential(props) {
    const {
        isModalOpen,
        onIntegrationDataChange,
        credentialData,
        credentialData: { name, description, scope },
        generateOauthClientCredentialApi,
        error_list,
        scope_labels,
        reloadCredentialsList,
    } = props;
    const { t } = useTranslation();

    console.log('credentialDataCREATEmodal', credentialData);

    const onCloseCreateModal = () => {
        const clearData = {
            name: EMPTY_STRING,
            description: EMPTY_STRING,
            scope: [],
        };
        onIntegrationDataChange({
            isCreateCredentialModalOpen: false,
            credentialData: clearData,
            scope_labels: [],
            error_list: {},
        });
    };

    const dataToValidate = {
        credential_name: credentialData?.name,
        credential_description: credentialData?.description,
        credential_scope: credentialData?.scope,
    };

    const headerContent = (
        <div className={cx(gClasses.CenterV, BS.JC_END, styles.CreateHeader)}>
        <button
            className={cx(gClasses.CenterV)}
            onClick={onCloseCreateModal}
        >
            <CloseVectorIcon />
        </button>
        </div>
    );

    const onGenerateClick = async () => {
        const credentialErrorList = validate(dataToValidate, clientCredentialValidationSchema(t));
        console.log('credentialErrorList', credentialErrorList);
        if (isEmpty(credentialErrorList)) {
            const data = {
                name: name,
                scope,
            };
            if (!isEmpty(description)) data.description = description;
            console.log('dataonGenerateClick', data);
            await generateOauthClientCredentialApi(data, true);
            reloadCredentialsList();
        } else {
            onIntegrationDataChange({ error_list: credentialErrorList });
        }
    };

    const onChangeHandler = (e, id) => {
        const value = e?.target?.value;
        console.log('valueonChangeHandlerCreate', value);
        const clonedData = cloneDeep(credentialData);
        const clonedErrors = cloneDeep(error_list);
        switch (id) {
            case OAUTH_CRED_VALUES.NAME:
                clonedData.name = value;
                dataToValidate.credential_name = value;
                break;
            case OAUTH_CRED_VALUES.DESCRIPTION:
                clonedData.description = value;
                dataToValidate.credential_description = value;
                break;
            default: break;
        }
        if (!isEmpty(clonedErrors)) {
            const credentialErrorList = validate(dataToValidate, clientCredentialValidationSchema(t));
            onIntegrationDataChange({
                credentialData: clonedData,
                error_list: credentialErrorList,
            });
            console.log('onChangeerrors', credentialErrorList);
        } else {
            onIntegrationDataChange({ credentialData: clonedData });
        }
    };

    const onScopeChange = (value, label) => {
        const clonedData = jsUtility.cloneDeep(credentialData);
        const currentScope = jsUtility.cloneDeep(scope);
        const currentLabels = cloneDeep(scope_labels);
        const clonedErrors = cloneDeep(error_list);
        const index = currentScope.findIndex((scopeValue) => scopeValue === value);
        if (index > -1) {
            currentScope.splice(index, 1);
            currentLabels.splice(index, 1);
        } else {
            currentScope.push(value);
            currentLabels.push(label);
        }

        clonedData.scope = currentScope;
        dataToValidate.credential_scope = currentScope;
        if (!isEmpty(clonedErrors)) {
            const credentialErrorList = validate(dataToValidate, clientCredentialValidationSchema(t));
            onIntegrationDataChange({
                error_list: credentialErrorList,
            });
            console.log('onScopeChangeerrors', credentialErrorList);
        }
        onIntegrationDataChange({
            credentialData: clonedData,
            scope_labels: currentLabels,
        });
    };

    const mainContent = (
        <div>
            <Title
                content={OAUTH_CRED_LABELS(t).CREATE}
                className={cx(styles.CreateCredTitle, gClasses.MB24)}
            />
            <TextInput
                id={OAUTH_CRED_VALUES.NAME}
                placeholder={OAUTH_CRED_LABELS(t).NAME_PLACEHOLDER}
                labelText={OAUTH_CRED_LABELS(t).NAME}
                className={cx(gClasses.MB16)}
                value={name}
                onChange={(e) => onChangeHandler(e, OAUTH_CRED_VALUES.NAME)}
                errorMessage={error_list[OAUTH_CRED_VALUES.NAME]}
                required
                suffixIcon={(
                    <>
                        <div id={OAUTH_CRED_VALUES.NAME_INFO}>
                            <InfoIconCircle />
                        </div>
                        <Tooltip id={OAUTH_CRED_VALUES.NAME_INFO} content={CREDENTIAL_NAME_TOOLTIP} isCustomToolTip />
                    </>
                )}
            />
            <TextArea
                id={OAUTH_CRED_VALUES.DESCRIPTION}
                placeholder={OAUTH_CRED_LABELS(t).DESCRIPTION_PLACEHOLDER}
                labelText={OAUTH_CRED_LABELS(t).DESCRIPTION}
                className={cx(gClasses.MB16)}
                inputInnerClassName={styles.Description}
                value={description}
                onChange={(e) => onChangeHandler(e, OAUTH_CRED_VALUES.DESCRIPTION)}
                errorMessage={error_list[OAUTH_CRED_VALUES.DESCRIPTION]}
            />
            {console.log('SCOPE_OPTION_LIST', cloneDeep(SCOPE_OPTION_LIST), 'scope', cloneDeep(scope))}
            <MultiDropdown
                optionList={cloneDeep(SCOPE_OPTION_LIST)}
                dropdownViewProps={{
                    labelName: OAUTH_CRED_LABELS(t).SCOPE,
                    selectedLabel: scope_labels?.join(', '),
                    errorMessage: error_list[OAUTH_CRED_VALUES.SCOPE],
                    placeholder: OAUTH_CRED_LABELS(t).CHOOSE_SCOPE,
                    isRequired: true,
                }}
                onClick={onScopeChange}
                selectedListValue={scope}
            />
        </div>
    );

    const footerContent = (
        <div className={cx(BS.D_FLEX, BS.JC_END, styles.CreateFooter)}>
            <div className={BS.D_FLEX}>
                <Button
                    type={EButtonType.OUTLINE_SECONDARY}
                    buttonText={OAUTH_CRED_LABELS(t).CANCEL}
                    onClickHandler={onCloseCreateModal}
                    noBorder
                />
                <Button
                    type={EButtonType.PRIMARY}
                    buttonText={OAUTH_CRED_LABELS(t).GENERATE}
                    onClickHandler={onGenerateClick}
                />
            </div>
        </div>
    );

    return (
        <Modal
            id={OAUTH_CRED_VALUES.CREATE_CREDENTIAL}
            modalStyle={ModalStyleType.modal}
            className={cx(gClasses.CursorDefault)}
            mainContentClassName={styles.CreateModalMain}
            isModalOpen={isModalOpen}
            headerContent={headerContent}
            mainContent={mainContent}
            modalSize={ModalSize.md}
            footerContent={footerContent}
        />
    );
}

const mapStateToProps = ({ IntegrationReducer }) => {
    return {
      isCreateCredentialModalOpen: IntegrationReducer.isCreateCredentialModalOpen,
      credentialData: IntegrationReducer.credentialData,
      error_list: IntegrationReducer.error_list,
      scope_labels: IntegrationReducer.scope_labels,
    };
  };

const mapDispatchToProps = {
onIntegrationDataChange: integrationDataChange,
generateOauthClientCredentialApi: generateOauthClientCredentialApiThunk,
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateCredential);
