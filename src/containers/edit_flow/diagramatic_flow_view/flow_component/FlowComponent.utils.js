import { cloneDeep, sortBy } from 'utils/jsUtility';
import { STEP_TYPE } from '../../../../utils/Constants';
import { REACT_FLOW_EXTEND_MINIMUM, REACT_FLOW_TRANSLATE_EXTEND } from './FlowComponent.constants';

export const getViewportConfigurations = (nodes = []) => {
    const sortedNodesBasedOnX = sortBy(nodes, (node) => node?.position?.x);
    const sortedNodesBasedOnY = sortBy(nodes, (node) => node?.position?.y);
    const translateExtent = cloneDeep(REACT_FLOW_TRANSLATE_EXTEND);
    const xLimit = (sortedNodesBasedOnX?.[0]?.position?.x || 0) + REACT_FLOW_EXTEND_MINIMUM.LEFT;
    const yLimit = (sortedNodesBasedOnY?.[0]?.position?.y || 0) + REACT_FLOW_EXTEND_MINIMUM.TOP;
    translateExtent[0][0] = xLimit;
    translateExtent[0][1] = yLimit;
    return {
        translateExtent,
        viewport: { x: -1 * xLimit, y: -1 * yLimit || 0 }, // multiplyBy -1 to get actual viewport
    };
};

export const getRestrictedStepTypes = (stepType) => {
    if (stepType === STEP_TYPE.START_STEP) {
        return ([STEP_TYPE.JOIN_STEP, STEP_TYPE.END_FLOW]);
    } else if (stepType === STEP_TYPE.PARALLEL_STEP) {
        return ([STEP_TYPE.JOIN_STEP]);
    }
    return [];
};
