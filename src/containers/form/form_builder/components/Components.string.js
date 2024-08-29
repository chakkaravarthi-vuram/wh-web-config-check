import { FIELD_TYPE } from 'utils/constants/form.constant';
import RichTextIcon from 'assets/icons/page_components/RichTextIcon';
import GridBoxIcon from 'assets/icons/page_components/GridBoxIcon';
import ButtonLinkIcon from 'assets/icons/page_components/ButtonLinkIcon';
import ImageCompIcon from 'assets/icons/app_builder_icons/ImageCompIcon';
import { FORM_LAYOUT_TYPE } from '../../Form.string';

const COMPONENTS_STRINGS = (t) => {
  return {
    LIST_OPTIONS: [
      {
        elementName: t('individual_entry.config_panel.design_elements.rich_text.label'),
        elementDesc: t('individual_entry.config_panel.design_elements.rich_text.desc'),
        icon: RichTextIcon,
        type: FIELD_TYPE.RICH_TEXT,
      },
      {
        elementName: t('individual_entry.config_panel.design_elements.image.label'),
        elementDesc: t('individual_entry.config_panel.design_elements.image.desc'),
        icon: ImageCompIcon,
        type: FIELD_TYPE.IMAGE,
      },
      {
        elementName: t('individual_entry.config_panel.design_elements.box.label'),
        elementDesc: t('individual_entry.config_panel.design_elements.box.desc'),
        icon: GridBoxIcon,
        type: FORM_LAYOUT_TYPE.LAYOUT,
        layoutType: FORM_LAYOUT_TYPE.BOX,
      },
      {
        elementName: t('individual_entry.config_panel.design_elements.button_link.label'),
        elementDesc: t('individual_entry.config_panel.design_elements.button_link.desc'),
        icon: ButtonLinkIcon,
        type: FIELD_TYPE.BUTTON_LINK,
      },
    ],
  };
};

export default COMPONENTS_STRINGS;
