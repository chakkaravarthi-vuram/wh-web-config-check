import React, { useState } from 'react';
import cx from 'classnames/bind';
import { useTranslation } from 'react-i18next';
import gClasses from 'scss/Typography.module.scss';
import AddIcon from 'assets/icons/AddIcon';
import Dropdown from 'components/form_components/dropdown/Dropdown';
import { EMPTY_STRING, VALUE_REQUIRED_ERROR } from 'utils/strings/CommonStrings';
import { cloneDeep, get, isEmpty, isUndefined, has } from 'utils/jsUtility';
// import DeleteMappingIcon from 'assets/icons/parallel_flow/DeleteMappingIcon';
import StaticValue from 'components/static_value/StaticValue';
import { FIELD_TYPES } from 'components/form_builder/FormBuilder.strings';
import HelperMessage, { HELPER_MESSAGE_TYPE } from 'components/form_components/helper_message/HelperMessage';
import { ARIA_ROLES, BS } from 'utils/UIConstants';
import DeleteIconV2 from 'assets/icons/form_fields/DeleteIconV2';
import styles from './FieldMapping.module.scss';
import { FIELD_MAPPING_ERRORS, MAPPING_CONSTANTS } from './FieldMapping.constants';
import { FIELD_MAPPING_TYPES, FLOW_TRIGGER_CONSTANTS } from '../TriggerConfiguration.constants';
import { getOptionListForStaticValue } from '../../../containers/edit_flow/step_configuration/StepConfiguration.utils';

