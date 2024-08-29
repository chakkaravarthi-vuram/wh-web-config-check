import React from 'react';
import { StepIconAndColor } from '@workhall-pvt-lmt/wh-ui-library';
import { STEP_TYPE } from '../../../../../utils/Constants';
import ChevronRight from '../../../../../assets/icons/ChevronRight';

export const FLOW_NODE_IDS_TYPES = {
  ADD_NEW_STEPS: 'add_new_steps',
  USER_STEP: 'user_step',
  SYSTEM_STEP: 'system_steps',
  INTEGRATION_ML: 'integration_ml',
  FLOW_ROUTING_STEPS: 'routing_steps',
  END_STEP: 'end_step',
};

export const FLOW_NODE_TITLES = (t) => {
  return {
    ADD_NEW_STEPS: t('flow_drop_down_node_strings.common_popper_strings.add_new_steps'),
    USER_STEP: t('flow_drop_down_node_strings.common_popper_strings.user_step'),
    SYSTEM_STEP: t('flow_drop_down_node_strings.common_popper_strings.system_step'),
    INTEGRATION_ML: t('flow_drop_down_node_strings.common_popper_strings.integration_ml'),
    FLOW_ROUTING_STEPS: t('flow_drop_down_node_strings.common_popper_strings.flow_routing_steps'),
    END_STEP: t('flow_drop_down_node_strings.common_popper_strings.end_step'),
  };
};

export const FLOW_NODE_DROPDOWN_LIST = (t) => [
  {
    ID: FLOW_NODE_IDS_TYPES.ADD_NEW_STEPS,
    TITLE: FLOW_NODE_TITLES(t).ADD_NEW_STEPS,
  },
  {
    ID: FLOW_NODE_IDS_TYPES.USER_STEP,
    TITLE: FLOW_NODE_TITLES(t).USER_STEP,
    ICON: StepIconAndColor[STEP_TYPE.USER_STEP].icon,
    COLOR: StepIconAndColor[STEP_TYPE.USER_STEP].color,
    TYPE: STEP_TYPE.USER_STEP,
  },
  {
    ID: FLOW_NODE_IDS_TYPES.SYSTEM_STEP,
    TITLE: FLOW_NODE_TITLES(t).SYSTEM_STEP,
    ICON: StepIconAndColor[FLOW_NODE_IDS_TYPES.SYSTEM_STEP].icon,
    COLOR: StepIconAndColor[FLOW_NODE_IDS_TYPES.SYSTEM_STEP].color,
    RIGHT_ARROW: <ChevronRight />,
    TYPE: 'system_steps',
  },
  {
    ID: FLOW_NODE_IDS_TYPES.INTEGRATION_ML,
    TITLE: FLOW_NODE_TITLES(t).INTEGRATION_ML,
    RIGHT_ARROW: <ChevronRight />,
    ICON: StepIconAndColor[STEP_TYPE.INTEGRATION].icon,
    COLOR: StepIconAndColor[STEP_TYPE.INTEGRATION].color,
    TYPE: FLOW_NODE_IDS_TYPES.INTEGRATION_ML,
  },
  {
    ID: FLOW_NODE_IDS_TYPES.FLOW_ROUTING_STEPS,
    TITLE: FLOW_NODE_TITLES(t).FLOW_ROUTING_STEPS,
    RIGHT_ARROW: <ChevronRight />,
    ICON: StepIconAndColor[FLOW_NODE_IDS_TYPES.FLOW_ROUTING_STEPS].icon,
    COLOR: StepIconAndColor[FLOW_NODE_IDS_TYPES.FLOW_ROUTING_STEPS].color,
    TYPE: FLOW_NODE_IDS_TYPES.FLOW_ROUTING_STEPS,
  },
  {
    ID: FLOW_NODE_IDS_TYPES.END_STEP,
    TITLE: FLOW_NODE_TITLES(t).END_STEP,
    ICON: StepIconAndColor[STEP_TYPE.END_FLOW].icon,
    COLOR: StepIconAndColor[STEP_TYPE.END_FLOW].color,
    TYPE: STEP_TYPE.END_FLOW,
  },
];
const INTEGRATION_IDS_TYPES = {
  INTEGRATION: 'integration',
  ML_INTEGRATION: 'ml_integration',
};

