import React, { useState, useEffect } from 'react';
import cx from 'classnames/bind';
import { connect } from 'react-redux';
import {
  AUTHENTICATION_TYPE_CONSTANTS,
  AUTHORIZATION_STATUS,
  INTEGRATION_STRINGS,
  authorizeAppInNewWindow,
  getAuthValidationData,
} from 'containers/integration/Integration.utils';
import { useTranslation } from 'react-i18next';
import gClasses from 'scss/Typography.module.scss';
import { integrationDataChange } from 'redux/reducer/IntegrationReducer';
import { cloneDeep, get, isEmpty } from 'utils/jsUtility';
import MappingTable from 'containers/integration/mapping_table/MappingTable';
import { EMPTY_STRING } from 'utils/strings/CommonStrings';
import { validate } from 'utils/joiUtils';
import { verifyOauthSchema } from 'containers/integration/Integration.validation.schema';
import { verifyOAuth2CredentialsThunk } from 'redux/actions/Integration.Action';
import { AUTHORIZE_APP } from 'urls/RouteConstants';
import { FEATURE_INTEGRATION_STRINGS } from 'containers/integration/Integration.strings';
import { Button, EButtonSizeType, ETextSize, SingleDropdown, Text, TextInput } from '@workhall-pvt-lmt/wh-ui-library';
import BasicAuth from './basic/BasicAuth';
import styles from './Authentication.module.scss';
import { generateEventTargetObject } from '../../../../utils/generatorUtils';
import Trash from '../../../../assets/icons/application/Trash';
import { getCodeChallengeAndVerifier, isAllRowsDeleted } from '../../Integration.utils';
import { constructJoiObject } from '../../../../utils/ValidationConstants';
import { baseUrlSchema } from '../../Integration.validation.schema';
import { enryptAesEncryptionData } from '../../../../utils/encryptionUtils';

