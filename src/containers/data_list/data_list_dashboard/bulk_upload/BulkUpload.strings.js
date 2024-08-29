const BULK_UPLOAD_STRINGS = (t = () => {}) => {
  return {
  INIT_PAGE: 0,
  PREVIEW_PAGE: 1,
  TITLE: t('datalist.bulk_upload_strings.title'),
  SUB_TITLE: t('datalist.bulk_upload_strings.sub-title'),
  CONTENT: t('datalist.bulk_upload_strings.content'),
  STEPPER_LIST: [{ label: t('datalist.bulk_upload_strings.init_bulk_upload.upload'), id: 'upload' }, { label: t('datalist.bulk_upload_strings.init_bulk_upload.preview'), id: 'preview' }],
  TEMPLATE: t('datalist.bulk_upload_strings.template'),
  BULK_UPLOAD: t('datalist.datalist_dashboard.bulk_upload'),
};
};

export default BULK_UPLOAD_STRINGS;
