import { constructMetricFields, getActiveUsers } from 'containers/edit_flow/EditFlow.utils';
import { GET_SECTION_INITIAL_DATA } from '../../utils/constants/form.constant';
import jsUtils, { cleanObject, cloneDeep, isEmpty, set } from '../../utils/jsUtility';
import { EMPTY_STRING } from '../../utils/strings/CommonStrings';

export const getDataListBasicDetailsSelector = (state) => {
  return {
    tabIndex: state.tabIndex,
    data_list_name: state.data_list_name,
    technical_reference_name: state.technical_reference_name,
    data_list_short_code: state.data_list_short_code,
    data_list_description: state.data_list_description,
    data_list_color: state.data_list_color,
    data_list_uuid: state.data_list_uuid,
    data_list_id: state.data_list_id,
    status: state.status,
    version: state.version,
    flowSettingsModalVisibility: state.flowSettingsModalVisibility,
    isShortCodeEdited: state.isShortCodeEdited,
    isDatalistShortCodeSaved: state?.version > 1,
    isTechnicalRefercenNameSaved: state?.version > 1,
    is_row_security_policy: state?.is_row_security_policy,
  };
};
export const getInitialSectionDetails = () => [
    GET_SECTION_INITIAL_DATA(),
  ];

export const getEditDataListBasicDetails = (res) => {
  const basicDetailsKeys = [
    'data_list_uuid', 'data_list_name', 'data_list_description', 'data_list_short_code', 'technical_reference_name',
    'data_list_color', 'data_list_id', 'data_field_type', 'is_system_identifier', 'custom_identifier', 'status', 'version',
  ];
  const basicDetails = [];
  basicDetailsKeys.forEach(
    (key) => {
      if (jsUtils.has(res, key)) {
        if (key === 'custom_identifier') {
          basicDetails.push({ id: key, value: res[key].field_uuid });
          basicDetails.push({ id: 'selected_identifier', value: res[key].reference_name });
        } else basicDetails.push({ id: key, value: res[key] });
      } else if (key === 'data_list_id') basicDetails.push({ id: key, value: res._id });
    },
  );
  return basicDetails;
};

export const getEditDataListSecurityDetails = (res) => {
  const securityDetailsKey = ['additional_owners', 'additional_viewers', 'owners', 'reassignedOwners', 'viewers', 'is_participants_level_security', 'entry_adders'];
  const cleanObjectKeys = ['owners', 'reassignedOwners', 'entry_adders', 'viewers'];
  let securityDetails = {};
  securityDetailsKey.forEach(
    (key) => {
      const value = cleanObjectKeys.includes(key) ? cleanObject(res[key]) : res[key];
      jsUtils.has(res, [key]) ? jsUtils.set(securityDetails, key, value) : null;
    },
  );
  set(securityDetails, 'owners', getActiveUsers(res.admins));
  set(securityDetails, 'reassignedOwners', getActiveUsers(res.owners));
  set(securityDetails, 'entityViewers', cloneDeep(getActiveUsers(res.entity_viewers)));
  set(securityDetails, 'entityViewersMetaData', cloneDeep(getActiveUsers(res.entity_viewers)));

  securityDetails = {
    ownerSearchValue: '',
    selectedOwner: '',
    owners: {},
    reassignedOwners: {},
    additional_owners: true,
    updaterSearchValue: '',
    selectedUpdater: '',
    entry_adders: {},
    viewerSearchValue: '',
    selectedViewer: '',
    viewers: {},
    additional_viewers: false,
    entityViewers: {},
    selectedEntityViewer: EMPTY_STRING,
    entityViewerSearchValue: EMPTY_STRING,
    is_participants_level_security: true,
    ...securityDetails,
  };

  securityDetails = {
    ...securityDetails,
    owners: getActiveUsers(securityDetails?.owners),
    reassignedOwners: getActiveUsers(securityDetails?.reassignedOwners),
    entry_adders: getActiveUsers(securityDetails?.entry_adders),
    viewers: getActiveUsers(securityDetails?.viewers),
  };

  return securityDetails;
};

export const getEditDataListMetricDetails = (res) => {
  let metricDetails = {};
  if (jsUtils.has(res, ['default_report_fields'])) jsUtils.set(metricDetails, ['metric_fields'], constructMetricFields(res.default_report_fields));
  metricDetails = {
    metric_fields: [],
    isShowMetricAdd: false,
    lstAllFields: [],
    l_field: EMPTY_STRING,
    err_l_field: {
    },
    ...metricDetails,
  };
  return metricDetails;
};

