import React, { useEffect } from 'react';
import cx from 'classnames';
import gClasses from 'scss/Typography.module.scss';
import { connect, useDispatch } from 'react-redux';
import {
  EToastType,
  Skeleton,
  toastPopOver,
} from '@workhall-pvt-lmt/wh-ui-library';
import {
  INDIVIDUAL_ENTRY_MODE,
  INDIVIDUAL_ENTRY_TAB_TYPES,
  INDIVIDUAL_ENTRY_TYPE,
} from './IndividualEntry.strings';
import styles from './IndividualEntry.module.scss';
import EntryTasks from './entry_tasks/EntryTasks';
import NotesAndReminders from './notes_and_reminders/NotesAndReminders';
import UserAndSystemActions from './user_and_system_actions/UserAndSystemActions';
import DataAudit from './data_audit/DataAudit';
import SummaryBuilder from './summary_builder/SummaryBuilder';
import {
  getAllDashboardPagesThunk,
  getIndividualDefaultReportByIdThunk,
} from '../../../redux/actions/IndividualEntry.Action';
import {
  dataChange,
  leadAndClearReducer,
} from '../../../redux/reducer/IndividualEntryReducer';
import IndividualEntryTab from './individual_entry_tab/IndividualEntryTab';
import ExecutionSummary from './flow_summary/ExecutionSummary';
import { getAllFlowStepsApi } from '../../../axios/apiService/form.apiService';
import jsUtility from '../../../utils/jsUtility';

