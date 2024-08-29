import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import cx from 'classnames/bind';
import { useTranslation } from 'react-i18next';
import { BS } from 'utils/UIConstants';
import { hasOwn } from 'utils/UtilityFunctions';
import { EMPTY_STRING } from 'utils/strings/CommonStrings';
import { getDataListMetricsSelector } from 'redux/selectors/CreateDataList.selectors';
import { dataListStateChangeAction } from 'redux/reducer/CreateDataListReducer';
import jsUtils, { isEmpty } from 'utils/jsUtility';
import StepperHeader from 'containers/edit_flow/step_configuration/step_components/header/StepperHeader';
import Stepper from 'containers/edit_flow/step_configuration/step_components/stepper/Stepper';
import { KEY_CODES } from 'utils/Constants';
import { cloneDeep, safeTrim } from '../../../../../utils/jsUtility';
import styles from './SettingsConfiguration.module.scss';
import gClasses from '../../../../../scss/Typography.module.scss';
import Identifier from '../identifier/Identifier';
import Security from '../../security/Security';
import Category from '../category/Category';
import {
  SETTINGS_STRINGS,
  getStepperDetails,
} from './SettingsConfiguration.utils';
import DashboardSettings from '../dashboard/DashboardSettings';
import TechnicalConfiguration from '../../../../edit_flow/settings/technical_configuration/TechnicalConfiguration';
import { DATA_LIST_TECHNICAL_CONFIG_ID } from '../../../../edit_flow/settings/technical_configuration/TechnicalConfiguration.strings';
import { constructJoiObject } from '../../../../../utils/ValidationConstants';
import { technicalConfigSchema } from '../../../../edit_flow/EditFlow.validation.schema';
import { validate } from '../../../../../utils/UtilityFunctions';
import { dataListValuesStateChangeAction } from '../../../../../redux/reducer/CreateDataListReducer';
import { SHORT_CODE_REGEX } from '../../../../../utils/strings/Regex';

