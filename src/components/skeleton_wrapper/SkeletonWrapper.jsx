import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';

import ConditionalWrapper from '../conditional_wrapper/ConditionalWrapper';

function SkeletonWrapper(props) {
  const {
    children, height, width, isLoading, color, highlightColor, className, style,
  } = props;

  return isLoading ? (
    <ConditionalWrapper
      condition={!!(color || highlightColor)}
      wrapper={(children_) => (
        <SkeletonTheme color={color} highlightColor={highlightColor}>
          {children_}
        </SkeletonTheme>
      )}
    >
      <Skeleton height={height} width={width} style={style} className={className} />
    </ConditionalWrapper>
  ) : children;
}

export default SkeletonWrapper;
