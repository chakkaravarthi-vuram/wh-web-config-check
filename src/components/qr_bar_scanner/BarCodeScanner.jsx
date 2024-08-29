import ModalLayout from 'components/form_components/modal_layout/ModalLayout';
import React from 'react';
import BarcodeScannerComponent from 'react-qr-barcode-scanner';
import cx from 'classnames';
import gClasses from 'scss/Typography.module.scss';
import Styles from './BarCodeScanner.module.scss';

function BarCodeScanner(props) {
  const { setIsScannerOpen, onChangeHandler, id } = props;

  const closecam = () => {
    setIsScannerOpen(false);
  };

  let scanner = null;
  scanner = (
    <div>
      <BarcodeScannerComponent
        width="100%"
        height={300}
        onUpdate={(err, result) => {
          if (result) {
            onChangeHandler(id, result.text);
            setIsScannerOpen(false);
          }
        }}
      />
    </div>
  );

  return (
  <ModalLayout
    id="barcode_scanner"
    modalContainerClass={cx(Styles.ContainerClass, gClasses.PB10)}
    containerClass={Styles.ContentClass}
    headerContent="Scan"
    mainContent={scanner}
    mainContentClassName={cx(Styles.MainContentClassName, gClasses.MB0)}
    isModalOpen
    centerVH
    onCloseClick={closecam}
    headerClassName={cx(Styles.HeaderClass, gClasses.FontWeight500)}
  />
  );
}

export default BarCodeScanner;