function Settings(props) {
  const {
    metricsDataList: { metrics },
    onDataListStateChange,
    currentSettingsPage,
    isTrialDisplayed,
    bottomActionButtons,
    handleSettingsCloseHandler,
    isEditDataListView,
    onNextClicked,
    datalistDetails,
    datalistDetails: { isTechnicalRefercenNameSaved, isDatalistShortCodeSaved },
    errorList,
    dataListValuesStateChangeAction,
  } = props;
  const { t } = useTranslation();

  const { HEADER } = SETTINGS_STRINGS(t);

  useEffect(() => {
    let clonedMetrics = jsUtils.cloneDeep(metrics);
    if (clonedMetrics && !hasOwn(clonedMetrics, 'metric_fields')) {
      clonedMetrics = {
        metric_fields: [],
        isShowMetricAdd: false,
        lstAllFields: [],
        l_field: EMPTY_STRING,
        err_l_field: {},
      };
      onDataListStateChange(clonedMetrics, 'metrics');
    }
    return () => {};
  }, []);

  const handleEscClose = (event) => {
    if (event.keyCode === KEY_CODES.ESCAPE) {
      handleSettingsCloseHandler();
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleEscClose);
  }, []);

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

  const onDatalistReferenceNameChange = (event, isOnBlur) => {
    const {
      target: { value, id },
    } = event;
    let { error_list } = cloneDeep(props);
    const flowRefName = isOnBlur ? safeTrim(value) : value;
    error_list = validateKeys(flowRefName, id, error_list, isOnBlur);
    dataListValuesStateChangeAction([
      { value: flowRefName, id: 'technical_reference_name' },
      { value: error_list, id: 'error_list' },
    ]);
  };

  const onDatalistShortCodeChangeHandler = (event, isOnBlur) => {
    let { error_list } = cloneDeep(props);
    const {
      target: { value = EMPTY_STRING, id },
    } = event;
    let shortCode = isOnBlur ? safeTrim(value) : value;
    shortCode = shortCode.toString().toUpperCase();
    const val = shortCode.slice(shortCode.length - 1, shortCode.length);
    error_list = validateKeys(shortCode, id, error_list, isOnBlur);
    if (!(SHORT_CODE_REGEX.test(val)) || event.target.value === '') {
      dataListValuesStateChangeAction([
        { value: shortCode, id: 'data_list_short_code' },
        { value: error_list, id: 'error_list' },
      ]);
    }
  };

  const securitySettings = (
    <div>
      <div className={cx(gClasses.SectionSubTitle, gClasses.MB15)}>
        {SETTINGS_STRINGS(t).PAGE_HEADERS.SECURITY}
      </div>
      <Security datalistDetails={datalistDetails} />
    </div>
  );

  const dashboardSettings = (
    <div
      className={cx(gClasses.MT5, {
        [BS.D_NONE]: !(metrics && hasOwn(metrics, 'metric_fields')),
      })}
    >
      <div
        className={cx(gClasses.SectionSubTitle, gClasses.MB10, gClasses.MT5, gClasses.FontWeightBold)}
      >
        {SETTINGS_STRINGS(t).PAGE_HEADERS.DASHBOARD}
      </div>
      <DashboardSettings metrics={metrics} />
    </div>
  );

  const otherSettings = (
    <div className={cx(gClasses.PT5, BS.W50)}>
      <div
        className={cx(gClasses.SectionSubTitle, gClasses.MB10, gClasses.MT5)}
      >
        {SETTINGS_STRINGS(t).PAGE_HEADERS.ADDON}
      </div>
      <div>
        <div>
          <Identifier />
        </div>
        <Category className={styles.Category} disablePopper />
      </div>
      <div>
        <TechnicalConfiguration
          shortCode={datalistDetails.data_list_short_code}
          referenceName={datalistDetails.technical_reference_name}
          disableShortCode={isDatalistShortCodeSaved}
          disableReferenceName={isTechnicalRefercenNameSaved}
          idList={DATA_LIST_TECHNICAL_CONFIG_ID}
          errorList={errorList}
          referenceNameChangeHandler={onDatalistReferenceNameChange}
          shortCodeChangeHandler={onDatalistShortCodeChangeHandler}
          entityUuid={datalistDetails.data_list_uuid}
          name={datalistDetails.data_list_name}
        />
      </div>
    </div>
  );

  const handleStepperChange = (nextSettingsPage) => {
    if (isEmpty(metrics?.err_l_field)) {
      if (currentSettingsPage === 0) {
        onNextClicked(nextSettingsPage);
      } else {
        onDataListStateChange(nextSettingsPage, 'currentSettingsPage');
      }
    }
  };

  const stepperDetails = getStepperDetails(handleStepperChange, t);

  let currentComponent = null;

  switch (currentSettingsPage) {
    case 0:
      currentComponent = securitySettings;
      break;
    case 1:
      currentComponent = dashboardSettings;
      break;
    case 2:
      currentComponent = otherSettings;
      break;
    default:
      break;
  }

  const containerHeight = isTrialDisplayed
    ? cx(styles.TrialHeight)
    : styles.ContainerHeight;

  return (
    <div className={cx(styles.ConfigContainer, BS.W100)}>
      <div className={cx(styles.CreationContainer)}>
        <div className={styles.ConfigurationHeader}>
          <StepperHeader
            pageTitle={HEADER.pageTitle}
            subTitle={HEADER.subTitle}
            hideBreadcrumb
            isCloseIcon
            onCloseIconClick={handleSettingsCloseHandler}
          />
          <Stepper
            stepperDetails={stepperDetails}
            currentProgress={currentSettingsPage}
            savedProgress={isEditDataListView ? 3 : currentSettingsPage + 1}
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

const mapStateToProps = (state) => {
  return {
    metricsDataList: getDataListMetricsSelector(state.CreateDataListReducer),
    currentSettingsPage: state.CreateDataListReducer.currentSettingsPage,
    isTrialDisplayed: state.NavBarReducer.isTrialDisplayed,
    error_list: state.error_list,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onDataListStateChange: (data, id) => {
      dispatch(dataListStateChangeAction(data, id));
    },
    dataListValuesStateChangeAction: (data) => {
      dispatch(dataListValuesStateChangeAction(data));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
