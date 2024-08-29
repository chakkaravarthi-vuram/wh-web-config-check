/* eslint-disable no-irregular-whitespace */
import React, { useEffect, useRef, useState } from 'react';
import Papa from 'papaparse';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import cx from 'classnames/bind';
import { useTranslation } from 'react-i18next';
import ModalLayout from 'components/form_components/modal_layout/ModalLayout';
import gClasses from 'scss/Typography.module.scss';
import { BS } from 'utils/UIConstants';
import ReadOnlyText from 'components/form_components/read_only_text/ReadOnlyText';
import SideArrowIcon from 'assets/icons/SideArrowIcon';
import Button, { BUTTON_TYPE } from 'components/form_components/button/Button';
import modalStyles from 'components/form_components/modal_layout/CustomClasses.module.scss';
import DownloadIconV2 from 'assets/icons/DownloadIconV2';
import { setPointerEvent, updatePostLoader } from 'utils/UtilityFunctions';
import DownloadSuccessIcon from 'assets/icons/DownloadSuccessIcon';
import {
  DialogSize,
  Button as LibraryButton,
  EButtonType,
  ETextSize,
  ETitleAlign,
  ETitleHeadingLevel,
  ETitleSize,
  Modal,
  ModalStyleType,
  Text,
  Title,
  Input,
  Size,
  EInputIconPlacement,
  BorderRadiusVariant,
} from '@workhall-pvt-lmt/wh-ui-library';
import Skeleton from 'react-loading-skeleton';
import styles from './LanguageConfiguration.module.scss';
import { LANGAUGE_SETTINGS_STRINGS } from '../LanguageSettings.strings';
import LanguageGroup from './language_group/LanguageGroup';
import { EMPTY_STRING } from '../../../../../utils/strings/CommonStrings';
import { cloneDeep, isEmpty } from '../../../../../utils/jsUtility';
import CloseIconNew from '../../../../../assets/icons/CloseIconNew';
import AlertCircle from '../../../../../assets/icons/application/AlertCircle';
import { FORM_POPOVER_STATUS, UTIL_COLOR } from '../../../../../utils/Constants';
import SearchIcon from '../../../../../assets/icons/SearchIcon';
import { ARIA_ROLES, INPUT_TYPES } from '../../../../../utils/UIConstants';
import FilterIconV2 from '../../../../../assets/icons/FilterIconV2';
import Dropdown from '../../../../../components/form_components/dropdown/Dropdown';
import { POPPER_PLACEMENTS } from '../../../../../components/auto_positioning_popper/AutoPositioningPopper';
import { getUserProfileData, updateErrorPopoverInRedux } from '../../../../../utils/UtilityFunctions';
import ProgressIcon from '../../../../../assets/icons/ProgressIcon';
import ImportFileIcon from '../../../../../assets/icons/ImportFileIcon';
import ErrorIcon from '../../../../../assets/icons/flow/ErrorIcon';
import { removeModifiedFlag } from './LanguageConfiguration.utils';

