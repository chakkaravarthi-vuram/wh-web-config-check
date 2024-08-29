import React from 'react';
import cx from 'classnames/bind';
import { connect } from 'react-redux';
import { set, cloneDeep, get, unset, isEmpty } from 'utils/jsUtility';
import { integrationDataChange } from 'redux/reducer/IntegrationReducer';
import { InputTreeLayout } from '@workhall-pvt-lmt/wh-ui-library';
import { useTranslation } from 'react-i18next';
import {
  WORKHALL_API_STRINGS,
} from '../../../../../Integration.strings';
import RowComponent from './RowComponent';
import { initialRowData } from './RequestBody.utils';
import { getDefaultKeyLabels, INTEGRATION_STRINGS } from '../../../../../Integration.utils';
import { BS } from '../../../../../../../utils/UIConstants';
import { ALLOWED_INTEGRATION_VALUES, BODY_ROW_ID, REQ_BODY_NESTED_LEVEL, WH_API_METHODS } from '../../../../../Integration.constants';
import PlusIcon from '../../../../../../../assets/icons/PlusIcon';
import styles from './RequestBody.module.scss';
import { FIELD_LIST_TYPE, FIELD_TYPE } from '../../../../../../../utils/constants/form.constant';
import { getCurrentSystemFields, getTypeKeysForFields } from '../../../WorkhallApi.utils';

