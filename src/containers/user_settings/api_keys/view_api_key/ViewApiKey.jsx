import React, { useEffect, useState } from 'react';
import cx from 'classnames/bind';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import gClasses from 'scss/Typography.module.scss';
import { ETitleSize, Modal, ModalSize, ModalStyleType, Text, Title } from '@workhall-pvt-lmt/wh-ui-library';
import { API_KEY_VALUES } from '../../UserSettings.utils';
import styles from '../../UserSettings.module.scss';
// import { cloneDeep, isEmpty } from '../../../../utils/jsUtility';
import { ARIA_ROLES, BS } from '../../../../utils/UIConstants';
import CloseVectorIcon from '../../../../assets/icons/create_app/create_modal/CloseVectorIcon';
import { API_KEY_STRINGS } from '../../UserSettings.strings';
import { decryptApiKeyThunk, generateApiKeyThunk, userSettingsDataChange } from '../../../../redux/actions/UserSettings.Action';
import { EMPTY_STRING } from '../../../../utils/strings/CommonStrings';
import GreenTickCircleIcon from '../../../../assets/icons/GreenTickCircleIcon';
import CopyIcon from '../../../../assets/icons/integration/CopyIcon';
import GreenTickIcon from '../../../../assets/icons/form_post_operation_feedback/GreenTickIcon';
import PasswordEyeOpen from '../../../../assets/icons/PasswordEyeNew';
import { CREDENTIAL_EXPIRY_DATE, MASKED_VALUE } from '../../../integration/Integration.constants';
import EditIconPencil from '../../../../assets/icons/integration/EditIconPencil';
import { OAUTH_CRED_LABELS } from '../../../integration/Integration.strings';
import { getFormattedDateFromUTC } from '../../../../utils/dateUtils';
import { keydownOrKeypessEnterHandle } from '../../../../utils/UtilityFunctions';

