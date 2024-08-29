import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import gClasses from 'scss/Typography.module.scss';
import { Button } from '@workhall-pvt-lmt/wh-ui-library';
import ConfigModal from '../../../../../components/config_modal/ConfigModal';
import SendDataToDlAdditional from './additional/SendDataToDlAdditional';
import SendDataToDlGeneral from './general/SendDataToDlGeneral';
import { SEND_DATA_TO_DL_CONFIG_CONSTANTS } from './SendDataToDl.string';
import { SEND_DATA_TO_DL_INITIAL_STATE } from './SendDataToDl.constants';
import { nodeConfigDataChange, useFlowNodeConfig } from '../../../node_configuration/use_node_reducer/useNodeReducer';
import { constructSendDataToDlPostData, constructSendDataToDlStateData, getSendDataToDlValidateData } from './SendDataToDl.utils';
import { validate } from '../../../../../utils/UtilityFunctions';
import { sendDataToDlValidationSchema, triggerMappingSchema } from './SendDataToDl.validation.schema';
import jsUtility, { cloneDeep, isEmpty } from '../../../../../utils/jsUtility';
import { displayErrorBasedOnActiveTab, getErrorTabsList, updateLoaderStatus } from '../../../node_configuration/NodeConfiguration.utils';
import NodeConfigError from '../../../node_configuration/node_config_error/NodeConfigError';
import { NODE_CONFIG_TABS } from '../../../node_configuration/NodeConfiguration.constants';
import styles from '../send_email/SendEmailConfig.module.scss';
import { DELETE_STEP_LABEL } from '../../../../../utils/strings/CommonStrings';
import { getAccountConfigurationDetailsApiService } from '../../../../../axios/apiService/accountConfigurationDetailsAdmin.apiService';
import { CONFIG_BUTTON_ARRAY } from '../../../node_configuration/NodeConfiguration.strings';
import { VALIDATION_CONSTANT } from '../../../../../utils/constants/validation.constant';

