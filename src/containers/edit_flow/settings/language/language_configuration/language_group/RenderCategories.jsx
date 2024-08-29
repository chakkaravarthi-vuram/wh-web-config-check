/* eslint-disable no-irregular-whitespace */
import React from 'react';
import gClasses from 'scss/Typography.module.scss';
import cx from 'classnames/bind';
import { keydownOrKeypessEnterHandle } from 'utils/UtilityFunctions';
import { ARIA_ROLES, BS } from 'utils/UIConstants';
import jsUtils, { cloneDeep, isEqual } from 'utils/jsUtility';
import ChevronIconV2 from 'assets/icons/ChevronIconV2';
import ReadOnlyText from 'components/form_components/read_only_text/ReadOnlyText';
import { TextInput, Variant, Size, TextArea } from '@workhall-pvt-lmt/wh-ui-library';
import parse from 'html-react-parser';
import styles from './LanguageGroup.module.scss';
import { getAccordionTitle } from './LanguageGroup.utils';
import { LANGAUGE_SETTINGS_STRINGS } from '../../LanguageSettings.strings';
import { EMPTY_STRING } from '../../../../../../utils/strings/CommonStrings';
import ErrorIcon from '../../../../../../assets/icons/flow/ErrorIcon';
import { isObjectNested } from '../../../../../../utils/UtilityFunctions';

function Accordion({
  languageTranslationError, accordionKey, title, children, handleAccordionToggle, openStates,
  setOpenStates, memoizedOpenStates, translateLanguage, t,
}) {
  const isFirstLevelParent = !title?.includes('.');
  let hasErrorChild = false;
  Object?.keys?.(languageTranslationError)?.forEach((errorId) => {
    if (errorId.includes(accordionKey)) hasErrorChild = true;
  });
  return (
    <div className={cx(
      isFirstLevelParent && (cx(styles.GroupingContainer, hasErrorChild && styles.ErrorBorder)),
      gClasses.MB4)
    }
    >
      <div
        className={cx(
          BS.D_FLEX,
          BS.JC_BETWEEN,
          gClasses.CenterV,
          !isFirstLevelParent ? styles.InnerGroupingContainer : styles.OuterGroupingContainer,
          hasErrorChild && !isFirstLevelParent && styles.InnerGroupingError,
          gClasses.CursorPointer,
          gClasses.ClickableElement,
          !isFirstLevelParent && cx(gClasses.PL12, gClasses.PR12),
        )}
        onClick={() => handleAccordionToggle(accordionKey, openStates, setOpenStates)}
        tabIndex={0}
        role="button"
        onKeyDown={(e) => keydownOrKeypessEnterHandle(e) && handleAccordionToggle(accordionKey, openStates, setOpenStates)}
      >
        <div
          className={cx(
            isFirstLevelParent ? gClasses.FTwo13Black : gClasses.FTwo13BlackV20,
            gClasses.FontWeight500,
          )}
          tabIndex={0}
          role="button"
        >
          {isFirstLevelParent ? jsUtils.capitalizeEachFirstLetter(title) : getAccordionTitle(title, t)}
        </div>
        <div className={BS.D_FLEX}>
          {hasErrorChild &&
            <div className={gClasses.MR8}>
              <ErrorIcon />
            </div>
          }
          <div>
          <ChevronIconV2
            role={ARIA_ROLES.BUTTON}
            tabIndex={0}
            ariaLabel={memoizedOpenStates?.[accordionKey] ? 'collapse section' : 'expand section'}
            className={cx(styles.ChevronIcon, !memoizedOpenStates?.[accordionKey] && gClasses.Rotate180, hasErrorChild && !isFirstLevelParent && styles.ChevronIconError)}
          />
          </div>
        </div>
      </div>
      {memoizedOpenStates?.[accordionKey] &&
      (
      <div
        className={cx(gClasses.MT6, gClasses.MB6)}
      >
        {isFirstLevelParent &&
          <div className={cx(styles.LanguageHeaderContainer, BS.D_FLEX, BS.JC_BETWEEN)}>
            <div className={cx(styles.HalfFlexBasis, gClasses.FTwo12BlackV20, gClasses.FontWeight500)}>
              {LANGAUGE_SETTINGS_STRINGS(t).LANGUAGE_CONFIGURATION.CONTENT.TRANSLATION_TABLE.ENGLISH_TEXT}
            </div>
            <div className={cx(styles.HalfFlexBasis, gClasses.FTwo12BlackV20, gClasses.FontWeight500)}>
              {LANGAUGE_SETTINGS_STRINGS(t).LANGUAGE_CONFIGURATION.CONTENT.TRANSLATION_TABLE.OTHER_LANGUAGE_TEXT + translateLanguage}
            </div>
          </div>
        }
        {children}
      </div>
      )}
    </div>
  );
}

