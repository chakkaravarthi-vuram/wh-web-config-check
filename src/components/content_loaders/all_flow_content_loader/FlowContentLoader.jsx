import React from 'react';
import ContentLoader from 'react-content-loader';
import { calcwidth } from '../../../utils/UtilityFunctions';

const width = window.innerWidth;

const FlowContentLoader = (props) => new Array(props.count).fill(undefined).map(() => (
  <ContentLoader
    height={350}
    width={width}
    speed={2}
    primaryColor="#d6d6d6"
    secondaryColor="#d6d6d6"
  >
    <circle cx="125" cy="100" r="60" />
    <rect
      x="210"
      y="76"
      rx="0"
      ry="0"
      width={calcwidth(20, 75, width)}
      height="19"
    />
    <rect
      x="210"
      y="144"
      rx="0"
      ry="0"
      width={calcwidth(50, 75, width)}
      height="19"
    />
    <rect
      x="210"
      y="174"
      rx="0"
      ry="0"
      width={calcwidth(70, 75, width)}
      height="19"
    />
  </ContentLoader>
));

export default FlowContentLoader;
