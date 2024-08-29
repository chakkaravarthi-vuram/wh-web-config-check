import { v4 as uuidV4 } from 'uuid';
import { FORM_LAYOUT_TYPE } from '../Form.string';

export const LAYOUT_INITAIL_ORDER = 1;

export const GET_ROW_LAYOUT_TEMPLATE = (parentUUID) => {
    return {
        node_uuid: uuidV4(),
        type: FORM_LAYOUT_TYPE.ROW,
        parent_node_uuid: parentUUID,
        children: [],
    };
};

export const GET_COLUMN_LAYOUT_TEMPLATE = (parentUUID, order) => {
    return {
        order: order,
        node_uuid: uuidV4(),
        parent_node_uuid: parentUUID,
        type: FORM_LAYOUT_TYPE.COLUMN,
        children: [],
        width: 1,
    };
};

export const GET_FIELD_LAYOUT_TEMPLATE = (parentUUID, order, type, nodeUUID = null) => {
    return {
        order: order,
        node_uuid: nodeUUID || uuidV4(),
        parent_node_uuid: parentUUID,
        type: type,
        children: [],
    };
};

export const GET_BOX_LAYOUT_TEMPLATE = (parentUUID, order, options = {}) => {
    return {
        node_uuid: uuidV4(),
        order: order,
        ...options,
        type: FORM_LAYOUT_TYPE.BOX,
        parent_node_uuid: parentUUID,
        children: [],
    };
};
