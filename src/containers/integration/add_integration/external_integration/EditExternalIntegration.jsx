import React from 'react';
import { connect } from 'react-redux';
import Events from '../events/Events';
import Authentication from '../authentication/Authentication';
import { EDIT_VIEW_INTEGRATION_TABS } from '../../Integration.utils';
import AddEvent from '../events/add_event/AddEvent';
import ViewAuthentication from '../authentication/view_authentication/ViewAuthentication';
import { postIntegrationConnectorApiThunk } from '../../../../redux/actions/Integration.Action';
import { integrationDataChange } from '../../../../redux/reducer/IntegrationReducer';

function EditIntegration(props) {
    const {
        isAddEventVisible,
        isEditView,
        integrationEditTab,
    } = props;

    let selectedTabData = null;
    if (integrationEditTab === EDIT_VIEW_INTEGRATION_TABS.AUTHENTICATION) {
        selectedTabData = isEditView ? (<Authentication isEditView />) : (<ViewAuthentication />);
    } else {
        selectedTabData = (
            <>
                {
                    isEditView && (
                        <AddEvent isAddEventVisible={isAddEventVisible} isEditView={isEditView} />
                    )
                }
                <Events isEditView={isEditView} />
            </>
        );
    }
    return selectedTabData;
}

const mapStateToProps = ({ IntegrationReducer }) => {
    return {
        isLoadingIntegrationDetail: IntegrationReducer.isLoadingIntegrationDetail,
        isEditIntegration: IntegrationReducer.isEditIntegration,
        connector_uuid: IntegrationReducer.connector_uuid,
        template_id: IntegrationReducer.template_id,
        isAddEventVisible: IntegrationReducer.isAddEventVisible,
    };
};

const mapDispatchToProps = {
    postIntegrationConnectorApi: postIntegrationConnectorApiThunk,
    integrationDataChange,
};

export default connect(mapStateToProps, mapDispatchToProps)(EditIntegration);
