import { has, isEmpty } from 'utils/jsUtility';
import { EMPTY_STRING } from 'utils/strings/CommonStrings';

export const getCategorisedEvents = (events = [], searchText = EMPTY_STRING) => {
    const categorisedEvents = [];
    const categories = {};
    events.forEach((eachEvent) => {
        if (has(eachEvent, ['category']) && eachEvent.category) {
            if (!(eachEvent.category in categories)) {
                categories[eachEvent.category] = [];
                if (isEmpty(searchText) || eachEvent?.name?.toLowerCase()?.includes(searchText.toLowerCase())) {
                  categories[eachEvent.category].push(eachEvent);
                }
                } else {
                  if (isEmpty(searchText) || eachEvent?.name?.toLowerCase()?.includes(searchText.toLowerCase())) {
                    categories[eachEvent.category].push(eachEvent);
                  }
                  }
        }
    });
    Object.keys(categories).forEach((eachCategory) => {
        console.log('groupedTriggerFields', categories[eachCategory]);
        if (!isEmpty(categories[eachCategory])) {
          categorisedEvents.push({
            label: eachCategory,
            value: eachCategory,
            name: eachCategory,
            optionType: 'Title',
            disabled: true,
          });
          categorisedEvents.push(...categories[eachCategory]);
        }
      });
      if (isEmpty(categorisedEvents)) {
        categorisedEvents.push({
          label: 'No Events Found',
          value: 'No Events Found',
          name: 'No Events Found',
          optionType: 'Title',
          disabled: true,
        });
      }
    return categorisedEvents;
};

export const constructParamsFromEvent = (event = {}) => {
  const eventParams = [];
   if (!isEmpty(event) && !isEmpty(event.params)) {
      event.params.forEach((param) => {
        eventParams.push({
          key_name: param.key,
          value: EMPTY_STRING,
          key: param.key_uuid,
          isRequired: param.is_required,
          test_value: EMPTY_STRING,
       });
      });
   }
   return eventParams;
};
