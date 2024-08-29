import React, { useContext } from 'react';
import { InputTreeLayout, Text } from '@workhall-pvt-lmt/wh-ui-library';
import { cloneDeep, set, isEmpty, has, get, unset } from 'utils/jsUtility';
import { v4 as uuidv4 } from 'uuid';
import gClasses from 'scss/Typography.module.scss';
import styles from './OutputFormat.module.scss';
import PlusIcon from '../../../../../assets/icons/PlusIcon';
import ThemeContext from '../../../../../hoc/ThemeContext';
import {
  FIELD_IDS,
  OUTPUT_FORMAT_CONSTANTS,
  OUTPUT_FORMAT_KEY_TYPES,
} from '../../ExternalSource.constants';
import {
  externalSourceDataChange,
  useExternalSource,
} from '../../useExternalSource';
import OutputFormatRowComponent from './OutputFormatRowComponent';
import { FIELD_LIST_TYPE } from '../../../../../utils/constants/form.constant';
import { ERROR_MESSAGES } from '../../ExternalSource.strings';
import { deleteErrorListWithId } from '../../ExternalSource.utils';
import { CHOICE_VALUE_FIELD_TYPES_CHECKBOX } from '../../../../edit_flow/step_configuration/node_configurations/data_manipulator/DataManipulator.utils';

