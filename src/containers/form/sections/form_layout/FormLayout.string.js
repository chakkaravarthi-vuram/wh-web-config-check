export const LAYOUT_CHANGE_ACTIONS = {
    LAYOUT_CHANGE: 'layout_change',
    DROP: 'drop',
    RESIZE: 'resize',
    WIDTH_CHANGE: 'width_change',
};

export const BREAKPOINTS = {
    lg: 640,
    md: 450,
    sm: 350,
};

export const COLUMN_LAYOUT = {
   TWO: 2,
   THREE: 3,
   FOUR: 4,
};

export const MAX_COLUMN_LAYOUT_LIMIT = COLUMN_LAYOUT.FOUR;

export const COLUMN_LAYOUT_SPEC = {
    [COLUMN_LAYOUT.TWO]: {
        lg: 2,
        md: 1,
        sm: 1,
    },
    [COLUMN_LAYOUT.THREE]: {
        lg: 3,
        md: 2,
        sm: 1,
    },
    [COLUMN_LAYOUT.FOUR]: {
        lg: 4,
        md: 3,
        sm: 2,
    },
};

export const FORM_FIELD_ROW_HEIGHT = 76;
export const FORM_FIELD_LAYOUT_MARGIN_GAP = [8, 8];

export const CURRENT_BREAKPOINT = 'lg';
export const COMPACT_TYPE = 'vertical';
export const NEW_DROP_ZONE_PLACEHOLDER = '__dropping-elem__';
