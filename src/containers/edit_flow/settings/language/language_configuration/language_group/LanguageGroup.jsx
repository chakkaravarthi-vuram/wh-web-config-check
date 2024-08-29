/* eslint-disable no-irregular-whitespace */
import React, { useEffect, useMemo, useState } from 'react';
import gClasses from 'scss/Typography.module.scss';
import cx from 'classnames/bind';
import jsUtils, { cloneDeep } from 'utils/jsUtility';
import { useTranslation } from 'react-i18next';
import { LANGAUGE_SETTINGS_STRINGS } from '../../LanguageSettings.strings';
import NoResultsIcon from '../../../../../../assets/icons/NoResultsIcon';
import renderCategories from './RenderCategories';

function LanguageGroup(props) {
  const { translateLanguage, translationData, dataChange, localeFlowDataKey, translateLocale,
    savedTranslationData, saveFlowTranslationData, languageTranslationError, searchText } = props;

  const { t } = useTranslation();

  const buildCategoryStructure = (jsonObjects) => {
    const categoryStructure = {};

    jsonObjects.forEach((jsonObject) => {
      const hierarchy = jsonObject?.key?.split('.');
      let current = categoryStructure;

      hierarchy.forEach((categoryName, index) => {
        const fullCategoryName = hierarchy.slice(0, index + 1).join('.');
        if (!current[fullCategoryName]) {
          if (index === hierarchy.length - 1) {
            current[fullCategoryName] =
            (fullCategoryName?.includes('step') || fullCategoryName?.includes('form') || ['general.title', 'general.description'].includes(fullCategoryName))
            ? [jsonObject]
            : jsonObject;
          } else {
            current[fullCategoryName] =
            (fullCategoryName?.includes('step') || fullCategoryName?.includes('form'))
            ? []
            : {};
          }
        } else if (index === hierarchy.length - 1) {
          if (!Array.isArray(current[fullCategoryName])) {
            current[fullCategoryName] = [current[fullCategoryName]];
          }
          current[fullCategoryName].push(jsonObject);
        }
        current = current[fullCategoryName];
      });
    });

    return categoryStructure;
  };

  const categoryStructure = buildCategoryStructure(cloneDeep(translationData)); // Construct the category structure

  const initializeOpenStates = (obj, path = [], openStates = {}) => {
    Object.keys(obj).forEach((key) => {
      const newPath = [...path, key];
      if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
        openStates[newPath.join('.')] = newPath.length !== 1;
        initializeOpenStates(obj[key], newPath, openStates);
      } else {
        openStates[newPath.join('.')] = false;
      }
    });

    return openStates;
  };

  const initialOpenStates = initializeOpenStates(cloneDeep(categoryStructure));
  const [openStates, setOpenStates] = useState(initialOpenStates);
  useEffect(() => {
    const newOpenStates = cloneDeep(openStates);
    if (!jsUtils.isEmpty(searchText)) {
      cloneDeep(translationData)?.forEach((category) => {
        const keyParts = category?.newKey?.split('.');
        const keyHierarchy = keyParts?.map((_, index) => keyParts?.slice(0, index + 1).join('.'));
        keyHierarchy.forEach((key) => {
          newOpenStates[key] = true;
        });
      });
      setOpenStates(newOpenStates);
    } else {
      cloneDeep(translationData)?.forEach((category) => {
        const keyParts = category?.newKey?.split('.');
        const keyHierarchy = keyParts?.map((_, index) => keyParts?.slice(0, index + 1).join('.'));
        keyHierarchy.forEach((key) => {
          newOpenStates[key] = false;
        });
      });
      setOpenStates(newOpenStates);
    }
  }, [searchText]);
  const memoizedOpenStates = useMemo(() => openStates, [openStates]);

  const updateChildAccordions = (parentKey, toggleState, openStates) => {
    const parentObject = cloneDeep(categoryStructure)?.[parentKey];
    if (parentObject && typeof parentObject === 'object') {
      Object.keys(parentObject).forEach((childKey) => {
        openStates[childKey] = toggleState;
        updateChildAccordions(childKey, toggleState, openStates);
      });
    }
  };

  const handleAccordionToggle = (key, openStates, setOpenStates) => {
    setOpenStates((prevOpenStates) => {
      const updatedOpenStates = { ...prevOpenStates };
      const toggleState = !updatedOpenStates[key];
      if (!toggleState) updateChildAccordions(key, toggleState, updatedOpenStates);
      updatedOpenStates[key] = toggleState;
      return updatedOpenStates;
    });
  };

  console.log('categoryStructure', categoryStructure, translationData);

  return (
    <div className={cx(gClasses.MT20, jsUtils.isEmpty(translationData) && gClasses.CenterH)}>
      {!jsUtils.isEmpty(translationData) ?
      renderCategories(
        categoryStructure,
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
      ) :
      (
        <div>
          <NoResultsIcon />
          <div className={cx(gClasses.FTwo12BlackV12, gClasses.FontWeight500, gClasses.MT30)}>
            {LANGAUGE_SETTINGS_STRINGS(t).LANGUAGE_CONFIGURATION.CONTENT.SEARCH.NO_RESULTS.TITLE}
          </div>
          <div className={cx(gClasses.FTwo11GrayV104, gClasses.MT5)}>
            {LANGAUGE_SETTINGS_STRINGS(t).LANGUAGE_CONFIGURATION.CONTENT.SEARCH.NO_RESULTS.SUB_TITLE}
          </div>
        </div>
      )}
    </div>
  );
}

export default LanguageGroup;
