import cx from 'classnames';
import { useContext } from 'react';
import { v4 as uuidv4 } from 'uuid';
import buttonStyles from '../components/form_components/button/Button.module.scss';
import ThemeContext from '../hoc/ThemeContext';
import gClasses from '../scss/Typography.module.scss';
import { BUTTON_TYPE } from './Constants';
import jsUtils from './jsUtility';
import {
  DROPDOWN_CONSTANTS,
  EMPTY_STRING,
  SPACE,
} from './strings/CommonStrings';
import { DEFAULT_COLORS_CONSTANTS } from './UIConstants';
import { trimString } from './UtilityFunctions';
import { mimetypeBytes } from './constants/mimetypes.constants';

/** @module getter&generator * */
/**
 * @memberof getter&generator
 */
/**
 * @function generateFieldId
 * @description to generate uique field id
 * @param {string} field id value
 * @param {string} index  index value
 * @return {string} unique field id
 */
export const generateFieldId = (fieldId, index) => `${fieldId}_${index}`;
/**
 * @memberof getter&generator
 */
/**
 * @function generateUuid
 * @description to generate a random uuid using uuidv4 module
 */
export const generateUuid = () => uuidv4();
/**
 * @memberof getter&generator
 */
/**
 * @function generateEventTargetObject
 * @description to construct event object
 * @param {string} id target id
 * @param {string} value target value
 * @return  {Object} event object
 */
export function generateEventTargetObject(id, value, additionalProps = {}) {
  const target = {
    target: {
      value,
      id,
      ...additionalProps,
    },
  };
  return target;
}
/**
 * @memberof getter&generator
 */
/**
 * @function getCardCount
 * @description to get no of cards to display based on screen size
 * @param {string} containerHeight container element height
 * @param {string} cardHeight card height
 * @param {string} containerWidth container element width
 * @param {string} cardWidth card width
 * @return {number} count
 */
export const getCardCount = (
  containerHeight,
  cardHeight,
  containerWidth,
  cardWidth,
) => {
  let cardCount = 0;
  if (!containerWidth) {
    cardCount = Math.floor(containerHeight / cardHeight);
  } else {
    const cardArea = cardHeight * cardWidth;
    const containerArea = containerHeight * containerWidth;
    cardCount = Math.floor(containerArea / cardArea);
  }
  if (cardCount <= 0) return 1;
  return cardCount;
};

export const getLandingListingRowCount = (
  listHeight,
  isTrialDisplayed,
) => {
  const headerHeight = 108;
  const filterHeight = 64;
  let containerHeight = listHeight - (headerHeight + filterHeight);
  if (isTrialDisplayed) {
    containerHeight -= 50;
  }
  const listCount = getCardCount(containerHeight, 50) + 2;
  console.log('gsadgsdagasd', listHeight, (headerHeight + filterHeight), listCount, containerHeight);
  if (listCount > 15) {
    return listCount;
  }
  return 15;
};

const readFileAsArrayBuffer = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      resolve(e.target.result);
    };

    reader.onerror = (error) => {
      reject(error);
    };

    reader.readAsArrayBuffer(file.slice(0, 4 * 1024)); // Read the first 4KB of the file
  });

const identifyMimeType = (arrayBuffer) => {
  const uintArray = new Uint8Array(arrayBuffer);
  if (uintArray.length < 2) {
    return null;
  }
  const keys = Object.keys(mimetypeBytes);
  for (let i = 0; i < keys.length; i++) {
    const mimeType = keys[i];
    const bytes = mimetypeBytes[mimeType];
    const valid =
      uintArray[0] === bytes.firstByte &&
      uintArray[1] === bytes.secondByte &&
      (bytes.thirdByte === undefined || uintArray[2] === bytes.thirdByte) &&
      (bytes.fourthByte === undefined || uintArray[3] === bytes.fourthByte) &&
      (bytes.fifthByte === undefined || uintArray[4] === bytes.fifthByte);
    if (valid) {
      return mimeType;
    }
  }
  return null;
};

export const isValidMimeType = async (file) => {
  const arrayBuffer = await readFileAsArrayBuffer(file);
  const mimeType = identifyMimeType(arrayBuffer);
  const fileExtension = file.name.split('.').pop().toLowerCase();
  if (fileExtension === 'txt' || fileExtension === 'mov' || fileExtension === 'html' || fileExtension === 'htm') {
    return true;
  } else if (mimeType) {
    console.log(`MIME type: ${mimeType}`);
    return true;
  } else {
    console.log('Could not determine file type.');
    return false;
  }
};

