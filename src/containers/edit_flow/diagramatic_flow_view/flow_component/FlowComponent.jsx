import React, { useEffect, useCallback, useState, useRef } from 'react';
import ReactFlow, {
    useReactFlow,
    ReactFlowProvider,
    Background,
    BackgroundVariant,
    Panel,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { isEmpty } from 'utils/jsUtility';
import cx from 'classnames';
import {
    EThumbnailSize, Thumbnail,
    Variant,
    StepIconAndColor,
    Input,
} from '@workhall-pvt-lmt/wh-ui-library';
import gClasses from 'scss/Typography.module.scss';
import { useTranslation } from 'react-i18next';
import styles from './FlowComponent.module.scss';
import './ReactFlow.css';
import { CUSTOM_EDGES, CUSTOM_NODES, FLOW_CONTROL_PANELS, CONTROL_PANELS_ID, STEP_PANEL_LIST, EDGE_STYLES, CUSTOM_NODE_LABELS, DEFAULT_NODE_OPTIONS, CUSTOM_NODE_DIMENSION } from './FlowComponent.constants';
import { getViewportConfigurations } from './FlowComponent.utils';
import { SEARCH_STEP, STEP_LABELS } from '../../EditFlow.strings';
import Tooltip from '../../../../components/tooltip/Tooltip';
import { NODE_BE_KEYS } from '../../node_configuration/NodeConfiguration.constants';
import { STEP_TYPE } from '../../../../utils/Constants';
import { EMPTY_STRING } from '../../../../utils/strings/CommonStrings';
import SearchIconNew from '../../../../assets/icons/SearchIconNew';
import ChevronIconFlow from '../../../../assets/icons/flow/ChevronIconFlow';
import CloseIconV3 from '../../../../assets/icons/CloseIconV3';

function FlowComponent(props) {
    const {
        data,
        updateFlowComponentState,
        flowDropdownData,
        postCoordinatesData,
        activeStepId,
        resetFocus,
        toggleFocus,
        isTrialDisplayed,
        addNewNode,
        onConnectEdges,
        removeFlowNodeDropdown,
        setUserConfigNode,
        updateFlowStateChange,
        searchStepValue,
        searchResults,
    } = props;
    const { t } = useTranslation();
    const { nodes, edges } = data;
    const { viewportInitialized, setCenter, getZoom, setViewport, zoomIn, zoomOut, fitView } = useReactFlow();
    const [isSearchOpen, setSearchOpen] = useState(false);

    const [viewInitialized, setViewInitialized] = useState(false);
    const [activeNodeId, setActiveNodeId] = useState(null);
    const [translateExtent, setTranslateExtent] = useState();
    const [reactFlowInstance, setReactFlowInstance] = useState(null);
    const [controlPanelHeight, steControlPanelHeight] = useState(250);
    const flowComponentRef = useRef(null);

    const getViewportClientDimension = () => {
        steControlPanelHeight(Math.max(flowComponentRef.current.clientHeight, 250) - 200);
    };

    useEffect(() => {
        const onHandleSearch = (event) => {
            if ((event.ctrlKey || event.metaKey) && event.key === 'f') {
                event.preventDefault();
                console.log('Search clicked');
                setSearchOpen(true);
            }
        };
        window.addEventListener('keydown', onHandleSearch);
        return () => {
            window.removeEventListener('keydown', onHandleSearch);
        };
    }, []);

    const setNodeFocus = (searchResults = {}) => {
        if (searchResults?.data) {
            const activeSearchNodeId = searchResults.data?.[searchResults.searchIndex]?.id;
            const activeSearchResult = nodes?.find((node) => node.id === activeSearchNodeId);
            if (activeSearchResult) {
                const x = activeSearchResult.position.x + activeSearchResult.width / 2;
                const y = activeSearchResult.position.y + activeSearchResult.height / 2;
                const zoom = getZoom();
                setCenter(x, y, { zoom, duration: 100 });
            }
        }
    };

    const onSearchArrowClick = (isDownArrowClicked = false) => {
        if (isEmpty(searchResults?.data)) return;
        let currentIndex = searchResults?.searchIndex;
        if (isDownArrowClicked) {
            currentIndex += 1;
        } else {
            currentIndex -= 1;
        }
        if (currentIndex >= searchResults?.data?.length) {
            currentIndex = 0;
        } else if (currentIndex < 0 && searchResults?.data?.length > 0) {
            currentIndex = searchResults.data.length - 1;
        }
        console.log('FlowSearch_currentIndex', currentIndex);
        const updatedResults = {
            data: searchResults?.data,
            searchIndex: searchResults ? currentIndex : -1,
        };
        updateFlowStateChange({
            searchResults: updatedResults,
        });
        setNodeFocus(updatedResults);
    };

    useEffect(() => {
        getViewportClientDimension();
        window.addEventListener('resize', getViewportClientDimension);
        return () => {
            window.removeEventListener('resize', getViewportClientDimension);
        };
    }, []);

    const focusNode = (nodeIndex = 0, activeNodeId = null) => {
        if (nodes.length > 0 && !isEmpty(nodes[nodeIndex])) {
            const node = nodes[nodeIndex];
            const x = node.position.x + node.width / 2;
            const y = node.position.y + node.height / 2;
            const zoom = getZoom();
            setCenter(x, y, { zoom, duration: 800 });
            if (activeNodeId) {
                setTimeout(() => {
                    toggleFocus();
                    setActiveNodeId(null);
                }, 800);
            }
        }
    };
    useEffect(() => {
        const data = getViewportConfigurations(nodes);
        setTranslateExtent(data?.translateExtent);
    }, [nodes]);

    useEffect(() => {
        if (!viewInitialized && viewportInitialized) {
            const data = getViewportConfigurations(nodes);
            const zoom = getZoom();
            setViewport({ x: data?.viewport?.x, y: data?.viewport?.y, zoom }, { duration: 800 });
            setViewInitialized(true);
        }
    }, [viewportInitialized, viewInitialized, nodes]);

    useEffect(() => {
        if (resetFocus) {
            let activeNode = activeNodeId;
            if (activeStepId !== activeNodeId) activeNode = activeStepId;
            const index = (nodes || []).findIndex(({ id }) => (id === activeNode));
            if (index > -1) {
                focusNode(index, activeNode);
            }
        }
    }, [resetFocus, activeStepId]);

    useEffect(() => {
        if (activeStepId) setActiveNodeId(activeStepId);
    }, [activeStepId]);

    const onNodesChange = useCallback(
        (changes) => {
            updateFlowComponentState(changes);
        },
        [data],
    );

    const onDragStart = (event, nodeType) => {
        event.dataTransfer.setData('application/reactflow', nodeType);
        event.dataTransfer.effectAllowed = 'move';
    };

    const onDragOver = useCallback((event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    const removeUserStepConfigNode = () => {
        setUserConfigNode({});
    };

    const onDrop = useCallback(
        (event) => {
            event.preventDefault();
            const type = event.dataTransfer.getData('application/reactflow');
            // check if the dropped element is valid
            if (typeof type === 'undefined' || !type) {
                return;
            }
            const position = reactFlowInstance.screenToFlowPosition({
                x: event.clientX,
                y: event.clientY,
            });
            if (type === STEP_TYPE.USER_STEP) {
                setUserConfigNode({
                    id: CUSTOM_NODE_LABELS.USER_STEP_CONFIG,
                    type: CUSTOM_NODE_LABELS.USER_STEP_CONFIG,
                    ...DEFAULT_NODE_OPTIONS,
                    ...CUSTOM_NODE_DIMENSION[CUSTOM_NODE_LABELS.USER_STEP_CONFIG],
                    position,
                    style: { zIndex: 1001 },
                    data: {
                        addNewNode,
                        removeNode: removeUserStepConfigNode,
                        position,
                    },
                });
            } else {
                addNewNode({ coordinateInfo: { [NODE_BE_KEYS.STEP_COORDINATES]: position }, stepType: type });
            }
        },
        [reactFlowInstance],
    );

    const controlPanelClicked = (id) => {
        if (id === CONTROL_PANELS_ID.ZOOM_IN) {
            zoomIn({ duration: 800 });
        } else if (id === CONTROL_PANELS_ID.ZOOM_OUT) {
            zoomOut({ duration: 800 });
        } else if (id === CONTROL_PANELS_ID.FIT_VIEW) {
            fitView();
        }
    };

    const searchOnChange = (e) => {
        const searchResults = [];
        if (e?.target?.value) {
            nodes.forEach((nodeData) => {
                let labelString = nodeData?.data?.label || EMPTY_STRING;
                const expression = new RegExp(new RegExp(`(${e.target.value})`, 'gi'));
                let expressionCondition = expression.exec(labelString);
                let count = 0;
                while (expressionCondition != null) {
                    labelString = labelString.substr(labelString.index + 1);
                    expressionCondition = expression.exec(labelString);
                    searchResults.push({
                        id: nodeData.id,
                        strIndex: count,
                    });
                    count++;
                }
            });
        }
        const updatedSearchResults = {
            data: searchResults,
            searchIndex: searchResults ? 0 : -1,
        };
        console.log('updatedSearchResults', updatedSearchResults);

        updateFlowStateChange({
            searchResults: updatedSearchResults,
            searchStepValue: e?.target?.value,
        });
        setNodeFocus(updatedSearchResults);
    };

    const onCloseSearch = () => {
        setSearchOpen(false);
        updateFlowStateChange({ searchStepValue: EMPTY_STRING });
    };

    const getResultsCount = () => {
        let display = null;
        let activeIndex = searchResults?.searchIndex;
        const total = searchResults?.data?.length;
        if (total >= 1) activeIndex += 1;
        if (searchResults?.data) {
            display = `${(activeIndex)}/${searchResults?.data?.length}`;
        }
        return (
            <div className={cx(styles.SearchCount, gClasses.MR6)}>
                {display}
            </div>
        );
    };

    const onSearchKeyDown = (event) => {
        if (!isEmpty(searchStepValue)) {
            if (event.key === 'Enter') {
                onSearchArrowClick(true);
            }
        }
    };

    const customSearch = isSearchOpen && (
        <div className={cx(gClasses.CenterV, gClasses.JusSpaceBtw, styles.SearchFlow)}>
            <div className={gClasses.CenterV}>
                <SearchIconNew className={styles.SearchIcon} />
                <Input
                    className={cx(styles.SearchInput)}
                    onChange={searchOnChange}
                    content={searchStepValue}
                    innerClassName={styles.InputInnerClass}
                    onInputKeyDownHandler={onSearchKeyDown}
                    placeholder={t(SEARCH_STEP)}
                    variant={Variant.borderLess}
                    autoFocus
                />
            </div>
            <div className={gClasses.CenterV}>
                {!isEmpty(searchStepValue) && getResultsCount()}
                <button
                    onClick={() => onSearchArrowClick()}
                    className={gClasses.MR6}
                >
                    <ChevronIconFlow className={cx(gClasses.Rotate180)} />
                </button>
                <button
                    className={cx(gClasses.MR6)}
                    onClick={() => onSearchArrowClick(true)}
                >
                    <ChevronIconFlow />
                </button>
                <CloseIconV3 onClick={onCloseSearch} />
            </div>
        </div>
    );

    return (
        <>
            {customSearch}
            <div
                className={(isTrialDisplayed ? styles.ReactFlowReducedHeight : styles.ReactFlowContainer)}
                role="presentation"
                tabIndex={-1}
                ref={flowComponentRef}
            >
                <ReactFlow
                    nodeTypes={CUSTOM_NODES}
                    nodes={nodes}
                    edges={edges}
                    onInit={setReactFlowInstance}
                    onNodesChange={onNodesChange}
                    panOnScroll={isEmpty(flowDropdownData?.nodeId)}
                    zoomOnScroll={false}
                    onNodeDragStop={postCoordinatesData}
                    nodeDragThreshold={1}
                    edgeTypes={CUSTOM_EDGES}
                    attributionPosition="bottom-right"
                    onConnect={onConnectEdges}
                    translateExtent={translateExtent}
                    onDrop={onDrop}
                    onDragOver={onDragOver}
                    disableKeyboardA11y
                    connectionLineType={EDGE_STYLES.STEP}
                    onPaneClick={() => {
                        removeFlowNodeDropdown({});
                    }}
                >
                    <Background variant={BackgroundVariant.Dots} />
                    <Panel
                        position="top-right"
                        className={cx(
                            styles.StepPanel,
                            gClasses.P2,
                            styles.StepPanelPosition,
                        )}
                        style={{ maxHeight: `${controlPanelHeight}px` }}
                    >
                        {
                            STEP_PANEL_LIST.map((stepType) => {
                                const panelProps = StepIconAndColor[stepType];
                                return (
                                    <div
                                        key={stepType}
                                        onDragStart={(event) => onDragStart(event, stepType)}
                                        draggable
                                        role="presentation"
                                        className={gClasses.M3}
                                    >
                                        <Thumbnail
                                            size={EThumbnailSize.xxs}
                                            backgroundColor={panelProps?.color}
                                            showIcon
                                            icon={panelProps?.icon}
                                            title={t(STEP_LABELS[stepType])}
                                            id={stepType}
                                        />
                                        <Tooltip
                                            id={stepType}
                                            content={t(STEP_LABELS[stepType])}
                                            isCustomToolTip
                                            outerClass={cx(gClasses.OpacityFull, styles.ArrowClass)}
                                        />
                                    </div>
                                );
                            })
                        }
                    </Panel>
                    <Panel position="bottom-right" className={styles.ControlPanelIcon}>
                        {
                            FLOW_CONTROL_PANELS.map((data) => (
                                <div
                                    key={data.ID}
                                    className={cx(gClasses.M3, styles.ControlPanelIconHover)}
                                    title={data.TITLE}
                                    onClick={() => controlPanelClicked(data.ID)}
                                    role="button"
                                    tabIndex={0}
                                    onKeyDown={() => {}}
                                >
                                    <Thumbnail
                                        size={EThumbnailSize.xs}
                                        showIcon
                                        icon={data.ICON}
                                        title={data.TITLE}
                                    />
                                </div>
                            ))
                        }
                    </Panel>
                </ReactFlow>
            </div>
        </>
    );
}

function FlowComponentWithWrapper(props) {
    return (
        <ReactFlowProvider>
            <FlowComponent {...props} />
        </ReactFlowProvider>
    );
}
export default FlowComponentWithWrapper;
