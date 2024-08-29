import React, { useState } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { ETextSize, Text } from '@workhall-pvt-lmt/wh-ui-library';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import gClasses from '../../../../scss/Typography.module.scss';
import { BS } from '../../../../utils/UIConstants';
import UpDownArrowIcon from '../../../../assets/icons/UpArrowIcon';
import styles from './ConfigPanel.module.scss';
import {
  VISUALIZATION_TYPES,
  getVisualizationTypes,
} from './ConfigPanel.utils';
import AddReportFieldNew from './add_field/AddReportFieldNew';
import AddFilter from './add_filter/AddFilter';
import AdditionalConfiguration from './additional_configuration/AdditionalConfiguration';
import {
  clearDrillDownData,
  dataChange,
  setChartsData,
  setReportConfig,
} from '../../../../redux/reducer/ReportReducer';
import jsUtility from '../../../../utils/jsUtility';
import UserFilter from './user_filter/UserFilter';
import Visualization from './visualization/Visualization';
import { REPORT_CATEGORY_TYPES } from '../../Report.strings';
import CONFIG_PANEL_STRINGS from './ConfigPanel.strings';

function ConfigPanel(props) {
  const { onGetChartData, onGetReportView } = props;
  const { t } = useTranslation();
  const { SECTIONS } = CONFIG_PANEL_STRINGS(t);
  const dispatch = useDispatch();
  const {
    reports,
    sourceList,
    filter,
    reportConfig,
    userFilter,
    reportViewUserFilter,
  } = useSelector((store) => store.ReportReducer);
  const { report_category } = reportConfig.report_Data;
  const clonedSourceList = jsUtility.cloneDeep(sourceList);
  const visualizationTypes = getVisualizationTypes(
    VISUALIZATION_TYPES(t),
    report_category,
    reportConfig.visualizationType,
    reports,
  );

  const onSetChartAction = (_charts) => {
    dispatch(setChartsData(_charts));
  };

  const onSetFilterAction = (_filter) => {
    dispatch(dataChange({ data: { filter: _filter } }));
  };
  const onSetUserFilterAction = (_filter) => {
    dispatch(dataChange({ data: { userFilter: _filter } }));
  };

  const getReportData = (_filter) => {
    onGetChartData(reports, _filter);
  };

  const onVisualizationChange = (visualization) => {
    const clonedReportConfig = jsUtility.cloneDeep(reportConfig);
    clonedReportConfig.visualizationType = visualization.id;
    dispatch(setReportConfig(clonedReportConfig));
    dispatch(clearDrillDownData());
  };

  const selectedFieldInXAxis = jsUtility.find(
    reports.selectedFieldsFromReport,
    {
      axis: 'x',
    },
  );
  let dashboardListForYAxis = jsUtility.cloneDeep(clonedSourceList);
  if (selectedFieldInXAxis) {
    dashboardListForYAxis = jsUtility.concat(
      selectedFieldInXAxis,
      dashboardListForYAxis,
    );
  }

  return (
    <div>
      <ToggleSection title={SECTIONS.VISUALIZATION}>
        <Visualization
          onVisualizationChange={onVisualizationChange}
          visualizationTypes={visualizationTypes}
        />
      </ToggleSection>

      {report_category === REPORT_CATEGORY_TYPES.CHART ? (
        <>
          <ToggleSection title={SECTIONS.X_AXIS}>
            <AddReportFieldNew
              reports={reports}
              onGetChartData={onGetChartData}
              onSetChartAction={onSetChartAction}
              isFromDashboard
              dashboardList={clonedSourceList}
              axis="x"
            />
          </ToggleSection>

          <ToggleSection title={SECTIONS.Y_AXIS}>
            <AddReportFieldNew
              reports={reports}
              onGetChartData={onGetChartData}
              onSetChartAction={onSetChartAction}
              isFromDashboard
              dashboardList={dashboardListForYAxis}
              axis="y"
              visualizationType={reportConfig.visualizationType}
              onVisualizationChange={onVisualizationChange}
            />
          </ToggleSection>
        </>
      ) : (
        <ToggleSection title={SECTIONS.COLUMNS}>
          <AddReportFieldNew
            reports={reports}
            onGetChartData={onGetChartData}
            onSetChartAction={onSetChartAction}
            isFromDashboard
            dashboardList={clonedSourceList}
            isNumericRollup={
              report_category === REPORT_CATEGORY_TYPES.NUMERIC_ROLLUP
            }
            isNonTableRollup={
              report_category === REPORT_CATEGORY_TYPES.TABLE_NON_ROLLUP
            }
          />
        </ToggleSection>
      )}

      <ToggleSection title={SECTIONS.DEFAULT_FILTER}>
        <AddFilter
          filter={filter}
          onSetFilterAction={onSetFilterAction}
          getReportData={getReportData}
          isLoading={false}
          isFromDashboard
          dashboardList={clonedSourceList}
        />
      </ToggleSection>

      <ToggleSection title={SECTIONS.ADDITIONAL_CONFIGURATION}>
        <AdditionalConfiguration
          reports={reports}
          onGetChartData={onGetChartData}
          onClickReportOption={() => {}}
          isChart={report_category === REPORT_CATEGORY_TYPES.CHART}
          isNumericRollup={
            report_category === REPORT_CATEGORY_TYPES.NUMERIC_ROLLUP
          }
        />
      </ToggleSection>
      <ToggleSection title={SECTIONS.USER_FILTER}>
        <UserFilter
          filter={userFilter}
          reportViewUserFilter={reportViewUserFilter}
          onSetFilterAction={onSetUserFilterAction}
          isLoading={false}
          isFromDashboard
          dataSourceList={clonedSourceList}
          onCancelUserFilterField={getReportData}
          onGetReportView={onGetReportView}
          reports={reports}
        />
      </ToggleSection>
    </div>
  );
}

ConfigPanel.propTypes = {
  onGetChartData: PropTypes.func,
  onGetReportView: PropTypes.func,
};

function ToggleSection(props) {
  const { title, children, className = '' } = props;
  const [open, setOpen] = useState(true);

  return (
    <div
      className={cx(
        gClasses.PY15,
        gClasses.PX24,
        styles.ToggleSection,
        className,
      )}
    >
      <div className={cx(BS.D_FLEX, BS.JC_BETWEEN)}>
        <Text content={title} size={ETextSize.MD} className={styles.Title} />
        <button
          className={cx(gClasses.ClickableElement, gClasses.CursorPointer, {
            [gClasses.Rotate180]: !open,
          })}
          onClick={() => setOpen((p) => !p)}
        >
          <UpDownArrowIcon />
        </button>
      </div>
      {open && <div className={cx(gClasses.MT16)}>{children}</div>}
    </div>
  );
}

ToggleSection.propTypes = {
  title: PropTypes.string,
  children: PropTypes.object,
  className: PropTypes.string,
};

export default ConfigPanel;
