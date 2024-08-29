import React, { useEffect, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import ThemeContext from 'hoc/ThemeContext';
import {
  getDatalistDetailsByUUIDActionThunk,
  getDatalistFiltersActionThunk,
  getDefaultReportByUUIDThunk,
} from '../../../../../redux/actions/ApplicationDashboardReport.Action';
import jsUtility from '../../../../../utils/jsUtility';
import DatalistDashboard from './datalist_dashboard/DatalistDashboard';
import { getElementLabelWithMessage } from '../flow/Flow.utils';
import { ELEMENT_MESSAGE_TYPE } from '../flow/Flow.strings';
import {
  clearDatalistDashboard,
  setDatalistDashboardLoader,
} from '../../../../../redux/reducer/ApplicationDashboardReportReducer';

function Datalist(props) {
  const {
    uuid: uuid_,
    componentId,
    componentLabel,
    cancelToken,
    isAppDashboard,
    componentDetails,
    componentContainer,
  } = props;
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { colorScheme } = useContext(ThemeContext);
  const params = useParams();
  const uuid = uuid_ || params?.uuid;
  const datalistDashboard = useSelector(
    (store) => store.ApplicationDashboardReportReducer.datalistDashboard,
  );

  useEffect(() => {
    dispatch(setDatalistDashboardLoader(true));
    dispatch(getDatalistDetailsByUUIDActionThunk(uuid))
      .then(() =>
        dispatch(getDatalistFiltersActionThunk(uuid)).then(() =>
          dispatch(getDefaultReportByUUIDThunk({ data_list_uuid: uuid })),
        ),
      )
      .finally(() => dispatch(setDatalistDashboardLoader(false)));
    return () => uuid && dispatch(clearDatalistDashboard({ id: uuid }));
  }, [uuid]);

  const datalistData = datalistDashboard[uuid];

  if (
    datalistDashboard.isLoading ||
    jsUtility.isEmpty(datalistData)
  ) {
    return getElementLabelWithMessage(
      componentLabel,
      colorScheme,
      ELEMENT_MESSAGE_TYPE.LOADING,
      t,
    );
  }

  if (datalistData?.errors?.type) {
    return getElementLabelWithMessage(
      componentLabel,
      colorScheme,
      ELEMENT_MESSAGE_TYPE.INVALID_ACCESS,
      t,
    );
  }

  if (
    !datalistData?.filter ||
    datalistData?.filter?.inputFieldDetailsForFilter.length === 0
  ) {
    return getElementLabelWithMessage(
      componentLabel,
      colorScheme,
      ELEMENT_MESSAGE_TYPE.NO_DATA_FOUND,
      t,
    );
  }

  return (
    <div>
      <DatalistDashboard
        datalistData={datalistData}
        componentLabel={componentLabel}
        componentId={componentId}
        cancelToken={cancelToken}
        _datalistUuid={uuid}
        componentContainer={componentContainer}
        isAppDashboard={isAppDashboard}
        componentDetails={componentDetails}
      />
    </div>
  );
}

export default Datalist;
