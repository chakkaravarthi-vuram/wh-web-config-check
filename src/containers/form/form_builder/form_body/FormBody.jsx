import React, { useEffect, useState } from 'react';
import cx from 'classnames';
import { Chip, toastPopOver, EToastType, EToastPosition, Text, ETextSize } from '@workhall-pvt-lmt/wh-ui-library';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import Sections from '../../sections/Sections';
import { isEmpty, get, cloneDeep, has, isNull, isFiniteNumber } from '../../../../utils/jsUtility';
import FieldConfiguration from '../../sections/field_configuration/FieldConfiguration';
import gClasses from '../../../../scss/Typography.module.scss';
import { FIELD_ACTION_TYPE, FORM_ACTIONS, FORM_BODY_STRINGS, FORM_CONFIG_STRINGS, FORM_LAYOUT_TYPE, FORM_TYPE, VALUE_CONFIG_TYPES } from '../../Form.string';
import styles from './FormBody.module.scss';
import { MODULE_TYPES } from '../../../../utils/Constants';
import { addLayout, consolidateTableRowWithPath, constructNeededFieldDataForLayout, constructSinglePath, deleteLayout, getLayoutByPath, getPathAndIndex, replaceLayout } from '../../sections/form_layout/FormLayout.utils';
import { COLUMN_LAYOUT } from '../../sections/form_layout/FormLayout.string';
import { getNewRowWithColumns } from '../../layout/Layout.utils';
import { constructFieldPostData, getColumnsForExternalColumnForTable, getUpdatedLayoutOnRowDrop, isDisableAddRowAndModifyRow } from './FormBody.utils';
import { COMMA, EMPTY_STRING } from '../../../../utils/strings/CommonStrings';
import { REQUEST_FIELD_KEYS, RESPONSE_FIELD_KEYS, RESPONSE_VALIDATION_KEYS } from '../../../../utils/constants/form/form.constant';
import { deleteFieldApiThunk, updateFormFieldOrder } from '../../../../redux/actions/Form.Action';
import { getModuleIdByModuleType } from '../../Form.utils';
import { LAYOUT_ACTIONS, getUpdatedOriginalAndPostSectionData, updateLayoutBasedOnActionAndPath } from '../../sections/sections.utils';
import { FIELD_TYPES } from '../../../../components/form_builder/FormBuilder.strings';
import { TABLE_FIELD_SOURCE_TYPE } from '../../sections/field_configuration/FieldConfiguration.strings';
import ExternalSourceColumnConfiguration from '../../sections/field_configuration/column_configuration/external_source_column_configuration/ExternalSourceColumnConfiguration';
import ImportForm from '../../import_form/ImportForm';
import PlusIconBlueNew from '../../../../assets/icons/PlusIconBlueNew';
import DownloadDashboardIcon from '../../../../assets/icons/dashboards/DownloadDashboardIcon';
import { setPointerEvent, updatePostLoader } from '../../../../utils/UtilityFunctions';
import { updateSomeoneIsEditingPopover as flowUpdateSomeoneIsEditingPopover } from '../../../edit_flow/EditFlow.utils';
import { updateSomeoneIsEditingPopover as taskUpdateSomeoneIsEditingPopover } from '../../../../redux/actions/CreateTask.Action';
import { IMPORT_TYPES } from '../../import_form/ImportForm.strings';
import { updateSomeoneIsEditingPopover as datalistUpdateSomeoneIsEditingPopover } from '../../../../redux/actions/CreateDataList.action';
import CONDITION_BUILDER from '../../../../components/condition_builder/ConditionBuilder.strings';
import LayoutConfiguration from '../../layout/layout_configuration/LayoutConfiguration';
import { getDashboardPageApiData } from '../../../shared_container/individual_entry/summary_builder/SummaryBuilder.utils';
import { deleteDashboardPageComponentThunk } from '../../../../redux/actions/IndividualEntry.Action';
import { FIELD_TYPE } from '../../../../utils/constants/form.constant';
import { displayErrorToast } from '../../../../utils/flowErrorUtils';
import { SOMEONE_EDITING } from '../../../../utils/ServerValidationUtils';

