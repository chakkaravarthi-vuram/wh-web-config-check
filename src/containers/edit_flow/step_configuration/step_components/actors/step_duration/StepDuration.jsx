import React from 'react';
import cx from 'classnames';
import { connect } from 'react-redux';
import { Col, Row } from 'reactstrap';

import Input from 'components/form_components/input/Input';
import Label from 'components/form_components/label/Label';

import gClasses from 'scss/Typography.module.scss';
import { INPUT_TYPES } from 'utils/UIConstants';
import { cloneDeep, nullCheck } from 'utils/jsUtility';
import { FLOW_STRINGS } from 'containers/edit_flow/EditFlow.strings';
import { updateFlowDataChange } from 'redux/reducer/EditFlowReducer';

function StepDuration(props) {
  const {
    stepData,
    onFlowDataChange,
    flow_data,
  } = props;
  const flowData = cloneDeep(flow_data);
  const stepIndex = flowData.steps.findIndex(
    (data) => data._id === stepData._id,
  );

  const {
    OTHER_STEP_ASSIGNEE: { DUE_DATA },
  } =
    FLOW_STRINGS.CREATE_FLOW.STEPS.STEP.BASIC_INFO_AND_ACTORS.ACTORS;

  const onDurationChangeHandler = (event) => {
    if (nullCheck(event, 'target.id')) {
      const {
        target: { value, id },
      } = event;
      flowData.steps[stepIndex][id].duration = value;
      onFlowDataChange(flowData);
    }
  };

  return (
    <>
      <Label content={DUE_DATA.LABEL} />
      <Col xs={6} sm={4} md={4} lg={4}>
        <Row>
          <Input
            id={DUE_DATA.ID}
            type={INPUT_TYPES.NUMBER}
            readOnlySuffix={
              <div
                className={cx(
                  gClasses.ML10,
                  gClasses.FOne13GrayV14,
                  gClasses.CenterV,
                )}
              >
                {DUE_DATA.DUE_DURATION_TYPES[0].SUFFIX_LABEL}
              </div>
            }
            onChangeHandler={onDurationChangeHandler}
            hideLabel
            value={stepData[DUE_DATA.ID].duration}
            errorMessage={flowData.error_list.due_days}
          />
        </Row>
      </Col>
    </>
  );
}

const mapStateToProps = (state) => {
  return {
    flow_data: state.EditFlowReducer.flowData,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onFlowDataChange: (flowData) => {
      dispatch(updateFlowDataChange(flowData));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(StepDuration);
