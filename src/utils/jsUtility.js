import { translate } from 'language/config';
import { LOCALAE } from './constants/currency.constant';
import { EMAIL_REGEX } from './strings/Regex';
import { EMPTY_STRING } from './strings/CommonStrings';

const {
  isEmpty,
  has,
  get,
  isObject,
  find,
  map,
  capitalize,
  startsWith,
  set,
  omitBy,
  isNil,
  isEqual,
  intersection,
  union,
  isNull,
  upperCase,
  isNaN,
  difference,
  unset,
  isArray,
  keys,
  merge,
  cloneDeep,
  pick,
  startCase,
  remove,
  forEach,
  intersectionWith,
  uniq,
  includes,
  sortBy,
  upperFirst,
  split,
  uniqBy,
  compact,
  concat,
  isUndefined,
  filter,
  findIndex,
  some,
  truncate,
  join,
  groupBy,
  isSafeInteger,
  round,
  omit,
  isString,
  isPlainObject,
  isNumber,
  debounce,
  findLastIndex,
} = require('lodash');

const setObject = (obj, fields, deepSet = false) => {
  const newObj = {};
  fields.forEach((field) => {
    if (isObject(field)) {
      set(
        newObj,
        keys(field),
        setObject(obj[keys(field)], field[keys(field)], deepSet),
      );
    } else set(newObj, field, deepSet ? cloneDeep(obj[field]) : obj[field]);
  });
  return newObj;
};
// const isEmpty = isEmpty;
// const isSafeInteger = isSafeInteger;
// const has = has;
// const get = get;
// const isObject = isObject;
// const find = find;
// const map = map;
// const capitalize = capitalize;
// const startsWith = startsWith;
// const set = set;
// const isEqual = isEqual;
// const intersection = intersection;
// const union = union;
// const isNull = isNull;
// const isNil = isNil;
// const upperCase = upperCase;
// const isNaN = isNaN;
// const difference = difference;
// const unset = unset;
// const isArray = isArray;
// const merge = merge;
// const cloneDeep = cloneDeep;
// const pick = pick;
// const startCase = startCase;
// const remove = remove;
// const forEach = forEach;
// const uniq = uniq;
// const uniqBy = uniqBy;
// const intersectionWith = intersectionWith;
// const includes = includes;
// const omitBy = omitBy;
// const split = split;
// const some = some;
// const compact = compact;
// const concat = concat;
// const isUndefined = isUndefined;
// const filter = filter;
// const findIndex = findIndex;
// const truncate = truncate;
// const join = join;
// const groupBy = groupBy;

const nullCheckObject = (obj, path) => {
  if (isObject(get(obj, path))) return true;
  return false;
};

const nullCheck = (obj, path, isPositiveNumber = false) => {
  // sample input
  // const obj = { 'a': { 'b': 2 } };
  // checking b is present inside obj
  // nullCheck(obj,'a.b'); -> output true
  const value = path ? get(obj, path) : obj;
  if (typeof value === 'number') {
    if (isPositiveNumber) {
      if (value > 0) return true;
      return false;
    }
    return true;
  }
  if (value) return true;
  return false;
};

// const nullCheck = nullCheck;

const multiNullCheck = (obj, pathArray, isPositiveNumber = false) =>
  pathArray.every((path) => nullCheck(obj, path, isPositiveNumber));

// removes undefined & null fields from object
const removeNilFieldsFromObject = (obj) => omitBy(obj, isNil);

const cleanObject = (inputObj) => {
  const obj = { ...inputObj };
  // removes undefined,null,empty string, empty object fields from object
  if (!isEmpty(obj)) {
    const propNames = Object.getOwnPropertyNames(obj);
    for (let i = 0; i < propNames.length; i++) {
      const propName = propNames[i];
      if (
        obj[propName] === null ||
        obj[propName] === undefined ||
        obj[propName] === '' ||
        (typeof obj[propName] === 'object' &&
          Object.keys(obj[propName]).length === 0)
      ) {
        delete obj[propName];
      }
    }
    return obj;
  }
  return null;
};

