import jsUtils from 'utils/jsUtility';

export const CUSTOM_FILE_TYPES = [
  'jpg',
  'jpeg',
  'bmp',
  'png',
  'mp4',
  'mpeg',
  'mpg',
  'avi',
];

export const IMAGE_FILE_TYPES = ['jpg', 'jpeg', 'bmp', 'png'];

export const VIDEO_FILE_TYPES = ['mp4', 'mpeg', 'mpg', 'avi'];

export const isCustomFileType = (fileType) =>
  CUSTOM_FILE_TYPES.find(
    (currentFileType) =>
      currentFileType === fileType ||
      jsUtils.upperCase(currentFileType) === fileType,
  );

export const isImageFileType = (fileType) =>
  IMAGE_FILE_TYPES.find(
    (currentFileType) =>
      currentFileType === fileType ||
      jsUtils.upperCase(currentFileType) === fileType,
  );

export const isVideoFileType = (fileType) =>
  VIDEO_FILE_TYPES.find(
    (currentFileType) =>
      currentFileType === fileType ||
      jsUtils.upperCase(currentFileType) === fileType,
  );

export const FILE_TYPES = {
  PDF: 'pdf',
};