/**
 * @memberof getter&generator
 */
/**
 * @function getExtensionFromFileName
 * @description To extract extension from file name
 * @param {string} fileName file name
 * @return string or null
 */
export const getExtensionFromFileName = (fileName, lowerCase = false) => {
  if (!jsUtils.isEmpty(fileName)) {
  const lastIndex = fileName.lastIndexOf('.');
  if (lastIndex !== -1) {
    return lowerCase ? fileName.substring(lastIndex + 1).toLowerCase() : fileName.substring(lastIndex + 1);
    }
  }
  return null;
};
/**
 * @memberof getter&generator
 */
/**
 * @function removePlusFromCountryCode
 * @param {string} value country code
 * @description To remove + symbol from country code
 * @return {string}
 */
export const removePlusFromCountryCode = (value) => {
  let removedValue = value;
  removedValue = value.replace('+', '');
  return removedValue;
};
/**
 * @memberof getter&generator
 */
/**
 * @function getInitials
 * @param {string} value country code
 * @description Construct initials from first name and last name
 * @return {string}
 */
export const getInitials = (content) => {
  if (content && !jsUtils.isEmpty(content.trim())) {
    const contentArray = content.trim().split(SPACE);
    if (Array.isArray(contentArray)) {
      const firstInitial = contentArray[0].toString()[0];
      const lastInitial = contentArray[1]
        ? contentArray[1].toString()[0]
        : contentArray[0].toString()[1] || '';
      const displayText = firstInitial.concat(lastInitial).toUpperCase();
      return displayText;
    }
    const firstInitial = contentArray[0].toString()[0];
    return firstInitial;
  }
  return EMPTY_STRING;
};
/**
 * @memberof getter&generator
 */
/**
 * @function getFullName
 * @param {string} first_name
 * @param {string} last_name
 * @description Join first name and last name
 * @return {string}
 */
export const getFullName = (first_name, last_name) => {
  if (typeof first_name !== 'string' && typeof first_name !== 'string') {
    return EMPTY_STRING;
  }
  const firstName = jsUtils.capitalizeEachFirstLetter(first_name || EMPTY_STRING);
  const lastName = jsUtils.capitalizeEachFirstLetter(last_name || EMPTY_STRING);
  const fullName = [firstName, lastName].join(SPACE);
  return fullName;
};
/**
 * @memberof getter&generator
 */
/**
 * @function getMobileNumber
 * @param {string} country_code
 * @param {string} mobile_number
 * @description Construct mobile number by appending country code
 * @return {string}
 */
export const getMobileNumber = (country_code, mobile_number) => {
  if (!jsUtils.isEmpty(mobile_number)) {
    let countryCode = '+91';
    if (!jsUtils.isEmpty(country_code)) {
      countryCode = `${country_code}`;
    }
    const ccMobileNumber = [countryCode, mobile_number].join(SPACE);
    return ccMobileNumber;
  }
  return EMPTY_STRING;
};

/**
 * @memberof getter&generator
 */
/**
 * @function getButtonStyle
 * @param {string} buttonType
 * @param {object} style
 * @param {boolean} disabled
 * @description Returns button style based on button type, input style and disabled
 * @return {object}
 */
