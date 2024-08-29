import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';
import Preview from './preview/Preview';
import ConfigPanel from './config_panel/ConfigPanel';
import styles from './DashboardConfig.module.scss';
import DashboardConfigReducer, {
  clearDashboardConfig,
  dataChange,
  useDashboardConfigProvider,
} from './DashboardConfigReducer';
import {
  getAllDataFieldThunk,
  getDefaultReportByIdThunk,
  saveDefaultReportThunk,
} from '../../../redux/actions/DashboardConfig.Action';
import jsUtility from '../../../utils/jsUtility';
import { CancelToken, validate } from '../../../utils/UtilityFunctions';
import { dashboardConfigSaveSchema } from './DashboardConfig.validation.schema';

const cancelTokenSaveDashboardConfig = new CancelToken();

function DashboardConfig(props) {
  const {
    dataListId,
    flowId,
    name,
    onUpdateError,
    isReadOnlyMode = false,
  } = props;
  const { t } = useTranslation();
  const { state, dispatch } = useDashboardConfigProvider();

  useEffect(() => {
    const params = {};
    if (dataListId) {
      params.data_list_id = dataListId;
    } else if (flowId) {
      params.flow_id = flowId;
    }
    if (!jsUtility.isEmpty(params)) {
      if (!isReadOnlyMode) {
        getAllDataFieldThunk(
          {
            page: 1,
            size: 1000,
            field_list_type: 'direct',
            sort_by: 1,
            identifier_input_type: 'default_report_fields',
            include_property_picker: 1,
            ...params,
          },
          dispatch,
        ).then((fieldList) => {
          getDefaultReportByIdThunk(params, dispatch, fieldList);
        });
      } else {
        getDefaultReportByIdThunk(params, dispatch);
      }
    }
  }, [dataListId, flowId]);

  useEffect(
    () => () => {
      dispatch(clearDashboardConfig);
    },
    [],
  );

  const onSaveDefaultReport = (updateState) => {
    const cloneState = { ...state, ...updateState };
    if (!jsUtility.isEmpty(cloneState.dashboardId)) {
      const saveDefaultReportData = {
        _id: cloneState.dashboardId,
        report: {
          table_columns: cloneState.columnList,
          sorting: [cloneState.sorting],
        },
        features: cloneState.additionalConfig,
      };
      const errorList = validate(
        saveDefaultReportData,
        dashboardConfigSaveSchema(t),
      );
      if (jsUtility.isEmpty(errorList)) {
        dispatch(dataChange({ errorList: {} }));
        onUpdateError({});
        if (cancelTokenSaveDashboardConfig.cancelToken) {
          cancelTokenSaveDashboardConfig.cancelToken?.();
        }
        saveDefaultReportThunk(
          jsUtility.cloneDeep(saveDefaultReportData),
          cancelTokenSaveDashboardConfig.setCancelToken,
          dispatch,
        );
      } else {
        dispatch(dataChange({ errorList }));
        onUpdateError(errorList);
      }
    }
  };

  return (
    <section
      className={cx(styles.DashboardConfig, {
        [styles.ReadOnlyMode]: isReadOnlyMode,
      })}
    >
      <Preview isReadOnlyMode={isReadOnlyMode} reportName={name} />
      {!isReadOnlyMode && <ConfigPanel onSave={onSaveDefaultReport} />}
    </section>
  );
}

DashboardConfig.propTypes = {
  dataListId: PropTypes.string,
  flowId: PropTypes.string,
  name: PropTypes.string,
  onUpdateError: PropTypes.func,
  isReadOnlyMode: PropTypes.bool,
};

function ProviderDashboardConfig(props) {
  return (
    <DashboardConfigReducer>
      <DashboardConfig {...props} />
    </DashboardConfigReducer>
  );
}

export default ProviderDashboardConfig;
