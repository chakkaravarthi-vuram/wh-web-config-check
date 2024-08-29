const NOTES_AND_REMAINDERS_STRINGS = (t = () => {}) => {
  return {
    NOTES: {
      TITLE: t('individual_entry.notes_remainders.notes.title'),
      BUTTON: t('individual_entry.notes_remainders.notes.button'),
      ADD_NOTES: {
        TITLE: t('individual_entry.notes_remainders.notes.addNotes.title'),
        NOTES: {
          ID: 'notes',
          LABEL: t(
            'individual_entry.notes_remainders.notes.addNotes.notes.label',
          ),
          PLACEHOLDER: t(
            'individual_entry.notes_remainders.notes.addNotes.notes.placeholder',
          ),
          DATALIST_NOTES: 'datalistNotes',
        },
        ATTACHMENTS: {
          ID: 'attachments',
          LABEL: t(
            'individual_entry.notes_remainders.notes.addNotes.attachments.label',
          ),
          PLACEHOLDER: t(
            'individual_entry.notes_remainders.notes.addNotes.attachments.placeholder',
          ),
        },
        BUTTONS: {
          ADD: t('common_strings.add'),
          CANCEL: t('common_strings.cancel'),
        },
      },
    },
    REMAINDERS: {
      TITLE: t('individual_entry.notes_remainders.reminders.title'),
      BUTTON: t('individual_entry.notes_remainders.reminders.button'),
      ADD_REMAINDERS: {
        TITLE: t(
          'individual_entry.notes_remainders.reminders.addReminders.title',
        ),
        DATALIST: 'Datalists',
        FLOW: t(
          'individual_entry.notes_remainders.reminders.addReminders.flow',
        ),
        RECORD: t(
          'individual_entry.notes_remainders.reminders.addReminders.record',
        ),
        REMINDER_USER_OR_TEAMS: {
          ID: 'reminder_user_or_teams',
          LABEL: t(
            'individual_entry.notes_remainders.reminders.addReminders.reminderUserOrTeams.label',
          ),
          PLACEHOLDER: t(
            'individual_entry.notes_remainders.reminders.addReminders.reminderUserOrTeams.placeholder',
          ),
        },
        REMINDER_DATE_AND_TIME: {
          ID: 'reminder_date_and_time',
          LABEL: t(
            'individual_entry.notes_remainders.reminders.addReminders.reminderDateAndTime',
          ),
        },
        REMINDER_MESSAGE: {
          ID: 'remainder_message',
          LABEL: t(
            'individual_entry.notes_remainders.reminders.addReminders.reminderMessage.label',
          ),
          PLACEHOLDER: t(
            'individual_entry.notes_remainders.reminders.addReminders.reminderMessage.placeholder',
          ),
        },
        BUTTONS: {
          ADD: t('common_strings.add'),
          CANCEL: t('common_strings.cancel'),
        },
      },
    },
  };
};

export default NOTES_AND_REMAINDERS_STRINGS;
