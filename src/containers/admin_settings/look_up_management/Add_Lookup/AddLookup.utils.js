import { LOOKUP_VALUE_NUMBER_REGEX } from '../../../../utils/strings/Regex';

export const parseNumericValue = (value) => {
    value = value.trim();
    if (!(value.match(LOOKUP_VALUE_NUMBER_REGEX))) return NaN;
    else if (value.includes('.')) return parseFloat(value);
    else return parseInt(value, 10);
};
