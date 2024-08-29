import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import cx from 'classnames/bind';
import { BS } from 'utils/UIConstants';
import gClasses from 'scss/Typography.module.scss';
import {
  updateFlowDataChange,
  updateFlowStateChange,
} from 'redux/reducer/EditFlowReducer';
import { cloneDeep, isEmpty, unset } from 'utils/jsUtility';
import { EMPTY_STRING } from 'utils/strings/CommonStrings';
import { KEY_CODES } from 'utils/Constants';
import { getFlowLanguagesTranslationStatusApiThunk, getFlowDetailsByLocaleApiThunk, saveFlowDetailsByLocaleApiThunk } from 'redux/actions/EditFlow.Action';
import { getLocaleLookUpDataThunk } from 'redux/actions/LocaleLookUp.Action';
import styles from './SettingsConfiguration.module.scss';
import StepperHeader from '../step_configuration/step_components/header/StepperHeader';
import Stepper from '../step_configuration/step_components/stepper/Stepper';
import {
  SETTINGS_STRINGS,
  getStepperDetails,
  validateLanguageTranslationFlowData,
  SETTINGS_PAGE_TAB,
} from './SettingsConfiguration.utils';
import Identifier from '../settings/identifier/Identifier';
import Category from '../settings/category/Category';
import Security from '../security/Security';
import DashboardSettings from '../settings/dashboard/DashboardSettings';
import { FLOW_STRINGS } from '../EditFlow.strings';
import LanguageSettings from '../settings/language/LanguageSettings';
import TechnicalConfiguration from '../settings/technical_configuration/TechnicalConfiguration';
import { FLOW_TECHNICAL_CONFIG_ID } from '../settings/technical_configuration/TechnicalConfiguration.strings';
import { safeTrim } from '../../../utils/jsUtility';
import { SHORT_CODE_REGEX } from '../../../utils/strings/Regex';
import { constructJoiObject } from '../../../utils/ValidationConstants';
import { technicalConfigSchema } from '../EditFlow.validation.schema';
import { validate } from '../../../utils/UtilityFunctions';

