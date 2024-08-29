import React, { useEffect, useState } from 'react';
import cx from 'classnames';
import gClasses from 'scss/Typography.module.scss';
import GreenTickIcon from '../../assets/icons/form_post_operation_feedback/GreenTickIcon';
import CopyIcon from '../../assets/icons/integration/CopyIcon';
import { EMPTY_STRING } from '../../utils/strings/CommonStrings';

function CopyClipboard(props) {
  const { id, copyText = EMPTY_STRING } = props;

  const [isCopyTickClientId, setCopyTickClientId] = useState(false);

  const onCopyClick = async () => {
    try {
      await navigator.clipboard.writeText(copyText);
      setCopyTickClientId(true);
    } catch (error) {
      console.log('copy text failed');
    }
  };

  useEffect(() => {
    if (isCopyTickClientId) {
      const timeoutId = setTimeout(() => {
        setCopyTickClientId(false);
      }, 3000);
      return () => clearTimeout(timeoutId);
    }
    return () => {};
  }, [isCopyTickClientId]);

  return (
    <div className={cx(gClasses.TextAlignRight, gClasses.FlexGrow1)}>
      {isCopyTickClientId ? (
        <GreenTickIcon />
      ) : (
        <button id={id} onClick={onCopyClick}>
          <CopyIcon />
        </button>
      )}
    </div>
  );
}

export default CopyClipboard;
