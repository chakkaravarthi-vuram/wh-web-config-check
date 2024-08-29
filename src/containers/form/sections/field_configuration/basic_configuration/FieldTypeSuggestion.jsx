import React from 'react';
import { useTranslation } from 'react-i18next';
import cx from 'classnames/bind';
import { Link } from 'react-router-dom';
import { get, isEmpty } from '../../../../../utils/jsUtility';
import { getInitialFieldDataByFieldType, updateFieldTypeString } from './BasicConfiguration.utils';
import gClasses from '../../../../../scss/Typography.module.scss';
import { RESPONSE_FIELD_KEYS } from '../../../../../utils/constants/form/form.constant';

function FieldTypeSuggestion(props) {
  const { setFieldDetails, fieldDetails = {}, fieldTypeSuggestion, setFieldTypeSuggestion } = props;
  const { t } = useTranslation();

  const onYesClickHandler = () => {
    if (fieldTypeSuggestion?.fieldTypeData?.[RESPONSE_FIELD_KEYS.FIELD_TYPE]) {
      // if (fieldDetails?.[RESPONSE_FIELD_KEYS.FIELD_TYPE]) {
        const updatedFieldDetails = getInitialFieldDataByFieldType(fieldTypeSuggestion?.fieldTypeData?.fieldType, fieldDetails, t);
        if (!isEmpty(fieldTypeSuggestion?.fieldTypeData?.options)) {
          setFieldDetails({
            ...updatedFieldDetails,
            values: fieldTypeSuggestion?.fieldTypeData?.options.toString(),
          });
        }
        setFieldDetails({
          ...updatedFieldDetails,
          [RESPONSE_FIELD_KEYS.FIELD_TYPE]: fieldTypeSuggestion?.fieldTypeData?.[RESPONSE_FIELD_KEYS.FIELD_TYPE],
        });
      // }

      setFieldTypeSuggestion({ ...fieldTypeSuggestion, isFieldSuggestionEnabled: false });
    }
  };

  const onNoClickHandler = () => {
    setFieldTypeSuggestion({ ...fieldTypeSuggestion, isFieldSuggestionEnabled: false, disableFieldTypeSuggestion: true });
  };

  return (
    <div>
      {(
        (fieldDetails[RESPONSE_FIELD_KEYS.FIELD_NAME]?.length > 1) &&
        (!fieldTypeSuggestion.disableFieldTypeSuggestion) &&
        fieldTypeSuggestion.isFieldSuggestionEnabled &&
        fieldTypeSuggestion?.fieldTypeData.length !== 0 &&
        fieldTypeSuggestion?.fieldTypeData?.[RESPONSE_FIELD_KEYS.FIELD_TYPE] !== fieldDetails?.[RESPONSE_FIELD_KEYS.FIELD_TYPE]
      ) && (
          <div
            className={cx(
              gClasses.FTwo13GrayV14,
              gClasses.MT16,
            )}
          >
            {`${t('form_field_strings.field_config.the')}
            '${updateFieldTypeString(get(fieldTypeSuggestion,
            ['fieldTypeData', 'fieldType'],
            null), t)}' ${t('form_field_strings.field_config.form_field_suggestion')}`}
            <Link
              className={cx(gClasses.FTwo13, gClasses.ML5)}
              onClick={onYesClickHandler}
            >
              {t('form_field_strings.field_config.field_type_suggestion.yes')}
            </Link>
            {' or '}
            <Link
              className={cx(gClasses.FTwo13)}
              onClick={onNoClickHandler}
            >
              {t('form_field_strings.field_config.field_type_suggestion.no')}
            </Link>
          </div>
        )
      }
    </div>

  );
}
export default FieldTypeSuggestion;