function ViewApiKey(props) {
    const {
        isModalOpen,
        apiKeyData,
        onUserSettingsDataChange,
        isSingleCardClicked,
        decryptApiKey,
    } = props;
    const { t } = useTranslation();

    const [isCopyTickApiKey, setCopyTickApiKey] = useState(false);
    const [isEyeOpen, setEyeOpen] = useState(false);

    const clearData = {
        name: EMPTY_STRING,
        scope: EMPTY_STRING,
    };

    useEffect(() => {
        if (isCopyTickApiKey) {
          const timeoutId = setTimeout(() => {
            setCopyTickApiKey(false);
          }, 3000);
          return () => clearTimeout(timeoutId);
        }
        return () => { };
    }, [isCopyTickApiKey]);

    const onCloseModal = () => {
        onUserSettingsDataChange({
            isViewApiKeyOpen: false,
            apiKeyData: clearData,
        });
        setEyeOpen(false);
    };

    const headerContent = (
        <div className={cx(gClasses.CenterV, BS.JC_END, styles.EditKeyHeader)}>
            <button onClick={onCloseModal}>
                <CloseVectorIcon />
            </button>
        </div>
    );

    const onCopyIconClick = async () => {
        try {
            await navigator.clipboard.writeText(apiKeyData?.api_key);
            setCopyTickApiKey(true);
        } catch (e) {
            console.log('copy API key failed', e);
        }
    };

    const onEditKey = () => {
        onUserSettingsDataChange({
            isEditApiKeyOpen: true,
            isViewApiKeyOpen: false,
        });
        setEyeOpen(false);
    };

    const onEyeIconClick = async () => {
        const params = { _id: apiKeyData?._id };
        if (!isEyeOpen) {
            try {
                const response = await decryptApiKey(params);
                if (response?.api_key) {
                    setEyeOpen(true);
                }
            } catch (error) {
                console.log('errorDecryptAPI', error);
            }
        }
    };

    const mainContent = (
        <>
            <Title
                content={API_KEY_STRINGS(t).GENERATE_KEY}
                size={ETitleSize.small}
                className={cx(styles.ApiKeyTitle, gClasses.MB12)}
            />
            <Text content={API_KEY_STRINGS(t).TITLE_INFO} className={cx(styles.TitleInfo, gClasses.MB24)} />
            {!isSingleCardClicked &&
                <div className={cx(gClasses.CenterV, styles.KeySuccess, gClasses.MB24)}>
                    <GreenTickCircleIcon />
                    <div className={gClasses.ML16}>
                        <Text content={API_KEY_STRINGS(t).KEY_SUCCESS_TITLE} className={cx(styles.KeySuccessTitle)} />
                        <Text content={API_KEY_STRINGS(t).KEY_SUCCESS_INFO} className={cx(styles.KeySuccessInfo)} />
                    </div>
                </div>
            }
            <Text content={API_KEY_STRINGS(t).YOUR_API_KEY} className={styles.FieldLabel} />
            <div className={cx(gClasses.CenterV, BS.JC_BETWEEN, styles.CreatedKey)}>
                <div className={gClasses.CenterV}>
                    <Text
                        className={styles.ApiKeyValue}
                        content={!isSingleCardClicked || (isSingleCardClicked && isEyeOpen) ?
                            apiKeyData?.api_key
                        : MASKED_VALUE}
                    />
                    {isSingleCardClicked && !isEyeOpen &&
                        <PasswordEyeOpen
                            className={cx(gClasses.CursorPointer, gClasses.ML15)}
                            tabIndex={0}
                            onClick={onEyeIconClick}
                            role={ARIA_ROLES.SWITCH}
                            onEyeClick={isEyeOpen}
                            onkeyDown={(e) => keydownOrKeypessEnterHandle(e) && onEyeIconClick()}
                        />
                    }
                </div>
                {(isSingleCardClicked && !isEyeOpen) ? null
                : (
                    isCopyTickApiKey ? <GreenTickIcon className={styles.CopyTick} />
                        : (
                            <button onClick={() => onCopyIconClick()}>
                                <CopyIcon />
                            </button>
                    )
                )}
            </div>
            {isSingleCardClicked && apiKeyData?.expiry_on ? (
                <div>
                    <Text content={OAUTH_CRED_LABELS(t).EXPIRY_DATE} className={cx(styles.FieldLabel, gClasses.MT16)} />
                    <Text content={getFormattedDateFromUTC(apiKeyData?.expiry_on, CREDENTIAL_EXPIRY_DATE)} className={cx(styles.TitleInfo, gClasses.MT4)} />
                </div>
            ) : null}
            {isSingleCardClicked &&
                <button className={cx(gClasses.MT16, gClasses.CenterV)} onClick={onEditKey}>
                    <EditIconPencil className={cx(gClasses.MR6, styles.EditIcon)} />
                    <Text content={API_KEY_STRINGS(t).EDIT_KEY} className={styles.BlueText} />
                </button>
            }
        </>
    );

    return (
        <Modal
            id={API_KEY_VALUES.EDIT_API_KEY}
            modalStyle={ModalStyleType.dialog}
            className={cx(gClasses.CursorDefault)}
            customModalClass={cx(styles.ViewKeyModal)}
            isModalOpen={isModalOpen}
            headerContent={headerContent}
            mainContent={mainContent}
            mainContentClassName={styles.ViewModalMain}
            modalSize={ModalSize.md}
        />
    );
}

const mapStateToProps = ({ UserSettingsReducer }) => {
    return {
        isEditApiKeyOpen: UserSettingsReducer.isEditApiKeyOpen,
        apiKeyData: UserSettingsReducer.apiKeyData,
        isSingleCardClicked: UserSettingsReducer.isSingleCardClicked,
    };
};

const mapDispatchToProps = {
    onUserSettingsDataChange: userSettingsDataChange,
    generateApiKey: generateApiKeyThunk,
    decryptApiKey: decryptApiKeyThunk,
};

export default connect(mapStateToProps, mapDispatchToProps)(ViewApiKey);