function LanguageConfiguration(props) {
  const { onCloseModal, flowData, translateLanguage, translationData, dataChange,
    localeFlowDataKey, translateLocale, savedTranslationData, saveFlowTranslationData,
    languageTranslationError, updatedLanguageKey, originalLocaleData, isTranslationDataLoading } = props;

  const { t } = useTranslation();
  const [templateSuccessMessage, setTemplateSuccessMessage] = useState(EMPTY_STRING);
  const [templateFailureMessage, setTemplateFailureMessage] = useState(EMPTY_STRING);
  const [isDownloadOrImport, setIsDownloadOrImport] = useState({
    type: EMPTY_STRING,
    inprogress: false,
  });
  const [cancelConfirmationModal, setCancelConfirmationModal] = useState(false);
  const [searchText, setSearchText] = useState(EMPTY_STRING);
  const [filter, setFilter] = useState(LANGAUGE_SETTINGS_STRINGS(t).LANGUAGE_CONFIGURATION.CONTENT.FILTER.OPTIONS[0].value);
  const [isDisplay, setIsDisplay] = useState(false);

  const isDefaultFilter = (filter === LANGAUGE_SETTINGS_STRINGS(t).LANGUAGE_CONFIGURATION.CONTENT.FILTER.OPTIONS[0].value);
  const fileInputRef = useRef(null);

  const closeLanguageConfiguration = () => {
    setCancelConfirmationModal(true);
  };

  useEffect(() => {
    if (isDisplay) {
      const timeoutId = setTimeout(() => {
        setIsDisplay(false);
      }, 30000); // 30 seconds
      return () => clearTimeout(timeoutId);
    }
    return () => { };
  }, [isDisplay]);

  const handleDownload = () => {
    setIsDownloadOrImport({ type: LANGAUGE_SETTINGS_STRINGS(t).LANGUAGE_CONFIGURATION.CONTENT.DOWNLOAD.ID, inprogress: true });
    const transformedData = translationData?.map((data) => {
      return {
        key: data.key,
        [LANGAUGE_SETTINGS_STRINGS(t).LANGUAGE_CONFIGURATION.CONTENT.IMPORT.HEADERS.ENGLISH]: data.value,
        [`${LANGAUGE_SETTINGS_STRINGS(t).LANGUAGE_CONFIGURATION.CONTENT.IMPORT.HEADERS.OTHER_LANGUAGE} ${translateLanguage}`]: data?.[translateLocale],
      };
    });
    const csv = Papa.unparse(transformedData);
    const blob = new Blob([csv], { type: LANGAUGE_SETTINGS_STRINGS(t).LANGUAGE_CONFIGURATION.CONTENT.DOWNLOAD.TYPE });
    const url = URL.createObjectURL(blob);
    const userProfileData = getUserProfileData();
    try {
      setIsDownloadOrImport({ type: LANGAUGE_SETTINGS_STRINGS(t).LANGUAGE_CONFIGURATION.CONTENT.DOWNLOAD.ID, inprogress: true });
      const link = document.createElement('a');
      link.href = url;

      // Custom file name
      const customTimeZoneOptions = { timeZone: userProfileData?.pref_timezone };
      link.download = `${flowData.flow_name}_${translateLanguage} Translation_${new Date().toLocaleString(undefined, customTimeZoneOptions)}`;

      // Event listener for the 'click' event
      link.addEventListener('click', () => {
        // Fetch API to track download completion
        setIsDownloadOrImport({ type: LANGAUGE_SETTINGS_STRINGS(t).LANGUAGE_CONFIGURATION.CONTENT.DOWNLOAD.ID, inprogress: true });
        fetch(url)
        .then((response) => {
          if (response.ok) {
            return response.blob();
          } else {
            setIsDownloadOrImport({
              type: LANGAUGE_SETTINGS_STRINGS(t).LANGUAGE_CONFIGURATION.CONTENT.DOWNLOAD.ID,
              inprogress: false,
            });
            throw new Error('Download failed'); // Optionally, re-throw the error for further handling
          }
        })
        .then(() => {
          setIsDownloadOrImport({
            type: LANGAUGE_SETTINGS_STRINGS(t).LANGUAGE_CONFIGURATION.CONTENT.DOWNLOAD.ID,
            inprogress: false,
          });
          setPointerEvent(false);
          updatePostLoader(false);
          setIsDisplay(true);
          setTemplateSuccessMessage(LANGAUGE_SETTINGS_STRINGS(t).LANGUAGE_CONFIGURATION.CONTENT.DOWNLOAD.SUCCESS);
          setTemplateFailureMessage(EMPTY_STRING);
        })
        .catch(() => {
          setIsDownloadOrImport({
            type: LANGAUGE_SETTINGS_STRINGS(t).LANGUAGE_CONFIGURATION.CONTENT.DOWNLOAD.ID,
            inprogress: false,
          });
          setPointerEvent(false);
          updatePostLoader(false);
          setIsDisplay(true);
          setTemplateFailureMessage(LANGAUGE_SETTINGS_STRINGS(t).LANGUAGE_CONFIGURATION.CONTENT.DOWNLOAD.FAILURE);
         });
      });

      // Trigger click event
      link.click();
    } catch (error) {
      setPointerEvent(false);
      updatePostLoader(false);
      setIsDisplay(true);
      setTemplateFailureMessage(LANGAUGE_SETTINGS_STRINGS(t).LANGUAGE_CONFIGURATION.CONTENT.DOWNLOAD.FAILURE);
    } finally {
      URL.revokeObjectURL(url);
    }
  };

  const setDownloadProgress = () => {
    setIsDownloadOrImport({ type: LANGAUGE_SETTINGS_STRINGS(t).LANGUAGE_CONFIGURATION.CONTENT.DOWNLOAD.ID, inprogress: true });
    setPointerEvent(true);
    updatePostLoader(true);
    setIsDisplay(true);
    setTemplateFailureMessage(EMPTY_STRING);
    setTemplateSuccessMessage(EMPTY_STRING);
    handleDownload();
  };

  const processImportedData = (json) => {
    const invalidKeys = [];
    const clonedTranslationData = cloneDeep(translationData);

    json?.forEach((row) => {
      const keyIndex = clonedTranslationData?.findIndex((data) => data?.key === row?.key);
      const notModifiedKeyIndex = clonedTranslationData?.findIndex((data) => (data?.key === row?.key) && !(data?.isModified));

      if (!isEmpty(row?.[`${LANGAUGE_SETTINGS_STRINGS(t).LANGUAGE_CONFIGURATION.CONTENT.IMPORT.HEADERS.OTHER_LANGUAGE} ${translateLanguage}`])) {
        if (notModifiedKeyIndex > -1) {
          clonedTranslationData[notModifiedKeyIndex][translateLocale] = row?.[`${LANGAUGE_SETTINGS_STRINGS(t).LANGUAGE_CONFIGURATION.CONTENT.IMPORT.HEADERS.OTHER_LANGUAGE} ${translateLanguage}`]?.trim();
          clonedTranslationData[notModifiedKeyIndex].isModified = true;
        } else if (keyIndex === -1) {
          invalidKeys?.push?.(row?.key);
        }
      }
    });
    return { invalidKeys, modifiedData: clonedTranslationData };
  };

  const handleImportFileValidation = (json) => {
    if (json?.length === 0) {
      setIsDisplay(true);
      setTemplateFailureMessage(LANGAUGE_SETTINGS_STRINGS(t).LANGUAGE_CONFIGURATION.CONTENT.IMPORT.INVALID_FILE);
    } else {
      const hasKeysColumn = 'key' in json[0];
      if (!hasKeysColumn) {
        setIsDisplay(true);
        setTemplateFailureMessage(LANGAUGE_SETTINGS_STRINGS(t).LANGUAGE_CONFIGURATION.CONTENT.IMPORT.INVALID_FILE);
      } else {
        const { invalidKeys, modifiedData } = processImportedData(json);
        const finalModifiedData = removeModifiedFlag(modifiedData);
        dataChange?.({ [localeFlowDataKey]: finalModifiedData });
        saveFlowTranslationData?.(modifiedData, translateLocale, false, true);
        if (!isEmpty(invalidKeys)) {
          setIsDisplay(true);
          setTemplateFailureMessage(
            `${LANGAUGE_SETTINGS_STRINGS(t).LANGUAGE_CONFIGURATION.CONTENT.IMPORT.INVALID_KEY} ${invalidKeys.toString()}`,
          );
        }
      }
    }
  };

  const parseCsvFile = (file) => new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        resolve(result.data);
        setIsDownloadOrImport({ type: LANGAUGE_SETTINGS_STRINGS(t).LANGUAGE_CONFIGURATION.CONTENT.IMPORT.ID, inprogress: false });
        setIsDisplay(true);
        setTemplateSuccessMessage(LANGAUGE_SETTINGS_STRINGS(t).LANGUAGE_CONFIGURATION.CONTENT.IMPORT.SUCCESS);
        setTemplateFailureMessage(EMPTY_STRING);
      },
      error: (error) => {
        setIsDownloadOrImport({ type: LANGAUGE_SETTINGS_STRINGS(t).LANGUAGE_CONFIGURATION.CONTENT.IMPORT.ID, inprogress: false });
        setIsDisplay(true);
        setTemplateFailureMessage(LANGAUGE_SETTINGS_STRINGS(t).LANGUAGE_CONFIGURATION.CONTENT.IMPORT.INVALID_FILE);
        reject(error);
      },
    });
  });

  const handleCsvUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const fileSizeInMB = file.size / (1024 * 1024);
      if (fileSizeInMB > 10) {
        const error = {
          title: LANGAUGE_SETTINGS_STRINGS(t).LANGUAGE_CONFIGURATION.CONTENT.IMPORT.FILE_SIZE_EXCEED.TITLE,
          status: FORM_POPOVER_STATUS.SERVER_ERROR,
          isVisible: true,
        };
        if (fileInputRef?.current) fileInputRef.current.value = '';
        updateErrorPopoverInRedux(error, LANGAUGE_SETTINGS_STRINGS(t).LANGUAGE_CONFIGURATION.CONTENT.IMPORT.FILE_SIZE_EXCEED.SUB_TITLE);
      } else {
        setIsDownloadOrImport({ type: LANGAUGE_SETTINGS_STRINGS(t).LANGUAGE_CONFIGURATION.CONTENT.IMPORT.ID, inprogress: true });
        const result = await parseCsvFile(file);
        handleImportFileValidation(result);
      }
    }
  };

  const searchLanguageGroup = (e) => {
    setSearchText(e?.target?.value || EMPTY_STRING);
    let filterTranslationData = cloneDeep(originalLocaleData);
    if (!isEmpty(e?.target?.value?.trim())) {
      filterTranslationData = (filterTranslationData)?.filter((data) =>
        data?.key?.toLowerCase()?.includes(e?.target?.value?.toLowerCase()) ||
        data?.[translateLocale]?.toLowerCase()?.includes(e?.target?.value?.toLowerCase()) ||
        data?.value?.toLowerCase()?.includes(e?.target?.value?.toLowerCase()),
      );
    }
    if (!isDefaultFilter) {
      if (filter === LANGAUGE_SETTINGS_STRINGS(t).LANGUAGE_CONFIGURATION.CONTENT.FILTER.OPTIONS[1].value) {
        filterTranslationData = cloneDeep(filterTranslationData)?.filter((data) =>
          isEmpty(data?.[translateLocale]),
        );
      } else if (filter === LANGAUGE_SETTINGS_STRINGS(t).LANGUAGE_CONFIGURATION.CONTENT.FILTER.OPTIONS[2].value) {
        filterTranslationData = cloneDeep(filterTranslationData)?.filter((data) =>
          !isEmpty(data?.[translateLocale]),
        );
      }
    }
    dataChange?.({ [localeFlowDataKey]: filterTranslationData });
  };

  const filterTranslationData = (e) => {
    setFilter(e?.target?.value);
    let filteredTranslationData = cloneDeep(originalLocaleData);
    if (e?.target?.value === LANGAUGE_SETTINGS_STRINGS(t).LANGUAGE_CONFIGURATION.CONTENT.FILTER.OPTIONS[1].value) {
      filteredTranslationData = cloneDeep(filteredTranslationData)?.filter((data) =>
        isEmpty(data?.[translateLocale]),
      );
    } else if (e?.target?.value === LANGAUGE_SETTINGS_STRINGS(t).LANGUAGE_CONFIGURATION.CONTENT.FILTER.OPTIONS[2].value) {
      filteredTranslationData = cloneDeep(filteredTranslationData)?.filter((data) =>
        !isEmpty(data?.[translateLocale]),
      );
    }
    if (!isEmpty(searchText)) {
      filteredTranslationData = (filteredTranslationData)?.filter((data) =>
        data?.key?.toLowerCase()?.includes(e?.target?.value?.toLowerCase()) ||
        data?.[translateLocale]?.toLowerCase()?.includes(e?.target?.value?.toLowerCase()),
      );
    }
    dataChange?.({ [localeFlowDataKey]: filteredTranslationData });
  };

  const downloadOrImportInProgressComponent = () => (
      <div className={cx(BS.D_FLEX, BS.JC_CENTER, gClasses.MT16)}>
        <Button
          buttonType={BUTTON_TYPE.OUTLINE_PRIMARY}
          className={cx(BS.TEXT_NO_WRAP, gClasses.MR8)}
          primaryButtonStyle={modalStyles.PrimaryButton}
          disabled
        >
          <ProgressIcon />
          {isDownloadOrImport?.type === LANGAUGE_SETTINGS_STRINGS(t).LANGUAGE_CONFIGURATION.CONTENT.DOWNLOAD.ID ?
            LANGAUGE_SETTINGS_STRINGS(t).LANGUAGE_CONFIGURATION.CONTENT.DOWNLOAD.PROGRESS :
            LANGAUGE_SETTINGS_STRINGS(t).LANGUAGE_CONFIGURATION.CONTENT.IMPORT.PROGRESS}
        </Button>
      </div>
    );

  const downloadOrImportCompletedComponent = () => (
      <div className={cx(BS.D_FLEX, BS.JC_CENTER, gClasses.MT16)}>
        <Button
          buttonType={BUTTON_TYPE}
          className={cx(BS.TEXT_NO_WRAP, gClasses.MR8, styles.PrimaryButton)}
          onClick={() => setDownloadProgress()}
        >
          <div className={cx(BS.D_FLEX, gClasses.CenterVH, styles.DownloadContainer)}>
            <DownloadIconV2 className={styles.DownloadIcon} />
            <div className={gClasses.FTwo12BlueV39}>
              {LANGAUGE_SETTINGS_STRINGS(t).LANGUAGE_CONFIGURATION.CONTENT.DOWNLOAD.LABEL}
            </div>
          </div>
        </Button>
        <Button
          buttonType={BUTTON_TYPE}
          className={cx(BS.TEXT_NO_WRAP, gClasses.ML8, styles.PrimaryButton)}
          onClick={() => {
            fileInputRef?.current?.click();
          }}
        >
        <div className={cx(BS.D_FLEX, gClasses.CenterVH, styles.DownloadContainer)}>
            <input
              type={INPUT_TYPES.FILE}
              accept={LANGAUGE_SETTINGS_STRINGS(t).LANGUAGE_CONFIGURATION.CONTENT.IMPORT.ALLOWED_FILE_TYPE}
              onChange={handleCsvUpload}
              className={BS.D_NONE}
              ref={fileInputRef}
            />
            <ImportFileIcon className={styles.DownloadIcon} />
            <div className={gClasses.FTwo12BlueV39}>
              {LANGAUGE_SETTINGS_STRINGS(t).LANGUAGE_CONFIGURATION.CONTENT.IMPORT.LABEL}
            </div>
        </div>
        </Button>
      </div>
    );

  return (
    <>
      <ModalLayout
        id={LANGAUGE_SETTINGS_STRINGS(t).LANGUAGE_CONFIGURATION.ID}
        isModalOpen
        noCloseIcon={isDownloadOrImport?.inprogress}
        onCloseClick={closeLanguageConfiguration}
        contentClass={cx(styles.ContentModal, gClasses.ModalContentClassWithoutPadding, gClasses.ZIndex6)}
        headerClassName={styles.Header}
        closeIconClass={styles.CloseIcon}
        headerContent={(
          <div>
            <div className={cx(gClasses.FontWeight500, gClasses.FTwo20BlackV12)}>
              {LANGAUGE_SETTINGS_STRINGS(t).LANGUAGE_CONFIGURATION.HEADER.TITLE}
            </div>
            <div className={cx(BS.D_FLEX, gClasses.MT12)}>
              <ReadOnlyText
                label={LANGAUGE_SETTINGS_STRINGS(t).LANGUAGE_CONFIGURATION.HEADER.DEFAULT_LANGAUGE.LABEL}
                id={LANGAUGE_SETTINGS_STRINGS(t).LANGUAGE_CONFIGURATION.HEADER.DEFAULT_LANGAUGE.ID}
                value={LANGAUGE_SETTINGS_STRINGS(t).LANGUAGE_CONFIGURATION.HEADER.DEFAULT_LANGAUGE.LANGUAGE}
                hideMessage
                labelFontClassAdmin={cx(gClasses.FontWeight500, gClasses.FTwo12GrayV86)}
                ContentClass={cx(gClasses.FontWeight500, gClasses.FTwo13BlackV3)}
              />
              <div className={cx(gClasses.ML15, gClasses.CenterV)}>
                <SideArrowIcon />
              </div>
              <ReadOnlyText
                className={gClasses.ML15}
                label={LANGAUGE_SETTINGS_STRINGS(t).LANGUAGE_CONFIGURATION.HEADER.TRANSLATE_LANGAUGE.LABEL}
                id={LANGAUGE_SETTINGS_STRINGS(t).LANGUAGE_CONFIGURATION.HEADER.TRANSLATE_LANGAUGE.ID}
                value={translateLanguage}
                hideMessage
                labelFontClassAdmin={cx(gClasses.FontWeight500, gClasses.FTwo12GrayV86)}
                ContentClass={cx(gClasses.FontWeight500, gClasses.FTwo13BlackV3)}
              />
            </div>
          </div>
        )}
        escCloseDisabled={isDownloadOrImport?.inprogress}
        mainContent={(
          <>
            {isTranslationDataLoading ? <Skeleton /> :
              <div className={cx(styles.DownloadImportContainer, gClasses.CursorAuto)}>
                <div className={cx(gClasses.CenterH)}>
                  <div>
                    <div className={cx(gClasses.FontWeight500, gClasses.FTwo12GrayV86)}>
                      {LANGAUGE_SETTINGS_STRINGS(t).LANGUAGE_CONFIGURATION.CONTENT.INSTRUCTION}
                    </div>
                    {(cloneDeep(isDownloadOrImport).inprogress) ?
                      downloadOrImportInProgressComponent() : downloadOrImportCompletedComponent()
                    }
                  </div>
                </div>
                {(templateSuccessMessage && !templateFailureMessage && !isDownloadOrImport?.inprogress && isDisplay) &&
                  <div className={cx(gClasses.CenterH, gClasses.MT15, gClasses.CenterV)}>
                    <DownloadSuccessIcon />
                    <div className={cx(gClasses.ML8, styles.DownloadSuccessMessage, gClasses.FTwo12GreenV23, gClasses.FontWeight500, gClasses.WordBreakAll)}>
                      {templateSuccessMessage}
                    </div>
                  </div>
                }
                {(templateFailureMessage && !isDownloadOrImport?.inprogress && isDisplay) &&
                  <div className={cx(gClasses.CenterH, gClasses.MT15, gClasses.CenterV)}>
                    <ErrorIcon className={gClasses.AlignSelfBaseline} />
                    <div className={cx(gClasses.ML8, styles.DownloadSuccessMessage, gClasses.FTwo12RedV18, gClasses.FontWeight500, gClasses.WordBreakAll)}>
                      {templateFailureMessage}
                    </div>
                  </div>
                }
              </div>
            }
            {isTranslationDataLoading ? <Skeleton /> : (!isDownloadOrImport?.inprogress) &&
              <div className={cx(BS.D_FLEX, gClasses.MT24, BS.JC_BETWEEN)}>
                <div className={styles.SearchInput}>
                  <Input
                    content={searchText}
                    prefixIcon={(
                      <SearchIcon
                        className={styles.SearchIcon}
                        role={ARIA_ROLES.PRESENTATION}
                      />
                    )}
                    onChange={(e) => searchLanguageGroup(e)}
                    iconPosition={EInputIconPlacement.left}
                    className={styles.Search}
                    placeholder={LANGAUGE_SETTINGS_STRINGS(t).LANGUAGE_CONFIGURATION.CONTENT.SEARCH.PLACEHOLDER}
                    size={Size.md}
                    borderRadiusType={BorderRadiusVariant.rounded}
                  />
                </div>
                <div className={cx(gClasses.CenterV, BS.D_FLEX, styles.FilterContainer, gClasses.ML15)}>
                  <Dropdown
                    optionList={LANGAUGE_SETTINGS_STRINGS(t).LANGUAGE_CONFIGURATION.CONTENT.FILTER.OPTIONS}
                    onChange={(e) => filterTranslationData(e)}
                    isBorderLess
                    isNewDropdown
                    isTaskDropDown
                    placement={POPPER_PLACEMENTS.BOTTOM_END}
                    fallbackPlacements={[POPPER_PLACEMENTS.TOP_END]}
                    popperClasses={cx(gClasses.ZIndex151, gClasses.MT5)}
                    customDisplay={<FilterIconV2 />}
                    outerClassName={gClasses.MinWidth0}
                    noInputPadding
                    comboboxClass={gClasses.MinWidth0}
                    dropdownListClasses={styles.DropdownList}
                    id={LANGAUGE_SETTINGS_STRINGS(t).LANGUAGE_CONFIGURATION.CONTENT.FILTER.ID}
                    selectedValue={filter}
                  />
                  <div className={cx(
                    gClasses.ML3,
                    cx(styles.AppliedFilter, gClasses.FTwo12BlueV39, gClasses.FontWeight500),
                  )}
                  >
                    {filter}
                  </div>
                </div>
              </div>
            }

            {isTranslationDataLoading ? <Skeleton /> : !isDownloadOrImport?.inprogress &&
              <LanguageGroup
                translateLanguage={translateLanguage}
                translateLocale={translateLocale}
                translationData={translationData}
                savedTranslationData={savedTranslationData}
                localeFlowDataKey={localeFlowDataKey}
                dataChange={dataChange}
                saveFlowTranslationData={saveFlowTranslationData}
                languageTranslationError={languageTranslationError}
                updatedLanguageKey={updatedLanguageKey}
                searchText={searchText}
                selectedFilter={filter}
              />
            }
          </>
        )}
        mainContentClassName={styles.Content}
        footerContent={!isDownloadOrImport?.inprogress && (
          <div className={cx(BS.W100, BS.D_FLEX, BS.JC_BETWEEN, BS.ALIGN_ITEM_CENTER)}>
            <div
              className={cx(
                BS.D_FLEX,
                BS.JC_END,
                BS.W100,
              )}
            >
              <div className={gClasses.CenterV}>
                <Button
                  buttonType={BUTTON_TYPE.LIGHT}
                  className={cx(BS.TEXT_NO_WRAP)}
                  primaryButtonStyle={modalStyles.PrimaryButton}
                  onClick={() => closeLanguageConfiguration()}
                >
                  {LANGAUGE_SETTINGS_STRINGS(t).LANGUAGE_CONFIGURATION.FOOTER.CANCEL}
                </Button>
              </div>
              <div className={gClasses.CenterV}>
                <Button
                  buttonType={BUTTON_TYPE.PRIMARY}
                  className={cx(BS.TEXT_NO_WRAP)}
                  primaryButtonStyle={modalStyles.PrimaryButton}
                  onClick={() => saveFlowTranslationData(translationData, translateLocale, true)}
                >
                  {LANGAUGE_SETTINGS_STRINGS(t).LANGUAGE_CONFIGURATION.FOOTER.SAVE}
                </Button>
              </div>
            </div>
          </div>
        )}
      />
      <Modal
        id={LANGAUGE_SETTINGS_STRINGS(t).LANGUAGE_CONFIGURATION.CANCEL_CONFIRMATION.ID}
        modalStyle={ModalStyleType.dialog}
        dialogSize={DialogSize.sm}
        className={gClasses.CursorAuto}
        mainContent={
          <div
            className={cx(
              BS.D_FLEX,
              BS.FLEX_COLUMN,
              BS.ALIGN_ITEM_CENTER,
              gClasses.P16,
            )}
          >
            <div className={cx(BS.D_FLEX, BS.JC_END, gClasses.MB8, BS.W100)}>
              <button onClick={() => setCancelConfirmationModal(false)}>
                <CloseIconNew />
              </button>
            </div>

            <div className={styles.AlertCircle}>
              <AlertCircle />
            </div>
            <Title
              content={LANGAUGE_SETTINGS_STRINGS(t).LANGUAGE_CONFIGURATION.CANCEL_CONFIRMATION.CANCEL}
              alignment={ETitleAlign.middle}
              headingLevel={ETitleHeadingLevel.h5}
              size={ETitleSize.xs}
              className={gClasses.MB16}
            />
            <Text
              content={LANGAUGE_SETTINGS_STRINGS(t).LANGUAGE_CONFIGURATION.CANCEL_CONFIRMATION.TITLE}
              size={ETextSize.SM}
              className={gClasses.MB8}
            />
            <Text
              content={LANGAUGE_SETTINGS_STRINGS(t).LANGUAGE_CONFIGURATION.CANCEL_CONFIRMATION.SUB_TITLE}
              size={ETextSize.SM}
              className={gClasses.MB8}
            />
            <div
              className={cx(
                BS.D_FLEX,
                BS.ALIGN_ITEM_CENTER,
                gClasses.MT16,
                gClasses.MB32,
              )}
            >
              <LibraryButton
                buttonText={LANGAUGE_SETTINGS_STRINGS(t).LANGUAGE_CONFIGURATION.CANCEL_CONFIRMATION.NO}
                onClickHandler={() => setCancelConfirmationModal(false)}
                type={EButtonType.OUTLINE_SECONDARY}
                className={cx(styles.MdCancelBtn, gClasses.MR16)}
              />
              <LibraryButton
                buttonText={LANGAUGE_SETTINGS_STRINGS(t).LANGUAGE_CONFIGURATION.CANCEL_CONFIRMATION.YES}
                onClickHandler={() => onCloseModal()}
                colorSchema={{ activeColor: UTIL_COLOR.RED_600 }}
                type={EButtonType.PRIMARY}
              />
            </div>
          </div>
        }
        isModalOpen={cancelConfirmationModal}
      />
    </>
  );
}

const mapStateToProps = (state) => {
  return {
    flowData: state.EditFlowReducer.flowData,
  };
};

export default withRouter(connect(mapStateToProps, null)(LanguageConfiguration));
