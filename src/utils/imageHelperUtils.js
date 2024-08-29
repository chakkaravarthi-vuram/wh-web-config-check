// image conversion functions
/** @module imagehelper * */
/**
 * @memberof imagehelper
 */
  /**
   * @function extractImageFileExtensionFromBase64
   * @description To extract extensiuon of  image from base64
   * @param {string} base64Data base 64 string format
   * @return string
   */

  export const extractImageFileExtensionFromBase64 = (base64Data) => {
    const base64 = base64Data;
    base64.substring('data:image/'.length, base64.indexOf(';base64'));
  };

export default extractImageFileExtensionFromBase64;
