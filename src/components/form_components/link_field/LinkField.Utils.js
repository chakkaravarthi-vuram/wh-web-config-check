import { translate } from 'language/config';

const LINK_FIELD_STRINGS = {
  LINK_URL_PLACEHOLDER: translate('form_builder_strings.link_field.link_url_placeholder'),
  LINK_TEXT_PLACEHOLDER: translate('form_builder_strings.link_field.link_text_placeholder'),
  DELETE_LINK_TITLE: translate('form_field_strings.form_field_constants.delete_link'),
};

export const linkValidationHandler = (target, pattern) => {
  let value = 0;
  pattern.forEach((word) => {
    value += target.includes(word);
  });
  return (value === 1);
};

export default LINK_FIELD_STRINGS;
