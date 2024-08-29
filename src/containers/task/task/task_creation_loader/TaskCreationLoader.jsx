import React, { useEffect, useState } from 'react';
import { Modal, ModalSize, Text, ETextSize } from '@workhall-pvt-lmt/wh-ui-library';
import TaskGeneratingIcon from 'assets/icons/ml_task_creation/TaskGenerating';
import TaskNameCreationIcon from 'assets/icons/ml_task_creation/TaskNameCreation';
import TaskDescCreationIcon from 'assets/icons/ml_task_creation/TaskDescCreation';
import TaskDueDateCreationIcon from 'assets/icons/ml_task_creation/TaskDueDateCreation';
import TaskGenerateSuccessIcon from 'assets/icons/ml_task_creation/TaskGenerateSuccess';
import cx from 'classnames/bind';
import gClasses from 'scss/Typography.module.scss';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import styles from './TaskCreationLoader.module.scss';
import { ARIA_ROLES, BS } from '../../../../utils/UIConstants';
import CloseIcon from '../../../../assets/icons/CloseIcon';
import { keydownOrKeypessEnterHandle } from '../../../../utils/UtilityFunctions';
import { createTaskSetState } from '../../../../redux/reducer/CreateTaskReducer';
import getTaskLoaderTitleDesc, { getAppLoaderTitleDesc, getDatalistLoaderTitleDesc, getFlowLoaderTitleDesc, PROMPT_LOADER_STRINGS } from './TaskCreationLoader.strings';
import WarningNewIcon from '../../../../assets/icons/WarningNewIcon';
import { PROMPT_TYPE } from '../../../../components/prompt_input/PromptInput.constants';

function TaskCreationLoader(props) {
    const { isMlTaskLoading, setTaskState, promptType } = props;
    const [currentInterface, setCurrentInterface] = useState(1);
    const { t } = useTranslation();
    let details = [];
    switch (promptType) {
        case PROMPT_TYPE.FLOW:
            details = getFlowLoaderTitleDesc(t);
            break;
        case PROMPT_TYPE.DATA_LIST:
            details = getDatalistLoaderTitleDesc(t);
            break;
        case PROMPT_TYPE.APP:
            details = getAppLoaderTitleDesc(t);
            break;
        default:
            details = getTaskLoaderTitleDesc(t);
            break;
    }

    useEffect(() => {
        const changeScreenLoader = setInterval(() => {
            if (isMlTaskLoading && currentInterface < 5) {
                setCurrentInterface(currentInterface + 1);
            } else setCurrentInterface(1);
        }, 1000);
        return () => clearInterval(changeScreenLoader);
    }, [currentInterface]);

    const onCloseClick = () => {
        const { controller } = props;
        controller?.abort();
        setTaskState({ isMlTaskLoading: false, promptType: null });
    };

    const getCurrentInterface = () => {
        switch (currentInterface) {
            case 1:
                return (
                    <>
                        <TaskNameCreationIcon />
                        <Text content={details[4].title} size={ETextSize.LG} fontClass={cx(gClasses.BlackV12, gClasses.FontWeight500)} className={gClasses.MT40} />
                        <Text content={details[0].desc} size={ETextSize.SM} fontClass={gClasses.GrayV104} className={gClasses.MT8} />
                    </>
                );
            case 2:
                return (
                    <>
                        <TaskDescCreationIcon />
                        <Text content={details[4].title} size={ETextSize.LG} fontClass={cx(gClasses.BlackV12, gClasses.FontWeight500)} className={gClasses.MT40} />
                        <Text content={details[1].desc} size={ETextSize.SM} fontClass={gClasses.GrayV104} className={gClasses.MT8} />
                    </>
                );
            case 3:
                return (
                    <>
                        <TaskDueDateCreationIcon />
                        <Text content={details[4].title} size={ETextSize.LG} fontClass={cx(gClasses.BlackV12, gClasses.FontWeight500)} className={gClasses.MT40} />
                        <Text content={details[2].desc} size={ETextSize.SM} fontClass={gClasses.GrayV104} className={gClasses.MT8} />
                    </>
                );
            case 4:
                return (
                    <>
                        <TaskGeneratingIcon />
                        <Text content={details[4].title} size={ETextSize.LG} fontClass={cx(gClasses.BlackV12, gClasses.FontWeight500)} className={gClasses.MT40} />
                        <Text content={details[3].desc} size={ETextSize.SM} fontClass={gClasses.GrayV104} className={gClasses.MT8} />
                    </>
                );
            case 5:
                return (
                    <>
                        <TaskGenerateSuccessIcon />
                        <Text content={details[4].title} size={ETextSize.LG} fontClass={cx(gClasses.BlackV12, gClasses.FontWeight500)} className={gClasses.MT40} />
                        <Text content={details[4].desc} size={ETextSize.SM} fontClass={gClasses.GrayV104} className={gClasses.MT8} />
                    </>
                );
            default: return null;
        }
    };

    const headerComponent = (
        <div className={cx(BS.D_FLEX, BS.JC_END, BS.W100)}>
            <CloseIcon
                className={cx(styles.CloseIcon, BS.JC_END, gClasses.CursorPointer)}
                onClick={() => onCloseClick()}
                role={ARIA_ROLES.BUTTON}
                tabIndex={0}
                onKeyDown={(e) =>
                    keydownOrKeypessEnterHandle(e) && onCloseClick()
                }
            />
        </div>
    );

    const mainComponent = (
        <div className={cx(gClasses.CenterVH, BS.W100, gClasses.H90, gClasses.FlexDirectionColumn)}>
            {getCurrentInterface()}
        </div>
    );

    const footerComponent = (
        <div className={cx(gClasses.CenterVH, BS.W100, gClasses.PB30)}>
            <WarningNewIcon />
            <Text content={t(PROMPT_LOADER_STRINGS.SEARCH)} className={cx(gClasses.FTwo13RedV27, gClasses.ML12)} fontClass={gClasses.FontWeight500} />
        </div>
    );

    return (
        <Modal
            modalSize={ModalSize.md}
            isModalOpen={isMlTaskLoading}
            headerContent={headerComponent}
            mainContent={mainComponent}
            footerContent={footerComponent}
        />
    );
}

const mapStateToProps = (state) => {
    return {
        isMlTaskLoading: state.CreateTaskReducer.isMlTaskLoading,
        promptType: state.CreateTaskReducer.promptType,
        controller: state.CreateTaskReducer.controller,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        setTaskState: (value) => dispatch(createTaskSetState(value)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(TaskCreationLoader);
