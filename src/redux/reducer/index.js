import { combineReducers } from 'redux';
import AdminProfileReducer from './AdminProfileReducer';
import LocalizationReducer from './LocalizationReducer';
import MemberProfileReducer from './MemberProfileReducer';
import DeveloperProfileReducer from './DeveloperProfileReducer';
import RoleReducer from './RoleReducer';
import ColorCodeReducer from './ColorCodeReducer';
import FormStatusPopoverReducer from './FormStatusPopoverReducer';
import ConfirmPopoverReducer from './ConfirmPopoverReducer';
import PostLoaderStatusReducer from './PostLoaderStatusReducer';
import AlertPopoverReducer from './AlertPopoverReducer';
import SignUpBasicDetailsReducer from './SignUpBasicDetailsReducer';
import ChatReducer from './ChatReducer';
import ChatScreenReducer from './ChatScreenReducer';
import UserPreferenceReducer from './UserPreferenceReducer';
import TaskReducer from './TaskReducer';
import FlowListReducer from './FlowListReducer';
import LanguageLookUpReducer from './LanguageLookUpReducer';
import TimeZoneLookUpReducer from './TimeZoneLookUpReducer';
import LocaleLookUpReducer from './LocaleLookUpReducer';
import LookUpReducer from './LookUpReducer';
import NotificationReducer, * as notificationSelectors from './NotificationsReducer';
import LanguageAndCalendarAdminReducer from './LanguageAndCalendarAdminReducer';
import HolidayDetailsReducer from './HolidayDetailsReducer';
import ResetPasswordReducer from './ResetPasswordReducer';
import UserProfileReducer from './UserProfileReducer';
import ChangePasswordReducer from './ChangePasswordReducer';
import SignInReducer from './SignInReducer';
import AccountConfigurationAdminReducer from './AccountConfigurationAdminReducer';
import UserManagementAdminReducer from './UserManagementAdminReducer';
import AdminSettingsReducer from './AdminSettingsReducer';
import AddMemberReducer from './AddMemberReducer';
import SignUpOtpVerificationReducer from './SignUpOtpVerificationReducer';
import SignUpAdditionalDetailsReducer from './SignUpAdditionalDetailsReducer';
import UserSettingsReducer from './UserSettingsReducer';
import CreateTaskReducer from './CreateTaskReducer';
import TaskContentReducer from './TaskContentReducer';
import SignUpReducer from './SignUpReducer';
import AccountSettingsReducer from './AccountSettingsReducer';
import TaskActionHistoryReducer from './TaskActionHistoryReducer';
import LayoutReducer from './LayoutReducer';
import LayoutWithSidebarReducer from './LayoutWithSidebarReducer';
import FloatingActionMenuStartSectionReducer from './FloatingActionMenuStartSectionReducer';
import FlowDashboardReducer from './FlowDashboardReducer';
import EncryptionDataReducer from './EncryptionDataReducer';
import CoverContentSettingsReducer from './CoverContentSettingsReducer';
import FormPostOperationFeedbackReducer from './FormPostOperationFeedbackReducer';
import ForgotPasswordReducer from './ForgotPasswordReducer';
import defaultValueRuleReducer, * as defaultValueRuleSelectors from './DefaultValueRuleReducer';
import CreateDataListReducer from './CreateDataListReducer';
import DataListReducer from './DataListReducer';
import FieldSuggestionReducer from './FieldSuggestionReducer';
import VisibilityReducer, * as visibilitySelectors from './VisibilityReducer';
import ImportFormReducer from './ImportFormReducer';
import bulkUploadReducer, * as bulkUploadSelectors from './BulkUploadReducer';
import CategoryReducer from './CategoryReducer';
import NavBarReducer from './NavBarReducer';
import SearchResultsReducer from './SearchResultsReducer';
import AccountSettingModalReducer from './AccountConfigSetReducer';
import AccountCompleteCheckReducer from './AccountCompletionStatusReducer';
import CountryLookUpReducer from './CountryListLookUpReducer';
import HolidayListReducer from './HolidayListReducer';
import BillingModuleReducer from './BillingModuleReducer';
import UsageDashboardReducer from './UsageDashboardReducer';
import FieldVisibilityReducer from './FieldVisiblityReducer';
import AdminAccountsReducer from './AdminAccountsReducer';
import FormulaBuilderReducer from './FormulaBuilderReducer';
import EditFlowReducer from './EditFlowReducer';
import DownloadWindowReducer from './DownloadWindowReducer';
import IntegrationReducer from './IntegrationReducer';
import WelcomeInsightReducer from './WelcomeInsightsReducer';
import ApplicationDashboardReportReducer from './ApplicationDashboardReportReducer';
import ApplicationReducer from './ApplicationReducer';
import TaskListReducer from './TaskListReducer';
import ReportReducer from './ReportReducer';
import MfaReducer from './MfaReducer';
import MfaOtpVerificationReducer from './MfaOtpVerificationReducer';
import TeamsReducer from './TeamsReducer';
import CopilotReducer from './CopilotReducer';
import InformationWidgetReducer from './InformationWidgetReducer';
import WebpageEmbedWhitelistSettingReducer from './WebpageEmbedWhitelistSettingReducer';
import MlModelListReducer from './MlModelListReducer';
import IndividualEntryReducer from './IndividualEntryReducer';

