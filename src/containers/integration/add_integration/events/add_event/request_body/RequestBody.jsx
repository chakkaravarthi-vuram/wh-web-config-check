import React, { useContext } from 'react';
import cx from 'classnames/bind';
import { connect, useSelector } from 'react-redux';
import gClasses from 'scss/Typography.module.scss';
import {
  INTEGRATION_STRINGS,
  REQ_BODY_KEY_TYPES,
} from 'containers/integration/Integration.utils';
import { BS } from 'utils/UIConstants';
import { useTranslation } from 'react-i18next';
import { integrationDataChange } from 'redux/reducer/IntegrationReducer';
import { cloneDeep, set, get, has, isEmpty, unset } from 'utils/jsUtility';
import { keydownOrKeypessEnterHandle } from 'utils/UtilityFunctions';
import { v4 as uuidv4 } from 'uuid';
import { FEATURE_INTEGRATION_STRINGS } from 'containers/integration/Integration.strings';
import { SingleDropdown, TextInput, ECheckboxSize, RadioGroupLayout, Checkbox, InputTreeLayout, Text, ETextSize } from '@workhall-pvt-lmt/wh-ui-library';
import { generateEventTargetObject } from 'utils/generatorUtils';
import { INTEGRATION_CONSTANTS, REQ_BODY_NESTED_LEVEL } from '../../../../Integration.constants';
import styles from './RequestBody.module.scss';
import { initialRowData } from './RequestBody.utils';
import Trash from '../../../../../../assets/icons/application/Trash';
import ThemeContext from '../../../../../../hoc/ThemeContext';
import PlusIcon from '../../../../../../assets/icons/PlusIcon';
import { getDefaultKeyLabels } from '../../../../Integration.utils';

