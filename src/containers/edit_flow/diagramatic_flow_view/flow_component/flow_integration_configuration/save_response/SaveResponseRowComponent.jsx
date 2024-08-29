import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import cx from 'classnames/bind';
import { withRouter } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getIntegrationMappingFields } from 'redux/actions/FlowStepConfiguration.Action';
import { updateFlowDataChange } from 'redux/reducer/EditFlowReducer';
import Dropdown from 'components/form_components/dropdown/Dropdown';
import Input from 'components/form_components/input/Input';
import { BS } from 'utils/UIConstants';
import gClasses from 'scss/Typography.module.scss';
import { EMPTY_STRING } from 'utils/strings/CommonStrings';
import ButtonDropdown from 'components/button_dropdown/ButtonDropdown';
import { keydownOrKeypessEnterHandle, validate } from 'utils/UtilityFunctions';
import { getGroupedFieldListForMapping, FEILD_LIST_DROPDOWN_TYPE } from 'containers/edit_flow/step_configuration/StepConfiguration.utils';
import { DIRECT_FIELD_LIST_TYPE, TABLE_FIELD_LIST_TYPE, constructJoiObject, FIELD_NAME_VALIDATION } from 'utils/ValidationConstants';
import DeleteIconV2 from 'assets/icons/form_fields/DeleteIconV2';
import { cloneDeep, get, isEmpty } from 'utils/jsUtility';
import styles from '../integration_request_configuration/IntegrationRequestConfiguration.module.scss';
import { REQUEST_CONFIGURATION_STRINGS } from '../integration_request_configuration/IntegrationRequestConfiguration.utils';
import NestedDropdown from '../../../../../../components/nested_dropdown/NestedDropdown';
import { generateEventTargetObject } from '../../../../../../utils/generatorUtils';
import { NO_DATA_FOUND_LIST } from '../../../../step_configuration/configurations/Configuration.strings';
import { INTEGRATION_CONSTANTS } from '../FlowIntegrationConfiguration.constants';

let cancelToken = null;
const getCancelToken = (token) => {
  cancelToken = token;
};

