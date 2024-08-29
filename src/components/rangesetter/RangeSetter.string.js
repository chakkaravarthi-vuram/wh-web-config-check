import { translateFunction } from '../../utils/jsUtility';

export const RANGE_SETTER_STRING = (t = translateFunction) => {
    return {
    RANGE: t('range_setter_strings.range'),
    LEFT_RANGE_ID: 'leftRange',
    RIGHT_RANGE_ID: 'rightRange',
    RANGE_LABEL: t('range_setter_strings.range_label'),
    ADD_MORE: t('range_setter_strings.add_more'),
    ADD_ONE: t('range_setter_strings.add_one'),
    LABEL: t('range_setter_strings.label'),
    TO: t('range_setter_strings.to'),
    };
};