export default combineReducers({
  AdminProfileReducer,
  MemberProfileReducer,
  DeveloperProfileReducer,
  RoleReducer,
  ColorCodeReducer,
  FormStatusPopoverReducer,
  ConfirmPopoverReducer,
  PostLoaderStatusReducer,
  LocalizationReducer,
  AlertPopoverReducer,
  SignUpBasicDetailsReducer,
  ChatReducer,
  ChatScreenReducer,
  TaskReducer,
  FlowListReducer,
  UserPreferenceReducer,
  LanguageLookUpReducer,
  TimeZoneLookUpReducer,
  LocaleLookUpReducer,
  LookUpReducer,
  NotificationReducer,
  LanguageAndCalendarAdminReducer,
  HolidayDetailsReducer,
  ResetPasswordReducer,
  UserProfileReducer,
  ChangePasswordReducer,
  SignInReducer,
  AccountConfigurationAdminReducer,
  UserManagementAdminReducer,
  AdminSettingsReducer,
  AddMemberReducer,
  SignUpOtpVerificationReducer,
  SignUpAdditionalDetailsReducer,
  UserSettingsReducer,
  CreateTaskReducer,
  TaskContentReducer,
  SignUpReducer,
  AccountSettingsReducer,
  TaskActionHistoryReducer,
  LayoutReducer,
  LayoutWithSidebarReducer,
  FloatingActionMenuStartSectionReducer,
  FlowDashboardReducer,
  EncryptionDataReducer,
  CoverContentSettingsReducer,
  FormPostOperationFeedbackReducer,
  ForgotPasswordReducer,
  defaultValueRuleReducer,
  CreateDataListReducer,
  DataListReducer,
  FieldSuggestionReducer,
  VisibilityReducer,
  ImportFormReducer,
  bulkUploadReducer,
  CategoryReducer,
  NavBarReducer,
  SearchResultsReducer,
  AccountSettingModalReducer,
  AccountCompleteCheckReducer,
  CountryLookUpReducer,
  HolidayListReducer,
  BillingModuleReducer,
  UsageDashboardReducer,
  FieldVisibilityReducer,
  AdminAccountsReducer,
  FormulaBuilderReducer,
  EditFlowReducer,
  DownloadWindowReducer,
  IntegrationReducer,
  WelcomeInsightReducer,
  ApplicationDashboardReportReducer,
  ApplicationReducer,
  TaskListReducer,
  ReportReducer,
  TeamsReducer,
  WebpageEmbedWhitelistSettingReducer,
  MfaReducer,
  MfaOtpVerificationReducer,
  CopilotReducer,
  InformationWidgetReducer,
  MlModelListReducer,
  IndividualEntryReducer,
});

export const getSelectedDefaultValueRuleOperator = (state, operator, fieldType) => defaultValueRuleSelectors.getSelectedDefaultValueRuleOperator(state.defaultValueRuleReducer, operator, fieldType);
export const getDefaultRuleValueDropdownList = (state, fieldType, isTableField) => defaultValueRuleSelectors.getDefaultRuleValueDropdownList(state.defaultValueRuleReducer, fieldType, isTableField);
export const getDefaultRuleLoadingStatus = (state) => defaultValueRuleSelectors.getDefaultRuleLoadingStatus(state.defaultValueRuleReducer);
export const getDefaultRuleListErrors = (state) => defaultValueRuleSelectors.getDefaultRuleListErrors(state.defaultValueRuleReducer);
export const getDefaultRuleExternalFieldsData = (state) => defaultValueRuleSelectors.getDefaultRuleExternalFieldsData(state.defaultValueRuleReducer);
export const getDefaultRuleExternalFieldsPaginationDetails = (state) => defaultValueRuleSelectors.getDefaultRuleExternalFieldsPaginationDetails(state.defaultValueRuleReducer);
export const getDefaultRuleExternalFieldsLoadingStatus = (state) => defaultValueRuleSelectors.getDefaultRuleExternalFieldsLoadingStatus(state.defaultValueRuleReducer);
export const getDefaultRuleExternalFieldsErrors = (state) => defaultValueRuleSelectors.getDefaultRuleExternalFieldsErrors(state.defaultValueRuleReducer);
export const getDefaultRuleExternalFieldsDropdownList = (state, currentFieldId, tableUuid, isTableField, selectedOperatorInfo) => defaultValueRuleSelectors.getDefaultRuleExternalFieldsDropdownList(state.defaultValueRuleReducer, currentFieldId, tableUuid, isTableField, selectedOperatorInfo);
export const getDefaultRuleExternalFieldMetadataDropdownList = (state, currentFieldId, tableUuid, isTableField, selectedOperatorInfo) => defaultValueRuleSelectors.getDefaultRuleExternalFieldMetadataDropdownList(state.defaultValueRuleReducer, currentFieldId, tableUuid, isTableField, selectedOperatorInfo);
export const getDefaultRuleExternalOriginalFieldMetaData = (state) => defaultValueRuleSelectors.getDefaultRuleExternalFieldMetaData(state.defaultValueRuleReducer);
export const getOperatorsInfoByFieldType = (state, fieldType) => defaultValueRuleSelectors.getOperatorsInfoByFieldType(state.defaultValueRuleReducer, fieldType);
export const isMultiSelectOperator = (operatorInfo) => defaultValueRuleSelectors.isMultiSelectOperator(operatorInfo);

