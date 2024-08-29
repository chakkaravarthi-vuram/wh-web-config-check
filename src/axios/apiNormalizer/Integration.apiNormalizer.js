export const normalizePostConnector = (untrustedContent) => {
  const content = untrustedContent.data.result.data;
  if (!content) {
    reportError('post api integration failed');
    return null;
  }
  return content;
};

export const normalizeWorkhallApiGetConfiguration = (untrustedContent) => {
  const content = untrustedContent.data.result.data;
  if (!content) {
    reportError('get configuration integration failed');
    return null;
  }
  return content;
};

export const normalizeDeleteOauthCredential = (untrustedContent) => {
  const content = untrustedContent.data.result.data;
  if (!content) {
    reportError('delete oAuth credential failed');
    return null;
  }
  return content;
};

export const normalizeGetOAuthClientCredentials = (untrustedContent) => {
  const content = untrustedContent.data.result.data;
  if (!content) {
    reportError('get oauth client credentials failed');
    return null;
  }
  return content;
};

export const normalizePostOauthCredential = (untrustedContent) => {
  const content = untrustedContent.data.result.data;
  if (!content) {
    reportError('post api oauth client cred failed');
    return null;
  }
  return content;
};

export const normalizeGetTemplates = (untrustedContent) => {
  const content = untrustedContent.data.result.data;
  if (!content) {
    reportError('get api integration templates failed');
    return null;
  }
  return content;
};

export const normalizeDeleteConnector = (untrustedContent) => {
  const content = untrustedContent.data.result.data;
  if (!content) {
    reportError('delete api integration failed');
    return null;
  }
  return content;
};

export const normalizeDiscardConnector = (untrustedContent) => {
  const content = untrustedContent.data.result.data;
  if (!content) {
    reportError('discard api integration failed');
    return null;
  }
  return content;
};

export const normalizeGenerateOauthClientCreds = (untrustedContent) => {
  const content = untrustedContent.data.result.data;
  if (!content) {
    reportError('generate oauth client cred failed');
    return null;
  }
  return content;
};

export const normalizeVerifyOauth2Credentials = (untrustedContent) => {
  const content = untrustedContent.data.result.data;
  if (!content) {
    reportError('verify oauth integration failed');
    return null;
  }
  return content;
};

export const normalizeCheckEventDependency = (untrustedContent) => {
  const content = untrustedContent.data.result.data;
  if (!content) {
    reportError('get api integration dependency failed');
    return null;
  }
  return content;
};

const validateWorkhallApi = (content) => {
  const requiredProps = [
    'api_configuration_uuid',
    '_id',
  ];

  const missingIntegration = requiredProps.filter((prop) => {
    if (!Object.prototype.hasOwnProperty.call(content, prop)) {
      reportError(`Post failed: ${prop} missing`);
      return true;
    }
    return false;
  });

  if (missingIntegration.length > 0) return null;

  return content;
};

export const normalizeWorkhallPostApi = (untrustedContent) => {
  const content = validateWorkhallApi(untrustedContent.data.result.data);
  if (!content) {
    reportError('post api integration dependency failed');
    return null;
  }
  return content;
};

const validateInitiationStepActions = (content) => {
  const requiredProps = [
    '_id',
    'actions',
  ];

  const missingIntegration = requiredProps.filter((prop) => {
    if (!Object.prototype.hasOwnProperty.call(content, prop)) {
      reportError(`Get failed: ${prop} missing`);
      return true;
    }
    return false;
  });

  if (missingIntegration.length > 0) return null;

  return content;
};

export const normalizeInitiationStepActors = (untrustedContent) => {
  const content = validateInitiationStepActions(untrustedContent.data.result.data);
  if (!content) {
    reportError('initiation step actions dependency failed');
    return null;
  }
  return content;
};

export const normalizeWorkhallPublishApi = (untrustedContent) => {
  const content = untrustedContent.data.result.data;
  if (!content) {
    reportError('workhall publish api dependency failed');
    return null;
  }
  return content;
};

const validateGetAllEvents = (content) => {
  if (!content.pagination_data || !content.pagination_details) return false;

  const requiredProps = [
    'event_uuid',
    'name',
    'category',
    'method',
  ];

  return content.pagination_data.every((element) =>
    requiredProps.every((prop) => {
      if (!Object.prototype.hasOwnProperty.call(element, prop)) {
        reportError(`validatePreSingIn failed: ${prop} missing`);
        return false;
      }
      return true;
    }));
};

export const normalizeGetAllEvents = (rawResponse) => {
  const validatedData = validateGetAllEvents(rawResponse.data.result.data);
  if (!validatedData) {
    reportError('get all events failed');
    return null;
  }
  return rawResponse.data.result.data;
};

const validateAddEvent = (content) => {
  const requiredProps = [
    '_id',
    'connector_uuid',
  ];

  const missingIntegration = requiredProps.filter((prop) => {
    if (!Object.prototype.hasOwnProperty.call(content, prop)) {
      reportError(`Get failed: ${prop} missing`);
      return true;
    }
    return false;
  });

  if (missingIntegration.length > 0) return null;

  return content;
};

export const normalizeAddEvent = (untrustedContent) => {
  const content = validateAddEvent(untrustedContent.data.result.data);
  if (!content) {
    reportError('add integration event failed');
    return null;
  }
  return content;
};

export const normalizeRemoveEventApi = (untrustedContent) => {
  const content = untrustedContent.data.result.data;
  if (!content) {
    reportError('integration remove event failed');
    return null;
  }
  return content;
};