function SendDataToDlConfig(props) {
    const {
        sendDataToDlId,
        updateFlowStateChange,
        stepId,
        metaData,
        getStepNodeDetails,
        isLoadingNodeDetails,
        isErrorInLoadingNodeDetails,
        saveStepNode,
        steps = [],
        isAddOnConfig = false,
        actions,
        closeAddOnConfig,
        onDeleteStepClick,
        allSystemFields,
    } = props;
    const { state, dispatch } = useFlowNodeConfig();
    const { maximumFileSize } = state;
    const [tabIndex, setTabIndex] = useState(NODE_CONFIG_TABS.GENERAL);
    const { t } = useTranslation();
    const { SEND_DATA_TO_DL_TAB, TITLE, ADDON_CONFIG_TITLE } = SEND_DATA_TO_DL_CONFIG_CONSTANTS(t);
    let currentTabDetails;

    const id = isAddOnConfig ? sendDataToDlId : stepId;

    const getSendDataToDlNodeDetails = async () => {
        try {
            const accountConfigData =
                await getAccountConfigurationDetailsApiService();
            const staticValueDetails = {
                maximumFileSize: accountConfigData?.maximum_file_size,
                allowedExtensions: accountConfigData?.allowed_extensions,
                allowedCurrencyList: accountConfigData?.allowed_currency_types,
                defaultCurrencyType: accountConfigData?.default_currency_type,
                defaultCountryCode: accountConfigData?.default_country_code,
            };
            if (!isEmpty(id)) {
                const response = await getStepNodeDetails(id);
                console.log(response, 'send data to dl get API details');
                const stateData = constructSendDataToDlStateData(response, isAddOnConfig, metaData, actions, t);
                const errorList = {};
                console.log('statedataparam2', stateData);
                if (stateData?.dataListMapping?.dataListUuid && !stateData?.dataListMapping?.dataListUuidLabel) {
                    errorList['dataListMapping,dataListUuid'] = t(VALIDATION_CONSTANT.DATA_LIST_DELETED);
                }
                dispatch(nodeConfigDataChange({
                    ...stateData,
                    ...staticValueDetails,
                    errorList,
                    isLoadingNodeDetails: false,
                }));
                updateLoaderStatus(false);
            } else {
                dispatch(nodeConfigDataChange({
                    flowId: metaData.flowId,
                    _id: stepId,
                    stepId,
                    stepUuid: metaData.stepUuid,
                    ...staticValueDetails,
                }));
            }
        } catch (error) {
            console.log(error, 'send data to dl Step get API Error');
        }
    };

    useEffect(() => {
        getSendDataToDlNodeDetails();
    }, []);

    if (!isLoadingNodeDetails) {
        if (isErrorInLoadingNodeDetails) {
            currentTabDetails = (
                <NodeConfigError />
            );
        } else {
            if (tabIndex === NODE_CONFIG_TABS.GENERAL) {
                currentTabDetails = (
                    <SendDataToDlGeneral
                        metaData={metaData}
                        steps={steps}
                        isAddOnConfig={isAddOnConfig}
                        actions={actions}
                        allSystemFields={allSystemFields}
                    />
                );
            }
            if (tabIndex === NODE_CONFIG_TABS.ADDITIONAL) {
                currentTabDetails = (
                    <SendDataToDlAdditional />
                );
            }
        }
    }

    const onCloseClick = () => {
        if (isAddOnConfig) {
            closeAddOnConfig();
        } else {
            updateFlowStateChange({ isNodeConfigOpen: false, activeStepId: null, selectedStepType: null });
        }
        dispatch(nodeConfigDataChange({ ...SEND_DATA_TO_DL_INITIAL_STATE(t) }));
    };

    const validateData = (updatedData, isAddOnConfig) => {
        const dataToBeValidated = getSendDataToDlValidateData(updatedData, t, isAddOnConfig);
        const clonedMappingData = cloneDeep(dataToBeValidated?.dataListMapping?.mapping) || [];
        if (!isEmpty(dataToBeValidated?.dataListMapping?.mapping)) {
            dataToBeValidated.dataListMapping.mapping = dataToBeValidated?.dataListMapping?.mapping?.filter((eachMappingRow) => !eachMappingRow?.is_deleted);
        }
        console.log('ajnjadadhashdasd', updatedData, isAddOnConfig, state);
        if (isAddOnConfig) {
            delete dataToBeValidated?.stepStatus;
            delete dataToBeValidated?.stepName;
        }
        const commonErrorList = validate(dataToBeValidated, sendDataToDlValidationSchema(isAddOnConfig, t));
        const mappingErrorList = validate(clonedMappingData, triggerMappingSchema(t, { maximumFileSize }));
        if (state?.dataListMapping?.dataListUuid && !state?.dataListMapping?.dataListUuidLabel) {
            commonErrorList['dataListMapping,dataListUuid'] = t(VALIDATION_CONSTANT.DATA_LIST_DELETED);
        }
        console.log('errorListdata', commonErrorList, mappingErrorList, dataToBeValidated);
        return {
            commonErrorList,
            mappingErrorList,
        };
    };

    const handleServerErrors = (errorList) => {
        dispatch(nodeConfigDataChange({
            errorList,
        }));
    };

    const onSaveClickHandler = () => {
        const { commonErrorList, mappingErrorList } = validateData(state, isAddOnConfig);
        dispatch(nodeConfigDataChange({
            errorList: commonErrorList,
            mappingErrorList,
            isSaveClicked: true,
        }));
        if (jsUtility.isEmpty(commonErrorList) && jsUtility.isEmpty(mappingErrorList)) {
            const postData = constructSendDataToDlPostData(state, isAddOnConfig, t);
            console.log('save send data to DL post data', postData);
            saveStepNode(
                postData,
                handleServerErrors,
            )
                .then(() => {
                    onCloseClick();
                })
                .catch((error) => {
                    console.log('save send data to DL error', error);
                });
        } else if (!isAddOnConfig) {
            displayErrorBasedOnActiveTab(
                tabIndex,
                state?.stepType,
                commonErrorList,
                t,
                mappingErrorList,
            );
        }
    };

    console.log('mansnansa', isAddOnConfig);

    const footerContent = !isAddOnConfig && (
        <div className={gClasses.MRA}>
            <Button
                buttonText={t(DELETE_STEP_LABEL)}
                noBorder
                className={styles.DeleteStepButton}
                onClickHandler={() => onDeleteStepClick(id)}
            />
        </div>
    );

    return (
        <ConfigModal
            isModalOpen
            errorTabList={state?.isSaveClicked && getErrorTabsList(
                state?.stepType,
                state?.errorList,
                state?.mappingErrorList,
              )}
            modalTitle={isAddOnConfig ? ADDON_CONFIG_TITLE : TITLE}
            hideTabs={isAddOnConfig}
            modalBodyContent={currentTabDetails}
            onCloseClick={onCloseClick}
            customModalClass={styles.CustomModalClass}
            tabOptions={SEND_DATA_TO_DL_TAB}
            currentTab={tabIndex}
            onTabSelect={(tabValue) => setTabIndex(tabValue)}
            footercontent={footerContent}
            footerButton={CONFIG_BUTTON_ARRAY(onSaveClickHandler, onCloseClick, t)}
        />
    );
}

export default SendDataToDlConfig;
