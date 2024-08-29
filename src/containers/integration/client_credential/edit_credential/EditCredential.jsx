import React, { useEffect, useRef, useState } from 'react';
import cx from 'classnames/bind';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import gClasses from 'scss/Typography.module.scss';
import { Button, EButtonType, EPopperPlacements, Modal, ModalSize, ModalStyleType, MultiDropdown, Popper, Text, TextArea, TextInput, Title } from '@workhall-pvt-lmt/wh-ui-library';
import styles from '../ClientCredential.module.scss';
import CloseVectorIcon from '../../../../assets/icons/create_app/create_modal/CloseVectorIcon';
import { ARIA_ROLES, BS } from '../../../../utils/UIConstants';
import { integrationDataChange } from '../../../../redux/reducer/IntegrationReducer';
import { ACTIVE_OAUTH_SETTINGS_LIST, OAUTH_SETTINGS_LIST, SCOPE_OPTION_LIST, getCredStatusInfo, getSelectedLabels } from '../../Integration.utils';
import { CREDENTIAL_EXPIRY_DATE, CRED_STATUS_VALUES, MASKED_VALUE, OAUTH_CRED_VALUES, OAUTH_SETTINGS_VALUE } from '../../Integration.constants';
import { decryptyOauthCredentialApiThunk, deleteOauthCredentialApiThunk, enableOrDisableOauthApiThunk, generateOauthClientCredentialApiThunk, updateOauthCredentialApiThunk } from '../../../../redux/actions/Integration.Action';
import { getFormattedDateFromUTC } from '../../../../utils/dateUtils';
import { EMPTY_STRING } from '../../../../utils/strings/CommonStrings';
import SettingsAppIcon from '../../../../assets/icons/app_builder_icons/SettingsAppIcon';
import { keydownOrKeypessEnterHandle, useClickOutsideDetector, validate } from '../../../../utils/UtilityFunctions';
import ConfirmationModal from '../../../../components/form_components/confirmation_modal/ConfirmationModal';
import { CREDENTIAL_NAME_TOOLTIP, DELETE_OAUTH_LABELS, OAUTH_CRED_LABELS } from '../../Integration.strings';
import jsUtility, { cloneDeep, isEmpty } from '../../../../utils/jsUtility';
import { clientCredentialValidationSchema } from '../../Integration.validation.schema';
import CopyIcon from '../../../../assets/icons/integration/CopyIcon';
import PasswordEyeOpen from '../../../../assets/icons/PasswordEyeNew';
import GreenTickIcon from '../../../../assets/icons/form_post_operation_feedback/GreenTickIcon';
import InfoIconCircle from '../../../../assets/icons/integration/InfoIconCircle';
import Tooltip from '../../../../components/tooltip/Tooltip';

