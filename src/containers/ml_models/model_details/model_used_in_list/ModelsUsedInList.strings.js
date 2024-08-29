export const GET_MODELS_USED_IN_LIST_STRINGS = (t) => {
  return {
    SHOWING: t('ml_model_integration.model_used_in_flow_listing.showing'),
    FLOWS: t('ml_model_integration.model_used_in_flow_listing.flows'),
    EMPTY_LIST_TITLE: t('ml_model_integration.model_used_in_flow_listing.empty_list.title'),
    UNTITLED_PAGE_URL: 'untitled-page-1',
    UNTITLED_PAGE_NAME: 'Untitled Page 1',
  };
};

export const GET_MODELS_USED_IN_LIST_COLUMN_LABEL = (t) => {
  return {
    FLOW_NAME: t('ml_model_integration.model_used_in_flow_listing.column_header.flow_name'),
    STEP_NAME: t('ml_model_integration.model_used_in_flow_listing.column_header.step_name'),
    LAST_UPDATED_ON: t('ml_model_integration.model_used_in_flow_listing.column_header.last_updated_on'),
  };
};
