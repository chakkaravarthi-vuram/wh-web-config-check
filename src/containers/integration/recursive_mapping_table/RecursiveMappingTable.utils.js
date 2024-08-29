import React from 'react';
import cx from 'classnames/bind';
import gClasses from 'scss/Typography.module.scss';
import { get, has, isEmpty } from 'utils/jsUtility';
import AddIcon from 'assets/icons/AddIcon';
import { keydownOrKeypessEnterHandle } from 'utils/UtilityFunctions';
import { EMPTY_STRING } from 'utils/strings/CommonStrings';
import { TABLE_FIELD_LIST_TYPE } from 'utils/ValidationConstants';
import HELPER_MESSAGE_TYPE from 'components/form_components/helper_message/HelperMessage.strings';
import HelperMessage from 'components/form_components/helper_message/HelperMessage';
import { ARIA_ROLES } from 'utils/UIConstants';
import styles from './RecursiveMappingTable.module.scss';
import { INTEGRATION_STRINGS } from '../Integration.utils';
import { INTEGRATION_CONSTANTS } from '../Integration.constants';

const { ADD_EVENT } = INTEGRATION_STRINGS;
const { ROW_TYPES } = INTEGRATION_CONSTANTS;

export const isAllChildDeleted = (childRows = []) => {
  if (isEmpty(childRows)) return true;
  else {
    let isAllChildDeleted = true;

    childRows.forEach((eachChild) => {
      if (!(has(eachChild, 'is_deleted') && eachChild?.is_deleted === true)) {
        isAllChildDeleted = false;
      }
    });
    return isAllChildDeleted;
  }
};

