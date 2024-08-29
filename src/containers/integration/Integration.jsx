import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';
import {
  INTEGRATIONS,
  EDIT_INTEGRATION,
  DRAFT_INTEGRATION,
  API_CREDENTIAL,
} from 'urls/RouteConstants';
import { cloneDeep, isEmpty } from 'utils/jsUtility';
import {
  integrationDataChange,
  INTEGRATION_DETAILS_INIT_DATA,
} from 'redux/reducer/IntegrationReducer';
import styles from './Integration.module.scss';
import IntegrationList from './integration_list/IntegrationList';
import AddIntegration from './add_integration/AddIntegration';
import EditIntegration from './edit_integration/EditIntegration';
import { MATCH_PARAMS } from '../../urls/RouteConstants';
import { routeNavigate } from '../../utils/UtilityFunctions';
import { ROUTE_METHOD } from '../../utils/Constants';

function Integration(props) {
  const {
    integrationDataChange,
    isBasicDetailsModalOpen,
  } = cloneDeep(props);

  const [isListView, setIsListView] = useState(false);
  const matchParams = useParams();
  const integrationTab = matchParams[MATCH_PARAMS.TAB];
  const action = matchParams[MATCH_PARAMS.ACTION];
  const uuidFromUrl = matchParams[MATCH_PARAMS.UUID];

  const history = useHistory();

  const clearIntegrationData = () => {
    integrationDataChange({ ...INTEGRATION_DETAILS_INIT_DATA });
  };

  useEffect(() => {
    if (isEmpty(uuidFromUrl) || (integrationTab === API_CREDENTIAL)) {
      setIsListView(true);
    } else if (!isEmpty(uuidFromUrl)) setIsListView(false);
  }, [uuidFromUrl]);

  const handleEditClick = (id, currentSelectedTab = integrationTab) => {
    const intergrationsPathName = `${INTEGRATIONS}/${currentSelectedTab}/${id}/${EDIT_INTEGRATION}`;
    routeNavigate(history, ROUTE_METHOD.PUSH, intergrationsPathName);
  };

  const handleCardClick = (currentConnector, isEdit, currentSelectedTab) => {
    const selectedUuid = currentConnector?.connector_uuid || currentConnector?.api_configuration_uuid || currentConnector?.db_connector_uuid;
    if ((integrationTab === DRAFT_INTEGRATION) || isEdit) {
      handleEditClick(selectedUuid, currentSelectedTab);
    } else {
      const integrationsPathname = `${INTEGRATIONS}/${integrationTab}/${selectedUuid}`;
      routeNavigate(history, ROUTE_METHOD.PUSH, integrationsPathname);
    }
  };

  const getCurrentIntegrationTab = () => {
    if (isEmpty(uuidFromUrl)) {
      return (
        <div className={styles.ListOuterClass}>
          <IntegrationList
            handleCardClick={handleCardClick}
            integrationTab={integrationTab}
            isListView={isListView}
          />
        </div>
      );
    } else {
        return (
          <div className={((action === EDIT_INTEGRATION) && styles.EditContainer)}>
            <EditIntegration
              clearIntegrationData={clearIntegrationData}
              isEditView={action === EDIT_INTEGRATION}
              handleEditClick={handleCardClick}
              uuidFromUrl={uuidFromUrl}
              integrationTab={integrationTab}
              isFromEditPage={action === EDIT_INTEGRATION}
            />
          </div>
        );
    }
  };

  return (
    <>
      {getCurrentIntegrationTab()}
      {
        isBasicDetailsModalOpen && (
          <div>
            <AddIntegration
              isModalOpen={isBasicDetailsModalOpen}
              isFromEditPage={action === EDIT_INTEGRATION}
            />
          </div>
        )
      }
    </>
  );
}

const mapStateToProps = ({ IntegrationReducer }) => {
  return {
    connector_uuid: IntegrationReducer.connector_uuid,
    isBasicDetailsModalOpen: IntegrationReducer.isBasicDetailsModalOpen,
  };
};

const mapDispatchToProps = {
  integrationDataChange,
};

export default connect(mapStateToProps, mapDispatchToProps)(Integration);
