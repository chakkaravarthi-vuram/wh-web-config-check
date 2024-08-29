import { Text } from '@workhall-pvt-lmt/wh-ui-library';
import React from 'react';
import { useTranslation } from 'react-i18next';
import cx from 'classnames/bind';
import gClasses from '../../../../../../../scss/Typography.module.scss';
import { CALL_INTEGRATION_STRINGS } from '../../CallIntegration.strings';
import {
  nodeConfigDataChange,
  useFlowNodeConfig,
} from '../../../../../node_configuration/use_node_reducer/useNodeReducer';
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
import { FIELD_TYPE } from '../../../../../../../utils/constants/form.constant';

let cancelTokenForRequestBody = null;

const setCancelTokenForRequestBody = (c) => {
  cancelTokenForRequestBody = c;
};

function RequestBody(props) {
  const { steps, systemFieldParams, metaData, isMLIntegration } = props;

  const { t } = useTranslation();

  const { REQUEST_BODY } = CALL_INTEGRATION_STRINGS(t).GENERAL.MAPPING;

  const { state, dispatch } = useFlowNodeConfig();

  const {
    eventRequestBody = [],
    requestBody = [],
    serverRequestBody = [],
    fieldDetails = [],
    requestBodyErrorList = {},
  } = state;

  const handleMappingChange = (data) => {
    dispatch(
      nodeConfigDataChange({
        [RESPONSE_FIELD_KEYS.REQUEST_BODY]:
          data?.[RESPONSE_FIELD_KEYS.REQUEST_BODY],
        [RESPONSE_FIELD_KEYS.REQUEST_BODY_ERROR]:
          data?.[RESPONSE_FIELD_KEYS.REQUEST_BODY_ERROR],
      }),
    );
  };

  return (
    <div className={gClasses.MT12}>
      <Text
        className={cx(
          gClasses.FontWeight500,
          gClasses.FTwo13GrayV3,
          gClasses.MB12,
        )}
        content={REQUEST_BODY.TITLE}
      />
      <FieldMappingTable
        key={RESPONSE_FIELD_KEYS.REQUEST_BODY}
        initialRawData={eventRequestBody}
        mappedServerData={serverRequestBody}
        mappedData={requestBody}
        fieldDetails={fieldDetails}
        tableHeaders={isMLIntegration ? REQUEST_BODY.ML_TABLE_HEADERS : REQUEST_BODY.TABLE_HEADERS}
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
          include_property_picker: 1,
        }}
        keyLabels={{
          ...getDefaultKeyLabels(CALL_INTEGRATION_CONSTANTS.CHILD_ROWS),
          fieldDetailsKey: 'field_details',
        }}
        systemFieldParams={systemFieldParams}
        additionalRowComponentProps={{
          keyObject: {
            rowUuid: 'key_uuid',
            key: 'key',
            keyType: 'key_type',
            value: 'value',
            valueType: 'type',
            valueDetails: 'field_details',
            isRequired: 'is_required',
            isMultiple: 'is_multiple',
            mappingUuid: 'key',
            columnMappingListKey: 'child_rows',
          },
          steps,
          isMLIntegration,
        }}
        mappingVariant={FIELD_MAPPING_TABLE_TYPES.REQ_BODY_VALUE_MAPPING}
        mappingComponent={MAPPING_COMPONENT_TYPES.CALL_INTEGRATION}
        mappingListKey={RESPONSE_FIELD_KEYS.REQUEST_BODY}
        errorListKey={RESPONSE_FIELD_KEYS.REQUEST_BODY_ERROR}
        handleMappingChange={handleMappingChange}
        parentId={metaData?.flowId}
        errorList={requestBodyErrorList}
        parentSetCancelToken={setCancelTokenForRequestBody}
        parentCancelToken={cancelTokenForRequestBody}
      />
    </div>
  );
}

export default RequestBody;
