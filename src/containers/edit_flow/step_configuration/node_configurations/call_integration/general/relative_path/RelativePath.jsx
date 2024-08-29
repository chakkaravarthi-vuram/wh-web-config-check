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
  RESPONSE_FIELD_KEYS,
  getDefaultKeyLabels,
} from '../../CallIntegration.constants';
import { FIELD_TYPE } from '../../../../../../../utils/constants/form.constant';

let cancelTokenForRelativePath = null;

const setCancelTokenForRelativePath = (c) => {
  cancelTokenForRelativePath = c;
};

function RelativePath(props) {
  const { steps, systemFieldParams, metaData } = props;

  const { t } = useTranslation();

  const { RELATIVE_PATH } = CALL_INTEGRATION_STRINGS(t).GENERAL.MAPPING;

  const { state, dispatch } = useFlowNodeConfig();

  const {
    eventRelativePath = [],
    relativePath = [],
    serverRelativePath = [],
    fieldDetails = [],
    relativePathErrorList = {},
  } = state;

  const handleMappingChange = (data) => {
    dispatch(
      nodeConfigDataChange({
        [RESPONSE_FIELD_KEYS.RELATIVE_PATH]:
          data?.[RESPONSE_FIELD_KEYS.RELATIVE_PATH],
        [RESPONSE_FIELD_KEYS.RELATIVE_PATH_ERROR]:
          data?.[RESPONSE_FIELD_KEYS.RELATIVE_PATH_ERROR],
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
        content={RELATIVE_PATH.TITLE}
      />
      <FieldMappingTable
        key={RESPONSE_FIELD_KEYS.RELATIVE_PATH}
        initialRawData={eventRelativePath}
        mappedServerData={serverRelativePath}
        mappedData={relativePath}
        fieldDetails={fieldDetails}
        tableHeaders={RELATIVE_PATH.TABLE_HEADERS}
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
            rowUuid: 'pathName',
            key: 'pathName',
            value: 'value',
            valueType: 'type',
            valueDetails: 'fieldDetails',
            isRequired: 'isRequired',
            mappingUuid: 'pathName',
          },
          steps,
        }}
        mappingVariant={FIELD_MAPPING_TABLE_TYPES.KEY_VALUE_MAPPING}
        mappingComponent={MAPPING_COMPONENT_TYPES.CALL_INTEGRATION}
        mappingListKey={RESPONSE_FIELD_KEYS.RELATIVE_PATH}
        errorListKey={RESPONSE_FIELD_KEYS.RELATIVE_PATH_ERROR}
        handleMappingChange={handleMappingChange}
        parentId={metaData?.flowId}
        errorList={relativePathErrorList}
        parentSetCancelToken={setCancelTokenForRelativePath}
        parentCancelToken={cancelTokenForRelativePath}
      />
    </div>
  );
}

export default RelativePath;