const intersectObjects = (first, ...rest) => {
  // intersect keys from all passed objects and set values from first object
  const restKeys = rest.map((obj) => Object.keys(obj));
  return Object.fromEntries(
    Object.entries(first).filter((entry) =>
      restKeys.every((rk) => rk.includes(entry[0]))),
  );
};

const isObjectFieldsEmpty = (arg) => {
  if (arg && typeof arg === 'object') {
    // eslint-disable-next-line no-restricted-syntax
    for (const [, value] of Object.entries(arg)) {
      if (!isEmpty(value)) return false;
    }
    return true;
  }
  return true;
};

const isArrayObjectsEmpty = (arrayObj) =>
  !arrayObj.some((eachObj) => !isEmpty(eachObj));

const isArrayOfArrayObjectsEmpty = (array) =>
  !array.some((eachArr) => eachArr.some((eachObj) => !isEmpty(eachObj)));

const getDomainName = (hostName) =>
  hostName.substring(
    hostName.lastIndexOf('.', hostName.lastIndexOf('.') - 1) + 1,
  );

const getSubDomainName = (hostName) => {
  const hostNameTokens = hostName.split('.');
  if (hostNameTokens.length > 2) {
    return hostNameTokens[0];
  }
  return false;
};

const isIpAddress = (ipAddress) =>
  /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(
    ipAddress,
  );

// const setObject = setObject;

// const sortBy = sortBy;
// const upperFirst = upperFirst;

const formFieldEmptyCheck = (value) => {
  const valueType = typeof value;
  if (valueType === 'boolean' || valueType === 'number') return true;
  if (valueType === 'string' && value.trim().length > 0) return true;
  return !isEmpty(value);
};

const formFieldEmptyCheckObjSensitive = (value) => {
  const valueType = typeof value;
  if (
    valueType === 'boolean' ||
    valueType === 'number' ||
    valueType === 'object'
  ) return true;
  if (valueType === 'string') {
    if (value.trim().length > 0) return true;
    return false;
  }
  return !isEmpty(value);
};
const removeAllSpaces = (input) => {
  if (input && typeof input === 'string') {
    const trimmedString = input.replace(/\s+/g, '');
    return trimmedString;
  }
  return input;
};
const safeTrim = (input) => {
  if (typeof input === 'string') return input.trim();
  return input;
};
const getLocale = (value) => {
  const localeValue = find(LOCALAE, (obj) => obj.code === value);
  return localeValue && localeValue !== -1
    ? localeValue.locale
    : LOCALAE[0].locale;
};
const formatLocale = (value) => {
  if (value === 'es-ES_tradnl') {
    value = 'es-ES';
  }
  return value;
};
const formatter = (value, locale, allowedDecimalPoints = 5) => {
  // { minimumFractionDigits: 0, maximumFractionDigits: 5}
  const formatpattern = Intl.NumberFormat(locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: allowedDecimalPoints || 5,
  });
  const constructedValue = formatpattern.format(value);
  return constructedValue;
};
const isNullishCoalesce = (value) => isNull(value) || isUndefined(value);

const isBoolean = (value) => typeof value === 'boolean';

const isFiniteNumber = (value) => typeof value === 'number' && Number.isFinite(value);

const removeExtraSpace = (text) => text.trim().replace(/\s+/g, ' ');

const dateFormatter = (dateString, options = { day: 'short', month: 'short', year: 'numeric' }) => {
  const date = new Date(dateString);
  const formattedDate = date.toLocaleDateString('en-US', options);
  return formattedDate;
};

const translateFunction = (data) => translate(data);

