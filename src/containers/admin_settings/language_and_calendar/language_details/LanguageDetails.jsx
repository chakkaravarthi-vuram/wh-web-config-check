import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'reactstrap';
import { useTranslation } from 'react-i18next';
import { isEmpty } from 'utils/jsUtility';
import Dropdown from '../../../../components/form_components/dropdown/Dropdown';
import FormTitle from '../../../../components/form_components/form_title/FormTitle';
import CheckboxGroup from '../../../../components/form_components/checkbox_group/CheckboxGroup';

import { L_C_FORM } from '../LanguagesAndCalendar.strings';

function LanguageDetails(props) {
  const {
    formDetails,
    getLookupForSelectedDropDown,
    errors,
    isDataLoading,
    onChangeToggler,
    LangAndTimeDetailsLabels,
    primaryLanguageOptions,
    onLanguagesChange,
    onPrimaryLanguageChange,
  } = props;
  const { t } = useTranslation();
  const { acc_locale, primary_locale, locale_list } = formDetails;
  const [primaryLanguage, setPrimaryLanguage] = useState();

  const selectedAccLocales = acc_locale?.map(
    (current_locale) => current_locale?.locale || current_locale,
  );

  useEffect(() => {
    if (!isEmpty(acc_locale)) {
      const primaryOptionsData = locale_list.filter((localeData) => selectedAccLocales.includes(localeData.value));
      setPrimaryLanguage(primaryOptionsData);
    }
    if (getLookupForSelectedDropDown) getLookupForSelectedDropDown(L_C_FORM.L_DROPDOWN.ID);
  }, [acc_locale, locale_list?.length]);

  return (
    <>
      <FormTitle
        categoryFontStyle={LangAndTimeDetailsLabels}
        isDataLoading={isDataLoading}
      >
        {t(L_C_FORM.LANGUAGAE_DETAILS)}
      </FormTitle>
      <Row>
        <Col sm={12} lg={6}>
          <Dropdown
            id={L_C_FORM.L_DROPDOWN.ID}
            optionList={locale_list}
            label={t(L_C_FORM.L_DROPDOWN.LABEL)}
            onChange={onLanguagesChange}
            placeholder={t(L_C_FORM.L_DROPDOWN.PLACEHOLDER)}
            selectedValue={selectedAccLocales}
            loadData={getLookupForSelectedDropDown}
            errorMessage={errors[L_C_FORM.LOCALE_DROPDOWN.ID]}
            isDataLoading={isDataLoading}
            setSelectedValue
            isMultiSelect
          />
        </Col>
        <Col sm={12} lg={6}>
          <Dropdown
            id={L_C_FORM.LOCALE_DROPDOWN.ID}
            optionList={!isEmpty(primaryLanguageOptions) ? primaryLanguageOptions : primaryLanguage}
            label={t(L_C_FORM.LOCALE_DROPDOWN.LABEL)}
            onChange={onPrimaryLanguageChange}
            placeholder={t(L_C_FORM.LOCALE_DROPDOWN.PLACEHOLDER)}
            selectedValue={primary_locale}
            loadData={getLookupForSelectedDropDown}
            errorMessage={errors[L_C_FORM.L_DROPDOWN.ID] || errors.primary_locale}
            locale_list={formDetails.locale_listlocale_list}
            isDataLoading={isDataLoading}
            setSelectedValue
          />
        </Col>
      </Row>
      <CheckboxGroup
        id={L_C_FORM.LANGUAGE_LOCALE_CB.ID}
        label={L_C_FORM.LANGUAGE_LOCALE_CB.ID}
        optionList={L_C_FORM.LANGUAGE_LOCALE_CB(t).OPTION_LIST}
        onClick={() =>
          onChangeToggler(
            L_C_FORM.RESTRICT_LANGUAGE_LOCALE_UPDATE,
            formDetails.allow_update_language_locale,
          )
        }
        selectedValues={formDetails.allow_update_language_locale ? [1] : []}
        hideLabel
        isDataLoading={isDataLoading}
        key="language_details_cb1"
      />
    </>
  );
}

LanguageDetails.defaultProps = {
  formDetails: {},
  onChange: null,
  getLookupForSelectedDropDown: null,
  errors: {},
  isDataLoading: false,
};

LanguageDetails.propTypes = {
  formDetails: PropTypes.objectOf(PropTypes.any),
  onChange: PropTypes.func,
  getLookupForSelectedDropDown: PropTypes.func,
  errors: PropTypes.objectOf(PropTypes.any),
  isDataLoading: PropTypes.bool,
  onChangeToggler: PropTypes.func.isRequired,
};

export default LanguageDetails;
