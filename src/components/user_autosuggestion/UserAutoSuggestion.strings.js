import { translate } from 'language/config';

export const USER_AUTO_SUGGESTION_STRINGS = {
  TYPES: { SUGGESTIONS: 'create_team_users.suggestions', PEOPLE: 'People', TEAM: 'Team' },
  NO_SUGGESTION_FOUND: 'create_team_users.no_suggestion_found',
  PLACEHOLDER: translate('admin_settings.user_management.user_auto_suggestion.placeholder'),
  ADD: translate('admin_settings.user_management.user_auto_suggestion.add'),
  CANCEL: translate('admin_settings.user_management.user_auto_suggestion.cancel'),
  USER_OR_TEAM: translate('create_team_users.user_or_team'),
  TEAMS_ONLY: translate('create_team_users.teams_only'),
  CREATE_USER: translate('create_team_users.create_user'),
  CREATE_TEAM: translate('create_team_users.create_team'),
  CHOOSE_LABEL: translate('create_team_users.choose_label'),
};

export default USER_AUTO_SUGGESTION_STRINGS;
