import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import cx from 'classnames';
import { toastPopOver, EToastType, RadioGroup } from '@workhall-pvt-lmt/wh-ui-library';
import styles from '../FlowLanding.module.scss';
import DeleteConfirmModal from '../../../application/delete_comfirm_modal/DeleteConfirmModal';
import gClasses from '../../../../scss/Typography.module.scss';
import { DELETE_DISCARD_FLOW_STRINGS } from '../FlowLanding.constant';
import { somethingWentWrongErrorToast } from '../../../../utils/UtilityFunctions';
import { checkFlowDependencyApi, deleteFlow } from '../../../../axios/apiService/flow.apiService';
import DependencyHandler from '../../../../components/dependency_handler/DependencyHandler';
import { isEmpty, isNull } from '../../../../utils/jsUtility';

function DeleteFlow(props) {
    const { onClose, metaData, onDelete } = props;
    const { t } = useTranslation();
    const { DELETE } = DELETE_DISCARD_FLOW_STRINGS(t);
    const { flowUUID, flowId } = metaData;
    const [radioValue, setRadioValue] = useState(DELETE.RADIO_GROUP_OPTION_LIST[0].value);
    const [dependencyData, setDependencyData] = useState(null);

    const deleteFlowFunction = () => {
        const params = {
            flow_uuid: flowUUID,
            delete_with_instance: radioValue === DELETE.RADIO_GROUP_OPTION_LIST[0].value,
        };
        deleteFlow(params).then((res) => {
            if (res) {
                toastPopOver({
                    toastType: EToastType.info,
                    title: DELETE.SUCCESS_TITLE,
                });
                onDelete();
            }
        }).catch((err) => {
            console.log('delete flow err', err);
            somethingWentWrongErrorToast();
        });
    };

    const onDeleteClicked = () => {
      checkFlowDependencyApi({ _id: flowId })
        .then((response) => {
          if (!isNull(response)) {
            const { dependency_list = {} } = response || {};
            if (isEmpty(dependency_list)) {
              deleteFlowFunction();
            } else {
              setDependencyData(response);
            }
          }
        })
        .catch(() => {
          toastPopOver({
            title: t('error_popover_status.somthing_went_wrong'),
            subtitle: t('error_popover_status.try_again_later'),
            toastType: EToastType.error,
          });
        });

      // dispatch(checkFlowDependencyApiThunk(
      //     { _id: flowId },
      //     'Flow',
      //     params,
      //     () => deleteFlowFunction(params),
      // )).then((res) => {
      //     console.log('xyz dependency res', res);
      //     setDependencyData(res);
      // });
    };

    const getDeleteRadioGroupComponent = () => (
    <RadioGroup
        options={DELETE.RADIO_GROUP_OPTION_LIST}
        onChange={(event, id, value) => {
            setRadioValue(value);
        }}
        selectedValue={radioValue}
    />);

    return (
      <>
        {dependencyData && (
          <DependencyHandler
            onDeleteClick={() => deleteFlowFunction()}
            onCancelDeleteClick={() => setDependencyData(null)}
            dependencyHeaderTitle={t('someone_is_editing_error.flow')}
            dependencyData={dependencyData}
          />
        )}

        <DeleteConfirmModal
          isModalOpen
          content={DELETE.TITLE}
          firstLine={DELETE.SUBTITLE}
          cancelButton={DELETE.CANCEL_BUTTON}
          DeleteButton={DELETE.DELETE_BUTTON}
          isDeleteDataList
          modalContainerClass={gClasses.P32}
          mainContentClassName={styles.ModalClassName}
          contentClassName={cx(
            gClasses.FontWeightBold,
            styles.HeadingColor,
            gClasses.MB8,
          )}
          languageStyle={cx(
            gClasses.CenterV,
            gClasses.TextAlignCenter,
            styles.TextColor,
          )}
          buttonClassName={cx(
            gClasses.JusEnd,
            gClasses.W100Important,
            gClasses.MB0,
          )}
          cancelButtonStyles={styles.CancelButton}
          onCloseModal={onClose}
          onDelete={onDeleteClicked}
          isDeleteFlow
          deleteRadioGroupComponent={getDeleteRadioGroupComponent}
        />
      </>
    );
}

export default DeleteFlow;
