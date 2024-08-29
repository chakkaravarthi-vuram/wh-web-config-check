import { nullCheck } from '../../utils/jsUtility';
import { POPPER_PLACEMENTS } from './AutoPositioningPopper';

export const calculateDynamicHeight = (popperPosition, referenceElement, minHeight, maxHeight) => {
  if (popperPosition && referenceElement && minHeight && maxHeight) {
    const positionProperties = referenceElement.getBoundingClientRect();
    if (nullCheck(positionProperties, 'top') && nullCheck(positionProperties, 'bottom')) {
      let obtainedHeight = 0;
      if (popperPosition === POPPER_PLACEMENTS.TOP || popperPosition === POPPER_PLACEMENTS.TOP_START || popperPosition === POPPER_PLACEMENTS.TOP_END) {
        obtainedHeight = positionProperties.top - 50;
      } else if (popperPosition === POPPER_PLACEMENTS.BOTTOM || popperPosition === POPPER_PLACEMENTS.BOTTOM_START || popperPosition === POPPER_PLACEMENTS.BOTTOM_END) {
        obtainedHeight = window.innerHeight - positionProperties.bottom - 50;
      }
      return Math.min(Math.max(obtainedHeight, minHeight), Math.min(obtainedHeight, maxHeight));
    }
    return minHeight;
  }
  return minHeight;
};

export default calculateDynamicHeight;