function Authentication(props) {
  const {
    authentication = {},
    error_list = {},
    integrationDataChange,
    base_url,
    headers = [],
    query_params = [],
    state: { isExternalIntegration, selected_template_details = {}, isIntegrationTemplateLoading },
    isEditView,
  } = cloneDeep(props);
  const { t } = useTranslation();

  const { AUTHENTICATION, HEADERS, QUERY_PARAMS, ADD_MORE, ADD_HEADER, ADD_QUERY_PARAMATER } = INTEGRATION_STRINGS;
  const { DUPLICATE_KEY_ERROR } = FEATURE_INTEGRATION_STRINGS;
  const [externalPopup, setExternalPopup] = useState(null);
  const [isVerifyAuthAPIInProgress, setVerifyAuthAPIStatus] = useState(false);
  const [authenticationMethodOptionList] = useState(cloneDeep(AUTHENTICATION.AUTHENTICATION_METHOD.OPTIONS));
  const [verifierAndChallenge, setVerifierAndChallenge] = useState({});
  const verifyCredentials = (code = null) => {
    const { verifyOAuth2Credentials, connector_id } = props;
    const { client_id, client_secret, scope, token_request_url } =
      authentication;
    const encryptionDetails = JSON.parse(
      localStorage.getItem('encryption_details'),
    );
    const clientData = {
      client_id,
      client_secret,
    };
    const clientCredPostData = process.env.REACT_APP_ENCRYPTION_ENABLED === '1' ? {
      request_enc_data: enryptAesEncryptionData(
      clientData,
      encryptionDetails.aes_key,
    ),
      } : clientData;
    const auth = {
      ...clientCredPostData,
      token_request_url,
      type: authentication?.type,
    };

    if (!isEmpty(scope)) auth.scope = scope;

    if (
      authentication?.type === AUTHENTICATION_TYPE_CONSTANTS.OAUTH_AUTH_CODE
    ) {
      const { redirect_uri } = authentication;
      auth.redirect_uri = redirect_uri;
      auth.code = code;
      auth.is_pkce = authentication?.is_pkce;
      if (authentication.is_pkce) {
        auth.code_verifier = verifierAndChallenge.verifier;
      }
    } else if (authentication?.type === AUTHENTICATION_TYPE_CONSTANTS.OAUTH_PASSWORD_GRANT) {
      auth.username = authentication?.username;
      auth.password = authentication?.password;
    }
    console.log(auth, 'verfier and challenge', authentication, verifierAndChallenge);
    verifyOAuth2Credentials({
      ...auth,
      connector_id,
      clientData,
    }, verifierAndChallenge).then(() => {
      setVerifyAuthAPIStatus(false);
    });
  };

  useEffect(() => {
    if (!externalPopup) {
      return;
    }
    const timer = setInterval(() => {
      if (!externalPopup) {
        timer && clearInterval(timer);
        return;
      }
      if (externalPopup && externalPopup.closed) {
        timer && clearInterval(timer);
        if (!isVerifyAuthAPIInProgress) {
          integrationDataChange({
            authentication: {
              ...authentication,
              authorization_status: AUTHORIZATION_STATUS.ABORTED,
            },
          });
        }
        return;
      }
      const currentUrl = externalPopup.location.href;
      if (!currentUrl) {
        return;
      }
      const { searchParams } = new URL(currentUrl);
      const code = searchParams.get('code');
      if (code) {
        setVerifyAuthAPIStatus(true);
        externalPopup.close();
        console.log(`The popup URL has URL code param = ${code}`);
        authentication.code = code;
        integrationDataChange({
          authentication: {
            ...authentication,
            authorization_status: AUTHORIZATION_STATUS.API_IN_PROGRESS,
          },
        });
        verifyCredentials(code);
        setExternalPopup(null);
        timer && clearInterval(timer);
      } else if (searchParams.get('error')) {
        externalPopup.close();
        integrationDataChange({
          authentication: {
            ...authentication,
            authorization_status: AUTHORIZATION_STATUS.FAILURE,
          },
        });
        setExternalPopup(null);
        timer && clearInterval(timer);
      } else {
        // do nothing
      }
    }, 500);
  }, [externalPopup]);

  const onBaseUrlChange = (e, isOnBlur) => {
    const { id, value } = e.target;
    if (isOnBlur || !isEmpty(error_list[id])) {
      const error = validate({ base_url: value }, constructJoiObject(baseUrlSchema(t)));
      if (isEmpty(error?.[id])) delete error_list?.[id];
      else error_list[id] = error?.[id];
    }
    integrationDataChange({
      [id]: value,
      error_list,
    });
  };

  const handleAuthTypeChange = (e) => {
    if (!isEmpty(error_list)) {
      Object.keys(error_list || {}).forEach((errorKey) => {
        if (errorKey.includes('authentication')) delete error_list[errorKey];
      });
    }
    const data = { [e.target.id]: e.target.value };
    if (e.target.value === AUTHENTICATION_TYPE_CONSTANTS.OAUTH_AUTH_CODE) {
      data.redirect_uri = `${window.location.protocol}//${window.location.host}${AUTHORIZE_APP}`;
      data.authorization_status = AUTHORIZATION_STATUS.YET_TO_INITIATE;
      data.is_pkce = false;
    } else if (
      e.target.value === AUTHENTICATION_TYPE_CONSTANTS.OAUTH_CLIENT_CODE
    ) {
      data.authorization_status = AUTHORIZATION_STATUS.YET_TO_INITIATE;
    }
    integrationDataChange({
      authentication: data,
      error_list,
    });
  };

  const handleHeadersChange = (headersParam) => {
    delete error_list[AUTHENTICATION.HEADERS.ID];

    integrationDataChange({
      api_headers: !isAllRowsDeleted(headersParam),
      headers: headersParam,
      error_list,
    });
  };

  const handleQueryParamsChange = (queryParams) => {
    delete error_list[AUTHENTICATION.QUERY_PARAMS.ID];

    integrationDataChange({
      api_query_params: !isAllRowsDeleted(queryParams),
      query_params: queryParams,
      error_list,
    });
  };

  const handleMappingTableChange = (e, index, key, isDuplicateKeyError, duplicateKeyIndex) => {
    const { [key]: listData } = cloneDeep(props);
    if (listData[index]) listData[index][e.target.id] = e.target.value;

    const errorPath = `${key},${index},${e.target.id}`;
    const duplicateErrorPath = `${key},${duplicateKeyIndex}`;

    const clonedErrorList = cloneDeep(error_list) || [];

    delete clonedErrorList[errorPath];
    if (isDuplicateKeyError) delete clonedErrorList[duplicateErrorPath];

    integrationDataChange({
      [key]: listData,
      error_list: clonedErrorList,
    });
  };

  const handleMappingRowDelete = (index, key, isDuplicateKeyError, duplicateKeyIndex) => {
    const { [key]: listData } = cloneDeep(props);
    listData[index] = { is_deleted: true };
    const clonedErrorList = cloneDeep(error_list);
    const duplicateErrorPath = `${key},${duplicateKeyIndex}`;

    if (error_list) {
      Object.keys(error_list).forEach((currentKey) => {
        if (currentKey?.includes(`${key},${index}`)) {
          delete clonedErrorList[currentKey];
        }
      });
    }

    if (isDuplicateKeyError) delete clonedErrorList[duplicateErrorPath];

    const dataTobeUpdated = {
      [key]: listData,
      error_list: clonedErrorList,
    };

    if (key === AUTHENTICATION.HEADERS.ID) {
      dataTobeUpdated.api_headers = !isAllRowsDeleted(listData);
    } else {
      dataTobeUpdated.api_query_params = !isAllRowsDeleted(listData);
    }

    integrationDataChange(dataTobeUpdated);
  };

  const initiateAuthorization = () => {
    const dataTobeValidated = isExternalIntegration ? { ...authentication, ...getAuthValidationData(authentication) } : authentication;
    const error = validate({ authentication: { ...dataTobeValidated } }, verifyOauthSchema(t), t);
    integrationDataChange({
      error_list: {
        ...error_list,
        ...error,
      },
    });
    console.log(error, error_list, 'llmklkmkl', authentication, dataTobeValidated);
    if (isEmpty(error)) {
      integrationDataChange({
        authentication: {
          ...dataTobeValidated,
          authorization_status: AUTHORIZATION_STATUS.IN_PROGRESS,
        },
      });
      if (
        authentication.type === AUTHENTICATION_TYPE_CONSTANTS.OAUTH_AUTH_CODE
      ) {
        let codeChallengeAndVerifierDataNew = {
          challenge: null,
          challengeMethod: null,
          verifier: null,
        };
        if (dataTobeValidated.is_pkce) {
          codeChallengeAndVerifierDataNew = getCodeChallengeAndVerifier();
          setVerifierAndChallenge(codeChallengeAndVerifierDataNew);
        }
        authorizeAppInNewWindow(
          {
            ...dataTobeValidated,
            ...codeChallengeAndVerifierDataNew,
          },
          setExternalPopup,
        );
      } else {
        verifyCredentials();
      }
    }
  };

  const authenticationType = authentication[AUTHENTICATION.AUTHENTICATION_METHOD.ID];

  const getCurrentAuthenticationTab = () => {
    let idValueObj = {};
    switch (authenticationType) {
      case AUTHENTICATION_TYPE_CONSTANTS.BASIC:
        idValueObj = {
          keyLabel: t(AUTHENTICATION.USERNAME.LABEL),
          keyId: AUTHENTICATION.USERNAME.ID,
          valueLabel: t(AUTHENTICATION.PASSWORD.LABEL),
          valueId: AUTHENTICATION.PASSWORD.ID,
        };
        break;
      case AUTHENTICATION_TYPE_CONSTANTS.API_KEY:
        idValueObj = {
          keyLabel: t(AUTHENTICATION.KEY.LABEL),
          keyId: AUTHENTICATION.KEY.ID,
          valueLabel: t(AUTHENTICATION.VALUE.LABEL),
          valueId: AUTHENTICATION.VALUE.ID,
          addToId: AUTHENTICATION.ADD_TO.ID,
          addToLabel: t(AUTHENTICATION.ADD_TO.LABEL),
          addToOptions: AUTHENTICATION.ADD_TO.OPTIONS(t),
        };
        break;
      case AUTHENTICATION_TYPE_CONSTANTS.TOKEN:
        idValueObj = {
          valueLabel: t(AUTHENTICATION.TOKEN.LABEL),
          valueId: AUTHENTICATION.TOKEN.ID,
        };
        break;
      case AUTHENTICATION_TYPE_CONSTANTS.OAUTH_AUTH_CODE:
        idValueObj = {
          authUrlId: AUTHENTICATION.AUTH_URL.ID,
          authUrlLabel: t(AUTHENTICATION.AUTH_URL.LABEL),
          keyLabel: t(AUTHENTICATION.CLIENT_ID.LABEL),
          keyId: AUTHENTICATION.CLIENT_ID.ID,
          displayCallbackUrl: true,
          valueLabel: t(AUTHENTICATION.CLIENT_SECRET.LABEL),
          valueId: AUTHENTICATION.CLIENT_SECRET.ID,
          scopeId: AUTHENTICATION.SCOPE.ID,
          scopeLabel: t(AUTHENTICATION.SCOPE.LABEL),
          tokenUrlId: AUTHENTICATION.TOKEN_URL.ID,
          tokenUrlLabel: t(AUTHENTICATION.TOKEN_URL.LABEL),
          needToAuthorize: true,
          authorizationStatus: AUTHORIZATION_STATUS.YET_TO_INITIATE,
        };
        break;
      case AUTHENTICATION_TYPE_CONSTANTS.OAUTH_CLIENT_CODE:
        idValueObj = {
          keyLabel: t(AUTHENTICATION.CLIENT_ID.LABEL),
          keyId: AUTHENTICATION.CLIENT_ID.ID,
          valueLabel: t(AUTHENTICATION.CLIENT_SECRET.LABEL),
          valueId: AUTHENTICATION.CLIENT_SECRET.ID,
          scopeId: AUTHENTICATION.SCOPE.ID,
          scopeLabel: t(AUTHENTICATION.SCOPE.LABEL),
          tokenUrlId: AUTHENTICATION.TOKEN_URL.ID,
          tokenUrlLabel: t(AUTHENTICATION.TOKEN_URL.LABEL),
          needToAuthorize: true,
          authorizationStatus: AUTHORIZATION_STATUS.YET_TO_INITIATE,
        };
        break;
      case AUTHENTICATION_TYPE_CONSTANTS.OAUTH_PASSWORD_GRANT:
        idValueObj = {
          addonKeyLabel: t(AUTHENTICATION.CLIENT_ID.LABEL),
          addonKeyId: AUTHENTICATION.CLIENT_ID.ID,
          addonValueLabel: t(AUTHENTICATION.CLIENT_SECRET.LABEL),
          addonValueId: AUTHENTICATION.CLIENT_SECRET.ID,
          keyLabel: t(AUTHENTICATION.USERNAME.LABEL),
          keyId: AUTHENTICATION.USERNAME.ID,
          valueLabel: t(AUTHENTICATION.PASSWORD.LABEL),
          valueId: AUTHENTICATION.PASSWORD.ID,
          scopeId: AUTHENTICATION.SCOPE.ID,
          scopeLabel: t(AUTHENTICATION.SCOPE.LABEL),
          tokenUrlId: AUTHENTICATION.TOKEN_URL.ID,
          tokenUrlLabel: t(AUTHENTICATION.TOKEN_URL.LABEL),
          needToAuthorize: true,
          authorizationStatus: AUTHORIZATION_STATUS.YET_TO_INITIATE,
        };
        break;
      case AUTHENTICATION_TYPE_CONSTANTS.NO_AUTH:
        break;
      default:
        break;
    }

    return (
      <BasicAuth
        hasSaved={authentication?.hasSaved}
        {...idValueObj}
        authenticationType={authenticationType}
        initiateAuthorization={initiateAuthorization}
        isExternalIntegration={isExternalIntegration}
        isEditView={isEditView}
        updateAuthTokenUrl={authentication?.is_update_auth_base_url}
        isLoadingIntegrationDetail={isIntegrationTemplateLoading}
      />
    );
  };
  const headersMappingList = headers || [];
  const queryParamsMappingList = query_params || [];

  const initialRow = (index, key, isDuplicateKeyError, duplicateKeyIndex) => {
    const keyErrorPath = `${key},${index},key`;
    const valueErrorPath = `${key},${index},value`;
    const currentMappingList =
      key === AUTHENTICATION.HEADERS.ID
        ? headersMappingList
        : queryParamsMappingList;

    let keyInputError = null;
    if (isDuplicateKeyError) {
      keyInputError = t(DUPLICATE_KEY_ERROR);
    } else {
      keyInputError = error_list[keyErrorPath];
    }

    return (
      <>
        <div className={cx(styles.ColMid, gClasses.MB12)}>
          <TextInput
            onChange={(e) => handleMappingTableChange(e, index, key, isDuplicateKeyError, duplicateKeyIndex)}
            id="key"
            className={gClasses.MR24}
            value={currentMappingList[index]?.key}
            errorMessage={keyInputError}
            readOnly={!isEditView}
            labelClassName={styles.LabelClassName}
          />
        </div>
        <div className={styles.ColMid}>
          <TextInput
            onChange={(e) => handleMappingTableChange(e, index, key, isDuplicateKeyError, duplicateKeyIndex)}
            id="value"
            className={gClasses.MR24}
            value={currentMappingList[index]?.value}
            errorMessage={error_list[valueErrorPath]}
            readOnly={!isEditView}
            labelClassName={styles.LabelClassName}
          />
        </div>
        {isEditView &&
          <Button
            className={cx(styles.ColMini, gClasses.CenterV, gClasses.MB12)}
            icon={
              <Trash
                className={styles.DeleteIcon}
              />
            }
            iconOnly
            onClickHandler={() => handleMappingRowDelete(index, key, isDuplicateKeyError, duplicateKeyIndex)}
            size={EButtonSizeType.SM}
            type={EMPTY_STRING}
          />
        }
      </>
    );
  };

  const initialRowKeyValue = {
    key: EMPTY_STRING,
    value: EMPTY_STRING,
  };

  console.log('asdasdfasfasfasf', authentication?.headers || []);

  const getBaseUrlOptions = (baseUrlArray) => {
    if (!isEmpty(baseUrlArray)) {
      return baseUrlArray?.map((apiUrl) => {
        return {
          label: apiUrl,
          value: apiUrl,
        };
      });
    }
    return [];
  };

  return (
    <div className={styles.MainContainer}>
      <div className={styles.FieldsWrapper}>
        <Text
          content={t(AUTHENTICATION.TITLE)}
          className={cx(styles.AuthTitle, gClasses.MB16)}
          size={ETextSize.XL}
        />
        {isExternalIntegration ? (
          !isIntegrationTemplateLoading && (
            <SingleDropdown
              id={AUTHENTICATION.BASE_URL.ID}
              dropdownViewProps={{
                labelName: t(AUTHENTICATION.BASE_URL.LABEL),
                isRequired: true,
                disabled: !isEditView,
                labelClassName: styles.LabelClassName,
              }}
              optionList={getBaseUrlOptions(selected_template_details?.base_url)}
              onClick={(value, _label, _list, id) =>
                onBaseUrlChange(generateEventTargetObject(id, value))
              }
              selectedValue={base_url}
              errorMessage={error_list[AUTHENTICATION.BASE_URL.ID]}
              className={gClasses.MB16}
            />
          )
        ) : (
          <TextInput
            labelText={t(AUTHENTICATION.BASE_URL.LABEL)}
            onChange={onBaseUrlChange}
            id={AUTHENTICATION.BASE_URL.ID}
            className={cx(styles.FormFields, gClasses.MB16)}
            value={base_url}
            errorMessage={error_list[AUTHENTICATION.BASE_URL.ID]}
            readOnly={!isEditView}
            labelClassName={styles.LabelClassName}
            required
          />
        )}

        <SingleDropdown
          id={AUTHENTICATION.AUTHENTICATION_METHOD.ID}
          dropdownViewProps={{
            labelName: t(AUTHENTICATION.AUTHENTICATION_METHOD.LABEL),
            isRequired: true,
            disabled: isExternalIntegration || !isEditView,
            labelClassName: styles.LabelClassName,
          }}
          optionList={authenticationMethodOptionList}
          onClick={(value, _label, _list, id) =>
            handleAuthTypeChange(generateEventTargetObject(id, value))
          }
          selectedValue={authenticationType}
          errorMessage={get(
            error_list,
            [`authentication,${AUTHENTICATION.AUTHENTICATION_METHOD.ID}`],
            EMPTY_STRING,
          )}
          className={gClasses.MB16}
        />
        {getCurrentAuthenticationTab()}
        <Text
          content={t(HEADERS.LABEL)}
          size={ETextSize.XL}
          className={styles.AuthTitle}
        />
        <MappingTable
          tblHeaders={AUTHENTICATION.API_HEADERS_VALUE(t)}
          outerClass={cx(gClasses.MB20)}
          mappingList={headers || []}
          handleMappingChange={handleHeadersChange}
          mappingKey={AUTHENTICATION.HEADERS.ID}
          initialRow={initialRow}
          initialRowKeyValue={initialRowKeyValue}
          error_list={error_list}
          headerClassName={styles.Header}
          addKeyLabel={isAllRowsDeleted(headers) ? ADD_HEADER : t(ADD_MORE)}
        />
        <Text
          content={t(QUERY_PARAMS.LABEL)}
          size={ETextSize.XL}
          className={styles.AuthTitle}
        />
        <MappingTable
          tblHeaders={AUTHENTICATION.API_HEADERS_VALUE(t)}
          mappingList={query_params || []}
          handleMappingChange={handleQueryParamsChange}
          mappingKey={AUTHENTICATION.QUERY_PARAMS.ID}
          initialRow={initialRow}
          initialRowKeyValue={initialRowKeyValue}
          error_list={error_list}
          headerClassName={styles.Header}
          addKeyLabel={isAllRowsDeleted(query_params) ? ADD_QUERY_PARAMATER : t(ADD_MORE)}
        />
      </div>
    </div>
  );
}

const mapStateToProps = ({ IntegrationReducer }) => {
  return {
    authentication: IntegrationReducer.authentication,
    error_list: IntegrationReducer.error_list,
    base_url: IntegrationReducer.base_url,
    api_headers: IntegrationReducer.api_headers,
    headers: IntegrationReducer.headers,
    api_query_params: IntegrationReducer.api_query_params,
    query_params: IntegrationReducer.query_params,
    connector_id: IntegrationReducer.selected_connector,
    state: IntegrationReducer,
  };
};

const mapDispatchToProps = {
  integrationDataChange,
  verifyOAuth2Credentials: verifyOAuth2CredentialsThunk,
};

export default connect(mapStateToProps, mapDispatchToProps)(Authentication);