export const GetButtonStyle = (
  buttonType,
  primaryButtonStyle = null,
  style,
  disabled,
) => {
  const buttonTextClass =
    (buttonType === BUTTON_TYPE.PRIMARY_MINI || BUTTON_TYPE.PRIMARY_V2)
      ? cx(gClasses.FOne11White)
      : null;
  let primaryButtonTypeStyle = [];
  let secondaryButtonTypeStyle = [];
  let buttonStyle = null;
  const { buttonColor } = useContext(ThemeContext);
  console.log('buttonColor111', buttonColor);
  if (
    !jsUtils.isNull(primaryButtonStyle)
  ) {
    primaryButtonTypeStyle.push(
      jsUtils.isNull(primaryButtonStyle)
        ? null
        : primaryButtonStyle,
    );
    secondaryButtonTypeStyle.push(buttonStyles.DefaultSecondaryButton);
  }

  if (buttonType === BUTTON_TYPE.PRIMARY && !disabled) { // dark blue
    primaryButtonTypeStyle = cx(
      primaryButtonTypeStyle,
      buttonStyles.Button,
      buttonStyles.PrimaryButton,
    );
    buttonStyle = { ...style };
    secondaryButtonTypeStyle = null;
  } else if (buttonType === BUTTON_TYPE.PRIMARY && disabled) { // dark blue with opacity 0.5
    primaryButtonTypeStyle = cx(
      buttonColor === DEFAULT_COLORS_CONSTANTS.BUTTON
        ? buttonStyles.DefaultPrimaryDisabledButton
        : buttonStyles.PrimaryDisabledButton,
      buttonStyles.Button,
      buttonStyles.PrimaryButton,
    );
    buttonStyle = { ...style };
    secondaryButtonTypeStyle = null;
  } else if (buttonType === BUTTON_TYPE.AUTH_PRIMARY) { // same as primary but has height 40px
    primaryButtonTypeStyle = cx(
      buttonStyles.Button,
      buttonStyles.PrimaryButton,
      buttonStyles.AuthButtonPrimary,
    );
    buttonStyle = { ...style };
    secondaryButtonTypeStyle = null;
  } else if (buttonType === BUTTON_TYPE.TERTIARY) { // on hover gradient
    primaryButtonTypeStyle = cx(
      gClasses.ClickableElementV3,
      buttonStyles.Button,
      buttonStyles.TertiaryButton,
    );
    secondaryButtonTypeStyle = null;
  } else if (buttonType === BUTTON_TYPE.CANCEL) { // red border - on hover fill red
    primaryButtonTypeStyle = cx(
      gClasses.ClickableElementV3,
      buttonStyles.Button,
      buttonStyles.Cancel,
    );
    secondaryButtonTypeStyle = null;
  } else if (buttonType === BUTTON_TYPE.LIGHT) { // no border only text
    primaryButtonTypeStyle = cx(
      gClasses.ClickableElementV3,
      buttonStyles.Button,
      buttonStyles.Light,
    );
    buttonStyle = { ...style };
    secondaryButtonTypeStyle = null;
  } else if (buttonType === BUTTON_TYPE.OUTLINE_PRIMARY) { // blue border - on hover fill light blue
    primaryButtonTypeStyle = cx(
      primaryButtonTypeStyle,
      gClasses.ClickableElementV3,
      buttonStyles.Button,
      buttonStyles.OutlinePrimaryButton,
    );
    secondaryButtonTypeStyle = null;
  } else if (buttonType === BUTTON_TYPE.OUTLINE_SECONDARY) { // blue border - on hover fill dark blue
      primaryButtonTypeStyle = cx(
      gClasses.ClickableElementV3,
      buttonStyles.Button,
      buttonStyles.OutlineSecondaryButton,
    );
    buttonStyle = { ...style };
    secondaryButtonTypeStyle = null;
  } else if (buttonType === BUTTON_TYPE.DELETE) { // no border - only red text
    primaryButtonTypeStyle = cx(
      gClasses.ClickableElementV3,
      buttonStyles.Button,
      buttonStyles.DeleteButton,
    );
    secondaryButtonTypeStyle = null;
  } else { // secondary - grey button
    secondaryButtonTypeStyle = cx(
      secondaryButtonTypeStyle,
      buttonStyles.Button,
      buttonStyles.SecondaryButton,
    );
    // buttonStyle = {
    //   color: jsUtils.isNull(secondaryButtonColor)
    //     ? buttonColor
    //     : secondaryButtonColor.backgroundColor,
    //   borderColor: jsUtils.isNull(secondaryButtonColor)
    //     ? dynamicButtonColor
    //     : secondaryButtonColor.backgroundColor,
    //   [BS.HOVER]: {
    //     backgroundColor: jsUtils.isNull(secondaryButtonColor)
    //       ? dynamicButtonColor
    //       : 'white',
    //     color: jsUtils.isNull(secondaryButtonColor)
    //       ? COLOR_CONSTANTS.WHITE
    //       : secondaryButtonColor.backgroundColor,
    //   },
    //   ...style,
    // };
    primaryButtonTypeStyle = null;
  }
  return {
    buttonTextClass,
    primaryButtonTypeStyle,
    secondaryButtonTypeStyle,
    buttonStyle,
  };
};
/**
 * @memberof getter&generator
 */
