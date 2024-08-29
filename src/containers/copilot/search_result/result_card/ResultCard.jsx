import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { Text } from '@workhall-pvt-lmt/wh-ui-library';
import CopilotIcon from 'assets/icons/copilot/CopilotIcon';
import ClipboardCheckIcon from 'assets/icons/application/ClipboardCheckIcon';
import gClasses from 'scss/Typography.module.scss';
import { RESULT_TYPE } from '../../Copilot.strings';
import styles from './ResultCard.module.scss';
import { keydownOrKeypessEnterHandle } from '../../../../utils/UtilityFunctions';

function ResultCard(props) {
  const { data, isInstruction, isLoading, isClickable, onClick, textClassName } = props;

  let icon = null;
  if (!isLoading) {
    if (data?.type === RESULT_TYPE.COPILOT) {
      icon = <CopilotIcon />;
    } else if (data?.type === RESULT_TYPE.TASK) {
      icon = <ClipboardCheckIcon className={gClasses.WH16} />;
    }
  }

  return (
    <div
      className={cx(
        styles.ResultCard,
        isInstruction && styles.Instruction,
        isClickable ? gClasses.CursorPointer : gClasses.CursorDefault,
      )}
      role="button"
      tabIndex={0}
      onClick={() => isClickable && onClick?.(data?.id)}
      onKeyDown={(e) => {
        isClickable && keydownOrKeypessEnterHandle(e) && onClick?.(data?.id);
      }}
    >
      {icon}
      <Text content={data?.name} isLoading={isLoading} className={textClassName} />
    </div>
  );
}

ResultCard.defaultProps = {
  data: [],
  isBackgroundColor: false,
  isLoading: false,
  isClickable: false,
  onClick: null,
  textClassName: null,
};

ResultCard.propTypes = {
  data: PropTypes.objectOf({
    name: PropTypes.string,
    type: PropTypes.string,
    id: PropTypes.string,
  }),
  isBackgroundColor: PropTypes.bool,
  isLoading: PropTypes.bool,
  isClickable: PropTypes.bool,
  onClick: PropTypes.func,
  textClassName: PropTypes.string,
};

export default ResultCard;
