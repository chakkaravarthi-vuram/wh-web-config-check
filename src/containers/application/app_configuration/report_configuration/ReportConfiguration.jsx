import React, { useEffect, useState } from 'react';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';
import { SingleDropdown, TextInput } from '@workhall-pvt-lmt/wh-ui-library';
import { connect } from 'react-redux';

import gClasses from '../../../../scss/Typography.module.scss';
import { REPORT_CONFIGUTAION_STRINGS } from './ReportConfiguration.strings';
import { BS } from '../../../../utils/UIConstants';
import { getAppComponentByIdThunk } from '../../../../redux/actions/Appplication.Action';
import { applicationStateChange } from '../../../../redux/reducer/ApplicationReducer';
import { isEmpty, cloneDeep, get, set } from '../../../../utils/jsUtility';
import { getComponentInfoErrorMessage, getReportData } from '../AppConfigurtion.utils';
import useApiCall from '../../../../hooks/useApiCall';
import { EMPTY_STRING } from '../../../../utils/strings/CommonStrings';
import { getAllReports } from '../../../../axios/apiService/applicationDashboardReport.apiService';
import { validate } from '../../../../utils/UtilityFunctions';
import { saveCompValidationSchema } from '../../application.validation.schema';

function ReportConfiguration(props) {
 const { t } = useTranslation();
 const { FIELD: { LABEL, REPORT } } = REPORT_CONFIGUTAION_STRINGS(t);
 const {
    activeComponent,
    errorListConfig,
    getComponentById,
    applicationDataChange,
 } = props;

 const [isLoading, setIsLoading] = useState(false);
 const [search, setSearch] = useState(EMPTY_STRING);
 const [selectedReportLabel, setSelectedReportLabel] = useState(EMPTY_STRING);
 const { paginationDetails: reportListDetails, data: reportList, fetch } = useApiCall({}, true);

 useEffect(() => {
    if (activeComponent?._id) {
        setIsLoading(true);
        getComponentById(activeComponent._id)
          .then((response) => {
            const reportData = getReportData(get(response, ['component_info', 'read_preference_data'], null));
            applicationDataChange({
              activeComponent: {
                ...activeComponent,
                component_info: {
                  ...activeComponent?.component_info,
                  [REPORT.ID]: get(reportData, ['report_uuid'], null),
                },
              },
            });
            setSelectedReportLabel(get(reportData, ['report_name'], null));
            setIsLoading(false);
          })
          .catch(() => setIsLoading(false));
      }
 }, []);

 const loadData = (page = 1, search = EMPTY_STRING) => {
    const params = {
        size: 100,
        page,
    };
    if (search) params.search = search;
    fetch(getAllReports(params));
 };

 useEffect(() => loadData(1), []);

 const onSearch = async (event) => {
    const search = event.target.value;
    setSearch(event.target.value);
    await fetch(loadData(1, search));
 };

 const onLoadMoreData = () => {
   loadData(reportListDetails.page + 1, search);
 };

 const onChangeHandler = (value, _label, _unused, id) => {
    const clonedActiveComponent = cloneDeep(activeComponent);
    if (id === LABEL.ID) clonedActiveComponent[LABEL.ID] = value;
    else if (id === REPORT.ID) {
      set(clonedActiveComponent, ['component_info', REPORT.ID], value);
      setSelectedReportLabel(_label);
    }

    let error_list = {};
    if (!isEmpty(errorListConfig)) {
      error_list = { error_list_config: validate(clonedActiveComponent, saveCompValidationSchema(t)) };
    }
    applicationDataChange({ activeComponent: clonedActiveComponent, ...error_list });
 };
 const reportOptionList = (reportList || [])?.map((eachReport) => { return { label: eachReport?.report_name, value: eachReport?.report_uuid }; });

 return (
   <div className={cx(BS.W100, BS.D_FLEX, BS.FLEX_COLUMN, gClasses.Gap16)}>
     <TextInput
          id={LABEL.ID}
          value={activeComponent?.label}
          labelText={LABEL.LABEL}
          isLoading={isLoading}
          placeholder={LABEL.PLACEHOLDER}
          inputInnerClassName={BS.W100}
          onChange={(e) => {
            onChangeHandler(e?.target?.value, null, null, LABEL.ID);
          }}
          required
          errorMessage={errorListConfig?.label}
     />
        <SingleDropdown
          id={REPORT.ID}
          className={cx(BS.W100)}
          dropdownViewProps={{
            labelName: REPORT.LABEL,
            isLoading: isLoading,
            isRequired: true,
            selectedLabel: selectedReportLabel,
          }}
          errorMessage={getComponentInfoErrorMessage(errorListConfig, REPORT.ID)}
          placeholder={REPORT.PLACEHOLDER}
          optionList={reportOptionList}
          onClick={onChangeHandler}
          selectedValue={get(
            activeComponent,
            ['component_info', REPORT.ID],
            null,
          )}
          searchProps={{
            searchPlaceholder: 'Search Report',
            searchValue: search,
            onChangeSearch: onSearch,
          }}
          infiniteScrollProps={{
            dataLength: (reportList || []).length,
            next: onLoadMoreData,
            hasMore: reportListDetails?.total_count > (reportList ?? []).length,
            scrollableId: 'scrollable-report-list',
          }}
        />

   </div>
 );
}

const mapStateToProps = (state) => {
    return {
      activeComponent: state.ApplicationReducer?.activeComponent,
      errorListConfig: state.ApplicationReducer?.error_list_config,
    };
  };

const mapDispatchToProps = (dispatch) => {
    return {
      getComponentById: (id) => dispatch(getAppComponentByIdThunk(id)),
      applicationDataChange: (data) => dispatch(applicationStateChange(data)),
    };
  };

export default connect(mapStateToProps, mapDispatchToProps)(ReportConfiguration);
