export const getAccordionTitle = (title, t) => {
        switch (title) {
        case 'general.flow': return t('publish_settings.language_settings.language_configuration.content.language_group.general.flow');
        case 'general.step_name': return t('publish_settings.language_settings.language_configuration.content.language_group.general.step_name');
        case 'general.step_description': return t('publish_settings.language_settings.language_configuration.content.language_group.general.step_description');
        case 'general.step_action_name': return t('publish_settings.language_settings.language_configuration.content.language_group.general.step_action');
        case 'general.title': return t('publish_settings.language_settings.language_configuration.content.language_group.general.title');
        case 'general.description': return t('publish_settings.language_settings.language_configuration.content.language_group.general.description');
        case 'form.field_name': return t('publish_settings.language_settings.language_configuration.content.language_group.form.field_name');
        case 'form.instructions': return t('publish_settings.language_settings.language_configuration.content.language_group.form.instructions');
        case 'form.place_holder': return t('publish_settings.language_settings.language_configuration.content.language_group.form.place_holder');
        case 'form.help_text': return t('publish_settings.language_settings.language_configuration.content.language_group.form.help_text');
        case 'dashboard.metric_fields': return t('publish_settings.language_settings.language_configuration.content.language_group.dashboard.metric_fields');
        case 'dashboard.metric_fields.label': return t('publish_settings.language_settings.language_configuration.content.language_group.dashboard.metric_fields.label');
        case 'form.section_name': return t('publish_settings.language_settings.language_configuration.content.language_group.form.section_name');
        case 'form.table_name': return t('publish_settings.language_settings.language_configuration.content.language_group.form.table_name');
        default: return title;
    }
};
