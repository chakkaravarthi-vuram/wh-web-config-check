import React from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import ConditionalWrapper from '../../../conditional_wrapper/ConditionalWrapper';

function DroppableWrapper(props) {
  const { id,
    className,
    children,
    enableDragAndDrop,
    onFieldDragEndHandler,
    index,
    direction,
    isCustomDroppable,
    setCustomDroppable,
    role,
  } = props;

  return (
    <ConditionalWrapper
      condition={enableDragAndDrop}
      wrapper={(wrapperChildren) => (
        <DragDropContext onDragEnd={(event) => onFieldDragEndHandler(event, index)}>
          <Droppable droppableId={`${id}${index}`} direction={direction || 'vertical'}>
            {(provided) => (
              isCustomDroppable ?
              setCustomDroppable(provided, className, wrapperChildren) : (
              <div className={className} ref={provided.innerRef} {...provided.droppableProps} role={role}>
                {wrapperChildren}
                {provided.placeholder}
              </div>
            )
            )}
          </Droppable>
        </DragDropContext>
      )}
    >
      {children}
    </ConditionalWrapper>
  );
}

export default DroppableWrapper;
