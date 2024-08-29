import React, { useState, useContext, useEffect } from 'react';
import cx from 'classnames/bind';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import parse from 'html-react-parser';
import { join, isArray, isEmpty, has, isNull, get } from 'lodash';
import { withRouter, Link as RouterLink } from 'react-router-dom';
import { connect } from 'react-redux';
import moment from 'moment';
import { GET_ALL_DATA_LIST_ENTRY_DETAILS_BY_FILTER } from 'urls/ApiUrls';
import DataSetIcon from 'assets/icons/DataSetIcon';
import { SERVER_ERROR_CODES } from 'utils/ServerConstants';
import { FORM_POPOVER_STATUS } from 'utils/Constants';
import UserDisplay from 'components/user_display/UserDisplay';
import { getLanguageAndCalendarDataThunk } from 'redux/actions/LanguageAndCalendarAdmin.Action';
import Tooltip from 'components/tooltip/Tooltip';
import { accountConfigurationDataChangeAction } from 'redux/actions/AccountConfigurationAdmin.Action';
import { getCurrencyFromAllowedCurrencyTypes } from 'utils/taskContentUtils';
import { DEFAULT_CURRENCY_TYPE } from 'utils/constants/currency.constant';
import BarCodeScanner from 'components/qr_bar_scanner/BarCodeScanner';
import ScannerIcon from 'assets/icons/ScannerIcon';
import ImportedIcon from 'assets/icons/form_fields/ImportedIcon';
import EditIconNew from 'assets/icons/form_fields/EditIconNew';
import DeleteIconNew from 'assets/icons/form_fields/DeleteIconNew';
import ReadOnlyIcon from 'assets/icons/form_fields/ReadOnlyIcon';
import { getFieldType } from 'containers/edit_flow/step_configuration/StepConfiguration.utils';
import { translate } from 'language/config';
import ThemeContext from '../../../../hoc/ThemeContext';
import FormBuilderContext from '../../FormBuilderContext';

import Input from '../../../form_components/input/Input';
import Dropdown from '../../../form_components/dropdown/Dropdown';
import DatePicker from '../../../form_components/date_picker/DatePicker';
import RadioGroup, {
  RADIO_GROUP_TYPE,
} from '../../../form_components/radio_group/RadioGroup';
import TextArea from '../../../form_components/text_area/TextArea';
import FileUpload from '../../../form_components/file_upload/FileUpload';
import ReadOnlyText from '../../../form_components/read_only_text/ReadOnlyText';

import styles from './FormField.module.scss';
import gClasses from '../../../../scss/Typography.module.scss';
import {
  FORM_STRINGS,
  FIELD_TYPES,
  READ_ONLY_FIELD_TYPES,
  IMPORT_INSTRUCTION,
  CHECKBOX_SELECT_ALL,
} from '../../FormBuilder.strings';
import { ARIA_ROLES, BS } from '../../../../utils/UIConstants';
import CheckboxGroup from '../../../form_components/checkbox_group/CheckboxGroup';
import {
  arryToDropdownData,
  getUserProfileData,
  hasOwn,
  keydownOrKeypessEnterHandle,
  showToastPopover,
} from '../../../../utils/UtilityFunctions';
import {
  EMPTY_STRING,
  DROPDOWN_CONSTANTS,
  COMMA,
  SPACE,
  SERVER_ERROR_CODE_STRINGS,
} from '../../../../utils/strings/CommonStrings';
import InputDropdown from '../../../form_components/input_dropdown/InputDropdown';
import MobileNumber from '../../../form_components/mobile_number/MobileNumber';
import FileUploadProgress from '../../../form_components/file_upload_progress/FileUploadProgress';
import ButtonSwitch from '../../../form_components/button_switch/ButtonSwitch';
import DataListPropertyPicker from '../../../form_components/data_list_property_picker/DataListPropertyPicker';
import ConditionalWrapper from '../../../conditional_wrapper/ConditionalWrapper';
import AutoPositioningPopper, {
  POPPER_PLACEMENTS,
} from '../../../auto_positioning_popper/AutoPositioningPopper';
import jsUtils, {
  formatter,
  getLocale,
  multiNullCheck,
  formatLocale,
} from '../../../../utils/jsUtility';
import {
  formatEngine,
  getFieldErrorMessage,
  getTaskParentId,
  validateLocale,
} from './FormField.utils';
import ReadOnlyFileUpload from './ReadOnlyFileUpload';
import {
  FIELD_LIST_TYPE,
  FORM_FIELD_CONFIG_ACTIONS,
  FORM_FIELD_CONFIG_TYPES,
  FORM_TYPES,
  FIELD_ACCESSIBILITY_TYPES,
  FIELD_OR_FIELD_LIST,
  FORM_PARENT_MODULE_TYPES,
  USER_TEAM_PICKER_CHANGE_HANDLER_TYPES,
  PROPERTY_PICKER_KEYS,
  PROPERTY_PICKER_ARRAY,
} from '../../../../utils/constants/form.constant';
import { store } from '../../../../Store';
import Label from '../../../form_components/label/Label';
import { getDropdownData } from '../../../../utils/generatorUtils';
import LinkField from '../../../form_components/link_field/LinkField';
import { DATE } from '../../../../utils/Constants';
import AddMembers from '../../../member_list/add_members/AddMembers';
import Link from '../../../form_components/link/Link';
import {
  getValidationTabUserTeamPickerSelectedData,
  getTableFieldStyle,
  userTeamPickerChangeHandler,
} from '../../../../utils/formUtils';
import { DATA_LIST_DASHBOARD } from '../../../../urls/RouteConstants';
import { getAccountConfigurationDetailsApiService } from '../../../../axios/apiService/accountConfigurationDetailsAdmin.apiService';
import {
  DATA_LIST_PROPERTY_PICKER,
  USER_LIST_PROPERTY_PICKER_INFO,
  ARIA_LABEL,
  FIELD_VIEW_TYPE,
} from './FormField.strings';
import { getDataListPickerFieldFromActiveForm } from '../../../../containers/landing_page/my_tasks/task_content/TaskContent.utils';
import DependencyHandler from '../../../dependency_handler/DependencyHandler';
import FieldConfiguration from '../../../../containers/form/sections/field_configuration/FieldConfiguration';

