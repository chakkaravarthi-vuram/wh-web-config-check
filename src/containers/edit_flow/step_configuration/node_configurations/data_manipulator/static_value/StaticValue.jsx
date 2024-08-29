import React, { useEffect, useState } from 'react';
import cx from 'classnames/bind';
import { Size, SingleDropdown, TextInput, RadioGroup, ErrorVariant, ETextSize } from '@workhall-pvt-lmt/wh-ui-library';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { DOCUMENT_TYPES, EMPTY_STRING, ENTITY } from '../../../../../../utils/strings/CommonStrings';
import gClasses from '../../../../../../scss/Typography.module.scss';
import styles from '../DataManipulator.module.scss';
import { cloneDeep, get, isNull, isEmpty } from '../../../../../../utils/jsUtility';
import { nodeConfigDataChange, useFlowNodeConfig } from '../../../../node_configuration/use_node_reducer/useNodeReducer';

import DocumentUpload from '../../../../../../components/form_components/file_uploader/FileUploader';
import useSimplifiedFileUploadHook from '../../../../../../hooks/useSimplifiedFileUploadHook';
import { generateUuid, getExtensionFromFileName } from '../../../../../../utils/generatorUtils';
import { getDmsLinkForPreviewAndDownload } from '../../../../../../utils/attachmentUtils';
import { DATA_MANIPULATOR_STEP_CONFIGURATION } from '../DataManipulator.strings';
import { RESPONSE_KEYS } from '../DataManipulator.constants';
import { FIELD_TYPES } from '../../../../manage_flow_fields/ManageFlowFields.constants';
import DateTimeWrapper from '../../../../../../components/date_time_wrapper/DateTimeWrapper';
import NumberField from '../../../../../../components/form_components/number_field/NumberField';
import { validateMapping } from '../DataManipulator.utils';

