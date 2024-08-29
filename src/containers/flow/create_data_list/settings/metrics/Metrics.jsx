import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import cx from 'classnames/bind';
import { useTranslation } from 'react-i18next';
import { GET_ALL_FIELDS_LIST_BY_FILTER_TYPES } from 'containers/flow/Flow.strings';
import { EMPTY_STRING } from 'utils/strings/CommonStrings';
import { constructAndMapMetricFieldObject, getUpdatedMetricFieldsForChangeHandler } from 'containers/edit_flow/settings/metrics/Metrics.utils';
import Joi from 'joi';
import gClasses from '../../../../../scss/Typography.module.scss';
import { getAllFieldsListApiThunk } from '../../../../../redux/actions/CreateDataList.action';
import MetricList from './metric_list/MetricList';
import AddData from './add_data/AddData';
import AlertIcon from '../../../../../assets/icons/AlertIcon';
import { getDataListMetricsSelector } from '../../../../../redux/selectors/CreateDataList.selectors';
import { dataListStateChangeAction } from '../../../../../redux/reducer/CreateDataListReducer';
import { get, isEmpty, find, cloneDeep, has, findIndex } from '../../../../../utils/jsUtility';
import { INITIAL_PAGE, MAX_PAGINATION_SIZE, IDENTIFIER_INPUT_TYPE } from '../../../../../utils/constants/form.constant';
import { getDragHandledMetrics } from '../../../../../utils/formUtils';
import { FIELD, METRICS, ERROR_MESSAGES, FIELD_KEY_DATA_METRICS, METRIC_BUTTON_ACTION, ADD_METRIC_MAX_LIMIT_MESSAGE } from './Metrics.strings';
import { validate } from '../../../../../utils/UtilityFunctions';

const mapStateToProps = (state) => {
  return {
    metricsDataList: getDataListMetricsSelector(state.CreateDataListReducer),
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onDataListStateChange: (data, id) => {
      dispatch(dataListStateChangeAction(data, id));
    },
    onGetAllFieldsList: (...params) => {
      dispatch(getAllFieldsListApiThunk(...params));
    },
  };
};

