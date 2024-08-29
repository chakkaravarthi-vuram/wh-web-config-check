import React from 'react';
import { MarkerType } from 'reactflow';
import { NodeHandlerPosition } from '@workhall-pvt-lmt/wh-ui-library';
import ButtonEdge from './custom_edges/button_edge/ButtonEdge';
import DefaultNode from './custom_nodes/default/DefaultNode';
import { STEP_TYPE } from '../../../../utils/Constants';
import FlowPlusIcon from '../../../../assets/icons/flow_icons/flow_control_icons/FlowPlusIcon';
import FLowMinusIcon from '../../../../assets/icons/flow_icons/flow_control_icons/FlowMinusIcon';
import FitViewICon from '../../../../assets/icons/flow_icons/flow_control_icons/FitViewIcon';
import FlowNodeDropDown from './flow_node_dropdown/FlowNodeDropDown';
import UserStepConfig from './custom_nodes/default/UserStepConfigNode';

export const CUSTOM_NODE_LABELS = Object.freeze({
  FLOW_DROPDOWN: 'flow_dd',
  USER_STEP_CONFIG: 'user_step_config',
  [STEP_TYPE.START_STEP]: STEP_TYPE.START_STEP,
  [STEP_TYPE.INTEGRATION]: STEP_TYPE.INTEGRATION,
  [STEP_TYPE.ML_MODELS]: STEP_TYPE.ML_MODELS,
  [STEP_TYPE.DOCUMENT_GENERATION]: STEP_TYPE.DOCUMENT_GENERATION,
  [STEP_TYPE.EMAIL_CONFIGURATION]: STEP_TYPE.EMAIL_CONFIGURATION,
  [STEP_TYPE.SEND_DATA_TO_DATALIST]: STEP_TYPE.SEND_DATA_TO_DATALIST,
  [STEP_TYPE.USER_STEP]: STEP_TYPE.USER_STEP,
  [STEP_TYPE.CONDITON_PATH_SELECTOR]: STEP_TYPE.CONDITON_PATH_SELECTOR,
  [STEP_TYPE.JOIN_STEP]: STEP_TYPE.JOIN_STEP,
  [STEP_TYPE.END_FLOW]: STEP_TYPE.END_FLOW,
  [STEP_TYPE.FLOW_TRIGGER]: STEP_TYPE.FLOW_TRIGGER,
  [STEP_TYPE.PARALLEL_STEP]: STEP_TYPE.PARALLEL_STEP,
  [STEP_TYPE.DATA_MANIPULATOR]: STEP_TYPE.DATA_MANIPULATOR,
  [STEP_TYPE.WAIT_STEP]: STEP_TYPE.WAIT_STEP,
});

export const CUSTOM_EDGE_LABELS = Object.freeze({
  BUTTON_EDGE: 'buttonEdge',
});

export const EDGE_STYLES = Object.freeze({
  STRAIGHT: 'straight',
  STEP: 'step',
  CURVE: 'curve',
});

export const EDGES_OPTIONS = Object.freeze({
  markerEnd: {
    type: MarkerType.ArrowClosed,
    width: 15,
    height: 15,
  },
  type: EDGE_STYLES.STRAIGHT,
  interactionWidth: 30,
  // deleteable: true,
  focusable: true,
  style: {
    strokeWidth: 2,
  },
});

export const DEFAULT_NODE_OPTIONS = Object.freeze({
  // width: 300,
  // height: 300,
  selectable: false,
});

export const CUSTOM_NODE_DIMENSION = Object.freeze({
  [STEP_TYPE.START_STEP]: { width: 110, height: 100 },
  [STEP_TYPE.INTEGRATION]: { width: 210, height: 100 },
  [STEP_TYPE.ML_MODELS]: { width: 210, height: 100 },
  [STEP_TYPE.DOCUMENT_GENERATION]: { width: 210, height: 100 },
  [STEP_TYPE.EMAIL_CONFIGURATION]: { width: 210, height: 100 },
  [STEP_TYPE.SEND_DATA_TO_DATALIST]: { width: 210, height: 100 },
  [STEP_TYPE.USER_STEP]: { width: 255, height: 100 },
  [STEP_TYPE.CONDITON_PATH_SELECTOR]: { width: 55, height: 105 },
  [STEP_TYPE.JOIN_STEP]: { width: 55, height: 105 },
  [STEP_TYPE.END_FLOW]: { width: 110, height: 50 },
  [STEP_TYPE.FLOW_TRIGGER]: { width: 210, height: 100 },
  [STEP_TYPE.PARALLEL_STEP]: { width: 55, height: 105 },
  [STEP_TYPE.DATA_MANIPULATOR]: { width: 210, height: 100 },
  [STEP_TYPE.WAIT_STEP]: { width: 55, height: 105 },
  [CUSTOM_NODE_LABELS.USER_STEP_CONFIG]: { width: 270, height: 155 },
});

