import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';
import {
  Button,
  EButtonSizeType,
  EButtonType,
  ETitleHeadingLevel,
  ETitleSize,
  Skeleton,
  Tab,
  Table,
  TableColumnWidthVariant,
  TableSortOrder,
  Text,
  Title,
} from '@workhall-pvt-lmt/wh-ui-library';
import gClasses from 'scss/Typography.module.scss';
import FilterDashboardIcon from '../../../../assets/icons/dashboards/FilterDashboardIcon';
import DownloadDashboardIcon from '../../../../assets/icons/dashboards/DownloadDashboardIcon';
import RefreshDashboardIcon from '../../../../assets/icons/dashboards/RefreshDashboardIcon';
import ThemeContext from '../../../../hoc/ThemeContext';
import DASHBOARD_CONFIG_STRINGS, {
  TAB_VALUES,
} from '../DashboardConfig.strings';
import { useDashboardConfigProvider } from '../DashboardConfigReducer';
import {
  getDashboardTabOptions,
  getTaskTableHeaders,
  getClassNameForDataColumn,
} from '../DashboardConfig.utils';
import styles from '../DashboardConfig.module.scss';
import { PIXEL_CONSTANTS } from '../../../../utils/UIConstants';

function Preview(props) {
  const { isReadOnlyMode, reportName } = props;
  const {
    state: { columnList, additionalConfig, isLoading },
  } = useDashboardConfigProvider();
  const { t } = useTranslation();
  const { colorScheme } = useContext(ThemeContext);
  const [selectedTab, setSelectedTab] = useState(TAB_VALUES.ALL_REQUEST);
  const {
    CONFIG_PANEL: {
      FIELDS: { ADDITIONAL_CONFIG },
    },
  } = DASHBOARD_CONFIG_STRINGS(t);

  useEffect(() => {
    if (!additionalConfig[ADDITIONAL_CONFIG.ENABLE_TASK.VALUE]) {
      setSelectedTab(TAB_VALUES.ALL_REQUEST);
    }
  }, [additionalConfig[ADDITIONAL_CONFIG.ENABLE_TASK.VALUE]]);

  const dataHeaderList = columnList.map((field) => {
    return {
      id: field._id,
      component: (
        <Text
          title={field.label}
          className={cx(gClasses.FTwo12BlackV21,
          gClasses.FontWeight500,
          styles.HeaderEllipsis)}
          content={field.label}
        />
      ),
      sortBy: field._id,
      sortOrder: TableSortOrder.DESC,
      className: getClassNameForDataColumn(field.width),
    };
  });

  return (
    <div
      className={cx(styles.MainPreview, { [gClasses.P20]: !isReadOnlyMode })}
    >
      {isLoading ? (
        <div>
          <div
            className={cx(
              gClasses.FlexJustifyBetween,
              gClasses.MT10,
              gClasses.MY20,
            )}
          >
            <Skeleton width={PIXEL_CONSTANTS.ONE_EIGHT_PIXEL} height={20} />
            <Skeleton width={220} height={20} />
          </div>
          <div className={cx(gClasses.CenterV, gClasses.gap5)}>
            {Array(6)
              .fill()
              .map((num, index) => (
                <Skeleton key={`${num}_${index}`} width={148} height={30} />
              ))}
          </div>
        </div>
      ) : (
        <div className={styles.Preview}>
          <div>
            <div className={cx(gClasses.FlexJustifyBetween, gClasses.MB10)}>
              <Title
                content={reportName}
                headingLevel={ETitleHeadingLevel.h2}
                size={ETitleSize.xs}
              />
              <div className={cx(gClasses.CenterVImportant, gClasses.Gap16)}>
                <FilterDashboardIcon
                  isAppFilter
                  className={gClasses.CursorPointer}
                />
                <RefreshDashboardIcon
                  isAppColor
                  className={gClasses.CursorPointer}
                />
                {additionalConfig[ADDITIONAL_CONFIG.ENABLE_DOWNLOAD.VALUE] && (
                  <DownloadDashboardIcon className={gClasses.CursorPointer} />
                )}
                {additionalConfig[
                  ADDITIONAL_CONFIG.ENABLE_START_ADD_NEW.VALUE
                ] && (
                  <Button
                    className={gClasses.ML10}
                    type={EButtonType.PRIMARY}
                    size={EButtonSizeType.SM}
                    colorSchema={colorScheme}
                    buttonText={
                      additionalConfig[
                        ADDITIONAL_CONFIG.ENABLE_START_ADD_NEW.ID
                      ]
                    }
                  />
                )}
              </div>
            </div>
            {additionalConfig[ADDITIONAL_CONFIG.ENABLE_TASK.VALUE] && (
              <div className={cx(styles.MainTabClass, gClasses.MB12)}>
                <Tab
                  options={getDashboardTabOptions(
                    additionalConfig[ADDITIONAL_CONFIG.ENABLE_TASK.ID],
                    t,
                  )}
                  selectedTabIndex={selectedTab}
                  onClick={setSelectedTab}
                  colorScheme={colorScheme}
                  textClass={gClasses.MB8}
                />
              </div>
            )}
          </div>
          <div className={gClasses.OverflowXAuto}>
            {selectedTab === TAB_VALUES.ALL_REQUEST && (
              <Table
                id="datalistDashboard"
                className={gClasses.PB12}
                header={dataHeaderList}
                headerClass={cx(
                  gClasses.FTwo12BlackV21,
                  gClasses.FontWeight500,
                  styles.HeaderEllipsis,
                )}
                data={[]}
                isRowClickable
                widthVariant={TableColumnWidthVariant.CUSTOM}
                onRowClick={() => {}}
                paginationProps={{}}
                colorScheme={colorScheme}
              />
            )}
            {selectedTab === TAB_VALUES.TASKS && (
              <Table
                id="taskDashboard"
                className={gClasses.PB12}
                headerClass={cx(
                  gClasses.FTwo12BlackV21,
                  gClasses.FontWeight500,
                )}
                header={getTaskTableHeaders(t)}
                data={[]}
                widthVariant={TableColumnWidthVariant.CUSTOM}
                onRowClick={() => {}}
                paginationProps={{}}
                colorScheme={colorScheme}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

Preview.propTypes = {
  isReadOnlyMode: PropTypes.bool,
  reportName: PropTypes.string,
};

export default Preview;
