import { translateFunction } from '../../utils/jsUtility';
import { FIELD_IDS, FIELD_OPTION_VALUES } from './InformationWidget.constants';

export const WIDGET_STRINGS = (t = translateFunction) => {
  return {
  EDITOR_STRINGS: {
    INSERT_FIELD: t('information_widget.editor_strings.insert_field'),
    INSERT_CHILD: t('information_widget.editor_strings.insert_child_field'),
    INSERT_BUTTON: t('information_widget.editor_strings.insert_button'),
    INSERT_IMAGE: t('information_widget.editor_strings.insert_image'),
  },
  CANCEL: t('information_widget.button_labels.cancel'),
  SAVE: t('information_widget.button_labels.save'),
  INSERT_FIELD: {
    INSERT_TEXT: t('information_widget.editor_strings.insert_field'),
    FIELD_DROPDOWN: {
      LABEL: t('information_widget.insert_field.field_dropdown.label'),
      SEARCH_PLACEHOLDER: t('information_widget.insert_field.field_dropdown.search_placeholder'),
      PLACEHOLDER: t('information_widget.insert_field.field_dropdown.placeholder'),
    },
    CHOOSE_FIELD_TYPE: {
      ID: FIELD_IDS.CHOOSE_FIELD_TYPE,
      LABEL: t('information_widget.insert_field.child_field_type.label'),
      OPTIONS: [
        {
          label: t('information_widget.insert_field.child_field_type.options.direct_fields'),
          value: FIELD_OPTION_VALUES.FIELD_TYPE_DIRECT,
        },
        {
          label: t('information_widget.insert_field.child_field_type.options.child_recursive_fields'),
          value: FIELD_OPTION_VALUES.FIELD_TYPE_CHILD,
        },
      ],
    },
  },
  INSERT_BUTTON: {
    INSERT_TEXT: t('information_widget.editor_strings.insert_button'),
    BUTTON_LABEL: {
      ID: FIELD_IDS.BUTTON_LABEL,
      LABEL: t('information_widget.insert_button.button_label'),
    },
    BUTTON_STYLE: {
      ID: FIELD_IDS.BUTTON_STYLE,
      LABEL: t('information_widget.insert_button.button_style.label'),
      OPTIONS: [
        {
          label: t('information_widget.insert_button.button_style.options.link'),
          value: FIELD_OPTION_VALUES.BUTTON_TYPE_LINK,
        },
        {
          label: t('information_widget.insert_button.button_style.options.solid_button'),
          value: FIELD_OPTION_VALUES.BUTTON_TYPE_SOLID,
        },
        {
          label: t('information_widget.insert_button.button_style.options.outline_button'),
          value: FIELD_OPTION_VALUES.BUTTON_TYPE_OUTLINE,
        },
      ],
    },
    BUTTON_LINK: {
      ID: FIELD_IDS.BUTTON_LINK,
      LABEL: t('information_widget.insert_button.button_link.link'),
    },
  },
  INSERT_CHILD: {
    CONFIGURE_TITLE: t('information_widget.insert_child.title'),
    CHILD_RECURSIVE: {
      ID: FIELD_IDS.CHILD_RECURSIVE,
      LABEL: t('information_widget.insert_child.child_recursive.label'),
      OPTIONS: [
        {
          label: t('information_widget.insert_child.child_recursive.options.yes'),
          value: FIELD_OPTION_VALUES.CHILD_RECURSIVE_BORDER_YES,
        },
        {
          label: t('information_widget.insert_child.child_recursive.options.no'),
          value: FIELD_OPTION_VALUES.CHILD_RECURSIVE_BORDER_NO,
        },
      ],
    },
    CHILD_BORDER: {
      ID: FIELD_IDS.CHILD_BORDER,
      LABEL: t('information_widget.insert_child.child_border.label'),
      OPTIONS: [
        {
          label: t('information_widget.insert_child.child_border.options.yes'),
          value: FIELD_OPTION_VALUES.CHILD_RECURSIVE_BORDER_YES,
        },
        {
          label: t('information_widget.insert_child.child_border.options.no'),
          value: FIELD_OPTION_VALUES.CHILD_RECURSIVE_BORDER_NO,
        },
      ],
    },
    CHILD_BACKGROUND: {
      LABEL: t('information_widget.insert_child.child_background.label'),
    },
    CHILD_RECURSIVE_FIELD: {
      ID: FIELD_IDS.CHILD_RECURSIVE_FIELD,
      LABEL: t('information_widget.insert_child.child_recursive_field.label'),
      ERROR_LABEL: t('information_widget.insert_child.child_recursive_field.error_label'),
    },
    CHILD_EDITOR: {
      LABEL: t('information_widget.insert_child.child_editor.label'),
    },
  },
  ERROR_MESSAGES: {
    VALID_URI: t('information_widget.error_messages.invalid_url'),
  },
  TEMPLATE_STRINGS: {
    YES: t('information_widget.template_strings.yes'),
    NO: t('information_widget.template_strings.no'),
  },
};
};