function FormBody(props) {
    const {
      metaData,
      formType,
      activeField,
      activeLayout,
      sections,
      fields,
      formVisibility,
      validationMessage,
      onDropHandler,
      dispatch,
      moduleType = MODULE_TYPES.FLOW,
      saveField = null,
      userProfileData,
    } = props;
    const { t } = useTranslation();
    const reduxDispatch = useDispatch();
    const [dependencyData, setDependencyData] = useState({});
    const isFlow = moduleType === MODULE_TYPES.FLOW;
    const sectionUUID = activeField?.sectionUUID;
    const [showImportForm, setShowImportForm] = useState(false);
    const [isImportForm, setIsImportForm] = useState(false);
    const FORM_BODY = FORM_BODY_STRINGS(t);

    useEffect(() => {
      setShowImportForm(isFlow && !metaData.isInitiation && isEmpty(fields));
    }, []);

    const getActiveColumnAndDropUtil = (fieldPath, fieldData, fieldUUID) => {
       // if the table is being added in 2nd/ 3rd/ 4th column, then fieldPath will have column order as `${1|2|3}_column`,
       // this should be changed to 0_column, since row which includes a table will have only 1 column
        let tableFieldPath = fieldPath;
        const tableFieldPathArr = tableFieldPath.split(',');
        tableFieldPathArr[1] = constructSinglePath(0, FORM_LAYOUT_TYPE.COLUMN); // 0_column
        const _fieldPath = tableFieldPathArr.join(',');
        tableFieldPath = _fieldPath;
        fieldData.path = tableFieldPath;

        const consolidatedFieldPath = [tableFieldPath, constructSinglePath(0, FORM_LAYOUT_TYPE.ADD_FIELD)].join(COMMA);

        const activeColumnData = {
          ...(fieldData?.activeColumn || {}),
          dropType: FORM_LAYOUT_TYPE.FIELD,
          path: consolidatedFieldPath,
          fieldListType: FIELD_TYPES.TABLE,
          [RESPONSE_FIELD_KEYS.TABLE_UUID]: fieldUUID,
        };

        const dropUtil = {
          path: consolidatedFieldPath,
          dropType: FORM_LAYOUT_TYPE.FIELD,
        };

        return { activeColumnData, dropUtil };
    };

    const TABLE_VALIDATION_KEY = RESPONSE_VALIDATION_KEYS[FIELD_TYPES.TABLE];

    // In Future, Below function should be separated as smaller function.
    const onSaveHandler = async (fieldData_, sectionUUID, dropUtil_, recursiveCallSectionData = null, recursiveCallactiveField = null) => {
      setPointerEvent(true); // Pointer events disabled onSave Button Click
      updatePostLoader(true); // Loader set to true onSave Button Click
      let clonedActiveField = recursiveCallactiveField || cloneDeep(activeField);
      let sectionData = recursiveCallSectionData || sections?.find((section) => section?.section_uuid === sectionUUID);
      let postData = null;
      let fieldData = null;
      let dropUtil = null;
      let actionType = null;
      if (moduleType === MODULE_TYPES.SUMMARY) {
        if (
          !isEmpty(fieldData_[RESPONSE_FIELD_KEYS.FIELD_UUID]) &&
          isEmpty(fieldData_[RESPONSE_FIELD_KEYS.NODE_UUID])
        ) {
          const nodeUUIDData = sectionData?.contents?.find(
            (data) =>
              data?.[REQUEST_FIELD_KEYS.FIELD_UUID] ===
              fieldData_?.[RESPONSE_FIELD_KEYS.FIELD_UUID],
          )?.[REQUEST_FIELD_KEYS.NODE_UUID];
          if (!isEmpty(nodeUUIDData)) {
            fieldData_[RESPONSE_FIELD_KEYS.NODE_UUID] = nodeUUIDData;
          }
        }
        postData = getDashboardPageApiData(fieldData_, { fields });
        fieldData = fieldData_;
        dropUtil = dropUtil_;
        actionType = fieldData[RESPONSE_FIELD_KEYS.FIELD_TYPE] === FIELD_TYPES.TABLE ? FIELD_ACTION_TYPE.TABLE : FIELD_ACTION_TYPE.FIELD;
      } else {
        const constructData = constructFieldPostData(fieldData_, clonedActiveField, dropUtil_, t, cloneDeep(sectionData), fields);
        postData = constructData.postData;
        fieldData = constructData.fieldData;
        dropUtil = constructData.dropUtil;
        actionType = constructData.actionType;
      }

      // const { postData, fieldData, dropUtil, actionType } = constructFieldPostData(fieldData_, clonedActiveField, dropUtil_, t, cloneDeep(sectionData), fields);
      const isTable = (actionType === FIELD_ACTION_TYPE.TABLE);
      const isDirectFieldInsideTable = has(postData, ['table_uuid'], false);
      let dndFieldBetweenRowsIndex = dropUtil_.dndFieldBetweenRowsIndex || null;

      const saveAPI = () => saveField(
        actionType,
        postData,
        fieldData?.[RESPONSE_FIELD_KEYS.PATH],
        sectionUUID,
        cloneDeep(sectionData),
        async (responseFieldData, fieldNodeUuid, validateParent) => {
            setPointerEvent(false); // Events reverted on Success
            updatePostLoader(false);
            const field = cloneDeep(fieldData);
            const fieldId = responseFieldData?._id;
            const fieldUUID = responseFieldData?.field_uuid;

            // If a field is saved for a first time, then update the fields with UUID and Id from api.
            if (!fieldData?.[RESPONSE_FIELD_KEYS.FIELD_UUID]) {
              field[RESPONSE_FIELD_KEYS.FIELD_UUID] = fieldUUID;
              field[RESPONSE_FIELD_KEYS.FIELD_ID] = fieldId;
              field[RESPONSE_FIELD_KEYS.REFERENCE_NAME] = responseFieldData?.[REQUEST_FIELD_KEYS.REFERENCE_NAME];
              field.node_uuid = fieldNodeUuid;
              field[REQUEST_FIELD_KEYS.AUTO_FILL] = postData[REQUEST_FIELD_KEYS.AUTO_FILL];
              field[REQUEST_FIELD_KEYS.VALIDATIONS] = fieldData.validationData || {};
            }

            if (moduleType === MODULE_TYPES.SUMMARY && [FIELD_TYPE.IMAGE, FIELD_TYPE.RICH_TEXT].includes(field[RESPONSE_FIELD_KEYS.FIELD_TYPE])) {
              field.isImageChange = false;
            }

            if (!isNull(dndFieldBetweenRowsIndex) && isTable) {
              dispatch(FORM_ACTIONS.UPDATE_ACTIVE_FIELD, { data: { dropType: null } });
            }
            await dispatch(FORM_ACTIONS.SAVE_FIELD, { sectionUUID, field });

            if (isEmpty(sectionData)) return;

            let updatedSectionData = sectionData;

            // Layout Update and Reorder -  Happen Only New Field Creation.
            // fieldData refers to old data.
            if (fieldData?.[RESPONSE_FIELD_KEYS.FIELD_UUID]) {
              // If Table already has external source columns, then under go the below "if" .
              if (!isEmpty(responseFieldData?.child_fields)) {
                const tableLayout = cloneDeep(getLayoutByPath(sectionData?.layout, dropUtil?.path));
                const { columns, fieldList } = getColumnsForExternalColumnForTable(tableLayout, responseFieldData?.child_fields, postData, metaData?.formUUID, moduleType);
                dispatch(FORM_ACTIONS.SAVE_FIELD_LIST, { fields: fieldList, sectionUUID });

                tableLayout.children = [...columns];

                const [index, path_] = getPathAndIndex(dropUtil?.path);
                const updatedLayout = replaceLayout(
                  cloneDeep(sectionData?.layout),
                  path_ || EMPTY_STRING,
                  [],
                  index,
                  tableLayout,
                );
                updatedSectionData = { ...sectionData, layout: updatedLayout };
                dispatch(FORM_ACTIONS.UPDATE_SECTION, {
                  sectionData: updatedSectionData,
                  sectionUUID,
                });
              }

              // Check for table Edge Case of all field ReadOnly and Make a call recursive.
              if (fieldData?.[RESPONSE_FIELD_KEYS.FIELD_TYPE] === FIELD_TYPES.TABLE &&
                 !isEmpty(clonedActiveField?.activeColumn) &&
                  (
                    get(clonedActiveField, [RESPONSE_VALIDATION_KEYS.VALIDATION_DATA, TABLE_VALIDATION_KEY.ADD_NEW_ROW], false) !== get(postData, [RESPONSE_FIELD_KEYS.VALIDATIONS, TABLE_VALIDATION_KEY.ADD_NEW_ROW], false) ||
                    get(clonedActiveField, [RESPONSE_VALIDATION_KEYS.VALIDATION_DATA, TABLE_VALIDATION_KEY.ALLOW_MODIFY_EXISTING], false) !== get(postData, [RESPONSE_FIELD_KEYS.VALIDATIONS, TABLE_VALIDATION_KEY.ALLOW_MODIFY_EXISTING], false)
                  )
                ) {
                    const constructedValidations = {
                      ...get(clonedActiveField, [RESPONSE_VALIDATION_KEYS.VALIDATION_DATA], {}),
                      [TABLE_VALIDATION_KEY.ADD_NEW_ROW]: get(postData, [RESPONSE_FIELD_KEYS.VALIDATIONS, TABLE_VALIDATION_KEY.ALLOW_MODIFY_EXISTING], false),
                      [TABLE_VALIDATION_KEY.ALLOW_MODIFY_EXISTING]: get(postData, [RESPONSE_FIELD_KEYS.VALIDATIONS, TABLE_VALIDATION_KEY.ALLOW_MODIFY_EXISTING], false),
                    };
                    clonedActiveField = {
                      ...clonedActiveField,
                      [RESPONSE_VALIDATION_KEYS.VALIDATION_DATA]: constructedValidations,
                      [RESPONSE_FIELD_KEYS.VALIDATIONS]: constructedValidations,
                    };

                    dispatch(FORM_ACTIONS.UPDATE_ACTIVE_FIELD, { data: {
                        [RESPONSE_VALIDATION_KEYS.VALIDATION_DATA]: constructedValidations,
                        [RESPONSE_FIELD_KEYS.VALIDATIONS]: constructedValidations,
                      },
                    });

                    const { activeColumnData, dropUtil } = getActiveColumnAndDropUtil(fieldData[RESPONSE_FIELD_KEYS.PATH], fieldData, fieldUUID);

                    onSaveHandler(activeColumnData, sectionUUID, dropUtil, updatedSectionData, clonedActiveField);
                    return;
                }
            } else {
                const sectionLayout = sectionData?.layout;
                const [index, path_] = getPathAndIndex(dropUtil?.path);
                const data = constructNeededFieldDataForLayout(field, actionType);
                let makeUpdateFormFieldOrderCall = false; // helps to determining whether the update layout call is necessary or not.
                // Save the Exteranl column fields to overall fields object and add columns layout structure to data variable.
                if (!isEmpty(responseFieldData?.child_fields)) {
                  const { columns, fieldList } = getColumnsForExternalColumnForTable(null, responseFieldData?.child_fields, postData, metaData?.formUUID, moduleType);
                  data.children = columns;
                  dispatch(FORM_ACTIONS.SAVE_FIELD_LIST, { fields: fieldList, sectionUUID });
                }

                // Add data(variable) value into layout.
                let updatedLayout = addLayout(
                  cloneDeep(sectionLayout),
                  path_ || EMPTY_STRING,
                  [],
                  index,
                  data,
                );

                // if Table is created on a column by DND, Need to remove neared all column to make table a single columned row.
                // isNull(dndFieldBetweenRowsIndex) -> table should not be created by dropping in-between rows
                if (isTable && !isFiniteNumber(dndFieldBetweenRowsIndex)) {
                  const { tableLayout, extraTableField, path } = consolidateTableRowWithPath(
                    updatedLayout,
                    path_,
                  );
                  console.log('xyz isTable', isTable && isNull(dndFieldBetweenRowsIndex));

                  const [idk, consPath] = getPathAndIndex(path);

                  // TBD - Need Replace Layout function and handle on adding table in non-empty row.
                  updatedLayout = replaceLayout(
                    cloneDeep(updatedLayout),
                    consPath || EMPTY_STRING,
                    [],
                    idk,
                    tableLayout,
                  );

                  if (!isEmpty(extraTableField)) {
                    const extraRowLayout = getNewRowWithColumns(1);
                    extraRowLayout.children[0].children = [extraTableField];
                    // For creating new row and column for table
                    updatedLayout = addLayout(
                      cloneDeep(updatedLayout),
                      consPath || EMPTY_STRING,
                      [],
                      idk + 1,
                      extraRowLayout,
                    );
                    const consolidatedDescendentPath = [
                      constructSinglePath(idk + 1, FORM_LAYOUT_TYPE.ROW),
                      constructSinglePath(0, FORM_LAYOUT_TYPE.COLUMN),
                      constructSinglePath(0, FORM_LAYOUT_TYPE.TABLE),
                    ].join(COMMA);
                    fieldData[RESPONSE_FIELD_KEYS.PATH] = consolidatedDescendentPath;
                    dispatch(FORM_ACTIONS.UPDATE_ACTIVE_FIELD, {
                      data: { [RESPONSE_FIELD_KEYS.PATH]: consolidatedDescendentPath },
                    });
                    makeUpdateFormFieldOrderCall = true;
                  }
                }

                  // if the field is inside box, then take no of columns of the box
                  let columnCount = sectionData.no_of_columns;
                  if (dropUtil_.path?.includes(FORM_LAYOUT_TYPE.BOX)) {
                    const _path = dropUtil_.path?.substring(0, dropUtil_.path.indexOf(FORM_LAYOUT_TYPE.BOX) + 3);
                    const boxLayout = getLayoutByPath(sectionData.layout, _path);
                    columnCount = boxLayout.number_of_columns || COLUMN_LAYOUT.TWO;
                  }
                  const updatedSection = { ...sectionData, layout: updatedLayout };
                  const extraRowAddedSection = updateLayoutBasedOnActionAndPath(updatedSection, columnCount, path_, LAYOUT_ACTIONS.ADD_EXTRA_ROW);
                  const isChanged = JSON.stringify(updatedLayout) !== JSON.stringify(extraRowAddedSection?.layout);
                  const { postData: reorderPostData } = getUpdatedOriginalAndPostSectionData([extraRowAddedSection], metaData, moduleType);
                  makeUpdateFormFieldOrderCall = makeUpdateFormFieldOrderCall || isChanged;
                  updatedSectionData = extraRowAddedSection;

                  const saveField = () => {
                    validateParent?.(cloneDeep(updatedSectionData), sectionUUID);

                    // Save direct field inside table.
                    if (isTable && !isEmpty(fieldData?.activeColumn)) {
                        const tableFieldPath = fieldData[RESPONSE_FIELD_KEYS.PATH].replace(
                          FORM_LAYOUT_TYPE.ADD_FIELD,
                          data?.type,
                        );

                      if (isDisableAddRowAndModifyRow(cloneDeep(clonedActiveField), clonedActiveField?.activeColumn, fields)) {
                        const constructedValidations = {
                          ...get(clonedActiveField, [RESPONSE_VALIDATION_KEYS.VALIDATION_DATA], {}),
                          [TABLE_VALIDATION_KEY.ADD_NEW_ROW]: false,
                          [TABLE_VALIDATION_KEY.ALLOW_MODIFY_EXISTING]: false,
                        };
                        clonedActiveField = {
                          ...clonedActiveField,
                          [RESPONSE_VALIDATION_KEYS.VALIDATION_DATA]: constructedValidations,
                          [RESPONSE_FIELD_KEYS.VALIDATIONS]: constructedValidations,
                        };

                        dispatch(FORM_ACTIONS.UPDATE_ACTIVE_FIELD, { data: {
                            [RESPONSE_VALIDATION_KEYS.VALIDATION_DATA]: constructedValidations,
                            [RESPONSE_FIELD_KEYS.VALIDATIONS]: constructedValidations,
                          },
                        });
                      }
                       const { activeColumnData, dropUtil } = getActiveColumnAndDropUtil(tableFieldPath, fieldData, fieldUUID);
                       dropUtil.dndFieldBetweenRowsIndex = dndFieldBetweenRowsIndex;
                       onSaveHandler(activeColumnData, sectionUUID, dropUtil, updatedSectionData, cloneDeep(clonedActiveField));
                    }
                  };

                  // Update layout call.
                  if (makeUpdateFormFieldOrderCall) {
                    // Api call to reorder fields across section and multiple sections.
                    reduxDispatch(updateFormFieldOrder(reorderPostData, moduleType)).then(() => {
                      dispatch(FORM_ACTIONS.UPDATE_SECTION, {
                        sectionData: cloneDeep(updatedSectionData),
                        sectionUUID,
                      });
                      saveField();
                    });
                  } else {
                      dispatch(FORM_ACTIONS.UPDATE_SECTION, {
                        sectionData: updatedSectionData,
                        sectionUUID,
                      });
                      saveField();
                  }
            }

             // Clear Active Field Data, If its not a table.
            let clearAction = FORM_ACTIONS.ACTIVE_FIELD_CLEAR;

            if (isDirectFieldInsideTable) clearAction = FORM_ACTIONS.ACTIVE_COLUMN_CLEAR;
            if (!isEmpty(fieldData?.activeExternalSourceData)) clearAction = FORM_ACTIONS.ACTIVE_EXTERNAL_SOURCE_CLEAR;

            // Update path from "add-field" text to table/other field type in table and columns.
            if (isTable) {
              const tableLayout = getLayoutByPath(
                updatedSectionData?.layout,
                fieldData?.path,
              );
              const columns = tableLayout?.children || [];

              const layoutType = (actionType === FIELD_ACTION_TYPE.TABLE) ? FORM_LAYOUT_TYPE.TABLE : FORM_LAYOUT_TYPE.FIELD;

              if (columns.length > 0) {
                dispatch(FORM_ACTIONS.UPDATE_ACTIVE_FIELD, {
                  data: {
                    [RESPONSE_FIELD_KEYS.PATH]: fieldData[
                      RESPONSE_FIELD_KEYS.PATH
                    ].replace(FORM_LAYOUT_TYPE.ADD_FIELD, layoutType),
                  },
                });
                dispatch(clearAction);
              } else {
                dispatch(FORM_ACTIONS.UPDATE_ACTIVE_FIELD, {
                  data: {
                    [RESPONSE_FIELD_KEYS.FIELD_UUID]: fieldUUID,
                    [RESPONSE_FIELD_KEYS.FIELD_ID]: fieldId,
                    [RESPONSE_FIELD_KEYS.NODE_UUID]: fieldNodeUuid,
                    [RESPONSE_FIELD_KEYS.PATH]: fieldData[
                      RESPONSE_FIELD_KEYS.PATH
                    ].replace(FORM_LAYOUT_TYPE.ADD_FIELD, layoutType),
                  },
                });
              }
            } else dispatch(clearAction);
        },
        (error) => {
          setPointerEvent(false); // Events reverted on error
          updatePostLoader(false);
          const errors = error?.response?.data?.errors || [];
          const { type, validation_message } = errors?.[0] || {};

          if (type === SOMEONE_EDITING) {
            switch (moduleType) {
              case MODULE_TYPES.TASK:
                taskUpdateSomeoneIsEditingPopover(errors[0].message);
              break;
              case MODULE_TYPES.FLOW:
                flowUpdateSomeoneIsEditingPopover(errors[0].message);
              break;
              case MODULE_TYPES.DATA_LIST:
                datalistUpdateSomeoneIsEditingPopover(errors[0].message);
              break;
              default:
              break;
            }
          } else if (
            [type, validation_message].includes(CONDITION_BUILDER.SERVER_ERROR_KEYS.CYCLIC_DEPENDENCY)
          ) {
            toastPopOver({
              title: t('error_popover_status.cyclic_dependency'),
              subtitle: t('error_popover_status.cannot_set_rule'),
              toastType: EToastType.error,
              toastPosition: EToastPosition.BOTTOM_LEFT,
            });
          } else if (errors.length > 0) {
            errors.forEach((error) => {
              if (error?.type === 'not_exist' && error?.field?.includes('restricted_user_team')) {
                displayErrorToast({
                  title: t('validation_constants.server_error_constant.error_in_form_field_configuration'),
                  subtitle: t('validation_constants.server_error_constant.error_deleted_user_team'),
                });
              } else if (error?.type !== 'AuthorizationError') {
                displayErrorToast({
                  title: t('validation_constants.server_error_constant.error_in_form_field_configuration'),
                  subtitle: `${error.type} | ${error.message}`,
                });
              }
           });
          }
        },
      );

      // When user drag and drop a new field template in between rows;
      if (!fieldData[RESPONSE_FIELD_KEYS.FIELD_UUID] && fieldData.dropType === FORM_LAYOUT_TYPE.ROW) {
        const { path, newRowIdk, layout: upadtedLayout } = getUpdatedLayoutOnRowDrop(sectionData, sectionData?.no_of_columns, fieldData, fieldData_);

        dndFieldBetweenRowsIndex = newRowIdk;
        fieldData.path = path;
        sectionData = cloneDeep(sectionData);
        sectionData.layout = upadtedLayout;

        dropUtil.path = path;

        // update form field order
        const { postData: reorderPostData } = getUpdatedOriginalAndPostSectionData([sectionData], metaData, moduleType);

        try {
          reduxDispatch(updateFormFieldOrder(reorderPostData, moduleType)).then(() => saveAPI());
        } catch (e) { /* empty */ }
      } else {
        saveAPI();
      }
    };

    const onDeleteField = async (fieldData, sectionUUID, deleteUtil, onSuccess, skipDependency = false) => {
      const params = {
        field_uuid: fieldData?.[RESPONSE_FIELD_KEYS.FIELD_UUID],
        ...getModuleIdByModuleType(metaData, moduleType),
      };
      if (skipDependency) params.skip_dependency = true;

      let deleteFieldApiActionThunk = deleteFieldApiThunk;
      if (moduleType === MODULE_TYPES.SUMMARY) {
        delete params.page_id;
        delete params.data_list_id;
        delete params.flow_id;
        deleteFieldApiActionThunk = deleteDashboardPageComponentThunk;
      }

      const response = await deleteFieldApiActionThunk(params, () => {
        dispatch(FORM_ACTIONS.DELETE_FIELD, {
          [RESPONSE_FIELD_KEYS.FIELD_UUID]: fieldData?.[RESPONSE_FIELD_KEYS.FIELD_UUID],
          [RESPONSE_FIELD_KEYS.SECTION_UUID]: sectionUUID,
        });

        // External Source Data Updation - if the deleted field is extranla source field.
        if (
           fieldData?.[RESPONSE_FIELD_KEYS.FIELD_LIST_TYPES] === FIELD_TYPES.TABLE &&
           !isEmpty(fieldData?.[RESPONSE_FIELD_KEYS.AUTO_FILL]?.[RESPONSE_FIELD_KEYS.CHILD_DATA])
          ) {
             const tableData = fields?.[fieldData?.[RESPONSE_FIELD_KEYS.TABLE_UUID]];
             const externalSourceData = activeField?.[RESPONSE_FIELD_KEYS.EXTERNAL_SOURCE_DATA];
             const { EXTERNAL_SOURCE_EXISTING_TABLE_COLUMNS, AUTO_FILL, CHILD_DATA, EXTERNAL_SOURCE_TABLE_COLUMNS } = RESPONSE_FIELD_KEYS;
             if (!isEmpty(tableData) && !isEmpty(externalSourceData)) {
                let esExistingTableColumns = externalSourceData?.[EXTERNAL_SOURCE_EXISTING_TABLE_COLUMNS] || [];
                let esTableColumns = externalSourceData?.[EXTERNAL_SOURCE_TABLE_COLUMNS] || [];

                if (esExistingTableColumns.includes(fieldData?.[AUTO_FILL]?.[CHILD_DATA])) {
                   esExistingTableColumns = esExistingTableColumns.filter((eachUUID) => eachUUID !== fieldData?.[AUTO_FILL]?.[CHILD_DATA]);
                 }

                 if (esTableColumns.includes(fieldData?.[AUTO_FILL]?.[CHILD_DATA])) {
                   esTableColumns = esTableColumns.filter((eachUUID) => eachUUID !== fieldData?.[AUTO_FILL]?.[CHILD_DATA]);
                 }

                 externalSourceData[EXTERNAL_SOURCE_EXISTING_TABLE_COLUMNS] = esExistingTableColumns;
                 externalSourceData[EXTERNAL_SOURCE_TABLE_COLUMNS] = esTableColumns;
                 tableData[RESPONSE_FIELD_KEYS.EXTERNAL_SOURCE_DATA] = externalSourceData;

                 dispatch(FORM_ACTIONS.UPDATE_ACTIVE_FIELD, {
                  data: { [RESPONSE_FIELD_KEYS.EXTERNAL_SOURCE_DATA]: externalSourceData },
                 });

                 dispatch(FORM_ACTIONS.SAVE_FIELD_LIST, {
                  fields: { [fieldData?.[RESPONSE_FIELD_KEYS.TABLE_UUID]]: tableData },
                  sectionUUID,
                 });
             }
          }

        // Field Re-Order Api for new field.
        const [index, path_] = getPathAndIndex(deleteUtil?.path);
        const currentSection = sections.find((section) => section[REQUEST_FIELD_KEYS.SECTION_UUID] === sectionUUID);

        // if (isEmpty(currentSection)) return;

        const updatedLayout = deleteLayout(
            cloneDeep(currentSection?.layout),
            path_ || EMPTY_STRING,
            [],
            index,
        );
        const updatedSection = { ...currentSection, layout: updatedLayout };
        const extraRowAddedSection = updateLayoutBasedOnActionAndPath(updatedSection, updatedSection?.no_of_columns, path_, LAYOUT_ACTIONS.DELETE_EMPTY_ROW);
        const isChanged = JSON.stringify(updatedLayout) !== JSON.stringify(extraRowAddedSection?.layout);
        const { postData: reorderPostData } = getUpdatedOriginalAndPostSectionData([extraRowAddedSection], metaData, moduleType);
        // const [extraRowAddedSection, reorderPostData, isChanged] = constructReorderedFieldForMultipleSection([updatedSection], metaData, moduleType, LAYOUT_ACTIONS.DELETE_EMPTY_ROW);

         if (isChanged) {
            // Api call to reorder fields across section and multiple sections.
          reduxDispatch(updateFormFieldOrder(reorderPostData, moduleType)).then(() => {
            dispatch(FORM_ACTIONS.UPDATE_SECTION, { sectionData: extraRowAddedSection, sectionUUID });
          });
         } else {
           dispatch(FORM_ACTIONS.UPDATE_SECTION, { sectionData: extraRowAddedSection, sectionUUID });
         }

        onSuccess?.();
        toastPopOver({
          title: 'Field deleted successfully',
          toastType: EToastType.info,
          toastPosition: EToastPosition.BOTTOM_LEFT,
        });
      });
      const error_type = get(response, [0, 'type'], EMPTY_STRING);
      setDependencyData({});
      if (!isEmpty(response)) {
        if (error_type === 'someone_editing') {
          switch (moduleType) {
            case MODULE_TYPES.TASK:
              taskUpdateSomeoneIsEditingPopover(response[0].message);
            break;
            case MODULE_TYPES.FLOW:
              flowUpdateSomeoneIsEditingPopover(response[0].message);
            break;
            case MODULE_TYPES.DATA_LIST:
              datalistUpdateSomeoneIsEditingPopover(response[0].message);
            break;
            default:
            break;
          }
        } else if (
          response.length &&
          response[0].validation_message &&
          response[0].validation_message ===
          'cyclicDependency'
        ) {
          toastPopOver({
            title: t('error_popover_status.cyclic_dependency'),
            subtitle: t('error_popover_status.cannot_set_rule'),
            toastType: EToastType.error,
            toastPosition: EToastPosition.BOTTOM_LEFT,
          });
        } else if (error_type === 'field_dependency') {
          setDependencyData(response);
        } else if (response.length > 0) {
          response.forEach((error) => {
            if (error?.type !== 'AuthorizationError') {
              displayErrorToast({
                title: t('validation_constants.server_error_constant.error_in_form_field_configuration'),
                subtitle: `${error.type} | ${error.message}`,
              });
            }
          });
        }
      }
    };

    // All Fields and Table
    const getFormFieldConfiguration = () => {
      if (isEmpty(activeField)) return null;

      const sectionData = sections.find((section) => section[REQUEST_FIELD_KEYS.SECTION_UUID] === sectionUUID);

      return (
          <FieldConfiguration
              metaData={metaData}
              fields={fields}
              fieldData={activeField}
              sectionUUID={sectionUUID}
              overAllLayout={sectionData?.layout || []}
              onSave={onSaveHandler}
              onDelete={onDeleteField}
              dispatch={dispatch}
              moduleType={moduleType}
              noOfFields={Object.keys(fields).length || 0}
              dependencyData={dependencyData}
              setDependencyData={setDependencyData}
          />
      );
    };

    // Table Column
    const getColumnFieldConfiguration = () => {
         if (isEmpty(activeField?.activeColumn)) return null;
         const externalRule = activeField?.[REQUEST_FIELD_KEYS.EXTERNAL_SOURCE_DATA] ?
         {
          [RESPONSE_FIELD_KEYS.SOURCE]: activeField?.[REQUEST_FIELD_KEYS.EXTERNAL_SOURCE_DATA]?.[RESPONSE_FIELD_KEYS.EXTERNAL_SOURCE_RULE_UUID],
          [RESPONSE_FIELD_KEYS.CHILD_DATA]: activeField?.[REQUEST_FIELD_KEYS.EXTERNAL_SOURCE_DATA]?.[RESPONSE_FIELD_KEYS.EXTERNAL_SOURCE_TABLE_UUID],
         } :
         (activeField?.[RESPONSE_FIELD_KEYS.AUTO_FILL]?.[RESPONSE_FIELD_KEYS.TYPE] === VALUE_CONFIG_TYPES.EXTERNAL_DATA) ?
         activeField?.[RESPONSE_FIELD_KEYS.AUTO_FILL] : {};
         console.log('externalRuleexternalRule', activeField, externalRule);
         return (
           <FieldConfiguration
              metaData={metaData}
              fields={fields}
              tableData={activeField}
              fieldData={activeField?.activeColumn}
              sectionUUID={sectionUUID}
              onSave={onSaveHandler}
              onDelete={onDeleteField}
              dispatch={dispatch}
              moduleType={moduleType}
              noOfFields={Object.keys(fields).length || 0}
              dependencyData={dependencyData}
              setDependencyData={setDependencyData}
              tableUtils={{
                isTableField: true,
                isNew: !activeField?.activeColumn?.[RESPONSE_FIELD_KEYS.FIELD_UUID],
                tableFieldSourceType: TABLE_FIELD_SOURCE_TYPE.INLINE,
                validations: activeField?.[RESPONSE_VALIDATION_KEYS.VALIDATION_DATA],
                externalSourceRule: externalRule,

              }}
           />
         );
    };

    // box layout
    const getActiveLayout = () => {
      if (isEmpty(activeLayout)) return null;

      const saveLayout = (layout) => {
        const { path, sectionUUID, layout: existingLayout } = activeLayout;
        const section = sections.find((s) => s.section_uuid === sectionUUID);

        const layoutUpdateFn = !isEmpty(existingLayout) ? replaceLayout : addLayout;
        const [index, path_] = getPathAndIndex(path);
        const updatedLayout = layoutUpdateFn(
          cloneDeep(section.layout),
          path_ || EMPTY_STRING,
          [],
          index,
          layout,
        );
        const currentSection = { ...section, layout: updatedLayout };
        const extraRowAddedSection = updateLayoutBasedOnActionAndPath(
                currentSection, section?.no_of_columns, path_, LAYOUT_ACTIONS.ADD_EXTRA_ROW);
        const { postData: reorderPostData } = getUpdatedOriginalAndPostSectionData([extraRowAddedSection], metaData, moduleType);

        reduxDispatch(updateFormFieldOrder(reorderPostData, moduleType)).then(() => {
          dispatch(FORM_ACTIONS.UPDATE_SECTION, { sectionData: extraRowAddedSection, sectionUUID });
          dispatch(FORM_ACTIONS.ACTIVE_LAYOUT_CLEAR);
        });
      };

      const removeLayout = () => {
        const { path, sectionUUID } = activeLayout;
        const currentSection = sections.find((section) => section[REQUEST_FIELD_KEYS.SECTION_UUID] === sectionUUID);
        const [index, path_] = getPathAndIndex(path);
        const updatedLayout = deleteLayout(
            cloneDeep(currentSection?.layout),
            path_ || EMPTY_STRING,
            [],
            index,
        );
        const updatedSection = { ...currentSection, layout: updatedLayout };
        const extraRowAddedSection = updateLayoutBasedOnActionAndPath(updatedSection, updatedSection?.no_of_columns, path_, LAYOUT_ACTIONS.DELETE_EMPTY_ROW);
        console.log('xyz updatedSection', updatedSection, extraRowAddedSection);
        const { postData: reorderPostData } = getUpdatedOriginalAndPostSectionData([extraRowAddedSection], metaData, moduleType);
        reduxDispatch(updateFormFieldOrder(reorderPostData, moduleType)).then(() => {
          dispatch(FORM_ACTIONS.UPDATE_SECTION, { sectionData: extraRowAddedSection, sectionUUID });
          dispatch(FORM_ACTIONS.ACTIVE_LAYOUT_CLEAR);
        });
      };

      return (
        <LayoutConfiguration
          activeLayout={activeLayout}
          dispatch={dispatch}
          saveLayout={saveLayout}
          sections={sections}
          removeLayout={removeLayout}
        />
      );
    };

    // Table External Source Column.
    const getExternalSourceColumnConfiguration = () => {
      if (isEmpty(activeField?.activeExternalSourceData)) return null;
      return (
        <ExternalSourceColumnConfiguration
           metaData={metaData}
           externalConfigurationData={activeField?.activeExternalSourceData}
           sectionUUID={sectionUUID}
           onSave={onSaveHandler}
          //  onDelete={onDeleteField}
            tableData={activeField}
           dispatch={dispatch}
           moduleType={moduleType}
           tableUtils={{
            isTableField: true,
            isNew: !activeField?.activeExternalSourceData?.[RESPONSE_FIELD_KEYS.FIELD_UUID],
            tableFieldSourceType: TABLE_FIELD_SOURCE_TYPE.EXTERNAL,
          }}
        />
      );
    };

    const getImportForm = () => {
      if (!isImportForm) return null;

      const onSuccess = (allSections, fields) => {
        setShowImportForm(false);
        dispatch(FORM_ACTIONS.BULK_UPLOAD_FIELDS, { fields });
        dispatch(FORM_ACTIONS.UPDATE_SECTIONS, { sections: allSections });
      };

      return (
        <ImportForm
          allFields={fields}
          metaData={metaData}
          moduleType={moduleType}
          onCloseClick={() => setIsImportForm(false)}
          dispatch={dispatch}
          // section={sections?.[0]}
          sections={sections}
          isImportSection
          isImportForm
          onSuccess={onSuccess}
          cols={sections?.[0]?.no_of_columns || COLUMN_LAYOUT.TWO}
          type={IMPORT_TYPES.SECTION}
        />
      );
    };

   return (
    <div className={cx(gClasses.BackgroundWhite, styles.FormBodyContainer, !isEmpty(validationMessage) && gClasses.BorderNoneImportant, formType === FORM_TYPE.READ_ONLY_CREATION_FORM && gClasses.Opacity7)}>
      {isFlow &&
        <Chip
          text={FORM_CONFIG_STRINGS(t).CHIP.FORM_BODY}
          textColor="#217CF5"
          backgroundColor="#EBF4FF"
          className={cx(styles.FormBodyChip, gClasses.CenterVH)}
        />
      }
      {getFormFieldConfiguration()}
      {getColumnFieldConfiguration()}
      {getExternalSourceColumnConfiguration()}
      {getImportForm()}
      {getActiveLayout()}
      {showImportForm ?
        <div className={cx(styles.CreateImport)}>
          <button className={styles.CreateImportFormBtn} onClick={() => setIsImportForm(true)}>
              <DownloadDashboardIcon />
              <Text content={FORM_BODY.IMPORT_EXISTING_FORM} className={styles.Title} size={ETextSize.MD} />
          </button>
          <button className={styles.CreateImportFormBtn} onClick={() => setShowImportForm(false)}>
              <PlusIconBlueNew />
              <Text content={FORM_BODY.CREATE_FORM} className={styles.Title} size={ETextSize.MD} />
          </button>
        </div>
        :
        <Sections
          metaData={metaData}
          formType={formType || FORM_TYPE.CREATION_FORM}
          sections={sections}
          fields={fields}
          formVisibility={formVisibility}
          validationMessage={validationMessage}
          onDropHandler={onDropHandler}
          dispatch={dispatch}
          moduleType={moduleType}
          userProfileData={userProfileData}
        />
      }
    </div>
   );
}

export default FormBody;
