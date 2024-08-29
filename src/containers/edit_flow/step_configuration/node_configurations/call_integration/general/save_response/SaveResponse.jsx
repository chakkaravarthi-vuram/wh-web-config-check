import React from 'react';
import cx from 'classnames/bind';
import {
  RadioGroup,
  RadioGroupLayout,
  Text,
} from '@workhall-pvt-lmt/wh-ui-library';
import { useTranslation } from 'react-i18next';
import { cloneDeep } from 'utils/jsUtility';
import gClasses from '../../../../../../../scss/Typography.module.scss';
import styles from './SaveResponse.module.scss';
import { CALL_INTEGRATION_STRINGS } from '../../CallIntegration.strings';
import FieldMappingTable from '../../../row_components/field_mapping_table/FieldMappingTable';
import {
  FIELD_MAPPING_TABLE_TYPES,
  MAPPING_COMPONENT_TYPES,
} from '../../../row_components/RowComponents.constants';
import {
  CALL_INTEGRATION_CONSTANTS,
  RESPONSE_FIELD_KEYS,
  getDefaultKeyLabels,
} from '../../CallIntegration.constants';
import {
  nodeConfigDataChange,
  useFlowNodeConfig,
} from '../../../../../node_configuration/use_node_reducer/useNodeReducer';
import { FIELD_TYPE } from '../../../../../../../utils/constants/form.constant';
import { INTEGRATION_METHOD_TYPES } from '../../../../../../../utils/Constants';

let cancelTokenForResponseFormat = null;

const setCancelTokenForResponseFormat = (c) => {
  cancelTokenForResponseFormat = c;
};

function SaveResponse(props) {
  const { metaData } = props;
  const { t } = useTranslation();

  const { SAVE_RESPONSE } = CALL_INTEGRATION_STRINGS(t).GENERAL.MAPPING;
  const { ERROR_MESSAGES } = CALL_INTEGRATION_STRINGS(t);
  const { SAVE_RESPONSE_INITIAL_DATA } = CALL_INTEGRATION_CONSTANTS;

  const { state, dispatch } = useFlowNodeConfig();
  const {
    serverResponseFormat = [],
    responseFormat = [],
    responseBody,
    isSaveResponse,
    fieldDetails = [],
    errorList = {},
    responseFormatErrorList = {},
    selectedEvent,
  } = state;

  const onChangeHandler = () => {
    dispatch(
      nodeConfigDataChange({
        isSaveResponse: !isSaveResponse,
        serverResponseFormat: [],
        responseFormat: [],
      }),
    );
  };

  const handleMappingChange = (data) => {
    const modifiedErrorList = cloneDeep(errorList);
    if (data?.[RESPONSE_FIELD_KEYS.RESPONSE_FORMAT]?.length) {
      delete modifiedErrorList?.responseFormat;
    }

    dispatch(
      nodeConfigDataChange({
        [RESPONSE_FIELD_KEYS.RESPONSE_FORMAT]:
          data?.[RESPONSE_FIELD_KEYS.RESPONSE_FORMAT],
        [RESPONSE_FIELD_KEYS.RESPONSE_FORMAT_ERROR]:
          data?.[RESPONSE_FIELD_KEYS.RESPONSE_FORMAT_ERROR],
        errorList: modifiedErrorList,
      }),
    );
  };

  return (
    <div className={gClasses.MT24}>
      <Text
        className={cx(gClasses.FontWeight500, gClasses.FTwo16GrayV3)}
        content={SAVE_RESPONSE.TITLE}
      />
      <RadioGroup
        labelText={SAVE_RESPONSE.IS_SAVE_RESPONSE.LABEL}
        selectedValue={isSaveResponse}
        options={SAVE_RESPONSE.IS_SAVE_RESPONSE.OPTIONS}
        labelClassName={cx(styles.FieldLabel, styles.RadioLabelMargin)}
        optionClassName={gClasses.BlackV12}
        layout={RadioGroupLayout.stack}
        onChange={onChangeHandler}
        className={cx(gClasses.MT12, gClasses.MB12)}
        disabled={selectedEvent?.method === INTEGRATION_METHOD_TYPES.GET}
      />
      {isSaveResponse && (
        <div className={gClasses.MT12}>
          <Text
            className={cx(
              gClasses.FontWeight500,
              gClasses.FTwo16GrayV3,
              gClasses.MB12,
            )}
            content={SAVE_RESPONSE.RESPONSE_DETAILS.TITLE}
          />
          <FieldMappingTable
            key={RESPONSE_FIELD_KEYS.RESPONSE_FORMAT}
            rowInitialData={SAVE_RESPONSE_INITIAL_DATA}
            initialRawData={[]}
            mappedServerData={serverResponseFormat}
            mappedData={responseFormat}
            valueFieldParams={{
              ignore_field_types: [
                FIELD_TYPE.CUSTOM_LOOKUP_DROPDOWN,
                FIELD_TYPE.USER_TEAM_PICKER,
                FIELD_TYPE.USER_PROPERTY_PICKER,
                FIELD_TYPE.DATA_LIST,
                FIELD_TYPE.DATA_LIST_PROPERTY_PICKER,
                FIELD_TYPE.PHONE_NUMBER,
                FIELD_TYPE.CURRENCY,
                FIELD_TYPE.LINK,
                FIELD_TYPE.INFORMATION,
              ],
              include_property_picker: 0,
            }}
            keyLabels={{
              ...getDefaultKeyLabels(
                RESPONSE_FIELD_KEYS.COLUMN_MAPPING,
                RESPONSE_FIELD_KEYS.FIELD_TYPE,
              ),
              key: 'mappingInfo',
            }}
            fieldDetails={fieldDetails}
            tableHeaders={SAVE_RESPONSE.TABLE_HEADERS}
            additionalRowComponentProps={{
              responseBody,
              keyObject: {
                rowUuid: 'mappingInfo',
                key: 'mappingInfo',
                keyType: 'mappingFieldType',
                value: 'value',
                valueFieldType: 'fieldType',
                valueDetails: 'fieldDetails',
                isRequired: 'isRequired',
                mappingUuid: 'mappingInfo',
                columnMappingListKey: 'columnMapping',
                deleteRow: 'deleteRow',
              },
            }}
            mappingVariant={FIELD_MAPPING_TABLE_TYPES.RESPONSE_FIELD_MAPPING}
            mappingComponent={MAPPING_COMPONENT_TYPES.CALL_INTEGRATION}
            mappingListKey={RESPONSE_FIELD_KEYS.RESPONSE_FORMAT}
            errorListKey={RESPONSE_FIELD_KEYS.RESPONSE_FORMAT_ERROR}
            handleMappingChange={handleMappingChange}
            parentId={metaData?.flowId}
            errorList={responseFormatErrorList}
            parentSetCancelToken={setCancelTokenForResponseFormat}
            parentCancelToken={cancelTokenForResponseFormat}
          />
        </div>
      )}
      {errorList?.responseFormat && (
        <Text
          content={ERROR_MESSAGES.RESPONSE_FORMAT_REQUIRED}
          className={gClasses.red22}
        />
      )}
    </div>
  );
}

export default SaveResponse;
