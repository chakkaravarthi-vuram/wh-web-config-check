import React, { useEffect, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

function DndWrapper(props) {
  const { id, children } = props;
  const [context, setContext] = useState(null);

  useEffect(() => {
    setContext(document.getElementById(id));
  }, [id]);

  return context ? (
    <DndProvider backend={HTML5Backend} options={{ rootElement: context }}>
      {children}
    </DndProvider>
  ) : null;
}

export default DndWrapper;
