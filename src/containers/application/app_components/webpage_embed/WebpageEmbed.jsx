import React from 'react';
import cx from 'classnames';

import style from './WebpageEmbed.module.scss';
import { BS } from '../../../../utils/UIConstants';
import gClasses from '../../../../scss/Typography.module.scss';
import Iframe from '../../../../components/iframe/Iframe';

function WebpageEmbed(props) {
  const { componentDetails = {} } = props;
  const {
    component_info: { embed: { url } },
  } = componentDetails;
  const iframeTitle = 'iframe';
  return (
    <div className={cx(BS.FLEX_COLUMN, BS.W100, style.WebpageEmbedContainer)}>
      <div className={cx(gClasses.HeightInherit)}>
        <Iframe src={url} title={iframeTitle} />

      </div>
    </div>
  );
}

export default WebpageEmbed;
