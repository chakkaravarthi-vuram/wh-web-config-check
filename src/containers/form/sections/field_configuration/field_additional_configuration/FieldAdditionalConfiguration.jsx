import React from 'react';
import { RESPONSE_FIELD_KEYS } from '../../../../../utils/constants/form/form.constant';
import { FIELD_TYPE } from '../../../../../utils/constants/form.constant';
import { FORM_LAYOUT_TYPE } from '../../../Form.string';
import ComponentAdditionalConfig from './component_additional_config/ComponentAdditionalConfig';
import DisplayFieldAdditionalConfiguration from './display_field_additional_config/DisplayFieldAdditionalConfiguration';

function FieldAdditionalConfiguration(props) {
  const { fieldDetails, setFieldDetails, moduleType, metaData } = props;

  const getCurrentBasicConfig = () => {
    switch (fieldDetails[RESPONSE_FIELD_KEYS.FIELD_TYPE]) {
      case FIELD_TYPE.RICH_TEXT:
      case FIELD_TYPE.IMAGE:
      case FORM_LAYOUT_TYPE.LAYOUT:
      case FIELD_TYPE.BUTTON_LINK:
        return (
          <ComponentAdditionalConfig
            fieldDetails={fieldDetails}
            setFieldDetails={setFieldDetails}
            moduleType={moduleType}
            metaData={metaData}
          />
        );
      default:
        return (
          <DisplayFieldAdditionalConfiguration
            fieldDetails={fieldDetails}
            setFieldDetails={setFieldDetails}
            moduleType={moduleType}
            metaData={metaData}
          />
        );
    }
  };
  return getCurrentBasicConfig();
}

export default FieldAdditionalConfiguration;
