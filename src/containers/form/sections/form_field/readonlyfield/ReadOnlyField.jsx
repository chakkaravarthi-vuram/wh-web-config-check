import { EPopperPlacements, ETextSize, ETooltipPlacements, ETooltipType, Label, Text, Tooltip } from '@workhall-pvt-lmt/wh-ui-library';
import React, { useContext, useEffect, useRef } from 'react';
import cx from 'classnames/bind';
import PropTypes from 'prop-types';
import Mustache from 'mustache';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import { useHistory } from 'react-router';
import { connect } from 'react-redux';
import { isBoolean, isEmpty, isNumber, get, getLocale, isArray } from '../../../../../utils/jsUtility';
import { FIELD_TYPE } from '../../../../../utils/constants/form.constant';
import { getFieldType, getLinkForDataListInstance } from './ReadOnlyField.util';
import { getDataListPickerFieldFromActiveForm } from '../../../../landing_page/my_tasks/task_content/TaskContent.utils';
import gClasses from '../../../../../scss/Typography.module.scss';
import { FORM_FIELD_STRINGS } from '../FormField.string';
import { DATE, MODULE_TYPES } from '../../../../../utils/Constants';
import { constructAvatarOrUserDisplayGroupList, getUserProfileData, getUserRoutePath, isBasicUserMode } from '../../../../../utils/UtilityFunctions';
import { RESPONSE_FIELD_KEYS } from '../../../../../utils/constants/form/form.constant';
import Table from '../../../../../components/form_components/table/Table';
import { FORM_TYPE } from '../../../Form.string';
import ReadOnlyFileUploader from '../../../../../components/form_components/file_uploader/ReadOnlyFileUploader';
import { TABLE_FIELD_LIST_TYPE } from '../../../../../utils/ValidationConstants';
import { COMMA, EMPTY_STRING, COLON, SPACE, MONTHS } from '../../../../../utils/strings/CommonStrings';
import styles from './ReadOnlyField.module.scss';
import { getRenderCustomFunctions } from '../../../../../components/information_widget/InformationWidget.utils';
import { getDeactivatedChoiceValue } from '../field/Field.util';
import Image from '../components/image/Image';
import ActionButton from '../components/action_button/ActionButton';
import DATE_FORMAT from '../../../../../utils/constants/dateFormat.constant';
import { DEFAULT_LOCALE } from '../../../../../components/form_components/date_picker/DataPicker.strings';
import HelpIconV2 from '../../../../../assets/icons/HelpIconV2';
import ThemeContext from '../../../../../hoc/ThemeContext';
import UserPicker from '../../../../../components/user_picker/UserPicker';
import DatalistPicker from '../../../../../components/form_components/datalist_picker/DatalistPicker';

