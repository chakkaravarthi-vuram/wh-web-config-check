import React, { useState } from 'react';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';
import { Button, TextInput } from '@workhall-pvt-lmt/wh-ui-library';
import { connect } from 'react-redux';

import gClasses from '../../../../scss/Typography.module.scss';
import styles from './WebpageEmbed.module.scss';
import { WEBPAGE_EMBED_STRINGS } from './WebpageEmbed.strings';
import { BS } from '../../../../utils/UIConstants';
import { getAppComponentByIdThunk, postVerifyWebpageEmbedUrlApiThunk } from '../../../../redux/actions/Appplication.Action';
import { applicationStateChange } from '../../../../redux/reducer/ApplicationReducer';
import jsUtility, { cloneDeep, get, isEmpty } from '../../../../utils/jsUtility';
import { getComponentInfoErrorMessage } from '../AppConfigurtion.utils';
import { validate } from '../../../../utils/UtilityFunctions';
import { saveCompValidationSchema } from '../../application.validation.schema';
import { BUTTON_TYPE } from '../../../../utils/Constants';
import { EMPTY_STRING } from '../../../../utils/strings/CommonStrings';
import EyeIcon from '../../../../assets/icons/EyeIcon';
import LoaderIcon from '../../../../assets/icons/LoaderIcon';
import Iframe from '../../../../components/iframe/Iframe';

