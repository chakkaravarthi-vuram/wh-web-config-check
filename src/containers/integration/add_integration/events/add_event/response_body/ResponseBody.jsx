import React, { useContext } from 'react';
import cx from 'classnames/bind';
import gClasses from 'scss/Typography.module.scss';
import {
  Checkbox,
  ECheckboxSize,
  ETextSize,
  InputTreeLayout,
  RadioGroupLayout,
  SingleDropdown,
  Text,
  TextInput,
} from '@workhall-pvt-lmt/wh-ui-library';
import { connect, useSelector } from 'react-redux';
import { integrationDataChange } from 'redux/reducer/IntegrationReducer';
import { useTranslation } from 'react-i18next';
import { cloneDeep, has, get, set, isEmpty, unset } from 'utils/jsUtility';
import { generateEventTargetObject } from 'utils/generatorUtils';
import { keydownOrKeypessEnterHandle } from 'utils/UtilityFunctions';
import { v4 as uuidv4 } from 'uuid';
import styles from './ResponseBody.module.scss';
import { BS } from '../../../../../../utils/UIConstants';
import { FEATURE_INTEGRATION_STRINGS, INTEGRATION_ERROR_STRINGS } from '../../../../Integration.strings';
import {
  INTEGRATION_CONSTANTS,
  RES_BODY_NESTED_LEVEL,
} from '../../../../Integration.constants';
import PlusIcon from '../../../../../../assets/icons/PlusIcon';
import ThemeContext from '../../../../../../hoc/ThemeContext';
import {
  INTEGRATION_STRINGS,
  REQ_BODY_KEY_TYPES,
  getResponseBodyDefaultKeyLabels,
} from '../../../../Integration.utils';
import Trash from '../../../../../../assets/icons/application/Trash';
import { EMPTY_STRING } from '../../../../../../utils/strings/CommonStrings';

export const initialRowData = {
  key: EMPTY_STRING,
  label: EMPTY_STRING,
  type: EMPTY_STRING,
  is_multiple: false,
};

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
  const disableCondition = state?.active_event?.is_document_url;
  console.log('responseBodyActiveevent', state?.active_event, 'disableCondition', disableCondition);

  const { ADD_EVENT } = INTEGRATION_STRINGS;
  const { DUPLICATE_KEY_LABEL_ERROR } = FEATURE_INTEGRATION_STRINGS;
  const fieldOptionList = cloneDeep(ADD_EVENT.REQUEST_BODY.KEY_TYPE.OPTIONS(t));

  if (currentRow?.is_deleted) return null;
  if (depth === RES_BODY_NESTED_LEVEL.MAX_DEPTH) {
    const index = fieldOptionList?.findIndex((option) => option.value === REQ_BODY_KEY_TYPES.OBJECT);
    if (index > -1) {
      fieldOptionList.splice(index, 1);
    }
  }
  let errorComponent = null;

  if (has(errorList, [`${path},child_rows`]) || isDuplicateKeyError) {
    let errorText = null;
    if (isDuplicateKeyError) {
      errorText = t(DUPLICATE_KEY_LABEL_ERROR);
    } else if (errorList[`${path},child_rows`].includes('required match')) {
      errorText = t(ADD_EVENT.ERROR_MESSAGES.REQUIRED_ROW_KEY);
    } else {
      errorText = t(ADD_EVENT.ERROR_MESSAGES.ADD_KEY);
    }
    errorComponent = <Text size={ETextSize.XS} content={errorText} className={gClasses.red22} />;
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
            errorMessage={errorList[`${path},${ADD_EVENT.REQUEST_BODY.KEY_INPUT.ID}`]}
            readOnly={readOnlyView || disableCondition}
          />
        </div>
        <div className={styles.ColMax}>
          <TextInput
            onChange={(e) =>
              onChangeHandlers({
                event: e,
                type: ADD_EVENT.RESPONSE_BODY.LABEL_INPUT.ID,
                path,
                isDuplicateKeyError,
                duplicateKeyRow,
              })
            }
            id={ADD_EVENT.RESPONSE_BODY.LABEL_INPUT.ID}
            className={styles.RequestBodyFields}
            value={currentRow?.label}
            errorMessage={
              errorList[`${path},${ADD_EVENT.RESPONSE_BODY.LABEL_INPUT.ID}`]
            }
            readOnly={readOnlyView}
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
              })
            }
            errorMessage={
              errorList[`${path},${ADD_EVENT.REQUEST_BODY.IS_MULTIPLE.ID}`]
            }
            className={styles.RequestBodyFields}
            disabled={readOnlyView}
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
                  isDuplicateKeyError,
                  duplicateKeyRow,
                })
              }
              onKeyDown={(e) =>
                keydownOrKeypessEnterHandle(e) &&
                onChangeHandlers({
                  type: ADD_EVENT.REQUEST_BODY.DELETE.ID,
                  path,
                  isDuplicateKeyError,
                  duplicateKeyRow,
                })
              }
              className={BS.MY_AUTO}
            >
              <Trash className={cx(styles.DeleteIcon, gClasses.MR12)} />
            </div>
          </div>
        )}
      </div>
      {errorComponent}
    </>
  );
}

