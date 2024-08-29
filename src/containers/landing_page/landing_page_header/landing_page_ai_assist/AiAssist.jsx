import React, { useRef, useState } from 'react';
import cx from 'classnames/bind';
import gClasses from 'scss/Typography.module.scss';
import { DialogSize, Input, Modal, ModalStyleType, Size, Variant } from '@workhall-pvt-lmt/wh-ui-library';
import { connect } from 'react-redux';
import { useHistory } from 'react-router';
import { useTranslation } from 'react-i18next';
import styles from './AiAssist.module.scss';
import AiMagicIcon from '../../../../assets/icons/ai_assist/AiMagicIcon';
import AiSendIcon from '../../../../assets/icons/ai_assist/AiSendIcon';
import { postAppCreationPrompt } from '../../../../redux/actions/AppCreationFromPrompt.Action';
import { AI_ASSIST_TYPE } from './AiAssist.constants';
import { EMPTY_STRING } from '../../../../utils/strings/CommonStrings';
import { APP_CREATION_NLP } from '../../../application/application.strings';
import { DATA_LIST_CREATION_NLP } from '../../../data_list/listDataList/listDataList.strings';
import { postDataListCreationPromptThunk } from '../../../../redux/actions/DataListCreationPrompt.Action';
import { FLOW_CREATION_NLP } from '../../../flow/listFlow/listFlow.strings';
import { postFlowCreationPromptThunk } from '../../../../redux/actions/FlowCreationPrompt.Action';
import { TASK_CREATION_NLP } from '../../my_tasks/MyTasks.strings';
import { postTaskCreationPromptThunk } from '../../../../redux/actions/TaskCreationPrompt.Action';
import { useClickOutsideDetector } from '../../../../utils/UtilityFunctions';
import { KEY_CODES } from '../../../../utils/Constants';

function AiAssist(props) {
    const {
        isModalOpen,
        postAppCreationPrompt,
        aiAssistType,
        setShowAiAssist,
        postDataListCreationPromptThunk,
        postFlowCreationPromptThunk,
        postTaskCreationPromptThunk,
    } = props;
    const history = useHistory();
    const { t } = useTranslation();
    const [searchText, setSearchText] = useState(EMPTY_STRING);
    const assistContainerRef = useRef(null);
    useClickOutsideDetector(assistContainerRef, () => { setShowAiAssist(false); setSearchText(EMPTY_STRING); });

    const onChangeHandler = (event) => {
        setSearchText(event?.target?.value);
    };

    const getPlaceholderText = () => {
        switch (aiAssistType) {
            case AI_ASSIST_TYPE.APP:
                return t(APP_CREATION_NLP.PLACEHOLDER);
            case AI_ASSIST_TYPE.FLOW:
                return t(FLOW_CREATION_NLP.PLACEHOLDER);
            case AI_ASSIST_TYPE.DATA_LIST:
                return t(DATA_LIST_CREATION_NLP.PLACEHOLDER);
            case AI_ASSIST_TYPE.TASK:
                return t(TASK_CREATION_NLP.PLACEHOLDER);
            default: return EMPTY_STRING;
        }
    };

    const postDataToCreateSource = (params, controller) => {
        switch (aiAssistType) {
            case AI_ASSIST_TYPE.APP:
                postAppCreationPrompt(params, controller, history, { pathname: history.location.pathname, search: '?create=app' }, t);
                break;
            case AI_ASSIST_TYPE.FLOW:
                postFlowCreationPromptThunk(params, controller, history, { pathname: history.location.pathname, search: '?create=flow' }, t);
                break;
            case AI_ASSIST_TYPE.DATA_LIST:
                postDataListCreationPromptThunk(params, controller, history, { pathname: history.location.pathname, search: '?create=datalist' }, t);
                break;
            case AI_ASSIST_TYPE.TASK:
                postTaskCreationPromptThunk(params, controller, history, { pathname: history.location.pathname, search: '?create=task' }, t);
                break;
            default: break;
        }
        setShowAiAssist(false);
        setSearchText(EMPTY_STRING);
    };

    const createSourceWithPromptText = async () => {
        const data = { prompt: searchText };
        const controller = new AbortController();
        await postDataToCreateSource(data, controller);
    };

    const onEnterClicked = (event) => {
        if (event.keyCode === KEY_CODES.ENTER || event.which === KEY_CODES.ENTER) {
            createSourceWithPromptText();
        }
    };

    return (
        <Modal
            id="ai_assist"
            modalStyle={ModalStyleType.dialog}
            dialogSize={DialogSize.sm}
            className={cx(gClasses.CursorAuto, gClasses.TopV, styles.AssistModal)}
            customModalClass={cx(styles.AssistModalContainer)}
            mainContentClassName={cx(gClasses.OverflowHiddenImportant, gClasses.HeightFitContent)}
            isModalOpen={isModalOpen}
            onCloseClick={() => { setShowAiAssist(false); setSearchText(EMPTY_STRING); }}
            enableEscClickClose
            mainContent={(
                <div className={styles.OuterContainer} ref={assistContainerRef}>
                    <div className={cx(styles.InnerContainer, gClasses.DisplayFlex, gClasses.JusSpaceBtw)}>
                        <AiMagicIcon />
                        <div className={gClasses.W100}>
                            <Input
                                className={cx(styles.SearchInput)}
                                variant={Variant.borderLess}
                                size={Size.lg}
                                innerClassName={gClasses.MT2}
                                autoFocus
                                placeholder={getPlaceholderText()}
                                onChange={onChangeHandler}
                                content={searchText}
                                onInputKeyDownHandler={onEnterClicked}
                            />
                        </div>
                        <button onClick={createSourceWithPromptText}>
                            <AiSendIcon />
                        </button>
                    </div>
                </div>
            )}
        />
    );
}

const mapDispatchToProps = {
    postAppCreationPrompt,
    postDataListCreationPromptThunk,
    postFlowCreationPromptThunk,
    postTaskCreationPromptThunk,
};

export default connect(null, mapDispatchToProps)(AiAssist);
