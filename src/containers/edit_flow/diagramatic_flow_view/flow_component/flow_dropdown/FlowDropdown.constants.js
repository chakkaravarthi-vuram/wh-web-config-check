import React from 'react';
import NextStepIcon from 'assets/icons/parallel_flow/flow_dropdown/NextStepIcon';
import EndIcon from 'assets/icons/parallel_flow/flow_dropdown/EndIcon';
import LinkExistingIcon from 'assets/icons/parallel_flow/flow_dropdown/LinkExistingIcon';
import BranchParallelIcon from 'assets/icons/parallel_flow/flow_dropdown/BranchParallelIcon';
import JoinParallelIcon from 'assets/icons/parallel_flow/flow_dropdown/JoinParallelIcon';
import { STEP_TYPE } from 'utils/Constants';
import TriggerIcon from 'assets/icons/parallel_flow/flow_dropdown/TriggerIcon';
import IntegrationIcon from 'assets/icons/parallel_flow/flow_dropdown/IntegrationIcon';
import styles from './FlowDropdown.module.scss';
import { FLOW_DROPDOWN_STRINGS } from './FlowDropdown.strings';
import MLModelIcon from '../../../../../assets/icons/side_bar/MLModelIcon';

export const FLOW_DROPDOWN_COMPONENT_ID = {
    SEQUENCE: 'sequence',
    PARALLEL_HEADER: 'parallel_header',
    NEW_STEP: 'new_step',
    END: 'end_flow',
    PARALLEL_STEP: 'parallel_step',
    JOIN_STEP: 'join_step',
    OTHERS: 'others',
    TRIGGER_FLOW: 'trigger_flow',
    INTEGRATION: 'integration',
    ML_MODEL: 'ml_models',
};

export const FLOW_DROPDOWN_LIST = [
    {
        ID: FLOW_DROPDOWN_COMPONENT_ID.SEQUENCE,
        TITLE: FLOW_DROPDOWN_STRINGS.SEQUENCE,
    },
    {
        ID: FLOW_DROPDOWN_COMPONENT_ID.NEW_STEP,
        TITLE: FLOW_DROPDOWN_STRINGS.NEW_STEP,
        ICON: <NextStepIcon />,
        TYPE: STEP_TYPE.USER_STEP,
        RIGHT_ARROW: 'exists',
    },
    {
        ID: FLOW_DROPDOWN_COMPONENT_ID.END,
        TITLE: FLOW_DROPDOWN_STRINGS.END,
        TYPE: STEP_TYPE.END_FLOW,
        ICON: <EndIcon />,
    },
    {
        ID: FLOW_DROPDOWN_COMPONENT_ID.LINK_STEP,
        TITLE: FLOW_DROPDOWN_STRINGS.LINK_STEP,
        TYPE: STEP_TYPE.LINK_STEP,
        ICON: <LinkExistingIcon />,
        RIGHT_ARROW: 'exists',
    },
    {
        ID: FLOW_DROPDOWN_COMPONENT_ID.OTHERS,
        TITLE: FLOW_DROPDOWN_STRINGS.OTHERS,
        TYPE: STEP_TYPE.OTHERS,
        ICON: <LinkExistingIcon />,
        RIGHT_ARROW: 'exists',
    },
    {
        ID: FLOW_DROPDOWN_COMPONENT_ID.PARALLEL_HEADER,
        TITLE: FLOW_DROPDOWN_STRINGS.PARALLEL,
    },
    {
        ID: FLOW_DROPDOWN_COMPONENT_ID.PARALLEL_STEP,
        TITLE: FLOW_DROPDOWN_STRINGS.PARALLEL_STEP,
        ICON: <BranchParallelIcon />,
        TYPE: STEP_TYPE.PARALLEL_STEP,
    },
    {
        ID: FLOW_DROPDOWN_COMPONENT_ID.JOIN_STEP,
        TITLE: FLOW_DROPDOWN_STRINGS.JOIN_STEP,
        ICON: <JoinParallelIcon />,
        TYPE: STEP_TYPE.JOIN_STEP,
    },
];

export const OTHER_OPTIONS_LIST = [
    {
        ID: FLOW_DROPDOWN_COMPONENT_ID.TRIGGER_FLOW,
        TITLE: FLOW_DROPDOWN_STRINGS.TRIGGER_FLOW,
        ICON: <TriggerIcon className={styles.TriggerIcon} />,
        TYPE: STEP_TYPE.FLOW_TRIGGER,
    },
    {
        ID: FLOW_DROPDOWN_COMPONENT_ID.INTEGRATION,
        TITLE: FLOW_DROPDOWN_STRINGS.INTEGRATION,
        ICON: <IntegrationIcon />,
        TYPE: STEP_TYPE.INTEGRATION,
    },
    {
        ID: FLOW_DROPDOWN_COMPONENT_ID.ML_MODEL,
        TITLE: FLOW_DROPDOWN_STRINGS.ML_MODEL,
        ICON: <MLModelIcon />,
        TYPE: STEP_TYPE.ML_MODELS,
    },
];
