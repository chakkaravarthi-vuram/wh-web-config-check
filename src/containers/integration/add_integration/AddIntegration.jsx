import React, { useEffect, useState } from 'react';
import cx from 'classnames/bind';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ARIA_ROLES, BS } from 'utils/UIConstants';
import gClasses from 'scss/Typography.module.scss';
import { keydownOrKeypessEnterHandle, validate } from 'utils/UtilityFunctions';
import { integrationDataChange } from 'redux/reducer/IntegrationReducer';
import { cloneDeep, isEmpty, set, get, find, remove } from 'utils/jsUtility';
import {
  getIntegrationTemplatesApiThunk,
  postIntegrationConnectorApiThunk,
} from 'redux/actions/Integration.Action';
import { updatePostLoader } from 'utils/loaderUtils';
import { EMPTY_STRING } from 'utils/strings/CommonStrings';
import HelperMessage, { HELPER_MESSAGE_TYPE } from 'components/form_components/helper_message/HelperMessage';
import queryString from 'query-string';
import { Button, EButtonType, EPopperPlacements, ETextSize, ETitleSize, Modal, ModalSize, ModalStyleType, Radio, RadioSize, SingleDropdown, Text, TextArea, TextInput, Title } from '@workhall-pvt-lmt/wh-ui-library';
import styles from '../Integration.module.scss';
import {
  API_TYPE_OPTIONS,
  INTEGRATION_STRINGS,
  getExternalIntegrationStateData,
  INTEGRATION_API_OPTIONS,
  getDeactivatedAdminsError,
} from '../Integration.utils';
import { basicDetailsIntegrationSchema, commonIntegrationDetailsSchema } from '../Integration.validation.schema';
import IntegrationDropdown from '../integration_dropdown/IntegrationDropdown';
import { CREATE_INTEGRATION, CUSTOM_INTEGRATION } from '../Integration.strings';
import CloseVectorIcon from '../../../assets/icons/create_app/create_modal/CloseVectorIcon';
import { saveDBConnectorPostApiThunk, workhallApiConfigurationPostApiThunk } from '../../../redux/actions/Integration.Action';
import { CancelToken, getUserProfileData, routeNavigate } from '../../../utils/UtilityFunctions';
import ApiIcon from '../../../assets/icons/integration/ApiIcon';
import { INTEGRATION_DETAILS_INIT_DATA } from '../../../redux/reducer/IntegrationReducer';
import { INTEGRATION_CONSTANTS } from '../Integration.constants';
import ReadOnlyField from '../../../components/readonly_field/ReadOnlyField';
import { generateEventTargetObject } from '../../../utils/generatorUtils';
import { constructJoiObject } from '../../../utils/ValidationConstants';
import { EDIT_INTEGRATION, EXTERNAL_DB_CONNECTION, EXTERNAL_INTEGRATION, INTEGRATIONS, WORKHALL_INTEGRATION } from '../../../urls/RouteConstants';
import { NON_PRIVATE_TEAM_TYPES, ROLES, ROUTE_METHOD } from '../../../utils/Constants';
import UserPicker from '../../../components/user_picker/UserPicker';

const cancelTokenUsers = new CancelToken();

