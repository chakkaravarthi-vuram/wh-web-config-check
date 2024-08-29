import React from 'react';
import Breadcrumb from 'components/form_components/breadcrumb/Breadcrumb';
import cx from 'classnames/bind';
import { useTranslation } from 'react-i18next';
import FormTitle, {
  FORM_TITLE_TYPES,
} from 'components/form_components/form_title/FormTitle';
import gClasses from 'scss/Typography.module.scss';
import { BS } from 'utils/UIConstants';
import CloseIconNew from 'assets/icons/CloseIconNew';
import { keydownOrKeypessEnterHandle } from 'utils/UtilityFunctions';
import { FLOW_CONFIG_STRINGS } from 'containers/edit_flow/EditFlow.strings';
import { getStepConfigBreadcrumbList } from '../../StepConfiguration.utils';
import styles from './StepperHeader.module.scss';

function StepperHeader({ pageTitle, flowName, stepName, subTitle, hideBreadcrumb, isCloseIcon, onCloseIconClick }) {
  const { t } = useTranslation();
  const { STEP_NAME_GOES_HERE } = FLOW_CONFIG_STRINGS;
  const breadcrumbList = getStepConfigBreadcrumbList({ flowName, stepName: stepName || t(STEP_NAME_GOES_HERE) }, t);
  return (
    <div className={styles.HeaderContainer}>
      <div className={cx(gClasses.CenterV, BS.JC_BETWEEN)}>
      <FormTitle
        type={FORM_TITLE_TYPES.TYPE_6}
        className={cx(gClasses.PageMainHeader, gClasses.PB0)}
      >
        {pageTitle}
      </FormTitle>
      {isCloseIcon &&
      <div
        className={cx(styles.CloseIcon)}
        onClick={onCloseIconClick}
        onKeyDown={(e) => keydownOrKeypessEnterHandle(e) && onCloseIconClick}
        role="button"
        tabIndex={0}
      >
        <CloseIconNew className={cx(styles.CloseButton, gClasses.CursorPointer)} fillClass="#6c727e" />
      </div>
      }
      </div>

      {subTitle && (
        <FormTitle
          type={FORM_TITLE_TYPES.TYPE_1}
          className={cx(styles.SubtitleClass, gClasses.PB0)}
        >
          {subTitle}
        </FormTitle>
      )}

      {!hideBreadcrumb && (
        <Breadcrumb
          list={breadcrumbList}
          className={styles.FlowBreadcrumb}
          arrowClass={styles.BreadcrumbArrow}
        />
      )}
    </div>
  );
}

export default StepperHeader;
