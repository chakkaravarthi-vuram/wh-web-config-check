import i18next from 'i18next';
import jsUtility, { cloneDeep, get, unset, translateFunction, isEmpty } from '../../utils/jsUtility';
import { APP_NAME_VALIDATION, constructJoiObject, LINK_VALIDATION } from '../../utils/ValidationConstants';
import { APP_VALIDATION } from './application.strings';
import { APP_COMP_STRINGS } from './app_builder/AppBuilder.strings';
import { BE_TASK_LIST_TYPE, GET_TASK_CONFIG_CONSTANT, TASK_COMPONENT_CONFIG_KEYS, TYPE_OF_TASK_KEY } from './app_configuration/task_configuration/TaskConfiguration.constants';
import { EMPTY_STRING } from '../../utils/strings/CommonStrings';
import { REPORT_CONFIGUTAION_STRINGS } from './app_configuration/report_configuration/ReportConfiguration.strings';
import { PATHNAME_URL_REGEX } from '../../utils/strings/Regex';
import { APP_MIN_MAX_CONSTRAINT } from '../../utils/Constants';

const Joi = require('joi');

const linkCompSchema = (t = translateFunction) => (
    Joi.object().keys({
        links: Joi.array().items(Joi.object().keys({
            type: Joi.string().required(),
            name: APP_NAME_VALIDATION.label(t(APP_VALIDATION.NAME)).required(),
            url: Joi.string().when('type', {
                is: 'adhoc_link',
                then: LINK_VALIDATION.label(t(APP_VALIDATION.URL)).required(),
                otherwise: Joi.string().allow(null),
            }),
            source_uuid: Joi.string().when('type', {
                is: 'flow_link',
                then: Joi.string().label(t(APP_VALIDATION.FLOW)).required(),
                otherwise: Joi.string().when('type', {
                    is: 'data_list_link',
                    then: Joi.string().label(t(APP_VALIDATION.DATALIST)).required(),
                    otherwise: Joi.string().allow(EMPTY_STRING, null),
                }),
            }),
        })).min(1).required(),
    }).unknown()
);

const textStylingComponentSchema = (t = translateFunction) => (
    Joi.object().keys({
        formatter: Joi.string().label(t(APP_VALIDATION.SOME_DATA)).max(2000).messages({
            'string.max': t(APP_VALIDATION.MAX_TEXT_STYLING_COMP),
        })
        .required(),
    })
);

const imageComponentSchema = (t = translateFunction) => (
    Joi.object().keys({
        image_id: Joi.string().label(t(APP_VALIDATION.IMAGE)).required(),
    })
);

const reportComponentSchema = (t) => {
    const { FIELD: { REPORT } } = REPORT_CONFIGUTAION_STRINGS(t);
    return Joi.object().keys({
        [REPORT.ID]: Joi.string().label(t(APP_VALIDATION.REPORT)).required(),
    });
};

const webpageEmbedComponentSchema = (t) => {
    console.log('webpageEmbedComponentSchema');
    return Joi.object().keys({
        embed: Joi.object({
            url: Joi.string().uri({ scheme: ['https'] }).label(t(APP_VALIDATION.WEBPAGE_EMBEDDING)).required(),
        }).required(),
        shortcut_style: Joi.string().valid('embed_url').required(),
    });
};

const dashboardComponentSchema = (t = translateFunction) => (
    Joi.object().keys({
        source_uuid: Joi.string().label(t(APP_VALIDATION.DASHBOARD)).required(),
        type: Joi.string().label(t(APP_VALIDATION.DASHBOARD_TYPE)).required(),
    })
);

const taskComponentSchema = (t = i18next.t) => {
    const { FILTER: { SELECT_COLUMN, TASK_TYPE, TYPE_OF_TASK, FLOW_OR_DATALIST } } = GET_TASK_CONFIG_CONSTANT(t);
    // const allValidSelectedColumn = SELECT_COLUMN.OPTIONS.map((eachColumn) => eachColumn.value);
    // flow_uuids: Joi.when('type', {
    //     then: Joi.array().items(Joi.string()).label(FLOW_OR_DATALIST.LABEL)
    //          .required(),
    //     otherwise: Joi.forbidden(),
    // }),
    // data_list_uuids: Joi.when('type', {
    //     then: Joi.array().items(Joi.string()).label(FLOW_OR_DATALIST.LABEL)
    //           .required(),
    //     otherwise: Joi.forbidden(),
    // }),

   return Joi.object().keys({
        type: Joi.string().valid(...Object.values(BE_TASK_LIST_TYPE)).label(TASK_TYPE.LABEL).required(),
        type_of_task: Joi.string().valid(...Object.values(TYPE_OF_TASK_KEY)).label(TYPE_OF_TASK.LABEL).required(),
        choose_flow_or_data_list: Joi.when('type_of_task', {
            is: TYPE_OF_TASK_KEY.FLOW_OR_DATA_LIST,
            then: Joi.array().items(Joi.string()).label(FLOW_OR_DATALIST.LABEL).min(1)
                 .required()
                 .messages({
                    'array.min': `${FLOW_OR_DATALIST.LABEL} ${t('common_strings.is_required')}`,
                  }),
            otherwise: Joi.forbidden(),
        }),
        select_columns: Joi.array().items(Joi.string()).min(1).label(SELECT_COLUMN.LABEL)
                .required(),
    }).unknown();
};