// VISIBILITY_REDUCER
export const getVisibilityExternalFieldsData = (state) => visibilitySelectors.getVisibilityExternalFieldsData(state.VisibilityReducer);
export const getVisibilityExternalFieldsAndFieldMetadataData = (state) => visibilitySelectors.getVisibilityExternalFieldsAndFieldMetadataData(state.VisibilityReducer);
export const getVisibilityExternalFieldsPaginationDetails = (state) => visibilitySelectors.getVisibilityExternalFieldsPaginationDetails(state.VisibilityReducer);
export const getTableValidationFieldsPaginationDetails = (state) => visibilitySelectors.getTableValidationFieldsPaginationDetails(state.VisibilityReducer);
export const getVisibilityExternalFieldsHasMore = (state) => visibilitySelectors.getVisibilityExternalFieldsHasMore(state.VisibilityReducer);
export const getTableValidationFieldsHasMore = (state) => visibilitySelectors.getTableValidationFieldsHasMore(state.VisibilityReducer);
export const getVisibilityExternalFieldsLoadingStatus = (state) => visibilitySelectors.getVisibilityExternalFieldsLoadingStatus(state.VisibilityReducer);
export const getTableValidationFieldsLoadingStatus = (state) => visibilitySelectors.getTableValidationFieldsLoadingStatus(state.VisibilityReducer);
export const getVisibilityExternalFieldsErrors = (state) => visibilitySelectors.getVisibilityExternalFieldsErrors(state.VisibilityReducer);
export const getVisibilityExternalFieldsDropdownList = (state, currentFieldId, excludeDateTime = false, isSearch = false) => visibilitySelectors.getVisibilityExternalFieldsDropdownList(state.VisibilityReducer, currentFieldId, excludeDateTime, isSearch);
export const getVisibilityExternalFieldsDropdownListByChoiceValueType = (state, currentFieldId, excludeDateTime = false, isSearch = false) => visibilitySelectors.getVisibilityExternalFieldsDropdownListByChoiceValueType(state.VisibilityReducer, currentFieldId, excludeDateTime, isSearch);
export const getTableValidationlFieldsDropdownList = (state) => visibilitySelectors.getTableValidationlFieldsDropdownList(state.VisibilityReducer);
export const getDataListFieldsDropdownList = (state) => visibilitySelectors.getDataListFieldsDropdownList(state.VisibilityReducer);
export const getDataListFieldValuesList = (state) => visibilitySelectors.getDataListFieldValuesList(state.VisibilityReducer);
export const getVisibilityOperatorsData = (state) => visibilitySelectors.getVisibilityOperatorsData(state.VisibilityReducer);
export const getVisibilityOperatorsLoadingStatus = (state) => visibilitySelectors.getVisibilityOperatorsLoadingStatus(state.VisibilityReducer);
export const getVisibilityOperatorsErrors = (state) => visibilitySelectors.getVisibilityOperatorsErrors(state.VisibilityReducer);
export const getVisibilityOperatorsDropdownList = (state) => visibilitySelectors.getVisibilityOperatorsDropdownList(state.VisibilityReducer);
export const getAllFieldsOperator = (state) => visibilitySelectors.getAllFieldsOperator(state.VisibilityReducer);

// BULKUPLOAD_REDUCER
export const getBulkUploadData = (state) => bulkUploadSelectors.getBulkUploadData(state.bulkUploadReducer);
export const isUploading = (state) => bulkUploadSelectors.isUploading(state.bulkUploadReducer);
export const getBulkUploadValidationMessage = (state) => bulkUploadSelectors.getBulkUploadValidationMessage(state.bulkUploadReducer);
export const getBulkUploadError = (state) => bulkUploadSelectors.getBulkUploadError(state.bulkUploadReducer);

// NOTIFICATIONS REDUCER
export const getModifiedNotificationsList = (state) => notificationSelectors.getModifiedNotificationsList(state);