function RequestBody(props) {
  const {
    allFields,
    integrationDataChange,
    displayBody,
    body,
    isEditView,
    bodyError,
    hideRootAdd,
    maxDepth = REQ_BODY_NESTED_LEVEL.MAX_DEPTH,
    workhall_api_method,
    reqBodyFieldDetails = [],
    isReadOnlyResponse,
  } = props;

  const { REQUEST_RESPONSE } = WORKHALL_API_STRINGS;
  const { ADD_EVENT } = INTEGRATION_STRINGS;
  const { t } = useTranslation();

  const systemFields = getCurrentSystemFields(workhall_api_method, true);

  const handleFieldChangeHandler = (e, path, id) => {
    const clonedRequestBody = cloneDeep(body);
    const clonedReqBodyFieldDetails = cloneDeep(reqBodyFieldDetails);
    const errorPath = `${path},${id}`;
    const clonedErrorList = cloneDeep(bodyError) || [];
    delete clonedErrorList[errorPath];
    // as the implemention is added to get the table uuid from table columns, removed table fields here
    const filteredFields = allFields?.filter((field) => field?.field_type !== FIELD_TYPE.TABLE);
    const selectedDataField = filteredFields?.find(
      (field) =>
        field.field_uuid === e.target.value ||
        field.table_uuid === e.target.value,
    );

    const selectedSystemField = systemFields?.find((field) => field.value === e.target.value);

    const selectedField = isEmpty(selectedDataField) ? selectedSystemField : selectedDataField;
    const selectedFieldIndex = clonedReqBodyFieldDetails.findIndex(({ path: fieldPath }) => (fieldPath === path));
    if (selectedFieldIndex > -1) {
      clonedReqBodyFieldDetails.splice(selectedFieldIndex, 1);
    }
    clonedReqBodyFieldDetails.push({
      path,
      field_uuid: e.target.value,
    });
    path = (path || []).split(',');
    set(clonedRequestBody, [...path, BODY_ROW_ID.FIELD_DETAILS], selectedField);
    if (selectedField?.table_uuid === e.target.value) {
      set(clonedRequestBody, [...path, id], e.target.value);
      set(clonedRequestBody, [...path, BODY_ROW_ID.IS_TABLE], true);
      set(clonedRequestBody, [...path, BODY_ROW_ID.FIELD_TYPE_KEY], FIELD_LIST_TYPE.TABLE);
      set(clonedRequestBody, [...path, BODY_ROW_ID.KEY_TYPE], ALLOWED_INTEGRATION_VALUES.OBJECT);
      set(clonedRequestBody, [...path, BODY_ROW_ID.IS_MULTIPLE], true);
    } else {
      unset(clonedRequestBody, [...path, REQUEST_RESPONSE.COLUMN_MAPPING]);
      set(clonedRequestBody, [...path, BODY_ROW_ID.IS_TABLE], false);
      set(clonedRequestBody, [...path, BODY_ROW_ID.FIELD_TYPE_KEY], selectedField?.field_type);
      const additionalInfo = getTypeKeysForFields(selectedField);
      set(clonedRequestBody, [...path, BODY_ROW_ID.KEY_TYPE], additionalInfo.keyType);
      set(clonedRequestBody, [...path, BODY_ROW_ID.IS_MULTIPLE], additionalInfo.is_multiple);
      if (additionalInfo.keyType === ALLOWED_INTEGRATION_VALUES.OBJECT) {
        set(clonedRequestBody, [...path, BODY_ROW_ID.COLUMN_MAPPING_SAMPLE], additionalInfo?.[BODY_ROW_ID.COLUMN_MAPPING_SAMPLE]);
      }
      if (selectedField?.system_field_type) {
        unset(clonedRequestBody, [...path, BODY_ROW_ID.IS_TABLE]);
        unset(clonedRequestBody, [...path, BODY_ROW_ID.DATA_FIELD]);
        set(clonedRequestBody, [...path, BODY_ROW_ID.SYSTEM_FIELD], e.target.value);
        set(clonedRequestBody, [...path, BODY_ROW_ID.VALUE_TYPE_KEY], REQUEST_RESPONSE.VALUE_TYPES.SYSTEM);
      } else {
        if (path?.includes(REQUEST_RESPONSE.COLUMN_MAPPING)) {
          unset(clonedRequestBody, [...path, BODY_ROW_ID.IS_TABLE]);
        }
        unset(clonedRequestBody, [...path, BODY_ROW_ID.SYSTEM_FIELD]);
        set(clonedRequestBody, [...path, BODY_ROW_ID.VALUE_TYPE_KEY], REQUEST_RESPONSE.VALUE_TYPES.DYNAMIC);
        set(clonedRequestBody, [...path, id], e.target.value);
      }
    }

    integrationDataChange({
      body: clonedRequestBody,
      bodyError: clonedErrorList,
      reqBodyFieldDetails: clonedReqBodyFieldDetails,
    });
  };

  const handleOnChangeHandler = (event, path, isDuplicateKeyError = false, duplicateKeyRow = {}) => {
    const clonedRequestBody = cloneDeep(body);
    const errorPath = `${path},${event.target.id}`;
    const clonedErrorList = cloneDeep(bodyError) || [];
    delete clonedErrorList[errorPath];
    path = (path || []).split(',');
    set(clonedRequestBody, [...path, event.target.id], event.target.value);
    if (isDuplicateKeyError) {
      delete clonedErrorList[duplicateKeyRow?.path];
    }
    integrationDataChange({
      body: clonedRequestBody,
      bodyError: clonedErrorList,
    });
  };

  const handleAddMoreObjects = (path) => {
    if (path.includes('initial')) {
      path = path.split(',');
      path.splice(0, 2);
      path = path.join(',');
    }

    if (workhall_api_method === WH_API_METHODS.PUT) {
      path = path.split(',');

      if (path?.length === 1) {
        path = String(Number(path) - 1);
      } else {
        path = path.join(',');
      }
    }

    const clonedRequestBody = cloneDeep(body) || [];

    const clonedRow = cloneDeep(initialRowData);
    clonedRow.path = path;
    const currentPath = (path || []).split(',');
    set(clonedRequestBody, currentPath, clonedRow);

    integrationDataChange({
      body: clonedRequestBody,
      bodyError: {},
    });
  };

  const handleRowDelete = (path, isDuplicateKeyError, duplicateKeyRow = {}) => {
    const clonedRequestBody = cloneDeep(body);
    path = (path || []).split(',');
    const clonedErrorList = cloneDeep(bodyError) || [];
    const clonedReqBodyFieldDetails = cloneDeep(reqBodyFieldDetails);
    const rowTobeDeleted = get(clonedRequestBody, path, {});
    delete rowTobeDeleted?.[BODY_ROW_ID.COLUMN_MAPPING];
    const actualReqBodyFieldDetails = [];
    clonedReqBodyFieldDetails.forEach((field) => {
      if (!field?.path?.includes(path)) {
        actualReqBodyFieldDetails.push(field);
      }
    });

    const removedList = set(clonedRequestBody, path, {
      ...rowTobeDeleted,
      is_deleted: true,
    });
    if (isDuplicateKeyError) {
      delete clonedErrorList[duplicateKeyRow?.path];
    }
    Object.keys(clonedErrorList).forEach((errorKey) => {
      if (errorKey.includes(path)) delete clonedErrorList[errorKey];
    });
    integrationDataChange({
      body: removedList,
      bodyError: clonedErrorList,
      reqBodyFieldDetails: actualReqBodyFieldDetails,
    });
  };

  const onChangeHandlers = ({ event, type, path, isDuplicateKeyError, duplicateKeyRow }) => {
    switch (type) {
      case REQUEST_RESPONSE.BODY_FIELDS.FIELD.ID:
        return handleFieldChangeHandler(event, path, type);
      case REQUEST_RESPONSE.BODY_FIELDS.KEY.ID:
        return handleOnChangeHandler(event, path, isDuplicateKeyError, duplicateKeyRow);
      case ADD_EVENT.REQUEST_BODY.DELETE.ID:
        return handleRowDelete(path, isDuplicateKeyError, duplicateKeyRow);
      case ADD_EVENT.REQUEST_BODY.ADD_MORE_CHILD.ID:
        return handleAddMoreObjects(path);
      default:
        break;
    }
    return null;
  };

  let tblHeaders = [];
  let tblHeaderStyles = [];

  if (isReadOnlyResponse) {
    tblHeaders = REQUEST_RESPONSE.READ_ONLY_HEADERS;
    tblHeaderStyles = [styles.ReadOnlyFieldColumn];
  } else if (!isEditView) {
    tblHeaders = REQUEST_RESPONSE.BODY_HEADERS;
    tblHeaderStyles = [styles.FieldColumn, styles.KeyColumn, styles.TypeColumn, styles.RequiredColumn, styles.IsMultipleColumn];
  } else {
    tblHeaders = REQUEST_RESPONSE.EDIT_BODY_HEADERS;
    tblHeaderStyles = [styles.FieldColumn, styles.KeyColumn, styles.TypeColumn, styles.RequiredColumn, styles.IsMultipleColumn, styles.DeleteColumn];
  }

  return (
    <InputTreeLayout
      tableHeaders={tblHeaders}
      headerStyles={tblHeaderStyles}
      data={displayBody}
      // showAddMore={isEditView}
      depth={REQ_BODY_NESTED_LEVEL.INIT_DEPTH}
      maxDepth={maxDepth}
      AddMoreIcon={() =>
        <PlusIcon className={cx(styles.Icon, BS.MY_AUTO)} />}
      // colorScheme={colorScheme}
      parentDetails={{}}
      onChangeHandlers={onChangeHandlers}
      RowComponent={RowComponent}
      errorList={bodyError}
      keyLabels={getDefaultKeyLabels(t, BODY_ROW_ID.COLUMN_MAPPING, BODY_ROW_ID.FIELD_TYPE_KEY)}
      readOnlyView={!isEditView}
      hideRootAdd={hideRootAdd}
      duplicateRowErrorClassName={styles.DuplicateRowError}
    />
  );
}

const mapStateToProps = ({ IntegrationReducer }) => {
  return {
    allFields: IntegrationReducer.allFields,
    workhall_api_method: IntegrationReducer.workhall_api_method,
    reqBodyFieldDetails: IntegrationReducer.reqBodyFieldDetails,
  };
};

const mapDispatchToProps = {
  integrationDataChange,
};

export default connect(mapStateToProps, mapDispatchToProps)(RequestBody);
