import React, { useState } from 'react';
import cx from 'classnames/bind';
import { connect } from 'react-redux';

import gClasses from 'scss/Typography.module.scss';
import { BS } from 'utils/UIConstants';
import { get, compact, cloneDeep, isEmpty, has } from 'utils/jsUtility';
import Dropdown from 'components/form_components/dropdown/Dropdown';
import Button, { BUTTON_TYPE } from 'components/form_components/button/Button';
import { updateFlowDataChange } from 'redux/reducer/EditFlowReducer';
import EditIconV2 from 'assets/icons/form_fields/EditIconV2';
import DeleteIconV2 from 'assets/icons/form_fields/DeleteIconV2';
import { keydownOrKeypessEnterHandle } from 'utils/UtilityFunctions';
import { EMPTY_STRING } from 'utils/strings/CommonStrings';
import styles from './Metric.module.scss';
import { METRIC_BUTTON_ACTION, FIELD } from '../../Metrics.strings';
import { getUpdatedMetricFields } from '../../Metrics.utils';

const mapStateToProps = (state) => {
  return {
    flowData: state.EditFlowReducer.flowData,
    hasMoreReportFields: get(state, ['EditFlowReducer', 'flowData', 'hasMoreReportFields'], false),
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onFlowDataChange: (flowData) => {
      dispatch(updateFlowDataChange(flowData));
    },
  };
};

