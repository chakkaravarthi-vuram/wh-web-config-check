import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import ConditionalWrapper from '../../../conditional_wrapper/ConditionalWrapper';

function DraggableWrapper(props) {
  const {
    className,
    id,
    children,
    enableDragAndDrop,
    index,
    enableIsDragging,
    isCustomDraggable,
    setCustomDraggable,
    isDragDisabled,
    role,
  } = props;
  console.log('draggableFields inside', isDragDisabled, enableIsDragging, id);
  return (
    <ConditionalWrapper
      condition={enableDragAndDrop}
      wrapper={(wrapperChildren) => (
        <Draggable
          key={`${id}${index}`}
          draggableId={`${id}${index}`}
          index={index}
          isDragDisabled={(isDragDisabled !== null) ? isDragDisabled : !enableDragAndDrop}
          // sensors
        >
          {isCustomDraggable
            ? (provided, snapshot) => (
              setCustomDraggable(provided, snapshot, className, wrapperChildren, enableIsDragging, role))
            : (provided, snapshot) => (
                <div
                  className={className}
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                  role={role}
                >
                  {enableIsDragging
                    ? React.cloneElement(wrapperChildren, {
                        isDragging: snapshot.isDragging,
                      })
                    : wrapperChildren}
                </div>
              )}
        </Draggable>
      )}
    >
      {children}
    </ConditionalWrapper>
  );
}

export default DraggableWrapper;
