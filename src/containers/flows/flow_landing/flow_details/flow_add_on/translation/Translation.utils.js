import { CHIP_COLOR } from '../../../../../../utils/Constants';
import { translateFunction } from '../../../../../../utils/jsUtility';
import { EMPTY_STRING } from '../../../../../../utils/strings/CommonStrings';
import { FLOW_ADDON_STRINGS } from '../FlowAddOn.strings';

export const getTranslationChipStyles = (status, t = translateFunction) => {
    const chipStyles = {
        textColor: EMPTY_STRING,
        backgroundColor: EMPTY_STRING,
    };
    switch (status) {
        case FLOW_ADDON_STRINGS(t).TRANSLATION.STATUS.AVAILABLE:
            chipStyles.backgroundColor = CHIP_COLOR.GREEN_01;
            chipStyles.textColor = CHIP_COLOR.GREEN_10;
            break;
        case FLOW_ADDON_STRINGS(t).TRANSLATION.STATUS.NOT_AVAILABLE:
            chipStyles.textColor = CHIP_COLOR.BLACK_10;
            chipStyles.backgroundColor = CHIP_COLOR.GRAY_10;
            break;
        default: break;
    }
    console.log('returned chpstyles', chipStyles);
    return chipStyles;
};
