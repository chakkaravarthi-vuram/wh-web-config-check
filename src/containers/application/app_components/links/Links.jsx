import React, { useContext, useState } from 'react';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import cx from 'clsx';
import { Link, withRouter } from 'react-router-dom';
import { Button, EButtonType } from '@workhall-pvt-lmt/wh-ui-library';
import gClasses from 'scss/Typography.module.scss';
import { LINK_CONFIGURATION_STRINGS } from '../../app_configuration/link/page_configuration/LinkPageConfiguration.strings';
import styles from './Links.module.scss';
import { BS } from '../../../../utils/UIConstants';
import { EMPTY_STRING } from '../../../../utils/strings/CommonStrings';
import { replaceNullWithNA } from '../../../landing_page/my_tasks/task_content/TaskContent.utils';
import AddDataList from '../../../data_list/data_list_dashboard/add_data_list/AddDataList';
import { initiateFlowApi } from '../../../../redux/actions/FloatingActionMenuStartSection.Action';
import { FORM_POPOVER_STATUS, REDIRECTED_FROM } from '../../../../utils/Constants';
import ThemeContext from '../../../../hoc/ThemeContext';
import { getDatalistDetailsByUUIDActionThunk } from '../../../../redux/actions/ApplicationDashboardReport.Action';
import { showToastPopover } from '../../../../utils/UtilityFunctions';

function Links(props) {
    const { componentDetails = {}, initiateFlow, history, dispatch, currentPageName } = props;
    const { alignment = 'left' } = componentDetails || {};
    const { links = [], shortcut_style = EMPTY_STRING } = (componentDetails?.component_info) || {};
    const { t } = useTranslation();
    const [, setAppRoute] = useState(history?.location?.pathname);
    const [addDLEntry, setAddDLEntry] = useState(false);
    const [datalistUuid, setDatalistUuid] = useState(false);
    const [hover, setHover] = useState(false);

    const { colorScheme } = useContext(ThemeContext);

    const getAlignmentClass = (alignment) => {
        if (alignment === 'center') return cx(BS.D_FLEX, BS.JC_CENTER);
        else if (alignment === 'right') return cx(BS.D_FLEX, BS.JC_END);
        else return cx(BS.D_FLEX, BS.JC_START);
    };

    const onClickLink = (linkInfo) => {
        if (linkInfo?.type === LINK_CONFIGURATION_STRINGS(t).LINKS.LINK_TYPES.OPTION_LIST[0].value) {
            window.open(linkInfo?.url, '_blank');
        } else if (linkInfo?.type === LINK_CONFIGURATION_STRINGS(t).LINKS.LINK_TYPES.OPTION_LIST[1].value) {
                setAppRoute(history?.location?.pathname);
                const postData = {
                    flow_uuid: linkInfo?.source_uuid,
                    is_test_bed: 0,
              };
              initiateFlow(postData, history, REDIRECTED_FROM.APP, {
                sourceName: currentPageName,
              }, history?.location.pathname);
        } else if (linkInfo?.type === LINK_CONFIGURATION_STRINGS(t).LINKS.LINK_TYPES.OPTION_LIST[2].value) {
          dispatch(getDatalistDetailsByUUIDActionThunk(linkInfo?.source_uuid, true))
          .then((res) => {
            if (res) {
                setDatalistUuid(linkInfo?.source_uuid);
                setAddDLEntry(true);
            } else {
                showToastPopover(
                    LINK_CONFIGURATION_STRINGS(t).LINKS.LINK_TYPES.OPTION_LIST[2].NO_ACCESS_ERROR.TITLE,
                    LINK_CONFIGURATION_STRINGS(t).LINKS.LINK_TYPES.OPTION_LIST[2].NO_ACCESS_ERROR.SUBTITLE,
                    FORM_POPOVER_STATUS.SERVER_ERROR,
                    true,
                );
            }
          }).catch((err) => {
            console.log('get data list details error', err);
          });
        }
    };

    const linksComponent = links?.map((eachLink, index) => {
        if (shortcut_style === LINK_CONFIGURATION_STRINGS(t).SHORTCUT_STYLE.OPTION_LIST[0].value) {
            return (
                <div className={cx({ [gClasses.MT10]: index === 0, [gClasses.MB15]: index !== links.length - 1 })} key={eachLink?.url}>
                    <div
                        className={cx(getAlignmentClass(alignment), styles.Ellipsis)}
                        onMouseOver={() => setHover(true)}
                        onMouseOut={() => setHover(false)}
                        onFocus={() => setHover(true)}
                        onBlur={() => setHover(false)}
                    >
                        <Link
                            to={(eachLink?.url || EMPTY_STRING)}
                            target="_blank"
                            className={cx(gClasses.FTwo13BlackV12, gClasses.Ellipsis, styles.LinkStyle)}
                            onClick={(event) => {
                                event.preventDefault();
                                onClickLink(eachLink);
                            }}
                        >
                            {replaceNullWithNA(eachLink?.name)}
                        </Link>
                    </div>
                </div>
            );
        } else {
            const isPrimaryButton = (
                shortcut_style === LINK_CONFIGURATION_STRINGS(t).SHORTCUT_STYLE.OPTION_LIST[1].value
            );

            const isSecondaryButton = (
                shortcut_style === LINK_CONFIGURATION_STRINGS(t).SHORTCUT_STYLE.OPTION_LIST[2].value
            );

            return (
                <div
                    className={getAlignmentClass(alignment)}
                    key={eachLink?.name}
                    onMouseOver={() => setHover(true)}
                    onMouseOut={() => setHover(false)}
                    onFocus={() => setHover(true)}
                    onBlur={() => setHover(false)}
                >
                    <Button
                        buttonText={eachLink?.name}
                        type={isPrimaryButton ? EButtonType.PRIMARY : EButtonType.SECONDARY}
                        onClickHandler={() => onClickLink(eachLink)}
                        className={cx(
                            gClasses.FTwo13BlackV12,
                            { [gClasses.MT10]: index === 0, [gClasses.MB15]: index !== links.length - 1 },
                            styles.LinkStyle,
                            !isPrimaryButton && styles.OutlineButton,
                            )}
                        colorSchema={{
                            ...colorScheme,
                            activeColor: (hover && isSecondaryButton) ? `${colorScheme?.activeColor}90` : colorScheme?.activeColor,
                        }}
                    />
                </div>
            );
        }
    });

    return (
    <div>
        {linksComponent}
        {addDLEntry && datalistUuid &&
            <AddDataList
                isModalOpen={addDLEntry}
                refreshTable={null}
                onCloseClick={() => {
                    setAddDLEntry(false);
                    setDatalistUuid(null);
                }}
                dataListUuid={datalistUuid}
                dataListEntryId={null}
                isAddView
            />
        }
    </div>
    );
}

  const mapDispatchToProps = (dispatch) => {
    return {
      initiateFlow: (data, history, redirectedFrom, urlData, pathname) => {
        dispatch(initiateFlowApi(data, history, redirectedFrom, urlData, pathname));
      },
      dispatch,
    };
  };

  export default withRouter(
    connect(null, mapDispatchToProps)(Links),
  );
