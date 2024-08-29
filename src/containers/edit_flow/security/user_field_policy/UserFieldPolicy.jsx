import React, { useState } from 'react';
import cx from 'classnames/bind';
import {
  Chip,
  ETextSize,
  SingleDropdown,
  Text,
} from '@workhall-pvt-lmt/wh-ui-library';
import { cloneDeep, get, set } from 'utils/jsUtility';
import MappingTable from 'containers/integration/mapping_table/MappingTable';
import gClasses from 'scss/Typography.module.scss';
import styles from './UserFieldPolicy.module.scss';
import { ERROR_MESSAGES, USER_POLICY_STRINGS } from './UserFieldPolicy.strings';
import Plus from '../../../../assets/icons/configuration_rule_builder/Plus';
import { getUserFieldPolicyInitialState } from './UserFieldPolicy.utils';
import { POLICY_STRINGS } from '../security_policy/SecurityPolicy.strings';
import { USER_FIELD_POLICY_CONSTANTS } from './UserFieldPolicy.constants';
import { emptyFunction, isEmpty } from '../../../../utils/jsUtility';
import { generateEventTargetObject } from '../../../../utils/generatorUtils';
import { deleteErrorListWithId } from '../../../form/external_source_data/ExternalSource.utils';
import { EMPTY_STRING } from '../../../../utils/strings/CommonStrings';
import Trash from '../../../../assets/icons/application/Trash';

