export const POLICY_TYPE = {
    CONDIITON_BASED: 'condition',
    USER_FIELD_BASED: 'user_field',
};

export const convertOperatorstoReadable = (key) => {
    const words = key.split('_').map((word) => word.charAt(0).toUpperCase() + word.slice(1));
    const readableKey = words.join(' ');
    return readableKey;
};