function AddIntegration(props) {
  const {
    isModalOpen,
    state,
    state: {
      error_list = {},
      integrationsTemplates = [],
      selected_template_details = {},
      hasMoreTemplates,
      isLoadingIntegrationsTemplates,
      remainingTemplatesCount,
      currentTemplatesPage,
      templateSearhText,
      workhall_api_type,
      disabledAdminTeams,
      disabledAdminUsers,
    },
    integrationDataChange,
    postIntegrationConnectorApi,
    getIntegrationTemplatesApi,
    admins = {},
    api_type,
    isFromEditPage,
  } = cloneDeep(props);
  const { t } = useTranslation();
  console.log(selected_template_details, 'jkhjkhkhkhjk', state);
  const [perPageCount] = useState(7);
  const [isIntegrationContainerOpen, setIntegrationContainerOpen] = useState(false);

  const { ADD_INTEGRATION } = INTEGRATION_STRINGS;
  const { CUSTOM, NO_USER_OR_TEAM_FOUND } = CREATE_INTEGRATION;

  const [localState, setLocalState] = useState({
    [ADD_INTEGRATION.INTEGRATION_NAME.ID]: state?.name,
    [ADD_INTEGRATION.INTEGRATION_DESCRIPTION.ID]: state?.description,
    [CREATE_INTEGRATION.ADMINS.ID]: state?.admins,
    disabledAdminTeams: disabledAdminTeams,
    disabledAdminUsers: disabledAdminUsers,
  });

  const history = useHistory();
  const isApiConfig = (api_type === INTEGRATION_CONSTANTS.API_TYPE.WORKHALL);

  const adminsList = isFromEditPage ? localState?.admins : admins;

  useEffect(() => {
    if (isFromEditPage) {
      setLocalState({
        ...localState,
        [CREATE_INTEGRATION.ADMINS.ID]: state?.admins,
      });
    }
  }, [admins?.users?.length, admins?.teams?.length]);

  const onChangeHandler = (event, isOnBlur) => {
    let { value } = event.target;
    const { id } = event.target;
    let errorData = {};
    let errorList = cloneDeep(error_list) || {};
    const disabledAdminTeamsCopy = cloneDeep(localState?.disabledAdminTeams);
    const disabledAdminUsersCopy = cloneDeep(localState?.disabledAdminUsers);
    if (id === CREATE_INTEGRATION.ADMINS.ID) {
      const { admins } = isFromEditPage ? cloneDeep(localState) || { admins: { users: [], teams: [] } } : cloneDeep(state) || { admins: { users: [], teams: [] } };
      if (event?.target?.removeUserOrTeam) {
        if (!isEmpty(admins?.teams) && find(admins.teams, { _id: value })) {
          remove(admins.teams, { _id: value });
          remove(disabledAdminTeamsCopy, { _id: value });
        } else if (!isEmpty(admins?.users) && find(admins.users, { _id: value })) {
          remove(admins.users, { _id: value });
          remove(disabledAdminUsersCopy, { _id: value });
        }
      } else {
        console.log(find(admins.users, { _id: value }), value, 'sjkfhdjkshjsdhkh');
        const selectedOption = event?.target?.option;
        if (selectedOption?.is_user) {
          if (isEmpty(admins?.users)) {
            admins.users = [selectedOption];
          } else if (isEmpty(find(admins.users, { _id: value }))) {
            admins.users.push(selectedOption);
          }
        } else {
          if (isEmpty(admins?.teams)) {
            admins.teams = [selectedOption];
          } else if (isEmpty(find(admins.teams, { _id: value }))) {
            admins.teams.push(selectedOption);
          }
        }
      }
      value = admins;
    } else if (isOnBlur) {
      value = (value || EMPTY_STRING).trim();
    }
    const data = {
      [id]: value,
    };
    if (errorList?.[id] || isOnBlur) {
      errorData = validate(
        data,
        constructJoiObject({
          [id]: commonIntegrationDetailsSchema(t, api_type)?.[id],
        }),
      );
      if (isEmpty(errorData)) {
        delete errorList[id];
      } else {
        errorList = {
          ...errorList,
          ...errorData,
        };
      }
    }
    if (isFromEditPage) {
      setLocalState({
        ...localState,
        ...data,
        disabledAdminUsers: disabledAdminUsersCopy,
        disabledAdminTeams: disabledAdminTeamsCopy,
      });
      integrationDataChange({
        error_list: errorList,
      });
    } else {
      integrationDataChange({
        ...data,
        error_list: errorList,
        disabledAdminUsers: disabledAdminUsersCopy,
        disabledAdminTeams: disabledAdminTeamsCopy,
      });
    }
  };
  const onBlurHandler = (event) => onChangeHandler(event, true);
  const handleCloseClick = () => {
    if (isFromEditPage) {
      integrationDataChange({ isBasicDetailsModalOpen: false });
    } else {
      integrationDataChange({ ...INTEGRATION_DETAILS_INIT_DATA });
      const currentParams = get(queryString.parseUrl(history.location.pathname), ['query'], {});
      delete currentParams.create;
      const addIntegrationState = { createModalOpen: false };
      const addIntegrationSearchParams = new URLSearchParams(currentParams).toString();
      routeNavigate(history, ROUTE_METHOD.PUSH, EMPTY_STRING, addIntegrationSearchParams, addIntegrationState);
      integrationDataChange({ isBasicDetailsModalOpen: false });
    }
  };

  const handleSubmitClick = async () => {
    const appAdmins = {};
    const adminsList = isFromEditPage ? localState?.admins : admins;

    if (adminsList?.teams?.length > 0) {
      appAdmins.teams = adminsList?.teams?.map((team) => team._id);
    }
    if (adminsList?.users?.length > 0) {
      appAdmins.users = adminsList?.users?.map((user) => user._id);
    }
    let data = {};

    if (isFromEditPage) {
      data = {
        selected_connector_name: selected_template_details?.name,
        name: localState?.name,
        description: localState?.description,
        admins: appAdmins,
        api_type,
        workhall_api_type,
      };
    } else {
      data = {
        selected_connector_name: selected_template_details?.name,
        name: state?.name,
        description: state?.description,
        admins: appAdmins,
        api_type,
        workhall_api_type,
      };
    }

    const current_error_list = validate(
      data,
      basicDetailsIntegrationSchema(t, api_type),
    );
    if (isEmpty(current_error_list) && isEmpty(localState?.disabledAdminTeams) && isEmpty(localState?.disabledAdminUsers)) {
      if (api_type === INTEGRATION_CONSTANTS.API_TYPE.WORKHALL) {
        if (state?._id) {
          set(data, '_id', state?._id);
          set(data, 'api_configuration_uuid', state?.api_configuration_uuid);
        }
        set(data, 'type', workhall_api_type);
      } else if (api_type === INTEGRATION_CONSTANTS.API_TYPE.EXTERNAL) {
        if (state?.template_id) {
          set(data, 'template_id', state?.template_id);
        }
        if (state?._id) {
          set(data, '_id', state?._id);
          set(data, 'connector_uuid', state?.connector_uuid);
        }
        data.connector_name = data?.name;
        delete data?.name;
      } else if (api_type === INTEGRATION_CONSTANTS.API_TYPE.DB_CONNECTION) {
        if (state?._id) {
          set(data, '_id', state?._id);
          set(data, 'db_connector_uuid', state?.connector_uuid);
        }
        data.db_connector_name = data?.name;
        delete data?.name;
        delete data?.admins;
      }
      if (isEmpty(data?.description)) {
        delete data?.description;
      }
      delete data?.selected_connector_name;
      delete data.workhall_api_type;
      delete data.api_type;
      try {
        let responseData = {};
        let redirectUrl = null;
        if (api_type === INTEGRATION_CONSTANTS.API_TYPE.WORKHALL) {
          const { workhallApiConfigurationPostApi } = props;
          responseData = await workhallApiConfigurationPostApi(data, isFromEditPage);
          redirectUrl = `${INTEGRATIONS}/${WORKHALL_INTEGRATION}/${responseData?.api_configuration_uuid}/${EDIT_INTEGRATION}`;
        } else if (api_type === INTEGRATION_CONSTANTS.API_TYPE.EXTERNAL) {
          responseData = await postIntegrationConnectorApi(data, null, isFromEditPage);
          redirectUrl = `${INTEGRATIONS}/${EXTERNAL_INTEGRATION}/${responseData?.connector_uuid}/${EDIT_INTEGRATION}`;
        } else if (api_type === INTEGRATION_CONSTANTS.API_TYPE.DB_CONNECTION) {
          const { saveDBConnectorPostApi } = props;
          responseData = await saveDBConnectorPostApi(data, t);
          redirectUrl = `${INTEGRATIONS}/${EXTERNAL_DB_CONNECTION}/${responseData?.db_connector_uuid}/${EDIT_INTEGRATION}`;
        }
        updatePostLoader(false);
        integrationDataChange({ isBasicDetailsModalOpen: false });
        if (!isFromEditPage) {
          routeNavigate(history, ROUTE_METHOD.REPLACE, redirectUrl);
        } else {
          integrationDataChange({
            ...localState,
          });
        }
      } catch (e) {
        console.log(e, 'save failed in integration');
      }

      return null;
    }
    integrationDataChange({
      error_list: {
        ...error_list,
        ...current_error_list,
      },
    });
    return null;
  };

  const getInitialAdmins = () => {
    const userProfileData = getUserProfileData();
    const initialAdmins = {
      users: [{
        noDelete: true, // To restrict deleting the current user added as default admin
        _id: userProfileData?.id,
        username: userProfileData?.user_name,
        first_name: userProfileData?.first_name,
        last_name: userProfileData?.last_name,
        email: userProfileData?.email,
        is_active: true,
        is_user: true,
        label: userProfileData?.full_name,
        name: userProfileData?.full_name,
        id: userProfileData?.id,
      }],
      teams: [],
    };
    console.log('getInitialAdmins', initialAdmins);
    return initialAdmins;
  };

  useEffect(() => {
    if (!isFromEditPage) {
      integrationDataChange({
        admins: getInitialAdmins(),
        api_type: EMPTY_STRING,
      });
    }
    return () => {
      setLocalState({});
    };
  }, []);

  useEffect(() => {
    if (!isApiConfig && api_type !== INTEGRATION_CONSTANTS.API_TYPE.DB_CONNECTION && isEmpty(integrationsTemplates) && !isLoadingIntegrationsTemplates) {
      getIntegrationTemplatesApi({ page: 1, size: perPageCount }, true);
    }
  }, [api_type]);

  const chooseIntegeration = (integration) => {
    const clonedErrorList = cloneDeep(error_list);

    delete clonedErrorList?.selected_connector_name;

    if (!isEmpty(clonedErrorList)) {
      if (!isEmpty(clonedErrorList?.name)) delete clonedErrorList.name;
      if (!isEmpty(clonedErrorList?.description)) delete clonedErrorList.description;
      if (!isEmpty(clonedErrorList?.selected_connector_name)) delete clonedErrorList?.selected_connector_name;
    }

    integrationDataChange({
      ...getExternalIntegrationStateData(integration),
      isExternalIntegration: true,
      error_list: clonedErrorList,
    });
    setIntegrationContainerOpen(false);
  };

  const handleAddCustomIntegration = () => {
    const clonedState = cloneDeep(state);
    const { error_list } = clonedState;

    if (!isEmpty(error_list)) {
      if (!isEmpty(error_list?.name)) delete error_list.name;
      if (!isEmpty(error_list?.description)) delete error_list.description;
      if (!isEmpty(error_list?.selected_connector_name)) delete error_list?.selected_connector_name;
    }

    set(clonedState, 'name', null);
    set(clonedState, 'description', null);
    set(clonedState, 'template_id', null);

    integrationDataChange({
      ...clonedState,
      isExternalIntegration: false,
      name: EMPTY_STRING,
      selected_template_details: {
        name: CUSTOM,
      },
      error_list,
    });

    setIntegrationContainerOpen(false);
  };

  const onDropdownBlurHandler = () => {
    const params = {
      page: 1,
      size: perPageCount,
    };

    getIntegrationTemplatesApi(params, true);

    integrationDataChange({
      templateSearhText: EMPTY_STRING,
    });
  };

  const handleSearchIntegration = (e) => {
    const params = {
      page: 1,
      size: perPageCount,
    };

    if (!isEmpty(e.target.value)) params.search = e.target.value;

    getIntegrationTemplatesApi(params, true);

    integrationDataChange({
      templateSearhText: e.target.value,
    });
  };

  const onLoadMoreCallHandler = () => {
    const params = {
      page: currentTemplatesPage + 1,
      size: perPageCount,
    };

    if (!isEmpty(templateSearhText)) params.search = templateSearhText;

    if (remainingTemplatesCount && !isLoadingIntegrationsTemplates) {
      getIntegrationTemplatesApi(
        params,
        false,
      );
    }
  };

  const addCustomElem = (
    <div
      role="button"
      tabIndex={0}
      className={cx(BS.W100, styles.CustomIntegration)}
      onKeyDown={(e) =>
        keydownOrKeypessEnterHandle(e) && handleAddCustomIntegration()
      }
      onClick={handleAddCustomIntegration}
    >
      <div className={BS.D_FLEX}>
        <div className={cx(BS.D_FLEX, styles.ApiInfo)}>
          <div className={cx(gClasses.MR20, gClasses.CenterV)}>
            <ApiIcon className={styles.CustomApiIcon} />
          </div>
          <div>
            <Text
              content={CUSTOM_INTEGRATION.DROPDOWN_LABEL}
              size={ETextSize.MD}
              className={cx(gClasses.FontWeight500, styles.TextLeft, gClasses.MT5)}
            />
            <Text
              content={CUSTOM_INTEGRATION.DESCRIPTION}
              size={ETextSize.MD}
              className={cx(styles.ApiSubtitle, styles.TextLeft)}
            />
          </div>
        </div>
      </div>
    </div>
  );

  const onApiTypeSelect = (value) => {
    console.log('onApiTypeSelectValue', value);
    integrationDataChange({
      api_type: value,
    });
  };

  const headerContent = (
    <div className={cx(gClasses.CenterV, BS.JC_END, BS.W100, isFromEditPage ? styles.AddHeader : styles.CreateHeader)}>
      <button
        className={cx(gClasses.CenterV)}
        onClick={handleCloseClick}
      >
        <CloseVectorIcon />
      </button>
    </div>
  );

  const onChangeApiType = () => {
    integrationDataChange({
      ...INTEGRATION_DETAILS_INIT_DATA,
      admins: getInitialAdmins(),
    });
  };

  const apiTypeList = [];

  API_TYPE_OPTIONS.forEach((option) => {
    if (isEmpty(api_type) || (option.id === api_type)) {
      apiTypeList.push(
        <button
          className={cx(gClasses.P16, gClasses.MB16, styles.ChooseApi, !isEmpty(api_type) && styles.DefaultCursor, isFromEditPage && styles.ReadOnlyButton)}
          onClick={() => isEmpty(api_type) && onApiTypeSelect(option.id)}
        >
          <div className={cx(gClasses.CenterV)}>
            <div className={cx(BS.D_FLEX, styles.ApiInfo)}>
              <div className={cx(gClasses.MR12, styles.WorkhallIcon, gClasses.CenterVH)}>
                {option.icon}
              </div>
              <div>
                <Text
                  content={option.label}
                  size={ETextSize.MD}
                  className={cx(gClasses.FontWeight500, styles.TextLeft)}
                />
                <Text
                  content={option.description}
                  size={ETextSize.MD}
                  className={cx(styles.ApiSubtitle, styles.TextLeft)}
                />
              </div>
            </div>
            {
              isEmpty(api_type) ? (
                <Radio
                  id={option.id}
                  size={RadioSize.md}
                />
              ) : (
                <button className={styles.ButtonLink} onClick={onChangeApiType}>
                  {CREATE_INTEGRATION.CHANGE_BUTTON}
                </button>
              )
            }
          </div>
        </button>,
      );
    }
  });

  const adminUserPicker = api_type !== INTEGRATION_CONSTANTS.API_TYPE.DB_CONNECTION && (
    <UserPicker
      id={CREATE_INTEGRATION.ADMINS.ID}
      labelText={CREATE_INTEGRATION.CHOOSE_ADMINS}
      isSearchable
      className={gClasses.MB16}
      selectedValue={adminsList}
      maxCountLimit={3}
      onSelect={(option) => {
        const changeEvent = {
          target: {
            option: option,
            value: option._id,
            id: CREATE_INTEGRATION.ADMINS.ID,
          },
        };
        onChangeHandler(changeEvent);
      }}
      errorMessage={getDeactivatedAdminsError(localState?.disabledAdminUsers, localState?.disabledAdminTeams) || error_list[CREATE_INTEGRATION.ADMINS.ID]}
      onRemove={(removeUserOrTeamId) => {
        const removeEvent = {
          target: {
            value: removeUserOrTeamId,
            removeUserOrTeam: true,
            id: CREATE_INTEGRATION.ADMINS.ID,
          },
        };
        onChangeHandler(removeEvent);
      }}
      required
      noDataFoundMessage={NO_USER_OR_TEAM_FOUND}
      // colorScheme={isBasicUserMode(history) && colorScheme}
      cancelToken={cancelTokenUsers}
      remainingUsersPopperPlacement={EPopperPlacements.TOP_START}
      allowedUserType={[ROLES.ADMIN, ROLES.FLOW_CREATOR]}
      allowedTeamType={NON_PRIVATE_TEAM_TYPES}
    />
  );

  let title = null;
  const subHeader = null;
  let integrationTypeComponent = null;
  let nameAndSecurity = null;
  let titleClass = null;
  let templateOrApiComponent = null;
  let nameDetails = {};
  switch (api_type) {
    case INTEGRATION_CONSTANTS.API_TYPE.WORKHALL:
    nameDetails = {
      label: CREATE_INTEGRATION.API_NAME.LABEL,
      placeholder: CREATE_INTEGRATION.WORKHALL_API_NAME_PLACEHOLDER,
    };
    break;
    case INTEGRATION_CONSTANTS.API_TYPE.EXTERNAL:
    nameDetails = {
      label: CREATE_INTEGRATION.CONNECTOR_NAME_LABEL,
      placeholder: CREATE_INTEGRATION.EXTERNAL_API_CONNECTOR_NAME_PLACEHOLDER,
    };
    break;
    case INTEGRATION_CONSTANTS.API_TYPE.DB_CONNECTION:
      nameDetails = {
        label: CREATE_INTEGRATION.DB_CONNECTION_NAME_LABEL,
        placeholder: CREATE_INTEGRATION.EXTERNAL_DB_CONNECTION_NAME_PLACEHOLDER,
      };
      break;
    default:
      break;
  }
  if (api_type && (!isEmpty(selected_template_details) || (isApiConfig) || api_type === INTEGRATION_CONSTANTS.API_TYPE.DB_CONNECTION)) {
    nameAndSecurity = (
      <div className={BS.TEXT_LEFT}>
        <TextInput
          labelText={nameDetails.label}
          onChange={onChangeHandler}
          id={ADD_INTEGRATION.INTEGRATION_NAME.ID}
          placeholder={nameDetails.placeholder}
          className={cx(gClasses.MB16)}
          labelClassName={styles.AddLabel}
          errorMessage={error_list[ADD_INTEGRATION.INTEGRATION_NAME.ID]}
          value={isFromEditPage ? localState[ADD_INTEGRATION.INTEGRATION_NAME.ID] : state[ADD_INTEGRATION.INTEGRATION_NAME.ID]}
          onBlurHandler={onBlurHandler}
          required
        />
        <TextArea
          labelText={CREATE_INTEGRATION.DESCRIPTION}
          labelClassName={styles.AddLabel}
          id={ADD_INTEGRATION.INTEGRATION_DESCRIPTION.ID}
          placeholder={CREATE_INTEGRATION.DESCRIPTION_PLACEHOLDER}
          value={isFromEditPage ? localState[ADD_INTEGRATION.INTEGRATION_DESCRIPTION.ID] : state[ADD_INTEGRATION.INTEGRATION_DESCRIPTION.ID]}
          onChange={onChangeHandler}
          className={styles.IntegrationDescription}
          errorMessage={error_list[ADD_INTEGRATION.INTEGRATION_DESCRIPTION.ID]}
          inputInnerClassName={styles.AddDescription}
        />
        {adminUserPicker}
        {!isFromEditPage &&
          <div className={cx(gClasses.CenterV, BS.JC_END)}>
            <Button
              buttonText={CREATE_INTEGRATION.CANCEL_BUTTON}
              noBorder
              className={cx(gClasses.MR24, gClasses.FontWeight500, styles.CancelButton)}
              onClickHandler={handleCloseClick}
            />
            <Button
              type={EButtonType.PRIMARY}
              buttonText={CREATE_INTEGRATION.NEXT_BUTTON}
              onClickHandler={handleSubmitClick}
            />
          </div>
        }
      </div>
    );
  }

  const footerContent = api_type && (!isEmpty(selected_template_details) || (isApiConfig) || api_type === INTEGRATION_CONSTANTS.API_TYPE.DB_CONNECTION) && (
    <div className={cx(gClasses.CenterV, BS.JC_END, styles.EditFooter)}>
      <Button
        type={EButtonType.PRIMARY}
        buttonText={CREATE_INTEGRATION.SAVE}
        onClickHandler={handleSubmitClick}
      />
    </div>
  );

  if (isFromEditPage) {
    let selectedApiType = null;
    if (workhall_api_type) {
      selectedApiType = INTEGRATION_API_OPTIONS.find((option) => option.value === workhall_api_type) || {};
    }
    title = CREATE_INTEGRATION.EDIT_NAME_AND_SECURITY;
    titleClass = cx(gClasses.MB24, styles.EditNameLabel);
    integrationTypeComponent = (
      <>
        <Text
          content={CREATE_INTEGRATION.INTEGRATION_TYPE}
          className={cx(styles.AddLabel, gClasses.MB8)}
          size={ETextSize.SM}
        />
        {apiTypeList}
      </>
    );
    if (api_type && api_type !== INTEGRATION_CONSTANTS.API_TYPE.DB_CONNECTION) {
      if (isApiConfig) {
        templateOrApiComponent = (
          <ReadOnlyField
            title={CREATE_INTEGRATION.API_TYPE.READ_ONLY_LABEL}
            subTitle={selectedApiType?.label}
          />
        );
      } else {
        templateOrApiComponent = (
          <ReadOnlyField
            title={CREATE_INTEGRATION.TEMPLATE_TYPE}
            subTitle={selected_template_details?.name}
          />
        );
      }
    }
  } else {
    title = CREATE_INTEGRATION.TITLE;
    titleClass = styles.CreateTitle;
    integrationTypeComponent = (
      <>
        <Title
          content={CREATE_INTEGRATION.INTEGRATION_TYPE_TITLE}
          size={ETitleSize.xs}
          className={gClasses.MB16}
        />
        {apiTypeList}
      </>
    );

    const chooseWorkhallAPI = (event, isCustomDropdownOpen) => {
      onChangeHandler(event);
      if (isCustomDropdownOpen) isCustomDropdownOpen(false);
    };

    if (api_type === INTEGRATION_CONSTANTS.API_TYPE.WORKHALL) {
        templateOrApiComponent = (
          <SingleDropdown
            id={CREATE_INTEGRATION.API_TYPE.ID}
            dropdownViewProps={{
              labelName: CREATE_INTEGRATION.API_TYPE.LABEL,
              isRequired: true,
            }}
            optionList={cloneDeep(INTEGRATION_API_OPTIONS)}
            className={gClasses.MB16}
            selectedValue={workhall_api_type}
            errorMessage={error_list?.[CREATE_INTEGRATION.API_TYPE.ID]}
            customDropdownListView={
              (option, isCustomDropdownOpen) => (
                <button
                  className={cx(styles.ApiTypeOption, gClasses.CenterV, BS.JC_BETWEEN, BS.W100)}
                  onClick={() => chooseWorkhallAPI(
                    generateEventTargetObject(
                      CREATE_INTEGRATION.API_TYPE.ID,
                      option.value,
                    ),
                    isCustomDropdownOpen,
                  )}
                >
                  <div className={cx(gClasses.LeftV, gClasses.FlexDirectionColumn)}>
                    <Text className={cx(gClasses.FTwo13GrayV3, gClasses.FontWeight500)} content={option.label} />
                    <Text className={cx(styles.OptionDesc)} content={option.description} />
                  </div>
                  <div className={cx(styles.MethodType)}>{option.method}</div>
                </button>
              )
            }
          />
        );
    } else if (api_type === INTEGRATION_CONSTANTS.API_TYPE.EXTERNAL) {
        templateOrApiComponent = (
          <>
            <Text
              content={CREATE_INTEGRATION.CHOOSE_CONNECTOR_LABEL}
              size={ETextSize.SM}
              className={cx(styles.AddLabel)}
            />
            <div className={BS.TEXT_CENTER}>
              <IntegrationDropdown
                integerationList={integrationsTemplates}
                integration_details={selected_template_details}
                getIntegrationConnectorApi={() => { }}
                chooseAppError={error_list?.selected_connector_name}
                chooseIntegeration={chooseIntegeration}
                isIntegrationContainerOpen={isIntegrationContainerOpen}
                setIntegrationContainerOpen={setIntegrationContainerOpen}
                className={cx(styles.DropdownContainer, isEmpty(error_list?.selected_connector_name) ? gClasses.MB16 : gClasses.MB4)}
                customPopperElement={addCustomElem}
                hasMore={hasMoreTemplates}
                onLoadMoreHandler={onLoadMoreCallHandler}
                onInputChange={handleSearchIntegration}
                onCloseClick={onDropdownBlurHandler}
                searchIntegrationText={templateSearhText}
                isInfiniteScrollList
              />
            </div>
            {
              !isEmpty(error_list?.selected_connector_name) && (
                <HelperMessage
                  message={error_list?.selected_connector_name}
                  type={HELPER_MESSAGE_TYPE.ERROR}
                  className={gClasses.MB15}
                  noMarginBottom
                  role={ARIA_ROLES.ALERT}
                />
              )
            }
          </>
        );
    }
  }

  const modalContent = (
    <div className={styles.AddIntegrationMain}>
      <Text
        className={cx(!isFromEditPage && gClasses.TextAlignCenter, titleClass)}
        content={title}
        size={ETextSize.XL2}
      />
      {subHeader}
      {integrationTypeComponent}
      {templateOrApiComponent}
      {nameAndSecurity}
    </div>
  );

  return (
    <div>
      <Modal
        id={ADD_INTEGRATION.ID}
        modalStyle={ModalStyleType.modal}
        modalSize={isFromEditPage ? ModalSize.md : ModalSize.full}
        className={gClasses.CursorAuto}
        isModalOpen={isModalOpen}
        mainContentClassName={cx(isFromEditPage ? styles.EditModalMain : styles.AddIntegrationModal, gClasses.CenterH)}
        customModalClass={cx(isFromEditPage ? styles.EditPageModal : gClasses.PB24)}
        headerContent={headerContent}
        mainContent={modalContent}
        footerContent={isFromEditPage && footerContent}
        enableEscClickClose
        onCloseClick={handleCloseClick}
      />
    </div>
  );
}

const mapStateToProps = ({
  IntegrationReducer,
}) => {
  return {
    state: IntegrationReducer,
    api_type: IntegrationReducer.api_type,
    admins: IntegrationReducer.admins,
    usersAndTeamsData: IntegrationReducer.usersAndTeamsData,
  };
};

const mapDispatchToProps = {
  integrationDataChange,
  postIntegrationConnectorApi: postIntegrationConnectorApiThunk,
  getIntegrationTemplatesApi: getIntegrationTemplatesApiThunk,
  workhallApiConfigurationPostApi: workhallApiConfigurationPostApiThunk,
  saveDBConnectorPostApi: saveDBConnectorPostApiThunk,
};

export default connect(mapStateToProps, mapDispatchToProps)(AddIntegration);