function SettingsConfiguration(props) {
  const {
    flowData,
    error_list = {},
    serverError = {},
    flowData: { version, isTechnicalRefercenNameSaved, isFlowShortCodeSaved },
    onFlowDataChange,
    currentSettingsPage, // security-0, scheduler-1, addon-2
    onFlowStateChange,
    isTrialDisplayed,
    bottomActionButtons,
    isEditFlowView,
    updateStepperTab,
    getFlowLanguagesTranslationStatusApi,
    getFlowDetailsByLocaleApi,
    locale_list,
    getLocaleLookUpData,
    translateLanguagesList,
    localeFlowData,
    originalLocaleData,
    savedLocaleFlowData,
    saveFlowDetailsByLocaleApi,
    isLanguageConfigurationModalOpen,
    languageTranslationError,
    updatedLanguageKey,
    isFlowTranslationStatusLoading,
    isTranslationDataLoading,
  } = props;
  const { t } = useTranslation();

  const [localeList, setLocaleList] = useState([]);

  useEffect(() => {
    getLocaleLookUpData({ acc_locale: 1 });
  }, []);

  useEffect(() => {
    const localeList = locale_list?.filter((locale) => locale.language !== 'English');
    setLocaleList(localeList);
  }, [locale_list]);

  const handleStepperChange = (newSettingsPage) => {
    updateStepperTab(newSettingsPage);
  };

  const stepperDetails = getStepperDetails(handleStepperChange, localeList);

  const removeServerError = (id) => {
    const { onFlowStateChange } = props;
    const clonedServerErrors = cloneDeep(serverError);
    if (clonedServerErrors?.[id]) delete clonedServerErrors[id];
    onFlowStateChange({ server_error: clonedServerErrors });
  };

  const containerHeight = isTrialDisplayed
    ? cx(styles.TrialHeight)
    : styles.ContainerHeight;

  const { HEADER } = SETTINGS_STRINGS(t);

  const saveFlowTranslationData = (translationData, locale, closeModal, isValidateOnly = false, updateKey = EMPTY_STRING, saveSingleField = false) => {
    const errorList = validateLanguageTranslationFlowData(cloneDeep(translationData), t, locale);
    if (isEmpty(errorList)) {
      const postData = cloneDeep(translationData)?.map((eachData) => {
        delete eachData?.newKey;
        delete eachData?.isModified;
        return eachData;
      });
      !isValidateOnly && saveFlowDetailsByLocaleApi({
        flow_id: flowData?.flow_id,
        locale: locale,
        flow_data: postData,
       },
        closeModal,
        updateKey,
        saveSingleField,
      );
    } else {
      onFlowDataChange({ languageTranslationError: { ...languageTranslationError, ...errorList } });
    }
  };

  const toggleLanguageConfigurationModal = () => {
    onFlowDataChange({ isLanguageConfigurationModalOpen: !isLanguageConfigurationModalOpen, languageTranslationError: {}, updatedLanguageKey: EMPTY_STRING });
  };

  const validateKeys = (value, key, errorList = {}, isOnBlur = false) => {
    let keyError = {};
    if ((!isEmpty(errorList?.[key]) || isOnBlur)) {
      keyError = validate({ [key]: value }, constructJoiObject({ [key]: technicalConfigSchema(t)?.[key] }));
      if (!keyError?.[key]) delete errorList[key];
    }
    return {
      ...errorList,
      ...(keyError || {}),
    };
  };

  const onFlowReferenceNameChange = (event, isOnBlur) => {
    const { onFlowDataChange } = props;
    const {
      target: { value, id },
    } = event;
    let { error_list } = cloneDeep(flowData);
    const flowRefName = isOnBlur ? safeTrim(value) : value;
    error_list = validateKeys(flowRefName, id, error_list, isOnBlur);
    onFlowDataChange({ technical_reference_name: flowRefName, error_list });
    removeServerError(id);
  };

  const onFlowShortCodeChangeHandler = (event, isOnBlur) => {
    const { onFlowDataChange } = props;
    let { error_list } = cloneDeep(flowData);
    const {
      target: { value = EMPTY_STRING, id },
    } = event;
    let shortCode = isOnBlur ? safeTrim(value) : value;
    shortCode = shortCode.toString().toUpperCase();
    const val = shortCode.slice(shortCode.length - 1, shortCode.length);
    error_list = validateKeys(shortCode, id, error_list, isOnBlur);
    if (!(SHORT_CODE_REGEX.test(val)) || event.target.value === '') {
      onFlowDataChange({ flow_short_code: shortCode, error_list });
    }
  };
  let currentComponent = null;

  switch (currentSettingsPage) {
    case SETTINGS_PAGE_TAB.SECURITY:
      currentComponent = <Security />;
      break;
    case SETTINGS_PAGE_TAB.DASHBOARD:
      currentComponent = <DashboardSettings />;
      break;
    case SETTINGS_PAGE_TAB.ADDON:
      currentComponent = (
        <div className={cx(gClasses.PT5, BS.W50)}>
          <div
            className={cx(
              gClasses.SectionSubTitle,
              gClasses.MB10,
              gClasses.MT5,
            )}
          >
            {t(FLOW_STRINGS.SETTINGS.IDENTIFIER.TITLE)}
          </div>
          <div>
            <Identifier />
          </div>
          <div
            className={cx(
              gClasses.SectionSubTitle,
              gClasses.MB10,
              gClasses.MT30,
            )}
          >
            {t(FLOW_STRINGS.SETTINGS.CATEGORY.TITLE)}
          </div>
          <div className={styles.categoryClass}>
            <Category
              popperClasses={styles.PopperClass}
              errorList={{ ...error_list, ...serverError }}
              removeCategoryServerError={removeServerError}
            />
          </div>
          <div>
            <TechnicalConfiguration
              shortCode={flowData.flow_short_code}
              referenceName={flowData.technical_reference_name}
              disableShortCode={isFlowShortCodeSaved}
              disableReferenceName={isTechnicalRefercenNameSaved}
              idList={FLOW_TECHNICAL_CONFIG_ID}
              errorList={{ ...error_list, ...serverError }}
              referenceNameChangeHandler={onFlowReferenceNameChange}
              shortCodeChangeHandler={onFlowShortCodeChangeHandler}
              entityUuid={flowData.flow_uuid}
              name={flowData.flow_name}
            />
          </div>
        </div>
      );
      break;
    case SETTINGS_PAGE_TAB.LANGUAGE:
      currentComponent = (
        <LanguageSettings
          getFlowLanguagesTranslationStatusApi={getFlowLanguagesTranslationStatusApi}
          getFlowDetailsByLocaleApi={getFlowDetailsByLocaleApi}
          languageTranslationStatusParams={{
            flow_id: flowData?.flow_id,
          }}
          localeList={localeList}
          translateLanguagesList={translateLanguagesList}
          translationData={localeFlowData}
          originalLocaleData={originalLocaleData}
          savedTranslationData={savedLocaleFlowData}
          localeFlowDataKey="localeFlowData"
          dataChange={onFlowDataChange}
          saveFlowTranslationData={saveFlowTranslationData}
          toggleLanguageConfigurationModal={toggleLanguageConfigurationModal}
          isLanguageConfigurationModalOpen={isLanguageConfigurationModalOpen}
          languageTranslationError={languageTranslationError}
          updatedLanguageKey={updatedLanguageKey}
          isLanguageListLoading={isFlowTranslationStatusLoading}
          isTranslationDataLoading={isTranslationDataLoading}
        />
      );
      break;
      default:
      break;
  }

  const onCloseClick = () => {
    onFlowStateChange({
      flowSettingsModalVisibility: false,
      currentSettingsPage: SETTINGS_PAGE_TAB.SECURITY,
    });
    const clonedFlowData = cloneDeep(flowData);
    unset(clonedFlowData, ['error_list', 'owners']);
    unset(clonedFlowData, ['error_list', 'reassignedOwners']);
    unset(clonedFlowData, ['error_list', 'viewers']);
    unset(clonedFlowData, ['error_list', 'custom_identifier']);
    unset(clonedFlowData, ['error_list', 'task_identifier']);
    unset(clonedFlowData, ['error_list', 'category']);
    onFlowDataChange(clonedFlowData);
  };

  const handleEscClose = (event) => {
    if (event.keyCode === KEY_CODES.ESCAPE) {
      onCloseClick();
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleEscClose);
  }, []);

  return (
    <div className={cx(styles.ConfigContainer, BS.W100)}>
      <div className={cx(styles.CreationContainer)}>
        <div className={styles.ConfigurationHeader}>
          <StepperHeader
            pageTitle={HEADER.pageTitle}
            subTitle={HEADER.subTitle}
            hideBreadcrumb
            isCloseIcon
            onCloseIconClick={onCloseClick}
          />
          <Stepper
            stepperDetails={stepperDetails}
            currentProgress={currentSettingsPage}
            savedProgress={(version > 1 || isEditFlowView) ? 4 : currentSettingsPage + 1}
            className={styles.StepperClass}
            stepIndexClass={gClasses.CenterVH}
          />
        </div>
        <div className={cx(styles.ComponentContainer, containerHeight)}>
          {currentComponent}
        </div>
        <div
          className={cx(
            styles.ConfigurationFooter,
            BS.W100,
            isTrialDisplayed && styles.FooterHeight,
            gClasses.ZIndex2,
            styles.B0,
          )}
        >
          {bottomActionButtons}
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = ({
  NavBarReducer,
  EditFlowReducer,
  CreateTaskReducer,
  LocaleLookUpReducer,
}) => {
  return {
    flowData: EditFlowReducer.flowData,
    error_list: EditFlowReducer.flowData.error_list,
    serverError: EditFlowReducer.server_error,
    isTrialDisplayed: NavBarReducer.isTrialDisplayed,
    isEditFlowView: EditFlowReducer.isEditFlowView,
    state: CreateTaskReducer,
    locale_list: LocaleLookUpReducer.locale_list,
    translateLanguagesList: EditFlowReducer?.flowData?.translateLanguagesList || [],
    localeFlowData: EditFlowReducer?.flowData?.localeFlowData || [],
    originalLocaleData: EditFlowReducer?.flowData?.originalLocaleData || [],
    savedLocaleFlowData: EditFlowReducer?.flowData?.savedLocaleFlowData || [],
    isLanguageConfigurationModalOpen: EditFlowReducer?.flowData?.isLanguageConfigurationModalOpen || false,
    languageTranslationError: EditFlowReducer?.flowData?.languageTranslationError || {},
    updatedLanguageKey: EditFlowReducer?.flowData?.updatedLanguageKey || EMPTY_STRING,
    isFlowTranslationStatusLoading: EditFlowReducer?.flowData?.isFlowTranslationStatusLoading || false,
    isTranslationDataLoading: EditFlowReducer?.flowData?.isTranslationDataLoading || false,
  };
};

const mapDispatchToProps = {
  onFlowDataChange: updateFlowDataChange,
  onFlowStateChange: updateFlowStateChange,
  getFlowLanguagesTranslationStatusApi: getFlowLanguagesTranslationStatusApiThunk,
  getLocaleLookUpData: getLocaleLookUpDataThunk,
  getFlowDetailsByLocaleApi: getFlowDetailsByLocaleApiThunk,
  saveFlowDetailsByLocaleApi: saveFlowDetailsByLocaleApiThunk,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SettingsConfiguration);