const HIDE_LABEL_FIELDS = [FIELD_TYPE.TABLE, FIELD_TYPE.INFORMATION, FIELD_TYPE.IMAGE, FIELD_TYPE.RICH_TEXT, FIELD_TYPE.BUTTON_LINK];
function ReadOnlyField(props) {
  const userProfileData = getUserProfileData();
  const { t } = useTranslation();
  const { fieldData, fieldValue, formData, informationFieldFormContent, documentDetails, column = 0,
    hideLabel = false, metaData, moduleType, prefLocale = userProfileData?.pref_locale, rowIndex = null } = props;
  const { FIELD } = FORM_FIELD_STRINGS(t);
  const fieldType = getFieldType(fieldData);
  const history = useHistory();
  const _hideLabel = hideLabel || HIDE_LABEL_FIELDS.includes(fieldType);
  const isBasicUser = isBasicUserMode(history);
  const infoFieldRef = useRef();
  let renderedTemplate = null;
  const isSummaryMode = moduleType === MODULE_TYPES.SUMMARY;
  if (isSummaryMode && !metaData?.instanceId) {
    renderedTemplate = get(fieldData, [RESPONSE_FIELD_KEYS.INFORMATION_CONTENT, RESPONSE_FIELD_KEYS.EDITOR_TEMPLATE], EMPTY_STRING);
  } else {
    renderedTemplate = get(fieldData, [RESPONSE_FIELD_KEYS.INFORMATION_CONTENT, RESPONSE_FIELD_KEYS.RENDERING_TEMPLATE], EMPTY_STRING);
  }
  const { colorScheme, colorSchemeDefault } = useContext(ThemeContext);
  const isNormalMode = isBasicUserMode(history);
  const pref_locale = localStorage.getItem('application_language');
  const isTable = (fieldData?.[RESPONSE_FIELD_KEYS.FIELD_LIST_TYPES] === TABLE_FIELD_LIST_TYPE);
  const fieldLabel =
    fieldData?.[RESPONSE_FIELD_KEYS.TRANSLATION_DATA]?.[pref_locale]?.[
      RESPONSE_FIELD_KEYS.FIELD_NAME
    ] || fieldData[RESPONSE_FIELD_KEYS.FIELD_NAME];

  function getDateComponents(dateString, locale, localeData) {
    const date = moment(dateString, localeData?.dateFormat, locale);
    const day = date.date();
    const month = date.month() + 1; // month() returns 0-based month
    const year = date.year();

    return { day, month, year };
  }

  const convertDate = (dateString, locale, localeData) => {
    const { day, month, year } = dateString && getDateComponents(dateString, locale, localeData);
    const monthName = MONTHS.find((data) => data?.month === month)?.shortMonth;
    return `${day} ${monthName} ${year}`;
  };

  const convertDateTime = (dateTimeString, locale, localeData) => {
    const [datePart, timePart, period] = dateTimeString && dateTimeString.split(' ');
    const { day, month, year } = datePart && getDateComponents(datePart, locale, localeData);
    const monthName = MONTHS.find((data) => data?.month === month)?.shortMonth;
    return `${day} ${monthName} ${year} ${timePart} ${period}`;
  };

  useEffect(() => {
    if (fieldType === FIELD_TYPE.INFORMATION || fieldType === FIELD_TYPE.RICH_TEXT) {
      let renderJson = {};

      if (!isEmpty(formData)) {
        renderJson = {
          ...(formData || {}),
          ...get(informationFieldFormContent, [fieldData?.[RESPONSE_FIELD_KEYS.FIELD_UUID]], {}),
          ...getRenderCustomFunctions(t),
        };
      }

      try {
        const renderer = Mustache.render(renderedTemplate, renderJson);
        if (infoFieldRef && infoFieldRef.current) {
          infoFieldRef.current.innerHTML = renderer;
        }
      } catch (e) {
        console.log(e);
      }
    }
  }, [renderedTemplate]);

  const getFieldValue = () => {
    if (
      !isBoolean(fieldValue) &&
      !isNumber(fieldValue) &&
      isEmpty(fieldValue) &&
      ![
        FIELD_TYPE.TABLE,
        FIELD_TYPE.INFORMATION,
        FIELD_TYPE.IMAGE,
        FIELD_TYPE.RICH_TEXT,
        FIELD_TYPE.BUTTON_LINK,
      ].includes(fieldType)
    ) {
      return '-';
    }

    switch (fieldType) {
      case FIELD_TYPE.LINK:
        const modifiedFieldValue = isArray(fieldValue) ? fieldValue.map((link) => { return { link_text: link.link_text, link_url: link.link_url }; }) : null;
        return modifiedFieldValue?.map((eachLink, index) => {
          console.log('checkeachLink');
          return (
            <div className={cx(gClasses.DisplayFlex, gClasses.Gap4, (index !== 0) && gClasses.MT4)}>
              {!isSummaryMode &&
              <>
                <Tooltip
                  id={`${fieldData?.[RESPONSE_FIELD_KEYS.FIELD_UUID]},${rowIndex},${index},link_text`}
                  text={eachLink?.link_text}
                  tooltipType={ETooltipType.INFO}
                  tooltipPlacement={ETooltipPlacements.AUTO}
                  icon={
                    <Text
                      id={`${fieldData?.[RESPONSE_FIELD_KEYS.FIELD_UUID]},${rowIndex},${index},link_text`}
                      content={eachLink?.link_text}
                      className={cx(gClasses.FTwo13Black, styles.LinkText)}
                    />
                  }
                />
                <Text
                  content={COLON}
                  className={cx(gClasses.FTwo13Black)}
                />
              </>
              }
              <Tooltip
                tooltipClass={styles.LinkURLTooltip}
                id={`${fieldData?.[RESPONSE_FIELD_KEYS.FIELD_UUID]},${rowIndex},${index},link_url`}
                text={eachLink?.link_url}
                tooltipType={ETooltipType.INFO}
                tooltipPlacement={ETooltipPlacements.AUTO}
                icon={
                  <a
                    id={`${fieldData?.[RESPONSE_FIELD_KEYS.FIELD_UUID]},${rowIndex},${index},link_url`}
                    className={cx(styles.LinkURL, (column > 2) && styles.UrlMaxWidth)}
                    href={eachLink?.link_url}
                    target="_blank"
                    rel="noreferrer"
                  >
                      {eachLink?.link_url}
                  </a>
                }
              />
            </div>
          );
        });
      case FIELD_TYPE.CHECKBOX: {
        const choices = fieldData[RESPONSE_FIELD_KEYS.CHOICE_VALUES] || [];
        const deactivatedOptions = getDeactivatedChoiceValue(choices, fieldValue);
        const selectedLabels = choices?.filter((c) => fieldValue.includes(c.value)).map((c) => c.label) || [];
        const allOptions = [...selectedLabels, ...deactivatedOptions];
        const label = (allOptions).join(COMMA + SPACE);
        return <Text content={label} />;
      }
      case FIELD_TYPE.DROPDOWN:
      case FIELD_TYPE.RADIO_GROUP: {
        const label = fieldData[RESPONSE_FIELD_KEYS.CHOICE_VALUES]?.find?.((c) => c.value === fieldValue)?.label || fieldValue;
        return <Text content={label} />;
      }
      case FIELD_TYPE.CURRENCY: {
        const { value, currency_type } = fieldValue;
        if (isEmpty(value?.toString())) return '-';
        const currLocale = getLocale(currency_type);
        const updatedValue = new Intl.NumberFormat([currLocale]).format(value);
        return <Text content={`${updatedValue} ${currency_type}`} />;
      }
      case FIELD_TYPE.PHONE_NUMBER: {
        const { phone_number, country_code } = fieldValue;
        return phone_number && <Text content={`${country_code} ${phone_number}`} />;
      }
      case FIELD_TYPE.YES_NO: {
        const content = fieldValue
        ? FIELD.YES_OR_NO_OPTIONS[0].label
        : FIELD.YES_OR_NO_OPTIONS[1].label;
        return <Text content={content} />;
      }
      case FIELD_TYPE.DATE: {
        const localeData = DATE_FORMAT[prefLocale] || DEFAULT_LOCALE;
        const content = moment.parseZone(fieldValue).format(localeData.dateFormat);
        return <Text content={convertDate(content, prefLocale, localeData)} />;
      }
      case FIELD_TYPE.DATETIME: {
        const localeData = DATE_FORMAT[prefLocale] || DEFAULT_LOCALE;
        const content = moment.parseZone(fieldValue).format((localeData.dateFormat).concat(` ${DATE.TIME_FORMAT}`));
        return <Text content={convertDateTime(content, prefLocale, localeData)} />;
      }
      case FIELD_TYPE.INFORMATION:
      case FIELD_TYPE.RICH_TEXT:
        return (
          <div
            ref={infoFieldRef}
            className={cx(styles.InfoField, {
              [gClasses.NoPointerEvent]:
                moduleType === MODULE_TYPES.SUMMARY && !metaData?.instanceId,
            })}
            style={{
              backgroundColor: fieldData[RESPONSE_FIELD_KEYS.BACKGROUND_COLOR],
            }}
          />
        );
      case FIELD_TYPE.DATA_LIST: {
        const entries = getDataListPickerFieldFromActiveForm(fieldValue);

        const onChipClick = (entry) => {
          const toPath = `${getLinkForDataListInstance(
            entry.datalistUUID,
            entry.value,
            isBasicUser,
          )}`;
          window.open(getUserRoutePath(toPath), '_blank');
        };

        const fieldLabel = hideLabel ? null : (fieldData[RESPONSE_FIELD_KEYS.FIELD_NAME] || fieldData?.name);
        return (
          <DatalistPicker
            id={fieldData.field_uuid}
            selectedValue={entries || []}
            disabled
            formType={FORM_TYPE.READONLY_FORM}
            className={gClasses.CursorPointer}
            maxCountLimit={isTable ? 2 : entries?.length}
            maxSelectionCount={entries?.length}
            colorScheme={isNormalMode ? colorScheme : colorSchemeDefault}
            referenceName={fieldData?.referenceName}
            getPopperContainerClassName={(isOpen) => isOpen && gClasses.ZIndex13}
            labelClassName={cx({ [styles.LabelCreationLabel]: fieldLabel?.length > 20 }, styles.Margin0)}
            choiceObj={fieldData[RESPONSE_FIELD_KEYS.CHOICE_VALUE_OBJ]}
            displayLength={30}
            onChipClick={onChipClick}
          />
        );
      }
      case FIELD_TYPE.USER_TEAM_PICKER: {
        const userTeamList = constructAvatarOrUserDisplayGroupList(fieldValue);
        if (isEmpty(fieldValue?.users) && isEmpty(fieldValue?.teams)) return '-';
        const fieldLabel = hideLabel ? null : (fieldData[RESPONSE_FIELD_KEYS.FIELD_NAME] || fieldData?.name);
        return (
          <UserPicker
            id={fieldData.field_uuid}
            isSearchable
            popperPosition={EPopperPlacements.AUTO}
            selectedValue={fieldValue || {}}
            disabled
            className={gClasses.NoPointerEvent}
            colorScheme={isNormalMode ? colorScheme : colorSchemeDefault}
            referenceName={fieldData?.referenceName}
            maxCountLimit={isTable ? 2 : userTeamList?.length}
            maxLimit={userTeamList.length}
            hideAddText
            getPopperContainerClassName={(isOpen) =>
              isOpen ? gClasses.ZIndex13 : EMPTY_STRING}
            isForm
            noDataFoundMessage={t('common_strings.no_results_found')}
            labelClassName={cx({ [styles.LabelCreationLabel]: fieldLabel > 20 }, styles.Margin0, gClasses.MB8)}
            selectedValueContainerClassName={gClasses.MT0}
            displayLength={30}
          />
        );
      }

      case FIELD_TYPE.FILE_UPLOAD: {
        return (
          <ReadOnlyFileUploader
            label={fieldData?.[RESPONSE_FIELD_KEYS.FIELD_NAME]}
            files={fieldValue || []}
            isTable={fieldData?.[RESPONSE_FIELD_KEYS.FIELD_LIST_TYPES] === TABLE_FIELD_LIST_TYPE}
          />
        );
      }

      case FIELD_TYPE.TABLE: {
        return (
          <Table
            fieldData={fieldData}
            fieldValue={fieldValue}
            documentDetails={documentDetails}
            onChangeHandler={() => {}}
            formType={FORM_TYPE.READONLY_FORM}
            metaData={{}}
            validationMessage={{}}
            isLoading={false}
            onEdit={() => {}}
            formData={formData}
            moduleType={moduleType}
          />
        );
      }

      case FIELD_TYPE.PARAGRAPH: {
        let modifiedValue = fieldValue;
        if (fieldData?.validations?.isEllipseText && (fieldData?.validations?.maxEllipseChar)) {
          modifiedValue = fieldValue.substring(0, fieldData?.validations?.maxEllipseChar);
        }
        console.log('asdfasdfnextline', formData, fieldData?.fieldName, modifiedValue, fieldValue);
        console.log('asdfasdfnextline', formData, fieldData?.fieldName, modifiedValue, fieldValue);
        return (
          <Text
            content={modifiedValue}
            title={fieldValue}
            style={{ whiteSpace: 'pre-line' }}
            className={(fieldData?.validations?.isEllipseText && (fieldValue.length > fieldData?.validations?.maxEllipseChar)) && styles.Ellipsis}
          />
        );
      }
      case FIELD_TYPE.NUMBER: {
        const getNumberFieldValue = () => {
          if (fieldData?.isDigitFormatted) return new Intl.NumberFormat([pref_locale]).format(fieldValue);
          else return fieldValue;
        };
        return <Text content={getNumberFieldValue()} />;
      }
      case FIELD_TYPE.IMAGE: {
        return <Image imageId={fieldData.imageId} />;
      }
      case FIELD_TYPE.BUTTON_LINK: {
        return <ActionButton fieldDetails={fieldData} metaData={metaData} isViewOnly={!metaData?.instanceId} />;
      }

      default:
        return <Text content={fieldValue.toString()} />;
    }
  };

  const getHelpTextTooltip = () => {
    if (
      moduleType !== MODULE_TYPES.SUMMARY ||
      !fieldData[RESPONSE_FIELD_KEYS.HELP_TEXT]
    ) {
      return null;
    }
    return (
      <Tooltip
        text={fieldData[RESPONSE_FIELD_KEYS.HELP_TEXT]}
        tooltipType={ETooltipType.INFO}
        tooltipPlacement={ETooltipPlacements.TOP}
        icon={<HelpIconV2 />}
      />
    );
  };
  const getInstructionText = () => {
    if (
      moduleType !== MODULE_TYPES.SUMMARY ||
      !fieldData[RESPONSE_FIELD_KEYS.INSTRUCTION]
    ) {
      return null;
    }
    return (
      <div className={gClasses.PT4}>
        <Text
          content={fieldData[RESPONSE_FIELD_KEYS.INSTRUCTION]}
          size={ETextSize.XS}
          className="text-black-60 font-inter whitespace-normal"
        />
      </div>
    );
  };

  return (
    <div>
      {!_hideLabel && (
        <div className={gClasses.CenterV}>
          <Label
            id={`${fieldData[RESPONSE_FIELD_KEYS.FIELD_UUID]}_label`}
            labelName={fieldLabel || fieldData?.name}
            innerLabelClass={cx(gClasses.FontWeightBoldImportant, gClasses.MB0)}
          />
          {getHelpTextTooltip()}
        </div>
      )}
      {getFieldValue()}
      {getInstructionText()}
    </div>
  );
}

const mapStateToProps = ({ UserPreferenceReducer }) => {
  return {
    prefLocale: UserPreferenceReducer.acc_locale,
  };
};

export default connect(mapStateToProps)(ReadOnlyField);
ReadOnlyField.propTypes = {
  fieldData: PropTypes.object,
  fieldValue: PropTypes.any,
  hideLabel: PropTypes.bool,
  formData: PropTypes.object,
  documentDetails: PropTypes.object,
};

ReadOnlyField.defaultProps = {
  fieldData: {},
  fieldValue: null,
  hideLabel: false,
  formData: {},
  documentDetails: {},
};
