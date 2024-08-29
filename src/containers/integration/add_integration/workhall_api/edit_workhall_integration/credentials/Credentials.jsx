import React, { useState } from 'react';
import cx from 'classnames/bind';
import { connect } from 'react-redux';
import { integrationDataChange } from 'redux/reducer/IntegrationReducer';
import {
  ETextSize,
  MultiDropdown,
  SingleDropdown,
  Text,
  TextInput,
} from '@workhall-pvt-lmt/wh-ui-library';
import gClasses from 'scss/Typography.module.scss';
import { cloneDeep, isEmpty, uniqBy } from 'utils/jsUtility';
import {
  CHOOSE_FLOW_SCROLLABLE_ID,
  CHOOSE_FLOW_SCROLLABLE_THRESHOLD,
  CRED_STATUS_VALUES,
  WH_API_CONSTANTS,
  WORKHALL_AUTH_TYPE,
} from '../../../../Integration.constants';
import { WORKHALL_API_STRINGS } from '../../../../Integration.strings';
import { generateEventTargetObject } from '../../../../../../utils/generatorUtils';
import { BS } from '../../../../../../utils/UIConstants';
import {
  getAllDataListApiThunk,
  getCredentialsListApiThunk,
  getAllFlowListApiThunk,
  getInitiationStepActionsApiThunk,
} from '../../../../../../redux/actions/Integration.Action';
import styles from '../EditWorkhallIntegration.module.scss';
import {
  getDisabledCredError,
  getMultiDropdownValue,
  getSelectedOption,
} from '../../WorkhallApi.utils';
import { EMPTY_STRING } from '../../../../../../utils/strings/CommonStrings';
import { getAPIConfigBaseUrl } from '../../../../Integration.utils';
import { CancelToken, getUrlPath } from '../../../../../../utils/UtilityFunctions';
import UserPicker from '../../../../../../components/user_picker/UserPicker';
import { ROLES } from '../../../../../../utils/Constants';
import InfoIconCircle from '../../../../../../assets/icons/integration/InfoIconCircle';
import Tooltip from '../../../../../../components/tooltip/Tooltip';
import useApiCall from '../../../../../../hooks/useApiCall';
import { formatAllFlowsList } from '../../../../../edit_flow/step_configuration/node_configurations/call_another_flow/CallAnotherFlow.utils';
import { INITIAL_PAGE, MAX_PAGINATION_SIZE } from '../../../../../../utils/constants/form.constant';
import { getSubFlows } from '../../../../../../axios/apiService/flowList.apiService';

let cancelTokenOauthApi;

const getCancelTokenOauthApi = (cancelToken) => {
  cancelTokenOauthApi = cancelToken;
};

const cancelTokenUsers = new CancelToken();

let cancelGetAllSources;

export const getCancelTokenForSourceList = (cancelToken) => {
  cancelGetAllSources = cancelToken;
};

const dropdownOptionSize = 10;

