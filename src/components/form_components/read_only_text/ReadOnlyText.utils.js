export const SUPPORTED_FILE_TYPES = [
  'jpg',
  'jpeg',
  'bmp',
  'png',
  'pdf',
  'mp4',
  'mpeg',
  'mpg',
  'avi',
  'docs',
  'docx',
]; // removing 'csv', 'xlsx'  as part of ETF-5360.

export const isSupportedFileType = (fileType) =>
  SUPPORTED_FILE_TYPES.find((currentFileType) => currentFileType === fileType);
export const findrowindex = (tableuuid, rowid, activeform, rowindex) => {
  const rowData = activeform[tableuuid];
  let bool = false;
  rowData.forEach((data, index) => {
    if (rowid === data._id && rowindex === index) {
      bool = true;
    }
  });
  return bool;
};
