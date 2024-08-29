import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import cx from 'classnames/bind';
import { ETextSize, Text } from '@workhall-pvt-lmt/wh-ui-library';
import { EMPTY_STRING } from 'utils/strings/CommonStrings';
import gClasses from 'scss/Typography.module.scss';
import AlertIcon from 'assets/icons/AlertIcon';
import { INITIAL_PAGE, MAX_PAGINATION_SIZE, IDENTIFIER_INPUT_TYPE } from 'utils/constants/form.constant';
import { getDragHandledMetrics } from 'utils/formUtils';
import { get, cloneDeep, unset, isEmpty, set } from 'utils/jsUtility';
import { updateFlowDataChange } from 'redux/reducer/EditFlowReducer';
import { getAllFieldsList } from 'redux/actions/EditFlow.Action';
import Joi from 'joi';
import AddData from './add_data/AddData';
import { METRICS, FIELD, ADD_METRIC_MAX_LIMIT_MESSAGE, DEFAULT_REPORT_FIELD_ACTION, ERROR_MESSAGES } from './Metrics.strings';
import DraggableWrapper from '../../../../components/form_builder/dnd/draggable_wrapper/DraggableWrapper';
import DroppableWrapper from '../../../../components/form_builder/dnd/droppable_wrapper/DroppableWrapper';
import { GET_ALL_FIELDS_LIST_BY_FILTER_TYPES } from '../../EditFlow.strings';
import DefaultReportField from './DefaultReportField';
import { validate } from '../../../../utils/UtilityFunctions';

const mapStateToProps = (state) => {
  return {
    flowData: state.EditFlowReducer.flowData,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onFlowDataChange: (flowData) => {
      dispatch(updateFlowDataChange(flowData));
    },
    onGetAllFieldsList: (...params) => {
      dispatch(getAllFieldsList(...params));
    },
  };
};