export const BUTTON_EDGE_OPTIONS = Object.freeze({
  ...EDGES_OPTIONS,
  type: CUSTOM_EDGE_LABELS.BUTTON_EDGE,
  // className: styles.ButtonEdge,
});

export const CUSTOM_EDGES = {
  [CUSTOM_EDGE_LABELS.BUTTON_EDGE]: ButtonEdge,
};

export const CUSTOM_NODES = {
  [CUSTOM_NODE_LABELS.FLOW_DROPDOWN]: FlowNodeDropDown,
  [CUSTOM_NODE_LABELS.USER_STEP_CONFIG]: UserStepConfig,
  [STEP_TYPE.START_STEP]: DefaultNode,
  [STEP_TYPE.INTEGRATION]: DefaultNode,
  [STEP_TYPE.ML_MODELS]: DefaultNode,
  [STEP_TYPE.DOCUMENT_GENERATION]: DefaultNode,
  [STEP_TYPE.EMAIL_CONFIGURATION]: DefaultNode,
  [STEP_TYPE.SEND_DATA_TO_DATALIST]: DefaultNode,
  [STEP_TYPE.USER_STEP]: DefaultNode,
  [STEP_TYPE.CONDITON_PATH_SELECTOR]: DefaultNode,
  [STEP_TYPE.JOIN_STEP]: DefaultNode,
  [STEP_TYPE.END_FLOW]: DefaultNode,
  [STEP_TYPE.FLOW_TRIGGER]: DefaultNode,
  [STEP_TYPE.PARALLEL_STEP]: DefaultNode,
  [STEP_TYPE.DATA_MANIPULATOR]: DefaultNode,
  [STEP_TYPE.WAIT_STEP]: DefaultNode,
};

export const CUSTOM_COMPONENTS_ID = {
  DROPDOWN: 'flow_dropdown',
  SUBMENU_DROPDOWN: 'submenu_dropdown',
  SUBMENU_INPUT: 'submenu_input',
};

export const REACT_FLOW_EXTEND_MINIMUM = {
  TOP: -50,
  LEFT: -100,
};

export const REACT_FLOW_TRANSLATE_EXTEND = [[REACT_FLOW_EXTEND_MINIMUM.LEFT, REACT_FLOW_EXTEND_MINIMUM.TOP], [Infinity, Infinity]];

export const STEP_PANEL_LIST = [
  STEP_TYPE.USER_STEP,
  STEP_TYPE.SEND_DATA_TO_DATALIST,
  STEP_TYPE.EMAIL_CONFIGURATION,
  STEP_TYPE.FLOW_TRIGGER,
  STEP_TYPE.DOCUMENT_GENERATION,
  STEP_TYPE.DATA_MANIPULATOR,
  STEP_TYPE.INTEGRATION,
  STEP_TYPE.ML_MODELS,
  STEP_TYPE.CONDITON_PATH_SELECTOR,
  STEP_TYPE.PARALLEL_STEP,
  STEP_TYPE.JOIN_STEP,
  STEP_TYPE.WAIT_STEP,
  STEP_TYPE.END_FLOW,
];

export const CONTROL_PANELS_ID = {
  ZOOM_IN: 'zoom_in',
  ZOOM_OUT: 'zoom_out',
  FIT_VIEW: 'fit_view',
};

export const FLOW_CONTROL_PANELS = [
  {
    ID: CONTROL_PANELS_ID.ZOOM_IN,
    TITLE: 'Zoom In',
    ICON: <FlowPlusIcon />,
  },
  {
    ID: CONTROL_PANELS_ID.ZOOM_OUT,
    TITLE: 'Zoom Out',
    ICON: <FLowMinusIcon />,
  },
  {
    ID: CONTROL_PANELS_ID.FIT_VIEW,
    TITLE: 'Fit View',
    ICON: <FitViewICon />,
  },
];

export const ROUTING_NODES = [
  STEP_TYPE.CONDITON_PATH_SELECTOR,
  STEP_TYPE.WAIT_STEP,
  STEP_TYPE.JOIN_STEP,
  STEP_TYPE.PARALLEL_STEP,
];

export const MULTI_OUTPUT_NODES = [
  STEP_TYPE.USER_STEP,
  STEP_TYPE.PARALLEL_STEP,
  STEP_TYPE.CONDITON_PATH_SELECTOR,
];

export const CONNECTOR_LINE_TYPE = {
  NORMAL: 1,
  EXCEPTION: 2,
};

export const CONNECTOR_LINE_INIT_DATA = {
  source_point: NodeHandlerPosition.BOTTOM,
  destination_point: NodeHandlerPosition.TOP,
  style: EDGE_STYLES.STEP,
  type: CONNECTOR_LINE_TYPE.NORMAL,
};
