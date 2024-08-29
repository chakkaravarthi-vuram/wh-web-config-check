/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useEffect, useState } from 'react';
import cx from 'classnames/bind';
import gClasses from 'scss/Typography.module.scss';
import Input from 'components/form_components/input/Input';
import Dropdown from 'components/form_components/dropdown/Dropdown';
import Button from 'components/form_components/button/Button';
import useFileUploadHook from 'hooks/useFileUploadHook';
import { getExtensionFromFileName } from 'utils/generatorUtils';
import jsUtils from 'utils/jsUtility';
import { DOCUMENT_TYPES, EMPTY_STRING, ENTITY, FILE_CROP_PREVIEW_TEXT } from 'utils/strings/CommonStrings';
import FileCropPreviewComp from 'components/file_crop_preview/FileCropPreview';
import Label from 'components/form_components/label/Label';
import { evaluateAriaLabelMessage, evaluateFocusOnError, keydownOrKeypessEnterHandle } from 'utils/UtilityFunctions';
import { useTranslation } from 'react-i18next';
import styles from '../AccountInfoModal.module.scss';
import { BS } from '../../../../utils/UIConstants';
import { BUTTON_TYPE } from '../../../../utils/Constants';
import { ACCOUNT_DROPDOWN_STRING, ACCOUNT_INFO_STRINGS } from '../AccountInfoModal.string';
import { getUpdatedDocumentUrlDetailsForAccountModal } from '../AccountInfoModal.validation.schema';
import { ADMIN_SETTINGS_CONSTANT } from '../../../admin_settings/AdminSettings.constant';