function SaveResponseRowComponent(props) {
    const { currentRow = {}, onChangeHandlers, path, error_list = {}, flowData,
    onGetAllFieldsByFilter, updateFlowData, parentTableUuid } = props;
    const { responseLstAllFields = [], allresponseLstAllFields = [], mappedIntegrationResponseFields = [], activeIntegrationData } = cloneDeep(flowData);
    const { ADD_EVENT } = REQUEST_CONFIGURATION_STRINGS;
    const activeMLIntegrationData = cloneDeep(flowData.activeMLIntegrationData);

  const currentIntegrationStep = cloneDeep(activeIntegrationData);
  console.log('currentRowSaveResponse', currentRow, 'activeEvent', currentIntegrationStep?.event_details, 'currentIntegrationStep', currentIntegrationStep);

    const [isForceDropDownClose, setonForceDropdownClose] = useState(false);
    const [responseKeyOptionList, setResponseKeyOptionList] = useState([]);
    const [filteredResponseKeyOptionList, setFilteredResponseKeyOptionList] = useState([]);
    const [keySearchValue, setKeySearchValue] = useState([]);
    const [backButtonDetails, setBackButtonDetails] = useState({});

    const { t } = useTranslation();
    const [fieldTypeList, setFieldTypeList] = useState(currentRow?.response_type === 'object' && !path.includes('column_mapping') ?
    [...ADD_EVENT.SAVE_RESPONSE.PARENT_ROW_FIELD_TYPES(t), ...ADD_EVENT.SAVE_RESPONSE.PARENT_ROW_NON_CREATE_FIELD_TYPES] :
    [...ADD_EVENT.SAVE_RESPONSE.PARENT_ROW_FIELD_TYPES(t).slice(0, ADD_EVENT.SAVE_RESPONSE.PARENT_ROW_FIELD_TYPES(t).length - 1),
    ...ADD_EVENT.SAVE_RESPONSE.PARENT_ROW_NON_CREATE_FIELD_TYPES]);

    useEffect(() => {
      setFieldTypeList(currentRow?.response_type === 'object' && !path.includes('column_mapping') ?
      [...ADD_EVENT.SAVE_RESPONSE.PARENT_ROW_FIELD_TYPES(t), ...ADD_EVENT.SAVE_RESPONSE.PARENT_ROW_NON_CREATE_FIELD_TYPES] :
      [...ADD_EVENT.SAVE_RESPONSE.PARENT_ROW_FIELD_TYPES(t).slice(0, ADD_EVENT.SAVE_RESPONSE.PARENT_ROW_FIELD_TYPES(t).length - 1),
        ...ADD_EVENT.SAVE_RESPONSE.PARENT_ROW_NON_CREATE_FIELD_TYPES]);
    }, [currentRow?.response_type]);

    useEffect(() => {
      if (get(currentRow, ['new_field'], false)) {
        setFieldTypeList(currentRow?.response_type === 'object' && !path.includes('column_mapping') ?
        ADD_EVENT.SAVE_RESPONSE.PARENT_ROW_FIELD_TYPES(t) :
        ADD_EVENT.SAVE_RESPONSE.PARENT_ROW_FIELD_TYPES(t).slice(0, ADD_EVENT.SAVE_RESPONSE.PARENT_ROW_FIELD_TYPES(t).length - 1));
      }
    }, [get(currentRow, ['new_field'], false)]);

    const getAllFieldsByFilterApi = (searchText = EMPTY_STRING, isSearch = false, table_uuid = EMPTY_STRING, table_name = EMPTY_STRING, keyType = null) => {
      const fieldListDropdownType = (keyType === 'object' && !path.includes('column_mapping')) ? FEILD_LIST_DROPDOWN_TYPE.TABLES : ((parentTableUuid ? FEILD_LIST_DROPDOWN_TYPE.SELECTED_TABLE_FIELDS : FEILD_LIST_DROPDOWN_TYPE.DIRECT));
      setonForceDropdownClose(false);
      console.log('getAllFieldsByFilterApigetAllFieldsByFilterApi',
      currentRow,
      fieldListDropdownType,
      table_name,
      table_uuid,
      responseLstAllFields,
      allresponseLstAllFields,
      !isEmpty(table_name) && isEmpty(table_uuid),
      (isEmpty(table_uuid) && isEmpty(table_name)) || isEmpty(allresponseLstAllFields));
      if (!isEmpty(currentRow?.response_key) && !isEmpty(currentRow?.response_type)) {
        if (!isEmpty(table_name) && isEmpty(table_uuid)) {
          updateFlowData({ responseLstAllFields: [] });
        } else if ((isEmpty(table_uuid) && isEmpty(table_name)) || isEmpty(allresponseLstAllFields)) {
            const paginationData = {
              // search: '',
              page: 1,
              size: 1000,
              // sort_field: '',
              sort_by: 1,
              allowed_field_types: ADD_EVENT.SAVE_RESPONSE_ALLOWED_FIELD_TYPES,
              flow_id: flowData.flow_id,
              include_property_picker: 1,
            };
            if (isSearch && searchText) {
              paginationData.search = searchText;
            }
            if (onGetAllFieldsByFilter) {
              if (cancelToken) cancelToken();
              onGetAllFieldsByFilter(
                paginationData, 'responseLstAllFields', mappedIntegrationResponseFields, fieldListDropdownType, table_uuid, getCancelToken);
            }
          } else {
            updateFlowData({ responseLstAllFields:
            getGroupedFieldListForMapping(table_uuid, allresponseLstAllFields, mappedIntegrationResponseFields, fieldListDropdownType) });
          }
      }
    };

    const onFieldSearch = (search) => {
      if (search) {
        const searchParentFlowFields = responseLstAllFields.filter((field) =>
          field?.disabled || field?.label?.toLowerCase().includes(search.toLowerCase()));
          updateFlowData({ responseLstAllFields: searchParentFlowFields });
      }
    };

    const onFieldTypeSearch = (search) => {
      if (search) {
        const updatedFieldList = fieldTypeList.filter((field) => field?.label?.toLowerCase().includes(search?.toLowerCase()));
        setFieldTypeList(updatedFieldList);
      } else {
        setFieldTypeList(currentRow?.response_type === 'object' && !path.includes('column_mapping') ?
        ADD_EVENT.SAVE_RESPONSE.PARENT_ROW_FIELD_TYPES(t) :
        ADD_EVENT.SAVE_RESPONSE.PARENT_ROW_FIELD_TYPES(t).slice(0, ADD_EVENT.SAVE_RESPONSE.PARENT_ROW_FIELD_TYPES(t).length - 1));
      }
    };

    const createFieldValidation = (newField) => {
      const error = validate(
        { field_name: newField },
        constructJoiObject({ field_name: FIELD_NAME_VALIDATION.required().trim().label('Field Name') }),
        );
        return error?.field_name || EMPTY_STRING;
    };

    console.log('sdfsdf342234234234table_uuid',
    parentTableUuid,
    'parentTable',
    currentRow,
    isEmpty(get(currentRow, ['response_key'], EMPTY_STRING)),
    isEmpty(get(currentRow, ['response_type'], EMPTY_STRING)));
  let backButtonLabel = t(ADD_EVENT.SAVE_RESPONSE.NEW_FIELD_LABEL);
  let createBtnLabel = t(ADD_EVENT.SAVE_RESPONSE.CREATE_NEW_LABEL);
  let primaryButtonLabel = t(ADD_EVENT.SAVE_RESPONSE.CREATE_BTN);
  if (get(currentRow, ['new_field'], false) &&
    !isEmpty((currentRow?.field_details?.label || currentRow?.field_details?.table_name))) {
    backButtonLabel = t(ADD_EVENT.SAVE_RESPONSE.EDIT_FIELD_LABEL);
    createBtnLabel = t(ADD_EVENT.SAVE_RESPONSE.EDIT_FIELD_LABEL);
    primaryButtonLabel = t(ADD_EVENT.SAVE_RESPONSE.UPDATE_BTN);
  }

    // response key mapping

    const getResponseBodyMapping = (responseBodyParam = [], parentObject = {}) => {
      const responseBody = cloneDeep(responseBodyParam);

      return responseBody?.map((eachResponseRow) => {
        const currentValue = isEmpty(parentObject) ? eachResponseRow?.label : `${parentObject?.value}.${eachResponseRow?.label}`;
        const rowObject = { ...eachResponseRow, value: currentValue, parent_label: parentObject?.label };

        if (rowObject?.child_rows?.length) {
          rowObject.is_expand = true;
          rowObject.expand_count = rowObject?.child_rows?.length;
          rowObject.child_rows = getResponseBodyMapping(rowObject?.child_rows, rowObject);
        }

        return rowObject;
      });
    };

    useEffect(() => {
      setResponseKeyOptionList(getResponseBodyMapping(currentIntegrationStep?.response_body));
    }, [currentIntegrationStep?._id]);

    const flowDropdownClearHandler = () => {
      setResponseKeyOptionList(getResponseBodyMapping(currentIntegrationStep?.response_body));
      setBackButtonDetails({});
      setKeySearchValue(EMPTY_STRING);
    };

    const onOptionClickHandler = (option, callback) => {
      onChangeHandlers({
        event: generateEventTargetObject(ADD_EVENT.SAVE_RESPONSE.KEY_INPUT.ID, option?.value, {
          is_response_body: true,
          key_type_event: generateEventTargetObject(ADD_EVENT.SAVE_RESPONSE.KEY_TYPE.ID, option?.type),
          key_type_id: ADD_EVENT.SAVE_RESPONSE.KEY_TYPE.ID,
          key_type_path: path,
        }),
        type: ADD_EVENT.SAVE_RESPONSE.KEY_INPUT.ID,
        path,
      });

      if (callback) callback();
      setKeySearchValue(EMPTY_STRING);
    };

    const onBackBtnClick = () => {
      const { list = [] } = cloneDeep(backButtonDetails);
      const listLength = list?.length;

      if (!listLength) return;

      if (listLength === 1) {
        setResponseKeyOptionList(list[0]);
        setBackButtonDetails({});
      } else {
        const prevList = cloneDeep(list[listLength - 1]);
        setResponseKeyOptionList(prevList);
        const parentLabel = get(prevList, [0, 'parent_label'], EMPTY_STRING);
        setBackButtonDetails({ label: parentLabel, list: list?.slice(0, listLength - 1) });
      }
      setKeySearchValue(EMPTY_STRING);
    };

    const handleSearchChange = (event) => {
      const {
        target: { value = EMPTY_STRING },
      } = event;

      if (!isEmpty(responseKeyOptionList)) {
        const filteredList = responseKeyOptionList?.filter((field) => {
          const loweredLabel = field?.label?.toLowerCase();
          const loweredValue = value?.toLowerCase();
          return loweredLabel?.includes(loweredValue);
        });

        if (isEmpty(filteredList)) {
          setFilteredResponseKeyOptionList(NO_DATA_FOUND_LIST(t));
        } else {
          setFilteredResponseKeyOptionList(filteredList);
        }
      }

      setKeySearchValue(value);
    };

    const expandButtonClick = (e, option) => {
      e.stopPropagation();
      const list = backButtonDetails.list || [];
      setBackButtonDetails({ label: option?.label, list: [...list, responseKeyOptionList] });
      setResponseKeyOptionList(option?.child_rows);
      setKeySearchValue(EMPTY_STRING);
    };

    const keySelectedOption = { label: currentRow?.response_key, value: currentRow?.response_key, type: currentRow?.response_type };

    return (
      <div className={cx(BS.D_FLEX)}>
        <div className={styles.ColMax}>
          {
            isEmpty(currentIntegrationStep?.response_body) ? (
              <div>
                {activeMLIntegrationData?.response_key_option ? (
                  <Dropdown
                  id={ADD_EVENT.SAVE_RESPONSE.KEY_INPUT.ID}
                  optionList={activeMLIntegrationData?.response_key_option}
                  onChange={(e) => {
                    console.log('dropdowneventKeyTypeselector', e?.target?.value);
                      onChangeHandlers({
                        event: e,
                        type: ADD_EVENT.SAVE_RESPONSE.KEY_INPUT.ID,
                        path,
                      });
                    }
                    }
                  selectedValue={currentRow?.response_key}
                  noMarginBottom
                  setSelectedValue
                  hideLabel
                  className={cx(styles.RequestBodyFields, gClasses.MR16)}
                  strictlySetSelectedValue
                  errorMessage={error_list[`${path},${ADD_EVENT.SAVE_RESPONSE.KEY_INPUT.ID}`]}
                  optionListDropDown={styles.OptionListDropDown}
                  disabled={!isEmpty(currentIntegrationStep?.response_body)}
                  />
                ) : (
              <Input
                id={ADD_EVENT.SAVE_RESPONSE.KEY_INPUT.ID}
                className={cx(styles.RequestBodyFields, gClasses.MR16)}
                value={currentRow?.response_key}
                errorMessage={error_list[`${path},${ADD_EVENT.SAVE_RESPONSE.KEY_INPUT.ID}`]}
                hideLabel
                onChangeHandler={(e) =>
                    onChangeHandlers({
                    event: e,
                    type: ADD_EVENT.SAVE_RESPONSE.KEY_INPUT.ID,
                    path,
                  })
                }
              />
              )
              }
              </div>

            ) : (
              <NestedDropdown
                id={ADD_EVENT.SAVE_RESPONSE.KEY_INPUT.ID}
                placeholder={ADD_EVENT.SAVE_RESPONSE.KEY_INPUT.PLACEHOLDER}
                searchBarPlaceholder={ADD_EVENT.SAVE_RESPONSE.KEY_INPUT.SEARCH_FIELDS}
                optionList={!isEmpty(keySearchValue) ? filteredResponseKeyOptionList : responseKeyOptionList}
                selectedOption={keySelectedOption}
                searchValue={keySearchValue}
                outerClassName={gClasses.MR16}
                onBackBtnClick={onBackBtnClick}
                backButtonDetails={backButtonDetails}
                dropdownClearHandler={flowDropdownClearHandler}
                onChange={(_, option, callback) => onOptionClickHandler(option, callback)}
                expandButtonClick={(e, option) => expandButtonClick(e, option)}
                handleSearchChange={(e) => handleSearchChange(e)}
                errorMessage={error_list[`${path},${ADD_EVENT.SAVE_RESPONSE.KEY_INPUT.ID}`]}
                hideMessage={!error_list[`${path},${ADD_EVENT.SAVE_RESPONSE.KEY_INPUT.ID}`]}
                mappingIndex={path}
                valueKey="value"
                enableSearch
              />
            )
          }
        </div>
        <div className={styles.ColMin}>
        <Dropdown
            id={ADD_EVENT.SAVE_RESPONSE.KEY_TYPE.ID}
            optionList={activeMLIntegrationData?.response_type_option ? activeMLIntegrationData.response_type_option : ADD_EVENT.SAVE_RESPONSE.KEY_TYPE.OPTIONS}
            onChange={(e) => {
              console.log('dropdowneventKeyTypeselector', e?.target?.value);
                onChangeHandlers({
                  event: e,
                  type: ADD_EVENT.SAVE_RESPONSE.KEY_TYPE.ID,
                  path,
                });
              }
              }
            selectedValue={currentRow?.response_type}
            noMarginBottom
            setSelectedValue
            hideLabel
            className={cx(styles.RequestBodyFields, gClasses.MR16)}
            strictlySetSelectedValue
            errorMessage={error_list[`${path},${ADD_EVENT.SAVE_RESPONSE.KEY_TYPE.ID}`]}
            optionListDropDown={styles.OptionListDropDown}
            disabled={!isEmpty(currentIntegrationStep?.response_body)}
        />
        </div>
        <div className={cx(styles.ColMax, gClasses.MR16)}>
      <ButtonDropdown
        id={`${ADD_EVENT.SAVE_RESPONSE.FIELD_VALUE.ID}-${path}`}
        footerClass={styles.CreateFieldFooter}
        loadData={() => getAllFieldsByFilterApi(EMPTY_STRING, false, currentRow?.parent_table_uuid, currentRow?.parent_table_name, currentRow?.response_type)}
        className={cx(styles.RequestBodyFields,
          (isEmpty(get(currentRow, ['response_key'], EMPTY_STRING)) ||
        isEmpty(get(currentRow, ['response_type'], EMPTY_STRING))) && styles.Disabled,
        (!isEmpty(activeMLIntegrationData?.response_type_option) && error_list[`${path},${ADD_EVENT.SAVE_RESPONSE.ID}`]) && gClasses.MT12)}
        selectedValue={
            currentRow?.field_details?.label || currentRow?.field_details?.table_name
        }
        setInitialSearchText
        showSelectedFieldTooltip
        initialSearchText={(get(currentRow, ['new_field'], false)) ? (currentRow?.field_details?.label || currentRow?.field_details?.table_name) : EMPTY_STRING}
        initialButtonLabel={t(ADD_EVENT.SAVE_RESPONSE.FIELD_VALUE.PLACEHOLDER)}
        optionList={responseLstAllFields}
        showLabel
        backButtonLabel={backButtonLabel}
        dropdownChangeHandler={(e) => {
          console.log('dropdowneventselector', e?.target?.value, currentRow?.field_value, 'currentRow', currentRow);
          if ((activeMLIntegrationData?.response_type_option)) {
            e.target.field_list_type = INTEGRATION_CONSTANTS.REQUEST_CONFIGURATION.RELATIVE_PATH.VALUE.TYPES.EXPRESSION;
            e?.target?.value !== currentRow?.field_value && onChangeHandlers({
              event: e,
              type: ADD_EVENT.SAVE_RESPONSE.FIELD_VALUE.ID,
              path,
              });
          } else {
          e?.target?.value !== currentRow?.field_value && onChangeHandlers({
            event: e,
            type: ADD_EVENT.SAVE_RESPONSE.FIELD_VALUE.ID,
            path,
            });
          }
        }}
        onOptionSearch={onFieldSearch}
        handleCreateClick={(newField) => {
          console.log('currentRowCreateClick', currentRow);
          onChangeHandlers({
          event: {
            target: {
              field_name: newField,
              ...(currentRow?.field_details?.label) ?
                { label: currentRow.field_details.label }
                : { label: newField },
              ...(currentRow?.field_type !== TABLE_FIELD_LIST_TYPE) ?
              { field_type: currentRow?.field_type, field_list_type: DIRECT_FIELD_LIST_TYPE } :
              { field_list_type: TABLE_FIELD_LIST_TYPE, table_name: newField },
            },
          },
          type: ADD_EVENT.SAVE_RESPONSE.FIELD_VALUE.ID,
          path,
          createNewField: true,
          });
        }}
        createValidation={createFieldValidation}
        searchBarPlaceholder={t(ADD_EVENT.SAVE_RESPONSE.SEARCH_PLACHOLDER)}
        createBtnLabel={createBtnLabel}
        inputPlaceholder={t(ADD_EVENT.SAVE_RESPONSE.INPUT_PLACEHOLDER)}
        secondaryButtonLabel={t(ADD_EVENT.SAVE_RESPONSE.CANCEL_BTN)}
        primaryButtonLabel={primaryButtonLabel}
        errorMessage={error_list[`${path},${ADD_EVENT.SAVE_RESPONSE.ID}`]}
        disabled={isEmpty(get(currentRow, ['response_key'], EMPTY_STRING)) ||
                isEmpty(get(currentRow, ['response_type'], EMPTY_STRING))}
        errorClass={styles.ErrorClass}
        selectedValueClassName={!get(currentRow, ['new_field'], false) && styles.FieldTag}
        noDataText={t(ADD_EVENT.SAVE_RESPONSE.NO_DATA)}
      />
        </div>
        <div className={styles.ColMin}>
            <Dropdown
                id={ADD_EVENT.SAVE_RESPONSE.FIELD_TYPE.ID}
                optionList={fieldTypeList}
                onChange={(e) =>
                  e?.target?.value !== currentRow?.field_type && onChangeHandlers({
                    event: e,
                    type: ADD_EVENT.SAVE_RESPONSE.FIELD_TYPE.ID,
                    path,
                    })
                }
                selectedValue={currentRow?.field_type}
                setSelectedValue
                hideLabel
                className={cx(styles.RequestBodyFields, gClasses.MR16)}
                strictlySetSelectedValue
                errorMessage={error_list[`${path},${ADD_EVENT.SAVE_RESPONSE.FIELD_TYPE.ID}`]}
                optionListDropDown={styles.OptionListDropDown}
                isForceDropDownClose={isForceDropDownClose}
                placeholder={t(ADD_EVENT.SAVE_RESPONSE.FIELD_TYPE.PLACEHOLDER)}
                showNoDataFoundOption
                hideDropdownListLabel
                isRequired
                disableFocusFilter
                noDataFoundOptionLabel="No field types found"
                enableSearch
                onSearchInputChange={(search) => onFieldTypeSearch(search)}
                disabled={isEmpty(get(currentRow, ['response_key'], EMPTY_STRING)) ||
                isEmpty(get(currentRow, ['response_type'], EMPTY_STRING)) || !get(currentRow, ['new_field'], false)}
            />
        </div>
        <div className={gClasses.MB12}>
        <div
          role="button"
          tabIndex="0"
          onClick={() =>
            onChangeHandlers({ type: ADD_EVENT.SAVE_RESPONSE.DELETE.ID, path })
          }
          onKeyDown={(e) =>
            keydownOrKeypessEnterHandle(e) &&
            onChangeHandlers({ type: ADD_EVENT.SAVE_RESPONSE.DELETE.ID, path })
          }
          className={cx(gClasses.CursorPointer, gClasses.ClickableElement, gClasses.InputHeight36, gClasses.CenterV)}
        >
          <DeleteIconV2 className={cx(styles.DeleteIcon, gClasses.MR12)} />
        </div>
        </div>
      </div>
    );
  }

  const mapStateToProps = ({ EditFlowReducer }) => {
    return {
        flowData: EditFlowReducer.flowData,
    };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateFlowData: (...params) => {
      dispatch(updateFlowDataChange(...params));
    },
    onGetAllFieldsByFilter: (
      paginationData,
      setStateKey,
      mapping,
      fieldListDropdownType,
      tableUuid,
      getCancelToken,
    ) => {
      dispatch(
        getIntegrationMappingFields(
          paginationData,
          setStateKey,
          mapping,
          fieldListDropdownType,
          tableUuid,
          getCancelToken,
        ),
      );
    },
    dispatch,
  };
};

export default withRouter(
connect(mapStateToProps, mapDispatchToProps)(SaveResponseRowComponent));
