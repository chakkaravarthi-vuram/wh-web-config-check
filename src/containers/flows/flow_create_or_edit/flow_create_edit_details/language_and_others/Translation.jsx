import { Text } from '@workhall-pvt-lmt/wh-ui-library';
import cx from 'classnames/bind';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import gClasses from 'scss/Typography.module.scss';
import {
  getFlowDetailsByLocaleApiThunk,
  getFlowLanguagesTranslationStatusApiThunk,
  saveFlowDetailsByLocaleApiThunk,
} from '../../../../../redux/actions/EditFlow.Action';
import { getLocaleLookUpDataThunk } from '../../../../../redux/actions/LocaleLookUp.Action';
import {
  updateFlowDataChange,
  updateFlowStateChange,
} from '../../../../../redux/reducer/EditFlowReducer';
import { EMPTY_STRING } from '../../../../../utils/strings/CommonStrings';
import { FLOW_ADDON_STRINGS } from '../../../flow_landing/flow_details/flow_add_on/FlowAddOn.strings';
import { validateLanguageTranslationFlowData } from '../../../../edit_flow/settings_configuration/SettingsConfiguration.utils';
import { cloneDeep, isEmpty } from '../../../../../utils/jsUtility';
import LanguageSettings from '../../../../edit_flow/settings/language/LanguageSettings';