const capitalizeEachFirstLetter = (string) => {
  if (isEmpty(string)) return null;
  const words = string.split(' ');
  return words
    .map((word) => {
      if (!isEmpty(word)) {
        if (!EMAIL_REGEX.test(word)) {
          return word[0].toUpperCase() + word.substring(1);
        }
        return word;
      }
      return null;
    })
    .join(' ');
};
const capitalizeFirstLetter = (string) => {
  if (isEmpty(string)) return null;
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const removeDuplicates = (arr) => [...new Set(arr)];

const removeDuplicateFromArrayOfObjects = (arrOfObjects, key) => {
  const uniqueObjectsMap = new Map();

  arrOfObjects.forEach((obj) => {
      uniqueObjectsMap.set(obj[key], obj);
  });
  const uniqueObjects = Array.from(uniqueObjectsMap.values());
  return uniqueObjects;
};

const emptyFunction = () => EMPTY_STRING;

const emptyRef = {
  current: {},
};

export {
  isEmpty,
  isSafeInteger,
  has,
  get,
  isObject,
  find,
  map,
  capitalize,
  startsWith,
  set,
  isEqual,
  intersection,
  union,
  isNull,
  isNil,
  upperCase,
  isNaN,
  difference,
  unset,
  isArray,
  merge,
  cloneDeep,
  pick,
  startCase,
  remove,
  forEach,
  uniq,
  uniqBy,
  intersectionWith,
  includes,
  omitBy,
  split,
  some,
  compact,
  concat,
  isUndefined,
  filter,
  findIndex,
  truncate,
  join,
  groupBy,
  nullCheckObject,
  nullCheck,
  multiNullCheck,
  removeNilFieldsFromObject,
  cleanObject,
  intersectObjects,
  isObjectFieldsEmpty,
  isArrayObjectsEmpty,
  isArrayOfArrayObjectsEmpty,
  getDomainName,
  getSubDomainName,
  isIpAddress,
  setObject,
  sortBy,
  removeAllSpaces,
  upperFirst,
  formFieldEmptyCheck,
  formFieldEmptyCheckObjSensitive,
  safeTrim,
  round,
  formatter,
  getLocale,
  formatLocale,
  isNullishCoalesce,
  removeExtraSpace,
  isBoolean,
  isFiniteNumber,
  isString,
  isPlainObject,
  translateFunction,
  capitalizeFirstLetter,
  capitalizeEachFirstLetter,
  omit,
  isNumber,
  emptyFunction,
  emptyRef,
  removeDuplicateFromArrayOfObjects,
  findLastIndex,
};

export default {
  isEmpty,
  isSafeInteger,
  has,
  get,
  isObject,
  find,
  map,
  capitalize,
  startsWith,
  set,
  isEqual,
  intersection,
  union,
  isNull,
  isNil,
  upperCase,
  isNaN,
  difference,
  unset,
  isArray,
  merge,
  cloneDeep,
  pick,
  startCase,
  remove,
  forEach,
  uniq,
  uniqBy,
  intersectionWith,
  includes,
  omitBy,
  split,
  some,
  compact,
  concat,
  isUndefined,
  filter,
  findIndex,
  truncate,
  join,
  groupBy,
  nullCheckObject,
  nullCheck,
  multiNullCheck,
  removeNilFieldsFromObject,
  cleanObject,
  intersectObjects,
  isObjectFieldsEmpty,
  isArrayObjectsEmpty,
  isArrayOfArrayObjectsEmpty,
  getDomainName,
  getSubDomainName,
  isIpAddress,
  setObject,
  sortBy,
  upperFirst,
  formFieldEmptyCheck,
  formFieldEmptyCheckObjSensitive,
  safeTrim,
  round,
  capitalizeEachFirstLetter,
  capitalizeFirstLetter,
  omit,
  isNullishCoalesce,
  isBoolean,
  isFiniteNumber,
  isString,
  removeExtraSpace,
  isPlainObject,
  dateFormatter,
  removeDuplicates,
  removeDuplicateFromArrayOfObjects,
  translateFunction,
  isNumber,
  emptyFunction,
  emptyRef,
  debounce,
  findLastIndex,
};
