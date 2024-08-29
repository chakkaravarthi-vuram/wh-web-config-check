import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
    getDocumentGenerationConfig,
    getSendDataToDatlistApi,
    getSendEmailApiConfig,
} from '../../../../axios/apiService/flow.apiService';
import { updateLoaderStatus } from '../../node_configuration/NodeConfiguration.utils';
import { FlowNodeProvider } from '../../node_configuration/use_node_reducer/useNodeReducer';
import GenerateDocument from '../node_configurations/generate_document/GenerateDocument';
import SendDataToDlConfig from '../node_configurations/send_data_to_datalist/SendDataToDlConfig';
import SendEmailConfig from '../node_configurations/send_email/SendEmailConfig';
import { SEND_EMAIL_INITIAL_STATE } from '../node_configurations/send_email/SendEmailConfig.constants';
import { CONFIGURATION_TYPE_ID } from './Configuration.strings';
import { saveDocumentGenerationThunk, saveEmailConfigThunk, saveSendDataToDlConfigThunk } from '../../../../redux/actions/FlowStepConfiguration.Action';
import { SEND_DATA_TO_DL_INITIAL_STATE } from '../node_configurations/send_data_to_datalist/SendDataToDl.constants';
import { GENERATE_DOCUMENT_INITIAL_STATE } from '../node_configurations/generate_document/GenerateDocument.constants';

function ConfigurationModalDetails(props) {
    const {
        configDetails: { type, activeUuid },
        updateFlowStateChange,
        steps = [],
        metaData,
        actions = [],
        closeAddOnConfig,
        allSystemFields,
    } = props;
    let initialState = {};
    let renderComponent = null;

    const dispatch = useDispatch();

    const { t } = useTranslation();

    const [isLoadingNodeDetails, setNodeDetailsLoader] = useState(false);
    const [isErrorInLoadingNodeDetails, setNodeDetailsError] = useState(false);

    console.log('anbhdabhdba', metaData, isLoadingNodeDetails, isErrorInLoadingNodeDetails, activeUuid);

    const getEmailConfigDetails = async (activeUuid) => {
            try {
                setNodeDetailsLoader(true);
                setNodeDetailsError(false);
                updateLoaderStatus(true);
                const res = await getSendEmailApiConfig({
                    step_id: metaData.stepId,
                    flow_id: metaData.flowId,
                    email_uuid: activeUuid,
                });
                updateLoaderStatus(false);
                setNodeDetailsLoader(false);
                return res;
            } catch (error) {
                updateLoaderStatus(false);
                setNodeDetailsLoader(false);
                setNodeDetailsError(true);
                throw new Error(error);
            }
    };

    // const deleteEmailConfigNode = () => {

    // };

    const saveEmailConfig = (postData) => dispatch(saveEmailConfigThunk(
        postData,
    ));

    const saveSendDataToDlConfig = (postData) => dispatch(saveSendDataToDlConfigThunk(postData, closeAddOnConfig));

    const getSendDataToDlDetails = async (activeUuid) => {
        console.log('entered', activeUuid);
        try {
            console.log('tries', activeUuid, metaData);
            setNodeDetailsLoader(true);
            setNodeDetailsError(false);
            updateLoaderStatus(true);
            const res = await getSendDataToDatlistApi({
                step_id: metaData.stepId,
                flow_id: metaData.flowId,
                mapping_uuid: activeUuid,
            });
            updateLoaderStatus(false);
            setNodeDetailsLoader(false);
            console.log('anjnahhabh', res);
            return res;
        } catch (error) {
            console.log('errored');
            updateLoaderStatus(false);
            setNodeDetailsLoader(false);
            setNodeDetailsError(true);
            console.log('knkjnah', error);
            throw new Error(error);
        }
};

    const getDocumentGenerationDetails = async (activeUuid) => {
        try {
            setNodeDetailsLoader(true);
            setNodeDetailsError(false);
            updateLoaderStatus(true);
            const res = await getDocumentGenerationConfig({
                step_id: metaData.stepId,
                flow_id: metaData.flowId,
                document_generation_uuid: activeUuid,
            });
            updateLoaderStatus(false);
            setNodeDetailsLoader(false);
            return res;
        } catch (error) {
            updateLoaderStatus(false);
            setNodeDetailsLoader(false);
            setNodeDetailsError(true);
            throw new Error(error);
        }
    };

    const saveDocumentGenerationConfig = async (postData) => {
        try {
            dispatch(saveDocumentGenerationThunk(
                postData,
                true,
            ));
        } catch (e) {
            console.log(e);
        }
    };

    switch (type) {
        case CONFIGURATION_TYPE_ID.SEND_EMAIL:
            renderComponent = (
                <SendEmailConfig
                    emailActionId={activeUuid}
                    stepId={metaData?.stepId}
                    saveStepNode={saveEmailConfig}
                    // onDeleteStepClick={deleteEmailConfigNode}
                    getStepNodeDetails={getEmailConfigDetails}
                    steps={steps}
                    metaData={metaData}
                    isLoadingNodeDetails={isLoadingNodeDetails}
                    isErrorInLoadingNodeDetails={isErrorInLoadingNodeDetails}
                    updateFlowStateChange={updateFlowStateChange}
                    actions={actions}
                    isAddOnConfig
                    closeAddOnConfig={closeAddOnConfig}
                    allSystemFields={allSystemFields}
                />
            );
            initialState = SEND_EMAIL_INITIAL_STATE;
            break;
        case CONFIGURATION_TYPE_ID.DOCUMENT_GENERATION:
            initialState = GENERATE_DOCUMENT_INITIAL_STATE;
            renderComponent = (
                <GenerateDocument
                    documentGenerationId={activeUuid}
                    stepId={metaData?.stepId}
                    updateFlowStateChange={updateFlowStateChange}
                    metaData={metaData}
                    steps={steps}
                    getStepNodeDetails={getDocumentGenerationDetails}
                    isLoadingNodeDetails={isLoadingNodeDetails}
                    isErrorInLoadingNodeDetails={isErrorInLoadingNodeDetails}
                    saveStepNode={saveDocumentGenerationConfig}
                    isAddOnConfig
                    actions={actions}
                    closeAddOnConfig={closeAddOnConfig}
                    allSystemFields={allSystemFields}
                />
            );
            break;
        case CONFIGURATION_TYPE_ID.SEND_DATA_TO_DATALIST:
            renderComponent = (
                <SendDataToDlConfig
                    sendDataToDlId={activeUuid}
                    metaData={metaData}
                    // onDeleteStepClick={onDeleteStepClick}
                    stepId={metaData?.stepId}
                    updateFlowStateChange={updateFlowStateChange}
                    saveStepNode={saveSendDataToDlConfig}
                    getStepNodeDetails={getSendDataToDlDetails}
                    isLoadingNodeDetails={isLoadingNodeDetails}
                    isErrorInLoadingNodeDetails={isErrorInLoadingNodeDetails}
                    steps={steps}
                    isAddOnConfig
                    actions={actions}
                    closeAddOnConfig={closeAddOnConfig}
                    allSystemFields={allSystemFields}
                />
            );
            initialState = SEND_DATA_TO_DL_INITIAL_STATE(t);
            break;
        default:
            break;
    }
    return (
        <FlowNodeProvider initialState={initialState}>
            {renderComponent}
        </FlowNodeProvider>
    );
}

export default ConfigurationModalDetails;
