import jsUtility from '../../../../utils/jsUtility';
import { INDIVIDUAL_ENTRY_TAB_TYPES } from '../IndividualEntry.strings';
import INDIVIDUAL_ENTRY_TABS_STRINGS from './IndividualEntryTab.constants';

const getDefaultSystemPages = (isFlow = false, t = () => {}) => {
  const { PAGES } = INDIVIDUAL_ENTRY_TABS_STRINGS(t);
  const systemPages = [
    {
      label: PAGES.TASKS,
      value: INDIVIDUAL_ENTRY_TAB_TYPES.TASKS,
    },
    {
      label: isFlow ? PAGES.NOTES : PAGES.NOTES_REMAINDERS,
      value: INDIVIDUAL_ENTRY_TAB_TYPES.NOTES_REMAINDERS,
    },
    {
      label: PAGES.USER_SYSTEM_ACTION,
      value: INDIVIDUAL_ENTRY_TAB_TYPES.USER_ACTION,
    },
  ];
  if (isFlow) {
    systemPages.push({
      label: PAGES.EXECUTION_SUMMARY,
      value: INDIVIDUAL_ENTRY_TAB_TYPES.EXECUTION_SUMMARY,
    });
  } else {
    systemPages.push({
      label: PAGES.DATA_AUDIT,
      value: INDIVIDUAL_ENTRY_TAB_TYPES.DATA_AUDIT,
    });
  }
  return systemPages;
};

export const getFormattedSystemPages = (
  selectedSystemPages,
  pagesList,
  isFlow,
  t,
) => {
  const systemPages = jsUtility
    .cloneDeep(pagesList)
    .filter((page) => page.type !== INDIVIDUAL_ENTRY_TAB_TYPES.PAGE_BUILDER);

  const defaultSystemPages = getDefaultSystemPages(isFlow, t);
  const systemPageVisibleData = defaultSystemPages.map((page) => {
    const selectedPage = systemPages.find((data) => page.value === data.type);
    return {
      label: selectedPage?.labelText || page.label,
      value: page.value,
      selected: selectedSystemPages.includes(page.value),
    };
  });

  return systemPageVisibleData;
};