const INTEGRATION_TITLES = (t) => {
  return {
    INTEGRATION: t('flow_drop_down_node_strings.integration_title.integration'),
    ML_INTEGRATION: t('flow_drop_down_node_strings.integration_title.ml_integration'),
  };
};

export const INTEGRATION_OPTIONS_LIST = (t) => [
  {
    ID: INTEGRATION_IDS_TYPES.INTEGRATION,
    TITLE: INTEGRATION_TITLES(t).INTEGRATION,
    ICON: StepIconAndColor[STEP_TYPE.INTEGRATION].icon,
    COLOR: StepIconAndColor[STEP_TYPE.INTEGRATION].color,
    TYPE: STEP_TYPE.INTEGRATION,
  },
  {
    ID: INTEGRATION_IDS_TYPES.ML_INTEGRATION,
    TITLE: INTEGRATION_TITLES(t).ML_INTEGRATION,
    ICON: StepIconAndColor[STEP_TYPE.ML_MODELS].icon,
    COLOR: StepIconAndColor[STEP_TYPE.ML_MODELS].color,
    TYPE: STEP_TYPE.ML_MODELS,
  },
];

export const FLOW_ROUTING_IDS_TYPES = {
  CONDITION_BASED_ROUTING_PATH: 'condition_based_routing_path',
  BRANCH_PARALLEL_PATHS: 'branch_prallel_paths',
  JOIN_PARALLEL_PATHS: 'join_parallel_paths',
};

export const FLOW_ROUTING_TITLES = (t) => {
  return {
    CONDITION_BASED_ROUTING: t('flow_drop_down_node_strings.flow_routing_steps_options.condition_based_routing'),
    BRANCH_PARALLEL_PATHS: t('flow_drop_down_node_strings.flow_routing_steps_options.branch_parallel_paths'),
    JOIN_PARALLEL_PATHS: t('flow_drop_down_node_strings.flow_routing_steps_options.join_parallel_paths'),
  };
};

export const FLOW_ROUTING_STEPS_OPTIONS_LIST = (t) => [
  {
    ID: FLOW_ROUTING_IDS_TYPES.CONDITION_BASED_ROUTING_PATH,
    TITLE: FLOW_ROUTING_TITLES(t).CONDITION_BASED_ROUTING,
    ICON: StepIconAndColor[STEP_TYPE.CONDITON_PATH_SELECTOR].icon,
    COLOR: StepIconAndColor[STEP_TYPE.CONDITON_PATH_SELECTOR].color,
    TYPE: STEP_TYPE.CONDITON_PATH_SELECTOR,
  },
  {
    ID: FLOW_ROUTING_IDS_TYPES.BRANCH_PARALLEL_PATHS,
    TITLE: FLOW_ROUTING_TITLES(t).BRANCH_PARALLEL_PATHS,
    ICON: StepIconAndColor[STEP_TYPE.PARALLEL_STEP].icon,
    COLOR: StepIconAndColor[STEP_TYPE.PARALLEL_STEP].color,
    TYPE: STEP_TYPE.PARALLEL_STEP,
  },
  {
    ID: FLOW_ROUTING_IDS_TYPES.JOIN_PARALLEL_PATHS,
    TITLE: FLOW_ROUTING_TITLES(t).JOIN_PARALLEL_PATHS,
    ICON: StepIconAndColor[STEP_TYPE.JOIN_STEP].icon,
    COLOR: StepIconAndColor[STEP_TYPE.JOIN_STEP].color,
    TYPE: STEP_TYPE.JOIN_STEP,
  },
];

export const SYSTEM_STEPS_IDS_TYPES = {
  UPDATE_DL: 'update_dl',
  SEND_EMAIL: 'send_email',
  CALL_ANOTHER_FLOW: 'call_another_flow',
  DOCUMENT_GENERATOR: 'document_generator',
  DATA_MANIPULATOR: 'data_manipulator',
  WAIT_STEP: 'wait',
};

