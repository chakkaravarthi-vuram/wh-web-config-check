export const ACCOUNT_AND_DOMAIN_NAME_REGEX = /^[A-Za-z0-9_ ]*$/;
export const DOMAIN_SPECIFIC_REGEX = /^[a-z0-9-]*$/;
export const DOMAIN_SPECIFIC_CASE_INSENSITIVE_REGEX = /^[A-Za-z0-9-]*$/;
export const FIRST_AND_LAST_NAME_REGEX = /^(?:\p{L}|\p{M}|\p{N}|_|\s)*$/u;
export const FLOW_REFERENCE_NAME_REGEX = RegExp([
  '^([a-zA-Z0-9_]+[a-zA-Z0-9]+)$',
]);

export const PASSWORD_REGEX = /^(?=.*[A-Za-z\s])(?=.*\d)(?=.*[~@#$^*()_+=[\]{}|\\,.?:\-<>'"/;`%!& ])[A-Za-z~@#$^*()_+=[\]{}|\\,.?:\-<>'"/;`%!&\d\s]{7,}$/;
export const USER_NAME_REGEX = /^(?=.{5,}$)[a-zA-Z0-9.+_@-]+(?![_.@-].*[_.@-])$/;
export const MOBILE_NUMBER_REGEX = /^(?!0)[0-9]{10}$/;
// export const EMAIL_REGEX = /^(([^<>()[\]\\.,;:\s@`"]+(\.[^<>()[\]\\.,;`:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
// export const EMAIL_REGEX = /^(([^<>()[\]\\.,;:\s@']+(\.[^<>()[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
export const EMAIL_REGEX = /^(([^<>()[\]\\.,;:\s@']+(\.[^<>()[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,3}))$/;
export const COMMA_SEPARATED_EMAIL_REGEX = /^(([^<>()[\]\\.,;:\s@']+(\.[^<>()[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,3}))+(?:,(([^<>()[\]\\.,;:\s@']+(\.[^<>()[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,3})))*$/;
export const EMOJI_REGEX = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff])[\ufe0e\ufe0f]?(?:[\u0300-\u036f\ufe20-\ufe23\u20d0-\u20f0]|\ud83c[\udffb-\udfff])?(?:\u200d(?:[^\ud800-\udfff]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff])[\ufe0e\ufe0f]?(?:[\u0300-\u036f\ufe20-\ufe23\u20d0-\u20f0]|\ud83c[\udffb-\udfff])?)*/;
export const NAME_REGEX = /^[a-zA-Z0-9\s_$#&()/.':,@"-]+$/;
export const FORM_NAME_REGEX = /^[A-Za-z0-9\r\n~@#$^*()_+=[\]{}|\\,.?: -<>'"/;`%]*$/;
export const FIELD_NAME_REGEX = /[a-zA-Z0-9].*[^\w\s]?/;
export const REFERENCE_NAME_REGEX = /^(?=.{1,}$)(?![_.@-])(?!.*[_.@-]{2})[a-zA-Z0-9._@-]+([^_.@-])$/;
// atleast 1 alphabet and 1 number required
export const NEW_PASSWORD_REGEX = /[^\w\d]*(([0-9]+.*[A-Za-z]+.*)|[A-Za-z]+.*([0-9]+.*))/;

// only alphabets, space, new line
export const ALLOWED_EXTENSIONS_REGEX = /^[A-Za-z\s]+$/;

export const CURRENT_NEW_PASSWORD = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z~@#$^*()_+=[\]{}|\\,.?: -<>'"/;`%\d\s]{8,}$/;

// only alphabets
export const ONLY_ALPHABETS_REGEX = /^[A-Za-z]+$/;

// only aplhabets and spaces
export const ONLY_ALPHABETS_SPACES_REGEX = /^[a-zA-Z ]*$/;

export const ALPHA_NUM_SPACES_REGEX = /^[A-Za-z0-9 ]*$/;

// Start With Only alphabets
export const START_WITH_ONLY_ALPHABETS_REGEX = /^[A-Za-z0-9]/i;

// atleast two or more words & only alphabets
export const FULL_NAME_REGEX = /^[a-z]([-']?[a-z]+)*( [a-z]([-']?[a-z]+)*)+$/;
// Same as backend
export const EMAIL_REGEX_BASIC = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
// Matches at least one alphabet and one digit
export const ALPHA_NUMERIC_REGEX = /^(?=.*[a-zA-Z])(?=.*[\d]).+/;

// Atleast one special characters
export const SPECIAL_CHARACTERS_REGEX = /(?=.*[~@#$^*()_+=[\]{}|\\,.?:\-<>'"/;`%!& ])/;

export const SHORT_CODE_REGEX = /^[!@#$%^&*()_+\-=\\[\]{};':"\\|,.<>\\/?]*$/;

export const NUMBER_REGEX = /[^0-9.-]/g;

export const DIGITS_REGEX = /[^\d]/g;

export const EXTRACT_RELATIVE_PATH_REGEX = /\/\{([^{}]+?)\}/g;
export const CURLY_BRACES_REGEX = /{{}}|^{{}|^{}}|{}}$|{}\/|{\/}|\/{}/;
export const RELATIVE_PATH_REGEX = /\/{[^{}]*{[^{}]*}[^{}]*}|{[^{}]*{[^{}]*}[^{}]*}$/;
export const URL_END_REGEX = /{[^{}]*{[^{}]*}$/;
export const URL_INCOMPLETE_REGEX = /{[^{}]*{/;
export const CURLY_BRACES_INCOMPLETE_REGEX = /{[^{}]*}{/;
export const CURLY_BRACES_URL_END_REGEX = /{[^{}]*}{[^{}]*}$/;

export const END_POINT_REGEX = /^[\w%]+$/;
export const URI_REGEX = /^((https?|ftp|smtp):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/;

export const LOOKUP_VALUE_NUMBER_REGEX = /^[-+]?[0-9]\d*(\.\d+)?$/;

export const MATCH_ALL_ALPHA_NUM = /[^a-zA-Z0-9 ]/g;

export const WORKHALL_API_END_POINT_REGEX = /^[a-zA-Z0-9_\-/]*$/;
export const PATHNAME_URL_REGEX = /^[a-z0-9-]*$/;

export const INTEGRATION_RESPONSE_BODY_LABEL = /^[a-zA-Z0-9\-_ ]*$/;

export const REMOVE_HTML_REGEX = /(<([^>]+)>)/gi;

export const REMOVE_NEW_LINE_REGEX = /(\n)/gi;

export const EMPTY_HTML_REGEX = /\r?<\/p>\n<p>/g;

export const TECHNICAL_REFERENCE_NAME_REGEX = RegExp([
    '^([a-zA-Z0-9_]+[a-zA-Z0-9]+)$',
  ]);
 export const validISORegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/;

export const NUMBERS_COMMA_MINUS_REGEX = /^[0-9,-]+$/;
export const NUMBERS_DOT_COMMA_MINUS_REGEX = /^[0-9.,-]+$/;

export const UUID_V4_REGEX = /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;

export const DYNAMIC_EMAIL_PREFIX_PATTERN = '!@#$';
export const DYNAMIC_EMAIL_SUFFIX_PATTERN = '$#@!';

export const DYNAMIC_EMAIL_REGEX_PATTERN = /!@#\$(.*?)\$#@!/g;

export const FILE_SUSPICICOUS_PATTERNS = {
  SCRIPT_TAGS: /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
  EVAL_FUNCTIONS: /eval\(/gi,
  FUNCTION_CONSTRUCTOR: /new Function\(/gi,
  IFRAME_TAGS: /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
  DOCUMENT_COOKIES: /document\.cookie/gi,
  WINDOW_LOCATION: /window\.location/gi,
  XML_HTTP_REQUEST: /XMLHttpRequest/gi,
};