function AccountInfoForm(props) {
    const { t } = useTranslation();
    const { getDropDownValues, locale_list, timezone_list, industry_list,
        onChangeHandler, error_list, onSubmitHandler, country_list,
        setState, account_id, validationCheck, account_domain, signOut, formDetails, onLanguagesChange, onPrimaryLanguageChange, primaryLanguageOptions } = props;
        const { acc_locale, primary_locale, acc_language } = formDetails;
        const [primaryLanguage, setPrimaryLanguage] = useState();
        const [currentFileData, setCurrentFileData] = useState();

    const getFileData = (doc_details, file_ref_uuid) => {
        const fileData = {
            type: DOCUMENT_TYPES.ACCOUNT_LOGO,
            file_type: getExtensionFromFileName(doc_details.file.name),
            file_name: doc_details.file.name.split('.')[0],
            file_size: doc_details.size,
            file_ref_id: file_ref_uuid,
        };
        const file_metadata = [];
        file_metadata.push(fileData);
        const data = {
          file_metadata,
        };
        data.entity = ENTITY.ACCOUNTS;
        data.entity_id = account_id;
        return data;
      };
    const {
        onRetryFileUpload,
        onFileUpload,
        documentDetails,
        uploadFile,
        onDeletFileUpload,
    } = useFileUploadHook(getFileData);

    const allFormFieldIdsInAccessibleOrder = [
        ACCOUNT_INFO_STRINGS.COMPANY_NAME_ID,
        ACCOUNT_INFO_STRINGS.COMPANY_LOGO_ID,
        ACCOUNT_DROPDOWN_STRING.INDUSTRY_DROPDOWN.ID,
        ACCOUNT_DROPDOWN_STRING.COUNTRY.ID,
        ACCOUNT_DROPDOWN_STRING.LANGUAGE.ID,
        ACCOUNT_DROPDOWN_STRING.LOCALE_DROPDOWN.ID,
        ACCOUNT_DROPDOWN_STRING.TIMEZONE_DROPDOWN.ID,
      ];

      const [focusOnErrorFieldId, setfocusOnErrorFieldId] = useState(null);
      const [focusOnErrorRefresher, setFocusOnErrorRefresher] = useState(false);

      useEffect(() => {
        if (!jsUtils.isEmpty(acc_locale)) {
          const primaryLanguages = [
            {
              label: `${acc_language} (${primary_locale})`,
              value: primary_locale,
            },
          ];
          setPrimaryLanguage(primaryLanguages);
        }
      }, [acc_locale]);
      const selectedAccLocales = acc_locale?.map(
        (current_locale) => current_locale?.locale || current_locale,
      );

    useEffect(() => {
        if (documentDetails && !jsUtils.isEmpty(documentDetails.file_metadata) && !jsUtils.isEmpty(uploadFile)) {
            const file_upload_details = getUpdatedDocumentUrlDetailsForAccountModal(documentDetails, documentDetails.file_metadata[0]._id);
            setState({ company_logo: documentDetails.file_metadata[0]._id, ...file_upload_details });
            onSubmitHandler(documentDetails.file_metadata[0]._id, file_upload_details, (error_list) => {
                setfocusOnErrorFieldId((previous_value) => {
                    const currentFocusableFieldId = evaluateFocusOnError(allFormFieldIdsInAccessibleOrder, error_list);
                    if (previous_value === currentFocusableFieldId) setFocusOnErrorRefresher((refresher) => !refresher);
                       return currentFocusableFieldId;
                    });
            });
            if (!jsUtils.isEmpty(error_list)) {
                validationCheck(ACCOUNT_INFO_STRINGS.COMPANY_LOGO_ID, documentDetails.file_metadata[0]._id);
            }
        }
    }, [documentDetails && documentDetails.file_metadata, documentDetails && documentDetails.file_metadata && documentDetails.file_metadata.length]);

    useEffect(() => {
        if (!jsUtils.isEmpty(error_list) && currentFileData && currentFileData.files?.length > 0) {
            setState({ [ACCOUNT_INFO_STRINGS.COMPANY_LOGO_ID]: 'id' });
            validationCheck(ACCOUNT_INFO_STRINGS.COMPANY_LOGO_ID, 'id');
        }
    }, [currentFileData && currentFileData.files.length]);

    const onDeleteLogoClick = () => {
        onDeletFileUpload();
        setCurrentFileData();
        setState({ company_logo: EMPTY_STRING });
    };

    const submitHandler = async () => {
        if (currentFileData) {
            onFileUpload(currentFileData);
        } else {
            onSubmitHandler(EMPTY_STRING, {}, (error_list) => {
            setfocusOnErrorFieldId((previous_value) => {
                const currentFocusableFieldId = evaluateFocusOnError(allFormFieldIdsInAccessibleOrder, error_list);
                if (previous_value === currentFocusableFieldId) setFocusOnErrorRefresher((refresher) => !refresher);
                   return currentFocusableFieldId;
                });
        });
        }
    };

    const validateConditional = () => {
        if (!jsUtils.isEmpty(error_list)) {
            validationCheck(ACCOUNT_INFO_STRINGS.COMPANY_LOGO_ID, documentDetails.file_metadata[0]._id);
        }
    };

    return (
        <div className={cx(gClasses.CenterH, BS.FLEX_COLUMN)}>
            <div className={cx(BS.TEXT_CENTER, gClasses.PX10)}>
                <div className={cx(gClasses.FTwo24GrayV3, gClasses.FontWeight600, gClasses.MT50)}>{t(ACCOUNT_INFO_STRINGS.TITLE)}</div>
                <div className={cx(gClasses.FTwo12GrayV53, gClasses.FontWeight500)}>{t(ACCOUNT_INFO_STRINGS.DESCRIPTION)}</div>
            </div>
            <div className={cx(styles.FormContainer)}>
                <div className={styles.FormSubContainer}>
                    <div className={cx(gClasses.SectionSubTitle, gClasses.MT30)}>{t(ACCOUNT_INFO_STRINGS.ACCOUNT_SETTING)}</div>
                    <div className={cx(gClasses.FTwo12GrayV2)}>
                        {t(ACCOUNT_INFO_STRINGS.WORKHALL_URL)}
                        {' '}
                        <span className={cx(gClasses.FTwo12GrayV3)}>{`${ACCOUNT_INFO_STRINGS.PREFIX}${account_domain}${ACCOUNT_INFO_STRINGS.SUFFIX}`}</span>
                    </div>
                    <Input
                        id={ACCOUNT_INFO_STRINGS.COMPANY_NAME_ID}
                        className={cx(styles.InputFull, gClasses.MT15)}
                        placeholder={t(ACCOUNT_INFO_STRINGS.COMPANY_NAME_PLACEHOLDER)}
                        value={formDetails.company_name}
                        onChangeHandler={onChangeHandler(ACCOUNT_INFO_STRINGS.COMPANY_NAME_ID)}
                        label={t(ACCOUNT_INFO_STRINGS.COMPANY_NAME)}
                        autoFocus
                        inputContainerClasses={styles.InputInner}
                        errorMessage={error_list[ACCOUNT_INFO_STRINGS.COMPANY_NAME_ID]}
                        isRequired
                        onKeyDownHandler={(e) => { // on clicking enter key, it is same as clicking enter button
                            if (e.keyCode === 13) submitHandler(e);
                          }}
                        ariaLabelHelperMessage={evaluateAriaLabelMessage(error_list[ACCOUNT_INFO_STRINGS.COMPANY_NAME_ID])}
                        focusOnError={focusOnErrorFieldId === ACCOUNT_INFO_STRINGS.COMPANY_NAME_ID}
                        focusOnErrorRefresher={focusOnErrorRefresher}
                        helperAriaHidden={focusOnErrorFieldId === ACCOUNT_INFO_STRINGS.COMPANY_NAME_ID && true}
                    />
                    <div>
                        <Label
                            content={t(ACCOUNT_INFO_STRINGS.COMPANY_LOGO)}
                            isRequired
                            labelFor={ACCOUNT_INFO_STRINGS.COMPANY_LOGO_ID}
                            hideLabelClass
                        />
                    <FileCropPreviewComp
                        id={ACCOUNT_INFO_STRINGS.COMPANY_LOGO_ID}
                        imageSrc={uploadFile && uploadFile.file}
                        onFileUpload={onFileUpload}
                        instructionMessage={`${t(ACCOUNT_INFO_STRINGS.FILE_UPLOAD_INFO_1)} ${ADMIN_SETTINGS_CONSTANT.ACCOUNT_SETTINGS.BRANDING_THEME.MB} ${t(ACCOUNT_INFO_STRINGS.FILE_UPLOAD_INFO_2)} ${ADMIN_SETTINGS_CONSTANT.ACCOUNT_SETTINGS.BRANDING_THEME.MIN_WIDTH} ${t(ACCOUNT_INFO_STRINGS.FILE_UPLOAD_INFO_3)} ${ADMIN_SETTINGS_CONSTANT.ACCOUNT_SETTINGS.BRANDING_THEME.MIN_HEIGHT} ${t(ACCOUNT_INFO_STRINGS.FILE_UPLOAD_INFO_4)} ${t(ACCOUNT_INFO_STRINGS.FILE_UPLOAD_INFO_5)}`}
                        instructionClassName={cx(gClasses.FTwo12GrayV4)}
                        addFile={(fileData) => setCurrentFileData(fileData)}
                        errorMessage={error_list[ACCOUNT_INFO_STRINGS.COMPANY_LOGO_ID]}
                        uploadFile={uploadFile}
                        onDeleteLogoClick={onDeleteLogoClick}
                        onRetryFileUpload={onRetryFileUpload}
                        setState={setState}
                        validateConditional={validateConditional}
                        label={t(FILE_CROP_PREVIEW_TEXT.ADD_COMPANY_LOGO)}
                        ariaLabelHelperMessage={evaluateAriaLabelMessage(error_list[ACCOUNT_INFO_STRINGS.COMPANY_LOGO_ID])}
                        focusOnError={focusOnErrorFieldId === ACCOUNT_INFO_STRINGS.COMPANY_LOGO_ID}
                        focusOnErrorRefresher={focusOnErrorRefresher}
                    />
                    </div>
                    <div className={cx(BS.D_FLEX, styles.TwoColumnContainer)}>
                        <Dropdown
                            id={ACCOUNT_DROPDOWN_STRING.INDUSTRY_DROPDOWN.ID}
                            selectedValue={formDetails.industry || null}
                            optionList={industry_list}
                            onChange={onChangeHandler(ACCOUNT_DROPDOWN_STRING.INDUSTRY_DROPDOWN.ID)}
                            placeholder={t(ACCOUNT_DROPDOWN_STRING.INDUSTRY_DROPDOWN.PLACEHOLDER)}
                            label={t(ACCOUNT_DROPDOWN_STRING.INDUSTRY_DROPDOWN.LABEL)}
                            className={cx(styles.Dropdown)}
                            innerClassName={styles.DropdownInner}
                            errorMessage={error_list[ACCOUNT_DROPDOWN_STRING.INDUSTRY_DROPDOWN.ID]}
                            loadData={getDropDownValues}
                            isRequired
                            isMultiSelect
                            focusOnError={focusOnErrorFieldId === ACCOUNT_DROPDOWN_STRING.INDUSTRY_DROPDOWN.ID}
                            focusOnErrorRefresher={focusOnErrorRefresher}
                            helperAriaHidden={focusOnErrorFieldId === ACCOUNT_DROPDOWN_STRING.INDUSTRY_DROPDOWN.ID && true}
                            ariaLabelHelperMessage={evaluateAriaLabelMessage(error_list[ACCOUNT_DROPDOWN_STRING.INDUSTRY_DROPDOWN.ID])}
                        />
                        <Dropdown
                            id={ACCOUNT_DROPDOWN_STRING.COUNTRY.ID}
                            onChange={onChangeHandler(ACCOUNT_DROPDOWN_STRING.COUNTRY.ID)}
                            optionList={country_list}
                            className={styles.Dropdown}
                            innerClassName={styles.DropdownInner}
                            placeholder={t(ACCOUNT_DROPDOWN_STRING.COUNTRY.PLACEHOLDER)}
                            label={t(ACCOUNT_DROPDOWN_STRING.COUNTRY.LABEL)}
                            loadData={getDropDownValues}
                            selectedValue={formDetails.country || null}
                            errorMessage={error_list[ACCOUNT_DROPDOWN_STRING.COUNTRY.ID]}
                            isRequired
                            focusOnError={focusOnErrorFieldId === ACCOUNT_DROPDOWN_STRING.COUNTRY.ID}
                            focusOnErrorRefresher={focusOnErrorRefresher}
                            helperAriaHidden={focusOnErrorFieldId === ACCOUNT_DROPDOWN_STRING.COUNTRY.ID && true}
                            ariaLabelHelperMessage={evaluateAriaLabelMessage(error_list[ACCOUNT_DROPDOWN_STRING.COUNTRY.ID])}
                        />
                    </div>
                    <div className={cx(gClasses.SectionSubTitle, gClasses.MY10)}>{t(ACCOUNT_INFO_STRINGS.LANGUAGE_TIMEZONE)}</div>
                    <div className={cx(BS.D_FLEX, styles.TwoColumnContainer)}>
                        <Dropdown
                            id={ACCOUNT_DROPDOWN_STRING.LANGUAGE.ID}
                            selectedValue={selectedAccLocales || null}
                            loadData={getDropDownValues}
                            optionList={locale_list}
                            onChange={onLanguagesChange}
                            placeholder={t(ACCOUNT_DROPDOWN_STRING.LANGUAGE.PLACEHOLDER)}
                            label={t(ACCOUNT_DROPDOWN_STRING.LANGUAGE.LABEL)}
                            className={styles.Dropdown}
                            innerClassName={styles.DropdownInner}
                            errorMessage={error_list[ACCOUNT_DROPDOWN_STRING.LANGUAGE.ID]}
                            isRequired
                            focusOnError={focusOnErrorFieldId === ACCOUNT_DROPDOWN_STRING.LANGUAGE.ID}
                            focusOnErrorRefresher={focusOnErrorRefresher}
                            helperAriaHidden={focusOnErrorFieldId === ACCOUNT_DROPDOWN_STRING.LANGUAGE.ID && true}
                            ariaLabelHelperMessage={evaluateAriaLabelMessage(error_list[ACCOUNT_DROPDOWN_STRING.LANGUAGE.ID])}
                            isMultiSelect
                        />
                        <Dropdown
                            id={ACCOUNT_DROPDOWN_STRING.LOCALE_DROPDOWN.ID}
                            selectedValue={primary_locale || null}
                            loadData={getDropDownValues}
                            optionList={primaryLanguageOptions || primaryLanguage}
                            onChange={onPrimaryLanguageChange}
                            placeholder={t(ACCOUNT_DROPDOWN_STRING.LOCALE_DROPDOWN.PLACEHOLDER)}
                            label={t(ACCOUNT_DROPDOWN_STRING.LOCALE_DROPDOWN.LABEL)}
                            className={styles.Dropdown}
                            innerClassName={styles.DropdownInner}
                            errorMessage={error_list[ACCOUNT_DROPDOWN_STRING.LOCALE_DROPDOWN.ID]}
                            isRequired
                            focusOnError={focusOnErrorFieldId === ACCOUNT_DROPDOWN_STRING.LOCALE_DROPDOWN.ID}
                            focusOnErrorRefresher={focusOnErrorRefresher}
                            helperAriaHidden={focusOnErrorFieldId === ACCOUNT_DROPDOWN_STRING.LOCALE_DROPDOWN.ID && true}
                            ariaLabelHelperMessage={evaluateAriaLabelMessage(error_list[ACCOUNT_DROPDOWN_STRING.LOCALE_DROPDOWN.ID])}
                        />
                    </div>
                    <div className={BS.D_FLEX}>
                        <Dropdown
                            id={ACCOUNT_DROPDOWN_STRING.TIMEZONE_DROPDOWN.ID}
                            optionList={timezone_list}
                            selectedValue={formDetails.acc_timezone || null}
                            onChange={onChangeHandler(ACCOUNT_DROPDOWN_STRING.TIMEZONE_DROPDOWN.ID)}
                            placeholder={t(ACCOUNT_DROPDOWN_STRING.TIMEZONE_DROPDOWN.PLACEHOLDER)}
                            label={t(ACCOUNT_DROPDOWN_STRING.TIMEZONE_DROPDOWN.LABEL)}
                            className={styles.Dropdown}
                            innerClassName={styles.DropdownInner}
                            loadData={getDropDownValues}
                            errorMessage={error_list[ACCOUNT_DROPDOWN_STRING.TIMEZONE_DROPDOWN.ID]}
                            isTimeZone
                            isRequired
                            focusOnError={focusOnErrorFieldId === ACCOUNT_DROPDOWN_STRING.TIMEZONE_DROPDOWN.ID}
                            focusOnErrorRefresher={focusOnErrorRefresher}
                            helperAriaHidden={focusOnErrorFieldId === ACCOUNT_DROPDOWN_STRING.TIMEZONE_DROPDOWN.ID && true}
                            ariaLabelHelperMessage={evaluateAriaLabelMessage(error_list[ACCOUNT_DROPDOWN_STRING.TIMEZONE_DROPDOWN.ID])}
                        />
                    </div>
                </div>
                <div className={cx(gClasses.MT20, BS.TEXT_CENTER)}>
                    <Button
                        buttonType={BUTTON_TYPE.AUTH_PRIMARY}
                        onClick={() => submitHandler()}
                    >
                        {t(ACCOUNT_INFO_STRINGS.SAVE_BUTTON)}
                    </Button>
                    <div
                    className={cx(
                        gClasses.FTwo13BlueV39,
                        gClasses.FontWeight600,
                        gClasses.CursorPointer,
                        styles.SignOutButton,
                        )}
                    onClick={() => signOut()}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => keydownOrKeypessEnterHandle(e) && signOut()}
                    >
                    {t(ACCOUNT_INFO_STRINGS.SIGN_OUT)}
                    </div>
                </div>
            </div>
        </div>
    );
}
export default AccountInfoForm;
