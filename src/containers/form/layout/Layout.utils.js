import { isEmpty } from 'lodash';
import { GET_COLUMN_LAYOUT_TEMPLATE, GET_ROW_LAYOUT_TEMPLATE, LAYOUT_INITAIL_ORDER } from './Layout.constant';
import { RESPONSE_FIELD_KEYS } from '../../../utils/constants/form/form.constant';

export const getNewRowWithColumns = (requiredColumnCount) => {
    const rowLayout = GET_ROW_LAYOUT_TEMPLATE();
    rowLayout.children = [];
    for (let columnOrder = LAYOUT_INITAIL_ORDER; columnOrder <= requiredColumnCount; columnOrder++) {
        rowLayout.children.push(GET_COLUMN_LAYOUT_TEMPLATE(rowLayout.uuid, columnOrder));
    }
    return rowLayout;
};

export const isTableVisibleBasedOnDisable = (visibleDisableField = {}, visibleFields = {}, visibleTable = {}, fieldData = {}) => {
   const tableUUID = fieldData?.[RESPONSE_FIELD_KEYS.FIELD_UUID];
   if (!visibleTable?.[tableUUID]) {
    const tableDisableObject = visibleDisableField?.[tableUUID] || [];
    const columns = fieldData?.columns || [];
    const allColumnKey = columns.map((eachColumn) => eachColumn?.[RESPONSE_FIELD_KEYS.FIELD_UUID]);

    // Visible Field
    const isVisibleFields = allColumnKey.some((eachColumnKey) => visibleFields?.[eachColumnKey]);

    // Visibile Disable Field -  Direct Column
    const isVisibleDisableColumns = allColumnKey.some((eachColumnKey) => visibleDisableField?.[eachColumnKey]);

    // Visible Disable Field - Entire Table
    const isVisibleDisableTable = isEmpty(tableDisableObject) ? false : (
        tableDisableObject.some((eachRow) => Object.values(eachRow).some((eachValue) => eachValue)));

    return isVisibleFields || isVisibleDisableColumns || isVisibleDisableTable;
   }
   return visibleTable?.[tableUUID];
};

export const isEntireTableDisabled = (visibleDisableField = {}, visibleField = {}, fieldData = {}) => {
    const columns = fieldData?.columns || [];
    const allColumnKey = columns.map((eachColumn) => eachColumn?.[RESPONSE_FIELD_KEYS.FIELD_UUID]);
    const isTableDisable = allColumnKey.every((eachColumnKey) => visibleField?.[eachColumnKey] ? false : visibleDisableField?.[eachColumnKey]);
    return isTableDisable;
};