/**
 * @function getDropdownData
 * @param {string} values
 * @description convert array of strings to object as label and value for dropdown
 * @return {Object} dropdown data
 */
export const getDropdownData = (inpValues, trimSpace = false) => {
  let values = inpValues;
  if (
    Array.isArray(values) &&
    values.length > 0 &&
    typeof values[0] === 'string'
  ) {
    values = inpValues.join();
  }
  if (typeof values === 'string') {
    const dropdownData = [];
    let list = values.split(',');
    list = Array.from(new Set(list));
    list.forEach((data) => {
      if (!jsUtils.isEmpty(data.trim())) {
        console.log(data);
        const value = trimSpace ? trimString(data) : data;
        dropdownData.push({
          [DROPDOWN_CONSTANTS.OPTION_TEXT]: value,
          [DROPDOWN_CONSTANTS.VALUE]: value,
        });
      }
    });
    return dropdownData;
  }
  return values;
};
/**
 * @memberof getter&generator
 */
/**
 * @function randomNumberInRange
 * @param {string} min minimum thershold
 * @param {string} max maximum thershold
 * @description generate random number
 * @return {number}
 */
export function randomNumberInRange(min, max) {
  return Math.random() * (max - min) + min;
}
/**
 * @memberof getter&generator
 */
/**
 * @function getLabelFromIndexList
 * @param {Array} optionList
 * @param {Array} indexList
 * @description get random element from array
 * @return {string}
 */
export const getLabelFromIndexList = (optionList, indexList) => {
  if (indexList && indexList.length > 0) {
    const labelObjList = jsUtils.intersectionWith(
      optionList,
      indexList,
      (option, index) => {
        if (jsUtils.isObject(index)) {
          return option.value === index.value;
        }
        return option.value === index;
      },
    );

    const labelList = labelObjList.map((labelObj) => labelObj.label);

    return labelList;
  }
  return [];
};
/**
 * @memberof getter&generator
 */
/**
 * @function getLabelFromIndex
 * @param {Object} optionList
 * @param {number} index
 * @description get label from index
 * @return {string} label
 */
export const getLabelFromIndex = (optionList, index) => {
  console.log('sdsdsd**', optionList, index);
  if (!jsUtils.isNull(index)) {
    const label = jsUtils.find(optionList, (obj) => obj.value === index);
    if (label && label.label) return label.label;
  }
  return EMPTY_STRING;
};
/**
 * @memberof getter&generator
 */
/**
 * @function getFormattedLanguageListDropDown
 * @param {Object} response
 * @description convert array of language strings formatted for dropdown
 */
export const getFormattedLanguageListDropDown = (response) => {
  console.log('getFormattedLanguageListDropDown', response);
  let index;
  const data = [];
  for (index = 0; index < response.length; index += 1) {
    data.push({
      [DROPDOWN_CONSTANTS.OPTION_TEXT]: response[index],
      [DROPDOWN_CONSTANTS.VALUE]: response[index],
    });
  }
  return data;
};
/**
 * @memberof getter&generator
 */
/**
 * @function getFormattedLocaleListDropDown
 * @param {Object} response
 * @description convert array of locale strings formatted for dropdown
 */
export const getFormattedLocaleListDropDown = (response) => {
  let index;
  const data = [];
  for (index = 0; index < response.length; index += 1) {
    data.push({
      [DROPDOWN_CONSTANTS.OPTION_TEXT]: `${response[index].language} ${response[index].locale}`,
      [DROPDOWN_CONSTANTS.VALUE]: response[index].locale,
      [DROPDOWN_CONSTANTS.LANGUAGE]: response[index].language,
    });
  }
  return data;
};
/**
 * @memberof getter&generator
 */
/**
 * @function getFormattedTimezoneListDropDown
 * @param {Object} response
 * @description convert array of timezone strings formatted for dropdown
 */
export const getFormattedTimezoneListDropDown = (response) => {
  let index;
  const data = [];
  for (index = 0; index < response.length; index += 1) {
    data.push({
      [DROPDOWN_CONSTANTS.OPTION_TEXT]: response[index].timezone_display,
      // [DROPDOWN_CONSTANTS.VALUE]: response[index].timezone_display,
      [DROPDOWN_CONSTANTS.VALUE]: response[index].timezone,
      [DROPDOWN_CONSTANTS.COUNTRY]: response[index].country,
    });
  }
  return data;
};
