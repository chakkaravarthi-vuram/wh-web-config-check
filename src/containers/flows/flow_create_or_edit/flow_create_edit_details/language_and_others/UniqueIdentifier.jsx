import React, { useEffect, useState } from 'react';
import {
  Checkbox,
  ECheckboxSize,
  ETitleSize,
  SingleDropdown,
  Text,
  Title,
} from '@workhall-pvt-lmt/wh-ui-library';
import gClasses from 'scss/Typography.module.scss';
import cx from 'classnames/bind';
import { useTranslation } from 'react-i18next';
import PlusIconBlueNew from '../../../../../assets/icons/PlusIconBlueNew';
import styles from '../../FlowCreateOrEdit.module.scss';
import { FLOW_ADDON_STRINGS } from '../../../flow_landing/flow_details/flow_add_on/FlowAddOn.strings';
import { LANGUAGE_AND_OTHERS } from '../../FlowCreateOrEdit.constant';
import { has, isEmpty } from '../../../../../utils/jsUtility';
import { apiGetAllFieldsList } from '../../../../../axios/apiService/flow.apiService';
import { EMPTY_STRING } from '../../../../../utils/strings/CommonStrings';

const IGNORE_FIELD_TYPES = ['paragraph', 'fileupload', 'checkbox', 'yesorno', 'link', 'information', 'lookupcheckbox', 'table'];

