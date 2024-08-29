import React from 'react';
import { Text } from '@workhall-pvt-lmt/wh-ui-library';
import PdfRenderer from '../../../../../components/file_preview/PdfRenderer';
import Image from '../../../../../components/form_components/image/Image';
import styles from '../../ModelDetails.module.scss';
import { isEmptyString } from '../../../../../utils/UtilityFunctions';

function FileComponent(props) {
  const { component_name, documentUrl, file_type, isTryIt } = props;

  const getFileType = (link) => {
    const extension = link?.split('.').pop().toLowerCase() || file_type;
    switch (extension) {
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return 'image';
      case 'pdf':
        return 'pdf';
      default:
        return '';
    }
  };

  const fileType = isEmptyString(getFileType(documentUrl)) ? file_type : getFileType(documentUrl);

  const renderContent = () => {
    if (fileType === 'image') {
      return (
        <div>
          <Image src={documentUrl} className={styles.FileClass} />
        </div>
      );
    } else if (fileType === 'pdf') {
      return (
        <div className={styles.PDFClass}>
          <PdfRenderer fileSrc={documentUrl} scaleValue={1} isCustomPDF withCredentials={isTryIt} />
        </div>
      );
    } else {
      return (
        <div className={styles.image}>
          <Image src={documentUrl} className={styles.FileClass} />
        </div>
      );
    }
  };

  return (
    <div>
      <Text content={component_name} size="sm" />
      <div className={styles.container}>
      {renderContent()}
      </div>
    </div>
  );
}

export default FileComponent;
