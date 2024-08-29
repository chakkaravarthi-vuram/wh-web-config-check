import React, { useEffect, useRef } from 'react';
import { connect, useDispatch } from 'react-redux';
import { SingleDropdown, TextInput } from '@workhall-pvt-lmt/wh-ui-library';
import cx from 'classnames/bind';
import { useTranslation } from 'react-i18next';
import {
  clearDashboardConfig,
  setDashboardConfigDataChange,
} from '../../../../redux/reducer/ApplicationDashboardReportReducer';
import {
  applicationStateChange,
  setApplicationActiveComponentDataChange,
} from '../../../../redux/reducer/ApplicationReducer';
import styles from './DashboardConfig.module.scss';
import { BS } from '../../../../utils/UIConstants';
import gClasses from '../../../../scss/Typography.module.scss';
import jsUtility, {
  isEmpty,
  get,
  cloneDeep,
} from '../../../../utils/jsUtility';
import {
  getAppComponentByIdThunk,
  getAppsAllFlowsThunk,
  getDashboardAppsAllDataListsThunk,
} from '../../../../redux/actions/Appplication.Action';
import {
  EMPTY_STRING,
  LABEL_CONSTANT,
  SEARCH_LABEL,
  SELECT_LABEL,
  SELECT_TYPE_LABEL,
} from '../../../../utils/strings/CommonStrings';
import {
  NO_DATA_FOUND_STRINGS,
  TYPE_OPTION_LIST,
} from './DashboardConfig.strings';
import { validate } from '../../../../utils/UtilityFunctions';
import { saveCompValidationSchema } from '../../application.validation.schema';
import {
  getComponentInfoErrorMessage,
  getDashboardSourceData,
} from '../AppConfigurtion.utils';

const getValidationData = (label, type, dashboard_type, source_uuid, t) =>
  validate(
    {
      label,
      type,
      component_info: {
        type: dashboard_type,
        source_uuid: source_uuid,
      },
    },
    saveCompValidationSchema(t),
  );

