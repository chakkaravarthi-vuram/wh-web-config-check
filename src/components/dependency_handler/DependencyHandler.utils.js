import {
  DEPENDENCY_ERRORS,
} from './DependencyHandler.constants';
import {
  DEPENDENCY_ERROR_TYPE_LABELS,
} from './DependencyHandler.strings';

export const dependencyListName = (dependencyType, t, dependencies, mainDependencyType, dependencyStepName, mainDependencyRuleType) => {
  console.log('dependencyTypeee', dependencyType);
  console.log('dependencies', dependencies, dependencyType);
  console.log('step_type', dependencies?.step_type);
  console.log('mainDependencyType', mainDependencyType, mainDependencyRuleType);

  let dependencyString = [];
  const index = dependencies?.index;
  if (mainDependencyType && mainDependencyType === DEPENDENCY_ERRORS.FLOW) {
    if (dependencyType === DEPENDENCY_ERRORS.FLOW_TYPE.TRIGGER_DEPENDENCY) {
      return DEPENDENCY_ERROR_TYPE_LABELS(t).CALL_ANOTHER_FLOW_OR_SHORTCUT_MAPPING;
    } else if (dependencyType === DEPENDENCY_ERRORS.FLOW_TYPE.OWNERS) {
      return DEPENDENCY_ERROR_TYPE_LABELS(t).FLOW_OWNERS;
    } else if (dependencyType === DEPENDENCY_ERRORS.FLOW_TYPE.VIEWERS) {
      return DEPENDENCY_ERROR_TYPE_LABELS(t).FLOW_VIEWERS;
    } else if (dependencyType === DEPENDENCY_ERRORS.FLOW_TYPE.STEP_DEPENDENCY) {
      const dependencyString = [];
      dependencyString.push(dependencyStepName);
      if (dependencies?.email_uuid) {
        dependencyString.push(`${DEPENDENCY_ERROR_TYPE_LABELS(t).EMAIL_CONFIGURATION} - ${index + 1}`);
      } else if (dependencies?.escalation_uuid) {
        dependencyString.push(`${DEPENDENCY_ERROR_TYPE_LABELS(t).ESCALATION_CONFIGURATION} - ${index + 1}`);
      } else if (dependencies?.type === DEPENDENCY_ERRORS.FLOW_TYPE.STEP_ASSIGNEE) {
        dependencyString.push(`${DEPENDENCY_ERROR_TYPE_LABELS(t).STEP_ACTOR_CONFIGURATION}`);
      }
      return dependencyString.join(' > ');
    } else {
      return DEPENDENCY_ERROR_TYPE_LABELS(t).FLOW_DEPENDENCY;
    }
  } else if (mainDependencyType && mainDependencyType === DEPENDENCY_ERRORS.DATALIST) {
    if (dependencyType === DEPENDENCY_ERRORS.DATALIST_TYPE.VIEWERS) {
      return DEPENDENCY_ERROR_TYPE_LABELS(t).DATA_LIST_VIEWERS;
    } else if (dependencyType === DEPENDENCY_ERRORS.DATALIST_TYPE.ENTRY_ADDERS) {
      return DEPENDENCY_ERROR_TYPE_LABELS(t).DATA_LIST_ENTRY_ADDERS;
    } else if (dependencyType === DEPENDENCY_ERRORS.DATALIST_TYPE.TRIGGER_DEPENDENCY) {
      return DEPENDENCY_ERROR_TYPE_LABELS(t).CALL_ANOTHER_FLOW_OR_SHORTCUT_MAPPING;
    }
    return DEPENDENCY_ERROR_TYPE_LABELS(t).DATALIST_DEPENDENCY;
  } else if (mainDependencyType && mainDependencyType === DEPENDENCY_ERRORS.API_CONFIGURATION) {
    if (dependencyType === DEPENDENCY_ERRORS.API_CONFIGURATION_TYPE.ADMINS) {
      return (`${DEPENDENCY_ERROR_TYPE_LABELS(t).WORKHALL_API} > ${DEPENDENCY_ERROR_TYPE_LABELS(t).ADMINS}`);
    }
    return DEPENDENCY_ERROR_TYPE_LABELS(t).API_CONFIGURATION_DEPENDENCY;
  } else if (mainDependencyType && mainDependencyType === DEPENDENCY_ERRORS.CONNECTOR) {
    if (dependencyType === DEPENDENCY_ERRORS.CONNECTOR_TYPE.ADMINS) {
      return (`${DEPENDENCY_ERROR_TYPE_LABELS(t).EXTERNAL_API} > ${DEPENDENCY_ERROR_TYPE_LABELS(t).ADMINS}`);
    }
    return DEPENDENCY_ERROR_TYPE_LABELS(t).CONNECTOR_DEPENDENCY;
  } else if (mainDependencyType && mainDependencyType === DEPENDENCY_ERRORS.RULE_DATA_LIST_QUERY) {
    return `${dependencies?.field_name} > ${DEPENDENCY_ERROR_TYPE_LABELS(t).EXTERNAL_SOURCE_VALUE_CONFIG}`;
  } else if (mainDependencyType && mainDependencyType === DEPENDENCY_ERRORS.RULE_FORM_INTEGRATION) {
    return `${dependencies?.field_name} > ${DEPENDENCY_ERROR_TYPE_LABELS(t).EXTERNAL_SOURCE_VALUE_CONFIG}`;
  } else if (mainDependencyType && mainDependencyType === DEPENDENCY_ERRORS.FIELD_DEPENDENCY_TYPE.RULE_DEPENDENCY) {
    if (dependencyType === DEPENDENCY_ERRORS.STEP_DEPENDENCY) {
      if (dependencies?.type === DEPENDENCY_ERRORS.FIELD_DEPENDENCY_TYPE.RULE_DEPENDENCY_TYPE.RULE_STEP_ACTION_NEXT_STEP) {
        if (dependencyStepName) dependencyString.push(dependencyStepName);
        dependencyString.push(DEPENDENCY_ERROR_TYPE_LABELS(t).ACTION_DEPENDENCY);
        dependencyString.push(dependencies?.action_name);
        dependencyString.push(DEPENDENCY_ERROR_TYPE_LABELS(t).CONDITIONAL_CONFIGURATION);
        return dependencyString.join(' > ');
      } else if (dependencies?.type === DEPENDENCY_ERRORS.FIELD_DEPENDENCY_TYPE.RULE_DEPENDENCY_TYPE.ACTION_DEPENDENCY) {
        if (dependencyStepName) dependencyString.push(dependencyStepName);
        dependencyString.push(DEPENDENCY_ERROR_TYPE_LABELS(t).ACTION_DEPENDENCY);
        dependencyString.push(dependencies?.action_name);
        dependencyString.push(DEPENDENCY_ERROR_TYPE_LABELS(t).VISIBILITY);
        return dependencyString.join(' > ');
      } else if (dependencies?.type === DEPENDENCY_ERRORS.FIELD_DEPENDENCY_TYPE.RULE_DEPENDENCY_TYPE.ASSIGNEE_DEPENDENCY) {
        if (dependencyStepName) dependencyString.push(dependencyStepName);
        dependencyString.push(DEPENDENCY_ERROR_TYPE_LABELS(t).ASSIGNEE_CONDITIONS);
        return dependencyString.join(' > ');
      }
    } else if (dependencyType === DEPENDENCY_ERRORS.FIELD_DEPENDENCY) {
      if (dependencies?.step_name) dependencyString.push(dependencies?.step_name);
      if (dependencies?.section_name) dependencyString.push(dependencies?.section_name);
      dependencyString.push(dependencies?.field_name);
      if (mainDependencyRuleType) {
        switch (mainDependencyRuleType) {
          case DEPENDENCY_ERRORS.FIELD_DEPENDENCY_TYPE.RULE_DEPENDENCY_TYPE.DEFAULT_VALUE_RULE:
          case DEPENDENCY_ERRORS.FIELD_DEPENDENCY_TYPE.RULE_DEPENDENCY_TYPE.RULE_DATA_LIST_QUERY:
          case DEPENDENCY_ERRORS.FIELD_DEPENDENCY_TYPE.RULE_DEPENDENCY_TYPE.RULE_FORM_INTEGRATION:
          case DEPENDENCY_ERRORS.FIELD_DEPENDENCY_TYPE.RULE_DEPENDENCY_TYPE.RULE_EXTERNAL_DB_QUERY:
            dependencyString.push(DEPENDENCY_ERROR_TYPE_LABELS(t).DEFAULT_VALUE_RULE);
            break;
          case DEPENDENCY_ERRORS.FIELD_DEPENDENCY_TYPE.RULE_DEPENDENCY_TYPE.SHOW_WHEN_RULE:
            dependencyString.push(DEPENDENCY_ERROR_TYPE_LABELS(t).VISIBILITY);
            break;
          default:
            dependencyString.push(`${DEPENDENCY_ERROR_TYPE_LABELS(t).DEFAULT_VALUE_RULE} / ${DEPENDENCY_ERROR_TYPE_LABELS(t).VISIBILITY}`);
        }
      } else {
      dependencyString.push(`${DEPENDENCY_ERROR_TYPE_LABELS(t).DEFAULT_VALUE_RULE} / ${DEPENDENCY_ERROR_TYPE_LABELS(t).VISIBILITY}`);
      }
      return dependencyString.join(' > ');
    }
   } else {
    switch (dependencyType) {
      case DEPENDENCY_ERRORS.FIELD_DEPENDENCY_TYPE.INFORMATION_DEPENDENCY:
        return `${dependencies?.field_name} > ${DEPENDENCY_ERROR_TYPE_LABELS(t).INFORMATION_DEPENDENCY}`;
      case DEPENDENCY_ERRORS.FIELD_DEPENDENCY_TYPE.STEP_DEPENDENCY:
        if (dependencies?.step_name) {
          dependencyString = [dependencies?.step_name];

          switch (dependencies?.step_type) {
            case DEPENDENCY_ERRORS.FIELD_DEPENDENCY_TYPE.STEP_DEPENDENCY_TYPE.FLOW_TO_DATALIST_FIELD:
            case DEPENDENCY_ERRORS.FIELD_DEPENDENCY_TYPE.STEP_DEPENDENCY_TYPE.FLOW_TO_DATALIST_PICKER_FIELD:
              dependencyString.push(`${DEPENDENCY_ERROR_TYPE_LABELS(t).SEND_DATA_TO_DATA_LIST_CONFIGURATION} - ${index + 1}`);
              break;

            case DEPENDENCY_ERRORS.FIELD_DEPENDENCY_TYPE.STEP_DEPENDENCY_TYPE.FORM_FIELD_ASSIGNEE:
            case DEPENDENCY_ERRORS.FIELD_DEPENDENCY_TYPE.STEP_DEPENDENCY_TYPE.FORM_REPORTING_MANAGER_ASSIGNEE:
              dependencyString.push(
                DEPENDENCY_ERROR_TYPE_LABELS(t)
                  .STEP_ACTOR,
              );
              break;

            case DEPENDENCY_ERRORS.FIELD_DEPENDENCY_TYPE.STEP_DEPENDENCY_TYPE.SYSTEM_INTEGRATION:
              dependencyString.push(DEPENDENCY_ERROR_TYPE_LABELS(t).INTEGRATION);
              break;

            case DEPENDENCY_ERRORS.FIELD_DEPENDENCY_TYPE.STEP_DEPENDENCY_TYPE.FORM_REPORTING_MANAGER_RECIPIENT:
            case DEPENDENCY_ERRORS.FIELD_DEPENDENCY_TYPE.STEP_DEPENDENCY_TYPE.EMAIL_FORM_FIELD_RECIPIENT:
            case DEPENDENCY_ERRORS.FIELD_DEPENDENCY_TYPE.STEP_DEPENDENCY_TYPE.FORM_FIELD_RECIPIENT:
              dependencyString.push(`${DEPENDENCY_ERROR_TYPE_LABELS(t).EMAIL_CONFIGURATION} - ${index + 1}`);
              dependencyString.push(
                DEPENDENCY_ERROR_TYPE_LABELS(t).RECIPIENT);
              break;

            case DEPENDENCY_ERRORS.FIELD_DEPENDENCY_TYPE.STEP_DEPENDENCY_TYPE.ESCALATION_EMAIL_FORM_FIELD_RECIPIENT:
            case DEPENDENCY_ERRORS.FIELD_DEPENDENCY_TYPE.STEP_DEPENDENCY_TYPE.ESCALATION_FORM_FIELD_RECIPIENT:
            case DEPENDENCY_ERRORS.FIELD_DEPENDENCY_TYPE.STEP_DEPENDENCY_TYPE.ESCALATION_FORM_REPORTING_MANAGER_RECIPIENT:
              dependencyString.push(`${DEPENDENCY_ERROR_TYPE_LABELS(t).ESCALATION_CONFIGURATION} - ${index + 1}`);
              dependencyString.push(
                DEPENDENCY_ERROR_TYPE_LABELS(t).RECIPIENT);
              break;

            case DEPENDENCY_ERRORS.FIELD_DEPENDENCY_TYPE.STEP_DEPENDENCY_TYPE.EMAIL_BODY:
              dependencyString.push(`${DEPENDENCY_ERROR_TYPE_LABELS(t).EMAIL_CONFIGURATION} - ${index + 1}`);
              dependencyString.push(
                DEPENDENCY_ERROR_TYPE_LABELS(t)
                  .EMAIL_CONTENT,
              );
              break;

            case DEPENDENCY_ERRORS.FIELD_DEPENDENCY_TYPE.STEP_DEPENDENCY_TYPE.EMAIL_ATTACHMENTS:
              dependencyString.push(`${DEPENDENCY_ERROR_TYPE_LABELS(t).EMAIL_CONFIGURATION} - ${index + 1}`);
              dependencyString.push(
                DEPENDENCY_ERROR_TYPE_LABELS(t)
                  .ATTACHMENTS,
              );
              break;

            case DEPENDENCY_ERRORS.FIELD_DEPENDENCY_TYPE.STEP_DEPENDENCY_TYPE.DOCUMENT_GENERATION:
              dependencyString.push(`${DEPENDENCY_ERROR_TYPE_LABELS(t).DOCUMENT_GENERATION_CONFIGURATION} - ${index + 1}`);
              break;

            case DEPENDENCY_ERRORS.FIELD_DEPENDENCY_TYPE.STEP_DEPENDENCY_TYPE.ACTION_DEPENDENCY:
              dependencyString.push(`${dependencies?.action_name} > ${DEPENDENCY_ERROR_TYPE_LABELS(t).ACTION_DEPENDENCY}`);
              break;

            case DEPENDENCY_ERRORS.FIELD_DEPENDENCY_TYPE.STEP_DEPENDENCY_TYPE.FLOW_SUB_PROCESS_FIELD:
              dependencyString.push(DEPENDENCY_ERROR_TYPE_LABELS(t).CALL_ANOTHER_FLOW_OR_SHORTCUT_MAPPING);
              break;

            default:
              dependencyString.push(
                DEPENDENCY_ERROR_TYPE_LABELS(t).STEP_DEPENDENCY,
              );
          }
          return dependencyString.join(' > ');
        } else if (dependencies?.name) {
          return dependencies?.name;
        } else {
          return DEPENDENCY_ERROR_TYPE_LABELS(t).STEP_DEPENDENCY;
        }

      case DEPENDENCY_ERRORS.FIELD_DEPENDENCY_TYPE.STEP_DEPENDENCY_TYPE.EMAIL_DEPENDENCY:
        dependencyString.push(
          dependencies?.step_name,
        );
        dependencyString.push(DEPENDENCY_ERROR_TYPE_LABELS(t).EMAIL_CONFIGURATION);
        dependencyString.push(DEPENDENCY_ERROR_TYPE_LABELS(t).RECIPIENT);
        return dependencyString.join(' > ');

      case DEPENDENCY_ERRORS.FIELD_DEPENDENCY_TYPE.STEP_DEPENDENCY_TYPE.ESCALATION_DEPENDENCY:
        dependencyString.push(
          dependencies?.step_name,
        );
        dependencyString.push(DEPENDENCY_ERROR_TYPE_LABELS(t).ESCALATION_CONFIGURATION);
        dependencyString.push(DEPENDENCY_ERROR_TYPE_LABELS(t).RECIPIENT);
        return dependencyString.join(' > ');

      case DEPENDENCY_ERRORS.ACTION_DEPENDENCY:
        if (dependencies?.action_name) {
          if (dependencies?.rule_name) {
            return `${dependencies?.rule_name} > ${DEPENDENCY_ERROR_TYPE_LABELS(t).ACTION_DEPENDENCY} > ${dependencies?.action_name}`;
          } else if (dependencies?.email_uuid) {
            return `${dependencies?.action_name} > ${DEPENDENCY_ERROR_TYPE_LABELS(t).EMAIL_CONFIGURATION} - ${index + 1}`;
          } else if (dependencies?.mapping_uuid) {
            return `${dependencies?.action_name} > ${DEPENDENCY_ERROR_TYPE_LABELS(t).SEND_DATA_TO_DATA_LIST_CONFIGURATION} - ${index + 1}`;
          } else if (dependencies?.document_generation_uuid) {
            return `${dependencies?.action_name} > ${DEPENDENCY_ERROR_TYPE_LABELS(t).DOCUMENT_GENERATION_CONFIGURATION} - ${index + 1}`;
          } else {
            return `${dependencies?.action_name} > ${DEPENDENCY_ERROR_TYPE_LABELS(t).ACTION_DEPENDENCY}`;
          }
        } else {
          return DEPENDENCY_ERROR_TYPE_LABELS(t).ACTION_DEPENDENCY;
        }

      case DEPENDENCY_ERRORS.FIELD_DEPENDENCY_TYPE.VALIDATION_DEPENDENCY:
        dependencyString.push(dependencies?.field_name);
        dependencyString.push(
          DEPENDENCY_ERROR_TYPE_LABELS(t).VALIDATION_DEPENDENCY,
        );
        return dependencyString.join(' > ');

      case DEPENDENCY_ERRORS.FIELD_DEPENDENCY_TYPE.TRIGGER_DEPENDENCY:
        return DEPENDENCY_ERROR_TYPE_LABELS(t).CALL_ANOTHER_FLOW_OR_SHORTCUT_MAPPING;

      case DEPENDENCY_ERRORS.FIELD_DEPENDENCY_TYPE.PROPERTY_DEPENDENCY:
        dependencyString.push(dependencies?.field_name);
        dependencyString.push(
          DEPENDENCY_ERROR_TYPE_LABELS(t).PROPERTY_DEPENDENCY,
        );
        return dependencyString.join(' > ');

      case DEPENDENCY_ERRORS.FORM_DEPENDENCY:
        return DEPENDENCY_ERROR_TYPE_LABELS(t).FORM_DEPENDENCY;

      case DEPENDENCY_ERRORS.FIELD_DEPENDENCY_TYPE.RULE_DEPENDENCY:
        if (dependencies?.rule_type === DEPENDENCY_ERRORS.FIELD_DEPENDENCY_TYPE.RULE_DEPENDENCY_TYPE.RULE_STEP_ASSIGNEE) {
          if (dependencies?.step_name) {
            dependencyString.push(dependencies?.step_name);
            dependencyString.push(
              DEPENDENCY_ERROR_TYPE_LABELS(t).STEP_ACTOR_CONFIGURATION,
            );
            return dependencyString.join(' > ');
          } else if (dependencies?.reference_name) {
            dependencyString.push(dependencies?.reference_name);
            dependencyString.push(
              DEPENDENCY_ERROR_TYPE_LABELS(t).RULE_DEPENDENCY,
            );
            return dependencyString.join(' > ');
          } else if (dependencies?.table_name) {
            dependencyString.push(dependencies?.table_name);
            dependencyString.push(
              DEPENDENCY_ERROR_TYPE_LABELS(t).RULE_DEPENDENCY,
            );
            return dependencyString.join(' > ');
          } else {
            return DEPENDENCY_ERROR_TYPE_LABELS(t).RULE_DEPENDENCY;
          }
          } else if (dependencies?.rule_type === DEPENDENCY_ERRORS.FIELD_DEPENDENCY_TYPE.RULE_DEPENDENCY_TYPE.SHOW_WHEN_RULE) {
          dependencies?.section_name && dependencyString.push(dependencies?.section_name);
          dependencies?.reference_name && dependencyString.push(dependencies?.reference_name);
          dependencies?.rule_name && dependencyString.push(dependencies?.rule_name);
          dependencyString.push(dependencies?.section_name ? DEPENDENCY_ERROR_TYPE_LABELS(t).SHOW_WHEN_RULE : DEPENDENCY_ERROR_TYPE_LABELS(t).RULE_CONFIGURATION);
          return dependencyString.join(' > ');
        } else if (
          dependencies?.rule_type === DEPENDENCY_ERRORS.FIELD_DEPENDENCY_TYPE.RULE_DEPENDENCY_TYPE.DEFAULT_VALUE_RULE
        ) {
          dependencies?.section_name && dependencyString.push(dependencies?.section_name);
          dependencies?.reference_name && dependencyString.push(dependencies?.reference_name);
          dependencies?.rule_name && dependencyString.push(dependencies?.rule_name);
          dependencyString.push(
            DEPENDENCY_ERROR_TYPE_LABELS(t).DEFAULT_VALUE_RULE,
          );
          return dependencyString.join(' > ');
        } else if (dependencies?.rule_type ===
          DEPENDENCY_ERRORS.FIELD_DEPENDENCY_TYPE.RULE_DEPENDENCY_TYPE.RULE_LIST_SHOW_WHEN_CONDITION) {
          dependencyString.push(dependencies?.section_name);
          dependencyString.push(dependencies?.table_name);
          dependencyString.push(
            DEPENDENCY_ERROR_TYPE_LABELS(t).SHOW_WHEN_RULE,
          );
          return dependencyString.join(' > ');
        } else if (dependencies?.rule_type === DEPENDENCY_ERRORS.FIELD_DEPENDENCY_TYPE.RULE_DEPENDENCY_TYPE.RULE_STEP_EMAIL_RECIPIENT) {
          if (dependencies?.step_name) dependencyString.push(dependencies?.step_name);
          dependencyString.push(dependencies?.action_name);
          dependencyString.push(
            DEPENDENCY_ERROR_TYPE_LABELS(t).VISIBILITY_CONDITION);
          return dependencyString.join(' > ');
        } else if (dependencies?.rule_type === DEPENDENCY_ERRORS.FIELD_DEPENDENCY_TYPE.RULE_DEPENDENCY_TYPE.RULE_STEP_EMAIL_ACTION_CONDITION) {
          if (dependencies?.step_name) dependencyString.push(dependencies?.step_name);
          dependencyString.push(dependencies?.action_name);
          dependencyString.push(
            DEPENDENCY_ERROR_TYPE_LABELS(t).VISIBILITY_CONDITION);
          return dependencyString.join(' > ');
        } else if (
          (dependencies?.rule_type ===
            DEPENDENCY_ERRORS.FIELD_DEPENDENCY_TYPE.RULE_DEPENDENCY_TYPE.RULE_STEP_ACTION_CONDITION) ||
          (dependencies?.rule_type ===
            DEPENDENCY_ERRORS.FIELD_DEPENDENCY_TYPE.RULE_DEPENDENCY_TYPE.RULE_ACTION)
        ) {
          if (dependencies?.step_name) dependencyString.push(dependencies?.step_name);
          dependencyString.push(DEPENDENCY_ERROR_TYPE_LABELS(t).ACTION_DEPENDENCY);
          dependencyString.push(dependencies?.action_name);
          dependencyString.push(
            DEPENDENCY_ERROR_TYPE_LABELS(t).SHOW_WHEN_RULE,
          );
          return dependencyString.join(' > ');
        } else if (dependencies?.rule_type === DEPENDENCY_ERRORS.FIELD_DEPENDENCY_TYPE.RULE_DEPENDENCY_TYPE.RULE_STEP_ACTION_NEXT_STEP) {
          if (dependencies?.step_name) dependencyString.push(dependencies?.step_name);
          dependencyString.push(DEPENDENCY_ERROR_TYPE_LABELS(t).ACTION_DEPENDENCY);
          dependencyString.push(dependencies?.action_name);
          dependencyString.push(DEPENDENCY_ERROR_TYPE_LABELS(t).CONDITIONAL_CONFIGURATION);
          return dependencyString.join(' > ');
        } else if (dependencies?.rule_type === DEPENDENCY_ERRORS.FIELD_DEPENDENCY_TYPE.RULE_DEPENDENCY_TYPE.RULE_FORM_INTEGRATION) {
          dependencyString.push(DEPENDENCY_ERROR_TYPE_LABELS(t).DATA_FROM_ANOTHER_SOURCE_CONFIGURATION);
          dependencyString.push(dependencies?.rule_name ? dependencies?.rule_name : DEPENDENCY_ERROR_TYPE_LABELS(t).INTEGRATION);
          return dependencyString.join(' > ');
        } else if (dependencies?.rule_type === DEPENDENCY_ERRORS.RULE_DATA_LIST_QUERY) {
          dependencyString.push(DEPENDENCY_ERROR_TYPE_LABELS(t).DATA_FROM_ANOTHER_SOURCE_CONFIGURATION);
          dependencyString.push(dependencies?.rule_name ? dependencies?.rule_name : DEPENDENCY_ERROR_TYPE_LABELS(t).DATA_LISTS);
          return dependencyString.join(' > ');
        } else {
          return DEPENDENCY_ERROR_TYPE_LABELS(t).RULE_DEPENDENCY;
        }

      case DEPENDENCY_ERRORS.FIELD_DEPENDENCY_TYPE.TABLE_DEPENDENCY:
        dependencyString.push(dependencies?.table_name);
        dependencyString.push(DEPENDENCY_ERROR_TYPE_LABELS(t).TABLE_UNIQUE);
        return dependencyString.join(' > ');

      case DEPENDENCY_ERRORS.FORM_BUTTON_DEPENDENCY_EMAIL:
        if (dependencies?.index >= 0) {
          return `${DEPENDENCY_ERROR_TYPE_LABELS(t).EMAIL_CONFIGURATION} - ${dependencies.index + 1}`;
        }
        return DEPENDENCY_ERROR_TYPE_LABELS(t).EMAIL_CONFIGURATION;

      case DEPENDENCY_ERRORS.FORM_BUTTON_DEPENDENCY_DOCUMENT_GENERATION:
        if (dependencies?.index >= 0) {
          return `${DEPENDENCY_ERROR_TYPE_LABELS(t).DOCUMENT_GENERATION} - ${dependencies.index + 1}`;
        }
        return DEPENDENCY_ERROR_TYPE_LABELS(t).DOCUMENT_GENERATION;

      case DEPENDENCY_ERRORS.FORM_BUTTON_DEPENDENCY_DATA_TO_DATALIST:
        if (dependencies?.index >= 0) {
          return `${DEPENDENCY_ERROR_TYPE_LABELS(t).SEND_DATA_TO_DATA_LIST} - ${dependencies.index + 1}`;
        }
        return DEPENDENCY_ERROR_TYPE_LABELS(t).SEND_DATA_TO_DATA_LIST;

      case DEPENDENCY_ERRORS.ASSIGNEE_DEPENDENCY:
        if (dependencies?.step_name) {
          dependencyString.push(dependencies?.step_name);
          dependencyString.push(
            DEPENDENCY_ERROR_TYPE_LABELS(t)
              .STEP_ACTOR_CONFIGURATION,
          );
          return dependencyString.join(' > ');
        } else if (dependencies?.reference_name) {
          dependencyString.push(dependencies?.reference_name);
          dependencyString.push(DEPENDENCY_ERROR_TYPE_LABELS(t).RULE_DEPENDENCY);
          return dependencyString.join(' > ');
        } else if (dependencies?.table_name) {
          dependencyString.push(dependencies?.table_name);
          dependencyString.push(DEPENDENCY_ERROR_TYPE_LABELS(t).RULE_DEPENDENCY);
          return dependencyString.join(' > ');
        } else {
          return DEPENDENCY_ERROR_TYPE_LABELS(t).ASSIGNEE_DEPENDENCY;
        }

      case DEPENDENCY_ERRORS.DATALIST_MAPPING:
        return DEPENDENCY_ERROR_TYPE_LABELS(t).SEND_DATA_TO_DATA_LIST;

      case DEPENDENCY_ERRORS.DATA_LIST_PICKER:
        return DEPENDENCY_ERROR_TYPE_LABELS(t).DATA_LIST_DATA_SELECTOR;

      case DEPENDENCY_ERRORS.POLICY_FIELD_DEPENDENCY:
        return DEPENDENCY_ERROR_TYPE_LABELS(t).POLICY_FIELD_DEPENDENCY;

      case DEPENDENCY_ERRORS.FIELD_DEPENDENCY:
        if (dependencies) {
          dependencyString.push(dependencies?.field_name);
          if (mainDependencyType === DEPENDENCY_ERRORS.FIELD_DEPENDENCY_TYPE.RULE_DEPENDENCY_TYPE.SHOW_WHEN_RULE) {
            dependencyString.push(
              DEPENDENCY_ERROR_TYPE_LABELS(t).SHOW_WHEN_RULE,
            );
          } else if (mainDependencyType === DEPENDENCY_ERRORS.FIELD_DEPENDENCY_TYPE.RULE_DEPENDENCY_TYPE.DEFAULT_VALUE_RULE) {
            dependencyString.push(
              DEPENDENCY_ERROR_TYPE_LABELS(t).DEFAULT_VALUE_RULE,
            );
          }
          return dependencyString.join(' > ');
        } else return DEPENDENCY_ERROR_TYPE_LABELS(t).DEFAULT_VALUE_RULE;

      case DEPENDENCY_ERRORS.AUTOMATED_SYSTEM_ACTION_FIELD_CONDITION:
        return DEPENDENCY_ERROR_TYPE_LABELS(t).AUTOMATED_SYSTEM_ACTION;
      case DEPENDENCY_ERRORS.AUTOMATED_SYSTEM_ACTION_FIELD_TRIGGER:
        return DEPENDENCY_ERROR_TYPE_LABELS(t).AUTOMATED_SYSTEM_ACTION_TRIGGER_DEPENDENCY;
      case DEPENDENCY_ERRORS.FIELD_DEPENDENCY_TYPE.UNIQUE_FIELD_DEPENDENCY:
        return DEPENDENCY_ERROR_TYPE_LABELS(t).UNIQUE_FIELD_DEPENDENY;
      case DEPENDENCY_ERRORS.FIELD_DEPENDENCY_TYPE.DASHBOARD_COMPONENT_DEPENDENCY:
        return DEPENDENCY_ERROR_TYPE_LABELS(t).DASHBOARD_COMP_DEPENDENCY;
      default:
        return null;
    }
  }
  return null;
};