function Translation(props) {
  const {
    metaData,
    // addOn,
    // dispatch,

    flowData,
    locale_list,
    translateLanguagesList,
    localeFlowData,
    originalLocaleData,
    savedLocaleFlowData,
    isLanguageConfigurationModalOpen,
    languageTranslationError,
    updatedLanguageKey,
    isFlowTranslationStatusLoading,
    isTranslationDataLoading,

    onFlowDataChange,
    getFlowLanguagesTranslationStatusApi,
    getFlowDetailsByLocaleApi,
    saveFlowDetailsByLocaleApi,
  } = props;
  const { t } = useTranslation();
  const [localeList, setLocaleList] = useState([]);
  const { TITLE } = FLOW_ADDON_STRINGS(t).TRANSLATION;

  useEffect(() => {
    const localeList = locale_list?.filter(
      (locale) => locale.language !== 'English',
    );
    setLocaleList(localeList);
  }, [locale_list]);

  // const getTableRowText = (dataText) => (
  //   <Text
  //     content={dataText}
  //     className={cx(gClasses.FTwo12BlackV18, gClasses.FontWeight500)}
  //   />
  // );

  // useEffect(() => {
  //   getFlowLanguagesTranslationStatus({ flow_id: metaData.flowId })
  //     .then((data) => {
  //       console.log('xyz data', data);
  //     })
  //     .catch((err) => {
  //       console.log('xyz err lang', err);
  //     });
  // }, []);
  // const TranslationData = [
  //   {
  //     component: [
  //       getTableRowText('Spanish'),
  //       <div className={cx(gClasses.CenterV, gClasses.Gap4)}>
  //         <Chip
  //           text={STATUS.AVAILABLE}
  //           textColor={getTranslationChipStyles(STATUS.AVAILABLE, t).textColor}
  //           backgroundColor={
  //             getTranslationChipStyles(STATUS.AVAILABLE, t).backgroundColor
  //           }
  //           size={EChipSize.sm}
  //           className={cx(
  //             gClasses.WhiteSpaceNoWrap,
  //             gClasses.PR6,
  //             gClasses.MR4,
  //           )}
  //           textClassName={cx(gClasses.FTwo12BlackV20, gClasses.FontWeight500)}
  //         />
  //         {/* <div className={cx(styles.ProgressContainer, gClasses.ML3)} /> */}
  //         {/* <ProgressBar
  //           progressType={EProgressType.horizontal}
  //           percentage={100}
  //         /> */}
  //         <div className={cx(styles.ProgressContainer, gClasses.ML3)}>
  //           <div className={styles.ProgressBar} />
  //         </div>
  //         <div className={cx(gClasses.ML12, gClasses.WhiteSpaceNoWrap)}>100 %</div>
  //       </div>,
  //       <div
  //         className={cx(gClasses.W100, gClasses.DisplayFlex, gClasses.JusEnd)}
  //       >
  //         <Button
  //           type={EButtonType.SECONDARY}
  //           buttonText={LANGUAGE_AND_OTHERS(t).TRANSLATE_AGAIN}
  //           className={styles.TranslateAgain}
  //         />
  //       </div>,
  //     ],
  //     id: EMPTY_STRING,
  //   },
  //   {
  //     component: [
  //       getTableRowText('French'),
  //       <div className={cx(gClasses.CenterV, gClasses.Gap4)}>
  //         <Chip
  //           text={STATUS.AVAILABLE}
  //           textColor={getTranslationChipStyles(STATUS.AVAILABLE, t).textColor}
  //           backgroundColor={
  //             getTranslationChipStyles(STATUS.AVAILABLE, t).backgroundColor
  //           }
  //           size={EChipSize.sm}
  //           className={cx(
  //             gClasses.WhiteSpaceNoWrap,
  //             gClasses.PR6,
  //             gClasses.MR4,
  //           )}
  //           textClassName={cx(gClasses.FTwo12BlackV20, gClasses.FontWeight500)}
  //         />
  //         {/* <ProgressBar
  //           progressType={EProgressType.horizontal}
  //           percentage={90}
  //         /> */}
  //          <div className={cx(styles.ProgressContainer, gClasses.ML3)}>
  //           <div className={styles.ProgressBar} />
  //          </div>
  //         <div className={cx(gClasses.ML12, gClasses.WhiteSpaceNoWrap)}>100 %</div>
  //       </div>,
  //       <div
  //         className={cx(gClasses.W100, gClasses.DisplayFlex, gClasses.JusEnd)}
  //       >
  //         <Button
  //           type={EButtonType.SECONDARY}
  //           buttonText={LANGUAGE_AND_OTHERS(t).TRANSLATE_AGAIN}
  //           className={styles.TranslateAgain}
  //         />
  //       </div>,
  //     ],
  //     id: EMPTY_STRING,
  //   },
  //   {
  //     component: [
  //       getTableRowText('Arabic'),
  //       <div className={cx(gClasses.CenterV, gClasses.Gap4)}>
  //         <Chip
  //           text={STATUS.NOT_AVAILABLE}
  //           textColor={
  //             getTranslationChipStyles(STATUS.NOT_AVAILABLE, t).textColor
  //           }
  //           backgroundColor={
  //             getTranslationChipStyles(STATUS.NOT_AVAILABLE, t).backgroundColor
  //           }
  //           size={EChipSize.sm}
  //           className={cx(
  //             gClasses.WhiteSpaceNoWrap,
  //             gClasses.PR6,
  //             gClasses.MR4,
  //           )}
  //           textClassName={cx(gClasses.FTwo12BlackV20, gClasses.FontWeight500)}
  //         />
  //         {/* <ProgressBar
  //           progressType={EProgressType.horizontal}
  //           percentage={30}
  //         /> */}
  //          <div className={cx(styles.ProgressContainer, gClasses.ML3)}>
  //           <div className={styles.ProgressBar} />
  //          </div>
  //         <div className={cx(gClasses.ML12, gClasses.WhiteSpaceNoWrap)}>100 %</div>
  //       </div>,
  //       <div
  //         className={cx(gClasses.W100, gClasses.DisplayFlex, gClasses.JusEnd)}
  //       >
  //         <Button
  //           type={EButtonType.OUTLINE_SECONDARY}
  //           buttonText={LANGUAGE_AND_OTHERS(t).TRANSLATE}
  //           className={styles.TranslateAgain}
  //         />
  //       </div>,
  //     ],
  //     id: EMPTY_STRING,
  //   },
  //   {
  //     component: [
  //       getTableRowText('German'),
  //       <div className={cx(gClasses.CenterV, gClasses.Gap4)}>
  //         <Chip
  //           text={STATUS.NOT_AVAILABLE}
  //           textColor={
  //             getTranslationChipStyles(STATUS.NOT_AVAILABLE, t).textColor
  //           }
  //           backgroundColor={
  //             getTranslationChipStyles(STATUS.NOT_AVAILABLE, t).backgroundColor
  //           }
  //           size={EChipSize.sm}
  //           className={cx(
  //             gClasses.WhiteSpaceNoWrap,
  //             gClasses.PR6,
  //             gClasses.MR4,
  //           )}
  //           textClassName={cx(gClasses.FTwo12BlackV20, gClasses.FontWeight500)}
  //         />
  //         {/* <ProgressBar
  //           progressType={EProgressType.horizontal}
  //           percentage={30}
  //         /> */}
  //          <div className={cx(styles.ProgressContainer, gClasses.ML3)}>
  //           <div className={styles.ProgressBar} />
  //          </div>
  //         <div className={cx(gClasses.ML12, gClasses.WhiteSpaceNoWrap)}>100 %</div>
  //       </div>,
  //       <div
  //         className={cx(gClasses.W100, gClasses.DisplayFlex, gClasses.JusEnd)}
  //       >
  //         <Button
  //           type={EButtonType.OUTLINE_SECONDARY}
  //           buttonText={LANGUAGE_AND_OTHERS(t).TRANSLATE}
  //           className={styles.TranslateAgain}
  //         />
  //       </div>,
  //     ],
  //     id: EMPTY_STRING,
  //   },
  // ];

  const saveFlowTranslationData = (
    translationData,
    locale,
    closeModal,
    isValidateOnly = false,
    updateKey = EMPTY_STRING,
    saveSingleField = false,
  ) => {
    const errorList = validateLanguageTranslationFlowData(
      cloneDeep(translationData),
      t,
      locale,
    );
    if (isEmpty(errorList)) {
      const postData = cloneDeep(translationData)?.map((eachData) => {
        delete eachData?.newKey;
        delete eachData?.isModified;
        return eachData;
      });
      !isValidateOnly &&
        saveFlowDetailsByLocaleApi(
          {
            flow_id: flowData?.flow_id,
            locale: locale,
            flow_data: postData,
          },
          closeModal,
          updateKey,
          saveSingleField,
        );
    } else {
      onFlowDataChange({
        languageTranslationError: {
          ...languageTranslationError,
          ...errorList,
        },
      });
    }
  };

  const toggleLanguageConfigurationModal = () => {
    onFlowDataChange({
      isLanguageConfigurationModalOpen: !isLanguageConfigurationModalOpen,
      languageTranslationError: {},
      updatedLanguageKey: EMPTY_STRING,
    });
  };

  return (
    <div className={gClasses.MT24}>
      <Text
        content={TITLE}
        className={cx(
          gClasses.FontWeight500,
          gClasses.FTwo16GrayV3,
          gClasses.MB12,
        )}
      />

      <LanguageSettings
        getFlowLanguagesTranslationStatusApi={
          getFlowLanguagesTranslationStatusApi
        }
        getFlowDetailsByLocaleApi={getFlowDetailsByLocaleApi}
        languageTranslationStatusParams={{
          flow_id: metaData.flowId,
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

      {/* <div className={gClasses.OverflowXAuto}>
      <Table
        className={styles.TranslationTable}
        header={LANGUAGE_AND_OTHERS(t).LANGUAGE_HEADERS}
        data={TranslationData}
        tableVariant="normal"
      />
      </div>
      <div className={gClasses.MT16}>
        <div
          className={cx(
            gClasses.PositionRelative,
            gClasses.DisplayFlex,
          )}
        >
          <button
            className={cx(
              gClasses.CenterV,
              gClasses.ClickableElement,
              gClasses.CursorPointer,
              gClasses.PositionRelative,
            )}
          >
            <PlusIconBlueNew className={cx(gClasses.MR5)} />
            <div className={gClasses.FlexGrow1}>
              <div
                className={cx(gClasses.FTwo12, gClasses.FontWeight500)}
                style={{ color: '#217CF5' }}
              >
                {LANGUAGE_AND_OTHERS(t).CREATE_NEW}
              </div>
            </div>
          </button>
        </div> */}
      {/* </div> */}
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
    translateLanguagesList:
      EditFlowReducer?.flowData?.translateLanguagesList || [],
    localeFlowData: EditFlowReducer?.flowData?.localeFlowData || [],
    originalLocaleData: EditFlowReducer?.flowData?.originalLocaleData || [],
    savedLocaleFlowData: EditFlowReducer?.flowData?.savedLocaleFlowData || [],
    isLanguageConfigurationModalOpen:
      EditFlowReducer?.flowData?.isLanguageConfigurationModalOpen || false,
    languageTranslationError:
      EditFlowReducer?.flowData?.languageTranslationError || {},
    updatedLanguageKey:
      EditFlowReducer?.flowData?.updatedLanguageKey || EMPTY_STRING,
    isFlowTranslationStatusLoading:
      EditFlowReducer?.flowData?.isFlowTranslationStatusLoading || false,
    isTranslationDataLoading:
      EditFlowReducer?.flowData?.isTranslationDataLoading || false,
  };
};

const mapDispatchToProps = {
  onFlowDataChange: updateFlowDataChange,
  onFlowStateChange: updateFlowStateChange,
  getFlowLanguagesTranslationStatusApi:
    getFlowLanguagesTranslationStatusApiThunk,
  getLocaleLookUpData: getLocaleLookUpDataThunk,
  getFlowDetailsByLocaleApi: getFlowDetailsByLocaleApiThunk,
  saveFlowDetailsByLocaleApi: saveFlowDetailsByLocaleApiThunk,
};

export default connect(mapStateToProps, mapDispatchToProps)(Translation);