function IndividualEntry(props) {
  const {
    mode,
    type,
    metaData,
    otherDetails,
    individualEntryErrors,
    dashboardErrors,
    onUpdateError,
    state: {
      pagesList,
      isPagesLoading,
      currentPageDetails,
      pageMetadata,
      isCustomPageDataLoading,
      isAdminOwnerViewer,
    },
  } = props;

  const dispatch = useDispatch();
  const isDevMode = [
    INDIVIDUAL_ENTRY_MODE.DEVELOP_MODE,
    INDIVIDUAL_ENTRY_MODE.READ_ONLY_MODE,
  ].includes(mode);

  useEffect(() => {
    if (isDevMode && metaData?.moduleId) {
      const params = {};
      if (type === INDIVIDUAL_ENTRY_TYPE.FLOW) {
        params.flow_id = metaData.moduleId;
      } else if (type === INDIVIDUAL_ENTRY_TYPE.DATA_LIST) {
        params.data_list_id = metaData.moduleId;
      }
      dispatch(getIndividualDefaultReportByIdThunk(params))
        .then((res) => {
          if (res) {
            if (res?._id) {
              dispatch(
                getAllDashboardPagesThunk(
                  { dashboard_id: res?._id },
                  true,
                  type,
                  false,
                  mode === INDIVIDUAL_ENTRY_MODE.READ_ONLY_MODE,
                ),
              );
              if (type === INDIVIDUAL_ENTRY_TYPE.FLOW) {
                const params = { flow_id: metaData?.moduleId, size: 100 };
                getAllFlowStepsApi(params).then((data) => {
                  const userStepList = data?.paginationData?.filter(
                    (step) => step.stepType === 'user_step',
                  );
                  dispatch(dataChange({ flowStepList: userStepList }));
                });
              }
            }
          }
        })
        .catch((error) => {
          console.log(error, 'getAllDashboardPagesThunkError');
        });
    }
    return () => {
      if (isDevMode) {
        dispatch(leadAndClearReducer());
      }
    };
  }, []);

  useEffect(() => {
    if (
      mode !== INDIVIDUAL_ENTRY_MODE.DEVELOP_MODE ||
      pagesList.length === 0 ||
      jsUtility.isEmpty(individualEntryErrors?.formErrors)
    ) {
      return;
    }
    const clonePageList = jsUtility.cloneDeep(pagesList).map((data) => {
      data.hasError = false;
      return data;
    });
    (individualEntryErrors?.formErrors || []).forEach((errorObj) => {
      const key = errorObj?.field?.split('.');
      if (!jsUtility.isEmpty(key)) {
        const index = clonePageList.findIndex(
          (page) => Number(page.index) === Number(key[2]),
        );
        if (index > -1) {
          clonePageList[index].hasError = true;
        }
      }
    });
    const errorPagesList = clonePageList.filter((page) => page.hasError);
    toastPopOver({
      title: 'Entry Page',
      subtitle: `Error in ${errorPagesList
        .map((data) => data.labelText)
        .join(', ')} page's`,
      toastType: EToastType.error,
    });
    dispatch(dataChange({ pagesList: clonePageList }));
  }, [individualEntryErrors, pagesList.length]);

  const getEntryTabData = (pageType) => {
    switch (pageType) {
      case INDIVIDUAL_ENTRY_TAB_TYPES.PAGE_BUILDER:
        return isCustomPageDataLoading && !currentPageDetails?.pageId ? (
          <Skeleton height={200} />
        ) : (
          <SummaryBuilder
            mode={mode}
            type={type}
            metaData={{ ...metaData }}
            pageMetaData={pageMetadata}
            pageIndex={currentPageDetails.index}
            formErrorList={individualEntryErrors?.formErrors || []}
            dashboardErrors={dashboardErrors}
          />
        );
      case INDIVIDUAL_ENTRY_TAB_TYPES.TASKS:
        return (
          <EntryTasks
            mode={mode}
            type={type}
            metaData={metaData}
            otherDetails={otherDetails}
          />
        );
      case INDIVIDUAL_ENTRY_TAB_TYPES.NOTES_REMAINDERS:
        return (
          <NotesAndReminders mode={mode} type={type} metaData={metaData} />
        );
      case INDIVIDUAL_ENTRY_TAB_TYPES.USER_ACTION:
        return (
          <UserAndSystemActions mode={mode} type={type} metaData={metaData} />
        );
      case INDIVIDUAL_ENTRY_TAB_TYPES.DATA_AUDIT:
        return <DataAudit mode={mode} type={type} metaData={metaData} />;
      case INDIVIDUAL_ENTRY_TAB_TYPES.EXECUTION_SUMMARY:
        return (
          <ExecutionSummary
            mode={mode}
            type={type}
            metaData={metaData}
            otherDetails={{
              ...otherDetails,
              isAdminViewerNormalMode:
                otherDetails?.isAdminViewerNormalMode ?? isAdminOwnerViewer,
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <section
      className={cx(
        { [gClasses.P24]: mode === INDIVIDUAL_ENTRY_MODE.DEVELOP_MODE },
        gClasses.BackgroundWhite,
      )}
    >
      {isPagesLoading ? (
        <Skeleton height={200} />
      ) : (
        <>
          {isDevMode && (
            <div
              className={cx(
                gClasses.ZIndex2,
                gClasses.PositionRelative,
                styles.TabContainer,
                {
                  [gClasses.H100Imp]: !isDevMode,
                },
              )}
            >
              <IndividualEntryTab
                mode={mode}
                type={type}
                onUpdateError={onUpdateError}
                isLoading={isCustomPageDataLoading}
                pagesList={pagesList}
                currentTab={currentPageDetails}
                pageMetadata={pageMetadata}
              />
            </div>
          )}
          <div
            className={cx({
              [gClasses.H100Imp]: !isDevMode,
              [styles.ReadOnlyClass]:
                mode === INDIVIDUAL_ENTRY_MODE.READ_ONLY_MODE,
              [styles.TabDetails]: isDevMode,
            })}
          >
            {getEntryTabData(currentPageDetails?.type)}
          </div>
        </>
      )}
    </section>
  );
}

const mapStateToProps = (state) => {
  const {
    pagesList,
    isPagesLoading,
    currentPageDetails,
    pageMetadata,
    isCustomPageDataLoading,
    isAdminOwnerViewer,
  } = state.IndividualEntryReducer;
  return {
    state: {
      pagesList,
      isPagesLoading,
      currentPageDetails,
      pageMetadata,
      isCustomPageDataLoading,
      isAdminOwnerViewer,
    },
  };
};

export default connect(mapStateToProps, null)(IndividualEntry);