function FormFields(props) {
  const {
    formType,
    isCompletedForm,
    onFormFieldOpenAndCloseHandler,
    onFieldAccessibilityHandler,
    parentModuleType,
    onFieldSelectHandler,
    deleteFormFieldFromDependencyConfig,
    dependencyConfigData: {
      showFieldDependencyDialog = {},
      dependency_data,
      dependency_type,
    } = {},
    dependencyConfigCloseHandler,
    isReadOnlyForm,
    deleteFormFieldHandler,
    dataListAuditfields,
    auditedTabelRows,
    isAuditView,
    tabelfieldEditedList,
  } = useContext(FormBuilderContext);
  const {
    sectionIndex,
    fieldListIndex,
    fieldIndex,
    fieldList,
    fieldList: { field_list_type },
    field_data,
    field_data: { read_only, form_count },
    sectionId,
    onChangeHandler,
    stateData,
    isImportableForm,
    activeFormContent,
    isTable,
    tableRow,
    index,
    tableUuid,
    // formVisibility,
    eachFieldVisibility,
    formVisible,
    formVisibility,
    working_days,
    default_currency_type,
    setAccountConfigurationData,
    rowId,
    temp_row_uuid,
    allow_modify_existing,
    isFirstTableField = false,
    serverErrorMessage,
    wrapperEditableClassName,
  } = props;
  const { t } = useTranslation();
  const [table_row] = useState(tableRow);
  const [referencePopperElement, setReferencePopperElement] = useState(null);
  const { buttonColor } = useContext(ThemeContext);
  const [dataListFieldSearch, setDataListFieldSearch] = useState('');
  const [dataListErrorMessage, setDataListErrorMessage] = useState('');
  const [dataListErrorInstruction, setDataListErrorInstruction] = useState('');
  // const [userData, setUserData] = useState();
  const [prevNumber, setPrevNumber] = useState('');
  const [eachKeyStroke, seteachKeyStroke] = useState('');
  const isBoolean = (value) => typeof value === 'boolean';
  const isNumber = (value) => typeof value === 'number';
  const fieldPostion = isTable ? field_data.column_order : fieldList.row_order;
  const fieldVisibility = eachFieldVisibility;
  const {
    uniqueColumnError,
    fieldErrorMessage,
    currencyValueError,
    linkFieldError,
    phoneFieldError,
  } = getFieldErrorMessage(
    isTable,
    jsUtils.cloneDeep(stateData),
    sectionId,
    fieldListIndex,
    field_data,
    table_row,
    temp_row_uuid, // || rowId,
  );
  const {
    userDetails,
    getMoreDependency,
  } = useContext(FormBuilderContext);
  const accountLocale = formatLocale(store.getState().RoleReducer.acc_locale);
  const pref_locale = localStorage.getItem('application_language');
  const [prevCount, setPrevCount] = useState(0);
  const [prevNum, setPrevNum] = useState('');
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const isEditableField = formType === FORM_TYPES.EDITABLE_FORM;
  const isCreationField = formType === FORM_TYPES.CREATION_FORM;
  const sharedStepInfo = `${FIELD_VIEW_TYPE.SHARED_IN_LABEL} ${form_count} ${FIELD_VIEW_TYPE.STEPS_LABEL}`;

  const { translation_data } = field_data;
  const fieldName = isEditableField ?
    (translation_data?.[pref_locale]?.field_name || field_data.field_name) : field_data.field_name;

  const fieldPlaceholder = isEditableField ?
    (translation_data?.[pref_locale]?.place_holder || field_data.place_holder) : field_data.place_holder;

  const fieldHelpText = isEditableField ?
    (translation_data?.[pref_locale]?.help_text || field_data.help_text) : field_data.help_text;

  const fieldInstruction = isEditableField ?
    (translation_data?.[pref_locale]?.instructions || field_data.instructions) : field_data.instructions;

  const fieldTypeInstruction =
    !field_data.is_allow_value_update && isCreationField ? (
      <p className={cx(styles.FieldTypeInstruction, gClasses.FOne12GrayV17, BS.D_FLEX)}>
        {(form_count > 1) &&
          <div className={read_only && gClasses.MR12} id="importedIcon">
            <ImportedIcon className={styles.ImportedIcon} title={sharedStepInfo} />
          </div>
        }
        {field_data.read_only ?
          <div id="readonlyIcon">
            <ReadOnlyIcon title={FIELD_VIEW_TYPE.READONLY} />
          </div>
          : null}
      </p>
    ) : null;

  console.log('fieldTypeInstructionfieldTypeInstruction', fieldTypeInstruction);

  const [editIcon, setEditIcon] = useState(
    isImportableForm ||
      isEditableField ||
      // isTable ||
      (field_data.is_system_defined &&
        !field_data.is_allow_value_update) ? null : (
      <button
        className={cx(
          styles.EditIconContainer,
          gClasses.ML10,
          gClasses.CenterVH,
          gClasses.CursorPointer,
          gClasses.ClickableElement,
        )}
        onClick={() =>
          onFormFieldOpenAndCloseHandler(
            FORM_FIELD_CONFIG_ACTIONS.OPEN,
            FORM_FIELD_CONFIG_TYPES.FIELD,
            FIELD_LIST_TYPE.DIRECT,
            sectionIndex,
            fieldListIndex,
            fieldIndex,
          )
        }
      >
        <EditIconNew role={ARIA_ROLES.IMG} ariaLabel={ARIA_LABEL.EDIT} className={styles.EditIcon} />
      </button>
    ),
  );
  console.log('deleteIconchange', isCreationField);
  const [deleteIcon, setDeleteIcon] = useState(
    isImportableForm ||
      (!field_data.is_system_defined && isCreationField) ? (
      <button
        className={cx(
          styles.EditIconContainer,
          gClasses.ML10,
          gClasses.CenterVH,
          gClasses.CursorPointer,
          gClasses.ClickableElement,
          styles.DeleteIcon,
        )}
        onClick={() => deleteFormFieldHandler(FIELD_OR_FIELD_LIST.FIELD, sectionIndex, fieldListIndex, fieldIndex)}
      >
        <DeleteIconNew role={ARIA_ROLES.IMG} ariaLabel={ARIA_LABEL.DELETE} />
      </button>
    ) : null,
  );
  useEffect(() => {
    setDeleteIcon(
      isImportableForm ||
        (!field_data.is_system_defined && isCreationField) ? (
        <button
          className={cx(
            styles.EditIconContainer,
            gClasses.CenterVH,
            gClasses.CursorPointer,
            gClasses.ClickableElement,
            styles.DeleteIcon,
          )}
          aria-label={ARIA_LABEL.DELETE + SPACE + fieldName}
          onClick={() => deleteFormFieldHandler(FIELD_OR_FIELD_LIST.FIELD, sectionIndex, fieldListIndex, fieldIndex)}
        >
          <DeleteIconNew role={ARIA_ROLES.IMG} ariaLabel={ARIA_LABEL.DELETE} />
        </button>
      ) : null,
    );
    setEditIcon(
      isImportableForm ||
        isEditableField ||
        // isTable ||
        (field_data.is_system_defined &&
          !field_data.is_allow_value_update) ? null : (
        <button
          className={cx(
            styles.EditIconContainer,
            gClasses.CenterVH,
            gClasses.CursorPointer,
            gClasses.ClickableElement,
          )}
          onClick={() =>
            onFormFieldOpenAndCloseHandler(
              FORM_FIELD_CONFIG_ACTIONS.OPEN,
              FORM_FIELD_CONFIG_TYPES.FIELD,
              FIELD_LIST_TYPE.DIRECT,
              sectionIndex,
              fieldListIndex,
              fieldIndex,
            )
          }
        >
          <EditIconNew role={ARIA_ROLES.IMG} ariaLabel={ARIA_LABEL.EDIT + SPACE + fieldName} className={styles.EditIcon} />
        </button>
      ),
    );
  }, [field_data]);
  const globalKeyDownHandler = (event) => {
    if (
      field_data.field_type === FIELD_TYPES.NUMBER ||
      field_data.field_type === FIELD_TYPES.CURRENCY
    ) {
      seteachKeyStroke(event.key);
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', globalKeyDownHandler);

    if (field_data.field_type === FIELD_TYPES.CURRENCY ||
      field_data.field_type === FIELD_TYPES.FILE_UPLOAD) {
      getAccountConfigurationDetailsApiService().then((response) => {
        if (!default_currency_type && field_data.field_type === FIELD_TYPES.CURRENCY) {
          const response_ = {
            default_currency_type: jsUtils.get(response, ['default_currency_type'], EMPTY_STRING),
          };
          setAccountConfigurationData(response_);
        } else if (field_data.field_type === FIELD_TYPES.FILE_UPLOAD) {
          const response_ = {
            allowed_extensions: jsUtils.get(response, ['allowed_extensions'], []),
          };
          setAccountConfigurationData(response_);
        }
        // setUserData(response);
      });
    }
    if (!jsUtils.isEmpty(field_data.validations) &&
      field_data.validations.allow_working_day
    ) {
      const { getLanguageAndCalendarData } = props;
      getLanguageAndCalendarData();
    }
    return (() => document.removeEventListener('keydown', globalKeyDownHandler));
  }, []);

  const getDropdownDataEditable = (list) => {
    const dropdownData = [];
    if (!jsUtils.isEmpty(list)) {
      list.map((data) => {
        dropdownData.push({
          [DROPDOWN_CONSTANTS.OPTION_TEXT]: data,
          [DROPDOWN_CONSTANTS.VALUE]: data,
        });
        return data;
      });
    }

    return dropdownData;
  };

  const getDatalistValidateParamData = () => {
    const {
      filter_fields,
    } = field_data.validations;
    const fieldData = {};
    const entryIds = [];
    if (!jsUtils.isEmpty(filter_fields)) {
      filter_fields.forEach((validField) => {
        if (validField.value_type === 'field') {
          if (isBoolean(stateData[validField.field]) || !jsUtils.isEmpty(stateData[validField.field]) || isNumber(stateData[validField.field])) {
            fieldData[validField.field] = stateData[validField.field];
            if (stateData[field_data.field_uuid]) {
              const datalistData = stateData[field_data.field_uuid];
              if (!entryIds.includes(datalistData)) datalistData.forEach(({ value }) => entryIds.push(value));
            }
          }
          Object.keys(stateData).forEach((fieldKey) => {
            if (isArray(stateData[fieldKey])) {
              const inOperatorArrayValue = [];
              stateData[fieldKey] && stateData[fieldKey].forEach((fieldDataValue, index) => {
                if ((field_list_type === FIELD_LIST_TYPE.TABLE && tableRow === index) || (field_list_type === FIELD_LIST_TYPE.DIRECT)) {
                  const data = (field_list_type === FIELD_LIST_TYPE.TABLE) && get(stateData, [fieldKey, index, field_data.field_uuid], null);
                  if (data) {
                    const datalistData = data[0];
                    if (!entryIds.includes(datalistData)) entryIds.push(datalistData.value);
                  }
                  if (isBoolean(fieldDataValue[validField.field]) || !jsUtils.isEmpty(fieldDataValue[validField.field]) || isNumber(fieldDataValue[validField.field])) {
                    if (validField.operator === 'in') {
                      inOperatorArrayValue.push(fieldDataValue[validField.field]);
                      fieldData[validField.field] = inOperatorArrayValue;
                    } else {
                      fieldData[validField.field] = fieldDataValue[validField.field];
                    }
                  }
                }
              });
            }
          });
        }
      });
    }
    const instanceId = jsUtils.get(stateData.active_task_details, ['task_log_info', 'instance_id']);
    if (instanceId) fieldData.instance_id = instanceId;
    if (isTable && rowId) fieldData.row_id = rowId;
    return {
      fieldData, entryIds,
    };
  };

  const handleScannerOpen = () => {
    setIsScannerOpen(true);
  };
  const onCheckboxMultipleValuesChangeHandler = (
    stateValue = [],
    field_uuid,
    valuesArray = [],
    field_type,
  ) => {
    stateValue = isEmpty(stateValue) ? [] : stateValue;
    valuesArray.forEach((value) => {
      const index = stateValue.indexOf(value);
      if (index !== -1) stateValue.splice(index, 1);
      else stateValue.push(value);
    });
    onChangeHandler(
      field_uuid,
      stateValue,
      field_type,
      sectionIndex,
      fieldListIndex,
      fieldIndex,
      tableRow,
    );
  };
  const onCheckboxChangeHandler = (
    stateValue = [],
    field_uuid,
    value,
    field_type,
    optionList = [],
  ) => {
    stateValue = isEmpty(stateValue) ? [] : stateValue;
    if (value === CHECKBOX_SELECT_ALL.VALUE) {
      const optionData = optionList.map((list) => list.value);
      if (stateValue.length === optionData.length) {
        stateValue = [];
      } else stateValue = optionData;
    } else {
      let selectedData = jsUtils.cloneDeep(stateValue);
      const index = selectedData.indexOf(value);
      if (index !== -1) {
        selectedData = selectedData.filter((data, actualIndex) => actualIndex !== index && data !== CHECKBOX_SELECT_ALL.VALUE);
      } else selectedData.push(value);
      stateValue = selectedData;
    }
    onChangeHandler(
      field_uuid,
      stateValue,
      field_type,
      sectionIndex,
      fieldListIndex,
      fieldIndex,
      tableRow,
    );
  };
  const getCheckboxEditable = (list) => {
    const dropdownData = [];
    if (!jsUtils.isEmpty(list)) {
      list.map((data) => {
        dropdownData.push({
          label: data,
          value: data,
        });
        return data;
      });
    }
    return dropdownData;
  };

  const onRetryFileUploadClicked = (fileId, index) => {
    const { onRetryFileUploadClick } = props;
    if (tableUuid) onRetryFileUploadClick(fileId, tableUuid, tableRow, index);
    else onRetryFileUploadClick(fileId, undefined, undefined, index);
  };

  const onDeleteFileClicked = (fileId, index) => {
    const { onDeleteFileClick } = props;
    console.log('onDeleteFileClicked', index);
    if (tableUuid) onDeleteFileClick(fileId, tableUuid, tableRow, undefined, index);
    else onDeleteFileClick(fileId, undefined, undefined, undefined, index);
  };
  const onTagClickForDataListPicker = (
    dataListUUID,
    dataListEntryId,
    returnLink,
  ) => {
    if (dataListUUID && dataListEntryId) {
      const navLink = `${DATA_LIST_DASHBOARD}/${dataListUUID}/${dataListEntryId}`;
      if (returnLink) return navLink;
      window.open(navLink, '_blank');
    }
    return null;
  };
  const getTableFieldValue = (isCompletedTask) => {
    console.log('tbcontentcheck');
    let fieldValue = null;
    let emptyRowIncrmentor = 0;
    if (isTable && stateData.active_task_details) {
      const sectionData =
        stateData.active_task_details.form_metadata.sections[sectionIndex];
      const tableUuid = sectionData.field_list[fieldListIndex].table_uuid;
      const tableSection = stateData[tableUuid];
      console.log('a11', tableSection);
      const tableRowData = tableSection[tableRow];
      tableSection.forEach((table_row_check) => {
        let tableRowFieldEmptyIncrementor = 0;
        Object.keys(table_row_check).forEach((tableRowField) => {
          // if (Object.keys(table_row_check).includes('_id')) delete table_row_check._id;
          if ((
            table_row_check[tableRowField] === undefined ||
            table_row_check[tableRowField] === null || (typeof table_row_check[tableRowField] !== 'boolean' && jsUtils.isEmpty(table_row_check[tableRowField]))
          )) {
            tableRowFieldEmptyIncrementor += 1;
          }
        });
        if (
          Object.keys(table_row_check).length === tableRowFieldEmptyIncrementor
        ) { emptyRowIncrmentor += 1; }
      });
      // if table has multiple rows and all are empty display no vales found
      if (
        emptyRowIncrmentor === tableSection.length &&
        isCompletedTask &&
        Object.keys(tableRowData)[0] === field_data.field_uuid
      ) {
        fieldValue = 'No values found';
      } else {
        fieldValue =
          tableRowData[field_data.field_uuid] === null
            ? ''
            : tableRowData[field_data.field_uuid]; // table with empty rows will be intialized with null so there is a problem on deletion with value=null displays previous values
      }
    }
    return fieldValue;
  };

  const getReadOnlyFieldData = () => {
    let value = null;
    let content = null;
    let link = null;
    const fieldType = getFieldType(field_data);
    if (isTable) {
      content = getTableFieldValue(isCompletedForm);
    } else {
      content = stateData[field_data.field_uuid];
    }
    console.log('getReadOnlyFieldData', content, field_data);
    const activeDataContent = jsUtils.get(stateData, ['active_task_details', 'active_form_content']);
    const isDeleted = activeDataContent && activeDataContent[field_data.field_uuid] && activeDataContent[field_data.field_uuid].is_deleted;
    // if (content && content.file && content.fileName && content.file.url) {
    //   value = content.fileName;
    //   link = content.file.url;
    // }
    if (content && fieldType === FIELD_TYPES.DATE && content !== 'No values found') {
      value = moment.parseZone(content).format(DATE.DATE_FORMAT);
    } else if (content && fieldType === FIELD_TYPES.DATETIME && content !== 'No values found') {
      const userProfileData = getUserProfileData();
      if (content && userProfileData.pref_utc_offsetStr) {
        value = moment
          .parseZone(content)
          // .utcOffset(userProfileData.pref_utc_offsetStr)
          .format(DATE.DATE_AND_TIME_FORMAT);
      } else { value = moment.parseZone(content).format(DATE.DATE_AND_TIME_FORMAT); }
    } else if ((content) && fieldType === FIELD_TYPES.DATA_LIST) {
      if (content) {
        let consolidatedContent = (content || []);
        let data_list_uuid = jsUtils.get(field_data, ['data_list', 'data_list_uuid']);

        if (field_data.field_type === FIELD_TYPES.DATA_LIST_PROPERTY_PICKER) {
          if (has(content, ['entry_details'], false)) consolidatedContent = (getDataListPickerFieldFromActiveForm(content) || []);
          data_list_uuid = jsUtils.get(content, [PROPERTY_PICKER_KEYS.DATA_LIST_UUID], null);
        }
        if (field_data.field_type === FIELD_TYPES.USER_PROPERTY_PICKER) {
          if (has(content, ['entry_details'], false)) consolidatedContent = (getDataListPickerFieldFromActiveForm(content) || []);
          data_list_uuid = jsUtils.get(content, [PROPERTY_PICKER_KEYS.DATA_LIST_UUID], null);
        }
        if (isDeleted) {
          value = jsUtils.isArray(consolidatedContent) && consolidatedContent.map((eachEntry) => (
            <h6 className={gClasses.FTwo11BlackV13}>
              {`${eachEntry && eachEntry.label} - Field is Deleted`}
              {' '}
            </h6>
          ));
        } else if (content) {
          value = (jsUtils.isArray(consolidatedContent)) ? consolidatedContent && consolidatedContent.map((eachEntry, index) => (
            <span>
              <RouterLink
                to={`${onTagClickForDataListPicker(
                  data_list_uuid,
                  eachEntry.value,
                  true,
                )}?openInstance=true`}
                target="_blank"
              >
                {eachEntry.label}
              </RouterLink>

              <span>{consolidatedContent.length - 1 === index ? '' : ', '}</span>
            </span>
          )) : null;
        } else value = null;
      }
    } else if (content && fieldType === FIELD_TYPES.LINK) {
      value = <LinkField links={content} hideLabel readOnly />;
    } else if (content && fieldType === FIELD_TYPES.INFORMATION) {
      const consolidatedContent = field_data.default_value || content;
      value = (
        <span className={cx(styles.InfoSpan)}>
          {consolidatedContent && parse(consolidatedContent)}
        </span>
      );
    } else if (
      content &&
      fieldType === FIELD_TYPES.USER_TEAM_PICKER
    ) {
      console.log('getReadOnlyTextComponent - content', content);
      const users = content.users
        ? content.users.map((eachUser) => (
          <UserDisplay className={gClasses.MR10} user={eachUser} popperPlacement={POPPER_PLACEMENTS.AUTO} />
        ))
        : null;
      const teams = content.teams
        ? content.teams.map((eachTeam) => (
          <Link
            className={gClasses.MR10}
            title={`${eachTeam.team_name}(Team)`}
          >
            {eachTeam.team_name}
          </Link>
        ))
        : null;
      value = (
        <>
          {users}
          {teams}
        </>
      );
    } else if (isArray(content)) {
      value = join(content, COMMA + SPACE);
    } else if (typeof content === 'boolean') {
      value = content
        ? FORM_STRINGS.YES_NO.option_list[0].label
        : FORM_STRINGS.YES_NO.option_list[1].label;
    } else if (content && jsUtils.has(content, 'currency_type')) {
      if (content.value === null) value = null;
      else value = `${content.value} ${content.currency_type}`;
    } else if (content && fieldType === FIELD_TYPES.PHONE_NUMBER) {
      if (
        jsUtils.has(content, 'phone_number') &&
        jsUtils.has(content, 'country_code')
      ) { value = `${content.country_code} ${content.phone_number}`; } else value = null;
    } else {
      value = content;
    }

    if (
      hasOwn(stateData, 'active_task_details') &&
      !jsUtils.isEmpty(stateData.active_task_details) &&
      hasOwn(stateData.active_task_details, 'document_url_details') &&
      !jsUtils.isEmpty(stateData.active_task_details.document_url_details) &&
      !jsUtils.isEmpty(value)
    ) {
      const getDocumentDetails =
        stateData.active_task_details.document_url_details.filter(
          (docData) => docData.document_id === value,
        );
      if (
        !jsUtils.isEmpty(getDocumentDetails) &&
        isArray(getDocumentDetails) &&
        getDocumentDetails.length > 0
      ) {
        if (
          !jsUtils.isEmpty(getDocumentDetails[0]) &&
          hasOwn(getDocumentDetails[0], 'original_filename') &&
          !jsUtils.isEmpty(getDocumentDetails[0].original_filename)
        ) {
          const originalFileName = getDocumentDetails[0].original_filename;
          if (
            !jsUtils.isEmpty(originalFileName) &&
            hasOwn(originalFileName, 'filename')
          ) {
            value = originalFileName.filename;
            if (
              hasOwn(getDocumentDetails[0], 'signedurl') &&
              !jsUtils.isEmpty(getDocumentDetails[0].signedurl)
            ) {
              link = getDocumentDetails[0].signedurl;
            }
          }
        }
      }
    }
    return {
      value: value,
      link: link,
      content: content,
      fieldType: fieldType,
    };
  };

  const getReadOnlyTextComponent = (hideLabel = false, defaultValue = isAuditView ? '-' : null) => {
    const { value, link, content, fieldType } = getReadOnlyFieldData();
    let valueText;
    if (value || value === 0) {
      valueText = value;
    } else {
      valueText = defaultValue;
    }
    console.log('content check', content, field_data, valueText);
    // if  field_data.field_type is a property picker, then fieldType refers to Reference field type of the property picker.
    if (
      field_data.field_type === FIELD_TYPES.FILE_UPLOAD ||
      (PROPERTY_PICKER_ARRAY.includes(field_data.field_type) && fieldType === FIELD_TYPES.FILE_UPLOAD)
    ) {
      return (
        <ReadOnlyFileUpload
          className={cx(
            !isTable && gClasses.MB5,
            index === 0 && gClasses.MT5,
            styles.readOnly,
          )}
          label={fieldName}
          id={field_data.field_uuid}
          hideLabel={isTable || hideLabel}
          formFieldBottomMargin
          fileDetail={
            !isEmpty(content) && fieldType === FIELD_TYPES.FILE_UPLOAD
              ? content
              : []
          }
          fieldType={field_data.field_type}
          fieldUuid={field_data.field_uuid}
          isAuditView={isAuditView}
          dataListAuditfields={dataListAuditfields}
          auditedTabelRows={auditedTabelRows}
          tabelfieldEditedList={tabelfieldEditedList}
          fieldData={field_data}
          activeFormContent={activeFormContent}
          isTable={isTable}
          tableRow={tableRow}
          formType={formType}
          value={valueText}
        />
      );
    }

    return (
      <ReadOnlyText
        className={cx(
          !isTable && gClasses.MB15,
          index === 0 && gClasses.MT5,
          styles.readOnly,
        )}
        label={fieldName}
        id={isTable ? null : field_data.field_uuid}
        allowedDecimalPoints={fieldType === FIELD_TYPES.NUMBER && field_data?.validations?.allowed_decimal_points}
        value={valueText}
        hideLabel={isTable || hideLabel}
        hideMessage
        formFieldBottomMargin
        link={link}
        fileDetail={
          !isEmpty(content) && fieldType === FIELD_TYPES.FILE_UPLOAD
            ? content.file
            : null
        }
        textClassName={
          fieldType === FIELD_TYPES.PARAGRAPH
            ? cx(styles.ReadOnlyTextParagraphClass, gClasses.ScrollBar, gClasses.WhiteSpacePreWrap)
            : null
        }
        fieldType={fieldType}
        fieldUuid={field_data.field_uuid}
        isAuditView={isAuditView}
        dataListAuditfields={dataListAuditfields}
        auditedTabelRows={auditedTabelRows}
        tabelfieldEditedList={tabelfieldEditedList}
        fieldData={field_data}
        activeFormContent={activeFormContent}
        isTable={isTable}
        tableRow={tableRow}
      />
    );
  };

  const constructValue = (value, prevnum, is_digit_formatted, accountLocale) => {
    if (!is_digit_formatted) {
      return value;
    }
    if (!isNull(value) && !jsUtils.isUndefined(value)) {
      value = value.toString();
      if (validateLocale(accountLocale)) {
        if (value.charAt(value.length - 1) === '.') {
          if (prevnum && prevnum.length <= value.length) {
            value = `${formatter(value.replace('.', ''), accountLocale)}.`;
          } else {
            value = formatter(value.replace('.', ''), accountLocale);
          }
        }
      } else {
        if (value.charAt(value.length - 1) === '.') {
          if (prevnum && prevnum.length <= value.length) {
            value = `${formatter(value.replace('.', ''), accountLocale)},`;
          } else {
            value = formatter(value.replace('.', ''), accountLocale);
          }
        }
      }
      return value;
    }
    return null;
  };
  const constructDecimalZeroValue = (value, locale) => {
    let tempValue;
    const numarr = value && value.toString().split('.');
    if (value && value.toString().includes('.')) {
      tempValue = `${formatter(numarr[0], locale)}.${numarr[1]}`;
    } else {
      tempValue = formatter(value, locale);
    }
    return tempValue;
  };
  let inputComponent = null;
  if (isCompletedForm) {
    if (formVisible) {
      inputComponent =
        jsUtils.get(formVisible, [field_data.field_uuid]) ||
          !field_data.is_visible
          ? getReadOnlyTextComponent()
          : null;
    } else {
      inputComponent = getReadOnlyTextComponent();
    }
  } else {
    let fieldValue = stateData[field_data.field_uuid];
    let hideMessage = isImportableForm;
    let fieldClassName = '';
    if (isTable) {
      if (stateData.active_task_details) {
        fieldValue = getTableFieldValue();
      }
      hideMessage = isEmpty(fieldErrorMessage) && isEmpty(uniqueColumnError);
    } else {
      if (isCreationField) fieldClassName = cx(gClasses.M15, gClasses.MT12);
      else if (isEditableField) fieldClassName = cx(gClasses.MT12, gClasses.MB15);
    }
    const formId = jsUtils.get(stateData, ['active_task_details', 'form_metadata', 'form_id'], null);
    const readOnlyScanner = (rowId && !allow_modify_existing) ||
      field_data.read_only ||
      !fieldVisibility ||
      (field_data.is_system_defined &&
        field_data.is_edit_add_only &&
        !jsUtils.isUndefined(
          stateData.active_task_details.entry_user_id,
        ));
    const table_row_id = temp_row_uuid || rowId || '';
    switch (field_data.field_type) {
      case FIELD_TYPES.SINGLE_LINE:
        inputComponent = (
          <>
            <Input
              label={fieldName}
              readOnly={(rowId && !allow_modify_existing) ||
                field_data.read_only ||
                !fieldVisibility ||
                (field_data.is_system_defined &&
                  field_data.is_edit_add_only &&
                  !jsUtils.isUndefined(
                    stateData.active_task_details.entry_user_id,
                  ))
              }
              id={(field_data.read_only) ? (field_data.field_uuid
                ? `singleline${field_data.field_uuid}${table_row_id}` : `singleline${sectionId}${fieldPostion}`) :
                (
                  field_data.field_uuid
                    ? field_data.field_uuid
                    : `singleline${sectionId}${fieldPostion}`)
              }
              onChangeHandler={(event) => {
                onChangeHandler(
                  event.target.id,
                  event.target.value,
                  field_data.field_type,
                  sectionIndex,
                  fieldListIndex,
                  fieldIndex,
                  tableRow,
                );
              }}
              value={fieldValue}
              errorMessage={fieldErrorMessage || uniqueColumnError}
              placeholder={fieldPlaceholder}
              hideMessage={hideMessage || isEmpty(fieldErrorMessage)}
              isRequired={!field_data.read_only && field_data.required}
              hideLabel={isImportableForm ? false : isTable}
              // disabled={!(isEditableField || isTable)}
              disabled={!isEditableField || (isCreationField && isTable)}
              helperTooltipMessage={fieldHelpText}
              helperToolTipId={`form_field_tooltip-${sectionIndex}-${fieldListIndex}-${fieldIndex}`}
              instructionMessage={
                fieldInstruction && parse(fieldInstruction)
              }
              instructionClass={isCreationField && styles.CreateFormInstruction}
              editIcon={editIcon}
              deleteIcon={deleteIcon}
              inputContainerClasses={cx(styles.FormFieldInput)}
              fieldTypeInstruction={editIcon && fieldTypeInstruction}
              referenceName={field_data.reference_name}
              className={fieldClassName}
              isTable={isTable}
            />
            {(field_data.read_only && (!(isCreationField)) && fieldValue) && (
              <Tooltip
                id={(field_data.field_uuid
                  ? `singleline${field_data.field_uuid}${table_row_id}` : `singleline${sectionId}${fieldPostion}`)
                }
                content={fieldValue}
                customInnerClasss={styles.CustomInnerClasss}
              />
            )}
          </>
        );
        break;
      case FIELD_TYPES.SCANNER:
        inputComponent = (
          <>
            {fieldVisibility && isScannerOpen &&
              <BarCodeScanner
                onChangeHandler={(id, value) => {
                  onChangeHandler(
                    id,
                    value,
                    field_data.field_type,
                    sectionIndex,
                    fieldListIndex,
                    fieldIndex,
                    tableRow,
                  );
                }}
                setIsScannerOpen={setIsScannerOpen}
                id={(field_data.read_only) ? (field_data.field_uuid
                  ? `scanner${field_data.field_uuid}` : `scanner${sectionId}${fieldPostion}`) :
                  (
                    field_data.field_uuid
                      ? field_data.field_uuid
                      : `scanner${sectionId}${fieldPostion}`)
                }
              />}
            <div className={BS.P_RELATIVE}>
              <Input
                label={fieldName}
                readOnly={readOnlyScanner}
                id={(field_data.read_only) ? (field_data.field_uuid
                  ? `scanner${field_data.field_uuid}` : `scanner${sectionId}${fieldPostion}`) :
                  (
                    field_data.field_uuid
                      ? field_data.field_uuid
                      : `scanner${sectionId}${fieldPostion}`)
                }
                onChangeHandler={(event) => {
                  onChangeHandler(
                    event.target.id,
                    event.target.value,
                    field_data.field_type,
                    sectionIndex,
                    fieldListIndex,
                    fieldIndex,
                    tableRow,
                  );
                }}
                value={fieldValue}
                errorMessage={fieldErrorMessage || uniqueColumnError}
                placeholder={fieldPlaceholder}
                hideMessage={hideMessage || isEmpty(fieldErrorMessage)}
                isRequired={!field_data.read_only && field_data.required}
                hideLabel={isImportableForm ? false : isTable}
                isTable={isTable}
                disabled={!(isEditableField || isTable)}
                helperTooltipMessage={fieldHelpText}
                helperToolTipId={`form_field_tooltip-${sectionIndex}-${fieldListIndex}-${fieldIndex}`}
                instructionMessage={
                  fieldInstruction && parse(fieldInstruction)
                }
                editIcon={editIcon}
                deleteIcon={deleteIcon}
                inputContainerClasses={cx(styles.FormFieldInput)}
                fieldTypeInstruction={editIcon && fieldTypeInstruction}
                referenceName={field_data.reference_name}
                className={fieldClassName}
                scannerIconPadding={gClasses.PR32}
              />
              {fieldVisibility &&
                <ScannerIcon
                  className={cx(styles.Scanner, !readOnlyScanner ? gClasses.CursorPointer : null, fieldErrorMessage && gClasses.Bottom24)}
                  onClick={!readOnlyScanner ? handleScannerOpen : null}
                  onKeyDown={!readOnlyScanner ? (e) => keydownOrKeypessEnterHandle(e) && handleScannerOpen() : null}
                  tabIndex={readOnlyScanner ? -1 : 0}
                  role={ARIA_ROLES.BUTTON}
                  title="Scanner"
                />
              }
            </div>
          </>
        );
        break;
      case FIELD_TYPES.EMAIL:
        inputComponent = (
          <Input
            label={fieldName}
            className={fieldClassName}
            innerClassName={!isTable ? gClasses.ML15 : null}
            readOnly={(rowId && !allow_modify_existing) ||
              field_data.read_only ||
              !fieldVisibility ||
              (field_data.is_system_defined &&
                field_data.is_edit_add_only &&
                !jsUtils.isUndefined(
                  stateData.active_task_details.entry_user_id,
                ))
            }
            id={
              field_data.field_uuid
                ? field_data.field_uuid
                : `${FIELD_TYPES.EMAIL}${sectionId}${fieldPostion}`
            }
            onChangeHandler={(event) => {
              onChangeHandler(
                event.target.id,
                event.target.value,
                field_data.field_type,
                sectionIndex,
                fieldListIndex,
                fieldIndex,
                tableRow,
              );
            }}
            value={fieldValue}
            errorMessage={fieldErrorMessage || uniqueColumnError}
            placeholder={fieldPlaceholder}
            hideMessage={hideMessage || isEmpty(fieldErrorMessage)}
            isRequired={!field_data.read_only && field_data.required}
            hideLabel={isImportableForm ? false : isTable}
            disabled={!isEditableField || (isCreationField && isTable)}
            helperTooltipMessage={fieldHelpText}
            helperToolTipId={`form_field_tooltip-${sectionIndex}-${fieldListIndex}-${fieldIndex}`}
            instructionMessage={
              fieldInstruction && parse(fieldInstruction)
            }
            instructionClass={isCreationField && styles.CreateFormInstruction}
            editIcon={editIcon}
            deleteIcon={deleteIcon}
            inputContainerClasses={cx(styles.FormFieldInput)}
            fieldTypeInstruction={editIcon && fieldTypeInstruction}
            referenceName={field_data.reference_name}
            isTable={isTable}
          />
        );
        break;
      case FIELD_TYPES.NUMBER:
        inputComponent = (
          <Input
            label={fieldName}
            readOnly={(rowId && !allow_modify_existing) ||
              field_data.read_only ||
              !fieldVisibility ||
              (field_data.is_system_defined &&
                field_data.is_edit_add_only &&
                !jsUtils.isUndefined(
                  stateData.active_task_details.entry_user_id,
                ))
            }
            id={
              field_data.field_uuid
                ? field_data.field_uuid
                : `number${sectionId}${fieldPostion}`
            }
            onChangeHandler={(event) => {
              let { value } = event.target;
              // if (eachKeyStroke === '-' && event.target.selectionStart === 1 && !prevNumber.includes('-')) {
              if (value.replace(/[^0-9]/g, '').length <= 15 || eachKeyStroke === 'Backspace' || eachKeyStroke === 'Delete') {
                if (field_data.is_digit_formatted) {
                  value = formatEngine(value, event, prevNumber, eachKeyStroke, accountLocale, (val) => { setPrevCount(val); }, (val) => { setPrevNumber(val); }, (val) => { setPrevNum(val); }, field_data, prevCount, fieldValue);
                }
                setPrevNum(fieldValue);
                onChangeHandler(
                  event.target.id,
                  value,
                  field_data.field_type,
                  sectionIndex,
                  fieldListIndex,
                  fieldIndex,
                  tableRow,
                );
              }
            }
            }
            value={(
              (fieldVisibility || has(formVisibility, ['visible_disable_fields', field_data.field_uuid])) &&
              accountLocale &&
              accountLocale !== EMPTY_STRING &&
              fieldValue &&
              fieldValue.toString() &&
              fieldValue.toString() !== EMPTY_STRING &&
              field_data.is_digit_formatted &&
              fieldValue.toString().length > 1 &&
              fieldValue.toString().charAt(fieldValue.toString().length - 1) !== '.')
              ? constructDecimalZeroValue(fieldValue, accountLocale)
              : constructValue(fieldValue, prevNum, field_data.is_digit_formatted, accountLocale)
            }
            errorMessage={fieldErrorMessage || uniqueColumnError}
            placeholder={fieldPlaceholder}
            hideMessage={hideMessage || isEmpty(fieldErrorMessage)}
            isRequired={!field_data.read_only && field_data.required}
            hideLabel={isImportableForm ? false : isTable}
            disabled={!isEditableField || (isCreationField && isTable)}
            helperTooltipMessage={fieldHelpText}
            helperToolTipId={`form_field_tooltip-${sectionIndex}-${fieldListIndex}-${fieldIndex}`}
            instructionMessage={
              fieldInstruction && parse(fieldInstruction)
            }
            instructionClass={isCreationField && styles.CreateFormInstruction}
            editIcon={editIcon}
            deleteIcon={deleteIcon}
            inputContainerClasses={cx(styles.FormFieldInput)}
            className={fieldClassName}
            fieldTypeInstruction={editIcon && fieldTypeInstruction}
            referenceName={field_data.reference_name}
            isTable={isTable}
          // isCreationField={isCreationField}
          />
        );
        break;
      case FIELD_TYPES.DROPDOWN: {
        let optionList = null;
        if (field_data.values && !jsUtils.isEmpty(field_data.values)) {
          if (isEditableField) { optionList = getDropdownDataEditable(field_data.values); } else optionList = getDropdownData(field_data.values);
        }
        inputComponent = (
          <Dropdown
            // style={{ width: '148px', height: '30px' }}
            // innerClassName={!isTable ? gClasses.ML10 : null}
            label={fieldName}
            optionList={optionList}
            id={
              field_data.field_uuid
                ? field_data.field_uuid
                : `dropdown${sectionId}${fieldPostion}`
            }
            onChange={(event) =>
              onChangeHandler(
                event.target.id,
                event.target.value,
                field_data.field_type,
                sectionIndex,
                fieldListIndex,
                fieldIndex,
                tableRow,
              )
            }
            displayDeactivatedValue={(parentModuleType === FORM_PARENT_MODULE_TYPES.ADD_DATA_LIST_ENTRY) && isEditableField}
            selectedValue={fieldValue}
            errorMessage={fieldErrorMessage || uniqueColumnError}
            placeholder={fieldPlaceholder}
            hideMessage={hideMessage || isEmpty(fieldErrorMessage)}
            disabled={(rowId && !allow_modify_existing) ||
              field_data.read_only ||
              !fieldVisibility ||
              (field_data.is_system_defined &&
                field_data.is_edit_add_only &&
                !jsUtils.isUndefined(
                  stateData.active_task_details.entry_user_id,
                ))
            }
            isRequired={!field_data.read_only && field_data.required}
            hideLabel={isImportableForm ? false : isTable}
            disablePopper
            isTable={isTable}
            helperTooltipMessage={fieldHelpText}
            helperToolTipId={`form_field_tooltip-${sectionIndex}-${fieldListIndex}-${fieldIndex}`}
            // enableSearch
            instructionMessage={
              fieldInstruction && parse(fieldInstruction)
            }
            instructionClass={isCreationField && styles.CreateFormInstruction}
            onlyAllowDropdownValueChange={
              field_data.is_allow_value_update &&
              formType === FORM_TYPES.CREATION_FORM
            }
            editIcon={editIcon}
            deleteIcon={deleteIcon}
            inputContainerClasses={cx(styles.FormFieldInput, isCreationField && !isTable ? gClasses.ML15 : null)}
            fieldTypeInstruction={editIcon && fieldTypeInstruction}
            referenceName={field_data.reference_name}
            className={fieldClassName}
            isCreationField={isCreationField}
            showReset={!field_data.required && !isCreationField}
          />
        );
        break;
      }
      case FIELD_TYPES.CUSTOM_LOOKUP_DROPDOWN: {
        let optionList = null;
        let placeholder = null;
        if (!isEmpty(fieldPlaceholder)) placeholder = fieldPlaceholder;
        else placeholder = !isEmpty(field_data.selected_lookup_field) ? field_data.selected_lookup_field : fieldPlaceholder;
        if (field_data.values && !jsUtils.isEmpty(field_data.values)) {
          if (isEditableField) { optionList = getDropdownDataEditable(field_data.values); } else optionList = getDropdownData(field_data.values);
        }
        inputComponent = (
          <Dropdown
            label={fieldName}
            optionList={optionList}
            id={
              field_data.field_uuid
                ? field_data.field_uuid
                : `dropdown${sectionId}${fieldPostion}`
            }
            onChange={(event) =>
              onChangeHandler(
                event.target.id,
                event.target.value,
                field_data.field_type,
                sectionIndex,
                fieldListIndex,
                fieldIndex,
                tableRow,
              )
            }
            selectedValue={fieldValue}
            errorMessage={fieldErrorMessage || uniqueColumnError}
            placeholder={placeholder}
            hideMessage={hideMessage || isEmpty(fieldErrorMessage)}
            disabled={(rowId && !allow_modify_existing) ||
              field_data.read_only ||
              !fieldVisibility ||
              (field_data.is_system_defined &&
                field_data.is_edit_add_only &&
                !jsUtils.isUndefined(
                  stateData.active_task_details.entry_user_id,
                ))
            }
            isRequired={!field_data.read_only && field_data.required}
            hideLabel={isImportableForm ? false : isTable}
            disablePopper
            isTable={isTable}
            helperTooltipMessage={fieldHelpText}
            helperToolTipId={`form_field_tooltip-${sectionIndex}-${fieldListIndex}-${fieldIndex}`}
            // enableSearch
            instructionMessage={
              fieldInstruction && parse(fieldInstruction)
            }
            instructionClass={isCreationField && styles.CreateFormInstruction}
            editIcon={editIcon}
            deleteIcon={deleteIcon}
            inputContainerClasses={styles.FormFieldInput}
            fieldTypeInstruction={editIcon && fieldTypeInstruction}
            referenceName={field_data.reference_name}
            className={fieldClassName}
            isCreationField={isCreationField}
            showReset={!field_data.required && !isCreationField}
          />
        );
        break;
      }
      case FIELD_TYPES.RADIO_GROUP: {
        let optionList = null;
        if (field_data.values && !jsUtils.isEmpty(field_data.values)) {
          if (isEditableField) { optionList = getDropdownDataEditable(field_data.values); } else optionList = getDropdownData(field_data.values);
        } else optionList = FORM_STRINGS.DROP_DOWN.option_list;
        const option_list = [];
        if (!isEmpty(optionList)) {
          optionList.forEach((item) => {
            const data = {
              label: typeof item === 'object' ? null : item,
              value: typeof item === 'object' ? null : item,
            };
            typeof item === 'object' ? null : option_list.push(data);
          });
        }
        inputComponent = (
          <RadioGroup
            type={RADIO_GROUP_TYPE.TYPE_1}
            // innerClassName={isCreationField ? gClasses.ML15 : null}
            className={fieldClassName}
            id={
              field_data.field_uuid
                ? field_data.field_uuid
                : `radioGroup${sectionId}${fieldPostion}`
            }
            label={fieldName}
            optionList={isEmpty(option_list) ? optionList : option_list}
            displayDeactivatedValue={(parentModuleType === FORM_PARENT_MODULE_TYPES.ADD_DATA_LIST_ENTRY) && isEditableField}
            onClick={(value) =>
              onChangeHandler(
                field_data.field_uuid,
                value,
                field_data.field_type,
                sectionIndex,
                fieldListIndex,
                fieldIndex,
                tableRow,
              )
            }
            selectedValue={fieldValue}
            errorMessage={fieldErrorMessage || uniqueColumnError}
            hideMessage={hideMessage || isEmpty(fieldErrorMessage)}
            readOnly={(rowId && !allow_modify_existing) ||
              field_data.read_only ||
              !fieldVisibility ||
              (field_data.is_system_defined &&
                field_data.is_edit_add_only &&
                !jsUtils.isUndefined(
                  stateData.active_task_details.entry_user_id,
                ))
            }
            isRequired={!field_data.read_only && field_data.required}
            innerClassName={cx(styles.CheckboxAlignment, BS.D_FLEX)}
            hideLabel={isImportableForm ? false : isTable}
            helperTooltipMessage={fieldHelpText}
            helperToolTipId={`form_field_tooltip-${sectionIndex}-${fieldListIndex}-${fieldIndex}`}
            instructionMessage={
              fieldInstruction && parse(fieldInstruction)
            }
            instructionClass={isCreationField && styles.CreateFormInstruction}
            showNoDataFoundOption
            radioViewClassName={gClasses.OverflowHidden}
            radioViewLabelClassName={cx(gClasses.Flex1)}
            editIcon={editIcon}
            deleteIcon={deleteIcon}
            inputContainerClasses={cx(styles.FormFieldInput, isCreationField && !isTable ? gClasses.ML15 : null)}
            radioButtonClasses={styles.FormFieldRadio}
            radioSelectedStyle={styles.RadioSelectedStyle}
            fieldTypeInstruction={editIcon && fieldTypeInstruction}
            referenceName={field_data.reference_name}
            isGridViewClass
            isTable={isTable}
          />
        );
        break;
      }
      case FIELD_TYPES.YES_NO:
        inputComponent = (
          <RadioGroup
            id={
              field_data.field_uuid
                ? field_data.field_uuid
                : `radio${sectionId}${fieldPostion}`
            }
            label={fieldName}
            optionList={FORM_STRINGS.YES_NO.option_list}
            // innerClassName={isCreationField ? gClasses.ML1 }
            className={fieldClassName}
            onClick={(value) =>
              onChangeHandler(
                field_data.field_uuid,
                value,
                field_data.field_type,
                sectionIndex,
                fieldListIndex,
                fieldIndex,
                tableRow,
              )
            }
            selectedValue={fieldValue}
            errorMessage={fieldErrorMessage || uniqueColumnError}
            hideMessage={hideMessage || isEmpty(fieldErrorMessage)}
            readOnly={(rowId && !allow_modify_existing) ||
              field_data.read_only ||
              !fieldVisibility ||
              (field_data.is_system_defined &&
                field_data.is_edit_add_only &&
                !jsUtils.isUndefined(
                  stateData.active_task_details.entry_user_id,
                ))
            }
            isRequired={!field_data.read_only && field_data.required}
            hideLabel={isImportableForm ? false : isTable}
            helperTooltipMessage={fieldHelpText}
            helperToolTipId={`form_field_tooltip-${sectionIndex}-${fieldListIndex}-${fieldIndex}`}
            instructionMessage={
              fieldInstruction && parse(fieldInstruction)
            }
            instructionClass={isCreationField && styles.CreateFormInstruction}
            editIcon={editIcon}
            deleteIcon={deleteIcon}
            inputContainerClasses={cx(styles.FormFieldInput, fieldClassName)}
            fieldTypeInstruction={editIcon && fieldTypeInstruction}
            referenceName={field_data.reference_name}
            labelClass={cx(gClasses.MB5)}
            isGridViewClass
            isTable={isTable}
          />
        );
        break;
      case FIELD_TYPES.DATETIME:
      case FIELD_TYPES.DATE: {
        const { validations = {} } = field_data;
        const {
          allow_working_day = false,
        } = validations;
        const value = fieldValue;
        let isLastColumn = false;
        if (isTable && fieldList && fieldList.fields && field_data) {
          if (fieldList.fields.length === field_data.column_order) isLastColumn = true;
        }
        // const userProfileData = getUserProfileData();

        // if (field_data.field_type === FIELD_TYPES.DATETIME && value && userProfileData.pref_utc_offsetStr) {
        //   // value = moment.parseZone(value).utcOffset(userProfileData.pref_utc_offsetStr).format();
        // }
        const readOnlyDateField = (rowId && !allow_modify_existing) || field_data.read_only ||
          !fieldVisibility ||
          (field_data.is_system_defined &&
            field_data.is_edit_add_only &&
            !jsUtils.isUndefined(
              stateData.active_task_details.entry_user_id,
            ));
        inputComponent = (
          <DatePicker
            id={
              field_data.field_uuid
                ? field_data.field_uuid
                : `date${sectionId}${fieldPostion}`
            }
            className={fieldClassName}
            // innerClassName={isCreationField ? gClasses.ML5 : null}
            label={fieldName}
            getDate={(value, isInitialRendor) =>
              onChangeHandler(
                field_data.field_uuid,
                value,
                field_data.field_type,
                sectionIndex,
                fieldListIndex,
                fieldIndex,
                tableRow,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                isInitialRendor,
              )
            }
            disabled={!fieldVisibility}
            date={value}
            errorMessage={fieldErrorMessage || uniqueColumnError}
            workingDaysOnly={allow_working_day}
            workingDays={working_days}
            hideMessage={hideMessage || isEmpty(fieldErrorMessage)}
            placeholder={fieldPlaceholder}
            readOnly={readOnlyDateField}
            isRequired={!field_data.read_only && field_data.required}
            hideLabel={isImportableForm ? false : isTable}
            fixedStrategy={isTable}
            isTable={isTable}
            helperTooltipMessage={fieldHelpText}
            helperToolTipId={`form_field_tooltip-${sectionIndex}-${fieldListIndex}-${fieldIndex}`}
            instructionMessage={
              fieldInstruction && parse(fieldInstruction)
            }
            instructionClass={isCreationField && styles.CreateFormInstruction}
            enableTime={field_data.field_type === FIELD_TYPES.DATETIME}
            fieldType={field_data.field_type}
            validations={validations}
            editIcon={editIcon}
            deleteIcon={deleteIcon}
            inputContainerClasses={cx(styles.FormFieldInput, isCreationField && !isTable ? gClasses.ML15 : null)}
            fieldTypeInstruction={editIcon && fieldTypeInstruction}
            referenceName={field_data.reference_name}
            disableClass={styles.DisabledIcon}
            isLastColumn={isLastColumn}
            isFirstTableField={isFirstTableField}
          />
        );
        break;
      }
      case FIELD_TYPES.PARAGRAPH:
        inputComponent = (
          <TextArea
            className={fieldClassName}
            innerClass={cx(styles.TextArea)}
            id={
              field_data.field_uuid
                ? field_data.field_uuid
                : `${field_data.field_type}${sectionId}${fieldPostion}`
            }
            label={fieldName}
            onChangeHandler={(event) =>
              onChangeHandler(
                event.target.id,
                event.target.value,
                field_data.field_type,
                sectionIndex,
                fieldListIndex,
                fieldIndex,
                tableRow,
              )
            }
            value={fieldValue}
            errorMessage={fieldErrorMessage || uniqueColumnError}
            hideMessage={hideMessage || isEmpty(fieldErrorMessage)}
            placeholder={fieldPlaceholder}
            readOnly={(rowId && !allow_modify_existing) ||
              field_data.read_only ||
              !fieldVisibility ||
              (field_data.is_system_defined &&
                field_data.is_edit_add_only &&
                !jsUtils.isUndefined(
                  stateData.active_task_details.entry_user_id,
                ))
            }
            isRequired={!field_data.read_only && field_data.required}
            hideLabel={isImportableForm ? false : isTable}
            disabled={!isEditableField || (isCreationField && isTable)}
            helperTooltipMessage={fieldHelpText}
            helperToolTipId={`form_field_tooltip-${sectionIndex}-${fieldListIndex}-${fieldIndex}`}
            instructionMessage={
              fieldInstruction && parse(fieldInstruction)
            }
            instructionClass={isCreationField && styles.CreateFormInstruction}
            editIcon={editIcon}
            deleteIcon={deleteIcon}
            fieldTypeInstruction={editIcon && fieldTypeInstruction}
            retainInputHeight
            referenceName={field_data.reference_name}
            isCreationField={isCreationField}
            isTable={isTable}
          />
        );
        break;
      case FIELD_TYPES.INFORMATION:
        inputComponent =
          fieldVisibility ||
            formType === FORM_TYPES.CREATION_FORM ||
            formType === FORM_TYPES.IMPORTABLE_FORM ||
            (formType === FORM_TYPES.EDITABLE_FORM && isReadOnlyForm) ? (
            <div className={cx((isCreationField && isTable) ? null : gClasses.M15, gClasses.MT12)}>
              {!isTable ? (
                <>
                  {((editIcon && fieldTypeInstruction) || editIcon || deleteIcon) ? (
                    <div ui-auto={field_data.reference_name} className={cx(BS.D_FLEX, BS.JC_END, gClasses.CenterV)}>
                      {fieldTypeInstruction}
                    </div>
                  ) : null}
                  {/* <div className={(isCreationField ? gClasses.ML10 : null)}>
                    <Label
                      content={field_data.field_name}
                      labelClass={gClasses.FTwo12BlackV13}
                      formFieldBottomMargin
                    />
                  </div> */}
                </>
              ) :
                null}
              <div ui-auto={field_data.reference_name} className={fieldClassName}>
                <span className={cx(styles.InfoSpan, gClasses.WordBreakBreakWord, gClasses.FTwo13GrayV3)}>
                  {fieldValue ? parse(fieldValue) : (field_data.default_value && parse(field_data.default_value))}
                </span>
              </div>
            </div>
          ) : null;
        break;
      case FIELD_TYPES.CHECKBOX: {
        let optionList = null;
        if (field_data.values && !jsUtils.isEmpty(field_data.values)) {
          if (isEditableField) {
            optionList = getCheckboxEditable(field_data.values);
          } else {
            optionList = getDropdownData(field_data.values);
          }
          !isEmpty(optionList) && optionList.unshift({ label: CHECKBOX_SELECT_ALL.LABEL, value: CHECKBOX_SELECT_ALL.VALUE });
        } else optionList = FORM_STRINGS.CHECKBOX.option_list;
        const option_list = [];
        if (!isEmpty(optionList)) {
          optionList.forEach((item) => {
            const data = {
              label: typeof item === 'object' ? null : item,
              value: typeof item === 'object' ? null : item,
            };
            typeof item === 'object' ? null : option_list.push(data);
          });
        }
        if (!isEmpty(optionList) && optionList?.length === ((fieldValue || []).length + 1)) {
          fieldValue.unshift(CHECKBOX_SELECT_ALL.VALUE);
        }
        inputComponent = (
          <CheckboxGroup
            id={
              field_data.field_uuid
                ? field_data.field_uuid
                : `checkbox${sectionId}${fieldPostion}`
            }
            label={fieldName}
            optionList={isEmpty(option_list) ? optionList : option_list}
            onClick={(value) =>
              onCheckboxChangeHandler(
                fieldValue,
                field_data.field_uuid,
                value,
                field_data.field_type,
                isEmpty(option_list) ? optionList : option_list,
              )
            }
            displayDeactivatedValue={(parentModuleType === FORM_PARENT_MODULE_TYPES.ADD_DATA_LIST_ENTRY) && isEditableField}
            multipleValuesClicked={(valuesList) => {
              onCheckboxMultipleValuesChangeHandler(
                fieldValue,
                field_data.field_uuid,
                valuesList,
                field_data.field_type,
                tableRow,
              );
            }}
            selectedValues={fieldValue}
            errorMessage={fieldErrorMessage || uniqueColumnError}
            hideMessage={hideMessage || isEmpty(fieldErrorMessage)}
            hideLabel={isImportableForm ? false : isTable}
            readOnly={(rowId && !allow_modify_existing) ||
              field_data.read_only ||
              !fieldVisibility ||
              (field_data.is_system_defined &&
                field_data.is_edit_add_only &&
                !jsUtils.isUndefined(
                  stateData.active_task_details.entry_user_id,
                ))
            }
            required={!field_data.read_only && field_data.required}
            helperTooltipMessage={fieldHelpText}
            helperToolTipId={`form_field_tooltip-${sectionIndex}-${fieldListIndex}-${fieldIndex}`}
            instructionMessage={
              fieldInstruction && parse(fieldInstruction)
            }
            instructionMessageClassName={isCreationField && styles.CreateFormInstruction}
            className={cx(styles.Checkbox, fieldClassName)}
            checkboxViewClassName={cx(gClasses.OverflowHidden, gClasses.MB5)}
            checkboxViewLabelClassName={cx(gClasses.Flex1)}
            editIcon={editIcon}
            deleteIcon={deleteIcon}
            mainLabelClass={gClasses.MB5}
            checkboxClasses={styles.FormFieldCheckbox}
            CorrectIconStyles={styles.CorrectIconStyles}
            // innerClassName={isCreationField ? gClasses.ML15 : null}
            fieldTypeInstruction={editIcon && fieldTypeInstruction}
            referenceName={field_data.reference_name}
            isGridViewClass
            isTable={isTable}
          />
        );
        break;
      }
      case FIELD_TYPES.FILE_UPLOAD: {
        // const { onDeleteFileClick, onRetryFileUploadClick } = props;
        console.log('field_datafield_data', userDetails, field_data);
        const userProfile = userDetails || {};
        let fileUploadProgress = null;
        if (
          stateData &&
          fieldValue &&
          fieldValue.file
          // !field_data.read_only
        ) {
          fileUploadProgress = (
            <FileUploadProgress
              files={[fieldValue]}
              onDeleteClick={!field_data.read_only && onDeleteFileClicked}
              onRetryClick={!field_data.read_only && onRetryFileUploadClicked}
              hideLabel={isTable}
            />
          );
        }
        const allowed_extensions = [];
        if (!jsUtils.isEmpty(field_data.validations) &&
          !jsUtils.isEmpty(field_data.validations.allowed_extensions)) {
          field_data.validations.allowed_extensions.forEach((extension) => {
            if (userProfile.allowed_extensions && userProfile.allowed_extensions.includes(extension)) allowed_extensions.push(extension);
          });
        } else {
          userProfile.allowed_extensions && allowed_extensions.push(...userProfile.allowed_extensions);
        }
        inputComponent = (
          <div
            className={
              jsUtils.isEmpty(fieldErrorMessage) || hideMessage
                ? !isCreationField && gClasses.MB15
                : null
            }
            id={
              (field_data.field_uuid && tableRow)
                ? (field_data.field_uuid + tableRow) : (field_data.field_uuid ? field_data.field_uuid
                  : `fileupload${sectionId}${fieldPostion}`)
            }
          >
            <FileUpload
              userProfile={userProfile}
              isMultiple={field_data && field_data.validations && field_data.validations.is_multiple}
              isTable={isTable}
              onDeleteClick={!field_data.read_only && onDeleteFileClicked}
              onRetryClick={!field_data.read_only && onRetryFileUploadClicked}
              maximum_count={(field_data && field_data.validations && field_data.validations.maximum_count) || 1}
              id={
                (field_data.field_uuid && tableRow)
                  ? (field_data.field_uuid + tableRow) : (field_data.field_uuid ? field_data.field_uuid
                    : `fileupload${sectionId}${fieldPostion}`)
              }
              label={fieldName}
              editIcon={editIcon}
              deleteIcon={deleteIcon}
              labelClass={gClasses.FTwo11GrayV53}
              addFile={(value, filess, currentIndex, totalLength, recursiveFunc, entityId, currentFilesLength, invalidFileType, invalidFileSize, isMultiple, currentFileIndex) => {
                console.log('file field_data.field_uuid', field_data, field_data.field_uuid);
                onChangeHandler(
                  field_data.field_uuid,
                  value,
                  field_data.field_type,
                  sectionIndex,
                  fieldListIndex,
                  fieldIndex,
                  table_row,
                  filess,
                  currentIndex,
                  totalLength,
                  recursiveFunc,
                  entityId,
                  currentFilesLength,
                  invalidFileType,
                  invalidFileSize,
                  isMultiple,
                  currentFileIndex,
                );
              }}
              fileName={fieldValue || []}
              allowed_extensions={allowed_extensions}
              creationView={
                formType === FORM_TYPES.CREATION_FORM ||
                formType === FORM_TYPES.IMPORTABLE_FORM
              }
              maximum_file_size={
                !jsUtils.isEmpty(field_data.validations) &&
                  field_data.validations.maximum_file_size
                  ? Math.min(
                    field_data.validations.maximum_file_size,
                    userProfile.maximum_file_size,
                  )
                  : userProfile.maximum_file_size
              }
              errorMessage={fieldErrorMessage || uniqueColumnError}
              hideMessage={hideMessage || jsUtils.isEmpty(fieldErrorMessage)}
              placeholder={fieldPlaceholder}
              readOnly={(rowId && !allow_modify_existing) ||
                field_data.read_only ||
                // !fieldVisibility ||
                (!jsUtils.isUndefined(field_data.is_system_defined) && field_data.is_system_defined &&
                  !jsUtils.isUndefined(field_data.is_edit_add_only) && field_data.is_edit_add_only &&
                  !jsUtils.isUndefined(
                    stateData.active_task_details.entry_user_id,
                  ))
              }
              disabled={!fieldVisibility}
              isRequired={!field_data.read_only && field_data.required}
              hideLabel={isImportableForm ? false : isTable}
              helperTooltipMessage={fieldHelpText}
              helperToolTipId={`form_field_tooltip-${sectionIndex}-${fieldListIndex}-${fieldIndex}`}
              instructionMessage={
                fieldInstruction && parse(fieldInstruction)
              }
              instructionClassName={cx(isCreationField && styles.CreateFormInstruction, gClasses.FTwo12GrayV4)}
              // innerClassName={isCreationField ? gClasses.ML15 : null}
              className={fieldClassName}
              fieldTypeInstruction={editIcon && fieldTypeInstruction}
              referenceName={field_data.reference_name}
              isCreationField={isCreationField}
            />
            {fileUploadProgress}
          </div>
        );
        break;
      }
      case FIELD_TYPES.CURRENCY: {
        const currencyValue = jsUtils.isEmpty(fieldValue)
          ? EMPTY_STRING
          : jsUtils.isNull(fieldValue.value)
            ? EMPTY_STRING
            : fieldValue.value;
        const currLocale = getLocale(fieldValue && fieldValue.currency_type);
        const userProfile = getUserProfileData();
        let allowedCurrenyTypes = [];
        let defaultCurrencyType = null;
        if (field_data.validations || userProfile.allowed_currency_types) {
          allowedCurrenyTypes = arryToDropdownData(
            field_data.validations.allowed_currency_types ||
            userProfile.allowed_currency_types ||
            [],
          );
        }
        defaultCurrencyType = !jsUtils.has(fieldValue, 'currency_type') ? (
          jsUtils.get(field_data, ['default_value', 'currency_type']) ||
          getCurrencyFromAllowedCurrencyTypes(field_data, default_currency_type) ||
          default_currency_type ||
          DEFAULT_CURRENCY_TYPE
        ) : fieldValue.currency_type;
        inputComponent = (
          <InputDropdown
            id={
              field_data.field_uuid
                ? field_data.field_uuid
                : `currency${sectionId}${fieldPostion}`
            }
            label={fieldName}
            editIcon={editIcon}
            deleteIcon={deleteIcon}
            onChange={(event) => {
              let { value } = event.target;
              if (value.replace(/[^0-9]/g, '').length <= 15 || eachKeyStroke === 'Backspace' || eachKeyStroke === 'Delete') {
                value = formatEngine(value, event, prevNumber, eachKeyStroke, currLocale, (val) => { setPrevCount(val); }, (val) => { setPrevNumber(val); }, (val) => { setPrevNum(val); }, field_data, prevCount, fieldValue, true);
                setPrevNum(fieldValue && fieldValue.value);
                onChangeHandler(
                  event.target.id,
                  {
                    value: value,
                    currency_type: defaultCurrencyType,
                  },
                  field_data.field_type,
                  sectionIndex,
                  fieldListIndex,
                  fieldIndex,
                  tableRow,
                );
              }
            }}
            onDropdownChange={(event) => {
              const tempFormated = formatter(
                currencyValue,
                getLocale(event.target.value),
              );
              const defaultCurrency = currencyValue && currencyValue.toString();
              setPrevCount(tempFormated.replace(/[0-9]/g, '').length);
              onChangeHandler(
                field_data.field_uuid,
                { value: defaultCurrency && defaultCurrency, currency_type: event.target.value },
                field_data.field_type,
                sectionIndex,
                fieldListIndex,
                fieldIndex,
                tableRow,
              );
            }}
            dropdownId={`currencyDropdown${sectionId}${fieldPostion}`}
            optionList={allowedCurrenyTypes}
            value={(
              (fieldVisibility || has(formVisibility, ['visible_disable_fields', field_data.field_uuid])) &&
              currLocale &&
              currLocale !== EMPTY_STRING &&
              fieldValue &&
              fieldValue.value &&
              fieldValue.value.toString() &&
              fieldValue.value.toString() !== EMPTY_STRING &&
              fieldValue.value.toString().length > 1 &&
              fieldValue.value.toString().charAt(fieldValue.value.toString().length - 1) !== '.')
              ? constructDecimalZeroValue(fieldValue.value, currLocale)
              : constructValue(fieldValue && fieldValue.value, prevNum, true, currLocale)}
            strictlySetSelectedValue
            dropdownValue={defaultCurrencyType}
            errorMessage={currencyValueError || uniqueColumnError}
            isTable={isTable}
            dropdownListClasses={isTable ? cx(BS.P_ABSOLUTE) : null}
            hideMessage={hideMessage && isEmpty(currencyValueError)}
            placeholder={fieldPlaceholder}
            disabled={(rowId && !allow_modify_existing) ||
              field_data.read_only ||
              !fieldVisibility ||
              (field_data.is_system_defined &&
                field_data.is_edit_add_only &&
                !jsUtils.isUndefined(
                  stateData.active_task_details.entry_user_id,
                ))
            }
            required={field_data.required}
            hideLabel={isImportableForm ? false : isTable}
            helperTooltipMessage={fieldHelpText}
            helperToolTipId={`form_field_tooltip-${sectionIndex}-${fieldListIndex}-${fieldIndex}`}
            instructionMessage={
              fieldInstruction && parse(fieldInstruction)
            }
            instructionClass={isCreationField && styles.CreateFormInstruction}
            inputContainerClasses={styles.FormFieldInput}
            // innerClassName={isCreationField ? gClasses.ML15 : null}
            className={fieldClassName}
            fieldTypeInstruction={editIcon && fieldTypeInstruction}
            referenceName={field_data.reference_name}
            isCreationField={isCreationField}
          />
        );
        break;
      }
      case FIELD_TYPES.PHONE_NUMBER: {
        const userProfile = userDetails || {};
        const defaultValue = {
          phone_number: jsUtils.isEmpty(fieldValue)
            ? EMPTY_STRING
            : fieldValue.phone_number || EMPTY_STRING,
          country_code: jsUtils.isEmpty(fieldValue)
            ? jsUtils.get(field_data, ['default_value', 'country_code']) ||
            jsUtils.get(userProfile, ['default_country_code'])
            : fieldValue.country_code,
        };
        inputComponent = (
          <MobileNumber
            id={
              field_data.field_uuid
                ? field_data.field_uuid
                : `phonenumber${sectionId}${fieldPostion}`
            }
            label={fieldName}
            editIcon={editIcon}
            deleteIcon={deleteIcon}
            placeholder={fieldPlaceholder}
            mobile_number={defaultValue.phone_number}
            countryCodeId={defaultValue.country_code}
            onChangeHandler={(event) => {
              onChangeHandler(
                event.target.id,
                {
                  phone_number: event.target.value,
                  country_code: defaultValue.country_code,
                },
                field_data.field_type,
                sectionIndex,
                fieldListIndex,
                fieldIndex,
                tableRow,
              );
            }}
            onCountryCodeChange={(event) => {
              onChangeHandler(
                field_data.field_uuid,
                {
                  phone_number: defaultValue.phone_number,
                  country_code: event.target.value,
                },
                field_data.field_type,
                sectionIndex,
                fieldListIndex,
                fieldIndex,
                tableRow,
              );
            }}
            disabled={(rowId && !allow_modify_existing) ||
              field_data.read_only ||
              !fieldVisibility ||
              (field_data.is_system_defined &&
                field_data.is_edit_add_only &&
                !jsUtils.isUndefined(
                  stateData.active_task_details.entry_user_id,
                ))
            }
            isRequired={!field_data.read_only && field_data.required}
            helperTooltipMessage={fieldHelpText}
            helperTooltipId={`form_field_tooltip-${sectionIndex}-${fieldListIndex}-${fieldIndex}`}
            instructionMessage={
              fieldInstruction && parse(fieldInstruction)
            }
            instructionClass={isCreationField && styles.CreateFormInstruction}
            errorMessage={phoneFieldError || uniqueColumnError}
            hideMessage={hideMessage && isEmpty(phoneFieldError)}
            hideLabel={isImportableForm ? false : isTable}
            isTable={isTable}
            // innerClassName={isCreationField ? gClasses.ML15 : null}
            className={fieldClassName}
            fieldTypeInstruction={editIcon && fieldTypeInstruction}
            referenceName={field_data.reference_name}
            isCreationField={isCreationField}
          />
        );
        break;
      }
      case FIELD_TYPES.LINK:
        inputComponent = (
          <LinkField
            label={fieldName}
            editIcon={editIcon}
            isTable={isTable}
            deleteIcon={deleteIcon}
            readOnly={(rowId && !allow_modify_existing) || field_data.read_only === true || !fieldVisibility}
            isImported={field_data.is_imported}
            id={
              field_data.field_uuid
                ? field_data.field_uuid
                : `Link${sectionId}${fieldPostion}`
            }
            onChangeHandler={(value) => {
              onChangeHandler(
                field_data.field_uuid,
                value,
                field_data.field_type,
                sectionIndex,
                fieldListIndex,
                fieldIndex,
                tableRow,
              );
            }}
            fieldVisibility={fieldVisibility}
            links={isEmpty(fieldValue) ? (fieldVisibility && (field_data?.default_value || [])) : fieldValue}
            errorMessage={linkFieldError || uniqueColumnError}
            placeholder={fieldPlaceholder}
            hideMessage={hideMessage || isEmpty(linkFieldError)}
            isRequired={!field_data.read_only && field_data.required}
            hideLabel={isImportableForm ? false : isTable}
            disabled={
              field_data.read_only ||
              !fieldVisibility ||
              (field_data.is_system_defined &&
                field_data.is_edit_add_only &&
                !jsUtils.isUndefined(
                  stateData.active_task_details.entry_user_id,
                ))
            }
            helperTooltipMessage={fieldHelpText}
            helperToolTipId={`text-area-tooltip-${fieldIndex}-${sectionIndex}-${fieldListIndex}`}
            instructionMessage={
              fieldInstruction && parse(fieldInstruction)
            }
            instructionClass={isCreationField && styles.CreateFormInstruction}
            isMultiple={jsUtils.get(field_data, ['validations', 'is_multiple'])}
            creationView={
              formType === FORM_TYPES.CREATION_FORM ||
              formType === FORM_TYPES.IMPORTABLE_FORM
            }
            innerClassName={isCreationField && !isTable ? cx(gClasses.MB10) : null}
            className={fieldClassName}
            fieldTypeInstruction={editIcon && fieldTypeInstruction}
            referenceName={field_data.reference_name}
            isCreationField={isCreationField}
          />
        );
        break;
      case FIELD_TYPES.USER_TEAM_PICKER:
        console.log('userteampicker error check', fieldErrorMessage);
        inputComponent = (
          <AddMembers
            id={
              field_data.field_uuid ||
              `userteampicker${sectionId}${fieldPostion}`
            }
            label={fieldName}
            editIcon={editIcon}
            deleteIcon={deleteIcon}
            placeholder={fieldPlaceholder}
            readOnly={(rowId && !allow_modify_existing) ||
              field_data.read_only ||
              !fieldVisibility ||
              (field_data.is_system_defined &&
                field_data.is_edit_add_only &&
                !jsUtils.isUndefined(
                  stateData.active_task_details.entry_user_id,
                ))
            }
            onUserSelectHandler={(event) => {
              const updatedUserTeamObj = userTeamPickerChangeHandler(
                fieldValue,
                event.target.value,
                USER_TEAM_PICKER_CHANGE_HANDLER_TYPES.USER_TEAM_PICKER_CH_ADD,
              );
              onChangeHandler(
                event.target.id,
                updatedUserTeamObj,
                field_data.field_type,
                sectionIndex,
                fieldListIndex,
                fieldIndex,
                tableRow,
              );
            }}
            removeSelectedUser={(userOrTeamId) => {
              const updatedUserTeamObj = userTeamPickerChangeHandler(
                fieldValue,
                userOrTeamId,
                USER_TEAM_PICKER_CHANGE_HANDLER_TYPES.USER_TEAM_PICKER_CH_REMOVE,
              );
              onChangeHandler(
                field_data.field_uuid,
                updatedUserTeamObj,
                field_data.field_type,
                sectionIndex,
                fieldListIndex,
                fieldIndex,
                tableRow,
              );
            }}
            selectedData={getValidationTabUserTeamPickerSelectedData(fieldValue)}
            errorText={fieldErrorMessage || uniqueColumnError}
            hideErrorMessage={hideMessage || isEmpty(fieldErrorMessage)}
            isRequired={!field_data.read_only && field_data.required}
            hideLabel={isImportableForm ? false : isTable}
            helperToolTipId={`form_field_tooltip-${sectionIndex}-${fieldListIndex}-${fieldIndex}`}
            helperTooltipMessage={fieldHelpText}
            instructionMessage={
              fieldInstruction && parse(fieldInstruction)
            }
            instructionClass={isCreationField && styles.CreateFormInstruction}
            getUserTeamPickerSuggestion
            apiParams={
              formType === FORM_TYPES.EDITABLE_FORM
                ? { field_uuid: field_data.field_uuid, ...getTaskParentId(), form_id: formId }
                : {}
            }
            popperFixedStrategy
            popperClassName={
              parentModuleType === FORM_PARENT_MODULE_TYPES.ADD_DATA_LIST_ENTRY
                ? styles.UserPickerDropdownAddDataList
                : styles.UserPickerDropdown
            }
            // innerClassName={isCreationField ? gClasses.ML5 : null}
            className={fieldClassName}
            fieldTypeInstruction={editIcon && fieldTypeInstruction}
            referenceName={field_data.reference_name}
            allowOnlySingleSelection={!jsUtils.get(field_data, ['validations', 'allow_multiple'], false)}
            disabled={!isEditableField || (isCreationField && isTable)}
          />
        );
        break;
      case FIELD_TYPES.DATA_LIST:
        const paramsValue = getDatalistValidateParamData();
        const {
          filter_fields,
        } = field_data.validations;
        inputComponent = (
          <>
            <AddMembers
              label={fieldName}
              editIcon={editIcon}
              deleteIcon={deleteIcon}
              innerClassName={isTable && !isCreationField && styles.TableDropdownWidth}
              className={fieldClassName}
              hideLabel={isImportableForm ? false : isTable}
              id={
                field_data.field_uuid
                  ? field_data.field_uuid
                  : `dataListField${sectionId}${fieldPostion}`
              }
              onUserSelectHandler={(event) => {
                const { value } = event.target;
                const label = value.display_fields.flatMap((field) =>
                  jsUtils.has(value, [field]) ? [value[field]] : []);
                onChangeHandler(
                  event.target.id,
                  {
                    label: label.join(jsUtils.get(value, 'separator') || '-'),
                    value: value._id,
                  },
                  { fieldType: field_data.field_type },
                  sectionIndex,
                  fieldListIndex,
                  fieldIndex,
                  tableRow,
                );
              }}
              selectedData={fieldValue}
              removeSelectedUser={(id) => {
                onChangeHandler(
                  field_data.field_uuid,
                  { value: id },
                  { fieldType: field_data.field_type, remove: true },
                  sectionIndex,
                  fieldListIndex,
                  fieldIndex,
                  tableRow,
                );
              }}
              readOnly={(rowId && !allow_modify_existing) ||
                field_data.read_only ||
                !fieldVisibility ||
                (field_data.is_system_defined &&
                  field_data.is_edit_add_only &&
                  !jsUtils.isUndefined(
                    stateData.active_task_details.entry_user_id,
                  ))
              }
              setErrorMessage={(errorMessage, error) => {
                const current_server_error = get(error, ['response', 'data', 'errors', 0]);
                if (errorMessage !== dataListErrorMessage) {
                  if (
                    errorMessage ===
                    SERVER_ERROR_CODE_STRINGS[SERVER_ERROR_CODES.UNAUTHORIZED]
                  ) {
                    setDataListErrorMessage('Datalist access denied');
                    showToastPopover(
                      'Unauthorized',
                      'Datalist unaccessible',
                      FORM_POPOVER_STATUS.SERVER_ERROR,
                      true,
                    );
                  } else if (
                    current_server_error?.field === 'data_list_uuid' &&
                    current_server_error?.type === 'not_exist'
                  ) {
                    setDataListErrorInstruction(
                      translate('server_validation_constants.configured_data_list_was_deleted'),
                    );
                    showToastPopover(
                      translate('server_validation_constants.configured_data_list_was_deleted'),
                      EMPTY_STRING,
                      FORM_POPOVER_STATUS.SERVER_ERROR,
                      true,
                    );
                  } else {
                    setDataListErrorMessage('');
                  }
                }
              }}
              errorText={fieldErrorMessage || dataListErrorMessage || uniqueColumnError}
              selectedSuggestionData={fieldValue}
              memberSearchValue={dataListFieldSearch}
              setMemberSearchValue={(event) => {
                if (event.target.value !== dataListFieldSearch) { setDataListFieldSearch(event.target.value); }
              }}
              apiParams={{
                field_id: field_data.field_id,
                form_id: formId,
                task_log_id: field_data?.data_list?.data_list_id,
                ...paramsValue.fieldData,
                entry_id: [...(paramsValue.entryIds || [])],
              }}
              entryIds={paramsValue.entryIds}
              placeholder={fieldPlaceholder}
              apiUrl={GET_ALL_DATA_LIST_ENTRY_DETAILS_BY_FILTER}
              getTagLabel={(data) => data && data.label}
              getTagId={(data) => data && data.value}
              getOption={(option, type) => {
                if (!option || !option._id) return null;
                switch (type) {
                  case 'label': {
                    const label = option.display_fields.flatMap((field) => jsUtils.has(option, [field]) ? [option[field]] : []);
                    return !jsUtils.isEmpty(label)
                      ? label.join(jsUtils.get(option, ['separator']) || '-')
                      : null;
                  }
                  default:
                    return option._id;
                }
              }}
              hideMessage={hideMessage}
              // isScrollableSelectedList
              popperFixedStrategy
              isRequired={!field_data.read_only && field_data.required}
              helperTooltipMessage={fieldHelpText}
              helperToolTipId={`form_field_tooltip-${sectionIndex}-${fieldListIndex}-${fieldIndex}`}
              instructionMessage={
                (fieldInstruction && parse(fieldInstruction))
              }
              instructionClass={isCreationField && styles.CreateFormInstruction}
              icon={(
                <DataSetIcon
                  ariaLabel="data set"
                  role={ARIA_ROLES.IMG}
                  className={cx(
                    gClasses.ML15,
                    styles.DataListPickerIcon,
                  )}
                />
              )}
              popperClassName={
                parentModuleType === FORM_PARENT_MODULE_TYPES.ADD_DATA_LIST_ENTRY
                  ? styles.DatalistDataSelectorDropdownAddDatalist
                  : styles.UserPickerDropdown
              }
              allowNavigationToDataList
              dataListUUID={jsUtils.get(field_data, [
                'data_list',
                'data_list_uuid',
              ])}
              onTagClick={onTagClickForDataListPicker}
              fieldTypeInstruction={editIcon && fieldTypeInstruction}
              referenceName={field_data.reference_name}
              allowOnlySingleSelection={!jsUtils.get(field_data, ['validations', 'allow_multiple'], false)}
              isDatalistField
              isCreationField={isCreationField}
              filterFields={filter_fields || null}
            />
            {
              dataListErrorInstruction ?
                (
                  <div className={cx(BS.ALERT, BS.ALERT_WARNING, gClasses.FTwo10)}>
                    {dataListErrorInstruction}
                  </div>
                ) : null
            }
          </>
        );
        break;
      case FIELD_TYPES.DATA_LIST_PROPERTY_PICKER: {
        let value = '-';
        if (formType === FORM_TYPES.CREATION_FORM || formType === FORM_TYPES.IMPORTABLE_FORM) {
          value = DATA_LIST_PROPERTY_PICKER.INSTRUCTION;
        } else {
          if ((fieldValue ? !isEmpty(fieldValue) : false) ||
            stateData[field_data.field_uuid] ? !isEmpty(stateData[field_data.field_uuid]) : false) {
            value = fieldValue || stateData[field_data.field_uuid];
          }
        }
        inputComponent = (
          <DataListPropertyPicker
            className={(isTable) ? null : fieldClassName}
            editIcon={editIcon}
            deleteIcon={deleteIcon}
            isTable={isTable}
            formType={formType}
            getValue={() => getReadOnlyTextComponent(true, value)}
            fieldTypeInstruction={fieldTypeInstruction}
            fieldData={field_data}
            helperTooltipMessage={fieldHelpText}
            helperToolTipId={`form_field_tooltip-${sectionIndex}-${fieldListIndex}-${fieldIndex}`}
            instructionMessage={
              fieldInstruction && parse(fieldInstruction)
            }
            instructionClass={isCreationField && styles.CreateFormInstruction}
          />
        );
        break;
      }
      case FIELD_TYPES.USER_PROPERTY_PICKER: {
        let value = '-';

        if (formType === FORM_TYPES.CREATION_FORM || formType === FORM_TYPES.IMPORTABLE_FORM) {
          value = USER_LIST_PROPERTY_PICKER_INFO.INSTRUCTION;
        } else {
          if ((fieldValue ? !isEmpty(fieldValue) : false) ||
            stateData[field_data.field_uuid] ? !isEmpty(stateData[field_data.field_uuid]) : false) {
            value = fieldValue || stateData[field_data.field_uuid];
          }
        }
        inputComponent = (
          <DataListPropertyPicker
            className={(isTable) ? null : fieldClassName}
            editIcon={editIcon}
            deleteIcon={deleteIcon}
            isTable={isTable}
            formType={formType}
            getValue={() => getReadOnlyTextComponent(true, value)}
            fieldTypeInstruction={fieldTypeInstruction}
            fieldData={field_data}
            helperTooltipMessage={fieldHelpText}
            helperToolTipId={`form_field_tooltip-${sectionIndex}-${fieldListIndex}-${fieldIndex}`}
            instructionMessage={
              fieldInstruction && parse(fieldInstruction)
            }
            instructionClass={isCreationField && styles.CreateFormInstruction}
          />
        );
        break;
      }
      default:
        break;
    }
  }

  // const saveFormField = (section_id, fieldId) => {
  //   onSaveFormField(section_id, fieldId);
  // };

  let configPopUp = null;
  let creationView = null;
  let editableView = null;
  let importableView = null;
  console.log('formTypeformType', formType);

  switch (formType) {
    case FORM_TYPES.CREATION_FORM:
      let popup = null;
      let popupVisibility = null;
      let fieldDependencyDialogVisibility = false;
      const creationViewClasses =
        !isTable &&
        field_data.field_type === FIELD_TYPES.DATETIME &&
        styles.CreationViewDateTimeField;
      const creationDateClasses =
        !isTable &&
        field_data.field_type === FIELD_TYPES.DATE &&
        styles.CreationViewDateField;

      if (
        showFieldDependencyDialog &&
        showFieldDependencyDialog.isVisible &&
        (multiNullCheck(showFieldDependencyDialog, [
          'sectionIndex',
          'fieldListIndex',
          'fieldIndex',
        ]) || isTable) &&
        showFieldDependencyDialog.sectionIndex === sectionIndex &&
        showFieldDependencyDialog.fieldListIndex === fieldListIndex &&
        (showFieldDependencyDialog.fieldIndex === fieldIndex || isTable)
      ) {
        fieldDependencyDialogVisibility = true;
      }

      if (fieldDependencyDialogVisibility) {
        popup = (
          <DependencyHandler
            onDeleteClick={() =>
              deleteFormFieldFromDependencyConfig(
                FIELD_OR_FIELD_LIST.FIELD,
                sectionIndex,
                fieldListIndex,
                fieldIndex,
              )
            }
            onCancelDeleteClick={dependencyConfigCloseHandler}
            dependencyHeaderTitle={dependency_type}
            dependencyData={dependency_data}
            getMoreDependency={getMoreDependency}
          />
        );
        popupVisibility = fieldDependencyDialogVisibility;
      } else if (field_data.isConfigPopupOpen) {
        popup = (
            <FieldConfiguration
              fieldDetails={{
                text: fieldName,
                fieldType: field_data.field_type,
                fieldListType: field_list_type,
                sectionIndex: sectionIndex,
                fieldListIndex: fieldListIndex,
                fieldIndex: fieldIndex,
              }}
              onCloseClickHandler={(...params) =>
                    onFormFieldOpenAndCloseHandler(
                      FORM_FIELD_CONFIG_ACTIONS.CLOSE,
                      ...params,
                    )
                  }
            />
          // <FieldConfig
          //   fieldListType={field_list_type}
          //   sectionIndex={sectionIndex}
          //   fieldListIndex={fieldListIndex}
          //   fieldIndex={fieldIndex}
          //   sectionId={sectionId}
          //   tableUuid={tableUuid}
          //   fieldType={{
          //     text: fieldName,
          //     value: field_data.field_type,
          //   }}
          //   isPopUpOpen={field_data.isConfigPopupOpen}
          //   referenceName={
          //     field_data.reference_name || field_data.table_reference_name
          //   }
          //   fieldId={field_data.column_order}
          //   fieldData={field_data}
          //   onDataListChangeHandler={(event) =>
          //     onFormFieldChangeHandler(
          //       FIELD_KEYS.DATA_LIST,
          //       event,
          //       sectionId - 1,
          //       fieldListIndex,
          //       field_data.column_order - 1,
          //       t,
          //     )
          //   }
          //   onSetDataListSelectorErrorList={(event) =>
          //     onFormFieldChangeHandler(
          //       FIELD_KEYS.DATA_liST_SELECTOR_ERROR,
          //       event,
          //       sectionId - 1,
          //       fieldListIndex,
          //       field_data.column_order - 1,
          //     )
          //   }
          //   onDataListPropertyPickerChangeHandler={(event) =>
          //     onFormFieldChangeHandler(
          //     FIELD_KEYS.PROPERTY_PICKER_DETAILS,
          //     event,
          //     sectionId - 1,
          //     fieldListIndex,
          //     field_data.column_order - 1,
          //   )}
          //   onSetDataListPropertyPickerErrorList={(event) =>
          //     onFormFieldChangeHandler(
          //       FIELD_KEYS.DATA_LIST_PROPERTY_PICKER_ERROR,
          //       event,
          //       sectionId - 1,
          //       fieldListIndex,
          //       field_data.column_order - 1,
          //     )
          //   }
          //   onCloseClickHandler={(...params) =>
          //     onFormFieldOpenAndCloseHandler(
          //       FORM_FIELD_CONFIG_ACTIONS.CLOSE,
          //       ...params,
          //     )
          //   }
          //   onLabelChangeHandler={(event) =>
          //     onFormFieldChangeHandler(
          //       FIELD_KEYS.FIELD_NAME,
          //       event,
          //       sectionId - 1,
          //       fieldListIndex,
          //       field_data.column_order - 1,
          //     )
          //   }
          //   onLookupFieldChangeHandler={(event) =>
          //     onFormFieldChangeHandler(
          //       FIELD_KEYS.SELECT_LOOKUP_FIELD,
          //       event,
          //       sectionId - 1,
          //       fieldListIndex,
          //       field_data.column_order - 1,
          //     )
          //   }
          //   onReferenceNameChangeHandler={(event) =>
          //     onFormFieldChangeHandler(
          //       FIELD_KEYS.REFERENCE_NAME,
          //       event,
          //       sectionId - 1,
          //       fieldListIndex,
          //       field_data.column_order - 1,
          //     )
          //   }
          //   onReferenceNameBlurHandler={(event) =>
          //     onReferenceNameBlurHandler(
          //       event,
          //       sectionId - 1,
          //       fieldListIndex,
          //       field_data.column_order - 1,
          //     )
          //   }
          //   onLabelBlurHandler={(event) =>
          //     onLabelBlurHandler(
          //       event,
          //       sectionId - 1,
          //       fieldListIndex,
          //       field_data.column_order - 1,
          //     )
          //   }
          //   error_list={error_list}
          //   datalist_selector_error_list={datalist_selector_error_list}
          //   onDefaultChangeHandler={(event) =>
          //     onFormFieldChangeHandler(
          //       FIELD_KEYS.DEFAULT_VALUE,
          //       event,
          //       sectionId - 1,
          //       fieldListIndex,
          //       field_data.column_order - 1,
          //     )
          //   }
          //   onRequiredClickHandler={(value) =>
          //     onFormFieldChangeHandler(
          //       FIELD_KEYS.REQUIRED,
          //       value,
          //       sectionId - 1,
          //       fieldListIndex,
          //       field_data.column_order - 1,
          //     )
          //   }
          //   onReadOnlyClickHandler={(value) =>
          //     onFormFieldChangeHandler(
          //       FIELD_KEYS.READ_ONLY,
          //       value,
          //       sectionId - 1,
          //       fieldListIndex,
          //       field_data.column_order - 1,
          //     )
          //   }
          //   onOtherConfigChangeHandler={(event) =>
          //     onFormFieldChangeHandler(
          //       FIELD_KEYS.OTHER_CONFIG,
          //       event,
          //       sectionId - 1,
          //       fieldListIndex,
          //       field_data.column_order - 1,
          //       t,
          //     )
          //   }
          //   onOtherConfigBlurHandler={onOtherConfigBlurHandler}
          //   onValidationConfigChangeHandler={(event) =>
          //     onFormFieldChangeHandler(
          //       FIELD_KEYS.VALIDATIONS,
          //       event,
          //       sectionId - 1,
          //       fieldListIndex,
          //       field_data.column_order - 1,
          //       t,
          //     )
          //   }
          //   onValidationConfigBlurHandler={onValidationConfigBlurHandler}
          //   onSaveFormField={(section_id, fieldId) => {
          //     onSaveFormField(section_id, fieldListIndex, fieldId);
          //   }}
          //   onAddValues={(event) =>
          //     onFormFieldChangeHandler(
          //       FIELD_KEYS.VALUES,
          //       event,
          //       sectionId - 1,
          //       fieldListIndex,
          //       field_data.column_order - 1,
          //     )
          //   }
          //   isTableField={isTable}
          //   onTabChangeHandler={(event) =>
          //     onFormFieldChangeHandler(
          //       FORM_FIELD_CONFIG_ACTIONS.TAB_SWITCH,
          //       event,
          //       sectionId - 1,
          //       fieldListIndex,
          //       field_data.column_order - 1,
          //     )
          //   }
          //   getRuleDetailsByIdInFieldVisibilityApi={
          //     getRuleDetailsByIdInFieldVisibilityApi
          //   }
          //   onDefaultRuleOperatorDropdownHandler={(value, operatorInfo) =>
          //     onDefaultRuleOperatorDropdownHandler(
          //       value,
          //       operatorInfo,
          //       sectionId - 1,
          //       fieldListIndex,
          //       field_data.column_order - 1,
          //     )
          //   }
          //   onFieldIsShowWhenRule={(value) =>
          //     onFormFieldChangeHandler(
          //       FIELD_KEYS.IS_SHOW_WHEN_RULE,
          //       value,
          //       sectionId - 1,
          //       fieldListIndex,
          //       field_data.column_order - 1,
          //     )
          //   }
          //   onHideFieldIfNull={(value) =>
          //     onFormFieldChangeHandler(
          //       FIELD_KEYS.HIDE_FIELD_IF_NULL,
          //       value,
          //       sectionId - 1,
          //       fieldListIndex,
          //       field_data.column_order - 1,
          //     )
          //   }
          //   onFieldVisibleRule={(value) =>
          //     onFormFieldChangeHandler(
          //       FIELD_KEYS.IS_VISIBLE,
          //       value,
          //       sectionId - 1,
          //       fieldListIndex,
          //       field_data.column_order - 1,
          //     )
          //   }
          //   onDefaultLValueRuleHandler={(lValueList) =>
          //     onDefaultLValueRuleHandler(
          //       lValueList,
          //       sectionId - 1,
          //       fieldListIndex,
          //       field_data.column_order - 1,
          //     )
          //   }
          //   onDefaultRValueRuleHandler={(rValueList) =>
          //     onDefaultRValueRuleHandler(
          //       rValueList,
          //       sectionId - 1,
          //       fieldListIndex,
          //       field_data.column_order - 1,
          //     )
          //   }
          //   onDefaultExtraOptionsRuleHandler={(extraOptions, isInitial) =>
          //     onDefaultExtraOptionsRuleHandler(
          //       extraOptions,
          //       sectionId - 1,
          //       fieldListIndex,
          //       field_data.column_order - 1,
          //       isInitial,
          //     )
          //   }
          //   onDefaultRuleOperatorInfoHandler={(operatorInfo) =>
          //     onDefaultRuleOperatorInfoHandler(
          //       operatorInfo,
          //       sectionId - 1,
          //       fieldListIndex,
          //       field_data.column_order - 1,
          //     )
          //   }
          //   onVisibilityFieldChangeHandler={(id, value) =>
          //     onFormFieldChangeHandler(
          //       VISIBILITY_CONFIG_CHANGE.FIELD,
          //       { target: { id, value } },
          //       sectionId - 1,
          //       fieldListIndex,
          //       field_data.column_order - 1,
          //     )
          //   }
          //   onDefaultValueRuleHandler={() =>
          //     onDefaultValueRuleHandler(
          //       sectionId - 1,
          //       fieldListIndex,
          //       field_data.column_order - 1,
          //     )
          //   }
          //   getDefaultRuleDetailsByIdApiThunk={(defaultRuleId, fieldType, onlyUpdateFieldMetadata) =>
          //     getDefaultRuleByIdApiThunk(
          //       defaultRuleId,
          //       sectionIndex,
          //       fieldListIndex,
          //       field_data.column_order - 1,
          //       fieldType,
          //       onlyUpdateFieldMetadata,
          //     )
          //   }
          //   blockDeleteAndTabChange={field_data.is_allow_value_update}
          //   getNewInputId={getNewInputId}
          // />
        );
        popupVisibility = field_data.isConfigPopupOpen;
      }
      if (fieldDependencyDialogVisibility) {
        configPopUp = (
          <AutoPositioningPopper
            className={cx(
              gClasses.ZIndex5,
              gClasses.PX20,
              styles.FieldConfigContainer,
            )}
            placement={POPPER_PLACEMENTS.AUTO}
            allowedAutoPlacements={[
              POPPER_PLACEMENTS.TOP,
              POPPER_PLACEMENTS.RIGHT,
              POPPER_PLACEMENTS.BOTTOM,
              fieldIndex !== 0 && POPPER_PLACEMENTS.LEFT,
            ]}
            fixedStrategy
            referenceElement={referencePopperElement}
            isPopperOpen={popupVisibility}
          >
            {popup}
          </AutoPositioningPopper>
        );
      } else {
        configPopUp = popup;
      }

      creationView = (
        <div
          className={cx(
            gClasses.CenterV,
            styles.Container,
            BS.P_RELATIVE,
            creationViewClasses,
            creationDateClasses,
            gClasses.CursorGrab,
            BS.H100,
          )}
        >
          {configPopUp}
          <div className={cx(styles.FieldOverlay, parentModuleType === FORM_PARENT_MODULE_TYPES.FLOW ? !isTable && styles.R1 : null)}>
            <div className={cx(BS.D_FLEX)}>
              {editIcon}
              {deleteIcon}
            </div>
          </div>
          <div
            className={cx(
              styles.InputContainer,
              isCreationField ? isTable && styles.TableField : null,
              isTable ? cx(styles.Table, gClasses.P5) : null,
              { [styles.ReadOnlyInput]: isTable },
              gClasses.FlexGrow1,
              gClasses.CursorGrab,
              BS.H100,
            )}
            ref={setReferencePopperElement}
            onClick={() =>
              !isEditableField && isTable
                ? onFormFieldOpenAndCloseHandler(
                  FORM_FIELD_CONFIG_ACTIONS.OPEN,
                  FORM_FIELD_CONFIG_TYPES.FIELD,
                  FIELD_LIST_TYPE.DIRECT,
                  sectionIndex,
                  fieldListIndex,
                  fieldIndex,
                )
                : null
            }
            role="button"
            tabIndex={-1}
            onKeyDown={(e) => keydownOrKeypessEnterHandle(e) &&
              !isEditableField && isTable
              ? onFormFieldOpenAndCloseHandler(
                FORM_FIELD_CONFIG_ACTIONS.OPEN,
                FORM_FIELD_CONFIG_TYPES.FIELD,
                FIELD_LIST_TYPE.DIRECT,
                sectionIndex,
                fieldListIndex,
                fieldIndex,
              )
              : null
            }
          >
            {inputComponent}
            <div className={cx(gClasses.FTwo12RedV18, gClasses.ML15)}>
              {serverErrorMessage}
            </div>
          </div>
        </div>
      );
      break;
    case FORM_TYPES.EDITABLE_FORM:
      editableView = (
        <div className={cx(styles.Container, BS.P_RELATIVE, wrapperEditableClassName)}>
          <div
            className={cx(
              gClasses.FlexGrow1,
              BS.W100,
              styles.EditableViewField,

            )}
          >
            {isCompletedForm ||
              isReadOnlyForm ||
              !field_data.is_visible ||
              fieldVisibility
              ? inputComponent
              : null}
          </div>
        </div>
      );
      break;
    case FORM_TYPES.IMPORTABLE_FORM:
      const readOnlyFieldTypes = Object.values(READ_ONLY_FIELD_TYPES);
      importableView = (
        <div
          className={cx(
            gClasses.MB20,
            BS.P_RELATIVE,
            gClasses.CenterVH,
            field_data.isDisabled ? gClasses.DisabledField : null,
          )}
        >
          {field_data.isSelected && (
            <ButtonSwitch
              optionList={
                (readOnlyFieldTypes.includes(field_data.field_type))
                  ? [FORM_STRINGS.IMPORT_FIELDS.BUTTON_SWITCH.option_list(t)[0]]
                  : FORM_STRINGS.IMPORT_FIELDS.BUTTON_SWITCH.option_list(t)
              }
              onClick={(value) =>
                onFieldAccessibilityHandler(
                  value,
                  sectionIndex,
                  fieldListIndex,
                  fieldIndex,
                )
              }
              selectedValue={
                field_data.read_only
                  ? FIELD_ACCESSIBILITY_TYPES.READ_ONLY
                  : FIELD_ACCESSIBILITY_TYPES.EDITABLE
              }
              className={cx(BS.P_ABSOLUTE, styles.ActionButtonContainer)}
            />
          )}
          <button
            className={cx(
              styles.ImportableContainer,
              gClasses.ClickableElement,
              gClasses.CursorPointer,
              BS.W100,
              BS.P_RELATIVE,
            )}
            style={
              field_data.isSelected
                ? { border: `1px solid ${buttonColor}` }
                : null
            }
            onClick={() =>
              field_data.isDisabled
                ? null
                : onFieldSelectHandler(sectionIndex, fieldListIndex, fieldIndex)
            }
          >
            <div className={gClasses.W90}>
              {inputComponent}
            </div>
            {field_data.isDisabled && (
              <Label className={gClasses.MT5} content={IMPORT_INSTRUCTION.FIELD_ALREADY_EXISTS} />
            )}
            <CheckboxGroup
              optionList={[{ label: '', value: 1 }]}
              className={cx(styles.CheckBox, BS.P_ABSOLUTE)}
              selectedValues={field_data.isSelected ? [1] : []}
              hideLabel
              hideMessage
              isGridViewClass
            />
            <div
              className={cx(
                styles.ImportFieldOverlay,
                BS.P_ABSOLUTE,
                BS.H100,
                BS.W100,
                {
                  [BS.D_NONE]: !field_data.isSelected,
                },
              )}
            />
          </button>
        </div>
      );
      break;
    default:
      break;
  }

  const fieldView = (
    <ConditionalWrapper
      condition={isTable}
      wrapper={(children) => (
        <div style={getTableFieldStyle(field_data.field_type, formType)}>
          {children}
        </div>
      )}
    >
      {editableView}
      {creationView}
      {importableView}
    </ConditionalWrapper>
  );

  return (
    <ConditionalWrapper
      condition={!isTable}
      wrapper={(children) => (children)}
    >
      {fieldView}
    </ConditionalWrapper>
  );
}

