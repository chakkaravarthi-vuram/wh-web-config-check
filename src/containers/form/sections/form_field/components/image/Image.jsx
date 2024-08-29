import React from 'react';
import { useHistory } from 'react-router-dom';
import { getDmsLinkForPreviewAndDownload } from '../../../../../../utils/attachmentUtils';
import { EMPTY_STRING } from '../../../../../../utils/strings/CommonStrings';
import styles from './Image.module.scss';

function Image(props) {
  const { imageId } = props;
  const history = useHistory();

  const initialLink = getDmsLinkForPreviewAndDownload(history);
  const srcLink = `${initialLink}/dms/display/?id=${imageId}`;

  return (
    <div className={styles.ImageContainer}>
      <img src={srcLink} alt={EMPTY_STRING} />
    </div>
  );
}

export default Image;