function UniqueIdentifier(props) {
  const { addOn, onChange, metaData, errorList } = props;
  const { t } = useTranslation();
  const { TITLE, TASK_IDENTIFIER } = FLOW_ADDON_STRINGS(t).IDENTIFIER;
  const [customIdentifierSearch, setCustomIdentifierSearch] = useState(EMPTY_STRING);
  const [taskIdentifierSearch, setTaskIdentifierSearch] = useState(EMPTY_STRING);
  const [customIdentifierFields, setCustomIdentifierFields] = useState({ loading: false, data: [], paginationDetails: {} });
  const [taskIdentifierFields, setTaskIdentifierFields] = useState({ loading: false, data: [], paginationDetails: {} });

 const getAllFields = (page = 1, searchValue = null, isCustomIdentifier = true) => {
    const params = {
      page: page,
      size: 15,
      sort_by: 1,
      flow_id: metaData.flowId,
      field_list_type: 'direct',
    };
    if (searchValue) params.search = searchValue;
    params.ignore_field_types = IGNORE_FIELD_TYPES;
    params.include_property_picker = 1;
    apiGetAllFieldsList(params)
      .then((data) => {
        const { pagination_data, pagination_details } = data;
        const options = pagination_data?.map((field) => {
          return { label: field?.field_name, value: field?.field_uuid };
        });

        if (isCustomIdentifier) {
          setCustomIdentifierFields((p) => {
            return {
              loading: false,
              data: [...(pagination_details.page > 1 ? p.data : []), ...options],
              paginationDetails: pagination_details,
            };
          });
        } else {
          setTaskIdentifierFields((p) => {
            return {
              loading: false,
              data: [...(pagination_details.page > 1 ? p.data : []), ...options],
              paginationDetails: pagination_details,
            };
          });
        }
      })
      .catch((err) => console.log('getAllFields err', err));
  };

  const loadMoreFields = (isCustomIdentifier = true) => {
    if (isCustomIdentifier && customIdentifierFields.paginationDetails?.page) {
      getAllFields(customIdentifierFields.paginationDetails.page + 1 || 1);
    } else if (!isCustomIdentifier && taskIdentifierFields.paginationDetails?.page) {
      getAllFields(taskIdentifierFields.paginationDetails.page + 1 || 1);
    }
  };

  useEffect(() => {
    if (!has(addOn, ['isSystemIdentifier']) || addOn.isSystemIdentifier) return;
    getAllFields(1, customIdentifierSearch);
  }, [addOn.isSystemIdentifier, customIdentifierSearch]);

  useEffect(() => {
    getAllFields(1, taskIdentifierSearch, false);
  }, [taskIdentifierSearch]);

  // const getDeletedFieldLabel = (f) => !f?.label && f?.value ? t('common_strings.field_deleted') : undefined;
  const taskIdentifier = isEmpty(addOn.taskIdentifier) ? [{}] : addOn.taskIdentifier;
  const taskIdentifierUUIDs = taskIdentifier.map((t) => t.value);

  return (
    <>
      <Title
        content={TITLE}
        size={ETitleSize.xs}
        className={styles.UniqueIdentifierTitle}
      />
      <div className={cx(gClasses.MT16, gClasses.W50)}>
        <SingleDropdown
          dropdownViewProps={{
            labelName: TITLE,
            labelClassName: styles.IdentifierDropdown,
            selectedLabel: addOn.customIdentifier?.label,
            disabled: addOn.isSystemIdentifier,
            onBlur: () => setCustomIdentifierSearch(EMPTY_STRING),
          }}
          searchProps={{
            searchValue: customIdentifierSearch,
            searchPlaceholder: 'Search Fields',
            onChangeSearch: (event) =>
              setCustomIdentifierSearch(event?.target?.value),
          }}
          infiniteScrollProps={{
            scrollableId: 'customIdentifierFieldsList',
            next: () => loadMoreFields(true),
            dataLength: customIdentifierFields?.data.length,
            hasMore:
              customIdentifierFields?.data.length <
              customIdentifierFields?.paginationDetails?.total_count,
          }}
          optionList={customIdentifierFields.data}
          onClick={(value, label) =>
            onChange('customIdentifier', { value, label })
          }
          selectedValue={addOn.customIdentifier?.value}
          errorMessage={errorList.customIdentifier}
          showReset
        />
      </div>
      <Checkbox
        className={cx(gClasses.MT16)}
        size={ECheckboxSize.SM}
        labelClassName={cx(gClasses.FontWeight500, gClasses.FTwo13Black)}
        isValueSelected={addOn.isSystemIdentifier}
        details={LANGUAGE_AND_OTHERS(t).CHECKBOX_OPTIONS}
        onClick={() =>
          onChange('isSystemIdentifier', !addOn.isSystemIdentifier)
        }
      />
      <Text
        content={TASK_IDENTIFIER.LABEL}
        className={cx(gClasses.MT16, styles.ConfigureClass, gClasses.MB5)}
      />
      <div className={cx(gClasses.TopV)}>
        {taskIdentifier.map((identifier, idx) => (
          <div className={cx(styles.DropdownWrapper, gClasses.MR8)} key={`${idx}_${identifier?.value}`}>
            <SingleDropdown
              dropdownViewProps={{
                selectedLabel: identifier?.label,
                className: styles.UniqIdentifierView,
                onBlur: () => setTaskIdentifierSearch(EMPTY_STRING),
              }}
              searchProps={{
                searchValue: taskIdentifierSearch,
                searchPlaceholder: 'Search Fields',
                onChangeSearch: (event) =>
                  setTaskIdentifierSearch(event?.target?.value),
              }}
              infiniteScrollProps={{
                scrollableId: 'taskIdentifierFieldsList',
                next: () => loadMoreFields(false),
                dataLength: taskIdentifierFields?.data.length,
                hasMore:
                  taskIdentifierFields?.data.length <
                  taskIdentifierFields?.paginationDetails?.total_count,
              }}
              optionList={
                idx === 0
                  ? taskIdentifierFields.data
                  : taskIdentifierFields.data.filter(
                      (f) => !taskIdentifierUUIDs.includes(f.value),
                    )
              }
              onClick={(value, label) =>
                onChange('taskIdentifier', { value, label }, { taskIdentifierIdx: idx })
              }
              selectedValue={identifier.value}
              errorMessage={errorList[`taskIdentifier,${idx}`]}
              showReset
            />
          </div>
        ))}
        {taskIdentifier.length < 2 && (
          <div
            className={cx(
              gClasses.PositionRelative,
              gClasses.DisplayFlex,
              gClasses.ML8,
              gClasses.MT8,
            )}
          >
            <button
              className={cx(
                gClasses.CenterV,
                gClasses.ClickableElement,
                gClasses.CursorPointer,
                gClasses.PositionRelative,
              )}
              onClick={() => onChange('taskIdentifier', {}, { addTaskIdentifier: true })}
            >
              <PlusIconBlueNew className={cx(gClasses.MR5)} />
              <div className={gClasses.FlexGrow1}>
                <div
                  className={cx(gClasses.FTwo13, gClasses.FontWeight500)}
                  style={{ color: '#217CF5' }}
                >
                  {LANGUAGE_AND_OTHERS(t).ADD_FIELD}
                </div>
              </div>
            </button>
          </div>
        )}
        <Text content={TASK_IDENTIFIER.STEP_NAME} className={cx(gClasses.MT8, gClasses.ML16)} />
      </div>
    </>
  );
}
export default UniqueIdentifier;
