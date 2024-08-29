import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  SegmentedControl,
  SingleDropdown,
  Text,
  TextInput,
  Title,
  ETitleHeadingLevel,
  ETitleSize,
  ETextSize,
  MultiDropdown,
} from '@workhall-pvt-lmt/wh-ui-library';
import cx from 'classnames/bind';
import { connect, useSelector } from 'react-redux';
import { cloneDeep, compact, get, isEmpty, unset } from 'lodash';
import {
  BE_TASK_LIST_TYPE,
  GET_TASK_CONFIG_CONSTANT,
  TASK_COMPONENT_CONFIG_KEYS,
} from './TaskConfiguration.constants';
import { BS } from '../../../../utils/UIConstants';
import gClasses from '../../../../scss/Typography.module.scss';
import FlowOrDatalistDropdown from './flow_or_datalist_dropdown/FlowOrDatalistDropdown';
import { applicationStateChange } from '../../../../redux/reducer/ApplicationReducer';
import {
  constructFlowOrDataListLabel,
  constructLabelForSelectedColumn,
  getFlowOrDataListObjectBasedOnType,
  getUUIDfromMetadata,
  sortColumns,
} from './TaskConfiguration.utils';
import { getAppComponentByIdThunk } from '../../../../redux/actions/Appplication.Action';
import { constructValidationDataForTask, saveCompValidationSchema } from '../../application.validation.schema';
import { validate } from '../../../../utils/UtilityFunctions';
import { getComponentInfoErrorMessage } from '../AppConfigurtion.utils';
import { GET_TASK_LIST_CONSTANTS } from '../../app_components/task_listing/TaskList.constants';

// NestedDropdown
const getValidationData = (label, component_info, t) => {
  const validationData = constructValidationDataForTask(label, component_info);
  const errorlist = validate(validationData, saveCompValidationSchema(t));
  return errorlist;
};

