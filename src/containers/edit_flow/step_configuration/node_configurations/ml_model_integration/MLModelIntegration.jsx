import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ConfigModal from '../../../../../components/config_modal/ConfigModal';
import StatusDropdown from '../status_dropdown/StatusDropdown';
import { ML_MODEL_INTEGRATION_STRINGS } from './MLModelIntegration.strings';
import GeneralConfiguration from './general/GeneralConfiguration';
import ErrorHandling from './error_handling/ErrorHandling';

function MLModelIntegration() {
    const { t } = useTranslation();

    const [isModalOpen, setIsModalOpen] = useState(true);
    const { TITLE, TABS } = ML_MODEL_INTEGRATION_STRINGS(t);

    const [currentTab, setCurrentTab] = useState(
        TABS[0].tabIndex,
      );

    const closeMLModel = () => {
        setIsModalOpen(false);
    };

    let currentTabDetails = (
        <GeneralConfiguration />
    );
    if (currentTab === '2') currentTabDetails = <ErrorHandling />;
    else if (currentTab === '3') currentTabDetails = <StatusDropdown />;

    return (
        <ConfigModal
            isModalOpen={isModalOpen}
            onCloseClick={closeMLModel}
            tabOptions={TABS}
            modalBodyContent={currentTabDetails}
            modalTitle={TITLE}
            currentTab={currentTab}
            onTabSelect={(tabValue) => setCurrentTab(tabValue)}
        />
    );
}

export default MLModelIntegration;
