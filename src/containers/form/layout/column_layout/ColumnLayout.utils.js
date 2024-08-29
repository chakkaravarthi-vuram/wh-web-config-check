import { FORM_LAYOUT_TYPE } from '../../Form.string';

export const SECTION_CONTAINER_ID = 'sectionContainer';

const getAllColumnBreakpoints = (path, cols = 4) => {
    let containerId = SECTION_CONTAINER_ID;
    if (path.includes(FORM_LAYOUT_TYPE.BOX)) {
        // 0_container,1_column,0_box,0_container
        const lastCommaIndex = path.lastIndexOf(FORM_LAYOUT_TYPE.BOX);
        containerId = path.substr(0, lastCommaIndex + 3);
    }
    const refData = document.getElementById(containerId);
    const columnBreakpoints = [];
    if (refData) {
        const columnWidth = (refData.clientWidth - 32) / cols;
        let i = 1;
        while (i <= cols) {
            const columnWidthData = (i === cols) ? (columnWidth * i) : (columnWidth * i) - 8;
            columnBreakpoints.push(columnWidthData);
            i++;
        }
    }
    return { columnBreakpoints, containerWidth: refData?.clientWidth || 0 };
};

export {
    getAllColumnBreakpoints,
};
