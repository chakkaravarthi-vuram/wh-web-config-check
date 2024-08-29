import { STEP_TYPE } from '../../utils/Constants';

export const STEP_CONFIG_PROGRESS = {
    STEP_DETAILS_AND_ACTORS: 1,
    DESIGN_FORM: 2,
    ADDITIONAL_CONFIG: 3,
};

export const INITIAL_STEP_COORDINATES = {
    step_coordinates: {
        x: 0,
        y: 0,
    },
};

export const CREATE_STEP_INIT_DATA = {
    coordinate_info: INITIAL_STEP_COORDINATES,
    step_type: STEP_TYPE.USER_STEP,
};

export const FLOW_PROMPT_STEP_CREATION_STATUS = {
    CREATE_STEP: 1,
    SAVE_STEP: 2,
    SAVE_FORM: 3,
};

export const FLOW_PROMPT_CREATION_TIMEOUT = 240000;

export const DEFAULT_STEP_STATUS = 'In Progress';

export const DEFAULT_END_STEP_STATUS = 'In Progress or Completed';

export const JOIN_STEP_CONDITIONS = {
    ALL: 'all_flows',
    ANY: 'atleast_n_flows',
};

export const MODAL_ATTRIBUTES = {
    MODAL_ID: 'edit_flow_basic_details',
};

export const DUE_DATE_VALUE_TYPE = {
    HOURS: 'hours',
    DAYS: 'days',
};

export const NAME_VALIDATION_ALLOWED_CHARACTERS = "& () / . ' : , _ - @ \" . # $";
