import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { useDrag, useDrop } from 'react-dnd';
import { Text } from '@workhall-pvt-lmt/wh-ui-library';
import DragIcon from 'assets/icons/form_fields/DragIcon';
import Edit from 'assets/icons/application/EditV2';
import Trash from 'assets/icons/application/Trash';
import gClasses from 'scss/Typography.module.scss';
import styles from '../ConfigPanel.module.scss';
import { DRAG_AND_DROP_TABLE_COLUMN } from '../../DashboardConfig.strings';
import AlertTriangleIcon from '../../../../../assets/icons/AlertTriangle';

function SelectedColumnCard(props) {
  const {
    data: { field, label, isDeletedField = false },
    findField,
    moveField,
    onEdit,
    onRemove,
  } = props;
  const originalIndex = findField(field).index;

  const [{ opacity }, drag] = useDrag(
    {
      type: DRAG_AND_DROP_TABLE_COLUMN,
      item: { field, originalIndex },
      collect(monitor) {
        return { opacity: monitor.isDragging() ? 0 : 1 };
      },
      end: (item, monitor) => {
        const { field: droppedField, originalIndex } = item;
        const didDrop = monitor.didDrop();
        if (didDrop) {
          moveField(droppedField, originalIndex, true);
        }
      },
    },
    [field, originalIndex, moveField],
  );
  const [, drop] = useDrop(
    {
      accept: DRAG_AND_DROP_TABLE_COLUMN,
      hover({ field: droppedField }) {
        if (droppedField !== field) {
          const overIndex = findField(field).index;
          moveField(droppedField, overIndex);
        }
      },
    },
    [findField, moveField],
  );

  return (
    <li
      ref={(node) => drag(drop(node))}
      className={styles.EachSelectedColumn}
      style={{ opacity }}
    >
      <div className={styles.LeftSideItem}>
        <div>
          <DragIcon className={styles.DragIcon} />
        </div>
        <Text content={label} className={gClasses.Ellipsis} />
      </div>
      <div className={cx(gClasses.DFlexCenter, gClasses.gap12)}>
        {isDeletedField ? (
          <AlertTriangleIcon width={19} height={19} />
        ) : (
          <button
            onClick={() => onEdit(field)}
            className={styles.EditDeleteIcons}
          >
            <Edit />
          </button>
        )}
        <button
          onClick={() => onRemove(field)}
          className={styles.EditDeleteIcons}
        >
          <Trash />
        </button>
      </div>
    </li>
  );
}

SelectedColumnCard.propTypes = {
  data: PropTypes.objectOf({
    field: PropTypes.string,
    label: PropTypes.string,
    isDeletedField: PropTypes.bool,
  }),
  findField: PropTypes.func,
  moveField: PropTypes.func,
  onEdit: PropTypes.func,
  onRemove: PropTypes.func,
};

export default SelectedColumnCard;