function Metrics(props) {
  const { t } = useTranslation();
  const {
    metricsDataList,
    metricsDataList: { data_list_id, lstAllFields, metrics, metricCurrentPage },
    onDataListStateChange,
    onGetAllFieldsList,
  } = props;

  const { metric_fields, isShowMetricAdd } = metrics;

  const getAllFields = (isInitial = false, isSearch = false, searchText = EMPTY_STRING) => {
    const paginationData = {
      page: (isSearch || isInitial) ? INITIAL_PAGE : metricCurrentPage + 1,
      size: MAX_PAGINATION_SIZE,
      field_list_type: 'direct',
      sort_by: 1,
      data_list_id,
      identifier_input_type: IDENTIFIER_INPUT_TYPE.METRIC,
      include_property_picker: 1,
    };
    if (isSearch && searchText) paginationData.search = searchText;
    onGetAllFieldsList(
          paginationData,
          GET_ALL_FIELDS_LIST_BY_FILTER_TYPES.DEFAULT_REPORT_FIELDS,
          true,
      );
  };

  useEffect(() => { getAllFields(true); }, []);

  const onLoadMoreData = () => {
    getAllFields(false);
  };

  const onSearchFieldData = (searchText) => {
    getAllFields(false, true, searchText);
  };

  const validateAndUpdateState = (
    current_metric,
    lstMetrics,
    current_metric_id,
    fieldKeyData,
    onlyValidateAndReturn = false,
  ) => {
    const clonedMetrics = cloneDeep(metricsDataList.metrics);
    const clonedMetricFields =
      lstMetrics || cloneDeep(clonedMetrics.metric_fields);
      const reportFieldError = validate(
        {
          field_uuid: current_metric?.field_uuid,
          label: current_metric?.label,
        },
        Joi.object().keys({
          field_uuid: Joi.string().required(),
          label: Joi.string().required(),
        }),
      );

      if (current_metric?.label) {
        const isLabelAddedAlready = clonedMetricFields.some((field) =>
          (field?.existing_data?.label === current_metric?.label) && (field.field_uuid !== current_metric?.field_uuid),
        );
        if (isLabelAddedAlready) {
        reportFieldError.label = ERROR_MESSAGES.LABEL_DUPLICATE;
        }
      }
      if (reportFieldError.field_uuid) {
        clonedMetrics.err_l_field[`${current_metric.existing_data._id},field_uuid`] = reportFieldError.field_uuid;
      } else {
        delete clonedMetrics.err_l_field[`${current_metric.existing_data._id},field_uuid`];
      }
      if (reportFieldError.label) {
        clonedMetrics.err_l_field[`${current_metric.existing_data._id},label`] = reportFieldError.label;
      } else {
        delete clonedMetrics.err_l_field[`${current_metric.existing_data._id},label`];
      }
    if (!onlyValidateAndReturn) {
      clonedMetrics.metric_fields = getUpdatedMetricFieldsForChangeHandler(
        clonedMetricFields,
        current_metric,
        current_metric_id,
      );
      onDataListStateChange(clonedMetrics, 'metrics');
    } else {
      return get(clonedMetrics, ['err_l_field'], []);
    }
    return [];
  };

  const validateMetric = (lstMetrics, current_metric_id) => {
    if (current_metric_id && !isEmpty(lstMetrics)) {
      const metric = find(lstMetrics, { existing_data: { _id: current_metric_id } });
      return validateAndUpdateState(metric, lstMetrics, current_metric_id, FIELD_KEY_DATA_METRICS, true);
    }
    return [];
  };

  const onChangeHandler = (event, id) => {
    const value = get(event, ['target', 'value']);
    const _id = get(event, ['target', 'id']);

    let consolidated_metric = {};
    if (_id === FIELD.METRICS.ID) {
      const selectedMetric = (lstAllFields.filter((fieldData) => fieldData.field_uuid === value));
      consolidated_metric = constructAndMapMetricFieldObject(selectedMetric[0], id, metric_fields);
      validateAndUpdateState(consolidated_metric, null, id, FIELD_KEY_DATA_METRICS);
    } else if (_id === FIELD.ALTERNATE_LABEL.ID) {
      consolidated_metric = constructAndMapMetricFieldObject([], id, metric_fields, value);
      validateAndUpdateState(consolidated_metric, null, id, [FIELD_KEY_DATA_METRICS[1]]);
    }
  };

  const onClickAdd = () => {
    const initialState = {
      is_add: true,
      existing_data: {
        _id: 'new_data',
        field_uuid: 'new_field_uuid',
      },
      };
    const clonedMetrics = cloneDeep(metricsDataList.metrics);
    const cloneMetricFields = cloneDeep(clonedMetrics.metric_fields);
    cloneMetricFields.push(initialState);
    clonedMetrics.metric_fields = cloneMetricFields;
    clonedMetrics.isShowMetricAdd = !isShowMetricAdd;
    onDataListStateChange(clonedMetrics, 'metrics');
  };

  const onSaveHandler = (current_mertic_data, action) => {
    const clonedMetrics = cloneDeep(metricsDataList.metrics);
    const clonedMetricFields = cloneDeep(clonedMetrics.metric_fields);
    const _id = get(current_mertic_data, ['existing_data', '_id'], null);
    if (clonedMetricFields && clonedMetricFields.length <= 10) {
      if (
        _id &&
        !isEmpty(current_mertic_data.label) &&
        !isEmpty(current_mertic_data.field_uuid) &&
        !has(clonedMetrics, ['err_l_field', `${current_mertic_data.existing_data._id},${FIELD_KEY_DATA_METRICS[0].l_value}`], false) &&
        !has(clonedMetrics, ['err_l_field', `${current_mertic_data.existing_data._id},${FIELD_KEY_DATA_METRICS[1].l_value}`], false)
      ) {
          const cloneCurrentMetric = cloneDeep(current_mertic_data);
          delete cloneCurrentMetric.existing_data;

          (has(cloneCurrentMetric, ['is_edit'], false) && delete cloneCurrentMetric.is_edit);
          (has(cloneCurrentMetric, ['is_add'], false) && delete cloneCurrentMetric.is_add);

          const consolidated_data = {
            ...cloneCurrentMetric,
            existing_data: cloneCurrentMetric,
          };
          const index = findIndex(clonedMetricFields, { existing_data: { _id: _id } });
          clonedMetrics.metric_fields[index] = consolidated_data;
          if (action === METRIC_BUTTON_ACTION.ADD) clonedMetrics.isShowMetricAdd = false;
        } else {
        isEmpty(current_mertic_data.label) &&
        (clonedMetrics.err_l_field[`${current_mertic_data.existing_data._id},${FIELD_KEY_DATA_METRICS[1].l_value}`] = ERROR_MESSAGES.LABEL_EMPTY);
        isEmpty(current_mertic_data.field_uuid) &&
        (clonedMetrics.err_l_field[`${current_mertic_data.existing_data._id},${FIELD_KEY_DATA_METRICS[0].l_value}`] = ERROR_MESSAGES.METRICS_EMPTY);
      }
    } else {
      clonedMetrics.err_l_field[`${current_mertic_data.existing_data._id},${FIELD_KEY_DATA_METRICS[0].l_value}`] = ERROR_MESSAGES.MAX_LIMIT;
    }
    onDataListStateChange(clonedMetrics, 'metrics');
  };

  const onMetricDragEndHandler = (event) => {
    const clonedMetrics = cloneDeep(metricsDataList.metrics);
    clonedMetrics.metric_fields = getDragHandledMetrics(
      metric_fields,
      event,
    );
    onDataListStateChange(clonedMetrics, 'metrics');
  };

  const checkAnyObjectWithIsAdd = () => {
    if (!isEmpty(metric_fields)) {
       const isAddExists = metric_fields.some((eachField) => !!eachField.is_add);
       return isAddExists;
    }
    return false;
   };

  const warning = (
    <div className={cx(gClasses.CenterV, gClasses.MT15)}>
        <AlertIcon />
        <div className={cx(gClasses.WarningMessage, gClasses.ML5)}>
         {ADD_METRIC_MAX_LIMIT_MESSAGE}
        </div>
    </div>
  );

  const addNewMetric = (
    (!isShowMetricAdd && !checkAnyObjectWithIsAdd()) ? (
      (metric_fields.length || []) < 10 ? (
        <AddData onClick={onClickAdd} />
      ) : warning
    ) : null
  );

const disableDND = !isEmpty(metric_fields) && metric_fields.some((eachMetric) => (
  has(eachMetric, ['is_edit'], false) || has(eachMetric, ['is_add'], false)
));
  return (
    <div className={gClasses.MB30}>
      <div className={cx(gClasses.FieldName, gClasses.MB10, gClasses.MT5)}>{METRICS(t).SUBTITLE}</div>
      <div>
        <MetricList
           list={metric_fields}
           onMetricDragEndHandler={onMetricDragEndHandler}
           validateMetric={validateMetric}
           onChangeHandler={onChangeHandler}
           onSaveHandler={onSaveHandler}
           onLoadMoreData={onLoadMoreData}
           onSearchFieldData={onSearchFieldData}
           disableDND={disableDND}
        />
        {addNewMetric}
      </div>
    </div>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(Metrics);
