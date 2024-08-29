export const getSelectedLabels = (optionList, selectedValues) => {
    const selectedLabels = [];
    optionList.forEach((option) => {
        if (selectedValues?.includes(option.value)) {
            selectedLabels.push(option.label);
        }
    });
    return selectedLabels?.join(', ');
};