function EditCredential(props) {
    const {
        isModalOpen,
        onIntegrationDataChange,
        credentialData,
        isSingleOauthClicked,
        generateOauthClientCredentialApi,
        deleteOauthCredentialApi,
        enableOrDisableOauthApi,
        isEditableCredential,
        updateOauthCredentialApi,
        initialCredData = {},
        error_list = {},
        decryptyOauthCredentialApi,
        scope_labels,
        reloadCredentialsList,
    } = props;
    const { t } = useTranslation();

    const {
        statusLabel,
        statusStyle,
    } = getCredStatusInfo(credentialData?.status);
    console.log('responseDataEditCredential', credentialData, 'statusLabel', statusLabel, 'statusStyle', statusStyle);

    const settingsRef = useRef();
    const [isCopyTickClientId, setCopyTickClientId] = useState(false);
    const [isCopyTickClientSecret, setCopyTickClientSecret] = useState(false);
    const { CLIENT_ID, CLIENT_SECRET } = OAUTH_CRED_LABELS(t);
    const { EXPIRED, DELETED } = CRED_STATUS_VALUES;
    const [isSettingsOpen, setSettingsOpen] = useState(false);
    const [isDeleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
    useClickOutsideDetector(settingsRef, () => setSettingsOpen(false));
    const [isEyeOpen, setEyeOpen] = useState(false);

    const oAuthSettings = (credentialData?.status === EXPIRED || credentialData?.status === DELETED) ?
        ACTIVE_OAUTH_SETTINGS_LIST(t) : OAUTH_SETTINGS_LIST(t);

    const dataToValidate = {
        credential_name: credentialData?.name,
        credential_description: credentialData?.description,
        credential_scope: credentialData?.scope,
    };

    useEffect(() => {
        if (isCopyTickClientId) {
          const timeoutId = setTimeout(() => {
            setCopyTickClientId(false);
          }, 3000);
          return () => clearTimeout(timeoutId);
        }
        return () => { };
    }, [isCopyTickClientId]);

    useEffect(() => {
        if (isCopyTickClientSecret) {
          const timeoutId = setTimeout(() => {
            setCopyTickClientSecret(false);
          }, 3000);
          return () => clearTimeout(timeoutId);
        }
        return () => { };
    }, [isCopyTickClientSecret]);

    const clearCredentialData = () => {
        const clearData = {
            name: EMPTY_STRING,
            description: EMPTY_STRING,
            scope: [],
        };
        onIntegrationDataChange({
            credentialData: clearData,
            scope_labels: [],
        });
    };

    const onCloseCreateModal = () => {
        clearCredentialData();
        onIntegrationDataChange({
            isEditCredentialModalOpen: false,
            isEditableCredential: false,
            error_list: {},
        });
        setEyeOpen(false);
    };

    const onDeleteCredential = async () => {
        try {
            await deleteOauthCredentialApi({
            _id: credentialData?._id,
            });
            reloadCredentialsList();
            setDeleteConfirmationOpen(false);
            setEyeOpen(false);
            clearCredentialData();
            onIntegrationDataChange({
                isEditCredentialModalOpen: false,
            });
        } catch (e) {
          console.log('erroronDeleteCredential', e);
        }
    };

    const onOptionClick = async (value) => {
        console.log('on credPopper option click', value);
        const params = { _id: credentialData?._id };
        switch (value) {
            case OAUTH_SETTINGS_VALUE.REGENERATE:
                generateOauthClientCredentialApi(params, false);
                setEyeOpen(false);
                break;
            case OAUTH_SETTINGS_VALUE.EDIT:
                onIntegrationDataChange({
                    isEditableCredential: true,
                });
                break;
            case OAUTH_SETTINGS_VALUE.ENABLE_DISABLE:
                await enableOrDisableOauthApi(params);
                reloadCredentialsList();
                break;
            case OAUTH_SETTINGS_VALUE.DELETE:
                setDeleteConfirmationOpen(true);
                break;
            default: break;
        }
        setSettingsOpen(false);
    };

    const popperContent = oAuthSettings.map((eachOption) => (
        <button className={styles.EditOption} onClick={() => onOptionClick(eachOption.value)}>
            <div className={BS.D_FLEX}>
                {eachOption.icon}
                <Text className={cx(gClasses.ML8, styles.OptionText)} content={eachOption.label} />
            </div>
        </button>
    ));

    const headerContent = (
        <div className={cx(gClasses.CenterV, BS.JC_END, BS.W100)}>
        <button
            className={cx(gClasses.CenterV, styles.CloseButton)}
            onClick={onCloseCreateModal}
        >
            <CloseVectorIcon />
        </button>
        </div>
    );
    const scopeData = (credentialData?.scope);

    const onChangeHandler = (e, id) => {
        const value = e?.target?.value;
        console.log('valueoEditedChange', value);
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

    const onCancelEdit = () => {
        const clonedData = cloneDeep(credentialData);
        clonedData.name = initialCredData?.name;
        clonedData.description = initialCredData?.description;
        clonedData.scope = initialCredData?.scope;
        const prevLabels = getSelectedLabels(SCOPE_OPTION_LIST, initialCredData?.scope);
        onIntegrationDataChange({
            isEditableCredential: false,
            credentialData: clonedData,
            scope_labels: prevLabels,
            error_list: {},
        });
    };

    const onEyeIconClick = async () => {
        const params = { _id: credentialData?._id };
        if (!isEyeOpen) {
            try {
                const response = await decryptyOauthCredentialApi(params);
                if (response?.client_secret) {
                    setEyeOpen(true);
                }
            } catch (error) {
                console.log('errorDecryptClientSecret', error);
            }
        }
    };

    const onUpdateCredential = async () => {
        const credentialErrorList = validate(dataToValidate, clientCredentialValidationSchema(t));
        console.log('credentialErrorList', credentialErrorList);
        if (isEmpty(credentialErrorList)) {
            const params = {
                _id: credentialData?._id,
                name: credentialData?.name,
                scope: credentialData?.scope,
            };
            if (!isEmpty(credentialData?.description)) params.description = credentialData?.description;
            await updateOauthCredentialApi(params);
            reloadCredentialsList();
        } else onIntegrationDataChange({ error_list: credentialErrorList });
    };

    const onScopeChange = (value, label) => {
        const clonedData = jsUtility.cloneDeep(credentialData);
        const currentScope = clonedData?.scope;
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

    const onCopyClick = async (id) => {
        const copiedText = (id === CLIENT_ID) ? credentialData?.client_id : credentialData?.client_secret;
        try {
            await navigator.clipboard.writeText(copiedText);
            (id === CLIENT_ID) ? setCopyTickClientId(true) : setCopyTickClientSecret(true);
        } catch (error) {
            console.log('copy text failed');
        }
    };

    const mainContent = (
        <div>
            <div className={cx(BS.D_FLEX, BS.JC_BETWEEN, gClasses.MB24)}>
                <Title
                    content={OAUTH_CRED_LABELS(t).CREDENTIALS_DETAILS}
                    className={cx(styles.CreateCredTitle)}
                />
                {isSingleOauthClicked &&
                <div className={gClasses.ML12} ref={settingsRef}>
                    <button
                    onClick={() => setSettingsOpen((prevOpen) => !prevOpen)}
                    >
                    {!isEditableCredential ? <SettingsAppIcon /> : null}
                    </button>
                    <Popper
                        targetRef={settingsRef}
                        open={isSettingsOpen}
                        placement={EPopperPlacements.BOTTOM_START}
                        content={popperContent}
                        className={styles.SettingsPopper}
                    />
                </div>
                }
            </div>
            {isEditableCredential ?
                <TextInput
                    value={credentialData?.name}
                    labelText={OAUTH_CRED_LABELS(t).NAME}
                    placeholder={OAUTH_CRED_LABELS(t).NAME_PLACEHOLDER}
                    onChange={(e) => onChangeHandler(e, OAUTH_CRED_VALUES.NAME)}
                    className={cx(gClasses.MB16)}
                    errorMessage={error_list[OAUTH_CRED_VALUES.NAME]}
                    required={isEditableCredential}
                    labelClassName={cx(styles.ViewLabel, gClasses.MB7)}
                    suffixIcon={(
                        <>
                            <div id={OAUTH_CRED_VALUES.NAME_INFO}>
                                <InfoIconCircle />
                            </div>
                            <Tooltip id={OAUTH_CRED_VALUES.NAME_INFO} content={CREDENTIAL_NAME_TOOLTIP} isCustomToolTip />
                        </>
                    )}
                />
            : <div>
                <Text content={OAUTH_CRED_LABELS(t).NAME} className={cx(styles.ViewLabel, gClasses.MB7)} />
                <Text content={credentialData?.name} className={cx(styles.TextContent, gClasses.MB16)} />
              </div>
            }
            {isEditableCredential ?
                <TextArea
                    id={OAUTH_CRED_VALUES.DESCRIPTION}
                    labelText={OAUTH_CRED_LABELS(t).DESCRIPTION}
                    placeholder={OAUTH_CRED_LABELS(t).DESCRIPTION_PLACEHOLDER}
                    className={cx(gClasses.MB16)}
                    inputInnerClassName={styles.Description}
                    value={credentialData?.description}
                    onChange={(e) => onChangeHandler(e, OAUTH_CRED_VALUES.DESCRIPTION)}
                    errorMessage={error_list[OAUTH_CRED_VALUES.DESCRIPTION]}
                />
            : (
                credentialData?.description ? (
                    <>
                        <Text content={OAUTH_CRED_LABELS(t).DESCRIPTION} className={cx(styles.ViewLabel, gClasses.MB7)} />
                        <Text content={credentialData?.description} className={cx(styles.TextContent, gClasses.MB16, gClasses.WordWrap)} />
                    </>
                ) : null
            )}
            <div className={cx(styles.ClientCredData, gClasses.MB16)}>
                <div className={cx(gClasses.CenterV, BS.JC_BETWEEN)}>
                    <div>
                        <Text content={CLIENT_ID} className={cx(styles.ViewLabel, gClasses.MB4)} />
                        <Text content={credentialData?.client_id} className={cx(styles.TextContent)} />
                    </div>
                    {isCopyTickClientId ? <GreenTickIcon />
                    : (
                        <button onClick={() => onCopyClick(CLIENT_ID)}>
                            <CopyIcon />
                        </button>
                    )}
                </div>
                <div className={styles.Divider} />
                <div className={cx(BS.D_FLEX, BS.JC_BETWEEN)}>
                    <div>
                        <Text content={CLIENT_SECRET} className={cx(styles.ViewLabel, gClasses.MB4)} />
                        <div className={cx(BS.D_FLEX)}>
                            {isSingleOauthClicked ? (
                                <>
                                <Text
                                    content={isEyeOpen ? credentialData?.client_secret : MASKED_VALUE}
                                    className={cx(styles.TextContent)}
                                />
                                {!isEyeOpen &&
                                    <PasswordEyeOpen
                                        className={cx(gClasses.CursorPointer, gClasses.ML15)}
                                        tabIndex={0}
                                        onClick={onEyeIconClick}
                                        role={ARIA_ROLES.SWITCH}
                                        onEyeClick={isEyeOpen}
                                        onkeyDown={(e) => keydownOrKeypessEnterHandle(e) && onEyeIconClick()}
                                    />
                                }
                                </>
                            ) : (
                                <Text content={credentialData?.client_secret} className={cx(styles.TextContent)} />
                            )}
                        </div>
                    </div>
                    {(isSingleOauthClicked && !isEyeOpen) ? null
                    : (
                        credentialData?.client_secret ? (
                            isCopyTickClientSecret ? <div className={gClasses.CenterV}><GreenTickIcon /></div>
                            : (
                                <button onClick={() => onCopyClick(CLIENT_SECRET)} className={gClasses.CenterV}>
                                    <CopyIcon />
                                </button>
                            )
                        ) : null
                    )}
                </div>
                <div className={styles.Divider} />
                <Text content={OAUTH_CRED_LABELS(t).CREATION_DATE} className={cx(styles.ViewLabel, gClasses.MB4)} />
                <Text content={getFormattedDateFromUTC((credentialData?.created_on || credentialData?.updated_on), CREDENTIAL_EXPIRY_DATE)} className={cx(styles.TextContent)} />
                <div className={styles.Divider} />
                <Text content={OAUTH_CRED_LABELS(t).STATUS} className={cx(styles.ViewLabel, gClasses.MB4)} />
                <div className={styles.AuthInfo}>
                    <span className={cx(styles.APITypeBadge, statusStyle, gClasses.Ellipsis)}>
                        {statusLabel}
                    </span>
                </div>
            </div>
            <Text content={OAUTH_CRED_LABELS(t).EXPIRY_DATE} className={cx(styles.ViewLabel, gClasses.MB7)} />
            <Text content={getFormattedDateFromUTC(credentialData?.expiry_on, CREDENTIAL_EXPIRY_DATE)} className={cx(styles.TextContent, gClasses.MB16)} />
            {isEditableCredential ? (
                <MultiDropdown
                    optionList={cloneDeep(SCOPE_OPTION_LIST)}
                    dropdownViewProps={{
                        selectedLabel: scope_labels?.join(', '),
                        labelName: OAUTH_CRED_LABELS(t).SCOPE,
                        errorMessage: error_list[OAUTH_CRED_VALUES.SCOPE],
                        placeholder: OAUTH_CRED_LABELS(t).CHOOSE_SCOPE,
                        isRequired: true,
                        labelClassName: cx(styles.ViewLabel, gClasses.MB7),
                    }}
                    onClick={onScopeChange}
                    selectedListValue={scopeData}
                />
            ) : <div>
                    <Text content={OAUTH_CRED_LABELS(t).SCOPE} className={cx(styles.ViewLabel, gClasses.MB7)} />
                    <Text content={scope_labels.join(', ')} className={cx(styles.TextContent, gClasses.MB16)} />
                </div>
            }
        </div>
    );

    const footerContent = (
        <div className={cx(BS.D_FLEX, BS.JC_END, styles.CreateFooter)}>
            <div className={BS.D_FLEX}>
                <Button
                    type={EButtonType.OUTLINE_SECONDARY}
                    buttonText={OAUTH_CRED_LABELS(t).CANCEL}
                    onClickHandler={onCancelEdit}
                    noBorder
                />
                <Button
                    type={EButtonType.PRIMARY}
                    buttonText={OAUTH_CRED_LABELS(t).SAVE}
                    onClickHandler={onUpdateCredential}
                />
            </div>
        </div>
    );

    return (
        <>
            <Modal
                id={OAUTH_CRED_VALUES.EDIT_CREDENTIAL}
                modalStyle={isSingleOauthClicked ? ModalStyleType.modal : ModalStyleType.dialog}
                className={cx(gClasses.CursorDefault)}
                mainContentClassName={cx(styles.EditModalMain, isSingleOauthClicked ? gClasses.PB24 : styles.CreatedView)}
                isModalOpen={isModalOpen}
                headerContent={headerContent}
                mainContent={mainContent}
                modalSize={isSingleOauthClicked ? ModalSize.md : ModalSize.lg}
                footerContent={isEditableCredential && footerContent}
            />
            {isDeleteConfirmationOpen && (
                <ConfirmationModal
                    isModalOpen={isDeleteConfirmationOpen}
                    onConfirmClick={onDeleteCredential}
                    onCancelOrCloseClick={() => setDeleteConfirmationOpen(false)}
                    titleName={DELETE_OAUTH_LABELS(t).TITLE}
                    mainDescription={DELETE_OAUTH_LABELS(t).TEXT1}
                    confirmationName={DELETE_OAUTH_LABELS(t).DELETE}
                    cancelConfirmationName={DELETE_OAUTH_LABELS(t).CANCEL}
                    noClickOutsideAction
                />
                )
            }
        </>
    );
}

const mapStateToProps = ({ IntegrationReducer }) => {
    return {
      isCreateCredentialModalOpen: IntegrationReducer.isCreateCredentialModalOpen,
      credentialData: IntegrationReducer.credentialData,
      isSingleOauthClicked: IntegrationReducer.isSingleOauthClicked,
      isEditableCredential: IntegrationReducer.isEditableCredential,
      error_list: IntegrationReducer.error_list,
      initialCredData: IntegrationReducer.initialCredData,
      scope_labels: IntegrationReducer.scope_labels,
    };
  };

const mapDispatchToProps = {
    onIntegrationDataChange: integrationDataChange,
    generateOauthClientCredentialApi: generateOauthClientCredentialApiThunk,
    deleteOauthCredentialApi: deleteOauthCredentialApiThunk,
    enableOrDisableOauthApi: enableOrDisableOauthApiThunk,
    updateOauthCredentialApi: updateOauthCredentialApiThunk,
    decryptyOauthCredentialApi: decryptyOauthCredentialApiThunk,
};

export default connect(mapStateToProps, mapDispatchToProps)(EditCredential);