function DefaultReportFields(props) {
  const {
    flowData,
    flowData: {
      flow_id,
      lstAllFields = [],
      isAllFieldsLoading,
      default_report_fields: defaultReportFields = [],
      defaultReportFieldErrorList = {},
      defaultReportFieldsCurrentPage,
      hasMoreReportFields,
    },
    onFlowDataChange,
    onGetAllFieldsList,
  } = props;

  const [fieldSearchText, setFieldSearchText] = useState(null);

  const getAllFields = ({ page = INITIAL_PAGE, search }) => {
    const paginationData = {
      page,
      size: MAX_PAGINATION_SIZE,
      field_list_type: 'direct',
      sort_by: 1,
      flow_id,
      identifier_input_type: IDENTIFIER_INPUT_TYPE.METRIC,
      include_property_picker: 1,
    };
    if (search) paginationData.search = search;
    onGetAllFieldsList(
      paginationData,
      GET_ALL_FIELDS_LIST_BY_FILTER_TYPES.DEFAULT_REPORT_FIELDS,
      true,
    );
  };

  useEffect(() => { getAllFields(true); }, []);

  const getOptionList = () => {
    const optionListData = cloneDeep(lstAllFields);
    return optionListData?.filter((list) => !defaultReportFields.some((field) => list.value === field.value));
  };

  const onButtonAction = (action, index) => {
    const updatedFlowData = cloneDeep(flowData);
    const defaultReportFieldsCloned = get(updatedFlowData, ['default_report_fields'], []);
    let defaultReportFieldErrorList = get(updatedFlowData, ['defaultReportFieldErrorList'], {});
    switch (action) {
      case DEFAULT_REPORT_FIELD_ACTION.DELETE:
      case DEFAULT_REPORT_FIELD_ACTION.CANCEL:
        defaultReportFieldsCloned.splice(index, 1);
        const actualErrorList = {};
        Object.keys(defaultReportFieldErrorList).forEach((key) => {
          const errorKeyList = key?.split('.');
          if (errorKeyList?.[1] < index) {
            actualErrorList[key] = defaultReportFieldErrorList[key];
          } else if (errorKeyList?.[1] > index) {
            actualErrorList[`${errorKeyList[0]}.${errorKeyList[1] - 1}`] = defaultReportFieldErrorList[key];
          }
        });
        defaultReportFieldErrorList = actualErrorList;
        delete defaultReportFieldErrorList?.[`default_report_fields.${index}.field_uuid`];
        delete defaultReportFieldErrorList?.[`default_report_fields.${index}.customLabel`];
        break;
      case DEFAULT_REPORT_FIELD_ACTION.SAVE:
      case DEFAULT_REPORT_FIELD_ACTION.ADD:
        const reportFieldError = validate(
          {
            value: defaultReportFieldsCloned[index]?.newValue?.value,
            customLabel: defaultReportFieldsCloned[index]?.newValue?.customLabel,
            reference_name: defaultReportFieldsCloned[index]?.newValue?.reference_name,
          },
          Joi.object().keys({
            value: Joi.string().required(),
            customLabel: Joi.string().required(),
            reference_name: Joi.optional(),
          }),
        );
        if (defaultReportFieldsCloned[index]?.newValue?.customLabel) {
          const isLabelAddedAlready = defaultReportFieldsCloned.some((field, fieldIndex) =>
            (field.customLabel === defaultReportFieldsCloned[index]?.newValue?.customLabel) && (fieldIndex !== index),
          );
          if (isLabelAddedAlready) {
          reportFieldError.customLabel = ERROR_MESSAGES.LABEL_DUPLICATE;
          }
        }
        if (isEmpty(reportFieldError)) {
          defaultReportFieldsCloned[index].value = defaultReportFieldsCloned[index]?.newValue?.value;
          defaultReportFieldsCloned[index].label = defaultReportFieldsCloned[index]?.newValue?.label;
          defaultReportFieldsCloned[index].customLabel = defaultReportFieldsCloned[index]?.newValue?.customLabel;
          defaultReportFieldsCloned[index].reference_name = defaultReportFieldsCloned[index]?.newValue?.reference_name;
          unset(defaultReportFieldsCloned, [index, 'isAdd']);
          unset(defaultReportFieldsCloned, [index, 'isEdit']);
          unset(defaultReportFieldsCloned, [index, 'newValue']);
        } else {
          if (reportFieldError?.customLabel) {
            defaultReportFieldErrorList[`default_report_fields.${index}.customLabel`] =
            defaultReportFieldsCloned[index]?.newValue?.customLabel ?
            ERROR_MESSAGES.LABEL_DUPLICATE :
            ERROR_MESSAGES.LABEL_EMPTY;
          }
          if (reportFieldError?.value) {
            defaultReportFieldErrorList[`default_report_fields.${index}.field_uuid`] = ERROR_MESSAGES.METRICS_EMPTY;
          }
        }
        break;
      case DEFAULT_REPORT_FIELD_ACTION.DISCARD:
        unset(defaultReportFieldsCloned, [index, 'isEdit']);
        unset(defaultReportFieldsCloned, [index, 'newValue']);
        delete defaultReportFieldErrorList?.[`default_report_fields.${index}.field_uuid`];
        delete defaultReportFieldErrorList?.[`default_report_fields.${index}.customLabel`];
        break;
      case DEFAULT_REPORT_FIELD_ACTION.EDIT:
        defaultReportFieldsCloned[index].newValue = {
          value: defaultReportFieldsCloned[index]?.value,
          label: defaultReportFieldsCloned[index]?.label,
          customLabel: defaultReportFieldsCloned[index]?.customLabel,
          reference_name: defaultReportFieldsCloned[index]?.reference_name,
        };
        defaultReportFieldsCloned[index].isEdit = true;
        break;
      default:
        break;
    }
    updatedFlowData.default_report_fields = defaultReportFieldsCloned;
    updatedFlowData.defaultReportFieldErrorList = defaultReportFieldErrorList;
    onFlowDataChange(updatedFlowData);
    setFieldSearchText(null);
    getAllFields(true);
  };

  const onClickAdd = () => {
    const initialState = {
      label: EMPTY_STRING,
      value: EMPTY_STRING,
      isAdd: true,
    };
    const flow_data = cloneDeep(flowData);
    const defaultReportFieldsCloned = get(flow_data, ['default_report_fields'], []);
    defaultReportFieldsCloned.push(initialState);
    flow_data.default_report_fields = defaultReportFieldsCloned;
    onFlowDataChange(flow_data);
  };

  const updateSelectedField = (value, label, list, index) => {
    const flow_data = cloneDeep(flowData);
    const defaultReportFieldsCloned = get(flow_data, ['default_report_fields'], []);
    const defaultReportFieldErrorList = get(flow_data, ['defaultReportFieldErrorList'], {});
    const selectedField = list?.find((field) => (field.value === value));
    const isLabelAddedAlready = defaultReportFieldsCloned.some((field, fieldIndex) =>
      (field.customLabel === selectedField?.field_name) && (fieldIndex !== index),
    );

    defaultReportFieldsCloned[index].newValue = {
      value,
      label,
      customLabel: selectedField?.field_name,
      reference_name: selectedField?.reference_name,
    };
    flow_data.default_report_fields = defaultReportFieldsCloned;
    delete defaultReportFieldErrorList?.[`default_report_fields.${index}.field_uuid`];
    if (isLabelAddedAlready) {
      set(defaultReportFieldErrorList, [`default_report_fields.${index}.customLabel`], ERROR_MESSAGES.LABEL_DUPLICATE);
    } else {
      delete defaultReportFieldErrorList?.[`default_report_fields.${index}.customLabel`];
    }
    flow_data.defaultReportFieldErrorList = defaultReportFieldErrorList;
    onFlowDataChange(flow_data);
  };

  const updateCustomLabel = (e, index) => {
    const { target: { value } } = e;
    const flow_data = cloneDeep(flowData);
    const defaultReportFieldsCloned = get(flow_data, ['default_report_fields'], []);
    const defaultReportFieldErrorList = get(flow_data, ['defaultReportFieldErrorList'], {});
    const isLabelAddedAlready = defaultReportFieldsCloned.some((field, fieldIndex) =>
      (field.customLabel === value) &&
      (fieldIndex !== index),
    );
    defaultReportFieldsCloned[index].newValue = {
      ...defaultReportFieldsCloned[index].newValue,
      customLabel: value,
    };
    flow_data.default_report_fields = defaultReportFieldsCloned;
    if (defaultReportFieldErrorList?.[`default_report_fields.${index}.customLabel`]) {
      if (isLabelAddedAlready) {
        set(defaultReportFieldErrorList, [`default_report_fields.${index}.customLabel`], ERROR_MESSAGES.LABEL_DUPLICATE);
      } else {
        delete defaultReportFieldErrorList?.[`default_report_fields.${index}.customLabel`];
      }
    }
    flow_data.defaultReportFieldErrorList = defaultReportFieldErrorList;
    onFlowDataChange(flow_data);
  };

  const onMetricDragEndHandler = (event) => {
    const flow_data = cloneDeep(flowData);
    flow_data.default_report_fields = getDragHandledMetrics(
      cloneDeep(defaultReportFields),
      event,
    );
    onFlowDataChange(flow_data);
  };

  const addNewMetric = (defaultReportFields || []).length < 10 ? (
    !defaultReportFields?.some((value) => value?.isEdit || value?.isAdd) && (
      <AddData onClick={onClickAdd} />
    )
  ) : (
    (
      <div className={cx(gClasses.CenterV, gClasses.MT15)}>
        <AlertIcon />
        <div className={cx(gClasses.WarningMessage, gClasses.ML5)}>
          {ADD_METRIC_MAX_LIMIT_MESSAGE}
        </div>
      </div>
    )
  );

  const loadMoreFields = () => {
    getAllFields({ page: defaultReportFieldsCurrentPage + 1, search: fieldSearchText });
  };

  const onFieldsSearchChange = (event) => {
    const { value = EMPTY_STRING } = event.target;
    getAllFields({ page: 1, search: value });
    setFieldSearchText(value);
  };

  const disableDND = !isEmpty(defaultReportFields) && defaultReportFields.some((field) => (field?.isEdit || field?.isAdd));

  return (
    <div className={gClasses.MB30}>
      <Text
        className={cx(gClasses.FontWeightBold, gClasses.MB10)}
        size={ETextSize.LG}
        content={METRICS.HEADER}
      />
      <div className={cx(gClasses.FieldName, gClasses.MB10, gClasses.MT5)}>{METRICS.SUBTITLE}</div>
      <div>
        <DroppableWrapper
          id="flow_metrics"
          index={0}
          onFieldDragEndHandler={onMetricDragEndHandler}
          enableDragAndDrop
          role="list"
        >
          {
            (defaultReportFields || []).map((field, index) => (
              <DraggableWrapper
                key={index}
                className={cx(gClasses.MB5)}
                id={`flow_metric_${index}`}
                index={index}
                enableDragAndDrop={!disableDND}
                enableIsDragging
                role="listitem"
              >
                <div className={gClasses.MB5}>
                  <DefaultReportField
                    onButtonAction={onButtonAction}
                    optionList={getOptionList()}
                    field={field}
                    errorMessage={defaultReportFieldErrorList?.[`default_report_fields.${index}.field_uuid`]}
                    labelErrorMessage={defaultReportFieldErrorList?.[`default_report_fields.${index}.customLabel`]}
                    isAllFieldsLoading={isAllFieldsLoading}
                    infiniteScrollProps={{
                      dataLength: lstAllFields?.length || MAX_PAGINATION_SIZE,
                      next: loadMoreFields,
                      hasMore: hasMoreReportFields,
                      scrollableId: `${index}_${METRICS.ID}`,
                    }}
                    searchProps={{
                      searchPlaceholder: FIELD.METRICS.PLACEHOLDER,
                      searchValue: fieldSearchText,
                      onChangeSearch: onFieldsSearchChange,
                    }}
                    index={index}
                    onClick={(value, label, list) => updateSelectedField(value, label, list, index)}
                    onChange={(e) => updateCustomLabel(e, index)}
                    placeholder={FIELD.METRICS.PLACEHOLDER}
                  />
                </div>
              </DraggableWrapper>
            ))
          }
        </DroppableWrapper>
        {addNewMetric}
      </div>
    </div>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(DefaultReportFields);