export function RowComponent({
  currentRow = {},
  onChangeHandlers,
  path,
  errorList = {},
  depth = 0,
  readOnlyView = false,
  isDuplicateKeyError = false,
  duplicateKeyRow,
}) {
  const { t } = useTranslation();
  const state = useSelector((state) => state.IntegrationReducer);
  const disableCondition = state?.active_event?.is_binary;
  console.log('currentRowRequestBody', currentRow, 'disableCondition', disableCondition);
  const { ADD_EVENT } = INTEGRATION_STRINGS;
  const { DUPLICATE_KEY_ERROR } = FEATURE_INTEGRATION_STRINGS;
  const fieldOptionList = cloneDeep(ADD_EVENT.REQUEST_BODY.KEY_TYPE.OPTIONS(t));

  if (currentRow?.is_deleted) return null;
  if (depth === REQ_BODY_NESTED_LEVEL.MAX_DEPTH) {
    const index = fieldOptionList?.findIndex((option) => option.value === REQ_BODY_KEY_TYPES.OBJECT);
    if (index > -1) {
      fieldOptionList.splice(index, 1);
    }
  }
  let errorComponent = null;

  if (has(errorList, [`${path},child_rows`])) {
    let errorText = null;
    if (errorList[`${path},child_rows`].includes('required match')) {
      errorText = t(ADD_EVENT.ERROR_MESSAGES.REQUIRED_ROW_KEY);
    } else {
      errorText = t(ADD_EVENT.ERROR_MESSAGES.ADD_KEY);
    }

    errorComponent = (<Text size={ETextSize.XS} content={errorText} className={gClasses.red22} />);
  }

  let keyInputError = null;

  if (isDuplicateKeyError) {
    keyInputError = t(DUPLICATE_KEY_ERROR);
  } else {
    keyInputError = errorList[`${path},${ADD_EVENT.REQUEST_BODY.KEY_INPUT.ID}`];
  }

  return (
    <>
      <div className={cx(BS.D_FLEX)}>
        <div className={styles.ColMax}>
          <TextInput
            onChange={(e) =>
              onChangeHandlers({
                event: e,
                type: ADD_EVENT.REQUEST_BODY.KEY_INPUT.ID,
                path,
                isDuplicateKeyError,
                duplicateKeyRow,
              })
            }
            id={ADD_EVENT.REQUEST_BODY.KEY_INPUT.ID}
            className={styles.RequestBodyFields}
            value={currentRow?.key}
            errorMessage={keyInputError}
            readOnly={readOnlyView || disableCondition}
          />
        </div>
        <div className={cx(styles.TypeDropdown, styles.RequestBodyFields)}>
          <SingleDropdown
            id={ADD_EVENT.REQUEST_BODY.KEY_TYPE.ID}
            optionList={fieldOptionList}
            dropdownViewProps={{ disabled: readOnlyView || disableCondition }}
            onClick={(value, _label, _list, id) =>
              onChangeHandlers({
                event: generateEventTargetObject(id, value),
                type: ADD_EVENT.REQUEST_BODY.KEY_TYPE.ID,
                path,
              })
            }
            selectedValue={currentRow?.type}
            errorMessage={
              errorList[`${path},${ADD_EVENT.REQUEST_BODY.KEY_TYPE.ID}`]
            }
          />
        </div>
        <div className={cx(styles.ColMini, BS.MY_AUTO)}>
          <Checkbox
            id={ADD_EVENT.REQUEST_BODY.IS_MULTIPLE.ID}
            size={ECheckboxSize.LG}
            layout={RadioGroupLayout.stack}
            isValueSelected={currentRow?.is_multiple}
            details={get(ADD_EVENT.REQUEST_BODY.IS_MULTIPLE.OPTIONS, 0, {})}
            onClick={(value) =>
              onChangeHandlers({
                value: value,
                type: ADD_EVENT.REQUEST_BODY.IS_MULTIPLE.ID,
                path,
              })}
            errorMessage={
              errorList[`${path},${ADD_EVENT.REQUEST_BODY.IS_MULTIPLE.ID}`]
            }
            className={styles.RequestBodyFields}
            disabled={readOnlyView || disableCondition}
          />
        </div>
        <div className={cx(styles.ColMini, BS.MY_AUTO)}>
          <Checkbox
            id={ADD_EVENT.REQUEST_BODY.IS_REQUIRED.ID}
            size={ECheckboxSize.LG}
            layout={RadioGroupLayout.stack}
            isValueSelected={currentRow?.is_required}
            details={get(ADD_EVENT.REQUEST_BODY.IS_REQUIRED.OPTIONS, 0, {})}
            onClick={(value) =>
              onChangeHandlers({
                value: value,
                currentRow,
                type: ADD_EVENT.REQUEST_BODY.IS_REQUIRED.ID,
                path,
              })
            }
            errorMessage={
              errorList[`${path},${ADD_EVENT.REQUEST_BODY.IS_REQUIRED.ID}`]
            }
            disabled={readOnlyView}
            className={styles.RequestBodyFields}
          />
        </div>
        {!readOnlyView && (
          <div>
            <div
              role="button"
              tabIndex="0"
              onClick={() =>
                onChangeHandlers({
                  type: ADD_EVENT.REQUEST_BODY.DELETE.ID,
                  path,
                })
              }
              onKeyDown={(e) =>
                keydownOrKeypessEnterHandle(e) &&
                onChangeHandlers({
                  type: ADD_EVENT.REQUEST_BODY.DELETE.ID,
                  path,
                })
              }
              className={BS.MY_AUTO}
            >
              <Trash className={cx(styles.DeleteIcon, gClasses.MR12)} />
            </div>
          </div>
        )}
      </div>
      {readOnlyView && (
        <div className={cx(styles.Description, gClasses.MB15)}>{currentRow?.description}</div>
      )}
      {errorComponent}
    </>
  );
}

