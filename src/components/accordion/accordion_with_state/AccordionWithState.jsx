import React, { useState } from 'react';
import Accordion from '../Accordion';

function AccordionWithState(props) {
  const { children, isDefaultOpen = false } = props;
  const [isAccordionOpen, setIsAccordionOpen] = useState(isDefaultOpen);
  return (
    <Accordion
      {...props}
      isChildrenVisible={isAccordionOpen}
      onIconClickHandler={() => setIsAccordionOpen(!isAccordionOpen)}
    >
      {children}
    </Accordion>
  );
}

export default AccordionWithState;
