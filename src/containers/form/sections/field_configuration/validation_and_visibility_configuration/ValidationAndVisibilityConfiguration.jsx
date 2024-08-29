import React from 'react';
import { useTranslation } from 'react-i18next';
import gClasses from 'scss/Typography.module.scss';
import cx from 'classnames/bind';
import { ETitleHeadingLevel, ETitleSize, Title } from '@workhall-pvt-lmt/wh-ui-library';
import ValidationConfiguration from './validation_configuration/ValidationConfiguration';
import VisibilityConfiguration from './visibility_configuration/VisibilityConfiguration';
import { VALIDATION_VISIBILITY_FORM_FIELD_CONFIG_STRINGS } from './ValidationAndVisibilityConfiguration.strings';

function ValidationAndVisibilityConfiguration(props) {
  const {
    setFieldDetails,
    fieldDetails,
    moduleType,
    metaData = {},
    noOfFields,
    tableColumns = [],
    tableUUID,
    isTableField,
  } = props;
  const { t } = useTranslation();

    return (
      <div>
        <Title
          content={VALIDATION_VISIBILITY_FORM_FIELD_CONFIG_STRINGS(t).VALIDATION_TITLE}
          headingLevel={ETitleHeadingLevel.h4}
          className={cx(gClasses.MB16, gClasses.FTwo16GrayV3)}
          size={ETitleSize.xs}
        />
        <ValidationConfiguration
          setFieldDetails={setFieldDetails}
          fieldDetails={fieldDetails}
          metaData={metaData}
          moduleType={moduleType}
          tableColumns={tableColumns}
        />
        <Title
          content={VALIDATION_VISIBILITY_FORM_FIELD_CONFIG_STRINGS(t).VISIBILITY_TITLE}
          headingLevel={ETitleHeadingLevel.h4}
          className={cx(gClasses.MB10, gClasses.MT24, gClasses.FTwo16GrayV3)}
          size={ETitleSize.xs}
        />
        <VisibilityConfiguration
          setFieldDetails={setFieldDetails}
          fieldDetails={fieldDetails}
          metaData={metaData}
          moduleType={moduleType}
          noOfFields={noOfFields}
          tableUUID={tableUUID}
          isTableField={isTableField}
        />
      </div>
    );
  }

  export default ValidationAndVisibilityConfiguration;