export const getDataListBasicPostDetailsSelector = (state) => {
  const data = {};
  data.add_form = true;
  data.data_list_name = jsUtils.removeExtraSpace(state.data_list_name.trim());
  if (!jsUtils.isEmpty(state.data_list_description)) data.data_list_description = jsUtils.removeExtraSpace(state.data_list_description.trim());
  // data.is_trigger_set = false; // must be set to true only when trigger set in publish screen
  return data;
};

export const getSaveDataListPostDetailsSelector = (state) => {
  let data = {};
  data.data_list_name = state.data_list_name;
  data.data_list_uuid = state.data_list_uuid;
  data.technical_reference_name = state.technical_reference_name;
  if (!jsUtils.isEmpty(state.data_list_description)) data.data_list_description = state.data_list_description;
  if (!jsUtils.isEmpty(state.data_list_color)) data.data_list_color = state.data_list_color;
  if (!jsUtils.isEmpty(state.category)) data.category = [state.category];
  if (!jsUtils.isEmpty(state.data_list_short_code)) data.data_list_short_code = state.data_list_short_code;
  if (!jsUtils.isEmpty(state.status)) data.status = state.status;
  data.is_system_identifier = state.is_system_identifier;
  data.custom_identifier = state.custom_identifier;
  data.metrics = state.metrics;
  data.category = state.category;
  data.trigger_details = state.trigger_details;
  data.activeTriggerData = state.activeTriggerData;
  data.is_row_security_policy = state?.is_row_security_policy;
  if (data?.is_row_security_policy) data.policyList = state?.policyList || [];
  data.has_system_events = state.has_system_events;
  data = { ...data, ...jsUtils.pick(state.security, ['owners', 'reassignedOwners', 'additional_owners', 'viewers', 'additional_viewers', 'entry_adders', 'is_participants_level_security', 'entityViewers']) };
  return data;
};

export const getsaveDataListValidateSecurityDataSelector = (state) => {
  const securityData = {};
  if (!isEmpty(jsUtils.get(state.security, ['entry_adders', 'users'], []))) {
    securityData.users = state?.security?.entry_adders?.users;
  }
  if (!isEmpty(jsUtils.get(state.security, ['entry_adders', 'teams'], []))) {
    securityData.teams = state?.security?.entry_adders?.teams;
  }
  return {
    entry_adders: securityData,
  };
};

export const getDataListInitialDataLoading = (state) => state.isEditInitialLoading;

export const getDataListFromDetailsLoading = (state) => state.isFormDetailsLoading;

export const getDataFieldsTypeAndSectionSelector = (state) => {
  // let sections = isEditView ? [] : state.sections;
  // if (isEditView && jsUtils.isArray(state.sections)) {
  //   sections = state.sections.filter((section) => !jsUtils.isEmpty(jsUtils.get(section, ['fields'])));
  // }
  const { sections, fields } = state;
  return {
    data_list_name: state.data_list_name,
    data_list_description: state.data_list_description,
    data_list_uuid: state.data_list_uuid,
    data_list_id: state.data_list_id,
    data_field_type: state.data_field_type,
    sectionTitle: state.sectionTitle,
    sectionTitleError: state.sectionTitleError,
    sections,
    fields,
    form_details: state.form_details,
    error_list: state.error_list,
    datalist_selector_error_list: state.datalist_selector_error_list,
    dependency_data: state.dependency_data,
    dependency_type: state.dependency_type,
    dependency_name: state.dependency_name,
    showFieldDependencyDialog: state.showFieldDependencyDialog || false,
    showFormDependencyDialog: state.showFormDependencyDialog || false,
    showSectionDependencyDialog: state.showSectionDependencyDialog,
    status: state.status,
    version: state.version,
  };
};

export const getDataListMetricsSelector = (state) => {
  return {
    data_list_uuid: state.data_list_uuid,
    data_list_id: state.data_list_id,
    metrics: state.metrics,
    lstAllFields: state.lstAllFields,
    hasMore: state.hasMore,
    metricCurrentPage: state.metricCurrentPage,
  };
};

export default getDataListBasicDetailsSelector;