function UserFieldPolicy(props) {
  const {
    policies,
    userFieldOptionList,
    userFieldPaginationData,
    onDataChange,
    userFieldPolicyList,
    errorList = {},
    onLoadMoreFields = emptyFunction,
    isFieldsLoading,
    securityPolicyErrorList,
  } = props;

  const [localState, setLocalState] = useState({
    listSearch: EMPTY_STRING,
  });

  const { ACCESS_TO, FIELD_UUID, POLICY_UUID } = POLICY_STRINGS.REQUEST_KEYS;

  const userFieldPolicy = get(userFieldPolicyList, 0, {});

  const handleMappingChange = (fieldUuids) => {
    const clonedPolicies = cloneDeep(policies);
    const clonedUserFieldPolicy = cloneDeep(userFieldPolicy);

    set(clonedUserFieldPolicy, [ACCESS_TO, FIELD_UUID], fieldUuids);

    const policyIndex = clonedPolicies.findIndex(
      (eachPolicy) =>
        eachPolicy?.[POLICY_UUID] === clonedUserFieldPolicy?.[POLICY_UUID],
    );

    if (policyIndex > -1) {
      clonedPolicies[policyIndex] = clonedUserFieldPolicy;
    }

    onDataChange({
      policyList: clonedPolicies,
    });
  };

  const handleMappingTableChange = (
    event,
    index,
    _isDuplicateKeyError,
    duplicateKeyIndex,
  ) => {
    const {
      target: { value },
    } = event;

    const duplicateErrorPath = `${ACCESS_TO},${FIELD_UUID},${duplicateKeyIndex}`;

    const clonedPolicies = cloneDeep(policies);
    const clonedUserFieldPolicy = cloneDeep(userFieldPolicy);

    const selectedField = userFieldOptionList?.find(
      (eachField) => eachField?.field_uuid === value,
    );

    set(
      clonedUserFieldPolicy,
      [ACCESS_TO, FIELD_UUID, index, USER_FIELD_POLICY_CONSTANTS.FIELD_KEY],
      value,
    );

    set(
      clonedUserFieldPolicy,
      [ACCESS_TO, FIELD_UUID, index, USER_FIELD_POLICY_CONSTANTS.FIELD_LABEL],
      selectedField?.label,
    );

    const policyIndex = clonedPolicies.findIndex(
      (eachPolicy) =>
        eachPolicy?.[POLICY_UUID] === clonedUserFieldPolicy?.[POLICY_UUID],
    );

    if (policyIndex > -1) {
      clonedPolicies[policyIndex] = clonedUserFieldPolicy;
    }

    const modifiedErrorList = deleteErrorListWithId(errorList, [
      `${ACCESS_TO},${FIELD_UUID},${index},${USER_FIELD_POLICY_CONSTANTS.FIELD_KEY}`,
      duplicateErrorPath,
    ]);

    onDataChange({
      policyList: clonedPolicies,
      userFieldPolicyErrorList: modifiedErrorList,
    });
  };

  const handleMappingRowDelete = (
    index,
    isDuplicateKeyError,
    duplicateKeyIndex,
  ) => {
    const clonedPolicies = cloneDeep(policies);
    const clonedUserFieldPolicy = cloneDeep(userFieldPolicy);
    const duplicateErrorPath = `${ACCESS_TO},${FIELD_UUID},${duplicateKeyIndex}`;

    if (!isEmpty(clonedPolicies)) {
      set(clonedUserFieldPolicy, [ACCESS_TO, FIELD_UUID, index], {
        is_deleted: true,
      });

      const policyIndex = clonedPolicies.findIndex(
        (eachPolicy) =>
          eachPolicy?.[POLICY_UUID] === clonedUserFieldPolicy?.[POLICY_UUID],
      );

      const userFieldUuids = get(
        clonedUserFieldPolicy,
        [ACCESS_TO, FIELD_UUID],
        [],
      );

      const hasFieldRow = userFieldUuids?.some(
        (eachFieldRow) => !eachFieldRow?.is_deleted,
      );

      if (policyIndex > -1) {
        if (!hasFieldRow) {
          clonedPolicies.splice(policyIndex, 1);
        } else {
          clonedPolicies[policyIndex] = clonedUserFieldPolicy;
        }
      }

      const clonedErrorList = cloneDeep(errorList);
      if (errorList) {
        Object.keys(errorList).forEach((currentKey) => {
          if (currentKey?.includes(`${FIELD_UUID},${index}`)) {
            delete clonedErrorList[currentKey];
          }
        });
      }

      if (isDuplicateKeyError) delete clonedErrorList[duplicateErrorPath];

      onDataChange({
        policyList: clonedPolicies,
      });
    }
  };

  const handleSearchFields = (event) => {
    const {
      target: { value },
    } = event;

    setLocalState({
      ...localState,
      listSearch: value,
    });

    const customParams = {
      page: 1,
    };

    if (!isEmpty(value)) customParams.search = value;

    onLoadMoreFields(customParams);
  };

  const onLoadMoreHandler = () => {
    const customParams = {
      page: userFieldPaginationData?.page || 1,
    };

    if (!isEmpty(localState?.listSearch)) {
      customParams.search = localState?.listSearch;
    }

    onLoadMoreFields(customParams);
  };

  const initialRow = (index, _key, isDuplicateKeyError, duplicateKeyIndex) => {
    const currentRow = get(userFieldPolicy, [ACCESS_TO, FIELD_UUID, index], {});

    let keyError = null;
    if (isDuplicateKeyError) {
      keyError = ERROR_MESSAGES.DUPLICATE_KEY_ERROR;
    } else {
      keyError =
        errorList?.[
          `${ACCESS_TO},${FIELD_UUID},${index},${USER_FIELD_POLICY_CONSTANTS.FIELD_KEY}`
        ];
    }

    return (
      <div
        className={cx(
          gClasses.CenterVSpaceBetween,
          styles.EachRow,
          gClasses.W100,
        )}
      >
        <div className={styles.UserFieldDropdown}>
          <SingleDropdown
            id={USER_POLICY_STRINGS.USER_FIELD.ID}
            dropdownViewProps={{
              selectedLabel: currentRow?.label,
              className: gClasses.W100,
              onBlur: () => setLocalState({ listSearch: EMPTY_STRING }),
              onClick: handleSearchFields,
              onKeyDown: handleSearchFields,
            }}
            isLoadingOptions={isFieldsLoading}
            optionList={cloneDeep(userFieldOptionList)}
            placeholder={USER_POLICY_STRINGS.USER_FIELD.PLACEHOLDER}
            onClick={(value, _label, _list, id) =>
              handleMappingTableChange(
                generateEventTargetObject(id, value),
                index,
                isDuplicateKeyError,
                duplicateKeyIndex,
              )
            }
            infiniteScrollProps={{
              dataLength: userFieldOptionList?.length || 0,
              next: onLoadMoreHandler,
              hasMore:
                userFieldPaginationData?.total_count >
                userFieldOptionList?.length,
              scrollableId:
                USER_FIELD_POLICY_CONSTANTS.FIELDS_LIST_CONSTANTS.SCROLLABLE_ID,
              scrollThreshold:
                USER_FIELD_POLICY_CONSTANTS.FIELDS_LIST_CONSTANTS
                  .SCROLLABLE_THRESOLD,
            }}
            searchProps={{
              searchPlaceholder:
                USER_POLICY_STRINGS.USER_FIELD.SEARCH_PLACEHOLDER,
              searchValue: localState?.listSearch,
              onChangeSearch: handleSearchFields,
            }}
            selectedValue={currentRow?.key}
            errorMessage={keyError}
          />
        </div>

        <div
          className={cx(
            gClasses.CenterV,
            gClasses.RightH,
            styles.ChipContainer,
          )}
        >
          <Chip
            text={USER_POLICY_STRINGS.USER_FIELD.LABEL}
            className={cx(gClasses.MR8, styles.FieldChip)}
          />
          <div className={cx(styles.ColMed, gClasses.CenterV)}>
            <Trash
              className={cx(gClasses.CursorPointer)}
              onClick={() =>
                handleMappingRowDelete(
                  index,
                  isDuplicateKeyError,
                  duplicateKeyIndex,
                )
              }
            />
          </div>
        </div>
      </div>
    );
  };

  const onAddPolicy = () => {
    const policyList = [
      ...cloneDeep(policies),
      getUserFieldPolicyInitialState(),
    ];

    const clonedErrorList = cloneDeep(securityPolicyErrorList);

    if (clonedErrorList?.policyList) {
        delete clonedErrorList?.policyList;
    }

    onDataChange({ policyList: cloneDeep(policyList), securityPolicyErrorList: clonedErrorList });
  };

  return (
    <div className={styles.UserBasedPolicy}>
      <Text
        content={USER_POLICY_STRINGS.TITLE}
        size={ETextSize.MD}
        className={cx(styles.Title, gClasses.LabelStyle)}
      />
      <Text content={USER_POLICY_STRINGS.SUB_TITLE} size={ETextSize.SM} className={gClasses.MB12} />
      <MappingTable
        mappingList={get(userFieldPolicy, [ACCESS_TO, FIELD_UUID], [])}
        mappingKey={`${ACCESS_TO},${FIELD_UUID}`}
        initialRow={initialRow}
        initialRowKeyValue={USER_FIELD_POLICY_CONSTANTS.USER_FIELD_INIT_ROW}
        handleMappingChange={handleMappingChange}
        error_list={errorList}
        noAddRow={isEmpty(userFieldPolicy)}
        addKeyLabel={USER_POLICY_STRINGS.ADD_POLICY}
      />

      {isEmpty(userFieldPolicy) && (
        <button onClick={onAddPolicy} className={cx(styles.AddPolicy, gClasses.FontWeight500)}>
          <Plus />
          {USER_POLICY_STRINGS.ADD_POLICY}
        </button>
      )}
    </div>
  );
}

export default UserFieldPolicy;