function SetStaticValue(props) {
    const { t } = useTranslation();
    const { parentIndex = null, index = null, onDataChangeHandler } = props;

    const { flowData } = useSelector((state) => state.EditFlowReducer);

    const { STATIC_VALUE, MANIPULATION } = DATA_MANIPULATOR_STEP_CONFIGURATION(t);

    const { state = {}, dispatch } = useFlowNodeConfig();

    const pref_locale = localStorage.getItem('application_language');

    const {
      SOURCE_VALUE,
      CHILD_MAPPING,
      DOCUMENT_DETAILS,
      SOURCE_FIELD_TYPE,
      SOURCE_TYPE,
      OPERATOR,
      SAVE_TO,
      SAVE_INTO_FIELD,
      MANIPULATION_DETAILS,
   } = RESPONSE_KEYS;

    const [errorKeyIndex, setErrorKeyIndex] = useState(EMPTY_STRING);

    useEffect(() => {
      if (isNull(parentIndex)) setErrorKeyIndex(`${MANIPULATION_DETAILS},${index}`);
      else setErrorKeyIndex(`${MANIPULATION_DETAILS},${parentIndex},${CHILD_MAPPING},${index}`);
  }, []);

    const {
        manipulationDetails = [],
        userProfileData = {},
        _id,
        step_uuid,
        errorList = {},
        mappingErrorList = {},
        flowFields = [],
        ref_uuid,
    } = state;

    const mergedErrors = { ...errorList, ...mappingErrorList };

    const currentData = !isNull(parentIndex) ?
    cloneDeep(manipulationDetails)?.[parentIndex]?.[CHILD_MAPPING]?.[index] :
    cloneDeep(manipulationDetails)?.[index];

    const [staticTypeList, setStaticTypeList] = useState(STATIC_VALUE.MANIPULATION.TYPE_OPTIONS(!isNull(parentIndex)));

    useEffect(() => {
      setStaticTypeList(STATIC_VALUE.MANIPULATION.TYPE_OPTIONS(!isNull(parentIndex)));
    }, [parentIndex]);

    const getFileData = (file, file_ref_uuid, _entityType, entityId, refUuid) => {
      const fileData = {
        type: DOCUMENT_TYPES.MANIPULATION_STATIC_DOCUMENTS,
        file_type: getExtensionFromFileName(file.name),
        file_name: file?.name?.slice(0, -1 * (file.name.length - file.name.lastIndexOf('.'))),
        file_size: file.size,
        file_ref_id: file_ref_uuid,
      };
    const file_metadata = [];
          file_metadata.push(fileData);
      const data = {
        file_metadata,
      };
      data.entity = ENTITY.FLOW_STEPS;
      data.context_id = flowData.flow_id;
      data.entity_id = _id; // step id
      data.entity_uuid = step_uuid;
      data.ref_uuid = ref_uuid || refUuid || generateUuid();
      return data;
    };

    const onUploadFile = (res, data, file) => {
      const fileMetaData = get(data, ['file_metadata', 0], {});
      const documentId = get(res, ['file_metadata', 0, '_id'], {});
      const _file = {
        name: file.name,
        type: fileMetaData.file_type,
        size: fileMetaData.file_size,
        url: data?.url || EMPTY_STRING,
        thumbnail: `${getDmsLinkForPreviewAndDownload(
          window,
        )}/dms/display/?id=${documentId}`,
        documentId,
        refUuid: res?.ref_uuid,
      };
      const document = {
        document_id: documentId,
        entity: res.entity,
        entity_id: res.entity_id,
        ...get(res, ['file_metadata', 0], {}),
        ref_uuid: res.ref_uuid,
      };
      const clonedManipulatorData = cloneDeep(manipulationDetails);
      const currentData = !isNull(parentIndex) ?
      cloneDeep(manipulationDetails)?.[parentIndex]?.[CHILD_MAPPING]?.[index] :
      cloneDeep(manipulationDetails)?.[index];
      currentData[RESPONSE_KEYS.STATIC_VALUE] = [{ ..._file, file: _file }];
      currentData[SOURCE_VALUE] = currentData?.[RESPONSE_KEYS.STATIC_VALUE]?.map((f) => f.documentId || f.id);
      currentData[DOCUMENT_DETAILS] = {
          entity: ENTITY.FLOW_STEPS,
          entity_id: res.entity_id,
          ref_uuid: res.ref_uuid,
          uploaded_doc_metadata: [document],
      };
      if (!isNull(parentIndex)) clonedManipulatorData[parentIndex][CHILD_MAPPING][index] = currentData;
      else clonedManipulatorData[index] = currentData;
      dispatch(
        nodeConfigDataChange({
          ref_uuid: res.ref_uuid,
        }),
      );
      onDataChangeHandler(clonedManipulatorData);
    };

    const removeStaticFile = () => {
      const clonedManipulatorData = cloneDeep(manipulationDetails);
      const currentData = !isNull(parentIndex) ?
      cloneDeep(manipulationDetails)?.[parentIndex]?.[CHILD_MAPPING]?.[index] :
      cloneDeep(manipulationDetails)?.[index];
      currentData[RESPONSE_KEYS.STATIC_VALUE] = [];
      currentData[SOURCE_VALUE] = [];
      currentData[DOCUMENT_DETAILS] = {};
      if (!isNull(parentIndex)) clonedManipulatorData[parentIndex][CHILD_MAPPING][index] = currentData;
      else clonedManipulatorData[index] = currentData;
      onDataChangeHandler(clonedManipulatorData);
    };

    const {
      onRetryFileUpload,
      onFileUpload,
      uploadFile,
      onDeletFileUpload,
    } = useSimplifiedFileUploadHook(getFileData, onUploadFile);
    console.log('userProfileDatauserProfileData', userProfileData);
    const changeStaticValueType = (value) => {
        const clonedManipulatorData = cloneDeep(manipulationDetails);
        const currentData = !isNull(parentIndex) ?
        cloneDeep(manipulationDetails)?.[parentIndex]?.[CHILD_MAPPING]?.[index] :
        cloneDeep(manipulationDetails)?.[index];
        if (currentData[SOURCE_FIELD_TYPE] !== value) {
          currentData[SOURCE_FIELD_TYPE] = value;
          currentData[SOURCE_VALUE] = EMPTY_STRING;
        }
        if (value === 'object') {
            currentData[CHILD_MAPPING] = [
                {
                    [SOURCE_TYPE]: currentData[SOURCE_TYPE],
                    [OPERATOR]: MANIPULATION.OPERATOR_OPTIONS(true)?.[0]?.value,
                    [SAVE_TO]: EMPTY_STRING,
                    isColumn: true,
                    [SOURCE_FIELD_TYPE]: EMPTY_STRING,
                }];
        } else delete currentData?.[CHILD_MAPPING];

        if (!isNull(parentIndex)) clonedManipulatorData[parentIndex][CHILD_MAPPING][index] = currentData;
        else clonedManipulatorData[index] = currentData;
        const currentMapping = isNull(parentIndex) ?
        clonedManipulatorData?.[index] :
        clonedManipulatorData[parentIndex][CHILD_MAPPING][index];
        let flowField = null;
        if (currentMapping?.[SOURCE_TYPE] !== DATA_MANIPULATOR_STEP_CONFIGURATION(t).ADD_MANIPULATION.OPTIONS[0].value) {
            flowField = currentMapping?.[SAVE_TO] || currentMapping?.[SAVE_INTO_FIELD];
        }

        const errors = (currentMapping?.[SOURCE_TYPE] !== DATA_MANIPULATOR_STEP_CONFIGURATION(t).ADD_MANIPULATION.OPTIONS[0].value) ? {
          ...validateMapping(
                value,
                flowField,
                [],
                flowFields,
                cloneDeep(mappingErrorList),
                errorKeyIndex,
                value,
                t,
                currentData,
            ),
        } : mappingErrorList;
        onDataChangeHandler(clonedManipulatorData);
        dispatch(
          nodeConfigDataChange({
            mappingErrorList: errors,
          }),
        );
    };

    const changeStaticValue = (value) => {
        const clonedManipulatorData = cloneDeep(manipulationDetails);
        const currentData = !isNull(parentIndex) ?
        cloneDeep(manipulationDetails)?.[parentIndex]?.[CHILD_MAPPING]?.[index] :
        cloneDeep(manipulationDetails)?.[index];
        currentData[SOURCE_VALUE] = value;
        if (!isNull(parentIndex)) clonedManipulatorData[parentIndex][CHILD_MAPPING][index] = currentData;
        else clonedManipulatorData[index] = currentData;
        onDataChangeHandler(clonedManipulatorData);
    };

    const getStaticComponent = () => {
      switch (currentData?.[SOURCE_FIELD_TYPE]) {
        case FIELD_TYPES.DATE:
        case FIELD_TYPES.DATETIME:
          return (
            <DateTimeWrapper
              id={`${parentIndex},${index}_${RESPONSE_KEYS.STATIC_VALUE},date`}
              date={currentData?.[SOURCE_VALUE]}
              errorMessage={mergedErrors?.[`${errorKeyIndex},${SOURCE_VALUE}`]}
              enableTime={currentData?.[SOURCE_FIELD_TYPE] === FIELD_TYPES.DATETIME}
              getDate={changeStaticValue}
            />
          );
        case 'boolean':
          return (
            <RadioGroup
              id={`${parentIndex},${index}_${RESPONSE_KEYS.STATIC_VALUE},boolean`}
              options={STATIC_VALUE.BOOLEAN_OPTIONS}
              onChange={(_e, _id, value) => changeStaticValue(value)}
              selectedValue={currentData?.[SOURCE_VALUE]}
              enableOptionDeselect
              errorMessage={mergedErrors?.[`${errorKeyIndex},${SOURCE_VALUE}`]}
            />
          );
        case FIELD_TYPES.FILE_UPLOAD:
          return (
            <div className={styles.DocStaticValue}>
              <DocumentUpload
                id={`${parentIndex},${index}_${RESPONSE_KEYS.STATIC_VALUE},stream`}
                isDragDrop
                isMultiple={false}
                onRetryClick={onRetryFileUpload}
                onDeleteClick={(index, fileId) => {
                  console.log('removeFIleHere');
                  onDeletFileUpload(index, fileId);
                  removeStaticFile(index);
                }}
                uploadedFiles={currentData?.[RESPONSE_KEYS.STATIC_VALUE] || []}
                addFile={(files) => {
                  onFileUpload(files);
                }}
                thumbnailUrls={(currentData?.[STATIC_VALUE] || [])?.map((f) => f.url)}
                allowedExtensions={userProfileData?.allowed_extensions}
                maximumFileSize={userProfileData?.maximum_file_size}
                errorVariant={ErrorVariant.direct}
                isLoading={uploadFile?.isFileUploadInProgress}
                errorMessage={mergedErrors?.[`${errorKeyIndex},${SOURCE_VALUE}`]}
              />
            </div>
          );
        case 'text':
        return (
          <TextInput
              id={`${parentIndex},${index}_${STATIC_VALUE.ID},text`}
              className={cx(styles.ValueFlex, styles.FlowField)}
              onChange={(event) => changeStaticValue(event?.target?.value)}
              value={currentData?.[SOURCE_VALUE]}
              placeholder={STATIC_VALUE.PLACEHOLDER}
              errorMessage={mergedErrors?.[`${errorKeyIndex},${SOURCE_VALUE}`]}
          />
        );
        case FIELD_TYPES.NUMBER:
          return (
            <NumberField
              id={`${parentIndex},${index}_${STATIC_VALUE.ID},number`}
              placeholder={STATIC_VALUE.PLACEHOLDER}
              value={currentData?.[SOURCE_VALUE]}
              onChange={(value) => {
                if (!isEmpty(value?.toString())) {
                  const updatedValue = Number(value.toString().replace(/,/g, ''));
                  console.log('changeStaticValue', value, typeof value, updatedValue, typeof updatedValue);
                  changeStaticValue(value);
                }
              }}
              size={ETextSize.MD}
              errorVariant={ErrorVariant.direct}
              errorMessage={mergedErrors?.[`${errorKeyIndex},${SOURCE_VALUE}`]}
              innerLabelClass={gClasses.Margin0}
              prefLocale={pref_locale}
              isDigitFormatted
              allowDecimal
            />
          );
        default: return null;
      }
    };

    const hasError = (!isEmpty(mergedErrors[`${errorKeyIndex},${SAVE_TO}`]) || !isEmpty(mergedErrors?.[`${errorKeyIndex},${SOURCE_VALUE}`]));

    return (
        <div className={cx(
          hasError && styles.UserFieldContainer,
          styles.ValueContainer,
          ((currentData?.[SOURCE_FIELD_TYPE] === FIELD_TYPES.FILE_UPLOAD) && (isEmpty(currentData?.[RESPONSE_KEYS.STATIC_VALUE]))) && styles.EmptyStreamClass,
          ((currentData?.[SOURCE_FIELD_TYPE] === 'boolean')) && (hasError ? styles.BooleanErrorContainer : styles.ErrorValueContainer),
          gClasses.MR8,
          gClasses.DisplayFlex,
          gClasses.AlignCenter)}
        >
            <SingleDropdown
                id={`${parentIndex},${index}_${STATIC_VALUE},type`}
                optionList={staticTypeList}
                dropdownViewProps={{
                    size: Size.sm,
                }}
                onClick={(value) => changeStaticValueType(value)}
                selectedValue={currentData?.[SOURCE_FIELD_TYPE]}
                // showReset
                className={styles.StaticValueType}
                errorMessage={mergedErrors?.[`${errorKeyIndex},${SOURCE_FIELD_TYPE}`]}
            />
            {currentData?.source_field_type !== 'object' &&
                getStaticComponent()
            }
        </div>
    );
}

export default SetStaticValue;