export const SYSTEM_STEPS_TITLES = (t) => {
  return {
    UPDATE_DATALISTS: t('flow_drop_down_node_strings.system_step_titles.update_datalists'),
    SEND_EMAIL: t('flow_drop_down_node_strings.system_step_titles.send_email'),
    CALL_ANOTHER_FLOW: t('flow_drop_down_node_strings.system_step_titles.call_another_flow'),
    DOCUMENT_GENERATOR: t('flow_drop_down_node_strings.system_step_titles.document_generator'),
    DATA_MANIPULATOR: t('flow_drop_down_node_strings.system_step_titles.data_manipulator'),
    WAIT_STEP: t('flow_drop_down_node_strings.system_step_titles.wait_step'),
  };
};

export const SYSTEM_STEPS_OPTIONS_LIST = (t) => [
  {
    ID: SYSTEM_STEPS_IDS_TYPES.UPDATE_DL,
    TITLE: SYSTEM_STEPS_TITLES(t).UPDATE_DATALISTS,
    ICON: StepIconAndColor[STEP_TYPE.SEND_DATA_TO_DATALIST].icon,
    COLOR: StepIconAndColor[STEP_TYPE.SEND_DATA_TO_DATALIST].color,
    TYPE: STEP_TYPE.SEND_DATA_TO_DATALIST,
  },
  {
    ID: SYSTEM_STEPS_IDS_TYPES.SEND_EMAIL,
    TITLE: SYSTEM_STEPS_TITLES(t).SEND_EMAIL,
    ICON: StepIconAndColor[STEP_TYPE.EMAIL_CONFIGURATION].icon,
    COLOR: StepIconAndColor[STEP_TYPE.EMAIL_CONFIGURATION].color,
    TYPE: STEP_TYPE.EMAIL_CONFIGURATION,
  },
  {
    ID: SYSTEM_STEPS_IDS_TYPES.CALL_ANOTHER_FLOW,
    TITLE: SYSTEM_STEPS_TITLES(t).CALL_ANOTHER_FLOW,
    ICON: StepIconAndColor[STEP_TYPE.FLOW_TRIGGER].icon,
    COLOR: StepIconAndColor[STEP_TYPE.FLOW_TRIGGER].color,
    TYPE: STEP_TYPE.FLOW_TRIGGER,
  },
  {
    ID: SYSTEM_STEPS_IDS_TYPES.DOCUMENT_GENERATOR,
    TITLE: SYSTEM_STEPS_TITLES(t).DOCUMENT_GENERATOR,
    ICON: StepIconAndColor[STEP_TYPE.DOCUMENT_GENERATION].icon,
    COLOR: StepIconAndColor[STEP_TYPE.DOCUMENT_GENERATION].color,
    TYPE: STEP_TYPE.DOCUMENT_GENERATION,
  },
  {
    ID: SYSTEM_STEPS_IDS_TYPES.DATA_MANIPULATOR,
    TITLE: SYSTEM_STEPS_TITLES(t).DATA_MANIPULATOR,
    ICON: StepIconAndColor[STEP_TYPE.DATA_MANIPULATOR].icon,
    COLOR: StepIconAndColor[STEP_TYPE.DATA_MANIPULATOR].color,
    TYPE: STEP_TYPE.DATA_MANIPULATOR,
  },
  {
    ID: SYSTEM_STEPS_IDS_TYPES.WAIT_STEP,
    TITLE: SYSTEM_STEPS_TITLES(t).WAIT_STEP,
    ICON: StepIconAndColor[STEP_TYPE.WAIT_STEP].icon,
    COLOR: StepIconAndColor[STEP_TYPE.WAIT_STEP].color,
    TYPE: STEP_TYPE.WAIT_STEP,
  },
];

export const ADD_NEW_STEP_STRINGS = (t) => {
  return {
    USER_STEP_NAME: t('flow_drop_down_node_strings.add_new_step_strings.user_step_name'),
    STEP_NAME_PLACEHOLDER: t('flow_drop_down_node_strings.add_new_step_strings.step_name_placeholder'),
    ADD: t('flow_drop_down_node_strings.add_new_step_strings.add'),
    CANCEL: 'Cancel',
  };
};
