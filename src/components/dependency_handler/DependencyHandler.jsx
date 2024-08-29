import React, { useContext } from 'react';
import {
  Avatar,
  AvatarBorderRadiusVariant,
  AvatarSizeVariant,
  Button,
  Modal,
  EButtonType,
  Text,
  ETextSize,
  ModalStyleType,
  DialogSize,
} from '@workhall-pvt-lmt/wh-ui-library';
import cx from 'classnames/bind';
import { SyncLoader } from 'react-spinners';
import { useTranslation } from 'react-i18next';
import DependencyAlertIcon from '../../assets/icons/teams/DependencyAlertIcon';
import { DEPENDENCY_ERROR_TYPE_LABELS, DEPENDENCY_HANDLER_STRINGS } from './DependencyHandler.strings';
import { UTIL_COLOR } from '../../utils/Constants';
import { MODAL_ATTRIBUTES } from './DependencyHandler.constants';
import { BS, COLOUR_CODES } from '../../utils/UIConstants';
import gClasses from '../../scss/Typography.module.scss';
import styles from './DependencyHandler.module.scss';
import { dependencyListName } from './DependencyHandler.utils';
import jsUtility from '../../utils/jsUtility';
import ThemeContext from '../../hoc/ThemeContext';
import AlertCircle from '../../assets/icons/application/AlertCircle';

