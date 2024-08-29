import React, { lazy } from 'react';
import cx from 'classnames/bind';
import BellIcon from 'assets/icons/BellIcon';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { ARIA_ROLES, BS } from '../../../../../../utils/UIConstants';
import { BUTTON_TYPE } from '../../../../../../utils/Constants';
import gClasses from '../../../../../../scss/Typography.module.scss';
import { RESPONDANTS_SUMMARY_STRINGS } from './RespondantsSummary.strings';
import { getRespondantsSummaryTableData } from './RespondantsSummary.utils';
import styles from '../../TaskContent.module.scss';
import { isBasicUserMode } from '../../../../../../utils/UtilityFunctions';

// lazy imports
const Pagination = lazy(() => import('components/form_components/pagination/Pagination'));
const Button = lazy(() => import('components/form_components/button/Button'));
const Table = lazy(() => import('components/table/Table'));

function RespondantsSummary(props) {
  const {
    allInstances,
    onNudgeClickHandler,
    onNudgeAllClickHandler,
    activePage,
    itemsCountPerPage,
    totalItemsCount,
    onPageChangeHandler,
    isCompletedTask,
    downloadButton = null,
  } = props;
  const { t } = useTranslation();
  const history = useHistory();
  const isNormalMode = isBasicUserMode(history);
  const showCreateTask = useSelector((state) => state.RoleReducer.is_show_app_tasks);
  const { TITLE, NUDGE_ALL_BUTTON, TABLE_TITLES } =
    RESPONDANTS_SUMMARY_STRINGS;
  const tableRowData = getRespondantsSummaryTableData(
    allInstances,
    onNudgeClickHandler,
    styles.TableNudge,
    t,
    !isNormalMode || showCreateTask,
    history,
  );
  return (
    <>
      <div
        className={cx(
          gClasses.CenterV,
          BS.JC_BETWEEN,
          BS.D_FLEX,
          gClasses.MT20,
          gClasses.MB20,
        )}
      >
        <div className={gClasses.SectionSubTitle}>{TITLE(t).TITLE}</div>
        <div className={cx(BS.D_FLEX, BS.JC_END)}>
          <div className={gClasses.MR10}>{downloadButton}</div>
          <Button
            buttonType={BUTTON_TYPE.SECONDARY}
            disabled={isCompletedTask}
            onClick={onNudgeAllClickHandler}
          >
            <div className={cx(BS.D_FLEX, gClasses.CenterVH)}>
              <BellIcon className={styles.NudgeIcon} role={ARIA_ROLES.IMG} ariaHidden ariaLabel={RESPONDANTS_SUMMARY_STRINGS.ARIA_LABEL(t).NUDGE} />
              <div className={cx(gClasses.ML5)}>{NUDGE_ALL_BUTTON(t).LABEL}</div>
            </div>
          </Button>
        </div>
      </div>
      <Table
        header={[
          TABLE_TITLES(t).ASSIGNEE_NAME,
          TABLE_TITLES(t).IS_RESPONDED,
          TABLE_TITLES(t).RESPONDED_ON,
          TABLE_TITLES(t).NUDGE,
        ]}
        data={tableRowData}
        rowClassName={styles.Table}
        isRuleTable
      />
      <Pagination
        activePage={activePage}
        itemsCountPerPage={itemsCountPerPage}
        totalItemsCount={totalItemsCount}
        onChange={onPageChangeHandler}
        className={gClasses.MT15}
        flowDashboardView
      />
    </>
  );
}

export default RespondantsSummary;