export const getRecursiveTableUINew = (
  reqParam = [],
  RowComponent,
  onChangeHandlers,
  parentDetails = {},
  error_list = {},
  depth = 0,
  isExternalIntegration,
  showAddMore,
  maxDepth = 3,
  childKey,
  innerRowClass,
  helperMessageClass,
  t = () => {},
  isMLIntegration,
) => {
  console.log('showAddMoreshowAddMore', depth, maxDepth, parentDetails);
  const componentList = [];

  const duplicateKeyIndex = (reqParam || []).findIndex((eachRow) => error_list[eachRow?.path] && error_list[eachRow?.path].includes('duplicate value'));
  let duplicateKeyRow = {};

  if (duplicateKeyIndex !== -1) {
    duplicateKeyRow = (reqParam || [])[duplicateKeyIndex];
  }

  (reqParam || []).forEach((rowData, index) => {
    let isShowAddMoreKeys = false;
    let isShowAddMoreObjectKeys = false;
    let finalPath = null;
    let objectFinalPath = null;
    let rootUuid = null;
    let objectRootUuid = null;

    const isDuplicateKeyError = rowData?.key === duplicateKeyRow?.key;

    if (parentDetails?.isObjectParent && reqParam.length - 1 === index) {
      isShowAddMoreObjectKeys = true;
      let currentPath = [];
      currentPath = (rowData?.path || EMPTY_STRING).split(',');
      currentPath.pop();
      currentPath.push(index + 1);
      objectFinalPath = currentPath.join(',');
      objectRootUuid = rowData?.root_uuid;
    }

    if (
      ((rowData?.type === ROW_TYPES.OBJECT && !rowData?.is_deleted) || (rowData?.response_type === ROW_TYPES.OBJECT && !rowData?.is_deleted)) &&
      (isEmpty(rowData && rowData[childKey]) || isAllChildDeleted(rowData[childKey]))
    ) {
      isShowAddMoreKeys = true;
      finalPath = `${rowData?.path},${childKey},0`;
      rootUuid = rowData?.key_uuid;
    }

    let currentComponent = null;
    const addMoreTableCondition = !has(rowData, ['field_type']) ||
    get(rowData, ['field_type'], EMPTY_STRING) === TABLE_FIELD_LIST_TYPE;
    console.log('showAddMoreshowAddMorewsx', rowData, addMoreTableCondition);
    const addMoreKeysElem =
      (isExternalIntegration && isMLIntegration) ? null : (
        <>
          {depth < maxDepth && isShowAddMoreKeys && showAddMore && addMoreTableCondition && (
            <div
              role="button"
              tabIndex="0"
              onClick={() =>
                onChangeHandlers({
                  type: ADD_EVENT.REQUEST_BODY.ADD_MORE_CHILD.ID,
                  path: finalPath,
                  current_index: index,
                  root_uuid: rootUuid,
                  is_required: rowData?.is_required,
                })
              }
              onKeyDown={(e) =>
                keydownOrKeypessEnterHandle(e) &&
                onChangeHandlers({
                  type: ADD_EVENT.REQUEST_BODY.ADD_MORE_CHILD.ID,
                  path: finalPath,
                  current_index: index,
                  root_uuid: rootUuid,
                  is_required: rowData?.is_required,
                })
              }
              className={cx(
                styles.ButtonContainer,
                gClasses.ML34,
                gClasses.MB12,
              )}
            >
              <AddIcon className={cx(gClasses.MR3, styles.AddIcon)} />
              <span className={styles.AddShortcut}>
                {t(ADD_EVENT.ADD_MORE_KEY)}
              </span>
            </div>
          )}
          {isShowAddMoreObjectKeys && showAddMore && (
            <div
              role="button"
              tabIndex="0"
              onClick={() =>
                onChangeHandlers({
                  type: ADD_EVENT.REQUEST_BODY.ADD_MORE_CHILD.ID,
                  path: objectFinalPath,
                  current_index: index,
                  root_uuid: objectRootUuid,
                })
              }
              onKeyDown={(e) =>
                keydownOrKeypessEnterHandle(e) &&
                onChangeHandlers({
                  type: ADD_EVENT.REQUEST_BODY.ADD_MORE_CHILD.ID,
                  path: objectFinalPath,
                  current_index: index,
                  root_uuid: objectRootUuid,
                })
              }
              className={cx(
                styles.ButtonContainer,
                gClasses.ML24,
                gClasses.MB12,
              )}
            >
              <AddIcon className={cx(gClasses.MR3, styles.AddIcon)} />
              <span className={styles.AddShortcut}>
                {t(ADD_EVENT.ADD_MORE_KEY)}
              </span>
            </div>
          )}
        </>
      );

    if (rowData?.is_deleted) {
      currentComponent = addMoreKeysElem;
    } else {
      console.log('sserdtfgds', error_list, rowData, get(rowData, ['field_details', 'table_uuid'], EMPTY_STRING));
      currentComponent = (
        <li className={cx(styles.RowStyle)}>
          <div className={cx(!isMLIntegration && gClasses.PL20, gClasses.PT12, innerRowClass)}>
            <RowComponent
              path={rowData.path}
              key={index}
              currentRow={rowData}
              onChangeHandlers={onChangeHandlers}
              error_list={error_list}
              depth={depth}
              isExternalIntegration={isExternalIntegration}
              isDuplicateKeyError={isDuplicateKeyError}
              duplicateKeyRow={duplicateKeyRow}
              parentTableUuid={parentDetails?.parentTableUuid}
              isMulitpleChild={parentDetails?.isMulitpleChild}
              isMLIntegration={isMLIntegration}
            />
          </div>
          {!isMLIntegration && !isEmpty(rowData[childKey]) &&
            !isAllChildDeleted(rowData[childKey]) && (
              <li
                className={cx(
                  styles.ChildDivider,
                  gClasses.PT12,
                  gClasses.PL20,
                  styles.ChildMapping,
                )}
              >
                <ul className={cx(gClasses.ML20, styles.ChildList, gClasses.MR8)}>
                  {getRecursiveTableUINew(
                    rowData[childKey],
                    RowComponent,
                    onChangeHandlers,
                    {
                      isObjectParent: rowData?.type === ROW_TYPES.OBJECT || rowData?.response_type === ROW_TYPES.OBJECT,
                      isParentRequired: rowData?.type,
                      parentTableUuid: get(rowData, ['field_details', 'table_uuid'], EMPTY_STRING),
                      isMulitpleChild: rowData?.is_multiple,
                    },
                    error_list,
                    depth + 1,
                    isExternalIntegration,
                    showAddMore,
                    maxDepth,
                    childKey,
                    innerRowClass,
                    helperMessageClass,
                    t,
                  )}
                </ul>
              </li>
            )}

          {!isMLIntegration && addMoreKeysElem}
          {error_list[`${rowData?.path},column_mapping`] &&
            <HelperMessage
              message={error_list[`${rowData?.path},column_mapping`]}
              className={helperMessageClass}
              type={HELPER_MESSAGE_TYPE.ERROR}
              noMarginBottom
              role={ARIA_ROLES.ALERT}
            />
          }
        </li>
      );
    }

    componentList.push(currentComponent);
  });
  return componentList;
};