function FieldMapping(props) {
    const { t } = useTranslation();
    const {
        onAddNewMapping,
        trigger_mapping,
        deleteCurrentMapping,
        parentFlowFieldList,
        childFlowFieldList,
        updateMappingInfo,
        errorList,
        // onLoadMoreParentFlowFields,
        // onLoadMoreChildFlowFields,
        // parentFieldsTotalCount,
        // childFieldsTotalCount,
        onParentFieldListSearchInputChangeHandler,
        onChildFieldListSearchInputChangeHandler,
        onChangeStaticValue,
        parentFlowName,
        parentId,
        entityId,
        entityUuid,
        entity,
        documentsType,
        onParentFieldListClick,
        onChildFieldListClick,
        isDataListShortcut = false,
        childFlowName,
        loadingParentMappingFields,
        loadingChildMappingFields,
        document_details,
        setFileUploadStatus,
    } = props;
    let tableFieldRowIndices = [];

    const [systemFieldsSearchText, setSystemFieldsSearchText] = useState(EMPTY_STRING);

    const { CHILD_FIELD_MAPPING, VALUE_TYPE, PARENT_FIELD_MAPPING, HEADERS, VALUE_TYPE_OPTION_LIST,
        TRIGGER_MAPPING, STATIC_VALUE, FIELD_MAPPING, DATA_LIST_ENTRY_MAPPING } = MAPPING_CONSTANTS;
    const ChildMappingHeader = `${t(HEADERS.FIELD_MAPPING_TEXT)} ${childFlowName} `;
    const ParentMappingHeader = `${t(HEADERS.FIELD_MAPPING_TEXT)} ${parentFlowName} `;
    console.log('child headerA2121sa', ChildMappingHeader, 'pheader', ParentMappingHeader, 'triggerMapping', trigger_mapping);

    const { CURRENCY_TYPE_REQUIRED, CURRENCY_VALUE_REQUIRED } = FIELD_MAPPING_ERRORS;
    const TABLE_HEADERS = [
        ChildMappingHeader,
        t(HEADERS.VALUE_TYPE),
        ParentMappingHeader,
        EMPTY_STRING,
    ];

    const getErrors = (error, mappingIndex, errorId) => {
        const fieldType = get(trigger_mapping, [mappingIndex, 'child_field_details', 'field_type']);
        if (fieldType === FIELD_TYPES.CURRENCY) {
            if (error.includes('currency_type')) return t(CURRENCY_TYPE_REQUIRED);
            if (error.includes('value')) return t(CURRENCY_VALUE_REQUIRED);
            return error;
        } else if (fieldType === FIELD_TYPES.DATETIME) {
            if (error.includes('value')) return VALUE_REQUIRED_ERROR;
            return error;
        } else if (fieldType === FIELD_TYPES.LINK) {
            if (error.includes('valid')) {
                const linkError = {};
                const errorIdIndices = errorId.split(',');
                const linkFieldErrorId = `${MAPPING_CONSTANTS.STATIC_VALUE.ID},${errorIdIndices[3]},${errorIdIndices[4]}`;
                linkError[linkFieldErrorId] = error;
                return linkError;
            }
            if ((error.includes('Link') && error.includes('required')) || error.includes('at least')) {
                const linkError = {};
                linkError[MAPPING_CONSTANTS.STATIC_VALUE.ID] = error;
                return linkError;
            }
            return error;
        }
        return error;
    };
    const getErrorMessage = (_id, idk = -1, returnErrorIfErrorListIncludesId = false) => {
        console.log('getErrorMessageerrorList',
        errorList,
         _id,
         errorList[_id],
         );
        if (!returnErrorIfErrorListIncludesId) {
            if (errorList && !isEmpty(errorList)) {
                let id = _id;
                if (id === CHILD_FIELD_MAPPING.ID) id = 'child_field_uuid';
                if (id === PARENT_FIELD_MAPPING.ID) id = 'parent_field_uuid';
            if (([CHILD_FIELD_MAPPING.ID, VALUE_TYPE.ID, PARENT_FIELD_MAPPING.ID]).includes(_id) && idk >= 0) {
                return errorList[`${TRIGGER_MAPPING},${idk},${_id}`] || errorList[`${TRIGGER_MAPPING},${idk},${id}`] || errorList[_id];
            } else {
                return errorList[`${TRIGGER_MAPPING},${idk},${_id}`] || errorList[`${TRIGGER_MAPPING},${idk},${id}`] || errorList[_id];
            }
            }
        } else {
            const errors = [];
            Object.keys(errorList).forEach((errorId) => {
                if (errorId.includes(_id)) {
                    errors.push(getErrors(errorList[errorId], idk, errorId));
                }
              });
            console.log('return static errors', errors);
            return errors[0] || EMPTY_STRING;
          }
        return null;
      };

      console.log(parentFlowFieldList, loadingChildMappingFields, 'kjkljklkk');

    const constructSubProcessMapping = (trigger_mapping, isParent, parentMappingIndex, childTableDetails = {}, parentTableDetails = {}) => {
        let content = [];
        if (!isEmpty(trigger_mapping)) {
            if (isParent) tableFieldRowIndices = [];
          content = trigger_mapping.map((eachMapping, mappingIndex) => {
            const {
                child_field_details = {},
                child_table_details = {},
                parent_field_details = {},
                parent_table_details = {},
                field_mapping = [],
                value_type = FIELD_MAPPING_TYPES.DYNAMIC,
            } = eachMapping;
            const childFieldId = isUndefined(parentMappingIndex) ? CHILD_FIELD_MAPPING.ID :
            `${FIELD_MAPPING.ID},${mappingIndex},${CHILD_FIELD_MAPPING.ID}`;
            const parentFieldId = isUndefined(parentMappingIndex) ? PARENT_FIELD_MAPPING.ID :
            `${FIELD_MAPPING.ID},${mappingIndex},${PARENT_FIELD_MAPPING.ID}`;
            const valueId = isUndefined(parentMappingIndex) ? VALUE_TYPE.ID :
            `${FIELD_MAPPING.ID},${mappingIndex},${VALUE_TYPE.ID}`;
            const staticValueId = isUndefined(parentMappingIndex) ? `${TRIGGER_MAPPING.ID},${mappingIndex},static_value` :
            `${FIELD_MAPPING.ID},${mappingIndex},static_value'}`;
            const valueOptionList = VALUE_TYPE_OPTION_LIST(t).map((eachOption) => {
                return {
                    ...eachOption,
                    disabled: (get(child_field_details, ['field_type'], FIELD_TYPES.SINGLE_LINE) ===
                              FIELD_TYPES.USER_PROPERTY_PICKER ||
                            //   get(child_field_details, ['field_type'], FIELD_TYPES.SINGLE_LINE) ===
                            //   FIELD_TYPES.USER_TEAM_PICKER ||
                            //   get(child_field_details, ['field_type'], FIELD_TYPES.SINGLE_LINE) ===
                            //   FIELD_TYPES.DATA_LIST ||
                              get(child_field_details, ['field_type'], FIELD_TYPES.SINGLE_LINE) ===
                              FIELD_TYPES.DATA_LIST_PROPERTY_PICKER
                            //   get(child_field_details, ['field_type'], FIELD_TYPES.SINGLE_LINE) ===
                            //   FIELD_TYPES.SCANNER ||
                            //   get(child_field_details, ['field_type'], FIELD_TYPES.SINGLE_LINE) ===
                            //   FIELD_TYPES.INFORMATION
                              ) && eachOption.value === 'static',
                };
            });
            const fieldMappingErrors = getErrorMessage(
                `${TRIGGER_MAPPING},${mappingIndex},${FIELD_MAPPING.ID}`,
                mappingIndex);
            if (isDataListShortcut &&
                (get(child_field_details, ['field_type'], EMPTY_STRING) === FIELD_TYPES.DATA_LIST) &&
                (get(child_field_details, ['data_list_details', 'data_list_uuid'], EMPTY_STRING) === entityUuid)) {
                    console.log('check detailscheck detailscheck details', entityUuid, child_field_details, parentId);
                    valueOptionList.push(DATA_LIST_ENTRY_MAPPING);
                }
                const isTableField = has(child_table_details, ['table_name']);
                if (isParent && isTableField) tableFieldRowIndices.push(mappingIndex);
                const hasChild = (!isEmpty(get(child_table_details, ['table_uuid'], EMPTY_STRING)) ||
                !isEmpty(get(parent_table_details, ['table_uuid'], EMPTY_STRING)));

              let parentFlowFields = [];
              let parentErrorMessage = null;
              let parentHideErrorMessage = null;
              let systemFieldSearch = null;

              if (value_type === FIELD_MAPPING_TYPES.SYSTEM) {
                parentErrorMessage = getErrorMessage(isUndefined(parentMappingIndex) ? `${TRIGGER_MAPPING},${mappingIndex},parent_system_field` : `${TRIGGER_MAPPING},${parentMappingIndex},${FIELD_MAPPING.ID},${mappingIndex},parent_system_field`);
                if (isEmpty(parentErrorMessage) || !parentErrorMessage) parentErrorMessage = getErrorMessage(isUndefined(parentMappingIndex) ? `${TRIGGER_MAPPING},${mappingIndex},${PARENT_FIELD_MAPPING.ID}` : `${TRIGGER_MAPPING},${parentMappingIndex},${FIELD_MAPPING.ID},${mappingIndex},parent_field_uuid`);
                parentHideErrorMessage = !parentErrorMessage;
                if (isDataListShortcut) {
                    parentFlowFields = FLOW_TRIGGER_CONSTANTS.DATALIST_SYSTEM_FIELD_OPTIONS_LIST(t);
                } else {
                    parentFlowFields = FLOW_TRIGGER_CONSTANTS.FLOW_SYSTEM_FIELD_OPTIONS_LIST(t);
                }
                if (!isEmpty(systemFieldsSearchText)) parentFlowFields = parentFlowFields?.filter((field) => field?.optionType !== 'Title' && field?.label?.toLowerCase()?.includes(systemFieldsSearchText?.toLowerCase()));
                systemFieldSearch = (value) => setSystemFieldsSearchText(value);
              } else {
                parentErrorMessage = getErrorMessage(isUndefined(parentMappingIndex) ? parentFieldId : `${TRIGGER_MAPPING},${parentMappingIndex},${FIELD_MAPPING.ID},${mappingIndex},parent_field_uuid`, mappingIndex);
                parentHideErrorMessage = !getErrorMessage(isUndefined(parentMappingIndex) ? parentFieldId : `${TRIGGER_MAPPING},${parentMappingIndex},${FIELD_MAPPING.ID},${mappingIndex},parent_field_uuid`, mappingIndex);
                parentFlowFields = parentFlowFieldList;
                systemFieldSearch = (value, isSearch = false) => {
                    console.log('parentMappingIndexLSearchParent', parentMappingIndex);
                    !isUndefined(parentMappingIndex) ?
                        onParentFieldListSearchInputChangeHandler(value, isSearch, get(parentTableDetails, ['table_uuid'], EMPTY_STRING)) :
                        onParentFieldListSearchInputChangeHandler(value, isSearch);
                };
              }

              return (
                  <li className={cx(hasChild && styles.ParentListContainer, styles.ListContainer)}>
                      <div className={BS.D_FLEX}>
                          <div className={styles.ColMid}>
                              <div onBlur={() => {
                                //   console.log('onDropDownBlurChild', event);
                                  !isUndefined(parentMappingIndex) ?
                                    onChildFieldListClick(get(childTableDetails, ['table_uuid'], EMPTY_STRING), parentMappingIndex) :
                                    onChildFieldListClick(EMPTY_STRING, undefined, mappingIndex);
                              }}
                              >
                                  <Dropdown
                                      id={childFieldId}
                                      loadingOptionList={loadingChildMappingFields}
                                      placeholder={t(CHILD_FIELD_MAPPING.PLACEHOLDER)}
                                      selectedValue={child_field_details.label || get(child_table_details, ['table_name'], EMPTY_STRING)}
                                      onChange={(event) =>
                                          updateMappingInfo(
                                              childFieldId,
                                              event,
                                              mappingIndex,
                                              parentMappingIndex,
                                          )
                                      }
                                      optionList={childFlowFieldList}
                                      hideLabel
                                      optionListClassName={styles.DropdownOption}
                                      innerClassName={cx(styles.Height36, styles.Field)}
                                      showNoDataFoundOption
                                      errorMessage={getErrorMessage(
                                          isUndefined(parentMappingIndex) ? childFieldId :
                                              `${TRIGGER_MAPPING},${parentMappingIndex},${FIELD_MAPPING.ID},${mappingIndex},child_field_uuid`,
                                          mappingIndex)}
                                      hideMessage={!getErrorMessage(
                                          isUndefined(parentMappingIndex) ? childFieldId :
                                              `${TRIGGER_MAPPING},${parentMappingIndex},${FIELD_MAPPING.ID},${mappingIndex},child_field_uuid`,
                                          mappingIndex)}
                                      optionContainerClassName={styles.OptionContainer}
                                      strictlySetSelectedValue
                                      setSelectedValue
                                      enableSearch
                                      onSearchInputChange={(value, isSearch = false) => {
                                        console.log('parentMappingIndexLSearchChild', parentMappingIndex);
                                          !isUndefined(parentMappingIndex) ?
                                              onChildFieldListSearchInputChangeHandler(value, isSearch, get(childTableDetails, ['table_uuid'], EMPTY_STRING)) :
                                              onChildFieldListSearchInputChangeHandler(value, isSearch);
                                      }}
                                      hideDropdownListLabel
                                      isRequired
                                      disableFocusFilter
                                      loadData={() => {
                                          console.log('child_table_details click', childTableDetails, 'parentMappingIndexLChild', parentMappingIndex);
                                          !isUndefined(parentMappingIndex) ?
                                              onChildFieldListClick(get(childTableDetails, ['table_uuid'], EMPTY_STRING), parentMappingIndex) :
                                              onChildFieldListClick(EMPTY_STRING, undefined, mappingIndex);
                                      }}
                                  />
                              </div>
                          </div>
                          <div className={styles.ColMid}>
                              <Dropdown
                                  id={valueId}
                                  placeholder={VALUE_TYPE.OPERATION}
                                  selectedValue={value_type}
                                  onChange={(event) =>
                                      updateMappingInfo(
                                          valueId,
                                          event,
                                          mappingIndex,
                                          parentMappingIndex,
                                      )
                                  }
                                  optionList={valueOptionList}
                                  hideLabel
                                  disabled={isTableField}
                                  innerClassName={cx(styles.Height36, styles.Field)}
                                  showNoDataFoundOption
                                  errorMessage={EMPTY_STRING}
                                  optionContainerClassName={styles.OptionContainer}
                              />
                          </div>
                          <div className={styles.ColMid}>
                              {
                                  (value_type === FIELD_MAPPING_TYPES.DYNAMIC || value_type === FIELD_MAPPING_TYPES.SYSTEM) ?
                                      (
                                          <div onBlur={(event) => {
                                                console.log('onDropDownBlurChild', event);
                                                !isUndefined(parentMappingIndex) ?
                                                    onParentFieldListClick(get(parentTableDetails, ['table_uuid'], EMPTY_STRING), parentMappingIndex)
                                                : onParentFieldListClick();
                                          }}
                                          >
                                              <Dropdown
                                                  id={parentFieldId}
                                                  loadingOptionList={loadingParentMappingFields}
                                                  placeholder={isDataListShortcut ? t(PARENT_FIELD_MAPPING.DL_PLACEHOLDER) : t(PARENT_FIELD_MAPPING.PLACEHOLDER)}
                                                  selectedValue={parent_field_details.label || get(parent_table_details, ['table_name'], EMPTY_STRING)}
                                                  onChange={(event) =>
                                                      updateMappingInfo(
                                                          parentFieldId,
                                                          event,
                                                          mappingIndex,
                                                          parentMappingIndex,
                                                      )
                                                  }
                                                  optionList={parentFlowFields}
                                                  hideLabel
                                                  innerClassName={cx(styles.Height36, styles.Field)}
                                                  optionListClassName={styles.DropdownOption}
                                                  showNoDataFoundOption
                                                  errorMessage={parentErrorMessage}
                                                  hideMessage={parentHideErrorMessage}
                                                  optionContainerClassName={styles.OptionContainer}
                                                  strictlySetSelectedValue
                                                  setSelectedValue
                                                  enableSearch
                                                  onSearchInputChange={systemFieldSearch}
                                                  hideDropdownListLabel
                                                  isRequired
                                                  disableFocusFilter
                                                  loadData={() => {
                                                    console.log('parentMappingIndexL', parentMappingIndex, 'parentTableDetails', parentTableDetails);
                                                      !isUndefined(parentMappingIndex) ?
                                                        onParentFieldListClick(get(parentTableDetails, ['table_uuid'], EMPTY_STRING), parentMappingIndex) :
                                                        onParentFieldListClick();
                                                  }}
                                              />
                                          </div>
                                      ) : (value_type === FIELD_MAPPING_TYPES.STATIC) ?
                                          (
                                            <div
                                            className={get(child_field_details, ['field_type'], FIELD_TYPES.SINGLE_LINE)
                                            === FIELD_TYPES.SCANNER && BS.D_FLEX
                                            }
                                            >
                                              <StaticValue
                                                  childFieldDetails={child_field_details}
                                                  fieldType={get(child_field_details, ['field_type'], FIELD_TYPES.SINGLE_LINE)}
                                                  onStaticValueChange={(value) => {
                                                      console.log('staticValueId', staticValueId, parentMappingIndex, value);
                                                      onChangeStaticValue(value, mappingIndex, parentMappingIndex);
                                                  }}
                                                  staticValue={get(child_field_details, ['field_type'], FIELD_TYPES.SINGLE_LINE) === FIELD_TYPES.YES_NO ?
                                                  eachMapping.static_value : eachMapping.static_value || EMPTY_STRING}
                                                  staticValueError={getErrorMessage(
                                                      isUndefined(parentMappingIndex) ?
                                                          `${TRIGGER_MAPPING},${mappingIndex},${STATIC_VALUE.ID}` :
                                                          `${TRIGGER_MAPPING},${parentMappingIndex},${FIELD_MAPPING.ID},${mappingIndex},${STATIC_VALUE.ID}`,
                                                      mappingIndex,
                                                      true)}
                                                  dropdownOptionList={getOptionListForStaticValue(child_field_details)}
                                                  parentId={parentId}
                                                  entityId={get(document_details, ['entity_id']) || entityId}
                                                  entityUuid={entityUuid}
                                                  refUuid={get(document_details, ['ref_uuid'])}
                                                  entity={entity}
                                                  documentsType={documentsType}
                                                  id={staticValueId}
                                                  setFileUploadStatus={setFileUploadStatus}
                                              />
                                            </div>
                                          ) : null
                              }
                          </div>
                          <div className={cx(styles.ColMini, gClasses.CenterV)}>
                              <div className={cx(styles.DeleteIconContainer, gClasses.ClickableElement, gClasses.CursorPointer, BS.TEXT_CENTER, BS.JC_CENTER, BS.ALIGN_ITEM_CENTER, BS.D_FLEX)}>
                                  <DeleteIconV2
                                      className={styles.DeleteIcon}
                                      onClick={() => deleteCurrentMapping(mappingIndex, parentMappingIndex)}
                                  />
                              </div>
                          </div>
                      </div>
                      {
                          (!isEmpty(get(child_table_details, ['table_uuid'], EMPTY_STRING)) ||
                              !isEmpty(get(parent_table_details, ['table_uuid'], EMPTY_STRING))) && (
                              <div className={styles.ChildContainer}>
                                  {
                                      (!isEmpty(field_mapping)) &&
                                      <ul>
                                          {constructSubProcessMapping(
                                              (field_mapping || []), false, mappingIndex, child_table_details, parent_table_details)}
                                      </ul>
                                  }
                                  <button
                                      className={cx(gClasses.ClickableElement, gClasses.MB8, !isEmpty(field_mapping) && gClasses.MT10, styles.AddBtn)}
                                      onClick={() => onAddNewMapping(mappingIndex)}
                                  >
                                      <AddIcon className={cx(gClasses.MR3, styles.AddIcon)} />
                                      <span className={cx(gClasses.FTwo13BlueV39, gClasses.FontWeight500)}>
                                          {t(MAPPING_CONSTANTS.ADD_COLUMN)}
                                      </span>
                                  </button>
                                 {!isEmpty(fieldMappingErrors) &&
                                  <HelperMessage
                                    message={fieldMappingErrors}
                                    type={HELPER_MESSAGE_TYPE.ERROR}
                                    // id={messageId}
                                    className={styles.ErrorContainer}
                                    noMarginBottom
                                    // ariaLabelHelperMessage={ariaLabelHelperMessage}
                                    // ariaHidden={!helperAriaHidden}
                                    role={ARIA_ROLES.ALERT}
                                  />
                                 }
                              </div>
                          )
                      }
                  </li>
              );
        });
        }
        return content;
    };

    console.log('sub_process_mappingsub_process_mapping', constructSubProcessMapping());

    return (
        <>
            <div className={cx(gClasses.MT20, styles.MappingTItle, isEmpty(trigger_mapping) && gClasses.MB16)}>
                    {t(MAPPING_CONSTANTS.MAPPING_TITLE)}
            </div>
            {
                !isEmpty(trigger_mapping) &&
                <ul>
                        <li>
                            <div className={BS.D_FLEX}>
                            {TABLE_HEADERS.map((eachHeader) => (
                                <div className={cx(styles.Header, gClasses.LabelStyle)}>{eachHeader}</div>
                            ))}
                            </div>
                        </li>
                    {constructSubProcessMapping(cloneDeep(trigger_mapping), true)}
                </ul>
            }
            <button className={cx(gClasses.ClickableElement, !isEmpty(trigger_mapping) && gClasses.MT10, styles.AddBtn)} onClick={() => onAddNewMapping()}>
                <AddIcon className={cx(gClasses.MR3, styles.AddIcon)} />
                <span className={cx(gClasses.FTwo13BlueV39, gClasses.FontWeight500)}>
                    {isEmpty(trigger_mapping) ? t(MAPPING_CONSTANTS.ADD_FIELD)
                    : t(MAPPING_CONSTANTS.ADD_MAPPING)}
                </span>
            </button>
        </>
      );
}

export default FieldMapping;
