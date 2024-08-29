import React from 'react';
import cx from 'classnames/bind';
import { connect } from 'react-redux';
import { ETextSize, Table, Text } from '@workhall-pvt-lmt/wh-ui-library';
import gClasses from 'scss/Typography.module.scss';
import { useTranslation } from 'react-i18next';
import { get, isEmpty } from 'utils/jsUtility';
import styles from './ViewAuthentication.module.scss';
import {
  AUTHENTICATION_TYPE_CONSTANTS,
  INTEGRATION_STRINGS,
} from '../../../Integration.utils';
import { EMPTY_STRING } from '../../../../../utils/strings/CommonStrings';
import { BS } from '../../../../../utils/UIConstants';
import ReadOnlyField from '../../../../../components/readonly_field/ReadOnlyField';

function ViewAuthentication(props) {
  const { authentication, base_url, headers = [], query_params = [] } = props;

  const { AUTHENTICATION, HEADERS, QUERY_PARAMS } = INTEGRATION_STRINGS;
  const { t } = useTranslation();

  const authenticationType = get(
    authentication,
    AUTHENTICATION.AUTHENTICATION_METHOD.ID,
    EMPTY_STRING,
  );

  const getFieldClass = (id) => {
    console.log('authFieldId', id);
    switch (id) {
      case t(AUTHENTICATION.CLIENT_SECRET.LABEL):
      case t(AUTHENTICATION.VALUE.LABEL):
      case t(AUTHENTICATION.PASSWORD.LABEL):
        return gClasses.W30;
      case t(AUTHENTICATION.SCOPE.LABEL):
      case t(AUTHENTICATION.ADD_TO.LABEL):
        return gClasses.W100;
      case t(AUTHENTICATION.CLIENT_ID.LABEL):
        return gClasses.W50;
      default: return EMPTY_STRING;
    }
  };

  const getCurrentAuthenticationTab = () => {
    let currentAuthenticationFields = [];
    switch (authenticationType) {
      case AUTHENTICATION_TYPE_CONSTANTS.BASIC:
        currentAuthenticationFields = [
          {
            id: t(AUTHENTICATION.USERNAME.LABEL),
            value: get(
              authentication,
              AUTHENTICATION.USERNAME.ID,
              EMPTY_STRING,
            ),
          },
          {
            id: t(AUTHENTICATION.PASSWORD.LABEL),
            value: AUTHENTICATION.SENSITIVE_DATA_ASTRIC,
          },
        ];
        break;
      case AUTHENTICATION_TYPE_CONSTANTS.API_KEY:
        currentAuthenticationFields = [
          {
            id: t(AUTHENTICATION.KEY.LABEL),
            value: get(authentication, AUTHENTICATION.KEY.ID, EMPTY_STRING),
          },
          {
            id: t(AUTHENTICATION.VALUE.LABEL),
            value: AUTHENTICATION.SENSITIVE_DATA_ASTRIC,
          },
          {
            id: t(AUTHENTICATION.ADD_TO.LABEL),
            value: get(authentication, AUTHENTICATION.ADD_TO.ID, EMPTY_STRING),
          },
        ];
        break;
      case AUTHENTICATION_TYPE_CONSTANTS.TOKEN:
        currentAuthenticationFields = [
          {
            id: t(AUTHENTICATION.TOKEN.LABEL),
            value: AUTHENTICATION.SENSITIVE_DATA_ASTRIC,
          },
        ];
        break;
      case AUTHENTICATION_TYPE_CONSTANTS.OAUTH_AUTH_CODE:
        currentAuthenticationFields = [
          {
            id: t(AUTHENTICATION.AUTH_URL.LABEL),
            value: get(
              authentication,
              AUTHENTICATION.AUTH_URL.ID,
              EMPTY_STRING,
            ),
          },
          {
            id: t(AUTHENTICATION.CLIENT_ID.LABEL),
            value: get(
              authentication,
              AUTHENTICATION.CLIENT_ID.ID,
              EMPTY_STRING,
            ),
          },
          {
            id: t(AUTHENTICATION.CLIENT_SECRET.LABEL),
            value: AUTHENTICATION.SENSITIVE_DATA_ASTRIC,
          },
          {
            id: t(AUTHENTICATION.SCOPE.LABEL),
            value: get(authentication, AUTHENTICATION.SCOPE.ID, EMPTY_STRING),
          },
          {
            id: t(AUTHENTICATION.TOKEN_URL.LABEL),
            value: get(
              authentication,
              AUTHENTICATION.TOKEN_URL.ID,
              EMPTY_STRING,
            ),
          },
        ];
        break;
      case AUTHENTICATION_TYPE_CONSTANTS.OAUTH_CLIENT_CODE:
        currentAuthenticationFields = [
          {
            id: t(AUTHENTICATION.CLIENT_ID.LABEL),
            value: get(
              authentication,
              AUTHENTICATION.CLIENT_ID.ID,
              EMPTY_STRING,
            ),
          },
          {
            id: t(AUTHENTICATION.CLIENT_SECRET.LABEL),
            value: AUTHENTICATION.SENSITIVE_DATA_ASTRIC,
          },
          {
            id: t(AUTHENTICATION.SCOPE.LABEL),
            value: get(authentication, AUTHENTICATION.SCOPE.ID, EMPTY_STRING),
          },
          {
            id: t(AUTHENTICATION.TOKEN_URL.LABEL),
            value: get(
              authentication,
              AUTHENTICATION.TOKEN_URL.ID,
              EMPTY_STRING,
            ),
          },
        ];
        break;
      case AUTHENTICATION_TYPE_CONSTANTS.OAUTH_PASSWORD_GRANT:
        currentAuthenticationFields = [
          {
            id: t(AUTHENTICATION.USERNAME.LABEL),
            value: get(
              authentication,
              AUTHENTICATION.USERNAME.ID,
              EMPTY_STRING,
            ),
          },
          {
            id: t(AUTHENTICATION.PASSWORD.LABEL),
            value: AUTHENTICATION.SENSITIVE_DATA_ASTRIC,
          },
          {
            id: t(AUTHENTICATION.CLIENT_ID.LABEL),
            value: get(
              authentication,
              AUTHENTICATION.CLIENT_ID.ID,
              EMPTY_STRING,
            ),
          },
          {
            id: t(AUTHENTICATION.CLIENT_SECRET.LABEL),
            value: AUTHENTICATION.SENSITIVE_DATA_ASTRIC,
          },
          {
            id: t(AUTHENTICATION.SCOPE.LABEL),
            value: get(
              authentication,
              AUTHENTICATION.SCOPE.ID,
              EMPTY_STRING,
            ),
          },
          {
            id: t(AUTHENTICATION.TOKEN_URL.LABEL),
            value: get(
              authentication,
              AUTHENTICATION.TOKEN_URL.ID,
              EMPTY_STRING,
            ),
          },
        ];
        break;
      default:
        break;
    }

    return currentAuthenticationFields.map((authFields) =>
      <ReadOnlyField
        key={authFields?.id}
        title={authFields?.id}
        subTitle={authFields?.value}
        className={getFieldClass(authFields?.id)}
      />,
    );
  };

  const getHeadersData = (headers) =>
    headers?.map((eachHeader, index) => {
      const key = (
        <div className={cx(styles.HeaderParamColumn, gClasses.Ellipsis)}>
          {eachHeader.key}
        </div>
      );
      const value = (
        <div className={cx(styles.HeaderParamColumn, gClasses.Ellipsis)}>
          {eachHeader.value}
        </div>
      );

      return {
        id: index,
        component: [key, value],
      };
    });

  const authValue = get(authentication, AUTHENTICATION.AUTHENTICATION_METHOD.ID);
  const selectedAuthOption = AUTHENTICATION.AUTHENTICATION_METHOD.OPTIONS.find((auth) => auth?.value === authValue);

  return (
    <div className={styles.OuterContainer}>
      <Text
        content={t(AUTHENTICATION.TITLE)}
        size={ETextSize.XL}
        className={cx(gClasses.MB16, styles.AuthTitle)}
      />
      <ReadOnlyField
        title={t(AUTHENTICATION.AUTHENTICATION_METHOD.LABEL)}
        subTitle={selectedAuthOption?.label}
      />
      <ReadOnlyField
        title={t(AUTHENTICATION.BASE_URL.LABEL)}
        subTitle={base_url}
      />
      <div className={styles.AuthenticationFields}>
        {getCurrentAuthenticationTab()}
      </div>
      {!isEmpty(headers) && (
        <>
          <Text content={t(HEADERS.LABEL)} className={cx(gClasses.MB16, styles.AuthTitle)} />
          <Table
            header={HEADERS.TABLE_HEADERS}
            data={getHeadersData(headers)}
            className={cx(BS.W75, styles.HeaderParamTable, gClasses.MT16)}
          />
        </>
      )}

      {!isEmpty(query_params) && (
        <>
          <Text
            content={t(QUERY_PARAMS.LABEL)}
            size={ETextSize.XL}
            className={cx(gClasses.MT16, styles.AuthTitle)}
          />
          <Table
            header={HEADERS.TABLE_HEADERS}
            data={getHeadersData(query_params)}
            className={cx(BS.W75, styles.HeaderParamTable, gClasses.MT16)}
          />
        </>
      )}
    </div>
  );
}

const mapStateToProps = ({ IntegrationReducer }) => {
  return {
    authentication: IntegrationReducer.authentication,
    base_url: IntegrationReducer.base_url,
    api_headers: IntegrationReducer.api_headers,
    headers: IntegrationReducer.headers,
    api_query_params: IntegrationReducer.api_query_params,
    query_params: IntegrationReducer.query_params,
    connector_id: IntegrationReducer.selected_connector,
    state: IntegrationReducer,
  };
};

export default connect(mapStateToProps)(ViewAuthentication);