function OutputFormat(props) {
  const {
    tableHeaders = [],
    errorList = {},
    keyLabels = {},
    initialRowData = {},
    overAllErrorList = {},
  } = props;

  const { state, dispatch } = useExternalSource();

  const { outputFormat = [] } = state;

  const { colorSchemeDefault } = useContext(ThemeContext);
  const colorScheme = colorSchemeDefault;

  const handleRowDelete = (path, isDuplicateKeyError, duplicateKeyRow) => {
    const clonedOutputFormat = cloneDeep(outputFormat);
    path = (path || []).split(',');

    const rowTobeDeleted = get(clonedOutputFormat, path, {});
    unset(rowTobeDeleted, OUTPUT_FORMAT_CONSTANTS.COLUMN_MAPPING);

    let removedList = set(clonedOutputFormat, path, {
      ...rowTobeDeleted,
      is_deleted: true,
    });

    const childRowPath = cloneDeep(path);
    childRowPath.pop();

    const childRows = get(clonedOutputFormat, childRowPath);
    const validRows = (childRows || []).filter((data) => !data.is_deleted);

    if (isEmpty(validRows)) {
      removedList = set(clonedOutputFormat, childRowPath, []);
    }

    const clonedErrorList = cloneDeep(errorList);

    if (isDuplicateKeyError) {
      delete clonedErrorList[duplicateKeyRow?.path];
    }
    if (errorList) {
      Object.keys(errorList).forEach((currentKey) => {
        if (currentKey?.includes(path)) {
          delete clonedErrorList[currentKey];
        }
      });
    }

    dispatch(
      externalSourceDataChange({
        outputFormat: removedList,
        outputFormatErrorList: clonedErrorList,
      }),
    );
  };

  const handleAddMore = (path, root_uuid = null) => {
    const clonedOutputFormat = cloneDeep(outputFormat) || [];
    const clonedRow = cloneDeep(initialRowData);

    clonedRow.path = path;
    clonedRow.key_uuid = uuidv4();

    const clonedErrorList = cloneDeep(errorList);
    const clonedOverallErrorList = cloneDeep(overAllErrorList);
    const modifiedErrorList = deleteErrorListWithId(clonedOverallErrorList, [FIELD_IDS.OUTPUT_FORMAT]);

    if (root_uuid) {
      clonedRow.root_uuid = root_uuid;
      const currentPath = (path || []).split(',');
      set(clonedOutputFormat, currentPath, clonedRow);
      if (!isEmpty(clonedErrorList)) {
        const currentPath = path.split(',') || [];
        currentPath.pop();
        const parentPath = (currentPath || []).join(',');
        if (has(clonedErrorList, [parentPath])) {
          delete clonedErrorList[parentPath];
        }
      }
    } else {
      clonedOutputFormat.push(clonedRow);
    }

    dispatch(
      externalSourceDataChange({
        outputFormat: clonedOutputFormat,
        outputFormatErrorList: clonedErrorList,
        errorList: modifiedErrorList,
      }),
    );
  };

  const handleOnChangeHandler = (e, path, isDuplicateKeyError = false, duplicateKeyRow = {}) => {
    const clonedErrorList = cloneDeep(errorList);
    const clonedOutputFormat = cloneDeep(outputFormat);
    path = (path || []).split(',');

    set(clonedOutputFormat, [...path, e.target.id], e.target.value);

    if (e.target.isResponseBody) {
      set(clonedOutputFormat, [...path, e.target.keyTypeId], e.target.keyType);
      if (CHOICE_VALUE_FIELD_TYPES_CHECKBOX?.includes(e?.target?.keyType)) {
        set(clonedOutputFormat, [...path, 'field_details'], e?.target?.keyFieldDetails);
      }
      if (!isEmpty(clonedErrorList)) {
        Object.keys(clonedErrorList).forEach((key) => {
          if (key === `${path},${OUTPUT_FORMAT_CONSTANTS.COLUMN_MAPPING}`) {
            delete clonedErrorList[key];
          }
        });
      }

      if (e.target.keyType === FIELD_LIST_TYPE.TABLE) {
        set(
          clonedOutputFormat,
          [...path, OUTPUT_FORMAT_CONSTANTS.FIELD_DETAILS],
          e.target.keyFieldDetails,
        );
      }

      if (
        (e.target.keyType !== OUTPUT_FORMAT_KEY_TYPES.OBJECT ||
          e.target.keyType !== FIELD_LIST_TYPE.TABLE) &&
        has(clonedOutputFormat, [
          ...path,
          OUTPUT_FORMAT_CONSTANTS.COLUMN_MAPPING,
        ])
      ) {
        unset(clonedOutputFormat, [
          ...path,
          OUTPUT_FORMAT_CONSTANTS.COLUMN_MAPPING,
        ]);
      }
    }

    if (e.target.id === OUTPUT_FORMAT_CONSTANTS.TYPE_ID) {
      if (!isEmpty(clonedErrorList)) {
        Object.keys(clonedErrorList).forEach((key) => {
          if (key === `${path},${OUTPUT_FORMAT_CONSTANTS.COLUMN_MAPPING}`) {
            delete clonedErrorList[key];
          }
        });
      }
      if (
        e.target.value !== OUTPUT_FORMAT_KEY_TYPES.OBJECT &&
        has(clonedOutputFormat, [
          ...path,
          OUTPUT_FORMAT_CONSTANTS.COLUMN_MAPPING,
        ])
      ) {
        unset(clonedOutputFormat, [
          ...path,
          OUTPUT_FORMAT_CONSTANTS.COLUMN_MAPPING,
        ]);
      }
    }

    if (isDuplicateKeyError) {
      delete clonedErrorList[duplicateKeyRow?.path];
    }

    delete clonedErrorList[`${path},${e.target.id}`];

    dispatch(
      externalSourceDataChange({
        outputFormat: clonedOutputFormat,
        outputFormatErrorList: clonedErrorList,
      }),
    );
  };

  const onChangeHandlers = ({ event, type, path, root_uuid, isDuplicateKeyError, duplicateKeyRow }) => {
    switch (type) {
      case OUTPUT_FORMAT_CONSTANTS.KEY_ID:
      case OUTPUT_FORMAT_CONSTANTS.TYPE_ID:
      case OUTPUT_FORMAT_CONSTANTS.NAME_ID:
        return handleOnChangeHandler(event, path, isDuplicateKeyError, duplicateKeyRow);
      case OUTPUT_FORMAT_CONSTANTS.DELETE_ID:
        return handleRowDelete(path, isDuplicateKeyError, duplicateKeyRow);
      case OUTPUT_FORMAT_CONSTANTS.ADD_CHILD:
        return handleAddMore(path, root_uuid);
      default:
        break;
    }
    return null;
  };

  return (
    <div>
      <InputTreeLayout
        tableHeaders={tableHeaders}
        headerStyles={[
          styles.KeyInput,
          styles.TypeDropdown,
          styles.NameInput,
          styles.DeleteIcon,
        ]}
        data={outputFormat}
        depth={OUTPUT_FORMAT_CONSTANTS.INIT_DEPTH}
        maxDepth={OUTPUT_FORMAT_CONSTANTS.MAX_DEPTH}
        AddMoreIcon={() => <PlusIcon className={styles.Icon} />}
        colorScheme={colorScheme}
        parentDetails={{}}
        onChangeHandlers={onChangeHandlers}
        RowComponent={OutputFormatRowComponent}
        errorList={errorList}
        keyLabels={keyLabels}
      />
      {overAllErrorList?.outputFormat && (
        <Text
          content={ERROR_MESSAGES.DATA_NEEDED_REQUIRED}
          className={gClasses.red22}
        />
      )}
    </div>
  );
}

export default OutputFormat;