function Metric(props) {
  const {
    index,
    metricData: { reference_name, field_name, server_error },
    metricData,
    flowData,
    flowData: {
      lstAllFields,
      metrics: { metric_fields, err_l_field = {} },
    },
    hasMoreReportFields,
    onFlowDataChange,
    validateMetric,
    onChangeHandler,
    onSaveHandler,
    onLoadMoreData,
    onSearchFieldData,
    className,
    list,
  } = props;
  const [currentField, setCurrentField] = useState(EMPTY_STRING);

  const alternate_name = get(props, ['metricData', 'label'], field_name);
  const consolidated_label = `${alternate_name} (Ref: ${reference_name})`;
  const existing_id = get(metricData, ['existing_data', '_id']);
  const existing_field_uuid = get(metricData, ['existing_data', 'field_uuid']);
  const errorMessage = {
    label: get(err_l_field, [`${existing_field_uuid},label`], null),
    field_uuid: get(err_l_field, [`${existing_field_uuid},field_uuid`], null),
  };

  const onButtonAction = (action) => {
    let metric_field = cloneDeep(metricData);
    const flow_data = cloneDeep(flowData);
    let updatedMetricFields = cloneDeep(metric_fields);
    let isUpdated = false;
   switch (action) {
      case METRIC_BUTTON_ACTION.EDIT:
          metric_field.is_edit = true;
          flow_data.metrics.err_l_field = { ...err_l_field, ...validateMetric(metric_fields, existing_id, existing_field_uuid) };
          isUpdated = true;
          break;
      case METRIC_BUTTON_ACTION.DELETE:
      case METRIC_BUTTON_ACTION.CANCEL:
        const lstMetrics = metric_fields.map((metricData, i) => {
          if (
            (action === METRIC_BUTTON_ACTION.CANCEL) ?
            !has(metricData, ['is_add'], false) :
            index !== i) return metricData;
          return null;
        });
        updatedMetricFields = compact(lstMetrics);
        metric_field = [];
        flow_data.metrics.isShowMetricAdd = false;

        if (action === METRIC_BUTTON_ACTION.CANCEL) {
          has(flow_data, ['metrics', 'err_l_field', `${existing_field_uuid},label`], false) &&
          delete flow_data.metrics.err_l_field[`${existing_field_uuid},label`];
          has(flow_data, ['metrics', 'err_l_field', `${existing_field_uuid},field_uuid`], false) &&
          delete flow_data.metrics.err_l_field[`${existing_field_uuid},field_uuid`];
        }
        isUpdated = true;

        break;
      case METRIC_BUTTON_ACTION.DISCARD:
          (!isEmpty(metricData)) && delete metric_field.is_edit;
            metric_field = {
              ...(metric_field || {}),
              ...(metric_field.existing_data || {}),
            };

          has(flow_data, ['metrics', 'err_l_field', `${existing_field_uuid},label`], false) &&
            delete flow_data.metrics.err_l_field[`${existing_field_uuid},label`];
          has(flow_data, ['metrics', 'err_l_field', `${existing_field_uuid},field_uuid`], false) &&
            delete flow_data.metrics.err_l_field[`${existing_field_uuid},field_uuid`];

          isUpdated = true;
          break;
      case METRIC_BUTTON_ACTION.SAVE:
      case METRIC_BUTTON_ACTION.ADD:
        onSaveHandler(metricData, action);
        break;
      default:
          break;
    }
    if (isUpdated) {
      updatedMetricFields = getUpdatedMetricFields(updatedMetricFields, metric_field);
      flow_data.metrics.metric_fields = updatedMetricFields;
      onFlowDataChange(flow_data);
    }
  };

  const getOptionList = () => {
    const optionListData = cloneDeep(lstAllFields);
    const selectedMetric = cloneDeep(list);
    return optionListData.filter((list) => !selectedMetric.some((metric) => list._id === metric._id && list.field_uuid !== currentField && list.field_uuid !== metricData.field_uuid));
  };

 const onEditClickHandler = () => onButtonAction(METRIC_BUTTON_ACTION.EDIT);

 const onDeleteClickHandler = () => onButtonAction(METRIC_BUTTON_ACTION.DELETE);

 const onFieldChangeHandler = (event) => {
  setCurrentField(event?.target?.field_uuid);
   onChangeHandler(event, metricData.existing_data.field_uuid);
 };

 const getCardMainContent = () => {
    if (metricData.is_edit || metricData.is_add) {
      let button_actions = null;
      const buttons = (metricData.is_edit) ? {
        primary: METRIC_BUTTON_ACTION.SAVE,
        secondary: METRIC_BUTTON_ACTION.DISCARD,
      } : {
        primary: METRIC_BUTTON_ACTION.ADD,
        secondary: METRIC_BUTTON_ACTION.CANCEL,
      };

     button_actions = (
            <>
                <Button
                  buttonType={BUTTON_TYPE.SECONDARY}
                  onClick={() => onButtonAction(buttons.secondary)}
                  className={cx(gClasses.MR15, styles.ActionBtn)}
                >
                  {buttons.secondary}
                </Button>
                <Button
                  buttonType={BUTTON_TYPE.OUTLINE_PRIMARY}
                  onClick={() => onButtonAction(buttons.primary)}
                  className={styles.ActionBtn}
                >
                    {buttons.primary}
                </Button>
            </>
        );
    const hasSelectedValueInLst = !isEmpty(lstAllFields) && (
      (lstAllFields || []).some((eachField) => eachField.field_uuid === metricData.field_uuid)
    );
      return (
     <div className={cx(BS.D_FLEX, BS.ALIGN_ITEMS_START, styles.MetricMainContent, BS.JC_BETWEEN)}>
      <Dropdown
        id={FIELD.METRICS.ID}
        optionList={getOptionList()}
        selectedValue={
          hasSelectedValueInLst ?
              metricData.field_uuid :
              metricData.field_name}
        onChange={onFieldChangeHandler}
       // onKeyDownHandler={onFieldChangeHandler}
        className={cx(gClasses.MR24, styles.Dropdown)}
        innerClassName={styles.FieldCommonProperties}
        hideLabel
        hideMessage={!errorMessage.field_uuid}
        placeholder={FIELD.METRICS.PLACEHOLDER}
        errorMessage={errorMessage.field_uuid}
        errorMessageClassName={BS.MB_0}
        hasMore={hasMoreReportFields}
        strictlySetSelectedValue
        isPaginated
        disableFocusFilter
        enableSearch
        loadDataHandler={onLoadMoreData}
        onSearchInputChange={onSearchFieldData}
        showNoDataFoundOption
        setSelectedValue={!hasSelectedValueInLst}
        disableLoader
      />
      {/* <Input
        id={FIELD.ALTERNATE_LABEL.ID}
        onChangeHandler={onFieldChangeHandler}
        className={cx(gClasses.MR24, styles.Input)}
        inputContainerClasses={styles.FieldCommonProperties}
        hideLabel
        hideMessage={!errorMessage.label}
        placeholder={FIELD.ALTERNATE_LABEL.PLACEHOLDER}
        value={metricData.label}
        errorMessage={errorMessage.label}
        errorMessageClassName={BS.MB_0}
      /> */}
      <div className={cx(BS.D_FLEX, BS.ALIGN_ITEMS_START, styles.BtnContainer)}>
       {button_actions}
      </div>
     </div>
     );
  }
    return (
      <div
        className={cx(
          gClasses.FTwo13GrayV3,
          gClasses.FontWeight500,
          gClasses.FlexGrow1,
        )}
      >
        {consolidated_label}
      </div>
    );
 };
const icons = (metricData.is_edit || metricData.is_add) ? null : (
  <div className={cx(BS.D_FLEX, BS.ALIGN_ITEM_CENTER, gClasses.ML15, styles.IconContainer)} role="presentation">
      <div
        className={cx(BS.TEXT_RIGHT, styles.Icon, gClasses.CenterVH, gClasses.MR4, styles.EditContainer)}
        onClick={onEditClickHandler}
        aria-label="Edit Metrics"
        onKeyDown={(e) => keydownOrKeypessEnterHandle(e) && onEditClickHandler(e)}
        role="button"
        tabIndex={0}
      >
        <EditIconV2 className={cx(styles.EditIcon, gClasses.CursorPointer)} />
      </div>
      <div
        className={cx(BS.TEXT_RIGHT, styles.Icon, gClasses.CenterVH, styles.DeleteContainer)}
        onClick={onDeleteClickHandler}
        aria-label="Delete Metrics"
        onKeyDown={(e) => keydownOrKeypessEnterHandle(e) && onDeleteClickHandler(e)}
        role="button"
        tabIndex={0}
      >
        <DeleteIconV2 className={cx(styles.DeleteIcon, gClasses.CursorPointer)} />
      </div>
  </div>
);
  return (
    <div
      className={cx(gClasses.InputBorder, styles.Container, BS.P_RELATIVE, className, server_error && gClasses.ErrorInputBorder)}
    >
      <div className={cx(BS.D_FLEX, BS.JC_BETWEEN, styles.Header, BS.ALIGN_ITEMS_START)}>
        <div className={cx(gClasses.P0, BS.W100)}>
          <div className={cx(BS.D_FLEX, BS.ALIGN_ITEM_CENTER)}>
            <div
              className={cx(
                styles.StepNumber,
                gClasses.CenterVH,
                gClasses.FTwo13,
                gClasses.FontWeight500,
                gClasses.FlexShrink0,
                gClasses.MR24,
              )}
            >
              {index + 1}
            </div>
           {getCardMainContent()}
          </div>
        </div>
        {icons}
      </div>
    </div>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(Metric);
