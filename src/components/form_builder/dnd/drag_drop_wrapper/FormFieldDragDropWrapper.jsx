import React from 'react';
import { useDrop, useDrag } from 'react-dnd';
import cx from 'classnames/bind';
import { FORM_BUILDER_DND_ITEMS } from '../../FormBuilder.strings';
import styles from '../../section/Section.module.scss';
import { get } from '../../../../utils/jsUtility';

function FormFieldDragDropWrapper(props) {
  const {
    id,
    data,
    children,
    dropClassname,
    dragClassname,
    disableDrop,
    disableDrag,
    type,
    onDrop,
    draggingClassName,
  } = props;

  const [{ isDragging, item }, drag] = useDrag(() => {
 return {
    type: FORM_BUILDER_DND_ITEMS.FIELD,
    item: { type: type, id: id },
    collect: (monitor) => {
 return {
      item: monitor.getItem(),
      isDragging: !!monitor.isDragging(),
    };
},
  };
});

  const [{ isOver }, drop] = useDrop({
    accept: [FORM_BUILDER_DND_ITEMS.FIELD, FORM_BUILDER_DND_ITEMS.FIELD_LIST],
    drop: (item, monitor) => onDrop(item, monitor, data),
    collect: (monitor) => { return { isOver: monitor.isOver({ shallow: true }) }; },
  });

  const conditionalActiveClass =
    data.type === FORM_BUILDER_DND_ITEMS.FIELD
      ? ((get(item, ['type']) === FORM_BUILDER_DND_ITEMS.FIELD_LIST) ? null : styles['field-active'])
      : data.type === FORM_BUILDER_DND_ITEMS.FIELD_LIST
      ? styles['fieldList-active']
      : null;

  const conditionalInActiveClass =
    data.type === FORM_BUILDER_DND_ITEMS.FIELD_LIST ? styles['fieldList-Inactive'] : '';

  const cName = isOver ? conditionalActiveClass : conditionalInActiveClass;

  const dragComponent = disableDrag ? (
    <div className={dragClassname} key={id} id={id}>
      {children}
    </div>
  ) : (
    <div
      ref={drag}
      className={cx(dragClassname, isDragging && cx(styles.DraggableElement, draggingClassName))}
      key={id}
      id={id}
    >
      {isDragging ? null : children}
    </div>
  );
  return disableDrop ? (
    <div id={id} key={id} className={cx(dropClassname)}>
      {dragComponent}
    </div>
  ) : (
    <div ref={drop} id={id} key={id} className={cx(dropClassname, cName)}>
      {dragComponent}
    </div>
  );
}

export default FormFieldDragDropWrapper;