function DashboardConfig(props) {
  const {
    type,
    activeComponentData,
    error_list_config,
    dashboardConfigData,
    applicationDataChange,
    getComponentById,
  } = props;
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const hiddenVisibilityRef = useRef(null);

  useEffect(() => {
    const clonedActiveComponentData = jsUtility.cloneDeep(activeComponentData);
    clonedActiveComponentData.component_info = {};
    clonedActiveComponentData.component_info = {
      type: EMPTY_STRING,
      source_uuid: EMPTY_STRING,
    };
    dispatch(
      setApplicationActiveComponentDataChange(clonedActiveComponentData),
    );
  }, [jsUtility.isEmpty(activeComponentData.component_info)]);

  const {
    isLoading,
    typeDDSelectedValue,
    dashboardDDSearchText,
    dashboardDDOptionList,
    dashboardDDSelectedLabel,
    dashboardDDSelectedValue,
  } = dashboardConfigData;

  const size = 100;

  const getOptionList = (search = EMPTY_STRING, type = EMPTY_STRING) => {
    const params = {
      page: 1,
      size,
    };
    if (search !== EMPTY_STRING) {
      params.search = search;
    }
    if (type === TYPE_OPTION_LIST(t)[0].value) {
      dispatch(getAppsAllFlowsThunk(params));
    } else if (type === TYPE_OPTION_LIST(t)[1].value) {
      dispatch(getDashboardAppsAllDataListsThunk(params));
    }
  };

  useEffect(() => {
    if (activeComponentData?._id) {
      dispatch(setDashboardConfigDataChange({ isLoading: true }));
      getComponentById(activeComponentData._id)
        .then((response) => {
          const dashboardData = getDashboardSourceData(
            get(
              jsUtility.cloneDeep(activeComponentData),
              ['component_info', 'source_uuid'],
              null,
            ),
            get(response, ['component_info', 'read_preference_data'], {}),
          );
          applicationDataChange({
            activeComponent: {
              ...activeComponentData,
              component_info: {
                ...activeComponentData?.component_info,
                source_uuid: dashboardData?.uuid,
              },
            },
          });
          const clonedDashboardConfigData =
            jsUtility.cloneDeep(dashboardConfigData);
          clonedDashboardConfigData.component_info =
            activeComponentData?.component_info || {
              type: EMPTY_STRING,
              source_uuid: EMPTY_STRING,
            };
          clonedDashboardConfigData.dashboardDDSelectedValue =
            activeComponentData?.component_info?.source_uuid || EMPTY_STRING;
          clonedDashboardConfigData.typeDDSelectedValue =
            activeComponentData?.component_info?.type || EMPTY_STRING;
          clonedDashboardConfigData.isLoading = false;
          clonedDashboardConfigData.dashboardDDSelectedLabel =
            dashboardData?.label;
          getOptionList(
            EMPTY_STRING,
            activeComponentData?.component_info?.type || EMPTY_STRING,
          );
          dispatch(setDashboardConfigDataChange(clonedDashboardConfigData));
        })
        .catch(() =>
          dispatch(setDashboardConfigDataChange({ isLoading: false })),
        );
    }
    return () => {
      dispatch(clearDashboardConfig());
    };
  }, []);

  const onClickType = (value, label, modifiedOptionList) => {
    const clonedDashboardConfigData = jsUtility.cloneDeep(dashboardConfigData);
    clonedDashboardConfigData.typeDDSelectedValue = value;
    // clonedDashboardConfigData.typeDDSelectedLabel = label;
    clonedDashboardConfigData.typeDDOptionList = modifiedOptionList;
    clonedDashboardConfigData.dashboardDDSearchText = EMPTY_STRING;
    clonedDashboardConfigData.dashboardDDSelectedValue = EMPTY_STRING;
    clonedDashboardConfigData.dashboardDDSelectedLabel = EMPTY_STRING;
    getOptionList(EMPTY_STRING, value);
    dispatch(setDashboardConfigDataChange(clonedDashboardConfigData));
    const clonedActiveComponentData = jsUtility.cloneDeep(activeComponentData);
    clonedActiveComponentData.component_info.type = jsUtility.cloneDeep(
      clonedDashboardConfigData.typeDDSelectedValue,
    );
    if (!isEmpty(error_list_config)) {
      const errorList = getValidationData(
        activeComponentData?.label,
        type,
        value,
        dashboardDDSelectedValue,
        t,
      );
      dispatch(applicationStateChange({ error_list_config: errorList }));
    }
    dispatch(
      setApplicationActiveComponentDataChange(clonedActiveComponentData),
    );
  };

  const onChangeDDFlowSearch = (event) => {
    const searchValue = event.target.value;
    const clonedDashboardConfigData = jsUtility.cloneDeep(dashboardConfigData);
    clonedDashboardConfigData.dashboardDDSearchText = searchValue;
    getOptionList(searchValue, typeDDSelectedValue);
    dispatch(setDashboardConfigDataChange(clonedDashboardConfigData));
  };

  const onClickDD = (value, label, modifiedOptionList) => {
    const clonedDashboardConfigData = jsUtility.cloneDeep(dashboardConfigData);
    clonedDashboardConfigData.dashboardDDSelectedValue = value;
    clonedDashboardConfigData.dashboardDDSelectedLabel = label;
    clonedDashboardConfigData.dashboardDDOptionList = modifiedOptionList;
    dispatch(setDashboardConfigDataChange(clonedDashboardConfigData));
    const clonedActiveComponentData = jsUtility.cloneDeep(activeComponentData);
    clonedActiveComponentData.component_info.source_uuid =
      clonedDashboardConfigData.dashboardDDSelectedValue;
      clonedActiveComponentData.label = label;
    if (!isEmpty(error_list_config)) {
      const errorList = getValidationData(
        activeComponentData?.label,
        type,
        typeDDSelectedValue,
        value,
        t,
      );
      dispatch(applicationStateChange({ error_list_config: errorList }));
    }
    dispatch(
      setApplicationActiveComponentDataChange(clonedActiveComponentData),
    );
  };

  const onChangeLabel = (event) => {
    const labelValue = event.target.value;
    const clonedActiveComponentData = jsUtility.cloneDeep(activeComponentData);
    clonedActiveComponentData.label = labelValue;
    if (!isEmpty(error_list_config)) {
      const errorList = getValidationData(
        labelValue,
        type,
        typeDDSelectedValue,
        dashboardDDSelectedValue,
        t,
      );
      dispatch(applicationStateChange({ error_list_config: errorList }));
    }
    dispatch(
      setApplicationActiveComponentDataChange(clonedActiveComponentData),
    );
  };

  const onClearSearch = () => {
    if (dashboardDDSearchText) {
      const clonedDashboardConfigData =
        jsUtility.cloneDeep(dashboardConfigData);
      clonedDashboardConfigData.dashboardDDSearchText = EMPTY_STRING;
      getOptionList(EMPTY_STRING, typeDDSelectedValue);
      dispatch(setDashboardConfigDataChange(clonedDashboardConfigData));
    }
  };

  let dashboardTypeLabel = EMPTY_STRING;
  if (cloneDeep(typeDDSelectedValue)) {
    dashboardTypeLabel =
      cloneDeep(typeDDSelectedValue) === TYPE_OPTION_LIST(t)[0].value
        ? TYPE_OPTION_LIST(t)[0].label
        : TYPE_OPTION_LIST(t)[1].label;
  }

  return (
    <div className={cx(BS.D_FLEX, BS.FLEX_COLUMN, BS.W100)}>
      <div className={cx(BS.D_FLEX, BS.JC_BETWEEN)}>
        <div className={cx(gClasses.W35, gClasses.MR20)}>
          <SingleDropdown
            dropdownViewProps={{
              labelName: t(SELECT_TYPE_LABEL),
              selectedLabel: dashboardTypeLabel,
              isRequired: true,
            }}
            selectedValue={typeDDSelectedValue}
            isLoading={isLoading}
            optionList={jsUtility.cloneDeep(TYPE_OPTION_LIST(t))}
            onClick={onClickType}
            errorMessage={getComponentInfoErrorMessage(
              error_list_config,
              ['type'],
              EMPTY_STRING,
            )}
          />
        </div>
        <div className={gClasses.W65}>
          <SingleDropdown
            popperClassName={cx(
              styles.DashboardDDListPopper,
              styles.DropdownPopper,
            )}
            dropdownViewProps={{
              labelName: `${t(SELECT_LABEL)} ${dashboardTypeLabel}`,
              placeholder: `${t(SELECT_LABEL)} ${dashboardTypeLabel}`,
              selectedLabel: dashboardDDSelectedLabel,
              disabled: !typeDDSelectedValue,
              isRequired: true,
            }}
            isLoading={isLoading}
            optionList={jsUtility.cloneDeep(dashboardDDOptionList)}
            onClick={onClickDD}
            selectedValue={dashboardDDSelectedValue}
            searchProps={{
              searchPlaceholder: `${t(SEARCH_LABEL)} ${dashboardTypeLabel}`,
              searchValue: dashboardDDSearchText,
              onChangeSearch: onChangeDDFlowSearch,
            }}
            infiniteScrollProps={{
              dataLength: size,
              next: () => {},
              hasMore: false,
            }}
            errorMessage={getComponentInfoErrorMessage(
              error_list_config,
              'source_uuid',
              EMPTY_STRING,
            )}
            noDataFoundMessage={
              typeDDSelectedValue === TYPE_OPTION_LIST(t)[0].value
                ? NO_DATA_FOUND_STRINGS(t).NO_FLOWS_FOUND
                : NO_DATA_FOUND_STRINGS(t).NO_DATALISTS_FOUND
            }
            onOutSideClick={() => hiddenVisibilityRef?.current?.click()}
          />
          <button className={gClasses.DisplayNone} onClick={() => onClearSearch(EMPTY_STRING)} ref={hiddenVisibilityRef} />
        </div>
      </div>
      <div>
        <TextInput
          className={gClasses.MT10}
          labelText={t(LABEL_CONSTANT)}
          isLoading={isLoading}
          value={activeComponentData?.label}
          onChange={onChangeLabel}
          errorMessage={error_list_config?.label}
          required
        />
      </div>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    activeComponentData: state.ApplicationReducer?.activeComponent,
    error_list_config: state.ApplicationReducer?.error_list_config,
    dashboardConfigData:
      state.ApplicationDashboardReportReducer.dashboardConfig,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getComponentById: (id) => dispatch(getAppComponentByIdThunk(id)),
    applicationDataChange: (data) => dispatch(applicationStateChange(data)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DashboardConfig);
