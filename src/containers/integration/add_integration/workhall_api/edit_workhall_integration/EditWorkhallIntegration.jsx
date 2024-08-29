import React from 'react';
import cx from 'classnames/bind';
import { connect } from 'react-redux';
import { integrationDataChange } from 'redux/reducer/IntegrationReducer';
import Credentials from './credentials/Credentials';
import RequestResponse from './request_response/RequestResponse';
import { EDIT_VIEW_INTEGRATION_TABS } from '../../../Integration.utils';
import styles from './EditWorkhallIntegration.module.scss';
import ViewCredentials from './credentials/ViewCredentials';

function EditWorkhallIntegration(props) {
  const {
    integrationEditTab,
    isEditView,
  } = props;

  const { CREDENTIALS } = EDIT_VIEW_INTEGRATION_TABS;

  let tabComponent = null;

  if (integrationEditTab === CREDENTIALS) {
    if (isEditView) tabComponent = <Credentials />;
    else tabComponent = <ViewCredentials />;
  } else {
    tabComponent = <RequestResponse isEditView={isEditView} />;
  }

  return (
    <div className={cx(styles.OuterContainer, isEditView ? styles.MainContainer : styles.ReadOnlyMainContainer)}>
      {tabComponent}
    </div>
  );
}

const mapDispatchToProps = {
  integrationDataChange,
};

export default connect(
  null,
  mapDispatchToProps,
)(EditWorkhallIntegration);
