import { reportError, hasOwn } from '../../utils/UtilityFunctions';
import jsUtils from '../../utils/jsUtility';

const validatePublishTask = (content) => {
  const requiredProps = ['success'];
  requiredProps.forEach((prop) => {
    if (!hasOwn(content, prop)) {
      reportError(`validate PublishTask failed: ${prop} missing`);
      return null;
    }
    return prop;
  });
  return content;
};

const validateDeleteForm = (content) => {
  const requiredProps = ['success'];
  requiredProps.forEach((prop) => {
    if (!hasOwn(content, prop)) {
      reportError(`validate Delete form failed: ${prop} missing`);
      return null;
    }
    return prop;
  });
  return content;
};

const validateTaskAssigneeSuggestion = (content) => {
  const requiredProps = ['user_or_team_ids'];
  requiredProps.forEach((prop) => {
    if (!hasOwn(content, prop)) {
      reportError(`validate task assignee suggestion failed: ${prop} missing`);
      return null;
    }
    return prop;
  });
  return content;
};

const validateSaveTask = (content) => {
  const requiredProps = [
    '_id',
    'account_id',
    'task_metadata_uuid',
    'status',
    'task_name',
    // 'task_description',
  ];
  requiredProps.forEach((prop) => {
    if (!hasOwn(content, prop)) {
      reportError(`validate SaveTask failed: ${prop} missing`);
      return null;
    }
    return prop;
  });
  return content;
};

const validateSaveForm = (content) => {
  const requiredProps = ['_id', 'account_id', 'form_uuid', 'form_title', 'form_description'];
  requiredProps.forEach((prop) => {
    if (!hasOwn(content, prop)) {
      reportError(`validate SaveForm failed: ${prop} missing`);
      return null;
    }
    return prop;
  });
  return content;
};

export const normalizePublishTask = (untrustedContent) => {
  const content = validatePublishTask(untrustedContent.data);

  if (!content) {
    reportError('normalizePublishTask failed');
    return null;
  }

  return content;
};

export const normalizeDeleteForm = (untrustedContent) => {
  const content = validateDeleteForm(untrustedContent.data);

  if (!content) {
    reportError('normalizePublishTask failed');
    return null;
  }

  return content;
};

export const normalizeTaskAssigneeSuggestion = (untrustedContent) => {
  const content = validateTaskAssigneeSuggestion(untrustedContent.data.result.data);
  if (!content) {
    reportError('normalize task assignee suggestion failed');
    return null;
  }
  return content;
};

export const normalizeSaveTask = (untrustedContent) => {
  const content = validateSaveTask(untrustedContent.data.result.data);

  if (!content) {
    reportError('normalizeSaveTask failed');
    return null;
  }

  return content;
};

export const normalizeDeleteTask = (untrustedContent) => {
  const content = jsUtils.get(untrustedContent, 'data.success');

  if (!content) {
    reportError('normalizeSaveTask failed');
    return null;
  }

  return content;
};

export const normalizeSaveForm = (untrustedContent) => {
  const content = validateSaveForm(untrustedContent.data.result.data);

  if (!content) {
    reportError('normalizeSaveForm failed');
    return null;
  }

  return content;
};

export default normalizePublishTask;
