import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { TableAlignOption, TableColumnWidthVariant, TableWithInfiniteScroll, TableScrollType, UserPicker, EPopperPlacements, Label, UTToolTipType } from '@workhall-pvt-lmt/wh-ui-library';
import { useTranslation } from 'react-i18next';
import cx from 'clsx';
import gClasses from 'scss/Typography.module.scss';
import { applicationDataChange } from 'redux/reducer/ApplicationReducer';
import { getAppDataApiThunk, getUsersAndTeamsApiThunk, getUsersApiThunk, updateAppSecurityApiThunk } from '../../../../redux/actions/Appplication.Action';
import { applicationDataClear } from '../../../../redux/reducer/ApplicationReducer';
import styles from './PageSecurity.module.scss';
import { PAGE_SECURITY_STRINGS } from './PageSecurity.strings';
import { cloneDeep, get, find, remove, isNull, isEmpty } from '../../../../utils/jsUtility';
import ThemeContext from '../../../../hoc/ThemeContext';
import { getFullName } from '../../../../utils/generatorUtils';
import { EMPTY_STRING } from '../../../../utils/strings/CommonStrings';

function PagesSecurity(props) {
    const { pages, activeAppData, applicationDataChange } = props;
    const { errorList } = cloneDeep(activeAppData);
    const { t } = useTranslation();
    const [searchText, setSearchText] = useState(EMPTY_STRING);
    const { colorScheme, colorSchemeDefault } = useContext(ThemeContext);
    const colorSchema = {
      activeColor: colorScheme?.buttonBg || colorSchemeDefault?.buttonBg,
      widgetBg: colorScheme?.widgetBg || colorSchemeDefault.widgetBg,
      highlight: colorScheme?.highlightBg || colorSchemeDefault?.highlightBg,
      appBg: colorScheme?.appBg || colorSchemeDefault?.appBg,
    };
    console.log('mapStateToPropsmapStateToProps', props, colorSchema);
    const getPageSecurityHeader = () => [
        {
            id: `${PAGE_SECURITY_STRINGS(t).PAGE_SECURITY}_0`,
            label: PAGE_SECURITY_STRINGS(t).HEADERS[0],
            widthWeight: 4,
            align: TableAlignOption.LEFT,
            isChangeIconColorOnHover: true,
        },
        {
            id: `${PAGE_SECURITY_STRINGS(t).PAGE_SECURITY}_1`,
            label: PAGE_SECURITY_STRINGS(t).HEADERS[1],
            widthWeight: 6,
            align: TableAlignOption.LEFT,
            isChangeIconColorOnHover: true,
        },
    ];

    const onChangePageViewer = (event, index, remainingUsers) => {
      const clonedActiveData = cloneDeep(activeAppData);
      const clonedPages = cloneDeep(activeAppData)?.pages || [];
      const clonedErrorList = cloneDeep(activeAppData)?.errorList || {};
      const clonedState = cloneDeep(clonedPages)?.[index];
      console.log('clonedStateclonedState', clonedState, activeAppData?.errorList, `page_security,${index},viewers`, clonedActiveData?.errorList?.[`page_security,${index},viewers`]);
      if (clonedState) {
      if (event?.target?.removeUserOrTeam) {
        const id = cloneDeep(event.target.value);
        if (clonedState?.viewers && clonedState?.viewers.teams) {
          if (find(clonedState?.viewers.teams, { _id: id })) {
            remove(clonedState?.viewers.teams, { _id: id });
            if (clonedState?.viewers.teams.length === 0) delete clonedState?.viewers.teams;
            if (clonedErrorList?.[`page_security,${index},viewers`]) delete clonedErrorList?.[`page_security,${index},viewers`];
          }
        }
        if (clonedState?.viewers && clonedState?.viewers.users) {
          if (find(clonedState?.viewers.users, { _id: id })) {
            remove(clonedState?.viewers?.users, { _id: id });
            if (clonedState?.viewers.users.length === 0) delete clonedState?.viewers.users;
            if (clonedErrorList?.[`page_security,${index},viewers`]) delete clonedErrorList?.[`page_security,${index},viewers`];
          }
        }
      } else {
        const team_or_user = (remainingUsers || []).find((eachUserOrTeam) =>
          (eachUserOrTeam?._id === event?.target?.option?._id));
          if (!clonedState?.viewers) clonedState.viewers = {};
          if (team_or_user?.username) {
            if (clonedState?.viewers?.users) {
              if (!find(clonedState?.viewers.users, { _id: team_or_user._id })) {
                clonedState?.viewers.users.push(team_or_user);
                if (clonedErrorList?.[`page_security,${index},viewers`]) delete clonedErrorList?.[`page_security,${index},viewers`];
              }
            } else {
              clonedState.viewers.users = [];
              clonedState?.viewers.users.push(team_or_user);
              if (clonedErrorList?.[`page_security,${index},viewers`]) delete clonedErrorList?.[`page_security,${index},viewers`];
            }
          } else if (clonedState?.viewers?.teams) {
              if (!find(clonedState?.viewers.teams, { _id: team_or_user._id })) {
                clonedState?.viewers.teams.push(team_or_user);
                if (clonedErrorList?.[`page_security,${index},viewers`]) delete clonedErrorList?.[`page_security,${index},viewers`];
              }
            } else {
              clonedState.viewers.teams = [];
              clonedState?.viewers.teams.push(team_or_user);
              if (clonedErrorList?.[`page_security,${index},viewers`]) delete clonedErrorList?.[`page_security,${index},viewers`];
            }
        }
        console.log('asdfasfasdfasdfsadfasfsf', clonedState);
        clonedPages[index] = cloneDeep(clonedState);
        applicationDataChange({ pages: clonedPages, errorList: clonedErrorList });
      }
    };

    const getPageSecurityRows = () => {
        const allRowsData = cloneDeep(pages)?.map((page, index) => {
            const remainingUsers = [];
            const appViewers = [...(get(activeAppData, ['viewers', 'users'], []) || []), ...(get(activeAppData, ['viewers', 'teams'], []) || [])];
            const pageViewerUsers = (!isNull(page?.viewers?.users) && !page?.viewers?.users?.every?.((user) => user === undefined))
            ? (get(page, ['viewers', 'users'], []) || []) : [];
            const pageViewerTeams = !isEmpty(page?.viewers?.teams) ? page?.viewers?.teams : (activeAppData?.viewers?.teams || []);
            const pageViewers = [...(pageViewerUsers),
            ...(pageViewerTeams)].map((viewer) => {
              const userOrTeamData = cloneDeep(viewer);
              if (userOrTeamData?.username) {
                userOrTeamData.label = getFullName(
                userOrTeamData.first_name,
                userOrTeamData.last_name,
                );
                userOrTeamData.type = UTToolTipType.user;
              } else {
                userOrTeamData.label = userOrTeamData?.team_name;
                userOrTeamData.type = UTToolTipType.team;
              }
              userOrTeamData.name = cloneDeep(userOrTeamData.label);
              userOrTeamData.id = cloneDeep(userOrTeamData._id);
              return userOrTeamData;
            });
            appViewers?.forEach((selectedUserOrTeam) => {
                if (!(pageViewers?.find((eachUser) => eachUser._id === selectedUserOrTeam._id)) &&
                (isEmpty(searchText) || (
                  !isEmpty(searchText) &&
                  ((selectedUserOrTeam?.label?.toLowerCase()?.includes(searchText?.toLowerCase()))
                  || selectedUserOrTeam?.username?.toLowerCase()?.includes(searchText?.toLowerCase())
                  || selectedUserOrTeam?.email?.toLowerCase()?.includes(searchText?.toLowerCase()))
                ))) {
                remainingUsers.push(selectedUserOrTeam);
                }
            });
            console.log('gsafgasgas', pageViewerTeams);
            return {
                id: `${index},row`,
                component: [
                    (
                        <div className={cx(gClasses.FTwo12BlackV20, gClasses.FontWeight500)} key={page.name}>
                            {page.name}
                        </div>
                    ),
                    (
                        <UserPicker
                            // colorScheme={colorSchema}
                            id={PAGE_SECURITY_STRINGS(t).ROWS.VIEWERS.ID}
                            selectedValue={pageViewers}
                            isLoading={false}
                            className={styles.PageViewers}
                            optionList={remainingUsers}
                            onSelect={(event, option) => {
                              const changeEvent = {
                                ...event,
                                target: {
                                  ...event?.target,
                                  option: option,
                                },
                              };
                              onChangePageViewer(changeEvent, index, remainingUsers);
                            }}
                            errorMessage={errorList[`page_security,${index},viewers`]}
                            onRemove={(removeUserOrTeamId) => {
                            console.log('onremovehandler final', removeUserOrTeamId);
                            const removeEvent = {
                                target: {
                                value: removeUserOrTeamId,
                                removeUserOrTeam: true,
                                },
                            };
                            onChangePageViewer(removeEvent, index);
                            }}
                            isSearchable
                            onSearch={(event) => setSearchText(event?.target?.value || EMPTY_STRING)}
                            searchText={searchText}
                            popperPosition={EPopperPlacements.AUTO}
                            maxCountLimit={2}
                            hideLabel
                            onPopperOutsideClick={() => setSearchText(EMPTY_STRING)}
                            noDataFoundMessage={PAGE_SECURITY_STRINGS(t).ROWS.VIEWERS.NO_DATA_FOUND}
                            disabled
                        />
                    ),
                ],
            };
        });
        return allRowsData;
    };

    return (
            <div id={PAGE_SECURITY_STRINGS(t).PAGE_SECURITY} className={cx(styles.TableContainer, gClasses.MT25)}>
              <Label labelName={PAGE_SECURITY_STRINGS(t).PAGE_SECURITY_LABEL} className={cx(gClasses.FTwo12BlackV20, gClasses.MB4)} />
                <TableWithInfiniteScroll
                    // colorScheme={colorSchema}
                    scrollableId="list_Draft_dl"
                    className={styles.OverFlowInherit}
                    tableClassName={styles.Table}
                    header={getPageSecurityHeader()}
                    data={getPageSecurityRows()}
                    isLoading={false}
                    scrollType={TableScrollType.BODY_SCROLL}
                    widthVariant={TableColumnWidthVariant.CUSTOM}
                />
            </div>
    );
}

const mapStateToProps = (state) => {
    return {
        pages: state.ApplicationReducer.activeAppData.pages,
        activeAppData: state.ApplicationReducer.activeAppData,
        usersAndTeamsData: state.ApplicationReducer.usersAndTeamsData,
        document_url_details: state.ApplicationReducer.document_url_details,
    };
};

PagesSecurity.propTypes = {
  applicationDataChange: PropTypes.func,
};

const mapDispatchToProps = (dispatch) => {
  return {
    applicationDataChange: (props) => {
      dispatch(applicationDataChange(props));
    },
    updateAppSecurity: (props, translateFunction) => {
      dispatch(updateAppSecurityApiThunk(props, translateFunction));
    },
    getAppDataApi: (props) => {
      dispatch(getAppDataApiThunk(props));
    },
    applicationDataClear: () => {
      dispatch(applicationDataClear());
    },
    getUsersApi: (props, setCancelToken) => {
      dispatch(getUsersApiThunk(props, setCancelToken));
    },
    getUsersAndTeamsApi: (props, setCancelToken) => {
      dispatch(getUsersAndTeamsApiThunk(props, setCancelToken));
    },
  };
};
export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(PagesSecurity);
