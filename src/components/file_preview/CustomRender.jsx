import React from 'react';
import { Player, BigPlayButton } from 'video-react';
import { getExtensionFromFileName } from 'utils/generatorUtils';
import styles from './FileViewer.module.scss';
import 'video-react/dist/video-react.css';
import { isImageFileType } from './FileviewerUtils';

function CustomVideoRenderer(props) {
  const { fileSrc, fileDetail } = props;
  let customRenderComponent = null;

  if (!fileSrc) return null;

  if (isImageFileType(fileDetail.type) || isImageFileType(getExtensionFromFileName(fileDetail.fileName))) {
    customRenderComponent = (
      <div className={styles.ImageComponentDiv}>
        <img src={fileSrc} alt={fileDetail.fileName} className={styles.Image} />
      </div>
    );
  } else {
    customRenderComponent = (
      <div className={styles.VideoContainer}>
        <div className={styles.VideoMainContainer}>
        <Player src={fileSrc}>
          <BigPlayButton position="center" />
        </Player>
        </div>
      </div>
    );
  }
  return customRenderComponent;
}

export default CustomVideoRenderer;