function WebpageEmbed(props) {
    const { t } = useTranslation();
    const { FIELD: { WEBPAGE_EMBED_URL, WEBPAGE_EMBED_LABEL } } = WEBPAGE_EMBED_STRINGS(t);
    const {
        activeComponent,
        errorListConfig,
        applicationDataChange,
        verifyWebpageEmbeddingUrl,
        isEmbedUrlVerified,
    } = props;
    const [isIframeLoading, setIframeLoading] = useState(false);
    const [showVerificationFailed, setShowVerificationFailed] = useState(false);
    const onChangeHandler = (value, _label, _unused, id) => {
        const clonedActiveComponent = cloneDeep(activeComponent);
        let data = null;
        switch (id) {
            case WEBPAGE_EMBED_URL.ID:
                clonedActiveComponent.component_info = { embed: { url: value } };
                data = { activeComponent: clonedActiveComponent, isEmbedUrlVerified: false };
                break;
            case WEBPAGE_EMBED_LABEL.ID:
                clonedActiveComponent.label = value;
                data = { activeComponent: clonedActiveComponent };
                break;
            default:
                break;
        }
        let error_list = {};
        if (!jsUtility.isEmpty(errorListConfig)) {
            error_list = validate(clonedActiveComponent, saveCompValidationSchema(t));
        }
        applicationDataChange({ ...data, error_list_config: error_list });
    };

    const onLoadClick = async () => {
        const url = { embed_url: activeComponent?.component_info?.embed?.url };
        let error_list = {};
        const clonedActiveComponent = cloneDeep(activeComponent);
        clonedActiveComponent.isEmbedUrlVerified = false;
        error_list = validate(clonedActiveComponent, saveCompValidationSchema(t));
        console.log('error_list', clonedActiveComponent, error_list);
        if (!('component_info,embed,url' in error_list) && !isEmpty(clonedActiveComponent?.component_info?.embed?.url)) {
            setIframeLoading(true);
            verifyWebpageEmbeddingUrl(url).then((responseUrl) => {
                const data = { ...clonedActiveComponent, isEmbedUrlVerified: true, component_info: { embed: { url: responseUrl } } };
                const error_list = { error_list_config: validate(data, saveCompValidationSchema(t)) };
                setShowVerificationFailed(false);
                applicationDataChange({ ...data, ...error_list });
            }).catch((err) => {
                setIframeLoading(false);
                const errorData = get(err, ['response', 'data', 'errors', 0], {});
                console.log('error_list catch', errorData);
                let errorListData = { error_list_config: validate(clonedActiveComponent, saveCompValidationSchema(t)) };
                if ((errorData?.field === 'url' && errorData.type === 'string.uri') || errorData?.field === 'embed_url') {
                    setShowVerificationFailed(true);
                    errorListData = {
                        error_list_config: {
                            ...errorListData.error_list_config,
                            isEmbedUrlVerified: 'Embed URL failed verification',
                        },
                        isEmbedUrlVerified: false,
                    };
                }
                applicationDataChange({ ...clonedActiveComponent, ...errorListData });
            });
        } else {
            applicationDataChange({ ...clonedActiveComponent, error_list_config: error_list });
        }
    };
    const onIframeLoad = () => {
        setIframeLoading(false);
    };
    console.log('webpage_embed onChangeHandler out', activeComponent);
    let isEmbedUrlVerifiedErrorMessage = null;
    if ('isEmbedUrlVerified' in errorListConfig) {
        if (activeComponent?.component_info?.embed?.url === undefined || activeComponent?.component_info?.embed?.url === EMPTY_STRING) {
            isEmbedUrlVerifiedErrorMessage = 'Webpage Embed URL is required';
        } else if (showVerificationFailed) {
            isEmbedUrlVerifiedErrorMessage = 'Embed URL verification failed';
        }
    }
    const urlErrorMessage = getComponentInfoErrorMessage(errorListConfig, 'embed,url') || isEmbedUrlVerifiedErrorMessage;
    console.log('site loaded urlErrorMessage1', isEmbedUrlVerified, isIframeLoading);
    // && errorListConfig.isEmbedUrlVerified);
    return (
        <div className={cx(BS.W100, BS.D_FLEX, BS.FLEX_COLUMN, gClasses.Gap16)}>
            <TextInput
                id={WEBPAGE_EMBED_LABEL.ID}
                value={activeComponent?.label}
                labelText={WEBPAGE_EMBED_LABEL.LABEL}
                placeholder={WEBPAGE_EMBED_LABEL.PLACEHOLDER}
                inputInnerClassName={BS.W100}
                onChange={(e) => {
                    onChangeHandler(e?.target?.value, null, null, WEBPAGE_EMBED_LABEL.ID);
                }}
                required
                errorMessage={errorListConfig?.label}
            />
            <TextInput
                id={WEBPAGE_EMBED_URL.ID}
                value={activeComponent?.component_info?.embed?.url}
                labelText={WEBPAGE_EMBED_URL.LABEL}
                placeholder={WEBPAGE_EMBED_URL.PLACEHOLDER}
                inputInnerClassName={BS.W100}
                onChange={(e) => {
                    onChangeHandler(e?.target?.value, null, null, WEBPAGE_EMBED_URL.ID);
                }}
                errorMessage={urlErrorMessage}
                required
            />
            <Button
                onClick={onLoadClick}
                type={BUTTON_TYPE.TERTIARY}
                buttonText="Preview"
                icon={<EyeIcon className={styles.EyeIcon} />}
                className={styles.PreviewButton}
            />

            <div className={isIframeLoading ? styles.IframeContainer : BS.HIDDEN}>
                <LoaderIcon />
            </div>

            {(isEmbedUrlVerified) && (
                <div className={!isIframeLoading ? styles.IframeContainer : BS.HIDDEN}>
                    <Iframe
                        src={activeComponent?.component_info?.embed?.url}
                        title="iframe"
                        onLoad={onIframeLoad}
                    />

                </div>)}

            {(isEmbedUrlVerified === true) && (
                <div className={cx(gClasses.FOne13GrayV2, gClasses.MT15, styles.EditContentClass)}>
                    *If siteloading fails, kindly check with your admin.
                </div>
            )}
        </div>
    );
}

const mapStateToProps = (state) => {
    return {
        activeComponent: state.ApplicationReducer?.activeComponent,
        errorListConfig: state.ApplicationReducer?.error_list_config,
        isEmbedUrlVerified: state.ApplicationReducer?.isEmbedUrlVerified,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getComponentById: (id) => dispatch(getAppComponentByIdThunk(id)),
        applicationDataChange: (data) => dispatch(applicationStateChange(data)),
        verifyWebpageEmbeddingUrl: (data) => dispatch(postVerifyWebpageEmbedUrlApiThunk(data)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(WebpageEmbed);
