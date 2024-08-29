import React, { useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Skeleton from 'react-loading-skeleton';
import { getAppData } from '../../../../../axios/apiService/application.apiService';
import SkeletonWrapper from '../../../../../components/skeleton_wrapper/SkeletonWrapper';
import { CancelToken } from '../../../../../utils/UtilityFunctions';
import { setAppOrderData } from '../../AppListing.utils';
import { AppOrderSettingsContainer } from './AppOrderSettingsCard';

const cancelToken = new CancelToken();

function AppOrderSettings(props) {
    const { appStateChange, appOrder } = props;

    useEffect(() => {
        appStateChange({ appOrder: { isAppOrderLoading: true, details: [] } });
        const params = { sort_field: 'order', sort_by: 1, purpose: 'app_order' };
        getAppData(params, cancelToken)
        .then((response) => {
            appStateChange({ appOrder: { isAppOrderLoading: false, details: setAppOrderData(response) } });
        })
        .catch(() => {
            appStateChange({ appOrder: { isAppOrderLoading: false, details: [] } });
        });
    }, []);

    return (
        appOrder?.isAppOrderLoading ?
        (<SkeletonWrapper>
            <Skeleton height={20} width={100} />
            <Skeleton height={20} width={100} />
         </SkeletonWrapper>) :
        <DndProvider backend={HTML5Backend}>
            <AppOrderSettingsContainer appOrder={appOrder} appStateChange={appStateChange} />
        </DndProvider>
    );
}

export default AppOrderSettings;
