import { Text } from '@workhall-pvt-lmt/wh-ui-library';
import React from 'react';
import { useTranslation } from 'react-i18next';
import cx from 'classnames/bind';
import gClasses from '../../../../../../../scss/Typography.module.scss';
import { CALL_INTEGRATION_STRINGS } from '../../CallIntegration.strings';
import {
  FIELD_MAPPING_TABLE_TYPES,
  MAPPING_COMPONENT_TYPES,
} from '../../../row_components/RowComponents.constants';
import FieldMappingTable from '../../../row_components/field_mapping_table/FieldMappingTable';
import {
  nodeConfigDataChange,
  useFlowNodeConfig,
} from '../../../../../node_configuration/use_node_reducer/useNodeReducer';
import {
  RESPONSE_FIELD_KEYS,
  getDefaultKeyLabels,
} from '../../CallIntegration.constants';
import { FIELD_TYPE } from '../../../../../../../utils/constants/form.constant';

let cancelTokenForQueryParams = null;

const setCancelTokenForQueryParams = (c) => {
  cancelTokenForQueryParams = c;
};

function QueryParams(props) {
  const { steps, metaData, systemFieldParams } = props;

  const { t } = useTranslation();

  const { QUERY_PARAMS } = CALL_INTEGRATION_STRINGS(t).GENERAL.MAPPING;

  const { state, dispatch } = useFlowNodeConfig();

  const {
    eventQueryParams = [],
    queryParams = [],
    serverQueryParams = [],
    fieldDetails = [],
    queryParamErrorList = {},
  } = state;

  const handleMappingChange = (data) => {
    dispatch(
      nodeConfigDataChange({
        [RESPONSE_FIELD_KEYS.QUERY_PARAMS]:
          data?.[RESPONSE_FIELD_KEYS.QUERY_PARAMS],
        [RESPONSE_FIELD_KEYS.QUERY_PARAMS_ERROR]:
          data?.[RESPONSE_FIELD_KEYS.QUERY_PARAMS_ERROR],
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
        content={QUERY_PARAMS.TITLE}
      />
      <FieldMappingTable
        key={RESPONSE_FIELD_KEYS.QUERY_PARAMS}
        initialRawData={eventQueryParams}
        mappedServerData={serverQueryParams}
        mappedData={queryParams}
        fieldDetails={fieldDetails}
        tableHeaders={QUERY_PARAMS.TABLE_HEADERS}
        keyLabels={getDefaultKeyLabels()}
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
        systemFieldParams={systemFieldParams}
        additionalRowComponentProps={{
          keyObject: {
            rowUuid: 'keyUuid',
            key: 'key',
            value: 'value',
            valueDetails: 'fieldDetails',
            valueType: 'type',
            isRequired: 'isRequired',
            mappingUuid: 'keyUuid',
          },
          steps,
        }}
        mappingVariant={FIELD_MAPPING_TABLE_TYPES.KEY_VALUE_MAPPING}
        mappingComponent={MAPPING_COMPONENT_TYPES.CALL_INTEGRATION}
        mappingListKey={RESPONSE_FIELD_KEYS.QUERY_PARAMS}
        errorListKey={RESPONSE_FIELD_KEYS.QUERY_PARAMS_ERROR}
        handleMappingChange={handleMappingChange}
        parentId={metaData?.flowId}
        errorList={queryParamErrorList}
        parentSetCancelToken={setCancelTokenForQueryParams}
        parentCancelToken={cancelTokenForQueryParams}
      />
    </div>
  );
}

export default QueryParams;
