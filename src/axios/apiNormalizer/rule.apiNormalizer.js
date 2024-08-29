import { hasOwn, reportError } from '../../utils/UtilityFunctions';
import { validatePagination } from './common.apiNormalizer';

const validateSaveRule = (content) => {
   const requiredProps = ['_id', 'rule'];
   requiredProps.forEach((prop) => {
     if (!hasOwn(content, prop)) {
       reportError(`validate SaveRule failed: ${prop} missing`);
       return null;
     }
     return prop;
   });

   return content;
 };

 const validateRuleDetailsById = (content) => {
   const requiredProps = ['rule_details'];
   requiredProps.forEach((prop) => {
     if (!hasOwn(content, prop)) {
       reportError(`validate RuleDetailsById failed: ${prop} missing`);
       return null;
     }
     return prop;
   });

   return content;
 };

export const normalizeGetRules = (untrustedContent) => {
   const trustedPagination = validatePagination(untrustedContent.data.result.data);
   if (!trustedPagination) {
    reportError('normalize getRules failed');
    return null;
   }
   return trustedPagination;
};

export const normalizeSaveRule = (untrustedContent) => {
   const validateData = validateSaveRule(untrustedContent);
   if (!validateData) {
     reportError('normalize SaveRule failed');
     return null;
   }
   return validateData;
 };

export const normalizeRuleDetailsById = (untrustedContent) => {
   const validateData = validateRuleDetailsById(untrustedContent);
   if (!validateData) {
     reportError('normalize RuleDetailsById failed');
     return null;
   }
   return validateData;
};