export default function DependencyHandler(props) {
  const {
    onDeleteClick,
    onCancelDeleteClick,
    dependencyHeaderTitle,
    isDependencyListLoading,
    dependencyData,
    getMoreDependency,
    customDescription,
    hideSubtitle,
    customTitle,
    // isErrorInLoadingDependencyList
  } = props;
  const { t } = useTranslation();
  console.log('Dependency Handler Test Data', dependencyData);
  const dependencies = dependencyData?.dependency_list;
  console.log('Dependency Handler Dependencies List ', dependencies);
  const isBlocker = dependencyData?.is_blocker;
  console.log('isDependencyListLoading', isDependencyListLoading);
  console.log('dependencyHeaderTitle', dependencyHeaderTitle);

  const { colorSchemeDefault } = useContext(ThemeContext);

  const header = (
    <div className={cx(styles.header, gClasses.MX40, gClasses.MT40)}>
      <div className={cx(gClasses.AlertCircle)}>
        <AlertCircle />
      </div>
      <Text
        className={cx(
          gClasses.FTwo16GrayV3,
          gClasses.FontWeight600,
        )}
        size={ETextSize.LG}
        content={customTitle || `${DEPENDENCY_HANDLER_STRINGS(t).DEPENDENCY_HEADER_TEXT
          .DEPENDENCY_HEADER_TITLE
          } ${dependencyHeaderTitle}`}
      />
      {
        !hideSubtitle && (
          <Text
            className={cx(gClasses.GrayV91, gClasses.MT5, gClasses.MB24)}
            size={ETextSize.MD}
            content={
              DEPENDENCY_HANDLER_STRINGS(t).DEPENDENCY_HEADER_TEXT
                .DEPENDENCY_HEADER_DESC
            }
          />
        )
      }
    </div>
  );

  const main = isDependencyListLoading ? (
    <div className={cx(gClasses.DisplayFlex, gClasses.FlexDirectionColumn, gClasses.CenterH, gClasses.CenterV, gClasses.MT20, gClasses.MB20)}>
      <div>
        <SyncLoader
          size={10}
          color={COLOUR_CODES.GRAY_V3}
          loading={isDependencyListLoading}
        />
      </div>
      <div>
          {DEPENDENCY_HANDLER_STRINGS(t).DEPENDENCY_LOADING.DEPENDENCY_LIST_LOADING}
      </div>
    </div>
  ) : (
    <div>
      {/* Warning Header */}
      {!jsUtility.isEmpty(dependencies) &&
        <div className={cx(styles.DependencyWarningHeader)}>
          <div
            className={cx(
              BS.D_FLEX,
              styles.DependencyWarningContents,
              gClasses.PX20,
              gClasses.PY10,
              { [gClasses.DisplayNone]: jsUtility.isEmpty(dependencies) },
            )}
          >
            <DependencyAlertIcon className={gClasses.MT4} />
            <div
              className={cx(gClasses.DisplayFlex, gClasses.FlexDirectionColumn)}
            >
              <Text
                className={styles.DependenciesTextHeader}
                content={
                  DEPENDENCY_HANDLER_STRINGS(t).DEPENDENCY_ALERT_TEXT
                    .DEPENDENCY_ALERT_TEXT_TITLE
                }
              />
              {isBlocker ?
                (<Text
                  className={styles.DependenciesTextSubHeader}
                  content={customDescription ||
                    DEPENDENCY_HANDLER_STRINGS(t).DEPENDENCY_ALERT_TEXT
                      .DEPENDENCY_ALERT_TEXT_SUB_TITLE
                  }
                />) : (<Text
                  className={styles.DependenciesTextSubHeader}
                  content={customDescription ||
                    DEPENDENCY_HANDLER_STRINGS(t).DEPENDENCY_ALERT_TEXT
                      .DEPENDENCY_ALERT_TEXT_SUB_TITLE_NO_BLOCKER
                  }
                />)
              }
            </div>
          </div>
        </div>}
      {/* Dependency card */}
      {!jsUtility.isEmpty(dependencies) ? (
        dependencies?.map((dependency, dependencyIndex) => (
          <div className={cx(styles.DependencyCard)}>
            <span className={styles.DependencyCardHeadertext}>
              <Avatar
                size={AvatarSizeVariant.xs}
                variant={AvatarBorderRadiusVariant.circle}
                name={dependency?.name?.charAt(0).toUpperCase()}
                colorScheme={colorSchemeDefault}
              />
              <Text
                className={cx(styles.CardHeader, gClasses.Ellipsis)}
                outerClass={styles.CardHeaderOuter}
                content={dependency?.name}
                title={dependency?.name}
              />
            </span>
            {dependency?.dependencies?.map((dep, depIndex) => (
              <div key={depIndex}>
                {dep?.dependencies?.map((innerDep, innerDepIndex) => (
                  <div key={innerDepIndex}>
                    <Text
                      className={cx(
                        gClasses.FTwo13GrayV3,
                        gClasses.ML15,
                        gClasses.MT10,
                        styles.DependencyCardHeadText,
                      )}
                      outerClass={styles.CardHeaderOuter}
                      content={dependencyListName(dep?.type, t, innerDep, dependency?.type, dep?.name ? dep?.name : dep?.step_name)}
                    />
                  </div>
                ))}
                <Text
                  className={cx(
                    gClasses.FTwo13GrayV3,
                    gClasses.ML15,
                    gClasses.MT10,
                    styles.DependencyCardHeadText,
                  )}
                  outerClass={styles.CardHeaderOuter}
                  content={dependencyListName(dep?.type, t, dep, dependency?.type, dep?.name, dependency?.rule_type)}
                />
                {
                  dep?.is_child_loading ?
                    (
                      <div className={cx(gClasses.ML50, gClasses.MT10, gClasses.MB10)}>
                        <SyncLoader
                          size={8}
                          color={COLOUR_CODES.GRAY_V3}
                          loading={dep?.is_child_loading}
                        />
                      </div>
                    ) : (
                      dep?.child_dependency ? (
                        <div className={styles.DependencyList}>
                          <ul>
                            {
                              dep?.child_dependency?.map((childDep, index) => (
                                <li key={index}>
                                  <div className={cx(gClasses.CenterV, BS.P_RELATIVE)}>
                                    <Text
                                      className={cx(gClasses.FTwo13GrayV3, gClasses.ML5, styles.DependencyCardInnerDep)}
                                      outerClass={styles.CardHeaderOuter}
                                      content={childDep?.name}
                                      title={childDep?.name}
                                    />
                                  </div>
                                </li>
                              ))
                            }
                          </ul>
                        </div>
                      ) : (
                        dep?.show_view_more && (
                          <Button
                            className={cx(gClasses.MR15)}
                            onClickHandler={() => getMoreDependency(
                              dependency?.field_id,
                              `dependency_list,${dependencyIndex},dependencies,${depIndex}`,
                              dep?.type,
                            )}
                            buttonText={DEPENDENCY_ERROR_TYPE_LABELS(t).TRIGGER_DEPENDENCY_LOAD_MORE}
                            type={EButtonType.SECONDARY}
                            colorSchema={colorSchemeDefault}
                            noBorder
                          />
                        )
                      )
                    )
                }
              </div>
            ))}
          </div>
        ))
      ) : (
        null
      )}
    </div>
  );

  const footer = (
    <div className={!jsUtility.isEmpty(dependencies) ? styles.footerWithDependencies : styles.footerWithoutDependencies}>
      <Button
        onClickHandler={onCancelDeleteClick}
        buttonText={
          DEPENDENCY_HANDLER_STRINGS(t).DEPENDENCY_BUTTON_NAMES
            .DEPENDENCY_BUTTON_CANCEL
        }
        type={EButtonType.OUTLINE_SECONDARY}
        noBorder
      />
      {!isDependencyListLoading && (
        <Button
        onClickHandler={onDeleteClick}
        buttonText={
          DEPENDENCY_HANDLER_STRINGS(t).DEPENDENCY_BUTTON_NAMES
            .DEPENDENCY_BUTTON_DELETE
        }
        type={EButtonType.PRIMARY}
        colorSchema={{ activeColor: UTIL_COLOR.RED_600 }}
        disabled={isBlocker}
        />
      )}
    </div>
  );

  return (
    <div>
      <Modal
        id={MODAL_ATTRIBUTES.MODAL_ID}
        modalStyle={ModalStyleType.dialog}
        dialogSize={DialogSize.sm}
        isModalOpen
        mainContentClassName={cx(styles.MainContent, jsUtility.isEmpty(dependencies) && styles.NoDependenciesContentHeight)}
        headerContent={header}
        mainContent={main}
        footerContent={footer}
      />
    </div>
  );
}
