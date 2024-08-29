import i18next from 'i18next';

// eslint-disable-next-line no-unused-vars
export const WEBPAGE_EMBED_STRINGS = (t = i18next.t) => {
  return {
    FIELD: {
        WEBPAGE_EMBED_URL: {
            ID: 'embedding_url',
            LABEL: 'Webpage Embed URL',
            PLACEHOLDER: 'Enter URL',
        },
        WEBPAGE_EMBED_LABEL: {
            ID: 'label',
            LABEL: 'Label',
            PLACEHOLDER: 'Enter Label',
        },
    },
    SHORT_CUT_STYLE: 'shortcut_style',
  };
};