const mapStateToProps = ({ LanguageAndCalendarAdminReducer, AccountConfigurationAdminReducer }) => {
  const {
    working_hour_start_time,
    working_hour_end_time,
    working_days,
  } = LanguageAndCalendarAdminReducer;
  const { default_currency_type = EMPTY_STRING } = AccountConfigurationAdminReducer;
  return {
    working_hour_start_time,
    working_hour_end_time,
    working_days,
    default_currency_type,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getLanguageAndCalendarData: (value) => {
      dispatch(getLanguageAndCalendarDataThunk(value));
      return Promise.resolve();
    },
    setAccountConfigurationData: (response) => {
      dispatch(accountConfigurationDataChangeAction(response));
    },
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(FormFields),
);

FormFields.defaultProps = {
  error_list: {},
  stateData: {},
  onDefaultChangeHandler: null,
  onRequiredClickHandler: null,
  onReadOnlyClickHandler: null,
  onOtherConfigChangeHandler: null,
  onOtherConfigBlurHandler: null,
  onValidationConfigChangeHandler: null,
  onValidationConfigBlurHandler: null,
  onLabelChangeHandler: null,
  onSaveFormField: null,
  onAddValues: null,
  // deleteFormField: null,
  onChangeHandler: null,
  onLabelBlurHandler: null,
  fieldList: {},
  dependencyConfigData: {},
  getNewInputId: null,
  rowId: null,
  allow_modify_existing: true,
  serverErrorMessage: EMPTY_STRING,
};
FormFields.propTypes = {
  field_data: PropTypes.objectOf(PropTypes.any).isRequired,
  onLabelChangeHandler: PropTypes.func,
  onLabelBlurHandler: PropTypes.func,
  sectionId: PropTypes.number.isRequired,
  error_list: PropTypes.objectOf(PropTypes.any),
  onDefaultChangeHandler: PropTypes.func,
  onRequiredClickHandler: PropTypes.func,
  onReadOnlyClickHandler: PropTypes.func,
  onOtherConfigChangeHandler: PropTypes.func,
  onOtherConfigBlurHandler: PropTypes.func,
  onValidationConfigChangeHandler: PropTypes.func,
  onValidationConfigBlurHandler: PropTypes.func,
  onSaveFormField: PropTypes.func,
  onAddValues: PropTypes.func,
  // deleteFormField: PropTypes.func,
  onChangeHandler: PropTypes.func,
  stateData: PropTypes.objectOf(PropTypes.any),
  fieldList: PropTypes.objectOf,
  fieldListIndex: PropTypes.number.isRequired,
  dependencyConfigData: PropTypes.objectOf(PropTypes.any),
  getNewInputId: PropTypes.func,
  rowId: PropTypes.func,
  allow_modify_existing: PropTypes.bool,
  serverErrorMessage: PropTypes.string,
};