function renderCategories(
  categories, translationData, savedTranslationData, translateLocale, languageTranslationError,
  localeFlowDataKey, dataChange, saveFlowTranslationData, handleAccordionToggle,
  openStates, setOpenStates, memoizedOpenStates, translateLanguage, t) {
  const categoriesComponent = Object.keys(categories).map((categoryName) => {
    // const [translatedValue, setTranslatedValue] = useState(categories?.[categoryName]?.[translateLocale]);
  if (typeof categories[categoryName] === 'object' && isObjectNested(categories[categoryName])) {
    return (
      <Accordion
        accordionKey={categoryName}
        title={categoryName}
        languageTranslationError={languageTranslationError}
        handleAccordionToggle={handleAccordionToggle}
        openStates={openStates}
        setOpenStates={setOpenStates}
        memoizedOpenStates={memoizedOpenStates}
        translateLanguage={translateLanguage}
        t={t}
      >
        {renderCategories(
        categories[categoryName],
        translationData,
        savedTranslationData,
        translateLocale,
        languageTranslationError,
        localeFlowDataKey,
        dataChange,
        saveFlowTranslationData,
        handleAccordionToggle,
        openStates,
        setOpenStates,
        memoizedOpenStates,
        translateLanguage,
        t,
      )}
      </Accordion>
    );
  } else {
    const key = categories?.[categoryName]?.newKey;
    const currentTranslationIndex = translationData?.findIndex?.((eachData) =>
                eachData?.newKey === categories?.[categoryName]?.newKey);
    const savedTranslationIndex = savedTranslationData?.findIndex?.((eachData) =>
    eachData.newKey === categories?.[categoryName]?.newKey);
    let isTranslationModified = false;
    if (currentTranslationIndex > -1 && savedTranslationIndex > -1) {
      isTranslationModified = !isEqual(translationData?.[currentTranslationIndex]?.[translateLocale],
        savedTranslationData[savedTranslationIndex][translateLocale]);
    }
    const languageDataIndex = translationData?.findIndex?.((eachData) =>
                eachData?.newKey === categories?.[categoryName]?.newKey);
    console.log(!key.includes('description') || !key.includes('instructions'), key, 'key check value');
    return (
      <div
        key={key}
        className={cx(BS.D_FLEX, gClasses.ML10, gClasses.PT6, gClasses.PB6, styles.BorderBottom)}
      >
        <div className={cx(styles.HalfFlexBasis, gClasses.CenterV)}>
          <ReadOnlyText
            id={key}
            hideLabel
            value={key.includes('instructions') ? parse(categories?.[categoryName]?.value) : categories?.[categoryName]?.value}
            ContentClass={cx(gClasses.FontWeight500, gClasses.FTwo13BlackV20)}
            className={styles.EnglishText}
          />
        </div>
        <div className={cx(styles.HalfFlexBasis, BS.D_FLEX, BS.W100)}>
          {(!key.includes('description') && !key.includes('instructions')) ? (
            <div
            className={styles.TranslateLanguage}
            >
              <TextInput
                id={`${key},translation`}
                size={Size.md}
                value={categories?.[categoryName]?.[translateLocale]}
                errorMessage={languageTranslationError?.[categories?.[categoryName]?.newKey] || EMPTY_STRING}
                isLoading={false}
                placeholder="Enter translation"
                inputInnerClassName={BS.W100}
                onChange={(e) => {
                  console.log('adfasdfasdfasdfasdfasdf', e?.target?.selectionStart, e?.target?.value);
                  const clonedLanguageData = cloneDeep(translationData);
                  if (languageDataIndex > -1) {
                    clonedLanguageData[languageDataIndex][translateLocale] = e?.target?.value;
                    // setTranslatedValue(e?.target?.value);
                    const clonedErrorList = cloneDeep(languageTranslationError);
                    Object?.keys?.(clonedErrorList)?.forEach((errorId) => {
                      if (errorId?.includes?.(categories?.[categoryName]?.newKey)) {
                        delete clonedErrorList?.[errorId];
                      }
                    });
                    dataChange?.({
                      [localeFlowDataKey]: clonedLanguageData,
                      [`original${localeFlowDataKey}`]: clonedLanguageData,
                      languageTranslationError: clonedErrorList,
                      updatedLanguageKey: key,
                      [`original${localeFlowDataKey}`]: clonedLanguageData,
                    });
                  }
                }}
                required
                readOnly={false}
                variant={Variant.border}
                inputClassName={!jsUtils.isEmpty(languageTranslationError?.[categories?.[categoryName]?.newKey]) && styles.InputBorder}
              />
            </div>
            ) : (
              <div className={styles.TranslateLanguage}>
                <TextArea
                  id={`${key},translation_input`}
                  value={categories?.[categoryName]?.[translateLocale]}
                  isLoading={false}
                  placeholder={LANGAUGE_SETTINGS_STRINGS(t).LANGUAGE_CONFIGURATION.CONTENT.TRANSLATION_TABLE.OTHER_LANGUAGE_PLACEHOLDER}
                  onChange={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    const clonedLanguageData = cloneDeep(translationData);
                    if (languageDataIndex > -1) {
                      clonedLanguageData[languageDataIndex][translateLocale] = e?.target?.value;
                      // setTranslatedValue(e?.target?.value);
                      const clonedErrorList = cloneDeep(languageTranslationError);
                      Object?.keys?.(clonedErrorList)?.forEach((errorId) => {
                        if (errorId?.includes?.(categories?.[categoryName]?.newKey)) {
                          delete clonedErrorList?.[errorId];
                        }
                      });
                      dataChange?.({
                        [localeFlowDataKey]: clonedLanguageData,
                        [`original${localeFlowDataKey}`]: clonedLanguageData,
                        languageTranslationError: clonedErrorList,
                        updatedLanguageKey: key,
                        [`original${localeFlowDataKey}`]: clonedLanguageData,
                      });
                    }
                  }}
                  errorMessage={languageTranslationError?.[categories?.[categoryName]?.newKey] || EMPTY_STRING}
                  size={Size.sm}
                  readOnly={false}
                  inputInnerClassName={!jsUtils.isEmpty(languageTranslationError?.[categories?.[categoryName]?.newKey]) && styles.InputBorder}
                />
              </div>
            )
          }
          {isTranslationModified &&
            <div
              className={cx(gClasses.FTwo12BlueV39, gClasses.FontWeight500, gClasses.MT6, gClasses.ML8)}
              onClick={() => {
                const clonedLanguageData = cloneDeep(translationData);
                const languageDataIndex = clonedLanguageData?.findIndex?.((eachData) =>
                eachData?.newKey === categories?.[categoryName]?.newKey);
                saveFlowTranslationData(
                  [cloneDeep(clonedLanguageData[languageDataIndex])],
                  translateLocale,
                  false,
                  false,
                  key,
                  true,
                );
              }}
              tabIndex={0}
              role="button"
              onKeyDown={(e) => keydownOrKeypessEnterHandle(e) &&
                saveFlowTranslationData(
                  [
                    categories?.[categoryName],
                  ],
                  translateLocale,
                  false,
                  false,
                  key,
                )}

            >
              {LANGAUGE_SETTINGS_STRINGS(t).LANGUAGE_CONFIGURATION.FOOTER.SAVE}
            </div>
          }
        </div>
      </div>
    );
  }
  });
  return categoriesComponent;
}

export default renderCategories;