function RequestBody(props) {
  const {
    state: { active_event = {}, error_list = {} },
    integrationDataChange,
    isExternalIntegration,
  } = cloneDeep(props);
  const { t } = useTranslation();
  const { colorSchemeDefault } = useContext(ThemeContext);
  const colorScheme = colorSchemeDefault;

  const { ADD_EVENT } = INTEGRATION_STRINGS;

  const handleOnChangeHandler = (e, path, isDuplicateKeyError = false, duplicateKeyRow = {}) => {
    const errorList = cloneDeep(error_list);
    const clonedRequestBody = cloneDeep(active_event?.body);
    path = (path || []).split(',');
    set(clonedRequestBody, [...path, e.target.id], e.target.value);
    if (e.target.id === ADD_EVENT.REQUEST_BODY.KEY_TYPE.ID) {
      if (!isEmpty(errorList)) {
        Object.keys(errorList).forEach((key) => {
          if (key === `${path},child_rows`) {
            delete errorList[key];
          }
        });
      }
      if (
        e.target.value !== REQ_BODY_KEY_TYPES.OBJECT &&
        has(clonedRequestBody, [...path, 'child_rows'])
      ) {
        unset(clonedRequestBody, [...path, 'child_rows']);
      }
    }
    set(active_event, [INTEGRATION_CONSTANTS.REQUEST_BODY], clonedRequestBody);
    delete errorList[`${path},${e.target.id}`];

    if (isDuplicateKeyError) {
      delete errorList[duplicateKeyRow?.path];
    }

    integrationDataChange({
      active_event,
      error_list: errorList,
    });
  };

  const handleCheckboxChange = (id, value, path) => {
    const errorList = cloneDeep(error_list);
    const clonedRequestBody = cloneDeep(active_event?.body);
    path = (path || []).split(',');
    const currentRowJson = get(clonedRequestBody, path, {});
    const currentValue = !(currentRowJson && currentRowJson[id]);
    set(clonedRequestBody, [...path, id], currentValue);
    set(active_event, [INTEGRATION_CONSTANTS.REQUEST_BODY], clonedRequestBody);
    if (id === ADD_EVENT.REQUEST_BODY.IS_REQUIRED.ID) {
      if (!isEmpty(errorList)) {
        Object.keys(errorList).forEach((key) => {
          if (key === `${path},child_rows`) {
            delete errorList[key];
          }
        });
      }
    }
    integrationDataChange({
      active_event,
      error_list: errorList,
    });
  };

  const handleRowDelete = (path, isDuplicateKeyError = false, duplicateKeyRow = {}) => {
    const clonedRequestBody = cloneDeep(active_event?.body);
    path = (path || []).split(',');
    const rowTobeDeleted = get(clonedRequestBody, path, {});
    delete rowTobeDeleted?.child_rows;
    let removedList = set(clonedRequestBody, path, { ...rowTobeDeleted, is_deleted: true });
    const childRowPath = cloneDeep(path);
    childRowPath.pop();
    const childRows = get(clonedRequestBody, childRowPath);
    const validRows = (childRows || []).filter((data) => !data.is_deleted);
    if (isEmpty(validRows)) { removedList = set(clonedRequestBody, childRowPath, []); }
    set(active_event, [INTEGRATION_CONSTANTS.REQUEST_BODY], removedList);

    const clonedErrorList = cloneDeep(error_list);
    if (error_list) {
      Object.keys(error_list).forEach((currentKey) => {
        if (currentKey?.includes(path)) {
          delete clonedErrorList[currentKey];
        }
      });
    }

    if (isDuplicateKeyError) {
      delete clonedErrorList[duplicateKeyRow?.path];
    }

    integrationDataChange({
      active_event,
      error_list: clonedErrorList,
    });
  };

  const handleAddMoreObjects = (path, root_uuid = null, is_required = false) => {
    const clonedRequestBody = cloneDeep(active_event?.body) || [];
    const clonedRow = cloneDeep(initialRowData);
    clonedRow.path = path;
    clonedRow.key_uuid = uuidv4();
    const errorList = cloneDeep(error_list);
    if (root_uuid) {
      clonedRow.root_uuid = root_uuid;
      clonedRow.is_required = is_required;
      const currentPath = (path || []).split(',');
      set(clonedRequestBody, currentPath, clonedRow);
      if (!isEmpty(errorList)) {
        const currentPath = path.split(',') || [];
        currentPath.pop();
        const parentPath = (currentPath || []).join(',');
        if (has(errorList, [parentPath])) {
          delete errorList[parentPath];
        }
      }
    } else {
      clonedRequestBody.push(clonedRow);
    }
    set(active_event, [INTEGRATION_CONSTANTS.REQUEST_BODY], clonedRequestBody);
    integrationDataChange({
      active_event,
      error_list: errorList,
    });
  };

  const onChangeHandlers = ({ event, value, type, path, root_uuid, isDuplicateKeyError, duplicateKeyRow, is_required }) => {
    console.log('onChangeHandlers onChangeHandlers', 'type', { event, value, type, path, root_uuid, isDuplicateKeyError, duplicateKeyRow, is_required });
    switch (type) {
      case ADD_EVENT.REQUEST_BODY.KEY_INPUT.ID:
      case ADD_EVENT.REQUEST_BODY.KEY_TYPE.ID:
        return handleOnChangeHandler(event, path, isDuplicateKeyError, duplicateKeyRow);
      case ADD_EVENT.REQUEST_BODY.IS_MULTIPLE.ID:
      case ADD_EVENT.REQUEST_BODY.IS_REQUIRED.ID:
        return handleCheckboxChange(type, value, path);
      case ADD_EVENT.REQUEST_BODY.DELETE.ID:
        return handleRowDelete(path, isDuplicateKeyError, duplicateKeyRow);
      case ADD_EVENT.REQUEST_BODY.ADD_MORE_CHILD.ID:
        return handleAddMoreObjects(path, root_uuid, is_required);
      default:
        break;
    }
    return null;
  };
  console.log('active_event?.body', active_event?.body);

  const handleCheckboxChangeHandler = (e) => {
    const activeEvent = cloneDeep(active_event) || {};
    const clonedErrorList = cloneDeep(error_list) || {};
    const newRequestBody = [];
    const clonedRow = cloneDeep(initialRowData);
    console.log('initialreqBodyRow', initialRowData);
    if (activeEvent[e.target.id]) {
      set(activeEvent, [e.target.id], null);
      delete activeEvent.body;
    } else {
      set(activeEvent, [e.target.id], e.target.value);
      clonedRow.key_uuid = uuidv4();
      clonedRow.key = INTEGRATION_CONSTANTS.ENTIRE_REQUEST;
      clonedRow.type = REQ_BODY_KEY_TYPES.STREAM;
      newRequestBody.push(clonedRow);
      activeEvent.body = newRequestBody;
      console.log('initialreqBodyRowCloned', clonedRow);
    }

    delete clonedErrorList[e.target.id];

    integrationDataChange({
      active_event: activeEvent,
      error_list: clonedErrorList,
    });
  };

  return (
    <div className={cx(BS.D_FLEX, BS.FLEX_COLUMN)}>
      <Text
        content={t(ADD_EVENT.REQUEST_BODY.TITLE)}
        size={ETextSize.LG}
        className={cx(gClasses.FontWeight500, gClasses.MT20, gClasses.MB8)}
      />
      <Checkbox
        id={ADD_EVENT.IS_BINARY.ID}
        size={ECheckboxSize.LG}
        isValueSelected={active_event?.is_binary}
        disabled={isExternalIntegration}
        details={ADD_EVENT.IS_BINARY.OPTIONS[0]}
        className={gClasses.MB16}
        onClick={(value) =>
          handleCheckboxChangeHandler(generateEventTargetObject(ADD_EVENT.IS_BINARY.ID, value))
        }
      />
      <Text
        content={t(ADD_EVENT.QUERY_PARAMS.SUB_TITLE)}
        size={ETextSize.SM}
        className={gClasses.MB16}
      />
      <InputTreeLayout
        tableHeaders={ADD_EVENT.REQUEST_BODY_HEADERS(t)}
        headerStyles={[styles.KeyColumn, styles.TypeColumn, styles.MultipleCheckColumn, styles.RequiredColumn]}
        data={active_event?.body}
        showAddMore={false}
        depth={REQ_BODY_NESTED_LEVEL.INIT_DEPTH}
        maxDepth={REQ_BODY_NESTED_LEVEL.MAX_DEPTH}
        AddMoreIcon={() => <PlusIcon className={cx(styles.Icon, BS.MY_AUTO)} />}
        colorScheme={colorScheme}
        parentDetails={{}}
        onChangeHandlers={onChangeHandlers}
        RowComponent={RowComponent}
        errorList={error_list}
        keyLabels={getDefaultKeyLabels(t)}
        readOnlyView={isExternalIntegration || active_event?.is_binary}
        duplicateRowErrorClassName={styles.DuplicateRowError}
      />
    </div>
  );
}

const mapStateToProps = ({ IntegrationReducer }) => {
  return {
    state: IntegrationReducer,
  };
};

const mapDispatchToProps = {
  integrationDataChange,
};

export default connect(mapStateToProps, mapDispatchToProps)(RequestBody);
