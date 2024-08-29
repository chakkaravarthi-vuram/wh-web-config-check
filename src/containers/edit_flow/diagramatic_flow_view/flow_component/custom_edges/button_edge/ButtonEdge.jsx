import React from 'react';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';
import { getSimpleBezierPath, getSmoothStepPath, getStraightPath } from 'reactflow';
import '../../ReactFlow.css';
import gClasses from 'scss/Typography.module.scss';
import { BS } from 'utils/UIConstants';
import { keydownOrKeypessEnterHandle } from 'utils/UtilityFunctions';
import { checkLinkDependency } from 'containers/edit_flow/diagramatic_flow_view/DigramaticFlowView.utils';
import { EMPTY_STRING } from 'utils/strings/CommonStrings';
import DeleteIconV2 from 'assets/icons/form_fields/DeleteIconV2';
import styles from './ButtonEdge.module.scss';
import { EDGE_STYLES } from '../../FlowComponent.constants';

const foreignObjectSize = {
  height: 28,
  width: 20,
};
const foreignObjectSize1 = {
  height: 40,
  width: 100,
};
export default function CustomEdge(props) {
  const {
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    style = {},
    markerEnd,
    source,
    target,
    label,
    interactionWidth,
    data = {},
  } = props;
  const { t } = useTranslation();
  const { edgeStyle, onEdgeStyleChanged, stepData, connectorLineUuid } = data;

  const onEdgeClick = () => {
    console.log('Clicked edge', id, source, target, sourceX, sourceY, targetX, targetY, props);
    checkLinkDependency(stepData.flow_id, connectorLineUuid, source, t);
  };

  const changeEdgeStyle = (edgeType) => {
    console.log('changeEdgeStyle', edgeStyle, data);
    if (edgeStyle !== edgeType) {
      onEdgeStyleChanged(edgeType, data.connectorLineUuid, stepData);
    }
  };
  let [edgePath, labelX, labelY] = [EMPTY_STRING, EMPTY_STRING, EMPTY_STRING];
  if (edgeStyle === EDGE_STYLES.STRAIGHT) {
    [edgePath, labelX, labelY] = getStraightPath({
      sourceX,
      sourceY,
      sourcePosition,
      targetX,
      targetY,
      targetPosition,
      borderRadius: 0,
      interactionWidth,
    });
  } else if (edgeStyle === EDGE_STYLES.CURVE) {
    [edgePath, labelX, labelY] = getSimpleBezierPath({
      sourceX,
      sourceY,
      sourcePosition,
      targetX,
      targetY,
      targetPosition,
      borderRadius: 0,
      interactionWidth,
    });
  } else {
    [edgePath, labelX, labelY] = getSmoothStepPath({
      sourceX,
      sourceY,
      sourcePosition,
      targetX,
      targetY,
      targetPosition,
      borderRadius: 0,
      interactionWidth,
    });
  }

  let labelComponent = null;
  let labelWidth = foreignObjectSize.width;
  if (label) {
    labelWidth += 50;
    labelComponent = (
        <div id={`edge-label-name-${id}`} className={cx(gClasses.FTwo10GrayV3, styles.Label, gClasses.Ellipsis)} title={label}>
          {label}
        </div>
    );
  }
  const curvedEdgeId = `curved-edge-${source}-to-${target}`;
  const stepEdgeId = `step-edge-${source}-to-${target}`;
  const straightEdgeId = `straight-edge-${source}-to-${target}`;
  return (
    <>
      <path
        id={id}
        style={style}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={markerEnd}
      />
      <foreignObject
        width={labelWidth}
        height={foreignObjectSize.height}
        x={labelX - labelWidth / 2}
        y={labelY - foreignObjectSize.height / 2}
        requiredExtensions="http://www.w3.org/1999/xhtml"
        className="custom-edge-wrapper"
      >
        <div className={cx(styles.LabelWrapper, BS.D_FLEX, 'label-wrapper')}>
          {labelComponent}
          <div
            className={cx(styles.IconWrapper, 'custom-edge-icon')}
            onClick={onEdgeClick}
            tabIndex={0}
            role="button"
            onKeyDown={(e) => keydownOrKeypessEnterHandle(e) && onEdgeClick()}
          >
            <DeleteIconV2 className={styles.DeleteIcon} />
          </div>
        </div>
      </foreignObject>
      <foreignObject
        width={foreignObjectSize1.width}
        height={foreignObjectSize1.height}
        x={labelX - 20 - labelWidth / 2}
        y={labelY - 30 - foreignObjectSize1.height / 2}
        requiredExtensions="http://www.w3.org/1999/xhtml"
        className="custom-edge-style-wrapper"
      >
        <div
          className={cx(styles.EdgeStyleContainer, 'custom-edge-style')}
        >
          <div
            id={straightEdgeId}
            className={cx(edgeStyle !== 'straight' ? styles.EdgeContainer : styles.SelectedEdgeContainer, gClasses.ClickableElement)}
            onMouseDown={(e) => {
              e.preventDefault();
              changeEdgeStyle('straight');
            }}
            tabIndex={0}
            role="button"
            title="Straight"
          >
            <div className={edgeStyle !== 'straight' ? styles.StraightEdge : styles.SelectedStraightEdge} />
          </div>
          <div
            id={curvedEdgeId}
            className={cx(edgeStyle !== 'curve' ? styles.EdgeContainer : styles.SelectedEdgeContainer, gClasses.ClickableElement)}
            onMouseDown={(e) => {
              e.preventDefault();
              changeEdgeStyle('curve');
            }}
            tabIndex={0}
            role="button"
            title="Curved"
          >
            <div className={edgeStyle !== 'curve' ? styles.CurvedEdge : styles.SelectedCurvedEdge} />
          </div>
          <div
            id={stepEdgeId}
            className={cx(edgeStyle !== 'step' ? styles.EdgeContainer : styles.SelectedEdgeContainer, gClasses.ClickableElement)}
            onMouseDown={(e) => {
              e.preventDefault();
              changeEdgeStyle('step');
            }}
            tabIndex={0}
            role="button"
            title="Step"
          >
            <div className={edgeStyle !== 'step' ? styles.StepEdge : styles.SelectedStepEdge} />
          </div>
        </div>
      </foreignObject>
    </>
  );
}
