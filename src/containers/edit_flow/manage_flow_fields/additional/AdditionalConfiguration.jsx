import React from 'react';
import gClasses from 'scss/Typography.module.scss';
import AdvancedTechnicalConfiguration from '../../../form/sections/field_configuration/additional_configuration/advance_technical_configuration/AdvanceTechnicalConfiguration';

function AdditionalConfiguration(props) {
  const { setFieldDetails, fieldDetails, moduleType, metaData, tableColumns, isFocused, setIsFocused, onSaveFormFieldFunction } = props;
  console.log('additionalconfigprops', fieldDetails);
  return (
    <AdvancedTechnicalConfiguration
      setFieldDetails={setFieldDetails}
      fieldDetails={fieldDetails}
      moduleType={moduleType}
      metaData={metaData}
      tableColumns={tableColumns}
      className={gClasses.MT0}
      isFocused={isFocused}
      setIsFocused={setIsFocused}
      onSaveFormFieldFunction={onSaveFormFieldFunction}
    />
  );
}

export default AdditionalConfiguration;