function TaskConfiguration(props) {
  const { activeComponent, getComponentById, applicationDataChange, appOnChange } = props;
  const { t } = useTranslation();
  const { error_list_config } = useSelector((store) => store.ApplicationReducer);
  const {
    FILTER: {
      DUE_ON,
      ASSIGNED_ON,
      TASK_TYPE,
      TYPE_OF_TASK,
      SELECT_COLUMN,
      LABEL_FIELD,
      ASSIGNED_TO,
      SORT,
      SORT_FILED,
      FLOW_OR_DATALIST,
    },
    LABEL,
    SORT_COLUMN_KEY_TO_OPTION_MAP,
  } = GET_TASK_CONFIG_CONSTANT(t);

  const { label = null, component_info } = activeComponent;

  const [isLoading, setIsLoading] = useState(false);

  const [selectedFlowOrDataList, setSelectedFlowOrDataList] = useState(
    constructFlowOrDataListLabel(
      get(component_info, ['read_preference_data'], null),
    ),
  );

  const [selectedColumnLabel, setSelectedColumnLabel] = useState(
    constructLabelForSelectedColumn(
      get(component_info, [TASK_COMPONENT_CONFIG_KEYS.SELECT_COLUMNS], null),
      t,
    ),
  );

  useEffect(() => {
    if (
      activeComponent?._id &&
      get(activeComponent, ['component_info', TASK_COMPONENT_CONFIG_KEYS.TYPE_OF_TASK], null) ===
        TYPE_OF_TASK.OPTIONS[1].value
    ) {
      setIsLoading(true);
      getComponentById(activeComponent._id)
        .then((response) => {
          const { flow_uuids, data_list_uuids } = getUUIDfromMetadata(get(response, ['component_info', 'read_preference_data'], null));
          applicationDataChange({
            activeComponent: {
              ...activeComponent,
              component_info: {
                ...activeComponent?.component_info,
                flow_uuids,
                data_list_uuids,
              },
            },
          });
          setSelectedFlowOrDataList(
            constructFlowOrDataListLabel(
              get(response, ['component_info', 'read_preference_data'], null),
            ),
          );
          setIsLoading(false);
        })
        .catch(() => setIsLoading(false));
    }
  }, []);

  const onChangeHandler = (value, _label, _unused, id) => {
    const clonedComponentInfo = cloneDeep(component_info);
    let clonedLabel = label;
    switch (id) {
      case TASK_COMPONENT_CONFIG_KEYS.ASSIGNED_ON:
      case TASK_COMPONENT_CONFIG_KEYS.SORT_BY:
      case TASK_COMPONENT_CONFIG_KEYS.SORT_FIELD:
        clonedComponentInfo[id] = value;
        break;
      case TASK_COMPONENT_CONFIG_KEYS.ASSIGNED_TO:
        if (get(clonedComponentInfo, [id], null) === value) {
          delete clonedComponentInfo?.assigned_to;
        } else {
          clonedComponentInfo[id] = value;
        }
        break;
      case TASK_COMPONENT_CONFIG_KEYS.TYPE:
        clonedComponentInfo[id] = value;
        clonedComponentInfo[
          TASK_COMPONENT_CONFIG_KEYS.SELECT_COLUMNS
        ] = [SELECT_COLUMN.OPTIONS[0].value];
        setSelectedColumnLabel([SELECT_COLUMN.OPTIONS[0].label]);
        if (value === BE_TASK_LIST_TYPE.COMPLETED_TASKS) {
          delete clonedComponentInfo?.assigned_to;
          delete clonedComponentInfo?.due_date;
          delete clonedComponentInfo?.due_end_date;
          delete clonedComponentInfo?.due_on;
        } else if (value === BE_TASK_LIST_TYPE.ASSIGNED_TO_OTHERS) {
          delete clonedComponentInfo?.assigned_to;
        }
        break;

      case TASK_COMPONENT_CONFIG_KEYS.TYPE_OF_TASK:
        clonedComponentInfo[id] = value;
        if (value === TYPE_OF_TASK.OPTIONS[0].value) {
          unset(clonedComponentInfo, [
            TASK_COMPONENT_CONFIG_KEYS.FLOW_UUIDS,
          ]);
          unset(clonedComponentInfo, [
            TASK_COMPONENT_CONFIG_KEYS.DATA_LISTS_UUIDS,
          ]);
          setSelectedFlowOrDataList([]);
        }
        break;
      case LABEL_FIELD.ID:
        clonedLabel = value;
        break;
      case TASK_COMPONENT_CONFIG_KEYS.DUE_ON:
        delete clonedComponentInfo?.due_date;
        delete clonedComponentInfo?.due_end_date;
        clonedComponentInfo[id] = value;
        if (
          [
            DUE_ON.OPTIONS[1].value,
            DUE_ON.OPTIONS[2].value,
            DUE_ON.OPTIONS[3].value,
            DUE_ON.OPTIONS[4].value,
          ].includes(value)
        ) {
          switch (value) {
            case DUE_ON.OPTIONS[1].value:
              clonedComponentInfo.due_date = 0;
              break;
            case DUE_ON.OPTIONS[2].value:
              clonedComponentInfo.due_date = 3;
              break;
            case DUE_ON.OPTIONS[3].value:
              clonedComponentInfo.due_date = 3;
              clonedComponentInfo.due_end_date = 7;
              break;
            case DUE_ON.OPTIONS[4].value:
              clonedComponentInfo.due_date = 7;
              break;
            default:
              break;
          }
        }
        break;
      default:
        break;
    }

    if ([
          TASK_COMPONENT_CONFIG_KEYS.TYPE,
          TASK_COMPONENT_CONFIG_KEYS.TYPE_OF_TASK,
          TASK_COMPONENT_CONFIG_KEYS.SELECT_COLUMNS,
          LABEL_FIELD.ID,
        ].includes(id)) {
        if (!isEmpty(error_list_config)) {
          const errorlist = getValidationData(clonedLabel, clonedComponentInfo, t);
          appOnChange({ error_list_config: errorlist });
        }
      }

    applicationDataChange({
      activeComponent: {
        ...activeComponent,
        label: clonedLabel,
        component_info: {
          ...clonedComponentInfo,
        },
      },
    });
  };

  const onMultipleDropdownChangeHandler = (value, _label, id) => {
    const clonedComponentInfo = cloneDeep(component_info);
    const clonedLabel = label;

    const selectedColumn = get(
      clonedComponentInfo,
      [TASK_COMPONENT_CONFIG_KEYS.SELECT_COLUMNS],
      [],
    );
    if (isEmpty(selectedColumn)) {
      clonedComponentInfo[TASK_COMPONENT_CONFIG_KEYS.SELECT_COLUMNS] = [
        value,
      ];
      setSelectedColumnLabel([_label]);
    } else {
      if (selectedColumn.includes(value)) {
        const findIdk = selectedColumn.findIndex(
          (eachValue) => eachValue === value,
        );
        if (findIdk > -1) {
          clonedComponentInfo[
            TASK_COMPONENT_CONFIG_KEYS.SELECT_COLUMNS
          ].splice(findIdk, 1);
          setSelectedColumnLabel((prev_selected_column) => {
            prev_selected_column.splice(findIdk, 1);
            return prev_selected_column;
          });
        }
      } else {
        const selectedColumn = sortColumns([...clonedComponentInfo[TASK_COMPONENT_CONFIG_KEYS.SELECT_COLUMNS], value]);
        clonedComponentInfo[TASK_COMPONENT_CONFIG_KEYS.SELECT_COLUMNS] = selectedColumn.value;
        setSelectedColumnLabel(selectedColumn.label);
      }
    }

    if ([
      TASK_COMPONENT_CONFIG_KEYS.TYPE,
      TASK_COMPONENT_CONFIG_KEYS.TYPE_OF_TASK,
      TASK_COMPONENT_CONFIG_KEYS.SELECT_COLUMNS,
      LABEL_FIELD.ID,
    ].includes(id)) {
      if (!isEmpty(error_list_config)) {
        const errorlist = getValidationData(clonedLabel, clonedComponentInfo, t);
        appOnChange({ error_list_config: errorlist });
      }
    }

    applicationDataChange({
      activeComponent: {
        ...activeComponent,
        label: clonedLabel,
        component_info: {
          ...clonedComponentInfo,
        },
      },
    });
  };

  const onChangeFlowOrDataList = (type, value, label) => {
    const clonedComponentInfo = cloneDeep(component_info);
    if (
      [
        TASK_COMPONENT_CONFIG_KEYS.FLOW_UUIDS,
        TASK_COMPONENT_CONFIG_KEYS.DATA_LISTS_UUIDS,
      ].includes(type)
    ) {
      let uuids = get(clonedComponentInfo, [type], []);
      const valueObject = getFlowOrDataListObjectBasedOnType(type, label, value);
      if (isEmpty(uuids)) {
        uuids = [value];
        setSelectedFlowOrDataList((previousState) => {
          previousState.push(valueObject);
          return previousState;
        });
      } else {
        if (uuids.includes(value)) {
          const uuidIndexToRemove = uuids.findIndex((eachUuid) => eachUuid === value);
          if (uuidIndexToRemove > -1) { uuids.splice(uuidIndexToRemove, 1); }

          const listIndexToRemove = selectedFlowOrDataList.findIndex((eachItem) => eachItem.value === value);
          if (listIndexToRemove > -1) {
            setSelectedFlowOrDataList((previousState) => {
                previousState.splice(listIndexToRemove, 1);
                return previousState;
            });
          }
        } else {
          uuids.push(value);
          setSelectedFlowOrDataList((previousState) => {
            previousState.push(valueObject);
            return previousState;
          });
        }
      }

      clonedComponentInfo[type] = uuids;
       if (isEmpty(get(clonedComponentInfo, [TASK_COMPONENT_CONFIG_KEYS.FLOW_UUIDS], null))) unset(clonedComponentInfo, [TASK_COMPONENT_CONFIG_KEYS.FLOW_UUIDS]);

      if (isEmpty(get(clonedComponentInfo, [TASK_COMPONENT_CONFIG_KEYS.DATA_LISTS_UUIDS], null))) unset(clonedComponentInfo, [TASK_COMPONENT_CONFIG_KEYS.DATA_LISTS_UUIDS]);

      if (!isEmpty(error_list_config)) {
        const errorlist = getValidationData(activeComponent?.label, clonedComponentInfo, t);
        appOnChange({ error_list_config: errorlist });
      }

      applicationDataChange({
        activeComponent: {
          ...activeComponent,
          component_info: {
            ...clonedComponentInfo,
          },
        },
      });
    }
  };

  const getDefaultSortOptionList = () => {
    const ASSIGNED_TO = GET_TASK_LIST_CONSTANTS(t).ALL_COLUMN_LIST.ASSIGNED_TO.value;
    const selected_column = get(component_info, [TASK_COMPONENT_CONFIG_KEYS.SELECT_COLUMNS], []);
    const optionList = (selected_column || []).map((eachColumnKey) => {
      if (eachColumnKey === ASSIGNED_TO) {
        return null;
      }
       return get(SORT_COLUMN_KEY_TO_OPTION_MAP, [eachColumnKey], null);
    });
    return compact(optionList);
  };

  const isCompletedTask =
    get(component_info, [TASK_TYPE.ID], '') ===
    BE_TASK_LIST_TYPE.COMPLETED_TASKS;
  const isAssignedToOtherTask =
    get(component_info, [TASK_TYPE.ID], '') ===
    BE_TASK_LIST_TYPE.ASSIGNED_TO_OTHERS;

  const selectedFlowAndDataListLabel = selectedFlowOrDataList?.map((eachItem) => eachItem?.label);

  return (
    <div className={cx(BS.D_FLEX, BS.FLEX_COLUMN, gClasses.gap32, BS.W100)}>
      <div className={cx(BS.D_FLEX, BS.FLEX_COLUMN, gClasses.Gap16)}>
        <TextInput
          id={LABEL_FIELD.ID}
          value={label}
          labelText={LABEL_FIELD.LABEL}
          isLoading={isLoading}
          placeholder={LABEL_FIELD.PLACEHOLDER}
          inputInnerClassName={BS.W100}
          onChange={(e) => {
            onChangeHandler(e?.target?.value, null, null, LABEL_FIELD.ID);
          }}
          required
          errorMessage={error_list_config?.label}
        />
        <SingleDropdown
          id={TYPE_OF_TASK.ID}
          className={cx(BS.W100)}
          dropdownViewProps={{
            labelName: TYPE_OF_TASK.LABEL,
            isLoading: isLoading,
            errorMessage: getComponentInfoErrorMessage(error_list_config, TYPE_OF_TASK.ID),
            isRequired: true,
          }}
          placeholder={TYPE_OF_TASK.LABEL}
          optionList={TYPE_OF_TASK.OPTIONS}
          onClick={onChangeHandler}
          selectedValue={get(
            component_info,
            [TASK_COMPONENT_CONFIG_KEYS.TYPE_OF_TASK],
            null,
          )}
        />
        {get(
          component_info,
          [TASK_COMPONENT_CONFIG_KEYS.TYPE_OF_TASK],
          null,
        ) === TYPE_OF_TASK.OPTIONS[1].value && (
          <FlowOrDatalistDropdown
            label={FLOW_OR_DATALIST.LABEL}
            placeholder={FLOW_OR_DATALIST.PLACEHOLDER}
            values={[
              ...get(
                component_info,
                [TASK_COMPONENT_CONFIG_KEYS.DATA_LISTS_UUIDS],
                [],
              ),
              ...get(
                component_info,
                [TASK_COMPONENT_CONFIG_KEYS.FLOW_UUIDS],
                [],
              ),
            ]}
            valueLabel={selectedFlowAndDataListLabel}
            onSelect={onChangeFlowOrDataList}
            isLoading={isLoading}
            errorMessage={getComponentInfoErrorMessage(error_list_config, 'choose_flow_or_data_list')}
          />
        )}
        <SingleDropdown
          id={TASK_TYPE.ID}
          className={cx(BS.W100)}
          dropdownViewProps={{
            labelName: TASK_TYPE.LABEL,
            placeholder: TASK_TYPE.PLACEHOLDER,
            isLoading: isLoading,
            errorMessage: getComponentInfoErrorMessage(error_list_config, TASK_TYPE.ID),
            isRequired: true,
          }}
          placeholder={TASK_TYPE.PLACEHOLDER}
          optionList={TASK_TYPE.OPTIONS}
          onClick={onChangeHandler}
          selectedValue={get(
            component_info,
            [TASK_COMPONENT_CONFIG_KEYS.TYPE],
            null,
          )}
        />
        {(!isCompletedTask && !isAssignedToOtherTask) && (
          <SingleDropdown
            id={ASSIGNED_TO.ID}
            className={cx(BS.W100)}
            dropdownViewProps={{
              labelName: ASSIGNED_TO.LABEL,
              placeholder: ASSIGNED_TO.PLACEHOLDER,
              isLoading: isLoading,
            }}
            placeholder={ASSIGNED_TO.PLACEHOLDER}
            optionList={ASSIGNED_TO.OPTIONS}
            onClick={onChangeHandler}
            selectedValue={get(
              component_info,
              [TASK_COMPONENT_CONFIG_KEYS.ASSIGNED_TO],
              null,
            )}
          />
        )}
        <MultiDropdown
          id={SELECT_COLUMN.ID}
          className={cx(BS.W100)}
          dropdownViewProps={{
            labelName: SELECT_COLUMN.LABEL,
            selectedLabel: selectedColumnLabel.join(', '),
            isLoading: isLoading,
            errorMessage: getComponentInfoErrorMessage(error_list_config, SELECT_COLUMN.ID),
            isRequired: true,
          }}
          placeholder={SELECT_COLUMN.PLACEHOLDER}
          optionList={cloneDeep(get(SELECT_COLUMN,
                      [get(component_info, [TASK_COMPONENT_CONFIG_KEYS.TYPE], null)],
                      []))
                      }
          onClick={onMultipleDropdownChangeHandler}
          selectedListValue={get(
            component_info,
            [TASK_COMPONENT_CONFIG_KEYS.SELECT_COLUMNS],
            null,
          )}
        />
      </div>
      {/* User Filter */}
      <div className={gClasses.PT32}>
        {/* Heading and Sub Heading */}
        <div className={gClasses.MB16}>
          <Title
            content={LABEL.USER_FILTER}
            headingLevel={ETitleHeadingLevel.h5}
            size={ETitleSize.xs}
            className={gClasses.PB8}
          />
          <Text
            content={LABEL.APPLIED_TASK_WILL_AFFECT_THE_TASK_LIST}
            size={ETextSize.SM}
          />
        </div>
        {/* User Filter Fields */}
          <div className={cx(BS.D_FLEX, BS.ALIGN_ITEM_CENTER, gClasses.PB16)}>
            <div className={cx(gClasses.Flex1, gClasses.MR24)}>
              <SingleDropdown
                id={ASSIGNED_ON.ID}
                className={BS.W100}
                dropdownViewProps={{
                  labelName: ASSIGNED_ON.LABEL,
                  placeholder: ASSIGNED_ON.PLACEHOLDER,
                  isLoading: isLoading,
                }}
                placeholder={ASSIGNED_ON.PLACEHOLDER}
                optionList={ASSIGNED_ON.OPTIONS}
                onClick={onChangeHandler}
                selectedValue={get(
                  component_info,
                  [TASK_COMPONENT_CONFIG_KEYS.ASSIGNED_ON],
                  null,
                )}
              />
            </div>
            <div className={gClasses.Flex1}>
              {!isCompletedTask && (
                <SingleDropdown
                  id={DUE_ON.ID}
                  className={BS.W100}
                  dropdownViewProps={{
                    labelName: DUE_ON.LABEL,
                    placeholder: DUE_ON.PLACEHOLDER,
                    isLoading: isLoading,
                  }}
                  placeholder={DUE_ON.PLACEHOLDER}
                  optionList={DUE_ON.OPTIONS}
                  onClick={onChangeHandler}
                  selectedValue={get(
                    component_info,
                    [TASK_COMPONENT_CONFIG_KEYS.DUE_ON],
                    null,
                  )}
                />
              )}
            </div>
          </div>
          <div className={cx(BS.D_FLEX, BS.ALIGN_ITEMS_END)}>
            <div className={cx(gClasses.Flex1, gClasses.MR24)}>
              <SingleDropdown
                id={SORT_FILED.ID}
                className={BS.W100}
                dropdownViewProps={{
                  labelName: SORT_FILED.LABEL,
                  placeholder: SELECT_COLUMN.PLACEHOLDER,
                  isLoading: isLoading,
                }}
                placeholder={SORT_FILED.PLACEHOLDER}
                optionList={getDefaultSortOptionList()}
                onClick={onChangeHandler}
                selectedValue={get(
                  component_info,
                  [TASK_COMPONENT_CONFIG_KEYS.SORT_FIELD],
                  null,
                )}
              />
            </div>
            <div className={gClasses.Flex1}>
              <SegmentedControl
                ID={SORT.ID}
                options={SORT.OPTIONS}
                selectedValue={get(
                  component_info,
                  [TASK_COMPONENT_CONFIG_KEYS.SORT_BY],
                  null,
                )}
                onClick={(_event, value) =>
                  onChangeHandler(value, null, null, SORT.ID)
                }
                isLoading={isLoading}
              />
            </div>
          </div>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    activeComponent: state.ApplicationReducer?.activeComponent,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getComponentById: (id) => dispatch(getAppComponentByIdThunk(id)),
    applicationDataChange: (data) => dispatch(applicationStateChange(data)),
    appOnChange: (params) => dispatch(applicationStateChange(params)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TaskConfiguration);
