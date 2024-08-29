import React from 'react';
import cx from 'classnames';
import { useDrop } from 'react-dnd';
import styles from './LayoutDropZone.module.scss';
import { FORM_LAYOUT_TYPE, FORM_TYPE } from '../../Form.string';
import { isEmpty } from '../../../../utils/jsUtility';
import { RESPONSE_FIELD_KEYS } from '../../../../utils/constants/form/form.constant';

function LayoutDropZone(props) {
   const { id, type, dropPath, sectionUUID, onDrop, children, formType, accept = [] } = props;
   const [{ isOver, canDrop }, drop] = useDrop({
     accept: [FORM_LAYOUT_TYPE.FIELD, FORM_LAYOUT_TYPE.FIELD_TEMPLATE, FORM_LAYOUT_TYPE.EXISTING_FIELD, ...accept],
     drop: (item) => {
        const dropObj = {};

        // Construct Source and Destination
        switch (item.type) {
          case FORM_LAYOUT_TYPE.FIELD_TEMPLATE:
            dropObj.source = {
              path: item?.path,
              sectionUUID: item?.sectionUUID,
              type: item?.type,
           };
            dropObj.destination = {
              path: dropPath,
              sectionUUID: sectionUUID,
              type: type,
              data: { [RESPONSE_FIELD_KEYS.FIELD_TYPE]: item[RESPONSE_FIELD_KEYS.FIELD_TYPE] },
            };
          break;
          case FORM_LAYOUT_TYPE.FIELD:
          case FORM_LAYOUT_TYPE.TABLE:
          case FORM_LAYOUT_TYPE.LAYOUT:
          case FORM_LAYOUT_TYPE.BOX:
            dropObj.source = {
               path: item?.path,
               sectionUUID: item?.sectionUUID,
               type: item.type,
            };
            dropObj.destination = {
              path: dropPath,
              sectionUUID: sectionUUID,
              data: item?.data,
              type: type,
            };
          break;
          case FORM_LAYOUT_TYPE.EXISTING_FIELD:
          case FORM_LAYOUT_TYPE.EXISTING_TABLE:

            dropObj.source = {
               path: item?.path,
               sectionUUID: item?.sectionUUID,
               type: item.type,
               fieldUuid: item.fieldUuid,
            };
            dropObj.destination = {
              path: dropPath,
              sectionUUID: sectionUUID,
              data: item?.data,
              type: type,
              fieldUuid: item.fieldUuid,
            };
            break;
          default: break;
        }

        if (isEmpty(dropObj)) return;

        onDrop(
            dropObj?.source || null,
            dropObj?.destination,
        );
     },
     canDrop: () => true,
     collect: (monitor) => {
       return {
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
       };
     },
   });

   const isActive = isOver && canDrop;

   let dropZoneClassName = null;

   const isChildEmpty = isEmpty(children);

   if (isActive) {
      if (isChildEmpty) dropZoneClassName = styles.DropZoneRow;
      else dropZoneClassName = styles.DropZoneColumn;
   }
   if (formType === FORM_TYPE.CREATION_FORM) {
    return (
      <div
        id={id}
        ref={drop}
        className={isChildEmpty && styles.DropZoneContainer}
      >
        <div className={cx(styles.DropZone, dropZoneClassName)}>
            {children}
        </div>

      </div>
    );
    } else { return null; }
}

export default LayoutDropZone;