function Credentials(props) {
  const {
    state: {
      workhall_api_type,
      flow_uuid,
      url_path,
      authentication_type,
      allDataLists,
      dataListsCurrentPage,
      hasMoreDataLists,
      data_list_uuid,
      authentication_id,
      isAllFlowListLoading,
      isAllDataListLoading,
      workhall_api_method,
      isLoadingCredentialsList,
      credentialsCurrentPage,
      hasMoreCredentials,
      credentialsList,
      selected_authentication_list,
      error_list,
      flow_name,
      data_list_name,
      disabledCredList,
    },
    integrationDataChange,
    getCredentialsListApi,
  } = cloneDeep(props);

  const [sourceSearchText, setSourceSearchText] = useState(EMPTY_STRING);
  const [flowSearchText, setFlowSearchText] = useState(EMPTY_STRING);
  const [isUrlPathEdited, setUrlPathEdited] = useState(!isEmpty(url_path));
  const isFlowApi = workhall_api_type === WH_API_CONSTANTS.STARTING_A_FLOW;
  const { API_URL } = WORKHALL_API_STRINGS;

  const { data: allFlowsList, fetch: getAllFlowData, page: allFlowsCurrentPage, hasMore: hasMoreFlows } = useApiCall({}, true, formatAllFlowsList);

  const getAllFlowsList = (params = {}) => {
    params = {
      page: INITIAL_PAGE,
      size: MAX_PAGINATION_SIZE,
      allow_call_by_api: 1,
      ...params,
    };
    if (isEmpty(params?.search)) {
      delete params.search;
    }
    getAllFlowData(getSubFlows(params));
  };

  const loadMoreFlows = () => {
    getAllFlowsList(
      { page: allFlowsCurrentPage + 1, search: flowSearchText },
    );
  };

  const getCredentialsList = (params, isInitialLoad = true) => {
    if (cancelTokenOauthApi) cancelTokenOauthApi();
    getCredentialsListApi(params, isInitialLoad, getCancelTokenOauthApi);
  };

  const loadMoreCredentials = () => {
    getCredentialsList({ page: credentialsCurrentPage + 1, size: dropdownOptionSize, type: workhall_api_type, status: CRED_STATUS_VALUES.ENABLED }, false);
  };

  const loadInitialFlowList = () => {
    setFlowSearchText(EMPTY_STRING);
    getAllFlowsList();
  };

  const onFlowSearchChange = (event) => {
    const searchValue = event?.target?.value;
    getAllFlowsList({ search: searchValue });
    setFlowSearchText(searchValue);
  };

  const loadDataLists = (params, isInitialLoad) => {
    const { getAllDataListApi } = props;
    if (cancelGetAllSources) cancelGetAllSources();
    getAllDataListApi(params, isInitialLoad, getCancelTokenForSourceList);
  };

  const loadInitialDataList = () => {
    if ((isEmpty(allDataLists) && !isAllDataListLoading) || !isEmpty(sourceSearchText)) {
      loadDataLists({
        page: 1,
        size: dropdownOptionSize,
        search: EMPTY_STRING,
      }, true);
      setSourceSearchText(EMPTY_STRING);
    }
  };

  const loadMoreDataLists = () => {
    loadDataLists({ page: dataListsCurrentPage + 1, size: dropdownOptionSize, search: sourceSearchText }, false);
  };

  const onDataListSearchChange = (event) => {
    const { value = EMPTY_STRING } = event.target;
    loadDataLists({ page: 1, size: dropdownOptionSize, search: value }, true);
    setSourceSearchText(value);
  };

  const loadInitialCredentialsData = () => {
    if (isEmpty(credentialsList) && !isLoadingCredentialsList) {
      getCredentialsList({
        page: 1,
        size: dropdownOptionSize,
        type: workhall_api_type,
        status: CRED_STATUS_VALUES.ENABLED,
      });
    }
  };

  const onChangeHandler = (event, _list) => {
    const {
      target: { id, value },
    } = event;
    const errorList = cloneDeep(error_list);
    let dataTobeUpdated = {};
    if (errorList?.[id]) delete errorList[id];
    let selectedOption = {};
    switch (id) {
      case WORKHALL_API_STRINGS.CHOOSE_FLOW.ID:
        selectedOption = getSelectedOption(value, _list);
        dataTobeUpdated = {
          flow_id: selectedOption?.id,
          flow_name: selectedOption.label,
          action_uuid: null,
          body: [],
          currentFlowActions: [],
          allFields: [],
          reqBodyFieldDetails: [],
          url_path: isUrlPathEdited ? url_path : `/${getUrlPath(selectedOption?.label)}`,
        };
        break;
      case WORKHALL_API_STRINGS.CHOOSE_DATA_LIST.ID:
        selectedOption = getSelectedOption(value, _list);
        dataTobeUpdated = {
          data_list_id: selectedOption?._id,
          data_list_name: selectedOption?.label,
          body: [],
          allFields: [],
          reqBodyFieldDetails: [],
          url_path: isUrlPathEdited ? url_path : `/${getUrlPath(selectedOption?.data_list_name)}`,
        };
        break;
      case WORKHALL_API_STRINGS.AUTHENTICATION_TYPE.ID:
        dataTobeUpdated = {
          authentication_id: [],
          selected_authentication_list: [],
          credentialsList: [],
          disabledCredList: [],
        };
        delete errorList[WORKHALL_API_STRINGS.CHOOSE_CREDENTIAL.ID];
        break;
      case WORKHALL_API_STRINGS.CHOOSE_CREDENTIAL.ID:
        const selectedIdList = cloneDeep(authentication_id);
        const selectedAuthList = cloneDeep(selected_authentication_list);
        const disabledCredListCopy = cloneDeep(disabledCredList);
        if (!selectedIdList?.includes(value)) {
          selectedIdList.push(value);
          selectedAuthList.push(event?.target?.option || {});
        } else {
          const index = selectedIdList.indexOf(value);
          if (index > -1) {
            selectedIdList.splice(index, 1);
            selectedAuthList.splice(index, 1);
            const disabledCredIndex = disabledCredListCopy.indexOf(value);
            disabledCredListCopy.splice(disabledCredIndex, 1);
          }
        }
        dataTobeUpdated = {
          [id]: selectedIdList,
          selected_authentication_list: selectedAuthList,
          disabledCredList: disabledCredListCopy,
        };
        break;
      default:
        break;
    }
    if (id === WORKHALL_API_STRINGS.API_URL.ID) {
      setUrlPathEdited(true);
    }
    integrationDataChange({
      [id]: value,
      ...dataTobeUpdated,
      error_list: errorList,
    });
    return dataTobeUpdated[id];
  };

  const onDropdownChangeHandler = (value, _label, list, id) =>
    onChangeHandler(generateEventTargetObject(id, value), list);

  const onCredentialsListChange = (value, index, id) => {
    let additionalData = {};
    const selectedOption = credentialsList.find((credential) => (credential?._id === value)) || {};
    if (!isEmpty(selectedOption)) {
      additionalData = { option: selectedOption };
    }
    onChangeHandler(generateEventTargetObject(id, value, additionalData));
  };

  const onSelectUser = (option) => {
    onChangeHandler(generateEventTargetObject(WORKHALL_API_STRINGS.CHOOSE_CREDENTIAL.ID, option._id, { option }));
  };

  const onRemoveUser = async (value) => {
    onChangeHandler(generateEventTargetObject(WORKHALL_API_STRINGS.CHOOSE_CREDENTIAL.ID, value));
  };

  const chooseFlowDatalist = () => {
    if (isFlowApi) {
      return (
        <SingleDropdown
          id={WORKHALL_API_STRINGS.CHOOSE_FLOW.ID}
          dropdownViewProps={{
            labelName: WORKHALL_API_STRINGS.CHOOSE_FLOW.LABEL,
            onClick: loadInitialFlowList,
            onKeyDown: loadInitialFlowList,
            selectedLabel: flow_name,
          }}
          required
          optionList={cloneDeep(allFlowsList)}
          className={gClasses.MB16}
          onClick={onDropdownChangeHandler}
          selectedValue={flow_uuid}
          errorMessage={error_list?.[WORKHALL_API_STRINGS.CHOOSE_FLOW.ID]}
          isLoadingOptions={isAllFlowListLoading}
          infiniteScrollProps={{
            dataLength: allFlowsList?.length,
            next: loadMoreFlows,
            hasMore: hasMoreFlows,
            scrollableId: CHOOSE_FLOW_SCROLLABLE_ID,
            scrollThreshold: CHOOSE_FLOW_SCROLLABLE_THRESHOLD,
          }}
          searchProps={{
            searchPlaceholder: WORKHALL_API_STRINGS.CHOOSE_FLOW.SEARCH,
            searchValue: flowSearchText,
            onChangeSearch: onFlowSearchChange,
          }}
        />
      );
    } else {
      return (
        <SingleDropdown
          id={WORKHALL_API_STRINGS.CHOOSE_DATA_LIST.ID}
          dropdownViewProps={{
            labelName: WORKHALL_API_STRINGS.CHOOSE_DATA_LIST.LABEL,
            onClick: loadInitialDataList,
            onKeyDown: loadInitialDataList,
            selectedLabel: data_list_name,
          }}
          required
          optionList={allDataLists}
          className={gClasses.MB16}
          onClick={onDropdownChangeHandler}
          selectedValue={data_list_uuid}
          errorMessage={error_list?.[WORKHALL_API_STRINGS.CHOOSE_DATA_LIST.ID]}
          isLoadingOptions={isAllDataListLoading}
          infiniteScrollProps={{
            dataLength: allDataLists.length || dropdownOptionSize,
            next: loadMoreDataLists,
            hasMore: hasMoreDataLists,
            scrollableId: WORKHALL_API_STRINGS.CHOOSE_DATA_LIST.SCROLLABLE_ID,
          }}
          searchProps={{
            searchPlaceholder: WORKHALL_API_STRINGS.CHOOSE_DATA_LIST.SEARCH,
            searchValue: sourceSearchText,
            onChangeSearch: onDataListSearchChange,
          }}
        />
      );
    }
  };

  const getApiComponent = () => {
    if (authentication_type === WORKHALL_AUTH_TYPE.OAUTH) {
      let credEror;
      if (!isEmpty(disabledCredList)) {
        credEror = getDisabledCredError(disabledCredList, selected_authentication_list);
      } else credEror = error_list?.[WORKHALL_API_STRINGS.CHOOSE_CREDENTIAL.ID];
      const masterList = [...(selected_authentication_list || []), ...(credentialsList || [])];
      return (
        <MultiDropdown
          id={WORKHALL_API_STRINGS.CHOOSE_CREDENTIAL.ID}
          dropdownViewProps={{
            labelName: WORKHALL_API_STRINGS.CHOOSE_CREDENTIAL.LABEL,
            onClick: loadInitialCredentialsData,
            onKeyDown: loadInitialCredentialsData,
            selectedLabel: getMultiDropdownValue(selected_authentication_list || []),
            errorMessage: credEror,
          }}
          required
          optionList={uniqBy(masterList, (cred) => cred._id)}
          className={gClasses.MB16}
          selectedListValue={authentication_id}
          onClick={onCredentialsListChange}
          infiniteScrollProps={{
            dataLength: credentialsList.length || dropdownOptionSize,
            next: loadMoreCredentials,
            hasMore: hasMoreCredentials,
            scrollableId: WORKHALL_API_STRINGS.CHOOSE_CREDENTIAL.SCROLLABLE_ID,
          }}
          isLoadingOptions={isLoadingCredentialsList}
        />
      );
    } else if (authentication_type === WORKHALL_AUTH_TYPE.API_KEY) {
      return (
        <UserPicker
          id={WORKHALL_API_STRINGS.CHOOSE_CREDENTIAL.ID}
          labelText={WORKHALL_API_STRINGS.CHOOSE_CREDENTIAL.CHOOSE_USER_LABEL}
          isSearchable
          className={gClasses.MB16}
          selectedValue={{ users: selected_authentication_list, teams: [] }}
          isLoadingList
          maxCountLimit={3}
          onSelect={onSelectUser}
          errorMessage={error_list[WORKHALL_API_STRINGS.CHOOSE_CREDENTIAL.ID]}
          labelClassName={gClasses.FTwo12BlackV20}
          onRemove={onRemoveUser}
          required
          allowedUserType={[ROLES.ADMIN, ROLES.FLOW_CREATOR]}
          noDataFoundMessage={WORKHALL_API_STRINGS.NO_USER_FOUND}
          // colorScheme={isBasicUserMode(history) && colorScheme}
          cancelToken={cancelTokenUsers}
          isUsers
        />
      );
    }
    return null;
  };
  const baseUrl = `${workhall_api_method} | ${getAPIConfigBaseUrl(isFlowApi)}`;
  return (
    <div className={BS.W75}>
      <Text
        content={WORKHALL_API_STRINGS.DATA_SOURCES_AND_ENDPOINT}
        size={ETextSize.XL}
        className={cx(gClasses.MB16, styles.SectionTitle)}
      />
      {chooseFlowDatalist()}
      <TextInput
        id={WORKHALL_API_STRINGS.API_URL.ID}
        labelText={WORKHALL_API_STRINGS.API_URL.LABEL}
        placeholder={WORKHALL_API_STRINGS.API_URL.PLACEHOLDER}
        className={cx(gClasses.MB16, gClasses.P0)}
        onChange={onChangeHandler}
        value={url_path}
        required
        errorMessage={error_list?.[WORKHALL_API_STRINGS.API_URL.ID]}
        prefixIcon={
          <div className={styles.CredPreFixText}>
            <Text
              content={baseUrl}
              size={ETextSize.MD}
              className={cx(gClasses.W100, styles.ApiMethod)}
            />
          </div>
        }
        suffixIcon={(
          <>
              <div id={API_URL.TOOLTIP_ID}>
                  <InfoIconCircle />
              </div>
              <Tooltip id={API_URL.TOOLTIP_ID} content={API_URL.ALLOWED_CHAR_TOOLTIP} isCustomToolTip />
          </>
      )}
      />
      <Text
        content={WORKHALL_API_STRINGS.CREDENTIALS}
        size={ETextSize.XL}
        className={cx(gClasses.MB16, styles.SectionTitle)}
      />
      <SingleDropdown
        id={WORKHALL_API_STRINGS.AUTHENTICATION_TYPE.ID}
        dropdownViewProps={{
          labelName: WORKHALL_API_STRINGS.AUTHENTICATION_TYPE.LABEL,
          isRequired: true,
        }}
        required
        optionList={WORKHALL_API_STRINGS.AUTHENTICATION_TYPE.OPTION_LIST}
        className={gClasses.MB16}
        onClick={onDropdownChangeHandler}
        selectedValue={authentication_type}
        errorMessage={error_list?.[WORKHALL_API_STRINGS.AUTHENTICATION_TYPE.ID]}
      />
      {getApiComponent()}
    </div>
  );
}

const mapStateToProps = ({ IntegrationReducer }) => {
  return {
    state: IntegrationReducer,
  };
};

const mapDispatchToProps = {
  integrationDataChange,
  getCredentialsListApi: getCredentialsListApiThunk,
  getAllFlowListApi: getAllFlowListApiThunk,
  getAllDataListApi: getAllDataListApiThunk,
  getInitiationStepActionsApi: getInitiationStepActionsApiThunk,
};

export default connect(mapStateToProps, mapDispatchToProps)(Credentials);
