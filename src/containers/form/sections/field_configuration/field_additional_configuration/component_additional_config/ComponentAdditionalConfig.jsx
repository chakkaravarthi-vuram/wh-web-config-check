import React from 'react';
import FieldVisibilityConfig from '../field_visibility_config/FieldVisibilityConfig';

function ComponentAdditionalConfig(props) {
  const { fieldDetails, setFieldDetails, moduleType, metaData } = props;
  return (
    <div>
      <FieldVisibilityConfig
        fieldDetails={fieldDetails}
        setFieldDetails={setFieldDetails}
        moduleType={moduleType}
        metaData={metaData}
      />
    </div>
  );
}

export default ComponentAdditionalConfig;