const validatesaveDBConnector = (content) => {
  const requiredProps = [
    '_id',
    'db_connector_uuid',
    'db_connector_name',
    'connection_details',
    'is_active',
    'status',
  ];

  const missingIntegration = requiredProps.filter((prop) => {
    if (!Object.hasOwn(content, prop)) {
      reportError(`Post failed: ${prop} missing`);
      return true;
    }
    return false;
  });

  if (missingIntegration.length > 0) return null;

  return content;
};

export const normalizeSaveDBConnectorApi = (untrustedContent) => {
  const content = validatesaveDBConnector(untrustedContent.data.result.data);
  if (!content) {
    reportError('post save db connector api failed');
    return null;
  }
  return content;
};

export const normalizePublishDBConnectorApi = (untrustedContent) => {
  const content = untrustedContent.data.result.data;
  if (!content) {
    reportError('post publish db connector api failed');
    return null;
  }
  return content;
};

export const normalizeDiscardDBConnectorApi = (untrustedContent) => {
  const content = untrustedContent.data.result.data;
  if (!content) {
    reportError('post discard db connector api failed');
    return null;
  }
  return content;
};

const validateGetDBConnector = (content) => {
  if (content?.pagination_details && content?.pagination_data) return content;
  const requiredProps = [
    '_id',
    'db_connector_uuid',
    'db_connector_name',
    'no_of_db_queries',
    'is_active',
    'status',
  ];

  const missingIntegration = requiredProps.filter((prop) => {
    if (!Object.hasOwn(content, prop)) {
      reportError(`Post failed: ${prop} missing`);
      return true;
    }
    return false;
  });

  if (missingIntegration.length > 0) return null;

  return content;
};

export const normalizeGetDBConnectorApi = (untrustedContent) => {
  const content = validateGetDBConnector(untrustedContent.data.result.data);
  if (!content) {
    reportError('post fetch db data api failed');
    return null;
  }
  return content;
};

export const normalizeDeleteDBConnectorApi = (untrustedContent) => {
  const content = untrustedContent.data.result.data;
  if (!content) {
    reportError('post delete db connector api failed');
    return null;
  }
  return content;
};

export const normalizeGetTableListApi = (untrustedContent) => {
  const content = untrustedContent.data.result.data;
  if (content.length === 0) {
    reportError('post get table list api failed');
    return null;
  }
  return content;
};

export const normalizeGetTableInfoApi = (untrustedContent) => {
  const content = untrustedContent.data.result.data;
  if (content.length === 0) {
    reportError('post get table info api failed');
    return null;
  }
  return content;
};

const validateFetchDBData = (content) => {
  const requiredProps = [
    'is_connection_established',
    'query_data',
  ];

  const missingIntegration = requiredProps.filter((prop) => {
    if (!Object.hasOwn(content, prop)) {
      reportError(`Post failed: ${prop} missing`);
      return true;
    }
    return false;
  });

  if (missingIntegration.length > 0) return null;

  return content;
};

export const normalizeFetchDBDataApi = (untrustedContent) => {
  const content = validateFetchDBData(untrustedContent.data.result.data);
  if (!content) {
    reportError('post fetch db data api failed');
    return null;
  }
  return content;
};

const validatePostDBConnectorQuery = (content) => {
  const requiredProps = [
    '_id',
    'db_query_uuid',
    'db_query_name',
    'query_config',
    'connector_id',
    'connector_uuid',
    'is_active',
    'status',
  ];

  const missingIntegration = requiredProps.filter((prop) => {
    if (!Object.hasOwn(content, prop)) {
      reportError(`Post failed: ${prop} missing`);
      return true;
    }
    return false;
  });

  if (missingIntegration.length > 0) return null;

  return content;
};

export const normalizePostDBConnectorQueryApi = (untrustedContent) => {
  const content = validatePostDBConnectorQuery(untrustedContent.data.result.data);
  if (!content) {
    reportError('post db connector query api failed');
    return null;
  }
  return content;
};

const validateGetDBConnectorQuery = (content) => {
  if (content?.pagination_details && content?.pagination_data) return content;
  const requiredProps = [
    '_id',
    'db_query_uuid',
    'db_query_name',
    'query_config',
    'connector_id',
    'connector_uuid',
    'is_active',
    'status',
  ];

  const missingIntegration = requiredProps.filter((prop) => {
    if (!Object.hasOwn(content, prop)) {
      reportError(`Post failed: ${prop} missing`);
      return true;
    }
    return false;
  });

  if (missingIntegration.length > 0) return null;

  return content;
};

export const normalizeGetDBConnectorQueryApi = (untrustedContent) => {
  const content = validateGetDBConnectorQuery(untrustedContent.data.result.data);
  if (!content) {
    reportError('get db connector query api failed');
    return null;
  }
  return content;
};

export const normalizePublishDBConnectorQueryApi = (untrustedContent) => {
  const content = untrustedContent.data.result.data;
  if (!content) {
    reportError('post publish db connector query api failed');
    return null;
  }
  return content;
};

export const normalizeDeleteDBConnectorQueryApi = (untrustedContent) => {
  const content = untrustedContent.data.result.data;
  if (!content) {
    reportError('post delete db connector query api failed');
    return null;
  }
  return content;
};

const validateGetDBConnectorSupportedOptions = (content) => {
  const requiredProps = [
    'allowed_db_types',
    'db_allowed_options',
  ];

  const missingIntegration = requiredProps.filter((prop) => {
    if (!Object.hasOwn(content, prop)) {
      reportError(`Post failed: ${prop} missing`);
      return true;
    }
    return false;
  });

  if (missingIntegration.length > 0) return null;

  return content;
};

export const normalizeGetDBConnectorSupportedOptionsApi = (untrustedContent) => {
  const content = validateGetDBConnectorSupportedOptions(untrustedContent.data.result.data);
  if (!content) {
    reportError('get db connector supported options api failed');
    return null;
  }
  return content;
};
