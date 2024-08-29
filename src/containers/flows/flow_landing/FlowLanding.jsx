import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import FlowDetails from './flow_details/FlowDetails';
import FlowHeader from './flow_header/FlowHeader';
import { setPointerEvent, somethingWentWrongErrorToast } from '../../../utils/UtilityFunctions';
import { FLOW_CONSTANTS, FLOW_HEADER_TYPE } from './FlowLanding.constant';
import { getFlowBasicDetailsApi } from '../../../axios/apiService/flow.apiService';
import { get } from '../../../utils/jsUtility';
import PageNotFound from '../../error_pages/PageNotFound';
import { EMPTY_STRING } from '../../../utils/strings/CommonStrings';

function FlowLanding() {
    const { t } = useTranslation();
    const { uuid, flowTab = FLOW_HEADER_TYPE.SUMMARY } = useParams();
    const [flowData, setFlowData] = useState({ isLoading: false, data: {} });
    const metaData = {
        flowId: flowData.data?.id || EMPTY_STRING, // comments -  use constants or EMPTY_STRINg
        flowUUID: uuid,
    };

    const getFlowBasedInfo = (status = FLOW_CONSTANTS(t).PUBLISHED) => {
        setPointerEvent(true);
        setFlowData((p) => { return { ...p, isLoading: true }; });
        const params = { flow_uuid: metaData.flowUUID, status };
        getFlowBasicDetailsApi(params).then((data) => {
            setFlowData({ isLoading: false, data });
        }).catch((err) => {
            const error = get(err, ['response', 'data', 'errors', 0], {});
            console.error('xyz error', err, error);
            const errorObj = {};
            if (error.type === 'not_exist') {
              errorObj.noDataFound = true;
            }
            setFlowData({ isLoading: false, data: {}, ...errorObj });
            somethingWentWrongErrorToast();
        }).finally(() => {
            setPointerEvent(false);
        });
    };

    useEffect(() => {
        getFlowBasedInfo();
    }, []);

    const onToggleHandler = (status) => getFlowBasedInfo(status);

    if (flowData.noDataFound) {
        return <PageNotFound />;
    }

    return (
      <div>
        <FlowHeader
          isLoading={flowData.isLoading}
          flowData={flowData.data}
          currentTab={flowTab}
          metaData={metaData}
          onToggle={onToggleHandler}
        />
        <FlowDetails
          isBasicInfoLoading={flowData.isLoading}
          metaData={metaData}
          currentTab={flowTab}
          flowName={flowData?.data?.flowName}
        />
      </div>
    );
}

export default FlowLanding;

FlowLanding.propTypes = {
    dataListUUID: PropTypes.string,
};
