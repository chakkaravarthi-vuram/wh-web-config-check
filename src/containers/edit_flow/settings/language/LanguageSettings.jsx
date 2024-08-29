import React, { lazy, useEffect, useState } from 'react';
import cx from 'classnames/bind';
import { useTranslation } from 'react-i18next';
import gClasses from 'scss/Typography.module.scss';
import { EMPTY_STRING } from 'utils/strings/CommonStrings';
import { LANGAUGE_SETTINGS_STRINGS } from './LanguageSettings.strings';
import { getLanguageTableData } from './LanguageSettings.utils';
import LanguageConfiguration from './language_configuration/LanguageConfiguration';
import styles from './LanguageSettings.module.scss';

const Table = lazy(() => import('components/table/Table'));

function LanguageSettings(props) {
  const {
    translateLanguagesList = [],
    getFlowLanguagesTranslationStatusApi,
    getFlowDetailsByLocaleApi,
    languageTranslationStatusParams,
    translationData,
    savedTranslationData,
    localeFlowDataKey,
    localeList,
    dataChange,
    saveFlowTranslationData,
    isLanguageConfigurationModalOpen,
    toggleLanguageConfigurationModal,
    languageTranslationError,
    updatedLanguageKey,
    originalLocaleData,
    isTranslationDataLoading,
    isLanguageListLoading,
  } = props;

  const { t } = useTranslation();

  const [translateLanguage, setTranslateLanguage] = useState({
    language: EMPTY_STRING,
    locale: EMPTY_STRING,
  });

  useEffect(() => {
    getFlowLanguagesTranslationStatusApi(languageTranslationStatusParams);
  }, []);

  const onClickTranslate = (language, locale) => {
    setTranslateLanguage({
      language: language,
      locale: locale,
    });
    toggleLanguageConfigurationModal();
    getFlowDetailsByLocaleApi({
      ...languageTranslationStatusParams,
      locale: locale,
    });
  };

  return (
    <div>
      <Table
        header={LANGAUGE_SETTINGS_STRINGS(t).LANGUAGE_TABLE_HEADERS}
        data={getLanguageTableData(translateLanguagesList, t, onClickTranslate, localeList)}
        className={styles.TranslationTable}
        tableDataClassname={cx(gClasses.FTwo12GrayV89, gClasses.P0)}
        headerDataClassname={cx(gClasses.FTwo12BlackV21, gClasses.FontWeight500)}
        isDataLoading={isLanguageListLoading}
        paddingTd={gClasses.P0}
      />
      {
        isLanguageConfigurationModalOpen &&
        (
          <LanguageConfiguration
            onCloseModal={() => toggleLanguageConfigurationModal()}
            translateLanguage={translateLanguage?.language}
            translateLocale={translateLanguage?.locale}
            translationData={translationData}
            savedTranslationData={savedTranslationData}
            localeFlowDataKey={localeFlowDataKey}
            dataChange={dataChange}
            saveFlowTranslationData={saveFlowTranslationData}
            originalLocaleData={originalLocaleData}
            languageTranslationError={languageTranslationError}
            updatedLanguageKey={updatedLanguageKey}
            isTranslationDataLoading={isTranslationDataLoading}
          />
        )
      }
    </div>
  );
}

export default LanguageSettings;
