import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import DependencyHandler from '../../../components/dependency_handler/DependencyHandler';
import { deleteStepAPIThunk } from '../../../redux/actions/FlowStepConfiguration.Action';
import { listDependencyApiThunk } from '../../../redux/actions/Form.Action';
import { updateFlowDataChange } from '../../../redux/reducer/EditFlowReducer';
import { cloneDeep } from '../../../utils/jsUtility';

function NodeDeleteConfiguration() {
    const reduxDispatch = useDispatch();
    const {
        flowData,
        flowData: {
            dependencyData = {},
            dependencyName,
            deleteStepDetails = {},
            isDependencyListLoading,
            isErrorInLoadingDependencyList,
        },
    } = useSelector((state) => state.EditFlowReducer);
    const onDeleteStepHandlerFromDependencyConfig = async () => {
        const flowDataCloned = cloneDeep(flowData);
        const stepIndex = flowDataCloned.steps.findIndex((step) => deleteStepDetails._id === step._id);
        reduxDispatch(deleteStepAPIThunk(stepIndex));
    };

    const updateFlowData = (...rest) => {
        reduxDispatch(updateFlowDataChange(...rest));
    };

    const getMoreDependency = (id, path, type, key = '_id') => {
        if (dependencyData) {
            reduxDispatch(listDependencyApiThunk({ [key]: id, type }, path, dependencyData));
        }
    };

    return (
        <DependencyHandler
            onDeleteClick={onDeleteStepHandlerFromDependencyConfig}
            onCancelDeleteClick={() => {
                updateFlowData({
                    showFieldDependencyDialog: false,
                    showStepDependencyDialog: false,
                    showFormDependencyDialog: false,
                });
            }}
            dependencyHeaderTitle={dependencyName}
            dependencyData={dependencyData}
            getMoreDependency={getMoreDependency}
            isDependencyListLoading={isDependencyListLoading}
            isErrorInLoadingDependencyList={isErrorInLoadingDependencyList}
        />
    );
}

export default NodeDeleteConfiguration;
