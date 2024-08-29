import React, { useState } from 'react';

export default function StickyHeader(WrappedComp, scrollThreshHold, fillCompHeight) {
  function HeaderComponent(prop) {
    const [headerStyle, setHeaderStyle] = useState({ position: 'inherit', scrollTop: 0, marginTop: '0px' });
    const onScrollContainer = (event) => {
      const { scrollTop } = event.target;
      const { position } = headerStyle;
      console.log('scrolled', scrollTop);
      if (scrollTop > scrollThreshHold && position === 'inherit') {
        setHeaderStyle({ position: 'fixed', scrollTop: scrollThreshHold, marginTop: `${fillCompHeight}px` });
        return;
      }
      if (scrollTop <= scrollThreshHold && position === 'fixed') {
        setHeaderStyle({ position: 'inherit', scrollTop: 0, marginTop: '0px' });
      }
    };
    return <WrappedComp {...prop} headerStyle={headerStyle} onScrollContainer={onScrollContainer} />;
  }
  return HeaderComponent;
}
