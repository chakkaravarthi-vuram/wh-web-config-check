import React from 'react';
import AdvancedTechnicalConfiguration from './advance_technical_configuration/AdvanceTechnicalConfiguration';
import FieldGuidanceConfiguration from './field_guidance_configuration/FieldGuidanceConfiguration';
import { MODULE_TYPES } from '../../../../../utils/Constants';

function AdditionalConfiguration(props) {
  const { setFieldDetails, fieldDetails, moduleType, metaData, tableColumns, isFocused, setIsFocused, onSaveFormFieldFunction } = props;
    return (
      <>
        <FieldGuidanceConfiguration setFieldDetails={setFieldDetails} fieldDetails={fieldDetails} />
        {moduleType !== MODULE_TYPES.TASK &&
        <AdvancedTechnicalConfiguration
          setFieldDetails={setFieldDetails}
          fieldDetails={fieldDetails}
          moduleType={moduleType}
          metaData={metaData}
          tableColumns={tableColumns}
          isFocused={isFocused}
          setIsFocused={setIsFocused}
          onSaveFormFieldFunction={onSaveFormFieldFunction}
        />}
      </>
    );
  }

  export default AdditionalConfiguration;
