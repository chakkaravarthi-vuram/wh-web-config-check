import React from 'react';
import gClasses from 'scss/Typography.module.scss';
import UploadDirectly from './upload_directly/UploadDirectly';

function ImageBasicConfiguration(props) {
  const { fieldDetails, setFieldDetails, metaData, errorList } = props;
  // const { t } = useTranslation();
  // const {
  //   IMAGE_CONFIG: { IMAGE_SOURCE, CHOOSE_FIELD },
  // } = COMPONENT_CONFIG_STRINGS(t);

  return (
    <div className={gClasses.W100}>
      {/* <RadioGroup
        labelText={IMAGE_SOURCE.LABEL}
        options={IMAGE_SOURCE.OPTIONS}
        selectedValue={imageType}
        onChange={(_event, _id, value) => setImageType(value)}
        className={gClasses.MB16}
      /> */}
        <UploadDirectly
          fieldDetails={fieldDetails}
          setFieldDetails={setFieldDetails}
          metaData={metaData}
          errorList={errorList}
        />
      {/* {imageType === IMAGE_CONFIGURATION_TYPE.FIELDS && (
        <div className={styles.ChooseField}>
          <SingleDropdown
            id={CHOOSE_FIELD.ID}
            dropdownViewProps={{ labelName: CHOOSE_FIELD.LABEL }}
          />
        </div>
      )} */}
    </div>
  );
}

export default ImageBasicConfiguration;