export const saveCompValidationSchema = (t = i18next.t) => constructJoiObject({
    type: Joi.string().required(),
    label: Joi.when('type', {
        is: APP_COMP_STRINGS.LINK,
        then: Joi.string().label(t(APP_VALIDATION.LABEL)).max(50).required()
        .messages({
            'string.max': t(APP_VALIDATION.LABEL_MAX_ERROR_MESSAGE),
        })
        .allow(null, EMPTY_STRING),
        otherwise: Joi.when('type', {
            is: Joi.string().valid(
            APP_COMP_STRINGS.LINK, APP_COMP_STRINGS.DASHBOARDS, APP_COMP_STRINGS.TASK, APP_COMP_STRINGS.REPORTS, APP_COMP_STRINGS.WEBPAGE_EMBED),
            then: Joi.string().label(t(APP_VALIDATION.LABEL)).required().max(50)
            .messages({
                'string.max': t(APP_VALIDATION.LABEL_MAX_ERROR_MESSAGE),
            }),
            otherwise: Joi.forbidden(),
            }),
    }),
    component_info: Joi.when('type', [
        { is: APP_COMP_STRINGS.TEXT_EDITOR, then: textStylingComponentSchema(t) },
        { is: APP_COMP_STRINGS.LINK, then: linkCompSchema(t) },
        { is: APP_COMP_STRINGS.IMAGE, then: imageComponentSchema(t) },
        { is: APP_COMP_STRINGS.DASHBOARDS, then: dashboardComponentSchema(t) },
        { is: APP_COMP_STRINGS.TASK, then: taskComponentSchema(t) },
        { is: APP_COMP_STRINGS.REPORTS, then: reportComponentSchema(t) },
        { is: APP_COMP_STRINGS.WEBPAGE_EMBED, then: webpageEmbedComponentSchema(t) },
    ]),
    isEmbedUrlVerified: Joi.boolean()
    .valid(true)
    .when('type', {
        is: APP_COMP_STRINGS.WEBPAGE_EMBED,
        then: Joi.boolean()
            .valid(true)
            .required(),
        otherwise: Joi.boolean()
            .forbidden(),
    }),
}).unknown();

export const getPostDataForTaskComponent = (component_data = {}) => {
    const clonedComponent = cloneDeep(component_data);
    const clonedComponentInfo = cloneDeep(component_data?.component_info);
    delete clonedComponentInfo?.read_preference_data;
    if (clonedComponentInfo?.type_of_task === TYPE_OF_TASK_KEY.FLOW_OR_DATA_LIST) {
        if (
            isEmpty(get(clonedComponentInfo, [TASK_COMPONENT_CONFIG_KEYS.FLOW_UUIDS], null))
            ) {
            unset(clonedComponentInfo, [TASK_COMPONENT_CONFIG_KEYS.FLOW_UUIDS]);
           }
        if (
            isEmpty(get(clonedComponentInfo, [TASK_COMPONENT_CONFIG_KEYS.DATA_LISTS_UUIDS], null))
            ) {
            unset(clonedComponentInfo, [TASK_COMPONENT_CONFIG_KEYS.DATA_LISTS_UUIDS]);
           }
    }

    clonedComponent.component_info = clonedComponentInfo;
    return clonedComponent;
};

export const constructValidationDataForTask = (label, component_info) => {
    const clonedComponentInfo = cloneDeep(component_info);
    delete clonedComponentInfo?.read_preference_data;
    if (component_info?.type_of_task === TYPE_OF_TASK_KEY.FLOW_OR_DATA_LIST) {
            const uuids = [
                ...(get(clonedComponentInfo, [TASK_COMPONENT_CONFIG_KEYS.FLOW_UUIDS], []) || []),
                ...(get(clonedComponentInfo, [TASK_COMPONENT_CONFIG_KEYS.DATA_LISTS_UUIDS], []) || []),
            ];
            unset(clonedComponentInfo, [TASK_COMPONENT_CONFIG_KEYS.FLOW_UUIDS]);
            unset(clonedComponentInfo, [TASK_COMPONENT_CONFIG_KEYS.DATA_LISTS_UUIDS]);
            clonedComponentInfo.choose_flow_or_data_list = uuids;
    }
      return { label, type: APP_COMP_STRINGS.TASK, component_info: clonedComponentInfo };
  };

export const getCompValidateConfigurationData = (configData) => {
    const localData = jsUtility.cloneDeep(configData);
    // let component_info;
    if (configData.type === APP_COMP_STRINGS.TASK) {
        return constructValidationDataForTask(localData?.label, localData?.component_info);
    }

    return configData;
    // return { type: localData.type, label: localData.label, ...component_info };
};

export const appPageSchema = (t = translateFunction) => (
    Joi.object().keys({
        name: APP_NAME_VALIDATION.label(t(APP_VALIDATION.PAGE_NAME)).required(),
        url_path: Joi.string().regex(PATHNAME_URL_REGEX).max(APP_MIN_MAX_CONSTRAINT.PAGE_URL_MAX_VALUE)
        .messages({ 'string.max': t(APP_VALIDATION.PAGE_URL_LIMIT) })
        .required()
        .label(t(APP_VALIDATION.PAGE_URL)),
        isInherit: Joi.optional(),
        viewers: Joi.when('isInherit', {
            is: false,
            then: Joi.object().keys({
              teams: Joi.array().items().min(1).messages({ 'array.min': t(APP_VALIDATION.PAGE_VIEWERS_REQUIRED) }),
            }).required()
            .min(1),
            otherwise: Joi.forbidden(),
        }),
    })
);

export const getPageSettingsValidationData = (pageData) => {
    const { name, url_path, inheritFromApp, viewers } = cloneDeep(pageData);
    const validateData = {
        name,
        url_path,
        isInherit: inheritFromApp,
    };
    if (!inheritFromApp) {
        validateData.viewers = { teams: viewers?.teams };
    }
    return validateData;
};