export const DEPENDENCY_DATA = {
  is_blocker: true,
  dependency_list: [
    {
      type: 'field_dependency',
      name: 's1',
      reference_name: 's1',
      field_type: 'singleline',
      field_uuid: '6cab161e-f1c1-4859-96a8-4523ee3b20ab',
      dependencies: [
        {
          type: 'rule_dependency',
          rule_type: 'rule_field_show_when_condition',
          field_id: '6540b65b9f8817ac11436c59',
          field_uuid: '3a89f30b-7931-437a-9ac5-f42b58e697d2',
          reference_name: 's2',
          section_name: 'Basic Details',
          section_order: 1,
          form_id: '6540b6469f8817ac11436c53',
          task_name: 't1',
          rule_id: '6540b65b9f8817ac11436c5a',
        },
        {
          type: 'rule_dependency',
          rule_type: 'rule_field_default_value_condition',
          field_id: '6540b67d9f8817ac11436c62',
          field_uuid: '24604583-1733-4860-bfd5-9dcdcf850fab',
          reference_name: 's3',
          section_name: 'Basic Details',
          section_order: 1,
          form_id: '6540b6469f8817ac11436c53',
          task_name: 't1',
          rule_id: '6540b67d9f8817ac11436c63',
        },
      ],
    },
  ],
};
