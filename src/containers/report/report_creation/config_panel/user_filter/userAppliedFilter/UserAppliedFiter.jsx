import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames/bind';
import { useTranslation } from 'react-i18next';
import { keydownOrKeypessEnterHandle } from 'utils/UtilityFunctions';
import CloseIconNewSmall from 'assets/icons/CloseIconNewSmall';
import { useDispatch } from 'react-redux';
import jsUtils from '../../../../../../utils/jsUtility';
import gClasses from '../../../../../../scss/Typography.module.scss';
import styles from '../../add_filter/AddFilter.module.scss';
import { REPORT_STRINGS } from '../../../../Report.strings';
import { dataChange } from '../../../../../../redux/reducer/ReportReducer';

function UserAppliedFilter(props) {
  const { t } = useTranslation();
  const {
    index,
    filter,
    filterFieldDetails,
    onGetReportView,
    reports,
    reportViewUserFilter,
  } = props;
  const { ERRORS } = REPORT_STRINGS(t);
  const dispatch = useDispatch();
  const onUserFilterRemoveHandler = () => {
    const cloneReportViewUserFilter = jsUtils.cloneDeep(reportViewUserFilter);
    const cloneReportUserFilterFieldDetails = jsUtils.cloneDeep(
      reportViewUserFilter.inputFieldDetailsForFilter,
    );
    const deletedUserFilterIndex =
      cloneReportUserFilterFieldDetails[index].output_key;
    cloneReportViewUserFilter.inputFieldDetailsForFilter =
      cloneReportUserFilterFieldDetails.filter(
        (data) => data.output_key !== deletedUserFilterIndex,
      );
    dispatch(
      dataChange({
        data: {
          reportViewUserFilter: cloneReportViewUserFilter,
        },
      }),
    );
    onGetReportView(
      reports,
      filter,
      undefined,
      true,
      cloneReportViewUserFilter,
    );
  };

  return (
    <div className={gClasses.MB8}>
      <button
        className={cx(
          styles.FilterBtn,
          styles.SelectedField,
          { [styles.Error]: filterFieldDetails.isFieldDeleted },
        )}
      >
        <div className={styles.FilterTextCompleted}>
          <div>{filterFieldDetails.fieldNames}</div>
          <button
            className={cx(
              gClasses.CursorPointer,
              gClasses.ClickableElement,
              styles.closeBtn,
            )}
            onClick={onUserFilterRemoveHandler}
            onKeyDown={(e) =>
              keydownOrKeypessEnterHandle(e) && e.stopPropagation()
            }
          >
            <CloseIconNewSmall />
          </button>
        </div>
      </button>
      {filterFieldDetails.isFieldDeleted && (
        <div
          role="alert"
          aria-hidden="false"
          className={cx(gClasses.FTwo12RedV2)}
        >
          {ERRORS.FIELD_DELETED_FROM_SOURCE}
        </div>
      )}
    </div>
  );
}

UserAppliedFilter.propTypes = {
  index: PropTypes.number,
  filter: PropTypes.object,
  filterFieldDetails: PropTypes.objectOf({
    fieldNames: PropTypes.string,
    isFieldDeleted: PropTypes.bool,
  }),
  onGetReportView: PropTypes.func,
  reports: PropTypes.object,
  reportViewUserFilter: PropTypes.object,
};

export default UserAppliedFilter;
