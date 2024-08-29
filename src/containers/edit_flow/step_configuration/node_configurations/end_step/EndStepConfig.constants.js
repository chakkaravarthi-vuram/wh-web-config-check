import { EButtonType } from '@workhall-pvt-lmt/wh-ui-library';
import {
  CANCEL_LABEL,
  CANCELLED_LABEL,
  COMPLETED_LABEL,
  EMPTY_STRING,
  SAVE_LABEL,
} from '../../../../../utils/strings/CommonStrings';
import { NODE_CONFIG_TABS } from '../../../node_configuration/NodeConfiguration.constants';
import { STEP_TYPE } from '../../../../../utils/Constants';
import { translateFunction } from '../../../../../utils/jsUtility';

export const TERMINATE_FLOW_TYPE = {
  CANCEL: 1,
  COMPLETE: 2,
};

export const RESPONSE_FIELD_KEYS = {
  ID: 'stepId',
  STEP_UUID: 'stepUuid',
  FLOW_ID: 'flowId',
  STEP_NAME: 'stepName',
  STEP_TYPE: 'stepType',
  STEP_STATUS: 'stepStatus',
  STEP_ORDER: 'stepOrder',
  TERMINATE_FLOW: 'terminateFlow',
  COORDINATE_INFO: 'coordinateInfo',
  STEP_COORDINATES: 'stepCoordinates',
  COORDINATE_INFO_X: 'x',
  COORDINATE_INFO_Y: 'y',
  TERMINATE_TYPE: 'terminateType',
};

export const REQUEST_FIELD_KEYS = {
  SYSTEM_END: 'system_end',
  ID: '_id', // step ID
  STEP_UUID: 'step_uuid',
  FLOW_ID: 'flow_id',
  STEP_NAME: 'step_name',
  STEP_TYPE: 'step_type',
  STEP_STATUS: 'step_status',
  STEP_ORDER: 'step_order',
  TERMINATE_FLOW: 'terminate_flow',
  COORDINATE_INFO: 'coordinate_info',
  STEP_COORDINATES: 'step_coordinates',
  COORDINATE_INFO_X: 'x',
  COORDINATE_INFO_Y: 'y',
  TERMINATE_TYPE: 'terminate_type',
};

export const STEP_STATUS = {
  DEFAULT_STATUS_VALUE: 'In Progress or Completed',
};

export const END_STEP_INITIAL_STATE = {
flowId: null,
stepUuid: null,
_id: null,
stepName: null,
terminateFlow: false,
terminateType: TERMINATE_FLOW_TYPE.COMPLETE,
coordinateInfo: {
    stepCoordinates: {
        x: 0,
        y: 0,
    },
},
stepType: STEP_TYPE.END_FLOW,
stepStatus: STEP_STATUS.DEFAULT_STATUS_VALUE,
isLoadingNodeDetails: true,
isErrorInLoadingNodeDetails: false,
};

export const ENDSTEP_RADIO_OPTIONS = (t) => [
  {
    label: t(COMPLETED_LABEL),
    value: TERMINATE_FLOW_TYPE.COMPLETE,
  },
  {
    label: t(CANCELLED_LABEL),
    value: TERMINATE_FLOW_TYPE.CANCEL,
  },
];
export const ENDSTEP_CONFIG_TAB = (t) => [
  {
    labelText: t('end_step_configuration_strings.end_config_tab.general'),
    value: NODE_CONFIG_TABS.GENERAL,
    tabIndex: NODE_CONFIG_TABS.GENERAL,
  },
  {
    labelText: t(
      'end_step_configuration_strings.end_config_tab.additional_configuration',
    ),
    value: NODE_CONFIG_TABS.ADDITIONAL,
    tabIndex: NODE_CONFIG_TABS.ADDITIONAL,
  },
];

export const ENDSTEP_CONFIG_STRINGS = (t) => {
  return {
    END_STEP: t('end_step_configuration_strings.end_step'),
    DELETE_STEP: t('end_step_configuration_strings.delete_step'),
    GENERAL_TAB_CONTENT: {
      TITLE_CONTENT: t(
        'end_step_configuration_strings.general_tab_content.title_content',
      ),
      RADIO_GROUP_LABEL: t(
        'end_step_configuration_strings.general_tab_content.radio_group_label',
      ),
    },
    ADDITIONl_CONFIG_CONTENT: {
      TITLE_CONTENT: t(
        'end_step_configuration_strings.additional_config_content.title_content',
      ),
      DROPDOWN_LABEL: t(
        'end_step_configuration_strings.additional_config_content.dropdown_label',
      ),
      DROPDOWN_INSTRUCTION: t(
        'end_step_configuration_strings.additional_config_content.dropdown_instruction',
      ),
    },
  };
};
export const CONFIG_BUTTON_ARRAY = (onSaveClickHandler, onCloseClickHandler, t = translateFunction) => [
    {
        buttonText: t(CANCEL_LABEL),
        buttonType: EButtonType.TERTIARY,
        buttonClassName: EMPTY_STRING,
        onButtonClick: onCloseClickHandler,
    }, {
        buttonText: t(SAVE_LABEL),
        onButtonClick: onSaveClickHandler,
        buttonType: EButtonType.PRIMARY,
        buttonClassName: EMPTY_STRING,
    },
];