function ResponseBody(props) {
  const {
    integrationDataChange,
    isExternalIntegration,
    state: { active_event, response_error_list, error_list },
  } = cloneDeep(props);

  const { colorSchemeDefault } = useContext(ThemeContext);
  const colorScheme = colorSchemeDefault;

  const { t } = useTranslation();
  const { ADD_EVENT } = INTEGRATION_STRINGS;
  const { RESPONSE_BODY } = FEATURE_INTEGRATION_STRINGS;

  const handleOnChangeHandler = (
    e,
    path,
    isDuplicateKeyError = false,
    duplicateKeyRow = {},
  ) => {
    const errorList = cloneDeep(response_error_list);
    const clonedResponseBody = cloneDeep(active_event?.response_body);
    path = (path || []).split(',');
    set(clonedResponseBody, [...path, e.target.id], e.target.value);

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
        has(clonedResponseBody, [...path, 'child_rows'])
      ) {
        unset(clonedResponseBody, [...path, 'child_rows']);
      }
    }

    set(
      active_event,
      [INTEGRATION_CONSTANTS.RESPONSE_BODY],
      clonedResponseBody,
    );
    delete errorList[`${path},${e.target.id}`];

    if (isDuplicateKeyError) {
      delete errorList[duplicateKeyRow?.path];
    }

    integrationDataChange({
      active_event,
      response_error_list: errorList,
    });
  };

  const handleAddMoreObjects = (path, root_uuid = null) => {
    const clonedResponseBody = cloneDeep(active_event?.response_body) || [];
    const clonedRow = cloneDeep(initialRowData);
    clonedRow.path = path;
    clonedRow.key_uuid = uuidv4();
    const errorList = cloneDeep(response_error_list);
    if (root_uuid) {
      clonedRow.root_uuid = root_uuid;
      const currentPath = (path || []).split(',');
      set(clonedResponseBody, currentPath, clonedRow);
      if (!isEmpty(errorList)) {
        const currentPath = path.split(',') || [];
        currentPath.pop();
        const parentPath = (currentPath || []).join(',');
        if (has(errorList, [parentPath])) {
          delete errorList[parentPath];
        }
      }
    } else {
      clonedResponseBody.push(clonedRow);
    }

    const clonedErrorList = cloneDeep(error_list);

    if (error_list?.response_body) {
      delete clonedErrorList?.response_body;
    }

    set(
      active_event,
      [INTEGRATION_CONSTANTS.RESPONSE_BODY],
      clonedResponseBody,
    );
    integrationDataChange({
      active_event,
      response_error_list: errorList,
      error_list: clonedErrorList,
    });
  };

  const handleCheckboxChange = (id, value, path) => {
    const errorList = cloneDeep(response_error_list);
    const clonedResponseBody = cloneDeep(active_event?.response_body);
    path = (path || []).split(',');
    const currentRowJson = get(clonedResponseBody, path, {});
    const currentValue = !(currentRowJson && currentRowJson[id]);
    set(clonedResponseBody, [...path, id], currentValue);
    set(
      active_event,
      [INTEGRATION_CONSTANTS.RESPONSE_BODY],
      clonedResponseBody,
    );

    integrationDataChange({
      active_event,
      response_error_list: errorList,
    });
  };

  const handleRowDelete = (
    path,
    isDuplicateKeyError = false,
    duplicateKeyRow = {},
  ) => {
    const clonedResponseBody = cloneDeep(active_event?.response_body);
    path = (path || []).split(',');
    const rowTobeDeleted = get(clonedResponseBody, path, {});
    delete rowTobeDeleted?.child_rows;
    let removedList = set(clonedResponseBody, path, {
      ...rowTobeDeleted,
      is_deleted: true,
    });
    const childRowPath = cloneDeep(path);
    childRowPath.pop();
    const childRows = get(clonedResponseBody, childRowPath);
    const validRows = (childRows || []).filter((data) => !data.is_deleted);
    if (isEmpty(validRows)) {
      removedList = set(clonedResponseBody, childRowPath, []);
    }
    set(active_event, [INTEGRATION_CONSTANTS.RESPONSE_BODY], removedList);

    const clonedErrorList = cloneDeep(response_error_list);
    if (response_error_list) {
      Object.keys(response_error_list).forEach((currentKey) => {
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
      response_error_list: clonedErrorList,
    });
  };

  const onChangeHandlers = ({
    event,
    value,
    type,
    path,
    root_uuid,
    isDuplicateKeyError,
    duplicateKeyRow,
  }) => {
    switch (type) {
      case ADD_EVENT.REQUEST_BODY.KEY_INPUT.ID:
      case ADD_EVENT.REQUEST_BODY.KEY_TYPE.ID:
      case ADD_EVENT.RESPONSE_BODY.LABEL_INPUT.ID:
        return handleOnChangeHandler(
          event,
          path,
          isDuplicateKeyError,
          duplicateKeyRow,
        );
      case ADD_EVENT.REQUEST_BODY.IS_MULTIPLE.ID:
        return handleCheckboxChange(type, value, path);
      case ADD_EVENT.REQUEST_BODY.DELETE.ID:
        return handleRowDelete(path, isDuplicateKeyError, duplicateKeyRow);
      case ADD_EVENT.REQUEST_BODY.ADD_MORE_CHILD.ID:
        return handleAddMoreObjects(path, root_uuid);
      default:
        break;
    }
    return null;
  };

  return (
    <div className={cx(BS.D_FLEX, BS.FLEX_COLUMN)}>
      <Text
        content={t(RESPONSE_BODY.TITLE)}
        size={ETextSize.LG}
        className={cx(gClasses.FontWeight500, gClasses.MT20, gClasses.MB8)}
      />
      <Text
        content={t(RESPONSE_BODY.SUB_TITLE)}
        size={ETextSize.SM}
        className={gClasses.MB16}
      />
      <InputTreeLayout
        tableHeaders={RESPONSE_BODY.HEADERS}
        headerStyles={[
          styles.KeyColumn,
          styles.TypeColumn,
          styles.MultipleCheckColumn,
          styles.RequiredColumn,
        ]}
        data={active_event?.response_body}
        showAddMore={false}
        depth={RES_BODY_NESTED_LEVEL.INIT_DEPTH}
        maxDepth={RES_BODY_NESTED_LEVEL.MAX_DEPTH}
        AddMoreIcon={() => <PlusIcon className={cx(styles.Icon, BS.MY_AUTO)} />}
        colorScheme={colorScheme}
        parentDetails={{}}
        onChangeHandlers={onChangeHandlers}
        RowComponent={RowComponent}
        errorList={response_error_list}
        keyLabels={getResponseBodyDefaultKeyLabels(t)}
        readOnlyView={isExternalIntegration || active_event?.is_document_url}
        hideRootAdd={active_event?.is_document_url}
        duplicateRowErrorClassName={styles.DuplicateRowError}
      />
      {error_list?.response_body && (
        <Text
          content={t(INTEGRATION_ERROR_STRINGS.RESPONSE_BODY)}
          className={gClasses.red22}
        />
      )}
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

export default connect(mapStateToProps, mapDispatchToProps)(ResponseBody);
